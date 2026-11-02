/* ==========================================================================
   交互原型 · 轻量说明层（不属于产品界面）
   页面通过 window.PAGE_META / window.DEMOS 提供说明与演示动作
   ========================================================================== */
(function () {
  "use strict";

  var U = {
    $: function (sel, root) { return (root || document).querySelector(sel); },
    $$: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },
    toast: function (msg) {
      var root = document.getElementById("toast-root");
      if (!root) return;
      var el = document.createElement("div");
      el.className = "toast" + (document.body.classList.contains("h5") ? " toast--dark" : "");
      el.textContent = msg;
      root.appendChild(el);
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 2600);
    },
    setVal: function (el, v) {
      var d = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
      d.set.call(el, v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };
  window.U = U;

  function buildNotes() {
    var meta = window.PAGE_META || {};
    var demos = window.DEMOS || [];

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "proto-notes-btn";
    btn.innerHTML = '✎ <span class="proto-notes-btn__t">原型说明</span>';
    btn.addEventListener("click", function () { drawer.classList.add("is-open"); mask.classList.add("is-open"); });

    var mask = document.createElement("div");
    mask.className = "proto-mask";
    mask.addEventListener("click", function () { drawer.classList.remove("is-open"); mask.classList.remove("is-open"); });

    var drawer = document.createElement("aside");
    drawer.className = "proto-drawer";
    drawer.setAttribute("aria-hidden", "true");

    var li = function (arr) {
      return "<ul>" + (arr || []).map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul>";
    };
    var liveText = { yes: "本期上线", part: "部分上线", no: "后续版本" }[meta.live || "yes"] || "本期上线";

    drawer.innerHTML =
      '<div class="proto-drawer__head">' +
      '<span class="proto-drawer__title">页面说明</span>' +
      '<span class="proto-drawer__badge">' + (meta.id || "") + " · " + liveText + "</span>" +
      '<a class="proto-drawer__home" href="../index.html">原型目录</a>' +
      '<button class="proto-drawer__close" type="button" aria-label="关闭">×</button>' +
      "</div>" +
      '<div class="proto-drawer__body">' +
      "<section><h3>基本信息</h3><dl class=\"proto-kv\">" +
      "<dt>页面</dt><dd>" + (meta.title || "") + "</dd>" +
      "<dt>对应需求</dt><dd>" + ((meta.fr || []).join("、") || "—") + "</dd>" +
      "<dt>验收用例</dt><dd>" + ((meta.ac || []).join("、") || "—") + "</dd>" +
      "<dt>发布范围</dt><dd>" + liveText + (meta.note ? "（" + meta.note + "）" : "") + "</dd>" +
      "</dl></section>" +
      (meta.goal ? "<section><h3>页面目标</h3><p>" + meta.goal + "</p></section>" : "") +
      (meta.api && meta.api.length
        ? "<section><h3>接口与数据</h3><ul class=\"proto-api\">" + meta.api.map(function (a) {
            return "<li><b>" + a.method + "</b> <code>" + a.path + "</code><span>" + (a.desc || "") + "</span></li>";
          }).join("") + "</ul></section>"
        : "") +
      (meta.fields && meta.fields.length ? "<section><h3>字段与校验</h3>" + li(meta.fields) + "</section>" : "") +
      (meta.rules && meta.rules.length ? "<section><h3>业务规则与边界</h3>" + li(meta.rules) + "</section>" : "") +
      (meta.states && meta.states.length ? "<section><h3>状态与异常</h3>" + li(meta.states) + "</section>" : "") +
      (meta.permissions && meta.permissions.length ? "<section><h3>权限</h3>" + li(meta.permissions) + "</section>" : "") +
      (meta.events && meta.events.length ? "<section><h3>埋点</h3>" + li(meta.events) + "</section>" : "") +
      (meta.notes && meta.notes.length ? "<section><h3>交互说明</h3>" + li(meta.notes) + "</section>" : "") +
      (meta.devNotes && meta.devNotes.length ? "<section><h3>开发注意</h3>" + li(meta.devNotes) + "</section>" : "") +
      (demos.length ? "<section><h3>演示控制</h3><div class=\"proto-demo\" id=\"proto-demo\"></div></section>" : "") +
      (meta.todo && meta.todo.length ? "<section><h3>待确认</h3>" + li(meta.todo) + "</section>" : "") +
      "</div>" +
      '<div class="proto-foot">演示数据 · 非真实业务数据 · 原型 V1.0</div>';

    document.body.appendChild(btn);
    document.body.appendChild(mask);
    document.body.appendChild(drawer);

    var toastRoot = document.createElement("div");
    toastRoot.id = "toast-root";
    toastRoot.className = "toast-root";
    document.body.appendChild(toastRoot);

    drawer.querySelector(".proto-drawer__close").addEventListener("click", function () {
      drawer.classList.remove("is-open");
      mask.classList.remove("is-open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        drawer.classList.remove("is-open");
        mask.classList.remove("is-open");
        U.$$(".adm-modal.is-open").forEach(function (m) { m.classList.remove("is-open"); });
      }
    });

    var demoBox = drawer.querySelector("#proto-demo");
    if (demoBox) {
      demos.forEach(function (d) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = d.label;
        b.addEventListener("click", function () { d.fn(); });
        demoBox.appendChild(b);
      });
    }
  }

  function buildProtoNav() {
    if (!document.body.classList.contains("h5") && !document.body.classList.contains("adm")) return;
    var a = document.createElement("a");
    a.className = "proto-nav";
    a.href = "../index.html";
    a.innerHTML = "⌂ 原型目录";
    if (document.body.classList.contains("adm")) {
      var top = document.querySelector(".adm-topbar");
      if (top) {
        top.insertBefore(a, top.firstChild);
        return;
      }
    }
    document.body.appendChild(a);
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildNotes();
    buildProtoNav();
  });
})();
