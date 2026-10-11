// The field map. Coordinates (x, y) are copied from the FigJam sketch.
// The canvas is roughly 1840 × 1800 units; x grows rightwards, y downwards.
//
// kind: "pole"  – a source tradition (coloured circle)
//       "genre" – a genre living in the field (white pill)
//       "folk"  – a folk tradition inside the banana (pink oval)
//
// video: { id: "YouTube id", title: "...", artist: "...", start: seconds }
// The descriptions are DRAFTS – rewrite them in your own voice.

window.MUSIC_FIELD = {
  title: "A Map of Indian Music",
  intro:
    "Indian music isn't a list of boxes. It's a field pulled between a few great source traditions. The coloured circles are those sources. Every genre sits where those pulls place it, and its position shows what it is made of. Click anything to read about it and hear an example.",
  viewBox: [50, 50, 1840, 1800],

  film: {
    id: "film",
    name: "Film Music",
    x: 368, y: 651, w: 870, h: 944, r: 110,
    label: [802, 1124],
    desc:
      "Not a pole but a melting pot. For most Indians, 'music' means film songs, and film music borrows from every genre it overlaps: bhajan, ghazal, thumri, qawwali, folk, and more and more from the West.",
  },

  folk: {
    id: "folk",
    name: "Folk",
    label: [226, 1407],
    desc:
      "The oldest and widest layer. Every region, language and community has its own songs for harvest, worship, work, weddings and mourning. Folk wraps around the field because it feeds almost everything, from the Punjabi end near gurbani to the Awadhi and Bhojpuri end where it turns into light classical.",
    outline: [
      [215, 722], [290, 735], [345, 785], [358, 840], [358, 905], [372, 985], [392, 1045],
      [422, 1100], [452, 1165], [480, 1220], [522, 1285], [575, 1352], [625, 1415],
      [700, 1480], [800, 1525], [900, 1545], [1000, 1570], [1100, 1583], [1185, 1583],
      [1225, 1620], [1222, 1690], [1195, 1732], [1130, 1770], [1040, 1803], [965, 1803],
      [880, 1782], [790, 1768], [660, 1750], [520, 1724], [385, 1690], [310, 1645],
      [262, 1600], [218, 1515], [192, 1440], [178, 1360], [166, 1280], [152, 1205],
      [130, 1135], [110, 1065], [92, 1000], [77, 930], [80, 860], [100, 795], [135, 745],
    ],
  },

  nodes: [
    // ---- Poles ----
    {
      id: "hindustani", kind: "pole", name: "Hindustani", sub: "North Indian",
      x: 1358, y: 1662, color: "#ff9f43", stroke: "#e67710", ink: "#3a2005",
      desc:
        "The classical music of the North, built on raga (melodic framework) and tala (rhythmic cycle). It was shaped by centuries of exchange with Persian court music. A performance unfolds slowly: an unmetered exploration of the raga, then faster and faster composed sections over tabla.",
    },
    {
      id: "carnatic", kind: "pole", name: "Carnatic", sub: "South Indian",
      x: 1600, y: 1514, color: "#fde0c5", stroke: "#f7a24a", ink: "#3a2005",
      desc:
        "The classical music of the South. It is centred on a large repertoire of devotional compositions (kritis), especially those of Tyagaraja, Dikshitar and Syama Sastri, and is recognisable by its gamakas, the oscillating ornaments on almost every note.",
    },
    {
      id: "persian", kind: "pole", name: "Persian",
      x: 1348, y: 420, color: "#3aabff", stroke: "#0a7ad6", ink: "#ffffff",
      desc:
        "Arrived with the Delhi Sultanate and the Mughal courts (13th–18th c.). The rulers were often Turkic or Central Asian, but the language of high culture was Persian. It brought Persian poetry, Sufi practice, new instruments and an aesthetic of ornament and longing.",
    },
    {
      id: "western", kind: "pole", name: "Western",
      x: 477, y: 220, color: "#f74bc0", stroke: "#b6278a", ink: "#ffffff",
      desc:
        "Came with colonial rule and later global media. The harmonium (now everywhere in Indian music), the violin, brass bands, and then jazz, rock and electronic music. Its pull is strongest on film music.",
    },

    // ---- Genres ----
    {
      id: "qawwali", kind: "genre", name: "Qawwali", native: "قوّالی",
      x: 1348, y: 601,
      desc:
        "Sufi devotional music of the Chishti order, traced to Amir Khusrau (13th c.). A lead singer, a chorus, handclaps, harmonium and tabla build ecstatic repetition.",
    },
    {
      id: "ghazal", kind: "genre", name: "Ghazal", native: "غزل",
      x: 1238, y: 801,
      desc:
        "A Persian-Arabic poetic form that flowered in Urdu (Mir, Ghalib, Faiz). Sung ghazal ranges from classical-leaning to the soft, accessible style of the 1980s. The couplet matters more than the voice.",
    },
    {
      id: "tawaif", kind: "genre", name: "Tawaif songs", native: "तवायफ़",
      x: 1238, y: 881,
      desc:
        "The courtesan-musicians of North Indian courts and salons. Through the 19th century they were the main keepers of thumri, dadra and ghazal and of much of khayal. Gauhar Jaan made some of India's first gramophone records in 1902. After social reformers stigmatised them, their repertoire passed into film and the concert hall, often without credit.",
    },
    {
      id: "gurbani", kind: "genre", name: "Gurbani", native: "ਗੁਰਬਾਣੀ",
      x: 557, y: 1134,
      desc:
        "Sikh sacred music: hymns from the Guru Granth Sahib sung in prescribed ragas, traditionally with harmonium, tabla and string instruments such as the rabab and the dilruba.",
    },
    {
      id: "thumri", kind: "genre", name: "Thumri", native: "ठुमरी",
      x: 1144, y: 1274,
      desc:
        "Romantic, devotional light classical song from Lucknow and Banaras. Raga rules are loosened for emotional expression: one line is turned over and over to draw out every shade of its meaning.",
    },
    {
      id: "khayal", kind: "genre", name: "Khayal", native: "ख़याल",
      x: 1364, y: 1398,
      desc:
        "The dominant Hindustani vocal form today. It is more ornate and flexible than dhrupad and is built from a slow (vilambit) and a fast (drut) composition, with taans, which are rapid melodic runs.",
    },
    {
      id: "dhrupad", kind: "genre", name: "Dhrupad / Dhammar", native: "ध्रुपद",
      x: 1300, y: 1502,
      desc:
        "The oldest surviving Hindustani vocal form: austere and meditative, accompanied by the pakhawaj barrel drum. A long syllabic alap comes before the composition. Dhammar is its sibling, set in the 14-beat dhamar tala and often about Holi.",
    },
    {
      id: "abhang", kind: "genre", name: "Abhang", native: "अभंग",
      x: 737, y: 1474,
      desc:
        "Marathi devotional poetry of the Varkari saints (Tukaram, Namdev, Jnaneshwar), sung on the pilgrimage to Pandharpur.",
    },
    {
      id: "bhajan", kind: "genre", name: "Bhajan", native: "भजन",
      x: 969, y: 1498,
      desc:
        "Hindu devotional songs, from the medieval Bhakti poets (Mirabai, Kabir, Surdas, Tulsidas) to simple songs sung together in temples and homes.",
    },

    // ---- Folk ----
    {
      id: "bihu", kind: "folk", name: "Bihu", native: "বিহু", x: 257, y: 935,
      desc: "Assamese spring-festival music: pepa (buffalo-horn pipe), dhol, and songs of love and the new year.",
    },
    {
      id: "baul", kind: "folk", name: "Baul / Bhatiali", native: "বাউল", x: 277, y: 1064,
      desc:
        "Bengal. The Bauls are wandering mystic minstrels with a one-string ektara. Bhatiali are the long, flowing songs of the river boatmen.",
    },
    {
      id: "bhangra", kind: "folk", name: "Bhangra / Lori / Boliyan", native: "ਭੰਗੜਾ", x: 317, y: 1193,
      desc:
        "Punjab: harvest dance driven by the dhol, festival songs, and boliyan, the witty call-and-response couplets.",
    },
    {
      id: "manganiyar", kind: "folk", name: "Manganiyar / Langa", x: 397, y: 1313,
      desc:
        "Hereditary Muslim musician communities of the Thar desert who traditionally sang for Hindu patrons. They play the kamaicha and sarangi fiddles and khartal castanets, and they sing with huge voices.",
    },
    {
      id: "garba", kind: "folk", name: "Garba, Dandiya", native: "ગરબા", x: 497, y: 1433,
      desc: "Gujarati circle dances for the goddess during Navratri, nine nights of dancing.",
    },
    {
      id: "koli", kind: "folk", name: "Koli", native: "कोळी", x: 637, y: 1575,
      desc: "Songs of the fishing communities of Mumbai and the Konkan coast: about the sea, boats and their boatmen.",
    },
    {
      id: "gondhal", kind: "folk", name: "Gondhal", native: "गोंधळ", x: 657, y: 1654,
      desc:
        "A Marathi all-night ritual performance for the goddess (Bhavani, Renuka), with the sambal drum and the one-string tuntune.",
    },
    {
      id: "lavani", kind: "folk", name: "Lavani", native: "लावणी", x: 837, y: 1615,
      desc: "Fast, bold, theatrical Maharashtrian song-dance driven by the dholki drum, with a sharp wit.",
    },
    {
      id: "dadra", kind: "folk", name: "Dadra", native: "दादरा", x: 1097, y: 1646,
      desc:
        "Both a 6-beat tala and a lilting song form named after it. Dadra began as folk and was refined by the tawaifs into a close cousin of thumri.",
    },
    {
      id: "kajri", kind: "folk", name: "Kajri / Chaiti", native: "कजरी", x: 1057, y: 1722,
      desc:
        "Seasonal songs of UP and Bihar: kajri for the monsoon and chaiti for the spring month of Chaitra. Singers from Banaras such as Girija Devi and Siddheshwari Devi brought them into the classical concert.",
    },
  ],
};
