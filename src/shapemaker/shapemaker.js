 angular.module("BallAgentApp", ['ngAudio', 'Rectangular'])
   .controller('myDemoCtrl', function($scope, $element, ngrWorld, ngrInterface,  ngrEnvironment, ngrState, ngAudio, $compile) {

     ngrEnvironment.init({
      // scale: 15,
       scale: 'auto',
       worldHeight: 20
     });

     $scope.newMaker = function() {
       var el = angular.element("<shapemaker></shapemaker>");
       var cmpl = $compile(el);
       $element.find('makers').append(el);
       cmpl($scope);
     }

     $scope.clearAll = function() {
       ngrEnvironment.clearAll();
       ngrEnvironment.floor();
     };

     var targeter = new MouseTargeter($('canvas')[0], ngrState.getScale());
     var mouseJointBody;
     targeter.onmove (function(r) {
      $scope.r = r;
      $scope.$apply();
      if (mouseJointBody) mouseJointBody.SetTarget(new b2Vec2(r.worldPosX,r.worldPosY))

     })
     targeter.onclick(function(r) {
       body = ngrInterface.getBodyAtMouse(r);
       var state = ngrState.getState();



       if (body) {
         var m_world = ngrWorld.getWorld();
         var mouseX = r.mousePosX;
         var mouseY = r.mousePosY;
         var mouse_joint = new b2MouseJointDef();
         if (mouseJointBody) m_world.DestroyJoint(mouseJointBody);
        
         mouse_joint.bodyA = ngrWorld.getWorld().GetGroundBody();
         mouse_joint.bodyB = body;
         mouse_joint.target.Set(r.worldPosX, r.worldPosY);
         mouse_joint.collideConnected = true;

         mouse_joint.maxForce = 100000;
         mouseJointBody = m_world.CreateJoint(mouse_joint);

         $(document).mouseup(function(e) {
           m_world.DestroyJoint(mouseJointBody);
           mouseJointBody = null;
         })
       }

     })


   })
   .directive('shapemaker', function() {
     return {
       restrict: 'AE',
       templateUrl: function(elem, atts) {
         return "shapemaker/creator.html";
       },
       scope: {

       },
       controller: function($scope, $attrs, $element, ngrEnvironment, ngrState) {

         $scope.q = {};
         var q = $scope.q;
         q.height = 1;
         q.width = 1;
         q.radius = 0.5;
         q.restitution = 0.3;
         q.density = 0.5;
         q.friction = 0.5;
         q.linearDamping = 0.5;
         q.angle = 0;
         q.shape = $attrs.shape || 'circle';

         $scope.defaults = {
           box: 'height width restitution density friction gravityScale linearDamping angle',
           circle: 'radius restitution density friction gravityScale linearDamping angle'
         }
         switch ($attrs.shape) {
           case 'circle':
             $scope.properties = $scope.defaults.circle.split(' ');
             break;
           case 'box':
             $scope.properties = $scope.defaults.box.split(' ');
             break;
         }

         $scope.newShape = function(input) {
           $scope.addShape($attrs.shape);
         }


         $scope.$watchCollection('q', function() {
           $scope.properties = $scope.defaults[$scope.q.shape].split(' ');
         })

         $scope.options = [{
             name: 'Circle',
             type: 'circle'
           }, {
             name: 'Rectangle',
             type: 'box'
           }

         ]

         $scope.addShape = function(shape) {

           switch (q.shape) {
             case 'box':
               $scope.addBox();
               break;
             case 'circle':
               $scope.addCircle();
               break;
             default:
               console.error("Unavailable shape,", shape);
               break;
           }
         }

         $scope.addBox = function() {
           ngrEnvironment.add('box', {
             x: Math.random() * 40 / ngrState.getScale() * 20,
             height: q.height / 2,
             width: q.width / 2,
             restitution: q.restitution,
             density: q.density,
             gravityScale: q.gravityScale,
             friction: q.friction,
             angle: q.angle,
           });
         }

         $scope.destroy = function() {
           $($element).hide();
         }

         $scope.addCircle = function() {
           ngrEnvironment.add('circle', {
             x: Math.random() * 40 / ngrState.getScale() * 20,
             radius: q.radius,
             restitution: q.restitution,
             density: q.density,
           });
         }

         setTimeout(function() {

           var dropdown = $element.find('select');
           var ddl = dropdown[0];
           var opts = ddl.options.length;
           for (var i = 0; i < opts; i++) {
             if (ddl.options[i].value == q.shape) {
               ddl.selectedIndex = i;
               break;
             }
           }
         }, 1)
       }
     }
   })
   .directive('worldcontroller', function() {
     return {
       restrict: 'AE',
       templateUrl: function(elem, atts) {
         return "shapemaker/worldcontroller.html";
       },
       controller: function($scope, $attrs, $element, ngrEnvironment) {

         $scope.q = {};
         var q = $scope.q;
         q.scale = 2;
         q.gravity = 30;
         q.speed = 60;

         $scope.properties = "gravity speed".split(' ')

         $scope.$watchCollection('q', function() {
           ngrEnvironment.setGravity(q.gravity);
           ngrEnvironment.setWorldSpeed(q.speed);
         })


       }
     }
   })
   .directive('slider', function() {
     return {
       restrict: 'AE',
       link: function($scope, elem, attr) {
         $scope.atts = attr;

         $scope.min = 0;
         $scope.max = 10;
         var t = attr.type;

         switch (t) {
           case 'restitution':
           case 'friction':
           case 'angularDamping':
           case 'linearDamping':
             $scope.max = 1;
             break;
           case 'angle':
             $scope.max = 6.28;
             break;
           case 'gravity':
             $scope.max = 100;
             $scope.min = -100;
             break;
           case 'speed':
             $scope.max = 100;
             $scope.min = 0.01;
             break;
           case 'scale':
             $scope.max = 30;
             $scope.min = 2;
           case 'focusX':
           case 'focusY':
             $scope.max = 1000;
             $scope.min = -1000;
             break;

         }
       },
       templateUrl: function(elem, atts) {
         return "shapemaker/slider.html";
       },
     }
   })
