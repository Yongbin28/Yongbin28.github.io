const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

const progress=document.querySelector('.progress i');
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max?scrollY/max*100:0)+'%'},{passive:true});

const reveals=[...document.querySelectorAll('.reveal')];
if(reduced) reveals.forEach(x=>x.classList.add('visible'));
else{const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach((x,i)=>{x.style.transitionDelay=(i%4)*70+'ms';io.observe(x)})}

const canvas=document.querySelector('#wafer'),ctx=canvas.getContext('2d');let width=0,height=0,dpr=1,cells=[];
function resize(){const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);buildCells()}
function buildCells(){cells=[];const size=Math.min(width,height)*.68,cell=size/11,gap=4,cx=width*.51,cy=height*.47;for(let row=-5;row<=5;row++)for(let col=-5;col<=5;col++){const x=cx+col*cell,y=cy+row*cell;if(Math.hypot(x-cx,y-cy)<size*.5)cells.push({x:x-cell*.43,y:y-cell*.43,s:cell-gap,row,col,seed:(row*13+col*7+50)%19})}}
function draw(time=0){ctx.clearRect(0,0,width,height);const cx=width*.51,cy=height*.47,r=Math.min(width,height)*.36;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.11);ctx.translate(-cx,-cy);ctx.fillStyle='#eafffa';ctx.strokeStyle='#092031';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.stroke();cells.forEach(c=>{const pulse=Math.sin(time/900+c.seed)*.5+.5;ctx.fillStyle=c.seed===0||c.seed===7?`rgba(255,189,74,${.62+pulse*.25})`:c.seed%5===0?`rgba(22,201,170,${.62+pulse*.22})`:'#ffffff';ctx.strokeStyle='#73bdb0';ctx.fillRect(c.x,c.y,c.s,c.s);ctx.strokeRect(c.x,c.y,c.s,c.s)});ctx.restore();ctx.strokeStyle='#16c9aa';ctx.globalAlpha=.18;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(cx,cy,r+18+i*18,Math.PI*1.06,Math.PI*1.94);ctx.stroke()}ctx.globalAlpha=1;if(!reduced)requestAnimationFrame(draw)}
resize();addEventListener('resize',resize);if(reduced)draw(0);else requestAnimationFrame(draw);

const count=document.querySelector('[data-count]');
const countObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;countObserver.disconnect();if(reduced){count.textContent='7581';return}const start=performance.now(),duration=1200;function tick(now){const p=Math.min((now-start)/duration,1),ease=1-Math.pow(1-p,3);count.textContent=String(Math.round(7581*ease)).padStart(4,'0');if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}),{threshold:.7});countObserver.observe(count);

document.querySelectorAll('.year-card,.swot-card').forEach(card=>card.addEventListener('pointermove',e=>{if(reduced||innerWidth<900)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(800px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-6px)`}));
document.querySelectorAll('.year-card,.swot-card').forEach(card=>card.addEventListener('pointerleave',()=>card.style.transform=''));

