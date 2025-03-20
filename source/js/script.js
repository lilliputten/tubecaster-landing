(function ($) {
  "use strict";

  // ----------------------------
  // AOS
  // ----------------------------
  AOS.init({
    once: true,
  });

  $(window).on("scroll", function () {
    //.Scroll to top show/hide
    var scrollToTop = $(".scroll-top-to"),
      scroll = $(window).scrollTop();
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
    if ($(window).width() < 992) {
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
    $(".shots-slider").owlCarousel({
      margin: 20,
      loop: true,
      autoWidth: true,
      // items: 4,
      infinite: true,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 2000,
      dots: true,
    });

  });
})(jQuery);
