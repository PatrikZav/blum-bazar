/* Vytvořil jsem ukázkové inzeráty */
import { db } from "./index";
import { listing } from "./schemas";

await db.insert(listing).values([
  {
    title: "Dětská židle",
    description: "Dětská jídelní židle IKEA Antilop, dobrý stav, použitá 2 roky.",
    price: 300,
    isFree: false,
    category: "Dětské věci",
    status: "Dostupné",
    contact: "jana.novakova@blogic.cz",
  },
  {
    title: 'Starší monitor 24"',
    description: "Dell monitor 24 palců, Full HD, HDMI + VGA. Funguje bez problémů.",
    price: 800,
    isFree: false,
    category: "Elektronika",
    status: "Dostupné",
    contact: "petr.svoboda@blogic.cz",
  },
  {
    title: "Krabice knih",
    description: "Asi 20 knih — detektivky, romány a pár odborných. Vezmi si co chceš.",
    price: null,
    isFree: true,
    category: "Knihy",
    status: "Dostupné",
    contact: "marie.horakova@blogic.cz",
  },
  {
    title: "Konferenční stolek",
    description: "Dřevěný konferenční stolek, rozměr 90x50 cm. Pár škrábanců ale jinak OK.",
    price: 500,
    isFree: false,
    category: "Nábytek",
    status: "Dostupné",
    contact: "tomas.kral@blogic.cz",
  },
  {
    title: "Zimní bunda vel. M",
    description: "Černá zimní bunda, velikost M, nosila jsem ji 1 sezónu.",
    price: 200,
    isFree: false,
    category: "Oblečení",
    status: "Rezervováno",
    contact: "lucie.mala@blogic.cz",
  },
]);

console.log("Hotovo! Data jsou v databázi.");
