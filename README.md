# WU-E26A · efterår 2026

Lokal planlægning og undervisningsmaterialer til Webudvikling, Canvas-kursus [WU-E26A](https://eaaa.instructure.com/courses/32059).

## Indhold

- [Undervisningssider](undervisning/README.md)
- [Canvas-moduler](canvas/moduler.md)
- `undervisning/` — ét nummereret dokument pr. Canvas-modul og side
- `materialer/canvas-filer/` — lokale kopier af Canvas-filer

## Canvas-spejl

Hele kurset spejles gennem Canvas API'et, inklusive upublicerede moduler og sider. Konfigurationen ligger lokalt i `.env`.

Hent den aktuelle Canvas-version med:

```bash
npm run canvas:pull
```

Filerne i `undervisning/` har et trecifret nummer, som følger modulernes rækkefølge i Canvas. Canvas-sider uden et modul placeres efter modulerne.

Hvis en spejlet Markdown-fil er ændret lokalt siden sidste pull, bevares den lokale version. Den nye Canvas-version lægges i `.canvas-incoming/`, så ændringerne kan sammenlignes. Brug kun force, når Canvas bevidst skal overskrive lokale ændringer:

```bash
npm run canvas:pull:force
```
