import localforage from 'localforage'

export default class Store {
  /**
   * @classdesc
离线存储方案。通过类似 `localStorage API` 的异步存储来改进应用程序的离线体验。能存储多种类型的数据，而不仅仅是字符串。

此方案基于 [localforage](http://localforage.docschina.org/) 封装，采用优雅降级，优先使用 IndexedDB 或 WebSQL，若浏览器不支持，则使用 localStorage。
   * @constructs Store
   * @param {Object} config 配置项
   * @param {String} config.name 业务线或项目名称，如：`platform_book`
   * @param {Number} config.expire 默认过期时间，单位天，不设置则永久储存
   */
  constructor(config = {}) {
    this.expire = config.expire || 0
    try {
      this.store = localforage.createInstance(Object.assign({
        name: 'common_store',
        // web sql 不稳定
        driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE]
      }, config))
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 保存离线数据
   * @method Store#setItem
   * @param {String} key
   * @param {Any} value 支持对象，数组，字符串，数字及二进制文件
   * @param {Number} [expire] 过期时间，单位天。默认取初始化时设置的过期时间
   * @return {Promise} 返回一个 `Promise`，`resolve` 状态的回调参数为 `value`
   */
  setItem(key, value, expire = this.expire) {
    if (expire) {
      expire = Date.now() + expire * 24 * 60 * 60 * 1000
    }

    return this.store.setItem(key, { value, expire })
      .then(res => res.value)
  }

  /**
   * 获取离线数据
   * @method Store#getItem
   * @param {String} key
   * @return {Promise} 返回一个 `Promise`，`resolve` 状态的回调参数为 `value`
   */
  getItem(key) {
    return this.store.getItem(key).then(res => {
      if (!res) return null

      const { value, expire } = res

      if (expire && expire < Date.now()) {
        return this.removeItem(key)
          .then(() => null) // 返回 null
      }

      return value
    })
  }

  /**
   * 删除离线数据
   * @method Store#removeItem
   * @param {String} key
   * @return {Promise} 返回一个 `Promise`
   */
  removeItem(key) {
    return this.store.removeItem(key)
  }

  /**
   * 清空当前数据库，请谨慎操作
   * @method Store#clear
   * @return {Promise} 返回一个 `Promise`
   */
  clear() {
    return this.store.clear()
  }

  /**
   * 清空当前数据库过期数据
   * @method Store#clearExpired
   * @return {Promise} 返回一个 `Promise`
   */
  async clearExpired() {
    const keys = await this.keys()

    return Promise.all(
      keys.map(key => new Promise((resolve, reject) => {
        this.getItem(key).then(resolve).catch(reject)
      }))
    ).then(() => { }) // 返回 undefined
  }

  /**
   * 获取当前数据库 `key` 的数量
   * @method Store#length
   * @return {Promise} 返回一个 `Promise`，`resolve` 状态的回调参数为 `length`
   */
  length() {
    return this.store.length()
  }

  /**
   * 获取当前数据库的所有 `key`
   * @method Store#keys
   * @return {Promise} 返回一个 `Promise`，`resolve` 状态的回调参数为包含所有 `key` 的数组
   */
  keys() {
    return this.store.keys()
  }
}
