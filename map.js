(function () {
  const D = window.MAP_DATA;
  const NS = "http://www.w3.org/2000/svg";
  const HEARD_AFTER = 60; // seconds of playback before a song counts as heard
  const STORE_KEY = "indian-music-map:heard";

  const canvas = document.getElementById("canvas");
  const panel = document.getElementById("panel");
  const intro = panel.innerHTML;
  const byId = {};     // "song-…" / "genre-…" -> entry
  const songs = [];    // CSV order
  const KIND = { song: "Song", genre: "Genre", pole: "Source tradition", folk: "Folk tradition" };
  let cleanup = null;  // stops the current player's timer when the panel changes
  let current = null;

  document.title = D.title;
  document.getElementById("title").textContent = D.title;
  document.getElementById("intro").textContent = D.intro;

  const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

  // ---------- heard-songs storage (per browser) ----------
  const heard = new Set(load());
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...heard])); } catch (e) {}
  }
  function setHeard(id, on) {
    on ? heard.add(id) : heard.delete(id);
    save();
    const e = byId[id];
    if (e && e.g) e.g.classList.toggle("heard", on);
    updateProgress();
    if (current === id) renderHeardToggle();
  }

  // ---------- helpers ----------
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') q = false;
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    // Blank headers fall back to the expected column order: song, genre, url.
    const head = rows.shift().map((h, i) => norm(h) || ["song", "genre", "url"][i] || "col" + i);
    return rows.filter((r) => r.some((f) => f.trim())).map((r) =>
      Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
  }

  function youtube(url) {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
    if (!m) return null;
    const t = url.match(/[?&](?:t|start)=(\d+)/);
    return { id: m[1], start: t ? +t[1] : 0 };
  }

  function distance(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  // ---------- YouTube player that reports listening time ----------
  let apiPromise = null;
  function ytApi() {
    if (window.YT && window.YT.Player) return Promise.resolve();
    if (!apiPromise) {
      apiPromise = new Promise((resolve) => {
        window.onYouTubeIframeAPIReady = resolve;
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.append(s);
      });
    }
    return apiPromise;
  }

  function renderVideo(song) {
    const fig = el("figure", "video");
    if (!song.yt) {
      fig.classList.add("empty");
      fig.append(el("span", "", "Video link coming soon"));
      return fig;
    }
    const btn = el("button", "thumb");
    btn.type = "button";
    btn.setAttribute("aria-label", "Play " + song.name);
    const img = new Image();
    img.alt = "";
    img.src = "https://i.ytimg.com/vi/" + song.yt.id + "/hqdefault.jpg";
    btn.append(img, el("span", "play"));
    btn.addEventListener("click", () => play(btn, song));
    fig.append(btn);
    return fig;
  }

  function play(btn, song) {
    const frame = el("div", "frame");
    const slot = el("div");
    frame.append(slot);
    btn.replaceWith(frame);
    ytApi().then(() => {
      if (!frame.isConnected) return;
      const player = new YT.Player(slot, {
        host: "https://www.youtube-nocookie.com",
        videoId: song.yt.id,
        playerVars: { autoplay: 1, rel: 0, start: song.yt.start || 0, playsinline: 1 },
      });
      let played = 0;
      const timer = setInterval(() => {
        if (!frame.isConnected) return stop();
        if (typeof player.getPlayerState !== "function" || player.getPlayerState() !== 1) return;
        played++;
        const dur = player.getDuration ? player.getDuration() : 0;
        if (played >= HEARD_AFTER || (dur && played >= dur * 0.5)) {
          if (!heard.has(song.id)) setHeard(song.id, true);
          stop();
        }
      }, 1000);
      function stop() { clearInterval(timer); }
      cleanup = stop;
    });
  }

  // ---------- panel ----------
  function renderHeardToggle() {
    const old = panel.querySelector(".heard-toggle");
    if (!old) return;
    const on = heard.has(current);
    old.classList.toggle("on", on);
    old.textContent = on ? "✓ Heard" : "Mark as heard";
    old.setAttribute("aria-pressed", on);
  }

  function songList(list) {
    const ul = el("ul", "songlist");
    list.forEach((s) => {
      const li = el("li");
      const b = el("button", heard.has(s.id) ? "is-heard" : "", s.name);
      b.type = "button";
      b.addEventListener("click", () => select(s.id));
      li.append(b);
      ul.append(li);
    });
    return ul;
  }

  function genreTags(genre) {
    return genre.split("-").map((g) => g.trim()).filter(Boolean);
  }

  function select(id, opts) {
    if (cleanup) { cleanup(); cleanup = null; }
    canvas.querySelectorAll(".selected").forEach((g) => g.classList.remove("selected"));
    const entry = id && byId[id];
    current = entry ? id : null;
    if (!entry) {
      panel.innerHTML = intro;
      history.replaceState(null, "", location.pathname + location.search);
      return;
    }
    if (entry.g) entry.g.classList.add("selected");
    panel.innerHTML = "";
    const close = el("button", "close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", () => select(null));
    panel.append(close, el("p", "kind", KIND[entry.kind]));

    if (entry.kind === "song") {
      panel.append(el("h2", "", entry.name));
      if (entry.genre) {
        const tags = el("p", "tags");
        genreTags(entry.genre).forEach((t) => tags.append(el("span", "tag", t)));
        panel.append(tags);
      }
      panel.append(renderVideo(entry));
      const actions = el("div", "song-actions");
      const toggle = el("button", "heard-toggle");
      toggle.type = "button";
      toggle.addEventListener("click", () => setHeard(entry.id, !heard.has(entry.id)));
      const next = el("button", "next", "Next unheard →");
      next.type = "button";
      next.addEventListener("click", nextUnheard);
      actions.append(toggle, next);
      panel.append(actions);
      renderHeardToggle();
    } else {
      const n = D.notes[entry.key] || {};
      panel.append(el("h2", "", n.name || titleCase(entry.key)));
      if (n.desc) panel.append(el("p", "desc", n.desc));
      const key = entry.key === "film music" ? "film" : entry.key;
      const related = songs.filter((s) => genreTags(s.genre).includes(key));
      if (related.length) {
        panel.append(el("p", "kind", "Songs on the map"));
        panel.append(songList(related));
      }
    }

    history.replaceState(null, "", "#" + id);
    if (!(opts && opts.quiet) && window.matchMedia("(max-width: 900px)").matches)
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function nextUnheard() {
    const playable = songs.filter((s) => s.g && s.yt);
    if (!playable.length) return;
    const start = Math.max(0, playable.findIndex((s) => s.id === current));
    for (let i = 1; i <= playable.length; i++) {
      const s = playable[(start + i) % playable.length];
      if (!heard.has(s.id)) return select(s.id);
    }
    flash("You've heard every song on the map. 🎉");
  }

  // ---------- progress bar ----------
  const progress = document.getElementById("progress");
  function updateProgress() {
    const total = songs.filter((s) => s.g).length;
    const n = songs.filter((s) => s.g && heard.has(s.id)).length;
    progress.querySelector(".count").textContent = n + " of " + total + " songs heard";
    progress.querySelector(".bar span").style.width = total ? (100 * n) / total + "%" : "0";
  }
  function flash(msg) {
    const f = progress.querySelector(".flash");
    f.textContent = msg;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => (f.textContent = ""), 3500);
  }
  progress.querySelector(".next").addEventListener("click", nextUnheard);
  progress.querySelector(".share").addEventListener("click", () => {
    const url = location.origin + location.pathname + "#heard=" + [...heard].map((id) => id.replace(/^song-/, "")).join(",");
    const done = () => flash("Progress link copied. Open it on another device, or send it to me.");
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt("Copy this link:", url));
    else prompt("Copy this link:", url);
  });

  // ---------- wire up SVG + CSV ----------
  function makeHit(node, kind, key, label) {
    const g = document.createElementNS(NS, "g");
    if (node.hasAttribute("transform")) {
      g.setAttribute("transform", node.getAttribute("transform"));
      node.removeAttribute("transform");
    }
    node.replaceWith(g);
    g.append(node);
    if (kind === "song") {
      const b = node.getBBox();
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", b.x + b.width / 2);
      c.setAttribute("cy", b.y + b.height / 2);
      c.setAttribute("r", Math.max(55, b.width));
      c.setAttribute("class", "halo");
      g.prepend(c);
    }
    const t = document.createElementNS(NS, "title");
    t.textContent = label;
    g.prepend(t);
    g.setAttribute("class", "hit " + kind);
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", label);
    return g;
  }

  function bind(g, id) {
    g.addEventListener("click", (e) => { e.stopPropagation(); select(id); });
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(id); }
    });
  }

  Promise.all([
    fetch("manual-map.svg").then((r) => { if (!r.ok) throw r; return r.text(); }),
    fetch("songs.csv").then((r) => { if (!r.ok) throw r; return r.text(); }),
  ])
    .then(([svgText, csvText]) => {
      parseCSV(csvText).forEach((r) => {
        if (!r.song) return;
        const key = norm(r.song);
        const s = { kind: "song", id: "song-" + slug(key), key, name: titleCase(key), genre: norm(r.genre || ""), yt: youtube(r.url) };
        songs.push(s);
        byId[s.id] = s;
      });

      canvas.innerHTML = svgText;
      const svg = canvas.querySelector("svg");
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Map of Indian music genres between their source traditions");

      const stars = [];
      [...svg.querySelectorAll("*")].filter((n) => n.hasAttribute("affinity:id")).forEach((n) => {
        const m = n.getAttribute("affinity:id").match(/^\s*(song|genre|pole|folk)\s*-\s*(.+)$/i);
        if (!m) return;
        const kind = m[1].toLowerCase();
        const key = norm(m[2]);
        if (kind === "song") return stars.push({ n, key });
        const label = (D.notes[key] && D.notes[key].name) || titleCase(key);
        const id = kind + "-" + slug(key);
        byId[id] = { kind, key, g: makeHit(n, kind, key, label) };
        bind(byId[id].g, id);
      });

      // Match stars to CSV rows: exact name first, then the closest spelling (small typos).
      const unmatched = new Set(songs);
      const pending = [];
      stars.forEach((st) => {
        const s = songs.find((x) => x.key === st.key && unmatched.has(x));
        if (s) { unmatched.delete(s); st.song = s; } else pending.push(st);
      });
      pending.forEach((st) => {
        let best = null, bestD = Infinity;
        unmatched.forEach((s) => { const d = distance(st.key, s.key); if (d < bestD) { best = s; bestD = d; } });
        if (best && bestD <= 3) {
          unmatched.delete(best);
          st.song = best;
          console.warn('Star "' + st.key + '" matched to CSV row "' + best.key + '" (spelling differs).');
        } else {
          console.warn('Star "' + st.key + '" has no row in songs.csv.');
        }
      });
      stars.forEach((st) => {
        const s = st.song || { kind: "song", id: "song-" + slug(st.key), key: st.key, name: titleCase(st.key), genre: "", yt: null };
        if (!st.song) { songs.push(s); byId[s.id] = s; }
        s.g = makeHit(st.n, "song", s.key, s.name);
        if (heard.has(s.id)) s.g.classList.add("heard");
        bind(s.g, s.id);
      });
      unmatched.forEach((s) => console.warn('Song "' + s.key + '" in songs.csv has no star on the map.'));

      // Keep stars above everything else (top-level ones only; nested ones keep their parent's transform).
      svg.querySelectorAll(":scope > .hit.song").forEach((g) => svg.append(g));
      svg.addEventListener("click", () => select(null));

      // Restore progress from a shared link: #heard=slug1,slug2
      const hash = decodeURIComponent(location.hash.slice(1));
      if (hash.startsWith("heard=")) {
        let added = 0;
        hash.slice(6).split(",").filter(Boolean).forEach((sl) => {
          const id = "song-" + sl;
          if (byId[id] && !heard.has(id)) { heard.add(id); added++; }
        });
        save();
        songs.forEach((s) => s.g && s.g.classList.toggle("heard", heard.has(s.id)));
        history.replaceState(null, "", location.pathname + location.search);
        updateProgress();
        flash(added ? "Restored " + added + " heard songs from the link." : "Progress link opened. Nothing new to add.");
      } else {
        updateProgress();
        if (hash) select(hash, { quiet: true });
      }
    })
    .catch(() => {
      canvas.innerHTML =
        '<p class="error">Couldn\'t load <code>manual-map.svg</code> or <code>songs.csv</code>. If you opened this file directly, ' +
        "serve the folder instead: <code>python -m http.server 8000</code>, then open http://localhost:8000.</p>";
    });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") select(null); });
})();
