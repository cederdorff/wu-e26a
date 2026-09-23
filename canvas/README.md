# Canvas

Rå spejling af Canvas-kursets API-data: moduler, sider, opgaver, filer, mapper m.m. under [`data/`](data/), samt [`moduler.md`](moduler.md) som et læsbart moduloverblik og `mirror-manifest.json` som bogholderi for pull/push af `undervisning/*.md`.

**Kun pull.** Indholdet her opdateres udelukkende af `npm run canvas:pull` og bliver aldrig sendt tilbage til Canvas. Redigér ikke filerne i hånden — ændringer forsvinder ved næste pull. Skal noget ændres, gøres det i Canvas, og så hentes det herned.

Se [vedligeholdelse](../README.md#vedligeholdelse) for detaljer om pull/push.
