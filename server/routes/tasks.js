import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { project, status, skills } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by project
    if (project) {
      query.project = project;
    }
    
    // Filter by status
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      query.status = { $in: statusArray };
    }
    
    // Filter by skills
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query.skills = { $in: skillsArray };
    }
    
    const tasks = await Task.find(query)
      .populate('project', 'title deadline status')
      .populate('claimedBy', 'name avatar')
      .sort({ deadline: 1 });
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'title deadline status createdBy')
      .populate('claimedBy', 'name avatar');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    
    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a task
// @access  Private (NGO only)
router.post('/', protect, authorize('ngo'), async (req, res) => {
  try {
    const { project, title, description, skills, deadline } = req.body;
    
    // Check if project exists and belongs to user
    const projectObj = await Project.findById(project);
    
    if (!projectObj) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    // Check if user is the project owner
    if (projectObj.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add tasks to this project',
      });
    }
    
    // Create task
    const task = await Task.create({
      project,
      title,
      description,
      skills,
      deadline,
    });
    
    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private (NGO owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, skills, deadline, status, feedback } = req.body;
    
    // Find task
    let task = await Task.findById(req.params.id)
      .populate('project', 'createdBy');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    
    // Check authorization based on task status and user role
    if (req.user.role === 'ngo') {
      // For NGOs, check if they are the project owner
      if (task.project.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this task',
        });
      }
      
      // Update task
      task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, skills, deadline, status, feedback },
        { new: true, runValidators: true }
      );
    } else if (req.user.role === 'volunteer') {
      // For volunteers, they can only claim open tasks or submit work for claimed tasks
      if (status === 'claimed' && task.status === 'open') {
        // Volunteer claiming a task
        task = await Task.findByIdAndUpdate(
          req.params.id,
          { status: 'claimed', claimedBy: req.user._id },
          { new: true, runValidators: true }
        );
      } else if (status === 'submitted' && task.status === 'claimed' && task.claimedBy.toString() === req.user._id.toString()) {
        // Volunteer submitting work
        const { submissionLink } = req.body;
        if (!submissionLink) {
          return res.status(400).json({
            success: false,
            message: 'Submission link is required',
          });
        }
        
        task = await Task.findByIdAndUpdate(
          req.params.id,
          { status: 'submitted', submissionLink },
          { new: true, runValidators: true }
        );
      } else {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to perform this action',
        });
      }
    }
    
    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (NGO owner only)
router.delete('/:id', protect, authorize('ngo'), async (req, res) => {
  try {
    // Find task
    const task = await Task.findById(req.params.id)
      .populate('project', 'createdBy');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    
    // Check if user is the project owner
    if (task.project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }
    
    // Delete task
    await task.deleteOne();
    
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