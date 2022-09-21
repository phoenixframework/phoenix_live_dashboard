(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/nprogress/nprogress.js
  var require_nprogress = __commonJS({
    "node_modules/nprogress/nprogress.js"(exports, module) {
      (function(root, factory) {
        if (typeof define === "function" && define.amd) {
          define(factory);
        } else if (typeof exports === "object") {
          module.exports = factory();
        } else {
          root.NProgress = factory();
        }
      })(exports, function() {
        var NProgress2 = {};
        NProgress2.version = "0.2.0";
        var Settings = NProgress2.settings = {
          minimum: 0.08,
          easing: "ease",
          positionUsing: "",
          speed: 200,
          trickle: true,
          trickleRate: 0.02,
          trickleSpeed: 800,
          showSpinner: true,
          barSelector: '[role="bar"]',
          spinnerSelector: '[role="spinner"]',
          parent: "body",
          template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        };
        NProgress2.configure = function(options) {
          var key, value;
          for (key in options) {
            value = options[key];
            if (value !== void 0 && options.hasOwnProperty(key))
              Settings[key] = value;
          }
          return this;
        };
        NProgress2.status = null;
        NProgress2.set = function(n) {
          var started = NProgress2.isStarted();
          n = clamp2(n, Settings.minimum, 1);
          NProgress2.status = n === 1 ? null : n;
          var progress = NProgress2.render(!started), bar = progress.querySelector(Settings.barSelector), speed = Settings.speed, ease = Settings.easing;
          progress.offsetWidth;
          queue(function(next) {
            if (Settings.positionUsing === "")
              Settings.positionUsing = NProgress2.getPositioningCSS();
            css(bar, barPositionCSS(n, speed, ease));
            if (n === 1) {
              css(progress, {
                transition: "none",
                opacity: 1
              });
              progress.offsetWidth;
              setTimeout(function() {
                css(progress, {
                  transition: "all " + speed + "ms linear",
                  opacity: 0
                });
                setTimeout(function() {
                  NProgress2.remove();
                  next();
                }, speed);
              }, speed);
            } else {
              setTimeout(next, speed);
            }
          });
          return this;
        };
        NProgress2.isStarted = function() {
          return typeof NProgress2.status === "number";
        };
        NProgress2.start = function() {
          if (!NProgress2.status)
            NProgress2.set(0);
          var work = function() {
            setTimeout(function() {
              if (!NProgress2.status)
                return;
              NProgress2.trickle();
              work();
            }, Settings.trickleSpeed);
          };
          if (Settings.trickle)
            work();
          return this;
        };
        NProgress2.done = function(force) {
          if (!force && !NProgress2.status)
            return this;
          return NProgress2.inc(0.3 + 0.5 * Math.random()).set(1);
        };
        NProgress2.inc = function(amount) {
          var n = NProgress2.status;
          if (!n) {
            return NProgress2.start();
          } else {
            if (typeof amount !== "number") {
              amount = (1 - n) * clamp2(Math.random() * n, 0.1, 0.95);
            }
            n = clamp2(n + amount, 0, 0.994);
            return NProgress2.set(n);
          }
        };
        NProgress2.trickle = function() {
          return NProgress2.inc(Math.random() * Settings.trickleRate);
        };
        (function() {
          var initial = 0, current = 0;
          NProgress2.promise = function($promise) {
            if (!$promise || $promise.state() === "resolved") {
              return this;
            }
            if (current === 0) {
              NProgress2.start();
            }
            initial++;
            current++;
            $promise.always(function() {
              current--;
              if (current === 0) {
                initial = 0;
                NProgress2.done();
              } else {
                NProgress2.set((initial - current) / initial);
              }
            });
            return this;
          };
        })();
        NProgress2.render = function(fromStart) {
          if (NProgress2.isRendered())
            return document.getElementById("nprogress");
          addClass2(document.documentElement, "nprogress-busy");
          var progress = document.createElement("div");
          progress.id = "nprogress";
          progress.innerHTML = Settings.template;
          var bar = progress.querySelector(Settings.barSelector), perc = fromStart ? "-100" : toBarPerc(NProgress2.status || 0), parent = document.querySelector(Settings.parent), spinner;
          css(bar, {
            transition: "all 0 linear",
            transform: "translate3d(" + perc + "%,0,0)"
          });
          if (!Settings.showSpinner) {
            spinner = progress.querySelector(Settings.spinnerSelector);
            spinner && removeElement(spinner);
          }
          if (parent != document.body) {
            addClass2(parent, "nprogress-custom-parent");
          }
          parent.appendChild(progress);
          return progress;
        };
        NProgress2.remove = function() {
          removeClass(document.documentElement, "nprogress-busy");
          removeClass(document.querySelector(Settings.parent), "nprogress-custom-parent");
          var progress = document.getElementById("nprogress");
          progress && removeElement(progress);
        };
        NProgress2.isRendered = function() {
          return !!document.getElementById("nprogress");
        };
        NProgress2.getPositioningCSS = function() {
          var bodyStyle = document.body.style;
          var vendorPrefix = "WebkitTransform" in bodyStyle ? "Webkit" : "MozTransform" in bodyStyle ? "Moz" : "msTransform" in bodyStyle ? "ms" : "OTransform" in bodyStyle ? "O" : "";
          if (vendorPrefix + "Perspective" in bodyStyle) {
            return "translate3d";
          } else if (vendorPrefix + "Transform" in bodyStyle) {
            return "translate";
          } else {
            return "margin";
          }
        };
        function clamp2(n, min2, max2) {
          if (n < min2)
            return min2;
          if (n > max2)
            return max2;
          return n;
        }
        function toBarPerc(n) {
          return (-1 + n) * 100;
        }
        function barPositionCSS(n, speed, ease) {
          var barCSS;
          if (Settings.positionUsing === "translate3d") {
            barCSS = { transform: "translate3d(" + toBarPerc(n) + "%,0,0)" };
          } else if (Settings.positionUsing === "translate") {
            barCSS = { transform: "translate(" + toBarPerc(n) + "%,0)" };
          } else {
            barCSS = { "margin-left": toBarPerc(n) + "%" };
          }
          barCSS.transition = "all " + speed + "ms " + ease;
          return barCSS;
        }
        var queue = function() {
          var pending = [];
          function next() {
            var fn = pending.shift();
            if (fn) {
              fn(next);
            }
          }
          return function(fn) {
            pending.push(fn);
            if (pending.length == 1)
              next();
          };
        }();
        var css = function() {
          var cssPrefixes = ["Webkit", "O", "Moz", "ms"], cssProps = {};
          function camelCase(string) {
            return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(match, letter) {
              return letter.toUpperCase();
            });
          }
          function getVendorProp(name) {
            var style = document.body.style;
            if (name in style)
              return name;
            var i = cssPrefixes.length, capName = name.charAt(0).toUpperCase() + name.slice(1), vendorName;
            while (i--) {
              vendorName = cssPrefixes[i] + capName;
              if (vendorName in style)
                return vendorName;
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
            var args = arguments, prop, value;
            if (args.length == 2) {
              for (prop in properties) {
                value = properties[prop];
                if (value !== void 0 && properties.hasOwnProperty(prop))
                  applyCss(element, prop, value);
              }
            } else {
              applyCss(element, args[1], args[2]);
            }
          };
        }();
        function hasClass(element, name) {
          var list = typeof element == "string" ? element : classList2(element);
          return list.indexOf(" " + name + " ") >= 0;
        }
        function addClass2(element, name) {
          var oldList = classList2(element), newList = oldList + name;
          if (hasClass(oldList, name))
            return;
          element.className = newList.substring(1);
        }
        function removeClass(element, name) {
          var oldList = classList2(element), newList;
          if (!hasClass(element, name))
            return;
          newList = oldList.replace(" " + name + " ", " ");
          element.className = newList.substring(1, newList.length - 1);
        }
        function classList2(element) {
          return (" " + (element.className || "") + " ").replace(/\s+/gi, " ");
        }
        function removeElement(element) {
          element && element.parentNode && element.parentNode.removeChild(element);
        }
        return NProgress2;
      });
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "hidden";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      form.submit();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h2) => h2.status === status).forEach((h2) => h2.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket2) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket2;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      }));
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      this.poll();
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      this.ajax("GET", null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    send(body) {
      this.ajax("POST", body, () => this.onerror("timeout"), (resp) => {
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), "application/json", body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    getLongPollTransport() {
      return LongPoll;
    }
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.sendBuffer = [];
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      this.connectClock++;
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.abnormalClose("heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      clearTimeout(this.heartbeatTimer);
      setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      clearTimeout(this.heartbeatTimer);
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    abnormalClose(reason) {
      this.closeWasClean = false;
      if (this.isConnected()) {
        this.conn.close(WS_CLOSE_NORMAL, reason);
      }
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          clearTimeout(this.heartbeatTimer);
          this.pendingHeartbeatRef = null;
          setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // js/app.js
  var import_nprogress = __toESM(require_nprogress());

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF = "data-phx-ref";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_PAGE_LOADING = "page-loading";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_DISCONNECTED_CLASS = "phx-loading";
  var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_FEEDBACK_FOR = "feedback-for";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_PROGRESS = "progress";
  var PHX_MOUNTED = "mounted";
  var LOADER_TIMEOUT = 1;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var DYNAMICS = "d";
  var STATIC = "s";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var EntryUploader = class {
    constructor(entry, chunkSize, liveSocket2) {
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunkSize;
      this.chunkTimer = null;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      clearTimeout(this.chunkTimer);
      this.uploadChannel.leave();
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      });
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          let hashEl = this.getHashTargetEl(window.location.hash);
          if (hashEl) {
            hashEl.scrollIntoView();
          } else if (meta.type === "redirect") {
            window.scroll(0, 0);
          }
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value) {
      document.cookie = `${name}=${value}`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    redirect(toURL, flash) {
      if (flash) {
        Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    findUploadInputs(node) {
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findParentCIDs(node, cids) {
      let initial = new Set(cids);
      let parentCids = cids.reduce((acc, cid) => {
        let selector = `[${PHX_COMPONENT}="${cid}"] [${PHX_COMPONENT}]`;
        this.filterWithinSameLiveView(this.all(node, selector), node).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => acc.delete(childCID));
        return acc;
      }, initial);
      return parentCids.size === 0 ? new Set(cids) : parentCids;
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce2 = el.getAttribute(phxDebounce);
      let throttle2 = el.getAttribute(phxThrottle);
      if (debounce2 === "") {
        debounce2 = defaultDebounce;
      }
      if (throttle2 === "") {
        throttle2 = defaultThrottle;
      }
      let value = debounce2 || throttle2;
      switch (value) {
        case null:
          return callback();
        case "blur":
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => callback());
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle2 ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle2) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              this.putPrivate(el, THROTTLED, true);
              setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => this.triggerCycle(el, DEBOUNCE_TRIGGER));
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    discardError(container, el, phxFeedbackFor) {
      let field = el.getAttribute && el.getAttribute(phxFeedbackFor);
      let input = field && container.querySelector(`[id="${field}"], [name="${field}"], [name="${field}[]"]`);
      if (!input) {
        return;
      }
      if (!(this.private(input, PHX_HAS_FOCUSED) || this.private(input.form, PHX_HAS_SUBMITTED))) {
        el.classList.add(PHX_NO_FEEDBACK_CLASS);
      }
    },
    showError(inputEl, phxFeedbackFor) {
      if (inputEl.id || inputEl.name) {
        this.all(inputEl.form, `[${phxFeedbackFor}="${inputEl.id}"], [${phxFeedbackFor}="${inputEl.name}"]`, (el) => {
          this.removeClass(el, PHX_NO_FEEDBACK_CLASS);
        });
      }
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let bubbles = opts.bubbles === void 0 ? true : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    mergeAttrs(target, source, opts = {}) {
      let exclude = opts.exclude || [];
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (exclude.indexOf(name) < 0) {
          target.setAttribute(name, source.getAttribute(name));
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (focused.readOnly) {
        focused.blur();
      }
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
    },
    syncPendingRef(fromEl, toEl, disableWith) {
      let ref = fromEl.getAttribute(PHX_REF);
      if (ref === null) {
        return true;
      }
      let refSrc = fromEl.getAttribute(PHX_REF_SRC);
      if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
        if (DOM.isUploadInput(fromEl)) {
          DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
        }
        DOM.putPrivate(fromEl, PHX_REF, toEl);
        return false;
      } else {
        PHX_EVENT_CLASSES.forEach((className) => {
          fromEl.classList.contains(className) && toEl.classList.add(className);
        });
        toEl.setAttribute(PHX_REF, ref);
        toEl.setAttribute(PHX_REF_SRC, refSrc);
        return true;
      }
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    constructor(fileEl, file, view) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    cancel() {
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      LiveUploader.clearFiles(this.fileEl);
    }
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        relative_path: this.file.webkitRelativePath,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.last_modified = file.lastModified;
        entry.name = file.name || entry.ref;
        entry.relative_path = file.webkitRelativePath;
        entry.type = file.type;
        entry.size = file.size;
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.putPrivate(inputEl, "files", this.activeFiles(inputEl).concat(newFiles));
        inputEl.value = null;
      } else {
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f));
    }
    constructor(inputEl, view, onComplete) {
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view));
      this.numEntriesInProgress = this._entries.length;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        entry.zipPostFlight(resp);
        entry.onDone(() => {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        });
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var ARIA = {
    focusMain() {
      let target = document.querySelector("main h1, main, h1");
      if (target) {
        let origTabIndex = target.tabIndex;
        target.tabIndex = -1;
        target.focus();
        target.tabIndex = origTabIndex;
      }
    },
    anyOf(instance, classes) {
      return classes.find((name) => instance instanceof name);
    },
    isFocusable(el, interactiveOnly) {
      return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement, HTMLButtonElement]) || el instanceof HTMLIFrameElement || (el.tabIndex > 0 || !interactiveOnly && el.tabIndex === 0 && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true");
    },
    attemptFocus(el, interactiveOnly) {
      if (this.isFocusable(el, interactiveOnly)) {
        try {
          el.focus();
        } catch (e) {
        }
      }
      return !!document.activeElement && document.activeElement.isSameNode(el);
    },
    focusFirstInteractive(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child, true) || this.focusFirstInteractive(child, true)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusFirst(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusFirst(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusLast(el) {
      let child = el.lastElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusLast(child)) {
          return true;
        }
        child = child.previousElementSibling;
      }
    }
  };
  var aria_default = ARIA;
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view.cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    },
    FocusWrap: {
      mounted() {
        this.focusStart = this.el.firstElementChild;
        this.focusEnd = this.el.lastElementChild;
        this.focusStart.addEventListener("focus", () => aria_default.focusLast(this.el));
        this.focusEnd.addEventListener("focus", () => aria_default.focusFirst(this.el));
        this.el.addEventListener("phx:show-end", () => this.el.focus());
        if (window.getComputedStyle(this.el).display !== "none") {
          aria_default.focusFirst(this.el);
        }
      }
    }
  };
  var hooks_default = Hooks;
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d2 = fromNodeAttrs.length - 1; d2 >= 0; d2--) {
      attr = fromNodeAttrs[d2];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild2 = fromEl.firstChild;
      if (firstChild2) {
        var oldValue = firstChild2.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild2.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    static patchEl(fromEl, toEl, activeElement) {
      morphdom_esm_default(fromEl, toEl, {
        childrenOnly: false,
        onBeforeElUpdated: (fromEl2, toEl2) => {
          if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
            dom_default.mergeFocusedInput(fromEl2, toEl2);
            return false;
          }
        }
      });
    }
    constructor(view, container, id, html, targetCID) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      dom_default.all(this.container, "[phx-update=append] > *, [phx-update=prepend] > *", (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform() {
      let { view, liveSocket: liveSocket2, container, html } = this;
      let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxFeedbackFor = liveSocket2.binding(PHX_FEEDBACK_FOR);
      let disableWith = liveSocket2.binding(PHX_DISABLE_WITH);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let phxRemove = liveSocket2.binding("remove");
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let pendingRemoves = [];
      let externalFormTriggered = null;
      let diffHTML = liveSocket2.time("premorph container prep", () => {
        return this.buildDiffHTML(container, html, phxUpdate, targetContainer);
      });
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        morphdom_esm_default(targetContainer, diffHTML, {
          childrenOnly: targetContainer.getAttribute(PHX_COMPONENT) === null,
          getNodeKey: (node) => {
            return dom_default.isPhxDestroyed(node) ? null : node.id;
          },
          onBeforeNodeAdded: (el) => {
            this.trackBefore("added", el);
            return el;
          },
          onNodeAdded: (el) => {
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            dom_default.discardError(targetContainer, el, phxFeedbackFor);
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => {
            if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
              liveSocket2.destroyViewByEl(el);
            }
            this.trackAfter("discarded", el);
          },
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentNode !== null && dom_default.isPhxUpdate(el.parentNode, phxUpdate, ["append", "prepend"]) && el.id) {
              return false;
            }
            if (el.getAttribute && el.getAttribute(phxRemove)) {
              pendingRemoves.push(el);
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
              if (dom_default.isUploadInput(fromEl)) {
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            dom_default.copyPrivates(toEl, fromEl);
            dom_default.discardError(targetContainer, toEl, phxFeedbackFor);
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            if (isFocusedFormEl) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return true;
            }
          }
        });
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves);
        liveSocket2.requestDOMUpdate(() => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
      if (externalFormTriggered) {
        liveSocket2.disconnect();
        externalFormTriggered.submit();
      }
      return true;
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.getAttribute(PHX_SKIP) !== null;
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    buildDiffHTML(container, html, phxUpdate, targetContainer) {
      let isCIDPatch = this.isCIDPatch();
      let isCIDWithSingleRoot = isCIDPatch && targetContainer.getAttribute(PHX_COMPONENT) === this.targetCID.toString();
      if (!isCIDPatch || isCIDWithSingleRoot) {
        return html;
      } else {
        let diffContainer = null;
        let template = document.createElement("template");
        diffContainer = dom_default.cloneNode(targetContainer);
        let [firstComponent, ...rest] = dom_default.findComponentNodeList(diffContainer, this.targetCID);
        template.innerHTML = html;
        rest.forEach((el) => el.remove());
        Array.from(diffContainer.childNodes).forEach((child) => {
          if (child.id && child.nodeType === Node.ELEMENT_NODE && child.getAttribute(PHX_COMPONENT) !== this.targetCID.toString()) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
        });
        Array.from(template.content.childNodes).forEach((el) => diffContainer.insertBefore(el, firstComponent));
        firstComponent.remove();
        return diffContainer.outerHTML;
      }
    }
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      return this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids);
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids };
      this.toOutputBuffer(rendered, null, output);
      return output.buffer;
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 ? cdiff : this.cloneMerge(oldc[cid] || {}, cdiff);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
    }
    cloneMerge(target, source) {
      let merged = { ...target, ...source };
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val);
        }
      }
      return merged;
    }
    componentToString(cid) {
      return this.recursiveCIDToString(this.rendered[COMPONENTS], cid);
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    toOutputBuffer(rendered, templates, output) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output);
        output.buffer += statics[i];
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d2 = 0; d2 < dynamics.length; d2++) {
        let dynamic = dynamics[d2];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output);
          output.buffer += statics[i];
        }
      }
    }
    dynamicToBuffer(rendered, templates, output) {
      if (typeof rendered === "number") {
        output.buffer += this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output);
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let template = document.createElement("template");
      template.innerHTML = this.recursiveToString(component, components, onlyCids);
      let container = template.content;
      let skip = onlyCids && !onlyCids.has(cid);
      let [hasChildNodes, hasChildComponents] = Array.from(container.childNodes).reduce(([hasNodes, hasComponents], child, i) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.getAttribute(PHX_COMPONENT)) {
            return [hasNodes, true];
          }
          child.setAttribute(PHX_COMPONENT, cid);
          if (!child.id) {
            child.id = `${this.parentViewId()}-${cid}-${i}`;
          }
          if (skip) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
          return [true, hasComponents];
        } else {
          if (child.nodeValue.trim() !== "") {
            logError(`only HTML element tags are allowed at the root of components.

got: "${child.nodeValue.trim()}"

within:
`, template.innerHTML.trim());
            child.replaceWith(this.createSpan(child.nodeValue, cid));
            return [true, hasComponents];
          } else {
            child.remove();
            return [hasNodes, hasComponents];
          }
        }
      }, [false, false]);
      if (!hasChildNodes && !hasChildComponents) {
        logError("expected at least one HTML element tag inside a component, but the component is empty:\n", template.innerHTML.trim());
        return this.createSpan("", cid).outerHTML;
      } else if (!hasChildNodes && hasChildComponents) {
        logError("expected at least one HTML element tag directly inside a component, but only subcomponents were found. A component must render at least one HTML tag directly inside itself.", template.innerHTML.trim());
        return template.innerHTML;
      } else {
        return template.innerHTML;
      }
    }
    createSpan(text, cid) {
      let span = document.createElement("span");
      span.innerText = text;
      span.setAttribute(PHX_COMPONENT, cid);
      return span;
    }
  };
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return el.phxHookId;
    }
    constructor(view, el, callbacks) {
      this.__view = view;
      this.liveSocket = view.liveSocket;
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      this.el = el;
      this.el.phxHookId = this.constructor.makeID();
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    pushEvent(event, payload = {}, onReply = function() {
    }) {
      return this.__view.pushHookEvent(null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply = function() {
    }) {
      return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view.dispatchUploads(name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view.withinTargets(phxTarget, (view) => view.dispatchUploads(name, files));
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var focusStack = null;
  var JS = {
    exec(eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, {}];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind && defaultArgs.data) {
          args.data = Object.assign(args.data || {}, defaultArgs.data);
        }
        this.filterToEls(sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    exec_dispatch(eventType, phxEvent, view, sourceEl, el, { to, event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(eventType, phxEvent, view, sourceEl, el, args) {
      if (!view.isConnected()) {
        return;
      }
      let { event, data, target, page_loading, loading, value, dispatcher } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      view.withinTargets(phxTarget, (targetView, targetCtx) => {
        if (eventType === "change") {
          let { newCid, _target, callback } = args;
          _target = _target || (sourceEl instanceof HTMLInputElement ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, pushOpts);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts);
        }
      });
    },
    exec_navigate(eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.historyRedirect(href, replace ? "replace" : "push");
    },
    exec_patch(eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.pushHistoryPatch(href, replace ? "replace" : "push", sourceEl);
    },
    exec_focus(eventType, phxEvent, view, sourceEl, el) {
      window.requestAnimationFrame(() => aria_default.attemptFocus(el));
    },
    exec_focus_first(eventType, phxEvent, view, sourceEl, el) {
      window.requestAnimationFrame(() => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el));
    },
    exec_push_focus(eventType, phxEvent, view, sourceEl, el) {
      window.requestAnimationFrame(() => focusStack = el || sourceEl);
    },
    exec_pop_focus(eventType, phxEvent, view, sourceEl, el) {
      window.requestAnimationFrame(() => {
        if (focusStack) {
          focusStack.focus();
        }
        focusStack = null;
      });
    },
    exec_add_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view);
    },
    exec_remove_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view);
    },
    exec_transition(eventType, phxEvent, view, sourceEl, el, { time, transition }) {
      let [transition_start, running, transition_end] = transition;
      let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(running), []);
      let onDone = () => this.addOrRemoveClasses(el, transition_end, transition_start.concat(running));
      view.transition(time, onStart, onDone);
    },
    exec_toggle(eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time }) {
      this.toggle(eventType, view, el, display, ins, outs, time);
    },
    exec_show(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.show(eventType, view, el, display, transition, time);
    },
    exec_hide(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.hide(eventType, view, el, display, transition, time);
    },
    exec_set_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    show(eventType, view, el, display, transition, time) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time);
      }
    },
    hide(eventType, view, el, display, transition, time) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time) {
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:show-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view) {
      let [transition_run, transition_start, transition_end] = transition || [[], [], []];
      if (transition_run.length > 0) {
        let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(transition_run), []);
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transition_end), removes.concat(transition_run).concat(transition_start));
        return view.transition(time, onStart, onDone);
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(sourceEl, { to }) {
      return to ? dom_default.all(document, to) : [sourceEl];
    }
  };
  var js_default = JS;
  var serializeForm = (form, meta, onlyNames = []) => {
    let formData = new FormData(form);
    let toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    let params = new URLSearchParams();
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        params.append(key, val);
      }
    }
    for (let metaKey in meta) {
      params.append(metaKey, meta[metaKey]);
    }
    return params.toString();
  };
  var View = class {
    constructor(el, liveSocket2, parentView, flash, liveReferer) {
      this.isDead = false;
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      this.id = this.el.id;
      this.ref = 0;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.pendingDiffs = [];
      this.pruningCIDs = [];
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.uploaders = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        return {
          redirect: this.redirect ? this.href : void 0,
          url: this.redirect ? void 0 : this.href || void 0,
          params: this.connectParams(liveReferer),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.getAttribute(PHX_MAIN) !== null;
    }
    connectParams(liveReferer) {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      params["_live_referer"] = liveReferer;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_DISCONNECTED_CLASS);
      }
    }
    execAll(binding) {
      dom_default.all(this.el, `[${binding}]`, (el) => this.liveSocket.execJS(el, el.getAttribute(binding)));
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
      this.execAll(this.binding("connected"));
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    withinTargets(phxTarget, callback) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(document.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      if (title) {
        dom_default.putTitle(title);
      }
      callback({ diff, reply, events });
    }
    onJoin(resp) {
      let { rendered, container } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let html = this.renderContainer(null, "join");
        this.dropPendingRefs();
        let forms = this.formsForRecovery(html);
        this.joinCount++;
        if (forms.length > 0) {
          forms.forEach(([form, newForm, newCid], i) => {
            this.pushFormRecovery(form, newCid, (resp2) => {
              if (i === forms.length - 1) {
                this.onJoinComplete(resp2, html, events);
              }
            });
          });
        } else {
          this.onJoinComplete(resp, html, events);
        }
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}]`, (el) => {
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
      });
    }
    onJoinComplete({ live_patch }, html, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    execNewMounted() {
      dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        this.maybeAddNewHook(hookEl);
      });
      dom_default.all(this.el, `[${this.binding(PHX_MOUNTED)}]`, (el) => this.maybeMounted(el));
    }
    applyJoinPatch(live_patch, html, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false);
      this.joinNewChildren();
      this.execNewMounted();
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    maybeMounted(el) {
      let phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
      let hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
      if (phxMounted && !hasBeenInvoked) {
        this.liveSocket.execJS(el, phxMounted);
        dom_default.putPrivate(el, "mounted", true);
      }
    }
    maybeAddNewHook(el, force) {
      let newHook = this.addHook(el);
      if (newHook) {
        newHook.__mounted();
      }
    }
    performPatch(patch, pruneCids) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        this.maybeAddNewHook(el);
        if (el.getAttribute) {
          this.maybeMounted(el);
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform();
      this.afterElementsRemoved(removedEls, pruneCids);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      if (el.id === this.id) {
        return this;
      } else {
        return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let html = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff).concat(this.pruningCIDs) : null;
        let html = this.rendered.toString(cids);
        return `<${tag}>${html}</${tag}>`;
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let html = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      if (ViewHook.elementID(el) || !el.getAttribute) {
        return;
      }
      let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
      if (hookName && !this.ownsElement(el)) {
        return;
      }
      let callbacks = this.liveSocket.getHookCallbacks(hookName);
      if (callbacks) {
        if (!el.id) {
          logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
        }
        let hook = new ViewHook(this, el, callbacks);
        this.viewHooks[ViewHook.elementID(hook.el)] = hook;
        return hook;
      } else if (hookName !== null) {
        logError(`unknown hook found for "${hookName}"`, el);
      }
    }
    destroyHook(hook) {
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[ViewHook.elementID(hook.el)];
    }
    applyPendingUpdates() {
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      for (let id in this.root.children[this.id]) {
        this.getChildById(id).destroy();
      }
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      this.liveSocket.historyRedirect(url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash }) {
      this.liveSocket.redirect(to, flash);
    }
    isDestroyed() {
      return this.destroyed;
    }
    joinDead() {
      this.isDead = true;
    }
    join(callback) {
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.liveSocket.wrapPush(this, { timeout: false }, () => {
        return this.channel.join().receive("ok", (data) => {
          if (!this.isDestroyed()) {
            this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
          }
        }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
      });
    }
    onJoinError(resp) {
      if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        return this.onRedirect({ to: this.href });
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.liveSocket.isConnected()) {
        this.liveSocket.reloadWithJitter(this);
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        this.displayError();
      }
    }
    displayError() {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
      this.execAll(this.binding("disconnected"));
    }
    pushWithReply(refGenerator, event, payload, onReply = function() {
    }) {
      if (!this.isConnected()) {
        return;
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let onLoadingDone = function() {
      };
      if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return this.liveSocket.wrapPush(this, { timeout: true }, () => {
        return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
          let finish = (hookReply) => {
            if (resp.redirect) {
              this.onRedirect(resp.redirect);
            }
            if (resp.live_patch) {
              this.onLivePatch(resp.live_patch);
            }
            if (resp.live_redirect) {
              this.onLiveRedirect(resp.live_redirect);
            }
            if (ref !== null) {
              this.undoRefs(ref);
            }
            onLoadingDone();
            onReply(resp, hookReply);
          };
          if (resp.diff) {
            this.liveSocket.requestDOMUpdate(() => {
              this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
                this.update(diff, events);
                finish(reply);
              });
            });
          } else {
            finish(null);
          }
        });
      });
    }
    undoRefs(ref) {
      if (!this.isConnected()) {
        return;
      }
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}="${ref}"]`, (el) => {
        let disabledVal = el.getAttribute(PHX_DISABLED);
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
        if (el.getAttribute(PHX_READONLY) !== null) {
          el.readOnly = false;
          el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          el.disabled = disabledVal === "true" ? true : false;
          el.removeAttribute(PHX_DISABLED);
        }
        PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
        let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          el.innerText = disableRestore;
          el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let toEl = dom_default.private(el, PHX_REF);
        if (toEl) {
          let hook = this.triggerBeforeUpdateHook(el, toEl);
          DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
          if (hook) {
            hook.__updated();
          }
          dom_default.deletePrivate(el, PHX_REF);
        }
      });
    }
    putRef(elements, event, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        elements = elements.concat(dom_default.all(document, opts.loading));
      }
      elements.forEach((el) => {
        el.classList.add(`phx-${event}-loading`);
        el.setAttribute(PHX_REF, newRef);
        el.setAttribute(PHX_REF_SRC, this.el.id);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute("disabled", "");
        }
      });
      return [newRef, elements, opts];
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([], "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }, (resp, reply) => onReply(reply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}) {
      this.pushWithReply(() => this.putRef([el], type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      });
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }, onReply);
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx);
      let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
      let formData;
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, { _target: opts._target }, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, { _target: opts._target });
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event, (resp) => {
        dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR));
        if (dom_default.isUploadInput(inputEl) && inputEl.getAttribute("data-phx-auto-upload") !== null) {
          if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
            let [ref, _els] = refGenerator();
            this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
              callback && callback(resp);
              this.triggerAwaitingSubmit(inputEl.form);
            });
          }
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref);
          return false;
        } else {
          return true;
        }
      });
    }
    disableForm(formEl, opts = {}) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let formElements = Array.from(formEl.elements);
      let disables = formElements.filter(filterDisables);
      let buttons = formElements.filter(filterButton).filter(filterIgnored);
      let inputs = formElements.filter(filterInput).filter(filterIgnored);
      buttons.forEach((button) => {
        button.setAttribute(PHX_DISABLED, button.disabled);
        button.disabled = true;
      });
      inputs.forEach((input) => {
        input.setAttribute(PHX_READONLY, input.readOnly);
        input.readOnly = true;
        if (input.files) {
          input.setAttribute(PHX_DISABLED, input.disabled);
          input.disabled = true;
        }
      });
      formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
      return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply) {
      let refGenerator = () => this.disableForm(formEl, opts);
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, targetCtx, ref, cid, (_uploads) => {
          let formData = serializeForm(formEl, {});
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            cid
          }, onReply);
        });
      } else {
        let formData = serializeForm(formEl, {});
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      }
    }
    uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        this.uploaders[inputEl] = uploader;
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload, (resp) => {
          this.log("upload", () => ["got preflight response", resp]);
          if (resp.error) {
            this.undoRefs(ref);
            let [entry_ref, reason] = resp.error;
            this.log("upload", () => [`error for entry ${entry_ref}`, reason]);
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    dispatchUploads(name, filesOrBlobs) {
      let inputs = dom_default.findUploadInputs(this.el).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    pushFormRecovery(form, newCid, callback) {
      this.liveSocket.withinOwners(form, (view, targetCtx) => {
        let input = form.elements[0];
        let phxEvent = form.getAttribute(this.binding(PHX_AUTO_RECOVER)) || form.getAttribute(this.binding("change"));
        js_default.exec("change", phxEvent, view, input, ["push", { _target: input.name, newCid, callback }]);
      });
    }
    pushLinkPatch(href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let push = this.pushWithReply(refGen, "live_patch", { url: href }, (resp) => {
        this.liveSocket.requestDOMUpdate(() => {
          if (resp.link_redirect) {
            this.liveSocket.replaceMain(href, null, callback, linkRef);
          } else {
            if (this.liveSocket.commitPendingLink(linkRef)) {
              this.href = href;
            }
            this.applyPendingUpdates();
            callback && callback(linkRef);
          }
        });
      });
      if (push) {
        push.receive("timeout", fallback);
      } else {
        fallback();
      }
    }
    formsForRecovery(html) {
      if (this.joinCount === 0) {
        return [];
      }
      let phxChange = this.binding("change");
      let template = document.createElement("template");
      template.innerHTML = html;
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id && this.ownsElement(form)).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        let newForm = template.content.querySelector(`form[id="${form.id}"][${phxChange}="${form.getAttribute(phxChange)}"]`);
        if (newForm) {
          return [form, newForm, this.targetComponentID(newForm)];
        } else {
          return [form, null, null];
        }
      }).filter(([form, newForm, newCid]) => newForm);
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        this.pruningCIDs.push(...willDestroyCIDs);
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
          this.pruningCIDs = this.pruningCIDs.filter((cid) => willDestroyCIDs.indexOf(cid) !== -1);
          let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
            return dom_default.findComponentNodeList(this.el, cid).length === 0;
          });
          if (completelyDestroyCIDs.length > 0) {
            this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
              this.rendered.pruneCIDs(resp.cids);
            });
          }
        });
      }
    }
    ownsElement(el) {
      return this.isDead || el.getAttribute(PHX_PARENT_ID) === this.id || maybe(el.closest(PHX_VIEW_SELECTOR), (node) => node.id) === this.id;
    }
    submitForm(form, targetCtx, phxEvent, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      let phxFeedback = this.liveSocket.binding(PHX_FEEDBACK_FOR);
      let inputs = Array.from(form.elements);
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, opts, () => {
        inputs.forEach((input) => dom_default.showError(input, phxFeedback));
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.domCallbacks = Object.assign({ onNodeAdded: closure2(), onBeforeElUpdated: closure2() }, opts.dom || {});
      this.transitions = new TransitionSet();
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        } else {
          this.joinDeadView();
        }
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          setTimeout(() => cb(data), latency);
        }
      });
    }
    wrapPush(view, opts, push) {
      let latency = this.getLatencySim();
      let oldJoinCount = view.joinCount;
      if (!latency) {
        if (this.isConnected() && opts.timeout) {
          return push().receive("timeout", () => {
            if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
              this.reloadWithJitter(view, () => {
                this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          });
        } else {
          return push();
        }
      }
      let fakePush = {
        receives: [],
        receive(kind, cb) {
          this.receives.push([kind, cb]);
        }
      };
      setTimeout(() => {
        if (view.isDestroyed()) {
          return;
        }
        fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
      }, latency);
      return fakePush;
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries > this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries > this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinDeadView() {
      this.bindTopLevelEvents({ dead: true });
      let view = this.newRootView(document.body);
      view.setHref(this.getHref());
      view.joinDead();
      this.main = view;
      window.requestAnimationFrame(() => view.execNewMounted());
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          view.setHref(this.getHref());
          view.join();
          if (rootEl.getAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash) {
      this.disconnect();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      let liveReferer = this.currentLocation.href;
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      let newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash, liveReferer);
      this.main.setRedirect(href);
      this.transitionRemoves();
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            dom_default.findPhxSticky(document).forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && requestAnimationFrame(callback);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements) {
      let removeAttr = this.binding("remove");
      elements = elements || dom_default.all(document, `[${removeAttr}]`);
      elements.forEach((el) => {
        if (document.body.contains(el)) {
          this.execJS(el, el.getAttribute(removeAttr), "remove");
        }
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash, liveReferer) {
      let view = new View(el, this, null, flash, liveReferer);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      if (view) {
        callback(view);
      }
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    setActiveElement(target) {
      if (this.activeElement === target) {
        return;
      }
      this.activeElement = target;
      let cancel = () => {
        if (target === this.activeElement) {
          this.activeElement = null;
        }
        target.removeEventListener("mouseup", this);
        target.removeEventListener("touchend", this);
      };
      target.addEventListener("mouseup", cancel);
      target.addEventListener("touchend", cancel);
    }
    getActiveElement() {
      if (document.activeElement === document.body) {
        return this.activeElement || document.activeElement;
      } else {
        return document.activeElement || document.body;
      }
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents({ dead } = {}) {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      if (!dead) {
        this.bindNav();
      }
      this.bindClicks();
      if (!dead) {
        this.bindForms();
      }
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = { key: e.key, ...this.eventMeta(type, e, targetEl) };
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        if (!eventTarget) {
          let data = { key: e.key, ...this.eventMeta(type, e, targetEl) };
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, targetCtx, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      window.addEventListener("dragover", (e) => e.preventDefault());
      window.addEventListener("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      return this.linkRef;
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      window.addEventListener("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click", false);
      this.bindClick("mousedown", "capture-click", true);
    }
    bindClick(eventName, bindingName, capture) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (capture) {
          target = e.target.matches(`[${click}]`) ? e.target : e.target.querySelector(`[${click}]`);
        } else {
          let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
          target = closestPhxBinding(clickStartedAtTarget, click);
          this.dispatchClickAway(e, clickStartedAtTarget);
          this.clickStartedAtTarget = null;
        }
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, capture);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(e.target, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el)) {
              js_default.exec("click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, id, root, scroll: scroll2 } = event.state || {};
        let href = window.location.href;
        this.requestDOMUpdate(() => {
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(href, null);
          } else {
            this.replaceMain(href, null, () => {
              if (root) {
                this.replaceRootHistory();
              }
              if (typeof scroll2 === "number") {
                setTimeout(() => {
                  window.scrollTo(0, scroll2);
                }, 0);
              }
            });
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        let wantsNewTab = e.metaKey || e.ctrlKey || e.button === 1;
        if (!type || !this.isConnected() || !this.main || wantsNewTab) {
          return;
        }
        let href = target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(href, linkState);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
          let phxClick = target.getAttribute(this.binding("click"));
          if (phxClick) {
            this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
          }
        });
      }, false);
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(href, linkState, targetEl) {
      if (!this.isConnected()) {
        return browser_default.redirect(href);
      }
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
      this.registerNewLocation(window.location);
    }
    historyRedirect(href, linkState, flash) {
      if (!this.isConnected()) {
        return browser_default.redirect(href, flash);
      }
      if (/^\/[^\/]+.*$/.test(href)) {
        let { protocol, host } = window.location;
        href = `${protocol}//${host}${href}`;
      }
      let scroll2 = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, () => {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll: scroll2 }, href);
          this.registerNewLocation(window.location);
          done();
        });
      });
    }
    replaceRootHistory() {
      browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      let externalFormSubmitted = false;
      this.on("submit", (e) => {
        let phxSubmit = e.target.getAttribute(this.binding("submit"));
        let phxChange = e.target.getAttribute(this.binding("change"));
        if (!externalFormSubmitted && phxChange && !phxSubmit) {
          externalFormSubmitted = true;
          e.preventDefault();
          this.withinOwners(e.target, (view) => {
            view.disableForm(e.target);
            window.requestAnimationFrame(() => e.target.submit());
          });
        }
      }, true);
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec("submit", phxEvent, view, e.target, ["push", {}]);
        });
      }, false);
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          let phxChange = this.binding("change");
          let input = e.target;
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type !== lastType) {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              if (!dom_default.isTextualInput(input)) {
                this.setActiveElement(input);
              }
              js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        }, false);
      }
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
      this.reset();
    }
    reset() {
      this.transitions.forEach((timer) => {
        clearTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        if (this.size() === 0) {
          this.flushPendingOps();
        }
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      this.pendingOps.forEach((op) => op());
      this.pendingOps = [];
    }
  };

  // js/metrics_live/color_wheel.js
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
    at: (i) => {
      const [r, g, b] = ColorWheel.rgb(i);
      return `rgb(${r}, ${g}, ${b})`;
    },
    rgb: (i) => COLORS[COLOR_NAMES[i % COLOR_NAMES.length]]
  };
  var LineColor = {
    at: (i) => {
      const [r, g, b] = ColorWheel.rgb(i);
      return {
        stroke: `rgb(${r}, ${g}, ${b})`,
        fill: `rgb(${r}, ${g}, ${b}, 0.1)`
      };
    }
  };

  // node_modules/uplot/dist/uPlot.esm.js
  function debounce(fn, time) {
    let pending = null;
    function run() {
      pending = null;
      fn();
    }
    return function() {
      clearTimeout(pending);
      pending = setTimeout(run, time);
    };
  }
  function closestIdx(num, arr, lo, hi) {
    let mid;
    lo = lo || 0;
    hi = hi || arr.length - 1;
    let bitwise = hi <= 2147483647;
    while (hi - lo > 1) {
      mid = bitwise ? lo + hi >> 1 : floor((lo + hi) / 2);
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
  function rangeNum(min2, max2, mult, extra) {
    const delta = max2 - min2;
    const mag = log10(delta || abs(max2) || 1);
    const exp = floor(mag);
    const incr = pow(10, exp) * mult;
    const buf = delta == 0 ? incr : 0;
    let snappedMin = round6(incrRoundDn(min2 - buf, incr));
    let snappedMax = round6(incrRoundUp(max2 + buf, incr));
    if (extra) {
      if (delta == 0) {
        if (max2 > 0) {
          snappedMin = 0;
          snappedMax = max2 * 2;
        } else if (max2 < 0) {
          snappedMax = 0;
          snappedMin = min2 * 2;
        }
      } else {
        if (snappedMax - max2 < incr)
          snappedMax += incr;
        if (min2 - snappedMin < incr)
          snappedMin -= incr;
        if (min2 >= 0 && snappedMin < 0)
          snappedMin = 0;
        if (max2 <= 0 && snappedMax > 0)
          snappedMax = 0;
      }
    }
    return [snappedMin, snappedMax];
  }
  var M = Math;
  var abs = M.abs;
  var floor = M.floor;
  var round = M.round;
  var ceil = M.ceil;
  var min = M.min;
  var max = M.max;
  var pow = M.pow;
  var log10 = M.log10;
  var PI = M.PI;
  var inf = Infinity;
  function incrRound(num, incr) {
    return round(num / incr) * incr;
  }
  function clamp(num, _min, _max) {
    return min(max(num, _min), _max);
  }
  function fnOrSelf(v) {
    return typeof v == "function" ? v : () => v;
  }
  function incrRoundUp(num, incr) {
    return ceil(num / incr) * incr;
  }
  function incrRoundDn(num, incr) {
    return floor(num / incr) * incr;
  }
  function round3(val) {
    return round(val * 1e3) / 1e3;
  }
  function round6(val) {
    return round(val * 1e6) / 1e6;
  }
  var isArr = Array.isArray;
  function isStr(v) {
    return typeof v === "string";
  }
  function isObj(v) {
    return typeof v === "object" && v !== null;
  }
  function copy(o) {
    let out;
    if (isArr(o))
      out = o.map(copy);
    else if (isObj(o)) {
      out = {};
      for (var k in o)
        out[k] = copy(o[k]);
    } else
      out = o;
    return out;
  }
  function assign(targ) {
    let args = arguments;
    for (let i = 1; i < args.length; i++) {
      let src = args[i];
      for (let key in src) {
        if (isObj(targ[key]))
          assign(targ[key], copy(src[key]));
        else
          targ[key] = copy(src[key]);
      }
    }
    return targ;
  }
  var WIDTH = "width";
  var HEIGHT = "height";
  var TOP = "top";
  var BOTTOM = "bottom";
  var LEFT = "left";
  var RIGHT = "right";
  var firstChild = "firstChild";
  var createElement = "createElement";
  var hexBlack = "#000";
  var classList = "classList";
  var mousemove = "mousemove";
  var mousedown = "mousedown";
  var mouseup = "mouseup";
  var mouseenter = "mouseenter";
  var mouseleave = "mouseleave";
  var dblclick = "dblclick";
  var resize = "resize";
  var scroll = "scroll";
  var rAF = requestAnimationFrame;
  var doc2 = document;
  var win = window;
  var pxRatio = devicePixelRatio;
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
    let el = doc2[createElement](tag);
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
  var evOpts = { passive: true };
  function on(ev, el, cb) {
    el.addEventListener(ev, cb, evOpts);
  }
  function off(ev, el, cb) {
    el.removeEventListener(ev, cb, evOpts);
  }
  var months = [
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
    "December"
  ];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  function slice3(str) {
    return str.slice(0, 3);
  }
  var days3 = days.map(slice3);
  var months3 = months.map(slice3);
  var engNames = {
    MMMM: months,
    MMM: months3,
    WWWW: days,
    WWW: days3
  };
  function zeroPad2(int) {
    return (int < 10 ? "0" : "") + int;
  }
  function zeroPad3(int) {
    return (int < 10 ? "00" : int < 100 ? "0" : "") + int;
  }
  var getFullYear = "getFullYear";
  var getMonth = "getMonth";
  var getDate = "getDate";
  var getDay = "getDay";
  var getHours = "getHours";
  var getMinutes = "getMinutes";
  var getSeconds = "getSeconds";
  var getMilliseconds = "getMilliseconds";
  var subs = {
    YYYY: (d2) => d2[getFullYear](),
    YY: (d2) => (d2[getFullYear]() + "").slice(2),
    MMMM: (d2, names) => names.MMMM[d2[getMonth]()],
    MMM: (d2, names) => names.MMM[d2[getMonth]()],
    MM: (d2) => zeroPad2(d2[getMonth]() + 1),
    M: (d2) => d2[getMonth]() + 1,
    DD: (d2) => zeroPad2(d2[getDate]()),
    D: (d2) => d2[getDate](),
    WWWW: (d2, names) => names.WWWW[d2[getDay]()],
    WWW: (d2, names) => names.WWW[d2[getDay]()],
    HH: (d2) => zeroPad2(d2[getHours]()),
    H: (d2) => d2[getHours](),
    h: (d2) => {
      let h2 = d2[getHours]();
      return h2 == 0 ? 12 : h2 > 12 ? h2 - 12 : h2;
    },
    AA: (d2) => d2[getHours]() >= 12 ? "PM" : "AM",
    aa: (d2) => d2[getHours]() >= 12 ? "pm" : "am",
    a: (d2) => d2[getHours]() >= 12 ? "p" : "a",
    mm: (d2) => zeroPad2(d2[getMinutes]()),
    m: (d2) => d2[getMinutes](),
    ss: (d2) => zeroPad2(d2[getSeconds]()),
    s: (d2) => d2[getSeconds](),
    fff: (d2) => zeroPad3(d2[getMilliseconds]())
  };
  function fmtDate(tpl, names) {
    names = names || engNames;
    let parts = [];
    let R = /\{([a-z]+)\}|[^{]+/gi, m2;
    while (m2 = R.exec(tpl))
      parts.push(m2[0][0] == "{" ? subs[m2[1]] : m2[0]);
    return (d2) => {
      let out = "";
      for (let i = 0; i < parts.length; i++)
        out += typeof parts[i] == "string" ? parts[i] : parts[i](d2, names);
      return out;
    };
  }
  function tzDate(date, tz) {
    let date2;
    if (tz == "Etc/UTC")
      date2 = new Date(+date + date.getTimezoneOffset() * 6e4);
    else {
      date2 = new Date(date.toLocaleString("en-US", { timeZone: tz }));
      date2.setMilliseconds(date[getMilliseconds]());
    }
    return date2;
  }
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
  var incrMults = [1, 2, 5];
  var decIncrs = genIncrs(-12, 0, incrMults);
  var intIncrs = genIncrs(0, 12, incrMults);
  var numIncrs = decIncrs.concat(intIncrs);
  var s = 1;
  var m = 60;
  var h = m * m;
  var d = h * 24;
  var mo = d * 30;
  var y = d * 365;
  var timeIncrs = [5e-4].concat(genIncrs(-3, 0, incrMults), [
    1,
    5,
    10,
    15,
    30,
    m,
    m * 5,
    m * 10,
    m * 15,
    m * 30,
    h,
    h * 2,
    h * 3,
    h * 4,
    h * 6,
    h * 8,
    h * 12,
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
    mo,
    mo * 2,
    mo * 3,
    mo * 4,
    mo * 6,
    y,
    y * 2,
    y * 5,
    y * 10,
    y * 25,
    y * 50,
    y * 100
  ]);
  function timeAxisStamps(stampCfg, fmtDate2) {
    return stampCfg.map((s2) => [
      s2[0],
      fmtDate2(s2[1]),
      s2[2],
      fmtDate2(s2[4] ? s2[1] + s2[3] : s2[3])
    ]);
  }
  var yyyy = "{YYYY}";
  var NLyyyy = "\n" + yyyy;
  var md = "{M}/{D}";
  var NLmd = "\n" + md;
  var aa = "{aa}";
  var hmm = "{h}:{mm}";
  var hmmaa = hmm + aa;
  var ss = ":{ss}";
  var _timeAxisStamps = [
    [y, yyyy, 7, "", 1],
    [d * 28, "{MMM}", 7, NLyyyy, 1],
    [d, md, 7, NLyyyy, 1],
    [h, "{h}" + aa, 4, NLmd, 1],
    [m, hmmaa, 4, NLmd, 1],
    [s, ss, 2, NLmd + " " + hmmaa, 1],
    [1e-3, ss + ".{fff}", 2, NLmd + " " + hmmaa, 1]
  ];
  function timeAxisVals(tzDate2, stamps) {
    return (self2, splits, space, incr) => {
      let s2 = stamps.find((e) => incr >= e[0]) || stamps[stamps.length - 1];
      let prevYear = null;
      let prevDate = null;
      let prevMinu = null;
      return splits.map((split, i) => {
        let date = tzDate2(split);
        let newYear = date[getFullYear]();
        let newDate = date[getDate]();
        let newMinu = date[getMinutes]();
        let diffYear = newYear != prevYear;
        let diffDate = newDate != prevDate;
        let diffMinu = newMinu != prevMinu;
        let stamp = s2[2] == 7 && diffYear || s2[2] == 4 && diffDate || s2[2] == 2 && diffMinu ? s2[3] : s2[1];
        prevYear = newYear;
        prevDate = newDate;
        prevMinu = newMinu;
        return stamp(date);
      });
    };
  }
  function mkDate(y2, m2, d2) {
    return new Date(y2, m2, d2);
  }
  function timeAxisSplits(tzDate2) {
    return (self2, scaleMin, scaleMax, incr, pctSpace) => {
      let splits = [];
      let isMo = incr >= mo && incr < y;
      let minDate = tzDate2(scaleMin);
      let minDateTs = minDate / 1e3;
      let minMin = mkDate(minDate[getFullYear](), minDate[getMonth](), isMo ? 1 : minDate[getDate]());
      let minMinTs = minMin / 1e3;
      if (isMo) {
        let moIncr = incr / mo;
        let split = minDateTs == minMinTs ? minDateTs : mkDate(minMin[getFullYear](), minMin[getMonth]() + moIncr, 1) / 1e3;
        let splitDate = new Date(split * 1e3);
        let baseYear = splitDate[getFullYear]();
        let baseMonth = splitDate[getMonth]();
        for (let i = 0; split <= scaleMax; i++) {
          let next = mkDate(baseYear, baseMonth + moIncr * i, 1);
          let offs = next - tzDate2(next / 1e3);
          split = (+next + offs) / 1e3;
          if (split <= scaleMax)
            splits.push(split);
        }
      } else {
        let incr0 = incr >= d ? d : incr;
        let tzOffset = floor(scaleMin) - floor(minDateTs);
        let split = minMinTs + tzOffset + incrRoundUp(minDateTs - minMinTs, incr0);
        splits.push(split);
        let date0 = tzDate2(split);
        let prevHour = date0[getHours]() + date0[getMinutes]() / m + date0[getSeconds]() / h;
        let incrHours = incr / h;
        while (1) {
          split = round3(split + incr);
          let expectedHour = floor(round6(prevHour + incrHours)) % 24;
          let splitDate = tzDate2(split);
          let actualHour = splitDate.getHours();
          let dstShift = actualHour - expectedHour;
          if (dstShift > 1)
            dstShift = -1;
          split -= dstShift * h;
          if (split > scaleMax)
            break;
          prevHour = (prevHour + incrHours) % 24;
          let prevSplit = splits[splits.length - 1];
          let pctIncr = round3((split - prevSplit) / incr);
          if (pctIncr * pctSpace >= 0.7)
            splits.push(split);
        }
      }
      return splits;
    };
  }
  function timeSeriesStamp(stampCfg, fmtDate2) {
    return fmtDate2(stampCfg);
  }
  var _timeSeriesStamp = "{YYYY}-{MM}-{DD} {h}:{mm}{aa}";
  function timeSeriesVal(tzDate2, stamp) {
    return (self2, val) => stamp(tzDate2(val));
  }
  function cursorPoint(self2, si) {
    let s2 = self2.series[si];
    let pt = placeDiv();
    pt.style.background = s2.stroke || hexBlack;
    let dia = ptDia(s2.width, 1);
    let mar = (dia - 1) / -2;
    setStylePx(pt, WIDTH, dia);
    setStylePx(pt, HEIGHT, dia);
    setStylePx(pt, "marginLeft", mar);
    setStylePx(pt, "marginTop", mar);
    return pt;
  }
  var cursorOpts = {
    show: true,
    x: true,
    y: true,
    lock: false,
    points: {
      show: cursorPoint
    },
    drag: {
      setScale: true,
      x: true,
      y: false,
      dist: 0,
      uni: null,
      _x: false,
      _y: false
    },
    focus: {
      prox: -1
    },
    locked: false,
    left: -10,
    top: -10,
    idx: null
  };
  var grid = {
    show: true,
    stroke: "rgba(0,0,0,0.07)",
    width: 2
  };
  var ticks = assign({}, grid, { size: 10 });
  var font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
  var labelFont = "bold " + font;
  var lineMult = 1.5;
  var xAxisOpts = {
    type: "x",
    show: true,
    scale: "x",
    space: 50,
    gap: 5,
    size: 50,
    labelSize: 30,
    labelFont,
    side: 2,
    grid,
    ticks,
    font,
    rotate: 0
  };
  var numSeriesLabel = "Value";
  var timeSeriesLabel = "Time";
  var xSeriesOpts = {
    show: true,
    scale: "x",
    min: inf,
    max: -inf,
    idxs: []
  };
  var fmtNum = new Intl.NumberFormat(navigator.language);
  function numAxisVals(self2, splits, space, incr) {
    return splits.map(fmtNum.format);
  }
  function numAxisSplits(self2, scaleMin, scaleMax, incr, pctSpace, forceMin) {
    scaleMin = forceMin ? scaleMin : +incrRoundUp(scaleMin, incr).toFixed(12);
    let splits = [];
    for (let val = scaleMin; val <= scaleMax; val = +(val + incr).toFixed(12))
      splits.push(val);
    return splits;
  }
  function numSeriesVal(self2, val) {
    return val;
  }
  var yAxisOpts = {
    type: "y",
    show: true,
    scale: "y",
    space: 40,
    gap: 5,
    size: 50,
    labelSize: 30,
    labelFont,
    side: 3,
    grid,
    ticks,
    font,
    rotate: 0
  };
  function ptDia(width, mult) {
    let dia = 3 + (width || 1) * 2;
    return round3(dia * mult);
  }
  function seriesPoints(self2, si) {
    const dia = ptDia(self2.series[si].width, pxRatio);
    let maxPts = self2.bbox.width / dia / 2;
    let idxs = self2.series[0].idxs;
    return idxs[1] - idxs[0] <= maxPts;
  }
  var ySeriesOpts = {
    scale: "y",
    show: true,
    band: false,
    spanGaps: false,
    alpha: 1,
    points: {
      show: seriesPoints
    },
    values: null,
    min: inf,
    max: -inf,
    idxs: [],
    path: null,
    clip: null
  };
  var xScaleOpts = {
    time: true,
    auto: false,
    distr: 1,
    min: null,
    max: null
  };
  var yScaleOpts = assign({}, xScaleOpts, {
    time: false,
    auto: true
  });
  var syncs = {};
  function _sync(opts) {
    let clients = [];
    return {
      sub(client) {
        clients.push(client);
      },
      unsub(client) {
        clients = clients.filter((c) => c != client);
      },
      pub(type, self2, x, y2, w, h2, i) {
        if (clients.length > 1) {
          clients.forEach((client) => {
            client != self2 && client.pub(type, self2, x, y2, w, h2, i);
          });
        }
      }
    };
  }
  function setDefaults(d2, xo, yo, initY) {
    let d22 = initY ? [d2[0], d2[1]].concat(d2.slice(2)) : [d2[0]].concat(d2.slice(1));
    return d22.map((o, i) => setDefault(o, i, xo, yo));
  }
  function setDefault(o, i, xo, yo) {
    return assign({}, i == 0 || o && o.side % 2 == 0 ? xo : yo, o);
  }
  function getYPos(val, scale, hgt, top) {
    let pctY = (val - scale.min) / (scale.max - scale.min);
    return top + (1 - pctY) * hgt;
  }
  function getXPos(val, scale, wid, lft) {
    let pctX = (val - scale.min) / (scale.max - scale.min);
    return lft + pctX * wid;
  }
  function snapTimeX(self2, dataMin, dataMax) {
    return [dataMin, dataMax > dataMin ? dataMax : dataMax + 86400];
  }
  function snapNumX(self2, dataMin, dataMax) {
    const delta = dataMax - dataMin;
    if (delta == 0) {
      const mag = log10(delta || abs(dataMax) || 1);
      const exp = floor(mag) + 1;
      return [dataMin, incrRoundUp(dataMax, pow(10, exp))];
    } else
      return [dataMin, dataMax];
  }
  function snapNumY(self2, dataMin, dataMax) {
    return rangeNum(dataMin, dataMax, 0.2, true);
  }
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
  function pxRatioFont(font2) {
    let fontSize;
    font2 = font2.replace(/\d+/, (m2) => fontSize = round(m2 * pxRatio));
    return [font2, fontSize];
  }
  function uPlot(opts, data, then) {
    const self2 = {};
    const root = self2.root = placeDiv("uplot");
    if (opts.id != null)
      root.id = opts.id;
    addClass(root, opts.class);
    if (opts.title) {
      let title = placeDiv("title", root);
      title.textContent = opts.title;
    }
    const can = placeTag("canvas");
    const ctx = self2.ctx = can.getContext("2d");
    const wrap = placeDiv("wrap", root);
    const under = placeDiv("under", wrap);
    wrap.appendChild(can);
    const over = placeDiv("over", wrap);
    opts = copy(opts);
    (opts.plugins || []).forEach((p) => {
      if (p.opts)
        opts = p.opts(self2, opts) || opts;
    });
    let ready = false;
    const series = self2.series = setDefaults(opts.series || [], xSeriesOpts, ySeriesOpts, false);
    const axes = self2.axes = setDefaults(opts.axes || [], xAxisOpts, yAxisOpts, true);
    const scales = self2.scales = assign({}, { x: xScaleOpts, y: yScaleOpts }, opts.scales);
    const gutters = assign({
      x: round(yAxisOpts.size / 2),
      y: round(xAxisOpts.size / 3)
    }, opts.gutters);
    const _tzDate = opts.tzDate || ((ts) => new Date(ts * 1e3));
    const _fmtDate = opts.fmtDate || fmtDate;
    const _timeAxisSplits = timeAxisSplits(_tzDate);
    const _timeAxisVals = timeAxisVals(_tzDate, timeAxisStamps(_timeAxisStamps, _fmtDate));
    const _timeSeriesVal = timeSeriesVal(_tzDate, timeSeriesStamp(_timeSeriesStamp, _fmtDate));
    const pendScales = {};
    for (let k in scales) {
      let sc = scales[k];
      if (sc.min != null || sc.max != null)
        pendScales[k] = { min: sc.min, max: sc.max };
    }
    const legend = assign({ show: true }, opts.legend);
    const showLegend = legend.show;
    let legendEl;
    let legendRows = [];
    let legendCols;
    let multiValLegend = false;
    if (showLegend) {
      legendEl = placeTag("table", "legend", root);
      const getMultiVals = series[1] ? series[1].values : null;
      multiValLegend = getMultiVals != null;
      if (multiValLegend) {
        let head = placeTag("tr", "labels", legendEl);
        placeTag("th", null, head);
        legendCols = getMultiVals(self2, 1, 0);
        for (var key in legendCols)
          placeTag("th", null, head).textContent = key;
      } else {
        legendCols = { _: 0 };
        addClass(legendEl, "inline");
      }
    }
    function initLegendRow(s2, i) {
      if (i == 0 && multiValLegend)
        return null;
      let _row = [];
      let row = placeTag("tr", "series", legendEl, legendEl.childNodes[i]);
      addClass(row, s2.class);
      if (!s2.show)
        addClass(row, "off");
      let label = placeTag("th", null, row);
      let indic = placeDiv("ident", label);
      s2.width && (indic.style.borderColor = s2.stroke);
      indic.style.backgroundColor = s2.fill;
      let text = placeDiv("text", label);
      text.textContent = s2.label;
      if (i > 0) {
        on("click", label, (e) => {
          if (cursor.locked)
            return;
          filtMouse(e) && setSeries(series.indexOf(s2), { show: !s2.show }, syncOpts.setSeries);
        });
        if (cursorFocus) {
          on(mouseenter, label, (e) => {
            if (cursor.locked)
              return;
            setSeries(series.indexOf(s2), { focus: true }, syncOpts.setSeries);
          });
        }
      }
      for (var key2 in legendCols) {
        let v = placeTag("td", null, row);
        v.textContent = "--";
        _row.push(v);
      }
      return _row;
    }
    const cursor = self2.cursor = assign({}, cursorOpts, opts.cursor);
    cursor.points.show = fnOrSelf(cursor.points.show);
    const focus = self2.focus = assign({}, opts.focus || { alpha: 0.3 }, cursor.focus);
    const cursorFocus = focus.prox >= 0;
    let cursorPts = [null];
    function initCursorPt(s2, si) {
      if (si > 0) {
        let pt = cursor.points.show(self2, si);
        if (pt) {
          addClass(pt, "cursor-pt");
          addClass(pt, s2.class);
          trans(pt, -10, -10);
          over.insertBefore(pt, cursorPts[si]);
          return pt;
        }
      }
    }
    function initSeries(s2, i) {
      const scKey = s2.scale;
      const sc = scales[scKey] = assign({}, i == 0 ? xScaleOpts : yScaleOpts, scales[scKey]);
      let isTime = sc.time;
      sc.range = fnOrSelf(sc.range || (isTime ? snapTimeX : i == 0 ? snapNumX : snapNumY));
      let sv = s2.value;
      s2.value = isTime ? isStr(sv) ? timeSeriesVal(_tzDate, timeSeriesStamp(sv, _fmtDate)) : sv || _timeSeriesVal : sv || numSeriesVal;
      s2.label = s2.label || (isTime ? timeSeriesLabel : numSeriesLabel);
      if (i > 0) {
        s2.width = s2.width == null ? 1 : s2.width;
        s2.paths = s2.paths || buildPaths;
        let _ptDia = ptDia(s2.width, 1);
        s2.points = assign({}, {
          size: _ptDia,
          width: max(1, _ptDia * 0.2)
        }, s2.points);
        s2.points.show = fnOrSelf(s2.points.show);
        s2._paths = null;
      }
      if (showLegend)
        legendRows.splice(i, 0, initLegendRow(s2, i));
      if (cursor.show) {
        let pt = initCursorPt(s2, i);
        pt && cursorPts.splice(i, 0, pt);
      }
    }
    function addSeries(opts2, si) {
      si = si == null ? series.length : si;
      opts2 = setDefault(opts2, si, xSeriesOpts, ySeriesOpts);
      series.splice(si, 0, opts2);
      initSeries(series[si], si);
    }
    self2.addSeries = addSeries;
    function delSeries(i) {
      series.splice(i, 1);
      showLegend && legendRows.splice(i, 1)[0][0].parentNode.remove();
      cursorPts.length > 1 && cursorPts.splice(i, 1)[0].remove();
    }
    self2.delSeries = delSeries;
    series.forEach(initSeries);
    for (let k in scales) {
      let sc = scales[k];
      if (sc.from != null)
        scales[k] = assign({}, scales[sc.from], sc);
    }
    const xScaleKey = series[0].scale;
    const xScaleDistr = scales[xScaleKey].distr;
    function initAxis(axis, i) {
      if (axis.show) {
        let isVt = axis.side % 2;
        let sc = scales[axis.scale];
        if (sc == null) {
          axis.scale = isVt ? series[1].scale : xScaleKey;
          sc = scales[axis.scale];
        }
        let isTime = sc.time;
        axis.space = fnOrSelf(axis.space);
        axis.rotate = fnOrSelf(axis.rotate);
        axis.incrs = fnOrSelf(axis.incrs || (sc.distr == 2 ? intIncrs : isTime ? timeIncrs : numIncrs));
        axis.split = fnOrSelf(axis.split || (isTime && sc.distr == 1 ? _timeAxisSplits : numAxisSplits));
        let av = axis.values;
        axis.values = isTime ? isArr(av) ? timeAxisVals(_tzDate, timeAxisStamps(av, _fmtDate)) : av || _timeAxisVals : av || numAxisVals;
        axis.font = pxRatioFont(axis.font);
        axis.labelFont = pxRatioFont(axis.labelFont);
      }
    }
    axes.forEach(initAxis);
    let dataLen;
    let i0 = null;
    let i1 = null;
    const idxs = series[0].idxs;
    let data0 = null;
    function setData(_data, _resetScales) {
      _data = _data || [];
      _data[0] = _data[0] || [];
      self2.data = _data;
      data = _data.slice();
      data0 = data[0];
      dataLen = data0.length;
      if (xScaleDistr == 2)
        data[0] = data0.map((v, i) => i);
      resetYSeries();
      fire("setData");
      _resetScales !== false && autoScaleX();
    }
    self2.setData = setData;
    function autoScaleX() {
      i0 = idxs[0] = 0;
      i1 = idxs[1] = dataLen - 1;
      let _min = xScaleDistr == 2 ? i0 : data[0][i0], _max = xScaleDistr == 2 ? i1 : data[0][i1];
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
    let plotLftCss;
    let plotTopCss;
    let plotLft;
    let plotTop;
    let plotWid;
    let plotHgt;
    self2.bbox = {};
    function _setSize(width, height) {
      self2.width = fullWidCss = plotWidCss = width;
      self2.height = fullHgtCss = plotHgtCss = height;
      plotLftCss = plotTopCss = 0;
      calcPlotRect();
      calcAxesRects();
      let bb = self2.bbox;
      plotLft = bb[LEFT] = incrRound(plotLftCss * pxRatio, 0.5);
      plotTop = bb[TOP] = incrRound(plotTopCss * pxRatio, 0.5);
      plotWid = bb[WIDTH] = incrRound(plotWidCss * pxRatio, 0.5);
      plotHgt = bb[HEIGHT] = incrRound(plotHgtCss * pxRatio, 0.5);
      setStylePx(under, LEFT, plotLftCss);
      setStylePx(under, TOP, plotTopCss);
      setStylePx(under, WIDTH, plotWidCss);
      setStylePx(under, HEIGHT, plotHgtCss);
      setStylePx(over, LEFT, plotLftCss);
      setStylePx(over, TOP, plotTopCss);
      setStylePx(over, WIDTH, plotWidCss);
      setStylePx(over, HEIGHT, plotHgtCss);
      setStylePx(wrap, WIDTH, fullWidCss);
      setStylePx(wrap, HEIGHT, fullHgtCss);
      can[WIDTH] = round(fullWidCss * pxRatio);
      can[HEIGHT] = round(fullHgtCss * pxRatio);
      syncRect();
      ready && _setScale(xScaleKey, scales[xScaleKey].min, scales[xScaleKey].max);
      ready && fire("setSize");
    }
    function setSize({ width, height }) {
      _setSize(width, height);
    }
    self2.setSize = setSize;
    function calcPlotRect() {
      let hasTopAxis = false;
      let hasBtmAxis = false;
      let hasRgtAxis = false;
      let hasLftAxis = false;
      axes.forEach((axis, i) => {
        if (axis.show) {
          let { side, size } = axis;
          let isVt = side % 2;
          let labelSize = axis.labelSize = axis.label != null ? axis.labelSize || 30 : 0;
          let fullSize = size + labelSize;
          if (fullSize > 0) {
            if (isVt) {
              plotWidCss -= fullSize;
              if (side == 3) {
                plotLftCss += fullSize;
                hasLftAxis = true;
              } else
                hasRgtAxis = true;
            } else {
              plotHgtCss -= fullSize;
              if (side == 0) {
                plotTopCss += fullSize;
                hasTopAxis = true;
              } else
                hasBtmAxis = true;
            }
          }
        }
      });
      if (hasTopAxis || hasBtmAxis) {
        if (!hasRgtAxis)
          plotWidCss -= gutters.x;
        if (!hasLftAxis) {
          plotWidCss -= gutters.x;
          plotLftCss += gutters.x;
        }
      }
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
      let off1 = plotLftCss + plotWidCss;
      let off2 = plotTopCss + plotHgtCss;
      let off3 = plotLftCss;
      let off0 = plotTopCss;
      function incrOffset(side, size) {
        switch (side) {
          case 1:
            off1 += size;
            return off1 - size;
          case 2:
            off2 += size;
            return off2 - size;
          case 3:
            off3 -= size;
            return off3 + size;
          case 0:
            off0 -= size;
            return off0 + size;
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
      if (dataLen > 0) {
        let wipScales = copy(scales);
        for (let k in wipScales) {
          let wsc = wipScales[k];
          let psc = pendScales[k];
          if (psc != null) {
            assign(wsc, psc);
            if (k == xScaleKey)
              resetYSeries();
          } else if (k != xScaleKey) {
            wsc.min = inf;
            wsc.max = -inf;
          }
        }
        series.forEach((s2, i) => {
          let k = s2.scale;
          let wsc = wipScales[k];
          if (i == 0) {
            let minMax = wsc.range(self2, wsc.min, wsc.max);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
            i0 = closestIdx(wsc.min, data[0]);
            i1 = closestIdx(wsc.max, data[0]);
            if (data[0][i0] < wsc.min)
              i0++;
            if (data[0][i1] > wsc.max)
              i1--;
            s2.min = data0[i0];
            s2.max = data0[i1];
          } else if (s2.show && pendScales[k] == null) {
            let minMax = s2.min == inf ? wsc.auto ? getMinMax(data[i], i0, i1) : [0, 100] : [s2.min, s2.max];
            wsc.min = min(wsc.min, s2.min = minMax[0]);
            wsc.max = max(wsc.max, s2.max = minMax[1]);
          }
          s2.idxs[0] = i0;
          s2.idxs[1] = i1;
        });
        for (let k in wipScales) {
          let wsc = wipScales[k];
          if (wsc.from == null && wsc.min != inf && pendScales[k] == null) {
            let minMax = wsc.range(self2, wsc.min, wsc.max);
            wsc.min = minMax[0];
            wsc.max = minMax[1];
          }
        }
        for (let k in wipScales) {
          let wsc = wipScales[k];
          if (wsc.from != null) {
            let base = wipScales[wsc.from];
            if (base.min != inf) {
              let minMax = wsc.range(self2, base.min, base.max);
              wsc.min = minMax[0];
              wsc.max = minMax[1];
            }
          }
        }
        let changed = {};
        for (let k in wipScales) {
          let wsc = wipScales[k];
          let sc = scales[k];
          if (sc.min != wsc.min || sc.max != wsc.max) {
            sc.min = wsc.min;
            sc.max = wsc.max;
            changed[k] = true;
          }
        }
        series.forEach((s2) => {
          if (changed[s2.scale])
            s2._paths = null;
        });
        for (let k in changed)
          fire("setScale", k);
      }
      for (let k in pendScales)
        pendScales[k] = null;
      cursor.show && updateCursor();
    }
    function drawPoints(si) {
      let s2 = series[si];
      let p = s2.points;
      const width = round3(p.width * pxRatio);
      const offset = width % 2 / 2;
      const isStroked = p.width > 0;
      let rad = (p.size - p.width) / 2 * pxRatio;
      let dia = round3(rad * 2);
      ctx.translate(offset, offset);
      ctx.save();
      ctx.beginPath();
      ctx.rect(plotLft - dia, plotTop - dia, plotWid + dia * 2, plotHgt + dia * 2);
      ctx.clip();
      ctx.globalAlpha = s2.alpha;
      const path = new Path2D();
      for (let pi = i0; pi <= i1; pi++) {
        if (data[si][pi] != null) {
          let x = round(getXPos(data[0][pi], scales[xScaleKey], plotWid, plotLft));
          let y2 = round(getYPos(data[si][pi], scales[s2.scale], plotHgt, plotTop));
          path.moveTo(x + rad, y2);
          path.arc(x, y2, rad, 0, PI * 2);
        }
      }
      setCtxStyle(p.stroke || s2.stroke || hexBlack, width, null, p.fill || (isStroked ? "#fff" : s2.stroke || hexBlack));
      ctx.fill(path);
      isStroked && ctx.stroke(path);
      ctx.globalAlpha = 1;
      ctx.restore();
      ctx.translate(-offset, -offset);
    }
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
      series.forEach((s2, i) => {
        if (i > 0 && s2.show && dataLen > 0 && s2._paths == null) {
          let _idxs = getOuterIdxs(data[i]);
          s2._paths = s2.paths(self2, i, _idxs[0], _idxs[1]);
        }
      });
      series.forEach((s2, i) => {
        if (i > 0 && s2.show) {
          if (s2._paths)
            drawPath(i);
          if (s2.points.show(self2, i, i0, i1))
            drawPoints(i);
          fire("drawSeries", i);
        }
      });
    }
    function drawPath(si) {
      const s2 = series[si];
      if (dir == 1) {
        const { stroke, fill, clip } = s2._paths;
        const width = round3(s2[WIDTH] * pxRatio);
        const offset = width % 2 / 2;
        setCtxStyle(s2.stroke, width, s2.dash, s2.fill);
        ctx.globalAlpha = s2.alpha;
        ctx.translate(offset, offset);
        ctx.save();
        let lft = plotLft, top = plotTop, wid = plotWid, hgt = plotHgt;
        let halfWid = width * pxRatio / 2;
        if (s2.min == 0)
          hgt += halfWid;
        if (s2.max == 0) {
          top -= halfWid;
          hgt += halfWid;
        }
        ctx.beginPath();
        ctx.rect(lft, top, wid, hgt);
        ctx.clip();
        if (clip != null)
          ctx.clip(clip);
        if (s2.band) {
          ctx.fill(stroke);
          width && ctx.stroke(stroke);
        } else {
          width && ctx.stroke(stroke);
          if (s2.fill != null)
            ctx.fill(fill);
        }
        ctx.restore();
        ctx.translate(-offset, -offset);
        ctx.globalAlpha = 1;
      }
      if (s2.band)
        dir *= -1;
    }
    function buildClip(is, gaps, nullHead, nullTail) {
      let s2 = series[is];
      let clip = null;
      if (gaps.length > 0) {
        if (s2.spanGaps) {
          let headGap = gaps[0];
          let tailGap = gaps[gaps.length - 1];
          gaps = [];
          if (nullHead)
            gaps.push(headGap);
          if (nullTail)
            gaps.push(tailGap);
        }
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
    function addGap(gaps, outX, x) {
      let prevGap = gaps[gaps.length - 1];
      if (prevGap && prevGap[0] == outX)
        prevGap[1] = x;
      else
        gaps.push([outX, x]);
    }
    function buildPaths(self3, is, _i0, _i1) {
      const s2 = series[is];
      const xdata = data[0];
      const ydata = data[is];
      const scaleX = scales[xScaleKey];
      const scaleY = scales[s2.scale];
      const _paths = dir == 1 ? { stroke: new Path2D(), fill: null, clip: null } : series[is - 1]._paths;
      const stroke = _paths.stroke;
      const width = round3(s2[WIDTH] * pxRatio);
      let minY = inf, maxY = -inf, outY, outX;
      let gaps = [];
      let accX = round(getXPos(xdata[dir == 1 ? _i0 : _i1], scaleX, plotWid, plotLft));
      if (s2.band && dir == 1 && _i0 == i0) {
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
        } else {
          let _addGap = false;
          if (minY != inf) {
            stroke.lineTo(accX, minY);
            stroke.lineTo(accX, maxY);
            stroke.lineTo(accX, outY);
            outX = accX;
          } else
            _addGap = true;
          if (ydata[i] != null) {
            outY = round(getYPos(ydata[i], scaleY, plotHgt, plotTop));
            stroke.lineTo(x, outY);
            minY = maxY = outY;
            if (x - accX > 1 && ydata[i - 1] == null)
              _addGap = true;
          } else {
            minY = inf;
            maxY = -inf;
          }
          _addGap && addGap(gaps, outX, x);
          accX = x;
        }
      }
      if (ydata[_i1] == null)
        addGap(gaps, outX, accX);
      if (s2.band) {
        let overShoot = width * 100, _iy, _x;
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
        _paths.clip = buildClip(is, gaps, ydata[_i0] == null, ydata[_i1] == null);
        if (s2.fill != null) {
          let fill = _paths.fill = new Path2D(stroke);
          let zeroY = round(getYPos(0, scaleY, plotHgt, plotTop));
          fill.lineTo(plotLft + plotWid, zeroY);
          fill.lineTo(plotLft, zeroY);
        }
      }
      if (s2.band)
        dir *= -1;
      return _paths;
    }
    function getIncrSpace(axis, min2, max2, fullDim) {
      let incrSpace;
      if (fullDim <= 0)
        incrSpace = [0, 0];
      else {
        let minSpace = axis.space(self2, min2, max2, fullDim);
        let incrs = axis.incrs(self2, min2, max2, fullDim, minSpace);
        incrSpace = findIncr(max2 - min2, incrs, fullDim, minSpace);
        incrSpace.push(incrSpace[1] / minSpace);
      }
      return incrSpace;
    }
    function drawOrthoLines(offs, ori, side, pos0, len, width, stroke, dash) {
      let offset = width % 2 / 2;
      ctx.translate(offset, offset);
      setCtxStyle(stroke, width, dash);
      ctx.beginPath();
      let x0, y0, x1, y1, pos1 = pos0 + (side == 0 || side == 3 ? -len : len);
      if (ori == 0) {
        y0 = pos0;
        y1 = pos1;
      } else {
        x0 = pos0;
        x1 = pos1;
      }
      offs.forEach((off2, i) => {
        if (ori == 0)
          x0 = x1 = off2;
        else
          y0 = y1 = off2;
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
        if (scale.min == inf)
          return;
        let side = axis.side;
        let ori = side % 2;
        let { min: min2, max: max2 } = scale;
        let [incr, space, pctSpace] = getIncrSpace(axis, min2, max2, ori == 0 ? plotWidCss : plotHgtCss);
        let forceMin = scale.distr == 2;
        let splits = axis.split(self2, min2, max2, incr, pctSpace, forceMin);
        let getPos = ori == 0 ? getXPos : getYPos;
        let plotDim = ori == 0 ? plotWid : plotHgt;
        let plotOff = ori == 0 ? plotLft : plotTop;
        let canOffs = splits.map((val) => round(getPos(val, scale, plotDim, plotOff)));
        let axisGap = round(axis.gap * pxRatio);
        let ticks2 = axis.ticks;
        let tickSize = ticks2.show ? round(ticks2.size * pxRatio) : 0;
        let values = axis.values(self2, scale.distr == 2 ? splits.map((i2) => data0[i2]) : splits, space, scale.distr == 2 ? data0[splits[1]] - data0[splits[0]] : incr);
        let angle = side == 2 ? axis.rotate(self2, values, space) * -PI / 180 : 0;
        let basePos = round(axis._pos * pxRatio);
        let shiftAmt = tickSize + axisGap;
        let shiftDir = ori == 0 && side == 0 || ori == 1 && side == 3 ? -1 : 1;
        let finalPos = basePos + shiftAmt * shiftDir;
        let y2 = ori == 0 ? finalPos : 0;
        let x = ori == 1 ? finalPos : 0;
        ctx.font = axis.font[0];
        ctx.fillStyle = axis.stroke || hexBlack;
        ctx.textAlign = angle > 0 ? LEFT : angle < 0 ? RIGHT : ori == 0 ? "center" : side == 3 ? RIGHT : LEFT;
        ctx.textBaseline = angle || ori == 1 ? "middle" : side == 2 ? TOP : BOTTOM;
        let lineHeight = axis.font[1] * lineMult;
        values.forEach((val, i2) => {
          if (ori == 0)
            x = canOffs[i2];
          else
            y2 = canOffs[i2];
          ("" + val).split(/\n/gm).forEach((text, j) => {
            if (angle) {
              ctx.save();
              ctx.translate(x, y2 + j * lineHeight);
              ctx.rotate(angle);
              ctx.fillText(text, 0, 0);
              ctx.restore();
            } else
              ctx.fillText(text, x, y2 + j * lineHeight);
          });
        });
        if (axis.label) {
          ctx.save();
          let baseLpos = round(axis._lpos * pxRatio);
          if (ori == 1) {
            x = y2 = 0;
            ctx.translate(baseLpos, round(plotTop + plotHgt / 2));
            ctx.rotate((side == 3 ? -PI : PI) / 2);
          } else {
            x = round(plotLft + plotWid / 2);
            y2 = baseLpos;
          }
          ctx.font = axis.labelFont[0];
          ctx.textAlign = "center";
          ctx.textBaseline = side == 2 ? TOP : BOTTOM;
          ctx.fillText(axis.label, x, y2);
          ctx.restore();
        }
        if (ticks2.show) {
          drawOrthoLines(canOffs, ori, side, basePos, tickSize, round3(ticks2[WIDTH] * pxRatio), ticks2.stroke);
        }
        let grid2 = axis.grid;
        if (grid2.show) {
          drawOrthoLines(canOffs, ori, ori == 0 ? 2 : 1, ori == 0 ? plotTop : plotLft, ori == 0 ? plotHgt : plotWid, round3(grid2[WIDTH] * pxRatio), grid2.stroke, grid2.dash);
        }
      });
      fire("drawAxes");
    }
    function resetYSeries() {
      series.forEach((s2, i) => {
        if (i > 0) {
          s2.min = inf;
          s2.max = -inf;
          s2._paths = null;
        }
      });
    }
    let didPaint;
    function paint() {
      if (inBatch) {
        shouldPaint = true;
        return;
      }
      ctx.clearRect(0, 0, can[WIDTH], can[HEIGHT]);
      fire("drawClear");
      drawAxesGrid();
      drawSeries();
      didPaint = true;
      fire("draw");
    }
    self2.redraw = (rebuildPaths) => {
      if (rebuildPaths !== false)
        _setScale(xScaleKey, scales[xScaleKey].min, scales[xScaleKey].max);
      else
        paint();
    };
    function setScale(key2, opts2) {
      let sc = scales[key2];
      if (sc.from == null) {
        if (key2 == xScaleKey) {
          if (sc.distr == 2) {
            opts2.min = closestIdx(opts2.min, data[0]);
            opts2.max = closestIdx(opts2.max, data[0]);
          }
          if (sc.time && axes[0].show && opts2.max > opts2.min) {
            let incr = getIncrSpace(axes[0], opts2.min, opts2.max, plotWidCss)[0];
            if (incr < 1e-3)
              return;
          }
        }
        pendScales[key2] = opts2;
        didPaint = false;
        setScales();
        !didPaint && paint();
        didPaint = false;
      }
    }
    self2.setScale = setScale;
    let vt;
    let hz;
    let mouseLeft0;
    let mouseTop0;
    let mouseLeft1;
    let mouseTop1;
    let dragging = false;
    const drag = cursor.drag;
    let dragX = drag.x;
    let dragY = drag.y;
    if (cursor.show) {
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
    const select = self2.select = assign({
      show: true,
      left: 0,
      width: 0,
      top: 0,
      height: 0
    }, opts.select);
    const selectDiv = select.show ? placeDiv("select", over) : null;
    function setSelect(opts2, _fire) {
      if (select.show) {
        for (let prop in opts2)
          setStylePx(selectDiv, prop, select[prop] = opts2[prop]);
        _fire !== false && fire("setSelect");
      }
    }
    self2.setSelect = setSelect;
    function toggleDOM(i, onOff) {
      let s2 = series[i];
      let label = showLegend ? legendRows[i][0].parentNode : null;
      if (s2.show)
        label && remClass(label, "off");
      else {
        label && addClass(label, "off");
        cursorPts.length > 1 && trans(cursorPts[i], 0, -10);
      }
    }
    function _setScale(key2, min2, max2) {
      setScale(key2, { min: min2, max: max2 });
    }
    function setSeries(i, opts2, pub2) {
      let s2 = series[i];
      if (opts2.focus != null)
        setFocus(i);
      if (opts2.show != null) {
        s2.show = opts2.show;
        toggleDOM(i, opts2.show);
        if (s2.band) {
          let ip = series[i + 1] && series[i + 1].band ? i + 1 : i - 1;
          series[ip].show = s2.show;
          toggleDOM(ip, opts2.show);
        }
        _setScale(xScaleKey, scales[xScaleKey].min, scales[xScaleKey].max);
      }
      fire("setSeries", i, opts2);
      pub2 && sync.pub("setSeries", self2, i, opts2);
    }
    self2.setSeries = setSeries;
    function _alpha(i, value) {
      series[i].alpha = value;
      if (legendRows)
        legendRows[i][0].parentNode.style.opacity = value;
    }
    function _setAlpha(i, value) {
      let s2 = series[i];
      _alpha(i, value);
      if (s2.band) {
        let ip = series[i + 1].band ? i + 1 : i - 1;
        _alpha(ip, value);
      }
    }
    const distsToCursor = Array(series.length);
    let focused = null;
    function setFocus(i) {
      if (i != focused) {
        series.forEach((s2, i2) => {
          _setAlpha(i2, i == null || i2 == 0 || i2 == i ? 1 : focus.alpha);
        });
        focused = i;
        paint();
      }
    }
    if (showLegend && cursorFocus) {
      on(mouseleave, legendEl, (e) => {
        if (cursor.locked)
          return;
        setSeries(null, { focus: false }, syncOpts.setSeries);
        updateCursor();
      });
    }
    function scaleValueAtPos(pos, scale) {
      let dim = plotWidCss;
      if (scale != xScaleKey) {
        dim = plotHgtCss;
        pos = dim - pos;
      }
      let pct = pos / dim;
      let sc = scales[scale];
      let d2 = sc.max - sc.min;
      return sc.min + pct * d2;
    }
    function closestIdxFromXpos(pos) {
      let v = scaleValueAtPos(pos, xScaleKey);
      return closestIdx(v, data[0], i0, i1);
    }
    self2.valToIdx = (val) => closestIdx(val, data[0]);
    self2.posToIdx = closestIdxFromXpos;
    self2.posToVal = scaleValueAtPos;
    self2.valToPos = (val, scale, can2) => scale == xScaleKey ? getXPos(val, scales[scale], can2 ? plotWid : plotWidCss, can2 ? plotLft : 0) : getYPos(val, scales[scale], can2 ? plotHgt : plotHgtCss, can2 ? plotTop : 0);
    let inBatch = false;
    let shouldPaint = false;
    let shouldSetScales = false;
    let shouldUpdateCursor = false;
    function batch(fn) {
      inBatch = true;
      fn(self2);
      inBatch = false;
      shouldSetScales && setScales();
      shouldUpdateCursor && updateCursor();
      shouldPaint && !didPaint && paint();
      shouldSetScales = shouldUpdateCursor = shouldPaint = didPaint = inBatch;
    }
    self2.batch = batch;
    self2.setCursor = (opts2) => {
      mouseLeft1 = opts2.left;
      mouseTop1 = opts2.top;
      updateCursor();
    };
    let cursorRaf = 0;
    function updateCursor(ts, src) {
      if (inBatch) {
        shouldUpdateCursor = true;
        return;
      }
      cursorRaf = 0;
      if (cursor.show) {
        cursor.x && trans(vt, round(mouseLeft1), 0);
        cursor.y && trans(hz, 0, round(mouseTop1));
      }
      let idx;
      let noDataInRange = i0 > i1;
      if (mouseLeft1 < 0 || dataLen == 0 || noDataInRange) {
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
              legendRows[i][j][firstChild].nodeValue = "--";
          }
        }
        if (cursorFocus)
          setSeries(null, { focus: true }, syncOpts.setSeries);
      } else {
        idx = closestIdxFromXpos(mouseLeft1);
        let scX = scales[xScaleKey];
        let xPos = round3(getXPos(data[0][idx], scX, plotWidCss, 0));
        for (let i = 0; i < series.length; i++) {
          let s2 = series[i];
          if (i > 0 && s2.show) {
            let valAtIdx = data[i][idx];
            let yPos = valAtIdx == null ? -10 : round3(getYPos(valAtIdx, scales[s2.scale], plotHgtCss, 0));
            distsToCursor[i] = yPos > 0 ? abs(yPos - mouseTop1) : inf;
            cursorPts.length > 1 && trans(cursorPts[i], xPos, yPos);
          } else
            distsToCursor[i] = inf;
          if (showLegend) {
            if (idx == cursor.idx || i == 0 && multiValLegend)
              continue;
            let src2 = i == 0 && xScaleDistr == 2 ? data0 : data[i];
            let vals = multiValLegend ? s2.values(self2, i, idx) : { _: s2.value(self2, src2[idx], i, idx) };
            let j = 0;
            for (let k in vals)
              legendRows[i][j++][firstChild].nodeValue = vals[k];
          }
        }
      }
      if (select.show && dragging) {
        let dx = abs(mouseLeft1 - mouseLeft0);
        let dy = abs(mouseTop1 - mouseTop0);
        if (src != null) {
          let [xKey, yKey] = syncOpts.scales;
          let sdrag = src.cursor.drag;
          dragX = sdrag._x;
          dragY = sdrag._y;
          if (xKey) {
            let sc = scales[xKey];
            let srcLeft = src.posToVal(src.select[LEFT], xKey);
            let srcRight = src.posToVal(src.select[LEFT] + src.select[WIDTH], xKey);
            select[LEFT] = getXPos(srcLeft, sc, plotWidCss, 0);
            select[WIDTH] = abs(select[LEFT] - getXPos(srcRight, sc, plotWidCss, 0));
            setStylePx(selectDiv, LEFT, select[LEFT]);
            setStylePx(selectDiv, WIDTH, select[WIDTH]);
            if (!yKey) {
              setStylePx(selectDiv, TOP, select[TOP] = 0);
              setStylePx(selectDiv, HEIGHT, select[HEIGHT] = plotHgtCss);
            }
          }
          if (yKey) {
            let sc = scales[yKey];
            let srcTop = src.posToVal(src.select[TOP], yKey);
            let srcBottom = src.posToVal(src.select[TOP] + src.select[HEIGHT], yKey);
            select[TOP] = getYPos(srcTop, sc, plotHgtCss, 0);
            select[HEIGHT] = abs(select[TOP] - getYPos(srcBottom, sc, plotHgtCss, 0));
            setStylePx(selectDiv, TOP, select[TOP]);
            setStylePx(selectDiv, HEIGHT, select[HEIGHT]);
            if (!xKey) {
              setStylePx(selectDiv, LEFT, select[LEFT] = 0);
              setStylePx(selectDiv, WIDTH, select[WIDTH] = plotWidCss);
            }
          }
        } else {
          dragX = drag.x && dx >= drag.dist;
          dragY = drag.y && dy >= drag.dist;
          let uni = drag.uni;
          if (uni != null) {
            if (dragX && dragY) {
              dragX = dx >= uni;
              dragY = dy >= uni;
              if (!dragX && !dragY) {
                if (dy > dx)
                  dragY = true;
                else
                  dragX = true;
              }
            }
          } else if (drag.x && drag.y && (dragX || dragY))
            dragX = dragY = true;
          if (dragX) {
            let minX = min(mouseLeft0, mouseLeft1);
            setStylePx(selectDiv, LEFT, select[LEFT] = minX);
            setStylePx(selectDiv, WIDTH, select[WIDTH] = dx);
            if (!dragY) {
              setStylePx(selectDiv, TOP, select[TOP] = 0);
              setStylePx(selectDiv, HEIGHT, select[HEIGHT] = plotHgtCss);
            }
          }
          if (dragY) {
            let minY = min(mouseTop0, mouseTop1);
            setStylePx(selectDiv, TOP, select[TOP] = minY);
            setStylePx(selectDiv, HEIGHT, select[HEIGHT] = dy);
            if (!dragX) {
              setStylePx(selectDiv, LEFT, select[LEFT] = 0);
              setStylePx(selectDiv, WIDTH, select[WIDTH] = plotWidCss);
            }
          }
          if (!dragX && !dragY) {
            setStylePx(selectDiv, HEIGHT, select[HEIGHT] = 0);
            setStylePx(selectDiv, WIDTH, select[WIDTH] = 0);
          }
        }
      }
      cursor.idx = idx;
      cursor.left = mouseLeft1;
      cursor.top = mouseTop1;
      drag._x = dragX;
      drag._y = dragY;
      if (ts != null) {
        sync.pub(mousemove, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, idx);
        if (cursorFocus) {
          let minDist = min.apply(null, distsToCursor);
          let fi = null;
          if (minDist <= focus.prox) {
            distsToCursor.some((dist, i) => {
              if (dist == minDist)
                return fi = i;
            });
          }
          setSeries(fi, { focus: true }, syncOpts.setSeries);
        }
      }
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
      } else
        updateCursor(null, src);
    }
    function cacheMouse(e, src, _x, _y, _w, _h, _i, initial, snap) {
      if (e != null) {
        _x = e.clientX - rect.left;
        _y = e.clientY - rect.top;
      } else {
        if (_x < 0 || _y < 0) {
          mouseLeft1 = -10;
          mouseTop1 = -10;
          return;
        }
        let [xKey, yKey] = syncOpts.scales;
        if (xKey != null)
          _x = getXPos(src.posToVal(_x, xKey), scales[xKey], plotWidCss, 0);
        else
          _x = plotWidCss * (_x / _w);
        if (yKey != null)
          _y = getYPos(src.posToVal(_y, yKey), scales[yKey], plotHgtCss, 0);
        else
          _y = plotHgtCss * (_y / _h);
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
      } else {
        mouseLeft1 = _x;
        mouseTop1 = _y;
      }
    }
    function hideSelect() {
      setSelect({
        width: 0,
        height: 0
      }, false);
    }
    function mouseDown(e, src, _x, _y, _w, _h, _i) {
      if (src != null || filtMouse(e)) {
        dragging = true;
        dragX = dragY = drag._x = drag._y = false;
        cacheMouse(e, src, _x, _y, _w, _h, _i, true, false);
        if (e != null) {
          on(mouseup, doc2, mouseUp);
          sync.pub(mousedown, self2, mouseLeft0, mouseTop0, plotWidCss, plotHgtCss, null);
        }
      }
    }
    function mouseUp(e, src, _x, _y, _w, _h, _i) {
      if (src != null || filtMouse(e)) {
        dragging = drag._x = drag._y = false;
        cacheMouse(e, src, _x, _y, _w, _h, _i, false, true);
        let hasSelect = select[WIDTH] > 0 || select[HEIGHT] > 0;
        hasSelect && setSelect(select);
        if (drag.setScale && hasSelect) {
          batch(() => {
            if (dragX) {
              _setScale(xScaleKey, scaleValueAtPos(select[LEFT], xScaleKey), scaleValueAtPos(select[LEFT] + select[WIDTH], xScaleKey));
            }
            if (dragY) {
              for (let k in scales) {
                let sc = scales[k];
                if (k != xScaleKey && sc.from == null) {
                  _setScale(k, scaleValueAtPos(select[TOP] + select[HEIGHT], k), scaleValueAtPos(select[TOP], k));
                }
              }
            }
          });
          hideSelect();
        } else if (cursor.lock) {
          cursor.locked = !cursor.locked;
          if (!cursor.locked)
            updateCursor();
        }
      }
      if (e != null) {
        off(mouseup, doc2, mouseUp);
        sync.pub(mouseup, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
      }
    }
    function mouseLeave(e, src, _x, _y, _w, _h, _i) {
      if (!cursor.locked) {
        let _dragging = dragging;
        if (dragging) {
          let snapX = true;
          let snapY = true;
          let snapProx = 10;
          if (dragX && dragY) {
            snapX = mouseLeft1 <= snapProx || mouseLeft1 >= plotWidCss - snapProx;
            snapY = mouseTop1 <= snapProx || mouseTop1 >= plotHgtCss - snapProx;
          }
          if (dragX && snapX) {
            let dLft = mouseLeft1;
            let dRgt = plotWidCss - mouseLeft1;
            let xMin = min(dLft, dRgt);
            if (xMin == dLft)
              mouseLeft1 = 0;
            if (xMin == dRgt)
              mouseLeft1 = plotWidCss;
          }
          if (dragY && snapY) {
            let dTop = mouseTop1;
            let dBtm = plotHgtCss - mouseTop1;
            let yMin = min(dTop, dBtm);
            if (yMin == dTop)
              mouseTop1 = 0;
            if (yMin == dBtm)
              mouseTop1 = plotHgtCss;
          }
          updateCursor(1);
          dragging = false;
        }
        mouseLeft1 = -10;
        mouseTop1 = -10;
        updateCursor(1);
        if (_dragging)
          dragging = _dragging;
      }
    }
    function dblClick(e, src, _x, _y, _w, _h, _i) {
      autoScaleX();
      hideSelect();
      if (e != null)
        sync.pub(dblclick, self2, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
    }
    const events = {};
    events[mousedown] = mouseDown;
    events[mousemove] = mouseMove;
    events[mouseup] = mouseUp;
    events[dblclick] = dblClick;
    events["setSeries"] = (e, src, idx, opts2) => {
      setSeries(idx, opts2);
    };
    let deb;
    if (cursor.show) {
      on(mousedown, over, mouseDown);
      on(mousemove, over, mouseMove);
      on(mouseenter, over, syncRect);
      on(mouseleave, over, (e) => {
        rAF(mouseLeave);
      });
      on(dblclick, over, dblClick);
      deb = debounce(syncRect, 100);
      on(resize, win, deb);
      on(scroll, win, deb);
      self2.syncRect = syncRect;
    }
    const hooks = self2.hooks = opts.hooks || {};
    function fire(evName, a1, a2) {
      if (evName in hooks) {
        hooks[evName].forEach((fn) => {
          fn.call(null, self2, a1, a2);
        });
      }
    }
    (opts.plugins || []).forEach((p) => {
      for (let evName in p.hooks)
        hooks[evName] = (hooks[evName] || []).concat(p.hooks[evName]);
    });
    const syncOpts = assign({
      key: null,
      setSeries: false,
      scales: [xScaleKey, null]
    }, cursor.sync);
    const syncKey = syncOpts.key;
    const sync = syncKey != null ? syncs[syncKey] = syncs[syncKey] || _sync() : _sync();
    sync.sub(self2);
    function pub(type, src, x, y2, w, h2, i) {
      events[type](null, src, x, y2, w, h2, i);
    }
    self2.pub = pub;
    function destroy() {
      sync.unsub(self2);
      off(resize, win, deb);
      off(scroll, win, deb);
      root.remove();
      fire("destroy");
    }
    self2.destroy = destroy;
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
      } else
        then(self2, _init);
    } else
      _init();
    return self2;
  }
  uPlot.assign = assign;
  uPlot.rangeNum = rangeNum;
  {
    uPlot.fmtDate = fmtDate;
    uPlot.tzDate = tzDate;
  }
  var uPlot_esm_default = uPlot;

  // js/metrics_live/index.js
  var SeriesValue = (options) => {
    if (!options.unit)
      return {};
    return {
      value: (u, v) => v == null ? "--" : v.toFixed(3) + ` ${options.unit}`
    };
  };
  var XSeriesValue = (options) => {
    return {
      value: "{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}"
    };
  };
  var YAxisValue = (options) => {
    if (!options.unit)
      return {};
    return {
      values: (u, vals, space) => vals.map((v) => +v.toFixed(2) + ` ${options.unit}`)
    };
  };
  var XAxis = (_options) => {
    return {
      space: 55,
      values: [
        [3600 * 24 * 365, "{YYYY}", 7, "{YYYY}"],
        [3600 * 24 * 28, "{MMM}", 7, "{MMM}\n{YYYY}"],
        [3600 * 24, "{MM}-{DD}", 7, "{MM}-{DD}\n{YYYY}"],
        [3600, "{HH}:{mm}", 4, "{HH}:{mm}\n{YYYY}-{MM}-{DD}"],
        [60, "{HH}:{mm}", 4, "{HH}:{mm}\n{YYYY}-{MM}-{DD}"],
        [1, "{ss}", 2, "{HH}:{mm}:{ss}\n{YYYY}-{MM}-{DD}"]
      ]
    };
  };
  var YAxis = (options) => {
    return {
      show: true,
      size: 70,
      space: 15,
      ...YAxisValue(options)
    };
  };
  var minChartSize = {
    width: 100,
    height: 300
  };
  function throttle(cb, limit) {
    let wait = false;
    return () => {
      if (!wait) {
        requestAnimationFrame(cb);
        wait = true;
        setTimeout(() => {
          wait = false;
        }, limit);
      }
    };
  }
  var newSeriesConfig = (options, index = 0) => {
    return {
      ...LineColor.at(index),
      ...SeriesValue(options),
      label: options.label,
      spanGaps: true,
      points: { show: false }
    };
  };
  var dataForDatasets = (datasets) => datasets.slice(0).map(({ data }) => data);
  function nextValueForCallback({ y: y2, z }, callback) {
    this.datasets[0].data.push(z);
    let currentValue = this.datasets[1].data[this.datasets[1].data.length - 1] || 0;
    let nextValue = callback.call(this, y2, currentValue);
    this.datasets[1].data.push(nextValue);
  }
  var findLastNonNullValue = (data) => data.reduceRight((a, c) => c != null && a == null ? c : a, null);
  function nextTaggedValueForCallback({ x, y: y2, z }, callback) {
    let seriesIndex = this.datasets.findIndex(({ key }) => x === key);
    if (seriesIndex === -1) {
      seriesIndex = this.datasets.push({ key: x, data: Array(this.datasets[0].data.length).fill(null) }) - 1;
      this.chart.addSeries(newSeriesConfig({ label: x, unit: this.options.unit }, seriesIndex - 1), seriesIndex);
    }
    this.datasets = this.datasets.map((dataset, index) => {
      if (index === 0) {
        dataset.data.push(z);
      } else if (index === seriesIndex) {
        dataset.data.push(callback.call(this, y2, findLastNonNullValue(dataset.data) || 0));
      } else {
        dataset.data.push(null);
      }
      return dataset;
    });
  }
  var getPruneThreshold = ({ pruneThreshold = 1e3 }) => pruneThreshold;
  var CommonMetric = class {
    static __projections() {
      return {
        counter: (y2, value) => value + 1,
        last_value: (y2) => y2,
        sum: (y2, value) => value + y2
      };
    }
    static getConfig(options) {
      return {
        class: options.kind,
        title: options.title,
        width: options.width,
        height: options.height,
        series: [
          { ...XSeriesValue() },
          newSeriesConfig(options, 0)
        ],
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
        axes: [
          XAxis(),
          YAxis(options)
        ]
      };
    }
    static initialData() {
      return [[], []];
    }
    constructor(chart, options) {
      this.__callback = this.constructor.__projections()[options.metric];
      this.chart = chart;
      this.datasets = [{ key: "|x|", data: [] }];
      this.options = options;
      this.pruneThreshold = getPruneThreshold(options);
      if (options.tagged) {
        this.chart.delSeries(1);
        this.__handler = nextTaggedValueForCallback;
      } else {
        this.datasets.push({ key: options.label, data: [] });
        this.__handler = nextValueForCallback;
      }
    }
    handleMeasurements(measurements) {
      measurements.forEach((measurement) => this.__handler.call(this, measurement, this.__callback));
      let currentSize = this.datasets[0].data.length;
      if (currentSize >= this.pruneThreshold) {
        this.datasets = this.datasets.map(({ data, ...rest }) => {
          return { data: data.slice(-this.pruneThreshold), ...rest };
        });
      }
      this.chart.setData(dataForDatasets(this.datasets));
    }
  };
  var Summary = class {
    constructor(options, chartEl) {
      let config = this.constructor.getConfig(options);
      config.series[1].values = this.__seriesValues.bind(this);
      this.datasets = [{ key: "|x|", data: [] }];
      this.chart = new uPlot_esm_default(config, this.constructor.initialData(options), chartEl);
      this.pruneThreshold = getPruneThreshold(options);
      this.options = options;
      if (options.tagged) {
        this.chart.delSeries(1);
        this.__handler = this.handleTaggedMeasurement.bind(this);
      } else {
        this.datasets.push(this.constructor.newDataset(options.label));
        this.__handler = this.handleMeasurement.bind(this);
      }
    }
    handleMeasurements(measurements) {
      measurements.forEach((measurement) => this.__handler(measurement));
      this.__maybePruneDatasets();
      this.chart.setData(dataForDatasets(this.datasets));
    }
    handleTaggedMeasurement(measurement) {
      let seriesIndex = this.findOrCreateSeries(measurement.x);
      this.handleMeasurement(measurement, seriesIndex);
    }
    handleMeasurement(measurement, sidx = 1) {
      let { z: timestamp } = measurement;
      this.datasets = this.datasets.map((dataset, index) => {
        if (dataset.key === "|x|") {
          dataset.data.push(timestamp);
        } else if (index === sidx) {
          this.pushToDataset(dataset, measurement);
        } else {
          this.pushToDataset(dataset, null);
        }
        return dataset;
      });
    }
    findOrCreateSeries(label) {
      let seriesIndex = this.datasets.findIndex(({ key }) => label === key);
      if (seriesIndex === -1) {
        seriesIndex = this.datasets.push(this.constructor.newDataset(label, this.datasets[0].data.length)) - 1;
        let config = {
          values: this.__seriesValues.bind(this),
          ...newSeriesConfig({ label }, seriesIndex - 1)
        };
        this.chart.addSeries(config, seriesIndex);
      }
      return seriesIndex;
    }
    pushToDataset(dataset, measurement) {
      if (measurement === null) {
        dataset.data.push(null);
        dataset.agg.avg.push(null);
        dataset.agg.max.push(null);
        dataset.agg.min.push(null);
        return;
      }
      let { y: y2 } = measurement;
      dataset.agg.count++;
      dataset.agg.total += y2;
      dataset.data.push(y2);
      if (dataset.last.min === null || y2 < dataset.last.min) {
        dataset.last.min = y2;
      }
      dataset.agg.min.push(dataset.last.min);
      if (dataset.last.max === null || y2 > dataset.last.max) {
        dataset.last.max = y2;
      }
      dataset.agg.max.push(dataset.last.max);
      dataset.agg.avg.push(dataset.agg.total / dataset.agg.count);
      return dataset;
    }
    __maybePruneDatasets() {
      let currentSize = this.datasets[0].data.length;
      if (currentSize > this.pruneThreshold) {
        let start = -this.pruneThreshold;
        this.datasets = this.datasets.map(({ key, data, agg }) => {
          let dataPruned = data.slice(start);
          if (!agg) {
            return { key, data: dataPruned };
          }
          let { avg, count, max: max2, min: min2, total } = agg;
          let minPruned = min2.slice(start);
          let maxPruned = max2.slice(start);
          return {
            key,
            data: dataPruned,
            agg: {
              avg: avg.slice(start),
              count,
              min: minPruned,
              max: maxPruned,
              total
            },
            last: {
              min: findLastNonNullValue(minPruned),
              max: findLastNonNullValue(maxPruned)
            }
          };
        });
      }
    }
    __seriesValues(u, sidx, idx) {
      let dataset = this.datasets[sidx];
      if (dataset && dataset.data && dataset.data[idx]) {
        let { agg: { avg, max: max2, min: min2 }, data } = dataset;
        return {
          Value: data[idx].toFixed(3),
          Min: min2[idx].toFixed(3),
          Max: max2[idx].toFixed(3),
          Avg: avg[idx].toFixed(3)
        };
      } else {
        return { Value: "--", Min: "--", Max: "--", Avg: "--" };
      }
    }
    static initialData() {
      return [[], []];
    }
    static getConfig(options) {
      return {
        class: options.kind,
        title: options.title,
        width: options.width,
        height: options.height,
        series: [
          { ...XSeriesValue() },
          newSeriesConfig(options, 0)
        ],
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
        axes: [
          XAxis(),
          YAxis(options)
        ]
      };
    }
    static newDataset(key, length = 0) {
      let nils = length > 0 ? Array(length).fill(null) : [];
      return {
        key,
        data: [...nils],
        agg: { avg: [...nils], count: 0, max: [...nils], min: [...nils], total: 0 },
        last: { max: null, min: null }
      };
    }
  };
  var __METRICS__ = {
    counter: CommonMetric,
    last_value: CommonMetric,
    sum: CommonMetric,
    summary: Summary
  };
  var TelemetryChart = class {
    constructor(chartEl, options) {
      if (!options.metric) {
        throw new TypeError(`No metric type was provided`);
      } else if (options.metric && !__METRICS__[options.metric]) {
        throw new TypeError(`No metric defined for type ${options.metric}`);
      }
      const metric = __METRICS__[options.metric];
      if (metric === Summary) {
        this.metric = new Summary(options, chartEl);
        this.uplotChart = this.metric.chart;
      } else {
        this.uplotChart = new uPlot_esm_default(metric.getConfig(options), metric.initialData(options), chartEl);
        this.metric = new metric(this.uplotChart, options);
      }
      let isBufferingData = typeof options.refreshInterval !== "undefined";
      this._isBufferingData = isBufferingData;
      this._buffer = [];
      this._timer = isBufferingData ? setInterval(this._flushToChart.bind(this), +options.refreshInterval) : null;
    }
    clearTimers() {
      clearInterval(this._timer);
    }
    resize(boundingBox) {
      this.uplotChart.setSize({
        width: Math.max(boundingBox.width, minChartSize.width),
        height: minChartSize.height
      });
    }
    pushData(measurements) {
      if (!measurements.length)
        return;
      let callback = this._isBufferingData ? this._pushToBuffer : this._pushToChart;
      callback.call(this, measurements);
    }
    _pushToBuffer(measurements) {
      this._buffer = this._buffer.concat(measurements);
    }
    _pushToChart(measurements) {
      this.metric.handleMeasurements(measurements);
    }
    _flushToChart() {
      let measurements = this._flushBuffer();
      if (!measurements.length) {
        return;
      }
      this._pushToChart(measurements);
    }
    _flushBuffer() {
      if (this._buffer && !this._buffer.length) {
        return [];
      }
      let measurements = this._buffer;
      this._buffer = [];
      return measurements.reduce((acc, val) => acc.concat(val), []);
    }
  };
  var PhxChartComponent = {
    mounted() {
      let chartEl = this.el.parentElement.querySelector(".chart");
      let size = chartEl.getBoundingClientRect();
      let options = Object.assign({}, chartEl.dataset, {
        tagged: chartEl.dataset.tags && chartEl.dataset.tags !== "" || false,
        width: Math.max(size.width, minChartSize.width),
        height: minChartSize.height,
        now: new Date() / 1e3,
        refreshInterval: 1e3
      });
      this.chart = new TelemetryChart(chartEl, options);
      window.addEventListener("resize", throttle(() => {
        let newSize = chartEl.getBoundingClientRect();
        this.chart.resize(newSize);
      }));
    },
    updated() {
      const data = Array.from(this.el.children || []).map(({ dataset: { x, y: y2, z } }) => {
        return { x, y: +y2, z: +z / 1e6 };
      });
      if (data.length > 0) {
        this.chart.pushData(data);
      }
    },
    destroyed() {
      this.chart.clearTimers();
    }
  };
  var metrics_live_default = PhxChartComponent;

  // js/request_logger_cookie/index.js
  var setCookie = (params) => {
    let cookie = `${params.key}=${params.value};path=/`;
    if (window.location.protocol === "https:") {
      cookie += `;samesite=strict`;
    }
    if (params.domain) {
      cookie += `;domain=${params.domain}`;
    }
    document.cookie = cookie;
  };
  var removeCookie = (params) => {
    const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `${params.key}=; expires=${pastDate}`;
  };
  var isCookieEnabled = (hook) => {
    return hook.el.hasAttribute("data-cookie-enabled");
  };
  var cookieParams = (hook) => {
    return {
      key: hook.el.getAttribute("data-cookie-key"),
      value: hook.el.getAttribute("data-cookie-value"),
      domain: hook.el.getAttribute("data-cookie-domain")
    };
  };
  var PhxRequestLoggerCookie = {
    updated() {
      const loggerCookieParams = cookieParams(this);
      removeCookie(loggerCookieParams);
      if (isCookieEnabled(this)) {
        setCookie(loggerCookieParams);
      }
    }
  };
  var request_logger_cookie_default = PhxRequestLoggerCookie;

  // js/request_logger_query_parameter/index.js
  var copyToClipboard = (textarea) => {
    if (!navigator.clipboard) {
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand("copy");
    } else {
      const text = textarea.value;
      navigator.clipboard.writeText(text);
    }
  };
  var PhxRequestLoggerQueryParameter = {
    mounted() {
      this.el.querySelector(".btn-primary").addEventListener("click", (e) => {
        const textarea = this.el.querySelector("textarea");
        copyToClipboard(textarea);
        const copyIndicator = this.el.querySelector(".copy-indicator");
        copyIndicator.setAttribute("data-enabled", "false");
        void copyIndicator.offsetWidth;
        copyIndicator.setAttribute("data-enabled", "true");
      });
    }
  };
  var request_logger_query_parameter_default = PhxRequestLoggerQueryParameter;

  // js/request_logger_messages/index.js
  var PhxRequestLoggerMessages = {
    updated() {
      if (this.el.querySelector(".logger-autoscroll-checkbox").checked) {
        const messagesElement = this.el.querySelector("#logger-messages");
        messagesElement.scrollTop = messagesElement.scrollHeight;
      }
    }
  };
  var request_logger_messages_default = PhxRequestLoggerMessages;

  // js/color_bar_highlight/index.js
  var interactiveItemSelector = ".progress-bar, .color-bar-legend-entry";
  var highlightedElementName;
  var highlightElements = (containerElement) => {
    containerElement.querySelectorAll(interactiveItemSelector).forEach((progressBarElement) => {
      if (highlightedElementName) {
        const isMuted = progressBarElement.getAttribute("data-name") !== highlightedElementName;
        progressBarElement.setAttribute("data-muted", isMuted);
      } else {
        progressBarElement.removeAttribute("data-muted");
      }
    });
  };
  var PhxColorBarHighlight = {
    mounted() {
      this.el.setAttribute("data-highlight-enabled", "true");
      this.el.querySelectorAll(interactiveItemSelector).forEach((progressBarElement) => progressBarElement.addEventListener("click", (e) => {
        const name = e.currentTarget.getAttribute("data-name");
        highlightedElementName = name === highlightedElementName ? null : name;
        highlightElements(this.el);
      }));
    },
    updated() {
      this.el.setAttribute("data-highlight-enabled", "true");
      highlightElements(this.el);
    }
  };
  var color_bar_highlight_default = PhxColorBarHighlight;

  // js/refresh/index.js
  var REFRESH_DATA_COOKIE = "_refresh_data";
  function storeRefreshData(refreshData, path) {
    const json = JSON.stringify(refreshData);
    const encoded = encodeBase64(json);
    setCookie2(REFRESH_DATA_COOKIE, encoded, path, 15768e4);
  }
  function loadRefreshData() {
    const encoded = getCookieValue(REFRESH_DATA_COOKIE);
    if (encoded) {
      const json = decodeBase64(encoded);
      return JSON.parse(json);
    } else {
      return null;
    }
  }
  function getCookieValue(key) {
    const cookie = document.cookie.split("; ").find((cookie2) => cookie2.startsWith(`${key}=`));
    if (cookie) {
      const value = cookie.replace(`${key}=`, "");
      return value;
    } else {
      return null;
    }
  }
  function setCookie2(key, value, path, maxAge) {
    const cookie = `${key}=${value};max-age=${maxAge};path=${path}`;
    document.cookie = cookie;
  }
  function encodeBase64(string) {
    return btoa(unescape(encodeURIComponent(string)));
  }
  function decodeBase64(binary) {
    return decodeURIComponent(escape(atob(binary)));
  }

  // js/remember_refresh/index.js
  var PhxRememberRefresh = {
    updated() {
      let config = loadRefreshData() || {};
      config[this.el.dataset.page] = this.el.value;
      storeRefreshData(config, this.el.dataset.dashboardMountPath);
    }
  };
  var remember_refresh_default = PhxRememberRefresh;

  // js/app.js
  var Hooks2 = {
    PhxChartComponent: metrics_live_default,
    PhxRequestLoggerCookie: request_logger_cookie_default,
    PhxRequestLoggerQueryParameter: request_logger_query_parameter_default,
    PhxRequestLoggerMessages: request_logger_messages_default,
    PhxColorBarHighlight: color_bar_highlight_default,
    PhxRememberRefresh: remember_refresh_default
  };
  var socketPath = document.querySelector("html").getAttribute("phx-socket") || "/live";
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket(socketPath, Socket, {
    hooks: Hooks2,
    params: (liveViewName) => {
      return {
        _csrf_token: csrfToken,
        refresh_data: loadRefreshData()
      };
    }
  });
  var socket = liveSocket.socket;
  var originalOnConnError = socket.onConnError;
  var fallbackToLongPoll = true;
  socket.onOpen(() => {
    fallbackToLongPoll = false;
  });
  socket.onConnError = (...args) => {
    if (fallbackToLongPoll) {
      fallbackToLongPoll = false;
      socket.disconnect(null, 3e3);
      socket.transport = LongPoll;
      socket.connect();
    } else {
      originalOnConnError.apply(socket, args);
    }
  };
  window.addEventListener("phx:page-loading-start", (info) => import_nprogress.default.start());
  window.addEventListener("phx:page-loading-stop", (info) => import_nprogress.default.done());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL25vZGVfbW9kdWxlcy9ucHJvZ3Jlc3MvbnByb2dyZXNzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9odG1sL3ByaXYvc3RhdGljL3Bob2VuaXhfaHRtbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvdXRpbHMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L2NvbnN0YW50cy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvcHVzaC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvdGltZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L2NoYW5uZWwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L2FqYXguanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L2xvbmdwb2xsLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wcmVzZW5jZS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvc2VyaWFsaXplci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvc29ja2V0LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9hcHAuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2FyaWEuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvaG9va3MuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvbm9kZV9tb2R1bGVzL21vcnBoZG9tL2Rpc3QvbW9ycGhkb20tZXNtLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2RvbV9wYXRjaC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9yZW5kZXJlZC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy92aWV3X2hvb2suanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvanMuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlldy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3NvY2tldC5qcyIsICIuLi8uLi8uLi9hc3NldHMvanMvbWV0cmljc19saXZlL2NvbG9yX3doZWVsLmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9ub2RlX21vZHVsZXMvdXBsb3QvZGlzdC91UGxvdC5lc20uanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL21ldHJpY3NfbGl2ZS9pbmRleC5qcyIsICIuLi8uLi8uLi9hc3NldHMvanMvcmVxdWVzdF9sb2dnZXJfY29va2llL2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9yZXF1ZXN0X2xvZ2dlcl9xdWVyeV9wYXJhbWV0ZXIvaW5kZXguanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL3JlcXVlc3RfbG9nZ2VyX21lc3NhZ2VzL2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9jb2xvcl9iYXJfaGlnaGxpZ2h0L2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9yZWZyZXNoL2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9yZW1lbWJlcl9yZWZyZXNoL2luZGV4LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiBOUHJvZ3Jlc3MsIChjKSAyMDEzLCAyMDE0IFJpY28gU3RhLiBDcnV6IC0gaHR0cDovL3JpY29zdGFjcnV6LmNvbS9ucHJvZ3Jlc3NcbiAqIEBsaWNlbnNlIE1JVCAqL1xuXG47KGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuTlByb2dyZXNzID0gZmFjdG9yeSgpO1xuICB9XG5cbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xuICB2YXIgTlByb2dyZXNzID0ge307XG5cbiAgTlByb2dyZXNzLnZlcnNpb24gPSAnMC4yLjAnO1xuXG4gIHZhciBTZXR0aW5ncyA9IE5Qcm9ncmVzcy5zZXR0aW5ncyA9IHtcbiAgICBtaW5pbXVtOiAwLjA4LFxuICAgIGVhc2luZzogJ2Vhc2UnLFxuICAgIHBvc2l0aW9uVXNpbmc6ICcnLFxuICAgIHNwZWVkOiAyMDAsXG4gICAgdHJpY2tsZTogdHJ1ZSxcbiAgICB0cmlja2xlUmF0ZTogMC4wMixcbiAgICB0cmlja2xlU3BlZWQ6IDgwMCxcbiAgICBzaG93U3Bpbm5lcjogdHJ1ZSxcbiAgICBiYXJTZWxlY3RvcjogJ1tyb2xlPVwiYmFyXCJdJyxcbiAgICBzcGlubmVyU2VsZWN0b3I6ICdbcm9sZT1cInNwaW5uZXJcIl0nLFxuICAgIHBhcmVudDogJ2JvZHknLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImJhclwiIHJvbGU9XCJiYXJcIj48ZGl2IGNsYXNzPVwicGVnXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInNwaW5uZXJcIiByb2xlPVwic3Bpbm5lclwiPjxkaXYgY2xhc3M9XCJzcGlubmVyLWljb25cIj48L2Rpdj48L2Rpdj4nXG4gIH07XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogICAgIE5Qcm9ncmVzcy5jb25maWd1cmUoe1xuICAgKiAgICAgICBtaW5pbXVtOiAwLjFcbiAgICogICAgIH0pO1xuICAgKi9cbiAgTlByb2dyZXNzLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIga2V5LCB2YWx1ZTtcbiAgICBmb3IgKGtleSBpbiBvcHRpb25zKSB7XG4gICAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkgU2V0dGluZ3Nba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMYXN0IG51bWJlci5cbiAgICovXG5cbiAgTlByb2dyZXNzLnN0YXR1cyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHByb2dyZXNzIGJhciBzdGF0dXMsIHdoZXJlIGBuYCBpcyBhIG51bWJlciBmcm9tIGAwLjBgIHRvIGAxLjBgLlxuICAgKlxuICAgKiAgICAgTlByb2dyZXNzLnNldCgwLjQpO1xuICAgKiAgICAgTlByb2dyZXNzLnNldCgxLjApO1xuICAgKi9cblxuICBOUHJvZ3Jlc3Muc2V0ID0gZnVuY3Rpb24obikge1xuICAgIHZhciBzdGFydGVkID0gTlByb2dyZXNzLmlzU3RhcnRlZCgpO1xuXG4gICAgbiA9IGNsYW1wKG4sIFNldHRpbmdzLm1pbmltdW0sIDEpO1xuICAgIE5Qcm9ncmVzcy5zdGF0dXMgPSAobiA9PT0gMSA/IG51bGwgOiBuKTtcblxuICAgIHZhciBwcm9ncmVzcyA9IE5Qcm9ncmVzcy5yZW5kZXIoIXN0YXJ0ZWQpLFxuICAgICAgICBiYXIgICAgICA9IHByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoU2V0dGluZ3MuYmFyU2VsZWN0b3IpLFxuICAgICAgICBzcGVlZCAgICA9IFNldHRpbmdzLnNwZWVkLFxuICAgICAgICBlYXNlICAgICA9IFNldHRpbmdzLmVhc2luZztcblxuICAgIHByb2dyZXNzLm9mZnNldFdpZHRoOyAvKiBSZXBhaW50ICovXG5cbiAgICBxdWV1ZShmdW5jdGlvbihuZXh0KSB7XG4gICAgICAvLyBTZXQgcG9zaXRpb25Vc2luZyBpZiBpdCBoYXNuJ3QgYWxyZWFkeSBiZWVuIHNldFxuICAgICAgaWYgKFNldHRpbmdzLnBvc2l0aW9uVXNpbmcgPT09ICcnKSBTZXR0aW5ncy5wb3NpdGlvblVzaW5nID0gTlByb2dyZXNzLmdldFBvc2l0aW9uaW5nQ1NTKCk7XG5cbiAgICAgIC8vIEFkZCB0cmFuc2l0aW9uXG4gICAgICBjc3MoYmFyLCBiYXJQb3NpdGlvbkNTUyhuLCBzcGVlZCwgZWFzZSkpO1xuXG4gICAgICBpZiAobiA9PT0gMSkge1xuICAgICAgICAvLyBGYWRlIG91dFxuICAgICAgICBjc3MocHJvZ3Jlc3MsIHsgXG4gICAgICAgICAgdHJhbnNpdGlvbjogJ25vbmUnLCBcbiAgICAgICAgICBvcGFjaXR5OiAxIFxuICAgICAgICB9KTtcbiAgICAgICAgcHJvZ3Jlc3Mub2Zmc2V0V2lkdGg7IC8qIFJlcGFpbnQgKi9cblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNzcyhwcm9ncmVzcywgeyBcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgJyArIHNwZWVkICsgJ21zIGxpbmVhcicsIFxuICAgICAgICAgICAgb3BhY2l0eTogMCBcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgTlByb2dyZXNzLnJlbW92ZSgpO1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgIH0sIHNwZWVkKTtcbiAgICAgICAgfSwgc3BlZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dChuZXh0LCBzcGVlZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBOUHJvZ3Jlc3MuaXNTdGFydGVkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBOUHJvZ3Jlc3Muc3RhdHVzID09PSAnbnVtYmVyJztcbiAgfTtcblxuICAvKipcbiAgICogU2hvd3MgdGhlIHByb2dyZXNzIGJhci5cbiAgICogVGhpcyBpcyB0aGUgc2FtZSBhcyBzZXR0aW5nIHRoZSBzdGF0dXMgdG8gMCUsIGV4Y2VwdCB0aGF0IGl0IGRvZXNuJ3QgZ28gYmFja3dhcmRzLlxuICAgKlxuICAgKiAgICAgTlByb2dyZXNzLnN0YXJ0KCk7XG4gICAqXG4gICAqL1xuICBOUHJvZ3Jlc3Muc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIU5Qcm9ncmVzcy5zdGF0dXMpIE5Qcm9ncmVzcy5zZXQoMCk7XG5cbiAgICB2YXIgd29yayA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFOUHJvZ3Jlc3Muc3RhdHVzKSByZXR1cm47XG4gICAgICAgIE5Qcm9ncmVzcy50cmlja2xlKCk7XG4gICAgICAgIHdvcmsoKTtcbiAgICAgIH0sIFNldHRpbmdzLnRyaWNrbGVTcGVlZCk7XG4gICAgfTtcblxuICAgIGlmIChTZXR0aW5ncy50cmlja2xlKSB3b3JrKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKipcbiAgICogSGlkZXMgdGhlIHByb2dyZXNzIGJhci5cbiAgICogVGhpcyBpcyB0aGUgKnNvcnQgb2YqIHRoZSBzYW1lIGFzIHNldHRpbmcgdGhlIHN0YXR1cyB0byAxMDAlLCB3aXRoIHRoZVxuICAgKiBkaWZmZXJlbmNlIGJlaW5nIGBkb25lKClgIG1ha2VzIHNvbWUgcGxhY2VibyBlZmZlY3Qgb2Ygc29tZSByZWFsaXN0aWMgbW90aW9uLlxuICAgKlxuICAgKiAgICAgTlByb2dyZXNzLmRvbmUoKTtcbiAgICpcbiAgICogSWYgYHRydWVgIGlzIHBhc3NlZCwgaXQgd2lsbCBzaG93IHRoZSBwcm9ncmVzcyBiYXIgZXZlbiBpZiBpdHMgaGlkZGVuLlxuICAgKlxuICAgKiAgICAgTlByb2dyZXNzLmRvbmUodHJ1ZSk7XG4gICAqL1xuXG4gIE5Qcm9ncmVzcy5kb25lID0gZnVuY3Rpb24oZm9yY2UpIHtcbiAgICBpZiAoIWZvcmNlICYmICFOUHJvZ3Jlc3Muc3RhdHVzKSByZXR1cm4gdGhpcztcblxuICAgIHJldHVybiBOUHJvZ3Jlc3MuaW5jKDAuMyArIDAuNSAqIE1hdGgucmFuZG9tKCkpLnNldCgxKTtcbiAgfTtcblxuICAvKipcbiAgICogSW5jcmVtZW50cyBieSBhIHJhbmRvbSBhbW91bnQuXG4gICAqL1xuXG4gIE5Qcm9ncmVzcy5pbmMgPSBmdW5jdGlvbihhbW91bnQpIHtcbiAgICB2YXIgbiA9IE5Qcm9ncmVzcy5zdGF0dXM7XG5cbiAgICBpZiAoIW4pIHtcbiAgICAgIHJldHVybiBOUHJvZ3Jlc3Muc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBhbW91bnQgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGFtb3VudCA9ICgxIC0gbikgKiBjbGFtcChNYXRoLnJhbmRvbSgpICogbiwgMC4xLCAwLjk1KTtcbiAgICAgIH1cblxuICAgICAgbiA9IGNsYW1wKG4gKyBhbW91bnQsIDAsIDAuOTk0KTtcbiAgICAgIHJldHVybiBOUHJvZ3Jlc3Muc2V0KG4pO1xuICAgIH1cbiAgfTtcblxuICBOUHJvZ3Jlc3MudHJpY2tsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBOUHJvZ3Jlc3MuaW5jKE1hdGgucmFuZG9tKCkgKiBTZXR0aW5ncy50cmlja2xlUmF0ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciBhbGwgc3VwcGxpZWQgalF1ZXJ5IHByb21pc2VzIGFuZFxuICAgKiBpbmNyZWFzZXMgdGhlIHByb2dyZXNzIGFzIHRoZSBwcm9taXNlcyByZXNvbHZlLlxuICAgKlxuICAgKiBAcGFyYW0gJHByb21pc2UgalFVZXJ5IFByb21pc2VcbiAgICovXG4gIChmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5pdGlhbCA9IDAsIGN1cnJlbnQgPSAwO1xuXG4gICAgTlByb2dyZXNzLnByb21pc2UgPSBmdW5jdGlvbigkcHJvbWlzZSkge1xuICAgICAgaWYgKCEkcHJvbWlzZSB8fCAkcHJvbWlzZS5zdGF0ZSgpID09PSBcInJlc29sdmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50ID09PSAwKSB7XG4gICAgICAgIE5Qcm9ncmVzcy5zdGFydCgpO1xuICAgICAgfVxuXG4gICAgICBpbml0aWFsKys7XG4gICAgICBjdXJyZW50Kys7XG5cbiAgICAgICRwcm9taXNlLmFsd2F5cyhmdW5jdGlvbigpIHtcbiAgICAgICAgY3VycmVudC0tO1xuICAgICAgICBpZiAoY3VycmVudCA9PT0gMCkge1xuICAgICAgICAgICAgaW5pdGlhbCA9IDA7XG4gICAgICAgICAgICBOUHJvZ3Jlc3MuZG9uZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgTlByb2dyZXNzLnNldCgoaW5pdGlhbCAtIGN1cnJlbnQpIC8gaW5pdGlhbCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gIH0pKCk7XG5cbiAgLyoqXG4gICAqIChJbnRlcm5hbCkgcmVuZGVycyB0aGUgcHJvZ3Jlc3MgYmFyIG1hcmt1cCBiYXNlZCBvbiB0aGUgYHRlbXBsYXRlYFxuICAgKiBzZXR0aW5nLlxuICAgKi9cblxuICBOUHJvZ3Jlc3MucmVuZGVyID0gZnVuY3Rpb24oZnJvbVN0YXJ0KSB7XG4gICAgaWYgKE5Qcm9ncmVzcy5pc1JlbmRlcmVkKCkpIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnByb2dyZXNzJyk7XG5cbiAgICBhZGRDbGFzcyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICducHJvZ3Jlc3MtYnVzeScpO1xuICAgIFxuICAgIHZhciBwcm9ncmVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzLmlkID0gJ25wcm9ncmVzcyc7XG4gICAgcHJvZ3Jlc3MuaW5uZXJIVE1MID0gU2V0dGluZ3MudGVtcGxhdGU7XG5cbiAgICB2YXIgYmFyICAgICAgPSBwcm9ncmVzcy5xdWVyeVNlbGVjdG9yKFNldHRpbmdzLmJhclNlbGVjdG9yKSxcbiAgICAgICAgcGVyYyAgICAgPSBmcm9tU3RhcnQgPyAnLTEwMCcgOiB0b0JhclBlcmMoTlByb2dyZXNzLnN0YXR1cyB8fCAwKSxcbiAgICAgICAgcGFyZW50ICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFNldHRpbmdzLnBhcmVudCksXG4gICAgICAgIHNwaW5uZXI7XG4gICAgXG4gICAgY3NzKGJhciwge1xuICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwIGxpbmVhcicsXG4gICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgnICsgcGVyYyArICclLDAsMCknXG4gICAgfSk7XG5cbiAgICBpZiAoIVNldHRpbmdzLnNob3dTcGlubmVyKSB7XG4gICAgICBzcGlubmVyID0gcHJvZ3Jlc3MucXVlcnlTZWxlY3RvcihTZXR0aW5ncy5zcGlubmVyU2VsZWN0b3IpO1xuICAgICAgc3Bpbm5lciAmJiByZW1vdmVFbGVtZW50KHNwaW5uZXIpO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnQgIT0gZG9jdW1lbnQuYm9keSkge1xuICAgICAgYWRkQ2xhc3MocGFyZW50LCAnbnByb2dyZXNzLWN1c3RvbS1wYXJlbnQnKTtcbiAgICB9XG5cbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIHJldHVybiBwcm9ncmVzcztcbiAgfTtcblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZWxlbWVudC4gT3Bwb3NpdGUgb2YgcmVuZGVyKCkuXG4gICAqL1xuXG4gIE5Qcm9ncmVzcy5yZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgICByZW1vdmVDbGFzcyhkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsICducHJvZ3Jlc3MtYnVzeScpO1xuICAgIHJlbW92ZUNsYXNzKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoU2V0dGluZ3MucGFyZW50KSwgJ25wcm9ncmVzcy1jdXN0b20tcGFyZW50Jyk7XG4gICAgdmFyIHByb2dyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25wcm9ncmVzcycpO1xuICAgIHByb2dyZXNzICYmIHJlbW92ZUVsZW1lbnQocHJvZ3Jlc3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIHByb2dyZXNzIGJhciBpcyByZW5kZXJlZC5cbiAgICovXG5cbiAgTlByb2dyZXNzLmlzUmVuZGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gISFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbnByb2dyZXNzJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIERldGVybWluZSB3aGljaCBwb3NpdGlvbmluZyBDU1MgcnVsZSB0byB1c2UuXG4gICAqL1xuXG4gIE5Qcm9ncmVzcy5nZXRQb3NpdGlvbmluZ0NTUyA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFNuaWZmIG9uIGRvY3VtZW50LmJvZHkuc3R5bGVcbiAgICB2YXIgYm9keVN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcblxuICAgIC8vIFNuaWZmIHByZWZpeGVzXG4gICAgdmFyIHZlbmRvclByZWZpeCA9ICgnV2Via2l0VHJhbnNmb3JtJyBpbiBib2R5U3R5bGUpID8gJ1dlYmtpdCcgOlxuICAgICAgICAgICAgICAgICAgICAgICAoJ01velRyYW5zZm9ybScgaW4gYm9keVN0eWxlKSA/ICdNb3onIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKCdtc1RyYW5zZm9ybScgaW4gYm9keVN0eWxlKSA/ICdtcycgOlxuICAgICAgICAgICAgICAgICAgICAgICAoJ09UcmFuc2Zvcm0nIGluIGJvZHlTdHlsZSkgPyAnTycgOiAnJztcblxuICAgIGlmICh2ZW5kb3JQcmVmaXggKyAnUGVyc3BlY3RpdmUnIGluIGJvZHlTdHlsZSkge1xuICAgICAgLy8gTW9kZXJuIGJyb3dzZXJzIHdpdGggM0Qgc3VwcG9ydCwgZS5nLiBXZWJraXQsIElFMTBcbiAgICAgIHJldHVybiAndHJhbnNsYXRlM2QnO1xuICAgIH0gZWxzZSBpZiAodmVuZG9yUHJlZml4ICsgJ1RyYW5zZm9ybScgaW4gYm9keVN0eWxlKSB7XG4gICAgICAvLyBCcm93c2VycyB3aXRob3V0IDNEIHN1cHBvcnQsIGUuZy4gSUU5XG4gICAgICByZXR1cm4gJ3RyYW5zbGF0ZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJyb3dzZXJzIHdpdGhvdXQgdHJhbnNsYXRlKCkgc3VwcG9ydCwgZS5nLiBJRTctOFxuICAgICAgcmV0dXJuICdtYXJnaW4nO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSGVscGVyc1xuICAgKi9cblxuICBmdW5jdGlvbiBjbGFtcChuLCBtaW4sIG1heCkge1xuICAgIGlmIChuIDwgbWluKSByZXR1cm4gbWluO1xuICAgIGlmIChuID4gbWF4KSByZXR1cm4gbWF4O1xuICAgIHJldHVybiBuO1xuICB9XG5cbiAgLyoqXG4gICAqIChJbnRlcm5hbCkgY29udmVydHMgYSBwZXJjZW50YWdlIChgMC4uMWApIHRvIGEgYmFyIHRyYW5zbGF0ZVhcbiAgICogcGVyY2VudGFnZSAoYC0xMDAlLi4wJWApLlxuICAgKi9cblxuICBmdW5jdGlvbiB0b0JhclBlcmMobikge1xuICAgIHJldHVybiAoLTEgKyBuKSAqIDEwMDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIChJbnRlcm5hbCkgcmV0dXJucyB0aGUgY29ycmVjdCBDU1MgZm9yIGNoYW5naW5nIHRoZSBiYXInc1xuICAgKiBwb3NpdGlvbiBnaXZlbiBhbiBuIHBlcmNlbnRhZ2UsIGFuZCBzcGVlZCBhbmQgZWFzZSBmcm9tIFNldHRpbmdzXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGJhclBvc2l0aW9uQ1NTKG4sIHNwZWVkLCBlYXNlKSB7XG4gICAgdmFyIGJhckNTUztcblxuICAgIGlmIChTZXR0aW5ncy5wb3NpdGlvblVzaW5nID09PSAndHJhbnNsYXRlM2QnKSB7XG4gICAgICBiYXJDU1MgPSB7IHRyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKCcrdG9CYXJQZXJjKG4pKyclLDAsMCknIH07XG4gICAgfSBlbHNlIGlmIChTZXR0aW5ncy5wb3NpdGlvblVzaW5nID09PSAndHJhbnNsYXRlJykge1xuICAgICAgYmFyQ1NTID0geyB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoJyt0b0JhclBlcmMobikrJyUsMCknIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhckNTUyA9IHsgJ21hcmdpbi1sZWZ0JzogdG9CYXJQZXJjKG4pKyclJyB9O1xuICAgIH1cblxuICAgIGJhckNTUy50cmFuc2l0aW9uID0gJ2FsbCAnK3NwZWVkKydtcyAnK2Vhc2U7XG5cbiAgICByZXR1cm4gYmFyQ1NTO1xuICB9XG5cbiAgLyoqXG4gICAqIChJbnRlcm5hbCkgUXVldWVzIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXG4gICAqL1xuXG4gIHZhciBxdWV1ZSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGVuZGluZyA9IFtdO1xuICAgIFxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB2YXIgZm4gPSBwZW5kaW5nLnNoaWZ0KCk7XG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgZm4obmV4dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7XG4gICAgICBwZW5kaW5nLnB1c2goZm4pO1xuICAgICAgaWYgKHBlbmRpbmcubGVuZ3RoID09IDEpIG5leHQoKTtcbiAgICB9O1xuICB9KSgpO1xuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIEFwcGxpZXMgY3NzIHByb3BlcnRpZXMgdG8gYW4gZWxlbWVudCwgc2ltaWxhciB0byB0aGUgalF1ZXJ5IFxuICAgKiBjc3MgbWV0aG9kLlxuICAgKlxuICAgKiBXaGlsZSB0aGlzIGhlbHBlciBkb2VzIGFzc2lzdCB3aXRoIHZlbmRvciBwcmVmaXhlZCBwcm9wZXJ0eSBuYW1lcywgaXQgXG4gICAqIGRvZXMgbm90IHBlcmZvcm0gYW55IG1hbmlwdWxhdGlvbiBvZiB2YWx1ZXMgcHJpb3IgdG8gc2V0dGluZyBzdHlsZXMuXG4gICAqL1xuXG4gIHZhciBjc3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNzc1ByZWZpeGVzID0gWyAnV2Via2l0JywgJ08nLCAnTW96JywgJ21zJyBdLFxuICAgICAgICBjc3NQcm9wcyAgICA9IHt9O1xuXG4gICAgZnVuY3Rpb24gY2FtZWxDYXNlKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9eLW1zLS8sICdtcy0nKS5yZXBsYWNlKC8tKFtcXGRhLXpdKS9naSwgZnVuY3Rpb24obWF0Y2gsIGxldHRlcikge1xuICAgICAgICByZXR1cm4gbGV0dGVyLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRWZW5kb3JQcm9wKG5hbWUpIHtcbiAgICAgIHZhciBzdHlsZSA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XG4gICAgICBpZiAobmFtZSBpbiBzdHlsZSkgcmV0dXJuIG5hbWU7XG5cbiAgICAgIHZhciBpID0gY3NzUHJlZml4ZXMubGVuZ3RoLFxuICAgICAgICAgIGNhcE5hbWUgPSBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKSxcbiAgICAgICAgICB2ZW5kb3JOYW1lO1xuICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICB2ZW5kb3JOYW1lID0gY3NzUHJlZml4ZXNbaV0gKyBjYXBOYW1lO1xuICAgICAgICBpZiAodmVuZG9yTmFtZSBpbiBzdHlsZSkgcmV0dXJuIHZlbmRvck5hbWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0eWxlUHJvcChuYW1lKSB7XG4gICAgICBuYW1lID0gY2FtZWxDYXNlKG5hbWUpO1xuICAgICAgcmV0dXJuIGNzc1Byb3BzW25hbWVdIHx8IChjc3NQcm9wc1tuYW1lXSA9IGdldFZlbmRvclByb3AobmFtZSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFwcGx5Q3NzKGVsZW1lbnQsIHByb3AsIHZhbHVlKSB7XG4gICAgICBwcm9wID0gZ2V0U3R5bGVQcm9wKHByb3ApO1xuICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihlbGVtZW50LCBwcm9wZXJ0aWVzKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBwcm9wLCBcbiAgICAgICAgICB2YWx1ZTtcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09IDIpIHtcbiAgICAgICAgZm9yIChwcm9wIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICB2YWx1ZSA9IHByb3BlcnRpZXNbcHJvcF07XG4gICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkgYXBwbHlDc3MoZWxlbWVudCwgcHJvcCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBseUNzcyhlbGVtZW50LCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pKCk7XG5cbiAgLyoqXG4gICAqIChJbnRlcm5hbCkgRGV0ZXJtaW5lcyBpZiBhbiBlbGVtZW50IG9yIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGNsYXNzIG5hbWVzIGNvbnRhaW5zIGEgY2xhc3MgbmFtZS5cbiAgICovXG5cbiAgZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgbmFtZSkge1xuICAgIHZhciBsaXN0ID0gdHlwZW9mIGVsZW1lbnQgPT0gJ3N0cmluZycgPyBlbGVtZW50IDogY2xhc3NMaXN0KGVsZW1lbnQpO1xuICAgIHJldHVybiBsaXN0LmluZGV4T2YoJyAnICsgbmFtZSArICcgJykgPj0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50LlxuICAgKi9cblxuICBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50LCBuYW1lKSB7XG4gICAgdmFyIG9sZExpc3QgPSBjbGFzc0xpc3QoZWxlbWVudCksXG4gICAgICAgIG5ld0xpc3QgPSBvbGRMaXN0ICsgbmFtZTtcblxuICAgIGlmIChoYXNDbGFzcyhvbGRMaXN0LCBuYW1lKSkgcmV0dXJuOyBcblxuICAgIC8vIFRyaW0gdGhlIG9wZW5pbmcgc3BhY2UuXG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBuZXdMaXN0LnN1YnN0cmluZygxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIFJlbW92ZXMgYSBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQsIG5hbWUpIHtcbiAgICB2YXIgb2xkTGlzdCA9IGNsYXNzTGlzdChlbGVtZW50KSxcbiAgICAgICAgbmV3TGlzdDtcblxuICAgIGlmICghaGFzQ2xhc3MoZWxlbWVudCwgbmFtZSkpIHJldHVybjtcblxuICAgIC8vIFJlcGxhY2UgdGhlIGNsYXNzIG5hbWUuXG4gICAgbmV3TGlzdCA9IG9sZExpc3QucmVwbGFjZSgnICcgKyBuYW1lICsgJyAnLCAnICcpO1xuXG4gICAgLy8gVHJpbSB0aGUgb3BlbmluZyBhbmQgY2xvc2luZyBzcGFjZXMuXG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBuZXdMaXN0LnN1YnN0cmluZygxLCBuZXdMaXN0Lmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIChJbnRlcm5hbCkgR2V0cyBhIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIHRoZSBjbGFzcyBuYW1lcyBvbiB0aGUgZWxlbWVudC4gXG4gICAqIFRoZSBsaXN0IGlzIHdyYXBwZWQgd2l0aCBhIHNpbmdsZSBzcGFjZSBvbiBlYWNoIGVuZCB0byBmYWNpbGl0YXRlIGZpbmRpbmcgXG4gICAqIG1hdGNoZXMgd2l0aGluIHRoZSBsaXN0LlxuICAgKi9cblxuICBmdW5jdGlvbiBjbGFzc0xpc3QoZWxlbWVudCkge1xuICAgIHJldHVybiAoJyAnICsgKGVsZW1lbnQuY2xhc3NOYW1lIHx8ICcnKSArICcgJykucmVwbGFjZSgvXFxzKy9naSwgJyAnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoSW50ZXJuYWwpIFJlbW92ZXMgYW4gZWxlbWVudCBmcm9tIHRoZSBET00uXG4gICAqL1xuXG4gIGZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoZWxlbWVudCkge1xuICAgIGVsZW1lbnQgJiYgZWxlbWVudC5wYXJlbnROb2RlICYmIGVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBOUHJvZ3Jlc3M7XG59KTtcblxuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFyZ2V0XCIpO1xuXG4gICAgZm9ybS5tZXRob2QgPSAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSA9PT0gXCJnZXRcIikgPyBcImdldFwiIDogXCJwb3N0XCI7XG4gICAgZm9ybS5hY3Rpb24gPSB0bztcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcImhpZGRlblwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gICAgZm9ybS5zdWJtaXQoKTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBwaG9lbml4TGlua0V2ZW50ID0gbmV3IFBvbHlmaWxsRXZlbnQoJ3Bob2VuaXgubGluay5jbGljaycsIHtcbiAgICAgICAgXCJidWJibGVzXCI6IHRydWUsIFwiY2FuY2VsYWJsZVwiOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFlbGVtZW50LmRpc3BhdGNoRXZlbnQocGhvZW5peExpbmtFdmVudCkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgZ2xvYmFsXG5leHBvcnQgY29uc3QgREVGQVVMVF9WU04gPSBcIjIuMC4wXCJcbmV4cG9ydCBjb25zdCBTT0NLRVRfU1RBVEVTID0ge2Nvbm5lY3Rpbmc6IDAsIG9wZW46IDEsIGNsb3Npbmc6IDIsIGNsb3NlZDogM31cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVQgPSAxMDAwMFxuZXhwb3J0IGNvbnN0IFdTX0NMT1NFX05PUk1BTCA9IDEwMDBcbmV4cG9ydCBjb25zdCBDSEFOTkVMX1NUQVRFUyA9IHtcbiAgY2xvc2VkOiBcImNsb3NlZFwiLFxuICBlcnJvcmVkOiBcImVycm9yZWRcIixcbiAgam9pbmVkOiBcImpvaW5lZFwiLFxuICBqb2luaW5nOiBcImpvaW5pbmdcIixcbiAgbGVhdmluZzogXCJsZWF2aW5nXCIsXG59XG5leHBvcnQgY29uc3QgQ0hBTk5FTF9FVkVOVFMgPSB7XG4gIGNsb3NlOiBcInBoeF9jbG9zZVwiLFxuICBlcnJvcjogXCJwaHhfZXJyb3JcIixcbiAgam9pbjogXCJwaHhfam9pblwiLFxuICByZXBseTogXCJwaHhfcmVwbHlcIixcbiAgbGVhdmU6IFwicGh4X2xlYXZlXCJcbn1cblxuZXhwb3J0IGNvbnN0IFRSQU5TUE9SVFMgPSB7XG4gIGxvbmdwb2xsOiBcImxvbmdwb2xsXCIsXG4gIHdlYnNvY2tldDogXCJ3ZWJzb2NrZXRcIlxufVxuZXhwb3J0IGNvbnN0IFhIUl9TVEFURVMgPSB7XG4gIGNvbXBsZXRlOiA0XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHVzaFxuICogQHBhcmFtIHtDaGFubmVsfSBjaGFubmVsIC0gVGhlIENoYW5uZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIFRoZSBldmVudCwgZm9yIGV4YW1wbGUgYFwicGh4X2pvaW5cImBcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvYWQsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogMTIzfWBcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gVGhlIHB1c2ggdGltZW91dCBpbiBtaWxsaXNlY29uZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVzaCB7XG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIGV2ZW50LCBwYXlsb2FkLCB0aW1lb3V0KXtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgdGhpcy5ldmVudCA9IGV2ZW50XG4gICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZCB8fCBmdW5jdGlvbiAoKXsgcmV0dXJuIHt9IH1cbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gICAgdGhpcy5yZWNIb29rcyA9IFtdXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKi9cbiAgcmVzZW5kKHRpbWVvdXQpe1xuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnJlc2V0KClcbiAgICB0aGlzLnNlbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBzZW5kKCl7XG4gICAgaWYodGhpcy5oYXNSZWNlaXZlZChcInRpbWVvdXRcIikpeyByZXR1cm4gfVxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KClcbiAgICB0aGlzLnNlbnQgPSB0cnVlXG4gICAgdGhpcy5jaGFubmVsLnNvY2tldC5wdXNoKHtcbiAgICAgIHRvcGljOiB0aGlzLmNoYW5uZWwudG9waWMsXG4gICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgIHBheWxvYWQ6IHRoaXMucGF5bG9hZCgpLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIGpvaW5fcmVmOiB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHN0YXR1c1xuICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAqL1xuICByZWNlaXZlKHN0YXR1cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoc3RhdHVzKSl7XG4gICAgICBjYWxsYmFjayh0aGlzLnJlY2VpdmVkUmVzcC5yZXNwb25zZSlcbiAgICB9XG5cbiAgICB0aGlzLnJlY0hvb2tzLnB1c2goe3N0YXR1cywgY2FsbGJhY2t9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCl7XG4gICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgdGhpcy5yZWYgPSBudWxsXG4gICAgdGhpcy5yZWZFdmVudCA9IG51bGxcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnNlbnQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYXRjaFJlY2VpdmUoe3N0YXR1cywgcmVzcG9uc2UsIF9yZWZ9KXtcbiAgICB0aGlzLnJlY0hvb2tzLmZpbHRlcihoID0+IGguc3RhdHVzID09PSBzdGF0dXMpXG4gICAgICAuZm9yRWFjaChoID0+IGguY2FsbGJhY2socmVzcG9uc2UpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxSZWZFdmVudCgpe1xuICAgIGlmKCF0aGlzLnJlZkV2ZW50KXsgcmV0dXJuIH1cbiAgICB0aGlzLmNoYW5uZWwub2ZmKHRoaXMucmVmRXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFRpbWVvdXQoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0VGltZXIpXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0VGltZW91dCgpe1xuICAgIGlmKHRoaXMudGltZW91dFRpbWVyKXsgdGhpcy5jYW5jZWxUaW1lb3V0KCkgfVxuICAgIHRoaXMucmVmID0gdGhpcy5jaGFubmVsLnNvY2tldC5tYWtlUmVmKClcbiAgICB0aGlzLnJlZkV2ZW50ID0gdGhpcy5jaGFubmVsLnJlcGx5RXZlbnROYW1lKHRoaXMucmVmKVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKHRoaXMucmVmRXZlbnQsIHBheWxvYWQgPT4ge1xuICAgICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgICB0aGlzLmNhbmNlbFRpbWVvdXQoKVxuICAgICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBwYXlsb2FkXG4gICAgICB0aGlzLm1hdGNoUmVjZWl2ZShwYXlsb2FkKVxuICAgIH0pXG5cbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKFwidGltZW91dFwiLCB7fSlcbiAgICB9LCB0aGlzLnRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhc1JlY2VpdmVkKHN0YXR1cyl7XG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXIoc3RhdHVzLCByZXNwb25zZSl7XG4gICAgdGhpcy5jaGFubmVsLnRyaWdnZXIodGhpcy5yZWZFdmVudCwge3N0YXR1cywgcmVzcG9uc2V9KVxuICB9XG59XG4iLCAiLyoqXG4gKlxuICogQ3JlYXRlcyBhIHRpbWVyIHRoYXQgYWNjZXB0cyBhIGB0aW1lckNhbGNgIGZ1bmN0aW9uIHRvIHBlcmZvcm1cbiAqIGNhbGN1bGF0ZWQgdGltZW91dCByZXRyaWVzLCBzdWNoIGFzIGV4cG9uZW50aWFsIGJhY2tvZmYuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCByZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB0aGlzLmNvbm5lY3QoKSwgZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwMDAsIDUwMDAsIDEwMDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9KVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgNTAwMFxuICogcmVjb25uZWN0VGltZXIucmVzZXQoKVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aW1lckNhbGNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgdGltZXJDYWxjKXtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLnRpbWVyQ2FsYyA9IHRpbWVyQ2FsY1xuICAgIHRoaXMudGltZXIgPSBudWxsXG4gICAgdGhpcy50cmllcyA9IDBcbiAgfVxuXG4gIHJlc2V0KCl7XG4gICAgdGhpcy50cmllcyA9IDBcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGFueSBwcmV2aW91cyBzY2hlZHVsZVRpbWVvdXQgYW5kIHNjaGVkdWxlcyBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG5cbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWVzID0gdGhpcy50cmllcyArIDFcbiAgICAgIHRoaXMuY2FsbGJhY2soKVxuICAgIH0sIHRoaXMudGltZXJDYWxjKHRoaXMudHJpZXMgKyAxKSlcbiAgfVxufVxuIiwgImltcG9ydCB7Y2xvc3VyZX0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHtcbiAgQ0hBTk5FTF9FVkVOVFMsXG4gIENIQU5ORUxfU1RBVEVTLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgUHVzaCBmcm9tIFwiLi9wdXNoXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gcGFyYW1zXG4gKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWwge1xuICBjb25zdHJ1Y3Rvcih0b3BpYywgcGFyYW1zLCBzb2NrZXQpe1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWRcbiAgICB0aGlzLnRvcGljID0gdG9waWNcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUocGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdXG4gICAgdGhpcy5iaW5kaW5nUmVmID0gMFxuICAgIHRoaXMudGltZW91dCA9IHRoaXMuc29ja2V0LnRpbWVvdXRcbiAgICB0aGlzLmpvaW5lZE9uY2UgPSBmYWxzZVxuICAgIHRoaXMuam9pblB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5qb2luLCB0aGlzLnBhcmFtcywgdGhpcy50aW1lb3V0KVxuICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMgPSBbXVxuXG4gICAgdGhpcy5yZWpvaW5UaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSwgdGhpcy5zb2NrZXQucmVqb2luQWZ0ZXJNcylcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uRXJyb3IoKCkgPT4gdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpKSlcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuaXNFcnJvcmVkKCkpeyB0aGlzLnJlam9pbigpIH1cbiAgICB9KVxuICAgIClcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmVkXG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5mb3JFYWNoKHB1c2hFdmVudCA9PiBwdXNoRXZlbnQuc2VuZCgpKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyID0gW11cbiAgICB9KVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcImVycm9yXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uQ2xvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgY2xvc2UgJHt0aGlzLnRvcGljfSAke3RoaXMuam9pblJlZigpfWApXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgICB0aGlzLnNvY2tldC5yZW1vdmUodGhpcylcbiAgICB9KVxuICAgIHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGVycm9yICR7dGhpcy50b3BpY31gLCByZWFzb24pXG4gICAgICBpZih0aGlzLmlzSm9pbmluZygpKXsgdGhpcy5qb2luUHVzaC5yZXNldCgpIH1cbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGB0aW1lb3V0ICR7dGhpcy50b3BpY30gKCR7dGhpcy5qb2luUmVmKCl9KWAsIHRoaXMuam9pblB1c2gudGltZW91dClcbiAgICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRoaXMudGltZW91dClcbiAgICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICB0aGlzLmpvaW5QdXNoLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMucmVwbHksIChwYXlsb2FkLCByZWYpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcih0aGlzLnJlcGx5RXZlbnROYW1lKHJlZiksIHBheWxvYWQpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBKb2luIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgaWYodGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInRyaWVkIHRvIGpvaW4gbXVsdGlwbGUgdGltZXMuICdqb2luJyBjYW4gb25seSBiZSBjYWxsZWQgYSBzaW5nbGUgdGltZSBwZXIgY2hhbm5lbCBpbnN0YW5jZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlXG4gICAgICB0aGlzLnJlam9pbigpXG4gICAgICByZXR1cm4gdGhpcy5qb2luUHVzaFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIb29rIGludG8gY2hhbm5lbCBjbG9zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjayl7XG4gICAgdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgZXJyb3JzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkVycm9yKGNhbGxiYWNrKXtcbiAgICByZXR1cm4gdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5lcnJvciwgcmVhc29uID0+IGNhbGxiYWNrKHJlYXNvbikpXG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBvbiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBTdWJzY3JpcHRpb24gcmV0dXJucyBhIHJlZiBjb3VudGVyLCB3aGljaCBjYW4gYmUgdXNlZCBsYXRlciB0b1xuICAgKiB1bnN1YnNjcmliZSB0aGUgZXhhY3QgZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY29uc3QgcmVmMiA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19vdGhlcl9zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKiAvLyBTaW5jZSB1bnN1YnNjcmlwdGlvbiwgZG9fc3R1ZmYgd29uJ3QgZmlyZSxcbiAgICogLy8gd2hpbGUgZG9fb3RoZXJfc3R1ZmYgd2lsbCBrZWVwIGZpcmluZyBvbiB0aGUgXCJldmVudFwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLmJpbmRpbmdSZWYrK1xuICAgIHRoaXMuYmluZGluZ3MucHVzaCh7ZXZlbnQsIHJlZiwgY2FsbGJhY2t9KVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZXMgb2ZmIG9mIGNoYW5uZWwgZXZlbnRzXG4gICAqXG4gICAqIFVzZSB0aGUgcmVmIHJldHVybmVkIGZyb20gYSBjaGFubmVsLm9uKCkgdG8gdW5zdWJzY3JpYmUgb25lXG4gICAqIGhhbmRsZXIsIG9yIHBhc3Mgbm90aGluZyBmb3IgdGhlIHJlZiB0byB1bnN1YnNjcmliZSBhbGxcbiAgICogaGFuZGxlcnMgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gVW5zdWJzY3JpYmUgdGhlIGRvX3N0dWZmIGhhbmRsZXJcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKlxuICAgKiAvLyBVbnN1YnNjcmliZSBhbGwgaGFuZGxlcnMgZnJvbSBldmVudFxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb2ZmKGV2ZW50LCByZWYpe1xuICAgIHRoaXMuYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcigoYmluZCkgPT4ge1xuICAgICAgcmV0dXJuICEoYmluZC5ldmVudCA9PT0gZXZlbnQgJiYgKHR5cGVvZiByZWYgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVmID09PSBiaW5kLnJlZikpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuUHVzaCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzSm9pbmVkKCkgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgYGV2ZW50YCB0byBwaG9lbml4IHdpdGggdGhlIHBheWxvYWQgYHBheWxvYWRgLlxuICAgKiBQaG9lbml4IHJlY2VpdmVzIHRoaXMgaW4gdGhlIGBoYW5kbGVfaW4oZXZlbnQsIHBheWxvYWQsIHNvY2tldClgXG4gICAqIGZ1bmN0aW9uLiBpZiBwaG9lbml4IHJlcGxpZXMgb3IgaXQgdGltZXMgb3V0IChkZWZhdWx0IDEwMDAwbXMpLFxuICAgKiB0aGVuIG9wdGlvbmFsbHkgdGhlIHJlcGx5IGNhbiBiZSByZWNlaXZlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY2hhbm5lbC5wdXNoKFwiZXZlbnRcIilcbiAgICogICAucmVjZWl2ZShcIm9rXCIsIHBheWxvYWQgPT4gY29uc29sZS5sb2coXCJwaG9lbml4IHJlcGxpZWQ6XCIsIHBheWxvYWQpKVxuICAgKiAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgZXJyID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCBlcnJvcmVkXCIsIGVycikpXG4gICAqICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IGNvbnNvbGUubG9nKFwidGltZWQgb3V0IHB1c2hpbmdcIikpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVvdXRdXG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgcHVzaChldmVudCwgcGF5bG9hZCwgdGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgcGF5bG9hZCA9IHBheWxvYWQgfHwge31cbiAgICBpZighdGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHJpZWQgdG8gcHVzaCAnJHtldmVudH0nIHRvICcke3RoaXMudG9waWN9JyBiZWZvcmUgam9pbmluZy4gVXNlIGNoYW5uZWwuam9pbigpIGJlZm9yZSBwdXNoaW5nIGV2ZW50c2ApXG4gICAgfVxuICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgZnVuY3Rpb24gKCl7IHJldHVybiBwYXlsb2FkIH0sIHRpbWVvdXQpXG4gICAgaWYodGhpcy5jYW5QdXNoKCkpe1xuICAgICAgcHVzaEV2ZW50LnNlbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoRXZlbnQuc3RhcnRUaW1lb3V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5wdXNoKHB1c2hFdmVudClcbiAgICB9XG5cbiAgICByZXR1cm4gcHVzaEV2ZW50XG4gIH1cblxuICAvKiogTGVhdmVzIHRoZSBjaGFubmVsXG4gICAqXG4gICAqIFVuc3Vic2NyaWJlcyBmcm9tIHNlcnZlciBldmVudHMsIGFuZFxuICAgKiBpbnN0cnVjdHMgY2hhbm5lbCB0byB0ZXJtaW5hdGUgb24gc2VydmVyXG4gICAqXG4gICAqIFRyaWdnZXJzIG9uQ2xvc2UoKSBob29rc1xuICAgKlxuICAgKiBUbyByZWNlaXZlIGxlYXZlIGFja25vd2xlZGdlbWVudHMsIHVzZSB0aGUgYHJlY2VpdmVgXG4gICAqIGhvb2sgdG8gYmluZCB0byB0aGUgc2VydmVyIGFjaywgaWU6XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwubGVhdmUoKS5yZWNlaXZlKFwib2tcIiwgKCkgPT4gYWxlcnQoXCJsZWZ0IVwiKSApXG4gICAqXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGxlYXZlKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgIHRoaXMuam9pblB1c2guY2FuY2VsVGltZW91dCgpXG5cbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMubGVhdmluZ1xuICAgIGxldCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGxlYXZlICR7dGhpcy50b3BpY31gKVxuICAgICAgdGhpcy50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBcImxlYXZlXCIpXG4gICAgfVxuICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRpbWVvdXQpXG4gICAgbGVhdmVQdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiBvbkNsb3NlKCkpXG4gICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICBpZighdGhpcy5jYW5QdXNoKCkpeyBsZWF2ZVB1c2gudHJpZ2dlcihcIm9rXCIsIHt9KSB9XG5cbiAgICByZXR1cm4gbGVhdmVQdXNoXG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGFibGUgbWVzc2FnZSBob29rXG4gICAqXG4gICAqIFJlY2VpdmVzIGFsbCBldmVudHMgZm9yIHNwZWNpYWxpemVkIG1lc3NhZ2UgaGFuZGxpbmdcbiAgICogYmVmb3JlIGRpc3BhdGNoaW5nIHRvIHRoZSBjaGFubmVsIGNhbGxiYWNrcy5cbiAgICpcbiAgICogTXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gcmVmXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBvbk1lc3NhZ2UoX2V2ZW50LCBwYXlsb2FkLCBfcmVmKXsgcmV0dXJuIHBheWxvYWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmKXtcbiAgICBpZih0aGlzLnRvcGljICE9PSB0b3BpYyl7IHJldHVybiBmYWxzZSB9XG5cbiAgICBpZihqb2luUmVmICYmIGpvaW5SZWYgIT09IHRoaXMuam9pblJlZigpKXtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIFwiZHJvcHBpbmcgb3V0ZGF0ZWQgbWVzc2FnZVwiLCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgam9pblJlZigpeyByZXR1cm4gdGhpcy5qb2luUHVzaC5yZWYgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuaXNMZWF2aW5nKCkpeyByZXR1cm4gfVxuICAgIHRoaXMuc29ja2V0LmxlYXZlT3BlblRvcGljKHRoaXMudG9waWMpXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5pbmdcbiAgICB0aGlzLmpvaW5QdXNoLnJlc2VuZCh0aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpe1xuICAgIGxldCBoYW5kbGVkUGF5bG9hZCA9IHRoaXMub25NZXNzYWdlKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpXG4gICAgaWYocGF5bG9hZCAmJiAhaGFuZGxlZFBheWxvYWQpeyB0aHJvdyBuZXcgRXJyb3IoXCJjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcIikgfVxuXG4gICAgbGV0IGV2ZW50QmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcihiaW5kID0+IGJpbmQuZXZlbnQgPT09IGV2ZW50KVxuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGV2ZW50QmluZGluZ3MubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJpbmQgPSBldmVudEJpbmRpbmdzW2ldXG4gICAgICBiaW5kLmNhbGxiYWNrKGhhbmRsZWRQYXlsb2FkLCByZWYsIGpvaW5SZWYgfHwgdGhpcy5qb2luUmVmKCkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXBseUV2ZW50TmFtZShyZWYpeyByZXR1cm4gYGNoYW5fcmVwbHlfJHtyZWZ9YCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Nsb3NlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzRXJyb3JlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5lZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmVkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmluZygpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmluZyB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0xlYXZpbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmxlYXZpbmcgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgWEhSX1NUQVRFU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBamF4IHtcblxuICBzdGF0aWMgcmVxdWVzdChtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIGlmKGdsb2JhbC5YRG9tYWluUmVxdWVzdCl7XG4gICAgICBsZXQgcmVxID0gbmV3IGdsb2JhbC5YRG9tYWluUmVxdWVzdCgpIC8vIElFOCwgSUU5XG4gICAgICByZXR1cm4gdGhpcy54ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCkgLy8gSUU3KywgRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB4ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dFxuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQpXG4gICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGxldCByZXNwb25zZSA9IHRoaXMucGFyc2VKU09OKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwb25zZSlcbiAgICB9XG4gICAgaWYob250aW1lb3V0KXsgcmVxLm9udGltZW91dCA9IG9udGltZW91dCB9XG5cbiAgICAvLyBXb3JrIGFyb3VuZCBidWcgaW4gSUU5IHRoYXQgcmVxdWlyZXMgYW4gYXR0YWNoZWQgb25wcm9ncmVzcyBoYW5kbGVyXG4gICAgcmVxLm9ucHJvZ3Jlc3MgPSAoKSA9PiB7IH1cblxuICAgIHJlcS5zZW5kKGJvZHkpXG4gICAgcmV0dXJuIHJlcVxuICB9XG5cbiAgc3RhdGljIHhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQsIHRydWUpXG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgYWNjZXB0KVxuICAgIHJlcS5vbmVycm9yID0gKCkgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbClcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYocmVxLnJlYWR5U3RhdGUgPT09IFhIUl9TVEFURVMuY29tcGxldGUgJiYgY2FsbGJhY2spe1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgICBjYWxsYmFjayhyZXNwb25zZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYob250aW1lb3V0KXsgcmVxLm9udGltZW91dCA9IG9udGltZW91dCB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICAgIHJldHVybiByZXFcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZUpTT04ocmVzcCl7XG4gICAgaWYoIXJlc3AgfHwgcmVzcCA9PT0gXCJcIil7IHJldHVybiBudWxsIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXNwKVxuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlXCIsIHJlc3ApXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemUob2JqLCBwYXJlbnRLZXkpe1xuICAgIGxldCBxdWVyeVN0ciA9IFtdXG4gICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgIGlmKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKXsgY29udGludWUgfVxuICAgICAgbGV0IHBhcmFtS2V5ID0gcGFyZW50S2V5ID8gYCR7cGFyZW50S2V5fVske2tleX1dYCA6IGtleVxuICAgICAgbGV0IHBhcmFtVmFsID0gb2JqW2tleV1cbiAgICAgIGlmKHR5cGVvZiBwYXJhbVZhbCA9PT0gXCJvYmplY3RcIil7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2godGhpcy5zZXJpYWxpemUocGFyYW1WYWwsIHBhcmFtS2V5KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtVmFsKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5U3RyLmpvaW4oXCImXCIpXG4gIH1cblxuICBzdGF0aWMgYXBwZW5kUGFyYW1zKHVybCwgcGFyYW1zKXtcbiAgICBpZihPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCl7IHJldHVybiB1cmwgfVxuXG4gICAgbGV0IHByZWZpeCA9IHVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiXG4gICAgcmV0dXJuIGAke3VybH0ke3ByZWZpeH0ke3RoaXMuc2VyaWFsaXplKHBhcmFtcyl9YFxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgQWpheCBmcm9tIFwiLi9hamF4XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9uZ1BvbGwge1xuXG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50KXtcbiAgICB0aGlzLmVuZFBvaW50ID0gbnVsbFxuICAgIHRoaXMudG9rZW4gPSBudWxsXG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZVxuICAgIHRoaXMucmVxcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25lcnJvciA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5wb2xsRW5kcG9pbnQgPSB0aGlzLm5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZ1xuICAgIHRoaXMucG9sbCgpXG4gIH1cblxuICBub3JtYWxpemVFbmRwb2ludChlbmRQb2ludCl7XG4gICAgcmV0dXJuIChlbmRQb2ludFxuICAgICAgLnJlcGxhY2UoXCJ3czovL1wiLCBcImh0dHA6Ly9cIilcbiAgICAgIC5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIilcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoLiopXFwvXCIgKyBUUkFOU1BPUlRTLndlYnNvY2tldCksIFwiJDEvXCIgKyBUUkFOU1BPUlRTLmxvbmdwb2xsKSlcbiAgfVxuXG4gIGVuZHBvaW50VVJMKCl7XG4gICAgcmV0dXJuIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMucG9sbEVuZHBvaW50LCB7dG9rZW46IHRoaXMudG9rZW59KVxuICB9XG5cbiAgY2xvc2VBbmRSZXRyeShjb2RlLCByZWFzb24sIHdhc0NsZWFuKXtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gIH1cblxuICBvbnRpbWVvdXQoKXtcbiAgICB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpXG4gICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMDUsIFwidGltZW91dFwiLCBmYWxzZSlcbiAgfVxuXG4gIGlzQWN0aXZlKCl7IHJldHVybiB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMub3BlbiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZyB9XG5cbiAgcG9sbCgpe1xuICAgIHRoaXMuYWpheChcIkdFVFwiLCBudWxsLCAoKSA9PiB0aGlzLm9udGltZW91dCgpLCByZXNwID0+IHtcbiAgICAgIGlmKHJlc3Ape1xuICAgICAgICB2YXIge3N0YXR1cywgdG9rZW4sIG1lc3NhZ2VzfSA9IHJlc3BcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSAwXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaChzdGF0dXMpe1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgICAgICAvLyBUYXNrcyBhcmUgd2hhdCB0aGluZ3MgbGlrZSBldmVudCBoYW5kbGVycywgc2V0VGltZW91dCBjYWxsYmFja3MsXG4gICAgICAgICAgICAvLyBwcm9taXNlIHJlc29sdmVzIGFuZCBtb3JlIGFyZSBydW4gd2l0aGluLlxuICAgICAgICAgICAgLy8gSW4gbW9kZXJuIGJyb3dzZXJzLCB0aGVyZSBhcmUgdHdvIGRpZmZlcmVudCBraW5kcyBvZiB0YXNrcyxcbiAgICAgICAgICAgIC8vIG1pY3JvdGFza3MgYW5kIG1hY3JvdGFza3MuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFyZSBtYWlubHkgdXNlZCBmb3IgUHJvbWlzZXMsIHdoaWxlIG1hY3JvdGFza3MgYXJlXG4gICAgICAgICAgICAvLyB1c2VkIGZvciBldmVyeXRoaW5nIGVsc2UuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFsd2F5cyBoYXZlIHByaW9yaXR5IG92ZXIgbWFjcm90YXNrcy4gSWYgdGhlIEpTIGVuZ2luZVxuICAgICAgICAgICAgLy8gaXMgbG9va2luZyBmb3IgYSB0YXNrIHRvIHJ1biwgaXQgd2lsbCBhbHdheXMgdHJ5IHRvIGVtcHR5IHRoZVxuICAgICAgICAgICAgLy8gbWljcm90YXNrIHF1ZXVlIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHJ1biBhbnl0aGluZyBmcm9tIHRoZVxuICAgICAgICAgICAgLy8gbWFjcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEZvciB0aGUgV2ViU29ja2V0IHRyYW5zcG9ydCwgbWVzc2FnZXMgYWx3YXlzIGFycml2ZSBpbiB0aGVpciBvd25cbiAgICAgICAgICAgIC8vIGV2ZW50LiBUaGlzIG1lYW5zIHRoYXQgaWYgYW55IHByb21pc2VzIGFyZSByZXNvbHZlZCBmcm9tIHdpdGhpbixcbiAgICAgICAgICAgIC8vIHRoZWlyIGNhbGxiYWNrcyB3aWxsIGFsd2F5cyBmaW5pc2ggZXhlY3V0aW9uIGJ5IHRoZSB0aW1lIHRoZVxuICAgICAgICAgICAgLy8gbmV4dCBtZXNzYWdlIGV2ZW50IGhhbmRsZXIgaXMgcnVuLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGVtdWxhdGUgdGhpcyBiZWhhdmlvdXIsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGVhY2hcbiAgICAgICAgICAgIC8vIG9ubWVzc2FnZSBoYW5kbGVyIGlzIHJ1biB3aXRoaW4gaXQncyBvd24gbWFjcm90YXNrLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9ubWVzc2FnZSh7ZGF0YTogbXNnfSksIDApXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjA0OlxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0MTA6XG4gICAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5vcGVuXG4gICAgICAgICAgdGhpcy5vbm9wZW4oe30pXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNDAzKVxuICAgICAgICAgIHRoaXMuY2xvc2UoMTAwOCwgXCJmb3JiaWRkZW5cIiwgZmFsc2UpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNTAwKVxuICAgICAgICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDExLCBcImludGVybmFsIHNlcnZlciBlcnJvclwiLCA1MDApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgcG9sbCBzdGF0dXMgJHtzdGF0dXN9YClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgc2VuZChib2R5KXtcbiAgICB0aGlzLmFqYXgoXCJQT1NUXCIsIGJvZHksICgpID0+IHRoaXMub25lcnJvcihcInRpbWVvdXRcIiksIHJlc3AgPT4ge1xuICAgICAgaWYoIXJlc3AgfHwgcmVzcC5zdGF0dXMgIT09IDIwMCl7XG4gICAgICAgIHRoaXMub25lcnJvcihyZXNwICYmIHJlc3Auc3RhdHVzKVxuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIGZvcihsZXQgcmVxIG9mIHRoaXMucmVxcyl7IHJlcS5hYm9ydCgpIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIGlmKHR5cGVvZihDbG9zZUV2ZW50KSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICB0aGlzLm9uY2xvc2UobmV3IENsb3NlRXZlbnQoXCJjbG9zZVwiLCBvcHRzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbmNsb3NlKG9wdHMpXG4gICAgfVxuICB9XG5cbiAgYWpheChtZXRob2QsIGJvZHksIG9uQ2FsbGVyVGltZW91dCwgY2FsbGJhY2spe1xuICAgIGxldCByZXFcbiAgICBsZXQgb250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5yZXFzLmRlbGV0ZShyZXEpXG4gICAgICBvbkNhbGxlclRpbWVvdXQoKVxuICAgIH1cbiAgICByZXEgPSBBamF4LnJlcXVlc3QobWV0aG9kLCB0aGlzLmVuZHBvaW50VVJMKCksIFwiYXBwbGljYXRpb24vanNvblwiLCBib2R5LCB0aGlzLnRpbWVvdXQsIG9udGltZW91dCwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIGlmKHRoaXMuaXNBY3RpdmUoKSl7IGNhbGxiYWNrKHJlc3ApIH1cbiAgICB9KVxuICAgIHRoaXMucmVxcy5hZGQocmVxKVxuICB9XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHJlc2VuY2VcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIFRoZSBvcHRpb25zLFxuICogICAgICAgIGZvciBleGFtcGxlIGB7ZXZlbnRzOiB7c3RhdGU6IFwic3RhdGVcIiwgZGlmZjogXCJkaWZmXCJ9fWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV2ZW50cyA9IG9wdHMuZXZlbnRzIHx8IHtzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIn1cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuam9pblJlZiA9IG51bGxcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uU3luYzogZnVuY3Rpb24gKCl7IH1cbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLnN0YXRlLCBuZXdTdGF0ZSA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIHRoaXMuam9pblJlZiA9IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSlcblxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMuZm9yRWFjaChkaWZmID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgICBvblN5bmMoKVxuICAgIH0pXG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLmRpZmYsIGRpZmYgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICBpZih0aGlzLmluUGVuZGluZ1N5bmNTdGF0ZSgpKXtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgICAgb25TeW5jKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25Kb2luKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25Kb2luID0gY2FsbGJhY2sgfVxuXG4gIG9uTGVhdmUoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkxlYXZlID0gY2FsbGJhY2sgfVxuXG4gIG9uU3luYyhjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrIH1cblxuICBsaXN0KGJ5KXsgcmV0dXJuIFByZXNlbmNlLmxpc3QodGhpcy5zdGF0ZSwgYnkpIH1cblxuICBpblBlbmRpbmdTeW5jU3RhdGUoKXtcbiAgICByZXR1cm4gIXRoaXMuam9pblJlZiB8fCAodGhpcy5qb2luUmVmICE9PSB0aGlzLmNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLy8gbG93ZXItbGV2ZWwgcHVibGljIHN0YXRpYyBBUElcblxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuY2xvbmUoY3VycmVudFN0YXRlKVxuICAgIGxldCBqb2lucyA9IHt9XG4gICAgbGV0IGxlYXZlcyA9IHt9XG5cbiAgICB0aGlzLm1hcChzdGF0ZSwgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIGlmKCFuZXdTdGF0ZVtrZXldKXtcbiAgICAgICAgbGVhdmVzW2tleV0gPSBwcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gY3VyUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IG5ld1JlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgaWYoam9pbmVkTWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzXG4gICAgICAgIH1cbiAgICAgICAgaWYobGVmdE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpXG4gICAgICAgICAgbGVhdmVzW2tleV0ubWV0YXMgPSBsZWZ0TWV0YXNcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5zeW5jRGlmZihzdGF0ZSwge2pvaW5zOiBqb2lucywgbGVhdmVzOiBsZWF2ZXN9LCBvbkpvaW4sIG9uTGVhdmUpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogVXNlZCB0byBzeW5jIGEgZGlmZiBvZiBwcmVzZW5jZSBqb2luIGFuZCBsZWF2ZVxuICAgKiBldmVudHMgZnJvbSB0aGUgc2VydmVyLCBhcyB0aGV5IGhhcHBlbi4gTGlrZSBgc3luY1N0YXRlYCwgYHN5bmNEaWZmYFxuICAgKiBhY2NlcHRzIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2tzIHRvIHJlYWN0IHRvIGEgdXNlclxuICAgKiBqb2luaW5nIG9yIGxlYXZpbmcgZnJvbSBhIGRldmljZS5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNEaWZmKHN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCB7am9pbnMsIGxlYXZlc30gPSB0aGlzLmNsb25lKGRpZmYpXG4gICAgaWYoIW9uSm9pbil7IG9uSm9pbiA9IGZ1bmN0aW9uICgpeyB9IH1cbiAgICBpZighb25MZWF2ZSl7IG9uTGVhdmUgPSBmdW5jdGlvbiAoKXsgfSB9XG5cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBzdGF0ZVtrZXldID0gdGhpcy5jbG9uZShuZXdQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBqb2luZWRSZWZzID0gc3RhdGVba2V5XS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIHN0YXRlW2tleV0ubWV0YXMudW5zaGlmdCguLi5jdXJNZXRhcylcbiAgICAgIH1cbiAgICAgIG9uSm9pbihrZXksIGN1cnJlbnRQcmVzZW5jZSwgbmV3UHJlc2VuY2UpXG4gICAgfSlcbiAgICB0aGlzLm1hcChsZWF2ZXMsIChrZXksIGxlZnRQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKCFjdXJyZW50UHJlc2VuY2UpeyByZXR1cm4gfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKHAgPT4ge1xuICAgICAgICByZXR1cm4gcmVmc1RvUmVtb3ZlLmluZGV4T2YocC5waHhfcmVmKSA8IDBcbiAgICAgIH0pXG4gICAgICBvbkxlYXZlKGtleSwgY3VycmVudFByZXNlbmNlLCBsZWZ0UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgZGVsZXRlIHN0YXRlW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHByZXNlbmNlcywgd2l0aCBzZWxlY3RlZCBtZXRhZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXNlbmNlc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaG9vc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBsaXN0KHByZXNlbmNlcywgY2hvb3Nlcil7XG4gICAgaWYoIWNob29zZXIpeyBjaG9vc2VyID0gZnVuY3Rpb24gKGtleSwgcHJlcyl7IHJldHVybiBwcmVzIH0gfVxuXG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBzdGF0aWMgbWFwKG9iaiwgZnVuYyl7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubWFwKGtleSA9PiBmdW5jKGtleSwgb2JqW2tleV0pKVxuICB9XG5cbiAgc3RhdGljIGNsb25lKG9iail7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cbn1cbiIsICIvKiBUaGUgZGVmYXVsdCBzZXJpYWxpemVyIGZvciBlbmNvZGluZyBhbmQgZGVjb2RpbmcgbWVzc2FnZXMgKi9cbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSEVBREVSX0xFTkdUSDogMSxcbiAgTUVUQV9MRU5HVEg6IDQsXG4gIEtJTkRTOiB7cHVzaDogMCwgcmVwbHk6IDEsIGJyb2FkY2FzdDogMn0sXG5cbiAgZW5jb2RlKG1zZywgY2FsbGJhY2spe1xuICAgIGlmKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlFbmNvZGUobXNnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHBheWxvYWQgPSBbbXNnLmpvaW5fcmVmLCBtc2cucmVmLCBtc2cudG9waWMsIG1zZy5ldmVudCwgbXNnLnBheWxvYWRdXG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZShyYXdQYXlsb2FkLCBjYWxsYmFjayl7XG4gICAgaWYocmF3UGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RGVjb2RlKHJhd1BheWxvYWQpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpXG4gICAgICByZXR1cm4gY2FsbGJhY2soe2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZH0pXG4gICAgfVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSl7XG4gICAgbGV0IHtqb2luX3JlZiwgcmVmLCBldmVudCwgdG9waWMsIHBheWxvYWR9ID0gbWVzc2FnZVxuICAgIGxldCBtZXRhTGVuZ3RoID0gdGhpcy5NRVRBX0xFTkdUSCArIGpvaW5fcmVmLmxlbmd0aCArIHJlZi5sZW5ndGggKyB0b3BpYy5sZW5ndGggKyBldmVudC5sZW5ndGhcbiAgICBsZXQgaGVhZGVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuSEVBREVSX0xFTkdUSCArIG1ldGFMZW5ndGgpXG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKVxuICAgIGxldCBvZmZzZXQgPSAwXG5cbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpIC8vIGtpbmRcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBqb2luX3JlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0b3BpYy5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgZXZlbnQubGVuZ3RoKVxuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHJlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20odG9waWMsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKGV2ZW50LCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG5cbiAgICB2YXIgY29tYmluZWQgPSBuZXcgVWludDhBcnJheShoZWFkZXIuYnl0ZUxlbmd0aCArIHBheWxvYWQuYnl0ZUxlbmd0aClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoaGVhZGVyKSwgMClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIGNvbWJpbmVkLmJ1ZmZlclxuICB9LFxuXG4gIGJpbmFyeURlY29kZShidWZmZXIpe1xuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcilcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMClcbiAgICBsZXQgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpXG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSB0aGlzLktJTkRTLnB1c2g6IHJldHVybiB0aGlzLmRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLnJlcGx5OiByZXR1cm4gdGhpcy5kZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OiByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDEgLy8gcHVzaGVzIGhhdmUgbm8gcmVmXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9LFxuXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCByZWZTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoNClcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSFxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICBsZXQgcGF5bG9hZCA9IHtzdGF0dXM6IGV2ZW50LCByZXNwb25zZTogZGF0YX1cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IHJlZiwgdG9waWM6IHRvcGljLCBldmVudDogQ0hBTk5FTF9FVkVOVFMucmVwbHksIHBheWxvYWQ6IHBheWxvYWR9XG4gIH0sXG5cbiAgZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyAyXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBwaHhXaW5kb3csXG4gIENIQU5ORUxfRVZFTlRTLFxuICBERUZBVUxUX1RJTUVPVVQsXG4gIERFRkFVTFRfVlNOLFxuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTLFxuICBXU19DTE9TRV9OT1JNQUxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvc3VyZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vY2hhbm5lbFwiXG5pbXBvcnQgTG9uZ1BvbGwgZnJvbSBcIi4vbG9uZ3BvbGxcIlxuaW1wb3J0IFNlcmlhbGl6ZXIgZnJvbSBcIi4vc2VyaWFsaXplclwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKiogSW5pdGlhbGl6ZXMgdGhlIFNvY2tldCAqXG4gKlxuICogRm9yIElFOCBzdXBwb3J0IHVzZSBhbiBFUzUtc2hpbSAoaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3M6Ly9leGFtcGxlLmNvbS9zb2NrZXRcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwid3NzOi8vZXhhbXBsZS5jb21cImBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvc29ja2V0XCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnRyYW5zcG9ydF0gLSBUaGUgV2Vic29ja2V0IFRyYW5zcG9ydCwgZm9yIGV4YW1wbGUgV2ViU29ja2V0IG9yIFBob2VuaXguTG9uZ1BvbGwuXG4gKlxuICogRGVmYXVsdHMgdG8gV2ViU29ja2V0IHdpdGggYXV0b21hdGljIExvbmdQb2xsIGZhbGxiYWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuZW5jb2RlXSAtIFRoZSBmdW5jdGlvbiB0byBlbmNvZGUgb3V0Z29pbmcgbWVzc2FnZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gSlNPTiBlbmNvZGVyLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmRlY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZGVjb2RlIGluY29taW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT046XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogKHBheWxvYWQsIGNhbGxiYWNrKSA9PiBjYWxsYmFjayhKU09OLnBhcnNlKHBheWxvYWQpKVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVvdXRdIC0gVGhlIGRlZmF1bHQgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gdHJpZ2dlciBwdXNoIHRpbWVvdXRzLlxuICpcbiAqIERlZmF1bHRzIGBERUZBVUxUX1RJTUVPVVRgXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMuaGVhcnRiZWF0SW50ZXJ2YWxNc10gLSBUaGUgbWlsbGlzZWMgaW50ZXJ2YWwgdG8gc2VuZCBhIGhlYXJ0YmVhdCBtZXNzYWdlXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMucmVjb25uZWN0QWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBtaWxsc2VjXG4gKiBzb2NrZXQgcmVjb25uZWN0IGludGVydmFsLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlam9pbkFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbHNlY1xuICogcmVqb2luIGludGVydmFsIGZvciBpbmRpdmlkdWFsIGNoYW5uZWxzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZywgaWU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24oa2luZCwgbXNnLCBkYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKGAke2tpbmR9OiAke21zZ31gLCBkYXRhKVxuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmxvbmdwb2xsZXJUaW1lb3V0XSAtIFRoZSBtYXhpbXVtIHRpbWVvdXQgb2YgYSBsb25nIHBvbGwgQUpBWCByZXF1ZXN0LlxuICpcbiAqIERlZmF1bHRzIHRvIDIwcyAoZG91YmxlIHRoZSBzZXJ2ZXIgbG9uZyBwb2xsIHRpbWVyKS5cbiAqXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIHBhcmFtcyB0byBwYXNzIHdoZW4gY29ubmVjdGluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmFyeVR5cGVdIC0gVGhlIGJpbmFyeSB0eXBlIHRvIHVzZSBmb3IgYmluYXJ5IFdlYlNvY2tldCBmcmFtZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gXCJhcnJheWJ1ZmZlclwiXG4gKlxuICogQHBhcmFtIHt2c259IFtvcHRzLnZzbl0gLSBUaGUgc2VyaWFsaXplcidzIHByb3RvY29sIHZlcnNpb24gdG8gc2VuZCBvbiBjb25uZWN0LlxuICpcbiAqIERlZmF1bHRzIHRvIERFRkFVTFRfVlNOLlxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50LCBvcHRzID0ge30pe1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MgPSB7b3BlbjogW10sIGNsb3NlOiBbXSwgZXJyb3I6IFtdLCBtZXNzYWdlOiBbXX1cbiAgICB0aGlzLmNoYW5uZWxzID0gW11cbiAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXVxuICAgIHRoaXMucmVmID0gMFxuICAgIHRoaXMudGltZW91dCA9IG9wdHMudGltZW91dCB8fCBERUZBVUxUX1RJTUVPVVRcbiAgICB0aGlzLnRyYW5zcG9ydCA9IG9wdHMudHJhbnNwb3J0IHx8IGdsb2JhbC5XZWJTb2NrZXQgfHwgTG9uZ1BvbGxcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMgPSAwXG4gICAgdGhpcy5kZWZhdWx0RW5jb2RlciA9IFNlcmlhbGl6ZXIuZW5jb2RlLmJpbmQoU2VyaWFsaXplcilcbiAgICB0aGlzLmRlZmF1bHREZWNvZGVyID0gU2VyaWFsaXplci5kZWNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5iaW5hcnlUeXBlID0gb3B0cy5iaW5hcnlUeXBlIHx8IFwiYXJyYXlidWZmZXJcIlxuICAgIHRoaXMuY29ubmVjdENsb2NrID0gMVxuICAgIGlmKHRoaXMudHJhbnNwb3J0ICE9PSBMb25nUG9sbCl7XG4gICAgICB0aGlzLmVuY29kZSA9IG9wdHMuZW5jb2RlIHx8IHRoaXMuZGVmYXVsdEVuY29kZXJcbiAgICAgIHRoaXMuZGVjb2RlID0gb3B0cy5kZWNvZGUgfHwgdGhpcy5kZWZhdWx0RGVjb2RlclxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuY29kZSA9IHRoaXMuZGVmYXVsdEVuY29kZXJcbiAgICAgIHRoaXMuZGVjb2RlID0gdGhpcy5kZWZhdWx0RGVjb2RlclxuICAgIH1cbiAgICBsZXQgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGxcbiAgICBpZihwaHhXaW5kb3cgJiYgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIpe1xuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCBfZSA9PiB7XG4gICAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gdGhpcy5jb25uZWN0Q2xvY2tcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgX2UgPT4ge1xuICAgICAgICBpZihhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID09PSB0aGlzLmNvbm5lY3RDbG9jayl7XG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGxcbiAgICAgICAgICB0aGlzLmNvbm5lY3QoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMgPSBvcHRzLmhlYXJ0YmVhdEludGVydmFsTXMgfHwgMzAwMDBcbiAgICB0aGlzLnJlam9pbkFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmKG9wdHMucmVqb2luQWZ0ZXJNcyl7XG4gICAgICAgIHJldHVybiBvcHRzLnJlam9pbkFmdGVyTXModHJpZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwMDAsIDIwMDAsIDUwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWNvbm5lY3RBZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlY29ubmVjdEFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWNvbm5lY3RBZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMCwgNTAsIDEwMCwgMTUwLCAyMDAsIDI1MCwgNTAwLCAxMDAwLCAyMDAwXVt0cmllcyAtIDFdIHx8IDUwMDBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRzLmxvZ2dlciB8fCBudWxsXG4gICAgdGhpcy5sb25ncG9sbGVyVGltZW91dCA9IG9wdHMubG9uZ3BvbGxlclRpbWVvdXQgfHwgMjAwMDBcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUob3B0cy5wYXJhbXMgfHwge30pXG4gICAgdGhpcy5lbmRQb2ludCA9IGAke2VuZFBvaW50fS8ke1RSQU5TUE9SVFMud2Vic29ja2V0fWBcbiAgICB0aGlzLnZzbiA9IG9wdHMudnNuIHx8IERFRkFVTFRfVlNOXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICB0aGlzLnRlYXJkb3duKCgpID0+IHRoaXMuY29ubmVjdCgpKVxuICAgIH0sIHRoaXMucmVjb25uZWN0QWZ0ZXJNcylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBMb25nUG9sbCB0cmFuc3BvcnQgcmVmZXJlbmNlXG4gICAqL1xuICBnZXRMb25nUG9sbFRyYW5zcG9ydCgpeyByZXR1cm4gTG9uZ1BvbGwgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KXtcbiAgICB0aGlzLmNvbm5lY3RDbG9jaysrXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gdHJ1ZVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgaWYodGhpcy5jb25uKXtcbiAgICAgIHRoaXMuY29ubi5jbG9zZSgpXG4gICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgfVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc29ja2V0IHByb3RvY29sXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b2NvbCgpeyByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2wubWF0Y2goL15odHRwcy8pID8gXCJ3c3NcIiA6IFwid3NcIiB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxseSBxdWFsaWZlZCBzb2NrZXQgdXJsXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBlbmRQb2ludFVSTCgpe1xuICAgIGxldCB1cmkgPSBBamF4LmFwcGVuZFBhcmFtcyhcbiAgICAgIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMuZW5kUG9pbnQsIHRoaXMucGFyYW1zKCkpLCB7dnNuOiB0aGlzLnZzbn0pXG4gICAgaWYodXJpLmNoYXJBdCgwKSAhPT0gXCIvXCIpeyByZXR1cm4gdXJpIH1cbiAgICBpZih1cmkuY2hhckF0KDEpID09PSBcIi9cIil7IHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9OiR7dXJpfWAgfVxuXG4gICAgcmV0dXJuIGAke3RoaXMucHJvdG9jb2woKX06Ly8ke2xvY2F0aW9uLmhvc3R9JHt1cml9YFxuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIHRoZSBzb2NrZXRcbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DbG9zZUV2ZW50I1N0YXR1c19jb2RlcyBmb3IgdmFsaWQgc3RhdHVzIGNvZGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCBhZnRlciBzb2NrZXQgaXMgZGlzY29ubmVjdGVkLlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IGNvZGUgLSBBIHN0YXR1cyBjb2RlIGZvciBkaXNjb25uZWN0aW9uIChPcHRpb25hbCkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWFzb24gLSBBIHRleHR1YWwgZGVzY3JpcHRpb24gb2YgdGhlIHJlYXNvbiB0byBkaXNjb25uZWN0LiAoT3B0aW9uYWwpXG4gICAqL1xuICBkaXNjb25uZWN0KGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy50ZWFyZG93bihjYWxsYmFjaywgY29kZSwgcmVhc29uKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1zIHRvIHNlbmQgd2hlbiBjb25uZWN0aW5nLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IHVzZXJUb2tlbn1gXG4gICAqXG4gICAqIFBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZDsgcGFzcyB0aGVtIGluIHRoZSBTb2NrZXQgY29uc3RydWN0b3IgaW5zdGVhZDpcbiAgICogYG5ldyBTb2NrZXQoXCIvc29ja2V0XCIsIHtwYXJhbXM6IHt1c2VyX2lkOiB1c2VyVG9rZW59fSlgLlxuICAgKi9cbiAgY29ubmVjdChwYXJhbXMpe1xuICAgIGlmKHBhcmFtcyl7XG4gICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nKFwicGFzc2luZyBwYXJhbXMgdG8gY29ubmVjdCBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkIHBhc3MgOnBhcmFtcyB0byB0aGUgU29ja2V0IGNvbnN0cnVjdG9yXCIpXG4gICAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUocGFyYW1zKVxuICAgIH1cbiAgICBpZih0aGlzLmNvbm4peyByZXR1cm4gfVxuXG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5jb25uID0gbmV3IHRoaXMudHJhbnNwb3J0KHRoaXMuZW5kUG9pbnRVUkwoKSlcbiAgICB0aGlzLmNvbm4uYmluYXJ5VHlwZSA9IHRoaXMuYmluYXJ5VHlwZVxuICAgIHRoaXMuY29ubi50aW1lb3V0ID0gdGhpcy5sb25ncG9sbGVyVGltZW91dFxuICAgIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLm9uQ29ubk9wZW4oKVxuICAgIHRoaXMuY29ubi5vbmVycm9yID0gZXJyb3IgPT4gdGhpcy5vbkNvbm5FcnJvcihlcnJvcilcbiAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZXZlbnQgPT4gdGhpcy5vbkNvbm5NZXNzYWdlKGV2ZW50KVxuICAgIHRoaXMuY29ubi5vbmNsb3NlID0gZXZlbnQgPT4gdGhpcy5vbkNvbm5DbG9zZShldmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSBtZXNzYWdlLiBPdmVycmlkZSBgdGhpcy5sb2dnZXJgIGZvciBzcGVjaWFsaXplZCBsb2dnaW5nLiBub29wcyBieSBkZWZhdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBraW5kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2dcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGxvZyhraW5kLCBtc2csIGRhdGEpeyB0aGlzLmxvZ2dlcihraW5kLCBtc2csIGRhdGEpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgbG9nZ2VyIGhhcyBiZWVuIHNldCBvbiB0aGlzIHNvY2tldC5cbiAgICovXG4gIGhhc0xvZ2dlcigpeyByZXR1cm4gdGhpcy5sb2dnZXIgIT09IG51bGwgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG9wZW4gZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbk9wZW4oZnVuY3Rpb24oKXsgY29uc29sZS5pbmZvKFwidGhlIHNvY2tldCB3YXMgb3BlbmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk9wZW4oY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBjbG9zZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gZXJyb3IgZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbkVycm9yKGZ1bmN0aW9uKGVycm9yKXsgYWxlcnQoXCJBbiBlcnJvciBvY2N1cnJlZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBtZXNzYWdlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25NZXNzYWdlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFBpbmdzIHRoZSBzZXJ2ZXIgYW5kIGludm9rZXMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIFJUVCBpbiBtaWxsaXNlY29uZHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICpcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwaW5nIHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgdW5hYmxlIHRvIGJlIHB1c2hlZC5cbiAgICovXG4gIHBpbmcoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gZmFsc2UgfVxuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5wdXNoKHt0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmOiByZWZ9KVxuICAgIGxldCBvbk1zZ1JlZiA9IHRoaXMub25NZXNzYWdlKG1zZyA9PiB7XG4gICAgICBpZihtc2cucmVmID09PSByZWYpe1xuICAgICAgICB0aGlzLm9mZihbb25Nc2dSZWZdKVxuICAgICAgICBjYWxsYmFjayhEYXRlLm5vdygpIC0gc3RhcnRUaW1lKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25Db25uT3Blbigpe1xuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBjb25uZWN0ZWQgdG8gJHt0aGlzLmVuZFBvaW50VVJMKCl9YClcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucysrXG4gICAgdGhpcy5mbHVzaFNlbmRCdWZmZXIoKVxuICAgIHRoaXMucmVjb25uZWN0VGltZXIucmVzZXQoKVxuICAgIHRoaXMucmVzZXRIZWFydGJlYXQoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IGNhbGxiYWNrKCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgaGVhcnRiZWF0VGltZW91dCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXsgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgXCJoZWFydGJlYXQgdGltZW91dC4gQXR0ZW1wdGluZyB0byByZS1lc3RhYmxpc2ggY29ubmVjdGlvblwiKSB9XG4gICAgICB0aGlzLmFibm9ybWFsQ2xvc2UoXCJoZWFydGJlYXQgdGltZW91dFwiKVxuICAgIH1cbiAgfVxuXG4gIHJlc2V0SGVhcnRiZWF0KCl7XG4gICAgaWYodGhpcy5jb25uICYmIHRoaXMuY29ubi5za2lwSGVhcnRiZWF0KXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuaGVhcnRiZWF0VGltZXIpXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICB9XG5cbiAgdGVhcmRvd24oY2FsbGJhY2ssIGNvZGUsIHJlYXNvbil7XG4gICAgaWYoIXRoaXMuY29ubil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoKCkgPT4ge1xuICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgaWYoY29kZSl7IHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIikgfSBlbHNlIHsgdGhpcy5jb25uLmNsb3NlKCkgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoKCkgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuY29ubi5vbmNsb3NlID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgICAgICAgIHRoaXMuY29ubiA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHdhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgIXRoaXMuY29ubi5idWZmZXJlZEFtb3VudCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoY2FsbGJhY2ssIHRyaWVzICsgMSlcbiAgICB9LCAxNTAgKiB0cmllcylcbiAgfVxuXG4gIHdhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzID0gMSl7XG4gICAgaWYodHJpZXMgPT09IDUgfHwgIXRoaXMuY29ubiB8fCB0aGlzLmNvbm4ucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jbG9zZWQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoY2FsbGJhY2ssIHRyaWVzICsgMSlcbiAgICB9LCAxNTAgKiB0cmllcylcbiAgfVxuXG4gIG9uQ29ubkNsb3NlKGV2ZW50KXtcbiAgICBsZXQgY2xvc2VDb2RlID0gZXZlbnQgJiYgZXZlbnQuY29kZVxuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiY2xvc2VcIiwgZXZlbnQpXG4gICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lcilcbiAgICBpZighdGhpcy5jbG9zZVdhc0NsZWFuICYmIGNsb3NlQ29kZSAhPT0gMTAwMCl7XG4gICAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpXG4gICAgfVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UuZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjayhldmVudCkpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubkVycm9yKGVycm9yKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBlcnJvcilcbiAgICBsZXQgdHJhbnNwb3J0QmVmb3JlID0gdGhpcy50cmFuc3BvcnRcbiAgICBsZXQgZXN0YWJsaXNoZWRCZWZvcmUgPSB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnNcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmVycm9yLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgY2FsbGJhY2soZXJyb3IsIHRyYW5zcG9ydEJlZm9yZSwgZXN0YWJsaXNoZWRCZWZvcmUpXG4gICAgfSlcbiAgICBpZih0cmFuc3BvcnRCZWZvcmUgPT09IHRoaXMudHJhbnNwb3J0IHx8IGVzdGFibGlzaGVkQmVmb3JlID4gMCl7XG4gICAgICB0aGlzLnRyaWdnZXJDaGFuRXJyb3IoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdHJpZ2dlckNoYW5FcnJvcigpe1xuICAgIHRoaXMuY2hhbm5lbHMuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgIGlmKCEoY2hhbm5lbC5pc0Vycm9yZWQoKSB8fCBjaGFubmVsLmlzTGVhdmluZygpIHx8IGNoYW5uZWwuaXNDbG9zZWQoKSkpe1xuICAgICAgICBjaGFubmVsLnRyaWdnZXIoQ0hBTk5FTF9FVkVOVFMuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgY29ubmVjdGlvblN0YXRlKCl7XG4gICAgc3dpdGNoKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4ucmVhZHlTdGF0ZSl7XG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZzogcmV0dXJuIFwiY29ubmVjdGluZ1wiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMub3BlbjogcmV0dXJuIFwib3BlblwiXG4gICAgICBjYXNlIFNPQ0tFVF9TVEFURVMuY2xvc2luZzogcmV0dXJuIFwiY2xvc2luZ1wiXG4gICAgICBkZWZhdWx0OiByZXR1cm4gXCJjbG9zZWRcIlxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLmNvbm5lY3Rpb25TdGF0ZSgpID09PSBcIm9wZW5cIiB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7Q2hhbm5lbH1cbiAgICovXG4gIHJlbW92ZShjaGFubmVsKXtcbiAgICB0aGlzLm9mZihjaGFubmVsLnN0YXRlQ2hhbmdlUmVmcylcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVscy5maWx0ZXIoYyA9PiBjLmpvaW5SZWYoKSAhPT0gY2hhbm5lbC5qb2luUmVmKCkpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYCByZWdpc3RyYXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge3JlZnN9IC0gbGlzdCBvZiByZWZzIHJldHVybmVkIGJ5IGNhbGxzIHRvXG4gICAqICAgICAgICAgICAgICAgICBgb25PcGVuYCwgYG9uQ2xvc2VgLCBgb25FcnJvcixgIGFuZCBgb25NZXNzYWdlYFxuICAgKi9cbiAgb2ZmKHJlZnMpe1xuICAgIGZvcihsZXQga2V5IGluIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mpe1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrc1trZXldLmZpbHRlcigoW3JlZl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHJlZnMuaW5kZXhPZihyZWYpID09PSAtMVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGVzIGEgbmV3IGNoYW5uZWwgZm9yIHRoZSBnaXZlbiB0b3BpY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9waWNcbiAgICogQHBhcmFtIHtPYmplY3R9IGNoYW5QYXJhbXMgLSBQYXJhbWV0ZXJzIGZvciB0aGUgY2hhbm5lbFxuICAgKiBAcmV0dXJucyB7Q2hhbm5lbH1cbiAgICovXG4gIGNoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMgPSB7fSl7XG4gICAgbGV0IGNoYW4gPSBuZXcgQ2hhbm5lbCh0b3BpYywgY2hhblBhcmFtcywgdGhpcylcbiAgICB0aGlzLmNoYW5uZWxzLnB1c2goY2hhbilcbiAgICByZXR1cm4gY2hhblxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBwdXNoKGRhdGEpe1xuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpe1xuICAgICAgbGV0IHt0b3BpYywgZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWZ9ID0gZGF0YVxuICAgICAgdGhpcy5sb2coXCJwdXNoXCIsIGAke3RvcGljfSAke2V2ZW50fSAoJHtqb2luX3JlZn0sICR7cmVmfSlgLCBwYXlsb2FkKVxuICAgIH1cblxuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSl7XG4gICAgICB0aGlzLmVuY29kZShkYXRhLCByZXN1bHQgPT4gdGhpcy5jb25uLnNlbmQocmVzdWx0KSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLnB1c2goKCkgPT4gdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIG5leHQgbWVzc2FnZSByZWYsIGFjY291bnRpbmcgZm9yIG92ZXJmbG93c1xuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgbWFrZVJlZigpe1xuICAgIGxldCBuZXdSZWYgPSB0aGlzLnJlZiArIDFcbiAgICBpZihuZXdSZWYgPT09IHRoaXMucmVmKXsgdGhpcy5yZWYgPSAwIH0gZWxzZSB7IHRoaXMucmVmID0gbmV3UmVmIH1cblxuICAgIHJldHVybiB0aGlzLnJlZi50b1N0cmluZygpXG4gIH1cblxuICBzZW5kSGVhcnRiZWF0KCl7XG4gICAgaWYodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmICYmICF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5wdXNoKHt0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmOiB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWZ9KVxuICAgIHRoaXMuaGVhcnRiZWF0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaGVhcnRiZWF0VGltZW91dCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gIH1cblxuICBhYm5vcm1hbENsb3NlKHJlYXNvbil7XG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpeyB0aGlzLmNvbm4uY2xvc2UoV1NfQ0xPU0VfTk9STUFMLCByZWFzb24pIH1cbiAgfVxuXG4gIGZsdXNoU2VuZEJ1ZmZlcigpe1xuICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLnNlbmRCdWZmZXIubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKVxuICAgICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICB9XG4gIH1cblxuICBvbkNvbm5NZXNzYWdlKHJhd01lc3NhZ2Upe1xuICAgIHRoaXMuZGVjb2RlKHJhd01lc3NhZ2UuZGF0YSwgbXNnID0+IHtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IG1zZ1xuICAgICAgaWYocmVmICYmIHJlZiA9PT0gdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGVhcnRiZWF0VGltZXIpXG4gICAgICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInJlY2VpdmVcIiwgYCR7cGF5bG9hZC5zdGF0dXMgfHwgXCJcIn0gJHt0b3BpY30gJHtldmVudH0gJHtyZWYgJiYgXCIoXCIgKyByZWYgKyBcIilcIiB8fCBcIlwifWAsIHBheWxvYWQpXG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5uZWxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbaV1cbiAgICAgICAgaWYoIWNoYW5uZWwuaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luX3JlZikpeyBjb250aW51ZSB9XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZilcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGxldCBbLCBjYWxsYmFja10gPSB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2VbaV1cbiAgICAgICAgY2FsbGJhY2sobXNnKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBsZWF2ZU9wZW5Ub3BpYyh0b3BpYyl7XG4gICAgbGV0IGR1cENoYW5uZWwgPSB0aGlzLmNoYW5uZWxzLmZpbmQoYyA9PiBjLnRvcGljID09PSB0b3BpYyAmJiAoYy5pc0pvaW5lZCgpIHx8IGMuaXNKb2luaW5nKCkpKVxuICAgIGlmKGR1cENoYW5uZWwpe1xuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYGxlYXZpbmcgZHVwbGljYXRlIHRvcGljIFwiJHt0b3BpY31cImApXG4gICAgICBkdXBDaGFubmVsLmxlYXZlKClcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQgXCJwaG9lbml4X2h0bWxcIlxuaW1wb3J0IHsgU29ja2V0LCBMb25nUG9sbCB9IGZyb20gXCJwaG9lbml4XCJcbmltcG9ydCBOUHJvZ3Jlc3MgZnJvbSBcIm5wcm9ncmVzc1wiXG5pbXBvcnQgeyBMaXZlU29ja2V0IH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbmltcG9ydCBQaHhDaGFydENvbXBvbmVudCBmcm9tIFwiLi9tZXRyaWNzX2xpdmVcIlxuaW1wb3J0IFBoeFJlcXVlc3RMb2dnZXJDb29raWUgZnJvbSBcIi4vcmVxdWVzdF9sb2dnZXJfY29va2llXCJcbmltcG9ydCBQaHhSZXF1ZXN0TG9nZ2VyUXVlcnlQYXJhbWV0ZXIgZnJvbSBcIi4vcmVxdWVzdF9sb2dnZXJfcXVlcnlfcGFyYW1ldGVyXCJcbmltcG9ydCBQaHhSZXF1ZXN0TG9nZ2VyTWVzc2FnZXMgZnJvbSBcIi4vcmVxdWVzdF9sb2dnZXJfbWVzc2FnZXNcIlxuaW1wb3J0IFBoeENvbG9yQmFySGlnaGxpZ2h0IGZyb20gXCIuL2NvbG9yX2Jhcl9oaWdobGlnaHRcIlxuaW1wb3J0IFBoeFJlbWVtYmVyUmVmcmVzaCBmcm9tIFwiLi9yZW1lbWJlcl9yZWZyZXNoXCJcbmltcG9ydCB7IGxvYWRSZWZyZXNoRGF0YSB9IGZyb20gXCIuL3JlZnJlc2hcIjtcblxubGV0IEhvb2tzID0ge1xuICBQaHhDaGFydENvbXBvbmVudDogUGh4Q2hhcnRDb21wb25lbnQsXG4gIFBoeFJlcXVlc3RMb2dnZXJDb29raWU6IFBoeFJlcXVlc3RMb2dnZXJDb29raWUsXG4gIFBoeFJlcXVlc3RMb2dnZXJRdWVyeVBhcmFtZXRlcjogUGh4UmVxdWVzdExvZ2dlclF1ZXJ5UGFyYW1ldGVyLFxuICBQaHhSZXF1ZXN0TG9nZ2VyTWVzc2FnZXM6IFBoeFJlcXVlc3RMb2dnZXJNZXNzYWdlcyxcbiAgUGh4Q29sb3JCYXJIaWdobGlnaHQ6IFBoeENvbG9yQmFySGlnaGxpZ2h0LFxuICBQaHhSZW1lbWJlclJlZnJlc2g6IFBoeFJlbWVtYmVyUmVmcmVzaFxufVxuXG5sZXQgc29ja2V0UGF0aCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLmdldEF0dHJpYnV0ZShcInBoeC1zb2NrZXRcIikgfHwgXCIvbGl2ZVwiXG5sZXQgY3NyZlRva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1ldGFbbmFtZT0nY3NyZi10b2tlbiddXCIpLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIilcbmxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoc29ja2V0UGF0aCwgU29ja2V0LCB7XG4gIGhvb2tzOiBIb29rcyxcbiAgcGFyYW1zOiAobGl2ZVZpZXdOYW1lKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIF9jc3JmX3Rva2VuOiBjc3JmVG9rZW4sXG4gICAgICAvLyBQYXNzIHRoZSBtb3N0IHJlY2VudCByZWZyZXNoIGRhdGEgdG8gdGhlIExpdmVWaWV3IGluIGBjb25uZWN0X3BhcmFtc2BcbiAgICAgIHJlZnJlc2hfZGF0YTogbG9hZFJlZnJlc2hEYXRhKCksXG4gICAgfTtcbiAgfSxcbn0pXG5cblxuY29uc3Qgc29ja2V0ID0gbGl2ZVNvY2tldC5zb2NrZXRcbmNvbnN0IG9yaWdpbmFsT25Db25uRXJyb3IgPSBzb2NrZXQub25Db25uRXJyb3JcbmxldCBmYWxsYmFja1RvTG9uZ1BvbGwgPSB0cnVlXG5cbnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICBmYWxsYmFja1RvTG9uZ1BvbGwgPSBmYWxzZVxufSlcblxuc29ja2V0Lm9uQ29ubkVycm9yID0gKC4uLmFyZ3MpID0+IHtcbiAgaWYgKGZhbGxiYWNrVG9Mb25nUG9sbCkge1xuICAgIC8vIE5vIGxvbmdlciBmYWxsYmFjayB0byBsb25ncG9sbFxuICAgIGZhbGxiYWNrVG9Mb25nUG9sbCA9IGZhbHNlXG4gICAgLy8gY2xvc2UgdGhlIHNvY2tldCB3aXRoIGFuIGVycm9yIGNvZGVcbiAgICBzb2NrZXQuZGlzY29ubmVjdChudWxsLCAzMDAwKVxuICAgIC8vIGZhbGwgYmFjayB0byBsb25nIHBvbGxcbiAgICBzb2NrZXQudHJhbnNwb3J0ID0gTG9uZ1BvbGxcbiAgICAvLyByZW9wZW5cbiAgICBzb2NrZXQuY29ubmVjdCgpXG4gIH0gZWxzZSB7XG4gICAgb3JpZ2luYWxPbkNvbm5FcnJvci5hcHBseShzb2NrZXQsIGFyZ3MpXG4gIH1cbn1cblxuLy8gU2hvdyBwcm9ncmVzcyBiYXIgb24gbGl2ZSBuYXZpZ2F0aW9uIGFuZCBmb3JtIHN1Ym1pdHNcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCBpbmZvID0+IE5Qcm9ncmVzcy5zdGFydCgpKVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwgaW5mbyA9PiBOUHJvZ3Jlc3MuZG9uZSgpKVxuXG4vLyBjb25uZWN0IGlmIHRoZXJlIGFyZSBhbnkgTGl2ZVZpZXdzIG9uIHRoZSBwYWdlXG5saXZlU29ja2V0LmNvbm5lY3QoKVxuXG4vLyBleHBvc2UgbGl2ZVNvY2tldCBvbiB3aW5kb3cgZm9yIHdlYiBjb25zb2xlIGRlYnVnIGxvZ3MgYW5kIGxhdGVuY3kgc2ltdWxhdGlvbjpcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlRGVidWcoKVxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVMYXRlbmN5U2ltKDEwMDApXG53aW5kb3cubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiIsICJleHBvcnQgY29uc3QgQ09OU0VDVVRJVkVfUkVMT0FEUyA9IFwiY29uc2VjdXRpdmUtcmVsb2Fkc1wiXG5leHBvcnQgY29uc3QgTUFYX1JFTE9BRFMgPSAxMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUlOID0gNTAwMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUFYID0gMTAwMDBcbmV4cG9ydCBjb25zdCBGQUlMU0FGRV9KSVRURVIgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IFBIWF9FVkVOVF9DTEFTU0VTID0gW1xuICBcInBoeC1jbGljay1sb2FkaW5nXCIsIFwicGh4LWNoYW5nZS1sb2FkaW5nXCIsIFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIsXG4gIFwicGh4LWtleWRvd24tbG9hZGluZ1wiLCBcInBoeC1rZXl1cC1sb2FkaW5nXCIsIFwicGh4LWJsdXItbG9hZGluZ1wiLCBcInBoeC1mb2N1cy1sb2FkaW5nXCJcbl1cbmV4cG9ydCBjb25zdCBQSFhfQ09NUE9ORU5UID0gXCJkYXRhLXBoeC1jb21wb25lbnRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19TVEFUSUMgPSBcInRyYWNrLXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX0xJTktfU1RBVEUgPSBcImRhdGEtcGh4LWxpbmstc3RhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUYgPSBcImRhdGEtcGh4LXJlZlwiXG5leHBvcnQgY29uc3QgUEhYX1JFRl9TUkMgPSBcImRhdGEtcGh4LXJlZi1zcmNcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19VUExPQURTID0gXCJ0cmFjay11cGxvYWRzXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBMT0FEX1JFRiA9IFwiZGF0YS1waHgtdXBsb2FkLXJlZlwiXG5leHBvcnQgY29uc3QgUEhYX1BSRUZMSUdIVEVEX1JFRlMgPSBcImRhdGEtcGh4LXByZWZsaWdodGVkLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9ET05FX1JFRlMgPSBcImRhdGEtcGh4LWRvbmUtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RST1BfVEFSR0VUID0gXCJkcm9wLXRhcmdldFwiXG5leHBvcnQgY29uc3QgUEhYX0FDVElWRV9FTlRSWV9SRUZTID0gXCJkYXRhLXBoeC1hY3RpdmUtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0xJVkVfRklMRV9VUERBVEVEID0gXCJwaHg6bGl2ZS1maWxlOnVwZGF0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9TS0lQID0gXCJkYXRhLXBoeC1za2lwXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJVTkUgPSBcImRhdGEtcGh4LXBydW5lXCJcbmV4cG9ydCBjb25zdCBQSFhfUEFHRV9MT0FESU5HID0gXCJwYWdlLWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9DT05ORUNURURfQ0xBU1MgPSBcInBoeC1jb25uZWN0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNDT05ORUNURURfQ0xBU1MgPSBcInBoeC1sb2FkaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MgPSBcInBoeC1uby1mZWVkYmFja1wiXG5leHBvcnQgY29uc3QgUEhYX0VSUk9SX0NMQVNTID0gXCJwaHgtZXJyb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9QQVJFTlRfSUQgPSBcImRhdGEtcGh4LXBhcmVudC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX01BSU4gPSBcImRhdGEtcGh4LW1haW5cIlxuZXhwb3J0IGNvbnN0IFBIWF9ST09UX0lEID0gXCJkYXRhLXBoeC1yb290LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJJR0dFUl9BQ1RJT04gPSBcInRyaWdnZXItYWN0aW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfRkVFREJBQ0tfRk9SID0gXCJmZWVkYmFjay1mb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfRk9DVVNFRCA9IFwicGh4LWhhcy1mb2N1c2VkXCJcbmV4cG9ydCBjb25zdCBGT0NVU0FCTEVfSU5QVVRTID0gW1widGV4dFwiLCBcInRleHRhcmVhXCIsIFwibnVtYmVyXCIsIFwiZW1haWxcIiwgXCJwYXNzd29yZFwiLCBcInNlYXJjaFwiLCBcInRlbFwiLCBcInVybFwiLCBcImRhdGVcIiwgXCJ0aW1lXCIsIFwiZGF0ZXRpbWUtbG9jYWxcIiwgXCJjb2xvclwiLCBcInJhbmdlXCJdXG5leHBvcnQgY29uc3QgQ0hFQ0tBQkxFX0lOUFVUUyA9IFtcImNoZWNrYm94XCIsIFwicmFkaW9cIl1cbmV4cG9ydCBjb25zdCBQSFhfSEFTX1NVQk1JVFRFRCA9IFwicGh4LWhhcy1zdWJtaXR0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9TRVNTSU9OID0gXCJkYXRhLXBoeC1zZXNzaW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfVklFV19TRUxFQ1RPUiA9IGBbJHtQSFhfU0VTU0lPTn1dYFxuZXhwb3J0IGNvbnN0IFBIWF9TVElDS1kgPSBcImRhdGEtcGh4LXN0aWNreVwiXG5leHBvcnQgY29uc3QgUEhYX1NUQVRJQyA9IFwiZGF0YS1waHgtc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVBRE9OTFkgPSBcImRhdGEtcGh4LXJlYWRvbmx5XCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRUQgPSBcImRhdGEtcGh4LWRpc2FibGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIID0gXCJkaXNhYmxlLXdpdGhcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSA9IFwiZGF0YS1waHgtZGlzYWJsZS13aXRoLXJlc3RvcmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9IT09LID0gXCJob29rXCJcbmV4cG9ydCBjb25zdCBQSFhfREVCT1VOQ0UgPSBcImRlYm91bmNlXCJcbmV4cG9ydCBjb25zdCBQSFhfVEhST1RUTEUgPSBcInRocm90dGxlXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBEQVRFID0gXCJ1cGRhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9LRVkgPSBcImtleVwiXG5leHBvcnQgY29uc3QgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9BVVRPX1JFQ09WRVIgPSBcImF1dG8tcmVjb3ZlclwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0RFQlVHID0gXCJwaHg6bGl2ZS1zb2NrZXQ6ZGVidWdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfTEFURU5DWV9TSU0gPSBcInBoeDpsaXZlLXNvY2tldDpsYXRlbmN5LXNpbVwiXG5leHBvcnQgY29uc3QgUEhYX1BST0dSRVNTID0gXCJwcm9ncmVzc1wiXG5leHBvcnQgY29uc3QgUEhYX01PVU5URUQgPSBcIm1vdW50ZWRcIlxuZXhwb3J0IGNvbnN0IExPQURFUl9USU1FT1VUID0gMVxuZXhwb3J0IGNvbnN0IEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQgPSAyMDBcbmV4cG9ydCBjb25zdCBCSU5ESU5HX1BSRUZJWCA9IFwicGh4LVwiXG5leHBvcnQgY29uc3QgUFVTSF9USU1FT1VUID0gMzAwMDBcbmV4cG9ydCBjb25zdCBMSU5LX0hFQURFUiA9IFwieC1yZXF1ZXN0ZWQtd2l0aFwiXG5leHBvcnQgY29uc3QgUkVTUE9OU0VfVVJMX0hFQURFUiA9IFwieC1yZXNwb25zZS11cmxcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1RSSUdHRVIgPSBcImRlYm91bmNlLXRyaWdnZXJcIlxuZXhwb3J0IGNvbnN0IFRIUk9UVExFRCA9IFwidGhyb3R0bGVkXCJcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9QUkVWX0tFWSA9IFwiZGVib3VuY2UtcHJldi1rZXlcIlxuZXhwb3J0IGNvbnN0IERFRkFVTFRTID0ge1xuICBkZWJvdW5jZTogMzAwLFxuICB0aHJvdHRsZTogMzAwXG59XG5cbi8vIFJlbmRlcmVkXG5leHBvcnQgY29uc3QgRFlOQU1JQ1MgPSBcImRcIlxuZXhwb3J0IGNvbnN0IFNUQVRJQyA9IFwic1wiXG5leHBvcnQgY29uc3QgQ09NUE9ORU5UUyA9IFwiY1wiXG5leHBvcnQgY29uc3QgRVZFTlRTID0gXCJlXCJcbmV4cG9ydCBjb25zdCBSRVBMWSA9IFwiclwiXG5leHBvcnQgY29uc3QgVElUTEUgPSBcInRcIlxuZXhwb3J0IGNvbnN0IFRFTVBMQVRFUyA9IFwicFwiXG4iLCAiaW1wb3J0IHtcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRyeVVwbG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZW50cnksIGNodW5rU2l6ZSwgbGl2ZVNvY2tldCl7XG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZW50cnkgPSBlbnRyeVxuICAgIHRoaXMub2Zmc2V0ID0gMFxuICAgIHRoaXMuY2h1bmtTaXplID0gY2h1bmtTaXplXG4gICAgdGhpcy5jaHVua1RpbWVyID0gbnVsbFxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbCA9IGxpdmVTb2NrZXQuY2hhbm5lbChgbHZ1OiR7ZW50cnkucmVmfWAsIHt0b2tlbjogZW50cnkubWV0YWRhdGEoKX0pXG4gIH1cblxuICBlcnJvcihyZWFzb24pe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmNodW5rVGltZXIpXG4gICAgdGhpcy51cGxvYWRDaGFubmVsLmxlYXZlKClcbiAgICB0aGlzLmVudHJ5LmVycm9yKHJlYXNvbilcbiAgfVxuXG4gIHVwbG9hZCgpe1xuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gICAgdGhpcy51cGxvYWRDaGFubmVsLmpvaW4oKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBfZGF0YSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSlcbiAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgcmVhc29uID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgfVxuXG4gIGlzRG9uZSgpeyByZXR1cm4gdGhpcy5vZmZzZXQgPj0gdGhpcy5lbnRyeS5maWxlLnNpemUgfVxuXG4gIHJlYWROZXh0Q2h1bmsoKXtcbiAgICBsZXQgcmVhZGVyID0gbmV3IHdpbmRvdy5GaWxlUmVhZGVyKClcbiAgICBsZXQgYmxvYiA9IHRoaXMuZW50cnkuZmlsZS5zbGljZSh0aGlzLm9mZnNldCwgdGhpcy5jaHVua1NpemUgKyB0aGlzLm9mZnNldClcbiAgICByZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgIGlmKGUudGFyZ2V0LmVycm9yID09PSBudWxsKXtcbiAgICAgICAgdGhpcy5vZmZzZXQgKz0gZS50YXJnZXQucmVzdWx0LmJ5dGVMZW5ndGhcbiAgICAgICAgdGhpcy5wdXNoQ2h1bmsoZS50YXJnZXQucmVzdWx0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxvZ0Vycm9yKFwiUmVhZCBlcnJvcjogXCIgKyBlLnRhcmdldC5lcnJvcilcbiAgICAgIH1cbiAgICB9XG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIH1cblxuICBwdXNoQ2h1bmsoY2h1bmspe1xuICAgIGlmKCF0aGlzLnVwbG9hZENoYW5uZWwuaXNKb2luZWQoKSl7IHJldHVybiB9XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLnB1c2goXCJjaHVua1wiLCBjaHVuaylcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmVudHJ5LnByb2dyZXNzKCh0aGlzLm9mZnNldCAvIHRoaXMuZW50cnkuZmlsZS5zaXplKSAqIDEwMClcbiAgICAgICAgaWYoIXRoaXMuaXNEb25lKCkpe1xuICAgICAgICAgIHRoaXMuY2h1bmtUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWFkTmV4dENodW5rKCksIHRoaXMubGl2ZVNvY2tldC5nZXRMYXRlbmN5U2ltKCkgfHwgMClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9WSUVXX1NFTEVDVE9SXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCBFbnRyeVVwbG9hZGVyIGZyb20gXCIuL2VudHJ5X3VwbG9hZGVyXCJcblxuZXhwb3J0IGxldCBsb2dFcnJvciA9IChtc2csIG9iaikgPT4gY29uc29sZS5lcnJvciAmJiBjb25zb2xlLmVycm9yKG1zZywgb2JqKVxuXG5leHBvcnQgbGV0IGlzQ2lkID0gKGNpZCkgPT4ge1xuICBsZXQgdHlwZSA9IHR5cGVvZihjaWQpXG4gIHJldHVybiB0eXBlID09PSBcIm51bWJlclwiIHx8ICh0eXBlID09PSBcInN0cmluZ1wiICYmIC9eKDB8WzEtOV1cXGQqKSQvLnRlc3QoY2lkKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVjdER1cGxpY2F0ZUlkcygpe1xuICBsZXQgaWRzID0gbmV3IFNldCgpXG4gIGxldCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2lkXVwiKVxuICBmb3IobGV0IGkgPSAwLCBsZW4gPSBlbGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XG4gICAgaWYoaWRzLmhhcyhlbGVtc1tpXS5pZCkpe1xuICAgICAgY29uc29sZS5lcnJvcihgTXVsdGlwbGUgSURzIGRldGVjdGVkOiAke2VsZW1zW2ldLmlkfS4gRW5zdXJlIHVuaXF1ZSBlbGVtZW50IGlkcy5gKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZHMuYWRkKGVsZW1zW2ldLmlkKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbGV0IGRlYnVnID0gKHZpZXcsIGtpbmQsIG1zZywgb2JqKSA9PiB7XG4gIGlmKHZpZXcubGl2ZVNvY2tldC5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICBjb25zb2xlLmxvZyhgJHt2aWV3LmlkfSAke2tpbmR9OiAke21zZ30gLSBgLCBvYmopXG4gIH1cbn1cblxuLy8gd3JhcHMgdmFsdWUgaW4gY2xvc3VyZSBvciByZXR1cm5zIGNsb3N1cmVcbmV4cG9ydCBsZXQgY2xvc3VyZSA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09IFwiZnVuY3Rpb25cIiA/IHZhbCA6IGZ1bmN0aW9uICgpeyByZXR1cm4gdmFsIH1cblxuZXhwb3J0IGxldCBjbG9uZSA9IChvYmopID0+IHsgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSkgfVxuXG5leHBvcnQgbGV0IGNsb3Nlc3RQaHhCaW5kaW5nID0gKGVsLCBiaW5kaW5nLCBib3JkZXJFbCkgPT4ge1xuICBkbyB7XG4gICAgaWYoZWwubWF0Y2hlcyhgWyR7YmluZGluZ31dYCkpeyByZXR1cm4gZWwgfVxuICAgIGVsID0gZWwucGFyZW50RWxlbWVudCB8fCBlbC5wYXJlbnROb2RlXG4gIH0gd2hpbGUoZWwgIT09IG51bGwgJiYgZWwubm9kZVR5cGUgPT09IDEgJiYgISgoYm9yZGVyRWwgJiYgYm9yZGVyRWwuaXNTYW1lTm9kZShlbCkpIHx8IGVsLm1hdGNoZXMoUEhYX1ZJRVdfU0VMRUNUT1IpKSlcbiAgcmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGxldCBpc09iamVjdCA9IChvYmopID0+IHtcbiAgcmV0dXJuIG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiICYmICEob2JqIGluc3RhbmNlb2YgQXJyYXkpXG59XG5cbmV4cG9ydCBsZXQgaXNFcXVhbE9iaiA9IChvYmoxLCBvYmoyKSA9PiBKU09OLnN0cmluZ2lmeShvYmoxKSA9PT0gSlNPTi5zdHJpbmdpZnkob2JqMilcblxuZXhwb3J0IGxldCBpc0VtcHR5ID0gKG9iaikgPT4ge1xuICBmb3IobGV0IHggaW4gb2JqKXsgcmV0dXJuIGZhbHNlIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGxldCBtYXliZSA9IChlbCwgY2FsbGJhY2spID0+IGVsICYmIGNhbGxiYWNrKGVsKVxuXG5leHBvcnQgbGV0IGNoYW5uZWxVcGxvYWRlciA9IGZ1bmN0aW9uIChlbnRyaWVzLCBvbkVycm9yLCByZXNwLCBsaXZlU29ja2V0KXtcbiAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICBsZXQgZW50cnlVcGxvYWRlciA9IG5ldyBFbnRyeVVwbG9hZGVyKGVudHJ5LCByZXNwLmNvbmZpZy5jaHVua19zaXplLCBsaXZlU29ja2V0KVxuICAgIGVudHJ5VXBsb2FkZXIudXBsb2FkKClcbiAgfSlcbn1cbiIsICJsZXQgQnJvd3NlciA9IHtcbiAgY2FuUHVzaFN0YXRlKCl7IHJldHVybiAodHlwZW9mIChoaXN0b3J5LnB1c2hTdGF0ZSkgIT09IFwidW5kZWZpbmVkXCIpIH0sXG5cbiAgZHJvcExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpe1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KSlcbiAgfSxcblxuICB1cGRhdGVMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5LCBpbml0aWFsLCBmdW5jKXtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuZ2V0TG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSlcbiAgICBsZXQga2V5ID0gdGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSlcbiAgICBsZXQgbmV3VmFsID0gY3VycmVudCA9PT0gbnVsbCA/IGluaXRpYWwgOiBmdW5jKGN1cnJlbnQpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShuZXdWYWwpKVxuICAgIHJldHVybiBuZXdWYWxcbiAgfSxcblxuICBnZXRMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KXtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KSkpXG4gIH0sXG5cbiAgdXBkYXRlQ3VycmVudFN0YXRlKGNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5jYW5QdXNoU3RhdGUoKSl7IHJldHVybiB9XG4gICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoY2FsbGJhY2soaGlzdG9yeS5zdGF0ZSB8fCB7fSksIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICB9LFxuXG4gIHB1c2hTdGF0ZShraW5kLCBtZXRhLCB0byl7XG4gICAgaWYodGhpcy5jYW5QdXNoU3RhdGUoKSl7XG4gICAgICBpZih0byAhPT0gd2luZG93LmxvY2F0aW9uLmhyZWYpe1xuICAgICAgICBpZihtZXRhLnR5cGUgPT0gXCJyZWRpcmVjdFwiICYmIG1ldGEuc2Nyb2xsKXtcbiAgICAgICAgICAvLyBJZiB3ZSdyZSByZWRpcmVjdGluZyBzdG9yZSB0aGUgY3VycmVudCBzY3JvbGxZIGZvciB0aGUgY3VycmVudCBoaXN0b3J5IHN0YXRlLlxuICAgICAgICAgIGxldCBjdXJyZW50U3RhdGUgPSBoaXN0b3J5LnN0YXRlIHx8IHt9XG4gICAgICAgICAgY3VycmVudFN0YXRlLnNjcm9sbCA9IG1ldGEuc2Nyb2xsXG4gICAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUoY3VycmVudFN0YXRlLCBcIlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBtZXRhLnNjcm9sbCAvLyBPbmx5IHN0b3JlIHRoZSBzY3JvbGwgaW4gdGhlIHJlZGlyZWN0IGNhc2UuXG4gICAgICAgIGhpc3Rvcnlba2luZCArIFwiU3RhdGVcIl0obWV0YSwgXCJcIiwgdG8gfHwgbnVsbCkgLy8gSUUgd2lsbCBjb2VyY2UgdW5kZWZpbmVkIHRvIHN0cmluZ1xuICAgICAgICBsZXQgaGFzaEVsID0gdGhpcy5nZXRIYXNoVGFyZ2V0RWwod2luZG93LmxvY2F0aW9uLmhhc2gpXG5cbiAgICAgICAgaWYoaGFzaEVsKXtcbiAgICAgICAgICBoYXNoRWwuc2Nyb2xsSW50b1ZpZXcoKVxuICAgICAgICB9IGVsc2UgaWYobWV0YS50eXBlID09PSBcInJlZGlyZWN0XCIpe1xuICAgICAgICAgIHdpbmRvdy5zY3JvbGwoMCwgMClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZGlyZWN0KHRvKVxuICAgIH1cbiAgfSxcblxuICBzZXRDb29raWUobmFtZSwgdmFsdWUpe1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PSR7dmFsdWV9YFxuICB9LFxuXG4gIGdldENvb2tpZShuYW1lKXtcbiAgICByZXR1cm4gZG9jdW1lbnQuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChgKD86KD86XnwuKjtcXHMqKSR7bmFtZX1cXHMqXFw9XFxzKihbXjtdKikuKiQpfF4uKiRgKSwgXCIkMVwiKVxuICB9LFxuXG4gIHJlZGlyZWN0KHRvVVJMLCBmbGFzaCl7XG4gICAgaWYoZmxhc2gpeyBCcm93c2VyLnNldENvb2tpZShcIl9fcGhvZW5peF9mbGFzaF9fXCIsIGZsYXNoICsgXCI7IG1heC1hZ2U9NjAwMDA7IHBhdGg9L1wiKSB9XG4gICAgd2luZG93LmxvY2F0aW9uID0gdG9VUkxcbiAgfSxcblxuICBsb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSl7IHJldHVybiBgJHtuYW1lc3BhY2V9LSR7c3Via2V5fWAgfSxcblxuICBnZXRIYXNoVGFyZ2V0RWwobWF5YmVIYXNoKXtcbiAgICBsZXQgaGFzaCA9IG1heWJlSGFzaC50b1N0cmluZygpLnN1YnN0cmluZygxKVxuICAgIGlmKGhhc2ggPT09IFwiXCIpeyByZXR1cm4gfVxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBhW25hbWU9XCIke2hhc2h9XCJdYClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyXG4iLCAiaW1wb3J0IHtcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgREVCT1VOQ0VfUFJFVl9LRVksXG4gIERFQk9VTkNFX1RSSUdHRVIsXG4gIEZPQ1VTQUJMRV9JTlBVVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9FVkVOVF9DTEFTU0VTLFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9IQVNfU1VCTUlUVEVELFxuICBQSFhfTUFJTixcbiAgUEhYX05PX0ZFRURCQUNLX0NMQVNTLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJJVkFURSxcbiAgUEhYX1JFRixcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1VQTE9BRF9SRUYsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfU1RJQ0tZLFxuICBUSFJPVFRMRURcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgbG9nRXJyb3Jcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5sZXQgRE9NID0ge1xuICBieUlkKGlkKXsgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSB8fCBsb2dFcnJvcihgbm8gaWQgZm91bmQgZm9yICR7aWR9YCkgfSxcblxuICByZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKXtcbiAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSlcbiAgICBpZihlbC5jbGFzc0xpc3QubGVuZ3RoID09PSAwKXsgZWwucmVtb3ZlQXR0cmlidXRlKFwiY2xhc3NcIikgfVxuICB9LFxuXG4gIGFsbChub2RlLCBxdWVyeSwgY2FsbGJhY2spe1xuICAgIGlmKCFub2RlKXsgcmV0dXJuIFtdIH1cbiAgICBsZXQgYXJyYXkgPSBBcnJheS5mcm9tKG5vZGUucXVlcnlTZWxlY3RvckFsbChxdWVyeSkpXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gYXJyYXkuZm9yRWFjaChjYWxsYmFjaykgOiBhcnJheVxuICB9LFxuXG4gIGNoaWxkTm9kZUxlbmd0aChodG1sKXtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGRFbGVtZW50Q291bnRcbiAgfSxcblxuICBpc1VwbG9hZElucHV0KGVsKXsgcmV0dXJuIGVsLnR5cGUgPT09IFwiZmlsZVwiICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRikgIT09IG51bGwgfSxcblxuICBmaW5kVXBsb2FkSW5wdXRzKG5vZGUpeyByZXR1cm4gdGhpcy5hbGwobm9kZSwgYGlucHV0W3R5cGU9XCJmaWxlXCJdWyR7UEhYX1VQTE9BRF9SRUZ9XWApIH0sXG5cbiAgZmluZENvbXBvbmVudE5vZGVMaXN0KG5vZGUsIGNpZCl7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKG5vZGUsIGBbJHtQSFhfQ09NUE9ORU5UfT1cIiR7Y2lkfVwiXWApLCBub2RlKVxuICB9LFxuXG4gIGlzUGh4RGVzdHJveWVkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmlkICYmIERPTS5wcml2YXRlKG5vZGUsIFwiZGVzdHJveWVkXCIpID8gdHJ1ZSA6IGZhbHNlXG4gIH0sXG5cbiAgbWFya1BoeENoaWxkRGVzdHJveWVkKGVsKXtcbiAgICBpZih0aGlzLmlzUGh4Q2hpbGQoZWwpKXsgZWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCBcIlwiKSB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBcImRlc3Ryb3llZFwiLCB0cnVlKVxuICB9LFxuXG4gIGZpbmRQaHhDaGlsZHJlbkluRnJhZ21lbnQoaHRtbCwgcGFyZW50SWQpe1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICByZXR1cm4gdGhpcy5maW5kUGh4Q2hpbGRyZW4odGVtcGxhdGUuY29udGVudCwgcGFyZW50SWQpXG4gIH0sXG5cbiAgaXNJZ25vcmVkKGVsLCBwaHhVcGRhdGUpe1xuICAgIHJldHVybiAoZWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkgfHwgZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtdXBkYXRlXCIpKSA9PT0gXCJpZ25vcmVcIlxuICB9LFxuXG4gIGlzUGh4VXBkYXRlKGVsLCBwaHhVcGRhdGUsIHVwZGF0ZVR5cGVzKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIHVwZGF0ZVR5cGVzLmluZGV4T2YoZWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkpID49IDBcbiAgfSxcblxuICBmaW5kUGh4U3RpY2t5KGVsKXsgcmV0dXJuIHRoaXMuYWxsKGVsLCBgWyR7UEhYX1NUSUNLWX1dYCkgfSxcblxuICBmaW5kUGh4Q2hpbGRyZW4oZWwsIHBhcmVudElkKXtcbiAgICByZXR1cm4gdGhpcy5hbGwoZWwsIGAke1BIWF9WSUVXX1NFTEVDVE9SfVske1BIWF9QQVJFTlRfSUR9PVwiJHtwYXJlbnRJZH1cIl1gKVxuICB9LFxuXG4gIGZpbmRQYXJlbnRDSURzKG5vZGUsIGNpZHMpe1xuICAgIGxldCBpbml0aWFsID0gbmV3IFNldChjaWRzKVxuICAgIGxldCBwYXJlbnRDaWRzID1cbiAgICAgIGNpZHMucmVkdWNlKChhY2MsIGNpZCkgPT4ge1xuICAgICAgICBsZXQgc2VsZWN0b3IgPSBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl0gWyR7UEhYX0NPTVBPTkVOVH1dYFxuXG4gICAgICAgIHRoaXMuZmlsdGVyV2l0aGluU2FtZUxpdmVWaWV3KHRoaXMuYWxsKG5vZGUsIHNlbGVjdG9yKSwgbm9kZSlcbiAgICAgICAgICAubWFwKGVsID0+IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSkpXG4gICAgICAgICAgLmZvckVhY2goY2hpbGRDSUQgPT4gYWNjLmRlbGV0ZShjaGlsZENJRCkpXG5cbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwgaW5pdGlhbClcblxuICAgIHJldHVybiBwYXJlbnRDaWRzLnNpemUgPT09IDAgPyBuZXcgU2V0KGNpZHMpIDogcGFyZW50Q2lkc1xuICB9LFxuXG4gIGZpbHRlcldpdGhpblNhbWVMaXZlVmlldyhub2RlcywgcGFyZW50KXtcbiAgICBpZihwYXJlbnQucXVlcnlTZWxlY3RvcihQSFhfVklFV19TRUxFQ1RPUikpe1xuICAgICAgcmV0dXJuIG5vZGVzLmZpbHRlcihlbCA9PiB0aGlzLndpdGhpblNhbWVMaXZlVmlldyhlbCwgcGFyZW50KSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5vZGVzXG4gICAgfVxuICB9LFxuXG4gIHdpdGhpblNhbWVMaXZlVmlldyhub2RlLCBwYXJlbnQpe1xuICAgIHdoaWxlKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpe1xuICAgICAgaWYobm9kZS5pc1NhbWVOb2RlKHBhcmVudCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICBpZihub2RlLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGwpeyByZXR1cm4gZmFsc2UgfVxuICAgIH1cbiAgfSxcblxuICBwcml2YXRlKGVsLCBrZXkpeyByZXR1cm4gZWxbUEhYX1BSSVZBVEVdICYmIGVsW1BIWF9QUklWQVRFXVtrZXldIH0sXG5cbiAgZGVsZXRlUHJpdmF0ZShlbCwga2V5KXsgZWxbUEhYX1BSSVZBVEVdICYmIGRlbGV0ZSAoZWxbUEhYX1BSSVZBVEVdW2tleV0pIH0sXG5cbiAgcHV0UHJpdmF0ZShlbCwga2V5LCB2YWx1ZSl7XG4gICAgaWYoIWVsW1BIWF9QUklWQVRFXSl7IGVsW1BIWF9QUklWQVRFXSA9IHt9IH1cbiAgICBlbFtQSFhfUFJJVkFURV1ba2V5XSA9IHZhbHVlXG4gIH0sXG5cbiAgdXBkYXRlUHJpdmF0ZShlbCwga2V5LCBkZWZhdWx0VmFsLCB1cGRhdGVGdW5jKXtcbiAgICBsZXQgZXhpc3RpbmcgPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZihleGlzdGluZyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGRlZmF1bHRWYWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhleGlzdGluZykpXG4gICAgfVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgbGV0IHtwcmVmaXgsIHN1ZmZpeH0gPSB0aXRsZUVsLmRhdGFzZXRcbiAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7c3RyfSR7c3VmZml4IHx8IFwiXCJ9YFxuICB9LFxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgYXN5bmNGaWx0ZXIsIGNhbGxiYWNrKXtcbiAgICBsZXQgZGVib3VuY2UgPSBlbC5nZXRBdHRyaWJ1dGUocGh4RGVib3VuY2UpXG4gICAgbGV0IHRocm90dGxlID0gZWwuZ2V0QXR0cmlidXRlKHBoeFRocm90dGxlKVxuICAgIGlmKGRlYm91bmNlID09PSBcIlwiKXsgZGVib3VuY2UgPSBkZWZhdWx0RGVib3VuY2UgfVxuICAgIGlmKHRocm90dGxlID09PSBcIlwiKXsgdGhyb3R0bGUgPSBkZWZhdWx0VGhyb3R0bGUgfVxuICAgIGxldCB2YWx1ZSA9IGRlYm91bmNlIHx8IHRocm90dGxlXG4gICAgc3dpdGNoKHZhbHVlKXtcbiAgICAgIGNhc2UgbnVsbDogcmV0dXJuIGNhbGxiYWNrKClcblxuICAgICAgY2FzZSBcImJsdXJcIjpcbiAgICAgICAgaWYodGhpcy5vbmNlKGVsLCBcImRlYm91bmNlLWJsdXJcIikpe1xuICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IGNhbGxiYWNrKCkpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxldCB0aW1lb3V0ID0gcGFyc2VJbnQodmFsdWUpXG4gICAgICAgIGxldCB0cmlnZ2VyID0gKCkgPT4gdGhyb3R0bGUgPyB0aGlzLmRlbGV0ZVByaXZhdGUoZWwsIFRIUk9UVExFRCkgOiBjYWxsYmFjaygpXG4gICAgICAgIGxldCBjdXJyZW50Q3ljbGUgPSB0aGlzLmluY0N5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCB0cmlnZ2VyKVxuICAgICAgICBpZihpc05hTih0aW1lb3V0KSl7IHJldHVybiBsb2dFcnJvcihgaW52YWxpZCB0aHJvdHRsZS9kZWJvdW5jZSB2YWx1ZTogJHt2YWx1ZX1gKSB9XG4gICAgICAgIGlmKHRocm90dGxlKXtcbiAgICAgICAgICBsZXQgbmV3S2V5RG93biA9IGZhbHNlXG4gICAgICAgICAgaWYoZXZlbnQudHlwZSA9PT0gXCJrZXlkb3duXCIpe1xuICAgICAgICAgICAgbGV0IHByZXZLZXkgPSB0aGlzLnByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZKVxuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBERUJPVU5DRV9QUkVWX0tFWSwgZXZlbnQua2V5KVxuICAgICAgICAgICAgbmV3S2V5RG93biA9IHByZXZLZXkgIT09IGV2ZW50LmtleVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmKCFuZXdLZXlEb3duICYmIHRoaXMucHJpdmF0ZShlbCwgVEhST1RUTEVEKSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBUSFJPVFRMRUQsIHRydWUpXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgaWYoYXN5bmNGaWx0ZXIoKSl7IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSKSB9XG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgY3VycmVudEN5Y2xlKSB9XG4gICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmb3JtID0gZWwuZm9ybVxuICAgICAgICBpZihmb3JtICYmIHRoaXMub25jZShmb3JtLCBcImJpbmQtZGVib3VuY2VcIikpe1xuICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoKSA9PiB7XG4gICAgICAgICAgICBBcnJheS5mcm9tKChuZXcgRm9ybURhdGEoZm9ybSkpLmVudHJpZXMoKSwgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgICAgICBsZXQgaW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYFtuYW1lPVwiJHtuYW1lfVwiXWApXG4gICAgICAgICAgICAgIHRoaXMuaW5jQ3ljbGUoaW5wdXQsIERFQk9VTkNFX1RSSUdHRVIpXG4gICAgICAgICAgICAgIHRoaXMuZGVsZXRlUHJpdmF0ZShpbnB1dCwgVEhST1RUTEVEKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUikpXG4gICAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgdHJpZ2dlckN5Y2xlKGVsLCBrZXksIGN1cnJlbnRDeWNsZSl7XG4gICAgbGV0IFtjeWNsZSwgdHJpZ2dlcl0gPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZighY3VycmVudEN5Y2xlKXsgY3VycmVudEN5Y2xlID0gY3ljbGUgfVxuICAgIGlmKGN1cnJlbnRDeWNsZSA9PT0gY3ljbGUpe1xuICAgICAgdGhpcy5pbmNDeWNsZShlbCwga2V5KVxuICAgICAgdHJpZ2dlcigpXG4gICAgfVxuICB9LFxuXG4gIG9uY2UoZWwsIGtleSl7XG4gICAgaWYodGhpcy5wcml2YXRlKGVsLCBrZXkpID09PSB0cnVlKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdHJ1ZSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGluY0N5Y2xlKGVsLCBrZXksIHRyaWdnZXIgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgbGV0IFtjdXJyZW50Q3ljbGVdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpIHx8IFswLCB0cmlnZ2VyXVxuICAgIGN1cnJlbnRDeWNsZSsrXG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIFtjdXJyZW50Q3ljbGUsIHRyaWdnZXJdKVxuICAgIHJldHVybiBjdXJyZW50Q3ljbGVcbiAgfSxcblxuICBkaXNjYXJkRXJyb3IoY29udGFpbmVyLCBlbCwgcGh4RmVlZGJhY2tGb3Ipe1xuICAgIGxldCBmaWVsZCA9IGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUocGh4RmVlZGJhY2tGb3IpXG4gICAgLy8gVE9ETzogUmVtb3ZlIGlkIGxvb2t1cCBhZnRlciB3ZSB1cGRhdGUgUGhvZW5peCB0byB1c2UgaW5wdXRfbmFtZSBpbnN0ZWFkIG9mIGlucHV0X2lkXG4gICAgbGV0IGlucHV0ID0gZmllbGQgJiYgY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7ZmllbGR9XCJdLCBbbmFtZT1cIiR7ZmllbGR9XCJdLCBbbmFtZT1cIiR7ZmllbGR9W11cIl1gKVxuICAgIGlmKCFpbnB1dCl7IHJldHVybiB9XG5cbiAgICBpZighKHRoaXMucHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VEKSB8fCB0aGlzLnByaXZhdGUoaW5wdXQuZm9ybSwgUEhYX0hBU19TVUJNSVRURUQpKSl7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKFBIWF9OT19GRUVEQkFDS19DTEFTUylcbiAgICB9XG4gIH0sXG5cbiAgc2hvd0Vycm9yKGlucHV0RWwsIHBoeEZlZWRiYWNrRm9yKXtcbiAgICBpZihpbnB1dEVsLmlkIHx8IGlucHV0RWwubmFtZSl7XG4gICAgICB0aGlzLmFsbChpbnB1dEVsLmZvcm0sIGBbJHtwaHhGZWVkYmFja0Zvcn09XCIke2lucHV0RWwuaWR9XCJdLCBbJHtwaHhGZWVkYmFja0Zvcn09XCIke2lucHV0RWwubmFtZX1cIl1gLCAoZWwpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVDbGFzcyhlbCwgUEhYX05PX0ZFRURCQUNLX0NMQVNTKVxuICAgICAgfSlcbiAgICB9XG4gIH0sXG5cbiAgaXNQaHhDaGlsZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1BBUkVOVF9JRClcbiAgfSxcblxuICBpc1BoeFN0aWNreShub2RlKXtcbiAgICByZXR1cm4gbm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1NUSUNLWSkgIT09IG51bGxcbiAgfSxcblxuICBmaXJzdFBoeENoaWxkKGVsKXtcbiAgICByZXR1cm4gdGhpcy5pc1BoeENoaWxkKGVsKSA/IGVsIDogdGhpcy5hbGwoZWwsIGBbJHtQSFhfUEFSRU5UX0lEfV1gKVswXVxuICB9LFxuXG4gIGRpc3BhdGNoRXZlbnQodGFyZ2V0LCBuYW1lLCBvcHRzID0ge30pe1xuICAgIGxldCBidWJibGVzID0gb3B0cy5idWJibGVzID09PSB1bmRlZmluZWQgPyB0cnVlIDogISFvcHRzLmJ1YmJsZXNcbiAgICBsZXQgZXZlbnRPcHRzID0ge2J1YmJsZXM6IGJ1YmJsZXMsIGNhbmNlbGFibGU6IHRydWUsIGRldGFpbDogb3B0cy5kZXRhaWwgfHwge319XG4gICAgbGV0IGV2ZW50ID0gbmFtZSA9PT0gXCJjbGlja1wiID8gbmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiLCBldmVudE9wdHMpIDogbmV3IEN1c3RvbUV2ZW50KG5hbWUsIGV2ZW50T3B0cylcbiAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldmVudClcbiAgfSxcblxuICBjbG9uZU5vZGUobm9kZSwgaHRtbCl7XG4gICAgaWYodHlwZW9mIChodG1sKSA9PT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICByZXR1cm4gbm9kZS5jbG9uZU5vZGUodHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNsb25lZCA9IG5vZGUuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgY2xvbmVkLmlubmVySFRNTCA9IGh0bWxcbiAgICAgIHJldHVybiBjbG9uZWRcbiAgICB9XG4gIH0sXG5cbiAgbWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwgb3B0cyA9IHt9KXtcbiAgICBsZXQgZXhjbHVkZSA9IG9wdHMuZXhjbHVkZSB8fCBbXVxuICAgIGxldCBpc0lnbm9yZWQgPSBvcHRzLmlzSWdub3JlZFxuICAgIGxldCBzb3VyY2VBdHRycyA9IHNvdXJjZS5hdHRyaWJ1dGVzXG4gICAgZm9yKGxldCBpID0gc291cmNlQXR0cnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuICAgICAgbGV0IG5hbWUgPSBzb3VyY2VBdHRyc1tpXS5uYW1lXG4gICAgICBpZihleGNsdWRlLmluZGV4T2YobmFtZSkgPCAwKXsgdGFyZ2V0LnNldEF0dHJpYnV0ZShuYW1lLCBzb3VyY2UuZ2V0QXR0cmlidXRlKG5hbWUpKSB9XG4gICAgfVxuXG4gICAgbGV0IHRhcmdldEF0dHJzID0gdGFyZ2V0LmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSB0YXJnZXRBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHRhcmdldEF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKGlzSWdub3JlZCl7XG4gICAgICAgIGlmKG5hbWUuc3RhcnRzV2l0aChcImRhdGEtXCIpICYmICFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZighc291cmNlLmhhc0F0dHJpYnV0ZShuYW1lKSl7IHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUobmFtZSkgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBtZXJnZUZvY3VzZWRJbnB1dCh0YXJnZXQsIHNvdXJjZSl7XG4gICAgLy8gc2tpcCBzZWxlY3RzIGJlY2F1c2UgRkYgd2lsbCByZXNldCBoaWdobGlnaHRlZCBpbmRleCBmb3IgYW55IHNldEF0dHJpYnV0ZVxuICAgIGlmKCEodGFyZ2V0IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQpKXsgRE9NLm1lcmdlQXR0cnModGFyZ2V0LCBzb3VyY2UsIHtleGNsdWRlOiBbXCJ2YWx1ZVwiXX0pIH1cbiAgICBpZihzb3VyY2UucmVhZE9ubHkpe1xuICAgICAgdGFyZ2V0LnNldEF0dHJpYnV0ZShcInJlYWRvbmx5XCIsIHRydWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKVxuICAgIH1cbiAgfSxcblxuICBoYXNTZWxlY3Rpb25SYW5nZShlbCl7XG4gICAgcmV0dXJuIGVsLnNldFNlbGVjdGlvblJhbmdlICYmIChlbC50eXBlID09PSBcInRleHRcIiB8fCBlbC50eXBlID09PSBcInRleHRhcmVhXCIpXG4gIH0sXG5cbiAgcmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpe1xuICAgIGlmKCFET00uaXNUZXh0dWFsSW5wdXQoZm9jdXNlZCkpeyByZXR1cm4gfVxuICAgIGxldCB3YXNGb2N1c2VkID0gZm9jdXNlZC5tYXRjaGVzKFwiOmZvY3VzXCIpXG4gICAgaWYoZm9jdXNlZC5yZWFkT25seSl7IGZvY3VzZWQuYmx1cigpIH1cbiAgICBpZighd2FzRm9jdXNlZCl7IGZvY3VzZWQuZm9jdXMoKSB9XG4gICAgaWYodGhpcy5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSl7XG4gICAgICBmb2N1c2VkLnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpXG4gICAgfVxuICB9LFxuXG4gIGlzRm9ybUlucHV0KGVsKXsgcmV0dXJuIC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KGVsLnRhZ05hbWUpICYmIGVsLnR5cGUgIT09IFwiYnV0dG9uXCIgfSxcblxuICBzeW5jQXR0cnNUb1Byb3BzKGVsKXtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgJiYgQ0hFQ0tBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUudG9Mb2NhbGVMb3dlckNhc2UoKSkgPj0gMCl7XG4gICAgICBlbC5jaGVja2VkID0gZWwuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKSAhPT0gbnVsbFxuICAgIH1cbiAgfSxcblxuICBpc1RleHR1YWxJbnB1dChlbCl7IHJldHVybiBGT0NVU0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZSkgPj0gMCB9LFxuXG4gIGlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShwaHhUcmlnZ2VyRXh0ZXJuYWwpICE9PSBudWxsXG4gIH0sXG5cbiAgc3luY1BlbmRpbmdSZWYoZnJvbUVsLCB0b0VsLCBkaXNhYmxlV2l0aCl7XG4gICAgbGV0IHJlZiA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRilcbiAgICBpZihyZWYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9XG4gICAgbGV0IHJlZlNyYyA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpXG5cbiAgICBpZihET00uaXNGb3JtSW5wdXQoZnJvbUVsKSB8fCBmcm9tRWwuZ2V0QXR0cmlidXRlKGRpc2FibGVXaXRoKSAhPT0gbnVsbCl7XG4gICAgICBpZihET00uaXNVcGxvYWRJbnB1dChmcm9tRWwpKXsgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7aXNJZ25vcmVkOiB0cnVlfSkgfVxuICAgICAgRE9NLnB1dFByaXZhdGUoZnJvbUVsLCBQSFhfUkVGLCB0b0VsKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIFBIWF9FVkVOVF9DTEFTU0VTLmZvckVhY2goY2xhc3NOYW1lID0+IHtcbiAgICAgICAgZnJvbUVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpICYmIHRvRWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gICAgICB9KVxuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRiwgcmVmKVxuICAgICAgdG9FbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRl9TUkMsIHJlZlNyYylcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9LFxuXG4gIGNsZWFuQ2hpbGROb2Rlcyhjb250YWluZXIsIHBoeFVwZGF0ZSl7XG4gICAgaWYoRE9NLmlzUGh4VXBkYXRlKGNvbnRhaW5lciwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSl7XG4gICAgICBsZXQgdG9SZW1vdmUgPSBbXVxuICAgICAgY29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaChjaGlsZE5vZGUgPT4ge1xuICAgICAgICBpZighY2hpbGROb2RlLmlkKXtcbiAgICAgICAgICAvLyBTa2lwIHdhcm5pbmcgaWYgaXQncyBhbiBlbXB0eSB0ZXh0IG5vZGUgKGUuZy4gYSBuZXctbGluZSlcbiAgICAgICAgICBsZXQgaXNFbXB0eVRleHROb2RlID0gY2hpbGROb2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSAmJiBjaGlsZE5vZGUubm9kZVZhbHVlLnRyaW0oKSA9PT0gXCJcIlxuICAgICAgICAgIGlmKCFpc0VtcHR5VGV4dE5vZGUpe1xuICAgICAgICAgICAgbG9nRXJyb3IoXCJvbmx5IEhUTUwgZWxlbWVudCB0YWdzIHdpdGggYW4gaWQgYXJlIGFsbG93ZWQgaW5zaWRlIGNvbnRhaW5lcnMgd2l0aCBwaHgtdXBkYXRlLlxcblxcblwiICtcbiAgICAgICAgICAgICAgYHJlbW92aW5nIGlsbGVnYWwgbm9kZTogXCIkeyhjaGlsZE5vZGUub3V0ZXJIVE1MIHx8IGNoaWxkTm9kZS5ub2RlVmFsdWUpLnRyaW0oKX1cIlxcblxcbmApXG4gICAgICAgICAgfVxuICAgICAgICAgIHRvUmVtb3ZlLnB1c2goY2hpbGROb2RlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdG9SZW1vdmUuZm9yRWFjaChjaGlsZE5vZGUgPT4gY2hpbGROb2RlLnJlbW92ZSgpKVxuICAgIH1cbiAgfSxcblxuICByZXBsYWNlUm9vdENvbnRhaW5lcihjb250YWluZXIsIHRhZ05hbWUsIGF0dHJzKXtcbiAgICBsZXQgcmV0YWluZWRBdHRycyA9IG5ldyBTZXQoW1wiaWRcIiwgUEhYX1NFU1NJT04sIFBIWF9TVEFUSUMsIFBIWF9NQUlOLCBQSFhfUk9PVF9JRF0pXG4gICAgaWYoY29udGFpbmVyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpKXtcbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmF0dHJpYnV0ZXMpXG4gICAgICAgIC5maWx0ZXIoYXR0ciA9PiAhcmV0YWluZWRBdHRycy5oYXMoYXR0ci5uYW1lLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAuZm9yRWFjaChhdHRyID0+IGNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKSlcblxuICAgICAgT2JqZWN0LmtleXMoYXR0cnMpXG4gICAgICAgIC5maWx0ZXIobmFtZSA9PiAhcmV0YWluZWRBdHRycy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgLmZvckVhY2goYXR0ciA9PiBjb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGF0dHJzW2F0dHJdKSlcblxuICAgICAgcmV0dXJuIGNvbnRhaW5lclxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG4gICAgICBPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChhdHRyID0+IG5ld0NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pKVxuICAgICAgcmV0YWluZWRBdHRycy5mb3JFYWNoKGF0dHIgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBjb250YWluZXIuZ2V0QXR0cmlidXRlKGF0dHIpKSlcbiAgICAgIG5ld0NvbnRhaW5lci5pbm5lckhUTUwgPSBjb250YWluZXIuaW5uZXJIVE1MXG4gICAgICBjb250YWluZXIucmVwbGFjZVdpdGgobmV3Q29udGFpbmVyKVxuICAgICAgcmV0dXJuIG5ld0NvbnRhaW5lclxuICAgIH1cbiAgfSxcblxuICBnZXRTdGlja3koZWwsIG5hbWUsIGRlZmF1bHRWYWwpe1xuICAgIGxldCBvcCA9IChET00ucHJpdmF0ZShlbCwgXCJzdGlja3lcIikgfHwgW10pLmZpbmQoKFtleGlzdGluZ05hbWUsIF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICBpZihvcCl7XG4gICAgICBsZXQgW19uYW1lLCBfb3AsIHN0YXNoZWRSZXN1bHRdID0gb3BcbiAgICAgIHJldHVybiBzdGFzaGVkUmVzdWx0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0eXBlb2YoZGVmYXVsdFZhbCkgPT09IFwiZnVuY3Rpb25cIiA/IGRlZmF1bHRWYWwoKSA6IGRlZmF1bHRWYWxcbiAgICB9XG4gIH0sXG5cbiAgZGVsZXRlU3RpY2t5KGVsLCBuYW1lKXtcbiAgICB0aGlzLnVwZGF0ZVByaXZhdGUoZWwsIFwic3RpY2t5XCIsIFtdLCBvcHMgPT4ge1xuICAgICAgcmV0dXJuIG9wcy5maWx0ZXIoKFtleGlzdGluZ05hbWUsIF9dKSA9PiBleGlzdGluZ05hbWUgIT09IG5hbWUpXG4gICAgfSlcbiAgfSxcblxuICBwdXRTdGlja3koZWwsIG5hbWUsIG9wKXtcbiAgICBsZXQgc3Rhc2hlZFJlc3VsdCA9IG9wKGVsKVxuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICBsZXQgZXhpc3RpbmdJbmRleCA9IG9wcy5maW5kSW5kZXgoKFtleGlzdGluZ05hbWUsIF0pID0+IG5hbWUgPT09IGV4aXN0aW5nTmFtZSlcbiAgICAgIGlmKGV4aXN0aW5nSW5kZXggPj0gMCl7XG4gICAgICAgIG9wc1tleGlzdGluZ0luZGV4XSA9IFtuYW1lLCBvcCwgc3Rhc2hlZFJlc3VsdF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wcy5wdXNoKFtuYW1lLCBvcCwgc3Rhc2hlZFJlc3VsdF0pXG4gICAgICB9XG4gICAgICByZXR1cm4gb3BzXG4gICAgfSlcbiAgfSxcblxuICBhcHBseVN0aWNreU9wZXJhdGlvbnMoZWwpe1xuICAgIGxldCBvcHMgPSBET00ucHJpdmF0ZShlbCwgXCJzdGlja3lcIilcbiAgICBpZighb3BzKXsgcmV0dXJuIH1cblxuICAgIG9wcy5mb3JFYWNoKChbbmFtZSwgb3AsIF9zdGFzaGVkXSkgPT4gdGhpcy5wdXRTdGlja3koZWwsIG5hbWUsIG9wKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBET01cbiIsICJpbXBvcnQge1xuICBQSFhfQUNUSVZFX0VOVFJZX1JFRlMsXG4gIFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlNcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2hhbm5lbFVwbG9hZGVyLFxuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVwbG9hZEVudHJ5IHtcbiAgc3RhdGljIGlzQWN0aXZlKGZpbGVFbCwgZmlsZSl7XG4gICAgbGV0IGlzTmV3ID0gZmlsZS5fcGh4UmVmID09PSB1bmRlZmluZWRcbiAgICBsZXQgYWN0aXZlUmVmcyA9IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNBY3RpdmUgPSBhY3RpdmVSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDBcbiAgICByZXR1cm4gZmlsZS5zaXplID4gMCAmJiAoaXNOZXcgfHwgaXNBY3RpdmUpXG4gIH1cblxuICBzdGF0aWMgaXNQcmVmbGlnaHRlZChmaWxlRWwsIGZpbGUpe1xuICAgIGxldCBwcmVmbGlnaHRlZFJlZnMgPSBmaWxlRWwuZ2V0QXR0cmlidXRlKFBIWF9QUkVGTElHSFRFRF9SRUZTKS5zcGxpdChcIixcIilcbiAgICBsZXQgaXNQcmVmbGlnaHRlZCA9IHByZWZsaWdodGVkUmVmcy5pbmRleE9mKExpdmVVcGxvYWRlci5nZW5GaWxlUmVmKGZpbGUpKSA+PSAwXG4gICAgcmV0dXJuIGlzUHJlZmxpZ2h0ZWQgJiYgdGhpcy5pc0FjdGl2ZShmaWxlRWwsIGZpbGUpXG4gIH1cblxuICBjb25zdHJ1Y3RvcihmaWxlRWwsIGZpbGUsIHZpZXcpe1xuICAgIHRoaXMucmVmID0gTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSlcbiAgICB0aGlzLmZpbGVFbCA9IGZpbGVFbFxuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5tZXRhID0gbnVsbFxuICAgIHRoaXMuX2lzQ2FuY2VsbGVkID0gZmFsc2VcbiAgICB0aGlzLl9pc0RvbmUgPSBmYWxzZVxuICAgIHRoaXMuX3Byb2dyZXNzID0gMFxuICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAtMVxuICAgIHRoaXMuX29uRG9uZSA9IGZ1bmN0aW9uICgpeyB9XG4gICAgdGhpcy5fb25FbFVwZGF0ZWQgPSB0aGlzLm9uRWxVcGRhdGVkLmJpbmQodGhpcylcbiAgICB0aGlzLmZpbGVFbC5hZGRFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gIH1cblxuICBtZXRhZGF0YSgpeyByZXR1cm4gdGhpcy5tZXRhIH1cblxuICBwcm9ncmVzcyhwcm9ncmVzcyl7XG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLmZsb29yKHByb2dyZXNzKVxuICAgIGlmKHRoaXMuX3Byb2dyZXNzID4gdGhpcy5fbGFzdFByb2dyZXNzU2VudCl7XG4gICAgICBpZih0aGlzLl9wcm9ncmVzcyA+PSAxMDApe1xuICAgICAgICB0aGlzLl9wcm9ncmVzcyA9IDEwMFxuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gMTAwXG4gICAgICAgIHRoaXMuX2lzRG9uZSA9IHRydWVcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCAxMDAsICgpID0+IHtcbiAgICAgICAgICBMaXZlVXBsb2FkZXIudW50cmFja0ZpbGUodGhpcy5maWxlRWwsIHRoaXMuZmlsZSlcbiAgICAgICAgICB0aGlzLl9vbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IHRoaXMuX3Byb2dyZXNzXG4gICAgICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwgdGhpcy5fcHJvZ3Jlc3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2FuY2VsKCl7XG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSB0cnVlXG4gICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgIHRoaXMuX29uRG9uZSgpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMuX2lzRG9uZSB9XG5cbiAgZXJyb3IocmVhc29uID0gXCJmYWlsZWRcIil7XG4gICAgdGhpcy5maWxlRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgIHRoaXMudmlldy5wdXNoRmlsZVByb2dyZXNzKHRoaXMuZmlsZUVsLCB0aGlzLnJlZiwge2Vycm9yOiByZWFzb259KVxuICAgIExpdmVVcGxvYWRlci5jbGVhckZpbGVzKHRoaXMuZmlsZUVsKVxuICB9XG5cbiAgLy9wcml2YXRlXG5cbiAgb25Eb25lKGNhbGxiYWNrKXtcbiAgICB0aGlzLl9vbkRvbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLmZpbGVFbC5yZW1vdmVFdmVudExpc3RlbmVyKFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCwgdGhpcy5fb25FbFVwZGF0ZWQpXG4gICAgICBjYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgb25FbFVwZGF0ZWQoKXtcbiAgICBsZXQgYWN0aXZlUmVmcyA9IHRoaXMuZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGlmKGFjdGl2ZVJlZnMuaW5kZXhPZih0aGlzLnJlZikgPT09IC0xKXsgdGhpcy5jYW5jZWwoKSB9XG4gIH1cblxuICB0b1ByZWZsaWdodFBheWxvYWQoKXtcbiAgICByZXR1cm4ge1xuICAgICAgbGFzdF9tb2RpZmllZDogdGhpcy5maWxlLmxhc3RNb2RpZmllZCxcbiAgICAgIG5hbWU6IHRoaXMuZmlsZS5uYW1lLFxuICAgICAgcmVsYXRpdmVfcGF0aDogdGhpcy5maWxlLndlYmtpdFJlbGF0aXZlUGF0aCxcbiAgICAgIHNpemU6IHRoaXMuZmlsZS5zaXplLFxuICAgICAgdHlwZTogdGhpcy5maWxlLnR5cGUsXG4gICAgICByZWY6IHRoaXMucmVmXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkZXIodXBsb2FkZXJzKXtcbiAgICBpZih0aGlzLm1ldGEudXBsb2FkZXIpe1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApXG4gICAgICByZXR1cm4ge25hbWU6IHRoaXMubWV0YS51cGxvYWRlciwgY2FsbGJhY2s6IGNhbGxiYWNrfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge25hbWU6IFwiY2hhbm5lbFwiLCBjYWxsYmFjazogY2hhbm5lbFVwbG9hZGVyfVxuICAgIH1cbiAgfVxuXG4gIHppcFBvc3RGbGlnaHQocmVzcCl7XG4gICAgdGhpcy5tZXRhID0gcmVzcC5lbnRyaWVzW3RoaXMucmVmXVxuICAgIGlmKCF0aGlzLm1ldGEpeyBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHtpbnB1dDogdGhpcy5maWxlRWwsIHJlc3BvbnNlOiByZXNwfSkgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0RPTkVfUkVGUyxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFVwbG9hZEVudHJ5IGZyb20gXCIuL3VwbG9hZF9lbnRyeVwiXG5cbmxldCBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlVXBsb2FkZXIge1xuICBzdGF0aWMgZ2VuRmlsZVJlZihmaWxlKXtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmXG4gICAgaWYocmVmICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHJlZlxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlLl9waHhSZWYgPSAobGl2ZVVwbG9hZGVyRmlsZVJlZisrKS50b1N0cmluZygpXG4gICAgICByZXR1cm4gZmlsZS5fcGh4UmVmXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEVudHJ5RGF0YVVSTChpbnB1dEVsLCByZWYsIGNhbGxiYWNrKXtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmaWxlID0+IHRoaXMuZ2VuRmlsZVJlZihmaWxlKSA9PT0gcmVmKVxuICAgIGNhbGxiYWNrKFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gIH1cblxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKXtcbiAgICBsZXQgYWN0aXZlID0gMFxuICAgIERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbCkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpICE9PSBpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX0RPTkVfUkVGUykpe1xuICAgICAgICBhY3RpdmUrK1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFjdGl2ZSA+IDBcbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpe1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbClcbiAgICBsZXQgZmlsZURhdGEgPSB7fVxuICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBsZXQgZW50cnkgPSB7cGF0aDogaW5wdXRFbC5uYW1lfVxuICAgICAgbGV0IHVwbG9hZFJlZiA9IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW11cbiAgICAgIGVudHJ5LnJlZiA9IHRoaXMuZ2VuRmlsZVJlZihmaWxlKVxuICAgICAgZW50cnkubGFzdF9tb2RpZmllZCA9IGZpbGUubGFzdE1vZGlmaWVkXG4gICAgICBlbnRyeS5uYW1lID0gZmlsZS5uYW1lIHx8IGVudHJ5LnJlZlxuICAgICAgZW50cnkucmVsYXRpdmVfcGF0aCA9IGZpbGUud2Via2l0UmVsYXRpdmVQYXRoXG4gICAgICBlbnRyeS50eXBlID0gZmlsZS50eXBlXG4gICAgICBlbnRyeS5zaXplID0gZmlsZS5zaXplXG4gICAgICBmaWxlRGF0YVt1cGxvYWRSZWZdLnB1c2goZW50cnkpXG4gICAgfSlcbiAgICByZXR1cm4gZmlsZURhdGFcbiAgfVxuXG4gIHN0YXRpYyBjbGVhckZpbGVzKGlucHV0RWwpe1xuICAgIGlucHV0RWwudmFsdWUgPSBudWxsXG4gICAgaW5wdXRFbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpXG4gICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBbXSlcbiAgfVxuXG4gIHN0YXRpYyB1bnRyYWNrRmlsZShpbnB1dEVsLCBmaWxlKXtcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIERPTS5wcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIikuZmlsdGVyKGYgPT4gIU9iamVjdC5pcyhmLCBmaWxlKSkpXG4gIH1cblxuICBzdGF0aWMgdHJhY2tGaWxlcyhpbnB1dEVsLCBmaWxlcyl7XG4gICAgaWYoaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJtdWx0aXBsZVwiKSAhPT0gbnVsbCl7XG4gICAgICBsZXQgbmV3RmlsZXMgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiAhdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5maW5kKGYgPT4gT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgdGhpcy5hY3RpdmVGaWxlcyhpbnB1dEVsKS5jb25jYXQobmV3RmlsZXMpKVxuICAgICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCBmaWxlcylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpe1xuICAgIGxldCBmaWxlSW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKVxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcihlbCA9PiBlbC5maWxlcyAmJiB0aGlzLmFjdGl2ZUZpbGVzKGVsKS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGFjdGl2ZUZpbGVzKGlucHV0KXtcbiAgICByZXR1cm4gKERPTS5wcml2YXRlKGlucHV0LCBcImZpbGVzXCIpIHx8IFtdKS5maWx0ZXIoZiA9PiBVcGxvYWRFbnRyeS5pc0FjdGl2ZShpbnB1dCwgZikpXG4gIH1cblxuICBzdGF0aWMgaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKXtcbiAgICBsZXQgZmlsZUlucHV0cyA9IERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbClcbiAgICByZXR1cm4gQXJyYXkuZnJvbShmaWxlSW5wdXRzKS5maWx0ZXIoaW5wdXQgPT4gdGhpcy5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0KS5sZW5ndGggPiAwKVxuICB9XG5cbiAgc3RhdGljIGZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpe1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0KS5maWx0ZXIoZiA9PiAhVXBsb2FkRW50cnkuaXNQcmVmbGlnaHRlZChpbnB1dCwgZikpXG4gIH1cblxuICBjb25zdHJ1Y3RvcihpbnB1dEVsLCB2aWV3LCBvbkNvbXBsZXRlKXtcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5vbkNvbXBsZXRlID0gb25Db21wbGV0ZVxuICAgIHRoaXMuX2VudHJpZXMgPVxuICAgICAgQXJyYXkuZnJvbShMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKSB8fCBbXSlcbiAgICAgICAgLm1hcChmaWxlID0+IG5ldyBVcGxvYWRFbnRyeShpbnB1dEVsLCBmaWxlLCB2aWV3KSlcblxuICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPSB0aGlzLl9lbnRyaWVzLmxlbmd0aFxuICB9XG5cbiAgZW50cmllcygpeyByZXR1cm4gdGhpcy5fZW50cmllcyB9XG5cbiAgaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgbGl2ZVNvY2tldCl7XG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICB0aGlzLl9lbnRyaWVzLm1hcChlbnRyeSA9PiB7XG4gICAgICAgIGVudHJ5LnppcFBvc3RGbGlnaHQocmVzcClcbiAgICAgICAgZW50cnkub25Eb25lKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm51bUVudHJpZXNJblByb2dyZXNzLS1cbiAgICAgICAgICBpZih0aGlzLm51bUVudHJpZXNJblByb2dyZXNzID09PSAwKXsgdGhpcy5vbkNvbXBsZXRlKCkgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZW50cnlcbiAgICAgIH0pXG5cbiAgICBsZXQgZ3JvdXBlZEVudHJpZXMgPSB0aGlzLl9lbnRyaWVzLnJlZHVjZSgoYWNjLCBlbnRyeSkgPT4ge1xuICAgICAgbGV0IHtuYW1lLCBjYWxsYmFja30gPSBlbnRyeS51cGxvYWRlcihsaXZlU29ja2V0LnVwbG9hZGVycylcbiAgICAgIGFjY1tuYW1lXSA9IGFjY1tuYW1lXSB8fCB7Y2FsbGJhY2s6IGNhbGxiYWNrLCBlbnRyaWVzOiBbXX1cbiAgICAgIGFjY1tuYW1lXS5lbnRyaWVzLnB1c2goZW50cnkpXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwge30pXG5cbiAgICBmb3IobGV0IG5hbWUgaW4gZ3JvdXBlZEVudHJpZXMpe1xuICAgICAgbGV0IHtjYWxsYmFjaywgZW50cmllc30gPSBncm91cGVkRW50cmllc1tuYW1lXVxuICAgICAgY2FsbGJhY2soZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldClcbiAgICB9XG4gIH1cbn1cbiIsICJsZXQgQVJJQSA9IHtcbiAgZm9jdXNNYWluKCl7XG4gICAgbGV0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluIGgxLCBtYWluLCBoMVwiKVxuICAgIGlmKHRhcmdldCl7XG4gICAgICBsZXQgb3JpZ1RhYkluZGV4ID0gdGFyZ2V0LnRhYkluZGV4XG4gICAgICB0YXJnZXQudGFiSW5kZXggPSAtMVxuICAgICAgdGFyZ2V0LmZvY3VzKClcbiAgICAgIHRhcmdldC50YWJJbmRleCA9IG9yaWdUYWJJbmRleFxuICAgIH1cbiAgfSxcblxuICBhbnlPZihpbnN0YW5jZSwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmZpbmQobmFtZSA9PiBpbnN0YW5jZSBpbnN0YW5jZW9mIG5hbWUpIH0sXG5cbiAgaXNGb2N1c2FibGUoZWwsIGludGVyYWN0aXZlT25seSl7XG4gICAgcmV0dXJuKFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFuY2hvckVsZW1lbnQgJiYgZWwucmVsICE9PSBcImlnbm9yZVwiKSB8fFxuICAgICAgKGVsIGluc3RhbmNlb2YgSFRNTEFyZWFFbGVtZW50ICYmIGVsLmhyZWYgIT09IHVuZGVmaW5lZCkgfHxcbiAgICAgICghZWwuZGlzYWJsZWQgJiYgKHRoaXMuYW55T2YoZWwsIFtIVE1MSW5wdXRFbGVtZW50LCBIVE1MU2VsZWN0RWxlbWVudCwgSFRNTFRleHRBcmVhRWxlbWVudCwgSFRNTEJ1dHRvbkVsZW1lbnRdKSkpIHx8XG4gICAgICAoZWwgaW5zdGFuY2VvZiBIVE1MSUZyYW1lRWxlbWVudCkgfHxcbiAgICAgIChlbC50YWJJbmRleCA+IDAgfHwgKCFpbnRlcmFjdGl2ZU9ubHkgJiYgZWwudGFiSW5kZXggPT09IDAgJiYgZWwuZ2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIikgIT09IG51bGwgJiYgZWwuZ2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIikgIT09IFwidHJ1ZVwiKSlcbiAgICApXG4gIH0sXG5cbiAgYXR0ZW1wdEZvY3VzKGVsLCBpbnRlcmFjdGl2ZU9ubHkpe1xuICAgIGlmKHRoaXMuaXNGb2N1c2FibGUoZWwsIGludGVyYWN0aXZlT25seSkpeyB0cnl7IGVsLmZvY3VzKCkgfSBjYXRjaChlKXt9IH1cbiAgICByZXR1cm4gISFkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShlbClcbiAgfSxcblxuICBmb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpe1xuICAgIGxldCBjaGlsZCA9IGVsLmZpcnN0RWxlbWVudENoaWxkXG4gICAgd2hpbGUoY2hpbGQpe1xuICAgICAgaWYodGhpcy5hdHRlbXB0Rm9jdXMoY2hpbGQsIHRydWUpIHx8IHRoaXMuZm9jdXNGaXJzdEludGVyYWN0aXZlKGNoaWxkLCB0cnVlKSl7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjaGlsZCA9IGNoaWxkLm5leHRFbGVtZW50U2libGluZ1xuICAgIH1cbiAgfSxcblxuICBmb2N1c0ZpcnN0KGVsKXtcbiAgICBsZXQgY2hpbGQgPSBlbC5maXJzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzRmlyc3QoY2hpbGQpKXtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9LFxuXG4gIGZvY3VzTGFzdChlbCl7XG4gICAgbGV0IGNoaWxkID0gZWwubGFzdEVsZW1lbnRDaGlsZFxuICAgIHdoaWxlKGNoaWxkKXtcbiAgICAgIGlmKHRoaXMuYXR0ZW1wdEZvY3VzKGNoaWxkKSB8fCB0aGlzLmZvY3VzTGFzdChjaGlsZCkpe1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgICAgY2hpbGQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nXG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBBUklBIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcbmltcG9ydCBBUklBIGZyb20gXCIuL2FyaWFcIlxuXG5sZXQgSG9va3MgPSB7XG4gIExpdmVGaWxlVXBsb2FkOiB7XG4gICAgYWN0aXZlUmVmcygpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKSB9LFxuXG4gICAgcHJlZmxpZ2h0ZWRSZWZzKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfUFJFRkxJR0hURURfUkVGUykgfSxcblxuICAgIG1vdW50ZWQoKXsgdGhpcy5wcmVmbGlnaHRlZFdhcyA9IHRoaXMucHJlZmxpZ2h0ZWRSZWZzKCkgfSxcblxuICAgIHVwZGF0ZWQoKXtcbiAgICAgIGxldCBuZXdQcmVmbGlnaHRzID0gdGhpcy5wcmVmbGlnaHRlZFJlZnMoKVxuICAgICAgaWYodGhpcy5wcmVmbGlnaHRlZFdhcyAhPT0gbmV3UHJlZmxpZ2h0cyl7XG4gICAgICAgIHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSBuZXdQcmVmbGlnaHRzXG4gICAgICAgIGlmKG5ld1ByZWZsaWdodHMgPT09IFwiXCIpe1xuICAgICAgICAgIHRoaXMuX192aWV3LmNhbmNlbFN1Ym1pdCh0aGlzLmVsLmZvcm0pXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYodGhpcy5hY3RpdmVSZWZzKCkgPT09IFwiXCIpeyB0aGlzLmVsLnZhbHVlID0gbnVsbCB9XG4gICAgICB0aGlzLmVsLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFBIWF9MSVZFX0ZJTEVfVVBEQVRFRCkpXG4gICAgfVxuICB9LFxuXG4gIExpdmVJbWdQcmV2aWV3OiB7XG4gICAgbW91bnRlZCgpe1xuICAgICAgdGhpcy5yZWYgPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LWVudHJ5LXJlZlwiKVxuICAgICAgdGhpcy5pbnB1dEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpKVxuICAgICAgTGl2ZVVwbG9hZGVyLmdldEVudHJ5RGF0YVVSTCh0aGlzLmlucHV0RWwsIHRoaXMucmVmLCB1cmwgPT4ge1xuICAgICAgICB0aGlzLnVybCA9IHVybFxuICAgICAgICB0aGlzLmVsLnNyYyA9IHVybFxuICAgICAgfSlcbiAgICB9LFxuICAgIGRlc3Ryb3llZCgpe1xuICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh0aGlzLnVybClcbiAgICB9XG4gIH0sXG4gIEZvY3VzV3JhcDoge1xuICAgIG1vdW50ZWQoKXtcbiAgICAgIHRoaXMuZm9jdXNTdGFydCA9IHRoaXMuZWwuZmlyc3RFbGVtZW50Q2hpbGRcbiAgICAgIHRoaXMuZm9jdXNFbmQgPSB0aGlzLmVsLmxhc3RFbGVtZW50Q2hpbGRcbiAgICAgIHRoaXMuZm9jdXNTdGFydC5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4gQVJJQS5mb2N1c0xhc3QodGhpcy5lbCkpXG4gICAgICB0aGlzLmZvY3VzRW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiBBUklBLmZvY3VzRmlyc3QodGhpcy5lbCkpXG4gICAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6c2hvdy1lbmRcIiwgKCkgPT4gdGhpcy5lbC5mb2N1cygpKVxuICAgICAgaWYod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbCkuZGlzcGxheSAhPT0gXCJub25lXCIpe1xuICAgICAgICBBUklBLmZvY3VzRmlyc3QodGhpcy5lbClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSG9va3NcbiIsICJpbXBvcnQge1xuICBtYXliZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUG9zdE1vcnBoUmVzdG9yZXIge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXJCZWZvcmUsIGNvbnRhaW5lckFmdGVyLCB1cGRhdGVUeXBlKXtcbiAgICBsZXQgaWRzQmVmb3JlID0gbmV3IFNldCgpXG4gICAgbGV0IGlkc0FmdGVyID0gbmV3IFNldChbLi4uY29udGFpbmVyQWZ0ZXIuY2hpbGRyZW5dLm1hcChjaGlsZCA9PiBjaGlsZC5pZCkpXG5cbiAgICBsZXQgZWxlbWVudHNUb01vZGlmeSA9IFtdXG5cbiAgICBBcnJheS5mcm9tKGNvbnRhaW5lckJlZm9yZS5jaGlsZHJlbikuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICBpZihjaGlsZC5pZCl7IC8vIGFsbCBvZiBvdXIgY2hpbGRyZW4gc2hvdWxkIGJlIGVsZW1lbnRzIHdpdGggaWRzXG4gICAgICAgIGlkc0JlZm9yZS5hZGQoY2hpbGQuaWQpXG4gICAgICAgIGlmKGlkc0FmdGVyLmhhcyhjaGlsZC5pZCkpe1xuICAgICAgICAgIGxldCBwcmV2aW91c0VsZW1lbnRJZCA9IGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgY2hpbGQucHJldmlvdXNFbGVtZW50U2libGluZy5pZFxuICAgICAgICAgIGVsZW1lbnRzVG9Nb2RpZnkucHVzaCh7ZWxlbWVudElkOiBjaGlsZC5pZCwgcHJldmlvdXNFbGVtZW50SWQ6IHByZXZpb3VzRWxlbWVudElkfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmNvbnRhaW5lcklkID0gY29udGFpbmVyQWZ0ZXIuaWRcbiAgICB0aGlzLnVwZGF0ZVR5cGUgPSB1cGRhdGVUeXBlXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5ID0gZWxlbWVudHNUb01vZGlmeVxuICAgIHRoaXMuZWxlbWVudElkc1RvQWRkID0gWy4uLmlkc0FmdGVyXS5maWx0ZXIoaWQgPT4gIWlkc0JlZm9yZS5oYXMoaWQpKVxuICB9XG5cbiAgLy8gV2UgZG8gdGhlIGZvbGxvd2luZyB0byBvcHRpbWl6ZSBhcHBlbmQvcHJlcGVuZCBvcGVyYXRpb25zOlxuICAvLyAgIDEpIFRyYWNrIGlkcyBvZiBtb2RpZmllZCBlbGVtZW50cyAmIG9mIG5ldyBlbGVtZW50c1xuICAvLyAgIDIpIEFsbCB0aGUgbW9kaWZpZWQgZWxlbWVudHMgYXJlIHB1dCBiYWNrIGluIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZSBET00gdHJlZVxuICAvLyAgICAgIGJ5IHN0b3JpbmcgdGhlIGlkIG9mIHRoZWlyIHByZXZpb3VzIHNpYmxpbmdcbiAgLy8gICAzKSBOZXcgZWxlbWVudHMgYXJlIGdvaW5nIHRvIGJlIHB1dCBpbiB0aGUgcmlnaHQgcGxhY2UgYnkgbW9ycGhkb20gZHVyaW5nIGFwcGVuZC5cbiAgLy8gICAgICBGb3IgcHJlcGVuZCwgd2UgbW92ZSB0aGVtIHRvIHRoZSBmaXJzdCBwb3NpdGlvbiBpbiB0aGUgY29udGFpbmVyXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQgY29udGFpbmVyID0gRE9NLmJ5SWQodGhpcy5jb250YWluZXJJZClcbiAgICB0aGlzLmVsZW1lbnRzVG9Nb2RpZnkuZm9yRWFjaChlbGVtZW50VG9Nb2RpZnkgPT4ge1xuICAgICAgaWYoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKXtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LnByZXZpb3VzRWxlbWVudElkKSwgcHJldmlvdXNFbGVtID0+IHtcbiAgICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgICBsZXQgaXNJblJpZ2h0UGxhY2UgPSBlbGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmlkID09IHByZXZpb3VzRWxlbS5pZFxuICAgICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbGVtLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyZW5kXCIsIGVsZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGNvbnRhaW5lclxuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50VG9Nb2RpZnkuZWxlbWVudElkKSwgZWxlbSA9PiB7XG4gICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nID09IG51bGxcbiAgICAgICAgICBpZighaXNJblJpZ2h0UGxhY2Upe1xuICAgICAgICAgICAgY29udGFpbmVyLmluc2VydEFkamFjZW50RWxlbWVudChcImFmdGVyYmVnaW5cIiwgZWxlbSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmKHRoaXMudXBkYXRlVHlwZSA9PSBcInByZXBlbmRcIil7XG4gICAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZC5yZXZlcnNlKCkuZm9yRWFjaChlbGVtSWQgPT4ge1xuICAgICAgICBtYXliZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtSWQpLCBlbGVtID0+IGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiIsICJ2YXIgRE9DVU1FTlRfRlJBR01FTlRfTk9ERSA9IDExO1xuXG5mdW5jdGlvbiBtb3JwaEF0dHJzKGZyb21Ob2RlLCB0b05vZGUpIHtcbiAgICB2YXIgdG9Ob2RlQXR0cnMgPSB0b05vZGUuYXR0cmlidXRlcztcbiAgICB2YXIgYXR0cjtcbiAgICB2YXIgYXR0ck5hbWU7XG4gICAgdmFyIGF0dHJOYW1lc3BhY2VVUkk7XG4gICAgdmFyIGF0dHJWYWx1ZTtcbiAgICB2YXIgZnJvbVZhbHVlO1xuXG4gICAgLy8gZG9jdW1lbnQtZnJhZ21lbnRzIGRvbnQgaGF2ZSBhdHRyaWJ1dGVzIHNvIGxldHMgbm90IGRvIGFueXRoaW5nXG4gICAgaWYgKHRvTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSB8fCBmcm9tTm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50XG4gICAgZm9yICh2YXIgaSA9IHRvTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGF0dHIgPSB0b05vZGVBdHRyc1tpXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcbiAgICAgICAgYXR0clZhbHVlID0gYXR0ci52YWx1ZTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZU5TKGF0dHJOYW1lc3BhY2VVUkksIGF0dHJOYW1lKTtcblxuICAgICAgICAgICAgaWYgKGZyb21WYWx1ZSAhPT0gYXR0clZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHIucHJlZml4ID09PSAneG1sbnMnKXtcbiAgICAgICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7IC8vIEl0J3Mgbm90IGFsbG93ZWQgdG8gc2V0IGFuIGF0dHJpYnV0ZSB3aXRoIHRoZSBYTUxOUyBuYW1lc3BhY2Ugd2l0aG91dCBzcGVjaWZ5aW5nIHRoZSBgeG1sbnNgIHByZWZpeFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21WYWx1ZSA9IGZyb21Ob2RlLmdldEF0dHJpYnV0ZShhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgYXR0clZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhbnkgZXh0cmEgYXR0cmlidXRlcyBmb3VuZCBvbiB0aGUgb3JpZ2luYWwgRE9NIGVsZW1lbnQgdGhhdFxuICAgIC8vIHdlcmVuJ3QgZm91bmQgb24gdGhlIHRhcmdldCBlbGVtZW50LlxuICAgIHZhciBmcm9tTm9kZUF0dHJzID0gZnJvbU5vZGUuYXR0cmlidXRlcztcblxuICAgIGZvciAodmFyIGQgPSBmcm9tTm9kZUF0dHJzLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgICAgIGF0dHIgPSBmcm9tTm9kZUF0dHJzW2RdO1xuICAgICAgICBhdHRyTmFtZSA9IGF0dHIubmFtZTtcbiAgICAgICAgYXR0ck5hbWVzcGFjZVVSSSA9IGF0dHIubmFtZXNwYWNlVVJJO1xuXG4gICAgICAgIGlmIChhdHRyTmFtZXNwYWNlVVJJKSB7XG4gICAgICAgICAgICBhdHRyTmFtZSA9IGF0dHIubG9jYWxOYW1lIHx8IGF0dHJOYW1lO1xuXG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5yZW1vdmVBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRvTm9kZS5oYXNBdHRyaWJ1dGUoYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxudmFyIHJhbmdlOyAvLyBDcmVhdGUgYSByYW5nZSBvYmplY3QgZm9yIGVmZmljZW50bHkgcmVuZGVyaW5nIHN0cmluZ3MgdG8gZWxlbWVudHMuXG52YXIgTlNfWEhUTUwgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCc7XG5cbnZhciBkb2MgPSB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogZG9jdW1lbnQ7XG52YXIgSEFTX1RFTVBMQVRFX1NVUFBPUlQgPSAhIWRvYyAmJiAnY29udGVudCcgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG52YXIgSEFTX1JBTkdFX1NVUFBPUlQgPSAhIWRvYyAmJiBkb2MuY3JlYXRlUmFuZ2UgJiYgJ2NyZWF0ZUNvbnRleHR1YWxGcmFnbWVudCcgaW4gZG9jLmNyZWF0ZVJhbmdlKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cikge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJhbmdlID0gZG9jLmNyZWF0ZVJhbmdlKCk7XG4gICAgICAgIHJhbmdlLnNlbGVjdE5vZGUoZG9jLmJvZHkpO1xuICAgIH1cblxuICAgIHZhciBmcmFnbWVudCA9IHJhbmdlLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzdHIpO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cikge1xuICAgIHZhciBmcmFnbWVudCA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XG4gICAgZnJhZ21lbnQuaW5uZXJIVE1MID0gc3RyO1xuICAgIHJldHVybiBmcmFnbWVudC5jaGlsZE5vZGVzWzBdO1xufVxuXG4vKipcbiAqIFRoaXMgaXMgYWJvdXQgdGhlIHNhbWVcbiAqIHZhciBodG1sID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhzdHIsICd0ZXh0L2h0bWwnKTtcbiAqIHJldHVybiBodG1sLmJvZHkuZmlyc3RDaGlsZDtcbiAqXG4gKiBAbWV0aG9kIHRvRWxlbWVudFxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICovXG5mdW5jdGlvbiB0b0VsZW1lbnQoc3RyKSB7XG4gICAgc3RyID0gc3RyLnRyaW0oKTtcbiAgICBpZiAoSEFTX1RFTVBMQVRFX1NVUFBPUlQpIHtcbiAgICAgIC8vIGF2b2lkIHJlc3RyaWN0aW9ucyBvbiBjb250ZW50IGZvciB0aGluZ3MgbGlrZSBgPHRyPjx0aD5IaTwvdGg+PC90cj5gIHdoaWNoXG4gICAgICAvLyBjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQgZG9lc24ndCBzdXBwb3J0XG4gICAgICAvLyA8dGVtcGxhdGU+IHN1cHBvcnQgbm90IGF2YWlsYWJsZSBpbiBJRVxuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVRlbXBsYXRlKHN0cik7XG4gICAgfSBlbHNlIGlmIChIQVNfUkFOR0VfU1VQUE9SVCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVJhbmdlKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNyZWF0ZUZyYWdtZW50RnJvbVdyYXAoc3RyKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdHdvIG5vZGUncyBuYW1lcyBhcmUgdGhlIHNhbWUuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgYm90aGVyIGNoZWNraW5nIGBuYW1lc3BhY2VVUklgIGJlY2F1c2UgeW91IHdpbGwgbmV2ZXIgZmluZCB0d28gSFRNTCBlbGVtZW50cyB3aXRoIHRoZSBzYW1lXG4gKiAgICAgICBub2RlTmFtZSBhbmQgZGlmZmVyZW50IG5hbWVzcGFjZSBVUklzLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiIFRoZSB0YXJnZXQgZWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZU5vZGVOYW1lcyhmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgZnJvbU5vZGVOYW1lID0gZnJvbUVsLm5vZGVOYW1lO1xuICAgIHZhciB0b05vZGVOYW1lID0gdG9FbC5ub2RlTmFtZTtcbiAgICB2YXIgZnJvbUNvZGVTdGFydCwgdG9Db2RlU3RhcnQ7XG5cbiAgICBpZiAoZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZyb21Db2RlU3RhcnQgPSBmcm9tTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcbiAgICB0b0NvZGVTdGFydCA9IHRvTm9kZU5hbWUuY2hhckNvZGVBdCgwKTtcblxuICAgIC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBpcyBhIHZpcnR1YWwgRE9NIG5vZGUgb3IgU1ZHIG5vZGUgdGhlbiB3ZSBtYXlcbiAgICAvLyBuZWVkIHRvIG5vcm1hbGl6ZSB0aGUgdGFnIG5hbWUgYmVmb3JlIGNvbXBhcmluZy4gTm9ybWFsIEhUTUwgZWxlbWVudHMgdGhhdCBhcmVcbiAgICAvLyBpbiB0aGUgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCJcbiAgICAvLyBhcmUgY29udmVydGVkIHRvIHVwcGVyIGNhc2VcbiAgICBpZiAoZnJvbUNvZGVTdGFydCA8PSA5MCAmJiB0b0NvZGVTdGFydCA+PSA5NykgeyAvLyBmcm9tIGlzIHVwcGVyIGFuZCB0byBpcyBsb3dlclxuICAgICAgICByZXR1cm4gZnJvbU5vZGVOYW1lID09PSB0b05vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIGlmICh0b0NvZGVTdGFydCA8PSA5MCAmJiBmcm9tQ29kZVN0YXJ0ID49IDk3KSB7IC8vIHRvIGlzIHVwcGVyIGFuZCBmcm9tIGlzIGxvd2VyXG4gICAgICAgIHJldHVybiB0b05vZGVOYW1lID09PSBmcm9tTm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbiBlbGVtZW50LCBvcHRpb25hbGx5IHdpdGggYSBrbm93biBuYW1lc3BhY2UgVVJJLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIHRoZSBlbGVtZW50IG5hbWUsIGUuZy4gJ2Rpdicgb3IgJ3N2ZydcbiAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZXNwYWNlVVJJXSB0aGUgZWxlbWVudCdzIG5hbWVzcGFjZSBVUkksIGkuZS4gdGhlIHZhbHVlIG9mXG4gKiBpdHMgYHhtbG5zYCBhdHRyaWJ1dGUgb3IgaXRzIGluZmVycmVkIG5hbWVzcGFjZS5cbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50TlMobmFtZSwgbmFtZXNwYWNlVVJJKSB7XG4gICAgcmV0dXJuICFuYW1lc3BhY2VVUkkgfHwgbmFtZXNwYWNlVVJJID09PSBOU19YSFRNTCA/XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50KG5hbWUpIDpcbiAgICAgICAgZG9jLmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIG5hbWUpO1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgY2hpbGRyZW4gb2Ygb25lIERPTSBlbGVtZW50IHRvIGFub3RoZXIgRE9NIGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gbW92ZUNoaWxkcmVuKGZyb21FbCwgdG9FbCkge1xuICAgIHZhciBjdXJDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgIHRvRWwuYXBwZW5kQ2hpbGQoY3VyQ2hpbGQpO1xuICAgICAgICBjdXJDaGlsZCA9IG5leHRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIHRvRWw7XG59XG5cbmZ1bmN0aW9uIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCBuYW1lKSB7XG4gICAgaWYgKGZyb21FbFtuYW1lXSAhPT0gdG9FbFtuYW1lXSkge1xuICAgICAgICBmcm9tRWxbbmFtZV0gPSB0b0VsW25hbWVdO1xuICAgICAgICBpZiAoZnJvbUVsW25hbWVdKSB7XG4gICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKG5hbWUsICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciBzcGVjaWFsRWxIYW5kbGVycyA9IHtcbiAgICBPUFRJT046IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICB2YXIgcGFyZW50Tm9kZSA9IGZyb21FbC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgdmFyIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlLm5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBwYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgcGFyZW50TmFtZSA9IHBhcmVudE5vZGUgJiYgcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdTRUxFQ1QnICYmICFwYXJlbnROb2RlLmhhc0F0dHJpYnV0ZSgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgICAgICAgIGlmIChmcm9tRWwuaGFzQXR0cmlidXRlKCdzZWxlY3RlZCcpICYmICF0b0VsLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIE1TIEVkZ2UgYnVnIHdoZXJlIHRoZSAnc2VsZWN0ZWQnIGF0dHJpYnV0ZSBjYW4gb25seSBiZVxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVkIGlmIHNldCB0byBhIG5vbi1lbXB0eSB2YWx1ZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvMTIwODc2NzkvXG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gcmVzZXQgc2VsZWN0IGVsZW1lbnQncyBzZWxlY3RlZEluZGV4IHRvIC0xLCBvdGhlcndpc2Ugc2V0dGluZ1xuICAgICAgICAgICAgICAgIC8vIGZyb21FbC5zZWxlY3RlZCB1c2luZyB0aGUgc3luY0Jvb2xlYW5BdHRyUHJvcCBiZWxvdyBoYXMgbm8gZWZmZWN0LlxuICAgICAgICAgICAgICAgIC8vIFRoZSBjb3JyZWN0IHNlbGVjdGVkSW5kZXggd2lsbCBiZSBzZXQgaW4gdGhlIFNFTEVDVCBzcGVjaWFsIGhhbmRsZXIgYmVsb3cuXG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdzZWxlY3RlZCcpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogVGhlIFwidmFsdWVcIiBhdHRyaWJ1dGUgaXMgc3BlY2lhbCBmb3IgdGhlIDxpbnB1dD4gZWxlbWVudCBzaW5jZSBpdCBzZXRzXG4gICAgICogdGhlIGluaXRpYWwgdmFsdWUuIENoYW5naW5nIHRoZSBcInZhbHVlXCIgYXR0cmlidXRlIHdpdGhvdXQgY2hhbmdpbmcgdGhlXG4gICAgICogXCJ2YWx1ZVwiIHByb3BlcnR5IHdpbGwgaGF2ZSBubyBlZmZlY3Qgc2luY2UgaXQgaXMgb25seSB1c2VkIHRvIHRoZSBzZXQgdGhlXG4gICAgICogaW5pdGlhbCB2YWx1ZS4gIFNpbWlsYXIgZm9yIHRoZSBcImNoZWNrZWRcIiBhdHRyaWJ1dGUsIGFuZCBcImRpc2FibGVkXCIuXG4gICAgICovXG4gICAgSU5QVVQ6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgJ2NoZWNrZWQnKTtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdkaXNhYmxlZCcpO1xuXG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IHRvRWwudmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCd2YWx1ZScpKSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIFRFWFRBUkVBOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdG9FbC52YWx1ZTtcbiAgICAgICAgaWYgKGZyb21FbC52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIGZyb21FbC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpcnN0Q2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgaWYgKGZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIC8vIE5lZWRlZCBmb3IgSUUuIEFwcGFyZW50bHkgSUUgc2V0cyB0aGUgcGxhY2Vob2xkZXIgYXMgdGhlXG4gICAgICAgICAgICAvLyBub2RlIHZhbHVlIGFuZCB2aXNlIHZlcnNhLiBUaGlzIGlnbm9yZXMgYW4gZW1wdHkgdXBkYXRlLlxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gZmlyc3RDaGlsZC5ub2RlVmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZSA9PSBuZXdWYWx1ZSB8fCAoIW5ld1ZhbHVlICYmIG9sZFZhbHVlID09IGZyb21FbC5wbGFjZWhvbGRlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpcnN0Q2hpbGQubm9kZVZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIFNFTEVDVDogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIGlmICghdG9FbC5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgIHZhciBzZWxlY3RlZEluZGV4ID0gLTE7XG4gICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHRvIGxvb3AgdGhyb3VnaCBjaGlsZHJlbiBvZiBmcm9tRWwsIG5vdCB0b0VsIHNpbmNlIG5vZGVzIGNhbiBiZSBtb3ZlZFxuICAgICAgICAgICAgLy8gZnJvbSB0b0VsIHRvIGZyb21FbCBkaXJlY3RseSB3aGVuIG1vcnBoaW5nLlxuICAgICAgICAgICAgLy8gQXQgdGhlIHRpbWUgdGhpcyBzcGVjaWFsIGhhbmRsZXIgaXMgaW52b2tlZCwgYWxsIGNoaWxkcmVuIGhhdmUgYWxyZWFkeSBiZWVuIG1vcnBoZWRcbiAgICAgICAgICAgIC8vIGFuZCBhcHBlbmRlZCB0byAvIHJlbW92ZWQgZnJvbSBmcm9tRWwsIHNvIHVzaW5nIGZyb21FbCBoZXJlIGlzIHNhZmUgYW5kIGNvcnJlY3QuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBvcHRncm91cDtcbiAgICAgICAgICAgIHZhciBub2RlTmFtZTtcbiAgICAgICAgICAgIHdoaWxlKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgbm9kZU5hbWUgPSBjdXJDaGlsZC5ub2RlTmFtZSAmJiBjdXJDaGlsZC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVEdST1VQJykge1xuICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IGN1ckNoaWxkO1xuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVOYW1lID09PSAnT1BUSU9OJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckNoaWxkLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY3VyQ2hpbGQgJiYgb3B0Z3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gb3B0Z3JvdXAubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRncm91cCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZyb21FbC5zZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbnZhciBFTEVNRU5UX05PREUgPSAxO1xudmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUkMSA9IDExO1xudmFyIFRFWFRfTk9ERSA9IDM7XG52YXIgQ09NTUVOVF9OT0RFID0gODtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbmZ1bmN0aW9uIGRlZmF1bHRHZXROb2RlS2V5KG5vZGUpIHtcbiAgaWYgKG5vZGUpIHtcbiAgICAgIHJldHVybiAobm9kZS5nZXRBdHRyaWJ1dGUgJiYgbm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykpIHx8IG5vZGUuaWQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gbW9ycGhkb21GYWN0b3J5KG1vcnBoQXR0cnMpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbiBtb3JwaGRvbShmcm9tTm9kZSwgdG9Ob2RlLCBvcHRpb25zKSB7XG4gICAgICAgIGlmICghb3B0aW9ucykge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0b05vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoZnJvbU5vZGUubm9kZU5hbWUgPT09ICcjZG9jdW1lbnQnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnSFRNTCcgfHwgZnJvbU5vZGUubm9kZU5hbWUgPT09ICdCT0RZJykge1xuICAgICAgICAgICAgICAgIHZhciB0b05vZGVIdG1sID0gdG9Ob2RlO1xuICAgICAgICAgICAgICAgIHRvTm9kZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdodG1sJyk7XG4gICAgICAgICAgICAgICAgdG9Ob2RlLmlubmVySFRNTCA9IHRvTm9kZUh0bWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvTm9kZSA9IHRvRWxlbWVudCh0b05vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGdldE5vZGVLZXkgPSBvcHRpb25zLmdldE5vZGVLZXkgfHwgZGVmYXVsdEdldE5vZGVLZXk7XG4gICAgICAgIHZhciBvbkJlZm9yZU5vZGVBZGRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlQWRkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uTm9kZUFkZGVkID0gb3B0aW9ucy5vbk5vZGVBZGRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25CZWZvcmVFbFVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbkVsVXBkYXRlZCA9IG9wdGlvbnMub25FbFVwZGF0ZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uQmVmb3JlTm9kZURpc2NhcmRlZCA9IG9wdGlvbnMub25CZWZvcmVOb2RlRGlzY2FyZGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbk5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCA9IG9wdGlvbnMub25CZWZvcmVFbENoaWxkcmVuVXBkYXRlZCB8fCBub29wO1xuICAgICAgICB2YXIgY2hpbGRyZW5Pbmx5ID0gb3B0aW9ucy5jaGlsZHJlbk9ubHkgPT09IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBvYmplY3QgaXMgdXNlZCBhcyBhIGxvb2t1cCB0byBxdWlja2x5IGZpbmQgYWxsIGtleWVkIGVsZW1lbnRzIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS5cbiAgICAgICAgdmFyIGZyb21Ob2Rlc0xvb2t1cCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHZhciBrZXllZFJlbW92YWxMaXN0ID0gW107XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkS2V5ZWRSZW1vdmFsKGtleSkge1xuICAgICAgICAgICAga2V5ZWRSZW1vdmFsTGlzdC5wdXNoKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB3YWxrRGlzY2FyZGVkQ2hpbGROb2Rlcyhub2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChza2lwS2V5ZWROb2RlcyAmJiAoa2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSBhcmUgc2tpcHBpbmcga2V5ZWQgbm9kZXMgdGhlbiB3ZSBhZGQgdGhlIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYSBsaXN0IHNvIHRoYXQgaXQgY2FuIGJlIGhhbmRsZWQgYXQgdGhlIHZlcnkgZW5kLlxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHJlcG9ydCB0aGUgbm9kZSBhcyBkaXNjYXJkZWQgaWYgaXQgaXMgbm90IGtleWVkLiBXZSBkbyB0aGlzIGJlY2F1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF0IHRoZSBlbmQgd2UgbG9vcCB0aHJvdWdoIGFsbCBrZXllZCBlbGVtZW50cyB0aGF0IHdlcmUgdW5tYXRjaGVkXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgdGhlbiBkaXNjYXJkIHRoZW0gaW4gb25lIGZpbmFsIHBhc3MuXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckNoaWxkLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrRGlzY2FyZGVkQ2hpbGROb2RlcyhjdXJDaGlsZCwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyBhIERPTSBub2RlIG91dCBvZiB0aGUgb3JpZ2luYWwgRE9NXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9IG5vZGUgVGhlIG5vZGUgdG8gcmVtb3ZlXG4gICAgICAgICAqIEBwYXJhbSAge05vZGV9IHBhcmVudE5vZGUgVGhlIG5vZGVzIHBhcmVudFxuICAgICAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBza2lwS2V5ZWROb2RlcyBJZiB0cnVlIHRoZW4gZWxlbWVudHMgd2l0aCBrZXlzIHdpbGwgYmUgc2tpcHBlZCBhbmQgbm90IGRpc2NhcmRlZC5cbiAgICAgICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAgICAgKi9cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlLCBwYXJlbnROb2RlLCBza2lwS2V5ZWROb2Rlcykge1xuICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZURpc2NhcmRlZChub2RlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKG5vZGUpO1xuICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLy8gVHJlZVdhbGtlciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAgICAgLy8gZnVuY3Rpb24gaW5kZXhUcmVlKHJvb3QpIHtcbiAgICAgICAgLy8gICAgIHZhciB0cmVlV2Fsa2VyID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihcbiAgICAgICAgLy8gICAgICAgICByb290LFxuICAgICAgICAvLyAgICAgICAgIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIHZhciBlbDtcbiAgICAgICAgLy8gICAgIHdoaWxlKChlbCA9IHRyZWVXYWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgICAgLy8gICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShlbCk7XG4gICAgICAgIC8vICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAvLyAgICAgICAgICAgICBmcm9tTm9kZXNMb29rdXBba2V5XSA9IGVsO1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuXG4gICAgICAgIC8vIC8vIE5vZGVJdGVyYXRvciBpbXBsZW1lbnRhdGlvbiBpcyBubyBmYXN0ZXIsIGJ1dCBrZWVwaW5nIHRoaXMgYXJvdW5kIGluIGNhc2UgdGhpcyBjaGFuZ2VzIGluIHRoZSBmdXR1cmVcbiAgICAgICAgLy9cbiAgICAgICAgLy8gZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgICAgLy8gICAgIHZhciBub2RlSXRlcmF0b3IgPSBkb2N1bWVudC5jcmVhdGVOb2RlSXRlcmF0b3Iobm9kZSwgTm9kZUZpbHRlci5TSE9XX0VMRU1FTlQpO1xuICAgICAgICAvLyAgICAgdmFyIGVsO1xuICAgICAgICAvLyAgICAgd2hpbGUoKGVsID0gbm9kZUl0ZXJhdG9yLm5leHROb2RlKCkpKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgICAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBlbDtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICBmdW5jdGlvbiBpbmRleFRyZWUobm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdhbGsgcmVjdXJzaXZlbHlcbiAgICAgICAgICAgICAgICAgICAgaW5kZXhUcmVlKGN1ckNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGluZGV4VHJlZShmcm9tTm9kZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlTm9kZUFkZGVkKGVsKSB7XG4gICAgICAgICAgICBvbk5vZGVBZGRlZChlbCk7XG5cbiAgICAgICAgICAgIHZhciBjdXJDaGlsZCA9IGVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjdXJDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1bm1hdGNoZWRGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgZmluZCBhIGR1cGxpY2F0ZSAjaWQgbm9kZSBpbiBjYWNoZSwgcmVwbGFjZSBgZWxgIHdpdGggY2FjaGUgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgLy8gYW5kIG1vcnBoIGl0IHRvIHRoZSBjaGlsZCBub2RlLlxuICAgICAgICAgICAgICAgICAgICBpZiAodW5tYXRjaGVkRnJvbUVsICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyQ2hpbGQsIHVubWF0Y2hlZEZyb21FbCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHVubWF0Y2hlZEZyb21FbCwgY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGNhbGwgZm9yIGN1ckNoaWxkIGFuZCBpdCdzIGNoaWxkcmVuIHRvIHNlZSBpZiB3ZSBmaW5kIHNvbWV0aGluZyBpblxuICAgICAgICAgICAgICAgICAgLy8gZnJvbU5vZGVzTG9va3VwXG4gICAgICAgICAgICAgICAgICBoYW5kbGVOb2RlQWRkZWQoY3VyQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gbmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwRnJvbUVsKGZyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgIC8vIFdlIGhhdmUgcHJvY2Vzc2VkIGFsbCBvZiB0aGUgXCJ0byBub2Rlc1wiLiBJZiBjdXJGcm9tTm9kZUNoaWxkIGlzXG4gICAgICAgICAgICAvLyBub24tbnVsbCB0aGVuIHdlIHN0aWxsIGhhdmUgc29tZSBmcm9tIG5vZGVzIGxlZnQgb3ZlciB0aGF0IG5lZWRcbiAgICAgICAgICAgIC8vIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgaWYgKChjdXJGcm9tTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyRnJvbU5vZGVDaGlsZCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFjdHVhbCByZW1vdmFsIHRvIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW9ycGhFbChmcm9tRWwsIHRvRWwsIGNoaWxkcmVuT25seSkge1xuICAgICAgICAgICAgdmFyIHRvRWxLZXkgPSBnZXROb2RlS2V5KHRvRWwpO1xuXG4gICAgICAgICAgICBpZiAodG9FbEtleSkge1xuICAgICAgICAgICAgICAgIC8vIElmIGFuIGVsZW1lbnQgd2l0aCBhbiBJRCBpcyBiZWluZyBtb3JwaGVkIHRoZW4gaXQgd2lsbCBiZSBpbiB0aGUgZmluYWxcbiAgICAgICAgICAgICAgICAvLyBET00gc28gY2xlYXIgaXQgb3V0IG9mIHRoZSBzYXZlZCBlbGVtZW50cyBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgZGVsZXRlIGZyb21Ob2Rlc0xvb2t1cFt0b0VsS2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbk9ubHkpIHtcbiAgICAgICAgICAgICAgICAvLyBvcHRpb25hbFxuICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsVXBkYXRlZChmcm9tRWwsIHRvRWwpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIGF0dHJpYnV0ZXMgb24gb3JpZ2luYWwgRE9NIGVsZW1lbnQgZmlyc3RcbiAgICAgICAgICAgICAgICBtb3JwaEF0dHJzKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgICAgICAgICBvbkVsVXBkYXRlZChmcm9tRWwpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZyb21FbC5ub2RlTmFtZSAhPT0gJ1RFWFRBUkVBJykge1xuICAgICAgICAgICAgICBtb3JwaENoaWxkcmVuKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVycy5URVhUQVJFQShmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgICAgIHZhciBjdXJUb05vZGVDaGlsZCA9IHRvRWwuZmlyc3RDaGlsZDtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlS2V5O1xuICAgICAgICAgICAgdmFyIGN1ckZyb21Ob2RlS2V5O1xuXG4gICAgICAgICAgICB2YXIgZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgdmFyIHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmdGcm9tRWw7XG5cbiAgICAgICAgICAgIC8vIHdhbGsgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICBvdXRlcjogd2hpbGUgKGN1clRvTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdG9OZXh0U2libGluZyA9IGN1clRvTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGN1clRvTm9kZUtleSA9IGdldE5vZGVLZXkoY3VyVG9Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgLy8gd2FsayB0aGUgZnJvbU5vZGUgY2hpbGRyZW4gYWxsIHRoZSB3YXkgdGhyb3VnaFxuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJGcm9tTm9kZUNoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21OZXh0U2libGluZyA9IGN1ckZyb21Ob2RlQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUgJiYgY3VyVG9Ob2RlQ2hpbGQuaXNTYW1lTm9kZShjdXJGcm9tTm9kZUNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZVR5cGUgPSBjdXJGcm9tTm9kZUNoaWxkLm5vZGVUeXBlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgbWVhbnMgaWYgdGhlIGN1ckZyb21Ob2RlQ2hpbGQgZG9lc250IGhhdmUgYSBtYXRjaCB3aXRoIHRoZSBjdXJUb05vZGVDaGlsZFxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNDb21wYXRpYmxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZVR5cGUgPT09IGN1clRvTm9kZUNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBFbGVtZW50IG5vZGVzXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSB0YXJnZXQgbm9kZSBoYXMgYSBrZXkgc28gd2Ugd2FudCB0byBtYXRjaCBpdCB1cCB3aXRoIHRoZSBjb3JyZWN0IGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVLZXkgIT09IGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY3VycmVudCBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCBET00gdHJlZSBkb2VzIG5vdCBoYXZlIGEgbWF0Y2hpbmcga2V5IHNvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZXQncyBjaGVjayBvdXIgbG9va3VwIHRvIHNlZSBpZiB0aGVyZSBpcyBhIG1hdGNoaW5nIGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBET00gdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChtYXRjaGluZ0Zyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtjdXJUb05vZGVLZXldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmcm9tTmV4dFNpYmxpbmcgPT09IG1hdGNoaW5nRnJvbUVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3Igc2luZ2xlIGVsZW1lbnQgcmVtb3ZhbHMuIFRvIGF2b2lkIHJlbW92aW5nIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBET00gbm9kZSBvdXQgb2YgdGhlIHRyZWUgKHNpbmNlIHRoYXQgY2FuIGJyZWFrIENTUyB0cmFuc2l0aW9ucywgZXRjLiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgaW5zdGVhZCBkaXNjYXJkIHRoZSBjdXJyZW50IG5vZGUgYW5kIHdhaXQgdW50aWwgdGhlIG5leHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXRlcmF0aW9uIHRvIHByb3Blcmx5IG1hdGNoIHVwIHRoZSBrZXllZCB0YXJnZXQgZWxlbWVudCB3aXRoIGl0cyBtYXRjaGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbWF0Y2hpbmcga2V5ZWQgZWxlbWVudCBzb21ld2hlcmUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMZXQncyBtb3ZlIHRoZSBvcmlnaW5hbCBET00gbm9kZSBpbnRvIHRoZSBjdXJyZW50IHBvc2l0aW9uIGFuZCBtb3JwaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdC5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBXZSB1c2UgaW5zZXJ0QmVmb3JlIGluc3RlYWQgb2YgcmVwbGFjZUNoaWxkIGJlY2F1c2Ugd2Ugd2FudCB0byBnbyB0aHJvdWdoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBgcmVtb3ZlTm9kZSgpYCBmdW5jdGlvbiBmb3IgdGhlIG5vZGUgdGhhdCBpcyBiZWluZyBkaXNjYXJkZWQgc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwgbGlmZWN5Y2xlIGhvb2tzIGFyZSBjb3JyZWN0bHkgaW52b2tlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuaW5zZXJ0QmVmb3JlKG1hdGNoaW5nRnJvbUVsLCBjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2luY2UgdGhlIG5vZGUgaXMga2V5ZWQgaXQgbWlnaHQgYmUgbWF0Y2hlZCB1cCBsYXRlciBzbyB3ZSBkZWZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFjdHVhbCByZW1vdmFsIHRvIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogd2Ugc2tpcCBuZXN0ZWQga2V5ZWQgbm9kZXMgZnJvbSBiZWluZyByZW1vdmVkIHNpbmNlIHRoZXJlIGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShjdXJGcm9tTm9kZUNoaWxkLCBmcm9tRWwsIHRydWUgLyogc2tpcCBrZXllZCBub2RlcyAqLyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gbWF0Y2hpbmdGcm9tRWw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgbm9kZXMgYXJlIG5vdCBjb21wYXRpYmxlIHNpbmNlIHRoZSBcInRvXCIgbm9kZSBoYXMgYSBrZXkgYW5kIHRoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXMgbm8gbWF0Y2hpbmcga2V5ZWQgbm9kZSBpbiB0aGUgc291cmNlIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG9yaWdpbmFsIGhhcyBhIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBpc0NvbXBhdGlibGUgIT09IGZhbHNlICYmIGNvbXBhcmVOb2RlTmFtZXMoY3VyRnJvbU5vZGVDaGlsZCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZm91bmQgY29tcGF0aWJsZSBET00gZWxlbWVudHMgc28gdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IFwiZnJvbVwiIG5vZGUgdG8gbWF0Y2ggdGhlIGN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0IERPTSBub2RlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNT1JQSFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3JwaEVsKGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBURVhUX05PREUgfHwgY3VyRnJvbU5vZGVUeXBlID09IENPTU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEJvdGggbm9kZXMgYmVpbmcgY29tcGFyZWQgYXJlIFRleHQgb3IgQ29tbWVudCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGF0aWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2ltcGx5IHVwZGF0ZSBub2RlVmFsdWUgb24gdGhlIG9yaWdpbmFsIG5vZGUgdG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2UgdGhlIHRleHQgdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgIT09IGN1clRvTm9kZUNoaWxkLm5vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkLm5vZGVWYWx1ZSA9IGN1clRvTm9kZUNoaWxkLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0NvbXBhdGlibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkdmFuY2UgYm90aCB0aGUgXCJ0b1wiIGNoaWxkIGFuZCB0aGUgXCJmcm9tXCIgY2hpbGQgc2luY2Ugd2UgZm91bmQgYSBtYXRjaFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90aGluZyBlbHNlIHRvIGRvIGFzIHdlIGFscmVhZHkgcmVjdXJzaXZlbHkgY2FsbGVkIG1vcnBoQ2hpbGRyZW4gYWJvdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGNvbXBhdGlibGUgbWF0Y2ggc28gcmVtb3ZlIHRoZSBvbGQgbm9kZSBmcm9tIHRoZSBET00gYW5kIGNvbnRpbnVlIHRyeWluZyB0byBmaW5kIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2ggaW4gdGhlIG9yaWdpbmFsIERPTS4gSG93ZXZlciwgd2Ugb25seSBkbyB0aGlzIGlmIHRoZSBmcm9tIG5vZGUgaXMgbm90IGtleWVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIGl0IGlzIHBvc3NpYmxlIHRoYXQgYSBrZXllZCBub2RlIG1pZ2h0IG1hdGNoIHVwIHdpdGggYSBub2RlIHNvbWV3aGVyZSBlbHNlIGluIHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyB0YXJnZXQgdHJlZSBhbmQgd2UgZG9uJ3Qgd2FudCB0byBkaXNjYXJkIGl0IGp1c3QgeWV0IHNpbmNlIGl0IHN0aWxsIG1pZ2h0IGZpbmQgYVxuICAgICAgICAgICAgICAgICAgICAvLyBob21lIGluIHRoZSBmaW5hbCBET00gdHJlZS4gQWZ0ZXIgZXZlcnl0aGluZyBpcyBkb25lIHdlIHdpbGwgcmVtb3ZlIGFueSBrZXllZCBub2Rlc1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGF0IGRpZG4ndCBmaW5kIGEgaG9tZVxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9IC8vIEVORDogd2hpbGUoY3VyRnJvbU5vZGVDaGlsZCkge31cblxuICAgICAgICAgICAgICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciB0aGVuIHdlIGRpZCBub3QgZmluZCBhIGNhbmRpZGF0ZSBtYXRjaCBmb3JcbiAgICAgICAgICAgICAgICAvLyBvdXIgXCJ0byBub2RlXCIgYW5kIHdlIGV4aGF1c3RlZCBhbGwgb2YgdGhlIGNoaWxkcmVuIFwiZnJvbVwiXG4gICAgICAgICAgICAgICAgLy8gbm9kZXMuIFRoZXJlZm9yZSwgd2Ugd2lsbCBqdXN0IGFwcGVuZCB0aGUgY3VycmVudCBcInRvXCIgbm9kZVxuICAgICAgICAgICAgICAgIC8vIHRvIHRoZSBlbmRcbiAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlS2V5ICYmIChtYXRjaGluZ0Zyb21FbCA9IGZyb21Ob2Rlc0xvb2t1cFtjdXJUb05vZGVLZXldKSAmJiBjb21wYXJlTm9kZU5hbWVzKG1hdGNoaW5nRnJvbUVsLCBjdXJUb05vZGVDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmFwcGVuZENoaWxkKG1hdGNoaW5nRnJvbUVsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCA9IG9uQmVmb3JlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9uQmVmb3JlTm9kZUFkZGVkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyVG9Ob2RlQ2hpbGQgPSBvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUNoaWxkLmFjdHVhbGl6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gY3VyVG9Ob2RlQ2hpbGQuYWN0dWFsaXplKGZyb21FbC5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tRWwuYXBwZW5kQ2hpbGQoY3VyVG9Ob2RlQ2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGVhbnVwRnJvbUVsKGZyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCwgY3VyRnJvbU5vZGVLZXkpO1xuXG4gICAgICAgICAgICB2YXIgc3BlY2lhbEVsSGFuZGxlciA9IHNwZWNpYWxFbEhhbmRsZXJzW2Zyb21FbC5ub2RlTmFtZV07XG4gICAgICAgICAgICBpZiAoc3BlY2lhbEVsSGFuZGxlcikge1xuICAgICAgICAgICAgICAgIHNwZWNpYWxFbEhhbmRsZXIoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBFTkQ6IG1vcnBoQ2hpbGRyZW4oLi4uKVxuXG4gICAgICAgIHZhciBtb3JwaGVkTm9kZSA9IGZyb21Ob2RlO1xuICAgICAgICB2YXIgbW9ycGhlZE5vZGVUeXBlID0gbW9ycGhlZE5vZGUubm9kZVR5cGU7XG4gICAgICAgIHZhciB0b05vZGVUeXBlID0gdG9Ob2RlLm5vZGVUeXBlO1xuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgdGhlIGNhc2Ugd2hlcmUgd2UgYXJlIGdpdmVuIHR3byBET00gbm9kZXMgdGhhdCBhcmUgbm90XG4gICAgICAgICAgICAvLyBjb21wYXRpYmxlIChlLmcuIDxkaXY+IC0tPiA8c3Bhbj4gb3IgPGRpdj4gLS0+IFRFWFQpXG4gICAgICAgICAgICBpZiAobW9ycGhlZE5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICBpZiAodG9Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tcGFyZU5vZGVOYW1lcyhmcm9tTm9kZSwgdG9Ob2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKGZyb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoZWROb2RlID0gbW92ZUNoaWxkcmVuKGZyb21Ob2RlLCBjcmVhdGVFbGVtZW50TlModG9Ob2RlLm5vZGVOYW1lLCB0b05vZGUubmFtZXNwYWNlVVJJKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHb2luZyBmcm9tIGFuIGVsZW1lbnQgbm9kZSB0byBhIHRleHQgbm9kZVxuICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IG1vcnBoZWROb2RlVHlwZSA9PT0gQ09NTUVOVF9OT0RFKSB7IC8vIFRleHQgb3IgY29tbWVudCBub2RlXG4gICAgICAgICAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IG1vcnBoZWROb2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9ycGhlZE5vZGUubm9kZVZhbHVlICE9PSB0b05vZGUubm9kZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZS5ub2RlVmFsdWUgPSB0b05vZGUubm9kZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vcnBoZWROb2RlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRleHQgbm9kZSB0byBzb21ldGhpbmcgZWxzZVxuICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IHRvTm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9ycGhlZE5vZGUgPT09IHRvTm9kZSkge1xuICAgICAgICAgICAgLy8gVGhlIFwidG8gbm9kZVwiIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSBcImZyb20gbm9kZVwiIHNvIHdlIGhhZCB0b1xuICAgICAgICAgICAgLy8gdG9zcyBvdXQgdGhlIFwiZnJvbSBub2RlXCIgYW5kIHVzZSB0aGUgXCJ0byBub2RlXCJcbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodG9Ob2RlLmlzU2FtZU5vZGUgJiYgdG9Ob2RlLmlzU2FtZU5vZGUobW9ycGhlZE5vZGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtb3JwaEVsKG1vcnBoZWROb2RlLCB0b05vZGUsIGNoaWxkcmVuT25seSk7XG5cbiAgICAgICAgICAgIC8vIFdlIG5vdyBuZWVkIHRvIGxvb3Agb3ZlciBhbnkga2V5ZWQgbm9kZXMgdGhhdCBtaWdodCBuZWVkIHRvIGJlXG4gICAgICAgICAgICAvLyByZW1vdmVkLiBXZSBvbmx5IGRvIHRoZSByZW1vdmFsIGlmIHdlIGtub3cgdGhhdCB0aGUga2V5ZWQgbm9kZVxuICAgICAgICAgICAgLy8gbmV2ZXIgZm91bmQgYSBtYXRjaC4gV2hlbiBhIGtleWVkIG5vZGUgaXMgbWF0Y2hlZCB1cCB3ZSByZW1vdmVcbiAgICAgICAgICAgIC8vIGl0IG91dCBvZiBmcm9tTm9kZXNMb29rdXAgYW5kIHdlIHVzZSBmcm9tTm9kZXNMb29rdXAgdG8gZGV0ZXJtaW5lXG4gICAgICAgICAgICAvLyBpZiBhIGtleWVkIG5vZGUgaGFzIGJlZW4gbWF0Y2hlZCB1cCBvciBub3RcbiAgICAgICAgICAgIGlmIChrZXllZFJlbW92YWxMaXN0KSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wLCBsZW49a2V5ZWRSZW1vdmFsTGlzdC5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsVG9SZW1vdmUgPSBmcm9tTm9kZXNMb29rdXBba2V5ZWRSZW1vdmFsTGlzdFtpXV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbFRvUmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGVsVG9SZW1vdmUsIGVsVG9SZW1vdmUucGFyZW50Tm9kZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjaGlsZHJlbk9ubHkgJiYgbW9ycGhlZE5vZGUgIT09IGZyb21Ob2RlICYmIGZyb21Ob2RlLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGlmIChtb3JwaGVkTm9kZS5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vcnBoZWROb2RlLmFjdHVhbGl6ZShmcm9tTm9kZS5vd25lckRvY3VtZW50IHx8IGRvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBoYWQgdG8gc3dhcCBvdXQgdGhlIGZyb20gbm9kZSB3aXRoIGEgbmV3IG5vZGUgYmVjYXVzZSB0aGUgb2xkXG4gICAgICAgICAgICAvLyBub2RlIHdhcyBub3QgY29tcGF0aWJsZSB3aXRoIHRoZSB0YXJnZXQgbm9kZSB0aGVuIHdlIG5lZWQgdG9cbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBET00gbm9kZSBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuIFRoaXMgaXMgb25seVxuICAgICAgICAgICAgLy8gcG9zc2libGUgaWYgdGhlIG9yaWdpbmFsIERPTSBub2RlIHdhcyBwYXJ0IG9mIGEgRE9NIHRyZWUgd2hpY2hcbiAgICAgICAgICAgIC8vIHdlIGtub3cgaXMgdGhlIGNhc2UgaWYgaXQgaGFzIGEgcGFyZW50IG5vZGUuXG4gICAgICAgICAgICBmcm9tTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChtb3JwaGVkTm9kZSwgZnJvbU5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vcnBoZWROb2RlO1xuICAgIH07XG59XG5cbnZhciBtb3JwaGRvbSA9IG1vcnBoZG9tRmFjdG9yeShtb3JwaEF0dHJzKTtcblxuZXhwb3J0IGRlZmF1bHQgbW9ycGhkb207XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0ZFRURCQUNLX0ZPUixcbiAgUEhYX1BSVU5FLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TS0lQLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVFJJR0dFUl9BQ1RJT04sXG4gIFBIWF9VUERBVEVcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgZGV0ZWN0RHVwbGljYXRlSWRzLFxuICBpc0NpZFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBET01Qb3N0TW9ycGhSZXN0b3JlciBmcm9tIFwiLi9kb21fcG9zdF9tb3JwaF9yZXN0b3JlclwiXG5pbXBvcnQgbW9ycGhkb20gZnJvbSBcIm1vcnBoZG9tXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRE9NUGF0Y2gge1xuICBzdGF0aWMgcGF0Y2hFbChmcm9tRWwsIHRvRWwsIGFjdGl2ZUVsZW1lbnQpe1xuICAgIG1vcnBoZG9tKGZyb21FbCwgdG9FbCwge1xuICAgICAgY2hpbGRyZW5Pbmx5OiBmYWxzZSxcbiAgICAgIG9uQmVmb3JlRWxVcGRhdGVkOiAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICAgIGlmKGFjdGl2ZUVsZW1lbnQgJiYgYWN0aXZlRWxlbWVudC5pc1NhbWVOb2RlKGZyb21FbCkgJiYgRE9NLmlzRm9ybUlucHV0KGZyb21FbCkpe1xuICAgICAgICAgIERPTS5tZXJnZUZvY3VzZWRJbnB1dChmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY29uc3RydWN0b3IodmlldywgY29udGFpbmVyLCBpZCwgaHRtbCwgdGFyZ2V0Q0lEKXtcbiAgICB0aGlzLnZpZXcgPSB2aWV3XG4gICAgdGhpcy5saXZlU29ja2V0ID0gdmlldy5saXZlU29ja2V0XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXJcbiAgICB0aGlzLmlkID0gaWRcbiAgICB0aGlzLnJvb3RJRCA9IHZpZXcucm9vdC5pZFxuICAgIHRoaXMuaHRtbCA9IGh0bWxcbiAgICB0aGlzLnRhcmdldENJRCA9IHRhcmdldENJRFxuICAgIHRoaXMuY2lkUGF0Y2ggPSBpc0NpZCh0aGlzLnRhcmdldENJRClcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHtcbiAgICAgIGJlZm9yZWFkZGVkOiBbXSwgYmVmb3JldXBkYXRlZDogW10sIGJlZm9yZXBoeENoaWxkQWRkZWQ6IFtdLFxuICAgICAgYWZ0ZXJhZGRlZDogW10sIGFmdGVydXBkYXRlZDogW10sIGFmdGVyZGlzY2FyZGVkOiBbXSwgYWZ0ZXJwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVydHJhbnNpdGlvbnNEaXNjYXJkZWQ6IFtdXG4gICAgfVxuICB9XG5cbiAgYmVmb3JlKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG4gIGFmdGVyKGtpbmQsIGNhbGxiYWNrKXsgdGhpcy5jYWxsYmFja3NbYGFmdGVyJHtraW5kfWBdLnB1c2goY2FsbGJhY2spIH1cblxuICB0cmFja0JlZm9yZShraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYmVmb3JlJHtraW5kfWBdLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soLi4uYXJncykpXG4gIH1cblxuICB0cmFja0FmdGVyKGtpbmQsIC4uLmFyZ3Mpe1xuICAgIHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgbWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKXtcbiAgICBET00uYWxsKHRoaXMuY29udGFpbmVyLCBcIltwaHgtdXBkYXRlPWFwcGVuZF0gPiAqLCBbcGh4LXVwZGF0ZT1wcmVwZW5kXSA+ICpcIiwgZWwgPT4ge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9QUlVORSwgXCJcIilcbiAgICB9KVxuICB9XG5cbiAgcGVyZm9ybSgpe1xuICAgIGxldCB7dmlldywgbGl2ZVNvY2tldCwgY29udGFpbmVyLCBodG1sfSA9IHRoaXNcbiAgICBsZXQgdGFyZ2V0Q29udGFpbmVyID0gdGhpcy5pc0NJRFBhdGNoKCkgPyB0aGlzLnRhcmdldENJRENvbnRhaW5lcihodG1sKSA6IGNvbnRhaW5lclxuICAgIGlmKHRoaXMuaXNDSURQYXRjaCgpICYmICF0YXJnZXRDb250YWluZXIpeyByZXR1cm4gfVxuXG4gICAgbGV0IGZvY3VzZWQgPSBsaXZlU29ja2V0LmdldEFjdGl2ZUVsZW1lbnQoKVxuICAgIGxldCB7c2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZH0gPSBmb2N1c2VkICYmIERPTS5oYXNTZWxlY3Rpb25SYW5nZShmb2N1c2VkKSA/IGZvY3VzZWQgOiB7fVxuICAgIGxldCBwaHhVcGRhdGUgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX1VQREFURSlcbiAgICBsZXQgcGh4RmVlZGJhY2tGb3IgPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUilcbiAgICBsZXQgZGlzYWJsZVdpdGggPSBsaXZlU29ja2V0LmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSClcbiAgICBsZXQgcGh4VHJpZ2dlckV4dGVybmFsID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9UUklHR0VSX0FDVElPTilcbiAgICBsZXQgcGh4UmVtb3ZlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgdXBkYXRlcyA9IFtdXG4gICAgbGV0IGFwcGVuZFByZXBlbmRVcGRhdGVzID0gW11cbiAgICBsZXQgcGVuZGluZ1JlbW92ZXMgPSBbXVxuICAgIGxldCBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBudWxsXG5cbiAgICBsZXQgZGlmZkhUTUwgPSBsaXZlU29ja2V0LnRpbWUoXCJwcmVtb3JwaCBjb250YWluZXIgcHJlcFwiLCAoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5idWlsZERpZmZIVE1MKGNvbnRhaW5lciwgaHRtbCwgcGh4VXBkYXRlLCB0YXJnZXRDb250YWluZXIpXG4gICAgfSlcblxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBjb250YWluZXIpXG4gICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgY29udGFpbmVyLCBjb250YWluZXIpXG5cbiAgICBsaXZlU29ja2V0LnRpbWUoXCJtb3JwaGRvbVwiLCAoKSA9PiB7XG4gICAgICBtb3JwaGRvbSh0YXJnZXRDb250YWluZXIsIGRpZmZIVE1MLCB7XG4gICAgICAgIGNoaWxkcmVuT25seTogdGFyZ2V0Q29udGFpbmVyLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSA9PT0gbnVsbCxcbiAgICAgICAgZ2V0Tm9kZUtleTogKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gRE9NLmlzUGh4RGVzdHJveWVkKG5vZGUpID8gbnVsbCA6IG5vZGUuaWRcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJhZGRlZFwiLCBlbClcbiAgICAgICAgICByZXR1cm4gZWxcbiAgICAgICAgfSxcbiAgICAgICAgb25Ob2RlQWRkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIC8vIGhhY2sgdG8gZml4IFNhZmFyaSBoYW5kbGluZyBvZiBpbWcgc3Jjc2V0IGFuZCB2aWRlbyB0YWdzXG4gICAgICAgICAgaWYoZWwgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50ICYmIGVsLnNyY3NldCl7XG4gICAgICAgICAgICBlbC5zcmNzZXQgPSBlbC5zcmNzZXRcbiAgICAgICAgICB9IGVsc2UgaWYoZWwgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50ICYmIGVsLmF1dG9wbGF5KXtcbiAgICAgICAgICAgIGVsLnBsYXkoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIC8vaW5wdXQgaGFuZGxpbmdcbiAgICAgICAgICBET00uZGlzY2FyZEVycm9yKHRhcmdldENvbnRhaW5lciwgZWwsIHBoeEZlZWRiYWNrRm9yKVxuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoKERPTS5pc1BoeENoaWxkKGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsKSkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSAmJiB2aWV3Lm93bnNFbGVtZW50KGVsLnBhcmVudE5vZGUpKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcInBoeENoaWxkQWRkZWRcIiwgZWwpXG4gICAgICAgICAgfVxuICAgICAgICAgIGFkZGVkLnB1c2goZWwpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZURpc2NhcmRlZDogKGVsKSA9PiB7XG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZChlbCkgfHwgRE9NLmlzUGh4U3RpY2t5KGVsKSl7IGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGVsKSB9XG4gICAgICAgICAgdGhpcy50cmFja0FmdGVyKFwiZGlzY2FyZGVkXCIsIGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZU5vZGVEaXNjYXJkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1BSVU5FKSAhPT0gbnVsbCl7IHJldHVybiB0cnVlIH1cbiAgICAgICAgICBpZihlbC5wYXJlbnROb2RlICE9PSBudWxsICYmIERPTS5pc1BoeFVwZGF0ZShlbC5wYXJlbnROb2RlLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pICYmIGVsLmlkKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFJlbW92ZSkpe1xuICAgICAgICAgICAgcGVuZGluZ1JlbW92ZXMucHVzaChlbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKGVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgb25FbFVwZGF0ZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIGlmKERPTS5pc05vd1RyaWdnZXJGb3JtRXh0ZXJuYWwoZWwsIHBoeFRyaWdnZXJFeHRlcm5hbCkpe1xuICAgICAgICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gZWxcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBkYXRlcy5wdXNoKGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbkJlZm9yZUVsVXBkYXRlZDogKGZyb21FbCwgdG9FbCkgPT4ge1xuICAgICAgICAgIERPTS5jbGVhbkNoaWxkTm9kZXModG9FbCwgcGh4VXBkYXRlKVxuICAgICAgICAgIGlmKHRoaXMuc2tpcENJRFNpYmxpbmcodG9FbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKERPTS5pc1BoeFN0aWNreShmcm9tRWwpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihET00uaXNJZ25vcmVkKGZyb21FbCwgcGh4VXBkYXRlKSB8fCAoZnJvbUVsLmZvcm0gJiYgZnJvbUVsLmZvcm0uaXNTYW1lTm9kZShleHRlcm5hbEZvcm1UcmlnZ2VyZWQpKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwidXBkYXRlZFwiLCBmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KVxuICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKGZyb21FbC50eXBlID09PSBcIm51bWJlclwiICYmIChmcm9tRWwudmFsaWRpdHkgJiYgZnJvbUVsLnZhbGlkaXR5LmJhZElucHV0KSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYoIURPTS5zeW5jUGVuZGluZ1JlZihmcm9tRWwsIHRvRWwsIGRpc2FibGVXaXRoKSl7XG4gICAgICAgICAgICBpZihET00uaXNVcGxvYWRJbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKERPTS5pc1BoeENoaWxkKHRvRWwpKXtcbiAgICAgICAgICAgIGxldCBwcmV2U2Vzc2lvbiA9IGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pXG4gICAgICAgICAgICBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtleGNsdWRlOiBbUEhYX1NUQVRJQ119KVxuICAgICAgICAgICAgaWYocHJldlNlc3Npb24gIT09IFwiXCIpeyBmcm9tRWwuc2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OLCBwcmV2U2Vzc2lvbikgfVxuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290SUQpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGlucHV0IGhhbmRsaW5nXG4gICAgICAgICAgRE9NLmNvcHlQcml2YXRlcyh0b0VsLCBmcm9tRWwpXG4gICAgICAgICAgRE9NLmRpc2NhcmRFcnJvcih0YXJnZXRDb250YWluZXIsIHRvRWwsIHBoeEZlZWRiYWNrRm9yKVxuXG4gICAgICAgICAgbGV0IGlzRm9jdXNlZEZvcm1FbCA9IGZvY3VzZWQgJiYgZnJvbUVsLmlzU2FtZU5vZGUoZm9jdXNlZCkgJiYgRE9NLmlzRm9ybUlucHV0KGZyb21FbClcbiAgICAgICAgICBpZihpc0ZvY3VzZWRGb3JtRWwpe1xuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLm1lcmdlRm9jdXNlZElucHV0KGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5zeW5jQXR0cnNUb1Byb3BzKGZyb21FbClcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihET00uaXNQaHhVcGRhdGUodG9FbCwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSl7XG4gICAgICAgICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLnB1c2gobmV3IERPTVBvc3RNb3JwaFJlc3RvcmVyKGZyb21FbCwgdG9FbCwgdG9FbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyh0b0VsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyh0b0VsKVxuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGlmKGxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7IGRldGVjdER1cGxpY2F0ZUlkcygpIH1cblxuICAgIGlmKGFwcGVuZFByZXBlbmRVcGRhdGVzLmxlbmd0aCA+IDApe1xuICAgICAgbGl2ZVNvY2tldC50aW1lKFwicG9zdC1tb3JwaCBhcHBlbmQvcHJlcGVuZCByZXN0b3JhdGlvblwiLCAoKSA9PiB7XG4gICAgICAgIGFwcGVuZFByZXBlbmRVcGRhdGVzLmZvckVhY2godXBkYXRlID0+IHVwZGF0ZS5wZXJmb3JtKCkpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGxpdmVTb2NrZXQuc2lsZW5jZUV2ZW50cygoKSA9PiBET00ucmVzdG9yZUZvY3VzKGZvY3VzZWQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpKVxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGRvY3VtZW50LCBcInBoeDp1cGRhdGVcIilcbiAgICBhZGRlZC5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcImFkZGVkXCIsIGVsKSlcbiAgICB1cGRhdGVzLmZvckVhY2goZWwgPT4gdGhpcy50cmFja0FmdGVyKFwidXBkYXRlZFwiLCBlbCkpXG5cbiAgICBpZihwZW5kaW5nUmVtb3Zlcy5sZW5ndGggPiAwKXtcbiAgICAgIGxpdmVTb2NrZXQudHJhbnNpdGlvblJlbW92ZXMocGVuZGluZ1JlbW92ZXMpXG4gICAgICBsaXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBwZW5kaW5nUmVtb3Zlcy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICBsZXQgY2hpbGQgPSBET00uZmlyc3RQaHhDaGlsZChlbClcbiAgICAgICAgICBpZihjaGlsZCl7IGxpdmVTb2NrZXQuZGVzdHJveVZpZXdCeUVsKGNoaWxkKSB9XG4gICAgICAgICAgZWwucmVtb3ZlKClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy50cmFja0FmdGVyKFwidHJhbnNpdGlvbnNEaXNjYXJkZWRcIiwgcGVuZGluZ1JlbW92ZXMpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmKGV4dGVybmFsRm9ybVRyaWdnZXJlZCl7XG4gICAgICBsaXZlU29ja2V0LmRpc2Nvbm5lY3QoKVxuICAgICAgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkLnN1Ym1pdCgpXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBpc0NJRFBhdGNoKCl7IHJldHVybiB0aGlzLmNpZFBhdGNoIH1cblxuICBza2lwQ0lEU2libGluZyhlbCl7XG4gICAgcmV0dXJuIGVsLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NLSVApICE9PSBudWxsXG4gIH1cblxuICB0YXJnZXRDSURDb250YWluZXIoaHRtbCl7XG4gICAgaWYoIXRoaXMuaXNDSURQYXRjaCgpKXsgcmV0dXJuIH1cbiAgICBsZXQgW2ZpcnN0LCAuLi5yZXN0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5jb250YWluZXIsIHRoaXMudGFyZ2V0Q0lEKVxuICAgIGlmKHJlc3QubGVuZ3RoID09PSAwICYmIERPTS5jaGlsZE5vZGVMZW5ndGgoaHRtbCkgPT09IDEpe1xuICAgICAgcmV0dXJuIGZpcnN0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaXJzdCAmJiBmaXJzdC5wYXJlbnROb2RlXG4gICAgfVxuICB9XG5cbiAgLy8gYnVpbGRzIEhUTUwgZm9yIG1vcnBoZG9tIHBhdGNoXG4gIC8vIC0gZm9yIGZ1bGwgcGF0Y2hlcyBvZiBMaXZlVmlldyBvciBhIGNvbXBvbmVudCB3aXRoIGEgc2luZ2xlXG4gIC8vICAgcm9vdCBub2RlLCBzaW1wbHkgcmV0dXJucyB0aGUgSFRNTFxuICAvLyAtIGZvciBwYXRjaGVzIG9mIGEgY29tcG9uZW50IHdpdGggbXVsdGlwbGUgcm9vdCBub2RlcywgdGhlXG4gIC8vICAgcGFyZW50IG5vZGUgYmVjb21lcyB0aGUgdGFyZ2V0IGNvbnRhaW5lciBhbmQgbm9uLWNvbXBvbmVudFxuICAvLyAgIHNpYmxpbmdzIGFyZSBtYXJrZWQgYXMgc2tpcC5cbiAgYnVpbGREaWZmSFRNTChjb250YWluZXIsIGh0bWwsIHBoeFVwZGF0ZSwgdGFyZ2V0Q29udGFpbmVyKXtcbiAgICBsZXQgaXNDSURQYXRjaCA9IHRoaXMuaXNDSURQYXRjaCgpXG4gICAgbGV0IGlzQ0lEV2l0aFNpbmdsZVJvb3QgPSBpc0NJRFBhdGNoICYmIHRhcmdldENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkgPT09IHRoaXMudGFyZ2V0Q0lELnRvU3RyaW5nKClcbiAgICBpZighaXNDSURQYXRjaCB8fCBpc0NJRFdpdGhTaW5nbGVSb290KXtcbiAgICAgIHJldHVybiBodG1sXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbXBvbmVudCBwYXRjaCB3aXRoIG11bHRpcGxlIENJRCByb290c1xuICAgICAgbGV0IGRpZmZDb250YWluZXIgPSBudWxsXG4gICAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICAgIGRpZmZDb250YWluZXIgPSBET00uY2xvbmVOb2RlKHRhcmdldENvbnRhaW5lcilcbiAgICAgIGxldCBbZmlyc3RDb21wb25lbnQsIC4uLnJlc3RdID0gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdChkaWZmQ29udGFpbmVyLCB0aGlzLnRhcmdldENJRClcbiAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICAgIHJlc3QuZm9yRWFjaChlbCA9PiBlbC5yZW1vdmUoKSlcbiAgICAgIEFycmF5LmZyb20oZGlmZkNvbnRhaW5lci5jaGlsZE5vZGVzKS5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgLy8gd2UgY2FuIG9ubHkgc2tpcCB0cmFja2FibGUgbm9kZXMgd2l0aCBhbiBJRFxuICAgICAgICBpZihjaGlsZC5pZCAmJiBjaGlsZC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgY2hpbGQuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpICE9PSB0aGlzLnRhcmdldENJRC50b1N0cmluZygpKXtcbiAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoUEhYX1NLSVAsIFwiXCIpXG4gICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgQXJyYXkuZnJvbSh0ZW1wbGF0ZS5jb250ZW50LmNoaWxkTm9kZXMpLmZvckVhY2goZWwgPT4gZGlmZkNvbnRhaW5lci5pbnNlcnRCZWZvcmUoZWwsIGZpcnN0Q29tcG9uZW50KSlcbiAgICAgIGZpcnN0Q29tcG9uZW50LnJlbW92ZSgpXG4gICAgICByZXR1cm4gZGlmZkNvbnRhaW5lci5vdXRlckhUTUxcbiAgICB9XG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBDT01QT05FTlRTLFxuICBEWU5BTUlDUyxcbiAgVEVNUExBVEVTLFxuICBFVkVOVFMsXG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9TS0lQLFxuICBSRVBMWSxcbiAgU1RBVElDLFxuICBUSVRMRVxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBpc09iamVjdCxcbiAgbG9nRXJyb3IsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVkIHtcbiAgc3RhdGljIGV4dHJhY3QoZGlmZil7XG4gICAgbGV0IHtbUkVQTFldOiByZXBseSwgW0VWRU5UU106IGV2ZW50cywgW1RJVExFXTogdGl0bGV9ID0gZGlmZlxuICAgIGRlbGV0ZSBkaWZmW1JFUExZXVxuICAgIGRlbGV0ZSBkaWZmW0VWRU5UU11cbiAgICBkZWxldGUgZGlmZltUSVRMRV1cbiAgICByZXR1cm4ge2RpZmYsIHRpdGxlLCByZXBseTogcmVwbHkgfHwgbnVsbCwgZXZlbnRzOiBldmVudHMgfHwgW119XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3SWQsIHJlbmRlcmVkKXtcbiAgICB0aGlzLnZpZXdJZCA9IHZpZXdJZFxuICAgIHRoaXMucmVuZGVyZWQgPSB7fVxuICAgIHRoaXMubWVyZ2VEaWZmKHJlbmRlcmVkKVxuICB9XG5cbiAgcGFyZW50Vmlld0lkKCl7IHJldHVybiB0aGlzLnZpZXdJZCB9XG5cbiAgdG9TdHJpbmcob25seUNpZHMpe1xuICAgIHJldHVybiB0aGlzLnJlY3Vyc2l2ZVRvU3RyaW5nKHRoaXMucmVuZGVyZWQsIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzKVxuICB9XG5cbiAgcmVjdXJzaXZlVG9TdHJpbmcocmVuZGVyZWQsIGNvbXBvbmVudHMgPSByZW5kZXJlZFtDT01QT05FTlRTXSwgb25seUNpZHMpe1xuICAgIG9ubHlDaWRzID0gb25seUNpZHMgPyBuZXcgU2V0KG9ubHlDaWRzKSA6IG51bGxcbiAgICBsZXQgb3V0cHV0ID0ge2J1ZmZlcjogXCJcIiwgY29tcG9uZW50czogY29tcG9uZW50cywgb25seUNpZHM6IG9ubHlDaWRzfVxuICAgIHRoaXMudG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIG51bGwsIG91dHB1dClcbiAgICByZXR1cm4gb3V0cHV0LmJ1ZmZlclxuICB9XG5cbiAgY29tcG9uZW50Q0lEcyhkaWZmKXsgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmZbQ09NUE9ORU5UU10gfHwge30pLm1hcChpID0+IHBhcnNlSW50KGkpKSB9XG5cbiAgaXNDb21wb25lbnRPbmx5RGlmZihkaWZmKXtcbiAgICBpZighZGlmZltDT01QT05FTlRTXSl7IHJldHVybiBmYWxzZSB9XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGRpZmYpLmxlbmd0aCA9PT0gMVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50KGRpZmYsIGNpZCl7IHJldHVybiBkaWZmW0NPTVBPTkVOVFNdW2NpZF0gfVxuXG4gIG1lcmdlRGlmZihkaWZmKXtcbiAgICBsZXQgbmV3YyA9IGRpZmZbQ09NUE9ORU5UU11cbiAgICBsZXQgY2FjaGUgPSB7fVxuICAgIGRlbGV0ZSBkaWZmW0NPTVBPTkVOVFNdXG4gICAgdGhpcy5yZW5kZXJlZCA9IHRoaXMubXV0YWJsZU1lcmdlKHRoaXMucmVuZGVyZWQsIGRpZmYpXG4gICAgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXSA9IHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10gfHwge31cblxuICAgIGlmKG5ld2Mpe1xuICAgICAgbGV0IG9sZGMgPSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdXG5cbiAgICAgIGZvcihsZXQgY2lkIGluIG5ld2Mpe1xuICAgICAgICBuZXdjW2NpZF0gPSB0aGlzLmNhY2hlZEZpbmRDb21wb25lbnQoY2lkLCBuZXdjW2NpZF0sIG9sZGMsIG5ld2MsIGNhY2hlKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGNpZCBpbiBuZXdjKXsgb2xkY1tjaWRdID0gbmV3Y1tjaWRdIH1cbiAgICAgIGRpZmZbQ09NUE9ORU5UU10gPSBuZXdjXG4gICAgfVxuICB9XG5cbiAgY2FjaGVkRmluZENvbXBvbmVudChjaWQsIGNkaWZmLCBvbGRjLCBuZXdjLCBjYWNoZSl7XG4gICAgaWYoY2FjaGVbY2lkXSl7XG4gICAgICByZXR1cm4gY2FjaGVbY2lkXVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmRpZmYsIHN0YXQsIHNjaWQgPSBjZGlmZltTVEFUSUNdXG5cbiAgICAgIGlmKGlzQ2lkKHNjaWQpKXtcbiAgICAgICAgbGV0IHRkaWZmXG5cbiAgICAgICAgaWYoc2NpZCA+IDApe1xuICAgICAgICAgIHRkaWZmID0gdGhpcy5jYWNoZWRGaW5kQ29tcG9uZW50KHNjaWQsIG5ld2Nbc2NpZF0sIG9sZGMsIG5ld2MsIGNhY2hlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRkaWZmID0gb2xkY1stc2NpZF1cbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXQgPSB0ZGlmZltTVEFUSUNdXG4gICAgICAgIG5kaWZmID0gdGhpcy5jbG9uZU1lcmdlKHRkaWZmLCBjZGlmZilcbiAgICAgICAgbmRpZmZbU1RBVElDXSA9IHN0YXRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5kaWZmID0gY2RpZmZbU1RBVElDXSAhPT0gdW5kZWZpbmVkID8gY2RpZmYgOiB0aGlzLmNsb25lTWVyZ2Uob2xkY1tjaWRdIHx8IHt9LCBjZGlmZilcbiAgICAgIH1cblxuICAgICAgY2FjaGVbY2lkXSA9IG5kaWZmXG4gICAgICByZXR1cm4gbmRpZmZcbiAgICB9XG4gIH1cblxuICBtdXRhYmxlTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGlmKHNvdXJjZVtTVEFUSUNdICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHNvdXJjZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvTXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKVxuICAgICAgcmV0dXJuIHRhcmdldFxuICAgIH1cbiAgfVxuXG4gIGRvTXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKXtcbiAgICBmb3IobGV0IGtleSBpbiBzb3VyY2Upe1xuICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldXG4gICAgICBsZXQgdGFyZ2V0VmFsID0gdGFyZ2V0W2tleV1cbiAgICAgIGlmKGlzT2JqZWN0KHZhbCkgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXRWYWwsIHZhbClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY2xvbmVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgbGV0IG1lcmdlZCA9IHsuLi50YXJnZXQsIC4uLnNvdXJjZX1cbiAgICBmb3IobGV0IGtleSBpbiBtZXJnZWQpe1xuICAgICAgbGV0IHZhbCA9IHNvdXJjZVtrZXldXG4gICAgICBsZXQgdGFyZ2V0VmFsID0gdGFyZ2V0W2tleV1cbiAgICAgIGlmKGlzT2JqZWN0KHZhbCkgJiYgdmFsW1NUQVRJQ10gPT09IHVuZGVmaW5lZCAmJiBpc09iamVjdCh0YXJnZXRWYWwpKXtcbiAgICAgICAgbWVyZ2VkW2tleV0gPSB0aGlzLmNsb25lTWVyZ2UodGFyZ2V0VmFsLCB2YWwpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtZXJnZWRcbiAgfVxuXG4gIGNvbXBvbmVudFRvU3RyaW5nKGNpZCl7IHJldHVybiB0aGlzLnJlY3Vyc2l2ZUNJRFRvU3RyaW5nKHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10sIGNpZCkgfVxuXG4gIHBydW5lQ0lEcyhjaWRzKXtcbiAgICBjaWRzLmZvckVhY2goY2lkID0+IGRlbGV0ZSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdW2NpZF0pXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgZ2V0KCl7IHJldHVybiB0aGlzLnJlbmRlcmVkIH1cblxuICBpc05ld0ZpbmdlcnByaW50KGRpZmYgPSB7fSl7IHJldHVybiAhIWRpZmZbU1RBVElDXSB9XG5cbiAgdGVtcGxhdGVTdGF0aWMocGFydCwgdGVtcGxhdGVzKXtcbiAgICBpZih0eXBlb2YgKHBhcnQpID09PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gdGVtcGxhdGVzW3BhcnRdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJ0XG4gICAgfVxuICB9XG5cbiAgdG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBpZihyZW5kZXJlZFtEWU5BTUlDU10peyByZXR1cm4gdGhpcy5jb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KSB9XG4gICAgbGV0IHtbU1RBVElDXTogc3RhdGljc30gPSByZW5kZXJlZFxuICAgIHN0YXRpY3MgPSB0aGlzLnRlbXBsYXRlU3RhdGljKHN0YXRpY3MsIHRlbXBsYXRlcylcblxuICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1swXVxuICAgIGZvcihsZXQgaSA9IDE7IGkgPCBzdGF0aWNzLmxlbmd0aDsgaSsrKXtcbiAgICAgIHRoaXMuZHluYW1pY1RvQnVmZmVyKHJlbmRlcmVkW2kgLSAxXSwgdGVtcGxhdGVzLCBvdXRwdXQpXG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbaV1cbiAgICB9XG4gIH1cblxuICBjb21wcmVoZW5zaW9uVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBsZXQge1tEWU5BTUlDU106IGR5bmFtaWNzLCBbU1RBVElDXTogc3RhdGljc30gPSByZW5kZXJlZFxuICAgIHN0YXRpY3MgPSB0aGlzLnRlbXBsYXRlU3RhdGljKHN0YXRpY3MsIHRlbXBsYXRlcylcbiAgICBsZXQgY29tcFRlbXBsYXRlcyA9IHRlbXBsYXRlcyB8fCByZW5kZXJlZFtURU1QTEFURVNdXG5cbiAgICBmb3IobGV0IGQgPSAwOyBkIDwgZHluYW1pY3MubGVuZ3RoOyBkKyspe1xuICAgICAgbGV0IGR5bmFtaWMgPSBkeW5hbWljc1tkXVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzWzBdXG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIHRoaXMuZHluYW1pY1RvQnVmZmVyKGR5bmFtaWNbaSAtIDFdLCBjb21wVGVtcGxhdGVzLCBvdXRwdXQpXG4gICAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1tpXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZCwgdGVtcGxhdGVzLCBvdXRwdXQpe1xuICAgIGlmKHR5cGVvZiAocmVuZGVyZWQpID09PSBcIm51bWJlclwiKXtcbiAgICAgIG91dHB1dC5idWZmZXIgKz0gdGhpcy5yZWN1cnNpdmVDSURUb1N0cmluZyhvdXRwdXQuY29tcG9uZW50cywgcmVuZGVyZWQsIG91dHB1dC5vbmx5Q2lkcylcbiAgICB9IGVsc2UgaWYoaXNPYmplY3QocmVuZGVyZWQpKXtcbiAgICAgIHRoaXMudG9PdXRwdXRCdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KVxuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHJlbmRlcmVkXG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlQ0lEVG9TdHJpbmcoY29tcG9uZW50cywgY2lkLCBvbmx5Q2lkcyl7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY2lkXSB8fCBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvciBDSUQgJHtjaWR9YCwgY29tcG9uZW50cylcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSB0aGlzLnJlY3Vyc2l2ZVRvU3RyaW5nKGNvbXBvbmVudCwgY29tcG9uZW50cywgb25seUNpZHMpXG4gICAgbGV0IGNvbnRhaW5lciA9IHRlbXBsYXRlLmNvbnRlbnRcbiAgICBsZXQgc2tpcCA9IG9ubHlDaWRzICYmICFvbmx5Q2lkcy5oYXMoY2lkKVxuXG4gICAgbGV0IFtoYXNDaGlsZE5vZGVzLCBoYXNDaGlsZENvbXBvbmVudHNdID1cbiAgICAgIEFycmF5LmZyb20oY29udGFpbmVyLmNoaWxkTm9kZXMpLnJlZHVjZSgoW2hhc05vZGVzLCBoYXNDb21wb25lbnRzXSwgY2hpbGQsIGkpID0+IHtcbiAgICAgICAgaWYoY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKXtcbiAgICAgICAgICBpZihjaGlsZC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkpe1xuICAgICAgICAgICAgcmV0dXJuIFtoYXNOb2RlcywgdHJ1ZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZClcbiAgICAgICAgICBpZighY2hpbGQuaWQpeyBjaGlsZC5pZCA9IGAke3RoaXMucGFyZW50Vmlld0lkKCl9LSR7Y2lkfS0ke2l9YCB9XG4gICAgICAgICAgaWYoc2tpcCl7XG4gICAgICAgICAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoUEhYX1NLSVAsIFwiXCIpXG4gICAgICAgICAgICBjaGlsZC5pbm5lckhUTUwgPSBcIlwiXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBbdHJ1ZSwgaGFzQ29tcG9uZW50c11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZihjaGlsZC5ub2RlVmFsdWUudHJpbSgpICE9PSBcIlwiKXtcbiAgICAgICAgICAgIGxvZ0Vycm9yKFwib25seSBIVE1MIGVsZW1lbnQgdGFncyBhcmUgYWxsb3dlZCBhdCB0aGUgcm9vdCBvZiBjb21wb25lbnRzLlxcblxcblwiICtcbiAgICAgICAgICAgICAgYGdvdDogXCIke2NoaWxkLm5vZGVWYWx1ZS50cmltKCl9XCJcXG5cXG5gICtcbiAgICAgICAgICAgICAgXCJ3aXRoaW46XFxuXCIsIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICAgICAgICBjaGlsZC5yZXBsYWNlV2l0aCh0aGlzLmNyZWF0ZVNwYW4oY2hpbGQubm9kZVZhbHVlLCBjaWQpKVxuICAgICAgICAgICAgcmV0dXJuIFt0cnVlLCBoYXNDb21wb25lbnRzXVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGlsZC5yZW1vdmUoKVxuICAgICAgICAgICAgcmV0dXJuIFtoYXNOb2RlcywgaGFzQ29tcG9uZW50c11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIFtmYWxzZSwgZmFsc2VdKVxuXG4gICAgaWYoIWhhc0NoaWxkTm9kZXMgJiYgIWhhc0NoaWxkQ29tcG9uZW50cyl7XG4gICAgICBsb2dFcnJvcihcImV4cGVjdGVkIGF0IGxlYXN0IG9uZSBIVE1MIGVsZW1lbnQgdGFnIGluc2lkZSBhIGNvbXBvbmVudCwgYnV0IHRoZSBjb21wb25lbnQgaXMgZW1wdHk6XFxuXCIsXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGVTcGFuKFwiXCIsIGNpZCkub3V0ZXJIVE1MXG4gICAgfSBlbHNlIGlmKCFoYXNDaGlsZE5vZGVzICYmIGhhc0NoaWxkQ29tcG9uZW50cyl7XG4gICAgICBsb2dFcnJvcihcImV4cGVjdGVkIGF0IGxlYXN0IG9uZSBIVE1MIGVsZW1lbnQgdGFnIGRpcmVjdGx5IGluc2lkZSBhIGNvbXBvbmVudCwgYnV0IG9ubHkgc3ViY29tcG9uZW50cyB3ZXJlIGZvdW5kLiBBIGNvbXBvbmVudCBtdXN0IHJlbmRlciBhdCBsZWFzdCBvbmUgSFRNTCB0YWcgZGlyZWN0bHkgaW5zaWRlIGl0c2VsZi5cIixcbiAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MLnRyaW0oKSlcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5pbm5lckhUTUxcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlLmlubmVySFRNTFxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVNwYW4odGV4dCwgY2lkKXtcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXG4gICAgc3Bhbi5pbm5lclRleHQgPSB0ZXh0XG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCwgY2lkKVxuICAgIHJldHVybiBzcGFuXG4gIH1cbn1cbiIsICJsZXQgdmlld0hvb2tJRCA9IDFcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXdIb29rIHtcbiAgc3RhdGljIG1ha2VJRCgpeyByZXR1cm4gdmlld0hvb2tJRCsrIH1cbiAgc3RhdGljIGVsZW1lbnRJRChlbCl7IHJldHVybiBlbC5waHhIb29rSWQgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXcsIGVsLCBjYWxsYmFja3Mpe1xuICAgIHRoaXMuX192aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuX19jYWxsYmFja3MgPSBjYWxsYmFja3NcbiAgICB0aGlzLl9fbGlzdGVuZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5fX2lzRGlzY29ubmVjdGVkID0gZmFsc2VcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmVsLnBoeEhvb2tJZCA9IHRoaXMuY29uc3RydWN0b3IubWFrZUlEKClcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLl9fY2FsbGJhY2tzKXsgdGhpc1trZXldID0gdGhpcy5fX2NhbGxiYWNrc1trZXldIH1cbiAgfVxuXG4gIF9fbW91bnRlZCgpeyB0aGlzLm1vdW50ZWQgJiYgdGhpcy5tb3VudGVkKCkgfVxuICBfX3VwZGF0ZWQoKXsgdGhpcy51cGRhdGVkICYmIHRoaXMudXBkYXRlZCgpIH1cbiAgX19iZWZvcmVVcGRhdGUoKXsgdGhpcy5iZWZvcmVVcGRhdGUgJiYgdGhpcy5iZWZvcmVVcGRhdGUoKSB9XG4gIF9fZGVzdHJveWVkKCl7IHRoaXMuZGVzdHJveWVkICYmIHRoaXMuZGVzdHJveWVkKCkgfVxuICBfX3JlY29ubmVjdGVkKCl7XG4gICAgaWYodGhpcy5fX2lzRGlzY29ubmVjdGVkKXtcbiAgICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgICB0aGlzLnJlY29ubmVjdGVkICYmIHRoaXMucmVjb25uZWN0ZWQoKVxuICAgIH1cbiAgfVxuICBfX2Rpc2Nvbm5lY3RlZCgpe1xuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IHRydWVcbiAgICB0aGlzLmRpc2Nvbm5lY3RlZCAmJiB0aGlzLmRpc2Nvbm5lY3RlZCgpXG4gIH1cblxuICBwdXNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcucHVzaEhvb2tFdmVudChudWxsLCBldmVudCwgcGF5bG9hZCwgb25SZXBseSlcbiAgfVxuXG4gIHB1c2hFdmVudFRvKHBoeFRhcmdldCwgZXZlbnQsIHBheWxvYWQgPSB7fSwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHJldHVybiB2aWV3LnB1c2hIb29rRXZlbnQodGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRXZlbnQoZXZlbnQsIGNhbGxiYWNrKXtcbiAgICBsZXQgY2FsbGJhY2tSZWYgPSAoY3VzdG9tRXZlbnQsIGJ5cGFzcykgPT4gYnlwYXNzID8gZXZlbnQgOiBjYWxsYmFjayhjdXN0b21FdmVudC5kZXRhaWwpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKVxuICAgIHRoaXMuX19saXN0ZW5lcnMuYWRkKGNhbGxiYWNrUmVmKVxuICAgIHJldHVybiBjYWxsYmFja1JlZlxuICB9XG5cbiAgcmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpe1xuICAgIGxldCBldmVudCA9IGNhbGxiYWNrUmVmKG51bGwsIHRydWUpXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoYHBoeDoke2V2ZW50fWAsIGNhbGxiYWNrUmVmKVxuICAgIHRoaXMuX19saXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrUmVmKVxuICB9XG5cbiAgdXBsb2FkKG5hbWUsIGZpbGVzKXtcbiAgICByZXR1cm4gdGhpcy5fX3ZpZXcuZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzKVxuICB9XG5cbiAgdXBsb2FkVG8ocGh4VGFyZ2V0LCBuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCB2aWV3ID0+IHZpZXcuZGlzcGF0Y2hVcGxvYWRzKG5hbWUsIGZpbGVzKSlcbiAgfVxuXG4gIF9fY2xlYW51cF9fKCl7XG4gICAgdGhpcy5fX2xpc3RlbmVycy5mb3JFYWNoKGNhbGxiYWNrUmVmID0+IHRoaXMucmVtb3ZlSGFuZGxlRXZlbnQoY2FsbGJhY2tSZWYpKVxuICB9XG59XG4iLCAiaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IEFSSUEgZnJvbSBcIi4vYXJpYVwiXG5cbmxldCBmb2N1c1N0YWNrID0gbnVsbFxuXG5sZXQgSlMgPSB7XG4gIGV4ZWMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGRlZmF1bHRzKXtcbiAgICBsZXQgW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc10gPSBkZWZhdWx0cyB8fCBbbnVsbCwge31dXG4gICAgbGV0IGNvbW1hbmRzID0gcGh4RXZlbnQuY2hhckF0KDApID09PSBcIltcIiA/XG4gICAgICBKU09OLnBhcnNlKHBoeEV2ZW50KSA6IFtbZGVmYXVsdEtpbmQsIGRlZmF1bHRBcmdzXV1cblxuICAgIGNvbW1hbmRzLmZvckVhY2goKFtraW5kLCBhcmdzXSkgPT4ge1xuICAgICAgaWYoa2luZCA9PT0gZGVmYXVsdEtpbmQgJiYgZGVmYXVsdEFyZ3MuZGF0YSl7XG4gICAgICAgIGFyZ3MuZGF0YSA9IE9iamVjdC5hc3NpZ24oYXJncy5kYXRhIHx8IHt9LCBkZWZhdWx0QXJncy5kYXRhKVxuICAgICAgfVxuICAgICAgdGhpcy5maWx0ZXJUb0Vscyhzb3VyY2VFbCwgYXJncykuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgIHRoaXNbYGV4ZWNfJHtraW5kfWBdKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgYXJncylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICBpc1Zpc2libGUoZWwpe1xuICAgIHJldHVybiAhIShlbC5vZmZzZXRXaWR0aCB8fCBlbC5vZmZzZXRIZWlnaHQgfHwgZWwuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGggPiAwKVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICAvLyBjb21tYW5kc1xuXG4gIGV4ZWNfZGlzcGF0Y2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dG8sIGV2ZW50LCBkZXRhaWwsIGJ1YmJsZXN9KXtcbiAgICBkZXRhaWwgPSBkZXRhaWwgfHwge31cbiAgICBkZXRhaWwuZGlzcGF0Y2hlciA9IHNvdXJjZUVsXG4gICAgRE9NLmRpc3BhdGNoRXZlbnQoZWwsIGV2ZW50LCB7ZGV0YWlsLCBidWJibGVzfSlcbiAgfSxcblxuICBleGVjX3B1c2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCBhcmdzKXtcbiAgICBpZighdmlldy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cblxuICAgIGxldCB7ZXZlbnQsIGRhdGEsIHRhcmdldCwgcGFnZV9sb2FkaW5nLCBsb2FkaW5nLCB2YWx1ZSwgZGlzcGF0Y2hlcn0gPSBhcmdzXG4gICAgbGV0IHB1c2hPcHRzID0ge2xvYWRpbmcsIHZhbHVlLCB0YXJnZXQsIHBhZ2VfbG9hZGluZzogISFwYWdlX2xvYWRpbmd9XG4gICAgbGV0IHRhcmdldFNyYyA9IGV2ZW50VHlwZSA9PT0gXCJjaGFuZ2VcIiAmJiBkaXNwYXRjaGVyID8gZGlzcGF0Y2hlciA6IHNvdXJjZUVsXG4gICAgbGV0IHBoeFRhcmdldCA9IHRhcmdldCB8fCB0YXJnZXRTcmMuZ2V0QXR0cmlidXRlKHZpZXcuYmluZGluZyhcInRhcmdldFwiKSkgfHwgdGFyZ2V0U3JjXG4gICAgdmlldy53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgKHRhcmdldFZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgaWYoZXZlbnRUeXBlID09PSBcImNoYW5nZVwiKXtcbiAgICAgICAgbGV0IHtuZXdDaWQsIF90YXJnZXQsIGNhbGxiYWNrfSA9IGFyZ3NcbiAgICAgICAgX3RhcmdldCA9IF90YXJnZXQgfHwgKHNvdXJjZUVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCA/IHNvdXJjZUVsLm5hbWUgOiB1bmRlZmluZWQpXG4gICAgICAgIGlmKF90YXJnZXQpeyBwdXNoT3B0cy5fdGFyZ2V0ID0gX3RhcmdldCB9XG4gICAgICAgIHRhcmdldFZpZXcucHVzaElucHV0KHNvdXJjZUVsLCB0YXJnZXRDdHgsIG5ld0NpZCwgZXZlbnQgfHwgcGh4RXZlbnQsIHB1c2hPcHRzLCBjYWxsYmFjaylcbiAgICAgIH0gZWxzZSBpZihldmVudFR5cGUgPT09IFwic3VibWl0XCIpe1xuICAgICAgICB0YXJnZXRWaWV3LnN1Ym1pdEZvcm0oc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIHB1c2hPcHRzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0Vmlldy5wdXNoRXZlbnQoZXZlbnRUeXBlLCBzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBldmVudCB8fCBwaHhFdmVudCwgZGF0YSwgcHVzaE9wdHMpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBleGVjX25hdmlnYXRlKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2hyZWYsIHJlcGxhY2V9KXtcbiAgICB2aWV3LmxpdmVTb2NrZXQuaGlzdG9yeVJlZGlyZWN0KGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiKVxuICB9LFxuXG4gIGV4ZWNfcGF0Y2goZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7aHJlZiwgcmVwbGFjZX0pe1xuICAgIHZpZXcubGl2ZVNvY2tldC5wdXNoSGlzdG9yeVBhdGNoKGhyZWYsIHJlcGxhY2UgPyBcInJlcGxhY2VcIiA6IFwicHVzaFwiLCBzb3VyY2VFbClcbiAgfSxcblxuICBleGVjX2ZvY3VzKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBBUklBLmF0dGVtcHRGb2N1cyhlbCkpXG4gIH0sXG5cbiAgZXhlY19mb2N1c19maXJzdChldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwpe1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gQVJJQS5mb2N1c0ZpcnN0SW50ZXJhY3RpdmUoZWwpIHx8IEFSSUEuZm9jdXNGaXJzdChlbCkpXG4gIH0sXG5cbiAgZXhlY19wdXNoX2ZvY3VzKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCl7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBmb2N1c1N0YWNrID0gZWwgfHwgc291cmNlRWwpXG4gIH0sXG5cbiAgZXhlY19wb3BfZm9jdXMoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsKXtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmKGZvY3VzU3RhY2speyBmb2N1c1N0YWNrLmZvY3VzKCkgfVxuICAgICAgZm9jdXNTdGFjayA9IG51bGxcbiAgICB9KVxuICB9LFxuXG4gIGV4ZWNfYWRkX2NsYXNzKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge25hbWVzLCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG5hbWVzLCBbXSwgdHJhbnNpdGlvbiwgdGltZSwgdmlldylcbiAgfSxcblxuICBleGVjX3JlbW92ZV9jbGFzcyhldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtuYW1lcywgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgbmFtZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpXG4gIH0sXG5cbiAgZXhlY190cmFuc2l0aW9uKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge3RpbWUsIHRyYW5zaXRpb259KXtcbiAgICBsZXQgW3RyYW5zaXRpb25fc3RhcnQsIHJ1bm5pbmcsIHRyYW5zaXRpb25fZW5kXSA9IHRyYW5zaXRpb25cbiAgICBsZXQgb25TdGFydCA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdChydW5uaW5nKSwgW10pXG4gICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uX2VuZCwgdHJhbnNpdGlvbl9zdGFydC5jb25jYXQocnVubmluZykpXG4gICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfSxcblxuICBleGVjX3RvZ2dsZShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWV9KXtcbiAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBpbnMsIG91dHMsIHRpbWUpXG4gIH0sXG5cbiAgZXhlY19zaG93KGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIHRyYW5zaXRpb24sIHRpbWV9KXtcbiAgICB0aGlzLnNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSlcbiAgfSxcblxuICBleGVjX2hpZGUoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIHRoaXMuaGlkZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKVxuICB9LFxuXG4gIGV4ZWNfc2V0X2F0dHIoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cjogW2F0dHIsIHZhbF19KXtcbiAgICB0aGlzLnNldE9yUmVtb3ZlQXR0cnMoZWwsIFtbYXR0ciwgdmFsXV0sIFtdKVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2F0dHIoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7YXR0cn0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW10sIFthdHRyXSlcbiAgfSxcblxuICAvLyB1dGlscyBmb3IgY29tbWFuZHNcblxuICBzaG93KGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpe1xuICAgIGlmKCF0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgbnVsbCwgdGltZSlcbiAgICB9XG4gIH0sXG5cbiAgaGlkZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKXtcbiAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgdGhpcy50b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgbnVsbCwgdHJhbnNpdGlvbiwgdGltZSlcbiAgICB9XG4gIH0sXG5cbiAgdG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIGlucywgb3V0cywgdGltZSl7XG4gICAgbGV0IFtpbkNsYXNzZXMsIGluU3RhcnRDbGFzc2VzLCBpbkVuZENsYXNzZXNdID0gaW5zIHx8IFtbXSwgW10sIFtdXVxuICAgIGxldCBbb3V0Q2xhc3Nlcywgb3V0U3RhcnRDbGFzc2VzLCBvdXRFbmRDbGFzc2VzXSA9IG91dHMgfHwgW1tdLCBbXSwgW11dXG4gICAgaWYoaW5DbGFzc2VzLmxlbmd0aCA+IDAgfHwgb3V0Q2xhc3Nlcy5sZW5ndGggPiAwKXtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRTdGFydENsYXNzZXMsIGluQ2xhc3Nlcy5jb25jYXQoaW5TdGFydENsYXNzZXMpLmNvbmNhdChpbkVuZENsYXNzZXMpKVxuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dENsYXNzZXMsIFtdKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0RW5kQ2xhc3Nlcywgb3V0U3RhcnRDbGFzc2VzKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLWVuZFwiKSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJyZW1vdmVcIil7IHJldHVybiB9XG4gICAgICAgIGxldCBvblN0YXJ0ID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpblN0YXJ0Q2xhc3Nlcywgb3V0Q2xhc3Nlcy5jb25jYXQob3V0U3RhcnRDbGFzc2VzKS5jb25jYXQob3V0RW5kQ2xhc3NlcykpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gKGRpc3BsYXkgfHwgXCJibG9ja1wiKSlcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkNsYXNzZXMsIFtdKVxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgaW5FbmRDbGFzc2VzLCBpblN0YXJ0Q2xhc3NlcykpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBbXSwgaW5DbGFzc2VzLmNvbmNhdChpbkVuZENsYXNzZXMpKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZih0aGlzLmlzVmlzaWJsZShlbCkpe1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpoaWRlLXN0YXJ0XCIpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1zdGFydFwiKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5IHx8IFwiYmxvY2tcIilcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LWVuZFwiKSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLCByZW1vdmVzLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3KXtcbiAgICBsZXQgW3RyYW5zaXRpb25fcnVuLCB0cmFuc2l0aW9uX3N0YXJ0LCB0cmFuc2l0aW9uX2VuZF0gPSB0cmFuc2l0aW9uIHx8IFtbXSwgW10sIFtdXVxuICAgIGlmKHRyYW5zaXRpb25fcnVuLmxlbmd0aCA+IDApe1xuICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgdHJhbnNpdGlvbl9zdGFydC5jb25jYXQodHJhbnNpdGlvbl9ydW4pLCBbXSlcbiAgICAgIGxldCBvbkRvbmUgPSAoKSA9PiB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgYWRkcy5jb25jYXQodHJhbnNpdGlvbl9lbmQpLCByZW1vdmVzLmNvbmNhdCh0cmFuc2l0aW9uX3J1bikuY29uY2F0KHRyYW5zaXRpb25fc3RhcnQpKVxuICAgICAgcmV0dXJuIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gICAgfVxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgbGV0IFtwcmV2QWRkcywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJjbGFzc2VzXCIsIFtbXSwgW11dKVxuICAgICAgbGV0IGtlZXBBZGRzID0gYWRkcy5maWx0ZXIobmFtZSA9PiBwcmV2QWRkcy5pbmRleE9mKG5hbWUpIDwgMCAmJiAhZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKVxuICAgICAgbGV0IGtlZXBSZW1vdmVzID0gcmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBwcmV2UmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCAmJiBlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQgbmV3QWRkcyA9IHByZXZBZGRzLmZpbHRlcihuYW1lID0+IHJlbW92ZXMuaW5kZXhPZihuYW1lKSA8IDApLmNvbmNhdChrZWVwQWRkcylcbiAgICAgIGxldCBuZXdSZW1vdmVzID0gcHJldlJlbW92ZXMuZmlsdGVyKG5hbWUgPT4gYWRkcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBSZW1vdmVzKVxuXG4gICAgICBET00ucHV0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgY3VycmVudEVsID0+IHtcbiAgICAgICAgY3VycmVudEVsLmNsYXNzTGlzdC5yZW1vdmUoLi4ubmV3UmVtb3ZlcylcbiAgICAgICAgY3VycmVudEVsLmNsYXNzTGlzdC5hZGQoLi4ubmV3QWRkcylcbiAgICAgICAgcmV0dXJuIFtuZXdBZGRzLCBuZXdSZW1vdmVzXVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIHNldE9yUmVtb3ZlQXR0cnMoZWwsIHNldHMsIHJlbW92ZXMpe1xuICAgIGxldCBbcHJldlNldHMsIHByZXZSZW1vdmVzXSA9IERPTS5nZXRTdGlja3koZWwsIFwiYXR0cnNcIiwgW1tdLCBbXV0pXG5cbiAgICBsZXQgYWx0ZXJlZEF0dHJzID0gc2V0cy5tYXAoKFthdHRyLCBfdmFsXSkgPT4gYXR0cikuY29uY2F0KHJlbW92ZXMpO1xuICAgIGxldCBuZXdTZXRzID0gcHJldlNldHMuZmlsdGVyKChbYXR0ciwgX3ZhbF0pID0+ICFhbHRlcmVkQXR0cnMuaW5jbHVkZXMoYXR0cikpLmNvbmNhdChzZXRzKTtcbiAgICBsZXQgbmV3UmVtb3ZlcyA9IHByZXZSZW1vdmVzLmZpbHRlcigoYXR0cikgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHJlbW92ZXMpO1xuXG4gICAgRE9NLnB1dFN0aWNreShlbCwgXCJhdHRyc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgbmV3UmVtb3Zlcy5mb3JFYWNoKGF0dHIgPT4gY3VycmVudEVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyKSlcbiAgICAgIG5ld1NldHMuZm9yRWFjaCgoW2F0dHIsIHZhbF0pID0+IGN1cnJlbnRFbC5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsKSlcbiAgICAgIHJldHVybiBbbmV3U2V0cywgbmV3UmVtb3Zlc11cbiAgICB9KVxuICB9LFxuXG4gIGhhc0FsbENsYXNzZXMoZWwsIGNsYXNzZXMpeyByZXR1cm4gY2xhc3Nlcy5ldmVyeShuYW1lID0+IGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSkgfSxcblxuICBpc1RvZ2dsZWRPdXQoZWwsIG91dENsYXNzZXMpe1xuICAgIHJldHVybiAhdGhpcy5pc1Zpc2libGUoZWwpIHx8IHRoaXMuaGFzQWxsQ2xhc3NlcyhlbCwgb3V0Q2xhc3NlcylcbiAgfSxcblxuICBmaWx0ZXJUb0Vscyhzb3VyY2VFbCwge3RvfSl7XG4gICAgcmV0dXJuIHRvID8gRE9NLmFsbChkb2N1bWVudCwgdG8pIDogW3NvdXJjZUVsXVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEpTXG4iLCAiaW1wb3J0IHtcbiAgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCxcbiAgQ0hFQ0tBQkxFX0lOUFVUUyxcbiAgQ09OU0VDVVRJVkVfUkVMT0FEUyxcbiAgUEhYX0FVVE9fUkVDT1ZFUixcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0RJU0FCTEVfV0lUSCxcbiAgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLFxuICBQSFhfRElTQUJMRUQsXG4gIFBIWF9ESVNDT05ORUNURURfQ0xBU1MsXG4gIFBIWF9FVkVOVF9DTEFTU0VTLFxuICBQSFhfRVJST1JfQ0xBU1MsXG4gIFBIWF9GRUVEQkFDS19GT1IsXG4gIFBIWF9IQVNfU1VCTUlUVEVELFxuICBQSFhfSE9PSyxcbiAgUEhYX1BBR0VfTE9BRElORyxcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1BST0dSRVNTLFxuICBQSFhfUkVBRE9OTFksXG4gIFBIWF9SRUYsXG4gIFBIWF9SRUZfU1JDLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9UUkFDS19TVEFUSUMsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfVVBEQVRFLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9NQUlOLFxuICBQSFhfTU9VTlRFRCxcbiAgUFVTSF9USU1FT1VULFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGlzRW1wdHksXG4gIGlzRXF1YWxPYmosXG4gIGxvZ0Vycm9yLFxuICBtYXliZSxcbiAgaXNDaWQsXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRE9NUGF0Y2ggZnJvbSBcIi4vZG9tX3BhdGNoXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgUmVuZGVyZWQgZnJvbSBcIi4vcmVuZGVyZWRcIlxuaW1wb3J0IFZpZXdIb29rIGZyb20gXCIuL3ZpZXdfaG9va1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5sZXQgc2VyaWFsaXplRm9ybSA9IChmb3JtLCBtZXRhLCBvbmx5TmFtZXMgPSBbXSkgPT4ge1xuICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSlcbiAgbGV0IHRvUmVtb3ZlID0gW11cblxuICBmb3JtRGF0YS5mb3JFYWNoKCh2YWwsIGtleSwgX2luZGV4KSA9PiB7XG4gICAgaWYodmFsIGluc3RhbmNlb2YgRmlsZSl7IHRvUmVtb3ZlLnB1c2goa2V5KSB9XG4gIH0pXG5cbiAgLy8gQ2xlYW51cCBhZnRlciBidWlsZGluZyBmaWxlRGF0YVxuICB0b1JlbW92ZS5mb3JFYWNoKGtleSA9PiBmb3JtRGF0YS5kZWxldGUoa2V5KSlcblxuICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG4gIGZvcihsZXQgW2tleSwgdmFsXSBvZiBmb3JtRGF0YS5lbnRyaWVzKCkpe1xuICAgIGlmKG9ubHlOYW1lcy5sZW5ndGggPT09IDAgfHwgb25seU5hbWVzLmluZGV4T2Yoa2V5KSA+PSAwKXtcbiAgICAgIHBhcmFtcy5hcHBlbmQoa2V5LCB2YWwpXG4gICAgfVxuICB9XG4gIGZvcihsZXQgbWV0YUtleSBpbiBtZXRhKXsgcGFyYW1zLmFwcGVuZChtZXRhS2V5LCBtZXRhW21ldGFLZXldKSB9XG5cbiAgcmV0dXJuIHBhcmFtcy50b1N0cmluZygpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3RvcihlbCwgbGl2ZVNvY2tldCwgcGFyZW50VmlldywgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICB0aGlzLmlzRGVhZCA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuICAgIHRoaXMuZmxhc2ggPSBmbGFzaFxuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Vmlld1xuICAgIHRoaXMucm9vdCA9IHBhcmVudFZpZXcgPyBwYXJlbnRWaWV3LnJvb3QgOiB0aGlzXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5pZCA9IHRoaXMuZWwuaWRcbiAgICB0aGlzLnJlZiA9IDBcbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5sb2FkZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5wcnVuaW5nQ0lEcyA9IFtdXG4gICAgdGhpcy5yZWRpcmVjdCA9IGZhbHNlXG4gICAgdGhpcy5ocmVmID0gbnVsbFxuICAgIHRoaXMuam9pbkNvdW50ID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5qb2luQ291bnQgLSAxIDogMFxuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlXG4gICAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZVxuICAgIHRoaXMuam9pbkNhbGxiYWNrID0gZnVuY3Rpb24ob25Eb25lKXsgb25Eb25lICYmIG9uRG9uZSgpIH1cbiAgICB0aGlzLnN0b3BDYWxsYmFjayA9IGZ1bmN0aW9uKCl7IH1cbiAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gdGhpcy5wYXJlbnQgPyBudWxsIDogW11cbiAgICB0aGlzLnZpZXdIb29rcyA9IHt9XG4gICAgdGhpcy51cGxvYWRlcnMgPSB7fVxuICAgIHRoaXMuZm9ybVN1Ym1pdHMgPSBbXVxuICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLnBhcmVudCA/IG51bGwgOiB7fVxuICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSA9IHt9XG4gICAgdGhpcy5jaGFubmVsID0gdGhpcy5saXZlU29ja2V0LmNoYW5uZWwoYGx2OiR7dGhpcy5pZH1gLCAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWRpcmVjdDogdGhpcy5yZWRpcmVjdCA/IHRoaXMuaHJlZiA6IHVuZGVmaW5lZCxcbiAgICAgICAgdXJsOiB0aGlzLnJlZGlyZWN0ID8gdW5kZWZpbmVkIDogdGhpcy5ocmVmIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgcGFyYW1zOiB0aGlzLmNvbm5lY3RQYXJhbXMobGl2ZVJlZmVyZXIpLFxuICAgICAgICBzZXNzaW9uOiB0aGlzLmdldFNlc3Npb24oKSxcbiAgICAgICAgc3RhdGljOiB0aGlzLmdldFN0YXRpYygpLFxuICAgICAgICBmbGFzaDogdGhpcy5mbGFzaCxcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuc2hvd0xvYWRlcih0aGlzLmxpdmVTb2NrZXQubG9hZGVyVGltZW91dClcbiAgICB0aGlzLmJpbmRDaGFubmVsKClcbiAgfVxuXG4gIHNldEhyZWYoaHJlZil7IHRoaXMuaHJlZiA9IGhyZWYgfVxuXG4gIHNldFJlZGlyZWN0KGhyZWYpe1xuICAgIHRoaXMucmVkaXJlY3QgPSB0cnVlXG4gICAgdGhpcy5ocmVmID0gaHJlZlxuICB9XG5cbiAgaXNNYWluKCl7IHJldHVybiB0aGlzLmVsLmdldEF0dHJpYnV0ZShQSFhfTUFJTikgIT09IG51bGwgfVxuXG4gIGNvbm5lY3RQYXJhbXMobGl2ZVJlZmVyZXIpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG4gICAgcGFyYW1zW1wiX2xpdmVfcmVmZXJlclwiXSA9IGxpdmVSZWZlcmVyXG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfRElTQ09OTkVDVEVEX0NMQVNTLFxuICAgICAgUEhYX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9ESVNDT05ORUNURURfQ0xBU1MpXG4gICAgfVxuICB9XG5cbiAgZXhlY0FsbChiaW5kaW5nKXtcbiAgICBET00uYWxsKHRoaXMuZWwsIGBbJHtiaW5kaW5nfV1gLCBlbCA9PiB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBlbC5nZXRBdHRyaWJ1dGUoYmluZGluZykpKVxuICB9XG5cbiAgaGlkZUxvYWRlcigpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfQ09OTkVDVEVEX0NMQVNTKVxuICAgIHRoaXMuZXhlY0FsbCh0aGlzLmJpbmRpbmcoXCJjb25uZWN0ZWRcIikpXG4gIH1cblxuICB0cmlnZ2VyUmVjb25uZWN0ZWQoKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fcmVjb25uZWN0ZWQoKSB9XG4gIH1cblxuICBsb2coa2luZCwgbXNnQ2FsbGJhY2spe1xuICAgIHRoaXMubGl2ZVNvY2tldC5sb2codGhpcywga2luZCwgbXNnQ2FsbGJhY2spXG4gIH1cblxuICB0cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSA9IGZ1bmN0aW9uKCl7fSl7XG4gICAgdGhpcy5saXZlU29ja2V0LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9XG5cbiAgd2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsIGNhbGxiYWNrKXtcbiAgICBpZihwaHhUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCBwaHhUYXJnZXQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KXtcbiAgICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQub3duZXIocGh4VGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHBoeFRhcmdldCkpXG4gICAgfVxuXG4gICAgaWYoaXNDaWQocGh4VGFyZ2V0KSl7XG4gICAgICBsZXQgdGFyZ2V0cyA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgcGh4VGFyZ2V0KVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApe1xuICAgICAgICBsb2dFcnJvcihgbm8gY29tcG9uZW50IGZvdW5kIG1hdGNoaW5nIHBoeC10YXJnZXQgb2YgJHtwaHhUYXJnZXR9YClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMsIHBhcnNlSW50KHBoeFRhcmdldCkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCB0YXJnZXRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBoeFRhcmdldCkpXG4gICAgICBpZih0YXJnZXRzLmxlbmd0aCA9PT0gMCl7IGxvZ0Vycm9yKGBub3RoaW5nIGZvdW5kIG1hdGNoaW5nIHRoZSBwaHgtdGFyZ2V0IHNlbGVjdG9yIFwiJHtwaHhUYXJnZXR9XCJgKSB9XG4gICAgICB0YXJnZXRzLmZvckVhY2godGFyZ2V0ID0+IHRoaXMubGl2ZVNvY2tldC5vd25lcih0YXJnZXQsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgdGFyZ2V0KSkpXG4gICAgfVxuICB9XG5cbiAgYXBwbHlEaWZmKHR5cGUsIHJhd0RpZmYsIGNhbGxiYWNrKXtcbiAgICB0aGlzLmxvZyh0eXBlLCAoKSA9PiBbXCJcIiwgY2xvbmUocmF3RGlmZildKVxuICAgIGxldCB7ZGlmZiwgcmVwbHksIGV2ZW50cywgdGl0bGV9ID0gUmVuZGVyZWQuZXh0cmFjdChyYXdEaWZmKVxuICAgIGlmKHRpdGxlKXsgRE9NLnB1dFRpdGxlKHRpdGxlKSB9XG5cbiAgICBjYWxsYmFjayh7ZGlmZiwgcmVwbHksIGV2ZW50c30pXG4gIH1cblxuICBvbkpvaW4ocmVzcCl7XG4gICAgbGV0IHtyZW5kZXJlZCwgY29udGFpbmVyfSA9IHJlc3BcbiAgICBpZihjb250YWluZXIpe1xuICAgICAgbGV0IFt0YWcsIGF0dHJzXSA9IGNvbnRhaW5lclxuICAgICAgdGhpcy5lbCA9IERPTS5yZXBsYWNlUm9vdENvbnRhaW5lcih0aGlzLmVsLCB0YWcsIGF0dHJzKVxuICAgIH1cbiAgICB0aGlzLmNoaWxkSm9pbnMgPSAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmZsYXNoID0gbnVsbFxuXG4gICAgQnJvd3Nlci5kcm9wTG9jYWwodGhpcy5saXZlU29ja2V0LmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTKVxuICAgIHRoaXMuYXBwbHlEaWZmKFwibW91bnRcIiwgcmVuZGVyZWQsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlZCA9IG5ldyBSZW5kZXJlZCh0aGlzLmlkLCBkaWZmKVxuICAgICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlckNvbnRhaW5lcihudWxsLCBcImpvaW5cIilcbiAgICAgIHRoaXMuZHJvcFBlbmRpbmdSZWZzKClcbiAgICAgIGxldCBmb3JtcyA9IHRoaXMuZm9ybXNGb3JSZWNvdmVyeShodG1sKVxuICAgICAgdGhpcy5qb2luQ291bnQrK1xuXG4gICAgICBpZihmb3Jtcy5sZW5ndGggPiAwKXtcbiAgICAgICAgZm9ybXMuZm9yRWFjaCgoW2Zvcm0sIG5ld0Zvcm0sIG5ld0NpZF0sIGkpID0+IHtcbiAgICAgICAgICB0aGlzLnB1c2hGb3JtUmVjb3ZlcnkoZm9ybSwgbmV3Q2lkLCByZXNwID0+IHtcbiAgICAgICAgICAgIGlmKGkgPT09IGZvcm1zLmxlbmd0aCAtIDEpe1xuICAgICAgICAgICAgICB0aGlzLm9uSm9pbkNvbXBsZXRlKHJlc3AsIGh0bWwsIGV2ZW50cylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkpvaW5Db21wbGV0ZShyZXNwLCBodG1sLCBldmVudHMpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRyb3BQZW5kaW5nUmVmcygpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMuaWR9XCJdWyR7UEhYX1JFRn1dYCwgZWwgPT4ge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUYpXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRl9TUkMpXG4gICAgfSlcbiAgfVxuXG4gIG9uSm9pbkNvbXBsZXRlKHtsaXZlX3BhdGNofSwgaHRtbCwgZXZlbnRzKXtcbiAgICAvLyBJbiBvcmRlciB0byBwcm92aWRlIGEgYmV0dGVyIGV4cGVyaWVuY2UsIHdlIHdhbnQgdG8gam9pblxuICAgIC8vIGFsbCBMaXZlVmlld3MgZmlyc3QgYW5kIG9ubHkgdGhlbiBhcHBseSB0aGVpciBwYXRjaGVzLlxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSB8fCAodGhpcy5wYXJlbnQgJiYgIXRoaXMucGFyZW50LmlzSm9pblBlbmRpbmcoKSkpe1xuICAgICAgcmV0dXJuIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKVxuICAgIH1cblxuICAgIC8vIE9uZSBkb3duc2lkZSBvZiB0aGlzIGFwcHJvYWNoIGlzIHRoYXQgd2UgbmVlZCB0byBmaW5kIHBoeENoaWxkcmVuXG4gICAgLy8gaW4gdGhlIGh0bWwgZnJhZ21lbnQsIGluc3RlYWQgb2YgZGlyZWN0bHkgb24gdGhlIERPTS4gVGhlIGZyYWdtZW50XG4gICAgLy8gYWxzbyBkb2VzIG5vdCBpbmNsdWRlIFBIWF9TVEFUSUMsIHNvIHdlIG5lZWQgdG8gY29weSBpdCBvdmVyIGZyb21cbiAgICAvLyB0aGUgRE9NLlxuICAgIGxldCBuZXdDaGlsZHJlbiA9IERPTS5maW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHRoaXMuaWQpLmZpbHRlcih0b0VsID0+IHtcbiAgICAgIGxldCBmcm9tRWwgPSB0b0VsLmlkICYmIHRoaXMuZWwucXVlcnlTZWxlY3RvcihgW2lkPVwiJHt0b0VsLmlkfVwiXWApXG4gICAgICBsZXQgcGh4U3RhdGljID0gZnJvbUVsICYmIGZyb21FbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICAgIGlmKHBoeFN0YXRpYyl7IHRvRWwuc2V0QXR0cmlidXRlKFBIWF9TVEFUSUMsIHBoeFN0YXRpYykgfVxuICAgICAgcmV0dXJuIHRoaXMuam9pbkNoaWxkKHRvRWwpXG4gICAgfSlcblxuICAgIGlmKG5ld0NoaWxkcmVuLmxlbmd0aCA9PT0gMCl7XG4gICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cyldKVxuICAgICAgICB0aGlzLnBhcmVudC5hY2tKb2luKHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKClcbiAgICAgICAgdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cyldKVxuICAgIH1cbiAgfVxuXG4gIGF0dGFjaFRydWVEb2NFbCgpe1xuICAgIHRoaXMuZWwgPSBET00uYnlJZCh0aGlzLmlkKVxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFBIWF9ST09UX0lELCB0aGlzLnJvb3QuaWQpXG4gIH1cblxuICBleGVjTmV3TW91bnRlZCgpe1xuICAgIERPTS5hbGwodGhpcy5lbCwgYFske3RoaXMuYmluZGluZyhQSFhfSE9PSyl9XSwgW2RhdGEtcGh4LSR7UEhYX0hPT0t9XWAsIGhvb2tFbCA9PiB7XG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhob29rRWwpXG4gICAgfSlcbiAgICBET00uYWxsKHRoaXMuZWwsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX01PVU5URUQpfV1gLCBlbCA9PiB0aGlzLm1heWJlTW91bnRlZChlbCkpXG4gIH1cblxuICBhcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpe1xuICAgIHRoaXMuYXR0YWNoVHJ1ZURvY0VsKClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgbnVsbClcbiAgICBwYXRjaC5tYXJrUHJ1bmFibGVDb250ZW50Rm9yUmVtb3ZhbCgpXG4gICAgdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIGZhbHNlKVxuICAgIHRoaXMuam9pbk5ld0NoaWxkcmVuKClcbiAgICB0aGlzLmV4ZWNOZXdNb3VudGVkKClcblxuICAgIHRoaXMuam9pblBlbmRpbmcgPSBmYWxzZVxuICAgIHRoaXMubGl2ZVNvY2tldC5kaXNwYXRjaEV2ZW50cyhldmVudHMpXG4gICAgdGhpcy5hcHBseVBlbmRpbmdVcGRhdGVzKClcblxuICAgIGlmKGxpdmVfcGF0Y2gpe1xuICAgICAgbGV0IHtraW5kLCB0b30gPSBsaXZlX3BhdGNoXG4gICAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVBhdGNoKHRvLCBraW5kKVxuICAgIH1cbiAgICB0aGlzLmhpZGVMb2FkZXIoKVxuICAgIGlmKHRoaXMuam9pbkNvdW50ID4gMSl7IHRoaXMudHJpZ2dlclJlY29ubmVjdGVkKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrKClcbiAgfVxuXG4gIHRyaWdnZXJCZWZvcmVVcGRhdGVIb29rKGZyb21FbCwgdG9FbCl7XG4gICAgdGhpcy5saXZlU29ja2V0LnRyaWdnZXJET00oXCJvbkJlZm9yZUVsVXBkYXRlZFwiLCBbZnJvbUVsLCB0b0VsXSlcbiAgICBsZXQgaG9vayA9IHRoaXMuZ2V0SG9vayhmcm9tRWwpXG4gICAgbGV0IGlzSWdub3JlZCA9IGhvb2sgJiYgRE9NLmlzSWdub3JlZChmcm9tRWwsIHRoaXMuYmluZGluZyhQSFhfVVBEQVRFKSlcbiAgICBpZihob29rICYmICFmcm9tRWwuaXNFcXVhbE5vZGUodG9FbCkgJiYgIShpc0lnbm9yZWQgJiYgaXNFcXVhbE9iaihmcm9tRWwuZGF0YXNldCwgdG9FbC5kYXRhc2V0KSkpe1xuICAgICAgaG9vay5fX2JlZm9yZVVwZGF0ZSgpXG4gICAgICByZXR1cm4gaG9va1xuICAgIH1cbiAgfVxuXG4gIG1heWJlTW91bnRlZChlbCl7XG4gICAgbGV0IHBoeE1vdW50ZWQgPSBlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9NT1VOVEVEKSlcbiAgICBsZXQgaGFzQmVlbkludm9rZWQgPSBwaHhNb3VudGVkICYmIERPTS5wcml2YXRlKGVsLCBcIm1vdW50ZWRcIilcbiAgICBpZihwaHhNb3VudGVkICYmICFoYXNCZWVuSW52b2tlZCl7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQuZXhlY0pTKGVsLCBwaHhNb3VudGVkKVxuICAgICAgRE9NLnB1dFByaXZhdGUoZWwsIFwibW91bnRlZFwiLCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIG1heWJlQWRkTmV3SG9vayhlbCwgZm9yY2Upe1xuICAgIGxldCBuZXdIb29rID0gdGhpcy5hZGRIb29rKGVsKVxuICAgIGlmKG5ld0hvb2speyBuZXdIb29rLl9fbW91bnRlZCgpIH1cbiAgfVxuXG4gIHBlcmZvcm1QYXRjaChwYXRjaCwgcHJ1bmVDaWRzKXtcbiAgICBsZXQgcmVtb3ZlZEVscyA9IFtdXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuICAgIGxldCB1cGRhdGVkSG9va0lkcyA9IG5ldyBTZXQoKVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJhZGRlZFwiLCBlbCA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uTm9kZUFkZGVkXCIsIFtlbF0pXG4gICAgICB0aGlzLm1heWJlQWRkTmV3SG9vayhlbClcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZSl7IHRoaXMubWF5YmVNb3VudGVkKGVsKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybSgpXG4gICAgdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChyZW1vdmVkRWxzLCBwcnVuZUNpZHMpXG5cbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV1gKVxuICAgICAgY29tcG9uZW50cy5jb25jYXQocGFyZW50KS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgbGV0IGNpZCA9IHRoaXMuY29tcG9uZW50SUQoZWwpXG4gICAgICAgIGlmKGlzQ2lkKGNpZCkgJiYgZGVzdHJveWVkQ0lEcy5pbmRleE9mKGNpZCkgPT09IC0xKXsgZGVzdHJveWVkQ0lEcy5wdXNoKGNpZCkgfVxuICAgICAgfSlcbiAgICAgIGhvb2tzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goaG9va0VsID0+IHtcbiAgICAgICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soaG9va0VsKVxuICAgICAgICBob29rICYmIHRoaXMuZGVzdHJveUhvb2soaG9vaylcbiAgICAgIH0pXG4gICAgfSlcbiAgICAvLyBXZSBzaG91bGQgbm90IHBydW5lQ2lkcyBvbiBqb2lucy4gT3RoZXJ3aXNlLCBpbiBjYXNlIG9mXG4gICAgLy8gcmVqb2lucywgd2UgbWF5IG5vdGlmeSBjaWRzIHRoYXQgbm8gbG9uZ2VyIGJlbG9uZyB0byB0aGVcbiAgICAvLyBjdXJyZW50IExpdmVWaWV3IHRvIGJlIHJlbW92ZWQuXG4gICAgaWYocHJ1bmVDaWRzKXtcbiAgICAgIHRoaXMubWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKVxuICAgIH1cbiAgfVxuXG4gIGpvaW5OZXdDaGlsZHJlbigpe1xuICAgIERPTS5maW5kUGh4Q2hpbGRyZW4odGhpcy5lbCwgdGhpcy5pZCkuZm9yRWFjaChlbCA9PiB0aGlzLmpvaW5DaGlsZChlbCkpXG4gIH1cblxuICBnZXRDaGlsZEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW2lkXSB9XG5cbiAgZ2V0RGVzY2VuZGVudEJ5RWwoZWwpe1xuICAgIGlmKGVsLmlkID09PSB0aGlzLmlkKXtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2VsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKV1bZWwuaWRdXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveURlc2NlbmRlbnQoaWQpe1xuICAgIGZvcihsZXQgcGFyZW50SWQgaW4gdGhpcy5yb290LmNoaWxkcmVuKXtcbiAgICAgIGZvcihsZXQgY2hpbGRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdKXtcbiAgICAgICAgaWYoY2hpbGRJZCA9PT0gaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXVtjaGlsZElkXS5kZXN0cm95KCkgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGpvaW5DaGlsZChlbCl7XG4gICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZEJ5SWQoZWwuaWQpXG4gICAgaWYoIWNoaWxkKXtcbiAgICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMubGl2ZVNvY2tldCwgdGhpcylcbiAgICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVt2aWV3LmlkXSA9IHZpZXdcbiAgICAgIHZpZXcuam9pbigpXG4gICAgICB0aGlzLmNoaWxkSm9pbnMrK1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBpc0pvaW5QZW5kaW5nKCl7IHJldHVybiB0aGlzLmpvaW5QZW5kaW5nIH1cblxuICBhY2tKb2luKF9jaGlsZCl7XG4gICAgdGhpcy5jaGlsZEpvaW5zLS1cblxuICAgIGlmKHRoaXMuY2hpbGRKb2lucyA9PT0gMCl7XG4gICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgIHRoaXMucGFyZW50LmFja0pvaW4odGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKCl7XG4gICAgdGhpcy5qb2luQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcy5mb3JFYWNoKChbdmlldywgb3BdKSA9PiB7XG4gICAgICAgIGlmKCF2aWV3LmlzRGVzdHJveWVkKCkpeyBvcCgpIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gW11cbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKGRpZmYsIGV2ZW50cyl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHRoaXMucm9vdC5pc01haW4oKSkpe1xuICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ0RpZmZzLnB1c2goe2RpZmYsIGV2ZW50c30pXG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlZC5tZXJnZURpZmYoZGlmZilcbiAgICBsZXQgcGh4Q2hpbGRyZW5BZGRlZCA9IGZhbHNlXG5cbiAgICAvLyBXaGVuIHRoZSBkaWZmIG9ubHkgY29udGFpbnMgY29tcG9uZW50IGRpZmZzLCB0aGVuIHdhbGsgY29tcG9uZW50c1xuICAgIC8vIGFuZCBwYXRjaCBvbmx5IHRoZSBwYXJlbnQgY29tcG9uZW50IGNvbnRhaW5lcnMgZm91bmQgaW4gdGhlIGRpZmYuXG4gICAgLy8gT3RoZXJ3aXNlLCBwYXRjaCBlbnRpcmUgTFYgY29udGFpbmVyLlxuICAgIGlmKHRoaXMucmVuZGVyZWQuaXNDb21wb25lbnRPbmx5RGlmZihkaWZmKSl7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQudGltZShcImNvbXBvbmVudCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBwYXJlbnRDaWRzID0gRE9NLmZpbmRQYXJlbnRDSURzKHRoaXMuZWwsIHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKSlcbiAgICAgICAgcGFyZW50Q2lkcy5mb3JFYWNoKHBhcmVudENJRCA9PiB7XG4gICAgICAgICAgaWYodGhpcy5jb21wb25lbnRQYXRjaCh0aGlzLnJlbmRlcmVkLmdldENvbXBvbmVudChkaWZmLCBwYXJlbnRDSUQpLCBwYXJlbnRDSUQpKXsgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWUgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYoIWlzRW1wdHkoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJmdWxsIHBhdGNoIGNvbXBsZXRlXCIsICgpID0+IHtcbiAgICAgICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlckNvbnRhaW5lcihkaWZmLCBcInVwZGF0ZVwiKVxuICAgICAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgbnVsbClcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmxpdmVTb2NrZXQuZGlzcGF0Y2hFdmVudHMoZXZlbnRzKVxuICAgIGlmKHBoeENoaWxkcmVuQWRkZWQpeyB0aGlzLmpvaW5OZXdDaGlsZHJlbigpIH1cbiAgfVxuXG4gIHJlbmRlckNvbnRhaW5lcihkaWZmLCBraW5kKXtcbiAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnRpbWUoYHRvU3RyaW5nIGRpZmYgKCR7a2luZH0pYCwgKCkgPT4ge1xuICAgICAgbGV0IHRhZyA9IHRoaXMuZWwudGFnTmFtZVxuICAgICAgLy8gRG9uJ3Qgc2tpcCBhbnkgY29tcG9uZW50IGluIHRoZSBkaWZmIG5vciBhbnkgbWFya2VkIGFzIHBydW5lZFxuICAgICAgLy8gKGFzIHRoZXkgbWF5IGhhdmUgYmVlbiBhZGRlZCBiYWNrKVxuICAgICAgbGV0IGNpZHMgPSBkaWZmID8gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRDSURzKGRpZmYpLmNvbmNhdCh0aGlzLnBydW5pbmdDSURzKSA6IG51bGxcbiAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJlZC50b1N0cmluZyhjaWRzKVxuICAgICAgcmV0dXJuIGA8JHt0YWd9PiR7aHRtbH08LyR7dGFnfT5gXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFBhdGNoKGRpZmYsIGNpZCl7XG4gICAgaWYoaXNFbXB0eShkaWZmKSkgcmV0dXJuIGZhbHNlXG4gICAgbGV0IGh0bWwgPSB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudFRvU3RyaW5nKGNpZClcbiAgICBsZXQgcGF0Y2ggPSBuZXcgRE9NUGF0Y2godGhpcywgdGhpcy5lbCwgdGhpcy5pZCwgaHRtbCwgY2lkKVxuICAgIGxldCBjaGlsZHJlbkFkZGVkID0gdGhpcy5wZXJmb3JtUGF0Y2gocGF0Y2gsIHRydWUpXG4gICAgcmV0dXJuIGNoaWxkcmVuQWRkZWRcbiAgfVxuXG4gIGdldEhvb2soZWwpeyByZXR1cm4gdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGVsKV0gfVxuXG4gIGFkZEhvb2soZWwpe1xuICAgIGlmKFZpZXdIb29rLmVsZW1lbnRJRChlbCkgfHwgIWVsLmdldEF0dHJpYnV0ZSl7IHJldHVybiB9XG4gICAgbGV0IGhvb2tOYW1lID0gZWwuZ2V0QXR0cmlidXRlKGBkYXRhLXBoeC0ke1BIWF9IT09LfWApIHx8IGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0hPT0spKVxuICAgIGlmKGhvb2tOYW1lICYmICF0aGlzLm93bnNFbGVtZW50KGVsKSl7IHJldHVybiB9XG4gICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMubGl2ZVNvY2tldC5nZXRIb29rQ2FsbGJhY2tzKGhvb2tOYW1lKVxuXG4gICAgaWYoY2FsbGJhY2tzKXtcbiAgICAgIGlmKCFlbC5pZCl7IGxvZ0Vycm9yKGBubyBET00gSUQgZm9yIGhvb2sgXCIke2hvb2tOYW1lfVwiLiBIb29rcyByZXF1aXJlIGEgdW5pcXVlIElEIG9uIGVhY2ggZWxlbWVudC5gLCBlbCkgfVxuICAgICAgbGV0IGhvb2sgPSBuZXcgVmlld0hvb2sodGhpcywgZWwsIGNhbGxiYWNrcylcbiAgICAgIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV0gPSBob29rXG4gICAgICByZXR1cm4gaG9va1xuICAgIH0gZWxzZSBpZihob29rTmFtZSAhPT0gbnVsbCl7XG4gICAgICBsb2dFcnJvcihgdW5rbm93biBob29rIGZvdW5kIGZvciBcIiR7aG9va05hbWV9XCJgLCBlbClcbiAgICB9XG4gIH1cblxuICBkZXN0cm95SG9vayhob29rKXtcbiAgICBob29rLl9fZGVzdHJveWVkKClcbiAgICBob29rLl9fY2xlYW51cF9fKClcbiAgICBkZWxldGUgdGhpcy52aWV3SG9va3NbVmlld0hvb2suZWxlbWVudElEKGhvb2suZWwpXVxuICB9XG5cbiAgYXBwbHlQZW5kaW5nVXBkYXRlcygpe1xuICAgIHRoaXMucGVuZGluZ0RpZmZzLmZvckVhY2goKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgfVxuXG4gIG9uQ2hhbm5lbChldmVudCwgY2Ipe1xuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBpZih0aGlzLmlzSm9pblBlbmRpbmcoKSl7XG4gICAgICAgIHRoaXMucm9vdC5wZW5kaW5nSm9pbk9wcy5wdXNoKFt0aGlzLCAoKSA9PiBjYihyZXNwKV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiBjYihyZXNwKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZENoYW5uZWwoKXtcbiAgICAvLyBUaGUgZGlmZiBldmVudCBzaG91bGQgYmUgaGFuZGxlZCBieSB0aGUgcmVndWxhciB1cGRhdGUgb3BlcmF0aW9ucy5cbiAgICAvLyBBbGwgb3RoZXIgb3BlcmF0aW9ucyBhcmUgcXVldWVkIHRvIGJlIGFwcGxpZWQgb25seSBhZnRlciBqb2luLlxuICAgIHRoaXMubGl2ZVNvY2tldC5vbkNoYW5uZWwodGhpcy5jaGFubmVsLCBcImRpZmZcIiwgKHJhd0RpZmYpID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBseURpZmYoXCJ1cGRhdGVcIiwgcmF3RGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMub25DaGFubmVsKFwicmVkaXJlY3RcIiwgKHt0bywgZmxhc2h9KSA9PiB0aGlzLm9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0pKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9wYXRjaFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUGF0Y2gocmVkaXIpKVxuICAgIHRoaXMub25DaGFubmVsKFwibGl2ZV9yZWRpcmVjdFwiLCAocmVkaXIpID0+IHRoaXMub25MaXZlUmVkaXJlY3QocmVkaXIpKVxuICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKHJlYXNvbiA9PiB0aGlzLm9uRXJyb3IocmVhc29uKSlcbiAgICB0aGlzLmNoYW5uZWwub25DbG9zZShyZWFzb24gPT4gdGhpcy5vbkNsb3NlKHJlYXNvbikpXG4gIH1cblxuICBkZXN0cm95QWxsQ2hpbGRyZW4oKXtcbiAgICBmb3IobGV0IGlkIGluIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXSl7XG4gICAgICB0aGlzLmdldENoaWxkQnlJZChpZCkuZGVzdHJveSgpXG4gICAgfVxuICB9XG5cbiAgb25MaXZlUmVkaXJlY3QocmVkaXIpe1xuICAgIGxldCB7dG8sIGtpbmQsIGZsYXNofSA9IHJlZGlyXG4gICAgbGV0IHVybCA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UmVkaXJlY3QodXJsLCBraW5kLCBmbGFzaClcbiAgfVxuXG4gIG9uTGl2ZVBhdGNoKHJlZGlyKXtcbiAgICBsZXQge3RvLCBraW5kfSA9IHJlZGlyXG4gICAgdGhpcy5ocmVmID0gdGhpcy5leHBhbmRVUkwodG8pXG4gICAgdGhpcy5saXZlU29ja2V0Lmhpc3RvcnlQYXRjaCh0bywga2luZClcbiAgfVxuXG4gIGV4cGFuZFVSTCh0byl7XG4gICAgcmV0dXJuIHRvLnN0YXJ0c1dpdGgoXCIvXCIpID8gYCR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0ke3RvfWAgOiB0b1xuICB9XG5cbiAgb25SZWRpcmVjdCh7dG8sIGZsYXNofSl7IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh0bywgZmxhc2gpIH1cblxuICBpc0Rlc3Ryb3llZCgpeyByZXR1cm4gdGhpcy5kZXN0cm95ZWQgfVxuXG4gIGpvaW5EZWFkKCl7IHRoaXMuaXNEZWFkID0gdHJ1ZSB9XG5cbiAgam9pbihjYWxsYmFjayl7XG4gICAgaWYodGhpcy5pc01haW4oKSl7XG4gICAgICB0aGlzLnN0b3BDYWxsYmFjayA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe3RvOiB0aGlzLmhyZWYsIGtpbmQ6IFwiaW5pdGlhbFwifSlcbiAgICB9XG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSAob25Eb25lKSA9PiB7XG4gICAgICBvbkRvbmUgPSBvbkRvbmUgfHwgZnVuY3Rpb24oKXt9XG4gICAgICBjYWxsYmFjayA/IGNhbGxiYWNrKHRoaXMuam9pbkNvdW50LCBvbkRvbmUpIDogb25Eb25lKClcbiAgICB9XG4gICAgdGhpcy5saXZlU29ja2V0LndyYXBQdXNoKHRoaXMsIHt0aW1lb3V0OiBmYWxzZX0sICgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwuam9pbigpXG4gICAgICAgIC5yZWNlaXZlKFwib2tcIiwgZGF0YSA9PiB7XG4gICAgICAgICAgaWYoIXRoaXMuaXNEZXN0cm95ZWQoKSl7XG4gICAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB0aGlzLm9uSm9pbihkYXRhKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgcmVzcCA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIHRoaXMub25Kb2luRXJyb3IocmVzcCkpXG4gICAgICAgIC5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiAhdGhpcy5pc0Rlc3Ryb3llZCgpICYmIHRoaXMub25Kb2luRXJyb3Ioe3JlYXNvbjogXCJ0aW1lb3V0XCJ9KSlcbiAgICB9KVxuICB9XG5cbiAgb25Kb2luRXJyb3IocmVzcCl7XG4gICAgaWYocmVzcC5yZWFzb24gPT09IFwidW5hdXRob3JpemVkXCIgfHwgcmVzcC5yZWFzb24gPT09IFwic3RhbGVcIil7XG4gICAgICB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInVuYXV0aG9yaXplZCBsaXZlX3JlZGlyZWN0LiBGYWxsaW5nIGJhY2sgdG8gcGFnZSByZXF1ZXN0XCIsIHJlc3BdKVxuICAgICAgcmV0dXJuIHRoaXMub25SZWRpcmVjdCh7dG86IHRoaXMuaHJlZn0pXG4gICAgfVxuICAgIGlmKHJlc3AucmVkaXJlY3QgfHwgcmVzcC5saXZlX3JlZGlyZWN0KXtcbiAgICAgIHRoaXMuam9pblBlbmRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5jaGFubmVsLmxlYXZlKClcbiAgICB9XG4gICAgaWYocmVzcC5yZWRpcmVjdCl7IHJldHVybiB0aGlzLm9uUmVkaXJlY3QocmVzcC5yZWRpcmVjdCkgfVxuICAgIGlmKHJlc3AubGl2ZV9yZWRpcmVjdCl7IHJldHVybiB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlc3AubGl2ZV9yZWRpcmVjdCkgfVxuICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widW5hYmxlIHRvIGpvaW5cIiwgcmVzcF0pXG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKSB9XG4gIH1cblxuICBvbkNsb3NlKHJlYXNvbil7XG4gICAgaWYodGhpcy5pc0Rlc3Ryb3llZCgpKXsgcmV0dXJuIH1cbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaGFzUGVuZGluZ0xpbmsoKSAmJiByZWFzb24gIT09IFwibGVhdmVcIil7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcylcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95QWxsQ2hpbGRyZW4oKVxuICAgIHRoaXMubGl2ZVNvY2tldC5kcm9wQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIC8vIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgY2FuIGJlIG51bGwgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTFcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50KXsgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCkgfVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpe1xuICAgICAgdGhpcy5zaG93TG9hZGVyKEJFRk9SRV9VTkxPQURfTE9BREVSX1RJTUVPVVQpXG4gICAgfVxuICB9XG5cbiAgb25FcnJvcihyZWFzb24pe1xuICAgIHRoaXMub25DbG9zZShyZWFzb24pXG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLmxvZyhcImVycm9yXCIsICgpID0+IFtcInZpZXcgY3Jhc2hlZFwiLCByZWFzb25dKSB9XG4gICAgaWYoIXRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpeyB0aGlzLmRpc3BsYXlFcnJvcigpIH1cbiAgfVxuXG4gIGRpc3BsYXlFcnJvcigpe1xuICAgIGlmKHRoaXMuaXNNYWluKCkpeyBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiB7dG86IHRoaXMuaHJlZiwga2luZDogXCJlcnJvclwifX0pIH1cbiAgICB0aGlzLnNob3dMb2FkZXIoKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfRElTQ09OTkVDVEVEX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MpXG4gICAgdGhpcy5leGVjQWxsKHRoaXMuYmluZGluZyhcImRpc2Nvbm5lY3RlZFwiKSlcbiAgfVxuXG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cblxuICAgIGxldCBbcmVmLCBbZWxdLCBvcHRzXSA9IHJlZkdlbmVyYXRvciA/IHJlZkdlbmVyYXRvcigpIDogW251bGwsIFtdLCB7fV1cbiAgICBsZXQgb25Mb2FkaW5nRG9uZSA9IGZ1bmN0aW9uKCl7IH1cbiAgICBpZihvcHRzLnBhZ2VfbG9hZGluZyB8fCAoZWwgJiYgKGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX1BBR0VfTE9BRElORykpICE9PSBudWxsKSkpe1xuICAgICAgb25Mb2FkaW5nRG9uZSA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe2tpbmQ6IFwiZWxlbWVudFwiLCB0YXJnZXQ6IGVsfSlcbiAgICB9XG5cbiAgICBpZih0eXBlb2YgKHBheWxvYWQuY2lkKSAhPT0gXCJudW1iZXJcIil7IGRlbGV0ZSBwYXlsb2FkLmNpZCB9XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubGl2ZVNvY2tldC53cmFwUHVzaCh0aGlzLCB7dGltZW91dDogdHJ1ZX0sICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5wdXNoKGV2ZW50LCBwYXlsb2FkLCBQVVNIX1RJTUVPVVQpLnJlY2VpdmUoXCJva1wiLCByZXNwID0+IHtcbiAgICAgICAgICBsZXQgZmluaXNoID0gKGhvb2tSZXBseSkgPT4ge1xuICAgICAgICAgICAgaWYocmVzcC5yZWRpcmVjdCl7IHRoaXMub25SZWRpcmVjdChyZXNwLnJlZGlyZWN0KSB9XG4gICAgICAgICAgICBpZihyZXNwLmxpdmVfcGF0Y2gpeyB0aGlzLm9uTGl2ZVBhdGNoKHJlc3AubGl2ZV9wYXRjaCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3JlZGlyZWN0KXsgdGhpcy5vbkxpdmVSZWRpcmVjdChyZXNwLmxpdmVfcmVkaXJlY3QpIH1cbiAgICAgICAgICAgIGlmKHJlZiAhPT0gbnVsbCl7IHRoaXMudW5kb1JlZnMocmVmKSB9XG4gICAgICAgICAgICBvbkxvYWRpbmdEb25lKClcbiAgICAgICAgICAgIG9uUmVwbHkocmVzcCwgaG9va1JlcGx5KVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihyZXNwLmRpZmYpe1xuICAgICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgcmVwbHksIGV2ZW50c30pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZShkaWZmLCBldmVudHMpXG4gICAgICAgICAgICAgICAgZmluaXNoKHJlcGx5KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluaXNoKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICB1bmRvUmVmcyhyZWYpe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gfSAvLyBleGl0IGlmIGV4dGVybmFsIGZvcm0gdHJpZ2dlcmVkXG5cbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLmlkfVwiXVske1BIWF9SRUZ9PVwiJHtyZWZ9XCJdYCwgZWwgPT4ge1xuICAgICAgbGV0IGRpc2FibGVkVmFsID0gZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRClcbiAgICAgIC8vIHJlbW92ZSByZWZzXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRilcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQylcbiAgICAgIC8vIHJlc3RvcmUgaW5wdXRzXG4gICAgICBpZihlbC5nZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKSAhPT0gbnVsbCl7XG4gICAgICAgIGVsLnJlYWRPbmx5ID0gZmFsc2VcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUFET05MWSlcbiAgICAgIH1cbiAgICAgIGlmKGRpc2FibGVkVmFsICE9PSBudWxsKXtcbiAgICAgICAgZWwuZGlzYWJsZWQgPSBkaXNhYmxlZFZhbCA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9ESVNBQkxFRClcbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBjbGFzc2VzXG4gICAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKGNsYXNzTmFtZSA9PiBET00ucmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSkpXG4gICAgICAvLyByZXN0b3JlIGRpc2FibGVzXG4gICAgICBsZXQgZGlzYWJsZVJlc3RvcmUgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgaWYoZGlzYWJsZVJlc3RvcmUgIT09IG51bGwpe1xuICAgICAgICBlbC5pbm5lclRleHQgPSBkaXNhYmxlUmVzdG9yZVxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgfVxuICAgICAgbGV0IHRvRWwgPSBET00ucHJpdmF0ZShlbCwgUEhYX1JFRilcbiAgICAgIGlmKHRvRWwpe1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZWwsIHRvRWwpXG4gICAgICAgIERPTVBhdGNoLnBhdGNoRWwoZWwsIHRvRWwsIHRoaXMubGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KCkpXG4gICAgICAgIGlmKGhvb2speyBob29rLl9fdXBkYXRlZCgpIH1cbiAgICAgICAgRE9NLmRlbGV0ZVByaXZhdGUoZWwsIFBIWF9SRUYpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHB1dFJlZihlbGVtZW50cywgZXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgbGV0IG5ld1JlZiA9IHRoaXMucmVmKytcbiAgICBsZXQgZGlzYWJsZVdpdGggPSB0aGlzLmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSClcbiAgICBpZihvcHRzLmxvYWRpbmcpeyBlbGVtZW50cyA9IGVsZW1lbnRzLmNvbmNhdChET00uYWxsKGRvY3VtZW50LCBvcHRzLmxvYWRpbmcpKX1cblxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnR9LWxvYWRpbmdgKVxuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUYsIG5ld1JlZilcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUkVGX1NSQywgdGhpcy5lbC5pZClcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aClcbiAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBudWxsKXtcbiAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpKXtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLCBlbC5pbm5lclRleHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZGlzYWJsZVRleHQgIT09IFwiXCIpeyBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dCB9XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gW25ld1JlZiwgZWxlbWVudHMsIG9wdHNdXG4gIH1cblxuICBjb21wb25lbnRJRChlbCl7XG4gICAgbGV0IGNpZCA9IGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVClcbiAgICByZXR1cm4gY2lkID8gcGFyc2VJbnQoY2lkKSA6IG51bGxcbiAgfVxuXG4gIHRhcmdldENvbXBvbmVudElEKHRhcmdldCwgdGFyZ2V0Q3R4LCBvcHRzID0ge30pe1xuICAgIGlmKGlzQ2lkKHRhcmdldEN0eCkpeyByZXR1cm4gdGFyZ2V0Q3R4IH1cblxuICAgIGxldCBjaWRPclNlbGVjdG9yID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJ0YXJnZXRcIikpXG4gICAgaWYoaXNDaWQoY2lkT3JTZWxlY3Rvcikpe1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGNpZE9yU2VsZWN0b3IpXG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCAmJiAoY2lkT3JTZWxlY3RvciAhPT0gbnVsbCB8fCBvcHRzLnRhcmdldCkpe1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBjbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXtcbiAgICAgIHJldHVybiB0YXJnZXRDdHhcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4KXtcbiAgICAgIHJldHVybiBtYXliZSh0YXJnZXRDdHguY2xvc2VzdChgWyR7UEhYX0NPTVBPTkVOVH1dYCksIGVsID0+IHRoaXMub3duc0VsZW1lbnQoZWwpICYmIHRoaXMuY29tcG9uZW50SUQoZWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHB1c2hIb29rRXZlbnQodGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7XG4gICAgICB0aGlzLmxvZyhcImhvb2tcIiwgKCkgPT4gW1widW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiLCBldmVudCwgcGF5bG9hZF0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IFtyZWYsIGVscywgb3B0c10gPSB0aGlzLnB1dFJlZihbXSwgXCJob29rXCIpXG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KCgpID0+IFtyZWYsIGVscywgb3B0c10sIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogXCJob29rXCIsXG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICB2YWx1ZTogcGF5bG9hZCxcbiAgICAgIGNpZDogdGhpcy5jbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KVxuICAgIH0sIChyZXNwLCByZXBseSkgPT4gb25SZXBseShyZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW2VsXSwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0pXG4gIH1cblxuICBwdXNoRmlsZVByb2dyZXNzKGZpbGVFbCwgZW50cnlSZWYsIHByb2dyZXNzLCBvblJlcGx5ID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIHRoaXMubGl2ZVNvY2tldC53aXRoaW5Pd25lcnMoZmlsZUVsLmZvcm0sICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcucHVzaFdpdGhSZXBseShudWxsLCBcInByb2dyZXNzXCIsIHtcbiAgICAgICAgZXZlbnQ6IGZpbGVFbC5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFBIWF9QUk9HUkVTUykpLFxuICAgICAgICByZWY6IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyeV9yZWY6IGVudHJ5UmVmLFxuICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3MsXG4gICAgICAgIGNpZDogdmlldy50YXJnZXRDb21wb25lbnRJRChmaWxlRWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfSwgb25SZXBseSlcbiAgICB9KVxuICB9XG5cbiAgcHVzaElucHV0KGlucHV0RWwsIHRhcmdldEN0eCwgZm9yY2VDaWQsIHBoeEV2ZW50LCBvcHRzLCBjYWxsYmFjayl7XG4gICAgbGV0IHVwbG9hZHNcbiAgICBsZXQgY2lkID0gaXNDaWQoZm9yY2VDaWQpID8gZm9yY2VDaWQgOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLnB1dFJlZihbaW5wdXRFbCwgaW5wdXRFbC5mb3JtXSwgXCJjaGFuZ2VcIiwgb3B0cylcbiAgICBsZXQgZm9ybURhdGFcbiAgICBpZihpbnB1dEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpKXtcbiAgICAgIGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShpbnB1dEVsLmZvcm0sIHtfdGFyZ2V0OiBvcHRzLl90YXJnZXR9LCBbaW5wdXRFbC5uYW1lXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwge190YXJnZXQ6IG9wdHMuX3RhcmdldH0pXG4gICAgfVxuICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIGlucHV0RWwuZmlsZXMgJiYgaW5wdXRFbC5maWxlcy5sZW5ndGggPiAwKXtcbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKGlucHV0RWwsIEFycmF5LmZyb20oaW5wdXRFbC5maWxlcykpXG4gICAgfVxuICAgIHVwbG9hZHMgPSBMaXZlVXBsb2FkZXIuc2VyaWFsaXplVXBsb2FkcyhpbnB1dEVsKVxuICAgIGxldCBldmVudCA9IHtcbiAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgdXBsb2FkczogdXBsb2FkcyxcbiAgICAgIGNpZDogY2lkXG4gICAgfVxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwgZXZlbnQsIHJlc3AgPT4ge1xuICAgICAgRE9NLnNob3dFcnJvcihpbnB1dEVsLCB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhQSFhfRkVFREJBQ0tfRk9SKSlcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIGlucHV0RWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtYXV0by11cGxvYWRcIikgIT09IG51bGwpe1xuICAgICAgICBpZihMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgICAgIHRoaXMudXBsb2FkRmlsZXMoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3ApXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBd2FpdGluZ1N1Ym1pdChpbnB1dEVsLmZvcm0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdHJpZ2dlckF3YWl0aW5nU3VibWl0KGZvcm1FbCl7XG4gICAgbGV0IGF3YWl0aW5nU3VibWl0ID0gdGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKVxuICAgIGlmKGF3YWl0aW5nU3VibWl0KXtcbiAgICAgIGxldCBbX2VsLCBfcmVmLCBfb3B0cywgY2FsbGJhY2tdID0gYXdhaXRpbmdTdWJtaXRcbiAgICAgIHRoaXMuY2FuY2VsU3VibWl0KGZvcm1FbClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBnZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKXtcbiAgICByZXR1cm4gdGhpcy5mb3JtU3VibWl0cy5maW5kKChbZWwsIF9yZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiBlbC5pc1NhbWVOb2RlKGZvcm1FbCkpXG4gIH1cblxuICBzY2hlZHVsZVN1Ym1pdChmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgdGhpcy5mb3JtU3VibWl0cy5wdXNoKFtmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2tdKVxuICB9XG5cbiAgY2FuY2VsU3VibWl0KGZvcm1FbCl7XG4gICAgdGhpcy5mb3JtU3VibWl0cyA9IHRoaXMuZm9ybVN1Ym1pdHMuZmlsdGVyKChbZWwsIHJlZiwgX2NhbGxiYWNrXSkgPT4ge1xuICAgICAgaWYoZWwuaXNTYW1lTm9kZShmb3JtRWwpKXtcbiAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGlzYWJsZUZvcm0oZm9ybUVsLCBvcHRzID0ge30pe1xuICAgIGxldCBmaWx0ZXJJZ25vcmVkID0gZWwgPT4ge1xuICAgICAgbGV0IHVzZXJJZ25vcmVkID0gY2xvc2VzdFBoeEJpbmRpbmcoZWwsIGAke3RoaXMuYmluZGluZyhQSFhfVVBEQVRFKX09aWdub3JlYCwgZWwuZm9ybSlcbiAgICAgIHJldHVybiAhKHVzZXJJZ25vcmVkIHx8IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBcImRhdGEtcGh4LXVwZGF0ZT1pZ25vcmVcIiwgZWwuZm9ybSkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJEaXNhYmxlcyA9IGVsID0+IHtcbiAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpKVxuICAgIH1cbiAgICBsZXQgZmlsdGVyQnV0dG9uID0gZWwgPT4gZWwudGFnTmFtZSA9PSBcIkJVVFRPTlwiXG5cbiAgICBsZXQgZmlsdGVySW5wdXQgPSBlbCA9PiBbXCJJTlBVVFwiLCBcIlRFWFRBUkVBXCIsIFwiU0VMRUNUXCJdLmluY2x1ZGVzKGVsLnRhZ05hbWUpXG5cbiAgICBsZXQgZm9ybUVsZW1lbnRzID0gQXJyYXkuZnJvbShmb3JtRWwuZWxlbWVudHMpXG4gICAgbGV0IGRpc2FibGVzID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJEaXNhYmxlcylcbiAgICBsZXQgYnV0dG9ucyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVyQnV0dG9uKS5maWx0ZXIoZmlsdGVySWdub3JlZClcbiAgICBsZXQgaW5wdXRzID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJJbnB1dCkuZmlsdGVyKGZpbHRlcklnbm9yZWQpXG5cbiAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVELCBidXR0b24uZGlzYWJsZWQpXG4gICAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlXG4gICAgfSlcbiAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZLCBpbnB1dC5yZWFkT25seSlcbiAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZVxuICAgICAgaWYoaW5wdXQuZmlsZXMpe1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVELCBpbnB1dC5kaXNhYmxlZClcbiAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICBmb3JtRWwuc2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfUEFHRV9MT0FESU5HKSwgXCJcIilcbiAgICByZXR1cm4gdGhpcy5wdXRSZWYoW2Zvcm1FbF0uY29uY2F0KGRpc2FibGVzKS5jb25jYXQoYnV0dG9ucykuY29uY2F0KGlucHV0cyksIFwic3VibWl0XCIsIG9wdHMpXG4gIH1cblxuICBwdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMsIG9uUmVwbHkpe1xuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLmRpc2FibGVGb3JtKGZvcm1FbCwgb3B0cylcbiAgICBsZXQgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChmb3JtRWwsIHRhcmdldEN0eClcbiAgICBpZihMaXZlVXBsb2FkZXIuaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKSl7XG4gICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHB1c2ggPSAoKSA9PiB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgb25SZXBseSlcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBwdXNoKVxuICAgIH0gZWxzZSBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBbcmVmLCBlbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwcm94eVJlZkdlbiA9ICgpID0+IFtyZWYsIGVscywgb3B0c11cbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHt9KVxuICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocHJveHlSZWZHZW4sIFwiZXZlbnRcIiwge1xuICAgICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgICAgY2lkOiBjaWRcbiAgICAgICAgfSwgb25SZXBseSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7fSlcbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwge1xuICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgIGNpZDogY2lkXG4gICAgICB9LCBvblJlcGx5KVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgb25Db21wbGV0ZSl7XG4gICAgbGV0IGpvaW5Db3VudEF0VXBsb2FkID0gdGhpcy5qb2luQ291bnRcbiAgICBsZXQgaW5wdXRFbHMgPSBMaXZlVXBsb2FkZXIuYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpXG4gICAgbGV0IG51bUZpbGVJbnB1dHNJblByb2dyZXNzID0gaW5wdXRFbHMubGVuZ3RoXG5cbiAgICAvLyBnZXQgZWFjaCBmaWxlIGlucHV0XG4gICAgaW5wdXRFbHMuZm9yRWFjaChpbnB1dEVsID0+IHtcbiAgICAgIGxldCB1cGxvYWRlciA9IG5ldyBMaXZlVXBsb2FkZXIoaW5wdXRFbCwgdGhpcywgKCkgPT4ge1xuICAgICAgICBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcy0tXG4gICAgICAgIGlmKG51bUZpbGVJbnB1dHNJblByb2dyZXNzID09PSAwKXsgb25Db21wbGV0ZSgpIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnVwbG9hZGVyc1tpbnB1dEVsXSA9IHVwbG9hZGVyXG4gICAgICBsZXQgZW50cmllcyA9IHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkudG9QcmVmbGlnaHRQYXlsb2FkKCkpXG5cbiAgICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgICByZWY6IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cmllczogZW50cmllcyxcbiAgICAgICAgY2lkOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbXCJzZW5kaW5nIHByZWZsaWdodCByZXF1ZXN0XCIsIHBheWxvYWRdKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJhbGxvd191cGxvYWRcIiwgcGF5bG9hZCwgcmVzcCA9PiB7XG4gICAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcImdvdCBwcmVmbGlnaHQgcmVzcG9uc2VcIiwgcmVzcF0pXG4gICAgICAgIGlmKHJlc3AuZXJyb3Ipe1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmKVxuICAgICAgICAgIGxldCBbZW50cnlfcmVmLCByZWFzb25dID0gcmVzcC5lcnJvclxuICAgICAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtgZXJyb3IgZm9yIGVudHJ5ICR7ZW50cnlfcmVmfWAsIHJlYXNvbl0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYodGhpcy5qb2luQ291bnQgPT09IGpvaW5Db3VudEF0VXBsb2FkKXsgY2FsbGJhY2soKSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGxvYWRlci5pbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCB0aGlzLmxpdmVTb2NrZXQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRpc3BhdGNoVXBsb2FkcyhuYW1lLCBmaWxlc09yQmxvYnMpe1xuICAgIGxldCBpbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyh0aGlzLmVsKS5maWx0ZXIoZWwgPT4gZWwubmFtZSA9PT0gbmFtZSlcbiAgICBpZihpbnB1dHMubGVuZ3RoID09PSAwKXsgbG9nRXJyb3IoYG5vIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSBpZihpbnB1dHMubGVuZ3RoID4gMSl7IGxvZ0Vycm9yKGBkdXBsaWNhdGUgbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApIH1cbiAgICBlbHNlIHsgRE9NLmRpc3BhdGNoRXZlbnQoaW5wdXRzWzBdLCBQSFhfVFJBQ0tfVVBMT0FEUywge2RldGFpbDoge2ZpbGVzOiBmaWxlc09yQmxvYnN9fSkgfVxuICB9XG5cbiAgcHVzaEZvcm1SZWNvdmVyeShmb3JtLCBuZXdDaWQsIGNhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZvcm0sICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIGxldCBpbnB1dCA9IGZvcm0uZWxlbWVudHNbMF1cbiAgICAgIGxldCBwaHhFdmVudCA9IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfQVVUT19SRUNPVkVSKSkgfHwgZm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKVxuXG4gICAgICBKUy5leGVjKFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogaW5wdXQubmFtZSwgbmV3Q2lkOiBuZXdDaWQsIGNhbGxiYWNrOiBjYWxsYmFja31dKVxuICAgIH0pXG4gIH1cblxuICBwdXNoTGlua1BhdGNoKGhyZWYsIHRhcmdldEVsLCBjYWxsYmFjayl7XG4gICAgbGV0IGxpbmtSZWYgPSB0aGlzLmxpdmVTb2NrZXQuc2V0UGVuZGluZ0xpbmsoaHJlZilcbiAgICBsZXQgcmVmR2VuID0gdGFyZ2V0RWwgPyAoKSA9PiB0aGlzLnB1dFJlZihbdGFyZ2V0RWxdLCBcImNsaWNrXCIpIDogbnVsbFxuICAgIGxldCBmYWxsYmFjayA9ICgpID0+IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh3aW5kb3cubG9jYXRpb24uaHJlZilcblxuICAgIGxldCBwdXNoID0gdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbiwgXCJsaXZlX3BhdGNoXCIsIHt1cmw6IGhyZWZ9LCByZXNwID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYocmVzcC5saW5rX3JlZGlyZWN0KXtcbiAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2ssIGxpbmtSZWYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYodGhpcy5saXZlU29ja2V0LmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXtcbiAgICAgICAgICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hcHBseVBlbmRpbmdVcGRhdGVzKClcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhsaW5rUmVmKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpZihwdXNoKXtcbiAgICAgIHB1c2gucmVjZWl2ZShcInRpbWVvdXRcIiwgZmFsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIGZhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBmb3Jtc0ZvclJlY292ZXJ5KGh0bWwpe1xuICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSAwKXsgcmV0dXJuIFtdIH1cblxuICAgIGxldCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG5cbiAgICByZXR1cm4gKFxuICAgICAgRE9NLmFsbCh0aGlzLmVsLCBgZm9ybVske3BoeENoYW5nZX1dYClcbiAgICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uaWQgJiYgdGhpcy5vd25zRWxlbWVudChmb3JtKSlcbiAgICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZWxlbWVudHMubGVuZ3RoID4gMClcbiAgICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfQVVUT19SRUNPVkVSKSkgIT09IFwiaWdub3JlXCIpXG4gICAgICAgIC5tYXAoZm9ybSA9PiB7XG4gICAgICAgICAgbGV0IG5ld0Zvcm0gPSB0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoYGZvcm1baWQ9XCIke2Zvcm0uaWR9XCJdWyR7cGh4Q2hhbmdlfT1cIiR7Zm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKX1cIl1gKVxuICAgICAgICAgIGlmKG5ld0Zvcm0pe1xuICAgICAgICAgICAgcmV0dXJuIFtmb3JtLCBuZXdGb3JtLCB0aGlzLnRhcmdldENvbXBvbmVudElEKG5ld0Zvcm0pXVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm0sIG51bGwsIG51bGxdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKChbZm9ybSwgbmV3Rm9ybSwgbmV3Q2lkXSkgPT4gbmV3Rm9ybSlcbiAgICApXG4gIH1cblxuICBtYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpe1xuICAgIGxldCB3aWxsRGVzdHJveUNJRHMgPSBkZXN0cm95ZWRDSURzLmZpbHRlcihjaWQgPT4ge1xuICAgICAgcmV0dXJuIERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgY2lkKS5sZW5ndGggPT09IDBcbiAgICB9KVxuICAgIGlmKHdpbGxEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgIHRoaXMucHJ1bmluZ0NJRHMucHVzaCguLi53aWxsRGVzdHJveUNJRHMpXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfd2lsbF9kZXN0cm95XCIsIHtjaWRzOiB3aWxsRGVzdHJveUNJRHN9LCAoKSA9PiB7XG4gICAgICAgIC8vIFRoZSBjaWRzIGFyZSBlaXRoZXIgYmFjayBvbiB0aGUgcGFnZSBvciB0aGV5IHdpbGwgYmUgZnVsbHkgcmVtb3ZlZCxcbiAgICAgICAgLy8gc28gd2UgY2FuIHJlbW92ZSB0aGVtIGZyb20gdGhlIHBydW5pbmdDSURzLlxuICAgICAgICB0aGlzLnBydW5pbmdDSURzID0gdGhpcy5wcnVuaW5nQ0lEcy5maWx0ZXIoY2lkID0+IHdpbGxEZXN0cm95Q0lEcy5pbmRleE9mKGNpZCkgIT09IC0xKVxuXG4gICAgICAgIC8vIFNlZSBpZiBhbnkgb2YgdGhlIGNpZHMgd2Ugd2FudGVkIHRvIGRlc3Ryb3kgd2VyZSBhZGRlZCBiYWNrLFxuICAgICAgICAvLyBpZiB0aGV5IHdlcmUgYWRkZWQgYmFjaywgd2UgZG9uJ3QgYWN0dWFsbHkgZGVzdHJveSB0aGVtLlxuICAgICAgICBsZXQgY29tcGxldGVseURlc3Ryb3lDSURzID0gd2lsbERlc3Ryb3lDSURzLmZpbHRlcihjaWQgPT4ge1xuICAgICAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoY29tcGxldGVseURlc3Ryb3lDSURzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfZGVzdHJveWVkXCIsIHtjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHN9LCAocmVzcCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZC5wcnVuZUNJRHMocmVzcC5jaWRzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgb3duc0VsZW1lbnQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzRGVhZCB8fCBlbC5nZXRBdHRyaWJ1dGUoUEhYX1BBUkVOVF9JRCkgPT09IHRoaXMuaWQgfHxcbiAgICAgIG1heWJlKGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpLCBub2RlID0+IG5vZGUuaWQpID09PSB0aGlzLmlkXG4gIH1cblxuICBzdWJtaXRGb3JtKGZvcm0sIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybSwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpXG4gICAgbGV0IHBoeEZlZWRiYWNrID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUilcbiAgICBsZXQgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKVxuICAgIHRoaXMubGl2ZVNvY2tldC5ibHVyQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIHRoaXMucHVzaEZvcm1TdWJtaXQoZm9ybSwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgKCkgPT4ge1xuICAgICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gRE9NLnNob3dFcnJvcihpbnB1dCwgcGh4RmVlZGJhY2spKVxuICAgICAgdGhpcy5saXZlU29ja2V0LnJlc3RvcmVQcmV2aW91c2x5QWN0aXZlRm9jdXMoKVxuICAgIH0pXG4gIH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoa2luZCkgfVxufVxuIiwgIi8qKiBJbml0aWFsaXplcyB0aGUgTGl2ZVNvY2tldFxuICpcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZW5kUG9pbnQgLSBUaGUgc3RyaW5nIFdlYlNvY2tldCBlbmRwb2ludCwgaWUsIGBcIndzczovL2V4YW1wbGUuY29tL2xpdmVcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwiL2xpdmVcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge1Bob2VuaXguU29ja2V0fSBzb2NrZXQgLSB0aGUgcmVxdWlyZWQgUGhvZW5peCBTb2NrZXQgY2xhc3MgaW1wb3J0ZWQgZnJvbSBcInBob2VuaXhcIi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIGltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG4gKiAgICAgaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuICogICAgIGxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHsuLi59KVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c10gLSBPcHRpb25hbCBjb25maWd1cmF0aW9uLiBPdXRzaWRlIG9mIGtleXMgbGlzdGVkIGJlbG93LCBhbGxcbiAqIGNvbmZpZ3VyYXRpb24gaXMgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBQaG9lbml4IFNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5kZWZhdWx0c10gLSBUaGUgb3B0aW9uYWwgZGVmYXVsdHMgdG8gdXNlIGZvciB2YXJpb3VzIGJpbmRpbmdzLFxuICogc3VjaCBhcyBgcGh4LWRlYm91bmNlYC4gU3VwcG9ydHMgdGhlIGZvbGxvd2luZyBrZXlzOlxuICpcbiAqICAgLSBkZWJvdW5jZSAtIHRoZSBtaWxsaXNlY29uZCBwaHgtZGVib3VuY2UgdGltZS4gRGVmYXVsdHMgMzAwXG4gKiAgIC0gdGhyb3R0bGUgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LXRocm90dGxlIHRpbWUuIERlZmF1bHRzIDMwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnBhcmFtc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHBhc3NpbmcgY29ubmVjdCBwYXJhbXMuXG4gKiBUaGUgZnVuY3Rpb24gcmVjZWl2ZXMgdGhlIGVsZW1lbnQgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gTGl2ZVZpZXcuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICAoZWwpID0+IHt2aWV3OiBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW15LXZpZXctbmFtZVwiLCB0b2tlbjogd2luZG93Lm15VG9rZW59XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmRpbmdQcmVmaXhdIC0gVGhlIG9wdGlvbmFsIHByZWZpeCB0byB1c2UgZm9yIGFsbCBwaHggRE9NIGFubm90YXRpb25zLlxuICogRGVmYXVsdHMgdG8gXCJwaHgtXCIuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuaG9va3NdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBmb3IgcmVmZXJlbmNpbmcgTGl2ZVZpZXcgaG9vayBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMudXBsb2FkZXJzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IHVwbG9hZGVyIGNhbGxiYWNrcy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubG9hZGVyVGltZW91dF0gLSBUaGUgb3B0aW9uYWwgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGFwcGx5XG4gKiBsb2FkaW5nIHN0YXRlcy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubWF4UmVsb2Fkc10gLSBUaGUgbWF4aW11bSByZWxvYWRzIGJlZm9yZSBlbnRlcmluZyBmYWlsc2FmZSBtb2RlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNaW5dIC0gVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLnJlbG9hZEppdHRlck1heF0gLSBUaGUgbWF4aW11bSB0aW1lIGJldHdlZW4gbm9ybWFsIHJlbG9hZCBhdHRlbXB0cy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMuZmFpbHNhZmVKaXR0ZXJdIC0gVGhlIHRpbWUgYmV0d2VlbiByZWxvYWQgYXR0ZW1wdHMgaW4gZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZpZXdMb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4gY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5tZXRhZGF0YV0gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IG1hcHBpbmcgZXZlbnQgbmFtZXMgdG8gZnVuY3Rpb25zIGZvclxuICogcG9wdWxhdGluZyBldmVudCBtZXRhZGF0YS4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIG1ldGFkYXRhOiB7XG4gKiAgICAgICBjbGljazogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBkZXRhaWw6IGUuZGV0YWlsIHx8IDEsXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBrZXlkb3duOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBrZXk6IGUua2V5LFxuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgc2hpZnRLZXk6IGUuc2hpZnRLZXlcbiAqICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgIH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiAgRm9yIGV4YW1wbGUsIFRoaXMgY291bGRcbiAqIGhhcHBlbiBpZiBhIHNpdGUgbG9hZHMgYSBjcm9zcy1kb21haW4gTGl2ZVZpZXcgaW4gYW4gaWZyYW1lLiAgRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB8fCBudWxsIH1cbiAqICAgICAgIHJlbW92ZUl0ZW0oa2V5TmFtZSkgeyBkZWxldGUgdGhpcy5zdG9yYWdlW2tleU5hbWVdIH1cbiAqICAgICAgIHNldEl0ZW0oa2V5TmFtZSwga2V5VmFsdWUpIHsgdGhpcy5zdG9yYWdlW2tleU5hbWVdID0ga2V5VmFsdWUgfVxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubG9jYWxTdG9yYWdlXSAtIEFuIG9wdGlvbmFsIFN0b3JhZ2UgY29tcGF0aWJsZSBvYmplY3RcbiAqIFVzZWZ1bCBmb3Igd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgbG9jYWxTdG9yYWdlYC5cbiAqIFNlZSBgb3B0cy5zZXNzaW9uU3RvcmFnZWAgZm9yIGV4YW1wbGVzLlxuKi9cblxuaW1wb3J0IHtcbiAgQklORElOR19QUkVGSVgsXG4gIENPTlNFQ1VUSVZFX1JFTE9BRFMsXG4gIERFRkFVTFRTLFxuICBGQUlMU0FGRV9KSVRURVIsXG4gIExPQURFUl9USU1FT1VULFxuICBNQVhfUkVMT0FEUyxcbiAgUEhYX0RFQk9VTkNFLFxuICBQSFhfRFJPUF9UQVJHRVQsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0tFWSxcbiAgUEhYX0xJTktfU1RBVEUsXG4gIFBIWF9MSVZFX0xJTkssXG4gIFBIWF9MVl9ERUJVRyxcbiAgUEhYX0xWX0xBVEVOQ1lfU0lNLFxuICBQSFhfTFZfUFJPRklMRSxcbiAgUEhYX01BSU4sXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9WSUVXX1NFTEVDVE9SLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1RIUk9UVExFLFxuICBQSFhfVFJBQ0tfVVBMT0FEUyxcbiAgUEhYX1NFU1NJT04sXG4gIFJFTE9BRF9KSVRURVJfTUlOLFxuICBSRUxPQURfSklUVEVSX01BWCxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBjbG9zdXJlLFxuICBkZWJ1ZyxcbiAgaXNPYmplY3QsXG4gIG1heWJlXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IEJyb3dzZXIgZnJvbSBcIi4vYnJvd3NlclwiXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgSG9va3MgZnJvbSBcIi4vaG9va3NcIlxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcbmltcG9ydCBWaWV3IGZyb20gXCIuL3ZpZXdcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGl2ZVNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKHVybCwgcGh4U29ja2V0LCBvcHRzID0ge30pe1xuICAgIHRoaXMudW5sb2FkZWQgPSBmYWxzZVxuICAgIGlmKCFwaHhTb2NrZXQgfHwgcGh4U29ja2V0LmNvbnN0cnVjdG9yLm5hbWUgPT09IFwiT2JqZWN0XCIpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgIGEgcGhvZW5peCBTb2NrZXQgbXVzdCBiZSBwcm92aWRlZCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHRvIHRoZSBMaXZlU29ja2V0IGNvbnN0cnVjdG9yLiBGb3IgZXhhbXBsZTpcblxuICAgICAgICAgIGltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG4gICAgICAgICAgaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuICAgICAgICAgIGxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHsuLi59KVxuICAgICAgYClcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQgPSBuZXcgcGh4U29ja2V0KHVybCwgb3B0cylcbiAgICB0aGlzLmJpbmRpbmdQcmVmaXggPSBvcHRzLmJpbmRpbmdQcmVmaXggfHwgQklORElOR19QUkVGSVhcbiAgICB0aGlzLm9wdHMgPSBvcHRzXG4gICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKG9wdHMucGFyYW1zIHx8IHt9KVxuICAgIHRoaXMudmlld0xvZ2dlciA9IG9wdHMudmlld0xvZ2dlclxuICAgIHRoaXMubWV0YWRhdGFDYWxsYmFja3MgPSBvcHRzLm1ldGFkYXRhIHx8IHt9XG4gICAgdGhpcy5kZWZhdWx0cyA9IE9iamVjdC5hc3NpZ24oY2xvbmUoREVGQVVMVFMpLCBvcHRzLmRlZmF1bHRzIHx8IHt9KVxuICAgIHRoaXMuYWN0aXZlRWxlbWVudCA9IG51bGxcbiAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgdGhpcy5zaWxlbmNlZCA9IGZhbHNlXG4gICAgdGhpcy5tYWluID0gbnVsbFxuICAgIHRoaXMub3V0Z29pbmdNYWluRWwgPSBudWxsXG4gICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICB0aGlzLmxpbmtSZWYgPSAxXG4gICAgdGhpcy5yb290cyA9IHt9XG4gICAgdGhpcy5ocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICB0aGlzLnBlbmRpbmdMaW5rID0gbnVsbFxuICAgIHRoaXMuY3VycmVudExvY2F0aW9uID0gY2xvbmUod2luZG93LmxvY2F0aW9uKVxuICAgIHRoaXMuaG9va3MgPSBvcHRzLmhvb2tzIHx8IHt9XG4gICAgdGhpcy51cGxvYWRlcnMgPSBvcHRzLnVwbG9hZGVycyB8fCB7fVxuICAgIHRoaXMubG9hZGVyVGltZW91dCA9IG9wdHMubG9hZGVyVGltZW91dCB8fCBMT0FERVJfVElNRU9VVFxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gbnVsbFxuICAgIHRoaXMubWF4UmVsb2FkcyA9IG9wdHMubWF4UmVsb2FkcyB8fCBNQVhfUkVMT0FEU1xuICAgIHRoaXMucmVsb2FkSml0dGVyTWluID0gb3B0cy5yZWxvYWRKaXR0ZXJNaW4gfHwgUkVMT0FEX0pJVFRFUl9NSU5cbiAgICB0aGlzLnJlbG9hZEppdHRlck1heCA9IG9wdHMucmVsb2FkSml0dGVyTWF4IHx8IFJFTE9BRF9KSVRURVJfTUFYXG4gICAgdGhpcy5mYWlsc2FmZUppdHRlciA9IG9wdHMuZmFpbHNhZmVKaXR0ZXIgfHwgRkFJTFNBRkVfSklUVEVSXG4gICAgdGhpcy5sb2NhbFN0b3JhZ2UgPSBvcHRzLmxvY2FsU3RvcmFnZSB8fCB3aW5kb3cubG9jYWxTdG9yYWdlXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZSA9IG9wdHMuc2Vzc2lvblN0b3JhZ2UgfHwgd2luZG93LnNlc3Npb25TdG9yYWdlXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gZmFsc2VcbiAgICB0aGlzLmRvbUNhbGxiYWNrcyA9IE9iamVjdC5hc3NpZ24oe29uTm9kZUFkZGVkOiBjbG9zdXJlKCksIG9uQmVmb3JlRWxVcGRhdGVkOiBjbG9zdXJlKCl9LCBvcHRzLmRvbSB8fCB7fSlcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFRyYW5zaXRpb25TZXQoKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgX2UgPT4ge1xuICAgICAgdGhpcy51bmxvYWRlZCA9IHRydWVcbiAgICB9KVxuICAgIHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICBpZih0aGlzLmlzVW5sb2FkZWQoKSl7XG4gICAgICAgIC8vIHJlbG9hZCBwYWdlIGlmIGJlaW5nIHJlc3RvcmVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlIGFuZCBicm93c2VyIGRvZXMgbm90IGVtaXQgXCJwYWdlc2hvd1wiXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBwdWJsaWNcblxuICBpc1Byb2ZpbGVFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX1BST0ZJTEUpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0VuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcInRydWVcIiB9XG5cbiAgaXNEZWJ1Z0Rpc2FibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJmYWxzZVwiIH1cblxuICBlbmFibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcInRydWVcIikgfVxuXG4gIGVuYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX1BST0ZJTEUsIFwidHJ1ZVwiKSB9XG5cbiAgZGlzYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwiZmFsc2VcIikgfVxuXG4gIGRpc2FibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9QUk9GSUxFKSB9XG5cbiAgZW5hYmxlTGF0ZW5jeVNpbSh1cHBlckJvdW5kTXMpe1xuICAgIHRoaXMuZW5hYmxlRGVidWcoKVxuICAgIGNvbnNvbGUubG9nKFwibGF0ZW5jeSBzaW11bGF0b3IgZW5hYmxlZCBmb3IgdGhlIGR1cmF0aW9uIG9mIHRoaXMgYnJvd3NlciBzZXNzaW9uLiBDYWxsIGRpc2FibGVMYXRlbmN5U2ltKCkgdG8gZGlzYWJsZVwiKVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0sIHVwcGVyQm91bmRNcylcbiAgfVxuXG4gIGRpc2FibGVMYXRlbmN5U2ltKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfTEFURU5DWV9TSU0pIH1cblxuICBnZXRMYXRlbmN5U2ltKCl7XG4gICAgbGV0IHN0ciA9IHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfTEFURU5DWV9TSU0pXG4gICAgcmV0dXJuIHN0ciA/IHBhcnNlSW50KHN0cikgOiBudWxsXG4gIH1cblxuICBnZXRTb2NrZXQoKXsgcmV0dXJuIHRoaXMuc29ja2V0IH1cblxuICBjb25uZWN0KCl7XG4gICAgLy8gZW5hYmxlIGRlYnVnIGJ5IGRlZmF1bHQgaWYgb24gbG9jYWxob3N0IGFuZCBub3QgZXhwbGljaXRseSBkaXNhYmxlZFxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSA9PT0gXCJsb2NhbGhvc3RcIiAmJiAhdGhpcy5pc0RlYnVnRGlzYWJsZWQoKSl7IHRoaXMuZW5hYmxlRGVidWcoKSB9XG4gICAgbGV0IGRvQ29ubmVjdCA9ICgpID0+IHtcbiAgICAgIGlmKHRoaXMuam9pblJvb3RWaWV3cygpKXtcbiAgICAgICAgdGhpcy5iaW5kVG9wTGV2ZWxFdmVudHMoKVxuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KClcbiAgICAgIH0gZWxzZSBpZih0aGlzLm1haW4pe1xuICAgICAgICB0aGlzLnNvY2tldC5jb25uZWN0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuam9pbkRlYWRWaWV3KClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoW1wiY29tcGxldGVcIiwgXCJsb2FkZWRcIiwgXCJpbnRlcmFjdGl2ZVwiXS5pbmRleE9mKGRvY3VtZW50LnJlYWR5U3RhdGUpID49IDApe1xuICAgICAgZG9Db25uZWN0KClcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4gZG9Db25uZWN0KCkpXG4gICAgfVxuICB9XG5cbiAgZGlzY29ubmVjdChjYWxsYmFjayl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuc29ja2V0LmRpc2Nvbm5lY3QoY2FsbGJhY2spXG4gIH1cblxuICByZXBsYWNlVHJhbnNwb3J0KHRyYW5zcG9ydCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuc29ja2V0LnJlcGxhY2VUcmFuc3BvcnQodHJhbnNwb3J0KVxuICAgIHRoaXMuY29ubmVjdCgpXG4gIH1cblxuICBleGVjSlMoZWwsIGVuY29kZWRKUywgZXZlbnRUeXBlID0gbnVsbCl7XG4gICAgdGhpcy5vd25lcihlbCwgdmlldyA9PiBKUy5leGVjKGV2ZW50VHlwZSwgZW5jb2RlZEpTLCB2aWV3LCBlbCkpXG4gIH1cblxuICAvLyBwcml2YXRlXG5cbiAgdHJpZ2dlckRPTShraW5kLCBhcmdzKXsgdGhpcy5kb21DYWxsYmFja3Nba2luZF0oLi4uYXJncykgfVxuXG4gIHRpbWUobmFtZSwgZnVuYyl7XG4gICAgaWYoIXRoaXMuaXNQcm9maWxlRW5hYmxlZCgpIHx8ICFjb25zb2xlLnRpbWUpeyByZXR1cm4gZnVuYygpIH1cbiAgICBjb25zb2xlLnRpbWUobmFtZSlcbiAgICBsZXQgcmVzdWx0ID0gZnVuYygpXG4gICAgY29uc29sZS50aW1lRW5kKG5hbWUpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgbG9nKHZpZXcsIGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICBpZih0aGlzLnZpZXdMb2dnZXIpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICB0aGlzLnZpZXdMb2dnZXIodmlldywga2luZCwgbXNnLCBvYmopXG4gICAgfSBlbHNlIGlmKHRoaXMuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgICBsZXQgW21zZywgb2JqXSA9IG1zZ0NhbGxiYWNrKClcbiAgICAgIGRlYnVnKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH1cbiAgfVxuXG4gIHJlcXVlc3RET01VcGRhdGUoY2FsbGJhY2spe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWZ0ZXIoY2FsbGJhY2spXG4gIH1cblxuICB0cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSA9IGZ1bmN0aW9uKCl7fSl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZGRUcmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIG9uQ2hhbm5lbChjaGFubmVsLCBldmVudCwgY2Ipe1xuICAgIGNoYW5uZWwub24oZXZlbnQsIGRhdGEgPT4ge1xuICAgICAgbGV0IGxhdGVuY3kgPSB0aGlzLmdldExhdGVuY3lTaW0oKVxuICAgICAgaWYoIWxhdGVuY3kpe1xuICAgICAgICBjYihkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBjYihkYXRhKSwgbGF0ZW5jeSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgd3JhcFB1c2godmlldywgb3B0cywgcHVzaCl7XG4gICAgbGV0IGxhdGVuY3kgPSB0aGlzLmdldExhdGVuY3lTaW0oKVxuICAgIGxldCBvbGRKb2luQ291bnQgPSB2aWV3LmpvaW5Db3VudFxuICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgIGlmKHRoaXMuaXNDb25uZWN0ZWQoKSAmJiBvcHRzLnRpbWVvdXQpe1xuICAgICAgICByZXR1cm4gcHVzaCgpLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgICAgICBpZih2aWV3LmpvaW5Db3VudCA9PT0gb2xkSm9pbkNvdW50ICYmICF2aWV3LmlzRGVzdHJveWVkKCkpe1xuICAgICAgICAgICAgdGhpcy5yZWxvYWRXaXRoSml0dGVyKHZpZXcsICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5sb2codmlldywgXCJ0aW1lb3V0XCIsICgpID0+IFtcInJlY2VpdmVkIHRpbWVvdXQgd2hpbGUgY29tbXVuaWNhdGluZyB3aXRoIHNlcnZlci4gRmFsbGluZyBiYWNrIHRvIGhhcmQgcmVmcmVzaCBmb3IgcmVjb3ZlcnlcIl0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwdXNoKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZmFrZVB1c2ggPSB7XG4gICAgICByZWNlaXZlczogW10sXG4gICAgICByZWNlaXZlKGtpbmQsIGNiKXsgdGhpcy5yZWNlaXZlcy5wdXNoKFtraW5kLCBjYl0pIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZih2aWV3LmlzRGVzdHJveWVkKCkpeyByZXR1cm4gfVxuICAgICAgZmFrZVB1c2gucmVjZWl2ZXMucmVkdWNlKChhY2MsIFtraW5kLCBjYl0pID0+IGFjYy5yZWNlaXZlKGtpbmQsIGNiKSwgcHVzaCgpKVxuICAgIH0sIGxhdGVuY3kpXG4gICAgcmV0dXJuIGZha2VQdXNoXG4gIH1cblxuICByZWxvYWRXaXRoSml0dGVyKHZpZXcsIGxvZyl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgbGV0IG1pbk1zID0gdGhpcy5yZWxvYWRKaXR0ZXJNaW5cbiAgICBsZXQgbWF4TXMgPSB0aGlzLnJlbG9hZEppdHRlck1heFxuICAgIGxldCBhZnRlck1zID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heE1zIC0gbWluTXMgKyAxKSkgKyBtaW5Nc1xuICAgIGxldCB0cmllcyA9IEJyb3dzZXIudXBkYXRlTG9jYWwodGhpcy5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUywgMCwgY291bnQgPT4gY291bnQgKyAxKVxuICAgIGlmKHRyaWVzID4gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBpZiB2aWV3IGhhcyByZWNvdmVyZWQsIHN1Y2ggYXMgdHJhbnNwb3J0IHJlcGxhY2VkLCB0aGVuIGNhbmNlbFxuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpIHx8IHZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICB2aWV3LmRlc3Ryb3koKVxuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgICBpZih0cmllcyA+IHRoaXMubWF4UmVsb2Fkcyl7XG4gICAgICAgIHRoaXMubG9nKHZpZXcsIFwiam9pblwiLCAoKSA9PiBbYGV4Y2VlZGVkICR7dGhpcy5tYXhSZWxvYWRzfSBjb25zZWN1dGl2ZSByZWxvYWRzLiBFbnRlcmluZyBmYWlsc2FmZSBtb2RlYF0pXG4gICAgICB9XG4gICAgICBpZih0aGlzLmhhc1BlbmRpbmdMaW5rKCkpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9LCBhZnRlck1zKVxuICB9XG5cbiAgZ2V0SG9va0NhbGxiYWNrcyhuYW1lKXtcbiAgICByZXR1cm4gbmFtZSAmJiBuYW1lLnN0YXJ0c1dpdGgoXCJQaG9lbml4LlwiKSA/IEhvb2tzW25hbWUuc3BsaXQoXCIuXCIpWzFdXSA6IHRoaXMuaG9va3NbbmFtZV1cbiAgfVxuXG4gIGlzVW5sb2FkZWQoKXsgcmV0dXJuIHRoaXMudW5sb2FkZWQgfVxuXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpIH1cblxuICBnZXRCaW5kaW5nUHJlZml4KCl7IHJldHVybiB0aGlzLmJpbmRpbmdQcmVmaXggfVxuXG4gIGJpbmRpbmcoa2luZCl7IHJldHVybiBgJHt0aGlzLmdldEJpbmRpbmdQcmVmaXgoKX0ke2tpbmR9YCB9XG5cbiAgY2hhbm5lbCh0b3BpYywgcGFyYW1zKXsgcmV0dXJuIHRoaXMuc29ja2V0LmNoYW5uZWwodG9waWMsIHBhcmFtcykgfVxuXG4gIGpvaW5EZWFkVmlldygpe1xuICAgIHRoaXMuYmluZFRvcExldmVsRXZlbnRzKHtkZWFkOiB0cnVlfSlcbiAgICBsZXQgdmlldyA9IHRoaXMubmV3Um9vdFZpZXcoZG9jdW1lbnQuYm9keSlcbiAgICB2aWV3LnNldEhyZWYodGhpcy5nZXRIcmVmKCkpXG4gICAgdmlldy5qb2luRGVhZCgpXG4gICAgdGhpcy5tYWluID0gdmlld1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdmlldy5leGVjTmV3TW91bnRlZCgpKVxuICB9XG5cbiAgam9pblJvb3RWaWV3cygpe1xuICAgIGxldCByb290c0ZvdW5kID0gZmFsc2VcbiAgICBET00uYWxsKGRvY3VtZW50LCBgJHtQSFhfVklFV19TRUxFQ1RPUn06bm90KFske1BIWF9QQVJFTlRfSUR9XSlgLCByb290RWwgPT4ge1xuICAgICAgaWYoIXRoaXMuZ2V0Um9vdEJ5SWQocm9vdEVsLmlkKSl7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy5uZXdSb290Vmlldyhyb290RWwpXG4gICAgICAgIHZpZXcuc2V0SHJlZih0aGlzLmdldEhyZWYoKSlcbiAgICAgICAgdmlldy5qb2luKClcbiAgICAgICAgaWYocm9vdEVsLmdldEF0dHJpYnV0ZShQSFhfTUFJTikpeyB0aGlzLm1haW4gPSB2aWV3IH1cbiAgICAgIH1cbiAgICAgIHJvb3RzRm91bmQgPSB0cnVlXG4gICAgfSlcbiAgICByZXR1cm4gcm9vdHNGb3VuZFxuICB9XG5cbiAgcmVkaXJlY3QodG8sIGZsYXNoKXtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgIEJyb3dzZXIucmVkaXJlY3QodG8sIGZsYXNoKVxuICB9XG5cbiAgcmVwbGFjZU1haW4oaHJlZiwgZmxhc2gsIGNhbGxiYWNrID0gbnVsbCwgbGlua1JlZiA9IHRoaXMuc2V0UGVuZGluZ0xpbmsoaHJlZikpe1xuICAgIGxldCBsaXZlUmVmZXJlciA9IHRoaXMuY3VycmVudExvY2F0aW9uLmhyZWZcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWxcbiAgICBsZXQgbmV3TWFpbkVsID0gRE9NLmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gsIGxpdmVSZWZlcmVyKVxuICAgIHRoaXMubWFpbi5zZXRSZWRpcmVjdChocmVmKVxuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMoKVxuICAgIHRoaXMubWFpbi5qb2luKChqb2luQ291bnQsIG9uRG9uZSkgPT4ge1xuICAgICAgaWYoam9pbkNvdW50ID09PSAxICYmIHRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIERPTS5maW5kUGh4U3RpY2t5KGRvY3VtZW50KS5mb3JFYWNoKGVsID0+IG5ld01haW5FbC5hcHBlbmRDaGlsZChlbCkpXG4gICAgICAgICAgdGhpcy5vdXRnb2luZ01haW5FbC5yZXBsYWNlV2l0aChuZXdNYWluRWwpXG4gICAgICAgICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IG51bGxcbiAgICAgICAgICBjYWxsYmFjayAmJiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spXG4gICAgICAgICAgb25Eb25lKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdHJhbnNpdGlvblJlbW92ZXMoZWxlbWVudHMpe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgZWxlbWVudHMgPSBlbGVtZW50cyB8fCBET00uYWxsKGRvY3VtZW50LCBgWyR7cmVtb3ZlQXR0cn1dYClcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmKGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpKXsgLy8gc2tpcCBjaGlsZHJlbiBhbHJlYWR5IHJlbW92ZWRcbiAgICAgICAgdGhpcy5leGVjSlMoZWwsIGVsLmdldEF0dHJpYnV0ZShyZW1vdmVBdHRyKSwgXCJyZW1vdmVcIilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gsIGxpdmVSZWZlcmVyKXtcbiAgICBsZXQgdmlldyA9IG5ldyBWaWV3KGVsLCB0aGlzLCBudWxsLCBmbGFzaCwgbGl2ZVJlZmVyZXIpXG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXdcbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIGxldCB2aWV3ID0gbWF5YmUoY2hpbGRFbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKSwgZWwgPT4gdGhpcy5nZXRWaWV3QnlFbChlbCkpIHx8IHRoaXMubWFpblxuICAgIGlmKHZpZXcpeyBjYWxsYmFjayh2aWV3KSB9XG4gIH1cblxuICB3aXRoaW5Pd25lcnMoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIHRoaXMub3duZXIoY2hpbGRFbCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCBjaGlsZEVsKSlcbiAgfVxuXG4gIGdldFZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdElkID0gZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKVxuICAgIHJldHVybiBtYXliZSh0aGlzLmdldFJvb3RCeUlkKHJvb3RJZCksIHJvb3QgPT4gcm9vdC5nZXREZXNjZW5kZW50QnlFbChlbCkpXG4gIH1cblxuICBnZXRSb290QnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3RzW2lkXSB9XG5cbiAgZGVzdHJveUFsbFZpZXdzKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnJvb3RzKXtcbiAgICAgIHRoaXMucm9vdHNbaWRdLmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbaWRdXG4gICAgfVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgfVxuXG4gIGRlc3Ryb3lWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3QgPSB0aGlzLmdldFJvb3RCeUlkKGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCkpXG4gICAgaWYocm9vdCAmJiByb290LmlkID09PSBlbC5pZCl7XG4gICAgICByb290LmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbcm9vdC5pZF1cbiAgICB9IGVsc2UgaWYocm9vdCl7XG4gICAgICByb290LmRlc3Ryb3lEZXNjZW5kZW50KGVsLmlkKVxuICAgIH1cbiAgfVxuXG4gIHNldEFjdGl2ZUVsZW1lbnQodGFyZ2V0KXtcbiAgICBpZih0aGlzLmFjdGl2ZUVsZW1lbnQgPT09IHRhcmdldCl7IHJldHVybiB9XG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gdGFyZ2V0XG4gICAgbGV0IGNhbmNlbCA9ICgpID0+IHtcbiAgICAgIGlmKHRhcmdldCA9PT0gdGhpcy5hY3RpdmVFbGVtZW50KXsgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbCB9XG4gICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcylcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcylcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGNhbmNlbClcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGNhbmNlbClcbiAgfVxuXG4gIGdldEFjdGl2ZUVsZW1lbnQoKXtcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KXtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUVsZW1lbnQgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5XG4gICAgfVxuICB9XG5cbiAgZHJvcEFjdGl2ZUVsZW1lbnQodmlldyl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHZpZXcub3duc0VsZW1lbnQodGhpcy5wcmV2QWN0aXZlKSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpe1xuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAmJiB0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpe1xuICAgICAgdGhpcy5wcmV2QWN0aXZlLmZvY3VzKClcbiAgICB9XG4gIH1cblxuICBibHVyQWN0aXZlRWxlbWVudCgpe1xuICAgIHRoaXMucHJldkFjdGl2ZSA9IHRoaXMuZ2V0QWN0aXZlRWxlbWVudCgpXG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KXsgdGhpcy5wcmV2QWN0aXZlLmJsdXIoKSB9XG4gIH1cblxuICBiaW5kVG9wTGV2ZWxFdmVudHMoe2RlYWR9ID0ge30pe1xuICAgIGlmKHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyl7IHJldHVybiB9XG5cbiAgICB0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMgPSB0cnVlXG4gICAgLy8gZW50ZXIgZmFpbHNhZmUgcmVsb2FkIGlmIHNlcnZlciBoYXMgZ29uZSBhd2F5IGludGVudGlvbmFsbHksIHN1Y2ggYXMgXCJkaXNjb25uZWN0XCIgYnJvYWRjYXN0XG4gICAgdGhpcy5zb2NrZXQub25DbG9zZShldmVudCA9PiB7XG4gICAgICBpZihldmVudCAmJiBldmVudC5jb2RlID09PSAxMDAwICYmIHRoaXMubWFpbil7XG4gICAgICAgIHRoaXMucmVsb2FkV2l0aEppdHRlcih0aGlzLm1haW4pXG4gICAgICB9XG4gICAgfSlcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKXsgfSkgLy8gZW5zdXJlIGFsbCBjbGljayBldmVudHMgYnViYmxlIGZvciBtb2JpbGUgU2FmYXJpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBlID0+IHtcbiAgICAgIGlmKGUucGVyc2lzdGVkKXsgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGVcbiAgICAgICAgdGhpcy5nZXRTb2NrZXQoKS5kaXNjb25uZWN0KClcbiAgICAgICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiB3aW5kb3cubG9jYXRpb24uaHJlZiwga2luZDogXCJyZWRpcmVjdFwifSlcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgdHJ1ZSlcbiAgICBpZighZGVhZCl7IHRoaXMuYmluZE5hdigpIH1cbiAgICB0aGlzLmJpbmRDbGlja3MoKVxuICAgIGlmKCFkZWFkKXsgdGhpcy5iaW5kRm9ybXMoKSB9XG4gICAgdGhpcy5iaW5kKHtrZXl1cDogXCJrZXl1cFwiLCBrZXlkb3duOiBcImtleWRvd25cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIGV2ZW50VGFyZ2V0KSA9PiB7XG4gICAgICBsZXQgbWF0Y2hLZXkgPSB0YXJnZXRFbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9LRVkpKVxuICAgICAgbGV0IHByZXNzZWRLZXkgPSBlLmtleSAmJiBlLmtleS50b0xvd2VyQ2FzZSgpIC8vIGNocm9tZSBjbGlja2VkIGF1dG9jb21wbGV0ZXMgc2VuZCBhIGtleWRvd24gd2l0aG91dCBrZXlcbiAgICAgIGlmKG1hdGNoS2V5ICYmIG1hdGNoS2V5LnRvTG93ZXJDYXNlKCkgIT09IHByZXNzZWRLZXkpeyByZXR1cm4gfVxuXG4gICAgICBsZXQgZGF0YSA9IHtrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCl9XG4gICAgICBKUy5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgIH0pXG4gICAgdGhpcy5iaW5kKHtibHVyOiBcImZvY3Vzb3V0XCIsIGZvY3VzOiBcImZvY3VzaW5cIn0sIChlLCB0eXBlLCB2aWV3LCB0YXJnZXRFbCwgcGh4RXZlbnQsIGV2ZW50VGFyZ2V0KSA9PiB7XG4gICAgICBpZighZXZlbnRUYXJnZXQpe1xuICAgICAgICBsZXQgZGF0YSA9IHtrZXk6IGUua2V5LCAuLi50aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbCl9XG4gICAgICAgIEpTLmV4ZWModHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiYmx1clwiLCBmb2N1czogXCJmb2N1c1wifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBwaHhUYXJnZXQpID0+IHtcbiAgICAgIC8vIGJsdXIgYW5kIGZvY3VzIGFyZSB0cmlnZ2VyZWQgb24gZG9jdW1lbnQgYW5kIHdpbmRvdy4gRGlzY2FyZCBvbmUgdG8gYXZvaWQgZHVwc1xuICAgICAgaWYocGh4VGFyZ2V0ID09PSBcIndpbmRvd1wiKXtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmV2ZW50TWV0YSh0eXBlLCBlLCB0YXJnZXRFbClcbiAgICAgICAgSlMuZXhlYyh0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZSA9PiBlLnByZXZlbnREZWZhdWx0KCkpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBsZXQgZHJvcFRhcmdldElkID0gbWF5YmUoY2xvc2VzdFBoeEJpbmRpbmcoZS50YXJnZXQsIHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKSwgdHJ1ZVRhcmdldCA9PiB7XG4gICAgICAgIHJldHVybiB0cnVlVGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0RST1BfVEFSR0VUKSlcbiAgICAgIH0pXG4gICAgICBsZXQgZHJvcFRhcmdldCA9IGRyb3BUYXJnZXRJZCAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkcm9wVGFyZ2V0SWQpXG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGF0YVRyYW5zZmVyLmZpbGVzIHx8IFtdKVxuICAgICAgaWYoIWRyb3BUYXJnZXQgfHwgZHJvcFRhcmdldC5kaXNhYmxlZCB8fCBmaWxlcy5sZW5ndGggPT09IDAgfHwgIShkcm9wVGFyZ2V0LmZpbGVzIGluc3RhbmNlb2YgRmlsZUxpc3QpKXsgcmV0dXJuIH1cblxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoZHJvcFRhcmdldCwgZmlsZXMpXG4gICAgICBkcm9wVGFyZ2V0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiaW5wdXRcIiwge2J1YmJsZXM6IHRydWV9KSlcbiAgICB9KVxuICAgIHRoaXMub24oUEhYX1RSQUNLX1VQTE9BRFMsIGUgPT4ge1xuICAgICAgbGV0IHVwbG9hZFRhcmdldCA9IGUudGFyZ2V0XG4gICAgICBpZighRE9NLmlzVXBsb2FkSW5wdXQodXBsb2FkVGFyZ2V0KSl7IHJldHVybiB9XG4gICAgICBsZXQgZmlsZXMgPSBBcnJheS5mcm9tKGUuZGV0YWlsLmZpbGVzIHx8IFtdKS5maWx0ZXIoZiA9PiBmIGluc3RhbmNlb2YgRmlsZSB8fCBmIGluc3RhbmNlb2YgQmxvYilcbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKHVwbG9hZFRhcmdldCwgZmlsZXMpXG4gICAgICB1cGxvYWRUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgIH0pXG4gIH1cblxuICBldmVudE1ldGEoZXZlbnROYW1lLCBlLCB0YXJnZXRFbCl7XG4gICAgbGV0IGNhbGxiYWNrID0gdGhpcy5tZXRhZGF0YUNhbGxiYWNrc1tldmVudE5hbWVdXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZSwgdGFyZ2V0RWwpIDoge31cbiAgfVxuXG4gIHNldFBlbmRpbmdMaW5rKGhyZWYpe1xuICAgIHRoaXMubGlua1JlZisrXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IGhyZWZcbiAgICByZXR1cm4gdGhpcy5saW5rUmVmXG4gIH1cblxuICBjb21taXRQZW5kaW5nTGluayhsaW5rUmVmKXtcbiAgICBpZih0aGlzLmxpbmtSZWYgIT09IGxpbmtSZWYpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaHJlZiA9IHRoaXMucGVuZGluZ0xpbmtcbiAgICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGdldEhyZWYoKXsgcmV0dXJuIHRoaXMuaHJlZiB9XG5cbiAgaGFzUGVuZGluZ0xpbmsoKXsgcmV0dXJuICEhdGhpcy5wZW5kaW5nTGluayB9XG5cbiAgYmluZChldmVudHMsIGNhbGxiYWNrKXtcbiAgICBmb3IobGV0IGV2ZW50IGluIGV2ZW50cyl7XG4gICAgICBsZXQgYnJvd3NlckV2ZW50TmFtZSA9IGV2ZW50c1tldmVudF1cblxuICAgICAgdGhpcy5vbihicm93c2VyRXZlbnROYW1lLCBlID0+IHtcbiAgICAgICAgbGV0IGJpbmRpbmcgPSB0aGlzLmJpbmRpbmcoZXZlbnQpXG4gICAgICAgIGxldCB3aW5kb3dCaW5kaW5nID0gdGhpcy5iaW5kaW5nKGB3aW5kb3ctJHtldmVudH1gKVxuICAgICAgICBsZXQgdGFyZ2V0UGh4RXZlbnQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUgJiYgZS50YXJnZXQuZ2V0QXR0cmlidXRlKGJpbmRpbmcpXG4gICAgICAgIGlmKHRhcmdldFBoeEV2ZW50KXtcbiAgICAgICAgICB0aGlzLmRlYm91bmNlKGUudGFyZ2V0LCBlLCBicm93c2VyRXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgICAgIGNhbGxiYWNrKGUsIGV2ZW50LCB2aWV3LCBlLnRhcmdldCwgdGFyZ2V0UGh4RXZlbnQsIG51bGwpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRE9NLmFsbChkb2N1bWVudCwgYFske3dpbmRvd0JpbmRpbmd9XWAsIGVsID0+IHtcbiAgICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZSh3aW5kb3dCaW5kaW5nKVxuICAgICAgICAgICAgdGhpcy5kZWJvdW5jZShlbCwgZSwgYnJvd3NlckV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlbCwgdmlldyA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZSwgZXZlbnQsIHZpZXcsIGVsLCBwaHhFdmVudCwgXCJ3aW5kb3dcIilcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBiaW5kQ2xpY2tzKCl7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZSA9PiB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gZS50YXJnZXQpXG4gICAgdGhpcy5iaW5kQ2xpY2soXCJjbGlja1wiLCBcImNsaWNrXCIsIGZhbHNlKVxuICAgIHRoaXMuYmluZENsaWNrKFwibW91c2Vkb3duXCIsIFwiY2FwdHVyZS1jbGlja1wiLCB0cnVlKVxuICB9XG5cbiAgYmluZENsaWNrKGV2ZW50TmFtZSwgYmluZGluZ05hbWUsIGNhcHR1cmUpe1xuICAgIGxldCBjbGljayA9IHRoaXMuYmluZGluZyhiaW5kaW5nTmFtZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGUgPT4ge1xuICAgICAgbGV0IHRhcmdldCA9IG51bGxcbiAgICAgIGlmKGNhcHR1cmUpe1xuICAgICAgICB0YXJnZXQgPSBlLnRhcmdldC5tYXRjaGVzKGBbJHtjbGlja31dYCkgPyBlLnRhcmdldCA6IGUudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYFske2NsaWNrfV1gKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCB8fCBlLnRhcmdldFxuICAgICAgICB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhjbGlja1N0YXJ0ZWRBdFRhcmdldCwgY2xpY2spXG4gICAgICAgIHRoaXMuZGlzcGF0Y2hDbGlja0F3YXkoZSwgY2xpY2tTdGFydGVkQXRUYXJnZXQpXG4gICAgICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgICB9XG4gICAgICBsZXQgcGh4RXZlbnQgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShjbGljaylcbiAgICAgIGlmKCFwaHhFdmVudCl7IHJldHVybiB9XG4gICAgICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjXCIpeyBlLnByZXZlbnREZWZhdWx0KCkgfVxuXG4gICAgICB0aGlzLmRlYm91bmNlKHRhcmdldCwgZSwgXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKHRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgSlMuZXhlYyhcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXQsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgdGFyZ2V0KX1dKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LCBjYXB0dXJlKVxuICB9XG5cbiAgZGlzcGF0Y2hDbGlja0F3YXkoZSwgY2xpY2tTdGFydGVkQXQpe1xuICAgIGxldCBwaHhDbGlja0F3YXkgPSB0aGlzLmJpbmRpbmcoXCJjbGljay1hd2F5XCIpXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYFske3BoeENsaWNrQXdheX1dYCwgZWwgPT4ge1xuICAgICAgaWYoIShlbC5pc1NhbWVOb2RlKGNsaWNrU3RhcnRlZEF0KSB8fCBlbC5jb250YWlucyhjbGlja1N0YXJ0ZWRBdCkpKXtcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZShwaHhDbGlja0F3YXkpXG4gICAgICAgICAgaWYoSlMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgICAgICBKUy5leGVjKFwiY2xpY2tcIiwgcGh4RXZlbnQsIHZpZXcsIGVsLCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIGUudGFyZ2V0KX1dKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZE5hdigpe1xuICAgIGlmKCFCcm93c2VyLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBpZihoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uKXsgaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9IFwibWFudWFsXCIgfVxuICAgIGxldCBzY3JvbGxUaW1lciA9IG51bGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBfZSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsVGltZXIpXG4gICAgICBzY3JvbGxUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZShzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHN0YXRlLCB7c2Nyb2xsOiB3aW5kb3cuc2Nyb2xsWX0pKVxuICAgICAgfSwgMTAwKVxuICAgIH0pXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBldmVudCA9PiB7XG4gICAgICBpZighdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbikpeyByZXR1cm4gfVxuICAgICAgbGV0IHt0eXBlLCBpZCwgcm9vdCwgc2Nyb2xsfSA9IGV2ZW50LnN0YXRlIHx8IHt9XG4gICAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG5cbiAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmKHRoaXMubWFpbi5pc0Nvbm5lY3RlZCgpICYmICh0eXBlID09PSBcInBhdGNoXCIgJiYgaWQgPT09IHRoaXMubWFpbi5pZCkpe1xuICAgICAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGhyZWYsIG51bGwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBudWxsLCAoKSA9PiB7XG4gICAgICAgICAgICBpZihyb290KXsgdGhpcy5yZXBsYWNlUm9vdEhpc3RvcnkoKSB9XG4gICAgICAgICAgICBpZih0eXBlb2Yoc2Nyb2xsKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpXG4gICAgICAgICAgICAgIH0sIDApIC8vIHRoZSBib2R5IG5lZWRzIHRvIHJlbmRlciBiZWZvcmUgd2Ugc2Nyb2xsLlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB0eXBlID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB3YW50c05ld1RhYiA9IGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5idXR0b24gPT09IDFcbiAgICAgIGlmKCF0eXBlIHx8ICF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbiB8fCB3YW50c05ld1RhYil7IHJldHVybiB9XG5cbiAgICAgIGxldCBocmVmID0gdGFyZ2V0LmhyZWZcbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIC8vIGRvIG5vdCBidWJibGUgY2xpY2sgdG8gcmVndWxhciBwaHgtY2xpY2sgYmluZGluZ3NcbiAgICAgIGlmKHRoaXMucGVuZGluZ0xpbmsgPT09IGhyZWYpeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZih0eXBlID09PSBcInBhdGNoXCIpe1xuICAgICAgICAgIHRoaXMucHVzaEhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIHRhcmdldClcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5UmVkaXJlY3QoaHJlZiwgbGlua1N0YXRlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgJHtQSFhfTElWRV9MSU5LfSB0byBiZSBcInBhdGNoXCIgb3IgXCJyZWRpcmVjdFwiLCBnb3Q6ICR7dHlwZX1gKVxuICAgICAgICB9XG4gICAgICAgIGxldCBwaHhDbGljayA9IHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2xpY2tcIikpXG4gICAgICAgIGlmKHBoeENsaWNrKXtcbiAgICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4gdGhpcy5leGVjSlModGFyZ2V0LCBwaHhDbGljaywgXCJjbGlja1wiKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQgPSB7fSl7XG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBgcGh4OiR7ZXZlbnR9YCwge2RldGFpbDogcGF5bG9hZH0pXG4gIH1cblxuICBkaXNwYXRjaEV2ZW50cyhldmVudHMpe1xuICAgIGV2ZW50cy5mb3JFYWNoKChbZXZlbnQsIHBheWxvYWRdKSA9PiB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQsIHBheWxvYWQpKVxuICB9XG5cbiAgd2l0aFBhZ2VMb2FkaW5nKGluZm8sIGNhbGxiYWNrKXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICBsZXQgZG9uZSA9ICgpID0+IERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0b3BcIiwge2RldGFpbDogaW5mb30pXG4gICAgcmV0dXJuIGNhbGxiYWNrID8gY2FsbGJhY2soZG9uZSkgOiBkb25lXG4gIH1cblxuICBwdXNoSGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0RWwpe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gQnJvd3Nlci5yZWRpcmVjdChocmVmKSB9XG5cbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicGF0Y2hcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goaHJlZiwgdGFyZ2V0RWwsIGxpbmtSZWYgPT4ge1xuICAgICAgICB0aGlzLmhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYpXG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgaGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgbGlua1JlZiA9IHRoaXMuc2V0UGVuZGluZ0xpbmsoaHJlZikpe1xuICAgIGlmKCF0aGlzLmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXsgcmV0dXJuIH1cblxuICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge3R5cGU6IFwicGF0Y2hcIiwgaWQ6IHRoaXMubWFpbi5pZH0sIGhyZWYpXG4gICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbilcbiAgfVxuXG4gIGhpc3RvcnlSZWRpcmVjdChocmVmLCBsaW5rU3RhdGUsIGZsYXNoKXtcbiAgICAvLyBjb252ZXJ0IHRvIGZ1bGwgaHJlZiBpZiBvbmx5IHBhdGggcHJlZml4XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiBCcm93c2VyLnJlZGlyZWN0KGhyZWYsIGZsYXNoKSB9XG4gICAgaWYoL15cXC9bXlxcL10rLiokLy50ZXN0KGhyZWYpKXtcbiAgICAgIGxldCB7cHJvdG9jb2wsIGhvc3R9ID0gd2luZG93LmxvY2F0aW9uXG4gICAgICBocmVmID0gYCR7cHJvdG9jb2x9Ly8ke2hvc3R9JHtocmVmfWBcbiAgICB9XG4gICAgbGV0IHNjcm9sbCA9IHdpbmRvdy5zY3JvbGxZXG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInJlZGlyZWN0XCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgZmxhc2gsICgpID0+IHtcbiAgICAgICAgQnJvd3Nlci5wdXNoU3RhdGUobGlua1N0YXRlLCB7dHlwZTogXCJyZWRpcmVjdFwiLCBpZDogdGhpcy5tYWluLmlkLCBzY3JvbGw6IHNjcm9sbH0sIGhyZWYpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pXG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVwbGFjZVJvb3RIaXN0b3J5KCl7XG4gICAgQnJvd3Nlci5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHtyb290OiB0cnVlLCB0eXBlOiBcInBhdGNoXCIsIGlkOiB0aGlzLm1haW4uaWR9KVxuICB9XG5cbiAgcmVnaXN0ZXJOZXdMb2NhdGlvbihuZXdMb2NhdGlvbil7XG4gICAgbGV0IHtwYXRobmFtZSwgc2VhcmNofSA9IHRoaXMuY3VycmVudExvY2F0aW9uXG4gICAgaWYocGF0aG5hbWUgKyBzZWFyY2ggPT09IG5ld0xvY2F0aW9uLnBhdGhuYW1lICsgbmV3TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKG5ld0xvY2F0aW9uKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBiaW5kRm9ybXMoKXtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDBcbiAgICBsZXQgZXh0ZXJuYWxGb3JtU3VibWl0dGVkID0gZmFsc2VcblxuICAgIC8vIGRpc2FibGUgZm9ybXMgb24gc3VibWl0IHRoYXQgdHJhY2sgcGh4LWNoYW5nZSBidXQgcGVyZm9ybSBleHRlcm5hbCBzdWJtaXRcbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeFN1Ym1pdCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJzdWJtaXRcIikpXG4gICAgICBsZXQgcGh4Q2hhbmdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcbiAgICAgIGlmKCFleHRlcm5hbEZvcm1TdWJtaXR0ZWQgJiYgcGh4Q2hhbmdlICYmICFwaHhTdWJtaXQpe1xuICAgICAgICBleHRlcm5hbEZvcm1TdWJtaXR0ZWQgPSB0cnVlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgdmlldy5kaXNhYmxlRm9ybShlLnRhcmdldClcbiAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGUudGFyZ2V0LnN1Ym1pdCgpKSAvLyBzYWZhcmkgbmVlZHMgbmV4dCB0aWNrXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSwgdHJ1ZSlcblxuICAgIHRoaXMub24oXCJzdWJtaXRcIiwgZSA9PiB7XG4gICAgICBsZXQgcGh4RXZlbnQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwic3VibWl0XCIpKVxuICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS50YXJnZXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgIEpTLmV4ZWMoXCJzdWJtaXRcIiwgcGh4RXZlbnQsIHZpZXcsIGUudGFyZ2V0LCBbXCJwdXNoXCIsIHt9XSlcbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG5cbiAgICBmb3IobGV0IHR5cGUgb2YgW1wiY2hhbmdlXCIsIFwiaW5wdXRcIl0pe1xuICAgICAgdGhpcy5vbih0eXBlLCBlID0+IHtcbiAgICAgICAgbGV0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgICAgICBsZXQgaW5wdXQgPSBlLnRhcmdldFxuICAgICAgICBsZXQgaW5wdXRFdmVudCA9IGlucHV0LmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBmb3JtRXZlbnQgPSBpbnB1dC5mb3JtICYmIGlucHV0LmZvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IHBoeEV2ZW50ID0gaW5wdXRFdmVudCB8fCBmb3JtRXZlbnRcbiAgICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgICAgaWYoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCl7IHJldHVybiB9XG5cbiAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBpbnB1dEV2ZW50ID8gaW5wdXQgOiBpbnB1dC5mb3JtXG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnNcbiAgICAgICAgaXRlcmF0aW9ucysrXG4gICAgICAgIGxldCB7YXQ6IGF0LCB0eXBlOiBsYXN0VHlwZX0gPSBET00ucHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiKSB8fCB7fVxuICAgICAgICAvLyBkZXRlY3QgZHVwIGJlY2F1c2Ugc29tZSBicm93c2VycyBkaXNwYXRjaCBib3RoIFwiaW5wdXRcIiBhbmQgXCJjaGFuZ2VcIlxuICAgICAgICBpZihhdCA9PT0gY3VycmVudEl0ZXJhdGlvbnMgLSAxICYmIHR5cGUgIT09IGxhc3RUeXBlKXsgcmV0dXJuIH1cblxuICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiLCB7YXQ6IGN1cnJlbnRJdGVyYXRpb25zLCB0eXBlOiB0eXBlfSlcblxuICAgICAgICB0aGlzLmRlYm91bmNlKGlucHV0LCBlLCB0eXBlLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZGlzcGF0Y2hlciwgdmlldyA9PiB7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VELCB0cnVlKVxuICAgICAgICAgICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChpbnB1dCkpe1xuICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUVsZW1lbnQoaW5wdXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBKUy5leGVjKFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogZS50YXJnZXQubmFtZSwgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlcn1dKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9LCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIGV2ZW50VHlwZSwgY2FsbGJhY2spe1xuICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJibHVyXCIgfHwgZXZlbnRUeXBlID09PSBcImZvY3Vzb3V0XCIpeyByZXR1cm4gY2FsbGJhY2soKSB9XG5cbiAgICBsZXQgcGh4RGVib3VuY2UgPSB0aGlzLmJpbmRpbmcoUEhYX0RFQk9VTkNFKVxuICAgIGxldCBwaHhUaHJvdHRsZSA9IHRoaXMuYmluZGluZyhQSFhfVEhST1RUTEUpXG4gICAgbGV0IGRlZmF1bHREZWJvdW5jZSA9IHRoaXMuZGVmYXVsdHMuZGVib3VuY2UudG9TdHJpbmcoKVxuICAgIGxldCBkZWZhdWx0VGhyb3R0bGUgPSB0aGlzLmRlZmF1bHRzLnRocm90dGxlLnRvU3RyaW5nKClcblxuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBhc3luY0ZpbHRlciA9ICgpID0+ICF2aWV3LmlzRGVzdHJveWVkKCkgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhlbClcbiAgICAgIERPTS5kZWJvdW5jZShlbCwgZXZlbnQsIHBoeERlYm91bmNlLCBkZWZhdWx0RGVib3VuY2UsIHBoeFRocm90dGxlLCBkZWZhdWx0VGhyb3R0bGUsIGFzeW5jRmlsdGVyLCAoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNpbGVuY2VFdmVudHMoY2FsbGJhY2spe1xuICAgIHRoaXMuc2lsZW5jZWQgPSB0cnVlXG4gICAgY2FsbGJhY2soKVxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiB7XG4gICAgICBpZighdGhpcy5zaWxlbmNlZCl7IGNhbGxiYWNrKGUpIH1cbiAgICB9KVxuICB9XG59XG5cbmNsYXNzIFRyYW5zaXRpb25TZXQge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICAgIHRoaXMucmVzZXQoKVxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2godGltZXIgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgfSlcbiAgICB0aGlzLmZsdXNoUGVuZGluZ09wcygpXG4gIH1cblxuICBhZnRlcihjYWxsYmFjayl7XG4gICAgaWYodGhpcy5zaXplKCkgPT09IDApe1xuICAgICAgY2FsbGJhY2soKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hQZW5kaW5nT3AoY2FsbGJhY2spXG4gICAgfVxuICB9XG5cbiAgYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpe1xuICAgIG9uU3RhcnQoKVxuICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUodGltZXIpXG4gICAgICBvbkRvbmUoKVxuICAgICAgaWYodGhpcy5zaXplKCkgPT09IDApeyB0aGlzLmZsdXNoUGVuZGluZ09wcygpIH1cbiAgICB9LCB0aW1lKVxuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkKHRpbWVyKVxuICB9XG5cbiAgcHVzaFBlbmRpbmdPcChvcCl7IHRoaXMucGVuZGluZ09wcy5wdXNoKG9wKSB9XG5cbiAgc2l6ZSgpeyByZXR1cm4gdGhpcy50cmFuc2l0aW9ucy5zaXplIH1cblxuICBmbHVzaFBlbmRpbmdPcHMoKXtcbiAgICB0aGlzLnBlbmRpbmdPcHMuZm9yRWFjaChvcCA9PiBvcCgpKVxuICAgIHRoaXMucGVuZGluZ09wcyA9IFtdXG4gIH1cbn1cbiIsICJjb25zdCBDT0xPUlMgPSB7XG4gIHBob2VuaXg6IFsyNDIsIDExMCwgNjRdLFxuICBlbGl4aXI6IFs3NSwgNjgsIDExNV0sXG4gIHJlZDogWzI1NSwgOTksIDEzMl0sXG4gIG9yYW5nZTogWzI1NSwgMTU5LCA2NF0sXG4gIHllbGxvdzogWzI1NSwgMjA1LCA4Nl0sXG4gIGdyZWVuOiBbNzUsIDE5MiwgMTkyXSxcbiAgYmx1ZTogWzU0LCAxNjIsIDI1M10sXG4gIHB1cnBsZTogWzE1MywgMTAyLCAyNTVdLFxuICBncmV5OiBbMjAxLCAyMDMsIDIwN10sXG59XG5cbmNvbnN0IENPTE9SX05BTUVTID0gT2JqZWN0LmtleXMoQ09MT1JTKVxuXG5leHBvcnQgY29uc3QgQ29sb3JXaGVlbCA9IHtcbiAgYXQ6IChpKSA9PiB7XG4gICAgY29uc3QgW3IsIGcsIGJdID0gQ29sb3JXaGVlbC5yZ2IoaSlcbiAgICByZXR1cm4gYHJnYigke3J9LCAke2d9LCAke2J9KWBcbiAgfSxcbiAgcmdiOiAoaSkgPT4gQ09MT1JTW0NPTE9SX05BTUVTW2kgJSBDT0xPUl9OQU1FUy5sZW5ndGhdXSxcbn1cblxuZXhwb3J0IGNvbnN0IExpbmVDb2xvciA9IHtcbiAgYXQ6IChpKSA9PiB7XG4gICAgY29uc3QgW3IsIGcsIGJdID0gQ29sb3JXaGVlbC5yZ2IoaSlcbiAgICByZXR1cm4ge1xuICAgICAgc3Ryb2tlOiBgcmdiKCR7cn0sICR7Z30sICR7Yn0pYCxcbiAgICAgIGZpbGw6IGByZ2IoJHtyfSwgJHtnfSwgJHtifSwgMC4xKWBcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JXaGVlbFxuIiwgIi8qKlxuKiBDb3B5cmlnaHQgKGMpIDIwMjAsIExlb24gU29yb2tpblxuKiBBbGwgcmlnaHRzIHJlc2VydmVkLiAoTUlUIExpY2Vuc2VkKVxuKlxuKiB1UGxvdC5qcyAoXHUwM0JDUGxvdClcbiogQSBzbWFsbCwgZmFzdCBjaGFydCBmb3IgdGltZSBzZXJpZXMsIGxpbmVzLCBhcmVhcywgb2hsYyAmIGJhcnNcbiogaHR0cHM6Ly9naXRodWIuY29tL2xlZW9uaXlhL3VQbG90ICh2MS4wLjExKVxuKi9cblxuZnVuY3Rpb24gZGVib3VuY2UoZm4sIHRpbWUpIHtcblx0bGV0IHBlbmRpbmcgPSBudWxsO1xuXG5cdGZ1bmN0aW9uIHJ1bigpIHtcblx0XHRwZW5kaW5nID0gbnVsbDtcblx0XHRmbigpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNsZWFyVGltZW91dChwZW5kaW5nKTtcblx0XHRwZW5kaW5nID0gc2V0VGltZW91dChydW4sIHRpbWUpO1xuXHR9XG59XG5cbi8vIGJpbmFyeSBzZWFyY2ggZm9yIGluZGV4IG9mIGNsb3Nlc3QgdmFsdWVcbmZ1bmN0aW9uIGNsb3Nlc3RJZHgobnVtLCBhcnIsIGxvLCBoaSkge1xuXHRsZXQgbWlkO1xuXHRsbyA9IGxvIHx8IDA7XG5cdGhpID0gaGkgfHwgYXJyLmxlbmd0aCAtIDE7XG5cdGxldCBiaXR3aXNlID0gaGkgPD0gMjE0NzQ4MzY0NztcblxuXHR3aGlsZSAoaGkgLSBsbyA+IDEpIHtcblx0XHRtaWQgPSBiaXR3aXNlID8gKGxvICsgaGkpID4+IDEgOiBmbG9vcigobG8gKyBoaSkgLyAyKTtcblxuXHRcdGlmIChhcnJbbWlkXSA8IG51bSlcblx0XHRcdGxvID0gbWlkO1xuXHRcdGVsc2Vcblx0XHRcdGhpID0gbWlkO1xuXHR9XG5cblx0aWYgKG51bSAtIGFycltsb10gPD0gYXJyW2hpXSAtIG51bSlcblx0XHRyZXR1cm4gbG87XG5cblx0cmV0dXJuIGhpO1xufVxuXG5mdW5jdGlvbiBnZXRNaW5NYXgoZGF0YSwgX2kwLCBfaTEpIHtcbi8vXHRjb25zb2xlLmxvZyhcImdldE1pbk1heCgpXCIpO1xuXG5cdGxldCBfbWluID0gaW5mO1xuXHRsZXQgX21heCA9IC1pbmY7XG5cblx0Zm9yIChsZXQgaSA9IF9pMDsgaSA8PSBfaTE7IGkrKykge1xuXHRcdGlmIChkYXRhW2ldICE9IG51bGwpIHtcblx0XHRcdF9taW4gPSBtaW4oX21pbiwgZGF0YVtpXSk7XG5cdFx0XHRfbWF4ID0gbWF4KF9tYXgsIGRhdGFbaV0pO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBbX21pbiwgX21heF07XG59XG5cbi8vIHRoaXMgZW5zdXJlcyB0aGF0IG5vbi10ZW1wb3JhbC9udW1lcmljIHktYXhlcyBnZXQgbXVsdGlwbGUtc25hcHBlZCBwYWRkaW5nIGFkZGVkIGFib3ZlL2JlbG93XG4vLyBUT0RPOiBhbHNvIGFjY291bnQgZm9yIGluY3JzIHdoZW4gc25hcHBpbmcgdG8gZW5zdXJlIHRvcCBvZiBheGlzIGdldHMgYSB0aWNrICYgdmFsdWVcbmZ1bmN0aW9uIHJhbmdlTnVtKG1pbiwgbWF4LCBtdWx0LCBleHRyYSkge1xuXHQvLyBhdXRvLXNjYWxlIFlcblx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cdGNvbnN0IG1hZyA9IGxvZzEwKGRlbHRhIHx8IGFicyhtYXgpIHx8IDEpO1xuXHRjb25zdCBleHAgPSBmbG9vcihtYWcpO1xuXHRjb25zdCBpbmNyID0gcG93KDEwLCBleHApICogbXVsdDtcblx0Y29uc3QgYnVmID0gZGVsdGEgPT0gMCA/IGluY3IgOiAwO1xuXG5cdGxldCBzbmFwcGVkTWluID0gcm91bmQ2KGluY3JSb3VuZERuKG1pbiAtIGJ1ZiwgaW5jcikpO1xuXHRsZXQgc25hcHBlZE1heCA9IHJvdW5kNihpbmNyUm91bmRVcChtYXggKyBidWYsIGluY3IpKTtcblxuXHRpZiAoZXh0cmEpIHtcblx0XHQvLyBmb3IgZmxhdCBkYXRhLCBhbHdheXMgdXNlIDAgYXMgb25lIGNoYXJ0IGV4dHJlbWUgJiBwbGFjZSBkYXRhIGluIGNlbnRlclxuXHRcdGlmIChkZWx0YSA9PSAwKSB7XG5cdFx0XHRpZiAobWF4ID4gMCkge1xuXHRcdFx0XHRzbmFwcGVkTWluID0gMDtcblx0XHRcdFx0c25hcHBlZE1heCA9IG1heCAqIDI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChtYXggPCAwKSB7XG5cdFx0XHRcdHNuYXBwZWRNYXggPSAwO1xuXHRcdFx0XHRzbmFwcGVkTWluID0gbWluICogMjtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBpZiBidWZmZXIgaXMgdG9vIHNtYWxsLCBpbmNyZWFzZSBpdFxuXHRcdFx0aWYgKHNuYXBwZWRNYXggLSBtYXggPCBpbmNyKVxuXHRcdFx0XHRzbmFwcGVkTWF4ICs9IGluY3I7XG5cblx0XHRcdGlmIChtaW4gLSBzbmFwcGVkTWluIDwgaW5jcilcblx0XHRcdFx0c25hcHBlZE1pbiAtPSBpbmNyO1xuXG5cdFx0XHQvLyBpZiBvcmlnaW5hbCBkYXRhIG5ldmVyIGNyb3NzZXMgMCwgdXNlIDAgYXMgb25lIGNoYXJ0IGV4dHJlbWVcblx0XHRcdGlmIChtaW4gPj0gMCAmJiBzbmFwcGVkTWluIDwgMClcblx0XHRcdFx0c25hcHBlZE1pbiA9IDA7XG5cblx0XHRcdGlmIChtYXggPD0gMCAmJiBzbmFwcGVkTWF4ID4gMClcblx0XHRcdFx0c25hcHBlZE1heCA9IDA7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFtzbmFwcGVkTWluLCBzbmFwcGVkTWF4XTtcbn1cblxuY29uc3QgTSA9IE1hdGg7XG5cbmNvbnN0IGFicyA9IE0uYWJzO1xuY29uc3QgZmxvb3IgPSBNLmZsb29yO1xuY29uc3Qgcm91bmQgPSBNLnJvdW5kO1xuY29uc3QgY2VpbCA9IE0uY2VpbDtcbmNvbnN0IG1pbiA9IE0ubWluO1xuY29uc3QgbWF4ID0gTS5tYXg7XG5jb25zdCBwb3cgPSBNLnBvdztcbmNvbnN0IGxvZzEwID0gTS5sb2cxMDtcbmNvbnN0IFBJID0gTS5QSTtcblxuY29uc3QgaW5mID0gSW5maW5pdHk7XG5cbmZ1bmN0aW9uIGluY3JSb3VuZChudW0sIGluY3IpIHtcblx0cmV0dXJuIHJvdW5kKG51bS9pbmNyKSppbmNyO1xufVxuXG5mdW5jdGlvbiBjbGFtcChudW0sIF9taW4sIF9tYXgpIHtcblx0cmV0dXJuIG1pbihtYXgobnVtLCBfbWluKSwgX21heCk7XG59XG5cbmZ1bmN0aW9uIGZuT3JTZWxmKHYpIHtcblx0cmV0dXJuIHR5cGVvZiB2ID09IFwiZnVuY3Rpb25cIiA/IHYgOiAoKSA9PiB2O1xufVxuXG5mdW5jdGlvbiBpbmNyUm91bmRVcChudW0sIGluY3IpIHtcblx0cmV0dXJuIGNlaWwobnVtL2luY3IpKmluY3I7XG59XG5cbmZ1bmN0aW9uIGluY3JSb3VuZERuKG51bSwgaW5jcikge1xuXHRyZXR1cm4gZmxvb3IobnVtL2luY3IpKmluY3I7XG59XG5cbmZ1bmN0aW9uIHJvdW5kMyh2YWwpIHtcblx0cmV0dXJuIHJvdW5kKHZhbCAqIDFlMykgLyAxZTM7XG59XG5cbmZ1bmN0aW9uIHJvdW5kNih2YWwpIHtcblx0cmV0dXJuIHJvdW5kKHZhbCAqIDFlNikgLyAxZTY7XG59XG5cbi8vZXhwb3J0IGNvbnN0IGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbmNvbnN0IGlzQXJyID0gQXJyYXkuaXNBcnJheTtcblxuZnVuY3Rpb24gaXNTdHIodikge1xuXHRyZXR1cm4gdHlwZW9mIHYgPT09ICdzdHJpbmcnO1xufVxuXG5mdW5jdGlvbiBpc09iaih2KSB7XG5cdHJldHVybiB0eXBlb2YgdiA9PT0gJ29iamVjdCcgJiYgdiAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gY29weShvKSB7XG5cdGxldCBvdXQ7XG5cblx0aWYgKGlzQXJyKG8pKVxuXHRcdG91dCA9IG8ubWFwKGNvcHkpO1xuXHRlbHNlIGlmIChpc09iaihvKSkge1xuXHRcdG91dCA9IHt9O1xuXHRcdGZvciAodmFyIGsgaW4gbylcblx0XHRcdG91dFtrXSA9IGNvcHkob1trXSk7XG5cdH1cblx0ZWxzZVxuXHRcdG91dCA9IG87XG5cblx0cmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gYXNzaWduKHRhcmcpIHtcblx0bGV0IGFyZ3MgPSBhcmd1bWVudHM7XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHNyYyA9IGFyZ3NbaV07XG5cblx0XHRmb3IgKGxldCBrZXkgaW4gc3JjKSB7XG5cdFx0XHRpZiAoaXNPYmoodGFyZ1trZXldKSlcblx0XHRcdFx0YXNzaWduKHRhcmdba2V5XSwgY29weShzcmNba2V5XSkpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0YXJnW2tleV0gPSBjb3B5KHNyY1trZXldKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdGFyZztcbn1cblxuY29uc3QgV0lEVEggPSBcIndpZHRoXCI7XG5jb25zdCBIRUlHSFQgPSBcImhlaWdodFwiO1xuY29uc3QgVE9QID0gXCJ0b3BcIjtcbmNvbnN0IEJPVFRPTSA9IFwiYm90dG9tXCI7XG5jb25zdCBMRUZUID0gXCJsZWZ0XCI7XG5jb25zdCBSSUdIVCA9IFwicmlnaHRcIjtcbmNvbnN0IGZpcnN0Q2hpbGQgPSBcImZpcnN0Q2hpbGRcIjtcbmNvbnN0IGNyZWF0ZUVsZW1lbnQgPSBcImNyZWF0ZUVsZW1lbnRcIjtcbmNvbnN0IGhleEJsYWNrID0gXCIjMDAwXCI7XG5jb25zdCBjbGFzc0xpc3QgPSBcImNsYXNzTGlzdFwiO1xuXG5jb25zdCBtb3VzZW1vdmUgPSBcIm1vdXNlbW92ZVwiO1xuY29uc3QgbW91c2Vkb3duID0gXCJtb3VzZWRvd25cIjtcbmNvbnN0IG1vdXNldXAgPSBcIm1vdXNldXBcIjtcbmNvbnN0IG1vdXNlZW50ZXIgPSBcIm1vdXNlZW50ZXJcIjtcbmNvbnN0IG1vdXNlbGVhdmUgPSBcIm1vdXNlbGVhdmVcIjtcbmNvbnN0IGRibGNsaWNrID0gXCJkYmxjbGlja1wiO1xuY29uc3QgcmVzaXplID0gXCJyZXNpemVcIjtcbmNvbnN0IHNjcm9sbCA9IFwic2Nyb2xsXCI7XG5cbmNvbnN0IHJBRiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbmNvbnN0IGRvYyA9IGRvY3VtZW50O1xuY29uc3Qgd2luID0gd2luZG93O1xuY29uc3QgcHhSYXRpbyA9IGRldmljZVBpeGVsUmF0aW87XG5cbmZ1bmN0aW9uIGFkZENsYXNzKGVsLCBjKSB7XG5cdGMgIT0gbnVsbCAmJiBlbFtjbGFzc0xpc3RdLmFkZChjKTtcbn1cblxuZnVuY3Rpb24gcmVtQ2xhc3MoZWwsIGMpIHtcblx0ZWxbY2xhc3NMaXN0XS5yZW1vdmUoYyk7XG59XG5cbmZ1bmN0aW9uIHNldFN0eWxlUHgoZWwsIG5hbWUsIHZhbHVlKSB7XG5cdGVsLnN0eWxlW25hbWVdID0gdmFsdWUgKyBcInB4XCI7XG59XG5cbmZ1bmN0aW9uIHBsYWNlVGFnKHRhZywgY2xzLCB0YXJnLCByZWZFbCkge1xuXHRsZXQgZWwgPSBkb2NbY3JlYXRlRWxlbWVudF0odGFnKTtcblxuXHRpZiAoY2xzICE9IG51bGwpXG5cdFx0YWRkQ2xhc3MoZWwsIGNscyk7XG5cblx0aWYgKHRhcmcgIT0gbnVsbClcblx0XHR0YXJnLmluc2VydEJlZm9yZShlbCwgcmVmRWwpO1xuXG5cdHJldHVybiBlbDtcbn1cblxuZnVuY3Rpb24gcGxhY2VEaXYoY2xzLCB0YXJnKSB7XG5cdHJldHVybiBwbGFjZVRhZyhcImRpdlwiLCBjbHMsIHRhcmcpO1xufVxuXG5mdW5jdGlvbiB0cmFucyhlbCwgeFBvcywgeVBvcykge1xuXHRlbC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIHhQb3MgKyBcInB4LFwiICsgeVBvcyArIFwicHgpXCI7XG59XG5cbmNvbnN0IGV2T3B0cyA9IHtwYXNzaXZlOiB0cnVlfTtcblxuZnVuY3Rpb24gb24oZXYsIGVsLCBjYikge1xuXHRlbC5hZGRFdmVudExpc3RlbmVyKGV2LCBjYiwgZXZPcHRzKTtcbn1cblxuZnVuY3Rpb24gb2ZmKGV2LCBlbCwgY2IpIHtcblx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldiwgY2IsIGV2T3B0cyk7XG59XG5cbmNvbnN0IG1vbnRocyA9IFtcblx0XCJKYW51YXJ5XCIsXG5cdFwiRmVicnVhcnlcIixcblx0XCJNYXJjaFwiLFxuXHRcIkFwcmlsXCIsXG5cdFwiTWF5XCIsXG5cdFwiSnVuZVwiLFxuXHRcIkp1bHlcIixcblx0XCJBdWd1c3RcIixcblx0XCJTZXB0ZW1iZXJcIixcblx0XCJPY3RvYmVyXCIsXG5cdFwiTm92ZW1iZXJcIixcblx0XCJEZWNlbWJlclwiLFxuXTtcblxuY29uc3QgZGF5cyA9IFtcblx0XCJTdW5kYXlcIixcblx0XCJNb25kYXlcIixcblx0XCJUdWVzZGF5XCIsXG5cdFwiV2VkbmVzZGF5XCIsXG5cdFwiVGh1cnNkYXlcIixcblx0XCJGcmlkYXlcIixcblx0XCJTYXR1cmRheVwiLFxuXTtcblxuZnVuY3Rpb24gc2xpY2UzKHN0cikge1xuXHRyZXR1cm4gc3RyLnNsaWNlKDAsIDMpO1xufVxuXG5jb25zdCBkYXlzMyA9ICBkYXlzLm1hcChzbGljZTMpO1xuXG5jb25zdCBtb250aHMzID0gIG1vbnRocy5tYXAoc2xpY2UzKTtcblxuY29uc3QgZW5nTmFtZXMgPSB7XG5cdE1NTU06IG1vbnRocyxcblx0TU1NOiAgbW9udGhzMyxcblx0V1dXVzogZGF5cyxcblx0V1dXOiAgZGF5czMsXG59O1xuXG5mdW5jdGlvbiB6ZXJvUGFkMihpbnQpIHtcblx0cmV0dXJuIChpbnQgPCAxMCA/ICcwJyA6ICcnKSArIGludDtcbn1cblxuZnVuY3Rpb24gemVyb1BhZDMoaW50KSB7XG5cdHJldHVybiAoaW50IDwgMTAgPyAnMDAnIDogaW50IDwgMTAwID8gJzAnIDogJycpICsgaW50O1xufVxuXG4vKlxuZnVuY3Rpb24gc3VmZml4KGludCkge1xuXHRsZXQgbW9kMTAgPSBpbnQgJSAxMDtcblxuXHRyZXR1cm4gaW50ICsgKFxuXHRcdG1vZDEwID09IDEgJiYgaW50ICE9IDExID8gXCJzdFwiIDpcblx0XHRtb2QxMCA9PSAyICYmIGludCAhPSAxMiA/IFwibmRcIiA6XG5cdFx0bW9kMTAgPT0gMyAmJiBpbnQgIT0gMTMgPyBcInJkXCIgOiBcInRoXCJcblx0KTtcbn1cbiovXG5cbmNvbnN0IGdldEZ1bGxZZWFyID0gJ2dldEZ1bGxZZWFyJztcbmNvbnN0IGdldE1vbnRoID0gJ2dldE1vbnRoJztcbmNvbnN0IGdldERhdGUgPSAnZ2V0RGF0ZSc7XG5jb25zdCBnZXREYXkgPSAnZ2V0RGF5JztcbmNvbnN0IGdldEhvdXJzID0gJ2dldEhvdXJzJztcbmNvbnN0IGdldE1pbnV0ZXMgPSAnZ2V0TWludXRlcyc7XG5jb25zdCBnZXRTZWNvbmRzID0gJ2dldFNlY29uZHMnO1xuY29uc3QgZ2V0TWlsbGlzZWNvbmRzID0gJ2dldE1pbGxpc2Vjb25kcyc7XG5cbmNvbnN0IHN1YnMgPSB7XG5cdC8vIDIwMTlcblx0WVlZWTpcdGQgPT4gZFtnZXRGdWxsWWVhcl0oKSxcblx0Ly8gMTlcblx0WVk6XHRcdGQgPT4gKGRbZ2V0RnVsbFllYXJdKCkrJycpLnNsaWNlKDIpLFxuXHQvLyBKdWx5XG5cdE1NTU06XHQoZCwgbmFtZXMpID0+IG5hbWVzLk1NTU1bZFtnZXRNb250aF0oKV0sXG5cdC8vIEp1bFxuXHRNTU06XHQoZCwgbmFtZXMpID0+IG5hbWVzLk1NTVtkW2dldE1vbnRoXSgpXSxcblx0Ly8gMDdcblx0TU06XHRcdGQgPT4gemVyb1BhZDIoZFtnZXRNb250aF0oKSsxKSxcblx0Ly8gN1xuXHRNOlx0XHRkID0+IGRbZ2V0TW9udGhdKCkrMSxcblx0Ly8gMDlcblx0REQ6XHRcdGQgPT4gemVyb1BhZDIoZFtnZXREYXRlXSgpKSxcblx0Ly8gOVxuXHREOlx0XHRkID0+IGRbZ2V0RGF0ZV0oKSxcblx0Ly8gTW9uZGF5XG5cdFdXV1c6XHQoZCwgbmFtZXMpID0+IG5hbWVzLldXV1dbZFtnZXREYXldKCldLFxuXHQvLyBNb25cblx0V1dXOlx0KGQsIG5hbWVzKSA9PiBuYW1lcy5XV1dbZFtnZXREYXldKCldLFxuXHQvLyAwM1xuXHRISDpcdFx0ZCA9PiB6ZXJvUGFkMihkW2dldEhvdXJzXSgpKSxcblx0Ly8gM1xuXHRIOlx0XHRkID0+IGRbZ2V0SG91cnNdKCksXG5cdC8vIDkgKDEyaHIsIHVucGFkZGVkKVxuXHRoOlx0XHRkID0+IHtsZXQgaCA9IGRbZ2V0SG91cnNdKCk7IHJldHVybiBoID09IDAgPyAxMiA6IGggPiAxMiA/IGggLSAxMiA6IGg7fSxcblx0Ly8gQU1cblx0QUE6XHRcdGQgPT4gZFtnZXRIb3Vyc10oKSA+PSAxMiA/ICdQTScgOiAnQU0nLFxuXHQvLyBhbVxuXHRhYTpcdFx0ZCA9PiBkW2dldEhvdXJzXSgpID49IDEyID8gJ3BtJyA6ICdhbScsXG5cdC8vIGFcblx0YTpcdFx0ZCA9PiBkW2dldEhvdXJzXSgpID49IDEyID8gJ3AnIDogJ2EnLFxuXHQvLyAwOVxuXHRtbTpcdFx0ZCA9PiB6ZXJvUGFkMihkW2dldE1pbnV0ZXNdKCkpLFxuXHQvLyA5XG5cdG06XHRcdGQgPT4gZFtnZXRNaW51dGVzXSgpLFxuXHQvLyAwOVxuXHRzczpcdFx0ZCA9PiB6ZXJvUGFkMihkW2dldFNlY29uZHNdKCkpLFxuXHQvLyA5XG5cdHM6XHRcdGQgPT4gZFtnZXRTZWNvbmRzXSgpLFxuXHQvLyAzNzRcblx0ZmZmOlx0ZCA9PiB6ZXJvUGFkMyhkW2dldE1pbGxpc2Vjb25kc10oKSksXG59O1xuXG5mdW5jdGlvbiBmbXREYXRlKHRwbCwgbmFtZXMpIHtcblx0bmFtZXMgPSBuYW1lcyB8fCBlbmdOYW1lcztcblx0bGV0IHBhcnRzID0gW107XG5cblx0bGV0IFIgPSAvXFx7KFthLXpdKylcXH18W157XSsvZ2ksIG07XG5cblx0d2hpbGUgKG0gPSBSLmV4ZWModHBsKSlcblx0XHRwYXJ0cy5wdXNoKG1bMF1bMF0gPT0gJ3snID8gc3Vic1ttWzFdXSA6IG1bMF0pO1xuXG5cdHJldHVybiBkID0+IHtcblx0XHRsZXQgb3V0ID0gJyc7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKVxuXHRcdFx0b3V0ICs9IHR5cGVvZiBwYXJ0c1tpXSA9PSBcInN0cmluZ1wiID8gcGFydHNbaV0gOiBwYXJ0c1tpXShkLCBuYW1lcyk7XG5cblx0XHRyZXR1cm4gb3V0O1xuXHR9XG59XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE1MTQxNzYyL2hvdy10by1pbml0aWFsaXplLWEtamF2YXNjcmlwdC1kYXRlLXRvLWEtcGFydGljdWxhci10aW1lLXpvbmUvNTM2NTIxMzEjNTM2NTIxMzFcbmZ1bmN0aW9uIHR6RGF0ZShkYXRlLCB0eikge1xuXHRsZXQgZGF0ZTI7XG5cblx0Ly8gcGVyZiBvcHRpbWl6YXRpb25cblx0aWYgKHR6ID09ICdFdGMvVVRDJylcblx0XHRkYXRlMiA9IG5ldyBEYXRlKCtkYXRlICsgZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNmU0KTtcblx0ZWxzZSB7XG5cdFx0ZGF0ZTIgPSBuZXcgRGF0ZShkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHt0aW1lWm9uZTogdHp9KSk7XG5cdFx0ZGF0ZTIuc2V0TWlsbGlzZWNvbmRzKGRhdGVbZ2V0TWlsbGlzZWNvbmRzXSgpKTtcblx0fVxuXG5cdHJldHVybiBkYXRlMjtcbn1cblxuLy9leHBvcnQgY29uc3Qgc2VyaWVzID0gW107XG5cbi8vIGRlZmF1bHQgZm9ybWF0dGVyczpcblxuZnVuY3Rpb24gZ2VuSW5jcnMobWluRXhwLCBtYXhFeHAsIG11bHRzKSB7XG5cdGxldCBpbmNycyA9IFtdO1xuXG5cdGZvciAobGV0IGV4cCA9IG1pbkV4cDsgZXhwIDwgbWF4RXhwOyBleHArKykge1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbXVsdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBpbmNyID0gbXVsdHNbaV0gKiBwb3coMTAsIGV4cCk7XG5cdFx0XHRpbmNycy5wdXNoKCtpbmNyLnRvRml4ZWQoYWJzKGV4cCkpKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gaW5jcnM7XG59XG5cbmNvbnN0IGluY3JNdWx0cyA9IFsxLDIsNV07XG5cbmNvbnN0IGRlY0luY3JzID0gZ2VuSW5jcnMoLTEyLCAwLCBpbmNyTXVsdHMpO1xuXG5jb25zdCBpbnRJbmNycyA9IGdlbkluY3JzKDAsIDEyLCBpbmNyTXVsdHMpO1xuXG5jb25zdCBudW1JbmNycyA9IGRlY0luY3JzLmNvbmNhdChpbnRJbmNycyk7XG5cbmxldCBzID0gMSxcblx0bSA9IDYwLFxuXHRoID0gbSAqIG0sXG5cdGQgPSBoICogMjQsXG5cdG1vID0gZCAqIDMwLFxuXHR5ID0gZCAqIDM2NTtcblxuLy8gc3RhcnRpbmcgYmVsb3cgMWUtMyBpcyBhIGhhY2sgdG8gYWxsb3cgdGhlIGluY3IgZmluZGVyIHRvIGNob29zZSAmIGJhaWwgb3V0IGF0IGluY3IgPCAxbXNcbmNvbnN0IHRpbWVJbmNycyA9ICBbNWUtNF0uY29uY2F0KGdlbkluY3JzKC0zLCAwLCBpbmNyTXVsdHMpLCBbXG5cdC8vIG1pbnV0ZSBkaXZpc29ycyAoIyBvZiBzZWNzKVxuXHQxLFxuXHQ1LFxuXHQxMCxcblx0MTUsXG5cdDMwLFxuXHQvLyBob3VyIGRpdmlzb3JzICgjIG9mIG1pbnMpXG5cdG0sXG5cdG0gKiA1LFxuXHRtICogMTAsXG5cdG0gKiAxNSxcblx0bSAqIDMwLFxuXHQvLyBkYXkgZGl2aXNvcnMgKCMgb2YgaHJzKVxuXHRoLFxuXHRoICogMixcblx0aCAqIDMsXG5cdGggKiA0LFxuXHRoICogNixcblx0aCAqIDgsXG5cdGggKiAxMixcblx0Ly8gbW9udGggZGl2aXNvcnMgVE9ETzogbmVlZCBtb3JlP1xuXHRkLFxuXHRkICogMixcblx0ZCAqIDMsXG5cdGQgKiA0LFxuXHRkICogNSxcblx0ZCAqIDYsXG5cdGQgKiA3LFxuXHRkICogOCxcblx0ZCAqIDksXG5cdGQgKiAxMCxcblx0ZCAqIDE1LFxuXHQvLyB5ZWFyIGRpdmlzb3JzICgjIG1vbnRocywgYXBwcm94KVxuXHRtbyxcblx0bW8gKiAyLFxuXHRtbyAqIDMsXG5cdG1vICogNCxcblx0bW8gKiA2LFxuXHQvLyBjZW50dXJ5IGRpdmlzb3JzXG5cdHksXG5cdHkgKiAyLFxuXHR5ICogNSxcblx0eSAqIDEwLFxuXHR5ICogMjUsXG5cdHkgKiA1MCxcblx0eSAqIDEwMCxcbl0pO1xuXG5mdW5jdGlvbiB0aW1lQXhpc1N0YW1wcyhzdGFtcENmZywgZm10RGF0ZSkge1xuXHRyZXR1cm4gc3RhbXBDZmcubWFwKHMgPT4gW1xuXHRcdHNbMF0sXG5cdFx0Zm10RGF0ZShzWzFdKSxcblx0XHRzWzJdLFxuXHRcdGZtdERhdGUoc1s0XSA/IHNbMV0gKyBzWzNdIDogc1szXSksXG5cdF0pO1xufVxuXG5jb25zdCB5eXl5ID0gXCJ7WVlZWX1cIjtcbmNvbnN0IE5MeXl5eSA9IFwiXFxuXCIgKyB5eXl5O1xuY29uc3QgbWQgPSBcIntNfS97RH1cIjtcbmNvbnN0IE5MbWQgPSBcIlxcblwiICsgbWQ7XG5cbmNvbnN0IGFhID0gXCJ7YWF9XCI7XG5jb25zdCBobW0gPSBcIntofTp7bW19XCI7XG5jb25zdCBobW1hYSA9IGhtbSArIGFhO1xuY29uc3Qgc3MgPSBcIjp7c3N9XCI7XG5cbi8vIFswXTogbWluaW11bSBudW0gc2VjcyBpbiB0aGUgdGljayBpbmNyXG4vLyBbMV06IG5vcm1hbCB0aWNrIGZvcm1hdFxuLy8gWzJdOiB3aGVuIGEgZGlmZmVyaW5nIDx4PiBpcyBlbmNvdW50ZXJlZCAtIDE6IHNlYywgMjogbWluLCAzOiBob3VyLCA0OiBkYXksIDU6IHdlZWssIDY6IG1vbnRoLCA3OiB5ZWFyXG4vLyBbM106IHVzZSBhIGxvbmdlciBtb3JlIGNvbnRleHR1YWwgZm9ybWF0XG4vLyBbNF06IG1vZGVzOiAwOiByZXBsYWNlIFsxXSAtPiBbM10sIDE6IGNvbmNhdCBbMV0gKyBbM11cbmNvbnN0IF90aW1lQXhpc1N0YW1wcyA9IFtcblx0W3ksICAgICAgICB5eXl5LCAgICAgICAgICAgIDcsICAgXCJcIiwgICAgICAgICAgICAgICAgICAgIDFdLFxuXHRbZCAqIDI4LCAgIFwie01NTX1cIiwgICAgICAgICA3LCAgIE5MeXl5eSwgICAgICAgICAgICAgICAgMV0sXG5cdFtkLCAgICAgICAgbWQsICAgICAgICAgICAgICA3LCAgIE5MeXl5eSwgICAgICAgICAgICAgICAgMV0sXG5cdFtoLCAgICAgICAgXCJ7aH1cIiArIGFhLCAgICAgIDQsICAgTkxtZCwgICAgICAgICAgICAgICAgICAxXSxcblx0W20sICAgICAgICBobW1hYSwgICAgICAgICAgIDQsICAgTkxtZCwgICAgICAgICAgICAgICAgICAxXSxcblx0W3MsICAgICAgICBzcywgICAgICAgICAgICAgIDIsICAgTkxtZCAgKyBcIiBcIiArIGhtbWFhLCAgIDFdLFxuXHRbMWUtMywgICAgIHNzICsgXCIue2ZmZn1cIiwgICAyLCAgIE5MbWQgICsgXCIgXCIgKyBobW1hYSwgICAxXSxcbl07XG5cbi8vIFRPRE86IHdpbGwgbmVlZCB0byBhY2NlcHQgc3BhY2VzW10gYW5kIHB1bGwgaW5jciBpbnRvIHRoZSBsb29wIHdoZW4gZ3JpZCB3aWxsIGJlIG5vbi11bmlmb3JtLCBlZyBmb3IgbG9nIHNjYWxlcy5cbi8vIGN1cnJlbnRseSB3ZSBpZ25vcmUgdGhpcyBmb3IgbW9udGhzIHNpbmNlIHRoZXkncmUgKm5lYXJseSogdW5pZm9ybSBhbmQgdGhlIGFkZGVkIGNvbXBsZXhpdHkgaXMgbm90IHdvcnRoIGl0XG5mdW5jdGlvbiB0aW1lQXhpc1ZhbHModHpEYXRlLCBzdGFtcHMpIHtcblx0cmV0dXJuIChzZWxmLCBzcGxpdHMsIHNwYWNlLCBpbmNyKSA9PiB7XG5cdFx0bGV0IHMgPSBzdGFtcHMuZmluZChlID0+IGluY3IgPj0gZVswXSkgfHwgc3RhbXBzW3N0YW1wcy5sZW5ndGggLSAxXTtcblxuXHRcdC8vIHRoZXNlIHRyYWNrIGJvdW5kYXJpZXMgd2hlbiBhIGZ1bGwgbGFiZWwgaXMgbmVlZGVkIGFnYWluXG5cdFx0bGV0IHByZXZZZWFyID0gbnVsbDtcblx0XHRsZXQgcHJldkRhdGUgPSBudWxsO1xuXHRcdGxldCBwcmV2TWludSA9IG51bGw7XG5cblx0XHRyZXR1cm4gc3BsaXRzLm1hcCgoc3BsaXQsIGkpID0+IHtcblx0XHRcdGxldCBkYXRlID0gdHpEYXRlKHNwbGl0KTtcblxuXHRcdFx0bGV0IG5ld1llYXIgPSBkYXRlW2dldEZ1bGxZZWFyXSgpO1xuXHRcdFx0bGV0IG5ld0RhdGUgPSBkYXRlW2dldERhdGVdKCk7XG5cdFx0XHRsZXQgbmV3TWludSA9IGRhdGVbZ2V0TWludXRlc10oKTtcblxuXHRcdFx0bGV0IGRpZmZZZWFyID0gbmV3WWVhciAhPSBwcmV2WWVhcjtcblx0XHRcdGxldCBkaWZmRGF0ZSA9IG5ld0RhdGUgIT0gcHJldkRhdGU7XG5cdFx0XHRsZXQgZGlmZk1pbnUgPSBuZXdNaW51ICE9IHByZXZNaW51O1xuXG5cdFx0XHRsZXQgc3RhbXAgPSBzWzJdID09IDcgJiYgZGlmZlllYXIgfHwgc1syXSA9PSA0ICYmIGRpZmZEYXRlIHx8IHNbMl0gPT0gMiAmJiBkaWZmTWludSA/IHNbM10gOiBzWzFdO1xuXG5cdFx0XHRwcmV2WWVhciA9IG5ld1llYXI7XG5cdFx0XHRwcmV2RGF0ZSA9IG5ld0RhdGU7XG5cdFx0XHRwcmV2TWludSA9IG5ld01pbnU7XG5cblx0XHRcdHJldHVybiBzdGFtcChkYXRlKTtcblx0XHR9KTtcblx0fVxufVxuXG5mdW5jdGlvbiBta0RhdGUoeSwgbSwgZCkge1xuXHRyZXR1cm4gbmV3IERhdGUoeSwgbSwgZCk7XG59XG5cbi8vIHRoZSBlbnN1cmVzIHRoYXQgYXhpcyB0aWNrcywgdmFsdWVzICYgZ3JpZCBhcmUgYWxpZ25lZCB0byBsb2dpY2FsIHRlbXBvcmFsIGJyZWFrcG9pbnRzIGFuZCBub3QgYW4gYXJiaXRyYXJ5IHRpbWVzdGFtcFxuLy8gaHR0cHM6Ly93d3cudGltZWFuZGRhdGUuY29tL3RpbWUvZHN0L1xuLy8gaHR0cHM6Ly93d3cudGltZWFuZGRhdGUuY29tL3RpbWUvZHN0LzIwMTkuaHRtbFxuLy8gaHR0cHM6Ly93d3cuZXBvY2hjb252ZXJ0ZXIuY29tL3RpbWV6b25lc1xuZnVuY3Rpb24gdGltZUF4aXNTcGxpdHModHpEYXRlKSB7XG5cdHJldHVybiAoc2VsZiwgc2NhbGVNaW4sIHNjYWxlTWF4LCBpbmNyLCBwY3RTcGFjZSkgPT4ge1xuXHRcdGxldCBzcGxpdHMgPSBbXTtcblx0XHRsZXQgaXNNbyA9IGluY3IgPj0gbW8gJiYgaW5jciA8IHk7XG5cblx0XHQvLyBnZXQgdGhlIHRpbWV6b25lLWFkanVzdGVkIGRhdGVcblx0XHRsZXQgbWluRGF0ZSA9IHR6RGF0ZShzY2FsZU1pbik7XG5cdFx0bGV0IG1pbkRhdGVUcyA9IG1pbkRhdGUgLyAxZTM7XG5cblx0XHQvLyBnZXQgdHMgb2YgMTJhbSAodGhpcyBsYW5kcyB1cyBhdCBvciBiZWZvcmUgdGhlIG9yaWdpbmFsIHNjYWxlTWluKVxuXHRcdGxldCBtaW5NaW4gPSBta0RhdGUobWluRGF0ZVtnZXRGdWxsWWVhcl0oKSwgbWluRGF0ZVtnZXRNb250aF0oKSwgaXNNbyA/IDEgOiBtaW5EYXRlW2dldERhdGVdKCkpO1xuXHRcdGxldCBtaW5NaW5UcyA9IG1pbk1pbiAvIDFlMztcblxuXHRcdGlmIChpc01vKSB7XG5cdFx0XHRsZXQgbW9JbmNyID0gaW5jciAvIG1vO1xuXHRcdC8vXHRsZXQgdHpPZmZzZXQgPSBzY2FsZU1pbiAtIG1pbkRhdGVUcztcdFx0Ly8gbmVlZGVkP1xuXHRcdFx0bGV0IHNwbGl0ID0gbWluRGF0ZVRzID09IG1pbk1pblRzID8gbWluRGF0ZVRzIDogbWtEYXRlKG1pbk1pbltnZXRGdWxsWWVhcl0oKSwgbWluTWluW2dldE1vbnRoXSgpICsgbW9JbmNyLCAxKSAvIDFlMztcblx0XHRcdGxldCBzcGxpdERhdGUgPSBuZXcgRGF0ZShzcGxpdCAqIDFlMyk7XG5cdFx0XHRsZXQgYmFzZVllYXIgPSBzcGxpdERhdGVbZ2V0RnVsbFllYXJdKCk7XG5cdFx0XHRsZXQgYmFzZU1vbnRoID0gc3BsaXREYXRlW2dldE1vbnRoXSgpO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgc3BsaXQgPD0gc2NhbGVNYXg7IGkrKykge1xuXHRcdFx0XHRsZXQgbmV4dCA9IG1rRGF0ZShiYXNlWWVhciwgYmFzZU1vbnRoICsgbW9JbmNyICogaSwgMSk7XG5cdFx0XHRcdGxldCBvZmZzID0gbmV4dCAtIHR6RGF0ZShuZXh0IC8gMWUzKTtcblxuXHRcdFx0XHRzcGxpdCA9ICgrbmV4dCArIG9mZnMpIC8gMWUzO1xuXG5cdFx0XHRcdGlmIChzcGxpdCA8PSBzY2FsZU1heClcblx0XHRcdFx0XHRzcGxpdHMucHVzaChzcGxpdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0bGV0IGluY3IwID0gaW5jciA+PSBkID8gZCA6IGluY3I7XG5cdFx0XHRsZXQgdHpPZmZzZXQgPSBmbG9vcihzY2FsZU1pbikgLSBmbG9vcihtaW5EYXRlVHMpO1xuXHRcdFx0bGV0IHNwbGl0ID0gbWluTWluVHMgKyB0ek9mZnNldCArIGluY3JSb3VuZFVwKG1pbkRhdGVUcyAtIG1pbk1pblRzLCBpbmNyMCk7XG5cdFx0XHRzcGxpdHMucHVzaChzcGxpdCk7XG5cblx0XHRcdGxldCBkYXRlMCA9IHR6RGF0ZShzcGxpdCk7XG5cblx0XHRcdGxldCBwcmV2SG91ciA9IGRhdGUwW2dldEhvdXJzXSgpICsgKGRhdGUwW2dldE1pbnV0ZXNdKCkgLyBtKSArIChkYXRlMFtnZXRTZWNvbmRzXSgpIC8gaCk7XG5cdFx0XHRsZXQgaW5jckhvdXJzID0gaW5jciAvIGg7XG5cblx0XHRcdHdoaWxlICgxKSB7XG5cdFx0XHRcdHNwbGl0ID0gcm91bmQzKHNwbGl0ICsgaW5jcik7XG5cblx0XHRcdFx0bGV0IGV4cGVjdGVkSG91ciA9IGZsb29yKHJvdW5kNihwcmV2SG91ciArIGluY3JIb3VycykpICUgMjQ7XG5cdFx0XHRcdGxldCBzcGxpdERhdGUgPSB0ekRhdGUoc3BsaXQpO1xuXHRcdFx0XHRsZXQgYWN0dWFsSG91ciA9IHNwbGl0RGF0ZS5nZXRIb3VycygpO1xuXG5cdFx0XHRcdGxldCBkc3RTaGlmdCA9IGFjdHVhbEhvdXIgLSBleHBlY3RlZEhvdXI7XG5cblx0XHRcdFx0aWYgKGRzdFNoaWZ0ID4gMSlcblx0XHRcdFx0XHRkc3RTaGlmdCA9IC0xO1xuXG5cdFx0XHRcdHNwbGl0IC09IGRzdFNoaWZ0ICogaDtcblxuXHRcdFx0XHRpZiAoc3BsaXQgPiBzY2FsZU1heClcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRwcmV2SG91ciA9IChwcmV2SG91ciArIGluY3JIb3VycykgJSAyNDtcblxuXHRcdFx0XHQvLyBhZGQgYSB0aWNrIG9ubHkgaWYgaXQncyBmdXJ0aGVyIHRoYW4gNzAlIG9mIHRoZSBtaW4gYWxsb3dlZCBsYWJlbCBzcGFjaW5nXG5cdFx0XHRcdGxldCBwcmV2U3BsaXQgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRsZXQgcGN0SW5jciA9IHJvdW5kMygoc3BsaXQgLSBwcmV2U3BsaXQpIC8gaW5jcik7XG5cblx0XHRcdFx0aWYgKHBjdEluY3IgKiBwY3RTcGFjZSA+PSAuNylcblx0XHRcdFx0XHRzcGxpdHMucHVzaChzcGxpdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNwbGl0cztcblx0fVxufVxuXG5mdW5jdGlvbiB0aW1lU2VyaWVzU3RhbXAoc3RhbXBDZmcsIGZtdERhdGUpIHtcblx0cmV0dXJuIGZtdERhdGUoc3RhbXBDZmcpO1xufVxuY29uc3QgX3RpbWVTZXJpZXNTdGFtcCA9ICd7WVlZWX0te01NfS17RER9IHtofTp7bW19e2FhfSc7XG5cbmZ1bmN0aW9uIHRpbWVTZXJpZXNWYWwodHpEYXRlLCBzdGFtcCkge1xuXHRyZXR1cm4gKHNlbGYsIHZhbCkgPT4gc3RhbXAodHpEYXRlKHZhbCkpO1xufVxuXG5mdW5jdGlvbiBjdXJzb3JQb2ludChzZWxmLCBzaSkge1xuXHRsZXQgcyA9IHNlbGYuc2VyaWVzW3NpXTtcblxuXHRsZXQgcHQgPSBwbGFjZURpdigpO1xuXG5cdHB0LnN0eWxlLmJhY2tncm91bmQgPSBzLnN0cm9rZSB8fCBoZXhCbGFjaztcblxuXHRsZXQgZGlhID0gcHREaWEocy53aWR0aCwgMSk7XG5cdGxldCBtYXIgPSAoZGlhIC0gMSkgLyAtMjtcblxuXHRzZXRTdHlsZVB4KHB0LCBXSURUSCwgZGlhKTtcblx0c2V0U3R5bGVQeChwdCwgSEVJR0hULCBkaWEpO1xuXHRzZXRTdHlsZVB4KHB0LCBcIm1hcmdpbkxlZnRcIiwgbWFyKTtcblx0c2V0U3R5bGVQeChwdCwgXCJtYXJnaW5Ub3BcIiwgbWFyKTtcblxuXHRyZXR1cm4gcHQ7XG59XG5cbmNvbnN0IGN1cnNvck9wdHMgPSB7XG5cdHNob3c6IHRydWUsXG5cdHg6IHRydWUsXG5cdHk6IHRydWUsXG5cdGxvY2s6IGZhbHNlLFxuXHRwb2ludHM6IHtcblx0XHRzaG93OiBjdXJzb3JQb2ludCxcblx0fSxcblxuXHRkcmFnOiB7XG5cdFx0c2V0U2NhbGU6IHRydWUsXG5cdFx0eDogdHJ1ZSxcblx0XHR5OiBmYWxzZSxcblx0XHRkaXN0OiAwLFxuXHRcdHVuaTogbnVsbCxcblx0XHRfeDogZmFsc2UsXG5cdFx0X3k6IGZhbHNlLFxuXHR9LFxuXG5cdGZvY3VzOiB7XG5cdFx0cHJveDogLTEsXG5cdH0sXG5cblx0bG9ja2VkOiBmYWxzZSxcblx0bGVmdDogLTEwLFxuXHR0b3A6IC0xMCxcblx0aWR4OiBudWxsLFxufTtcblxuY29uc3QgZ3JpZCA9IHtcblx0c2hvdzogdHJ1ZSxcblx0c3Ryb2tlOiBcInJnYmEoMCwwLDAsMC4wNylcIixcblx0d2lkdGg6IDIsXG4vL1x0ZGFzaDogW10sXG59O1xuXG5jb25zdCB0aWNrcyA9IGFzc2lnbih7fSwgZ3JpZCwge3NpemU6IDEwfSk7XG5cbmNvbnN0IGZvbnQgICAgICA9ICcxMnB4IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgQXJpYWwsIFwiTm90byBTYW5zXCIsIHNhbnMtc2VyaWYsIFwiQXBwbGUgQ29sb3IgRW1vamlcIiwgXCJTZWdvZSBVSSBFbW9qaVwiLCBcIlNlZ29lIFVJIFN5bWJvbFwiLCBcIk5vdG8gQ29sb3IgRW1vamlcIic7XG5jb25zdCBsYWJlbEZvbnQgPSBcImJvbGQgXCIgKyBmb250O1xuY29uc3QgbGluZU11bHQgPSAxLjU7XHRcdC8vIGZvbnQtc2l6ZSBtdWx0aXBsaWVyXG5cbmNvbnN0IHhBeGlzT3B0cyA9IHtcblx0dHlwZTogXCJ4XCIsXG5cdHNob3c6IHRydWUsXG5cdHNjYWxlOiBcInhcIixcblx0c3BhY2U6IDUwLFxuXHRnYXA6IDUsXG5cdHNpemU6IDUwLFxuXHRsYWJlbFNpemU6IDMwLFxuXHRsYWJlbEZvbnQsXG5cdHNpZGU6IDIsXG4vL1x0Y2xhc3M6IFwieC12YWxzXCIsXG4vL1x0aW5jcnM6IHRpbWVJbmNycyxcbi8vXHR2YWx1ZXM6IHRpbWVWYWxzLFxuXHRncmlkLFxuXHR0aWNrcyxcblx0Zm9udCxcblx0cm90YXRlOiAwLFxufTtcblxuY29uc3QgbnVtU2VyaWVzTGFiZWwgPSBcIlZhbHVlXCI7XG5jb25zdCB0aW1lU2VyaWVzTGFiZWwgPSBcIlRpbWVcIjtcblxuY29uc3QgeFNlcmllc09wdHMgPSB7XG5cdHNob3c6IHRydWUsXG5cdHNjYWxlOiBcInhcIixcbi8vXHRsYWJlbDogXCJUaW1lXCIsXG4vL1x0dmFsdWU6IHYgPT4gc3RhbXAobmV3IERhdGUodiAqIDFlMykpLFxuXG5cdC8vIGludGVybmFsIGNhY2hlc1xuXHRtaW46IGluZixcblx0bWF4OiAtaW5mLFxuXHRpZHhzOiBbXSxcbn07XG5cbi8vIGFsdGVybmF0aXZlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjI1NDg5NlxubGV0IGZtdE51bSA9IG5ldyBJbnRsLk51bWJlckZvcm1hdChuYXZpZ2F0b3IubGFuZ3VhZ2UpO1xuXG5mdW5jdGlvbiBudW1BeGlzVmFscyhzZWxmLCBzcGxpdHMsIHNwYWNlLCBpbmNyKSB7XG5cdHJldHVybiBzcGxpdHMubWFwKGZtdE51bS5mb3JtYXQpO1xufVxuXG5mdW5jdGlvbiBudW1BeGlzU3BsaXRzKHNlbGYsIHNjYWxlTWluLCBzY2FsZU1heCwgaW5jciwgcGN0U3BhY2UsIGZvcmNlTWluKSB7XG5cdHNjYWxlTWluID0gZm9yY2VNaW4gPyBzY2FsZU1pbiA6ICtpbmNyUm91bmRVcChzY2FsZU1pbiwgaW5jcikudG9GaXhlZCgxMik7XG5cblx0bGV0IHNwbGl0cyA9IFtdO1xuXG5cdGZvciAobGV0IHZhbCA9IHNjYWxlTWluOyB2YWwgPD0gc2NhbGVNYXg7IHZhbCA9ICsodmFsICsgaW5jcikudG9GaXhlZCgxMikpXG5cdFx0c3BsaXRzLnB1c2godmFsKTtcblxuXHRyZXR1cm4gc3BsaXRzO1xufVxuXG5mdW5jdGlvbiBudW1TZXJpZXNWYWwoc2VsZiwgdmFsKSB7XG5cdHJldHVybiB2YWw7XG59XG5cbmNvbnN0IHlBeGlzT3B0cyA9IHtcblx0dHlwZTogXCJ5XCIsXG5cdHNob3c6IHRydWUsXG5cdHNjYWxlOiBcInlcIixcblx0c3BhY2U6IDQwLFxuXHRnYXA6IDUsXG5cdHNpemU6IDUwLFxuXHRsYWJlbFNpemU6IDMwLFxuXHRsYWJlbEZvbnQsXG5cdHNpZGU6IDMsXG4vL1x0Y2xhc3M6IFwieS12YWxzXCIsXG4vL1x0aW5jcnM6IG51bUluY3JzLFxuLy9cdHZhbHVlczogKHZhbHMsIHNwYWNlKSA9PiB2YWxzLFxuXHRncmlkLFxuXHR0aWNrcyxcblx0Zm9udCxcblx0cm90YXRlOiAwLFxufTtcblxuLy8gdGFrZXMgc3Ryb2tlIHdpZHRoXG5mdW5jdGlvbiBwdERpYSh3aWR0aCwgbXVsdCkge1xuXHRsZXQgZGlhID0gMyArICh3aWR0aCB8fCAxKSAqIDI7XG5cdHJldHVybiByb3VuZDMoZGlhICogbXVsdCk7XG59XG5cbmZ1bmN0aW9uIHNlcmllc1BvaW50cyhzZWxmLCBzaSkge1xuXHRjb25zdCBkaWEgPSBwdERpYShzZWxmLnNlcmllc1tzaV0ud2lkdGgsIHB4UmF0aW8pO1xuXHRsZXQgbWF4UHRzID0gc2VsZi5iYm94LndpZHRoIC8gZGlhIC8gMjtcblx0bGV0IGlkeHMgPSBzZWxmLnNlcmllc1swXS5pZHhzO1xuXHRyZXR1cm4gaWR4c1sxXSAtIGlkeHNbMF0gPD0gbWF4UHRzO1xufVxuXG5jb25zdCB5U2VyaWVzT3B0cyA9IHtcbi8vXHR0eXBlOiBcIm5cIixcblx0c2NhbGU6IFwieVwiLFxuXHRzaG93OiB0cnVlLFxuXHRiYW5kOiBmYWxzZSxcblx0c3BhbkdhcHM6IGZhbHNlLFxuXHRhbHBoYTogMSxcblx0cG9pbnRzOiB7XG5cdFx0c2hvdzogc2VyaWVzUG9pbnRzLFxuXHQvL1x0c3Ryb2tlOiBcIiMwMDBcIixcblx0Ly9cdGZpbGw6IFwiI2ZmZlwiLFxuXHQvL1x0d2lkdGg6IDEsXG5cdC8vXHRzaXplOiAxMCxcblx0fSxcbi8vXHRsYWJlbDogXCJWYWx1ZVwiLFxuLy9cdHZhbHVlOiB2ID0+IHYsXG5cdHZhbHVlczogbnVsbCxcblxuXHQvLyBpbnRlcm5hbCBjYWNoZXNcblx0bWluOiBpbmYsXG5cdG1heDogLWluZixcblx0aWR4czogW10sXG5cblx0cGF0aDogbnVsbCxcblx0Y2xpcDogbnVsbCxcbn07XG5cbmNvbnN0IHhTY2FsZU9wdHMgPSB7XG5cdHRpbWU6IHRydWUsXG5cdGF1dG86IGZhbHNlLFxuXHRkaXN0cjogMSxcblx0bWluOiBudWxsLFxuXHRtYXg6IG51bGwsXG59O1xuXG5jb25zdCB5U2NhbGVPcHRzID0gYXNzaWduKHt9LCB4U2NhbGVPcHRzLCB7XG5cdHRpbWU6IGZhbHNlLFxuXHRhdXRvOiB0cnVlLFxufSk7XG5cbmNvbnN0IHN5bmNzID0ge307XG5cbmZ1bmN0aW9uIF9zeW5jKG9wdHMpIHtcblx0bGV0IGNsaWVudHMgPSBbXTtcblxuXHRyZXR1cm4ge1xuXHRcdHN1YihjbGllbnQpIHtcblx0XHRcdGNsaWVudHMucHVzaChjbGllbnQpO1xuXHRcdH0sXG5cdFx0dW5zdWIoY2xpZW50KSB7XG5cdFx0XHRjbGllbnRzID0gY2xpZW50cy5maWx0ZXIoYyA9PiBjICE9IGNsaWVudCk7XG5cdFx0fSxcblx0XHRwdWIodHlwZSwgc2VsZiwgeCwgeSwgdywgaCwgaSkge1xuXHRcdFx0aWYgKGNsaWVudHMubGVuZ3RoID4gMSkge1xuXHRcdFx0XHRjbGllbnRzLmZvckVhY2goY2xpZW50ID0+IHtcblx0XHRcdFx0XHRjbGllbnQgIT0gc2VsZiAmJiBjbGllbnQucHViKHR5cGUsIHNlbGYsIHgsIHksIHcsIGgsIGkpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIHNldERlZmF1bHRzKGQsIHhvLCB5bywgaW5pdFkpIHtcblx0bGV0IGQyID0gaW5pdFkgPyBbZFswXSwgZFsxXV0uY29uY2F0KGQuc2xpY2UoMikpIDogW2RbMF1dLmNvbmNhdChkLnNsaWNlKDEpKTtcblx0cmV0dXJuIGQyLm1hcCgobywgaSkgPT4gc2V0RGVmYXVsdChvLCBpLCB4bywgeW8pKTtcbn1cblxuZnVuY3Rpb24gc2V0RGVmYXVsdChvLCBpLCB4bywgeW8pIHtcblx0cmV0dXJuIGFzc2lnbih7fSwgKGkgPT0gMCB8fCBvICYmIG8uc2lkZSAlIDIgPT0gMCA/IHhvIDogeW8pLCBvKTtcbn1cblxuZnVuY3Rpb24gZ2V0WVBvcyh2YWwsIHNjYWxlLCBoZ3QsIHRvcCkge1xuXHRsZXQgcGN0WSA9ICh2YWwgLSBzY2FsZS5taW4pIC8gKHNjYWxlLm1heCAtIHNjYWxlLm1pbik7XG5cdHJldHVybiB0b3AgKyAoMSAtIHBjdFkpICogaGd0O1xufVxuXG5mdW5jdGlvbiBnZXRYUG9zKHZhbCwgc2NhbGUsIHdpZCwgbGZ0KSB7XG5cdGxldCBwY3RYID0gKHZhbCAtIHNjYWxlLm1pbikgLyAoc2NhbGUubWF4IC0gc2NhbGUubWluKTtcblx0cmV0dXJuIGxmdCArIHBjdFggKiB3aWQ7XG59XG5cbmZ1bmN0aW9uIHNuYXBUaW1lWChzZWxmLCBkYXRhTWluLCBkYXRhTWF4KSB7XG5cdHJldHVybiBbZGF0YU1pbiwgZGF0YU1heCA+IGRhdGFNaW4gPyBkYXRhTWF4IDogZGF0YU1heCArIDg2NDAwXTtcbn1cblxuZnVuY3Rpb24gc25hcE51bVgoc2VsZiwgZGF0YU1pbiwgZGF0YU1heCkge1xuXHRjb25zdCBkZWx0YSA9IGRhdGFNYXggLSBkYXRhTWluO1xuXG5cdGlmIChkZWx0YSA9PSAwKSB7XG5cdFx0Y29uc3QgbWFnID0gbG9nMTAoZGVsdGEgfHwgYWJzKGRhdGFNYXgpIHx8IDEpO1xuXHRcdGNvbnN0IGV4cCA9IGZsb29yKG1hZykgKyAxO1xuXHRcdHJldHVybiBbZGF0YU1pbiwgaW5jclJvdW5kVXAoZGF0YU1heCwgcG93KDEwLCBleHApKV07XG5cdH1cblx0ZWxzZVxuXHRcdHJldHVybiBbZGF0YU1pbiwgZGF0YU1heF07XG59XG5cbi8vIHRoaXMgZW5zdXJlcyB0aGF0IG5vbi10ZW1wb3JhbC9udW1lcmljIHktYXhlcyBnZXQgbXVsdGlwbGUtc25hcHBlZCBwYWRkaW5nIGFkZGVkIGFib3ZlL2JlbG93XG4vLyBUT0RPOiBhbHNvIGFjY291bnQgZm9yIGluY3JzIHdoZW4gc25hcHBpbmcgdG8gZW5zdXJlIHRvcCBvZiBheGlzIGdldHMgYSB0aWNrICYgdmFsdWVcbmZ1bmN0aW9uIHNuYXBOdW1ZKHNlbGYsIGRhdGFNaW4sIGRhdGFNYXgpIHtcblx0cmV0dXJuIHJhbmdlTnVtKGRhdGFNaW4sIGRhdGFNYXgsIDAuMiwgdHJ1ZSk7XG59XG5cbi8vIGRpbSBpcyBsb2dpY2FsIChnZXRDbGllbnRCb3VuZGluZ1JlY3QpIHBpeGVscywgbm90IGNhbnZhcyBwaXhlbHNcbmZ1bmN0aW9uIGZpbmRJbmNyKHZhbERlbHRhLCBpbmNycywgZGltLCBtaW5TcGFjZSkge1xuXHRsZXQgcHhQZXJVbml0ID0gZGltIC8gdmFsRGVsdGE7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpbmNycy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBzcGFjZSA9IGluY3JzW2ldICogcHhQZXJVbml0O1xuXG5cdFx0aWYgKHNwYWNlID49IG1pblNwYWNlKVxuXHRcdFx0cmV0dXJuIFtpbmNyc1tpXSwgc3BhY2VdO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGZpbHRNb3VzZShlKSB7XG5cdHJldHVybiBlLmJ1dHRvbiA9PSAwO1xufVxuXG5mdW5jdGlvbiBweFJhdGlvRm9udChmb250KSB7XG5cdGxldCBmb250U2l6ZTtcblx0Zm9udCA9IGZvbnQucmVwbGFjZSgvXFxkKy8sIG0gPT4gKGZvbnRTaXplID0gcm91bmQobSAqIHB4UmF0aW8pKSk7XG5cdHJldHVybiBbZm9udCwgZm9udFNpemVdO1xufVxuXG5mdW5jdGlvbiB1UGxvdChvcHRzLCBkYXRhLCB0aGVuKSB7XG5cdGNvbnN0IHNlbGYgPSB7fTtcblxuXHRjb25zdCByb290ID0gc2VsZi5yb290ID0gcGxhY2VEaXYoXCJ1cGxvdFwiKTtcblxuXHRpZiAob3B0cy5pZCAhPSBudWxsKVxuXHRcdHJvb3QuaWQgPSBvcHRzLmlkO1xuXG5cdGFkZENsYXNzKHJvb3QsIG9wdHMuY2xhc3MpO1xuXG5cdGlmIChvcHRzLnRpdGxlKSB7XG5cdFx0bGV0IHRpdGxlID0gcGxhY2VEaXYoXCJ0aXRsZVwiLCByb290KTtcblx0XHR0aXRsZS50ZXh0Q29udGVudCA9IG9wdHMudGl0bGU7XG5cdH1cblxuXHRjb25zdCBjYW4gPSBwbGFjZVRhZyhcImNhbnZhc1wiKTtcblx0Y29uc3QgY3R4ID0gc2VsZi5jdHggPSBjYW4uZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdGNvbnN0IHdyYXAgPSBwbGFjZURpdihcIndyYXBcIiwgcm9vdCk7XG5cdGNvbnN0IHVuZGVyID0gcGxhY2VEaXYoXCJ1bmRlclwiLCB3cmFwKTtcblx0d3JhcC5hcHBlbmRDaGlsZChjYW4pO1xuXHRjb25zdCBvdmVyID0gcGxhY2VEaXYoXCJvdmVyXCIsIHdyYXApO1xuXG5cdG9wdHMgPSBjb3B5KG9wdHMpO1xuXG5cdChvcHRzLnBsdWdpbnMgfHwgW10pLmZvckVhY2gocCA9PiB7XG5cdFx0aWYgKHAub3B0cylcblx0XHRcdG9wdHMgPSBwLm9wdHMoc2VsZiwgb3B0cykgfHwgb3B0cztcblx0fSk7XG5cblx0bGV0IHJlYWR5ID0gZmFsc2U7XG5cblx0Y29uc3Qgc2VyaWVzICA9IHNlbGYuc2VyaWVzID0gc2V0RGVmYXVsdHMob3B0cy5zZXJpZXMgfHwgW10sIHhTZXJpZXNPcHRzLCB5U2VyaWVzT3B0cywgZmFsc2UpO1xuXHRjb25zdCBheGVzICAgID0gc2VsZi5heGVzICAgPSBzZXREZWZhdWx0cyhvcHRzLmF4ZXMgICB8fCBbXSwgeEF4aXNPcHRzLCAgIHlBeGlzT3B0cywgICAgdHJ1ZSk7XG5cdGNvbnN0IHNjYWxlcyAgPSBzZWxmLnNjYWxlcyA9IGFzc2lnbih7fSwge3g6IHhTY2FsZU9wdHMsIHk6IHlTY2FsZU9wdHN9LCBvcHRzLnNjYWxlcyk7XG5cblx0Y29uc3QgZ3V0dGVycyA9IGFzc2lnbih7XG5cdFx0eDogcm91bmQoeUF4aXNPcHRzLnNpemUgLyAyKSxcblx0XHR5OiByb3VuZCh4QXhpc09wdHMuc2l6ZSAvIDMpLFxuXHR9LCBvcHRzLmd1dHRlcnMpO1xuXG4vL1x0c2VsZi50eiA9IG9wdHMudHogfHwgSW50bC5EYXRlVGltZUZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLnRpbWVab25lO1xuXHRjb25zdCBfdHpEYXRlICA9ICAob3B0cy50ekRhdGUgfHwgKHRzID0+IG5ldyBEYXRlKHRzICogMWUzKSkpO1xuXHRjb25zdCBfZm10RGF0ZSA9ICAob3B0cy5mbXREYXRlIHx8IGZtdERhdGUpO1xuXG5cdGNvbnN0IF90aW1lQXhpc1NwbGl0cyA9ICB0aW1lQXhpc1NwbGl0cyhfdHpEYXRlKTtcblx0Y29uc3QgX3RpbWVBeGlzVmFscyAgID0gIHRpbWVBeGlzVmFscyhfdHpEYXRlLCB0aW1lQXhpc1N0YW1wcyhfdGltZUF4aXNTdGFtcHMsIF9mbXREYXRlKSk7XG5cdGNvbnN0IF90aW1lU2VyaWVzVmFsICA9ICB0aW1lU2VyaWVzVmFsKF90ekRhdGUsIHRpbWVTZXJpZXNTdGFtcChfdGltZVNlcmllc1N0YW1wLCBfZm10RGF0ZSkpO1xuXG5cdGNvbnN0IHBlbmRTY2FsZXMgPSB7fTtcblxuXHQvLyBleHBsaWNpdGx5LXNldCBpbml0aWFsIHNjYWxlc1xuXHRmb3IgKGxldCBrIGluIHNjYWxlcykge1xuXHRcdGxldCBzYyA9IHNjYWxlc1trXTtcblxuXHRcdGlmIChzYy5taW4gIT0gbnVsbCB8fCBzYy5tYXggIT0gbnVsbClcblx0XHRcdHBlbmRTY2FsZXNba10gPSB7bWluOiBzYy5taW4sIG1heDogc2MubWF4fTtcblx0fVxuXG5cdGNvbnN0IGxlZ2VuZCAgICAgPSAgYXNzaWduKHtzaG93OiB0cnVlfSwgb3B0cy5sZWdlbmQpO1xuXHRjb25zdCBzaG93TGVnZW5kID0gIGxlZ2VuZC5zaG93O1xuXG5cdGxldCBsZWdlbmRFbDtcblx0bGV0IGxlZ2VuZFJvd3MgPSBbXTtcblx0bGV0IGxlZ2VuZENvbHM7XG5cdGxldCBtdWx0aVZhbExlZ2VuZCA9IGZhbHNlO1xuXG5cdGlmIChzaG93TGVnZW5kKSB7XG5cdFx0bGVnZW5kRWwgPSBwbGFjZVRhZyhcInRhYmxlXCIsIFwibGVnZW5kXCIsIHJvb3QpO1xuXG5cdFx0Y29uc3QgZ2V0TXVsdGlWYWxzID0gc2VyaWVzWzFdID8gc2VyaWVzWzFdLnZhbHVlcyA6IG51bGw7XG5cdFx0bXVsdGlWYWxMZWdlbmQgPSBnZXRNdWx0aVZhbHMgIT0gbnVsbDtcblxuXHRcdGlmIChtdWx0aVZhbExlZ2VuZCkge1xuXHRcdFx0bGV0IGhlYWQgPSBwbGFjZVRhZyhcInRyXCIsIFwibGFiZWxzXCIsIGxlZ2VuZEVsKTtcblx0XHRcdHBsYWNlVGFnKFwidGhcIiwgbnVsbCwgaGVhZCk7XG5cdFx0XHRsZWdlbmRDb2xzID0gZ2V0TXVsdGlWYWxzKHNlbGYsIDEsIDApO1xuXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gbGVnZW5kQ29scylcblx0XHRcdFx0cGxhY2VUYWcoXCJ0aFwiLCBudWxsLCBoZWFkKS50ZXh0Q29udGVudCA9IGtleTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRsZWdlbmRDb2xzID0ge186IDB9O1xuXHRcdFx0YWRkQ2xhc3MobGVnZW5kRWwsIFwiaW5saW5lXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGluaXRMZWdlbmRSb3cocywgaSkge1xuXHRcdGlmIChpID09IDAgJiYgbXVsdGlWYWxMZWdlbmQpXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdGxldCBfcm93ID0gW107XG5cblx0XHRsZXQgcm93ID0gcGxhY2VUYWcoXCJ0clwiLCBcInNlcmllc1wiLCBsZWdlbmRFbCwgbGVnZW5kRWwuY2hpbGROb2Rlc1tpXSk7XG5cblx0XHRhZGRDbGFzcyhyb3csIHMuY2xhc3MpO1xuXG5cdFx0aWYgKCFzLnNob3cpXG5cdFx0XHRhZGRDbGFzcyhyb3csIFwib2ZmXCIpO1xuXG5cdFx0bGV0IGxhYmVsID0gcGxhY2VUYWcoXCJ0aFwiLCBudWxsLCByb3cpO1xuXG5cdFx0bGV0IGluZGljID0gcGxhY2VEaXYoXCJpZGVudFwiLCBsYWJlbCk7XG5cdFx0cy53aWR0aCAmJiAoaW5kaWMuc3R5bGUuYm9yZGVyQ29sb3IgPSBzLnN0cm9rZSk7XG5cdFx0aW5kaWMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcy5maWxsO1xuXG5cdFx0bGV0IHRleHQgPSBwbGFjZURpdihcInRleHRcIiwgbGFiZWwpO1xuXHRcdHRleHQudGV4dENvbnRlbnQgPSBzLmxhYmVsO1xuXG5cdFx0aWYgKGkgPiAwKSB7XG5cdFx0XHRvbihcImNsaWNrXCIsIGxhYmVsLCBlID0+IHtcblx0XHRcdFx0aWYgKCBjdXJzb3IubG9ja2VkKVxuXHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRmaWx0TW91c2UoZSkgJiYgc2V0U2VyaWVzKHNlcmllcy5pbmRleE9mKHMpLCB7c2hvdzogIXMuc2hvd30sICBzeW5jT3B0cy5zZXRTZXJpZXMpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmIChjdXJzb3JGb2N1cykge1xuXHRcdFx0XHRvbihtb3VzZWVudGVyLCBsYWJlbCwgZSA9PiB7XG5cdFx0XHRcdFx0aWYgKGN1cnNvci5sb2NrZWQpXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0XHRzZXRTZXJpZXMoc2VyaWVzLmluZGV4T2YocyksIHtmb2N1czogdHJ1ZX0sIHN5bmNPcHRzLnNldFNlcmllcyk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZvciAodmFyIGtleSBpbiBsZWdlbmRDb2xzKSB7XG5cdFx0XHRsZXQgdiA9IHBsYWNlVGFnKFwidGRcIiwgbnVsbCwgcm93KTtcblx0XHRcdHYudGV4dENvbnRlbnQgPSBcIi0tXCI7XG5cdFx0XHRfcm93LnB1c2godik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIF9yb3c7XG5cdH1cblxuXHRjb25zdCBjdXJzb3IgPSAgKHNlbGYuY3Vyc29yID0gYXNzaWduKHt9LCBjdXJzb3JPcHRzLCBvcHRzLmN1cnNvcikpO1xuXG5cdCAoY3Vyc29yLnBvaW50cy5zaG93ID0gZm5PclNlbGYoY3Vyc29yLnBvaW50cy5zaG93KSk7XG5cblx0Y29uc3QgZm9jdXMgPSBzZWxmLmZvY3VzID0gYXNzaWduKHt9LCBvcHRzLmZvY3VzIHx8IHthbHBoYTogMC4zfSwgIGN1cnNvci5mb2N1cyk7XG5cdGNvbnN0IGN1cnNvckZvY3VzID0gIGZvY3VzLnByb3ggPj0gMDtcblxuXHQvLyBzZXJpZXMtaW50ZXJzZWN0aW9uIG1hcmtlcnNcblx0bGV0IGN1cnNvclB0cyA9IFtudWxsXTtcblxuXHRmdW5jdGlvbiBpbml0Q3Vyc29yUHQocywgc2kpIHtcblx0XHRpZiAoc2kgPiAwKSB7XG5cdFx0XHRsZXQgcHQgPSBjdXJzb3IucG9pbnRzLnNob3coc2VsZiwgc2kpO1xuXG5cdFx0XHRpZiAocHQpIHtcblx0XHRcdFx0YWRkQ2xhc3MocHQsIFwiY3Vyc29yLXB0XCIpO1xuXHRcdFx0XHRhZGRDbGFzcyhwdCwgcy5jbGFzcyk7XG5cdFx0XHRcdHRyYW5zKHB0LCAtMTAsIC0xMCk7XG5cdFx0XHRcdG92ZXIuaW5zZXJ0QmVmb3JlKHB0LCBjdXJzb3JQdHNbc2ldKTtcblxuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdFNlcmllcyhzLCBpKSB7XG5cdFx0Ly8gaW5pdCBzY2FsZXMgJiBkZWZhdWx0c1xuXHRcdGNvbnN0IHNjS2V5ID0gcy5zY2FsZTtcblxuXHRcdGNvbnN0IHNjID0gc2NhbGVzW3NjS2V5XSA9IGFzc2lnbih7fSwgKGkgPT0gMCA/IHhTY2FsZU9wdHMgOiB5U2NhbGVPcHRzKSwgc2NhbGVzW3NjS2V5XSk7XG5cblx0XHRsZXQgaXNUaW1lID0gIHNjLnRpbWU7XG5cblx0XHRzYy5yYW5nZSA9IGZuT3JTZWxmKHNjLnJhbmdlIHx8IChpc1RpbWUgPyBzbmFwVGltZVggOiBpID09IDAgPyBzbmFwTnVtWCA6IHNuYXBOdW1ZKSk7XG5cblx0XHRsZXQgc3YgPSBzLnZhbHVlO1xuXHRcdHMudmFsdWUgPSBpc1RpbWUgPyAoaXNTdHIoc3YpID8gdGltZVNlcmllc1ZhbChfdHpEYXRlLCB0aW1lU2VyaWVzU3RhbXAoc3YsIF9mbXREYXRlKSkgOiBzdiB8fCBfdGltZVNlcmllc1ZhbCkgOiBzdiB8fCBudW1TZXJpZXNWYWw7XG5cdFx0cy5sYWJlbCA9IHMubGFiZWwgfHwgKGlzVGltZSA/IHRpbWVTZXJpZXNMYWJlbCA6IG51bVNlcmllc0xhYmVsKTtcblxuXHRcdGlmIChpID4gMCkge1xuXHRcdFx0cy53aWR0aCA9IHMud2lkdGggPT0gbnVsbCA/IDEgOiBzLndpZHRoO1xuXHRcdFx0cy5wYXRocyA9IHMucGF0aHMgfHwgKCBidWlsZFBhdGhzKTtcblx0XHRcdGxldCBfcHREaWEgPSBwdERpYShzLndpZHRoLCAxKTtcblx0XHRcdHMucG9pbnRzID0gYXNzaWduKHt9LCB7XG5cdFx0XHRcdHNpemU6IF9wdERpYSxcblx0XHRcdFx0d2lkdGg6IG1heCgxLCBfcHREaWEgKiAuMiksXG5cdFx0XHR9LCBzLnBvaW50cyk7XG5cdFx0XHRzLnBvaW50cy5zaG93ID0gZm5PclNlbGYocy5wb2ludHMuc2hvdyk7XG5cdFx0XHRzLl9wYXRocyA9IG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHNob3dMZWdlbmQpXG5cdFx0XHRsZWdlbmRSb3dzLnNwbGljZShpLCAwLCBpbml0TGVnZW5kUm93KHMsIGkpKTtcblxuXHRcdGlmICggY3Vyc29yLnNob3cpIHtcblx0XHRcdGxldCBwdCA9IGluaXRDdXJzb3JQdChzLCBpKTtcblx0XHRcdHB0ICYmIGN1cnNvclB0cy5zcGxpY2UoaSwgMCwgcHQpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGFkZFNlcmllcyhvcHRzLCBzaSkge1xuXHRcdHNpID0gc2kgPT0gbnVsbCA/IHNlcmllcy5sZW5ndGggOiBzaTtcblxuXHRcdG9wdHMgPSBzZXREZWZhdWx0KG9wdHMsIHNpLCB4U2VyaWVzT3B0cywgeVNlcmllc09wdHMpO1xuXHRcdHNlcmllcy5zcGxpY2Uoc2ksIDAsIG9wdHMpO1xuXHRcdGluaXRTZXJpZXMoc2VyaWVzW3NpXSwgc2kpO1xuXHR9XG5cblx0c2VsZi5hZGRTZXJpZXMgPSBhZGRTZXJpZXM7XG5cblx0ZnVuY3Rpb24gZGVsU2VyaWVzKGkpIHtcblx0XHRzZXJpZXMuc3BsaWNlKGksIDEpO1xuXHRcdCBzaG93TGVnZW5kICYmIGxlZ2VuZFJvd3Muc3BsaWNlKGksIDEpWzBdWzBdLnBhcmVudE5vZGUucmVtb3ZlKCk7XG5cdFx0IGN1cnNvclB0cy5sZW5ndGggPiAxICYmIGN1cnNvclB0cy5zcGxpY2UoaSwgMSlbMF0ucmVtb3ZlKCk7XG5cblx0XHQvLyBUT0RPOiBkZS1pbml0IG5vLWxvbmdlci1uZWVkZWQgc2NhbGVzP1xuXHR9XG5cblx0c2VsZi5kZWxTZXJpZXMgPSBkZWxTZXJpZXM7XG5cblx0c2VyaWVzLmZvckVhY2goaW5pdFNlcmllcyk7XG5cblx0Ly8gZGVwZW5kZW50IHNjYWxlcyBpbmhlcml0XG5cdGZvciAobGV0IGsgaW4gc2NhbGVzKSB7XG5cdFx0bGV0IHNjID0gc2NhbGVzW2tdO1xuXG5cdFx0aWYgKHNjLmZyb20gIT0gbnVsbClcblx0XHRcdHNjYWxlc1trXSA9IGFzc2lnbih7fSwgc2NhbGVzW3NjLmZyb21dLCBzYyk7XG5cdH1cblxuXHRjb25zdCB4U2NhbGVLZXkgPSBzZXJpZXNbMF0uc2NhbGU7XG5cdGNvbnN0IHhTY2FsZURpc3RyID0gc2NhbGVzW3hTY2FsZUtleV0uZGlzdHI7XG5cblx0ZnVuY3Rpb24gaW5pdEF4aXMoYXhpcywgaSkge1xuXHRcdGlmIChheGlzLnNob3cpIHtcblx0XHRcdGxldCBpc1Z0ID0gYXhpcy5zaWRlICUgMjtcblxuXHRcdFx0bGV0IHNjID0gc2NhbGVzW2F4aXMuc2NhbGVdO1xuXG5cdFx0XHQvLyB0aGlzIGNhbiBvY2N1ciBpZiBhbGwgc2VyaWVzIHNwZWNpZnkgbm9uLWRlZmF1bHQgc2NhbGVzXG5cdFx0XHRpZiAoc2MgPT0gbnVsbCkge1xuXHRcdFx0XHRheGlzLnNjYWxlID0gaXNWdCA/IHNlcmllc1sxXS5zY2FsZSA6IHhTY2FsZUtleTtcblx0XHRcdFx0c2MgPSBzY2FsZXNbYXhpcy5zY2FsZV07XG5cdFx0XHR9XG5cblx0XHRcdC8vIGFsc28gc2V0IGRlZmF1bHRzIGZvciBpbmNycyAmIHZhbHVlcyBiYXNlZCBvbiBheGlzIGRpc3RyXG5cdFx0XHRsZXQgaXNUaW1lID0gIHNjLnRpbWU7XG5cblx0XHRcdGF4aXMuc3BhY2UgPSBmbk9yU2VsZihheGlzLnNwYWNlKTtcblx0XHRcdGF4aXMucm90YXRlID0gZm5PclNlbGYoYXhpcy5yb3RhdGUpO1xuXHRcdFx0YXhpcy5pbmNycyA9IGZuT3JTZWxmKGF4aXMuaW5jcnMgfHwgKCAgICAgICAgICBzYy5kaXN0ciA9PSAyID8gaW50SW5jcnMgOiAoaXNUaW1lID8gdGltZUluY3JzIDogbnVtSW5jcnMpKSk7XG5cdFx0XHRheGlzLnNwbGl0ID0gZm5PclNlbGYoYXhpcy5zcGxpdCB8fCAoaXNUaW1lICYmIHNjLmRpc3RyID09IDEgPyBfdGltZUF4aXNTcGxpdHMgOiBudW1BeGlzU3BsaXRzKSk7XG5cdFx0XHRsZXQgYXYgPSBheGlzLnZhbHVlcztcblx0XHRcdGF4aXMudmFsdWVzID0gaXNUaW1lID8gKGlzQXJyKGF2KSA/IHRpbWVBeGlzVmFscyhfdHpEYXRlLCB0aW1lQXhpc1N0YW1wcyhhdiwgX2ZtdERhdGUpKSA6IGF2IHx8IF90aW1lQXhpc1ZhbHMpIDogYXYgfHwgbnVtQXhpc1ZhbHM7XG5cblx0XHRcdGF4aXMuZm9udCAgICAgID0gcHhSYXRpb0ZvbnQoYXhpcy5mb250KTtcblx0XHRcdGF4aXMubGFiZWxGb250ID0gcHhSYXRpb0ZvbnQoYXhpcy5sYWJlbEZvbnQpO1xuXHRcdH1cblx0fVxuXG5cdC8vIHNldCBheGlzIGRlZmF1bHRzXG5cdGF4ZXMuZm9yRWFjaChpbml0QXhpcyk7XG5cblx0bGV0IGRhdGFMZW47XG5cblx0Ly8gcmVuZGVyZWQgZGF0YSB3aW5kb3dcblx0bGV0IGkwID0gbnVsbDtcblx0bGV0IGkxID0gbnVsbDtcblx0Y29uc3QgaWR4cyA9IHNlcmllc1swXS5pZHhzO1xuXG5cdGxldCBkYXRhMCA9IG51bGw7XG5cblx0ZnVuY3Rpb24gc2V0RGF0YShfZGF0YSwgX3Jlc2V0U2NhbGVzKSB7XG5cdFx0X2RhdGEgPSBfZGF0YSB8fCBbXTtcblx0XHRfZGF0YVswXSA9IF9kYXRhWzBdIHx8IFtdO1xuXG5cdFx0c2VsZi5kYXRhID0gX2RhdGE7XG5cdFx0ZGF0YSA9IF9kYXRhLnNsaWNlKCk7XG5cdFx0ZGF0YTAgPSBkYXRhWzBdO1xuXHRcdGRhdGFMZW4gPSBkYXRhMC5sZW5ndGg7XG5cblx0XHRpZiAoeFNjYWxlRGlzdHIgPT0gMilcblx0XHRcdGRhdGFbMF0gPSBkYXRhMC5tYXAoKHYsIGkpID0+IGkpO1xuXG5cdFx0cmVzZXRZU2VyaWVzKCk7XG5cblx0XHRmaXJlKFwic2V0RGF0YVwiKTtcblxuXHRcdF9yZXNldFNjYWxlcyAhPT0gZmFsc2UgJiYgYXV0b1NjYWxlWCgpO1xuXHR9XG5cblx0c2VsZi5zZXREYXRhID0gc2V0RGF0YTtcblxuXHRmdW5jdGlvbiBhdXRvU2NhbGVYKCkge1xuXHRcdGkwID0gaWR4c1swXSA9IDA7XG5cdFx0aTEgPSBpZHhzWzFdID0gZGF0YUxlbiAtIDE7XG5cblx0XHRsZXQgX21pbiA9IHhTY2FsZURpc3RyID09IDIgPyBpMCA6IGRhdGFbMF1baTBdLFxuXHRcdFx0X21heCA9IHhTY2FsZURpc3RyID09IDIgPyBpMSA6IGRhdGFbMF1baTFdO1xuXG5cdFx0X3NldFNjYWxlKHhTY2FsZUtleSwgX21pbiwgX21heCk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRDdHhTdHlsZShzdHJva2UsIHdpZHRoLCBkYXNoLCBmaWxsKSB7XG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlIHx8IGhleEJsYWNrO1xuXHRcdGN0eC5saW5lV2lkdGggPSB3aWR0aDtcblx0XHRjdHgubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cdFx0Y3R4LnNldExpbmVEYXNoKGRhc2ggfHwgW10pO1xuXHRcdGN0eC5maWxsU3R5bGUgPSBmaWxsIHx8IGhleEJsYWNrO1xuXHR9XG5cblx0bGV0IGZ1bGxXaWRDc3M7XG5cdGxldCBmdWxsSGd0Q3NzO1xuXG5cdGxldCBwbG90V2lkQ3NzO1xuXHRsZXQgcGxvdEhndENzcztcblxuXHQvLyBwbG90IG1hcmdpbnMgdG8gYWNjb3VudCBmb3IgYXhlc1xuXHRsZXQgcGxvdExmdENzcztcblx0bGV0IHBsb3RUb3BDc3M7XG5cblx0bGV0IHBsb3RMZnQ7XG5cdGxldCBwbG90VG9wO1xuXHRsZXQgcGxvdFdpZDtcblx0bGV0IHBsb3RIZ3Q7XG5cblx0c2VsZi5iYm94ID0ge307XG5cblx0ZnVuY3Rpb24gX3NldFNpemUod2lkdGgsIGhlaWdodCkge1xuXHRcdHNlbGYud2lkdGggID0gZnVsbFdpZENzcyA9IHBsb3RXaWRDc3MgPSB3aWR0aDtcblx0XHRzZWxmLmhlaWdodCA9IGZ1bGxIZ3RDc3MgPSBwbG90SGd0Q3NzID0gaGVpZ2h0O1xuXHRcdHBsb3RMZnRDc3MgID0gcGxvdFRvcENzcyA9IDA7XG5cblx0XHRjYWxjUGxvdFJlY3QoKTtcblx0XHRjYWxjQXhlc1JlY3RzKCk7XG5cblx0XHRsZXQgYmIgPSBzZWxmLmJib3g7XG5cblx0XHRwbG90TGZ0ID0gYmJbTEVGVF0gICA9IGluY3JSb3VuZChwbG90TGZ0Q3NzICogcHhSYXRpbywgMC41KTtcblx0XHRwbG90VG9wID0gYmJbVE9QXSAgICA9IGluY3JSb3VuZChwbG90VG9wQ3NzICogcHhSYXRpbywgMC41KTtcblx0XHRwbG90V2lkID0gYmJbV0lEVEhdICA9IGluY3JSb3VuZChwbG90V2lkQ3NzICogcHhSYXRpbywgMC41KTtcblx0XHRwbG90SGd0ID0gYmJbSEVJR0hUXSA9IGluY3JSb3VuZChwbG90SGd0Q3NzICogcHhSYXRpbywgMC41KTtcblxuXHRcdHNldFN0eWxlUHgodW5kZXIsIExFRlQsICAgcGxvdExmdENzcyk7XG5cdFx0c2V0U3R5bGVQeCh1bmRlciwgVE9QLCAgICBwbG90VG9wQ3NzKTtcblx0XHRzZXRTdHlsZVB4KHVuZGVyLCBXSURUSCwgIHBsb3RXaWRDc3MpO1xuXHRcdHNldFN0eWxlUHgodW5kZXIsIEhFSUdIVCwgcGxvdEhndENzcyk7XG5cblx0XHRzZXRTdHlsZVB4KG92ZXIsIExFRlQsICAgIHBsb3RMZnRDc3MpO1xuXHRcdHNldFN0eWxlUHgob3ZlciwgVE9QLCAgICAgcGxvdFRvcENzcyk7XG5cdFx0c2V0U3R5bGVQeChvdmVyLCBXSURUSCwgICBwbG90V2lkQ3NzKTtcblx0XHRzZXRTdHlsZVB4KG92ZXIsIEhFSUdIVCwgIHBsb3RIZ3RDc3MpO1xuXG5cdFx0c2V0U3R5bGVQeCh3cmFwLCBXSURUSCwgICBmdWxsV2lkQ3NzKTtcblx0XHRzZXRTdHlsZVB4KHdyYXAsIEhFSUdIVCwgIGZ1bGxIZ3RDc3MpO1xuXG5cdFx0Y2FuW1dJRFRIXSAgPSByb3VuZChmdWxsV2lkQ3NzICogcHhSYXRpbyk7XG5cdFx0Y2FuW0hFSUdIVF0gPSByb3VuZChmdWxsSGd0Q3NzICogcHhSYXRpbyk7XG5cblx0XHRzeW5jUmVjdCgpO1xuXG5cdFx0cmVhZHkgJiYgX3NldFNjYWxlKHhTY2FsZUtleSwgc2NhbGVzW3hTY2FsZUtleV0ubWluLCBzY2FsZXNbeFNjYWxlS2V5XS5tYXgpO1xuXG5cdFx0cmVhZHkgJiYgZmlyZShcInNldFNpemVcIik7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRTaXplKHt3aWR0aCwgaGVpZ2h0fSkge1xuXHRcdF9zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXHR9XG5cblx0c2VsZi5zZXRTaXplID0gc2V0U2l6ZTtcblxuXHQvLyBhY2N1bXVsYXRlIGF4aXMgb2Zmc2V0cywgcmVkdWNlIGNhbnZhcyB3aWR0aFxuXHRmdW5jdGlvbiBjYWxjUGxvdFJlY3QoKSB7XG5cdFx0Ly8gZWFzZW1lbnRzIGZvciBlZGdlIGxhYmVsc1xuXHRcdGxldCBoYXNUb3BBeGlzID0gZmFsc2U7XG5cdFx0bGV0IGhhc0J0bUF4aXMgPSBmYWxzZTtcblx0XHRsZXQgaGFzUmd0QXhpcyA9IGZhbHNlO1xuXHRcdGxldCBoYXNMZnRBeGlzID0gZmFsc2U7XG5cblx0XHRheGVzLmZvckVhY2goKGF4aXMsIGkpID0+IHtcblx0XHRcdGlmIChheGlzLnNob3cpIHtcblx0XHRcdFx0bGV0IHtzaWRlLCBzaXplfSA9IGF4aXM7XG5cdFx0XHRcdGxldCBpc1Z0ID0gc2lkZSAlIDI7XG5cdFx0XHRcdGxldCBsYWJlbFNpemUgPSBheGlzLmxhYmVsU2l6ZSA9IChheGlzLmxhYmVsICE9IG51bGwgPyAoYXhpcy5sYWJlbFNpemUgfHwgMzApIDogMCk7XG5cblx0XHRcdFx0bGV0IGZ1bGxTaXplID0gc2l6ZSArIGxhYmVsU2l6ZTtcblxuXHRcdFx0XHRpZiAoZnVsbFNpemUgPiAwKSB7XG5cdFx0XHRcdFx0aWYgKGlzVnQpIHtcblx0XHRcdFx0XHRcdHBsb3RXaWRDc3MgLT0gZnVsbFNpemU7XG5cblx0XHRcdFx0XHRcdGlmIChzaWRlID09IDMpIHtcblx0XHRcdFx0XHRcdFx0cGxvdExmdENzcyArPSBmdWxsU2l6ZTtcblx0XHRcdFx0XHRcdFx0aGFzTGZ0QXhpcyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGhhc1JndEF4aXMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHBsb3RIZ3RDc3MgLT0gZnVsbFNpemU7XG5cblx0XHRcdFx0XHRcdGlmIChzaWRlID09IDApIHtcblx0XHRcdFx0XHRcdFx0cGxvdFRvcENzcyArPSBmdWxsU2l6ZTtcblx0XHRcdFx0XHRcdFx0aGFzVG9wQXhpcyA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGhhc0J0bUF4aXMgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0Ly8gaHogZ3V0dGVyc1xuXHRcdGlmIChoYXNUb3BBeGlzIHx8IGhhc0J0bUF4aXMpIHtcblx0XHRcdGlmICghaGFzUmd0QXhpcylcblx0XHRcdFx0cGxvdFdpZENzcyAtPSBndXR0ZXJzLng7XG5cdFx0XHRpZiAoIWhhc0xmdEF4aXMpIHtcblx0XHRcdFx0cGxvdFdpZENzcyAtPSBndXR0ZXJzLng7XG5cdFx0XHRcdHBsb3RMZnRDc3MgKz0gZ3V0dGVycy54O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHZ0IGd1dHRlcnNcblx0XHRpZiAoaGFzTGZ0QXhpcyB8fCBoYXNSZ3RBeGlzKSB7XG5cdFx0XHRpZiAoIWhhc0J0bUF4aXMpXG5cdFx0XHRcdHBsb3RIZ3RDc3MgLT0gZ3V0dGVycy55O1xuXHRcdFx0aWYgKCFoYXNUb3BBeGlzKSB7XG5cdFx0XHRcdHBsb3RIZ3RDc3MgLT0gZ3V0dGVycy55O1xuXHRcdFx0XHRwbG90VG9wQ3NzICs9IGd1dHRlcnMueTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBjYWxjQXhlc1JlY3RzKCkge1xuXHRcdC8vIHdpbGwgYWNjdW0gK1xuXHRcdGxldCBvZmYxID0gcGxvdExmdENzcyArIHBsb3RXaWRDc3M7XG5cdFx0bGV0IG9mZjIgPSBwbG90VG9wQ3NzICsgcGxvdEhndENzcztcblx0XHQvLyB3aWxsIGFjY3VtIC1cblx0XHRsZXQgb2ZmMyA9IHBsb3RMZnRDc3M7XG5cdFx0bGV0IG9mZjAgPSBwbG90VG9wQ3NzO1xuXG5cdFx0ZnVuY3Rpb24gaW5jck9mZnNldChzaWRlLCBzaXplKSB7XG5cblx0XHRcdHN3aXRjaCAoc2lkZSkge1xuXHRcdFx0XHRjYXNlIDE6IG9mZjEgKz0gc2l6ZTsgcmV0dXJuIG9mZjEgLSBzaXplO1xuXHRcdFx0XHRjYXNlIDI6IG9mZjIgKz0gc2l6ZTsgcmV0dXJuIG9mZjIgLSBzaXplO1xuXHRcdFx0XHRjYXNlIDM6IG9mZjMgLT0gc2l6ZTsgcmV0dXJuIG9mZjMgKyBzaXplO1xuXHRcdFx0XHRjYXNlIDA6IG9mZjAgLT0gc2l6ZTsgcmV0dXJuIG9mZjAgKyBzaXplO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGF4ZXMuZm9yRWFjaCgoYXhpcywgaSkgPT4ge1xuXHRcdFx0bGV0IHNpZGUgPSBheGlzLnNpZGU7XG5cblx0XHRcdGF4aXMuX3BvcyA9IGluY3JPZmZzZXQoc2lkZSwgYXhpcy5zaXplKTtcblxuXHRcdFx0aWYgKGF4aXMubGFiZWwgIT0gbnVsbClcblx0XHRcdFx0YXhpcy5fbHBvcyA9IGluY3JPZmZzZXQoc2lkZSwgYXhpcy5sYWJlbFNpemUpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0U2NhbGVzKCkge1xuXHRcdGlmIChpbkJhdGNoKSB7XG5cdFx0XHRzaG91bGRTZXRTY2FsZXMgPSB0cnVlO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHQvL1x0bG9nKFwic2V0U2NhbGVzKClcIiwgYXJndW1lbnRzKTtcblxuXHRcdGlmIChkYXRhTGVuID4gMCkge1xuXHRcdFx0Ly8gd2lwIHNjYWxlc1xuXHRcdFx0bGV0IHdpcFNjYWxlcyA9IGNvcHkoc2NhbGVzKTtcblxuXHRcdFx0Zm9yIChsZXQgayBpbiB3aXBTY2FsZXMpIHtcblx0XHRcdFx0bGV0IHdzYyA9IHdpcFNjYWxlc1trXTtcblx0XHRcdFx0bGV0IHBzYyA9IHBlbmRTY2FsZXNba107XG5cblx0XHRcdFx0aWYgKHBzYyAhPSBudWxsKSB7XG5cdFx0XHRcdFx0YXNzaWduKHdzYywgcHNjKTtcblxuXHRcdFx0XHRcdC8vIGV4cGxpY2l0bHkgc2V0dGluZyB0aGUgeC1zY2FsZSBpbnZhbGlkYXRlcyBldmVyeXRoaW5nIChhY3RzIGFzIHJlZHJhdylcblx0XHRcdFx0XHRpZiAoayA9PSB4U2NhbGVLZXkpXG5cdFx0XHRcdFx0XHRyZXNldFlTZXJpZXMoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChrICE9IHhTY2FsZUtleSkge1xuXHRcdFx0XHRcdHdzYy5taW4gPSBpbmY7XG5cdFx0XHRcdFx0d3NjLm1heCA9IC1pbmY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gcHJlLXJhbmdlIHktc2NhbGVzIGZyb20geSBzZXJpZXMnIGRhdGEgdmFsdWVzXG5cdFx0XHRzZXJpZXMuZm9yRWFjaCgocywgaSkgPT4ge1xuXHRcdFx0XHRsZXQgayA9IHMuc2NhbGU7XG5cdFx0XHRcdGxldCB3c2MgPSB3aXBTY2FsZXNba107XG5cblx0XHRcdFx0Ly8gc2V0dGluZyB0aGUgeCBzY2FsZSBpbnZhbGlkYXRlcyBldmVyeXRoaW5nXG5cdFx0XHRcdGlmIChpID09IDApIHtcblx0XHRcdFx0XHRsZXQgbWluTWF4ID0gd3NjLnJhbmdlKHNlbGYsIHdzYy5taW4sIHdzYy5tYXgpO1xuXG5cdFx0XHRcdFx0d3NjLm1pbiA9IG1pbk1heFswXTtcblx0XHRcdFx0XHR3c2MubWF4ID0gbWluTWF4WzFdO1xuXG5cdFx0XHRcdFx0aTAgPSBjbG9zZXN0SWR4KHdzYy5taW4sIGRhdGFbMF0pO1xuXHRcdFx0XHRcdGkxID0gY2xvc2VzdElkeCh3c2MubWF4LCBkYXRhWzBdKTtcblxuXHRcdFx0XHRcdC8vIGNsb3Nlc3QgaW5kaWNlcyBjYW4gYmUgb3V0c2lkZSBvZiB2aWV3XG5cdFx0XHRcdFx0aWYgKGRhdGFbMF1baTBdIDwgd3NjLm1pbilcblx0XHRcdFx0XHRcdGkwKys7XG5cdFx0XHRcdFx0aWYgKGRhdGFbMF1baTFdID4gd3NjLm1heClcblx0XHRcdFx0XHRcdGkxLS07XG5cblx0XHRcdFx0XHRzLm1pbiA9IGRhdGEwW2kwXTtcblx0XHRcdFx0XHRzLm1heCA9IGRhdGEwW2kxXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChzLnNob3cgJiYgcGVuZFNjYWxlc1trXSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0Ly8gb25seSBydW4gZ2V0TWluTWF4KCkgZm9yIGludmFsaWRhdGVkIHNlcmllcyBkYXRhLCBlbHNlIHJldXNlXG5cdFx0XHRcdFx0bGV0IG1pbk1heCA9IHMubWluID09IGluZiA/ICh3c2MuYXV0byA/IGdldE1pbk1heChkYXRhW2ldLCBpMCwgaTEpIDogWzAsMTAwXSkgOiBbcy5taW4sIHMubWF4XTtcblxuXHRcdFx0XHRcdC8vIGluaXRpYWwgbWluL21heFxuXHRcdFx0XHRcdHdzYy5taW4gPSBtaW4od3NjLm1pbiwgcy5taW4gPSBtaW5NYXhbMF0pO1xuXHRcdFx0XHRcdHdzYy5tYXggPSBtYXgod3NjLm1heCwgcy5tYXggPSBtaW5NYXhbMV0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cy5pZHhzWzBdID0gaTA7XG5cdFx0XHRcdHMuaWR4c1sxXSA9IGkxO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIHJhbmdlIGluZGVwZW5kZW50IHNjYWxlc1xuXHRcdFx0Zm9yIChsZXQgayBpbiB3aXBTY2FsZXMpIHtcblx0XHRcdFx0bGV0IHdzYyA9IHdpcFNjYWxlc1trXTtcblxuXHRcdFx0XHRpZiAod3NjLmZyb20gPT0gbnVsbCAmJiB3c2MubWluICE9IGluZiAmJiBwZW5kU2NhbGVzW2tdID09IG51bGwpIHtcblx0XHRcdFx0XHRsZXQgbWluTWF4ID0gd3NjLnJhbmdlKHNlbGYsIHdzYy5taW4sIHdzYy5tYXgpO1xuXHRcdFx0XHRcdHdzYy5taW4gPSBtaW5NYXhbMF07XG5cdFx0XHRcdFx0d3NjLm1heCA9IG1pbk1heFsxXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyByYW5nZSBkZXBlbmRlbnQgc2NhbGVzXG5cdFx0XHRmb3IgKGxldCBrIGluIHdpcFNjYWxlcykge1xuXHRcdFx0XHRsZXQgd3NjID0gd2lwU2NhbGVzW2tdO1xuXG5cdFx0XHRcdGlmICh3c2MuZnJvbSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0bGV0IGJhc2UgPSB3aXBTY2FsZXNbd3NjLmZyb21dO1xuXG5cdFx0XHRcdFx0aWYgKGJhc2UubWluICE9IGluZikge1xuXHRcdFx0XHRcdFx0bGV0IG1pbk1heCA9IHdzYy5yYW5nZShzZWxmLCBiYXNlLm1pbiwgYmFzZS5tYXgpO1xuXHRcdFx0XHRcdFx0d3NjLm1pbiA9IG1pbk1heFswXTtcblx0XHRcdFx0XHRcdHdzYy5tYXggPSBtaW5NYXhbMV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGxldCBjaGFuZ2VkID0ge307XG5cblx0XHRcdGZvciAobGV0IGsgaW4gd2lwU2NhbGVzKSB7XG5cdFx0XHRcdGxldCB3c2MgPSB3aXBTY2FsZXNba107XG5cdFx0XHRcdGxldCBzYyA9IHNjYWxlc1trXTtcblxuXHRcdFx0XHRpZiAoc2MubWluICE9IHdzYy5taW4gfHwgc2MubWF4ICE9IHdzYy5tYXgpIHtcblx0XHRcdFx0XHRzYy5taW4gPSB3c2MubWluO1xuXHRcdFx0XHRcdHNjLm1heCA9IHdzYy5tYXg7XG5cdFx0XHRcdFx0Y2hhbmdlZFtrXSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gaW52YWxpZGF0ZSBwYXRocyBvZiBhbGwgc2VyaWVzIG9uIGNoYW5nZWQgc2NhbGVzXG5cdFx0XHRzZXJpZXMuZm9yRWFjaChzID0+IHtcblx0XHRcdFx0aWYgKGNoYW5nZWRbcy5zY2FsZV0pXG5cdFx0XHRcdFx0cy5fcGF0aHMgPSBudWxsO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZvciAobGV0IGsgaW4gY2hhbmdlZClcblx0XHRcdFx0ZmlyZShcInNldFNjYWxlXCIsIGspO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGsgaW4gcGVuZFNjYWxlcylcblx0XHRcdHBlbmRTY2FsZXNba10gPSBudWxsO1xuXG5cdFx0IGN1cnNvci5zaG93ICYmIHVwZGF0ZUN1cnNvcigpO1xuXHR9XG5cblx0Ly8gVE9ETzogZHJhd1dyYXAoc2ksIGRyYXdQb2ludHMpIChzYXZlLCByZXN0b3JlLCB0cmFuc2xhdGUsIGNsaXApXG5cblx0ZnVuY3Rpb24gZHJhd1BvaW50cyhzaSkge1xuXHQvL1x0bG9nKFwiZHJhd1BvaW50cygpXCIsIGFyZ3VtZW50cyk7XG5cblx0XHRsZXQgcyA9IHNlcmllc1tzaV07XG5cdFx0bGV0IHAgPSBzLnBvaW50cztcblxuXHRcdGNvbnN0IHdpZHRoID0gcm91bmQzKHAud2lkdGggKiBweFJhdGlvKTtcblx0XHRjb25zdCBvZmZzZXQgPSAod2lkdGggJSAyKSAvIDI7XG5cdFx0Y29uc3QgaXNTdHJva2VkID0gcC53aWR0aCA+IDA7XG5cblx0XHRsZXQgcmFkID0gKHAuc2l6ZSAtIHAud2lkdGgpIC8gMiAqIHB4UmF0aW87XG5cdFx0bGV0IGRpYSA9IHJvdW5kMyhyYWQgKiAyKTtcblxuXHRcdGN0eC50cmFuc2xhdGUob2Zmc2V0LCBvZmZzZXQpO1xuXG5cdFx0Y3R4LnNhdmUoKTtcblxuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRjdHgucmVjdChcblx0XHRcdHBsb3RMZnQgLSBkaWEsXG5cdFx0XHRwbG90VG9wIC0gZGlhLFxuXHRcdFx0cGxvdFdpZCArIGRpYSAqIDIsXG5cdFx0XHRwbG90SGd0ICsgZGlhICogMixcblx0XHQpO1xuXHRcdGN0eC5jbGlwKCk7XG5cblx0XHRjdHguZ2xvYmFsQWxwaGEgPSBzLmFscGhhO1xuXG5cdFx0Y29uc3QgcGF0aCA9IG5ldyBQYXRoMkQoKTtcblxuXHRcdGZvciAobGV0IHBpID0gaTA7IHBpIDw9IGkxOyBwaSsrKSB7XG5cdFx0XHRpZiAoZGF0YVtzaV1bcGldICE9IG51bGwpIHtcblx0XHRcdFx0bGV0IHggPSByb3VuZChnZXRYUG9zKGRhdGFbMF1bcGldLCAgc2NhbGVzW3hTY2FsZUtleV0sIHBsb3RXaWQsIHBsb3RMZnQpKTtcblx0XHRcdFx0bGV0IHkgPSByb3VuZChnZXRZUG9zKGRhdGFbc2ldW3BpXSwgc2NhbGVzW3Muc2NhbGVdLCAgIHBsb3RIZ3QsIHBsb3RUb3ApKTtcblxuXHRcdFx0XHRwYXRoLm1vdmVUbyh4ICsgcmFkLCB5KTtcblx0XHRcdFx0cGF0aC5hcmMoeCwgeSwgcmFkLCAwLCBQSSAqIDIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNldEN0eFN0eWxlKFxuXHRcdFx0cC5zdHJva2UgfHwgcy5zdHJva2UgfHwgaGV4QmxhY2ssXG5cdFx0XHR3aWR0aCxcblx0XHRcdG51bGwsXG5cdFx0XHRwLmZpbGwgfHwgKGlzU3Ryb2tlZCA/IFwiI2ZmZlwiIDogcy5zdHJva2UgfHwgaGV4QmxhY2spLFxuXHRcdCk7XG5cblx0XHRjdHguZmlsbChwYXRoKTtcblx0XHRpc1N0cm9rZWQgJiYgY3R4LnN0cm9rZShwYXRoKTtcblxuXHRcdGN0eC5nbG9iYWxBbHBoYSA9IDE7XG5cblx0XHRjdHgucmVzdG9yZSgpO1xuXG5cdFx0Y3R4LnRyYW5zbGF0ZSgtb2Zmc2V0LCAtb2Zmc2V0KTtcblx0fVxuXG5cdC8vIGdyYWJzIHRoZSBuZWFyZXN0IGluZGljZXMgd2l0aCB5IGRhdGEgb3V0c2lkZSBvZiB4LXNjYWxlIGxpbWl0c1xuXHRmdW5jdGlvbiBnZXRPdXRlcklkeHMoeWRhdGEpIHtcblx0XHRsZXQgX2kwID0gY2xhbXAoaTAgLSAxLCAwLCBkYXRhTGVuIC0gMSk7XG5cdFx0bGV0IF9pMSA9IGNsYW1wKGkxICsgMSwgMCwgZGF0YUxlbiAtIDEpO1xuXG5cdFx0d2hpbGUgKHlkYXRhW19pMF0gPT0gbnVsbCAmJiBfaTAgPiAwKVxuXHRcdFx0X2kwLS07XG5cblx0XHR3aGlsZSAoeWRhdGFbX2kxXSA9PSBudWxsICYmIF9pMSA8IGRhdGFMZW4gLSAxKVxuXHRcdFx0X2kxKys7XG5cblx0XHRyZXR1cm4gW19pMCwgX2kxXTtcblx0fVxuXG5cdGxldCBkaXIgPSAxO1xuXG5cdGZ1bmN0aW9uIGRyYXdTZXJpZXMoKSB7XG5cdFx0Ly8gcGF0aCBidWlsZGluZyBsb29wIG11c3QgYmUgYmVmb3JlIGRyYXcgbG9vcCB0byBlbnN1cmUgdGhhdCBhbGwgYmFuZHMgYXJlIGZ1bGx5IGNvbnN0cnVjdGVkXG5cdFx0c2VyaWVzLmZvckVhY2goKHMsIGkpID0+IHtcblx0XHRcdGlmIChpID4gMCAmJiBzLnNob3cgJiYgZGF0YUxlbiA+IDAgJiYgcy5fcGF0aHMgPT0gbnVsbCkge1xuXHRcdFx0XHRsZXQgX2lkeHMgPSBnZXRPdXRlcklkeHMoZGF0YVtpXSk7XG5cdFx0XHRcdHMuX3BhdGhzID0gcy5wYXRocyhzZWxmLCBpLCBfaWR4c1swXSwgX2lkeHNbMV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0c2VyaWVzLmZvckVhY2goKHMsIGkpID0+IHtcblx0XHRcdGlmIChpID4gMCAmJiBzLnNob3cpIHtcblx0XHRcdFx0aWYgKHMuX3BhdGhzKVxuXHRcdFx0XHRcdCBkcmF3UGF0aChpKTtcblxuXHRcdFx0XHRpZiAocy5wb2ludHMuc2hvdyhzZWxmLCBpLCBpMCwgaTEpKVxuXHRcdFx0XHRcdCBkcmF3UG9pbnRzKGkpO1xuXG5cdFx0XHRcdGZpcmUoXCJkcmF3U2VyaWVzXCIsIGkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZHJhd1BhdGgoc2kpIHtcblx0XHRjb25zdCBzID0gc2VyaWVzW3NpXTtcblxuXHRcdGlmIChkaXIgPT0gMSkge1xuXHRcdFx0Y29uc3QgeyBzdHJva2UsIGZpbGwsIGNsaXAgfSA9IHMuX3BhdGhzO1xuXHRcdFx0Y29uc3Qgd2lkdGggPSByb3VuZDMoc1tXSURUSF0gKiBweFJhdGlvKTtcblx0XHRcdGNvbnN0IG9mZnNldCA9ICh3aWR0aCAlIDIpIC8gMjtcblxuXHRcdFx0c2V0Q3R4U3R5bGUocy5zdHJva2UsIHdpZHRoLCBzLmRhc2gsIHMuZmlsbCk7XG5cblx0XHRcdGN0eC5nbG9iYWxBbHBoYSA9IHMuYWxwaGE7XG5cblx0XHRcdGN0eC50cmFuc2xhdGUob2Zmc2V0LCBvZmZzZXQpO1xuXG5cdFx0XHRjdHguc2F2ZSgpO1xuXG5cdFx0XHRsZXQgbGZ0ID0gcGxvdExmdCxcblx0XHRcdFx0dG9wID0gcGxvdFRvcCxcblx0XHRcdFx0d2lkID0gcGxvdFdpZCxcblx0XHRcdFx0aGd0ID0gcGxvdEhndDtcblxuXHRcdFx0bGV0IGhhbGZXaWQgPSB3aWR0aCAqIHB4UmF0aW8gLyAyO1xuXG5cdFx0XHRpZiAocy5taW4gPT0gMClcblx0XHRcdFx0aGd0ICs9IGhhbGZXaWQ7XG5cblx0XHRcdGlmIChzLm1heCA9PSAwKSB7XG5cdFx0XHRcdHRvcCAtPSBoYWxmV2lkO1xuXHRcdFx0XHRoZ3QgKz0gaGFsZldpZDtcblx0XHRcdH1cblxuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4LnJlY3QobGZ0LCB0b3AsIHdpZCwgaGd0KTtcblx0XHRcdGN0eC5jbGlwKCk7XG5cblx0XHRcdGlmIChjbGlwICE9IG51bGwpXG5cdFx0XHRcdGN0eC5jbGlwKGNsaXApO1xuXG5cdFx0XHRpZiAocy5iYW5kKSB7XG5cdFx0XHRcdGN0eC5maWxsKHN0cm9rZSk7XG5cdFx0XHRcdHdpZHRoICYmIGN0eC5zdHJva2Uoc3Ryb2tlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR3aWR0aCAmJiBjdHguc3Ryb2tlKHN0cm9rZSk7XG5cblx0XHRcdFx0aWYgKHMuZmlsbCAhPSBudWxsKVxuXHRcdFx0XHRcdGN0eC5maWxsKGZpbGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRjdHgucmVzdG9yZSgpO1xuXG5cdFx0XHRjdHgudHJhbnNsYXRlKC1vZmZzZXQsIC1vZmZzZXQpO1xuXG5cdFx0XHRjdHguZ2xvYmFsQWxwaGEgPSAxO1xuXHRcdH1cblxuXHRcdGlmIChzLmJhbmQpXG5cdFx0XHRkaXIgKj0gLTE7XG5cdH1cblxuXHRmdW5jdGlvbiBidWlsZENsaXAoaXMsIGdhcHMsIG51bGxIZWFkLCBudWxsVGFpbCkge1xuXHRcdGxldCBzID0gc2VyaWVzW2lzXTtcblxuXHRcdGxldCBjbGlwID0gbnVsbDtcblxuXHRcdC8vIGNyZWF0ZSBjbGlwIHBhdGggKGludmVydCBnYXBzIGFuZCBub24tZ2Fwcylcblx0XHRpZiAoZ2Fwcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZiAocy5zcGFuR2Fwcykge1xuXHRcdFx0XHRsZXQgaGVhZEdhcCA9IGdhcHNbMF07XG5cdFx0XHRcdGxldCB0YWlsR2FwID0gZ2Fwc1tnYXBzLmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRnYXBzID0gW107XG5cblx0XHRcdFx0aWYgKG51bGxIZWFkKVxuXHRcdFx0XHRcdGdhcHMucHVzaChoZWFkR2FwKTtcblx0XHRcdFx0aWYgKG51bGxUYWlsKVxuXHRcdFx0XHRcdGdhcHMucHVzaCh0YWlsR2FwKTtcblx0XHRcdH1cblxuXHRcdFx0Y2xpcCA9IG5ldyBQYXRoMkQoKTtcblxuXHRcdFx0bGV0IHByZXZHYXBFbmQgPSBwbG90TGZ0O1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGdhcHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IGcgPSBnYXBzW2ldO1xuXG5cdFx0XHRcdGNsaXAucmVjdChwcmV2R2FwRW5kLCBwbG90VG9wLCBnWzBdIC0gcHJldkdhcEVuZCwgcGxvdFRvcCArIHBsb3RIZ3QpO1xuXG5cdFx0XHRcdHByZXZHYXBFbmQgPSBnWzFdO1xuXHRcdFx0fVxuXG5cdFx0XHRjbGlwLnJlY3QocHJldkdhcEVuZCwgcGxvdFRvcCwgcGxvdExmdCArIHBsb3RXaWQgLSBwcmV2R2FwRW5kLCBwbG90VG9wICsgcGxvdEhndCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsaXA7XG5cdH1cblxuXHRmdW5jdGlvbiBhZGRHYXAoZ2Fwcywgb3V0WCwgeCkge1xuXHRcdGxldCBwcmV2R2FwID0gZ2Fwc1tnYXBzLmxlbmd0aCAtIDFdO1xuXG5cdFx0aWYgKHByZXZHYXAgJiYgcHJldkdhcFswXSA9PSBvdXRYKVx0XHRcdC8vIFRPRE86IGdhcHMgbXVzdCBiZSBlbmNvZGVkIGF0IHN0cm9rZSB3aWR0aHM/XG5cdFx0XHRwcmV2R2FwWzFdID0geDtcblx0XHRlbHNlXG5cdFx0XHRnYXBzLnB1c2goW291dFgsIHhdKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGJ1aWxkUGF0aHMoc2VsZiwgaXMsIF9pMCwgX2kxKSB7XG5cdFx0Y29uc3QgcyA9IHNlcmllc1tpc107XG5cblx0XHRjb25zdCB4ZGF0YSAgPSBkYXRhWzBdO1xuXHRcdGNvbnN0IHlkYXRhICA9IGRhdGFbaXNdO1xuXHRcdGNvbnN0IHNjYWxlWCA9IHNjYWxlc1t4U2NhbGVLZXldO1xuXHRcdGNvbnN0IHNjYWxlWSA9IHNjYWxlc1tzLnNjYWxlXTtcblxuXHRcdGNvbnN0IF9wYXRocyA9IGRpciA9PSAxID8ge3N0cm9rZTogbmV3IFBhdGgyRCgpLCBmaWxsOiBudWxsLCBjbGlwOiBudWxsfSA6IHNlcmllc1tpcy0xXS5fcGF0aHM7XG5cdFx0Y29uc3Qgc3Ryb2tlID0gX3BhdGhzLnN0cm9rZTtcblx0XHRjb25zdCB3aWR0aCA9IHJvdW5kMyhzW1dJRFRIXSAqIHB4UmF0aW8pO1xuXG5cdFx0bGV0IG1pblkgPSBpbmYsXG5cdFx0XHRtYXhZID0gLWluZixcblx0XHRcdG91dFksIG91dFg7XG5cblx0XHQvLyB0b2RvOiBkb24ndCBidWlsZCBnYXBzIG9uIGRpciA9IC0xIHBhc3Ncblx0XHRsZXQgZ2FwcyA9IFtdO1xuXG5cdFx0bGV0IGFjY1ggPSByb3VuZChnZXRYUG9zKHhkYXRhW2RpciA9PSAxID8gX2kwIDogX2kxXSwgc2NhbGVYLCBwbG90V2lkLCBwbG90TGZ0KSk7XG5cblx0XHQvLyB0aGUgbW92ZXMgdGhlIHNoYXBlIGVkZ2Ugb3V0c2lkZSB0aGUgY2FudmFzIHNvIHN0cm9rZSBkb2VzbnQgYmxlZWQgaW5cblx0XHRpZiAocy5iYW5kICYmIGRpciA9PSAxICYmIF9pMCA9PSBpMCkge1xuXHRcdFx0aWYgKHdpZHRoKVxuXHRcdFx0XHRzdHJva2UubGluZVRvKC13aWR0aCwgcm91bmQoZ2V0WVBvcyh5ZGF0YVtfaTBdLCBzY2FsZVksIHBsb3RIZ3QsIHBsb3RUb3ApKSk7XG5cblx0XHRcdGlmIChzY2FsZVgubWluIDwgeGRhdGFbMF0pXG5cdFx0XHRcdGdhcHMucHVzaChbcGxvdExmdCwgYWNjWCAtIDFdKTtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gZGlyID09IDEgPyBfaTAgOiBfaTE7IGkgPj0gX2kwICYmIGkgPD0gX2kxOyBpICs9IGRpcikge1xuXHRcdFx0bGV0IHggPSByb3VuZChnZXRYUG9zKHhkYXRhW2ldLCBzY2FsZVgsIHBsb3RXaWQsIHBsb3RMZnQpKTtcblxuXHRcdFx0aWYgKHggPT0gYWNjWCkge1xuXHRcdFx0XHRpZiAoeWRhdGFbaV0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdG91dFkgPSByb3VuZChnZXRZUG9zKHlkYXRhW2ldLCBzY2FsZVksIHBsb3RIZ3QsIHBsb3RUb3ApKTtcblx0XHRcdFx0XHRtaW5ZID0gbWluKG91dFksIG1pblkpO1xuXHRcdFx0XHRcdG1heFkgPSBtYXgob3V0WSwgbWF4WSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRsZXQgX2FkZEdhcCA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChtaW5ZICE9IGluZikge1xuXHRcdFx0XHRcdHN0cm9rZS5saW5lVG8oYWNjWCwgbWluWSk7XG5cdFx0XHRcdFx0c3Ryb2tlLmxpbmVUbyhhY2NYLCBtYXhZKTtcblx0XHRcdFx0XHRzdHJva2UubGluZVRvKGFjY1gsIG91dFkpO1xuXHRcdFx0XHRcdG91dFggPSBhY2NYO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRfYWRkR2FwID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoeWRhdGFbaV0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdG91dFkgPSByb3VuZChnZXRZUG9zKHlkYXRhW2ldLCBzY2FsZVksIHBsb3RIZ3QsIHBsb3RUb3ApKTtcblx0XHRcdFx0XHRzdHJva2UubGluZVRvKHgsIG91dFkpO1xuXHRcdFx0XHRcdG1pblkgPSBtYXhZID0gb3V0WTtcblxuXHRcdFx0XHRcdC8vIHByaW9yIHBpeGVsIGNhbiBoYXZlIGRhdGEgYnV0IHN0aWxsIHN0YXJ0IGEgZ2FwIGlmIGVuZHMgd2l0aCBudWxsXG5cdFx0XHRcdFx0aWYgKHggLSBhY2NYID4gMSAmJiB5ZGF0YVtpLTFdID09IG51bGwpXG5cdFx0XHRcdFx0XHRfYWRkR2FwID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRtaW5ZID0gaW5mO1xuXHRcdFx0XHRcdG1heFkgPSAtaW5mO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X2FkZEdhcCAmJiBhZGRHYXAoZ2Fwcywgb3V0WCwgeCk7XG5cblx0XHRcdFx0YWNjWCA9IHg7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gZXh0ZW5kIG9yIGluc2VydCByaWdodG1vc3QgZ2FwIGlmIG5vIGRhdGEgZXhpc3RzIHRvIHRoZSByaWdodFxuXHRcdGlmICh5ZGF0YVtfaTFdID09IG51bGwpXG5cdFx0XHRhZGRHYXAoZ2Fwcywgb3V0WCwgYWNjWCk7XG5cblx0XHRpZiAocy5iYW5kKSB7XG5cdFx0XHRsZXQgb3ZlclNob290ID0gd2lkdGggKiAxMDAsIF9peSwgX3g7XG5cblx0XHRcdC8vIHRoZSBtb3ZlcyB0aGUgc2hhcGUgZWRnZSBvdXRzaWRlIHRoZSBjYW52YXMgc28gc3Ryb2tlIGRvZXNudCBibGVlZCBpblxuXHRcdFx0aWYgKGRpciA9PSAtMSAmJiBfaTAgPT0gaTApIHtcblx0XHRcdFx0X3ggPSBwbG90TGZ0IC0gb3ZlclNob290O1xuXHRcdFx0XHRfaXkgPSBfaTA7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkaXIgPT0gMSAmJiBfaTEgPT0gaTEpIHtcblx0XHRcdFx0X3ggPSBwbG90TGZ0ICsgcGxvdFdpZCArIG92ZXJTaG9vdDtcblx0XHRcdFx0X2l5ID0gX2kxO1xuXG5cdFx0XHRcdGlmIChzY2FsZVgubWF4ID4geGRhdGFbZGF0YUxlbiAtIDFdKVxuXHRcdFx0XHRcdGdhcHMucHVzaChbYWNjWCwgcGxvdExmdCArIHBsb3RXaWRdKTtcblx0XHRcdH1cblxuXHRcdFx0c3Ryb2tlLmxpbmVUbyhfeCwgcm91bmQoZ2V0WVBvcyh5ZGF0YVtfaXldLCBzY2FsZVksIHBsb3RIZ3QsIHBsb3RUb3ApKSk7XG5cdFx0fVxuXG5cdFx0aWYgKGRpciA9PSAxKSB7XG5cdFx0XHRfcGF0aHMuY2xpcCA9IGJ1aWxkQ2xpcChpcywgZ2FwcywgeWRhdGFbX2kwXSA9PSBudWxsLCB5ZGF0YVtfaTFdID09IG51bGwpO1xuXG5cdFx0XHRpZiAocy5maWxsICE9IG51bGwpIHtcblx0XHRcdFx0bGV0IGZpbGwgPSBfcGF0aHMuZmlsbCA9IG5ldyBQYXRoMkQoc3Ryb2tlKTtcblxuXHRcdFx0XHRsZXQgemVyb1kgPSByb3VuZChnZXRZUG9zKDAsIHNjYWxlWSwgcGxvdEhndCwgcGxvdFRvcCkpO1xuXHRcdFx0XHRmaWxsLmxpbmVUbyhwbG90TGZ0ICsgcGxvdFdpZCwgemVyb1kpO1xuXHRcdFx0XHRmaWxsLmxpbmVUbyhwbG90TGZ0LCB6ZXJvWSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHMuYmFuZClcblx0XHRcdGRpciAqPSAtMTtcblxuXHRcdHJldHVybiBfcGF0aHM7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRJbmNyU3BhY2UoYXhpcywgbWluLCBtYXgsIGZ1bGxEaW0pIHtcblx0XHRsZXQgaW5jclNwYWNlO1xuXG5cdFx0aWYgKGZ1bGxEaW0gPD0gMClcblx0XHRcdGluY3JTcGFjZSA9IFswLCAwXTtcblx0XHRlbHNlIHtcblx0XHRcdGxldCBtaW5TcGFjZSA9IGF4aXMuc3BhY2Uoc2VsZiwgbWluLCBtYXgsIGZ1bGxEaW0pO1xuXHRcdFx0bGV0IGluY3JzID0gYXhpcy5pbmNycyhzZWxmLCBtaW4sIG1heCwgZnVsbERpbSwgbWluU3BhY2UpO1xuXHRcdFx0aW5jclNwYWNlID0gZmluZEluY3IobWF4IC0gbWluLCBpbmNycywgZnVsbERpbSwgbWluU3BhY2UpO1xuXHRcdFx0aW5jclNwYWNlLnB1c2goaW5jclNwYWNlWzFdL21pblNwYWNlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5jclNwYWNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gZHJhd09ydGhvTGluZXMob2Zmcywgb3JpLCBzaWRlLCBwb3MwLCBsZW4sIHdpZHRoLCBzdHJva2UsIGRhc2gpIHtcblx0XHRsZXQgb2Zmc2V0ID0gKHdpZHRoICUgMikgLyAyO1xuXG5cdFx0Y3R4LnRyYW5zbGF0ZShvZmZzZXQsIG9mZnNldCk7XG5cblx0XHRzZXRDdHhTdHlsZShzdHJva2UsIHdpZHRoLCBkYXNoKTtcblxuXHRcdGN0eC5iZWdpblBhdGgoKTtcblxuXHRcdGxldCB4MCwgeTAsIHgxLCB5MSwgcG9zMSA9IHBvczAgKyAoc2lkZSA9PSAwIHx8IHNpZGUgPT0gMyA/IC1sZW4gOiBsZW4pO1xuXG5cdFx0aWYgKG9yaSA9PSAwKSB7XG5cdFx0XHR5MCA9IHBvczA7XG5cdFx0XHR5MSA9IHBvczE7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0eDAgPSBwb3MwO1xuXHRcdFx0eDEgPSBwb3MxO1xuXHRcdH1cblxuXHRcdG9mZnMuZm9yRWFjaCgob2ZmLCBpKSA9PiB7XG5cdFx0XHRpZiAob3JpID09IDApXG5cdFx0XHRcdHgwID0geDEgPSBvZmY7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHkwID0geTEgPSBvZmY7XG5cblx0XHRcdGN0eC5tb3ZlVG8oeDAsIHkwKTtcblx0XHRcdGN0eC5saW5lVG8oeDEsIHkxKTtcblx0XHR9KTtcblxuXHRcdGN0eC5zdHJva2UoKTtcblxuXHRcdGN0eC50cmFuc2xhdGUoLW9mZnNldCwgLW9mZnNldCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkcmF3QXhlc0dyaWQoKSB7XG5cdFx0YXhlcy5mb3JFYWNoKChheGlzLCBpKSA9PiB7XG5cdFx0XHRpZiAoIWF4aXMuc2hvdylcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRsZXQgc2NhbGUgPSBzY2FsZXNbYXhpcy5zY2FsZV07XG5cblx0XHRcdC8vIHRoaXMgd2lsbCBoYXBwZW4gaWYgYWxsIHNlcmllcyB1c2luZyBhIHNwZWNpZmljIHNjYWxlIGFyZSB0b2dnbGVkIG9mZlxuXHRcdFx0aWYgKHNjYWxlLm1pbiA9PSBpbmYpXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0bGV0IHNpZGUgPSBheGlzLnNpZGU7XG5cdFx0XHRsZXQgb3JpID0gc2lkZSAlIDI7XG5cblx0XHRcdGxldCB7bWluLCBtYXh9ID0gc2NhbGU7XG5cblx0XHRcdGxldCBbaW5jciwgc3BhY2UsIHBjdFNwYWNlXSA9IGdldEluY3JTcGFjZShheGlzLCBtaW4sIG1heCwgb3JpID09IDAgPyBwbG90V2lkQ3NzIDogcGxvdEhndENzcyk7XG5cblx0XHRcdC8vIGlmIHdlJ3JlIHVzaW5nIGluZGV4IHBvc2l0aW9ucywgZm9yY2UgZmlyc3QgdGljayB0byBtYXRjaCBwYXNzZWQgaW5kZXhcblx0XHRcdGxldCBmb3JjZU1pbiA9IHNjYWxlLmRpc3RyID09IDI7XG5cblx0XHRcdGxldCBzcGxpdHMgPSBheGlzLnNwbGl0KHNlbGYsIG1pbiwgbWF4LCBpbmNyLCBwY3RTcGFjZSwgZm9yY2VNaW4pO1xuXG5cdFx0XHRsZXQgZ2V0UG9zICA9IG9yaSA9PSAwID8gZ2V0WFBvcyA6IGdldFlQb3M7XG5cdFx0XHRsZXQgcGxvdERpbSA9IG9yaSA9PSAwID8gcGxvdFdpZCA6IHBsb3RIZ3Q7XG5cdFx0XHRsZXQgcGxvdE9mZiA9IG9yaSA9PSAwID8gcGxvdExmdCA6IHBsb3RUb3A7XG5cblx0XHRcdGxldCBjYW5PZmZzID0gc3BsaXRzLm1hcCh2YWwgPT4gcm91bmQoZ2V0UG9zKHZhbCwgc2NhbGUsIHBsb3REaW0sIHBsb3RPZmYpKSk7XG5cblx0XHRcdGxldCBheGlzR2FwICA9IHJvdW5kKGF4aXMuZ2FwICogcHhSYXRpbyk7XG5cblx0XHRcdGxldCB0aWNrcyA9IGF4aXMudGlja3M7XG5cdFx0XHRsZXQgdGlja1NpemUgPSB0aWNrcy5zaG93ID8gcm91bmQodGlja3Muc2l6ZSAqIHB4UmF0aW8pIDogMDtcblxuXHRcdFx0Ly8gdGljayBsYWJlbHNcblx0XHRcdC8vIEJPTyB0aGlzIGFzc3VtZXMgYSBzcGVjaWZpYyBkYXRhL3Nlcmllc1xuXHRcdFx0bGV0IHZhbHVlcyA9IGF4aXMudmFsdWVzKFxuXHRcdFx0XHRzZWxmLFxuXHRcdFx0XHRzY2FsZS5kaXN0ciA9PSAyID8gc3BsaXRzLm1hcChpID0+IGRhdGEwW2ldKSA6IHNwbGl0cyxcblx0XHRcdFx0c3BhY2UsXG5cdFx0XHRcdHNjYWxlLmRpc3RyID09IDIgPyBkYXRhMFtzcGxpdHNbMV1dIC0gIGRhdGEwW3NwbGl0c1swXV0gOiBpbmNyLFxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gcm90YXRpbmcgb2YgbGFiZWxzIG9ubHkgc3VwcG9ydGVkIG9uIGJvdHRvbSB4IGF4aXNcblx0XHRcdGxldCBhbmdsZSA9IHNpZGUgPT0gMiA/IGF4aXMucm90YXRlKHNlbGYsIHZhbHVlcywgc3BhY2UpICogLVBJLzE4MCA6IDA7XG5cblx0XHRcdGxldCBiYXNlUG9zICA9IHJvdW5kKGF4aXMuX3BvcyAqIHB4UmF0aW8pO1xuXHRcdFx0bGV0IHNoaWZ0QW10ID0gdGlja1NpemUgKyBheGlzR2FwO1xuXHRcdFx0bGV0IHNoaWZ0RGlyID0gb3JpID09IDAgJiYgc2lkZSA9PSAwIHx8IG9yaSA9PSAxICYmIHNpZGUgPT0gMyA/IC0xIDogMTtcblx0XHRcdGxldCBmaW5hbFBvcyA9IGJhc2VQb3MgKyBzaGlmdEFtdCAqIHNoaWZ0RGlyO1xuXHRcdFx0bGV0IHkgICAgICAgID0gb3JpID09IDAgPyBmaW5hbFBvcyA6IDA7XG5cdFx0XHRsZXQgeCAgICAgICAgPSBvcmkgPT0gMSA/IGZpbmFsUG9zIDogMDtcblxuXHRcdFx0Y3R4LmZvbnQgICAgICAgICA9IGF4aXMuZm9udFswXTtcblx0XHRcdGN0eC5maWxsU3R5bGUgICAgPSBheGlzLnN0cm9rZSB8fCBoZXhCbGFjaztcdFx0XHRcdFx0XHRcdFx0XHQvLyByZ2JhP1xuXHRcdFx0Y3R4LnRleHRBbGlnbiAgICA9IGFuZ2xlID4gMCA/IExFRlQgOlxuXHRcdFx0ICAgICAgICAgICAgICAgICAgIGFuZ2xlIDwgMCA/IFJJR0hUIDpcblx0XHRcdCAgICAgICAgICAgICAgICAgICBvcmkgPT0gMCA/IFwiY2VudGVyXCIgOiBzaWRlID09IDMgPyBSSUdIVCA6IExFRlQ7XG5cdFx0XHRjdHgudGV4dEJhc2VsaW5lID0gYW5nbGUgfHxcblx0XHRcdCAgICAgICAgICAgICAgICAgICBvcmkgPT0gMSA/IFwibWlkZGxlXCIgOiBzaWRlID09IDIgPyBUT1AgICA6IEJPVFRPTTtcblxuXHRcdFx0bGV0IGxpbmVIZWlnaHQgICA9IGF4aXMuZm9udFsxXSAqIGxpbmVNdWx0O1xuXG5cdFx0XHR2YWx1ZXMuZm9yRWFjaCgodmFsLCBpKSA9PiB7XG5cdFx0XHRcdGlmIChvcmkgPT0gMClcblx0XHRcdFx0XHR4ID0gY2FuT2Zmc1tpXTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHkgPSBjYW5PZmZzW2ldO1xuXG5cdFx0XHRcdChcIlwiK3ZhbCkuc3BsaXQoL1xcbi9nbSkuZm9yRWFjaCgodGV4dCwgaikgPT4ge1xuXHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdFx0XHRcdGN0eC50cmFuc2xhdGUoeCwgeSArIGogKiBsaW5lSGVpZ2h0KTtcblx0XHRcdFx0XHRcdGN0eC5yb3RhdGUoYW5nbGUpO1xuXHRcdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KHRleHQsIDAsIDApO1xuXHRcdFx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0Y3R4LmZpbGxUZXh0KHRleHQsIHgsIHkgKyBqICogbGluZUhlaWdodCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIGF4aXMgbGFiZWxcblx0XHRcdGlmIChheGlzLmxhYmVsKSB7XG5cdFx0XHRcdGN0eC5zYXZlKCk7XG5cblx0XHRcdFx0bGV0IGJhc2VMcG9zID0gcm91bmQoYXhpcy5fbHBvcyAqIHB4UmF0aW8pO1xuXG5cdFx0XHRcdGlmIChvcmkgPT0gMSkge1xuXHRcdFx0XHRcdHggPSB5ID0gMDtcblxuXHRcdFx0XHRcdGN0eC50cmFuc2xhdGUoXG5cdFx0XHRcdFx0XHRiYXNlTHBvcyxcblx0XHRcdFx0XHRcdHJvdW5kKHBsb3RUb3AgKyBwbG90SGd0IC8gMiksXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRjdHgucm90YXRlKChzaWRlID09IDMgPyAtUEkgOiBQSSkgLyAyKTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHggPSByb3VuZChwbG90TGZ0ICsgcGxvdFdpZCAvIDIpO1xuXHRcdFx0XHRcdHkgPSBiYXNlTHBvcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGN0eC5mb250ICAgICAgICAgPSBheGlzLmxhYmVsRm9udFswXTtcblx0XHRcdC8vXHRjdHguZmlsbFN0eWxlICAgID0gYXhpcy5sYWJlbFN0cm9rZSB8fCBoZXhCbGFjaztcdFx0XHRcdFx0XHQvLyByZ2JhP1xuXHRcdFx0XHRjdHgudGV4dEFsaWduICAgID0gXCJjZW50ZXJcIjtcblx0XHRcdFx0Y3R4LnRleHRCYXNlbGluZSA9IHNpZGUgPT0gMiA/IFRPUCA6IEJPVFRPTTtcblxuXHRcdFx0XHRjdHguZmlsbFRleHQoYXhpcy5sYWJlbCwgeCwgeSk7XG5cblx0XHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdGlja3Ncblx0XHRcdGlmICh0aWNrcy5zaG93KSB7XG5cdFx0XHRcdGRyYXdPcnRob0xpbmVzKFxuXHRcdFx0XHRcdGNhbk9mZnMsXG5cdFx0XHRcdFx0b3JpLFxuXHRcdFx0XHRcdHNpZGUsXG5cdFx0XHRcdFx0YmFzZVBvcyxcblx0XHRcdFx0XHR0aWNrU2l6ZSxcblx0XHRcdFx0XHRyb3VuZDModGlja3NbV0lEVEhdICogcHhSYXRpbyksXG5cdFx0XHRcdFx0dGlja3Muc3Ryb2tlLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBncmlkXG5cdFx0XHRsZXQgZ3JpZCA9IGF4aXMuZ3JpZDtcblxuXHRcdFx0aWYgKGdyaWQuc2hvdykge1xuXHRcdFx0XHRkcmF3T3J0aG9MaW5lcyhcblx0XHRcdFx0XHRjYW5PZmZzLFxuXHRcdFx0XHRcdG9yaSxcblx0XHRcdFx0XHRvcmkgPT0gMCA/IDIgOiAxLFxuXHRcdFx0XHRcdG9yaSA9PSAwID8gcGxvdFRvcCA6IHBsb3RMZnQsXG5cdFx0XHRcdFx0b3JpID09IDAgPyBwbG90SGd0IDogcGxvdFdpZCxcblx0XHRcdFx0XHRyb3VuZDMoZ3JpZFtXSURUSF0gKiBweFJhdGlvKSxcblx0XHRcdFx0XHRncmlkLnN0cm9rZSxcblx0XHRcdFx0XHRncmlkLmRhc2gsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRmaXJlKFwiZHJhd0F4ZXNcIik7XG5cdH1cblxuXHRmdW5jdGlvbiByZXNldFlTZXJpZXMoKSB7XG5cdC8vXHRsb2coXCJyZXNldFlTZXJpZXMoKVwiLCBhcmd1bWVudHMpO1xuXG5cdFx0c2VyaWVzLmZvckVhY2goKHMsIGkpID0+IHtcblx0XHRcdGlmIChpID4gMCkge1xuXHRcdFx0XHRzLm1pbiA9IGluZjtcblx0XHRcdFx0cy5tYXggPSAtaW5mO1xuXHRcdFx0XHRzLl9wYXRocyA9IG51bGw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRsZXQgZGlkUGFpbnQ7XG5cblx0ZnVuY3Rpb24gcGFpbnQoKSB7XG5cdFx0aWYgKGluQmF0Y2gpIHtcblx0XHRcdHNob3VsZFBhaW50ID0gdHJ1ZTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0Ly9cdGxvZyhcInBhaW50KClcIiwgYXJndW1lbnRzKTtcblxuXHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FuW1dJRFRIXSwgY2FuW0hFSUdIVF0pO1xuXHRcdGZpcmUoXCJkcmF3Q2xlYXJcIik7XG5cdFx0ZHJhd0F4ZXNHcmlkKCk7XG5cdFx0ZHJhd1NlcmllcygpO1xuXHRcdGRpZFBhaW50ID0gdHJ1ZTtcblx0XHRmaXJlKFwiZHJhd1wiKTtcblx0fVxuXG5cdHNlbGYucmVkcmF3ID0gcmVidWlsZFBhdGhzID0+IHtcblx0XHRpZiAocmVidWlsZFBhdGhzICE9PSBmYWxzZSlcblx0XHRcdF9zZXRTY2FsZSh4U2NhbGVLZXksIHNjYWxlc1t4U2NhbGVLZXldLm1pbiwgc2NhbGVzW3hTY2FsZUtleV0ubWF4KTtcblx0XHRlbHNlXG5cdFx0XHRwYWludCgpO1xuXHR9O1xuXG5cdC8vIHJlZHJhdygpID0+IHNldFNjYWxlKCd4Jywgc2NhbGVzLngubWluLCBzY2FsZXMueC5tYXgpO1xuXG5cdC8vIGV4cGxpY2l0LCBuZXZlciByZS1yYW5nZWQgKGlzIHRoaXMgYWN0dWFsbHkgdHJ1ZT8gZm9yIHggYW5kIHkpXG5cdGZ1bmN0aW9uIHNldFNjYWxlKGtleSwgb3B0cykge1xuXHRcdGxldCBzYyA9IHNjYWxlc1trZXldO1xuXG5cdFx0aWYgKHNjLmZyb20gPT0gbnVsbCkge1xuXHRcdFx0aWYgKGtleSA9PSB4U2NhbGVLZXkpIHtcblx0XHRcdFx0aWYgKHNjLmRpc3RyID09IDIpIHtcblx0XHRcdFx0XHRvcHRzLm1pbiA9IGNsb3Nlc3RJZHgob3B0cy5taW4sIGRhdGFbMF0pO1xuXHRcdFx0XHRcdG9wdHMubWF4ID0gY2xvc2VzdElkeChvcHRzLm1heCwgZGF0YVswXSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBwcmV2ZW50IHNldHRpbmcgYSB0ZW1wb3JhbCB4IHNjYWxlIHRvbyBzbWFsbCBzaW5jZSBEYXRlIG9iamVjdHMgY2Fubm90IGFkdmFuY2UgdGlja3Mgc21hbGxlciB0aGFuIDFtc1xuXHRcdFx0XHRpZiAoIHNjLnRpbWUgJiYgYXhlc1swXS5zaG93ICYmIG9wdHMubWF4ID4gb3B0cy5taW4pIHtcblx0XHRcdFx0XHQvLyBzaW5jZSBzY2FsZXMgYW5kIGF4ZXMgYXJlIGxvb3NseSBjb3VwbGVkLCB3ZSBoYXZlIHRvIG1ha2Ugc29tZSBhc3N1bXB0aW9ucyBoZXJlIDooXG5cdFx0XHRcdFx0bGV0IGluY3IgPSBnZXRJbmNyU3BhY2UoYXhlc1swXSwgb3B0cy5taW4sIG9wdHMubWF4LCBwbG90V2lkQ3NzKVswXTtcblxuXHRcdFx0XHRcdGlmIChpbmNyIDwgMWUtMylcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Ly9cdGxvZyhcInNldFNjYWxlKClcIiwgYXJndW1lbnRzKTtcblxuXHRcdFx0cGVuZFNjYWxlc1trZXldID0gb3B0cztcblxuXHRcdFx0ZGlkUGFpbnQgPSBmYWxzZTtcblx0XHRcdHNldFNjYWxlcygpO1xuXHRcdFx0IWRpZFBhaW50ICYmIHBhaW50KCk7XG5cdFx0XHRkaWRQYWludCA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHNlbGYuc2V0U2NhbGUgPSBzZXRTY2FsZTtcblxuLy9cdElOVEVSQUNUSU9OXG5cblx0bGV0IHZ0O1xuXHRsZXQgaHo7XG5cblx0Ly8gc3RhcnRpbmcgcG9zaXRpb25cblx0bGV0IG1vdXNlTGVmdDA7XG5cdGxldCBtb3VzZVRvcDA7XG5cblx0Ly8gY3VycmVudCBwb3NpdGlvblxuXHRsZXQgbW91c2VMZWZ0MTtcblx0bGV0IG1vdXNlVG9wMTtcblxuXHRsZXQgZHJhZ2dpbmcgPSBmYWxzZTtcblxuXHRjb25zdCBkcmFnID0gIGN1cnNvci5kcmFnO1xuXG5cdGxldCBkcmFnWCA9ICBkcmFnLng7XG5cdGxldCBkcmFnWSA9ICBkcmFnLnk7XG5cblx0aWYgKCBjdXJzb3Iuc2hvdykge1xuXHRcdGxldCBjID0gXCJjdXJzb3ItXCI7XG5cblx0XHRpZiAoY3Vyc29yLngpIHtcblx0XHRcdG1vdXNlTGVmdDEgPSBjdXJzb3IubGVmdDtcblx0XHRcdHZ0ID0gcGxhY2VEaXYoYyArIFwieFwiLCBvdmVyKTtcblx0XHR9XG5cblx0XHRpZiAoY3Vyc29yLnkpIHtcblx0XHRcdG1vdXNlVG9wMSA9IGN1cnNvci50b3A7XG5cdFx0XHRoeiA9IHBsYWNlRGl2KGMgKyBcInlcIiwgb3Zlcik7XG5cdFx0fVxuXHR9XG5cblx0Y29uc3Qgc2VsZWN0ID0gc2VsZi5zZWxlY3QgPSBhc3NpZ24oe1xuXHRcdHNob3c6ICAgdHJ1ZSxcblx0XHRsZWZ0Olx0MCxcblx0XHR3aWR0aDpcdDAsXG5cdFx0dG9wOlx0MCxcblx0XHRoZWlnaHQ6XHQwLFxuXHR9LCBvcHRzLnNlbGVjdCk7XG5cblx0Y29uc3Qgc2VsZWN0RGl2ID0gc2VsZWN0LnNob3cgPyBwbGFjZURpdihcInNlbGVjdFwiLCBvdmVyKSA6IG51bGw7XG5cblx0ZnVuY3Rpb24gc2V0U2VsZWN0KG9wdHMsIF9maXJlKSB7XG5cdFx0aWYgKHNlbGVjdC5zaG93KSB7XG5cdFx0XHRmb3IgKGxldCBwcm9wIGluIG9wdHMpXG5cdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBwcm9wLCBzZWxlY3RbcHJvcF0gPSBvcHRzW3Byb3BdKTtcblxuXHRcdFx0X2ZpcmUgIT09IGZhbHNlICYmIGZpcmUoXCJzZXRTZWxlY3RcIik7XG5cdFx0fVxuXHR9XG5cblx0c2VsZi5zZXRTZWxlY3QgPSBzZXRTZWxlY3Q7XG5cblx0ZnVuY3Rpb24gdG9nZ2xlRE9NKGksIG9uT2ZmKSB7XG5cdFx0bGV0IHMgPSBzZXJpZXNbaV07XG5cdFx0bGV0IGxhYmVsID0gc2hvd0xlZ2VuZCA/IGxlZ2VuZFJvd3NbaV1bMF0ucGFyZW50Tm9kZSA6IG51bGw7XG5cblx0XHRpZiAocy5zaG93KVxuXHRcdFx0bGFiZWwgJiYgcmVtQ2xhc3MobGFiZWwsIFwib2ZmXCIpO1xuXHRcdGVsc2Uge1xuXHRcdFx0bGFiZWwgJiYgYWRkQ2xhc3MobGFiZWwsIFwib2ZmXCIpO1xuXHRcdFx0IGN1cnNvclB0cy5sZW5ndGggPiAxICYmIHRyYW5zKGN1cnNvclB0c1tpXSwgMCwgLTEwKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfc2V0U2NhbGUoa2V5LCBtaW4sIG1heCkge1xuXHRcdHNldFNjYWxlKGtleSwge21pbiwgbWF4fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBzZXRTZXJpZXMoaSwgb3B0cywgcHViKSB7XG5cdC8vXHRsb2coXCJzZXRTZXJpZXMoKVwiLCBhcmd1bWVudHMpO1xuXG5cdFx0bGV0IHMgPSBzZXJpZXNbaV07XG5cblx0Ly9cdGJhdGNoKCgpID0+IHtcblx0XHRcdC8vIHdpbGwgdGhpcyBjYXVzZSByZWR1bmRhbnQgcGFpbnQoKSBpZiBib3RoIHNob3cgYW5kIGZvY3VzIGFyZSBzZXQ/XG5cdFx0XHRpZiAob3B0cy5mb2N1cyAhPSBudWxsKVxuXHRcdFx0XHRzZXRGb2N1cyhpKTtcblxuXHRcdFx0aWYgKG9wdHMuc2hvdyAhPSBudWxsKSB7XG5cdFx0XHRcdHMuc2hvdyA9IG9wdHMuc2hvdztcblx0XHRcdFx0IHRvZ2dsZURPTShpLCBvcHRzLnNob3cpO1xuXG5cdFx0XHRcdGlmIChzLmJhbmQpIHtcblx0XHRcdFx0XHQvLyBub3Qgc3VwZXIgcm9idXN0LCB3aWxsIGJyZWFrIGlmIHR3byBiYW5kcyBhcmUgYWRqYWNlbnRcblx0XHRcdFx0XHRsZXQgaXAgPSBzZXJpZXNbaSsxXSAmJiBzZXJpZXNbaSsxXS5iYW5kID8gaSsxIDogaS0xO1xuXHRcdFx0XHRcdHNlcmllc1tpcF0uc2hvdyA9IHMuc2hvdztcblx0XHRcdFx0XHQgdG9nZ2xlRE9NKGlwLCBvcHRzLnNob3cpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X3NldFNjYWxlKHhTY2FsZUtleSwgc2NhbGVzW3hTY2FsZUtleV0ubWluLCBzY2FsZXNbeFNjYWxlS2V5XS5tYXgpO1x0XHQvLyByZWRyYXdcblx0XHRcdH1cblx0Ly9cdH0pO1xuXG5cdFx0Ly8gZmlyaW5nIHNldFNlcmllcyBhZnRlciBzZXRTY2FsZSBzZWVtcyBvdXQgb2Ygb3JkZXIsIGJ1dCBwcm92aWRlcyBhY2Nlc3MgdG8gdGhlIHVwZGF0ZWQgcHJvcHNcblx0XHQvLyBjb3VsZCBpbXByb3ZlIGJ5IHByZWRlZmluaW5nIGZpcmluZyBvcmRlciBhbmQgYnVpbGRpbmcgYSBxdWV1ZVxuXHRcdGZpcmUoXCJzZXRTZXJpZXNcIiwgaSwgb3B0cyk7XG5cblx0XHQgcHViICYmIHN5bmMucHViKFwic2V0U2VyaWVzXCIsIHNlbGYsIGksIG9wdHMpO1xuXHR9XG5cblx0c2VsZi5zZXRTZXJpZXMgPSBzZXRTZXJpZXM7XG5cblx0ZnVuY3Rpb24gX2FscGhhKGksIHZhbHVlKSB7XG5cdFx0c2VyaWVzW2ldLmFscGhhID0gdmFsdWU7XG5cblx0XHRpZiAoIGxlZ2VuZFJvd3MpXG5cdFx0XHRsZWdlbmRSb3dzW2ldWzBdLnBhcmVudE5vZGUuc3R5bGUub3BhY2l0eSA9IHZhbHVlO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3NldEFscGhhKGksIHZhbHVlKSB7XG5cdFx0bGV0IHMgPSBzZXJpZXNbaV07XG5cblx0XHRfYWxwaGEoaSwgdmFsdWUpO1xuXG5cdFx0aWYgKHMuYmFuZCkge1xuXHRcdFx0Ly8gbm90IHN1cGVyIHJvYnVzdCwgd2lsbCBicmVhayBpZiB0d28gYmFuZHMgYXJlIGFkamFjZW50XG5cdFx0XHRsZXQgaXAgPSBzZXJpZXNbaSsxXS5iYW5kID8gaSsxIDogaS0xO1xuXHRcdFx0X2FscGhhKGlwLCB2YWx1ZSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8geS1kaXN0YW5jZVxuXHRjb25zdCBkaXN0c1RvQ3Vyc29yID0gIEFycmF5KHNlcmllcy5sZW5ndGgpO1xuXG5cdGxldCBmb2N1c2VkID0gbnVsbDtcblxuXHRmdW5jdGlvbiBzZXRGb2N1cyhpKSB7XG5cdFx0aWYgKGkgIT0gZm9jdXNlZCkge1xuXHRcdC8vXHRsb2coXCJzZXRGb2N1cygpXCIsIGFyZ3VtZW50cyk7XG5cblx0XHRcdHNlcmllcy5mb3JFYWNoKChzLCBpMikgPT4ge1xuXHRcdFx0XHRfc2V0QWxwaGEoaTIsIGkgPT0gbnVsbCB8fCBpMiA9PSAwIHx8IGkyID09IGkgPyAxIDogZm9jdXMuYWxwaGEpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZvY3VzZWQgPSBpO1xuXHRcdFx0cGFpbnQoKTtcblx0XHR9XG5cdH1cblxuXHRpZiAoc2hvd0xlZ2VuZCAmJiBjdXJzb3JGb2N1cykge1xuXHRcdG9uKG1vdXNlbGVhdmUsIGxlZ2VuZEVsLCBlID0+IHtcblx0XHRcdGlmIChjdXJzb3IubG9ja2VkKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRzZXRTZXJpZXMobnVsbCwge2ZvY3VzOiBmYWxzZX0sIHN5bmNPcHRzLnNldFNlcmllcyk7XG5cdFx0XHR1cGRhdGVDdXJzb3IoKTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNjYWxlVmFsdWVBdFBvcyhwb3MsIHNjYWxlKSB7XG5cdFx0bGV0IGRpbSA9IHBsb3RXaWRDc3M7XG5cblx0XHRpZiAoc2NhbGUgIT0geFNjYWxlS2V5KSB7XG5cdFx0XHRkaW0gPSBwbG90SGd0Q3NzO1xuXHRcdFx0cG9zID0gZGltIC0gcG9zO1xuXHRcdH1cblxuXHRcdGxldCBwY3QgPSBwb3MgLyBkaW07XG5cblx0XHRsZXQgc2MgPSBzY2FsZXNbc2NhbGVdO1xuXHRcdGxldCBkID0gc2MubWF4IC0gc2MubWluO1xuXHRcdHJldHVybiBzYy5taW4gKyBwY3QgKiBkO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xvc2VzdElkeEZyb21YcG9zKHBvcykge1xuXHRcdGxldCB2ID0gc2NhbGVWYWx1ZUF0UG9zKHBvcywgeFNjYWxlS2V5KTtcblx0XHRyZXR1cm4gY2xvc2VzdElkeCh2LCBkYXRhWzBdLCBpMCwgaTEpO1xuXHR9XG5cblx0c2VsZi52YWxUb0lkeCA9IHZhbCA9PiBjbG9zZXN0SWR4KHZhbCwgZGF0YVswXSk7XG5cdHNlbGYucG9zVG9JZHggPSBjbG9zZXN0SWR4RnJvbVhwb3M7XG5cdHNlbGYucG9zVG9WYWwgPSBzY2FsZVZhbHVlQXRQb3M7XG5cdHNlbGYudmFsVG9Qb3MgPSAodmFsLCBzY2FsZSwgY2FuKSA9PiAoXG5cdFx0c2NhbGUgPT0geFNjYWxlS2V5ID9cblx0XHRnZXRYUG9zKHZhbCwgc2NhbGVzW3NjYWxlXSxcblx0XHRcdGNhbiA/IHBsb3RXaWQgOiBwbG90V2lkQ3NzLFxuXHRcdFx0Y2FuID8gcGxvdExmdCA6IDAsXG5cdFx0KSA6XG5cdFx0Z2V0WVBvcyh2YWwsIHNjYWxlc1tzY2FsZV0sXG5cdFx0XHRjYW4gPyBwbG90SGd0IDogcGxvdEhndENzcyxcblx0XHRcdGNhbiA/IHBsb3RUb3AgOiAwLFxuXHRcdClcblx0KTtcblxuXHRsZXQgaW5CYXRjaCA9IGZhbHNlO1xuXHRsZXQgc2hvdWxkUGFpbnQgPSBmYWxzZTtcblx0bGV0IHNob3VsZFNldFNjYWxlcyA9IGZhbHNlO1xuXHRsZXQgc2hvdWxkVXBkYXRlQ3Vyc29yID0gZmFsc2U7XG5cblx0Ly8gZGVmZXJzIGNhbGxpbmcgZXhwZW5zaXZlIGZ1bmN0aW9uc1xuXHRmdW5jdGlvbiBiYXRjaChmbikge1xuXHRcdGluQmF0Y2ggPSB0cnVlO1xuXHRcdGZuKHNlbGYpO1xuXHRcdGluQmF0Y2ggPSBmYWxzZTtcblx0XHRzaG91bGRTZXRTY2FsZXMgJiYgc2V0U2NhbGVzKCk7XG5cdFx0IHNob3VsZFVwZGF0ZUN1cnNvciAmJiB1cGRhdGVDdXJzb3IoKTtcblx0XHRzaG91bGRQYWludCAmJiAhZGlkUGFpbnQgJiYgcGFpbnQoKTtcblx0XHRzaG91bGRTZXRTY2FsZXMgPSBzaG91bGRVcGRhdGVDdXJzb3IgPSBzaG91bGRQYWludCA9IGRpZFBhaW50ID0gaW5CYXRjaDtcblx0fVxuXG5cdHNlbGYuYmF0Y2ggPSBiYXRjaDtcblxuXHQgKHNlbGYuc2V0Q3Vyc29yID0gb3B0cyA9PiB7XG5cdFx0bW91c2VMZWZ0MSA9IG9wdHMubGVmdDtcblx0XHRtb3VzZVRvcDEgPSBvcHRzLnRvcDtcblx0Ly9cdGFzc2lnbihjdXJzb3IsIG9wdHMpO1xuXHRcdHVwZGF0ZUN1cnNvcigpO1xuXHR9KTtcblxuXHRsZXQgY3Vyc29yUmFmID0gMDtcblxuXHRmdW5jdGlvbiB1cGRhdGVDdXJzb3IodHMsIHNyYykge1xuXHRcdGlmIChpbkJhdGNoKSB7XG5cdFx0XHRzaG91bGRVcGRhdGVDdXJzb3IgPSB0cnVlO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHQvL1x0dHMgPT0gbnVsbCAmJiBsb2coXCJ1cGRhdGVDdXJzb3IoKVwiLCBhcmd1bWVudHMpO1xuXG5cdFx0Y3Vyc29yUmFmID0gMDtcblxuXHRcdGlmIChjdXJzb3Iuc2hvdykge1xuXHRcdFx0Y3Vyc29yLnggJiYgdHJhbnModnQscm91bmQobW91c2VMZWZ0MSksMCk7XG5cdFx0XHRjdXJzb3IueSAmJiB0cmFucyhoeiwwLHJvdW5kKG1vdXNlVG9wMSkpO1xuXHRcdH1cblxuXHRcdGxldCBpZHg7XG5cblx0XHQvLyB3aGVuIHpvb21pbmcgdG8gYW4geCBzY2FsZSByYW5nZSBiZXR3ZWVuIGRhdGFwb2ludHMgdGhlIGJpbmFyeSBzZWFyY2hcblx0XHQvLyBmb3IgbmVhcmVzdCBtaW4vbWF4IGluZGljZXMgcmVzdWx0cyBpbiB0aGlzIGNvbmRpdGlvbi4gY2hlYXAgaGFjayA6RFxuXHRcdGxldCBub0RhdGFJblJhbmdlID0gaTAgPiBpMTtcblxuXHRcdC8vIGlmIGN1cnNvciBoaWRkZW4sIGhpZGUgcG9pbnRzICYgY2xlYXIgbGVnZW5kIHZhbHNcblx0XHRpZiAobW91c2VMZWZ0MSA8IDAgfHwgZGF0YUxlbiA9PSAwIHx8IG5vRGF0YUluUmFuZ2UpIHtcblx0XHRcdGlkeCA9IG51bGw7XG5cblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgc2VyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChpID4gMCkge1xuXHRcdFx0XHRcdGRpc3RzVG9DdXJzb3JbaV0gPSBpbmY7XG5cdFx0XHRcdFx0IGN1cnNvclB0cy5sZW5ndGggPiAxICYmIHRyYW5zKGN1cnNvclB0c1tpXSwgLTEwLCAtMTApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHNob3dMZWdlbmQpIHtcblx0XHRcdFx0XHRpZiAoaSA9PSAwICYmIG11bHRpVmFsTGVnZW5kKVxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGxlZ2VuZFJvd3NbaV0ubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0XHRsZWdlbmRSb3dzW2ldW2pdW2ZpcnN0Q2hpbGRdLm5vZGVWYWx1ZSA9ICctLSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGN1cnNvckZvY3VzKVxuXHRcdFx0XHRzZXRTZXJpZXMobnVsbCwge2ZvY3VzOiB0cnVlfSwgc3luY09wdHMuc2V0U2VyaWVzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0Ly9cdGxldCBwY3RZID0gMSAtICh5IC8gcmVjdFtIRUlHSFRdKTtcblxuXHRcdFx0aWR4ID0gY2xvc2VzdElkeEZyb21YcG9zKG1vdXNlTGVmdDEpO1xuXG5cdFx0XHRsZXQgc2NYID0gc2NhbGVzW3hTY2FsZUtleV07XG5cblx0XHRcdGxldCB4UG9zID0gcm91bmQzKGdldFhQb3MoZGF0YVswXVtpZHhdLCBzY1gsIHBsb3RXaWRDc3MsIDApKTtcblxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZXJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bGV0IHMgPSBzZXJpZXNbaV07XG5cblx0XHRcdFx0aWYgKGkgPiAwICYmIHMuc2hvdykge1xuXHRcdFx0XHRcdGxldCB2YWxBdElkeCA9IGRhdGFbaV1baWR4XTtcblxuXHRcdFx0XHRcdGxldCB5UG9zID0gdmFsQXRJZHggPT0gbnVsbCA/IC0xMCA6IHJvdW5kMyhnZXRZUG9zKHZhbEF0SWR4LCBzY2FsZXNbcy5zY2FsZV0sIHBsb3RIZ3RDc3MsIDApKTtcblxuXHRcdFx0XHRcdGRpc3RzVG9DdXJzb3JbaV0gPSB5UG9zID4gMCA/IGFicyh5UG9zIC0gbW91c2VUb3AxKSA6IGluZjtcblxuXHRcdFx0XHRcdCBjdXJzb3JQdHMubGVuZ3RoID4gMSAmJiB0cmFucyhjdXJzb3JQdHNbaV0sIHhQb3MsIHlQb3MpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRkaXN0c1RvQ3Vyc29yW2ldID0gaW5mO1xuXG5cdFx0XHRcdGlmIChzaG93TGVnZW5kKSB7XG5cdFx0XHRcdFx0aWYgKGlkeCA9PSBjdXJzb3IuaWR4IHx8IGkgPT0gMCAmJiBtdWx0aVZhbExlZ2VuZClcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXG5cdFx0XHRcdFx0bGV0IHNyYyA9IGkgPT0gMCAmJiB4U2NhbGVEaXN0ciA9PSAyID8gZGF0YTAgOiBkYXRhW2ldO1xuXG5cdFx0XHRcdFx0bGV0IHZhbHMgPSBtdWx0aVZhbExlZ2VuZCA/IHMudmFsdWVzKHNlbGYsIGksIGlkeCkgOiB7Xzogcy52YWx1ZShzZWxmLCBzcmNbaWR4XSwgaSwgaWR4KX07XG5cblx0XHRcdFx0XHRsZXQgaiA9IDA7XG5cblx0XHRcdFx0XHRmb3IgKGxldCBrIGluIHZhbHMpXG5cdFx0XHRcdFx0XHRsZWdlbmRSb3dzW2ldW2orK11bZmlyc3RDaGlsZF0ubm9kZVZhbHVlID0gdmFsc1trXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIG5pdDogY3Vyc29yLmRyYWcuc2V0U2VsZWN0IGlzIGFzc3VtZWQgYWx3YXlzIHRydWVcblx0XHRpZiAoc2VsZWN0LnNob3cgJiYgZHJhZ2dpbmcpIHtcblx0XHRcdGxldCBkeCA9IGFicyhtb3VzZUxlZnQxIC0gbW91c2VMZWZ0MCk7XG5cdFx0XHRsZXQgZHkgPSBhYnMobW91c2VUb3AxIC0gbW91c2VUb3AwKTtcblxuXHRcdFx0aWYgKHNyYyAhPSBudWxsKSB7XG5cdFx0XHRcdGxldCBbeEtleSwgeUtleV0gPSBzeW5jT3B0cy5zY2FsZXM7XG5cblx0XHRcdFx0Ly8gbWF0Y2ggdGhlIGRyYWdYL2RyYWdZIGltcGxpY2l0bmVzcy9leHBsaWNpdG5lc3Mgb2Ygc3JjXG5cdFx0XHRcdGxldCBzZHJhZyA9IHNyYy5jdXJzb3IuZHJhZztcblx0XHRcdFx0ZHJhZ1ggPSBzZHJhZy5feDtcblx0XHRcdFx0ZHJhZ1kgPSBzZHJhZy5feTtcblxuXHRcdFx0XHRpZiAoeEtleSkge1xuXHRcdFx0XHRcdGxldCBzYyA9IHNjYWxlc1t4S2V5XTtcblx0XHRcdFx0XHRsZXQgc3JjTGVmdCA9IHNyYy5wb3NUb1ZhbChzcmMuc2VsZWN0W0xFRlRdLCB4S2V5KTtcblx0XHRcdFx0XHRsZXQgc3JjUmlnaHQgPSBzcmMucG9zVG9WYWwoc3JjLnNlbGVjdFtMRUZUXSArIHNyYy5zZWxlY3RbV0lEVEhdLCB4S2V5KTtcblxuXHRcdFx0XHRcdHNlbGVjdFtMRUZUXSA9IGdldFhQb3Moc3JjTGVmdCwgc2MsIHBsb3RXaWRDc3MsIDApO1xuXHRcdFx0XHRcdHNlbGVjdFtXSURUSF0gPSBhYnMoc2VsZWN0W0xFRlRdIC0gZ2V0WFBvcyhzcmNSaWdodCwgc2MsIHBsb3RXaWRDc3MsIDApKTtcblxuXHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBMRUZULCBzZWxlY3RbTEVGVF0pO1xuXHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBXSURUSCwgc2VsZWN0W1dJRFRIXSk7XG5cblx0XHRcdFx0XHRpZiAoIXlLZXkpIHtcblx0XHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBUT1AsIHNlbGVjdFtUT1BdID0gMCk7XG5cdFx0XHRcdFx0XHRzZXRTdHlsZVB4KHNlbGVjdERpdiwgSEVJR0hULCBzZWxlY3RbSEVJR0hUXSA9IHBsb3RIZ3RDc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh5S2V5KSB7XG5cdFx0XHRcdFx0bGV0IHNjID0gc2NhbGVzW3lLZXldO1xuXHRcdFx0XHRcdGxldCBzcmNUb3AgPSBzcmMucG9zVG9WYWwoc3JjLnNlbGVjdFtUT1BdLCB5S2V5KTtcblx0XHRcdFx0XHRsZXQgc3JjQm90dG9tID0gc3JjLnBvc1RvVmFsKHNyYy5zZWxlY3RbVE9QXSArIHNyYy5zZWxlY3RbSEVJR0hUXSwgeUtleSk7XG5cblx0XHRcdFx0XHRzZWxlY3RbVE9QXSA9IGdldFlQb3Moc3JjVG9wLCBzYywgcGxvdEhndENzcywgMCk7XG5cdFx0XHRcdFx0c2VsZWN0W0hFSUdIVF0gPSBhYnMoc2VsZWN0W1RPUF0gLSBnZXRZUG9zKHNyY0JvdHRvbSwgc2MsIHBsb3RIZ3RDc3MsIDApKTtcblxuXHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBUT1AsIHNlbGVjdFtUT1BdKTtcblx0XHRcdFx0XHRzZXRTdHlsZVB4KHNlbGVjdERpdiwgSEVJR0hULCBzZWxlY3RbSEVJR0hUXSk7XG5cblx0XHRcdFx0XHRpZiAoIXhLZXkpIHtcblx0XHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBMRUZULCBzZWxlY3RbTEVGVF0gPSAwKTtcblx0XHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBXSURUSCwgc2VsZWN0W1dJRFRIXSA9IHBsb3RXaWRDc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGRyYWdYID0gZHJhZy54ICYmIGR4ID49IGRyYWcuZGlzdDtcblx0XHRcdFx0ZHJhZ1kgPSBkcmFnLnkgJiYgZHkgPj0gZHJhZy5kaXN0O1xuXG5cdFx0XHRcdGxldCB1bmkgPSBkcmFnLnVuaTtcblxuXHRcdFx0XHRpZiAodW5pICE9IG51bGwpIHtcblx0XHRcdFx0XHQvLyBvbmx5IGNhbGMgZHJhZyBzdGF0dXMgaWYgdGhleSBwYXNzIHRoZSBkaXN0IHRocmVzaFxuXHRcdFx0XHRcdGlmIChkcmFnWCAmJiBkcmFnWSkge1xuXHRcdFx0XHRcdFx0ZHJhZ1ggPSBkeCA+PSB1bmk7XG5cdFx0XHRcdFx0XHRkcmFnWSA9IGR5ID49IHVuaTtcblxuXHRcdFx0XHRcdFx0Ly8gZm9yY2UgdW5pZGlyZWN0aW9uYWxpdHkgd2hlbiBib3RoIGFyZSB1bmRlciB1bmkgbGltaXRcblx0XHRcdFx0XHRcdGlmICghZHJhZ1ggJiYgIWRyYWdZKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChkeSA+IGR4KVxuXHRcdFx0XHRcdFx0XHRcdGRyYWdZID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGRyYWdYID0gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZHJhZy54ICYmIGRyYWcueSAmJiAoZHJhZ1ggfHwgZHJhZ1kpKVxuXHRcdFx0XHRcdC8vIGlmIG9tbmkgd2l0aCBubyB1bmkgdGhlbiBib3RoIGRyYWdYIC8gZHJhZ1kgc2hvdWxkIGJlIHRydWUgaWYgZWl0aGVyIGlzIHRydWVcblx0XHRcdFx0XHRkcmFnWCA9IGRyYWdZID0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAoZHJhZ1gpIHtcblx0XHRcdFx0XHRsZXQgbWluWCA9IG1pbihtb3VzZUxlZnQwLCBtb3VzZUxlZnQxKTtcblxuXHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBMRUZULCAgc2VsZWN0W0xFRlRdID0gbWluWCk7XG5cdFx0XHRcdFx0c2V0U3R5bGVQeChzZWxlY3REaXYsIFdJRFRILCBzZWxlY3RbV0lEVEhdID0gZHgpO1xuXG5cdFx0XHRcdFx0aWYgKCFkcmFnWSkge1xuXHRcdFx0XHRcdFx0c2V0U3R5bGVQeChzZWxlY3REaXYsIFRPUCwgc2VsZWN0W1RPUF0gPSAwKTtcblx0XHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBIRUlHSFQsIHNlbGVjdFtIRUlHSFRdID0gcGxvdEhndENzcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGRyYWdZKSB7XG5cdFx0XHRcdFx0bGV0IG1pblkgPSBtaW4obW91c2VUb3AwLCBtb3VzZVRvcDEpO1xuXG5cdFx0XHRcdFx0c2V0U3R5bGVQeChzZWxlY3REaXYsIFRPUCwgICAgc2VsZWN0W1RPUF0gPSBtaW5ZKTtcblx0XHRcdFx0XHRzZXRTdHlsZVB4KHNlbGVjdERpdiwgSEVJR0hULCBzZWxlY3RbSEVJR0hUXSA9IGR5KTtcblxuXHRcdFx0XHRcdGlmICghZHJhZ1gpIHtcblx0XHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBMRUZULCBzZWxlY3RbTEVGVF0gPSAwKTtcblx0XHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBXSURUSCwgc2VsZWN0W1dJRFRIXSA9IHBsb3RXaWRDc3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghZHJhZ1ggJiYgIWRyYWdZKSB7XG5cdFx0XHRcdFx0Ly8gdGhlIGRyYWcgZGlkbid0IHBhc3MgdGhlIGRpc3QgcmVxdWlyZW1lbnRcblx0XHRcdFx0XHRzZXRTdHlsZVB4KHNlbGVjdERpdiwgSEVJR0hULCBzZWxlY3RbSEVJR0hUXSA9IDApO1xuXHRcdFx0XHRcdHNldFN0eWxlUHgoc2VsZWN0RGl2LCBXSURUSCwgIHNlbGVjdFtXSURUSF0gID0gMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRjdXJzb3IuaWR4ID0gaWR4O1xuXHRcdGN1cnNvci5sZWZ0ID0gbW91c2VMZWZ0MTtcblx0XHRjdXJzb3IudG9wID0gbW91c2VUb3AxO1xuXHRcdGRyYWcuX3ggPSBkcmFnWDtcblx0XHRkcmFnLl95ID0gZHJhZ1k7XG5cblx0XHQvLyBpZiB0cyBpcyBwcmVzZW50LCBtZWFucyB3ZSdyZSBpbXBsaWNpdGx5IHN5bmNpbmcgb3duIGN1cnNvciBhcyBhIHJlc3VsdCBvZiBkZWJvdW5jZWQgckFGXG5cdFx0aWYgKHRzICE9IG51bGwpIHtcblx0XHRcdC8vIHRoaXMgaXMgbm90IHRlY2huaWNhbGx5IGEgXCJtb3VzZW1vdmVcIiBldmVudCwgc2luY2UgaXQncyBkZWJvdW5jZWQsIHJlbmFtZSB0byBzZXRDdXJzb3I/XG5cdFx0XHQvLyBzaW5jZSB0aGlzIGlzIGludGVybmFsLCB3ZSBjYW4gdHdlYWsgaXQgbGF0ZXJcblx0XHRcdHN5bmMucHViKG1vdXNlbW92ZSwgc2VsZiwgbW91c2VMZWZ0MSwgbW91c2VUb3AxLCBwbG90V2lkQ3NzLCBwbG90SGd0Q3NzLCBpZHgpO1xuXG5cdFx0XHRpZiAoY3Vyc29yRm9jdXMpIHtcblx0XHRcdFx0bGV0IG1pbkRpc3QgPSBtaW4uYXBwbHkobnVsbCwgZGlzdHNUb0N1cnNvcik7XG5cblx0XHRcdFx0bGV0IGZpID0gbnVsbDtcblxuXHRcdFx0XHRpZiAobWluRGlzdCA8PSBmb2N1cy5wcm94KSB7XG5cdFx0XHRcdFx0ZGlzdHNUb0N1cnNvci5zb21lKChkaXN0LCBpKSA9PiB7XG5cdFx0XHRcdFx0XHRpZiAoZGlzdCA9PSBtaW5EaXN0KVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmkgPSBpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c2V0U2VyaWVzKGZpLCB7Zm9jdXM6IHRydWV9LCBzeW5jT3B0cy5zZXRTZXJpZXMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJlYWR5ICYmIGZpcmUoXCJzZXRDdXJzb3JcIik7XG5cdH1cblxuXHRsZXQgcmVjdCA9IG51bGw7XG5cblx0ZnVuY3Rpb24gc3luY1JlY3QoKSB7XG5cdFx0cmVjdCA9IG92ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBtb3VzZU1vdmUoZSwgc3JjLCBfeCwgX3ksIF93LCBfaCwgX2kpIHtcblx0XHRpZiAoY3Vyc29yLmxvY2tlZClcblx0XHRcdHJldHVybjtcblxuXHRcdGNhY2hlTW91c2UoZSwgc3JjLCBfeCwgX3ksIF93LCBfaCwgX2ksIGZhbHNlLCBlICE9IG51bGwpO1xuXG5cdFx0aWYgKGUgIT0gbnVsbCkge1xuXHRcdFx0aWYgKGN1cnNvclJhZiA9PSAwKVxuXHRcdFx0XHRjdXJzb3JSYWYgPSByQUYodXBkYXRlQ3Vyc29yKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdFx0dXBkYXRlQ3Vyc29yKG51bGwsIHNyYyk7XG5cdH1cblxuXHRmdW5jdGlvbiBjYWNoZU1vdXNlKGUsIHNyYywgX3gsIF95LCBfdywgX2gsIF9pLCBpbml0aWFsLCBzbmFwKSB7XG5cdFx0aWYgKGUgIT0gbnVsbCkge1xuXHRcdFx0X3ggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XG5cdFx0XHRfeSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmIChfeCA8IDAgfHwgX3kgPCAwKSB7XG5cdFx0XHRcdG1vdXNlTGVmdDEgPSAtMTA7XG5cdFx0XHRcdG1vdXNlVG9wMSA9IC0xMDtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgW3hLZXksIHlLZXldID0gc3luY09wdHMuc2NhbGVzO1xuXG5cdFx0XHRpZiAoeEtleSAhPSBudWxsKVxuXHRcdFx0XHRfeCA9IGdldFhQb3Moc3JjLnBvc1RvVmFsKF94LCB4S2V5KSwgc2NhbGVzW3hLZXldLCBwbG90V2lkQ3NzLCAwKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0X3ggPSBwbG90V2lkQ3NzICogKF94L193KTtcblxuXHRcdFx0aWYgKHlLZXkgIT0gbnVsbClcblx0XHRcdFx0X3kgPSBnZXRZUG9zKHNyYy5wb3NUb1ZhbChfeSwgeUtleSksIHNjYWxlc1t5S2V5XSwgcGxvdEhndENzcywgMCk7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdF95ID0gcGxvdEhndENzcyAqIChfeS9faCk7XG5cdFx0fVxuXG5cdFx0aWYgKHNuYXApIHtcblx0XHRcdGlmIChfeCA8PSAxIHx8IF94ID49IHBsb3RXaWRDc3MgLSAxKVxuXHRcdFx0XHRfeCA9IGluY3JSb3VuZChfeCwgcGxvdFdpZENzcyk7XG5cblx0XHRcdGlmIChfeSA8PSAxIHx8IF95ID49IHBsb3RIZ3RDc3MgLSAxKVxuXHRcdFx0XHRfeSA9IGluY3JSb3VuZChfeSwgcGxvdEhndENzcyk7XG5cdFx0fVxuXG5cdFx0aWYgKGluaXRpYWwpIHtcblx0XHRcdG1vdXNlTGVmdDAgPSBfeDtcblx0XHRcdG1vdXNlVG9wMCA9IF95O1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdG1vdXNlTGVmdDEgPSBfeDtcblx0XHRcdG1vdXNlVG9wMSA9IF95O1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhpZGVTZWxlY3QoKSB7XG5cdFx0c2V0U2VsZWN0KHtcblx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0aGVpZ2h0OiAwLFxuXHRcdH0sIGZhbHNlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlRG93bihlLCBzcmMsIF94LCBfeSwgX3csIF9oLCBfaSkge1xuXHRcdGlmIChzcmMgIT0gbnVsbCB8fCBmaWx0TW91c2UoZSkpIHtcblx0XHRcdGRyYWdnaW5nID0gdHJ1ZTtcblx0XHRcdGRyYWdYID0gZHJhZ1kgPSBkcmFnLl94ID0gZHJhZy5feSA9IGZhbHNlO1xuXG5cdFx0XHRjYWNoZU1vdXNlKGUsIHNyYywgX3gsIF95LCBfdywgX2gsIF9pLCB0cnVlLCBmYWxzZSk7XG5cblx0XHRcdGlmIChlICE9IG51bGwpIHtcblx0XHRcdFx0b24obW91c2V1cCwgZG9jLCBtb3VzZVVwKTtcblx0XHRcdFx0c3luYy5wdWIobW91c2Vkb3duLCBzZWxmLCBtb3VzZUxlZnQwLCBtb3VzZVRvcDAsIHBsb3RXaWRDc3MsIHBsb3RIZ3RDc3MsIG51bGwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG1vdXNlVXAoZSwgc3JjLCBfeCwgX3ksIF93LCBfaCwgX2kpIHtcblx0XHRpZiAoc3JjICE9IG51bGwgfHwgZmlsdE1vdXNlKGUpKSB7XG5cdFx0XHRkcmFnZ2luZyA9IGRyYWcuX3ggPSBkcmFnLl95ID0gZmFsc2U7XG5cblx0XHRcdGNhY2hlTW91c2UoZSwgc3JjLCBfeCwgX3ksIF93LCBfaCwgX2ksIGZhbHNlLCB0cnVlKTtcblxuXHRcdFx0bGV0IGhhc1NlbGVjdCA9IHNlbGVjdFtXSURUSF0gPiAwIHx8IHNlbGVjdFtIRUlHSFRdID4gMDtcblxuXHRcdFx0aGFzU2VsZWN0ICYmIHNldFNlbGVjdChzZWxlY3QpO1xuXG5cdFx0XHRpZiAoZHJhZy5zZXRTY2FsZSAmJiBoYXNTZWxlY3QpIHtcblx0XHRcdC8vXHRpZiAoc3luY0tleSAhPSBudWxsKSB7XG5cdFx0XHQvL1x0XHRkcmFnWCA9IGRyYWcueDtcblx0XHRcdC8vXHRcdGRyYWdZID0gZHJhZy55O1xuXHRcdFx0Ly9cdH1cblxuXHRcdFx0XHRiYXRjaCgoKSA9PiB7XG5cdFx0XHRcdFx0aWYgKGRyYWdYKSB7XG5cdFx0XHRcdFx0XHRfc2V0U2NhbGUoeFNjYWxlS2V5LFxuXHRcdFx0XHRcdFx0XHRzY2FsZVZhbHVlQXRQb3Moc2VsZWN0W0xFRlRdLCB4U2NhbGVLZXkpLFxuXHRcdFx0XHRcdFx0XHRzY2FsZVZhbHVlQXRQb3Moc2VsZWN0W0xFRlRdICsgc2VsZWN0W1dJRFRIXSwgeFNjYWxlS2V5KVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoZHJhZ1kpIHtcblx0XHRcdFx0XHRcdGZvciAobGV0IGsgaW4gc2NhbGVzKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBzYyA9IHNjYWxlc1trXTtcblxuXHRcdFx0XHRcdFx0XHRpZiAoayAhPSB4U2NhbGVLZXkgJiYgc2MuZnJvbSA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdFx0X3NldFNjYWxlKGssXG5cdFx0XHRcdFx0XHRcdFx0XHRzY2FsZVZhbHVlQXRQb3Moc2VsZWN0W1RPUF0gKyBzZWxlY3RbSEVJR0hUXSwgayksXG5cdFx0XHRcdFx0XHRcdFx0XHRzY2FsZVZhbHVlQXRQb3Moc2VsZWN0W1RPUF0sIGspXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0aGlkZVNlbGVjdCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoY3Vyc29yLmxvY2spIHtcblx0XHRcdFx0Y3Vyc29yLmxvY2tlZCA9ICFjdXJzb3IubG9ja2VkO1xuXG5cdFx0XHRcdGlmICghY3Vyc29yLmxvY2tlZClcblx0XHRcdFx0XHR1cGRhdGVDdXJzb3IoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoZSAhPSBudWxsKSB7XG5cdFx0XHRvZmYobW91c2V1cCwgZG9jLCBtb3VzZVVwKTtcblx0XHRcdHN5bmMucHViKG1vdXNldXAsIHNlbGYsIG1vdXNlTGVmdDEsIG1vdXNlVG9wMSwgcGxvdFdpZENzcywgcGxvdEhndENzcywgbnVsbCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gbW91c2VMZWF2ZShlLCBzcmMsIF94LCBfeSwgX3csIF9oLCBfaSkge1xuXHRcdGlmICghY3Vyc29yLmxvY2tlZCkge1xuXHRcdFx0bGV0IF9kcmFnZ2luZyA9IGRyYWdnaW5nO1xuXG5cdFx0XHRpZiAoZHJhZ2dpbmcpIHtcblx0XHRcdFx0Ly8gaGFuZGxlIGNhc2Ugd2hlbiBtb3VzZW1vdmUgYXJlbid0IGZpcmVkIGFsbCB0aGUgd2F5IHRvIGVkZ2VzIGJ5IGJyb3dzZXJcblx0XHRcdFx0bGV0IHNuYXBYID0gdHJ1ZTtcblx0XHRcdFx0bGV0IHNuYXBZID0gdHJ1ZTtcblx0XHRcdFx0bGV0IHNuYXBQcm94ID0gMTA7XG5cblx0XHRcdFx0aWYgKGRyYWdYICYmIGRyYWdZKSB7XG5cdFx0XHRcdFx0Ly8gbWF5YmUgb21uaSBjb3JuZXIgc25hcFxuXHRcdFx0XHRcdHNuYXBYID0gbW91c2VMZWZ0MSA8PSBzbmFwUHJveCB8fCBtb3VzZUxlZnQxID49IHBsb3RXaWRDc3MgLSBzbmFwUHJveDtcblx0XHRcdFx0XHRzbmFwWSA9IG1vdXNlVG9wMSAgPD0gc25hcFByb3ggfHwgbW91c2VUb3AxICA+PSBwbG90SGd0Q3NzIC0gc25hcFByb3g7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZHJhZ1ggJiYgc25hcFgpIHtcblx0XHRcdFx0XHRsZXQgZExmdCA9IG1vdXNlTGVmdDE7XG5cdFx0XHRcdFx0bGV0IGRSZ3QgPSBwbG90V2lkQ3NzIC0gbW91c2VMZWZ0MTtcblxuXHRcdFx0XHRcdGxldCB4TWluID0gbWluKGRMZnQsIGRSZ3QpO1xuXG5cdFx0XHRcdFx0aWYgKHhNaW4gPT0gZExmdClcblx0XHRcdFx0XHRcdG1vdXNlTGVmdDEgPSAwO1xuXHRcdFx0XHRcdGlmICh4TWluID09IGRSZ3QpXG5cdFx0XHRcdFx0XHRtb3VzZUxlZnQxID0gcGxvdFdpZENzcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkcmFnWSAmJiBzbmFwWSkge1xuXHRcdFx0XHRcdGxldCBkVG9wID0gbW91c2VUb3AxO1xuXHRcdFx0XHRcdGxldCBkQnRtID0gcGxvdEhndENzcyAtIG1vdXNlVG9wMTtcblxuXHRcdFx0XHRcdGxldCB5TWluID0gbWluKGRUb3AsIGRCdG0pO1xuXG5cdFx0XHRcdFx0aWYgKHlNaW4gPT0gZFRvcClcblx0XHRcdFx0XHRcdG1vdXNlVG9wMSA9IDA7XG5cdFx0XHRcdFx0aWYgKHlNaW4gPT0gZEJ0bSlcblx0XHRcdFx0XHRcdG1vdXNlVG9wMSA9IHBsb3RIZ3RDc3M7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1cGRhdGVDdXJzb3IoMSk7XG5cblx0XHRcdFx0ZHJhZ2dpbmcgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0bW91c2VMZWZ0MSA9IC0xMDtcblx0XHRcdG1vdXNlVG9wMSA9IC0xMDtcblxuXHRcdFx0Ly8gcGFzc2luZyBhIG5vbi1udWxsIHRpbWVzdGFtcCB0byBmb3JjZSBzeW5jL21vdXNlbW92ZSBldmVudFxuXHRcdFx0dXBkYXRlQ3Vyc29yKDEpO1xuXG5cdFx0XHRpZiAoX2RyYWdnaW5nKVxuXHRcdFx0XHRkcmFnZ2luZyA9IF9kcmFnZ2luZztcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBkYmxDbGljayhlLCBzcmMsIF94LCBfeSwgX3csIF9oLCBfaSkge1xuXHRcdGF1dG9TY2FsZVgoKTtcblxuXHRcdGhpZGVTZWxlY3QoKTtcblxuXHRcdGlmIChlICE9IG51bGwpXG5cdFx0XHRzeW5jLnB1YihkYmxjbGljaywgc2VsZiwgbW91c2VMZWZ0MSwgbW91c2VUb3AxLCBwbG90V2lkQ3NzLCBwbG90SGd0Q3NzLCBudWxsKTtcblx0fVxuXG5cdC8vIGludGVybmFsIHB1Yi9zdWJcblx0Y29uc3QgZXZlbnRzID0ge307XG5cblx0ZXZlbnRzW21vdXNlZG93bl0gPSBtb3VzZURvd247XG5cdGV2ZW50c1ttb3VzZW1vdmVdID0gbW91c2VNb3ZlO1xuXHRldmVudHNbbW91c2V1cF0gPSBtb3VzZVVwO1xuXHRldmVudHNbZGJsY2xpY2tdID0gZGJsQ2xpY2s7XG5cdGV2ZW50c1tcInNldFNlcmllc1wiXSA9IChlLCBzcmMsIGlkeCwgb3B0cykgPT4ge1xuXHRcdHNldFNlcmllcyhpZHgsIG9wdHMpO1xuXHR9O1xuXG5cdGxldCBkZWI7XG5cblx0aWYgKCBjdXJzb3Iuc2hvdykge1xuXHRcdG9uKG1vdXNlZG93biwgb3ZlciwgbW91c2VEb3duKTtcblx0XHRvbihtb3VzZW1vdmUsIG92ZXIsIG1vdXNlTW92ZSk7XG5cdFx0b24obW91c2VlbnRlciwgb3Zlciwgc3luY1JlY3QpO1xuXHRcdC8vIHRoaXMgaGFzIHRvIGJlIHJBRidkIHNvIGl0IGFsd2F5cyBmaXJlcyBhZnRlciB0aGUgbGFzdCBxdWV1ZWQvckFGJ2QgdXBkYXRlQ3Vyc29yXG5cdFx0b24obW91c2VsZWF2ZSwgb3ZlciwgZSA9PiB7IHJBRihtb3VzZUxlYXZlKTsgfSk7XG5cblx0XHRvbihkYmxjbGljaywgb3ZlciwgZGJsQ2xpY2spO1xuXG5cdFx0ZGViID0gZGVib3VuY2Uoc3luY1JlY3QsIDEwMCk7XG5cblx0XHRvbihyZXNpemUsIHdpbiwgZGViKTtcblx0XHRvbihzY3JvbGwsIHdpbiwgZGViKTtcblxuXHRcdHNlbGYuc3luY1JlY3QgPSBzeW5jUmVjdDtcblx0fVxuXG5cdC8vIGV4dGVybmFsIG9uL29mZlxuXHRjb25zdCBob29rcyA9IHNlbGYuaG9va3MgPSBvcHRzLmhvb2tzIHx8IHt9O1xuXG5cdGZ1bmN0aW9uIGZpcmUoZXZOYW1lLCBhMSwgYTIpIHtcblx0XHRpZiAoZXZOYW1lIGluIGhvb2tzKSB7XG5cdFx0XHRob29rc1tldk5hbWVdLmZvckVhY2goZm4gPT4ge1xuXHRcdFx0XHRmbi5jYWxsKG51bGwsIHNlbGYsIGExLCBhMik7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHQob3B0cy5wbHVnaW5zIHx8IFtdKS5mb3JFYWNoKHAgPT4ge1xuXHRcdGZvciAobGV0IGV2TmFtZSBpbiBwLmhvb2tzKVxuXHRcdFx0aG9va3NbZXZOYW1lXSA9IChob29rc1tldk5hbWVdIHx8IFtdKS5jb25jYXQocC5ob29rc1tldk5hbWVdKTtcblx0fSk7XG5cblx0Y29uc3Qgc3luY09wdHMgPSAgYXNzaWduKHtcblx0XHRrZXk6IG51bGwsXG5cdFx0c2V0U2VyaWVzOiBmYWxzZSxcblx0XHRzY2FsZXM6IFt4U2NhbGVLZXksIG51bGxdXG5cdH0sIGN1cnNvci5zeW5jKTtcblxuXHRjb25zdCBzeW5jS2V5ID0gIHN5bmNPcHRzLmtleTtcblxuXHRjb25zdCBzeW5jID0gIChzeW5jS2V5ICE9IG51bGwgPyAoc3luY3Nbc3luY0tleV0gPSBzeW5jc1tzeW5jS2V5XSB8fCBfc3luYygpKSA6IF9zeW5jKCkpO1xuXG5cdCBzeW5jLnN1YihzZWxmKTtcblxuXHRmdW5jdGlvbiBwdWIodHlwZSwgc3JjLCB4LCB5LCB3LCBoLCBpKSB7XG5cdFx0ZXZlbnRzW3R5cGVdKG51bGwsIHNyYywgeCwgeSwgdywgaCwgaSk7XG5cdH1cblxuXHQgKHNlbGYucHViID0gcHViKTtcblxuXHRmdW5jdGlvbiBkZXN0cm95KCkge1xuXHRcdCBzeW5jLnVuc3ViKHNlbGYpO1xuXHRcdCBvZmYocmVzaXplLCB3aW4sIGRlYik7XG5cdFx0IG9mZihzY3JvbGwsIHdpbiwgZGViKTtcblx0XHRyb290LnJlbW92ZSgpO1xuXHRcdGZpcmUoXCJkZXN0cm95XCIpO1xuXHR9XG5cblx0c2VsZi5kZXN0cm95ID0gZGVzdHJveTtcblxuXHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRfc2V0U2l6ZShvcHRzW1dJRFRIXSwgb3B0c1tIRUlHSFRdKTtcblxuXHRcdGZpcmUoXCJpbml0XCIsIG9wdHMsIGRhdGEpO1xuXG5cdFx0c2V0RGF0YShkYXRhIHx8IG9wdHMuZGF0YSwgZmFsc2UpO1xuXG5cdFx0aWYgKHBlbmRTY2FsZXNbeFNjYWxlS2V5XSlcblx0XHRcdHNldFNjYWxlKHhTY2FsZUtleSwgcGVuZFNjYWxlc1t4U2NhbGVLZXldKTtcblx0XHRlbHNlXG5cdFx0XHRhdXRvU2NhbGVYKCk7XG5cblx0XHRzZXRTZWxlY3Qoc2VsZWN0LCBmYWxzZSk7XG5cblx0XHRyZWFkeSA9IHRydWU7XG5cblx0XHRmaXJlKFwicmVhZHlcIik7XG5cdH1cblxuXHRpZiAodGhlbikge1xuXHRcdGlmICh0aGVuIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcblx0XHRcdHRoZW4uYXBwZW5kQ2hpbGQocm9vdCk7XG5cdFx0XHRfaW5pdCgpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0XHR0aGVuKHNlbGYsIF9pbml0KTtcblx0fVxuXHRlbHNlXG5cdFx0X2luaXQoKTtcblxuXHRyZXR1cm4gc2VsZjtcbn1cblxudVBsb3QuYXNzaWduID0gYXNzaWduO1xudVBsb3QucmFuZ2VOdW0gPSByYW5nZU51bTtcblxue1xuXHR1UGxvdC5mbXREYXRlID0gZm10RGF0ZTtcblx0dVBsb3QudHpEYXRlICA9IHR6RGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdVBsb3Q7XG4iLCAiaW1wb3J0IHsgQ29sb3JXaGVlbCwgTGluZUNvbG9yIH0gZnJvbSAnLi9jb2xvcl93aGVlbCdcbmltcG9ydCB1UGxvdCBmcm9tICd1cGxvdCdcblxuY29uc3QgU2VyaWVzVmFsdWUgPSAob3B0aW9ucykgPT4ge1xuICBpZiAoIW9wdGlvbnMudW5pdCkgcmV0dXJuIHt9XG5cbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogKHUsIHYpID0+IHYgPT0gbnVsbCA/ICctLScgOiB2LnRvRml4ZWQoMykgKyBgICR7b3B0aW9ucy51bml0fWBcbiAgfVxufVxuXG5jb25zdCBYU2VyaWVzVmFsdWUgPSAob3B0aW9ucykgPT4ge1xuICByZXR1cm4ge1xuICAgIHZhbHVlOiAne1lZWVl9LXtNTX0te0REfSB7SEh9OnttbX06e3NzfSdcbiAgfVxufVxuXG5jb25zdCBZQXhpc1ZhbHVlID0gKG9wdGlvbnMpID0+IHtcbiAgaWYgKCFvcHRpb25zLnVuaXQpIHJldHVybiB7fVxuXG4gIHJldHVybiB7XG4gICAgdmFsdWVzOiAodSwgdmFscywgc3BhY2UpID0+IHZhbHMubWFwKHYgPT4gK3YudG9GaXhlZCgyKSArIGAgJHtvcHRpb25zLnVuaXR9YClcbiAgfVxufVxuXG5jb25zdCBYQXhpcyA9IChfb3B0aW9ucykgPT4ge1xuICByZXR1cm4ge1xuICAgIHNwYWNlOiA1NSxcbiAgICB2YWx1ZXM6IFtcbiAgICAgIFszNjAwICogMjQgKiAzNjUsIFwie1lZWVl9XCIsIDcsIFwie1lZWVl9XCJdLFxuICAgICAgWzM2MDAgKiAyNCAqIDI4LCBcIntNTU19XCIsIDcsIFwie01NTX1cXG57WVlZWX1cIl0sXG4gICAgICBbMzYwMCAqIDI0LCBcIntNTX0te0REfVwiLCA3LCBcIntNTX0te0REfVxcbntZWVlZfVwiXSxcbiAgICAgIFszNjAwLCBcIntISH06e21tfVwiLCA0LCBcIntISH06e21tfVxcbntZWVlZfS17TU19LXtERH1cIl0sXG4gICAgICBbNjAsIFwie0hIfTp7bW19XCIsIDQsIFwie0hIfTp7bW19XFxue1lZWVl9LXtNTX0te0REfVwiXSxcbiAgICAgIFsxLCBcIntzc31cIiwgMiwgXCJ7SEh9OnttbX06e3NzfVxcbntZWVlZfS17TU19LXtERH1cIl0sXG4gICAgXVxuICB9XG59XG5cbmNvbnN0IFlBeGlzID0gKG9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzaG93OiB0cnVlLFxuICAgIHNpemU6IDcwLFxuICAgIHNwYWNlOiAxNSxcbiAgICAuLi5ZQXhpc1ZhbHVlKG9wdGlvbnMpXG4gIH1cbn1cblxuY29uc3QgbWluQ2hhcnRTaXplID0ge1xuICB3aWR0aDogMTAwLFxuICBoZWlnaHQ6IDMwMFxufVxuXG4vLyBMaW1pdHMgaG93IG9mdGVuIGEgZnVuY3Rpb24gaXMgaW52b2tlZFxuZnVuY3Rpb24gdGhyb3R0bGUoY2IsIGxpbWl0KSB7XG4gIGxldCB3YWl0ID0gZmFsc2U7XG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBpZiAoIXdhaXQpIHtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYik7XG4gICAgICB3YWl0ID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB3YWl0ID0gZmFsc2U7XG4gICAgICB9LCBsaW1pdCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBuZXdTZXJpZXNDb25maWcgPSAob3B0aW9ucywgaW5kZXggPSAwKSA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4uTGluZUNvbG9yLmF0KGluZGV4KSxcbiAgICAuLi5TZXJpZXNWYWx1ZShvcHRpb25zKSxcbiAgICBsYWJlbDogb3B0aW9ucy5sYWJlbCxcbiAgICBzcGFuR2FwczogdHJ1ZSxcbiAgICBwb2ludHM6IHsgc2hvdzogZmFsc2UgfVxuICB9XG59XG5cbi8qKiBUZWxlbWV0cnkgTWV0cmljcyAqKi9cblxuLy8gTWFwcyBhbiBvcmRlcmVkIGxpc3Qgb2YgZGF0YXNldCBvYmplY3RzIGludG8gYW4gb3JkZXJlZCBsaXN0IG9mIGRhdGEgcG9pbnRzLlxuY29uc3QgZGF0YUZvckRhdGFzZXRzID0gKGRhdGFzZXRzKSA9PiBkYXRhc2V0cy5zbGljZSgwKS5tYXAoKHsgZGF0YSB9KSA9PiBkYXRhKVxuXG4vLyBIYW5kbGVyIGZvciBhbiB1bnRhZ2dlZCBDb21tb25NZXRyaWNcbmZ1bmN0aW9uIG5leHRWYWx1ZUZvckNhbGxiYWNrKHsgeSwgeiB9LCBjYWxsYmFjaykge1xuICB0aGlzLmRhdGFzZXRzWzBdLmRhdGEucHVzaCh6KVxuICBsZXQgY3VycmVudFZhbHVlID0gdGhpcy5kYXRhc2V0c1sxXS5kYXRhW3RoaXMuZGF0YXNldHNbMV0uZGF0YS5sZW5ndGggLSAxXSB8fCAwXG4gIGxldCBuZXh0VmFsdWUgPSBjYWxsYmFjay5jYWxsKHRoaXMsIHksIGN1cnJlbnRWYWx1ZSlcbiAgdGhpcy5kYXRhc2V0c1sxXS5kYXRhLnB1c2gobmV4dFZhbHVlKVxufVxuXG5jb25zdCBmaW5kTGFzdE5vbk51bGxWYWx1ZSA9IChkYXRhKSA9PiBkYXRhLnJlZHVjZVJpZ2h0KChhLCBjKSA9PiAoYyAhPSBudWxsICYmIGEgPT0gbnVsbCA/IGMgOiBhKSwgbnVsbClcblxuLy8gSGFuZGxlciBmb3IgYSB0YWdnZWQgQ29tbW9uTWV0cmljXG5mdW5jdGlvbiBuZXh0VGFnZ2VkVmFsdWVGb3JDYWxsYmFjayh7IHgsIHksIHogfSwgY2FsbGJhY2spIHtcbiAgLy8gRmluZCBvciBjcmVhdGUgdGhlIHNlcmllcyBmcm9tIHRoZSB0YWdcbiAgbGV0IHNlcmllc0luZGV4ID0gdGhpcy5kYXRhc2V0cy5maW5kSW5kZXgoKHsga2V5IH0pID0+IHggPT09IGtleSlcbiAgaWYgKHNlcmllc0luZGV4ID09PSAtMSkge1xuICAgIHNlcmllc0luZGV4ID0gdGhpcy5kYXRhc2V0cy5wdXNoKHsga2V5OiB4LCBkYXRhOiBBcnJheSh0aGlzLmRhdGFzZXRzWzBdLmRhdGEubGVuZ3RoKS5maWxsKG51bGwpIH0pIC0gMVxuICAgIHRoaXMuY2hhcnQuYWRkU2VyaWVzKG5ld1Nlcmllc0NvbmZpZyh7IGxhYmVsOiB4LCB1bml0OiB0aGlzLm9wdGlvbnMudW5pdCB9LCBzZXJpZXNJbmRleCAtIDEpLCBzZXJpZXNJbmRleClcbiAgfVxuXG4gIC8vIEFkZCB0aGUgbmV3IHRpbWVzdGFtcCArIHZhbHVlLCBrZWVwaW5nIGRhdGFzZXRzIGFsaWduZWRcbiAgdGhpcy5kYXRhc2V0cyA9IHRoaXMuZGF0YXNldHMubWFwKChkYXRhc2V0LCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgZGF0YXNldC5kYXRhLnB1c2goeilcbiAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBzZXJpZXNJbmRleCkge1xuICAgICAgZGF0YXNldC5kYXRhLnB1c2goY2FsbGJhY2suY2FsbCh0aGlzLCB5LCBmaW5kTGFzdE5vbk51bGxWYWx1ZShkYXRhc2V0LmRhdGEpIHx8IDApKVxuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhc2V0LmRhdGEucHVzaChudWxsKVxuICAgIH1cbiAgICByZXR1cm4gZGF0YXNldFxuICB9KVxufVxuXG5jb25zdCBnZXRQcnVuZVRocmVzaG9sZCA9ICh7IHBydW5lVGhyZXNob2xkID0gMTAwMCB9KSA9PiBwcnVuZVRocmVzaG9sZFxuXG4vLyBIYW5kbGVzIHRoZSBiYXNpYyBtZXRyaWNzIGxpa2UgQ291bnRlciwgTGFzdFZhbHVlLCBhbmQgU3VtLlxuY2xhc3MgQ29tbW9uTWV0cmljIHtcbiAgc3RhdGljIF9fcHJvamVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvdW50ZXI6ICh5LCB2YWx1ZSkgPT4gdmFsdWUgKyAxLFxuICAgICAgbGFzdF92YWx1ZTogKHkpID0+IHksXG4gICAgICBzdW06ICh5LCB2YWx1ZSkgPT4gdmFsdWUgKyB5XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldENvbmZpZyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzOiBvcHRpb25zLmtpbmQsXG4gICAgICB0aXRsZTogb3B0aW9ucy50aXRsZSxcbiAgICAgIHdpZHRoOiBvcHRpb25zLndpZHRoLFxuICAgICAgaGVpZ2h0OiBvcHRpb25zLmhlaWdodCxcbiAgICAgIHNlcmllczogW1xuICAgICAgICB7IC4uLlhTZXJpZXNWYWx1ZSgpIH0sXG4gICAgICAgIG5ld1Nlcmllc0NvbmZpZyhvcHRpb25zLCAwKVxuICAgICAgXSxcbiAgICAgIHNjYWxlczoge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgbWluOiBvcHRpb25zLm5vdyAtIDYwLFxuICAgICAgICAgIG1heDogb3B0aW9ucy5ub3dcbiAgICAgICAgfSxcbiAgICAgICAgeToge1xuICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICBtYXg6IDFcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBheGVzOiBbXG4gICAgICAgIFhBeGlzKCksXG4gICAgICAgIFlBeGlzKG9wdGlvbnMpXG4gICAgICBdXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluaXRpYWxEYXRhKCkge1xuICAgIHJldHVybiBbW10sIFtdXVxuICB9XG5cbiAgY29uc3RydWN0b3IoY2hhcnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9fY2FsbGJhY2sgPSB0aGlzLmNvbnN0cnVjdG9yLl9fcHJvamVjdGlvbnMoKVtvcHRpb25zLm1ldHJpY11cbiAgICB0aGlzLmNoYXJ0ID0gY2hhcnRcbiAgICB0aGlzLmRhdGFzZXRzID0gW3sga2V5OiBcInx4fFwiLCBkYXRhOiBbXSB9XVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLnBydW5lVGhyZXNob2xkID0gZ2V0UHJ1bmVUaHJlc2hvbGQob3B0aW9ucylcblxuICAgIGlmIChvcHRpb25zLnRhZ2dlZCkge1xuICAgICAgdGhpcy5jaGFydC5kZWxTZXJpZXMoMSlcbiAgICAgIHRoaXMuX19oYW5kbGVyID0gbmV4dFRhZ2dlZFZhbHVlRm9yQ2FsbGJhY2tcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRhc2V0cy5wdXNoKHsga2V5OiBvcHRpb25zLmxhYmVsLCBkYXRhOiBbXSB9KVxuICAgICAgdGhpcy5fX2hhbmRsZXIgPSBuZXh0VmFsdWVGb3JDYWxsYmFja1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1lYXN1cmVtZW50cyhtZWFzdXJlbWVudHMpIHtcbiAgICAvLyBwcnVuZSBkYXRhc2V0cyB3aGVuIHdlIHJlYWNoIHRoZSBtYXggbnVtYmVyIG9mIGV2ZW50c1xuICAgIG1lYXN1cmVtZW50cy5mb3JFYWNoKChtZWFzdXJlbWVudCkgPT4gdGhpcy5fX2hhbmRsZXIuY2FsbCh0aGlzLCBtZWFzdXJlbWVudCwgdGhpcy5fX2NhbGxiYWNrKSlcblxuICAgIGxldCBjdXJyZW50U2l6ZSA9IHRoaXMuZGF0YXNldHNbMF0uZGF0YS5sZW5ndGhcbiAgICBpZiAoY3VycmVudFNpemUgPj0gdGhpcy5wcnVuZVRocmVzaG9sZCkge1xuICAgICAgdGhpcy5kYXRhc2V0cyA9IHRoaXMuZGF0YXNldHMubWFwKCh7IGRhdGEsIC4uLnJlc3QgfSkgPT4ge1xuICAgICAgICByZXR1cm4geyBkYXRhOiBkYXRhLnNsaWNlKC10aGlzLnBydW5lVGhyZXNob2xkKSwgLi4ucmVzdCB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuY2hhcnQuc2V0RGF0YShkYXRhRm9yRGF0YXNldHModGhpcy5kYXRhc2V0cykpXG4gIH1cbn1cblxuLy8gRGlzcGxheXMgYSBtZWFzdXJlbWVudCBzdW1tYXJ5XG5jbGFzcyBTdW1tYXJ5IHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucywgY2hhcnRFbCkge1xuICAgIC8vIFRPRE86IEdldCBwZXJjZW50aWxlcyBmcm9tIG9wdGlvbnNcbiAgICBsZXQgY29uZmlnID0gdGhpcy5jb25zdHJ1Y3Rvci5nZXRDb25maWcob3B0aW9ucylcbiAgICAvLyBCaW5kIHRoZSBzZXJpZXMgYHZhbHVlc2AgY2FsbGJhY2sgdG8gdGhpcyBpbnN0YW5jZVxuICAgIGNvbmZpZy5zZXJpZXNbMV0udmFsdWVzID0gdGhpcy5fX3Nlcmllc1ZhbHVlcy5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLmRhdGFzZXRzID0gW3sga2V5OiBcInx4fFwiLCBkYXRhOiBbXSB9XVxuICAgIHRoaXMuY2hhcnQgPSBuZXcgdVBsb3QoY29uZmlnLCB0aGlzLmNvbnN0cnVjdG9yLmluaXRpYWxEYXRhKG9wdGlvbnMpLCBjaGFydEVsKVxuICAgIHRoaXMucHJ1bmVUaHJlc2hvbGQgPSBnZXRQcnVuZVRocmVzaG9sZChvcHRpb25zKVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIGlmIChvcHRpb25zLnRhZ2dlZCkge1xuICAgICAgdGhpcy5jaGFydC5kZWxTZXJpZXMoMSlcbiAgICAgIHRoaXMuX19oYW5kbGVyID0gdGhpcy5oYW5kbGVUYWdnZWRNZWFzdXJlbWVudC5iaW5kKHRoaXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0YXNldHMucHVzaCh0aGlzLmNvbnN0cnVjdG9yLm5ld0RhdGFzZXQob3B0aW9ucy5sYWJlbCkpXG4gICAgICB0aGlzLl9faGFuZGxlciA9IHRoaXMuaGFuZGxlTWVhc3VyZW1lbnQuYmluZCh0aGlzKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1lYXN1cmVtZW50cyhtZWFzdXJlbWVudHMpIHtcbiAgICBtZWFzdXJlbWVudHMuZm9yRWFjaCgobWVhc3VyZW1lbnQpID0+IHRoaXMuX19oYW5kbGVyKG1lYXN1cmVtZW50KSlcbiAgICB0aGlzLl9fbWF5YmVQcnVuZURhdGFzZXRzKClcbiAgICB0aGlzLmNoYXJ0LnNldERhdGEoZGF0YUZvckRhdGFzZXRzKHRoaXMuZGF0YXNldHMpKVxuICB9XG5cbiAgaGFuZGxlVGFnZ2VkTWVhc3VyZW1lbnQobWVhc3VyZW1lbnQpIHtcbiAgICBsZXQgc2VyaWVzSW5kZXggPSB0aGlzLmZpbmRPckNyZWF0ZVNlcmllcyhtZWFzdXJlbWVudC54KVxuICAgIHRoaXMuaGFuZGxlTWVhc3VyZW1lbnQobWVhc3VyZW1lbnQsIHNlcmllc0luZGV4KVxuICB9XG5cbiAgaGFuZGxlTWVhc3VyZW1lbnQobWVhc3VyZW1lbnQsIHNpZHggPSAxKSB7XG4gICAgbGV0IHsgejogdGltZXN0YW1wIH0gPSBtZWFzdXJlbWVudFxuICAgIHRoaXMuZGF0YXNldHMgPSB0aGlzLmRhdGFzZXRzLm1hcCgoZGF0YXNldCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChkYXRhc2V0LmtleSA9PT0gXCJ8eHxcIikge1xuICAgICAgICBkYXRhc2V0LmRhdGEucHVzaCh0aW1lc3RhbXApXG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBzaWR4KSB7XG4gICAgICAgIHRoaXMucHVzaFRvRGF0YXNldChkYXRhc2V0LCBtZWFzdXJlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHVzaFRvRGF0YXNldChkYXRhc2V0LCBudWxsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGFzZXRcbiAgICB9KVxuICB9XG5cbiAgZmluZE9yQ3JlYXRlU2VyaWVzKGxhYmVsKSB7XG4gICAgbGV0IHNlcmllc0luZGV4ID0gdGhpcy5kYXRhc2V0cy5maW5kSW5kZXgoKHsga2V5IH0pID0+IGxhYmVsID09PSBrZXkpXG4gICAgaWYgKHNlcmllc0luZGV4ID09PSAtMSkge1xuICAgICAgc2VyaWVzSW5kZXggPSB0aGlzLmRhdGFzZXRzLnB1c2goXG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IubmV3RGF0YXNldChsYWJlbCwgdGhpcy5kYXRhc2V0c1swXS5kYXRhLmxlbmd0aClcbiAgICAgICkgLSAxXG5cbiAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgIHZhbHVlczogdGhpcy5fX3Nlcmllc1ZhbHVlcy5iaW5kKHRoaXMpLFxuICAgICAgICAuLi5uZXdTZXJpZXNDb25maWcoeyBsYWJlbCB9LCBzZXJpZXNJbmRleCAtIDEpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2hhcnQuYWRkU2VyaWVzKGNvbmZpZywgc2VyaWVzSW5kZXgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlcmllc0luZGV4XG4gIH1cblxuICBwdXNoVG9EYXRhc2V0KGRhdGFzZXQsIG1lYXN1cmVtZW50KSB7XG4gICAgaWYgKG1lYXN1cmVtZW50ID09PSBudWxsKSB7XG4gICAgICBkYXRhc2V0LmRhdGEucHVzaChudWxsKVxuICAgICAgZGF0YXNldC5hZ2cuYXZnLnB1c2gobnVsbClcbiAgICAgIGRhdGFzZXQuYWdnLm1heC5wdXNoKG51bGwpXG4gICAgICBkYXRhc2V0LmFnZy5taW4ucHVzaChudWxsKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IHsgeSB9ID0gbWVhc3VyZW1lbnRcblxuICAgIC8vIEluY3JlbWVudCB0aGUgbmV3IG92ZXJhbGwgdG90YWxzXG4gICAgZGF0YXNldC5hZ2cuY291bnQrK1xuICAgIGRhdGFzZXQuYWdnLnRvdGFsICs9IHlcblxuICAgIC8vIFB1c2ggdGhlIHZhbHVlXG4gICAgZGF0YXNldC5kYXRhLnB1c2goeSlcblxuICAgIC8vIFB1c2ggbWluL21heC9hdmdcbiAgICBpZiAoZGF0YXNldC5sYXN0Lm1pbiA9PT0gbnVsbCB8fCB5IDwgZGF0YXNldC5sYXN0Lm1pbikgeyBkYXRhc2V0Lmxhc3QubWluID0geSB9XG4gICAgZGF0YXNldC5hZ2cubWluLnB1c2goZGF0YXNldC5sYXN0Lm1pbilcblxuICAgIGlmIChkYXRhc2V0Lmxhc3QubWF4ID09PSBudWxsIHx8IHkgPiBkYXRhc2V0Lmxhc3QubWF4KSB7IGRhdGFzZXQubGFzdC5tYXggPSB5IH1cbiAgICBkYXRhc2V0LmFnZy5tYXgucHVzaChkYXRhc2V0Lmxhc3QubWF4KVxuXG4gICAgZGF0YXNldC5hZ2cuYXZnLnB1c2goKGRhdGFzZXQuYWdnLnRvdGFsIC8gZGF0YXNldC5hZ2cuY291bnQpKVxuXG4gICAgcmV0dXJuIGRhdGFzZXRcbiAgfVxuXG4gIF9fbWF5YmVQcnVuZURhdGFzZXRzKCkge1xuICAgIGxldCBjdXJyZW50U2l6ZSA9IHRoaXMuZGF0YXNldHNbMF0uZGF0YS5sZW5ndGhcbiAgICBpZiAoY3VycmVudFNpemUgPiB0aGlzLnBydW5lVGhyZXNob2xkKSB7XG4gICAgICBsZXQgc3RhcnQgPSAtdGhpcy5wcnVuZVRocmVzaG9sZDtcbiAgICAgIHRoaXMuZGF0YXNldHMgPSB0aGlzLmRhdGFzZXRzLm1hcCgoeyBrZXksIGRhdGEsIGFnZyB9KSA9PiB7XG4gICAgICAgIGxldCBkYXRhUHJ1bmVkID0gZGF0YS5zbGljZShzdGFydClcbiAgICAgICAgaWYgKCFhZ2cpIHtcbiAgICAgICAgICByZXR1cm4geyBrZXksIGRhdGE6IGRhdGFQcnVuZWQgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHsgYXZnLCBjb3VudCwgbWF4LCBtaW4sIHRvdGFsIH0gPSBhZ2dcbiAgICAgICAgbGV0IG1pblBydW5lZCA9IG1pbi5zbGljZShzdGFydClcbiAgICAgICAgbGV0IG1heFBydW5lZCA9IG1heC5zbGljZShzdGFydClcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleSxcbiAgICAgICAgICBkYXRhOiBkYXRhUHJ1bmVkLFxuICAgICAgICAgIGFnZzoge1xuICAgICAgICAgICAgYXZnOiBhdmcuc2xpY2Uoc3RhcnQpLFxuICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICBtaW46IG1pblBydW5lZCxcbiAgICAgICAgICAgIG1heDogbWF4UHJ1bmVkLFxuICAgICAgICAgICAgdG90YWxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGxhc3Q6IHtcbiAgICAgICAgICAgIG1pbjogZmluZExhc3ROb25OdWxsVmFsdWUobWluUHJ1bmVkKSxcbiAgICAgICAgICAgIG1heDogZmluZExhc3ROb25OdWxsVmFsdWUobWF4UHJ1bmVkKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBfX3Nlcmllc1ZhbHVlcyh1LCBzaWR4LCBpZHgpIHtcbiAgICBsZXQgZGF0YXNldCA9IHRoaXMuZGF0YXNldHNbc2lkeF1cbiAgICBpZiAoZGF0YXNldCAmJiBkYXRhc2V0LmRhdGEgJiYgZGF0YXNldC5kYXRhW2lkeF0pIHtcbiAgICAgIGxldCB7IGFnZzogeyBhdmcsIG1heCwgbWluIH0sIGRhdGEgfSA9IGRhdGFzZXRcbiAgICAgIHJldHVybiB7XG4gICAgICAgIFZhbHVlOiBkYXRhW2lkeF0udG9GaXhlZCgzKSxcbiAgICAgICAgTWluOiBtaW5baWR4XS50b0ZpeGVkKDMpLFxuICAgICAgICBNYXg6IG1heFtpZHhdLnRvRml4ZWQoMyksXG4gICAgICAgIEF2ZzogYXZnW2lkeF0udG9GaXhlZCgzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyBWYWx1ZTogXCItLVwiLCBNaW46IFwiLS1cIiwgTWF4OiBcIi0tXCIsIEF2ZzogXCItLVwiIH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5pdGlhbERhdGEoKSB7IHJldHVybiBbW10sIFtdXSB9XG5cbiAgc3RhdGljIGdldENvbmZpZyhvcHRpb25zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzOiBvcHRpb25zLmtpbmQsXG4gICAgICB0aXRsZTogb3B0aW9ucy50aXRsZSxcbiAgICAgIHdpZHRoOiBvcHRpb25zLndpZHRoLFxuICAgICAgaGVpZ2h0OiBvcHRpb25zLmhlaWdodCxcbiAgICAgIHNlcmllczogW1xuICAgICAgICB7IC4uLlhTZXJpZXNWYWx1ZSgpIH0sXG4gICAgICAgIG5ld1Nlcmllc0NvbmZpZyhvcHRpb25zLCAwKVxuICAgICAgXSxcbiAgICAgIHNjYWxlczoge1xuICAgICAgICB4OiB7XG4gICAgICAgICAgbWluOiBvcHRpb25zLm5vdyAtIDYwLFxuICAgICAgICAgIG1heDogb3B0aW9ucy5ub3dcbiAgICAgICAgfSxcbiAgICAgICAgeToge1xuICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICBtYXg6IDFcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBheGVzOiBbXG4gICAgICAgIFhBeGlzKCksXG4gICAgICAgIFlBeGlzKG9wdGlvbnMpXG4gICAgICBdXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5ld0RhdGFzZXQoa2V5LCBsZW5ndGggPSAwKSB7XG4gICAgbGV0IG5pbHMgPSBsZW5ndGggPiAwID8gQXJyYXkobGVuZ3RoKS5maWxsKG51bGwpIDogW11cbiAgICByZXR1cm4ge1xuICAgICAga2V5LFxuICAgICAgZGF0YTogWy4uLm5pbHNdLFxuICAgICAgYWdnOiB7IGF2ZzogWy4uLm5pbHNdLCBjb3VudDogMCwgbWF4OiBbLi4ubmlsc10sIG1pbjogWy4uLm5pbHNdLCB0b3RhbDogMCB9LFxuICAgICAgbGFzdDogeyBtYXg6IG51bGwsIG1pbjogbnVsbCB9XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IF9fTUVUUklDU19fID0ge1xuICBjb3VudGVyOiBDb21tb25NZXRyaWMsXG4gIGxhc3RfdmFsdWU6IENvbW1vbk1ldHJpYyxcbiAgc3VtOiBDb21tb25NZXRyaWMsXG4gIHN1bW1hcnk6IFN1bW1hcnlcbn1cblxuZXhwb3J0IGNsYXNzIFRlbGVtZXRyeUNoYXJ0IHtcbiAgY29uc3RydWN0b3IoY2hhcnRFbCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucy5tZXRyaWMpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYE5vIG1ldHJpYyB0eXBlIHdhcyBwcm92aWRlZGApXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLm1ldHJpYyAmJiAhX19NRVRSSUNTX19bb3B0aW9ucy5tZXRyaWNdKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBObyBtZXRyaWMgZGVmaW5lZCBmb3IgdHlwZSAke29wdGlvbnMubWV0cmljfWApXG4gICAgfVxuXG4gICAgY29uc3QgbWV0cmljID0gX19NRVRSSUNTX19bb3B0aW9ucy5tZXRyaWNdXG4gICAgaWYgKG1ldHJpYyA9PT0gU3VtbWFyeSkge1xuICAgICAgdGhpcy5tZXRyaWMgPSBuZXcgU3VtbWFyeShvcHRpb25zLCBjaGFydEVsKVxuICAgICAgdGhpcy51cGxvdENoYXJ0ID0gdGhpcy5tZXRyaWMuY2hhcnRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51cGxvdENoYXJ0ID0gbmV3IHVQbG90KG1ldHJpYy5nZXRDb25maWcob3B0aW9ucyksIG1ldHJpYy5pbml0aWFsRGF0YShvcHRpb25zKSwgY2hhcnRFbClcbiAgICAgIHRoaXMubWV0cmljID0gbmV3IG1ldHJpYyh0aGlzLnVwbG90Q2hhcnQsIG9wdGlvbnMpXG4gICAgfVxuXG4gICAgLy8gc2V0dXAgdGhlIGRhdGEgYnVmZmVyXG4gICAgbGV0IGlzQnVmZmVyaW5nRGF0YSA9IHR5cGVvZiBvcHRpb25zLnJlZnJlc2hJbnRlcnZhbCAhPT0gXCJ1bmRlZmluZWRcIlxuICAgIHRoaXMuX2lzQnVmZmVyaW5nRGF0YSA9IGlzQnVmZmVyaW5nRGF0YVxuICAgIHRoaXMuX2J1ZmZlciA9IFtdXG4gICAgdGhpcy5fdGltZXIgPSBpc0J1ZmZlcmluZ0RhdGEgPyBzZXRJbnRlcnZhbChcbiAgICAgIHRoaXMuX2ZsdXNoVG9DaGFydC5iaW5kKHRoaXMpLFxuICAgICAgK29wdGlvbnMucmVmcmVzaEludGVydmFsXG4gICAgKSA6IG51bGxcbiAgfVxuXG4gIGNsZWFyVGltZXJzKCkgeyBjbGVhckludGVydmFsKHRoaXMuX3RpbWVyKSB9XG5cbiAgcmVzaXplKGJvdW5kaW5nQm94KSB7XG4gICAgdGhpcy51cGxvdENoYXJ0LnNldFNpemUoe1xuICAgICAgd2lkdGg6IE1hdGgubWF4KGJvdW5kaW5nQm94LndpZHRoLCBtaW5DaGFydFNpemUud2lkdGgpLFxuICAgICAgaGVpZ2h0OiBtaW5DaGFydFNpemUuaGVpZ2h0XG4gICAgfSlcbiAgfVxuXG4gIHB1c2hEYXRhKG1lYXN1cmVtZW50cykge1xuICAgIGlmICghbWVhc3VyZW1lbnRzLmxlbmd0aCkgcmV0dXJuXG4gICAgbGV0IGNhbGxiYWNrID0gdGhpcy5faXNCdWZmZXJpbmdEYXRhID8gdGhpcy5fcHVzaFRvQnVmZmVyIDogdGhpcy5fcHVzaFRvQ2hhcnRcbiAgICBjYWxsYmFjay5jYWxsKHRoaXMsIG1lYXN1cmVtZW50cylcbiAgfVxuXG4gIF9wdXNoVG9CdWZmZXIobWVhc3VyZW1lbnRzKSB7XG4gICAgdGhpcy5fYnVmZmVyID0gdGhpcy5fYnVmZmVyLmNvbmNhdChtZWFzdXJlbWVudHMpXG4gIH1cblxuICBfcHVzaFRvQ2hhcnQobWVhc3VyZW1lbnRzKSB7XG4gICAgdGhpcy5tZXRyaWMuaGFuZGxlTWVhc3VyZW1lbnRzKG1lYXN1cmVtZW50cylcbiAgfVxuXG4gIC8vIGNsZWFycyB0aGUgYnVmZmVyIGFuZCBwdXNoZXMgdGhlIG1lYXN1cmVtZW50c1xuICBfZmx1c2hUb0NoYXJ0KCkge1xuICAgIGxldCBtZWFzdXJlbWVudHMgPSB0aGlzLl9mbHVzaEJ1ZmZlcigpXG4gICAgaWYgKCFtZWFzdXJlbWVudHMubGVuZ3RoKSB7IHJldHVybiB9XG4gICAgdGhpcy5fcHVzaFRvQ2hhcnQobWVhc3VyZW1lbnRzKVxuICB9XG5cbiAgLy8gY2xlYXJzIGFuZCByZXR1cm5zIHRoZSBidWZmZXJlZCBkYXRhIGFzIGEgZmxhdCBhcnJheVxuICBfZmx1c2hCdWZmZXIoKSB7XG4gICAgaWYgKHRoaXMuX2J1ZmZlciAmJiAhdGhpcy5fYnVmZmVyLmxlbmd0aCkgeyByZXR1cm4gW10gfVxuICAgIGxldCBtZWFzdXJlbWVudHMgPSB0aGlzLl9idWZmZXJcbiAgICB0aGlzLl9idWZmZXIgPSBbXVxuICAgIHJldHVybiBtZWFzdXJlbWVudHMucmVkdWNlKChhY2MsIHZhbCkgPT4gYWNjLmNvbmNhdCh2YWwpLCBbXSlcbiAgfVxufVxuXG4vKiogTGl2ZVZpZXcgSG9vayAqKi9cblxuY29uc3QgUGh4Q2hhcnRDb21wb25lbnQgPSB7XG4gIG1vdW50ZWQoKSB7XG4gICAgbGV0IGNoYXJ0RWwgPSB0aGlzLmVsLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNoYXJ0JylcbiAgICBsZXQgc2l6ZSA9IGNoYXJ0RWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBsZXQgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGNoYXJ0RWwuZGF0YXNldCwge1xuICAgICAgdGFnZ2VkOiAoY2hhcnRFbC5kYXRhc2V0LnRhZ3MgJiYgY2hhcnRFbC5kYXRhc2V0LnRhZ3MgIT09IFwiXCIpIHx8IGZhbHNlLFxuICAgICAgd2lkdGg6IE1hdGgubWF4KHNpemUud2lkdGgsIG1pbkNoYXJ0U2l6ZS53aWR0aCksXG4gICAgICBoZWlnaHQ6IG1pbkNoYXJ0U2l6ZS5oZWlnaHQsXG4gICAgICBub3c6IG5ldyBEYXRlKCkgLyAxZTMsXG4gICAgICByZWZyZXNoSW50ZXJ2YWw6IDEwMDBcbiAgICB9KVxuXG4gICAgdGhpcy5jaGFydCA9IG5ldyBUZWxlbWV0cnlDaGFydChjaGFydEVsLCBvcHRpb25zKVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhyb3R0bGUoKCkgPT4ge1xuICAgICAgbGV0IG5ld1NpemUgPSBjaGFydEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB0aGlzLmNoYXJ0LnJlc2l6ZShuZXdTaXplKVxuICAgIH0pKVxuICB9LFxuICB1cGRhdGVkKCkge1xuICAgIGNvbnN0IGRhdGEgPSBBcnJheVxuICAgICAgLmZyb20odGhpcy5lbC5jaGlsZHJlbiB8fCBbXSlcbiAgICAgIC5tYXAoKHsgZGF0YXNldDogeyB4LCB5LCB6IH0gfSkgPT4ge1xuICAgICAgICAvLyBjb252ZXJ0cyB5LWF4aXMgdmFsdWUgKHopIHRvIG51bWJlcixcbiAgICAgICAgLy8gY29udmVydHMgdGltZXN0YW1wICh6KSBmcm9tIFx1MDBCNXMgdG8gZnJhY3Rpb25hbCBzZWNvbmRzXG4gICAgICAgIHJldHVybiB7IHgsIHk6ICt5LCB6OiAreiAvIDFlNiB9XG4gICAgICB9KVxuXG4gICAgaWYgKGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jaGFydC5wdXNoRGF0YShkYXRhKVxuICAgIH1cbiAgfSxcbiAgZGVzdHJveWVkKCkge1xuICAgIHRoaXMuY2hhcnQuY2xlYXJUaW1lcnMoKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBoeENoYXJ0Q29tcG9uZW50XG4iLCAiLyoqIExpdmVWaWV3IEhvb2sgKiovXG5cbmNvbnN0IHNldENvb2tpZSA9IChwYXJhbXMpID0+IHtcbiAgbGV0IGNvb2tpZSA9IGAke3BhcmFtcy5rZXl9PSR7cGFyYW1zLnZhbHVlfTtwYXRoPS9gXG4gIGlmICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIpIHtcbiAgICBjb29raWUgKz0gYDtzYW1lc2l0ZT1zdHJpY3RgXG4gIH1cbiAgaWYgKHBhcmFtcy5kb21haW4pIHtcbiAgICBjb29raWUgKz0gYDtkb21haW49JHtwYXJhbXMuZG9tYWlufWBcbiAgfVxuICBkb2N1bWVudC5jb29raWUgPSBjb29raWVcbn1cblxuY29uc3QgcmVtb3ZlQ29va2llID0gKHBhcmFtcykgPT4ge1xuICBjb25zdCBwYXN0RGF0ZSA9ICdUaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVCdcbiAgZG9jdW1lbnQuY29va2llID0gYCR7cGFyYW1zLmtleX09OyBleHBpcmVzPSR7cGFzdERhdGV9YFxufVxuXG5jb25zdCBpc0Nvb2tpZUVuYWJsZWQgPSAoaG9vaykgPT4ge1xuICByZXR1cm4gaG9vay5lbC5oYXNBdHRyaWJ1dGUoJ2RhdGEtY29va2llLWVuYWJsZWQnKVxufVxuXG5jb25zdCBjb29raWVQYXJhbXMgPSAoaG9vaykgPT4ge1xuICByZXR1cm4ge1xuICAgIGtleTogaG9vay5lbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29va2llLWtleScpLFxuICAgIHZhbHVlOiBob29rLmVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb29raWUtdmFsdWUnKSxcbiAgICBkb21haW46IGhvb2suZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWNvb2tpZS1kb21haW4nKVxuICB9XG59XG5cbmNvbnN0IFBoeFJlcXVlc3RMb2dnZXJDb29raWUgPSB7XG4gIHVwZGF0ZWQoKSB7XG4gICAgY29uc3QgbG9nZ2VyQ29va2llUGFyYW1zID0gY29va2llUGFyYW1zKHRoaXMpXG4gICAgcmVtb3ZlQ29va2llKGxvZ2dlckNvb2tpZVBhcmFtcylcblxuICAgIGlmIChpc0Nvb2tpZUVuYWJsZWQodGhpcykpIHtcbiAgICAgIHNldENvb2tpZShsb2dnZXJDb29raWVQYXJhbXMpXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBQaHhSZXF1ZXN0TG9nZ2VyQ29va2llXG4iLCAiLyoqIExpdmVWaWV3IEhvb2sgKiovXG5cbmNvbnN0IGNvcHlUb0NsaXBib2FyZCA9ICh0ZXh0YXJlYSkgPT4ge1xuICAgIGlmICghbmF2aWdhdG9yLmNsaXBib2FyZCl7XG4gICAgICAvLyBEZXByZWNhdGVkIGNsaXBib2FyZCBBUElcbiAgICAgIHRleHRhcmVhLnNlbGVjdCgpXG4gICAgICB0ZXh0YXJlYS5zZXRTZWxlY3Rpb25SYW5nZSgwLCA5OTk5OSlcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5JylcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTW9kZXJuIENsaXBib2FyZCBBUElcbiAgICAgIGNvbnN0IHRleHQgPSB0ZXh0YXJlYS52YWx1ZVxuICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dClcbiAgICB9XG4gIH1cblxuY29uc3QgUGh4UmVxdWVzdExvZ2dlclF1ZXJ5UGFyYW1ldGVyID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuZWwucXVlcnlTZWxlY3RvcignLmJ0bi1wcmltYXJ5JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgIGNvbnN0IHRleHRhcmVhID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCd0ZXh0YXJlYScpXG4gICAgICBjb3B5VG9DbGlwYm9hcmQodGV4dGFyZWEpXG4gICAgICBjb25zdCBjb3B5SW5kaWNhdG9yID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcuY29weS1pbmRpY2F0b3InKVxuICAgICAgY29weUluZGljYXRvci5zZXRBdHRyaWJ1dGUoJ2RhdGEtZW5hYmxlZCcsICdmYWxzZScpXG4gICAgICB2b2lkIGNvcHlJbmRpY2F0b3Iub2Zmc2V0V2lkdGggLy8gUmVzZXRzIHRoZSBhbmltYXRpb24gdG8gZW5zdXJlIGl0IHdpbGwgYmUgcGxheWVkIGFnYWluXG4gICAgICBjb3B5SW5kaWNhdG9yLnNldEF0dHJpYnV0ZSgnZGF0YS1lbmFibGVkJywgJ3RydWUnKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGh4UmVxdWVzdExvZ2dlclF1ZXJ5UGFyYW1ldGVyXG4iLCAiLyoqIExpdmVWaWV3IEhvb2sgKiovXG5cbmNvbnN0IFBoeFJlcXVlc3RMb2dnZXJNZXNzYWdlcyA9IHtcbiAgdXBkYXRlZCgpIHtcbiAgICBpZiAodGhpcy5lbC5xdWVyeVNlbGVjdG9yKCcubG9nZ2VyLWF1dG9zY3JvbGwtY2hlY2tib3gnKS5jaGVja2VkKSB7XG4gICAgICBjb25zdCBtZXNzYWdlc0VsZW1lbnQgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJyNsb2dnZXItbWVzc2FnZXMnKVxuICAgICAgbWVzc2FnZXNFbGVtZW50LnNjcm9sbFRvcCA9IG1lc3NhZ2VzRWxlbWVudC5zY3JvbGxIZWlnaHRcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGh4UmVxdWVzdExvZ2dlck1lc3NhZ2VzXG4iLCAiY29uc3QgaW50ZXJhY3RpdmVJdGVtU2VsZWN0b3IgPSAnLnByb2dyZXNzLWJhciwgLmNvbG9yLWJhci1sZWdlbmQtZW50cnknXG5sZXQgaGlnaGxpZ2h0ZWRFbGVtZW50TmFtZVxuXG5jb25zdCBoaWdobGlnaHRFbGVtZW50cyA9IChjb250YWluZXJFbGVtZW50KSA9PiB7XG4gIGNvbnRhaW5lckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChpbnRlcmFjdGl2ZUl0ZW1TZWxlY3RvcikuZm9yRWFjaCgocHJvZ3Jlc3NCYXJFbGVtZW50KSA9PiB7XG4gICAgaWYoaGlnaGxpZ2h0ZWRFbGVtZW50TmFtZSkge1xuICAgICAgY29uc3QgaXNNdXRlZCA9IHByb2dyZXNzQmFyRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpICE9PSBoaWdobGlnaHRlZEVsZW1lbnROYW1lXG5cbiAgICAgIHByb2dyZXNzQmFyRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbXV0ZWQnLCBpc011dGVkKVxuICAgIH0gZWxzZSB7XG4gICAgICBwcm9ncmVzc0JhckVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLW11dGVkJylcbiAgICB9XG4gIH0pXG59XG5cbmNvbnN0IFBoeENvbG9yQmFySGlnaGxpZ2h0ID0ge1xuICBtb3VudGVkKCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkYXRhLWhpZ2hsaWdodC1lbmFibGVkJywgJ3RydWUnKVxuICAgIHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChpbnRlcmFjdGl2ZUl0ZW1TZWxlY3RvcikuZm9yRWFjaCgocHJvZ3Jlc3NCYXJFbGVtZW50KSA9PiAoXG4gICAgICBwcm9ncmVzc0JhckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmFtZScpXG4gICAgICAgIGhpZ2hsaWdodGVkRWxlbWVudE5hbWUgPSBuYW1lID09PSBoaWdobGlnaHRlZEVsZW1lbnROYW1lID8gbnVsbCA6IG5hbWVcbiAgICAgICAgaGlnaGxpZ2h0RWxlbWVudHModGhpcy5lbClcbiAgICAgIH0pXG4gICAgKSlcbiAgfSxcblxuICB1cGRhdGVkKCkge1xuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKCdkYXRhLWhpZ2hsaWdodC1lbmFibGVkJywgJ3RydWUnKVxuICAgIGhpZ2hsaWdodEVsZW1lbnRzKHRoaXMuZWwpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGh4Q29sb3JCYXJIaWdobGlnaHRcbiIsICJjb25zdCBSRUZSRVNIX0RBVEFfQ09PS0lFID0gXCJfcmVmcmVzaF9kYXRhXCI7XG5cbi8qKlxuICogU3RvcmVzIHJlZnJlc2ggZGF0YSBpbiB0aGUgYFwicmVmcmVzaF9kYXRhXCJgIGNvb2tpZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3JlUmVmcmVzaERhdGEocmVmcmVzaERhdGEsIHBhdGgpIHtcbiAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHJlZnJlc2hEYXRhKTtcbiAgY29uc3QgZW5jb2RlZCA9IGVuY29kZUJhc2U2NChqc29uKTtcbiAgc2V0Q29va2llKFJFRlJFU0hfREFUQV9DT09LSUUsIGVuY29kZWQsIHBhdGgsIDE1NzY4MDAwMCk7IC8vIDUgeWVhcnNcbn1cblxuLyoqXG4gKiBMb2FkcyByZWZyZXNoIGRhdGEgZnJvbSB0aGUgYFwicmVmcmVzaF9kYXRhXCJgIGNvb2tpZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRSZWZyZXNoRGF0YSgpIHtcbiAgY29uc3QgZW5jb2RlZCA9IGdldENvb2tpZVZhbHVlKFJFRlJFU0hfREFUQV9DT09LSUUpO1xuICBpZiAoZW5jb2RlZCkge1xuICAgIGNvbnN0IGpzb24gPSBkZWNvZGVCYXNlNjQoZW5jb2RlZCk7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoanNvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llVmFsdWUoa2V5KSB7XG4gIGNvbnN0IGNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZVxuICAgIC5zcGxpdChcIjsgXCIpXG4gICAgLmZpbmQoKGNvb2tpZSkgPT4gY29va2llLnN0YXJ0c1dpdGgoYCR7a2V5fT1gKSk7XG5cbiAgaWYgKGNvb2tpZSkge1xuICAgIGNvbnN0IHZhbHVlID0gY29va2llLnJlcGxhY2UoYCR7a2V5fT1gLCBcIlwiKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0Q29va2llKGtleSwgdmFsdWUsIHBhdGgsIG1heEFnZSkge1xuICBjb25zdCBjb29raWUgPSBgJHtrZXl9PSR7dmFsdWV9O21heC1hZ2U9JHttYXhBZ2V9O3BhdGg9JHtwYXRofWA7XG4gIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZTtcbn1cblxuZnVuY3Rpb24gZW5jb2RlQmFzZTY0KHN0cmluZykge1xuICByZXR1cm4gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKSkpO1xufVxuXG5mdW5jdGlvbiBkZWNvZGVCYXNlNjQoYmluYXJ5KSB7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKGF0b2IoYmluYXJ5KSkpO1xufVxuIiwgIi8qKiBMaXZlVmlldyBIb29rICoqL1xuXG5pbXBvcnQgeyBzdG9yZVJlZnJlc2hEYXRhLCBsb2FkUmVmcmVzaERhdGEgfSBmcm9tIFwiLi4vcmVmcmVzaFwiO1xuXG5jb25zdCBQaHhSZW1lbWJlclJlZnJlc2ggPSB7XG4gIHVwZGF0ZWQoKSB7XG4gICAgbGV0IGNvbmZpZyA9IGxvYWRSZWZyZXNoRGF0YSgpIHx8IHt9O1xuICAgIGNvbmZpZ1t0aGlzLmVsLmRhdGFzZXQucGFnZV0gPSB0aGlzLmVsLnZhbHVlXG4gICAgc3RvcmVSZWZyZXNoRGF0YShjb25maWcsIHRoaXMuZWwuZGF0YXNldC5kYXNoYm9hcmRNb3VudFBhdGgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBoeFJlbWVtYmVyUmVmcmVzaFxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUdDLE1BQUMsVUFBUyxNQUFNLFNBQVM7QUFFeEIsWUFBSSxPQUFPLFdBQVcsY0FBYyxPQUFPLEtBQUs7QUFDOUMsaUJBQU8sT0FBTztBQUFBLFFBQ2hCLFdBQVcsT0FBTyxZQUFZLFVBQVU7QUFDdEMsaUJBQU8sVUFBVSxRQUFRO0FBQUEsUUFDM0IsT0FBTztBQUNMLGVBQUssWUFBWSxRQUFRO0FBQUEsUUFDM0I7QUFBQSxNQUVGLEdBQUcsU0FBTSxXQUFXO0FBQ2xCLFlBQUksYUFBWSxDQUFDO0FBRWpCLG1CQUFVLFVBQVU7QUFFcEIsWUFBSSxXQUFXLFdBQVUsV0FBVztBQUFBLFVBQ2xDLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxVQUNSLGVBQWU7QUFBQSxVQUNmLE9BQU87QUFBQSxVQUNQLFNBQVM7QUFBQSxVQUNULGFBQWE7QUFBQSxVQUNiLGNBQWM7QUFBQSxVQUNkLGFBQWE7QUFBQSxVQUNiLGFBQWE7QUFBQSxVQUNiLGlCQUFpQjtBQUFBLFVBQ2pCLFFBQVE7QUFBQSxVQUNSLFVBQVU7QUFBQSxRQUNaO0FBU0EsbUJBQVUsWUFBWSxTQUFTLFNBQVM7QUFDdEMsY0FBSSxLQUFLO0FBQ1QsZUFBSyxPQUFPLFNBQVM7QUFDbkIsb0JBQVEsUUFBUTtBQUNoQixnQkFBSSxVQUFVLFVBQWEsUUFBUSxlQUFlLEdBQUc7QUFBRyx1QkFBUyxPQUFPO0FBQUEsVUFDMUU7QUFFQSxpQkFBTztBQUFBLFFBQ1Q7QUFNQSxtQkFBVSxTQUFTO0FBU25CLG1CQUFVLE1BQU0sU0FBUyxHQUFHO0FBQzFCLGNBQUksVUFBVSxXQUFVLFVBQVU7QUFFbEMsY0FBSSxPQUFNLEdBQUcsU0FBUyxTQUFTLENBQUM7QUFDaEMscUJBQVUsU0FBVSxNQUFNLElBQUksT0FBTztBQUVyQyxjQUFJLFdBQVcsV0FBVSxPQUFPLENBQUMsT0FBTyxHQUNwQyxNQUFXLFNBQVMsY0FBYyxTQUFTLFdBQVcsR0FDdEQsUUFBVyxTQUFTLE9BQ3BCLE9BQVcsU0FBUztBQUV4QixtQkFBUztBQUVULGdCQUFNLFNBQVMsTUFBTTtBQUVuQixnQkFBSSxTQUFTLGtCQUFrQjtBQUFJLHVCQUFTLGdCQUFnQixXQUFVLGtCQUFrQjtBQUd4RixnQkFBSSxLQUFLLGVBQWUsR0FBRyxPQUFPLElBQUksQ0FBQztBQUV2QyxnQkFBSSxNQUFNLEdBQUc7QUFFWCxrQkFBSSxVQUFVO0FBQUEsZ0JBQ1osWUFBWTtBQUFBLGdCQUNaLFNBQVM7QUFBQSxjQUNYLENBQUM7QUFDRCx1QkFBUztBQUVULHlCQUFXLFdBQVc7QUFDcEIsb0JBQUksVUFBVTtBQUFBLGtCQUNaLFlBQVksU0FBUyxRQUFRO0FBQUEsa0JBQzdCLFNBQVM7QUFBQSxnQkFDWCxDQUFDO0FBQ0QsMkJBQVcsV0FBVztBQUNwQiw2QkFBVSxPQUFPO0FBQ2pCLHVCQUFLO0FBQUEsZ0JBQ1AsR0FBRyxLQUFLO0FBQUEsY0FDVixHQUFHLEtBQUs7QUFBQSxZQUNWLE9BQU87QUFDTCx5QkFBVyxNQUFNLEtBQUs7QUFBQSxZQUN4QjtBQUFBLFVBQ0YsQ0FBQztBQUVELGlCQUFPO0FBQUEsUUFDVDtBQUVBLG1CQUFVLFlBQVksV0FBVztBQUMvQixpQkFBTyxPQUFPLFdBQVUsV0FBVztBQUFBLFFBQ3JDO0FBU0EsbUJBQVUsUUFBUSxXQUFXO0FBQzNCLGNBQUksQ0FBQyxXQUFVO0FBQVEsdUJBQVUsSUFBSSxDQUFDO0FBRXRDLGNBQUksT0FBTyxXQUFXO0FBQ3BCLHVCQUFXLFdBQVc7QUFDcEIsa0JBQUksQ0FBQyxXQUFVO0FBQVE7QUFDdkIseUJBQVUsUUFBUTtBQUNsQixtQkFBSztBQUFBLFlBQ1AsR0FBRyxTQUFTLFlBQVk7QUFBQSxVQUMxQjtBQUVBLGNBQUksU0FBUztBQUFTLGlCQUFLO0FBRTNCLGlCQUFPO0FBQUEsUUFDVDtBQWNBLG1CQUFVLE9BQU8sU0FBUyxPQUFPO0FBQy9CLGNBQUksQ0FBQyxTQUFTLENBQUMsV0FBVTtBQUFRLG1CQUFPO0FBRXhDLGlCQUFPLFdBQVUsSUFBSSxNQUFNLE1BQU0sS0FBSyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUM7QUFBQSxRQUN2RDtBQU1BLG1CQUFVLE1BQU0sU0FBUyxRQUFRO0FBQy9CLGNBQUksSUFBSSxXQUFVO0FBRWxCLGNBQUksQ0FBQyxHQUFHO0FBQ04sbUJBQU8sV0FBVSxNQUFNO0FBQUEsVUFDekIsT0FBTztBQUNMLGdCQUFJLE9BQU8sV0FBVyxVQUFVO0FBQzlCLHVCQUFVLEtBQUksS0FBSyxPQUFNLEtBQUssT0FBTyxJQUFJLEdBQUcsS0FBSyxJQUFJO0FBQUEsWUFDdkQ7QUFFQSxnQkFBSSxPQUFNLElBQUksUUFBUSxHQUFHLEtBQUs7QUFDOUIsbUJBQU8sV0FBVSxJQUFJLENBQUM7QUFBQSxVQUN4QjtBQUFBLFFBQ0Y7QUFFQSxtQkFBVSxVQUFVLFdBQVc7QUFDN0IsaUJBQU8sV0FBVSxJQUFJLEtBQUssT0FBTyxJQUFJLFNBQVMsV0FBVztBQUFBLFFBQzNEO0FBUUEsUUFBQyxZQUFXO0FBQ1YsY0FBSSxVQUFVLEdBQUcsVUFBVTtBQUUzQixxQkFBVSxVQUFVLFNBQVMsVUFBVTtBQUNyQyxnQkFBSSxDQUFDLFlBQVksU0FBUyxNQUFNLE1BQU0sWUFBWTtBQUNoRCxxQkFBTztBQUFBLFlBQ1Q7QUFFQSxnQkFBSSxZQUFZLEdBQUc7QUFDakIseUJBQVUsTUFBTTtBQUFBLFlBQ2xCO0FBRUE7QUFDQTtBQUVBLHFCQUFTLE9BQU8sV0FBVztBQUN6QjtBQUNBLGtCQUFJLFlBQVksR0FBRztBQUNmLDBCQUFVO0FBQ1YsMkJBQVUsS0FBSztBQUFBLGNBQ25CLE9BQU87QUFDSCwyQkFBVSxJQUFLLFdBQVUsV0FBVyxPQUFPO0FBQUEsY0FDL0M7QUFBQSxZQUNGLENBQUM7QUFFRCxtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUVGLEdBQUc7QUFPSCxtQkFBVSxTQUFTLFNBQVMsV0FBVztBQUNyQyxjQUFJLFdBQVUsV0FBVztBQUFHLG1CQUFPLFNBQVMsZUFBZSxXQUFXO0FBRXRFLG9CQUFTLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUVuRCxjQUFJLFdBQVcsU0FBUyxjQUFjLEtBQUs7QUFDM0MsbUJBQVMsS0FBSztBQUNkLG1CQUFTLFlBQVksU0FBUztBQUU5QixjQUFJLE1BQVcsU0FBUyxjQUFjLFNBQVMsV0FBVyxHQUN0RCxPQUFXLFlBQVksU0FBUyxVQUFVLFdBQVUsVUFBVSxDQUFDLEdBQy9ELFNBQVcsU0FBUyxjQUFjLFNBQVMsTUFBTSxHQUNqRDtBQUVKLGNBQUksS0FBSztBQUFBLFlBQ1AsWUFBWTtBQUFBLFlBQ1osV0FBVyxpQkFBaUIsT0FBTztBQUFBLFVBQ3JDLENBQUM7QUFFRCxjQUFJLENBQUMsU0FBUyxhQUFhO0FBQ3pCLHNCQUFVLFNBQVMsY0FBYyxTQUFTLGVBQWU7QUFDekQsdUJBQVcsY0FBYyxPQUFPO0FBQUEsVUFDbEM7QUFFQSxjQUFJLFVBQVUsU0FBUyxNQUFNO0FBQzNCLHNCQUFTLFFBQVEseUJBQXlCO0FBQUEsVUFDNUM7QUFFQSxpQkFBTyxZQUFZLFFBQVE7QUFDM0IsaUJBQU87QUFBQSxRQUNUO0FBTUEsbUJBQVUsU0FBUyxXQUFXO0FBQzVCLHNCQUFZLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUN0RCxzQkFBWSxTQUFTLGNBQWMsU0FBUyxNQUFNLEdBQUcseUJBQXlCO0FBQzlFLGNBQUksV0FBVyxTQUFTLGVBQWUsV0FBVztBQUNsRCxzQkFBWSxjQUFjLFFBQVE7QUFBQSxRQUNwQztBQU1BLG1CQUFVLGFBQWEsV0FBVztBQUNoQyxpQkFBTyxDQUFDLENBQUMsU0FBUyxlQUFlLFdBQVc7QUFBQSxRQUM5QztBQU1BLG1CQUFVLG9CQUFvQixXQUFXO0FBRXZDLGNBQUksWUFBWSxTQUFTLEtBQUs7QUFHOUIsY0FBSSxlQUFnQixxQkFBcUIsWUFBYSxXQUNsQyxrQkFBa0IsWUFBYSxRQUMvQixpQkFBaUIsWUFBYSxPQUM5QixnQkFBZ0IsWUFBYSxNQUFNO0FBRXZELGNBQUksZUFBZSxpQkFBaUIsV0FBVztBQUU3QyxtQkFBTztBQUFBLFVBQ1QsV0FBVyxlQUFlLGVBQWUsV0FBVztBQUVsRCxtQkFBTztBQUFBLFVBQ1QsT0FBTztBQUVMLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFNQSx3QkFBZSxHQUFHLE1BQUssTUFBSztBQUMxQixjQUFJLElBQUk7QUFBSyxtQkFBTztBQUNwQixjQUFJLElBQUk7QUFBSyxtQkFBTztBQUNwQixpQkFBTztBQUFBLFFBQ1Q7QUFPQSwyQkFBbUIsR0FBRztBQUNwQixpQkFBUSxNQUFLLEtBQUs7QUFBQSxRQUNwQjtBQVFBLGdDQUF3QixHQUFHLE9BQU8sTUFBTTtBQUN0QyxjQUFJO0FBRUosY0FBSSxTQUFTLGtCQUFrQixlQUFlO0FBQzVDLHFCQUFTLEVBQUUsV0FBVyxpQkFBZSxVQUFVLENBQUMsSUFBRSxTQUFTO0FBQUEsVUFDN0QsV0FBVyxTQUFTLGtCQUFrQixhQUFhO0FBQ2pELHFCQUFTLEVBQUUsV0FBVyxlQUFhLFVBQVUsQ0FBQyxJQUFFLE9BQU87QUFBQSxVQUN6RCxPQUFPO0FBQ0wscUJBQVMsRUFBRSxlQUFlLFVBQVUsQ0FBQyxJQUFFLElBQUk7QUFBQSxVQUM3QztBQUVBLGlCQUFPLGFBQWEsU0FBTyxRQUFNLFFBQU07QUFFdkMsaUJBQU87QUFBQSxRQUNUO0FBTUEsWUFBSSxRQUFTLFdBQVc7QUFDdEIsY0FBSSxVQUFVLENBQUM7QUFFZiwwQkFBZ0I7QUFDZCxnQkFBSSxLQUFLLFFBQVEsTUFBTTtBQUN2QixnQkFBSSxJQUFJO0FBQ04saUJBQUcsSUFBSTtBQUFBLFlBQ1Q7QUFBQSxVQUNGO0FBRUEsaUJBQU8sU0FBUyxJQUFJO0FBQ2xCLG9CQUFRLEtBQUssRUFBRTtBQUNmLGdCQUFJLFFBQVEsVUFBVTtBQUFHLG1CQUFLO0FBQUEsVUFDaEM7QUFBQSxRQUNGLEVBQUc7QUFVSCxZQUFJLE1BQU8sV0FBVztBQUNwQixjQUFJLGNBQWMsQ0FBRSxVQUFVLEtBQUssT0FBTyxJQUFLLEdBQzNDLFdBQWMsQ0FBQztBQUVuQiw2QkFBbUIsUUFBUTtBQUN6QixtQkFBTyxPQUFPLFFBQVEsU0FBUyxLQUFLLEVBQUUsUUFBUSxnQkFBZ0IsU0FBUyxPQUFPLFFBQVE7QUFDcEYscUJBQU8sT0FBTyxZQUFZO0FBQUEsWUFDNUIsQ0FBQztBQUFBLFVBQ0g7QUFFQSxpQ0FBdUIsTUFBTTtBQUMzQixnQkFBSSxRQUFRLFNBQVMsS0FBSztBQUMxQixnQkFBSSxRQUFRO0FBQU8scUJBQU87QUFFMUIsZ0JBQUksSUFBSSxZQUFZLFFBQ2hCLFVBQVUsS0FBSyxPQUFPLENBQUMsRUFBRSxZQUFZLElBQUksS0FBSyxNQUFNLENBQUMsR0FDckQ7QUFDSixtQkFBTyxLQUFLO0FBQ1YsMkJBQWEsWUFBWSxLQUFLO0FBQzlCLGtCQUFJLGNBQWM7QUFBTyx1QkFBTztBQUFBLFlBQ2xDO0FBRUEsbUJBQU87QUFBQSxVQUNUO0FBRUEsZ0NBQXNCLE1BQU07QUFDMUIsbUJBQU8sVUFBVSxJQUFJO0FBQ3JCLG1CQUFPLFNBQVMsU0FBVSxVQUFTLFFBQVEsY0FBYyxJQUFJO0FBQUEsVUFDL0Q7QUFFQSw0QkFBa0IsU0FBUyxNQUFNLE9BQU87QUFDdEMsbUJBQU8sYUFBYSxJQUFJO0FBQ3hCLG9CQUFRLE1BQU0sUUFBUTtBQUFBLFVBQ3hCO0FBRUEsaUJBQU8sU0FBUyxTQUFTLFlBQVk7QUFDbkMsZ0JBQUksT0FBTyxXQUNQLE1BQ0E7QUFFSixnQkFBSSxLQUFLLFVBQVUsR0FBRztBQUNwQixtQkFBSyxRQUFRLFlBQVk7QUFDdkIsd0JBQVEsV0FBVztBQUNuQixvQkFBSSxVQUFVLFVBQWEsV0FBVyxlQUFlLElBQUk7QUFBRywyQkFBUyxTQUFTLE1BQU0sS0FBSztBQUFBLGNBQzNGO0FBQUEsWUFDRixPQUFPO0FBQ0wsdUJBQVMsU0FBUyxLQUFLLElBQUksS0FBSyxFQUFFO0FBQUEsWUFDcEM7QUFBQSxVQUNGO0FBQUEsUUFDRixFQUFHO0FBTUgsMEJBQWtCLFNBQVMsTUFBTTtBQUMvQixjQUFJLE9BQU8sT0FBTyxXQUFXLFdBQVcsVUFBVSxXQUFVLE9BQU87QUFDbkUsaUJBQU8sS0FBSyxRQUFRLE1BQU0sT0FBTyxHQUFHLEtBQUs7QUFBQSxRQUMzQztBQU1BLDJCQUFrQixTQUFTLE1BQU07QUFDL0IsY0FBSSxVQUFVLFdBQVUsT0FBTyxHQUMzQixVQUFVLFVBQVU7QUFFeEIsY0FBSSxTQUFTLFNBQVMsSUFBSTtBQUFHO0FBRzdCLGtCQUFRLFlBQVksUUFBUSxVQUFVLENBQUM7QUFBQSxRQUN6QztBQU1BLDZCQUFxQixTQUFTLE1BQU07QUFDbEMsY0FBSSxVQUFVLFdBQVUsT0FBTyxHQUMzQjtBQUVKLGNBQUksQ0FBQyxTQUFTLFNBQVMsSUFBSTtBQUFHO0FBRzlCLG9CQUFVLFFBQVEsUUFBUSxNQUFNLE9BQU8sS0FBSyxHQUFHO0FBRy9DLGtCQUFRLFlBQVksUUFBUSxVQUFVLEdBQUcsUUFBUSxTQUFTLENBQUM7QUFBQSxRQUM3RDtBQVFBLDRCQUFtQixTQUFTO0FBQzFCLGlCQUFRLE9BQU8sU0FBUSxhQUFhLE1BQU0sS0FBSyxRQUFRLFNBQVMsR0FBRztBQUFBLFFBQ3JFO0FBTUEsK0JBQXVCLFNBQVM7QUFDOUIscUJBQVcsUUFBUSxjQUFjLFFBQVEsV0FBVyxZQUFZLE9BQU87QUFBQSxRQUN6RTtBQUVBLGVBQU87QUFBQSxNQUNULENBQUM7QUFBQTtBQUFBOzs7QUN4ZEQsRUFBQyxZQUFXO0FBQ1YsUUFBSSxnQkFBZ0IsaUJBQWlCO0FBRXJDLGdDQUE0QjtBQUMxQixVQUFJLE9BQU8sT0FBTyxnQkFBZ0I7QUFBWSxlQUFPLE9BQU87QUFFNUQsNEJBQXFCLE9BQU8sUUFBUTtBQUNsQyxpQkFBUyxVQUFVLEVBQUMsU0FBUyxPQUFPLFlBQVksT0FBTyxRQUFRLE9BQVM7QUFDeEUsWUFBSSxNQUFNLFNBQVMsWUFBWSxhQUFhO0FBQzVDLFlBQUksZ0JBQWdCLE9BQU8sT0FBTyxTQUFTLE9BQU8sWUFBWSxPQUFPLE1BQU07QUFDM0UsZUFBTztBQUFBLE1BQ1Q7QUFDQSxtQkFBWSxZQUFZLE9BQU8sTUFBTTtBQUNyQyxhQUFPO0FBQUEsSUFDVDtBQUVBLDhCQUEwQixNQUFNLE9BQU87QUFDckMsVUFBSSxRQUFRLFNBQVMsY0FBYyxPQUFPO0FBQzFDLFlBQU0sT0FBTztBQUNiLFlBQU0sT0FBTztBQUNiLFlBQU0sUUFBUTtBQUNkLGFBQU87QUFBQSxJQUNUO0FBRUEseUJBQXFCLFNBQVMsbUJBQW1CO0FBQy9DLFVBQUksS0FBSyxRQUFRLGFBQWEsU0FBUyxHQUNuQyxTQUFTLGlCQUFpQixXQUFXLFFBQVEsYUFBYSxhQUFhLENBQUMsR0FDeEUsT0FBTyxpQkFBaUIsZUFBZSxRQUFRLGFBQWEsV0FBVyxDQUFDLEdBQ3hFLE9BQU8sU0FBUyxjQUFjLE1BQU0sR0FDcEMsU0FBUyxRQUFRLGFBQWEsUUFBUTtBQUUxQyxXQUFLLFNBQVUsUUFBUSxhQUFhLGFBQWEsTUFBTSxRQUFTLFFBQVE7QUFDeEUsV0FBSyxTQUFTO0FBQ2QsV0FBSyxNQUFNLFVBQVU7QUFFckIsVUFBSTtBQUFRLGFBQUssU0FBUztBQUFBLGVBQ2pCO0FBQW1CLGFBQUssU0FBUztBQUUxQyxXQUFLLFlBQVksSUFBSTtBQUNyQixXQUFLLFlBQVksTUFBTTtBQUN2QixlQUFTLEtBQUssWUFBWSxJQUFJO0FBQzlCLFdBQUssT0FBTztBQUFBLElBQ2Q7QUFFQSxXQUFPLGlCQUFpQixTQUFTLFNBQVMsR0FBRztBQUMzQyxVQUFJLFVBQVUsRUFBRTtBQUNoQixVQUFJLEVBQUU7QUFBa0I7QUFFeEIsYUFBTyxXQUFXLFFBQVEsY0FBYztBQUN0QyxZQUFJLG1CQUFtQixJQUFJLGNBQWMsc0JBQXNCO0FBQUEsVUFDN0QsV0FBVztBQUFBLFVBQU0sY0FBYztBQUFBLFFBQ2pDLENBQUM7QUFFRCxZQUFJLENBQUMsUUFBUSxjQUFjLGdCQUFnQixHQUFHO0FBQzVDLFlBQUUsZUFBZTtBQUNqQixZQUFFLHlCQUF5QjtBQUMzQixpQkFBTztBQUFBLFFBQ1Q7QUFFQSxZQUFJLFFBQVEsYUFBYSxhQUFhLEdBQUc7QUFDdkMsc0JBQVksU0FBUyxFQUFFLFdBQVcsRUFBRSxRQUFRO0FBQzVDLFlBQUUsZUFBZTtBQUNqQixpQkFBTztBQUFBLFFBQ1QsT0FBTztBQUNMLG9CQUFVLFFBQVE7QUFBQSxRQUNwQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLEdBQUcsS0FBSztBQUVSLFdBQU8saUJBQWlCLHNCQUFzQixTQUFVLEdBQUc7QUFDekQsVUFBSSxVQUFVLEVBQUUsT0FBTyxhQUFhLGNBQWM7QUFDbEQsVUFBRyxXQUFXLENBQUMsT0FBTyxRQUFRLE9BQU8sR0FBRztBQUN0QyxVQUFFLGVBQWU7QUFBQSxNQUNuQjtBQUFBLElBQ0YsR0FBRyxLQUFLO0FBQUEsRUFDVixHQUFHOzs7QUM1RUksTUFBSSxVQUFVLENBQUMsVUFBVTtBQUM5QixRQUFHLE9BQU8sVUFBVSxZQUFXO0FBQzdCLGFBQU87SUFDVCxPQUFPO0FBQ0wsVUFBSSxZQUFVLFdBQVc7QUFBRSxlQUFPO01BQU07QUFDeEMsYUFBTztJQUNUO0VBQ0Y7QUNSTyxNQUFNLGFBQWEsT0FBTyxTQUFTLGNBQWMsT0FBTztBQUN4RCxNQUFNLFlBQVksT0FBTyxXQUFXLGNBQWMsU0FBUztBQUMzRCxNQUFNLFNBQVMsY0FBYyxhQUFhO0FBQzFDLE1BQU0sY0FBYztBQUNwQixNQUFNLGdCQUFnQixFQUFDLFlBQVksR0FBRyxNQUFNLEdBQUcsU0FBUyxHQUFHLFFBQVEsRUFBQztBQUNwRSxNQUFNLGtCQUFrQjtBQUN4QixNQUFNLGtCQUFrQjtBQUN4QixNQUFNLGlCQUFpQjtJQUM1QixRQUFRO0lBQ1IsU0FBUztJQUNULFFBQVE7SUFDUixTQUFTO0lBQ1QsU0FBUztFQUNYO0FBQ08sTUFBTSxpQkFBaUI7SUFDNUIsT0FBTztJQUNQLE9BQU87SUFDUCxNQUFNO0lBQ04sT0FBTztJQUNQLE9BQU87RUFDVDtBQUVPLE1BQU0sYUFBYTtJQUN4QixVQUFVO0lBQ1YsV0FBVztFQUNiO0FBQ08sTUFBTSxhQUFhO0lBQ3hCLFVBQVU7RUFDWjtBQ3JCQSxNQUFxQixPQUFyQixNQUEwQjtJQUN4QixZQUFZLFNBQVMsT0FBTyxTQUFTLFNBQVE7QUFDM0MsV0FBSyxVQUFVO0FBQ2YsV0FBSyxRQUFRO0FBQ2IsV0FBSyxVQUFVLFdBQVcsV0FBVztBQUFFLGVBQU8sQ0FBQztNQUFFO0FBQ2pELFdBQUssZUFBZTtBQUNwQixXQUFLLFVBQVU7QUFDZixXQUFLLGVBQWU7QUFDcEIsV0FBSyxXQUFXLENBQUM7QUFDakIsV0FBSyxPQUFPO0lBQ2Q7SUFNQSxPQUFPLFNBQVE7QUFDYixXQUFLLFVBQVU7QUFDZixXQUFLLE1BQU07QUFDWCxXQUFLLEtBQUs7SUFDWjtJQUtBLE9BQU07QUFDSixVQUFHLEtBQUssWUFBWSxTQUFTLEdBQUU7QUFBRTtNQUFPO0FBQ3hDLFdBQUssYUFBYTtBQUNsQixXQUFLLE9BQU87QUFDWixXQUFLLFFBQVEsT0FBTyxLQUFLO1FBQ3ZCLE9BQU8sS0FBSyxRQUFRO1FBQ3BCLE9BQU8sS0FBSztRQUNaLFNBQVMsS0FBSyxRQUFRO1FBQ3RCLEtBQUssS0FBSztRQUNWLFVBQVUsS0FBSyxRQUFRLFFBQVE7TUFDakMsQ0FBQztJQUNIO0lBT0EsUUFBUSxRQUFRLFVBQVM7QUFDdkIsVUFBRyxLQUFLLFlBQVksTUFBTSxHQUFFO0FBQzFCLGlCQUFTLEtBQUssYUFBYSxRQUFRO01BQ3JDO0FBRUEsV0FBSyxTQUFTLEtBQUssRUFBQyxRQUFRLFNBQVEsQ0FBQztBQUNyQyxhQUFPO0lBQ1Q7SUFLQSxRQUFPO0FBQ0wsV0FBSyxlQUFlO0FBQ3BCLFdBQUssTUFBTTtBQUNYLFdBQUssV0FBVztBQUNoQixXQUFLLGVBQWU7QUFDcEIsV0FBSyxPQUFPO0lBQ2Q7SUFLQSxhQUFhLEVBQUMsUUFBUSxVQUFVLFFBQU07QUFDcEMsV0FBSyxTQUFTLE9BQU8sQ0FBQSxPQUFLLEdBQUUsV0FBVyxNQUFNLEVBQzFDLFFBQVEsQ0FBQSxPQUFLLEdBQUUsU0FBUyxRQUFRLENBQUM7SUFDdEM7SUFLQSxpQkFBZ0I7QUFDZCxVQUFHLENBQUMsS0FBSyxVQUFTO0FBQUU7TUFBTztBQUMzQixXQUFLLFFBQVEsSUFBSSxLQUFLLFFBQVE7SUFDaEM7SUFLQSxnQkFBZTtBQUNiLG1CQUFhLEtBQUssWUFBWTtBQUM5QixXQUFLLGVBQWU7SUFDdEI7SUFLQSxlQUFjO0FBQ1osVUFBRyxLQUFLLGNBQWE7QUFBRSxhQUFLLGNBQWM7TUFBRTtBQUM1QyxXQUFLLE1BQU0sS0FBSyxRQUFRLE9BQU8sUUFBUTtBQUN2QyxXQUFLLFdBQVcsS0FBSyxRQUFRLGVBQWUsS0FBSyxHQUFHO0FBRXBELFdBQUssUUFBUSxHQUFHLEtBQUssVUFBVSxDQUFBLFlBQVc7QUFDeEMsYUFBSyxlQUFlO0FBQ3BCLGFBQUssY0FBYztBQUNuQixhQUFLLGVBQWU7QUFDcEIsYUFBSyxhQUFhLE9BQU87TUFDM0IsQ0FBQztBQUVELFdBQUssZUFBZSxXQUFXLE1BQU07QUFDbkMsYUFBSyxRQUFRLFdBQVcsQ0FBQyxDQUFDO01BQzVCLEdBQUcsS0FBSyxPQUFPO0lBQ2pCO0lBS0EsWUFBWSxRQUFPO0FBQ2pCLGFBQU8sS0FBSyxnQkFBZ0IsS0FBSyxhQUFhLFdBQVc7SUFDM0Q7SUFLQSxRQUFRLFFBQVEsVUFBUztBQUN2QixXQUFLLFFBQVEsUUFBUSxLQUFLLFVBQVUsRUFBQyxRQUFRLFNBQVEsQ0FBQztJQUN4RDtFQUNGO0FDOUdBLE1BQXFCLFFBQXJCLE1BQTJCO0lBQ3pCLFlBQVksVUFBVSxXQUFVO0FBQzlCLFdBQUssV0FBVztBQUNoQixXQUFLLFlBQVk7QUFDakIsV0FBSyxRQUFRO0FBQ2IsV0FBSyxRQUFRO0lBQ2Y7SUFFQSxRQUFPO0FBQ0wsV0FBSyxRQUFRO0FBQ2IsbUJBQWEsS0FBSyxLQUFLO0lBQ3pCO0lBS0Esa0JBQWlCO0FBQ2YsbUJBQWEsS0FBSyxLQUFLO0FBRXZCLFdBQUssUUFBUSxXQUFXLE1BQU07QUFDNUIsYUFBSyxRQUFRLEtBQUssUUFBUTtBQUMxQixhQUFLLFNBQVM7TUFDaEIsR0FBRyxLQUFLLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQztJQUNuQztFQUNGO0FDMUJBLE1BQXFCLFVBQXJCLE1BQTZCO0lBQzNCLFlBQVksT0FBTyxRQUFRLFNBQU87QUFDaEMsV0FBSyxRQUFRLGVBQWU7QUFDNUIsV0FBSyxRQUFRO0FBQ2IsV0FBSyxTQUFTLFFBQVEsVUFBVSxDQUFDLENBQUM7QUFDbEMsV0FBSyxTQUFTO0FBQ2QsV0FBSyxXQUFXLENBQUM7QUFDakIsV0FBSyxhQUFhO0FBQ2xCLFdBQUssVUFBVSxLQUFLLE9BQU87QUFDM0IsV0FBSyxhQUFhO0FBQ2xCLFdBQUssV0FBVyxJQUFJLEtBQUssTUFBTSxlQUFlLE1BQU0sS0FBSyxRQUFRLEtBQUssT0FBTztBQUM3RSxXQUFLLGFBQWEsQ0FBQztBQUNuQixXQUFLLGtCQUFrQixDQUFDO0FBRXhCLFdBQUssY0FBYyxJQUFJLE1BQU0sTUFBTTtBQUNqQyxZQUFHLEtBQUssT0FBTyxZQUFZLEdBQUU7QUFBRSxlQUFLLE9BQU87UUFBRTtNQUMvQyxHQUFHLEtBQUssT0FBTyxhQUFhO0FBQzVCLFdBQUssZ0JBQWdCLEtBQUssS0FBSyxPQUFPLFFBQVEsTUFBTSxLQUFLLFlBQVksTUFBTSxDQUFDLENBQUM7QUFDN0UsV0FBSyxnQkFBZ0IsS0FBSyxLQUFLLE9BQU8sT0FBTyxNQUFNO0FBQ2pELGFBQUssWUFBWSxNQUFNO0FBQ3ZCLFlBQUcsS0FBSyxVQUFVLEdBQUU7QUFBRSxlQUFLLE9BQU87UUFBRTtNQUN0QyxDQUFDLENBQ0Q7QUFDQSxXQUFLLFNBQVMsUUFBUSxNQUFNLE1BQU07QUFDaEMsYUFBSyxRQUFRLGVBQWU7QUFDNUIsYUFBSyxZQUFZLE1BQU07QUFDdkIsYUFBSyxXQUFXLFFBQVEsQ0FBQSxjQUFhLFVBQVUsS0FBSyxDQUFDO0FBQ3JELGFBQUssYUFBYSxDQUFDO01BQ3JCLENBQUM7QUFDRCxXQUFLLFNBQVMsUUFBUSxTQUFTLE1BQU07QUFDbkMsYUFBSyxRQUFRLGVBQWU7QUFDNUIsWUFBRyxLQUFLLE9BQU8sWUFBWSxHQUFFO0FBQUUsZUFBSyxZQUFZLGdCQUFnQjtRQUFFO01BQ3BFLENBQUM7QUFDRCxXQUFLLFFBQVEsTUFBTTtBQUNqQixhQUFLLFlBQVksTUFBTTtBQUN2QixZQUFHLEtBQUssT0FBTyxVQUFVO0FBQUcsZUFBSyxPQUFPLElBQUksV0FBVyxTQUFTLEtBQUssU0FBUyxLQUFLLFFBQVEsR0FBRztBQUM5RixhQUFLLFFBQVEsZUFBZTtBQUM1QixhQUFLLE9BQU8sT0FBTyxJQUFJO01BQ3pCLENBQUM7QUFDRCxXQUFLLFFBQVEsQ0FBQSxXQUFVO0FBQ3JCLFlBQUcsS0FBSyxPQUFPLFVBQVU7QUFBRyxlQUFLLE9BQU8sSUFBSSxXQUFXLFNBQVMsS0FBSyxTQUFTLE1BQU07QUFDcEYsWUFBRyxLQUFLLFVBQVUsR0FBRTtBQUFFLGVBQUssU0FBUyxNQUFNO1FBQUU7QUFDNUMsYUFBSyxRQUFRLGVBQWU7QUFDNUIsWUFBRyxLQUFLLE9BQU8sWUFBWSxHQUFFO0FBQUUsZUFBSyxZQUFZLGdCQUFnQjtRQUFFO01BQ3BFLENBQUM7QUFDRCxXQUFLLFNBQVMsUUFBUSxXQUFXLE1BQU07QUFDckMsWUFBRyxLQUFLLE9BQU8sVUFBVTtBQUFHLGVBQUssT0FBTyxJQUFJLFdBQVcsV0FBVyxLQUFLLFVBQVUsS0FBSyxRQUFRLE1BQU0sS0FBSyxTQUFTLE9BQU87QUFDekgsWUFBSSxZQUFZLElBQUksS0FBSyxNQUFNLGVBQWUsT0FBTyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTztBQUM5RSxrQkFBVSxLQUFLO0FBQ2YsYUFBSyxRQUFRLGVBQWU7QUFDNUIsYUFBSyxTQUFTLE1BQU07QUFDcEIsWUFBRyxLQUFLLE9BQU8sWUFBWSxHQUFFO0FBQUUsZUFBSyxZQUFZLGdCQUFnQjtRQUFFO01BQ3BFLENBQUM7QUFDRCxXQUFLLEdBQUcsZUFBZSxPQUFPLENBQUMsU0FBUyxRQUFRO0FBQzlDLGFBQUssUUFBUSxLQUFLLGVBQWUsR0FBRyxHQUFHLE9BQU87TUFDaEQsQ0FBQztJQUNIO0lBT0EsS0FBSyxVQUFVLEtBQUssU0FBUTtBQUMxQixVQUFHLEtBQUssWUFBVztBQUNqQixjQUFNLElBQUksTUFBTSw0RkFBNEY7TUFDOUcsT0FBTztBQUNMLGFBQUssVUFBVTtBQUNmLGFBQUssYUFBYTtBQUNsQixhQUFLLE9BQU87QUFDWixlQUFPLEtBQUs7TUFDZDtJQUNGO0lBTUEsUUFBUSxVQUFTO0FBQ2YsV0FBSyxHQUFHLGVBQWUsT0FBTyxRQUFRO0lBQ3hDO0lBTUEsUUFBUSxVQUFTO0FBQ2YsYUFBTyxLQUFLLEdBQUcsZUFBZSxPQUFPLENBQUEsV0FBVSxTQUFTLE1BQU0sQ0FBQztJQUNqRTtJQW1CQSxHQUFHLE9BQU8sVUFBUztBQUNqQixVQUFJLE1BQU0sS0FBSztBQUNmLFdBQUssU0FBUyxLQUFLLEVBQUMsT0FBTyxLQUFLLFNBQVEsQ0FBQztBQUN6QyxhQUFPO0lBQ1Q7SUFvQkEsSUFBSSxPQUFPLEtBQUk7QUFDYixXQUFLLFdBQVcsS0FBSyxTQUFTLE9BQU8sQ0FBQyxTQUFTO0FBQzdDLGVBQU8sQ0FBRSxNQUFLLFVBQVUsU0FBVSxRQUFPLFFBQVEsZUFBZSxRQUFRLEtBQUs7TUFDL0UsQ0FBQztJQUNIO0lBS0EsVUFBUztBQUFFLGFBQU8sS0FBSyxPQUFPLFlBQVksS0FBSyxLQUFLLFNBQVM7SUFBRTtJQWtCL0QsS0FBSyxPQUFPLFNBQVMsVUFBVSxLQUFLLFNBQVE7QUFDMUMsZ0JBQVUsV0FBVyxDQUFDO0FBQ3RCLFVBQUcsQ0FBQyxLQUFLLFlBQVc7QUFDbEIsY0FBTSxJQUFJLE1BQU0sa0JBQWtCLGNBQWMsS0FBSyxpRUFBaUU7TUFDeEg7QUFDQSxVQUFJLFlBQVksSUFBSSxLQUFLLE1BQU0sT0FBTyxXQUFXO0FBQUUsZUFBTztNQUFRLEdBQUcsT0FBTztBQUM1RSxVQUFHLEtBQUssUUFBUSxHQUFFO0FBQ2hCLGtCQUFVLEtBQUs7TUFDakIsT0FBTztBQUNMLGtCQUFVLGFBQWE7QUFDdkIsYUFBSyxXQUFXLEtBQUssU0FBUztNQUNoQztBQUVBLGFBQU87SUFDVDtJQWtCQSxNQUFNLFVBQVUsS0FBSyxTQUFRO0FBQzNCLFdBQUssWUFBWSxNQUFNO0FBQ3ZCLFdBQUssU0FBUyxjQUFjO0FBRTVCLFdBQUssUUFBUSxlQUFlO0FBQzVCLFVBQUksVUFBVSxNQUFNO0FBQ2xCLFlBQUcsS0FBSyxPQUFPLFVBQVU7QUFBRyxlQUFLLE9BQU8sSUFBSSxXQUFXLFNBQVMsS0FBSyxPQUFPO0FBQzVFLGFBQUssUUFBUSxlQUFlLE9BQU8sT0FBTztNQUM1QztBQUNBLFVBQUksWUFBWSxJQUFJLEtBQUssTUFBTSxlQUFlLE9BQU8sUUFBUSxDQUFDLENBQUMsR0FBRyxPQUFPO0FBQ3pFLGdCQUFVLFFBQVEsTUFBTSxNQUFNLFFBQVEsQ0FBQyxFQUNwQyxRQUFRLFdBQVcsTUFBTSxRQUFRLENBQUM7QUFDckMsZ0JBQVUsS0FBSztBQUNmLFVBQUcsQ0FBQyxLQUFLLFFBQVEsR0FBRTtBQUFFLGtCQUFVLFFBQVEsTUFBTSxDQUFDLENBQUM7TUFBRTtBQUVqRCxhQUFPO0lBQ1Q7SUFjQSxVQUFVLFFBQVEsU0FBUyxNQUFLO0FBQUUsYUFBTztJQUFRO0lBS2pELFNBQVMsT0FBTyxPQUFPLFNBQVMsU0FBUTtBQUN0QyxVQUFHLEtBQUssVUFBVSxPQUFNO0FBQUUsZUFBTztNQUFNO0FBRXZDLFVBQUcsV0FBVyxZQUFZLEtBQUssUUFBUSxHQUFFO0FBQ3ZDLFlBQUcsS0FBSyxPQUFPLFVBQVU7QUFBRyxlQUFLLE9BQU8sSUFBSSxXQUFXLDZCQUE2QixFQUFDLE9BQU8sT0FBTyxTQUFTLFFBQU8sQ0FBQztBQUNwSCxlQUFPO01BQ1QsT0FBTztBQUNMLGVBQU87TUFDVDtJQUNGO0lBS0EsVUFBUztBQUFFLGFBQU8sS0FBSyxTQUFTO0lBQUk7SUFLcEMsT0FBTyxVQUFVLEtBQUssU0FBUTtBQUM1QixVQUFHLEtBQUssVUFBVSxHQUFFO0FBQUU7TUFBTztBQUM3QixXQUFLLE9BQU8sZUFBZSxLQUFLLEtBQUs7QUFDckMsV0FBSyxRQUFRLGVBQWU7QUFDNUIsV0FBSyxTQUFTLE9BQU8sT0FBTztJQUM5QjtJQUtBLFFBQVEsT0FBTyxTQUFTLEtBQUssU0FBUTtBQUNuQyxVQUFJLGlCQUFpQixLQUFLLFVBQVUsT0FBTyxTQUFTLEtBQUssT0FBTztBQUNoRSxVQUFHLFdBQVcsQ0FBQyxnQkFBZTtBQUFFLGNBQU0sSUFBSSxNQUFNLDZFQUE2RTtNQUFFO0FBRS9ILFVBQUksZ0JBQWdCLEtBQUssU0FBUyxPQUFPLENBQUEsU0FBUSxLQUFLLFVBQVUsS0FBSztBQUVyRSxlQUFRLElBQUksR0FBRyxJQUFJLGNBQWMsUUFBUSxLQUFJO0FBQzNDLFlBQUksT0FBTyxjQUFjO0FBQ3pCLGFBQUssU0FBUyxnQkFBZ0IsS0FBSyxXQUFXLEtBQUssUUFBUSxDQUFDO01BQzlEO0lBQ0Y7SUFLQSxlQUFlLEtBQUk7QUFBRSxhQUFPLGNBQWM7SUFBTTtJQUtoRCxXQUFVO0FBQUUsYUFBTyxLQUFLLFVBQVUsZUFBZTtJQUFPO0lBS3hELFlBQVc7QUFBRSxhQUFPLEtBQUssVUFBVSxlQUFlO0lBQVE7SUFLMUQsV0FBVTtBQUFFLGFBQU8sS0FBSyxVQUFVLGVBQWU7SUFBTztJQUt4RCxZQUFXO0FBQUUsYUFBTyxLQUFLLFVBQVUsZUFBZTtJQUFRO0lBSzFELFlBQVc7QUFBRSxhQUFPLEtBQUssVUFBVSxlQUFlO0lBQVE7RUFDNUQ7QUNqVEEsTUFBcUIsT0FBckIsTUFBMEI7SUFFeEIsT0FBTyxRQUFRLFFBQVEsVUFBVSxRQUFRLE1BQU0sU0FBUyxXQUFXLFVBQVM7QUFDMUUsVUFBRyxPQUFPLGdCQUFlO0FBQ3ZCLFlBQUksTUFBTSxJQUFJLE9BQU8sZUFBZTtBQUNwQyxlQUFPLEtBQUssZUFBZSxLQUFLLFFBQVEsVUFBVSxNQUFNLFNBQVMsV0FBVyxRQUFRO01BQ3RGLE9BQU87QUFDTCxZQUFJLE1BQU0sSUFBSSxPQUFPLGVBQWU7QUFDcEMsZUFBTyxLQUFLLFdBQVcsS0FBSyxRQUFRLFVBQVUsUUFBUSxNQUFNLFNBQVMsV0FBVyxRQUFRO01BQzFGO0lBQ0Y7SUFFQSxPQUFPLGVBQWUsS0FBSyxRQUFRLFVBQVUsTUFBTSxTQUFTLFdBQVcsVUFBUztBQUM5RSxVQUFJLFVBQVU7QUFDZCxVQUFJLEtBQUssUUFBUSxRQUFRO0FBQ3pCLFVBQUksU0FBUyxNQUFNO0FBQ2pCLFlBQUksV0FBVyxLQUFLLFVBQVUsSUFBSSxZQUFZO0FBQzlDLG9CQUFZLFNBQVMsUUFBUTtNQUMvQjtBQUNBLFVBQUcsV0FBVTtBQUFFLFlBQUksWUFBWTtNQUFVO0FBR3pDLFVBQUksYUFBYSxNQUFNO01BQUU7QUFFekIsVUFBSSxLQUFLLElBQUk7QUFDYixhQUFPO0lBQ1Q7SUFFQSxPQUFPLFdBQVcsS0FBSyxRQUFRLFVBQVUsUUFBUSxNQUFNLFNBQVMsV0FBVyxVQUFTO0FBQ2xGLFVBQUksS0FBSyxRQUFRLFVBQVUsSUFBSTtBQUMvQixVQUFJLFVBQVU7QUFDZCxVQUFJLGlCQUFpQixnQkFBZ0IsTUFBTTtBQUMzQyxVQUFJLFVBQVUsTUFBTSxZQUFZLFNBQVMsSUFBSTtBQUM3QyxVQUFJLHFCQUFxQixNQUFNO0FBQzdCLFlBQUcsSUFBSSxlQUFlLFdBQVcsWUFBWSxVQUFTO0FBQ3BELGNBQUksV0FBVyxLQUFLLFVBQVUsSUFBSSxZQUFZO0FBQzlDLG1CQUFTLFFBQVE7UUFDbkI7TUFDRjtBQUNBLFVBQUcsV0FBVTtBQUFFLFlBQUksWUFBWTtNQUFVO0FBRXpDLFVBQUksS0FBSyxJQUFJO0FBQ2IsYUFBTztJQUNUO0lBRUEsT0FBTyxVQUFVLE1BQUs7QUFDcEIsVUFBRyxDQUFDLFFBQVEsU0FBUyxJQUFHO0FBQUUsZUFBTztNQUFLO0FBRXRDLFVBQUk7QUFDRixlQUFPLEtBQUssTUFBTSxJQUFJO01BQ3hCLFNBQVMsR0FBVDtBQUNFLG1CQUFXLFFBQVEsSUFBSSxpQ0FBaUMsSUFBSTtBQUM1RCxlQUFPO01BQ1Q7SUFDRjtJQUVBLE9BQU8sVUFBVSxLQUFLLFdBQVU7QUFDOUIsVUFBSSxXQUFXLENBQUM7QUFDaEIsZUFBUSxPQUFPLEtBQUk7QUFDakIsWUFBRyxDQUFDLE9BQU8sVUFBVSxlQUFlLEtBQUssS0FBSyxHQUFHLEdBQUU7QUFBRTtRQUFTO0FBQzlELFlBQUksV0FBVyxZQUFZLEdBQUcsYUFBYSxTQUFTO0FBQ3BELFlBQUksV0FBVyxJQUFJO0FBQ25CLFlBQUcsT0FBTyxhQUFhLFVBQVM7QUFDOUIsbUJBQVMsS0FBSyxLQUFLLFVBQVUsVUFBVSxRQUFRLENBQUM7UUFDbEQsT0FBTztBQUNMLG1CQUFTLEtBQUssbUJBQW1CLFFBQVEsSUFBSSxNQUFNLG1CQUFtQixRQUFRLENBQUM7UUFDakY7TUFDRjtBQUNBLGFBQU8sU0FBUyxLQUFLLEdBQUc7SUFDMUI7SUFFQSxPQUFPLGFBQWEsS0FBSyxRQUFPO0FBQzlCLFVBQUcsT0FBTyxLQUFLLE1BQU0sRUFBRSxXQUFXLEdBQUU7QUFBRSxlQUFPO01BQUk7QUFFakQsVUFBSSxTQUFTLElBQUksTUFBTSxJQUFJLElBQUksTUFBTTtBQUNyQyxhQUFPLEdBQUcsTUFBTSxTQUFTLEtBQUssVUFBVSxNQUFNO0lBQ2hEO0VBQ0Y7QUMzRUEsTUFBcUIsV0FBckIsTUFBOEI7SUFFNUIsWUFBWSxVQUFTO0FBQ25CLFdBQUssV0FBVztBQUNoQixXQUFLLFFBQVE7QUFDYixXQUFLLGdCQUFnQjtBQUNyQixXQUFLLE9BQU8sb0JBQUksSUFBSTtBQUNwQixXQUFLLFNBQVMsV0FBVztNQUFFO0FBQzNCLFdBQUssVUFBVSxXQUFXO01BQUU7QUFDNUIsV0FBSyxZQUFZLFdBQVc7TUFBRTtBQUM5QixXQUFLLFVBQVUsV0FBVztNQUFFO0FBQzVCLFdBQUssZUFBZSxLQUFLLGtCQUFrQixRQUFRO0FBQ25ELFdBQUssYUFBYSxjQUFjO0FBQ2hDLFdBQUssS0FBSztJQUNaO0lBRUEsa0JBQWtCLFVBQVM7QUFDekIsYUFBUSxTQUNMLFFBQVEsU0FBUyxTQUFTLEVBQzFCLFFBQVEsVUFBVSxVQUFVLEVBQzVCLFFBQVEsSUFBSSxPQUFPLFVBQVcsV0FBVyxTQUFTLEdBQUcsUUFBUSxXQUFXLFFBQVE7SUFDckY7SUFFQSxjQUFhO0FBQ1gsYUFBTyxLQUFLLGFBQWEsS0FBSyxjQUFjLEVBQUMsT0FBTyxLQUFLLE1BQUssQ0FBQztJQUNqRTtJQUVBLGNBQWMsTUFBTSxRQUFRLFVBQVM7QUFDbkMsV0FBSyxNQUFNLE1BQU0sUUFBUSxRQUFRO0FBQ2pDLFdBQUssYUFBYSxjQUFjO0lBQ2xDO0lBRUEsWUFBVztBQUNULFdBQUssUUFBUSxTQUFTO0FBQ3RCLFdBQUssY0FBYyxNQUFNLFdBQVcsS0FBSztJQUMzQztJQUVBLFdBQVU7QUFBRSxhQUFPLEtBQUssZUFBZSxjQUFjLFFBQVEsS0FBSyxlQUFlLGNBQWM7SUFBVztJQUUxRyxPQUFNO0FBQ0osV0FBSyxLQUFLLE9BQU8sTUFBTSxNQUFNLEtBQUssVUFBVSxHQUFHLENBQUEsU0FBUTtBQUNyRCxZQUFHLE1BQUs7QUFDTixjQUFJLEVBQUMsUUFBUSxPQUFPLGFBQVk7QUFDaEMsZUFBSyxRQUFRO1FBQ2YsT0FBTztBQUNMLG1CQUFTO1FBQ1g7QUFFQSxnQkFBTztlQUNBO0FBQ0gscUJBQVMsUUFBUSxDQUFBLFFBQU87QUFtQnRCLHlCQUFXLE1BQU0sS0FBSyxVQUFVLEVBQUMsTUFBTSxJQUFHLENBQUMsR0FBRyxDQUFDO1lBQ2pELENBQUM7QUFDRCxpQkFBSyxLQUFLO0FBQ1Y7ZUFDRztBQUNILGlCQUFLLEtBQUs7QUFDVjtlQUNHO0FBQ0gsaUJBQUssYUFBYSxjQUFjO0FBQ2hDLGlCQUFLLE9BQU8sQ0FBQyxDQUFDO0FBQ2QsaUJBQUssS0FBSztBQUNWO2VBQ0c7QUFDSCxpQkFBSyxRQUFRLEdBQUc7QUFDaEIsaUJBQUssTUFBTSxNQUFNLGFBQWEsS0FBSztBQUNuQztlQUNHO2VBQ0E7QUFDSCxpQkFBSyxRQUFRLEdBQUc7QUFDaEIsaUJBQUssY0FBYyxNQUFNLHlCQUF5QixHQUFHO0FBQ3JEOztBQUNPLGtCQUFNLElBQUksTUFBTSx5QkFBeUIsUUFBUTs7TUFFOUQsQ0FBQztJQUNIO0lBRUEsS0FBSyxNQUFLO0FBQ1IsV0FBSyxLQUFLLFFBQVEsTUFBTSxNQUFNLEtBQUssUUFBUSxTQUFTLEdBQUcsQ0FBQSxTQUFRO0FBQzdELFlBQUcsQ0FBQyxRQUFRLEtBQUssV0FBVyxLQUFJO0FBQzlCLGVBQUssUUFBUSxRQUFRLEtBQUssTUFBTTtBQUNoQyxlQUFLLGNBQWMsTUFBTSx5QkFBeUIsS0FBSztRQUN6RDtNQUNGLENBQUM7SUFDSDtJQUVBLE1BQU0sTUFBTSxRQUFRLFVBQVM7QUFDM0IsZUFBUSxPQUFPLEtBQUssTUFBSztBQUFFLFlBQUksTUFBTTtNQUFFO0FBQ3ZDLFdBQUssYUFBYSxjQUFjO0FBQ2hDLFVBQUksT0FBTyxPQUFPLE9BQU8sRUFBQyxNQUFNLEtBQU0sUUFBUSxRQUFXLFVBQVUsS0FBSSxHQUFHLEVBQUMsTUFBTSxRQUFRLFNBQVEsQ0FBQztBQUNsRyxVQUFHLE9BQU8sZUFBZ0IsYUFBWTtBQUNwQyxhQUFLLFFBQVEsSUFBSSxXQUFXLFNBQVMsSUFBSSxDQUFDO01BQzVDLE9BQU87QUFDTCxhQUFLLFFBQVEsSUFBSTtNQUNuQjtJQUNGO0lBRUEsS0FBSyxRQUFRLE1BQU0saUJBQWlCLFVBQVM7QUFDM0MsVUFBSTtBQUNKLFVBQUksWUFBWSxNQUFNO0FBQ3BCLGFBQUssS0FBSyxPQUFPLEdBQUc7QUFDcEIsd0JBQWdCO01BQ2xCO0FBQ0EsWUFBTSxLQUFLLFFBQVEsUUFBUSxLQUFLLFlBQVksR0FBRyxvQkFBb0IsTUFBTSxLQUFLLFNBQVMsV0FBVyxDQUFBLFNBQVE7QUFDeEcsYUFBSyxLQUFLLE9BQU8sR0FBRztBQUNwQixZQUFHLEtBQUssU0FBUyxHQUFFO0FBQUUsbUJBQVMsSUFBSTtRQUFFO01BQ3RDLENBQUM7QUFDRCxXQUFLLEtBQUssSUFBSSxHQUFHO0lBQ25CO0VBQ0Y7QUVqSUEsTUFBTyxxQkFBUTtJQUNiLGVBQWU7SUFDZixhQUFhO0lBQ2IsT0FBTyxFQUFDLE1BQU0sR0FBRyxPQUFPLEdBQUcsV0FBVyxFQUFDO0lBRXZDLE9BQU8sS0FBSyxVQUFTO0FBQ25CLFVBQUcsSUFBSSxRQUFRLGdCQUFnQixhQUFZO0FBQ3pDLGVBQU8sU0FBUyxLQUFLLGFBQWEsR0FBRyxDQUFDO01BQ3hDLE9BQU87QUFDTCxZQUFJLFVBQVUsQ0FBQyxJQUFJLFVBQVUsSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxPQUFPO0FBQ3ZFLGVBQU8sU0FBUyxLQUFLLFVBQVUsT0FBTyxDQUFDO01BQ3pDO0lBQ0Y7SUFFQSxPQUFPLFlBQVksVUFBUztBQUMxQixVQUFHLFdBQVcsZ0JBQWdCLGFBQVk7QUFDeEMsZUFBTyxTQUFTLEtBQUssYUFBYSxVQUFVLENBQUM7TUFDL0MsT0FBTztBQUNMLFlBQUksQ0FBQyxVQUFVLEtBQUssT0FBTyxPQUFPLFdBQVcsS0FBSyxNQUFNLFVBQVU7QUFDbEUsZUFBTyxTQUFTLEVBQUMsVUFBVSxLQUFLLE9BQU8sT0FBTyxRQUFPLENBQUM7TUFDeEQ7SUFDRjtJQUlBLGFBQWEsU0FBUTtBQUNuQixVQUFJLEVBQUMsVUFBVSxLQUFLLE9BQU8sT0FBTyxZQUFXO0FBQzdDLFVBQUksYUFBYSxLQUFLLGNBQWMsU0FBUyxTQUFTLElBQUksU0FBUyxNQUFNLFNBQVMsTUFBTTtBQUN4RixVQUFJLFNBQVMsSUFBSSxZQUFZLEtBQUssZ0JBQWdCLFVBQVU7QUFDNUQsVUFBSSxPQUFPLElBQUksU0FBUyxNQUFNO0FBQzlCLFVBQUksU0FBUztBQUViLFdBQUssU0FBUyxVQUFVLEtBQUssTUFBTSxJQUFJO0FBQ3ZDLFdBQUssU0FBUyxVQUFVLFNBQVMsTUFBTTtBQUN2QyxXQUFLLFNBQVMsVUFBVSxJQUFJLE1BQU07QUFDbEMsV0FBSyxTQUFTLFVBQVUsTUFBTSxNQUFNO0FBQ3BDLFdBQUssU0FBUyxVQUFVLE1BQU0sTUFBTTtBQUNwQyxZQUFNLEtBQUssVUFBVSxDQUFBLFNBQVEsS0FBSyxTQUFTLFVBQVUsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLFlBQU0sS0FBSyxLQUFLLENBQUEsU0FBUSxLQUFLLFNBQVMsVUFBVSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7QUFDbkUsWUFBTSxLQUFLLE9BQU8sQ0FBQSxTQUFRLEtBQUssU0FBUyxVQUFVLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztBQUNyRSxZQUFNLEtBQUssT0FBTyxDQUFBLFNBQVEsS0FBSyxTQUFTLFVBQVUsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBRXJFLFVBQUksV0FBVyxJQUFJLFdBQVcsT0FBTyxhQUFhLFFBQVEsVUFBVTtBQUNwRSxlQUFTLElBQUksSUFBSSxXQUFXLE1BQU0sR0FBRyxDQUFDO0FBQ3RDLGVBQVMsSUFBSSxJQUFJLFdBQVcsT0FBTyxHQUFHLE9BQU8sVUFBVTtBQUV2RCxhQUFPLFNBQVM7SUFDbEI7SUFFQSxhQUFhLFFBQU87QUFDbEIsVUFBSSxPQUFPLElBQUksU0FBUyxNQUFNO0FBQzlCLFVBQUksT0FBTyxLQUFLLFNBQVMsQ0FBQztBQUMxQixVQUFJLFVBQVUsSUFBSSxZQUFZO0FBQzlCLGNBQU87YUFDQSxLQUFLLE1BQU07QUFBTSxpQkFBTyxLQUFLLFdBQVcsUUFBUSxNQUFNLE9BQU87YUFDN0QsS0FBSyxNQUFNO0FBQU8saUJBQU8sS0FBSyxZQUFZLFFBQVEsTUFBTSxPQUFPO2FBQy9ELEtBQUssTUFBTTtBQUFXLGlCQUFPLEtBQUssZ0JBQWdCLFFBQVEsTUFBTSxPQUFPOztJQUVoRjtJQUVBLFdBQVcsUUFBUSxNQUFNLFNBQVE7QUFDL0IsVUFBSSxjQUFjLEtBQUssU0FBUyxDQUFDO0FBQ2pDLFVBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQztBQUMvQixVQUFJLFlBQVksS0FBSyxTQUFTLENBQUM7QUFDL0IsVUFBSSxTQUFTLEtBQUssZ0JBQWdCLEtBQUssY0FBYztBQUNyRCxVQUFJLFVBQVUsUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsV0FBVyxDQUFDO0FBQ3ZFLGVBQVMsU0FBUztBQUNsQixVQUFJLFFBQVEsUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsU0FBUyxDQUFDO0FBQ25FLGVBQVMsU0FBUztBQUNsQixVQUFJLFFBQVEsUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsU0FBUyxDQUFDO0FBQ25FLGVBQVMsU0FBUztBQUNsQixVQUFJLE9BQU8sT0FBTyxNQUFNLFFBQVEsT0FBTyxVQUFVO0FBQ2pELGFBQU8sRUFBQyxVQUFVLFNBQVMsS0FBSyxNQUFNLE9BQWMsT0FBYyxTQUFTLEtBQUk7SUFDakY7SUFFQSxZQUFZLFFBQVEsTUFBTSxTQUFRO0FBQ2hDLFVBQUksY0FBYyxLQUFLLFNBQVMsQ0FBQztBQUNqQyxVQUFJLFVBQVUsS0FBSyxTQUFTLENBQUM7QUFDN0IsVUFBSSxZQUFZLEtBQUssU0FBUyxDQUFDO0FBQy9CLFVBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQztBQUMvQixVQUFJLFNBQVMsS0FBSyxnQkFBZ0IsS0FBSztBQUN2QyxVQUFJLFVBQVUsUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsV0FBVyxDQUFDO0FBQ3ZFLGVBQVMsU0FBUztBQUNsQixVQUFJLE1BQU0sUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsT0FBTyxDQUFDO0FBQy9ELGVBQVMsU0FBUztBQUNsQixVQUFJLFFBQVEsUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsU0FBUyxDQUFDO0FBQ25FLGVBQVMsU0FBUztBQUNsQixVQUFJLFFBQVEsUUFBUSxPQUFPLE9BQU8sTUFBTSxRQUFRLFNBQVMsU0FBUyxDQUFDO0FBQ25FLGVBQVMsU0FBUztBQUNsQixVQUFJLE9BQU8sT0FBTyxNQUFNLFFBQVEsT0FBTyxVQUFVO0FBQ2pELFVBQUksVUFBVSxFQUFDLFFBQVEsT0FBTyxVQUFVLEtBQUk7QUFDNUMsYUFBTyxFQUFDLFVBQVUsU0FBUyxLQUFVLE9BQWMsT0FBTyxlQUFlLE9BQU8sUUFBZ0I7SUFDbEc7SUFFQSxnQkFBZ0IsUUFBUSxNQUFNLFNBQVE7QUFDcEMsVUFBSSxZQUFZLEtBQUssU0FBUyxDQUFDO0FBQy9CLFVBQUksWUFBWSxLQUFLLFNBQVMsQ0FBQztBQUMvQixVQUFJLFNBQVMsS0FBSyxnQkFBZ0I7QUFDbEMsVUFBSSxRQUFRLFFBQVEsT0FBTyxPQUFPLE1BQU0sUUFBUSxTQUFTLFNBQVMsQ0FBQztBQUNuRSxlQUFTLFNBQVM7QUFDbEIsVUFBSSxRQUFRLFFBQVEsT0FBTyxPQUFPLE1BQU0sUUFBUSxTQUFTLFNBQVMsQ0FBQztBQUNuRSxlQUFTLFNBQVM7QUFDbEIsVUFBSSxPQUFPLE9BQU8sTUFBTSxRQUFRLE9BQU8sVUFBVTtBQUVqRCxhQUFPLEVBQUMsVUFBVSxNQUFNLEtBQUssTUFBTSxPQUFjLE9BQWMsU0FBUyxLQUFJO0lBQzlFO0VBQ0Y7QUN0QkEsTUFBcUIsU0FBckIsTUFBNEI7SUFDMUIsWUFBWSxVQUFVLE9BQU8sQ0FBQyxHQUFFO0FBQzlCLFdBQUssdUJBQXVCLEVBQUMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQUM7QUFDeEUsV0FBSyxXQUFXLENBQUM7QUFDakIsV0FBSyxhQUFhLENBQUM7QUFDbkIsV0FBSyxNQUFNO0FBQ1gsV0FBSyxVQUFVLEtBQUssV0FBVztBQUMvQixXQUFLLFlBQVksS0FBSyxhQUFhLE9BQU8sYUFBYTtBQUN2RCxXQUFLLHlCQUF5QjtBQUM5QixXQUFLLGlCQUFpQixtQkFBVyxPQUFPLEtBQUssa0JBQVU7QUFDdkQsV0FBSyxpQkFBaUIsbUJBQVcsT0FBTyxLQUFLLGtCQUFVO0FBQ3ZELFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssYUFBYSxLQUFLLGNBQWM7QUFDckMsV0FBSyxlQUFlO0FBQ3BCLFVBQUcsS0FBSyxjQUFjLFVBQVM7QUFDN0IsYUFBSyxTQUFTLEtBQUssVUFBVSxLQUFLO0FBQ2xDLGFBQUssU0FBUyxLQUFLLFVBQVUsS0FBSztNQUNwQyxPQUFPO0FBQ0wsYUFBSyxTQUFTLEtBQUs7QUFDbkIsYUFBSyxTQUFTLEtBQUs7TUFDckI7QUFDQSxVQUFJLCtCQUErQjtBQUNuQyxVQUFHLGFBQWEsVUFBVSxrQkFBaUI7QUFDekMsa0JBQVUsaUJBQWlCLFlBQVksQ0FBQSxPQUFNO0FBQzNDLGNBQUcsS0FBSyxNQUFLO0FBQ1gsaUJBQUssV0FBVztBQUNoQiwyQ0FBK0IsS0FBSztVQUN0QztRQUNGLENBQUM7QUFDRCxrQkFBVSxpQkFBaUIsWUFBWSxDQUFBLE9BQU07QUFDM0MsY0FBRyxpQ0FBaUMsS0FBSyxjQUFhO0FBQ3BELDJDQUErQjtBQUMvQixpQkFBSyxRQUFRO1VBQ2Y7UUFDRixDQUFDO01BQ0g7QUFDQSxXQUFLLHNCQUFzQixLQUFLLHVCQUF1QjtBQUN2RCxXQUFLLGdCQUFnQixDQUFDLFVBQVU7QUFDOUIsWUFBRyxLQUFLLGVBQWM7QUFDcEIsaUJBQU8sS0FBSyxjQUFjLEtBQUs7UUFDakMsT0FBTztBQUNMLGlCQUFPLENBQUMsS0FBTSxLQUFNLEdBQUksRUFBRSxRQUFRLE1BQU07UUFDMUM7TUFDRjtBQUNBLFdBQUssbUJBQW1CLENBQUMsVUFBVTtBQUNqQyxZQUFHLEtBQUssa0JBQWlCO0FBQ3ZCLGlCQUFPLEtBQUssaUJBQWlCLEtBQUs7UUFDcEMsT0FBTztBQUNMLGlCQUFPLENBQUMsSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFNLEdBQUksRUFBRSxRQUFRLE1BQU07UUFDckU7TUFDRjtBQUNBLFdBQUssU0FBUyxLQUFLLFVBQVU7QUFDN0IsV0FBSyxvQkFBb0IsS0FBSyxxQkFBcUI7QUFDbkQsV0FBSyxTQUFTLFFBQVEsS0FBSyxVQUFVLENBQUMsQ0FBQztBQUN2QyxXQUFLLFdBQVcsR0FBRyxZQUFZLFdBQVc7QUFDMUMsV0FBSyxNQUFNLEtBQUssT0FBTztBQUN2QixXQUFLLGlCQUFpQjtBQUN0QixXQUFLLHNCQUFzQjtBQUMzQixXQUFLLGlCQUFpQixJQUFJLE1BQU0sTUFBTTtBQUNwQyxhQUFLLFNBQVMsTUFBTSxLQUFLLFFBQVEsQ0FBQztNQUNwQyxHQUFHLEtBQUssZ0JBQWdCO0lBQzFCO0lBS0EsdUJBQXNCO0FBQUUsYUFBTztJQUFTO0lBUXhDLGlCQUFpQixjQUFhO0FBQzVCLFdBQUs7QUFDTCxXQUFLLGdCQUFnQjtBQUNyQixXQUFLLGVBQWUsTUFBTTtBQUMxQixXQUFLLGFBQWEsQ0FBQztBQUNuQixVQUFHLEtBQUssTUFBSztBQUNYLGFBQUssS0FBSyxNQUFNO0FBQ2hCLGFBQUssT0FBTztNQUNkO0FBQ0EsV0FBSyxZQUFZO0lBQ25CO0lBT0EsV0FBVTtBQUFFLGFBQU8sU0FBUyxTQUFTLE1BQU0sUUFBUSxJQUFJLFFBQVE7SUFBSztJQU9wRSxjQUFhO0FBQ1gsVUFBSSxNQUFNLEtBQUssYUFDYixLQUFLLGFBQWEsS0FBSyxVQUFVLEtBQUssT0FBTyxDQUFDLEdBQUcsRUFBQyxLQUFLLEtBQUssSUFBRyxDQUFDO0FBQ2xFLFVBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFJO0FBQUUsZUFBTztNQUFJO0FBQ3RDLFVBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFJO0FBQUUsZUFBTyxHQUFHLEtBQUssU0FBUyxLQUFLO01BQU07QUFFOUQsYUFBTyxHQUFHLEtBQUssU0FBUyxPQUFPLFNBQVMsT0FBTztJQUNqRDtJQVdBLFdBQVcsVUFBVSxNQUFNLFFBQU87QUFDaEMsV0FBSztBQUNMLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUssZUFBZSxNQUFNO0FBQzFCLFdBQUssU0FBUyxVQUFVLE1BQU0sTUFBTTtJQUN0QztJQVNBLFFBQVEsUUFBTztBQUNiLFVBQUcsUUFBTztBQUNSLG1CQUFXLFFBQVEsSUFBSSx5RkFBeUY7QUFDaEgsYUFBSyxTQUFTLFFBQVEsTUFBTTtNQUM5QjtBQUNBLFVBQUcsS0FBSyxNQUFLO0FBQUU7TUFBTztBQUV0QixXQUFLO0FBQ0wsV0FBSyxnQkFBZ0I7QUFDckIsV0FBSyxPQUFPLElBQUksS0FBSyxVQUFVLEtBQUssWUFBWSxDQUFDO0FBQ2pELFdBQUssS0FBSyxhQUFhLEtBQUs7QUFDNUIsV0FBSyxLQUFLLFVBQVUsS0FBSztBQUN6QixXQUFLLEtBQUssU0FBUyxNQUFNLEtBQUssV0FBVztBQUN6QyxXQUFLLEtBQUssVUFBVSxDQUFBLFVBQVMsS0FBSyxZQUFZLEtBQUs7QUFDbkQsV0FBSyxLQUFLLFlBQVksQ0FBQSxVQUFTLEtBQUssY0FBYyxLQUFLO0FBQ3ZELFdBQUssS0FBSyxVQUFVLENBQUEsVUFBUyxLQUFLLFlBQVksS0FBSztJQUNyRDtJQVFBLElBQUksTUFBTSxLQUFLLE1BQUs7QUFBRSxXQUFLLE9BQU8sTUFBTSxLQUFLLElBQUk7SUFBRTtJQUtuRCxZQUFXO0FBQUUsYUFBTyxLQUFLLFdBQVc7SUFBSztJQVN6QyxPQUFPLFVBQVM7QUFDZCxVQUFJLE1BQU0sS0FBSyxRQUFRO0FBQ3ZCLFdBQUsscUJBQXFCLEtBQUssS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFDO0FBQ25ELGFBQU87SUFDVDtJQU1BLFFBQVEsVUFBUztBQUNmLFVBQUksTUFBTSxLQUFLLFFBQVE7QUFDdkIsV0FBSyxxQkFBcUIsTUFBTSxLQUFLLENBQUMsS0FBSyxRQUFRLENBQUM7QUFDcEQsYUFBTztJQUNUO0lBU0EsUUFBUSxVQUFTO0FBQ2YsVUFBSSxNQUFNLEtBQUssUUFBUTtBQUN2QixXQUFLLHFCQUFxQixNQUFNLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQztBQUNwRCxhQUFPO0lBQ1Q7SUFNQSxVQUFVLFVBQVM7QUFDakIsVUFBSSxNQUFNLEtBQUssUUFBUTtBQUN2QixXQUFLLHFCQUFxQixRQUFRLEtBQUssQ0FBQyxLQUFLLFFBQVEsQ0FBQztBQUN0RCxhQUFPO0lBQ1Q7SUFRQSxLQUFLLFVBQVM7QUFDWixVQUFHLENBQUMsS0FBSyxZQUFZLEdBQUU7QUFBRSxlQUFPO01BQU07QUFDdEMsVUFBSSxNQUFNLEtBQUssUUFBUTtBQUN2QixVQUFJLFlBQVksS0FBSyxJQUFJO0FBQ3pCLFdBQUssS0FBSyxFQUFDLE9BQU8sV0FBVyxPQUFPLGFBQWEsU0FBUyxDQUFDLEdBQUcsSUFBUSxDQUFDO0FBQ3ZFLFVBQUksV0FBVyxLQUFLLFVBQVUsQ0FBQSxRQUFPO0FBQ25DLFlBQUcsSUFBSSxRQUFRLEtBQUk7QUFDakIsZUFBSyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ25CLG1CQUFTLEtBQUssSUFBSSxJQUFJLFNBQVM7UUFDakM7TUFDRixDQUFDO0FBQ0QsYUFBTztJQUNUO0lBS0EsYUFBWTtBQUNWLFVBQUcsS0FBSyxVQUFVO0FBQUcsYUFBSyxJQUFJLGFBQWEsZ0JBQWdCLEtBQUssWUFBWSxHQUFHO0FBQy9FLFdBQUssZ0JBQWdCO0FBQ3JCLFdBQUs7QUFDTCxXQUFLLGdCQUFnQjtBQUNyQixXQUFLLGVBQWUsTUFBTTtBQUMxQixXQUFLLGVBQWU7QUFDcEIsV0FBSyxxQkFBcUIsS0FBSyxRQUFRLENBQUMsQ0FBQyxFQUFFLGNBQWMsU0FBUyxDQUFDO0lBQ3JFO0lBTUEsbUJBQWtCO0FBQ2hCLFVBQUcsS0FBSyxxQkFBb0I7QUFDMUIsYUFBSyxzQkFBc0I7QUFDM0IsWUFBRyxLQUFLLFVBQVUsR0FBRTtBQUFFLGVBQUssSUFBSSxhQUFhLDBEQUEwRDtRQUFFO0FBQ3hHLGFBQUssY0FBYyxtQkFBbUI7TUFDeEM7SUFDRjtJQUVBLGlCQUFnQjtBQUNkLFVBQUcsS0FBSyxRQUFRLEtBQUssS0FBSyxlQUFjO0FBQUU7TUFBTztBQUNqRCxXQUFLLHNCQUFzQjtBQUMzQixtQkFBYSxLQUFLLGNBQWM7QUFDaEMsaUJBQVcsTUFBTSxLQUFLLGNBQWMsR0FBRyxLQUFLLG1CQUFtQjtJQUNqRTtJQUVBLFNBQVMsVUFBVSxNQUFNLFFBQU87QUFDOUIsVUFBRyxDQUFDLEtBQUssTUFBSztBQUNaLGVBQU8sWUFBWSxTQUFTO01BQzlCO0FBRUEsV0FBSyxrQkFBa0IsTUFBTTtBQUMzQixZQUFHLEtBQUssTUFBSztBQUNYLGNBQUcsTUFBSztBQUFFLGlCQUFLLEtBQUssTUFBTSxNQUFNLFVBQVUsRUFBRTtVQUFFLE9BQU87QUFBRSxpQkFBSyxLQUFLLE1BQU07VUFBRTtRQUMzRTtBQUVBLGFBQUssb0JBQW9CLE1BQU07QUFDN0IsY0FBRyxLQUFLLE1BQUs7QUFDWCxpQkFBSyxLQUFLLFVBQVUsV0FBVztZQUFFO0FBQ2pDLGlCQUFLLE9BQU87VUFDZDtBQUVBLHNCQUFZLFNBQVM7UUFDdkIsQ0FBQztNQUNILENBQUM7SUFDSDtJQUVBLGtCQUFrQixVQUFVLFFBQVEsR0FBRTtBQUNwQyxVQUFHLFVBQVUsS0FBSyxDQUFDLEtBQUssUUFBUSxDQUFDLEtBQUssS0FBSyxnQkFBZTtBQUN4RCxpQkFBUztBQUNUO01BQ0Y7QUFFQSxpQkFBVyxNQUFNO0FBQ2YsYUFBSyxrQkFBa0IsVUFBVSxRQUFRLENBQUM7TUFDNUMsR0FBRyxNQUFNLEtBQUs7SUFDaEI7SUFFQSxvQkFBb0IsVUFBVSxRQUFRLEdBQUU7QUFDdEMsVUFBRyxVQUFVLEtBQUssQ0FBQyxLQUFLLFFBQVEsS0FBSyxLQUFLLGVBQWUsY0FBYyxRQUFPO0FBQzVFLGlCQUFTO0FBQ1Q7TUFDRjtBQUVBLGlCQUFXLE1BQU07QUFDZixhQUFLLG9CQUFvQixVQUFVLFFBQVEsQ0FBQztNQUM5QyxHQUFHLE1BQU0sS0FBSztJQUNoQjtJQUVBLFlBQVksT0FBTTtBQUNoQixVQUFJLFlBQVksU0FBUyxNQUFNO0FBQy9CLFVBQUcsS0FBSyxVQUFVO0FBQUcsYUFBSyxJQUFJLGFBQWEsU0FBUyxLQUFLO0FBQ3pELFdBQUssaUJBQWlCO0FBQ3RCLG1CQUFhLEtBQUssY0FBYztBQUNoQyxVQUFHLENBQUMsS0FBSyxpQkFBaUIsY0FBYyxLQUFLO0FBQzNDLGFBQUssZUFBZSxnQkFBZ0I7TUFDdEM7QUFDQSxXQUFLLHFCQUFxQixNQUFNLFFBQVEsQ0FBQyxDQUFDLEVBQUUsY0FBYyxTQUFTLEtBQUssQ0FBQztJQUMzRTtJQUtBLFlBQVksT0FBTTtBQUNoQixVQUFHLEtBQUssVUFBVTtBQUFHLGFBQUssSUFBSSxhQUFhLEtBQUs7QUFDaEQsVUFBSSxrQkFBa0IsS0FBSztBQUMzQixVQUFJLG9CQUFvQixLQUFLO0FBQzdCLFdBQUsscUJBQXFCLE1BQU0sUUFBUSxDQUFDLENBQUMsRUFBRSxjQUFjO0FBQ3hELGlCQUFTLE9BQU8saUJBQWlCLGlCQUFpQjtNQUNwRCxDQUFDO0FBQ0QsVUFBRyxvQkFBb0IsS0FBSyxhQUFhLG9CQUFvQixHQUFFO0FBQzdELGFBQUssaUJBQWlCO01BQ3hCO0lBQ0Y7SUFLQSxtQkFBa0I7QUFDaEIsV0FBSyxTQUFTLFFBQVEsQ0FBQSxZQUFXO0FBQy9CLFlBQUcsQ0FBRSxTQUFRLFVBQVUsS0FBSyxRQUFRLFVBQVUsS0FBSyxRQUFRLFNBQVMsSUFBRztBQUNyRSxrQkFBUSxRQUFRLGVBQWUsS0FBSztRQUN0QztNQUNGLENBQUM7SUFDSDtJQUtBLGtCQUFpQjtBQUNmLGNBQU8sS0FBSyxRQUFRLEtBQUssS0FBSzthQUN2QixjQUFjO0FBQVksaUJBQU87YUFDakMsY0FBYztBQUFNLGlCQUFPO2FBQzNCLGNBQWM7QUFBUyxpQkFBTzs7QUFDMUIsaUJBQU87O0lBRXBCO0lBS0EsY0FBYTtBQUFFLGFBQU8sS0FBSyxnQkFBZ0IsTUFBTTtJQUFPO0lBT3hELE9BQU8sU0FBUTtBQUNiLFdBQUssSUFBSSxRQUFRLGVBQWU7QUFDaEMsV0FBSyxXQUFXLEtBQUssU0FBUyxPQUFPLENBQUEsTUFBSyxFQUFFLFFBQVEsTUFBTSxRQUFRLFFBQVEsQ0FBQztJQUM3RTtJQVFBLElBQUksTUFBSztBQUNQLGVBQVEsT0FBTyxLQUFLLHNCQUFxQjtBQUN2QyxhQUFLLHFCQUFxQixPQUFPLEtBQUsscUJBQXFCLEtBQUssT0FBTyxDQUFDLENBQUMsU0FBUztBQUNoRixpQkFBTyxLQUFLLFFBQVEsR0FBRyxNQUFNO1FBQy9CLENBQUM7TUFDSDtJQUNGO0lBU0EsUUFBUSxPQUFPLGFBQWEsQ0FBQyxHQUFFO0FBQzdCLFVBQUksT0FBTyxJQUFJLFFBQVEsT0FBTyxZQUFZLElBQUk7QUFDOUMsV0FBSyxTQUFTLEtBQUssSUFBSTtBQUN2QixhQUFPO0lBQ1Q7SUFLQSxLQUFLLE1BQUs7QUFDUixVQUFHLEtBQUssVUFBVSxHQUFFO0FBQ2xCLFlBQUksRUFBQyxPQUFPLE9BQU8sU0FBUyxLQUFLLGFBQVk7QUFDN0MsYUFBSyxJQUFJLFFBQVEsR0FBRyxTQUFTLFVBQVUsYUFBYSxRQUFRLE9BQU87TUFDckU7QUFFQSxVQUFHLEtBQUssWUFBWSxHQUFFO0FBQ3BCLGFBQUssT0FBTyxNQUFNLENBQUEsV0FBVSxLQUFLLEtBQUssS0FBSyxNQUFNLENBQUM7TUFDcEQsT0FBTztBQUNMLGFBQUssV0FBVyxLQUFLLE1BQU0sS0FBSyxPQUFPLE1BQU0sQ0FBQSxXQUFVLEtBQUssS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDO01BQ2hGO0lBQ0Y7SUFNQSxVQUFTO0FBQ1AsVUFBSSxTQUFTLEtBQUssTUFBTTtBQUN4QixVQUFHLFdBQVcsS0FBSyxLQUFJO0FBQUUsYUFBSyxNQUFNO01BQUUsT0FBTztBQUFFLGFBQUssTUFBTTtNQUFPO0FBRWpFLGFBQU8sS0FBSyxJQUFJLFNBQVM7SUFDM0I7SUFFQSxnQkFBZTtBQUNiLFVBQUcsS0FBSyx1QkFBdUIsQ0FBQyxLQUFLLFlBQVksR0FBRTtBQUFFO01BQU87QUFDNUQsV0FBSyxzQkFBc0IsS0FBSyxRQUFRO0FBQ3hDLFdBQUssS0FBSyxFQUFDLE9BQU8sV0FBVyxPQUFPLGFBQWEsU0FBUyxDQUFDLEdBQUcsS0FBSyxLQUFLLG9CQUFtQixDQUFDO0FBQzVGLFdBQUssaUJBQWlCLFdBQVcsTUFBTSxLQUFLLGlCQUFpQixHQUFHLEtBQUssbUJBQW1CO0lBQzFGO0lBRUEsY0FBYyxRQUFPO0FBQ25CLFdBQUssZ0JBQWdCO0FBQ3JCLFVBQUcsS0FBSyxZQUFZLEdBQUU7QUFBRSxhQUFLLEtBQUssTUFBTSxpQkFBaUIsTUFBTTtNQUFFO0lBQ25FO0lBRUEsa0JBQWlCO0FBQ2YsVUFBRyxLQUFLLFlBQVksS0FBSyxLQUFLLFdBQVcsU0FBUyxHQUFFO0FBQ2xELGFBQUssV0FBVyxRQUFRLENBQUEsYUFBWSxTQUFTLENBQUM7QUFDOUMsYUFBSyxhQUFhLENBQUM7TUFDckI7SUFDRjtJQUVBLGNBQWMsWUFBVztBQUN2QixXQUFLLE9BQU8sV0FBVyxNQUFNLENBQUEsUUFBTztBQUNsQyxZQUFJLEVBQUMsT0FBTyxPQUFPLFNBQVMsS0FBSyxhQUFZO0FBQzdDLFlBQUcsT0FBTyxRQUFRLEtBQUsscUJBQW9CO0FBQ3pDLHVCQUFhLEtBQUssY0FBYztBQUNoQyxlQUFLLHNCQUFzQjtBQUMzQixxQkFBVyxNQUFNLEtBQUssY0FBYyxHQUFHLEtBQUssbUJBQW1CO1FBQ2pFO0FBRUEsWUFBRyxLQUFLLFVBQVU7QUFBRyxlQUFLLElBQUksV0FBVyxHQUFHLFFBQVEsVUFBVSxNQUFNLFNBQVMsU0FBUyxPQUFPLE1BQU0sTUFBTSxPQUFPLE1BQU0sT0FBTztBQUU3SCxpQkFBUSxJQUFJLEdBQUcsSUFBSSxLQUFLLFNBQVMsUUFBUSxLQUFJO0FBQzNDLGdCQUFNLFVBQVUsS0FBSyxTQUFTO0FBQzlCLGNBQUcsQ0FBQyxRQUFRLFNBQVMsT0FBTyxPQUFPLFNBQVMsUUFBUSxHQUFFO0FBQUU7VUFBUztBQUNqRSxrQkFBUSxRQUFRLE9BQU8sU0FBUyxLQUFLLFFBQVE7UUFDL0M7QUFFQSxpQkFBUSxJQUFJLEdBQUcsSUFBSSxLQUFLLHFCQUFxQixRQUFRLFFBQVEsS0FBSTtBQUMvRCxjQUFJLENBQUMsRUFBRSxZQUFZLEtBQUsscUJBQXFCLFFBQVE7QUFDckQsbUJBQVMsR0FBRztRQUNkO01BQ0YsQ0FBQztJQUNIO0lBRUEsZUFBZSxPQUFNO0FBQ25CLFVBQUksYUFBYSxLQUFLLFNBQVMsS0FBSyxDQUFBLE1BQUssRUFBRSxVQUFVLFNBQVUsR0FBRSxTQUFTLEtBQUssRUFBRSxVQUFVLEVBQUU7QUFDN0YsVUFBRyxZQUFXO0FBQ1osWUFBRyxLQUFLLFVBQVU7QUFBRyxlQUFLLElBQUksYUFBYSw0QkFBNEIsUUFBUTtBQUMvRSxtQkFBVyxNQUFNO01BQ25CO0lBQ0Y7RUFDRjs7O0FDN2lCQSx5QkFBc0I7OztBQ0ZmLE1BQU0sc0JBQXNCO0FBQzVCLE1BQU0sY0FBYztBQUNwQixNQUFNLG9CQUFvQjtBQUMxQixNQUFNLG9CQUFvQjtBQUMxQixNQUFNLGtCQUFrQjtBQUN4QixNQUFNLG9CQUFvQjtJQUMvQjtJQUFxQjtJQUFzQjtJQUMzQztJQUF1QjtJQUFxQjtJQUFvQjtFQUFBO0FBRTNELE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sbUJBQW1CO0FBQ3pCLE1BQU0saUJBQWlCO0FBQ3ZCLE1BQU0sVUFBVTtBQUNoQixNQUFNLGNBQWM7QUFDcEIsTUFBTSxvQkFBb0I7QUFDMUIsTUFBTSxpQkFBaUI7QUFDdkIsTUFBTSx1QkFBdUI7QUFDN0IsTUFBTSxnQkFBZ0I7QUFDdEIsTUFBTSxrQkFBa0I7QUFDeEIsTUFBTSx3QkFBd0I7QUFDOUIsTUFBTSx3QkFBd0I7QUFDOUIsTUFBTSxXQUFXO0FBQ2pCLE1BQU0sWUFBWTtBQUNsQixNQUFNLG1CQUFtQjtBQUN6QixNQUFNLHNCQUFzQjtBQUM1QixNQUFNLHlCQUF5QjtBQUMvQixNQUFNLHdCQUF3QjtBQUM5QixNQUFNLGtCQUFrQjtBQUN4QixNQUFNLGdCQUFnQjtBQUN0QixNQUFNLFdBQVc7QUFDakIsTUFBTSxjQUFjO0FBQ3BCLE1BQU0scUJBQXFCO0FBQzNCLE1BQU0sbUJBQW1CO0FBQ3pCLE1BQU0sa0JBQWtCO0FBQ3hCLE1BQU0sbUJBQW1CLENBQUMsUUFBUSxZQUFZLFVBQVUsU0FBUyxZQUFZLFVBQVUsT0FBTyxPQUFPLFFBQVEsUUFBUSxrQkFBa0IsU0FBUyxPQUFBO0FBQ2hKLE1BQU0sbUJBQW1CLENBQUMsWUFBWSxPQUFBO0FBQ3RDLE1BQU0sb0JBQW9CO0FBQzFCLE1BQU0sY0FBYztBQUNwQixNQUFNLG9CQUFvQixJQUFJO0FBQzlCLE1BQU0sYUFBYTtBQUNuQixNQUFNLGFBQWE7QUFDbkIsTUFBTSxlQUFlO0FBQ3JCLE1BQU0sZUFBZTtBQUNyQixNQUFNLG1CQUFtQjtBQUN6QixNQUFNLDJCQUEyQjtBQUNqQyxNQUFNLFdBQVc7QUFDakIsTUFBTSxlQUFlO0FBQ3JCLE1BQU0sZUFBZTtBQUNyQixNQUFNLGFBQWE7QUFDbkIsTUFBTSxVQUFVO0FBQ2hCLE1BQU0sY0FBYztBQUNwQixNQUFNLG1CQUFtQjtBQUN6QixNQUFNLGVBQWU7QUFDckIsTUFBTSxpQkFBaUI7QUFDdkIsTUFBTSxxQkFBcUI7QUFDM0IsTUFBTSxlQUFlO0FBQ3JCLE1BQU0sY0FBYztBQUNwQixNQUFNLGlCQUFpQjtBQUN2QixNQUFNLCtCQUErQjtBQUNyQyxNQUFNLGlCQUFpQjtBQUN2QixNQUFNLGVBQWU7QUFHckIsTUFBTSxtQkFBbUI7QUFDekIsTUFBTSxZQUFZO0FBQ2xCLE1BQU0sb0JBQW9CO0FBQzFCLE1BQU0sV0FBVztJQUN0QixVQUFVO0lBQ1YsVUFBVTtFQUFBO0FBSUwsTUFBTSxXQUFXO0FBQ2pCLE1BQU0sU0FBUztBQUNmLE1BQU0sYUFBYTtBQUNuQixNQUFNLFNBQVM7QUFDZixNQUFNLFFBQVE7QUFDZCxNQUFNLFFBQVE7QUFDZCxNQUFNLFlBQVk7QUMzRXpCLE1BQUEsZ0JBQUEsTUFBbUM7SUFDakMsWUFBWSxPQUFPLFdBQVcsYUFBVztBQUN2QyxXQUFLLGFBQWE7QUFDbEIsV0FBSyxRQUFRO0FBQ2IsV0FBSyxTQUFTO0FBQ2QsV0FBSyxZQUFZO0FBQ2pCLFdBQUssYUFBYTtBQUNsQixXQUFLLGdCQUFnQixZQUFXLFFBQVEsT0FBTyxNQUFNLE9BQU8sRUFBQyxPQUFPLE1BQU0sU0FBQSxFQUFBLENBQUE7SUFBQTtJQUc1RSxNQUFNLFFBQU87QUFDWCxtQkFBYSxLQUFLLFVBQUE7QUFDbEIsV0FBSyxjQUFjLE1BQUE7QUFDbkIsV0FBSyxNQUFNLE1BQU0sTUFBQTtJQUFBO0lBR25CLFNBQVE7QUFDTixXQUFLLGNBQWMsUUFBUSxDQUFBLFdBQVUsS0FBSyxNQUFNLE1BQUEsQ0FBQTtBQUNoRCxXQUFLLGNBQWMsS0FBQSxFQUNoQixRQUFRLE1BQU0sQ0FBQSxVQUFTLEtBQUssY0FBQSxDQUFBLEVBQzVCLFFBQVEsU0FBUyxDQUFBLFdBQVUsS0FBSyxNQUFNLE1BQUEsQ0FBQTtJQUFBO0lBRzNDLFNBQVE7QUFBRSxhQUFPLEtBQUssVUFBVSxLQUFLLE1BQU0sS0FBSztJQUFBO0lBRWhELGdCQUFlO0FBQ2IsVUFBSSxTQUFTLElBQUksT0FBTyxXQUFBO0FBQ3hCLFVBQUksT0FBTyxLQUFLLE1BQU0sS0FBSyxNQUFNLEtBQUssUUFBUSxLQUFLLFlBQVksS0FBSyxNQUFBO0FBQ3BFLGFBQU8sU0FBUyxDQUFDLE1BQU07QUFDckIsWUFBRyxFQUFFLE9BQU8sVUFBVSxNQUFLO0FBQ3pCLGVBQUssVUFBVSxFQUFFLE9BQU8sT0FBTztBQUMvQixlQUFLLFVBQVUsRUFBRSxPQUFPLE1BQUE7UUFBQSxPQUNuQjtBQUNMLGlCQUFPLFNBQVMsaUJBQWlCLEVBQUUsT0FBTyxLQUFBO1FBQUE7TUFBQTtBQUc5QyxhQUFPLGtCQUFrQixJQUFBO0lBQUE7SUFHM0IsVUFBVSxPQUFNO0FBQ2QsVUFBRyxDQUFDLEtBQUssY0FBYyxTQUFBLEdBQVc7QUFBRTtNQUFBO0FBQ3BDLFdBQUssY0FBYyxLQUFLLFNBQVMsS0FBQSxFQUM5QixRQUFRLE1BQU0sTUFBTTtBQUNuQixhQUFLLE1BQU0sU0FBVSxLQUFLLFNBQVMsS0FBSyxNQUFNLEtBQUssT0FBUSxHQUFBO0FBQzNELFlBQUcsQ0FBQyxLQUFLLE9BQUEsR0FBUztBQUNoQixlQUFLLGFBQWEsV0FBVyxNQUFNLEtBQUssY0FBQSxHQUFpQixLQUFLLFdBQVcsY0FBQSxLQUFtQixDQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7RUFBQTtBQzNDL0YsTUFBSSxXQUFXLENBQUMsS0FBSyxRQUFRLFFBQVEsU0FBUyxRQUFRLE1BQU0sS0FBSyxHQUFBO0FBRWpFLE1BQUksUUFBUSxDQUFDLFFBQVE7QUFDMUIsUUFBSSxPQUFPLE9BQU87QUFDbEIsV0FBTyxTQUFTLFlBQWEsU0FBUyxZQUFZLGlCQUFpQixLQUFLLEdBQUE7RUFBQTtBQUduRSxnQ0FBNkI7QUFDbEMsUUFBSSxNQUFNLG9CQUFJLElBQUE7QUFDZCxRQUFJLFFBQVEsU0FBUyxpQkFBaUIsT0FBQTtBQUN0QyxhQUFRLElBQUksR0FBRyxNQUFNLE1BQU0sUUFBUSxJQUFJLEtBQUssS0FBSTtBQUM5QyxVQUFHLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBQSxHQUFJO0FBQ3RCLGdCQUFRLE1BQU0sMEJBQTBCLE1BQU0sR0FBRyxnQ0FBQTtNQUFBLE9BQzVDO0FBQ0wsWUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFBO01BQUE7SUFBQTtFQUFBO0FBS2hCLE1BQUksUUFBUSxDQUFDLE1BQU0sTUFBTSxLQUFLLFFBQVE7QUFDM0MsUUFBRyxLQUFLLFdBQVcsZUFBQSxHQUFpQjtBQUNsQyxjQUFRLElBQUksR0FBRyxLQUFLLE1BQU0sU0FBUyxVQUFVLEdBQUE7SUFBQTtFQUFBO0FBSzFDLE1BQUksV0FBVSxDQUFDLFFBQVEsT0FBTyxRQUFRLGFBQWEsTUFBTSxXQUFXO0FBQUUsV0FBTztFQUFBO0FBRTdFLE1BQUksUUFBUSxDQUFDLFFBQVE7QUFBRSxXQUFPLEtBQUssTUFBTSxLQUFLLFVBQVUsR0FBQSxDQUFBO0VBQUE7QUFFeEQsTUFBSSxvQkFBb0IsQ0FBQyxJQUFJLFNBQVMsYUFBYTtBQUN4RCxPQUFHO0FBQ0QsVUFBRyxHQUFHLFFBQVEsSUFBSSxVQUFBLEdBQVk7QUFBRSxlQUFPO01BQUE7QUFDdkMsV0FBSyxHQUFHLGlCQUFpQixHQUFHO0lBQUEsU0FDdEIsT0FBTyxRQUFRLEdBQUcsYUFBYSxLQUFLLENBQUcsYUFBWSxTQUFTLFdBQVcsRUFBQSxLQUFRLEdBQUcsUUFBUSxpQkFBQTtBQUNsRyxXQUFPO0VBQUE7QUFHRixNQUFJLFdBQVcsQ0FBQyxRQUFRO0FBQzdCLFdBQU8sUUFBUSxRQUFRLE9BQU8sUUFBUSxZQUFZLENBQUUsZ0JBQWU7RUFBQTtBQUc5RCxNQUFJLGFBQWEsQ0FBQyxNQUFNLFNBQVMsS0FBSyxVQUFVLElBQUEsTUFBVSxLQUFLLFVBQVUsSUFBQTtBQUV6RSxNQUFJLFVBQVUsQ0FBQyxRQUFRO0FBQzVCLGFBQVEsS0FBSyxLQUFJO0FBQUUsYUFBTztJQUFBO0FBQzFCLFdBQU87RUFBQTtBQUdGLE1BQUksUUFBUSxDQUFDLElBQUksYUFBYSxNQUFNLFNBQVMsRUFBQTtBQUU3QyxNQUFJLGtCQUFrQixTQUFVLFNBQVMsU0FBUyxNQUFNLGFBQVc7QUFDeEUsWUFBUSxRQUFRLENBQUEsVUFBUztBQUN2QixVQUFJLGdCQUFnQixJQUFJLGNBQWMsT0FBTyxLQUFLLE9BQU8sWUFBWSxXQUFBO0FBQ3JFLG9CQUFjLE9BQUE7SUFBQSxDQUFBO0VBQUE7QUM1RGxCLE1BQUksVUFBVTtJQUNaLGVBQWM7QUFBRSxhQUFRLE9BQVEsUUFBUSxjQUFlO0lBQUE7SUFFdkQsVUFBVSxjQUFjLFdBQVcsUUFBTztBQUN4QyxhQUFPLGFBQWEsV0FBVyxLQUFLLFNBQVMsV0FBVyxNQUFBLENBQUE7SUFBQTtJQUcxRCxZQUFZLGNBQWMsV0FBVyxRQUFRLFNBQVMsTUFBSztBQUN6RCxVQUFJLFVBQVUsS0FBSyxTQUFTLGNBQWMsV0FBVyxNQUFBO0FBQ3JELFVBQUksTUFBTSxLQUFLLFNBQVMsV0FBVyxNQUFBO0FBQ25DLFVBQUksU0FBUyxZQUFZLE9BQU8sVUFBVSxLQUFLLE9BQUE7QUFDL0MsbUJBQWEsUUFBUSxLQUFLLEtBQUssVUFBVSxNQUFBLENBQUE7QUFDekMsYUFBTztJQUFBO0lBR1QsU0FBUyxjQUFjLFdBQVcsUUFBTztBQUN2QyxhQUFPLEtBQUssTUFBTSxhQUFhLFFBQVEsS0FBSyxTQUFTLFdBQVcsTUFBQSxDQUFBLENBQUE7SUFBQTtJQUdsRSxtQkFBbUIsVUFBUztBQUMxQixVQUFHLENBQUMsS0FBSyxhQUFBLEdBQWU7QUFBRTtNQUFBO0FBQzFCLGNBQVEsYUFBYSxTQUFTLFFBQVEsU0FBUyxDQUFBLENBQUEsR0FBSyxJQUFJLE9BQU8sU0FBUyxJQUFBO0lBQUE7SUFHMUUsVUFBVSxNQUFNLE1BQU0sSUFBRztBQUN2QixVQUFHLEtBQUssYUFBQSxHQUFlO0FBQ3JCLFlBQUcsT0FBTyxPQUFPLFNBQVMsTUFBSztBQUM3QixjQUFHLEtBQUssUUFBUSxjQUFjLEtBQUssUUFBTztBQUV4QyxnQkFBSSxlQUFlLFFBQVEsU0FBUyxDQUFBO0FBQ3BDLHlCQUFhLFNBQVMsS0FBSztBQUMzQixvQkFBUSxhQUFhLGNBQWMsSUFBSSxPQUFPLFNBQVMsSUFBQTtVQUFBO0FBR3pELGlCQUFPLEtBQUs7QUFDWixrQkFBUSxPQUFPLFNBQVMsTUFBTSxJQUFJLE1BQU0sSUFBQTtBQUN4QyxjQUFJLFNBQVMsS0FBSyxnQkFBZ0IsT0FBTyxTQUFTLElBQUE7QUFFbEQsY0FBRyxRQUFPO0FBQ1IsbUJBQU8sZUFBQTtVQUFBLFdBQ0MsS0FBSyxTQUFTLFlBQVc7QUFDakMsbUJBQU8sT0FBTyxHQUFHLENBQUE7VUFBQTtRQUFBO01BQUEsT0FHaEI7QUFDTCxhQUFLLFNBQVMsRUFBQTtNQUFBO0lBQUE7SUFJbEIsVUFBVSxNQUFNLE9BQU07QUFDcEIsZUFBUyxTQUFTLEdBQUcsUUFBUTtJQUFBO0lBRy9CLFVBQVUsTUFBSztBQUNiLGFBQU8sU0FBUyxPQUFPLFFBQVEsSUFBSSxPQUFPLGlCQUFrQiwyQkFBQSxHQUFpQyxJQUFBO0lBQUE7SUFHL0YsU0FBUyxPQUFPLE9BQU07QUFDcEIsVUFBRyxPQUFNO0FBQUUsZ0JBQVEsVUFBVSxxQkFBcUIsUUFBUSx5QkFBQTtNQUFBO0FBQzFELGFBQU8sV0FBVztJQUFBO0lBR3BCLFNBQVMsV0FBVyxRQUFPO0FBQUUsYUFBTyxHQUFHLGFBQWE7SUFBQTtJQUVwRCxnQkFBZ0IsV0FBVTtBQUN4QixVQUFJLE9BQU8sVUFBVSxTQUFBLEVBQVcsVUFBVSxDQUFBO0FBQzFDLFVBQUcsU0FBUyxJQUFHO0FBQUU7TUFBQTtBQUNqQixhQUFPLFNBQVMsZUFBZSxJQUFBLEtBQVMsU0FBUyxjQUFjLFdBQVcsUUFBQTtJQUFBO0VBQUE7QUFJOUUsTUFBTyxrQkFBUTtBQzNDZixNQUFJLE1BQU07SUFDUixLQUFLLElBQUc7QUFBRSxhQUFPLFNBQVMsZUFBZSxFQUFBLEtBQU8sU0FBUyxtQkFBbUIsSUFBQTtJQUFBO0lBRTVFLFlBQVksSUFBSSxXQUFVO0FBQ3hCLFNBQUcsVUFBVSxPQUFPLFNBQUE7QUFDcEIsVUFBRyxHQUFHLFVBQVUsV0FBVyxHQUFFO0FBQUUsV0FBRyxnQkFBZ0IsT0FBQTtNQUFBO0lBQUE7SUFHcEQsSUFBSSxNQUFNLE9BQU8sVUFBUztBQUN4QixVQUFHLENBQUMsTUFBSztBQUFFLGVBQU8sQ0FBQTtNQUFBO0FBQ2xCLFVBQUksUUFBUSxNQUFNLEtBQUssS0FBSyxpQkFBaUIsS0FBQSxDQUFBO0FBQzdDLGFBQU8sV0FBVyxNQUFNLFFBQVEsUUFBQSxJQUFZO0lBQUE7SUFHOUMsZ0JBQWdCLE1BQUs7QUFDbkIsVUFBSSxXQUFXLFNBQVMsY0FBYyxVQUFBO0FBQ3RDLGVBQVMsWUFBWTtBQUNyQixhQUFPLFNBQVMsUUFBUTtJQUFBO0lBRzFCLGNBQWMsSUFBRztBQUFFLGFBQU8sR0FBRyxTQUFTLFVBQVUsR0FBRyxhQUFhLGNBQUEsTUFBb0I7SUFBQTtJQUVwRixpQkFBaUIsTUFBSztBQUFFLGFBQU8sS0FBSyxJQUFJLE1BQU0sc0JBQXNCLGlCQUFBO0lBQUE7SUFFcEUsc0JBQXNCLE1BQU0sS0FBSTtBQUM5QixhQUFPLEtBQUsseUJBQXlCLEtBQUssSUFBSSxNQUFNLElBQUksa0JBQWtCLE9BQUEsR0FBVSxJQUFBO0lBQUE7SUFHdEYsZUFBZSxNQUFLO0FBQ2xCLGFBQU8sS0FBSyxNQUFNLElBQUksUUFBUSxNQUFNLFdBQUEsSUFBZSxPQUFPO0lBQUE7SUFHNUQsc0JBQXNCLElBQUc7QUFDdkIsVUFBRyxLQUFLLFdBQVcsRUFBQSxHQUFJO0FBQUUsV0FBRyxhQUFhLGFBQWEsRUFBQTtNQUFBO0FBQ3RELFdBQUssV0FBVyxJQUFJLGFBQWEsSUFBQTtJQUFBO0lBR25DLDBCQUEwQixNQUFNLFVBQVM7QUFDdkMsVUFBSSxXQUFXLFNBQVMsY0FBYyxVQUFBO0FBQ3RDLGVBQVMsWUFBWTtBQUNyQixhQUFPLEtBQUssZ0JBQWdCLFNBQVMsU0FBUyxRQUFBO0lBQUE7SUFHaEQsVUFBVSxJQUFJLFdBQVU7QUFDdEIsYUFBUSxJQUFHLGFBQWEsU0FBQSxLQUFjLEdBQUcsYUFBYSxpQkFBQSxPQUF3QjtJQUFBO0lBR2hGLFlBQVksSUFBSSxXQUFXLGFBQVk7QUFDckMsYUFBTyxHQUFHLGdCQUFnQixZQUFZLFFBQVEsR0FBRyxhQUFhLFNBQUEsQ0FBQSxLQUFlO0lBQUE7SUFHL0UsY0FBYyxJQUFHO0FBQUUsYUFBTyxLQUFLLElBQUksSUFBSSxJQUFJLGFBQUE7SUFBQTtJQUUzQyxnQkFBZ0IsSUFBSSxVQUFTO0FBQzNCLGFBQU8sS0FBSyxJQUFJLElBQUksR0FBRyxxQkFBcUIsa0JBQWtCLFlBQUE7SUFBQTtJQUdoRSxlQUFlLE1BQU0sTUFBSztBQUN4QixVQUFJLFVBQVUsSUFBSSxJQUFJLElBQUE7QUFDdEIsVUFBSSxhQUNGLEtBQUssT0FBTyxDQUFDLEtBQUssUUFBUTtBQUN4QixZQUFJLFdBQVcsSUFBSSxrQkFBa0IsVUFBVTtBQUUvQyxhQUFLLHlCQUF5QixLQUFLLElBQUksTUFBTSxRQUFBLEdBQVcsSUFBQSxFQUNyRCxJQUFJLENBQUEsT0FBTSxTQUFTLEdBQUcsYUFBYSxhQUFBLENBQUEsQ0FBQSxFQUNuQyxRQUFRLENBQUEsYUFBWSxJQUFJLE9BQU8sUUFBQSxDQUFBO0FBRWxDLGVBQU87TUFBQSxHQUNOLE9BQUE7QUFFTCxhQUFPLFdBQVcsU0FBUyxJQUFJLElBQUksSUFBSSxJQUFBLElBQVE7SUFBQTtJQUdqRCx5QkFBeUIsT0FBTyxRQUFPO0FBQ3JDLFVBQUcsT0FBTyxjQUFjLGlCQUFBLEdBQW1CO0FBQ3pDLGVBQU8sTUFBTSxPQUFPLENBQUEsT0FBTSxLQUFLLG1CQUFtQixJQUFJLE1BQUEsQ0FBQTtNQUFBLE9BQ2pEO0FBQ0wsZUFBTztNQUFBO0lBQUE7SUFJWCxtQkFBbUIsTUFBTSxRQUFPO0FBQzlCLGFBQU0sT0FBTyxLQUFLLFlBQVc7QUFDM0IsWUFBRyxLQUFLLFdBQVcsTUFBQSxHQUFRO0FBQUUsaUJBQU87UUFBQTtBQUNwQyxZQUFHLEtBQUssYUFBYSxXQUFBLE1BQWlCLE1BQUs7QUFBRSxpQkFBTztRQUFBO01BQUE7SUFBQTtJQUl4RCxRQUFRLElBQUksS0FBSTtBQUFFLGFBQU8sR0FBRyxnQkFBZ0IsR0FBRyxhQUFhO0lBQUE7SUFFNUQsY0FBYyxJQUFJLEtBQUk7QUFBRSxTQUFHLGdCQUFnQixPQUFRLEdBQUcsYUFBYTtJQUFBO0lBRW5FLFdBQVcsSUFBSSxLQUFLLE9BQU07QUFDeEIsVUFBRyxDQUFDLEdBQUcsY0FBYTtBQUFFLFdBQUcsZUFBZSxDQUFBO01BQUE7QUFDeEMsU0FBRyxhQUFhLE9BQU87SUFBQTtJQUd6QixjQUFjLElBQUksS0FBSyxZQUFZLFlBQVc7QUFDNUMsVUFBSSxXQUFXLEtBQUssUUFBUSxJQUFJLEdBQUE7QUFDaEMsVUFBRyxhQUFhLFFBQVU7QUFDeEIsYUFBSyxXQUFXLElBQUksS0FBSyxXQUFXLFVBQUEsQ0FBQTtNQUFBLE9BQy9CO0FBQ0wsYUFBSyxXQUFXLElBQUksS0FBSyxXQUFXLFFBQUEsQ0FBQTtNQUFBO0lBQUE7SUFJeEMsYUFBYSxRQUFRLFFBQU87QUFDMUIsVUFBRyxPQUFPLGNBQWE7QUFDckIsZUFBTyxlQUFlLE9BQU87TUFBQTtJQUFBO0lBSWpDLFNBQVMsS0FBSTtBQUNYLFVBQUksVUFBVSxTQUFTLGNBQWMsT0FBQTtBQUNyQyxVQUFJLEVBQUMsUUFBUSxXQUFVLFFBQVE7QUFDL0IsZUFBUyxRQUFRLEdBQUcsVUFBVSxLQUFLLE1BQU0sVUFBVTtJQUFBO0lBR3JELFNBQVMsSUFBSSxPQUFPLGFBQWEsaUJBQWlCLGFBQWEsaUJBQWlCLGFBQWEsVUFBUztBQUNwRyxVQUFJLFlBQVcsR0FBRyxhQUFhLFdBQUE7QUFDL0IsVUFBSSxZQUFXLEdBQUcsYUFBYSxXQUFBO0FBQy9CLFVBQUcsY0FBYSxJQUFHO0FBQUUsb0JBQVc7TUFBQTtBQUNoQyxVQUFHLGNBQWEsSUFBRztBQUFFLG9CQUFXO01BQUE7QUFDaEMsVUFBSSxRQUFRLGFBQVk7QUFDeEIsY0FBTzthQUNBO0FBQU0saUJBQU8sU0FBQTthQUViO0FBQ0gsY0FBRyxLQUFLLEtBQUssSUFBSSxlQUFBLEdBQWlCO0FBQ2hDLGVBQUcsaUJBQWlCLFFBQVEsTUFBTSxTQUFBLENBQUE7VUFBQTtBQUVwQzs7QUFHQSxjQUFJLFVBQVUsU0FBUyxLQUFBO0FBQ3ZCLGNBQUksVUFBVSxNQUFNLFlBQVcsS0FBSyxjQUFjLElBQUksU0FBQSxJQUFhLFNBQUE7QUFDbkUsY0FBSSxlQUFlLEtBQUssU0FBUyxJQUFJLGtCQUFrQixPQUFBO0FBQ3ZELGNBQUcsTUFBTSxPQUFBLEdBQVM7QUFBRSxtQkFBTyxTQUFTLG9DQUFvQyxPQUFBO1VBQUE7QUFDeEUsY0FBRyxXQUFTO0FBQ1YsZ0JBQUksYUFBYTtBQUNqQixnQkFBRyxNQUFNLFNBQVMsV0FBVTtBQUMxQixrQkFBSSxVQUFVLEtBQUssUUFBUSxJQUFJLGlCQUFBO0FBQy9CLG1CQUFLLFdBQVcsSUFBSSxtQkFBbUIsTUFBTSxHQUFBO0FBQzdDLDJCQUFhLFlBQVksTUFBTTtZQUFBO0FBR2pDLGdCQUFHLENBQUMsY0FBYyxLQUFLLFFBQVEsSUFBSSxTQUFBLEdBQVc7QUFDNUMscUJBQU87WUFBQSxPQUNGO0FBQ0wsdUJBQUE7QUFDQSxtQkFBSyxXQUFXLElBQUksV0FBVyxJQUFBO0FBQy9CLHlCQUFXLE1BQU07QUFDZixvQkFBRyxZQUFBLEdBQWM7QUFBRSx1QkFBSyxhQUFhLElBQUksZ0JBQUE7Z0JBQUE7Y0FBQSxHQUN4QyxPQUFBO1lBQUE7VUFBQSxPQUVBO0FBQ0wsdUJBQVcsTUFBTTtBQUNmLGtCQUFHLFlBQUEsR0FBYztBQUFFLHFCQUFLLGFBQWEsSUFBSSxrQkFBa0IsWUFBQTtjQUFBO1lBQUEsR0FDMUQsT0FBQTtVQUFBO0FBR0wsY0FBSSxPQUFPLEdBQUc7QUFDZCxjQUFHLFFBQVEsS0FBSyxLQUFLLE1BQU0sZUFBQSxHQUFpQjtBQUMxQyxpQkFBSyxpQkFBaUIsVUFBVSxNQUFNO0FBQ3BDLG9CQUFNLEtBQU0sSUFBSSxTQUFTLElBQUEsRUFBTyxRQUFBLEdBQVcsQ0FBQyxDQUFDLFVBQVU7QUFDckQsb0JBQUksUUFBUSxLQUFLLGNBQWMsVUFBVSxRQUFBO0FBQ3pDLHFCQUFLLFNBQVMsT0FBTyxnQkFBQTtBQUNyQixxQkFBSyxjQUFjLE9BQU8sU0FBQTtjQUFBLENBQUE7WUFBQSxDQUFBO1VBQUE7QUFJaEMsY0FBRyxLQUFLLEtBQUssSUFBSSxlQUFBLEdBQWlCO0FBQ2hDLGVBQUcsaUJBQWlCLFFBQVEsTUFBTSxLQUFLLGFBQWEsSUFBSSxnQkFBQSxDQUFBO1VBQUE7O0lBQUE7SUFLaEUsYUFBYSxJQUFJLEtBQUssY0FBYTtBQUNqQyxVQUFJLENBQUMsT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLEdBQUE7QUFDeEMsVUFBRyxDQUFDLGNBQWE7QUFBRSx1QkFBZTtNQUFBO0FBQ2xDLFVBQUcsaUJBQWlCLE9BQU07QUFDeEIsYUFBSyxTQUFTLElBQUksR0FBQTtBQUNsQixnQkFBQTtNQUFBO0lBQUE7SUFJSixLQUFLLElBQUksS0FBSTtBQUNYLFVBQUcsS0FBSyxRQUFRLElBQUksR0FBQSxNQUFTLE1BQUs7QUFBRSxlQUFPO01BQUE7QUFDM0MsV0FBSyxXQUFXLElBQUksS0FBSyxJQUFBO0FBQ3pCLGFBQU87SUFBQTtJQUdULFNBQVMsSUFBSSxLQUFLLFVBQVUsV0FBVztJQUFBLEdBQUk7QUFDekMsVUFBSSxDQUFDLGdCQUFnQixLQUFLLFFBQVEsSUFBSSxHQUFBLEtBQVEsQ0FBQyxHQUFHLE9BQUE7QUFDbEQ7QUFDQSxXQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsY0FBYyxPQUFBLENBQUE7QUFDeEMsYUFBTztJQUFBO0lBR1QsYUFBYSxXQUFXLElBQUksZ0JBQWU7QUFDekMsVUFBSSxRQUFRLEdBQUcsZ0JBQWdCLEdBQUcsYUFBYSxjQUFBO0FBRS9DLFVBQUksUUFBUSxTQUFTLFVBQVUsY0FBYyxRQUFRLG1CQUFtQixtQkFBbUIsV0FBQTtBQUMzRixVQUFHLENBQUMsT0FBTTtBQUFFO01BQUE7QUFFWixVQUFHLENBQUUsTUFBSyxRQUFRLE9BQU8sZUFBQSxLQUFvQixLQUFLLFFBQVEsTUFBTSxNQUFNLGlCQUFBLElBQW9CO0FBQ3hGLFdBQUcsVUFBVSxJQUFJLHFCQUFBO01BQUE7SUFBQTtJQUlyQixVQUFVLFNBQVMsZ0JBQWU7QUFDaEMsVUFBRyxRQUFRLE1BQU0sUUFBUSxNQUFLO0FBQzVCLGFBQUssSUFBSSxRQUFRLE1BQU0sSUFBSSxtQkFBbUIsUUFBUSxVQUFVLG1CQUFtQixRQUFRLFVBQVUsQ0FBQyxPQUFPO0FBQzNHLGVBQUssWUFBWSxJQUFJLHFCQUFBO1FBQUEsQ0FBQTtNQUFBO0lBQUE7SUFLM0IsV0FBVyxNQUFLO0FBQ2QsYUFBTyxLQUFLLGdCQUFnQixLQUFLLGFBQWEsYUFBQTtJQUFBO0lBR2hELFlBQVksTUFBSztBQUNmLGFBQU8sS0FBSyxnQkFBZ0IsS0FBSyxhQUFhLFVBQUEsTUFBZ0I7SUFBQTtJQUdoRSxjQUFjLElBQUc7QUFDZixhQUFPLEtBQUssV0FBVyxFQUFBLElBQU0sS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLGdCQUFBLEVBQWtCO0lBQUE7SUFHdkUsY0FBYyxRQUFRLE1BQU0sT0FBTyxDQUFBLEdBQUc7QUFDcEMsVUFBSSxVQUFVLEtBQUssWUFBWSxTQUFZLE9BQU8sQ0FBQyxDQUFDLEtBQUs7QUFDekQsVUFBSSxZQUFZLEVBQUMsU0FBa0IsWUFBWSxNQUFNLFFBQVEsS0FBSyxVQUFVLENBQUEsRUFBQTtBQUM1RSxVQUFJLFFBQVEsU0FBUyxVQUFVLElBQUksV0FBVyxTQUFTLFNBQUEsSUFBYSxJQUFJLFlBQVksTUFBTSxTQUFBO0FBQzFGLGFBQU8sY0FBYyxLQUFBO0lBQUE7SUFHdkIsVUFBVSxNQUFNLE1BQUs7QUFDbkIsVUFBRyxPQUFRLFNBQVUsYUFBWTtBQUMvQixlQUFPLEtBQUssVUFBVSxJQUFBO01BQUEsT0FDakI7QUFDTCxZQUFJLFNBQVMsS0FBSyxVQUFVLEtBQUE7QUFDNUIsZUFBTyxZQUFZO0FBQ25CLGVBQU87TUFBQTtJQUFBO0lBSVgsV0FBVyxRQUFRLFFBQVEsT0FBTyxDQUFBLEdBQUc7QUFDbkMsVUFBSSxVQUFVLEtBQUssV0FBVyxDQUFBO0FBQzlCLFVBQUksWUFBWSxLQUFLO0FBQ3JCLFVBQUksY0FBYyxPQUFPO0FBQ3pCLGVBQVEsSUFBSSxZQUFZLFNBQVMsR0FBRyxLQUFLLEdBQUcsS0FBSTtBQUM5QyxZQUFJLE9BQU8sWUFBWSxHQUFHO0FBQzFCLFlBQUcsUUFBUSxRQUFRLElBQUEsSUFBUSxHQUFFO0FBQUUsaUJBQU8sYUFBYSxNQUFNLE9BQU8sYUFBYSxJQUFBLENBQUE7UUFBQTtNQUFBO0FBRy9FLFVBQUksY0FBYyxPQUFPO0FBQ3pCLGVBQVEsSUFBSSxZQUFZLFNBQVMsR0FBRyxLQUFLLEdBQUcsS0FBSTtBQUM5QyxZQUFJLE9BQU8sWUFBWSxHQUFHO0FBQzFCLFlBQUcsV0FBVTtBQUNYLGNBQUcsS0FBSyxXQUFXLE9BQUEsS0FBWSxDQUFDLE9BQU8sYUFBYSxJQUFBLEdBQU07QUFBRSxtQkFBTyxnQkFBZ0IsSUFBQTtVQUFBO1FBQUEsT0FDOUU7QUFDTCxjQUFHLENBQUMsT0FBTyxhQUFhLElBQUEsR0FBTTtBQUFFLG1CQUFPLGdCQUFnQixJQUFBO1VBQUE7UUFBQTtNQUFBO0lBQUE7SUFLN0Qsa0JBQWtCLFFBQVEsUUFBTztBQUUvQixVQUFHLENBQUUsbUJBQWtCLG9CQUFtQjtBQUFFLFlBQUksV0FBVyxRQUFRLFFBQVEsRUFBQyxTQUFTLENBQUMsT0FBQSxFQUFBLENBQUE7TUFBQTtBQUN0RixVQUFHLE9BQU8sVUFBUztBQUNqQixlQUFPLGFBQWEsWUFBWSxJQUFBO01BQUEsT0FDM0I7QUFDTCxlQUFPLGdCQUFnQixVQUFBO01BQUE7SUFBQTtJQUkzQixrQkFBa0IsSUFBRztBQUNuQixhQUFPLEdBQUcscUJBQXNCLElBQUcsU0FBUyxVQUFVLEdBQUcsU0FBUztJQUFBO0lBR3BFLGFBQWEsU0FBUyxnQkFBZ0IsY0FBYTtBQUNqRCxVQUFHLENBQUMsSUFBSSxlQUFlLE9BQUEsR0FBUztBQUFFO01BQUE7QUFDbEMsVUFBSSxhQUFhLFFBQVEsUUFBUSxRQUFBO0FBQ2pDLFVBQUcsUUFBUSxVQUFTO0FBQUUsZ0JBQVEsS0FBQTtNQUFBO0FBQzlCLFVBQUcsQ0FBQyxZQUFXO0FBQUUsZ0JBQVEsTUFBQTtNQUFBO0FBQ3pCLFVBQUcsS0FBSyxrQkFBa0IsT0FBQSxHQUFTO0FBQ2pDLGdCQUFRLGtCQUFrQixnQkFBZ0IsWUFBQTtNQUFBO0lBQUE7SUFJOUMsWUFBWSxJQUFHO0FBQUUsYUFBTywrQkFBK0IsS0FBSyxHQUFHLE9BQUEsS0FBWSxHQUFHLFNBQVM7SUFBQTtJQUV2RixpQkFBaUIsSUFBRztBQUNsQixVQUFHLGNBQWMsb0JBQW9CLGlCQUFpQixRQUFRLEdBQUcsS0FBSyxrQkFBQSxDQUFBLEtBQXdCLEdBQUU7QUFDOUYsV0FBRyxVQUFVLEdBQUcsYUFBYSxTQUFBLE1BQWU7TUFBQTtJQUFBO0lBSWhELGVBQWUsSUFBRztBQUFFLGFBQU8saUJBQWlCLFFBQVEsR0FBRyxJQUFBLEtBQVM7SUFBQTtJQUVoRSx5QkFBeUIsSUFBSSxvQkFBbUI7QUFDOUMsYUFBTyxHQUFHLGdCQUFnQixHQUFHLGFBQWEsa0JBQUEsTUFBd0I7SUFBQTtJQUdwRSxlQUFlLFFBQVEsTUFBTSxhQUFZO0FBQ3ZDLFVBQUksTUFBTSxPQUFPLGFBQWEsT0FBQTtBQUM5QixVQUFHLFFBQVEsTUFBSztBQUFFLGVBQU87TUFBQTtBQUN6QixVQUFJLFNBQVMsT0FBTyxhQUFhLFdBQUE7QUFFakMsVUFBRyxJQUFJLFlBQVksTUFBQSxLQUFXLE9BQU8sYUFBYSxXQUFBLE1BQWlCLE1BQUs7QUFDdEUsWUFBRyxJQUFJLGNBQWMsTUFBQSxHQUFRO0FBQUUsY0FBSSxXQUFXLFFBQVEsTUFBTSxFQUFDLFdBQVcsS0FBQSxDQUFBO1FBQUE7QUFDeEUsWUFBSSxXQUFXLFFBQVEsU0FBUyxJQUFBO0FBQ2hDLGVBQU87TUFBQSxPQUNGO0FBQ0wsMEJBQWtCLFFBQVEsQ0FBQSxjQUFhO0FBQ3JDLGlCQUFPLFVBQVUsU0FBUyxTQUFBLEtBQWMsS0FBSyxVQUFVLElBQUksU0FBQTtRQUFBLENBQUE7QUFFN0QsYUFBSyxhQUFhLFNBQVMsR0FBQTtBQUMzQixhQUFLLGFBQWEsYUFBYSxNQUFBO0FBQy9CLGVBQU87TUFBQTtJQUFBO0lBSVgsZ0JBQWdCLFdBQVcsV0FBVTtBQUNuQyxVQUFHLElBQUksWUFBWSxXQUFXLFdBQVcsQ0FBQyxVQUFVLFNBQUEsQ0FBQSxHQUFZO0FBQzlELFlBQUksV0FBVyxDQUFBO0FBQ2Ysa0JBQVUsV0FBVyxRQUFRLENBQUEsY0FBYTtBQUN4QyxjQUFHLENBQUMsVUFBVSxJQUFHO0FBRWYsZ0JBQUksa0JBQWtCLFVBQVUsYUFBYSxLQUFLLGFBQWEsVUFBVSxVQUFVLEtBQUEsTUFBVztBQUM5RixnQkFBRyxDQUFDLGlCQUFnQjtBQUNsQix1QkFBUzs7MEJBQ3FCLFdBQVUsYUFBYSxVQUFVLFdBQVcsS0FBQTs7Q0FBQTtZQUFBO0FBRTVFLHFCQUFTLEtBQUssU0FBQTtVQUFBO1FBQUEsQ0FBQTtBQUdsQixpQkFBUyxRQUFRLENBQUEsY0FBYSxVQUFVLE9BQUEsQ0FBQTtNQUFBO0lBQUE7SUFJNUMscUJBQXFCLFdBQVcsU0FBUyxPQUFNO0FBQzdDLFVBQUksZ0JBQWdCLG9CQUFJLElBQUksQ0FBQyxNQUFNLGFBQWEsWUFBWSxVQUFVLFdBQUEsQ0FBQTtBQUN0RSxVQUFHLFVBQVUsUUFBUSxZQUFBLE1BQWtCLFFBQVEsWUFBQSxHQUFjO0FBQzNELGNBQU0sS0FBSyxVQUFVLFVBQUEsRUFDbEIsT0FBTyxDQUFBLFNBQVEsQ0FBQyxjQUFjLElBQUksS0FBSyxLQUFLLFlBQUEsQ0FBQSxDQUFBLEVBQzVDLFFBQVEsQ0FBQSxTQUFRLFVBQVUsZ0JBQWdCLEtBQUssSUFBQSxDQUFBO0FBRWxELGVBQU8sS0FBSyxLQUFBLEVBQ1QsT0FBTyxDQUFBLFNBQVEsQ0FBQyxjQUFjLElBQUksS0FBSyxZQUFBLENBQUEsQ0FBQSxFQUN2QyxRQUFRLENBQUEsU0FBUSxVQUFVLGFBQWEsTUFBTSxNQUFNLEtBQUEsQ0FBQTtBQUV0RCxlQUFPO01BQUEsT0FFRjtBQUNMLFlBQUksZUFBZSxTQUFTLGNBQWMsT0FBQTtBQUMxQyxlQUFPLEtBQUssS0FBQSxFQUFPLFFBQVEsQ0FBQSxTQUFRLGFBQWEsYUFBYSxNQUFNLE1BQU0sS0FBQSxDQUFBO0FBQ3pFLHNCQUFjLFFBQVEsQ0FBQSxTQUFRLGFBQWEsYUFBYSxNQUFNLFVBQVUsYUFBYSxJQUFBLENBQUEsQ0FBQTtBQUNyRixxQkFBYSxZQUFZLFVBQVU7QUFDbkMsa0JBQVUsWUFBWSxZQUFBO0FBQ3RCLGVBQU87TUFBQTtJQUFBO0lBSVgsVUFBVSxJQUFJLE1BQU0sWUFBVztBQUM3QixVQUFJLEtBQU0sS0FBSSxRQUFRLElBQUksUUFBQSxLQUFhLENBQUEsR0FBSSxLQUFLLENBQUMsQ0FBQyxrQkFBb0IsU0FBUyxZQUFBO0FBQy9FLFVBQUcsSUFBRztBQUNKLFlBQUksQ0FBQyxPQUFPLEtBQUssaUJBQWlCO0FBQ2xDLGVBQU87TUFBQSxPQUNGO0FBQ0wsZUFBTyxPQUFPLGVBQWdCLGFBQWEsV0FBQSxJQUFlO01BQUE7SUFBQTtJQUk5RCxhQUFhLElBQUksTUFBSztBQUNwQixXQUFLLGNBQWMsSUFBSSxVQUFVLENBQUEsR0FBSSxDQUFBLFFBQU87QUFDMUMsZUFBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLGNBQWMsT0FBTyxpQkFBaUIsSUFBQTtNQUFBLENBQUE7SUFBQTtJQUk5RCxVQUFVLElBQUksTUFBTSxJQUFHO0FBQ3JCLFVBQUksZ0JBQWdCLEdBQUcsRUFBQTtBQUN2QixXQUFLLGNBQWMsSUFBSSxVQUFVLENBQUEsR0FBSSxDQUFBLFFBQU87QUFDMUMsWUFBSSxnQkFBZ0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxrQkFBb0IsU0FBUyxZQUFBO0FBQ2pFLFlBQUcsaUJBQWlCLEdBQUU7QUFDcEIsY0FBSSxpQkFBaUIsQ0FBQyxNQUFNLElBQUksYUFBQTtRQUFBLE9BQzNCO0FBQ0wsY0FBSSxLQUFLLENBQUMsTUFBTSxJQUFJLGFBQUEsQ0FBQTtRQUFBO0FBRXRCLGVBQU87TUFBQSxDQUFBO0lBQUE7SUFJWCxzQkFBc0IsSUFBRztBQUN2QixVQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksUUFBQTtBQUMxQixVQUFHLENBQUMsS0FBSTtBQUFFO01BQUE7QUFFVixVQUFJLFFBQVEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxjQUFjLEtBQUssVUFBVSxJQUFJLE1BQU0sRUFBQSxDQUFBO0lBQUE7RUFBQTtBQUluRSxNQUFPLGNBQVE7QUNqYWYsTUFBQSxjQUFBLE1BQWlDO0lBQUEsT0FDeEIsU0FBUyxRQUFRLE1BQUs7QUFDM0IsVUFBSSxRQUFRLEtBQUssWUFBWTtBQUM3QixVQUFJLGFBQWEsT0FBTyxhQUFhLHFCQUFBLEVBQXVCLE1BQU0sR0FBQTtBQUNsRSxVQUFJLFdBQVcsV0FBVyxRQUFRLGFBQWEsV0FBVyxJQUFBLENBQUEsS0FBVTtBQUNwRSxhQUFPLEtBQUssT0FBTyxLQUFNLFVBQVM7SUFBQTtJQUFBLE9BRzdCLGNBQWMsUUFBUSxNQUFLO0FBQ2hDLFVBQUksa0JBQWtCLE9BQU8sYUFBYSxvQkFBQSxFQUFzQixNQUFNLEdBQUE7QUFDdEUsVUFBSSxnQkFBZ0IsZ0JBQWdCLFFBQVEsYUFBYSxXQUFXLElBQUEsQ0FBQSxLQUFVO0FBQzlFLGFBQU8saUJBQWlCLEtBQUssU0FBUyxRQUFRLElBQUE7SUFBQTtJQUdoRCxZQUFZLFFBQVEsTUFBTSxNQUFLO0FBQzdCLFdBQUssTUFBTSxhQUFhLFdBQVcsSUFBQTtBQUNuQyxXQUFLLFNBQVM7QUFDZCxXQUFLLE9BQU87QUFDWixXQUFLLE9BQU87QUFDWixXQUFLLE9BQU87QUFDWixXQUFLLGVBQWU7QUFDcEIsV0FBSyxVQUFVO0FBQ2YsV0FBSyxZQUFZO0FBQ2pCLFdBQUssb0JBQW9CO0FBQ3pCLFdBQUssVUFBVSxXQUFXO01BQUE7QUFDMUIsV0FBSyxlQUFlLEtBQUssWUFBWSxLQUFLLElBQUE7QUFDMUMsV0FBSyxPQUFPLGlCQUFpQix1QkFBdUIsS0FBSyxZQUFBO0lBQUE7SUFHM0QsV0FBVTtBQUFFLGFBQU8sS0FBSztJQUFBO0lBRXhCLFNBQVMsVUFBUztBQUNoQixXQUFLLFlBQVksS0FBSyxNQUFNLFFBQUE7QUFDNUIsVUFBRyxLQUFLLFlBQVksS0FBSyxtQkFBa0I7QUFDekMsWUFBRyxLQUFLLGFBQWEsS0FBSTtBQUN2QixlQUFLLFlBQVk7QUFDakIsZUFBSyxvQkFBb0I7QUFDekIsZUFBSyxVQUFVO0FBQ2YsZUFBSyxLQUFLLGlCQUFpQixLQUFLLFFBQVEsS0FBSyxLQUFLLEtBQUssTUFBTTtBQUMzRCx5QkFBYSxZQUFZLEtBQUssUUFBUSxLQUFLLElBQUE7QUFDM0MsaUJBQUssUUFBQTtVQUFBLENBQUE7UUFBQSxPQUVGO0FBQ0wsZUFBSyxvQkFBb0IsS0FBSztBQUM5QixlQUFLLEtBQUssaUJBQWlCLEtBQUssUUFBUSxLQUFLLEtBQUssS0FBSyxTQUFBO1FBQUE7TUFBQTtJQUFBO0lBSzdELFNBQVE7QUFDTixXQUFLLGVBQWU7QUFDcEIsV0FBSyxVQUFVO0FBQ2YsV0FBSyxRQUFBO0lBQUE7SUFHUCxTQUFRO0FBQUUsYUFBTyxLQUFLO0lBQUE7SUFFdEIsTUFBTSxTQUFTLFVBQVM7QUFDdEIsV0FBSyxPQUFPLG9CQUFvQix1QkFBdUIsS0FBSyxZQUFBO0FBQzVELFdBQUssS0FBSyxpQkFBaUIsS0FBSyxRQUFRLEtBQUssS0FBSyxFQUFDLE9BQU8sT0FBQSxDQUFBO0FBQzFELG1CQUFhLFdBQVcsS0FBSyxNQUFBO0lBQUE7SUFLL0IsT0FBTyxVQUFTO0FBQ2QsV0FBSyxVQUFVLE1BQU07QUFDbkIsYUFBSyxPQUFPLG9CQUFvQix1QkFBdUIsS0FBSyxZQUFBO0FBQzVELGlCQUFBO01BQUE7SUFBQTtJQUlKLGNBQWE7QUFDWCxVQUFJLGFBQWEsS0FBSyxPQUFPLGFBQWEscUJBQUEsRUFBdUIsTUFBTSxHQUFBO0FBQ3ZFLFVBQUcsV0FBVyxRQUFRLEtBQUssR0FBQSxNQUFTLElBQUc7QUFBRSxhQUFLLE9BQUE7TUFBQTtJQUFBO0lBR2hELHFCQUFvQjtBQUNsQixhQUFPO1FBQ0wsZUFBZSxLQUFLLEtBQUs7UUFDekIsTUFBTSxLQUFLLEtBQUs7UUFDaEIsZUFBZSxLQUFLLEtBQUs7UUFDekIsTUFBTSxLQUFLLEtBQUs7UUFDaEIsTUFBTSxLQUFLLEtBQUs7UUFDaEIsS0FBSyxLQUFLO01BQUE7SUFBQTtJQUlkLFNBQVMsV0FBVTtBQUNqQixVQUFHLEtBQUssS0FBSyxVQUFTO0FBQ3BCLFlBQUksV0FBVyxVQUFVLEtBQUssS0FBSyxhQUFhLFNBQVMsOEJBQThCLEtBQUssS0FBSyxVQUFBO0FBQ2pHLGVBQU8sRUFBQyxNQUFNLEtBQUssS0FBSyxVQUFVLFNBQUE7TUFBQSxPQUM3QjtBQUNMLGVBQU8sRUFBQyxNQUFNLFdBQVcsVUFBVSxnQkFBQTtNQUFBO0lBQUE7SUFJdkMsY0FBYyxNQUFLO0FBQ2pCLFdBQUssT0FBTyxLQUFLLFFBQVEsS0FBSztBQUM5QixVQUFHLENBQUMsS0FBSyxNQUFLO0FBQUUsaUJBQVMsa0RBQWtELEtBQUssT0FBTyxFQUFDLE9BQU8sS0FBSyxRQUFRLFVBQVUsS0FBQSxDQUFBO01BQUE7SUFBQTtFQUFBO0FDcEcxSCxNQUFJLHNCQUFzQjtBQUUxQixNQUFBLGVBQUEsTUFBa0M7SUFBQSxPQUN6QixXQUFXLE1BQUs7QUFDckIsVUFBSSxNQUFNLEtBQUs7QUFDZixVQUFHLFFBQVEsUUFBVTtBQUNuQixlQUFPO01BQUEsT0FDRjtBQUNMLGFBQUssVUFBVyx3QkFBdUIsU0FBQTtBQUN2QyxlQUFPLEtBQUs7TUFBQTtJQUFBO0lBQUEsT0FJVCxnQkFBZ0IsU0FBUyxLQUFLLFVBQVM7QUFDNUMsVUFBSSxPQUFPLEtBQUssWUFBWSxPQUFBLEVBQVMsS0FBSyxDQUFBLFVBQVEsS0FBSyxXQUFXLEtBQUEsTUFBVSxHQUFBO0FBQzVFLGVBQVMsSUFBSSxnQkFBZ0IsSUFBQSxDQUFBO0lBQUE7SUFBQSxPQUd4QixxQkFBcUIsUUFBTztBQUNqQyxVQUFJLFNBQVM7QUFDYixrQkFBSSxpQkFBaUIsTUFBQSxFQUFRLFFBQVEsQ0FBQSxVQUFTO0FBQzVDLFlBQUcsTUFBTSxhQUFhLG9CQUFBLE1BQTBCLE1BQU0sYUFBYSxhQUFBLEdBQWU7QUFDaEY7UUFBQTtNQUFBLENBQUE7QUFHSixhQUFPLFNBQVM7SUFBQTtJQUFBLE9BR1gsaUJBQWlCLFNBQVE7QUFDOUIsVUFBSSxRQUFRLEtBQUssWUFBWSxPQUFBO0FBQzdCLFVBQUksV0FBVyxDQUFBO0FBQ2YsWUFBTSxRQUFRLENBQUEsU0FBUTtBQUNwQixZQUFJLFFBQVEsRUFBQyxNQUFNLFFBQVEsS0FBQTtBQUMzQixZQUFJLFlBQVksUUFBUSxhQUFhLGNBQUE7QUFDckMsaUJBQVMsYUFBYSxTQUFTLGNBQWMsQ0FBQTtBQUM3QyxjQUFNLE1BQU0sS0FBSyxXQUFXLElBQUE7QUFDNUIsY0FBTSxnQkFBZ0IsS0FBSztBQUMzQixjQUFNLE9BQU8sS0FBSyxRQUFRLE1BQU07QUFDaEMsY0FBTSxnQkFBZ0IsS0FBSztBQUMzQixjQUFNLE9BQU8sS0FBSztBQUNsQixjQUFNLE9BQU8sS0FBSztBQUNsQixpQkFBUyxXQUFXLEtBQUssS0FBQTtNQUFBLENBQUE7QUFFM0IsYUFBTztJQUFBO0lBQUEsT0FHRixXQUFXLFNBQVE7QUFDeEIsY0FBUSxRQUFRO0FBQ2hCLGNBQVEsZ0JBQWdCLGNBQUE7QUFDeEIsa0JBQUksV0FBVyxTQUFTLFNBQVMsQ0FBQSxDQUFBO0lBQUE7SUFBQSxPQUc1QixZQUFZLFNBQVMsTUFBSztBQUMvQixrQkFBSSxXQUFXLFNBQVMsU0FBUyxZQUFJLFFBQVEsU0FBUyxPQUFBLEVBQVMsT0FBTyxDQUFBLE1BQUssQ0FBQyxPQUFPLEdBQUcsR0FBRyxJQUFBLENBQUEsQ0FBQTtJQUFBO0lBQUEsT0FHcEYsV0FBVyxTQUFTLE9BQU07QUFDL0IsVUFBRyxRQUFRLGFBQWEsVUFBQSxNQUFnQixNQUFLO0FBQzNDLFlBQUksV0FBVyxNQUFNLE9BQU8sQ0FBQSxTQUFRLENBQUMsS0FBSyxZQUFZLE9BQUEsRUFBUyxLQUFLLENBQUEsTUFBSyxPQUFPLEdBQUcsR0FBRyxJQUFBLENBQUEsQ0FBQTtBQUN0RixvQkFBSSxXQUFXLFNBQVMsU0FBUyxLQUFLLFlBQVksT0FBQSxFQUFTLE9BQU8sUUFBQSxDQUFBO0FBQ2xFLGdCQUFRLFFBQVE7TUFBQSxPQUNYO0FBQ0wsb0JBQUksV0FBVyxTQUFTLFNBQVMsS0FBQTtNQUFBO0lBQUE7SUFBQSxPQUk5QixpQkFBaUIsUUFBTztBQUM3QixVQUFJLGFBQWEsWUFBSSxpQkFBaUIsTUFBQTtBQUN0QyxhQUFPLE1BQU0sS0FBSyxVQUFBLEVBQVksT0FBTyxDQUFBLE9BQU0sR0FBRyxTQUFTLEtBQUssWUFBWSxFQUFBLEVBQUksU0FBUyxDQUFBO0lBQUE7SUFBQSxPQUdoRixZQUFZLE9BQU07QUFDdkIsYUFBUSxhQUFJLFFBQVEsT0FBTyxPQUFBLEtBQVksQ0FBQSxHQUFJLE9BQU8sQ0FBQSxNQUFLLFlBQVksU0FBUyxPQUFPLENBQUEsQ0FBQTtJQUFBO0lBQUEsT0FHOUUsd0JBQXdCLFFBQU87QUFDcEMsVUFBSSxhQUFhLFlBQUksaUJBQWlCLE1BQUE7QUFDdEMsYUFBTyxNQUFNLEtBQUssVUFBQSxFQUFZLE9BQU8sQ0FBQSxVQUFTLEtBQUssdUJBQXVCLEtBQUEsRUFBTyxTQUFTLENBQUE7SUFBQTtJQUFBLE9BR3JGLHVCQUF1QixPQUFNO0FBQ2xDLGFBQU8sS0FBSyxZQUFZLEtBQUEsRUFBTyxPQUFPLENBQUEsTUFBSyxDQUFDLFlBQVksY0FBYyxPQUFPLENBQUEsQ0FBQTtJQUFBO0lBRy9FLFlBQVksU0FBUyxNQUFNLFlBQVc7QUFDcEMsV0FBSyxPQUFPO0FBQ1osV0FBSyxhQUFhO0FBQ2xCLFdBQUssV0FDSCxNQUFNLEtBQUssYUFBYSx1QkFBdUIsT0FBQSxLQUFZLENBQUEsQ0FBQSxFQUN4RCxJQUFJLENBQUEsU0FBUSxJQUFJLFlBQVksU0FBUyxNQUFNLElBQUEsQ0FBQTtBQUVoRCxXQUFLLHVCQUF1QixLQUFLLFNBQVM7SUFBQTtJQUc1QyxVQUFTO0FBQUUsYUFBTyxLQUFLO0lBQUE7SUFFdkIsa0JBQWtCLE1BQU0sU0FBUyxhQUFXO0FBQzFDLFdBQUssV0FDSCxLQUFLLFNBQVMsSUFBSSxDQUFBLFVBQVM7QUFDekIsY0FBTSxjQUFjLElBQUE7QUFDcEIsY0FBTSxPQUFPLE1BQU07QUFDakIsZUFBSztBQUNMLGNBQUcsS0FBSyx5QkFBeUIsR0FBRTtBQUFFLGlCQUFLLFdBQUE7VUFBQTtRQUFBLENBQUE7QUFFNUMsZUFBTztNQUFBLENBQUE7QUFHWCxVQUFJLGlCQUFpQixLQUFLLFNBQVMsT0FBTyxDQUFDLEtBQUssVUFBVTtBQUN4RCxZQUFJLEVBQUMsTUFBTSxhQUFZLE1BQU0sU0FBUyxZQUFXLFNBQUE7QUFDakQsWUFBSSxRQUFRLElBQUksU0FBUyxFQUFDLFVBQW9CLFNBQVMsQ0FBQSxFQUFBO0FBQ3ZELFlBQUksTUFBTSxRQUFRLEtBQUssS0FBQTtBQUN2QixlQUFPO01BQUEsR0FDTixDQUFBLENBQUE7QUFFSCxlQUFRLFFBQVEsZ0JBQWU7QUFDN0IsWUFBSSxFQUFDLFVBQVUsWUFBVyxlQUFlO0FBQ3pDLGlCQUFTLFNBQVMsU0FBUyxNQUFNLFdBQUE7TUFBQTtJQUFBO0VBQUE7QUNoSXZDLE1BQUksT0FBTztJQUNULFlBQVc7QUFDVCxVQUFJLFNBQVMsU0FBUyxjQUFjLG1CQUFBO0FBQ3BDLFVBQUcsUUFBTztBQUNSLFlBQUksZUFBZSxPQUFPO0FBQzFCLGVBQU8sV0FBVztBQUNsQixlQUFPLE1BQUE7QUFDUCxlQUFPLFdBQVc7TUFBQTtJQUFBO0lBSXRCLE1BQU0sVUFBVSxTQUFRO0FBQUUsYUFBTyxRQUFRLEtBQUssQ0FBQSxTQUFRLG9CQUFvQixJQUFBO0lBQUE7SUFFMUUsWUFBWSxJQUFJLGlCQUFnQjtBQUM5QixhQUNHLGNBQWMscUJBQXFCLEdBQUcsUUFBUSxZQUM5QyxjQUFjLG1CQUFtQixHQUFHLFNBQVMsVUFDN0MsQ0FBQyxHQUFHLFlBQWEsS0FBSyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsbUJBQW1CLHFCQUFxQixpQkFBQSxDQUFBLEtBQzNGLGNBQWMscUJBQ2QsSUFBRyxXQUFXLEtBQU0sQ0FBQyxtQkFBbUIsR0FBRyxhQUFhLEtBQUssR0FBRyxhQUFhLFVBQUEsTUFBZ0IsUUFBUSxHQUFHLGFBQWEsYUFBQSxNQUFtQjtJQUFBO0lBSTdJLGFBQWEsSUFBSSxpQkFBZ0I7QUFDL0IsVUFBRyxLQUFLLFlBQVksSUFBSSxlQUFBLEdBQWlCO0FBQUUsWUFBRztBQUFFLGFBQUcsTUFBQTtRQUFBLFNBQWdCLEdBQWhCO1FBQVU7TUFBQTtBQUM3RCxhQUFPLENBQUMsQ0FBQyxTQUFTLGlCQUFpQixTQUFTLGNBQWMsV0FBVyxFQUFBO0lBQUE7SUFHdkUsc0JBQXNCLElBQUc7QUFDdkIsVUFBSSxRQUFRLEdBQUc7QUFDZixhQUFNLE9BQU07QUFDVixZQUFHLEtBQUssYUFBYSxPQUFPLElBQUEsS0FBUyxLQUFLLHNCQUFzQixPQUFPLElBQUEsR0FBTTtBQUMzRSxpQkFBTztRQUFBO0FBRVQsZ0JBQVEsTUFBTTtNQUFBO0lBQUE7SUFJbEIsV0FBVyxJQUFHO0FBQ1osVUFBSSxRQUFRLEdBQUc7QUFDZixhQUFNLE9BQU07QUFDVixZQUFHLEtBQUssYUFBYSxLQUFBLEtBQVUsS0FBSyxXQUFXLEtBQUEsR0FBTztBQUNwRCxpQkFBTztRQUFBO0FBRVQsZ0JBQVEsTUFBTTtNQUFBO0lBQUE7SUFJbEIsVUFBVSxJQUFHO0FBQ1gsVUFBSSxRQUFRLEdBQUc7QUFDZixhQUFNLE9BQU07QUFDVixZQUFHLEtBQUssYUFBYSxLQUFBLEtBQVUsS0FBSyxVQUFVLEtBQUEsR0FBTztBQUNuRCxpQkFBTztRQUFBO0FBRVQsZ0JBQVEsTUFBTTtNQUFBO0lBQUE7RUFBQTtBQUlwQixNQUFPLGVBQVE7QUNoRGYsTUFBSSxRQUFRO0lBQ1YsZ0JBQWdCO01BQ2QsYUFBWTtBQUFFLGVBQU8sS0FBSyxHQUFHLGFBQWEscUJBQUE7TUFBQTtNQUUxQyxrQkFBaUI7QUFBRSxlQUFPLEtBQUssR0FBRyxhQUFhLG9CQUFBO01BQUE7TUFFL0MsVUFBUztBQUFFLGFBQUssaUJBQWlCLEtBQUssZ0JBQUE7TUFBQTtNQUV0QyxVQUFTO0FBQ1AsWUFBSSxnQkFBZ0IsS0FBSyxnQkFBQTtBQUN6QixZQUFHLEtBQUssbUJBQW1CLGVBQWM7QUFDdkMsZUFBSyxpQkFBaUI7QUFDdEIsY0FBRyxrQkFBa0IsSUFBRztBQUN0QixpQkFBSyxPQUFPLGFBQWEsS0FBSyxHQUFHLElBQUE7VUFBQTtRQUFBO0FBSXJDLFlBQUcsS0FBSyxXQUFBLE1BQWlCLElBQUc7QUFBRSxlQUFLLEdBQUcsUUFBUTtRQUFBO0FBQzlDLGFBQUssR0FBRyxjQUFjLElBQUksWUFBWSxxQkFBQSxDQUFBO01BQUE7SUFBQTtJQUkxQyxnQkFBZ0I7TUFDZCxVQUFTO0FBQ1AsYUFBSyxNQUFNLEtBQUssR0FBRyxhQUFhLG9CQUFBO0FBQ2hDLGFBQUssVUFBVSxTQUFTLGVBQWUsS0FBSyxHQUFHLGFBQWEsY0FBQSxDQUFBO0FBQzVELHFCQUFhLGdCQUFnQixLQUFLLFNBQVMsS0FBSyxLQUFLLENBQUEsUUFBTztBQUMxRCxlQUFLLE1BQU07QUFDWCxlQUFLLEdBQUcsTUFBTTtRQUFBLENBQUE7TUFBQTtNQUdsQixZQUFXO0FBQ1QsWUFBSSxnQkFBZ0IsS0FBSyxHQUFBO01BQUE7SUFBQTtJQUc3QixXQUFXO01BQ1QsVUFBUztBQUNQLGFBQUssYUFBYSxLQUFLLEdBQUc7QUFDMUIsYUFBSyxXQUFXLEtBQUssR0FBRztBQUN4QixhQUFLLFdBQVcsaUJBQWlCLFNBQVMsTUFBTSxhQUFLLFVBQVUsS0FBSyxFQUFBLENBQUE7QUFDcEUsYUFBSyxTQUFTLGlCQUFpQixTQUFTLE1BQU0sYUFBSyxXQUFXLEtBQUssRUFBQSxDQUFBO0FBQ25FLGFBQUssR0FBRyxpQkFBaUIsZ0JBQWdCLE1BQU0sS0FBSyxHQUFHLE1BQUEsQ0FBQTtBQUN2RCxZQUFHLE9BQU8saUJBQWlCLEtBQUssRUFBQSxFQUFJLFlBQVksUUFBTztBQUNyRCx1QkFBSyxXQUFXLEtBQUssRUFBQTtRQUFBO01BQUE7SUFBQTtFQUFBO0FBTTdCLE1BQU8sZ0JBQVE7QUNyRGYsTUFBQSx1QkFBQSxNQUEwQztJQUN4QyxZQUFZLGlCQUFpQixnQkFBZ0IsWUFBVztBQUN0RCxVQUFJLFlBQVksb0JBQUksSUFBQTtBQUNwQixVQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsR0FBRyxlQUFlLFFBQUEsRUFBVSxJQUFJLENBQUEsVUFBUyxNQUFNLEVBQUEsQ0FBQTtBQUV2RSxVQUFJLG1CQUFtQixDQUFBO0FBRXZCLFlBQU0sS0FBSyxnQkFBZ0IsUUFBQSxFQUFVLFFBQVEsQ0FBQSxVQUFTO0FBQ3BELFlBQUcsTUFBTSxJQUFHO0FBQ1Ysb0JBQVUsSUFBSSxNQUFNLEVBQUE7QUFDcEIsY0FBRyxTQUFTLElBQUksTUFBTSxFQUFBLEdBQUk7QUFDeEIsZ0JBQUksb0JBQW9CLE1BQU0sMEJBQTBCLE1BQU0sdUJBQXVCO0FBQ3JGLDZCQUFpQixLQUFLLEVBQUMsV0FBVyxNQUFNLElBQUksa0JBQUEsQ0FBQTtVQUFBO1FBQUE7TUFBQSxDQUFBO0FBS2xELFdBQUssY0FBYyxlQUFlO0FBQ2xDLFdBQUssYUFBYTtBQUNsQixXQUFLLG1CQUFtQjtBQUN4QixXQUFLLGtCQUFrQixDQUFDLEdBQUcsUUFBQSxFQUFVLE9BQU8sQ0FBQSxPQUFNLENBQUMsVUFBVSxJQUFJLEVBQUEsQ0FBQTtJQUFBO0lBU25FLFVBQVM7QUFDUCxVQUFJLFlBQVksWUFBSSxLQUFLLEtBQUssV0FBQTtBQUM5QixXQUFLLGlCQUFpQixRQUFRLENBQUEsb0JBQW1CO0FBQy9DLFlBQUcsZ0JBQWdCLG1CQUFrQjtBQUNuQyxnQkFBTSxTQUFTLGVBQWUsZ0JBQWdCLGlCQUFBLEdBQW9CLENBQUEsaUJBQWdCO0FBQ2hGLGtCQUFNLFNBQVMsZUFBZSxnQkFBZ0IsU0FBQSxHQUFZLENBQUEsU0FBUTtBQUNoRSxrQkFBSSxpQkFBaUIsS0FBSywwQkFBMEIsS0FBSyx1QkFBdUIsTUFBTSxhQUFhO0FBQ25HLGtCQUFHLENBQUMsZ0JBQWU7QUFDakIsNkJBQWEsc0JBQXNCLFlBQVksSUFBQTtjQUFBO1lBQUEsQ0FBQTtVQUFBLENBQUE7UUFBQSxPQUloRDtBQUVMLGdCQUFNLFNBQVMsZUFBZSxnQkFBZ0IsU0FBQSxHQUFZLENBQUEsU0FBUTtBQUNoRSxnQkFBSSxpQkFBaUIsS0FBSywwQkFBMEI7QUFDcEQsZ0JBQUcsQ0FBQyxnQkFBZTtBQUNqQix3QkFBVSxzQkFBc0IsY0FBYyxJQUFBO1lBQUE7VUFBQSxDQUFBO1FBQUE7TUFBQSxDQUFBO0FBTXRELFVBQUcsS0FBSyxjQUFjLFdBQVU7QUFDOUIsYUFBSyxnQkFBZ0IsUUFBQSxFQUFVLFFBQVEsQ0FBQSxXQUFVO0FBQy9DLGdCQUFNLFNBQVMsZUFBZSxNQUFBLEdBQVMsQ0FBQSxTQUFRLFVBQVUsc0JBQXNCLGNBQWMsSUFBQSxDQUFBO1FBQUEsQ0FBQTtNQUFBO0lBQUE7RUFBQTtBQzVEckcsTUFBSSx5QkFBeUI7QUFFN0Isc0JBQW9CLFVBQVUsUUFBUTtBQUNsQyxRQUFJLGNBQWMsT0FBTztBQUN6QixRQUFJO0FBQ0osUUFBSTtBQUNKLFFBQUk7QUFDSixRQUFJO0FBQ0osUUFBSTtBQUdKLFFBQUksT0FBTyxhQUFhLDBCQUEwQixTQUFTLGFBQWEsd0JBQXdCO0FBQzlGO0lBQUE7QUFJRixhQUFTLElBQUksWUFBWSxTQUFTLEdBQUcsS0FBSyxHQUFHLEtBQUs7QUFDOUMsYUFBTyxZQUFZO0FBQ25CLGlCQUFXLEtBQUs7QUFDaEIseUJBQW1CLEtBQUs7QUFDeEIsa0JBQVksS0FBSztBQUVqQixVQUFJLGtCQUFrQjtBQUNsQixtQkFBVyxLQUFLLGFBQWE7QUFDN0Isb0JBQVksU0FBUyxlQUFlLGtCQUFrQixRQUFBO0FBRXRELFlBQUksY0FBYyxXQUFXO0FBQ3pCLGNBQUksS0FBSyxXQUFXLFNBQVE7QUFDeEIsdUJBQVcsS0FBSztVQUFBO0FBRXBCLG1CQUFTLGVBQWUsa0JBQWtCLFVBQVUsU0FBQTtRQUFBO01BQUEsT0FFckQ7QUFDSCxvQkFBWSxTQUFTLGFBQWEsUUFBQTtBQUVsQyxZQUFJLGNBQWMsV0FBVztBQUN6QixtQkFBUyxhQUFhLFVBQVUsU0FBQTtRQUFBO01BQUE7SUFBQTtBQU81QyxRQUFJLGdCQUFnQixTQUFTO0FBRTdCLGFBQVMsS0FBSSxjQUFjLFNBQVMsR0FBRyxNQUFLLEdBQUcsTUFBSztBQUNoRCxhQUFPLGNBQWM7QUFDckIsaUJBQVcsS0FBSztBQUNoQix5QkFBbUIsS0FBSztBQUV4QixVQUFJLGtCQUFrQjtBQUNsQixtQkFBVyxLQUFLLGFBQWE7QUFFN0IsWUFBSSxDQUFDLE9BQU8sZUFBZSxrQkFBa0IsUUFBQSxHQUFXO0FBQ3BELG1CQUFTLGtCQUFrQixrQkFBa0IsUUFBQTtRQUFBO01BQUEsT0FFOUM7QUFDSCxZQUFJLENBQUMsT0FBTyxhQUFhLFFBQUEsR0FBVztBQUNoQyxtQkFBUyxnQkFBZ0IsUUFBQTtRQUFBO01BQUE7SUFBQTtFQUFBO0FBTXpDLE1BQUk7QUFDSixNQUFJLFdBQVc7QUFFZixNQUFJLE1BQU0sT0FBTyxhQUFhLGNBQWMsU0FBWTtBQUN4RCxNQUFJLHVCQUF1QixDQUFDLENBQUMsT0FBTyxhQUFhLElBQUksY0FBYyxVQUFBO0FBQ25FLE1BQUksb0JBQW9CLENBQUMsQ0FBQyxPQUFPLElBQUksZUFBZSw4QkFBOEIsSUFBSSxZQUFBO0FBRXRGLHNDQUFvQyxLQUFLO0FBQ3JDLFFBQUksV0FBVyxJQUFJLGNBQWMsVUFBQTtBQUNqQyxhQUFTLFlBQVk7QUFDckIsV0FBTyxTQUFTLFFBQVEsV0FBVztFQUFBO0FBR3ZDLG1DQUFpQyxLQUFLO0FBQ2xDLFFBQUksQ0FBQyxPQUFPO0FBQ1IsY0FBUSxJQUFJLFlBQUE7QUFDWixZQUFNLFdBQVcsSUFBSSxJQUFBO0lBQUE7QUFHekIsUUFBSSxXQUFXLE1BQU0seUJBQXlCLEdBQUE7QUFDOUMsV0FBTyxTQUFTLFdBQVc7RUFBQTtBQUcvQixrQ0FBZ0MsS0FBSztBQUNqQyxRQUFJLFdBQVcsSUFBSSxjQUFjLE1BQUE7QUFDakMsYUFBUyxZQUFZO0FBQ3JCLFdBQU8sU0FBUyxXQUFXO0VBQUE7QUFXL0IscUJBQW1CLEtBQUs7QUFDcEIsVUFBTSxJQUFJLEtBQUE7QUFDVixRQUFJLHNCQUFzQjtBQUl4QixhQUFPLDJCQUEyQixHQUFBO0lBQUEsV0FDekIsbUJBQW1CO0FBQzVCLGFBQU8sd0JBQXdCLEdBQUE7SUFBQTtBQUdqQyxXQUFPLHVCQUF1QixHQUFBO0VBQUE7QUFhbEMsNEJBQTBCLFFBQVEsTUFBTTtBQUNwQyxRQUFJLGVBQWUsT0FBTztBQUMxQixRQUFJLGFBQWEsS0FBSztBQUN0QixRQUFJLGVBQWU7QUFFbkIsUUFBSSxpQkFBaUIsWUFBWTtBQUM3QixhQUFPO0lBQUE7QUFHWCxvQkFBZ0IsYUFBYSxXQUFXLENBQUE7QUFDeEMsa0JBQWMsV0FBVyxXQUFXLENBQUE7QUFNcEMsUUFBSSxpQkFBaUIsTUFBTSxlQUFlLElBQUk7QUFDMUMsYUFBTyxpQkFBaUIsV0FBVyxZQUFBO0lBQUEsV0FDNUIsZUFBZSxNQUFNLGlCQUFpQixJQUFJO0FBQ2pELGFBQU8sZUFBZSxhQUFhLFlBQUE7SUFBQSxPQUNoQztBQUNILGFBQU87SUFBQTtFQUFBO0FBYWYsMkJBQXlCLE1BQU0sY0FBYztBQUN6QyxXQUFPLENBQUMsZ0JBQWdCLGlCQUFpQixXQUNyQyxJQUFJLGNBQWMsSUFBQSxJQUNsQixJQUFJLGdCQUFnQixjQUFjLElBQUE7RUFBQTtBQU0xQyx3QkFBc0IsUUFBUSxNQUFNO0FBQ2hDLFFBQUksV0FBVyxPQUFPO0FBQ3RCLFdBQU8sVUFBVTtBQUNiLFVBQUksWUFBWSxTQUFTO0FBQ3pCLFdBQUssWUFBWSxRQUFBO0FBQ2pCLGlCQUFXO0lBQUE7QUFFZixXQUFPO0VBQUE7QUFHWCwrQkFBNkIsUUFBUSxNQUFNLE1BQU07QUFDN0MsUUFBSSxPQUFPLFVBQVUsS0FBSyxPQUFPO0FBQzdCLGFBQU8sUUFBUSxLQUFLO0FBQ3BCLFVBQUksT0FBTyxPQUFPO0FBQ2QsZUFBTyxhQUFhLE1BQU0sRUFBQTtNQUFBLE9BQ3ZCO0FBQ0gsZUFBTyxnQkFBZ0IsSUFBQTtNQUFBO0lBQUE7RUFBQTtBQUtuQyxNQUFJLG9CQUFvQjtJQUNwQixRQUFRLFNBQVMsUUFBUSxNQUFNO0FBQzNCLFVBQUksYUFBYSxPQUFPO0FBQ3hCLFVBQUksWUFBWTtBQUNaLFlBQUksYUFBYSxXQUFXLFNBQVMsWUFBQTtBQUNyQyxZQUFJLGVBQWUsWUFBWTtBQUMzQix1QkFBYSxXQUFXO0FBQ3hCLHVCQUFhLGNBQWMsV0FBVyxTQUFTLFlBQUE7UUFBQTtBQUVuRCxZQUFJLGVBQWUsWUFBWSxDQUFDLFdBQVcsYUFBYSxVQUFBLEdBQWE7QUFDakUsY0FBSSxPQUFPLGFBQWEsVUFBQSxLQUFlLENBQUMsS0FBSyxVQUFVO0FBSW5ELG1CQUFPLGFBQWEsWUFBWSxVQUFBO0FBQ2hDLG1CQUFPLGdCQUFnQixVQUFBO1VBQUE7QUFLM0IscUJBQVcsZ0JBQWdCO1FBQUE7TUFBQTtBQUduQywwQkFBb0IsUUFBUSxNQUFNLFVBQUE7SUFBQTtJQVF0QyxPQUFPLFNBQVMsUUFBUSxNQUFNO0FBQzFCLDBCQUFvQixRQUFRLE1BQU0sU0FBQTtBQUNsQywwQkFBb0IsUUFBUSxNQUFNLFVBQUE7QUFFbEMsVUFBSSxPQUFPLFVBQVUsS0FBSyxPQUFPO0FBQzdCLGVBQU8sUUFBUSxLQUFLO01BQUE7QUFHeEIsVUFBSSxDQUFDLEtBQUssYUFBYSxPQUFBLEdBQVU7QUFDN0IsZUFBTyxnQkFBZ0IsT0FBQTtNQUFBO0lBQUE7SUFJL0IsVUFBVSxTQUFTLFFBQVEsTUFBTTtBQUM3QixVQUFJLFdBQVcsS0FBSztBQUNwQixVQUFJLE9BQU8sVUFBVSxVQUFVO0FBQzNCLGVBQU8sUUFBUTtNQUFBO0FBR25CLFVBQUksY0FBYSxPQUFPO0FBQ3hCLFVBQUksYUFBWTtBQUdaLFlBQUksV0FBVyxZQUFXO0FBRTFCLFlBQUksWUFBWSxZQUFhLENBQUMsWUFBWSxZQUFZLE9BQU8sYUFBYztBQUN2RTtRQUFBO0FBR0osb0JBQVcsWUFBWTtNQUFBO0lBQUE7SUFHL0IsUUFBUSxTQUFTLFFBQVEsTUFBTTtBQUMzQixVQUFJLENBQUMsS0FBSyxhQUFhLFVBQUEsR0FBYTtBQUNoQyxZQUFJLGdCQUFnQjtBQUNwQixZQUFJLElBQUk7QUFLUixZQUFJLFdBQVcsT0FBTztBQUN0QixZQUFJO0FBQ0osWUFBSTtBQUNKLGVBQU0sVUFBVTtBQUNaLHFCQUFXLFNBQVMsWUFBWSxTQUFTLFNBQVMsWUFBQTtBQUNsRCxjQUFJLGFBQWEsWUFBWTtBQUN6Qix1QkFBVztBQUNYLHVCQUFXLFNBQVM7VUFBQSxPQUNqQjtBQUNILGdCQUFJLGFBQWEsVUFBVTtBQUN2QixrQkFBSSxTQUFTLGFBQWEsVUFBQSxHQUFhO0FBQ25DLGdDQUFnQjtBQUNoQjtjQUFBO0FBRUo7WUFBQTtBQUVKLHVCQUFXLFNBQVM7QUFDcEIsZ0JBQUksQ0FBQyxZQUFZLFVBQVU7QUFDdkIseUJBQVcsU0FBUztBQUNwQix5QkFBVztZQUFBO1VBQUE7UUFBQTtBQUt2QixlQUFPLGdCQUFnQjtNQUFBO0lBQUE7RUFBQTtBQUtuQyxNQUFJLGVBQWU7QUFDbkIsTUFBSSwyQkFBMkI7QUFDL0IsTUFBSSxZQUFZO0FBQ2hCLE1BQUksZUFBZTtBQUVuQixrQkFBZ0I7RUFBQTtBQUVoQiw2QkFBMkIsTUFBTTtBQUMvQixRQUFJLE1BQU07QUFDTixhQUFRLEtBQUssZ0JBQWdCLEtBQUssYUFBYSxJQUFBLEtBQVUsS0FBSztJQUFBO0VBQUE7QUFJcEUsMkJBQXlCLGFBQVk7QUFFakMsV0FBTyxtQkFBa0IsVUFBVSxRQUFRLFNBQVM7QUFDaEQsVUFBSSxDQUFDLFNBQVM7QUFDVixrQkFBVSxDQUFBO01BQUE7QUFHZCxVQUFJLE9BQU8sV0FBVyxVQUFVO0FBQzVCLFlBQUksU0FBUyxhQUFhLGVBQWUsU0FBUyxhQUFhLFVBQVUsU0FBUyxhQUFhLFFBQVE7QUFDbkcsY0FBSSxhQUFhO0FBQ2pCLG1CQUFTLElBQUksY0FBYyxNQUFBO0FBQzNCLGlCQUFPLFlBQVk7UUFBQSxPQUNoQjtBQUNILG1CQUFTLFVBQVUsTUFBQTtRQUFBO01BQUE7QUFJM0IsVUFBSSxhQUFhLFFBQVEsY0FBYztBQUN2QyxVQUFJLG9CQUFvQixRQUFRLHFCQUFxQjtBQUNyRCxVQUFJLGNBQWMsUUFBUSxlQUFlO0FBQ3pDLFVBQUksb0JBQW9CLFFBQVEscUJBQXFCO0FBQ3JELFVBQUksY0FBYyxRQUFRLGVBQWU7QUFDekMsVUFBSSx3QkFBd0IsUUFBUSx5QkFBeUI7QUFDN0QsVUFBSSxrQkFBa0IsUUFBUSxtQkFBbUI7QUFDakQsVUFBSSw0QkFBNEIsUUFBUSw2QkFBNkI7QUFDckUsVUFBSSxlQUFlLFFBQVEsaUJBQWlCO0FBRzVDLFVBQUksa0JBQWtCLHVCQUFPLE9BQU8sSUFBQTtBQUNwQyxVQUFJLG1CQUFtQixDQUFBO0FBRXZCLCtCQUF5QixLQUFLO0FBQzFCLHlCQUFpQixLQUFLLEdBQUE7TUFBQTtBQUcxQix1Q0FBaUMsTUFBTSxnQkFBZ0I7QUFDbkQsWUFBSSxLQUFLLGFBQWEsY0FBYztBQUNoQyxjQUFJLFdBQVcsS0FBSztBQUNwQixpQkFBTyxVQUFVO0FBRWIsZ0JBQUksTUFBTTtBQUVWLGdCQUFJLGtCQUFtQixPQUFNLFdBQVcsUUFBQSxJQUFZO0FBR2hELDhCQUFnQixHQUFBO1lBQUEsT0FDYjtBQUlILDhCQUFnQixRQUFBO0FBQ2hCLGtCQUFJLFNBQVMsWUFBWTtBQUNyQix3Q0FBd0IsVUFBVSxjQUFBO2NBQUE7WUFBQTtBQUkxQyx1QkFBVyxTQUFTO1VBQUE7UUFBQTtNQUFBO0FBYWhDLDBCQUFvQixNQUFNLFlBQVksZ0JBQWdCO0FBQ2xELFlBQUksc0JBQXNCLElBQUEsTUFBVSxPQUFPO0FBQ3ZDO1FBQUE7QUFHSixZQUFJLFlBQVk7QUFDWixxQkFBVyxZQUFZLElBQUE7UUFBQTtBQUczQix3QkFBZ0IsSUFBQTtBQUNoQixnQ0FBd0IsTUFBTSxjQUFBO01BQUE7QUErQmxDLHlCQUFtQixNQUFNO0FBQ3JCLFlBQUksS0FBSyxhQUFhLGdCQUFnQixLQUFLLGFBQWEsMEJBQTBCO0FBQzlFLGNBQUksV0FBVyxLQUFLO0FBQ3BCLGlCQUFPLFVBQVU7QUFDYixnQkFBSSxNQUFNLFdBQVcsUUFBQTtBQUNyQixnQkFBSSxLQUFLO0FBQ0wsOEJBQWdCLE9BQU87WUFBQTtBQUkzQixzQkFBVSxRQUFBO0FBRVYsdUJBQVcsU0FBUztVQUFBO1FBQUE7TUFBQTtBQUtoQyxnQkFBVSxRQUFBO0FBRVYsK0JBQXlCLElBQUk7QUFDekIsb0JBQVksRUFBQTtBQUVaLFlBQUksV0FBVyxHQUFHO0FBQ2xCLGVBQU8sVUFBVTtBQUNiLGNBQUksY0FBYyxTQUFTO0FBRTNCLGNBQUksTUFBTSxXQUFXLFFBQUE7QUFDckIsY0FBSSxLQUFLO0FBQ0wsZ0JBQUksa0JBQWtCLGdCQUFnQjtBQUd0QyxnQkFBSSxtQkFBbUIsaUJBQWlCLFVBQVUsZUFBQSxHQUFrQjtBQUNoRSx1QkFBUyxXQUFXLGFBQWEsaUJBQWlCLFFBQUE7QUFDbEQsc0JBQVEsaUJBQWlCLFFBQUE7WUFBQSxPQUN0QjtBQUNMLDhCQUFnQixRQUFBO1lBQUE7VUFBQSxPQUVmO0FBR0wsNEJBQWdCLFFBQUE7VUFBQTtBQUdsQixxQkFBVztRQUFBO01BQUE7QUFJbkIsNkJBQXVCLFFBQVEsa0JBQWtCLGdCQUFnQjtBQUk3RCxlQUFPLGtCQUFrQjtBQUNyQixjQUFJLGtCQUFrQixpQkFBaUI7QUFDdkMsY0FBSyxpQkFBaUIsV0FBVyxnQkFBQSxHQUFvQjtBQUdqRCw0QkFBZ0IsY0FBQTtVQUFBLE9BQ2I7QUFHSCx1QkFBVyxrQkFBa0IsUUFBUSxJQUFBO1VBQUE7QUFFekMsNkJBQW1CO1FBQUE7TUFBQTtBQUkzQix1QkFBaUIsUUFBUSxNQUFNLGVBQWM7QUFDekMsWUFBSSxVQUFVLFdBQVcsSUFBQTtBQUV6QixZQUFJLFNBQVM7QUFHVCxpQkFBTyxnQkFBZ0I7UUFBQTtBQUczQixZQUFJLENBQUMsZUFBYztBQUVmLGNBQUksa0JBQWtCLFFBQVEsSUFBQSxNQUFVLE9BQU87QUFDM0M7VUFBQTtBQUlKLHNCQUFXLFFBQVEsSUFBQTtBQUVuQixzQkFBWSxNQUFBO0FBRVosY0FBSSwwQkFBMEIsUUFBUSxJQUFBLE1BQVUsT0FBTztBQUNuRDtVQUFBO1FBQUE7QUFJUixZQUFJLE9BQU8sYUFBYSxZQUFZO0FBQ2xDLHdCQUFjLFFBQVEsSUFBQTtRQUFBLE9BQ2pCO0FBQ0wsNEJBQWtCLFNBQVMsUUFBUSxJQUFBO1FBQUE7TUFBQTtBQUl6Qyw2QkFBdUIsUUFBUSxNQUFNO0FBQ2pDLFlBQUksaUJBQWlCLEtBQUs7QUFDMUIsWUFBSSxtQkFBbUIsT0FBTztBQUM5QixZQUFJO0FBQ0osWUFBSTtBQUVKLFlBQUk7QUFDSixZQUFJO0FBQ0osWUFBSTtBQUdKO0FBQU8saUJBQU8sZ0JBQWdCO0FBQzFCLDRCQUFnQixlQUFlO0FBQy9CLDJCQUFlLFdBQVcsY0FBQTtBQUcxQixtQkFBTyxrQkFBa0I7QUFDckIsZ0NBQWtCLGlCQUFpQjtBQUVuQyxrQkFBSSxlQUFlLGNBQWMsZUFBZSxXQUFXLGdCQUFBLEdBQW1CO0FBQzFFLGlDQUFpQjtBQUNqQixtQ0FBbUI7QUFDbkI7Y0FBQTtBQUdKLCtCQUFpQixXQUFXLGdCQUFBO0FBRTVCLGtCQUFJLGtCQUFrQixpQkFBaUI7QUFHdkMsa0JBQUksZUFBZTtBQUVuQixrQkFBSSxvQkFBb0IsZUFBZSxVQUFVO0FBQzdDLG9CQUFJLG9CQUFvQixjQUFjO0FBR2xDLHNCQUFJLGNBQWM7QUFHZCx3QkFBSSxpQkFBaUIsZ0JBQWdCO0FBSWpDLDBCQUFLLGlCQUFpQixnQkFBZ0IsZUFBZ0I7QUFDbEQsNEJBQUksb0JBQW9CLGdCQUFnQjtBQU1wQyx5Q0FBZTt3QkFBQSxPQUNaO0FBUUgsaUNBQU8sYUFBYSxnQkFBZ0IsZ0JBQUE7QUFJcEMsOEJBQUksZ0JBQWdCO0FBR2hCLDRDQUFnQixjQUFBOzBCQUFBLE9BQ2I7QUFHSCx1Q0FBVyxrQkFBa0IsUUFBUSxJQUFBOzBCQUFBO0FBR3pDLDZDQUFtQjt3QkFBQTtzQkFBQSxPQUVwQjtBQUdILHVDQUFlO3NCQUFBO29CQUFBO2tCQUFBLFdBR2hCLGdCQUFnQjtBQUV2QixtQ0FBZTtrQkFBQTtBQUduQixpQ0FBZSxpQkFBaUIsU0FBUyxpQkFBaUIsa0JBQWtCLGNBQUE7QUFDNUUsc0JBQUksY0FBYztBQUtkLDRCQUFRLGtCQUFrQixjQUFBO2tCQUFBO2dCQUFBLFdBR3ZCLG9CQUFvQixhQUFhLG1CQUFtQixjQUFjO0FBRXpFLGlDQUFlO0FBR2Ysc0JBQUksaUJBQWlCLGNBQWMsZUFBZSxXQUFXO0FBQ3pELHFDQUFpQixZQUFZLGVBQWU7a0JBQUE7Z0JBQUE7Y0FBQTtBQU14RCxrQkFBSSxjQUFjO0FBR2QsaUNBQWlCO0FBQ2pCLG1DQUFtQjtBQUNuQjtjQUFBO0FBU0osa0JBQUksZ0JBQWdCO0FBR2hCLGdDQUFnQixjQUFBO2NBQUEsT0FDYjtBQUdILDJCQUFXLGtCQUFrQixRQUFRLElBQUE7Y0FBQTtBQUd6QyxpQ0FBbUI7WUFBQTtBQU92QixnQkFBSSxnQkFBaUIsa0JBQWlCLGdCQUFnQixrQkFBa0IsaUJBQWlCLGdCQUFnQixjQUFBLEdBQWlCO0FBQ3RILHFCQUFPLFlBQVksY0FBQTtBQUVuQixzQkFBUSxnQkFBZ0IsY0FBQTtZQUFBLE9BQ3JCO0FBQ0gsa0JBQUksMEJBQTBCLGtCQUFrQixjQUFBO0FBQ2hELGtCQUFJLDRCQUE0QixPQUFPO0FBQ25DLG9CQUFJLHlCQUF5QjtBQUN6QixtQ0FBaUI7Z0JBQUE7QUFHckIsb0JBQUksZUFBZSxXQUFXO0FBQzFCLG1DQUFpQixlQUFlLFVBQVUsT0FBTyxpQkFBaUIsR0FBQTtnQkFBQTtBQUV0RSx1QkFBTyxZQUFZLGNBQUE7QUFDbkIsZ0NBQWdCLGNBQUE7Y0FBQTtZQUFBO0FBSXhCLDZCQUFpQjtBQUNqQiwrQkFBbUI7VUFBQTtBQUd2QixzQkFBYyxRQUFRLGtCQUFrQixjQUFBO0FBRXhDLFlBQUksbUJBQW1CLGtCQUFrQixPQUFPO0FBQ2hELFlBQUksa0JBQWtCO0FBQ2xCLDJCQUFpQixRQUFRLElBQUE7UUFBQTtNQUFBO0FBSWpDLFVBQUksY0FBYztBQUNsQixVQUFJLGtCQUFrQixZQUFZO0FBQ2xDLFVBQUksYUFBYSxPQUFPO0FBRXhCLFVBQUksQ0FBQyxjQUFjO0FBR2YsWUFBSSxvQkFBb0IsY0FBYztBQUNsQyxjQUFJLGVBQWUsY0FBYztBQUM3QixnQkFBSSxDQUFDLGlCQUFpQixVQUFVLE1BQUEsR0FBUztBQUNyQyw4QkFBZ0IsUUFBQTtBQUNoQiw0QkFBYyxhQUFhLFVBQVUsZ0JBQWdCLE9BQU8sVUFBVSxPQUFPLFlBQUEsQ0FBQTtZQUFBO1VBQUEsT0FFOUU7QUFFSCwwQkFBYztVQUFBO1FBQUEsV0FFWCxvQkFBb0IsYUFBYSxvQkFBb0IsY0FBYztBQUMxRSxjQUFJLGVBQWUsaUJBQWlCO0FBQ2hDLGdCQUFJLFlBQVksY0FBYyxPQUFPLFdBQVc7QUFDNUMsMEJBQVksWUFBWSxPQUFPO1lBQUE7QUFHbkMsbUJBQU87VUFBQSxPQUNKO0FBRUgsMEJBQWM7VUFBQTtRQUFBO01BQUE7QUFLMUIsVUFBSSxnQkFBZ0IsUUFBUTtBQUd4Qix3QkFBZ0IsUUFBQTtNQUFBLE9BQ2I7QUFDSCxZQUFJLE9BQU8sY0FBYyxPQUFPLFdBQVcsV0FBQSxHQUFjO0FBQ3JEO1FBQUE7QUFHSixnQkFBUSxhQUFhLFFBQVEsWUFBQTtBQU83QixZQUFJLGtCQUFrQjtBQUNsQixtQkFBUyxJQUFFLEdBQUcsTUFBSSxpQkFBaUIsUUFBUSxJQUFFLEtBQUssS0FBSztBQUNuRCxnQkFBSSxhQUFhLGdCQUFnQixpQkFBaUI7QUFDbEQsZ0JBQUksWUFBWTtBQUNaLHlCQUFXLFlBQVksV0FBVyxZQUFZLEtBQUE7WUFBQTtVQUFBO1FBQUE7TUFBQTtBQU05RCxVQUFJLENBQUMsZ0JBQWdCLGdCQUFnQixZQUFZLFNBQVMsWUFBWTtBQUNsRSxZQUFJLFlBQVksV0FBVztBQUN2Qix3QkFBYyxZQUFZLFVBQVUsU0FBUyxpQkFBaUIsR0FBQTtRQUFBO0FBT2xFLGlCQUFTLFdBQVcsYUFBYSxhQUFhLFFBQUE7TUFBQTtBQUdsRCxhQUFPO0lBQUE7RUFBQTtBQUlmLE1BQUksV0FBVyxnQkFBZ0IsVUFBQTtBQUUvQixNQUFPLHVCQUFRO0FDNXRCZixNQUFBLFdBQUEsTUFBOEI7SUFBQSxPQUNyQixRQUFRLFFBQVEsTUFBTSxlQUFjO0FBQ3pDLDJCQUFTLFFBQVEsTUFBTTtRQUNyQixjQUFjO1FBQ2QsbUJBQW1CLENBQUMsU0FBUSxVQUFTO0FBQ25DLGNBQUcsaUJBQWlCLGNBQWMsV0FBVyxPQUFBLEtBQVcsWUFBSSxZQUFZLE9BQUEsR0FBUTtBQUM5RSx3QkFBSSxrQkFBa0IsU0FBUSxLQUFBO0FBQzlCLG1CQUFPO1VBQUE7UUFBQTtNQUFBLENBQUE7SUFBQTtJQU1mLFlBQVksTUFBTSxXQUFXLElBQUksTUFBTSxXQUFVO0FBQy9DLFdBQUssT0FBTztBQUNaLFdBQUssYUFBYSxLQUFLO0FBQ3ZCLFdBQUssWUFBWTtBQUNqQixXQUFLLEtBQUs7QUFDVixXQUFLLFNBQVMsS0FBSyxLQUFLO0FBQ3hCLFdBQUssT0FBTztBQUNaLFdBQUssWUFBWTtBQUNqQixXQUFLLFdBQVcsTUFBTSxLQUFLLFNBQUE7QUFDM0IsV0FBSyxZQUFZO1FBQ2YsYUFBYSxDQUFBO1FBQUksZUFBZSxDQUFBO1FBQUkscUJBQXFCLENBQUE7UUFDekQsWUFBWSxDQUFBO1FBQUksY0FBYyxDQUFBO1FBQUksZ0JBQWdCLENBQUE7UUFBSSxvQkFBb0IsQ0FBQTtRQUMxRSwyQkFBMkIsQ0FBQTtNQUFBO0lBQUE7SUFJL0IsT0FBTyxNQUFNLFVBQVM7QUFBRSxXQUFLLFVBQVUsU0FBUyxRQUFRLEtBQUssUUFBQTtJQUFBO0lBQzdELE1BQU0sTUFBTSxVQUFTO0FBQUUsV0FBSyxVQUFVLFFBQVEsUUFBUSxLQUFLLFFBQUE7SUFBQTtJQUUzRCxZQUFZLFNBQVMsTUFBSztBQUN4QixXQUFLLFVBQVUsU0FBUyxRQUFRLFFBQVEsQ0FBQSxhQUFZLFNBQVMsR0FBRyxJQUFBLENBQUE7SUFBQTtJQUdsRSxXQUFXLFNBQVMsTUFBSztBQUN2QixXQUFLLFVBQVUsUUFBUSxRQUFRLFFBQVEsQ0FBQSxhQUFZLFNBQVMsR0FBRyxJQUFBLENBQUE7SUFBQTtJQUdqRSxnQ0FBK0I7QUFDN0Isa0JBQUksSUFBSSxLQUFLLFdBQVcscURBQXFELENBQUEsT0FBTTtBQUNqRixXQUFHLGFBQWEsV0FBVyxFQUFBO01BQUEsQ0FBQTtJQUFBO0lBSS9CLFVBQVM7QUFDUCxVQUFJLEVBQUMsTUFBTSx5QkFBWSxXQUFXLFNBQVE7QUFDMUMsVUFBSSxrQkFBa0IsS0FBSyxXQUFBLElBQWUsS0FBSyxtQkFBbUIsSUFBQSxJQUFRO0FBQzFFLFVBQUcsS0FBSyxXQUFBLEtBQWdCLENBQUMsaUJBQWdCO0FBQUU7TUFBQTtBQUUzQyxVQUFJLFVBQVUsWUFBVyxpQkFBQTtBQUN6QixVQUFJLEVBQUMsZ0JBQWdCLGlCQUFnQixXQUFXLFlBQUksa0JBQWtCLE9BQUEsSUFBVyxVQUFVLENBQUE7QUFDM0YsVUFBSSxZQUFZLFlBQVcsUUFBUSxVQUFBO0FBQ25DLFVBQUksaUJBQWlCLFlBQVcsUUFBUSxnQkFBQTtBQUN4QyxVQUFJLGNBQWMsWUFBVyxRQUFRLGdCQUFBO0FBQ3JDLFVBQUkscUJBQXFCLFlBQVcsUUFBUSxrQkFBQTtBQUM1QyxVQUFJLFlBQVksWUFBVyxRQUFRLFFBQUE7QUFDbkMsVUFBSSxRQUFRLENBQUE7QUFDWixVQUFJLFVBQVUsQ0FBQTtBQUNkLFVBQUksdUJBQXVCLENBQUE7QUFDM0IsVUFBSSxpQkFBaUIsQ0FBQTtBQUNyQixVQUFJLHdCQUF3QjtBQUU1QixVQUFJLFdBQVcsWUFBVyxLQUFLLDJCQUEyQixNQUFNO0FBQzlELGVBQU8sS0FBSyxjQUFjLFdBQVcsTUFBTSxXQUFXLGVBQUE7TUFBQSxDQUFBO0FBR3hELFdBQUssWUFBWSxTQUFTLFNBQUE7QUFDMUIsV0FBSyxZQUFZLFdBQVcsV0FBVyxTQUFBO0FBRXZDLGtCQUFXLEtBQUssWUFBWSxNQUFNO0FBQ2hDLDZCQUFTLGlCQUFpQixVQUFVO1VBQ2xDLGNBQWMsZ0JBQWdCLGFBQWEsYUFBQSxNQUFtQjtVQUM5RCxZQUFZLENBQUMsU0FBUztBQUNwQixtQkFBTyxZQUFJLGVBQWUsSUFBQSxJQUFRLE9BQU8sS0FBSztVQUFBO1VBRWhELG1CQUFtQixDQUFDLE9BQU87QUFDekIsaUJBQUssWUFBWSxTQUFTLEVBQUE7QUFDMUIsbUJBQU87VUFBQTtVQUVULGFBQWEsQ0FBQyxPQUFPO0FBRW5CLGdCQUFHLGNBQWMsb0JBQW9CLEdBQUcsUUFBTztBQUM3QyxpQkFBRyxTQUFTLEdBQUc7WUFBQSxXQUNQLGNBQWMsb0JBQW9CLEdBQUcsVUFBUztBQUN0RCxpQkFBRyxLQUFBO1lBQUE7QUFFTCxnQkFBRyxZQUFJLHlCQUF5QixJQUFJLGtCQUFBLEdBQW9CO0FBQ3RELHNDQUF3QjtZQUFBO0FBRzFCLHdCQUFJLGFBQWEsaUJBQWlCLElBQUksY0FBQTtBQUV0QyxnQkFBSSxZQUFJLFdBQVcsRUFBQSxLQUFPLEtBQUssWUFBWSxFQUFBLEtBQVEsWUFBSSxZQUFZLEVBQUEsS0FBTyxLQUFLLFlBQVksR0FBRyxVQUFBLEdBQVk7QUFDeEcsbUJBQUssV0FBVyxpQkFBaUIsRUFBQTtZQUFBO0FBRW5DLGtCQUFNLEtBQUssRUFBQTtVQUFBO1VBRWIsaUJBQWlCLENBQUMsT0FBTztBQUV2QixnQkFBRyxZQUFJLFdBQVcsRUFBQSxLQUFPLFlBQUksWUFBWSxFQUFBLEdBQUk7QUFBRSwwQkFBVyxnQkFBZ0IsRUFBQTtZQUFBO0FBQzFFLGlCQUFLLFdBQVcsYUFBYSxFQUFBO1VBQUE7VUFFL0IsdUJBQXVCLENBQUMsT0FBTztBQUM3QixnQkFBRyxHQUFHLGdCQUFnQixHQUFHLGFBQWEsU0FBQSxNQUFlLE1BQUs7QUFBRSxxQkFBTztZQUFBO0FBQ25FLGdCQUFHLEdBQUcsZUFBZSxRQUFRLFlBQUksWUFBWSxHQUFHLFlBQVksV0FBVyxDQUFDLFVBQVUsU0FBQSxDQUFBLEtBQWUsR0FBRyxJQUFHO0FBQUUscUJBQU87WUFBQTtBQUNoSCxnQkFBRyxHQUFHLGdCQUFnQixHQUFHLGFBQWEsU0FBQSxHQUFXO0FBQy9DLDZCQUFlLEtBQUssRUFBQTtBQUNwQixxQkFBTztZQUFBO0FBRVQsZ0JBQUcsS0FBSyxlQUFlLEVBQUEsR0FBSTtBQUFFLHFCQUFPO1lBQUE7QUFDcEMsbUJBQU87VUFBQTtVQUVULGFBQWEsQ0FBQyxPQUFPO0FBQ25CLGdCQUFHLFlBQUkseUJBQXlCLElBQUksa0JBQUEsR0FBb0I7QUFDdEQsc0NBQXdCO1lBQUE7QUFFMUIsb0JBQVEsS0FBSyxFQUFBO1VBQUE7VUFFZixtQkFBbUIsQ0FBQyxRQUFRLFNBQVM7QUFDbkMsd0JBQUksZ0JBQWdCLE1BQU0sU0FBQTtBQUMxQixnQkFBRyxLQUFLLGVBQWUsSUFBQSxHQUFNO0FBQUUscUJBQU87WUFBQTtBQUN0QyxnQkFBRyxZQUFJLFlBQVksTUFBQSxHQUFRO0FBQUUscUJBQU87WUFBQTtBQUNwQyxnQkFBRyxZQUFJLFVBQVUsUUFBUSxTQUFBLEtBQWUsT0FBTyxRQUFRLE9BQU8sS0FBSyxXQUFXLHFCQUFBLEdBQXdCO0FBQ3BHLG1CQUFLLFlBQVksV0FBVyxRQUFRLElBQUE7QUFDcEMsMEJBQUksV0FBVyxRQUFRLE1BQU0sRUFBQyxXQUFXLEtBQUEsQ0FBQTtBQUN6QyxzQkFBUSxLQUFLLE1BQUE7QUFDYiwwQkFBSSxzQkFBc0IsTUFBQTtBQUMxQixxQkFBTztZQUFBO0FBRVQsZ0JBQUcsT0FBTyxTQUFTLFlBQWEsUUFBTyxZQUFZLE9BQU8sU0FBUyxXQUFVO0FBQUUscUJBQU87WUFBQTtBQUN0RixnQkFBRyxDQUFDLFlBQUksZUFBZSxRQUFRLE1BQU0sV0FBQSxHQUFhO0FBQ2hELGtCQUFHLFlBQUksY0FBYyxNQUFBLEdBQVE7QUFDM0IscUJBQUssWUFBWSxXQUFXLFFBQVEsSUFBQTtBQUNwQyx3QkFBUSxLQUFLLE1BQUE7Y0FBQTtBQUVmLDBCQUFJLHNCQUFzQixNQUFBO0FBQzFCLHFCQUFPO1lBQUE7QUFJVCxnQkFBRyxZQUFJLFdBQVcsSUFBQSxHQUFNO0FBQ3RCLGtCQUFJLGNBQWMsT0FBTyxhQUFhLFdBQUE7QUFDdEMsMEJBQUksV0FBVyxRQUFRLE1BQU0sRUFBQyxTQUFTLENBQUMsVUFBQSxFQUFBLENBQUE7QUFDeEMsa0JBQUcsZ0JBQWdCLElBQUc7QUFBRSx1QkFBTyxhQUFhLGFBQWEsV0FBQTtjQUFBO0FBQ3pELHFCQUFPLGFBQWEsYUFBYSxLQUFLLE1BQUE7QUFDdEMsMEJBQUksc0JBQXNCLE1BQUE7QUFDMUIscUJBQU87WUFBQTtBQUlULHdCQUFJLGFBQWEsTUFBTSxNQUFBO0FBQ3ZCLHdCQUFJLGFBQWEsaUJBQWlCLE1BQU0sY0FBQTtBQUV4QyxnQkFBSSxrQkFBa0IsV0FBVyxPQUFPLFdBQVcsT0FBQSxLQUFZLFlBQUksWUFBWSxNQUFBO0FBQy9FLGdCQUFHLGlCQUFnQjtBQUNqQixtQkFBSyxZQUFZLFdBQVcsUUFBUSxJQUFBO0FBQ3BDLDBCQUFJLGtCQUFrQixRQUFRLElBQUE7QUFDOUIsMEJBQUksaUJBQWlCLE1BQUE7QUFDckIsc0JBQVEsS0FBSyxNQUFBO0FBQ2IsMEJBQUksc0JBQXNCLE1BQUE7QUFDMUIscUJBQU87WUFBQSxPQUNGO0FBQ0wsa0JBQUcsWUFBSSxZQUFZLE1BQU0sV0FBVyxDQUFDLFVBQVUsU0FBQSxDQUFBLEdBQVk7QUFDekQscUNBQXFCLEtBQUssSUFBSSxxQkFBcUIsUUFBUSxNQUFNLEtBQUssYUFBYSxTQUFBLENBQUEsQ0FBQTtjQUFBO0FBRXJGLDBCQUFJLGlCQUFpQixJQUFBO0FBQ3JCLDBCQUFJLHNCQUFzQixJQUFBO0FBQzFCLG1CQUFLLFlBQVksV0FBVyxRQUFRLElBQUE7QUFDcEMscUJBQU87WUFBQTtVQUFBO1FBQUEsQ0FBQTtNQUFBLENBQUE7QUFNZixVQUFHLFlBQVcsZUFBQSxHQUFpQjtBQUFFLDJCQUFBO01BQUE7QUFFakMsVUFBRyxxQkFBcUIsU0FBUyxHQUFFO0FBQ2pDLG9CQUFXLEtBQUsseUNBQXlDLE1BQU07QUFDN0QsK0JBQXFCLFFBQVEsQ0FBQSxXQUFVLE9BQU8sUUFBQSxDQUFBO1FBQUEsQ0FBQTtNQUFBO0FBSWxELGtCQUFXLGNBQWMsTUFBTSxZQUFJLGFBQWEsU0FBUyxnQkFBZ0IsWUFBQSxDQUFBO0FBQ3pFLGtCQUFJLGNBQWMsVUFBVSxZQUFBO0FBQzVCLFlBQU0sUUFBUSxDQUFBLE9BQU0sS0FBSyxXQUFXLFNBQVMsRUFBQSxDQUFBO0FBQzdDLGNBQVEsUUFBUSxDQUFBLE9BQU0sS0FBSyxXQUFXLFdBQVcsRUFBQSxDQUFBO0FBRWpELFVBQUcsZUFBZSxTQUFTLEdBQUU7QUFDM0Isb0JBQVcsa0JBQWtCLGNBQUE7QUFDN0Isb0JBQVcsaUJBQWlCLE1BQU07QUFDaEMseUJBQWUsUUFBUSxDQUFBLE9BQU07QUFDM0IsZ0JBQUksUUFBUSxZQUFJLGNBQWMsRUFBQTtBQUM5QixnQkFBRyxPQUFNO0FBQUUsMEJBQVcsZ0JBQWdCLEtBQUE7WUFBQTtBQUN0QyxlQUFHLE9BQUE7VUFBQSxDQUFBO0FBRUwsZUFBSyxXQUFXLHdCQUF3QixjQUFBO1FBQUEsQ0FBQTtNQUFBO0FBSTVDLFVBQUcsdUJBQXNCO0FBQ3ZCLG9CQUFXLFdBQUE7QUFDWCw4QkFBc0IsT0FBQTtNQUFBO0FBRXhCLGFBQU87SUFBQTtJQUdULGFBQVk7QUFBRSxhQUFPLEtBQUs7SUFBQTtJQUUxQixlQUFlLElBQUc7QUFDaEIsYUFBTyxHQUFHLGFBQWEsS0FBSyxnQkFBZ0IsR0FBRyxhQUFhLFFBQUEsTUFBYztJQUFBO0lBRzVFLG1CQUFtQixNQUFLO0FBQ3RCLFVBQUcsQ0FBQyxLQUFLLFdBQUEsR0FBYTtBQUFFO01BQUE7QUFDeEIsVUFBSSxDQUFDLFVBQVUsUUFBUSxZQUFJLHNCQUFzQixLQUFLLFdBQVcsS0FBSyxTQUFBO0FBQ3RFLFVBQUcsS0FBSyxXQUFXLEtBQUssWUFBSSxnQkFBZ0IsSUFBQSxNQUFVLEdBQUU7QUFDdEQsZUFBTztNQUFBLE9BQ0Y7QUFDTCxlQUFPLFNBQVMsTUFBTTtNQUFBO0lBQUE7SUFVMUIsY0FBYyxXQUFXLE1BQU0sV0FBVyxpQkFBZ0I7QUFDeEQsVUFBSSxhQUFhLEtBQUssV0FBQTtBQUN0QixVQUFJLHNCQUFzQixjQUFjLGdCQUFnQixhQUFhLGFBQUEsTUFBbUIsS0FBSyxVQUFVLFNBQUE7QUFDdkcsVUFBRyxDQUFDLGNBQWMscUJBQW9CO0FBQ3BDLGVBQU87TUFBQSxPQUNGO0FBRUwsWUFBSSxnQkFBZ0I7QUFDcEIsWUFBSSxXQUFXLFNBQVMsY0FBYyxVQUFBO0FBQ3RDLHdCQUFnQixZQUFJLFVBQVUsZUFBQTtBQUM5QixZQUFJLENBQUMsbUJBQW1CLFFBQVEsWUFBSSxzQkFBc0IsZUFBZSxLQUFLLFNBQUE7QUFDOUUsaUJBQVMsWUFBWTtBQUNyQixhQUFLLFFBQVEsQ0FBQSxPQUFNLEdBQUcsT0FBQSxDQUFBO0FBQ3RCLGNBQU0sS0FBSyxjQUFjLFVBQUEsRUFBWSxRQUFRLENBQUEsVUFBUztBQUVwRCxjQUFHLE1BQU0sTUFBTSxNQUFNLGFBQWEsS0FBSyxnQkFBZ0IsTUFBTSxhQUFhLGFBQUEsTUFBbUIsS0FBSyxVQUFVLFNBQUEsR0FBVztBQUNySCxrQkFBTSxhQUFhLFVBQVUsRUFBQTtBQUM3QixrQkFBTSxZQUFZO1VBQUE7UUFBQSxDQUFBO0FBR3RCLGNBQU0sS0FBSyxTQUFTLFFBQVEsVUFBQSxFQUFZLFFBQVEsQ0FBQSxPQUFNLGNBQWMsYUFBYSxJQUFJLGNBQUEsQ0FBQTtBQUNyRix1QkFBZSxPQUFBO0FBQ2YsZUFBTyxjQUFjO01BQUE7SUFBQTtFQUFBO0FDaFEzQixNQUFBLFdBQUEsTUFBOEI7SUFBQSxPQUNyQixRQUFRLE1BQUs7QUFDbEIsVUFBSSxHQUFFLFFBQVEsUUFBUSxTQUFTLFNBQVMsUUFBUSxVQUFTO0FBQ3pELGFBQU8sS0FBSztBQUNaLGFBQU8sS0FBSztBQUNaLGFBQU8sS0FBSztBQUNaLGFBQU8sRUFBQyxNQUFNLE9BQU8sT0FBTyxTQUFTLE1BQU0sUUFBUSxVQUFVLENBQUEsRUFBQTtJQUFBO0lBRy9ELFlBQVksUUFBUSxVQUFTO0FBQzNCLFdBQUssU0FBUztBQUNkLFdBQUssV0FBVyxDQUFBO0FBQ2hCLFdBQUssVUFBVSxRQUFBO0lBQUE7SUFHakIsZUFBYztBQUFFLGFBQU8sS0FBSztJQUFBO0lBRTVCLFNBQVMsVUFBUztBQUNoQixhQUFPLEtBQUssa0JBQWtCLEtBQUssVUFBVSxLQUFLLFNBQVMsYUFBYSxRQUFBO0lBQUE7SUFHMUUsa0JBQWtCLFVBQVUsYUFBYSxTQUFTLGFBQWEsVUFBUztBQUN0RSxpQkFBVyxXQUFXLElBQUksSUFBSSxRQUFBLElBQVk7QUFDMUMsVUFBSSxTQUFTLEVBQUMsUUFBUSxJQUFJLFlBQXdCLFNBQUE7QUFDbEQsV0FBSyxlQUFlLFVBQVUsTUFBTSxNQUFBO0FBQ3BDLGFBQU8sT0FBTztJQUFBO0lBR2hCLGNBQWMsTUFBSztBQUFFLGFBQU8sT0FBTyxLQUFLLEtBQUssZUFBZSxDQUFBLENBQUEsRUFBSSxJQUFJLENBQUEsTUFBSyxTQUFTLENBQUEsQ0FBQTtJQUFBO0lBRWxGLG9CQUFvQixNQUFLO0FBQ3ZCLFVBQUcsQ0FBQyxLQUFLLGFBQVk7QUFBRSxlQUFPO01BQUE7QUFDOUIsYUFBTyxPQUFPLEtBQUssSUFBQSxFQUFNLFdBQVc7SUFBQTtJQUd0QyxhQUFhLE1BQU0sS0FBSTtBQUFFLGFBQU8sS0FBSyxZQUFZO0lBQUE7SUFFakQsVUFBVSxNQUFLO0FBQ2IsVUFBSSxPQUFPLEtBQUs7QUFDaEIsVUFBSSxRQUFRLENBQUE7QUFDWixhQUFPLEtBQUs7QUFDWixXQUFLLFdBQVcsS0FBSyxhQUFhLEtBQUssVUFBVSxJQUFBO0FBQ2pELFdBQUssU0FBUyxjQUFjLEtBQUssU0FBUyxlQUFlLENBQUE7QUFFekQsVUFBRyxNQUFLO0FBQ04sWUFBSSxPQUFPLEtBQUssU0FBUztBQUV6QixpQkFBUSxPQUFPLE1BQUs7QUFDbEIsZUFBSyxPQUFPLEtBQUssb0JBQW9CLEtBQUssS0FBSyxNQUFNLE1BQU0sTUFBTSxLQUFBO1FBQUE7QUFHbkUsaUJBQVEsT0FBTyxNQUFLO0FBQUUsZUFBSyxPQUFPLEtBQUs7UUFBQTtBQUN2QyxhQUFLLGNBQWM7TUFBQTtJQUFBO0lBSXZCLG9CQUFvQixLQUFLLE9BQU8sTUFBTSxNQUFNLE9BQU07QUFDaEQsVUFBRyxNQUFNLE1BQUs7QUFDWixlQUFPLE1BQU07TUFBQSxPQUNSO0FBQ0wsWUFBSSxPQUFPLE1BQU0sT0FBTyxNQUFNO0FBRTlCLFlBQUcsTUFBTSxJQUFBLEdBQU07QUFDYixjQUFJO0FBRUosY0FBRyxPQUFPLEdBQUU7QUFDVixvQkFBUSxLQUFLLG9CQUFvQixNQUFNLEtBQUssT0FBTyxNQUFNLE1BQU0sS0FBQTtVQUFBLE9BQzFEO0FBQ0wsb0JBQVEsS0FBSyxDQUFDO1VBQUE7QUFHaEIsaUJBQU8sTUFBTTtBQUNiLGtCQUFRLEtBQUssV0FBVyxPQUFPLEtBQUE7QUFDL0IsZ0JBQU0sVUFBVTtRQUFBLE9BQ1g7QUFDTCxrQkFBUSxNQUFNLFlBQVksU0FBWSxRQUFRLEtBQUssV0FBVyxLQUFLLFFBQVEsQ0FBQSxHQUFJLEtBQUE7UUFBQTtBQUdqRixjQUFNLE9BQU87QUFDYixlQUFPO01BQUE7SUFBQTtJQUlYLGFBQWEsUUFBUSxRQUFPO0FBQzFCLFVBQUcsT0FBTyxZQUFZLFFBQVU7QUFDOUIsZUFBTztNQUFBLE9BQ0Y7QUFDTCxhQUFLLGVBQWUsUUFBUSxNQUFBO0FBQzVCLGVBQU87TUFBQTtJQUFBO0lBSVgsZUFBZSxRQUFRLFFBQU87QUFDNUIsZUFBUSxPQUFPLFFBQU87QUFDcEIsWUFBSSxNQUFNLE9BQU87QUFDakIsWUFBSSxZQUFZLE9BQU87QUFDdkIsWUFBRyxTQUFTLEdBQUEsS0FBUSxJQUFJLFlBQVksVUFBYSxTQUFTLFNBQUEsR0FBVztBQUNuRSxlQUFLLGVBQWUsV0FBVyxHQUFBO1FBQUEsT0FDMUI7QUFDTCxpQkFBTyxPQUFPO1FBQUE7TUFBQTtJQUFBO0lBS3BCLFdBQVcsUUFBUSxRQUFPO0FBQ3hCLFVBQUksU0FBUyxFQUFBLEdBQUksUUFBQSxHQUFXLE9BQUE7QUFDNUIsZUFBUSxPQUFPLFFBQU87QUFDcEIsWUFBSSxNQUFNLE9BQU87QUFDakIsWUFBSSxZQUFZLE9BQU87QUFDdkIsWUFBRyxTQUFTLEdBQUEsS0FBUSxJQUFJLFlBQVksVUFBYSxTQUFTLFNBQUEsR0FBVztBQUNuRSxpQkFBTyxPQUFPLEtBQUssV0FBVyxXQUFXLEdBQUE7UUFBQTtNQUFBO0FBRzdDLGFBQU87SUFBQTtJQUdULGtCQUFrQixLQUFJO0FBQUUsYUFBTyxLQUFLLHFCQUFxQixLQUFLLFNBQVMsYUFBYSxHQUFBO0lBQUE7SUFFcEYsVUFBVSxNQUFLO0FBQ2IsV0FBSyxRQUFRLENBQUEsUUFBTyxPQUFPLEtBQUssU0FBUyxZQUFZLElBQUE7SUFBQTtJQUt2RCxNQUFLO0FBQUUsYUFBTyxLQUFLO0lBQUE7SUFFbkIsaUJBQWlCLE9BQU8sQ0FBQSxHQUFHO0FBQUUsYUFBTyxDQUFDLENBQUMsS0FBSztJQUFBO0lBRTNDLGVBQWUsTUFBTSxXQUFVO0FBQzdCLFVBQUcsT0FBUSxTQUFVLFVBQVU7QUFDN0IsZUFBTyxVQUFVO01BQUEsT0FDWjtBQUNMLGVBQU87TUFBQTtJQUFBO0lBSVgsZUFBZSxVQUFVLFdBQVcsUUFBTztBQUN6QyxVQUFHLFNBQVMsV0FBVTtBQUFFLGVBQU8sS0FBSyxzQkFBc0IsVUFBVSxXQUFXLE1BQUE7TUFBQTtBQUMvRSxVQUFJLEdBQUUsU0FBUyxZQUFXO0FBQzFCLGdCQUFVLEtBQUssZUFBZSxTQUFTLFNBQUE7QUFFdkMsYUFBTyxVQUFVLFFBQVE7QUFDekIsZUFBUSxJQUFJLEdBQUcsSUFBSSxRQUFRLFFBQVEsS0FBSTtBQUNyQyxhQUFLLGdCQUFnQixTQUFTLElBQUksSUFBSSxXQUFXLE1BQUE7QUFDakQsZUFBTyxVQUFVLFFBQVE7TUFBQTtJQUFBO0lBSTdCLHNCQUFzQixVQUFVLFdBQVcsUUFBTztBQUNoRCxVQUFJLEdBQUUsV0FBVyxXQUFXLFNBQVMsWUFBVztBQUNoRCxnQkFBVSxLQUFLLGVBQWUsU0FBUyxTQUFBO0FBQ3ZDLFVBQUksZ0JBQWdCLGFBQWEsU0FBUztBQUUxQyxlQUFRLEtBQUksR0FBRyxLQUFJLFNBQVMsUUFBUSxNQUFJO0FBQ3RDLFlBQUksVUFBVSxTQUFTO0FBQ3ZCLGVBQU8sVUFBVSxRQUFRO0FBQ3pCLGlCQUFRLElBQUksR0FBRyxJQUFJLFFBQVEsUUFBUSxLQUFJO0FBQ3JDLGVBQUssZ0JBQWdCLFFBQVEsSUFBSSxJQUFJLGVBQWUsTUFBQTtBQUNwRCxpQkFBTyxVQUFVLFFBQVE7UUFBQTtNQUFBO0lBQUE7SUFLL0IsZ0JBQWdCLFVBQVUsV0FBVyxRQUFPO0FBQzFDLFVBQUcsT0FBUSxhQUFjLFVBQVM7QUFDaEMsZUFBTyxVQUFVLEtBQUsscUJBQXFCLE9BQU8sWUFBWSxVQUFVLE9BQU8sUUFBQTtNQUFBLFdBQ3ZFLFNBQVMsUUFBQSxHQUFVO0FBQzNCLGFBQUssZUFBZSxVQUFVLFdBQVcsTUFBQTtNQUFBLE9BQ3BDO0FBQ0wsZUFBTyxVQUFVO01BQUE7SUFBQTtJQUlyQixxQkFBcUIsWUFBWSxLQUFLLFVBQVM7QUFDN0MsVUFBSSxZQUFZLFdBQVcsUUFBUSxTQUFTLHdCQUF3QixPQUFPLFVBQUE7QUFDM0UsVUFBSSxXQUFXLFNBQVMsY0FBYyxVQUFBO0FBQ3RDLGVBQVMsWUFBWSxLQUFLLGtCQUFrQixXQUFXLFlBQVksUUFBQTtBQUNuRSxVQUFJLFlBQVksU0FBUztBQUN6QixVQUFJLE9BQU8sWUFBWSxDQUFDLFNBQVMsSUFBSSxHQUFBO0FBRXJDLFVBQUksQ0FBQyxlQUFlLHNCQUNsQixNQUFNLEtBQUssVUFBVSxVQUFBLEVBQVksT0FBTyxDQUFDLENBQUMsVUFBVSxnQkFBZ0IsT0FBTyxNQUFNO0FBQy9FLFlBQUcsTUFBTSxhQUFhLEtBQUssY0FBYTtBQUN0QyxjQUFHLE1BQU0sYUFBYSxhQUFBLEdBQWU7QUFDbkMsbUJBQU8sQ0FBQyxVQUFVLElBQUE7VUFBQTtBQUVwQixnQkFBTSxhQUFhLGVBQWUsR0FBQTtBQUNsQyxjQUFHLENBQUMsTUFBTSxJQUFHO0FBQUUsa0JBQU0sS0FBSyxHQUFHLEtBQUssYUFBQSxLQUFrQixPQUFPO1VBQUE7QUFDM0QsY0FBRyxNQUFLO0FBQ04sa0JBQU0sYUFBYSxVQUFVLEVBQUE7QUFDN0Isa0JBQU0sWUFBWTtVQUFBO0FBRXBCLGlCQUFPLENBQUMsTUFBTSxhQUFBO1FBQUEsT0FDVDtBQUNMLGNBQUcsTUFBTSxVQUFVLEtBQUEsTUFBVyxJQUFHO0FBQy9CLHFCQUFTOztRQUNFLE1BQU0sVUFBVSxLQUFBOzs7R0FDWixTQUFTLFVBQVUsS0FBQSxDQUFBO0FBQ2xDLGtCQUFNLFlBQVksS0FBSyxXQUFXLE1BQU0sV0FBVyxHQUFBLENBQUE7QUFDbkQsbUJBQU8sQ0FBQyxNQUFNLGFBQUE7VUFBQSxPQUNUO0FBQ0wsa0JBQU0sT0FBQTtBQUNOLG1CQUFPLENBQUMsVUFBVSxhQUFBO1VBQUE7UUFBQTtNQUFBLEdBR3JCLENBQUMsT0FBTyxLQUFBLENBQUE7QUFFYixVQUFHLENBQUMsaUJBQWlCLENBQUMsb0JBQW1CO0FBQ3ZDLGlCQUFTLDRGQUNQLFNBQVMsVUFBVSxLQUFBLENBQUE7QUFDckIsZUFBTyxLQUFLLFdBQVcsSUFBSSxHQUFBLEVBQUs7TUFBQSxXQUN4QixDQUFDLGlCQUFpQixvQkFBbUI7QUFDN0MsaUJBQVMsZ0xBQ1AsU0FBUyxVQUFVLEtBQUEsQ0FBQTtBQUNyQixlQUFPLFNBQVM7TUFBQSxPQUNYO0FBQ0wsZUFBTyxTQUFTO01BQUE7SUFBQTtJQUlwQixXQUFXLE1BQU0sS0FBSTtBQUNuQixVQUFJLE9BQU8sU0FBUyxjQUFjLE1BQUE7QUFDbEMsV0FBSyxZQUFZO0FBQ2pCLFdBQUssYUFBYSxlQUFlLEdBQUE7QUFDakMsYUFBTztJQUFBO0VBQUE7QUNsUFgsTUFBSSxhQUFhO0FBQ2pCLE1BQUEsV0FBQSxNQUE4QjtJQUFBLE9BQ3JCLFNBQVE7QUFBRSxhQUFPO0lBQUE7SUFBQSxPQUNqQixVQUFVLElBQUc7QUFBRSxhQUFPLEdBQUc7SUFBQTtJQUVoQyxZQUFZLE1BQU0sSUFBSSxXQUFVO0FBQzlCLFdBQUssU0FBUztBQUNkLFdBQUssYUFBYSxLQUFLO0FBQ3ZCLFdBQUssY0FBYztBQUNuQixXQUFLLGNBQWMsb0JBQUksSUFBQTtBQUN2QixXQUFLLG1CQUFtQjtBQUN4QixXQUFLLEtBQUs7QUFDVixXQUFLLEdBQUcsWUFBWSxLQUFLLFlBQVksT0FBQTtBQUNyQyxlQUFRLE9BQU8sS0FBSyxhQUFZO0FBQUUsYUFBSyxPQUFPLEtBQUssWUFBWTtNQUFBO0lBQUE7SUFHakUsWUFBVztBQUFFLFdBQUssV0FBVyxLQUFLLFFBQUE7SUFBQTtJQUNsQyxZQUFXO0FBQUUsV0FBSyxXQUFXLEtBQUssUUFBQTtJQUFBO0lBQ2xDLGlCQUFnQjtBQUFFLFdBQUssZ0JBQWdCLEtBQUssYUFBQTtJQUFBO0lBQzVDLGNBQWE7QUFBRSxXQUFLLGFBQWEsS0FBSyxVQUFBO0lBQUE7SUFDdEMsZ0JBQWU7QUFDYixVQUFHLEtBQUssa0JBQWlCO0FBQ3ZCLGFBQUssbUJBQW1CO0FBQ3hCLGFBQUssZUFBZSxLQUFLLFlBQUE7TUFBQTtJQUFBO0lBRzdCLGlCQUFnQjtBQUNkLFdBQUssbUJBQW1CO0FBQ3hCLFdBQUssZ0JBQWdCLEtBQUssYUFBQTtJQUFBO0lBRzVCLFVBQVUsT0FBTyxVQUFVLENBQUEsR0FBSSxVQUFVLFdBQVc7SUFBQSxHQUFJO0FBQ3RELGFBQU8sS0FBSyxPQUFPLGNBQWMsTUFBTSxPQUFPLFNBQVMsT0FBQTtJQUFBO0lBR3pELFlBQVksV0FBVyxPQUFPLFVBQVUsQ0FBQSxHQUFJLFVBQVUsV0FBVztJQUFBLEdBQUk7QUFDbkUsYUFBTyxLQUFLLE9BQU8sY0FBYyxXQUFXLENBQUMsTUFBTSxjQUFjO0FBQy9ELGVBQU8sS0FBSyxjQUFjLFdBQVcsT0FBTyxTQUFTLE9BQUE7TUFBQSxDQUFBO0lBQUE7SUFJekQsWUFBWSxPQUFPLFVBQVM7QUFDMUIsVUFBSSxjQUFjLENBQUMsYUFBYSxXQUFXLFNBQVMsUUFBUSxTQUFTLFlBQVksTUFBQTtBQUNqRixhQUFPLGlCQUFpQixPQUFPLFNBQVMsV0FBQTtBQUN4QyxXQUFLLFlBQVksSUFBSSxXQUFBO0FBQ3JCLGFBQU87SUFBQTtJQUdULGtCQUFrQixhQUFZO0FBQzVCLFVBQUksUUFBUSxZQUFZLE1BQU0sSUFBQTtBQUM5QixhQUFPLG9CQUFvQixPQUFPLFNBQVMsV0FBQTtBQUMzQyxXQUFLLFlBQVksT0FBTyxXQUFBO0lBQUE7SUFHMUIsT0FBTyxNQUFNLE9BQU07QUFDakIsYUFBTyxLQUFLLE9BQU8sZ0JBQWdCLE1BQU0sS0FBQTtJQUFBO0lBRzNDLFNBQVMsV0FBVyxNQUFNLE9BQU07QUFDOUIsYUFBTyxLQUFLLE9BQU8sY0FBYyxXQUFXLENBQUEsU0FBUSxLQUFLLGdCQUFnQixNQUFNLEtBQUEsQ0FBQTtJQUFBO0lBR2pGLGNBQWE7QUFDWCxXQUFLLFlBQVksUUFBUSxDQUFBLGdCQUFlLEtBQUssa0JBQWtCLFdBQUEsQ0FBQTtJQUFBO0VBQUE7QUM1RG5FLE1BQUksYUFBYTtBQUVqQixNQUFJLEtBQUs7SUFDUCxLQUFLLFdBQVcsVUFBVSxNQUFNLFVBQVUsVUFBUztBQUNqRCxVQUFJLENBQUMsYUFBYSxlQUFlLFlBQVksQ0FBQyxNQUFNLENBQUEsQ0FBQTtBQUNwRCxVQUFJLFdBQVcsU0FBUyxPQUFPLENBQUEsTUFBTyxNQUNwQyxLQUFLLE1BQU0sUUFBQSxJQUFZLENBQUMsQ0FBQyxhQUFhLFdBQUEsQ0FBQTtBQUV4QyxlQUFTLFFBQVEsQ0FBQyxDQUFDLE1BQU0sVUFBVTtBQUNqQyxZQUFHLFNBQVMsZUFBZSxZQUFZLE1BQUs7QUFDMUMsZUFBSyxPQUFPLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQSxHQUFJLFlBQVksSUFBQTtRQUFBO0FBRXpELGFBQUssWUFBWSxVQUFVLElBQUEsRUFBTSxRQUFRLENBQUEsT0FBTTtBQUM3QyxlQUFLLFFBQVEsUUFBUSxXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksSUFBQTtRQUFBLENBQUE7TUFBQSxDQUFBO0lBQUE7SUFLcEUsVUFBVSxJQUFHO0FBQ1gsYUFBTyxDQUFDLENBQUUsSUFBRyxlQUFlLEdBQUcsZ0JBQWdCLEdBQUcsZUFBQSxFQUFpQixTQUFTO0lBQUE7SUFPOUUsY0FBYyxXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksRUFBQyxJQUFJLE9BQU8sUUFBUSxXQUFTO0FBQ2xGLGVBQVMsVUFBVSxDQUFBO0FBQ25CLGFBQU8sYUFBYTtBQUNwQixrQkFBSSxjQUFjLElBQUksT0FBTyxFQUFDLFFBQVEsUUFBQSxDQUFBO0lBQUE7SUFHeEMsVUFBVSxXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksTUFBSztBQUN0RCxVQUFHLENBQUMsS0FBSyxZQUFBLEdBQWM7QUFBRTtNQUFBO0FBRXpCLFVBQUksRUFBQyxPQUFPLE1BQU0sUUFBUSxjQUFjLFNBQVMsT0FBTyxlQUFjO0FBQ3RFLFVBQUksV0FBVyxFQUFDLFNBQVMsT0FBTyxRQUFRLGNBQWMsQ0FBQyxDQUFDLGFBQUE7QUFDeEQsVUFBSSxZQUFZLGNBQWMsWUFBWSxhQUFhLGFBQWE7QUFDcEUsVUFBSSxZQUFZLFVBQVUsVUFBVSxhQUFhLEtBQUssUUFBUSxRQUFBLENBQUEsS0FBYztBQUM1RSxXQUFLLGNBQWMsV0FBVyxDQUFDLFlBQVksY0FBYztBQUN2RCxZQUFHLGNBQWMsVUFBUztBQUN4QixjQUFJLEVBQUMsUUFBUSxTQUFTLGFBQVk7QUFDbEMsb0JBQVUsV0FBWSxxQkFBb0IsbUJBQW1CLFNBQVMsT0FBTztBQUM3RSxjQUFHLFNBQVE7QUFBRSxxQkFBUyxVQUFVO1VBQUE7QUFDaEMscUJBQVcsVUFBVSxVQUFVLFdBQVcsUUFBUSxTQUFTLFVBQVUsVUFBVSxRQUFBO1FBQUEsV0FDdkUsY0FBYyxVQUFTO0FBQy9CLHFCQUFXLFdBQVcsVUFBVSxXQUFXLFNBQVMsVUFBVSxRQUFBO1FBQUEsT0FDekQ7QUFDTCxxQkFBVyxVQUFVLFdBQVcsVUFBVSxXQUFXLFNBQVMsVUFBVSxNQUFNLFFBQUE7UUFBQTtNQUFBLENBQUE7SUFBQTtJQUtwRixjQUFjLFdBQVcsVUFBVSxNQUFNLFVBQVUsSUFBSSxFQUFDLE1BQU0sV0FBUztBQUNyRSxXQUFLLFdBQVcsZ0JBQWdCLE1BQU0sVUFBVSxZQUFZLE1BQUE7SUFBQTtJQUc5RCxXQUFXLFdBQVcsVUFBVSxNQUFNLFVBQVUsSUFBSSxFQUFDLE1BQU0sV0FBUztBQUNsRSxXQUFLLFdBQVcsaUJBQWlCLE1BQU0sVUFBVSxZQUFZLFFBQVEsUUFBQTtJQUFBO0lBR3ZFLFdBQVcsV0FBVyxVQUFVLE1BQU0sVUFBVSxJQUFHO0FBQ2pELGFBQU8sc0JBQXNCLE1BQU0sYUFBSyxhQUFhLEVBQUEsQ0FBQTtJQUFBO0lBR3ZELGlCQUFpQixXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUc7QUFDdkQsYUFBTyxzQkFBc0IsTUFBTSxhQUFLLHNCQUFzQixFQUFBLEtBQU8sYUFBSyxXQUFXLEVBQUEsQ0FBQTtJQUFBO0lBR3ZGLGdCQUFnQixXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUc7QUFDdEQsYUFBTyxzQkFBc0IsTUFBTSxhQUFhLE1BQU0sUUFBQTtJQUFBO0lBR3hELGVBQWUsV0FBVyxVQUFVLE1BQU0sVUFBVSxJQUFHO0FBQ3JELGFBQU8sc0JBQXNCLE1BQU07QUFDakMsWUFBRyxZQUFXO0FBQUUscUJBQVcsTUFBQTtRQUFBO0FBQzNCLHFCQUFhO01BQUEsQ0FBQTtJQUFBO0lBSWpCLGVBQWUsV0FBVyxVQUFVLE1BQU0sVUFBVSxJQUFJLEVBQUMsT0FBTyxZQUFZLFFBQU07QUFDaEYsV0FBSyxtQkFBbUIsSUFBSSxPQUFPLENBQUEsR0FBSSxZQUFZLE1BQU0sSUFBQTtJQUFBO0lBRzNELGtCQUFrQixXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksRUFBQyxPQUFPLFlBQVksUUFBTTtBQUNuRixXQUFLLG1CQUFtQixJQUFJLENBQUEsR0FBSSxPQUFPLFlBQVksTUFBTSxJQUFBO0lBQUE7SUFHM0QsZ0JBQWdCLFdBQVcsVUFBVSxNQUFNLFVBQVUsSUFBSSxFQUFDLE1BQU0sY0FBWTtBQUMxRSxVQUFJLENBQUMsa0JBQWtCLFNBQVMsa0JBQWtCO0FBQ2xELFVBQUksVUFBVSxNQUFNLEtBQUssbUJBQW1CLElBQUksaUJBQWlCLE9BQU8sT0FBQSxHQUFVLENBQUEsQ0FBQTtBQUNsRixVQUFJLFNBQVMsTUFBTSxLQUFLLG1CQUFtQixJQUFJLGdCQUFnQixpQkFBaUIsT0FBTyxPQUFBLENBQUE7QUFDdkYsV0FBSyxXQUFXLE1BQU0sU0FBUyxNQUFBO0lBQUE7SUFHakMsWUFBWSxXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksRUFBQyxTQUFTLEtBQUssTUFBTSxRQUFNO0FBQzlFLFdBQUssT0FBTyxXQUFXLE1BQU0sSUFBSSxTQUFTLEtBQUssTUFBTSxJQUFBO0lBQUE7SUFHdkQsVUFBVSxXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksRUFBQyxTQUFTLFlBQVksUUFBTTtBQUM3RSxXQUFLLEtBQUssV0FBVyxNQUFNLElBQUksU0FBUyxZQUFZLElBQUE7SUFBQTtJQUd0RCxVQUFVLFdBQVcsVUFBVSxNQUFNLFVBQVUsSUFBSSxFQUFDLFNBQVMsWUFBWSxRQUFNO0FBQzdFLFdBQUssS0FBSyxXQUFXLE1BQU0sSUFBSSxTQUFTLFlBQVksSUFBQTtJQUFBO0lBR3RELGNBQWMsV0FBVyxVQUFVLE1BQU0sVUFBVSxJQUFJLEVBQUMsTUFBTSxDQUFDLE1BQU0sUUFBTTtBQUN6RSxXQUFLLGlCQUFpQixJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUEsQ0FBQSxHQUFPLENBQUEsQ0FBQTtJQUFBO0lBRzNDLGlCQUFpQixXQUFXLFVBQVUsTUFBTSxVQUFVLElBQUksRUFBQyxRQUFNO0FBQy9ELFdBQUssaUJBQWlCLElBQUksQ0FBQSxHQUFJLENBQUMsSUFBQSxDQUFBO0lBQUE7SUFLakMsS0FBSyxXQUFXLE1BQU0sSUFBSSxTQUFTLFlBQVksTUFBSztBQUNsRCxVQUFHLENBQUMsS0FBSyxVQUFVLEVBQUEsR0FBSTtBQUNyQixhQUFLLE9BQU8sV0FBVyxNQUFNLElBQUksU0FBUyxZQUFZLE1BQU0sSUFBQTtNQUFBO0lBQUE7SUFJaEUsS0FBSyxXQUFXLE1BQU0sSUFBSSxTQUFTLFlBQVksTUFBSztBQUNsRCxVQUFHLEtBQUssVUFBVSxFQUFBLEdBQUk7QUFDcEIsYUFBSyxPQUFPLFdBQVcsTUFBTSxJQUFJLFNBQVMsTUFBTSxZQUFZLElBQUE7TUFBQTtJQUFBO0lBSWhFLE9BQU8sV0FBVyxNQUFNLElBQUksU0FBUyxLQUFLLE1BQU0sTUFBSztBQUNuRCxVQUFJLENBQUMsV0FBVyxnQkFBZ0IsZ0JBQWdCLE9BQU8sQ0FBQyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUEsQ0FBQTtBQUNoRSxVQUFJLENBQUMsWUFBWSxpQkFBaUIsaUJBQWlCLFFBQVEsQ0FBQyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUEsQ0FBQTtBQUNwRSxVQUFHLFVBQVUsU0FBUyxLQUFLLFdBQVcsU0FBUyxHQUFFO0FBQy9DLFlBQUcsS0FBSyxVQUFVLEVBQUEsR0FBSTtBQUNwQixjQUFJLFVBQVUsTUFBTTtBQUNsQixpQkFBSyxtQkFBbUIsSUFBSSxpQkFBaUIsVUFBVSxPQUFPLGNBQUEsRUFBZ0IsT0FBTyxZQUFBLENBQUE7QUFDckYsbUJBQU8sc0JBQXNCLE1BQU07QUFDakMsbUJBQUssbUJBQW1CLElBQUksWUFBWSxDQUFBLENBQUE7QUFDeEMscUJBQU8sc0JBQXNCLE1BQU0sS0FBSyxtQkFBbUIsSUFBSSxlQUFlLGVBQUEsQ0FBQTtZQUFBLENBQUE7VUFBQTtBQUdsRixhQUFHLGNBQWMsSUFBSSxNQUFNLGdCQUFBLENBQUE7QUFDM0IsZUFBSyxXQUFXLE1BQU0sU0FBUyxNQUFNO0FBQ25DLGlCQUFLLG1CQUFtQixJQUFJLENBQUEsR0FBSSxXQUFXLE9BQU8sYUFBQSxDQUFBO0FBQ2xELHdCQUFJLFVBQVUsSUFBSSxVQUFVLENBQUEsY0FBYSxVQUFVLE1BQU0sVUFBVSxNQUFBO0FBQ25FLGVBQUcsY0FBYyxJQUFJLE1BQU0sY0FBQSxDQUFBO1VBQUEsQ0FBQTtRQUFBLE9BRXhCO0FBQ0wsY0FBRyxjQUFjLFVBQVM7QUFBRTtVQUFBO0FBQzVCLGNBQUksVUFBVSxNQUFNO0FBQ2xCLGlCQUFLLG1CQUFtQixJQUFJLGdCQUFnQixXQUFXLE9BQU8sZUFBQSxFQUFpQixPQUFPLGFBQUEsQ0FBQTtBQUN0Rix3QkFBSSxVQUFVLElBQUksVUFBVSxDQUFBLGNBQWEsVUFBVSxNQUFNLFVBQVcsV0FBVyxPQUFBO0FBQy9FLG1CQUFPLHNCQUFzQixNQUFNO0FBQ2pDLG1CQUFLLG1CQUFtQixJQUFJLFdBQVcsQ0FBQSxDQUFBO0FBQ3ZDLHFCQUFPLHNCQUFzQixNQUFNLEtBQUssbUJBQW1CLElBQUksY0FBYyxjQUFBLENBQUE7WUFBQSxDQUFBO1VBQUE7QUFHakYsYUFBRyxjQUFjLElBQUksTUFBTSxnQkFBQSxDQUFBO0FBQzNCLGVBQUssV0FBVyxNQUFNLFNBQVMsTUFBTTtBQUNuQyxpQkFBSyxtQkFBbUIsSUFBSSxDQUFBLEdBQUksVUFBVSxPQUFPLFlBQUEsQ0FBQTtBQUNqRCxlQUFHLGNBQWMsSUFBSSxNQUFNLGNBQUEsQ0FBQTtVQUFBLENBQUE7UUFBQTtNQUFBLE9BRzFCO0FBQ0wsWUFBRyxLQUFLLFVBQVUsRUFBQSxHQUFJO0FBQ3BCLGlCQUFPLHNCQUFzQixNQUFNO0FBQ2pDLGVBQUcsY0FBYyxJQUFJLE1BQU0sZ0JBQUEsQ0FBQTtBQUMzQix3QkFBSSxVQUFVLElBQUksVUFBVSxDQUFBLGNBQWEsVUFBVSxNQUFNLFVBQVUsTUFBQTtBQUNuRSxlQUFHLGNBQWMsSUFBSSxNQUFNLGNBQUEsQ0FBQTtVQUFBLENBQUE7UUFBQSxPQUV4QjtBQUNMLGlCQUFPLHNCQUFzQixNQUFNO0FBQ2pDLGVBQUcsY0FBYyxJQUFJLE1BQU0sZ0JBQUEsQ0FBQTtBQUMzQix3QkFBSSxVQUFVLElBQUksVUFBVSxDQUFBLGNBQWEsVUFBVSxNQUFNLFVBQVUsV0FBVyxPQUFBO0FBQzlFLGVBQUcsY0FBYyxJQUFJLE1BQU0sY0FBQSxDQUFBO1VBQUEsQ0FBQTtRQUFBO01BQUE7SUFBQTtJQU1uQyxtQkFBbUIsSUFBSSxNQUFNLFNBQVMsWUFBWSxNQUFNLE1BQUs7QUFDM0QsVUFBSSxDQUFDLGdCQUFnQixrQkFBa0Isa0JBQWtCLGNBQWMsQ0FBQyxDQUFBLEdBQUksQ0FBQSxHQUFJLENBQUEsQ0FBQTtBQUNoRixVQUFHLGVBQWUsU0FBUyxHQUFFO0FBQzNCLFlBQUksVUFBVSxNQUFNLEtBQUssbUJBQW1CLElBQUksaUJBQWlCLE9BQU8sY0FBQSxHQUFpQixDQUFBLENBQUE7QUFDekYsWUFBSSxTQUFTLE1BQU0sS0FBSyxtQkFBbUIsSUFBSSxLQUFLLE9BQU8sY0FBQSxHQUFpQixRQUFRLE9BQU8sY0FBQSxFQUFnQixPQUFPLGdCQUFBLENBQUE7QUFDbEgsZUFBTyxLQUFLLFdBQVcsTUFBTSxTQUFTLE1BQUE7TUFBQTtBQUV4QyxhQUFPLHNCQUFzQixNQUFNO0FBQ2pDLFlBQUksQ0FBQyxVQUFVLGVBQWUsWUFBSSxVQUFVLElBQUksV0FBVyxDQUFDLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBQTtBQUNoRSxZQUFJLFdBQVcsS0FBSyxPQUFPLENBQUEsU0FBUSxTQUFTLFFBQVEsSUFBQSxJQUFRLEtBQUssQ0FBQyxHQUFHLFVBQVUsU0FBUyxJQUFBLENBQUE7QUFDeEYsWUFBSSxjQUFjLFFBQVEsT0FBTyxDQUFBLFNBQVEsWUFBWSxRQUFRLElBQUEsSUFBUSxLQUFLLEdBQUcsVUFBVSxTQUFTLElBQUEsQ0FBQTtBQUNoRyxZQUFJLFVBQVUsU0FBUyxPQUFPLENBQUEsU0FBUSxRQUFRLFFBQVEsSUFBQSxJQUFRLENBQUEsRUFBRyxPQUFPLFFBQUE7QUFDeEUsWUFBSSxhQUFhLFlBQVksT0FBTyxDQUFBLFNBQVEsS0FBSyxRQUFRLElBQUEsSUFBUSxDQUFBLEVBQUcsT0FBTyxXQUFBO0FBRTNFLG9CQUFJLFVBQVUsSUFBSSxXQUFXLENBQUEsY0FBYTtBQUN4QyxvQkFBVSxVQUFVLE9BQU8sR0FBRyxVQUFBO0FBQzlCLG9CQUFVLFVBQVUsSUFBSSxHQUFHLE9BQUE7QUFDM0IsaUJBQU8sQ0FBQyxTQUFTLFVBQUE7UUFBQSxDQUFBO01BQUEsQ0FBQTtJQUFBO0lBS3ZCLGlCQUFpQixJQUFJLE1BQU0sU0FBUTtBQUNqQyxVQUFJLENBQUMsVUFBVSxlQUFlLFlBQUksVUFBVSxJQUFJLFNBQVMsQ0FBQyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUE7QUFFOUQsVUFBSSxlQUFlLEtBQUssSUFBSSxDQUFDLENBQUMsTUFBTSxVQUFVLElBQUEsRUFBTSxPQUFPLE9BQUE7QUFDM0QsVUFBSSxVQUFVLFNBQVMsT0FBTyxDQUFDLENBQUMsTUFBTSxVQUFVLENBQUMsYUFBYSxTQUFTLElBQUEsQ0FBQSxFQUFPLE9BQU8sSUFBQTtBQUNyRixVQUFJLGFBQWEsWUFBWSxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsU0FBUyxJQUFBLENBQUEsRUFBTyxPQUFPLE9BQUE7QUFFbkYsa0JBQUksVUFBVSxJQUFJLFNBQVMsQ0FBQSxjQUFhO0FBQ3RDLG1CQUFXLFFBQVEsQ0FBQSxTQUFRLFVBQVUsZ0JBQWdCLElBQUEsQ0FBQTtBQUNyRCxnQkFBUSxRQUFRLENBQUMsQ0FBQyxNQUFNLFNBQVMsVUFBVSxhQUFhLE1BQU0sR0FBQSxDQUFBO0FBQzlELGVBQU8sQ0FBQyxTQUFTLFVBQUE7TUFBQSxDQUFBO0lBQUE7SUFJckIsY0FBYyxJQUFJLFNBQVE7QUFBRSxhQUFPLFFBQVEsTUFBTSxDQUFBLFNBQVEsR0FBRyxVQUFVLFNBQVMsSUFBQSxDQUFBO0lBQUE7SUFFL0UsYUFBYSxJQUFJLFlBQVc7QUFDMUIsYUFBTyxDQUFDLEtBQUssVUFBVSxFQUFBLEtBQU8sS0FBSyxjQUFjLElBQUksVUFBQTtJQUFBO0lBR3ZELFlBQVksVUFBVSxFQUFDLE1BQUk7QUFDekIsYUFBTyxLQUFLLFlBQUksSUFBSSxVQUFVLEVBQUEsSUFBTSxDQUFDLFFBQUE7SUFBQTtFQUFBO0FBSXpDLE1BQU8sYUFBUTtBQ2pMZixNQUFJLGdCQUFnQixDQUFDLE1BQU0sTUFBTSxZQUFZLENBQUEsTUFBTztBQUNsRCxRQUFJLFdBQVcsSUFBSSxTQUFTLElBQUE7QUFDNUIsUUFBSSxXQUFXLENBQUE7QUFFZixhQUFTLFFBQVEsQ0FBQyxLQUFLLEtBQUssV0FBVztBQUNyQyxVQUFHLGVBQWUsTUFBSztBQUFFLGlCQUFTLEtBQUssR0FBQTtNQUFBO0lBQUEsQ0FBQTtBQUl6QyxhQUFTLFFBQVEsQ0FBQSxRQUFPLFNBQVMsT0FBTyxHQUFBLENBQUE7QUFFeEMsUUFBSSxTQUFTLElBQUksZ0JBQUE7QUFDakIsYUFBUSxDQUFDLEtBQUssUUFBUSxTQUFTLFFBQUEsR0FBVTtBQUN2QyxVQUFHLFVBQVUsV0FBVyxLQUFLLFVBQVUsUUFBUSxHQUFBLEtBQVEsR0FBRTtBQUN2RCxlQUFPLE9BQU8sS0FBSyxHQUFBO01BQUE7SUFBQTtBQUd2QixhQUFRLFdBQVcsTUFBSztBQUFFLGFBQU8sT0FBTyxTQUFTLEtBQUssUUFBQTtJQUFBO0FBRXRELFdBQU8sT0FBTyxTQUFBO0VBQUE7QUFHaEIsTUFBQSxPQUFBLE1BQTBCO0lBQ3hCLFlBQVksSUFBSSxhQUFZLFlBQVksT0FBTyxhQUFZO0FBQ3pELFdBQUssU0FBUztBQUNkLFdBQUssYUFBYTtBQUNsQixXQUFLLFFBQVE7QUFDYixXQUFLLFNBQVM7QUFDZCxXQUFLLE9BQU8sYUFBYSxXQUFXLE9BQU87QUFDM0MsV0FBSyxLQUFLO0FBQ1YsV0FBSyxLQUFLLEtBQUssR0FBRztBQUNsQixXQUFLLE1BQU07QUFDWCxXQUFLLGFBQWE7QUFDbEIsV0FBSyxjQUFjO0FBQ25CLFdBQUssZUFBZSxDQUFBO0FBQ3BCLFdBQUssY0FBYyxDQUFBO0FBQ25CLFdBQUssV0FBVztBQUNoQixXQUFLLE9BQU87QUFDWixXQUFLLFlBQVksS0FBSyxTQUFTLEtBQUssT0FBTyxZQUFZLElBQUk7QUFDM0QsV0FBSyxjQUFjO0FBQ25CLFdBQUssWUFBWTtBQUNqQixXQUFLLGVBQWUsU0FBUyxRQUFPO0FBQUUsa0JBQVUsT0FBQTtNQUFBO0FBQ2hELFdBQUssZUFBZSxXQUFVO01BQUE7QUFDOUIsV0FBSyxpQkFBaUIsS0FBSyxTQUFTLE9BQU8sQ0FBQTtBQUMzQyxXQUFLLFlBQVksQ0FBQTtBQUNqQixXQUFLLFlBQVksQ0FBQTtBQUNqQixXQUFLLGNBQWMsQ0FBQTtBQUNuQixXQUFLLFdBQVcsS0FBSyxTQUFTLE9BQU8sQ0FBQTtBQUNyQyxXQUFLLEtBQUssU0FBUyxLQUFLLE1BQU0sQ0FBQTtBQUM5QixXQUFLLFVBQVUsS0FBSyxXQUFXLFFBQVEsTUFBTSxLQUFLLE1BQU0sTUFBTTtBQUM1RCxlQUFPO1VBQ0wsVUFBVSxLQUFLLFdBQVcsS0FBSyxPQUFPO1VBQ3RDLEtBQUssS0FBSyxXQUFXLFNBQVksS0FBSyxRQUFRO1VBQzlDLFFBQVEsS0FBSyxjQUFjLFdBQUE7VUFDM0IsU0FBUyxLQUFLLFdBQUE7VUFDZCxRQUFRLEtBQUssVUFBQTtVQUNiLE9BQU8sS0FBSztRQUFBO01BQUEsQ0FBQTtBQUdoQixXQUFLLFdBQVcsS0FBSyxXQUFXLGFBQUE7QUFDaEMsV0FBSyxZQUFBO0lBQUE7SUFHUCxRQUFRLE1BQUs7QUFBRSxXQUFLLE9BQU87SUFBQTtJQUUzQixZQUFZLE1BQUs7QUFDZixXQUFLLFdBQVc7QUFDaEIsV0FBSyxPQUFPO0lBQUE7SUFHZCxTQUFRO0FBQUUsYUFBTyxLQUFLLEdBQUcsYUFBYSxRQUFBLE1BQWM7SUFBQTtJQUVwRCxjQUFjLGFBQVk7QUFDeEIsVUFBSSxTQUFTLEtBQUssV0FBVyxPQUFPLEtBQUssRUFBQTtBQUN6QyxVQUFJLFdBQ0YsWUFBSSxJQUFJLFVBQVUsSUFBSSxLQUFLLFFBQVEsZ0JBQUEsSUFBQSxFQUNoQyxJQUFJLENBQUEsU0FBUSxLQUFLLE9BQU8sS0FBSyxJQUFBLEVBQU0sT0FBTyxDQUFBLFFBQU8sT0FBUSxRQUFTLFFBQUE7QUFFdkUsVUFBRyxTQUFTLFNBQVMsR0FBRTtBQUFFLGVBQU8sbUJBQW1CO01BQUE7QUFDbkQsYUFBTyxhQUFhLEtBQUs7QUFDekIsYUFBTyxtQkFBbUI7QUFFMUIsYUFBTztJQUFBO0lBR1QsY0FBYTtBQUFFLGFBQU8sS0FBSyxRQUFRLFFBQUE7SUFBQTtJQUVuQyxhQUFZO0FBQUUsYUFBTyxLQUFLLEdBQUcsYUFBYSxXQUFBO0lBQUE7SUFFMUMsWUFBVztBQUNULFVBQUksTUFBTSxLQUFLLEdBQUcsYUFBYSxVQUFBO0FBQy9CLGFBQU8sUUFBUSxLQUFLLE9BQU87SUFBQTtJQUc3QixRQUFRLFdBQVcsV0FBVztJQUFBLEdBQUk7QUFDaEMsV0FBSyxtQkFBQTtBQUNMLFdBQUssWUFBWTtBQUNqQixhQUFPLEtBQUssS0FBSyxTQUFTLEtBQUs7QUFDL0IsVUFBRyxLQUFLLFFBQU87QUFBRSxlQUFPLEtBQUssS0FBSyxTQUFTLEtBQUssT0FBTyxJQUFJLEtBQUs7TUFBQTtBQUNoRSxtQkFBYSxLQUFLLFdBQUE7QUFDbEIsVUFBSSxhQUFhLE1BQU07QUFDckIsaUJBQUE7QUFDQSxpQkFBUSxNQUFNLEtBQUssV0FBVTtBQUMzQixlQUFLLFlBQVksS0FBSyxVQUFVLEdBQUE7UUFBQTtNQUFBO0FBSXBDLGtCQUFJLHNCQUFzQixLQUFLLEVBQUE7QUFFL0IsV0FBSyxJQUFJLGFBQWEsTUFBTSxDQUFDLDRDQUFBLENBQUE7QUFDN0IsV0FBSyxRQUFRLE1BQUEsRUFDVixRQUFRLE1BQU0sVUFBQSxFQUNkLFFBQVEsU0FBUyxVQUFBLEVBQ2pCLFFBQVEsV0FBVyxVQUFBO0lBQUE7SUFHeEIsdUJBQXVCLFNBQVE7QUFDN0IsV0FBSyxHQUFHLFVBQVUsT0FDaEIscUJBQ0Esd0JBQ0EsZUFBQTtBQUVGLFdBQUssR0FBRyxVQUFVLElBQUksR0FBRyxPQUFBO0lBQUE7SUFHM0IsV0FBVyxTQUFRO0FBQ2pCLG1CQUFhLEtBQUssV0FBQTtBQUNsQixVQUFHLFNBQVE7QUFDVCxhQUFLLGNBQWMsV0FBVyxNQUFNLEtBQUssV0FBQSxHQUFjLE9BQUE7TUFBQSxPQUNsRDtBQUNMLGlCQUFRLE1BQU0sS0FBSyxXQUFVO0FBQUUsZUFBSyxVQUFVLElBQUksZUFBQTtRQUFBO0FBQ2xELGFBQUssb0JBQW9CLHNCQUFBO01BQUE7SUFBQTtJQUk3QixRQUFRLFNBQVE7QUFDZCxrQkFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLFlBQVksQ0FBQSxPQUFNLEtBQUssV0FBVyxPQUFPLElBQUksR0FBRyxhQUFhLE9BQUEsQ0FBQSxDQUFBO0lBQUE7SUFHcEYsYUFBWTtBQUNWLG1CQUFhLEtBQUssV0FBQTtBQUNsQixXQUFLLG9CQUFvQixtQkFBQTtBQUN6QixXQUFLLFFBQVEsS0FBSyxRQUFRLFdBQUEsQ0FBQTtJQUFBO0lBRzVCLHFCQUFvQjtBQUNsQixlQUFRLE1BQU0sS0FBSyxXQUFVO0FBQUUsYUFBSyxVQUFVLElBQUksY0FBQTtNQUFBO0lBQUE7SUFHcEQsSUFBSSxNQUFNLGFBQVk7QUFDcEIsV0FBSyxXQUFXLElBQUksTUFBTSxNQUFNLFdBQUE7SUFBQTtJQUdsQyxXQUFXLE1BQU0sU0FBUyxTQUFTLFdBQVU7SUFBQSxHQUFHO0FBQzlDLFdBQUssV0FBVyxXQUFXLE1BQU0sU0FBUyxNQUFBO0lBQUE7SUFHNUMsY0FBYyxXQUFXLFVBQVM7QUFDaEMsVUFBRyxxQkFBcUIsZUFBZSxxQkFBcUIsWUFBVztBQUNyRSxlQUFPLEtBQUssV0FBVyxNQUFNLFdBQVcsQ0FBQSxTQUFRLFNBQVMsTUFBTSxTQUFBLENBQUE7TUFBQTtBQUdqRSxVQUFHLE1BQU0sU0FBQSxHQUFXO0FBQ2xCLFlBQUksVUFBVSxZQUFJLHNCQUFzQixLQUFLLElBQUksU0FBQTtBQUNqRCxZQUFHLFFBQVEsV0FBVyxHQUFFO0FBQ3RCLG1CQUFTLDZDQUE2QyxXQUFBO1FBQUEsT0FDakQ7QUFDTCxtQkFBUyxNQUFNLFNBQVMsU0FBQSxDQUFBO1FBQUE7TUFBQSxPQUVyQjtBQUNMLFlBQUksVUFBVSxNQUFNLEtBQUssU0FBUyxpQkFBaUIsU0FBQSxDQUFBO0FBQ25ELFlBQUcsUUFBUSxXQUFXLEdBQUU7QUFBRSxtQkFBUyxtREFBbUQsWUFBQTtRQUFBO0FBQ3RGLGdCQUFRLFFBQVEsQ0FBQSxXQUFVLEtBQUssV0FBVyxNQUFNLFFBQVEsQ0FBQSxTQUFRLFNBQVMsTUFBTSxNQUFBLENBQUEsQ0FBQTtNQUFBO0lBQUE7SUFJbkYsVUFBVSxNQUFNLFNBQVMsVUFBUztBQUNoQyxXQUFLLElBQUksTUFBTSxNQUFNLENBQUMsSUFBSSxNQUFNLE9BQUEsQ0FBQSxDQUFBO0FBQ2hDLFVBQUksRUFBQyxNQUFNLE9BQU8sUUFBUSxVQUFTLFNBQVMsUUFBUSxPQUFBO0FBQ3BELFVBQUcsT0FBTTtBQUFFLG9CQUFJLFNBQVMsS0FBQTtNQUFBO0FBRXhCLGVBQVMsRUFBQyxNQUFNLE9BQU8sT0FBQSxDQUFBO0lBQUE7SUFHekIsT0FBTyxNQUFLO0FBQ1YsVUFBSSxFQUFDLFVBQVUsY0FBYTtBQUM1QixVQUFHLFdBQVU7QUFDWCxZQUFJLENBQUMsS0FBSyxTQUFTO0FBQ25CLGFBQUssS0FBSyxZQUFJLHFCQUFxQixLQUFLLElBQUksS0FBSyxLQUFBO01BQUE7QUFFbkQsV0FBSyxhQUFhO0FBQ2xCLFdBQUssY0FBYztBQUNuQixXQUFLLFFBQVE7QUFFYixzQkFBUSxVQUFVLEtBQUssV0FBVyxjQUFjLE9BQU8sU0FBUyxVQUFVLG1CQUFBO0FBQzFFLFdBQUssVUFBVSxTQUFTLFVBQVUsQ0FBQyxFQUFDLE1BQU0sYUFBWTtBQUNwRCxhQUFLLFdBQVcsSUFBSSxTQUFTLEtBQUssSUFBSSxJQUFBO0FBQ3RDLFlBQUksT0FBTyxLQUFLLGdCQUFnQixNQUFNLE1BQUE7QUFDdEMsYUFBSyxnQkFBQTtBQUNMLFlBQUksUUFBUSxLQUFLLGlCQUFpQixJQUFBO0FBQ2xDLGFBQUs7QUFFTCxZQUFHLE1BQU0sU0FBUyxHQUFFO0FBQ2xCLGdCQUFNLFFBQVEsQ0FBQyxDQUFDLE1BQU0sU0FBUyxTQUFTLE1BQU07QUFDNUMsaUJBQUssaUJBQWlCLE1BQU0sUUFBUSxDQUFBLFVBQVE7QUFDMUMsa0JBQUcsTUFBTSxNQUFNLFNBQVMsR0FBRTtBQUN4QixxQkFBSyxlQUFlLE9BQU0sTUFBTSxNQUFBO2NBQUE7WUFBQSxDQUFBO1VBQUEsQ0FBQTtRQUFBLE9BSWpDO0FBQ0wsZUFBSyxlQUFlLE1BQU0sTUFBTSxNQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7SUFLdEMsa0JBQWlCO0FBQ2Ysa0JBQUksSUFBSSxVQUFVLElBQUksZ0JBQWdCLEtBQUssUUFBUSxZQUFZLENBQUEsT0FBTTtBQUNuRSxXQUFHLGdCQUFnQixPQUFBO0FBQ25CLFdBQUcsZ0JBQWdCLFdBQUE7TUFBQSxDQUFBO0lBQUE7SUFJdkIsZUFBZSxFQUFDLGNBQWEsTUFBTSxRQUFPO0FBR3hDLFVBQUcsS0FBSyxZQUFZLEtBQU0sS0FBSyxVQUFVLENBQUMsS0FBSyxPQUFPLGNBQUEsR0FBaUI7QUFDckUsZUFBTyxLQUFLLGVBQWUsWUFBWSxNQUFNLE1BQUE7TUFBQTtBQU8vQyxVQUFJLGNBQWMsWUFBSSwwQkFBMEIsTUFBTSxLQUFLLEVBQUEsRUFBSSxPQUFPLENBQUEsU0FBUTtBQUM1RSxZQUFJLFNBQVMsS0FBSyxNQUFNLEtBQUssR0FBRyxjQUFjLFFBQVEsS0FBSyxNQUFBO0FBQzNELFlBQUksWUFBWSxVQUFVLE9BQU8sYUFBYSxVQUFBO0FBQzlDLFlBQUcsV0FBVTtBQUFFLGVBQUssYUFBYSxZQUFZLFNBQUE7UUFBQTtBQUM3QyxlQUFPLEtBQUssVUFBVSxJQUFBO01BQUEsQ0FBQTtBQUd4QixVQUFHLFlBQVksV0FBVyxHQUFFO0FBQzFCLFlBQUcsS0FBSyxRQUFPO0FBQ2IsZUFBSyxLQUFLLGVBQWUsS0FBSyxDQUFDLE1BQU0sTUFBTSxLQUFLLGVBQWUsWUFBWSxNQUFNLE1BQUEsQ0FBQSxDQUFBO0FBQ2pGLGVBQUssT0FBTyxRQUFRLElBQUE7UUFBQSxPQUNmO0FBQ0wsZUFBSyx3QkFBQTtBQUNMLGVBQUssZUFBZSxZQUFZLE1BQU0sTUFBQTtRQUFBO01BQUEsT0FFbkM7QUFDTCxhQUFLLEtBQUssZUFBZSxLQUFLLENBQUMsTUFBTSxNQUFNLEtBQUssZUFBZSxZQUFZLE1BQU0sTUFBQSxDQUFBLENBQUE7TUFBQTtJQUFBO0lBSXJGLGtCQUFpQjtBQUNmLFdBQUssS0FBSyxZQUFJLEtBQUssS0FBSyxFQUFBO0FBQ3hCLFdBQUssR0FBRyxhQUFhLGFBQWEsS0FBSyxLQUFLLEVBQUE7SUFBQTtJQUc5QyxpQkFBZ0I7QUFDZCxrQkFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssUUFBUSxRQUFBLGlCQUF5QixhQUFhLENBQUEsV0FBVTtBQUNoRixhQUFLLGdCQUFnQixNQUFBO01BQUEsQ0FBQTtBQUV2QixrQkFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssUUFBUSxXQUFBLE1BQWlCLENBQUEsT0FBTSxLQUFLLGFBQWEsRUFBQSxDQUFBO0lBQUE7SUFHN0UsZUFBZSxZQUFZLE1BQU0sUUFBTztBQUN0QyxXQUFLLGdCQUFBO0FBQ0wsVUFBSSxRQUFRLElBQUksU0FBUyxNQUFNLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxJQUFBO0FBQ3ZELFlBQU0sOEJBQUE7QUFDTixXQUFLLGFBQWEsT0FBTyxLQUFBO0FBQ3pCLFdBQUssZ0JBQUE7QUFDTCxXQUFLLGVBQUE7QUFFTCxXQUFLLGNBQWM7QUFDbkIsV0FBSyxXQUFXLGVBQWUsTUFBQTtBQUMvQixXQUFLLG9CQUFBO0FBRUwsVUFBRyxZQUFXO0FBQ1osWUFBSSxFQUFDLE1BQU0sT0FBTTtBQUNqQixhQUFLLFdBQVcsYUFBYSxJQUFJLElBQUE7TUFBQTtBQUVuQyxXQUFLLFdBQUE7QUFDTCxVQUFHLEtBQUssWUFBWSxHQUFFO0FBQUUsYUFBSyxtQkFBQTtNQUFBO0FBQzdCLFdBQUssYUFBQTtJQUFBO0lBR1Asd0JBQXdCLFFBQVEsTUFBSztBQUNuQyxXQUFLLFdBQVcsV0FBVyxxQkFBcUIsQ0FBQyxRQUFRLElBQUEsQ0FBQTtBQUN6RCxVQUFJLE9BQU8sS0FBSyxRQUFRLE1BQUE7QUFDeEIsVUFBSSxZQUFZLFFBQVEsWUFBSSxVQUFVLFFBQVEsS0FBSyxRQUFRLFVBQUEsQ0FBQTtBQUMzRCxVQUFHLFFBQVEsQ0FBQyxPQUFPLFlBQVksSUFBQSxLQUFTLENBQUUsY0FBYSxXQUFXLE9BQU8sU0FBUyxLQUFLLE9BQUEsSUFBVTtBQUMvRixhQUFLLGVBQUE7QUFDTCxlQUFPO01BQUE7SUFBQTtJQUlYLGFBQWEsSUFBRztBQUNkLFVBQUksYUFBYSxHQUFHLGFBQWEsS0FBSyxRQUFRLFdBQUEsQ0FBQTtBQUM5QyxVQUFJLGlCQUFpQixjQUFjLFlBQUksUUFBUSxJQUFJLFNBQUE7QUFDbkQsVUFBRyxjQUFjLENBQUMsZ0JBQWU7QUFDL0IsYUFBSyxXQUFXLE9BQU8sSUFBSSxVQUFBO0FBQzNCLG9CQUFJLFdBQVcsSUFBSSxXQUFXLElBQUE7TUFBQTtJQUFBO0lBSWxDLGdCQUFnQixJQUFJLE9BQU07QUFDeEIsVUFBSSxVQUFVLEtBQUssUUFBUSxFQUFBO0FBQzNCLFVBQUcsU0FBUTtBQUFFLGdCQUFRLFVBQUE7TUFBQTtJQUFBO0lBR3ZCLGFBQWEsT0FBTyxXQUFVO0FBQzVCLFVBQUksYUFBYSxDQUFBO0FBQ2pCLFVBQUksbUJBQW1CO0FBQ3ZCLFVBQUksaUJBQWlCLG9CQUFJLElBQUE7QUFFekIsWUFBTSxNQUFNLFNBQVMsQ0FBQSxPQUFNO0FBQ3pCLGFBQUssV0FBVyxXQUFXLGVBQWUsQ0FBQyxFQUFBLENBQUE7QUFDM0MsYUFBSyxnQkFBZ0IsRUFBQTtBQUNyQixZQUFHLEdBQUcsY0FBYTtBQUFFLGVBQUssYUFBYSxFQUFBO1FBQUE7TUFBQSxDQUFBO0FBR3pDLFlBQU0sTUFBTSxpQkFBaUIsQ0FBQSxPQUFNO0FBQ2pDLFlBQUcsWUFBSSxZQUFZLEVBQUEsR0FBSTtBQUNyQixlQUFLLFdBQVcsY0FBQTtRQUFBLE9BQ1g7QUFDTCw2QkFBbUI7UUFBQTtNQUFBLENBQUE7QUFJdkIsWUFBTSxPQUFPLFdBQVcsQ0FBQyxRQUFRLFNBQVM7QUFDeEMsWUFBSSxPQUFPLEtBQUssd0JBQXdCLFFBQVEsSUFBQTtBQUNoRCxZQUFHLE1BQUs7QUFBRSx5QkFBZSxJQUFJLE9BQU8sRUFBQTtRQUFBO01BQUEsQ0FBQTtBQUd0QyxZQUFNLE1BQU0sV0FBVyxDQUFBLE9BQU07QUFDM0IsWUFBRyxlQUFlLElBQUksR0FBRyxFQUFBLEdBQUk7QUFBRSxlQUFLLFFBQVEsRUFBQSxFQUFJLFVBQUE7UUFBQTtNQUFBLENBQUE7QUFHbEQsWUFBTSxNQUFNLGFBQWEsQ0FBQyxPQUFPO0FBQy9CLFlBQUcsR0FBRyxhQUFhLEtBQUssY0FBYTtBQUFFLHFCQUFXLEtBQUssRUFBQTtRQUFBO01BQUEsQ0FBQTtBQUd6RCxZQUFNLE1BQU0sd0JBQXdCLENBQUEsUUFBTyxLQUFLLHFCQUFxQixLQUFLLFNBQUEsQ0FBQTtBQUMxRSxZQUFNLFFBQUE7QUFDTixXQUFLLHFCQUFxQixZQUFZLFNBQUE7QUFFdEMsYUFBTztJQUFBO0lBR1QscUJBQXFCLFVBQVUsV0FBVTtBQUN2QyxVQUFJLGdCQUFnQixDQUFBO0FBQ3BCLGVBQVMsUUFBUSxDQUFBLFdBQVU7QUFDekIsWUFBSSxhQUFhLFlBQUksSUFBSSxRQUFRLElBQUksZ0JBQUE7QUFDckMsWUFBSSxRQUFRLFlBQUksSUFBSSxRQUFRLElBQUksS0FBSyxRQUFRLFFBQUEsSUFBQTtBQUM3QyxtQkFBVyxPQUFPLE1BQUEsRUFBUSxRQUFRLENBQUEsT0FBTTtBQUN0QyxjQUFJLE1BQU0sS0FBSyxZQUFZLEVBQUE7QUFDM0IsY0FBRyxNQUFNLEdBQUEsS0FBUSxjQUFjLFFBQVEsR0FBQSxNQUFTLElBQUc7QUFBRSwwQkFBYyxLQUFLLEdBQUE7VUFBQTtRQUFBLENBQUE7QUFFMUUsY0FBTSxPQUFPLE1BQUEsRUFBUSxRQUFRLENBQUEsV0FBVTtBQUNyQyxjQUFJLE9BQU8sS0FBSyxRQUFRLE1BQUE7QUFDeEIsa0JBQVEsS0FBSyxZQUFZLElBQUE7UUFBQSxDQUFBO01BQUEsQ0FBQTtBQU03QixVQUFHLFdBQVU7QUFDWCxhQUFLLDZCQUE2QixhQUFBO01BQUE7SUFBQTtJQUl0QyxrQkFBaUI7QUFDZixrQkFBSSxnQkFBZ0IsS0FBSyxJQUFJLEtBQUssRUFBQSxFQUFJLFFBQVEsQ0FBQSxPQUFNLEtBQUssVUFBVSxFQUFBLENBQUE7SUFBQTtJQUdyRSxhQUFhLElBQUc7QUFBRSxhQUFPLEtBQUssS0FBSyxTQUFTLEtBQUssSUFBSTtJQUFBO0lBRXJELGtCQUFrQixJQUFHO0FBQ25CLFVBQUcsR0FBRyxPQUFPLEtBQUssSUFBRztBQUNuQixlQUFPO01BQUEsT0FDRjtBQUNMLGVBQU8sS0FBSyxTQUFTLEdBQUcsYUFBYSxhQUFBLEdBQWdCLEdBQUc7TUFBQTtJQUFBO0lBSTVELGtCQUFrQixJQUFHO0FBQ25CLGVBQVEsWUFBWSxLQUFLLEtBQUssVUFBUztBQUNyQyxpQkFBUSxXQUFXLEtBQUssS0FBSyxTQUFTLFdBQVU7QUFDOUMsY0FBRyxZQUFZLElBQUc7QUFBRSxtQkFBTyxLQUFLLEtBQUssU0FBUyxVQUFVLFNBQVMsUUFBQTtVQUFBO1FBQUE7TUFBQTtJQUFBO0lBS3ZFLFVBQVUsSUFBRztBQUNYLFVBQUksUUFBUSxLQUFLLGFBQWEsR0FBRyxFQUFBO0FBQ2pDLFVBQUcsQ0FBQyxPQUFNO0FBQ1IsWUFBSSxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssWUFBWSxJQUFBO0FBQ3pDLGFBQUssS0FBSyxTQUFTLEtBQUssSUFBSSxLQUFLLE1BQU07QUFDdkMsYUFBSyxLQUFBO0FBQ0wsYUFBSztBQUNMLGVBQU87TUFBQTtJQUFBO0lBSVgsZ0JBQWU7QUFBRSxhQUFPLEtBQUs7SUFBQTtJQUU3QixRQUFRLFFBQU87QUFDYixXQUFLO0FBRUwsVUFBRyxLQUFLLGVBQWUsR0FBRTtBQUN2QixZQUFHLEtBQUssUUFBTztBQUNiLGVBQUssT0FBTyxRQUFRLElBQUE7UUFBQSxPQUNmO0FBQ0wsZUFBSyx3QkFBQTtRQUFBO01BQUE7SUFBQTtJQUtYLDBCQUF5QjtBQUN2QixXQUFLLGFBQWEsTUFBTTtBQUN0QixhQUFLLGVBQWUsUUFBUSxDQUFDLENBQUMsTUFBTSxRQUFRO0FBQzFDLGNBQUcsQ0FBQyxLQUFLLFlBQUEsR0FBYztBQUFFLGVBQUE7VUFBQTtRQUFBLENBQUE7QUFFM0IsYUFBSyxpQkFBaUIsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQUkxQixPQUFPLE1BQU0sUUFBTztBQUNsQixVQUFHLEtBQUssY0FBQSxLQUFvQixLQUFLLFdBQVcsZUFBQSxLQUFvQixLQUFLLEtBQUssT0FBQSxHQUFVO0FBQ2xGLGVBQU8sS0FBSyxhQUFhLEtBQUssRUFBQyxNQUFNLE9BQUEsQ0FBQTtNQUFBO0FBR3ZDLFdBQUssU0FBUyxVQUFVLElBQUE7QUFDeEIsVUFBSSxtQkFBbUI7QUFLdkIsVUFBRyxLQUFLLFNBQVMsb0JBQW9CLElBQUEsR0FBTTtBQUN6QyxhQUFLLFdBQVcsS0FBSyw0QkFBNEIsTUFBTTtBQUNyRCxjQUFJLGFBQWEsWUFBSSxlQUFlLEtBQUssSUFBSSxLQUFLLFNBQVMsY0FBYyxJQUFBLENBQUE7QUFDekUscUJBQVcsUUFBUSxDQUFBLGNBQWE7QUFDOUIsZ0JBQUcsS0FBSyxlQUFlLEtBQUssU0FBUyxhQUFhLE1BQU0sU0FBQSxHQUFZLFNBQUEsR0FBVztBQUFFLGlDQUFtQjtZQUFBO1VBQUEsQ0FBQTtRQUFBLENBQUE7TUFBQSxXQUdoRyxDQUFDLFFBQVEsSUFBQSxHQUFNO0FBQ3ZCLGFBQUssV0FBVyxLQUFLLHVCQUF1QixNQUFNO0FBQ2hELGNBQUksT0FBTyxLQUFLLGdCQUFnQixNQUFNLFFBQUE7QUFDdEMsY0FBSSxRQUFRLElBQUksU0FBUyxNQUFNLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxJQUFBO0FBQ3ZELDZCQUFtQixLQUFLLGFBQWEsT0FBTyxJQUFBO1FBQUEsQ0FBQTtNQUFBO0FBSWhELFdBQUssV0FBVyxlQUFlLE1BQUE7QUFDL0IsVUFBRyxrQkFBaUI7QUFBRSxhQUFLLGdCQUFBO01BQUE7SUFBQTtJQUc3QixnQkFBZ0IsTUFBTSxNQUFLO0FBQ3pCLGFBQU8sS0FBSyxXQUFXLEtBQUssa0JBQWtCLFNBQVMsTUFBTTtBQUMzRCxZQUFJLE1BQU0sS0FBSyxHQUFHO0FBR2xCLFlBQUksT0FBTyxPQUFPLEtBQUssU0FBUyxjQUFjLElBQUEsRUFBTSxPQUFPLEtBQUssV0FBQSxJQUFlO0FBQy9FLFlBQUksT0FBTyxLQUFLLFNBQVMsU0FBUyxJQUFBO0FBQ2xDLGVBQU8sSUFBSSxPQUFPLFNBQVM7TUFBQSxDQUFBO0lBQUE7SUFJL0IsZUFBZSxNQUFNLEtBQUk7QUFDdkIsVUFBRyxRQUFRLElBQUE7QUFBTyxlQUFPO0FBQ3pCLFVBQUksT0FBTyxLQUFLLFNBQVMsa0JBQWtCLEdBQUE7QUFDM0MsVUFBSSxRQUFRLElBQUksU0FBUyxNQUFNLEtBQUssSUFBSSxLQUFLLElBQUksTUFBTSxHQUFBO0FBQ3ZELFVBQUksZ0JBQWdCLEtBQUssYUFBYSxPQUFPLElBQUE7QUFDN0MsYUFBTztJQUFBO0lBR1QsUUFBUSxJQUFHO0FBQUUsYUFBTyxLQUFLLFVBQVUsU0FBUyxVQUFVLEVBQUE7SUFBQTtJQUV0RCxRQUFRLElBQUc7QUFDVCxVQUFHLFNBQVMsVUFBVSxFQUFBLEtBQU8sQ0FBQyxHQUFHLGNBQWE7QUFBRTtNQUFBO0FBQ2hELFVBQUksV0FBVyxHQUFHLGFBQWEsWUFBWSxVQUFBLEtBQWUsR0FBRyxhQUFhLEtBQUssUUFBUSxRQUFBLENBQUE7QUFDdkYsVUFBRyxZQUFZLENBQUMsS0FBSyxZQUFZLEVBQUEsR0FBSTtBQUFFO01BQUE7QUFDdkMsVUFBSSxZQUFZLEtBQUssV0FBVyxpQkFBaUIsUUFBQTtBQUVqRCxVQUFHLFdBQVU7QUFDWCxZQUFHLENBQUMsR0FBRyxJQUFHO0FBQUUsbUJBQVMsdUJBQXVCLHlEQUF5RCxFQUFBO1FBQUE7QUFDckcsWUFBSSxPQUFPLElBQUksU0FBUyxNQUFNLElBQUksU0FBQTtBQUNsQyxhQUFLLFVBQVUsU0FBUyxVQUFVLEtBQUssRUFBQSxLQUFPO0FBQzlDLGVBQU87TUFBQSxXQUNDLGFBQWEsTUFBSztBQUMxQixpQkFBUywyQkFBMkIsYUFBYSxFQUFBO01BQUE7SUFBQTtJQUlyRCxZQUFZLE1BQUs7QUFDZixXQUFLLFlBQUE7QUFDTCxXQUFLLFlBQUE7QUFDTCxhQUFPLEtBQUssVUFBVSxTQUFTLFVBQVUsS0FBSyxFQUFBO0lBQUE7SUFHaEQsc0JBQXFCO0FBQ25CLFdBQUssYUFBYSxRQUFRLENBQUMsRUFBQyxNQUFNLGFBQVksS0FBSyxPQUFPLE1BQU0sTUFBQSxDQUFBO0FBQ2hFLFdBQUssZUFBZSxDQUFBO0lBQUE7SUFHdEIsVUFBVSxPQUFPLElBQUc7QUFDbEIsV0FBSyxXQUFXLFVBQVUsS0FBSyxTQUFTLE9BQU8sQ0FBQSxTQUFRO0FBQ3JELFlBQUcsS0FBSyxjQUFBLEdBQWdCO0FBQ3RCLGVBQUssS0FBSyxlQUFlLEtBQUssQ0FBQyxNQUFNLE1BQU0sR0FBRyxJQUFBLENBQUEsQ0FBQTtRQUFBLE9BQ3pDO0FBQ0wsZUFBSyxXQUFXLGlCQUFpQixNQUFNLEdBQUcsSUFBQSxDQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7SUFLaEQsY0FBYTtBQUdYLFdBQUssV0FBVyxVQUFVLEtBQUssU0FBUyxRQUFRLENBQUMsWUFBWTtBQUMzRCxhQUFLLFdBQVcsaUJBQWlCLE1BQU07QUFDckMsZUFBSyxVQUFVLFVBQVUsU0FBUyxDQUFDLEVBQUMsTUFBTSxhQUFZLEtBQUssT0FBTyxNQUFNLE1BQUEsQ0FBQTtRQUFBLENBQUE7TUFBQSxDQUFBO0FBRzVFLFdBQUssVUFBVSxZQUFZLENBQUMsRUFBQyxJQUFJLFlBQVcsS0FBSyxXQUFXLEVBQUMsSUFBSSxNQUFBLENBQUEsQ0FBQTtBQUNqRSxXQUFLLFVBQVUsY0FBYyxDQUFDLFVBQVUsS0FBSyxZQUFZLEtBQUEsQ0FBQTtBQUN6RCxXQUFLLFVBQVUsaUJBQWlCLENBQUMsVUFBVSxLQUFLLGVBQWUsS0FBQSxDQUFBO0FBQy9ELFdBQUssUUFBUSxRQUFRLENBQUEsV0FBVSxLQUFLLFFBQVEsTUFBQSxDQUFBO0FBQzVDLFdBQUssUUFBUSxRQUFRLENBQUEsV0FBVSxLQUFLLFFBQVEsTUFBQSxDQUFBO0lBQUE7SUFHOUMscUJBQW9CO0FBQ2xCLGVBQVEsTUFBTSxLQUFLLEtBQUssU0FBUyxLQUFLLEtBQUk7QUFDeEMsYUFBSyxhQUFhLEVBQUEsRUFBSSxRQUFBO01BQUE7SUFBQTtJQUkxQixlQUFlLE9BQU07QUFDbkIsVUFBSSxFQUFDLElBQUksTUFBTSxVQUFTO0FBQ3hCLFVBQUksTUFBTSxLQUFLLFVBQVUsRUFBQTtBQUN6QixXQUFLLFdBQVcsZ0JBQWdCLEtBQUssTUFBTSxLQUFBO0lBQUE7SUFHN0MsWUFBWSxPQUFNO0FBQ2hCLFVBQUksRUFBQyxJQUFJLFNBQVE7QUFDakIsV0FBSyxPQUFPLEtBQUssVUFBVSxFQUFBO0FBQzNCLFdBQUssV0FBVyxhQUFhLElBQUksSUFBQTtJQUFBO0lBR25DLFVBQVUsSUFBRztBQUNYLGFBQU8sR0FBRyxXQUFXLEdBQUEsSUFBTyxHQUFHLE9BQU8sU0FBUyxhQUFhLE9BQU8sU0FBUyxPQUFPLE9BQU87SUFBQTtJQUc1RixXQUFXLEVBQUMsSUFBSSxTQUFPO0FBQUUsV0FBSyxXQUFXLFNBQVMsSUFBSSxLQUFBO0lBQUE7SUFFdEQsY0FBYTtBQUFFLGFBQU8sS0FBSztJQUFBO0lBRTNCLFdBQVU7QUFBRSxXQUFLLFNBQVM7SUFBQTtJQUUxQixLQUFLLFVBQVM7QUFDWixVQUFHLEtBQUssT0FBQSxHQUFTO0FBQ2YsYUFBSyxlQUFlLEtBQUssV0FBVyxnQkFBZ0IsRUFBQyxJQUFJLEtBQUssTUFBTSxNQUFNLFVBQUEsQ0FBQTtNQUFBO0FBRTVFLFdBQUssZUFBZSxDQUFDLFdBQVc7QUFDOUIsaUJBQVMsVUFBVSxXQUFVO1FBQUE7QUFDN0IsbUJBQVcsU0FBUyxLQUFLLFdBQVcsTUFBQSxJQUFVLE9BQUE7TUFBQTtBQUVoRCxXQUFLLFdBQVcsU0FBUyxNQUFNLEVBQUMsU0FBUyxNQUFBLEdBQVEsTUFBTTtBQUNyRCxlQUFPLEtBQUssUUFBUSxLQUFBLEVBQ2pCLFFBQVEsTUFBTSxDQUFBLFNBQVE7QUFDckIsY0FBRyxDQUFDLEtBQUssWUFBQSxHQUFjO0FBQ3JCLGlCQUFLLFdBQVcsaUJBQWlCLE1BQU0sS0FBSyxPQUFPLElBQUEsQ0FBQTtVQUFBO1FBQUEsQ0FBQSxFQUd0RCxRQUFRLFNBQVMsQ0FBQSxTQUFRLENBQUMsS0FBSyxZQUFBLEtBQWlCLEtBQUssWUFBWSxJQUFBLENBQUEsRUFDakUsUUFBUSxXQUFXLE1BQU0sQ0FBQyxLQUFLLFlBQUEsS0FBaUIsS0FBSyxZQUFZLEVBQUMsUUFBUSxVQUFBLENBQUEsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQUlqRixZQUFZLE1BQUs7QUFDZixVQUFHLEtBQUssV0FBVyxrQkFBa0IsS0FBSyxXQUFXLFNBQVE7QUFDM0QsYUFBSyxJQUFJLFNBQVMsTUFBTSxDQUFDLDREQUE0RCxJQUFBLENBQUE7QUFDckYsZUFBTyxLQUFLLFdBQVcsRUFBQyxJQUFJLEtBQUssS0FBQSxDQUFBO01BQUE7QUFFbkMsVUFBRyxLQUFLLFlBQVksS0FBSyxlQUFjO0FBQ3JDLGFBQUssY0FBYztBQUNuQixhQUFLLFFBQVEsTUFBQTtNQUFBO0FBRWYsVUFBRyxLQUFLLFVBQVM7QUFBRSxlQUFPLEtBQUssV0FBVyxLQUFLLFFBQUE7TUFBQTtBQUMvQyxVQUFHLEtBQUssZUFBYztBQUFFLGVBQU8sS0FBSyxlQUFlLEtBQUssYUFBQTtNQUFBO0FBQ3hELFdBQUssSUFBSSxTQUFTLE1BQU0sQ0FBQyxrQkFBa0IsSUFBQSxDQUFBO0FBQzNDLFVBQUcsS0FBSyxXQUFXLFlBQUEsR0FBYztBQUFFLGFBQUssV0FBVyxpQkFBaUIsSUFBQTtNQUFBO0lBQUE7SUFHdEUsUUFBUSxRQUFPO0FBQ2IsVUFBRyxLQUFLLFlBQUEsR0FBYztBQUFFO01BQUE7QUFDeEIsVUFBRyxLQUFLLFdBQVcsZUFBQSxLQUFvQixXQUFXLFNBQVE7QUFDeEQsZUFBTyxLQUFLLFdBQVcsaUJBQWlCLElBQUE7TUFBQTtBQUUxQyxXQUFLLG1CQUFBO0FBQ0wsV0FBSyxXQUFXLGtCQUFrQixJQUFBO0FBRWxDLFVBQUcsU0FBUyxlQUFjO0FBQUUsaUJBQVMsY0FBYyxLQUFBO01BQUE7QUFDbkQsVUFBRyxLQUFLLFdBQVcsV0FBQSxHQUFhO0FBQzlCLGFBQUssV0FBVyw0QkFBQTtNQUFBO0lBQUE7SUFJcEIsUUFBUSxRQUFPO0FBQ2IsV0FBSyxRQUFRLE1BQUE7QUFDYixVQUFHLEtBQUssV0FBVyxZQUFBLEdBQWM7QUFBRSxhQUFLLElBQUksU0FBUyxNQUFNLENBQUMsZ0JBQWdCLE1BQUEsQ0FBQTtNQUFBO0FBQzVFLFVBQUcsQ0FBQyxLQUFLLFdBQVcsV0FBQSxHQUFhO0FBQUUsYUFBSyxhQUFBO01BQUE7SUFBQTtJQUcxQyxlQUFjO0FBQ1osVUFBRyxLQUFLLE9BQUEsR0FBUztBQUFFLG9CQUFJLGNBQWMsUUFBUSwwQkFBMEIsRUFBQyxRQUFRLEVBQUMsSUFBSSxLQUFLLE1BQU0sTUFBTSxRQUFBLEVBQUEsQ0FBQTtNQUFBO0FBQ3RHLFdBQUssV0FBQTtBQUNMLFdBQUssb0JBQW9CLHdCQUF3QixlQUFBO0FBQ2pELFdBQUssUUFBUSxLQUFLLFFBQVEsY0FBQSxDQUFBO0lBQUE7SUFHNUIsY0FBYyxjQUFjLE9BQU8sU0FBUyxVQUFVLFdBQVc7SUFBQSxHQUFJO0FBQ25FLFVBQUcsQ0FBQyxLQUFLLFlBQUEsR0FBYztBQUFFO01BQUE7QUFFekIsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsZUFBZSxhQUFBLElBQWlCLENBQUMsTUFBTSxDQUFBLEdBQUksQ0FBQSxDQUFBO0FBQ25FLFVBQUksZ0JBQWdCLFdBQVU7TUFBQTtBQUM5QixVQUFHLEtBQUssZ0JBQWlCLE1BQU8sR0FBRyxhQUFhLEtBQUssUUFBUSxnQkFBQSxDQUFBLE1BQXVCLE1BQU87QUFDekYsd0JBQWdCLEtBQUssV0FBVyxnQkFBZ0IsRUFBQyxNQUFNLFdBQVcsUUFBUSxHQUFBLENBQUE7TUFBQTtBQUc1RSxVQUFHLE9BQVEsUUFBUSxRQUFTLFVBQVM7QUFBRSxlQUFPLFFBQVE7TUFBQTtBQUN0RCxhQUNFLEtBQUssV0FBVyxTQUFTLE1BQU0sRUFBQyxTQUFTLEtBQUEsR0FBTyxNQUFNO0FBQ3BELGVBQU8sS0FBSyxRQUFRLEtBQUssT0FBTyxTQUFTLFlBQUEsRUFBYyxRQUFRLE1BQU0sQ0FBQSxTQUFRO0FBQzNFLGNBQUksU0FBUyxDQUFDLGNBQWM7QUFDMUIsZ0JBQUcsS0FBSyxVQUFTO0FBQUUsbUJBQUssV0FBVyxLQUFLLFFBQUE7WUFBQTtBQUN4QyxnQkFBRyxLQUFLLFlBQVc7QUFBRSxtQkFBSyxZQUFZLEtBQUssVUFBQTtZQUFBO0FBQzNDLGdCQUFHLEtBQUssZUFBYztBQUFFLG1CQUFLLGVBQWUsS0FBSyxhQUFBO1lBQUE7QUFDakQsZ0JBQUcsUUFBUSxNQUFLO0FBQUUsbUJBQUssU0FBUyxHQUFBO1lBQUE7QUFDaEMsMEJBQUE7QUFDQSxvQkFBUSxNQUFNLFNBQUE7VUFBQTtBQUVoQixjQUFHLEtBQUssTUFBSztBQUNYLGlCQUFLLFdBQVcsaUJBQWlCLE1BQU07QUFDckMsbUJBQUssVUFBVSxVQUFVLEtBQUssTUFBTSxDQUFDLEVBQUMsTUFBTSxPQUFPLGFBQVk7QUFDN0QscUJBQUssT0FBTyxNQUFNLE1BQUE7QUFDbEIsdUJBQU8sS0FBQTtjQUFBLENBQUE7WUFBQSxDQUFBO1VBQUEsT0FHTjtBQUNMLG1CQUFPLElBQUE7VUFBQTtRQUFBLENBQUE7TUFBQSxDQUFBO0lBQUE7SUFPakIsU0FBUyxLQUFJO0FBQ1gsVUFBRyxDQUFDLEtBQUssWUFBQSxHQUFjO0FBQUU7TUFBQTtBQUV6QixrQkFBSSxJQUFJLFVBQVUsSUFBSSxnQkFBZ0IsS0FBSyxRQUFRLFlBQVksU0FBUyxDQUFBLE9BQU07QUFDNUUsWUFBSSxjQUFjLEdBQUcsYUFBYSxZQUFBO0FBRWxDLFdBQUcsZ0JBQWdCLE9BQUE7QUFDbkIsV0FBRyxnQkFBZ0IsV0FBQTtBQUVuQixZQUFHLEdBQUcsYUFBYSxZQUFBLE1BQWtCLE1BQUs7QUFDeEMsYUFBRyxXQUFXO0FBQ2QsYUFBRyxnQkFBZ0IsWUFBQTtRQUFBO0FBRXJCLFlBQUcsZ0JBQWdCLE1BQUs7QUFDdEIsYUFBRyxXQUFXLGdCQUFnQixTQUFTLE9BQU87QUFDOUMsYUFBRyxnQkFBZ0IsWUFBQTtRQUFBO0FBR3JCLDBCQUFrQixRQUFRLENBQUEsY0FBYSxZQUFJLFlBQVksSUFBSSxTQUFBLENBQUE7QUFFM0QsWUFBSSxpQkFBaUIsR0FBRyxhQUFhLHdCQUFBO0FBQ3JDLFlBQUcsbUJBQW1CLE1BQUs7QUFDekIsYUFBRyxZQUFZO0FBQ2YsYUFBRyxnQkFBZ0Isd0JBQUE7UUFBQTtBQUVyQixZQUFJLE9BQU8sWUFBSSxRQUFRLElBQUksT0FBQTtBQUMzQixZQUFHLE1BQUs7QUFDTixjQUFJLE9BQU8sS0FBSyx3QkFBd0IsSUFBSSxJQUFBO0FBQzVDLG1CQUFTLFFBQVEsSUFBSSxNQUFNLEtBQUssV0FBVyxpQkFBQSxDQUFBO0FBQzNDLGNBQUcsTUFBSztBQUFFLGlCQUFLLFVBQUE7VUFBQTtBQUNmLHNCQUFJLGNBQWMsSUFBSSxPQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7SUFLNUIsT0FBTyxVQUFVLE9BQU8sT0FBTyxDQUFBLEdBQUc7QUFDaEMsVUFBSSxTQUFTLEtBQUs7QUFDbEIsVUFBSSxjQUFjLEtBQUssUUFBUSxnQkFBQTtBQUMvQixVQUFHLEtBQUssU0FBUTtBQUFFLG1CQUFXLFNBQVMsT0FBTyxZQUFJLElBQUksVUFBVSxLQUFLLE9BQUEsQ0FBQTtNQUFBO0FBRXBFLGVBQVMsUUFBUSxDQUFBLE9BQU07QUFDckIsV0FBRyxVQUFVLElBQUksT0FBTyxlQUFBO0FBQ3hCLFdBQUcsYUFBYSxTQUFTLE1BQUE7QUFDekIsV0FBRyxhQUFhLGFBQWEsS0FBSyxHQUFHLEVBQUE7QUFDckMsWUFBSSxjQUFjLEdBQUcsYUFBYSxXQUFBO0FBQ2xDLFlBQUcsZ0JBQWdCLE1BQUs7QUFDdEIsY0FBRyxDQUFDLEdBQUcsYUFBYSx3QkFBQSxHQUEwQjtBQUM1QyxlQUFHLGFBQWEsMEJBQTBCLEdBQUcsU0FBQTtVQUFBO0FBRS9DLGNBQUcsZ0JBQWdCLElBQUc7QUFBRSxlQUFHLFlBQVk7VUFBQTtBQUN2QyxhQUFHLGFBQWEsWUFBWSxFQUFBO1FBQUE7TUFBQSxDQUFBO0FBR2hDLGFBQU8sQ0FBQyxRQUFRLFVBQVUsSUFBQTtJQUFBO0lBRzVCLFlBQVksSUFBRztBQUNiLFVBQUksTUFBTSxHQUFHLGdCQUFnQixHQUFHLGFBQWEsYUFBQTtBQUM3QyxhQUFPLE1BQU0sU0FBUyxHQUFBLElBQU87SUFBQTtJQUcvQixrQkFBa0IsUUFBUSxXQUFXLE9BQU8sQ0FBQSxHQUFHO0FBQzdDLFVBQUcsTUFBTSxTQUFBLEdBQVc7QUFBRSxlQUFPO01BQUE7QUFFN0IsVUFBSSxnQkFBZ0IsT0FBTyxhQUFhLEtBQUssUUFBUSxRQUFBLENBQUE7QUFDckQsVUFBRyxNQUFNLGFBQUEsR0FBZTtBQUN0QixlQUFPLFNBQVMsYUFBQTtNQUFBLFdBQ1IsYUFBYyxtQkFBa0IsUUFBUSxLQUFLLFNBQVE7QUFDN0QsZUFBTyxLQUFLLG1CQUFtQixTQUFBO01BQUEsT0FDMUI7QUFDTCxlQUFPO01BQUE7SUFBQTtJQUlYLG1CQUFtQixXQUFVO0FBQzNCLFVBQUcsTUFBTSxTQUFBLEdBQVc7QUFDbEIsZUFBTztNQUFBLFdBQ0MsV0FBVTtBQUNsQixlQUFPLE1BQU0sVUFBVSxRQUFRLElBQUksZ0JBQUEsR0FBbUIsQ0FBQSxPQUFNLEtBQUssWUFBWSxFQUFBLEtBQU8sS0FBSyxZQUFZLEVBQUEsQ0FBQTtNQUFBLE9BQ2hHO0FBQ0wsZUFBTztNQUFBO0lBQUE7SUFJWCxjQUFjLFdBQVcsT0FBTyxTQUFTLFNBQVE7QUFDL0MsVUFBRyxDQUFDLEtBQUssWUFBQSxHQUFjO0FBQ3JCLGFBQUssSUFBSSxRQUFRLE1BQU0sQ0FBQyxxREFBcUQsT0FBTyxPQUFBLENBQUE7QUFDcEYsZUFBTztNQUFBO0FBRVQsVUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLEtBQUssT0FBTyxDQUFBLEdBQUksTUFBQTtBQUN2QyxXQUFLLGNBQWMsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFBLEdBQU8sU0FBUztRQUNsRCxNQUFNO1FBQ047UUFDQSxPQUFPO1FBQ1AsS0FBSyxLQUFLLG1CQUFtQixTQUFBO01BQUEsR0FDNUIsQ0FBQyxNQUFNLFVBQVUsUUFBUSxPQUFPLEdBQUEsQ0FBQTtBQUVuQyxhQUFPO0lBQUE7SUFHVCxZQUFZLElBQUksTUFBTSxPQUFNO0FBQzFCLFVBQUksU0FBUyxLQUFLLFFBQVEsUUFBQTtBQUMxQixlQUFRLElBQUksR0FBRyxJQUFJLEdBQUcsV0FBVyxRQUFRLEtBQUk7QUFDM0MsWUFBRyxDQUFDLE1BQUs7QUFBRSxpQkFBTyxDQUFBO1FBQUE7QUFDbEIsWUFBSSxPQUFPLEdBQUcsV0FBVyxHQUFHO0FBQzVCLFlBQUcsS0FBSyxXQUFXLE1BQUEsR0FBUTtBQUFFLGVBQUssS0FBSyxRQUFRLFFBQVEsRUFBQSxLQUFPLEdBQUcsYUFBYSxJQUFBO1FBQUE7TUFBQTtBQUVoRixVQUFHLEdBQUcsVUFBVSxRQUFVO0FBQ3hCLFlBQUcsQ0FBQyxNQUFLO0FBQUUsaUJBQU8sQ0FBQTtRQUFBO0FBQ2xCLGFBQUssUUFBUSxHQUFHO0FBRWhCLFlBQUcsR0FBRyxZQUFZLFdBQVcsaUJBQWlCLFFBQVEsR0FBRyxJQUFBLEtBQVMsS0FBSyxDQUFDLEdBQUcsU0FBUTtBQUNqRixpQkFBTyxLQUFLO1FBQUE7TUFBQTtBQUdoQixVQUFHLE9BQU07QUFDUCxZQUFHLENBQUMsTUFBSztBQUFFLGlCQUFPLENBQUE7UUFBQTtBQUNsQixpQkFBUSxPQUFPLE9BQU07QUFBRSxlQUFLLE9BQU8sTUFBTTtRQUFBO01BQUE7QUFFM0MsYUFBTztJQUFBO0lBR1QsVUFBVSxNQUFNLElBQUksV0FBVyxVQUFVLE1BQU0sT0FBTyxDQUFBLEdBQUc7QUFDdkQsV0FBSyxjQUFjLE1BQU0sS0FBSyxPQUFPLENBQUMsRUFBQSxHQUFLLE1BQU0sSUFBQSxHQUFPLFNBQVM7UUFDL0Q7UUFDQSxPQUFPO1FBQ1AsT0FBTyxLQUFLLFlBQVksSUFBSSxNQUFNLEtBQUssS0FBQTtRQUN2QyxLQUFLLEtBQUssa0JBQWtCLElBQUksV0FBVyxJQUFBO01BQUEsQ0FBQTtJQUFBO0lBSS9DLGlCQUFpQixRQUFRLFVBQVUsVUFBVSxVQUFVLFdBQVc7SUFBQSxHQUFJO0FBQ3BFLFdBQUssV0FBVyxhQUFhLE9BQU8sTUFBTSxDQUFDLE1BQU0sY0FBYztBQUM3RCxhQUFLLGNBQWMsTUFBTSxZQUFZO1VBQ25DLE9BQU8sT0FBTyxhQUFhLEtBQUssUUFBUSxZQUFBLENBQUE7VUFDeEMsS0FBSyxPQUFPLGFBQWEsY0FBQTtVQUN6QixXQUFXO1VBQ1g7VUFDQSxLQUFLLEtBQUssa0JBQWtCLE9BQU8sTUFBTSxTQUFBO1FBQUEsR0FDeEMsT0FBQTtNQUFBLENBQUE7SUFBQTtJQUlQLFVBQVUsU0FBUyxXQUFXLFVBQVUsVUFBVSxNQUFNLFVBQVM7QUFDL0QsVUFBSTtBQUNKLFVBQUksTUFBTSxNQUFNLFFBQUEsSUFBWSxXQUFXLEtBQUssa0JBQWtCLFFBQVEsTUFBTSxTQUFBO0FBQzVFLFVBQUksZUFBZSxNQUFNLEtBQUssT0FBTyxDQUFDLFNBQVMsUUFBUSxJQUFBLEdBQU8sVUFBVSxJQUFBO0FBQ3hFLFVBQUk7QUFDSixVQUFHLFFBQVEsYUFBYSxLQUFLLFFBQVEsUUFBQSxDQUFBLEdBQVc7QUFDOUMsbUJBQVcsY0FBYyxRQUFRLE1BQU0sRUFBQyxTQUFTLEtBQUssUUFBQSxHQUFVLENBQUMsUUFBUSxJQUFBLENBQUE7TUFBQSxPQUNwRTtBQUNMLG1CQUFXLGNBQWMsUUFBUSxNQUFNLEVBQUMsU0FBUyxLQUFLLFFBQUEsQ0FBQTtNQUFBO0FBRXhELFVBQUcsWUFBSSxjQUFjLE9BQUEsS0FBWSxRQUFRLFNBQVMsUUFBUSxNQUFNLFNBQVMsR0FBRTtBQUN6RSxxQkFBYSxXQUFXLFNBQVMsTUFBTSxLQUFLLFFBQVEsS0FBQSxDQUFBO01BQUE7QUFFdEQsZ0JBQVUsYUFBYSxpQkFBaUIsT0FBQTtBQUN4QyxVQUFJLFFBQVE7UUFDVixNQUFNO1FBQ04sT0FBTztRQUNQLE9BQU87UUFDUDtRQUNBO01BQUE7QUFFRixXQUFLLGNBQWMsY0FBYyxTQUFTLE9BQU8sQ0FBQSxTQUFRO0FBQ3ZELG9CQUFJLFVBQVUsU0FBUyxLQUFLLFdBQVcsUUFBUSxnQkFBQSxDQUFBO0FBQy9DLFlBQUcsWUFBSSxjQUFjLE9BQUEsS0FBWSxRQUFRLGFBQWEsc0JBQUEsTUFBNEIsTUFBSztBQUNyRixjQUFHLGFBQWEsdUJBQXVCLE9BQUEsRUFBUyxTQUFTLEdBQUU7QUFDekQsZ0JBQUksQ0FBQyxLQUFLLFFBQVEsYUFBQTtBQUNsQixpQkFBSyxZQUFZLFFBQVEsTUFBTSxXQUFXLEtBQUssS0FBSyxDQUFDLGFBQWE7QUFDaEUsMEJBQVksU0FBUyxJQUFBO0FBQ3JCLG1CQUFLLHNCQUFzQixRQUFRLElBQUE7WUFBQSxDQUFBO1VBQUE7UUFBQSxPQUdsQztBQUNMLHNCQUFZLFNBQVMsSUFBQTtRQUFBO01BQUEsQ0FBQTtJQUFBO0lBSzNCLHNCQUFzQixRQUFPO0FBQzNCLFVBQUksaUJBQWlCLEtBQUssbUJBQW1CLE1BQUE7QUFDN0MsVUFBRyxnQkFBZTtBQUNoQixZQUFJLENBQUMsS0FBSyxNQUFNLE9BQU8sWUFBWTtBQUNuQyxhQUFLLGFBQWEsTUFBQTtBQUNsQixpQkFBQTtNQUFBO0lBQUE7SUFJSixtQkFBbUIsUUFBTztBQUN4QixhQUFPLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxJQUFJLE1BQU0sT0FBTyxlQUFlLEdBQUcsV0FBVyxNQUFBLENBQUE7SUFBQTtJQUcvRSxlQUFlLFFBQVEsS0FBSyxNQUFNLFVBQVM7QUFDekMsVUFBRyxLQUFLLG1CQUFtQixNQUFBLEdBQVE7QUFBRSxlQUFPO01BQUE7QUFDNUMsV0FBSyxZQUFZLEtBQUssQ0FBQyxRQUFRLEtBQUssTUFBTSxRQUFBLENBQUE7SUFBQTtJQUc1QyxhQUFhLFFBQU87QUFDbEIsV0FBSyxjQUFjLEtBQUssWUFBWSxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssZUFBZTtBQUNuRSxZQUFHLEdBQUcsV0FBVyxNQUFBLEdBQVE7QUFDdkIsZUFBSyxTQUFTLEdBQUE7QUFDZCxpQkFBTztRQUFBLE9BQ0Y7QUFDTCxpQkFBTztRQUFBO01BQUEsQ0FBQTtJQUFBO0lBS2IsWUFBWSxRQUFRLE9BQU8sQ0FBQSxHQUFHO0FBQzVCLFVBQUksZ0JBQWdCLENBQUEsT0FBTTtBQUN4QixZQUFJLGNBQWMsa0JBQWtCLElBQUksR0FBRyxLQUFLLFFBQVEsVUFBQSxZQUFzQixHQUFHLElBQUE7QUFDakYsZUFBTyxDQUFFLGdCQUFlLGtCQUFrQixJQUFJLDBCQUEwQixHQUFHLElBQUE7TUFBQTtBQUU3RSxVQUFJLGlCQUFpQixDQUFBLE9BQU07QUFDekIsZUFBTyxHQUFHLGFBQWEsS0FBSyxRQUFRLGdCQUFBLENBQUE7TUFBQTtBQUV0QyxVQUFJLGVBQWUsQ0FBQSxPQUFNLEdBQUcsV0FBVztBQUV2QyxVQUFJLGNBQWMsQ0FBQSxPQUFNLENBQUMsU0FBUyxZQUFZLFFBQUEsRUFBVSxTQUFTLEdBQUcsT0FBQTtBQUVwRSxVQUFJLGVBQWUsTUFBTSxLQUFLLE9BQU8sUUFBQTtBQUNyQyxVQUFJLFdBQVcsYUFBYSxPQUFPLGNBQUE7QUFDbkMsVUFBSSxVQUFVLGFBQWEsT0FBTyxZQUFBLEVBQWMsT0FBTyxhQUFBO0FBQ3ZELFVBQUksU0FBUyxhQUFhLE9BQU8sV0FBQSxFQUFhLE9BQU8sYUFBQTtBQUVyRCxjQUFRLFFBQVEsQ0FBQSxXQUFVO0FBQ3hCLGVBQU8sYUFBYSxjQUFjLE9BQU8sUUFBQTtBQUN6QyxlQUFPLFdBQVc7TUFBQSxDQUFBO0FBRXBCLGFBQU8sUUFBUSxDQUFBLFVBQVM7QUFDdEIsY0FBTSxhQUFhLGNBQWMsTUFBTSxRQUFBO0FBQ3ZDLGNBQU0sV0FBVztBQUNqQixZQUFHLE1BQU0sT0FBTTtBQUNiLGdCQUFNLGFBQWEsY0FBYyxNQUFNLFFBQUE7QUFDdkMsZ0JBQU0sV0FBVztRQUFBO01BQUEsQ0FBQTtBQUdyQixhQUFPLGFBQWEsS0FBSyxRQUFRLGdCQUFBLEdBQW1CLEVBQUE7QUFDcEQsYUFBTyxLQUFLLE9BQU8sQ0FBQyxNQUFBLEVBQVEsT0FBTyxRQUFBLEVBQVUsT0FBTyxPQUFBLEVBQVMsT0FBTyxNQUFBLEdBQVMsVUFBVSxJQUFBO0lBQUE7SUFHekYsZUFBZSxRQUFRLFdBQVcsVUFBVSxNQUFNLFNBQVE7QUFDeEQsVUFBSSxlQUFlLE1BQU0sS0FBSyxZQUFZLFFBQVEsSUFBQTtBQUNsRCxVQUFJLE1BQU0sS0FBSyxrQkFBa0IsUUFBUSxTQUFBO0FBQ3pDLFVBQUcsYUFBYSxxQkFBcUIsTUFBQSxHQUFRO0FBQzNDLFlBQUksQ0FBQyxLQUFLLFFBQVEsYUFBQTtBQUNsQixZQUFJLE9BQU8sTUFBTSxLQUFLLGVBQWUsUUFBUSxXQUFXLFVBQVUsTUFBTSxPQUFBO0FBQ3hFLGVBQU8sS0FBSyxlQUFlLFFBQVEsS0FBSyxNQUFNLElBQUE7TUFBQSxXQUN0QyxhQUFhLHdCQUF3QixNQUFBLEVBQVEsU0FBUyxHQUFFO0FBQ2hFLFlBQUksQ0FBQyxLQUFLLE9BQU8sYUFBQTtBQUNqQixZQUFJLGNBQWMsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFBO0FBQ25DLGFBQUssWUFBWSxRQUFRLFdBQVcsS0FBSyxLQUFLLENBQUMsYUFBYTtBQUMxRCxjQUFJLFdBQVcsY0FBYyxRQUFRLENBQUEsQ0FBQTtBQUNyQyxlQUFLLGNBQWMsYUFBYSxTQUFTO1lBQ3ZDLE1BQU07WUFDTixPQUFPO1lBQ1AsT0FBTztZQUNQO1VBQUEsR0FDQyxPQUFBO1FBQUEsQ0FBQTtNQUFBLE9BRUE7QUFDTCxZQUFJLFdBQVcsY0FBYyxRQUFRLENBQUEsQ0FBQTtBQUNyQyxhQUFLLGNBQWMsY0FBYyxTQUFTO1VBQ3hDLE1BQU07VUFDTixPQUFPO1VBQ1AsT0FBTztVQUNQO1FBQUEsR0FDQyxPQUFBO01BQUE7SUFBQTtJQUlQLFlBQVksUUFBUSxXQUFXLEtBQUssS0FBSyxZQUFXO0FBQ2xELFVBQUksb0JBQW9CLEtBQUs7QUFDN0IsVUFBSSxXQUFXLGFBQWEsaUJBQWlCLE1BQUE7QUFDN0MsVUFBSSwwQkFBMEIsU0FBUztBQUd2QyxlQUFTLFFBQVEsQ0FBQSxZQUFXO0FBQzFCLFlBQUksV0FBVyxJQUFJLGFBQWEsU0FBUyxNQUFNLE1BQU07QUFDbkQ7QUFDQSxjQUFHLDRCQUE0QixHQUFFO0FBQUUsdUJBQUE7VUFBQTtRQUFBLENBQUE7QUFHckMsYUFBSyxVQUFVLFdBQVc7QUFDMUIsWUFBSSxVQUFVLFNBQVMsUUFBQSxFQUFVLElBQUksQ0FBQSxVQUFTLE1BQU0sbUJBQUEsQ0FBQTtBQUVwRCxZQUFJLFVBQVU7VUFDWixLQUFLLFFBQVEsYUFBYSxjQUFBO1VBQzFCO1VBQ0EsS0FBSyxLQUFLLGtCQUFrQixRQUFRLE1BQU0sU0FBQTtRQUFBO0FBRzVDLGFBQUssSUFBSSxVQUFVLE1BQU0sQ0FBQyw2QkFBNkIsT0FBQSxDQUFBO0FBRXZELGFBQUssY0FBYyxNQUFNLGdCQUFnQixTQUFTLENBQUEsU0FBUTtBQUN4RCxlQUFLLElBQUksVUFBVSxNQUFNLENBQUMsMEJBQTBCLElBQUEsQ0FBQTtBQUNwRCxjQUFHLEtBQUssT0FBTTtBQUNaLGlCQUFLLFNBQVMsR0FBQTtBQUNkLGdCQUFJLENBQUMsV0FBVyxVQUFVLEtBQUs7QUFDL0IsaUJBQUssSUFBSSxVQUFVLE1BQU0sQ0FBQyxtQkFBbUIsYUFBYSxNQUFBLENBQUE7VUFBQSxPQUNyRDtBQUNMLGdCQUFJLFVBQVUsQ0FBQyxhQUFhO0FBQzFCLG1CQUFLLFFBQVEsUUFBUSxNQUFNO0FBQ3pCLG9CQUFHLEtBQUssY0FBYyxtQkFBa0I7QUFBRSwyQkFBQTtnQkFBQTtjQUFBLENBQUE7WUFBQTtBQUc5QyxxQkFBUyxrQkFBa0IsTUFBTSxTQUFTLEtBQUssVUFBQTtVQUFBO1FBQUEsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQU12RCxnQkFBZ0IsTUFBTSxjQUFhO0FBQ2pDLFVBQUksU0FBUyxZQUFJLGlCQUFpQixLQUFLLEVBQUEsRUFBSSxPQUFPLENBQUEsT0FBTSxHQUFHLFNBQVMsSUFBQTtBQUNwRSxVQUFHLE9BQU8sV0FBVyxHQUFFO0FBQUUsaUJBQVMsZ0RBQWdELE9BQUE7TUFBQSxXQUMxRSxPQUFPLFNBQVMsR0FBRTtBQUFFLGlCQUFTLHVEQUF1RCxPQUFBO01BQUEsT0FDdkY7QUFBRSxvQkFBSSxjQUFjLE9BQU8sSUFBSSxtQkFBbUIsRUFBQyxRQUFRLEVBQUMsT0FBTyxhQUFBLEVBQUEsQ0FBQTtNQUFBO0lBQUE7SUFHMUUsaUJBQWlCLE1BQU0sUUFBUSxVQUFTO0FBQ3RDLFdBQUssV0FBVyxhQUFhLE1BQU0sQ0FBQyxNQUFNLGNBQWM7QUFDdEQsWUFBSSxRQUFRLEtBQUssU0FBUztBQUMxQixZQUFJLFdBQVcsS0FBSyxhQUFhLEtBQUssUUFBUSxnQkFBQSxDQUFBLEtBQXNCLEtBQUssYUFBYSxLQUFLLFFBQVEsUUFBQSxDQUFBO0FBRW5HLG1CQUFHLEtBQUssVUFBVSxVQUFVLE1BQU0sT0FBTyxDQUFDLFFBQVEsRUFBQyxTQUFTLE1BQU0sTUFBTSxRQUFnQixTQUFBLENBQUEsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQUk1RixjQUFjLE1BQU0sVUFBVSxVQUFTO0FBQ3JDLFVBQUksVUFBVSxLQUFLLFdBQVcsZUFBZSxJQUFBO0FBQzdDLFVBQUksU0FBUyxXQUFXLE1BQU0sS0FBSyxPQUFPLENBQUMsUUFBQSxHQUFXLE9BQUEsSUFBVztBQUNqRSxVQUFJLFdBQVcsTUFBTSxLQUFLLFdBQVcsU0FBUyxPQUFPLFNBQVMsSUFBQTtBQUU5RCxVQUFJLE9BQU8sS0FBSyxjQUFjLFFBQVEsY0FBYyxFQUFDLEtBQUssS0FBQSxHQUFPLENBQUEsU0FBUTtBQUN2RSxhQUFLLFdBQVcsaUJBQWlCLE1BQU07QUFDckMsY0FBRyxLQUFLLGVBQWM7QUFDcEIsaUJBQUssV0FBVyxZQUFZLE1BQU0sTUFBTSxVQUFVLE9BQUE7VUFBQSxPQUM3QztBQUNMLGdCQUFHLEtBQUssV0FBVyxrQkFBa0IsT0FBQSxHQUFTO0FBQzVDLG1CQUFLLE9BQU87WUFBQTtBQUVkLGlCQUFLLG9CQUFBO0FBQ0wsd0JBQVksU0FBUyxPQUFBO1VBQUE7UUFBQSxDQUFBO01BQUEsQ0FBQTtBQUszQixVQUFHLE1BQUs7QUFDTixhQUFLLFFBQVEsV0FBVyxRQUFBO01BQUEsT0FDbkI7QUFDTCxpQkFBQTtNQUFBO0lBQUE7SUFJSixpQkFBaUIsTUFBSztBQUNwQixVQUFHLEtBQUssY0FBYyxHQUFFO0FBQUUsZUFBTyxDQUFBO01BQUE7QUFFakMsVUFBSSxZQUFZLEtBQUssUUFBUSxRQUFBO0FBQzdCLFVBQUksV0FBVyxTQUFTLGNBQWMsVUFBQTtBQUN0QyxlQUFTLFlBQVk7QUFFckIsYUFDRSxZQUFJLElBQUksS0FBSyxJQUFJLFFBQVEsWUFBQSxFQUN0QixPQUFPLENBQUEsU0FBUSxLQUFLLE1BQU0sS0FBSyxZQUFZLElBQUEsQ0FBQSxFQUMzQyxPQUFPLENBQUEsU0FBUSxLQUFLLFNBQVMsU0FBUyxDQUFBLEVBQ3RDLE9BQU8sQ0FBQSxTQUFRLEtBQUssYUFBYSxLQUFLLFFBQVEsZ0JBQUEsQ0FBQSxNQUF1QixRQUFBLEVBQ3JFLElBQUksQ0FBQSxTQUFRO0FBQ1gsWUFBSSxVQUFVLFNBQVMsUUFBUSxjQUFjLFlBQVksS0FBSyxRQUFRLGNBQWMsS0FBSyxhQUFhLFNBQUEsS0FBQTtBQUN0RyxZQUFHLFNBQVE7QUFDVCxpQkFBTyxDQUFDLE1BQU0sU0FBUyxLQUFLLGtCQUFrQixPQUFBLENBQUE7UUFBQSxPQUN6QztBQUNMLGlCQUFPLENBQUMsTUFBTSxNQUFNLElBQUE7UUFBQTtNQUFBLENBQUEsRUFHdkIsT0FBTyxDQUFDLENBQUMsTUFBTSxTQUFTLFlBQVksT0FBQTtJQUFBO0lBSTNDLDZCQUE2QixlQUFjO0FBQ3pDLFVBQUksa0JBQWtCLGNBQWMsT0FBTyxDQUFBLFFBQU87QUFDaEQsZUFBTyxZQUFJLHNCQUFzQixLQUFLLElBQUksR0FBQSxFQUFLLFdBQVc7TUFBQSxDQUFBO0FBRTVELFVBQUcsZ0JBQWdCLFNBQVMsR0FBRTtBQUM1QixhQUFLLFlBQVksS0FBSyxHQUFHLGVBQUE7QUFFekIsYUFBSyxjQUFjLE1BQU0scUJBQXFCLEVBQUMsTUFBTSxnQkFBQSxHQUFrQixNQUFNO0FBRzNFLGVBQUssY0FBYyxLQUFLLFlBQVksT0FBTyxDQUFBLFFBQU8sZ0JBQWdCLFFBQVEsR0FBQSxNQUFTLEVBQUE7QUFJbkYsY0FBSSx3QkFBd0IsZ0JBQWdCLE9BQU8sQ0FBQSxRQUFPO0FBQ3hELG1CQUFPLFlBQUksc0JBQXNCLEtBQUssSUFBSSxHQUFBLEVBQUssV0FBVztVQUFBLENBQUE7QUFHNUQsY0FBRyxzQkFBc0IsU0FBUyxHQUFFO0FBQ2xDLGlCQUFLLGNBQWMsTUFBTSxrQkFBa0IsRUFBQyxNQUFNLHNCQUFBLEdBQXdCLENBQUMsU0FBUztBQUNsRixtQkFBSyxTQUFTLFVBQVUsS0FBSyxJQUFBO1lBQUEsQ0FBQTtVQUFBO1FBQUEsQ0FBQTtNQUFBO0lBQUE7SUFPdkMsWUFBWSxJQUFHO0FBQ2IsYUFBTyxLQUFLLFVBQVUsR0FBRyxhQUFhLGFBQUEsTUFBbUIsS0FBSyxNQUM1RCxNQUFNLEdBQUcsUUFBUSxpQkFBQSxHQUFvQixDQUFBLFNBQVEsS0FBSyxFQUFBLE1BQVEsS0FBSztJQUFBO0lBR25FLFdBQVcsTUFBTSxXQUFXLFVBQVUsT0FBTyxDQUFBLEdBQUc7QUFDOUMsa0JBQUksV0FBVyxNQUFNLG1CQUFtQixJQUFBO0FBQ3hDLFVBQUksY0FBYyxLQUFLLFdBQVcsUUFBUSxnQkFBQTtBQUMxQyxVQUFJLFNBQVMsTUFBTSxLQUFLLEtBQUssUUFBQTtBQUM3QixXQUFLLFdBQVcsa0JBQWtCLElBQUE7QUFDbEMsV0FBSyxlQUFlLE1BQU0sV0FBVyxVQUFVLE1BQU0sTUFBTTtBQUN6RCxlQUFPLFFBQVEsQ0FBQSxVQUFTLFlBQUksVUFBVSxPQUFPLFdBQUEsQ0FBQTtBQUM3QyxhQUFLLFdBQVcsNkJBQUE7TUFBQSxDQUFBO0lBQUE7SUFJcEIsUUFBUSxNQUFLO0FBQUUsYUFBTyxLQUFLLFdBQVcsUUFBUSxJQUFBO0lBQUE7RUFBQTtBQ3YvQmhELE1BQUEsYUFBQSxNQUFnQztJQUM5QixZQUFZLEtBQUssV0FBVyxPQUFPLENBQUEsR0FBRztBQUNwQyxXQUFLLFdBQVc7QUFDaEIsVUFBRyxDQUFDLGFBQWEsVUFBVSxZQUFZLFNBQVMsVUFBUztBQUN2RCxjQUFNLElBQUksTUFBTTs7Ozs7O09BQUE7TUFBQTtBQVFsQixXQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssSUFBQTtBQUNqQyxXQUFLLGdCQUFnQixLQUFLLGlCQUFpQjtBQUMzQyxXQUFLLE9BQU87QUFDWixXQUFLLFNBQVMsU0FBUSxLQUFLLFVBQVUsQ0FBQSxDQUFBO0FBQ3JDLFdBQUssYUFBYSxLQUFLO0FBQ3ZCLFdBQUssb0JBQW9CLEtBQUssWUFBWSxDQUFBO0FBQzFDLFdBQUssV0FBVyxPQUFPLE9BQU8sTUFBTSxRQUFBLEdBQVcsS0FBSyxZQUFZLENBQUEsQ0FBQTtBQUNoRSxXQUFLLGdCQUFnQjtBQUNyQixXQUFLLGFBQWE7QUFDbEIsV0FBSyxXQUFXO0FBQ2hCLFdBQUssT0FBTztBQUNaLFdBQUssaUJBQWlCO0FBQ3RCLFdBQUssdUJBQXVCO0FBQzVCLFdBQUssVUFBVTtBQUNmLFdBQUssUUFBUSxDQUFBO0FBQ2IsV0FBSyxPQUFPLE9BQU8sU0FBUztBQUM1QixXQUFLLGNBQWM7QUFDbkIsV0FBSyxrQkFBa0IsTUFBTSxPQUFPLFFBQUE7QUFDcEMsV0FBSyxRQUFRLEtBQUssU0FBUyxDQUFBO0FBQzNCLFdBQUssWUFBWSxLQUFLLGFBQWEsQ0FBQTtBQUNuQyxXQUFLLGdCQUFnQixLQUFLLGlCQUFpQjtBQUMzQyxXQUFLLHdCQUF3QjtBQUM3QixXQUFLLGFBQWEsS0FBSyxjQUFjO0FBQ3JDLFdBQUssa0JBQWtCLEtBQUssbUJBQW1CO0FBQy9DLFdBQUssa0JBQWtCLEtBQUssbUJBQW1CO0FBQy9DLFdBQUssaUJBQWlCLEtBQUssa0JBQWtCO0FBQzdDLFdBQUssZUFBZSxLQUFLLGdCQUFnQixPQUFPO0FBQ2hELFdBQUssaUJBQWlCLEtBQUssa0JBQWtCLE9BQU87QUFDcEQsV0FBSyxzQkFBc0I7QUFDM0IsV0FBSyxlQUFlLE9BQU8sT0FBTyxFQUFDLGFBQWEsU0FBQSxHQUFXLG1CQUFtQixTQUFBLEVBQUEsR0FBWSxLQUFLLE9BQU8sQ0FBQSxDQUFBO0FBQ3RHLFdBQUssY0FBYyxJQUFJLGNBQUE7QUFDdkIsYUFBTyxpQkFBaUIsWUFBWSxDQUFBLE9BQU07QUFDeEMsYUFBSyxXQUFXO01BQUEsQ0FBQTtBQUVsQixXQUFLLE9BQU8sT0FBTyxNQUFNO0FBQ3ZCLFlBQUcsS0FBSyxXQUFBLEdBQWE7QUFFbkIsaUJBQU8sU0FBUyxPQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7SUFPdEIsbUJBQWtCO0FBQUUsYUFBTyxLQUFLLGVBQWUsUUFBUSxjQUFBLE1BQW9CO0lBQUE7SUFFM0UsaUJBQWdCO0FBQUUsYUFBTyxLQUFLLGVBQWUsUUFBUSxZQUFBLE1BQWtCO0lBQUE7SUFFdkUsa0JBQWlCO0FBQUUsYUFBTyxLQUFLLGVBQWUsUUFBUSxZQUFBLE1BQWtCO0lBQUE7SUFFeEUsY0FBYTtBQUFFLFdBQUssZUFBZSxRQUFRLGNBQWMsTUFBQTtJQUFBO0lBRXpELGtCQUFpQjtBQUFFLFdBQUssZUFBZSxRQUFRLGdCQUFnQixNQUFBO0lBQUE7SUFFL0QsZUFBYztBQUFFLFdBQUssZUFBZSxRQUFRLGNBQWMsT0FBQTtJQUFBO0lBRTFELG1CQUFrQjtBQUFFLFdBQUssZUFBZSxXQUFXLGNBQUE7SUFBQTtJQUVuRCxpQkFBaUIsY0FBYTtBQUM1QixXQUFLLFlBQUE7QUFDTCxjQUFRLElBQUkseUdBQUE7QUFDWixXQUFLLGVBQWUsUUFBUSxvQkFBb0IsWUFBQTtJQUFBO0lBR2xELG9CQUFtQjtBQUFFLFdBQUssZUFBZSxXQUFXLGtCQUFBO0lBQUE7SUFFcEQsZ0JBQWU7QUFDYixVQUFJLE1BQU0sS0FBSyxlQUFlLFFBQVEsa0JBQUE7QUFDdEMsYUFBTyxNQUFNLFNBQVMsR0FBQSxJQUFPO0lBQUE7SUFHL0IsWUFBVztBQUFFLGFBQU8sS0FBSztJQUFBO0lBRXpCLFVBQVM7QUFFUCxVQUFHLE9BQU8sU0FBUyxhQUFhLGVBQWUsQ0FBQyxLQUFLLGdCQUFBLEdBQWtCO0FBQUUsYUFBSyxZQUFBO01BQUE7QUFDOUUsVUFBSSxZQUFZLE1BQU07QUFDcEIsWUFBRyxLQUFLLGNBQUEsR0FBZ0I7QUFDdEIsZUFBSyxtQkFBQTtBQUNMLGVBQUssT0FBTyxRQUFBO1FBQUEsV0FDSixLQUFLLE1BQUs7QUFDbEIsZUFBSyxPQUFPLFFBQUE7UUFBQSxPQUNQO0FBQ0wsZUFBSyxhQUFBO1FBQUE7TUFBQTtBQUdULFVBQUcsQ0FBQyxZQUFZLFVBQVUsYUFBQSxFQUFlLFFBQVEsU0FBUyxVQUFBLEtBQWUsR0FBRTtBQUN6RSxrQkFBQTtNQUFBLE9BQ0s7QUFDTCxpQkFBUyxpQkFBaUIsb0JBQW9CLE1BQU0sVUFBQSxDQUFBO01BQUE7SUFBQTtJQUl4RCxXQUFXLFVBQVM7QUFDbEIsbUJBQWEsS0FBSyxxQkFBQTtBQUNsQixXQUFLLE9BQU8sV0FBVyxRQUFBO0lBQUE7SUFHekIsaUJBQWlCLFdBQVU7QUFDekIsbUJBQWEsS0FBSyxxQkFBQTtBQUNsQixXQUFLLE9BQU8saUJBQWlCLFNBQUE7QUFDN0IsV0FBSyxRQUFBO0lBQUE7SUFHUCxPQUFPLElBQUksV0FBVyxZQUFZLE1BQUs7QUFDckMsV0FBSyxNQUFNLElBQUksQ0FBQSxTQUFRLFdBQUcsS0FBSyxXQUFXLFdBQVcsTUFBTSxFQUFBLENBQUE7SUFBQTtJQUs3RCxXQUFXLE1BQU0sTUFBSztBQUFFLFdBQUssYUFBYSxNQUFNLEdBQUcsSUFBQTtJQUFBO0lBRW5ELEtBQUssTUFBTSxNQUFLO0FBQ2QsVUFBRyxDQUFDLEtBQUssaUJBQUEsS0FBc0IsQ0FBQyxRQUFRLE1BQUs7QUFBRSxlQUFPLEtBQUE7TUFBQTtBQUN0RCxjQUFRLEtBQUssSUFBQTtBQUNiLFVBQUksU0FBUyxLQUFBO0FBQ2IsY0FBUSxRQUFRLElBQUE7QUFDaEIsYUFBTztJQUFBO0lBR1QsSUFBSSxNQUFNLE1BQU0sYUFBWTtBQUMxQixVQUFHLEtBQUssWUFBVztBQUNqQixZQUFJLENBQUMsS0FBSyxPQUFPLFlBQUE7QUFDakIsYUFBSyxXQUFXLE1BQU0sTUFBTSxLQUFLLEdBQUE7TUFBQSxXQUN6QixLQUFLLGVBQUEsR0FBaUI7QUFDOUIsWUFBSSxDQUFDLEtBQUssT0FBTyxZQUFBO0FBQ2pCLGNBQU0sTUFBTSxNQUFNLEtBQUssR0FBQTtNQUFBO0lBQUE7SUFJM0IsaUJBQWlCLFVBQVM7QUFDeEIsV0FBSyxZQUFZLE1BQU0sUUFBQTtJQUFBO0lBR3pCLFdBQVcsTUFBTSxTQUFTLFNBQVMsV0FBVTtJQUFBLEdBQUc7QUFDOUMsV0FBSyxZQUFZLGNBQWMsTUFBTSxTQUFTLE1BQUE7SUFBQTtJQUdoRCxVQUFVLFNBQVMsT0FBTyxJQUFHO0FBQzNCLGNBQVEsR0FBRyxPQUFPLENBQUEsU0FBUTtBQUN4QixZQUFJLFVBQVUsS0FBSyxjQUFBO0FBQ25CLFlBQUcsQ0FBQyxTQUFRO0FBQ1YsYUFBRyxJQUFBO1FBQUEsT0FDRTtBQUNMLHFCQUFXLE1BQU0sR0FBRyxJQUFBLEdBQU8sT0FBQTtRQUFBO01BQUEsQ0FBQTtJQUFBO0lBS2pDLFNBQVMsTUFBTSxNQUFNLE1BQUs7QUFDeEIsVUFBSSxVQUFVLEtBQUssY0FBQTtBQUNuQixVQUFJLGVBQWUsS0FBSztBQUN4QixVQUFHLENBQUMsU0FBUTtBQUNWLFlBQUcsS0FBSyxZQUFBLEtBQWlCLEtBQUssU0FBUTtBQUNwQyxpQkFBTyxLQUFBLEVBQU8sUUFBUSxXQUFXLE1BQU07QUFDckMsZ0JBQUcsS0FBSyxjQUFjLGdCQUFnQixDQUFDLEtBQUssWUFBQSxHQUFjO0FBQ3hELG1CQUFLLGlCQUFpQixNQUFNLE1BQU07QUFDaEMscUJBQUssSUFBSSxNQUFNLFdBQVcsTUFBTSxDQUFDLDZGQUFBLENBQUE7Y0FBQSxDQUFBO1lBQUE7VUFBQSxDQUFBO1FBQUEsT0FJbEM7QUFDTCxpQkFBTyxLQUFBO1FBQUE7TUFBQTtBQUlYLFVBQUksV0FBVztRQUNiLFVBQVUsQ0FBQTtRQUNWLFFBQVEsTUFBTSxJQUFHO0FBQUUsZUFBSyxTQUFTLEtBQUssQ0FBQyxNQUFNLEVBQUEsQ0FBQTtRQUFBO01BQUE7QUFFL0MsaUJBQVcsTUFBTTtBQUNmLFlBQUcsS0FBSyxZQUFBLEdBQWM7QUFBRTtRQUFBO0FBQ3hCLGlCQUFTLFNBQVMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLFFBQVEsSUFBSSxRQUFRLE1BQU0sRUFBQSxHQUFLLEtBQUEsQ0FBQTtNQUFBLEdBQ3BFLE9BQUE7QUFDSCxhQUFPO0lBQUE7SUFHVCxpQkFBaUIsTUFBTSxLQUFJO0FBQ3pCLG1CQUFhLEtBQUsscUJBQUE7QUFDbEIsV0FBSyxXQUFBO0FBQ0wsVUFBSSxRQUFRLEtBQUs7QUFDakIsVUFBSSxRQUFRLEtBQUs7QUFDakIsVUFBSSxVQUFVLEtBQUssTUFBTSxLQUFLLE9BQUEsSUFBWSxTQUFRLFFBQVEsRUFBQSxJQUFNO0FBQ2hFLFVBQUksUUFBUSxnQkFBUSxZQUFZLEtBQUssY0FBYyxPQUFPLFNBQVMsVUFBVSxxQkFBcUIsR0FBRyxDQUFBLFVBQVMsUUFBUSxDQUFBO0FBQ3RILFVBQUcsUUFBUSxLQUFLLFlBQVc7QUFDekIsa0JBQVUsS0FBSztNQUFBO0FBRWpCLFdBQUssd0JBQXdCLFdBQVcsTUFBTTtBQUU1QyxZQUFHLEtBQUssWUFBQSxLQUFpQixLQUFLLFlBQUEsR0FBYztBQUFFO1FBQUE7QUFDOUMsYUFBSyxRQUFBO0FBQ0wsY0FBTSxJQUFBLElBQVEsS0FBSyxJQUFJLE1BQU0sUUFBUSxNQUFNLENBQUMsZUFBZSwyQkFBQSxDQUFBO0FBQzNELFlBQUcsUUFBUSxLQUFLLFlBQVc7QUFDekIsZUFBSyxJQUFJLE1BQU0sUUFBUSxNQUFNLENBQUMsWUFBWSxLQUFLLHdEQUFBLENBQUE7UUFBQTtBQUVqRCxZQUFHLEtBQUssZUFBQSxHQUFpQjtBQUN2QixpQkFBTyxXQUFXLEtBQUs7UUFBQSxPQUNsQjtBQUNMLGlCQUFPLFNBQVMsT0FBQTtRQUFBO01BQUEsR0FFakIsT0FBQTtJQUFBO0lBR0wsaUJBQWlCLE1BQUs7QUFDcEIsYUFBTyxRQUFRLEtBQUssV0FBVyxVQUFBLElBQWMsY0FBTSxLQUFLLE1BQU0sR0FBQSxFQUFLLE1BQU0sS0FBSyxNQUFNO0lBQUE7SUFHdEYsYUFBWTtBQUFFLGFBQU8sS0FBSztJQUFBO0lBRTFCLGNBQWE7QUFBRSxhQUFPLEtBQUssT0FBTyxZQUFBO0lBQUE7SUFFbEMsbUJBQWtCO0FBQUUsYUFBTyxLQUFLO0lBQUE7SUFFaEMsUUFBUSxNQUFLO0FBQUUsYUFBTyxHQUFHLEtBQUssaUJBQUEsSUFBcUI7SUFBQTtJQUVuRCxRQUFRLE9BQU8sUUFBTztBQUFFLGFBQU8sS0FBSyxPQUFPLFFBQVEsT0FBTyxNQUFBO0lBQUE7SUFFMUQsZUFBYztBQUNaLFdBQUssbUJBQW1CLEVBQUMsTUFBTSxLQUFBLENBQUE7QUFDL0IsVUFBSSxPQUFPLEtBQUssWUFBWSxTQUFTLElBQUE7QUFDckMsV0FBSyxRQUFRLEtBQUssUUFBQSxDQUFBO0FBQ2xCLFdBQUssU0FBQTtBQUNMLFdBQUssT0FBTztBQUNaLGFBQU8sc0JBQXNCLE1BQU0sS0FBSyxlQUFBLENBQUE7SUFBQTtJQUcxQyxnQkFBZTtBQUNiLFVBQUksYUFBYTtBQUNqQixrQkFBSSxJQUFJLFVBQVUsR0FBRywwQkFBMEIsbUJBQW1CLENBQUEsV0FBVTtBQUMxRSxZQUFHLENBQUMsS0FBSyxZQUFZLE9BQU8sRUFBQSxHQUFJO0FBQzlCLGNBQUksT0FBTyxLQUFLLFlBQVksTUFBQTtBQUM1QixlQUFLLFFBQVEsS0FBSyxRQUFBLENBQUE7QUFDbEIsZUFBSyxLQUFBO0FBQ0wsY0FBRyxPQUFPLGFBQWEsUUFBQSxHQUFVO0FBQUUsaUJBQUssT0FBTztVQUFBO1FBQUE7QUFFakQscUJBQWE7TUFBQSxDQUFBO0FBRWYsYUFBTztJQUFBO0lBR1QsU0FBUyxJQUFJLE9BQU07QUFDakIsV0FBSyxXQUFBO0FBQ0wsc0JBQVEsU0FBUyxJQUFJLEtBQUE7SUFBQTtJQUd2QixZQUFZLE1BQU0sT0FBTyxXQUFXLE1BQU0sVUFBVSxLQUFLLGVBQWUsSUFBQSxHQUFNO0FBQzVFLFVBQUksY0FBYyxLQUFLLGdCQUFnQjtBQUN2QyxXQUFLLGlCQUFpQixLQUFLLGtCQUFrQixLQUFLLEtBQUs7QUFDdkQsVUFBSSxZQUFZLFlBQUksVUFBVSxLQUFLLGdCQUFnQixFQUFBO0FBQ25ELFdBQUssS0FBSyxXQUFXLEtBQUssYUFBQTtBQUMxQixXQUFLLEtBQUssUUFBQTtBQUVWLFdBQUssT0FBTyxLQUFLLFlBQVksV0FBVyxPQUFPLFdBQUE7QUFDL0MsV0FBSyxLQUFLLFlBQVksSUFBQTtBQUN0QixXQUFLLGtCQUFBO0FBQ0wsV0FBSyxLQUFLLEtBQUssQ0FBQyxXQUFXLFdBQVc7QUFDcEMsWUFBRyxjQUFjLEtBQUssS0FBSyxrQkFBa0IsT0FBQSxHQUFTO0FBQ3BELGVBQUssaUJBQWlCLE1BQU07QUFDMUIsd0JBQUksY0FBYyxRQUFBLEVBQVUsUUFBUSxDQUFBLE9BQU0sVUFBVSxZQUFZLEVBQUEsQ0FBQTtBQUNoRSxpQkFBSyxlQUFlLFlBQVksU0FBQTtBQUNoQyxpQkFBSyxpQkFBaUI7QUFDdEIsd0JBQVksc0JBQXNCLFFBQUE7QUFDbEMsbUJBQUE7VUFBQSxDQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7SUFNUixrQkFBa0IsVUFBUztBQUN6QixVQUFJLGFBQWEsS0FBSyxRQUFRLFFBQUE7QUFDOUIsaUJBQVcsWUFBWSxZQUFJLElBQUksVUFBVSxJQUFJLGFBQUE7QUFDN0MsZUFBUyxRQUFRLENBQUEsT0FBTTtBQUNyQixZQUFHLFNBQVMsS0FBSyxTQUFTLEVBQUEsR0FBSTtBQUM1QixlQUFLLE9BQU8sSUFBSSxHQUFHLGFBQWEsVUFBQSxHQUFhLFFBQUE7UUFBQTtNQUFBLENBQUE7SUFBQTtJQUtuRCxVQUFVLElBQUc7QUFBRSxhQUFPLEdBQUcsZ0JBQWdCLEdBQUcsYUFBYSxXQUFBLE1BQWlCO0lBQUE7SUFFMUUsWUFBWSxJQUFJLE9BQU8sYUFBWTtBQUNqQyxVQUFJLE9BQU8sSUFBSSxLQUFLLElBQUksTUFBTSxNQUFNLE9BQU8sV0FBQTtBQUMzQyxXQUFLLE1BQU0sS0FBSyxNQUFNO0FBQ3RCLGFBQU87SUFBQTtJQUdULE1BQU0sU0FBUyxVQUFTO0FBQ3RCLFVBQUksT0FBTyxNQUFNLFFBQVEsUUFBUSxpQkFBQSxHQUFvQixDQUFBLE9BQU0sS0FBSyxZQUFZLEVBQUEsQ0FBQSxLQUFRLEtBQUs7QUFDekYsVUFBRyxNQUFLO0FBQUUsaUJBQVMsSUFBQTtNQUFBO0lBQUE7SUFHckIsYUFBYSxTQUFTLFVBQVM7QUFDN0IsV0FBSyxNQUFNLFNBQVMsQ0FBQSxTQUFRLFNBQVMsTUFBTSxPQUFBLENBQUE7SUFBQTtJQUc3QyxZQUFZLElBQUc7QUFDYixVQUFJLFNBQVMsR0FBRyxhQUFhLFdBQUE7QUFDN0IsYUFBTyxNQUFNLEtBQUssWUFBWSxNQUFBLEdBQVMsQ0FBQSxTQUFRLEtBQUssa0JBQWtCLEVBQUEsQ0FBQTtJQUFBO0lBR3hFLFlBQVksSUFBRztBQUFFLGFBQU8sS0FBSyxNQUFNO0lBQUE7SUFFbkMsa0JBQWlCO0FBQ2YsZUFBUSxNQUFNLEtBQUssT0FBTTtBQUN2QixhQUFLLE1BQU0sSUFBSSxRQUFBO0FBQ2YsZUFBTyxLQUFLLE1BQU07TUFBQTtBQUVwQixXQUFLLE9BQU87SUFBQTtJQUdkLGdCQUFnQixJQUFHO0FBQ2pCLFVBQUksT0FBTyxLQUFLLFlBQVksR0FBRyxhQUFhLFdBQUEsQ0FBQTtBQUM1QyxVQUFHLFFBQVEsS0FBSyxPQUFPLEdBQUcsSUFBRztBQUMzQixhQUFLLFFBQUE7QUFDTCxlQUFPLEtBQUssTUFBTSxLQUFLO01BQUEsV0FDZixNQUFLO0FBQ2IsYUFBSyxrQkFBa0IsR0FBRyxFQUFBO01BQUE7SUFBQTtJQUk5QixpQkFBaUIsUUFBTztBQUN0QixVQUFHLEtBQUssa0JBQWtCLFFBQU87QUFBRTtNQUFBO0FBQ25DLFdBQUssZ0JBQWdCO0FBQ3JCLFVBQUksU0FBUyxNQUFNO0FBQ2pCLFlBQUcsV0FBVyxLQUFLLGVBQWM7QUFBRSxlQUFLLGdCQUFnQjtRQUFBO0FBQ3hELGVBQU8sb0JBQW9CLFdBQVcsSUFBQTtBQUN0QyxlQUFPLG9CQUFvQixZQUFZLElBQUE7TUFBQTtBQUV6QyxhQUFPLGlCQUFpQixXQUFXLE1BQUE7QUFDbkMsYUFBTyxpQkFBaUIsWUFBWSxNQUFBO0lBQUE7SUFHdEMsbUJBQWtCO0FBQ2hCLFVBQUcsU0FBUyxrQkFBa0IsU0FBUyxNQUFLO0FBQzFDLGVBQU8sS0FBSyxpQkFBaUIsU0FBUztNQUFBLE9BQ2pDO0FBRUwsZUFBTyxTQUFTLGlCQUFpQixTQUFTO01BQUE7SUFBQTtJQUk5QyxrQkFBa0IsTUFBSztBQUNyQixVQUFHLEtBQUssY0FBYyxLQUFLLFlBQVksS0FBSyxVQUFBLEdBQVk7QUFDdEQsYUFBSyxhQUFhO01BQUE7SUFBQTtJQUl0QiwrQkFBOEI7QUFDNUIsVUFBRyxLQUFLLGNBQWMsS0FBSyxlQUFlLFNBQVMsTUFBSztBQUN0RCxhQUFLLFdBQVcsTUFBQTtNQUFBO0lBQUE7SUFJcEIsb0JBQW1CO0FBQ2pCLFdBQUssYUFBYSxLQUFLLGlCQUFBO0FBQ3ZCLFVBQUcsS0FBSyxlQUFlLFNBQVMsTUFBSztBQUFFLGFBQUssV0FBVyxLQUFBO01BQUE7SUFBQTtJQUd6RCxtQkFBbUIsRUFBQyxTQUFRLENBQUEsR0FBRztBQUM3QixVQUFHLEtBQUsscUJBQW9CO0FBQUU7TUFBQTtBQUU5QixXQUFLLHNCQUFzQjtBQUUzQixXQUFLLE9BQU8sUUFBUSxDQUFBLFVBQVM7QUFDM0IsWUFBRyxTQUFTLE1BQU0sU0FBUyxPQUFRLEtBQUssTUFBSztBQUMzQyxlQUFLLGlCQUFpQixLQUFLLElBQUE7UUFBQTtNQUFBLENBQUE7QUFHL0IsZUFBUyxLQUFLLGlCQUFpQixTQUFTLFdBQVc7TUFBQSxDQUFBO0FBQ25ELGFBQU8saUJBQWlCLFlBQVksQ0FBQSxNQUFLO0FBQ3ZDLFlBQUcsRUFBRSxXQUFVO0FBQ2IsZUFBSyxVQUFBLEVBQVksV0FBQTtBQUNqQixlQUFLLGdCQUFnQixFQUFDLElBQUksT0FBTyxTQUFTLE1BQU0sTUFBTSxXQUFBLENBQUE7QUFDdEQsaUJBQU8sU0FBUyxPQUFBO1FBQUE7TUFBQSxHQUVqQixJQUFBO0FBQ0gsVUFBRyxDQUFDLE1BQUs7QUFBRSxhQUFLLFFBQUE7TUFBQTtBQUNoQixXQUFLLFdBQUE7QUFDTCxVQUFHLENBQUMsTUFBSztBQUFFLGFBQUssVUFBQTtNQUFBO0FBQ2hCLFdBQUssS0FBSyxFQUFDLE9BQU8sU0FBUyxTQUFTLFVBQUEsR0FBWSxDQUFDLEdBQUcsTUFBTSxNQUFNLFVBQVUsVUFBVSxnQkFBZ0I7QUFDbEcsWUFBSSxXQUFXLFNBQVMsYUFBYSxLQUFLLFFBQVEsT0FBQSxDQUFBO0FBQ2xELFlBQUksYUFBYSxFQUFFLE9BQU8sRUFBRSxJQUFJLFlBQUE7QUFDaEMsWUFBRyxZQUFZLFNBQVMsWUFBQSxNQUFrQixZQUFXO0FBQUU7UUFBQTtBQUV2RCxZQUFJLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBQSxHQUFRLEtBQUssVUFBVSxNQUFNLEdBQUcsUUFBQSxFQUFBO0FBQ25ELG1CQUFHLEtBQUssTUFBTSxVQUFVLE1BQU0sVUFBVSxDQUFDLFFBQVEsRUFBQyxLQUFBLENBQUEsQ0FBQTtNQUFBLENBQUE7QUFFcEQsV0FBSyxLQUFLLEVBQUMsTUFBTSxZQUFZLE9BQU8sVUFBQSxHQUFZLENBQUMsR0FBRyxNQUFNLE1BQU0sVUFBVSxVQUFVLGdCQUFnQjtBQUNsRyxZQUFHLENBQUMsYUFBWTtBQUNkLGNBQUksT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFBLEdBQVEsS0FBSyxVQUFVLE1BQU0sR0FBRyxRQUFBLEVBQUE7QUFDbkQscUJBQUcsS0FBSyxNQUFNLFVBQVUsTUFBTSxVQUFVLENBQUMsUUFBUSxFQUFDLEtBQUEsQ0FBQSxDQUFBO1FBQUE7TUFBQSxDQUFBO0FBR3RELFdBQUssS0FBSyxFQUFDLE1BQU0sUUFBUSxPQUFPLFFBQUEsR0FBVSxDQUFDLEdBQUcsTUFBTSxNQUFNLFVBQVUsV0FBVyxVQUFVLGNBQWM7QUFFckcsWUFBRyxjQUFjLFVBQVM7QUFDeEIsY0FBSSxPQUFPLEtBQUssVUFBVSxNQUFNLEdBQUcsUUFBQTtBQUNuQyxxQkFBRyxLQUFLLE1BQU0sVUFBVSxNQUFNLFVBQVUsQ0FBQyxRQUFRLEVBQUMsS0FBQSxDQUFBLENBQUE7UUFBQTtNQUFBLENBQUE7QUFHdEQsYUFBTyxpQkFBaUIsWUFBWSxDQUFBLE1BQUssRUFBRSxlQUFBLENBQUE7QUFDM0MsYUFBTyxpQkFBaUIsUUFBUSxDQUFBLE1BQUs7QUFDbkMsVUFBRSxlQUFBO0FBQ0YsWUFBSSxlQUFlLE1BQU0sa0JBQWtCLEVBQUUsUUFBUSxLQUFLLFFBQVEsZUFBQSxDQUFBLEdBQW1CLENBQUEsZUFBYztBQUNqRyxpQkFBTyxXQUFXLGFBQWEsS0FBSyxRQUFRLGVBQUEsQ0FBQTtRQUFBLENBQUE7QUFFOUMsWUFBSSxhQUFhLGdCQUFnQixTQUFTLGVBQWUsWUFBQTtBQUN6RCxZQUFJLFFBQVEsTUFBTSxLQUFLLEVBQUUsYUFBYSxTQUFTLENBQUEsQ0FBQTtBQUMvQyxZQUFHLENBQUMsY0FBYyxXQUFXLFlBQVksTUFBTSxXQUFXLEtBQUssQ0FBRSxZQUFXLGlCQUFpQixXQUFVO0FBQUU7UUFBQTtBQUV6RyxxQkFBYSxXQUFXLFlBQVksS0FBQTtBQUNwQyxtQkFBVyxjQUFjLElBQUksTUFBTSxTQUFTLEVBQUMsU0FBUyxLQUFBLENBQUEsQ0FBQTtNQUFBLENBQUE7QUFFeEQsV0FBSyxHQUFHLG1CQUFtQixDQUFBLE1BQUs7QUFDOUIsWUFBSSxlQUFlLEVBQUU7QUFDckIsWUFBRyxDQUFDLFlBQUksY0FBYyxZQUFBLEdBQWM7QUFBRTtRQUFBO0FBQ3RDLFlBQUksUUFBUSxNQUFNLEtBQUssRUFBRSxPQUFPLFNBQVMsQ0FBQSxDQUFBLEVBQUksT0FBTyxDQUFBLE1BQUssYUFBYSxRQUFRLGFBQWEsSUFBQTtBQUMzRixxQkFBYSxXQUFXLGNBQWMsS0FBQTtBQUN0QyxxQkFBYSxjQUFjLElBQUksTUFBTSxTQUFTLEVBQUMsU0FBUyxLQUFBLENBQUEsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQUk1RCxVQUFVLFdBQVcsR0FBRyxVQUFTO0FBQy9CLFVBQUksV0FBVyxLQUFLLGtCQUFrQjtBQUN0QyxhQUFPLFdBQVcsU0FBUyxHQUFHLFFBQUEsSUFBWSxDQUFBO0lBQUE7SUFHNUMsZUFBZSxNQUFLO0FBQ2xCLFdBQUs7QUFDTCxXQUFLLGNBQWM7QUFDbkIsYUFBTyxLQUFLO0lBQUE7SUFHZCxrQkFBa0IsU0FBUTtBQUN4QixVQUFHLEtBQUssWUFBWSxTQUFRO0FBQzFCLGVBQU87TUFBQSxPQUNGO0FBQ0wsYUFBSyxPQUFPLEtBQUs7QUFDakIsYUFBSyxjQUFjO0FBQ25CLGVBQU87TUFBQTtJQUFBO0lBSVgsVUFBUztBQUFFLGFBQU8sS0FBSztJQUFBO0lBRXZCLGlCQUFnQjtBQUFFLGFBQU8sQ0FBQyxDQUFDLEtBQUs7SUFBQTtJQUVoQyxLQUFLLFFBQVEsVUFBUztBQUNwQixlQUFRLFNBQVMsUUFBTztBQUN0QixZQUFJLG1CQUFtQixPQUFPO0FBRTlCLGFBQUssR0FBRyxrQkFBa0IsQ0FBQSxNQUFLO0FBQzdCLGNBQUksVUFBVSxLQUFLLFFBQVEsS0FBQTtBQUMzQixjQUFJLGdCQUFnQixLQUFLLFFBQVEsVUFBVSxPQUFBO0FBQzNDLGNBQUksaUJBQWlCLEVBQUUsT0FBTyxnQkFBZ0IsRUFBRSxPQUFPLGFBQWEsT0FBQTtBQUNwRSxjQUFHLGdCQUFlO0FBQ2hCLGlCQUFLLFNBQVMsRUFBRSxRQUFRLEdBQUcsa0JBQWtCLE1BQU07QUFDakQsbUJBQUssYUFBYSxFQUFFLFFBQVEsQ0FBQSxTQUFRO0FBQ2xDLHlCQUFTLEdBQUcsT0FBTyxNQUFNLEVBQUUsUUFBUSxnQkFBZ0IsSUFBQTtjQUFBLENBQUE7WUFBQSxDQUFBO1VBQUEsT0FHbEQ7QUFDTCx3QkFBSSxJQUFJLFVBQVUsSUFBSSxrQkFBa0IsQ0FBQSxPQUFNO0FBQzVDLGtCQUFJLFdBQVcsR0FBRyxhQUFhLGFBQUE7QUFDL0IsbUJBQUssU0FBUyxJQUFJLEdBQUcsa0JBQWtCLE1BQU07QUFDM0MscUJBQUssYUFBYSxJQUFJLENBQUEsU0FBUTtBQUM1QiwyQkFBUyxHQUFHLE9BQU8sTUFBTSxJQUFJLFVBQVUsUUFBQTtnQkFBQSxDQUFBO2NBQUEsQ0FBQTtZQUFBLENBQUE7VUFBQTtRQUFBLENBQUE7TUFBQTtJQUFBO0lBU3JELGFBQVk7QUFDVixhQUFPLGlCQUFpQixhQUFhLENBQUEsTUFBSyxLQUFLLHVCQUF1QixFQUFFLE1BQUE7QUFDeEUsV0FBSyxVQUFVLFNBQVMsU0FBUyxLQUFBO0FBQ2pDLFdBQUssVUFBVSxhQUFhLGlCQUFpQixJQUFBO0lBQUE7SUFHL0MsVUFBVSxXQUFXLGFBQWEsU0FBUTtBQUN4QyxVQUFJLFFBQVEsS0FBSyxRQUFRLFdBQUE7QUFDekIsYUFBTyxpQkFBaUIsV0FBVyxDQUFBLE1BQUs7QUFDdEMsWUFBSSxTQUFTO0FBQ2IsWUFBRyxTQUFRO0FBQ1QsbUJBQVMsRUFBRSxPQUFPLFFBQVEsSUFBSSxRQUFBLElBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxjQUFjLElBQUksUUFBQTtRQUFBLE9BQzNFO0FBQ0wsY0FBSSx1QkFBdUIsS0FBSyx3QkFBd0IsRUFBRTtBQUMxRCxtQkFBUyxrQkFBa0Isc0JBQXNCLEtBQUE7QUFDakQsZUFBSyxrQkFBa0IsR0FBRyxvQkFBQTtBQUMxQixlQUFLLHVCQUF1QjtRQUFBO0FBRTlCLFlBQUksV0FBVyxVQUFVLE9BQU8sYUFBYSxLQUFBO0FBQzdDLFlBQUcsQ0FBQyxVQUFTO0FBQUU7UUFBQTtBQUNmLFlBQUcsT0FBTyxhQUFhLE1BQUEsTUFBWSxLQUFJO0FBQUUsWUFBRSxlQUFBO1FBQUE7QUFFM0MsYUFBSyxTQUFTLFFBQVEsR0FBRyxTQUFTLE1BQU07QUFDdEMsZUFBSyxhQUFhLFFBQVEsQ0FBQSxTQUFRO0FBQ2hDLHVCQUFHLEtBQUssU0FBUyxVQUFVLE1BQU0sUUFBUSxDQUFDLFFBQVEsRUFBQyxNQUFNLEtBQUssVUFBVSxTQUFTLEdBQUcsTUFBQSxFQUFBLENBQUEsQ0FBQTtVQUFBLENBQUE7UUFBQSxDQUFBO01BQUEsR0FHdkYsT0FBQTtJQUFBO0lBR0wsa0JBQWtCLEdBQUcsZ0JBQWU7QUFDbEMsVUFBSSxlQUFlLEtBQUssUUFBUSxZQUFBO0FBQ2hDLGtCQUFJLElBQUksVUFBVSxJQUFJLGlCQUFpQixDQUFBLE9BQU07QUFDM0MsWUFBRyxDQUFFLElBQUcsV0FBVyxjQUFBLEtBQW1CLEdBQUcsU0FBUyxjQUFBLElBQWlCO0FBQ2pFLGVBQUssYUFBYSxFQUFFLFFBQVEsQ0FBQSxTQUFRO0FBQ2xDLGdCQUFJLFdBQVcsR0FBRyxhQUFhLFlBQUE7QUFDL0IsZ0JBQUcsV0FBRyxVQUFVLEVBQUEsR0FBSTtBQUNsQix5QkFBRyxLQUFLLFNBQVMsVUFBVSxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUMsTUFBTSxLQUFLLFVBQVUsU0FBUyxHQUFHLEVBQUUsTUFBQSxFQUFBLENBQUEsQ0FBQTtZQUFBO1VBQUEsQ0FBQTtRQUFBO01BQUEsQ0FBQTtJQUFBO0lBTzVGLFVBQVM7QUFDUCxVQUFHLENBQUMsZ0JBQVEsYUFBQSxHQUFlO0FBQUU7TUFBQTtBQUM3QixVQUFHLFFBQVEsbUJBQWtCO0FBQUUsZ0JBQVEsb0JBQW9CO01BQUE7QUFDM0QsVUFBSSxjQUFjO0FBQ2xCLGFBQU8saUJBQWlCLFVBQVUsQ0FBQSxPQUFNO0FBQ3RDLHFCQUFhLFdBQUE7QUFDYixzQkFBYyxXQUFXLE1BQU07QUFDN0IsMEJBQVEsbUJBQW1CLENBQUEsVUFBUyxPQUFPLE9BQU8sT0FBTyxFQUFDLFFBQVEsT0FBTyxRQUFBLENBQUEsQ0FBQTtRQUFBLEdBQ3hFLEdBQUE7TUFBQSxDQUFBO0FBRUwsYUFBTyxpQkFBaUIsWUFBWSxDQUFBLFVBQVM7QUFDM0MsWUFBRyxDQUFDLEtBQUssb0JBQW9CLE9BQU8sUUFBQSxHQUFVO0FBQUU7UUFBQTtBQUNoRCxZQUFJLEVBQUMsTUFBTSxJQUFJLE1BQU0sb0JBQVUsTUFBTSxTQUFTLENBQUE7QUFDOUMsWUFBSSxPQUFPLE9BQU8sU0FBUztBQUUzQixhQUFLLGlCQUFpQixNQUFNO0FBQzFCLGNBQUcsS0FBSyxLQUFLLFlBQUEsS0FBa0IsVUFBUyxXQUFXLE9BQU8sS0FBSyxLQUFLLEtBQUk7QUFDdEUsaUJBQUssS0FBSyxjQUFjLE1BQU0sSUFBQTtVQUFBLE9BQ3pCO0FBQ0wsaUJBQUssWUFBWSxNQUFNLE1BQU0sTUFBTTtBQUNqQyxrQkFBRyxNQUFLO0FBQUUscUJBQUssbUJBQUE7Y0FBQTtBQUNmLGtCQUFHLE9BQU8sWUFBWSxVQUFTO0FBQzdCLDJCQUFXLE1BQU07QUFDZix5QkFBTyxTQUFTLEdBQUcsT0FBQTtnQkFBQSxHQUNsQixDQUFBO2NBQUE7WUFBQSxDQUFBO1VBQUE7UUFBQSxDQUFBO01BQUEsR0FLVixLQUFBO0FBQ0gsYUFBTyxpQkFBaUIsU0FBUyxDQUFBLE1BQUs7QUFDcEMsWUFBSSxTQUFTLGtCQUFrQixFQUFFLFFBQVEsYUFBQTtBQUN6QyxZQUFJLE9BQU8sVUFBVSxPQUFPLGFBQWEsYUFBQTtBQUN6QyxZQUFJLGNBQWMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFdBQVc7QUFDekQsWUFBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFlBQUEsS0FBaUIsQ0FBQyxLQUFLLFFBQVEsYUFBWTtBQUFFO1FBQUE7QUFFL0QsWUFBSSxPQUFPLE9BQU87QUFDbEIsWUFBSSxZQUFZLE9BQU8sYUFBYSxjQUFBO0FBQ3BDLFVBQUUsZUFBQTtBQUNGLFVBQUUseUJBQUE7QUFDRixZQUFHLEtBQUssZ0JBQWdCLE1BQUs7QUFBRTtRQUFBO0FBRS9CLGFBQUssaUJBQWlCLE1BQU07QUFDMUIsY0FBRyxTQUFTLFNBQVE7QUFDbEIsaUJBQUssaUJBQWlCLE1BQU0sV0FBVyxNQUFBO1VBQUEsV0FDL0IsU0FBUyxZQUFXO0FBQzVCLGlCQUFLLGdCQUFnQixNQUFNLFNBQUE7VUFBQSxPQUN0QjtBQUNMLGtCQUFNLElBQUksTUFBTSxZQUFZLG1EQUFtRCxNQUFBO1VBQUE7QUFFakYsY0FBSSxXQUFXLE9BQU8sYUFBYSxLQUFLLFFBQVEsT0FBQSxDQUFBO0FBQ2hELGNBQUcsVUFBUztBQUNWLGlCQUFLLGlCQUFpQixNQUFNLEtBQUssT0FBTyxRQUFRLFVBQVUsT0FBQSxDQUFBO1VBQUE7UUFBQSxDQUFBO01BQUEsR0FHN0QsS0FBQTtJQUFBO0lBR0wsY0FBYyxPQUFPLFVBQVUsQ0FBQSxHQUFHO0FBQ2hDLGtCQUFJLGNBQWMsUUFBUSxPQUFPLFNBQVMsRUFBQyxRQUFRLFFBQUEsQ0FBQTtJQUFBO0lBR3JELGVBQWUsUUFBTztBQUNwQixhQUFPLFFBQVEsQ0FBQyxDQUFDLE9BQU8sYUFBYSxLQUFLLGNBQWMsT0FBTyxPQUFBLENBQUE7SUFBQTtJQUdqRSxnQkFBZ0IsTUFBTSxVQUFTO0FBQzdCLGtCQUFJLGNBQWMsUUFBUSwwQkFBMEIsRUFBQyxRQUFRLEtBQUEsQ0FBQTtBQUM3RCxVQUFJLE9BQU8sTUFBTSxZQUFJLGNBQWMsUUFBUSx5QkFBeUIsRUFBQyxRQUFRLEtBQUEsQ0FBQTtBQUM3RSxhQUFPLFdBQVcsU0FBUyxJQUFBLElBQVE7SUFBQTtJQUdyQyxpQkFBaUIsTUFBTSxXQUFXLFVBQVM7QUFDekMsVUFBRyxDQUFDLEtBQUssWUFBQSxHQUFjO0FBQUUsZUFBTyxnQkFBUSxTQUFTLElBQUE7TUFBQTtBQUVqRCxXQUFLLGdCQUFnQixFQUFDLElBQUksTUFBTSxNQUFNLFFBQUEsR0FBVSxDQUFBLFNBQVE7QUFDdEQsYUFBSyxLQUFLLGNBQWMsTUFBTSxVQUFVLENBQUEsWUFBVztBQUNqRCxlQUFLLGFBQWEsTUFBTSxXQUFXLE9BQUE7QUFDbkMsZUFBQTtRQUFBLENBQUE7TUFBQSxDQUFBO0lBQUE7SUFLTixhQUFhLE1BQU0sV0FBVyxVQUFVLEtBQUssZUFBZSxJQUFBLEdBQU07QUFDaEUsVUFBRyxDQUFDLEtBQUssa0JBQWtCLE9BQUEsR0FBUztBQUFFO01BQUE7QUFFdEMsc0JBQVEsVUFBVSxXQUFXLEVBQUMsTUFBTSxTQUFTLElBQUksS0FBSyxLQUFLLEdBQUEsR0FBSyxJQUFBO0FBQ2hFLFdBQUssb0JBQW9CLE9BQU8sUUFBQTtJQUFBO0lBR2xDLGdCQUFnQixNQUFNLFdBQVcsT0FBTTtBQUVyQyxVQUFHLENBQUMsS0FBSyxZQUFBLEdBQWM7QUFBRSxlQUFPLGdCQUFRLFNBQVMsTUFBTSxLQUFBO01BQUE7QUFDdkQsVUFBRyxlQUFlLEtBQUssSUFBQSxHQUFNO0FBQzNCLFlBQUksRUFBQyxVQUFVLFNBQVEsT0FBTztBQUM5QixlQUFPLEdBQUcsYUFBYSxPQUFPO01BQUE7QUFFaEMsVUFBSSxVQUFTLE9BQU87QUFDcEIsV0FBSyxnQkFBZ0IsRUFBQyxJQUFJLE1BQU0sTUFBTSxXQUFBLEdBQWEsQ0FBQSxTQUFRO0FBQ3pELGFBQUssWUFBWSxNQUFNLE9BQU8sTUFBTTtBQUNsQywwQkFBUSxVQUFVLFdBQVcsRUFBQyxNQUFNLFlBQVksSUFBSSxLQUFLLEtBQUssSUFBSSxnQkFBQSxHQUFpQixJQUFBO0FBQ25GLGVBQUssb0JBQW9CLE9BQU8sUUFBQTtBQUNoQyxlQUFBO1FBQUEsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQUtOLHFCQUFvQjtBQUNsQixzQkFBUSxVQUFVLFdBQVcsRUFBQyxNQUFNLE1BQU0sTUFBTSxTQUFTLElBQUksS0FBSyxLQUFLLEdBQUEsQ0FBQTtJQUFBO0lBR3pFLG9CQUFvQixhQUFZO0FBQzlCLFVBQUksRUFBQyxVQUFVLFdBQVUsS0FBSztBQUM5QixVQUFHLFdBQVcsV0FBVyxZQUFZLFdBQVcsWUFBWSxRQUFPO0FBQ2pFLGVBQU87TUFBQSxPQUNGO0FBQ0wsYUFBSyxrQkFBa0IsTUFBTSxXQUFBO0FBQzdCLGVBQU87TUFBQTtJQUFBO0lBSVgsWUFBVztBQUNULFVBQUksYUFBYTtBQUNqQixVQUFJLHdCQUF3QjtBQUc1QixXQUFLLEdBQUcsVUFBVSxDQUFBLE1BQUs7QUFDckIsWUFBSSxZQUFZLEVBQUUsT0FBTyxhQUFhLEtBQUssUUFBUSxRQUFBLENBQUE7QUFDbkQsWUFBSSxZQUFZLEVBQUUsT0FBTyxhQUFhLEtBQUssUUFBUSxRQUFBLENBQUE7QUFDbkQsWUFBRyxDQUFDLHlCQUF5QixhQUFhLENBQUMsV0FBVTtBQUNuRCxrQ0FBd0I7QUFDeEIsWUFBRSxlQUFBO0FBQ0YsZUFBSyxhQUFhLEVBQUUsUUFBUSxDQUFBLFNBQVE7QUFDbEMsaUJBQUssWUFBWSxFQUFFLE1BQUE7QUFDbkIsbUJBQU8sc0JBQXNCLE1BQU0sRUFBRSxPQUFPLE9BQUEsQ0FBQTtVQUFBLENBQUE7UUFBQTtNQUFBLEdBRy9DLElBQUE7QUFFSCxXQUFLLEdBQUcsVUFBVSxDQUFBLE1BQUs7QUFDckIsWUFBSSxXQUFXLEVBQUUsT0FBTyxhQUFhLEtBQUssUUFBUSxRQUFBLENBQUE7QUFDbEQsWUFBRyxDQUFDLFVBQVM7QUFBRTtRQUFBO0FBQ2YsVUFBRSxlQUFBO0FBQ0YsVUFBRSxPQUFPLFdBQVc7QUFDcEIsYUFBSyxhQUFhLEVBQUUsUUFBUSxDQUFBLFNBQVE7QUFDbEMscUJBQUcsS0FBSyxVQUFVLFVBQVUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUEsQ0FBQSxDQUFBO1FBQUEsQ0FBQTtNQUFBLEdBRXRELEtBQUE7QUFFSCxlQUFRLFFBQVEsQ0FBQyxVQUFVLE9BQUEsR0FBUztBQUNsQyxhQUFLLEdBQUcsTUFBTSxDQUFBLE1BQUs7QUFDakIsY0FBSSxZQUFZLEtBQUssUUFBUSxRQUFBO0FBQzdCLGNBQUksUUFBUSxFQUFFO0FBQ2QsY0FBSSxhQUFhLE1BQU0sYUFBYSxTQUFBO0FBQ3BDLGNBQUksWUFBWSxNQUFNLFFBQVEsTUFBTSxLQUFLLGFBQWEsU0FBQTtBQUN0RCxjQUFJLFdBQVcsY0FBYztBQUM3QixjQUFHLENBQUMsVUFBUztBQUFFO1VBQUE7QUFDZixjQUFHLE1BQU0sU0FBUyxZQUFZLE1BQU0sWUFBWSxNQUFNLFNBQVMsVUFBUztBQUFFO1VBQUE7QUFFMUUsY0FBSSxhQUFhLGFBQWEsUUFBUSxNQUFNO0FBQzVDLGNBQUksb0JBQW9CO0FBQ3hCO0FBQ0EsY0FBSSxFQUFDLElBQVEsTUFBTSxhQUFZLFlBQUksUUFBUSxPQUFPLGdCQUFBLEtBQXFCLENBQUE7QUFFdkUsY0FBRyxPQUFPLG9CQUFvQixLQUFLLFNBQVMsVUFBUztBQUFFO1VBQUE7QUFFdkQsc0JBQUksV0FBVyxPQUFPLGtCQUFrQixFQUFDLElBQUksbUJBQW1CLEtBQUEsQ0FBQTtBQUVoRSxlQUFLLFNBQVMsT0FBTyxHQUFHLE1BQU0sTUFBTTtBQUNsQyxpQkFBSyxhQUFhLFlBQVksQ0FBQSxTQUFRO0FBQ3BDLDBCQUFJLFdBQVcsT0FBTyxpQkFBaUIsSUFBQTtBQUN2QyxrQkFBRyxDQUFDLFlBQUksZUFBZSxLQUFBLEdBQU87QUFDNUIscUJBQUssaUJBQWlCLEtBQUE7Y0FBQTtBQUV4Qix5QkFBRyxLQUFLLFVBQVUsVUFBVSxNQUFNLE9BQU8sQ0FBQyxRQUFRLEVBQUMsU0FBUyxFQUFFLE9BQU8sTUFBTSxXQUFBLENBQUEsQ0FBQTtZQUFBLENBQUE7VUFBQSxDQUFBO1FBQUEsR0FHOUUsS0FBQTtNQUFBO0lBQUE7SUFJUCxTQUFTLElBQUksT0FBTyxXQUFXLFVBQVM7QUFDdEMsVUFBRyxjQUFjLFVBQVUsY0FBYyxZQUFXO0FBQUUsZUFBTyxTQUFBO01BQUE7QUFFN0QsVUFBSSxjQUFjLEtBQUssUUFBUSxZQUFBO0FBQy9CLFVBQUksY0FBYyxLQUFLLFFBQVEsWUFBQTtBQUMvQixVQUFJLGtCQUFrQixLQUFLLFNBQVMsU0FBUyxTQUFBO0FBQzdDLFVBQUksa0JBQWtCLEtBQUssU0FBUyxTQUFTLFNBQUE7QUFFN0MsV0FBSyxhQUFhLElBQUksQ0FBQSxTQUFRO0FBQzVCLFlBQUksY0FBYyxNQUFNLENBQUMsS0FBSyxZQUFBLEtBQWlCLFNBQVMsS0FBSyxTQUFTLEVBQUE7QUFDdEUsb0JBQUksU0FBUyxJQUFJLE9BQU8sYUFBYSxpQkFBaUIsYUFBYSxpQkFBaUIsYUFBYSxNQUFNO0FBQ3JHLG1CQUFBO1FBQUEsQ0FBQTtNQUFBLENBQUE7SUFBQTtJQUtOLGNBQWMsVUFBUztBQUNyQixXQUFLLFdBQVc7QUFDaEIsZUFBQTtBQUNBLFdBQUssV0FBVztJQUFBO0lBR2xCLEdBQUcsT0FBTyxVQUFTO0FBQ2pCLGFBQU8saUJBQWlCLE9BQU8sQ0FBQSxNQUFLO0FBQ2xDLFlBQUcsQ0FBQyxLQUFLLFVBQVM7QUFBRSxtQkFBUyxDQUFBO1FBQUE7TUFBQSxDQUFBO0lBQUE7RUFBQTtBQUtuQyxNQUFBLGdCQUFBLE1BQW9CO0lBQ2xCLGNBQWE7QUFDWCxXQUFLLGNBQWMsb0JBQUksSUFBQTtBQUN2QixXQUFLLGFBQWEsQ0FBQTtBQUNsQixXQUFLLE1BQUE7SUFBQTtJQUdQLFFBQU87QUFDTCxXQUFLLFlBQVksUUFBUSxDQUFBLFVBQVM7QUFDaEMscUJBQWEsS0FBQTtBQUNiLGFBQUssWUFBWSxPQUFPLEtBQUE7TUFBQSxDQUFBO0FBRTFCLFdBQUssZ0JBQUE7SUFBQTtJQUdQLE1BQU0sVUFBUztBQUNiLFVBQUcsS0FBSyxLQUFBLE1BQVcsR0FBRTtBQUNuQixpQkFBQTtNQUFBLE9BQ0s7QUFDTCxhQUFLLGNBQWMsUUFBQTtNQUFBO0lBQUE7SUFJdkIsY0FBYyxNQUFNLFNBQVMsUUFBTztBQUNsQyxjQUFBO0FBQ0EsVUFBSSxRQUFRLFdBQVcsTUFBTTtBQUMzQixhQUFLLFlBQVksT0FBTyxLQUFBO0FBQ3hCLGVBQUE7QUFDQSxZQUFHLEtBQUssS0FBQSxNQUFXLEdBQUU7QUFBRSxlQUFLLGdCQUFBO1FBQUE7TUFBQSxHQUMzQixJQUFBO0FBQ0gsV0FBSyxZQUFZLElBQUksS0FBQTtJQUFBO0lBR3ZCLGNBQWMsSUFBRztBQUFFLFdBQUssV0FBVyxLQUFLLEVBQUE7SUFBQTtJQUV4QyxPQUFNO0FBQUUsYUFBTyxLQUFLLFlBQVk7SUFBQTtJQUVoQyxrQkFBaUI7QUFDZixXQUFLLFdBQVcsUUFBUSxDQUFBLE9BQU0sR0FBQSxDQUFBO0FBQzlCLFdBQUssYUFBYSxDQUFBO0lBQUE7RUFBQTs7O0FDajRCdEIsTUFBTSxTQUFTO0FBQUEsSUFDYixTQUFTLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFBQSxJQUN0QixRQUFRLENBQUMsSUFBSSxJQUFJLEdBQUc7QUFBQSxJQUNwQixLQUFLLENBQUMsS0FBSyxJQUFJLEdBQUc7QUFBQSxJQUNsQixRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFBQSxJQUNyQixRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFBQSxJQUNyQixPQUFPLENBQUMsSUFBSSxLQUFLLEdBQUc7QUFBQSxJQUNwQixNQUFNLENBQUMsSUFBSSxLQUFLLEdBQUc7QUFBQSxJQUNuQixRQUFRLENBQUMsS0FBSyxLQUFLLEdBQUc7QUFBQSxJQUN0QixNQUFNLENBQUMsS0FBSyxLQUFLLEdBQUc7QUFBQSxFQUN0QjtBQUVBLE1BQU0sY0FBYyxPQUFPLEtBQUssTUFBTTtBQUUvQixNQUFNLGFBQWE7QUFBQSxJQUN4QixJQUFJLENBQUMsTUFBTTtBQUNULFlBQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxXQUFXLElBQUksQ0FBQztBQUNsQyxhQUFPLE9BQU8sTUFBTSxNQUFNO0FBQUEsSUFDNUI7QUFBQSxJQUNBLEtBQUssQ0FBQyxNQUFNLE9BQU8sWUFBWSxJQUFJLFlBQVk7QUFBQSxFQUNqRDtBQUVPLE1BQU0sWUFBWTtBQUFBLElBQ3ZCLElBQUksQ0FBQyxNQUFNO0FBQ1QsWUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLFdBQVcsSUFBSSxDQUFDO0FBQ2xDLGFBQU87QUFBQSxRQUNMLFFBQVEsT0FBTyxNQUFNLE1BQU07QUFBQSxRQUMzQixNQUFNLE9BQU8sTUFBTSxNQUFNO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBQUEsRUFDRjs7O0FDckJBLG9CQUFrQixJQUFJLE1BQU07QUFDM0IsUUFBSSxVQUFVO0FBRWQsbUJBQWU7QUFDZCxnQkFBVTtBQUNWLFNBQUc7QUFBQSxJQUNKO0FBRUEsV0FBTyxXQUFXO0FBQ2pCLG1CQUFhLE9BQU87QUFDcEIsZ0JBQVUsV0FBVyxLQUFLLElBQUk7QUFBQSxJQUMvQjtBQUFBLEVBQ0Q7QUFHQSxzQkFBb0IsS0FBSyxLQUFLLElBQUksSUFBSTtBQUNyQyxRQUFJO0FBQ0osU0FBSyxNQUFNO0FBQ1gsU0FBSyxNQUFNLElBQUksU0FBUztBQUN4QixRQUFJLFVBQVUsTUFBTTtBQUVwQixXQUFPLEtBQUssS0FBSyxHQUFHO0FBQ25CLFlBQU0sVUFBVyxLQUFLLE1BQU8sSUFBSSxNQUFPLE1BQUssTUFBTSxDQUFDO0FBRXBELFVBQUksSUFBSSxPQUFPO0FBQ2QsYUFBSztBQUFBO0FBRUwsYUFBSztBQUFBLElBQ1A7QUFFQSxRQUFJLE1BQU0sSUFBSSxPQUFPLElBQUksTUFBTTtBQUM5QixhQUFPO0FBRVIsV0FBTztBQUFBLEVBQ1I7QUFFQSxxQkFBbUIsTUFBTSxLQUFLLEtBQUs7QUFHbEMsUUFBSSxPQUFPO0FBQ1gsUUFBSSxPQUFPLENBQUM7QUFFWixhQUFTLElBQUksS0FBSyxLQUFLLEtBQUssS0FBSztBQUNoQyxVQUFJLEtBQUssTUFBTSxNQUFNO0FBQ3BCLGVBQU8sSUFBSSxNQUFNLEtBQUssRUFBRTtBQUN4QixlQUFPLElBQUksTUFBTSxLQUFLLEVBQUU7QUFBQSxNQUN6QjtBQUFBLElBQ0Q7QUFFQSxXQUFPLENBQUMsTUFBTSxJQUFJO0FBQUEsRUFDbkI7QUFJQSxvQkFBa0IsTUFBSyxNQUFLLE1BQU0sT0FBTztBQUV4QyxVQUFNLFFBQVEsT0FBTTtBQUNwQixVQUFNLE1BQU0sTUFBTSxTQUFTLElBQUksSUFBRyxLQUFLLENBQUM7QUFDeEMsVUFBTSxNQUFNLE1BQU0sR0FBRztBQUNyQixVQUFNLE9BQU8sSUFBSSxJQUFJLEdBQUcsSUFBSTtBQUM1QixVQUFNLE1BQU0sU0FBUyxJQUFJLE9BQU87QUFFaEMsUUFBSSxhQUFhLE9BQU8sWUFBWSxPQUFNLEtBQUssSUFBSSxDQUFDO0FBQ3BELFFBQUksYUFBYSxPQUFPLFlBQVksT0FBTSxLQUFLLElBQUksQ0FBQztBQUVwRCxRQUFJLE9BQU87QUFFVixVQUFJLFNBQVMsR0FBRztBQUNmLFlBQUksT0FBTSxHQUFHO0FBQ1osdUJBQWE7QUFDYix1QkFBYSxPQUFNO0FBQUEsUUFDcEIsV0FDUyxPQUFNLEdBQUc7QUFDakIsdUJBQWE7QUFDYix1QkFBYSxPQUFNO0FBQUEsUUFDcEI7QUFBQSxNQUNELE9BQ0s7QUFFSixZQUFJLGFBQWEsT0FBTTtBQUN0Qix3QkFBYztBQUVmLFlBQUksT0FBTSxhQUFhO0FBQ3RCLHdCQUFjO0FBR2YsWUFBSSxRQUFPLEtBQUssYUFBYTtBQUM1Qix1QkFBYTtBQUVkLFlBQUksUUFBTyxLQUFLLGFBQWE7QUFDNUIsdUJBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRDtBQUVBLFdBQU8sQ0FBQyxZQUFZLFVBQVU7QUFBQSxFQUMvQjtBQUVBLE1BQU0sSUFBSTtBQUVWLE1BQU0sTUFBTSxFQUFFO0FBQ2QsTUFBTSxRQUFRLEVBQUU7QUFDaEIsTUFBTSxRQUFRLEVBQUU7QUFDaEIsTUFBTSxPQUFPLEVBQUU7QUFDZixNQUFNLE1BQU0sRUFBRTtBQUNkLE1BQU0sTUFBTSxFQUFFO0FBQ2QsTUFBTSxNQUFNLEVBQUU7QUFDZCxNQUFNLFFBQVEsRUFBRTtBQUNoQixNQUFNLEtBQUssRUFBRTtBQUViLE1BQU0sTUFBTTtBQUVaLHFCQUFtQixLQUFLLE1BQU07QUFDN0IsV0FBTyxNQUFNLE1BQUksSUFBSSxJQUFFO0FBQUEsRUFDeEI7QUFFQSxpQkFBZSxLQUFLLE1BQU0sTUFBTTtBQUMvQixXQUFPLElBQUksSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJO0FBQUEsRUFDaEM7QUFFQSxvQkFBa0IsR0FBRztBQUNwQixXQUFPLE9BQU8sS0FBSyxhQUFhLElBQUksTUFBTTtBQUFBLEVBQzNDO0FBRUEsdUJBQXFCLEtBQUssTUFBTTtBQUMvQixXQUFPLEtBQUssTUFBSSxJQUFJLElBQUU7QUFBQSxFQUN2QjtBQUVBLHVCQUFxQixLQUFLLE1BQU07QUFDL0IsV0FBTyxNQUFNLE1BQUksSUFBSSxJQUFFO0FBQUEsRUFDeEI7QUFFQSxrQkFBZ0IsS0FBSztBQUNwQixXQUFPLE1BQU0sTUFBTSxHQUFHLElBQUk7QUFBQSxFQUMzQjtBQUVBLGtCQUFnQixLQUFLO0FBQ3BCLFdBQU8sTUFBTSxNQUFNLEdBQUcsSUFBSTtBQUFBLEVBQzNCO0FBSUEsTUFBTSxRQUFRLE1BQU07QUFFcEIsaUJBQWUsR0FBRztBQUNqQixXQUFPLE9BQU8sTUFBTTtBQUFBLEVBQ3JCO0FBRUEsaUJBQWUsR0FBRztBQUNqQixXQUFPLE9BQU8sTUFBTSxZQUFZLE1BQU07QUFBQSxFQUN2QztBQUVBLGdCQUFjLEdBQUc7QUFDaEIsUUFBSTtBQUVKLFFBQUksTUFBTSxDQUFDO0FBQ1YsWUFBTSxFQUFFLElBQUksSUFBSTtBQUFBLGFBQ1IsTUFBTSxDQUFDLEdBQUc7QUFDbEIsWUFBTSxDQUFDO0FBQ1AsZUFBUyxLQUFLO0FBQ2IsWUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO0FBQUEsSUFDcEI7QUFFQyxZQUFNO0FBRVAsV0FBTztBQUFBLEVBQ1I7QUFFQSxrQkFBZ0IsTUFBTTtBQUNyQixRQUFJLE9BQU87QUFFWCxhQUFTLElBQUksR0FBRyxJQUFJLEtBQUssUUFBUSxLQUFLO0FBQ3JDLFVBQUksTUFBTSxLQUFLO0FBRWYsZUFBUyxPQUFPLEtBQUs7QUFDcEIsWUFBSSxNQUFNLEtBQUssSUFBSTtBQUNsQixpQkFBTyxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQztBQUFBO0FBRWhDLGVBQUssT0FBTyxLQUFLLElBQUksSUFBSTtBQUFBLE1BQzNCO0FBQUEsSUFDRDtBQUVBLFdBQU87QUFBQSxFQUNSO0FBRUEsTUFBTSxRQUFRO0FBQ2QsTUFBTSxTQUFTO0FBQ2YsTUFBTSxNQUFNO0FBQ1osTUFBTSxTQUFTO0FBQ2YsTUFBTSxPQUFPO0FBQ2IsTUFBTSxRQUFRO0FBQ2QsTUFBTSxhQUFhO0FBQ25CLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sV0FBVztBQUNqQixNQUFNLFlBQVk7QUFFbEIsTUFBTSxZQUFZO0FBQ2xCLE1BQU0sWUFBWTtBQUNsQixNQUFNLFVBQVU7QUFDaEIsTUFBTSxhQUFhO0FBQ25CLE1BQU0sYUFBYTtBQUNuQixNQUFNLFdBQVc7QUFDakIsTUFBTSxTQUFTO0FBQ2YsTUFBTSxTQUFTO0FBRWYsTUFBTSxNQUFNO0FBQ1osTUFBTSxPQUFNO0FBQ1osTUFBTSxNQUFNO0FBQ1osTUFBTSxVQUFVO0FBRWhCLG9CQUFrQixJQUFJLEdBQUc7QUFDeEIsU0FBSyxRQUFRLEdBQUcsV0FBVyxJQUFJLENBQUM7QUFBQSxFQUNqQztBQUVBLG9CQUFrQixJQUFJLEdBQUc7QUFDeEIsT0FBRyxXQUFXLE9BQU8sQ0FBQztBQUFBLEVBQ3ZCO0FBRUEsc0JBQW9CLElBQUksTUFBTSxPQUFPO0FBQ3BDLE9BQUcsTUFBTSxRQUFRLFFBQVE7QUFBQSxFQUMxQjtBQUVBLG9CQUFrQixLQUFLLEtBQUssTUFBTSxPQUFPO0FBQ3hDLFFBQUksS0FBSyxLQUFJLGVBQWUsR0FBRztBQUUvQixRQUFJLE9BQU87QUFDVixlQUFTLElBQUksR0FBRztBQUVqQixRQUFJLFFBQVE7QUFDWCxXQUFLLGFBQWEsSUFBSSxLQUFLO0FBRTVCLFdBQU87QUFBQSxFQUNSO0FBRUEsb0JBQWtCLEtBQUssTUFBTTtBQUM1QixXQUFPLFNBQVMsT0FBTyxLQUFLLElBQUk7QUFBQSxFQUNqQztBQUVBLGlCQUFlLElBQUksTUFBTSxNQUFNO0FBQzlCLE9BQUcsTUFBTSxZQUFZLGVBQWUsT0FBTyxRQUFRLE9BQU87QUFBQSxFQUMzRDtBQUVBLE1BQU0sU0FBUyxFQUFDLFNBQVMsS0FBSTtBQUU3QixjQUFZLElBQUksSUFBSSxJQUFJO0FBQ3ZCLE9BQUcsaUJBQWlCLElBQUksSUFBSSxNQUFNO0FBQUEsRUFDbkM7QUFFQSxlQUFhLElBQUksSUFBSSxJQUFJO0FBQ3hCLE9BQUcsb0JBQW9CLElBQUksSUFBSSxNQUFNO0FBQUEsRUFDdEM7QUFFQSxNQUFNLFNBQVM7QUFBQSxJQUNkO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNEO0FBRUEsTUFBTSxPQUFPO0FBQUEsSUFDWjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Q7QUFFQSxrQkFBZ0IsS0FBSztBQUNwQixXQUFPLElBQUksTUFBTSxHQUFHLENBQUM7QUFBQSxFQUN0QjtBQUVBLE1BQU0sUUFBUyxLQUFLLElBQUksTUFBTTtBQUU5QixNQUFNLFVBQVcsT0FBTyxJQUFJLE1BQU07QUFFbEMsTUFBTSxXQUFXO0FBQUEsSUFDaEIsTUFBTTtBQUFBLElBQ04sS0FBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBTTtBQUFBLEVBQ1A7QUFFQSxvQkFBa0IsS0FBSztBQUN0QixXQUFRLE9BQU0sS0FBSyxNQUFNLE1BQU07QUFBQSxFQUNoQztBQUVBLG9CQUFrQixLQUFLO0FBQ3RCLFdBQVEsT0FBTSxLQUFLLE9BQU8sTUFBTSxNQUFNLE1BQU0sTUFBTTtBQUFBLEVBQ25EO0FBY0EsTUFBTSxjQUFjO0FBQ3BCLE1BQU0sV0FBVztBQUNqQixNQUFNLFVBQVU7QUFDaEIsTUFBTSxTQUFTO0FBQ2YsTUFBTSxXQUFXO0FBQ2pCLE1BQU0sYUFBYTtBQUNuQixNQUFNLGFBQWE7QUFDbkIsTUFBTSxrQkFBa0I7QUFFeEIsTUFBTSxPQUFPO0FBQUEsSUFFWixNQUFNLFFBQUssR0FBRSxhQUFhO0FBQUEsSUFFMUIsSUFBSyxRQUFNLElBQUUsYUFBYSxJQUFFLElBQUksTUFBTSxDQUFDO0FBQUEsSUFFdkMsTUFBTSxDQUFDLElBQUcsVUFBVSxNQUFNLEtBQUssR0FBRSxVQUFVO0FBQUEsSUFFM0MsS0FBSyxDQUFDLElBQUcsVUFBVSxNQUFNLElBQUksR0FBRSxVQUFVO0FBQUEsSUFFekMsSUFBSyxRQUFLLFNBQVMsR0FBRSxVQUFVLElBQUUsQ0FBQztBQUFBLElBRWxDLEdBQUksUUFBSyxHQUFFLFVBQVUsSUFBRTtBQUFBLElBRXZCLElBQUssUUFBSyxTQUFTLEdBQUUsU0FBUyxDQUFDO0FBQUEsSUFFL0IsR0FBSSxRQUFLLEdBQUUsU0FBUztBQUFBLElBRXBCLE1BQU0sQ0FBQyxJQUFHLFVBQVUsTUFBTSxLQUFLLEdBQUUsUUFBUTtBQUFBLElBRXpDLEtBQUssQ0FBQyxJQUFHLFVBQVUsTUFBTSxJQUFJLEdBQUUsUUFBUTtBQUFBLElBRXZDLElBQUssUUFBSyxTQUFTLEdBQUUsVUFBVSxDQUFDO0FBQUEsSUFFaEMsR0FBSSxRQUFLLEdBQUUsVUFBVTtBQUFBLElBRXJCLEdBQUksUUFBSztBQUFDLFVBQUksS0FBSSxHQUFFLFVBQVU7QUFBRyxhQUFPLE1BQUssSUFBSSxLQUFLLEtBQUksS0FBSyxLQUFJLEtBQUs7QUFBQSxJQUFFO0FBQUEsSUFFMUUsSUFBSyxRQUFLLEdBQUUsVUFBVSxLQUFLLEtBQUssT0FBTztBQUFBLElBRXZDLElBQUssUUFBSyxHQUFFLFVBQVUsS0FBSyxLQUFLLE9BQU87QUFBQSxJQUV2QyxHQUFJLFFBQUssR0FBRSxVQUFVLEtBQUssS0FBSyxNQUFNO0FBQUEsSUFFckMsSUFBSyxRQUFLLFNBQVMsR0FBRSxZQUFZLENBQUM7QUFBQSxJQUVsQyxHQUFJLFFBQUssR0FBRSxZQUFZO0FBQUEsSUFFdkIsSUFBSyxRQUFLLFNBQVMsR0FBRSxZQUFZLENBQUM7QUFBQSxJQUVsQyxHQUFJLFFBQUssR0FBRSxZQUFZO0FBQUEsSUFFdkIsS0FBSyxRQUFLLFNBQVMsR0FBRSxpQkFBaUIsQ0FBQztBQUFBLEVBQ3hDO0FBRUEsbUJBQWlCLEtBQUssT0FBTztBQUM1QixZQUFRLFNBQVM7QUFDakIsUUFBSSxRQUFRLENBQUM7QUFFYixRQUFJLElBQUksd0JBQXdCO0FBRWhDLFdBQU8sS0FBSSxFQUFFLEtBQUssR0FBRztBQUNwQixZQUFNLEtBQUssR0FBRSxHQUFHLE1BQU0sTUFBTSxLQUFLLEdBQUUsTUFBTSxHQUFFLEVBQUU7QUFFOUMsV0FBTyxRQUFLO0FBQ1gsVUFBSSxNQUFNO0FBRVYsZUFBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLFFBQVE7QUFDakMsZUFBTyxPQUFPLE1BQU0sTUFBTSxXQUFXLE1BQU0sS0FBSyxNQUFNLEdBQUcsSUFBRyxLQUFLO0FBRWxFLGFBQU87QUFBQSxJQUNSO0FBQUEsRUFDRDtBQUdBLGtCQUFnQixNQUFNLElBQUk7QUFDekIsUUFBSTtBQUdKLFFBQUksTUFBTTtBQUNULGNBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLGtCQUFrQixJQUFJLEdBQUc7QUFBQSxTQUNuRDtBQUNKLGNBQVEsSUFBSSxLQUFLLEtBQUssZUFBZSxTQUFTLEVBQUMsVUFBVSxHQUFFLENBQUMsQ0FBQztBQUM3RCxZQUFNLGdCQUFnQixLQUFLLGlCQUFpQixDQUFDO0FBQUEsSUFDOUM7QUFFQSxXQUFPO0FBQUEsRUFDUjtBQU1BLG9CQUFrQixRQUFRLFFBQVEsT0FBTztBQUN4QyxRQUFJLFFBQVEsQ0FBQztBQUViLGFBQVMsTUFBTSxRQUFRLE1BQU0sUUFBUSxPQUFPO0FBQzNDLGVBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxRQUFRLEtBQUs7QUFDdEMsWUFBSSxPQUFPLE1BQU0sS0FBSyxJQUFJLElBQUksR0FBRztBQUNqQyxjQUFNLEtBQUssQ0FBQyxLQUFLLFFBQVEsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUFBLE1BQ25DO0FBQUEsSUFDRDtBQUVBLFdBQU87QUFBQSxFQUNSO0FBRUEsTUFBTSxZQUFZLENBQUMsR0FBRSxHQUFFLENBQUM7QUFFeEIsTUFBTSxXQUFXLFNBQVMsS0FBSyxHQUFHLFNBQVM7QUFFM0MsTUFBTSxXQUFXLFNBQVMsR0FBRyxJQUFJLFNBQVM7QUFFMUMsTUFBTSxXQUFXLFNBQVMsT0FBTyxRQUFRO0FBRXpDLE1BQUksSUFBSTtBQUFSLE1BQ0MsSUFBSTtBQURMLE1BRUMsSUFBSSxJQUFJO0FBRlQsTUFHQyxJQUFJLElBQUk7QUFIVCxNQUlDLEtBQUssSUFBSTtBQUpWLE1BS0MsSUFBSSxJQUFJO0FBR1QsTUFBTSxZQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sU0FBUyxJQUFJLEdBQUcsU0FBUyxHQUFHO0FBQUEsSUFFNUQ7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFFQTtBQUFBLElBQ0EsSUFBSTtBQUFBLElBQ0osSUFBSTtBQUFBLElBQ0osSUFBSTtBQUFBLElBQ0osSUFBSTtBQUFBLElBRUo7QUFBQSxJQUNBLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUVKO0FBQUEsSUFDQSxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsSUFFSjtBQUFBLElBQ0EsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLElBRUw7QUFBQSxJQUNBLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxFQUNMLENBQUM7QUFFRCwwQkFBd0IsVUFBVSxVQUFTO0FBQzFDLFdBQU8sU0FBUyxJQUFJLFFBQUs7QUFBQSxNQUN4QixHQUFFO0FBQUEsTUFDRixTQUFRLEdBQUUsRUFBRTtBQUFBLE1BQ1osR0FBRTtBQUFBLE1BQ0YsU0FBUSxHQUFFLEtBQUssR0FBRSxLQUFLLEdBQUUsS0FBSyxHQUFFLEVBQUU7QUFBQSxJQUNsQyxDQUFDO0FBQUEsRUFDRjtBQUVBLE1BQU0sT0FBTztBQUNiLE1BQU0sU0FBUyxPQUFPO0FBQ3RCLE1BQU0sS0FBSztBQUNYLE1BQU0sT0FBTyxPQUFPO0FBRXBCLE1BQU0sS0FBSztBQUNYLE1BQU0sTUFBTTtBQUNaLE1BQU0sUUFBUSxNQUFNO0FBQ3BCLE1BQU0sS0FBSztBQU9YLE1BQU0sa0JBQWtCO0FBQUEsSUFDdkIsQ0FBQyxHQUFVLE1BQWlCLEdBQUssSUFBdUIsQ0FBQztBQUFBLElBQ3pELENBQUMsSUFBSSxJQUFNLFNBQWlCLEdBQUssUUFBdUIsQ0FBQztBQUFBLElBQ3pELENBQUMsR0FBVSxJQUFpQixHQUFLLFFBQXVCLENBQUM7QUFBQSxJQUN6RCxDQUFDLEdBQVUsUUFBUSxJQUFTLEdBQUssTUFBdUIsQ0FBQztBQUFBLElBQ3pELENBQUMsR0FBVSxPQUFpQixHQUFLLE1BQXVCLENBQUM7QUFBQSxJQUN6RCxDQUFDLEdBQVUsSUFBaUIsR0FBSyxPQUFRLE1BQU0sT0FBUyxDQUFDO0FBQUEsSUFDekQsQ0FBQyxNQUFVLEtBQUssVUFBWSxHQUFLLE9BQVEsTUFBTSxPQUFTLENBQUM7QUFBQSxFQUMxRDtBQUlBLHdCQUFzQixTQUFRLFFBQVE7QUFDckMsV0FBTyxDQUFDLE9BQU0sUUFBUSxPQUFPLFNBQVM7QUFDckMsVUFBSSxLQUFJLE9BQU8sS0FBSyxPQUFLLFFBQVEsRUFBRSxFQUFFLEtBQUssT0FBTyxPQUFPLFNBQVM7QUFHakUsVUFBSSxXQUFXO0FBQ2YsVUFBSSxXQUFXO0FBQ2YsVUFBSSxXQUFXO0FBRWYsYUFBTyxPQUFPLElBQUksQ0FBQyxPQUFPLE1BQU07QUFDL0IsWUFBSSxPQUFPLFFBQU8sS0FBSztBQUV2QixZQUFJLFVBQVUsS0FBSyxhQUFhO0FBQ2hDLFlBQUksVUFBVSxLQUFLLFNBQVM7QUFDNUIsWUFBSSxVQUFVLEtBQUssWUFBWTtBQUUvQixZQUFJLFdBQVcsV0FBVztBQUMxQixZQUFJLFdBQVcsV0FBVztBQUMxQixZQUFJLFdBQVcsV0FBVztBQUUxQixZQUFJLFFBQVEsR0FBRSxNQUFNLEtBQUssWUFBWSxHQUFFLE1BQU0sS0FBSyxZQUFZLEdBQUUsTUFBTSxLQUFLLFdBQVcsR0FBRSxLQUFLLEdBQUU7QUFFL0YsbUJBQVc7QUFDWCxtQkFBVztBQUNYLG1CQUFXO0FBRVgsZUFBTyxNQUFNLElBQUk7QUFBQSxNQUNsQixDQUFDO0FBQUEsSUFDRjtBQUFBLEVBQ0Q7QUFFQSxrQkFBZ0IsSUFBRyxJQUFHLElBQUc7QUFDeEIsV0FBTyxJQUFJLEtBQUssSUFBRyxJQUFHLEVBQUM7QUFBQSxFQUN4QjtBQU1BLDBCQUF3QixTQUFRO0FBQy9CLFdBQU8sQ0FBQyxPQUFNLFVBQVUsVUFBVSxNQUFNLGFBQWE7QUFDcEQsVUFBSSxTQUFTLENBQUM7QUFDZCxVQUFJLE9BQU8sUUFBUSxNQUFNLE9BQU87QUFHaEMsVUFBSSxVQUFVLFFBQU8sUUFBUTtBQUM3QixVQUFJLFlBQVksVUFBVTtBQUcxQixVQUFJLFNBQVMsT0FBTyxRQUFRLGFBQWEsR0FBRyxRQUFRLFVBQVUsR0FBRyxPQUFPLElBQUksUUFBUSxTQUFTLENBQUM7QUFDOUYsVUFBSSxXQUFXLFNBQVM7QUFFeEIsVUFBSSxNQUFNO0FBQ1QsWUFBSSxTQUFTLE9BQU87QUFFcEIsWUFBSSxRQUFRLGFBQWEsV0FBVyxZQUFZLE9BQU8sT0FBTyxhQUFhLEdBQUcsT0FBTyxVQUFVLElBQUksUUFBUSxDQUFDLElBQUk7QUFDaEgsWUFBSSxZQUFZLElBQUksS0FBSyxRQUFRLEdBQUc7QUFDcEMsWUFBSSxXQUFXLFVBQVUsYUFBYTtBQUN0QyxZQUFJLFlBQVksVUFBVSxVQUFVO0FBRXBDLGlCQUFTLElBQUksR0FBRyxTQUFTLFVBQVUsS0FBSztBQUN2QyxjQUFJLE9BQU8sT0FBTyxVQUFVLFlBQVksU0FBUyxHQUFHLENBQUM7QUFDckQsY0FBSSxPQUFPLE9BQU8sUUFBTyxPQUFPLEdBQUc7QUFFbkMsa0JBQVMsRUFBQyxPQUFPLFFBQVE7QUFFekIsY0FBSSxTQUFTO0FBQ1osbUJBQU8sS0FBSyxLQUFLO0FBQUEsUUFDbkI7QUFBQSxNQUNELE9BQ0s7QUFDSixZQUFJLFFBQVEsUUFBUSxJQUFJLElBQUk7QUFDNUIsWUFBSSxXQUFXLE1BQU0sUUFBUSxJQUFJLE1BQU0sU0FBUztBQUNoRCxZQUFJLFFBQVEsV0FBVyxXQUFXLFlBQVksWUFBWSxVQUFVLEtBQUs7QUFDekUsZUFBTyxLQUFLLEtBQUs7QUFFakIsWUFBSSxRQUFRLFFBQU8sS0FBSztBQUV4QixZQUFJLFdBQVcsTUFBTSxVQUFVLElBQUssTUFBTSxZQUFZLElBQUksSUFBTSxNQUFNLFlBQVksSUFBSTtBQUN0RixZQUFJLFlBQVksT0FBTztBQUV2QixlQUFPLEdBQUc7QUFDVCxrQkFBUSxPQUFPLFFBQVEsSUFBSTtBQUUzQixjQUFJLGVBQWUsTUFBTSxPQUFPLFdBQVcsU0FBUyxDQUFDLElBQUk7QUFDekQsY0FBSSxZQUFZLFFBQU8sS0FBSztBQUM1QixjQUFJLGFBQWEsVUFBVSxTQUFTO0FBRXBDLGNBQUksV0FBVyxhQUFhO0FBRTVCLGNBQUksV0FBVztBQUNkLHVCQUFXO0FBRVosbUJBQVMsV0FBVztBQUVwQixjQUFJLFFBQVE7QUFDWDtBQUVELHFCQUFZLFlBQVcsYUFBYTtBQUdwQyxjQUFJLFlBQVksT0FBTyxPQUFPLFNBQVM7QUFDdkMsY0FBSSxVQUFVLE9BQVEsU0FBUSxhQUFhLElBQUk7QUFFL0MsY0FBSSxVQUFVLFlBQVk7QUFDekIsbUJBQU8sS0FBSyxLQUFLO0FBQUEsUUFDbkI7QUFBQSxNQUNEO0FBRUEsYUFBTztBQUFBLElBQ1I7QUFBQSxFQUNEO0FBRUEsMkJBQXlCLFVBQVUsVUFBUztBQUMzQyxXQUFPLFNBQVEsUUFBUTtBQUFBLEVBQ3hCO0FBQ0EsTUFBTSxtQkFBbUI7QUFFekIseUJBQXVCLFNBQVEsT0FBTztBQUNyQyxXQUFPLENBQUMsT0FBTSxRQUFRLE1BQU0sUUFBTyxHQUFHLENBQUM7QUFBQSxFQUN4QztBQUVBLHVCQUFxQixPQUFNLElBQUk7QUFDOUIsUUFBSSxLQUFJLE1BQUssT0FBTztBQUVwQixRQUFJLEtBQUssU0FBUztBQUVsQixPQUFHLE1BQU0sYUFBYSxHQUFFLFVBQVU7QUFFbEMsUUFBSSxNQUFNLE1BQU0sR0FBRSxPQUFPLENBQUM7QUFDMUIsUUFBSSxNQUFPLE9BQU0sS0FBSztBQUV0QixlQUFXLElBQUksT0FBTyxHQUFHO0FBQ3pCLGVBQVcsSUFBSSxRQUFRLEdBQUc7QUFDMUIsZUFBVyxJQUFJLGNBQWMsR0FBRztBQUNoQyxlQUFXLElBQUksYUFBYSxHQUFHO0FBRS9CLFdBQU87QUFBQSxFQUNSO0FBRUEsTUFBTSxhQUFhO0FBQUEsSUFDbEIsTUFBTTtBQUFBLElBQ04sR0FBRztBQUFBLElBQ0gsR0FBRztBQUFBLElBQ0gsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1A7QUFBQSxJQUVBLE1BQU07QUFBQSxNQUNMLFVBQVU7QUFBQSxNQUNWLEdBQUc7QUFBQSxNQUNILEdBQUc7QUFBQSxNQUNILE1BQU07QUFBQSxNQUNOLEtBQUs7QUFBQSxNQUNMLElBQUk7QUFBQSxNQUNKLElBQUk7QUFBQSxJQUNMO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUDtBQUFBLElBRUEsUUFBUTtBQUFBLElBQ1IsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLElBQ0wsS0FBSztBQUFBLEVBQ047QUFFQSxNQUFNLE9BQU87QUFBQSxJQUNaLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxJQUNSLE9BQU87QUFBQSxFQUVSO0FBRUEsTUFBTSxRQUFRLE9BQU8sQ0FBQyxHQUFHLE1BQU0sRUFBQyxNQUFNLEdBQUUsQ0FBQztBQUV6QyxNQUFNLE9BQVk7QUFDbEIsTUFBTSxZQUFZLFVBQVU7QUFDNUIsTUFBTSxXQUFXO0FBRWpCLE1BQU0sWUFBWTtBQUFBLElBQ2pCLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLEtBQUs7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxJQUNYO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFJTjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxRQUFRO0FBQUEsRUFDVDtBQUVBLE1BQU0saUJBQWlCO0FBQ3ZCLE1BQU0sa0JBQWtCO0FBRXhCLE1BQU0sY0FBYztBQUFBLElBQ25CLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUtQLEtBQUs7QUFBQSxJQUNMLEtBQUssQ0FBQztBQUFBLElBQ04sTUFBTSxDQUFDO0FBQUEsRUFDUjtBQUdBLE1BQUksU0FBUyxJQUFJLEtBQUssYUFBYSxVQUFVLFFBQVE7QUFFckQsdUJBQXFCLE9BQU0sUUFBUSxPQUFPLE1BQU07QUFDL0MsV0FBTyxPQUFPLElBQUksT0FBTyxNQUFNO0FBQUEsRUFDaEM7QUFFQSx5QkFBdUIsT0FBTSxVQUFVLFVBQVUsTUFBTSxVQUFVLFVBQVU7QUFDMUUsZUFBVyxXQUFXLFdBQVcsQ0FBQyxZQUFZLFVBQVUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUV4RSxRQUFJLFNBQVMsQ0FBQztBQUVkLGFBQVMsTUFBTSxVQUFVLE9BQU8sVUFBVSxNQUFNLENBQUUsT0FBTSxNQUFNLFFBQVEsRUFBRTtBQUN2RSxhQUFPLEtBQUssR0FBRztBQUVoQixXQUFPO0FBQUEsRUFDUjtBQUVBLHdCQUFzQixPQUFNLEtBQUs7QUFDaEMsV0FBTztBQUFBLEVBQ1I7QUFFQSxNQUFNLFlBQVk7QUFBQSxJQUNqQixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWDtBQUFBLElBQ0EsTUFBTTtBQUFBLElBSU47QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0EsUUFBUTtBQUFBLEVBQ1Q7QUFHQSxpQkFBZSxPQUFPLE1BQU07QUFDM0IsUUFBSSxNQUFNLElBQUssVUFBUyxLQUFLO0FBQzdCLFdBQU8sT0FBTyxNQUFNLElBQUk7QUFBQSxFQUN6QjtBQUVBLHdCQUFzQixPQUFNLElBQUk7QUFDL0IsVUFBTSxNQUFNLE1BQU0sTUFBSyxPQUFPLElBQUksT0FBTyxPQUFPO0FBQ2hELFFBQUksU0FBUyxNQUFLLEtBQUssUUFBUSxNQUFNO0FBQ3JDLFFBQUksT0FBTyxNQUFLLE9BQU8sR0FBRztBQUMxQixXQUFPLEtBQUssS0FBSyxLQUFLLE1BQU07QUFBQSxFQUM3QjtBQUVBLE1BQU0sY0FBYztBQUFBLElBRW5CLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxNQUNQLE1BQU07QUFBQSxJQUtQO0FBQUEsSUFHQSxRQUFRO0FBQUEsSUFHUixLQUFLO0FBQUEsSUFDTCxLQUFLLENBQUM7QUFBQSxJQUNOLE1BQU0sQ0FBQztBQUFBLElBRVAsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1A7QUFFQSxNQUFNLGFBQWE7QUFBQSxJQUNsQixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxLQUFLO0FBQUEsRUFDTjtBQUVBLE1BQU0sYUFBYSxPQUFPLENBQUMsR0FBRyxZQUFZO0FBQUEsSUFDekMsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1AsQ0FBQztBQUVELE1BQU0sUUFBUSxDQUFDO0FBRWYsaUJBQWUsTUFBTTtBQUNwQixRQUFJLFVBQVUsQ0FBQztBQUVmLFdBQU87QUFBQSxNQUNOLElBQUksUUFBUTtBQUNYLGdCQUFRLEtBQUssTUFBTTtBQUFBLE1BQ3BCO0FBQUEsTUFDQSxNQUFNLFFBQVE7QUFDYixrQkFBVSxRQUFRLE9BQU8sT0FBSyxLQUFLLE1BQU07QUFBQSxNQUMxQztBQUFBLE1BQ0EsSUFBSSxNQUFNLE9BQU0sR0FBRyxJQUFHLEdBQUcsSUFBRyxHQUFHO0FBQzlCLFlBQUksUUFBUSxTQUFTLEdBQUc7QUFDdkIsa0JBQVEsUUFBUSxZQUFVO0FBQ3pCLHNCQUFVLFNBQVEsT0FBTyxJQUFJLE1BQU0sT0FBTSxHQUFHLElBQUcsR0FBRyxJQUFHLENBQUM7QUFBQSxVQUN2RCxDQUFDO0FBQUEsUUFDRjtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUVBLHVCQUFxQixJQUFHLElBQUksSUFBSSxPQUFPO0FBQ3RDLFFBQUksTUFBSyxRQUFRLENBQUMsR0FBRSxJQUFJLEdBQUUsRUFBRSxFQUFFLE9BQU8sR0FBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRSxFQUFFLEVBQUUsT0FBTyxHQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzNFLFdBQU8sSUFBRyxJQUFJLENBQUMsR0FBRyxNQUFNLFdBQVcsR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO0FBQUEsRUFDakQ7QUFFQSxzQkFBb0IsR0FBRyxHQUFHLElBQUksSUFBSTtBQUNqQyxXQUFPLE9BQU8sQ0FBQyxHQUFJLEtBQUssS0FBSyxLQUFLLEVBQUUsT0FBTyxLQUFLLElBQUksS0FBSyxJQUFLLENBQUM7QUFBQSxFQUNoRTtBQUVBLG1CQUFpQixLQUFLLE9BQU8sS0FBSyxLQUFLO0FBQ3RDLFFBQUksT0FBUSxPQUFNLE1BQU0sT0FBUSxPQUFNLE1BQU0sTUFBTTtBQUNsRCxXQUFPLE1BQU8sS0FBSSxRQUFRO0FBQUEsRUFDM0I7QUFFQSxtQkFBaUIsS0FBSyxPQUFPLEtBQUssS0FBSztBQUN0QyxRQUFJLE9BQVEsT0FBTSxNQUFNLE9BQVEsT0FBTSxNQUFNLE1BQU07QUFDbEQsV0FBTyxNQUFNLE9BQU87QUFBQSxFQUNyQjtBQUVBLHFCQUFtQixPQUFNLFNBQVMsU0FBUztBQUMxQyxXQUFPLENBQUMsU0FBUyxVQUFVLFVBQVUsVUFBVSxVQUFVLEtBQUs7QUFBQSxFQUMvRDtBQUVBLG9CQUFrQixPQUFNLFNBQVMsU0FBUztBQUN6QyxVQUFNLFFBQVEsVUFBVTtBQUV4QixRQUFJLFNBQVMsR0FBRztBQUNmLFlBQU0sTUFBTSxNQUFNLFNBQVMsSUFBSSxPQUFPLEtBQUssQ0FBQztBQUM1QyxZQUFNLE1BQU0sTUFBTSxHQUFHLElBQUk7QUFDekIsYUFBTyxDQUFDLFNBQVMsWUFBWSxTQUFTLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUFBLElBQ3BEO0FBRUMsYUFBTyxDQUFDLFNBQVMsT0FBTztBQUFBLEVBQzFCO0FBSUEsb0JBQWtCLE9BQU0sU0FBUyxTQUFTO0FBQ3pDLFdBQU8sU0FBUyxTQUFTLFNBQVMsS0FBSyxJQUFJO0FBQUEsRUFDNUM7QUFHQSxvQkFBa0IsVUFBVSxPQUFPLEtBQUssVUFBVTtBQUNqRCxRQUFJLFlBQVksTUFBTTtBQUV0QixhQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sUUFBUSxLQUFLO0FBQ3RDLFVBQUksUUFBUSxNQUFNLEtBQUs7QUFFdkIsVUFBSSxTQUFTO0FBQ1osZUFBTyxDQUFDLE1BQU0sSUFBSSxLQUFLO0FBQUEsSUFDekI7QUFBQSxFQUNEO0FBRUEscUJBQW1CLEdBQUc7QUFDckIsV0FBTyxFQUFFLFVBQVU7QUFBQSxFQUNwQjtBQUVBLHVCQUFxQixPQUFNO0FBQzFCLFFBQUk7QUFDSixZQUFPLE1BQUssUUFBUSxPQUFPLFFBQU0sV0FBVyxNQUFNLEtBQUksT0FBTyxDQUFFO0FBQy9ELFdBQU8sQ0FBQyxPQUFNLFFBQVE7QUFBQSxFQUN2QjtBQUVBLGlCQUFlLE1BQU0sTUFBTSxNQUFNO0FBQ2hDLFVBQU0sUUFBTyxDQUFDO0FBRWQsVUFBTSxPQUFPLE1BQUssT0FBTyxTQUFTLE9BQU87QUFFekMsUUFBSSxLQUFLLE1BQU07QUFDZCxXQUFLLEtBQUssS0FBSztBQUVoQixhQUFTLE1BQU0sS0FBSyxLQUFLO0FBRXpCLFFBQUksS0FBSyxPQUFPO0FBQ2YsVUFBSSxRQUFRLFNBQVMsU0FBUyxJQUFJO0FBQ2xDLFlBQU0sY0FBYyxLQUFLO0FBQUEsSUFDMUI7QUFFQSxVQUFNLE1BQU0sU0FBUyxRQUFRO0FBQzdCLFVBQU0sTUFBTSxNQUFLLE1BQU0sSUFBSSxXQUFXLElBQUk7QUFFMUMsVUFBTSxPQUFPLFNBQVMsUUFBUSxJQUFJO0FBQ2xDLFVBQU0sUUFBUSxTQUFTLFNBQVMsSUFBSTtBQUNwQyxTQUFLLFlBQVksR0FBRztBQUNwQixVQUFNLE9BQU8sU0FBUyxRQUFRLElBQUk7QUFFbEMsV0FBTyxLQUFLLElBQUk7QUFFaEIsSUFBQyxNQUFLLFdBQVcsQ0FBQyxHQUFHLFFBQVEsT0FBSztBQUNqQyxVQUFJLEVBQUU7QUFDTCxlQUFPLEVBQUUsS0FBSyxPQUFNLElBQUksS0FBSztBQUFBLElBQy9CLENBQUM7QUFFRCxRQUFJLFFBQVE7QUFFWixVQUFNLFNBQVUsTUFBSyxTQUFTLFlBQVksS0FBSyxVQUFVLENBQUMsR0FBRyxhQUFhLGFBQWEsS0FBSztBQUM1RixVQUFNLE9BQVUsTUFBSyxPQUFTLFlBQVksS0FBSyxRQUFVLENBQUMsR0FBRyxXQUFhLFdBQWMsSUFBSTtBQUM1RixVQUFNLFNBQVUsTUFBSyxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUMsR0FBRyxZQUFZLEdBQUcsV0FBVSxHQUFHLEtBQUssTUFBTTtBQUVwRixVQUFNLFVBQVUsT0FBTztBQUFBLE1BQ3RCLEdBQUcsTUFBTSxVQUFVLE9BQU8sQ0FBQztBQUFBLE1BQzNCLEdBQUcsTUFBTSxVQUFVLE9BQU8sQ0FBQztBQUFBLElBQzVCLEdBQUcsS0FBSyxPQUFPO0FBR2YsVUFBTSxVQUFhLEtBQUssVUFBVyxTQUFNLElBQUksS0FBSyxLQUFLLEdBQUc7QUFDMUQsVUFBTSxXQUFhLEtBQUssV0FBVztBQUVuQyxVQUFNLGtCQUFtQixlQUFlLE9BQU87QUFDL0MsVUFBTSxnQkFBbUIsYUFBYSxTQUFTLGVBQWUsaUJBQWlCLFFBQVEsQ0FBQztBQUN4RixVQUFNLGlCQUFtQixjQUFjLFNBQVMsZ0JBQWdCLGtCQUFrQixRQUFRLENBQUM7QUFFM0YsVUFBTSxhQUFhLENBQUM7QUFHcEIsYUFBUyxLQUFLLFFBQVE7QUFDckIsVUFBSSxLQUFLLE9BQU87QUFFaEIsVUFBSSxHQUFHLE9BQU8sUUFBUSxHQUFHLE9BQU87QUFDL0IsbUJBQVcsS0FBSyxFQUFDLEtBQUssR0FBRyxLQUFLLEtBQUssR0FBRyxJQUFHO0FBQUEsSUFDM0M7QUFFQSxVQUFNLFNBQWMsT0FBTyxFQUFDLE1BQU0sS0FBSSxHQUFHLEtBQUssTUFBTTtBQUNwRCxVQUFNLGFBQWMsT0FBTztBQUUzQixRQUFJO0FBQ0osUUFBSSxhQUFhLENBQUM7QUFDbEIsUUFBSTtBQUNKLFFBQUksaUJBQWlCO0FBRXJCLFFBQUksWUFBWTtBQUNmLGlCQUFXLFNBQVMsU0FBUyxVQUFVLElBQUk7QUFFM0MsWUFBTSxlQUFlLE9BQU8sS0FBSyxPQUFPLEdBQUcsU0FBUztBQUNwRCx1QkFBaUIsZ0JBQWdCO0FBRWpDLFVBQUksZ0JBQWdCO0FBQ25CLFlBQUksT0FBTyxTQUFTLE1BQU0sVUFBVSxRQUFRO0FBQzVDLGlCQUFTLE1BQU0sTUFBTSxJQUFJO0FBQ3pCLHFCQUFhLGFBQWEsT0FBTSxHQUFHLENBQUM7QUFFcEMsaUJBQVMsT0FBTztBQUNmLG1CQUFTLE1BQU0sTUFBTSxJQUFJLEVBQUUsY0FBYztBQUFBLE1BQzNDLE9BQ0s7QUFDSixxQkFBYSxFQUFDLEdBQUcsRUFBQztBQUNsQixpQkFBUyxVQUFVLFFBQVE7QUFBQSxNQUM1QjtBQUFBLElBQ0Q7QUFFQSwyQkFBdUIsSUFBRyxHQUFHO0FBQzVCLFVBQUksS0FBSyxLQUFLO0FBQ2IsZUFBTztBQUVSLFVBQUksT0FBTyxDQUFDO0FBRVosVUFBSSxNQUFNLFNBQVMsTUFBTSxVQUFVLFVBQVUsU0FBUyxXQUFXLEVBQUU7QUFFbkUsZUFBUyxLQUFLLEdBQUUsS0FBSztBQUVyQixVQUFJLENBQUMsR0FBRTtBQUNOLGlCQUFTLEtBQUssS0FBSztBQUVwQixVQUFJLFFBQVEsU0FBUyxNQUFNLE1BQU0sR0FBRztBQUVwQyxVQUFJLFFBQVEsU0FBUyxTQUFTLEtBQUs7QUFDbkMsU0FBRSxTQUFVLE9BQU0sTUFBTSxjQUFjLEdBQUU7QUFDeEMsWUFBTSxNQUFNLGtCQUFrQixHQUFFO0FBRWhDLFVBQUksT0FBTyxTQUFTLFFBQVEsS0FBSztBQUNqQyxXQUFLLGNBQWMsR0FBRTtBQUVyQixVQUFJLElBQUksR0FBRztBQUNWLFdBQUcsU0FBUyxPQUFPLE9BQUs7QUFDdkIsY0FBSyxPQUFPO0FBQ1g7QUFFRCxvQkFBVSxDQUFDLEtBQUssVUFBVSxPQUFPLFFBQVEsRUFBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLEdBQUUsS0FBSSxHQUFJLFNBQVMsU0FBUztBQUFBLFFBQ2xGLENBQUM7QUFFRCxZQUFJLGFBQWE7QUFDaEIsYUFBRyxZQUFZLE9BQU8sT0FBSztBQUMxQixnQkFBSSxPQUFPO0FBQ1Y7QUFFRCxzQkFBVSxPQUFPLFFBQVEsRUFBQyxHQUFHLEVBQUMsT0FBTyxLQUFJLEdBQUcsU0FBUyxTQUFTO0FBQUEsVUFDL0QsQ0FBQztBQUFBLFFBQ0Y7QUFBQSxNQUNEO0FBRUEsZUFBUyxRQUFPLFlBQVk7QUFDM0IsWUFBSSxJQUFJLFNBQVMsTUFBTSxNQUFNLEdBQUc7QUFDaEMsVUFBRSxjQUFjO0FBQ2hCLGFBQUssS0FBSyxDQUFDO0FBQUEsTUFDWjtBQUVBLGFBQU87QUFBQSxJQUNSO0FBRUEsVUFBTSxTQUFXLE1BQUssU0FBUyxPQUFPLENBQUMsR0FBRyxZQUFZLEtBQUssTUFBTTtBQUVoRSxJQUFDLE9BQU8sT0FBTyxPQUFPLFNBQVMsT0FBTyxPQUFPLElBQUk7QUFFbEQsVUFBTSxRQUFRLE1BQUssUUFBUSxPQUFPLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBQyxPQUFPLElBQUcsR0FBSSxPQUFPLEtBQUs7QUFDL0UsVUFBTSxjQUFlLE1BQU0sUUFBUTtBQUduQyxRQUFJLFlBQVksQ0FBQyxJQUFJO0FBRXJCLDBCQUFzQixJQUFHLElBQUk7QUFDNUIsVUFBSSxLQUFLLEdBQUc7QUFDWCxZQUFJLEtBQUssT0FBTyxPQUFPLEtBQUssT0FBTSxFQUFFO0FBRXBDLFlBQUksSUFBSTtBQUNQLG1CQUFTLElBQUksV0FBVztBQUN4QixtQkFBUyxJQUFJLEdBQUUsS0FBSztBQUNwQixnQkFBTSxJQUFJLEtBQUssR0FBRztBQUNsQixlQUFLLGFBQWEsSUFBSSxVQUFVLEdBQUc7QUFFbkMsaUJBQU87QUFBQSxRQUNSO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFFQSx3QkFBb0IsSUFBRyxHQUFHO0FBRXpCLFlBQU0sUUFBUSxHQUFFO0FBRWhCLFlBQU0sS0FBSyxPQUFPLFNBQVMsT0FBTyxDQUFDLEdBQUksS0FBSyxJQUFJLGFBQWEsWUFBYSxPQUFPLE1BQU07QUFFdkYsVUFBSSxTQUFVLEdBQUc7QUFFakIsU0FBRyxRQUFRLFNBQVMsR0FBRyxTQUFVLFVBQVMsWUFBWSxLQUFLLElBQUksV0FBVyxTQUFTO0FBRW5GLFVBQUksS0FBSyxHQUFFO0FBQ1gsU0FBRSxRQUFRLFNBQVUsTUFBTSxFQUFFLElBQUksY0FBYyxTQUFTLGdCQUFnQixJQUFJLFFBQVEsQ0FBQyxJQUFJLE1BQU0saUJBQWtCLE1BQU07QUFDdEgsU0FBRSxRQUFRLEdBQUUsU0FBVSxVQUFTLGtCQUFrQjtBQUVqRCxVQUFJLElBQUksR0FBRztBQUNWLFdBQUUsUUFBUSxHQUFFLFNBQVMsT0FBTyxJQUFJLEdBQUU7QUFDbEMsV0FBRSxRQUFRLEdBQUUsU0FBVztBQUN2QixZQUFJLFNBQVMsTUFBTSxHQUFFLE9BQU8sQ0FBQztBQUM3QixXQUFFLFNBQVMsT0FBTyxDQUFDLEdBQUc7QUFBQSxVQUNyQixNQUFNO0FBQUEsVUFDTixPQUFPLElBQUksR0FBRyxTQUFTLEdBQUU7QUFBQSxRQUMxQixHQUFHLEdBQUUsTUFBTTtBQUNYLFdBQUUsT0FBTyxPQUFPLFNBQVMsR0FBRSxPQUFPLElBQUk7QUFDdEMsV0FBRSxTQUFTO0FBQUEsTUFDWjtBQUVBLFVBQUk7QUFDSCxtQkFBVyxPQUFPLEdBQUcsR0FBRyxjQUFjLElBQUcsQ0FBQyxDQUFDO0FBRTVDLFVBQUssT0FBTyxNQUFNO0FBQ2pCLFlBQUksS0FBSyxhQUFhLElBQUcsQ0FBQztBQUMxQixjQUFNLFVBQVUsT0FBTyxHQUFHLEdBQUcsRUFBRTtBQUFBLE1BQ2hDO0FBQUEsSUFDRDtBQUVBLHVCQUFtQixPQUFNLElBQUk7QUFDNUIsV0FBSyxNQUFNLE9BQU8sT0FBTyxTQUFTO0FBRWxDLGNBQU8sV0FBVyxPQUFNLElBQUksYUFBYSxXQUFXO0FBQ3BELGFBQU8sT0FBTyxJQUFJLEdBQUcsS0FBSTtBQUN6QixpQkFBVyxPQUFPLEtBQUssRUFBRTtBQUFBLElBQzFCO0FBRUEsVUFBSyxZQUFZO0FBRWpCLHVCQUFtQixHQUFHO0FBQ3JCLGFBQU8sT0FBTyxHQUFHLENBQUM7QUFDakIsb0JBQWMsV0FBVyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxXQUFXLE9BQU87QUFDOUQsZ0JBQVUsU0FBUyxLQUFLLFVBQVUsT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLE9BQU87QUFBQSxJQUczRDtBQUVBLFVBQUssWUFBWTtBQUVqQixXQUFPLFFBQVEsVUFBVTtBQUd6QixhQUFTLEtBQUssUUFBUTtBQUNyQixVQUFJLEtBQUssT0FBTztBQUVoQixVQUFJLEdBQUcsUUFBUTtBQUNkLGVBQU8sS0FBSyxPQUFPLENBQUMsR0FBRyxPQUFPLEdBQUcsT0FBTyxFQUFFO0FBQUEsSUFDNUM7QUFFQSxVQUFNLFlBQVksT0FBTyxHQUFHO0FBQzVCLFVBQU0sY0FBYyxPQUFPLFdBQVc7QUFFdEMsc0JBQWtCLE1BQU0sR0FBRztBQUMxQixVQUFJLEtBQUssTUFBTTtBQUNkLFlBQUksT0FBTyxLQUFLLE9BQU87QUFFdkIsWUFBSSxLQUFLLE9BQU8sS0FBSztBQUdyQixZQUFJLE1BQU0sTUFBTTtBQUNmLGVBQUssUUFBUSxPQUFPLE9BQU8sR0FBRyxRQUFRO0FBQ3RDLGVBQUssT0FBTyxLQUFLO0FBQUEsUUFDbEI7QUFHQSxZQUFJLFNBQVUsR0FBRztBQUVqQixhQUFLLFFBQVEsU0FBUyxLQUFLLEtBQUs7QUFDaEMsYUFBSyxTQUFTLFNBQVMsS0FBSyxNQUFNO0FBQ2xDLGFBQUssUUFBUSxTQUFTLEtBQUssU0FBb0IsSUFBRyxTQUFTLElBQUksV0FBWSxTQUFTLFlBQVksU0FBVTtBQUMxRyxhQUFLLFFBQVEsU0FBUyxLQUFLLFNBQVUsV0FBVSxHQUFHLFNBQVMsSUFBSSxrQkFBa0IsY0FBYztBQUMvRixZQUFJLEtBQUssS0FBSztBQUNkLGFBQUssU0FBUyxTQUFVLE1BQU0sRUFBRSxJQUFJLGFBQWEsU0FBUyxlQUFlLElBQUksUUFBUSxDQUFDLElBQUksTUFBTSxnQkFBaUIsTUFBTTtBQUV2SCxhQUFLLE9BQVksWUFBWSxLQUFLLElBQUk7QUFDdEMsYUFBSyxZQUFZLFlBQVksS0FBSyxTQUFTO0FBQUEsTUFDNUM7QUFBQSxJQUNEO0FBR0EsU0FBSyxRQUFRLFFBQVE7QUFFckIsUUFBSTtBQUdKLFFBQUksS0FBSztBQUNULFFBQUksS0FBSztBQUNULFVBQU0sT0FBTyxPQUFPLEdBQUc7QUFFdkIsUUFBSSxRQUFRO0FBRVoscUJBQWlCLE9BQU8sY0FBYztBQUNyQyxjQUFRLFNBQVMsQ0FBQztBQUNsQixZQUFNLEtBQUssTUFBTSxNQUFNLENBQUM7QUFFeEIsWUFBSyxPQUFPO0FBQ1osYUFBTyxNQUFNLE1BQU07QUFDbkIsY0FBUSxLQUFLO0FBQ2IsZ0JBQVUsTUFBTTtBQUVoQixVQUFJLGVBQWU7QUFDbEIsYUFBSyxLQUFLLE1BQU0sSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBRWhDLG1CQUFhO0FBRWIsV0FBSyxTQUFTO0FBRWQsdUJBQWlCLFNBQVMsV0FBVztBQUFBLElBQ3RDO0FBRUEsVUFBSyxVQUFVO0FBRWYsMEJBQXNCO0FBQ3JCLFdBQUssS0FBSyxLQUFLO0FBQ2YsV0FBSyxLQUFLLEtBQUssVUFBVTtBQUV6QixVQUFJLE9BQU8sZUFBZSxJQUFJLEtBQUssS0FBSyxHQUFHLEtBQzFDLE9BQU8sZUFBZSxJQUFJLEtBQUssS0FBSyxHQUFHO0FBRXhDLGdCQUFVLFdBQVcsTUFBTSxJQUFJO0FBQUEsSUFDaEM7QUFFQSx5QkFBcUIsUUFBUSxPQUFPLE1BQU0sTUFBTTtBQUMvQyxVQUFJLGNBQWMsVUFBVTtBQUM1QixVQUFJLFlBQVk7QUFDaEIsVUFBSSxXQUFXO0FBQ2YsVUFBSSxZQUFZLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLFVBQUksWUFBWSxRQUFRO0FBQUEsSUFDekI7QUFFQSxRQUFJO0FBQ0osUUFBSTtBQUVKLFFBQUk7QUFDSixRQUFJO0FBR0osUUFBSTtBQUNKLFFBQUk7QUFFSixRQUFJO0FBQ0osUUFBSTtBQUNKLFFBQUk7QUFDSixRQUFJO0FBRUosVUFBSyxPQUFPLENBQUM7QUFFYixzQkFBa0IsT0FBTyxRQUFRO0FBQ2hDLFlBQUssUUFBUyxhQUFhLGFBQWE7QUFDeEMsWUFBSyxTQUFTLGFBQWEsYUFBYTtBQUN4QyxtQkFBYyxhQUFhO0FBRTNCLG1CQUFhO0FBQ2Isb0JBQWM7QUFFZCxVQUFJLEtBQUssTUFBSztBQUVkLGdCQUFVLEdBQUcsUUFBVSxVQUFVLGFBQWEsU0FBUyxHQUFHO0FBQzFELGdCQUFVLEdBQUcsT0FBVSxVQUFVLGFBQWEsU0FBUyxHQUFHO0FBQzFELGdCQUFVLEdBQUcsU0FBVSxVQUFVLGFBQWEsU0FBUyxHQUFHO0FBQzFELGdCQUFVLEdBQUcsVUFBVSxVQUFVLGFBQWEsU0FBUyxHQUFHO0FBRTFELGlCQUFXLE9BQU8sTUFBUSxVQUFVO0FBQ3BDLGlCQUFXLE9BQU8sS0FBUSxVQUFVO0FBQ3BDLGlCQUFXLE9BQU8sT0FBUSxVQUFVO0FBQ3BDLGlCQUFXLE9BQU8sUUFBUSxVQUFVO0FBRXBDLGlCQUFXLE1BQU0sTUFBUyxVQUFVO0FBQ3BDLGlCQUFXLE1BQU0sS0FBUyxVQUFVO0FBQ3BDLGlCQUFXLE1BQU0sT0FBUyxVQUFVO0FBQ3BDLGlCQUFXLE1BQU0sUUFBUyxVQUFVO0FBRXBDLGlCQUFXLE1BQU0sT0FBUyxVQUFVO0FBQ3BDLGlCQUFXLE1BQU0sUUFBUyxVQUFVO0FBRXBDLFVBQUksU0FBVSxNQUFNLGFBQWEsT0FBTztBQUN4QyxVQUFJLFVBQVUsTUFBTSxhQUFhLE9BQU87QUFFeEMsZUFBUztBQUVULGVBQVMsVUFBVSxXQUFXLE9BQU8sV0FBVyxLQUFLLE9BQU8sV0FBVyxHQUFHO0FBRTFFLGVBQVMsS0FBSyxTQUFTO0FBQUEsSUFDeEI7QUFFQSxxQkFBaUIsRUFBQyxPQUFPLFVBQVM7QUFDakMsZUFBUyxPQUFPLE1BQU07QUFBQSxJQUN2QjtBQUVBLFVBQUssVUFBVTtBQUdmLDRCQUF3QjtBQUV2QixVQUFJLGFBQWE7QUFDakIsVUFBSSxhQUFhO0FBQ2pCLFVBQUksYUFBYTtBQUNqQixVQUFJLGFBQWE7QUFFakIsV0FBSyxRQUFRLENBQUMsTUFBTSxNQUFNO0FBQ3pCLFlBQUksS0FBSyxNQUFNO0FBQ2QsY0FBSSxFQUFDLE1BQU0sU0FBUTtBQUNuQixjQUFJLE9BQU8sT0FBTztBQUNsQixjQUFJLFlBQVksS0FBSyxZQUFhLEtBQUssU0FBUyxPQUFRLEtBQUssYUFBYSxLQUFNO0FBRWhGLGNBQUksV0FBVyxPQUFPO0FBRXRCLGNBQUksV0FBVyxHQUFHO0FBQ2pCLGdCQUFJLE1BQU07QUFDVCw0QkFBYztBQUVkLGtCQUFJLFFBQVEsR0FBRztBQUNkLDhCQUFjO0FBQ2QsNkJBQWE7QUFBQSxjQUNkO0FBRUMsNkJBQWE7QUFBQSxZQUNmLE9BQ0s7QUFDSiw0QkFBYztBQUVkLGtCQUFJLFFBQVEsR0FBRztBQUNkLDhCQUFjO0FBQ2QsNkJBQWE7QUFBQSxjQUNkO0FBRUMsNkJBQWE7QUFBQSxZQUNmO0FBQUEsVUFDRDtBQUFBLFFBQ0Q7QUFBQSxNQUNELENBQUM7QUFHRCxVQUFJLGNBQWMsWUFBWTtBQUM3QixZQUFJLENBQUM7QUFDSix3QkFBYyxRQUFRO0FBQ3ZCLFlBQUksQ0FBQyxZQUFZO0FBQ2hCLHdCQUFjLFFBQVE7QUFDdEIsd0JBQWMsUUFBUTtBQUFBLFFBQ3ZCO0FBQUEsTUFDRDtBQUdBLFVBQUksY0FBYyxZQUFZO0FBQzdCLFlBQUksQ0FBQztBQUNKLHdCQUFjLFFBQVE7QUFDdkIsWUFBSSxDQUFDLFlBQVk7QUFDaEIsd0JBQWMsUUFBUTtBQUN0Qix3QkFBYyxRQUFRO0FBQUEsUUFDdkI7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUVBLDZCQUF5QjtBQUV4QixVQUFJLE9BQU8sYUFBYTtBQUN4QixVQUFJLE9BQU8sYUFBYTtBQUV4QixVQUFJLE9BQU87QUFDWCxVQUFJLE9BQU87QUFFWCwwQkFBb0IsTUFBTSxNQUFNO0FBRS9CLGdCQUFRO0FBQUEsZUFDRjtBQUFHLG9CQUFRO0FBQU0sbUJBQU8sT0FBTztBQUFBLGVBQy9CO0FBQUcsb0JBQVE7QUFBTSxtQkFBTyxPQUFPO0FBQUEsZUFDL0I7QUFBRyxvQkFBUTtBQUFNLG1CQUFPLE9BQU87QUFBQSxlQUMvQjtBQUFHLG9CQUFRO0FBQU0sbUJBQU8sT0FBTztBQUFBO0FBQUEsTUFFdEM7QUFFQSxXQUFLLFFBQVEsQ0FBQyxNQUFNLE1BQU07QUFDekIsWUFBSSxPQUFPLEtBQUs7QUFFaEIsYUFBSyxPQUFPLFdBQVcsTUFBTSxLQUFLLElBQUk7QUFFdEMsWUFBSSxLQUFLLFNBQVM7QUFDakIsZUFBSyxRQUFRLFdBQVcsTUFBTSxLQUFLLFNBQVM7QUFBQSxNQUM5QyxDQUFDO0FBQUEsSUFDRjtBQUVBLHlCQUFxQjtBQUNwQixVQUFJLFNBQVM7QUFDWiwwQkFBa0I7QUFDbEI7QUFBQSxNQUNEO0FBSUEsVUFBSSxVQUFVLEdBQUc7QUFFaEIsWUFBSSxZQUFZLEtBQUssTUFBTTtBQUUzQixpQkFBUyxLQUFLLFdBQVc7QUFDeEIsY0FBSSxNQUFNLFVBQVU7QUFDcEIsY0FBSSxNQUFNLFdBQVc7QUFFckIsY0FBSSxPQUFPLE1BQU07QUFDaEIsbUJBQU8sS0FBSyxHQUFHO0FBR2YsZ0JBQUksS0FBSztBQUNSLDJCQUFhO0FBQUEsVUFDZixXQUNTLEtBQUssV0FBVztBQUN4QixnQkFBSSxNQUFNO0FBQ1YsZ0JBQUksTUFBTSxDQUFDO0FBQUEsVUFDWjtBQUFBLFFBQ0Q7QUFHQSxlQUFPLFFBQVEsQ0FBQyxJQUFHLE1BQU07QUFDeEIsY0FBSSxJQUFJLEdBQUU7QUFDVixjQUFJLE1BQU0sVUFBVTtBQUdwQixjQUFJLEtBQUssR0FBRztBQUNYLGdCQUFJLFNBQVMsSUFBSSxNQUFNLE9BQU0sSUFBSSxLQUFLLElBQUksR0FBRztBQUU3QyxnQkFBSSxNQUFNLE9BQU87QUFDakIsZ0JBQUksTUFBTSxPQUFPO0FBRWpCLGlCQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssRUFBRTtBQUNoQyxpQkFBSyxXQUFXLElBQUksS0FBSyxLQUFLLEVBQUU7QUFHaEMsZ0JBQUksS0FBSyxHQUFHLE1BQU0sSUFBSTtBQUNyQjtBQUNELGdCQUFJLEtBQUssR0FBRyxNQUFNLElBQUk7QUFDckI7QUFFRCxlQUFFLE1BQU0sTUFBTTtBQUNkLGVBQUUsTUFBTSxNQUFNO0FBQUEsVUFDZixXQUNTLEdBQUUsUUFBUSxXQUFXLE1BQU0sTUFBTTtBQUV6QyxnQkFBSSxTQUFTLEdBQUUsT0FBTyxNQUFPLElBQUksT0FBTyxVQUFVLEtBQUssSUFBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUUsR0FBRyxJQUFLLENBQUMsR0FBRSxLQUFLLEdBQUUsR0FBRztBQUc3RixnQkFBSSxNQUFNLElBQUksSUFBSSxLQUFLLEdBQUUsTUFBTSxPQUFPLEVBQUU7QUFDeEMsZ0JBQUksTUFBTSxJQUFJLElBQUksS0FBSyxHQUFFLE1BQU0sT0FBTyxFQUFFO0FBQUEsVUFDekM7QUFFQSxhQUFFLEtBQUssS0FBSztBQUNaLGFBQUUsS0FBSyxLQUFLO0FBQUEsUUFDYixDQUFDO0FBR0QsaUJBQVMsS0FBSyxXQUFXO0FBQ3hCLGNBQUksTUFBTSxVQUFVO0FBRXBCLGNBQUksSUFBSSxRQUFRLFFBQVEsSUFBSSxPQUFPLE9BQU8sV0FBVyxNQUFNLE1BQU07QUFDaEUsZ0JBQUksU0FBUyxJQUFJLE1BQU0sT0FBTSxJQUFJLEtBQUssSUFBSSxHQUFHO0FBQzdDLGdCQUFJLE1BQU0sT0FBTztBQUNqQixnQkFBSSxNQUFNLE9BQU87QUFBQSxVQUNsQjtBQUFBLFFBQ0Q7QUFHQSxpQkFBUyxLQUFLLFdBQVc7QUFDeEIsY0FBSSxNQUFNLFVBQVU7QUFFcEIsY0FBSSxJQUFJLFFBQVEsTUFBTTtBQUNyQixnQkFBSSxPQUFPLFVBQVUsSUFBSTtBQUV6QixnQkFBSSxLQUFLLE9BQU8sS0FBSztBQUNwQixrQkFBSSxTQUFTLElBQUksTUFBTSxPQUFNLEtBQUssS0FBSyxLQUFLLEdBQUc7QUFDL0Msa0JBQUksTUFBTSxPQUFPO0FBQ2pCLGtCQUFJLE1BQU0sT0FBTztBQUFBLFlBQ2xCO0FBQUEsVUFDRDtBQUFBLFFBQ0Q7QUFFQSxZQUFJLFVBQVUsQ0FBQztBQUVmLGlCQUFTLEtBQUssV0FBVztBQUN4QixjQUFJLE1BQU0sVUFBVTtBQUNwQixjQUFJLEtBQUssT0FBTztBQUVoQixjQUFJLEdBQUcsT0FBTyxJQUFJLE9BQU8sR0FBRyxPQUFPLElBQUksS0FBSztBQUMzQyxlQUFHLE1BQU0sSUFBSTtBQUNiLGVBQUcsTUFBTSxJQUFJO0FBQ2Isb0JBQVEsS0FBSztBQUFBLFVBQ2Q7QUFBQSxRQUNEO0FBR0EsZUFBTyxRQUFRLFFBQUs7QUFDbkIsY0FBSSxRQUFRLEdBQUU7QUFDYixlQUFFLFNBQVM7QUFBQSxRQUNiLENBQUM7QUFFRCxpQkFBUyxLQUFLO0FBQ2IsZUFBSyxZQUFZLENBQUM7QUFBQSxNQUNwQjtBQUVBLGVBQVMsS0FBSztBQUNiLG1CQUFXLEtBQUs7QUFFaEIsYUFBTyxRQUFRLGFBQWE7QUFBQSxJQUM5QjtBQUlBLHdCQUFvQixJQUFJO0FBR3ZCLFVBQUksS0FBSSxPQUFPO0FBQ2YsVUFBSSxJQUFJLEdBQUU7QUFFVixZQUFNLFFBQVEsT0FBTyxFQUFFLFFBQVEsT0FBTztBQUN0QyxZQUFNLFNBQVUsUUFBUSxJQUFLO0FBQzdCLFlBQU0sWUFBWSxFQUFFLFFBQVE7QUFFNUIsVUFBSSxNQUFPLEdBQUUsT0FBTyxFQUFFLFNBQVMsSUFBSTtBQUNuQyxVQUFJLE1BQU0sT0FBTyxNQUFNLENBQUM7QUFFeEIsVUFBSSxVQUFVLFFBQVEsTUFBTTtBQUU1QixVQUFJLEtBQUs7QUFFVCxVQUFJLFVBQVU7QUFDZCxVQUFJLEtBQ0gsVUFBVSxLQUNWLFVBQVUsS0FDVixVQUFVLE1BQU0sR0FDaEIsVUFBVSxNQUFNLENBQ2pCO0FBQ0EsVUFBSSxLQUFLO0FBRVQsVUFBSSxjQUFjLEdBQUU7QUFFcEIsWUFBTSxPQUFPLElBQUksT0FBTztBQUV4QixlQUFTLEtBQUssSUFBSSxNQUFNLElBQUksTUFBTTtBQUNqQyxZQUFJLEtBQUssSUFBSSxPQUFPLE1BQU07QUFDekIsY0FBSSxJQUFJLE1BQU0sUUFBUSxLQUFLLEdBQUcsS0FBTSxPQUFPLFlBQVksU0FBUyxPQUFPLENBQUM7QUFDeEUsY0FBSSxLQUFJLE1BQU0sUUFBUSxLQUFLLElBQUksS0FBSyxPQUFPLEdBQUUsUUFBVSxTQUFTLE9BQU8sQ0FBQztBQUV4RSxlQUFLLE9BQU8sSUFBSSxLQUFLLEVBQUM7QUFDdEIsZUFBSyxJQUFJLEdBQUcsSUFBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQUEsUUFDOUI7QUFBQSxNQUNEO0FBRUEsa0JBQ0MsRUFBRSxVQUFVLEdBQUUsVUFBVSxVQUN4QixPQUNBLE1BQ0EsRUFBRSxRQUFTLGFBQVksU0FBUyxHQUFFLFVBQVUsU0FDN0M7QUFFQSxVQUFJLEtBQUssSUFBSTtBQUNiLG1CQUFhLElBQUksT0FBTyxJQUFJO0FBRTVCLFVBQUksY0FBYztBQUVsQixVQUFJLFFBQVE7QUFFWixVQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTTtBQUFBLElBQy9CO0FBR0EsMEJBQXNCLE9BQU87QUFDNUIsVUFBSSxNQUFNLE1BQU0sS0FBSyxHQUFHLEdBQUcsVUFBVSxDQUFDO0FBQ3RDLFVBQUksTUFBTSxNQUFNLEtBQUssR0FBRyxHQUFHLFVBQVUsQ0FBQztBQUV0QyxhQUFPLE1BQU0sUUFBUSxRQUFRLE1BQU07QUFDbEM7QUFFRCxhQUFPLE1BQU0sUUFBUSxRQUFRLE1BQU0sVUFBVTtBQUM1QztBQUVELGFBQU8sQ0FBQyxLQUFLLEdBQUc7QUFBQSxJQUNqQjtBQUVBLFFBQUksTUFBTTtBQUVWLDBCQUFzQjtBQUVyQixhQUFPLFFBQVEsQ0FBQyxJQUFHLE1BQU07QUFDeEIsWUFBSSxJQUFJLEtBQUssR0FBRSxRQUFRLFVBQVUsS0FBSyxHQUFFLFVBQVUsTUFBTTtBQUN2RCxjQUFJLFFBQVEsYUFBYSxLQUFLLEVBQUU7QUFDaEMsYUFBRSxTQUFTLEdBQUUsTUFBTSxPQUFNLEdBQUcsTUFBTSxJQUFJLE1BQU0sRUFBRTtBQUFBLFFBQy9DO0FBQUEsTUFDRCxDQUFDO0FBRUQsYUFBTyxRQUFRLENBQUMsSUFBRyxNQUFNO0FBQ3hCLFlBQUksSUFBSSxLQUFLLEdBQUUsTUFBTTtBQUNwQixjQUFJLEdBQUU7QUFDSixxQkFBUyxDQUFDO0FBRVosY0FBSSxHQUFFLE9BQU8sS0FBSyxPQUFNLEdBQUcsSUFBSSxFQUFFO0FBQy9CLHVCQUFXLENBQUM7QUFFZCxlQUFLLGNBQWMsQ0FBQztBQUFBLFFBQ3JCO0FBQUEsTUFDRCxDQUFDO0FBQUEsSUFDRjtBQUVBLHNCQUFrQixJQUFJO0FBQ3JCLFlBQU0sS0FBSSxPQUFPO0FBRWpCLFVBQUksT0FBTyxHQUFHO0FBQ2IsY0FBTSxFQUFFLFFBQVEsTUFBTSxTQUFTLEdBQUU7QUFDakMsY0FBTSxRQUFRLE9BQU8sR0FBRSxTQUFTLE9BQU87QUFDdkMsY0FBTSxTQUFVLFFBQVEsSUFBSztBQUU3QixvQkFBWSxHQUFFLFFBQVEsT0FBTyxHQUFFLE1BQU0sR0FBRSxJQUFJO0FBRTNDLFlBQUksY0FBYyxHQUFFO0FBRXBCLFlBQUksVUFBVSxRQUFRLE1BQU07QUFFNUIsWUFBSSxLQUFLO0FBRVQsWUFBSSxNQUFNLFNBQ1QsTUFBTSxTQUNOLE1BQU0sU0FDTixNQUFNO0FBRVAsWUFBSSxVQUFVLFFBQVEsVUFBVTtBQUVoQyxZQUFJLEdBQUUsT0FBTztBQUNaLGlCQUFPO0FBRVIsWUFBSSxHQUFFLE9BQU8sR0FBRztBQUNmLGlCQUFPO0FBQ1AsaUJBQU87QUFBQSxRQUNSO0FBRUEsWUFBSSxVQUFVO0FBQ2QsWUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLLEdBQUc7QUFDM0IsWUFBSSxLQUFLO0FBRVQsWUFBSSxRQUFRO0FBQ1gsY0FBSSxLQUFLLElBQUk7QUFFZCxZQUFJLEdBQUUsTUFBTTtBQUNYLGNBQUksS0FBSyxNQUFNO0FBQ2YsbUJBQVMsSUFBSSxPQUFPLE1BQU07QUFBQSxRQUMzQixPQUNLO0FBQ0osbUJBQVMsSUFBSSxPQUFPLE1BQU07QUFFMUIsY0FBSSxHQUFFLFFBQVE7QUFDYixnQkFBSSxLQUFLLElBQUk7QUFBQSxRQUNmO0FBRUEsWUFBSSxRQUFRO0FBRVosWUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU07QUFFOUIsWUFBSSxjQUFjO0FBQUEsTUFDbkI7QUFFQSxVQUFJLEdBQUU7QUFDTCxlQUFPO0FBQUEsSUFDVDtBQUVBLHVCQUFtQixJQUFJLE1BQU0sVUFBVSxVQUFVO0FBQ2hELFVBQUksS0FBSSxPQUFPO0FBRWYsVUFBSSxPQUFPO0FBR1gsVUFBSSxLQUFLLFNBQVMsR0FBRztBQUNwQixZQUFJLEdBQUUsVUFBVTtBQUNmLGNBQUksVUFBVSxLQUFLO0FBQ25CLGNBQUksVUFBVSxLQUFLLEtBQUssU0FBUztBQUNqQyxpQkFBTyxDQUFDO0FBRVIsY0FBSTtBQUNILGlCQUFLLEtBQUssT0FBTztBQUNsQixjQUFJO0FBQ0gsaUJBQUssS0FBSyxPQUFPO0FBQUEsUUFDbkI7QUFFQSxlQUFPLElBQUksT0FBTztBQUVsQixZQUFJLGFBQWE7QUFFakIsaUJBQVMsSUFBSSxHQUFHLElBQUksS0FBSyxRQUFRLEtBQUs7QUFDckMsY0FBSSxJQUFJLEtBQUs7QUFFYixlQUFLLEtBQUssWUFBWSxTQUFTLEVBQUUsS0FBSyxZQUFZLFVBQVUsT0FBTztBQUVuRSx1QkFBYSxFQUFFO0FBQUEsUUFDaEI7QUFFQSxhQUFLLEtBQUssWUFBWSxTQUFTLFVBQVUsVUFBVSxZQUFZLFVBQVUsT0FBTztBQUFBLE1BQ2pGO0FBRUEsYUFBTztBQUFBLElBQ1I7QUFFQSxvQkFBZ0IsTUFBTSxNQUFNLEdBQUc7QUFDOUIsVUFBSSxVQUFVLEtBQUssS0FBSyxTQUFTO0FBRWpDLFVBQUksV0FBVyxRQUFRLE1BQU07QUFDNUIsZ0JBQVEsS0FBSztBQUFBO0FBRWIsYUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFBQSxJQUNyQjtBQUVBLHdCQUFvQixPQUFNLElBQUksS0FBSyxLQUFLO0FBQ3ZDLFlBQU0sS0FBSSxPQUFPO0FBRWpCLFlBQU0sUUFBUyxLQUFLO0FBQ3BCLFlBQU0sUUFBUyxLQUFLO0FBQ3BCLFlBQU0sU0FBUyxPQUFPO0FBQ3RCLFlBQU0sU0FBUyxPQUFPLEdBQUU7QUFFeEIsWUFBTSxTQUFTLE9BQU8sSUFBSSxFQUFDLFFBQVEsSUFBSSxPQUFPLEdBQUcsTUFBTSxNQUFNLE1BQU0sS0FBSSxJQUFJLE9BQU8sS0FBRyxHQUFHO0FBQ3hGLFlBQU0sU0FBUyxPQUFPO0FBQ3RCLFlBQU0sUUFBUSxPQUFPLEdBQUUsU0FBUyxPQUFPO0FBRXZDLFVBQUksT0FBTyxLQUNWLE9BQU8sQ0FBQyxLQUNSLE1BQU07QUFHUCxVQUFJLE9BQU8sQ0FBQztBQUVaLFVBQUksT0FBTyxNQUFNLFFBQVEsTUFBTSxPQUFPLElBQUksTUFBTSxNQUFNLFFBQVEsU0FBUyxPQUFPLENBQUM7QUFHL0UsVUFBSSxHQUFFLFFBQVEsT0FBTyxLQUFLLE9BQU8sSUFBSTtBQUNwQyxZQUFJO0FBQ0gsaUJBQU8sT0FBTyxDQUFDLE9BQU8sTUFBTSxRQUFRLE1BQU0sTUFBTSxRQUFRLFNBQVMsT0FBTyxDQUFDLENBQUM7QUFFM0UsWUFBSSxPQUFPLE1BQU0sTUFBTTtBQUN0QixlQUFLLEtBQUssQ0FBQyxTQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQUEsTUFDL0I7QUFFQSxlQUFTLElBQUksT0FBTyxJQUFJLE1BQU0sS0FBSyxLQUFLLE9BQU8sS0FBSyxLQUFLLEtBQUssS0FBSztBQUNsRSxZQUFJLElBQUksTUFBTSxRQUFRLE1BQU0sSUFBSSxRQUFRLFNBQVMsT0FBTyxDQUFDO0FBRXpELFlBQUksS0FBSyxNQUFNO0FBQ2QsY0FBSSxNQUFNLE1BQU0sTUFBTTtBQUNyQixtQkFBTyxNQUFNLFFBQVEsTUFBTSxJQUFJLFFBQVEsU0FBUyxPQUFPLENBQUM7QUFDeEQsbUJBQU8sSUFBSSxNQUFNLElBQUk7QUFDckIsbUJBQU8sSUFBSSxNQUFNLElBQUk7QUFBQSxVQUN0QjtBQUFBLFFBQ0QsT0FDSztBQUNKLGNBQUksVUFBVTtBQUVkLGNBQUksUUFBUSxLQUFLO0FBQ2hCLG1CQUFPLE9BQU8sTUFBTSxJQUFJO0FBQ3hCLG1CQUFPLE9BQU8sTUFBTSxJQUFJO0FBQ3hCLG1CQUFPLE9BQU8sTUFBTSxJQUFJO0FBQ3hCLG1CQUFPO0FBQUEsVUFDUjtBQUVDLHNCQUFVO0FBRVgsY0FBSSxNQUFNLE1BQU0sTUFBTTtBQUNyQixtQkFBTyxNQUFNLFFBQVEsTUFBTSxJQUFJLFFBQVEsU0FBUyxPQUFPLENBQUM7QUFDeEQsbUJBQU8sT0FBTyxHQUFHLElBQUk7QUFDckIsbUJBQU8sT0FBTztBQUdkLGdCQUFJLElBQUksT0FBTyxLQUFLLE1BQU0sSUFBRSxNQUFNO0FBQ2pDLHdCQUFVO0FBQUEsVUFDWixPQUNLO0FBQ0osbUJBQU87QUFDUCxtQkFBTyxDQUFDO0FBQUEsVUFDVDtBQUVBLHFCQUFXLE9BQU8sTUFBTSxNQUFNLENBQUM7QUFFL0IsaUJBQU87QUFBQSxRQUNSO0FBQUEsTUFDRDtBQUdBLFVBQUksTUFBTSxRQUFRO0FBQ2pCLGVBQU8sTUFBTSxNQUFNLElBQUk7QUFFeEIsVUFBSSxHQUFFLE1BQU07QUFDWCxZQUFJLFlBQVksUUFBUSxLQUFLLEtBQUs7QUFHbEMsWUFBSSxPQUFPLE1BQU0sT0FBTyxJQUFJO0FBQzNCLGVBQUssVUFBVTtBQUNmLGdCQUFNO0FBQUEsUUFDUDtBQUVBLFlBQUksT0FBTyxLQUFLLE9BQU8sSUFBSTtBQUMxQixlQUFLLFVBQVUsVUFBVTtBQUN6QixnQkFBTTtBQUVOLGNBQUksT0FBTyxNQUFNLE1BQU0sVUFBVTtBQUNoQyxpQkFBSyxLQUFLLENBQUMsTUFBTSxVQUFVLE9BQU8sQ0FBQztBQUFBLFFBQ3JDO0FBRUEsZUFBTyxPQUFPLElBQUksTUFBTSxRQUFRLE1BQU0sTUFBTSxRQUFRLFNBQVMsT0FBTyxDQUFDLENBQUM7QUFBQSxNQUN2RTtBQUVBLFVBQUksT0FBTyxHQUFHO0FBQ2IsZUFBTyxPQUFPLFVBQVUsSUFBSSxNQUFNLE1BQU0sUUFBUSxNQUFNLE1BQU0sUUFBUSxJQUFJO0FBRXhFLFlBQUksR0FBRSxRQUFRLE1BQU07QUFDbkIsY0FBSSxPQUFPLE9BQU8sT0FBTyxJQUFJLE9BQU8sTUFBTTtBQUUxQyxjQUFJLFFBQVEsTUFBTSxRQUFRLEdBQUcsUUFBUSxTQUFTLE9BQU8sQ0FBQztBQUN0RCxlQUFLLE9BQU8sVUFBVSxTQUFTLEtBQUs7QUFDcEMsZUFBSyxPQUFPLFNBQVMsS0FBSztBQUFBLFFBQzNCO0FBQUEsTUFDRDtBQUVBLFVBQUksR0FBRTtBQUNMLGVBQU87QUFFUixhQUFPO0FBQUEsSUFDUjtBQUVBLDBCQUFzQixNQUFNLE1BQUssTUFBSyxTQUFTO0FBQzlDLFVBQUk7QUFFSixVQUFJLFdBQVc7QUFDZCxvQkFBWSxDQUFDLEdBQUcsQ0FBQztBQUFBLFdBQ2I7QUFDSixZQUFJLFdBQVcsS0FBSyxNQUFNLE9BQU0sTUFBSyxNQUFLLE9BQU87QUFDakQsWUFBSSxRQUFRLEtBQUssTUFBTSxPQUFNLE1BQUssTUFBSyxTQUFTLFFBQVE7QUFDeEQsb0JBQVksU0FBUyxPQUFNLE1BQUssT0FBTyxTQUFTLFFBQVE7QUFDeEQsa0JBQVUsS0FBSyxVQUFVLEtBQUcsUUFBUTtBQUFBLE1BQ3JDO0FBRUEsYUFBTztBQUFBLElBQ1I7QUFFQSw0QkFBd0IsTUFBTSxLQUFLLE1BQU0sTUFBTSxLQUFLLE9BQU8sUUFBUSxNQUFNO0FBQ3hFLFVBQUksU0FBVSxRQUFRLElBQUs7QUFFM0IsVUFBSSxVQUFVLFFBQVEsTUFBTTtBQUU1QixrQkFBWSxRQUFRLE9BQU8sSUFBSTtBQUUvQixVQUFJLFVBQVU7QUFFZCxVQUFJLElBQUksSUFBSSxJQUFJLElBQUksT0FBTyxPQUFRLFNBQVEsS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNO0FBRW5FLFVBQUksT0FBTyxHQUFHO0FBQ2IsYUFBSztBQUNMLGFBQUs7QUFBQSxNQUNOLE9BQ0s7QUFDSixhQUFLO0FBQ0wsYUFBSztBQUFBLE1BQ047QUFFQSxXQUFLLFFBQVEsQ0FBQyxNQUFLLE1BQU07QUFDeEIsWUFBSSxPQUFPO0FBQ1YsZUFBSyxLQUFLO0FBQUE7QUFFVixlQUFLLEtBQUs7QUFFWCxZQUFJLE9BQU8sSUFBSSxFQUFFO0FBQ2pCLFlBQUksT0FBTyxJQUFJLEVBQUU7QUFBQSxNQUNsQixDQUFDO0FBRUQsVUFBSSxPQUFPO0FBRVgsVUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU07QUFBQSxJQUMvQjtBQUVBLDRCQUF3QjtBQUN2QixXQUFLLFFBQVEsQ0FBQyxNQUFNLE1BQU07QUFDekIsWUFBSSxDQUFDLEtBQUs7QUFDVDtBQUVELFlBQUksUUFBUSxPQUFPLEtBQUs7QUFHeEIsWUFBSSxNQUFNLE9BQU87QUFDaEI7QUFFRCxZQUFJLE9BQU8sS0FBSztBQUNoQixZQUFJLE1BQU0sT0FBTztBQUVqQixZQUFJLEVBQUMsV0FBSyxjQUFPO0FBRWpCLFlBQUksQ0FBQyxNQUFNLE9BQU8sWUFBWSxhQUFhLE1BQU0sTUFBSyxNQUFLLE9BQU8sSUFBSSxhQUFhLFVBQVU7QUFHN0YsWUFBSSxXQUFXLE1BQU0sU0FBUztBQUU5QixZQUFJLFNBQVMsS0FBSyxNQUFNLE9BQU0sTUFBSyxNQUFLLE1BQU0sVUFBVSxRQUFRO0FBRWhFLFlBQUksU0FBVSxPQUFPLElBQUksVUFBVTtBQUNuQyxZQUFJLFVBQVUsT0FBTyxJQUFJLFVBQVU7QUFDbkMsWUFBSSxVQUFVLE9BQU8sSUFBSSxVQUFVO0FBRW5DLFlBQUksVUFBVSxPQUFPLElBQUksU0FBTyxNQUFNLE9BQU8sS0FBSyxPQUFPLFNBQVMsT0FBTyxDQUFDLENBQUM7QUFFM0UsWUFBSSxVQUFXLE1BQU0sS0FBSyxNQUFNLE9BQU87QUFFdkMsWUFBSSxTQUFRLEtBQUs7QUFDakIsWUFBSSxXQUFXLE9BQU0sT0FBTyxNQUFNLE9BQU0sT0FBTyxPQUFPLElBQUk7QUFJMUQsWUFBSSxTQUFTLEtBQUssT0FDakIsT0FDQSxNQUFNLFNBQVMsSUFBSSxPQUFPLElBQUksUUFBSyxNQUFNLEdBQUUsSUFBSSxRQUMvQyxPQUNBLE1BQU0sU0FBUyxJQUFJLE1BQU0sT0FBTyxNQUFPLE1BQU0sT0FBTyxNQUFNLElBQzNEO0FBR0EsWUFBSSxRQUFRLFFBQVEsSUFBSSxLQUFLLE9BQU8sT0FBTSxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUcsTUFBTTtBQUVyRSxZQUFJLFVBQVcsTUFBTSxLQUFLLE9BQU8sT0FBTztBQUN4QyxZQUFJLFdBQVcsV0FBVztBQUMxQixZQUFJLFdBQVcsT0FBTyxLQUFLLFFBQVEsS0FBSyxPQUFPLEtBQUssUUFBUSxJQUFJLEtBQUs7QUFDckUsWUFBSSxXQUFXLFVBQVUsV0FBVztBQUNwQyxZQUFJLEtBQVcsT0FBTyxJQUFJLFdBQVc7QUFDckMsWUFBSSxJQUFXLE9BQU8sSUFBSSxXQUFXO0FBRXJDLFlBQUksT0FBZSxLQUFLLEtBQUs7QUFDN0IsWUFBSSxZQUFlLEtBQUssVUFBVTtBQUNsQyxZQUFJLFlBQWUsUUFBUSxJQUFJLE9BQ1osUUFBUSxJQUFJLFFBQ1osT0FBTyxJQUFJLFdBQVcsUUFBUSxJQUFJLFFBQVE7QUFDN0QsWUFBSSxlQUFlLFNBQ0EsT0FBTyxJQUFJLFdBQVcsUUFBUSxJQUFJLE1BQVE7QUFFN0QsWUFBSSxhQUFlLEtBQUssS0FBSyxLQUFLO0FBRWxDLGVBQU8sUUFBUSxDQUFDLEtBQUssT0FBTTtBQUMxQixjQUFJLE9BQU87QUFDVixnQkFBSSxRQUFRO0FBQUE7QUFFWixpQkFBSSxRQUFRO0FBRWIsVUFBQyxNQUFHLEtBQUssTUFBTSxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sTUFBTTtBQUMzQyxnQkFBSSxPQUFPO0FBQ1Ysa0JBQUksS0FBSztBQUNULGtCQUFJLFVBQVUsR0FBRyxLQUFJLElBQUksVUFBVTtBQUNuQyxrQkFBSSxPQUFPLEtBQUs7QUFDaEIsa0JBQUksU0FBUyxNQUFNLEdBQUcsQ0FBQztBQUN2QixrQkFBSSxRQUFRO0FBQUEsWUFDYjtBQUVDLGtCQUFJLFNBQVMsTUFBTSxHQUFHLEtBQUksSUFBSSxVQUFVO0FBQUEsVUFDMUMsQ0FBQztBQUFBLFFBQ0YsQ0FBQztBQUdELFlBQUksS0FBSyxPQUFPO0FBQ2YsY0FBSSxLQUFLO0FBRVQsY0FBSSxXQUFXLE1BQU0sS0FBSyxRQUFRLE9BQU87QUFFekMsY0FBSSxPQUFPLEdBQUc7QUFDYixnQkFBSSxLQUFJO0FBRVIsZ0JBQUksVUFDSCxVQUNBLE1BQU0sVUFBVSxVQUFVLENBQUMsQ0FDNUI7QUFDQSxnQkFBSSxPQUFRLFNBQVEsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQUEsVUFFdEMsT0FDSztBQUNKLGdCQUFJLE1BQU0sVUFBVSxVQUFVLENBQUM7QUFDL0IsaUJBQUk7QUFBQSxVQUNMO0FBRUEsY0FBSSxPQUFlLEtBQUssVUFBVTtBQUVsQyxjQUFJLFlBQWU7QUFDbkIsY0FBSSxlQUFlLFFBQVEsSUFBSSxNQUFNO0FBRXJDLGNBQUksU0FBUyxLQUFLLE9BQU8sR0FBRyxFQUFDO0FBRTdCLGNBQUksUUFBUTtBQUFBLFFBQ2I7QUFHQSxZQUFJLE9BQU0sTUFBTTtBQUNmLHlCQUNDLFNBQ0EsS0FDQSxNQUNBLFNBQ0EsVUFDQSxPQUFPLE9BQU0sU0FBUyxPQUFPLEdBQzdCLE9BQU0sTUFDUDtBQUFBLFFBQ0Q7QUFHQSxZQUFJLFFBQU8sS0FBSztBQUVoQixZQUFJLE1BQUssTUFBTTtBQUNkLHlCQUNDLFNBQ0EsS0FDQSxPQUFPLElBQUksSUFBSSxHQUNmLE9BQU8sSUFBSSxVQUFVLFNBQ3JCLE9BQU8sSUFBSSxVQUFVLFNBQ3JCLE9BQU8sTUFBSyxTQUFTLE9BQU8sR0FDNUIsTUFBSyxRQUNMLE1BQUssSUFDTjtBQUFBLFFBQ0Q7QUFBQSxNQUNELENBQUM7QUFFRCxXQUFLLFVBQVU7QUFBQSxJQUNoQjtBQUVBLDRCQUF3QjtBQUd2QixhQUFPLFFBQVEsQ0FBQyxJQUFHLE1BQU07QUFDeEIsWUFBSSxJQUFJLEdBQUc7QUFDVixhQUFFLE1BQU07QUFDUixhQUFFLE1BQU0sQ0FBQztBQUNULGFBQUUsU0FBUztBQUFBLFFBQ1o7QUFBQSxNQUNELENBQUM7QUFBQSxJQUNGO0FBRUEsUUFBSTtBQUVKLHFCQUFpQjtBQUNoQixVQUFJLFNBQVM7QUFDWixzQkFBYztBQUNkO0FBQUEsTUFDRDtBQUlBLFVBQUksVUFBVSxHQUFHLEdBQUcsSUFBSSxRQUFRLElBQUksT0FBTztBQUMzQyxXQUFLLFdBQVc7QUFDaEIsbUJBQWE7QUFDYixpQkFBVztBQUNYLGlCQUFXO0FBQ1gsV0FBSyxNQUFNO0FBQUEsSUFDWjtBQUVBLFVBQUssU0FBUyxrQkFBZ0I7QUFDN0IsVUFBSSxpQkFBaUI7QUFDcEIsa0JBQVUsV0FBVyxPQUFPLFdBQVcsS0FBSyxPQUFPLFdBQVcsR0FBRztBQUFBO0FBRWpFLGNBQU07QUFBQSxJQUNSO0FBS0Esc0JBQWtCLE1BQUssT0FBTTtBQUM1QixVQUFJLEtBQUssT0FBTztBQUVoQixVQUFJLEdBQUcsUUFBUSxNQUFNO0FBQ3BCLFlBQUksUUFBTyxXQUFXO0FBQ3JCLGNBQUksR0FBRyxTQUFTLEdBQUc7QUFDbEIsa0JBQUssTUFBTSxXQUFXLE1BQUssS0FBSyxLQUFLLEVBQUU7QUFDdkMsa0JBQUssTUFBTSxXQUFXLE1BQUssS0FBSyxLQUFLLEVBQUU7QUFBQSxVQUN4QztBQUdBLGNBQUssR0FBRyxRQUFRLEtBQUssR0FBRyxRQUFRLE1BQUssTUFBTSxNQUFLLEtBQUs7QUFFcEQsZ0JBQUksT0FBTyxhQUFhLEtBQUssSUFBSSxNQUFLLEtBQUssTUFBSyxLQUFLLFVBQVUsRUFBRTtBQUVqRSxnQkFBSSxPQUFPO0FBQ1Y7QUFBQSxVQUNGO0FBQUEsUUFDRDtBQUlBLG1CQUFXLFFBQU87QUFFbEIsbUJBQVc7QUFDWCxrQkFBVTtBQUNWLFNBQUMsWUFBWSxNQUFNO0FBQ25CLG1CQUFXO0FBQUEsTUFDWjtBQUFBLElBQ0Q7QUFFQSxVQUFLLFdBQVc7QUFJaEIsUUFBSTtBQUNKLFFBQUk7QUFHSixRQUFJO0FBQ0osUUFBSTtBQUdKLFFBQUk7QUFDSixRQUFJO0FBRUosUUFBSSxXQUFXO0FBRWYsVUFBTSxPQUFRLE9BQU87QUFFckIsUUFBSSxRQUFTLEtBQUs7QUFDbEIsUUFBSSxRQUFTLEtBQUs7QUFFbEIsUUFBSyxPQUFPLE1BQU07QUFDakIsVUFBSSxJQUFJO0FBRVIsVUFBSSxPQUFPLEdBQUc7QUFDYixxQkFBYSxPQUFPO0FBQ3BCLGFBQUssU0FBUyxJQUFJLEtBQUssSUFBSTtBQUFBLE1BQzVCO0FBRUEsVUFBSSxPQUFPLEdBQUc7QUFDYixvQkFBWSxPQUFPO0FBQ25CLGFBQUssU0FBUyxJQUFJLEtBQUssSUFBSTtBQUFBLE1BQzVCO0FBQUEsSUFDRDtBQUVBLFVBQU0sU0FBUyxNQUFLLFNBQVMsT0FBTztBQUFBLE1BQ25DLE1BQVE7QUFBQSxNQUNSLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxNQUNQLEtBQUs7QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNULEdBQUcsS0FBSyxNQUFNO0FBRWQsVUFBTSxZQUFZLE9BQU8sT0FBTyxTQUFTLFVBQVUsSUFBSSxJQUFJO0FBRTNELHVCQUFtQixPQUFNLE9BQU87QUFDL0IsVUFBSSxPQUFPLE1BQU07QUFDaEIsaUJBQVMsUUFBUTtBQUNoQixxQkFBVyxXQUFXLE1BQU0sT0FBTyxRQUFRLE1BQUssS0FBSztBQUV0RCxrQkFBVSxTQUFTLEtBQUssV0FBVztBQUFBLE1BQ3BDO0FBQUEsSUFDRDtBQUVBLFVBQUssWUFBWTtBQUVqQix1QkFBbUIsR0FBRyxPQUFPO0FBQzVCLFVBQUksS0FBSSxPQUFPO0FBQ2YsVUFBSSxRQUFRLGFBQWEsV0FBVyxHQUFHLEdBQUcsYUFBYTtBQUV2RCxVQUFJLEdBQUU7QUFDTCxpQkFBUyxTQUFTLE9BQU8sS0FBSztBQUFBLFdBQzFCO0FBQ0osaUJBQVMsU0FBUyxPQUFPLEtBQUs7QUFDN0Isa0JBQVUsU0FBUyxLQUFLLE1BQU0sVUFBVSxJQUFJLEdBQUcsR0FBRztBQUFBLE1BQ3BEO0FBQUEsSUFDRDtBQUVBLHVCQUFtQixNQUFLLE1BQUssTUFBSztBQUNqQyxlQUFTLE1BQUssRUFBQyxXQUFLLFVBQUcsQ0FBQztBQUFBLElBQ3pCO0FBRUEsdUJBQW1CLEdBQUcsT0FBTSxNQUFLO0FBR2hDLFVBQUksS0FBSSxPQUFPO0FBSWQsVUFBSSxNQUFLLFNBQVM7QUFDakIsaUJBQVMsQ0FBQztBQUVYLFVBQUksTUFBSyxRQUFRLE1BQU07QUFDdEIsV0FBRSxPQUFPLE1BQUs7QUFDYixrQkFBVSxHQUFHLE1BQUssSUFBSTtBQUV2QixZQUFJLEdBQUUsTUFBTTtBQUVYLGNBQUksS0FBSyxPQUFPLElBQUUsTUFBTSxPQUFPLElBQUUsR0FBRyxPQUFPLElBQUUsSUFBSSxJQUFFO0FBQ25ELGlCQUFPLElBQUksT0FBTyxHQUFFO0FBQ25CLG9CQUFVLElBQUksTUFBSyxJQUFJO0FBQUEsUUFDekI7QUFFQSxrQkFBVSxXQUFXLE9BQU8sV0FBVyxLQUFLLE9BQU8sV0FBVyxHQUFHO0FBQUEsTUFDbEU7QUFLRCxXQUFLLGFBQWEsR0FBRyxLQUFJO0FBRXhCLGNBQU8sS0FBSyxJQUFJLGFBQWEsT0FBTSxHQUFHLEtBQUk7QUFBQSxJQUM1QztBQUVBLFVBQUssWUFBWTtBQUVqQixvQkFBZ0IsR0FBRyxPQUFPO0FBQ3pCLGFBQU8sR0FBRyxRQUFRO0FBRWxCLFVBQUs7QUFDSixtQkFBVyxHQUFHLEdBQUcsV0FBVyxNQUFNLFVBQVU7QUFBQSxJQUM5QztBQUVBLHVCQUFtQixHQUFHLE9BQU87QUFDNUIsVUFBSSxLQUFJLE9BQU87QUFFZixhQUFPLEdBQUcsS0FBSztBQUVmLFVBQUksR0FBRSxNQUFNO0FBRVgsWUFBSSxLQUFLLE9BQU8sSUFBRSxHQUFHLE9BQU8sSUFBRSxJQUFJLElBQUU7QUFDcEMsZUFBTyxJQUFJLEtBQUs7QUFBQSxNQUNqQjtBQUFBLElBQ0Q7QUFHQSxVQUFNLGdCQUFpQixNQUFNLE9BQU8sTUFBTTtBQUUxQyxRQUFJLFVBQVU7QUFFZCxzQkFBa0IsR0FBRztBQUNwQixVQUFJLEtBQUssU0FBUztBQUdqQixlQUFPLFFBQVEsQ0FBQyxJQUFHLE9BQU87QUFDekIsb0JBQVUsSUFBSSxLQUFLLFFBQVEsTUFBTSxLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sS0FBSztBQUFBLFFBQ2hFLENBQUM7QUFFRCxrQkFBVTtBQUNWLGNBQU07QUFBQSxNQUNQO0FBQUEsSUFDRDtBQUVBLFFBQUksY0FBYyxhQUFhO0FBQzlCLFNBQUcsWUFBWSxVQUFVLE9BQUs7QUFDN0IsWUFBSSxPQUFPO0FBQ1Y7QUFDRCxrQkFBVSxNQUFNLEVBQUMsT0FBTyxNQUFLLEdBQUcsU0FBUyxTQUFTO0FBQ2xELHFCQUFhO0FBQUEsTUFDZCxDQUFDO0FBQUEsSUFDRjtBQUVBLDZCQUF5QixLQUFLLE9BQU87QUFDcEMsVUFBSSxNQUFNO0FBRVYsVUFBSSxTQUFTLFdBQVc7QUFDdkIsY0FBTTtBQUNOLGNBQU0sTUFBTTtBQUFBLE1BQ2I7QUFFQSxVQUFJLE1BQU0sTUFBTTtBQUVoQixVQUFJLEtBQUssT0FBTztBQUNoQixVQUFJLEtBQUksR0FBRyxNQUFNLEdBQUc7QUFDcEIsYUFBTyxHQUFHLE1BQU0sTUFBTTtBQUFBLElBQ3ZCO0FBRUEsZ0NBQTRCLEtBQUs7QUFDaEMsVUFBSSxJQUFJLGdCQUFnQixLQUFLLFNBQVM7QUFDdEMsYUFBTyxXQUFXLEdBQUcsS0FBSyxJQUFJLElBQUksRUFBRTtBQUFBLElBQ3JDO0FBRUEsVUFBSyxXQUFXLFNBQU8sV0FBVyxLQUFLLEtBQUssRUFBRTtBQUM5QyxVQUFLLFdBQVc7QUFDaEIsVUFBSyxXQUFXO0FBQ2hCLFVBQUssV0FBVyxDQUFDLEtBQUssT0FBTyxTQUM1QixTQUFTLFlBQ1QsUUFBUSxLQUFLLE9BQU8sUUFDbkIsT0FBTSxVQUFVLFlBQ2hCLE9BQU0sVUFBVSxDQUNqQixJQUNBLFFBQVEsS0FBSyxPQUFPLFFBQ25CLE9BQU0sVUFBVSxZQUNoQixPQUFNLFVBQVUsQ0FDakI7QUFHRCxRQUFJLFVBQVU7QUFDZCxRQUFJLGNBQWM7QUFDbEIsUUFBSSxrQkFBa0I7QUFDdEIsUUFBSSxxQkFBcUI7QUFHekIsbUJBQWUsSUFBSTtBQUNsQixnQkFBVTtBQUNWLFNBQUcsS0FBSTtBQUNQLGdCQUFVO0FBQ1YseUJBQW1CLFVBQVU7QUFDNUIsNEJBQXNCLGFBQWE7QUFDcEMscUJBQWUsQ0FBQyxZQUFZLE1BQU07QUFDbEMsd0JBQWtCLHFCQUFxQixjQUFjLFdBQVc7QUFBQSxJQUNqRTtBQUVBLFVBQUssUUFBUTtBQUVaLElBQUMsTUFBSyxZQUFZLFdBQVE7QUFDMUIsbUJBQWEsTUFBSztBQUNsQixrQkFBWSxNQUFLO0FBRWpCLG1CQUFhO0FBQUEsSUFDZDtBQUVBLFFBQUksWUFBWTtBQUVoQiwwQkFBc0IsSUFBSSxLQUFLO0FBQzlCLFVBQUksU0FBUztBQUNaLDZCQUFxQjtBQUNyQjtBQUFBLE1BQ0Q7QUFJQSxrQkFBWTtBQUVaLFVBQUksT0FBTyxNQUFNO0FBQ2hCLGVBQU8sS0FBSyxNQUFNLElBQUcsTUFBTSxVQUFVLEdBQUUsQ0FBQztBQUN4QyxlQUFPLEtBQUssTUFBTSxJQUFHLEdBQUUsTUFBTSxTQUFTLENBQUM7QUFBQSxNQUN4QztBQUVBLFVBQUk7QUFJSixVQUFJLGdCQUFnQixLQUFLO0FBR3pCLFVBQUksYUFBYSxLQUFLLFdBQVcsS0FBSyxlQUFlO0FBQ3BELGNBQU07QUFFTixpQkFBUyxJQUFJLEdBQUcsSUFBSSxPQUFPLFFBQVEsS0FBSztBQUN2QyxjQUFJLElBQUksR0FBRztBQUNWLDBCQUFjLEtBQUs7QUFDbEIsc0JBQVUsU0FBUyxLQUFLLE1BQU0sVUFBVSxJQUFJLEtBQUssR0FBRztBQUFBLFVBQ3REO0FBRUEsY0FBSSxZQUFZO0FBQ2YsZ0JBQUksS0FBSyxLQUFLO0FBQ2I7QUFFRCxxQkFBUyxJQUFJLEdBQUcsSUFBSSxXQUFXLEdBQUcsUUFBUTtBQUN6Qyx5QkFBVyxHQUFHLEdBQUcsWUFBWSxZQUFZO0FBQUEsVUFDM0M7QUFBQSxRQUNEO0FBRUEsWUFBSTtBQUNILG9CQUFVLE1BQU0sRUFBQyxPQUFPLEtBQUksR0FBRyxTQUFTLFNBQVM7QUFBQSxNQUNuRCxPQUNLO0FBR0osY0FBTSxtQkFBbUIsVUFBVTtBQUVuQyxZQUFJLE1BQU0sT0FBTztBQUVqQixZQUFJLE9BQU8sT0FBTyxRQUFRLEtBQUssR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUM7QUFFM0QsaUJBQVMsSUFBSSxHQUFHLElBQUksT0FBTyxRQUFRLEtBQUs7QUFDdkMsY0FBSSxLQUFJLE9BQU87QUFFZixjQUFJLElBQUksS0FBSyxHQUFFLE1BQU07QUFDcEIsZ0JBQUksV0FBVyxLQUFLLEdBQUc7QUFFdkIsZ0JBQUksT0FBTyxZQUFZLE9BQU8sTUFBTSxPQUFPLFFBQVEsVUFBVSxPQUFPLEdBQUUsUUFBUSxZQUFZLENBQUMsQ0FBQztBQUU1RiwwQkFBYyxLQUFLLE9BQU8sSUFBSSxJQUFJLE9BQU8sU0FBUyxJQUFJO0FBRXJELHNCQUFVLFNBQVMsS0FBSyxNQUFNLFVBQVUsSUFBSSxNQUFNLElBQUk7QUFBQSxVQUN4RDtBQUVDLDBCQUFjLEtBQUs7QUFFcEIsY0FBSSxZQUFZO0FBQ2YsZ0JBQUksT0FBTyxPQUFPLE9BQU8sS0FBSyxLQUFLO0FBQ2xDO0FBRUQsZ0JBQUksT0FBTSxLQUFLLEtBQUssZUFBZSxJQUFJLFFBQVEsS0FBSztBQUVwRCxnQkFBSSxPQUFPLGlCQUFpQixHQUFFLE9BQU8sT0FBTSxHQUFHLEdBQUcsSUFBSSxFQUFDLEdBQUcsR0FBRSxNQUFNLE9BQU0sS0FBSSxNQUFNLEdBQUcsR0FBRyxFQUFDO0FBRXhGLGdCQUFJLElBQUk7QUFFUixxQkFBUyxLQUFLO0FBQ2IseUJBQVcsR0FBRyxLQUFLLFlBQVksWUFBWSxLQUFLO0FBQUEsVUFDbEQ7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUdBLFVBQUksT0FBTyxRQUFRLFVBQVU7QUFDNUIsWUFBSSxLQUFLLElBQUksYUFBYSxVQUFVO0FBQ3BDLFlBQUksS0FBSyxJQUFJLFlBQVksU0FBUztBQUVsQyxZQUFJLE9BQU8sTUFBTTtBQUNoQixjQUFJLENBQUMsTUFBTSxRQUFRLFNBQVM7QUFHNUIsY0FBSSxRQUFRLElBQUksT0FBTztBQUN2QixrQkFBUSxNQUFNO0FBQ2Qsa0JBQVEsTUFBTTtBQUVkLGNBQUksTUFBTTtBQUNULGdCQUFJLEtBQUssT0FBTztBQUNoQixnQkFBSSxVQUFVLElBQUksU0FBUyxJQUFJLE9BQU8sT0FBTyxJQUFJO0FBQ2pELGdCQUFJLFdBQVcsSUFBSSxTQUFTLElBQUksT0FBTyxRQUFRLElBQUksT0FBTyxRQUFRLElBQUk7QUFFdEUsbUJBQU8sUUFBUSxRQUFRLFNBQVMsSUFBSSxZQUFZLENBQUM7QUFDakQsbUJBQU8sU0FBUyxJQUFJLE9BQU8sUUFBUSxRQUFRLFVBQVUsSUFBSSxZQUFZLENBQUMsQ0FBQztBQUV2RSx1QkFBVyxXQUFXLE1BQU0sT0FBTyxLQUFLO0FBQ3hDLHVCQUFXLFdBQVcsT0FBTyxPQUFPLE1BQU07QUFFMUMsZ0JBQUksQ0FBQyxNQUFNO0FBQ1YseUJBQVcsV0FBVyxLQUFLLE9BQU8sT0FBTyxDQUFDO0FBQzFDLHlCQUFXLFdBQVcsUUFBUSxPQUFPLFVBQVUsVUFBVTtBQUFBLFlBQzFEO0FBQUEsVUFDRDtBQUVBLGNBQUksTUFBTTtBQUNULGdCQUFJLEtBQUssT0FBTztBQUNoQixnQkFBSSxTQUFTLElBQUksU0FBUyxJQUFJLE9BQU8sTUFBTSxJQUFJO0FBQy9DLGdCQUFJLFlBQVksSUFBSSxTQUFTLElBQUksT0FBTyxPQUFPLElBQUksT0FBTyxTQUFTLElBQUk7QUFFdkUsbUJBQU8sT0FBTyxRQUFRLFFBQVEsSUFBSSxZQUFZLENBQUM7QUFDL0MsbUJBQU8sVUFBVSxJQUFJLE9BQU8sT0FBTyxRQUFRLFdBQVcsSUFBSSxZQUFZLENBQUMsQ0FBQztBQUV4RSx1QkFBVyxXQUFXLEtBQUssT0FBTyxJQUFJO0FBQ3RDLHVCQUFXLFdBQVcsUUFBUSxPQUFPLE9BQU87QUFFNUMsZ0JBQUksQ0FBQyxNQUFNO0FBQ1YseUJBQVcsV0FBVyxNQUFNLE9BQU8sUUFBUSxDQUFDO0FBQzVDLHlCQUFXLFdBQVcsT0FBTyxPQUFPLFNBQVMsVUFBVTtBQUFBLFlBQ3hEO0FBQUEsVUFDRDtBQUFBLFFBQ0QsT0FDSztBQUNKLGtCQUFRLEtBQUssS0FBSyxNQUFNLEtBQUs7QUFDN0Isa0JBQVEsS0FBSyxLQUFLLE1BQU0sS0FBSztBQUU3QixjQUFJLE1BQU0sS0FBSztBQUVmLGNBQUksT0FBTyxNQUFNO0FBRWhCLGdCQUFJLFNBQVMsT0FBTztBQUNuQixzQkFBUSxNQUFNO0FBQ2Qsc0JBQVEsTUFBTTtBQUdkLGtCQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87QUFDckIsb0JBQUksS0FBSztBQUNSLDBCQUFRO0FBQUE7QUFFUiwwQkFBUTtBQUFBLGNBQ1Y7QUFBQSxZQUNEO0FBQUEsVUFDRCxXQUNTLEtBQUssS0FBSyxLQUFLLEtBQU0sVUFBUztBQUV0QyxvQkFBUSxRQUFRO0FBRWpCLGNBQUksT0FBTztBQUNWLGdCQUFJLE9BQU8sSUFBSSxZQUFZLFVBQVU7QUFFckMsdUJBQVcsV0FBVyxNQUFPLE9BQU8sUUFBUSxJQUFJO0FBQ2hELHVCQUFXLFdBQVcsT0FBTyxPQUFPLFNBQVMsRUFBRTtBQUUvQyxnQkFBSSxDQUFDLE9BQU87QUFDWCx5QkFBVyxXQUFXLEtBQUssT0FBTyxPQUFPLENBQUM7QUFDMUMseUJBQVcsV0FBVyxRQUFRLE9BQU8sVUFBVSxVQUFVO0FBQUEsWUFDMUQ7QUFBQSxVQUNEO0FBRUEsY0FBSSxPQUFPO0FBQ1YsZ0JBQUksT0FBTyxJQUFJLFdBQVcsU0FBUztBQUVuQyx1QkFBVyxXQUFXLEtBQVEsT0FBTyxPQUFPLElBQUk7QUFDaEQsdUJBQVcsV0FBVyxRQUFRLE9BQU8sVUFBVSxFQUFFO0FBRWpELGdCQUFJLENBQUMsT0FBTztBQUNYLHlCQUFXLFdBQVcsTUFBTSxPQUFPLFFBQVEsQ0FBQztBQUM1Qyx5QkFBVyxXQUFXLE9BQU8sT0FBTyxTQUFTLFVBQVU7QUFBQSxZQUN4RDtBQUFBLFVBQ0Q7QUFFQSxjQUFJLENBQUMsU0FBUyxDQUFDLE9BQU87QUFFckIsdUJBQVcsV0FBVyxRQUFRLE9BQU8sVUFBVSxDQUFDO0FBQ2hELHVCQUFXLFdBQVcsT0FBUSxPQUFPLFNBQVUsQ0FBQztBQUFBLFVBQ2pEO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFFQSxhQUFPLE1BQU07QUFDYixhQUFPLE9BQU87QUFDZCxhQUFPLE1BQU07QUFDYixXQUFLLEtBQUs7QUFDVixXQUFLLEtBQUs7QUFHVixVQUFJLE1BQU0sTUFBTTtBQUdmLGFBQUssSUFBSSxXQUFXLE9BQU0sWUFBWSxXQUFXLFlBQVksWUFBWSxHQUFHO0FBRTVFLFlBQUksYUFBYTtBQUNoQixjQUFJLFVBQVUsSUFBSSxNQUFNLE1BQU0sYUFBYTtBQUUzQyxjQUFJLEtBQUs7QUFFVCxjQUFJLFdBQVcsTUFBTSxNQUFNO0FBQzFCLDBCQUFjLEtBQUssQ0FBQyxNQUFNLE1BQU07QUFDL0Isa0JBQUksUUFBUTtBQUNYLHVCQUFPLEtBQUs7QUFBQSxZQUNkLENBQUM7QUFBQSxVQUNGO0FBRUEsb0JBQVUsSUFBSSxFQUFDLE9BQU8sS0FBSSxHQUFHLFNBQVMsU0FBUztBQUFBLFFBQ2hEO0FBQUEsTUFDRDtBQUVBLGVBQVMsS0FBSyxXQUFXO0FBQUEsSUFDMUI7QUFFQSxRQUFJLE9BQU87QUFFWCx3QkFBb0I7QUFDbkIsYUFBTyxLQUFLLHNCQUFzQjtBQUFBLElBQ25DO0FBRUEsdUJBQW1CLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFDOUMsVUFBSSxPQUFPO0FBQ1Y7QUFFRCxpQkFBVyxHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE9BQU8sS0FBSyxJQUFJO0FBRXZELFVBQUksS0FBSyxNQUFNO0FBQ2QsWUFBSSxhQUFhO0FBQ2hCLHNCQUFZLElBQUksWUFBWTtBQUFBLE1BQzlCO0FBRUMscUJBQWEsTUFBTSxHQUFHO0FBQUEsSUFDeEI7QUFFQSx3QkFBb0IsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxTQUFTLE1BQU07QUFDOUQsVUFBSSxLQUFLLE1BQU07QUFDZCxhQUFLLEVBQUUsVUFBVSxLQUFLO0FBQ3RCLGFBQUssRUFBRSxVQUFVLEtBQUs7QUFBQSxNQUN2QixPQUNLO0FBQ0osWUFBSSxLQUFLLEtBQUssS0FBSyxHQUFHO0FBQ3JCLHVCQUFhO0FBQ2Isc0JBQVk7QUFDWjtBQUFBLFFBQ0Q7QUFFQSxZQUFJLENBQUMsTUFBTSxRQUFRLFNBQVM7QUFFNUIsWUFBSSxRQUFRO0FBQ1gsZUFBSyxRQUFRLElBQUksU0FBUyxJQUFJLElBQUksR0FBRyxPQUFPLE9BQU8sWUFBWSxDQUFDO0FBQUE7QUFFaEUsZUFBSyxhQUFjLE1BQUc7QUFFdkIsWUFBSSxRQUFRO0FBQ1gsZUFBSyxRQUFRLElBQUksU0FBUyxJQUFJLElBQUksR0FBRyxPQUFPLE9BQU8sWUFBWSxDQUFDO0FBQUE7QUFFaEUsZUFBSyxhQUFjLE1BQUc7QUFBQSxNQUN4QjtBQUVBLFVBQUksTUFBTTtBQUNULFlBQUksTUFBTSxLQUFLLE1BQU0sYUFBYTtBQUNqQyxlQUFLLFVBQVUsSUFBSSxVQUFVO0FBRTlCLFlBQUksTUFBTSxLQUFLLE1BQU0sYUFBYTtBQUNqQyxlQUFLLFVBQVUsSUFBSSxVQUFVO0FBQUEsTUFDL0I7QUFFQSxVQUFJLFNBQVM7QUFDWixxQkFBYTtBQUNiLG9CQUFZO0FBQUEsTUFDYixPQUNLO0FBQ0oscUJBQWE7QUFDYixvQkFBWTtBQUFBLE1BQ2I7QUFBQSxJQUNEO0FBRUEsMEJBQXNCO0FBQ3JCLGdCQUFVO0FBQUEsUUFDVCxPQUFPO0FBQUEsUUFDUCxRQUFRO0FBQUEsTUFDVCxHQUFHLEtBQUs7QUFBQSxJQUNUO0FBRUEsdUJBQW1CLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFDOUMsVUFBSSxPQUFPLFFBQVEsVUFBVSxDQUFDLEdBQUc7QUFDaEMsbUJBQVc7QUFDWCxnQkFBUSxRQUFRLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFFcEMsbUJBQVcsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxNQUFNLEtBQUs7QUFFbEQsWUFBSSxLQUFLLE1BQU07QUFDZCxhQUFHLFNBQVMsTUFBSyxPQUFPO0FBQ3hCLGVBQUssSUFBSSxXQUFXLE9BQU0sWUFBWSxXQUFXLFlBQVksWUFBWSxJQUFJO0FBQUEsUUFDOUU7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUVBLHFCQUFpQixHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO0FBQzVDLFVBQUksT0FBTyxRQUFRLFVBQVUsQ0FBQyxHQUFHO0FBQ2hDLG1CQUFXLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFFL0IsbUJBQVcsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLElBQUk7QUFFbEQsWUFBSSxZQUFZLE9BQU8sU0FBUyxLQUFLLE9BQU8sVUFBVTtBQUV0RCxxQkFBYSxVQUFVLE1BQU07QUFFN0IsWUFBSSxLQUFLLFlBQVksV0FBVztBQU0vQixnQkFBTSxNQUFNO0FBQ1gsZ0JBQUksT0FBTztBQUNWLHdCQUFVLFdBQ1QsZ0JBQWdCLE9BQU8sT0FBTyxTQUFTLEdBQ3ZDLGdCQUFnQixPQUFPLFFBQVEsT0FBTyxRQUFRLFNBQVMsQ0FDeEQ7QUFBQSxZQUNEO0FBRUEsZ0JBQUksT0FBTztBQUNWLHVCQUFTLEtBQUssUUFBUTtBQUNyQixvQkFBSSxLQUFLLE9BQU87QUFFaEIsb0JBQUksS0FBSyxhQUFhLEdBQUcsUUFBUSxNQUFNO0FBQ3RDLDRCQUFVLEdBQ1QsZ0JBQWdCLE9BQU8sT0FBTyxPQUFPLFNBQVMsQ0FBQyxHQUMvQyxnQkFBZ0IsT0FBTyxNQUFNLENBQUMsQ0FDL0I7QUFBQSxnQkFDRDtBQUFBLGNBQ0Q7QUFBQSxZQUNEO0FBQUEsVUFDRCxDQUFDO0FBRUQscUJBQVc7QUFBQSxRQUNaLFdBQ1MsT0FBTyxNQUFNO0FBQ3JCLGlCQUFPLFNBQVMsQ0FBQyxPQUFPO0FBRXhCLGNBQUksQ0FBQyxPQUFPO0FBQ1gseUJBQWE7QUFBQSxRQUNmO0FBQUEsTUFDRDtBQUVBLFVBQUksS0FBSyxNQUFNO0FBQ2QsWUFBSSxTQUFTLE1BQUssT0FBTztBQUN6QixhQUFLLElBQUksU0FBUyxPQUFNLFlBQVksV0FBVyxZQUFZLFlBQVksSUFBSTtBQUFBLE1BQzVFO0FBQUEsSUFDRDtBQUVBLHdCQUFvQixHQUFHLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJO0FBQy9DLFVBQUksQ0FBQyxPQUFPLFFBQVE7QUFDbkIsWUFBSSxZQUFZO0FBRWhCLFlBQUksVUFBVTtBQUViLGNBQUksUUFBUTtBQUNaLGNBQUksUUFBUTtBQUNaLGNBQUksV0FBVztBQUVmLGNBQUksU0FBUyxPQUFPO0FBRW5CLG9CQUFRLGNBQWMsWUFBWSxjQUFjLGFBQWE7QUFDN0Qsb0JBQVEsYUFBYyxZQUFZLGFBQWMsYUFBYTtBQUFBLFVBQzlEO0FBRUEsY0FBSSxTQUFTLE9BQU87QUFDbkIsZ0JBQUksT0FBTztBQUNYLGdCQUFJLE9BQU8sYUFBYTtBQUV4QixnQkFBSSxPQUFPLElBQUksTUFBTSxJQUFJO0FBRXpCLGdCQUFJLFFBQVE7QUFDWCwyQkFBYTtBQUNkLGdCQUFJLFFBQVE7QUFDWCwyQkFBYTtBQUFBLFVBQ2Y7QUFFQSxjQUFJLFNBQVMsT0FBTztBQUNuQixnQkFBSSxPQUFPO0FBQ1gsZ0JBQUksT0FBTyxhQUFhO0FBRXhCLGdCQUFJLE9BQU8sSUFBSSxNQUFNLElBQUk7QUFFekIsZ0JBQUksUUFBUTtBQUNYLDBCQUFZO0FBQ2IsZ0JBQUksUUFBUTtBQUNYLDBCQUFZO0FBQUEsVUFDZDtBQUVBLHVCQUFhLENBQUM7QUFFZCxxQkFBVztBQUFBLFFBQ1o7QUFFQSxxQkFBYTtBQUNiLG9CQUFZO0FBR1oscUJBQWEsQ0FBQztBQUVkLFlBQUk7QUFDSCxxQkFBVztBQUFBLE1BQ2I7QUFBQSxJQUNEO0FBRUEsc0JBQWtCLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7QUFDN0MsaUJBQVc7QUFFWCxpQkFBVztBQUVYLFVBQUksS0FBSztBQUNSLGFBQUssSUFBSSxVQUFVLE9BQU0sWUFBWSxXQUFXLFlBQVksWUFBWSxJQUFJO0FBQUEsSUFDOUU7QUFHQSxVQUFNLFNBQVMsQ0FBQztBQUVoQixXQUFPLGFBQWE7QUFDcEIsV0FBTyxhQUFhO0FBQ3BCLFdBQU8sV0FBVztBQUNsQixXQUFPLFlBQVk7QUFDbkIsV0FBTyxlQUFlLENBQUMsR0FBRyxLQUFLLEtBQUssVUFBUztBQUM1QyxnQkFBVSxLQUFLLEtBQUk7QUFBQSxJQUNwQjtBQUVBLFFBQUk7QUFFSixRQUFLLE9BQU8sTUFBTTtBQUNqQixTQUFHLFdBQVcsTUFBTSxTQUFTO0FBQzdCLFNBQUcsV0FBVyxNQUFNLFNBQVM7QUFDN0IsU0FBRyxZQUFZLE1BQU0sUUFBUTtBQUU3QixTQUFHLFlBQVksTUFBTSxPQUFLO0FBQUUsWUFBSSxVQUFVO0FBQUEsTUFBRyxDQUFDO0FBRTlDLFNBQUcsVUFBVSxNQUFNLFFBQVE7QUFFM0IsWUFBTSxTQUFTLFVBQVUsR0FBRztBQUU1QixTQUFHLFFBQVEsS0FBSyxHQUFHO0FBQ25CLFNBQUcsUUFBUSxLQUFLLEdBQUc7QUFFbkIsWUFBSyxXQUFXO0FBQUEsSUFDakI7QUFHQSxVQUFNLFFBQVEsTUFBSyxRQUFRLEtBQUssU0FBUyxDQUFDO0FBRTFDLGtCQUFjLFFBQVEsSUFBSSxJQUFJO0FBQzdCLFVBQUksVUFBVSxPQUFPO0FBQ3BCLGNBQU0sUUFBUSxRQUFRLFFBQU07QUFDM0IsYUFBRyxLQUFLLE1BQU0sT0FBTSxJQUFJLEVBQUU7QUFBQSxRQUMzQixDQUFDO0FBQUEsTUFDRjtBQUFBLElBQ0Q7QUFFQSxJQUFDLE1BQUssV0FBVyxDQUFDLEdBQUcsUUFBUSxPQUFLO0FBQ2pDLGVBQVMsVUFBVSxFQUFFO0FBQ3BCLGNBQU0sVUFBVyxPQUFNLFdBQVcsQ0FBQyxHQUFHLE9BQU8sRUFBRSxNQUFNLE9BQU87QUFBQSxJQUM5RCxDQUFDO0FBRUQsVUFBTSxXQUFZLE9BQU87QUFBQSxNQUN4QixLQUFLO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxRQUFRLENBQUMsV0FBVyxJQUFJO0FBQUEsSUFDekIsR0FBRyxPQUFPLElBQUk7QUFFZCxVQUFNLFVBQVcsU0FBUztBQUUxQixVQUFNLE9BQVMsV0FBVyxPQUFRLE1BQU0sV0FBVyxNQUFNLFlBQVksTUFBTSxJQUFLLE1BQU07QUFFckYsU0FBSyxJQUFJLEtBQUk7QUFFZCxpQkFBYSxNQUFNLEtBQUssR0FBRyxJQUFHLEdBQUcsSUFBRyxHQUFHO0FBQ3RDLGFBQU8sTUFBTSxNQUFNLEtBQUssR0FBRyxJQUFHLEdBQUcsSUFBRyxDQUFDO0FBQUEsSUFDdEM7QUFFQyxJQUFDLE1BQUssTUFBTTtBQUViLHVCQUFtQjtBQUNqQixXQUFLLE1BQU0sS0FBSTtBQUNmLFVBQUksUUFBUSxLQUFLLEdBQUc7QUFDcEIsVUFBSSxRQUFRLEtBQUssR0FBRztBQUNyQixXQUFLLE9BQU87QUFDWixXQUFLLFNBQVM7QUFBQSxJQUNmO0FBRUEsVUFBSyxVQUFVO0FBRWYscUJBQWlCO0FBQ2hCLGVBQVMsS0FBSyxRQUFRLEtBQUssT0FBTztBQUVsQyxXQUFLLFFBQVEsTUFBTSxJQUFJO0FBRXZCLGNBQVEsUUFBUSxLQUFLLE1BQU0sS0FBSztBQUVoQyxVQUFJLFdBQVc7QUFDZCxpQkFBUyxXQUFXLFdBQVcsVUFBVTtBQUFBO0FBRXpDLG1CQUFXO0FBRVosZ0JBQVUsUUFBUSxLQUFLO0FBRXZCLGNBQVE7QUFFUixXQUFLLE9BQU87QUFBQSxJQUNiO0FBRUEsUUFBSSxNQUFNO0FBQ1QsVUFBSSxnQkFBZ0IsYUFBYTtBQUNoQyxhQUFLLFlBQVksSUFBSTtBQUNyQixjQUFNO0FBQUEsTUFDUDtBQUVDLGFBQUssT0FBTSxLQUFLO0FBQUEsSUFDbEI7QUFFQyxZQUFNO0FBRVAsV0FBTztBQUFBLEVBQ1I7QUFFQSxRQUFNLFNBQVM7QUFDZixRQUFNLFdBQVc7QUFFakI7QUFDQyxVQUFNLFVBQVU7QUFDaEIsVUFBTSxTQUFVO0FBQUEsRUFDakI7QUFFQSxNQUFPLG9CQUFROzs7QUMvd0ZmLE1BQU0sY0FBYyxDQUFDLFlBQVk7QUFDL0IsUUFBSSxDQUFDLFFBQVE7QUFBTSxhQUFPLENBQUM7QUFFM0IsV0FBTztBQUFBLE1BQ0wsT0FBTyxDQUFDLEdBQUcsTUFBTSxLQUFLLE9BQU8sT0FBTyxFQUFFLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUTtBQUFBLElBQ2pFO0FBQUEsRUFDRjtBQUVBLE1BQU0sZUFBZSxDQUFDLFlBQVk7QUFDaEMsV0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBRUEsTUFBTSxhQUFhLENBQUMsWUFBWTtBQUM5QixRQUFJLENBQUMsUUFBUTtBQUFNLGFBQU8sQ0FBQztBQUUzQixXQUFPO0FBQUEsTUFDTCxRQUFRLENBQUMsR0FBRyxNQUFNLFVBQVUsS0FBSyxJQUFJLE9BQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxNQUFNO0FBQUEsSUFDOUU7QUFBQSxFQUNGO0FBRUEsTUFBTSxRQUFRLENBQUMsYUFBYTtBQUMxQixXQUFPO0FBQUEsTUFDTCxPQUFPO0FBQUEsTUFDUCxRQUFRO0FBQUEsUUFDTixDQUFDLE9BQU8sS0FBSyxLQUFLLFVBQVUsR0FBRyxRQUFRO0FBQUEsUUFDdkMsQ0FBQyxPQUFPLEtBQUssSUFBSSxTQUFTLEdBQUcsZUFBZTtBQUFBLFFBQzVDLENBQUMsT0FBTyxJQUFJLGFBQWEsR0FBRyxtQkFBbUI7QUFBQSxRQUMvQyxDQUFDLE1BQU0sYUFBYSxHQUFHLDZCQUE2QjtBQUFBLFFBQ3BELENBQUMsSUFBSSxhQUFhLEdBQUcsNkJBQTZCO0FBQUEsUUFDbEQsQ0FBQyxHQUFHLFFBQVEsR0FBRyxrQ0FBa0M7QUFBQSxNQUNuRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsTUFBTSxRQUFRLENBQUMsWUFBWTtBQUN6QixXQUFPO0FBQUEsTUFDTCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsTUFDUCxHQUFHLFdBQVcsT0FBTztBQUFBLElBQ3ZCO0FBQUEsRUFDRjtBQUVBLE1BQU0sZUFBZTtBQUFBLElBQ25CLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxFQUNWO0FBR0Esb0JBQWtCLElBQUksT0FBTztBQUMzQixRQUFJLE9BQU87QUFFWCxXQUFPLE1BQU07QUFDWCxVQUFJLENBQUMsTUFBTTtBQUNULDhCQUFzQixFQUFFO0FBQ3hCLGVBQU87QUFDUCxtQkFBVyxNQUFNO0FBQ2YsaUJBQU87QUFBQSxRQUNULEdBQUcsS0FBSztBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVPLE1BQU0sa0JBQWtCLENBQUMsU0FBUyxRQUFRLE1BQU07QUFDckQsV0FBTztBQUFBLE1BQ0wsR0FBRyxVQUFVLEdBQUcsS0FBSztBQUFBLE1BQ3JCLEdBQUcsWUFBWSxPQUFPO0FBQUEsTUFDdEIsT0FBTyxRQUFRO0FBQUEsTUFDZixVQUFVO0FBQUEsTUFDVixRQUFRLEVBQUUsTUFBTSxNQUFNO0FBQUEsSUFDeEI7QUFBQSxFQUNGO0FBS0EsTUFBTSxrQkFBa0IsQ0FBQyxhQUFhLFNBQVMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsV0FBVyxJQUFJO0FBRzlFLGdDQUE4QixFQUFFLE9BQUcsS0FBSyxVQUFVO0FBQ2hELFNBQUssU0FBUyxHQUFHLEtBQUssS0FBSyxDQUFDO0FBQzVCLFFBQUksZUFBZSxLQUFLLFNBQVMsR0FBRyxLQUFLLEtBQUssU0FBUyxHQUFHLEtBQUssU0FBUyxNQUFNO0FBQzlFLFFBQUksWUFBWSxTQUFTLEtBQUssTUFBTSxJQUFHLFlBQVk7QUFDbkQsU0FBSyxTQUFTLEdBQUcsS0FBSyxLQUFLLFNBQVM7QUFBQSxFQUN0QztBQUVBLE1BQU0sdUJBQXVCLENBQUMsU0FBUyxLQUFLLFlBQVksQ0FBQyxHQUFHLE1BQU8sS0FBSyxRQUFRLEtBQUssT0FBTyxJQUFJLEdBQUksSUFBSTtBQUd4RyxzQ0FBb0MsRUFBRSxHQUFHLE9BQUcsS0FBSyxVQUFVO0FBRXpELFFBQUksY0FBYyxLQUFLLFNBQVMsVUFBVSxDQUFDLEVBQUUsVUFBVSxNQUFNLEdBQUc7QUFDaEUsUUFBSSxnQkFBZ0IsSUFBSTtBQUN0QixvQkFBYyxLQUFLLFNBQVMsS0FBSyxFQUFFLEtBQUssR0FBRyxNQUFNLE1BQU0sS0FBSyxTQUFTLEdBQUcsS0FBSyxNQUFNLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxJQUFJO0FBQ3JHLFdBQUssTUFBTSxVQUFVLGdCQUFnQixFQUFFLE9BQU8sR0FBRyxNQUFNLEtBQUssUUFBUSxLQUFLLEdBQUcsY0FBYyxDQUFDLEdBQUcsV0FBVztBQUFBLElBQzNHO0FBR0EsU0FBSyxXQUFXLEtBQUssU0FBUyxJQUFJLENBQUMsU0FBUyxVQUFVO0FBQ3BELFVBQUksVUFBVSxHQUFHO0FBQ2YsZ0JBQVEsS0FBSyxLQUFLLENBQUM7QUFBQSxNQUNyQixXQUFXLFVBQVUsYUFBYTtBQUNoQyxnQkFBUSxLQUFLLEtBQUssU0FBUyxLQUFLLE1BQU0sSUFBRyxxQkFBcUIsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDO0FBQUEsTUFDbkYsT0FBTztBQUNMLGdCQUFRLEtBQUssS0FBSyxJQUFJO0FBQUEsTUFDeEI7QUFDQSxhQUFPO0FBQUEsSUFDVCxDQUFDO0FBQUEsRUFDSDtBQUVBLE1BQU0sb0JBQW9CLENBQUMsRUFBRSxpQkFBaUIsVUFBVztBQUd6RCxNQUFNLGVBQU4sTUFBbUI7QUFBQSxJQUNqQixPQUFPLGdCQUFnQjtBQUNyQixhQUFPO0FBQUEsUUFDTCxTQUFTLENBQUMsSUFBRyxVQUFVLFFBQVE7QUFBQSxRQUMvQixZQUFZLENBQUMsT0FBTTtBQUFBLFFBQ25CLEtBQUssQ0FBQyxJQUFHLFVBQVUsUUFBUTtBQUFBLE1BQzdCO0FBQUEsSUFDRjtBQUFBLElBRUEsT0FBTyxVQUFVLFNBQVM7QUFDeEIsYUFBTztBQUFBLFFBQ0wsT0FBTyxRQUFRO0FBQUEsUUFDZixPQUFPLFFBQVE7QUFBQSxRQUNmLE9BQU8sUUFBUTtBQUFBLFFBQ2YsUUFBUSxRQUFRO0FBQUEsUUFDaEIsUUFBUTtBQUFBLFVBQ04sRUFBRSxHQUFHLGFBQWEsRUFBRTtBQUFBLFVBQ3BCLGdCQUFnQixTQUFTLENBQUM7QUFBQSxRQUM1QjtBQUFBLFFBQ0EsUUFBUTtBQUFBLFVBQ04sR0FBRztBQUFBLFlBQ0QsS0FBSyxRQUFRLE1BQU07QUFBQSxZQUNuQixLQUFLLFFBQVE7QUFBQSxVQUNmO0FBQUEsVUFDQSxHQUFHO0FBQUEsWUFDRCxLQUFLO0FBQUEsWUFDTCxLQUFLO0FBQUEsVUFDUDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLE1BQU07QUFBQSxVQUNKLE1BQU07QUFBQSxVQUNOLE1BQU0sT0FBTztBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsT0FBTyxjQUFjO0FBQ25CLGFBQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQUEsSUFDaEI7QUFBQSxJQUVBLFlBQVksT0FBTyxTQUFTO0FBQzFCLFdBQUssYUFBYSxLQUFLLFlBQVksY0FBYyxFQUFFLFFBQVE7QUFDM0QsV0FBSyxRQUFRO0FBQ2IsV0FBSyxXQUFXLENBQUMsRUFBRSxLQUFLLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUN6QyxXQUFLLFVBQVU7QUFDZixXQUFLLGlCQUFpQixrQkFBa0IsT0FBTztBQUUvQyxVQUFJLFFBQVEsUUFBUTtBQUNsQixhQUFLLE1BQU0sVUFBVSxDQUFDO0FBQ3RCLGFBQUssWUFBWTtBQUFBLE1BQ25CLE9BQU87QUFDTCxhQUFLLFNBQVMsS0FBSyxFQUFFLEtBQUssUUFBUSxPQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUM7QUFDbkQsYUFBSyxZQUFZO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQUEsSUFFQSxtQkFBbUIsY0FBYztBQUUvQixtQkFBYSxRQUFRLENBQUMsZ0JBQWdCLEtBQUssVUFBVSxLQUFLLE1BQU0sYUFBYSxLQUFLLFVBQVUsQ0FBQztBQUU3RixVQUFJLGNBQWMsS0FBSyxTQUFTLEdBQUcsS0FBSztBQUN4QyxVQUFJLGVBQWUsS0FBSyxnQkFBZ0I7QUFDdEMsYUFBSyxXQUFXLEtBQUssU0FBUyxJQUFJLENBQUMsRUFBRSxTQUFTLFdBQVc7QUFDdkQsaUJBQU8sRUFBRSxNQUFNLEtBQUssTUFBTSxDQUFDLEtBQUssY0FBYyxHQUFHLEdBQUcsS0FBSztBQUFBLFFBQzNELENBQUM7QUFBQSxNQUNIO0FBRUEsV0FBSyxNQUFNLFFBQVEsZ0JBQWdCLEtBQUssUUFBUSxDQUFDO0FBQUEsSUFDbkQ7QUFBQSxFQUNGO0FBR0EsTUFBTSxVQUFOLE1BQWM7QUFBQSxJQUNaLFlBQVksU0FBUyxTQUFTO0FBRTVCLFVBQUksU0FBUyxLQUFLLFlBQVksVUFBVSxPQUFPO0FBRS9DLGFBQU8sT0FBTyxHQUFHLFNBQVMsS0FBSyxlQUFlLEtBQUssSUFBSTtBQUV2RCxXQUFLLFdBQVcsQ0FBQyxFQUFFLEtBQUssT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFDO0FBQ3pDLFdBQUssUUFBUSxJQUFJLGtCQUFNLFFBQVEsS0FBSyxZQUFZLFlBQVksT0FBTyxHQUFHLE9BQU87QUFDN0UsV0FBSyxpQkFBaUIsa0JBQWtCLE9BQU87QUFDL0MsV0FBSyxVQUFVO0FBRWYsVUFBSSxRQUFRLFFBQVE7QUFDbEIsYUFBSyxNQUFNLFVBQVUsQ0FBQztBQUN0QixhQUFLLFlBQVksS0FBSyx3QkFBd0IsS0FBSyxJQUFJO0FBQUEsTUFDekQsT0FBTztBQUNMLGFBQUssU0FBUyxLQUFLLEtBQUssWUFBWSxXQUFXLFFBQVEsS0FBSyxDQUFDO0FBQzdELGFBQUssWUFBWSxLQUFLLGtCQUFrQixLQUFLLElBQUk7QUFBQSxNQUNuRDtBQUFBLElBQ0Y7QUFBQSxJQUVBLG1CQUFtQixjQUFjO0FBQy9CLG1CQUFhLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxVQUFVLFdBQVcsQ0FBQztBQUNqRSxXQUFLLHFCQUFxQjtBQUMxQixXQUFLLE1BQU0sUUFBUSxnQkFBZ0IsS0FBSyxRQUFRLENBQUM7QUFBQSxJQUNuRDtBQUFBLElBRUEsd0JBQXdCLGFBQWE7QUFDbkMsVUFBSSxjQUFjLEtBQUssbUJBQW1CLFlBQVksQ0FBQztBQUN2RCxXQUFLLGtCQUFrQixhQUFhLFdBQVc7QUFBQSxJQUNqRDtBQUFBLElBRUEsa0JBQWtCLGFBQWEsT0FBTyxHQUFHO0FBQ3ZDLFVBQUksRUFBRSxHQUFHLGNBQWM7QUFDdkIsV0FBSyxXQUFXLEtBQUssU0FBUyxJQUFJLENBQUMsU0FBUyxVQUFVO0FBQ3BELFlBQUksUUFBUSxRQUFRLE9BQU87QUFDekIsa0JBQVEsS0FBSyxLQUFLLFNBQVM7QUFBQSxRQUM3QixXQUFXLFVBQVUsTUFBTTtBQUN6QixlQUFLLGNBQWMsU0FBUyxXQUFXO0FBQUEsUUFDekMsT0FBTztBQUNMLGVBQUssY0FBYyxTQUFTLElBQUk7QUFBQSxRQUNsQztBQUNBLGVBQU87QUFBQSxNQUNULENBQUM7QUFBQSxJQUNIO0FBQUEsSUFFQSxtQkFBbUIsT0FBTztBQUN4QixVQUFJLGNBQWMsS0FBSyxTQUFTLFVBQVUsQ0FBQyxFQUFFLFVBQVUsVUFBVSxHQUFHO0FBQ3BFLFVBQUksZ0JBQWdCLElBQUk7QUFDdEIsc0JBQWMsS0FBSyxTQUFTLEtBQzFCLEtBQUssWUFBWSxXQUFXLE9BQU8sS0FBSyxTQUFTLEdBQUcsS0FBSyxNQUFNLENBQ2pFLElBQUk7QUFFSixZQUFJLFNBQVM7QUFBQSxVQUNYLFFBQVEsS0FBSyxlQUFlLEtBQUssSUFBSTtBQUFBLFVBQ3JDLEdBQUcsZ0JBQWdCLEVBQUUsTUFBTSxHQUFHLGNBQWMsQ0FBQztBQUFBLFFBQy9DO0FBRUEsYUFBSyxNQUFNLFVBQVUsUUFBUSxXQUFXO0FBQUEsTUFDMUM7QUFFQSxhQUFPO0FBQUEsSUFDVDtBQUFBLElBRUEsY0FBYyxTQUFTLGFBQWE7QUFDbEMsVUFBSSxnQkFBZ0IsTUFBTTtBQUN4QixnQkFBUSxLQUFLLEtBQUssSUFBSTtBQUN0QixnQkFBUSxJQUFJLElBQUksS0FBSyxJQUFJO0FBQ3pCLGdCQUFRLElBQUksSUFBSSxLQUFLLElBQUk7QUFDekIsZ0JBQVEsSUFBSSxJQUFJLEtBQUssSUFBSTtBQUN6QjtBQUFBLE1BQ0Y7QUFFQSxVQUFJLEVBQUUsVUFBTTtBQUdaLGNBQVEsSUFBSTtBQUNaLGNBQVEsSUFBSSxTQUFTO0FBR3JCLGNBQVEsS0FBSyxLQUFLLEVBQUM7QUFHbkIsVUFBSSxRQUFRLEtBQUssUUFBUSxRQUFRLEtBQUksUUFBUSxLQUFLLEtBQUs7QUFBRSxnQkFBUSxLQUFLLE1BQU07QUFBQSxNQUFFO0FBQzlFLGNBQVEsSUFBSSxJQUFJLEtBQUssUUFBUSxLQUFLLEdBQUc7QUFFckMsVUFBSSxRQUFRLEtBQUssUUFBUSxRQUFRLEtBQUksUUFBUSxLQUFLLEtBQUs7QUFBRSxnQkFBUSxLQUFLLE1BQU07QUFBQSxNQUFFO0FBQzlFLGNBQVEsSUFBSSxJQUFJLEtBQUssUUFBUSxLQUFLLEdBQUc7QUFFckMsY0FBUSxJQUFJLElBQUksS0FBTSxRQUFRLElBQUksUUFBUSxRQUFRLElBQUksS0FBTTtBQUU1RCxhQUFPO0FBQUEsSUFDVDtBQUFBLElBRUEsdUJBQXVCO0FBQ3JCLFVBQUksY0FBYyxLQUFLLFNBQVMsR0FBRyxLQUFLO0FBQ3hDLFVBQUksY0FBYyxLQUFLLGdCQUFnQjtBQUNyQyxZQUFJLFFBQVEsQ0FBQyxLQUFLO0FBQ2xCLGFBQUssV0FBVyxLQUFLLFNBQVMsSUFBSSxDQUFDLEVBQUUsS0FBSyxNQUFNLFVBQVU7QUFDeEQsY0FBSSxhQUFhLEtBQUssTUFBTSxLQUFLO0FBQ2pDLGNBQUksQ0FBQyxLQUFLO0FBQ1IsbUJBQU8sRUFBRSxLQUFLLE1BQU0sV0FBVztBQUFBLFVBQ2pDO0FBRUEsY0FBSSxFQUFFLEtBQUssT0FBTyxXQUFLLFdBQUssVUFBVTtBQUN0QyxjQUFJLFlBQVksS0FBSSxNQUFNLEtBQUs7QUFDL0IsY0FBSSxZQUFZLEtBQUksTUFBTSxLQUFLO0FBRS9CLGlCQUFPO0FBQUEsWUFDTDtBQUFBLFlBQ0EsTUFBTTtBQUFBLFlBQ04sS0FBSztBQUFBLGNBQ0gsS0FBSyxJQUFJLE1BQU0sS0FBSztBQUFBLGNBQ3BCO0FBQUEsY0FDQSxLQUFLO0FBQUEsY0FDTCxLQUFLO0FBQUEsY0FDTDtBQUFBLFlBQ0Y7QUFBQSxZQUNBLE1BQU07QUFBQSxjQUNKLEtBQUsscUJBQXFCLFNBQVM7QUFBQSxjQUNuQyxLQUFLLHFCQUFxQixTQUFTO0FBQUEsWUFDckM7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxJQUVBLGVBQWUsR0FBRyxNQUFNLEtBQUs7QUFDM0IsVUFBSSxVQUFVLEtBQUssU0FBUztBQUM1QixVQUFJLFdBQVcsUUFBUSxRQUFRLFFBQVEsS0FBSyxNQUFNO0FBQ2hELFlBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxXQUFLLGFBQU8sU0FBUztBQUN2QyxlQUFPO0FBQUEsVUFDTCxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7QUFBQSxVQUMxQixLQUFLLEtBQUksS0FBSyxRQUFRLENBQUM7QUFBQSxVQUN2QixLQUFLLEtBQUksS0FBSyxRQUFRLENBQUM7QUFBQSxVQUN2QixLQUFLLElBQUksS0FBSyxRQUFRLENBQUM7QUFBQSxRQUN6QjtBQUFBLE1BQ0YsT0FBTztBQUNMLGVBQU8sRUFBRSxPQUFPLE1BQU0sS0FBSyxNQUFNLEtBQUssTUFBTSxLQUFLLEtBQUs7QUFBQSxNQUN4RDtBQUFBLElBQ0Y7QUFBQSxJQUVBLE9BQU8sY0FBYztBQUFFLGFBQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQUEsSUFBRTtBQUFBLElBRXZDLE9BQU8sVUFBVSxTQUFTO0FBQ3hCLGFBQU87QUFBQSxRQUNMLE9BQU8sUUFBUTtBQUFBLFFBQ2YsT0FBTyxRQUFRO0FBQUEsUUFDZixPQUFPLFFBQVE7QUFBQSxRQUNmLFFBQVEsUUFBUTtBQUFBLFFBQ2hCLFFBQVE7QUFBQSxVQUNOLEVBQUUsR0FBRyxhQUFhLEVBQUU7QUFBQSxVQUNwQixnQkFBZ0IsU0FBUyxDQUFDO0FBQUEsUUFDNUI7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLEdBQUc7QUFBQSxZQUNELEtBQUssUUFBUSxNQUFNO0FBQUEsWUFDbkIsS0FBSyxRQUFRO0FBQUEsVUFDZjtBQUFBLFVBQ0EsR0FBRztBQUFBLFlBQ0QsS0FBSztBQUFBLFlBQ0wsS0FBSztBQUFBLFVBQ1A7QUFBQSxRQUNGO0FBQUEsUUFDQSxNQUFNO0FBQUEsVUFDSixNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFBQSxRQUNmO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUVBLE9BQU8sV0FBVyxLQUFLLFNBQVMsR0FBRztBQUNqQyxVQUFJLE9BQU8sU0FBUyxJQUFJLE1BQU0sTUFBTSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUM7QUFDcEQsYUFBTztBQUFBLFFBQ0w7QUFBQSxRQUNBLE1BQU0sQ0FBQyxHQUFHLElBQUk7QUFBQSxRQUNkLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsT0FBTyxFQUFFO0FBQUEsUUFDMUUsTUFBTSxFQUFFLEtBQUssTUFBTSxLQUFLLEtBQUs7QUFBQSxNQUMvQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsTUFBTSxjQUFjO0FBQUEsSUFDbEIsU0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLElBQ1osS0FBSztBQUFBLElBQ0wsU0FBUztBQUFBLEVBQ1g7QUFFTyxNQUFNLGlCQUFOLE1BQXFCO0FBQUEsSUFDMUIsWUFBWSxTQUFTLFNBQVM7QUFDNUIsVUFBSSxDQUFDLFFBQVEsUUFBUTtBQUNuQixjQUFNLElBQUksVUFBVSw2QkFBNkI7QUFBQSxNQUNuRCxXQUFXLFFBQVEsVUFBVSxDQUFDLFlBQVksUUFBUSxTQUFTO0FBQ3pELGNBQU0sSUFBSSxVQUFVLDhCQUE4QixRQUFRLFFBQVE7QUFBQSxNQUNwRTtBQUVBLFlBQU0sU0FBUyxZQUFZLFFBQVE7QUFDbkMsVUFBSSxXQUFXLFNBQVM7QUFDdEIsYUFBSyxTQUFTLElBQUksUUFBUSxTQUFTLE9BQU87QUFDMUMsYUFBSyxhQUFhLEtBQUssT0FBTztBQUFBLE1BQ2hDLE9BQU87QUFDTCxhQUFLLGFBQWEsSUFBSSxrQkFBTSxPQUFPLFVBQVUsT0FBTyxHQUFHLE9BQU8sWUFBWSxPQUFPLEdBQUcsT0FBTztBQUMzRixhQUFLLFNBQVMsSUFBSSxPQUFPLEtBQUssWUFBWSxPQUFPO0FBQUEsTUFDbkQ7QUFHQSxVQUFJLGtCQUFrQixPQUFPLFFBQVEsb0JBQW9CO0FBQ3pELFdBQUssbUJBQW1CO0FBQ3hCLFdBQUssVUFBVSxDQUFDO0FBQ2hCLFdBQUssU0FBUyxrQkFBa0IsWUFDOUIsS0FBSyxjQUFjLEtBQUssSUFBSSxHQUM1QixDQUFDLFFBQVEsZUFDWCxJQUFJO0FBQUEsSUFDTjtBQUFBLElBRUEsY0FBYztBQUFFLG9CQUFjLEtBQUssTUFBTTtBQUFBLElBQUU7QUFBQSxJQUUzQyxPQUFPLGFBQWE7QUFDbEIsV0FBSyxXQUFXLFFBQVE7QUFBQSxRQUN0QixPQUFPLEtBQUssSUFBSSxZQUFZLE9BQU8sYUFBYSxLQUFLO0FBQUEsUUFDckQsUUFBUSxhQUFhO0FBQUEsTUFDdkIsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLFNBQVMsY0FBYztBQUNyQixVQUFJLENBQUMsYUFBYTtBQUFRO0FBQzFCLFVBQUksV0FBVyxLQUFLLG1CQUFtQixLQUFLLGdCQUFnQixLQUFLO0FBQ2pFLGVBQVMsS0FBSyxNQUFNLFlBQVk7QUFBQSxJQUNsQztBQUFBLElBRUEsY0FBYyxjQUFjO0FBQzFCLFdBQUssVUFBVSxLQUFLLFFBQVEsT0FBTyxZQUFZO0FBQUEsSUFDakQ7QUFBQSxJQUVBLGFBQWEsY0FBYztBQUN6QixXQUFLLE9BQU8sbUJBQW1CLFlBQVk7QUFBQSxJQUM3QztBQUFBLElBR0EsZ0JBQWdCO0FBQ2QsVUFBSSxlQUFlLEtBQUssYUFBYTtBQUNyQyxVQUFJLENBQUMsYUFBYSxRQUFRO0FBQUU7QUFBQSxNQUFPO0FBQ25DLFdBQUssYUFBYSxZQUFZO0FBQUEsSUFDaEM7QUFBQSxJQUdBLGVBQWU7QUFDYixVQUFJLEtBQUssV0FBVyxDQUFDLEtBQUssUUFBUSxRQUFRO0FBQUUsZUFBTyxDQUFDO0FBQUEsTUFBRTtBQUN0RCxVQUFJLGVBQWUsS0FBSztBQUN4QixXQUFLLFVBQVUsQ0FBQztBQUNoQixhQUFPLGFBQWEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUFBLElBQzlEO0FBQUEsRUFDRjtBQUlBLE1BQU0sb0JBQW9CO0FBQUEsSUFDeEIsVUFBVTtBQUNSLFVBQUksVUFBVSxLQUFLLEdBQUcsY0FBYyxjQUFjLFFBQVE7QUFDMUQsVUFBSSxPQUFPLFFBQVEsc0JBQXNCO0FBQ3pDLFVBQUksVUFBVSxPQUFPLE9BQU8sQ0FBQyxHQUFHLFFBQVEsU0FBUztBQUFBLFFBQy9DLFFBQVMsUUFBUSxRQUFRLFFBQVEsUUFBUSxRQUFRLFNBQVMsTUFBTztBQUFBLFFBQ2pFLE9BQU8sS0FBSyxJQUFJLEtBQUssT0FBTyxhQUFhLEtBQUs7QUFBQSxRQUM5QyxRQUFRLGFBQWE7QUFBQSxRQUNyQixLQUFLLElBQUksS0FBSyxJQUFJO0FBQUEsUUFDbEIsaUJBQWlCO0FBQUEsTUFDbkIsQ0FBQztBQUVELFdBQUssUUFBUSxJQUFJLGVBQWUsU0FBUyxPQUFPO0FBRWhELGFBQU8saUJBQWlCLFVBQVUsU0FBUyxNQUFNO0FBQy9DLFlBQUksVUFBVSxRQUFRLHNCQUFzQjtBQUM1QyxhQUFLLE1BQU0sT0FBTyxPQUFPO0FBQUEsTUFDM0IsQ0FBQyxDQUFDO0FBQUEsSUFDSjtBQUFBLElBQ0EsVUFBVTtBQUNSLFlBQU0sT0FBTyxNQUNWLEtBQUssS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDLEVBQzNCLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLE9BQUcsVUFBVTtBQUdqQyxlQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBRyxHQUFHLENBQUMsSUFBSSxJQUFJO0FBQUEsTUFDakMsQ0FBQztBQUVILFVBQUksS0FBSyxTQUFTLEdBQUc7QUFDbkIsYUFBSyxNQUFNLFNBQVMsSUFBSTtBQUFBLE1BQzFCO0FBQUEsSUFDRjtBQUFBLElBQ0EsWUFBWTtBQUNWLFdBQUssTUFBTSxZQUFZO0FBQUEsSUFDekI7QUFBQSxFQUNGO0FBRUEsTUFBTyx1QkFBUTs7O0FDbGVmLE1BQU0sWUFBWSxDQUFDLFdBQVc7QUFDNUIsUUFBSSxTQUFTLEdBQUcsT0FBTyxPQUFPLE9BQU87QUFDckMsUUFBSSxPQUFPLFNBQVMsYUFBYSxVQUFVO0FBQ3pDLGdCQUFVO0FBQUEsSUFDWjtBQUNBLFFBQUksT0FBTyxRQUFRO0FBQ2pCLGdCQUFVLFdBQVcsT0FBTztBQUFBLElBQzlCO0FBQ0EsYUFBUyxTQUFTO0FBQUEsRUFDcEI7QUFFQSxNQUFNLGVBQWUsQ0FBQyxXQUFXO0FBQy9CLFVBQU0sV0FBVztBQUNqQixhQUFTLFNBQVMsR0FBRyxPQUFPLGlCQUFpQjtBQUFBLEVBQy9DO0FBRUEsTUFBTSxrQkFBa0IsQ0FBQyxTQUFTO0FBQ2hDLFdBQU8sS0FBSyxHQUFHLGFBQWEscUJBQXFCO0FBQUEsRUFDbkQ7QUFFQSxNQUFNLGVBQWUsQ0FBQyxTQUFTO0FBQzdCLFdBQU87QUFBQSxNQUNMLEtBQUssS0FBSyxHQUFHLGFBQWEsaUJBQWlCO0FBQUEsTUFDM0MsT0FBTyxLQUFLLEdBQUcsYUFBYSxtQkFBbUI7QUFBQSxNQUMvQyxRQUFRLEtBQUssR0FBRyxhQUFhLG9CQUFvQjtBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUVBLE1BQU0seUJBQXlCO0FBQUEsSUFDN0IsVUFBVTtBQUNSLFlBQU0scUJBQXFCLGFBQWEsSUFBSTtBQUM1QyxtQkFBYSxrQkFBa0I7QUFFL0IsVUFBSSxnQkFBZ0IsSUFBSSxHQUFHO0FBQ3pCLGtCQUFVLGtCQUFrQjtBQUFBLE1BQzlCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFFQSxNQUFPLGdDQUFROzs7QUN2Q2YsTUFBTSxrQkFBa0IsQ0FBQyxhQUFhO0FBQ2xDLFFBQUksQ0FBQyxVQUFVLFdBQVU7QUFFdkIsZUFBUyxPQUFPO0FBQ2hCLGVBQVMsa0JBQWtCLEdBQUcsS0FBSztBQUNuQyxlQUFTLFlBQVksTUFBTTtBQUFBLElBQzdCLE9BQU87QUFFTCxZQUFNLE9BQU8sU0FBUztBQUN0QixnQkFBVSxVQUFVLFVBQVUsSUFBSTtBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUVGLE1BQU0saUNBQWlDO0FBQUEsSUFDckMsVUFBVTtBQUNSLFdBQUssR0FBRyxjQUFjLGNBQWMsRUFBRSxpQkFBaUIsU0FBUyxPQUFLO0FBQ25FLGNBQU0sV0FBVyxLQUFLLEdBQUcsY0FBYyxVQUFVO0FBQ2pELHdCQUFnQixRQUFRO0FBQ3hCLGNBQU0sZ0JBQWdCLEtBQUssR0FBRyxjQUFjLGlCQUFpQjtBQUM3RCxzQkFBYyxhQUFhLGdCQUFnQixPQUFPO0FBQ2xELGFBQUssY0FBYztBQUNuQixzQkFBYyxhQUFhLGdCQUFnQixNQUFNO0FBQUEsTUFDbkQsQ0FBQztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBRUEsTUFBTyx5Q0FBUTs7O0FDMUJmLE1BQU0sMkJBQTJCO0FBQUEsSUFDL0IsVUFBVTtBQUNSLFVBQUksS0FBSyxHQUFHLGNBQWMsNkJBQTZCLEVBQUUsU0FBUztBQUNoRSxjQUFNLGtCQUFrQixLQUFLLEdBQUcsY0FBYyxrQkFBa0I7QUFDaEUsd0JBQWdCLFlBQVksZ0JBQWdCO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLE1BQU8sa0NBQVE7OztBQ1hmLE1BQU0sMEJBQTBCO0FBQ2hDLE1BQUk7QUFFSixNQUFNLG9CQUFvQixDQUFDLHFCQUFxQjtBQUM5QyxxQkFBaUIsaUJBQWlCLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyx1QkFBdUI7QUFDekYsVUFBRyx3QkFBd0I7QUFDekIsY0FBTSxVQUFVLG1CQUFtQixhQUFhLFdBQVcsTUFBTTtBQUVqRSwyQkFBbUIsYUFBYSxjQUFjLE9BQU87QUFBQSxNQUN2RCxPQUFPO0FBQ0wsMkJBQW1CLGdCQUFnQixZQUFZO0FBQUEsTUFDakQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBRUEsTUFBTSx1QkFBdUI7QUFBQSxJQUMzQixVQUFVO0FBQ1IsV0FBSyxHQUFHLGFBQWEsMEJBQTBCLE1BQU07QUFDckQsV0FBSyxHQUFHLGlCQUFpQix1QkFBdUIsRUFBRSxRQUFRLENBQUMsdUJBQ3pELG1CQUFtQixpQkFBaUIsU0FBUyxPQUFLO0FBQ2hELGNBQU0sT0FBTyxFQUFFLGNBQWMsYUFBYSxXQUFXO0FBQ3JELGlDQUF5QixTQUFTLHlCQUF5QixPQUFPO0FBQ2xFLDBCQUFrQixLQUFLLEVBQUU7QUFBQSxNQUMzQixDQUFDLENBQ0Y7QUFBQSxJQUNIO0FBQUEsSUFFQSxVQUFVO0FBQ1IsV0FBSyxHQUFHLGFBQWEsMEJBQTBCLE1BQU07QUFDckQsd0JBQWtCLEtBQUssRUFBRTtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUVBLE1BQU8sOEJBQVE7OztBQ2pDZixNQUFNLHNCQUFzQjtBQUtyQiw0QkFBMEIsYUFBYSxNQUFNO0FBQ2xELFVBQU0sT0FBTyxLQUFLLFVBQVUsV0FBVztBQUN2QyxVQUFNLFVBQVUsYUFBYSxJQUFJO0FBQ2pDLGVBQVUscUJBQXFCLFNBQVMsTUFBTSxPQUFTO0FBQUEsRUFDekQ7QUFLTyw2QkFBMkI7QUFDaEMsVUFBTSxVQUFVLGVBQWUsbUJBQW1CO0FBQ2xELFFBQUksU0FBUztBQUNYLFlBQU0sT0FBTyxhQUFhLE9BQU87QUFDakMsYUFBTyxLQUFLLE1BQU0sSUFBSTtBQUFBLElBQ3hCLE9BQU87QUFDTCxhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFFQSwwQkFBd0IsS0FBSztBQUMzQixVQUFNLFNBQVMsU0FBUyxPQUNyQixNQUFNLElBQUksRUFDVixLQUFLLENBQUMsWUFBVyxRQUFPLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFFaEQsUUFBSSxRQUFRO0FBQ1YsWUFBTSxRQUFRLE9BQU8sUUFBUSxHQUFHLFFBQVEsRUFBRTtBQUMxQyxhQUFPO0FBQUEsSUFDVCxPQUFPO0FBQ0wsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBRUEsc0JBQW1CLEtBQUssT0FBTyxNQUFNLFFBQVE7QUFDM0MsVUFBTSxTQUFTLEdBQUcsT0FBTyxpQkFBaUIsZUFBZTtBQUN6RCxhQUFTLFNBQVM7QUFBQSxFQUNwQjtBQUVBLHdCQUFzQixRQUFRO0FBQzVCLFdBQU8sS0FBSyxTQUFTLG1CQUFtQixNQUFNLENBQUMsQ0FBQztBQUFBLEVBQ2xEO0FBRUEsd0JBQXNCLFFBQVE7QUFDNUIsV0FBTyxtQkFBbUIsT0FBTyxLQUFLLE1BQU0sQ0FBQyxDQUFDO0FBQUEsRUFDaEQ7OztBQzVDQSxNQUFNLHFCQUFxQjtBQUFBLElBQ3pCLFVBQVU7QUFDUixVQUFJLFNBQVMsZ0JBQWdCLEtBQUssQ0FBQztBQUNuQyxhQUFPLEtBQUssR0FBRyxRQUFRLFFBQVEsS0FBSyxHQUFHO0FBQ3ZDLHVCQUFpQixRQUFRLEtBQUssR0FBRyxRQUFRLGtCQUFrQjtBQUFBLElBQzdEO0FBQUEsRUFDRjtBQUVBLE1BQU8sMkJBQVE7OztBMUJBZixNQUFJLFNBQVE7QUFBQSxJQUNWLG1CQUFtQjtBQUFBLElBQ25CLHdCQUF3QjtBQUFBLElBQ3hCLGdDQUFnQztBQUFBLElBQ2hDLDBCQUEwQjtBQUFBLElBQzFCLHNCQUFzQjtBQUFBLElBQ3RCLG9CQUFvQjtBQUFBLEVBQ3RCO0FBRUEsTUFBSSxhQUFhLFNBQVMsY0FBYyxNQUFNLEVBQUUsYUFBYSxZQUFZLEtBQUs7QUFDOUUsTUFBSSxZQUFZLFNBQVMsY0FBYyx5QkFBeUIsRUFBRSxhQUFhLFNBQVM7QUFDeEYsTUFBSSxhQUFhLElBQUksV0FBVyxZQUFZLFFBQVE7QUFBQSxJQUNsRCxPQUFPO0FBQUEsSUFDUCxRQUFRLENBQUMsaUJBQWlCO0FBQ3hCLGFBQU87QUFBQSxRQUNMLGFBQWE7QUFBQSxRQUViLGNBQWMsZ0JBQWdCO0FBQUEsTUFDaEM7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBR0QsTUFBTSxTQUFTLFdBQVc7QUFDMUIsTUFBTSxzQkFBc0IsT0FBTztBQUNuQyxNQUFJLHFCQUFxQjtBQUV6QixTQUFPLE9BQU8sTUFBTTtBQUNsQix5QkFBcUI7QUFBQSxFQUN2QixDQUFDO0FBRUQsU0FBTyxjQUFjLElBQUksU0FBUztBQUNoQyxRQUFJLG9CQUFvQjtBQUV0QiwyQkFBcUI7QUFFckIsYUFBTyxXQUFXLE1BQU0sR0FBSTtBQUU1QixhQUFPLFlBQVk7QUFFbkIsYUFBTyxRQUFRO0FBQUEsSUFDakIsT0FBTztBQUNMLDBCQUFvQixNQUFNLFFBQVEsSUFBSTtBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUdBLFNBQU8saUJBQWlCLDBCQUEwQixVQUFRLHlCQUFVLE1BQU0sQ0FBQztBQUMzRSxTQUFPLGlCQUFpQix5QkFBeUIsVUFBUSx5QkFBVSxLQUFLLENBQUM7QUFHekUsYUFBVyxRQUFRO0FBS25CLFNBQU8sYUFBYTsiLAogICJuYW1lcyI6IFtdCn0K
