import express from "express";
import projectStore from "../store/project";
import { transferTemplate } from "../utils";
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
// router.POST("/", function(req, res) {
//   const params = req.query;
//   const { name, identity, target } = params;
//   res.json(
//     transferTemplate(
//       projectStore.addOne({
//         name,
//         identity,
//         proxy: {
//           target,
//           status: 1
//         }
//       })
//     )
//   );
// });

export default router;
