# Materialer

Under [`canvas-filer/`](canvas-filer/) ligger en spejling af RACE's egne filer fra Canvas' Files-sektion (PDF'er, billeder, oplæg m.m.), organiseret i samme mappestruktur som i Canvas. En fil regnes som RACE's, når `RACE` står som et selvstændigt ord i filnavnet.

Filer der ikke er RACE's (fx DOB's slides, Bordgrupper-skemaer) downloades ikke længere som lokale kopier. De optræder stadig i sidernes og modulernes materialelister, men linker direkte til filen i Canvas. Fuld metadata for alle filer, inklusive dem der ikke er lokale, ligger i [`../canvas/data/files.json`](../canvas/data/files.json) (`canvas_url` + `local_path: null`).

**Kun pull.** Filerne hentes udelukkende med `npm run canvas:pull` og bliver aldrig sendt tilbage til Canvas — der findes ikke noget push for filer, kun for RACE-sider i `undervisning/`. Skal en fil opdateres eller tilføjes, gøres det i Canvas, og så hentes den herned.

Se [vedligeholdelse](../README.md#vedligeholdelse) for detaljer om pull/push.
