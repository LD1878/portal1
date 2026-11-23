#!/usr/bin/env node
/** GitHub Pages site. Plain HTML, served from the repo root at /portal1/. */
import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(process.cwd(), "docs-pages");
const B = "/portal1";

const css = `
:root { --ink:#232323; --soft:#3f3f46; --muted:#78716c; --faint:#a8a29e; --red:#e30613; --red-deep:#c40410; --gold:#ffc400; --paper:#fcfcfc; --rule:#e2e8f0; }
* { box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { margin:0; font-family:Barlow,"Segoe UI",sans-serif; color:var(--ink); background:var(--paper);
  background-image:linear-gradient(rgb(0 0 0 / .035) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / .035) 1px, transparent 1px);
  background-size:48px 48px; line-height:1.55; }
h1,h2,h3 { font-family:Oswald,"Arial Narrow",sans-serif; letter-spacing:-.02em; margin:0; line-height:1.05; }
a { color:var(--red); }
header { position:sticky; top:0; z-index:20; background:rgb(252 252 252 / .94); border-bottom:1px solid var(--rule); backdrop-filter:blur(12px); }
.bar { max-width:1120px; margin:0 auto; height:64px; display:flex; align-items:center; gap:18px; padding:0 20px; }
.logo { height:34px; }
nav { display:flex; gap:16px; align-items:center; font-family:Oswald,sans-serif; font-size:15px; letter-spacing:.04em; text-transform:uppercase; }
nav a { color:var(--ink); text-decoration:none; }
nav a:hover, nav .here { color:var(--red); }
.drop { position:relative; padding:18px 0; }
.drop > div { display:none; position:absolute; top:100%; left:0; min-width:200px; background:#fff; border:1px solid var(--rule); border-radius:8px; padding:6px 0; box-shadow:0 10px 20px rgb(0 0 0 / .12); }
.drop:hover > div, .drop:focus-within > div { display:block; }
.drop div a { display:block; padding:10px 16px; text-transform:none; letter-spacing:0; font-family:Barlow,sans-serif; font-size:15px; }
.cta { margin-left:auto; background:var(--red); color:#fff !important; text-decoration:none; font-family:Oswald,sans-serif; letter-spacing:.04em; text-transform:uppercase; padding:10px 16px; border-radius:6px; font-weight:700; }
main { max-width:1120px; margin:0 auto; padding:36px 20px 96px; }
.kicker { font-family:Oswald,sans-serif; color:var(--red); letter-spacing:.16em; text-transform:uppercase; font-size:13px; font-weight:600; }
.lede { max-width:680px; font-size:18px; color:var(--soft); }
.card { background:#fff; border:1px solid var(--rule); border-radius:12px; padding:22px; box-shadow:0 2px 6px rgb(0 0 0 / .05); }
.btn { display:inline-flex; align-items:center; justify-content:center; min-height:46px; padding:0 20px; background:var(--red); color:#fff; border:2px solid transparent; border-radius:6px; font-family:Oswald,sans-serif; letter-spacing:.04em; text-transform:uppercase; font-weight:700; text-decoration:none; cursor:pointer; }
.btn:hover { background:var(--red-deep); }
.btn.ghost { background:#fff; color:var(--red); border-color:var(--red); }
.btn.ghost:hover { background:var(--red); color:#fff; }
.btn.gold { background:var(--gold); color:var(--ink); }
input,textarea,select { width:100%; border:1px solid var(--rule); border-radius:8px; padding:12px; font:inherit; background:#fff; }
label .lbl { display:block; font-family:Oswald,sans-serif; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:6px; }
.ink { background:#232323; color:#fff; border-radius:12px; padding:20px 22px; }
.gold { color:var(--gold); }
.muted { color:var(--muted); }
.grid2 { display:grid; gap:16px; grid-template-columns:1fr 1fr; }
@media (max-width:800px) { .grid2 { grid-template-columns:1fr; } nav .drop { display:none; } }
footer { border-top:1px solid var(--rule); color:var(--muted); font-size:13px; max-width:1120px; margin:0 auto; padding:28px 20px 40px; }
.steps { display:flex; gap:0; margin:28px 0 8px; }
.step { flex:1; text-align:center; font-family:Oswald,sans-serif; font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:var(--faint); position:relative; }
.step b { display:grid; place-items:center; width:28px; height:28px; margin:0 auto 6px; border-radius:50%; border:2px solid var(--rule); background:#fff; }
.step.on { color:var(--red); }
.step.on b { background:var(--red); color:#fff; border-color:var(--red); }
.step.done { color:var(--ink); }
.step.done b { background:var(--gold); border-color:var(--gold); color:var(--ink); }
.rail { position:sticky; top:76px; }
.progress-num { font-family:Oswald,sans-serif; font-size:42px; color:var(--gold); }
ol.items { list-style:none; margin:0; padding:0; }
.item { scroll-margin-top:84px; }
.howto li { margin:4px 0; }
`;

function shell(path, title, body) {
  const here = (p) => (path === p ? "here" : "");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="icon" href="${B}/favicon.svg">
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
<footer>JUROSpain file desk. Sources stay under Law. The desk checks what you type and does not lodge the file. Not legal advice. The consulate, UGE-CE or extranjería decides.</footer>
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
<h1 style="font-size:62px;max-width:760px;margin-top:10px">The smarter way to move to <span style="color:var(--red)">Spain.</span></h1>
<p class="lede">A self-serve desk for two residencies only: the digital nomad visa and the non-lucrative visa. You see the price first. Then you build the file, one document at a time, with the instruction beside the check.</p>
<div class="steps" aria-hidden="true">
  <div class="step on"><b>1</b>Price</div>
  <div class="step"><b>2</b>Route</div>
  <div class="step"><b>3</b>Each document</div>
  <div class="step"><b>4</b>Ready to review</div>
</div>
<p style="display:flex;gap:10px;flex-wrap:wrap;margin-top:22px">
  <a class="btn" href="${B}/plans/">See the price</a>
  <a class="btn ghost" href="${B}/decide/">Which visa is mine</a>
</p>
<div class="grid2" style="margin-top:32px">
  <a class="card" href="${B}/digital-nomad/" style="text-decoration:none;color:inherit">
    <p class="kicker">Ley 14/2013 · arts. 74 bis–quinquies</p>
    <h2 style="font-size:30px;margin:8px 0">Digital nomad</h2>
    <p>Remote work for companies outside Spain. A consular visa if you are abroad, up to one year. A UGE-CE residence if you are already lawfully in Spain, up to three years.</p>
  </a>
  <a class="card" href="${B}/non-lucrative/" style="text-decoration:none;color:inherit">
    <p class="kicker">RD 1155/2024 · arts. 61–64</p>
    <h2 style="font-size:30px;margin:8px 0">Non-lucrative</h2>
    <p>Live in Spain without working. Filed from your country of origin. Means are 400% of IPREM a month, not a frozen euro number. Then the TIE after you enter.</p>
  </a>
</div>
<section class="card" style="margin-top:16px;border-left:6px solid var(--gold)">
  <p class="kicker">How a check works</p>
  <h2 style="font-size:28px;margin-top:6px">Instruction, then the document, then the bar.</h2>
  <p>Each item tells you what the file must contain, what fails it, and what to type from the page. The gold bar is the reading. A match is not an approval. Nothing is sent to a consulate.</p>
</section>`);

write("/plans", "Plans · JUROSpain", `
<p class="kicker">Before you enter</p>
<h1 style="font-size:54px;margin-top:8px">Three months. Two ways to pay.</h1>
<p class="lede">The manual stays open. The desk — your case, the uploads, the check on every document — is three months. You can look through the desk before a card is connected. No charge happens on this page.</p>
<div class="grid2" style="margin-top:28px">
  <article class="card">
    <p class="kicker">Billed monthly</p>
    <h2 style="font-size:52px;color:var(--red);margin:8px 0">€300</h2>
    <p class="muted">a month, three months minimum</p>
    <p>€900 across the first quarter. Cancel after month three. Both visas, holder and family, every document explained, then checked.</p>
    <a class="btn" href="${B}/checkout/?offer=monthly" style="margin-top:8px">Continue with monthly</a>
  </article>
  <article class="card" style="outline:2px solid var(--gold)">
    <p class="kicker">Prepaid · half the monthly rate</p>
    <h2 style="font-size:52px;color:var(--red);margin:8px 0">€600</h2>
    <p class="muted">paid once, for three months</p>
    <p>€200 a month, paid up front. Same desk. Access ends after three months unless you renew. Nothing is filed for you.</p>
    <a class="btn gold" href="${B}/checkout/?offer=prepaid" style="margin-top:8px">Continue with €600</a>
  </article>
</div>
<p style="margin-top:22px"><a class="btn ghost" href="${B}/decide/">Look through the desk first</a></p>
<p class="muted" style="max-width:640px">Card processing is shown so you can walk the flow. Stripe is not connected, so continuing does not charge a card. The sources, the formulas and the decision stay free.</p>`);

write("/checkout", "Checkout · JUROSpain", `<div id="checkout"></div>`);

write("/decide", "Which visa · JUROSpain", `
<p class="kicker">Step 2 · your route</p>
<h1 style="font-size:48px;margin-top:8px">Which of the two visas, from where.</h1>
<p class="lede">Four questions. The answer opens the packet that matches. Other permits — entrepreneur, student, arraigo — are not in this desk.</p>
<div id="decide" class="card" style="margin-top:20px;max-width:720px"></div>`);

write("/desk", "File desk · JUROSpain", `<div id="desk"></div>`);

write("/formulas", "Formulas · JUROSpain", `
<p class="kicker">Money is a formula</p>
<h1 style="font-size:46px;margin-top:8px">The statute is a percentage. The euro figure moves.</h1>
<div class="card" style="margin-top:18px">
  <h2>Non-lucrative · RD 1155/2024 art. 62</h2>
  <p>400% of monthly IPREM for the holder, plus 100% of IPREM for each family member, times the months you apply for. Monthly IPREM is €600, so a holder alone illustrates at €2,400 a month, €28,800 across twelve months. That euro number is not the article. When IPREM changes, the illustration changes.</p>
</div>
<div class="card" style="margin-top:12px">
  <h2>Digital nomad · joint instruction on art. 62.3.f</h2>
  <p>200% of SMI for the holder, 75% of SMI for the first family member, 25% of SMI for each person after that. The gazette monthly SMI is €1,221, so a holder alone illustrates at €2,442 a month. A second official reading divides the annual floor by twelve. Both are shown because the sources disagree. Do not treat either euro figure as the statute.</p>
</div>
<p><a href="${B}/sources/">The BOE records behind these formulas</a></p>`);

write("/sources", "Sources · JUROSpain", `
<p class="kicker">Source of truth</p>
<h1 style="font-size:44px;margin-top:8px">The only records this desk is allowed to speak from.</h1>
<p class="lede">Consolidated BOE text is informative. The gazette publication is the binding one. Blogs and old consular PDFs are not authority here.</p>
<ul>
  <li><b>BOE-A-2013-10074</b> — Ley 14/2013, the international-telework residence, articles 74 bis to 74 quinquies.</li>
  <li><b>BOE-A-2022-22128</b> — Ley 28/2022, the amendment that created the telework chapter.</li>
  <li><b>BOE-A-2024-24099</b> — RD 1155/2024, non-lucrative temporary residence, articles 61 to 64.</li>
  <li><b>BOE-A-2026-3815</b> — the SMI index used in the telework formula. An index, not the visa.</li>
  <li><b>IPREM</b> — the index in the non-lucrative formula. Published with the budget law, not inside the visa article.</li>
</ul>
<p>Official procedure pages that may supply a fee, a form name or a filing channel: UGE-CE, Plataforma ONE, the Ministry of Foreign Affairs, and the live 790 pages. A fee amount is read on the day you pay.</p>`);

const guides = [
  ["/digital-nomad", "Digital nomad", "The residence for people who work at a distance, only by computer, for companies outside Spain. Two doors. If you are not a Spanish resident, you apply for the visa at the consulate that covers your home. That visa lasts up to one year. If you are already lawfully in Spain, you file the residence with UGE-CE. That lasts up to three years. You cannot file the UGE residence from abroad."],
  ["/digital-nomad/consulate", "From abroad", "Art. 74 quater. The consulate that covers where you live takes the visa. Bring the original passport to the appointment and file a full copy of every page. The visa itself is the title to live and work remotely, for up to one year. About sixty days before it ends, you file the three-year residence."],
  ["/digital-nomad/uge", "Already in Spain", "Art. 74 quinquies. You must already be in Spain lawfully, or hold the telework visa. The file is electronic, on Plataforma ONE: signed MI-T, tasa 038 paid first, and the NRC from that payment kept for the upload. Silence after twenty days is positive. Maximum three years."],
  ["/non-lucrative", "Non-lucrative", "Residence without a job and without professional activity in Spain. You apply from your country of origin. The visa application is the authorisation application. Means are a formula — 400% of IPREM a month for you, 100% more for each family member — multiplied by the months you ask for. After you enter, the TIE is a separate step."],
  ["/non-lucrative/consulate", "The consular file", "The consulate weighs the visa points plus means and insurance. Extranjería weighs the rest of article 61. Silence at one month is negative, unlike the digital-nomad residence. Collect the visa within a month, enter within its validity, then book the TIE within a month of entry."],
];
for (const [path, title, body] of guides) {
  write(path, title + " · JUROSpain", `<p class="kicker">${title}</p><h1 style="font-size:46px;margin-top:8px">${title}</h1><p class="lede">${body}</p><p><a class="btn" href="${B}/plans/">Build this file</a></p>`);
}

const APP = String.raw`
var BASE = location.pathname.indexOf("/portal1") === 0 ? "/portal1" : "";
var CASES = "jurospain-cases-v1";
var ANSWERS = "jurospain-answers-v1";
function read(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch (e) { return f; } }
function cases() { return read(CASES, []); }

var desk = document.getElementById("desk");
if (desk) bootDesk();
var decide = document.getElementById("decide");
if (decide) bootDecide();
var checkout = document.getElementById("checkout");
if (checkout) bootCheckout();

function bootCheckout() {
  var monthly = new URLSearchParams(location.search).get("offer") === "monthly";
  var price = monthly ? "€300.00" : "€600.00";
  var name = monthly ? "Monthly" : "Three months, prepaid";
  var line = monthly ? "Billed today, then monthly. Three months minimum, €900 in total." : "Paid once. Access for three months. €200 a month.";
  checkout.innerHTML = '<div class="grid2"><form class="card" id="pay"><p class="kicker">Checkout</p><h1 style="font-size:40px;margin:8px 0">' + name + '</h1><p class="muted">' + line + '</p>'
    + '<label style="display:block;margin-top:14px"><span class="lbl">Name on card</span><input required autocomplete="cc-name"></label>'
    + '<label style="display:block;margin-top:10px"><span class="lbl">Email for the receipt</span><input required type="email" autocomplete="email"></label>'
    + '<label style="display:block;margin-top:10px"><span class="lbl">Card number</span><input required inputmode="numeric" placeholder="4242 4242 4242 4242" autocomplete="cc-number"></label>'
    + '<div class="grid2" style="margin-top:10px"><label><span class="lbl">Expiry</span><input required placeholder="MM/YY" autocomplete="cc-exp"></label><label><span class="lbl">CVC</span><input required placeholder="123" autocomplete="cc-csc"></label></div>'
    + '<button class="btn" style="margin-top:16px;width:100%">Pay ' + price + '</button>'
    + '<p class="muted">Shown so you can walk the payment. Stripe is not connected, so this card is not charged.</p></form>'
    + '<aside class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;font-size:12px">ORDER</p><h2 style="font-size:32px">' + name + '</h2><p>' + line + '</p><p style="font-size:28px;font-family:Oswald,sans-serif" class="gold">Due today ' + price + '</p><p style="opacity:.7">Both visas. Family annex. Every document explained, then checked. The sources stay free.</p></aside></div>';
  document.getElementById("pay").onsubmit = function (e) {
    e.preventDefault();
    localStorage.setItem("jurospain-passed", "1");
    checkout.innerHTML = '<p class="kicker">You can enter</p><h1 style="font-size:52px;margin-top:8px">The desk is open.</h1><p class="lede">No card was charged. Payments go live when Stripe is connected. Until then this screen is the way through.</p><p><a class="btn" href="' + BASE + '/decide/">Choose the visa</a></p>';
  };
}

function bootDecide() {
  var box = decide;
  var state = { who: "", what: "", where: "" };
  function draw() {
    box.innerHTML = ""
      + q("Who is applying?", [["third", "A national of a country outside the EU, EEA and Switzerland"], ["eu", "An EU, EEA or Swiss national"]], state.who, "who")
      + (state.who === "third" ? q("What will you do in Spain?", [["remote", "Remote work for companies outside Spain"], ["means", "Live on my own means, without working"], ["other", "Something else"]], state.what, "what") : "")
      + (state.what === "remote" || state.what === "means" ? q("Where are you now?", [["abroad", "Outside Spain"], ["spain", "Already lawfully in Spain"]], state.where, "where") : "")
      + result();
    box.querySelectorAll("button[data-k]").forEach(function (b) {
      b.onclick = function () { state[b.getAttribute("data-k")] = b.getAttribute("data-v"); draw(); };
    });
  }
  function q(legend, opts, cur, key) {
    return '<fieldset style="border:0;padding:0;margin:0 0 18px"><legend style="font-family:Oswald,sans-serif;font-size:22px">' + legend + '</legend><div style="display:grid;gap:8px;margin-top:8px">'
      + opts.map(function (o) {
        var on = cur === o[0];
        return '<button type="button" data-k="' + key + '" data-v="' + o[0] + '" class="' + (on ? "btn" : "btn ghost") + '" style="justify-content:flex-start">' + o[1] + '</button>';
      }).join("") + "</div></fieldset>";
  }
  function result() {
    if (state.who === "eu") return note("This desk does not apply. EU, EEA and Swiss nationals use the Union regime, not these two residencies.");
    if (state.what === "other") return note("Entrepreneur, student, highly qualified and arraigo permits are outside this desk. Do not stretch it onto a different visa.");
    if (!state.where || (state.what !== "remote" && state.what !== "means")) return "";
    if (state.what === "means" && state.where === "spain") return note("Non-lucrative residence is filed from your country of origin, not from inside Spain. If you are already here on another status, this is the wrong packet.");
    var track = state.what === "remote" ? "digital-nomad" : "non-lucrative";
    var route = state.where === "spain" ? "uge" : "consulate";
    var title = track === "digital-nomad" ? (route === "uge" ? "Digital nomad, from inside Spain" : "Digital nomad, from abroad") : "Non-lucrative, from origin";
    return '<aside class="ink"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;font-size:12px">YOUR ROUTE</p><h2 style="font-size:28px">' + title + '</h2><p>The packet opens in file order. Each document has the instruction, then the place to type what is on the page, then the check.</p><p><a class="btn gold" id="open" href="#">Open this packet</a></p></aside>';
  }
  function note(t) { return '<aside class="card" style="border-left:6px solid var(--gold)"><p>' + t + '</p></aside>'; }
  draw();
  box.addEventListener("click", function (e) {
    if (e.target.id !== "open") return;
    e.preventDefault();
    var track = state.what === "remote" ? "digital-nomad" : "non-lucrative";
    var route = state.where === "spain" ? "uge" : "consulate";
    var row = { id: Math.random().toString(36).slice(2), track: track, route: route, name: "My file" };
    localStorage.setItem(CASES, JSON.stringify([row].concat(cases())));
    location.href = BASE + "/desk/";
  });
}

function bootDesk() {
  var all = cases();
  if (!all.length) { location.href = BASE + "/decide/"; return; }
  show(all[0]);
}
function show(file) {
  var items = packet(file);
  var saved = {};
  (read(ANSWERS, {})[file.id] || []).forEach(function (a) { saved[a.id] = a; });
  var done = items.filter(function (i) { return saved[i.id] && saved[i.id].verdict === "looks-aligned"; }).length;
  var pct = Math.round(done / items.length * 100);
  desk.innerHTML = '<div class="grid2" style="align-items:start"><div>'
    + '<p class="kicker">' + fileLabel(file) + '</p>'
    + '<h1 style="font-size:42px;margin:8px 0 6px">' + (file.name || "Your file") + '</h1>'
    + '<p class="lede">Work down the list. Read the instruction, type what is on the document, then run the check. The bar on the right is the whole file, not one item.</p>'
    + '<ol class="items">' + items.map(function (item, n) { return slot(n, item, saved[item.id] || {}); }).join("") + '</ol></div>'
    + '<aside class="ink rail"><p class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.14em;font-size:12px">FILE PROGRESS</p>'
    + '<div style="display:flex;justify-content:space-between;align-items:end"><div><b style="font-size:20px">' + (pct === 100 ? "Ready to review" : "Still assembling") + '</b><p style="opacity:.7;margin:4px 0 0">' + done + " of " + items.length + ' documents look aligned</p></div><span class="progress-num">' + pct + '%</span></div>'
    + '<div style="height:8px;background:rgba(255,255,255,.15);border-radius:99px;margin-top:12px"><div style="height:100%;background:var(--gold);width:' + pct + '%;border-radius:99px"></div></div>'
    + '<ol style="margin:16px 0 0;padding:0;list-style:none">' + items.map(function (item, n) {
      var v = (saved[item.id] || {}).verdict;
      var mark = v === "looks-aligned" ? "✓" : v === "missing" || v === "check" ? "!" : String(n + 1).padStart(2, "0");
      return '<li style="margin:6px 0"><a href="#item-' + item.id + '" style="color:#fff;text-decoration:none"><span class="gold">' + mark + '</span> ' + item.label + '</a></li>';
    }).join("") + '</ol>'
    + '<p style="opacity:.6;font-size:13px">A tick is a reading of what you typed. It is not a filing, and it is not an approval.</p>'
    + '<p><a class="btn ghost" style="color:#fff;border-color:#fff" href="' + BASE + '/decide/">Change route</a></p></aside></div>';
  desk.querySelectorAll("[data-check]").forEach(function (btn) { btn.onclick = function () { run(btn, file); }; });
  desk.querySelectorAll("input[type=file]").forEach(function (input) {
    input.onchange = function () {
      var f = input.files[0];
      if (!f) return;
      input.parentElement.querySelector(".file").textContent = f.name;
      if (f.text) f.text().then(function (t) { if (t && t.length > 20) input.closest("article").querySelector("textarea").value = t.slice(0, 4000); });
    };
  });
}
function fileLabel(file) {
  if (file.track === "non-lucrative") return "Non-lucrative · consular file";
  return file.route === "uge" ? "Digital nomad · UGE-CE file" : "Digital nomad · consular file";
}
function slot(n, item, saved) {
  var pill = saved.verdict === "looks-aligned" ? "Looks aligned" : saved.verdict === "missing" ? "Does not match" : saved.verdict === "check" ? "Needs a look" : "Not checked";
  return '<li><article class="card item" id="item-' + item.id + '" data-id="' + item.id + '" data-expect="' + item.expect + '" data-reject="' + item.reject + '">'
    + '<div style="display:flex;justify-content:space-between;gap:12px"><span class="muted" style="font-family:monospace">' + String(n + 1).padStart(2, "0") + " / " + '</span><span class="pill" style="' + (saved.verdict === "looks-aligned" ? "background:var(--gold);color:var(--ink)" : "") + '">' + pill + '</span></div>'
    + '<h2 style="font-size:26px;margin-top:6px">' + item.label + '</h2>'
    + '<p><b>What this is.</b> ' + item.what + '</p>'
    + '<p><b>File this.</b> ' + item.file + '</p>'
    + '<p><b>This fails it.</b> ' + item.fails + '</p>'
    + '<p class="muted"><b>How to check.</b> ' + item.how + '</p>'
    + '<label style="display:flex;justify-content:space-between;align-items:center;border:1px dashed #cbd5e1;border-radius:8px;padding:12px;cursor:pointer"><span class="file muted">' + (saved.fileName || "Upload a PDF or a text file, or type below") + '</span><b style="color:var(--red);font-family:Oswald,sans-serif;letter-spacing:.08em">UPLOAD</b><input type="file" accept=".pdf,.txt,text/plain,application/pdf" style="display:none"></label>'
    + '<label style="display:block;margin-top:10px"><span class="lbl">What is on the document</span><textarea rows="3" placeholder="' + item.ph + '">' + (saved.text || "") + '</textarea></label>'
    + '<div class="scan ink" hidden style="margin-top:10px"><div style="display:flex;justify-content:space-between"><b class="gold" style="font-family:Oswald,sans-serif;letter-spacing:.12em;font-size:12px">AI CASE REVIEW</b><b class="gold pct">8%</b></div><div style="height:6px;background:rgba(255,255,255,.15);border-radius:99px;margin-top:8px"><div class="bar" style="height:100%;width:8%;background:var(--gold);border-radius:99px"></div></div><p style="opacity:.7;font-size:13px">Reading what you typed against this instruction</p></div>'
    + '<button data-check class="btn" style="margin-top:10px">Check this document</button>'
    + (saved.summary ? '<p>' + saved.summary + '</p>' : '')
    + '</article></li>';
}
function run(btn, file) {
  var card = btn.closest("article");
  var scan = card.querySelector(".scan");
  scan.hidden = false;
  var n = 8;
  var timer = setInterval(function () {
    n = Math.min(92, n + 6);
    card.querySelector(".bar").style.width = n + "%";
    card.querySelector(".pct").textContent = n + "%";
  }, 80);
  setTimeout(function () {
    clearInterval(timer);
    var text = card.querySelector("textarea").value;
    var low = text.toLowerCase();
    var expect = card.getAttribute("data-expect").split(" ").filter(Boolean);
    var reject = card.getAttribute("data-reject");
    var verdict = "looks-aligned";
    var summary = "What you typed lines up with this instruction. It is a reading, not a filing.";
    if (text.trim().length < 12) { verdict = "check"; summary = "Too short to check. Type the dates, the names and the line the instruction asks for."; }
    else if (reject && low.indexOf(reject) >= 0) { verdict = "missing"; summary = "A phrase that fails this document is in what you typed. Read “This fails it” and replace it."; }
    else if (!expect.some(function (w) { return low.indexOf(w) >= 0; })) { verdict = "missing"; summary = "This does not mention what the instruction asks for. It may be the wrong document."; }
    var all = read(ANSWERS, {});
    var list = (all[file.id] || []).filter(function (a) { return a.id !== card.getAttribute("data-id"); });
    list.push({ id: card.getAttribute("data-id"), text: text, fileName: card.querySelector(".file").textContent, verdict: verdict, summary: summary });
    all[file.id] = list;
    localStorage.setItem(ANSWERS, JSON.stringify(all));
    show(file);
    var back = document.getElementById("item-" + card.getAttribute("data-id"));
    if (back) back.scrollIntoView({ block: "center" });
  }, 1400);
}
function packet(file) {
  var nomad = [
    item("dn-form", "National visa form, signed", "visa visado signed", "ex-01",
      "The form the consulate uses for a national visa, signed by the person who will telework.",
      "The current national visa form from the Ministry of Foreign Affairs, completed and signed. Use as many copies as that consulate currently asks for.",
      "EX-01. That form belongs to the non-lucrative file, not this one.",
      "Type “national visa”, that it is signed, and the date. Do not paste a full passport number.",
      "National visa form, signed 12 March 2026"),
    item("dn-fee", "Consular visa fee", "receipt recibo fee paid", "",
      "Proof you paid the visa fee that post charges on the day you file.",
      "The receipt from the consulate. The amount is that post’s live tariff, not a number copied from an old PDF.",
      "A receipt for a different fee, or a screenshot of a tariff with no proof of payment.",
      "Type “receipt”, the fee, and the date it was paid.",
      "Visa fee receipt, paid 2 April 2026"),
    item("dn-passport", "Complete passport", "passport expiry", "expired",
      "A copy of the whole valid passport, not the photo page alone.",
      "Every page, in colour, plus the original at the appointment.",
      "An expired passport, or a copy of the bio page only.",
      "Type “passport”, the nationality, and the expiry date.",
      "Passport, nationality British, expiry 14 June 2030"),
    item("dn-company", "Company has traded for a year", "company register year", "",
      "The foreign company you work for has to have been really active for at least a year.",
      "A companies-register certificate with the incorporation date and the activity.",
      "A website printout, or a certificate for a company incorporated last month.",
      "Type the company, the register, and the year it was incorporated.",
      "Companies register certificate, incorporated 2019"),
    item("dn-remote", "Three months, and permission to work from Spain", "remote employer months", "",
      "The job or the client relationship has to be at least three months old, and they have to let you do it from Spain.",
      "Employed: a letter with seniority, salary, role and express remote permission. Freelance: contracts or invoices covering three months, plus the remote terms.",
      "A brand-new contract, or a letter that does not mention Spain.",
      "Type “remote”, the employer or client, and that the relationship is at least three months.",
      "Employer letter, remote from Spain, three months seniority"),
    item("dn-degree", "Qualification, or three years’ experience", "degree university experience", "",
      "You are a qualified professional, shown by a recognised qualification or by three years doing the same kind of work.",
      "A degree, postgraduate or business-school diploma of recognised prestige, or evidence of three years’ analogous experience.",
      "A short course with no experience behind it.",
      "Type the qualification, or “three years” and the role.",
      "University degree, plus three years as a software engineer"),
    item("dn-funds", "Income at 200% of SMI", "salary income contract", "",
      "Enough remote income for you, and more if family file with you. The law is a percentage of SMI, not a frozen euro amount.",
      "The contract, offer or client contract showing the income. Bank evidence if you also rely on savings.",
      "Spanish employment income. This visa is for work outside Spain.",
      "Type the income, the currency, and that it comes from the remote contract.",
      "Remote salary €3,200 a month on the contract"),
    item("dn-criminal", "Criminal record, two years plus a declaration", "criminal antecedentes", "",
      "No record in Spain or in the countries you lived in for the last two years, for offences that exist in Spanish law. Plus a sworn declaration covering five years.",
      "Certificates for each country of the last two years, apostilled and sworn-translated, and the five-year declaration.",
      "The non-lucrative five-year packet. Do not mix the two.",
      "Type “criminal record”, the countries, and “five-year declaration”.",
      "Criminal record certificate, UK, plus five-year sworn declaration"),
    item("dn-insurance", "Sickness insurance that actually covers you", "insurance policy", "travel",
      "Public cover, or a private sickness policy with an insurer allowed to operate in Spain.",
      "A certificate of cover. Public cover through Spanish Social Security also counts.",
      "Travel insurance. A policy that only reimburses you. A waiting period. A co-payment.",
      "Type the insurer, “sickness”, and that there is no co-pay and no waiting period.",
      "Sanitas sickness policy, no copay, no waiting period"),
    item("dn-ss", "Social Security, covered or committed", "social security coverage", "",
      "Either you stay covered by your home system under a bilateral agreement, or the foreign employer will register in Spanish Social Security before the work starts.",
      "A coverage certificate, often an A1, or the request to register the employer plus a declaration you will complete the alta before you start.",
      "Nothing. “I will sort it later” is not a document.",
      "Type “social security” and whether it is an A1 or a Spanish alta commitment.",
      "A1 coverage certificate, valid through 2027"),
    item("dn-apostille", "Apostille, then a sworn translation", "apostille sworn", "",
      "A foreign public document is not filed raw. It is apostilled, or legalised, and then translated into Spanish by a sworn translator.",
      "The apostille or legalisation behind each public document, and the sworn translation with it.",
      "A machine translation, or an apostille with no translation.",
      "Type “apostille” and “sworn translation”, and which documents.",
      "Apostille on the criminal record, sworn Spanish translation attached")
  ];
  var uge = nomad.map(function (i) { return Object.assign({}, i); });
  uge[0] = item("dn-mit", "MI-T, signed", "mi-t signed", "ex-01",
    "The holder’s residence form for the electronic file.",
    "MI-T downloaded from Plataforma ONE, completed and signed. Family members use MI-F, one each.",
    "A national visa form, or EX-01.",
    "Type “MI-T” and that it is signed.",
    "MI-T signed 4 May 2026");
  uge[1] = item("dn-038", "Tasa 038, with the NRC", "038 nrc", "",
    "The fee for the UGE file, paid before you start the electronic submission.",
    "Proof of payment and the NRC, the Número de Referencia Completo. The euro amount is the live tariff.",
    "A consular visa-fee receipt. That is a different fee.",
    "Type “038”, “NRC”, and the date paid.",
    "Tasa 038 paid, NRC kept, 4 May 2026");
  var nlv = [
    item("nlv-form", "EX-01, completed and signed", "ex-01 signed", "mi-t",
      "The official application for this residence.",
      "EX-01 from the official modelos page only, completed and signed by you.",
      "MI-T. That form belongs to the digital-nomad file.",
      "Type “EX-01” and that it is signed.",
      "EX-01 completed and signed"),
    item("nlv-passport", "Passport with a year left", "passport expiry", "expired",
      "A passport Spain recognises, with at least one year of validity still on it, and a complete copy.",
      "The full copy, plus the original at the consular appointment.",
      "A passport that expires in six months.",
      "Type “passport” and the expiry date, and check a year remains.",
      "Passport expiry 18 September 2028"),
    item("nlv-criminal", "Criminal record, last five years", "criminal antecedentes", "",
      "No record, for offences under Spanish law, in the countries you lived in during the last five years.",
      "Certificates covering those five years, from origin and any other country of residence, apostilled and sworn-translated.",
      "The digital-nomad two-year packet. This one is five years.",
      "Type “criminal record”, the countries, and “five years”.",
      "Criminal record certificates, last five years, UK and UAE"),
    item("nlv-funds", "Means at 400% of IPREM", "bank balance", "salary",
      "Enough to live on, without working in Spain. The law is 400% of IPREM a month for you, plus 100% for each family member, times the months you apply for.",
      "Bank, investment or income evidence covering that amount for the whole period. At the current index a holder alone illustrates at €2,400 a month.",
      "A Spanish job. This residence does not allow work.",
      "Type the balance or the income, and that it covers the months you are applying for.",
      "Bank balance €40,000, covers 12 months at 400% IPREM"),
    item("nlv-bank", "The foreign bank letter", "bank account average", "",
      "A foreign account has to be identified properly. A balance screenshot is not enough.",
      "The bank’s name and address, the full account number, the opening date, the balance on 31 December of last year, and the average balance of the last year.",
      "A screenshot of an app with no letter behind it.",
      "Type “bank”, the 31 December balance, and the average.",
      "Bank letter, 31 December balance and last-year average"),
    item("nlv-insurance", "Sickness insurance, insurer allowed in Spain", "insurance policy", "travel",
      "Cover for illness, with a public system or a private insurer authorised to operate in Spain.",
      "A certificate naming you, and each family member if they file.",
      "Travel insurance.",
      "Type the insurer and that it is sickness cover, not travel.",
      "Adeslas sickness policy, insurer authorised in Spain"),
    item("nlv-medical", "Medical certificate, IHR 2005", "medical certificate", "",
      "A doctor’s certificate that you do not have a disease with serious public-health consequences under the International Health Regulations 2005.",
      "That certificate, recent enough for the consulate that takes the file.",
      "A generic “fit to travel” letter with no public-health statement.",
      "Type “medical certificate” and “health”.",
      "Medical certificate, International Health Regulations 2005"),
    item("nlv-fee", "Fee 790-052, plus the visa fee", "790 052 receipt", "038",
      "Two payments. The residence fee, and the consulate’s own visa fee.",
      "Modelo 790 code 052, heading 2.1.1, paid within ten working days of filing, plus the consular visa-fee receipt. Read the live amount on the day you pay.",
      "Tasa 038. That is the digital-nomad fee.",
      "Type “790”, “052”, and the visa-fee receipt.",
      "790-052 heading 2.1.1 paid, plus consular visa fee receipt"),
    item("nlv-apostille", "Apostille, then a sworn translation", "apostille sworn", "",
      "Foreign public documents are legalised and translated before they go in the file.",
      "An apostille, or consular legalisation, and a sworn translation into Spanish, filed behind each document.",
      "A translation that is not sworn.",
      "Type “apostille” and “sworn translation”.",
      "Apostille and sworn Spanish translation on each public document")
  ];
  if (file.track === "non-lucrative") return nlv;
  return file.route === "uge" ? uge : nomad;
}
function item(id, label, expect, reject, what, file, fails, how, ph) {
  return { id: id, label: label, expect: expect, reject: reject, what: what, file: file, fails: fails, how: how, ph: ph };
}
`;

writeFileSync(join(OUT, ".nojekyll"), "");
cpSync("public/logo.png", join(OUT, "logo.png"));
cpSync("public/favicon.svg", join(OUT, "favicon.svg"));
writeFileSync(join(OUT, "app.js"), APP);
console.log("wrote pages");
