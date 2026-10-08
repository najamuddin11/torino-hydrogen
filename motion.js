/* A DOM-scoped scroll controller, shared by the standalone preview and React. */
(function(global){
'use strict';
function createTorinoMotion(root, reduced=false){
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const hero=root.querySelector('[data-scene="hero"]'), detail=root.querySelector('[data-scene="detail"]'), rail=root.querySelector('[data-scene="rail"]'), words=root.querySelector('[data-scene="words"]'), craft=root.querySelector('[data-scene="craft"]');
 if(!hero)return ()=>{};
 let frame=0,disposed=false,resizeObserver,revealObserver;
 const cleanups=[],stageTop=72;
 const on=(el,type,fn,options)=>{el.addEventListener(type,fn,options);cleanups.push(()=>el.removeEventListener(type,fn,options));};
 const mobile=()=>matchMedia('(max-width:760px)').matches;
 const scrollProgress=(el,stage)=>{const r=el.getBoundingClientRect();return clamp((stageTop-r.top)/Math.max(1,r.height-stage.getBoundingClientRect().height));};
 const heroStage=hero.querySelector('.film-stage'),photo=hero.querySelector('.film-photo'),photoImage=photo.querySelector('img'),title=hero.querySelector('.film-title'),index=hero.querySelector('.film-index');
 const detailStage=detail.querySelector('.detail-stage'),object=detail.querySelector('.detail-product'),chapters=[...detail.querySelectorAll('[data-chapter]')],chapterButtons=[...detail.querySelectorAll('[data-jump-chapter]')];
 const railStage=rail.querySelector('.collection-stage'),viewport=rail.querySelector('.collection-window'),track=rail.querySelector('.collection-track'),panels=[...rail.querySelectorAll('.collection-panel')],railButtons=[...rail.querySelectorAll('[data-jump-rail]')];
 const wordSpans=[...words.querySelectorAll('[data-word]')],craftImage=craft.querySelector('.craft-image');
 function schedule(){if(!frame&&!disposed)frame=requestAnimationFrame(draw);}
 function draw(){
  frame=0;if(disposed)return;
  const small=mobile(),vh=innerHeight;
  const hp=reduced?0:scrollProgress(hero,heroStage),dp=reduced?0:scrollProgress(detail,detailStage),rp=reduced||small?0:scrollProgress(rail,railStage);
  const wr=words.getBoundingClientRect(),cr=craft.getBoundingClientRect();
  const wp=clamp((vh*.8-wr.top)/Math.max(1,wr.height+vh*.2)),cp=clamp((vh-cr.top)/(vh+cr.height));
  const padding=getComputedStyle(viewport),railWidth=viewport.clientWidth-parseFloat(padding.paddingLeft)-parseFloat(padding.paddingRight),maxX=Math.max(0,track.scrollWidth-railWidth);
  const actualRail=reduced||small?clamp(viewport.scrollLeft/Math.max(1,maxX)):rp;
  const chapter=Math.min(2,Math.floor(dp*3)),flatDetail=getComputedStyle(detailStage).position!=='sticky';
  if(!reduced){
   const spread=clamp(hp/.72),side=(small?16:32)*(1-spread),top=(small?12:7)*(1-spread),bottom=(small?17:8)*(1-spread);
   photo.style.clipPath=`inset(${top}% ${side}% ${bottom}% ${side}%)`;
   if(!photo.hasAttribute('data-fixed-hero')) photoImage.style.transform=`scale(${1.18-.18*spread}) translateY(${hp*-2}%)`;
   title.style.transform=`translateY(${-hp*75}px) scale(${1-hp*.12})`;
   title.style.opacity=String(1-clamp((hp-.35)/.38));
   index.style.opacity=String(clamp((hp-.7)/.2));
   index.style.transform=`scale(${.88+.12*hp})`;
   object.style.transform=`rotate(${-14+dp*29}deg) scale(${.9+Math.sin(dp*Math.PI)*.2}) translateY(${Math.sin(dp*Math.PI)*-10}px)`;
   chapters.forEach((el,i)=>{el.style.opacity=flatDetail||i===chapter?'1':'0';el.style.transform=`translateY(${flatDetail||i===chapter?0:18}px)`;if(flatDetail)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',String(i!==chapter));});
   wordSpans.forEach((el,i)=>{el.style.opacity=String(.18+.82*clamp((wp-i/(wordSpans.length+1))*6));});
   craftImage.style.transform=`translateY(${(cp-.5)*(small?45:130)}px) scale(1.04)`;
  }else{
   [photo,photoImage,title,index,object,craftImage].forEach(el=>el.removeAttribute('style'));
   chapters.forEach(el=>{el.removeAttribute('style');el.removeAttribute('aria-hidden');});wordSpans.forEach(el=>el.style.opacity='1');
  }
  chapterButtons.forEach((el,i)=>{el.setAttribute('aria-current',String(i===chapter));el.style.setProperty('--chapter-progress',`${clamp(dp*3-i)*100}%`);});
  track.style.setProperty('--rail-x',`${-rp*maxX}px`);
  rail.style.setProperty('--rail-progress',`${actualRail*100}%`);
  const ri=Math.round(actualRail*2);railButtons.forEach((el,i)=>el.setAttribute('aria-current',String(ri===i)));
 }
 function jumpScene(el,stage,p){
  const rect=el.getBoundingClientRect(),distance=rect.height-stage.getBoundingClientRect().height;
  window.scrollTo({top:scrollY+rect.top-stageTop+Math.max(0,distance)*p,behavior:reduced?'instant':'smooth'});
 }
 chapterButtons.forEach((button,i)=>on(button,'click',()=>jumpScene(detail,detailStage,(i+.35)/3)));
 function jumpRail(i){
  if(mobile()||reduced){const distance=panels[i].getBoundingClientRect().left-panels[0].getBoundingClientRect().left;viewport.scrollTo({left:distance,behavior:reduced?'instant':'smooth'});}
  else jumpScene(rail,railStage,i/2);
 }
 railButtons.forEach((button,i)=>on(button,'click',()=>jumpRail(i)));
 on(rail,'focusin',event=>{if(mobile()||reduced)return;const panel=event.target.closest('.collection-panel');if(panel){const i=panels.indexOf(panel);jumpScene(rail,railStage,i/2);}});
 root.querySelectorAll('.magnetic').forEach(button=>{
  on(button,'pointermove',event=>{if(reduced||mobile()||event.pointerType==='touch')return;const r=button.getBoundingClientRect();button.style.transform=`translate(${(event.clientX-r.left-r.width/2)*.08}px,${(event.clientY-r.top-r.height/2)*.13}px)`;});
  on(button,'pointerleave',()=>{button.style.transform='';});
 });
 const reveals=[...root.querySelectorAll('.reveal,.journal-grid>a')];
 if(reduced || !('IntersectionObserver' in window))reveals.forEach(el=>el.classList.add('revealed'));
 else {revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}}),{threshold:.08});reveals.forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});}
 on(window,'scroll',schedule,{passive:true});on(window,'resize',schedule,{passive:true});on(viewport,'scroll',schedule,{passive:true});
 if('ResizeObserver'in window){resizeObserver=new ResizeObserver(schedule);resizeObserver.observe(root);}
 draw();
 return ()=>{disposed=true;if(frame)cancelAnimationFrame(frame);cleanups.forEach(fn=>fn());resizeObserver?.disconnect();revealObserver?.disconnect();};
}
let cleanup=()=>{};
global.TorinoMotion={create:createTorinoMotion,refresh(root,reduced){cleanup();cleanup=createTorinoMotion(root,reduced);},destroy(){cleanup();cleanup=()=>{};}};
})(window);
