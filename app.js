
var BASE = location.pathname.indexOf("/portal1") === 0 ? "/portal1" : "";
function go(p) { location.href = BASE + p; }
var CASES = "jurospain-cases-v1";
var ANSWERS = "jurospain-answers-v1";
function read(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch (e) { return f; } }
function allCases() { return read(CASES, []); }

var desk = document.getElementById("desk");
if (desk) renderDesk();
var decide = document.getElementById("decide");
if (decide) renderDecide();
var checkout = document.getElementById("checkout");
if (checkout) renderCheckout();
var login = document.getElementById("login");
if (login) {
  document.getElementById("google").onclick = function () { go("/desk/"); };
  login.onsubmit = function (e) { e.preventDefault(); go("/desk/"); };
}

function renderDesk() {
  var all = allCases();
  if (!all.length) return newCase(desk);
  show(all[0]);
}
function show(file) {
  var items = packet(file.track);
  var ans = {};
  (read(ANSWERS, {})[file.id] || []).forEach(function (a) { ans[a.requirementId] = a; });
  var aligned = items.filter(function (i) { return ans[i.id] && ans[i.id].verdict === "looks-aligned"; }).length;
  var pct = Math.round(aligned / items.length * 100);
  desk.innerHTML = '<p class="kicker">File desk</p><h1 style="font-size:44px;margin-top:8px">Your case, checked before you file.</h1>'
    + '<p class="lede">Upload or type each item. The bar is the check. Nothing is submitted.</p>'
    + '<p><button class="btn ghost" id="new">New case</button></p>'
    + '<div class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;text-transform:uppercase;font-size:12px">Case review</p><div style="display:flex;justify-content:space-between;align-items:end"><h2 style="font-size:32px">' + (pct === 100 ? "Ready to review" : "Still assembling") + '</h2><b class="gold" style="font-size:42px;font-family:Oswald,sans-serif">' + pct + '%</b></div><div style="height:6px;background:rgba(255,255,255,.15);border-radius:99px;margin-top:10px"><div style="height:100%;background:var(--gold);width:' + pct + '%"></div></div><p style="opacity:.7">' + aligned + " of " + items.length + " look aligned · not submitted</p></div>"
    + items.map(function (item, n) { return slot(n, item, ans[item.id] || {}, file); }).join("");
  document.getElementById("new").onclick = function () { newCase(desk); };
  desk.querySelectorAll("[data-check]").forEach(function (btn) {
    btn.onclick = function () { runCheck(btn, file); };
  });
}
function slot(n, item, saved) {
  var pill = saved.verdict === "looks-aligned" ? "Looks aligned" : saved.verdict === "missing" ? "Does not match" : "Not checked";
  return '<article class="card" style="margin-top:14px" data-req="' + item.id + '" data-expect="' + item.expect + '" data-reject="' + item.reject + '">'
    + '<div style="display:flex;justify-content:space-between"><span style="font-family:monospace;color:#a8a29e">' + String(n + 1).padStart(2, "0") + '</span><span class="pill">' + pill + "</span></div>"
    + "<h3 style=\"font-size:22px;margin-top:6px\">" + item.label + "</h3>"
    + '<p style="color:var(--muted)">' + item.note + "</p>"
    + '<label style="display:flex;justify-content:space-between;border:1px dashed #cbd5e1;border-radius:6px;padding:10px;cursor:pointer"><span class="file">' + (saved.fileName || "PDF or text") + '</span><b style="color:var(--red);font-family:Oswald,sans-serif;letter-spacing:.1em">UPLOAD</b><input type="file" accept=".pdf,.txt,text/plain" style="display:none"></label>'
    + '<textarea rows="3" style="margin-top:8px">' + (saved.text || "") + "</textarea>"
    + '<div class="scan ink" hidden style="margin-top:10px"><div style="display:flex;justify-content:space-between"><b class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.12em;font-size:12px">AI CASE REVIEW</b><b class="gold pct">8%</b></div><div style="height:6px;background:rgba(255,255,255,.15);border-radius:99px;margin-top:8px"><div class="bar" style="height:100%;width:8%;background:var(--gold)"></div></div><p style="opacity:.65;font-size:12px">Reading the page against the packet note</p></div>'
    + '<button data-check class="btn" style="margin-top:10px">Check this item</button>'
    + '<p class="sum" style="color:#3f3f46">' + (saved.summary || "") + "</p></article>";
}
function runCheck(btn, file) {
  var card = btn.closest("article");
  var scan = card.querySelector(".scan");
  scan.hidden = false;
  var n = 8;
  var timer = setInterval(function () {
    n = Math.min(92, n + 7);
    card.querySelector(".bar").style.width = n + "%";
    card.querySelector(".pct").textContent = n + "%";
  }, 80);
  setTimeout(function () {
    clearInterval(timer);
    var text = card.querySelector("textarea").value.toLowerCase();
    var expect = card.getAttribute("data-expect").split(" ");
    var reject = card.getAttribute("data-reject");
    var verdict = "looks-aligned";
    var summary = "What you typed lines up with this packet item. It is a check, not a filing.";
    if (text.trim().length < 12) { verdict = "empty"; summary = "Type the key lines, or upload a text file."; }
    else if (reject && text.indexOf(reject) >= 0) { verdict = "missing"; summary = "A phrase that fails this item is in the note."; }
    else if (!expect.some(function (w) { return w && text.indexOf(w) >= 0; })) { verdict = "missing"; summary = "This does not mention what the packet asks for."; }
    var all = read(ANSWERS, {});
    var list = (all[file.id] || []).filter(function (a) { return a.requirementId !== card.getAttribute("data-req"); });
    list.push({ requirementId: card.getAttribute("data-req"), text: card.querySelector("textarea").value, fileName: card.querySelector(".file").textContent, verdict: verdict, summary: summary });
    all[file.id] = list;
    localStorage.setItem(ANSWERS, JSON.stringify(all));
    show(file);
  }, 1400);
  card.querySelector("input").onchange = function (e) {
    var f = e.target.files[0];
    if (!f) return;
    card.querySelector(".file").textContent = f.name;
    f.text().then(function (t) { if (t.length > 20) card.querySelector("textarea").value = t.slice(0, 4000); });
  };
}
function newCase(root) {
  root.innerHTML = '<p class="kicker">File desk</p><h1 style="font-size:44px;margin-top:8px">Open a case</h1>'
    + '<form class="card" style="max-width:520px;margin-top:16px"><label><span>Case name</span><input name="name" placeholder="Madrid 2026"></label>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px"><button type="button" data-track="digital-nomad" class="btn">Digital nomad</button><button type="button" data-track="non-lucrative" class="btn ghost">Non-lucrative</button></div>'
    + '<button class="btn" style="margin-top:16px">Open the desk</button></form>';
  var track = "digital-nomad";
  root.querySelectorAll("[data-track]").forEach(function (b) {
    b.onclick = function () {
      track = b.getAttribute("data-track");
      root.querySelectorAll("[data-track]").forEach(function (x) { x.className = "btn ghost"; });
      b.className = "btn";
    };
  });
  root.querySelector("form").onsubmit = function (e) {
    e.preventDefault();
    var row = { id: Math.random().toString(36).slice(2), track: track, displayName: root.querySelector("[name=name]").value || "My case" };
    localStorage.setItem(CASES, JSON.stringify([row].concat(allCases())));
    show(row);
  };
}
function packet(track) {
  if (track === "non-lucrative") return [
    { id: "nlv-form", label: "EX-01, signed", expect: "ex-01 ex01 signed", reject: "", note: "Official form, completed and signed." },
    { id: "nlv-passport", label: "Passport, one year left", expect: "passport expiry", reject: "", note: "Complete copy, at least one year of validity." },
    { id: "nlv-funds", label: "Means at 400% IPREM", expect: "bank balance saldo", reject: "", note: "Holder 400% IPREM a month, times the months of validity." },
    { id: "nlv-insurance", label: "Sickness insurance", expect: "insurance seguro policy", reject: "travel", note: "Insurer authorised in Spain. Travel insurance fails." },
    { id: "nlv-medical", label: "Medical certificate", expect: "medical certificate", reject: "", note: "International Health Regulations 2005." }
  ];
  return [
    { id: "dn-form", label: "National visa form, signed", expect: "visa visado signed", reject: "ex-01", note: "Signed by the teleworker. EX-01 is the other visa." },
    { id: "dn-passport", label: "Complete passport copy", expect: "passport expiry", reject: "", note: "Every page, still valid." },
    { id: "dn-insurance", label: "Sickness insurance", expect: "insurance seguro policy", reject: "travel", note: "Authorised insurer. No travel policy, no co-pay." },
    { id: "dn-criminal", label: "Criminal record", expect: "criminal antecedentes", reject: "", note: "Two-year certificates plus a five-year declaration." },
    { id: "dn-funds", label: "Means at 200% SMI", expect: "salary income contract", reject: "", note: "Remote income at the formula. The euro figure is an illustration." }
  ];
}
function renderDecide() {
  decide.innerHTML = '<p>Are you an EU, EEA or Swiss national?</p><p><button class="btn ghost" id="eu">Yes</button> <button class="btn" id="no">No — third country</button></p><div id="out"></div>';
  document.getElementById("eu").onclick = function () { document.getElementById("out").innerHTML = "<p>This desk does not apply. Use the Union regime.</p>"; };
  document.getElementById("no").onclick = function () {
    document.getElementById("out").innerHTML = '<p>What will you do?</p><p><a class="btn" href="' + BASE + '/desk/">Remote work for companies outside Spain</a> <a class="btn ghost" href="' + BASE + '/desk/">Live on my own means</a></p>';
  };
}
function renderCheckout() {
  var offer = new URLSearchParams(location.search).get("offer") === "monthly" ? "monthly" : "prepaid";
  var price = offer === "monthly" ? "€300.00" : "€600.00";
  var name = offer === "monthly" ? "Monthly" : "Three months";
  checkout.innerHTML = '<div class="grid" style="grid-template-columns:1.1fr .9fr"><form class="card" id="pay"><p class="kicker">Checkout</p><h1 style="font-size:40px;margin:8px 0">' + name + '</h1>'
    + '<label><span>Name on card</span><input required autocomplete="cc-name"></label>'
    + '<label style="display:block;margin-top:10px"><span>Card number</span><input required placeholder="4242 4242 4242 4242" autocomplete="cc-number"></label>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><label><span>Expiry</span><input required placeholder="MM/YY"></label><label><span>CVC</span><input required placeholder="123"></label></div>'
    + '<button class="btn" style="margin-top:16px;width:100%;justify-content:center">Pay ' + price + '</button></form>'
    + '<aside class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em">ORDER</p><h2 style="font-size:32px">' + name + '</h2><p>Due today ' + price + '</p><p style="opacity:.65">Both visas, family annex, upload and the check.</p></aside></div>';
  document.getElementById("pay").onsubmit = function (e) {
    e.preventDefault();
    checkout.innerHTML = '<p class="kicker">Payment received</p><h1 style="font-size:52px;margin-top:8px">You are in.</h1><p class="lede">The desk is open. Nothing has been filed.</p><p><a class="btn" href="' + BASE + '/desk/">Open the desk</a></p>';
  };
}
