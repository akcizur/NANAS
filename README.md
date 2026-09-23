# NANAS

Minimal production publishing pipeline:

`Markdown → marked → production template → static HTML → GitHub Pages`

## Princip

Zdrojový obsah žije pouze v `content/`.

Build:

1. rekurzivně najde všechny `.md` soubory,
2. seřadí je podle cesty/názvu,
3. každý Markdown převede přes `marked`,
4. každý soubor vloží do vlastního `<article class="post-item">`,
5. všechny články vykreslí postupně pod sebe do `template.html`,
6. vytvoří čistý produkční `dist/index.html`,
7. zkopíruje `BetterText.css` do `dist/`.

`index.md` není speciální. Libovolný počet Markdown souborů funguje stejným způsobem.

## Struktura

```text
NANAS/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── content/
│   ├── 01.md
│   ├── 02.md
│   ├── ...
├── scripts/
│   └── build.js
├── BetterText.css
├── package.json
└── template.html
```

## Lokální build

```bash
npm install
npm run build
```

Výstup:

```text
dist/
├── index.html
└── BetterText.css
```

Produkční HTML se ručně neupravuje.

## GitHub Pages

Push do `main` spustí:

```text
GitHub Actions
  ↓
Node 24
  ↓
npm install
  ↓
npm run build
  ↓
dist/
  ↓
GitHub Pages
```

Workflow používá GitHub Pages artifact deployment. V GitHub repository settings musí být Pages nastavené na **GitHub Actions**.

## Obsah

Příkladem je:

`content/index.md`

Další dokumenty stačí přidat:

```text
content/
├── index.md
├── 01.md
├── 02.md
└── notes/
    └── 03.md
```

Všechny se automaticky dostanou do jediného produkčního `dist/index.html`.
