# DOB 11 - AI integration via LLM API - 21-10-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Nu har I (sammen med Magnus) bygget jeres eget Express API, der læser og skriver beskeder direkte i PostgreSQL databasen (PR 8-10). Men jeres chatbot svarer stadig ikke på noget, så der er ikke meget "chat" over det. Det laver vi om på nu.

Vi starter med en kort opsamling på hvad en LLM (Large Language Model) egentlig er, og hvordan man betaler for den i tokens. Derefter leger vi med et "chat completions" API direkte fra Thunder Client, og ser hvordan system prompts og samtalehistorik påvirker svarene. Til sidst kobler vi API'et ind i jeres Express backend, så hver besked fra brugeren får et rigtigt AI-genereret svar, med optimistic UI i frontenden mens man venter (PR 19 — vi springer lidt).

Den oprindelige plan var at bruge Mistrals API, men de har for nylig fjernet API adgang på deres Free plan, så vi bruger en OpenAI model via Groq i stedet (ikke at forveksle med Elons Grok, den rører vi ikke).

---

## Agenda

- Hvad er en LLM? Tokens, kontekstvinduer og prismodeller
- LLM API'er: Mistral vs. OpenAI vs. Anthropic
- Opret en Groq konto, og afprøv Playground
- Hands-on: Leg med Groqs chat completions endpoint i Thunder Client: System prompts, samtalehistorik og `temperature`
- Hands-on: Genimplementér PR 19 i jeres eget Express API, to og to

---

## Forberedelse

**Scrimba:**

- Se de første videoer i Scrimbas ["Intro to Mistral AI"](https://scrimba.com/intro-to-mistral-ai-c035) kursus, frem til og med "Mistral's models" (ca. 20 min)
- Arbejd dig igennem ["The Fullstack Developer Path"](https://scrimba.com/fullstack-path-c0fullstack) > "AI Engineering" > "AI Engineering Fundamentals", frem til "Aside: Token Costs & Context Windows" (ca. 1 time)

**Mistral dokumentation:**

- Læs ["Chat completions"](https://docs.mistral.ai/studio/conversations/chat-completion) i Mistral dokumentationen
- Skim ["Prompting"](https://docs.mistral.ai/studio/conversations/chat-completion/prompting) for at få en idé om, hvad man kan med system prompts og few-shot prompting

**Tutorials:**

- Sørg for at du har gennemført til og med [PR #10](https://github.com/bewildergeist/chatbot-react-postgres/pull/10) fra Magnus' undervisning, så dit Express API kan oprette beskeder.
- Skim "Overview" i dagens tutorial, [PR #19](https://github.com/bewildergeist/chatbot-react-postgres/pull/19). Bemærk at vi springer lidt i kronologien: Vi tager AI-integrationen nu, og vender tilbage til step 11-18 bagefter.

## Materialer

### Præsentationer

- [DOB 11 - AI integration via LLM API - slides.pdf](https://eaaa.instructure.com/courses/32059/modules/items/1071778)

### Opgaver

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178066
canvas_module_position: 43
canvas_module_published: true
canvas_module_item_id: 1018751
canvas_module_item_position: 1
canvas_page_id: 200730
canvas_page_slug: "plan-for-dob-11-ai-integration-via-llm-api"
canvas_page_title: "Plan for DOB 11 - AI integration via LLM API"
canvas_page_published: true
canvas_updated_at: "2026-10-20T11:25:02Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018751"
local_status: mirrored
```

</details>
