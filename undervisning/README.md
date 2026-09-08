# Undervisning

Canvas-kurset spejles som en flad, nummereret række Markdown-filer. Én fil repræsenterer ét Canvas-modul og samler modulside, links, filer, overskrifter og øvrige modulelementer. Canvas-sider uden modul ligger sidst i rækken.

Hver spejlet fil har stabile Canvas-ID'er i metadatafeltet nederst. Push bruger side-ID'et til at opdatere indholdet på den eksisterende side.

Brug [`_skabelon.md`](_skabelon.md) som kladde til nye undervisningssider. Opret siden i Canvas og kør `npm run canvas:pull`, før den kan opdateres herfra. Se [vedligeholdelse](../README.md#vedligeholdelse) for push og manuel spejling.

Den fælles sidestruktur er:

1. Formål eller dagens fokus
2. Agenda
3. Forberedelse
4. Materialer, herunder slides og opgaver

Se [Canvas-moduloverblikket](../canvas/moduler.md) for rækkefølge og øvrige elementer.
