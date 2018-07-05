import express from "express";
import apiStore from "../store/api";
import apiStatusStore from "../store/apiStatus";
import apiStackStore from "../store/apiStack";
import { transferTemplate } from "../utils";
import { toJSONSchema } from "../utils";
const router = express.Router();
const jsondiffpatch = require("jsondiffpatch");
const { wrap: async } = require("co");

/* GET apis list */
router.get(
  "/",
  async(function*(req, res, next) {
    try {
      const { workProject, url, method } = req.query;
      res.json(
        transferTemplate(yield apiStore.getList(workProject, url, method))
      );
    } catch (err) {
      next(err);
    }
  })
);

/* GET apis status list */
router.get(
  "/status",
  async(function*(req, res, next) {
    try {
      const { workProject, url, method } = req.query;
      const api = yield apiStore.getOne(workProject, url, method);
      if (api) {
        const apiStatuses = yield apiStatusStore.getListByApiId(api.id);
        res.json(transferTemplate(apiStatuses.map(item => item.status)));
      } else {
        res.json(transferTemplate([]));
      }
    } catch (err) {
      next(err);
    }
  })
);

/* GET apis stack list */
router.get(
  "/stack",
  async(function*(req, res, next) {
    try {
      const { workProject, url, method, code, desc } = req.query;
      const api = yield apiStore.getOne(workProject, url, method);
      if (api) {
        const apiStatus = yield apiStatusStore.getOneByApiStatus(
          api.id,
          parseInt(code)
        );
        let apiStacks = yield apiStackStore.getStackByApiStatusId(apiStatus.id);
        apiStacks = apiStacks || [];
        res.json(
          transferTemplate(!desc ? apiStacks.map(item => item.id) : apiStacks)
        );
      } else {
        res.json(transferTemplate([]));
      }
    } catch (err) {
      next(err);
    }
  })
);

/* GET apis head stack info */
router.get(
  "/stack/head",
  async(function*(req, res, next) {
    try {
      const { workProject, url, method, code, desc, set } = req.query;
      const api = yield apiStore.getOne(workProject, url, method);
      const numberCode = parseInt(code);
      if (api) {
        let apiStatus = yield apiStatusStore.getOneByApiStatus(
          api.id,
          numberCode
        );
        if (set) {
          yield apiStatusStore.updateHead(apiStatus.id, numberCode, set);
          apiStatus = yield apiStatusStore.getOneByApiStatus(
            api.id,
            numberCode
          );
        }
        if (desc) {
          res.json(
            transferTemplate(
              apiStatus ? yield apiStackStore.getStackById(apiStatus.head) : {}
            )
          );
        } else {
          res.json(transferTemplate(apiStatus ? apiStatus.head : ""));
        }
      } else {
        res.json(transferTemplate(desc ? {} : ""));
      }
    } catch (err) {
      next(err);
    }
  })
);

/* GET apis stable stack info */
router.get(
  "/stack/stable",
  async(function*(req, res, next) {
    try {
      const { workProject, url, method, code, desc, set } = req.query;
      const api = yield apiStore.getOne(workProject, url, method);
      const numberCode = parseInt(code);
      if (api) {
        let apiStatus = yield apiStatusStore.getOneByApiStatus(
          api.id,
          numberCode
        );
        if (set) {
          yield apiStatusStore.updateStable(apiStatus.id, numberCode, set);
          apiStatus = yield apiStatusStore.getOneByApiStatus(
            api.id,
            numberCode
          );
        }
        if (desc) {
          res.json(
            transferTemplate(
              apiStatus
                ? yield apiStackStore.getStackById(apiStatus.stable)
                : {}
            )
          );
        } else {
          res.json(transferTemplate(apiStatus ? apiStatus.stable : ""));
        }
      } else {
        res.json(transferTemplate(desc ? {} : ""));
      }
    } catch (err) {
      next(err);
    }
  })
);

/* GET diff between the two apis stack */
router.get(
  "/stack/diff",
  async(function*(req, res, next) {
    try {
      const { one, two, workProject, code } = req.query;
      //如果one不是一个url
      if (one.indexOf("/") === -1) {
        const newHash = one,
          oldHash = two;
        const newApiStack = yield apiStackStore.getStackById(newHash);
        const oldApiStack = yield apiStackStore.getStackById(oldHash);
        const delta = jsondiffpatch.diff(
          toJSONSchema(JSON.stringify(oldApiStack.result)),
          toJSONSchema(JSON.stringify(newApiStack.result))
        );
        res.json(transferTemplate(delta));
      } else {
        //如果是url
        const url = one,
          method = two;
        const api = yield apiStore.getOne(workProject, url, method);
        if (api) {
          const apiStatus = yield apiStatusStore.getOneByApiStatus(
            api.id,
            code
          );
          const headApiStack = yield apiStackStore.getStackById(apiStatus.head);
          const stableApiStack = yield apiStackStore.getStackById(
            apiStatus.stable
          );
          const delta = jsondiffpatch.diff(
            toJSONSchema(JSON.stringify(stableApiStack.result)),
            toJSONSchema(JSON.stringify(headApiStack.result))
          );
          res.json(transferTemplate(delta));
        } else {
          res.status("404").send("Don't find the api!");
        }
      }
    } catch (err) {
      next(err);
    }
  })
);

router.put(
  "/stack/merge",
  async(function*(req, res, next) {
    try {
      const { workProject, url, method, code } = req.body;
      const api = yield apiStore.getOne(workProject, url, method);
      if (api) {
        const apiStatus = yield apiStatusStore.getOneByApiStatus(api.id, code);
        res.json(
          transferTemplate(
            yield apiStatusStore.updateStable(
              apiStatus.id,
              code,
              apiStatus.head
            )
          )
        );
      } else {
        res.status("404").send("Don't find the api!");
      }
    } catch (err) {
      next(err);
    }
  })
);

/* GET apis stack info */
router.get(
  "/stack/:hash",
  async(function*(req, res, next) {
    try {
      const { hash } = req.params;
      res.json(transferTemplate(yield apiStackStore.getStackById(hash)));
    } catch (err) {
      next(err);
    }
  })
);

export default router;
