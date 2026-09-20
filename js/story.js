/**
 * =========================================================================
 * ROMANTIC STORY & BOUQUET CONFIGURATION
 * =========================================================================
 */

window.STORY_CONFIG = {
  // Couple Profile
  partnerName: "Maramero",
  userName: "Your Favorite Person",
  badgeText: "to my beautiful lil baby maramero",
  siteTitle: "For My Favorite Person In The Universe",
  introSubtitle: "To unlock your Prizes you need to answer a series of questions to test your knowledge of us. And you better get them all right 🙄. THIS IS A POPQUIZ!!!!",
  startButtonText: "Start",

  // Audio Settings: Wegz & Ash - Amira
  audio: {
    enabledByDefault: true,
    songTitle: "Wegz X Ash - Amira (أميرة)",
    sources: [
      "assets/amira.mp3",
      "assets/music.mp3",
      "amira.mp3",
      "music.mp3",
      "Wegz X @ashmusicofficial  - Amira (Official Audio) _ ويجز و آش - أميره.mp3"
    ]
  },

  // Wrong answer shuffled quotes (non-repeating consecutively)
  wrongResponses: [
    "El E7tmam Me4 Bytlb 🙄",
    "Ana F7mt Kol haga 🙄",
    "Kolo Byban 🙄"
  ],
  wrongGifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnlod21jZGI3cnppZmw0MzA2cWVkcWdqbDYxMTQ1M2dkcjZzb3VicyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ZaF4Vl1NQxwaVsStQU/giphy.gif",

  // Correct answer message & non-repeating celebration GIFs
  correctMessage: "Bravo 3leky Ya maramero 😘❤️",
  correctGifs: [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGNiaGN5OWg5NDdmdTR2MTBrN3pmbmp6d3I4YWhsNjlpZWZjMnJ4ZSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9KLPmWoiiPZvmJKQ14/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y2VsdDkycnEyZHRyN3kzMjhnZmZiODQxam5kcWp3emJiYXpsaG1qOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GRC8pK6FJ9Nm3AFArf/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXp4aGd1dXhmaWVqeTZwcWoxMGRnZXk5ZnN5cmR5emd1M3pzcGVzcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BpSV6RaLDFjrmQciZ6/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZGNkODBrNzgxbXJkaHp2bW9hbjdueWp2MXZndXJhbTkzd285dDlrMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/0ixAZaU8Gp8R5TdRQT/giphy.gif"
  ],

  // 5 Romantic Custom Questions (Questions & Answer Options are randomized on every load)
  questions: [
    {
      id: 1,
      question: "Lets Start it Easy: When is the first day we Talked to each other",
      hint: "Think back to the date that changed everything... 📅❤️",
      correctAnswer: "16 Aug",
      options: ["16 Aug", "24 Jul", "05 Sep", "11 Oct"]
    },
    {
      id: 2,
      question: "What is our First Inside Joke?",
      hint: "You can never forget this one... 🍞😂",
      correctAnswer: "Burned Toast",
      options: ["Amr diabetes", "Justin Beiber", "Burned Toast", "Tarek"]
    },
    {
      id: 3,
      question: "What is the first german thing you teached me?",
      hint: "A very educational linguistic lesson... 🇩🇪👀",
      correctAnswer: "Leck Meine Eier",
      options: ["Guten Tag", "Eine Milch bitte", "Guten Nacht", "Leck Meine Eier"]
    },
    {
      id: 4,
      question: "What is the Sweet of choice that i will get when i ask for your hand?",
      hint: "The sweetest tradition for the sweetest girl... 🍯✨",
      correctAnswer: "Basbosa",
      options: ["Konafa", "Dubai chocolate", "Basbosa", "Katyef"]
    },
    {
      id: 5,
      question: "When i got you your first gift, how many keychains where there?",
      hint: "Count them carefully in your memory... 🔑🎁",
      correctAnswer: "6",
      options: ["3", "4", "5", "6"]
    }
  ],

  // 3D Bouquet Experience Configuration (Centered, no Crystal Moonlight, with rich styles)
  flowerExperience: {
    title: "A Bouquet That Will Never Fade",
    subtitle: "Real flowers wilt in a week, but this bouquet was coded to bloom for you forever.",
    styles: [
      {
        id: "classic-romantic",
        name: "Classic Velvet Red Roses",
        desc: "Rich velvety crimson and ruby roses with emerald leaves and baby's breath.",
        colorHex: 0xbe123c,
        roughness: 0.42,
        metalness: 0.08
      },
      {
        id: "pastel-garden",
        name: "Pastel Garden Harmony",
        desc: "Multi-variety floral blend: soft peony pink, blush garden roses, and creamy ivory blossoms.",
        colorHex: 0xfda4af,
        roughness: 0.38,
        metalness: 0.05
      },
      {
        id: "sunset-gold",
        name: "Sunset Peach & Coral",
        desc: "Radiant warm coral, honey peach, and amber gold blossoms.",
        colorHex: 0xfb7185,
        roughness: 0.35,
        metalness: 0.15
      },
      {
        id: "royal-violet",
        name: "Royal Violet & Lavender",
        desc: "Imperial purple, royal violet, and lavender blossoms with golden pistil centers.",
        colorHex: 0x8b5cf6,
        roughness: 0.36,
        metalness: 0.12
      }
    ],
    secretNotes: [
      "Note 1: Thank you for making ordinary days feel like poetry.",
      "Note 2: You make me want to be the best version of myself every single day.",
      "Note 3: Your kindness is one of the rarest things in this world.",
      "Note 4: Every inside joke we share is locked in my heart forever.",
      "Note 5: I would choose you over and over again, in every lifetime.",
      "Note 6: You are my peace when the world is chaotic.",
      "Note 7: I am so endlessly grateful that our paths crossed."
    ]
  },

  // Final Wax-Sealed Anniversary Letter
  letter: {
    waxStampText: "LOVE",
    envelopePrompt: "Click the wax seal to unwrap my heart...",
    title: "To My Dear Maramero,",
    paragraphs: [
      "Unfortunately, we will not be moving forward with your application, but we appreciate your time and interest in us. B7zr 😭😭.",
      "Maramero, My beautiful Wife we 7bebty we ro7y we 9alby we 7yaty Kol7a, om el 3yal, om 4afeq we zafer, i want to write this letter to try to express a drop of my love and appreciation for you. and if i stayed writing from now till the end of my life it won't be enough for you and won't be justice for how much i love you and how I see you and my feeling towards you.",
      "i want to write this letter to show how much I love you and you being there for me all this time and wishing you a happy 2nd anniversary my love we 3oqbal el million inshallah we e7na m3a b3d we bn7tfl m3a el 3yal. and i want to also thank you for everything you did and your support for me. And I know we have our ups and downs, but we always find a way to make things work and you not giving up on me. And that is one of the many things I love about you. and i always want you to know no matter what happens, during the bad days before the good ones i will always love you and no matter how much i say it. it won't be enough for how i feel towards you and i want you to know your name will always be engraved on my heart and soul (you stole it from me 🙄).",
      "Last but not least, i want to say that i love you soooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooomucccchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh. and i want to apologise for anything that I did that might hurt you or make you sad and i hope you forgive me for it. and i hope you can always talk to me about anything 7ta lw meny, just come to me at any time and tell me and we will solve it together you and me like we always do. And thank you again for staying with me through everything. And I always want you to know that you are worth it 1000000000000000000000000000000000000000000000000000000000000000000%.",
      "Ik my letter is not as poetic as what you write, but I want you to know it comes from my heart very very deep inside, men gowa gedan, and I mean it 100%.",
      "and also you are a linguistic student we ana MO7ANDES 😭😘❤️. So I try to make you things that will make you happy in my own way.",
      "I love you sm my baby through the bad before the good and you are my ride or die😘❤️.",
      "Happy 2nd Anniversary my sweet lil princess."
    ],
    signature: "Forever & Always Yours,",
    signatureName: "Your Mo7andes ❤️"
  }
};
