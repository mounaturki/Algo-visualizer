# AlgoVisualizer UI

Landing page inspirée des visualiseurs d'algorithmes (ex. DSAVisualizer) réalisée en HTML, CSS et JavaScript avec Web Components.

## Fonctionnalités

- Navbar, sections héro/mission/FAQ/CTA, pied de page et modal de contact encapsulés dans des composants personnalisés (`<algo-navbar>`, `<algo-hero>`, etc.).
- Architecture modulaire (HTML + CSS + JS séparés par composant).
- Dispatch d'événement personnalisé (`algo:open-contact`) pour orchestrer l'ouverture du modal depuis d'autres sections.
- Préparation d'une future page “choix d'algorithmes” accessible via le bouton “Commencer”.

## Démarrage

Ce projet charge ses fichiers via `fetch()` et des modules ES, il doit donc être servi via HTTP.

```bash
# cloner et se placer dans le dossier
git clone https://github.com/<user>/<repo>.git
cd web project

# installer un serveur simple (méthode Node.js)
npx http-server -p 4173
```

Alternative : `python -m http.server 4173` ou extension “Live Server” de VS Code.  
Ensuite ouvrir `http://localhost:4173`.

## Architecture

```
web project/
├─ index.html          # bootstraps <algo-app>
├─ main.js             # importe AppShell
└─ components/
   ├─ AppShell/
   ├─ Navbar/
   ├─ HeroSection/
   ├─ FeaturesSection/
   ├─ MissionSection/
   ├─ FAQSection/
   ├─ QuestionsSection/
   ├─ CTASection/
   ├─ FooterSection/
   └─ ContactModal/
      (chaque dossier contient .html/.css/.js)
```

## À faire

- Créer la page de sélection/visualisation des algorithmes.
- Ajouter des tests ou linting automatisés si besoin.

## Licence

Libre d'utilisation pour projets personnels/étudiants. Adapte selon ton usage.
