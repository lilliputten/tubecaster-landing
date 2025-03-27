// @ts-check

(function ($) {
  "use strict";

  // ----------------------------
  // AOS
  // ----------------------------
  // @ts-ignore
  AOS.init({
    once: true,
  });

  $(window).on("scroll", function () {
    //.Scroll to top show/hide
    const scrollToTop = $(".scroll-top-to");
    const scroll = $(window).scrollTop() || 0;
    if (scroll >= 200) {
      scrollToTop.fadeIn(200);
    } else {
      scrollToTop.fadeOut(100);
    }
  });

  // scroll-to-top
  $(".scroll-top-to").on("click", function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      500
    );
    return false;
  });

  $(document).ready(function () {
    // navbarDropdown
    const width = $(window).width() || 0;
    if (width < 992) {
      $(".main-nav .dropdown-toggle").on("click", function () {
        $(this).siblings(".dropdown-menu").animate(
          {
            height: "toggle",
          },
          300
        );
      });
    }

    // -----------------------------
    //  Shots Slider
    // -----------------------------
    /*

    /** @type {JQuerySlickOptions} */
    const defaultCarouselSettings = {
      // @see https://kenwheeler.github.io/slick/

      dots: true,
      arrows: false,

      lazyLoad: "ondemand",

      infinite: true,
      speed: 1000,
      slidesToShow: 3,
      slidesToScroll: 1,

      swipeToSlide: true,

      pauseOnHover: true,

      autoplay: true,
      autoplaySpeed: 2000,

      variableWidth: true,
    };

    /** @param {HTMLElement} carousel */
    function initCarousel(carousel) {
      // const type = carousel.getAttribute("data-carousel-type")
      // const extraSettings = extraCarouselSettings[type]
      // const seedSettings = seedResponsive(responsiveSeeds[type])
      const settings = {
        ...defaultCarouselSettings,
        // ...extraSettings,
        // ...seedSettings
      };
      $(carousel).slick(settings);
    }

    function initCarousels() {
      const carousels = $(".slick-carousel");
      if ("IntersectionObserver" in window) {
        // IntersectionObserver Supported
        const onChange =
          /**
           * @param {IntersectionObserverEntry[]} entries
           * @param {IntersectionObserver} observer
           */
          (entries, observer) => {
            entries.forEach((element) => {
              if (element.isIntersecting) {
                // Stop watching and load the slickSlider
                initCarousel(/** @type {HTMLElement} */ (element.target));
                observer.unobserve(element.target);
              }
            });
          };
        const observer = new IntersectionObserver(onChange, {
          // @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#creating_an_intersection_observer
          root: null,
          rootMargin: "50%",
          threshold: 0.0,
        });
        carousels.map((_idx, carousel) => observer.observe(carousel));
      } else {
        // IntersectionObserver NOT Supported
        carousels.map((_idx, carousel) => initCarousel(carousel));
      }
    }

    initCarousels();
  });
})(jQuery);
