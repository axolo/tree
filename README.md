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

// Convert array to tree
const tree = Tree.from(array)

// Convert tree to array
const resultArray = tree.toArray()

// Get path by id
const path = tree.path(4) // [{ id: 1, ... }, { id: 2, ... }, { id: 4, ... }]
const pathIds = tree.path(4, 'id') // [1, 2, 4]
const pathIndices = tree.path(4, null) // [0, 0, 0]

// Get parent node
const parent = tree.parent(4) // { id: 2, ... }

// Filter tree
const filtered = tree.filter(node => node.name.includes('Child'))

// Get subtree
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

Convert an array to a tree structure.

**Parameters:**

- `array` {Array} - Array representation of tree data
- `config` {Object} - Optional configuration object

**Returns:** {Tree} - Tree instance

### `tree.toArray()`

Convert tree back to array.

**Returns:** {Array} - Array representation of the tree

### `tree.path(id, key = undefined)`

Get the path from root to the target node.

**Parameters:**

- `id` {String|Number} - Target node id
- `key` {String|null|undefined} - Return property key

**Returns:** {Array} Path array containing nodes, specified keys, or indices depending on key parameter

- key is undefined:  nodes like `[root, ..., parent, self]`
- existing key: keys like `[root[key], ..., parent[key], self[key]]`
- not existing key: indices like `[root.index, ..., parent.index, self.index]`

### `tree.parent(id)`

Get parent node of the target node.

**Parameters:**

- `id` {String|Number} - Target node id

**Returns:** {Object|null} - Parent node or null

### `tree.filter(condition)`

Filter tree nodes by condition.

**Parameters:**

- `condition` {Function} - Filter function (receives node, returns boolean)

**Returns:** {Array} - Filtered tree array

### `tree.sub(id)`

Get subtree rooted at target node.

**Parameters:**

- `id` {String|Number} - Target node id

**Returns:** {Array} - Subtree array

### `tree.getDepth()`

Get the maximum depth of the tree.

**Returns:** {Number} - Tree depth
