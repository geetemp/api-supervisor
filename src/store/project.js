export default {
  /*获取项目列表
  */
  getList: () => {
    return [
      {
        name: "即派",
        identity: "gp",
        proxy: { target: "http://www.geetemp.com", status: 1 } //0 关闭，1打开
      },
      {
        name: "科锐官网",
        identity: "career",
        proxy: { target: "http://www.careerintlinc.com", status: 1 }
      }
    ];
  }
};
