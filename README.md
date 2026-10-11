# A Map of Indian Music

A personal, opinionated map of Indian music. The source traditions (Hindustani, Carnatic, Folk, Persian, Western) are poles that create a field, and each genre sits where their pulls place it. Each star is a song: click it to hear it.

- [index.html](index.html): the map, drawn in Affinity (main page)
- [field.html](field.html) and [tree.html](tree.html): earlier versions

## How it works

The artwork is [manual-map.svg](manual-map.svg), exported from Affinity. The page loads it as is and makes layers clickable based on their **layer names**:

| Layer name in Affinity      | What happens on click                         |
|-----------------------------|-----------------------------------------------|
| `song - jo tum todo piya`   | panel with the YouTube video from `songs.csv` |
| `genre - Bhajan`            | panel with the description from `notes`       |
| `pole - Persian`            | panel with the description from `notes`       |
| `folk - Lavani`             | panel with the description from `notes`       |

Capital letters and extra spaces don't matter. Genre/pole/folk names must match the keys in [map-data.js](map-data.js); song names must match the `song` column of [songs.csv](songs.csv) (small typos are matched anyway, with a warning in the browser console).

To update the drawing, re-export from Affinity over `manual-map.svg`. Nothing else needs to change.

## Adding a song

1. In Affinity, place a star and name its layer `song - <name>`, then export over `manual-map.svg`.
2. Add a row to the spreadsheet (`song, genre, url`) and export it over [songs.csv](songs.csv). The genre column can combine tags with `-`, e.g. `film-bhajan`. A genre's panel lists every song tagged with it.

The browser console reports stars without a CSV row, CSV rows without a star, and names matched despite a spelling difference.

## Listening progress

A song counts as heard after 60 seconds of playback (or half of a short song); its star turns gold. Listeners can also toggle it by hand. Progress is stored in the browser (`localStorage`), so it is per device. **Copy progress link** creates a `#heard=…` link that restores progress on another device, or tells you what someone has listened to.

## Previewing locally

The page loads the SVG over HTTP, so opening `index.html` directly won't work. Serve the folder:

```
python -m http.server 8000
```

Then open http://localhost:8000. You can link to one item, for example `http://localhost:8000/#song-jo-tum-todo-piya`.

## Publishing on GitHub Pages

Push this folder to a repo, then go to **Settings → Pages → Deploy from branch → `main` / root**.
