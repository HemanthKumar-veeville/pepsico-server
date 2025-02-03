const ideaService = require("../services/ideaService");
const { io } = require("../app");

class IdeaController {
  async createIdea(req, res) {
    console.log({ id: req.user.id });
    try {
      const idea = await ideaService.createIdea(req.body, req.user.id);

      // Emit socket event for real-time updates
      //   io.emit("newIdea", idea);

      res.status(201).json({
        success: true,
        data: idea,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllIdeas(req, res) {
    try {
      const ideas = await ideaService.getAllIdeas(req.user.id);

      res.status(200).json({
        success: true,
        data: ideas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getIdeaById(req, res) {
    try {
      const idea = await ideaService.getIdeaById(req.params.id);
      res.status(200).json({
        success: true,
        data: idea,
      });
    } catch (error) {
      if (error.message === "Idea not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateIdea(req, res) {
    try {
      const idea = await ideaService.updateIdea(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: idea,
      });
    } catch (error) {
      if (error.message === "Idea not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteIdea(req, res) {
    try {
      await ideaService.deleteIdea(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Idea not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new IdeaController();
