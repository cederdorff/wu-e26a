# Arbejdsark: CREATE TABLE, JOINs og normalisering

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

**Ressourcer:** Slides fra Undervisning 3 · [SQL Quick Reference (W3Schools)](https://www.w3schools.com/sql/sql_quickref.asp) · [CREATE TABLE (PostgreSQL Documentation)](https://www.postgresql.org/docs/current/sql-createtable.html) · [ALTER TABLE (PostgreSQL Documentation)](https://www.postgresql.org/docs/current/sql-altertable.html) · [Joins Between Tables (PostgreSQL Documentation)](https://www.postgresql.org/docs/current/tutorial-join.html) · [Tutorial, trin 9: Læs beskeder via API'et](https://github.com/bewildergeist/chatbot-react-postgres/pull/9) · [Tutorial, trin 10: Opret beskeder via API'et](https://github.com/bewildergeist/chatbot-react-postgres/pull/10)

Opgaverne i afsnit 2 bruger den database vi har arbejdet med siden første gang: tabellerne `threads` og `messages` og Supabase’s egen tabel med brugerne, `auth.users`, med testdata fra `seed.sql` og den nye bruger frida som vi oprettede i starten af i dag. Løsningerne på slides er lavet på de data. Har I ændret i jeres data sidst, får I nok nogle andre tal, og det er helt i orden.

## 2 CREATE TABLE, ALTER TABLE og basale JOINs

I første undervisningsgang diskuterede vi hvordan flere brugere kan være med i den samme tråd, fx i en gruppechat. Det er en N:M-relation, og den kræver en mellemtabel med en foreign key til både `auth.users` og `threads`. Den har vi lavet sammen i code-along’en:

```
CREATE TABLE thread_members (
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (thread_id, user_id)
);
```

## 2.1 Den nye tabel

**Opgave 1** Hvis du ikke nåede det i code-along’en, så opret tabellen `thread_members` med SQL’en herover. Kig bagefter på den: Hvad er primary key i `thread_members`, og hvorfor har tabellen ikke sin egen `id`\-kolonne?

**Opgave 2** Gør dig selv og to andre brugere til medlemmer af en af trådene i testdataene, fx `'11111111-1111-1111-1111-111111111111'`, med ét `INSERT`. Prøv bagefter at tilføje den samme bruger til den samme tråd igen. Hvad sker der, og hvorfor?

**Opgave 3** En foreign key beskytter data begge veje, i begge tabeller. Hvis vi begynder at ændre i vores `auth.users` tabel, så vil den nye `thread_members` tabel stoppe os i at lave noget dumt. Men vi skal lige prøve at gør enoget dumt aligevel. Prøv derfor at:

1.  Gør en bruger der ikke findes, til medlem af en tråd, fx med `user_id = '00000099-0099-0099-0099-000000000099'`. Hvad sker der?
2.  Tjek først med en `SELECT` at du står i `thread_members`, ellers sletter du dig selv for alvor. Hvis du er medlem af den thread du arbejder på, prøv så at slette dig selv med `DELETE FROM auth.users WHERE email = 'din@email.dk';`. Hvad sker der?
3.  Hvilken del af `CREATE TABLE thread_members`\-querien sørger for at vi ikke kommer til at slette brugeren til en thread? Hvorfor sletter databasen ikke din bruger?

**Opgave 4** I code-along’en gav vi medlemmerne en rolle med `ALTER TABLE`. Hvis du ikke nåede det, så gør det nu:

```
ALTER TABLE thread_members
ADD COLUMN role text DEFAULT 'member';
```

Gør dig selv til `'admin'` i gruppechatten fra opgave 2 med et `UPDATE`, og hent bagefter alle medlemmerne og deres rolle. Hvilken rolle fik de medlemmer der fandtes før `ALTER TABLE`, og hvorfor?

**Note** Du er færdig med den nye tabel, når `thread_members` har mindst tre rækker, og du selv er `'admin'` i din gruppechat.

## 2.2 INNER JOIN

Nu hvor vi har relationer mellem tabellerne, kan vi bruge `JOIN` til at hente data fra flere tabeller på én gang. Skriv og kør en query til hver opgave i SQL Editor.

**Opgave 5** Brug `INNER JOIN` til at hente alle tråde sammen med emailen på den bruger der har oprettet dem. Din query skal vise `title` fra `threads` og `email` fra `auth.users`. Hvor mange rækker får du, og hvorfor er det det samme som antallet af tråde?

**Hint:** Giv tabellerne et kort navn (et alias), fx `FROM threads t` og `INNER JOIN auth.users u`, så du ikke skal skrive `auth.users` hver gang.[1](#loc-3)

**Opgave 6** Join `messages`, `threads` og `auth.users`, så du kan se hver besked sammen med titlen på dens tråd og emailen på den bruger der har oprettet tråden. Tag kun beskeder af typen `'user'` med, og sortér dem efter `created_at`.

**Hint:** En besked kender sin tråd, og en tråd kender sin bruger. Join derfor først `threads` på `messages`, og så `auth.users` på `threads`.

**Opgave 7** Find ud af hvem der er med i den gruppechat du lavede i opgave 2. Din query skal vise trådens titel og emailen på hvert medlem.

  

## 2.3 LEFT JOIN

**Opgave 8** Brug `LEFT JOIN` til at finde de brugere der ikke har oprettet nogen tråde. Hvem får du, og hvorfor?

**Hint:** `LEFT JOIN` tager alle brugere med, også dem uden tråde. Brug `WHERE ... IS NULL` til at finde dem der ikke har et match.

**Opgave 9** Brug `LEFT JOIN` til at vise alle brugere og de tråde de er medlem af i `thread_members`, også de brugere der ikke er medlem af nogen. Hvad står der for de brugere der ikke er medlem af noget?

**Opgave 10** **Refleksion.** Hvad er forskellen på `INNER JOIN` og `LEFT JOIN`? Hvornår ville du bruge hver af dem i chatbotten?

## 3 Normalisering

I dette afsnit skal I bruge normalformerne fra slides, først på vores egen chatbot og så på et gammelt bibliotekssystem.

## 3.1 Normalisering af chatbotten

**Opgave 11** **Diskussion om normalisering.** Diskutér: Hvad ville problemerne være hvis vi gemte brugerens `email` direkte i `messages`\-tabellen i stedet for at slå brugeren op gennem `threads.user_id`?

**Opgave 12** **Er chatbotten normaliseret?** Er vores chatbot-database på 1NF? På 2NF? På 3NF? Begrund jeres svar for hver normalform ud fra tabellerne `threads` og `messages` og de kolonner i `auth.users` som vi bruger (`id` og `email`).

## 3.2 Normalisering af et bibliotekssystem

Du har fået følgende tabel fra et gammelt bibliotekssystem, som ikke følger normaliseringsregler. Det er det samme bibliotek som i jeres gruppearbejde, så I kan sammenligne med jeres egen model undervejs.

**Ikke-normaliseret tabel: `bibliotek_data`**

<table><tbody><tr><td>bog_id</td><td>bog_titel</td><td>forfatter_navn</td><td>forfatter_fødselsår</td><td>forfatter_nationalitet</td><td>udgivelsesår</td><td>kategori</td><td>lån_id</td><td>låner_navn</td><td>låner_telefon</td><td>låner_email</td><td>udlånt_dato</td><td>afleveringsdato</td></tr><tr><td>1</td><td>Morten Korch Samling</td><td>Morten Korch</td><td>1876</td><td>Dansk</td><td>1935</td><td>Fiktion</td><td>101</td><td>Anna Hansen</td><td>12345678</td><td>anna@mail.dk</td><td>2024-01-15</td><td>2024-02-01</td></tr><tr><td>1</td><td>Morten Korch Samling</td><td>Morten Korch</td><td>1876</td><td>Dansk</td><td>1935</td><td>Fiktion</td><td>102</td><td>Peter Nielsen</td><td>87654321</td><td>peter@mail.dk</td><td>2024-02-05</td><td>2024-02-20</td></tr><tr><td>2</td><td>Harry Potter og De Vises Sten</td><td>J.K. Rowling</td><td>1965</td><td>Britisk</td><td>1997</td><td>Fantasy</td><td>103</td><td>Anna Hansen</td><td>12345678</td><td>anna@mail.dk</td><td>2024-01-20</td><td>2024-02-10</td></tr><tr><td>3</td><td>1984</td><td>George Orwell</td><td>1903</td><td>Britisk</td><td>1949</td><td>Dystopi</td><td>104</td><td>Lise Andersen</td><td>11223344</td><td>lise@mail.dk</td><td>2024-01-25</td><td>NULL</td></tr><tr><td>4</td><td>Animal Farm</td><td>George Orwell</td><td>1903</td><td>Britisk</td><td>1945</td><td>Dystopi</td><td>105</td><td>Peter Nielsen</td><td>87654321</td><td>peter@mail.dk</td><td>2024-02-01</td><td>2024-02-15</td></tr><tr><td>5</td><td>Forbrydelse og Straf</td><td>Fjodor Dostojevskij</td><td>1821</td><td>Russisk</td><td>1866</td><td>Klassisk</td><td>106</td><td>Maria Larsen</td><td>55667788</td><td>maria@mail.dk</td><td>2024-02-03</td><td>NULL</td></tr><tr><td>6</td><td>Brødrene Karamazov</td><td>Fjodor Dostojevskij</td><td>1821</td><td>Russisk</td><td>1880</td><td>Klassisk</td><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td><td>NULL</td></tr><tr><td>7</td><td>To Kill a Mockingbird</td><td>Harper Lee</td><td>1926</td><td>Amerikansk</td><td>1960</td><td>Drama</td><td>107</td><td>Anna Hansen</td><td>12345678</td><td>anna@mail.dk</td><td>2024-02-10</td><td>NULL</td></tr></tbody></table>

**Opgave 13** **Identificer problemer.** Identificer alle de problemer du kan se i ovenstående tabel. Tænk på:

- Hvilke data gentages unødvendigt?
- Hvad sker der hvis en forfatter ændrer nationalitet?
- Hvad sker der hvis en låner ændrer telefonnummer?
- Kan vi slette en bog uden at miste forfatterinformation?

**Opgave 14** **1NF (First Normal Form).** Transformer tabellen til 1NF. Husk at 1NF kræver:

- Alle værdier skal være atomare (ikke sammensatte)
- Ingen gentagne grupper
- Hver række skal være unik

Overvej hvor mange tabeller du vil splitte den store tabel op. Tegn dem i et ER-Diagram

**Opgave 15** **2NF (Second Normal Form).** Transformer tabellerne til 2NF. Husk at 2NF kræver af hver tabel at:

- Tabellen skal være i 1NF
- Alle ikke-key kolonner skal være fuldt ‘funktionelt afhængige’ af hele primary key

Skal I lave flere tabeller? Hvad er primary key i de tabeller?

**Opgave 16** **3NF (Third Normal Form).** Transformer dine 2NF-tabeller til 3NF. Husk at 3NF kræver:

- Tabellen skal være i 2NF
- Ingen transitive afhængigheder (ikke-key kolonner må ikke afhænge af andre ikke-key kolonner)

Fremgangsmåden her er:

1.  Identificer transitive afhængigheder i dine 2NF-tabeller
2.  Opret yderligere tabeller for at eliminere disse afhængigheder

For at spotte transitive afhængigheder så se om der er noget data i kolonnerne som ikke ændrer sig fra række til række. Det kunne tyde på at dette data er determineret af noget andet. I kan også tænke over domænet for datamodellen (et bibliotekssystem). Hvilke kolonner vil intuitivt afhænge af hinanden? Kan I se denne afhængighed?

**Opgave 17** **Hvornår skal man IKKE normalisere?** Nogle gange er det faktisk bedre at have lidt redundans i databasen. Prøv at komme på et scenarie hvor du bevidst ville vælge at bryde normaliseringsreglerne, og forklar hvorfor.

## 4 Chatbot: tutorialens trin 9 og 10

I dette afsnit bygger du videre på din egen chatbot med trin 9 og 10 i tutorialen. Queryerne har du skrevet i forvejen i opgave 16 sidst.

**Opgave 18** Lav [trin 9 i chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres/pull/9), hvor API’et henter én tråd og dens beskeder:

1.  `GET /api/threads/:id`, som svarer 404 hvis tråden ikke findes.
2.  `GET /api/threads/:id/messages`, som henter trådens beskeder, den ældste først.
3.  Frontend’en henter tråden og beskederne fra jeres API i stedet for fra Supabase.

Tjek begge routes i browseren med id’et på en tråd fra testdataene, fx `http://localhost:3000/api/threads/11111111-1111-1111-1111-111111111111` før du ændrer frontend’en. Prøv også et id der ikke findes. Hvad svarer API’et?

Du er færdig, når siden med en tråd viser beskederne fra dit eget API.

**Opgave 19** Lav [trin 10 i chatbot-tutorialen](https://github.com/bewildergeist/chatbot-react-postgres/pull/10), hvor API’et gemmer en ny besked med `POST /api/threads/:id/messages`. Husk `app.use(express.json())`, ellers kan API’et ikke læse beskeden i request’ens body.

Du er færdig, når du kan skrive en besked i chatten, og den står i `messages`\-tabellen i Supabase.

- [\[1\]](#loc-4) PostgreSQL Global Development Group 2026. *Joins Between Tables*. \[online\] Available at: <[https://www.postgresql.org/docs/current/tutorial-join.html](https://www.postgresql.org/docs/current/tutorial-join.html)\> \[Accessed 16 Oct. 2026\].

1.  [1](#loc-1)Aliasser er forklaret sidst i afsnittet om joins i PostgreSQL’s tutorial ([PostgreSQL Global Development Group, 2026 \[1\]](#loc-2)), med eksemplet `SELECT * FROM weather w JOIN cities c ON w.city = c.name;`.

[Hent arbejdsarket som PDF](https://eaaa.instructure.com/courses/32059/files/1721295?verifier=34a25f72-deac-41a8-ab24-266fd691b006&wrap=1 "WEB-E26-session3-worksheet3.pdf")

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: null
canvas_module_position: null
canvas_module_published: null
canvas_module_item_id: null
canvas_module_item_position: null
canvas_page_id: 209363
canvas_page_slug: "arbejdsark-create-table-joins-og-normalisering"
canvas_page_title: "Arbejdsark: CREATE TABLE, JOINs og normalisering"
canvas_page_published: true
canvas_updated_at: "2026-10-19T12:15:35Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/pages/arbejdsark-create-table-joins-og-normalisering"
local_status: mirrored
```

</details>
