(function () {
  const map = window.MUSIC_MAP;
  const OPEN_DEPTH = 1; // branches open by default: 0 = top level only

  document.title = map.title;
  document.getElementById("title").textContent = map.title;
  document.getElementById("intro").textContent = map.intro;

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
    img.loading = "lazy";
    img.alt = "";
    img.src = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg";
    btn.append(img, el("span", "play"));
    btn.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src =
        "https://www.youtube-nocookie.com/embed/" + v.id +
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

  function renderNode(node, depth, branch) {
    const li = el("li", "node depth-" + depth);
    const hasKids = node.children && node.children.length;
    const card = el("div", "card");
    const text = el("div", "text");

    const head = el(hasKids ? "button" : "div", "head");
    if (hasKids) {
      head.type = "button";
      head.append(el("span", "chev"));
    }
    head.append(el("span", "name", node.name));
    if (node.native) head.append(el("span", "native", node.native));
    if (hasKids) head.append(el("span", "count", String(node.children.length)));
    text.append(head);
    if (node.desc) text.append(el("p", "desc", node.desc));
    card.append(text);

    // Leaves always get a video slot; branches only when one is set.
    if (!hasKids || node.video) card.append(renderVideo(node.video));
    li.append(card);

    if (hasKids) {
      const ul = el("ul", "children");
      node.children.forEach((c) => ul.append(renderNode(c, depth + 1, branch)));
      li.append(ul);
      setOpen(li, depth < OPEN_DEPTH);
      head.addEventListener("click", () => setOpen(li, !li.classList.contains("open")));
    }
    if (depth === 0) li.style.setProperty("--branch", "var(--b" + branch + ")");
    return li;
  }

  function setOpen(li, open) {
    li.classList.toggle("open", open);
    const head = li.querySelector(":scope > .card .head");
    if (head && head.tagName === "BUTTON") head.setAttribute("aria-expanded", open);
  }

  const tree = document.getElementById("tree");
  map.children.forEach((n, i) => tree.append(renderNode(n, 0, i % 6)));

  document.getElementById("expand").addEventListener("click", () =>
    tree.querySelectorAll("li:has(> ul)").forEach((li) => setOpen(li, true)));
  document.getElementById("collapse").addEventListener("click", () =>
    tree.querySelectorAll("li:has(> ul)").forEach((li) => setOpen(li, false)));
})();
