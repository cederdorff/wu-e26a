# Opgaver

Her er alle opgaver samlet i den rækkefølge, du laver dem.

Der er to spor. AMAbot-øvelserne er dit eget projekt, som du bygger videre på hele forløbet. Students-opgaverne er et separat projekt, hvor du træner et nyt mønster på et enkelt eksempel, før du bruger det i din AMAbot.

Vil du vide, hvor du skal hoppe ind? Find den første øvelse, du ikke har lavet færdig, og start dér.

## AMAbot-øvelser

1. [Øvelse 1: Din første server-renderede EJS-app](express-ejs-formular.md)\
   En lille Express-app med en formular. Serveren modtager et navn og svarer med en hilsen via EJS. Du lærer `GET` og `POST`, `request.body` og `response.render()`.
2. [Øvelse 2: Formhåndtering, validering og svarlogik](express-ejs-formhaandtering-svarlogik.md)\
   Samme projekt som øvelse 1. Du tilføjer alder, validerer data på serveren, viser fejlbeskeder og gemmer gyldige navne i et array.
3. [Øvelse 3: Server-renderet AMAbot med regelbaseret svarlogik](express-ejs-amabot.md)\
   Din AMAbot-formular fra `index.html` bliver en Express-app med EJS. Serveren finder et svar med `findAnswer()` ud fra regler, arrays og objekter.
4. [Øvelse 4: Gør AMAbotten klogere med scoring og statistik](express-ejs-amabot-statistik.md)\
   Botten tjekker alle regler og vælger den, der matcher flest nøgleord (`findBestAnswer()`). Du viser også statistik over samtalen.
   - Ekstra træning: [JavaScript-øvelser til AMAbot](javascript-oevelser-amabot.md). Træn `if`/`else`, objekter, arrays, `for...of` og stringmetoder hver for sig. Brug den, hvis `findAnswer()` er svær at følge.
5. [Øvelse 5: Gem AMAbottens chathistorik i en JSON-fil](express-ejs-amabot-persistens.md)\
   Samtalen overlever en genstart af serveren. Du gemmer beskederne i `data/messages.json` med `loadMessages()` og `saveMessages()`.
6. [Øvelse 6: AMAbotten som REST API](express-rest-api-amabot.md)\
   Du fjerner EJS og deler projektet i `client/` og `server/`. Serveren bliver et rent REST API for `/messages` og `/answers`, som du tester med Thunder Client.
7. [Øvelse 7: AMAbotten i lag — routes og data-modul](express-rest-api-amabot-arkitektur.md)\
   Du deler `server.js` op i routes-filer med `express.Router()` og et data-modul. Ingen hints. Du bruger samme opskrift som i arkitektur-øvelsen.
8. [Øvelse 8: AMAbotten får en frontend — fetch og DOM](fetch-dom-amabot.md)\
   `client/index.html` bliver en statisk side, der taler med dit API via `fetch()`. Du henter, sender og sletter beskeder uden at genindlæse siden.
9. [Øvelse 9: AMAbotten bliver sikker og fejltolerant](express-rest-api-amabot-sikkerhed-og-fejlhaandtering.md)\
   Du overfører statuskoder, `404`/`400`-tjek og fejl-middleware til AMAbotten. Derefter strammer du `cors()` op og lukker et XSS-hul i `POST /messages`.

## Students-opgaver

Lav hver students-opgave før den AMAbot-øvelse, den hører til.

1. [JSON-øvelse: Studerende i en JSON-fil](express-ejs-json-students.md) — før øvelse 5\
   En lille server med EJS, der læser og gemmer studerende i en JSON-fil. Du træner read → modify → write med `fs.readFile()` og `fs.writeFile()`.
2. [REST API-øvelse: Studerende med CRUD](express-rest-api-students.md) — før øvelse 6\
   Et nyt projekt uden EJS. Du bygger fuld CRUD for `/students`, først med et array i memory og derefter med en JSON-fil.
3. [REST API-øvelse: Arkitektur — routes, data, controllers og filtrering](express-rest-api-arkitektur.md) — før øvelse 7\
   Du tilføjer `/teachers`, deler API'et op i routes og et data-modul og tilføjer filtrering, sortering og paginering. Controllers er frivilligt.
4. [REST API-øvelse: Fejlhåndtering](express-rest-api-fejlhaandtering.md) — før øvelse 9\
   Du gør statuskoderne eksplicitte, tilføjer `404`- og `400`-tjek og samler fejl i en fælles fejl-middleware.

## Kom i gang med Node og Express

Opvarmning fra første gang. Lav dem før AMAbot-øvelse 1.

1. [Hello Node.js](hello-node.md)\
   Dit første Node-projekt. Du bruger `npm`, `package.json`, `node --watch` og npm scripts.
2. [Hello HTTP Module](hello-http-module.md)\
   En HTTP-server uden Express, med `node:http`. Du arbejder med request og response, statuskoder, headers og JSON.
3. [Hello Express.js](hello-express.md)\
   Samme slags server, men med Express. Du lærer routing, middleware, route parameters og CRUD.
4. [Node.js File System](node-file-system.md) — ekstra øvelse\
   Du læser og skriver JSON-filer med `node:fs/promises`.
5. [Express Users & Posts API](express-users-posts-api.md)\
   Du omskriver dit Users & Posts API fra HTTP-modulet til Express. Du får mindre kode givet end i de andre øvelser.
