import express from "express";
var router = express.Router();

/* GET project info */
router.get("/api", function(req, res, next) {
  res.end("api");
});

export default router;
