import SystemDocumentMixin from "../mixin.mjs";

/**
 * Ship Document
 * @extends {Actor}
 */
export class Ship extends SystemDocumentMixin(Actor) {
  /**
   * 定义该文档类型所使用的数据模型
   * @type {string}
   */
  static dataModel = "ShipData";

  /**
   * 为该文档类型指定集合
   * @type {string}
   */
  static collectionName = "ships";

  /**
   * 准备文档数据
   */
  prepareData() {
    super.prepareData();
    // 在这里添加飞船特有的数据准备逻辑
  }

  /**
   * 获取飞船的特定属性或能力
   */
  get capabilities() {
    return this.system.capabilities || {};
  }

  /**
   * 获取飞船船员
   */
  get crew() {
    return this.system.crew || [];
  }

  /**
   * 获取飞船载货能力
   */
  get cargoCapacity() {
    return this.system.cargo?.capacity || 0;
  }
}
