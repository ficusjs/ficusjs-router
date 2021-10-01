/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t, e;
const i = globalThis.trustedTypes, s = i ? i.createPolicy("lit-html", {createHTML: (t2) => t2}) : void 0, n = `lit$${(Math.random() + "").slice(9)}$`, o = "?" + n, l = `<${o}>`, h = document, r = (t2 = "") => h.createComment(t2), d = (t2) => t2 === null || typeof t2 != "object" && typeof t2 != "function", $ = Array.isArray, a = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, u = /-->/g, c = />/g, _ = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g, v = /'/g, p = /"/g, g = /^(?:script|style|textarea)$/i, m = ((t2) => (e2, ...i2) => ({_$litType$: t2, strings: e2, values: i2}))(1), f = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), H = new WeakMap(), A = (t2, e2, i2) => {
  var s2, n2;
  const o2 = (s2 = i2 == null ? void 0 : i2.renderBefore) !== null && s2 !== void 0 ? s2 : e2;
  let l2 = o2._$litPart$;
  if (l2 === void 0) {
    const t3 = (n2 = i2 == null ? void 0 : i2.renderBefore) !== null && n2 !== void 0 ? n2 : null;
    o2._$litPart$ = l2 = new T(e2.insertBefore(r(), t3), t3, void 0, i2 != null ? i2 : {});
  }
  return l2._$AI(t2), l2;
}, x = h.createTreeWalker(h, 129, null, false), P = (t2, e2) => {
  const i2 = t2.length - 1, o2 = [];
  let h2, $2 = e2 === 2 ? "<svg>" : "", m2 = a;
  for (let e3 = 0; e3 < i2; e3++) {
    const i3 = t2[e3];
    let s2, f3, y2 = -1, H2 = 0;
    for (; H2 < i3.length && (m2.lastIndex = H2, f3 = m2.exec(i3), f3 !== null); )
      H2 = m2.lastIndex, m2 === a ? f3[1] === "!--" ? m2 = u : f3[1] !== void 0 ? m2 = c : f3[2] !== void 0 ? (g.test(f3[2]) && (h2 = RegExp("</" + f3[2], "g")), m2 = _) : f3[3] !== void 0 && (m2 = _) : m2 === _ ? f3[0] === ">" ? (m2 = h2 != null ? h2 : a, y2 = -1) : f3[1] === void 0 ? y2 = -2 : (y2 = m2.lastIndex - f3[2].length, s2 = f3[1], m2 = f3[3] === void 0 ? _ : f3[3] === '"' ? p : v) : m2 === p || m2 === v ? m2 = _ : m2 === u || m2 === c ? m2 = a : (m2 = _, h2 = void 0);
    const x2 = m2 === _ && t2[e3 + 1].startsWith("/>") ? " " : "";
    $2 += m2 === a ? i3 + l : y2 >= 0 ? (o2.push(s2), i3.slice(0, y2) + "$lit$" + i3.slice(y2) + n + x2) : i3 + n + (y2 === -2 ? (o2.push(void 0), e3) : x2);
  }
  const f2 = $2 + (t2[i2] || "<?>") + (e2 === 2 ? "</svg>" : "");
  return [s !== void 0 ? s.createHTML(f2) : f2, o2];
};
class N {
  constructor({strings: t2, _$litType$: e2}, s2) {
    let l2;
    this.parts = [];
    let h2 = 0, $2 = 0;
    const a2 = t2.length - 1, u2 = this.parts, [c2, _2] = P(t2, e2);
    if (this.el = N.createElement(c2, s2), x.currentNode = this.el.content, e2 === 2) {
      const t3 = this.el.content, e3 = t3.firstChild;
      e3.remove(), t3.append(...e3.childNodes);
    }
    for (; (l2 = x.nextNode()) !== null && u2.length < a2; ) {
      if (l2.nodeType === 1) {
        if (l2.hasAttributes()) {
          const t3 = [];
          for (const e3 of l2.getAttributeNames())
            if (e3.endsWith("$lit$") || e3.startsWith(n)) {
              const i2 = _2[$2++];
              if (t3.push(e3), i2 !== void 0) {
                const t4 = l2.getAttribute(i2.toLowerCase() + "$lit$").split(n), e4 = /([.?@])?(.*)/.exec(i2);
                u2.push({type: 1, index: h2, name: e4[2], strings: t4, ctor: e4[1] === "." ? M : e4[1] === "?" ? S : e4[1] === "@" ? w : C});
              } else
                u2.push({type: 6, index: h2});
            }
          for (const e3 of t3)
            l2.removeAttribute(e3);
        }
        if (g.test(l2.tagName)) {
          const t3 = l2.textContent.split(n), e3 = t3.length - 1;
          if (e3 > 0) {
            l2.textContent = i ? i.emptyScript : "";
            for (let i2 = 0; i2 < e3; i2++)
              l2.append(t3[i2], r()), x.nextNode(), u2.push({type: 2, index: ++h2});
            l2.append(t3[e3], r());
          }
        }
      } else if (l2.nodeType === 8)
        if (l2.data === o)
          u2.push({type: 2, index: h2});
        else {
          let t3 = -1;
          for (; (t3 = l2.data.indexOf(n, t3 + 1)) !== -1; )
            u2.push({type: 7, index: h2}), t3 += n.length - 1;
        }
      h2++;
    }
  }
  static createElement(t2, e2) {
    const i2 = h.createElement("template");
    return i2.innerHTML = t2, i2;
  }
}
function E(t2, e2, i2 = t2, s2) {
  var n2, o2, l2, h2;
  if (e2 === f)
    return e2;
  let $2 = s2 !== void 0 ? (n2 = i2._$Cl) === null || n2 === void 0 ? void 0 : n2[s2] : i2._$Cu;
  const a2 = d(e2) ? void 0 : e2._$litDirective$;
  return ($2 == null ? void 0 : $2.constructor) !== a2 && ((o2 = $2 == null ? void 0 : $2._$AO) === null || o2 === void 0 || o2.call($2, false), a2 === void 0 ? $2 = void 0 : ($2 = new a2(t2), $2._$AT(t2, i2, s2)), s2 !== void 0 ? ((l2 = (h2 = i2)._$Cl) !== null && l2 !== void 0 ? l2 : h2._$Cl = [])[s2] = $2 : i2._$Cu = $2), $2 !== void 0 && (e2 = E(t2, $2._$AS(t2, e2.values), $2, s2)), e2;
}
class b {
  constructor(t2, e2) {
    this.v = [], this._$AN = void 0, this._$AD = t2, this._$AM = e2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  p(t2) {
    var e2;
    const {el: {content: i2}, parts: s2} = this._$AD, n2 = ((e2 = t2 == null ? void 0 : t2.creationScope) !== null && e2 !== void 0 ? e2 : h).importNode(i2, true);
    x.currentNode = n2;
    let o2 = x.nextNode(), l2 = 0, $2 = 0, a2 = s2[0];
    for (; a2 !== void 0; ) {
      if (l2 === a2.index) {
        let e3;
        a2.type === 2 ? e3 = new T(o2, o2.nextSibling, this, t2) : a2.type === 1 ? e3 = new a2.ctor(o2, a2.name, a2.strings, this, t2) : a2.type === 6 && (e3 = new I(o2, this, t2)), this.v.push(e3), a2 = s2[++$2];
      }
      l2 !== (a2 == null ? void 0 : a2.index) && (o2 = x.nextNode(), l2++);
    }
    return n2;
  }
  m(t2) {
    let e2 = 0;
    for (const i2 of this.v)
      i2 !== void 0 && (i2.strings !== void 0 ? (i2._$AI(t2, i2, e2), e2 += i2.strings.length - 2) : i2._$AI(t2[e2])), e2++;
  }
}
class T {
  constructor(t2, e2, i2, s2) {
    var n2;
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = t2, this._$AB = e2, this._$AM = i2, this.options = s2, this._$Cg = (n2 = s2 == null ? void 0 : s2.isConnected) === null || n2 === void 0 || n2;
  }
  get _$AU() {
    var t2, e2;
    return (e2 = (t2 = this._$AM) === null || t2 === void 0 ? void 0 : t2._$AU) !== null && e2 !== void 0 ? e2 : this._$Cg;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const e2 = this._$AM;
    return e2 !== void 0 && t2.nodeType === 11 && (t2 = e2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, e2 = this) {
    t2 = E(this, t2, e2), d(t2) ? t2 === y || t2 == null || t2 === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t2 !== this._$AH && t2 !== f && this.$(t2) : t2._$litType$ !== void 0 ? this.T(t2) : t2.nodeType !== void 0 ? this.S(t2) : ((t3) => {
      var e3;
      return $(t3) || typeof ((e3 = t3) === null || e3 === void 0 ? void 0 : e3[Symbol.iterator]) == "function";
    })(t2) ? this.M(t2) : this.$(t2);
  }
  A(t2, e2 = this._$AB) {
    return this._$AA.parentNode.insertBefore(t2, e2);
  }
  S(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.A(t2));
  }
  $(t2) {
    this._$AH !== y && d(this._$AH) ? this._$AA.nextSibling.data = t2 : this.S(h.createTextNode(t2)), this._$AH = t2;
  }
  T(t2) {
    var e2;
    const {values: i2, _$litType$: s2} = t2, n2 = typeof s2 == "number" ? this._$AC(t2) : (s2.el === void 0 && (s2.el = N.createElement(s2.h, this.options)), s2);
    if (((e2 = this._$AH) === null || e2 === void 0 ? void 0 : e2._$AD) === n2)
      this._$AH.m(i2);
    else {
      const t3 = new b(n2, this), e3 = t3.p(this.options);
      t3.m(i2), this.S(e3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let e2 = H.get(t2.strings);
    return e2 === void 0 && H.set(t2.strings, e2 = new N(t2)), e2;
  }
  M(t2) {
    $(this._$AH) || (this._$AH = [], this._$AR());
    const e2 = this._$AH;
    let i2, s2 = 0;
    for (const n2 of t2)
      s2 === e2.length ? e2.push(i2 = new T(this.A(r()), this.A(r()), this, this.options)) : i2 = e2[s2], i2._$AI(n2), s2++;
    s2 < e2.length && (this._$AR(i2 && i2._$AB.nextSibling, s2), e2.length = s2);
  }
  _$AR(t2 = this._$AA.nextSibling, e2) {
    var i2;
    for ((i2 = this._$AP) === null || i2 === void 0 || i2.call(this, false, true, e2); t2 && t2 !== this._$AB; ) {
      const e3 = t2.nextSibling;
      t2.remove(), t2 = e3;
    }
  }
  setConnected(t2) {
    var e2;
    this._$AM === void 0 && (this._$Cg = t2, (e2 = this._$AP) === null || e2 === void 0 || e2.call(this, t2));
  }
}
class C {
  constructor(t2, e2, i2, s2, n2) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = t2, this.name = e2, this._$AM = s2, this.options = n2, i2.length > 2 || i2[0] !== "" || i2[1] !== "" ? (this._$AH = Array(i2.length - 1).fill(new String()), this.strings = i2) : this._$AH = y;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2, e2 = this, i2, s2) {
    const n2 = this.strings;
    let o2 = false;
    if (n2 === void 0)
      t2 = E(this, t2, e2, 0), o2 = !d(t2) || t2 !== this._$AH && t2 !== f, o2 && (this._$AH = t2);
    else {
      const s3 = t2;
      let l2, h2;
      for (t2 = n2[0], l2 = 0; l2 < n2.length - 1; l2++)
        h2 = E(this, s3[i2 + l2], e2, l2), h2 === f && (h2 = this._$AH[l2]), o2 || (o2 = !d(h2) || h2 !== this._$AH[l2]), h2 === y ? t2 = y : t2 !== y && (t2 += (h2 != null ? h2 : "") + n2[l2 + 1]), this._$AH[l2] = h2;
    }
    o2 && !s2 && this.k(t2);
  }
  k(t2) {
    t2 === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 != null ? t2 : "");
  }
}
class M extends C {
  constructor() {
    super(...arguments), this.type = 3;
  }
  k(t2) {
    this.element[this.name] = t2 === y ? void 0 : t2;
  }
}
class S extends C {
  constructor() {
    super(...arguments), this.type = 4;
  }
  k(t2) {
    t2 && t2 !== y ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
}
class w extends C {
  constructor(t2, e2, i2, s2, n2) {
    super(t2, e2, i2, s2, n2), this.type = 5;
  }
  _$AI(t2, e2 = this) {
    var i2;
    if ((t2 = (i2 = E(this, t2, e2, 0)) !== null && i2 !== void 0 ? i2 : y) === f)
      return;
    const s2 = this._$AH, n2 = t2 === y && s2 !== y || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, o2 = t2 !== y && (s2 === y || n2);
    n2 && this.element.removeEventListener(this.name, this, s2), o2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var e2, i2;
    typeof this._$AH == "function" ? this._$AH.call((i2 = (e2 = this.options) === null || e2 === void 0 ? void 0 : e2.host) !== null && i2 !== void 0 ? i2 : this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class I {
  constructor(t2, e2, i2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = e2, this.options = i2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    E(this, t2);
  }
}
(t = globalThis.litHtmlPolyfillSupport) === null || t === void 0 || t.call(globalThis, N, T), ((e = globalThis.litHtmlVersions) !== null && e !== void 0 ? e : globalThis.litHtmlVersions = []).push("2.0.0");
export {m as html, A as renderer};
export default null;
