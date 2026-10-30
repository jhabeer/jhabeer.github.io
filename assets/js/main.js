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
  function onScroll(){h.classList.toggle('scrolled',window.scrollY>40)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  // floating whatsapp button: show after hero, hide in contact section
  var fab=d.querySelector('.fab'),hero=d.querySelector('.hero'),contact=d.getElementById('contact');
  if(fab&&'IntersectionObserver' in window){
    var heroOut=false,contactIn=false;
    function upd(){fab.classList.toggle('show',heroOut&&!contactIn)}
    new IntersectionObserver(function(es){heroOut=!es[0].isIntersecting;upd()},{threshold:.15}).observe(hero);
    new IntersectionObserver(function(es){contactIn=es[0].isIntersecting;upd()},{threshold:.2}).observe(contact);
  }
})();
