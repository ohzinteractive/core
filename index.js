// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"INHd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ArrayUtilities = /*#__PURE__*/function () {
  function ArrayUtilities() {
    _classCallCheck(this, ArrayUtilities);
  }

  _createClass(ArrayUtilities, null, [{
    key: "merge_from_to",
    value: function merge_from_to(source, target) {
      target.push.apply(target, source);
    }
  }, {
    key: "expand_vec3_array",
    value: function expand_vec3_array(array, size) {
      var items_left_count = size - array.length;

      for (var i = 0; i < items_left_count; i++) {
        array.push(array[i].clone());
      }
    }
  }, {
    key: "remove_elem",
    value: function remove_elem(array, elem) {
      var index = array.indexOf(elem);

      if (index > -1) {
        array.splice(index, 1);
      }
    }
  }, {
    key: "get_closest_point",
    value: function get_closest_point(points, target) {
      var closest_point = points[0];
      var closest_distance = closest_point.distanceTo(target);

      for (var i = 1; i < points.length; i++) {
        if (points[i].distanceTo(target) < closest_distance) {
          closest_point = points[i];
          closest_distance = points[i].distanceTo(target);
        }
      }

      return closest_point;
    }
  }, {
    key: "object_values_to_array",
    value: function object_values_to_array(obj) {
      var ids = Object.keys(obj);
      var arr = [];

      for (var i = 0; i < ids.length; i++) {
        arr.push(obj[ids[i]]);
      }

      return arr;
    }
  }]);

  return ArrayUtilities;
}();

exports.default = ArrayUtilities;
},{}],"v0GF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BaseApplication = /*#__PURE__*/function () {
  function BaseApplication() {
    _classCallCheck(this, BaseApplication);
  }

  _createClass(BaseApplication, [{
    key: "start",
    value: function start() {}
  }, {
    key: "post_start",
    value: function post_start() {}
  }, {
    key: "end",
    value: function end() {}
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "on_post_render",
    value: function on_post_render() {}
  }, {
    key: "on_pre_render",
    value: function on_pre_render() {}
  }, {
    key: "resources_fully_loaded",
    value: function resources_fully_loaded() {}
  }]);

  return BaseApplication;
}();

exports.default = BaseApplication;
},{}],"QfnR":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\n\nvoid main()\n{\n  vec3 pos = position;\n  mat4 MVP = projectionMatrix * modelViewMatrix;\n\n  gl_Position = MVP * vec4( pos, 1.0 );\n  vUv = uv;\n}";
},{}],"LSxb":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform vec3 _Color;\n\nvoid main()\n{\n    gl_FragColor = vec4(_Color, 1.0);\n}";
},{}],"Ej2H":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basic_color_vert = _interopRequireDefault(require("/shaders/basic_color/basic_color_vert"));

var _basic_color_frag = _interopRequireDefault(require("/shaders/basic_color/basic_color_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BaseShaderMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {
  _inherits(BaseShaderMaterial, _THREE$ShaderMaterial);

  var _super = _createSuper(BaseShaderMaterial);

  function BaseShaderMaterial(vert, frag, uniforms) {
    _classCallCheck(this, BaseShaderMaterial);

    return _super.call(this, {
      vertexShader: vert || _basic_color_vert.default,
      fragmentShader: frag || _basic_color_frag.default,
      uniforms: uniforms || {
        _Color: {
          value: new THREE.Color("#FF0000")
        }
      }
    });
  }

  return BaseShaderMaterial;
}(THREE.ShaderMaterial);

exports.default = BaseShaderMaterial;
},{"/shaders/basic_color/basic_color_vert":"QfnR","/shaders/basic_color/basic_color_frag":"LSxb"}],"XMgG":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CameraManager = /*#__PURE__*/function () {
  function CameraManager() {
    _classCallCheck(this, CameraManager);

    this._current = undefined;
  }

  _createClass(CameraManager, [{
    key: "current",
    set: function set(camera) {
      this._current = camera;
    },
    get: function get() {
      return this._current;
    }
  }]);

  return CameraManager;
}();

var camera_manager = new CameraManager();
module.exports = camera_manager;
},{}],"JIgx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Screen = /*#__PURE__*/function () {
  function Screen() {
    _classCallCheck(this, Screen);

    this.width = 1;
    this.height = 1;
    this.render_width = 1;
    this.render_height = 1;
    this.width_height = new THREE.Vector2(this.width, this.height);
    this.dpr = 1;
    this.pixel_size = new THREE.Vector2(1 / this.width, 1 / this.height);
  }

  _createClass(Screen, [{
    key: "update_size",
    value: function update_size(width, height) {
      this.width = width;
      this.height = height;
      this.pixel_size = new THREE.Vector2(1 / this.width, 1 / this.height);
      this.width_height.x = width;
      this.width_height.y = height;
      this.render_width = width * this.dpr;
      this.render_height = height * this.dpr;
    }
  }, {
    key: "apply_pixel_density_v2",
    value: function apply_pixel_density_v2(vector2) {
      vector2.multiplyScalar(1 / this.dpr);
      return vector2;
    }
  }, {
    key: "apply_pixel_density",
    value: function apply_pixel_density(value) {
      return value * (1 / this.dpr);
    }
  }, {
    key: "get_pixel_size",
    value: function get_pixel_size() {
      return this.pixel_size;
    }
  }, {
    key: "aspect_ratio",
    get: function get() {
      return this.width / this.height;
    }
  }]);

  return Screen;
}();

var _default = new Screen();

exports.default = _default;
},{}],"RyjO":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*

  A configuration class used as a singleton

*/
var Configuration = /*#__PURE__*/function () {
  function Configuration() {
    var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Configuration);

    this.dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
    this.is_mobile = false;
    this.is_ios = false;
    this.is_ipad = false;
    this.vertex_image_unit_supported = true;
    this.min_zoom_distance = 3000;
    this.max_zoom_distance = 40000;
    this.max_zoom_distance_scale = 1.1;
    this.zoom_speed = 0.1;
    this.use_fxaa = false;
    this.use_ssaa = true;
    this.background_color = new THREE.Color(0.768, 0.768, 0.768); //TOUCH

    this.touch_sensitivity = 1.5;
    this.zoom_sensitivity = 0.7;
    this.spin_sensitivity = 2;
    this.three_finger_rotation_speed = 3;
    this.three_finger_allowed_x_rotation_offset = 30;
    this.three_finger_allowed_y_rotation_offset = 20;
    this.use_touch_gestures = false;
    this.texture_float_supported = false;
    this.use_ortographic = true;
    this.hover_enabled = false;
    this.rotation_enabled = false;
    this.transparency_amount = 0.2;
    this.show_debug_sphere_on_floor_selection = false;
    this.show_debug_sphere_on_steps_in_floor = false;
    this.display_cleanup_log = false;
    this.navigation_speed_damping = 0.74;
    this.navigation_speed = 200;
    this.out_of_bounds_force = 1.5;
    this.mouse_zoom_speed = 0.05;
    this.touch_zoom_speed = 0.5;
  }

  _createClass(Configuration, [{
    key: "from_json",
    value: function from_json(json) {}
  }]);

  return Configuration;
}();

var configuration = new Configuration();
module.exports = configuration;
},{}],"wewU":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Time = /*#__PURE__*/function () {
  function Time() {
    _classCallCheck(this, Time);

    this.___time = new THREE.Clock();
    this.__delta_time = 0;
    this.__elapsed_time = 0;
    this.__allocated_time = new THREE.Vector2(0, 0);
  }

  _createClass(Time, [{
    key: "__update",
    value: function __update() {
      this.__delta_time = this.___time.getDelta();
      this.__elapsed_time = this.___time.getElapsedTime();
    }
  }, {
    key: "delta_time",
    get: function get() {
      return this.__delta_time < 0.4 ? this.__delta_time : 0.016;
    }
  }, {
    key: "elapsed_time",
    get: function get() {
      return this.__elapsed_time;
    }
  }, {
    key: "shader_time",
    get: function get() {
      this.__allocated_time.x = this.delta_time;
      this.__allocated_time.y = this.elapsed_time;
      return this.__allocated_time;
    }
  }]);

  return Time;
}();

var time = new Time();
module.exports = time;
},{}],"Oo8n":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyboardInput = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var KeyboardInput = /*#__PURE__*/function () {
  function KeyboardInput() {
    _classCallCheck(this, KeyboardInput);

    this.ctrlz_pressed = false;
    this.ctrlz_fired = false;
    this.keys = [];
  }

  _createClass(KeyboardInput, [{
    key: "init",
    value: function init() {
      document.onkeydown = this.on_key_down.bind(this);
      document.onkeyup = this.on_key_up.bind(this);
      document.onkeypress = this.on_key_press.bind(this);
    }
  }, {
    key: "on_key_down",
    value: function on_key_down(e) {
      if (e.keyCode == 90 && e.ctrlKey && !this.ctrlz_fired) {
        this.ctrlz_pressed = true;
        this.ctrlz_fired = true;
      }

      if (e.key) {
        this.press_key(e.key);
      }
    }
  }, {
    key: "on_key_press",
    value: function on_key_press(e) {}
  }, {
    key: "on_key_up",
    value: function on_key_up(e) {
      this.release_keys();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctrlz_pressed = false;

      for (var i = 0; i < this.keys.length; i++) {
        this.keys[i].pressed = false;
      }
    }
  }, {
    key: "release_keys",
    value: function release_keys() {
      this.ctrlz_fired = false;

      for (var i = 0; i < this.keys.length; i++) {
        this.keys[i].fired = false;
        this.keys[i].down = false;
      }
    }
  }, {
    key: "press_key",
    value: function press_key(key) {
      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].key_name === key && !this.keys[i].fired) {
          this.keys[i].pressed = true;
          this.keys[i].down = true;
          this.keys[i].fired = true;
        }
      }
    }
  }, {
    key: "key_is_pressed",
    value: function key_is_pressed(key) {
      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].key_name === key) {
          return this.keys[i].pressed;
        }
      }

      return false;
    }
  }, {
    key: "key_is_down",
    value: function key_is_down(key) {
      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].key_name === key) {
          return this.keys[i].down;
        }
      }

      return false;
    }
  }, {
    key: "register_key",
    value: function register_key(key) {
      this.keys.push({
        key_name: key,
        pressed: false,
        down: false,
        up: false,
        fired: false
      });
    }
  }, {
    key: "unregister_key",
    value: function unregister_key(key_name) {
      var key = undefined;

      for (var i = 0; i < this.keys.length; i++) {
        if (this.keys[i].key_name === key_name) key = this.keys[i];
      }

      var index = this.keys.indexOf(key);

      if (index > -1) {
        this.keys.splice(index, 1);
      }
    }
  }]);

  return KeyboardInput;
}();

exports.KeyboardInput = KeyboardInput;
var keyboard_input = new KeyboardInput();
module.exports = keyboard_input;
},{}],"k3P6":[function(require,module,exports) {
"use strict";

var _Screen = _interopRequireDefault(require("/Screen"));

var _Configuration = _interopRequireDefault(require("/Configuration"));

var _Time = _interopRequireDefault(require("/Time"));

var _KeyboardInput = _interopRequireDefault(require("/KeyboardInput"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Input = /*#__PURE__*/function () {
  function Input() {
    _classCallCheck(this, Input);

    this.mouse_pos = new THREE.Vector2();
    this.last_mouse_pos = new THREE.Vector2();
    this.mouse_dir = new THREE.Vector2();
    this.__clicked_time = 0;
    this.__elapsed_time = 0;
    this.__delta_time = 0;
    this.is_mouse_down = false;
    this.is_mouse_up = false;
    this.rotation_angle = 0;
    this._normalized_mouse_pos = new THREE.Vector2(0, 0);
    this.left_mouse_button_down = false;
    this.left_mouse_button_pressed = false;
    this.left_mouse_button_released = false;
    this.middle_mouse_button_down = false;
    this.right_mouse_button_down = false;
    this.right_mouse_button_pressed = false;
    this.right_mouse_button_released = false;
    this.mousewheel = 0;
    this.previous_scale = 0;
    this.previous_rotation = 0;
    this.previous_rotation_dirty = true;
    this.mouse_str = "mouse";
    this.tmp_mouse_velocity = new THREE.Vector2();
    this.bounding_client = new THREE.Vector2();
    this.multitouch_active = false;
    this.tapped = false;
    this.initial_zoom_distance = 100;
    this.zoom_center = new THREE.Vector2();
    this.zoom_started = false;
    this.touch_zoom = 1;
    this.multi_touch_dir = new THREE.Vector2();
    this.wheel_delta = 0;
    this.mac = 'mac';
    this.pinching_with_trackpad = false;
    this.scrolling_with_trackpad = false;
    this.scrolling_with_mouse = false;
    this.double_click = false;
    this.canvas = undefined; // Input 2.0

    this.previous_pos_x = 0;
    this.previous_pos_y = 0;
  }

  _createClass(Input, [{
    key: "mouse_is_within_bounds",
    value: function mouse_is_within_bounds(rect) {
      rect = rect || this.canvas.getBoundingClientRect();
      return this.mouse_pos.x > rect.left && this.mouse_pos.x < rect.left + rect.width && this.mouse_pos.y > rect.top && this.mouse_pos.y < rect.top + rect.height;
    }
  }, {
    key: "init",
    value: function init(container, canvas) {
      var _this = this;

      this.canvas = canvas;
      var region = new ZingTouch.Region(container, false, false);

      _KeyboardInput.default.init();

      var scope = this;
      region.bind(container, 'tap', function (e) {
        scope.tapped = true;
        scope.set_mouse_pos(e);
      });
      window.addEventListener('dblclick', this.on_double_click.bind(this));
      container.addEventListener('mouseleave', this.on_focus_lost.bind(this));
      container.addEventListener('mouseup', this.on_mouse_up.bind(this));
      container.addEventListener('mousemove', this.on_mouse_move.bind(this));
      container.addEventListener('touchmove', this.on_touch_move.bind(this), false);
      container.addEventListener('touchend', this.on_touch_end.bind(this), false); // region.bind(container, 'pan', function(e){
      // 	scope.on_mouse_move(e);
      // 	console.log("PAN");
      // });

      var one_finger_pan = new ZingTouch.Pan({
        numInputs: 1
      });
      region.register("one_finger_pan", one_finger_pan);
      region.bind(container, "one_finger_pan", function (event) {
        if (event.detail.data.length > 0) {// scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
          // scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
          // scope.on_mouse_move_zingtouch(event);
        }
      });
      var two_fingers_pan = new ZingTouch.Pan({
        numInputs: 2
      });
      region.register("two_fingers_pan", two_fingers_pan);
      region.bind(container, "two_fingers_pan", function (event) {
        if (event.detail.data.length > 0) {
          // scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y)
          // scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
          scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y);
          scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
        }
      });
      var three_fingers_pan = new ZingTouch.Pan({
        numInputs: 3
      });
      region.register("three_fingers_pan", three_fingers_pan);
      region.bind(container, "three_fingers_pan", function (event) {
        if (event.detail.data.length > 0) {
          scope.multi_touch_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y);
          scope.multi_touch_dir.multiplyScalar(scope.__delta_time);
        }
      });
      region.bind(container, 'distance', function (e) {
        if (!scope.zoom_started) {
          scope.zoom_started = true;
          scope.touch_zoom_delta = 0;
          scope.initial_zoom_distance = e.detail.distance;
          scope.last_zoom_distance = e.detail.distance;
          scope.zoom_center.set(e.detail.center.x, e.detail.center.y);
          scope.mouse_pos.set(e.detail.center.x, e.detail.center.y);
        }

        scope.touch_zoom_delta = e.detail.distance - scope.last_zoom_distance;
        scope.last_zoom_distance = e.detail.distance;
        scope.touch_zoom = 1;
      }, false);
      var gesture = new ZingTouch.Gesture();

      gesture.end = function (inputs, state, element) {
        scope.on_gesture_end(inputs);
      };

      gesture.start = function (inputs, state, element) {
        scope.on_mouse_down(inputs);
      };

      region.register('shortTap', gesture);
      region.bind(container, 'shortTap', function (e) {});
      window.addEventListener('wheel', this.on_mouse_wheel.bind(this));
      container.addEventListener('contextmenu', function (event) {
        event.preventDefault();
      }, false);
      container.addEventListener("mousemove", function (event) {
        _this.mouse_pos.x = event.clientX;
        _this.mouse_pos.y = event.clientY;
        _this.scrolling_with_mouse = false;
        _this.scrolling_with_trackpad = false;
        _this.pinching_with_trackpad = false;
      });
    }
  }, {
    key: "set_mouse_pos",
    value: function set_mouse_pos(ev) {
      this.mouse_pos.x = ev.detail.events[0].clientX;
      this.mouse_pos.y = ev.detail.events[0].clientY;
    }
  }, {
    key: "is_mac",
    value: function is_mac() {
      return this.get_os() === this.mac;
    }
  }, {
    key: "on_double_click",
    value: function on_double_click(event) {
      this.double_click = true;
    }
  }, {
    key: "on_mouse_wheel",
    value: function on_mouse_wheel(event) {
      this.mouse_pos.x = event.clientX;
      this.mouse_pos.y = event.clientY; // User is using a mac

      if (this.is_mac()) {
        // User is pinching
        if (event.ctrlKey) {
          // Negative values means pinch in.
          // Positive values means pinch out.
          console.log("Pinching with a touchpad", event.deltaY);
          this.pinching_with_trackpad = true;
          this.scrolling_with_trackpad = false;
          this.scrolling_with_mouse = false; // User is scrolling
        } else {
          // User is using the touchpad
          if (this.is_int(event.deltaY)) {
            // Negative values means scroll up
            // Positive values means scroll down
            // console.log("Scrolling with a touchpad", (event.deltaY))
            // 350 is aprox the maximum value of deltaY on touchpad scroll
            this.pinching_with_trackpad = false;
            this.scrolling_with_trackpad = true;
            this.scrolling_with_mouse = false;
            this.wheel_delta = THREE.Math.clamp(event.deltaY / 350, -1, 1) * -1;
          } else {
            // Negative values means scroll up
            // Positive values means scroll down
            // console.log("Scrolling with a mouse", event.deltaY)
            this.pinching_with_trackpad = false;
            this.scrolling_with_trackpad = false;
            this.scrolling_with_mouse = true;
            this.wheel_delta = event.deltaY / Math.abs(event.deltaY);
          }
        }
      } else {
        //probably windows
        this.pinching_with_trackpad = false;
        this.scrolling_with_trackpad = false;
        this.scrolling_with_mouse = true;
        if (Math.abs(event.deltaY) < 0.0001) this.wheel_delta = 0;else this.wheel_delta = event.deltaY / Math.abs(event.deltaY);
      }
    }
  }, {
    key: "on_mouse_down",
    value: function on_mouse_down(inputs) {
      this.mouse_pos.x = inputs[0].current.clientX;
      this.mouse_pos.y = inputs[0].current.clientY;
      this.multitouch_active = inputs.length > 1;
      this.mouse_dir.x = 0;
      this.mouse_dir.y = 0;
      this.__clicked_time = this.__elapsed_time;
      this.is_mouse_down = true;
      this.is_mouse_up = false;

      switch (inputs[0].current.originalEvent.which) {
        case 1:
          this.left_mouse_button_down = true;
          this.left_mouse_button_pressed = true;
          break;

        case 2:
          this.middle_mouse_button_down = true;
          break;

        case 3:
          this.right_mouse_button_down = true;
          this.right_mouse_button_pressed = true;
          break;

        default:
          this.left_mouse_button_down = true;
          this.left_mouse_button_pressed = true;
          break;
      }

      this.wheel_delta = 0;
      this.previous_scale = 0;
      this.previous_rotation = 0;
    }
  }, {
    key: "mouse_clicked",
    value: function mouse_clicked() {
      return this.tapped;
    }
  }, {
    key: "on_touch_move",
    value: function on_touch_move(e) {
      this.on_mouse_move({
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY
      });
    }
  }, {
    key: "on_touch_end",
    value: function on_touch_end(e) {
      this.on_gesture_end([{
        current: {
          originalEvent: e
        }
      }]);
    }
  }, {
    key: "on_mouse_up",
    value: function on_mouse_up(e) {
      this.on_gesture_end([{
        current: {
          originalEvent: e
        }
      }]);
    }
  }, {
    key: "on_gesture_end",
    value: function on_gesture_end(inputs) {
      this.multitouch_active = inputs ? inputs.length > 1 : false;
      this.is_mouse_up = true;
      this.zoom_started = false;
      this.touch_zoom = 1;
      this.mouse_dir.x = 0;
      this.mouse_dir.y = 0;
      this.previous_scale = 0;
      this.previous_rotation = 0;
      this.wheel_delta = 0;
      this.left_mouse_button_down = false;
      this.middle_mouse_button_down = false;
      this.right_mouse_button_down = false;

      if (inputs) {
        switch (inputs[0].current.originalEvent.which) {
          case 1:
            this.left_mouse_button_released = true;
            break;

          case 2:
            this.middle_mouse_button_released = true;
            break;

          case 3:
            this.right_mouse_button_released = true;
            break;

          default:
            this.left_mouse_button_released = true;
            break;
        }
      }

      this.is_mouse_down = false;
      this.previous_rotation_dirty = true;
      this.rotation_delta = 0;
    }
  }, {
    key: "on_focus_lost",
    value: function on_focus_lost() {
      this.on_gesture_end();
      this.left_mouse_button_released = true;
      this.middle_mouse_button_released = true;
      this.right_mouse_button_released = true;
      this.left_mouse_button_released = true;
    }
  }, {
    key: "time_since_last_mouse_down",
    value: function time_since_last_mouse_down() {
      return this.__elapsed_time - this.__clicked_time;
    }
  }, {
    key: "on_mouse_move",
    value: function on_mouse_move(event) {
      this.mouse_pos.x = event.clientX;
      this.mouse_pos.y = event.clientY;
      this.mouse_dir.set(this.mouse_pos.x - this.previous_pos_x, this.mouse_pos.x - this.previous_pos_y);
      this.mouse_dir.normalize();
      this.previous_pos_x = this.mouse_pos.x;
      this.previous_pos_y = this.mouse_pos.x;
    }
  }, {
    key: "on_mouse_move_zingtouch",
    value: function on_mouse_move_zingtouch(event) {
      if (event.detail.data.length > 0) {
        this.set_mouse_pos(event);
        this.mouse_dir.set(event.detail.data[0].change.x, event.detail.data[0].change.y); // this.mouse_dir.x *=  Screen.height / Screen.width;
        // this.mouse_dir.multiplyScalar(this.__delta_time/window.devicePixelRatio);
      }
    }
  }, {
    key: "get_os",
    value: function get_os() {
      var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'mac';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'ios';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'windows';
      } else if (/Android/.test(userAgent)) {
        os = 'android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'linux';
      }

      return os;
    }
  }, {
    key: "is_int",
    value: function is_int(n) {
      return n % 1 === 0;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.__elapsed_time = _Time.default.elapsed_time;
      this.__delta_time = _Time.default.delta_time;
      this.is_mouse_up = false;
      this.wheel_delta = 0;
      this.rotation_delta = 0;
      this.double_click = false;
      this.tapped = false;
      this.mouse_dir.multiplyScalar(0);
      this.multi_touch_dir.multiplyScalar(0);
      this.left_mouse_button_pressed = false;
      this.left_mouse_button_released = false;
      this.right_mouse_button_pressed = false;
      this.right_mouse_button_released = false;

      _KeyboardInput.default.clear();
    }
  }, {
    key: "normalized_mouse_pos",
    get: function get() {
      this._normalized_mouse_pos.x = this.mouse_pos.x / _Screen.default.width * 2.0 - 1;
      this._normalized_mouse_pos.y = -1 * (this.mouse_pos.y / _Screen.default.height * 2.0 - 1);
      return this._normalized_mouse_pos;
    }
  }, {
    key: "NDC",
    get: function get() {
      return this.normalized_mouse_pos;
    }
  }]);

  return Input;
}();

var INPUT = new Input();
module.exports = INPUT;
},{"/Screen":"JIgx","/Configuration":"RyjO","/Time":"wewU","/KeyboardInput":"Oo8n"}],"sPjl":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Sphere = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(Sphere, _THREE$Mesh);

  var _super = _createSuper(Sphere);

  function Sphere(radius, color) {
    _classCallCheck(this, Sphere);

    color = color || "#FF0000";
    radius = radius || 1;
    var geometry = new THREE.SphereBufferGeometry(radius, 64, 64);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    return _super.call(this, geometry, material);
  }

  return Sphere;
}(THREE.Mesh);

exports.default = Sphere;
},{}],"iaBK":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvoid main()\n{\n  vec3 pos = position;\n  mat4 MVP = projectionMatrix * modelViewMatrix;\n\n  gl_Position = MVP * vec4( pos, 1.0 );\n  //gl_Position.zw -= 0.1;\n}";
},{}],"ezmQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _object_picker_vert = _interopRequireDefault(require("/editor/shaders/object_picker_vert"));

var _object_picker_frag = _interopRequireDefault(require("/editor/shaders/object_picker_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Mesh = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(Mesh, _THREE$Mesh);

  var _super = _createSuper(Mesh);

  function Mesh(geometry, material) {
    var _this;

    _classCallCheck(this, Mesh);

    _this = _super.call(this, geometry, material);
    _this._selectable_material = _this.__get_selectable_material();
    _this.original_material = _this.material;
    _this.stored_layers = _this.layers.mask;
    return _this;
  }

  _createClass(Mesh, [{
    key: "__get_selectable_material",
    value: function __get_selectable_material() {
      return new THREE.ShaderMaterial({
        uniforms: {
          _Color: {
            value: new THREE.Color()
          }
        },
        vertexShader: _object_picker_vert.default,
        fragmentShader: _object_picker_frag.default
      });
    }
  }, {
    key: "restore_material",
    value: function restore_material() {
      this.material = this.original_material;
    }
  }, {
    key: "store_layer_state",
    value: function store_layer_state() {
      this.stored_layers = this.layers.mask;
    }
  }, {
    key: "restore_layer_state",
    value: function restore_layer_state() {
      this.layers.mask = this.stored_layers;
    }
  }, {
    key: "selectable_material",
    get: function get() {
      return this._selectable_material;
    }
  }]);

  return Mesh;
}(THREE.Mesh);

exports.default = Mesh;
},{"/editor/shaders/object_picker_vert":"iaBK","/editor/shaders/object_picker_frag":"LSxb"}],"E21w":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Mesh2 = _interopRequireDefault(require("/Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Arrow = /*#__PURE__*/function (_Mesh) {
  _inherits(Arrow, _Mesh);

  var _super = _createSuper(Arrow);

  function Arrow(color, length, dir) {
    var _this;

    _classCallCheck(this, Arrow);

    color = color || "#FF0000";
    length = length || 1;
    var cone_height = 0.4;
    var cylinder_height = length - cone_height;
    var cylinder_geo = new THREE.CylinderBufferGeometry(0.01, 0.01, cylinder_height, 32);
    cylinder_geo.translate(0, cylinder_height / 2, 0);
    var cone_geometry = new THREE.ConeBufferGeometry(0.1, cone_height, 32);
    cone_geometry.translate(0, cylinder_height + cone_height / 2, 0);
    var buffer_geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([cylinder_geo, cone_geometry]);
    buffer_geometry.rotateX(3.14 / 2);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    _this = _super.call(this, buffer_geometry, material);
    if (dir) _this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    return _this;
  }

  _createClass(Arrow, [{
    key: "dir",
    set: function set(dir) {
      this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    }
  }, {
    key: "length",
    set: function set(value) {
      this.scale.z = value;
    }
  }]);

  return Arrow;
}(_Mesh2.default);

exports.default = Arrow;
},{"/Mesh":"ezmQ"}],"qvMM":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SceneManager = /*#__PURE__*/function () {
  function SceneManager() {
    _classCallCheck(this, SceneManager);

    this._current = new THREE.Scene();
    this._current.name = "default_scene";
  }

  _createClass(SceneManager, [{
    key: "add_scene",
    value: function add_scene(name) {}
  }, {
    key: "current",
    get: function get() {
      return this._current;
    },
    set: function set(scene) {
      this._current = scene;
    }
  }]);

  return SceneManager;
}();

var scene_manager = new SceneManager();
module.exports = scene_manager;
},{}],"ayC1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MathUtilities = /*#__PURE__*/function () {
  function MathUtilities() {
    _classCallCheck(this, MathUtilities);
  }

  _createClass(MathUtilities, null, [{
    key: "linear_map",
    value: function linear_map(value, from_range_start_value, from_range_end_value, to_range_start_value, to_range_end_value) {
      return (value - from_range_start_value) / (from_range_end_value - from_range_start_value) * (to_range_end_value - to_range_start_value) + to_range_start_value;
    }
  }, {
    key: "between",
    value: function between(value, min, max) {
      return value >= min && value <= max;
    }
  }, {
    key: "rgb_to_hex",
    value: function rgb_to_hex(rgb) {
      rgb.r = Math.round(rgb.r * 255).toString(16);
      rgb.g = Math.round(rgb.g * 255).toString(16);
      rgb.b = Math.round(rgb.b * 255).toString(16);
      if (rgb.r.length == 1) rgb.r = "0" + rgb.r;
      if (rgb.g.length == 1) rgb.g = "0" + rgb.g;
      if (rgb.b.length == 1) rgb.b = "0" + rgb.b;
      return "#" + rgb.r + rgb.g + rgb.b;
    }
  }, {
    key: "project_points_on_plane",
    value: function project_points_on_plane(points, plane) {
      var projected_point = new THREE.Vector3();
      var points_on_plane = [];

      for (var i = 0; i < points.length; i++) {
        plane.projectPoint(points[i], projected_point);
        points_on_plane.push(projected_point.clone());
      }

      return points_on_plane;
    }
  }, {
    key: "matrix4_lerp",
    value: function matrix4_lerp(from, to, target, t) {
      for (var i = 0; i < 16; i++) {
        target.elements[i] = THREE.Math.lerp(from.elements[i], to.elements[i], t);
      }
    }
  }, {
    key: "equals",
    value: function equals(x1, x2) {
      return Math.abs(x1 - x2) < 0.000001;
    }
  }, {
    key: "perspective_divide",
    value: function perspective_divide(v) {
      v.x /= v.w;
      v.y /= v.w;
      v.z /= v.w;
      return v;
    }
  }, {
    key: "points_average",
    value: function points_average(points) {
      var center = points[0].clone();

      for (var i = 1; i < points.length; i++) {
        center.add(points[i]);
      }

      center.multiplyScalar(1 / points.length);
      return center;
    }
  }]);

  return MathUtilities;
}();

exports.default = MathUtilities;
},{}],"ugwp":[function(require,module,exports) {
"use strict";

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _Input = _interopRequireDefault(require("/Input"));

var _Sphere = _interopRequireDefault(require("/primitives/Sphere"));

var _Arrow = _interopRequireDefault(require("/primitives/Arrow"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _MathUtilities = _interopRequireDefault(require("/utilities/MathUtilities"));

var _Screen = _interopRequireDefault(require("/Screen"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CameraUtilities = /*#__PURE__*/function () {
  function CameraUtilities() {
    _classCallCheck(this, CameraUtilities);

    this.tmp_mat = new THREE.Matrix4();
    this.tmp_vec = new THREE.Vector3(0, 0, 1);
    this.tmp_vec2 = new THREE.Vector3(0, 0, 0);
    this.plane = new THREE.Plane();
    this.ray = new THREE.Ray();
    this.tmp_size = new THREE.Vector3();
    this.tmp_unproj = new THREE.Vector3();
  }

  _createClass(CameraUtilities, [{
    key: "get_up_dir",
    value: function get_up_dir(camera) {
      camera = camera || _CameraManager.default.current;
      this.tmp_vec.set(0, 1, 0);
      this.tmp_vec.applyQuaternion(camera.quaternion);
      return this.tmp_vec;
    }
  }, {
    key: "get_forward_dir",
    value: function get_forward_dir(camera) {
      camera = camera || _CameraManager.default.current;
      this.tmp_vec.set(0, 0, 1);
      this.tmp_vec.applyQuaternion(camera.quaternion);
      return this.tmp_vec;
    }
  }, {
    key: "get_right_dir",
    value: function get_right_dir(camera) {
      camera = camera || _CameraManager.default.current;
      this.tmp_vec.set(1, 0, 0);
      this.tmp_vec.applyQuaternion(camera.quaternion);
      return this.tmp_vec;
    }
  }, {
    key: "unproject_mouse_position",
    value: function unproject_mouse_position(NDC, camera) {
      camera = camera || _CameraManager.default.current;
      var v_fov = camera.fov / 2 * Math.PI / 180;
      var h_fov = 2 * Math.atan(Math.tan(v_fov) * camera.aspect) / 2;
      var distV = Math.tan(v_fov) * camera.far;
      var distH = Math.tan(h_fov) * camera.far;
      this.tmp_vec.set(distH * NDC.x, distV * NDC.y, -camera.far).normalize();
      return this.tmp_vec.applyQuaternion(camera.quaternion);
    }
  }, {
    key: "get_plane_intersection",
    value: function get_plane_intersection(plane_position, plane_normal, NDC, camera) {
      camera = camera || _CameraManager.default.current;
      NDC = NDC || _Input.default.normalized_mouse_pos;
      this.plane.setFromNormalAndCoplanarPoint(plane_normal || this.get_forward_dir(camera), plane_position);

      if (camera.isPerspectiveCamera) {
        this.ray.set(camera.position, this.unproject_mouse_position(NDC, camera));
      } else {
        this.tmp_unproj.set(NDC.x, NDC.y, 1).unproject(camera);
        this.ray.set(camera.position, this.tmp_unproj);
      }

      this.ray.intersectPlane(this.plane, this.tmp_vec2);
      return this.tmp_vec2;
    }
  }, {
    key: "fit_points_on_camera",
    value: function fit_points_on_camera(points) {
      var zoom_scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var points_sphere = new THREE.Sphere().setFromPoints(points);
      var world_space_center = points_sphere.center;
      var camera_forward = this.get_forward_dir(_CameraManager.default.current).clone();
      var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(camera_forward, world_space_center);

      var points_on_plane = _MathUtilities.default.project_points_on_plane(points, plane);

      var projected_points_center = new THREE.Vector3();
      var box = new THREE.Box3().setFromPoints(points_on_plane);
      box.getCenter(projected_points_center);
      var up = new THREE.Vector3(0, 1, 0).applyQuaternion(_CameraManager.default.current.quaternion);
      var right = up.clone().cross(camera_forward).normalize();
      var mat = new THREE.Matrix4().set(right.x, up.x, camera_forward.x, world_space_center.x, right.y, up.y, camera_forward.y, world_space_center.y, right.z, up.z, camera_forward.z, world_space_center.z, 0, 0, 0, 1);
      var inverse_mat = new THREE.Matrix4().getInverse(mat);

      for (var i = 0; i < points_on_plane.length; i++) {
        points_on_plane[i].applyMatrix4(inverse_mat);
      }

      var size = new THREE.Vector3();
      box = new THREE.Box3().setFromPoints(points_on_plane);
      box.getSize(size);
      size.multiplyScalar(zoom_scale);
      var projected_center = new THREE.Vector3();
      box.getCenter(projected_center);
      return {
        position: projected_points_center,
        zoom: this.get_zoom_to_fit_rect(size.x / 2, size.y / 2)
      };
    }
  }, {
    key: "get_zoom_to_fit_rect",
    value: function get_zoom_to_fit_rect(width, height) {
      var v_fov = _CameraManager.default.current.fov / 2 * Math.PI / 180;
      var h_fov = 2 * Math.atan(Math.tan(v_fov) * _CameraManager.default.current.aspect) / 2;
      var distV = height / Math.tan(v_fov);
      var distH = width / Math.tan(h_fov);
      return Math.max(Math.abs(distH), Math.abs(distV));
    }
  }, {
    key: "get_zoom_to_fit_box",
    value: function get_zoom_to_fit_box(bb, camera) {
      if (camera.isOrthographicCamera) {
        bb.getSize(this.tmp_size);
        var obj_x = this.tmp_size.x;
        var obj_y = this.tmp_size.y;
        var object_aspect = obj_x / obj_y;

        if (_Screen.default.aspect_ratio / object_aspect > 1) {
          return _Screen.default.height / obj_y;
        } else {
          return _Screen.default.width / obj_x;
        }
      } else {
        // return this.fit_points_on_camera([bb.min, bb.max], 1).zoom;
        var size = new THREE.Vector3();
        bb.getSize(size);
        return this.get_zoom_to_fit_rect(size.x, size.y);
      }
    }
  }, {
    key: "get_html_screen_pos",
    value: function get_html_screen_pos(object, camera) {
      object.getWorldPosition(this.tmp_vec);
      this.tmp_vec.project(camera);
      this.tmp_vec.x = (this.tmp_vec.x * 0.5 + 0.5) * _Screen.default.width;
      this.tmp_vec.y = (1 - (this.tmp_vec.y * 0.5 + 0.5)) * _Screen.default.height;
      return this.tmp_vec;
    }
  }, {
    key: "world_pos_to_screen",
    value: function world_pos_to_screen(pos, camera) {
      camera = camera || _CameraManager.default.current;
      this.tmp_vec.copy(pos);
      this.tmp_vec.project(camera);
      this.tmp_vec.x = (this.tmp_vec.x * 0.5 + 0.5) * _Screen.default.width;
      this.tmp_vec.y = (1 - (this.tmp_vec.y * 0.5 + 0.5)) * _Screen.default.height;
      return this.tmp_vec;
    }
  }, {
    key: "update_projection",
    value: function update_projection(camera) {
      camera.left = -_Screen.default.width / 2;
      camera.right = _Screen.default.width / 2;
      camera.top = _Screen.default.height / 2;
      camera.bottom = -_Screen.default.height / 2;
      camera.aspect = _Screen.default.aspect_ratio;
      camera.updateProjectionMatrix(true);
    }
  }]);

  return CameraUtilities;
}();

var camera_utilities = new CameraUtilities();
module.exports = camera_utilities;
},{"/CameraManager":"XMgG","/Input":"k3P6","/primitives/Sphere":"sPjl","/primitives/Arrow":"E21w","/SceneManager":"qvMM","/utilities/MathUtilities":"ayC1","/Screen":"JIgx"}],"hZlU":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Capabilities = function Capabilities() {
  _classCallCheck(this, Capabilities);

  this.max_anisotropy = 0;
  this.vertex_texture_sampler_available = false;
  this.fp_textures_available = false;
};

var capabilities = new Capabilities();
module.exports = capabilities;
},{}],"dxG8":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform vec3 _Color;\n\nvarying vec3 vBarycentric;\n\nfloat edgeFactor(vec3 baryc ){\n    vec3 d = fwidth(baryc);\n    vec3 a3 = smoothstep(vec3(0.0), d*1.5, baryc);\n    return min(min(a3.x, a3.y), a3.z);\n}\n\nvoid main()\n{\t\n\tfloat alpha = edgeFactor(vBarycentric + vec3(1. , 1., 0.));\n\tgl_FragColor.rgb = mix(_Color, vec3(0.), alpha);\n\tgl_FragColor.a = 1.0 - alpha;\n\tgl_FragColor.a *= 0.2;\n}";
},{}],"WMaX":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nattribute vec3 barycentric;\nvarying vec3 vBarycentric;\nvoid main()\n{\n\n  mat4 VP = projectionMatrix * viewMatrix;\n  vec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;\n  gl_Position = VP * vec4(pos, 1.0);\n  vBarycentric = barycentric;\n}";
},{}],"LEA3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeometryUtilities = /*#__PURE__*/function () {
  function GeometryUtilities() {
    _classCallCheck(this, GeometryUtilities);
  }

  _createClass(GeometryUtilities, null, [{
    key: "convert_to_non_indexed_geometry",
    value: function convert_to_non_indexed_geometry(geometry_buffer) {
      var indices = geometry_buffer.index;
      var positions = geometry_buffer.getAttribute("position");
      var bar_coordinates = [];
      var vertices = [];

      for (var i = 0; i < indices.count; i += 3) {
        // VERTEX 1
        vertices.push(positions.getX(indices.array[i + 0]));
        vertices.push(positions.getY(indices.array[i + 0]));
        vertices.push(positions.getZ(indices.array[i + 0]));
        bar_coordinates.push(1);
        bar_coordinates.push(0);
        bar_coordinates.push(0); // VERTEX 2

        vertices.push(positions.getX(indices.array[i + 1]));
        vertices.push(positions.getY(indices.array[i + 1]));
        vertices.push(positions.getZ(indices.array[i + 1]));
        bar_coordinates.push(0);
        bar_coordinates.push(1);
        bar_coordinates.push(0); // VERTEX 3

        vertices.push(positions.getX(indices.array[i + 2]));
        vertices.push(positions.getY(indices.array[i + 2]));
        vertices.push(positions.getZ(indices.array[i + 2]));
        bar_coordinates.push(0);
        bar_coordinates.push(0);
        bar_coordinates.push(1);
      }

      var geometry = new THREE.BufferGeometry(); // geometry.setAttribute('barycentric', new THREE.BufferAttribute( new Float32Array(bar_coordinates), 3 ));

      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
      GeometryUtilities.add_barycentric_attribute(geometry);
      return geometry;
    }
  }, {
    key: "add_barycentric_attribute",
    value: function add_barycentric_attribute(non_indexed_geometry_buffer) {
      var bar_coordinates = [];
      var positions = non_indexed_geometry_buffer.getAttribute("position");

      for (var i = 0; i < positions.count; i += 3) {
        bar_coordinates.push(1);
        bar_coordinates.push(0);
        bar_coordinates.push(0);
        bar_coordinates.push(0);
        bar_coordinates.push(1);
        bar_coordinates.push(0);
        bar_coordinates.push(0);
        bar_coordinates.push(0);
        bar_coordinates.push(1);
      }

      non_indexed_geometry_buffer.setAttribute('barycentric', new THREE.BufferAttribute(new Float32Array(bar_coordinates), 3));
    }
  }]);

  return GeometryUtilities;
}();

exports.default = GeometryUtilities;
},{}],"rXwc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _grid_frag = _interopRequireDefault(require("/shaders/grid/grid_frag"));

var _grid_vert = _interopRequireDefault(require("/shaders/grid/grid_vert"));

var _GeometryUtilities = _interopRequireDefault(require("/utilities/GeometryUtilities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Grid = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(Grid, _THREE$Mesh);

  var _super = _createSuper(Grid);

  function Grid() {
    var _this;

    _classCallCheck(this, Grid);

    var material = new THREE.ShaderMaterial({
      uniforms: {
        _Color: {
          value: new THREE.Color("#919191")
        }
      },
      vertexShader: _grid_vert.default,
      fragmentShader: _grid_frag.default,
      extensions: {
        derivatives: true
      },
      transparent: true,
      depthWrite: false
    });
    var plane_geometry = new THREE.PlaneBufferGeometry(100, 100, 100, 100);

    var non_indexed_geometry = _GeometryUtilities.default.convert_to_non_indexed_geometry(plane_geometry);

    _this = _super.call(this, non_indexed_geometry, material);
    _this.rotation.x = -3.14 / 2;
    return _this;
  }

  return Grid;
}(THREE.Mesh);

exports.default = Grid;
},{"/shaders/grid/grid_frag":"dxG8","/shaders/grid/grid_vert":"WMaX","/utilities/GeometryUtilities":"LEA3"}],"gDca":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BaseRender = /*#__PURE__*/function () {
  function BaseRender() {
    _classCallCheck(this, BaseRender);
  }

  _createClass(BaseRender, [{
    key: "render",
    value: function render() {}
  }, {
    key: "on_enter",
    value: function on_enter(context, renderer) {}
  }, {
    key: "on_exit",
    value: function on_exit(context, renderer) {}
  }, {
    key: "resize",
    value: function resize() {}
  }]);

  return BaseRender;
}();

exports.default = BaseRender;
},{}],"bFlA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RenderLayers = /*#__PURE__*/function () {
  function RenderLayers() {
    _classCallCheck(this, RenderLayers);
  }

  _createClass(RenderLayers, null, [{
    key: "opaque",
    get: function get() {
      return 0;
    }
  }, {
    key: "transparent",
    get: function get() {
      return 1;
    }
  }, {
    key: "outline",
    get: function get() {
      return 2;
    }
  }, {
    key: "selectable",
    get: function get() {
      return 3;
    }
  }]);

  return RenderLayers;
}();

exports.default = RenderLayers;
},{}],"aRZG":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform sampler2D _MainTex;\nuniform sampler2D _Blur;\nuniform vec2 _Screen;\nvarying vec2 vUv;\n\nfloat aastep(float threshold, float value) {\n  #ifdef GL_OES_standard_derivatives\n    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;\n    return smoothstep(threshold-afwidth, threshold+afwidth, value);\n  #else\n    return step(threshold, value);\n  #endif  \n}\n\nvoid main()\n{\n\tvec2 pixel_size = 1.0/_Screen;\n\n\tvec4 color = texture2D( _MainTex, vUv);\n\tfloat mask = 1.0 - color.a;\n\n\tfloat blur = texture2D( _Blur, vUv).a;\n\n  // gl_FragColor = vec4(mask,mask,mask,0.0);\n  // gl_FragColor = color;\n\n\tgl_FragColor = vec4(mix(color.rgb, mix(color.rgb, vec3(1.,0.,0.),aastep(0.076, blur)), mask), 1.0);\n}\n\n";
},{}],"GnKT":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform sampler2D _MainTex;\nuniform vec2 _Resolution;\nuniform vec2 _SampleDir;\nvarying vec2 vUv;\n\nvoid main()\n{\n\n\tvec3 sum = vec3(0.,0.,0.);\n\tvec2 dir = (0.5/_Resolution) * _SampleDir;\n\tfloat _Distance = 2.0;\n\tsum += texture2D( _MainTex, vUv + dir * -4. * _Distance ).rgb * 0.0525;\n\tsum += texture2D( _MainTex, vUv + dir * -3. * _Distance ).rgb * 0.075;\n\tsum += texture2D( _MainTex, vUv + dir * -2. * _Distance ).rgb * 0.110;\n\tsum += texture2D( _MainTex, vUv + dir * -1. * _Distance ).rgb * 0.150;\n\tsum += texture2D( _MainTex, vUv + dir *  0. * _Distance ).rgb * 0.225;\n\tsum += texture2D( _MainTex, vUv + dir *  1. * _Distance ).rgb * 0.150;\n\tsum += texture2D( _MainTex, vUv + dir *  2. * _Distance ).rgb * 0.110;\n\tsum += texture2D( _MainTex, vUv + dir *  3. * _Distance ).rgb * 0.075;\n\tsum += texture2D( _MainTex, vUv + dir *  4. * _Distance ).rgb * 0.0525;\n\tgl_FragColor = vec4(sum, 1.0);\n\n}\n";
},{}],"s876":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform sampler2D _MainTex;\n\nvarying vec2 vUv;\nvoid main()\n{\n\tgl_FragColor = texture2D(_MainTex, vUv);\n}";
},{}],"i1za":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvarying vec2 vUv;\nvoid main()\n{\n\tgl_Position = vec4(uv * 2.0 - 1.0, 1.0, 1.0);\n\tvUv = uv;\n}";
},{}],"F9Xn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Screen = _interopRequireDefault(require("/Screen"));

var _RenderLayers = _interopRequireDefault(require("/RenderLayers"));

var _compose_frag = _interopRequireDefault(require("/shaders/box_blur/compose_frag"));

var _box_blur_frag = _interopRequireDefault(require("/shaders/box_blur/box_blur_frag"));

var _copy_frag = _interopRequireDefault(require("/shaders/copy/copy_frag"));

var _copy_vert = _interopRequireDefault(require("/shaders/copy/copy_vert"));

var _basic_color_frag = _interopRequireDefault(require("/shaders/basic_color/basic_color_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OutlineRender = /*#__PURE__*/function () {
  function OutlineRender(webgl) {
    _classCallCheck(this, OutlineRender);

    this.main_rt = new THREE.WebGLRenderTarget(_Screen.default.width, _Screen.default.height);
    this.rt1 = new THREE.WebGLRenderTarget(_Screen.default.width, _Screen.default.height);
    this.rt2 = new THREE.WebGLRenderTarget(_Screen.default.width, _Screen.default.height);
    this.compose_material = this.__get_compose_material();
    this.copy_material = this.__get_copy_material();
    this.box_blur_material = this.__get_box_blur_material();
    this.background_material = this.__get_background_material();
    this.copy_plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.copy_material);
    this.copy_plane.frustumCulled = false;
    this.copy_scene = new THREE.Scene();
    this.copy_scene.add(this.copy_plane);
  }

  _createClass(OutlineRender, [{
    key: "resize",
    value: function resize(w, h) {
      this.main_rt.setSize(w, h);
      this.rt1.setSize(w, h);
      this.rt2.setSize(w, h);

      this.box_blur_material.uniforms._Screen.value.set(w, h);

      this.compose_material.uniforms._Screen.value.set(w, h);
    }
  }, {
    key: "render",
    value: function render(webgl) {
      webgl.camera.updateMatrix();
      webgl.camera.updateMatrixWorld();
      webgl.camera.layers.enable(_RenderLayers.default.opaque);
      webgl.camera.layers.enable(_RenderLayers.default.transparent);
      webgl.camera.layers.disable(_RenderLayers.default.outline); //render scene

      webgl._renderer.setClearColor(webgl.clear_color, 0);

      webgl._renderer.clearTarget(this.main_rt, true, true, true);

      this.copy_scene.overrideMaterial = this.background_material;

      this.background_material.uniforms._Color.value.set(webgl.clear_color.r, webgl.clear_color.g, webgl.clear_color.b, 0);

      webgl._renderer.render(this.copy_scene, webgl.camera, this.main_rt, false);

      webgl._renderer.render(webgl.scene, webgl.camera, this.main_rt, false); //horizontal blur


      this.box_blur_material.uniforms._MainTex.value = this.main_rt.texture;

      this.box_blur_material.uniforms._SampleDir.value.set(1, 0);

      this.copy_scene.overrideMaterial = this.box_blur_material;

      webgl._renderer.render(this.copy_scene, webgl.camera, this.rt1, false); //vertical blur


      this.box_blur_material.uniforms._SampleDir.value.set(0, 1);

      this.box_blur_material.uniforms._MainTex.value = this.rt1.texture;

      webgl._renderer.render(this.copy_scene, webgl.camera, this.rt2, false); //compose


      this.copy_scene.overrideMaterial = this.compose_material;
      this.compose_material.uniforms._MainTex.value = this.main_rt.texture;
      this.compose_material.uniforms._Blur.value = this.rt2.texture;

      webgl._renderer.render(this.copy_scene, webgl.camera, undefined, false);

      this.copy_scene.overrideMaterial = undefined;
    }
  }, {
    key: "__get_copy_material",
    value: function __get_copy_material() {
      return new THREE.ShaderMaterial({
        uniforms: {
          _MainTex: {
            value: undefined
          }
        },
        vertexShader: _copy_vert.default,
        fragmentShader: _copy_frag.default,
        depthTest: false,
        depthWrite: false
      });
    }
  }, {
    key: "__get_box_blur_material",
    value: function __get_box_blur_material() {
      return new THREE.ShaderMaterial({
        uniforms: {
          _MainTex: {
            value: undefined
          },
          _SampleDir: {
            value: new THREE.Vector2()
          },
          _Screen: {
            value: new THREE.Vector2(_Screen.default.width, _Screen.default.height)
          }
        },
        vertexShader: _copy_vert.default,
        fragmentShader: _box_blur_frag.default,
        depthTest: false,
        depthWrite: false
      });
    }
  }, {
    key: "__get_compose_material",
    value: function __get_compose_material() {
      return new THREE.ShaderMaterial({
        uniforms: {
          _MainTex: {
            value: undefined
          },
          _Blur: {
            value: undefined
          },
          _Screen: {
            value: new THREE.Vector2(_Screen.default.width, _Screen.default.height)
          }
        },
        vertexShader: _copy_vert.default,
        fragmentShader: _compose_frag.default,
        depthTest: false,
        depthWrite: false,
        extensions: {
          derivatives: true
        }
      });
    }
  }, {
    key: "__get_background_material",
    value: function __get_background_material() {
      return new THREE.ShaderMaterial({
        uniforms: {
          _Color: {
            value: new THREE.Vector4(0, 0, 0, 0)
          }
        },
        vertexShader: _copy_vert.default,
        fragmentShader: _basic_color_frag.default,
        depthTest: true,
        depthWrite: false
      });
    }
  }, {
    key: "on_enter",
    value: function on_enter(webgl) {
      webgl._renderer.autoClear = false;
    }
  }, {
    key: "on_exit",
    value: function on_exit(webgl) {
      webgl._renderer.autoClear = true;
    }
  }]);

  return OutlineRender;
}();

exports.default = OutlineRender;
},{"/Screen":"JIgx","/RenderLayers":"bFlA","/shaders/box_blur/compose_frag":"aRZG","/shaders/box_blur/box_blur_frag":"GnKT","/shaders/copy/copy_frag":"s876","/shaders/copy/copy_vert":"i1za","/shaders/basic_color/basic_color_frag":"LSxb"}],"Ftca":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _copy_vert = _interopRequireDefault(require("/shaders/copy/copy_vert"));

var _copy_frag = _interopRequireDefault(require("/shaders/copy/copy_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BlitMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {
  _inherits(BlitMaterial, _THREE$ShaderMaterial);

  var _super = _createSuper(BlitMaterial);

  function BlitMaterial(frag_shader, vert_shader, defines) {
    var _super$call;

    _classCallCheck(this, BlitMaterial);

    return _super.call(this, (_super$call = {
      uniforms: {
        _MainTex: {
          value: null
        },
        _Resolution: {
          value: new THREE.Vector2(0, 0)
        }
      },
      defines: defines || {},
      vertexShader: vert_shader || _copy_vert.default,
      fragmentShader: frag_shader || _copy_frag.default,
      depthWrite: false,
      blending: THREE.NoBlending,
      depthTest: false
    }, _defineProperty(_super$call, "depthWrite", false), _defineProperty(_super$call, "depthFunc", THREE.AlwaysDepth), _super$call));
  }

  return BlitMaterial;
}(THREE.ShaderMaterial);

exports.default = BlitMaterial;
},{"/shaders/copy/copy_vert":"i1za","/shaders/copy/copy_frag":"s876"}],"qoY1":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform vec4 _DepthNormal;\nvec2 EncodeFloatRG( float v )\n{\n    vec2 kEncodeMul = vec2(1.0, 255.0);\n    float kEncodeBit = 1.0/255.0;\n    vec2 enc = kEncodeMul * v;\n    enc = fract (enc);\n    enc.x -= enc.y * kEncodeBit;\n    return enc;\n}\n\nvec2 EncodeNormal (vec3 n)\n{\n    float scale = 1.7777;\n    vec2 enc = n.xy / (n.z+1.0);\n    enc /= scale;\n    enc = enc*0.5+0.5;\n    return enc;\n}\n\nvoid main()\n{\n    gl_FragColor = vec4(EncodeFloatRG(_DepthNormal.x), EncodeNormal(normalize(_DepthNormal.yzw)));  \n}";
},{}],"bGMu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BlitMaterial2 = _interopRequireDefault(require("/materials/BlitMaterial"));

var _clear_depth_normal_frag = _interopRequireDefault(require("/shaders/clear/clear_depth_normal_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ClearDepthNormalMaterial = /*#__PURE__*/function (_BlitMaterial) {
  _inherits(ClearDepthNormalMaterial, _BlitMaterial);

  var _super = _createSuper(ClearDepthNormalMaterial);

  function ClearDepthNormalMaterial(clear_depth, clear_normal) {
    var _this;

    _classCallCheck(this, ClearDepthNormalMaterial);

    _this = _super.call(this, _clear_depth_normal_frag.default);
    _this.uniforms._DepthNormal = {
      value: new THREE.Vector4(clear_depth, clear_normal.x, clear_normal.y, clear_normal.z)
    };
    return _this;
  }

  return ClearDepthNormalMaterial;
}(_BlitMaterial2.default);

exports.default = ClearDepthNormalMaterial;
},{"/materials/BlitMaterial":"Ftca","/shaders/clear/clear_depth_normal_frag":"qoY1"}],"DRHE":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvarying vec3 v_normal;\nvarying vec3 v_pos;\n\nvoid main()\n{\n  vec3 pos = position;\n  mat4 MVP = projectionMatrix * modelViewMatrix;\n\n  v_normal \t= (modelViewMatrix * vec4(normal, 0.0)).xyz;\n  v_pos \t\t= (modelViewMatrix * vec4( pos, 1.0 )).xyz;\n\n  gl_Position = MVP * vec4( pos, 1.0 );\n}";
},{}],"a4Wy":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvarying vec3 v_normal;\nvarying vec3 v_pos;\n\nuniform float _FarPlane;\n\nvec2 EncodeFloatRG( float v )\n{\n    vec2 kEncodeMul = vec2(1.0, 255.0);\n    float kEncodeBit = 1.0/255.0;\n    vec2 enc = kEncodeMul * v;\n    enc = fract (enc);\n    enc.x -= enc.y * kEncodeBit;\n    return enc;\n}\n\nvec2 EncodeNormal (vec3 n)\n{\n    float scale = 1.7777;\n    vec2 enc = n.xy / (n.z+1.0);\n    enc /= scale;\n    enc = enc*0.5+0.5;\n    return enc;\n}\n\nvoid main()\n{\n\tgl_FragColor = vec4(EncodeFloatRG(length(v_pos.z)/_FarPlane), EncodeNormal(normalize(v_normal)));\t\n}\n\n";
},{}],"VcOC":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _depth_normals_vert = _interopRequireDefault(require("/shaders/depth_normals/depth_normals_vert"));

var _depth_normals_frag = _interopRequireDefault(require("/shaders/depth_normals/depth_normals_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DepthNormalMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {
  _inherits(DepthNormalMaterial, _THREE$ShaderMaterial);

  var _super = _createSuper(DepthNormalMaterial);

  function DepthNormalMaterial() {
    _classCallCheck(this, DepthNormalMaterial);

    return _super.call(this, {
      uniforms: {
        _FarPlane: {
          value: 1
        }
      },
      vertexShader: _depth_normals_vert.default,
      fragmentShader: _depth_normals_frag.default
    });
  }

  _createClass(DepthNormalMaterial, [{
    key: "far_plane",
    set: function set(value) {
      this.uniforms._FarPlane.value = value;
    }
  }]);

  return DepthNormalMaterial;
}(THREE.ShaderMaterial);

exports.default = DepthNormalMaterial;
},{"/shaders/depth_normals/depth_normals_vert":"DRHE","/shaders/depth_normals/depth_normals_frag":"a4Wy"}],"pWL9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _Screen = _interopRequireDefault(require("/Screen"));

var _ClearDepthNormalMaterial = _interopRequireDefault(require("/materials/ClearDepthNormalMaterial"));

var _DepthNormalMaterial = _interopRequireDefault(require("/materials/DepthNormalMaterial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DepthAndNormalsRenderer = /*#__PURE__*/function () {
  function DepthAndNormalsRenderer() {
    _classCallCheck(this, DepthAndNormalsRenderer);

    this.RT = new THREE.WebGLRenderTarget(_Screen.default.width, _Screen.default.height);
    this.clear_depth_normal_mat = new _ClearDepthNormalMaterial.default(1, new THREE.Vector3(0, 0, 1));
    this.depth_normal_material = new _DepthNormalMaterial.default();
  }

  _createClass(DepthAndNormalsRenderer, [{
    key: "render",
    value: function render(graphics) {
      this.__resize_RT_if_necessary();

      graphics.clear(this.RT, undefined, true, true);
      graphics.blit_clear_with_material(this.RT, this.clear_depth_normal_mat);
      this.depth_normal_material.far_plane = _CameraManager.default.current.far;
      graphics.render(undefined, undefined, this.RT, this.depth_normal_material);
    }
  }, {
    key: "__resize_RT_if_necessary",
    value: function __resize_RT_if_necessary() {
      if (this.RT.width !== _Screen.default.width || this.RT.height !== _Screen.default.height) {
        this.RT.setSize(_Screen.default.width, _Screen.default.height);
      }
    }
  }, {
    key: "render_target",
    get: function get() {
      return this.RT;
    }
  }]);

  return DepthAndNormalsRenderer;
}();

exports.default = DepthAndNormalsRenderer;
},{"/CameraManager":"XMgG","/SceneManager":"qvMM","/Screen":"JIgx","/materials/ClearDepthNormalMaterial":"bGMu","/materials/DepthNormalMaterial":"VcOC"}],"IerZ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BlitMaterial = _interopRequireDefault(require("/materials/BlitMaterial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Blitter = /*#__PURE__*/function () {
  function Blitter(renderer) {
    _classCallCheck(this, Blitter);

    this.renderer = renderer;
    this._blit_scene = new THREE.Scene();
    this._blit_material = new _BlitMaterial.default();
    this._blit_quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), this._blit_material);

    this._blit_scene.add(this._blit_quad);

    this._blit_camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10000, 10000);
  }

  _createClass(Blitter, [{
    key: "blit",
    value: function blit(src, dst) {
      this._blit_quad.material = this._blit_material;
      this._blit_quad.material.uniforms._MainTex.value = src.texture;

      this._blit_quad.material.uniforms._Resolution.value.set(src.width, src.height);

      this.renderer.setRenderTarget(dst === undefined ? null : dst);
      this.renderer.render(this._blit_scene, this._blit_camera);
    }
  }, {
    key: "blit_with_material",
    value: function blit_with_material(src, dst, mat) {
      this._blit_quad.material = mat;
      this._blit_quad.material.uniforms._MainTex.value = src.texture;

      this._blit_quad.material.uniforms._Resolution.value.set(src.width, src.height);

      this.renderer.setRenderTarget(dst === undefined ? null : dst);
      this.renderer.render(this._blit_scene, this._blit_camera);
    }
  }, {
    key: "blit_clear_with_material",
    value: function blit_clear_with_material(dst_RT, mat) {
      this._blit_quad.material = mat;
      this.renderer.setRenderTarget(dst_RT === undefined ? null : dst_RT);
      this.renderer.render(this._blit_scene, this._blit_camera);
    }
  }]);

  return Blitter;
}();

exports.default = Blitter;
},{"/materials/BlitMaterial":"Ftca"}],"xMH9":[function(require,module,exports) {
"use strict";

var _Configuration = _interopRequireDefault(require("/Configuration"));

var _BaseRender = _interopRequireDefault(require("/render_mode/BaseRender"));

var _OutlineRender = _interopRequireDefault(require("/render_mode/OutlineRender"));

var _Screen = _interopRequireDefault(require("/Screen"));

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _Capabilities = _interopRequireDefault(require("/Capabilities"));

var _DepthAndNormalsRenderer = _interopRequireDefault(require("/render_utilities/DepthAndNormalsRenderer"));

var _Blitter = _interopRequireDefault(require("/render_utilities/Blitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Graphics = /*#__PURE__*/function () {
  function Graphics() {
    _classCallCheck(this, Graphics);

    this._renderer = undefined;
    this.blitter = undefined;
    this.canvas = undefined;
    this.no_render = undefined;
    this.current_render_mode = undefined;
    this.generateDepthNormalTexture = false;
    this.depth_and_normals_renderer = undefined;
  }

  _createClass(Graphics, [{
    key: "init",
    value: function init(canvas) {
      var msaa = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this._renderer = new THREE.WebGLRenderer({
        antialias: msaa,
        preserveDrawingBuffer: true,
        alpha: true,
        canvas: canvas
      });
      this._renderer.autoClear = false;

      this._renderer.setPixelRatio(1);

      _Screen.default.dpr = window.devicePixelRatio;

      this._renderer.extensions.get('ANGLE_instanced_arrays');

      this.blitter = new _Blitter.default(this._renderer);
      this.canvas = this._renderer.domElement;
      this.no_render = new _BaseRender.default();
      this.current_render_mode = this.no_render;
      _Capabilities.default.max_anisotropy = this._renderer.capabilities.getMaxAnisotropy();
      _Capabilities.default.vertex_texture_sampler_available = this._renderer.capabilities.maxVertexTextures > 0;
      _Capabilities.default.fp_textures_available = this._renderer.capabilities.floatVertexTextures;
      this.generateDepthNormalTexture = false;
      this.depth_and_normals_renderer = new _DepthAndNormalsRenderer.default();
    }
  }, {
    key: "set_state",
    value: function set_state(new_state) {
      console.log("VIEWAPI - map render mode switch to: " + new_state.constructor.name);
      this.current_render_mode.on_exit(this, this._renderer);
      this.current_render_mode = new_state;
      this.current_render_mode.on_enter(this, this._renderer);
    }
  }, {
    key: "update",
    value: function update() {
      this.check_for_resize();

      if (this.generateDepthNormalTexture) {
        this.depth_and_normals_renderer.render(this);
      }

      if (_CameraManager.default.current) {
        this.__update_current_camera();

        this.current_render_mode.render();
      }
    }
  }, {
    key: "__update_current_camera",
    value: function __update_current_camera() {
      _CameraManager.default.current.aspect = _Screen.default.aspect_ratio;

      _CameraManager.default.current.updateProjectionMatrix();

      _CameraManager.default.current.updateMatrix();

      _CameraManager.default.current.updateMatrixWorld(true);
    }
  }, {
    key: "render",
    value: function render(scene, camera, RT, override_mat) {
      this.__apply_override_material(scene, override_mat);

      this._renderer.setRenderTarget(RT === undefined ? null : RT);

      this._renderer.render(scene || _SceneManager.default.current, camera || _CameraManager.default.current);

      this.__apply_override_material(scene, undefined);
    }
  }, {
    key: "__apply_override_material",
    value: function __apply_override_material(scene, mat) {
      if (scene) scene.overrideMaterial = mat;else _SceneManager.default.current.overrideMaterial = mat;
    }
  }, {
    key: "readback_RT",
    value: function readback_RT(RT, buffer) {
      this._renderer.readRenderTargetPixels(RT, 0, 0, RT.width, RT.height, buffer);
    }
  }, {
    key: "clear",
    value: function clear(RT, camera, clear_depth, clear_stencil) {
      this._renderer.setRenderTarget(RT === undefined ? null : RT);

      if (camera) {
        this._renderer.setClearColor(camera.clear_color, camera.clear_alpha);
      }

      this._renderer.clear(camera ? true : false, // clear color
      clear_depth ? true : false, clear_stencil ? true : false);
    }
  }, {
    key: "check_for_resize",
    value: function check_for_resize() {
      var current_width = this.canvas.clientWidth;
      var current_height = this.canvas.clientHeight;

      if (current_width !== _Screen.default.width || current_height !== _Screen.default.height || window.devicePixelRatio !== _Screen.default.dpr) {
        _Screen.default.dpr = window.devicePixelRatio;

        _Screen.default.update_size(current_width, current_height);

        this.canvas.width = _Screen.default.render_width;
        this.canvas.height = _Screen.default.render_height;

        this._renderer.setViewport(0, 0, _Screen.default.render_width, _Screen.default.render_height);

        this.__update_current_camera();
      }
    }
  }, {
    key: "on_resize",
    value: function on_resize() {
      console.error("Graphics.on_resize call no longer needed.");
    }
  }, {
    key: "blit",
    value: function blit(src_RT, dst_RT, mat) {
      if (mat) this.blitter.blit_with_material(src_RT, dst_RT, mat);else this.blitter.blit(src_RT, dst_RT);
    }
  }, {
    key: "blit_clear_with_material",
    value: function blit_clear_with_material(dst_RT, mat) {
      this.blitter.blit_clear_with_material(dst_RT, mat);
    }
  }, {
    key: "take_screenshot",
    value: function take_screenshot(blob_callback) {
      var ctx = this;
      var old_width = _Screen.default.width;
      var old_height = _Screen.default.height;
      var new_width = 4096;
      var new_height = 4096;
      var tile_width = 1024;
      var tile_height = 1024;
      var divisions_x = parseInt(Math.ceil(new_width / tile_width));
      var divisions_y = parseInt(Math.ceil(new_height / tile_height));

      _Screen.default.update_size(tile_width, tile_height);

      this._renderer.setPixelRatio(1);

      this._renderer.setSize(tile_width, tile_height, false);

      this.ctx_2D.canvas.width = new_width;
      this.ctx_2D.canvas.height = new_height;
      _CameraManager.default.current.aspect = _Screen.default.aspect_ratio;

      _CameraManager.default.current.updateMatrix();

      _CameraManager.default.current.updateMatrixWorld(true);

      for (var x = 0; x < divisions_x; x++) {
        for (var y = 0; y < divisions_y; y++) {
          _CameraManager.default.current.setViewOffset(new_width, new_height, _Screen.default.width * x, _Screen.default.height * y, _Screen.default.width, _Screen.default.height);

          this.current_render_mode.render();
          this.ctx_2D.drawImage(this._renderer.domElement, _Screen.default.width * x, _Screen.default.height * y);
        }
      } // transform the result canvas into a blob
      // from them the callback turns into a ULR and download it


      this.ctx_2D.canvas.toBlob(blob_callback, "image/png;base64;");

      _CameraManager.default.current.clearViewOffset();

      _Screen.default.update_size(old_width, old_height);

      this._renderer.setPixelRatio(window.devicePixelRatio);

      this._renderer.setSize(old_width, old_height, false);

      _CameraManager.default.current.aspect = _Screen.default.aspect_ratio;

      _CameraManager.default.current.updateMatrix();

      _CameraManager.default.current.updateMatrixWorld(true);
    }
  }, {
    key: "download_screenshot",
    value: function download_screenshot(blob) {
      console.log("el blob", blob);
      var link = document.createElement('a');
      link.download = "Snapshot.png";
      link.href = URL.createObjectURL(blob);
      link.click();

      link.onclick = function () {
        requestAnimationFrame(function () {
          URL.revokeObjectURL(a.href);
        });
        a.removeAttribute('href');
      };
    }
  }, {
    key: "dom_element",
    get: function get() {
      return this._renderer.domElement;
    }
  }, {
    key: "depth_normals_RT",
    get: function get() {
      return this.depth_and_normals_renderer.render_target;
    }
  }]);

  return Graphics;
}();

var graphics = new Graphics();
module.exports = graphics;
},{"/Configuration":"RyjO","/render_mode/BaseRender":"gDca","/render_mode/OutlineRender":"F9Xn","/Screen":"JIgx","/CameraManager":"XMgG","/SceneManager":"qvMM","/Capabilities":"hZlU","/render_utilities/DepthAndNormalsRenderer":"pWL9","/render_utilities/Blitter":"IerZ"}],"yntx":[function(require,module,exports) {
"use strict";

var _Input = _interopRequireDefault(require("/Input"));

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _Graphics = _interopRequireDefault(require("/Graphics"));

var _Screen = _interopRequireDefault(require("/Screen"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UI = /*#__PURE__*/function () {
  function UI() {
    _classCallCheck(this, UI);

    this.ui_elements = [];
    this._tmp_normalized_pos = new THREE.Vector2();
    this.ss_scene = new THREE.Scene();
    this.ss_scene.autoUpdate = false;
    this.ss_scene.frustumCulled = false;
    this.ws_scene = new THREE.Scene();
    this.ws_scene.autoUpdate = false;
    this.ws_scene.frustumCulled = false;
    this.ss_camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  }

  _createClass(UI, [{
    key: "delete_element",
    value: function delete_element(elem) {
      var index = this.ui_elements.indexOf(elem);

      if (index > -1) {
        this.ui_elements.splice(index, 1);
      }

      this.ss_scene.remove(elem);
      this.ws_scene.remove(elem);
      elem.dispose();
    }
  }, {
    key: "add_screen_space_element",
    value: function add_screen_space_element(elem) {
      this.ui_elements.push(elem);
      this.ss_scene.add(elem);
      elem.set_screen_space_coordinate_system();
    }
  }, {
    key: "add_world_space_element",
    value: function add_world_space_element(elem) {
      this.ui_elements.push(elem);
      this.ws_scene.add(elem);
      elem.set_world_space_coordinate_system();
    }
  }, {
    key: "update",
    value: function update() {
      // this.ss_camera.left     = -Screen.width / 2;
      // this.ss_camera.right    = Screen.width / 2;
      // this.ss_camera.top      = Screen.top / 2;
      // this.ss_camera.right    = -Screen.bottom / 2;
      this.ss_camera.updateProjectionMatrix();

      this._tmp_normalized_pos.copy(_Input.default.normalized_mouse_pos);

      for (var i = 0; i < this.ui_elements.length; i++) {
        this.ui_elements[i].update_state(this._tmp_normalized_pos);
      }
    }
  }, {
    key: "render",
    value: function render(renderer) {
      // renderer.render_ui(this.scene);
      if (this.ss_scene.children.length > 0) _Graphics.default.render(this.ss_scene, this.ss_camera);
      if (this.ws_scene.children.length > 0) _Graphics.default.render(this.ws_scene, _CameraManager.default.current);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.current_clicked_element = undefined;
    }
  }]);

  return UI;
}();

var ui = new UI();
module.exports = ui;
},{"/Input":"k3P6","/CameraManager":"XMgG","/Graphics":"xMH9","/Screen":"JIgx"}],"wMgF":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform vec2 _ScreenSize;\nuniform vec2 _TextureSize;\nuniform vec2 _PixelOffset;\nuniform vec3 _NDC;\nuniform vec2 _PivotPoint;\nuniform float _DepthOffset;\nvarying vec2 vUv;\n\nvec2 add_pixel_offset(vec2 pos)\n{\n\tpos = pos * 0.5 + 0.5;\n\tpos *= _ScreenSize;\n\tpos = ceil(pos+_PixelOffset)+0.5;\n\tpos /= _ScreenSize;\n\treturn pos * 2.0 - 1.0;\n}\nvoid main()\n{\n\tvec4 projected_pos = projectionMatrix * viewMatrix * vec4(_NDC, 1.0);\n  projected_pos.zw += _DepthOffset;\n\n\tprojected_pos.xyz /= projected_pos.w;\n\n  vec2 normalized_size = _TextureSize/_ScreenSize;\n  vec2 dir = uv * 2.0 - 1.0;\n  dir -= _PivotPoint;\n  vec2 pos = projected_pos.xy+dir * normalized_size;\n  gl_Position = vec4(add_pixel_offset(pos), projected_pos.z, 1.0);\n  vUv = uv;\n\n}\n";
},{}],"zYpx":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform sampler2D _MainTex;\nuniform vec2 _ScreenSize;\nuniform vec2 _TextureSize;\nvarying vec2 vUv;\n\nvoid main()\n{\n\tgl_FragColor = texture2D(_MainTex, vUv + vec2(0.5, 0.5)/_TextureSize);\n}\n";
},{}],"F8cc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ui_element = _interopRequireDefault(require("/shaders/ui_element/ui_element.vert"));

var _ui_element2 = _interopRequireDefault(require("/shaders/ui_element/ui_element.frag"));

var _BaseShaderMaterial2 = _interopRequireDefault(require("/materials/BaseShaderMaterial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var UIElementMaterial = /*#__PURE__*/function (_BaseShaderMaterial) {
  _inherits(UIElementMaterial, _BaseShaderMaterial);

  var _super = _createSuper(UIElementMaterial);

  function UIElementMaterial() {
    var _this;

    var intensity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    _classCallCheck(this, UIElementMaterial);

    _this = _super.call(this, _ui_element.default, _ui_element2.default, {
      _MainTex: {
        value: undefined
      },
      _ScreenSize: {
        value: new THREE.Vector2(Screen.width, Screen.height)
      },
      _TextureSize: {
        value: new THREE.Vector2()
      },
      _PixelOffset: {
        value: new THREE.Vector2(0, 0)
      },
      _NDC: {
        value: new THREE.Vector3()
      },
      _PivotPoint: {
        value: new THREE.Vector2()
      },
      _DepthOffset: {
        value: 0
      }
    });
    _this.transparent = true;
    _this.depthWrite = false;
    _this.depthTest = false;
    return _this;
  }

  return UIElementMaterial;
}(_BaseShaderMaterial2.default);

exports.default = UIElementMaterial;
},{"/shaders/ui_element/ui_element.vert":"wMgF","/shaders/ui_element/ui_element.frag":"zYpx","/materials/BaseShaderMaterial":"Ej2H"}],"HZsS":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform sampler2D _MainTex;\nuniform vec2 _ScreenSize;\nuniform vec2 _TextureSize;\nvarying vec2 vUv;\n\nvoid main()\n{\n\tgl_FragColor = texture2D(_MainTex, vUv + vec2(0.5, 0.5)/_TextureSize);\n}";
},{}],"Spsq":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform vec2 _ScreenSize;\nuniform vec2 _TextureSize;\nuniform vec2 _PixelOffset;\nuniform vec3 _NDC;\nuniform vec2 _PivotPoint;\nuniform float _DepthOffset;\nvarying vec2 vUv;\n\nvec2 round_to_ceil(vec2 pos)\n{\n\tpos = pos * 0.5 + 0.5;\n\tpos *= _ScreenSize;\n\tpos = ceil(pos)+0.5;\n\tpos /= _ScreenSize;\n\treturn pos * 2.0 - 1.0;\n}\nvoid main()\n{\n\tvec4 projected_pos = projectionMatrix * viewMatrix * vec4(_NDC, 1.0);\n  projected_pos.zw += _DepthOffset;\n\n\tprojected_pos.xyz /= projected_pos.w;\n\t\n  vec2 normalized_size = _TextureSize/_ScreenSize;\n  vec2 dir = uv * 2.0 - 1.0;\n  dir -= _PivotPoint; \n  vec2 pos = projected_pos.xy+ dir * normalized_size;\n  gl_Position = vec4(round_to_ceil(pos), projected_pos.z, 1.0);\n  vUv = uv;\n\n}";
},{}],"GMfh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScreenSpacePosition = /*#__PURE__*/function () {
  function ScreenSpacePosition() {
    _classCallCheck(this, ScreenSpacePosition);

    this.tmp_vec = new THREE.Vector2();
  }

  _createClass(ScreenSpacePosition, [{
    key: "get_pos_NDC",
    value: function get_pos_NDC(position) {
      return this.tmp_vec.set(position.x, position.y);
    }
  }]);

  return ScreenSpacePosition;
}();

exports.default = ScreenSpacePosition;
},{}],"zIq8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WorldSpacePosition = /*#__PURE__*/function () {
  function WorldSpacePosition() {
    _classCallCheck(this, WorldSpacePosition);

    this.tmp_vec3 = new THREE.Vector3();
    this.tmp_vec2 = new THREE.Vector2();
  }

  _createClass(WorldSpacePosition, [{
    key: "get_pos_NDC",
    value: function get_pos_NDC(position) {
      this.tmp_vec3.copy(position);
      this.tmp_vec3.project(_CameraManager.default.current);
      return this.tmp_vec2.set(this.tmp_vec3.x, this.tmp_vec3.y);
    }
  }]);

  return WorldSpacePosition;
}();

exports.default = WorldSpacePosition;
},{"/CameraManager":"XMgG"}],"ZBbQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UIElementState = /*#__PURE__*/function () {
  function UIElementState() {
    _classCallCheck(this, UIElementState);
  }

  _createClass(UIElementState, [{
    key: "update",
    value: function update(ui_element, normalized_mouse_position) {}
  }, {
    key: "on_enter",
    value: function on_enter(ui_element) {}
  }, {
    key: "on_exit",
    value: function on_exit(ui_element) {}
  }]);

  return UIElementState;
}();

exports.default = UIElementState;
},{}],"XKzP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UIElementState2 = _interopRequireDefault(require("/ui/ui_element_state/UIElementState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnIdle = /*#__PURE__*/function (_UIElementState) {
  _inherits(OnIdle, _UIElementState);

  var _super = _createSuper(OnIdle);

  function OnIdle() {
    _classCallCheck(this, OnIdle);

    return _super.call(this);
  }

  _createClass(OnIdle, [{
    key: "update",
    value: function update(ui_element, normalized_mouse_position) {
      if (ui_element.is_mouse_over(normalized_mouse_position)) {
        ui_element.set_state(ui_element._on_enter_state);
      }
    }
  }]);

  return OnIdle;
}(_UIElementState2.default);

exports.default = OnIdle;
},{"/ui/ui_element_state/UIElementState":"ZBbQ"}],"Ow46":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UIElementState2 = _interopRequireDefault(require("/ui/ui_element_state/UIElementState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnMouseEnter = /*#__PURE__*/function (_UIElementState) {
  _inherits(OnMouseEnter, _UIElementState);

  var _super = _createSuper(OnMouseEnter);

  function OnMouseEnter() {
    _classCallCheck(this, OnMouseEnter);

    return _super.call(this);
  }

  _createClass(OnMouseEnter, [{
    key: "on_enter",
    value: function on_enter(ui_element) {
      ui_element.on_mouse_enter();
    }
  }, {
    key: "update",
    value: function update(ui_element, normalized_mouse_position) {
      if (ui_element.is_mouse_over(normalized_mouse_position)) {
        ui_element.set_state(ui_element._on_hover_state);
      } else {
        ui_element.set_state(ui_element._on_exit_state);
      }
    }
  }]);

  return OnMouseEnter;
}(_UIElementState2.default);

exports.default = OnMouseEnter;
},{"/ui/ui_element_state/UIElementState":"ZBbQ"}],"Eg4K":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UIElementState2 = _interopRequireDefault(require("/ui/ui_element_state/UIElementState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnMouseExit = /*#__PURE__*/function (_UIElementState) {
  _inherits(OnMouseExit, _UIElementState);

  var _super = _createSuper(OnMouseExit);

  function OnMouseExit() {
    _classCallCheck(this, OnMouseExit);

    return _super.call(this);
  }

  _createClass(OnMouseExit, [{
    key: "on_enter",
    value: function on_enter(ui_element) {
      ui_element.on_mouse_exit();
      ui_element.set_state(ui_element._on_idle_state);
    }
  }]);

  return OnMouseExit;
}(_UIElementState2.default);

exports.default = OnMouseExit;
},{"/ui/ui_element_state/UIElementState":"ZBbQ"}],"SPP6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UIElementState2 = _interopRequireDefault(require("/ui/ui_element_state/UIElementState"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OnMouseHover = /*#__PURE__*/function (_UIElementState) {
  _inherits(OnMouseHover, _UIElementState);

  var _super = _createSuper(OnMouseHover);

  function OnMouseHover() {
    _classCallCheck(this, OnMouseHover);

    return _super.call(this);
  }

  _createClass(OnMouseHover, [{
    key: "on_enter",
    value: function on_enter(ui_element) {
      this.__trigger_on_hover(ui_element);
    }
  }, {
    key: "update",
    value: function update(ui_element, normalized_mouse_position) {
      if (ui_element.is_mouse_over(normalized_mouse_position)) {
        this.__trigger_on_hover(ui_element);
      } else {
        ui_element.set_state(ui_element._on_exit_state);
      }
    }
  }, {
    key: "__trigger_on_hover",
    value: function __trigger_on_hover(ui_element) {
      ui_element.on_mouse_hover();
    }
  }]);

  return OnMouseHover;
}(_UIElementState2.default);

exports.default = OnMouseHover;
},{"/ui/ui_element_state/UIElementState":"ZBbQ"}],"IBEu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UI = _interopRequireDefault(require("/UI"));

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _Screen = _interopRequireDefault(require("/Screen"));

var _UIElementMaterial = _interopRequireDefault(require("/materials/UIElementMaterial"));

var _ss_texture_frag = _interopRequireDefault(require("/shaders/ui/ss_texture_frag"));

var _ss_texture_vert = _interopRequireDefault(require("/shaders/ui/ss_texture_vert"));

var _ScreenSpacePosition = _interopRequireDefault(require("/ui/ui_element_position/ScreenSpacePosition"));

var _WorldSpacePosition = _interopRequireDefault(require("/ui/ui_element_position/WorldSpacePosition"));

var _OnIdle = _interopRequireDefault(require("/ui/ui_element_state/OnIdle"));

var _OnMouseEnter = _interopRequireDefault(require("/ui/ui_element_state/OnMouseEnter"));

var _OnMouseExit = _interopRequireDefault(require("/ui/ui_element_state/OnMouseExit"));

var _OnMouseHover = _interopRequireDefault(require("/ui/ui_element_state/OnMouseHover"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var UIElement = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(UIElement, _THREE$Mesh);

  var _super = _createSuper(UIElement);

  function UIElement(vert, frag) {
    var _this;

    _classCallCheck(this, UIElement);

    _this = _super.call(this, new THREE.PlaneGeometry(1, 1), new _UIElementMaterial.default());
    _this.is_clickable = false;
    _this.position_strategy = new _WorldSpacePosition.default();
    _this.current_state = new _OnIdle.default();
    _this._position = new THREE.Vector3();
    _this._on_idle_state = new _OnIdle.default();
    _this._on_enter_state = new _OnMouseEnter.default();
    _this._on_exit_state = new _OnMouseExit.default();
    _this._on_hover_state = new _OnMouseHover.default();
    _this.on_enter = undefined;
    _this.on_exit = undefined;
    _this.on_hover = undefined;
    _this.mouse_pos_tmp = new THREE.Vector2();
    _this.cached_NDC_position = new THREE.Vector2();
    _this.screen_pos_tmp = new THREE.Vector2();
    _this.texture_size = new THREE.Vector2(1, 1);
    _this.frustumCulled = false;
    _this.matrixAutoUpdate = false;
    _this.renderOrder = 0;
    _this.size = 1;
    _this.pixel_offset = new THREE.Vector2();
    return _this;
  }

  _createClass(UIElement, [{
    key: "set_render_order",
    value: function set_render_order(value) {
      this.renderOrder = value;
    }
  }, {
    key: "set_pixel_offset",
    value: function set_pixel_offset(offset) {
      this.pixel_offset.copy(offset);

      this.material.uniforms._PixelOffset.value.copy(offset);
    }
  }, {
    key: "set_state",
    value: function set_state(new_state) {
      this.current_state.on_exit(this);
      this.current_state = new_state;
      this.current_state.on_enter(this);
    }
  }, {
    key: "clear_state",
    value: function clear_state() {
      this.visible = false;
    }
  }, {
    key: "set_world_space_coordinate_system",
    value: function set_world_space_coordinate_system() {
      this.position_strategy = new _WorldSpacePosition.default();
    }
  }, {
    key: "set_screen_space_coordinate_system",
    value: function set_screen_space_coordinate_system() {
      this.position_strategy = new _ScreenSpacePosition.default();
    }
  }, {
    key: "set_texture",
    value: function set_texture(texture) {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      this.texture_size.set(texture.image.width, texture.image.height);
      this.material.uniforms._MainTex.value = texture;
      this.get_size(this.material.uniforms._TextureSize.value);
      this.visible = true;
    }
  }, {
    key: "update_state",
    value: function update_state(normalized_mouse_pos) {
      this.material.uniforms._ScreenSize.value.set(_Screen.default.width, _Screen.default.height);

      this.get_size(this.material.uniforms._TextureSize.value);
      this.cached_NDC_position.copy(this.position_strategy.get_pos_NDC(this.position));

      this.material.uniforms._NDC.value.copy(this.position);

      this.current_state.update(this, normalized_mouse_pos);
    }
  }, {
    key: "is_mouse_over",
    value: function is_mouse_over(normalized_mouse_pos) {
      this.screen_pos_tmp.copy(this.cached_NDC_position);
      this.to_screen_position(this.screen_pos_tmp);
      this.screen_pos_tmp.x += this.pixel_offset.x;
      this.screen_pos_tmp.y += this.pixel_offset.y;
      var rect = new THREE.Box2().setFromCenterAndSize(this.screen_pos_tmp, this.get_size());
      this.mouse_pos_tmp.copy(normalized_mouse_pos);
      this.to_screen_position(this.mouse_pos_tmp);
      return rect.containsPoint(this.mouse_pos_tmp);
    }
  }, {
    key: "to_screen_position",
    value: function to_screen_position(projected_pos) {
      projected_pos.x = (projected_pos.x * 0.5 + 0.5) * _Screen.default.width + this.pixel_offset.x;
      projected_pos.y = (projected_pos.y * 0.5 + 0.5) * _Screen.default.height + this.pixel_offset.y;
    }
  }, {
    key: "get_screen_space_position",
    value: function get_screen_space_position() {
      var pos = this.cached_NDC_position.clone();
      this.to_screen_position(pos);
      return pos;
    }
  }, {
    key: "set_screen_space_position",
    value: function set_screen_space_position(screen_pos) {
      this.position.x = screen_pos.x / _Screen.default.width * 2 - 1;
      this.position.y = screen_pos.y / _Screen.default.height * 2 - 1;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.material.uniforms._MainTex.value) {
        this.material.uniforms._MainTex.value.dispose();
      }

      _Screen.default.remove_screen_material(this.material);

      this.geometry.dispose();
      this.material.dispose();
    }
  }, {
    key: "get_size",
    value: function get_size(vector2) {
      if (vector2) {
        return vector2.copy(this.texture_size).multiplyScalar(this.size / _Screen.default.dpr);
      } else {
        return new THREE.Vector2().copy(this.texture_size).multiplyScalar(this.size / _Screen.default.dpr);
      }
    }
  }, {
    key: "on_mouse_enter",
    value: function on_mouse_enter() {}
  }, {
    key: "on_mouse_exit",
    value: function on_mouse_exit() {}
  }, {
    key: "on_mouse_hover",
    value: function on_mouse_hover() {}
  }, {
    key: "pivot_point",
    get: function get() {
      return this.material.uniforms._PivotPoint.value;
    }
  }, {
    key: "position",
    get: function get() {
      return this._position;
    }
  }, {
    key: "use_depth",
    set: function set(boolean) {
      this.material.depthTest = boolean;
    }
  }, {
    key: "depth_offset",
    set: function set(value) {
      this.material.uniforms._DepthOffset.value = value;
    }
  }]);

  return UIElement;
}(THREE.Mesh);

exports.default = UIElement;
},{"/UI":"yntx","/CameraManager":"XMgG","/Screen":"JIgx","/materials/UIElementMaterial":"F8cc","/shaders/ui/ss_texture_frag":"HZsS","/shaders/ui/ss_texture_vert":"Spsq","/ui/ui_element_position/ScreenSpacePosition":"GMfh","/ui/ui_element_position/WorldSpacePosition":"zIq8","/ui/ui_element_state/OnIdle":"XKzP","/ui/ui_element_state/OnMouseEnter":"Ow46","/ui/ui_element_state/OnMouseExit":"Eg4K","/ui/ui_element_state/OnMouseHover":"SPP6"}],"uwzL":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform float _Thickness;\n\nattribute vec3 next_position;\nattribute vec3 previous_position;\nattribute float orientation;\nattribute float coverage;\n\nvarying float line_coverage;\nvarying float uv_u;\n\nvec3 w_space_normal(vec3 from, vec3 to)\n{\n  vec3 w_from = (modelMatrix * vec4(from, 1.0)).xyz;\n  vec3 w_to   = (modelMatrix * vec4(to, 1.0)).xyz;\n\n  vec3 z = normalize(w_to - w_from);\n  return normalize(cross(z , normalize(cameraPosition - w_from)));\n\n}\n\nvoid main()\n{\n\n  mat4 VP = projectionMatrix * viewMatrix;\n\n  vec3 pos = position;\n  vec3 normal = w_space_normal(next_position ,previous_position);\n  pos = (modelMatrix * vec4(pos, 1.0)).xyz;\n  pos += normal * (_Thickness * 0.5) * orientation;\n\n  gl_Position = VP * vec4(pos, 1.0);\n\n  line_coverage = coverage;\n  uv_u = orientation * 0.5 + 0.5;\n\n}";
},{}],"f148":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nuniform float _Length;\nuniform float _ElapsedTime;\nuniform float _Thickness;\nuniform vec3  _Color;\n\nvarying float line_coverage;\nvarying float uv_u;\n\nfloat aastep(float threshold, float value) {\n  #ifdef GL_OES_standard_derivatives\n    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;\n    return smoothstep(threshold-afwidth, threshold+afwidth, value);\n  #else\n    return step(threshold, value);\n  #endif  \n}\n\nvoid main()\n{\n\n    // float y = fract(line_coverage /_Thickness - _TrueElapsedTime) ;\n\n    // vec2 uv = vec2(uv_u, y);\n\n   \n    // vec4 col = texture2D(_ArrowsTex,uv);\n    // col.rgb *= _ForwardColor;\n    // col.a = aastep(0.5, col.a);\n    // gl_FragColor = col;\n    float u = (1.0 - abs(uv_u * 2.0 - 1.0));\n    float diffuse = dot(vec2(u, u), vec2(0.0, 1.0)) * 0.5+0.5;\n    gl_FragColor = vec4(_Color * diffuse, 1.0);\n\n}";
},{}],"BhSJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basic_line_vert = _interopRequireDefault(require("/shaders/basic_line/basic_line_vert"));

var _basic_line_frag = _interopRequireDefault(require("/shaders/basic_line/basic_line_frag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Line = /*#__PURE__*/function (_THREE$Mesh) {
  _inherits(Line, _THREE$Mesh);

  var _super = _createSuper(Line);

  function Line(points) {
    var _this;

    _classCallCheck(this, Line);

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3));
    geometry.setAttribute('next_position', new THREE.BufferAttribute(new Float32Array([]), 3));
    geometry.setAttribute('previous_position', new THREE.BufferAttribute(new Float32Array([]), 3));
    geometry.setAttribute('orientation', new THREE.BufferAttribute(new Float32Array([]), 1));
    geometry.setAttribute('coverage', new THREE.BufferAttribute(new Float32Array([]), 1));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        _Thickness: {
          value: 0.2
        },
        _Length: {
          value: 0
        },
        _ElapsedTime: {
          value: 0
        },
        _Color: {
          value: new THREE.Color("#FF0000")
        }
      },
      vertexShader: _basic_line_vert.default,
      fragmentShader: _basic_line_frag.default,
      transparent: true,
      depthWrite: false,
      extensions: {
        derivatives: true
      }
    });
    _this = _super.call(this, geometry, material);
    if (points) _this.setup(points);
    return _this;
  }

  _createClass(Line, [{
    key: "setup",
    value: function setup(points) {
      var vertices = [];
      var next_position = [];
      var previous_position = [];
      var orientation = [];
      var coverage = [];
      var accumulated_length = 0;

      for (var i = 0; i < points.length; i++) {
        vertices.push(points[i].x);
        vertices.push(points[i].y);
        vertices.push(points[i].z);
        orientation.push(1);
        vertices.push(points[i].x);
        vertices.push(points[i].y);
        vertices.push(points[i].z);
        orientation.push(-1);

        var next_point = this.__get_next_position(points, i);

        next_position.push(next_point.x);
        next_position.push(next_point.y);
        next_position.push(next_point.z);
        next_position.push(next_point.x);
        next_position.push(next_point.y);
        next_position.push(next_point.z);

        var previous_point = this.__get_previous_position(points, i);

        previous_position.push(previous_point.x);
        previous_position.push(previous_point.y);
        previous_position.push(previous_point.z);
        previous_position.push(previous_point.x);
        previous_position.push(previous_point.y);
        previous_position.push(previous_point.z);
        coverage.push(accumulated_length);
        coverage.push(accumulated_length);
        if (i < points.length - 1) accumulated_length += points[i].distanceTo(next_point);
      }

      var vertexList = new Float32Array(vertices);
      var nextPositionList = new Float32Array(next_position);
      var previousPositionList = new Float32Array(previous_position);
      var orientationList = new Float32Array(orientation);
      var coverageList = new Float32Array(coverage);
      var indices = [];

      for (var _i = 0; _i < (vertexList.length / 3 - 2) / 2; _i++) {
        var index = _i * 2 + 1;
        indices.push(index);
        indices.push(index + 1);
        indices.push(index - 1);
        indices.push(index);
        indices.push(index + 2);
        indices.push(index + 1);
      }

      this.geometry.setIndex(indices);
      this.geometry.getAttribute('position').copy(new THREE.BufferAttribute(vertexList, 3));
      this.geometry.getAttribute('next_position').copy(new THREE.BufferAttribute(nextPositionList, 3));
      this.geometry.getAttribute('previous_position').copy(new THREE.BufferAttribute(previousPositionList, 3));
      this.geometry.getAttribute('orientation').copy(new THREE.BufferAttribute(orientationList, 1));
      this.geometry.getAttribute('coverage').copy(new THREE.BufferAttribute(coverageList, 1));
      this.geometry.getAttribute('position').needsUpdate = true;
      this.geometry.getAttribute('next_position').needsUpdate = true;
      this.geometry.getAttribute('previous_position').needsUpdate = true;
      this.geometry.getAttribute('orientation').needsUpdate = true;
      this.geometry.getAttribute('coverage').needsUpdate = true;
      this.material.uniforms._Length.value = accumulated_length;
      this._length = accumulated_length;
    }
  }, {
    key: "__get_previous_position",
    value: function __get_previous_position(points, i) {
      if (i === 0) {
        return points[1].clone().sub(points[0]).multiplyScalar(-1).add(points[0]);
      } else {
        return points[i - 1];
      }
    }
  }, {
    key: "__get_next_position",
    value: function __get_next_position(points, i) {
      if (i === points.length - 1) {
        return points[points.length - 2].clone().sub(points[points.length - 1]).multiplyScalar(-1).add(points[points.length - 1]);
      } else {
        return points[i + 1];
      }
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "distance",
    value: function distance() {
      return this.accumulated_length;
    }
  }, {
    key: "total_length",
    value: function total_length() {
      return this.accumulated_length;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.geometry.dispose();
      this.material.dispose();
      if (this.parent) this.parent.remove(this);
    }
  }, {
    key: "copy_color",
    value: function copy_color(col) {
      this.material.uniforms._Color.value.copy(col);
    }
  }, {
    key: "thickness",
    set: function set(value) {
      this.material.uniforms._Thickness.value = value;
    }
  }, {
    key: "color",
    set: function set(col) {
      this.material.uniforms._Color.value.set(col);
    }
  }]);

  return Line;
}(THREE.Mesh);

exports.default = Line;
},{"/shaders/basic_line/basic_line_vert":"uwzL","/shaders/basic_line/basic_line_frag":"f148"}],"m3BF":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Grid = _interopRequireDefault(require("/components/Grid"));

var _UIElement = _interopRequireDefault(require("/components/UIElement"));

var _Line = _interopRequireDefault(require("/components/Line"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Grid: _Grid.default,
  Line: _Line.default,
  UIElement: _UIElement.default
};
exports.default = _default;
},{"/components/Grid":"rXwc","/components/UIElement":"IBEu","/components/Line":"BhSJ"}],"LsO8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CanvasDrawer = /*#__PURE__*/function () {
  function CanvasDrawer(uses_dynamic_font) {
    _classCallCheck(this, CanvasDrawer);

    this.uses_dynamic_font = uses_dynamic_font;
    this.__textHeight = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  _createClass(CanvasDrawer, [{
    key: "getFontHeight",
    value: function getFontHeight() {
      var fontStyle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Arial";

      if (this.__textHeight == null || this.uses_dynamic_font) {
        var body = document.getElementsByTagName('body')[0];
        var dummy = document.createElement('div');
        var dummyText = document.createTextNode('MÉqgOLAKTAL');
        dummy.appendChild(dummyText);
        dummy.setAttribute('style', "font:".concat(fontStyle, ";position:absolute;top:0;left:0"));
        body.appendChild(dummy);
        this.__textHeight = dummy.offsetHeight;
        body.removeChild(dummy);
      }

      return this.__textHeight;
    }
  }, {
    key: "get_text_size",
    value: function get_text_size(text) {
      var font = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "24px Arial";
      var size = new THREE.Vector2();
      this.ctx.font = font;
      size.x = Math.ceil(this.ctx.measureText(text).width) * window.devicePixelRatio;
      size.y = Math.ceil(this.getFontHeight(font)) * window.devicePixelRatio;
      return size;
    }
  }, {
    key: "draw_canvas",
    value: function draw_canvas(text) {
      var ctxOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      ctxOptions.font = ctxOptions.font || '24px Arial';
      ctxOptions.font_color = ctxOptions.font_color || '#000000';

      this.__draw(text, ctxOptions, this.canvas, this.ctx);

      return this.canvas;
    }
  }, {
    key: "draw_on_texture",
    value: function draw_on_texture(text, ctxOptions) {
      var canvas = this.draw_canvas(text, ctxOptions);
      var canvas_texture = new THREE.CanvasTexture(canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter);
      canvas_texture.generateMipMaps = false;
      canvas_texture.needsUpdate = true;
      return canvas_texture;
    }
  }, {
    key: "__draw",
    value: function __draw(text, ctxOptions) {}
  }, {
    key: "roundRect",
    value: function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == 'undefined') {
        stroke = true;
      }

      if (typeof radius === 'undefined') {
        radius = 5;
      }

      if (typeof radius === 'number') {
        radius = {
          tl: radius,
          tr: radius,
          br: radius,
          bl: radius
        };
      } else {
        var defaultRadius = {
          tl: 0,
          tr: 0,
          br: 0,
          bl: 0
        };

        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }

      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();

      if (fill) {
        ctx.fill();
      }

      if (stroke) {
        ctx.stroke();
      }
    }
  }]);

  return CanvasDrawer;
}();

exports.default = CanvasDrawer;
},{}],"xAef":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AxisHelper = /*#__PURE__*/function (_THREE$Object3D) {
  _inherits(AxisHelper, _THREE$Object3D);

  var _super = _createSuper(AxisHelper);

  function AxisHelper() {
    var _this;

    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;

    _classCallCheck(this, AxisHelper);

    _this = _super.call(this);
    var blueAxisMat = new THREE.LineBasicMaterial({
      color: 0x4444ff,
      depthFunc: THREE.AlwaysDepth
    });
    var blueAxisGeo = new THREE.Geometry();
    blueAxisGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    blueAxisGeo.vertices.push(new THREE.Vector3(0, 0, 1000));
    var blueAxisLine = new THREE.Line(blueAxisGeo, blueAxisMat);
    blueAxisLine.renderOrder = 50000;
    var greenAxisMat = new THREE.LineBasicMaterial({
      color: 0x44ff44,
      depthFunc: THREE.AlwaysDepth
    });
    var greenAxisGeo = new THREE.Geometry();
    greenAxisGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    greenAxisGeo.vertices.push(new THREE.Vector3(0, 1000, 0));
    var greenAxisLine = new THREE.Line(greenAxisGeo, greenAxisMat);
    greenAxisLine.renderOrder = 50000;
    var redAxisMat = new THREE.LineBasicMaterial({
      linewidth: 100,
      color: 0xff4444,
      depthFunc: THREE.AlwaysDepth
    });
    var redAxisGeo = new THREE.Geometry();
    redAxisGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    redAxisGeo.vertices.push(new THREE.Vector3(1000, 0, 0));
    var redAxisLine = new THREE.Line(redAxisGeo, redAxisMat);
    redAxisLine.renderOrder = 50000;
    _this.renderOrder = 100000;

    _this.add(blueAxisLine);

    _this.add(greenAxisLine);

    _this.add(redAxisLine);

    _this.scale.set(scale, scale, scale);

    return _this;
  }

  _createClass(AxisHelper, [{
    key: "update",
    value: function update() {}
  }, {
    key: "dispose",
    value: function dispose() {}
  }]);

  return AxisHelper;
}(THREE.Object3D);

exports.default = AxisHelper;
},{}],"wyL4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Mesh2 = _interopRequireDefault(require("/Mesh"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Cube = /*#__PURE__*/function (_Mesh) {
  _inherits(Cube, _Mesh);

  var _super = _createSuper(Cube);

  function Cube(size, segments, color) {
    _classCallCheck(this, Cube);

    size = size || new THREE.Vector3(1, 1, 1);
    segments = segments || new THREE.Vector3(1, 1, 1);
    color = color || 0xff0000;
    var geometry = new THREE.BoxGeometry(size.x, size.y, size.z, segments.x, segments.y, segments.z);
    var material = new THREE.MeshBasicMaterial({
      color: color
    });
    return _super.call(this, geometry, material);
  }

  return Cube;
}(_Mesh2.default);

exports.default = Cube;
},{"/Mesh":"ezmQ"}],"J9UP":[function(require,module,exports) {
"use strict";

var _AxisHelper = _interopRequireDefault(require("/components/AxisHelper"));

var _basic_color_vert = _interopRequireDefault(require("/shaders/basic_color/basic_color_vert"));

var _basic_color_frag = _interopRequireDefault(require("/shaders/basic_color/basic_color_frag"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _Graphics = _interopRequireDefault(require("/Graphics"));

var _Cube = _interopRequireDefault(require("/primitives/Cube"));

var _Sphere = _interopRequireDefault(require("/primitives/Sphere"));

var _Arrow = _interopRequireDefault(require("/primitives/Arrow"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Debug = /*#__PURE__*/function () {
  function Debug() {
    _classCallCheck(this, Debug);

    this.Vector3_one = new THREE.Vector3(1, 1, 1);
    this.Vector3_zero = new THREE.Vector3(0, 0, 0);
    this.canvas_renderer = undefined;
    this.rt_debug = undefined;
  }

  _createClass(Debug, [{
    key: "init",
    value: function init(webgl) {
      this.webgl = webgl;
      this.ctx = undefined; // var cln = webgl.dom.cloneNode(false);
      // cln.id = "canvas_debug";
      // $(cln).css("position", "absolute");
      // webgl.dom.parentElement.insertBefore(cln, webgl.dom);
      // this.ctx = cln.getContext('2d');
      // this.ctx.clearRect(0, 0, cln.width, cln.height);
      // this.ctx.fillStyle =  "rgba(255, 0, 0, 1)";
    }
  }, {
    key: "draw_arrow",
    value: function draw_arrow(origin, dir) {
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xff0000;
      var arrow = new _Arrow.default(color, dir.length(), dir.clone().normalize());
      arrow.position.copy(origin);

      _SceneManager.default.current.add(arrow);

      return arrow;
    }
  }, {
    key: "draw_axis",
    value: function draw_axis() {
      var axis = new _AxisHelper.default();

      _SceneManager.default.current.add(axis);

      return axis;
    }
  }, {
    key: "set_debug_RT",
    value: function set_debug_RT(RT) {
      this.rt_debug = RT;
    }
  }, {
    key: "draw_rectangle",
    value: function draw_rectangle(position_2d, width, height, color) {
      width = width || 100;
      height = height || 100;
      this.ctx.fillStyle = color || "rgba(255, 0, 0, 1)";
      this.ctx.fillRect(position_2d.x - width / 2, this.ctx.canvas.height - position_2d.y - height / 2, width, height);
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this.ctx) this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
  }, {
    key: "draw_line_2D",
    value: function draw_line_2D(from, to, color) {
      this.ctx.strokeStyle = color || "rgba(255, 0, 0, 1)";
      this.ctx.beginPath();
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      this.ctx.closePath();
      this.ctx.stroke();
    }
  }, {
    key: "draw_line",
    value: function draw_line(points) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xff0000;
      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var geometry = new THREE.BufferGeometry().setFromPoints(points);
      var line = new THREE.Line(geometry, material);
      line.frustumCulled = false;

      _SceneManager.default.current.add(line);

      return line;
    }
  }, {
    key: "draw_cube",
    value: function draw_cube(pos, size, color) {
      size = size || 1;
      color = color || 0xff0000;
      pos = pos || new THREE.Vector3();
      var cube = new _Cube.default(new THREE.Vector3(size, size, size), undefined, color);
      cube.position.copy(pos);

      _SceneManager.default.current.add(cube);

      return cube;
    }
  }, {
    key: "draw_oriented_cube",
    value: function draw_oriented_cube(from, to) {
      var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#FF0000";
      var depth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;
      var size = from.distanceTo(to);
      var cube = new _Cube.default(new THREE.Vector3(depth, height, size), undefined, color);
      var center = to.clone().sub(from).multiplyScalar(0.5);
      var forward_dir = center.clone().normalize();
      center.add(from);
      cube.position.copy(center);
      var up = new THREE.Vector3(0, 1, 0);
      var forward = forward_dir.clone();
      var right = forward.clone().cross(up); // cube.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,forward));

      cube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), forward_dir);

      _SceneManager.default.current.add(cube);

      return cube;
    }
  }, {
    key: "draw_plane",
    value: function draw_plane(width, height, color) {
      var geometry = new THREE.PlaneGeometry(width, height);
      var material = new THREE.ShaderMaterial({
        uniforms: {
          _Color: {
            value: new THREE.Vector4(0, 1, 0, 0.2)
          }
        },
        vertexShader: _basic_color_vert.default,
        fragmentShader: _basic_color_frag.default,
        transparent: true,
        depthWrite: false
      });
      var plane = new THREE.Mesh(geometry, material);
      plane.renderOrder = -10000;

      _SceneManager.default.current.add(plane);

      return plane;
    }
  }, {
    key: "draw_empty_cube",
    value: function draw_empty_cube(pos, size, color) {
      size = size || 1;
      color = color || 0xff0000;
      var box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(size, size, size));
      var helper = new THREE.Box3Helper(box, color);
      helper.position.copy(pos || new THREE.Vector3());
      return helper;
    }
  }, {
    key: "draw_sphere",
    value: function draw_sphere(pos, size, color) {
      size = size || 1;
      color = color || 0xff0000;
      pos = pos || new THREE.Vector3();
      var sphere = new _Sphere.default(size, color);
      sphere.position.copy(pos);

      _SceneManager.default.current.add(sphere);

      return sphere;
    }
  }, {
    key: "draw_point_array",
    value: function draw_point_array(input_points) {
      var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xff0000;
      var catmull = new THREE.CatmullRomCurve3(input_points, open);
      catmull.updateArcLengths();
      var points = catmull.getSpacedPoints(200);
      var line_helper = this.draw_line(points, 0x00ff00); // line_helper.position.y = 1.5;

      return line_helper;
    }
  }, {
    key: "draw_sphere_helper",
    value: function draw_sphere_helper(sphere, color) {
      color = color || 0xff0000;
      var geometry = new THREE.SphereGeometry(sphere.radius, 32, 32);
      var material = new THREE.MeshBasicMaterial({
        color: color
      });
      var sphere_mesh = new THREE.Mesh(geometry, material);
      sphere_mesh.position.copy(sphere.center);

      _SceneManager.default.current.add(sphere_mesh);

      return sphere_mesh;
    }
  }, {
    key: "draw_math_sphere",
    value: function draw_math_sphere(sphere) {
      var geometry = new THREE.SphereGeometry(sphere.radius, 32, 32);
      var material = new THREE.ShaderMaterial({
        uniforms: {
          _Color: {
            value: new THREE.Vector4(1, 0, 0, 0.2)
          }
        },
        vertexShader: _basic_color_vert.default,
        fragmentShader: _basic_color_frag.default,
        transparent: true
      }); // var material = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent = true} );

      var sphere1 = new THREE.Mesh(geometry, material);
      sphere1.position.copy(sphere.center);

      _SceneManager.default.current.add(sphere1);
    }
  }, {
    key: "draw_bounding_box",
    value: function draw_bounding_box(bb) {
      var helper = new THREE.Box3Helper(bb, 0xffff00);

      _SceneManager.default.current.add(helper);
    }
  }, {
    key: "draw_curve",
    value: function draw_curve(curve, options) {
      var offset = new THREE.Vector3(0, 0, 0);
      if (options) offset.y = options.offset || 0;

      for (var i = 0; i < curve.length - 1; i++) {
        this.draw_line(curve[i].clone().add(offset), curve[i + 1].clone().add(offset));
      }
    }
  }]);

  return Debug;
}();

var DEBUG = new Debug();
module.exports = DEBUG;
},{"/components/AxisHelper":"xAef","/shaders/basic_color/basic_color_vert":"QfnR","/shaders/basic_color/basic_color_frag":"LSxb","/SceneManager":"qvMM","/Graphics":"xMH9","/primitives/Cube":"wyL4","/primitives/Sphere":"sPjl","/primitives/Arrow":"E21w"}],"oP7G":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvarying vec3 v_normal;\n\nvoid main()\n{\n    gl_FragColor = vec4(v_normal * 0.5 + vec3(0.5), 1.0);\n}\n";
},{}],"OGPa":[function(require,module,exports) {
module.exports = "#define GLSLIFY 1\nvarying vec3 v_normal;\nvoid main()\n{\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    v_normal = (modelMatrix * vec4(normal, 0.0)).xyz;\n}\n";
},{}],"yMPJ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _normal = _interopRequireDefault(require("/shaders/normal/normal.frag"));

var _normal2 = _interopRequireDefault(require("/shaders/normal/normal.vert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var NormalMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {
  _inherits(NormalMaterial, _THREE$ShaderMaterial);

  var _super = _createSuper(NormalMaterial);

  function NormalMaterial() {
    _classCallCheck(this, NormalMaterial);

    return _super.call(this, {
      uniforms: {},
      vertexShader: _normal2.default,
      fragmentShader: _normal.default
    });
  }

  return NormalMaterial;
}(THREE.ShaderMaterial);

exports.default = NormalMaterial;
},{"/shaders/normal/normal.frag":"oP7G","/shaders/normal/normal.vert":"OGPa"}],"M0uM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _Screen = _interopRequireDefault(require("/Screen"));

var _BaseRender2 = _interopRequireDefault(require("/render_mode/BaseRender"));

var _Graphics = _interopRequireDefault(require("/Graphics"));

var _NormalMaterial = _interopRequireDefault(require("/materials/NormalMaterial"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DebugNormalsRender = /*#__PURE__*/function (_BaseRender) {
  _inherits(DebugNormalsRender, _BaseRender);

  var _super = _createSuper(DebugNormalsRender);

  function DebugNormalsRender() {
    _classCallCheck(this, DebugNormalsRender);

    return _super.call(this);
  }

  _createClass(DebugNormalsRender, [{
    key: "render",
    value: function render() {
      _Graphics.default.clear(undefined, _CameraManager.default.current, true, true);

      _Graphics.default.render(_SceneManager.default.current, _CameraManager.default.current, undefined, new _NormalMaterial.default());
    }
  }]);

  return DebugNormalsRender;
}(_BaseRender2.default);

exports.default = DebugNormalsRender;
},{"/CameraManager":"XMgG","/SceneManager":"qvMM","/Screen":"JIgx","/render_mode/BaseRender":"gDca","/Graphics":"xMH9","/materials/NormalMaterial":"yMPJ"}],"ZeWG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EasingFunctions = /*#__PURE__*/function () {
  function EasingFunctions() {
    _classCallCheck(this, EasingFunctions);
  }

  _createClass(EasingFunctions, null, [{
    key: "ease_out_sine",
    value: function ease_out_sine(x) {
      return Math.sin(x * 3.14 / 2);
    }
  }, {
    key: "ease_in_out_cubic",
    value: function ease_in_out_cubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
  }, {
    key: "ease_out_cubic",
    value: function ease_out_cubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }
  }, {
    key: "ease_in_out_quint",
    value: function ease_in_out_quint(x) {
      return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
  }, {
    key: "ease_out_quint",
    value: function ease_out_quint(x) {
      return 1 - Math.pow(1 - x, 5);
    }
  }, {
    key: "ease_in_out_circ",
    value: function ease_in_out_circ(x) {
      return x < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
  }, {
    key: "ease_out_quad",
    value: function ease_out_quad(x) {
      return 1 - (1 - x) * (1 - x);
    }
  }]);

  return EasingFunctions;
}();

exports.default = EasingFunctions;
},{}],"pJqg":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventManager = /*#__PURE__*/function () {
  function EventManager() {
    _classCallCheck(this, EventManager);

    this.queue = {};
    this.zoom_changed_evt = "zoom_changed";
    this.store_clickd_evt = "store_clicked";
    this.point_selected_evt = "point_selected";
    this.config_changed = "config_changed";
    this.path_substep_completed = "path_substep_completed";
    this.path_completed = "path_completed";
    this.go_to_store_requested_evt = "go_to_store_requested";
    this.resource_loaded_evt = "resource_loaded";
    this.service_clicked_evt = "service_clicked";
    this.unit_pos_updated_evt = "unit_position_updated";
    this.floor_changed_evt = "floor_changed";
    this.on_enter_floor_navigation = "on_enter_floor_navigation";
    this.on_exit_floor_navigation = "on_exit_floor_navigation";
    this.on_enter_floor_selection = "on_enter_floor_selection";
    this.on_exit_floor_selection = "on_exit_floor_selection";
    this.on_enter_outside_navigation = "on_enter_outside_navigation";
    this.on_exit_outside_navigation = "on_exit_outside_navigation";
    this.step_selected_evt = "step_selected";
  }

  _createClass(EventManager, [{
    key: "fire",
    value: function fire(event, payload) {
      var queue = this.queue[event];

      if (queue === undefined) {
        return;
      }

      var i = queue.length;

      while (i--) {
        queue[i](payload);
      }
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      if (typeof this.queue[event] === 'undefined') {
        this.queue[event] = [];
      }

      this.queue[event].push(callback);
    }
  }, {
    key: "fire_zoom_changed",
    value: function fire_zoom_changed(zoom) {
      this.fire(this.zoom_changed_evt, zoom);
    }
  }, {
    key: "fire_store_selected",
    value: function fire_store_selected(store_id) {
      this.fire(this.store_clickd_evt, store_id);
    }
  }, {
    key: "fire_point_selected",
    value: function fire_point_selected(hit_data) {
      this.fire(this.point_selected_evt, hit_data);
    }
  }, {
    key: "fire_config_changed",
    value: function fire_config_changed() {
      this.fire(this.config_changed);
    }
  }, {
    key: "fire_path_substep_completed",
    value: function fire_path_substep_completed(step_number) {
      this.fire(this.path_substep_completed, step_number);
    }
  }, {
    key: "fire_path_completed",
    value: function fire_path_completed() {
      this.fire(this.path_completed);
    }
  }, {
    key: "fire_step_selected",
    value: function fire_step_selected(step_index) {
      this.fire(this.step_selected_evt, step_index);
    }
  }, {
    key: "fire_go_to_store_requested",
    value: function fire_go_to_store_requested(store_id) {
      this.fire(this.go_to_store_requested_evt, store_id);
    }
  }, {
    key: "fire_resource_loaded",
    value: function fire_resource_loaded(resource) {
      this.fire(this.resource_loaded_evt, resource);
    }
  }, {
    key: "fire_service_clicked",
    value: function fire_service_clicked(service) {
      this.fire(this.service_clicked_evt, service);
    }
  }, {
    key: "fire_unit_position_updated",
    value: function fire_unit_position_updated(unit_data) {
      this.fire(this.unit_pos_updated_evt, unit_data);
    }
  }, {
    key: "fire_floor_switched",
    value: function fire_floor_switched(floor_id) {
      this.fire(this.floor_changed_evt, floor_id);
    }
  }, {
    key: "fire_on_enter_floor_navigation",
    value: function fire_on_enter_floor_navigation(state) {
      this.fire(this.on_enter_floor_navigation, state);
    }
  }, {
    key: "fire_on_exit_floor_navigation",
    value: function fire_on_exit_floor_navigation(state) {
      this.fire(this.on_exit_floor_navigation, state);
    }
  }, {
    key: "fire_on_enter_floor_selection",
    value: function fire_on_enter_floor_selection(state) {
      this.fire(this.on_enter_floor_selection, state);
    }
  }, {
    key: "fire_on_exit_floor_selection",
    value: function fire_on_exit_floor_selection(state) {
      this.fire(this.on_exit_floor_selection, state);
    }
  }, {
    key: "fire_on_enter_outside_navigation",
    value: function fire_on_enter_outside_navigation(state) {
      this.fire(this.on_enter_outside_navigation, state);
    }
  }, {
    key: "fire_on_exit_outside_navigation",
    value: function fire_on_exit_outside_navigation(state) {
      this.fire(this.on_exit_outside_navigation, state);
    }
  }]);

  return EventManager;
}();

var event_manager = new EventManager();
module.exports = event_manager;
},{}],"XAIA":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ImageUtilities = /*#__PURE__*/function () {
  function ImageUtilities() {
    _classCallCheck(this, ImageUtilities);
  }

  _createClass(ImageUtilities, null, [{
    key: "get_image_data",
    value: function get_image_data(image) {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    }
  }, {
    key: "get_pixel",
    value: function get_pixel(imagedata, x, y) {
      var position = (x + imagedata.width * y) * 4;
      var data = imagedata.data;
      return new THREE.Vector4(data[position + 0], data[position + 1], data[position + 2], data[position + 3]);
    }
  }]);

  return ImageUtilities;
}();

exports.default = ImageUtilities;
},{}],"mqLz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AbstractLoader = /*#__PURE__*/function () {
  function AbstractLoader(resource_id, url) {
    _classCallCheck(this, AbstractLoader);

    this.progress = 0;
    this.resource_id = resource_id;
    this.url = url;
    this.has_finished = false;
    this.has_error = false;
    this.error_message = "none";
  }

  _createClass(AbstractLoader, [{
    key: "__update_progress",
    value: function __update_progress(value) {
      this.progress = value;
    }
  }, {
    key: "__loading_ended",
    value: function __loading_ended() {
      this.has_finished = true;
    }
  }, {
    key: "__set_error",
    value: function __set_error(message) {
      this.has_error = true;
      this.error_message = message;
    }
  }, {
    key: "print_error",
    value: function print_error() {
      console.error("Error while loading " + this.resource_id + "\n\t path: " + this.url + "\n\t\t" + this.error_message);
    }
  }, {
    key: "load",
    value: function load(resource_container) {}
  }]);

  return AbstractLoader;
}();

exports.default = AbstractLoader;
},{}],"NvAk":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var JSONLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(JSONLoader, _AbstractLoader);

  var _super = _createSuper(JSONLoader);

  function JSONLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, JSONLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.FileLoader();
    return _this;
  }

  _createClass(JSONLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (data) {
        resource_container.set_resource(ctx.resource_id, JSON.parse(data));

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg + "\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");

        ctx.__loading_ended();
      });
    }
  }]);

  return JSONLoader;
}(_AbstractLoader2.default);

exports.default = JSONLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"c2tY":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelUtilities = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ModelUtilities = /*#__PURE__*/function () {
  function ModelUtilities() {
    _classCallCheck(this, ModelUtilities);
  }

  _createClass(ModelUtilities, [{
    key: "get_mesh",
    value: function get_mesh(scene, result_callback) {
      scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          if (child.geometry instanceof THREE.Geometry) {
            child.geometry = new THREE.BufferGeometry().fromGeometry(child.geometry);
          }

          result_callback(child);
        }
      });
    }
  }, {
    key: "get_geometries",
    value: function get_geometries(scene) {
      var geometries = [];
      this.get_mesh(scene, function (child) {
        geometries.push(child.geometry);
      });
      return geometries;
    }
  }, {
    key: "assign_material",
    value: function assign_material(scene, material, name) {
      scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          // assign to all if no name is given
          if (name === undefined) child.material = material;else {
            // if name is given, assign only to that
            if (child.name === name) {
              child.material = material;
            }
          }
        }
      });
    }
  }, {
    key: "clone_animated_gltf",
    value: function clone_animated_gltf(gltf) {
      var clone = {
        animations: gltf.animations,
        scene: gltf.scene.clone(true)
      };
      var skinnedMeshes = {};
      gltf.scene.traverse(function (node) {
        if (node.isSkinnedMesh) {
          skinnedMeshes[node.name] = node;
        }
      });
      var cloneBones = {};
      var cloneSkinnedMeshes = {};
      clone.scene.traverse(function (node) {
        if (node.isBone) {
          cloneBones[node.name] = node;
        }

        if (node.isSkinnedMesh) {
          cloneSkinnedMeshes[node.name] = node;
        }
      });

      for (var name in skinnedMeshes) {
        var skinnedMesh = skinnedMeshes[name];
        var skeleton = skinnedMesh.skeleton;
        var cloneSkinnedMesh = cloneSkinnedMeshes[name];
        var orderedCloneBones = [];

        for (var i = 0; i < skeleton.bones.length; ++i) {
          var cloneBone = cloneBones[skeleton.bones[i].name];
          orderedCloneBones.push(cloneBone);
        }

        cloneSkinnedMesh.bind(new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses), cloneSkinnedMesh.matrixWorld);
      }

      return clone;
    }
  }, {
    key: "set_shadow_config",
    value: function set_shadow_config(scene, cast, receive) {
      scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = cast;
          child.receiveShadow = receive;
        }
      });
    }
  }, {
    key: "__find_object",
    value: function __find_object(scene, object_name, result_callback) {
      scene.traverse(function (obj) {
        if (obj.name === object_name) result_callback(obj);
      });
    }
  }, {
    key: "get_object",
    value: function get_object(scene, object_name) {
      var object = undefined;
      scene.traverse(function (obj) {
        if (obj.name === object_name) object = obj;
      });
      return object;
    }
  }, {
    key: "get_object_by_type",
    value: function get_object_by_type(scene, object_type) {
      var object = undefined;
      scene.traverse(function (obj) {
        if (obj.constructor.name === object_type) object = obj;
      });
      return object;
    }
  }]);

  return ModelUtilities;
}();

exports.ModelUtilities = ModelUtilities;
var model_utilities = new ModelUtilities();
module.exports = model_utilities;
},{}],"hjkK":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MeshSampler = /*#__PURE__*/function () {
  function MeshSampler() {
    _classCallCheck(this, MeshSampler);
  }

  _createClass(MeshSampler, [{
    key: "sample",
    value: function sample(geometry, sample_count) {
      var face_areas = [];
      var min_area = 99999999;

      for (var i = 0; i < geometry.faces.length; i++) {
        var area = this.get_face_area(geometry.faces[i], geometry.vertices);
        min_area = Math.min(area, min_area);
        face_areas.push(area);
      }

      var normalized_faces_array = this.get_uniform_face_distribution(face_areas, min_area, geometry.faces);
      var selected_faces = this.select_random_faces(normalized_faces_array, sample_count);
      var sampled_data = this.sample_data_from_faces(selected_faces, geometry.vertices);
      return sampled_data;
    }
  }, {
    key: "sample_data_from_faces",
    value: function sample_data_from_faces(faces, vertices) {
      var sampled_points = [];
      var sampled_normals = [];

      for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        var w1 = Math.random();
        var w2 = Math.random();
        sampled_points.push(this.sample_point_in_face(w1, w2, vertices[face.a], vertices[face.b], vertices[face.c]).clone());
        if (sampled_normals && face.normal) sampled_normals.push(face.normal.clone());
      }

      return {
        points: sampled_points,
        normals: sampled_normals
      };
    }
  }, {
    key: "select_random_faces",
    value: function select_random_faces(faces, amount) {
      var selected_faces = [];

      for (var i = 0; i < amount; i++) {
        var random = parseInt(Math.random() * (faces.length - 1));
        var selected_face = faces[random];
        selected_faces.push(selected_face);
      }

      return selected_faces;
    }
  }, {
    key: "get_uniform_face_distribution",
    value: function get_uniform_face_distribution(face_areas, minimum_area, faces) {
      var extended_triangle_indices = [];

      for (var i = 0; i < face_areas.length; i++) {
        face_areas[i] /= minimum_area;
        var repetitions_needed = parseInt(Math.round(face_areas[i]));

        for (var j = 0; j < repetitions_needed; j++) {
          extended_triangle_indices.push(faces[i]);
        }
      }

      return extended_triangle_indices;
    }
  }, {
    key: "get_face_area",
    value: function get_face_area(face, vertices) {
      var v1 = vertices[face.a].clone();
      var v2 = vertices[face.b].clone();
      var v3 = vertices[face.c].clone();
      var vec1 = v2.clone().sub(v1);
      var vec2 = v3.clone().sub(v1);
      return vec1.cross(vec2).length() / 2;
    }
  }, {
    key: "sample_point_in_face",
    value: function sample_point_in_face(w1, w2, v1, v2, v3) {
      if (w1 + w2 > 1) {
        w1 = 1.0 - w1;
        w2 = 1.0 - w2;
      }

      var w3 = 1.0 - (w1 + w2);
      return v1.clone().multiplyScalar(w1).add(v2.clone().multiplyScalar(w2)).add(v3.clone().multiplyScalar(w3));
    }
  }]);

  return MeshSampler;
}();

var mesh_sampler = new MeshSampler();
module.exports = mesh_sampler;
},{}],"Zz8J":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _Screen = _interopRequireDefault(require("/Screen"));

var _BaseRender2 = _interopRequireDefault(require("/render_mode/BaseRender"));

var _Graphics = _interopRequireDefault(require("/Graphics"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var NormalRender = /*#__PURE__*/function (_BaseRender) {
  _inherits(NormalRender, _BaseRender);

  var _super = _createSuper(NormalRender);

  function NormalRender() {
    _classCallCheck(this, NormalRender);

    return _super.call(this);
  }

  _createClass(NormalRender, [{
    key: "render",
    value: function render() {
      _Graphics.default.clear(undefined, _CameraManager.default.current, true, true);

      _Graphics.default.render(_SceneManager.default.current, _CameraManager.default.current);
    }
  }]);

  return NormalRender;
}(_BaseRender2.default);

exports.default = NormalRender;
},{"/CameraManager":"XMgG","/SceneManager":"qvMM","/Screen":"JIgx","/render_mode/BaseRender":"gDca","/Graphics":"xMH9"}],"rJQo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ObjectUtilities = /*#__PURE__*/function () {
  function ObjectUtilities() {
    _classCallCheck(this, ObjectUtilities);
  } // Changes XML to JSON


  _createClass(ObjectUtilities, null, [{
    key: "xml_to_json",
    value: function xml_to_json(xml) {
      // Create the return object
      var obj = {};

      if (xml.nodeType == 1) {
        // element
        // do attributes
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};

          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) {
        // text
        obj = xml.nodeValue;
      } // do children


      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;

          if (typeof obj[nodeName] == "undefined") {
            obj[nodeName] = this.xml_to_json(item);
          } else {
            if (typeof obj[nodeName].push == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }

            obj[nodeName].push(this.xml_to_json(item));
          }
        }
      }

      return obj;
    }
  }]);

  return ObjectUtilities;
}();

exports.default = ObjectUtilities;
},{}],"iUFL":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PerspectiveCamera = /*#__PURE__*/function (_THREE$PerspectiveCam) {
  _inherits(PerspectiveCamera, _THREE$PerspectiveCam);

  var _super = _createSuper(PerspectiveCamera);

  function PerspectiveCamera(fov, aspect, near, far) {
    var _this;

    _classCallCheck(this, PerspectiveCamera);

    _this = _super.call(this, fov, aspect, near, far);
    _this.clear_color = new THREE.Color("#000000");
    _this.clear_alpha = 1;
    return _this;
  }

  return PerspectiveCamera;
}(THREE.PerspectiveCamera);

exports.default = PerspectiveCamera;
},{}],"WHWR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeometryBatch = /*#__PURE__*/function () {
  function GeometryBatch(geometry, batch_width) {
    _classCallCheck(this, GeometryBatch);

    this.geometry = geometry;
    this.material = undefined;
    this.uniforms = {};
    this.batch_width = batch_width;
    this.data_textures = [];
    this.object_names = undefined;
    this.zero_offset = new THREE.Vector2();
    this.write_offset = new THREE.Vector2();
    this.uniform_dirty_count = 0;
    this.tmp_uploaded_data_count = 0;
  }

  _createClass(GeometryBatch, [{
    key: "init",
    value: function init(object_names, vert_shader, frag_shader) {
      this.material = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: vert_shader,
        fragmentShader: frag_shader
      });
      this.object_names = object_names;
    }
  }, {
    key: "add_global_uniform",
    value: function add_global_uniform(name, data) {
      this.uniforms[name] = {
        value: data
      };
      this.material.needsUpdate = true;
    }
  }, {
    key: "set_global_uniform",
    value: function set_global_uniform(name, data) {
      this.uniforms[name].value = data;
    }
  }, {
    key: "add_object_uniform_v3",
    value: function add_object_uniform_v3(uniform_name, default_value_v3) {
      var src_tex = this.__create_rgb_texture(this.batch_width);

      var dst_tex = this.__create_rgb_texture(this.batch_width);

      var one_pixel_tex = this.__create_rgb_texture(1);

      var new_data_tex = this.__add_data_texture(uniform_name, src_tex, dst_tex, one_pixel_tex);

      if (default_value_v3) this.__flood_data_texture_rgb(new_data_tex, default_value_v3);
    }
  }, {
    key: "add_object_uniform_v4",
    value: function add_object_uniform_v4(uniform_name, default_value_v4) {
      var src_tex = this.__create_rgba_texture(this.batch_width);

      var dst_tex = this.__create_rgba_texture(this.batch_width);

      var one_pixel_tex = this.__create_rgba_texture(1);

      var new_data_tex = this.__add_data_texture(uniform_name, src_tex, dst_tex, one_pixel_tex);

      if (default_value_v4) this.__flood_data_texture_rgba(new_data_tex, default_value_v4);
    }
  }, {
    key: "add_object_uniform_v4_float",
    value: function add_object_uniform_v4_float(uniform_name, default_value_v4) {
      var src_tex = this.__create_rgba_float_texture(this.batch_width);

      var dst_tex = this.__create_rgba_float_texture(this.batch_width);

      var one_pixel_tex = this.__create_rgba_float_texture(1);

      var new_data_tex = this.__add_data_texture(uniform_name, src_tex, dst_tex, one_pixel_tex);

      if (default_value_v4) this.__flood_data_texture_rgba(new_data_tex, default_value_v4);
    }
  }, {
    key: "set_object_uniform_v3",
    value: function set_object_uniform_v3(object_name, uniform_name, vector3, use_r, use_g, use_b) {
      var obj_index = this.__get_object_index(object_name);

      var data_texture = this.__get_data_texture(uniform_name);

      this.__set_pixel_rgb(data_texture.src, obj_index, vector3, use_r, use_g, use_b);

      this.__set_pixel_rgb(data_texture.one_pixel, 0, vector3, use_r, use_g, use_b);

      data_texture.last_accessed_index = obj_index;
      data_texture.dirty_count++;
    }
  }, {
    key: "set_object_uniform_v4",
    value: function set_object_uniform_v4(object_name, uniform_name, vector4, use_r, use_g, use_b, use_a) {
      var obj_index = this.__get_object_index(object_name);

      var data_texture = this.__get_data_texture(uniform_name);

      this.__set_pixel_rgba(data_texture.src, obj_index, vector4, use_r, use_g, use_b, use_a);

      this.__set_pixel_rgba(data_texture.one_pixel, 0, vector4, use_r, use_g, use_b, use_a);

      data_texture.last_accessed_index = obj_index;
      data_texture.dirty_count++;
    }
  }, {
    key: "upload_texture_data",
    value: function upload_texture_data(renderer, upload_budget) {
      for (var i = 0; i < this.data_textures.length; i++) {
        if (upload_budget > 0 && this.data_textures[i].dirty_count > 0) {
          if (this.data_textures[i].dirty_count === 1) this.__partial_texture_data_upload(renderer, this.data_textures[i]);
          if (this.data_textures[i].dirty_count > 1) this.__full_texture_data_upload(renderer, this.data_textures[i]);
          this.data_textures[i].dirty_count = 0;
          upload_budget--;
        }
      }
    }
  }, {
    key: "get_uniform_dirty_count",
    value: function get_uniform_dirty_count() {
      this.uniform_dirty_count = 0;

      for (var i = 0; i < this.data_textures.length; i++) {
        if (this.data_textures[i].dirty_count > 0) this.uniform_dirty_count++;
      }

      return this.uniform_dirty_count;
    }
  }, {
    key: "__full_texture_data_upload",
    value: function __full_texture_data_upload(renderer, texture_data) {
      // console.log("full texture update of"+ texture_data.name);
      texture_data.dst.needsUpdate = true;
      renderer.copyTextureToTexture(this.zero_offset, texture_data.src, texture_data.dst);
    }
  }, {
    key: "__partial_texture_data_upload",
    value: function __partial_texture_data_upload(renderer, texture_data) {
      // console.log("partial texture update"+ texture_data.name);
      var index = texture_data.last_accessed_index;
      if (index === -1) return;
      this.write_offset.y = Math.floor(index / this.batch_width);
      this.write_offset.x = index - this.batch_width * this.write_offset.y;
      renderer.copyTextureToTexture(this.write_offset, texture_data.one_pixel, texture_data.dst);
    }
  }, {
    key: "get_mesh",
    value: function get_mesh() {
      return new THREE.Mesh(this.geometry, this.material);
    }
  }, {
    key: "__set_pixel_rgb",
    value: function __set_pixel_rgb(data_texture, index, vector3, use_r, use_g, use_b) {
      if (use_r) data_texture.image.data[index * 3 + 0] = vector3.x;
      if (use_g) data_texture.image.data[index * 3 + 1] = vector3.y;
      if (use_b) data_texture.image.data[index * 3 + 2] = vector3.z;
    }
  }, {
    key: "__set_pixel_rgba",
    value: function __set_pixel_rgba(data_texture, index, vector4, use_r, use_g, use_b, use_a) {
      if (use_r) data_texture.image.data[index * 4 + 0] = vector4.x;
      if (use_g) data_texture.image.data[index * 4 + 1] = vector4.y;
      if (use_b) data_texture.image.data[index * 4 + 2] = vector4.z;
      if (use_a) data_texture.image.data[index * 4 + 3] = vector4.w;
    }
  }, {
    key: "__flood_data_texture_rgb",
    value: function __flood_data_texture_rgb(data_texture, v3) {
      for (var i = 0; i < this.batch_width * this.batch_width; i++) {
        this.__set_pixel_rgb(data_texture.src, i, v3, true, true, true);

        data_texture.dirty_count++;
      }
    }
  }, {
    key: "__flood_data_texture_rgba",
    value: function __flood_data_texture_rgba(data_texture, v4) {
      for (var i = 0; i < this.batch_width * this.batch_width; i++) {
        this.__set_pixel_rgba(data_texture.src, i, v4, true, true, true, true);

        data_texture.dirty_count++;
      }
    }
  }, {
    key: "__create_rgb_texture",
    value: function __create_rgb_texture(width) {
      var data = new Uint8Array(3 * width * width);
      return new THREE.DataTexture(data, width, width, THREE.RGBFormat);
    }
  }, {
    key: "__create_rgba_texture",
    value: function __create_rgba_texture(width) {
      var data = new Uint8Array(4 * width * width);
      return new THREE.DataTexture(data, width, width, THREE.RGBAFormat);
    }
  }, {
    key: "__create_rgba_float_texture",
    value: function __create_rgba_float_texture(width) {
      var data = new Float32Array(4 * width * width);
      return new THREE.DataTexture(data, width, width, THREE.RGBA, THREE.FloatType);
    }
  }, {
    key: "__get_data_texture",
    value: function __get_data_texture(uniform_name) {
      for (var i = 0; i < this.data_textures.length; i++) {
        if (this.data_textures[i].name === uniform_name) return this.data_textures[i];
      }

      conosle.error("Data texture " + uniform_name + " does not exist");
      return undefined;
    }
  }, {
    key: "__get_object_index",
    value: function __get_object_index(name) {
      for (var i = 0; i < this.object_names.length; i++) {
        if (this.object_names[i] === name) return i;
      }

      console.error("the name " + name + " is not contained in this batch");
      return undefined;
    }
  }, {
    key: "__add_data_texture",
    value: function __add_data_texture(uniform_name, src_texture, dst_texture, one_pixel_text) {
      dst_texture.needsUpdate = true;
      this.data_textures.push({
        name: uniform_name,
        src: src_texture,
        dst: dst_texture,
        one_pixel: one_pixel_text,
        last_accessed_index: -1,
        dirty_count: 0
      });
      this.uniforms[uniform_name] = {
        value: dst_texture
      };
      return this.data_textures[this.data_textures.length - 1];
    }
  }, {
    key: "dispose",
    value: function dispose() {
      for (var i = 0; i < this.data_textures.length; i++) {
        this.data_textures[i].src.dispose();
        this.data_textures[i].dst.dispose();
        this.data_textures[i].one_pixel.dispose();
      }
    }
  }]);

  return GeometryBatch;
}();

exports.default = GeometryBatch;
},{}],"VduU":[function(require,module,exports) {
"use strict";

var _GeometryBatch = _interopRequireDefault(require("/static_batcher/GeometryBatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeometryBatcher = /*#__PURE__*/function () {
  function GeometryBatcher() {
    _classCallCheck(this, GeometryBatcher);

    this.batches = [];
  }

  _createClass(GeometryBatcher, [{
    key: "batch",
    value: function batch(buffer_geometries) {
      var attr_accessor_uvs = [];
      var texture_width = THREE.Math.ceilPowerOfTwo(Math.sqrt(buffer_geometries.length)); // console.log("Store count: " + buffer_geometries.length + ", Texture size: " +texture_width);

      this.__init_uv_array(attr_accessor_uvs, texture_width);

      var uv_index = 0;

      for (var i = 0; i < buffer_geometries.length; i++) {
        var vertex_count = buffer_geometries[i].getAttribute('position').count;
        var y = Math.floor(i / texture_width);
        var x = i - texture_width * y;

        for (var count = 0; count < vertex_count; count++) {
          attr_accessor_uvs[uv_index] = x / texture_width + 0.5 / texture_width;
          attr_accessor_uvs[uv_index + 1] = y / texture_width + 0.5 / texture_width;
          uv_index += 2;
        }
      }

      var buffer_attribute = new THREE.BufferAttribute(new Float32Array(attr_accessor_uvs), 2);
      var buffer_geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(buffer_geometries);
      buffer_geometry.setAttribute('attr_accessor_uv', buffer_attribute);
      this.batches.push(new _GeometryBatch.default(buffer_geometry, texture_width));
      return this.batches[this.batches.length - 1];
    }
  }, {
    key: "upload_texture_data",
    value: function upload_texture_data(renderer) {
      for (var i = 0; i < this.batches.length; i++) {
        this.batches[i].upload_texture_data(renderer, 1);
      }
    }
  }, {
    key: "__init_uv_array",
    value: function __init_uv_array(uvs, texture_width) {
      for (var i = 0; i < texture_width * texture_width * 2; i++) {
        uvs.push(0);
      }
    }
  }]);

  return GeometryBatcher;
}();

var geometry_batcher = new GeometryBatcher();
module.exports = geometry_batcher;
},{"/static_batcher/GeometryBatch":"WHWR"}],"QYq1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Time = _interopRequireDefault(require("/Time"));

var _Input = _interopRequireDefault(require("/Input"));

var _UI = _interopRequireDefault(require("/UI"));

var _Debug = _interopRequireDefault(require("/Debug"));

var _GeometryBatcher = _interopRequireDefault(require("/static_batcher/GeometryBatcher"));

var _BaseApplication = _interopRequireDefault(require("/BaseApplication"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RenderLoop = /*#__PURE__*/function () {
  function RenderLoop(target_application, renderer) {
    _classCallCheck(this, RenderLoop);

    target_application = target_application || new _BaseApplication.default();
    this._frame_id = -1;
    this.target_application = target_application;
    this.renderer = renderer;
    this.is_running = true;
    this.frames_passed = 0;
  }

  _createClass(RenderLoop, [{
    key: "update",
    value: function update() {
      if (!this.is_running) return;

      _Time.default.__update();

      _Debug.default.clear(); //###### START CYCLE ######


      if (this.frames_passed === 5) {
        this.target_application.post_start();
      }

      this.target_application.update();
      this.target_application.on_pre_render();
      this.renderer.update(); // render scene

      _UI.default.update(); // update after new camera matrix has been calculated


      _UI.default.render(this.renderer); // render ui layer on top


      this.target_application.on_post_render();
      if (_Debug.default.rt_debug) this.renderer.blit(_Debug.default.rt_debug); //###### END  CYCLE #######

      _Input.default.clear();

      _UI.default.clear(); //   GeometryBatcher.upload_texture_data(this.renderer);


      this._frame_id = requestAnimationFrame(this.update.bind(this));
      this.frames_passed++;
    }
  }, {
    key: "start",
    value: function start() {
      this.target_application.start();
      this.update();
      this.is_running = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.is_running = false;
      this.target_application.end();
      cancelAnimationFrame(this._frame_id);
    }
  }]);

  return RenderLoop;
}();

exports.default = RenderLoop;
},{"/Time":"wewU","/Input":"k3P6","/UI":"yntx","/Debug":"J9UP","/static_batcher/GeometryBatcher":"VduU","/BaseApplication":"v0GF"}],"ged4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TextureLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(TextureLoader, _AbstractLoader);

  var _super = _createSuper(TextureLoader);

  function TextureLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, TextureLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.TextureLoader();
    return _this;
  }

  _createClass(TextureLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (image) {
        resource_container.set_resource(ctx.resource_id, image);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, undefined, function () {
        ctx.__set_error("Image could not  be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯');

        ctx.__loading_ended();
      });
    }
  }]);

  return TextureLoader;
}(_AbstractLoader2.default);

exports.default = TextureLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"DPLo":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var GLTFLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(GLTFLoader, _AbstractLoader);

  var _super = _createSuper(GLTFLoader);

  function GLTFLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, GLTFLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.GLTFLoader();
    return _this;
  }

  _createClass(GLTFLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (gltf) {
        resource_container.set_resource(ctx.resource_id, gltf);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg + "\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");

        ctx.__loading_ended();
      });
    }
  }]);

  return GLTFLoader;
}(_AbstractLoader2.default);

exports.default = GLTFLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"k6LD":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var DAELoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(DAELoader, _AbstractLoader);

  var _super = _createSuper(DAELoader);

  function DAELoader(resource_id, url) {
    var _this;

    _classCallCheck(this, DAELoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.ColladaLoader();
    return _this;
  }

  _createClass(DAELoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (gltf) {
        resource_container.set_resource(ctx.resource_id, gltf);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg + "\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");

        ctx.__loading_ended();
      });
    }
  }]);

  return DAELoader;
}(_AbstractLoader2.default);

exports.default = DAELoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"X88z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TextLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(TextLoader, _AbstractLoader);

  var _super = _createSuper(TextLoader);

  function TextLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, TextLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.FileLoader();
    return _this;
  }

  _createClass(TextLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (gltf) {
        resource_container.set_resource(ctx.resource_id, gltf);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg);

        ctx.__loading_ended();
      });
    }
  }]);

  return TextLoader;
}(_AbstractLoader2.default);

exports.default = TextLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"jYGB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CubemapLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(CubemapLoader, _AbstractLoader);

  var _super = _createSuper(CubemapLoader);

  function CubemapLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, CubemapLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.CubeTextureLoader();

    _this.loader.setPath(url + "/");

    _this.urls = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'];
    return _this;
  }

  _createClass(CubemapLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.urls, function (image) {
        resource_container.set_resource(ctx.resource_id, image);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, undefined, function (error) {
        ctx.__set_error("Image could not  be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯', error);

        ctx.__loading_ended();
      });
    }
  }]);

  return CubemapLoader;
}(_AbstractLoader2.default);

exports.default = CubemapLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"w983":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AudioLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(AudioLoader, _AbstractLoader);

  var _super = _createSuper(AudioLoader);

  function AudioLoader(resource_id, url, listener, loop, volume) {
    var _this;

    _classCallCheck(this, AudioLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.AudioLoader();
    _this.loop = loop;
    _this.listener = listener;
    _this.voluem = volume;
    return _this;
  }

  _createClass(AudioLoader, [{
    key: "load",
    value: function load(resource_container) {
      var _this2 = this;

      var ctx = this;
      var sound = new THREE.Audio(this.listener);
      this.loader.load(this.url, function (audio) {
        sound.setBuffer(audio);
        sound.setLoop(_this2.loop);
        sound.setVolume(_this2.voluem);
        resource_container.set_resource(ctx.resource_id, sound);

        if (!resource_container.get_resource('audio_listener')) {
          resource_container.set_resource('audio_listener', _this2.listener);
        }

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, undefined, function (error) {
        ctx.__set_error("Audio could not be loaded. Maybe wrong name or path, I don't know" + '¯\\_(ツ)_/¯', error);

        ctx.__loading_ended();
      });
    }
  }]);

  return AudioLoader;
}(_AbstractLoader2.default);

exports.default = AudioLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"tM6y":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var OBJLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(OBJLoader, _AbstractLoader);

  var _super = _createSuper(OBJLoader);

  function OBJLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, OBJLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.OBJLoader();
    return _this;
  }

  _createClass(OBJLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (gltf) {
        resource_container.set_resource(ctx.resource_id, gltf);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg + "\n\n\t If the error says something about unexpected token < in JSON then probably the problem is related to the file not being found. Check the name and path of the resource");

        ctx.__loading_ended();
      });
    }
  }]);

  return OBJLoader;
}(_AbstractLoader2.default);

exports.default = OBJLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"cO40":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("./AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RGBETextureLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(RGBETextureLoader, _AbstractLoader);

  var _super = _createSuper(RGBETextureLoader);

  function RGBETextureLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, RGBETextureLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.RGBELoader();

    _this.loader.setDataType(THREE.UnsignedByteType);

    return _this;
  }

  _createClass(RGBETextureLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (hdr) {
        resource_container.set_resource(ctx.resource_id, hdr);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg + "\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");

        ctx.__loading_ended();
      });
    }
  }]);

  return RGBETextureLoader;
}(_AbstractLoader2.default);

exports.default = RGBETextureLoader;
},{"./AbstractLoader":"mqLz"}],"cNL4":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var PointArrayLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(PointArrayLoader, _AbstractLoader);

  var _super = _createSuper(PointArrayLoader);

  function PointArrayLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, PointArrayLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.FileLoader();
    return _this;
  }

  _createClass(PointArrayLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.load(this.url, function (text) {
        resource_container.set_resource(ctx.resource_id, ctx.parse_path(text));

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg);

        ctx.__loading_ended();
      });
    }
  }, {
    key: "parse_path",
    value: function parse_path(raw_data) {
      var string_array = raw_data.split('\n');

      if (string_array[string_array.length - 1] === "") {
        string_array.pop();
      }

      var positions = [];

      for (var i = 0; i < string_array.length; i += 3) {
        var x = parseFloat(string_array[i + 0]);
        var y = parseFloat(string_array[i + 1]);
        var z = parseFloat(string_array[i + 2]);
        positions.push(new THREE.Vector3(x, y, z));
      }

      return positions; // let curve = new THREE.CatmullRomCurve3(positions);
      // return curve.getPoints(100);
    }
  }]);

  return PointArrayLoader;
}(_AbstractLoader2.default);

exports.default = PointArrayLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"WYYb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AbstractLoader2 = _interopRequireDefault(require("/resource_loader/AbstractLoader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HDRCubeTextureLoader = /*#__PURE__*/function (_AbstractLoader) {
  _inherits(HDRCubeTextureLoader, _AbstractLoader);

  var _super = _createSuper(HDRCubeTextureLoader);

  function HDRCubeTextureLoader(resource_id, url) {
    var _this;

    _classCallCheck(this, HDRCubeTextureLoader);

    _this = _super.call(this, resource_id, url);
    _this.loader = new THREE.HDRCubeTextureLoader();
    _this.url_suffix = ['/px.hdr', '/nx.hdr', '/py.hdr', '/ny.hdr', '/pz.hdr', '/nz.hdr'];
    return _this;
  }

  _createClass(HDRCubeTextureLoader, [{
    key: "load",
    value: function load(resource_container) {
      var ctx = this;
      this.loader.setPath(this.url).setDataType(THREE.UnsignedByteType).load(this.url_suffix, function (hdr) {
        resource_container.set_resource(ctx.resource_id, hdr);

        ctx.__update_progress(1);

        ctx.__loading_ended();
      }, function (xhr) {
        ctx.__update_progress(xhr.loaded / xhr.total);
      }, function (msg) {
        ctx.__set_error(msg + "\n\n\t If the error says something about unexpected token < in JSON then the probably the problem is related to the file not being found. Check the name and path of the resource");

        ctx.__loading_ended();
      });
    }
  }]);

  return HDRCubeTextureLoader;
}(_AbstractLoader2.default);

exports.default = HDRCubeTextureLoader;
},{"/resource_loader/AbstractLoader":"mqLz"}],"HJ6F":[function(require,module,exports) {
"use strict";

var _EventManager = _interopRequireDefault(require("/EventManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResourceContainer = /*#__PURE__*/function () {
  function ResourceContainer() {
    _classCallCheck(this, ResourceContainer);

    this.resources = {};
  }

  _createClass(ResourceContainer, [{
    key: "set_resource",
    value: function set_resource(name, resource) {
      this.resources[name] = resource;

      _EventManager.default.fire_resource_loaded({
        name: name,
        value: resource
      });
    }
  }, {
    key: "get_resource",
    value: function get_resource(name) {
      return this.resources[name];
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.resources[name];
    }
  }]);

  return ResourceContainer;
}();

var resource_container = new ResourceContainer();
module.exports = resource_container;
},{"/EventManager":"pJqg"}],"gkjv":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TextureLoader = _interopRequireDefault(require("/resource_loader/TextureLoader"));

var _GLTFLoader = _interopRequireDefault(require("/resource_loader/GLTFLoader"));

var _DAELoader = _interopRequireDefault(require("/resource_loader/DAELoader"));

var _TextLoader = _interopRequireDefault(require("/resource_loader/TextLoader"));

var _CubemapLoader = _interopRequireDefault(require("/resource_loader/CubemapLoader"));

var _AudioLoader = _interopRequireDefault(require("/resource_loader/AudioLoader"));

var _JSONLoader = _interopRequireDefault(require("/resource_loader/JSONLoader"));

var _OBJLoader = _interopRequireDefault(require("/resource_loader/OBJLoader"));

var _RGBETextureLoader = _interopRequireDefault(require("/resource_loader/RGBETextureLoader"));

var _PointArrayLoader = _interopRequireDefault(require("/resource_loader/PointArrayLoader"));

var _HDRCubeTextureLoader = _interopRequireDefault(require("/resource_loader/HDRCubeTextureLoader"));

var _ResourceContainer = _interopRequireDefault(require("/ResourceContainer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResourceBatch = /*#__PURE__*/function () {
  function ResourceBatch(batch_name) {
    _classCallCheck(this, ResourceBatch);

    this.resource_loaders = [];
    this.batch_name = batch_name || "unnamed batch";
  }

  _createClass(ResourceBatch, [{
    key: "add_texture",
    value: function add_texture(resource_id, url) {
      this.resource_loaders.push(new _TextureLoader.default(resource_id, url));
    }
  }, {
    key: "add_gltf",
    value: function add_gltf(resource_id, url) {
      this.resource_loaders.push(new _GLTFLoader.default(resource_id, url));
    }
  }, {
    key: "add_dae",
    value: function add_dae(resource_id, url) {
      this.resource_loaders.push(new _DAELoader.default(resource_id, url));
    }
  }, {
    key: "add_obj",
    value: function add_obj(resource_id, url) {
      this.resource_loaders.push(new _OBJLoader.default(resource_id, url));
    }
  }, {
    key: "add_text",
    value: function add_text(resource_id, url) {
      this.resource_loaders.push(new _TextLoader.default(resource_id, url));
    }
  }, {
    key: "add_cubemap",
    value: function add_cubemap(resource_id, url) {
      this.resource_loaders.push(new _CubemapLoader.default(resource_id, url));
    }
  }, {
    key: "add_audio",
    value: function add_audio(resource_id, url, listener, loop, volume) {
      this.resource_loaders.push(new _AudioLoader.default(resource_id, url, listener, loop, volume));
    }
  }, {
    key: "add_json",
    value: function add_json(resource_id, url) {
      this.resource_loaders.push(new _JSONLoader.default(resource_id, url));
    }
  }, {
    key: "add_point_array",
    value: function add_point_array(resource_id, url) {
      this.resource_loaders.push(new _PointArrayLoader.default(resource_id, url));
    }
  }, {
    key: "add_hdr",
    value: function add_hdr(resource_id, url) {
      this.resource_loaders.push(new _RGBETextureLoader.default(resource_id, url));
    }
  }, {
    key: "add_hdr_cubemap",
    value: function add_hdr_cubemap(resource_id, url) {
      this.resource_loaders.push(new _HDRCubeTextureLoader.default(resource_id, url));
    }
  }, {
    key: "add_loader",
    value: function add_loader(loader) {
      this.resource_loaders.push(loader);
    }
  }, {
    key: "load",
    value: function load(resource_container) {
      for (var i = 0; i < this.resource_loaders.length; i++) {
        this.resource_loaders[i].load(resource_container || _ResourceContainer.default);
      }
    }
  }, {
    key: "print_errors",
    value: function print_errors() {
      console.error("Batch <" + this.batch_name + "> could not load successfully");

      for (var i = 0; i < this.resource_loaders.length; i++) {
        if (this.resource_loaders[i].has_error) this.resource_loaders[i].print_error();
      }
    }
  }, {
    key: "get_progress",
    value: function get_progress() {
      var progress = 0;

      for (var i = 0; i < this.resource_loaders.length; i++) {
        progress += this.resource_loaders[i].progress;
      }

      if (this.resource_loaders.length === 0) {
        return 1;
      }

      return progress / this.resource_loaders.length;
    }
  }, {
    key: "loading_finished",
    get: function get() {
      var finished = true;

      for (var i = 0; i < this.resource_loaders.length; i++) {
        finished = finished && this.resource_loaders[i].has_finished;
      }

      return finished;
    }
  }, {
    key: "has_errors",
    get: function get() {
      var has_error = false;

      for (var i = 0; i < this.resource_loaders.length; i++) {
        has_error = has_error || this.resource_loaders[i].has_error;
      }

      return has_error;
    }
  }]);

  return ResourceBatch;
}();

exports.default = ResourceBatch;
},{"/resource_loader/TextureLoader":"ged4","/resource_loader/GLTFLoader":"DPLo","/resource_loader/DAELoader":"k6LD","/resource_loader/TextLoader":"X88z","/resource_loader/CubemapLoader":"jYGB","/resource_loader/AudioLoader":"w983","/resource_loader/JSONLoader":"NvAk","/resource_loader/OBJLoader":"tM6y","/resource_loader/RGBETextureLoader":"cO40","/resource_loader/PointArrayLoader":"cNL4","/resource_loader/HDRCubeTextureLoader":"WYYb","/ResourceContainer":"HJ6F"}],"hKPB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CanvasDrawer2 = _interopRequireDefault(require("/canvas_drawer/CanvasDrawer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SimpleTextDrawer = /*#__PURE__*/function (_CanvasDrawer) {
  _inherits(SimpleTextDrawer, _CanvasDrawer);

  var _super = _createSuper(SimpleTextDrawer);

  function SimpleTextDrawer() {
    var _this;

    _classCallCheck(this, SimpleTextDrawer);

    _this = _super.call(this);
    _this.text_margin = new THREE.Vector2(2, 0);
    return _this;
  }

  _createClass(SimpleTextDrawer, [{
    key: "__draw",
    value: function __draw(text, ctxOptions, canvas, ctx) {
      ctx.font = ctxOptions.font;
      var text_size = this.get_text_size(text, ctxOptions.font); // canvas.width = THREE.Math.ceilPowerOfTwo(text_size.x+this.text_margin.x*2);
      // canvas.height = THREE.Math.ceilPowerOfTwo(text_size.y+ this.text_margin.y*2);

      canvas.width = Math.ceil(text_size.x + this.text_margin.x * 2);
      canvas.height = Math.ceil(text_size.y + this.text_margin.y * 2);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // ctx.globalAlpha = 0.2;
      // ctx.fillStyle = "#FF0000";
      // ctx.fillRect(0,0, canvas.width, canvas.height);

      ctx.globalAlpha = 1;
      ctx.font = ctxOptions.font;
      ctx.fillStyle = ctxOptions.font_color || "#000000";
      ctx.textBaseline = "middle";
      ctx.textAlignment = "left";
      ctx.fillText(text, 0, canvas.height / 2);
    }
  }]);

  return SimpleTextDrawer;
}(_CanvasDrawer2.default);

exports.default = SimpleTextDrawer;
},{"/canvas_drawer/CanvasDrawer":"LsO8"}],"wwEn":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This class helps with parsing an entire recording that spans several days, into one-day recordings
// that start at 0:00:00 and ends at 23:59:59, except for the first and last day of a recording range
var TimeUtilities = function TimeUtilities() {
  _classCallCheck(this, TimeUtilities);
};

exports.default = TimeUtilities;
},{}],"bOug":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Validation = /*#__PURE__*/function () {
  function Validation() {
    _classCallCheck(this, Validation);
  }

  _createClass(Validation, null, [{
    key: "is_int",
    value: function is_int(n) {
      return Number(n) === n && n % 1 === 0;
    }
  }, {
    key: "is_float",
    value: function is_float(n) {
      return Number(n) === n && n % 1 !== 0;
    }
  }, {
    key: "is_json",
    value: function is_json(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }

      return true;
    }
  }]);

  return Validation;
}();

exports.default = Validation;
},{}],"Focm":[function(require,module,exports) {
"use strict";

var _ArrayUtilities = _interopRequireDefault(require("/utilities/ArrayUtilities.js"));

var _BaseApplication = _interopRequireDefault(require("/BaseApplication"));

var _BaseShaderMaterial = _interopRequireDefault(require("/materials/BaseShaderMaterial"));

var _CameraManager = _interopRequireDefault(require("/CameraManager"));

var _CameraUtilities = _interopRequireDefault(require("/utilities/CameraUtilities"));

var _Capabilities = _interopRequireDefault(require("/Capabilities"));

var _Components = _interopRequireDefault(require("/Components"));

var _CanvasDrawer = _interopRequireDefault(require("/canvas_drawer/CanvasDrawer"));

var _Configuration = _interopRequireDefault(require("/Configuration"));

var _Debug = _interopRequireDefault(require("/Debug"));

var _DebugNormalsRender = _interopRequireDefault(require("/render_mode/DebugNormalsRender"));

var _EasingFunctions = _interopRequireDefault(require("/utilities/EasingFunctions"));

var _EventManager = _interopRequireDefault(require("/EventManager"));

var _Graphics = _interopRequireDefault(require("/Graphics"));

var _ImageUtilities = _interopRequireDefault(require("/utilities/ImageUtilities"));

var _Input = _interopRequireDefault(require("/Input"));

var _JSONLoader = _interopRequireDefault(require("/resource_loader/JSONLoader"));

var _MathUtilities = _interopRequireDefault(require("/utilities/MathUtilities"));

var _ModelUtilities = _interopRequireDefault(require("/utilities/ModelUtilities"));

var _MeshSampler = _interopRequireDefault(require("/utilities/MeshSampler"));

var _NormalRender = _interopRequireDefault(require("/render_mode/NormalRender"));

var _ObjectUtilities = _interopRequireDefault(require("/utilities/ObjectUtilities"));

var _PerspectiveCamera = _interopRequireDefault(require("/PerspectiveCamera"));

var _RenderLoop = _interopRequireDefault(require("/RenderLoop"));

var _ResourceBatch = _interopRequireDefault(require("/resource_loader/ResourceBatch"));

var _ResourceContainer = _interopRequireDefault(require("/ResourceContainer"));

var _SceneManager = _interopRequireDefault(require("/SceneManager"));

var _Screen = _interopRequireDefault(require("/Screen"));

var _SimpleTextDrawer = _interopRequireDefault(require("/canvas_drawer/SimpleTextDrawer"));

var _Time = _interopRequireDefault(require("/Time"));

var _TimeUtilities = _interopRequireDefault(require("/utilities/TimeUtilities"));

var _UI = _interopRequireDefault(require("/UI"));

var _Validation = _interopRequireDefault(require("/utilities/Validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  ArrayUtilities: _ArrayUtilities.default,
  BaseApplication: _BaseApplication.default,
  BaseShaderMaterial: _BaseShaderMaterial.default,
  CameraManager: _CameraManager.default,
  CameraUtilities: _CameraUtilities.default,
  CanvasDrawer: _CanvasDrawer.default,
  Capabilities: _Capabilities.default,
  Components: _Components.default,
  Configuration: _Configuration.default,
  Debug: _Debug.default,
  DebugNormalsRender: _DebugNormalsRender.default,
  EasingFunctions: _EasingFunctions.default,
  EventManager: _EventManager.default,
  Graphics: _Graphics.default,
  ImageUtilities: _ImageUtilities.default,
  Input: _Input.default,
  JSONLoader: _JSONLoader.default,
  MathUtilities: _MathUtilities.default,
  ModelUtilities: _ModelUtilities.default,
  NormalRender: _NormalRender.default,
  ObjectUtilities: _ObjectUtilities.default,
  PerspectiveCamera: _PerspectiveCamera.default,
  RenderLoop: _RenderLoop.default,
  ResourceBatch: _ResourceBatch.default,
  ResourceContainer: _ResourceContainer.default,
  SceneManager: _SceneManager.default,
  Screen: _Screen.default,
  SimpleTextDrawer: _SimpleTextDrawer.default,
  Time: _Time.default,
  TimeUtilities: _TimeUtilities.default,
  UI: _UI.default,
  Validation: _Validation.default,
  MeshSampler: _MeshSampler.default
};
},{"/utilities/ArrayUtilities.js":"INHd","/BaseApplication":"v0GF","/materials/BaseShaderMaterial":"Ej2H","/CameraManager":"XMgG","/utilities/CameraUtilities":"ugwp","/Capabilities":"hZlU","/Components":"m3BF","/canvas_drawer/CanvasDrawer":"LsO8","/Configuration":"RyjO","/Debug":"J9UP","/render_mode/DebugNormalsRender":"M0uM","/utilities/EasingFunctions":"ZeWG","/EventManager":"pJqg","/Graphics":"xMH9","/utilities/ImageUtilities":"XAIA","/Input":"k3P6","/resource_loader/JSONLoader":"NvAk","/utilities/MathUtilities":"ayC1","/utilities/ModelUtilities":"c2tY","/utilities/MeshSampler":"hjkK","/render_mode/NormalRender":"Zz8J","/utilities/ObjectUtilities":"rJQo","/PerspectiveCamera":"iUFL","/RenderLoop":"QYq1","/resource_loader/ResourceBatch":"gkjv","/ResourceContainer":"HJ6F","/SceneManager":"qvMM","/Screen":"JIgx","/canvas_drawer/SimpleTextDrawer":"hKPB","/Time":"wewU","/utilities/TimeUtilities":"wwEn","/UI":"yntx","/utilities/Validation":"bOug"}]},{},["Focm"], null)
//# sourceMappingURL=/index.js.map