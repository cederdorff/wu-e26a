#!/usr/bin/env node

console.warn("Denne kommando er erstattet af Canvas API-spejlet. Kører canvas:pull i stedet.\n");
await import("./pull-canvas.js");
