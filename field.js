(function () {
  const F = window.MUSIC_FIELD;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("field");
  const panel = document.getElementById("panel");
  const byId = {};

  document.title = F.title;
  document.getElementById("title").textContent = F.title;
  document.getElementById("intro").textContent = F.intro;
  svg.setAttribute("viewBox", F.viewBox.join(" "));

  function s(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.append(e);
    return e;
  }

  // Multi-line, centred label. Lines split on " / " so long names wrap like the sketch.
  function label(parent, x, y, lines, cls) {
    const t = s("text", { x, y, class: cls || "label", "text-anchor": "middle" }, parent);
    const lh = 34;
    lines.forEach((line, i) => {
      const ts = s("tspan", { x, dy: i === 0 ? -((lines.length - 1) * lh) / 2 : lh }, t);
      ts.textContent = line;
    });
    t.setAttribute("dominant-baseline", "central");
    return t;
  }

  function wrap(name) {
    if (name.length <= 13) return [name];
    const parts = name.split(" / ");
    if (parts.length > 1) return [parts[0] + " /", parts.slice(1).join(" / ")];
    return [name];
  }

  // Closed Catmull-Rom spline -> smooth SVG path
  function smoothPath(pts) {
    const n = pts.length;
    const p = (i) => pts[(i + n) % n];
    let d = "M" + pts[0].join(",");
    for (let i = 0; i < n; i++) {
      const [x0, y0] = p(i - 1), [x1, y1] = p(i), [x2, y2] = p(i + 1), [x3, y3] = p(i + 2);
      d += " C" + [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6, x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6, x2, y2].join(",");
    }
    return d + "Z";
  }

  function hit(g, item) {
    byId[item.id] = { item, g };
    g.classList.add("hit");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", item.name);
    g.addEventListener("click", (e) => { e.stopPropagation(); select(item.id); });
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(item.id); }
    });
  }

  // ---- layers, back to front ----
  const film = s("g", { class: "region film" }, svg);
  s("rect", { x: F.film.x, y: F.film.y, width: F.film.w, height: F.film.h, rx: F.film.r }, film);
  label(film, F.film.label[0], F.film.label[1], [F.film.name], "region-label");
  hit(film, F.film);

  const folk = s("g", { class: "region folk" }, svg);
  s("path", { d: smoothPath(F.folk.outline) }, folk);
  label(folk, F.folk.label[0], F.folk.label[1], [F.folk.name], "region-label folk-label");
  hit(folk, F.folk);

  const order = { folk: 0, genre: 1, pole: 2 };
  [...F.nodes].sort((a, b) => order[a.kind] - order[b.kind]).forEach((n) => {
    const g = s("g", { class: "node " + n.kind }, svg);
    if (n.kind === "pole") {
      s("circle", { cx: n.x, cy: n.y, r: 110, fill: n.color, stroke: n.stroke }, g);
      const t = label(g, n.x, n.y, n.sub ? [n.name, "(" + n.sub + ")"] : [n.name], "label pole-label");
      t.style.fill = n.ink;
    } else if (n.kind === "folk") {
      s("ellipse", { cx: n.x, cy: n.y, rx: 110, ry: 50 }, g);
      label(g, n.x, n.y, wrap(n.name));
    } else {
      s("rect", { x: n.x - 110, y: n.y - 50, width: 220, height: 100, rx: 48 }, g);
      label(g, n.x, n.y, wrap(n.name));
    }
    if (n.video && n.video.id) s("circle", { cx: n.x + 96, cy: n.y - 40, r: 9, class: "has-video" }, g);
    hit(g, n);
  });

  // ---- side panel ----
  const KIND = { pole: "Source tradition", genre: "Genre", folk: "Folk tradition", film: "Melting pot", folkRegion: "Source tradition" };
  const intro = panel.innerHTML;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function renderVideo(v) {
    const fig = el("figure", "video");
    if (!v || !v.id) {
      fig.classList.add("empty");
      fig.append(el("span", "", "Video to be chosen"));
      return fig;
    }
    const btn = el("button", "thumb");
    btn.type = "button";
    btn.setAttribute("aria-label", "Play " + (v.title || "video"));
    const img = new Image();
    img.alt = "";
    img.src = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg";
    btn.append(img, el("span", "play"));
    btn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + v.id +
        "?autoplay=1&rel=0" + (v.start ? "&start=" + v.start : "");
      f.title = v.title || "YouTube video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
    fig.append(btn);
    if (v.title || v.artist) {
      const cap = el("figcaption");
      if (v.title) cap.append(el("strong", "", v.title));
      if (v.artist) cap.append(el("span", "", v.artist));
      fig.append(cap);
    }
    return fig;
  }

  function select(id) {
    svg.querySelectorAll(".selected").forEach((g) => g.classList.remove("selected"));
    const entry = byId[id];
    if (!entry) {
      panel.innerHTML = intro;
      history.replaceState(null, "", location.pathname);
      return;
    }
    const { item, g } = entry;
    g.classList.add("selected");
    const kind = item.kind || (id === "film" ? "film" : "folkRegion");

    panel.innerHTML = "";
    const close = el("button", "close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", () => select(null));
    panel.append(close, el("p", "kind", KIND[kind]));
    const h = el("h2", "", item.name);
    if (item.native) h.append(el("span", "native", item.native));
    panel.append(h);
    if (item.desc) panel.append(el("p", "desc", item.desc));
    if (item.kind === "genre" || item.kind === "folk" || item.video) panel.append(renderVideo(item.video));

    history.replaceState(null, "", "#" + id);
    if (window.matchMedia("(max-width: 900px)").matches) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  svg.addEventListener("click", () => select(null));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") select(null); });
  if (location.hash) select(decodeURIComponent(location.hash.slice(1)));
})();
