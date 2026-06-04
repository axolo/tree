import assert from 'node:assert'
import { describe, it } from 'node:test'
import Tree from '../src/tree.js'
import adcode from './330000.json' with { type: 'json' }

const config = { id: 'adcode', children: 'districts' }
const raw = new Tree(adcode, config)
const array = raw.toArray()
const tree = Tree.from(array, config)

describe('Tree', () => {
  describe('toArray', () => {
    it('should return non-empty array', () => {
      assert(Array.isArray(array))
      assert(array.length > 0)
    })
  })

  describe('getDepth', () => {
    it('should return positive number', () => {
      const depth = raw.getDepth()
      assert(typeof depth === 'number')
      assert(depth > 0)
    })
  })

  describe('Tree.from', () => {
    it('should return Tree instance', () => {
      assert(tree instanceof Tree)
    })

    it('should have tree property as array', () => {
      assert(Array.isArray(tree.tree))
    })
  })

  describe('tree.depth', () => {
    it('should be a number', () => {
      assert(typeof tree.depth === 'number')
    })

    it('should equal getDepth return value', () => {
      assert(tree.depth === raw.getDepth())
    })
  })

  describe('path', () => {
    it('should return object array when key is undefined', () => {
      const nodes = tree.path('330106008')
      assert(Array.isArray(nodes))
      assert.deepStrictEqual(nodes.map(i => i.adcode), ['33', '3301', '330106', '330106008'])
    })

    it('should return string array when key is specified', () => {
      const names = tree.path('330106008', 'name')
      assert(Array.isArray(names))
      assert.deepStrictEqual(names, ['浙江省', '杭州市', '西湖区', '西湖街道'])
    })

    it('should return index array when key is null', () => {
      const indexes = tree.path('330106008', null)
      assert(Array.isArray(indexes))
      assert.deepStrictEqual(indexes, [0, 10, 8, 4])
    })

    it('should return empty array when node not found', () => {
      const notFoundPath = tree.path('999999999')
      assert(Array.isArray(notFoundPath))
      assert(notFoundPath.length === 0)
    })
  })

  describe('filter', () => {
    it('should return filtered nodes array', () => {
      const filter = tree.filter(node => node.name.includes('湖'))
      assert(Array.isArray(filter))
      assert(filter.length > 0)
    })
  })

  describe('sub', () => {
    it('should return subtree array', () => {
      const subTree = tree.sub('330106')
      assert(subTree[0].adcode === '330106')
      assert(subTree[0].districts.every(i => i.adcode.startsWith('330106')))
    })

    it('should return empty array when node not found', () => {
      const notFoundSub = tree.sub('999999999')
      assert(Array.isArray(notFoundSub))
      assert(notFoundSub.length === 0)
    })
  })

  describe('parent', () => {
    it('should return parent node', () => {
      const parent = tree.parent('330106008')
      assert(typeof parent === 'object' && parent !== null)
      assert(parent.adcode === '330106')
    })

    it('should return null for root node', () => {
      const rootParent = tree.parent('33')
      assert(rootParent === null)
    })
  })
})
