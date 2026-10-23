# DOB 12 - Test, kvalitetssikring og deployment - 05-11-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Nu har jeres chatbot eget API, AI-genererede svar og login, og frontenden sender tokens med i alle requests (PR 15). Inden den i næste uge bliver klar til mange brugere, skal vi sikre os at den faktisk virker, og have den ud på internettet, så andre end jer selv (potentielt) kan bruge den.

I Henriks lektion (HEOE 4) så I på hvordan I kan teste jeres løsninger med rigtige brugere. I dag automatiserer vi funktionelle tests: Med Playwright skriver vi end-to-end tests, der klikker sig igennem chatbotten som en bruger ville, og vi kigger på hvordan tests kan køre automatisk på hver pull request med GitHub Actions. Til sidst deployer vi hele løsningen: Express API'et til Render og React Router SPA'en til Netlify. Og så rammesætter vi fredagens gruppearbejde.

---

## Agenda

- Testtyper og testing pyramiden: Unit, integration og end-to-end tests
- Playwright: Locators, assertions og jeres første end-to-end test
- Hands-on: Skriv Playwright tests til chatbottens vigtigste user flows
- Kvalitetssikring på hver pull request med GitHub Actions
- Deployment af Express API'et til Render, og af React Router SPA'en til Netlify
- Planlægning af fredagens gruppearbejde

---

## Forberedelse

**Test:**

- Arbejd dig igennem "Testing" modulet i Scrimbas ["The Fullstack Developer Path"](https://scrimba.com/fullstack-path-c0fullstack)
- Se forsiden af [playwright.dev](https://playwright.dev/) for et hurtigt overblik over, hvad Playwright er og kan
- Læs ["Writing tests"](https://playwright.dev/docs/writing-tests) i Playwright dokumentationen
- Valgfrit: Skim ["Understanding GitHub Actions"](https://docs.github.com/en/actions/get-started/understand-github-actions) i GitHub Docs

**Deployment:**

- Opret gratis konti på [Netlify](https://www.netlify.com/) og [Render](https://render.com/), gerne med login via GitHub
- Skim ["Deploy a Node Express App on Render"](https://render.com/docs/deploy-node-express-app) og ["Deploy from your repository"](https://docs.netlify.com/start/quickstarts/deploy-from-repository/) på Netlify

**Tutorials:**

- Sørg for at du har gennemført til og med [PR #15](https://github.com/bewildergeist/chatbot-react-postgres/pull/15) fra Rasmus' undervisning, så din frontend sender bearer tokens i API requests.

## Materialer

### Præsentationer

### Opgaver

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
canvas_updated_at: "2026-10-05T09:23:32Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018769"
local_status: mirrored
```

</details>
