declare module '@axolo/tree' {
  export interface TreeConfig {
    id?: string
    parentId?: string
    children?: string
    depth?: string
    leaf?: string
  }

  export interface TreeNode {
    [key: string]: any
  }

  export default class Tree {
    value: any[]
    depth: number
    nodeMap: Record<string, { node: any; index: number }> | null
    config: Required<TreeConfig>

    constructor(value: any[], config?: TreeConfig)

    /**
     * 将数组转换为树
     * @param array - 数组表示的树
     * @param config - 树的配置
     * @returns 树对象
     */
    static from(array: any[], config?: TreeConfig): Tree

    /**
     * 获取节点映射表
     * @returns 节点映射表
     */
    getNodeMap(): Record<string, { node: any; index: number }>

    /**
     * 将树转换为数组
     * @returns 数组表示的树
     */
    toArray(): any[]

    /**
     * 获取指定对象的路径
     * @param id - 对象的 id
     * @param key - 路径上的对象的 key（可选）
     * @returns 路径上的对象数组、指定 key 数组或索引数组
     */
    path(id: string, key?: string): any[]

    /**
     * 获取指定对象的父对象
     * @param id - 对象的 id
     * @returns 父对象
     */
    parent(id: string): any | null

    /**
     * 获取指定对象的自身对象
     * @param id - 对象的 id
     * @returns 自身对象
     */
    myself(id: string): any | null

    /**
     * 根据指定条件过滤树
     * @param condition - 过滤条件函数
     * @returns 过滤后的树实例
     */
    filter(condition: (node: any) => boolean): Tree

    /**
     * 获取指定对象的子树
     * @param id - 对象的 id
     * @returns 子树实例
     */
    sub(id: string): Tree | null

    /**
     * 获取树的深度
     * @returns 树的深度
     */
    getDepth(): number
  }
}
