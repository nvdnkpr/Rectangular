 angular.module("BallAgentApp", ['ngAudio', 'Rectangular'])
   .controller('myDemoCtrl', function($scope, $element, ngrWorld, ngrInterface, ngrEnvironment, ngrState, ngAudio, $compile) {

     ngrEnvironment.init({
       // scale: 15,
       scale: 'auto',
       worldHeight: 40
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

     ngrInterface.enableDrag();
     var contextMenu;
     ngrInterface.onmove(function(r){
      $scope.r = r;
      $scope.$apply();

     })

     $scope.deleteContextItem = function() {
       console.log("Deleting", $scope.contextBody);
       ngrEnvironment.remove($scope.contextBody);
       hideContextMenu();
     }

     $scope.freezeContextItem = function() {
       var cti = $scope.contextBody;
       cti.SetType(b2Body.b2_staticBody);
       hideContextMenu();
     }

     function hideContextMenu() {
       if (contextMenu) {
         setTimeout(function() {
           $(contextMenu).hide();
           contextmenu = null;
         }, 10)
       }
     }

     var contextMenu;

     $(document).bind("contextmenu", function(event) {
       event.preventDefault();
       if (ngrInterface.getBodyAtMouse()) {
         if (contextMenu) $(contextMenu).hide();
         contextMenu = angular.element("<div customcontextmenu></div>");
         var cmpl = $compile(contextMenu);
         $('body').append(contextMenu);
         //    ('makers').append(el);
         $scope.contextBody = ngrInterface.getBodyAtMouse();
         cmpl($scope);

         //contextMenu = $("<div class='custom-menu'>Custom menu</div>");
         $(contextMenu)
           .css({
             top: event.pageY + "px",
             left: event.pageX + "px"
           });

         $(document).bind("mousedown", function(event) {
           //  event.preventDefault();
           // console.log("hiding menu",event);
           if (event.target.tagName == "LI") return true; 
           if (contextMenu) {
            setTimeout(function(){
           $(contextMenu).hide();
           },10)
           }
           //return true;

         })
       }
     });
   })
   .directive('customcontextmenu', function() {
     return {
       restrict: 'A',
       replace: false,
       templateUrl: function(elem, atts) {
         return "shapemaker/contextmenu.html";
       },
       link: function() {
         //     console.log("hey context menue!");
       },
       controller: function($scope) {
         // console.log("Context controller...", $scope);

       }
     }
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
