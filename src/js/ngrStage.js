angular.module('Rectangular')
  .service('ngrStage', function(ngrLoop, ngrState, ngrSkin, $q, ngrDebug) {

    var canvas = $('canvas')[0];
    var parallaxCenter;
    var stage = new Stage(canvas);
    var c = new createjs.Container();
    var bgContainer = new createjs.Container();
    var ctx = $(canvas).get(0).getContext('2d');
    var ctxCurrentTranslation = {
      x: 0,
      y: 0
    }
    var actors = [];
    this.actors = actors;
    this.stage = stage;
    var e;


    var following = false;
    var target = null;

    var s = this;

    var p = $(canvas).parent();

    this.debug = ngrDebug.toggleDebug;



    if (!$('.blocker')[0]) {
      p.append('<div class="blocker"></div>');
      $('.blocker').append('<div class="blocker-inner"></div>');
    }

    this.background = function(body, options) {
      console.log("Backgrounding...",body,options);
      var sprite = ngrSkin.background(body, options);
      bgContainer.addChild(sprite.container);
    }


    this.getContext = function() {
      return ctx;
    }

    this.toggleStage = function(toggle) {
      if (toggle) {
        c.alpha = 1;
      } else {
        c.alpha = 0;
      }
    }

    this.addChild = function(container) {
      c.addChild(container);
    }

    this.removeChild = function(container) {
      if (container && container.parent) container.parent.removeChild(container);
    }

    this.addSprite = function(b,options) {

      var sprite = ngrSkin.skin(b,options);
      s.addChild(sprite.container);
      actors.push(sprite.actor);

    }

    this.setFocusPoint = function(vec) {
      focusPoint = vec;

    };

    this.follow = function(_target) {
      target = _target;

    };

    this.init = function() {

      s.clearAll();

      ngrDebug.debug(canvas);


      parallaxCenter = ngrState.getRoomCenter();


    }

    this.addChildAt = function(container, index, background) {
      c.addChildAt(container, index);
      if (background) {
        bgContainer.addChild(container);
      }
    }



    this.clearAll = function() {
      stage.removeAllChildren();
      stage.update();
      ctx.save();
      ctx.restore();
      c = new createjs.Container();
      c.removeAllChildren();
      stage.addChild(bgContainer);
      stage.addChild(c);

      ctx.translate(-ctxCurrentTranslation.x, -ctxCurrentTranslation.y);
      ctxCurrentTranslation = {
        x: 0,
        y: 0
      }

      window.container = c;

    }


    function tick() {

      var state = ngrState.getState();
      var focus = ngrState.getFocus();
      var scale = ngrState.getScale() * ngrState.getZoom();
      var constraint = ngrState.getFocusConstraint();

      var newTranslation = {
        x: focus.x * scale - 0.5 * canvas.width,
        y: -focus.y * scale + 0.5 * canvas.height
      }
      if (state.constrainFocusToRoom) {
        var roomHeightPixels = state.room.height * scale;
        var roomWidthPixels = state.room.width * scale;

        if (newTranslation.y - canvas.height < -roomHeightPixels) newTranslation.y = -roomHeightPixels + canvas.height;
        if (newTranslation.x + canvas.width > roomWidthPixels) newTranslation.x = roomWidthPixels - canvas.width;
        if (newTranslation.y > 0) newTranslation.y = 0;
        if (newTranslation.x < 0) newTranslation.x = 0;

      }

      c.x = -newTranslation.x;
      c.y = newTranslation.y;
      bgContainer.x = c.x / 2;
      bgContainer.y = c.y / 2;
      ctxCurrentTranslation = newTranslation;

      ngrDebug.update({
        x: -newTranslation.x,
        y: newTranslation.y
      }, scale, canvas);

      ctx.restore();
      _.each(actors, function(actor) {
        actor.update();
      })
      stage.update();

    }

    var blockerRunning = false;
    var r;

    this.blocker = function() {

      if (blockerRunning) return r.promise;

      r = $q.defer();
      $('.blocker-inner').addClass('slide');
      blockerRunning = true;

      setTimeout(function() {
        r.resolve();
        blockerRunning = false;
      }, 500);

      setTimeout(function() {
        $('.blocker-inner').removeClass('slide');
      }, 1000);

      return r.promise;

    }

    ngrLoop.addPermanentHook(tick);
  })
