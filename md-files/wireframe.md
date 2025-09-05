# Create an interactive HTML/CSS/JS wireframe prototype for G2C3M1
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>G2C3M1 – Whole & Part of a Whole (Wireframes)</title>
<style>
  :root{
    --bg:#0e1726;
    --card:#111a2b;
    --ink:#e6edf7;
    --muted:#9fb3c8;
    --accent:#ffb703;
    --success:#26a269;
    --error:#e63946;
    --cta:#457b9d;
    --cta-ink:#ffffff;
    --line:#f4a261;
    --tick:#ffffff;
    --panel:#0b1320;
  }
  *{box-sizing:border-box}
  html,body{height:100%;margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Ubuntu,'Helvetica Neue',Arial}
  /* 16:9 responsive wrapper */
  .outer{
    position:fixed; inset:0; display:grid; place-items:center;
    background:
      radial-gradient(1200px 800px at 10% 10%, #17243a 0%, transparent 60%),
      radial-gradient(1000px 700px at 90% 90%, #16243a 0%, transparent 60%),
      var(--bg);
  }
  .stage-wrap{
    width:1920px; height:1080px;
    transform-origin: top left;
    box-shadow: 0 20px 60px rgba(0,0,0,.4);
    border-radius: 16px;
    overflow: hidden;
    background: linear-gradient(180deg,#0f1b2f 0%, #0c1626 100%);
    position:relative;
  }
  /* Top bar */
  .topbar{
    height:84px; display:flex; align-items:center; justify-content:space-between;
    padding:0 28px; background:linear-gradient(180deg,#0d1728,#0b1422);
    border-bottom:1px solid #1a2740;
  }
  .brand{display:flex;gap:16px;align-items:center}
  .brand-badge{
    width:44px; height:44px; border-radius:10px; display:grid; place-items:center;
    background:#13233d; border:1px solid #203355; font-weight:700; letter-spacing:.5px; color:#9dd0ff;
  }
  .title{font-weight:700; font-size:24px}
  .progress{font-size:16px; color:var(--muted)}
  .kbd-hint{font-size:14px; color:#7ca2c6}
  /* Layout: left instructions / center canvas / right side panel */
  .grid{
    display:grid; grid-template-columns: 520px 1fr 520px; gap:12px;
    height:calc(100% - 84px - 86px); /* minus topbar & bottombar */
    padding:16px;
  }
  .panel{background:var(--panel); border:1px solid #1a2740; border-radius:16px; padding:20px; overflow:auto}
  .panel h3{margin:0 0 10px 0; font-size:20px}
  .panel p{margin:8px 0; color:var(--muted)}
  .stage{
    position:relative; background:#0f1b2f; border:1px dashed #234; border-radius:16px;
    display:grid; place-items:center; overflow:hidden;
  }
  /* Bottom bar */
  .bottombar{
    height:86px; display:flex; align-items:center; justify-content:space-between;
    padding:0 24px; background:linear-gradient(180deg,#0b1320,#09101b);
    border-top:1px solid #1a2740;
  }
  .nav{display:flex; gap:12px; align-items:center}
  button{
    background:var(--cta); border:none; color:var(--cta-ink); padding:14px 22px; border-radius:12px;
    font-size:18px; font-weight:700; cursor:pointer; transition:.2s transform ease, .2s opacity ease, .3s box-shadow ease;
    box-shadow: 0 8px 20px rgba(69,123,157,.35);
  }
  button[disabled]{opacity:.45; cursor:not-allowed; box-shadow:none}
  button:active{transform:translateY(1px)}
  .ghost{background:transparent; border:1px solid #25425e; color:#bcd1e7; box-shadow:none}
  .pill{
    border-radius:999px; padding:8px 12px; font-size:14px; border:1px solid #25425e; color:#bcd1e7; background:#0f1b2f;
  }
  .state{display:flex; gap:8px; align-items:center}
  .dot{width:10px;height:10px;border-radius:50%}
  .dot.success{background:var(--success)}
  .dot.error{background:var(--error)}
  .dot.active{background:var(--accent)}
  .legend{display:flex; gap:10px; align-items:center; color:var(--muted)}
  /* Tools */
  .toolbar{display:flex; gap:10px; flex-wrap:wrap; margin-top:8px}
  .tool{
    display:flex; gap:10px; align-items:center; padding:10px 12px; border-radius:10px;
    border:1px solid #25425e; background:#0f1b2f; cursor:pointer; user-select:none;
  }
  .tool.active{outline:2px solid var(--accent); box-shadow: 0 0 0 4px rgba(255,183,3,.15)}
  .check{display:inline-block; min-width:100px; text-align:center}
  /* Stage primitives (wireframe shapes) */
  .cheesecake, .pizza, .cookie{
    position:relative; display:block;
  }
  .cheesecake.whole{
    width:520px; height:320px; background:#f2d7a0; border:6px solid #b88746; border-radius:22px;
    box-shadow: inset 0 0 0 12px rgba(255,255,255,.18), 0 10px 30px rgba(0,0,0,.35);
  }
  .cheesecake.halves{width:560px; height:360px; display:flex; gap:20px}
  .cheesecake .half{
    width:260px; height:320px; background:#f2d7a0; border:6px solid #b88746; border-radius:22px;
    box-shadow: inset 0 0 0 12px rgba(255,255,255,.18), 0 10px 30px rgba(0,0,0,.35);
  }
  .pizza.whole{
    width:520px; height:520px; border-radius:50%;
    background: radial-gradient(circle at 50% 50%, #ffd18c 0%, #f3b55d 55%, #b36b2e 56%, #b36b2e 60%, transparent 61%), #f3b55d;
    border:10px solid #8a4f1e; box-shadow: inset 0 0 0 18px rgba(255,255,255,.14), 0 10px 30px rgba(0,0,0,.35);
  }
  .pizza.quarters{
    position:relative; width:560px; height:560px;
  }
  .slice{
    position:absolute; width:50%; height:50%; transform-origin:bottom right; border-right:8px solid #8a4f1e; border-bottom:8px solid #8a4f1e;
    background:#f3b55d; clip-path: polygon(100% 100%, 0 100%, 100% 0);
    box-shadow: inset 0 0 0 14px rgba(255,255,255,.14), 0 6px 18px rgba(0,0,0,.35);
    cursor:pointer;
  }
  .slice:nth-child(1){ left:0; top:0; transform: rotate(0deg) translate(0,0); }
  .slice:nth-child(2){ right:0; top:0; transform: rotate(90deg) translate(0,0); }
  .slice:nth-child(3){ right:0; bottom:0; transform: rotate(180deg) translate(0,0); }
  .slice:nth-child(4){ left:0; bottom:0; transform: rotate(270deg) translate(0,0); }
  .slice.counted{outline:4px solid var(--accent)}
  /* Drag helpers */
  .draggable{touch-action:none}
  .dropzone{
    position:absolute; outline:2px dashed #345a7f; border-radius:16px;
  }
  /* Cookie states */
  .cookie.full{
    width:360px; height:360px; border-radius:50%; background:#d6a55a; border:10px solid #8a4f1e;
    box-shadow: inset 0 0 0 14px rgba(255,255,255,.12), 0 10px 30px rgba(0,0,0,.35);
  }
  .cookie.piece{
    width:260px; height:260px; border-radius:50%; background: conic-gradient(from 0deg, #d6a55a 0 60deg, transparent 60deg),
      #0000; position:relative;
  }
  .cookie.piece::before{
    content:""; position:absolute; inset:0; border-radius:50%; border:10px solid #8a4f1e; clip-path: polygon(50% 50%, 100% 0, 100% 100%);
  }
  /* Labels & callouts */
  .callout{
    position:absolute; top:24px; left:24px; background:#12243f; border:1px solid #25425e; border-radius:12px; padding:10px 14px;
    color:#bcd1e7; font-size:16px;
  }
  .badge{
    display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:999px; background:#142844; border:1px solid #27496b;
    color:#cde3fb; font-size:14px; margin-right:8px;
  }
  .feedback{
    margin-top:12px; padding:12px; border-radius:12px; background:#10223b; border:1px solid #203a5f; color:#cde3fb;
  }
  .feedback.success{border-color:#2a6f4e; background:#0f2a22}
  .feedback.error{border-color:#6f2a2a; background:#2a0f13}
  .success-text{color:var(--success); font-weight:700}
  .error-text{color:var(--error); font-weight:700}
  /* Scene helper text */
  .scene-title{font-size:22px; font-weight:800; margin:0 0 6px 0}
  .scene-sub{font-size:16px; color:var(--muted); margin:0 0 18px 0}
  .list{margin:0; padding-left:18px; color:var(--muted)}
  .spacer{height:10px}
  .sr{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0)}
</style>
</head>
<body>
<div class="outer">
  <div id="stageWrap" class="stage-wrap">
    <div class="topbar">
      <div class="brand">
        <div class="brand-badge">G2</div>
        <div>
          <div class="title">Whole & Part of a Whole</div>
          <div class="progress" id="progress">Scene 1 / 16</div>
        </div>
      </div>
      <div class="kbd-hint">Use ← / → to navigate • Click / tap to interact</div>
    </div>

    <div class="grid">
      <div class="panel" id="leftPanel">
        <!-- Filled per scene -->
      </div>
      <div class="stage" id="stage">
        <!-- Interactive canvas per scene -->
      </div>
      <div class="panel" id="rightPanel">
        <!-- Filled per scene -->
      </div>
    </div>

    <div class="bottombar">
      <div class="legend">
        <span class="pill">16:9 Responsive</span>
        <span class="pill">Offline-ready</span>
        <span class="pill">Wireframe prototype</span>
      </div>
      <div class="nav">
        <button class="ghost" id="prevBtn">◀ Previous</button>
        <button id="nextBtn">Next ▶</button>
      </div>
    </div>
  </div>
</div>

<script>
/* --- Responsive 16:9 scaling --- */
const baseW = 1920, baseH = 1080;
function fit(){
  const wrap = document.getElementById('stageWrap');
  const w = window.innerWidth, h = window.innerHeight;
  const scale = Math.min(w / baseW, h / baseH);
  wrap.style.transform = `scale(${scale}) translate(calc((100vw - ${baseW}px)/${2*scale}), calc((100vh - ${baseH}px)/${2*scale}))`;
}
window.addEventListener('resize', fit); fit();

/* --- Simple Scene System --- */
let SCENE_INDEX = 0;

const $ = (sel, root=document)=> root.querySelector(sel);
function el(tag, attrs={}, children=[]) {
  const e = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of (Array.isArray(children) ? children : [children])) {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  }
  return e;
}

function setPanels({leftTitle,leftBody,rightTitle,rightBody}){
  const left = $("#leftPanel"); const right = $("#rightPanel");
  left.innerHTML = ""; right.innerHTML = "";
  left.append(
    el("h3",{}, leftTitle ? [leftTitle] : ["Question / Context"]),
    el("div",{}, leftBody || [])
  );
  right.append(
    el("h3",{}, rightTitle ? [rightTitle] : ["Interaction & Feedback"]),
    el("div",{}, rightBody || [])
  );
}

function setProgress(){
  $("#progress").textContent = `Scene ${SCENE_INDEX+1} / ${SCENES.length}`;
  $("#prevBtn").disabled = SCENE_INDEX === 0;
  // Next might be gated by scene logic; set as default enabled and allow scene to override
  $("#nextBtn").disabled = false;
}

function goto(idx){
  SCENE_INDEX = Math.max(0, Math.min(idx, SCENES.length-1));
  renderScene();
}

/* --- Helpers: drag, snapping --- */
function makeDraggable(node, onMove, onEnd){
  node.classList.add('draggable');
  let dragging = false, sx=0, sy=0, ox=0, oy=0;
  const down = (ev)=>{
    dragging = true;
    const pt = ('touches' in ev) ? ev.touches[0] : ev;
    sx = pt.clientX; sy = pt.clientY;
    const rect = node.getBoundingClientRect();
    ox = rect.left; oy = rect.top;
    node.style.transition = 'none';
    ev.preventDefault();
  };
  const move = (ev)=>{
    if(!dragging) return;
    const pt = ('touches' in ev) ? ev.touches[0] : ev;
    const dx = pt.clientX - sx;
    const dy = pt.clientY - sy;
    const nx = ox + dx; const ny = oy + dy;
    node.style.left = nx + 'px';
    node.style.top = ny + 'px';
    if(onMove) onMove({x:nx,y:ny,node});
  };
  const up = ()=>{
    if(!dragging) return;
    dragging = false;
    node.style.transition = '';
    if(onEnd) onEnd();
  };
  node.addEventListener('mousedown', down);
  node.addEventListener('touchstart', down, {passive:false});
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('mouseup', up);
  window.addEventListener('touchend', up);
}

/* --- Scenes --- */
const SCENES = [
  // 0. Intro / Orders
  function(){
    setPanels({
      leftTitle:"Here’s what they ordered!",
      leftBody: el("p",{},["Tap ▶ to see what Dee Tee, Jax, and Jane are up to!"]),
      rightTitle:"",
      rightBody: el("div",{},[
        el("p",{},["This prototype is a ",
          el("strong",{},["wireframe"]),
          " for flows, placement and interactions."
        ]),
        el("div",{class:"feedback"},["Use Next to advance scenes."])
      ])
    });
    const stage = $("#stage"); stage.innerHTML = "";
    stage.append(
      el("div",{class:"callout"},[
        el("span",{class:"badge"},["Cheesecake"]), 
        el("span",{class:"badge"},["Pizza"]), 
        el("span",{class:"badge"},["Cookie"])
      ]),
      el("div",{},[
        el("div",{class:"scene-title"},["Whole & Part – Story Setup"]),
        el("div",{class:"scene-sub"},["Characters: Dee Tee, Jax, Jane at Cheesecake Center"])
      ])
    );
  },

  // 1. Cheesecake – cut into 2
  function(){
    let cutDone = false;
    setPanels({
      leftTitle:"I love cheesecake! Let’s start with that.",
      leftBody: el("div",{},[
        el("p",{},["“I want to cut the cake into 2 pieces!”"]),
        el("ul",{class:"list"},[
          el("li",{},["Tap the slicer, then tap the cheesecake."]),
          el("li",{},["Next is enabled after you cut into 2."]),
        ])
      ]),
      rightTitle:"Tools",
      rightBody: (function(){
        const slicer = el("div",{class:"tool", id:"slicerTool"},[el("span",{},["🔪"]), el("strong",{},["Slicer (2 parts)"])]);
        slicer.addEventListener('click',()=> slicer.classList.toggle('active'));
        const fb = el("div",{class:"feedback"},["Select the slicer, then tap the cheesecake."]);
        const box = el("div",{},[slicer, fb]);
        box.update = (state)=>{
          fb.className = "feedback " + (state==="ok" ? "success" : "");
          fb.textContent = (state==="ok" ? "Great! Cheesecake cut into 2 parts." : "Select the slicer, then tap the cheesecake.");
        };
        return box;
      })()
    });

    const stage = $("#stage"); stage.innerHTML = "";

    const whole = el("div",{class:"cheesecake whole", id:"cakeWhole"});
    const halvesWrap = el("div",{class:"cheesecake halves", id:"cakeHalves", style:"display:none"});
    halvesWrap.append(el("div",{class:"half"}), el("div",{class:"half"}));

    const hint = el("div",{class:"callout"},["Tap cake while the slicer is active"]);
    stage.append(hint, whole, halvesWrap);

    stage.addEventListener('click', (ev)=>{
      const tool = $("#slicerTool");
      if(!tool || !tool.classList.contains('active')) return;
      if(ev.target === whole){
        whole.style.display = "none";
        halvesWrap.style.display = "flex";
        cutDone = true;
        $("#rightPanel > div").update("ok");
        $("#nextBtn").disabled = false;
      }
    });

    // gate Next until cut
    $("#nextBtn").disabled = !cutDone;
  },

  // 2. Cheesecake – Nice work message
  function(){
    setPanels({
      leftTitle:"Nice work, Jax!",
      leftBody: el("p",{},["You cut the ", el("strong",{},["whole"]), " cheesecake into parts."]),
      rightTitle:"Segue",
      rightBody: el("div",{class:"feedback success"},["Tap Next to learn about 'Whole' and 'Part'."])
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const halvesWrap = el("div",{class:"cheesecake halves"});
    halvesWrap.append(el("div",{class:"half"}), el("div",{class:"half"}));
    stage.append(halvesWrap);
  },

  // 3. Whole = one complete object
  function(){
    setPanels({
      leftTitle:"Concept: Whole",
      leftBody: el("div",{},[
        el("p",{},["In math, when we have the complete object, we call it a ", el("strong",{},["whole"]), "."]),
        el("div",{class:"feedback"},[el("span",{class:"success-text"},["Whole = "]), "One complete object!"]),
      ]),
      rightTitle:"",
      rightBody: el("div",{},[
        el("p",{},["Tap Next to see what a part is."])
      ])
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const whole = el("div",{class:"cheesecake whole"});
    stage.append(whole);
  },

  // 4. Part = a piece of the object
  function(){
    setPanels({
      leftTitle:"Concept: Part",
      leftBody: el("div",{},[
        el("p",{},["When a whole is cut into pieces, each piece is called a ", el("strong",{},["part"]), "."]),
        el("div",{class:"feedback"},[el("span",{class:"success-text"},["Part = "]), "A piece of the object!"]),
      ]),
      rightTitle:"",
      rightBody: el("div",{},[el("p",{},["Tap Next to try bringing parts together."])])
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const halves = el("div",{class:"cheesecake halves"}); halves.append(el("div",{class:"half"}), el("div",{class:"half"}));
    stage.append(halves);
  },

  // 5. Cheesecake – Drag parts together to make whole
  function(){
    setPanels({
      leftTitle:"Do all parts make the whole again?",
      leftBody: el("p",{},["Drag each part to bring them together."]),
      rightTitle:"Feedback",
      rightBody: (function(){
        const fb = el("div",{class:"feedback"},["Arrange the two parts so they touch."]);
        fb.update = (ok)=>{
          fb.className = "feedback " + (ok ? "success":"");
          fb.textContent = ok ? "Yay! All the parts together make the whole again." : "Arrange the two parts so they touch.";
        };
        return fb;
      })()
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const area = el("div",{style:"position:relative; width:900px; height:380px;"});
    const p1 = el("div",{class:"half", style:"position:absolute; left:40px; top:30px"});
    const p2 = el("div",{class:"half", style:"position:absolute; right:40px; top:30px"});
    area.append(p1,p2);
    stage.append(area);

    const checkTogether = ()=>{
      const r1 = p1.getBoundingClientRect(), r2 = p2.getBoundingClientRect();
      const touching = Math.abs((r1.left + r1.width) - r2.left) < 24 && Math.abs(r1.top - r2.top) < 30;
      $("#rightPanel > div").update(touching);
      $("#nextBtn").disabled = !touching;
    };
    makeDraggable(p1, checkTogether, checkTogether);
    makeDraggable(p2, checkTogether, checkTogether);
    $("#nextBtn").disabled = true;
  },

  // 6. Bridge: go to pizza
  function(){
    setPanels({
      leftTitle:"What happens with pizza?",
      leftBody: el("p",{},["Tap Next to see what they do with pizza."]),
      rightTitle:"",
      rightBody: el("div",{class:"feedback"},["We will cut pizza and count parts."])
    });
    const stage = $("#stage"); stage.innerHTML = "";
    stage.append(el("div",{class:"scene-title"},["Next: Pizza Activity"]));
  },

  // 7. Pizza – cut
  function(){
    let cutDone = false;
    setPanels({
      leftTitle:"Let’s eat pizza!",
      leftBody: el("div",{},[
        el("p",{},["Cut the pizza into pieces!"]),
        el("ul",{class:"list"},[el("li",{},["Tap slicer then tap the pizza. (Creates 4 parts)"])])
      ]),
      rightTitle:"Tools",
      rightBody:(function(){
        const slicer = el("div",{class:"tool", id:"slicerTool2"},[el("span",{},["🔪"]), el("strong",{},["Slicer (4 parts)"])]);
        slicer.addEventListener('click',()=> slicer.classList.toggle('active'));
        const fb = el("div",{class:"feedback"},["Select the slicer, then tap the pizza."]);
        const box = el("div",{},[slicer, fb]); box.update = (ok)=>{
          fb.className="feedback " + (ok?"success":""); fb.textContent = ok? "Great! Pizza cut into 4 parts.":"Select the slicer, then tap the pizza.";
        }; return box;
      })()
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const whole = el("div",{class:"pizza whole", id:"pizzaWhole"});
    const quarters = el("div",{class:"pizza quarters", id:"pizzaQuarters", style:"display:none"});
    for(let i=0;i<4;i++) quarters.append(el("div",{class:"slice", "data-idx":i}));
    stage.append(whole,quarters, el("div",{class:"callout"},["Tap pizza while slicer is active"]));

    stage.addEventListener('click',(ev)=>{
      const t = $("#slicerTool2");
      if(!t || !t.classList.contains('active')) return;
      if(ev.target === whole){
        whole.style.display="none"; quarters.style.display="block";
        cutDone = true;
        $("#rightPanel > div").update(true);
        $("#nextBtn").disabled = false;
      }
    });
    $("#nextBtn").disabled = !cutDone;
  },

  // 8. Pizza – prompt count
  function(){
    setPanels({
      leftTitle:"How many parts is this, Dee Tee?",
      leftBody: el("p",{},["Tap each slice to count them."]),
      rightTitle:"Counting",
      rightBody: el("div",{class:"feedback"},["Tap slices in any order to count Part 1 to Part 4."])
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const quarters = el("div",{class:"pizza quarters"});
    const info = el("div",{class:"callout", id:"countLabel"},["Count: 0"]);
    stage.append(info, quarters);

    let count = 0;
    for(let i=0;i<4;i++){
      const s = el("div",{class:"slice"});
      s.addEventListener('click',()=>{
        if(!s.classList.contains('counted')){
          s.classList.add('counted');
          count++;
          info.textContent = `Count: ${count} (${count===1?'Part 1':count===2?'Part 2':count===3?'Part 3':'Part 4'})`;
          if(count===4){
            $("#nextBtn").disabled = false;
            $("#rightPanel .feedback").classList.add('success');
            $("#rightPanel .feedback").textContent = "Yay! The pizza is cut into 4 parts.";
          }
        }
      });
      quarters.append(s);
    }
    $("#nextBtn").disabled = true;
  },

  // 9. Pizza – drag to make whole
  function(){
    setPanels({
      leftTitle:"Do 4 parts make the whole again?",
      leftBody: el("p",{},["Drag each part to bring them together."]),
      rightTitle:"Feedback",
      rightBody:(function(){
        const fb = el("div",{class:"feedback"},["Assemble all 4 slices into the dashed square."]);
        fb.update = (ok)=>{ fb.className="feedback " + (ok?"success":""); fb.textContent = ok? "Great! All parts together make the whole again.":"Assemble all 4 slices into the dashed square."; };
        return fb;
      })()
    });
    const stage = $("#stage"); stage.innerHTML = "";
    const box = el("div",{class:"dropzone", id:"drop", style:"width:600px; height:600px; left:50%; top:50%; transform:translate(-50%,-50%);"});
    stage.append(box);

    // Create 4 free slices (draggable)
    const slices = [];
    for(let i=0;i<4;i++){
      const s = el("div",{class:"slice", style:`left:${50 + i*110}px; top:${60 + (i%2)*220}px;`});
      stage.append(s); slices.push(s);
      makeDraggable(s, null, check);
    }

    function inside(elA, elB){
      const a = elA.getBoundingClientRect(), b = elB.getBoundingClientRect();
      return a.left > b.left && a.right < b.right && a.top > b.top && a.bottom < b.bottom;
    }
    function check(){
      const ok = slices.every(s=> inside(s, box));
      $("#rightPanel > div").update(ok);
      $("#nextBtn").disabled = !ok;
    }
    $("#nextBtn").disabled = true;
  },

  // 10. Bridge to cookie quiz
  function(){
    setPanels({
      leftTitle:"Quick Check with Cookies",
      leftBody: el("p",{},["Tap Next to try identifying whole vs part."]),
      rightTitle:"",
      rightBody: el("div",{class:"feedback"},["3 quick questions with instant feedback."])
    });
    $("#stage").innerHTML = "";
  },

  // 11. Cookie Q1 – piece (expect PART)
  function(){
    sceneCookieQuiz({
      prompt:"Look at the cookie — is it a whole or just a part?",
      variant:"piece",
      correct:"Part",
      wrongHint:"Look closely — that’s just a piece, not the whole cookie. Try again!",
      success:"That’s correct — it’s just a piece of cookie. So, it’s a part of a whole."
    });
  },

  // 12. Cookie Q2 – full (expect WHOLE)
  function(){
    sceneCookieQuiz({
      prompt:"Look at this cookie — is it a whole or just a part?",
      variant:"full",
      correct:"Whole",
      wrongHint:"Look closely — it’s a complete cookie, not just a piece. Try again!",
      success:"That’s correct — it’s a complete cookie. So, it’s a whole."
    });
  },

  // 13. Cookie Q3 – piece (expect PART)
  function(){
    sceneCookieQuiz({
      prompt:"Lastly look at this one — is it a whole or just a part?",
      variant:"piece",
      correct:"Part",
      wrongHint:"Look closely — that’s just a piece, not the whole cookie. Try again!",
      success:"That’s correct — it’s just a piece of cookie. So, it’s a part of a whole."
    });
  },

  // 14. Summary
  function(){
    setPanels({
      leftTitle:"We learnt!",
      leftBody: el("ul",{class:"list"},[
        el("li",{},[el("strong",{},["Whole = "]), "One complete object!"]),
        el("li",{},[el("strong",{},["Part = "]), "A piece of the object."]),
        el("li",{},["All the parts together make the whole again."]),
      ]),
      rightTitle:"Restart",
      rightBody: (function(){
        const fb = el("div",{class:"feedback success"},["You completed the module!"]);
        const btn = el("button",{style:"margin-top:10px"},["Start Over"]);
        btn.addEventListener('click',()=> goto(0));
        return el("div",{},[fb, btn]);
      })()
    });
    const stage = $("#stage"); stage.innerHTML = "";
    stage.append(el("div",{class:"scene-title"},["Completion"]));
  },

  // 15. End spacer
  function(){
    setPanels({
      leftTitle:" ",
      leftBody: el("p",{},["End of wireframes."]),
      rightTitle:" ",
      rightBody: el("p",{},["Use 'Start Over' in previous scene to replay."])
    });
    $("#stage").innerHTML = "";
  },
];

/* Cookie quiz scene factory */
function sceneCookieQuiz({prompt, variant, correct, wrongHint, success}){
  let answered = false;
  setPanels({
    leftTitle:"Quick Quiz",
    leftBody: el("p",{},[prompt]),
    rightTitle:"Your Answer",
    rightBody:(function(){
      const fb = el("div",{class:"feedback"},["Select Whole or Part."]);
      fb.update = (ok,wrong)=>{
        fb.className = "feedback " + (ok ? "success" : (wrong ? "error" : ""));
        fb.textContent = ok ? success : (wrong ? wrongHint : "Select Whole or Part.");
      };
      const btnRow = el("div",{class:"toolbar"},[]);
      const btnWhole = el("button",{class:"ghost"},["Whole"]);
      const btnPart  = el("button",{class:"ghost"},["Part"]);
      btnRow.append(btnWhole, btnPart);
      const box = el("div",{},[btnRow, fb]);
      function click(label){
        if(answered) return;
        const ok = label === correct;
        fb.update(ok, !ok);
        if(ok){ answered = true; $("#nextBtn").disabled = false; }
      }
      btnWhole.addEventListener('click',()=> click("Whole"));
      btnPart.addEventListener('click',()=> click("Part"));
      box.update = fb.update;
      return box;
    })()
  });
  const stage = $("#stage"); stage.innerHTML = "";
  const cookie = el("div",{class:"cookie "+(variant==="full"?"full":"piece")});
  stage.append(cookie);
  $("#nextBtn").disabled = true;
}

/* Render controller */
function renderScene(){
  SCENES[SCENE_INDEX]();
  setProgress();
}
renderScene();

/* Nav controls */
$("#prevBtn").addEventListener('click',()=> goto(SCENE_INDEX-1));
$("#nextBtn").addEventListener('click',()=> goto(SCENE_INDEX+1));
window.addEventListener('keydown',(e)=>{
  if(e.key==="ArrowRight") goto(SCENE_INDEX+1);
  if(e.key==="ArrowLeft") goto(SCENE_INDEX-1);
});
</script>
</body>
</html>
