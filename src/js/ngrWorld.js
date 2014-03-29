angular.module('Rectangular')
/* Creates an instance of the world of the simulation, 
   and provides an interface for it. */
.service("ngrWorld", function (ngrBox, ngrBody) {

  var world,
    bodies = [],
    w = this,
    onCreateBodyListeners = [];

  var worldLoop = undefined;

  this.getBodyById = function (_id) {
    return w.getBodiesByAttribute('id', _id)[0];
  }



  this.oncreatebody = function(l) {
    onCreateBodyListeners.push(l);
  }

  this.getBodyByAttribute = function (key, val) {
    return w.getBodiesByAttribute(key, val)[0];
  }

  this.getBodiesByAttribute = function (key, val) {
    return _.filter(bodies, function (body) {
      if (body.options[key] == val) return true;
    }) || [];
  }

  this.getBodyByUserData = function (key, val) {
    return w.getBodiesByUserData(key, val)[0];
  }

  this.getBodiesByUserData = function (key, val) {
    return _.filter(bodies, function (body) {
      if (body.GetUserData() && body.GetUserData()[key] == val) return true;
    })
  }

  this.addElement = function (options) {

    console.log("Adding element",options);

    var def = ngrBox.shape(options);
    var id = options.id || guid();

    var b = world.CreateBody(def.getBodyDef());
    var f = def.getFixtureDef()
    b.CreateFixture(f);

    b = new ngrBody.Body(b);
    
    b.oncrumble(function (body) {
      w.removeElement(body);
    })

    if (options.userData) b.SetUserData(options.userData);

    if (options.memo) {
      var prev = w.getBodyByAttribute('memo', options.memo);
      if (prev) w.removeElement(prev);
    }

    b.id = id;
    b.definition = def;


    b.options = _.clone(options);
    b.options.cycle = 0;

    bodies.push(b);

    _.call(onCreateBodyListeners,b);

    return b;
  };

  this.getElements = function() {
    return bodies;
  }


  this.removeElement = function (body) {

    var elId = body.id;
    world.DestroyBody(body);

    bodies = _.chain(bodies)
      .map(function (_body) {
        if (_body.id != elId) return _body;
      })
      .compact()
      .value();

    

  }

  this.clearAll = function () {
    _.each(bodies, function (body) {
      body.crumble();
    });

    _.each(pins, function (pin) {
      w.destroyJoint(pin);
    });

    bodies = [];
  }

  this.setGravity = function (grav) {
    world.SetGravity(new b2Vec2(0, grav))
  };

  this.tick = function() {

    world.Step(1 / 60, 10, 10)
    world.ClearForces();
    world.DrawDebugData();

  }

  this.setWorld = function (gravityX, gravityY, sleep) {

    var gravity = new b2Vec2(gravityX, gravityY);
    var doSleep = sleep;

    world = world || new b2World(gravity, false);

    return world;
  }

  this.getWorld = function () {
    return world;
  }
})
