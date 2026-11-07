# olivierbourgault.github.io — Version 3 (V3 Multi-Styles)

Ce dossier contient la **Version 3 (Édition Multi-Styles)** de mon portfolio ([https://olivierbourgault.github.io/V3/](https://olivierbourgault.github.io/V3/)).
En plus de l'ensemble du contenu enrichi de la V2, cette version intègre un **sélecteur flottant de 4 styles visuels** (commutables en temps réel en mode sombre et en mode clair, ou accessibles directement par paramètre d'URL) :

1. **Original — Améthyste & Fuchsia** (`?palette=amethyst`) :
   - **Mode Sombre** : Fond noir améthyste (`#0A0812`), accents rose fuchsia néon (`#E11484`) et mauve électrique (`#A855F7`), grille subtile et halos diffus (`blur(45px)`).
   - **Mode Clair** : Fond blanc perle lavande (`#FAF7FD`), accents rose fuchsia (`#D946EF`) et mauve profond (`#9333EA`), texte aubergine (`#181124`).
2. **Active Theory — Cyberpunk Synthwave** (`?palette=synthwave`, inspiré d'[Active Theory](https://activetheory.net/work)) :
   - **Mode Sombre** : Fond nuit profonde (`#070814`), cyan électrique néon (`#00F0FF`) et magenta électrique (`#C026D3` / `#FF2A85`), lueurs néon sur les boutons et bordures supérieures lumineuses sur les cartes.
3. **Ethiack — Terminal Matrix Hacker** (`?palette=ethiack`, inspiré d'[Ethiack](https://ethiack.com/)) :
   - **Mode Sombre** : Fond terminal sombre (`#060D0A`), vert émeraude néon (`#10B981`) et vert profond (`#059669`), typographie `JetBrains Mono` pour les titres, et trame matricielle binaire (`01001101...`) en arrière-plan.
4. **Tech Présentation — Keynote Orange** (`?palette=tech`, inspiré du gabarit de présentation technique) :
   - **Mode Sombre** : Fond carbone (`#121316`), panneaux `#1C1E24` / `#252830`, bordures `#343844`, orange vif (`#FF6600`), accents géométriques bleu ciel (`#38BDF8`), grille technique `40px × 40px` et **Pointeur Laser Virtuel** activable via le bouton dédié ou la touche `L`.

Le code du site se trouve dans [`index.html`](index.html) et dépend des ressources situées dans le dossier [`./assets`](assets/). Ce site est inspiré d'un [modèle](assets/README.md) en ligne.
