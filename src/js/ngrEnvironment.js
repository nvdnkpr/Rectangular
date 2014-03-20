 angular.module('Rectangular')
   .service('ngrEnvironment', function(ngrWorld, ngrInterface, ngrStage, ngrModels, ngrDefaults, $q, ngrState, ngrLoop, ngrDisplay) {

     this.addHook = ngrLoop.addHook;
     this.clearHooks = ngrLoop.clearHooks;
     this.setGravity = ngrWorld.setGravity;
     this.setWorldHeight = ngrState.setWorldHeight;
     this.getJSON = ngrState.getJSON;
     this.blocker = ngrStage.blocker;
     this.pin = ngrInterface.pinToMouse;
     this.load = ngrWorld.load;
     this.follow = ngrWorld.follow;
     this.unfollow = ngrWorld.unfollow;
     this.setFocusOffset = ngrState.setFocusOffset;
     this.getBodyByUserData = ngrWorld.getBodyByUserData;

     var e = this;
     var _canvas;
     var roomBodies = {};

     this.setFocus = function(focusObject) {
       ngrState.setFocus(focusObject);
     }

     this.init = function(worldInitObject) {

       var defaults = _.clone(ngrDefaults.initialize);
       var options = _.extend(defaults, worldInitObject);

       _canvas = options.canvas || $('canvas')[0];
       options.canvas = _canvas;
       options.height = _canvas.height;
       options.width = _canvas.width;

       if (options.room) {
         options.worldHeight = options.room.height;
         options.worldWidth = options.room.width;
       }

       options.SCALE = options.scale || 30;

       options.speed = options.fps;

       ngrState.setProperties(options);
       ngrLoop.initWorld(options.fps);
       ngrWorld.setWorld(0, options.gravity, true);
       ngrStage.init(_canvas);


       if (options.room) {
         ngrState.setRoom(options.room);
         e.createRoom();

         var r = options.room;
         ngrState.setFocus({
           x: r.width / 2,
           y: r.height / 2
         });

         if (!options.zoom) {
           var zoomReq = r.height / (_canvas.height / 4);
          ngrState.setZoom(zoomReq);
        }
       }

       e.start();

     }

     this.setZoom = ngrState.setZoom;

     this.floor = function(options) {
        //console.log("Drawing floor,",roomBodies);
       if (roomBodies.floor) e.remove(roomBodies.floor);
       var floor = ngrModels.floor(options);
       roomBodies.floor = e.add('box', floor.options);
       console.log("roombodies?",roomBodies);
     }

     this.updateRoom = ngrState.updateRoom;

     this.createRoom = function(options) {
       this.clearRoom();
       var r = ngrState.getRoom();
       console.log("Creating room...",options,r);
       if (r.floor) e.floor(options);
       if (r.leftWall) e.leftWall(options);
       if (r.rightWall) e.rightWall(options);
       if (r.roof) e.roof();

     }

     this.clearRoom = function() {
         console.log("Clearing room...",roomBodies);
         if (!roomBodies) return;
       if (roomBodies.roof) e.remove(roomBodies.roof);
       if (roomBodies.leftWall) e.remove(roomBodies.leftWall);
       if (roomBodies.rightWall) e.remove(roomBodies.rightWall);
       if (roomBodies.floor) e.remove(roomBodies.floor);
       roomBodies = {};
     }

     this.roof = function(options) {

       if (roomBodies.roof) e.remove(roomBodies.roof);
       var roof = ngrModels.roof(options);
       roomBodies.roof = e.add('box', roof.options);
     }


     this.leftWall = function(options) {

       if (roomBodies.leftWall) e.remove(roomBodies.leftWall);
       var leftWall = ngrModels.leftWall(options);
       roomBodies.leftWall = e.add('box', leftWall.options);
     }

     this.rightWall = function(options) {

       if (roomBodies.rightWall) e.remove(roomBodies.rightWall);
       var rightWall = ngrModels.rightWall(options);
       roomBodies.rightWall = e.add('box', rightWall.options);
     }

     e.setWorldSpeed = function(speed) {
       ngrLoop.setSpeed(speed);
     }


     this.stop = function() {
       ngrLoop.stop();
     }

     this.start = function() {
       ngrLoop.start();
       //e.debug();
     }

     this.add = function(type, options) {
       if (!options) throw new Error("You can't add a shape without options.");
       options.shapeKind = type;

       var b = ngrWorld.addElement(options);

       ngrDisplay.skin(b, options);

       console.log("adding...",b);

       return b;
     }

     this.remove = function(body) {

      console.log("Removing body",body);
      //if (!body.container) throw new Error("Body has no container");
      
       ngrStage.removeChild(body.container);
       ngrWorld.removeElement(body);

     }

     this.clearAll = function() {
       ngrWorld.clearAll();
       ngrStage.clearAll();
       ngrLoop.clearHooks();
     }

     this.toggleDebug = ngrStage.toggleDebug;

     this.debug = ngrStage.debug;

   })
