export class StackPostfix {
  constructor(runner) {
    this.runner = runner;
  }

  async run() {
    const expression = '5 3 + 2 *';
    const tokens = expression.split(' ');
    const stack = [];
    
    this.runner.updateStackUI(stack, 10, `Évaluation Postfix: ${expression} = ?`);
    await this.runner.sleep(1500);
    
    for (const token of tokens) {
      if (!this.runner.isPlaying) break;
      
      const num = parseInt(token);
      
      if (!isNaN(num)) {
        stack.push(num);
        this.runner.updateStackUI(stack, 10, `Push(${num}) | Opérande`);
        await this.runner.sleep(900);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        let result;
        
        if (token === '+') result = a + b;
        else if (token === '-') result = a - b;
        else if (token === '*') result = a * b;
        else if (token === '/') result = Math.floor(a / b);
        
        stack.push(result);
        this.runner.updateStackUI(stack, 10, `Opérateur: ${a} ${token} ${b} = ${result}`);
        await this.runner.sleep(1200);
      }
    }
    
    this.runner.updateStackUI(stack, 10, `✓ Résultat Final: ${stack[0]}`);
    await this.runner.sleep(1500);
  }
}

