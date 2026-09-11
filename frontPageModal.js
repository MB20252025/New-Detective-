// ============================================================
//  FRONT PAGE – The Daily Chronicle (news only)
// ============================================================
function showFrontPageModal() {
  const frontPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Daily Chronicle – Front Page</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#2c241f; font-family:"Times New Roman",Georgia,serif; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; min-height:100vh; }
    .newspaper { width:100%; max-width:1000px; padding:20px 16px; border:2px solid #111; background:#fff; font-family:"Times New Roman",serif; color:#111; }
    .header { text-align:center; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:14px; }
    .title { font-size:34px; font-weight:bold; letter-spacing:1.5px; }
    .meta { display:flex; justify-content:space-between; font-size:12px; margin-top:6px; font-weight:500; }
    .content { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .story { border-top:1px solid #222; padding-top:8px; margin-bottom:6px; }
    .headline { font-weight:800; font-size:16px; margin-bottom:5px; }
    .author {font-size: 11px; font-family:'Courier New', monospace;color: #6b4f3c;margin:2px 0 6px 0;font-style: italic; }
    .text { font-size:13px; line-height:1.42; text-align:justify; }
    .ad-box { background:#fcf7e3; border:1px solid #c7b27e; padding:8px 10px; margin-top:6px; text-align:center; font-family:'Courier New',monospace; font-size:12px; }
    .ad-title { font-weight:bold; font-size:14px; background:#e7dbbc; display:inline-block; padding:2px 10px; margin-bottom:8px; }
    .missing-dog { background:#fff4e6; border-left:5px solid #b45f2b; padding:6px 10px; }
    .missing-dog strong { color:#b45f2b; }
    .page-control { margin-top:12px; display:flex; justify-content:center; gap:12px; }
    .nav-btn { background:#2b2a27; border:none; color:#f9f2e0; font-family:system-ui,sans-serif; font-size:1rem; font-weight:600; padding:10px 24px; border-radius:60px; cursor:pointer; box-shadow:0 3px 8px rgba(0,0,0,0.2); transition:all 0.2s; }
    .nav-btn:hover { transform:translateY(-2px); box-shadow:0 5px 12px rgba(0,0,0,0.3); }
  </style>
</head>
<body>
<div class="newspaper">
  <div class="header">
    <div class="title">THE DAILY CHRONICLE</div>
    <div class="meta"><span>March 20, 2026</span><span>£1.50</span></div>
  </div>
  <div class="content">
    <div>
      <div class="story">
        <div class="headline">Professor Arthur Vale Disappears in Whitby</div>
        <div class="author">By Karla Censine, Senior Reporter</div>
        <div class="text">Professor Arthur Vale, 58, has disappeared from his Whitby home. Colleagues say he recently found evidence of a hidden map in the town's archives. He mentioned a mysterious figure called 'The Cartographer'," said Dr. Miriam Shaw. "He became secretive, then vanished." Vale's study was ransacked. Rare documents are missing. Police are appealing for witnesses and treating the case as a high-priority investigation. Officers are conducting extensive searches across Whitby and surrounding coastal areas. Anyone with information should contact Whitby Police immediately.</div>
      </div>
      <div class="story">
        <div class="headline">Woman Caught Talking To Her Plants "They Refuse To Listen"</div>
        <div class="author">By Paige Turner, Senior Features Writer</div>
        <div class="text">A resident admitted to giving motivational speeches to her houseplants. Neighbours reported they “remain stubbornly unmotivated,” despite promises of water and fertilizer bribes.</div>
      </div>
      <div class="story">
        <div class="headline">Star Bakery Sees Late Night Delivery Spike</div>
        <div class="author">By Bill Board, Advertising & Media Reporter</div>
        <div class="text">A small bakery in Lincoln has unexpectedly become a late-night hotspot after extending its hours to serve shift workers and night owls. Key Owner Lila Grant said the idea came after noticing empty streets but growing online demand. “People wanted fresh pastries at odd hours,” she explained. Since then, star Bakery has seen a strange spike in late-night deliveries that appear to arrive even when no orders were placed. Staff have begun joking that the bakery is “on star mode all night,” with croissants allegedly disappearing faster than they can be counted. Locals have praised the welcoming atmosphere, though some admit the bread now feels “suspiciously enthusiastic.” City officials are monitoring the trend as staff continue insisting nothing unusual is happening, despite the ovens occasionally “working overtime on their own.”</div>
      </div>
      <div class="story">
        <div class="headline">Local Chef Arrested for triangular Pizza Experiment</div>
        <div class="author">By Chris P. Bacon, Food & Lifestyle Editor</div>
        <div class="text">A local chef has been arrested after a controversial triangular pizza experiment caused unexpected chaos in a city restaurant. Head chef Marco Bellini said the idea came from a “harmless attempt to challenge traditional pizza geometry,” claiming customers were “ready for evolution.” Police were called after diners reported being served slices that did not fit on any standard plate and appeared to “reject circular reality entirely.” Stone based pizza described by one witness as “emotionally unsettling but weirdly tasty.” The restaurant has since been closed for inspection, while officials investigate whether triangular food shapes pose a threat to public order or just to common sense.</div>
      </div>
      <div class="story">
        <div class="headline">📢 LOCAL ADVERTISER</div>
        <div class="ad-box">
          <div class="ad-title">✦ WHITBY ANTIQUARIAN BOOKS ✦</div>
          <div>Rare maps, forgotten journals & peculiar curiosities.<br><strong>20% off</strong> for Chronicle readers!<br>📍 7 Church Street, Whitby<br>☎ 01947 602341</div>
          <div style="margin-top:6px; font-size:10px;">"Where history hides in plain sight."</div>
        </div>
      </div>
    </div>
    <div>
      <div class="story">
        <div class="headline">Lost Dog Travels 40 Miles to Find Owner</div>
        <div class="author">By Anita Report, Investigative Journalist</div>
        <div class="text">A Labrador named Max has amazed residents after traveling nearly 40 miles to reunite with his owner. The dog went missing during a camping trip but was later found waiting outside his owner's former home. Neighbours recognised Max and contacted local authorities, who scanned his microchip. Experts believe the dog followed familiar scents and landmarks. "It's incredible loyalty," said one volunteer. Max has since been safely returned and is recovering well, with his owner calling the reunion "nothing short of a miracle."</div>
      </div>
      <div class="story">
        <div class="headline">Students Build Solar Car from Scrap Materials</div>
        <div class="author">By Al Beback, Field Correspondent</div>
        <div class="text">A group of engineering students has built a fully functioning solar-powered car using mostly recycled materials. The project, completed over six months, aimed to highlight sustainable innovation on a budget. Team leader Aisha Khan said the biggest challenge was balancing efficiency with durability. The car successfully completed a 15-mile test drive, impressing local sponsors and university staff. Plans are now underway to refine the design and enter it into a national competition. The team hopes their work will inspire others to explore green technology solutions.</div>
      </div>
      <div class="story">
        <div class="headline">Man Brings Ladder To Pub - Claims "Drinks Were On The House"</div>
        <div class="author">By Justin Case, Breaking News Reporter</div>
        <div class="text">A local man caused confusion last night after arriving at a pub carrying a ladder. When questioned, he calmly explained he'd heard the drinks were “on the house” and didn't want to miss out. Staff asked him to leave shortly after he tried to climb behind the bar.</div>
      </div>
      <div class="story">
        <div class="headline">Scientists Confirm Round Objects Roll More Than Square Ones</div>
        <div class="author">By Drew Peacock, Political Analyst</div>
        <div class="text">Scientists have confirmed that round objects roll more than square ones in what experts are calling the most expensive obvious discovery in modern science. The three-year study tested items including apples, wheels, and a very confident dinner plate that refused to cooperate on principle. Lead researcher Dr Helen Moore said, “We suspected round things would roll, but we didn't expect them to show off about it.” Square objects reportedly failed every test, with one cube described as “emotionally stable but physically disappointing.” One assistant added that the wheels “kept rolling away mid-experiment like they had somewhere better to be.” USB measurements were used to confirm rolling consistency across all test objects.The findings have sparked public outrage over funding, while officials defended the research, stating it was important to confirm what everyone already knew before school.</div>
      </div>
      <div class="story">
        <div class="headline">🐕 MISSING: HAVE YOU SEEN BAILEY?</div>
        <div class="missing-dog"><strong>Bailey</strong> – 3‑year‑old Border Collie, black & white, one blue eye. Went missing near Whitby Abbey on March 18. Very friendly, responds to name. Family is heartbroken. <strong>Reward £200</strong> for safe return.<br>📞 Call Jess: 07700 123456 or Whitby Police.<br><span style="font-size:11px;">Please share – last seen near the Old Coastguard path.</span></div>
      </div>
    </div>
  </div>
  <div class="page-control">
    <button class="nav-btn" id="goToBackPage">📖 TURN TO BACK PAGE (PUZZLES)</button>
  </div>
</div>
<script>
  document.getElementById('goToBackPage').addEventListener('click', function() {
    const modal = document.querySelector('div[style*="position:fixed"][style*="z-index:10000"]');
    if (modal) modal.remove();
    if (window.parent && typeof window.parent.showBackPageModal === 'function') {
      window.parent.showBackPageModal();
    } else if (typeof window.showBackPageModal === 'function') {
      window.showBackPageModal();
    } else {
      try {
        if (window.parent && window.parent.game) {
          window.parent.showBackPageModal();
        }
      } catch(e) {
        alert('Back page modal not loaded. Please check your files.');
      }
    }
  });
</script>
</body>
</html>`;

  // Create the modal overlay
  const modalDiv = document.createElement('div');
  modalDiv.style.position = 'fixed';
  modalDiv.style.top = '0';
  modalDiv.style.left = '0';
  modalDiv.style.width = '100%';
  modalDiv.style.height = '100%';
  modalDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
  modalDiv.style.zIndex = '10000';
  modalDiv.style.display = 'flex';
  modalDiv.style.alignItems = 'center';
  modalDiv.style.justifyContent = 'center';
  modalDiv.style.padding = '20px';

  const container = document.createElement('div');
  container.style.backgroundColor = '#fff';
  container.style.borderRadius = '20px';
  container.style.maxWidth = '1100px';
  container.style.width = '95%';
  container.style.maxHeight = '95%';
  container.style.overflow = 'auto';
  container.style.position = 'relative';
  container.style.boxShadow = '0 20px 40px rgba(0,0,0,0.5)';

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = 'auto';
  iframe.style.minHeight = '700px';
  iframe.style.border = 'none';
  iframe.srcdoc = frontPageHTML;
  container.appendChild(iframe);

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✖';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '12px';
  closeBtn.style.right = '16px';
  closeBtn.style.zIndex = '10001';
  closeBtn.style.background = '#a13d3d';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '28px';
  closeBtn.style.width = '44px';
  closeBtn.style.height = '44px';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  closeBtn.style.display = 'flex';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.justifyContent = 'center';

  container.appendChild(closeBtn);
  modalDiv.appendChild(container);
  document.body.appendChild(modalDiv);

  closeBtn.onclick = () => modalDiv.remove();
  modalDiv.onclick = (e) => { if (e.target === modalDiv) modalDiv.remove(); };
}