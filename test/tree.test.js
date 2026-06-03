import { inspect } from 'node:util'
import Tree from '../src/tree.js'
import adcode from './330000.json' with { type: 'json' }

const format = (obj, depth = null) => inspect(obj, { depth })

const config = { id: 'adcode', children: 'districts' }
const raw = new Tree(adcode, config)

const array = raw.toArray()
console.log('\n=== raw.toArray ===\n', format(array))
console.log('\n=== tree.getDeep ===\n', format(raw.getDeep()))

const tree = Tree.from(array, config)
console.log('\n=== Tree.from ===\n', format(tree.tree))
console.log('\n=== tree.deep ===\n', format(tree.deep))

const path = tree.path('330106008')
console.log('\n=== tree.path:undefined ===\n', format(path))

const name = tree.path('330106008', 'name')
console.log('\n=== tree.path:name ===\n', format(name))

const index = tree.path('330106008', null)
console.log('\n=== tree.path:null ===\n', format(index))

const filter = tree.filter(node => node.name.includes('湖'))
console.log('\n=== tree.filter ===\n', format(filter))

const sub = tree.sub('330106')
console.log('\n=== tree.sub ===\n', format(sub))

const parent = tree.parent('330106008')
console.log('\n=== tree.parent ===\n', format(parent))
