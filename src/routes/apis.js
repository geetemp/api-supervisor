import express from "express";
import apiStore from "../store/api";
import apiStatusStore from "../store/apiStatus";
import apiStackStore from "../store/apiStack";
import { transferTemplate } from "../utils";
var router = express.Router();

/* GET apis list */
router.get("/", function(req, res, next) {
  const { workProject, url, method } = req.query;
  res.json(transferTemplate(apiStore.getList(workProject, url, method)));
});

/* GET apis status list */
router.get("/status", function(req, res, next) {
  const { workProject, url, method } = req.query;
  const api = apiStore.getOne(workProject, url, method);
  if (api) {
    res.json(
      transferTemplate(
        apiStatusStore.getListByApiId(api.id).map(item => item.status)
      )
    );
  } else {
    res.json(transferTemplate([]));
  }
});

/* GET apis stack list */
router.get("/stack", function(req, res, next) {
  const { workProject, url, method, code } = req.query;
  const api = apiStore.getOne(workProject, url, method);
  if (api) {
    const apiStatus = apiStatusStore.getOneByApiStatus(api.id, parseInt(code));
    res.json(
      transferTemplate(
        apiStatus
          ? apiStackStore
              .getStackByApiStatusId(apiStatus.id)
              .map(item => item.id)
              .reverse()
          : []
      )
    );
  } else {
    res.json(transferTemplate([]));
  }
});

/* GET apis head stack info */
router.get("/stack/head", function(req, res, next) {
  const { workProject, url, method, code, desc } = req.query;
  const api = apiStore.getOne(workProject, url, method);
  if (api) {
    const apiStatus = apiStatusStore.getOneByApiStatus(api.id, parseInt(code));
    if (desc) {
      res.json(
        transferTemplate(
          apiStatus ? apiStackStore.getStackById(apiStatus.head) : {}
        )
      );
    } else {
      res.json(transferTemplate(apiStatus ? apiStatus.head : ""));
    }
  } else {
    res.json(transferTemplate(desc ? {} : ""));
  }
});

/* GET apis stable stack info */
router.get("/stack/stable", function(req, res, next) {
  const { workProject, url, method, code, desc } = req.query;
  const api = apiStore.getOne(workProject, url, method);
  if (api) {
    const apiStatus = apiStatusStore.getOneByApiStatus(api.id, parseInt(code));
    if (desc) {
      res.json(
        transferTemplate(
          apiStatus ? apiStackStore.getStackById(apiStatus.stable) : {}
        )
      );
    } else {
      res.json(transferTemplate(apiStatus ? apiStatus.stable : ""));
    }
  } else {
    res.json(transferTemplate(desc ? {} : ""));
  }
});

/* GET apis stack info */
router.get("/stack/:hash", function(req, res, next) {
  const { hash } = req.params;
  res.json(transferTemplate(apiStackStore.getStackById(hash)));
});

router.get("/stack/diff", function(req, res, next) {
  const { newHash, oldHash } = req.query;
});

export default router;
