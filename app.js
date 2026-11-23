
var BASE = location.pathname.indexOf("/portal1") === 0 ? "/portal1" : "";
var CASE = "jurospain-case-v2";
var ANSWERS = "jurospain-answers-v2";
function read(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
function file() { return read(CASE); }
function answers() { return read(ANSWERS) || {}; }

var checkout = document.getElementById("checkout");
if (checkout) bootPay();
document.querySelectorAll("[data-doc]").forEach(bootDoc);
var decide = document.getElementById("decide");
if (decide) bootDecide();
var profile = document.getElementById("profile");
if (profile) bootProfile();
var desk = document.getElementById("desk");
if (desk) bootDesk();
var templates = document.getElementById("templates");
if (templates) bootTemplates();
var app = document.getElementById("app");
if (app) bootApp();
var welcome = document.getElementById("welcome");
if (welcome) bootWelcome();
var service = document.getElementById("service");
if (service) bootService();

function bootApp() {
  var params = new URLSearchParams(location.search);
  var step = params.get("step") || "visa";
  if (step === "visa") {
    app.innerHTML = stage("Start a file", "Which residence are you filing?",
      '<div style="display:grid;gap:10px"><a class="btn" href="' + BASE + '/app/?step=pay&track=digital-nomad">Digital nomad</a><a class="btn ghost" href="' + BASE + '/app/?step=pay&track=non-lucrative">Non-lucrative</a></div>'
      + '<p class="muted" style="margin-top:14px">Digital nomad is remote work for companies outside Spain. Non-lucrative is residence without working, filed from your country.</p>');
    return;
  }
  var track = params.get("track") === "non-lucrative" ? "non-lucrative" : "digital-nomad";
  localStorage.setItem(CASE, JSON.stringify(Object.assign(file() || {}, { track: track, route: "consulate" })));
  location.href = BASE + "/checkout/?offer=prepaid";
}
function bootWelcome() {
  var nlv = file() && file().track === "non-lucrative";
  var steps = nlv
    ? ["Opening the non-lucrative folders", "Setting aside EX-01", "Noting the five-year criminal record", "Preparing your file"]
    : ["Opening the digital nomad folders", "Setting aside the visa form and MI-T", "Noting the one-year company rule", "Preparing your file"];
  welcome.innerHTML = '<div class="stage"><div class="build"><p class="kicker" style="color:var(--gold)">Building your file</p><h1>One moment.</h1><div class="barline"><i id="build-bar"></i></div><ol id="build-steps" style="list-style:none;padding:0;margin:0">'
    + steps.map(function (s) { return '<li>' + s + '<span>···</span></li>'; }).join("") + '</ol></div></div>';
  var items = welcome.querySelectorAll("li");
  var n = 0;
  var timer = setInterval(function () {
    if (n < items.length) items[n].className = "on";
    n += 1;
    document.getElementById("build-bar").style.width = Math.min(100, n * 25) + "%";
    if (n > items.length) {
      clearInterval(timer);
      var next = new URLSearchParams(location.search).get("next") || "desk";
      setTimeout(function () { location.href = BASE + (next === "intake" ? "/profile/?intake=1" : "/desk/"); }, 600);
    }
  }, 700);
}
function stage(kicker, title, body) {
  return '<div class="stage"><div class="card"><p class="kicker">' + kicker + '</p><h1 style="font-size:36px;margin:8px 0 16px">' + title + '</h1>' + body + '</div></div>';
}
function bootService() {
  var id = new URLSearchParams(location.search).get("service");
  if (!id) {
    service.innerHTML = '<p class="kicker">Add-ons</p><h1 style="font-size:46px;margin:6px 0 8px">Add to the file, when you want.</h1><p class="lede">None of these are included in the desk. Each one has its own payment, and none of them is an approval.</p><div class="grid2" style="grid-template-columns:1fr 1fr;margin-top:18px">' + serviceCards() + '</div>';
    return;
  }
  var pages = {
    consult: ["Video consult", "€100", "One hour, on a video call.", "You bring the file, even if nothing is uploaded. The person on the call walks the route you picked: which door, which documents, and what the consulate or UGE-CE will actually ask for. It is a conversation. Nothing is lodged, and it is not an approval.", ["Scheduled after you pay.", "Your file open on the call.", "Does not include translation, apostille, or lodging."]],
    review: ["File review", "€150", "A person reads the assembled file.", "Before you lodge, someone reads every item against the packet and writes what is still missing, in the order a post would notice it. The AI reading does not do this. A review is a list, not a grant.", ["One pass over the file you have built.", "Written notes on what is missing.", "You still lodge it yourself, unless you add lodging."]],
    apostille: ["Apostille", "€40", "Per foreign public document.", "A foreign public document needs an apostille under the Hague Convention, or a consular legalisation where the country is outside it, before the sworn translation. This arranges that step. It does not translate the document, and it does not decide whether your country is in the Convention.", ["One document per €40.", "The sworn translation is a separate €1.000 for the case.", "Filed behind the document it belongs to."]],
    tie: ["TIE appointment", "€75", "The police card, after you land.", "The visa is not the TIE. Digital nomad: the card is due only if the authorisation lasts more than six months. Non-lucrative: within a month of entry. This books the cita and lists what to take. It does not attend for you.", ["The appointment, booked.", "The list of what the police unit asks for.", "You attend in person."]]
  };
  var page = pages[id] || pages.consult;
  service.innerHTML = '<p class="kicker">Add to this file</p><h1 style="font-size:48px;margin:6px 0">' + page[0] + '</h1>'
    + '<p style="font-family:Oswald,sans-serif;font-size:42px;color:var(--red);margin:0">' + page[1] + '</p><p class="muted">' + page[2] + '</p>'
    + '<p style="max-width:640px">' + page[3] + '</p>'
    + '<ul>' + page[4].map(function (line) { return '<li>' + line + '</li>'; }).join("") + '</ul>'
    + '<p><a class="btn" href="' + BASE + '/checkout/?offer=' + id + '">Continue to payment</a> <a class="btn ghost" href="' + BASE + '/desk/">Back to the file</a></p>';
}
function bootPay() {
  var offer = new URLSearchParams(location.search).get("offer");
  var catalog = {
    monthly: { price: "€300.00", name: "Monthly desk", line: "Consular only. No UGE-CE. Three months minimum." },
    prepaid: { price: "€600.00", name: "Three months", line: "Paid once. Includes UGE-CE if you are already in Spain." },
    translation: { price: "€1.000,00", name: "Sworn translations", line: "EN → ES, every document in the case, once the packet is 100%." },
    filing: { price: "€200.00", name: "We submit the file", line: "Lodging after translation is on the case." },
    consult: { price: "€100.00", name: "Video consult", line: "One hour on a video call. A conversation about your case. Nothing is lodged." },
    review: { price: "€150.00", name: "File review", line: "One hour. A person reads the assembled file and writes what is missing." },
    apostille: { price: "€40.00", name: "Apostille", line: "Per foreign public document. Legalisation where the Hague Convention does not apply." },
    tie: { price: "€75.00", name: "TIE appointment", line: "The police card, booked after you land. Not the visa." },
    whitelabel: { price: "€2.000,00", name: "Whitelabel", line: "A month, for a firm offering the desk to its own clients. Your logo, unlimited cases." }
  };
  var picked = catalog[offer] || catalog.prepaid;
  var price = picked.price;
  var name = picked.name;
  var line = picked.line;
  checkout.innerHTML = '<div><form id="pay"><p class="kicker" style="text-align:center">Checkout</p><h1 style="font-size:36px;margin:8px 0;text-align:center">' + name + '</h1><p class="muted" style="text-align:center">' + line + '</p><p class="gold" style="font-family:Oswald,sans-serif;font-size:32px;text-align:center;margin:8px 0 4px">' + price + '</p>'
    + field("Name on card", "text", "cc-name") + field("Email for the receipt", "email", "email") + field("Card number", "text", "cc-number")
    + '<div class="grid2" style="grid-template-columns:1fr 1fr">' + field("Expiry", "text", "cc-exp") + field("CVC", "text", "cc-csc") + '</div>'
    + '<button class="btn" style="margin-top:16px;width:100%">Pay ' + price + '</button>'
    + '<p class="muted" style="text-align:center;font-size:13px">Stripe is not connected. This card is not charged. The fields stay for when it is.</p></form></div>';
  document.getElementById("pay").onsubmit = function (e) {
    e.preventDefault();
    var email = checkout.querySelector("input[autocomplete=email]");
    if (email && email.value) localStorage.setItem("jurospain-email", email.value.trim());
    location.href = BASE + "/welcome/?next=intake";
  };
}
function field(label, type, ac) {
  return '<label style="display:block;margin:10px 0"><span class="lbl">' + label + '</span><input type="' + type + '" autocomplete="' + ac + '"></label>';
}
function skipRow(href, label) {
  return '<p style="margin:14px 0 0"><a class="btn ghost" href="' + href + '">' + label + '</a></p>';
}
function bootDoc(el) {
  var id = el.getAttribute("data-doc");
  var saved = answers()[id];
  var name = (saved && saved.fileName) || "PDF or photo. Nothing is sent yet.";
  el.innerHTML = '<label class="upload" style="display:flex;align-items:center;gap:10px;margin-top:12px"><input data-file type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*" style="position:absolute;width:1px;height:1px;opacity:0"><span class="btn ghost">Upload document</span><span class="file-name muted">' + name + '</span></label>';
  var input = el.querySelector("[data-file]");
  input.onchange = function () {
    var picked = input.files && input.files[0];
    if (!picked) return;
    var all = answers();
    var prev = all[id] || {};
    prev.fileName = picked.name;
    all[id] = prev;
    localStorage.setItem(ANSWERS, JSON.stringify(all));
    el.querySelector(".file-name").textContent = picked.name;
  };
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
    if (state.who === "eu") return '<p>This desk does not apply. EU, EEA and Swiss nationals use the Union regime.</p>' + skipRow(BASE + "/profile/", "Continue anyway");
    if (state.what === "other") return '<p>Entrepreneur, student and arraigo permits are outside this desk.</p>' + skipRow(BASE + "/profile/", "Continue anyway");
    if (state.what === "means" && state.where === "spain") return '<p>Non-lucrative residence is filed from your country of origin, not from inside Spain.</p>' + skipRow(BASE + "/profile/", "Continue anyway");
    if (!state.where || (state.what !== "remote" && state.what !== "means")) return skipRow(BASE + "/profile/", "Skip and continue");
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
  var f = file() || { track: "digital-nomad", route: "consulate", name: "", email: "", city: "", country: "" };
  var intake = new URLSearchParams(location.search).get("intake") === "1";
  profile.innerHTML = '<div class="intake">'
    + '<div class="intake-head"><p class="gold" style="letter-spacing:.16em;font-size:12px;font-weight:700">' + (intake ? "YOUR FILE IS READY" : "YOUR DETAILS") + '</p>'
    + '<h1>' + (intake ? "Tell us who this file is for." : "Who is moving, and where.") + '</h1>'
    + '<p>' + (intake ? "Five answers and the folders open. You can change any of them later." : "The desk uses this so every check knows whose documents these are.") + '</p></div>'
    + '<form class="intake-card" id="who">'
    + '<div class="intake-route"><span class="spark">✦</span><div><b>' + routeName(f) + '</b><small>One residence per file. The other one is a new file, started from sign-in.</small></div></div>'
    + '<ol class="intake-steps"><li class="on">Visa</li><li class="on">Payment</li><li class="now">You</li><li>File</li></ol>'
    + field("Your name", "text", "name") + field("Email", "email", "email")
    + '<div class="grid2" style="grid-template-columns:1fr 1fr">' + field("City you are heading to", "text", "address-level2") + field("Country you are filing from", "text", "country-name") + '</div>'
    + (intake ? '<label style="display:block;margin:10px 0"><span class="lbl">Family coming with you</span><select data-k="family"><option value="no">Just me</option><option value="yes">Yes, family members</option></select></label>' : "")
    + '<button class="btn" style="margin-top:10px;width:100%">' + (intake ? "Open my file" : "Save") + '</button>'
    + '<p class="intake-skip"><a href="' + BASE + '/desk/">Skip and open the file</a> · the fields stay, and skipping does not delete what you already typed.</p>'
    + '</form></div>';
  var inputs = profile.querySelectorAll("input");
  inputs[0].value = f.name || "";
  inputs[1].value = f.email || localStorage.getItem("jurospain-email") || "";
  inputs[2].value = f.city || "";
  inputs[3].value = f.country || "";
  profile.querySelector("form").onsubmit = function (e) {
    e.preventDefault();
    f.name = inputs[0].value.trim();
    f.email = inputs[1].value.trim();
    f.city = inputs[2].value.trim();
    f.country = inputs[3].value.trim();
    var family = profile.querySelector("[data-k=family]");
    if (family) f.family = family.value;
    localStorage.setItem(CASE, JSON.stringify(f));
    location.href = BASE + "/desk/";
  };
}

function bootDesk() {
  var f = ensureCase();
  var who = document.getElementById("who");
  if (who) who.textContent = f.name || "Not filled in yet";
  var groups = packet(f);
  var items = flat(groups);
  var saved = answers();
  var attached = items.filter(function (i) { return saved[i.id] && saved[i.id].fileName; }).length;
  var openId = new URLSearchParams(location.search).get("folder") || groups[0].id;
  var open = groups.filter(function (g) { return g.id === openId; })[0] || groups[0];
  desk.innerHTML = '<div class="desk">'
    + '<div><p class="kicker">🇪🇸 Spain · ' + routeName(f) + '</p>'
    + '<h1 style="font-size:42px;margin:6px 0">' + (f.name || "Your file") + '</h1>'
    + '<p style="font-weight:600">Documents. ' + attached + ' of ' + items.length + ' attached. Nothing has been sent.' + (f.family === "yes" ? " Family is on this file." : "") + '</p>'
    + '<p class="muted">One residence per file. The other one is a new file, started from sign-in.</p>'
    + phases(f, attached, items.length)
    + '<div class="folders">' + groups.map(function (g) { return folderRow(g, saved, g.id === open.id); }).join("") + '</div>'
    + '<section class="card" style="margin-top:18px"><p class="kicker">' + open.label + '</p><h2 style="font-size:28px;margin:4px 0">' + open.note + '</h2>'
    + '<ol style="list-style:none;padding:0">' + open.items.map(function (item, n) { return card(n, item, saved[item.id]); }).join("") + '</ol></section></div>'
    + '<aside class="desk-rail"><div class="rail-ink">'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700">WHERE THIS FILE IS</p>'
    + '<p class="gold" style="font-family:Oswald,sans-serif;font-size:56px;line-height:1;margin:6px 0">' + attached + '<span style="font-size:22px;color:#fff">/' + items.length + '</span></p>'
    + '<p>attached. Nothing has been sent.</p>'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700;margin-top:22px">THE CLOCK</p>'
    + '<p style="font-size:14px;opacity:.85">' + datesFor(f) + '</p>'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700;margin-top:22px">AI READING · DUMMY</p>'
    + '<p style="font-size:14px;opacity:.85">' + aiNote(f) + '</p>'
    + '<p style="font-size:13px;opacity:.6">It reads what you typed, not the scan. A vision key is not connected.</p>'
    + '<p class="gold" style="letter-spacing:.16em;font-size:11px;font-weight:700;margin-top:22px">DO THIS NEXT</p>'
    + '<ol class="guide">' + guideFor(f, open).map(function (line) { return '<li>' + line + '</li>'; }).join("") + '</ol>'
    + '<button class="btn ink-btn" id="ai-report" style="width:100%;margin-top:18px"><span class="spark">✦</span> AI check this file</button>'
    + '<div id="ai-out" hidden style="margin-top:14px"></div>'
    + '<p style="font-size:13px;opacity:.6;margin-top:14px">Kept here: your typed notes and the file name. Not kept yet: the scan. Sent to no one until you buy lodging.</p>'
    + '</div></aside></div>'
    + '<section style="grid-column:1 / -1;margin-top:8px"><p class="kicker">Add to this file</p><h2 style="font-size:28px;margin:4px 0 12px">Add-ons, when you want them</h2><div class="grid2" style="grid-template-columns:repeat(4,1fr)">' + serviceCards() + '</div></section></div>';
  fillNav(f);
  var report = document.getElementById("ai-report");
  if (report) report.onclick = function () { runReport(f, groups, saved); };
  desk.querySelectorAll("[data-check]").forEach(function (b) { b.onclick = function () { run(b); }; });
  desk.querySelectorAll("[data-file]").forEach(function (input) {
    input.onchange = function () {
      var picked = input.files && input.files[0];
      if (!picked) return;
      var id = input.closest("article").getAttribute("data-id");
      var all = answers();
      var prev = all[id] || {};
      prev.fileName = picked.name;
      all[id] = prev;
      localStorage.setItem(ANSWERS, JSON.stringify(all));
      var name = input.parentNode.querySelector(".file-name");
      if (name) name.textContent = picked.name;
    };
  });
}
function fillNav(f) {
  var groups = packet(f);
  var openId = new URLSearchParams(location.search).get("folder") || "overview";
  var caseNav = document.getElementById("case-nav");
  if (caseNav) {
    caseNav.innerHTML = '<a class="' + (openId === "overview" ? "on" : "") + '" href="' + BASE + '/desk/">Overview</a>'
      + groups.map(function (g) {
        return '<a class="' + (g.id === openId ? "on" : "") + '" href="' + BASE + '/desk/?folder=' + g.id + '">' + g.label + '</a>';
      }).join("");
  }
  var forms = f.track === "non-lucrative"
    ? [["", "All templates"], ["ex-01", "EX-01"], ["cover", "Cover note"]]
    : [["", "All templates"], ["visa-form", "Visa form"], ["mi-t", "MI-T"], ["criminal-declaration", "Five-year declaration"], ["remote-letter", "Remote-work letter"], ["cover", "Cover note"]];
  var prepare = document.getElementById("prepare-nav");
  if (prepare) {
    prepare.innerHTML = forms.map(function (pair) {
      var href = pair[0] ? BASE + "/templates/?form=" + pair[0] : BASE + "/templates/?track=" + f.track;
      return '<a href="' + href + '">' + pair[1] + '</a>';
    }).join("");
  }
}
function runReport(f, groups, saved) {
  var out = document.getElementById("ai-out");
  out.hidden = false;
  out.innerHTML = '<p class="gold" style="letter-spacing:.14em;font-size:11px;font-weight:700">READING THE FILE</p><p id="ai-line">Opening the folders.</p>';
  var lines = ["Counting what is attached.", "Comparing names against the passport rule.", "Checking the clock for this residence.", "Writing what is still open."];
  var n = 0;
  var timer = setInterval(function () {
    n += 1;
    var line = document.getElementById("ai-line");
    if (line && lines[n - 1]) line.textContent = lines[n - 1];
    if (n >= lines.length) {
      clearInterval(timer);
      out.innerHTML = reportHtml(f, groups, saved);
    }
  }, 500);
}
function reportHtml(f, groups, saved) {
  var missing = [];
  groups.forEach(function (g) {
    g.items.forEach(function (item) {
      if (!saved[item.id] || !saved[item.id].fileName) missing.push(g.label + ": " + item.label);
    });
  });
  var attached = flat(groups).length - missing.length;
  var watch = f.track === "non-lucrative"
    ? "Keep in mind: silence at one month is a refusal, and the five-year certificates cannot be swapped for a declaration."
    : "Keep in mind: the company needs a year of real activity, and the three months with the employer is a separate test.";
  return '<p class="gold" style="letter-spacing:.14em;font-size:11px;font-weight:700">FILE REPORT · MOCK</p>'
    + '<p><b>' + (attached === 0 ? "Just opened." : "Moving.") + '</b> ' + attached + ' attached, ' + missing.length + ' still open. Nothing has been sent.</p>'
    + '<p style="font-size:14px"><b>Still missing</b></p><ul class="guide">' + missing.slice(0, 5).map(function (m) { return '<li>' + m + '</li>'; }).join("") + (missing.length > 5 ? '<li>and ' + (missing.length - 5) + ' more.</li>' : '') + '</ul>'
    + '<p style="font-size:14px">' + watch + '</p>'
    + '<p style="font-size:12px;opacity:.6">A mock reading of the packet. It has not seen your scans.</p>';
}
function aiNote(f) {
  if (f.track === "non-lucrative") return "A five-year criminal certificate cannot be reused from another visa. This residence does not take a declaration instead. A name that does not match the passport is the first thing a post rejects.";
  return "The company register has to show a year of real activity. Three months with the employer is a separate test. A fee copied from an old PDF will not match the amount charged on the day.";
}
function guideFor(f, open) {
  var shared = {
    identity: ["Match every name to the passport, including middle names.", "Scan all four corners, every page, no glare.", "Bring the original to the appointment."],
    means: ["Write the period the money covers, not just the balance.", "An app screenshot is not a bank letter."],
    record: ["One certificate per country you lived in.", "Apostille first, sworn translation behind it."],
    cover: ["Travel insurance does not count.", "The insurer has to be allowed to operate in Spain."],
    fees: ["Read the fee on the day you pay it.", "File the sworn translation behind the document it translates."]
  };
  var extra = f.track === "non-lucrative"
    ? { means: ["400% of IPREM for you, 100% more for each family member, times the months."], record: ["Five years. A declaration does not replace the certificates."] }
    : { work: ["The register date must be at least a year ago.", "The letter needs the role, the pay, and permission to work from Spain."], record: ["Two years of certificates, plus a separate declaration covering five."] };
  return (extra[open.id] || []).concat(shared[open.id] || ["Work the open folder. The next one waits."]);
}
function serviceCards() {
  return [
    ["consult", "Video consult", "€100", "One hour on a call, before you spend money on documents.", "Which door, which documents, and what the post will actually ask for. A conversation, not a filing.", "Book the hour"],
    ["review", "File review", "€150", "A person reads the assembled file and writes what is missing.", "In the order a consulate would notice it. The AI reading does not do this.", "Have it read"],
    ["apostille", "Apostille", "€40", "Per foreign public document, arranged before the sworn translation.", "Hague apostille, or consular legalisation where the Convention does not apply.", "Arrange it"],
    ["tie", "TIE appointment", "€75", "The police card, booked after you land.", "The visa is not the card. Digital nomad only if the grant exceeds six months.", "Book the cita"]
  ].map(function (r) {
    return '<article class="card" style="display:flex;flex-direction:column"><p class="kicker">' + r[2] + '</p><h3 style="font-size:24px;margin:6px 0">' + r[1] + '</h3><p>' + r[3] + '</p><p class="muted" style="font-size:14px">' + r[4] + '</p><a class="btn" style="margin-top:auto" href="' + BASE + '/services/?service=' + r[0] + '">' + r[5] + '</a></article>';
  }).join("");
}
function servicesFor(f) {
  var rows = [
    ["consult", "Video consult", "€100", "One hour on this file."],
    ["review", "File review", "€150", "A person reads what is still missing."],
    ["apostille", "Apostille", "€40", "Per foreign public document."]
  ];
  if (f.track !== "non-lucrative") rows.push(["tie", "TIE appointment", "€75", "Only if the grant exceeds six months."]);
  else rows.push(["tie", "TIE appointment", "€75", "Within a month of entry."]);
  return rows.map(function (r) {
    return '<a class="svc" href="' + BASE + '/checkout/?offer=' + r[0] + '"><span><b>' + r[1] + '</b><small>' + r[3] + '</small></span><b class="gold">' + r[2] + '</b></a>';
  }).join("");
}
function phases(f, attached, total) {
  var steps = ["Eligibility", "Documents", "Payment", "Lodging", "Decision"];
  return '<ol class="phases">' + steps.map(function (step, i) {
    var state = i === 1 ? "now" : i === 0 ? "done" : "";
    return '<li class="' + state + '"><b>' + (i + 1) + '</b><span>' + step + '</span></li>';
  }).join("") + '</ol>';
}
function folderRow(group, saved, isOpen) {
  var got = group.items.filter(function (i) { return saved[i.id] && saved[i.id].fileName; }).length;
  var count = group.items.length === 1 ? "1 document" : group.items.length + " documents";
  return '<a class="folder' + (isOpen ? " open" : "") + '" href="' + BASE + '/desk/?folder=' + group.id + '"><span><b>' + group.label + '</b><small>' + count + '</small></span><span class="count">' + got + '/' + group.items.length + '</span></a>';
}
function datesFor(f) {
  if (f.track === "non-lucrative") return "No answer within a month of the consulate writing to extranjería is a refusal. Collect the visa within a month of being told it is ready, or the file is archived. Enter within the visa’s validity, never more than three months, then the TIE within a month of entry.";
  if (f.route === "uge") return "UGE-CE has twenty days from the electronic filing. No answer in that time is a grant. The TIE is due only if the authorisation lasts more than six months.";
  return "The consulate sets its own time. The visa is for a maximum of one year. Sixty days before it expires, apply for the three-year residence if you want to stay. Collect it within the month you are given, or the post archives the file.";
}
function statusOf(saved) {
  if (!saved || !saved.fileName) return "Not attached";
  if (!saved.lines) return "Attached, not read";
  if (saved.verdict === "looks-aligned") return "Names found";
  if (saved.verdict === "check") return "Part missing";
  return "Does not match";
}
function row(k, v) { return "<dt>" + k + "</dt><dd>" + v + "</dd>"; }
function card(n, item, saved) {
  var lines = (saved && saved.lines) || [];
  var found = lines.map(function (l) {
    return '<li class="' + (l.hit ? "ok" : "miss") + '">' + (l.hit ? "Found" : "Missing") + " — " + l.label + "</li>";
  }).join("");
  return '<li><article class="card" id="item-' + item.id + '" data-id="' + item.id + '" style="margin-top:14px">'
    + '<div style="display:flex;justify-content:space-between;gap:12px"><span style="font-family:Oswald,sans-serif;font-weight:700;letter-spacing:.08em;color:var(--red)">' + String(n + 1).padStart(2, "0") + '</span><span class="pill">' + statusOf(saved) + '</span></div>'
    + '<h2 style="font-size:26px;margin-top:4px">' + item.label + '</h2>'
    + '<p style="font-weight:500">' + item.what + '</p>'
    + '<p style="border-left:3px solid var(--gold);padding-left:12px"><b>File this.</b> ' + item.file + '</p>'
    + (item.good ? '<p class="good"><b>A good scan shows</b> ' + item.good + '</p>' : "")
    + (item.id === "passport" ? '<p class="trust">This scan stays in your file. It is not sent to a consulate, UGE-CE, or anyone else until you buy lodging. You can delete it.</p>' : "")
    + '<label class="upload" style="display:flex;align-items:center;gap:10px;margin-top:10px"><input data-file type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*" style="position:absolute;width:1px;height:1px;opacity:0"><span class="btn ghost">Upload document</span><span class="file-name muted">' + ((saved && saved.fileName) || "No file chosen") + '</span></label>'
    + '<p style="font-size:13px;margin:6px 0 0;color:var(--soft)"><b>The name is kept.</b> The scan itself is not saved yet, and nothing is sent.</p>'
    + '<label style="display:block;margin-top:8px"><span class="lbl">What is on the document</span><textarea rows="3" placeholder="' + item.ph + '">' + ((saved && saved.text) || "") + '</textarea></label>'
    + '<div class="scan ink" hidden style="margin-top:10px"><div style="display:flex;justify-content:space-between"><b class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.12em;font-size:12px">✦ AI CHECKER</b><b class="gold pct">8%</b></div><div style="height:6px;background:rgba(255,255,255,.15);border-radius:99px;margin-top:8px"><div class="bar" style="height:100%;width:8%;background:var(--gold)"></div></div><p class="looking" style="opacity:.8;font-size:14px"></p></div>'
    + '<button data-check class="btn ink-btn" style="margin-top:10px"><span class="spark">✦</span> Run AI reading</button>'
    + '<p style="font-size:13px;color:var(--soft)">Dummy. It reads what you typed, not the scan, until a vision key is connected.</p>'
    + (found ? '<ul style="margin:10px 0 0;padding-left:18px">' + found + '</ul>' : "")
    + '</article></li>';
}
function run(btn) {
  var cardEl = btn.closest("article");
  var id = cardEl.getAttribute("data-id");
  var item = flat(packet(file())).find(function (i) { return i.id === id; });
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
    var pill = verdict === "looks-aligned" ? "Names found" : verdict === "check" ? "Part missing" : "Does not match";
    var all = answers();
    var prev = all[id] || {};
    all[id] = { text: cardEl.querySelector("textarea").value, verdict: verdict, pill: pill, weight: weight, lines: lines, fileName: prev.fileName || "" };
    localStorage.setItem(ANSWERS, JSON.stringify(all));
    bootDesk();
    var back = document.getElementById("item-" + id);
    if (back) back.scrollIntoView({ block: "center" });
  }, 1500);
}

var FORMS = "jurospain-forms-v1";
function forms() { return read(FORMS) || {}; }
function formList() {
  return [
    { id: "ex-01", visa: "Non-lucrative", name: "EX-01", official: "https://www.inclusion.gob.es/web/migraciones/modelos-generales", note: "The residence application. Download the official model from the modelos page and copy these answers across. The consulate accepts the official form, not this page.", fields: [
      ["surname", "Surname"], ["given", "Given names"], ["passport", "Passport number"], ["nationality", "Nationality"], ["birth", "Date of birth"], ["birthplace", "Place of birth"], ["address", "Address in your country"], ["spain", "Address in Spain, if known"], ["email", "Email"], ["phone", "Phone"]
    ], body: "I apply for the initial temporary non-lucrative residence authorisation, to reside in Spain without carrying out labour or professional activity." },
    { id: "visa-form", visa: "Digital nomad · from abroad", name: "National visa form", official: "https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Formularios.aspx", note: "The consulate’s own form, signed by the person who will telework. Take the current PDF from the ministry page. EX-01 belongs to the other visa.", fields: [
      ["surname", "Surname"], ["given", "Given names"], ["passport", "Passport number"], ["nationality", "Nationality"], ["birth", "Date of birth"], ["consulate", "Consulate where you will file"], ["employer", "Company or client outside Spain"], ["role", "Role"], ["email", "Email"], ["phone", "Phone"]
    ], body: "I apply for the national visa for international telework, to carry out my activity at a distance for companies established outside Spain." },
    { id: "mi-t", visa: "Digital nomad · already in Spain", name: "MI-T", official: "https://sede.inclusion.gob.es/documents/387478/0/Modelo+de+solicitud+de+autorizaci%c3%b3n+residencia+titulares.+MI-T+.pdf/1d2562eb-63ad-a317-b605-bd412dd5c914", note: "The holder’s form for the electronic residence on Plataforma ONE. Family members use MI-F, one each.", fields: [
      ["surname", "Surname"], ["given", "Given names"], ["passport", "Passport number"], ["nie", "NIE, if you have one"], ["nationality", "Nationality"], ["employer", "Company or client outside Spain"], ["role", "Role"], ["spain", "Address in Spain"], ["email", "Email"], ["phone", "Phone"]
    ], body: "I apply for the residence authorisation for international telework, being already lawfully in Spain." },
    { id: "criminal-declaration", visa: "Digital nomad", name: "Five-year criminal declaration", official: "", note: "A sworn declaration covering five years. It does not replace the two-year certificates. Do not use this on a non-lucrative file.", fields: [
      ["name", "Full name"], ["passport", "Passport number"], ["nationality", "Nationality"], ["countries", "Countries of residence, last five years"]
    ], body: "I declare that I have no criminal record, in Spain or abroad, for offences under Spanish law, during the last five years." },
    { id: "remote-letter", visa: "Digital nomad", name: "Remote-work letter", official: "", note: "For the employer or the client to sign. It has to state seniority of at least three months, the role, the pay, and permission to do the work from Spain.", fields: [
      ["company", "Company"], ["applicant", "Applicant"], ["role", "Role"], ["since", "Employed or contracted since"], ["pay", "Salary or fees"], ["country", "Company’s country"]
    ], body: "The company permits the applicant to carry out this work remotely from Spain, exclusively by computer and telecommunication means. The relationship has existed for at least three months." },
    { id: "cover", visa: "Both", name: "Cover note", official: "", note: "The first page of the file. It lists who is applying, which residence, and what is enclosed. It is not a form the administration publishes.", fields: [
      ["name", "Applicant"], ["visa", "Residence applied for"], ["consulate", "Consulate or office"], ["enclosed", "Documents enclosed"]
    ], body: "I enclose the documents in the order of the file, and I ask that the application be considered." }
  ];
}
function bootTemplates() {
  var params = new URLSearchParams(location.search);
  var open = params.get("form");
  var track = new URLSearchParams(location.search).get("track") || (file() && file().track) || "";
  var list = formList().filter(function (f) {
    if (!track) return true;
    if (track === "non-lucrative") return f.visa === "Non-lucrative" || f.visa === "Both";
    return f.visa.indexOf("Digital nomad") === 0 || f.visa === "Both";
  });
  var current = list.filter(function (f) { return f.id === open; })[0];
  if (!current) {
    templates.innerHTML = '<div class="grid2" style="margin-top:24px;grid-template-columns:1fr 1fr 1fr">' + list.map(function (f) {
      var saved = forms()[f.id];
      return '<a class="card" href="' + BASE + '/templates/?form=' + f.id + '" style="text-decoration:none;color:inherit"><p class="kicker">' + f.visa + '</p><h2 style="font-size:26px;margin:8px 0">' + f.name + '</h2><p class="muted">' + (saved ? "Saved to this case" : "Not filled in") + '</p></a>';
    }).join("") + '</div>';
    return;
  }
  var saved = forms()[current.id] || {};
  var inputs = current.fields.map(function (pair) {
    return '<label style="display:block;margin:10px 0"><span class="lbl">' + pair[1] + '</span><input data-k="' + pair[0] + '"></label>';
  }).join("");
  templates.innerHTML = '<p class="no-print" style="margin-top:18px"><a href="' + BASE + '/templates/">All templates</a></p>'
    + '<div class="sheet" id="sheet"><p class="kicker">' + current.visa + '</p><h1 style="font-size:40px;margin:6px 0 8px">' + current.name + '</h1>'
    + '<p class="muted">' + current.note + '</p>'
    + '<div class="row2">' + inputs + '</div>'
    + '<h2>Statement</h2><p>' + current.body + '</p>'
    + '<div class="sign"><div><p class="lbl">Place and date</p><div class="line"></div></div><div><p class="lbl">Signature</p><div class="line"></div></div></div></div>'
    + '<p class="no-print" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button class="btn" id="save-form">Save to this case</button><button class="btn ghost" id="print-form" type="button">Print</button>'
    + (current.official ? '<a class="btn ghost" href="' + current.official + '" target="_blank" rel="noopener">Official form</a>' : '')
    + '</p><p class="muted no-print" id="form-status">Saved answers stay on this case, in this browser.</p>';
  templates.querySelectorAll("[data-k]").forEach(function (input) {
    var key = input.getAttribute("data-k");
    if (saved[key]) input.setAttribute("value", saved[key]);
  });
  document.getElementById("save-form").onclick = function () {
    var all = forms();
    var data = {};
    templates.querySelectorAll("[data-k]").forEach(function (input) { data[input.getAttribute("data-k")] = input.value; });
    all[current.id] = data;
    localStorage.setItem(FORMS, JSON.stringify(all));
    document.getElementById("form-status").textContent = "Saved to this case.";
  };
  document.getElementById("print-form").onclick = function () { window.print(); };
}
function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function ensureCase() {
  var f = file() || { track: "digital-nomad", route: "consulate", name: "", email: "", city: "", country: "" };
  var track = new URLSearchParams(location.search).get("track");
  if (track === "digital-nomad" || track === "non-lucrative") {
    if (f.track !== track) {
      f.track = track;
      f.route = "consulate";
      localStorage.setItem(CASE, JSON.stringify(f));
    }
    history.replaceState(null, "", location.pathname);
  }
  return f;
}
function routeName(f) {
  if (f.track === "non-lucrative") return "Non-lucrative · from origin";
  return f.route === "uge" ? "Digital nomad · already in Spain" : "Digital nomad · from abroad";
}
function look(label, words) { return { label: label, words: words }; }
function doc(id, label, what, fileThis, ph, looks, good) { return { id: id, label: label, what: what, file: fileThis, ph: ph, looks: looks, good: good }; }

function packet(f) {
  var passport = doc("passport", "Passport", "The identity the whole file hangs on. A copy of every page, and the original at the appointment.", "A full colour copy. For non-lucrative, at least one year of validity must remain.", "Passport, British, expiry 14 June 2030",
      [look("the word passport", ["passport", "pasaporte"]), look("an expiry date", ["expiry", "expires", "caduc"]), look("a nationality", ["british", "american", "nationality", "nacionalidad"])],
      "All four corners, every page, in colour, no glare. A photo of the photo page alone is not enough.");
  var funds = doc("funds", "Means", f.track === "non-lucrative" ? "Enough to live on without working. 400% of IPREM a month for you, 100% more for each family member, times the months you ask for." : "Remote income at 200% of SMI for you, 75% for the first family member, 25% after that. The euro figure is an illustration.", "The contract or the bank evidence that shows the amount, and that you can actually use it.", "Balance €40,000, covers twelve months",
      [look("a bank or a salary", ["bank", "banco", "salary", "salario", "income"]), look("an amount", ["€", "eur", "euro"]), look("the period it covers", ["month", "meses", "twelve", "12"])],
      "The amount and the period it covers, on the bank’s or the employer’s paper. An app screenshot is not enough.");
  if (f.track === "non-lucrative") return [
    folder("identity", "Identity", "Who is applying. The passport needs a year of validity left.", [
      doc("form", "EX-01, signed", "The official application. Download it only from the modelos page.", "EX-01, completed and signed by you.", "EX-01 completed and signed",
        [look("the form name", ["ex-01", "ex01"]), look("a signature", ["signed", "firmado"])],
        "Every field filled, signed in ink, the same name as the passport."),
      passport
    ]),
    folder("means", "Means", "400% of IPREM a month for you, 100% more for each family member, times the months you ask for.", [
      funds,
      doc("bank", "Foreign bank letter", "A foreign account has to be identified. A screenshot of an app is not enough.", "Bank name and address, full account number, opening date, the 31 December balance, and last year’s average.", "Bank letter, 31 December balance, average balance",
        [look("the bank’s name", ["bank", "banco"]), look("the 31 December balance", ["31 december", "31 de diciembre", "december"]), look("the average balance", ["average", "media"])],
        "The bank’s name and address, the account number, the opening date, the 31 December balance, and last year’s average. Not a screenshot.")
    ]),
    folder("record", "Clean record", "Five years, from every country you lived in. This is not the digital nomad packet.", [
      doc("criminal", "Criminal record, five years", "No record, for offences under Spanish law, in the countries you lived in for the last five years.", "Certificates covering those five years, from every country of residence.", "Criminal record, last five years, UK",
        [look("a criminal-record certificate", ["criminal", "antecedentes"]), look("five years of cover", ["five", "5 year", "cinco"])],
        "A certificate from each country of the last five years. A declaration does not replace it on this visa.")
    ]),
    folder("cover", "Cover", "Insurance and the medical certificate. Travel insurance does not count.", [
      doc("insurance", "Sickness insurance", "Cover for illness with an insurer allowed to operate in Spain, or public cover.", "A certificate naming you. Travel insurance does not count.", "Adeslas sickness policy, no copay",
        [look("an insurer", ["insurance", "seguro", "policy"]), look("sickness cover, not travel", ["sickness", "enfermedad", "health"])],
        "Your name on a sickness policy from an insurer allowed in Spain. Not travel insurance."),
      doc("medical", "Medical certificate", "A doctor’s statement that you have no disease with serious public-health consequences under the International Health Regulations 2005.", "That certificate, recent enough for the consulate.", "Medical certificate, International Health Regulations",
        [look("a medical certificate", ["medical", "médico", "medico"]), look("the health regulations", ["health", "ihr", "regulations"])],
        "A recent certificate naming the International Health Regulations 2005. A fit-to-travel note is not this.")
    ]),
    folder("fees", "Fees and translations", "Two payments, then the sworn translation behind each foreign public document.", [
      doc("fee", "Fees", "Two payments: the residence fee, and the consulate’s own visa fee.", "Modelo 790 code 052, heading 2.1.1, plus the consular receipt. Read the live amount on the day you pay.", "790-052 paid, plus visa fee receipt",
        [look("modelo 790 code 052", ["790", "052"]), look("a receipt", ["receipt", "recibo", "paid"])],
        "The 790-052 receipt and the consulate’s own receipt. Read the amount on the day you pay."),
      doc("translation", "Sworn translation", "A foreign public document is translated into Spanish by a sworn translator.", "The sworn translation, filed behind the document it translates.", "Sworn Spanish translation attached",
        [look("a sworn translation", ["sworn", "jurada"]), look("Spanish as the language", ["spanish", "español", "espanol"])],
        "A traducción jurada, in Spanish, filed behind the document it translates.")
    ])
  ];
  var abroad = f.route !== "uge";
  return [
    folder("identity", "Identity", "Who is applying, and the form for this door.", [
      abroad
        ? doc("form", "National visa form, signed", "The consulate’s own visa form, signed by the person who will telework.", "The current national visa form, completed and signed.", "National visa form, signed 12 March 2026",
            [look("a visa form", ["visa", "visado"]), look("a signature", ["signed", "firmado"])],
            "The current national visa form, signed, the same name as the passport.")
        : doc("form", "MI-T, signed", "The holder’s form for the electronic residence. Family members use MI-F, one each.", "MI-T from Plataforma ONE, completed and signed.", "MI-T signed 4 May 2026",
            [look("form MI-T", ["mi-t", "mit"]), look("a signature", ["signed", "firmado"])],
            "MI-T, signed. Family members each have their own MI-F."),
      passport
    ]),
    folder("work", "The remote work", "The company, the three months, and proof the work can be done from Spain. This folder does not exist on the other visa.", [
      doc("company", "The company has traded for a year", "The foreign company has been really active for at least a year.", "A companies-register certificate with the incorporation date and the activity.", "Register certificate, incorporated 2019",
        [look("a register certificate", ["register", "registro", "company"]), look("at least a year of activity", ["year", "2019", "2020", "2021", "2022", "2023", "2024"])],
        "A register certificate with the incorporation date and the activity. The date has to be at least a year ago."),
      doc("remote", "Three months, and permission to work from Spain", "The job or the client relationship is at least three months old, and they allow the work from Spain.", "Employed: a letter with seniority, salary and remote permission. Freelance: contracts or invoices covering three months.", "Employer letter, remote from Spain, three months",
        [look("remote permission", ["remote", "remoto"]), look("three months", ["three", "3 month", "tres"])],
        "A letter naming the role, the pay, three months of seniority, and permission to work from Spain."),
      doc("degree", "Qualification, or three years doing the work", "A recognised degree, or three years in the same kind of role.", "The diploma, or evidence of the three years.", "University degree, three years as an engineer",
        [look("a qualification or experience", ["degree", "university", "experience", "years"])],
        "The diploma, or three years of evidence in the same kind of role. One or the other.")
    ]),
    folder("means", "Means", "200% of SMI for you. The euro figure is an illustration, because the sources disagree on the monthly conversion.", [
      funds
    ]),
    folder("record", "Clean record", "Two years of certificates, plus a declaration covering five. Do not use the non-lucrative five-year packet.", [
      doc("criminal", "Criminal record, two years, plus a declaration", "Certificates for the countries of the last two years, and a sworn declaration covering five.", "The certificates and the declaration.", "Criminal record certificate plus five-year declaration",
        [look("a criminal-record certificate", ["criminal", "antecedentes"]), look("the five-year declaration", ["declaration", "five"])],
        "Certificates for the last two years, and a separate declaration covering five. Both.")
    ]),
    folder("cover", "Cover", "Insurance that actually covers you, and Social Security. This visa asks for both.", [
      doc("insurance", "Sickness insurance that actually covers you", "Public cover, or a private policy with an insurer allowed in Spain. Travel insurance, reimbursement-only, a waiting period and a co-pay all fail.", "The certificate of cover.", "Sanitas sickness policy, no copay, no waiting period",
        [look("an insurer", ["insurance", "seguro", "policy"]), look("full sickness cover", ["sickness", "no copay", "no waiting"])],
        "Full sickness cover. No travel insurance, no reimbursement-only policy, no waiting period, no co-pay."),
      doc("ss", "Social Security", "Either you stay covered at home under a bilateral agreement, or the foreign employer will register in Spanish Social Security before the work starts.", "An A1 or coverage certificate, or the alta commitment.", "A1 coverage certificate",
        [look("social security cover", ["social security", "seguridad social", "a1"])],
        "An A1 or coverage certificate, or the employer’s commitment to register before the work starts.")
    ]),
    folder("fees", "Fees and translations", abroad ? "The consulate’s fee, read on the day, then the sworn translation." : "Tasa 038 paid before the file is opened, then the sworn translation.", [
      abroad
        ? doc("fee", "Consular visa fee", "The fee that post charges on the day you file. Do not copy a number from an old PDF.", "The consulate’s receipt.", "Visa fee receipt, paid 2 April 2026",
            [look("a receipt", ["receipt", "recibo", "paid", "fee"])],
            "The receipt from the day you pay. Do not copy a figure from an old PDF.")
        : doc("fee", "Tasa 038, with the NRC", "Paid before the electronic file is opened. The NRC is what you type into the upload.", "Proof of payment and the Número de Referencia Completo.", "Tasa 038 paid, NRC kept",
            [look("tasa 038", ["038"]), look("the NRC", ["nrc"])],
            "Proof of payment and the NRC, kept. You type the NRC into the upload."),
      doc("translation", "Sworn translation", "Foreign public documents are translated into Spanish by a sworn translator.", "The sworn translation, filed behind its document.", "Sworn Spanish translation attached",
        [look("a sworn translation", ["sworn", "jurada"]), look("Spanish as the language", ["spanish", "español"])],
        "A traducción jurada, in Spanish, filed behind the document it translates.")
    ])
  ];
}
function folder(id, label, note, items) { return { id: id, label: label, note: note, items: items }; }
function flat(groups) { return groups.reduce(function (all, g) { return all.concat(g.items); }, []); }
