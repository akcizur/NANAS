# NANAS

Minimal static publishing pipeline:

`Markdown → marked → HTML template → GitHub Pages`

## Structure

```text
NANAS/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── content/
│   └── index.md
├── scripts/
│   └── build.js
├── BetterText.css
├── package.json
└── template.html
```

## Local build

```bash
npm install
npm run build
```

Výstup vznikne v:

`dist/index.html`

## GitHub Pages

Push do `main` automaticky spouští workflow v:

`.github/workflows/deploy.yml`

V GitHubu musí být Pages nastavené na **GitHub Actions**. Po prvním úspěšném workflow bude web dostupný na GitHub Pages URL repozitáře.

## Obsah

Primární zdroj je:

`content/index.md`

Publikovaný HTML soubor není nutné ručně udržovat.
