// ---------------------------------------------------------------------------
// DUMMY DATA. Every item has three languages: English, Hindi and the tribal
// language (Galo / Nyishi / Adi). The tribal text below is a PLACEHOLDER
// (prefixed with "⟨T⟩") - replace it with reviewed text from native speakers.
// Audio / video paths are placeholders too: drop real files into /public/media
// and the MediaSlot component will pick them up automatically.
// ---------------------------------------------------------------------------

export type Lang = "en" | "hi" | "tr";

export const TRIBAL_NAME = "Galo"; // change to "Nyishi" or "Adi"

export type Tri = Record<Lang, string>;

const tr = (en: string) => `⟨T⟩ ${en}`;
const tri = (en: string, hi: string): Tri => ({ en, hi, tr: tr(en) });

export interface Item {
  id: string;
  emoji: string;
  color: string; // tailwind bg class
  title: Tri;
  description: Tri;
  audio?: string; // e.g. /media/audio/{lang}/apple.mp3
  video?: string; // e.g. /media/video/apple.mp4
}

export interface Category {
  slug: string;
  emoji: string;
  color: string;
  label: Tri;
  items: Item[];
}

const mk = (
  id: string,
  emoji: string,
  color: string,
  en: string,
  hi: string,
  descEn: string,
  descHi: string
): Item => ({
  id,
  emoji,
  color,
  title: tri(en, hi),
  description: tri(descEn, descHi),
});

const colors = [
  "bg-berry-400",
  "bg-sky-400",
  "bg-leaf-400",
  "bg-sun-400",
  "bg-grape-400",
  "bg-orange-400",
];
const c = (i: number) => colors[i % colors.length];

// Alphabet lessons live in lib/alphabet.ts (each language has its own letter set).

const numberWords: [number, string, string, string][] = [
  [1, "One", "एक", "🌞"],
  [2, "Two", "दो", "👀"],
  [3, "Three", "तीन", "🍀"],
  [4, "Four", "चार", "🐾"],
  [5, "Five", "पाँच", "🖐️"],
  [6, "Six", "छह", "🎲"],
  [7, "Seven", "सात", "🌈"],
  [8, "Eight", "आठ", "🐙"],
  [9, "Nine", "नौ", "🎈"],
  [10, "Ten", "दस", "🔟"],
];
export const numbers: Item[] = numberWords.map(([n, en, hi, e], i) => ({
  id: String(n),
  emoji: e,
  color: c(i),
  title: { en: String(n), hi: String(n), tr: String(n) },
  description: { en, hi, tr: tr(en) },
}));

export const animals: Item[] = [
  mk("hornbill", "🦜", c(0), "Great Hornbill", "धनेश पक्षी", "A big bird with a golden-yellow beak. Found in the forests of the Northeast.", "सुनहरी चोंच वाला बड़ा पक्षी। पूर्वोत्तर के जंगलों में मिलता है।"),
  mk("mithun", "🐂", c(1), "Mithun", "मिथुन", "A gentle forest cattle, important in tribal culture.", "एक शांत वन-पशु, जनजातीय संस्कृति में महत्वपूर्ण।"),
  mk("tiger", "🐅", c(2), "Tiger", "बाघ", "A strong striped cat that lives in the jungle.", "जंगल में रहने वाली धारीदार बड़ी बिल्ली।"),
  mk("elephant", "🐘", c(3), "Elephant", "हाथी", "The biggest land animal. It uses its trunk like a hand.", "सबसे बड़ा ज़मीनी जानवर। सूंड हाथ की तरह काम करती है।"),
  mk("redpanda", "🦊", c(4), "Red Panda", "लाल पांडा", "A small fluffy animal that climbs trees in the mountains.", "पहाड़ों में पेड़ों पर चढ़ने वाला छोटा रोएँदार जानवर।"),
  mk("monkey", "🐒", c(5), "Monkey", "बंदर", "A playful animal that loves to jump from tree to tree.", "पेड़ से पेड़ कूदने वाला खिलाड़ी जानवर।"),
];

export const food: Item[] = [
  mk("rice", "🍚", c(0), "Rice", "चावल", "The everyday food, often cooked with fresh leaves and vegetables.", "रोज़ का खाना, अक्सर पत्तों और सब्ज़ियों के साथ पकाया जाता है।"),
  mk("bamboo", "🎍", c(1), "Bamboo Shoot", "बाँस की कोपल", "Young bamboo shoots used in soups and curries.", "सूप और सब्ज़ी में इस्तेमाल होने वाली कोमल कोपलें।"),
  mk("apong", "🍶", c(2), "Rice Beer (festival drink)", "चावल का पेय (उत्सव)", "A traditional festival drink shared by elders. Not for children.", "बड़ों द्वारा बाँटा जाने वाला पारंपरिक उत्सव पेय। बच्चों के लिए नहीं।"),
  mk("fish", "🐟", c(3), "Fish Curry", "मछली की करी", "Fresh river fish cooked simply with herbs.", "नदी की ताज़ी मछली, जड़ी-बूटियों के साथ सरल तरीके से पकी।"),
  mk("orange", "🍊", c(4), "Orange", "संतरा", "Sweet oranges grow on the hills.", "पहाड़ियों पर मीठे संतरे उगते हैं।"),
];

export const festivals: Item[] = [
  mk("harvest", "🌾", c(0), "Harvest Festival", "फसल उत्सव", "People thank nature for the crops with songs, dance and shared food.", "लोग गीत, नृत्य और भोज के साथ फसल के लिए प्रकृति का धन्यवाद करते हैं।"),
  mk("spring", "🌸", c(1), "Spring Festival", "वसंत उत्सव", "A festival to welcome the new season and pray for a good year.", "नए मौसम के स्वागत और अच्छे वर्ष की प्रार्थना का उत्सव।"),
  mk("dance", "💃", c(2), "Community Dance", "सामुदायिक नृत्य", "Everyone joins hands and dances in a circle.", "सब हाथ पकड़कर गोल घेरे में नाचते हैं।"),
];

export const dress: Item[] = [
  mk("jacket", "🧥", c(0), "Woven Jacket", "बुनी हुई जैकेट", "A bright hand-woven jacket with colourful stripes.", "रंगीन धारियों वाली हाथ से बुनी चमकीली जैकेट।"),
  mk("headgear", "🎩", c(1), "Cane Headgear", "बेंत की टोपी", "A cap made from cane, sometimes decorated with feathers.", "बेंत से बनी टोपी, कभी-कभी पंखों से सजी।"),
  mk("beads", "📿", c(2), "Bead Necklace", "मोतियों की माला", "Strings of colourful beads worn on special days.", "खास दिनों पर पहनी जाने वाली रंगीन मोतियों की मालाएँ।"),
  mk("skirt", "👗", c(3), "Woven Skirt", "बुना हुआ स्कर्ट", "A wrap skirt woven on a handloom with traditional patterns.", "हथकरघे पर बना, पारंपरिक नमूनों वाला लपेटने का स्कर्ट।"),
];

export const dresscode: Item[] = [
  mk("school", "🏫", c(0), "School Day", "स्कूल का दिन", "Wear the school uniform: clean shirt, neat shoes and a school bag.", "स्कूल की यूनिफ़ॉर्म पहनें: साफ़ कमीज़, सलीके के जूते और बस्ता।"),
  mk("festival", "🎉", c(1), "Festival Day", "उत्सव का दिन", "Wear traditional dress with beads and a woven jacket.", "मोतियों और बुनी जैकेट के साथ पारंपरिक पोशाक पहनें।"),
  mk("exam", "📝", c(2), "Exam Day", "परीक्षा का दिन", "Wear simple, comfortable clothes. Carry a pencil and a water bottle.", "सादे, आरामदायक कपड़े पहनें। पेंसिल और पानी की बोतल साथ रखें।"),
];

export const categories: Category[] = [
  { slug: "alphabet", emoji: "🔤", color: "bg-berry-400", label: tri("Alphabet", "वर्णमाला"), items: [] },
  { slug: "numbers", emoji: "🔢", color: "bg-sky-400", label: tri("Numbers", "संख्याएँ"), items: numbers },
  { slug: "animals", emoji: "🐘", color: "bg-leaf-400", label: tri("Animals", "जानवर"), items: animals },
  { slug: "food", emoji: "🍚", color: "bg-orange-400", label: tri("Food", "भोजन"), items: food },
  { slug: "festivals", emoji: "🎊", color: "bg-grape-400", label: tri("Festivals", "उत्सव"), items: festivals },
  { slug: "dress", emoji: "🧥", color: "bg-sun-400", label: tri("Traditional Dress", "पारंपरिक पोशाक"), items: dress },
  { slug: "dresscode", emoji: "👔", color: "bg-berry-600", label: tri("Dress Code", "ड्रेस कोड"), items: dresscode },
];

// ---- Poems: ORIGINAL dummy verses, maximum 4 lines each -------------------
export const MAX_POEM_LINES = 4;

export interface Poem {
  id: string;
  emoji: string;
  color: string;
  title: Tri;
  lines: Record<Lang, string[]>;
}

export const poems: Poem[] = [
  {
    id: "rain",
    emoji: "🌧️",
    color: "bg-sky-400",
    title: tri("Little Rain", "नन्ही बारिश"),
    lines: {
      en: ["Little rain, little rain,", "Dance upon my window pane,", "Wash the hills and fill the stream,", "Wake the flowers from their dream."],
      hi: ["नन्ही बारिश, नन्ही बारिश,", "खिड़की पर तू नाचती आ,", "पहाड़ धो, नदी भर दे,", "फूलों को तू जगाती जा।"],
      tr: ["⟨T⟩ Little rain, little rain,", "⟨T⟩ Dance upon my window pane,", "⟨T⟩ Wash the hills and fill the stream,", "⟨T⟩ Wake the flowers from their dream."],
    },
  },
  {
    id: "hornbill",
    emoji: "🦜",
    color: "bg-sun-400",
    title: tri("Hornbill Friend", "धनेश दोस्त"),
    lines: {
      en: ["Hornbill, hornbill, up so high,", "Golden beak against the sky,", "Fly above the forest tall,", "Say good morning, friend to all."],
      hi: ["धनेश, धनेश, ऊँचे उड़ना,", "सुनहरी चोंच, आसमान छूना,", "ऊँचे जंगल के ऊपर जा,", "सबको सुप्रभात कहना।"],
      tr: ["⟨T⟩ Hornbill, hornbill, up so high,", "⟨T⟩ Golden beak against the sky,", "⟨T⟩ Fly above the forest tall,", "⟨T⟩ Say good morning, friend to all."],
    },
  },
  {
    id: "counting",
    emoji: "🌟",
    color: "bg-grape-400",
    title: tri("Count the Stars", "तारे गिनो"),
    lines: {
      en: ["One, two, three, four,", "Stars are peeping through the door,", "Five, six, seven, eight,", "Sleep tight, the hour is late."],
      hi: ["एक, दो, तीन, चार,", "तारे झाँकें द्वार-द्वार,", "पाँच, छह, सात, आठ,", "सो जा, अब हुई है रात।"],
      tr: ["⟨T⟩ One, two, three, four,", "⟨T⟩ Stars are peeping through the door,", "⟨T⟩ Five, six, seven, eight,", "⟨T⟩ Sleep tight, the hour is late."],
    },
  },
];

// ---- Typing passages -------------------------------------------------------
export const typingPassages: Record<Lang, string[]> = {
  en: ["The sun is up and the birds sing.", "I like to read and learn every day.", "Rivers run down from the green hills."],
  hi: ["सूरज निकला और चिड़िया गाने लगी।", "मुझे रोज़ पढ़ना और सीखना पसंद है।", "हरी पहाड़ियों से नदियाँ बहती हैं।"],
  tr: ["⟨T⟩ the sun is up and the birds sing.", "⟨T⟩ i like to read and learn every day.", "⟨T⟩ rivers run down from the green hills."],
};

// ---- Exam questions --------------------------------------------------------
export interface Question {
  id: string;
  prompt: Tri;
  options: Tri[];
  answer: number;
}

export const questions: Question[] = [
  { id: "q1", prompt: tri("Which animal has a golden beak?", "किस जानवर की चोंच सुनहरी होती है?"), options: [tri("Hornbill", "धनेश"), tri("Tiger", "बाघ"), tri("Fish", "मछली")], answer: 0 },
  { id: "q2", prompt: tri("What number comes after 4?", "4 के बाद कौन सी संख्या आती है?"), options: [tri("3", "3"), tri("5", "5"), tri("7", "7")], answer: 1 },
  { id: "q3", prompt: tri("A is for ...?", "A से क्या?"), options: [tri("Apple", "सेब"), tri("Dog", "कुत्ता"), tri("House", "घर")], answer: 0 },
  { id: "q4", prompt: tri("What do we wear on a school day?", "स्कूल के दिन हम क्या पहनते हैं?"), options: [tri("School uniform", "स्कूल यूनिफ़ॉर्म"), tri("Pyjamas", "पजामा"), tri("Raincoat", "रेनकोट")], answer: 0 },
];

export const UI: Record<string, Tri> = {
  title: tri("Learn & Play", "सीखो और खेलो"),
  home: tri("Home", "होम"),
  poems: tri("Poems", "कविताएँ"),
  typing: tri("Typing Speed", "टाइपिंग गति"),
  exam: tri("Exam", "परीक्षा"),
  game: tri("Match Game", "मिलान खेल"),
  drag: tri("Drag & Drop", "खींचो और छोड़ो"),
  admin: tri("Admin", "एडमिन"),
  play: tri("Play", "सुनो"),
  watch: tri("Watch", "देखो"),
  back: tri("Back", "वापस"),
  start: tri("Start", "शुरू करो"),
  submit: tri("Submit", "जमा करें"),
  next: tri("Next", "आगे"),
  again: tri("Try again", "फिर से"),
  great: tri("Great job!", "शाबाश!"),
  close: tri("Close", "बंद करो"),
  dressHint: tri("Tap a garment to put it on", "पहनने के लिए कपड़े पर टैप करें"),
  dressDone: tri("Ready for the festival!", "उत्सव के लिए तैयार!"),
  dressReset: tri("Take everything off", "सब उतारो"),
  replay: tri("Count again", "फिर से गिनो"),
};
