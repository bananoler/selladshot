(function(){
// remove images that fail to load (replaces an inline onerror attribute, which the CSP forbids)
function rm(i){if(i.hasAttribute('data-rm'))i.remove();}
document.addEventListener('error',function(e){if(e.target&&e.target.tagName==='IMG')rm(e.target);},true);
[].slice.call(document.querySelectorAll('img[data-rm]')).forEach(function(i){if(i.complete&&i.naturalWidth===0)rm(i);});
var hv=[].slice.call(document.querySelectorAll('video[data-src]'));
function load(v){if(!v.dataset.ld){v.dataset.ld=1;v.src=v.dataset.src;}}
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){var v=en.target;
    if(en.isIntersecting){load(v);var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}});},{rootMargin:'150px'});
  hv.forEach(function(v){io.observe(v);});
}else{hv.forEach(function(v){load(v);v.autoplay=true;});}
// only one video with controls plays at a time
var all=[].slice.call(document.querySelectorAll('video[controls]'));
all.forEach(function(v){v.addEventListener('play',function(){all.forEach(function(o){if(o!==v)o.pause();});});});
var bg=document.querySelector('.burger'),mm=document.getElementById('mmenu');
if(bg&&mm){var set=function(o){mm.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);};
bg.addEventListener('click',function(){set(!mm.classList.contains('open'));});
mm.addEventListener('click',function(e){if(e.target.tagName==='A')set(false);});}
var tb=document.getElementById('topbar');
if(tb){var upd=function(){tb.classList.toggle('scrolled',(window.pageYOffset||0)>8);};upd();window.addEventListener('scroll',upd,{passive:true});}
})();
