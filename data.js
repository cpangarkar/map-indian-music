// The whole map lives here. Edit freely: the page renders whatever tree you build.
//
// Each node:
//   name     – genre / sub-genre name (required)
//   native   – optional name in its own script, e.g. "ध्रुपद"
//   desc     – your description
//   video    – { id: "YouTube video id", title: "...", artist: "...", start: seconds }
//              The id is the part after "v=" in a YouTube URL. Leave video out until you pick one.
//   children – nested nodes
//
// The descriptions below are DRAFTS meant as a starting point – rewrite them in your own voice.

window.MUSIC_MAP = {
  title: "A Map of Indian Music",
  intro:
    "One song can't stand in for Indian music, so this is a map instead: the major branches, how they relate, and one recording for each that I think does it justice. Click a branch to open it, and click a thumbnail to play.",
  children: [
    {
      name: "Classical",
      desc:
        "Two great systems built on raga (melodic framework) and tala (rhythmic cycle). Both rely heavily on improvisation within strict grammar. They split roughly between North and South around the 13th–16th centuries.",
      children: [
        {
          name: "Hindustani",
          native: "हिंदुस्तानी",
          desc:
            "The North Indian tradition, shaped by centuries of exchange with Persian and Central Asian court music. Performances unfold slowly: an unmetered exploration of the raga, then gradually faster composed sections over tabla.",
          children: [
            {
              name: "Dhrupad",
              native: "ध्रुपद",
              desc:
                "The oldest surviving Hindustani vocal form: austere, meditative, accompanied by the pakhawaj barrel drum. A long syllabic alap (nom-tom) precedes the composition.",
            },
            {
              name: "Khayal",
              native: "ख़याल",
              desc:
                "The dominant vocal form today. More ornate and flexible than dhrupad, built from a slow (vilambit) and fast (drut) composition, with taans – rapid melodic runs.",
            },
            {
              name: "Thumri, Dadra & Tappa",
              desc:
                "'Light classical' forms: romantic and devotional texts, freer raga treatment, and an emphasis on emotional expression over grammar. Closely tied to the courtesan tradition of Lucknow and Banaras.",
            },
            {
              name: "Instrumental",
              desc:
                "Sitar, sarod, bansuri (bamboo flute), shehnai, santoor and others, usually following the alap–jor–jhala–gat arc. The tabla is both accompanist and soloist.",
            },
          ],
        },
        {
          name: "Carnatic",
          native: "கர்நாடக",
          desc:
            "The South Indian tradition. It is composition-centric, built on a vast repertoire of devotional songs (kritis), especially those of the 18th–19th century 'Trinity' – Tyagaraja, Dikshitar and Syama Sastri. Gamakas (oscillating ornaments) give it its distinctive sound.",
          children: [
            {
              name: "Kriti",
              desc:
                "The core song form: pallavi, anupallavi and charanam sections, often with improvised niraval (melodic variation on one line) and kalpana swaras (sung solfège).",
            },
            {
              name: "Ragam Tanam Pallavi",
              desc:
                "The showpiece of a concert and the most improvised part: free raga exploration, then rhythmic tanam, then a single line elaborated through every possible transformation.",
            },
            {
              name: "Instrumental & Percussion",
              desc:
                "Veena, violin (adopted in the 1800s and fully naturalised), flute, nadaswaram. The tani avartanam is a percussion solo for mridangam, ghatam and kanjira.",
            },
          ],
        },
      ],
    },
    {
      name: "Devotional & Sufi",
      desc:
        "Much of Indian music has always been prayer. Each faith and region has its own forms, and they cross over constantly.",
      children: [
        {
          name: "Qawwali",
          native: "قوّالی",
          desc:
            "Sufi devotional music of the Chishti order, traced to Amir Khusrau (13th c.). A lead singer, a chorus, handclaps, harmonium and tabla build ecstatic repetition. It is close kin to Turkish Sufi music.",
        },
        {
          name: "Bhajan & Kirtan",
          native: "भजन",
          desc:
            "Hindu devotional songs, from the medieval Bhakti poets (Mirabai, Kabir, Surdas, Tulsidas) to call-and-response kirtan sung by communities.",
        },
        {
          name: "Gurbani Kirtan",
          native: "ਗੁਰਬਾਣੀ",
          desc:
            "Sikh sacred music: hymns from the Guru Granth Sahib sung in prescribed ragas.",
        },
        {
          name: "Abhang",
          native: "अभंग",
          desc:
            "Marathi devotional poetry of the Varkari saints (Tukaram, Namdev, Jnaneshwar), sung on the pilgrimage to Pandharpur.",
        },
      ],
    },
    {
      name: "Ghazal & Poetry",
      desc:
        "Music in service of the word. Urdu poetry set to semi-classical melody, where the couplet matters more than the voice.",
      children: [
        {
          name: "Ghazal",
          native: "غزل",
          desc:
            "A Persian-Arabic poetic form that came to India and flowered in Urdu (Mir, Ghalib, Faiz). Sung ghazal ranges from classical-leaning to the soft, accessible style of the 1980s.",
        },
      ],
    },
    {
      name: "Folk & Regional",
      desc:
        "Every region, language and community has its own music, often far older than the classical systems. This branch could be endless, so these are only a few doors in.",
      children: [
        {
          name: "Baul",
          native: "বাউল",
          desc:
            "Wandering mystic minstrels of Bengal, singing of the divine within the body. Their instruments are the ektara (one-string drone) and the dotara.",
        },
        {
          name: "Rajasthani (Manganiyar & Langa)",
          desc:
            "Hereditary Muslim musician communities of the Thar desert who traditionally sang for Hindu patrons. Kamaicha and sarangi fiddles, khartal castanets, and huge voices.",
        },
        {
          name: "Bhangra & Punjabi Folk",
          native: "ਭੰਗੜਾ",
          desc:
            "Harvest dance music driven by the dhol drum. It has travelled the world through the diaspora and fused with everything from reggae to hip-hop.",
        },
        {
          name: "Lavani",
          native: "लावणी",
          desc:
            "Fast, bold, theatrical Maharashtrian song-dance driven by the dholki drum, with a sharp wit.",
        },
        {
          name: "Bihu",
          native: "বিহু",
          desc:
            "Assamese spring-festival music: pepa (buffalo-horn pipe), dhol, and songs of love and the new year.",
        },
        {
          name: "Tamil Folk & Gaana",
          desc:
            "From village parai drumming to gaana, the street music of Chennai's working-class neighbourhoods.",
        },
      ],
    },
    {
      name: "Film Music",
      desc:
        "For most Indians, 'music' means film songs. Film music is the country's popular music: it absorbs classical, folk and global styles and puts them back out to a billion people.",
      children: [
        {
          name: "Golden Era Hindi (1950s–60s)",
          desc:
            "Composers like S.D. Burman, Naushad, Shankar–Jaikishan and Madan Mohan. The voices were Lata Mangeshkar, Mohammed Rafi, Kishore Kumar and Asha Bhosle. Songs were melodic and poetic, and often raga-based.",
        },
        {
          name: "R.D. Burman & the 70s",
          desc:
            "Funk, rock, Latin and cabaret, filtered through a uniquely Indian sensibility. Burman's experiments in sound and arrangement still get sampled.",
        },
        {
          name: "A.R. Rahman & the 90s",
          desc:
            "Rahman began in Tamil cinema and rewrote the sound of Indian film with digital production, Sufi and Carnatic roots, and global textures.",
        },
        {
          name: "South Indian Film",
          desc:
            "Tamil, Telugu, Malayalam and Kannada cinemas each have their own deep song traditions. Ilaiyaraaja alone has composed for well over a thousand films.",
        },
      ],
    },
    {
      name: "Fusion & Independent",
      desc:
        "Music outside the film industry: experiments with jazz and rock, and a growing independent scene.",
      children: [
        {
          name: "Indo-Jazz & Fusion",
          desc:
            "From Ravi Shankar with the Beatles and Shakti with John McLaughlin to today's crossover ensembles.",
        },
        {
          name: "Indie & Rock",
          desc:
            "Bands and singer-songwriters building an audience without Bollywood, often in regional languages.",
        },
        {
          name: "Desi Hip-Hop",
          desc:
            "Born in Mumbai's streets (gully rap) and Punjabi and regional scenes, it is now one of the most popular forms among young Indians.",
        },
      ],
    },
  ],
};
