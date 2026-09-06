# DOB 3 - String parsing, metoder og funktioner - 09-09-2026

<link rel="stylesheet" href="https://instructure-uploads-eu.s3.eu-west-1.amazonaws.com/account_109130000000000001/attachments/668126/Loree-2.0-canvas%20%25281%2529.css">

## Dagens fokus

I dag bygger vi videre på den "naive" besvarelse af spørgsmål ved opslag i objekter, og ser nærmere på string-metoderne `startsWith()`, `endsWith()`, `includes()`, `search()` og `match()`, og hvordan I kan kombinere dem til at analysere et spørgsmål og finde frem til det rette svar — også når brugeren ikke skriver præcis det, I havde forestillet jer.

Vi kigger også nærmere på organisering af koden bag svarlogikken. Jo mere avanceret jeres string-analyse bliver, jo vigtigere er det at dele den op i overskuelige funktioner og metoder i stedet for én lang klump kode, så det er til at læse, teste og bygge videre på.

---

## Agenda

- String-metoder til mønstergenkendelse — `startsWith()`, `endsWith()`, `includes()`
- `search()` og `match()` til mere fleksibel matching med regular expressions
- Anvendelse: hvordan AMAbotten kan analysere et helt spørgsmål frem for at kigge efter én eksakt streng
- Funktioner: deklaration, parametre og return values
- Metoder vs. funktioner — hvornår ligger logik bedst som en metode på et objekt, og hvornår som en selvstændig funktion?
- Workshop: refaktorér jeres AMAbots svarlogik, så den bruger stringmetoderne og er opdelt i funktioner/metoder

---

## Forberedelse

- Gennemfør de første fire sektioner af ["Learn JavaScript"](https://scrimba.com/learn/learnjavascript) på Scrimba (til og med "Practice Time - Part 2")
- Læs om følgende stringmetoder på MDN:
    - [`startsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith)
    - [`endsWith()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith)
    - [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)
- Skim ["Methods of RegExp and String"](https://javascript.info/regexp-methods) på javascript.info for at se, hvordan `search()` og `match()` bruges sammen med regular expressions
- Læs ["Functions"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions) i MDN's JavaScript Guide som opfriskning af funktioner, parametre og return values

## Materialer

### Præsentationer

### Opgaver

---

<details>
<summary>Canvas-metadata</summary>

```yaml
canvas_course_id: 32059
canvas_module_id: 178035
canvas_module_position: 12
canvas_module_published: true
canvas_module_item_id: 1018697
canvas_module_item_position: 1
canvas_page_id: 200712
canvas_page_slug: "plan-for-dob-3-string-parsing-metoder-og-funktioner"
canvas_page_title: "Plan for DOB 3 - String parsing, metoder og funktioner"
canvas_page_published: true
canvas_updated_at: "2026-09-04T12:37:34Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018697"
local_status: mirrored
```

</details>
