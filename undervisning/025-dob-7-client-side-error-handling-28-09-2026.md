# DOB 7 - Client-side error handling - 28-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

Vi kigger på hvordan vi kan håndtere fejl både i vorres client-side JavaScript kode og håndtere fejl, der returneres fra serveren. Hvordan sikrer vi at brugeren får den bedst mulige feedback, når noget går galt? Og hvordan kan vi som udviklere bedst muligt debugge og logge fejl, så vi kan rette dem hurtigt?

---

## Agenda

- Introduktion til fejltyper i JavaScript
- Håndtering af fejl med `try`/`catch`
- Håndtering af serverfejl i fetch requests
- Debugging og logging af fejl
- Hands-on: Implementér fejlbehandling i jeres chatbots

---

## Forberedelse

**Fejl i JavaScript:**

- Læs ["Error handling, "try...catch"](https://javascript.info/try-catch) på JavaScript.info
- Læs ["Exception handling statements"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#exception_handling_statements) på MDN om `throw` og `try/catch`
- Læs ["try...catch"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) på MDN
- Skim ["Error"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) på MDN

**Fetch og serverfejl:**

- Gennemgå [Advanced JavaScript > Asynchronous JavaScript & APIs](https://scrimba.com/advanced-javascript-c03kpi3kss) på Scrimba, særligt afsnittene om "Handling Rejected Promises" og "response.ok".
- Læs ["Handling the response"](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#handling_the_response) på siden "Using the Fetch API" på MDN
- Skim ["Response"](https://developer.mozilla.org/en-US/docs/Web/API/Response) på MDN (fokus på `ok` og `status` properties)

## Materialer

### Præsentationer

### Opgaver

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178048
canvas_module_position: 25
canvas_module_published: true
canvas_module_item_id: 1018721
canvas_module_item_position: 1
canvas_page_id: 200720
canvas_page_slug: "plan-for-dob-7-client-side-error-handling"
canvas_page_title: "Plan for DOB 7 - Client-side error handling"
canvas_page_published: true
canvas_updated_at: "2026-09-07T09:25:47Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018721"
local_status: mirrored
```

</details>
