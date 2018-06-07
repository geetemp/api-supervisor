import express from "express";
var router = express.Router();

/* GET project info */
router.get("/", function(req, res, next) {
  res.end("status");
});

export default router;
