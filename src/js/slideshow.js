function initSlideshow() {
  var slideshowController = new ScrollMagic.Controller();
  
  // var id = $(this).attr('id');
  // var containerHeight = $(this).find(' div').innerHeight();
  // var annotationHeight = $(this).find('.annotation').innerHeight();
  // var pinSceneTimeline = new TimelineMax();
  // var newY = containerHeight/2 + annotationHeight/2;
  // pinSceneTimeline.fromTo($(this).find('.annotation'), 0.2, {y: '+='+viewportHeight/2}, {y: -newY, autoAlpha: 1, ease:Power1.easeNone});
  var numSlides = $('.slideshow-inner').find('.img-container').length;
  var pinScene = new ScrollMagic.Scene({
    triggerElement: '#slideshow', 
    triggerHook: 0.5,
    duration: '300%', 
    offset: viewportHeight/2
  })
  //.addIndicators({name: '1'})
  .setPin('#slideshow')
  //.setTween(pinSceneTimeline)
  // .on('update', function(e) {
  //   console.log(e.target.controller().info('scrollDirection'));
  // })
  .on('progress', function (e) {
    var progress = parseFloat(e.progress.toFixed(2));
    if (e.target.controller().info('scrollDirection')=='FORWARD') {
      if (progress>=0.3 && progress<=0.6) {
        $('.slideshow-inner').find('.img-container[data-slide="3"').css('opacity', 0);
      }
      else if (progress>=0.6 && progress<=1) {
        $('.slideshow-inner').find('.img-container[data-slide="2"').css('opacity', 0);
      }
    }
    else {
      if (progress<0.6 && progress>=0.3) {
        $('.slideshow-inner').find('.img-container[data-slide="2"').css('opacity', 1);
      }
      else if (progress<0.3 && progress>=0) {
        $('.slideshow-inner').find('.img-container[data-slide="3"').css('opacity', 1);
      }
    }
  })
  .addTo(slideshowController);
}