const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero=document.querySelector('.hero');
let bootSeen=false;try{bootSeen=sessionStorage.getItem('lyb-boot-seen')==='1'}catch{}
const showBoot=!reduced&&!location.hash&&!bootSeen;
if(!showBoot) hero.classList.add('hero-live');
else{
  const boot=document.createElement('div');
  boot.className='motion-boot';boot.setAttribute('aria-hidden','true');
  boot.innerHTML='<div class="boot-door"></div><div class="boot-door"></div><div class="boot-console"><div class="boot-status"><b>LYB / WAFER LAB</b><span>SYSTEM INITIALISING</span></div><div class="boot-dies">'+Array.from({length:45},(_,i)=>`<i class="boot-die" style="--i:${i}"></i>`).join('')+'</div><div class="boot-rail"><i></i></div></div>';
  document.body.prepend(boot);document.body.style.overflow='hidden';
  try{sessionStorage.setItem('lyb-boot-seen','1')}catch{}
  setTimeout(()=>{boot.classList.add('exit');hero.classList.add('hero-live');document.body.style.overflow=''},900);
  setTimeout(()=>boot.remove(),1600);
}
const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

const progress=document.querySelector('.progress i');
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?scrollY/max*100:0)+'%'},{passive:true});

const reveals=[...document.querySelectorAll('.reveal')];
if(reduced) reveals.forEach(x=>x.classList.add('visible'));
else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach((x,i)=>{x.style.transitionDelay=(i%4)*70+'ms';io.observe(x)})}

const sequences=[...document.querySelectorAll('.signal-sequence')];
if(reduced)sequences.forEach(x=>x.classList.add('signal-live'));
else{const sequenceObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('signal-live');sequenceObserver.unobserve(e.target)}}),{threshold:.22});sequences.forEach(x=>sequenceObserver.observe(x))}

const heroLab=document.querySelector('.hero-lab');
heroLab.addEventListener('pointermove',e=>{if(reduced||innerWidth<900)return;const r=heroLab.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;heroLab.style.setProperty('--px',`${x*18}px`);heroLab.style.setProperty('--py',`${y*18}px`)});
heroLab.addEventListener('pointerleave',()=>{heroLab.style.setProperty('--px','0px');heroLab.style.setProperty('--py','0px')});

const canvas=document.querySelector('#wafer'),ctx=canvas.getContext('2d');let width=0,height=0,dpr=1,cells=[];
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);buildCells()}
function buildCells(){cells=[];const size=Math.min(width,height)*.68,cell=size/11,gap=4,cx=width*.51,cy=height*.47;for(let row=-5;row<=5;row++)for(let col=-5;col<=5;col++){const x=cx+col*cell,y=cy+row*cell;if(Math.hypot(x-cx,y-cy)<size*.5)cells.push({x:x-cell*.43,y:y-cell*.43,s:cell-gap,row,col,seed:(row*13+col*7+50)%19})}}
function draw(time=0){ctx.clearRect(0,0,width,height);const cx=width*.51,cy=height*.47,r=Math.min(width,height)*.36;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.11);ctx.translate(-cx,-cy);ctx.fillStyle='#eafffa';ctx.strokeStyle='#092031';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.stroke();cells.forEach(c=>{const pulse=Math.sin(time/900+c.seed)*.5+.5;ctx.fillStyle=c.seed===0||c.seed===7?`rgba(255,189,74,${.62+pulse*.25})`:c.seed%5===0?`rgba(22,201,170,${.62+pulse*.22})`:'#ffffff';ctx.strokeStyle='#73bdb0';ctx.fillRect(c.x,c.y,c.s,c.s);ctx.strokeRect(c.x,c.y,c.s,c.s)});ctx.restore();ctx.strokeStyle='#16c9aa';ctx.globalAlpha=.18;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(cx,cy,r+18+i*18,Math.PI*1.06,Math.PI*1.94);ctx.stroke()}ctx.globalAlpha=1;if(!reduced)requestAnimationFrame(draw)}
resize();addEventListener('resize',resize);if(reduced)draw(0);else requestAnimationFrame(draw);

const count=document.querySelector('[data-count]');
const countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;countObserver.disconnect();if(reduced){count.textContent='7581';return}const start=performance.now(),duration=1200;function tick(now){const p=Math.min((now-start)/duration,1),ease=1-Math.pow(1-p,3);count.textContent=String(Math.round(7581*ease)).padStart(4,'0');if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}),{threshold:.7});countObserver.observe(count);

document.querySelectorAll('.year-card,.swot-card').forEach(card=>card.addEventListener('pointermove',e=>{if(reduced||innerWidth<900)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(800px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-6px)`}));
document.querySelectorAll('.year-card,.swot-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''));

const systemData={
  wafer:{index:'INSTRUMENT 01 / QUALITY GATE',domain:'Semiconductor analytics',title:'WaferPulse',summary:'An explainable quality-risk workflow connecting equipment traces, statistical controls and model evidence.',question:'Can high-risk wafers be identified before packaging adds more cost?',build:'A staged workflow combining data checks, SPC/PSI monitoring, anomaly detection, yield prediction and SHAP review.',evidence:'0.7581 R² for early final-test yield prediction; 0.8006 R² at wafer-average benchmark level.',reflection:'Useful automation must keep the engineer in the loop and make uncertainty visible.',metric:'0.8006',caption:'R² · wafer-average benchmark',stack:['SPC','PSI','SHAP','STREAMLIT'],link:'https://waferpulse.streamlit.app/',linkText:'Open live system ↗',mode:'wafer',flow:['TRACE','MODEL','ACTION']},
  etap:{index:'INSTRUMENT 02 / GRID STUDY',domain:'Power systems',title:'ETAP Network Study',summary:'A contingency-led power-flow study that tested cable loading, bus capacity, voltage and source power factor.',question:'How should a network be reinforced when one contingency pushes equipment beyond acceptable loading?',build:'Modelled operating cases in ETAP, compared power-flow results, sized the cable response and prepared an engineering handover.',evidence:'The selected upgrade reduced the reported cable loading to 88.5% while keeping the system case reviewable.',reflection:'A technically valid change still needs assumptions, contingencies and handover evidence to be useful to another engineer.',metric:'88.5%',caption:'reported cable loading after upgrade',stack:['ETAP','LOAD FLOW','CONTINGENCY','HANDOVER'],mode:'etap',flow:['GRID','CABLE','BUS']},
  micro:{index:'INSTRUMENT 03 / EMBEDDED CONTROL',domain:'Smart microgrid ecosystem',title:'Gravity Battery',summary:'An embedded energy-storage prototype integrating position safety, energy tracking, fuzzy control and real-time logging.',question:'Can a small gravity-storage demonstrator coordinate safe motion, energy measurement and adaptive control?',build:'Integrated ESP32 sensing, INA219 energy feedback, fuzzy control and MQTT/Node-RED exchange into one demonstrator.',evidence:'Produced a connected control loop with real-time state visibility rather than an isolated mechanical prototype.',reflection:'Energy systems are cyber-physical systems; safe limits and trustworthy telemetry matter as much as control logic.',metric:'MQTT',caption:'connected control and data exchange',stack:['ESP32','INA219','NODE-RED','FUZZY LOGIC'],mode:'micro',flow:['SENSOR','MQTT','DASHBOARD']},
  speech:{index:'INSTRUMENT 04 / SIGNAL LAB',domain:'Digital signal processing',title:'Speech Enhancement',summary:'A MATLAB workbench comparing classical, adaptive and neural approaches across controlled noise conditions.',question:'Which enhancement method remains intelligible across different noise conditions and trade-offs?',build:'Implemented and compared Wiener, MMSE, NLMS, IIR and CNN-based approaches in a common MATLAB evaluation workbench.',evidence:'Five methods were compared under controlled conditions rather than presenting one algorithm without a baseline.',reflection:'Performance must be judged against the noise context, computational cost and audible artefacts—not a metric alone.',metric:'05',caption:'enhancement methods compared',stack:['WIENER','MMSE','NLMS','CNN','IIR'],mode:'speech',flow:['NOISY','FILTER','SPEECH']},
  piezo:{index:'INSTRUMENT 05 / ENERGY CONVERSION',domain:'Power electronics',title:'Piezo Energy Harvester',summary:'A two-stage harvesting circuit combining a Cockcroft-Walton voltage doubler with a boost converter.',question:'How can a low-amplitude piezoelectric source be conditioned into a more useful electrical output?',build:'Modelled the transducer interface, Cockcroft-Walton voltage-doubling stage and downstream boost conversion in simulation.',evidence:'Compared the behaviour of two conversion stages and traced how component choices affect usable voltage and loss.',reflection:'Increasing voltage is not the same as maximizing harvested energy; loading and conversion losses must remain visible.',metric:'02',caption:'conversion stages modelled',stack:['LTSPICE','SIMULINK','VOLTAGE DOUBLER','BOOST'],mode:'piezo',flow:['PIEZO','DOUBLER','BOOST']},
  energy:{index:'INSTRUMENT 06 / SOFTWARE TOOL',domain:'Engineering software',title:'Smart Energy Monitor',summary:'A MATLAB application for device records, consumption visualisation, forecasting, home layout and solar simulation.',question:'How can household energy information move from raw device records to an understandable planning tool?',build:'Created an App Designer interface joining device management, consumption views, ARIMA forecasting and solar what-if simulation.',evidence:'Combined historical use, forward estimates and layout context in one workflow instead of separate calculation files.',reflection:'Forecasts need clear units, assumptions and error context before users can make responsible energy decisions.',metric:'ARIMA',caption:'usage forecasting workflow',stack:['MATLAB','APP DESIGNER','FORECAST','SIMULINK'],mode:'energy',flow:['DEVICE','FORECAST','SOLAR']},
  demand:{index:'INSTRUMENT 07 / ADAPTIVE CONTROL',domain:'Demand-side management',title:'Demand Response',summary:'A fuzzy-logic scheme relating load demand, time of day and distributed energy resources to suggested load reduction.',question:'How should controllable demand respond when load, time and local energy availability change together?',build:'Defined fuzzy membership functions and rules that translate operating context into a suggested reduction response.',evidence:'Demonstrated interpretable adaptive logic: each control action can be traced back to human-readable rules.',reflection:'Rule transparency is valuable, but membership design still requires scenario testing and sensitivity analysis.',metric:'FUZZY',caption:'adaptive load-management logic',stack:['MATLAB','FUZZY LOGIC','DER','LOAD SHIFTING'],mode:'demand',flow:['DEMAND','FUZZY','REDUCE']}
};
const instrument=document.querySelector('#system-instrument');
if(instrument){
  const fields={index:document.querySelector('#instrument-index'),domain:document.querySelector('#instrument-domain'),title:document.querySelector('#instrument-title'),summary:document.querySelector('#instrument-summary'),question:document.querySelector('#instrument-question'),build:document.querySelector('#instrument-build'),evidence:document.querySelector('#instrument-evidence'),reflection:document.querySelector('#instrument-reflection'),metric:document.querySelector('#instrument-metric'),caption:document.querySelector('#instrument-caption'),stack:document.querySelector('#instrument-stack'),link:document.querySelector('#instrument-link'),flow:[document.querySelector('#flow-one'),document.querySelector('#flow-two'),document.querySelector('#flow-three')]};
  const selectors=[...document.querySelectorAll('.atlas-node,.atlas-select')];
  selectors.forEach(button=>button.addEventListener('click',()=>{
    const data=systemData[button.dataset.system];if(!data)return;
    selectors.forEach(node=>{const active=node===button;node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active))});
    instrument.className=`system-instrument mode-${data.mode}`;
    fields.index.textContent=data.index;fields.domain.textContent=data.domain;fields.title.textContent=data.title;fields.summary.textContent=data.summary;fields.question.textContent=data.question;fields.build.textContent=data.build;fields.evidence.textContent=data.evidence;fields.reflection.textContent=data.reflection;fields.metric.textContent=data.metric;fields.caption.textContent=data.caption;
    fields.stack.innerHTML=data.stack.map(item=>`<span>${item}</span>`).join('');
    fields.flow.forEach((field,index)=>field.textContent=data.flow[index]);
    if(data.link){fields.link.hidden=false;fields.link.href=data.link;fields.link.textContent=data.linkText}else{fields.link.hidden=true;fields.link.removeAttribute('href')}
  }));
}

const sectionLinks=[...document.querySelectorAll('#nav a[href^="#"]')];
const linkedSections=sectionLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;sectionLinks.forEach(link=>{const active=link.getAttribute('href')===`#${entry.target.id}`;link.classList.toggle('current',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}),{rootMargin:'-25% 0px -65%',threshold:0});
  linkedSections.forEach(section=>navObserver.observe(section));
}

