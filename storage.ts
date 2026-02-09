
import { QuizForm, AppStats, Question, OpenQuestion } from './types';

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

const generateMCQ = (prompt: string, a: string, b: string, c: string, correct: 'A' | 'B' | 'C'): Question => ({
  id: crypto.randomUUID(),
  type: 'mcq',
  prompt,
  points: 5,
  options: [
    { id: 'A', text: a },
    { id: 'B', text: b },
    { id: 'C', text: c }
  ],
  correctOptionId: correct
});

export const initializeDefaultData = () => {
  // We vullen de data altijd in als de user de app voor het eerst opent of als we de data willen verversen.
  // Voor deze specifieke update overschrijven we de bestaande data om de nieuwe structuur (11 vragen in route 3) te garanderen.
  
  const allForms: QuizForm[] = [];

  // BRONDATA UIT PDF'S
  const pdfData = {
    v1: {
      title: "Video 1: Kun je ChatGPT het nieuws vragen?",
      url: "https://www.youtube.com/watch?v=m272L7_DS4g",
      mcqs: [
        ["Wat is AI?", "Een mens", "Een computerprogramma", "Een krant", "B"],
        ["Kan AI zelf nadenken?", "Ja", "Nee", "Soms", "B"],
        ["Wat kan AI goed?", "In de toekomst kijken", "Woorden voorspellen", "Tekenen met een pen", "B"],
        ["Waar haalt AI teksten vandaan?", "Uit boeken, kranten en van internet", "Alleen uit de tv", "Alleen uit de krant", "A"],
        ["Kan AI zelf zelf bij andere bronnen?", "Ja", "Nee", "Alleen met hulp", "C"],
        ["Wat doet AI met woorden?", "Hij zoekt via google naar de juiste antwoorden op vragen.", "Het kiest woorden die vaak samen worden gebruikt.", "Het kookt eten", "B"],
        ["Is het nieuws van AI altijd goed en betrouwbaar?", "Ja, altijd", "Alleen op maandag", "Nee, niet altijd controleer hiervoor", "C"],
        ["Kun je ChatGPT het nieuws vragen?", "Ja, ChatGPT is een echte journalist", "Nee, ChatGPT kan het nieuws niet zelf maken of checken", "Ja, ChatGPT gaat zelf naar buiten om nieuws te zoeken", "B"]
      ] as [string, string, string, string, 'A'|'B'|'C'][],
      opens: [
        ["Waarom kun je een taalmodel vergelijken met een woordvoorspeller?", "Een taalmodel begrijpt de inhoud niet, maar kijkt naar welke woorden vaak samen in een zin staan en raadt op basis daarvan wat het meest logische volgende woord is."],
        ["Wat is het gevaar van AI-samenvattingen bij nieuwsberichten?", "AI kan woorden verkeerd combineren, waardoor de betekenis van het nieuws verandert en er feitelijke onjuistheden (zoals iemand onterecht beschuldigen) ontstaan."],
        ["Hoe kun je controleren of een nieuwsbericht van een chatbot echt waar is?", "Je moet op de linkjes klikken die de chatbot geeft om naar de oorspronkelijke bron (zoals de NOS) te gaan en te kijken of een echte journalist het heeft gecheckt."]
      ]
    },
    v2: {
      title: "Video 2: Mag AI mijn gezicht gebruiken?",
      url: "https://www.youtube.com/watch?v=fQgoTz3-8qM",
      mcqs: [
        ["Waarmee leert een AI-programma?", "Met veel data (foto`s, afbeeldingen, nieuwsberichten, internet pagina`s en nog meer.", "Met geld", "Met spelletjes", "A"],
        ["Wat kan AI maken van mensen?", "Alleen tekeningen", "Gezichten en stemmen", "Alleen huizen", "B"],
        ["Kan AI jouw gezicht gebruiken?", "Ja, altijd", "Nee, dat mag niet zomaar ivm het portretrecht", "Alleen op zondag", "B"],
        ["Waar staan veel AI-computers?", "Alleen in Nederland", "In Amerika en China", "Alleen op school", "B"],
        ["Is het altijd slim om je foto in een AI programma te zetten?", "Ja, altijd", "Nee, dat is niet altijd slim", "Alleen met vrienden", "B"],
        ["Wat is een probleem met AI volgens de tekst?", "AI maakt geen foto’s", "AI kan dingen maken die niet echt zijn", "AI werkt te langzaam", "B"],
        ["Wat is het risico van AI?", "Dat mensen heel lui worden", "Dat er chaos onstaat", "Dat er filmpjes of artikelen worden gemaakt waarin nepnieuws wordt verspreid", "C"],
        ["Mag je een video van een ander maken met AI?", "dit mag niet maar kan wel dus doe ik het gewoon", "dit mag niet en ik respecteer de ander en doet dit dus niet", "dit mag gewoon ik maak regelmatig video`s van anderen", "B"]
      ] as [string, string, string, string, 'A'|'B'|'C'][],
      opens: [
        ["Waarom is het riskant om je eigen foto in een AI-app te uploaden die buiten Europa is gemaakt?", "In landen buiten de EU gelden andere privacywetten, waardoor je de controle over je foto verliest en deze voor andere doeleinden gebruikt kan worden zonder jouw toestemming."],
        ["Leg uit wat het risico is van het namaken van iemands stem met AI.", "Met een nagemaakte stem kunnen mensen opgelicht worden (zoals in het voorbeeld van de voicemails), omdat het lijkt alsof een bekende vraagt om hulp of geld."],
        ["Wat wordt bedoeld met \"Jouw gezicht is van jou\" in de context van het portretrecht?", "Het betekent dat jij het recht hebt om te bepalen wat er met afbeeldingen van jouw gezicht en lichaam gebeurt en dat anderen deze niet zomaar mogen gebruiken of aanpassen."]
      ]
    },
    v3: {
      title: "Video 3: Is het gevaarlijk om te chatten met ChatGPT?",
      url: "https://www.youtube.com/watch?v=LhoMwD0Dk4o",
      mcqs: [
        ["Waarom voelt ChatGPT soms als een vriend?", "Omdat het zelf gevoelens heeft", "Omdat het ontworpen is als chat", "Omdat het kan lachen", "B"],
        ["Wat doet ChatGPT meestal in een gesprek?", "Het blijft zo lang mogelijk chatten", "Het stopt meteen", "Het leest een boek", "A"],
        ["Wat doet ChatGPT vaak aan het eind van een antwoord?", "Het stelt een nieuwe vraag", "Het zegt vaarwel", "Het start een spel", "A"],
        ["Wat is een probleem met chatbots volgens de video?", "Ze zeggen vaak wat jij wilt horen", "Ze kunnen alleen Engels spreken", "Ze kunnen niet typen", "A"],
        ["Wat gebeurde er met een man in Amerika die met ChatGPT chatte?", "Hij sprong van een gebouw", "Hij vroeg of hij kon vliegen en ChatGPT vertelde dat hij dit wel kon", "Hij verloor zijn telefoon", "B"],
        ["Kan ChatGPT echt mensen vertrouwen?", "Ja, altijd", "Nee, het is een machine", "Alleen soms", "B"],
        ["Wat moet je doen voordat je een vraag aan ChatGPT stelt?", "Eerst bedenken of je het antwoord van een machine wil", "Het meteen geloven", "Het aan je huisdier vragen", "A"],
        ["Is het gevaarlijk om te chatten met ChatGPT?", "Nee, het is altijd veilig", "Ja, soms kan het gevaarlijk zijn dat ligt aan de soort vraag die je hem stelt", "Alleen als het regent", "B"]
      ] as [string, string, string, string, 'A'|'B'|'C'][],
      opens: [
        ["Waarom zijn de antwoorden van een chatbot over persoonlijke feiten vaak onbetrouwbaar?", "Een chatbot is een woordvoorspeller die woorden combineert die logisch klinken, maar hij weet niet echt wie je bent of wat de feiten over jouw leven zijn."],
        ["Leg uit waarom een chatbot geen goede vervanger is voor een echte vriend bij het geven van advies.", "Een chatbot is een meeloper die ontworpen is om je te plezieren, terwijl een echte vriend je ook durft tegen te spreken of te waarschuwen als je een slecht idee hebt."],
        ["Wat wordt bedoeld met het gevaar van \"langdurige gesprekken\" met een chatbot?", "Hoe langer je chat, hoe meer de AI kan gaan \"hallucineren\" of vreemde, onlogische en soms zelfs gevaarlijke adviezen kan gaan geven."]
      ]
    },
    v4: {
      title: "Video 4: Kan je zien of een filmpje nep is?",
      url: "https://www.youtube.com/watch?v=m272L7_DS4g",
      mcqs: [
        ["Wie maakt de filmpjes die nep lijken?", "Een echte cameraman", "Een computerprogramma met AI", "Een tekenaar", "B"],
        ["Kan je altijd zien of een filmpje nep is?", "Ja, altijd", "Nee, meestal niet meer", "Alleen met een vergrootglas", "B"],
        ["Hoe leert het AI-programma filmpjes maken?", "Door naar echte filmpjes en woorden te kijken", "Door zelf naar buiten te gaan", "Door mensen te bellen", "A"],
        ["Wat kan nog fout gaan in AI-filmpjes?", "Het regent in het filmpje", "Dingen bewegen niet goed of klinken niet zoals ze zouden moeten klinken", "Het geluid is altijd perfect", "B"],
        ["Wat gebeurt er als iets ongewoons wordt gevraagd aan AI?", "Het werkt altijd perfect", "Het kan grappig of fout zijn", "Het stopt meteen", "B"],
        ["Waarom is het belangrijk om naar de bron te kijken?", "Omdat sommige filmpjes nep zijn", "Omdat AI filmpjes altijd beter zijn", "Omdat alle filmpjes gratis zijn", "A"],
        ["Welke filmpjes worden genoemd als betrouwbaar?", "Filmpjes van onbekende accounts", "Filmpjes van journalisten en wetenschappers", "Filmpjes van katten op YouTube", "B"],
        ["Wat is een groot probleem met AI filmpjes volgens video?", "Ze nemen veel tijd om te maken", "Ze lijken soms echt, maar zijn nep", "Ze kosten geld", "B"]
      ] as [string, string, string, string, 'A'|'B'|'C'][],
      opens: [
        ["Waarom maakt AI vaak fouten bij \"ongewone\" opdrachten, zoals een glas cola dat overstroomt?", "Er zijn waarschijnlijk weinig voorbeelden van die specifieke situatie in de trainingsdata gestopt, waardoor de AI niet goed weet hoe de natuurwetten (zoals vloeistof) werken."],
        ["Hoe kun je aan de hand van het account zien of een filmpje betrouwbaar is?", "Je kijkt of de afzender een bekende, officiële organisatie is (zoals de NOS of Het Klokhuis) in plaats van een onbekend account met een vage naam."],
        ["Wat is het risico als we het verschil tussen echt en nep niet meer zien op social media?", "Dan weten mensen niet meer wat er werkelijk in de wereld gebeurt en kunnen ze misleid worden door beelden die nooit hebben plaatsgevonden."]
      ]
    },
    v5: {
      title: "Video 5: Kun je AI-antwoorden vertrouwen?",
      url: "https://www.youtube.com/watch?v=YwDFFGYf2kw",
      mcqs: [
        ["Wat geeft AI als je een vraag stelt?", "Het belt iemand op", "Het maakt een antwoord van woorden die bij elkaar passen", "Het gaat zelf naar buiten", "B"],
        ["Kan AI begrijpen of iets klopt?", "Ja, altijd", "Nee, het begrijpt niks", "Alleen als het regent", "B"],
        ["Waar haalt AI informatie vandaan?", "Uit films", "Uit verschillende websites", "Uit je koelkast", "B"],
        ["Wat kan er gebeuren met AI-antwoorden?", "Ze zijn altijd juist", "Ze kunnen fouten bevatten", "Ze verdwijnen automatisch", "B"],
        ["Wat is een voorbeeld van een fout AI antwoord uit de video?", "De Eiffeltoren is 330 meter hoog", "Lijm als tip voor een pizza", "Wikipedia is betrouwbaar", "B"],
        ["Waar moet je op letten als je een AI antwoord krijgt?", "Dat het grappig is", "Dat je de informatie controleert op betrouwbare websites", "Dat het snel is", "B"],
        ["Wat betekent “hallucineren” bij AI?", "AI maakt fouten en geeft soms rare antwoorden omdat hij fantaseert", "AI slaapt", "AI kan vliegen", "A"],
        ["Waar kun je de echte hoogte van de Eiffeltoren vinden?", "Op een AI-chatprogramma", "Op Wikipedia", "Op een onbekende blog", "B"]
      ] as [string, string, string, string, 'A'|'B'|'C'][],
      opens: [
        ["Leg uit wat er bedoeld wordt met \"hallucineren\" door een AI-programma.", "Het betekent dat de AI vol zelfvertrouwen informatie geeft die volledig verzonnen is of feitelijk onjuist, omdat het programma alleen woorden voorspelt en de waarheid niet kent."],
        ["Waarom is het gevaarlijk om blind te vertrouwen op de samenvattingen bovenaan de zoekresultaten?", "Omdat deze teksten door AI zijn gegenereerd door verschillende bronnen te scannen, waarbij de context verloren kan gaan en er onjuiste conclusies worden getrokken."],
        ["Wat is het advies van de video als je echt zeker wilt weten of informatie klopt?", "Je moet niet stoppen bij het AI-overzicht, maar doorklikken naar betrouwbare links van officiële websites die door mensen zijn geschreven."]
      ]
    }
  };

  // BOUW DE FORMULIEREN OP PER VIDEO
  Object.entries(pdfData).forEach(([key, data], index) => {
    const videoId = index + 1;
    const allMcqs = data.mcqs.map(m => generateMCQ(m[0], m[1], m[2], m[3], m[4]));
    const opens = data.opens.map(o => ({
      id: crypto.randomUUID(),
      type: 'open' as const,
      prompt: o[0],
      modelAnswer: o[1],
      points: 10,
      grading: { method: 'similarity' as const, thresholdGood: 0.7, thresholdOk: 0.5 }
    }));

    // Route 1: Alle 8 PDF MCQ's
    allForms.push({
      id: `v${videoId}r1`, videoId, route: 'route1',
      title: data.title, videoEmbed: data.url, isEnabled: true,
      questions: allMcqs
    });

    // Route 2: Alle 8 PDF MCQ's
    allForms.push({
      id: `v${videoId}r2`, videoId, route: 'route2',
      title: data.title, videoEmbed: data.url, isEnabled: true,
      questions: allMcqs
    });

    // MBO Route: Alle 8 PDF MCQ's
    allForms.push({
      id: `v${videoId}re`, videoId, route: 'entree',
      title: data.title, videoEmbed: data.url, isEnabled: true,
      questions: allMcqs
    });

    // Route 3: Alle 8 PDF MCQ's + 3 Open vragen (Totaal 11 vragen)
    allForms.push({
      id: `v${videoId}r3`, videoId, route: 'route3',
      title: data.title, videoEmbed: data.url, isEnabled: true,
      questions: [...allMcqs, ...opens]
    });
  });

  saveForms(allForms);
};
