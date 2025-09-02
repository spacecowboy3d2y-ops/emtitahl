<script>
/* ===== Load header/footer partials, then init the UI ===== */
(function(){
  const slots=[...document.querySelectorAll('[data-include]')];
  if(!slots.length){ initUI(); return; }
  Promise.all(slots.map(async el=>{
    const file=el.getAttribute('data-include');
    const html=await fetch(file,{cache:'no-store'}).then(r=>r.text());
    el.outerHTML=html;
  })).then(initUI);
})();

/* ===== UI after header/footer exist ===== */
function initUI(){
  const hdr=document.getElementById('siteHeader');
  const mainMenu=document.getElementById('mainMenu');
  const navToggle=document.getElementById('navToggle');
  const menuServices=document.getElementById('menuServices');

  // Sticky header look
  const onScroll=()=>hdr?.classList.toggle('scrolled', scrollY>10);
  onScroll(); addEventListener('scroll', onScroll, {passive:true});

  // Mobile menu toggle
  navToggle?.addEventListener('click', ()=>{
    const open=mainMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  // Mobile dropdown tap-to-open
  menuServices?.addEventListener('click', e=>{
    if(innerWidth<=760){
      if(!menuServices.classList.contains('open-dd')) e.preventDefault();
      menuServices.classList.toggle('open-dd');
    }
  });

  // Desktop dropdown hover-intent (hide delay)
  let ddWired=false;
  function wireDropdownTimers(){
    if(innerWidth<=760){ unwireDropdownTimers(); return; }
    if(ddWired) return;
    document.querySelectorAll('.main-menu > li').forEach(li=>{
      const dd=li.querySelector('.dropdown'); if(!dd) return;
      let t; const show=()=>{ clearTimeout(t); dd.classList.add('js-open'); };
      const hide=()=>{ t=setTimeout(()=>dd.classList.remove('js-open'), 250); }; // change 250ms if you like
      li.__ddShow=show; li.__ddHide=hide;
      li.addEventListener('mouseenter', show);
      li.addEventListener('mouseleave', hide);
      dd.addEventListener('mouseenter', show);
      dd.addEventListener('mouseleave', hide);
    });
    ddWired=true;
  }
  function unwireDropdownTimers(){
    document.querySelectorAll('.main-menu > li').forEach(li=>{
      const dd=li.querySelector('.dropdown'); if(!dd) return;
      if(li.__ddShow){ li.removeEventListener('mouseenter', li.__ddShow); dd.removeEventListener('mouseenter', li.__ddShow); }
      if(li.__ddHide){ li.removeEventListener('mouseleave', li.__ddHide); dd.removeEventListener('mouseleave', li.__ddHide); }
      dd.classList.remove('js-open'); li.__ddShow=null; li.__ddHide=null;
    });
    ddWired=false;
  }
  wireDropdownTimers();
  addEventListener('resize', ()=>{ setTimeout(()=>{ unwireDropdownTimers(); wireDropdownTimers(); }, 120); }, {passive:true});

  // Active nav highlight
  const file=(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.main-menu a').forEach(a=>{
    const name=(a.getAttribute('href')||'').split('/').pop().toLowerCase();
    if(name===file) a.classList.add('active');
  });
  if(['environmental.html','mobile-lab.html','pest-control.html'].includes(file)){
    document.querySelectorAll('.main-menu a[href="services.html"]').forEach(a=>a.classList.add('active'));
  }

  // Clients marquee — seamless loop for any .logo-slider on the page
  document.querySelectorAll('.logo-slider').forEach(slider=>{
    const GAP=28; const track=slider.querySelector('.logo-track'); if(!track) return;
    const originals=[...track.children].map(n=>n.cloneNode(true));
    function setWidth(nodes){const rects=nodes.map(n=>n.getBoundingClientRect().width);let w=0;rects.forEach((rw,i)=>{w+=rw;if(i)w+=GAP;});return w;}
    function build(){
      track.innerHTML=''; originals.forEach(n=>track.appendChild(n.cloneNode(true)));
      const one=[...track.children]; let setW=setWidth(one);
      while(track.scrollWidth<slider.clientWidth+setW*1.2){ one.forEach(n=>track.appendChild(n.cloneNode(true))); }
      one.forEach(n=>track.appendChild(n.cloneNode(true)));
      const firstSet=[...track.children].slice(0, originals.length);
      setW=setWidth(firstSet); slider.style.setProperty('--loopW', setW+'px');
      const dur=Math.max(16, Math.round(setW/55)); track.style.setProperty('--marqueeDur', dur+'s');
    }
    build(); let t; addEventListener('resize',()=>{clearTimeout(t); t=setTimeout(build,200);},{passive:true});
  });

  // Back-to-top button
  const backBtn=document.getElementById('backToTop');
  if(backBtn){
    const showTop=()=>backBtn.classList.toggle('show', scrollY>280);
    showTop(); addEventListener('scroll', showTop, {passive:true});
    backBtn.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
  }
}
</script>
