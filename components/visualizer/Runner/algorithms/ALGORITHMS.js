export const ALGORITHMS = {
  'linear-search': {
    title: 'Recherche Linéaire',
    what: 'Parcourt chaque élément un par un jusqu\'à trouver la valeur recherchée.',
    how: ['Commencer par le premier élément', 'Vérifier si égal à la cible', 'Si non, passer au suivant', 'Continuer jusqu\'à trouver ou fin'],
    steps: ['Initialiser pointeur', 'Comparer avec cible', 'Avancer le pointeur', 'Répéter'],
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' }
  },
  'binary-search': {
    title: 'Recherche Binaire',
    what: 'Divise la liste en deux à chaque itération pour trouver l\'élément efficacement.',
    how: ['La liste doit être triée', 'Calculer mid = (left + right) / 2', 'Si arr[mid] == target, trouvé', 'Sinon diviser l\'espace', 'Répéter jusqu\'à trouvé'],
    steps: ['Initialiser left et right', 'Calculer mid', 'Comparer arr[mid]', 'Diviser l\'espace', 'Répéter'],
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' }
  },
  'bubble-sort': {
    title: 'Tri à Bulles',
    what: 'Compare les éléments adjacents et les échange si nécessaire. Les plus grands « remontent ».',
    how: ['Comparer deux éléments adjacents', 'Si mal ordonnés, les échanger', 'Passer au couple suivant', 'Continuer jusqu\'à la fin', 'Recommencer pour le prochain passage'],
    steps: ['Initialiser deux pointeurs', 'Comparer arr[j] et arr[j+1]', 'Échanger si nécessaire', 'Incrémenter j', 'Passer au prochain passage'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
  },
  'selection-sort': {
    title: 'Tri par Sélection',
    what: 'Trouve le plus petit élément et le place au début, puis répète pour le reste.',
    how: ['Trouver le minimum dans le tableau non trié', 'Échanger avec le premier élément non trié', 'Avancer la limite du tableau trié', 'Répéter'],
    steps: ['Pour chaque position i', 'Trouver le minimum', 'Échanger arr[i] avec minimum', 'Continuer jusqu\'à la fin'],
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
  },
  'insertion-sort': {
    title: 'Tri par Insertion',
    what: 'Insère chaque élément à sa bonne place dans la partie triée du tableau.',
    how: ['Commencer par le deuxième élément', 'Le comparer avec les éléments triés', 'Insérer à la bonne place', 'Décaler les autres éléments'],
    steps: ['Pour chaque élément', 'Comparer avec éléments triés', 'Insérer à bonne place', 'Décaler les autres'],
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' }
  },
  'merge-sort': {
    title: 'Tri Fusion',
    what: 'Divise le tableau en deux, trie chaque moitié, puis les fusionne.',
    how: ['Diviser le tableau en deux moitiés', 'Récursivement trier chaque moitié', 'Fusionner les deux moitiés triées', 'Répéter jusqu\'à un seul élément'],
    steps: ['Diviser en deux', 'Trier moitié gauche', 'Trier moitié droite', 'Fusionner', 'Répéter'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' }
  },
  'quick-sort': {
    title: 'Tri Rapide',
    what: 'Choisit un pivot et partitionne le tableau en deux parties, puis trie récursivement.',
    how: ['Choisir un pivot', 'Partitionner autour du pivot', 'Éléments < pivot à gauche, > pivot à droite', 'Récursivement trier les partitions'],
    steps: ['Choisir pivot', 'Partitionner', 'Trier gauche', 'Trier droite', 'Combiner'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' }
  },
  'stack-push-pop': {
    title: 'Push & Pop',
    what: 'Démontre les opérations de base d\'une pile: ajouter et retirer du sommet.',
    how: ['Push: Ajouter un élément au sommet', 'Pop: Retirer l\'élément du sommet', 'LIFO: Last In First Out'],
    steps: ['Push 4 éléments', 'Observer la pile grandir', 'Pop tous les éléments', 'Observer la pile se vider'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  },
  'stack-peek': {
    title: 'Peek',
    what: 'Consulter l\'élément au sommet de la pile sans le retirer.',
    how: ['Accéder au sommet', 'Retourner la valeur', 'Ne pas modifier la pile'],
    steps: ['Initialiser pile', 'Consulter sommet', 'La pile reste inchangée'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  },
  'stack-is-empty': {
    title: 'Is Empty',
    what: 'Vérifier si la pile est vide.',
    how: ['Vérifier si le sommet == -1', 'Si oui, la pile est vide', 'Sinon, elle contient des éléments'],
    steps: ['Vérifier état', 'Ajouter éléments', 'Vérifier à nouveau', 'Retirer tous les éléments'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  },
  'stack-is-full': {
    title: 'Is Full',
    what: 'Vérifier si la pile a atteint sa capacité maximale.',
    how: ['Vérifier si longueur == capacité', 'Si oui, la pile est pleine', 'Sinon, il y a de la place'],
    steps: ['Vérifier état initial', 'Remplir la pile', 'Vérifier la capacité', 'Essayer d\'ajouter'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' }
  },
  'stack-postfix': {
    title: 'Postfix Notation',
    what: 'Évalue une expression en notation polonaise inversée (RPN).',
    how: ['Parcourir de gauche à droite', 'Si opérande: push', 'Si opérateur: pop deux opérandes, calculer, push résultat'],
    steps: ['Initialiser pile', 'Traiter chaque token', 'Pousser opérandes', 'Calculer opérateurs'],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' }
  },
  'stack-prefix': {
    title: 'Prefix Notation',
    what: 'Évalue une expression en notation polonaise (préfixe).',
    how: ['Parcourir de droite à gauche', 'Si opérande: push', 'Si opérateur: pop deux, calculer, push résultat'],
    steps: ['Inverser la chaîne', 'Traiter chaque token', 'Pousser opérandes', 'Calculer opérateurs'],
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' }
  },
  'stack-array': {
    title: 'Using Array',
    what: 'Implémentation de pile avec tableau statique à taille fixe.',
    how: ['Utiliser un tableau de taille fixe', 'Maintenir un pointeur top', 'Push: ajouter à arr[top]', 'Pop: retirer arr[top]'],
    steps: ['Créer tableau statique', 'Initialiser top = -1', 'Démontrer push/pop', 'Vérifier overflow'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  },
  'stack-linked-list': {
    title: 'Using Linked List',
    what: 'Implémentation de pile avec liste chaînée à taille dynamique.',
    how: ['Utiliser des nœuds chaînés', 'Maintenir un pointeur head', 'Push: créer nouveau nœud', 'Pop: supprimer head'],
    steps: ['Créer liste vide', 'Initialiser head = null', 'Démontrer push/pop', 'Montrer flexibilité'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  },
  'heap-sort': {
    title: 'Tri par Tas',
    what: 'Construit un tas max, puis extrait les éléments un par un pour obtenir un tableau trié.',
    how: ['Construire un tas max', 'Extraire le maximum (racine)', 'Réorganiser le tas', 'Répéter jusqu\'à vide'],
    steps: ['Construire tas', 'Extraire max', 'Réorganiser', 'Répéter'],
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }
  },
  'queue-enqueue-dequeue': {
    title: 'File - Enqueue & Dequeue',
    what: 'Démontre les opérations de base d\'une file: ajouter à la fin et retirer du début.',
    how: ['Enqueue: Ajouter à la fin', 'Dequeue: Retirer du début', 'FIFO: First In First Out'],
    steps: ['Enqueue 4 éléments', 'Observer la file grandir', 'Dequeue tous les éléments', 'Observer la file se vider'],
    complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(n)' }
  },
  'linked-list-insertion': {
    title: 'Liste Chaînée - Insertion',
    what: 'Insère un nœud dans une liste chaînée à différentes positions.',
    how: ['Créer nouveau nœud', 'Ajuster les pointeurs', 'Insérer au début/milieu/fin', 'Mettre à jour les liens'],
    steps: ['Créer nœud', 'Trouver position', 'Ajuster pointeurs', 'Insérer'],
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' }
  },
  
};

