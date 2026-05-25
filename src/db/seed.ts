/* Vytvořil jsem ukázkové inzeráty */
import { db } from "./index";
import { listing } from "./schemas";

await db.insert(listing).values([
  // ======================
  // 🪑 NÁBYTEK
  // Patrik + Petr
  // ======================

  {
    title: "Kancelářská židle ErgoFlex",
    description: "Ergonomická kancelářská židle s nastavitelnou výškou a opěrkou zad.",
    price: 900,
    isFree: false,
    category: "Nábytek",
    status: "Dostupné",
    contact: "patazavadil@seznam.cz",
    userId: 2,
  },
  {
    title: "Dřevěný jídelní stůl",
    description: "Masivní jídelní stůl pro 4 osoby, stabilní konstrukce.",
    price: 3000,
    isFree: false,
    category: "Nábytek",
    status: "Dostupné",
    contact: "petr.svoboda@blogic.cz",
    userId: 7,
  },

  // ======================
  // 🧸 DĚTSKÉ VĚCI
  // Lucie + Tereza
  // ======================

  {
    title: "Dětská autosedačka",
    description: "Autosedačka 0–18 kg, po jednom dítěti, čistá a nebouraná.",
    price: 800,
    isFree: false,
    category: "Dětské věci",
    status: "Dostupné",
    contact: "lucie.dvorakova@blogic.cz",
    userId: 8,
  },
  {
    title: "Sportovní kočárek",
    description: "Lehký kočárek vhodný na cestování, snadno složitelný.",
    price: 1200,
    isFree: false,
    category: "Dětské věci",
    status: "Dostupné",
    contact: "tereza.mala@blogic.cz",
    userId: 9,
  },

  // ======================
  // 👕 OBLEČENÍ
  // David + Martin
  // ======================

  {
    title: "Zimní bunda Nike",
    description: "Teplá zimní bunda, dobrý stav, lehce nošená.",
    price: 700,
    isFree: false,
    category: "Oblečení",
    status: "Dostupné",
    contact: "david.prochazka@blogic.cz",
    userId: 10,
  },
  {
    title: "Tenisky Adidas",
    description: "Sportovní boty, lehce nošené, stále pohodlné.",
    price: 500,
    isFree: false,
    category: "Oblečení",
    status: "Dostupné",
    contact: "martin.kral@blogic.cz",
    userId: 11,
  },

  // ======================
  // 💻 ELEKTRONIKA
  // Patrik + Petr
  // ======================

  {
    title: "Notebook HP",
    description: "Funkční notebook vhodný na školu i práci.",
    price: 2500,
    isFree: false,
    category: "Elektronika",
    status: "Dostupné",
    contact: "patazavadil@seznam.cz",
    userId: 2,
  },
  {
    title: 'Starší monitor 24"',
    description: "Dell monitor 24 palců, Full HD, HDMI + VGA. Plně funkční.",
    price: 800,
    isFree: false,
    category: "Elektronika",
    status: "Dostupné",
    contact: "petr.svoboda@blogic.cz",
    userId: 7,
  },

  // ======================
  // 📚 KNIHY
  // Lucie + Tereza
  // ======================

  {
    title: "Harry Potter série",
    description: "Kompletní knižní série v dobrém stavu.",
    price: 800,
    isFree: false,
    category: "Knihy",
    status: "Dostupné",
    contact: "lucie.dvorakova@blogic.cz",
    userId: 8,
  },
  {
    title: "Učebnice matematiky SŠ",
    description: "Středoškolská matematika, lehce popsaná.",
    price: 150,
    isFree: false,
    category: "Knihy",
    status: "Dostupné",
    contact: "tereza.mala@blogic.cz",
    userId: 9,
  },

  // ======================
  // 📦 OSTATNÍ
  // David + Martin
  // ======================

  {
    title: "Fitness sada (činky + gumy)",
    description: "Domácí fitness vybavení pro cvičení.",
    price: 900,
    isFree: false,
    category: "Ostatní",
    status: "Dostupné",
    contact: "david.prochazka@blogic.cz",
    userId: 10,
  },
  {
    title: "Horské kolo",
    description: "Starší, ale plně funkční horské kolo.",
    price: 2000,
    isFree: false,
    category: "Ostatní",
    status: "Dostupné",
    contact: "martin.kral@blogic.cz",
    userId: 11,
  },
]);

console.log("Hotovo! Data jsou v databázi.");
