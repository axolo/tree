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
    this.deep = 0
    this.config = {
      id: 'id',
      parentId: 'parentId',
      children: 'children',
      deep: 'deep',
      leaf: 'leaf',
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
  fromArray(array) {
    const { id, parentId, children, leaf, deep } = this.config
    const map = {}
    const roots = []
    let maxDeep = 0

    // 1️⃣ 第一次遍历：初始化节点
    array.forEach(item => {
      map[item[id]] = {
        ...item,
        [leaf]: true,
        [deep]: 0, // 先占位
        [children]: []
      }
    })

    // 2️⃣ 第二次遍历：建立父子关系并设置深度
    array.forEach(item => {
      const node = map[item[id]]
      const parent = map[item[parentId]]

      if (parent) {
        parent[leaf] = false
        node[deep] = parent[deep] + 1
        parent[children].push(node)
      } else {
        node[deep] = 1 // 🌱 根节点深度为 1
        roots.push(node)
      }

      // 🔥 实时更新最大深度
      if (node[deep] > maxDeep) {
        maxDeep = node[deep]
      }
    })

    this.tree = roots
    this.deep = maxDeep
    return this
  }

  /**
   * ** toArray **
   *
   * 将树转换为数组
   *
   * @return {Array} 数组表示的树
   */
  toArray() {
    const { children, deep: deepKey, leaf } = this.config
    const result = []

    const traverse = (nodes, deep) => {
      nodes.forEach(node => {
        const { [children]: kids, ...rest } = node
        result.push({ ...rest, [deepKey]: deep })
        if (kids?.length) {
          traverse(kids, deep + 1)
        }
      })
    }

    traverse(this.tree, 1)
    return result
  }

  /**
   * ** path **
   *
   * 获取指定对象的路径，返回路径上的所有对象的对象、指定key或索引数组
   *
   * - 如果`key`为空字符串，返回路径上的对象的对象数组，如：`[root, ..., parent, self]`
   * - 如果`key`存在，返回路径上的对象的指定key数组，如：`['33', ..., '330110', '33011001']`
   * - 如果`key`不存在，返回路径上的对象的索引数组,如：`[0, ..., 2, 0]`
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

        if (node[children] && node[children].length > 0) {
          const found = findPath(node[children], newPath)
          if (found) return found
        }
      }
      return null
    }

    const foundPath = findPath(this.tree, [])
    if (!foundPath) return []

    if (key === '') {
      return foundPath.map(item => item.node)
    } else if (key) {
      return foundPath.map(item => item.node[key])
    } else {
      return foundPath.map(item => item.index)
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
          if (found !== undefined) return found
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
   * @return {Tree} 过滤后的树
   */
  filter(condition) {
    const { children } = this.config

    const filterTree = nodes => {
      return nodes.reduce((acc, node) => {
        const filtered = { ...node }
        if (node[children]?.length > 0) {
          filtered[children] = filterTree(node[children])
        } else {
          filtered[children] = []
        }
        if (condition(node) || filtered[children].length > 0) {
          acc.push(filtered)
        }
        return acc
      }, [])
    }

    const filteredTree = filterTree(this.tree)
    return new Tree(filteredTree, this.config)
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
        if (node[children] && node[children].length > 0) {
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
   * ** getDeep **
   *
   * 获取树的深度，返回树的深度
   *
   * @return {Number} 树的深度
   */
  getDeep() {
    if (this.deep) {
      return this.deep
    }

    const { children } = this.config

    const calcDeep = nodes => {
      if (!nodes || nodes.length === 0) {
        return 0
      }

      let maxDeep = 0
      nodes.forEach((item) => {
        const childDeep = item[children]?.length
          ? calcDeep(item[children]) + 1
          : 0
        maxDeep = Math.max(maxDeep, childDeep)
      })

      return maxDeep
    }

    this.deep = calcDeep(this.tree) + 1
    return this.deep
  }
}

export default Tree
