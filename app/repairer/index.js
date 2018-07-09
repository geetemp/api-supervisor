/**
 * 请求结果修补器
 */
export class RepairItem {
  leftCompare = () => {};
  rightCompare = () => {};
  callback = () => {};

  constructor(leftCompare, rightCompare, callback) {
    if (typeof callback !== "function")
      throw new Error("callback parmater must be a function");
    if (leftCompare && typeof leftCompare !== "function")
      throw new Error("leftCompare parmater must be a function");
    if (rightCompare && typeof leftCompare !== "function") {
      throw new Error("rightCompare parmater must be a function");
    }
    this.leftCompare = leftCompare;
    this.rightCompare = rightCompare;
    this.callback = callback;
  }
}

export default class Repairer {
  toRepairList = [];
  /**
   * 注册一个修复单元
   * @param {*} repairItem
   */
  regist(repairItem) {
    this.toRepairList.push(repairItem);
  }

  /**
   * 执行修复
   * @param {*} delta
   * @param {*} deltaKey
   */
  execute(delta, deltaKey) {
    function repair(deLeft, deRight) {
      for (const repairItem of this.toRepairList) {
        const { leftCompare, rightCompare } = repairItem;
        if (
          (!leftCompare || leftCompare(deLeft)) &&
          (!rightCompare || rightCompare(deRight))
        ) {
          repairItem.callback(delta, getKeyArray(deltaKey));
        }
      }
    }

    function getKeyArray(deltaKey) {
      if (!getKeyArray.keyArray) getKeyArray.keyArray = [];
      getKeyArray.keyArray.push(deltaKey.key);
      if (deltaKey.parentKey) {
        return getKeyArray(deltaKey.parentKey);
      } else {
        return getKeyArray.keyArray.reverse();
      }
    }

    if (Array.isArray(delta)) {
      const [deLeft, deRight] = delta;
      repair.call(this, deLeft, deRight);
    } else if (typeof delta === "object") {
      Object.keys(delta).forEach(key => {
        const keyObject = { key, parentKey: deltaKey };
        this.execute(delta[key], keyObject);
      });
    }
    return this;
  }

  after(callback) {
    callback && typeof callback === "function" && callback();
  }
}
