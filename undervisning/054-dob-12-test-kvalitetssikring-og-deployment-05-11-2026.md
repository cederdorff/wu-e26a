# DOB 12 - Test, kvalitetssikring og deployment - 05-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Plan for DOB 12 - Test, kvalitetssikring og deployment

## Dagens fokus

Nu har jeres chatbot eget API, AI-genererede svar (i en feature branch, vi ikke har meget endnu) og login, og frontenden sender tokens med i alle requests (PR 15). Inden den i næste uge bliver klar til mange brugere, skal vi sikre os, at den faktisk virker.

I Henriks lektion (HEOE 4) så I på user stories, acceptkriterier og brugertest: *Bygger vi det rigtige?* I dag tager vi et komplimenterende perspektiv: *Bygger vi det rigtigt?* Vi går fra en user story til acceptkriterier og konkrete testscenarier, både happy paths og det, der kan gå galt. For hvert scenarie beslutter I, om det skal testes manuelt eller automatiseres.

De automatiserede tests optager vi med Playwright direkte i VS Code, og forstår den genererede kode på bagkant.

Til sidst kigger vi på fredagens gruppearbejde, hvor I deployer chatbotten til Render og Netlify.

---

## Agenda

- Hvorfor tester vi? Verificering vs. validering og et hurtigt overblik over testtyper
- Fra user story til acceptkriterier, happy paths og non-happy paths
- Manuelt eller automatiseret? Træf begrundede valg.
- Hands-on: Optag Playwright tests af chatbotten med VS Code
- Kvalitetssikring i semesterprojektet
- Fredagens gruppearbejde: deployment til Render og Netlify

---

## Forberedelse

**Test:**

- Hav dine svar på forberedelsesspørgsmålene til HEOE 4 klar (user stories, acceptkriterier, Definition of Done, og hvad der skal automatiseres), dem bygger vi videre på
- Installér extension'en [Playwright Test for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- Læs ["Test generator"](https://playwright.dev/docs/codegen) (og se den korte video) for at få et overblik over, hvordan man kan "skrive" Playwright tests ved at optage sine egne browser-interaktioner
- Læs ["Writing tests"](https://playwright.dev/docs/writing-tests) i Playwright dokumentationen
- Valgfrit: Se den sidste video i "Testing" modulet i Scrimbas ["The Fullstack Developer Path"](https://scrimba.com/fullstack-path-c0fullstack), "Types of testing", for et hurtigt overblik over forskellige typer tests. Vi dykker dybere på 2. semester med flere e2e tests og unit tests.
- Valgfrit: Microsoft Learns ["Build your first end-to-end test with Playwright"](https://learn.microsoft.com/en-us/training/modules/build-with-playwright/), hvis du vil prøve Playwright af på forhånd

**Tutorials:**

- Sørg for at du har gennemført til og med [PR #15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) fra Rasmus' undervisning, så din frontend sender bearer tokens i API requests.
- Hav din chatbot kørende lokalt (både frontend og backend), og en bruger, du kan logge ind med. Vi opretter en særskilt testbruger i timen

**Til fredag (deployment):**

- Opret gratis konti på [Netlify](https://www.netlify.com/) og [Render](https://render.com/), gerne med login via GitHub
- Skim ["Deploy a Node Express App on Render"](https://render.com/docs/deploy-node-express-app) og ["Deploy from your repository"](https://docs.netlify.com/start/quickstarts/deploy-from-repository/) på Netlify

## Materialer

### Præsentationer

- [DOB 12 - Test, kvalitetssikring og deployment - slides.pdf](https://eaaa.instructure.com/courses/32059/modules/items/1079815)

### Opgaver

- Ønsker til grupper til semesterprojektet — Assignment

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178076
canvas_module_position: 54
canvas_module_published: true
canvas_module_item_id: 1018769
canvas_module_item_position: 1
canvas_page_id: 200736
canvas_page_slug: "plan-for-dob-12-test-kvalitetssikring-og-deployment"
canvas_page_title: "Plan for DOB 12 - Test, kvalitetssikring og deployment"
canvas_page_published: true
canvas_updated_at: "2026-10-30T13:41:35Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018769"
local_status: mirrored
```

</details>
