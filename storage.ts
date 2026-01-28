
import { QuizForm, AppStats, Question } from './types';

const CONTENT_KEY = 'videoquiz_content_v2';
const STATS_KEY = 'videoquiz_stats_v2';

export const getForms = (): QuizForm[] => {
  const data = localStorage.getItem(CONTENT_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveForms = (forms: QuizForm[]) => {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(forms));
};

export const getStats = (): AppStats => {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : {
    visits: 0,
    routesChosen: { route1: 0, route2: 0, route3: 0, entree: 0 },
    formsStarted: 0,
    formsFinished: 0
  };
};

export const saveStats = (stats: AppStats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

const generateMCQ = (prompt: string, a: string, b: string, c: string): Question => ({
  id: crypto.randomUUID(),
  type: 'mcq',
  prompt,
  points: 5,
  options: [
    { id: 'A', text: a },
    { id: 'B', text: b },
    { id: 'C', text: c }
  ],
  correctOptionId: 'C'
});

export const initializeDefaultData = () => {
  if (getForms().length > 0) return;

  const allForms: QuizForm[] = [];

  // DATA DEFINITIES
  const videoData = [
    {
      id: 1,
      title: "Video 1: Wat is AI?",
      url: "https://www.youtube.com/watch?v=m272L7_DS4g",
      mcqs: [
        ["1. Wat is AI precies?", "Een soort kaas", "Een echt mens", "Een computerprogramma"],
        ["2. Is AI een journalist?", "Ja, hij werkt bij de krant", "Nee, hij kan niet bellen", "Soms, in het weekend"],
        ["3. Wat is een 'woordvoorspeller'?", "Een machine die praat", "Een boek met woorden", "Iets dat het volgende woord raadt"],
        ["4. Kan AI naar buiten gaan?", "Ja, met een jas aan", "Nee, het is een programma", "Alleen als de zon schijnt"],
        ["5. Waar leert AI van?", "Van eten en drinken", "Van teksten op internet", "Van dromen"]
      ],
      route12ExtraMcqs: [
        ["6. Is nieuws van de NOS goed?", "Nee, het is voor honden", "Ja, het is gecheckt", "Alleen als het regent"],
        ["7. Wat doet een taalmodel?", "Woorden achter elkaar zetten", "Dansjes maken", "Mensen bellen"],
        ["8. Snapt AI wat hij schrijft?", "Ja, heel goed", "Een klein beetje", "Nee, hij begrijpt niks"]
      ],
      openQuestions: [
        ["6. Waarom kun je een taalmodel vergelijken met een woordvoorspeller?", "Een taalmodel begrijpt de inhoud niet, maar kijkt naar welke woorden vaak samen in een zin staan en raadt op basis daarvan wat het meest logische volgende woord is."],
        ["7. Wat is het gevaar van AI-samenvattingen bij nieuwsberichten?", "AI kan woorden verkeerd combineren, waardoor de betekenis van het nieuws verandert en er feitelijke onjuistheden (zoals iemand onterecht beschuldigen) ontstaan."],
        ["8. Hoe kun je controleren of een nieuwsbericht van een chatbot echt waar is?", "Je moet op de linkjes klikken die de chatbot geeft om naar de oorspronkelijke bron (zoals de NOS) te gaan en te kijken of een echte journalist het heeft gecheckt."]
      ]
    },
    {
      id: 2,
      title: "Video 2: Mag AI mijn gezicht gebruiken?",
      url: "https://www.youtube.com/watch?v=fQgoTz3-8qM",
      mcqs: [
        ["1. Wat gebeurt er als je een foto uploadt in een buitenlandse app?", "De foto wordt direct verwijderd", "Je krijgt geld voor de foto", "Je verliest de controle over je eigen foto"],
        ["2. Waarom is een stem uniek?", "Omdat iedereen dezelfde stem heeft", "Omdat het alleen in voicemails werkt", "Omdat het een biometrisch kenmerk van jou is"],
        ["3. Wat is het gevaar van stem-imitatie?", "Je stem wordt mooier", "Je kunt beter zingen", "Mensen kunnen opgelicht worden via voicemails"],
        ["4. Wat betekent Portretrecht?", "Dat je een schilderij bent", "Dat iedereen foto's van je mag maken", "Dat jij mag bepalen wat er met foto's van jou gebeurt"],
        ["5. Geldt de Europese privacywet overal?", "Ja, in de hele wereld", "Nee, alleen in Amerika", "Nee, buiten de EU gelden vaak andere regels"]
      ],
      route12ExtraMcqs: [
        ["6. Mag een school jouw foto zomaar op internet zetten?", "Ja, altijd", "Nee, nooit", "Alleen als jij daar toestemming voor geeft"],
        ["7. Wat is 'Deepfake'?", "Een heel diep gat in de grond", "Een echte video van vroeger", "Een nepvideo die er echt uitziet"],
        ["8. Hoe herken je een AI-foto soms?", "Aan de kleur van de lucht", "Aan de tekst eronder", "Aan vreemde details zoals te veel vingers"]
      ],
      openQuestions: [
        ["6. Waarom is het riskant om je eigen foto in een AI-app te uploaden die buiten Europa is gemaakt?", "In landen buiten de EU gelden andere privacywetten, waardoor je de controle over je foto verliest en deze voor andere doeleinden gebruikt kan worden zonder jouw toestemming."],
        ["7. Leg uit wat het risico is van het namaken van iemands stem met AI.", "Met een nagemaakte stem kunnen mensen opgelicht worden (zoals in het voorbeeld van de voicemails), omdat het lijkt alsof een bekende vraagt om hulp of geld."],
        ["8. Wat wordt bedoeld met \"Jouw gezicht is van jou\" in de context van het portretrecht?", "Het betekent dat jij het recht hebt om te bepalen wat er met afbeeldingen van jouw gezicht en lichaam gebeurt en dat anderen deze niet zomaar mogen gebruiken of aanpassen."]
      ]
    },
    {
      id: 3,
      title: "Video 3: Chatten met ChatGPT",
      url: "https://www.youtube.com/watch?v=LhoMwD0Dk4o",
      mcqs: [
        ["1. Weet ChatGPT echt wie jij bent?", "Ja, hij kent al je geheimen", "Nee, hij raadt alleen woorden", "Alleen als je je naam zegt"],
        ["2. Waarom geeft AI soms verkeerde antwoorden over jou?", "Omdat de computer je niet aardig vindt", "Omdat de stroom soms uitvalt", "Omdat hij woorden combineert die logisch klinken, maar niet waar zijn"],
        ["3. Is ChatGPT een goede vervanger voor een vriend?", "Ja, hij is altijd wakker", "Ja, hij weet alles beter", "Nee, hij durft je nooit tegen te spreken"],
        ["4. Wat gebeurt er als je heel lang chat met een AI?", "De computer wordt warm", "Je krijgt een prijs", "De kans op vreemde antwoorden (hallucinaties) wordt groter"],
        ["5. Wat is het doel van een chatbot?", "Om je de waarheid te vertellen", "Om je te irriteren", "Om een antwoord te geven dat jij waarschijnlijk goed vindt"]
      ],
      route12ExtraMcqs: [
        ["6. Snapt AI emoties?", "Ja, hij voelt alles", "Een beetje als de zon schijnt", "Nee, het blijft een programma"],
        ["7. Wat is een 'meeloper'?", "Iemand die achter je aan loopt", "Een computer die uitgaat", "Iets dat alleen maar zegt wat jij wilt horen"],
        ["8. Waarom moet je oppassen met advies van AI?", "Omdat AI geen menselijke ervaring of echt begrip heeft", "Omdat het te veel geld kost", "Omdat de tekst altijd in het Engels is"]
      ],
      openQuestions: [
        ["6. Waarom zijn de antwoorden van een chatbot over persoonlijke feiten vaak onbetrouwbaar?", "Een chatbot is een woordvoorspeller die woorden combineert die logisch klinken, maar hij weet niet echt wie je bent of wat de feiten over jouw leven zijn."],
        ["7. Leg uit waarom een chatbot geen goede vervanger is voor een echte vriend bij het geven van advies.", "Een chatbot is een meeloper die ontworpen is om je te plezieren, terwijl een echte vriend je ook durft tegen te spreken of te waarschuwen als je een slecht idee hebt."],
        ["8. Wat wordt bedoeld met het gevaar van \"langdurige gesprekken\" met een chatbot?", "Hoe langer je chat, hoe meer de AI kan gaan \"hallucineren\" of vreemde, onlogische en soms zelfs gevaarlijke adviezen kan gaan geven."]
      ]
    },
    {
      id: 4,
      title: "Video 4: Echt of Nep?",
      url: "https://www.youtube.com/watch?v=m272L7_DS4g",
      mcqs: [
        ["1. Waarom maakt AI fouten met zwaartekracht?", "Omdat AI niet van cola houdt", "Omdat de computer te licht is", "Omdat de trainingsdata niet genoeg voorbeelden heeft van natuurwetten"],
        ["2. Hoe check je een filmpje op social media?", "Door naar de likes te kijken", "Door het drie keer te kijken", "Door te kijken of het account van een echte organisatie is"],
        ["3. Wat is een risico van nepbeelden?", "Dat je telefoon kapot gaat", "Dat je ogen pijn gaan doen", "Dat we niet meer weten wat echt is in de wereld"],
        ["4. Kan AI vloeistoffen goed nabootsen?", "Ja, perfect", "Alleen als het water is", "Nee, dat vindt de AI vaak nog erg lastig"],
        ["5. Wat doet een officiële bron zoals de NOS?", "Die verzint leuke verhalen", "Die plaatst alleen maar AI", "Die checkt of een bericht echt waar is"]
      ],
      route12ExtraMcqs: [
        ["6. Wat zie je vaak bij AI-mensen?", "Ze hebben altijd een bril op", "Ze zijn altijd heel klein", "Ze hebben soms rare handen of tanden"],
        ["7. Waarom is een vage accountnaam een slecht teken?", "Omdat het waarschijnlijk geen echte journalist is", "Omdat het moeilijk te spellen is", "Omdat de computer dan trager wordt"],
        ["8. Helpt AI bij het verspreiden van nepnieuws?", "Nee, AI stopt nepnieuws", "Alleen op dinsdag", "Ja, het is makkelijker geworden om mensen te misleiden"]
      ],
      openQuestions: [
        ["6. Waarom maakt AI vaak fouten bij \"ongewone\" opdrachten, zoals een glas cola dat overstroomt?", "Er zijn waarschijnlijk weinig voorbeelden van die specifieke situatie in de trainingsdata gestopt, waardoor de AI niet goed weet hoe de natuurwetten (zoals vloeistof) werken."],
        ["7. Hoe kun je aan de hand van het account zien of een filmpje betrouwbaar is?", "Je kijkt of de afzender een bekende, officiële organisatie is (zoals de NOS of Het Klokhuis) in plaats van een onbekend account met een vage naam."],
        ["8. Wat is het risico als we het verschil tussen echt en nep niet meer zien op social media?", "Dan weten mensen niet meer wat er werkelijk in de wereld gebeurt en kunnen ze misleid worden door beelden die nooit hebben plaatsgevonden."]
      ]
    },
    {
      id: 5,
      title: "Video 5: AI Vertrouwen",
      url: "https://www.youtube.com/watch?v=YwDFFGYf2kw",
      mcqs: [
        ["1. Wat betekent 'hallucineren' bij AI?", "Dat de computer droomt", "Dat de AI vrolijk is", "Dat de AI vol zelfvertrouwen onzin vertelt"],
        ["2. Waar staan AI-samenvattingen vaak?", "Onderaan de pagina", "In de krant van gisteren", "Bovenaan de zoekresultaten"],
        ["3. Is een AI-overzicht altijd de waarheid?", "Ja, computers maken geen fouten", "Alleen als het kort is", "Nee, context kan verloren gaan waardoor het niet klopt"],
        ["4. Wat moet je doen als je echt zeker wilt zijn?", "De computer opnieuw opstarten", "Het direct geloven", "Doorklikken naar de bronnen onderaan het overzicht"],
        ["5. Hoe scant AI bronnen?", "Hij leest ze heel langzaam", "Hij begrijpt alles als een mens", "Hij zoekt snel naar trefwoorden en voorspelt dan een tekst"]
      ],
      route12ExtraMcqs: [
        ["6. Waarom is context belangrijk?", "Omdat de tekst anders een andere betekenis krijgt", "Omdat het er dan mooier uitziet", "Omdat de AI dan sneller werkt"],
        ["7. Wie schrijft de teksten op officiële websites?", "De AI van Google", "Niemand, dat gaat vanzelf", "Mensen (journalisten of experts)"],
        ["8. Wat is het belangrijkste advies uit de video?", "Blijf zelf nadenken en check de bron", "Gebruik nooit meer AI", "Geloof alles wat bovenaan staat"]
      ],
      openQuestions: [
        ["6. Leg uit wat er bedoeld wordt met \"hallucineren\" door een AI-programma.", "Het betekent dat de AI vol zelfvertrouwen informatie geeft die volledig verzonnen is of feitelijk onjuist, omdat het programma alleen woorden voorspelt en de waarheid niet kent."],
        ["7. Waarom is het gevaarlijk om blind te vertrouwen op de samenvattingen bovenaan de zoekresultaten?", "Omdat deze teksten door AI zijn gegenereerd door verschillende bronnen te scannen, waarbij de context verloren kan gaan en er onjuiste conclusies worden getrokken."],
        ["8. Wat is het advies van de video als je echt zeker wilt weten of informatie klopt?", "Je moet niet stoppen bij het AI-overzicht, maar doorklikken naar betrouwbare links van officiële websites die door mensen zijn geschreven."]
      ]
    }
  ];

  // LOOP OVER VIDEO DATA OM FORMULIEREN TE GENEREREN
  videoData.forEach(v => {
    const commonMcqs = v.mcqs.map(m => generateMCQ(m[0], m[1], m[2], m[3]));
    const extraMcqs = v.route12ExtraMcqs.map(m => generateMCQ(m[0], m[1], m[2], m[3]));
    const opens = v.openQuestions.map(o => ({
      id: crypto.randomUUID(),
      type: 'open' as const,
      prompt: o[0],
      modelAnswer: o[1],
      points: 10,
      grading: { method: 'similarity' as const, thresholdGood: 0.7, thresholdOk: 0.5 }
    }));

    // Route 1 (8 MCQs)
    allForms.push({
      id: `v${v.id}r1`, videoId: v.id, route: 'route1',
      title: v.title, videoEmbed: v.url, isEnabled: true,
      questions: [...commonMcqs, ...extraMcqs]
    });

    // Route 2 (8 MCQs)
    allForms.push({
      id: `v${v.id}r2`, videoId: v.id, route: 'route2',
      title: v.title, videoEmbed: v.url, isEnabled: true,
      questions: [...commonMcqs, ...extraMcqs]
    });

    // Route 3 (5 MCQs + 3 Open)
    allForms.push({
      id: `v${v.id}r3`, videoId: v.id, route: 'route3',
      title: v.title, videoEmbed: v.url, isEnabled: true,
      questions: [...commonMcqs, ...opens]
    });

    // MBO-Opleiding (Zelfde als Route 2)
    allForms.push({
      id: `v${v.id}re`, videoId: v.id, route: 'entree',
      title: v.title, videoEmbed: v.url, isEnabled: true,
      questions: [...commonMcqs, ...extraMcqs]
    });
  });

  saveForms(allForms);
};
