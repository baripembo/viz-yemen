function initSlideshow() {
  var controller = new ScrollMagic.Controller();
  var captions = document.querySelectorAll('.caption');
  for (var i=0; i<captions.length; i++) {
    new ScrollMagic.Scene({
        triggerElement: captions[i],
        triggerHook: 0.9
      })
      .on('enter', function(e) {
        var id = Number($(e.target.triggerElement()).data('caption'));
        $('[data-img="'+(id-1)+'"]').css('opacity', 0);
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('caption'));
        $('[data-img="'+(id-1)+'"]').css('opacity', 1);
      })
      .addTo(controller);
  }
}