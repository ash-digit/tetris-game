(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) c(l);
  new MutationObserver((l) => {
    for (const r of l)
      if (r.type === "childList")
        for (const i of r.addedNodes)
          i.tagName === "LINK" && i.rel === "modulepreload" && c(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(l) {
    const r = {};
    return (
      l.integrity && (r.integrity = l.integrity),
      l.referrerPolicy && (r.referrerPolicy = l.referrerPolicy),
      l.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : l.crossOrigin === "anonymous"
        ? (r.credentials = "omit")
        : (r.credentials = "same-origin"),
      r
    );
  }
  function c(l) {
    if (l.ep) return;
    l.ep = !0;
    const r = o(l);
    fetch(l.href, r);
  }
})();
const L = 20,
  m = 10;
let a = 500,
  y = 0,
  f = !1,
  g = 1;
function C() {
  return Array.from({ length: L }, () => Array(m).fill(0));
}
let s = C(),
  h;
const O = [
    [[1, 1, 1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
  ],
  v = [];
function T() {
  for (; v.length < 3; ) {
    const e = Math.floor(Math.random() * O.length),
      t = O[e];
    v.push(t);
  }
}
let q = document.querySelector("#speedometer"),
  w = document.querySelector("#faster"),
  S = document.querySelector("#slower");
w == null ||
  w.addEventListener("click", () => {
    a > 120 &&
      (clearInterval(h),
      (a -= 20),
      (g += 1),
      (q.innerHTML = " " + g.toString()),
      console.log("time ---->", a),
      (h = setInterval(M, a)));
  });
S == null ||
  S.addEventListener("click", () => {
    a < 500 &&
      (clearInterval(h),
      (a += 20),
      (g -= 1),
      (q.innerHTML = " " + g.toString()),
      console.log("time ---->", a),
      (h = setInterval(M, a)));
  });
const H = document.querySelector(".playfield");
function k() {
  const e = document.getElementById("nextPieces");
  e &&
    ((e.innerHTML = ""),
    v.forEach((t) => {
      const o = document.createElement("div");
      o.className = "preview-piece";
      const c = t[0].length;
      (o.style.gridTemplateColumns = `repeat(${c}, 32px)`),
        t.forEach((l) => {
          l.forEach((r) => {
            const i = document.createElement("div");
            (i.className = "cell"),
              r && i.classList.add("filled"),
              o.appendChild(i);
          });
        }),
        e.appendChild(o);
    }));
}
const u = document.getElementById("pause-continue");
u == null ||
  u.addEventListener("click", () => {
    f
      ? ((f = !1), (u.innerHTML = "PAUSE"))
      : ((f = !0), (u.innerHTML = "CONTINUE"));
  });
let x = document.getElementById("reset");
x == null ||
  x.addEventListener("click", () => {
    (u.innerHTML = "PAUSE"), U();
  });
let n = I();
function U() {
  (s = C()), (n = I()), (f = !1), (y = 0), A(y), E();
}
function I() {
  T();
  const e = v.shift();
  return T(), k(), { shape: e, x: Math.floor((m - e[0].length) / 2), y: 0 };
}
function p(e, t) {
  var r;
  const { shape: o, x: c, y: l } = e;
  for (let i = 0; i < o.length; i++)
    for (let d = 0; d < o[i].length; d++) {
      if (o[i][d] === 0) continue;
      const N = l + i,
        P = c + d;
      if (N >= L || P < 0 || P >= m || ((r = t[N]) != null && r[P])) return !0;
    }
  return !1;
}
function A(e) {
  let t = document.querySelector("#counter");
  t && (t.innerHTML = e.toString());
}
function b(e, t) {
  const { shape: o, x: c, y: l } = e;
  for (let r = 0; r < o.length; r++)
    for (let i = 0; i < o[r].length; i++)
      o[r][i] && (t[l + r][c + i] = o[r][i]);
}
function D(e) {
  for (let t = L - 1; t >= 0; t--)
    e[t].every((o) => o !== 0) &&
      (e.splice(t, 1), e.unshift(Array(m).fill(0)), (y += 100), A(y), t++);
}
function E() {
  var e;
  H.innerHTML = "";
  for (let t = 0; t < L; t++)
    for (let o = 0; o < m; o++) {
      const c = document.createElement("div");
      (c.className = "cell"),
        s[t][o] && c.classList.add("filled"),
        t >= n.y &&
          t < n.y + n.shape.length &&
          o >= n.x &&
          o < n.x + n.shape[0].length &&
          (e = n.shape[t - n.y]) != null &&
          e[o - n.x] &&
          c.classList.add("active"),
        H.appendChild(c);
    }
}
function G() {
  const e = n.shape,
    t = e.length,
    o = e[0].length,
    c = [];
  for (let r = 0; r < o; r++) {
    const i = [];
    for (let d = t - 1; d >= 0; d--) i.push(e[d][r]);
    c.push(i);
  }
  const l = n.shape;
  (n.shape = c), p(n, s) && (n.shape = l);
}
function M() {
  f ||
    (n.y++,
    p(n, s) &&
      (n.y--, b(n, s), D(s), (n = I()), p(n, s) && alert("Game Over!")),
    E());
}
document.addEventListener("keydown", (e) => {
  e.key === "a" && !f
    ? (n.x--, p(n, s) && n.x++)
    : e.key === "d" && !f
    ? (n.x++, p(n, s) && n.x--)
    : e.key === "s" && !f
    ? (n.y++, p(n, s) && n.y--)
    : e.key === "w" && !f && G(),
    E();
});
h = setInterval(M, a);
E();
