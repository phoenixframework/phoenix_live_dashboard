/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

;(function(root, factory) {

  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})(this, function() {
  var NProgress = {};

  NProgress.version = '0.2.0';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
  NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

  NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

  NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   *
   * @param $promise jQUery Promise
   */
  (function() {
    var initial = 0, current = 0;

    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() === "resolved") {
        return this;
      }

      if (current === 0) {
        NProgress.start();
      }

      initial++;
      current++;

      $promise.always(function() {
        current--;
        if (current === 0) {
            initial = 0;
            NProgress.done();
        } else {
            NProgress.set((initial - current) / initial);
        }
      });

      return this;
    };

  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress');

    addClass(document.documentElement, 'nprogress-busy');
    
    var progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;
    
    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

  NProgress.remove = function() {
    removeClass(document.documentElement, 'nprogress-busy');
    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
    var progress = document.getElementById('nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return !!document.getElementById('nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

  NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

  var queue = (function() {
    var pending = [];
    
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop, 
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});



/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e, t) {
  "object" == ( false ? undefined : _typeof(exports)) && "object" == ( false ? undefined : _typeof(module)) ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
}(this, function () {
  return function (e) {
    var t = {};

    function n(i) {
      if (t[i]) return t[i].exports;
      var o = t[i] = {
        i: i,
        l: !1,
        exports: {}
      };
      return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }

    return n.m = e, n.c = t, n.d = function (e, t, i) {
      n.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: i
      });
    }, n.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, n.t = function (e, t) {
      if (1 & t && (e = n(e)), 8 & t) return e;
      if (4 & t && "object" == _typeof(e) && e && e.__esModule) return e;
      var i = Object.create(null);
      if (n.r(i), Object.defineProperty(i, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var o in e) {
        n.d(i, o, function (t) {
          return e[t];
        }.bind(null, o));
      }
      return i;
    }, n.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e["default"];
      } : function () {
        return e;
      };
      return n.d(t, "a", t), t;
    }, n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, n.p = "", n(n.s = 0);
  }([function (e, t, n) {
    (function (t) {
      e.exports = t.Phoenix = n(2);
    }).call(this, n(1));
  }, function (e, t) {
    var n;

    n = function () {
      return this;
    }();

    try {
      n = n || Function("return this")() || (0, eval)("this");
    } catch (e) {
      "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (n = window);
    }

    e.exports = n;
  }, function (e, t, n) {
    "use strict";

    function i(e) {
      return function (e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = new Array(e.length); t < e.length; t++) {
            n[t] = e[t];
          }

          return n;
        }
      }(e) || function (e) {
        if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e);
      }(e) || function () {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
      }();
    }

    function o(e) {
      return (o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
      })(e);
    }

    function r(e, t) {
      return function (e) {
        if (Array.isArray(e)) return e;
      }(e) || function (e, t) {
        var n = [],
            i = !0,
            o = !1,
            r = void 0;

        try {
          for (var s, a = e[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0) {
            ;
          }
        } catch (e) {
          o = !0, r = e;
        } finally {
          try {
            i || null == a["return"] || a["return"]();
          } finally {
            if (o) throw r;
          }
        }

        return n;
      }(e, t) || function () {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }();
    }

    function s(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    function a(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
      }
    }

    function c(e, t, n) {
      return t && a(e.prototype, t), n && a(e, n), e;
    }

    n.r(t), n.d(t, "Channel", function () {
      return j;
    }), n.d(t, "Serializer", function () {
      return C;
    }), n.d(t, "Socket", function () {
      return R;
    }), n.d(t, "LongPoll", function () {
      return T;
    }), n.d(t, "Ajax", function () {
      return w;
    }), n.d(t, "Presence", function () {
      return E;
    });

    var u = "undefined" != typeof self ? self : null,
        h = "undefined" != typeof window ? window : null,
        l = u || h || void 0,
        f = "2.0.0",
        d = {
      connecting: 0,
      open: 1,
      closing: 2,
      closed: 3
    },
        p = 1e4,
        v = {
      closed: "closed",
      errored: "errored",
      joined: "joined",
      joining: "joining",
      leaving: "leaving"
    },
        y = {
      close: "phx_close",
      error: "phx_error",
      join: "phx_join",
      reply: "phx_reply",
      leave: "phx_leave"
    },
        g = [y.close, y.error, y.join, y.reply, y.leave],
        m = {
      longpoll: "longpoll",
      websocket: "websocket"
    },
        k = function k(e) {
      if ("function" == typeof e) return e;
      return function () {
        return e;
      };
    },
        b = function () {
      function e(t, n, i, o) {
        s(this, e), this.channel = t, this.event = n, this.payload = i || function () {
          return {};
        }, this.receivedResp = null, this.timeout = o, this.timeoutTimer = null, this.recHooks = [], this.sent = !1;
      }

      return c(e, [{
        key: "resend",
        value: function value(e) {
          this.timeout = e, this.reset(), this.send();
        }
      }, {
        key: "send",
        value: function value() {
          this.hasReceived("timeout") || (this.startTimeout(), this.sent = !0, this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload(),
            ref: this.ref,
            join_ref: this.channel.joinRef()
          }));
        }
      }, {
        key: "receive",
        value: function value(e, t) {
          return this.hasReceived(e) && t(this.receivedResp.response), this.recHooks.push({
            status: e,
            callback: t
          }), this;
        }
      }, {
        key: "reset",
        value: function value() {
          this.cancelRefEvent(), this.ref = null, this.refEvent = null, this.receivedResp = null, this.sent = !1;
        }
      }, {
        key: "matchReceive",
        value: function value(e) {
          var t = e.status,
              n = e.response;
          e.ref;
          this.recHooks.filter(function (e) {
            return e.status === t;
          }).forEach(function (e) {
            return e.callback(n);
          });
        }
      }, {
        key: "cancelRefEvent",
        value: function value() {
          this.refEvent && this.channel.off(this.refEvent);
        }
      }, {
        key: "cancelTimeout",
        value: function value() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = null;
        }
      }, {
        key: "startTimeout",
        value: function value() {
          var e = this;
          this.timeoutTimer && this.cancelTimeout(), this.ref = this.channel.socket.makeRef(), this.refEvent = this.channel.replyEventName(this.ref), this.channel.on(this.refEvent, function (t) {
            e.cancelRefEvent(), e.cancelTimeout(), e.receivedResp = t, e.matchReceive(t);
          }), this.timeoutTimer = setTimeout(function () {
            e.trigger("timeout", {});
          }, this.timeout);
        }
      }, {
        key: "hasReceived",
        value: function value(e) {
          return this.receivedResp && this.receivedResp.status === e;
        }
      }, {
        key: "trigger",
        value: function value(e, t) {
          this.channel.trigger(this.refEvent, {
            status: e,
            response: t
          });
        }
      }]), e;
    }(),
        j = function () {
      function e(t, n, i) {
        var o = this;
        s(this, e), this.state = v.closed, this.topic = t, this.params = k(n || {}), this.socket = i, this.bindings = [], this.bindingRef = 0, this.timeout = this.socket.timeout, this.joinedOnce = !1, this.joinPush = new b(this, y.join, this.params, this.timeout), this.pushBuffer = [], this.stateChangeRefs = [], this.rejoinTimer = new S(function () {
          o.socket.isConnected() && o.rejoin();
        }, this.socket.rejoinAfterMs), this.stateChangeRefs.push(this.socket.onError(function () {
          return o.rejoinTimer.reset();
        })), this.stateChangeRefs.push(this.socket.onOpen(function () {
          o.rejoinTimer.reset(), o.isErrored() && o.rejoin();
        })), this.joinPush.receive("ok", function () {
          o.state = v.joined, o.rejoinTimer.reset(), o.pushBuffer.forEach(function (e) {
            return e.send();
          }), o.pushBuffer = [];
        }), this.joinPush.receive("error", function () {
          o.state = v.errored, o.socket.isConnected() && o.rejoinTimer.scheduleTimeout();
        }), this.onClose(function () {
          o.rejoinTimer.reset(), o.socket.hasLogger() && o.socket.log("channel", "close ".concat(o.topic, " ").concat(o.joinRef())), o.state = v.closed, o.socket.remove(o);
        }), this.onError(function (e) {
          o.socket.hasLogger() && o.socket.log("channel", "error ".concat(o.topic), e), o.isJoining() && o.joinPush.reset(), o.state = v.errored, o.socket.isConnected() && o.rejoinTimer.scheduleTimeout();
        }), this.joinPush.receive("timeout", function () {
          o.socket.hasLogger() && o.socket.log("channel", "timeout ".concat(o.topic, " (").concat(o.joinRef(), ")"), o.joinPush.timeout), new b(o, y.leave, k({}), o.timeout).send(), o.state = v.errored, o.joinPush.reset(), o.socket.isConnected() && o.rejoinTimer.scheduleTimeout();
        }), this.on(y.reply, function (e, t) {
          o.trigger(o.replyEventName(t), e);
        });
      }

      return c(e, [{
        key: "join",
        value: function value() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.timeout;
          if (this.joinedOnce) throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
          return this.timeout = e, this.joinedOnce = !0, this.rejoin(), this.joinPush;
        }
      }, {
        key: "onClose",
        value: function value(e) {
          this.on(y.close, e);
        }
      }, {
        key: "onError",
        value: function value(e) {
          return this.on(y.error, function (t) {
            return e(t);
          });
        }
      }, {
        key: "on",
        value: function value(e, t) {
          var n = this.bindingRef++;
          return this.bindings.push({
            event: e,
            ref: n,
            callback: t
          }), n;
        }
      }, {
        key: "off",
        value: function value(e, t) {
          this.bindings = this.bindings.filter(function (n) {
            return !(n.event === e && (void 0 === t || t === n.ref));
          });
        }
      }, {
        key: "canPush",
        value: function value() {
          return this.socket.isConnected() && this.isJoined();
        }
      }, {
        key: "push",
        value: function value(e, t) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.timeout;
          if (!this.joinedOnce) throw new Error("tried to push '".concat(e, "' to '").concat(this.topic, "' before joining. Use channel.join() before pushing events"));
          var i = new b(this, e, function () {
            return t;
          }, n);
          return this.canPush() ? i.send() : (i.startTimeout(), this.pushBuffer.push(i)), i;
        }
      }, {
        key: "leave",
        value: function value() {
          var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.timeout;
          this.rejoinTimer.reset(), this.joinPush.cancelTimeout(), this.state = v.leaving;

          var n = function n() {
            e.socket.hasLogger() && e.socket.log("channel", "leave ".concat(e.topic)), e.trigger(y.close, "leave");
          },
              i = new b(this, y.leave, k({}), t);

          return i.receive("ok", function () {
            return n();
          }).receive("timeout", function () {
            return n();
          }), i.send(), this.canPush() || i.trigger("ok", {}), i;
        }
      }, {
        key: "onMessage",
        value: function value(e, t, n) {
          return t;
        }
      }, {
        key: "isLifecycleEvent",
        value: function value(e) {
          return g.indexOf(e) >= 0;
        }
      }, {
        key: "isMember",
        value: function value(e, t, n, i) {
          return this.topic === e && (!i || i === this.joinRef() || !this.isLifecycleEvent(t) || (this.socket.hasLogger() && this.socket.log("channel", "dropping outdated message", {
            topic: e,
            event: t,
            payload: n,
            joinRef: i
          }), !1));
        }
      }, {
        key: "joinRef",
        value: function value() {
          return this.joinPush.ref;
        }
      }, {
        key: "sendJoin",
        value: function value(e) {
          this.state = v.joining, this.joinPush.resend(e);
        }
      }, {
        key: "rejoin",
        value: function value() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.timeout;
          this.isLeaving() || this.sendJoin(e);
        }
      }, {
        key: "trigger",
        value: function value(e, t, n, i) {
          var o = this.onMessage(e, t, n, i);
          if (t && !o) throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");

          for (var r = 0; r < this.bindings.length; r++) {
            var s = this.bindings[r];
            s.event === e && s.callback(o, n, i || this.joinRef());
          }
        }
      }, {
        key: "replyEventName",
        value: function value(e) {
          return "chan_reply_".concat(e);
        }
      }, {
        key: "isClosed",
        value: function value() {
          return this.state === v.closed;
        }
      }, {
        key: "isErrored",
        value: function value() {
          return this.state === v.errored;
        }
      }, {
        key: "isJoined",
        value: function value() {
          return this.state === v.joined;
        }
      }, {
        key: "isJoining",
        value: function value() {
          return this.state === v.joining;
        }
      }, {
        key: "isLeaving",
        value: function value() {
          return this.state === v.leaving;
        }
      }]), e;
    }(),
        C = {
      encode: function encode(e, t) {
        var n = [e.join_ref, e.ref, e.topic, e.event, e.payload];
        return t(JSON.stringify(n));
      },
      decode: function decode(e, t) {
        var n = r(JSON.parse(e), 5);
        return t({
          join_ref: n[0],
          ref: n[1],
          topic: n[2],
          event: n[3],
          payload: n[4]
        });
      }
    },
        R = function () {
      function e(t) {
        var n = this,
            i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        s(this, e), this.stateChangeCallbacks = {
          open: [],
          close: [],
          error: [],
          message: []
        }, this.channels = [], this.sendBuffer = [], this.ref = 0, this.timeout = i.timeout || p, this.transport = i.transport || l.WebSocket || T, this.defaultEncoder = C.encode, this.defaultDecoder = C.decode, this.closeWasClean = !1, this.unloaded = !1, this.binaryType = i.binaryType || "arraybuffer", this.transport !== T ? (this.encode = i.encode || this.defaultEncoder, this.decode = i.decode || this.defaultDecoder) : (this.encode = this.defaultEncoder, this.decode = this.defaultDecoder), h && h.addEventListener && h.addEventListener("unload", function (e) {
          n.conn && (n.unloaded = !0, n.abnormalClose("unloaded"));
        }), this.heartbeatIntervalMs = i.heartbeatIntervalMs || 3e4, this.rejoinAfterMs = function (e) {
          return i.rejoinAfterMs ? i.rejoinAfterMs(e) : [1e3, 2e3, 5e3][e - 1] || 1e4;
        }, this.reconnectAfterMs = function (e) {
          return n.unloaded ? 100 : i.reconnectAfterMs ? i.reconnectAfterMs(e) : [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][e - 1] || 5e3;
        }, this.logger = i.logger || null, this.longpollerTimeout = i.longpollerTimeout || 2e4, this.params = k(i.params || {}), this.endPoint = "".concat(t, "/").concat(m.websocket), this.vsn = i.vsn || f, this.heartbeatTimer = null, this.pendingHeartbeatRef = null, this.reconnectTimer = new S(function () {
          n.teardown(function () {
            return n.connect();
          });
        }, this.reconnectAfterMs);
      }

      return c(e, [{
        key: "protocol",
        value: function value() {
          return location.protocol.match(/^https/) ? "wss" : "ws";
        }
      }, {
        key: "endPointURL",
        value: function value() {
          var e = w.appendParams(w.appendParams(this.endPoint, this.params()), {
            vsn: this.vsn
          });
          return "/" !== e.charAt(0) ? e : "/" === e.charAt(1) ? "".concat(this.protocol(), ":").concat(e) : "".concat(this.protocol(), "://").concat(location.host).concat(e);
        }
      }, {
        key: "disconnect",
        value: function value(e, t, n) {
          this.closeWasClean = !0, this.reconnectTimer.reset(), this.teardown(e, t, n);
        }
      }, {
        key: "connect",
        value: function value(e) {
          var t = this;
          e && (console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"), this.params = k(e)), this.conn || (this.closeWasClean = !1, this.conn = new this.transport(this.endPointURL()), this.conn.binaryType = this.binaryType, this.conn.timeout = this.longpollerTimeout, this.conn.onopen = function () {
            return t.onConnOpen();
          }, this.conn.onerror = function (e) {
            return t.onConnError(e);
          }, this.conn.onmessage = function (e) {
            return t.onConnMessage(e);
          }, this.conn.onclose = function (e) {
            return t.onConnClose(e);
          });
        }
      }, {
        key: "log",
        value: function value(e, t, n) {
          this.logger(e, t, n);
        }
      }, {
        key: "hasLogger",
        value: function value() {
          return null !== this.logger;
        }
      }, {
        key: "onOpen",
        value: function value(e) {
          var t = this.makeRef();
          return this.stateChangeCallbacks.open.push([t, e]), t;
        }
      }, {
        key: "onClose",
        value: function value(e) {
          var t = this.makeRef();
          return this.stateChangeCallbacks.close.push([t, e]), t;
        }
      }, {
        key: "onError",
        value: function value(e) {
          var t = this.makeRef();
          return this.stateChangeCallbacks.error.push([t, e]), t;
        }
      }, {
        key: "onMessage",
        value: function value(e) {
          var t = this.makeRef();
          return this.stateChangeCallbacks.message.push([t, e]), t;
        }
      }, {
        key: "onConnOpen",
        value: function value() {
          this.hasLogger() && this.log("transport", "connected to ".concat(this.endPointURL())), this.unloaded = !1, this.closeWasClean = !1, this.flushSendBuffer(), this.reconnectTimer.reset(), this.resetHeartbeat(), this.stateChangeCallbacks.open.forEach(function (e) {
            return (0, r(e, 2)[1])();
          });
        }
      }, {
        key: "resetHeartbeat",
        value: function value() {
          var e = this;
          this.conn && this.conn.skipHeartbeat || (this.pendingHeartbeatRef = null, clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(function () {
            return e.sendHeartbeat();
          }, this.heartbeatIntervalMs));
        }
      }, {
        key: "teardown",
        value: function value(e, t, n) {
          this.conn && (this.conn.onclose = function () {}, t ? this.conn.close(t, n || "") : this.conn.close(), this.conn = null), e && e();
        }
      }, {
        key: "onConnClose",
        value: function value(e) {
          this.hasLogger() && this.log("transport", "close", e), this.triggerChanError(), clearInterval(this.heartbeatTimer), this.closeWasClean || this.reconnectTimer.scheduleTimeout(), this.stateChangeCallbacks.close.forEach(function (t) {
            return (0, r(t, 2)[1])(e);
          });
        }
      }, {
        key: "onConnError",
        value: function value(e) {
          this.hasLogger() && this.log("transport", e), this.triggerChanError(), this.stateChangeCallbacks.error.forEach(function (t) {
            return (0, r(t, 2)[1])(e);
          });
        }
      }, {
        key: "triggerChanError",
        value: function value() {
          this.channels.forEach(function (e) {
            e.isErrored() || e.isLeaving() || e.isClosed() || e.trigger(y.error);
          });
        }
      }, {
        key: "connectionState",
        value: function value() {
          switch (this.conn && this.conn.readyState) {
            case d.connecting:
              return "connecting";

            case d.open:
              return "open";

            case d.closing:
              return "closing";

            default:
              return "closed";
          }
        }
      }, {
        key: "isConnected",
        value: function value() {
          return "open" === this.connectionState();
        }
      }, {
        key: "remove",
        value: function value(e) {
          this.off(e.stateChangeRefs), this.channels = this.channels.filter(function (t) {
            return t.joinRef() !== e.joinRef();
          });
        }
      }, {
        key: "off",
        value: function value(e) {
          for (var t in this.stateChangeCallbacks) {
            this.stateChangeCallbacks[t] = this.stateChangeCallbacks[t].filter(function (t) {
              var n = r(t, 1)[0];
              return !e.includes(n);
            });
          }
        }
      }, {
        key: "channel",
        value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
              n = new j(e, t, this);
          return this.channels.push(n), n;
        }
      }, {
        key: "push",
        value: function value(e) {
          var t = this;

          if (this.hasLogger()) {
            var n = e.topic,
                i = e.event,
                o = e.payload,
                r = e.ref,
                s = e.join_ref;
            this.log("push", "".concat(n, " ").concat(i, " (").concat(s, ", ").concat(r, ")"), o);
          }

          this.isConnected() ? this.encode(e, function (e) {
            return t.conn.send(e);
          }) : this.sendBuffer.push(function () {
            return t.encode(e, function (e) {
              return t.conn.send(e);
            });
          });
        }
      }, {
        key: "makeRef",
        value: function value() {
          var e = this.ref + 1;
          return e === this.ref ? this.ref = 0 : this.ref = e, this.ref.toString();
        }
      }, {
        key: "sendHeartbeat",
        value: function value() {
          if (this.isConnected()) {
            if (this.pendingHeartbeatRef) return this.pendingHeartbeatRef = null, this.hasLogger() && this.log("transport", "heartbeat timeout. Attempting to re-establish connection"), void this.abnormalClose("heartbeat timeout");
            this.pendingHeartbeatRef = this.makeRef(), this.push({
              topic: "phoenix",
              event: "heartbeat",
              payload: {},
              ref: this.pendingHeartbeatRef
            });
          }
        }
      }, {
        key: "abnormalClose",
        value: function value(e) {
          this.closeWasClean = !1, this.conn.close(1e3, e);
        }
      }, {
        key: "flushSendBuffer",
        value: function value() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach(function (e) {
            return e();
          }), this.sendBuffer = []);
        }
      }, {
        key: "onConnMessage",
        value: function value(e) {
          var t = this;
          this.decode(e.data, function (e) {
            var n = e.topic,
                i = e.event,
                o = e.payload,
                s = e.ref,
                a = e.join_ref;
            s && s === t.pendingHeartbeatRef && (t.pendingHeartbeatRef = null), t.hasLogger() && t.log("receive", "".concat(o.status || "", " ").concat(n, " ").concat(i, " ").concat(s && "(" + s + ")" || ""), o);

            for (var c = 0; c < t.channels.length; c++) {
              var u = t.channels[c];
              u.isMember(n, i, o, a) && u.trigger(i, o, s, a);
            }

            for (var h = 0; h < t.stateChangeCallbacks.message.length; h++) {
              (0, r(t.stateChangeCallbacks.message[h], 2)[1])(e);
            }
          });
        }
      }]), e;
    }(),
        T = function () {
      function e(t) {
        s(this, e), this.endPoint = null, this.token = null, this.skipHeartbeat = !0, this.onopen = function () {}, this.onerror = function () {}, this.onmessage = function () {}, this.onclose = function () {}, this.pollEndpoint = this.normalizeEndpoint(t), this.readyState = d.connecting, this.poll();
      }

      return c(e, [{
        key: "normalizeEndpoint",
        value: function value(e) {
          return e.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + m.websocket), "$1/" + m.longpoll);
        }
      }, {
        key: "endpointURL",
        value: function value() {
          return w.appendParams(this.pollEndpoint, {
            token: this.token
          });
        }
      }, {
        key: "closeAndRetry",
        value: function value() {
          this.close(), this.readyState = d.connecting;
        }
      }, {
        key: "ontimeout",
        value: function value() {
          this.onerror("timeout"), this.closeAndRetry();
        }
      }, {
        key: "poll",
        value: function value() {
          var e = this;
          this.readyState !== d.open && this.readyState !== d.connecting || w.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), function (t) {
            if (t) {
              var n = t.status,
                  i = t.token,
                  o = t.messages;
              e.token = i;
            } else n = 0;

            switch (n) {
              case 200:
                o.forEach(function (t) {
                  return e.onmessage({
                    data: t
                  });
                }), e.poll();
                break;

              case 204:
                e.poll();
                break;

              case 410:
                e.readyState = d.open, e.onopen(), e.poll();
                break;

              case 0:
              case 500:
                e.onerror(), e.closeAndRetry();
                break;

              default:
                throw new Error("unhandled poll status ".concat(n));
            }
          });
        }
      }, {
        key: "send",
        value: function value(e) {
          var t = this;
          w.request("POST", this.endpointURL(), "application/json", e, this.timeout, this.onerror.bind(this, "timeout"), function (e) {
            e && 200 === e.status || (t.onerror(e && e.status), t.closeAndRetry());
          });
        }
      }, {
        key: "close",
        value: function value(e, t) {
          this.readyState = d.closed, this.onclose();
        }
      }]), e;
    }(),
        w = function () {
      function e() {
        s(this, e);
      }

      return c(e, null, [{
        key: "request",
        value: function value(e, t, n, i, o, r, s) {
          if (l.XDomainRequest) {
            var a = new XDomainRequest();
            this.xdomainRequest(a, e, t, i, o, r, s);
          } else {
            var c = l.XMLHttpRequest ? new l.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            this.xhrRequest(c, e, t, n, i, o, r, s);
          }
        }
      }, {
        key: "xdomainRequest",
        value: function value(e, t, n, i, o, r, s) {
          var a = this;
          e.timeout = o, e.open(t, n), e.onload = function () {
            var t = a.parseJSON(e.responseText);
            s && s(t);
          }, r && (e.ontimeout = r), e.onprogress = function () {}, e.send(i);
        }
      }, {
        key: "xhrRequest",
        value: function value(e, t, n, i, o, r, s, a) {
          var c = this;
          e.open(t, n, !0), e.timeout = r, e.setRequestHeader("Content-Type", i), e.onerror = function () {
            a && a(null);
          }, e.onreadystatechange = function () {
            if (e.readyState === c.states.complete && a) {
              var t = c.parseJSON(e.responseText);
              a(t);
            }
          }, s && (e.ontimeout = s), e.send(o);
        }
      }, {
        key: "parseJSON",
        value: function value(e) {
          if (!e || "" === e) return null;

          try {
            return JSON.parse(e);
          } catch (t) {
            return console && console.log("failed to parse JSON response", e), null;
          }
        }
      }, {
        key: "serialize",
        value: function value(e, t) {
          var n = [];

          for (var i in e) {
            if (e.hasOwnProperty(i)) {
              var r = t ? "".concat(t, "[").concat(i, "]") : i,
                  s = e[i];
              "object" === o(s) ? n.push(this.serialize(s, r)) : n.push(encodeURIComponent(r) + "=" + encodeURIComponent(s));
            }
          }

          return n.join("&");
        }
      }, {
        key: "appendParams",
        value: function value(e, t) {
          if (0 === Object.keys(t).length) return e;
          var n = e.match(/\?/) ? "&" : "?";
          return "".concat(e).concat(n).concat(this.serialize(t));
        }
      }]), e;
    }();

    w.states = {
      complete: 4
    };

    var E = function () {
      function e(t) {
        var n = this,
            i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        s(this, e);
        var o = i.events || {
          state: "presence_state",
          diff: "presence_diff"
        };
        this.state = {}, this.pendingDiffs = [], this.channel = t, this.joinRef = null, this.caller = {
          onJoin: function onJoin() {},
          onLeave: function onLeave() {},
          onSync: function onSync() {}
        }, this.channel.on(o.state, function (t) {
          var i = n.caller,
              o = i.onJoin,
              r = i.onLeave,
              s = i.onSync;
          n.joinRef = n.channel.joinRef(), n.state = e.syncState(n.state, t, o, r), n.pendingDiffs.forEach(function (t) {
            n.state = e.syncDiff(n.state, t, o, r);
          }), n.pendingDiffs = [], s();
        }), this.channel.on(o.diff, function (t) {
          var i = n.caller,
              o = i.onJoin,
              r = i.onLeave,
              s = i.onSync;
          n.inPendingSyncState() ? n.pendingDiffs.push(t) : (n.state = e.syncDiff(n.state, t, o, r), s());
        });
      }

      return c(e, [{
        key: "onJoin",
        value: function value(e) {
          this.caller.onJoin = e;
        }
      }, {
        key: "onLeave",
        value: function value(e) {
          this.caller.onLeave = e;
        }
      }, {
        key: "onSync",
        value: function value(e) {
          this.caller.onSync = e;
        }
      }, {
        key: "list",
        value: function value(t) {
          return e.list(this.state, t);
        }
      }, {
        key: "inPendingSyncState",
        value: function value() {
          return !this.joinRef || this.joinRef !== this.channel.joinRef();
        }
      }], [{
        key: "syncState",
        value: function value(e, t, n, i) {
          var o = this,
              r = this.clone(e),
              s = {},
              a = {};
          return this.map(r, function (e, n) {
            t[e] || (a[e] = n);
          }), this.map(t, function (e, t) {
            var n = r[e];

            if (n) {
              var i = t.metas.map(function (e) {
                return e.phx_ref;
              }),
                  c = n.metas.map(function (e) {
                return e.phx_ref;
              }),
                  u = t.metas.filter(function (e) {
                return c.indexOf(e.phx_ref) < 0;
              }),
                  h = n.metas.filter(function (e) {
                return i.indexOf(e.phx_ref) < 0;
              });
              u.length > 0 && (s[e] = t, s[e].metas = u), h.length > 0 && (a[e] = o.clone(n), a[e].metas = h);
            } else s[e] = t;
          }), this.syncDiff(r, {
            joins: s,
            leaves: a
          }, n, i);
        }
      }, {
        key: "syncDiff",
        value: function value(e, t, n, o) {
          var r = t.joins,
              s = t.leaves,
              a = this.clone(e);
          return n || (n = function n() {}), o || (o = function o() {}), this.map(r, function (e, t) {
            var o = a[e];

            if (a[e] = t, o) {
              var r,
                  s = a[e].metas.map(function (e) {
                return e.phx_ref;
              }),
                  c = o.metas.filter(function (e) {
                return s.indexOf(e.phx_ref) < 0;
              });
              (r = a[e].metas).unshift.apply(r, i(c));
            }

            n(e, o, t);
          }), this.map(s, function (e, t) {
            var n = a[e];

            if (n) {
              var i = t.metas.map(function (e) {
                return e.phx_ref;
              });
              n.metas = n.metas.filter(function (e) {
                return i.indexOf(e.phx_ref) < 0;
              }), o(e, n, t), 0 === n.metas.length && delete a[e];
            }
          }), a;
        }
      }, {
        key: "list",
        value: function value(e, t) {
          return t || (t = function t(e, _t) {
            return _t;
          }), this.map(e, function (e, n) {
            return t(e, n);
          });
        }
      }, {
        key: "map",
        value: function value(e, t) {
          return Object.getOwnPropertyNames(e).map(function (n) {
            return t(n, e[n]);
          });
        }
      }, {
        key: "clone",
        value: function value(e) {
          return JSON.parse(JSON.stringify(e));
        }
      }]), e;
    }(),
        S = function () {
      function e(t, n) {
        s(this, e), this.callback = t, this.timerCalc = n, this.timer = null, this.tries = 0;
      }

      return c(e, [{
        key: "reset",
        value: function value() {
          this.tries = 0, clearTimeout(this.timer);
        }
      }, {
        key: "scheduleTimeout",
        value: function value() {
          var e = this;
          clearTimeout(this.timer), this.timer = setTimeout(function () {
            e.tries = e.tries + 1, e.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }]), e;
    }();
  }]);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e, t) {
  "object" == ( false ? undefined : _typeof(exports)) && "object" == ( false ? undefined : _typeof(module)) ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : undefined;
}(this, function () {
  return function (e) {
    var t = {};

    function n(i) {
      if (t[i]) return t[i].exports;
      var r = t[i] = {
        i: i,
        l: !1,
        exports: {}
      };
      return e[i].call(r.exports, r, r.exports, n), r.l = !0, r.exports;
    }

    return n.m = e, n.c = t, n.d = function (e, t, i) {
      n.o(e, t) || Object.defineProperty(e, t, {
        configurable: !1,
        enumerable: !0,
        get: i
      });
    }, n.r = function (e) {
      Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, n.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e["default"];
      } : function () {
        return e;
      };
      return n.d(t, "a", t), t;
    }, n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, n.p = "", n(n.s = 2);
  }([function (e, t, n) {
    "use strict";

    n.r(t);
    var i,
        r = 11;
    var o = "http://www.w3.org/1999/xhtml",
        a = "undefined" == typeof document ? void 0 : document,
        u = !!a && "content" in a.createElement("template"),
        c = !!a && a.createRange && "createContextualFragment" in a.createRange();

    function s(e) {
      return e = e.trim(), u ? function (e) {
        var t = a.createElement("template");
        return t.innerHTML = e, t.content.childNodes[0];
      }(e) : c ? function (e) {
        return i || (i = a.createRange()).selectNode(a.body), i.createContextualFragment(e).childNodes[0];
      }(e) : function (e) {
        var t = a.createElement("body");
        return t.innerHTML = e, t.childNodes[0];
      }(e);
    }

    function l(e, t) {
      var n = e.nodeName,
          i = t.nodeName;
      return n === i || !!(t.actualize && n.charCodeAt(0) < 91 && i.charCodeAt(0) > 90) && n === i.toUpperCase();
    }

    function d(e, t, n) {
      e[n] !== t[n] && (e[n] = t[n], e[n] ? e.setAttribute(n, "") : e.removeAttribute(n));
    }

    var h = {
      OPTION: function OPTION(e, t) {
        var n = e.parentNode;

        if (n) {
          var i = n.nodeName.toUpperCase();
          "OPTGROUP" === i && (i = (n = n.parentNode) && n.nodeName.toUpperCase()), "SELECT" !== i || n.hasAttribute("multiple") || (e.hasAttribute("selected") && !t.selected && (e.setAttribute("selected", "selected"), e.removeAttribute("selected")), n.selectedIndex = -1);
        }

        d(e, t, "selected");
      },
      INPUT: function INPUT(e, t) {
        d(e, t, "checked"), d(e, t, "disabled"), e.value !== t.value && (e.value = t.value), t.hasAttribute("value") || e.removeAttribute("value");
      },
      TEXTAREA: function TEXTAREA(e, t) {
        var n = t.value;
        e.value !== n && (e.value = n);
        var i = e.firstChild;

        if (i) {
          var r = i.nodeValue;
          if (r == n || !n && r == e.placeholder) return;
          i.nodeValue = n;
        }
      },
      SELECT: function SELECT(e, t) {
        if (!t.hasAttribute("multiple")) {
          for (var n, i, r = -1, o = 0, a = e.firstChild; a;) {
            if ("OPTGROUP" === (i = a.nodeName && a.nodeName.toUpperCase())) a = (n = a).firstChild;else {
              if ("OPTION" === i) {
                if (a.hasAttribute("selected")) {
                  r = o;
                  break;
                }

                o++;
              }

              !(a = a.nextSibling) && n && (a = n.nextSibling, n = null);
            }
          }

          e.selectedIndex = r;
        }
      }
    },
        f = 1,
        v = 11,
        p = 3,
        g = 8;

    function m() {}

    function y(e) {
      if (e) return e.getAttribute && e.getAttribute("id") || e.id;
    }

    var k = function (e) {
      return function (t, n, i) {
        if (i || (i = {}), "string" == typeof n) if ("#document" === t.nodeName || "HTML" === t.nodeName) {
          var r = n;
          (n = a.createElement("html")).innerHTML = r;
        } else n = s(n);
        var u = i.getNodeKey || y,
            c = i.onBeforeNodeAdded || m,
            d = i.onNodeAdded || m,
            k = i.onBeforeElUpdated || m,
            b = i.onElUpdated || m,
            w = i.onBeforeNodeDiscarded || m,
            x = i.onNodeDiscarded || m,
            A = i.onBeforeElChildrenUpdated || m,
            E = !0 === i.childrenOnly,
            C = Object.create(null),
            S = [];

        function P(e) {
          S.push(e);
        }

        function L(e, t, n) {
          !1 !== w(e) && (t && t.removeChild(e), x(e), function e(t, n) {
            if (t.nodeType === f) for (var i = t.firstChild; i;) {
              var r = void 0;
              n && (r = u(i)) ? P(r) : (x(i), i.firstChild && e(i, n)), i = i.nextSibling;
            }
          }(e, n));
        }

        function T(e) {
          d(e);

          for (var t = e.firstChild; t;) {
            var n = t.nextSibling,
                i = u(t);

            if (i) {
              var r = C[i];
              r && l(t, r) && (t.parentNode.replaceChild(r, t), I(r, t));
            }

            T(t), t = n;
          }
        }

        function I(t, n, i) {
          var r = u(n);

          if (r && delete C[r], !i) {
            if (!1 === k(t, n)) return;
            if (e(t, n), b(t), !1 === A(t, n)) return;
          }

          "TEXTAREA" !== t.nodeName ? function (e, t) {
            var n,
                i,
                r,
                o,
                s,
                d = t.firstChild,
                v = e.firstChild;

            e: for (; d;) {
              for (o = d.nextSibling, n = u(d); v;) {
                if (r = v.nextSibling, d.isSameNode && d.isSameNode(v)) {
                  d = o, v = r;
                  continue e;
                }

                i = u(v);
                var m = v.nodeType,
                    y = void 0;

                if (m === d.nodeType && (m === f ? (n ? n !== i && ((s = C[n]) ? r === s ? y = !1 : (e.insertBefore(s, v), i ? P(i) : L(v, e, !0), v = s) : y = !1) : i && (y = !1), (y = !1 !== y && l(v, d)) && I(v, d)) : m !== p && m != g || (y = !0, v.nodeValue !== d.nodeValue && (v.nodeValue = d.nodeValue))), y) {
                  d = o, v = r;
                  continue e;
                }

                i ? P(i) : L(v, e, !0), v = r;
              }

              if (n && (s = C[n]) && l(s, d)) e.appendChild(s), I(s, d);else {
                var k = c(d);
                !1 !== k && (k && (d = k), d.actualize && (d = d.actualize(e.ownerDocument || a)), e.appendChild(d), T(d));
              }
              d = o, v = r;
            }

            !function (e, t, n) {
              for (; t;) {
                var i = t.nextSibling;
                (n = u(t)) ? P(n) : L(t, e, !0), t = i;
              }
            }(e, v, i);
            var b = h[e.nodeName];
            b && b(e, t);
          }(t, n) : h.TEXTAREA(t, n);
        }

        !function e(t) {
          if (t.nodeType === f || t.nodeType === v) for (var n = t.firstChild; n;) {
            var i = u(n);
            i && (C[i] = n), e(n), n = n.nextSibling;
          }
        }(t);
        var N = t,
            D = N.nodeType,
            R = n.nodeType;
        if (!E) if (D === f) R === f ? l(t, n) || (x(t), N = function (e, t) {
          for (var n = e.firstChild; n;) {
            var i = n.nextSibling;
            t.appendChild(n), n = i;
          }

          return t;
        }(t, function (e, t) {
          return t && t !== o ? a.createElementNS(t, e) : a.createElement(e);
        }(n.nodeName, n.namespaceURI))) : N = n;else if (D === p || D === g) {
          if (R === D) return N.nodeValue !== n.nodeValue && (N.nodeValue = n.nodeValue), N;
          N = n;
        }
        if (N === n) x(t);else {
          if (n.isSameNode && n.isSameNode(N)) return;
          if (I(N, n, E), S) for (var _ = 0, O = S.length; _ < O; _++) {
            var H = C[S[_]];
            H && L(H, H.parentNode, !1);
          }
        }
        return !E && N !== t && t.parentNode && (N.actualize && (N = N.actualize(t.ownerDocument || a)), t.parentNode.replaceChild(N, t)), N;
      };
    }(function (e, t) {
      var n,
          i,
          o,
          a,
          u = t.attributes;

      if (t.nodeType !== r && e.nodeType !== r) {
        for (var c = u.length - 1; c >= 0; c--) {
          i = (n = u[c]).name, o = n.namespaceURI, a = n.value, o ? (i = n.localName || i, e.getAttributeNS(o, i) !== a && ("xmlns" === n.prefix && (i = n.name), e.setAttributeNS(o, i, a))) : e.getAttribute(i) !== a && e.setAttribute(i, a);
        }

        for (var s = e.attributes, l = s.length - 1; l >= 0; l--) {
          i = (n = s[l]).name, (o = n.namespaceURI) ? (i = n.localName || i, t.hasAttributeNS(o, i) || e.removeAttributeNS(o, i)) : t.hasAttribute(i) || e.removeAttribute(i);
        }
      }
    });

    function b(e) {
      return S(e) || function (e) {
        if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e);
      }(e) || C();
    }

    function w(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    function x(e, t) {
      for (var n = 0; n < t.length; n++) {
        var i = t[n];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
      }
    }

    function A(e, t, n) {
      return t && x(e.prototype, t), n && x(e, n), e;
    }

    function E(e, t) {
      return S(e) || function (e, t) {
        var n = [],
            i = !0,
            r = !1,
            o = void 0;

        try {
          for (var a, u = e[Symbol.iterator](); !(i = (a = u.next()).done) && (n.push(a.value), !t || n.length !== t); i = !0) {
            ;
          }
        } catch (e) {
          r = !0, o = e;
        } finally {
          try {
            i || null == u["return"] || u["return"]();
          } finally {
            if (r) throw o;
          }
        }

        return n;
      }(e, t) || C();
    }

    function C() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }

    function S(e) {
      if (Array.isArray(e)) return e;
    }

    function P(e) {
      return (P = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
      })(e);
    }

    n.d(t, "debug", function () {
      return M;
    }), n.d(t, "Rendered", function () {
      return G;
    }), n.d(t, "LiveSocket", function () {
      return Y;
    }), n.d(t, "Browser", function () {
      return z;
    }), n.d(t, "DOM", function () {
      return $;
    }), n.d(t, "View", function () {
      return Z;
    });

    var L = [1e3, 3e3],
        T = "data-phx-view",
        I = ["phx-click-loading", "phx-change-loading", "phx-submit-loading", "phx-keydown-loading", "phx-keyup-loading", "phx-blur-loading", "phx-focus-loading"],
        N = "data-phx-component",
        D = "data-phx-ref",
        R = "[".concat(T, "]"),
        _ = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time"],
        O = ["checkbox", "radio"],
        H = 1,
        j = "phx-",
        B = {
      debounce: 300,
      throttle: 300
    },
        J = function J(e, t) {
      return console.error && console.error(e, t);
    };

    var M = function M(e, t, n, i) {
      e.liveSocket.isDebugEnabled() && console.log("".concat(e.id, " ").concat(t, ": ").concat(n, " - "), i);
    },
        F = function F(e) {
      return "function" == typeof e ? e : function () {
        return e;
      };
    },
        V = function V(e) {
      return JSON.parse(JSON.stringify(e));
    },
        U = function U(e, t, n) {
      do {
        if (e.matches("[".concat(t, "]"))) return e;
        e = e.parentElement || e.parentNode;
      } while (null !== e && 1 === e.nodeType && !(n && n.isSameNode(e) || e.matches(R)));

      return null;
    },
        K = function K(e) {
      return null !== e && "object" === P(e) && !(e instanceof Array);
    },
        q = function q(e) {
      for (var t in e) {
        return !1;
      }

      return !0;
    },
        W = function W(e, t) {
      return e && t(e);
    },
        X = function X(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = new FormData(e),
          i = new URLSearchParams(),
          r = !0,
          o = !1,
          a = void 0;

      try {
        for (var u, c = n.entries()[Symbol.iterator](); !(r = (u = c.next()).done); r = !0) {
          var s = E(u.value, 2),
              l = s[0],
              d = s[1];
          i.append(l, d);
        }
      } catch (e) {
        o = !0, a = e;
      } finally {
        try {
          r || null == c["return"] || c["return"]();
        } finally {
          if (o) throw a;
        }
      }

      for (var h in t) {
        i.append(h, t[h]);
      }

      return i.toString();
    },
        G = function () {
      function e(t, n) {
        w(this, e), this.viewId = t, this.replaceRendered(n);
      }

      return A(e, [{
        key: "parentViewId",
        value: function value() {
          return this.viewId;
        }
      }, {
        key: "toString",
        value: function value(e) {
          return this.recursiveToString(this.rendered, this.rendered.c, e);
        }
      }, {
        key: "recursiveToString",
        value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e.c || {},
              n = arguments.length > 2 ? arguments[2] : void 0,
              i = {
            buffer: "",
            components: t,
            onlyCids: n = n ? new Set(n) : null
          };
          return this.toOutputBuffer(e, i), i.buffer;
        }
      }, {
        key: "componentCIDs",
        value: function value(e) {
          return Object.keys(e.c || {}).map(function (e) {
            return parseInt(e);
          });
        }
      }, {
        key: "isComponentOnlyDiff",
        value: function value(e) {
          return !!e.c && 0 === Object.keys(e).filter(function (e) {
            return "title" !== e && "c" !== e;
          }).length;
        }
      }, {
        key: "mergeDiff",
        value: function value(e) {
          !e.c && this.isNewFingerprint(e) ? this.replaceRendered(e) : this.recursiveMerge(this.rendered, e);
        }
      }, {
        key: "recursiveMerge",
        value: function value(e, t) {
          for (var n in t) {
            var i = t[n],
                r = e[n];
            K(i) && K(r) ? (r.d && !i.d && delete r.d, this.recursiveMerge(r, i)) : e[n] = i;
          }
        }
      }, {
        key: "componentToString",
        value: function value(e) {
          return this.recursiveCIDToString(this.rendered.c, e);
        }
      }, {
        key: "pruneCIDs",
        value: function value(e) {
          var t = this;
          e.forEach(function (e) {
            return delete t.rendered.c[e];
          });
        }
      }, {
        key: "get",
        value: function value() {
          return this.rendered;
        }
      }, {
        key: "replaceRendered",
        value: function value(e) {
          this.rendered = e, this.rendered.c = this.rendered.c || {};
        }
      }, {
        key: "isNewFingerprint",
        value: function value() {
          return !!(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).s;
        }
      }, {
        key: "toOutputBuffer",
        value: function value(e, t) {
          if (e.d) return this.comprehensionToBuffer(e, t);
          var n = e.s;
          t.buffer += n[0];

          for (var i = 1; i < n.length; i++) {
            this.dynamicToBuffer(e[i - 1], t), t.buffer += n[i];
          }
        }
      }, {
        key: "comprehensionToBuffer",
        value: function value(e, t) {
          for (var n = e.d, i = e.s, r = 0; r < n.length; r++) {
            var o = n[r];
            t.buffer += i[0];

            for (var a = 1; a < i.length; a++) {
              this.dynamicToBuffer(o[a - 1], t), t.buffer += i[a];
            }
          }
        }
      }, {
        key: "dynamicToBuffer",
        value: function value(e, t) {
          "number" == typeof e ? t.buffer += this.recursiveCIDToString(t.components, e, t.onlyCids) : K(e) ? this.toOutputBuffer(e, t) : t.buffer += e;
        }
      }, {
        key: "recursiveCIDToString",
        value: function value(e, t, n) {
          var i = this,
              r = e[t] || J("no component for CID ".concat(t), e),
              o = document.createElement("template");
          o.innerHTML = this.recursiveToString(r, e, n);
          var a = o.content,
              u = n && !n.has(t);
          return Array.from(a.childNodes).forEach(function (e, n) {
            if (e.nodeType === Node.ELEMENT_NODE) e.setAttribute(N, t), e.id || (e.id = "".concat(i.parentViewId(), "-").concat(t, "-").concat(n)), u && (e.setAttribute("data-phx-skip", ""), e.innerHTML = "");else if ("" !== e.nodeValue.trim()) {
              J("only HTML element tags are allowed at the root of components.\n\n" + 'got: "'.concat(e.nodeValue.trim(), '"\n\n') + "within:\n", o.innerHTML.trim());
              var r = document.createElement("span");
              r.innerText = e.nodeValue, r.setAttribute(N, t), e.replaceWith(r);
            } else e.remove();
          }), o.innerHTML;
        }
      }]), e;
    }(),
        Y = function () {
      function e(t, n) {
        var i = this,
            r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (w(this, e), this.unloaded = !1, !n || "Object" === n.constructor.name) throw new Error('\n      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:\n\n          import {Socket} from "phoenix"\n          import {LiveSocket} from "phoenix_live_view"\n          let liveSocket = new LiveSocket("/live", Socket, {...})\n      ');
        this.socket = new n(t, r), this.bindingPrefix = r.bindingPrefix || j, this.opts = r, this.params = F(r.params || {}), this.viewLogger = r.viewLogger, this.defaults = Object.assign(V(B), r.defaults || {}), this.activeElement = null, this.prevActive = null, this.silenced = !1, this.main = null, this.linkRef = 0, this.roots = {}, this.href = window.location.href, this.pendingLink = null, this.currentLocation = V(window.location), this.hooks = r.hooks || {}, this.loaderTimeout = r.loaderTimeout || H, this.socket.onOpen(function () {
          i.isUnloaded() && (i.destroyAllViews(), i.joinRootViews()), i.unloaded = !1;
        }), window.addEventListener("unload", function (e) {
          i.unloaded = !0;
        });
      }

      return A(e, [{
        key: "isProfileEnabled",
        value: function value() {
          return "true" === sessionStorage.getItem("phx:live-socket:profiling");
        }
      }, {
        key: "isDebugEnabled",
        value: function value() {
          return "true" === sessionStorage.getItem("phx:live-socket:debug");
        }
      }, {
        key: "enableDebug",
        value: function value() {
          sessionStorage.setItem("phx:live-socket:debug", "true");
        }
      }, {
        key: "enableProfiling",
        value: function value() {
          sessionStorage.setItem("phx:live-socket:profiling", "true");
        }
      }, {
        key: "disableDebug",
        value: function value() {
          sessionStorage.removeItem("phx:live-socket:debug");
        }
      }, {
        key: "disableProfiling",
        value: function value() {
          sessionStorage.removeItem("phx:live-socket:profiling");
        }
      }, {
        key: "enableLatencySim",
        value: function value(e) {
          this.enableDebug(), console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable"), sessionStorage.setItem("phx:live-socket:latency-sim", e);
        }
      }, {
        key: "disableLatencySim",
        value: function value() {
          sessionStorage.removeItem("phx:live-socket:latency-sim");
        }
      }, {
        key: "getLatencySim",
        value: function value() {
          var e = sessionStorage.getItem("phx:live-socket:latency-sim");
          return e ? parseInt(e) : null;
        }
      }, {
        key: "getSocket",
        value: function value() {
          return this.socket;
        }
      }, {
        key: "connect",
        value: function value() {
          var e = this,
              t = function t() {
            e.joinRootViews() && (e.bindTopLevelEvents(), e.socket.connect());
          };

          ["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0 ? t() : document.addEventListener("DOMContentLoaded", function () {
            return t();
          });
        }
      }, {
        key: "disconnect",
        value: function value() {
          this.socket.disconnect();
        }
      }, {
        key: "time",
        value: function value(e, t) {
          if (!this.isProfileEnabled() || !console.time) return t();
          console.time(e);
          var n = t();
          return console.timeEnd(e), n;
        }
      }, {
        key: "log",
        value: function value(e, t, n) {
          if (this.viewLogger) {
            var i = E(n(), 2),
                r = i[0],
                o = i[1];
            this.viewLogger(e, t, r, o);
          } else if (this.isDebugEnabled()) {
            var a = E(n(), 2),
                u = a[0],
                c = a[1];
            M(e, t, u, c);
          }
        }
      }, {
        key: "onChannel",
        value: function value(e, t, n) {
          var i = this;
          e.on(t, function (e) {
            var t = i.getLatencySim();
            t ? (console.log("simulating ".concat(t, "ms of latency from server to client")), setTimeout(function () {
              return n(e);
            }, t)) : n(e);
          });
        }
      }, {
        key: "wrapPush",
        value: function value(e) {
          var t = this.getLatencySim();
          if (!t) return e();
          console.log("simulating ".concat(t, "ms of latency from client to server"));
          var n = {
            receives: [],
            receive: function receive(e, t) {
              this.receives.push([e, t]);
            }
          };
          return setTimeout(function () {
            n.receives.reduce(function (e, t) {
              var n = E(t, 2),
                  i = n[0],
                  r = n[1];
              return e.receive(i, r);
            }, e());
          }, t), n;
        }
      }, {
        key: "reloadWithJitter",
        value: function value(e) {
          var t = this;
          this.disconnect();
          var n = L[0],
              i = L[1],
              r = Math.floor(Math.random() * (i - n + 1)) + n,
              o = z.updateLocal(e.name(), "consecutive-reloads", 0, function (e) {
            return e + 1;
          });
          this.log(e, "join", function () {
            return ["encountered ".concat(o, " consecutive reloads")];
          }), o > 10 && (this.log(e, "join", function () {
            return ["exceeded ".concat(10, " consecutive reloads. Entering failsafe mode")];
          }), r = 3e4), setTimeout(function () {
            t.hasPendingLink() ? window.location = t.pendingLink : window.location.reload();
          }, r);
        }
      }, {
        key: "getHookCallbacks",
        value: function value(e) {
          return this.hooks[e];
        }
      }, {
        key: "isUnloaded",
        value: function value() {
          return this.unloaded;
        }
      }, {
        key: "isConnected",
        value: function value() {
          return this.socket.isConnected();
        }
      }, {
        key: "getBindingPrefix",
        value: function value() {
          return this.bindingPrefix;
        }
      }, {
        key: "binding",
        value: function value(e) {
          return "".concat(this.getBindingPrefix()).concat(e);
        }
      }, {
        key: "channel",
        value: function value(e, t) {
          return this.socket.channel(e, t);
        }
      }, {
        key: "joinRootViews",
        value: function value() {
          var e = this,
              t = !1;
          return $.all(document, "".concat(R, ":not([").concat("data-phx-parent-id", "])"), function (n) {
            var i = e.joinRootView(n, e.getHref());
            e.root = e.root || i, n.getAttribute("data-phx-main") && (e.main = i), t = !0;
          }), t;
        }
      }, {
        key: "redirect",
        value: function value(e, t) {
          this.disconnect(), z.redirect(e, t);
        }
      }, {
        key: "replaceMain",
        value: function value(e, t) {
          var n = this,
              i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
              r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : this.setPendingLink(e),
              o = this.main.el;
          this.main.destroy(), this.main.showLoader(this.loaderTimeout), z.fetchPage(e, function (a, u) {
            if (200 !== a) return n.redirect(e);
            var c = document.createElement("template");
            c.innerHTML = u;
            var s = c.content.childNodes[0];
            if (!s || !n.isPhxView(s)) return n.redirect(e);
            n.joinRootView(s, e, t, function (e, t) {
              1 === t && (n.commitPendingLink(r) ? (o.replaceWith(e.el), n.main = e, i && i()) : e.destroy());
            });
          });
        }
      }, {
        key: "isPhxView",
        value: function value(e) {
          return e.getAttribute && null !== e.getAttribute(T);
        }
      }, {
        key: "joinRootView",
        value: function value(e, t, n, i) {
          var r = new Z(e, this, null, t, n);
          return this.roots[r.id] = r, r.join(i), r;
        }
      }, {
        key: "owner",
        value: function value(e, t) {
          var n = this,
              i = W(e.closest(R), function (e) {
            return n.getViewByEl(e);
          });
          i && t(i);
        }
      }, {
        key: "withinTargets",
        value: function value(e, t, n) {
          var i = this;

          if (/^(0|[1-9](\d?)+)$/.test(t)) {
            var r = e;
            if (!r) throw new Error("no phx-target's found matching @myself of ".concat(t));
            this.owner(r, function (e) {
              return n(e, r);
            });
          } else {
            var o = Array.from(document.querySelectorAll(t));
            if (0 === o.length) throw new Error("no phx-target's found for selector \"".concat(t, '"'));
            o.forEach(function (e) {
              i.owner(e, function (t) {
                return n(t, e);
              });
            });
          }
        }
      }, {
        key: "withinOwners",
        value: function value(e, t) {
          var n = e.getAttribute(this.binding("target"));
          null === n ? this.owner(e, function (n) {
            return t(n, e);
          }) : this.withinTargets(e, n, t);
        }
      }, {
        key: "getViewByEl",
        value: function value(e) {
          var t = e.getAttribute("data-phx-root-id");
          return this.getRootById(t).getDescendentByEl(e);
        }
      }, {
        key: "getRootById",
        value: function value(e) {
          return this.roots[e];
        }
      }, {
        key: "onViewError",
        value: function value(e) {
          this.dropActiveElement(e);
        }
      }, {
        key: "destroyAllViews",
        value: function value() {
          for (var e in this.roots) {
            this.roots[e].destroy(), delete this.roots[e];
          }
        }
      }, {
        key: "destroyViewByEl",
        value: function value(e) {
          this.getRootById(e.getAttribute("data-phx-root-id")).destroyDescendent(e.id);
        }
      }, {
        key: "setActiveElement",
        value: function value(e) {
          var t = this;

          if (this.activeElement !== e) {
            this.activeElement = e;

            var n = function n() {
              e === t.activeElement && (t.activeElement = null), e.removeEventListener("mouseup", t), e.removeEventListener("touchend", t);
            };

            e.addEventListener("mouseup", n), e.addEventListener("touchend", n);
          }
        }
      }, {
        key: "getActiveElement",
        value: function value() {
          return document.activeElement === document.body && this.activeElement || document.activeElement;
        }
      }, {
        key: "dropActiveElement",
        value: function value(e) {
          this.prevActive && e.ownsElement(this.prevActive) && (this.prevActive = null);
        }
      }, {
        key: "restorePreviouslyActiveFocus",
        value: function value() {
          this.prevActive && this.prevActive !== document.body && this.prevActive.focus();
        }
      }, {
        key: "blurActiveElement",
        value: function value() {
          this.prevActive = this.getActiveElement(), this.prevActive !== document.body && this.prevActive.blur();
        }
      }, {
        key: "bindTopLevelEvents",
        value: function value() {
          var e = this;
          this.bindClicks(), this.bindNav(), this.bindForms(), this.bind({
            keyup: "keyup",
            keydown: "keydown"
          }, function (t, n, i, r, o, a, u) {
            var c = r.getAttribute(e.binding("key"));
            c && c.toLowerCase() !== t.key.toLowerCase() || i.pushKey(r, o, n, a, {
              altGraphKey: t.altGraphKey,
              altKey: t.altKey,
              code: t.code,
              ctrlKey: t.ctrlKey,
              key: t.key,
              keyIdentifier: t.keyIdentifier,
              keyLocation: t.keyLocation,
              location: t.location,
              metaKey: t.metaKey,
              repeat: t.repeat,
              shiftKey: t.shiftKey
            });
          }), this.bind({
            blur: "focusout",
            focus: "focusin"
          }, function (e, t, n, i, r, o, a) {
            a || n.pushEvent(t, i, r, o, {
              type: t
            });
          }), this.bind({
            blur: "blur",
            focus: "focus"
          }, function (e, t, n, i, r, o, a) {
            a && "window" !== !a && n.pushEvent(t, i, r, o, {
              type: e.type
            });
          });
        }
      }, {
        key: "setPendingLink",
        value: function value(e) {
          return this.linkRef++, this.pendingLink = e, this.linkRef;
        }
      }, {
        key: "commitPendingLink",
        value: function value(e) {
          return this.linkRef === e && (this.href = this.pendingLink, this.pendingLink = null, !0);
        }
      }, {
        key: "getHref",
        value: function value() {
          return this.href;
        }
      }, {
        key: "hasPendingLink",
        value: function value() {
          return !!this.pendingLink;
        }
      }, {
        key: "bind",
        value: function value(e, t) {
          var n = this,
              i = function i(_i) {
            var r = e[_i];
            n.on(r, function (e) {
              var r = n.binding(_i),
                  o = n.binding("window-".concat(_i)),
                  a = e.target.getAttribute && e.target.getAttribute(r);
              a ? n.debounce(e.target, e, function () {
                n.withinOwners(e.target, function (n, r) {
                  t(e, _i, n, e.target, r, a, null);
                });
              }) : $.all(document, "[".concat(o, "]"), function (r) {
                var a = r.getAttribute(o);
                n.debounce(r, e, function () {
                  n.withinOwners(r, function (n, o) {
                    t(e, _i, n, r, o, a, "window");
                  });
                });
              });
            });
          };

          for (var r in e) {
            i(r);
          }
        }
      }, {
        key: "bindClicks",
        value: function value() {
          var e = this;
          [!0, !1].forEach(function (t) {
            var n = t ? e.binding("capture-click") : e.binding("click");
            window.addEventListener("click", function (i) {
              var r = null,
                  o = (r = t ? i.target.matches("[".concat(n, "]")) ? i.target : i.target.querySelector("[".concat(n, "]")) : U(i.target, n)) && r.getAttribute(n);

              if (o) {
                "#" === r.getAttribute("href") && i.preventDefault();
                var a = {
                  altKey: i.altKey,
                  shiftKey: i.shiftKey,
                  ctrlKey: i.ctrlKey,
                  metaKey: i.metaKey,
                  x: i.x || i.clientX,
                  y: i.y || i.clientY,
                  pageX: i.pageX,
                  pageY: i.pageY,
                  screenX: i.screenX,
                  screenY: i.screenY,
                  offsetX: i.offsetX,
                  offsetY: i.offsetY,
                  detail: i.detail || 1
                };
                e.debounce(r, i, function () {
                  e.withinOwners(r, function (e, t) {
                    e.pushEvent("click", r, t, o, a);
                  });
                });
              }
            }, t);
          });
        }
      }, {
        key: "bindNav",
        value: function value() {
          var e = this;
          z.canPushState() && (window.onpopstate = function (t) {
            if (e.registerNewLocation(window.location)) {
              var n = t.state || {},
                  i = n.type,
                  r = n.id,
                  o = n.root,
                  a = window.location.href;
              e.main.isConnected() && "patch" === i && r === e.main.id ? e.main.pushLinkPatch(a, null) : e.replaceMain(a, null, function () {
                o && e.replaceRootHistory();
              });
            }
          }, window.addEventListener("click", function (t) {
            var n = U(t.target, "data-phx-link"),
                i = n && n.getAttribute("data-phx-link"),
                r = t.metaKey || t.ctrlKey || 1 === t.button;

            if (i && e.isConnected() && e.main && !r) {
              var o = n.href,
                  a = n.getAttribute("data-phx-link-state");
              if (t.preventDefault(), e.pendingLink !== o) if ("patch" === i) e.pushHistoryPatch(o, a, n);else {
                if ("redirect" !== i) throw new Error("expected ".concat("data-phx-link", ' to be "patch" or "redirect", got: ').concat(i));
                e.historyRedirect(o, a);
              }
            }
          }, !1));
        }
      }, {
        key: "withPageLoading",
        value: function value(e, t) {
          $.dispatchEvent(window, "phx:page-loading-start", e);

          var n = function n() {
            return $.dispatchEvent(window, "phx:page-loading-stop", e);
          };

          return t ? t(n) : n;
        }
      }, {
        key: "pushHistoryPatch",
        value: function value(e, t, n) {
          var i = this;
          this.withPageLoading({
            to: e,
            kind: "patch"
          }, function (r) {
            i.main.pushLinkPatch(e, n, function () {
              i.historyPatch(e, t), r();
            });
          });
        }
      }, {
        key: "historyPatch",
        value: function value(e, t) {
          z.pushState(t, {
            type: "patch",
            id: this.main.id
          }, e), this.registerNewLocation(window.location);
        }
      }, {
        key: "historyRedirect",
        value: function value(e, t, n) {
          var i = this;
          this.withPageLoading({
            to: e,
            kind: "redirect"
          }, function (r) {
            i.replaceMain(e, n, function () {
              z.pushState(t, {
                type: "redirect",
                id: i.main.id
              }, e), i.registerNewLocation(window.location), r();
            });
          });
        }
      }, {
        key: "replaceRootHistory",
        value: function value() {
          z.pushState("replace", {
            root: !0,
            type: "patch",
            id: this.main.id
          });
        }
      }, {
        key: "registerNewLocation",
        value: function value(e) {
          var t = this.currentLocation;
          return t.pathname + t.search !== e.pathname + e.search && (this.currentLocation = V(e), !0);
        }
      }, {
        key: "bindForms",
        value: function value() {
          var e = this,
              t = 0;
          this.on("submit", function (t) {
            var n = t.target.getAttribute(e.binding("submit"));
            n && (t.preventDefault(), t.target.disabled = !0, e.withinOwners(t.target, function (e, i) {
              return e.submitForm(t.target, i, n);
            }));
          }, !1);

          for (var n = ["change", "input"], i = function i() {
            var i = n[r];
            e.on(i, function (n) {
              var r = n.target,
                  o = r.form && r.form.getAttribute(e.binding("change"));

              if (o && ("number" !== r.type || !r.validity || !r.validity.badInput)) {
                var a = t;
                t++;
                var u = $["private"](r, "prev-iteration") || {},
                    c = u.at,
                    s = u.type;
                c === a - 1 && i !== s || ($.putPrivate(r, "prev-iteration", {
                  at: a,
                  type: i
                }), e.debounce(r, n, function () {
                  e.withinOwners(r.form, function (t, i) {
                    $.isTextualInput(r) ? $.putPrivate(r, "phx-has-focused", !0) : e.setActiveElement(r), t.pushInput(r, i, o, n.target);
                  });
                }));
              }
            }, !1);
          }, r = 0; r < n.length; r++) {
            i();
          }
        }
      }, {
        key: "debounce",
        value: function value(e, t, n) {
          var i = this.binding("debounce"),
              r = this.binding("throttle"),
              o = this.defaults.debounce.toString(),
              a = this.defaults.throttle.toString();
          $.debounce(e, t, i, o, r, a, n);
        }
      }, {
        key: "silenceEvents",
        value: function value(e) {
          this.silenced = !0, e(), this.silenced = !1;
        }
      }, {
        key: "on",
        value: function value(e, t) {
          var n = this;
          window.addEventListener(e, function (e) {
            n.silenced || t(e);
          });
        }
      }]), e;
    }(),
        z = {
      canPushState: function canPushState() {
        return void 0 !== history.pushState;
      },
      dropLocal: function dropLocal(e, t) {
        return window.localStorage.removeItem(this.localKey(e, t));
      },
      updateLocal: function updateLocal(e, t, n, i) {
        var r = this.getLocal(e, t),
            o = this.localKey(e, t),
            a = null === r ? n : i(r);
        return window.localStorage.setItem(o, JSON.stringify(a)), a;
      },
      getLocal: function getLocal(e, t) {
        return JSON.parse(window.localStorage.getItem(this.localKey(e, t)));
      },
      fetchPage: function fetchPage(e, t) {
        var n = new XMLHttpRequest();
        n.open("GET", e, !0), n.timeout = 3e4, n.setRequestHeader("content-type", "text/html"), n.setRequestHeader("cache-control", "max-age=0, no-cache, no-store, must-revalidate, post-check=0, pre-check=0"), n.setRequestHeader("x-requested-with", "live-link"), n.onerror = function () {
          return t(400);
        }, n.ontimeout = function () {
          return t(504);
        }, n.onreadystatechange = function () {
          if (4 === n.readyState) return "live-link" !== n.getResponseHeader("x-requested-with") ? t(400) : 200 !== n.status ? t(n.status) : void t(200, n.responseText);
        }, n.send();
      },
      pushState: function pushState(e, t, n) {
        if (this.canPushState()) {
          if (n !== window.location.href) {
            history[e + "State"](t, "", n || null);
            var i = this.getHashTargetEl(window.location.hash);
            i ? i.scrollIntoView() : "redirect" === t.type && window.scroll(0, 0);
          }
        } else this.redirect(n);
      },
      setCookie: function setCookie(e, t) {
        document.cookie = "".concat(e, "=").concat(t);
      },
      getCookie: function getCookie(e) {
        return document.cookie.replace(new RegExp("(?:(?:^|.*;s*)".concat(e, "s*=s*([^;]*).*$)|^.*$")), "$1");
      },
      redirect: function redirect(e, t) {
        t && z.setCookie("__phoenix_flash__", t + "; max-age=60000; path=/"), window.location = e;
      },
      localKey: function localKey(e, t) {
        return "".concat(e, "-").concat(t);
      },
      getHashTargetEl: function getHashTargetEl(e) {
        if ("" !== e.toString()) return document.getElementById(e) || document.querySelector('a[name="'.concat(e.substring(1), '"]'));
      }
    },
        $ = {
      byId: function byId(e) {
        return document.getElementById(e) || J("no id found for ".concat(e));
      },
      removeClass: function removeClass(e, t) {
        e.classList.remove(t), 0 === e.classList.length && e.removeAttribute("class");
      },
      all: function all(e, t, n) {
        var i = Array.from(e.querySelectorAll(t));
        return n ? i.forEach(n) : i;
      },
      findFirstComponentNode: function findFirstComponentNode(e, t) {
        return e.querySelector("[".concat(N, '="').concat(t, '"]'));
      },
      findComponentNodeList: function findComponentNodeList(e, t) {
        return this.all(e, "[".concat(N, '="').concat(t, '"]'));
      },
      findPhxChildrenInFragment: function findPhxChildrenInFragment(e, t) {
        var n = document.createElement("template");
        return n.innerHTML = e, this.findPhxChildren(n.content, t);
      },
      isPhxUpdate: function isPhxUpdate(e, t, n) {
        return e.getAttribute && n.indexOf(e.getAttribute(t)) >= 0;
      },
      findPhxChildren: function findPhxChildren(e, t) {
        return this.all(e, "".concat(R, "[").concat("data-phx-parent-id", '="').concat(t, '"]'));
      },
      findParentCIDs: function findParentCIDs(e, t) {
        var n = this,
            i = new Set(t);
        return t.reduce(function (t, i) {
          var r = "[".concat(N, '="').concat(i, '"] [').concat(N, "]");
          return n.all(e, r).map(function (e) {
            return parseInt(e.getAttribute(N));
          }).forEach(function (e) {
            return t["delete"](e);
          }), t;
        }, i);
      },
      "private": function _private(e, t) {
        return e.phxPrivate && e.phxPrivate[t];
      },
      deletePrivate: function deletePrivate(e, t) {
        e.phxPrivate && delete e.phxPrivate[t];
      },
      putPrivate: function putPrivate(e, t, n) {
        e.phxPrivate || (e.phxPrivate = {}), e.phxPrivate[t] = n;
      },
      copyPrivates: function copyPrivates(e, t) {
        t.phxPrivate && (e.phxPrivate = V(t.phxPrivate));
      },
      putTitle: function putTitle(e) {
        var t = document.querySelector("title").dataset,
            n = t.prefix,
            i = t.suffix;
        document.title = "".concat(n || "").concat(e).concat(i || "");
      },
      debounce: function debounce(e, t, n, i, r, o, a) {
        var u = this,
            c = e.getAttribute(n),
            s = e.getAttribute(r);
        "" === c && (c = i), "" === s && (s = o);
        var l = c || s;

        switch (l) {
          case null:
            return a();

          case "blur":
            if (this["private"](e, "debounce-blur")) return;
            return e.addEventListener("blur", function () {
              return a();
            }), void this.putPrivate(e, "debounce-blur", l);

          default:
            var d = parseInt(l);
            if (isNaN(d)) return J("invalid throttle/debounce value: ".concat(l));

            if (s && "keydown" === t.type) {
              var h = this["private"](e, "debounce-prev-key");
              if (this.putPrivate(e, "debounce-prev-key", t.which), h !== t.which) return a();
            }

            if (this["private"](e, "debounce-timer")) return;

            var f = function f(t) {
              s && "phx-change" === t.type && t.detail.triggeredBy.name === e.name || (clearTimeout(u["private"](e, "debounce-timer")), u.deletePrivate(e, "debounce-timer"));
            },
                v = function v() {
              e.form && (e.form.removeEventListener("phx-change", f), e.form.removeEventListener("submit", f)), e.removeEventListener("blur", u["private"](e, "debounce-blur-timer")), u.deletePrivate(e, "debounce-blur-timer"), u.deletePrivate(e, "debounce-timer"), s || a();
            },
                p = function p() {
              clearTimeout(u["private"](e, "debounce-timer")), v();
            };

            this.putPrivate(e, "debounce-timer", setTimeout(v, d)), e.addEventListener("blur", p), this.putPrivate(e, "debounce-blur-timer", p), e.form && (e.form.addEventListener("phx-change", f), e.form.addEventListener("submit", f)), s && a();
        }
      },
      discardError: function discardError(e, t, n) {
        var i = t.getAttribute && t.getAttribute(n),
            r = i && e.querySelector("#".concat(i));
        r && (this["private"](r, "phx-has-focused") || this["private"](r.form, "phx-has-submitted") || t.classList.add("phx-no-feedback"));
      },
      isPhxChild: function isPhxChild(e) {
        return e.getAttribute && e.getAttribute("data-phx-parent-id");
      },
      dispatchEvent: function dispatchEvent(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            i = new CustomEvent(t, {
          bubbles: !0,
          cancelable: !0,
          detail: n
        });
        e.dispatchEvent(i);
      },
      cloneNode: function cloneNode(e, t) {
        if (void 0 === t) return e.cloneNode(!0);
        var n = e.cloneNode(!1);
        return n.innerHTML = t, n;
      },
      mergeAttrs: function mergeAttrs(e, t) {
        for (var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], i = t.attributes, r = i.length - 1; r >= 0; r--) {
          var o = i[r].name;
          n.indexOf(o) < 0 && e.setAttribute(o, t.getAttribute(o));
        }

        for (var a = e.attributes, u = a.length - 1; u >= 0; u--) {
          var c = a[u].name;
          t.hasAttribute(c) || e.removeAttribute(c);
        }
      },
      mergeFocusedInput: function mergeFocusedInput(e, t) {
        e instanceof HTMLSelectElement || $.mergeAttrs(e, t, ["value"]), t.readOnly ? e.setAttribute("readonly", !0) : e.removeAttribute("readonly");
      },
      restoreFocus: function restoreFocus(e, t, n) {
        if ($.isTextualInput(e)) {
          var i = e.matches(":focus");
          e.readOnly && e.blur(), i || e.focus(), (e.setSelectionRange && "text" === e.type || "textarea" === e.type) && e.setSelectionRange(t, n);
        }
      },
      isFormInput: function isFormInput(e) {
        return /^(?:input|select|textarea)$/i.test(e.tagName);
      },
      syncAttrsToProps: function syncAttrsToProps(e) {
        e instanceof HTMLInputElement && O.indexOf(e.type.toLocaleLowerCase()) >= 0 && (e.checked = null !== e.getAttribute("checked"));
      },
      isTextualInput: function isTextualInput(e) {
        return _.indexOf(e.type) >= 0;
      },
      isNowTriggerFormExternal: function isNowTriggerFormExternal(e, t) {
        return e.getAttribute && null !== e.getAttribute(t);
      },
      undoRefs: function undoRefs(e, t) {
        var n = this;
        $.all(t, "[".concat(D, "]"), function (t) {
          return n.syncPendingRef(e, t, t);
        });
      },
      syncPendingRef: function syncPendingRef(e, t, n) {
        var i = t.getAttribute && t.getAttribute(D);
        if (null === i) return !0;
        var r = parseInt(i);
        return null !== e && e >= r ? ([t, n].forEach(function (e) {
          e.removeAttribute(D), null !== e.getAttribute("data-phx-readonly") && (e.readOnly = !1, e.removeAttribute("data-phx-readonly")), null !== e.getAttribute("data-phx-disabled") && (e.disabled = !1, e.removeAttribute("data-phx-disabled")), I.forEach(function (t) {
            return $.removeClass(e, t);
          });
          var t = e.getAttribute("data-phx-disable-with-restore");
          null !== t && (e.innerText = t, e.removeAttribute("data-phx-disable-with-restore"));
        }), !0) : (I.forEach(function (e) {
          t.classList.contains(e) && n.classList.add(e);
        }), n.setAttribute(D, t.getAttribute(D)), !$.isFormInput(t) && !/submit/i.test(t.type));
      }
    },
        Q = function () {
      function e(t, n, i, r, o, a) {
        w(this, e), this.view = t, this.liveSocket = t.liveSocket, this.container = n, this.id = i, this.rootID = t.root.id, this.html = r, this.targetCID = o, this.ref = a, this.cidPatch = "number" == typeof this.targetCID, this.callbacks = {
          beforeadded: [],
          beforeupdated: [],
          beforediscarded: [],
          beforephxChildAdded: [],
          afteradded: [],
          afterupdated: [],
          afterdiscarded: [],
          afterphxChildAdded: []
        };
      }

      return A(e, [{
        key: "before",
        value: function value(e, t) {
          this.callbacks["before".concat(e)].push(t);
        }
      }, {
        key: "after",
        value: function value(e, t) {
          this.callbacks["after".concat(e)].push(t);
        }
      }, {
        key: "trackBefore",
        value: function value(e) {
          for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) {
            n[i - 1] = arguments[i];
          }

          this.callbacks["before".concat(e)].forEach(function (e) {
            return e.apply(void 0, n);
          });
        }
      }, {
        key: "trackAfter",
        value: function value(e) {
          for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) {
            n[i - 1] = arguments[i];
          }

          this.callbacks["after".concat(e)].forEach(function (e) {
            return e.apply(void 0, n);
          });
        }
      }, {
        key: "markPrunableContentForRemoval",
        value: function value() {
          $.all(this.container, "[phx-update=append] > *, [phx-update=prepend] > *", function (e) {
            e.setAttribute("data-phx-remove", "");
          });
        }
      }, {
        key: "perform",
        value: function value() {
          var e = this,
              t = this.view,
              n = this.liveSocket,
              i = this.container,
              r = this.html,
              o = this.isCIDPatch() ? this.targetCIDContainer() : i;

          if (!this.isCIDPatch() || o) {
            var a = n.getActiveElement(),
                u = a && $.isTextualInput(a) ? a : {},
                c = u.selectionStart,
                s = u.selectionEnd,
                l = n.binding("update"),
                d = n.binding("feedback-for"),
                h = n.binding("trigger-action"),
                f = [],
                v = [],
                p = [],
                g = n.time("premorph container prep", function () {
              return e.buildDiffHTML(i, r, l, o);
            });
            return this.trackBefore("added", i), this.trackBefore("updated", i, i), n.time("morphdom", function () {
              k(o, g, {
                childrenOnly: null === o.getAttribute(N),
                onBeforeNodeAdded: function onBeforeNodeAdded(t) {
                  return $.discardError(o, t, d), e.trackBefore("added", t), t;
                },
                onNodeAdded: function onNodeAdded(n) {
                  $.isNowTriggerFormExternal(n, h) && n.submit(), $.isPhxChild(n) && t.ownsElement(n) && e.trackAfter("phxChildAdded", n), f.push(n);
                },
                onNodeDiscarded: function onNodeDiscarded(t) {
                  e.trackAfter("discarded", t);
                },
                onBeforeNodeDiscarded: function onBeforeNodeDiscarded(t) {
                  return !(!t.getAttribute || null === t.getAttribute("data-phx-remove")) || !$.isPhxUpdate(t.parentNode, l, ["append", "prepend"]) && !e.skipCIDSibling(t) && (e.trackBefore("discarded", t), $.isPhxChild(t) ? (n.destroyViewByEl(t), !0) : void 0);
                },
                onElUpdated: function onElUpdated(e) {
                  $.isNowTriggerFormExternal(e, h) && e.submit(), v.push(e);
                },
                onBeforeElUpdated: function onBeforeElUpdated(t, n) {
                  if (e.skipCIDSibling(n)) return !1;
                  if ("ignore" === t.getAttribute(l)) return e.trackBefore("updated", t, n), $.mergeAttrs(t, n), v.push(t), !1;
                  if ("number" === t.type && t.validity && t.validity.badInput) return !1;
                  if (!$.syncPendingRef(e.ref, t, n)) return !1;

                  if ($.isPhxChild(n)) {
                    var i = t.getAttribute("data-phx-static");
                    return $.mergeAttrs(t, n), t.setAttribute("data-phx-static", i), t.setAttribute("data-phx-root-id", e.rootID), !1;
                  }

                  if ($.copyPrivates(n, t), $.discardError(o, n, d), a && t.isSameNode(a) && $.isFormInput(t) && !e.forceFocusedSelectUpdate(t, n)) return e.trackBefore("updated", t, n), $.mergeFocusedInput(t, n), $.syncAttrsToProps(t), v.push(t), !1;

                  if ($.isPhxUpdate(n, l, ["append", "prepend"])) {
                    var r = "append" === n.getAttribute(l),
                        u = Array.from(t.children).map(function (e) {
                      return e.id;
                    }),
                        c = Array.from(n.children).map(function (e) {
                      return e.id;
                    });
                    r && !c.find(function (e) {
                      return u.indexOf(e) >= 0;
                    }) || p.push([n.id, u]);
                  }

                  return $.syncAttrsToProps(n), e.trackBefore("updated", t, n), !0;
                }
              });
            }), n.isDebugEnabled() && function () {
              for (var e = new Set(), t = document.querySelectorAll("*[id]"), n = 0, i = t.length; n < i; n++) {
                e.has(t[n].id) ? console.error("Multiple IDs detected: ".concat(t[n].id, ". Ensure unique element ids.")) : e.add(t[n].id);
              }
            }(), p.length > 0 && n.time("post-morph append/prepend restoration", function () {
              p.forEach(function (e) {
                var t = E(e, 2),
                    n = t[0],
                    i = t[1],
                    r = $.byId(n);
                "append" === r.getAttribute(l) ? i.reverse().forEach(function (e) {
                  W(document.getElementById(e), function (e) {
                    return r.insertBefore(e, r.firstChild);
                  });
                }) : i.forEach(function (e) {
                  W(document.getElementById(e), function (e) {
                    return r.appendChild(e);
                  });
                });
              });
            }), n.silenceEvents(function () {
              return $.restoreFocus(a, c, s);
            }), $.dispatchEvent(document, "phx:update"), f.forEach(function (t) {
              return e.trackAfter("added", t);
            }), v.forEach(function (t) {
              return e.trackAfter("updated", t);
            }), !0;
          }
        }
      }, {
        key: "forceFocusedSelectUpdate",
        value: function value(e, t) {
          return !0 === e.multiple || e.innerHTML != t.innerHTML;
        }
      }, {
        key: "isCIDPatch",
        value: function value() {
          return this.cidPatch;
        }
      }, {
        key: "skipCIDSibling",
        value: function value(e) {
          return e.nodeType === Node.ELEMENT_NODE && null !== e.getAttribute("data-phx-skip");
        }
      }, {
        key: "targetCIDContainer",
        value: function value() {
          if (this.isCIDPatch()) {
            var e = b($.findComponentNodeList(this.container, this.targetCID)),
                t = e[0];
            return 0 === e.slice(1).length ? t : t && t.parentNode;
          }
        }
      }, {
        key: "buildDiffHTML",
        value: function value(e, t, n, i) {
          var r = this,
              o = this.isCIDPatch(),
              a = o && i.getAttribute(N) === this.targetCID.toString();
          if (!o || a) return t;
          var u = null,
              c = document.createElement("template");
          u = $.cloneNode(i);
          var s = b($.findComponentNodeList(u, this.targetCID)),
              l = s[0],
              d = s.slice(1);
          return c.innerHTML = t, d.forEach(function (e) {
            return e.remove();
          }), Array.from(u.childNodes).forEach(function (e) {
            e.nodeType === Node.ELEMENT_NODE && e.getAttribute(N) !== r.targetCID.toString() && (e.setAttribute("data-phx-skip", ""), e.innerHTML = "");
          }), Array.from(c.content.childNodes).forEach(function (e) {
            return u.insertBefore(e, l);
          }), l.remove(), u.outerHTML;
        }
      }]), e;
    }(),
        Z = function () {
      function e(t, n, i, r, o) {
        var a = this;
        w(this, e), this.liveSocket = n, this.flash = o, this.parent = i, this.root = i ? i.root : this, this.gracefullyClosed = !1, this.el = t, this.id = this.el.id, this.view = this.el.getAttribute(T), this.ref = 0, this.childJoins = 0, this.loaderTimer = null, this.pendingDiffs = [], this.href = r, this.joinCount = this.parent ? this.parent.joinCount - 1 : 0, this.joinPending = !0, this.destroyed = !1, this.joinCallback = function () {}, this.stopCallback = function () {}, this.pendingJoinOps = this.parent ? null : [], this.viewHooks = {}, this.children = this.parent ? null : {}, this.root.children[this.id] = {}, this.channel = this.liveSocket.channel("lv:".concat(this.id), function () {
          return {
            url: a.href,
            params: a.liveSocket.params(a.view),
            session: a.getSession(),
            "static": a.getStatic(),
            flash: a.flash,
            joins: a.joinCount
          };
        }), this.showLoader(this.liveSocket.loaderTimeout), this.bindChannel();
      }

      return A(e, [{
        key: "isMain",
        value: function value() {
          return this.liveSocket.main === this;
        }
      }, {
        key: "name",
        value: function value() {
          return this.view;
        }
      }, {
        key: "isConnected",
        value: function value() {
          return this.channel.canPush();
        }
      }, {
        key: "getSession",
        value: function value() {
          return this.el.getAttribute("data-phx-session");
        }
      }, {
        key: "getStatic",
        value: function value() {
          var e = this.el.getAttribute("data-phx-static");
          return "" === e ? null : e;
        }
      }, {
        key: "destroy",
        value: function value() {
          var e = this,
              t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : function () {};
          this.destroyAllChildren(), this.destroyed = !0, delete this.root.children[this.id], this.parent && delete this.root.children[this.parent.id][this.id], clearTimeout(this.loaderTimer);

          var n = function n() {
            for (var n in t(), e.viewHooks) {
              e.destroyHook(e.viewHooks[n]);
            }
          };

          this.hasGracefullyClosed() ? (this.log("destroyed", function () {
            return ["the server view has gracefully closed"];
          }), n()) : (this.log("destroyed", function () {
            return ["the child has been removed from the parent"];
          }), this.channel.leave().receive("ok", n).receive("error", n).receive("timeout", n));
        }
      }, {
        key: "setContainerClasses",
        value: function value() {
          var e;
          this.el.classList.remove("phx-connected", "phx-disconnected", "phx-error"), (e = this.el.classList).add.apply(e, arguments);
        }
      }, {
        key: "isLoading",
        value: function value() {
          return this.el.classList.contains("phx-disconnected");
        }
      }, {
        key: "showLoader",
        value: function value(e) {
          var t = this;
          if (clearTimeout(this.loaderTimer), e) this.loaderTimer = setTimeout(function () {
            return t.showLoader();
          }, e);else {
            for (var n in this.viewHooks) {
              this.viewHooks[n].__trigger__("disconnected");
            }

            this.setContainerClasses("phx-disconnected");
          }
        }
      }, {
        key: "hideLoader",
        value: function value() {
          clearTimeout(this.loaderTimer), this.setContainerClasses("phx-connected");
        }
      }, {
        key: "triggerReconnected",
        value: function value() {
          for (var e in this.viewHooks) {
            this.viewHooks[e].__trigger__("reconnected");
          }
        }
      }, {
        key: "log",
        value: function value(e, t) {
          this.liveSocket.log(this, e, t);
        }
      }, {
        key: "onJoin",
        value: function value(e) {
          var t = this,
              n = e.rendered;
          this.joinCount++, this.childJoins = 0, this.joinPending = !0, this.flash = null, this.log("join", function () {
            return ["", n];
          }), n.title && $.putTitle(n.title), z.dropLocal(this.name(), "consecutive-reloads"), this.rendered = new G(this.id, n);
          var i = this.renderContainer(null, "join");
          this.dropPendingRefs();
          var r = this.formsForRecovery(i);
          this.joinCount > 1 && r.length > 0 ? r.forEach(function (e, n) {
            t.pushFormRecovery(e, function (e) {
              n === r.length - 1 && t.onJoinComplete(e, i);
            });
          }) : this.onJoinComplete(e, i);
        }
      }, {
        key: "dropPendingRefs",
        value: function value() {
          $.all(this.el, "[".concat(D, "]"), function (e) {
            return e.removeAttribute(D);
          });
        }
      }, {
        key: "formsForRecovery",
        value: function value(e) {
          var t = this,
              n = this.binding("change"),
              i = document.createElement("template");
          return i.innerHTML = e, $.all(this.el, "form[".concat(n, "], form[").concat(this.binding("submit"), "]")).filter(function (e) {
            return t.ownsElement(e);
          }).filter(function (e) {
            return i.content.querySelector("form[".concat(n, '="').concat(e.getAttribute(n), '"]'));
          });
        }
      }, {
        key: "onJoinComplete",
        value: function value(e, t) {
          var n = this,
              i = e.live_patch;
          if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) return this.applyJoinPatch(i, t);
          0 === $.findPhxChildrenInFragment(t, this.id).filter(function (e) {
            return n.joinChild(e);
          }).length ? this.parent ? (this.root.pendingJoinOps.push([this, function () {
            return n.applyJoinPatch(i, t);
          }]), this.parent.ackJoin(this)) : (this.onAllChildJoinsComplete(), this.applyJoinPatch(i, t)) : this.root.pendingJoinOps.push([this, function () {
            return n.applyJoinPatch(i, t);
          }]);
        }
      }, {
        key: "attachTrueDocEl",
        value: function value() {
          this.el = $.byId(this.id), this.el.setAttribute("data-phx-root-id", this.root.id);
        }
      }, {
        key: "applyJoinPatch",
        value: function value(e, t) {
          var n = this;
          this.attachTrueDocEl();
          var i = new Q(this, this.el, this.id, t, null);

          if (i.markPrunableContentForRemoval(), this.joinPending = !1, this.performPatch(i), this.joinNewChildren(), $.all(this.el, "[".concat(this.binding("hook"), "]"), function (e) {
            var t = n.addHook(e);
            t && t.__trigger__("mounted");
          }), this.applyPendingUpdates(), e) {
            var r = e.kind,
                o = e.to;
            this.liveSocket.historyPatch(o, r);
          }

          this.hideLoader(), this.joinCount > 1 && this.triggerReconnected(), this.stopCallback();
        }
      }, {
        key: "performPatch",
        value: function value(e) {
          var t = this,
              n = [],
              i = !1,
              r = new Set();
          return e.after("added", function (e) {
            var n = t.addHook(e);
            n && n.__trigger__("mounted");
          }), e.after("phxChildAdded", function (e) {
            return i = !0;
          }), e.before("updated", function (e, n) {
            var i = t.getHook(e),
                o = i && "ignore" === e.getAttribute(t.binding("update"));
            !i || e.isEqualNode(n) || o && function (e, t) {
              return JSON.stringify(e) === JSON.stringify(t);
            }(e.dataset, n.dataset) || (r.add(e.id), i.__trigger__("beforeUpdate"));
          }), e.after("updated", function (e) {
            var n = t.getHook(e);
            n && r.has(e.id) && n.__trigger__("updated");
          }), e.before("discarded", function (e) {
            var n = t.getHook(e);
            n && n.__trigger__("beforeDestroy");
          }), e.after("discarded", function (e) {
            var i = t.componentID(e);
            "number" == typeof i && -1 === n.indexOf(i) && n.push(i);
            var r = t.getHook(e);
            r && t.destroyHook(r);
          }), e.perform(), this.maybePushComponentsDestroyed(n), i;
        }
      }, {
        key: "joinNewChildren",
        value: function value() {
          var e = this;
          $.findPhxChildren(this.el, this.id).forEach(function (t) {
            return e.joinChild(t);
          });
        }
      }, {
        key: "getChildById",
        value: function value(e) {
          return this.root.children[this.id][e];
        }
      }, {
        key: "getDescendentByEl",
        value: function value(e) {
          return e.id === this.id ? this : this.children[e.getAttribute("data-phx-parent-id")][e.id];
        }
      }, {
        key: "destroyDescendent",
        value: function value(e) {
          for (var t in this.root.children) {
            for (var n in this.root.children[t]) {
              if (n === e) return this.root.children[t][n].destroy();
            }
          }
        }
      }, {
        key: "joinChild",
        value: function value(t) {
          if (!this.getChildById(t.id)) {
            var n = new e(t, this.liveSocket, this);
            return this.root.children[this.id][n.id] = n, n.join(), this.childJoins++, !0;
          }
        }
      }, {
        key: "isJoinPending",
        value: function value() {
          return this.joinPending;
        }
      }, {
        key: "ackJoin",
        value: function value(e) {
          this.childJoins--, 0 === this.childJoins && (this.parent ? this.parent.ackJoin(this) : this.onAllChildJoinsComplete());
        }
      }, {
        key: "onAllChildJoinsComplete",
        value: function value() {
          this.joinCallback(), this.pendingJoinOps.forEach(function (e) {
            var t = E(e, 2),
                n = t[0],
                i = t[1];
            n.isDestroyed() || i();
          }), this.pendingJoinOps = [];
        }
      }, {
        key: "update",
        value: function value(e, t, n) {
          var i = this;

          if (!q(e) || null !== n) {
            if (e.title && $.putTitle(e.title), this.isJoinPending() || this.liveSocket.hasPendingLink()) return this.pendingDiffs.push({
              diff: e,
              cid: t,
              ref: n
            });
            this.log("update", function () {
              return ["", e];
            }), this.rendered.mergeDiff(e);
            var r = !1;
            "number" == typeof t ? this.liveSocket.time("component ack patch complete", function () {
              i.componentPatch(e.c[t], t, n) && (r = !0);
            }) : this.rendered.isComponentOnlyDiff(e) ? this.liveSocket.time("component patch complete", function () {
              $.findParentCIDs(i.el, i.rendered.componentCIDs(e)).forEach(function (t) {
                i.componentPatch(e.c[t], t, n) && (r = !0);
              });
            }) : q(e) || this.liveSocket.time("full patch complete", function () {
              var t = i.renderContainer(e, "update"),
                  o = new Q(i, i.el, i.id, t, null, n);
              r = i.performPatch(o);
            }), $.undoRefs(n, this.el), r && this.joinNewChildren();
          }
        }
      }, {
        key: "renderContainer",
        value: function value(e, t) {
          var n = this;
          return this.liveSocket.time("toString diff (".concat(t, ")"), function () {
            var t = n.el.tagName,
                i = e ? n.rendered.componentCIDs(e) : null,
                r = n.rendered.toString(i);
            return "<".concat(t, ">").concat(r, "</").concat(t, ">");
          });
        }
      }, {
        key: "componentPatch",
        value: function value(e, t, n) {
          if (q(e)) return !1;
          var i = this.rendered.componentToString(t),
              r = new Q(this, this.el, this.id, i, t, n);
          return this.performPatch(r);
        }
      }, {
        key: "getHook",
        value: function value(e) {
          return this.viewHooks[te.elementID(e)];
        }
      }, {
        key: "addHook",
        value: function value(e) {
          if (!te.elementID(e) && e.getAttribute) {
            var t = e.getAttribute(this.binding("hook"));

            if (!t || this.ownsElement(e)) {
              var n = this.liveSocket.getHookCallbacks(t);

              if (n) {
                var i = new te(this, e, n);
                return this.viewHooks[te.elementID(i.el)] = i, i;
              }

              null !== t && J('unknown hook found for "'.concat(t, '"'), e);
            }
          }
        }
      }, {
        key: "destroyHook",
        value: function value(e) {
          e.__trigger__("destroyed"), delete this.viewHooks[te.elementID(e.el)];
        }
      }, {
        key: "applyPendingUpdates",
        value: function value() {
          var e = this;
          this.pendingDiffs.forEach(function (t) {
            var n = t.diff,
                i = t.cid,
                r = t.ref;
            return e.update(n, i, r);
          }), this.pendingDiffs = [];
        }
      }, {
        key: "onChannel",
        value: function value(e, t) {
          var n = this;
          this.liveSocket.onChannel(this.channel, e, function (e) {
            n.isJoinPending() ? n.root.pendingJoinOps.push([n, function () {
              return t(e);
            }]) : t(e);
          });
        }
      }, {
        key: "bindChannel",
        value: function value() {
          var e = this;
          this.onChannel("diff", function (t) {
            return e.update(t);
          }), this.onChannel("redirect", function (t) {
            var n = t.to,
                i = t.flash;
            return e.onRedirect({
              to: n,
              flash: i
            });
          }), this.onChannel("live_patch", function (t) {
            return e.onLivePatch(t);
          }), this.onChannel("live_redirect", function (t) {
            return e.onLiveRedirect(t);
          }), this.onChannel("session", function (t) {
            var n = t.token;
            return e.el.setAttribute("data-phx-session", n);
          }), this.channel.onError(function (t) {
            return e.onError(t);
          }), this.channel.onClose(function () {
            return e.onGracefulClose();
          });
        }
      }, {
        key: "destroyAllChildren",
        value: function value() {
          for (var e in this.root.children[this.id]) {
            this.getChildById(e).destroy();
          }
        }
      }, {
        key: "onGracefulClose",
        value: function value() {
          this.gracefullyClosed = !0, this.destroyAllChildren();
        }
      }, {
        key: "onLiveRedirect",
        value: function value(e) {
          var t = e.to,
              n = e.kind,
              i = e.flash,
              r = this.expandURL(t);
          this.liveSocket.historyRedirect(r, n, i);
        }
      }, {
        key: "onLivePatch",
        value: function value(e) {
          var t = e.to,
              n = e.kind;
          this.href = this.expandURL(t), this.liveSocket.historyPatch(t, n);
        }
      }, {
        key: "expandURL",
        value: function value(e) {
          return e.startsWith("/") ? "".concat(window.location.protocol, "//").concat(window.location.host).concat(e) : e;
        }
      }, {
        key: "onRedirect",
        value: function value(e) {
          var t = e.to,
              n = e.flash;
          this.liveSocket.redirect(t, n);
        }
      }, {
        key: "isDestroyed",
        value: function value() {
          return this.destroyed;
        }
      }, {
        key: "hasGracefullyClosed",
        value: function value() {
          return this.gracefullyClosed;
        }
      }, {
        key: "join",
        value: function value(e) {
          var t = this;
          this.parent || (this.stopCallback = this.liveSocket.withPageLoading({
            to: this.href,
            kind: "initial"
          })), this.joinCallback = function () {
            return e && e(t, t.joinCount);
          }, this.liveSocket.wrapPush(function () {
            return t.channel.join().receive("ok", function (e) {
              return t.onJoin(e);
            }).receive("error", function (e) {
              return t.onJoinError(e);
            }).receive("timeout", function () {
              return t.onJoinError({
                reason: "timeout"
              });
            });
          });
        }
      }, {
        key: "onJoinError",
        value: function value(e) {
          return "outdated" === e.reason ? this.liveSocket.reloadWithJitter(this) : "join crashed" === e.reason ? this.liveSocket.reloadWithJitter(this) : ((e.redirect || e.live_redirect) && this.channel.leave(), e.redirect ? this.onRedirect(e.redirect) : e.live_redirect ? this.onLiveRedirect(e.live_redirect) : (this.parent && this.parent.ackJoin(this), this.displayError(), void this.log("error", function () {
            return ["unable to join", e];
          })));
        }
      }, {
        key: "onError",
        value: function value(e) {
          if (this.isJoinPending()) return this.liveSocket.reloadWithJitter(this);
          this.destroyAllChildren(), this.log("error", function () {
            return ["view crashed", e];
          }), this.liveSocket.onViewError(this), document.activeElement.blur(), this.liveSocket.isUnloaded() ? this.showLoader(200) : this.displayError();
        }
      }, {
        key: "displayError",
        value: function value() {
          this.isMain() && $.dispatchEvent(window, "phx:page-loading-start", {
            to: this.href,
            kind: "error"
          }), this.showLoader(), this.setContainerClasses("phx-disconnected", "phx-error");
        }
      }, {
        key: "pushWithReply",
        value: function value(e, t, n) {
          var i = this,
              r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : function () {},
              o = E(e ? e() : [null, []], 2),
              a = o[0],
              u = E(o[1], 1)[0],
              c = function c() {};

          return u && null !== u.getAttribute(this.binding("page-loading")) && (c = this.liveSocket.withPageLoading({
            kind: "element",
            target: u
          })), "number" != typeof n.cid && delete n.cid, this.liveSocket.wrapPush(function () {
            return i.channel.push(t, n, 3e4).receive("ok", function (e) {
              (e.diff || null !== a) && i.update(e.diff || {}, n.cid, a), e.redirect && i.onRedirect(e.redirect), e.live_patch && i.onLivePatch(e.live_patch), e.live_redirect && i.onLiveRedirect(e.live_redirect), c(), r(e);
            });
          });
        }
      }, {
        key: "putRef",
        value: function value(e, t) {
          var n = this.ref++,
              i = this.binding("disable-with");
          return e.forEach(function (e) {
            e.classList.add("phx-".concat(t, "-loading")), e.setAttribute(D, n);
            var r = e.getAttribute(i);
            null !== r && (e.getAttribute("data-phx-disable-with-restore") || e.setAttribute("data-phx-disable-with-restore", e.innerText), e.innerText = r);
          }), [n, e];
        }
      }, {
        key: "componentID",
        value: function value(e) {
          var t = e.getAttribute && e.getAttribute(N);
          return t ? parseInt(t) : null;
        }
      }, {
        key: "targetComponentID",
        value: function value(e, t) {
          return e.getAttribute(this.binding("target")) ? this.closestComponentID(t) : null;
        }
      }, {
        key: "closestComponentID",
        value: function value(e) {
          var t = this;
          return e ? W(e.closest("[".concat(N, "]")), function (e) {
            return t.ownsElement(e) && t.componentID(e);
          }) : null;
        }
      }, {
        key: "pushHookEvent",
        value: function value(e, t, n) {
          this.pushWithReply(null, "event", {
            type: "hook",
            event: t,
            value: n,
            cid: this.closestComponentID(e)
          });
        }
      }, {
        key: "extractMeta",
        value: function value(e, t) {
          for (var n = this.binding("value-"), i = 0; i < e.attributes.length; i++) {
            var r = e.attributes[i].name;
            r.startsWith(n) && (t[r.replace(n, "")] = e.getAttribute(r));
          }

          return void 0 !== e.value && (t.value = e.value, "INPUT" === e.tagName && O.indexOf(e.type) >= 0 && !e.checked && delete t.value), t;
        }
      }, {
        key: "pushEvent",
        value: function value(e, t, n, i, r) {
          var o = this;
          this.pushWithReply(function () {
            return o.putRef([t], e);
          }, "event", {
            type: e,
            event: i,
            value: this.extractMeta(t, r),
            cid: this.targetComponentID(t, n)
          });
        }
      }, {
        key: "pushKey",
        value: function value(e, t, n, i, r) {
          var o = this;
          this.pushWithReply(function () {
            return o.putRef([e], n);
          }, "event", {
            type: n,
            event: i,
            value: this.extractMeta(e, r),
            cid: this.targetComponentID(e, t)
          });
        }
      }, {
        key: "pushInput",
        value: function value(e, t, n, i, r) {
          var o = this;
          $.dispatchEvent(e.form, "phx-change", {
            triggeredBy: e
          }), this.pushWithReply(function () {
            return o.putRef([e, e.form], "change");
          }, "event", {
            type: "form",
            event: n,
            value: X(e.form, {
              _target: i.name
            }),
            cid: this.targetComponentID(e.form, t)
          }, r);
        }
      }, {
        key: "pushFormSubmit",
        value: function value(e, t, n, i) {
          var r = this,
              o = function o(e) {
            return !U(e, "".concat(r.binding("update"), "=ignore"), e.form);
          };

          this.pushWithReply(function () {
            var t = $.all(e, "[".concat(r.binding("disable-with"), "]")),
                n = $.all(e, "button").filter(o),
                i = $.all(e, "input").filter(o);
            return n.forEach(function (e) {
              e.setAttribute("data-phx-disabled", e.disabled), e.disabled = !0;
            }), i.forEach(function (e) {
              e.setAttribute("data-phx-readonly", e.readOnly), e.readOnly = !0;
            }), e.setAttribute(r.binding("page-loading"), ""), r.putRef([e].concat(t).concat(n).concat(i), "submit");
          }, "event", {
            type: "form",
            event: n,
            value: X(e),
            cid: this.targetComponentID(e, t)
          }, i);
        }
      }, {
        key: "pushFormRecovery",
        value: function value(e, t) {
          var n = this;
          this.liveSocket.withinOwners(e, function (i, r) {
            var o = e.elements[0],
                a = e.getAttribute(n.binding("auto-recover")) || e.getAttribute(n.binding("change"));
            i.pushInput(o, r, a, o, t);
          });
        }
      }, {
        key: "pushLinkPatch",
        value: function value(e, t, n) {
          var i = this;
          this.isLoading() || this.showLoader(this.liveSocket.loaderTimeout);
          var r = this.liveSocket.setPendingLink(e),
              o = t ? function () {
            return i.putRef([t], "click");
          } : null;
          this.pushWithReply(o, "link", {
            url: e
          }, function (t) {
            t.link_redirect ? i.liveSocket.replaceMain(e, null, n, r) : i.liveSocket.commitPendingLink(r) && (i.href = e, i.applyPendingUpdates(), i.hideLoader(), i.triggerReconnected(), n && n());
          }).receive("timeout", function () {
            return i.liveSocket.redirect(window.location.href);
          });
        }
      }, {
        key: "formsForRecovery",
        value: function value(e) {
          var t = this,
              n = this.binding("change"),
              i = document.createElement("template");
          return i.innerHTML = e, $.all(this.el, "form[".concat(n, "]")).filter(function (e) {
            return t.ownsElement(e);
          }).filter(function (e) {
            return "ignore" !== e.getAttribute(t.binding("auto-recover"));
          }).filter(function (e) {
            return i.content.querySelector("form[".concat(n, '="').concat(e.getAttribute(n), '"]'));
          });
        }
      }, {
        key: "maybePushComponentsDestroyed",
        value: function value(e) {
          var t = this,
              n = e.filter(function (e) {
            return 0 === $.findComponentNodeList(t.el, e).length;
          });
          n.length > 0 && this.pushWithReply(null, "cids_destroyed", {
            cids: n
          }, function () {
            t.rendered.pruneCIDs(n);
          });
        }
      }, {
        key: "ownsElement",
        value: function value(e) {
          return e.getAttribute("data-phx-parent-id") === this.id || W(e.closest(R), function (e) {
            return e.id;
          }) === this.id;
        }
      }, {
        key: "submitForm",
        value: function value(e, t, n) {
          var i = this;
          $.putPrivate(e, "phx-has-submitted", !0), this.liveSocket.blurActiveElement(this), this.pushFormSubmit(e, t, n, function () {
            i.liveSocket.restorePreviouslyActiveFocus();
          });
        }
      }, {
        key: "binding",
        value: function value(e) {
          return this.liveSocket.binding(e);
        }
      }]), e;
    }(),
        ee = 1,
        te = function () {
      function e(t, n, i) {
        for (var r in w(this, e), this.__view = t, this.__liveSocket = t.liveSocket, this.__callbacks = i, this.el = n, this.viewName = t.name(), this.el.phxHookId = this.constructor.makeID(), this.__callbacks) {
          this[r] = this.__callbacks[r];
        }
      }

      return A(e, null, [{
        key: "makeID",
        value: function value() {
          return ee++;
        }
      }, {
        key: "elementID",
        value: function value(e) {
          return e.phxHookId;
        }
      }]), A(e, [{
        key: "pushEvent",
        value: function value(e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};

          this.__view.pushHookEvent(null, e, t);
        }
      }, {
        key: "pushEventTo",
        value: function value(e, t) {
          var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};

          this.__liveSocket.withinTargets(null, e, function (e, i) {
            e.pushHookEvent(i, t, n);
          });
        }
      }, {
        key: "__trigger__",
        value: function value(e) {
          var t = this.__callbacks[e];
          t && t.call(this);
        }
      }]), e;
    }();

    t["default"] = Y;
  }, function (e, t) {
    var n;

    n = function () {
      return this;
    }();

    try {
      n = n || Function("return this")() || (0, eval)("this");
    } catch (e) {
      "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (n = window);
    }

    e.exports = n;
  }, function (e, t, n) {
    (function (t) {
      t.Phoenix || (t.Phoenix = {}), e.exports = t.Phoenix.LiveView = n(0);
    }).call(this, n(1));
  }]);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  var PolyfillEvent = eventConstructor();

  function eventConstructor() {
    if (typeof window.CustomEvent === "function") return window.CustomEvent; // IE<=9 Support

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    return CustomEvent;
  }

  function buildHiddenInput(name, value) {
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    return input;
  }

  function handleClick(element) {
    var to = element.getAttribute("data-to"),
        method = buildHiddenInput("_method", element.getAttribute("data-method")),
        csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")),
        form = document.createElement("form"),
        target = element.getAttribute("target");
    form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
    form.action = to;
    form.style.display = "hidden";
    if (target) form.target = target;
    form.appendChild(csrf);
    form.appendChild(method);
    document.body.appendChild(form);
    form.submit();
  }

  window.addEventListener("click", function (e) {
    var element = e.target;

    while (element && element.getAttribute) {
      var phoenixLinkEvent = new PolyfillEvent('phoenix.link.click', {
        "bubbles": true,
        "cancelable": true
      });

      if (!element.dispatchEvent(phoenixLinkEvent)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      if (element.getAttribute("data-method")) {
        handleClick(element);
        e.preventDefault();
        return false;
      } else {
        element = element.parentNode;
      }
    }
  }, false);
  window.addEventListener('phoenix.link.click', function (e) {
    var message = e.target.getAttribute("data-confirm");

    if (message && !window.confirm(message)) {
      e.preventDefault();
    }
  }, false);
})();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./css/app.scss
var app = __webpack_require__(5);

// EXTERNAL MODULE: ../deps/phoenix_html/priv/static/phoenix_html.js
var phoenix_html = __webpack_require__(6);

// EXTERNAL MODULE: ../deps/phoenix/priv/static/phoenix.js
var phoenix = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/nprogress/nprogress.js
var nprogress = __webpack_require__(0);
var nprogress_default = /*#__PURE__*/__webpack_require__.n(nprogress);

// EXTERNAL MODULE: ../deps/phoenix_live_view/priv/static/phoenix_live_view.js
var phoenix_live_view = __webpack_require__(3);

// CONCATENATED MODULE: ./js/metrics_live/color_wheel.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var COLORS = {
  phoenix: [242, 110, 64],
  elixir: [75, 68, 115],
  red: [255, 99, 132],
  orange: [255, 159, 64],
  yellow: [255, 205, 86],
  green: [75, 192, 192],
  blue: [54, 162, 253],
  purple: [153, 102, 255],
  grey: [201, 203, 207]
};
var COLOR_NAMES = Object.keys(COLORS);
var ColorWheel = {
  at: function at(i) {
    var _ColorWheel$rgb = ColorWheel.rgb(i),
        _ColorWheel$rgb2 = _slicedToArray(_ColorWheel$rgb, 3),
        r = _ColorWheel$rgb2[0],
        g = _ColorWheel$rgb2[1],
        b = _ColorWheel$rgb2[2];

    return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
  },
  rgb: function rgb(i) {
    return COLORS[COLOR_NAMES[i % COLOR_NAMES.length]];
  }
};
var LineColor = {
  at: function at(i) {
    var _ColorWheel$rgb3 = ColorWheel.rgb(i),
        _ColorWheel$rgb4 = _slicedToArray(_ColorWheel$rgb3, 3),
        r = _ColorWheel$rgb4[0],
        g = _ColorWheel$rgb4[1],
        b = _ColorWheel$rgb4[2];

    return {
      stroke: "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")"),
      fill: "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ", 0.1)")
    };
  }
};
/* harmony default export */ var color_wheel = (ColorWheel);
// EXTERNAL MODULE: ./node_modules/uplot/dist/uPlot.min.css
var uPlot_min = __webpack_require__(7);

// CONCATENATED MODULE: ./node_modules/uplot/dist/uPlot.esm.js
/**
* Copyright (c) 2020, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uPlot.js (μPlot)
* An exceptionally fast, tiny time series chart
* https://github.com/leeoniya/uPlot (v1.0.5)
*/

function debounce(fn, time) {
	let pending = null;

	function run() {
		pending = null;
		fn();
	}

	return function() {
		clearTimeout(pending);
		pending = setTimeout(run, time);
	}
}

// binary search for index of closest value
function closestIdx(num, arr, lo, hi) {
	let mid;
	lo = lo || 0;
	hi = hi || arr.length - 1;
	let bitwise = hi <= 2147483647;

	while (hi - lo > 1) {
		mid = bitwise ? (lo + hi) >> 1 : floor((lo + hi) / 2);

		if (arr[mid] < num)
			lo = mid;
		else
			hi = mid;
	}

	if (num - arr[lo] <= arr[hi] - num)
		return lo;

	return hi;
}

function getMinMax(data, _i0, _i1) {
//	console.log("getMinMax()");

	let _min = inf;
	let _max = -inf;

	for (let i = _i0; i <= _i1; i++) {
		if (data[i] != null) {
			_min = min(_min, data[i]);
			_max = max(_max, data[i]);
		}
	}

	return [_min, _max];
}

// this ensures that non-temporal/numeric y-axes get multiple-snapped padding added above/below
// TODO: also account for incrs when snapping to ensure top of axis gets a tick & value
function rangeNum(min, max, mult, extra) {
	// auto-scale Y
	const delta = max - min;
	const mag = log10(delta || abs(max) || 1);
	const exp = floor(mag);
	const incr = pow(10, exp) * mult;
	const buf = delta == 0 ? incr : 0;

	let snappedMin = round6(incrRoundDn(min - buf, incr));
	let snappedMax = round6(incrRoundUp(max + buf, incr));

	if (extra) {
		// for flat data, always use 0 as one chart extreme
		if (delta == 0) {
			if (max > 0)
				snappedMin = 0;
			else if (max < 0)
				snappedMax = 0;
		}
		else {
			// if buffer is too small, increase it
			if (snappedMax - max < incr)
				snappedMax += incr;

			if (min - snappedMin < incr)
				snappedMin -= incr;

			// if original data never crosses 0, use 0 as one chart extreme
			if (min >= 0 && snappedMin < 0)
				snappedMin = 0;

			if (max <= 0 && snappedMax > 0)
				snappedMax = 0;
		}
	}

	return [snappedMin, snappedMax];
}

const M = Math;

const abs = M.abs;
const floor = M.floor;
const round = M.round;
const ceil = M.ceil;
const min = M.min;
const max = M.max;
const pow = M.pow;
const log10 = M.log10;
const PI = M.PI;

const inf = Infinity;

function incrRound(num, incr) {
	return round(num/incr)*incr;
}

function clamp(num, _min, _max) {
	return min(max(num, _min), _max);
}

function fnOrSelf(v) {
	return typeof v == "function" ? v : () => v;
}

function retArg2(a, b) {
	return b;
}

function incrRoundUp(num, incr) {
	return ceil(num/incr)*incr;
}

function incrRoundDn(num, incr) {
	return floor(num/incr)*incr;
}

function round3(val) {
	return round(val * 1e3) / 1e3;
}

function round6(val) {
	return round(val * 1e6) / 1e6;
}

//export const assign = Object.assign;

const isArr = Array.isArray;

function isStr(v) {
	return typeof v === 'string';
}

function isObj(v) {
	return typeof v === 'object' && v !== null;
}

function copy(o) {
	let out;

	if (isArr(o))
		out = o.map(copy);
	else if (isObj(o)) {
		out = {};
		for (var k in o)
			out[k] = copy(o[k]);
	}
	else
		out = o;

	return out;
}

function uPlot_esm_assign(targ) {
	let args = arguments;

	for (let i = 1; i < args.length; i++) {
		let src = args[i];

		for (let key in src) {
			if (isObj(targ[key]))
				uPlot_esm_assign(targ[key], copy(src[key]));
			else
				targ[key] = copy(src[key]);
		}
	}

	return targ;
}

const WIDTH = "width";
const HEIGHT = "height";
const TOP = "top";
const BOTTOM = "bottom";
const LEFT = "left";
const RIGHT = "right";
const firstChild = "firstChild";
const createElement = "createElement";
const hexBlack = "#000";
const classList = "classList";

const mousemove = "mousemove";
const mousedown = "mousedown";
const mouseup = "mouseup";
const mouseleave = "mouseleave";
const dblclick = "dblclick";
const resize = "resize";
const uPlot_esm_scroll = "scroll";

const rAF = requestAnimationFrame;
const doc = document;
const win = window;
const pxRatio = devicePixelRatio;

function addClass(el, c) {
	c != null && el[classList].add(c);
}

function remClass(el, c) {
	el[classList].remove(c);
}

function setStylePx(el, name, value) {
	el.style[name] = value + "px";
}

function placeTag(tag, cls, targ, refEl) {
	let el = doc[createElement](tag);

	if (cls != null)
		addClass(el, cls);

	if (targ != null)
		targ.insertBefore(el, refEl);

	return el;
}

function placeDiv(cls, targ) {
	return placeTag("div", cls, targ);
}

function trans(el, xPos, yPos) {
	el.style.transform = "translate(" + xPos + "px," + yPos + "px)";
}

const evOpts = {passive: true};

function on(ev, el, cb) {
	el.addEventListener(ev, cb, evOpts);
}

function off(ev, el, cb) {
	el.removeEventListener(ev, cb, evOpts);
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

function slice3(str) {
	return str.slice(0, 3);
}

const days3 =  days.map(slice3);

const months3 =  months.map(slice3);

const engNames = {
	MMMM: months,
	MMM:  months3,
	WWWW: days,
	WWW:  days3,
};

function zeroPad2(int) {
	return (int < 10 ? '0' : '') + int;
}

function zeroPad3(int) {
	return (int < 10 ? '00' : int < 100 ? '0' : '') + int;
}

/*
function suffix(int) {
	let mod10 = int % 10;

	return int + (
		mod10 == 1 && int != 11 ? "st" :
		mod10 == 2 && int != 12 ? "nd" :
		mod10 == 3 && int != 13 ? "rd" : "th"
	);
}
*/

const getFullYear = 'getFullYear';
const getMonth = 'getMonth';
const getDate = 'getDate';
const getDay = 'getDay';
const getHours = 'getHours';
const getMinutes = 'getMinutes';
const getSeconds = 'getSeconds';
const getMilliseconds = 'getMilliseconds';

const subs = {
	// 2019
	YYYY:	d => d[getFullYear](),
	// 19
	YY:		d => (d[getFullYear]()+'').slice(2),
	// July
	MMMM:	(d, names) => names.MMMM[d[getMonth]()],
	// Jul
	MMM:	(d, names) => names.MMM[d[getMonth]()],
	// 07
	MM:		d => zeroPad2(d[getMonth]()+1),
	// 7
	M:		d => d[getMonth]()+1,
	// 09
	DD:		d => zeroPad2(d[getDate]()),
	// 9
	D:		d => d[getDate](),
	// Monday
	WWWW:	(d, names) => names.WWWW[d[getDay]()],
	// Mon
	WWW:	(d, names) => names.WWW[d[getDay]()],
	// 03
	HH:		d => zeroPad2(d[getHours]()),
	// 3
	H:		d => d[getHours](),
	// 9 (12hr, unpadded)
	h:		d => {let h = d[getHours](); return h == 0 ? 12 : h > 12 ? h - 12 : h;},
	// AM
	AA:		d => d[getHours]() >= 12 ? 'PM' : 'AM',
	// am
	aa:		d => d[getHours]() >= 12 ? 'pm' : 'am',
	// a
	a:		d => d[getHours]() >= 12 ? 'p' : 'a',
	// 09
	mm:		d => zeroPad2(d[getMinutes]()),
	// 9
	m:		d => d[getMinutes](),
	// 09
	ss:		d => zeroPad2(d[getSeconds]()),
	// 9
	s:		d => d[getSeconds](),
	// 374
	fff:	d => zeroPad3(d[getMilliseconds]()),
};

function fmtDate(tpl, names) {
	names = names || engNames;
	let parts = [];

	let R = /\{([a-z]+)\}|[^{]+/gi, m;

	while (m = R.exec(tpl))
		parts.push(m[0][0] == '{' ? subs[m[1]] : m[0]);

	return d => {
		let out = '';

		for (let i = 0; i < parts.length; i++)
			out += typeof parts[i] == "string" ? parts[i] : parts[i](d, names);

		return out;
	}
}

// https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone/53652131#53652131
function uPlot_esm_tzDate(date, tz) {
	let date2 = new Date(date.toLocaleString('en-US', {timeZone: tz}));
	date2.setMilliseconds(date[getMilliseconds]());
	return date2;
}

//export const series = [];

// default formatters:

function genIncrs(minExp, maxExp, mults) {
	let incrs = [];

	for (let exp = minExp; exp < maxExp; exp++) {
		for (let i = 0; i < mults.length; i++) {
			let incr = mults[i] * pow(10, exp);
			incrs.push(+incr.toFixed(abs(exp)));
		}
	}

	return incrs;
}

const incrMults = [1,2,5];

const decIncrs = genIncrs(-12, 0, incrMults);

const intIncrs = genIncrs(0, 12, incrMults);

const numIncrs = decIncrs.concat(intIncrs);

let s = 1,
	m = 60,
	h = m * m,
	d = h * 24,
	mo = d * 30,
	y = d * 365;

// starting below 1e-3 is a hack to allow the incr finder to choose & bail out at incr < 1ms
const timeIncrs =  [5e-4].concat(genIncrs(-3, 0, incrMults), [
	// minute divisors (# of secs)
	1,
	5,
	10,
	15,
	30,
	// hour divisors (# of mins)
	m,
	m * 5,
	m * 10,
	m * 15,
	m * 30,
	// day divisors (# of hrs)
	h,
	h * 2,
	h * 3,
	h * 4,
	h * 6,
	h * 8,
	h * 12,
	// month divisors TODO: need more?
	d,
	d * 2,
	d * 3,
	d * 4,
	d * 5,
	d * 6,
	d * 7,
	d * 8,
	d * 9,
	d * 10,
	d * 15,
	// year divisors (# months, approx)
	mo,
	mo * 2,
	mo * 3,
	mo * 4,
	mo * 6,
	// century divisors
	y,
	y * 2,
	y * 5,
	y * 10,
	y * 25,
	y * 50,
	y * 100,
]);

function timeAxisStamps(stampCfg, fmtDate) {
	return stampCfg.map(s => [
		s[0],
		fmtDate(s[1]),
		s[2],
		fmtDate(s[4] ? s[1] + s[3] : s[3]),
	]);
}

const yyyy = "{YYYY}";
const NLyyyy = "\n" + yyyy;
const md = "{M}/{D}";
const NLmd = "\n" + md;

const aa = "{aa}";
const hmm = "{h}:{mm}";
const hmmaa = hmm + aa;
const ss = ":{ss}";

// [0]: minimum num secs in the tick incr
// [1]: normal tick format
// [2]: when a differing <x> is encountered - 1: sec, 2: min, 3: hour, 4: day, 5: week, 6: month, 7: year
// [3]: use a longer more contextual format
// [4]: modes: 0: replace [1] -> [3], 1: concat [1] + [3]
const _timeAxisStamps = [
	[y,        yyyy,            7,   "",                    1],
	[d * 28,   "{MMM}",         7,   NLyyyy,                1],
	[d,        md,              7,   NLyyyy,                1],
	[h,        "{h}" + aa,      4,   NLmd,                  1],
	[m,        hmmaa,           4,   NLmd,                  1],
	[s,        ss,              2,   NLmd  + " " + hmmaa,   1],
	[1e-3,     ss + ".{fff}",   2,   NLmd  + " " + hmmaa,   1],
];

// TODO: will need to accept spaces[] and pull incr into the loop when grid will be non-uniform, eg for log scales.
// currently we ignore this for months since they're *nearly* uniform and the added complexity is not worth it
function timeAxisVals(tzDate, stamps) {
	return (self, splits, space) => {
		let incr = round3(splits[1] - splits[0]);
		let s = stamps.find(e => incr >= e[0]);

		// these track boundaries when a full label is needed again
		let prevYear = null;
		let prevDate = null;
		let prevMinu = null;

		return splits.map((split, i) => {
			let date = tzDate(split);

			let newYear = date[getFullYear]();
			let newDate = date[getDate]();
			let newMinu = date[getMinutes]();

			let diffYear = newYear != prevYear;
			let diffDate = newDate != prevDate;
			let diffMinu = newMinu != prevMinu;

			let stamp = s[2] == 7 && diffYear || s[2] == 4 && diffDate || s[2] == 2 && diffMinu ? s[3] : s[1];

			prevYear = newYear;
			prevDate = newDate;
			prevMinu = newMinu;

			return stamp(date);
		});
	}
}

function mkDate(y, m, d) {
	return new Date(y, m, d);
}

// the ensures that axis ticks, values & grid are aligned to logical temporal breakpoints and not an arbitrary timestamp
// https://www.timeanddate.com/time/dst/
// https://www.timeanddate.com/time/dst/2019.html
// https://www.epochconverter.com/timezones
function timeAxisSplits(tzDate) {
	return (self, scaleMin, scaleMax, incr, pctSpace) => {
		let splits = [];
		let isMo = incr >= mo && incr < y;

		// get the timezone-adjusted date
		let minDate = tzDate(scaleMin);
		let minDateTs = minDate / 1e3;

		// get ts of 12am (this lands us at or before the original scaleMin)
		let minMin = mkDate(minDate[getFullYear](), minDate[getMonth](), isMo ? 1 : minDate[getDate]());
		let minMinTs = minMin / 1e3;

		if (isMo) {
			let moIncr = incr / mo;
		//	let tzOffset = scaleMin - minDateTs;		// needed?
			let split = minDateTs == minMinTs ? minDateTs : mkDate(minMin[getFullYear](), minMin[getMonth]() + moIncr, 1) / 1e3;
			let splitDate = new Date(split * 1e3);
			let baseYear = splitDate[getFullYear]();
			let baseMonth = splitDate[getMonth]();

			for (let i = 0; split <= scaleMax; i++) {
				let next = mkDate(baseYear, baseMonth + moIncr * i, 1);
				let offs = next - tzDate(next / 1e3);

				split = (+next + offs) / 1e3;

				if (split <= scaleMax)
					splits.push(split);
			}
		}
		else {
			let incr0 = incr >= d ? d : incr;
			let tzOffset = floor(scaleMin) - floor(minDateTs);
			let split = minMinTs + tzOffset + incrRoundUp(minDateTs - minMinTs, incr0);
			splits.push(split);

			let date0 = tzDate(split);

			let prevHour = date0[getHours]() + (date0[getMinutes]() / m) + (date0[getSeconds]() / h);
			let incrHours = incr / h;

			while (1) {
				split = round3(split + incr);

				let expectedHour = floor(round6(prevHour + incrHours)) % 24;
				let splitDate = tzDate(split);
				let actualHour = splitDate.getHours();

				let dstShift = actualHour - expectedHour;

				if (dstShift > 1)
					dstShift = -1;

				split -= dstShift * h;

				if (split > scaleMax)
					break;

				prevHour = (prevHour + incrHours) % 24;

				// add a tick only if it's further than 70% of the min allowed label spacing
				let prevSplit = splits[splits.length - 1];
				let pctIncr = round3((split - prevSplit) / incr);

				if (pctIncr * pctSpace >= .7)
					splits.push(split);
			}
		}

		return splits;
	}
}

function timeSeriesStamp(stampCfg, fmtDate) {
	return fmtDate(stampCfg);
}
const _timeSeriesStamp = '{YYYY}-{MM}-{DD} {h}:{mm}{aa}';

function timeSeriesVal(tzDate, stamp) {
	return (self, val) => stamp(tzDate(val));
}

function cursorPoint(self, si) {
	let s = self.series[si];

	let pt = placeDiv();

	pt.style.background = s.stroke || hexBlack;

	let dia = ptDia(s.width, 1);
	let mar = (dia - 1) / -2;

	setStylePx(pt, WIDTH, dia);
	setStylePx(pt, HEIGHT, dia);
	setStylePx(pt, "marginLeft", mar);
	setStylePx(pt, "marginTop", mar);

	return pt;
}

const cursorOpts = {
	show: true,
	x: true,
	y: true,
	lock: false,
	points: {
		show: cursorPoint,
	},

	drag: {
		setScale: true,
		x: true,
		y: false,
	},

	focus: {
		prox: -1,
	},

	locked: false,
	left: -10,
	top: -10,
	idx: null,
};

const grid = {
	show: true,
	stroke: "rgba(0,0,0,0.07)",
	width: 2,
//	dash: [],
};

const ticks = uPlot_esm_assign({}, grid, {size: 10});

const font      = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const labelFont = "bold " + font;
const lineMult = 1.5;		// font-size multiplier

const xAxisOpts = {
	type: "x",
	show: true,
	scale: "x",
	space: 50,
	gap: 5,
	size: 50,
	labelSize: 30,
	labelFont,
	side: 2,
//	class: "x-vals",
//	incrs: timeIncrs,
//	values: timeVals,
	grid,
	ticks,
	font,
};

const numSeriesLabel = "Value";
const timeSeriesLabel = "Time";

const xSeriesOpts = {
	show: true,
	scale: "x",
//	label: "Time",
//	value: v => stamp(new Date(v * 1e3)),

	// internal caches
	min: inf,
	max: -inf,
	idxs: [],
};

// alternative: https://stackoverflow.com/a/2254896
let fmtNum = new Intl.NumberFormat(navigator.language);

function numAxisVals(self, splits, space) {
	return splits.map(fmtNum.format);
}

function numAxisSplits(self, scaleMin, scaleMax, incr, pctSpace, forceMin) {
	scaleMin = forceMin ? scaleMin : +incrRoundUp(scaleMin, incr).toFixed(12);

	let splits = [];

	for (let val = scaleMin; val <= scaleMax; val = +(val + incr).toFixed(12))
		splits.push(val);

	return splits;
}

function numSeriesVal(self, val) {
	return val;
}

const yAxisOpts = {
	type: "y",
	show: true,
	scale: "y",
	space: 40,
	gap: 5,
	size: 50,
	labelSize: 30,
	labelFont,
	side: 3,
//	class: "y-vals",
//	incrs: numIncrs,
//	values: (vals, space) => vals,
	grid,
	ticks,
	font,
};

// takes stroke width
function ptDia(width, mult) {
	return max(round3(5 * mult), round3(width * mult) * 2 - 1);
}

function seriesPoints(self, si) {
	const dia = ptDia(self.series[si].width, pxRatio);
	let maxPts = self.bbox.width / dia / 2;
	let idxs = self.series[0].idxs;
	return idxs[1] - idxs[0] <= maxPts;
}

const ySeriesOpts = {
//	type: "n",
	scale: "y",
	show: true,
	band: false,
	alpha: 1,
	points: {
		show: seriesPoints,
	//	stroke: "#000",
	//	fill: "#fff",
	//	width: 1,
	//	size: 10,
	},
//	label: "Value",
//	value: v => v,
	values: null,

	// internal caches
	min: inf,
	max: -inf,
	idxs: [],

	path: null,
	clip: null,
};

const xScaleOpts = {
	time: true,
	auto: false,
	distr: 1,
	min:  inf,
	max: -inf,
};

const yScaleOpts = uPlot_esm_assign({}, xScaleOpts, {
	time: false,
	auto: true,
});

const syncs = {};

function _sync(opts) {
	let clients = [];

	return {
		sub(client) {
			clients.push(client);
		},
		unsub(client) {
			clients = clients.filter(c => c != client);
		},
		pub(type, self, x, y, w, h, i) {
			if (clients.length > 1) {
				clients.forEach(client => {
					client != self && client.pub(type, self, x, y, w, h, i);
				});
			}
		}
	};
}

function setDefaults(d, xo, yo) {
	return [d[0], d[1]].concat(d.slice(2)).map((o, i) => setDefault(o, i, xo, yo));
}

function setDefault(o, i, xo, yo) {
	return uPlot_esm_assign({}, (i == 0 || o && o.side % 2 == 0 ? xo : yo), o);
}

function getYPos(val, scale, hgt, top) {
	let pctY = (val - scale.min) / (scale.max - scale.min);
	return top + (1 - pctY) * hgt;
}

function getXPos(val, scale, wid, lft) {
	let pctX = (val - scale.min) / (scale.max - scale.min);
	return lft + pctX * wid;
}

function snapNone(self, dataMin, dataMax) {
	return [dataMin, dataMax];
}

// this ensures that non-temporal/numeric y-axes get multiple-snapped padding added above/below
// TODO: also account for incrs when snapping to ensure top of axis gets a tick & value
function snapFifthMag(self, dataMin, dataMax) {
	return rangeNum(dataMin, dataMax, 0.2, true);
}

// dim is logical (getClientBoundingRect) pixels, not canvas pixels
function findIncr(valDelta, incrs, dim, minSpace) {
	let pxPerUnit = dim / valDelta;

	for (var i = 0; i < incrs.length; i++) {
		let space = incrs[i] * pxPerUnit;

		if (space >= minSpace)
			return [incrs[i], space];
	}
}

function filtMouse(e) {
	return e.button == 0;
}

function pxRatioFont(font) {
	let fontSize;
	font = font.replace(/\d+/, m => (fontSize = round(m * pxRatio)));
	return [font, fontSize];
}

function uPlot(opts, data, then) {
	const self = {};

	const root = self.root = placeDiv("uplot");

	if (opts.id != null)
		root.id = opts.id;

	addClass(root, opts.class);

	if (opts.title) {
		let title = placeDiv("title", root);
		title.textContent = opts.title;
	}

	const can = placeTag("canvas");
	const ctx = self.ctx = can.getContext("2d");

	const wrap = placeDiv("wrap", root);
	const under = placeDiv("under", wrap);
	wrap.appendChild(can);
	const over = placeDiv("over", wrap);

	opts = copy(opts);

	(opts.plugins || []).forEach(p => {
		if (p.opts)
			opts = p.opts(self, opts) || opts;
	});

	let ready = false;

	const series  = setDefaults(opts.series, xSeriesOpts, ySeriesOpts);
	const axes    = setDefaults(opts.axes || [], xAxisOpts, yAxisOpts);
	const scales  = (opts.scales = opts.scales || {});

	const gutters = uPlot_esm_assign({
		x: round(yAxisOpts.size / 2),
		y: round(xAxisOpts.size / 3),
	}, opts.gutters);

//	self.tz = opts.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
	const _tzDate  =  (opts.tzDate || (ts => new Date(ts * 1e3)));
	const _fmtDate =  (opts.fmtDate || fmtDate);

	const _timeAxisSplits =  timeAxisSplits(_tzDate);
	const _timeAxisVals   =  timeAxisVals(_tzDate, timeAxisStamps(_timeAxisStamps, _fmtDate));
	const _timeSeriesVal  =  timeSeriesVal(_tzDate, timeSeriesStamp(_timeSeriesStamp, _fmtDate));

	self.series = series;
	self.axes = axes;
	self.scales = scales;

	const pendScales = {};

	// explicitly-set initial scales
	for (let k in scales) {
		let sc = scales[k];

		if (sc.min != null || sc.max != null)
			pendScales[k] = {min: sc.min, max: sc.max};
	}

	const legend     =  uPlot_esm_assign({show: true}, opts.legend);
	const showLegend =  legend.show;

	let legendEl;
	let legendRows = [];
	let legendCols;
	let multiValLegend = false;

	if (showLegend) {
		legendEl = placeTag("table", "legend", root);

		const getMultiVals = series[1].values;
		multiValLegend = getMultiVals != null;

		if (multiValLegend) {
			let head = placeTag("tr", "labels", legendEl);
			placeTag("th", null, head);
			legendCols = getMultiVals(self, 1, 0);

			for (var key in legendCols)
				placeTag("th", null, head).textContent = key;
		}
		else {
			legendCols = {_: 0};
			addClass(legendEl, "inline");
		}
	}

	function initLegendRow(s, i) {
		if (i == 0 && multiValLegend)
			return null;

		let _row = [];

		let row = placeTag("tr", "series", legendEl, legendEl.childNodes[i]);

		addClass(row, s.class);

		if (!s.show)
			addClass(row, "off");

		let label = placeTag("th", null, row);

		let indic = placeDiv("ident", label);
		s.width && (indic.style.borderColor = s.stroke);
		indic.style.backgroundColor = s.fill;

		let text = placeDiv("text", label);
		text.textContent = s.label;

		if (i > 0) {
			on("click", label, e => {
				if ( cursor.locked)
					return;

				filtMouse(e) && setSeries(series.indexOf(s), {show: !s.show},  syncOpts.setSeries);
			});

			if (cursorFocus) {
				on("mouseenter", label, e => {
					if (cursor.locked)
						return;

					setSeries(series.indexOf(s), {focus: true}, syncOpts.setSeries);
				});
			}
		}

		for (var key in legendCols) {
			let v = placeTag("td", null, row);
			v.textContent = "--";
			_row.push(v);
		}

		return _row;
	}

	const cursor =  (self.cursor = uPlot_esm_assign({}, cursorOpts, opts.cursor));

	 (cursor.points.show = fnOrSelf(cursor.points.show));

	const focus = self.focus = uPlot_esm_assign({}, opts.focus || {alpha: 0.3},  cursor.focus);
	const cursorFocus =  focus.prox >= 0;

	// series-intersection markers
	let cursorPts = [null];

	function initCursorPt(s, si) {
		if (si > 0) {
			let pt = cursor.points.show(self, si);

			if (pt) {
				addClass(pt, "cursor-pt");
				addClass(pt, s.class);
				trans(pt, -10, -10);
				over.insertBefore(pt, cursorPts[si]);

				return pt;
			}
		}
	}

	function initSeries(s, i) {
		// init scales & defaults
		const scKey = s.scale;

		const sc = scales[scKey] = uPlot_esm_assign({}, (i == 0 ? xScaleOpts : yScaleOpts), scales[scKey]);

		let isTime =  sc.time;

		sc.range = fnOrSelf(sc.range || (isTime || i == 0 ? snapNone : snapFifthMag));

		s.spanGaps = s.spanGaps === true ? retArg2 : fnOrSelf(s.spanGaps || []);

		let sv = s.value;
		s.value = isTime ? (isStr(sv) ? timeSeriesVal(_tzDate, timeSeriesStamp(sv, _fmtDate)) : sv || _timeSeriesVal) : sv || numSeriesVal;
		s.label = s.label || (isTime ? timeSeriesLabel : numSeriesLabel);

		if (i > 0) {
			s.width = s.width == null ? 1 : s.width;
			s.paths = s.paths || ( buildPaths);
			let _ptDia = ptDia(s.width, 1);
			s.points = uPlot_esm_assign({}, {
				size: _ptDia,
				width: max(1, _ptDia * .2),
			}, s.points);
			s.points.show = fnOrSelf(s.points.show);
			s._paths = null;
		}

		if (showLegend)
			legendRows.splice(i, 0, initLegendRow(s, i));

		if ( cursor.show) {
			let pt = initCursorPt(s, i);
			pt && cursorPts.splice(i, 0, pt);
		}
	}

	function addSeries(opts, si) {
		si = si == null ? series.length : si;

		opts = setDefault(opts, si, xSeriesOpts, ySeriesOpts);
		series.splice(si, 0, opts);
		initSeries(series[si], si);
	}

	self.addSeries = addSeries;

	function delSeries(i) {
		series.splice(i, 1);
		 legendRows.splice(i, 1)[0][0].parentNode.remove();
		 cursorPts.splice(i, 1)[0].remove();

		// TODO: de-init no-longer-needed scales?
	}

	self.delSeries = delSeries;

	series.forEach(initSeries);

	// dependent scales inherit
	for (let k in scales) {
		let sc = scales[k];

		if (sc.from != null)
			scales[k] = uPlot_esm_assign({}, scales[sc.from], sc);
	}

	const xScaleKey = series[0].scale;
	const xScaleDistr = scales[xScaleKey].distr;

	function initAxis(axis, i) {
		if (axis.show) {
			let isVt = axis.side % 2;

			let sc = scales[axis.scale];

			// this can occur if all series specify non-default scales
			if (sc == null) {
				axis.scale = isVt ? series[1].scale : xScaleKey;
				sc = scales[axis.scale];
			}

			// also set defaults for incrs & values based on axis distr
			let isTime =  sc.time;

			axis.space = fnOrSelf(axis.space);
			axis.incrs = fnOrSelf(axis.incrs || (          sc.distr == 2 ? intIncrs : (isTime ? timeIncrs : numIncrs)));
			axis.split = fnOrSelf(axis.split || (isTime && sc.distr == 1 ? _timeAxisSplits : numAxisSplits));
			let av = axis.values;
			axis.values = isTime ? (isArr(av) ? timeAxisVals(_tzDate, timeAxisStamps(av, _fmtDate)) : av || _timeAxisVals) : av || numAxisVals;

			axis.font      = pxRatioFont(axis.font);
			axis.labelFont = pxRatioFont(axis.labelFont);
		}
	}

	// set axis defaults
	axes.forEach(initAxis);

	let dataLen;

	// rendered data window
	let i0 = null;
	let i1 = null;
	const idxs = series[0].idxs;

	let data0 = null;

	function setData(_data, _resetScales) {
		self.data = _data;
		data = _data.slice();
		data0 = data[0];
		dataLen = data0.length;

		if (xScaleDistr == 2)
			data[0] = data0.map((v, i) => i);

		resetYSeries();

		fire("setData");

		_resetScales !== false && autoScaleX();
	}

	self.setData = setData;

	function autoScaleX() {
		i0 = idxs[0] = 0;
		i1 = idxs[1] = dataLen - 1;

		let _min = xScaleDistr == 2 ? i0 : data[0][i0],
			_max = xScaleDistr == 2 ? i1 : data[0][i1];

		_setScale(xScaleKey, _min, _max);
	}

	function setCtxStyle(stroke, width, dash, fill) {
		ctx.strokeStyle = stroke || hexBlack;
		ctx.lineWidth = width;
		ctx.lineJoin = "round";
		ctx.setLineDash(dash || []);
		ctx.fillStyle = fill || hexBlack;
	}

	let fullWidCss;
	let fullHgtCss;

	let plotWidCss;
	let plotHgtCss;

	// plot margins to account for axes
	let plotLftCss;
	let plotTopCss;

	let plotLft;
	let plotTop;
	let plotWid;
	let plotHgt;

	self.bbox = {};

	function _setSize(width, height) {
		self.width  = fullWidCss = plotWidCss = width;
		self.height = fullHgtCss = plotHgtCss = height;
		plotLftCss  = plotTopCss = 0;

		calcPlotRect();
		calcAxesRects();

		let bb = self.bbox;

		plotLft = bb[LEFT]   = incrRound(plotLftCss * pxRatio, 0.5);
		plotTop = bb[TOP]    = incrRound(plotTopCss * pxRatio, 0.5);
		plotWid = bb[WIDTH]  = incrRound(plotWidCss * pxRatio, 0.5);
		plotHgt = bb[HEIGHT] = incrRound(plotHgtCss * pxRatio, 0.5);

		setStylePx(under, LEFT,   plotLftCss);
		setStylePx(under, TOP,    plotTopCss);
		setStylePx(under, WIDTH,  plotWidCss);
		setStylePx(under, HEIGHT, plotHgtCss);

		setStylePx(over, LEFT,    plotLftCss);
		setStylePx(over, TOP,     plotTopCss);
		setStylePx(over, WIDTH,   plotWidCss);
		setStylePx(over, HEIGHT,  plotHgtCss);

		setStylePx(wrap, WIDTH,   fullWidCss);
		setStylePx(wrap, HEIGHT,  fullHgtCss);

		can[WIDTH]  = round(fullWidCss * pxRatio);
		can[HEIGHT] = round(fullHgtCss * pxRatio);

		syncRect();

		ready && _setScale(xScaleKey, scales[xScaleKey].min, scales[xScaleKey].max);

		ready && fire("setSize");
	}

	function setSize({width, height}) {
		_setSize(width, height);
	}

	self.setSize = setSize;

	// accumulate axis offsets, reduce canvas width
	function calcPlotRect() {
		// easements for edge labels
		let hasTopAxis = false;
		let hasBtmAxis = false;
		let hasRgtAxis = false;
		let hasLftAxis = false;

		axes.forEach((axis, i) => {
			if (axis.show) {
				let {side, size} = axis;
				let isVt = side % 2;
				let labelSize = axis.labelSize = (axis.label != null ? (axis.labelSize || 30) : 0);

				let fullSize = size + labelSize;

				if (fullSize > 0) {
					if (isVt) {
						plotWidCss -= fullSize;

						if (side == 3) {
							plotLftCss += fullSize;
							hasLftAxis = true;
						}
						else
							hasRgtAxis = true;
					}
					else {
						plotHgtCss -= fullSize;

						if (side == 0) {
							plotTopCss += fullSize;
							hasTopAxis = true;
						}
						else
							hasBtmAxis = true;
					}
				}
			}
		});

		// hz gutters
		if (hasTopAxis || hasBtmAxis) {
			if (!hasRgtAxis)
				plotWidCss -= gutters.x;
			if (!hasLftAxis) {
				plotWidCss -= gutters.x;
				plotLftCss += gutters.x;
			}
		}

		// vt gutters
		if (hasLftAxis || hasRgtAxis) {
			if (!hasBtmAxis)
				plotHgtCss -= gutters.y;
			if (!hasTopAxis) {
				plotHgtCss -= gutters.y;
				plotTopCss += gutters.y;
			}
		}
	}

	function calcAxesRects() {
		// will accum +
		let off1 = plotLftCss + plotWidCss;
		let off2 = plotTopCss + plotHgtCss;
		// will accum -
		let off3 = plotLftCss;
		let off0 = plotTopCss;

		function incrOffset(side, size) {

			switch (side) {
				case 1: off1 += size; return off1 - size;
				case 2: off2 += size; return off2 - size;
				case 3: off3 -= size; return off3 + size;
				case 0: off0 -= size; return off0 + size;
			}
		}

		axes.forEach((axis, i) => {
			let side = axis.side;

			axis._pos = incrOffset(side, axis.size);

			if (axis.label != null)
				axis._lpos = incrOffset(side, axis.labelSize);
		});
	}

	function setScales() {
		if (inBatch) {
			shouldSetScales = true;
			return;
		}

	//	log("setScales()", arguments);

		// cache original scales' min/max & reset
		let minMaxes = {};

		for (let k in scales) {
			let sc = scales[k];
			let psc = pendScales[k];

			minMaxes[k] = {
				min: sc.min,
				max: sc.max
			};

			if (psc != null) {
				uPlot_esm_assign(sc, psc);

				// explicitly setting the x-scale invalidates everything (acts as redraw)
				if (k == xScaleKey)
					resetYSeries();
			}
			else if (k != xScaleKey) {
				sc.min = inf;
				sc.max = -inf;
			}
		}

		// pre-range y-scales from y series' data values
		series.forEach((s, i) => {
			let k = s.scale;
			let sc = scales[k];

			// setting the x scale invalidates everything
			if (i == 0) {
				let minMax = sc.range(self, sc.min, sc.max);

				sc.min = minMax[0];
				sc.max = minMax[1];

				i0 = closestIdx(sc.min, data[0]);
				i1 = closestIdx(sc.max, data[0]);

				// closest indices can be outside of view
				if (data[0][i0] < sc.min)
					i0++;
				if (data[0][i1] > sc.max)
					i1--;

				s.min = data0[i0];
				s.max = data0[i1];
			}
			else if (s.show && pendScales[k] == null) {
				// only run getMinMax() for invalidated series data, else reuse
				let minMax = s.min == inf ? (sc.auto ? getMinMax(data[i], i0, i1) : [0,100]) : [s.min, s.max];

				// initial min/max
				sc.min = min(sc.min, s.min = minMax[0]);
				sc.max = max(sc.max, s.max = minMax[1]);
			}

			s.idxs[0] = i0;
			s.idxs[1] = i1;
		});

		// snap non-dependent scales
		for (let k in scales) {
			let sc = scales[k];

			if (sc.from == null && sc.min != inf && pendScales[k] == null) {
				let minMax = sc.range(self, sc.min, sc.max);

				sc.min = minMax[0];
				sc.max = minMax[1];
			}

			pendScales[k] = null;
		}

		// range dependent scales
		for (let k in scales) {
			let sc = scales[k];

			if (sc.from != null) {
				let base = scales[sc.from];

				if (base.min != inf) {
					let minMax = sc.range(self, base.min, base.max);
					sc.min = minMax[0];
					sc.max = minMax[1];
				}
			}
		}

		let changed = {};

		// invalidate paths of all series on changed scales
		series.forEach((s, i) => {
			let k = s.scale;
			let sc = scales[k];

			if (minMaxes[k] != null && (sc.min != minMaxes[k].min || sc.max != minMaxes[k].max)) {
				changed[k] = true;
				s._paths = null;
			}
		});

		for (let k in changed)
			fire("setScale", k);

		 cursor.show && updateCursor();
	}

	// TODO: drawWrap(si, drawPoints) (save, restore, translate, clip)

	function drawPoints(si) {
	//	log("drawPoints()", arguments);

		let s = series[si];
		let p = s.points;

		const width = round3(s[WIDTH] * pxRatio);
		const offset = (width % 2) / 2;
		const isStroked = p.width > 0;

		let rad = (p.size - p.width) / 2 * pxRatio;
		let dia = round3(rad * 2);

		ctx.translate(offset, offset);

		ctx.save();

		ctx.beginPath();
		ctx.rect(
			plotLft - dia,
			plotTop - dia,
			plotWid + dia * 2,
			plotHgt + dia * 2,
		);
		ctx.clip();

		ctx.globalAlpha = s.alpha;

		const path = new Path2D();

		for (let pi = i0; pi <= i1; pi++) {
			if (data[si][pi] != null) {
				let x = round(getXPos(data[0][pi],  scales[xScaleKey], plotWid, plotLft));
				let y = round(getYPos(data[si][pi], scales[s.scale],   plotHgt, plotTop));

				path.moveTo(x + rad, y);
				path.arc(x, y, rad, 0, PI * 2);
			}
		}

		setCtxStyle(
			p.stroke || s.stroke || hexBlack,
			width,
			null,
			p.fill || (isStroked ? "#fff" : s.stroke || hexBlack),
		);

		ctx.fill(path);
		isStroked && ctx.stroke(path);

		ctx.globalAlpha = 1;

		ctx.restore();

		ctx.translate(-offset, -offset);
	}

	// grabs the nearest indices with y data outside of x-scale limits
	function getOuterIdxs(ydata) {
		let _i0 = clamp(i0 - 1, 0, dataLen - 1);
		let _i1 = clamp(i1 + 1, 0, dataLen - 1);

		while (ydata[_i0] == null && _i0 > 0)
			_i0--;

		while (ydata[_i1] == null && _i1 < dataLen - 1)
			_i1++;

		return [_i0, _i1];
	}

	let dir = 1;

	function drawSeries() {
		// path building loop must be before draw loop to ensure that all bands are fully constructed
		series.forEach((s, i) => {
			if (i > 0 && s.show && s._paths == null) {
				let _idxs = getOuterIdxs(data[i]);
				s._paths = s.paths(self, i, _idxs[0], _idxs[1]);
			}
		});

		series.forEach((s, i) => {
			if (i > 0 && s.show) {
				if (s._paths)
					 drawPath(i);

				if (s.points.show(self, i, i0, i1))
					 drawPoints(i);

				fire("drawSeries", i);
			}
		});
	}

	function drawPath(si) {
		const s = series[si];

		if (dir == 1) {
			const { stroke, fill, clip } = s._paths;
			const width = round3(s[WIDTH] * pxRatio);
			const offset = (width % 2) / 2;

			setCtxStyle(s.stroke, width, s.dash, s.fill);

			ctx.globalAlpha = s.alpha;

			ctx.translate(offset, offset);

			ctx.save();

			let lft = plotLft,
				top = plotTop,
				wid = plotWid,
				hgt = plotHgt;

			let halfWid = width * pxRatio / 2;

			if (s.min == 0)
				hgt += halfWid;

			if (s.max == 0) {
				top -= halfWid;
				hgt += halfWid;
			}

			ctx.beginPath();
			ctx.rect(lft, top, wid, hgt);
			ctx.clip();

			if (clip != null)
				ctx.clip(clip);

			if (s.band) {
				ctx.fill(stroke);
				width && ctx.stroke(stroke);
			}
			else {
				width && ctx.stroke(stroke);

				if (s.fill != null)
					ctx.fill(fill);
			}

			ctx.restore();

			ctx.translate(-offset, -offset);

			ctx.globalAlpha = 1;
		}

		if (s.band)
			dir *= -1;
	}

	function buildClip(is, gaps) {
		let s = series[is];
		let toSpan = new Set(s.spanGaps(self, gaps, is));
		gaps = gaps.filter(g => !toSpan.has(g));

		let clip = null;

		// create clip path (invert gaps and non-gaps)
		if (gaps.length > 0) {
			clip = new Path2D();

			let prevGapEnd = plotLft;

			for (let i = 0; i < gaps.length; i++) {
				let g = gaps[i];

				clip.rect(prevGapEnd, plotTop, g[0] - prevGapEnd, plotTop + plotHgt);

				prevGapEnd = g[1];
			}

			clip.rect(prevGapEnd, plotTop, plotLft + plotWid - prevGapEnd, plotTop + plotHgt);
		}

		return clip;
	}

	function buildPaths(self, is, _i0, _i1) {
		const s = series[is];

		const xdata  = data[0];
		const ydata  = data[is];
		const scaleX = scales[xScaleKey];
		const scaleY = scales[s.scale];

		const _paths = dir == 1 ? {stroke: new Path2D(), fill: null, clip: null} : series[is-1]._paths;
		const stroke = _paths.stroke;
		const width = round3(s[WIDTH] * pxRatio);

		let minY = inf,
			maxY = -inf,
			outY, outX;

		// todo: don't build gaps on dir = -1 pass
		let gaps = [];

		let accX = round(getXPos(xdata[dir == 1 ? _i0 : _i1], scaleX, plotWid, plotLft));

		// the moves the shape edge outside the canvas so stroke doesnt bleed in
		if (s.band && dir == 1 && _i0 == i0) {
			if (width)
				stroke.lineTo(-width, round(getYPos(ydata[_i0], scaleY, plotHgt, plotTop)));

			if (scaleX.min < xdata[0])
				gaps.push([plotLft, accX - 1]);
		}

		for (let i = dir == 1 ? _i0 : _i1; i >= _i0 && i <= _i1; i += dir) {
			let x = round(getXPos(xdata[i], scaleX, plotWid, plotLft));

			if (x == accX) {
				if (ydata[i] != null) {
					outY = round(getYPos(ydata[i], scaleY, plotHgt, plotTop));
					minY = min(outY, minY);
					maxY = max(outY, maxY);
				}
			}
			else {
				let addGap = false;

				if (minY != inf) {
					stroke.lineTo(accX, minY);
					stroke.lineTo(accX, maxY);
					stroke.lineTo(accX, outY);
					outX = accX;
				}
				else
					addGap = true;

				if (ydata[i] != null) {
					outY = round(getYPos(ydata[i], scaleY, plotHgt, plotTop));
					stroke.lineTo(x, outY);
					minY = maxY = outY;

					// prior pixel can have data but still start a gap if ends with null
					if (x - accX > 1 && ydata[i-1] == null)
						addGap = true;
				}
				else {
					minY = inf;
					maxY = -inf;
				}

				if (addGap) {
					let prevGap = gaps[gaps.length - 1];

					if (prevGap && prevGap[0] == outX)			// TODO: gaps must be encoded at stroke widths?
						prevGap[1] = x;
					else
						gaps.push([outX, x]);
				}

				accX = x;
			}
		}

		if (s.band) {
			let overShoot = width * 100, _iy, _x;

			// the moves the shape edge outside the canvas so stroke doesnt bleed in
			if (dir == -1 && _i0 == i0) {
				_x = plotLft - overShoot;
				_iy = _i0;
			}

			if (dir == 1 && _i1 == i1) {
				_x = plotLft + plotWid + overShoot;
				_iy = _i1;

				if (scaleX.max > xdata[dataLen - 1])
					gaps.push([accX, plotLft + plotWid]);
			}

			stroke.lineTo(_x, round(getYPos(ydata[_iy], scaleY, plotHgt, plotTop)));
		}

		if (dir == 1) {
			_paths.clip = buildClip(is, gaps);

			if (s.fill != null) {
				let fill = _paths.fill = new Path2D(stroke);

				let zeroY = round(getYPos(0, scaleY, plotHgt, plotTop));
				fill.lineTo(plotLft + plotWid, zeroY);
				fill.lineTo(plotLft, zeroY);
			}
		}

		if (s.band)
			dir *= -1;

		return _paths;
	}

	function getIncrSpace(axis, min, max, fullDim) {
		let minSpace = axis.space(self, min, max, fullDim);
		let incrs = axis.incrs(self, min, max, fullDim, minSpace);
		let incrSpace = findIncr(max - min, incrs, fullDim, minSpace);
		incrSpace.push(incrSpace[1]/minSpace);
		return incrSpace;
	}

	function drawOrthoLines(offs, ori, side, pos0, len, width, stroke, dash) {
		let offset = (width % 2) / 2;

		ctx.translate(offset, offset);

		setCtxStyle(stroke, width, dash);

		ctx.beginPath();

		let x0, y0, x1, y1, pos1 = pos0 + (side == 0 || side == 3 ? -len : len);

		if (ori == 0) {
			y0 = pos0;
			y1 = pos1;
		}
		else {
			x0 = pos0;
			x1 = pos1;
		}

		offs.forEach((off, i) => {
			if (ori == 0)
				x0 = x1 = off;
			else
				y0 = y1 = off;

			ctx.moveTo(x0, y0);
			ctx.lineTo(x1, y1);
		});

		ctx.stroke();

		ctx.translate(-offset, -offset);
	}

	function drawAxesGrid() {
		axes.forEach((axis, i) => {
			if (!axis.show)
				return;

			let scale = scales[axis.scale];

			// this will happen if all series using a specific scale are toggled off
			if (scale.min == inf)
				return;

			let side = axis.side;
			let ori = side % 2;

			let {min, max} = scale;

			let [incr, space, pctSpace] = getIncrSpace(axis, min, max, ori == 0 ? plotWidCss : plotHgtCss);

			// if we're using index positions, force first tick to match passed index
			let forceMin = scale.distr == 2;

			let splits = axis.split(self, min, max, incr, pctSpace, forceMin);

			let getPos  = ori == 0 ? getXPos : getYPos;
			let plotDim = ori == 0 ? plotWid : plotHgt;
			let plotOff = ori == 0 ? plotLft : plotTop;

			let canOffs = splits.map(val => round(getPos(val, scale, plotDim, plotOff)));

			let axisGap  = round(axis.gap * pxRatio);

			let ticks = axis.ticks;
			let tickSize = ticks.show ? round(ticks.size * pxRatio) : 0;

			// tick labels
			let values = axis.values(self, scale.distr == 2 ? splits.map(i => data0[i]) : splits, space);		// BOO this assumes a specific data/series

			let basePos  = round(axis._pos * pxRatio);
			let shiftAmt = tickSize + axisGap;
			let shiftDir = ori == 0 && side == 0 || ori == 1 && side == 3 ? -1 : 1;
			let finalPos = basePos + shiftAmt * shiftDir;
			let y        = ori == 0 ? finalPos : 0;
			let x        = ori == 1 ? finalPos : 0;

			ctx.font         = axis.font[0];
			ctx.fillStyle    = axis.stroke || hexBlack;									// rgba?
			ctx.textAlign    = ori == 0 ? "center" : side == 3 ? RIGHT : LEFT;
			ctx.textBaseline = ori == 1 ? "middle" : side == 2 ? TOP   : BOTTOM;

			let lineHeight   = axis.font[1] * lineMult;

			values.forEach((val, i) => {
				if (ori == 0)
					x = canOffs[i];
				else
					y = canOffs[i];

				(""+val).split(/\n/gm).forEach((text, j) => {
					ctx.fillText(text, x, y + j * lineHeight);
				});
			});

			// axis label
			if (axis.label) {
				ctx.save();

				let baseLpos = round(axis._lpos * pxRatio);

				if (ori == 1) {
					x = y = 0;

					ctx.translate(
						baseLpos,
						round(plotTop + plotHgt / 2),
					);
					ctx.rotate((side == 3 ? -PI : PI) / 2);

				}
				else {
					x = round(plotLft + plotWid / 2);
					y = baseLpos;
				}

				ctx.font         = axis.labelFont[0];
			//	ctx.fillStyle    = axis.labelStroke || hexBlack;						// rgba?
				ctx.textAlign    = "center";
				ctx.textBaseline = side == 2 ? TOP : BOTTOM;

				ctx.fillText(axis.label, x, y);

				ctx.restore();
			}

			// ticks
			if (ticks.show) {
				drawOrthoLines(
					canOffs,
					ori,
					side,
					basePos,
					tickSize,
					round3(ticks[WIDTH] * pxRatio),
					ticks.stroke,
				);
			}

			// grid
			let grid = axis.grid;

			if (grid.show) {
				drawOrthoLines(
					canOffs,
					ori,
					ori == 0 ? 2 : 1,
					ori == 0 ? plotTop : plotLft,
					ori == 0 ? plotHgt : plotWid,
					round3(grid[WIDTH] * pxRatio),
					grid.stroke,
					grid.dash,
				);
			}
		});

		fire("drawAxes");
	}

	function resetYSeries() {
	//	log("resetYSeries()", arguments);

		series.forEach((s, i) => {
			if (i > 0) {
				s.min = inf;
				s.max = -inf;
				s._paths = null;
			}
		});
	}

	let didPaint;

	function paint() {
		if (inBatch) {
			shouldPaint = true;
			return;
		}

	//	log("paint()", arguments);

		ctx.clearRect(0, 0, can[WIDTH], can[HEIGHT]);
		fire("drawClear");
		drawAxesGrid();
		drawSeries();
		didPaint = true;
		fire("draw");
	}

	self.redraw = paint;

	// redraw() => setScale('x', scales.x.min, scales.x.max);

	// explicit, never re-ranged (is this actually true? for x and y)
	function setScale(key, opts) {
		let sc = scales[key];

		if (sc.from == null) {
			// prevent setting a temporal x scale too small since Date objects cannot advance ticks smaller than 1ms
			if ( key == xScaleKey && sc.time && axes[0].show) {
				// since scales and axes are loosly coupled, we have to make some assumptions here :(
				let incr = getIncrSpace(axes[0], opts.min, opts.max, plotWidCss)[0];

				if (incr < 1e-3)
					return;
			}

		//	log("setScale()", arguments);

			pendScales[key] = opts;

			didPaint = false;
			setScales();
			!didPaint && paint();
			didPaint = false;
		}
	}

	self.setScale = setScale;

//	INTERACTION

	let vt;
	let hz;

	// starting position
	let mouseLeft0;
	let mouseTop0;

	// current position
	let mouseLeft1;
	let mouseTop1;

	let dragging = false;

	const drag =  cursor.drag;

	if ( cursor.show) {
		let c = "cursor-";

		if (cursor.x) {
			mouseLeft1 = cursor.left;
			vt = placeDiv(c + "x", over);
		}

		if (cursor.y) {
			mouseTop1 = cursor.top;
			hz = placeDiv(c + "y", over);
		}
	}

	const select = self.select = uPlot_esm_assign({
		show:   true,
		left:	0,
		width:	0,
		top:	0,
		height:	0,
	}, opts.select);

	const selectDiv = select.show ? placeDiv("select", over) : null;

	function setSelect(opts, _fire) {
		if (select.show) {
			for (let prop in opts)
				setStylePx(selectDiv, prop, select[prop] = opts[prop]);

			_fire !== false && fire("setSelect");
		}
	}

	self.setSelect = setSelect;

	function toggleDOM(i, onOff) {
		let s = series[i];
		let label = showLegend ? legendRows[i][0].parentNode : null;

		if (s.show)
			label && remClass(label, "off");
		else {
			label && addClass(label, "off");
			 cursorPts.length > 1 && trans(cursorPts[i], 0, -10);
		}
	}

	function _setScale(key, min, max) {
		setScale(key, {min, max});
	}

	function setSeries(i, opts, pub) {
	//	log("setSeries()", arguments);

		let s = series[i];

	//	batch(() => {
			// will this cause redundant paint() if both show and focus are set?
			if (opts.focus != null)
				setFocus(i);

			if (opts.show != null) {
				s.show = opts.show;
				 toggleDOM(i, opts.show);

				if (s.band) {
					// not super robust, will break if two bands are adjacent
					let ip = series[i+1] && series[i+1].band ? i+1 : i-1;
					series[ip].show = s.show;
					 toggleDOM(ip, opts.show);
				}

				_setScale(xScaleKey, scales[xScaleKey].min, scales[xScaleKey].max);		// redraw
			}
	//	});

		// firing setSeries after setScale seems out of order, but provides access to the updated props
		// could improve by predefining firing order and building a queue
		fire("setSeries", i, opts);

		 pub && sync.pub("setSeries", self, i, opts);
	}

	self.setSeries = setSeries;

	function _alpha(i, value) {
		series[i].alpha = value;

		if ( legendRows)
			legendRows[i][0].parentNode.style.opacity = value;
	}

	function _setAlpha(i, value) {
		let s = series[i];

		_alpha(i, value);

		if (s.band) {
			// not super robust, will break if two bands are adjacent
			let ip = series[i+1].band ? i+1 : i-1;
			_alpha(ip, value);
		}
	}

	// y-distance
	const distsToCursor =  Array(series.length);

	let focused = null;

	function setFocus(i) {
		if (i != focused) {
		//	log("setFocus()", arguments);

			series.forEach((s, i2) => {
				_setAlpha(i2, i == null || i2 == 0 || i2 == i ? 1 : focus.alpha);
			});

			focused = i;
			paint();
		}
	}

	if (showLegend && cursorFocus) {
		on(mouseleave, legendEl, e => {
			if (cursor.locked)
				return;
			setSeries(null, {focus: false}, syncOpts.setSeries);
			updateCursor();
		});
	}

	function scaleValueAtPos(pos, scale) {
		let dim = scale == xScaleKey ? plotWidCss : plotHgtCss;
		let pct = clamp(pos / dim, 0, 1);

		let sc = scales[scale];
		let d = sc.max - sc.min;
		return sc.min + pct * d;
	}

	function closestIdxFromXpos(pos) {
		let v = scaleValueAtPos(pos, xScaleKey);
		return closestIdx(v, data[0], i0, i1);
	}

	self.posToIdx = closestIdxFromXpos;
	self.posToVal = (pos, scale) => scaleValueAtPos(scale == xScaleKey ? pos : plotHgtCss - pos, scale);
	self.valToPos = (val, scale, can) => (
		scale == xScaleKey ?
		getXPos(val, scales[scale],
			can ? plotWid : plotWidCss,
			can ? plotLft : 0,
		) :
		getYPos(val, scales[scale],
			can ? plotHgt : plotHgtCss,
			can ? plotTop : 0,
		)
	);

	let inBatch = false;
	let shouldPaint = false;
	let shouldSetScales = false;
	let shouldUpdateCursor = false;

	// defers calling expensive functions
	function batch(fn) {
		inBatch = true;
		fn(self);
		inBatch = false;
		shouldSetScales && setScales();
		 shouldUpdateCursor && updateCursor();
		shouldPaint && !didPaint && paint();
		shouldSetScales = shouldUpdateCursor = shouldPaint = didPaint = inBatch;
	}

	self.batch = batch;

	 (self.setCursor = opts => {
		mouseLeft1 = opts.left;
		mouseTop1 = opts.top;
	//	assign(cursor, opts);
		updateCursor();
	});

	let cursorRaf = 0;

	function updateCursor(ts) {
		if (inBatch) {
			shouldUpdateCursor = true;
			return;
		}

	//	ts == null && log("updateCursor()", arguments);

		cursorRaf = 0;

		if (cursor.show) {
			cursor.x && trans(vt,round(mouseLeft1),0);
			cursor.y && trans(hz,0,round(mouseTop1));
		}

		let idx;

		// if cursor hidden, hide points & clear legend vals
		if (mouseLeft1 < 0) {
			idx = null;

			for (let i = 0; i < series.length; i++) {
				if (i > 0) {
					distsToCursor[i] = inf;
					 cursorPts.length > 1 && trans(cursorPts[i], -10, -10);
				}

				if (showLegend) {
					if (i == 0 && multiValLegend)
						continue;

					for (let j = 0; j < legendRows[i].length; j++)
						legendRows[i][j][firstChild].nodeValue = '--';
				}
			}

			if (cursorFocus)
				setSeries(null, {focus: true}, syncOpts.setSeries);
		}
		else {
		//	let pctY = 1 - (y / rect[HEIGHT]);

			idx = closestIdxFromXpos(mouseLeft1);

			let scX = scales[xScaleKey];

			let xPos = round3(getXPos(data[0][idx], scX, plotWidCss, 0));

			for (let i = 0; i < series.length; i++) {
				let s = series[i];

				if (i > 0 && s.show) {
					let valAtIdx = data[i][idx];

					let yPos = valAtIdx == null ? -10 : round3(getYPos(valAtIdx, scales[s.scale], plotHgtCss, 0));

					distsToCursor[i] = yPos > 0 ? abs(yPos - mouseTop1) : inf;

					 cursorPts.length > 1 && trans(cursorPts[i], xPos, yPos);
				}
				else
					distsToCursor[i] = inf;

				if (showLegend) {
					if (i == 0 && multiValLegend)
						continue;

					let src = i == 0 && xScaleDistr == 2 ? data0 : data[i];

					let vals = multiValLegend ? s.values(self, i, idx) : {_: s.value(self, src[idx], i, idx)};

					let j = 0;

					for (let k in vals)
						legendRows[i][j++][firstChild].nodeValue = vals[k];
				}
			}

			// nit: cursor.drag.setSelect is assumed always true
			if (select.show && dragging) {
				// setSelect should not be triggered on move events
				if (drag.x) {
					let minX = min(mouseLeft0, mouseLeft1);
					let maxX = max(mouseLeft0, mouseLeft1);
					setStylePx(selectDiv, LEFT,  select[LEFT] = minX);
					setStylePx(selectDiv, WIDTH, select[WIDTH] = maxX - minX);
				}

				if (drag.y) {
					let minY = min(mouseTop0, mouseTop1);
					let maxY = max(mouseTop0, mouseTop1);
					setStylePx(selectDiv, TOP,    select[TOP] = minY);
					setStylePx(selectDiv, HEIGHT, select[HEIGHT] = maxY - minY);
				}
			}
		}

		// if ts is present, means we're implicitly syncing own cursor as a result of debounced rAF
		if (ts != null) {
			// this is not technically a "mousemove" event, since it's debounced, rename to setCursor?
			// since this is internal, we can tweak it later
			sync.pub(mousemove, self, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, idx);

			if (cursorFocus) {
				let minDist = min.apply(null, distsToCursor);

				let fi = null;

				if (minDist <= focus.prox) {
					distsToCursor.some((dist, i) => {
						if (dist == minDist)
							return fi = i;
					});
				}

				setSeries(fi, {focus: true}, syncOpts.setSeries);
			}
		}

		cursor.idx = idx;
		cursor.left = mouseLeft1;
		cursor.top = mouseTop1;

		ready && fire("setCursor");
	}

	let rect = null;

	function syncRect() {
		rect = over.getBoundingClientRect();
	}

	function mouseMove(e, src, _x, _y, _w, _h, _i) {
		if (cursor.locked)
			return;

		cacheMouse(e, src, _x, _y, _w, _h, _i, false, e != null);

		if (e != null) {
			if (cursorRaf == 0)
				cursorRaf = rAF(updateCursor);
		}
		else
			updateCursor();
	}

	function cacheMouse(e, src, _x, _y, _w, _h, _i, initial, snap) {
		if (e != null) {
			_x = e.clientX - rect.left;
			_y = e.clientY - rect.top;
		}
		else {
			_x = plotWidCss * (_x/_w);
			_y = plotHgtCss * (_y/_h);
		}

		if (snap) {
			if (_x <= 1 || _x >= plotWidCss - 1)
				_x = incrRound(_x, plotWidCss);

			if (_y <= 1 || _y >= plotHgtCss - 1)
				_y = incrRound(_y, plotHgtCss);
		}

		if (initial) {
			mouseLeft0 = _x;
			mouseTop0 = _y;
		}
		else {
			mouseLeft1 = _x;
			mouseTop1 = _y;
		}
	}

	function hideSelect() {
		setSelect({
			width:	!drag.x ? plotWidCss : 0,
			height:	!drag.y ? plotHgtCss : 0,
		}, false);
	}

	function mouseDown(e, src, _x, _y, _w, _h, _i) {
		if (e == null || filtMouse(e)) {
			dragging = true;

			cacheMouse(e, src, _x, _y, _w, _h, _i, true, true);

			if (select.show && (drag.x || drag.y))
				hideSelect();

			if (e != null) {
				on(mouseup, doc, mouseUp);
				sync.pub(mousedown, self, mouseLeft0, mouseTop0, plotWidCss, plotHgtCss, null);
			}
		}
	}

	function mouseUp(e, src, _x, _y, _w, _h, _i) {
		if ((e == null || filtMouse(e))) {
			dragging = false;

			cacheMouse(e, src, _x, _y, _w, _h, _i, false, true);

			if (mouseLeft1 != mouseLeft0 || mouseTop1 != mouseTop0) {
				setSelect(select);

				if (drag.setScale) {
					batch(() => {
						if (drag.x) {
							let fn = xScaleDistr == 2 ? closestIdxFromXpos : scaleValueAtPos;

							_setScale(xScaleKey,
								fn(select[LEFT], xScaleKey),
								fn(select[LEFT] + select[WIDTH], xScaleKey),
							);
						}

						if (drag.y) {
							for (let k in scales) {
								let sc = scales[k];

								if (k != xScaleKey && sc.from == null) {
									_setScale(k,
										scaleValueAtPos(plotHgtCss - select[TOP] - select[HEIGHT], k),
										scaleValueAtPos(plotHgtCss - select[TOP], k),
									);
								}
							}
						}
					});

					hideSelect();
				}
			}
			else if (cursor.lock) {
				cursor.locked = !cursor.locked;

				if (!cursor.locked)
					updateCursor();
			}

			if (e != null) {
				off(mouseup, doc, mouseUp);
				sync.pub(mouseup, self, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
			}
		}
	}

	function mouseLeave(e, src, _x, _y, _w, _h, _i) {
		if (!cursor.locked && !dragging) {
			mouseLeft1 = -10;
			mouseTop1 = -10;
			// passing a non-null timestamp to force sync/mousemove event
			updateCursor(1);
		}
	}

	function dblClick(e, src, _x, _y, _w, _h, _i) {
		autoScaleX();

		if (e != null)
			sync.pub(dblclick, self, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
	}

	// internal pub/sub
	const events = {};

	events[mousedown] = mouseDown;
	events[mousemove] = mouseMove;
	events[mouseup] = mouseUp;
	events[dblclick] = dblClick;
	events["setSeries"] = (e, src, idx, opts) => {
		setSeries(idx, opts);
	};

	let deb;

	if ( cursor.show) {
		on(mousedown, over, mouseDown);
		on(mousemove, over, mouseMove);
		on(mouseleave, over, mouseLeave);
		drag.setScale && on(dblclick, over, dblClick);

		deb = debounce(syncRect, 100);

		on(resize, win, deb);
		on(uPlot_esm_scroll, win, deb);

		self.syncRect = syncRect;
	}

	// external on/off
	const hooks = self.hooks = opts.hooks || {};

	const evArg0 = [self];

	function fire(evName) {
		if (evName in hooks) {
			let args2 = evArg0.concat(Array.prototype.slice.call(arguments, 1));

			hooks[evName].forEach(fn => {
				fn.apply(null, args2);
			});
		}
	}

	(opts.plugins || []).forEach(p => {
		for (let evName in p.hooks)
			hooks[evName] = (hooks[evName] || []).concat(p.hooks[evName]);
	});

	const syncOpts =  uPlot_esm_assign({
		key: null,
		setSeries: false,
	}, cursor.sync);

	const syncKey =  syncOpts.key;

	const sync =  (syncKey != null ? (syncs[syncKey] = syncs[syncKey] || _sync()) : _sync());

	 sync.sub(self);

	function pub(type, src, x, y, w, h, i) {
		events[type](null, src, x, y, w, h, i);
	}

	 (self.pub = pub);

	function destroy() {
		 sync.unsub(self);
		 off(resize, win, deb);
		 off(uPlot_esm_scroll, win, deb);
		root.remove();
		fire("destroy");
	}

	self.destroy = destroy;

	function _init() {
		_setSize(opts[WIDTH], opts[HEIGHT]);

		fire("init", opts, data);

		setData(data || opts.data, false);

		if (pendScales[xScaleKey])
			setScale(xScaleKey, pendScales[xScaleKey]);
		else
			autoScaleX();

		setSelect(select, false);

		ready = true;

		fire("ready");
	}

	if (then) {
		if (then instanceof HTMLElement) {
			then.appendChild(root);
			_init();
		}
		else
			then(self, _init);
	}
	else
		_init();

	return self;
}

uPlot.assign = uPlot_esm_assign;
uPlot.rangeNum = rangeNum;

{
	uPlot.fmtDate = fmtDate;
	uPlot.tzDate  = uPlot_esm_tzDate;
}

/* harmony default export */ var uPlot_esm = (uPlot);

// CONCATENATED MODULE: ./js/metrics_live/index.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var SeriesValue = function SeriesValue(options) {
  if (!options.unit) return {};
  return {
    value: function value(u, v) {
      return v === null ? '' : v.toFixed(3) + " ".concat(options.unit);
    }
  };
};

var XSeriesValue = function XSeriesValue(options) {
  return {
    value: '{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}'
  };
};

var YAxisValue = function YAxisValue(options) {
  if (!options.unit) return {};
  return {
    values: function values(u, vals, space) {
      return vals.map(function (v) {
        return +v.toFixed(2) + " ".concat(options.unit);
      });
    }
  };
};

var XAxis = function XAxis(_options) {
  return {
    space: 55,
    values: [[3600 * 24 * 365, "{YYYY}", 7, "{YYYY}"], [3600 * 24 * 28, "{MMM}", 7, "{MMM}\n{YYYY}"], [3600 * 24, "{MM}-{DD}", 7, "{MM}-{DD}\n{YYYY}"], [3600, "{HH}:{mm}", 4, "{HH}:{mm}\n{YYYY}-{MM}-{DD}"], [60, "{HH}:{mm}", 4, "{HH}:{mm}\n{YYYY}-{MM}-{DD}"], [1, "{ss}", 2, "{HH}:{mm}:{ss}\n{YYYY}-{MM}-{DD}"]]
  };
};

var YAxis = function YAxis(options) {
  return _objectSpread({
    show: true,
    size: 70,
    space: 15
  }, YAxisValue(options));
};

var metrics_live_newSeriesConfig = function newSeriesConfig(options) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return _objectSpread({}, LineColor.at(index), {}, SeriesValue(options), {
    label: options.label,
    spanGaps: true
  });
};
/** Telemetry Metrics **/
// Maps an ordered list of dataset objects into an ordered list of data points.

var dataForDatasets = function dataForDatasets(datasets) {
  return datasets.slice(0).map(function (_ref) {
    var data = _ref.data;
    return data;
  });
}; // Handler for an untagged CommonMetric


function nextValueForCallback(_ref2, callback) {
  var y = _ref2.y,
      z = _ref2.z;
  this.datasets[0].data.push(z);
  var currentValue = this.datasets[1].data[this.datasets[1].data.length - 1] || 0;
  var nextValue = callback.call(this, y, currentValue);
  this.datasets[1].data.push(nextValue);
} // Limits how often a funtion is invoked


function throttle(cb, limit) {
  var wait = false;
  return function () {
    if (!wait) {
      requestAnimationFrame(cb);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}

var findLastNonNullValue = function findLastNonNullValue(data) {
  return data.reduceRight(function (a, c) {
    return c != null && a == null ? c : a;
  }, null);
}; // Handler for a tagged CommonMetric


function nextTaggedValueForCallback(_ref3, callback) {
  var _this = this;

  var x = _ref3.x,
      y = _ref3.y,
      z = _ref3.z;
  // Find or create the series from the tag
  var seriesIndex = this.datasets.findIndex(function (_ref4) {
    var key = _ref4.key;
    return x === key;
  });

  if (seriesIndex === -1) {
    seriesIndex = this.datasets.push({
      key: x,
      data: Array(this.datasets[0].data.length).fill(null)
    }) - 1;
    this.chart.addSeries(metrics_live_newSeriesConfig({
      label: x,
      unit: this.options.unit
    }, seriesIndex - 1), seriesIndex);
  } // Add the new timestamp + value, keeping datasets aligned


  this.datasets = this.datasets.map(function (dataset, index) {
    if (index === 0) {
      dataset.data.push(z);
    } else if (index === seriesIndex) {
      dataset.data.push(callback.call(_this, y, findLastNonNullValue(dataset.data) || 0));
    } else {
      dataset.data.push(null);
    }

    return dataset;
  });
} // Handles the basic metrics like Counter, LastValue, and Sum.


var metrics_live_CommonMetric =
/*#__PURE__*/
function () {
  _createClass(CommonMetric, null, [{
    key: "__projections",
    value: function __projections() {
      return {
        counter: function counter(y, value) {
          return value + 1;
        },
        last_value: function last_value(y) {
          return y;
        },
        sum: function sum(y, value) {
          return value + y;
        }
      };
    }
  }, {
    key: "getConfig",
    value: function getConfig(options) {
      return {
        "class": options.kind,
        title: options.title,
        width: options.width,
        height: options.height,
        tzDate: function tzDate(ts) {
          return uPlot_esm.tzDate(new Date(ts * 1e3));
        },
        series: [_objectSpread({}, XSeriesValue()), metrics_live_newSeriesConfig(options, 0)],
        scales: {
          x: {
            min: options.now - 60,
            max: options.now
          },
          y: {
            min: 0,
            max: 1
          }
        },
        axes: [XAxis(), YAxis(options)]
      };
    }
  }, {
    key: "initialData",
    value: function initialData() {
      return [[], []];
    }
  }]);

  function CommonMetric(chart, options) {
    _classCallCheck(this, CommonMetric);

    this.__callback = this.constructor.__projections()[options.metric];
    this.chart = chart;
    this.datasets = [{
      key: "|x|",
      data: []
    }];
    this.options = options;

    if (options.tagged) {
      this.chart.delSeries(1);
      this.__handler = nextTaggedValueForCallback;
    } else {
      this.datasets.push({
        key: options.label,
        data: []
      });
      this.__handler = nextValueForCallback;
    }
  }

  _createClass(CommonMetric, [{
    key: "handleMeasurements",
    value: function handleMeasurements(measurements) {
      var _this2 = this;

      measurements.forEach(function (measurement) {
        return _this2.__handler.call(_this2, measurement, _this2.__callback);
      });
      this.chart.setData(dataForDatasets(this.datasets));
    }
  }]);

  return CommonMetric;
}(); // Displays a measurement summary


var metrics_live_Summary =
/*#__PURE__*/
function () {
  function Summary(chart, options) {
    _classCallCheck(this, Summary);

    // TODO: Get percentiles from options
    this.chart = chart;
    this.datasets = this.constructor.initialData();
    this.options = options;
    this.min = null;
    this.max = null;
    this.total = 0;
    this.count = 0;
  }

  _createClass(Summary, [{
    key: "handleMeasurements",
    value: function handleMeasurements(data) {
      var _this3 = this;

      data.forEach(function (_ref5) {
        var x = _ref5.x,
            y = _ref5.y,
            z = _ref5.z;
        // Increment the new totals
        _this3.count++;
        _this3.total += y; // Push the static values

        _this3.datasets[0].push(z);

        _this3.datasets[1].push(y); // Push min/max/avg


        if (_this3.min === null || y < _this3.min) {
          _this3.min = y;
        }

        _this3.datasets[2].push(_this3.min);

        if (_this3.max === null || y > _this3.max) {
          _this3.max = y;
        }

        _this3.datasets[3].push(_this3.max);

        _this3.datasets[4].push(_this3.total / _this3.count);
      });
      this.chart.setData(this.datasets);
    }
  }], [{
    key: "initialData",
    value: function initialData() {
      return [[], [], [], [], []];
    }
  }, {
    key: "getConfig",
    value: function getConfig(options) {
      return {
        "class": options.kind,
        title: options.title,
        width: options.width,
        height: options.height,
        tzDate: function tzDate(ts) {
          return uPlot_esm.tzDate(new Date(ts * 1e3));
        },
        series: [_objectSpread({}, XSeriesValue()), metrics_live_newSeriesConfig(options, 0), _objectSpread({
          label: "Min",
          fill: "rgba(0, 0, 0, .07)",
          band: true,
          width: 0,
          show: false
        }, SeriesValue(options)), _objectSpread({
          label: "Max",
          fill: "rgba(0, 0, 0, .07)",
          band: true,
          width: 0,
          show: false
        }, SeriesValue(options)), _objectSpread({
          label: "Avg",
          fill: "rgba(0, 0, 0, .07)",
          stroke: "red",
          dash: [10, 10]
        }, SeriesValue(options))],
        scales: {
          x: {
            min: options.now - 60,
            max: options.now
          },
          y: {
            min: 0,
            max: 1
          }
        },
        axes: [XAxis(), YAxis(options)]
      };
    }
  }]);

  return Summary;
}();

var __METRICS__ = {
  counter: metrics_live_CommonMetric,
  last_value: metrics_live_CommonMetric,
  sum: metrics_live_CommonMetric,
  summary: metrics_live_Summary
};
var metrics_live_TelemetryChart =
/*#__PURE__*/
function () {
  function TelemetryChart(chartEl, options) {
    _classCallCheck(this, TelemetryChart);

    if (!options.metric) {
      throw new TypeError("No metric type was provided");
    } else if (options.metric && !__METRICS__[options.metric]) {
      throw new TypeError("No metric defined for type ".concat(options.metric));
    }

    var metric = __METRICS__[options.metric];
    this.uplotChart = new uPlot_esm(metric.getConfig(options), metric.initialData(options), chartEl);
    this.metric = new metric(this.uplotChart, options);
  }

  _createClass(TelemetryChart, [{
    key: "resize",
    value: function resize(boundingBox) {
      this.uplotChart.setSize({
        width: Math.max(boundingBox.width, 100),
        height: 300
      });
    }
  }, {
    key: "pushData",
    value: function pushData(measurements) {
      if (!measurements.length) return;
      this.metric.handleMeasurements(measurements);
    }
  }]);

  return TelemetryChart;
}();
/** LiveView Hook **/

var PhxChartComponent = {
  mounted: function mounted() {
    var _this4 = this;

    var chartEl = this.el.parentElement.querySelector('.chart');
    var size = chartEl.getBoundingClientRect();
    var options = Object.assign({}, chartEl.dataset, {
      tagged: chartEl.dataset.tags && chartEl.dataset.tags !== "" || false,
      width: size.width,
      height: 300,
      now: new Date().getTime() / 1000
    });
    this.chart = new metrics_live_TelemetryChart(chartEl, options);
    window.addEventListener("resize", throttle(function () {
      size = chartEl.getBoundingClientRect();
      console.log("resizing", size);

      _this4.chart.resize(size);
    }));
  },
  updated: function updated() {
    var data = Array.from(this.el.children || []).map(function (_ref6) {
      var _ref6$dataset = _ref6.dataset,
          x = _ref6$dataset.x,
          y = _ref6$dataset.y,
          z = _ref6$dataset.z;
      return {
        x: x,
        y: parseFloat(y),
        z: parseInt(z)
      };
    });

    if (data.length > 0) {
      this.chart.pushData(data);
    }
  }
};
/* harmony default export */ var metrics_live = (PhxChartComponent);
// CONCATENATED MODULE: ./js/request_logger_cookie/index.js
/** LiveView Hook **/
var setCookie = function setCookie(params) {
  document.cookie = "".concat(params.key, "=").concat(params.value, ";samesite=strict;path=/");
};

var removeCookie = function removeCookie(params) {
  var pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = "".concat(params.key, "=; expires=").concat(pastDate);
};

var isCookieEnabled = function isCookieEnabled(hook) {
  return hook.el.getAttribute('data-cookie-enabled') === 'true';
};

var cookieParams = function cookieParams(hook) {
  return {
    key: hook.el.getAttribute('data-cookie-key'),
    value: hook.el.getAttribute('data-cookie-value')
  };
};

var PhxRequestLoggerCookie = {
  updated: function updated() {
    var loggerCookieParams = cookieParams(this);
    removeCookie(loggerCookieParams);

    if (isCookieEnabled(this)) {
      setCookie(loggerCookieParams);
    }
  }
};
/* harmony default export */ var request_logger_cookie = (PhxRequestLoggerCookie);
// CONCATENATED MODULE: ./js/request_logger_query_parameter/index.js
/** LiveView Hook **/
var copyToClipboard = function copyToClipboard(textarea) {
  if (!navigator.clipboard) {
    // Deprecated clipboard API
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand('copy');
  } else {
    // Modern Clipboard API
    var text = textarea.value;
    navigator.clipboard.writeText(text);
  }
};

var PhxRequestLoggerQueryParameter = {
  mounted: function mounted() {
    var _this = this;

    this.el.querySelector('.btn-primary').addEventListener('click', function (e) {
      var textarea = _this.el.querySelector('textarea');

      copyToClipboard(textarea);

      var copyIndicator = _this.el.querySelector('.copy-indicator');

      copyIndicator.setAttribute('data-enabled', 'false');
      void copyIndicator.offsetWidth; // Resets the animation to ensure it will be played again

      copyIndicator.setAttribute('data-enabled', 'true');
    });
  }
};
/* harmony default export */ var request_logger_query_parameter = (PhxRequestLoggerQueryParameter);
// CONCATENATED MODULE: ./js/request_logger_messages/index.js
/** LiveView Hook **/
var PhxRequestLoggerMessages = {
  updated: function updated() {
    if (this.el.querySelector('.logger-autoscroll-checkbox').checked) {
      var messagesElement = this.el.querySelector('#logger-messages');
      messagesElement.scrollTop = messagesElement.scrollHeight;
    }
  }
};
/* harmony default export */ var request_logger_messages = (PhxRequestLoggerMessages);
// CONCATENATED MODULE: ./js/app.js









var Hooks = {
  PhxChartComponent: metrics_live,
  PhxRequestLoggerCookie: request_logger_cookie,
  PhxRequestLoggerQueryParameter: request_logger_query_parameter,
  PhxRequestLoggerMessages: request_logger_messages
};
var socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live";
var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
var liveSocket = new phoenix_live_view["LiveSocket"](socketPath, phoenix["Socket"], {
  hooks: Hooks,
  params: {
    _csrf_token: csrfToken
  }
}); // Show progress bar on live navigation and form submits

window.addEventListener("phx:page-loading-start", function (info) {
  return nprogress_default.a.start();
});
window.addEventListener("phx:page-loading-stop", function (info) {
  return nprogress_default.a.done();
}); // connect if there are any LiveViews on the page

liveSocket.connect(); // expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)

window.liveSocket = liveSocket;

/***/ })
/******/ ]);