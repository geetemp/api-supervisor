import db from "./dbInit";

export default {
    /**
     * 获取栈head信息
     */
    getHeadStack:(head)=>{
        return db.get('apiStack').find({id:head}).value();
    }
}