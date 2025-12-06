export class BinaryTreeTraversal {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    // Créer un arbre binaire simple
    //        1
    //       / \
    //      2   3
    //     / \ / \
    //    4  5 6  7
    const tree = {
      value: 1,
      left: {
        value: 2,
        left: { value: 4, left: null, right: null },
        right: { value: 5, left: null, right: null }
      },
      right: {
        value: 3,
        left: { value: 6, left: null, right: null },
        right: { value: 7, left: null, right: null }
      }
    };
    
    this.tree = tree; // Sauvegarder pour les méthodes de parcours
    this.runner.updateBinaryTreeUI(tree, 'Arbre Binaire - Parcours: Visualisation de l\'arbre');
    await this.runner.sleep(2000);
    
    // Inorder: Gauche → Racine → Droite (4, 2, 5, 1, 6, 3, 7)
    this.runner.updateMessage('Parcours Inorder: Gauche → Racine → Droite');
    await this.runner.sleep(1000);
    const inorder = [];
    await this.inorderTraversal(tree, inorder);
    this.runner.updateMessage(`✓ Inorder: ${inorder.join(' → ')}`);
    await this.runner.sleep(2000);
    
    // Preorder: Racine → Gauche → Droite (1, 2, 4, 5, 3, 6, 7)
    this.runner.updateMessage('Parcours Preorder: Racine → Gauche → Droite');
    await this.runner.sleep(1000);
    const preorder = [];
    await this.preorderTraversal(tree, preorder);
    this.runner.updateMessage(`✓ Preorder: ${preorder.join(' → ')}`);
    await this.runner.sleep(2000);
    
    // Postorder: Gauche → Droite → Racine (4, 5, 2, 6, 7, 3, 1)
    this.runner.updateMessage('Parcours Postorder: Gauche → Droite → Racine');
    await this.runner.sleep(1000);
    const postorder = [];
    await this.postorderTraversal(tree, postorder);
    this.runner.updateMessage(`✓ Postorder: ${postorder.join(' → ')}`);
    await this.runner.sleep(2000);
  }

  async inorderTraversal(node, result) {
    if (!node || !this.runner.isPlaying) return;
    
    await this.inorderTraversal(node.left, result);
    result.push(node.value);
    this.runner.updateMessage(`Visité: ${node.value} (Inorder) - Ordre: ${result.join(' → ')}`);
    this.runner.updateBinaryTreeUI(this.tree, `Inorder: ${result.join(' → ')}`);
    await this.runner.sleep(800);
    await this.inorderTraversal(node.right, result);
  }

  async preorderTraversal(node, result) {
    if (!node || !this.runner.isPlaying) return;
    
    result.push(node.value);
    this.runner.updateMessage(`Visité: ${node.value} (Preorder) - Ordre: ${result.join(' → ')}`);
    this.runner.updateBinaryTreeUI(this.tree, `Preorder: ${result.join(' → ')}`);
    await this.runner.sleep(800);
    await this.preorderTraversal(node.left, result);
    await this.preorderTraversal(node.right, result);
  }

  async postorderTraversal(node, result) {
    if (!node || !this.runner.isPlaying) return;
    
    await this.postorderTraversal(node.left, result);
    await this.postorderTraversal(node.right, result);
    result.push(node.value);
    this.runner.updateMessage(`Visité: ${node.value} (Postorder) - Ordre: ${result.join(' → ')}`);
    this.runner.updateBinaryTreeUI(this.tree, `Postorder: ${result.join(' → ')}`);
    await this.runner.sleep(800);
  }
}
