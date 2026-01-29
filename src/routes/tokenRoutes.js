const express = require("express");
const router = express.Router();
const controller = require("../controllers/tokenController");

router.post("/book", controller.book);
router.post("/cancel", controller.cancel);
router.post("/delay", controller.delay);
router.get("/schedule/:doctorId", controller.schedule);

module.exports = router;
