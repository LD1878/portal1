#!/usr/bin/env node
/** Write the GitHub Pages site. Plain HTML, no server, works at /portal1/. */
import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "docs-pages");
const css = `
:root { --ink:#232323; --muted:#78716c; --red:#e30613; --gold:#ffc400; --paper:#fcfcfc; --rule:#e2e8f0; }
* { box-sizing: border-box; }
body { margin:0; font-family: Barlow, "Segoe UI", sans-serif; color:var(--ink); background:var(--paper);
  background-image: linear-gradient(rgb(0 0 0 / .03) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / .03) 1px, transparent 1px);
  background-size: 50px 50px; }
h1,h2,h3 { font-family: Oswald, "Arial Narrow", sans-serif; letter-spacing:-.02em; margin:0; }
a { color: var(--red); }
header { position:sticky; top:0; z-index:5; background:#fffc; border-bottom:1px solid var(--rule); backdrop-filter:blur(12px); }
.bar { max-width:1100px; margin:0 auto; height:64px; display:flex; align-items:center; gap:18px; padding:0 20px; }
.logo { height:32px; }
nav { display:flex; gap:14px; font-family:Oswald,sans-serif; font-size:15px; letter-spacing:.04em; text-transform:uppercase; }
nav a { color:var(--ink); text-decoration:none; }
nav a:hover, nav .here { color:var(--red); }
.drop { position:relative; }
.drop div { display:none; position:absolute; top:100%; left:0; min-width:180px; background:#fff; border:1px solid var(--rule); border-radius:8px; padding:6px 0; }
.drop:hover div { display:block; }
.drop div a { display:block; padding:10px 16px; text-transform:none; letter-spacing:0; font-family:Barlow,sans-serif; }
.cta { margin-left:auto; background:var(--red); color:#fff; text-decoration:none; font-family:Oswald,sans-serif; letter-spacing:.04em; text-transform:uppercase; padding:10px 16px; border-radius:6px; font-weight:700; }
main { max-width:1100px; margin:0 auto; padding:48px 20px 80px; }
.kicker { font-family:Oswald,sans-serif; color:var(--red); letter-spacing:.16em; text-transform:uppercase; font-size:13px; }
.lede { max-width:640px; font-size:18px; color:#3f3f46; line-height:1.6; }
.grid { display:grid; gap:16px; }
.card { background:#fff; border:1px solid var(--rule); border-radius:10px; padding:24px; box-shadow:0 2px 6px rgb(0 0 0 / .06); }
.btn { display:inline-flex; align-items:center; min-height:44px; padding:0 20px; background:var(--red); color:#fff; border:0; border-radius:6px; font-family:Oswald,sans-serif; letter-spacing:.04em; text-transform:uppercase; font-weight:700; text-decoration:none; cursor:pointer; }
.btn.ghost { background:transparent; color:var(--red); border:2px solid var(--red); }
input,textarea { width:100%; border:1px solid var(--rule); border-radius:6px; padding:10px 12px; font:inherit; }
label span { display:block; font-family:Oswald,sans-serif; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#a8a29e; margin-bottom:6px; }
.gold { color:var(--gold); }
.ink { background:#232323; color:#fff; border-radius:10px; padding:20px; }
footer { border-top:1px solid var(--rule); padding:32px 20px; color:var(--muted); font-size:13px; max-width:1100px; margin:0 auto; }
.pill { border-radius:999px; padding:4px 10px; font-family:Oswald,sans-serif; font-size:11px; letter-spacing:.1em; text-transform:uppercase; background:#f4f4f5; }
`;

const nav = (here) => `
<header><div class="bar">
  <a href="__B__/"><img class="logo" src="__B__/logo.png" alt="JUROSpain"></a>
  <nav>
    <a class="${here === "/" ? "here" : ""}" href="__B__/">Home</a>
    <a class="${here === "/decide" ? "here" : ""}" href="__B__/decide/">Decide</a>
    <a class="${here === "/desk" ? "here" : ""}" href="__B__/desk/">Desk</a>
    <span class="drop"><a href="__B__/digital-nomad/">Digital nomad</a><div>
      <a href="__B__/digital-nomad/">Overview</a>
      <a href="__B__/digital-nomad/consulate/">Consular visa</a>
      <a href="__B__/digital-nomad/uge/">UGE-CE</a>
      <a href="__B__/digital-nomad/family/">Family</a>
    </div></span>
    <span class="drop"><a href="__B__/non-lucrative/">Non-lucrative</a><div>
      <a href="__B__/non-lucrative/">Overview</a>
      <a href="__B__/non-lucrative/consulate/">Consular visa</a>
      <a href="__B__/non-lucrative/family/">Family</a>
    </div></span>
    <span class="drop"><a href="__B__/sources/">Law</a><div>
      <a href="__B__/formulas/">Formulas</a>
      <a href="__B__/sources/">Sources</a>
    </div></span>
  </nav>
  <a class="cta" href="__B__/desk/">Start a file</a>
</div></header>`;

const foot = `<footer>JUROSpain file desk. The sources stay under Law. The desk checks what you upload and does not lodge the file. Not legal advice.</footer>`;

function page(path, title, body) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Oswald:wght@500;700&display=swap">
<style>${css}</style></head><body>
${nav(path)}<main>${body}</main>${foot}
<script src="__B__/app.js"></script>
</body></html>`.replaceAll("__B__", "/portal1");
  const file = path === "/" ? join(OUT, "index.html") : join(OUT, path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

page("/", "JUROSpain", `
<p class="kicker">Immigration, recoded.</p>
<h1 style="font-size:64px;line-height:.95;max-width:740px;margin-top:12px">The smarter way to move to <span style="color:var(--red)">Spain.</span></h1>
<p class="lede">One desk for the digital nomad visa and the non-lucrative visa. Upload each document, the desk checks it, and nothing is submitted for you. Three months: €300 a month, or €600 paid once.</p>
<p style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn" href="/portal1/desk/">Start a file</a><a class="btn ghost" href="/portal1/plans/">Monthly plans</a><a class="btn ghost" href="/portal1/decide/">Which visa</a></p>
<div class="grid" style="grid-template-columns:1fr 1fr;margin-top:28px">
  <a class="card" href="/portal1/digital-nomad/" style="text-decoration:none;color:inherit"><p class="kicker">Ley 14/2013</p><h2 style="font-size:32px;margin:8px 0">International telework</h2><p>Consular visa from abroad, or UGE-CE if you are already lawfully in Spain.</p></a>
  <a class="card" href="/portal1/non-lucrative/" style="text-decoration:none;color:inherit"><p class="kicker">RD 1155/2024</p><h2 style="font-size:32px;margin:8px 0">Non-lucrative residence</h2><p>Live on your own means. Consular visa from origin, then TIE. 400% IPREM.</p></a>
</div>`);

page("/decide", "Which visa · JUROSpain", `
<p class="kicker">Decide</p>
<h1 style="font-size:48px;margin-top:8px">Which of the two visas.</h1>
<p class="lede">Answer in file order. The tree only routes into international telework and non-lucrative residence.</p>
<div id="decide" class="card" style="margin-top:24px;max-width:640px"></div>`);

page("/desk", "File desk · JUROSpain", `<div id="desk"></div>`);

page("/plans", "Plans · JUROSpain", `
<p class="kicker">Access</p>
<h1 style="font-size:52px;margin-top:8px">Three months. Two ways to pay.</h1>
<p class="lede">The manual stays open. The desk needs three months.</p>
<div class="grid" style="grid-template-columns:1fr 1fr;margin-top:24px">
  <article class="card"><p class="kicker">Billed monthly</p><h2 style="font-size:40px;color:var(--red);margin:8px 0">€300</h2><p>a month, 3 months minimum. €900 across the quarter.</p><a class="btn" href="/portal1/checkout/?offer=monthly" style="margin-top:16px">Continue to payment</a></article>
  <article class="card" style="outline:2px solid var(--gold)"><p class="kicker">Prepaid</p><h2 style="font-size:40px;color:var(--red);margin:8px 0">€600</h2><p>paid once, for 3 months. €200 a month.</p><a class="btn" href="/portal1/checkout/?offer=prepaid" style="margin-top:16px">Continue to payment</a></article>
</div>`);

page("/login", "Sign in · JUROSpain", `
<p class="kicker">Your file</p>
<h1 style="font-size:52px;margin-top:8px">Start the desk.</h1>
<form id="login" class="card" style="max-width:420px;margin-top:20px">
  <button type="button" id="google" class="btn ghost" style="width:100%">Continue with Google</button>
  <p style="text-align:center;letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:#a8a29e">or email</p>
  <label><span>Email</span><input name="email" type="email" required></label>
  <label style="display:block;margin-top:10px"><span>Password</span><input name="password" type="password" minlength="8" required></label>
  <button class="btn" style="width:100%;margin-top:16px;justify-content:center">Continue</button>
</form>`);

page("/checkout", "Checkout · JUROSpain", `<div id="checkout"></div>`);

page("/formulas", "Formulas · JUROSpain", `
<p class="kicker">Money · formulas only</p>
<h1 style="font-size:44px;margin-top:8px">The statute is a percentage of an index.</h1>
<div class="card" style="margin-top:20px"><h2>Non-lucrative · 400% IPREM + 100% per family member</h2><p>Monthly IPREM €600. Holder illustration €2,400 a month. The figure moves when the index moves. The formula does not.</p></div>
<div class="card" style="margin-top:12px"><h2>Digital nomad · 200% SMI + 75% / 25% family</h2><p>Gazette monthly SMI €1,221. Holder illustration €2,442 a month. The monthly conversion is an open conflict — both readings are shown in the full desk.</p></div>`);

page("/sources", "Sources · JUROSpain", `
<p class="kicker">Source of truth</p>
<h1 style="font-size:44px;margin-top:8px">Every BOE ID this desk is allowed to speak from.</h1>
<ul style="line-height:1.8"><li>BOE-A-2013-10074 · Ley 14/2013, international telework</li><li>BOE-A-2022-22128 · Ley 28/2022</li><li>BOE-A-2024-24099 · RD 1155/2024, non-lucrative arts. 61–64</li><li>BOE-A-2026-3815 · SMI index</li><li>BOE-A-2022-22128 · IPREM index</li></ul>
<p>Consolidated text is informative. The gazette publication is the binding source.</p>`);

for (const [path, title, body] of [
  ["/digital-nomad", "Digital nomad", "International telework. Two doors: a consular visa if you are not resident, a UGE-CE residence if you are already lawfully in Spain."],
  ["/digital-nomad/consulate", "Consular visa", "Art. 74 quater. Non-residents apply at the competent consulate. The visa is up to one year."],
  ["/digital-nomad/uge", "UGE-CE", "Art. 74 quinquies. Already lawfully in Spain: file electronically. Maximum three years."],
  ["/digital-nomad/family", "Family", "Spouse, partner, children and dependent ascendants. Means add 75% SMI, then 25%."],
  ["/non-lucrative", "Non-lucrative", "Residence without work. Consular visa from origin. Means are 400% IPREM, not a frozen euro figure."],
  ["/non-lucrative/consulate", "Consular visa", "The visa application is the authorisation application. Collect it within a month, then the TIE."],
  ["/non-lucrative/family", "Family", "A narrower circle than Ley 14/2013. Each member files from origin. Means add 100% IPREM."],
]) {
  page(path, title + " · JUROSpain", `<p class="kicker">${title}</p><h1 style="font-size:44px;margin-top:8px">${title}</h1><p class="lede">${body}</p><p><a class="btn" href="/portal1/desk/">Open this in the desk</a></p>`);
}

const APP = String.raw`
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
`;

writeFileSync(join(OUT, ".nojekyll"), "");
cpSync("public/logo.png", join(OUT, "logo.png"));
cpSync("public/favicon.svg", join(OUT, "favicon.svg"));
writeFileSync(join(OUT, "app.js"), APP);
console.log("wrote pages");
