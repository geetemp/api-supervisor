import express from "express";
import projectStore from "../store/project";
var router = express.Router();

/* GET project info */
router.get("/", function(req, res) {
  const params = req.query;
  if (params.identity) {
    res.json(projectStore.getOneByIdentity(params.identity));
    return;
  }
  res.json(projectStore.getList());
});

export default router;
