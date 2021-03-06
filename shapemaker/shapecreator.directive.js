angular.module('shapemaker')
  .directive('shapemaker', function () {
    return {
      restrict: 'AE',
      templateUrl: function (elem, atts) {
        return "shapemaker/tmpl/shapecreator.html";
      },
      scope: {

      },
      controller: function ($scope, $attrs, $element, ngrInterface, ngrEnvironment, ngrWorld, ngrState, shapemakerDefaults) {

        $scope.defaults = shapemakerDefaults.shapeDefaultParams;
        $scope.shapes = shapemakerDefaults.shapeOptions;
        $scope.skins = shapemakerDefaults.skins;
        $scope.presets = shapemakerDefaults.presets;
        $scope.preset = _.sample($scope.presets);
        $scope.params = {};

        $scope.$watchCollection('preset', function () {
          var pre = $scope.preset;
          if (!pre || !pre.shape) return;

          _.each(pre.presets, function (_pre, key) {
            $scope.params[key] = _pre;
          });

          $scope.params.userData = $scope.preset.userData || {};

          $scope.params.shape = _.find($scope.shapes, function (option) {
            return (pre.shape == option.type);
          });

          $scope.params.skin = _.find($scope.skins, function (_skin) {
            return (_skin.src === pre.skin.src);
          });

          $scope.params.shapeKind = $scope.params.shape.type;

          if (pre.skin) $scope.params.src = pre.skin.src;
        })

        $scope.newShape = function (input) {
          $scope.addShape();
        }

        $scope.$watch('params', function (x) {
          if (!$scope.params.shape) return;
          $scope.properties = $scope.defaults[$scope.params.shape.type].params.split(' ');
        }, true)


        $scope.addShape = function () {

          var preset = $scope.preset;

          if (preset.skin) _.extend($scope.params, preset.skin);
          if ($scope.params.customSrc) {
            $scope.params.src = $scope.$scope.params.customSrc;
          };
          $scope.params.profile = preset.profile;
          
          return ngrWorld.addElement(shapemakerDefaults.shape($scope.params));
        }

        Mousetrap.bind('q',function(){
          var q = $scope.addShape();
          q.freeze();
          var pos = ngrInterface.getMousePos();
          console.log("mouseinfo?",pos);
          q.SetPosition(new b2Vec2(pos.worldPosX, pos.worldPosY));
        })

        $scope.destroy = function () {
          $($element).hide();
        }
      }
    }
  })
