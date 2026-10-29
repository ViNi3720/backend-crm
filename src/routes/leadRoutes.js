const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createLead,
  getUnclaimedLeads,
  claimLead,
  getMyLeads,
} = require("../controllers/leadController");

router.post("/", createLead);
router.get("/unclaimed", authMiddleware, getUnclaimedLeads);
router.get("/my", authMiddleware, getMyLeads);
router.patch("/:id/claim", authMiddleware, claimLead);

module.exports = router;
