(function(){
  var de=(document.documentElement.lang||'en').toLowerCase().indexOf('de')===0;
  var T=de?{
    title:'SellAdShot Assistent',sub:'Antworten sofort · Denys meldet sich persönlich',
    open:'Chat öffnen',close:'Chat schließen',ph:'Frage stellen …',send:'Nachricht senden',label:'Nachricht',
    greet:'Hallo und willkommen bei SellAdShot! Wie kann ich dir helfen?',
    chips:[['price','Was kostet ein Werbevideo?'],['addons','Wie berechnet man Add-ons?'],['process','Wie läuft ein Projekt ab?'],['quote','Angebot anfragen']],
    a:{
      price:'Reels, TikToks und KI-Avatar-Videos starten ab 55 € pro Video, ein Paket mit 10 Videos ab 500 €. KI-Werbe- und Erklärvideos starten bei 100 € (10 Sekunden) bzw. 500 € (60 Sekunden). Das sind Startpreise. Den Endpreis nenne ich dir nach der Konzepterstellung.',
      addons:'Add-ons berechne ich nach Komplexität, jeder Fall wird einzeln betrachtet. Die genannten Preise sind Startpreise. Den Endpreis nenne ich dir nach der Konzepterstellung.',
      process:'Du schilderst mir kurz dein Produkt und dein Ziel. Ich erstelle ein Konzept und nenne dir den Preis. Nach deiner Freigabe produziere ich das Video.',
      quote:'Gern. Schreib mir kurz, worum es geht, dann erstelle ich dir ein Konzept und nenne dir den Preis.',
      fallback:'Dazu antwortet dir Denys am besten persönlich. Du erreichst ihn hier:'
    },
    wa:'Per WhatsApp schreiben',mail:'Per E-Mail schreiben',
    mailSubject:'Anfrage Werbevideo',
    foot:'Automatischer Assistent, es werden keine Daten gespeichert. ',priv:'Datenschutz',privHref:'/datenschutz'
  }:{
    title:'SellAdShot Assistant',sub:'Instant answers · Denys replies personally',
    open:'Open chat',close:'Close chat',ph:'Ask a question …',send:'Send message',label:'Message',
    greet:'Hello and welcome to SellAdShot! How can I help you?',
    chips:[['price','How much does a video cost?'],['addons','How are add-ons priced?'],['process','How does a project work?'],['quote','Request a quote']],
    a:{
      price:'Reels, TikToks and AI avatar videos start from €55 per video, a pack of 10 videos from €500. AI ad and explainer videos start at €100 (10 seconds) or €500 (60 seconds). These are starting prices. I will give you the final price after the concept is drafted.',
      addons:'Add-ons are priced by complexity, and each case is reviewed individually. The prices shown are starting prices. I will give you the final price after the concept is drafted.',
      process:'You briefly tell me about your product and goal. I draft a concept and give you the price. Once you approve it, I produce the video.',
      quote:'Happy to. Tell me briefly what it is about, and I will draft a concept and send you the price.',
      fallback:'Denys can answer that best in person. You can reach him here:'
    },
    wa:'Message on WhatsApp',mail:'Write an e-mail',
    mailSubject:'Video enquiry',
    foot:'Automated assistant, no data is stored. ',priv:'Privacy',privHref:'/datenschutz'
  };
  var WA='https://wa.me/4917663444890',MAIL='denys@selladshot.com';
  var RX=[
    ['addons',/add-?on|zusatz|extra|aufpreis/i],
    ['price',/kost|preis|prices?|cost|how much|wieviel|wie viel|€|euro|tarif|rate/i],
    ['process',/ablauf|prozess|process|how does|how do|wie l[aä]uft|schritt|dauer|how long|wie lange|steps/i],
    ['quote',/angebot|anfrag|quote|offer|enquir|inquir|book|buchen|kontakt|contact|hire/i]
  ];

  function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e;}
  var root=el('div','sas-chat');
  var launch=el('button','sas-launch');launch.type='button';launch.setAttribute('aria-label',T.open);launch.setAttribute('aria-expanded','false');launch.setAttribute('aria-controls','sas-panel');
  launch.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
  var panel=el('div','sas-panel');panel.id='sas-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label',T.title);panel.hidden=true;

  var head=el('div','sas-head');
  var av=el('div','sas-av','S');av.setAttribute('aria-hidden','true');
  var ht=el('div','sas-ht');ht.appendChild(el('div','sas-t',T.title));ht.appendChild(el('div','sas-s',T.sub));
  var x=el('button','sas-x');x.type='button';x.setAttribute('aria-label',T.close);
  x.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  head.appendChild(av);head.appendChild(ht);head.appendChild(x);

  var log=el('div','sas-log');log.setAttribute('role','log');log.setAttribute('aria-live','polite');
  var chips=el('div','sas-chips');

  var form=el('form','sas-form');
  var lab=el('label','sas-vh',T.label);lab.setAttribute('for','sas-in');
  var inp=el('input','sas-in');inp.id='sas-in';inp.type='text';inp.placeholder=T.ph;inp.autocomplete='off';inp.maxLength=200;
  var sb=el('button','sas-send');sb.type='submit';sb.setAttribute('aria-label',T.send);
  sb.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  form.appendChild(lab);form.appendChild(inp);form.appendChild(sb);

  var foot=el('div','sas-foot',T.foot);var pl=el('a',null,T.priv);pl.href=T.privHref;foot.appendChild(pl);

  panel.appendChild(head);panel.appendChild(log);panel.appendChild(form);panel.appendChild(foot);
  root.appendChild(panel);root.appendChild(launch);document.body.appendChild(root);

  function scroll(){log.scrollTop=log.scrollHeight;}
  function msg(who,txt){var m=el('div','sas-m sas-'+who,txt);log.appendChild(m);return m;}
  function links(){
    var w=el('div','sas-links');
    var a=el('a','sas-lk wa',T.wa);a.href=WA;a.target='_blank';a.rel='noopener';
    var b=el('a','sas-lk',T.mail);b.href='mailto:'+MAIL+'?subject='+encodeURIComponent(T.mailSubject);
    w.appendChild(a);w.appendChild(b);log.appendChild(w);
  }
  function showChips(){
    chips.innerHTML='';
    T.chips.forEach(function(c){
      var b=el('button','sas-chip',c[1]);b.type='button';
      b.addEventListener('click',function(){ask(c[0],c[1]);});
      chips.appendChild(b);
    });
    log.appendChild(chips);scroll();
  }
  function answer(key){
    if(chips.parentNode)chips.parentNode.removeChild(chips);
    if(key==='fallback'){msg('bot',T.a.fallback);links();}
    else{msg('bot',T.a[key]);if(key==='quote')links();}
    showChips();
  }
  function ask(key,label){
    if(chips.parentNode)chips.parentNode.removeChild(chips);
    msg('me',label);scroll();
    setTimeout(function(){answer(key);},350);
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=inp.value.trim();if(!v)return;
    inp.value='';
    var key='fallback';
    for(var i=0;i<RX.length;i++){if(RX[i][1].test(v)){key=RX[i][0];break;}}
    if(chips.parentNode)chips.parentNode.removeChild(chips);
    msg('me',v);scroll();
    setTimeout(function(){answer(key);},350);
  });

  var started=false;
  function open(){
    panel.hidden=false;launch.setAttribute('aria-expanded','true');launch.setAttribute('aria-label',T.close);root.classList.add('is-open');
    if(!started){started=true;msg('bot',T.greet);showChips();}
    setTimeout(function(){inp.focus();},50);
  }
  function close(){
    panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.setAttribute('aria-label',T.open);root.classList.remove('is-open');launch.focus();
  }
  launch.addEventListener('click',function(){panel.hidden?open():close();});
  x.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)close();});
})();
