import express from "express";
import projectStore from "../store/project";
import { transferTemplate } from "../../lib/utils";
import cache from "../../lib/cache";
const router = express.Router();
const { wrap: async } = require("co");

/* GET project info */
router.get(
  "/",
  async(function*(req, res) {
    try {
      const params = req.query;
      if (params.identity) {
        res.json(
          transferTemplate(yield projectStore.getOneByIdentity(params.identity))
        );
        return;
      }
      res.json(transferTemplate(yield projectStore.getList()));
    } catch (err) {
      next(err);
    }
  })
);

/* add A project info */
router.post(
  "/",
  async(function*(req, res) {
    try {
      const { name, identity, target, regex, regexlocation } = req.body;
      const alreadyHas = yield projectStore.getOneByIdentity(identity);
      //already has
      if (alreadyHas) {
        return res.json(transferTemplate("added project already exists.", 1));
      }
      const newProject = yield projectStore.addOne({
        name: name || "",
        regexlocation: regexlocation || 1,
        regex: regex || "v[0-9]_[0-9]",
        identity,
        proxy: {
          target,
          status: 1
        }
      });
      cache.dispatch({ type: "add", payload: newProject.toObject() });
      res.json(transferTemplate(newProject));
    } catch (err) {
      next(err);
    }
  })
);

/* update project info  */
router.put(
  "/",
  async(function*(req, res) {
    try {
      const { identity, name, host, status, location, regex } = req.body;
      const updatedProject = yield projectStore.update({
        identity,
        name,
        target: host,
        status,
        regexlocation: location,
        regex
      });
      cache.dispatch({ type: "update", payload: updatedProject });
      res.json(transferTemplate(updatedProject));
    } catch (err) {
      next(err);
    }
  })
);

export default router;
