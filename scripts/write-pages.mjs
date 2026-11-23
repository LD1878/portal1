#!/usr/bin/env node
/** GitHub Pages site for the JUROSpain file desk. Served at /portal1/. */
import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "docs-pages");
const B = "/portal1";

const css = `
:root { --ink:#232323; --soft:#3f3f46; --muted:#78716c; --faint:#a8a29e; --red:#e30613; --red-deep:#c40410; --gold:#ffc400; --paper:#f7f4ef; --rule:#e4ddd2; }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { margin:0; font-family:Barlow,"Segoe UI",sans-serif; color:var(--ink); background:var(--paper);
  background-image:linear-gradient(rgb(35 35 35 / .035) 1px, transparent 1px), linear-gradient(90deg, rgb(35 35 35 / .035) 1px, transparent 1px);
  background-size:48px 48px; line-height:1.6; }
h1,h2,h3 { font-family:Oswald,"Arial Narrow",sans-serif; letter-spacing:-.02em; margin:0; line-height:1.08; }
a { color:var(--red); }
header { position:sticky; top:0; z-index:20; background:rgb(247 244 239 / .94); border-bottom:1px solid var(--rule); backdrop-filter:blur(14px); }
.bar { max-width:1140px; margin:0 auto; height:68px; display:flex; align-items:center; gap:20px; padding:0 22px; }
.logo { height:34px; }
nav { display:flex; gap:18px; align-items:center; font-family:Oswald,sans-serif; font-size:15px; letter-spacing:.05em; text-transform:uppercase; }
nav a { color:var(--ink); text-decoration:none; }
nav a:hover, nav .here { color:var(--red); }
.drop { position:relative; padding:20px 0; }
.drop > div { display:none; position:absolute; top:100%; left:0; min-width:210px; background:#fff; border:1px solid var(--rule); border-radius:10px; padding:6px 0; box-shadow:0 12px 28px rgb(0 0 0 / .1); }
.drop:hover > div, .drop:focus-within > div { display:block; }
.drop div a { display:block; padding:11px 16px; text-transform:none; letter-spacing:0; font-family:Barlow,sans-serif; }
.cta { margin-left:auto; background:var(--red); color:#fff !important; text-decoration:none; font-family:Oswald,sans-serif; letter-spacing:.05em; text-transform:uppercase; padding:11px 18px; border-radius:8px; font-weight:700; }
main { max-width:1140px; margin:0 auto; padding:40px 22px 100px; }
.kicker { font-family:Oswald,sans-serif; color:var(--red); letter-spacing:.16em; text-transform:uppercase; font-size:13px; font-weight:600; }
.lede { max-width:680px; font-size:18px; color:var(--soft); }
.card { background:#fff; border:1px solid var(--rule); border-radius:14px; padding:24px; box-shadow:0 1px 0 rgb(255 255 255 / .8), 0 8px 24px rgb(35 35 35 / .04); }
.btn { display:inline-flex; align-items:center; justify-content:center; min-height:46px; padding:0 18px; background:var(--red); color:#fff; border:2px solid var(--red); border-radius:8px; font-family:Oswald,sans-serif; letter-spacing:.04em; text-transform:uppercase; font-weight:700; text-decoration:none; cursor:pointer; }
.btn:hover { background:var(--red-deep); border-color:var(--red-deep); }
.btn.ghost { background:#fff; color:var(--ink); border-color:var(--ink); }
.btn.ghost:hover { background:var(--ink); color:#fff; }
.btn.gold { background:var(--gold); color:var(--ink); border-color:var(--gold); }
.btn.gold:hover { background:#e0ac00; }
.btn.on { background:var(--ink); color:#fff; border-color:var(--ink); }
input,textarea,select { width:100%; border:1px solid var(--rule); border-radius:8px; padding:12px 14px; font:inherit; background:#fff; color:var(--ink); }
label .lbl { display:block; font-family:Oswald,sans-serif; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:6px; }
.ink { background:#1c1c1c; color:#f7f4ef; border-radius:14px; padding:22px; }
.gold { color:var(--gold); }
.muted { color:var(--muted); }
.grid2 { display:grid; gap:16px; grid-template-columns:1.4fr .8fr; align-items:start; }
@media (max-width:900px) { .grid2 { grid-template-columns:1fr; } .rail { position:static !important; } }
footer { border-top:1px solid var(--rule); color:var(--muted); font-size:13px; max-width:1140px; margin:0 auto; padding:28px 22px 48px; }
.rail { position:sticky; top:84px; display:flex; flex-direction:column; gap:12px; }
.person { background:#fff; border:1px solid var(--rule); border-radius:14px; padding:18px 18px 8px; }
.person dt { font-family:Oswald,sans-serif; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); }
.person dd { margin:2px 0 12px; font-size:16px; }
.pill { border-radius:999px; padding:4px 10px; font-family:Oswald,sans-serif; font-size:11px; letter-spacing:.08em; text-transform:uppercase; background:#f3eee6; color:var(--ink); }
.miss { color:var(--red); font-weight:600; }
.ok { color:#1c1c1c; }
`;

function shell(path, title, body) {
  const here = (p) => (path === p ? "here" : "");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><link rel="icon" href="${B}/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Oswald:wght@500;600;700&display=swap">
<style>${css}</style></head><body>
<header><div class="bar">
  <a href="${B}/"><img class="logo" src="${B}/logo.png" alt="JUROSpain"></a>
  <nav>
    <a class="${here("/")}" href="${B}/">Home</a>
    <a class="${here("/plans")}" href="${B}/plans/">Plans</a>
    <a class="${here("/decide")}" href="${B}/decide/">Decide</a>
    <span class="drop"><a href="${B}/digital-nomad/">Digital nomad</a><div>
      <a href="${B}/digital-nomad/">What it is</a>
      <a href="${B}/digital-nomad/consulate/">From abroad</a>
      <a href="${B}/digital-nomad/uge/">Already in Spain</a>
    </div></span>
    <span class="drop"><a href="${B}/non-lucrative/">Non-lucrative</a><div>
      <a href="${B}/non-lucrative/">What it is</a>
      <a href="${B}/non-lucrative/consulate/">The consular file</a>
    </div></span>
    <span class="drop"><a href="${B}/sources/">Law</a><div>
      <a href="${B}/formulas/">Formulas</a>
      <a href="${B}/sources/">Sources</a>
    </div></span>
  </nav>
  <a class="cta" href="${B}/plans/">Start a file</a>
</div></header>
<main>${body}</main>
<footer>JUROSpain file desk. The sources stay under Law. A check is a reading of what you typed, not a filing and not an approval. The consulate, UGE-CE or extranjería decides.</footer>
<script src="${B}/app.js"></script>
</body></html>`;
}
function write(path, title, body) {
  const file = path === "/" ? join(OUT, "index.html") : join(OUT, path.slice(1), "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, shell(path, title, body));
}

write("/", "JUROSpain", `
<p class="kicker">Immigration, recoded.</p>
<h1 style="font-size:64px;max-width:780px;margin-top:10px">The smarter way to move to <span style="color:var(--red)">Spain.</span></h1>
<p class="lede">Two residencies. A price you see first. Then your name, the visa, and where you are filing. Then the file, one document at a time, with the instruction beside the check.</p>
<p style="display:flex;gap:10px;flex-wrap:wrap">
  <a class="btn" href="${B}/plans/">See the price</a>
  <a class="btn ghost" href="${B}/decide/">Which visa is mine</a>
</p>
<div class="grid2" style="margin-top:32px;grid-template-columns:1fr 1fr">
  <a class="card" href="${B}/digital-nomad/" style="text-decoration:none;color:inherit"><p class="kicker">Ley 14/2013</p><h2 style="font-size:30px;margin:8px 0">Digital nomad</h2><p>Remote work for companies outside Spain. Consular visa from abroad, up to one year. UGE-CE residence if you are already lawfully in Spain, up to three years.</p></a>
  <a class="card" href="${B}/non-lucrative/" style="text-decoration:none;color:inherit"><p class="kicker">RD 1155/2024</p><h2 style="font-size:30px;margin:8px 0">Non-lucrative</h2><p>Live without working. Filed from your country of origin. Means are 400% of IPREM a month, times the months you ask for.</p></a>
</div>`);

write("/plans", "Plans · JUROSpain", `
<p class="kicker">Before you enter</p>
<h1 style="font-size:54px;margin-top:8px">Three months. Two ways to pay.</h1>
<p class="lede">The manual stays open. The desk is three months. You can walk through before a card is connected. Nothing on this page charges you.</p>
<div class="grid2" style="margin-top:28px;grid-template-columns:1fr 1fr">
  <article class="card"><p class="kicker">Billed monthly</p><h2 style="font-size:52px;color:var(--red);margin:8px 0">€300</h2><p class="muted">a month, three months minimum · €900 in the first quarter</p><p>Both visas, holder and family, every document explained, then checked. Cancel after month three.</p><a class="btn" href="${B}/checkout/?offer=monthly">Continue with monthly</a></article>
  <article class="card" style="outline:2px solid var(--gold)"><p class="kicker">Prepaid</p><h2 style="font-size:52px;color:var(--red);margin:8px 0">€600</h2><p class="muted">paid once, for three months · €200 a month</p><p>The same desk. Access ends after three months unless you renew. Nothing is filed for you.</p><a class="btn gold" href="${B}/checkout/?offer=prepaid">Continue with €600</a></article>
</div>
<p style="margin-top:22px"><a class="btn ghost" href="${B}/decide/">Look through the desk first</a></p>`);

write("/checkout", "Checkout · JUROSpain", `<div id="checkout"></div>`);
write("/decide", "Which visa · JUROSpain", `
<p class="kicker">Your route</p>
<h1 style="font-size:48px;margin-top:8px">Which of the two visas, from where.</h1>
<p class="lede">Three questions. The answer opens your details, then the packet in file order.</p>
<div id="decide" class="card" style="margin-top:18px;max-width:740px"></div>`);
write("/profile", "Your details · JUROSpain", `<div id="profile"></div>`);
write("/desk", "File desk · JUROSpain", `<div id="desk"></div>`);
write("/formulas", "Formulas · JUROSpain", `
<p class="kicker">Money is a formula</p>
<h1 style="font-size:46px;margin-top:8px">A percentage of an index. Not a frozen euro number.</h1>
<div class="card" style="margin-top:16px"><h2>Non-lucrative</h2><p>400% of monthly IPREM for you, plus 100% for each family member, times the months you apply for. At €600 IPREM, a holder alone illustrates at €2,400 a month. When the index moves, the illustration moves. The article does not.</p></div>
<div class="card" style="margin-top:12px"><h2>Digital nomad</h2><p>200% of SMI for you, 75% for the first family member, 25% for each person after. Gazette monthly SMI is €1,221, so a holder illustrates at €2,442. A second official reading divides the annual floor by twelve. Both exist because the sources disagree.</p></div>`);
write("/sources", "Sources · JUROSpain", `
<p class="kicker">Source of truth</p>
<h1 style="font-size:44px;margin-top:8px">The records this desk is allowed to speak from.</h1>
<ul>
<li><b>BOE-A-2013-10074</b> — Ley 14/2013, international telework, articles 74 bis to 74 quinquies.</li>
<li><b>BOE-A-2022-22128</b> — Ley 28/2022, the amendment that created that chapter.</li>
<li><b>BOE-A-2024-24099</b> — RD 1155/2024, non-lucrative residence, articles 61 to 64.</li>
<li><b>BOE-A-2026-3815</b> — the SMI index. An index, not the visa.</li>
<li><b>IPREM</b> — the non-lucrative index, published with the budget law.</li>
</ul>
<p>Consolidated text is informative. The gazette is the binding publication. A fee is read on the day you pay.</p>`);

for (const [path, title, body] of [
  ["/digital-nomad", "Digital nomad", "Remote work, only by computer, for companies outside Spain. From abroad, the consulate issues a visa of up to one year. Already lawfully in Spain, UGE-CE issues a residence of up to three years. You cannot file the UGE residence from abroad."],
  ["/digital-nomad/consulate", "From abroad", "Art. 74 quater. The consulate that covers where you live. Full passport copy, originals at the appointment. The visa is the title to live and work remotely for up to one year."],
  ["/digital-nomad/uge", "Already in Spain", "Art. 74 quinquies. Electronic file on Plataforma ONE. Signed MI-T, tasa 038 paid first, the NRC kept. Twenty days. Silence is positive. Maximum three years."],
  ["/non-lucrative", "Non-lucrative", "Residence without work, filed from your country of origin. Means are 400% of IPREM a month for you, 100% more for each family member, times the months you ask for."],
  ["/non-lucrative/consulate", "The consular file", "The visa application is the authorisation. Silence at one month is negative. Collect the visa within a month, enter within its validity, then the TIE within a month of entry."],
]) write(path, title + " · JUROSpain", `<p class="kicker">${title}</p><h1 style="font-size:46px;margin-top:8px">${title}</h1><p class="lede">${body}</p><p><a class="btn" href="${B}/plans/">Build this file</a></p>`);

const APP = String.raw`
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
    + '<button class="btn" style="margin-top:8px;width:100%">Pay ' + price + '</button>'
    + skipRow(BASE + "/profile/", "Continue without paying")
    + '<p class="muted">Stripe is not connected. This card is not charged. The fields stay so the real payment can drop in later.</p></form>'
    + '<aside class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;font-size:12px">ORDER</p><h2 style="font-size:30px">' + name + '</h2><p class="gold" style="font-family:Oswald,sans-serif;font-size:28px">Due today ' + price + '</p><p style="opacity:.75">Both visas. Your name, the route, and where you will live, then the file.</p></aside></div>';
  document.getElementById("pay").onsubmit = function (e) { e.preventDefault(); location.href = BASE + "/profile/"; };
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
  profile.innerHTML = '<p class="kicker">After the price · before the file</p>'
    + '<h1 style="font-size:50px;margin-top:8px">Who is moving, and where.</h1>'
    + '<p class="lede">This sits above the file. The desk uses it so every check knows whose documents these are. You can change it later.</p>'
    + '<form class="card" id="who" style="max-width:640px;margin-top:18px">'
    + '<p class="kicker">' + routeName(f) + '</p>'
    + field("Your name", "text", "name") + field("Email", "email", "email")
    + '<div class="grid2" style="grid-template-columns:1fr 1fr">' + field("City you are heading to", "text", "address-level2") + field("Country you are filing from", "text", "country-name") + '</div>'
    + '<button class="btn" style="margin-top:6px">Open my file</button>'
    + skipRow(BASE + "/desk/", "Skip and open the file")
    + '<p class="muted">The fields stay. You can fill them now or come back. Skipping does not delete what you already typed.</p></form>';
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
  var f = file() || { track: "digital-nomad", route: "consulate", name: "", email: "", city: "", country: "" };
  var who = document.getElementById("who");
  if (who) who.textContent = f.name || "Not filled in yet";
  var items = packet(f);
  var saved = answers();
  var aligned = items.filter(function (i) { return saved[i.id] && saved[i.id].verdict === "looks-aligned"; }).length;
  var checked = items.filter(function (i) { return saved[i.id]; }).length;
  var pct = items.length ? Math.round(aligned / items.length * 100) : 0;
  var complete = pct === 100;
  desk.innerHTML = '<div class="grid2" style="grid-template-columns:minmax(0,1fr) 320px;gap:0">'
    + '<div style="padding-right:20px"><p class="kicker">🇪🇸 Spain · ' + routeName(f) + ' · Main applicant</p>'
    + '<h1 style="font-size:42px;margin:6px 0">' + (f.name || "Your file") + '</h1>'
    + (f.name ? "" : '<p><a href="' + BASE + '/profile/">Add your name and where you are filing from</a>. The file is already open.</p>')
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
    + '<label class="upload" style="display:flex;align-items:center;gap:10px;margin-top:10px"><input data-file type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*" style="position:absolute;width:1px;height:1px;opacity:0"><span class="btn ghost">Upload document</span><span class="file-name muted">' + ((saved && saved.fileName) || "PDF or photo. Nothing is sent yet.") + '</span></label>'
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
    var prev = all[id] || {};
    all[id] = { text: cardEl.querySelector("textarea").value, verdict: verdict, pill: pill, weight: weight, lines: lines, fileName: prev.fileName || "" };
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
`;

writeFileSync(join(OUT, ".nojekyll"), "");
cpSync("public/logo.png", join(OUT, "logo.png"));
cpSync("public/favicon.svg", join(OUT, "favicon.svg"));
writeFileSync(join(OUT, "app.js"), APP);
console.log("wrote pages");
