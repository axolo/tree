# Tree

A lightweight JavaScript library for tree data structure operations.

## Installation

```bash
npm i @axolo/tree
```

## Usage

```js
import Tree from '@axolo/tree'

// Sample data
const array = [
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child 1' },
  { id: 3, parentId: 1, name: 'Child 2' },
  { id: 4, parentId: 2, name: 'Grandchild' }
]

// Convert array to Tree instance
// tree.value is tree structure data
const tree = Tree.from(array)

// Convert tree to array
const resultArray = tree.toArray()

// Get path by id
const path = tree.path(4) // [{ id: 1, ... }, { id: 2, ... }, { id: 4, ... }]
const pathIds = tree.path(4, 'id') // [1, 2, 4]
const pathIndices = tree.path(4, null) // [0, 0, 0]

// Get parent node by id
const parent = tree.parent(4) // { id: 2, ... }

// Filter tree with condition function
const filtered = tree.filter(node => node.name.includes('Child'))

// Get subtree by id
const subtree = tree.sub(2) // [{ id: 2, children: [...] }]

// Get tree depth
const depth = tree.getDepth() // 3
```

## Configuration

| Property |  Type  |  Default   |             Description              |
| -------- | ------ | ---------- | ------------------------------------ |
| id       | string | 'id'       | Unique identifier property name      |
| parentId | string | 'parentId' | Parent node identifier property name |
| children | string | 'children' | Children property name               |
| depth    | string | 'depth'    | Depth property name                  |
| leaf     | string | 'leaf'     | Leaf node flag property name         |

## API

### `Tree.from(array, config = {})`

Convert an array to a Tree instance.

**Parameters:**

- `array` {Array} - Flattened tree data array
- `config` {Object} - Optional configuration

**Returns:** {Tree} - Tree instance

### `new Tree(tree, config = {})`

Create a new Tree instance.

**Parameters:**

- `tree` {Array} - Tree structure data array
- `config` {Object} - Optional configuration

**Returns:** {Tree} - Tree instance

### `tree.toArray()`

Convert tree back to flattened array.

**Returns:** {Array} - Flattened tree array

### `tree.path(id, key = undefined)`

Get the path from root to target node.

**Parameters:**

- `id` {String|Number} - Target node ID
- `key` {String|null|undefined} - Property key to return

**Returns:** {Array} - Path array containing nodes, specified keys, or indices

- `key` exists: Returns keys like `[root[key], ..., parent[key], self[key]]`
- `key` is `null`: Returns indices like `[root.index, ..., parent.index, self.index]`
- `key` is `undefined`: Returns nodes like `[root, ..., parent, self]`

### `tree.parent(id)`

Get the parent node of the target node.

**Parameters:**

- `id` {String|Number} - Target node ID

**Returns:** {Object|null} - Parent node or null

### `tree.filter(condition)`

Filter tree nodes by condition.

**Parameters:**

- `condition` {Function} - Filter function (receives node, returns boolean)

**Returns:** {Tree} - Filtered tree instance

### `tree.sub(id)`

Get the subtree rooted at target node.

**Parameters:**

- `id` {String|Number} - Target node ID

**Returns:** {Tree|null} - Subtree instance or null

### `tree.getDepth()`

Get the maximum depth of the tree.

**Returns:** {Number} - Tree depth
