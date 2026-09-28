# Task Planner – Mobile

En mobilapp byggd med React Native och Expo. Appen använder samma ASP.NET Core-API
och databas som webbappen.

## Funktioner

- Lista, skapa, redigera och ta bort uppgifter.
- Välja status och ett valfritt förfallodatum.
- Ladda upp en fil till en uppgift och öppna bilagan.
- Dra nedåt i listan för att hämta uppgifterna igen.
- Visa felmeddelanden när API-anrop misslyckas.

En uppgift har en bilaga åt gången. En ny uppladdning ersätter kopplingen till
den tidigare bilagan. Sökning och statusfilter finns inte i mobilappen.

## Det du behöver

- Git och Node.js med npm. Expo SDK 57 kräver minst Node.js 22.13.
- Expo Go på telefonen, med stöd för projektets Expo SDK 57.
- Backend-projektet och .NET SDK 10.
- Dator och telefon på samma wifi, där enheterna kan nå varandra.

Appen har testats manuellt på iPhone med Expo Go. Android och Expo Web har inte
verifierats. Instruktionerna nedan gäller en fysisk telefon.

## 1. Starta backend

Följ [backendens README](https://github.com/nicolinawegert-cmd/TaskPlanner#readme)
för att klona repot, installera paketen och skapa databasen.

När du ska använda mobilappen, kör följande i backendens projektmapp
i stället för vanlig `dotnet run`:

```sh
dotnet run --launch-profile http --urls "http://0.0.0.0:5035"
```

Det gör att API:t kan nås från telefonen, inte bara från datorn.
Låt terminalen vara igång. Använd detta på ett betrott lokalt nätverk.

En ny databas är tom. Skapa en uppgift i mobilappen eller webbappen för att testa.

## 2. Installera mobilprojektet

Öppna en annan terminal och kör:

```sh
git clone https://github.com/nicolinawegert-cmd/TaskPlanner.Mobile.git
cd TaskPlanner.Mobile
npm ci
```

## 3. Ange API-adressen

Kopiera `.env.example` till en ny fil som heter `.env.local` i mobilprojektets rot.
På Mac kan du använda följande kommando vid första installationen:

```sh
cp .env.example .env.local
```

Ta reda på datorns lokala IP-adress. På Mac fungerar vanligtvis:

```sh
ipconfig getifaddr en0
```

Om kommandot inte visar något, kontrollera IP-adressen i datorns wifi-inställningar.
På Windows kan du köra `ipconfig` och leta efter wifi-anslutningens IPv4-adress.

Öppna `.env.local` och fyll i:

```env
EXPO_PUBLIC_API_URL=http://DIN-DATORS-IP:5035/api/tasks
```

Ersätt `DIN-DATORS-IP` med datorns riktiga adress. Använd inte `localhost`
eller `0.0.0.0` här: på telefonen betyder `localhost` telefonen själv.

Öppna samma adress i telefonens webbläsare. Du ska se JSON med uppgifter,
eller `[]` om databasen är tom.

`.env.local` är ignorerad av Git. `.env.example` visar vilken inställning som behövs.
Variabler som börjar med `EXPO_PUBLIC_` ingår i appen och ska inte innehålla hemligheter.

## 4. Starta mobilappen

Kör i mobilprojektets terminal:

```sh
npx expo start
```

Skanna QR-koden med iPhones kamera och öppna länken i Expo Go.
På Android kan QR-koden skannas från Expo Go.

Låt både Expo och backend vara igång. Stoppa dem med `Ctrl+C` i respektive terminal.

Om du ändrar API-adressen behöver appen laddas om i Expo Go. Datorns IP-adress
kan ändras när du byter nätverk.

## Hur koden är uppdelad

- `App.js` håller uppgiftslistan och kopplar ihop komponenterna.
- `src/services/taskService.js` samlar API-anropen och adressen till bilagorna.
- `src/components/TaskForm/` innehåller formulären och gemensamma status- och datumval.
- `src/components/FileUpload/` hanterar filval och uppladdningsknappen.
- `src/components/TaskAttachment/` visar och öppnar bilagor.
- `src/utils/dateUtils.js` omvandlar datum mellan formulären och API:t.

## Tekniska val

React Native används för mobilens gränssnitt och Expo Go för att enkelt testa
på en riktig telefon utan att publicera appen i en appbutik.

Formulären använder `useState` för inmatningar och `useEffect` används för att
hämta uppgifter vid start. Status- och datumval är egna komponenter som återanvänds
vid både skapande och redigering.

API-anropen ligger i en servicefil så att nätverkskoden hålls isär från
gränssnittet. Uppgifter skickas som JSON. Filuppladdningen använder
`FormData`, ett `File`-objekt från `expo-file-system` och `expo/fetch`.
`expo-document-picker` används för att välja filen på telefonen.

Datumväljaren låter användaren välja en kalenderdag utan att skriva datumet
manuellt. Datumfunktionerna behåller den valda dagen utan att konvertera den till UTC.

Mobilappen och webbappen läser samma data från backend, men har ingen
realtidssynkronisering. Dra nedåt i mobilens lista för att se ändringar från webben.
HTTP används för lokal testning; vid publicering skulle API:t behöva HTTPS.

## Om anslutningen inte fungerar

- Kontrollera att backend körs med kommandot i steg 1.
- Kontrollera IP-adressen i `.env.local` och att telefonen når API:t i webbläsaren.
- Kontrollera att datorn och telefonen är på samma nätverk. Gästnätverk, VPN eller
  en brandvägg kan hindra anslutningen.
- Ladda om appen efter ändrad API-adress. Om du ändrat den medan Expo kördes och
  den gamla adressen fortfarande används, starta om Expo.
- När backend är igång igen, tryck **Try again** eller dra nedåt i listan.

Om Expo verkar använda gammal kod kan du stoppa Expo och köra:

```sh
npx expo start --clear
```

## Relaterade projekt

- [Webbappen](https://github.com/nicolinawegert-cmd/TaskPlanner.Web)
- [Backend](https://github.com/nicolinawegert-cmd/TaskPlanner)
- [Expo SDK 57 och versionskrav](https://docs.expo.dev/versions/v57.0.0/)
