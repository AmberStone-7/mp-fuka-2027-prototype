// 中汇新年福卡 · 2027 交互原型「可编辑」导入插件
// 画进 Figma 后：文字可改、色块/按钮/卡片是矩形、图片可替换、视频背景为首帧图片占位
const PAGES = [
  {
    "name": "H5-01 首页",
    "group": "h5",
    "w": 390,
    "h": 864,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-activity.json"
  },
  {
    "name": "H5-02 查询福卡·中奖",
    "group": "h5",
    "w": 390,
    "h": 844,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-query.json"
  },
  {
    "name": "H5-03 领取福卡",
    "group": "h5",
    "w": 390,
    "h": 844,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-claim.json"
  },
  {
    "name": "H5-04 活动奖项",
    "group": "h5",
    "w": 390,
    "h": 1626,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-prizes.json"
  },
  {
    "name": "H5-05 中奖公示",
    "group": "h5",
    "w": 390,
    "h": 1163,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-publicity.json"
  },
  {
    "name": "H5-06 礼品领取登记",
    "group": "h5",
    "w": 390,
    "h": 844,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-redeem.json"
  },
  {
    "name": "H5-08 福卡样式总览",
    "group": "h5",
    "w": 390,
    "h": 4114,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-card-styles.json"
  },
  {
    "name": "H5-07 活动细则与赞助",
    "group": "h5",
    "w": 390,
    "h": 2760,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/h5-rules.json"
  },
  {
    "name": "ADM-01 福卡管理",
    "group": "adm",
    "w": 1440,
    "h": 969,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/adm-cards.json"
  },
  {
    "name": "ADM-02 邀请码管理",
    "group": "adm",
    "w": 1440,
    "h": 900,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/adm-invite.json"
  },
  {
    "name": "ADM-03 抽奖管理",
    "group": "adm",
    "w": 1440,
    "h": 900,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/adm-draw.json"
  },
  {
    "name": "ADM-04 奖品管理",
    "group": "adm",
    "w": 1440,
    "h": 900,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/adm-prizes.json"
  },
  {
    "name": "ADM-05 中奖记录",
    "group": "adm",
    "w": 1440,
    "h": 1112,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/adm-winners.json"
  },
  {
    "name": "ADM-06 邮件日志",
    "group": "adm",
    "w": 1440,
    "h": 986,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/adm-email.json"
  },
  {
    "name": "原型入口",
    "group": "index",
    "w": 1440,
    "h": 1730,
    "spec": "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/index.json"
  }
];
const POSTER = "https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/bg-poster.png";

let FONTS = null;
const FONT_CACHE = {};
const CJK = /[\u4e00-\u9fff]/;

async function loadFonts() {
  if (!FONTS) {
    const list = await figma.listAvailableFontsAsync();
    FONTS = {};
    list.forEach(f => {
      const key = f.fontName.family + "|" + f.fontName.style;
      FONTS[key] = f.fontName;
    });
  }
}

async function pickFont(family, weight, text) {
  await loadFonts();
  const hasCJK = CJK.test(text || "");
  const clean = String(family || "").replace(/["']/g, "");
  const families = [];
  if (/serif|songti|stsong|times|georgia/i.test(clean)) {
    families.push("Noto Serif SC", "Noto Serif", "Songti SC", "STSong");
  } else {
    if (hasCJK) families.push("Noto Sans SC", "PingFang SC", "Microsoft YaHei");
    families.push("Inter", "Roboto", "Noto Sans");
  }
  const styles = weight >= 700 ? ["Bold", "SemiBold", "Medium", "Regular"] : weight >= 500 ? ["Medium", "SemiBold", "Regular"] : ["Regular", "Medium"];
  for (const fam of families) {
    for (const st of styles) {
      const key = fam + "|" + st;
      if (FONTS[key]) {
        if (!FONT_CACHE[key]) {
          try { await figma.loadFontAsync(FONTS[key]); } catch (e) { continue; }
          FONT_CACHE[key] = true;
        }
        return FONTS[key];
      }
    }
  }
  const fallback = { family: "Inter", style: "Regular" };
  if (!FONT_CACHE["Inter|Regular"]) {
    try { await figma.loadFontAsync(fallback); } catch (e) {}
    FONT_CACHE["Inter|Regular"] = true;
  }
  return fallback;
}

function solid(c, opacity) {
  if (!c) return null;
  return { type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: c.a == null ? (opacity == null ? 1 : opacity) : c.a };
}

function applyFills(node, style) {
  if (!style) return;
  if (style.bg) {
    node.fills = [solid(style.bg)];
  } else {
    node.fills = [];
  }
}

function applyRadius(node, radius) {
  if (!radius) return;
  if (typeof radius === "number") { node.cornerRadius = radius; return; }
  if (radius.tl === radius.tr && radius.tr === radius.br && radius.br === radius.bl) {
    node.cornerRadius = radius.tl || 0;
    return;
  }
  node.topLeftRadius = radius.tl || 0;
  node.topRightRadius = radius.tr || 0;
  node.bottomLeftRadius = radius.bl || 0;
  node.bottomRightRadius = radius.br || 0;
}

function gradientSvg(n) {
  const g = n.style && n.style.grad;
  if (!g || !g.stops || !g.stops.length) return null;
  const rad = (g.angle || 180) * Math.PI / 180;
  const vx = Math.sin(rad), vy = -Math.cos(rad);
  const x1 = 0.5 - vx / 2, y1 = 0.5 - vy / 2, x2 = 0.5 + vx / 2, y2 = 0.5 + vy / 2;
  const stops = g.stops.map(s => {
    const c = s.color;
    const rgb = "rgb(" + Math.round(c.r * 255) + "," + Math.round(c.g * 255) + "," + Math.round(c.b * 255) + ")";
    return '<stop offset="' + Math.max(0, Math.min(1, s.pos)) + '" stop-color="' + rgb + '" stop-opacity="' + (c.a == null ? 1 : c.a) + '"/>';
  }).join("");
  const rr = n.style.radius || 0;
  const r = typeof rr === 'number' ? rr : (rr.tl || 0);
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + n.w + '" height="' + n.h + '" viewBox="0 0 ' + n.w + ' ' + n.h + '">' +
    '<defs><linearGradient id="g" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' + stops + '</linearGradient></defs>' +
    '<rect x="0" y="0" width="' + n.w + '" height="' + n.h + '" rx="' + r + '" fill="url(#g)"/></svg>';
}

function nameOf(n) {
  const sec = n.section && n.section !== "page" ? n.section + " / " : "";
  return sec + (n.name || n.type || "图层");
}

async function addNode(parent, n) {
  try {
    const name = nameOf(n);

    if (n.type === "svg") {
      let svg = n.svg;
      if (svg.indexOf("xmlns=") < 0) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
      const node = figma.createNodeFromSvg(svg);
      node.name = name;
      parent.appendChild(node);
      node.resize(Math.max(1, n.w), Math.max(1, n.h));
      node.x = n.x; node.y = n.y;
      return node;
    }

    if (n.type === "image") {
      const img = await figma.createImageAsync(n.src);
      const rect = figma.createRectangle();
      rect.name = name;
      parent.appendChild(rect);
      rect.resize(Math.max(1, n.w), Math.max(1, n.h));
      rect.x = n.x; rect.y = n.y;
      rect.fills = [{ type: "IMAGE", imageHash: img.hash, scaleMode: "FILL" }];
      if (n.radius) applyRadius(rect, n.radius);
      return rect;
    }

    if (n.type === "text") {
      const st = n.style || {};
      const text = st.uppercase ? String(n.text).toUpperCase() : String(n.text);
      const font = await pickFont(st.fontFamily, st.fontWeight, text);
      const t = figma.createText();
      t.name = name;
      parent.appendChild(t);
      t.fontName = font;
      t.fontSize = st.fontSize || 14;
      t.characters = text;
      t.textAutoResize = "NONE";
      t.resize(Math.max(4, n.w), Math.max(Math.round((st.fontSize || 14) * 1.2), n.h));
      t.x = n.x; t.y = n.y;
      t.fills = st.color ? [solid(st.color)] : [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      t.textAlignHorizontal = st.textAlign === "center" ? "CENTER" : st.textAlign === "right" ? "RIGHT" : "LEFT";
      t.lineHeight = { unit: "PIXELS", value: st.lineHeight || Math.round((st.fontSize || 14) * 1.4) };
      t.letterSpacing = { unit: "PIXELS", value: st.letterSpacing || 0 };
      if (st.vertical) { try { t.textAlignVertical = "CENTER"; } catch (e) {} }
      if (st.opacity != null && st.opacity < 1) t.opacity = st.opacity;
      return t;
    }

    // box
    const st = n.style || {};
    if (st.grad) {
      const svg = gradientSvg(n);
      if (svg) {
        const node = figma.createNodeFromSvg(svg);
        node.name = name;
        parent.appendChild(node);
        node.resize(Math.max(1, n.w), Math.max(1, n.h));
        node.x = n.x; node.y = n.y;
        return node;
      }
    }
    const rect = figma.createRectangle();
    rect.name = name;
    parent.appendChild(rect);
    rect.resize(Math.max(1, n.w), Math.max(1, n.h));
    rect.x = n.x; rect.y = n.y;
    if (st.bg) rect.fills = [solid(st.bg)];
    else rect.fills = [];
    if (st.border) {
      rect.strokes = [solid(st.border.color)];
      rect.strokeWeight = st.border.w;
      rect.strokeAlign = "INSIDE";
    }
    applyRadius(rect, st.radius);
    return rect;
  } catch (e) {
    return null;
  }
}

async function addTextLabel(parent, text, x, y, size) {
  try {
    const font = await pickFont("Inter", 700, text);
    const t = figma.createText();
    parent.appendChild(t);
    t.fontName = font;
    t.fontSize = size;
    t.characters = text;
    t.textAutoResize = "WIDTH_AND_HEIGHT";
    t.x = x; t.y = y;
    t.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
    return t;
  } catch (e) { return null; }
}

async function buildPage(p) {
  const res = await fetch(p.spec);
  const spec = await res.json();
  const frame = figma.createFrame();
  frame.name = p.name;
  frame.resize(p.w, p.h);
  frame.fills = [];
  frame.clipsContent = true;

  if (p.group === "h5") {
    try {
      const poster = await figma.createImageAsync(POSTER);
      frame.fills = [{ type: "IMAGE", imageHash: poster.hash, scaleMode: "FILL" }];
    } catch (e) {}
  }

  let count = 0;
  for (const n of spec.nodes) {
    const created = await addNode(frame, n);
    if (created) count++;
  }
  return { frame, count };
}

async function main() {
  const page = figma.currentPage;
  page.name = "中汇新年福卡原型";

  const GAP = 64;
  let y = 0;

  const indexPage = PAGES.find(p => p.group === "index");
  if (indexPage) {
    await addTextLabel(page, "原型入口", 0, y, 40);
    y += 56;
    const r = await buildPage(indexPage);
    r.frame.x = 0; r.frame.y = y;
    y += r.frame.height + GAP;
  }

  await addTextLabel(page, "前台 H5（390 宽）", 0, y, 40);
  y += 56;
  const h5 = PAGES.filter(p => p.group === "h5");
  const COLS = 3, COL_W = 390, COL_GAP = 56;
  for (let i = 0; i < h5.length; i += COLS) {
    const row = h5.slice(i, i + COLS);
    let rowH = 0;
    for (let c = 0; c < row.length; c++) {
      const x = c * (COL_W + COL_GAP);
      await addTextLabel(page, row[c].name, x, y, 20);
      const r = await buildPage(row[c]);
      r.frame.x = x; r.frame.y = y + 34;
      rowH = Math.max(rowH, r.frame.height);
    }
    y += 34 + rowH + GAP;
  }

  await addTextLabel(page, "后台管理（1440 宽）", 0, y, 40);
  y += 56;
  const adm = PAGES.filter(p => p.group === "adm");
  for (const p of adm) {
    await addTextLabel(page, p.name, 0, y, 24);
    const r = await buildPage(p);
    r.frame.x = 0; r.frame.y = y + 34;
    y += 34 + r.frame.height + GAP;
  }

  const frames = page.children.filter(n => n.type === "FRAME");
  figma.currentPage.selection = frames;
  figma.viewport.scrollAndZoomIntoView(frames);
  figma.closePlugin("已导入 " + PAGES.length + " 个可编辑页面");
}

main().catch(err => {
  figma.closePlugin("导入失败：" + (err && err.message ? err.message : String(err)));
});
