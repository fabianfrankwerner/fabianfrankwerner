class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree([...new Set(array)].sort((a, b) => a - b));
  }

  buildTree(array) {
    if (!array.length) return null;
    const mid = Math.floor(array.length / 2);
    const node = new Node(array[mid]);
    node.left = this.buildTree(array.slice(0, mid));
    node.right = this.buildTree(array.slice(mid + 1));
    return node;
  }

  insert(value, node = this.root) {
    if (!node) {
      if (this.root === null) {
        this.root = new Node(value);
        return;
      }
      return new Node(value);
    }
    if (value < node.data) {
      node.left = this.insert(value, node.left);
    } else if (value > node.data) {
      node.right = this.insert(value, node.right);
    }
    return node;
  }

  deleteItem(value, node = this.root) {
    if (!node) return null;
    if (value < node.data) {
      node.left = this.deleteItem(value, node.left);
    } else if (value > node.data) {
      node.right = this.deleteItem(value, node.right);
    } else {
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let successor = node.right;
      while (successor.left) successor = successor.left;
      node.data = successor.data;
      node.right = this.deleteItem(successor.data, node.right);
    }
    if (node === this.root) this.root = node;
    return node;
  }

  find(value, node = this.root) {
    if (!node) return null;
    if (value === node.data) return node;
    if (value < node.data) return this.find(value, node.left);
    return this.find(value, node.right);
  }

  levelOrder(callback) {
    if (!callback) throw new Error("Callback required");
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      if (node) {
        callback(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
    }
  }

  inOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  preOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  postOrder(callback, node = this.root) {
    if (!callback) throw new Error("Callback required");
    if (!node) return;
    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  height(value) {
    const node = this.find(value);
    if (!node) return null;
    function getHeight(n) {
      if (!n) return -1;
      return 1 + Math.max(getHeight(n.left), getHeight(n.right));
    }
    return getHeight(node);
  }

  depth(value, node = this.root, currentDepth = 0) {
    if (!node) return null;
    if (value === node.data) return currentDepth;
    if (value < node.data)
      return this.depth(value, node.left, currentDepth + 1);
    return this.depth(value, node.right, currentDepth + 1);
  }

  isBalanced(node = this.root) {
    if (!node) return true;
    const leftHeight = this._getHeight(node.left);
    const rightHeight = this._getHeight(node.right);
    if (Math.abs(leftHeight - rightHeight) > 1) return false;
    return this.isBalanced(node.left) && this.isBalanced(node.right);
  }

  _getHeight(node) {
    if (!node) return -1;
    return (
      1 + Math.max(this._getHeight(node.left), this._getHeight(node.right))
    );
  }

  rebalance() {
    const values = [];
    this.inOrder((node) => values.push(node.data));
    this.root = this.buildTree(values);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Driver script
function randomArray(size = 15, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

const arr = randomArray();
const tree = new Tree(arr);
console.log("Initial tree:");
prettyPrint(tree.root);
console.log("Is balanced?", tree.isBalanced());

console.log("Level order:");
tree.levelOrder((node) => console.log(node.data));
console.log("Pre order:");
tree.preOrder((node) => console.log(node.data));
console.log("Post order:");
tree.postOrder((node) => console.log(node.data));
console.log("In order:");
tree.inOrder((node) => console.log(node.data));

// Unbalance the tree
[101, 102, 103, 104, 105].forEach((v) => tree.insert(v));
console.log("After inserting >100:");
prettyPrint(tree.root);
console.log("Is balanced?", tree.isBalanced());

tree.rebalance();
console.log("After rebalancing:");
prettyPrint(tree.root);
console.log("Is balanced?", tree.isBalanced());

console.log("Level order:");
tree.levelOrder((node) => console.log(node.data));
console.log("Pre order:");
tree.preOrder((node) => console.log(node.data));
console.log("Post order:");
tree.postOrder((node) => console.log(node.data));
console.log("In order:");
tree.inOrder((node) => console.log(node.data));
