/**
 * ** Tree **
 *
 * 提供树的转换、溯源、遍历、过滤、子树等操作
 *
 * @param {Array} tree - 树的数组表示
 * @param {Object} config - 树的配置，包含id、parentId等属性
 */
class Tree {
  constructor(tree, config) {
    this.tree = tree
    this.depth = 0
    this.config = {
      ...Tree.config,
      ...config
    }
  }

  /**
   * ** config **
   *
   * 树的默认配置，包含id、parentId、children、depth、leaf等属性
   *
   * @type {Object}
   * @property {string} id - 节点的唯一标识符属性名
   * @property {string} parentId - 节点的父节点属性名
   * @property {string} children - 节点的子节点属性名
   * @property {string} depth - 节点的深度属性名
   * @property {string} leaf - 节点是否为叶子节点属性名
   */
  static config = {
    id: 'id',
    parentId: 'parentId',
    children: 'children',
    depth: 'depth',
    leaf: 'leaf',
  }

  /**
   * ** fromArray **
   *
   * 将数组转换为树
   *
   * @param {Array} array - 数组表示的树
   * @return {Tree} 树对象
   */
  static from(array, config) {
    const options = { ...Tree.config, ...config }
    const { id, parentId, children, leaf, depth } = options
    const tree = new Tree([], options)
    const map = {}
    const roots = []
    let maxDepth = 0

    // 1️⃣ 第一次遍历：初始化节点
    array.forEach(item => {
      map[item[id]] = {
        ...item,
        [leaf]: true,
        [depth]: 0, // 先占位
        [children]: []
      }
    })

    // 2️⃣ 第二次遍历：建立父子关系并设置深度
    array.forEach(item => {
      const node = map[item[id]]
      const parent = map[item[parentId]]

      if (parent) {
        parent[leaf] = false
        node[depth] = parent[depth] + 1
        parent[children].push(node)
      } else {
        node[depth] = 1 // 🌱 根节点深度为 1
        roots.push(node)
      }

      // 🔥 实时更新最大深度
      if (node[depth] > maxDepth) {
        maxDepth = node[depth]
      }
    })

    // 3️⃣ 移除空的 children 属性
    Object.values(map).forEach(node => {
      if (node[children]?.length === 0) {
        delete node[children]
      }
    })

    tree.tree = roots
    tree.depth = maxDepth
    return tree
  }

  /**
   * ** toArray **
   *
   * 将树转换为数组
   *
   * @return {Array} 数组表示的树
   */
  toArray() {
    const {
      id: idKey,
      parentId,
      children,
      leaf,
      depth: depthKey
    } = this.config

    const result = []

    const traverse = (nodes, depth, parentNodeId) => {
      nodes.forEach(node => {
        const { [children]: kids, ...rest } = node
        result.push({
          ...rest,
          [depthKey]: depth,
          [parentId]: parentNodeId ?? null,
          [leaf]: !!kids?.length
        })
        if (kids?.length) {
          traverse(kids, depth + 1, node[idKey])
        }
      })
    }

    traverse(this.tree, 1, null)
    return result
  }

  /**
   * ** path **
   *
   * 获取指定对象的路径，返回路径上的所有对象的对象、指定key或索引数组
   *
   * - 如果`key`未定义（undefined），返回路径上的对象数组，如：`[{ id: '33', name: '浙江' }, ..., { id: '330106', name: '西湖区' }, { id: '330106008', name: '西湖街道' }]`
   * - 如果`key`存在（如：id），返回路径上的对象指定key数组，如：`['33', ..., '330106', '330106008']`
   * - 如果`key`不存在（如：null、false），则返回路径上的对象索引数组,如：`[0, ..., 5, 7]`
   *
   * @param {String} id - 对象的id
   * @param {String} key - 路径上的对象的key
   * @return {Array} 路径上的对象的对象数组、指定key数组或索引数组
   */
  path(id, key) {
    const { id: idKey, children } = this.config

    const findPath = (nodes, currentPath) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const newPath = [...currentPath, { node, index: i }]

        if (node[idKey] === id) {
          return newPath
        }

        if (node[children]?.length > 0) {
          const found = findPath(node[children], newPath)
          if (found) return found
        }
      }
      return null
    }

    const foundPath = findPath(this.tree, [])
    if (!foundPath) return []

    if (key === undefined) {
      return foundPath.map(item => item.node)
    } else {
      return foundPath.map(item => item.node[key] ?? item.index)
    }
  }

  /**
   * ** parent **
   *
   * 获取指定对象的父对象
   *
   * @param {String} id - 对象的id
   * @return {Object} 父对象
   */
  parent(id) {
    const { id: idKey, children } = this.config

    const findParent = (nodes, parentNode) => {
      for (const node of nodes) {
        if (node[idKey] === id) {
          return parentNode
        }
        if (node[children]?.length > 0) {
          const found = findParent(node[children], node)
          if (found !== null) return found
        }
      }
      return null
    }

    return findParent(this.tree, null)
  }

  /**
   * ** filter **
   *
   * 根据指定条件过滤树，返回过滤后的树
   *
   * @param {Function} condition - 过滤条件函数，接收一个对象作为参数，返回一个布尔值
   * @return {Array} 过滤后的树数组表示
   */
  filter(condition) {
    const { children } = this.config

    const filterTree = nodes => {
      return nodes.reduce((acc, node) => {
        const filtered = { ...node }
        if (node[children]?.length > 0) {
          filtered[children] = filterTree(node[children])
        }
        if (condition(node) || filtered[children]?.length > 0) {
          if (!filtered[children]?.length) {
            delete filtered[children]
          }
          acc.push(filtered)
        }
        return acc
      }, [])
    }

    const filteredTree = filterTree(this.tree)
    return filteredTree
  }

  /**
   * ** sub **
   *
   * 获取指定对象的子树，返回子树的数组表示
   *
   * @param {String} id - 对象的id
   * @return {Array} 子树的数组表示
   */
  sub(id) {
    const { id: idKey, children } = this.config

    const findSub = nodes => {
      for (const node of nodes) {
        if (node[idKey] === id) {
          return {
            ...node,
            [children]: node[children] ? [...node[children]] : []
          }
        }
        if (node[children]?.length > 0) {
          const found = findSub(node[children])
          if (found) return found
        }
      }
      return null
    }

    const result = findSub(this.tree)
    return result ? [result] : []
  }

  /**
   * ** getDepth **
   *
   * 获取树的深度，返回树的深度
   *
   * @return {Number} 树的深度
   */
  getDepth() {
    if (this.depth) {
      return this.depth
    }

    const { children } = this.config

    const calcDepth = nodes => {
      if (!nodes || nodes.length === 0) {
        return 0
      }

      let maxDepth = 0
      nodes.forEach((item) => {
        const childDepth = item[children]?.length
          ? calcDepth(item[children]) + 1
          : 0
        maxDepth = Math.max(maxDepth, childDepth)
      })

      return maxDepth
    }

    this.depth = calcDepth(this.tree) + 1
    return this.depth
  }
}

export default Tree
