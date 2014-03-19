angular.module('Rectangular')
  .service('ngrState', function(ngrLoop) {

    var state;
    var st = this;
    var elements = [];
    var pins = []
    var focus = {x:0,y:0};
    var focusTo = {x:0,y:0};
    var focusOffset = {x:0,y:0};
    var zoomTo = 0.15;

    this.getJSON = function() {
      var r = {};
      r.properties = _.clone(state);
      r.properties.canvas = null;
      r.elements = elements;
      r.pins = pins;
      console.log("Attempting to stringify", r)
      var str = JSON.stringify(r);
      return str;
    }

    this.setFocusOffset = function(_off) {
      focusOffset = _off;
    }


    this.getRoom = function() {
      return state.room;
    }

    this.setRoom = function(_room) {
      state.room = _room;
    }

    this.updateRoom  = function(_room) {
       if (_room.width) st.setRoomWidth(Number(_room.width));
       if (_room.height) st.setRoomHeight(Number(_room.height));

       _.each(['floor','roof','leftWall','rightWall'],function(area){
          if (_room[area] == true) state.room[area] = true;
          if (_room[area] === false) state.room[area] = false;

       })
       
       

       console.log("Updating room...", state.room);
       //ngrState.setRoom(_room);

       //e.createRoom();
     }

    this.setRoomHeight = function(_h) {
      state.room.height = Number(_h);
    }

    this.setRoomWidth = function(_w) {
      state.room.width = Number(_w);
    }

    this.setZoom = function(_z, instant) {
       if (_z) zoomTo = _z;
       
       if (_z && instant) state.zoom = _z;
     }

     this.getZoom = function(focus) {
      if (focus) return zoomTo;
       return state.zoom;
     // return zoomTo;
     }

    this.setFocus = function(_f, _inst) {
      focusTo = {x:_f.x,y:_f.y};
      if (_inst)    focus = {x:_f.x,y:_f.y};
    }

    this.getFocus = function() {
      return {
        x:focus.x + focusOffset.x,
        y:focus.y + focusOffset.y
      };
    }

    this.setProperties = function(_properties) {
      state = _properties;
      zoomTo = state.zoom;
      window.state = state;
    }

    this.addPin = function(pinDef) {
      pins.push(pinDef);
    }

    ngrLoop.addPermanentHook(function updateFocus(){
     var incX = Math.abs(focusTo.x - focus.x) * 0.05;
      if (Math.abs(focusTo.x - focus.x) < incX * 2) {
        focus.x = focusTo.x;
      } else if (focusTo.x > focus.x) {
        focus.x+=incX;
      } else {
        focus.x-=incX;
      }

      var incY = Math.abs(focusTo.y - focus.y) * 0.05;

      if (Math.abs(focusTo.y - focus.y) < incY * 2) {

        focus.y = focusTo.y;

      } else  if (focusTo.y > focus.y) {
        focus.y+=incY;
      } else {
        focus.y-=incY;
      }

      state.focus = focus;

      var incZ = Math.abs(zoomTo - state.zoom) * 0.05;
      if (zoomTo > state.zoom) {
        state.zoom += incZ;
      } else {
        state.zoom -= incZ;
      }

    })

    this.removePin = function(pinId) {
      pins = _.map(pins,function(_pin){
        if (_pin.pinId != pinId) return _pin;
      })
      pins = _.compact(pins);
    }

    this.addElement = function(elementDef) {
      elements.push(elementDef)
    }

    this.clearElements = function() {
      elements = [];
      pins = [];
    }

    this.removeElement = function(body) {

      var elId = body.id;

      elements = _.map(elements,function(_el){
        if (_el.id != elId) return _el;
      });

      elements = _.compact(elements);
    }

    this.getScale = function() {
      return state.SCALE;
    }

    this.setScale = function(scale) {
      state.SCALE = scale;
      return state;
    }

    this.getProperties = function() {
      if (!state) {
        throw new Error("Attempting to access undefined properties.")
      }
      return state;
    };

    this.getState = this.getProperties;
  })
