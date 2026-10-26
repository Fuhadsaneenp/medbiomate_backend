export function scrollEditorSection(card,offset=20){
 let scroller=card.parentElement;
 while(scroller&&scroller!==document.body&&scroller!==document.documentElement){
  const overflow=getComputedStyle(scroller).overflowY;
  if(/auto|scroll|overlay/.test(overflow)&&scroller.scrollHeight>scroller.clientHeight+1){const top=scroller.scrollTop+card.getBoundingClientRect().top-scroller.getBoundingClientRect().top-offset;scroller.scrollTo({top:Math.max(0,top),behavior:'smooth'});return scroller;}
  scroller=scroller.parentElement;
 }
 const top=(window.scrollY||document.documentElement.scrollTop||0)+card.getBoundingClientRect().top-offset;
 window.scrollTo({top:Math.max(0,top),behavior:'smooth'});return window;
}
