angular.module("Stones", ['Rectangular'])
  .controller("GameOfStones", function ($scope, ngrEnvironment, ngrWorld, StonesModels, ngrLoop, ngrInterface, stonesLevels) {
    console.log("A Game of Stones");
    ngrEnvironment.init({
      canvas: $('canvas'),
      constrainFocusToRoom: false
    });
    ngrEnvironment.load(stonesLevels.getLevel(1));
    ngrEnvironment.debug(false);
    ngrEnvironment.setZoom(0.2);
    ngrInterface.enableDrag();
    ngrInterface.setGrabOnly("doodad");
    ngrInterface.scrollToZoom(true);
    ngrEnvironment.constrainFocus({
      x: 40,
      y: 5,
      width: 50,
      height: 20
    })

    ngrEnvironment.constrainZoom({
      min: 0.1,
      max: 2
    })

    $scope.loadLevel = function (lvl) {
      ngrEnvironment.clearAll();
      ngrEnvironment.load(stonesLevels.getLevel(lvl));
    }

    $scope.startLevel = function () {
      var starter = ngrEnvironment.getBodyByUserData('worldStarter', 'true');
      ngrEnvironment.remove(starter);
      ngrEnvironment.start();
      var base = ngrEnvironment.getBodiesByUserData('base', 'true');
      var prize = ngrEnvironment.getBodyByUserData('prize', 'true');
      var doodads = ngrEnvironment.getBodiesByUserData('doodad', 'true');

      _.each(base, function (comp) {
        comp.SetType(b2Body.b2_dynamicBody);
      })

      _.each(doodads, function (doodad) {
        //doodad.SetType(b2Body.b2_staticBody);
        ngrWorld.freeze(doodad);
      })

      prize.SetType(b2Body.b2_dynamicBody);

      var prizeStartingY = prize.GetPosition().y;

      ngrLoop.addHook(function () {
        var pos = prize.GetPosition();
        if (pos.y - prizeStartingY > 5) {
          $scope.endLevel(true);
        }
      })

    }

    $scope.endLevel = function (success) {
      if (success) {
        console.log("huzzah!");
        setTimeout(function () {
          ngrEnvironment.blocker()
            .then(function () {
              ngrEnvironment.stop();
            })
        }, 3000);
      };
    }

    $scope.add = function (type) {
      var params;
      switch (type) {
      case "box":
        params = StonesModels.box;
        break;
      case "blue-box":
        params = StonesModels.blueBox;
        break;
      case "green-box":
        params = StonesModels.greenBox;
        break;
      case "girder":
        params = StonesModels.girder;
        break;
      case "wedge":
        params = StonesModels.wedge;
        break;
      }

      ngrEnvironment.add(null, params);
    }

  })
  .service('StonesModels', function () {
    this.box = {
      shapeKind: 'box',
      width: 2,
      height: 2,
      density: 0.5,
      userData: {
        doodad: "true"
      },
      friction: 0.2,
      src: 'img/box.png',
      x: 3,
      y: 3
    }

    this.blueBox = {
      shapeKind: 'box',
      width: 2,
      height: 1,
      density: 0.5,
      restitution: 0.8,
      userData: {
        doodad: "true"
      },
      friction: 0.2,
      src: 'img/box-blue.png',
      x: 3,
      y: 3
    }

    this.greenBox = {
      shapeKind: 'box',
      width: 2,
      height: 1,
      density: 0.5,
      restitution: 0.2,
      friction: 0,
      userData: {
        doodad: "true"
      },
      friction: 0.2,
      src: 'img/box-green.png',
      x: 3,
      y: 3
    }

    this.girder = {
      shapeKind: 'box',
      width: 5,
      height: 0.75,
      userData: {
        doodad: "true"
      },
      density: 3,
      friction: 0.2,
      src: 'img/castleCenter.png',
      x: 3,
      y: 3
    }

    this.wedge = {
      shapeKind: 'triangle',
      innerAngle: 90,
      opposite: 4,
      userData: {
        doodad: "true"
      },
      adjacent: 12,
      bg: 'tiled',
      src: 'img/snowCenter.png',
      density: 3,
      friction: 0.6,
      src: 'img/castleCenter.png',
      x: 3,
      y: 3
    }

  })
