window.markdownToHTML = function(md){
    // Zensur
    html = html.toLowerCase().trim().replace("fuck", "####");
    html = html.toLowerCase().trim().replace("Fucking", "#######");
    html = html.toLowerCase().trim().replace("hurensohn", "#########");
    html = html.toLowerCase().trim().replace("basdart", "#######");
    html = html.toLowerCase().trim().replace("arsch", "#####");
    html = html.toLowerCase().trim().replace("arschloch", "#########");
    html = html.toLowerCase().trim().replace("hs", "##");
    html = html.toLowerCase().trim().replace("test_zensur", "####");
    html = html.toLowerCase().trim().replace("hure", "####");
    html = html.toLowerCase().trim().replace("pisser", "######");
    html = html.toLowerCase().trim().replace("pisserin", "########");
    html = html.toLowerCase().trim().replace("jonas", "stinkt");
    html = html.toLowerCase().trim().replace("nutte", "#####");
    html = html.toLowerCase().trim().replace("wichser", "#######");
    html = html.toLowerCase().trim().replace("🖕", "Nimm den Finger Runter");
    html = html.toLowerCase().trim().replace("fotze", "#####");
};