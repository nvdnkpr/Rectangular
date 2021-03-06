angular.module('Rectangular')
  .service("ngrBox", function (ngrDefaults) {

    this.shape = function (options) {

      if (!_.isObject(options)) throw new Error("You must define options to create a shape.")

      var defaults = _.clone(ngrDefaults.body);

      options = _.extend(defaults, options);
      options = _.each(options, function (value, key) {
        if (!isNaN(Number(value))) options[key] = Number(value);
      })

      var s = new NgShape(options);

      return s;
    }

    function NgShape(options) {

      if (options.isShape) {
        return options;
      }

      this.options = options;
      this.isShape = true;

      this.getBodyDef = function () {

        var b = new b2BodyDef();

        b.position.Set(Number(this.options.x || 0), Number(this.options.y || 0));
        b.angle = Number(this.options.angle || 0);

        if (options.bullet) {
          b.linearDamping = 1;
        }

        b.gravityScale = options.gravityScale;

        switch (this.options.type) {
        case 'dynamic':
        case b2Body.b2_dynamicBody:
          b.type = b2Body.b2_dynamicBody;
          break;
        case 'static':
        case b2Body.b2_staticBody:
          b.type = b2Body.b2_staticBody;
          break;
        default:
          throw new Error("You must define a body type in your options", this.options);
          break;
        }

        return b;

      }

      this.getFixtureDef = function () {
        var f = new b2FixtureDef;

        if (options.effect) {
          
          options.radius = 0;
        }

        switch (options.shapeKind) {
        case 'box':
          f.shape = new b2PolygonShape();
          f.shape.SetAsBox(Number(options.width), Number(options.height));
          break;
        case 'circle':
          f.shape = new b2CircleShape();
          f.shape.SetRadius(Number(options.radius));
          break;
        case 'triangle':
          console.warn("Triangles are not supported.");
          break;
        default:
          throw new Error("You must defind a shapeKind in your options.");
          break;
        }



        f.density = Number(options.density || 0);
        f.friction = Number(options.friction || 0);
        f.restitution = Number(options.restitution || 0);

        if (options.bullet) {
          f.filter.groupIndex = -1;
        }

        if (options.collisionGroup) {
          f.filter.groupIndex = options.collisionGroup;
        }

        return f;
      }
    }

  })
