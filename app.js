
var BASE = location.pathname.indexOf("/portal1") === 0 ? "/portal1" : "";
var CASE = "jurospain-case-v2";
var ANSWERS = "jurospain-answers-v2";
function read(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function file() { return read(CASE); }
function answers() { return read(ANSWERS) || {}; }

var checkout = document.getElementById("checkout");
if (checkout) bootPay();
var decide = document.getElementById("decide");
if (decide) bootDecide();
var profile = document.getElementById("profile");
if (profile) bootProfile();
var desk = document.getElementById("desk");
if (desk) bootDesk();

function bootPay() {
  var offer = new URLSearchParams(location.search).get("offer");
  var catalog = {
    monthly: { price: "€300.00", name: "Monthly desk", line: "Consular only. No UGE-CE. Three months minimum." },
    prepaid: { price: "€600.00", name: "Three months", line: "Paid once. Includes UGE-CE if you are already in Spain." },
    translation: { price: "€1.000,00", name: "Sworn translations", line: "EN → ES, every document in the case, once the packet is 100%." },
    filing: { price: "€200.00", name: "We submit the file", line: "Lodging after translation is on the case." }
  };
  var picked = catalog[offer] || catalog.prepaid;
  var price = picked.price;
  var name = picked.name;
  var line = picked.line;
  checkout.innerHTML = '<div class="grid2" style="grid-template-columns:1.1fr .9fr"><form class="card" id="pay"><p class="kicker">Checkout</p><h1 style="font-size:40px;margin:8px 0">' + name + '</h1><p class="muted">' + line + '</p>'
    + field("Name on card", "text", "cc-name") + field("Email for the receipt", "email", "email") + field("Card number", "text", "cc-number")
    + '<div class="grid2" style="grid-template-columns:1fr 1fr">' + field("Expiry", "text", "cc-exp") + field("CVC", "text", "cc-csc") + '</div>'
    + '<button class="btn" style="margin-top:8px;width:100%">Pay ' + price + '</button><p class="muted">Stripe is not connected. This card is not charged. Continuing opens your details.</p></form>'
    + '<aside class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;font-size:12px">ORDER</p><h2 style="font-size:30px">' + name + '</h2><p class="gold" style="font-family:Oswald,sans-serif;font-size:28px">Due today ' + price + '</p><p style="opacity:.75">Both visas. Your name, the route, and where you will live, then the file.</p></aside></div>';
  document.getElementById("pay").onsubmit = function (e) { e.preventDefault(); location.href = BASE + "/profile/"; };
}
function field(label, type, ac) {
  return '<label style="display:block;margin:10px 0"><span class="lbl">' + label + '</span><input required type="' + type + '" autocomplete="' + ac + '"></label>';
}

function bootDecide() {
  var state = { who: "", what: "", where: "" };
  function draw() {
    decide.innerHTML = ask("Who is applying?", [["third", "A national of a country outside the EU, EEA and Switzerland"], ["eu", "An EU, EEA or Swiss national"]], state.who, "who")
      + (state.who === "third" ? ask("What will you do in Spain?", [["remote", "Remote work for companies outside Spain"], ["means", "Live on my own means, without working"], ["other", "Something else"]], state.what, "what") : "")
      + ((state.what === "remote" || state.what === "means") ? ask("Where are you now?", [["abroad", "Outside Spain"], ["spain", "Already lawfully in Spain"]], state.where, "where") : "")
      + out();
    decide.querySelectorAll("button[data-k]").forEach(function (b) {
      b.onclick = function () { state[b.getAttribute("data-k")] = b.getAttribute("data-v"); draw(); };
    });
  }
  function ask(legend, opts, cur, key) {
    return '<fieldset style="border:0;padding:0;margin:0 0 16px"><legend style="font-family:Oswald,sans-serif;font-size:22px">' + legend + '</legend><div style="display:grid;gap:8px;margin-top:8px">'
      + opts.map(function (o) { return '<button type="button" data-k="' + key + '" data-v="' + o[0] + '" class="btn ' + (cur === o[0] ? "on" : "ghost") + '" style="justify-content:flex-start">' + o[1] + '</button>'; }).join("")
      + '</div></fieldset>';
  }
  function out() {
    if (state.who === "eu") return '<p>This desk does not apply. EU, EEA and Swiss nationals use the Union regime.</p>';
    if (state.what === "other") return '<p>Entrepreneur, student and arraigo permits are outside this desk.</p>';
    if (state.what === "means" && state.where === "spain") return '<p>Non-lucrative residence is filed from your country of origin, not from inside Spain.</p>';
    if (!state.where || (state.what !== "remote" && state.what !== "means")) return "";
    return '<aside class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;font-size:12px">YOUR ROUTE</p><h2 style="font-size:28px">' + routeName(draft()) + '</h2><p>Next, your name and where you are going. Then the documents, in the order a file is built.</p><p><button class="btn gold" id="next">Continue to your details</button></p></aside>';
  }
  function draft() {
    return { track: state.what === "remote" ? "digital-nomad" : "non-lucrative", route: state.where === "spain" ? "uge" : "consulate" };
  }
  draw();
  decide.addEventListener("click", function (e) {
    if (e.target.id !== "next") return;
    var d = draft();
    var prev = file() || {};
    localStorage.setItem(CASE, JSON.stringify({ track: d.track, route: d.route, name: prev.name || "", email: prev.email || "", city: prev.city || "", country: prev.country || "" }));
    location.href = BASE + "/profile/";
  });
}

function bootProfile() {
  var f = file();
  if (!f) { location.href = BASE + "/decide/"; return; }
  profile.innerHTML = '<p class="kicker">After the price · before the file</p>'
    + '<h1 style="font-size:50px;margin-top:8px">Who is moving, and where.</h1>'
    + '<p class="lede">This sits above the file. The desk uses it so every check knows whose documents these are. You can change it later.</p>'
    + '<form class="card" id="who" style="max-width:640px;margin-top:18px">'
    + '<p class="kicker">' + routeName(f) + '</p>'
    + field("Your name", "text", "name") + field("Email", "email", "email")
    + '<div class="grid2" style="grid-template-columns:1fr 1fr">' + field("City you are heading to", "text", "address-level2") + field("Country you are filing from", "text", "country-name") + '</div>'
    + '<button class="btn" style="margin-top:6px">Open my file</button></form>';
  var inputs = profile.querySelectorAll("input");
  inputs[0].value = f.name || "";
  inputs[1].value = f.email || "";
  inputs[2].value = f.city || "";
  inputs[3].value = f.country || "";
  profile.querySelector("form").onsubmit = function (e) {
    e.preventDefault();
    f.name = inputs[0].value.trim();
    f.email = inputs[1].value.trim();
    f.city = inputs[2].value.trim();
    f.country = inputs[3].value.trim();
    localStorage.setItem(CASE, JSON.stringify(f));
    location.href = BASE + "/desk/";
  };
}

function bootDesk() {
  var f = file();
  if (!f || !f.name) { location.href = BASE + "/profile/"; return; }
  var who = document.getElementById("who");
  if (who) who.textContent = f.name;
  var items = packet(f);
  var saved = answers();
  var aligned = items.filter(function (i) { return saved[i.id] && saved[i.id].verdict === "looks-aligned"; }).length;
  var checked = items.filter(function (i) { return saved[i.id]; }).length;
  var pct = items.length ? Math.round(aligned / items.length * 100) : 0;
  var complete = pct === 100;
  desk.innerHTML = '<div class="grid2" style="grid-template-columns:minmax(0,1fr) 320px;gap:0">'
    + '<div style="padding-right:20px"><p class="kicker">🇪🇸 Spain · ' + routeName(f) + ' · Main applicant</p>'
    + '<h1 style="font-size:42px;margin:6px 0">' + f.name + '</h1>'
    + '<p class="muted">Upload each scan. The AI checker reads it against the packet note — names, dates, apostille, formula. It does not lodge the file.</p>'
    + '<ol style="list-style:none;padding:0">' + items.map(function (item, n) { return card(n, item, saved[item.id]); }).join("") + '</ol></div>'
    + '<aside class="ink" style="border-radius:0;min-height:100%">'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700">STATUS</p>'
    + '<p class="gold" style="font-family:Oswald,sans-serif;font-size:48px;margin:4px 0">' + pct + '%</p>'
    + '<div style="height:8px;background:rgba(255,255,255,.12);border-radius:99px"><div style="height:100%;width:' + pct + '%;background:var(--gold);border-radius:99px"></div></div>'
    + '<p style="opacity:.7;font-size:13px">' + aligned + ' aligned · ' + checked + ' checked · ' + (items.length - aligned) + ' open</p>'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700;margin-top:22px">✦ AI CHECKER</p>'
    + '<p style="opacity:.8;font-size:14px">First pass in about a second. Dummy until a vision key is connected.</p>'
    + '<ol style="padding-left:18px;font-size:14px;opacity:.9"><li>Document type and legibility</li><li>Names and dates match the packet note</li><li>Issue date inside the validity window</li><li>Apostille or legalisation present</li><li>Sworn translation required or not</li><li>Funds against the current formula</li></ol>'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700;margin-top:22px">FILE NOTES</p>'
    + '<p style="opacity:.8;font-size:14px">Monthly plans do not include UGE-CE. Prepaid does. Nothing is lodged until you buy the €200 submit add-on.</p>'
    + '<div style="background:var(--gold);color:var(--ink);border-radius:16px;padding:16px;margin-top:18px">'
    + '<p style="letter-spacing:.12em;font-size:11px;font-weight:700;margin:0">WHEN THE FILE IS 100%</p>'
    + '<p style="margin:10px 0 4px"><b>Sworn translations · €1.000</b><br><span style="font-size:13px">EN → ES, every document in this case.</span></p>'
    + (complete ? '<a class="btn on" href="' + BASE + '/checkout/?offer=translation">Add to this file</a>' : '<p style="font-size:13px;margin:0">Finish every item first.</p>')
    + '<p style="margin:14px 0 4px"><b>We submit the file · €200</b><br><span style="font-size:13px">Lodging after translation is on the case.</span></p>'
    + (complete ? '<a class="btn on" href="' + BASE + '/checkout/?offer=filing">Add to this file</a>' : '<p style="font-size:13px;margin:0">Needs the €1.000 translation first.</p>')
    + '</div></aside></div>';
  desk.querySelectorAll("[data-check]").forEach(function (b) { b.onclick = function () { run(b); }; });
}
function row(k, v) { return "<dt>" + k + "</dt><dd>" + v + "</dd>"; }
function card(n, item, saved) {
  var lines = (saved && saved.lines) || [];
  var found = lines.map(function (l) {
    return '<li class="' + (l.hit ? "ok" : "miss") + '">' + (l.hit ? "Found" : "Missing") + " — " + l.label + "</li>";
  }).join("");
  return '<li><article class="card" id="item-' + item.id + '" data-id="' + item.id + '" style="margin-top:14px">'
    + '<div style="display:flex;justify-content:space-between"><span class="muted" style="font-family:monospace">' + String(n + 1).padStart(2, "0") + '</span><span class="pill">' + (saved ? saved.pill : "Not checked") + '</span></div>'
    + '<h2 style="font-size:26px;margin-top:4px">' + item.label + '</h2>'
    + '<p>' + item.what + '</p>'
    + '<p><b>File this.</b> ' + item.file + '</p>'
    + '<p class="muted"><b>The check looks for</b> ' + item.looks.map(function (l) { return l.label.toLowerCase(); }).join(", ") + '.</p>'
    + '<label style="display:block;margin-top:8px"><span class="lbl">What is on the document</span><textarea rows="3" placeholder="' + item.ph + '">' + ((saved && saved.text) || "") + '</textarea></label>'
    + '<div class="scan ink" hidden style="margin-top:10px"><div style="display:flex;justify-content:space-between"><b class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.12em;font-size:12px">✦ AI CHECKER</b><b class="gold pct">8%</b></div><div style="height:6px;background:rgba(255,255,255,.15);border-radius:99px;margin-top:8px"><div class="bar" style="height:100%;width:8%;background:var(--gold)"></div></div><p class="looking" style="opacity:.8;font-size:14px"></p></div>'
    + '<button data-check class="btn" style="margin-top:10px">Run AI checker</button>'
    + (found ? '<ul style="margin:10px 0 0;padding-left:18px">' + found + '</ul>' : "")
    + '</article></li>';
}
function run(btn) {
  var cardEl = btn.closest("article");
  var id = cardEl.getAttribute("data-id");
  var item = packet(file()).find(function (i) { return i.id === id; });
  var scan = cardEl.querySelector(".scan");
  var looking = cardEl.querySelector(".looking");
  scan.hidden = false;
  var step = 0;
  looking.textContent = "Looking for " + item.looks[0].label.toLowerCase() + ".";
  var n = 8;
  var timer = setInterval(function () {
    n = Math.min(92, n + 5);
    cardEl.querySelector(".bar").style.width = n + "%";
    cardEl.querySelector(".pct").textContent = n + "%";
    var idx = Math.min(item.looks.length - 1, Math.floor(n / 30));
    if (idx !== step) { step = idx; looking.textContent = "Looking for " + item.looks[idx].label.toLowerCase() + "."; }
  }, 90);
  setTimeout(function () {
    clearInterval(timer);
    var text = cardEl.querySelector("textarea").value.toLowerCase();
    var lines = item.looks.map(function (l) { return { label: l.label, hit: l.words.some(function (w) { return text.indexOf(w) >= 0; }) }; });
    var hits = lines.filter(function (l) { return l.hit; }).length;
    var weight = hits;
    var verdict = hits === lines.length ? "looks-aligned" : hits ? "check" : "missing";
    var pill = verdict === "looks-aligned" ? "Looks aligned" : verdict === "check" ? "Part missing" : "Does not match";
    var all = answers();
    all[id] = { text: cardEl.querySelector("textarea").value, verdict: verdict, pill: pill, weight: weight, lines: lines };
    localStorage.setItem(ANSWERS, JSON.stringify(all));
    bootDesk();
    var back = document.getElementById("item-" + id);
    if (back) back.scrollIntoView({ block: "center" });
  }, 1500);
}

function routeName(f) {
  if (f.track === "non-lucrative") return "Non-lucrative · from origin";
  return f.route === "uge" ? "Digital nomad · already in Spain" : "Digital nomad · from abroad";
}
function look(label, words) { return { label: label, words: words }; }
function doc(id, label, what, fileThis, ph, looks) { return { id: id, label: label, what: what, file: fileThis, ph: ph, looks: looks }; }

function packet(f) {
  var shared = [
    doc("passport", "Passport", "The identity the whole file hangs on. A copy of every page, and the original at the appointment.", "A full colour copy. For non-lucrative, at least one year of validity must remain.", "Passport, British, expiry 14 June 2030",
      [look("the word passport", ["passport", "pasaporte"]), look("an expiry date", ["expiry", "expires", "caduc"]), look("a nationality", ["british", "american", "nationality", "nacionalidad"])]),
    doc("funds", "Means", f.track === "non-lucrative" ? "Enough to live on without working. 400% of IPREM a month for you, 100% more for each family member, times the months you ask for." : "Remote income at 200% of SMI for you, 75% for the first family member, 25% after that. The euro figure is an illustration.", "The contract or the bank evidence that shows the amount, and that you can actually use it.", "Balance €40,000, covers twelve months",
      [look("a bank or a salary", ["bank", "banco", "salary", "salario", "income"]), look("an amount", ["€", "eur", "euro"]), look("the period it covers", ["month", "meses", "twelve", "12"])]),
  ];
  if (f.track === "non-lucrative") return [
    doc("form", "EX-01, signed", "The official application. Download it only from the modelos page.", "EX-01, completed and signed by you.", "EX-01 completed and signed",
      [look("the form name", ["ex-01", "ex01"]), look("a signature", ["signed", "firmado"])]),
    shared[0],
    doc("criminal", "Criminal record, five years", "No record, for offences under Spanish law, in the countries you lived in for the last five years. This is a different packet from the digital nomad one.", "Certificates covering those five years, from every country of residence.", "Criminal record, last five years, UK",
      [look("a criminal-record certificate", ["criminal", "antecedentes"]), look("five years of cover", ["five", "5 year", "cinco"])]),
    shared[1],
    doc("bank", "Foreign bank letter", "A foreign account has to be identified. A screenshot of an app is not enough.", "Bank name and address, full account number, opening date, the 31 December balance, and last year’s average.", "Bank letter, 31 December balance, average balance",
      [look("the bank’s name", ["bank", "banco"]), look("the 31 December balance", ["31 december", "31 de diciembre", "december"]), look("the average balance", ["average", "media"])]),
    doc("insurance", "Sickness insurance", "Cover for illness with an insurer allowed to operate in Spain, or public cover.", "A certificate naming you. Travel insurance does not count.", "Adeslas sickness policy, no copay",
      [look("an insurer", ["insurance", "seguro", "policy"]), look("sickness cover, not travel", ["sickness", "enfermedad", "health"])]),
    doc("medical", "Medical certificate", "A doctor’s statement that you have no disease with serious public-health consequences under the International Health Regulations 2005.", "That certificate, recent enough for the consulate.", "Medical certificate, International Health Regulations",
      [look("a medical certificate", ["medical", "médico", "medico"]), look("the health regulations", ["health", "ihr", "regulations"])]),
    doc("fee", "Fees", "Two payments: the residence fee, and the consulate’s own visa fee.", "Modelo 790 code 052, heading 2.1.1, plus the consular receipt. Read the live amount on the day you pay.", "790-052 paid, plus visa fee receipt",
      [look("modelo 790 code 052", ["790", "052"]), look("a receipt", ["receipt", "recibo", "paid"])]),
    doc("translation", "Sworn translation", "A foreign public document is translated into Spanish by a sworn translator. The apostille, if the document needs one, is the consulate’s step — this desk does not weigh it.", "The sworn translation, filed behind the document it translates.", "Sworn Spanish translation attached",
      [look("a sworn translation", ["sworn", "jurada"]), look("Spanish as the language", ["spanish", "español", "espanol"])]),
  ];
  var abroad = f.route !== "uge";
  return [
    abroad
      ? doc("form", "National visa form, signed", "The consulate’s own visa form, signed by the person who will telework. EX-01 belongs to the other visa.", "The current national visa form, completed and signed.", "National visa form, signed 12 March 2026",
          [look("a visa form", ["visa", "visado"]), look("a signature", ["signed", "firmado"])])
      : doc("form", "MI-T, signed", "The holder’s form for the electronic residence. Family members use MI-F, one each.", "MI-T from Plataforma ONE, completed and signed.", "MI-T signed 4 May 2026",
          [look("form MI-T", ["mi-t", "mit"]), look("a signature", ["signed", "firmado"])]),
    shared[0],
    doc("company", "The company has traded for a year", "The foreign company has been really active for at least a year.", "A companies-register certificate with the incorporation date and the activity.", "Register certificate, incorporated 2019",
      [look("a register certificate", ["register", "registro", "company"]), look("at least a year of activity", ["year", "2019", "2020", "2021", "2022", "2023", "2024"])]),
    doc("remote", "Three months, and permission to work from Spain", "The job or the client relationship is at least three months old, and they allow the work from Spain.", "Employed: a letter with seniority, salary and remote permission. Freelance: contracts or invoices covering three months.", "Employer letter, remote from Spain, three months",
      [look("remote permission", ["remote", "remoto"]), look("three months", ["three", "3 month", "tres"])]),
    doc("degree", "Qualification, or three years doing the work", "A recognised degree, or three years in the same kind of role.", "The diploma, or evidence of the three years.", "University degree, three years as an engineer",
      [look("a qualification or experience", ["degree", "university", "experience", "years"])]),
    shared[1],
    doc("criminal", "Criminal record, two years, plus a declaration", "Certificates for the countries of the last two years, and a sworn declaration covering five. Do not use the non-lucrative five-year packet here.", "The certificates and the declaration.", "Criminal record certificate plus five-year declaration",
      [look("a criminal-record certificate", ["criminal", "antecedentes"]), look("the five-year declaration", ["declaration", "five"])]),
    doc("insurance", "Sickness insurance that actually covers you", "Public cover, or a private policy with an insurer allowed in Spain. Travel insurance, reimbursement-only, a waiting period and a co-pay all fail.", "The certificate of cover.", "Sanitas sickness policy, no copay, no waiting period",
      [look("an insurer", ["insurance", "seguro", "policy"]), look("full sickness cover", ["sickness", "no copay", "no waiting"])]),
    doc("ss", "Social Security", "Either you stay covered at home under a bilateral agreement, or the foreign employer will register in Spanish Social Security before the work starts.", "An A1 or coverage certificate, or the alta commitment.", "A1 coverage certificate",
      [look("social security cover", ["social security", "seguridad social", "a1"])]),
    abroad
      ? doc("fee", "Consular visa fee", "The fee that post charges on the day you file. Do not copy a number from an old PDF.", "The consulate’s receipt.", "Visa fee receipt, paid 2 April 2026",
          [look("a receipt", ["receipt", "recibo", "paid", "fee"])])
      : doc("fee", "Tasa 038, with the NRC", "Paid before the electronic file is opened. The NRC is what you type into the upload.", "Proof of payment and the Número de Referencia Completo.", "Tasa 038 paid, NRC kept",
          [look("tasa 038", ["038"]), look("the NRC", ["nrc"])]),
    doc("translation", "Sworn translation", "Foreign public documents are translated into Spanish by a sworn translator. Whether a document also needs an apostille is the consulate’s step, and this desk does not weigh it.", "The sworn translation, filed behind its document.", "Sworn Spanish translation attached",
      [look("a sworn translation", ["sworn", "jurada"]), look("Spanish as the language", ["spanish", "español"])]),
  ];
}
