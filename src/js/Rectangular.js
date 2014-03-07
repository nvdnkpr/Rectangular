angular.module('Rectangular',[])
.service('ngrEnvironment',function(ngrWorld,ngrStage,ngrState,ngrBox,ngrDebug,ngrLoop,ngrDisplay){

	var world;

	var envHeight;
	var envWidth;
	var canvas;
	var env = {};
	var ngEnv = this;
	var SCALE = 30;


	this.init = function(_canvas){
		env.height = _canvas.height;
		env.width = _canvas.width;
		env.SCALE = SCALE;
		ngrState.setProperties(env);
		canvas = _canvas;
		world = ngrWorld.setWorld(0,30,true);
		ngrLoop.initWorld(60,env);
	}

	this.stop = function() {
		ngrLoop.stop();
	}

	this.addHook = ngrLoop.addHook;
	this.clearHooks = ngrLoop.clearHooks;

	this.floor = ngrWorld.floor;
	this.room = ngrWorld.room;
	this.leftWall = ngrWorld.leftWall;
	this.rightWall = ngrWorld.rightWall;
	

	this.debug = function(_debugCanvas) {
		var ctx = _debugCanvas.getContext('2d');
    ngrDebug.debug(ctx);
	}

})

.service('ngrState',function(){
	 var properties;
	 var state = this;
	 this.state = properties;
	 this.SCALE = 30;

	 this.setProperties = function(_properties) {
	 		properties = _properties;
	 		state.SCALE = properties.SCALE;

	 }

	 this.getProperties = function() {
	 		if (!properties) {
	 			throw new Error("Attempting to access undefined properties.")
	 		}
	 		return properties;
	 }


})


.service('ngrLoop', function(ngrWorld, ngrStage){
	var l = this;
	var ctx = ngrStage.context;
	var speed = 60;
	var loop;
	var world;
	var hooks = [];

	this.tick = function() {
		world = ngrWorld.getWorld();
		ctx.save();
		world.Step(1/60,10,10)
		world.ClearForces();
		world.DrawDebugData();
		ctx.restore();
		ngrStage.stage.update();
		_.each(ngrStage.actors,function(actor){
				actor.update();
		})

		_.each(hooks,function(hook){
			hook();
		})
	}

	this.addHook = function(func) {
		hooks.push(func);
	};

	this.clearHooks = function() {
		hooks = [];
	}

	this.stop = function() {
		clearInterval(loop);
	}

	this.initWorld = function(_speed) {
		speed = _speed;
//		console.log("Initigin world")
		loop = setInterval(l.tick, 1000 / speed)
	};
})

.service('ngrDebug',function(ngrWorld){
	this.debug = function(ctx) {

		var world = ngrWorld.getWorld();
			var debugDraw = new b2DebugDraw();
			var scale = ngrWorld.SCALE;
			debugDraw.SetSprite(ctx);
			debugDraw.SetDrawScale(scale);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
		}
})




