# React Supabase Auth: Login før chatbotten

## Kort fortalt

Du bygger en lille React-app, hvor man kan oprette en konto, logge ind og se sin egen profil. Appen bruger samme opsætning som chatbotten: React Router med `clientAction` og `clientLoader`, og Supabase Auth til brugere, passwords og tokens.

Når du er færdig, har du lavet det samme som i [step 14](https://github.com/bewildergeist/chatbot-react-postgres/pull/14) i chatbot-tutorialen, bare i et mindre projekt. Så kan du bagefter lave step 14 i chatbotten selv. Sidst i opgaven står, hvilken øvelse der svarer til hvilken delopgave i step 14.

Du bruger dit eksisterende Supabase-projekt fra chatbotten. De brugere, du opretter her, kan du også logge ind med i chatbotten.

Løsningen ligger i [react-supabase-auth](https://github.com/cederdorff/react-supabase-auth) med én branch pr. øvelse.

<details>
<summary>💡 Sidder du fast undervejs? Sådan bruger du hjælpen i denne øvelse</summary>

Prøv selv først. Går det ikke:

1. Åbn **Hint**-toggle'n under øvelsen. Den peger dig i den rigtige retning uden at give dig koden.
2. Åbn **Løsningsforslag**-toggle'n, når hintet ikke er nok, eller når du vil sammenligne med din egen kode.

Spring aldrig en test over, heller ikke når den virker oplagt.

</details>

---

## Øvelse 1: Hent startprojektet

Åbn terminalen i mappen, hvor du har dine kodeprojekter. På Windows skal du vælge Command Prompt, fordi PowerShell ofte blokerer npm.

```bash
npx degit cederdorff/react-supabase-auth react-supabase-auth
cd react-supabase-auth
npm install
npm run dev
```

Åbn mappen `react-supabase-auth` i VS Code. Klik Initialize Repository, og commit startprojektet, før du ændrer noget.

Kig projektet igennem:

- `react-router.config.js`: `ssr: false` betyder, at appen kører i browseren, ligesom chatbotten
- `app/routes.js`: indtil videre findes kun forsiden
- `app/routes/register.jsx` og `app/routes/login.jsx`: formularerne er færdige, men de gør ikke noget endnu
- `app/app.css`: al styling er klar. Du behøver ikke røre filen

#### Test øvelse 1

Åbn den URL, terminalen viser ved `Local`. Klik på "Create Account". Du får en 404. Det retter du i øvelse 3.

---

## Øvelse 2: Supabase-klienten

Installér Supabase' JavaScript-klient:

```bash
npm install @supabase/supabase-js
```

Kopiér `.env.example` til en ny fil, `.env`. Indsæt URL og key fra chatbottens `frontend/.env`. Du kan også finde dem i Supabase under Project Settings → API Keys. Står der en "publishable key" (`sb_publishable_...`), så brug den. Den virker på samme måde som en anon key.

Anon key og publishable key må gerne ligge i browseren. Supabase tjekker selv, hvad den må. Service role key og secret key giver adgang til alt og må aldrig stå i en `VITE_`-variabel.

Opret `app/lib/supabase.js`:

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// TODO: Hvis en af de to mangler, så kast en Error med en tydelig besked.

// TODO: Lav klienten med createClient(supabaseUrl, supabaseAnonKey), og eksportér den som supabase.
```

<details>
<summary>Hint</summary>

```text
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("...")
}

export const supabase = createClient(...)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
import { createClient } from "@supabase/supabase-js";

// Kun variabler, der starter med VITE_, kommer med ud i browseren
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in the values.",
  );
}

// Én fælles klient, som resten af appen importerer
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

</details>

Slå til sidst "Confirm email" fra i Supabase under Authentication → Sign In / Providers → Email, og gem. Ellers skal hver ny bruger bekræfte sin email, og Supabase sender kun få mails i timen.

#### Test øvelse 2

1. Stop og start `npm run dev` igen. Vite læser kun `.env`, når serveren starter.
2. Tilføj midlertidigt `import { supabase } from "../lib/supabase";` og `console.log(supabase);` øverst i `app/routes/home.jsx`. Du skal se et objekt i Console.
3. Slet linjen med `VITE_SUPABASE_URL` i `.env`, og genstart. Læs fejlen. Sæt linjen ind igen.
4. Fjern import og `console.log` fra `home.jsx` igen.

---

## Øvelse 3: Routes til login og register

**Prøv det først:** gå til `/register`. Du får en 404, fordi React Router ikke kender siden.

Tilføj `register` og `login` i `app/routes.js`. `route` er allerede importeret.

<details>
<summary>Se løsningsforslag</summary>

```js
import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("register", "routes/register.jsx"),
  route("login", "routes/login.jsx"),
];
```

</details>

#### Test øvelse 3

Gå til `/register` og `/login`. Begge sider skal vises, og linkene nederst skal skifte mellem dem.

---

## Øvelse 4: Opret en bruger

**Prøv det først:** udfyld formularen på `/register`, og tryk "Create Account". Læs fejlen. Formularen sender til routen, men routen har ingen `clientAction`, der kan tage imod.

Tilføj en `clientAction` øverst i `app/routes/register.jsx`. Du kender mønsteret fra formularerne i chatbotten:

```js
import { Form, Link, redirect } from "react-router";
import { supabase } from "../lib/supabase";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // TODO: Opret brugeren med supabase.auth.signUp({ email, password }).
  // TODO: Hvis du får en error, så log den med console.error, og return null.
  // TODO: Ellers redirect til "/login?registered=true".
}
```

<details>
<summary>Hint</summary>

`signUp()` returnerer et objekt med `data` og `error`. Du skal kun bruge `error` her:

```text
const { error } = await supabase.auth.signUp(...)
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Supabase hasher passwordet med bcrypt og gemmer brugeren i auth.users
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Registration error:", error);
    return null;
  }

  return redirect("/login?registered=true");
}
```

</details>

#### Test øvelse 4

1. Åbn Network-fanen i DevTools, og opret en bruger. Du skal ende på `/login`.
2. Find requestet til `.../auth/v1/signup` i Network-fanen. Kig i Payload. Står passwordet i klartekst? Står der `https` i URL'en?
3. Find brugeren i Supabase under Authentication → Users.
4. Åbn Table Editor, vælg schema `auth` og tabellen `users`. Find kolonnen `encrypted_password`. Hashen starter med `$2a$`, som betyder bcrypt. Det er samme slags hash, som `crypt(..., gen_salt('bf'))` gav dig i SQL Editor.
5. Opret en bruger mere med samme password. Er de to hashes ens?
6. Prøv at oprette den samme email igen. Hvad står der i Console?

---

## Øvelse 5: Validering

**Prøv det først:** opret en ny bruger, hvor de to passwords er forskellige. Brugeren bliver oprettet alligevel, fordi din `clientAction` aldrig kigger på `confirmPassword`.

Byg videre på `clientAction`:

- Hent også `confirmPassword` fra `formData`
- Returnér `{ error: "..." }`, hvis et felt er tomt, hvis de to passwords er forskellige, eller hvis passwordet er under 6 tegn
- Returnér `{ error: error.message }` i stedet for `null`, når Supabase giver en fejl

Vis fejlen i formularen med `useActionData()`, lige over knappen:

```jsx
{actionData?.error && <div className="error-message">{actionData.error}</div>}
```

Brug `useNavigation()` til at slå knappen fra og skrive "Creating account...", mens formularen sendes.

<details>
<summary>Hint</summary>

```text
const actionData = useActionData()
const navigation = useNavigation()
const isSubmitting = navigation.state === "submitting"
```

Husk at importere `useActionData` og `useNavigation` fra `react-router`.

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router";
import { supabase } from "../lib/supabase";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  // Supabase hasher passwordet med bcrypt og gemmer brugeren i auth.users
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  return redirect("/login?registered=true");
}

export default function Register() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    // ... formularen som før, men knappen bliver til:
    <>
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </>
  );
}
```

</details>

#### Test øvelse 5

Der er tre lag validering. Test dem et ad gangen:

1. **HTML:** prøv at sende en tom formular. Browseren stopper dig, fordi felterne har `required`.
2. **Din `clientAction`:** fjern `required` og `minLength` fra de tre inputs. Send en tom formular, to forskellige passwords og et password på 3 tegn. Du skal se dine egne fejlbeskeder.
3. **Supabase:** udkommentér dit tjek af længden, og send et password på 3 tegn. Nu svarer Supabase selv med en fejl.

De to første lag kan enhver komme uden om, ligesom du lige gjorde. Det sidste lag ligger på serveren. Sæt `required`, `minLength` og dit længdetjek ind igen.

---

## Øvelse 6: Log ind

Gør det samme for `app/routes/login.jsx`:

- En `clientAction`, der logger ind med `supabase.auth.signInWithPassword({ email, password })`
- Ved fejl: returnér `{ error: "Invalid email or password" }`
- Ellers: `redirect("/")`
- Vis fejlen med `useActionData()`, og skriv "Logging in..." på knappen med `useNavigation()`

Vis til sidst en velkomstbesked, når man kommer fra `/register`:

```jsx
{justRegistered && (
  <div className="success-message">Account created successfully! Please log in.</div>
)}
```

<details>
<summary>Hint</summary>

Brug `useSearchParams()` til at læse `?registered=true` i URL'en:

```text
const [searchParams] = useSearchParams()
const justRegistered = searchParams.get("registered") === "true"
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```jsx
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { supabase } from "../lib/supabase";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Supabase sammenligner passwordet med hashen og gemmer et JWT i localStorage
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password" };
  }

  return redirect("/");
}

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  // ... resten af componenten med justRegistered, actionData og isSubmitting
}
```

</details>

#### Test øvelse 6

1. Opret en ny bruger. Står velkomstbeskeden på `/login`?
2. Log ind med forkert password. Du skal se din fejlbesked.
3. Log ind med det rigtige password. Du skal ende på forsiden.
4. Fejlbeskeden siger ikke, om det er emailen eller passwordet, der er forkert. Hvorfor er det en god idé?

---

## Øvelse 7: Kig i dit JWT

Her skal du ikke skrive kode.

1. Log ind, og åbn DevTools → Application → Local Storage → `http://localhost:5173`.
2. Find nøglen, der starter med `sb-` og slutter med `-auth-token`. Værdien er et JSON-objekt.
3. Kopiér værdien af `access_token`, og indsæt den på [jwt.io](https://jwt.io).
4. Et JWT har tre dele adskilt af punktummer: header, payload og signatur. Find i payloaden:
   - `sub`: dit bruger-id. Sammenlign det med id'et i Supabase under Authentication → Users
   - `email`
   - `role`
   - `iat` og `exp`: hvornår tokenet er lavet, og hvornår det udløber. Skriv `new Date(exp * 1000)` i Console med tallet fra `exp`

Svar på:

- Hvor længe lever tokenet?
- Står dit password nogen steder i tokenet?
- jwt.io kunne læse payloaden uden nogen nøgle. Hvad betyder det for, hvad man må gemme i et JWT?
- Hvad tror du `refresh_token` bruges til?

---

## Øvelse 8: Profilside

**Prøv det først:** gå til `/profile`. Du får en 404.

Opret `app/routes/profile.jsx`. Siden henter brugeren i en `clientLoader`, før den vises:

```jsx
import { Link, redirect, useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";

export async function clientLoader() {
  // TODO: Hent brugeren med supabase.auth.getUser().
  // TODO: Hvis du får en error, eller data.user mangler, så redirect til "/login".
  // TODO: Ellers returnér { user: data.user }.
}

export default function Profile() {
  const { user } = useLoaderData();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>My Profile</h1>
        <p className="auth-subtitle">You are logged in</p>

        <dl className="profile-list">
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>User ID</dt>
          <dd>{user.id}</dd>
          <dt>Last sign in</dt>
          <dd>{new Date(user.last_sign_in_at).toLocaleString()}</dd>
        </dl>

        <p className="auth-footer">
          <Link to="/">Back to start</Link>
        </p>
      </div>
    </div>
  );
}
```

Tilføj `profile` i `app/routes.js`, og ret `redirect("/")` i `login.jsx` til `redirect("/profile")`.

<details>
<summary>Hint</summary>

```text
const { data, error } = await supabase.auth.getUser()

if (error || !data.user) {
  return redirect(...)
}
```

</details>

<details>
<summary>Se løsningsforslag</summary>

```js
export async function clientLoader() {
  // getUser() sender tokenet til Supabase, som tjekker signaturen
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return redirect("/login");
  }

  return { user: data.user };
}
```

</details>

#### Test øvelse 8

1. Log ind. Du skal ende på `/profile` og se din email og dit id.
2. Åbn Local Storage igen. Dobbeltklik på værdien, og ret ét bogstav inde i `access_token`. Genindlæs `/profile`. Hvad sker der?
3. `getUser()` sender tokenet til Supabase. Supabase kan se, at signaturen ikke passer til indholdet, og afviser det. Derfor kan man ikke bare ændre sit bruger-id i tokenet.
4. Log ind igen for at få et gyldigt token.

---

## Øvelse 9: Log ud (bonus)

Tilføj en `clientAction` i `profile.jsx`, der logger ud med `supabase.auth.signOut()` og sender videre til `/login`. Tilføj en knap i en `<Form method="post">` lige under `</dl>`:

```jsx
<Form method="post">
  <button type="submit" className="btn-secondary">
    Log Out
  </button>
</Form>
```

<details>
<summary>Se løsningsforslag</summary>

```jsx
import { Form, Link, redirect, useLoaderData } from "react-router";

export async function clientAction() {
  // Fjerner tokenet fra localStorage
  await supabase.auth.signOut();
  return redirect("/login");
}
```

</details>

#### Test øvelse 9

1. Log ud. Er nøglen `sb-...-auth-token` væk fra Local Storage?
2. Gå til `/profile`. Du skal blive sendt til `/login`.

Commit, og publish projektet til GitHub fra VS Code.

---

## Fra øvelserne til step 14

Nu laver du det samme i chatbotten. Er du ikke færdig med step 13, så hent startpunktet i roden af chatbot-repoet, og commit det, før du ændrer noget:

```bash
npx degit --force bewildergeist/chatbot-react-postgres#pr-14-start
```

| Step 14 | Det har du lavet i |
| --- | --- |
| Delopgave 1: Install Supabase client library | Øvelse 2 |
| Delopgave 2: Create Supabase client module | Øvelse 2 |
| Delopgave 3: Configure environment variables | Øvelse 2. `.env` findes allerede i `frontend/` |
| Delopgave 4: Build the registration page | Øvelse 4 og 5. Du skriver selv formularen |
| Delopgave 5: Build the login page | Øvelse 6 og 7. Tutorialen sender til `/` i stedet for `/profile` |
| Delopgave 6: Style the authentication pages | Kopiér afsnittet `Authentication Pages` fra `app.css` i dette projekt. Klasserne har samme navne |
| Delopgave 7: Register authentication routes | Øvelse 3. Her skal routes stå uden for layoutet, så sidebaren ikke vises |

Profilsiden og logout er ikke med i step 14. Logout kommer i step 15.
