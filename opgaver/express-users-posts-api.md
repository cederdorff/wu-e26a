# Express Users & Posts API 🚀

I de tidligere øvelser har du arbejdet med Node.js, HTTP og Express.js.
Nu skal du **anvende det, du allerede har lært**, til at omskrive og
udbygge dit tidligere Users & Posts API.

Du får derfor mindre kode foræret end i de tidligere øvelser.

> 💡 Målet er ikke at følge en opskrift trin for trin. Målet er, at du
> selv kan overføre din viden om Express til et eksisterende problem.

## 1. Genbesøg dit HTTP-projekt

Find dit tidligere **Hello HTTP Module**-projekt frem. Kig især efter
kode med `request.method`, `request.url`, `response.statusCode`,
`response.setHeader()`, `response.end()` og `JSON.stringify()`.

Overvej, hvordan Express kan gøre implementeringen enklere.

## 2. Opret et nyt Express-projekt

Opret et **nyt projekt**. Prøv først uden at kigge i de tidligere
øvelser.

Projektet skal som minimum have: - et nyt Node.js-projekt - ES Modules -
Express installeret - `server.js` - et npm `start` script med watch

Når du er færdig, skal du kunne starte med:

```bash
npm start
```

Lav en simpel `GET /` route og test den.

> 💡 Sidder du fast, så brug `hello-express` som reference.

## 3. Users og Posts

Flyt data fra dit tidligere HTTP-projekt til det nye Express-projekt.
Organisér data i separate moduler, fx:

```text
express-users-posts-api/
├── data/
│   ├── users.js
│   └── posts.js
├── server.js
├── package.json
└── package-lock.json
```

Eksportér data og importér dem i `server.js`.

## 4. GET routes

Opret:

```text
GET /users
GET /posts
```

De skal returnere alle users/posts som JSON med `response.json()`.

Test status code, `Content-Type` og response body.

## 5. POST requests

Opret:

```text
POST /users
POST /posts
```

Begge routes skal modtage JSON. Husk den Express middleware, der gør
JSON tilgængelig som `request.body`.

En POST route skal: 1. læse request body 2. oprette et nyt objekt 3.
give objektet et id 4. tilføje det til det rigtige array 5. returnere
den nye resource som JSON 6. bruge en passende status code

Eksempel på user body:

```json
{
  "name": "Ada Lovelace",
  "mail": "ada@example.com",
  "title": "Developer"
}
```

Eksempel på post body:

```json
{
  "caption": "Learning Express.js 🚀",
  "uid": 1
}
```

> 💡 Returnér den resource, der netop er oprettet, frem for hele
> arrayet.

## 6. Route Parameters

Opret:

```text
GET /users/:userId
GET /posts/:postId
```

Et request til `GET /users/2` skal returnere useren med id 2. Et request
til `GET /posts/3` skal returnere posten med id 3.

Husk `request.params` og at værdier fra URL'en er strings.

## 7. 404 Not Found

Hvis fx `/users/999` eller `/posts/999` ikke findes, skal API'et
returnere `404 Not Found` og et JSON-response, fx:

```json
{
  "message": "User not found"
}
```

Test både ids, der findes, og ids, der ikke findes.

## 8. PUT requests

Opret:

```text
PUT /users/:userId
PUT /posts/:postId
```

Her kombinerer du:

```text
URL                    request body
 ↓                          ↓
resource id              nye værdier
```

Altså `request.params` og `request.body`.

Routen skal finde ressourcen, returnere 404 hvis den ikke findes,
opdatere den og returnere den opdaterede resource.

## 9. DELETE requests -- ekstra

⭐ **Ekstra opgave**

Opret:

```text
DELETE /users/:userId
DELETE /posts/:postId
```

Begge routes skal: 1. læse id'et fra URL'en 2. finde ressourcen 3.
returnere 404 hvis den ikke findes 4. fjerne ressourcen fra arrayet 5.
sende et passende response

Undersøg fx `findIndex()` og `splice()`.

## 10. Dit API indtil videre

```text
GET    /users
GET    /users/:userId
POST   /users
PUT    /users/:userId
DELETE /users/:userId

GET    /posts
GET    /posts/:postId
POST   /posts
PUT    /posts/:postId
DELETE /posts/:postId
```

CRUD HTTP Users Posts

---

Create POST `/users` `/posts`
Read GET `/users` `/posts`
Read one GET `/users/:userId` `/posts/:postId`
Update PUT `/users/:userId` `/posts/:postId`
Delete DELETE `/users/:userId` `/posts/:postId`

## 11. Men hvad sker der med data? 🤔

Opret en ny user med POST og kontrollér med GET, at den findes.

Stop serveren med `ctrl + c`, start den igen med `npm start`, og kald
GET igen.

### Hvad skete der?

Dataen er væk, fordi vi indtil videre kun ændrer JavaScript-arrays **i
memory**:

```text
POST /users
     ↓
JavaScript array i memory
     ↓
server stopper
     ↓
data forsvinder
```

Hvis data skal overleve en genstart, skal de gemmes et sted.

## 12. Persistence med File System -- ekstra

⭐ **Ekstra opgave**

Brug Node.js File System API til at gøre data persistent, fx i:

```text
data/users.json
data/posts.json
```

Når en user/post bliver oprettet, opdateret eller slettet, skal den
relevante JSON-fil opdateres.

### Test persistence

1.  start serveren
2.  opret en user med POST
3.  kontrollér med GET
4.  stop serveren
5.  start serveren igen
6.  kald GET igen

Hvis useren stadig findes, har du persistence 🎉

### Hint

Undersøg:

```js
node: fs / promises;
```

Tænk over:

```text
JavaScript data → JSON.stringify() → write file
JSON file → read file → JSON.parse() → JavaScript data
```

> 💡 Senere vil en database typisk overtage ansvaret for persistence.

## 13. Connect en frontend -- ekstra

⭐ **Ekstra opgave**

Opret en simpel frontend med HTML, CSS og JavaScript, som bruger
`fetch()` til at kommunikere med API'et.

Implementer fx: - vis alle users/posts - opret user/post - opdater
user/post - slet user/post

Fokus er kommunikationen:

```text
Frontend
   ↓ fetch()
HTTP request
   ↓
Express API
   ↓
route
   ↓
data
   ↓
HTTP response
   ↓
Frontend
```

## 14. CORS -- når browseren blander sig

Hvis frontend og API kører på forskellige origins, fx:

```text
Frontend: http://localhost:5500
API:      http://localhost:3333
```

kan browseren blokere requests på grund af CORS.

Hvis du oplever en CORS-fejl, undersøg først fejlen. Installer og
konfigurer derefter `cors` middleware, som du kender fra
`hello-express`.

> 💡 Pointen er, at CORS først bliver rigtig interessant, når du faktisk
> oplever problemet i browseren.

## Udfordringer

Hvis du bliver hurtigt færdig, kan du fx: - validere request body ved
POST - returnere `400 Bad Request`, hvis properties mangler - sikre at
ids er gyldige numbers - lave `GET /users/:userId/posts` - undersøge
forskellen mellem PUT og PATCH - strukturere routes i separate filer -
lave genbrugelig File System-kode

# Reflektér over din læring

Når du er færdig, skal du gerne kunne forklare:

1.  Hvordan omsætter Express `request.method` og `request.url` til
    routes?
2.  Hvorfor bruger vi `response.json()`?
3.  Hvad gør `express.json()`?
4.  Hvad er forskellen på `request.params` og `request.body`?
5.  Hvordan finder du en resource ud fra et route parameter?
6.  Hvornår returnerer du `201 Created`?
7.  Hvornår returnerer du `404 Not Found`?
8.  Hvordan hænger GET, POST, PUT og DELETE sammen med CRUD?
9.  Hvorfor forsvinder data, når serveren genstarter?
10. Hvad betyder persistence?
11. Hvordan kan File System bruges til persistence?
12. Hvordan kommunikerer en frontend med dit API?
13. Hvornår bliver CORS relevant?

## Det vigtigste

I `hello-express` blev du guidet gennem de centrale Express-koncepter.
Her anvender du dem selv:

```text
HTTP request
      ↓
Express route
      ↓
params / body
      ↓
data og logik
      ↓
HTTP response
```

Med persistence:

```text
Express API
     ↓
File System
     ↓
JSON files
```

Du er dermed gået fra at **følge en Express-implementering** til selv at
**designe og implementere et simpelt HTTP API**.
