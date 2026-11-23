var BASE = location.pathname.indexOf("/portal1") === 0 ? "/portal1" : "";
function chromeNav(here) {
  return '<div class="goldbar"></div><header class="site"><div class="bar">'
    + '<a href="' + BASE + '/"><img class="logo" src="' + BASE + '/logo.png" alt="JUROSpain"></a>'
    + '<nav class="top">'
    + '<a class="' + (here === "templates" ? "here" : "") + '" href="' + BASE + '/templates/">Templates</a>'
    + '<span class="drop"><a href="' + BASE + '/digital-nomad/">Digital nomad</a><div>'
    + '<a href="' + BASE + '/digital-nomad/">The residence</a>'
    + '<a href="' + BASE + '/digital-nomad/consulate/">From abroad</a>'
    + '<a href="' + BASE + '/digital-nomad/uge/">Already in Spain</a></div></span>'
    + '<span class="drop"><a href="' + BASE + '/non-lucrative/">Non-lucrative</a><div>'
    + '<a href="' + BASE + '/non-lucrative/">The residence</a>'
    + '<a href="' + BASE + '/non-lucrative/consulate/">The consular file</a></div></span>'
    + '<span class="drop"><a href="' + BASE + '/sources/">Law</a><div>'
    + '<a href="' + BASE + '/formulas/">Formulas</a>'
    + '<a href="' + BASE + '/sources/">Sources</a></div></span>'
    + '</nav>'
    + '<a class="cta" href="' + BASE + '/desk/">Open the desk</a>'
    + '</div></header>';
}
function chromeFoot() {
  return '<footer class="site"><div class="foot">'
    + '<div><a href="' + BASE + '/"><img class="logo" src="' + BASE + '/logo.png" alt="JUROSpain"></a>'
    + '<p class="muted" style="margin-top:14px">Self-serve desk for two Spanish residencies. A scan stays in your file and is not sent to a consulate, UGE-CE, or anyone else until you buy lodging. You can delete it.</p></div>'
    + '<div><h3>The desk</h3><a href="' + BASE + '/desk/">Your file</a><a href="' + BASE + '/templates/">Templates</a><a href="' + BASE + '/digital-nomad/">Digital nomad</a><a href="' + BASE + '/non-lucrative/">Non-lucrative</a><a href="' + BASE + '/plans/">Services</a></div>'
    + '<div><h3>Build a file</h3><p class="muted">Three months of desk access. The sources stay free.</p><p><a class="btn" href="' + BASE + '/plans/">See services</a></p></div>'
    + '</div></footer>';
}
