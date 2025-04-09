const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");

router.get("/getStat", statController.getStatsByMonth);
router.get("/updateStat", statController.forceUpdateStat); 

module.exports = router;
