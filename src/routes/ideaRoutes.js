const express = require("express");
const router = express.Router();
const ideaController = require("../controllers/ideaController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all routes
router.use(authMiddleware);

router.post("/", ideaController.createIdea);
router.get("/", ideaController.getAllIdeas);
router.get("/:id", ideaController.getIdeaById);
router.put("/:id", ideaController.updateIdea);
router.delete("/:id", ideaController.deleteIdea);

module.exports = router;
