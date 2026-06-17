/**
 * ** Tree **
 *
 * 提供树的转换、溯源、遍历、过滤、子树等操作
 *
 * @param {Array} value - 树结构的数组
 * @param {Object} config - 树的配置，包含id、parentId等属性
 */
class Tree {
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
  static #defaultConfig = {
    id: 'id',
    parentId: 'parentId',
    children: 'children',
    depth: 'depth',
    leaf: 'leaf',
  }

  constructor(value = [], config = {}) {
    this.value = value
    this.depth = 0
    this.nodeMap = null
    this.config = {
      ...Tree.#defaultConfig,
      ...config
    }
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
    const options = { ...Tree.#defaultConfig, ...config }
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

    // 2️⃣ 第二次遍历：建立父子关系
    array.forEach(item => {
      const node = map[item[id]]
      const parent = map[item[parentId]]

      if (parent) {
        parent[leaf] = false
        parent[children].push(node)
      } else {
        roots.push(node)
      }
    })

    // 3️⃣ 递归计算深度（不依赖数组顺序）
    const calcDepth = (nodes, deep) => {
      nodes.forEach(node => {
        node[depth] = deep
        if (node[depth] > maxDepth) {
          maxDepth = node[depth]
        }
        if (node[children]?.length) {
          calcDepth(node[children], deep + 1)
        }
      })
    }
    calcDepth(roots, 1)

    // 4️⃣ 移除空的 children 属性
    Object.values(map).forEach(node => {
      if (!node[children]?.length) {
        delete node[children]
      }
    })

    tree.value = roots
    tree.depth = maxDepth
    return tree
  }

  /**
   * ** getNodeMap **
   *
   * 获取节点映射表，键为节点的id，值为节点对象
   *
   * @return {Object} 节点映射表
   */
  getNodeMap() {
    if (this.nodeMap) {
      return this.nodeMap
    }

    const { id, children, parentId } = this.config
    const map = {}
    const stack = [...this.value.map((node, index) => ({ node, parentIndex: -1, index, parentNodeId: null }))]

    while (stack.length) {
      const { node, index, parentNodeId } = stack.pop()
      map[node[id]] = { node, index, parentNodeId }
      if (!node[parentId]) {
        node[parentId] = parentNodeId
      }
      if (node[children]?.length) {
        stack.push(...node[children].map((child, idx) => ({ node: child, index: idx, parentNodeId: node[id] })))
      }
    }

    this.nodeMap = map
    return map
  }

  /**
   * ** toArray **
   *
   * 将树转换为数组
   *
   * @return {Array} 数组表示的树
   */
  toArray() {
    const { id, parentId, children, leaf, depth } = this.config
    const result = []

    const traverse = (nodes, deep, parentNodeId) => {
      nodes.forEach(node => {
        const { [children]: kids, ...rest } = node

        result.push({
          ...rest,
          [depth]: deep,
          [parentId]: parentNodeId ?? null,
          [leaf]: !kids?.length
        })

        if (kids?.length) {
          traverse(kids, deep + 1, node[id])
        }
      })
    }

    traverse(this.value, 1, null)
    return result
  }

  /**
   * ** path **
   *
   * 获取指定对象的路径，返回路径上的所有对象的对象、指定key或索引数组
   *
   * - 如果`key`未定义（undefined），返回路径上的对象数组，如：`[{ id: '33', ... }, ..., { id: '330106', ... }, { id: '330106008', ... }]`
   * - 如果`key`存在（如：id），返回路径上的对象指定key数组，如：`['33', ..., '330106', '330106008']`
   * - 如果`key`不存在（如：null、false），则返回路径上的对象索引数组,如：`[0, ..., 5, 7]`
   *
   * @param {String} id - 对象的id
   * @param {String} key - 路径上的对象的key
   * @return {Array} 路径上的对象的对象数组、指定key数组或索引数组
   */
  path(id, key) {
    const { parentId } = this.config
    const map = this.getNodeMap()

    let entry = map[id]
    if (!entry) return []

    // 向回溯构建路径
    const pathEntries = [entry]
    while (entry.node[parentId]) {
      entry = map[entry.node[parentId]]
      if (!entry) break
      pathEntries.unshift(entry)
    }

    if (key === undefined) {
      return pathEntries.map(e => e.node)
    }

    return pathEntries.map(e => e.node[key] ?? e.index)
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
    const { parentId } = this.config
    const map = this.getNodeMap()
    const entry = map[id]
    if (!entry) return null
    const parentEntry = map[entry.node[parentId]]
    return parentEntry?.node || null
  }

  /**
   * ** myself **
   *
   * 获取指定对象的自身对象
   *
   * @param {String} id - 对象的id
   * @return {Object} 自身对象
   */
  myself(id) {
    return this.getNodeMap()[id]?.node || null
  }

  /**
   * ** filter **
   *
   * 根据指定条件过滤树，返回过滤后的树
   *
   * @param {Function} condition - 过滤条件函数，接收一个对象作为参数，返回一个布尔值
   * @return {Tree} 过滤后的树实例
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

    const filteredTree = filterTree(this.value)
    return new Tree(filteredTree, this.config)
  }

  /**
   * ** sub **
   *
   * 获取指定对象的子树，返回子树的数组表示
   *
   * @param {String} id - 对象的id
   * @return {Tree} 子树实例
   */
  sub(id) {
    const { children } = this.config
    const entry = this.getNodeMap()[id]
    if (!entry) return null
    const { node } = entry
    const kids = node[children] ? [...node[children]] : []
    return new Tree([{ ...node, [children]: kids }], this.config)
  }

  /**
   * ** getDepth **
   *
   * 获取树的深度，返回树的深度
   *
   * @return {Number} 树的深度
   */
  getDepth() {
    if (this.depth) return this.depth

    const { children } = this.config

    const calcDepth = nodes => {
      if (!nodes?.length) {
        return 0
      }

      return Math.max(...nodes.map(node =>
        node[children]?.length ? calcDepth(node[children]) + 1 : 1
      ))
    }

    this.depth = calcDepth(this.value)
    return this.depth
  }
}

export default Tree
