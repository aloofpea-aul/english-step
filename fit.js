/* แก้หน้าจอเล็กผิดปกติบนมือถือ เมื่อ Chrome เปิดแบบ "เวอร์ชันเดสก์ท็อป" (ไม่สนใจ viewport แล้ววาดกว้าง ~980px) */
(function(){try{
 var de=document.documentElement,touch=('ontouchstart' in window)||navigator.maxTouchPoints>0;
 function fit(){var sw=screen.width||0,w=window.innerWidth||de.clientWidth;de.style.zoom='';
  if(touch&&sw&&sw<820&&w>sw*1.3){var z=Math.min(3,w/sw);de.style.zoom=z;de.setAttribute('data-fit',z.toFixed(2))}}
 fit();window.addEventListener('resize',fit);window.addEventListener('orientationchange',function(){setTimeout(fit,300)});
}catch(e){}})();
