import express from "express";
import apiStore from "../store/api";
import apiStatusStore from "../store/apiStatus";
import apiStackStore from "../store/apiStack";
import { transferTemplate } from "../utils";
const router = express.Router();
const jsondiffpatch = require("jsondiffpatch");
const { wrap: async } = require("co");

/* GET apis list */
router.get(
  "/",
  async(function*(req, res, next) {
    const { workProject, url, method } = req.query;
    res.json(
      transferTemplate(yield apiStore.getList(workProject, url, method))
    );
  })
);

/* GET apis status list */
router.get(
  "/status",
  async(function*(req, res, next) {
    const { workProject, url, method } = req.query;
    const api = yield apiStore.getOne(workProject, url, method);
    if (api) {
      res.json(
        transferTemplate(
          yield apiStatusStore.getListByApiId(api.id).map(item => item.status)
        )
      );
    } else {
      res.json(transferTemplate([]));
    }
  })
);

/* GET apis stack list */
router.get(
  "/stack",
  async(function*(req, res, next) {
    const { workProject, url, method, code } = req.query;
    const api = yield apiStore.getOne(workProject, url, method);
    if (api) {
      const apiStatus = yield apiStatusStore.getOneByApiStatus(
        api.id,
        parseInt(code)
      );
      res.json(
        transferTemplate(
          apiStatus
            ? yield apiStackStore
                .getStackByApiStatusId(apiStatus.id)
                .map(item => item.id)
                .reverse()
            : []
        )
      );
    } else {
      res.json(transferTemplate([]));
    }
  })
);

/* GET apis head stack info */
router.get(
  "/stack/head",
  async(function*(req, res, next) {
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
        apiStatus = yield apiStatusStore.getOneByApiStatus(api.id, numberCode);
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
  })
);

/* GET apis stable stack info */
router.get(
  "/stack/stable",
  async(function*(req, res, next) {
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
        apiStatus = yield apiStatusStore.getOneByApiStatus(api.id, numberCode);
      }
      if (desc) {
        res.json(
          transferTemplate(
            apiStatus ? yield apiStackStore.getStackById(apiStatus.stable) : {}
          )
        );
      } else {
        res.json(transferTemplate(apiStatus ? apiStatus.stable : ""));
      }
    } else {
      res.json(transferTemplate(desc ? {} : ""));
    }
  })
);

/* GET diff between the two apis stack */
router.get(
  "/stack/diff",
  async(function*(req, res, next) {
    const { newHash, oldHash } = req.query;
    const newApiStack = yield apiStackStore.getStackById(newHash).result;
    const oldApiStack = yield apiStackStore.getStackById(oldHash).result;
    const delta = jsondiffpatch.diff(newApiStack, oldApiStack);
    res.send(delta);
  })
);

/* GET apis stack info */
router.get(
  "/stack/:hash",
  async(function*(req, res, next) {
    const { hash } = req.params;
    res.json(transferTemplate(yield apiStackStore.getStackById(hash)));
  })
);

export default router;
