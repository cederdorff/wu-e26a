# Node.js File System ⭐

> **Ekstra øvelse**

I denne øvelse skal du arbejde med Node.js' indbyggede **File System
API**.

Indtil videre har dine data typisk ligget direkte i JavaScript-filer
eller i memory. Nu skal du lære at **læse og skrive data i filer**.

Du kommer til at arbejde med:

-   `node:fs/promises`
-   `readFile()`
-   `writeFile()`
-   JSON-filer
-   `JSON.parse()`
-   `JSON.stringify()`
-   persistence

> 💡 Målet er at forstå sammenhængen:
>
> **read → modify → write**

------------------------------------------------------------------------

# 1. Arbejd videre på Hello HTTP Module

I denne øvelse skal du arbejde videre på dit tidligere:

``` text
hello-http-module
```

Du har allerede en Node.js HTTP-server med routes til blandt andet:

``` text
GET /users
GET /posts
```

og data i JavaScript-filer.

Lav gerne en kopi af projektet, hvis du vil bevare den oprindelige
version.

------------------------------------------------------------------------

# 2. Fra JavaScript til JSON

Find dine posts.

De ligger sandsynligvis i en fil som:

``` text
data/posts.js
```

Opret i stedet:

``` text
data/posts.json
```

Flyt dine posts til JSON-filen.

### JavaScript og JSON er ikke helt det samme

I JavaScript kan data fx se sådan ud:

``` js
export const posts = [
  {
    id: 1,
    caption: "Hello Node.js",
    uid: 1
  }
];
```

I en JSON-fil skal det være:

``` json
[
  {
    "id": 1,
    "caption": "Hello Node.js",
    "uid": 1
  }
]
```

Læg mærke til:

-   ingen `export`
-   property names bruger dobbelte citationstegn
-   strings bruger dobbelte citationstegn

Når `posts.json` er klar, kan du slette `posts.js`.

------------------------------------------------------------------------

# 3. Importer File System

Node.js har et indbygget File System API.

Importer det øverst i `app.js`:

``` js
import fs from "node:fs/promises";
```

> 💡 `node:fs/promises` er en del af Node.js. Du skal derfor ikke
> installere noget med npm.

File System API'et gør det muligt at arbejde med filer og mapper på den
computer eller server, hvor Node.js kører.

Vi starter med at **læse en fil**.

------------------------------------------------------------------------

# 4. Læs posts.json

Find din:

``` text
GET /posts
```

route.

I stedet for at hente posts fra et importeret JavaScript-array skal du
nu læse:

``` text
data/posts.json
```

Brug:

``` js
fs.readFile()
```

Fx:

``` js
const data = await fs.readFile("./data/posts.json", "utf8");
```

### Hvorfor await?

`readFile()` er asynchronous.

Det betyder, at det tager noget tid at læse filen, og vi skal vente på
resultatet.

Din callback skal derfor være `async`.

Fx:

``` js
async (request, response) => {
  // ...
}
```

### Test først

Log dataen:

``` js
console.log(data);
```

Kald:

``` text
GET /posts
```

Hvad ser du i terminalen?

------------------------------------------------------------------------

# 5. Send filens indhold

Dataen fra:

``` js
fs.readFile("./data/posts.json", "utf8");
```

er tekst.

Men fordi indholdet allerede er formateret som JSON, kan vi sende
teksten direkte i vores HTTP response.

Sørg for at bruge:

``` text
Content-Type: application/json
```

og send dataen med:

``` js
response.end(data);
```

### Checkpoint

Kald:

``` text
GET /posts
```

i Postman eller Thunder Client.

Kontroller:

-   status code
-   `Content-Type`
-   response body

Du har nu ændret dataflowet fra:

``` text
posts.js
   ↓
import
   ↓
server
```

til:

``` text
posts.json
    ↓
readFile()
    ↓
server
    ↓
HTTP response
```

------------------------------------------------------------------------

# 6. Gentag med users

Nu er det din tur.

Opret:

``` text
data/users.json
```

Flyt dine users fra JavaScript til JSON.

Tilpas derefter:

``` text
GET /users
```

så data bliver læst fra `users.json` med File System API'et.

### Checkpoint

Disse routes skal stadig fungere:

``` text
GET /users
GET /posts
```

Men data kommer nu fra JSON-filer i stedet for JavaScript-moduler.

------------------------------------------------------------------------

# Fra JSON til JavaScript

## 7. JSON.parse()

Indtil videre har vi kun **læst og sendt** JSON-filen.

Men hvad hvis vi vil ændre dataen?

Når du bruger:

``` js
const data = await fs.readFile("./data/users.json", "utf8");
```

er `data` en string.

Prøv:

``` js
console.log(typeof data);
```

Hvis vi vil bruge JavaScript-metoder som:

``` js
push()
find()
filter()
```

skal JSON-teksten først konverteres til JavaScript-data.

Det gør vi med:

``` js
JSON.parse()
```

Prøv:

``` js
const users = JSON.parse(data);

console.log(users);
console.log(Array.isArray(users));
```

### Dataflowet er nu

``` text
users.json
    ↓
readFile()
    ↓
JSON text
    ↓
JSON.parse()
    ↓
JavaScript array
```

------------------------------------------------------------------------

# 8. Ændr data i memory

Nu kan du arbejde med `users` som et almindeligt JavaScript-array.

Opret fx en ny user:

``` js
const newUser = {
  id: Date.now(),
  name: "Ada Lovelace",
  mail: "ada@example.com",
  title: "Developer"
};
```

Tilføj den:

``` js
users.push(newUser);
```

Log resultatet:

``` js
console.log(users);
```

### Er useren gemt?

Åbn:

``` text
data/users.json
```

Er Ada blevet tilføjet?

Nej.

Du har kun ændret JavaScript-arrayet **i memory**.

``` text
users.json
    ↓
readFile()
    ↓
JSON.parse()
    ↓
users array
    ↓
push()
    ↓
ændret i memory
```

JSON-filen er stadig uændret.

Vi mangler at **skrive ændringen tilbage til filen**.

------------------------------------------------------------------------

# 9. Fra JavaScript til JSON igen

`writeFile()` skal have noget data, den kan skrive til filen.

Konverter derfor `users` tilbage til JSON:

``` js
const json = JSON.stringify(users);
```

Prøv:

``` js
console.log(json);
console.log(typeof json);
```

Vi har nu lavet den modsatte konvertering:

``` text
JavaScript array
      ↓
JSON.stringify()
      ↓
JSON text
```

### Gør JSON-filen læsbar

Du kan også bruge:

``` js
JSON.stringify(users, null, 2);
```

Det formaterer JSON med indrykning, så filen er lettere at læse.

------------------------------------------------------------------------

# 10. Skriv til users.json

Nu kan vi gemme ændringen.

Brug:

``` js
await fs.writeFile("./data/users.json", json);
```

`writeFile()` er også asynchronous, så vi bruger `await`.

Åbn derefter:

``` text
data/users.json
```

Er den nye user blevet gemt?

🎉 Du har nu skrevet data til en fil med Node.js.

------------------------------------------------------------------------

# 11. Read → modify → write

Det vigtigste mønster i øvelsen er:

``` text
users.json
     ↓
fs.readFile()
     ↓
JSON.parse()
     ↓
JavaScript array
     ↓
ændr data
     ↓
JSON.stringify()
     ↓
fs.writeFile()
     ↓
users.json
```

Eller helt kort:

``` text
READ
 ↓
MODIFY
 ↓
WRITE
```

Det er den mentale model, du især skal tage med fra øvelsen.

------------------------------------------------------------------------

# 12. Brug det i en POST route

Nu kan du koble File System sammen med din HTTP-server.

Opret eller tilpas:

``` text
POST /users
```

Til denne øvelse må den nye user gerne være hardcoded:

``` js
const newUser = {
  id: Date.now(),
  name: "Ada Lovelace",
  mail: "ada@example.com",
  title: "Developer"
};
```

Din route skal:

1.  læse `users.json`
2.  parse JSON til et JavaScript-array
3.  tilføje `newUser`
4.  konvertere arrayet tilbage til JSON
5.  skrive JSON tilbage til `users.json`
6.  sende et passende response

### Test med Postman

Kald:

``` text
POST /users
```

Kontroller derefter:

``` text
GET /users
```

og åbn:

``` text
data/users.json
```

Er den nye user gemt begge steder?

------------------------------------------------------------------------

# 13. Test persistence

Nu kommer den vigtige test.

1.  Kald `POST /users`
2.  Kontroller med `GET /users`, at useren findes
3.  Stop serveren med `ctrl + c`
4.  Start serveren igen
5.  Kald `GET /users` igen

Findes den nye user stadig?

Hvis ja, har du lavet **persistence**.

### Før

Når data kun ligger i memory:

``` text
server
  ↓
array
  ↓
server stopper
  ↓
data forsvinder
```

### Nu

Når data gemmes i en fil:

``` text
server
  ↓
users.json
  ↓
server stopper
  ↓
filen eksisterer stadig
  ↓
server starter
  ↓
data kan læses igen
```

> 💡 Persistence betyder, at data kan overleve, selvom programmet eller
> serveren stopper.

------------------------------------------------------------------------

# 14. Gentag med posts ⭐

Nu er det din tur til at overføre det, du har lært.

Tilpas:

``` text
POST /posts
```

så den:

-   læser `posts.json`
-   parser data
-   tilføjer en ny post
-   konverterer til JSON
-   skriver tilbage til `posts.json`
-   sender et response

Test derefter persistence ved at genstarte serveren.

------------------------------------------------------------------------

# 15. Hvad kan File System ellers?

File System API'et kan meget mere end at arbejde med JSON.

Du kan blandt andet:

-   læse filer
-   skrive filer
-   oprette filer
-   slette filer
-   omdøbe filer
-   arbejde med mapper
-   undersøge indholdet af mapper

Prøv fx at skrive til:

``` text
log.txt
```

med:

``` js
await fs.writeFile("log.txt", "Hello File System");
```

Åbn filen bagefter.

### Prøv selv

Kan du fx gemme:

``` text
Server started
```

i en tekstfil?

Eller undersøge, hvordan du kan tilføje tekst til en eksisterende fil i
stedet for at overskrive den?

> 💡 File System er ikke kun til JSON. Det kan bruges til mange typer
> filer og server-side opgaver.

------------------------------------------------------------------------

# 🧪 Udfordringer

Hvis du vil gå videre, kan du undersøge:

-   `appendFile()`
-   `mkdir()`
-   `readdir()`
-   `rename()`
-   `unlink()`

Du kan fx prøve at:

-   oprette en mappe
-   liste alle filer i en mappe
-   oprette en logfil
-   tilføje nye log entries
-   omdøbe en fil
-   slette en fil

------------------------------------------------------------------------

# ✅ Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1.  Hvad er Node.js File System API?
2.  Hvorfor bruger vi `node:fs/promises`?
3.  Hvad gør `fs.readFile()`?
4.  Hvorfor bruger vi `await` med `readFile()`?
5.  Hvilken datatype får vi, når vi læser en JSON-fil som `"utf8"`?
6.  Hvad gør `JSON.parse()`?
7.  Hvad gør `JSON.stringify()`?
8.  Hvad gør `fs.writeFile()`?
9.  Hvorfor er `push()` på et array ikke nok til at gemme ændringen?
10. Hvad betyder persistence?
11. Hvad betyder mønstret **read → modify → write**?
12. Hvad kan File System bruges til ud over JSON-filer?

## Det vigtigste

Du behøver ikke kunne huske alle File System-metoder udenad.

Det vigtigste er, at du forstår dataflowet:

``` text
FILE
 ↓
readFile()
 ↓
JSON.parse()
 ↓
JAVASCRIPT
 ↓
modify
 ↓
JSON.stringify()
 ↓
writeFile()
 ↓
FILE
```

Senere kan samme grundidé bruges, når dit Express API skal gemme
ændringer permanent.

En JSON-fil er dog kun en simpel form for persistence. I større
applikationer vil vi typisk bruge en **database** til at gemme og
håndtere data.
