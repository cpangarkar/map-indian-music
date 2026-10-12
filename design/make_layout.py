"""Build a layout + colour proposal from `genres on poles.csv`, and place the song stars.

Layout: Hindustani sits near the top centre (every genre is at least 20% Hindustani),
Persian, Western and Carnatic are directions around the rim, and Folk is a sector of an
annulus below, split into regional wedges: Marathi at the Carnatic end, Punjabi at the
Persian end. A genre moves from the centre towards each pole in proportion to its share:

    position = centre + k * sum(share[p] * direction[p])

The ring between the genre cluster and the folk band is left empty: that white space is
film and popular music (the paper layer is named "genre - film music", so it's clickable).

Colour: pole pigments are mixed subtractively, the way watercolour mixes:
a weighted geometric mean of the pigments' (linear) reflectance per channel.

Stars: non-film songs sit inside their genre / folk wedge; film songs sit in the white
space just outside it (folk ones in the gap above their wedge).

Writes, next to this script:
    layout-proposal.svg      labelled, for review / to open in Affinity (stars as a layer)
    midjourney-template.svg  same composition, no text, no stars, for Midjourney
    poles-only.svg           base for drawing in Affinity: small poles, folk wedges, guides, stars
    stars.svg                the stars layer on its own
    genre-colors.csv         positions and hex colours

Run:  python design/make_layout.py
"""
import csv
import math
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
SRC = os.path.join(ROOT, "genres on poles.csv")

W, H = 5100, 3300
CX, CY = W / 2, 1400         # Hindustani; raised to leave room for folk at the bottom
RX, RY = 2050, 1120          # rim ellipse where the outer poles sit
FILL = 0.80                  # furthest genre reaches this fraction of the rim
# Distance curve: (share-distance, drawn-distance), both as fractions of the furthest genre.
# Monotonic, so the order of distances from Hindustani is kept. It squeezes the empty ring
# around Dhrupad and the far edge, and roughly doubles spacing in the middle band where most
# genres (the devotional cluster especially) sit.
CURVE = [(0.0, 0.0), (0.30, 0.18), (0.67, 0.86), (1.0, 1.0)]

# Folk band: an elliptical annulus sector centred on Hindustani, running from the Carnatic
# end (FOLK_FROM) clockwise to the Persian end (FOLK_TO). Radii are vertical px; KX widens it.
FOLK_FROM, FOLK_TO = 302, 212          # 90 degrees; Lavani end fixed
FOLK_IN, FOLK_OUT, KX = 1150, 1680, 1.42
FOLK_GAP = 1.6               # degrees between regions
FOLK = [  # carnatic end -> persian end
    ("Maharashtra", ["Lavani", "Gondhal", "Koli"]),
    ("Gujarat", ["Garba", "Dandiya"]),
    ("Rajasthan", ["Manganiyar", "Langa"]),
    ("Uttar Pradesh &amp; Bihar", ["Kajri", "Chaiti", "Dadra"]),
    ("Bengal", ["Bhatiyali", "Baul"]),
    ("Punjab", ["Bhangra", "Boliyan", "Lori"]),
]
TINT = 0.25                  # how much Carnatic / Persian tints the two ends of the folk band

# Pole directions (degrees, 0 = right, 90 = up). Folk points at the middle of its band.
ANGLE = {"persian": 140, "western": 20, "carnatic": 330, "folk": (FOLK_FROM + FOLK_TO) / 2}

# Watercolour pigments for the poles
POLES = {
    "hindustani": ("Hindustani", "#E2571E", "pyrrole orange"),
    "folk":       ("Folk", "#F2A900", "Indian yellow"),
    "carnatic":   ("Carnatic", "#C79A2E", "yellow ochre / quinacridone gold"),
    "western":    ("Western", "#5B2D84", "dioxazine violet"),
    "persian":    ("Persian", "#1E5B45", "hooker's green deep"),
}
ORDER = ["hindustani", "folk", "carnatic", "persian", "western"]

PRETTY = {"qawaali": "Qawwali", "natyasangeet": "Natya Sangeet", "bhavgeet": "Bhavgeet",
          "indian rock": "Indian Rock"}

STAR, STAR_COLOR = 30, "#6b1fff"
PAPER = "#FBF8F2"
A_NS = 'xmlns:affinity="https://www.affinity.studio/"'


# ---------- colour ----------
def to_lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def to_srgb(c):
    c = 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
    return max(0, min(255, round(c * 255)))


def hex_rgb(h):
    return [int(h[i:i + 2], 16) for i in (1, 3, 5)]


def mix(weights):
    """Subtractive (watercolour-like) mix: weighted geometric mean of reflectance."""
    total = sum(weights.values())
    out = []
    for ch in range(3):
        acc = 0.0
        for p, w in weights.items():
            if w:
                acc += (w / total) * math.log(max(to_lin(hex_rgb(POLES[p][1])[ch]), 1e-4))
        out.append(to_srgb(math.exp(acc)))
    return "#%02X%02X%02X" % tuple(out)


def stretch(t):
    for (a, fa), (b, fb) in zip(CURVE, CURVE[1:]):
        if t <= b:
            return fa + (fb - fa) * (t - a) / (b - a)
    return CURVE[-1][1]


def squash(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


# ---------- geometry ----------
def band(theta, s):
    """Point on the folk band's ellipse family: angle in degrees, s = vertical radius in px."""
    t = math.radians(theta)
    return CX + s * KX * math.cos(t), CY - s * math.sin(t)


def wedge_path(a0, a1, s0=FOLK_IN, s1=FOLK_OUT):
    """Closed path for the annulus piece between angles a0 > a1 (clockwise) and radii s0 < s1."""
    p = [band(a0, s0), band(a0, s1), band(a1, s1), band(a1, s0)]
    big = 1 if abs(a0 - a1) > 180 else 0
    return (f"M{p[0][0]:.0f},{p[0][1]:.0f} L{p[1][0]:.0f},{p[1][1]:.0f} "
            f"A{s1 * KX:.0f},{s1:.0f} 0 {big} 1 {p[2][0]:.0f},{p[2][1]:.0f} "
            f"L{p[3][0]:.0f},{p[3][1]:.0f} A{s0 * KX:.0f},{s0:.0f} 0 {big} 0 {p[0][0]:.0f},{p[0][1]:.0f} Z")


def radial_rotation(theta):
    """Screen rotation (degrees) for text running along the band's radius, kept upright-ish."""
    t = math.radians(theta)
    rot = math.degrees(math.atan2(-math.sin(t), KX * math.cos(t)))
    return rot + 180 if rot > 90 else rot - 180 if rot < -90 else rot


def build_folk():
    """Regions and traditions with their angle ranges and colours."""
    n = sum(len(t) for _, t in FOLK)
    span = FOLK_FROM - FOLK_TO - FOLK_GAP * (len(FOLK) - 1)
    step = span / n
    regions, trads, a = [], [], FOLK_FROM
    for region, names in FOLK:
        a_start = a
        for name in names:
            mid = a - step / 2
            f = (FOLK_FROM - mid) / (FOLK_FROM - FOLK_TO)        # 0 at carnatic end, 1 at persian end
            share = {"folk": 1 - TINT, "carnatic": TINT * (1 - f), "persian": TINT * f}
            x, y = band(mid, (FOLK_IN + FOLK_OUT) / 2)
            trads.append({"key": name.lower(), "name": name, "region": region, "a0": a, "a1": a - step,
                          "mid": mid, "x": x, "y": y, "share": share, "color": mix(share)})
            a -= step
        regions.append({"name": region, "a0": a_start, "a1": a, "mid": (a_start + a) / 2})
        a -= FOLK_GAP
    return regions, trads


def build_genres():
    rows = list(csv.DictReader(open(SRC, encoding="utf-8")))
    genres = []
    for r in rows:
        share = {p: float(r[p] or 0) for p in ORDER}
        total = sum(share.values()) or 1
        share = {p: v / total for p, v in share.items()}
        dx = sum(share[p] * math.cos(math.radians(a)) for p, a in ANGLE.items())
        dy = sum(share[p] * math.sin(math.radians(a)) for p, a in ANGLE.items())
        genres.append({"key": r["genre"], "name": PRETTY.get(r["genre"], r["genre"].title()),
                       "share": share, "d": (dx, dy), "color": mix(share)})
    reach = max(math.hypot(*g["d"]) for g in genres) or 1
    for g in genres:
        r = math.hypot(*g["d"])
        f = FILL * stretch(r / reach) / r if r else 0
        g["x"] = CX + f * g["d"][0] * RX
        g["y"] = CY - f * g["d"][1] * RY
    return genres


def build_poles():
    poles = {"hindustani": (CX, CY), "folk": band(ANGLE["folk"], (FOLK_IN + FOLK_OUT) / 2)}
    for p in ("persian", "western", "carnatic"):
        a = math.radians(ANGLE[p])
        poles[p] = (CX + RX * math.cos(a), CY - RY * math.sin(a))
    return poles


# ---------- stars ----------
def place_stars(genres, trads, poles):
    """Return [(x, y, name, home)] for every star in ../manual-map.svg."""
    svg_text = open(os.path.join(ROOT, "manual-map.svg"), encoding="utf-8").read()
    names = [m.strip().lower() for m in re.findall(r'affinity:id="song\s*-\s*([^"]+)"', svg_text)]
    tags = {}
    with open(os.path.join(ROOT, "songs.csv"), encoding="utf-8") as f:
        for r in list(csv.reader(f))[1:]:
            if r and r[0].strip():
                tags[r[0].strip().lower()] = [squash(t) for t in (r[1] if len(r) > 1 else "").split("-") if t.strip()]

    gmap = {squash(g["key"]): g for g in genres}
    gmap.update({squash(g["name"]): g for g in genres})
    tmap = {squash(t["key"]): t for t in trads}
    poles_xy = {p: poles[p] for p in ("western", "persian", "carnatic")}

    # group songs by (home, film?)
    groups, unplaced = {}, []
    for n in names:
        t = tags.get(n, [])
        film = "film" in t
        home = next((x for x in t if x != "film" and (x in gmap or x in tmap or x in poles_xy)), None)
        if home:
            groups.setdefault((home, film), []).append(n)
        else:
            unplaced.append(n)

    others = [(g["x"], g["y"]) for g in genres]
    out = []
    for (home, film), songs in groups.items():
        k = len(songs)
        if home in tmap:
            t = tmap[home]
            if film:   # in the white gap just above the wedge, stepping inwards
                pts = [band(t["mid"], FOLK_IN - 110 - 105 * i) for i in range(k)]
            else:      # inside the wedge, near its inner edge (the label sits in the outer part)
                pts = [band(t["mid"], FOLK_IN + 90 + 100 * i) for i in range(k)]
        elif home in poles_xy:  # e.g. film-western: three quarters of the way out to that pole
            px, py = poles_xy[home]
            bx, by = CX + 0.75 * (px - CX), CY + 0.75 * (py - CY)
            pts = [(bx + 90 * (i - (k - 1) / 2), by) for i in range(k)]
        else:
            g = gmap[home]
            if film:   # outside the genre blob, on the emptiest side (favouring away from centre)
                out_a = math.atan2(g["y"] - CY, g["x"] - CX) if (g["x"], g["y"]) != (CX, CY) else math.pi / 2
                best, best_score = None, -1e9
                for deg in range(0, 360, 10):
                    a = math.radians(deg)
                    cx_, cy_ = g["x"] + 340 * math.cos(a), g["y"] + 340 * math.sin(a)
                    clear = min(math.hypot(cx_ - ox, cy_ - oy) for ox, oy in others)
                    score = min(clear, 420) - 120 * (1 - math.cos(a - out_a))
                    if score > best_score:
                        best, best_score = a, score
                pts = []
                for i in range(k):
                    a = best + (i - (k - 1) / 2) * 0.32
                    pts.append((g["x"] + 340 * math.cos(a), g["y"] + 340 * math.sin(a)))
            else:      # inside the blob, in a row under the label
                pts = [(g["x"] + 80 * (i - (k - 1) / 2), g["y"] + 95) for i in range(k)]
        out += [(x, y, n, ("film-" if film else "") + home) for (x, y), n in zip(pts, songs)]
    return out, unplaced


def star_svg(x, y, name):
    pts = []
    for i in range(10):
        r = STAR if i % 2 == 0 else STAR * 0.42
        a = math.radians(-90 + 36 * i)
        pts.append(f"{x + r * math.cos(a):.1f},{y + r * math.sin(a):.1f}")
    sid = "song-" + re.sub(r"[^a-z0-9]+", "-", name)
    return f'<polygon id="{sid}" affinity:id="song - {name}" points="{" ".join(pts)}" fill="{STAR_COLOR}"/>'


def stars_group(stars):
    return ['<g id="stars" affinity:id="stars">'] + [star_svg(x, y, n) for x, y, n, _ in stars] + ["</g>"]


# ---------- SVG pieces ----------
def group(name):
    return f'<g id="{re.sub(r"[^a-z0-9]+", "-", name.lower())}" affinity:id="{name}">'


def paper():
    # Named so the site makes the white space clickable: it opens the Film Music panel.
    return [group("paper"), f'<rect id="film-music" affinity:id="genre - film music" width="{W}" height="{H}" fill="{PAPER}"/>', "</g>"]


def pole_gradients(prefix):
    o = []
    for p in ORDER:
        c = POLES[p][1]
        o.append(f'<radialGradient id="{prefix}{p}"><stop offset="0" stop-color="{c}" stop-opacity="0.9"/>'
                 f'<stop offset="0.55" stop-color="{c}" stop-opacity="0.45"/>'
                 f'<stop offset="1" stop-color="{c}" stop-opacity="0"/></radialGradient>')
    return o


def folk_wedges(trads, opacity, named=True):
    o = []
    for t in trads:
        attrs = f' id="folk-{t["key"]}" affinity:id="folk - {t["name"]}"' if named else ""
        o.append(f'<path{attrs} d="{wedge_path(t["a0"], t["a1"])}" fill="{t["color"]}" fill-opacity="{opacity}"/>')
    return o


def folk_labels(regions, trads, size=46):
    o = []
    for t in trads:
        x, y = band(t["mid"], FOLK_OUT - 170)
        o.append(f'<text x="{x:.0f}" y="{y:.0f}" text-anchor="middle" dominant-baseline="middle" '
                 f'transform="rotate({radial_rotation(t["mid"]):.1f} {x:.0f} {y:.0f})" '
                 f'style="font-family:Arial,sans-serif;font-size:{size}px;fill:#1d1813">{t["name"]}</text>')
    for r in regions:
        x, y = band(r["mid"], FOLK_OUT + 70)
        if y > H - 30:
            y = H - 30
        o.append(f'<text x="{x:.0f}" y="{y:.0f}" text-anchor="middle" style="font-family:Georgia,serif;'
                 f'font-size:44px;font-style:italic;fill:#6e645a">{r["name"]}</text>')
    return o


def pole_labels(poles):
    o = []
    for p in ORDER:
        x, y = poles[p]
        dy = -330 if p == "hindustani" else 0
        if p == "folk":
            x, y = band(ANGLE["folk"], FOLK_IN - 60)
        o.append(f'<text x="{x:.0f}" y="{y + dy:.0f}" text-anchor="middle" style="font-family:Georgia,serif;'
                 f'font-size:96px;font-weight:bold;fill:#2a2420;opacity:0.85">{POLES[p][0]}</text>')
    return o


def svg(genres, poles, regions, trads, stars, labelled):
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" {A_NS} viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
    o.append("<defs>")
    o += pole_gradients("pole-")
    o.append('<filter id="bleed" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="28"/></filter>')
    for i, g in enumerate(genres):
        o.append(f'<radialGradient id="g{i}"><stop offset="0" stop-color="{g["color"]}" stop-opacity="0.95"/>'
                 f'<stop offset="0.6" stop-color="{g["color"]}" stop-opacity="0.6"/>'
                 f'<stop offset="1" stop-color="{g["color"]}" stop-opacity="0"/></radialGradient>')
        for p, v in g["share"].items():
            if v and p != "hindustani":
                x1, y1 = poles[p]
                o.append(f'<linearGradient id="s{i}{p}" gradientUnits="userSpaceOnUse" x1="{x1:.0f}" y1="{y1:.0f}" '
                         f'x2="{g["x"]:.0f}" y2="{g["y"]:.0f}"><stop offset="0" stop-color="{POLES[p][1]}" stop-opacity="0.05"/>'
                         f'<stop offset="1" stop-color="{g["color"]}" stop-opacity="0.28"/></linearGradient>')
    o.append("</defs>")
    o += paper()
    o.append('<g style="mix-blend-mode:multiply">')
    for p in ORDER:
        if p == "folk":
            continue
        x, y = poles[p]
        r = 760 if p == "hindustani" else 560
        o.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="url(#pole-{p})"/>')
    o.append('<g filter="url(#bleed)">')
    o += folk_wedges(trads, 0.7, named=False)
    o.append("</g>")
    # streams of pigment running from each pole into the genres that borrow from it
    for i, g in enumerate(genres):
        for p, v in g["share"].items():
            if v and p != "hindustani":
                x1, y1 = poles[p]
                if p == "folk":
                    x1, y1 = band(ANGLE["folk"], FOLK_IN)
                o.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{g["x"]:.0f}" y2="{g["y"]:.0f}" '
                         f'stroke="url(#s{i}{p})" stroke-width="{24 + 120 * v:.0f}" stroke-linecap="round"/>')
    for i, g in enumerate(genres):
        o.append(f'<circle cx="{g["x"]:.0f}" cy="{g["y"]:.0f}" r="250" fill="url(#g{i})"/>')
    o.append("</g>")
    if labelled:
        o.append(group("labels"))
        o += pole_labels(poles)
        for g in genres:
            o.append(f'<text x="{g["x"]:.0f}" y="{g["y"] + 22:.0f}" text-anchor="middle" '
                     f'style="font-family:Arial,sans-serif;font-size:62px;fill:#1d1813">{g["name"]}</text>')
        o += folk_labels(regions, trads)
        o.append("</g>")
        o += stars_group(stars)
    o.append("</svg>")
    return "\n".join(o)


def poles_only_svg(genres, poles, regions, trads, stars):
    """Base for drawing in Affinity: small pole pools, the folk wedges (each a clickable
    'folk - X' layer), labels, a hideable guide layer and the stars layer."""
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" {A_NS} viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
    o.append("<defs>")
    o += pole_gradients("grad-")
    o.append("</defs>")
    o += paper()
    o.append(group("poles"))
    for p in ORDER:
        if p == "folk":
            continue
        x, y = poles[p]
        r = 380 if p == "hindustani" else 280
        o.append(f'<circle id="pole-{p}" affinity:id="pole - {p}" cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="url(#grad-{p})"/>')
    o.append("</g>")
    o.append(group("folk"))
    o += folk_wedges(trads, 0.55)
    o.append("</g>")
    o.append(group("pole labels"))
    o += pole_labels(poles)
    o += folk_labels(regions, trads, size=40)
    o.append("</g>")
    o.append(group("genre guides (hide or delete)"))
    for g in genres:
        x, y = g["x"], g["y"]
        o.append(f'<g id="guide-{g["key"].replace(" ", "-")}" affinity:id="guide - {g["name"]}">'
                 f'<circle cx="{x:.0f}" cy="{y:.0f}" r="34" fill="{g["color"]}" stroke="#ffffff" stroke-width="6"/>'
                 f'<line x1="{x - 70:.0f}" y1="{y:.0f}" x2="{x + 70:.0f}" y2="{y:.0f}" stroke="#2a2420" stroke-width="3"/>'
                 f'<line x1="{x:.0f}" y1="{y - 70:.0f}" x2="{x:.0f}" y2="{y + 70:.0f}" stroke="#2a2420" stroke-width="3"/>'
                 f'<text x="{x + 50:.0f}" y="{y - 45:.0f}" style="font-family:Arial,sans-serif;font-size:54px;fill:#2a2420">'
                 f'{g["name"]} <tspan style="fill:#6e645a;font-size:40px">{g["color"]}</tspan></text></g>')
    o.append("</g>")
    o += stars_group(stars)
    o.append("</svg>")
    return "\n".join(o)


def main():
    genres = build_genres()
    regions, trads = build_folk()
    poles = build_poles()
    stars, unplaced = place_stars(genres, trads, poles)

    with open(os.path.join(HERE, "genre-colors.csv"), "w", newline="", encoding="utf-8") as f:
        wr = csv.writer(f)
        wr.writerow(["name", "kind", "x", "y", "hex", "pigment / mix"])
        for p in ORDER:
            wr.writerow([POLES[p][0], "pole", round(poles[p][0]), round(poles[p][1]), POLES[p][1], POLES[p][2]])
        for g in genres:
            recipe = " + ".join(f"{round(v * 100)}% {POLES[p][0]}" for p, v in g["share"].items() if v)
            wr.writerow([g["name"], "genre", round(g["x"]), round(g["y"]), g["color"], recipe])
        for t in trads:
            recipe = " + ".join(f"{round(v * 100)}% {POLES[p][0]}" for p, v in t["share"].items() if v > 0.005)
            wr.writerow([t["name"], "folk (" + t["region"].replace("&amp;", "&") + ")", round(t["x"]), round(t["y"]), t["color"], recipe])

    for labelled, fname in ((True, "layout-proposal.svg"), (False, "midjourney-template.svg")):
        with open(os.path.join(HERE, fname), "w", encoding="utf-8") as f:
            f.write(svg(genres, poles, regions, trads, stars, labelled))
    with open(os.path.join(HERE, "poles-only.svg"), "w", encoding="utf-8") as f:
        f.write(poles_only_svg(genres, poles, regions, trads, stars))
    with open(os.path.join(HERE, "stars.svg"), "w", encoding="utf-8") as f:
        f.write("\n".join([f'<svg xmlns="http://www.w3.org/2000/svg" {A_NS} viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
                          + stars_group(stars) + ["</svg>"]))

    print("wrote layout-proposal.svg, midjourney-template.svg, poles-only.svg, stars.svg, genre-colors.csv")
    print(f"placed {len(stars)} stars" + (f"; no home on the map for: {', '.join(unplaced)}" if unplaced else ""))
    for x, y, n, home in sorted(stars, key=lambda s: s[3]):
        print(f"  {home:22s} {n}")


if __name__ == "__main__":
    main()
