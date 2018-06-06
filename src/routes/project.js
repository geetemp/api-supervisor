import express from "express";
var router = express.Router();

/* GET project info */
router.get("/project", function(req, res, next) {
  res.end("project");
});

export default router;
