!function(o){"use strict";AOS.init({once:!0}),o(window).on("scroll",function(){const n=o(".scroll-top-to");(o(window).scrollTop()||0)>=200?n.fadeIn(200):n.fadeOut(100)}),o(".scroll-top-to").on("click",function(){return o("body,html").animate({scrollTop:0},500),!1}),o(document).ready(function(){(o(window).width()||0)<992&&o(".main-nav .dropdown-toggle").on("click",function(){o(this).siblings(".dropdown-menu").animate({height:"toggle"},300)});const n={dots:!0,arrows:!1,lazyLoad:"ondemand",infinite:!0,speed:1e3,slidesToShow:3,slidesToScroll:1,swipeToSlide:!0,pauseOnHover:!0,autoplay:!0,autoplaySpeed:2e3,variableWidth:!0};function e(e){const t={...n};o(e).slick(t)}!function(){const n=o(".slick-carousel");if("IntersectionObserver"in window){const o=new IntersectionObserver((o,n)=>{o.forEach(o=>{o.isIntersecting&&(e(o.target),n.unobserve(o.target),window.dispatchEvent(new Event("resize")))})},{root:null,rootMargin:"50%",threshold:0});n.map((n,e)=>o.observe(e))}else n.map((o,n)=>e(n))}()})}(jQuery);
//# sourceMappingURL=script.js.map
