import Tree from '../src/tree.js'

const testArray = [
  { id: '1', name: 'id:1', parentId: null },
  { id: '1-1', name: 'id:1-1', parentId: '1' },
  { id: '1-2', name: 'id:1-2', parentId: '1' },
  { id: '1-1-1', name: 'id:1-1-1', parentId: '1-1' },
  { id: '1-1-2', name: 'id:1-1-2', parentId: '1-1' },
  { id: '1-1-2-1', name: 'id:1-1-2-1', parentId: '1-1-2' },
  { id: '2', name: 'id:2', parentId: null },
  { id: '2-1', name: 'id:2-1', parentId: '2' }
]

console.log('=== 测试数据 ===')
console.log(JSON.stringify(testArray, null, 2))

console.log('\n=== 1. 测试 fromArray 方法 ===')
const tree = new Tree([], { id: 'id', parentId: 'parentId', children: 'children' })
tree.fromArray(testArray)
console.log('树结构:', JSON.stringify(tree.tree, null, 2))
console.log('树的深度:', tree.deep)

console.log('\n=== 2. 测试 toArray 方法 ===')
const array = tree.toArray()
console.log('数组结构:', JSON.stringify(array, null, 2))

console.log('\n=== 3. 测试 path 方法 ===')
console.log('path("1-1-2-1", "") - 对象路径:', tree.path('1-1-2-1', ''))
console.log('path("1-1-2-1", "id") - 对象路径:', tree.path('1-1-2-1', 'id'))
console.log('path("1-1-2-1", "id") - id路径:', tree.path('1-1-2-1', 'id'))
console.log('path("1-1-2-1", null) - 索引路径:', tree.path('1-1-2-1', null))

console.log('\n=== 4. 测试 parent 方法 ===')
console.log('parent("1-1"):', tree.parent('1-1'))
console.log('parent("1"):', tree.parent('1'))
console.log('parent("1-1-1"):', tree.parent('1-1-1'))

console.log('\n=== 5. 测试 filter 方法 ===')
const filtered = tree.filter(node => node.name.includes('child'))
console.log('过滤包含 "child" 的节点:', JSON.stringify(filtered.tree, null, 2))

console.log('\n=== 6. 测试 sub 方法 ===')
const subTree = tree.sub('1')
console.log('获取 id="1" 的子树:', JSON.stringify(subTree, null, 2))
const subTree2 = tree.sub('1-1')
console.log('获取 id="1-1" 的子树:', JSON.stringify(subTree2, null, 2))

console.log('\n=== 7. 测试 getDeep 方法 ===')
console.log('树的深度:', tree.getDeep())

console.log('\n=== 所有测试完成 ===')
