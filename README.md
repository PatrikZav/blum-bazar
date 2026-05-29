# Blogic Bazar

Interní bazarová aplikace pro zaměstnance firmy Blogic. Umožňuje nabízet věci k prodeji nebo přenechání zdarma mezi kolegy.

## Ukázky

### Domovská stránka
![Domovská stránka](docs/assets/screens/home.png)

### Přehled inzerátů
![Přehled inzerátů](docs/assets/screens/listings.png)

### Vytvoření inzerátu
![Vytvoření inzerátu](docs/assets/screens/novy-inzerat.png)

### Detail inzerátu
![Detail inzerátu](docs/assets/screens/detail.png)

### Platba přes QR kód
![QR platba](docs/assets/screens/payment.png)

### Kontaktní formulář
![Kontaktní formulář](docs/assets/screens/kontaktni-formular.png)

### Zanechání recenze
![Zanechání recenze](docs/assets/screens/zanechani-recenze.png)

### Zobrazení mých recenzí
![Zobrazení mých recenzí](docs/assets/screens/moje-recenze.png)

### Zobrazení obdržených recenzí
![Zobrazení obdržených recenzí](docs/assets/screens/obdrzene-recenze.png)

### Registrace
![Registrace](docs/assets/screens/registrace.png)

### Přihlášení
![Přihlášení](docs/assets/screens/login.png)

### Nastavení účtu
![Nastavení účtu](docs/assets/screens/nastaveni-uctu.png)

### Admin rozhraní - správa uživatelů
![Admin rozhraní - správa uživatelů](docs/assets/screens/sprava-uzivatelu.png)

## Funkce

- Přehled inzerátů s filtrováním podle kategorie a vyhledáváním
- Detail inzerátu s fotografií a mapou lokality
- Přidání, úprava a smazání inzerátu
- Nahrání obrázku ze zařízení nebo přes URL
- Přihlášení a registrace uživatelů
- Role admin — správa všech inzerátů a uživatelů
- Oblíbené inzeráty
- Recenze prodávajících s hodnocením hvězdičkami
- Platba přes QR kód generovaný z čísla účtu (SPD formát)
- Rezervace inzerátu přes platební okno
- Kontaktování prodávajícího emailem
- Dropdown menu s nastavením účtu

## Technologie

| Technologie | Použití |
|---|---|
| Next.js 16 | Framework — routing, server komponenty, server akce |
| React 19 | Uživatelské rozhraní |
| TypeScript | Typový systém |
| Mantine UI | Komponenty uživatelského rozhraní |
| Drizzle ORM | Práce s databází |
| SQLite | Lokální databáze |
| bcryptjs | Hashování hesel |
| qrcode | Generování QR kódů |
| Resend | Odesílání emailů |
| Leaflet | Interaktivní mapa |
| next-intl | Lokalizace |

## Spuštění projektu

### Požadavky
- Node.js 20+
- npm

### Instalace

```powershell
# Naklonuj repozitář
git clone https://github.com/PatrikZav/blum-bazar.git
cd blum-bazar

# Nainstaluj závislosti
npm install

# Vytvoř soubor .env.local a přidej API klíč pro Resend
# RESEND_API_KEY=tvůj_klíč

# Připrav databázi
npm run db:migrate

# Vlož ukázková data
npx tsx src/db/seed.ts

# Spusť vývojový server
npm run dev
```

Aplikace bude dostupná na `http://localhost:3000`.

### Příkazy

| Příkaz | Popis |
|---|---|
| `npm run dev` | Spustí vývojový server |
| `npm run build` | Sestaví produkční build |
| `npm run start` | Spustí produkční server |
| `npm run db:migrate` | Spustí migrace databáze |
| `npm run db:studio` | Otevře Drizzle Studio |
| `npm run lint` | Zkontroluje kód |
| `npm run format` | Naformátuje kód |

## Autor

Patrik Zavadil — praxe ve firmě Blogic, květen 2026
