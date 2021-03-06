angular.module('Rectangular')
/* Creates an instance of the world of the simulation, 
   and provides an interface for it. */
.service("ngrWorld", function (ngrBox, ngrBody) {

  var world,
    bodies = [],
    onCreateBodyListeners = [],
    w = this;


  var worldLoop = undefined;

  this.getBodyById = function (_id) {
    return w.getBodiesByAttribute('id', _id)[0];
  }

  this.oncreatebody = function(l) {
    onCreateBodyListeners.push(l);
  }

  this.addMouseJoint = function (body, target) {

    if (!body) throw new Error("Can't pin nothing.");
    body.pins = body.pins || [];;
    var r = target;
    var mouse_joint = new b2MouseJointDef();
    
    mouse_joint.bodyA = w.getWorld().GetGroundBody();
    mouse_joint.bodyB = body;
    mouse_joint.target.Set(r.worldPosX, r.worldPosY);
    mouse_joint.collideConnected = true;

    mouse_joint.maxForce = Number(body.mass) * 300;
    mouseJointBody = world.CreateJoint(mouse_joint);

    return mouseJointBody;
  }

  this.destroyJoint = function (joint) {
     world.DestroyJoint(joint);
  }

  this.getBodyByAttribute = function (key, val) {
    return w.getBodiesByAttribute(key, val)[0];
  }

  this.getBodiesByAttribute = function (key, val) {
    return _.filter(bodies, function (body) {
      if (body.options[key] == val) return true;
    }) || [];
  }

  this.createMouseJoint = function (body) {
    
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

    var def = ngrBox.shape(options);
    var id = options.id || guid();
    
    

    var b = world.CreateBody(def.getBodyDef());
    var f = def.getFixtureDef()
    if (!b) {
      console.log("Buggy definition?",options);
      return;
    } else {
      //console.log("Good definition",options);
    }
    b.CreateFixture(f);

    
    b.options = options;

    var _b = ngrBody(b);
    
    _b.oncrumble(function (body) {
      w.removeElement(body);
    })

    if (options.userData) _b.SetUserData(options.userData);

    if (options.memo) {
      var prev = w.getBodyByAttribute('memo', options.memo);
      if (prev) w.removeElement(prev);
    }

    _b.id = id;
    _b.definition = def;


    _b.options = _.clone(options);
    _b.options.cycle = 0;

    bodies.push(_b);

    _.call(onCreateBodyListeners,_b);

    return _b;
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

  var b2World = function(gravity,draw) {
    var world = new Box2D.Dynamics.b2World(gravity,draw);
    var b2Listener = Box2D.Dynamics.b2ContactListener;

    world.onCreateBodyListeners = [];
    world.beginContactListeners = [];
    world.presolveListeners = [];
    world.postsolveListeners = [];
    world.endContactListeners = [];

    //Add listeners for contact
    var listener = new b2Listener;

    listener.BeginContact = function(contact) {

       _.call(world.beginContactListeners,contact);
    }

    listener.EndContact = function(contact) {
      _.call(world.endContactListeners,contact);
    }

    listener.PostSolve = function(contact, impulse) {
      _.call(world.postsolveListeners,contact);

       
    }

    listener.PreSolve = function(contact, oldManifold) {
        _.call(world.presolveListeners,contact,oldManifold);
    }




    world.onbegincontact = function(l) {
      world.beginContactListeners.push(l);
    }

    world.onpresolve = function(l) {
      world.presolveListeners.push(l);
    }

    world.onendcontact = function(l) {
      world.endContactListeners.push(l)
    }


    world.onpostsolve = function(l) {
      world.postsolveListeners.push(l)
    }


    world.SetContactListener(listener);
    return world;
  };

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
