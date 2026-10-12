// Content for the map drawn in Affinity (manual-map.svg).
//
// Songs live in songs.csv (columns: song, genre, url). Export the spreadsheet over that file.
//
// The page finds layers in the SVG whose names follow "<kind> - <name>":
//   song - jo tum todo piya      -> looked up in songs.csv by the song column
//   genre - Bhajan               -> looked up in `notes` below
//   pole - Persian               -> looked up in `notes` below
//   folk - Lavani                -> looked up in `notes` below
// Matching ignores capital letters and extra spaces, so the keys here are lower case.

window.MAP_DATA = {
  title: "A Map of Indian Music",
  intro:
    "Indian music isn't a list of boxes. It's a field pulled between a few great source traditions: Hindustani, Carnatic, Folk, Persian and Western. Every genre sits where those pulls place it. Each star is a song I've chosen. Click one to hear it.",

  // Text labels on the map with these names are clickable even when their layer isn't named.
  poles: ["hindustani", "carnatic", "persian", "western", "folk"],
  folk: ["Lavani", "Gondhal", "Koli", "Garba", "Dandiya", "Manganiyar", "Langa", "Kajri", "Chaiti",
    "Dadra", "Bhatiyali", "Baul", "Bhangra", "Boliyan", "Lori"],

  // Descriptions for named shapes (DRAFTS – rewrite in your own voice).
  notes: {
    hindustani: {
      name: "Hindustani Classical",
      desc: "The classical music of the North, built on raga (melodic framework) and tala (rhythmic cycle). It was shaped by centuries of exchange with Persian court music. A performance unfolds slowly: an unmetered exploration of the raga, then faster and faster composed sections over tabla.",
    },
    carnatic: {
      name: "Carnatic Classical",
      desc: "The classical music of the South. It is centred on a large repertoire of devotional compositions (kritis), especially those of Tyagaraja, Dikshitar and Syama Sastri, and is recognisable by its gamakas, the oscillating ornaments on almost every note.",
    },
    persian: {
      name: "Persian",
      desc: "Arrived with the Delhi Sultanate and the Mughal courts (13th–18th c.). The rulers were often Turkic or Central Asian, but the language of high culture was Persian. It brought Persian poetry, Sufi practice, new instruments and an aesthetic of ornament and longing. Arabic influence mostly arrived through Persian too.",
    },
    western: {
      name: "Western",
      desc: "Came with colonial rule and later global media. The harmonium (now everywhere in Indian music), the violin, brass bands, and then jazz, rock and electronic music. Its pull is strongest on film music.",
    },
    folk: {
      name: "Folk Traditions of India",
      desc: "The oldest and widest layer. Every region, language and community has its own songs for harvest, worship, work, weddings and mourning, and folk feeds almost everything else on this map.",
    },
    "film music": {
      name: "Film Music",
      desc: "Not a pole but a melting pot. For most Indians, 'music' means film songs, and film music borrows from every genre it overlaps: bhajan, ghazal, thumri, qawwali, folk, and more and more from the West.",
    },
    bhajan: {
      name: "Bhajan",
      desc: "Hindu devotional songs, from the medieval Bhakti poets (Mirabai, Kabir, Surdas, Tulsidas) to simple songs sung together in temples and homes.",
    },
    bhavgeet: {
      name: "Bhavageet",
      desc: "Marathi 'songs of feeling': lyric poetry set to light, melodic music, made popular through radio and records in the 20th century.",
    },
    natyasangeet: {
      name: "Natya Sangeet",
      desc: "Songs of Marathi musical theatre, which flourished from the late 19th century. They are classical at the core, built on ragas and sung by stars like Bal Gandharva, but short and dramatic. The form carried classical music to ordinary audiences long before film did.",
    },
    sufi: {
      name: "Sufi",
      desc: "Mystical Islam set to music: qawwali, kafi, and the poetry of Bulleh Shah, Shah Hussain, Rumi and Kabir. Today 'Sufi' is also a popular style in itself, heard in film songs and rock.",
    },
    "indian rock": {
      name: "Indian Rock",
      desc: "Rock bands from the subcontinent that bring in Sufi poetry, folk melody and Indian instruments: Indian Ocean in Delhi, Thaikkudam Bridge in Kerala, and Junoon across the border in Pakistan.",
    },
    abhang: {
      name: "Abhang",
      desc: "Marathi devotional poetry of the Varkari saints (Tukaram, Namdev, Jnaneshwar), sung on the pilgrimage to Pandharpur.",
    },
    thumri: {
      name: "Thumri",
      desc: "Romantic, devotional light classical song from Lucknow and Banaras. Raga rules are loosened for emotional expression: one line is turned over and over to draw out every shade of its meaning.",
    },
    tawaif: {
      name: "Tawaif songs",
      desc: "The courtesan-musicians of North Indian courts and salons. Through the 19th century they were the main keepers of thumri, dadra and ghazal and of much of khayal. After social reformers stigmatised them, their repertoire passed into film and the concert hall, often without credit.",
    },
    ghazal: {
      name: "Ghazal",
      desc: "A Persian-Arabic poetic form that flowered in Urdu (Mir, Ghalib, Faiz). Sung ghazal ranges from classical-leaning to the soft, accessible style of the 1980s. The couplet matters more than the voice.",
    },
    qawwali: {
      name: "Qawwali",
      desc: "Sufi devotional music of the Chishti order, traced to Amir Khusrau (13th c.). A lead singer, a chorus, handclaps, harmonium and tabla build ecstatic repetition.",
    },
    khayal: {
      name: "Khayal",
      desc: "The dominant Hindustani vocal form today. It is more ornate and flexible than dhrupad and is built from a slow (vilambit) and a fast (drut) composition, with taans, which are rapid melodic runs.",
    },
    dhrupad: {
      name: "Dhrupad",
      desc: "The oldest surviving Hindustani vocal form: austere and meditative, accompanied by the pakhawaj barrel drum. A long syllabic alap comes before the composition.",
    },
  },
};
