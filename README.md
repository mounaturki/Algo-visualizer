# AlgoVisualizer UI

Landing page inspirée des visualiseurs d'algorithmes (ex. DSAVisualizer) réalisée en HTML, CSS et JavaScript avec Web Components.

## Fonctionnalités

- Navbar, sections héro/mission/FAQ/CTA, pied de page et modal de contact encapsulés dans des composants personnalisés (`<algo-navbar>`, `<algo-hero>`, etc.).
- Architecture modulaire (HTML + CSS + JS séparés par composant) regroupée dans `components/home`.
- Dispatch d'événement personnalisé (`algo:open-contact`) pour orchestrer l'ouverture du modal depuis d'autres sections.
- Page “Visualiser” dédiée (`visualizer.html`) avec un sélecteur d'algorithmes (tri, recherche, graphes, etc.) hébergé dans `components/visualizer`.

## Démarrage

Ce projet charge ses fichiers via `fetch()` et des modules ES, il doit donc être servi via HTTP.

```bash
# cloner et se placer dans le dossier
git clone https://github.com/mounaturki/Algo-visualizer.git
cd "web project"

# lancer un serveur simple (Node.js)
npx http-server -p 4173
```

Alternative : `python -m http.server 4173` ou extension “Live Server” de VS Code.  
Ensuite ouvrir :

- `http://localhost:5100/main.html` pour la landing page
- `http://localhost:5100/visualizer.html` pour la page de sélection des algorithmes

## Architecture

```
web project/
├─ main.html                 # bootstraps <algo-app>
├─ main.js                   # importe components/home/AppShell
├─ visualizer.html           # bootstraps <visualizer-app>
├─ visualizer.js             # importe components/visualizer/AppShell
└─ components/
   ├─ home/
   │  ├─ AppShell/
   │  ├─ Navbar/
   │  ├─ HeroSection/
   │  ├─ FeaturesSection/
   │  ├─ MissionSection/
   │  ├─ FAQSection/
   │  ├─ QuestionsSection/
   │  ├─ CTASection/
   │  ├─ FooterSection/
   │  └─ ContactModal/
   └─ visualizer/
      ├─ AppShell/
      ├─ Navbar/
      └─ AlgorithmGrid/
```

Chaque dossier contient un trio `.html + .css + .js` chargé dynamiquement via `fetch`.

## À faire

- Lier chaque bouton “Visualiser” à une véritable animation / logicielle d'algorithme.
- Ajouter des tests ou linting automatisés si besoin.

## Licence

Libre d'utilisation pour projets personnels/étudiants. Adapte selon ton usage.
