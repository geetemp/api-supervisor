import express from "express";
import projectStore from "../store/project";
import { transferTemplate, filterUndefined } from "../utils";
var router = express.Router();

/* GET project info */
router.get("/", function(req, res) {
  const params = req.query;
  if (params.identity) {
    res.json(transferTemplate(projectStore.getOneByIdentity(params.identity)));
    return;
  }
  res.json(transferTemplate(projectStore.getList()));
});

/* add A project info */
router.post("/", function(req, res) {
  const { name, identity, target } = req.body;
  const alreadyHas = projectStore.getOneByIdentity(identity);
  //already has
  if (alreadyHas) {
    return res.json(transferTemplate("added project already exists.", 1));
  }
  res.json(
    transferTemplate(
      projectStore.addOne({
        name: name || "",
        identity,
        proxy: {
          target,
          status: 1
        }
      })
    )
  );
});

/* update project info  */
router.put("/", function(req, res) {
  const { identity, name, host, status } = req.body;
  res.json(
    transferTemplate(
      projectStore.update({
        identity,
        name,
        target: host,
        status: parseInt(status)
      })
    )
  );
});

export default router;
