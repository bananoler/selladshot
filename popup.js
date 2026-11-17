(function(){
var de=/^de/i.test(document.documentElement.lang||''),MAIL='denys@selladshot.com';
var T=de?{
 of:'Frage {n} von 5',close:'Schließen',back:'← Zurück',next:'Weiter',skip:'Überspringen',send:'Konzept anfordern',sending:'Wird gesendet …',
 q:[
  {t:'Was darf ich für dich umsetzen?',o:['Erklärvideo','Social Media KI-Ad','KI-Avatar-Video','B2B Werbevideo','Weiß ich noch nicht']},
  {t:'Wofür brauchst du das Video?',s:'Mehrere Antworten möglich.',o:['Website','LinkedIn','Social Media','Messe','Vertrieb','Sales','Recruiting']},
  {t:'Welchen Budgetrahmen hast du?',s:'So kann ich passende Vorschläge machen.',o:['bis 1.000 €','1.000–2.500 €','2.500–5.000 €','noch offen']}],
 idea:'Erzähl mir von deiner Idee',ideaSub:'Tippe auf das Mikrofon und sprich.',mic:'Tippe zum Sprechen',micHint:'Ein paar Sätze reichen.',listen:'Ich höre zu … ',stopHint:'Tippe auf Stopp, wenn du fertig bist.',
 micStart:'Aufnahme starten',micStop:'Aufnahme stoppen',txt:'Dein Text',txtPh:'Hier erscheint, was du sagst. Du kannst es danach anpassen.',
 contact:'Wohin schicke ich das Konzept?',name:'Name',email:'E-Mail',
 consent:'Ich stimme zu, dass meine Angaben (bei Spracheingabe auch die Aufnahme als Text) per E-Mail an Denys gehen. Mehr in der <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a>.',
 err:'Bitte Name, gültige E-Mail und Zustimmung angeben.',fail:'Das hat nicht geklappt. Schreib mir bitte direkt an '+MAIL+'.',
 done:'Danke, ich melde mich.',doneLead:'Dein Konzept kommt innerhalb von 3 Stunden per E-Mail an {mail}.',
 est:'Erste Einschätzung',estNote:'Richtwert nach meinen Preisen auf der Website, kein Angebot. Den genauen Preis nenne ich dir im Konzept.',
 per:' pro Video',from:'ab ',over:'Das liegt über deinem Budgetrahmen. Ich zeige dir im Konzept eine kürzere Variante.',multi:'Für mehrere Plattformen kommen Zuschnitte dazu.',
 unsure:'Ich empfehle dir im Konzept das passende Format.',close2:'Fertig',
 mailSub:'SellAdShot Anfrage (DE)',
 auto:'Hallo {name},\n\nvielen Dank für deine Anfrage. Dein Konzept bekommst du innerhalb von 3 Stunden.\n\nErste Einschätzung: {est}\n(Richtwert nach meinen Preisen auf selladshot.com, kein Angebot.)\n\nDenys\nSellAdShot',
 lang:'de-DE'
}:{
 of:'Question {n} of 5',close:'Close',back:'← Back',next:'Next',skip:'Skip',send:'Request concept',sending:'Sending …',
 q:[
  {t:'What can I make for you?',o:['Explainer video','Social media AI ad','AI avatar video','B2B ad video','Not sure yet']},
  {t:'Where will the video run?',s:'Several answers possible.',o:['Website','LinkedIn','Social media','Trade fair','Sales','Recruiting']},
  {t:'What is your budget range?',s:'So I can suggest the right options.',o:['up to €1,000','€1,000–2,500','€2,500–5,000','still open']}],
 idea:'Tell me about your idea',ideaSub:'Tap the microphone and speak.',mic:'Tap to speak',micHint:'A few sentences are enough.',listen:'Listening … ',stopHint:'Tap stop when you are done.',
 micStart:'Start recording',micStop:'Stop recording',txt:'Your text',txtPh:'What you say appears here. You can edit it afterwards.',
 contact:'Where should I send the concept?',name:'Name',email:'E-mail',
 consent:'I agree that my details (for voice input, the recording as text) are sent to Denys by e-mail. More in the <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>.',
 err:'Please enter your name, a valid e-mail and give your consent.',fail:'That did not work. Please write to me directly at '+MAIL+'.',
 done:'Thanks, I will be in touch.',doneLead:'Your concept arrives by e-mail at {mail} within 3 hours.',
 est:'First estimate',estNote:'A guide based on the prices on my website, not an offer. I will give you the exact price in the concept.',
 per:' per video',from:'from ',over:'This is above your budget range. In the concept I will show you a shorter version.',multi:'Several platforms add cut-downs.',
 unsure:'In the concept I will recommend the right format.',close2:'Done',
 mailSub:'SellAdShot enquiry (EN)',
 auto:'Hi {name},\n\nthanks for your enquiry. You will get your concept within 3 hours.\n\nFirst estimate: {est}\n(A guide based on the prices on selladshot.com, not an offer.)\n\nDenys\nSellAdShot',
 lang:'en-US'
};
// price guide from the site's own "from" prices + up to two add-ons
var P=[{lo:500,hi:700,per:0},{lo:100,hi:500,per:0},{lo:55,hi:115,per:1},{lo:500,hi:700,per:0},null];
var BUD=[1000,2500,5000,Infinity];
function eur(n){return '€'+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,de?'.':',');}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
var ov,dlg,S,last;
function reset(){S={step:0,a:[null,[],null],idea:'',name:'',email:''};}
function open(e){if(e)e.preventDefault();last=document.activeElement;reset();if(!ov)build();ov.hidden=false;document.body.style.overflow='hidden';render();}
function close(){stopRec();if(ov)ov.hidden=true;document.body.style.overflow='';if(last&&last.focus)last.focus();}
function build(){
  ov=el('div','sap-ov');ov.hidden=true;dlg=el('div','sap');dlg.setAttribute('role','dialog');dlg.setAttribute('aria-modal','true');dlg.tabIndex=-1;
  ov.appendChild(dlg);document.body.appendChild(ov);
  ov.addEventListener('mousedown',function(e){if(e.target===ov)close();});
  document.addEventListener('keydown',function(e){
    if(ov.hidden)return;if(e.key==='Escape'){close();return;}
    if(e.key==='Tab'){var f=[].slice.call(dlg.querySelectorAll('button:not([disabled]),input,textarea,a[href]')).filter(function(x){return x.offsetParent;});
      if(!f.length)return;var a=f[0],z=f[f.length-1];
      if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault();}}
  });
}
function top(n){
  var w=el('div','sap-top'),m=el('div','sap-meta');m.appendChild(el('span','',T.of.replace('{n}',n)));
  var x=el('button','sap-x');x.type='button';x.setAttribute('aria-label',T.close);
  x.innerHTML='<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14"/></svg>';
  x.onclick=close;m.appendChild(x);w.appendChild(m);
  var s=el('div','sap-seg');for(var i=1;i<=5;i++){s.appendChild(el('i',i<=n?'on':''));}w.appendChild(s);return w;
}
function nav(canNext,opts){
  var n=el('div','sap-nav');
  if(S.step>0){var b=el('button','sap-back',T.back);b.type='button';b.onclick=function(){stopRec();S.step--;render();};n.appendChild(b);}
  if(opts&&opts.skip){var k=el('button','sap-skip',T.skip);k.type='button';k.onclick=function(){stopRec();S.step++;render();};n.appendChild(k);}
  var nx=el('button','sap-next',opts&&opts.label||T.next);nx.type=opts&&opts.submit?'submit':'button';nx.disabled=!canNext;
  if(!(opts&&opts.submit))nx.onclick=function(){stopRec();S.step++;render();};
  n.appendChild(nx);return n;
}
function render(){
  dlg.innerHTML='';var st=S.step;
  dlg.appendChild(top(st+1));
  if(st<3&&st!==3){var q=T.q[st],multi=st===1,h=el('h2','',q.t);h.tabIndex=-1;dlg.appendChild(h);
    if(q.s)dlg.appendChild(el('p','sap-sub',q.s));
    var l=el('div','sap-list');l.setAttribute('role',multi?'group':'radiogroup');l.setAttribute('aria-label',q.t);
    q.o.forEach(function(o,i){
      var on=multi?S.a[1].indexOf(i)>-1:S.a[st]===i;
      var b=el('button','sap-opt');b.type='button';b.setAttribute('role',multi?'checkbox':'radio');b.setAttribute('aria-checked',on);
      b.appendChild(el('span','ind '+(multi?'c':'r')));b.appendChild(el('span','',o));
      b.onclick=function(){if(multi){var p=S.a[1].indexOf(i);if(p>-1)S.a[1].splice(p,1);else S.a[1].push(i);}else S.a[st]=i;render();var f=dlg.querySelectorAll('.sap-opt')[i];if(f)f.focus();};
      l.appendChild(b);});
    dlg.appendChild(l);
    var ok=multi?true:S.a[st]!==null;
    dlg.appendChild(nav(ok,{skip:multi&&!S.a[1].length}));
  }else if(st===3){idea();}else if(st===4){contact();}else{done();}
  var f=dlg.querySelector('h2');if(f&&st!==3)f.focus({preventScroll:true});
}
var rec=null,micBtn,txt,lvl;
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function stopRec(){if(rec){try{rec.stop();}catch(e){}rec=null;}if(micBtn){micBtn.classList.remove('rec');micBtn.setAttribute('aria-label',T.micStart);}}
function idea(){
  var h=el('h2','',T.idea);dlg.appendChild(h);dlg.appendChild(el('p','sap-sub',SR?T.ideaSub:''));
  var tt,th;
  if(SR){
    var tile=el('div','sap-tile');micBtn=el('button','sap-mic');micBtn.type='button';micBtn.setAttribute('aria-label',T.micStart);
    micBtn.innerHTML='<svg class="mi" width="34" height="34" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="6" height="11" rx="3"/><path d="M4 10a6 6 0 0 0 12 0M10 16v3"/></svg><svg class="stop" width="28" height="28" viewBox="0 0 26 26" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="14" height="14" rx="3"/></svg>';
    var c=el('div');tt=el('div','sap-tt',T.mic);th=el('div','sap-th',T.micHint);th.setAttribute('aria-live','polite');c.appendChild(tt);c.appendChild(th);
    tile.appendChild(micBtn);tile.appendChild(c);dlg.appendChild(tile);
    micBtn.onclick=function(){
      if(rec){stopRec();tt.textContent=T.mic;th.textContent=T.micHint;return;}
      var r=new SR();r.lang=T.lang;r.continuous=true;r.interimResults=true;var base=txt.value?txt.value.replace(/\s*$/,' '):'',t0=Date.now();
      r.onresult=function(e){var s='';for(var i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;txt.value=(base+s).slice(0,600);S.idea=txt.value;cnt.textContent=txt.value.length+' / 600';};
      r.onerror=function(){stopRec();tt.textContent=T.mic;th.textContent=T.micHint;};
      r.onend=function(){if(rec===r){stopRec();tt.textContent=T.mic;th.textContent=T.micHint;}};
      try{r.start();}catch(e){return;}
      rec=r;micBtn.classList.add('rec');micBtn.setAttribute('aria-label',T.micStop);tt.textContent=T.listen.trim();th.textContent=T.stopHint;
    };
  }
  var f=el('div','sap-f'),hd=el('div','hd'),lb=el('label','',T.txt);lb.htmlFor='sap-idea';var cnt=el('span','cnt',S.idea.length+' / 600');
  hd.appendChild(lb);hd.appendChild(cnt);txt=el('textarea');txt.id='sap-idea';txt.maxLength=600;txt.value=S.idea;txt.placeholder=de?'Produkt, Zielgruppe, Besonderheiten.':'Product, audience, what makes it special.';
  if(SR)txt.placeholder=T.txtPh;
  txt.oninput=function(){S.idea=txt.value;cnt.textContent=txt.value.length+' / 600';};
  f.appendChild(hd);f.appendChild(txt);dlg.appendChild(f);
  dlg.appendChild(nav(true,{skip:!S.idea.trim()}));
}
function contact(){
  var h=el('h2','',T.contact);dlg.appendChild(h);
  var f=el('form');f.noValidate=true;f.style.cssText='display:flex;flex-direction:column;gap:14px';
  function fld(l,id,type,val,ac){var w=el('div','sap-f'),lb=el('label','',l);lb.htmlFor=id;var i=el('input');i.type=type;i.id=id;i.value=val;i.autocomplete=ac;w.appendChild(lb);w.appendChild(i);f.appendChild(w);return i;}
  var n=fld(T.name,'sap-name','text',S.name,'name'),m=fld(T.email,'sap-mail','email',S.email,'email');
  var hp=el('input','sap-hp');hp.type='checkbox';hp.tabIndex=-1;hp.setAttribute('aria-hidden','true');hp.name='_honey';f.appendChild(hp);
  var ck=el('label','sap-ck'),cb=el('input');cb.type='checkbox';ck.appendChild(cb);var sp=el('span');sp.innerHTML=T.consent;ck.appendChild(sp);f.appendChild(ck);
  var er=el('div','sap-er');er.setAttribute('role','alert');f.appendChild(er);
  var nv=nav(true,{submit:true,label:T.send});f.appendChild(nv);
  f.onsubmit=function(e){
    e.preventDefault();S.name=n.value.trim();S.email=m.value.trim();er.textContent='';
    if(!S.name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(S.email)||!cb.checked){er.textContent=T.err;return;}
    if(hp.checked)return;
    var go=nv.querySelector('.sap-next'),est=estimate();go.disabled=true;go.textContent=T.sending;
    var pick=function(i){return S.a[i]==null?'-':T.q[i].o[S.a[i]];};
    var msg=[pick(0),(S.a[1].map(function(i){return T.q[1].o[i];}).join(', ')||'-'),pick(2),(S.idea||'-').replace(/\s+/g,' '),'Estimate: '+est.text].join(' | ');
    var body=JSON.stringify({_subject:T.mailSub,_captcha:'false',_template:'box',name:S.name,email:S.email,message:msg});
    var t0=Date.now(),why='';
    function ajax(){
      var ac=window.AbortController?new AbortController():null,to=setTimeout(function(){if(ac)ac.abort();},12000);
      return fetch('https://formsubmit.co/ajax/'+MAIL,{method:'POST',signal:ac?ac.signal:undefined,headers:{'Content-Type':'application/json',Accept:'application/json'},body:body})
      .then(function(r){why='http '+r.status;return r.json();}).then(function(j){clearTimeout(to);if(String(j.success)!=='true'){why='FormSubmit: '+(j.message||'success=false');throw new Error(why);}})
      .catch(function(err){clearTimeout(to);if(err&&err.name==='AbortError')why='timeout';else if(!why||why.indexOf('FormSubmit')<0&&why.indexOf('http')<0)why=String(err&&err.message||err);throw err;});
    }
    function plain(){
      var fd=new FormData(),o=JSON.parse(body);for(var k in o)fd.append(k,o[k]);
      var ac=window.AbortController?new AbortController():null,to=setTimeout(function(){if(ac)ac.abort();},20000);
      return fetch('https://formsubmit.co/'+MAIL,{method:'POST',mode:'no-cors',signal:ac?ac.signal:undefined,body:fd}).then(function(){clearTimeout(to);},function(e){clearTimeout(to);why+=' / plain: '+(e&&e.name==='AbortError'?'timeout':String(e&&e.message||e));throw e;});
    }
    function own(){
      var ac=window.AbortController?new AbortController():null,to=setTimeout(function(){if(ac)ac.abort();},12000);
      return fetch('/api/lead',{method:'POST',signal:ac?ac.signal:undefined,headers:{'Content-Type':'application/json'},body:JSON.stringify({subject:T.mailSub,name:S.name,email:S.email,message:msg,auto:T.auto.replace('{name}',S.name).replace('{est}',est.text)})})
      .then(function(r){clearTimeout(to);if(!r.ok)throw new Error('own '+r.status);},function(e){clearTimeout(to);throw e;});
    }
    var ownWhy='';own().catch(function(e){ownWhy='own: '+(e&&e.name==='AbortError'?'timeout':String(e&&e.message||e));why='';return ajax();}).catch(function(){return plain();})
    .then(function(){S.step=5;render();})
    .catch(function(){if(window.console)console.error('SellAdShot popup send failed after '+(Date.now()-t0)+' ms:',why);go.disabled=false;go.textContent=T.send;why=(ownWhy?ownWhy+' / ajax: ':'')+why;er.textContent=T.fail+' ['+why+']';var mb=document.createElement('a');mb.className='sap-skip';mb.href='mailto:'+MAIL+'?subject='+encodeURIComponent(T.mailSub)+'&body='+encodeURIComponent(msg.replace(/ \| /g,'\n'));mb.textContent=de?'Per E-Mail-Programm senden':'Send with your mail app';er.appendChild(document.createElement('br'));er.appendChild(mb);});
  };
  dlg.appendChild(f);
}
function estimate(){
  var p=P[S.a[0]],bud=S.a[2]==null?null:BUD[S.a[2]],notes=[],text;
  if(!p){text=T.from+eur(55);notes.push(T.unsure);}
  else{text=eur(p.lo)+'–'+String(eur(p.hi)).slice(1)+(p.per?T.per:'');
    if(bud!=null&&bud!==Infinity&&p.lo>bud)notes.push(T.over);}
  if(S.a[1].length>=3)notes.push(T.multi);
  return {text:text,notes:notes};
}
function done(){
  var e=estimate();var h=el('h2','',T.done);dlg.appendChild(h);
  dlg.appendChild(el('p','sap-lead',T.doneLead.replace('{mail}',S.email)));
  var b=el('div','sap-est');b.appendChild(el('div','lb',T.est));b.appendChild(el('div','pr',e.text));
  e.notes.forEach(function(x){b.appendChild(el('p','',x));});b.appendChild(el('p','',T.estNote));dlg.appendChild(b);
  var n=el('div','sap-nav'),c=el('button','sap-next',T.close2);c.type='button';c.onclick=close;n.appendChild(c);dlg.appendChild(n);
}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a.btn');if(a)open(e);});
})();
