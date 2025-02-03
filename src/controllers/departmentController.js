const departmentService = require("../services/departmentService");

class DepartmentController {
  async createDepartment(req, res) {
    try {
      // Only CEO and Admin can create departments
      if (!["CEO", "Admin", "Member"].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to create departments",
        });
      }

      const department = await departmentService.createDepartment(req.body);
      res.status(201).json({
        success: true,
        data: department,
      });
    } catch (error) {
      if (error.message.includes("already exists")) {
        return res.status(409).json({
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

  async getAllDepartments(req, res) {
    try {
      const departments = await departmentService.getAllDepartments();
      res.status(200).json({
        success: true,
        data: departments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getDepartmentById(req, res) {
    try {
      const department = await departmentService.getDepartmentById(
        req.params.id
      );
      res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      if (error.message === "Department not found") {
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

  async updateDepartment(req, res) {
    try {
      // Only CEO and Admin can update departments
      if (!["CEO", "Admin"].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: "Not authorized to update departments",
        });
      }

      const department = await departmentService.updateDepartment(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      if (error.message === "Department not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("already exists")) {
        return res.status(409).json({
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

  async deleteDepartment(req, res) {
    try {
      // Only CEO can delete departments
      if (req.user.role !== "CEO") {
        return res.status(403).json({
          success: false,
          error: "Only CEO can delete departments",
        });
      }

      await departmentService.deleteDepartment(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message === "Department not found") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }
      if (error.message.includes("existing teams")) {
        return res.status(400).json({
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

module.exports = new DepartmentController();
