# Chatbot: UI-forbedringer

## Kort fortalt

Chatbotten virker. Du kan logge ind, se dine egne tråde og få svar fra AI'en. Men den føles ikke færdig. Teksten bliver stående, når du har sendt. Enter giver en ny linje i stedet for at sende. Et klik på × sletter en tråd uden at spørge.

I denne opgave retter du de små ting, der gør en stor forskel for brugeren. Det er ikke et step i tutorialen. Løsningsforslagene står her i opgaven.

Du ændrer kun frontenden. Backenden er den samme som efter step 18.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under øvelsen. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

## Det bygger du

| Problem | Øvelse | Fil |
| --- | --- | --- |
| Enter sender ikke | Øvelse 2, trin 1 | `components/Chat.jsx` |
| Teksten bliver stående efter afsendelse | Øvelse 2, trin 2 | `components/Chat.jsx` |
| Du kan sende igen, mens AI'en tænker | Øvelse 2, trin 3 | `components/Chat.jsx` |
| Teksten følger med, når du skifter tråd | Øvelse 2, trin 4 | `routes/chat-thread.jsx` |
| Du skal selv scrolle ned til svaret | Øvelse 3, trin 1 | `components/Chat.jsx` |
| Tekstfeltet er altid én linje højt | Øvelse 3, trin 2 | `app.css` |
| × sletter uden at spørge | Øvelse 4 | `components/Sidebar.jsx` |
| Fanen hedder altid "Chatbot" | Øvelse 5, trin 1 | `root.jsx`, `routes/chat-thread.jsx` |
| En tom søgning viser ingenting | Øvelse 5, trin 2 | `components/Sidebar.jsx` |

Alle filer ligger i `frontend/app`.

## Kom i gang

Du skal have lavet [step 18](chatbot-step-18-send-til-login.md) og AI-svarene fra [PR 19](https://github.com/bewildergeist/chatbot-react-postgres/pull/19). Start backend og frontend, som du plejer. Log ind på `/login`.

Commit, før du går i gang. Commit igen, hver gang en øvelse virker.

---

## Øvelse 1: Find problemerne

Her skal du ikke skrive kode. Du bruger chatbotten som en bruger og noterer, hvad der irriterer.

#### Test øvelse 1

1. Åbn en tråd. Skriv en besked, og klik **Send**. Hvad står der i tekstfeltet bagefter?
2. Skriv en besked, og tryk Enter. Hvad sker der?
3. Send en besked. Mens der står "AI is thinking...", skriver du en ny besked og klikker **Send** igen. Hvad sker der med den første besked på skærmen?
4. Skriv noget i tekstfeltet uden at sende. Klik på en anden tråd i sidebaren. Hvad står der i tekstfeltet?
5. Send beskeder, til tråden er længere end skærmen. Kan du se AI'ens svar uden at scrolle?
6. Skriv en besked på fem linjer. Hvor mange linjer kan du se ad gangen?
7. Klik på × ved en tråd, du ikke har brug for. Fik du lov at fortryde?
8. Kig på fanen i browseren. Hvad står der, når du skifter mellem tråde?
9. Søg efter `xyz` i sidebaren. Hvad ser du?

Kig også i `components/Chat.jsx`. Kommentaren over `ChatInput` siger: "Form clears and data reloads automatically". Passer det med det, du så i test 1?

---

## Øvelse 2: Send-flowet

Alle fire trin ændrer `ChatInput` i `components/Chat.jsx`. Både `/chat/new` og tråden bruger den komponent. Så retter du det ét sted, og begge sider bliver bedre.

### Trin 1: Enter sender

Brugeren forventer, at Enter sender og Shift+Enter giver en ny linje.

> **`requestSubmit()`:** sender formularen, præcis som når du klikker på knappen. Browseren tjekker `required`, og React Routers `<Form>` får besked og kalder `clientAction`. Der findes også `submit()`. Den springer begge dele over, så siden genindlæses med et almindeligt POST. Brug derfor `requestSubmit()`.

Tilføj en funktion, `handleKeyDown`, i `ChatInput`, og sæt den på `textarea` med `onKeyDown`:

- Hvis tasten er `Enter`, og Shift ikke er holdt nede:
  - Stop den nye linje med `event.preventDefault()`
  - Send formularen med `event.currentTarget.form.requestSubmit()`

<details>
<summary>Hint</summary>

`event.key` er navnet på tasten. `event.shiftKey` er `true`, når Shift er holdt nede. `event.currentTarget` er tekstfeltet, og `.form` er den formular, det ligger i.

```text
if (Enter og ikke Shift) {
  stop den nye linje
  send formularen
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
function ChatInput() {
  // Enter sender. Shift+Enter giver en ny linje
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

  return (
    <div className="chat-input-container">
      <Form method="post" className="chat-input-wrapper">
        <textarea
          name="message"
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          required
          onKeyDown={handleKeyDown}
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </Form>
    </div>
  );
}
```

</details>

#### Test trin 1

1. Skriv en besked, og tryk Enter. Bliver den sendt?
2. Skriv to linjer med Shift+Enter imellem. Tryk Enter. Står beskeden på to linjer i tråden?
3. Tryk Enter i et tomt felt. Hvad sker der? Hvem stoppede det?
4. Gør det samme på `/chat/new`. Bliver der oprettet en ny tråd?

### Trin 2: Tøm feltet

En `<Form>` fra React Router tømmer ikke sig selv. Det skal du gøre. Du tømmer feltet, så snart beskeden er sendt. Beskeden står jo allerede i tråden takket være optimistic UI fra PR 19.

> **`useNavigation()`:** fortæller, hvad React Router er i gang med. Mens en formular bliver sendt, ligger dens data i `navigation.formData`. Det er den samme hook, som viser "AI is thinking..." i `chat-thread.jsx`.

> **`useRef()`:** giver dig fat i et element i DOM'en. Du laver en ref med `useRef(null)` og sætter den på elementet med `ref={formRef}`. Bagefter er `formRef.current` selve `<form>`-elementet. Så kan du kalde `formRef.current.reset()`, som tømmer alle felter i formularen.

Udvid `ChatInput`:

- Importér `useEffect` og `useRef` fra `react` og `useNavigation` fra `react-router`
- Hent `navigation` med `useNavigation()`
- Lav en variabel, `isSending`, der er sand, når `navigation.formData` har feltet `message`
- Lav en ref, `formRef`, og sæt den på `<Form>`
- Lav en `useEffect`, der kalder `formRef.current.reset()`, når `isSending` bliver sand
- Ret kommentaren over `ChatInput`, så den ikke længere siger, at formularen tømmes af sig selv

<details>
<summary>Hint</summary>

`formData` findes kun, mens der bliver sendt. Ellers er `navigation.formData` `undefined`. Derfor `?.`:

```text
const isSending = navigation.formData?.has("message")

useEffect(() => {
  if (isSending) {
    tøm formularen
  }
}, [isSending])
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
import { useEffect, useRef } from "react";
import { Form, useNavigation } from "react-router";
```

```jsx
function ChatInput() {
  const navigation = useNavigation();
  const formRef = useRef(null);

  // Sand, fra du sender en besked, til svaret står i tråden
  const isSending = navigation.formData?.has("message");

  // Tøm feltet, så snart beskeden er sendt
  useEffect(() => {
    if (isSending) {
      formRef.current.reset();
    }
  }, [isSending]);

  // Enter sender. Shift+Enter giver en ny linje
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

  return (
    <div className="chat-input-container">
      <Form method="post" className="chat-input-wrapper" ref={formRef}>
        <textarea
          name="message"
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          required
          onKeyDown={handleKeyDown}
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </Form>
    </div>
  );
}
```

</details>

#### Test trin 2

1. Send en besked i en tråd. Er feltet tomt, mens der står "AI is thinking..."?
2. Send en besked på `/chat/new`. Er feltet tomt, før du lander i den nye tråd?
3. Klik på **Edit**, og gem en ny titel. Bliver feltet tømt? Hvorfor ikke?

<details>
<summary>Hvorfor tømmes feltet ikke i test 3?</summary>

Edit-formularen sender feltet `title`, ikke `message`. Så er `isSending` falsk. Det samme gælder log ud. Kun beskeder tømmer feltet.

</details>

### Trin 3: Vent på svaret

Du så i øvelse 1, test 3, at en ny besked kan afbryde den første, mens AI'en tænker. Nu venter knappen og Enter på svaret.

Udvid `ChatInput`:

- Gør knappen `disabled`, mens `isSending` er sand
- Skriv `Sending...` på knappen, mens `isSending` er sand. Ellers `Send`
- I `handleKeyDown`: send ikke, hvis `isSending` er sand. Det skal stadig ikke give en ny linje

Tekstfeltet skal ikke være `disabled`. Så kan brugeren skrive den næste besked, mens AI'en tænker.

<details>
<summary>Hint</summary>

En deaktiveret knap stopper ikke `requestSubmit()`. Derfor skal Enter også tjekke `isSending`. Det er en guard clause:

```text
stop den nye linje
if (isSending) return
send formularen
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
  // Enter sender. Shift+Enter giver en ny linje
  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      // Vent på svaret, før du sender igen
      if (isSending) return;

      event.currentTarget.form.requestSubmit();
    }
  }
```

```jsx
        <button className="send-button" type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
```

`app.css` har allerede en grå stil til `.send-button:disabled`.

</details>

#### Test trin 3

1. Send en besked. Er knappen grå med `Sending...`, til AI'ens svar står i tråden?
2. Skriv en ny besked, mens AI'en tænker, og tryk Enter. Bliver den sendt? Står teksten stadig i feltet?
3. Tryk Enter igen, når svaret er kommet. Bliver beskeden sendt nu?

### Trin 4: Klar til at skrive

Når du skifter tråd, genbruger React den samme `ChatThread` og den samme `ChatInput`. Det er jo den samme route. Derfor følger teksten med fra én tråd til den næste.

> **`key`:** du kender den fra lister. Når en komponents `key` skifter, smider React den gamle væk og laver en ny. Giver du `ChatInput` trådens id som `key`, får hver tråd sit eget, tomme felt.

- I `ChatInput`: giv `textarea` attributten `autoFocus`, så du kan skrive med det samme
- I `routes/chat-thread.jsx`: giv `<ChatInput />` en `key` med `thread.id`

<details>
<summary>Se løsningsforslag</summary>

`components/Chat.jsx`:

```jsx
        <textarea
          name="message"
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          required
          autoFocus
          onKeyDown={handleKeyDown}
        />
```

`routes/chat-thread.jsx`:

```jsx
      <ChatMessages messages={displayMessages} />
      <ChatInput key={thread.id} />
```

</details>

#### Test trin 4

1. Åbn en tråd. Kan du skrive med det samme uden at klikke i feltet?
2. Skriv noget uden at sende. Klik på en anden tråd. Er feltet tomt? Står markøren i det?
3. Fjern `key` igen, og gentag test 2. Hvad er forskellen? Sæt `key` ind igen.

---

## Øvelse 3: Scroll og tekstfelt

### Trin 1: Rul ned til den nyeste besked

> **`scrollIntoView()`:** ruller siden, så et element bliver synligt. Med `{ behavior: "smooth" }` glider siden i stedet for at hoppe.

Du sætter et tomt `<div>` sidst i listen og ruller ned til det, hver gang listen ændrer sig.

Udvid `ChatMessages` i `components/Chat.jsx`. Du importerede `useEffect` og `useRef` i øvelse 2.

- Lav en ref, `endRef`, med `useRef(null)`
- Sæt et tomt `<div ref={endRef} />` efter den sidste besked
- Lav en `useEffect`, der kalder `endRef.current.scrollIntoView({ behavior: "smooth" })`, når `messages` ændrer sig

<details>
<summary>Se løsningsforslag</summary>

```jsx
function ChatMessages({ messages = [] }) {
  const endRef = useRef(null);

  // Rul ned til den nyeste besked, når listen ændrer sig
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <Message key={message.id} type={message.type}>
          {message.content}
        </Message>
      ))}
      <div ref={endRef} />
    </div>
  );
}
```

</details>

#### Test trin 1

1. Åbn en lang tråd. Ruller siden ned til den sidste besked?
2. Send en besked. Kan du se "AI is thinking..." uden at scrolle? Og svaret, når det kommer?
3. Skift til en anden lang tråd. Ruller den også ned?

### Trin 2: Et tekstfelt, der vokser

> **`field-sizing: content`:** gør et tekstfelt lige så højt som teksten i det. Kender browseren ikke `field-sizing`, ignorerer den linjen, og feltet er som før.

`.chat-input` i `app.css` har allerede `min-height: 44px` og `max-height: 120px`. Feltet kan altså godt vokse. Det ved bare ikke, at det skal.

Tilføj `field-sizing: content;` til `.chat-input`.

<details>
<summary>Se løsningsforslag</summary>

```css
.chat-input {
  /* ... det, der står i forvejen ... */
  field-sizing: content;
}
```

</details>

#### Test trin 2

1. Skriv fem linjer med Shift+Enter. Vokser feltet?
2. Skriv ti linjer. Stopper feltet ved `max-height`? Kan du scrolle i det?
3. Tryk Enter. Bliver feltet lavt igen, når det er tømt?

---

## Øvelse 4: Spørg, før du sletter

Et klik på × sletter tråden for altid. Et forkert klik bør kunne fortrydes.

> **`confirm()`:** viser en boks med **OK** og **Annuller**. Den returnerer `true`, hvis brugeren klikker **OK**, og `false` ellers.

> **`event.preventDefault()` på submit:** du kender det fra formularer i almindelig JavaScript. `<fetcher.Form>` kalder din `onSubmit` først. Har du kaldt `preventDefault()`, sender React Router ingenting.

Udvid `ChatThreadItem` i `components/Sidebar.jsx`:

- Tilføj en funktion, `handleDelete`, der får `event`
- Hvis brugeren ikke bekræfter med `confirm()`: kald `event.preventDefault()`
- Sæt `handleDelete` på `<fetcher.Form>` med `onSubmit`

Skriv trådens titel i spørgsmålet, fx `Delete "My thread"?`.

<details>
<summary>Hint</summary>

```text
function handleDelete(event) {
  if (ikke confirm(...)) {
    stop afsendelsen
  }
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
function ChatThreadItem({ thread }) {
  const { id, title } = thread;
  const fetcher = useFetcher();

  // Check if this specific thread is being deleted
  const isDeleting =
    fetcher.state !== "idle" && fetcher.formData?.get("threadId") === id;

  // Spørg, før tråden slettes. Annuller stopper afsendelsen
  function handleDelete(event) {
    if (!confirm(`Delete "${title}"?`)) {
      event.preventDefault();
    }
  }

  return (
    <li className="chat-thread-item">
      <div className="chat-thread-item-content">
        {/* ... NavLink som før ... */}
        <fetcher.Form method="post" onSubmit={handleDelete}>
          {/* ... som før ... */}
        </fetcher.Form>
      </div>
    </li>
  );
}
```

</details>

#### Test øvelse 4

1. Klik på × ved en tråd. Står titlen i boksen?
2. Klik **Annuller**. Er tråden der stadig? Kig i Network-fanen. Blev der sendt et request?
3. Klik på × igen, og klik **OK**. Forsvinder tråden?

---

## Øvelse 5: Titel og tom søgning

### Trin 1: Trådens titel i fanen

Har du mange faner åbne, kan du ikke se, hvilken der er chatbotten, og hvilken tråd den viser.

> **`meta`:** en route kan eksportere en funktion, `meta`, som returnerer titlen på siden. React Router sætter den i `<head>` med `<Meta />` i `root.jsx`. Den dybeste route med en `meta` vinder. Har en route ingen `meta`, arver den fra sin forælder. `meta` får loaderens data som `data`.

I `root.jsx`:

- Fjern `<title>Chatbot</title>` fra `<head>`. Ellers er der to titler
- Eksportér en `meta`, der returnerer `[{ title: "Chatbot" }]`

I `routes/chat-thread.jsx`:

- Eksportér en `meta`, der returnerer trådens titel efterfulgt af ` · Chatbot`
- Findes tråden ikke, kaster loaderen en fejl, og så er der ingen `data`. Returnér `Thread Not Found · Chatbot` i stedet

<details>
<summary>Hint</summary>

```text
export function meta({ data }) {
  if (ingen data) {
    return [{ title: "Thread Not Found · Chatbot" }]
  }

  return [{ title: trådens titel + " · Chatbot" }]
}
```

`data` er det, `clientLoader` returnerer: `{ thread, messages }`.

</details>

<details>
<summary>Se løsningsforslag</summary>

`root.jsx`:

```jsx
export function meta() {
  return [{ title: "Chatbot" }];
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      {/* ... som før ... */}
    </html>
  );
}
```

`routes/chat-thread.jsx`:

```jsx
// Trådens titel i browserens fane
export function meta({ data }) {
  // Loaderen kastede en fejl, fx 404
  if (!data) {
    return [{ title: "Thread Not Found · Chatbot" }];
  }

  return [{ title: `${data.thread.title} · Chatbot` }];
}
```

</details>

#### Test trin 1

1. Skift mellem to tråde. Skifter titlen i fanen?
2. Ret titlen på en tråd med **Edit**. Skifter fanen med?
3. Gå til `/chat/new`. Hvad står der i fanen? Hvor kommer den titel fra?
4. Gå til `/chat/<bobs id>` fra step 17. Hvad står der i fanen?

### Trin 2: Sig det, når listen er tom

Finder søgningen ingenting, er sidebaren bare tom. Det samme ser en ny bruger, der ingen tråde har endnu. Brugeren kan ikke se, om noget er gået galt.

Udvid `ChatThreadsList` i `components/Sidebar.jsx`:

- Er `filteredThreads` tom, så vis et `<p className="no-threads">` efter listen
- Har brugeren søgt, skriver du `No conversations match "xyz"` med søgeordet
- Ellers skriver du `No conversations yet`

Giv `.no-threads` lidt luft og en dæmpet farve i `app.css`. Brug `var(--text-muted)`.

<details>
<summary>Se løsningsforslag</summary>

```jsx
      <ul>
        {filteredThreads.map((thread) => (
          <ChatThreadItem key={thread.id} thread={thread} />
        ))}
      </ul>

      {filteredThreads.length === 0 && (
        <p className="no-threads">
          {searchValue
            ? `No conversations match "${searchValue}"`
            : "No conversations yet"}
        </p>
      )}
```

```css
.no-threads {
  padding: 1rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
}
```

</details>

#### Test trin 2

1. Søg efter `xyz`. Ser du beskeden med dit søgeord?
2. Slet søgeordet. Kommer trådene tilbage, og forsvinder beskeden?
3. Log ind som en bruger, der ingen tråde har. Hvad står der i sidebaren?

---

## Mønstrene igen

Du har brugt de samme mønstre som i step 17 og 18:

| Mønster | Hvor |
| --- | --- |
| DRY | Du rettede `ChatInput` ét sted, og både `/chat/new` og tråden blev bedre |
| Guard clause | `if (isSending) return` i `handleKeyDown`, `if (!data)` i `meta` |
| Encapsulation | `ChatInput` holder `useNavigation`, ref og Enter for sig selv. Routes skriver bare `<ChatInput />` |
