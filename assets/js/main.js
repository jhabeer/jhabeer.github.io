(function(){
  var d=document,root=d.documentElement;
  // reveal on scroll
  var els=[].slice.call(d.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el,i){io.observe(el)});
  }else{els.forEach(function(el){el.classList.add('in')})}
  // header state
  var h=d.querySelector('.site-header');
  function onScroll(){if(h)h.classList.toggle('scrolled',window.scrollY>40)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  // floating whatsapp button: show after hero, hide in contact section
  var fab=d.querySelector('.fab'),hero=d.querySelector('.hero'),contact=d.getElementById('contact');
  if(fab&&hero&&contact&&'IntersectionObserver' in window){
    var heroOut=false,contactIn=false;
    function upd(){fab.classList.toggle('show',heroOut&&!contactIn)}
    new IntersectionObserver(function(es){heroOut=!es[0].isIntersecting;upd()},{threshold:.15}).observe(hero);
    new IntersectionObserver(function(es){contactIn=es[0].isIntersecting;upd()},{threshold:.2}).observe(contact);
  }
})();

/* YouTube click-to-play facades: nothing from YouTube loads until a visitor taps play */
(function(){
  var d=document;
  function play(a){
    var id=a.getAttribute('data-yt'),st=a.getAttribute('data-start'),title=a.getAttribute('data-title')||'YouTube video';
    var f=d.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1'+(st?'&start='+st:'');
    f.title=title;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen','');f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
    var box=d.createElement('div');box.className='yt is-live'+(a.classList.contains('yt-mini')?' yt-live':'');
    box.appendChild(f);
    if(a.classList.contains('yt-mini')){a.parentNode.replaceChild(box,a)}
    else{a.classList.add('is-live');a.removeAttribute('href');a.innerHTML='';a.appendChild(f)}
    f.focus&&f.focus();
  }
  d.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[data-yt]');
    if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.button===1)return;
    e.preventDefault();play(a);
  });
  // keep the videos grid current: assets/videos.json is refreshed daily from the channel's public feed
  var g=d.getElementById('vgrid');
  if(g&&window.fetch){
    fetch('assets/videos.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null}).then(function(j){
      if(!j||!j.videos||!j.videos.length)return;
      var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      g.innerHTML='';
      j.videos.slice(0,6).forEach(function(v){
        if(!/^[\w-]{11}$/.test(v.id))return;
        var c=d.createElement('div');c.className='vcard in';
        var a=d.createElement('a');a.className='yt';a.href='https://www.youtube.com/watch?v='+v.id;
        a.setAttribute('data-yt',v.id);a.setAttribute('data-title',v.title);a.setAttribute('aria-label','Play video: '+v.title);
        var im=d.createElement('img');im.src='https://i.ytimg.com/vi/'+v.id+'/mqdefault.jpg';im.width=320;im.height=180;im.loading='lazy';im.alt='Video thumbnail: '+v.title;
        var pl=d.createElement('span');pl.className='play';pl.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
        a.appendChild(im);a.appendChild(pl);
        var h=d.createElement('h4');h.textContent=v.title;
        var m=d.createElement('span');m.className='mono';var p=v.published.split('-');m.textContent=+p[2]+' '+months[+p[1]-1]+' '+p[0];
        c.appendChild(a);c.appendChild(h);c.appendChild(m);g.appendChild(c);
      });
    }).catch(function(){});
  }
})();
