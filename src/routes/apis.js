import express from "express";
var router = express.Router();

/* GET apis info */
router.get("/", function(req, res, next) {
  const { url, method } = req.query;

  res.json();
});

export default router;
