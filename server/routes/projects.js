import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, skills, status } = req.query;
    
    // Build query
    const query = {};
    
    // Search by title, description, or category
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Filter by skills
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }
    
    // Filter by status
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      query.status = { $in: statusArray };
    }
    
    const projects = await Project.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate({
        path: 'tasks',
        options: { sort: { deadline: 1 } },
      });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   POST /api/projects
// @desc    Create a project
// @access  Private (NGO only)
router.post('/', protect, authorize('ngo'), async (req, res) => {
  try {
    const { title, description, category, skills, deadline, image } = req.body;
    
    // Create project
    const project = await Project.create({
      title,
      description,
      category,
      skills,
      deadline,
      image,
      createdBy: req.user._id,
    });
    
    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (NGO owner only)
router.put('/:id', protect, authorize('ngo'), async (req, res) => {
  try {
    const { title, description, category, skills, deadline, status, image } = req.body;
    
    // Find project
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    // Check if user is the project owner
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }
    
    // Update project
    project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, category, skills, deadline, status, image },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (NGO owner only)
router.delete('/:id', protect, authorize('ngo'), async (req, res) => {
  try {
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    // Check if user is the project owner
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }
    
    // Delete associated tasks
    await Task.deleteMany({ project: req.params.id });
    
    // Delete project
    await project.remove();
    
    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;