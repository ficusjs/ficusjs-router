function toKebabCase(t2) {
  return t2.replace(/([A-Z])/g, "-$1").toLowerCase();
}
function elementRenderer(t2, e2) {
  for (; e2.firstChild; )
    e2.removeChild(e2.firstChild);
  let s2;
  if (typeof t2 == "string")
    s2 = document.createElement("div"), s2.innerHTML = t2;
  else {
    if (!t2.nodeName)
      throw new Error(`Unable to render ${t2}. Have you included a renderer function?`);
    s2 = t2;
  }
  s2 && e2.appendChild(s2);
}
function createCustomElement(t2, e2) {
  const s2 = function(t3) {
    if (!t3)
      return [];
    const e3 = [];
    return Object.keys(t3).forEach((s3) => {
      (t3[s3].observed == null || t3[s3].observed) && e3.push(toKebabCase(s3));
    }), e3;
  }(e2.props);
  globalThis.customElements.get(t2) || globalThis.customElements.define(t2, class extends globalThis.HTMLElement {
    static get observedAttributes() {
      return s2;
    }
    get componentTagName() {
      return t2;
    }
    connectedCallback() {
      this.connectedCallbackCount == null && (this.connectedCallbackCount = 0), this.connectedCallbackCount = this.connectedCallbackCount + 1, this._checkInit(), this._preprocess();
    }
    disconnectedCallback() {
      typeof this.removed == "function" && (this.removed(), this.isRemovedCalled = true);
    }
    attributeChangedCallback() {
      this.connectedCallbackCount != null && (this._checkInit(), this._preprocess());
    }
    get initialised() {
      return this._props && this._computed && this.templateRenderer;
    }
    _checkInit() {
      this.initialised || this._init(e2);
    }
    _init(e3) {
      this.ficusCustomElement = t2, this._props = e3.props || {}, this._computed = e3.computed || {}, this.computedCache = {}, this.status = "render", this.connectedCallbackCount = 0, this.props = this._processProps(), this.root = this._processRoot(e3.root), this.slots = this._processSlots(), this.render = e3.render || null, this.templateRenderer = e3.renderer || elementRenderer, this.template = null, this.created = e3.created || null, this.mounted = e3.mounted || null, this.updated = e3.updated || null, this.removed = e3.removed || null, this.isCreatedCalled = false, this.isMountedCalled = false, this.isRemovedCalled = false, this.emit = (t3, e4) => {
        !function(t4, e5, s3 = {}) {
          const i2 = Object.assign({}, {bubbles: true, cancelable: true, composed: false}, s3), r2 = globalThis.document.createEvent("CustomEvent");
          r2.initCustomEvent(e5, i2.bubbles, i2.cancelable, i2.detail), Object.defineProperty(r2, "composed", {value: i2.composed}), t4.dispatchEvent(r2);
        }(this, t3, {detail: e4});
      }, this._processMethodsAndComputedProps(e3), this._processInstanceProps(this._props), typeof this.created != "function" || this.isCreatedCalled || (this.created(), this.isCreatedCalled = true);
    }
    _processProps() {
      const t3 = {};
      return Object.keys(this._props).forEach((e3) => {
        const s3 = {}, i2 = this._props[e3], r2 = this._getAttribute(e3);
        let a = null;
        if (i2.default != null && (a = i2.default), i2.required && r2 == null)
          a != null ? (console.info(`No biggie, the required prop '${e3}' has no value set, so the default has been set`), s3[e3] = a) : (s3[e3] = null, console.error(`The required prop '${e3}' has no value set`));
        else
          switch (i2.type) {
            case String:
            default:
              s3[e3] = r2 || a;
              break;
            case Number:
              s3[e3] = r2 != null ? parseFloat(r2) : a != null ? a : 0;
              break;
            case Boolean:
              s3[e3] = r2 != null ? r2.toString() === "true" : a != null && a;
              break;
            case Object:
              try {
                s3[e3] = r2 != null ? JSON.parse(r2) : a != null ? a : void 0;
              } catch (t4) {
                s3[e3] = a != null ? a : void 0, console.error(`An object prop parse issue occurred with prop ${e3} and value ${r2}`);
              }
          }
        t3[e3] = s3[e3], this._instanceProps && this._instanceProps[e3] && (t3[e3] = this._instanceProps[e3]);
      }), t3;
    }
    _processMethodsAndComputedProps(t3) {
      const e3 = this, s3 = Object.keys(t3);
      s3.length && s3.forEach((s4) => {
        e3[s4] || typeof t3[s4] != "function" || (e3[s4] = t3[s4].bind(e3)), s4 === "computed" && this._processComputed(t3[s4]);
      });
    }
    _processRoot(t3) {
      switch (t3) {
        case "standard":
        default:
          return this;
        case "shadow":
          return this.attachShadow({mode: "open"});
        case "shadow:closed":
          return this.attachShadow({mode: "closed"});
      }
    }
    _processComputed(t3) {
      const e3 = this, s3 = Object.keys(t3);
      s3.length && s3.forEach((s4) => {
        e3[s4] ? console.warn(`Computed property '${s4}' already exists on the component instance`) : Object.defineProperty(e3, s4, {get: () => (e3.computedCache[s4] || (e3.computedCache[s4] = t3[s4].bind(e3)()), e3.computedCache[s4])});
      });
    }
    _processRender() {
      const t3 = this.render ? this.render() : void 0;
      t3 && (this.template = t3, this._updateRender());
    }
    _processSlots() {
      const t3 = this.childNodes, e3 = {default: []};
      return t3.length > 0 && [...t3].forEach((t4) => {
        const s3 = t4.getAttribute ? t4.getAttribute("slot") : null;
        s3 ? e3[s3] = t4 : e3.default.push(t4);
      }), e3;
    }
    _getAttribute(t3) {
      try {
        return this.getAttribute(toKebabCase(t3));
      } catch (t4) {
        return console.error("A get prop error occurred", t4), "";
      }
    }
    _processInstanceProps(t3) {
      const e3 = this, s3 = Object.keys(t3);
      t3 && s3.forEach((t4) => {
        let s4;
        e3[t4] && (s4 = e3[t4], delete e3[t4]), Object.defineProperty(e3, t4, {get() {
          return this._instanceProps && this._instanceProps[t4] ? this._instanceProps[t4] : this.getAttribute(toKebabCase(t4));
        }, set(e4) {
          return this._instanceProps || (this._instanceProps = {}), this._instanceProps[t4] = e4, this.setAttribute(toKebabCase(t4), typeof e4 == "object" ? JSON.stringify(e4) : e4.toString()), true;
        }, enumerable: true}), s4 && (e3[t4] = s4);
      });
    }
    _preprocess() {
      this.computedCache = {}, this.props = this._processProps(), this._processRender();
    }
    _updateRender() {
      var t3;
      this.template && (typeof (t3 = this.template) != "object" && typeof t3 != "function" || typeof t3.then != "function" ? (this.templateRenderer(this.template, this.root), this._callLifecycleMethods()) : this.template.then((t4) => {
        this.templateRenderer(t4, this.root), this._callLifecycleMethods();
      }).catch((t4) => console.error("A component render error occurred", t4)));
    }
    _callLifecycleMethods() {
      typeof this.mounted != "function" || this.isMountedCalled || this.mounted(), this.isMountedCalled = true, typeof this.updated == "function" && this.isMountedCalled && this.updated();
    }
  });
}
function isPromise$1(t2) {
  return (typeof t2 == "object" || typeof t2 == "function") && typeof t2.then == "function";
}
function withLocalState(t2) {
  return {...t2, created() {
    if (t2.state && typeof t2.state != "function")
      throw new Error("State must be a function!");
    this._state = t2.state || {}, typeof this._state == "function" && (this._state = this._state.bind(this)()), this.state = this._monitorState(this._state), this.setState = (t3, e2) => {
      const setter = (t4) => {
        if (!t4 || typeof t4 != "object")
          return;
        const s3 = this.updated;
        e2 && (this.updated = () => {
          e2(), this.updated = s3 || void 0;
        }), this.status = "transaction";
        for (const e3 in t4)
          this.state[e3] && this.state[e3] === t4[e3] || (this.state[e3] = t4[e3]);
        this.status = "render", this._processRender();
      }, s2 = t3(this.state);
      isPromise$1(s2) ? s2.then(setter) : setter(s2);
    }, t2.created && t2.created.call(this);
  }, _monitorState(t3) {
    const e2 = this;
    return new Proxy(t3, {set: (t4, s2, i2) => (t4[s2] === i2 || (t4[s2] = i2, e2.computedCache = {}, e2.status === "render" && e2._processRender()), true)});
  }};
}
function createComponent(t2, e2) {
  createCustomElement(t2, withLocalState(e2));
}
function withEventBus(t2, e2) {
  return {...e2, created() {
    this.setEventBus(t2), e2.created && e2.created.call(this);
  }, mounted() {
    this._subscribeToEventBus(), e2.mounted && e2.mounted.call(this);
  }, updated() {
    this._subscribeToEventBus(), e2.updated && e2.updated.call(this);
  }, removed() {
    this._unsubscribeFromEventBus(), e2.removed && e2.removed.call(this);
  }, setEventBus(t3) {
    const e3 = this;
    e3._eventBus = t3, e3._eventSubscriptions = {}, e3.eventBus = {subscribe: (t4, s2, i2) => (e3._eventSubscriptions[t4] = {unsubscribe: e3._eventBus.subscribe(t4, s2, i2), callback: s2, options: i2}, function() {
      const {unsubscribe: s3} = e3._eventSubscriptions[t4];
      s3 && s3(), e3._eventSubscriptions[t4].unsubscribe = null;
    }), publish(t4, s2 = {}) {
      e3._eventBus.publish(t4, s2);
    }, getSubscribers: (t4) => e3._eventBus.getSubscribers(t4)};
  }, _subscribeToEventBus() {
    for (const t3 in this._eventSubscriptions) {
      const {unsubscribe: e3, callback: s2, options: i2} = this._eventSubscriptions[t3];
      e3 || (this._eventSubscriptions[t3].unsubscribe = this._eventBus.subscribe(t3, s2, i2));
    }
  }, _unsubscribeFromEventBus() {
    for (const t3 in this._eventSubscriptions) {
      const {unsubscribe: e3} = this._eventSubscriptions[t3];
      e3 && e3(), this._eventSubscriptions[t3].unsubscribe = null;
    }
  }};
}
function withStateTransactions(t2) {
  return {...t2, created() {
    this.state = this._monitorTransactionState(this._state), this.setState = (t3, e2) => {
      const setter = (t4) => {
        if (!t4 || typeof t4 != "object")
          return;
        const s3 = this.transaction, i3 = this.updated;
        e2 && (this.updated = () => {
          setTimeout(e2), this.updated = i3 || void 0;
        }), s3 || this.beginTransaction();
        for (const e3 in t4)
          this.state[e3] && this.state[e3] === t4[e3] || (this.state[e3] = t4[e3]);
        s3 || this.endTransaction();
      }, s2 = t3(this.state);
      var i2;
      typeof (i2 = s2) != "object" && typeof i2 != "function" || typeof i2.then != "function" ? setter(s2) : s2.then(setter);
    }, t2.created && t2.created.call(this);
  }, beginTransaction() {
    this.transactionCache = {}, this.transaction = true, this.status = "transaction";
  }, endTransaction() {
    this.transaction = false, this.status = "render", this._processRender();
  }, rollbackTransaction() {
    Object.keys(this.transactionCache).forEach((t3) => this.state[t3] = this.transactionCache[t3]), this.endTransaction();
  }, _monitorTransactionState(t3) {
    const e2 = this;
    return new Proxy(t3, {set: (t4, s2, i2) => (t4[s2] === i2 || (e2.transaction && !e2.transactionCache[s2] && (e2.transactionCache[s2] = e2._copyValue(t4[s2])), t4[s2] = i2, e2.computedCache = {}, e2.status === "render" && e2._processRender()), true), get: (t4, e3) => t4[e3]});
  }, _copyValue: (t3) => JSON.parse(JSON.stringify(t3))};
}
function withLazyRender(t2) {
  return {...t2, created() {
    t2.created && t2.created.call(this), this.elementVisible = false, this.intersectionObserver = new IntersectionObserver((t3, e2) => {
      t3.forEach((t4) => {
        t4.isIntersecting && !this.elementVisible && (this.elementVisible = true, this.intersectionObserver.disconnect(), this._processRender());
      });
    }, {threshold: 0.1}), this.intersectionObserver.observe(this);
  }, removed() {
    t2.removed && t2.removed.call(this), this.intersectionObserver && this.intersectionObserver.disconnect();
  }};
}
function withStore(t2, e2) {
  return {...e2, created() {
    this.subscribeCallback = () => {
      this.computedCache = {}, this._processRender();
    }, this.setStore(t2), e2.created && e2.created.call(this);
  }, mounted() {
    this._subscribeToStores(false), e2.mounted && e2.mounted.call(this);
  }, updated() {
    this._subscribeToStores(false), e2.updated && e2.updated.call(this);
  }, removed() {
    this._unsubscribeFromStores(), e2.removed && e2.removed.call(this);
  }, setStore(t3) {
    this.store = t3, this._subscribeToStores();
  }, _subscribeToStores(t3 = true) {
    if (this.store && this.store.subscribe && typeof this.store.subscribe == "function" && !this.unsubscribe)
      this.unsubscribe = this.store.subscribe(this.subscribeCallback), t3 && this.subscribeCallback();
    else if (this.store && typeof this.store == "object" && !this.store.subscribe) {
      this.unsubscribe = {};
      Object.keys(this.store).forEach((t4) => {
        this.store[t4] && this.store[t4].subscribe && typeof this.store[t4].subscribe == "function" && !this.unsubscribe[t4] && (this.unsubscribe[t4] = this.store[t4].subscribe(this.subscribeCallback));
      }), t3 && this.subscribeCallback();
    }
  }, _unsubscribeFromStores() {
    if (this.store && this.unsubscribe && typeof this.unsubscribe == "object") {
      Object.keys(this.unsubscribe).forEach((t3) => {
        this.unsubscribe[t3]();
      }), this.unsubscribe = null;
    } else
      this.store && this.unsubscribe && typeof this.unsubscribe == "function" && (this.unsubscribe(), this.unsubscribe = null);
  }};
}
function withWorkerStore(t2, e2) {
  return {...e2, created() {
    if (this.worker = t2, globalThis.__ficusjs__ = globalThis.__ficusjs__ || {}, globalThis.__ficusjs__.workers = globalThis.__ficusjs__.workers || new Map(), globalThis.__ficusjs__.workers.has(t2)) {
      const e3 = globalThis.__ficusjs__.workers.get(t2);
      e3.has(this) || e3.add(this);
    } else {
      const e3 = new Set();
      e3.add(this), globalThis.__ficusjs__.workers.set(t2, e3);
    }
    t2.onmessage || (this.worker.onmessage = (e3) => {
      const s2 = globalThis.__ficusjs__.workers.get(t2);
      for (const t3 of s2)
        t3.state = e3.data, t3.computedCache = {}, t3._processRender.apply(t3);
    }), e2.created && e2.created.call(this);
  }, dispatch(t3, e3) {
    this.worker.postMessage({actionName: t3, payload: e3});
  }};
}
function withStyles(t2) {
  return {...t2, created() {
    t2.styles && typeof t2.styles == "function" && (globalThis.__ficusjs__ = globalThis.__ficusjs__ || {}, globalThis.__ficusjs__.styles = globalThis.__ficusjs__.styles || {}, this._injectStyles(t2.styles())), t2.created && t2.created.call(this);
  }, _injectStyles(t3) {
    if (globalThis.__ficusjs__ && globalThis.__ficusjs__.styles && globalThis.__ficusjs__.styles[this.componentTagName])
      return;
    if (Array.isArray(t3) && t3.filter((t4) => typeof t4 != "string").length || !Array.isArray(t3) && typeof t3 != "string")
      return void console.error("Dude, styles must return a string or an array of strings!");
    let e2 = "";
    Array.isArray(t3) ? Promise.all(t3.map((t4) => this._processStyle(t4))).then((t4) => {
      e2 = t4.filter((t5) => t5).join("\n"), this._createAndInjectStylesheet(e2, {"data-tag": this.componentTagName});
    }) : this._processStyle(t3).then((t4) => this._createAndInjectStylesheet(t4, {"data-tag": this.componentTagName}));
  }, _processStyle(t3) {
    if (/http[s]?:\/\/.+\.css$/.test(t3)) {
      const e2 = document.createElement("link");
      return e2.rel = "stylesheet", e2.type = "text/css", e2.href = t3, document.head.appendChild(e2), Promise.resolve();
    }
    return /.+\.css$/.test(t3) ? globalThis.fetch(t3).then((t4) => t4.text()) : Promise.resolve(t3);
  }, _createAndInjectStylesheet(t3, e2) {
    const s2 = this._createStyle(t3);
    this._setElementAttributes(s2, e2), document.head.appendChild(s2), globalThis.__ficusjs__.styles[this.componentTagName] = {loaded: true, style: s2};
  }, _createStyle(t3) {
    const e2 = document.createElement("style");
    return e2.appendChild(document.createTextNode(t3)), e2;
  }, _setElementAttributes(t3, e2) {
    e2 && Object.keys(e2).forEach((s2) => {
      t3.setAttribute(s2, e2[s2]);
    });
  }};
}
class t {
  constructor(t3) {
    this.machine = t3;
  }
  get initialState() {
    return this.machine.initial || Object.keys(this.machine.states)[0];
  }
  transition(t3, e2) {
    return this.machine.states[t3].on[e2];
  }
}
function withStateMachine(e2, s2) {
  return {...s2, created() {
    this._stateMachineDefinition = e2, this._stateMachine = new t(e2), this.initialState = this._stateMachine.initialState, this.state = {context: {}, matches(t2) {
      return t2 === this.value;
    }, value: this.initialState}, this.setState = (t2, e3) => {
      if (!t2 || typeof t2 != "object")
        return;
      const s3 = this.updated;
      e3 && (this.updated = () => {
        e3.call(this), this.updated = s3 || void 0;
      }), this.status = "transaction";
      for (const e4 in t2)
        e4 === "value" ? this.state[e4] = t2[e4] : this.state.context[e4] && this.state.context[e4] === t2[e4] || (this.state.context[e4] = t2[e4]);
      this.status = "render", this._processRender();
    }, s2.created && s2.created.call(this);
  }, send(t2) {
    let e3, s3;
    if (typeof t2 == "string")
      e3 = t2;
    else {
      const {type: i3, ...r3} = t2;
      e3 = i3, s3 = r3;
    }
    const {value: i2} = this.state, r2 = this._stateMachine.transition(i2, e3) || i2, a = typeof r2 == "object" && r2.target ? r2.target : r2, n = typeof r2 == "object" && r2.action ? r2.action : r2, o = this._stateMachineDefinition.actions && this._stateMachineDefinition.actions[n] ? () => this._stateMachineDefinition.actions[n].call(this, s3) : () => {
    };
    this.setState({value: a}, o);
  }};
}
function withXStateService(t2, e2) {
  return {...e2, created() {
    this._setupService(t2), e2.created && e2.created.call(this);
  }, send(t3) {
    this.service.send(t3);
  }, mounted() {
    this._startService(), e2.mounted && e2.mounted.call(this);
  }, updated() {
    this._startService(), e2.updated && e2.updated.call(this);
  }, removed() {
    this._stopService(), e2.removed && e2.removed.call(this);
  }, _setupService(t3) {
    this.service = t3, this.subscription = t3.subscribe((t4) => {
      this.state = t4, this.computedCache = {}, this._processRender();
    }), this._startService();
  }, _startService() {
    this.service && this.subscription && this.service.status !== "Running" && this.service.start();
  }, _stopService() {
    this.service && this.subscription && this.service.status === "Running" && this.service.stop();
  }};
}
class e {
  constructor() {
    if (globalThis.__ficusjs__ && globalThis.__ficusjs__.eventBus)
      return globalThis.__ficusjs__.eventBus;
    this.subscribers = {}, globalThis.__ficusjs__ = globalThis.__ficusjs__ || {}, globalThis.__ficusjs__.eventBus = globalThis.__ficusjs__.eventBus || this;
  }
  getSubscribers(t2) {
    return t2 ? this.subscribers[t2] : this.subscribers;
  }
  subscribe(t2, e3, s2 = {}) {
    const i2 = this, r2 = {callCount: 0, fireOnce: false, ...s2};
    i2.subscribers[t2] || (i2.subscribers[t2] = new Map());
    return i2.subscribers[t2].set(e3, r2), () => {
      const s3 = new Map();
      i2.subscribers[t2].forEach((t3, i3) => i3 !== e3 && s3.set(i3, t3)), i2.subscribers[t2] = s3;
    };
  }
  publish(t2, e3) {
    if (!this.subscribers[t2])
      return [];
    const s2 = new Map();
    return this.subscribers[t2].forEach((t3, i2) => {
      t3.fireOnce && t3.callCount === 1 || (i2(e3), ++t3.callCount, s2.set(i2, t3));
    }), s2;
  }
}
function createEventBus() {
  return new e();
}
function getEventBus() {
  return createEventBus();
}
class s {
  constructor(t2, e2) {
    this.namespace = t2, this.storage = e2;
  }
  setState(t2) {
    t2 ? (this.storage.setItem(`${this.namespace}:state`, typeof t2 == "string" ? t2 : JSON.stringify(t2)), this.storage.setItem(`${this.namespace}:lastUpdated`, new Date().getTime().toString())) : this.removeState();
  }
  getState() {
    const t2 = this.storage.getItem(`${this.namespace}:state`);
    return t2 ? JSON.parse(t2) : void 0;
  }
  lastUpdated() {
    const t2 = this.storage.getItem(`${this.namespace}:lastUpdated`);
    return t2 ? parseInt(t2, 10) : void 0;
  }
  removeState() {
    this.storage.removeItem(`${this.namespace}:state`), this.storage.removeItem(`${this.namespace}:lastUpdated`);
  }
}
function createPersist(t2, e2 = "session") {
  return new s(t2, e2 === "local" ? globalThis.localStorage : globalThis.sessionStorage);
}
class i {
  constructor(t2) {
    const e2 = this;
    e2.getters = {}, e2.actions = {}, e2.mutations = {}, e2.state = {}, e2.getterCache = {}, e2.status = "resting", e2.transaction = false, e2.transactionCache = {}, e2.callbacks = [], t2.getters && (e2.getters = new Proxy(t2.getters || {}, {get: (t3, s3) => (e2.getterCache[s3] || (e2.getterCache[s3] = t3[s3](e2.state)), e2.getterCache[s3])})), t2.actions && (e2.actions = t2.actions), t2.mutations && (e2.mutations = t2.mutations);
    let s2 = t2.initialState || {};
    if (e2.copyOfInitialState = e2._copyValue(s2), e2.ttl = -1, e2.lastUpdatedState = {}, t2.ttl && (e2.ttl = t2.ttl, Object.keys(e2.copyOfInitialState).forEach((t3) => e2.lastUpdatedState[t3] = new Date().getTime())), t2.persist) {
      e2.persist = typeof t2.persist == "string" ? createPersist(t2.persist) : t2.persist;
      const i3 = e2.persist.getState(), r2 = e2.persist.lastUpdated();
      i3 && r2 && (e2.ttl === -1 || e2._lastUpdatedTimeDiff(r2) < e2.ttl) && (s2 = i3);
    }
    this._processState(s2);
  }
  _processState(t2) {
    const e2 = this;
    e2.state = new Proxy(t2, {set: (t3, s2, i3) => (e2.transaction && !e2.transactionCache[s2] && (e2.transactionCache[s2] = e2._copyValue(t3[s2])), t3[s2] = i3, e2.lastUpdatedState[s2] = new Date().getTime(), e2.getterCache = {}, e2.transaction || (e2.persist && e2.persist.setState(e2.state), e2.status = "resting", e2._processCallbacks(e2.state)), true), get: (t3, s2) => e2.ttl > -1 && e2._lastUpdatedTimeDiff(e2.lastUpdatedState[s2]) > e2.ttl ? (e2.persist && e2.persist.removeState(), e2.copyOfInitialState[s2]) : t3[s2]});
  }
  _lastUpdatedTimeDiff(t2) {
    return Math.round((new Date().getTime() - t2) / 1e3);
  }
  dispatch(t2, e2) {
    return typeof this.actions[t2] != "function" ? (console.error(`Dude, the store action "${t2}" doesn't exist.`), false) : (this.status = "action", this.actions[t2](this, e2));
  }
  commit(t2, e2) {
    if (typeof this.mutations[t2] != "function")
      return console.error(`Dude, the store mutation "${t2}" doesn't exist`), false;
    this.status = "mutation";
    const s2 = this.mutations[t2](this.state, e2);
    return this.state = s2, this.persist && this.persist.setState(s2), true;
  }
  _processCallbacks(t2) {
    return !(!this.callbacks.length || this.transaction) && (this.callbacks.forEach((e2) => e2(t2)), true);
  }
  subscribe(t2) {
    if (typeof t2 != "function")
      return console.error("Dude, you can only subscribe to store changes with a valid function"), false;
    return this.callbacks.push(t2), () => {
      this.callbacks = this.callbacks.filter((e2) => e2 !== t2);
    };
  }
  _copyValue(t2) {
    return JSON.parse(JSON.stringify(t2));
  }
  begin() {
    this.transactionCache = {}, this.transaction = true;
  }
  end() {
    this.transaction = false, this._processCallbacks(this.state);
  }
  rollback() {
    Object.keys(this.transactionCache).forEach((t2) => this.state[t2] = this.transactionCache[t2]), this.end();
  }
  clear(t2 = true) {
    this.getterCache = {}, this.transactionCache = {}, this.lastUpdatedState = {}, this.persist && this.persist.removeState(), this.transaction = true, this.status = "clear";
    const e2 = this._copyValue(this.copyOfInitialState);
    for (const t3 in e2)
      this.state[t3] = e2[t3];
    this.transaction = false, this.status = "resting", t2 && this._processCallbacks(this.state);
  }
}
function createStore(t2, e2) {
  let s2 = getStore(t2);
  return s2 || (s2 = new i(e2), console.warn("createStore function is deprecated. Use createAppState and getAppState in v3.3.0 to create stores"), globalThis.__ficusjs__ = globalThis.__ficusjs__ || {}, globalThis.__ficusjs__.store = globalThis.__ficusjs__.store || {}, globalThis.__ficusjs__.store[t2] = s2, s2);
}
function getStore(t2) {
  if (console.warn("getStore function is deprecated. Use createAppState and getAppState in v3.3.0 to create stores"), globalThis.__ficusjs__ && globalThis.__ficusjs__.store && globalThis.__ficusjs__.store[t2])
    return globalThis.__ficusjs__.store[t2];
}
class r {
  constructor(t2) {
    const e2 = this;
    e2.state = {}, e2.getterCache = {}, e2.status = "resting", e2.transaction = false, e2.transactionCache = {}, e2.callbacks = [], this._processActions(t2);
    let s2 = t2.initialState || {};
    if (e2.copyOfInitialState = e2._copyValue(s2), e2.ttl = -1, e2.lastUpdatedState = {}, t2.ttl && (e2.ttl = t2.ttl, Object.keys(e2.copyOfInitialState).forEach((t3) => e2.lastUpdatedState[t3] = new Date().getTime())), t2.persist) {
      e2.persist = typeof t2.persist == "string" ? createPersist(t2.persist) : t2.persist;
      const i2 = e2.persist.getState(), r3 = e2.persist.lastUpdated();
      i2 && r3 && (e2.ttl === -1 || e2._lastUpdatedTimeDiff(r3) < e2.ttl) && (s2 = i2);
    }
    this._processState(s2);
  }
  _processActions(t2) {
    const e2 = this, s2 = Object.keys(t2);
    s2.length && s2.forEach((s3) => {
      e2[s3] || typeof t2[s3] != "function" || (e2[s3] = t2[s3].bind(e2));
    });
  }
  _processState(t2) {
    const e2 = this;
    e2.state = new Proxy(t2, {set: (t3, s2, i2) => (e2.transaction && !e2.transactionCache[s2] && (e2.transactionCache[s2] = e2._copyValue(t3[s2])), t3[s2] = i2, e2.lastUpdatedState[s2] = new Date().getTime(), e2.getterCache = {}, e2.transaction || (e2.persist && e2.persist.setState(e2.state), e2.status = "resting", e2._processCallbacks(e2.state)), true), get: (t3, s2) => e2.ttl > -1 && e2._lastUpdatedTimeDiff(e2.lastUpdatedState[s2]) > e2.ttl ? (e2.persist && e2.persist.removeState(), e2.copyOfInitialState[s2]) : t3[s2]});
  }
  _lastUpdatedTimeDiff(t2) {
    return Math.round(new Date().getTime() - t2);
  }
  setState(t2) {
    const setter = (t3) => {
      if (!t3 || typeof t3 != "object")
        return;
      const e3 = this.transaction;
      e3 || (this.transactionCache = {}, this.transaction = true);
      for (const e4 in t3)
        this.state[e4] && this.state[e4] === t3[e4] || (this.state[e4] = t3[e4]);
      e3 || (this.transaction = false, this.persist && this.persist.setState(this.state), this._processCallbacks(this.state));
    }, e2 = t2(this.state);
    isPromise$1(e2) ? e2.then(setter) : setter(e2);
  }
  getState(t2) {
    if (t2) {
      if (!this.getterCache[t2]) {
        const e2 = (Array.isArray(t2) ? t2 : t2.match(/([^[.\]])+/g)).reduce((t3, e3) => t3 && t3[e3], this.state);
        if (e2 == null)
          return;
        this.getterCache[t2] = e2;
      }
      return this.getterCache[t2];
    }
  }
  _processCallbacks(t2) {
    return !!this.callbacks.length && (this.callbacks.forEach((e2) => e2(t2)), true);
  }
  subscribe(t2) {
    if (typeof t2 != "function")
      throw new Error("Dude, you can only subscribe to store changes with a valid function");
    return this.callbacks.push(t2), () => {
      this.callbacks = this.callbacks.filter((e2) => e2 !== t2);
    };
  }
  _copyValue(t2) {
    return t2 ? JSON.parse(JSON.stringify(t2)) : t2;
  }
  clear(t2 = true) {
    this.getterCache = {}, this.transactionCache = {}, this.lastUpdatedState = {}, this.persist && this.persist.removeState(), this.transaction = true, this.status = "clear";
    const e2 = this._copyValue(this.copyOfInitialState);
    for (const t3 in e2)
      this.state[t3] = e2[t3];
    this.transaction = false, this.status = "resting", t2 && this._processCallbacks(this.state);
  }
}
function createAppState(t2, e2) {
  let s2 = getAppState(t2);
  return s2 || (s2 = new r(e2), globalThis.__ficusjs__ = globalThis.__ficusjs__ || {}, globalThis.__ficusjs__.store = globalThis.__ficusjs__.store || {}, globalThis.__ficusjs__.store[t2] = s2, s2);
}
function getAppState(t2) {
  if (globalThis.__ficusjs__ && globalThis.__ficusjs__.store && globalThis.__ficusjs__.store[t2])
    return globalThis.__ficusjs__.store[t2];
}
function use(t2, {renderer: e2, ...s2}) {
  if (t2.create && typeof t2.create == "function")
    return t2.create({createCustomElement, renderer: e2, ...s2, createComponent, createEventBus, getEventBus, createAppState, getAppState, createPersist, createStore, getStore, use});
}
export {createAppState, createComponent, createCustomElement, createEventBus, createPersist, createStore, getAppState, getEventBus, getStore, use, withEventBus, withLazyRender, withLocalState, withStateMachine, withStateTransactions, withStore, withStyles, withWorkerStore, withXStateService};
export default null;
