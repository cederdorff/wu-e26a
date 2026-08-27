---
canvas_course_id: 32059
canvas_module_id: 178031
canvas_module_position: 8
canvas_module_published: true
canvas_module_item_id: 1018691
canvas_module_item_position: 1
canvas_page_id: 200710
canvas_page_slug: "plan-for-race-2-ejs-templating-form-handling-og-svar-logik"
canvas_page_title: "Plan for RACE 2 - EJS templating, form handling og svar logik"
canvas_page_published: true
canvas_updated_at: "2026-08-25T09:11:54Z"
canvas_source_url: "https://eaaa.instructure.com/courses/32059/modules/items/1018691"
local_status: mirrored
---

# RACE 2 - EJS templating, form handling og svar logik - 03-09-2026

## Dagens fokus

Vi arbejder videre med Node.js og Express.js, request og responsen. Derudover skal vi se på hvordan serveren modtager og behandler data fra HTML-formularer, så vi på sigt kan lave en chatbot, der kan give intelligente og relevante svar.

---

## Agenda

1.  **Intro til EJS:**  
    \- Hvad er EJS, og hvorfor bruger vi det i Node/Express?  
    \- Eksempler på dynamisk rendering af HTML med EJS.
    
2.  **Form-håndtering i Express.js:**  
    \- Brug af `express.urlencoded()` middleware til at modtage form-data.    
    \- Praktisk demo: Send data fra en HTML-form til serveren.
    
3.  **Request-objektet:**  
    \- Forskellen på `req.body`, `req.query` og `req.params`.    
    \- Hands-on: Udtræk og brug data fra forskellige typer requests.
    
4.  **Behandling af brugerinput:**  
    \- Generér kontekstuelle svar baseret på input-  
    \- Brug arrays og objekter til at strukturere chat-logik.
    
5.  **Inputvalidering og sanitering:**  
    \- Hvorfor er det vigtigt?  
    \- Simple teknikker til at validere og rense data.
    

---

## Forberedelse

- **Opgaver**
    - Sørg for at du er godt igennem opgaverne om Node og Express fra [RACE 1 - Intro til Node og Express - 28-08-2026](https://eaaa.instructure.com/courses/32059/modules/178027 "RACE 1 - Intro til Node og Express - 28-08-2026")
- **Skim** så du senere kan bruge dem som reference (Vælg ESM i kodeeksemplerne, når du læser Express.js-dokumentationen):
    - [Routing](https://expressjs.com/en/guide/routing.html) i Express.js dokumentationen
    - ["Request object"](https://expressjs.com/en/5x/api/request/) i Express.js API reference
    - ["Express express.urlencoded() Function"](https://www.geeksforgeeks.org/web-tech/express-js-express-urlencoded-function/) på GeeksforGeeks
    - ["Working with forms"](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/forms) på MDN
- **Scrimba**
    - [Færdiggør Fullstack > Node.js > Build a Node API](https://scrimba.com/fullstack-path-c0fullstack)
    - [Se Fullstack > Express.js > Welcome to Express](https://scrimba.com/fullstack-path-c0fullstack)

## Materialer og Canvas-elementer

### Præsentationer

### Opgaver
