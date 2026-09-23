# NANAS

## Markdown → HTML → GitHub Pages

Tento web je generovaný automaticky z tohoto souboru:

`content/index.md`

Každý push do větve `main` spustí GitHub Actions:

1. nainstaluje Node.js,
2. nainstaluje `marked`,
3. převede Markdown na HTML,
4. vloží HTML do `template.html`,
5. přidá `BetterText.css`,
6. publikuje obsah přes GitHub Pages.

## Úprava obsahu

Stačí upravit Markdown a commitnout změnu:

```bash
git add content/index.md
git commit -m "docs: update content"
git push
```

Není potřeba ručně generovat `dist/index.html`.

> Zdrojový obsah je Markdown. Výsledný web je statické HTML.

---

**NANAS** · automated Markdown publishing
