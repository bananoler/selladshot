(function(){
  var de=(document.documentElement.lang||'en').toLowerCase().indexOf('de')===0;
  var T=de?{
    title:'SellAdShot Assistent',sub:'Antworten sofort · Denys meldet sich persönlich',
    open:'Chat öffnen',close:'Chat schließen',ph:'Frage stellen …',send:'Nachricht senden',label:'Nachricht',
    greet:'Hallo und herzlich willkommen bei SellAdShot! Schön, dass du vorbeischaust. Wie kann ich dir heute weiterhelfen?',
    chips:[['price','Was kostet ein Werbevideo?'],['addons','Wie berechnet man Add-ons?'],['process','Wie läuft ein Projekt ab?'],['quote','Frage an Denys / Angebot']],
    a:{
      price:'Vielen Dank für deine Frage! Sehr gern: Reels, TikToks und KI-Avatar-Videos beginnen bei 55 € pro Video, ein Paket mit 10 Videos bei 500 €. KI-Werbe- und Erklärvideos beginnen bei 100 € (10 Sekunden) bzw. 500 € (60 Sekunden). Das sind Startpreise. Sobald dein Konzept steht, nenne ich dir gern den genauen Preis.',
      addons:'Eine sehr gute Frage, vielen Dank! Add-ons berechne ich nach Komplexität und prüfe jeden Fall einzeln, damit du einen fairen Preis erhältst. Die genannten Preise sind Startpreise. Den Endpreis nenne ich dir, sobald dein Konzept erstellt ist.',
      process:'Sehr gern erkläre ich dir den Ablauf! Zuerst teile mir bitte kurz mit, worum es bei deinem Produkt und deinem Ziel geht. Danach bereite ich gern ein Konzept für dich vor und nenne dir den Preis. Sobald du damit zufrieden bist, kümmere ich mich um die Umsetzung deines Videos.',
      quote:'Sehr gern, ich helfe dir mit Freude! Schreib mir einfach deine Frage oder ein paar Worte zu deinem Vorhaben, Denys meldet sich persönlich per E-Mail bei dir.',
      fallback:'Das beantwortet dir Denys am liebsten persönlich. Schreib mir gern hier deine Frage:',
      sent:'Vielen herzlichen Dank für deine Nachricht! Denys meldet sich in der Regel noch am selben Tag per E-Mail bei dir. Kann ich dir in der Zwischenzeit noch weiterhelfen?',
      fail:'Das tut mir leid, die Nachricht konnte leider nicht gesendet werden. Bitte kontaktiere Denys direkt per WhatsApp oder E-Mail, er hilft dir gern weiter:'
    },
    fq:'Deine Frage',fm:'Deine E-Mail',fc:'Ich bin einverstanden, dass meine Angaben zur Beantwortung per E-Mail übermittelt werden.',fs:'Absenden',fsending:'Wird gesendet …',ferr:'Bitte Frage, E-Mail und Einverständnis angeben.',
    call:'Anrufen',wa:'Per WhatsApp schreiben',mail:'E-Mail-Adresse kopieren',copied:'Kopiert: ',
    mailSubject:'Anfrage Werbevideo',
    foot:'Automatischer Assistent. Nachrichten an Denys gehen per E-Mail. ',priv:'Datenschutz',privHref:'/datenschutz'
  }:{
    title:'SellAdShot Assistant',sub:'Instant answers · Denys replies personally',
    open:'Open chat',close:'Close chat',ph:'Ask a question …',send:'Send message',label:'Message',
    greet:'Hello, and welcome to SellAdShot! I\'m so glad you stopped by. How can I help you today?',
    chips:[['price','How much does a video cost?'],['addons','How are add-ons priced?'],['process','How does a project work?'],['quote','Ask Denys / quote']],
    a:{
      price:'Thank you for asking! I\'d be happy to help: Reels, TikToks and AI avatar videos start from €55 per video, or €500 for a pack of 10. AI ad and explainer videos start at €100 (10 seconds) or €500 (60 seconds). These are starting prices. Once I\'ve put together your concept, I\'ll gladly confirm the exact price.',
      addons:'Great question, thank you! Add-ons are priced by complexity, and I look at every case individually to make sure you get a fair price. The prices shown are starting prices, and I\'ll confirm your final price as soon as your concept is ready.',
      process:'Absolutely, I\'d love to walk you through it! First, please let me know a little about your product and your goal. Then I\'d prepare a concept for you and share the price. Once you\'re happy with it, I\'ll take care of producing your video.',
      quote:'I\'d be delighted to help! Please share your question or a few words about your project, and Denys will personally get back to you by e-mail.',
      fallback:'That\'s a great question for Denys himself, and he\'d be happy to help personally. Please write your question here:',
      sent:'Thank you so much for your message! Denys will get back to you by e-mail, usually on the same day. Is there anything else I can help you with in the meantime?',
      fail:'I\'m so sorry, that didn\'t go through. Please contact Denys directly via WhatsApp or e-mail, and he\'ll be glad to help:'
    },
    fq:'Your question',fm:'Your e-mail',fc:'I agree that my details are sent by e-mail so my question can be answered.',fs:'Send',fsending:'Sending …',ferr:'Please enter a question, an e-mail and your consent.',
    call:'Call',wa:'Message on WhatsApp',mail:'Copy e-mail address',copied:'Copied: ',
    mailSubject:'Video enquiry',
    foot:'Automated assistant. Messages to Denys are sent by e-mail. ',priv:'Privacy',privHref:'/privacy'
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
  var ph=el('a','sas-x sas-ph');ph.href='tel:+4917663444890';ph.setAttribute('aria-label',T.call+' +49 176 63444890');ph.title='+49 176 63444890';
  ph.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
  head.appendChild(av);head.appendChild(ht);head.appendChild(ph);head.appendChild(x);

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
    var b=el('button','sas-lk',T.mail);b.type='button';
    b.addEventListener('click',function(){
      function done(){b.textContent=T.copied+MAIL;}
      function manual(){b.textContent=MAIL;var r=document.createRange();r.selectNodeContents(b);var sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(MAIL).then(done,manual);}else{manual();}
    });
    var c=el('a','sas-lk',T.call+': +49 176 63444890');c.href='tel:+4917663444890';
    w.appendChild(a);w.appendChild(b);w.appendChild(c);log.appendChild(w);
  }
  function ask2(){
    var f=el('form','sas-card');f.noValidate=true;
    var l1=el('label','sas-lb',T.fq);l1.setAttribute('for','sas-q');
    var q=el('textarea','sas-ta');q.id='sas-q';q.rows=3;q.maxLength=1500;
    var l2=el('label','sas-lb',T.fm);l2.setAttribute('for','sas-em');
    var em=el('input','sas-in sas-em');em.id='sas-em';em.type='email';em.autocomplete='email';em.maxLength=120;
    var cl=el('label','sas-ck');var cb=el('input');cb.type='checkbox';cl.appendChild(cb);cl.appendChild(el('span',null,T.fc));
    var hp=el('input');hp.type='checkbox';hp.name='botcheck';hp.tabIndex=-1;hp.setAttribute('aria-hidden','true');hp.style.display='none';
    var er=el('div','sas-er');er.setAttribute('role','alert');
    var go=el('button','sas-go',T.fs);go.type='submit';
    [l1,q,l2,em,cl,hp,er,go].forEach(function(n){f.appendChild(n);});
    f.addEventListener('submit',function(e){
      e.preventDefault();er.textContent='';
      var qv=q.value.trim(),ev=em.value.trim();
      if(!qv||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ev)||!cb.checked){er.textContent=T.ferr;return;}
      if(hp.checked)return;
      go.disabled=true;go.textContent=T.fsending;
      fetch('https://formsubmit.co/ajax/'+MAIL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
        body:JSON.stringify({_subject:'SellAdShot Chat ('+(de?'DE':'EN')+')',_captcha:'false',_template:'box',name:'SellAdShot Chat',email:ev,message:qv})})
      .then(function(r){return r.json();})
      .then(function(j){
        if(String(j.success)!=='true')throw new Error('x');
        f.parentNode.removeChild(f);msg('me',qv);msg('bot',T.a.sent);showChips();
      }).catch(function(){
        f.parentNode.removeChild(f);msg('bot',T.a.fail);links();showChips();
      });
    });
    log.appendChild(f);scroll();q.focus();
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
    if(key==='fallback'||key==='quote'){msg('bot',T.a[key]);ask2();return;}
    msg('bot',T.a[key]);
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
