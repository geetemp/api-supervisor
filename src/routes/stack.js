import express from "express";
var router = express.Router();

/* GET project info */
router.get("/stack", function(req, res, next) {
  res.end("stack");
});

export default router;
