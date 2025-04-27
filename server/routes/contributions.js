import express from 'express';
import Contribution from '../models/Contribution.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/contributions
// @desc    Get all contributions (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { project, volunteer, status } = req.query;
    
    // Build query
    const query = {};
    
    // For NGOs, only show contributions to their projects
    if (req.user.role === 'ngo') {
      // First get all projects created by this NGO
      const ngoProjects = await Project.find({ createdBy: req.user._id }).select('_id');
      const projectIds = ngoProjects.map(project => project._id);
      
      query.project = { $in: projectIds };
    }
    
    // For volunteers, only show their own contributions
    if (req.user.role === 'volunteer') {
      query.volunteer = req.user._id;
    }
    
    // Additional filters
    if (project) {
      query.project = project;
    }
    
    if (volunteer && req.user.role === 'ngo') {
      query.volunteer = volunteer;
    }
    
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      query.status = { $in: statusArray };
    }
    
    const contributions = await Contribution.find(query)
      .populate('project', 'title status')
      .populate('task', 'title status')
      .populate('volunteer', 'name avatar')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contributions.length,
      data: contributions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   GET /api/contributions/:id
// @desc    Get single contribution
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('project', 'title status createdBy')
      .populate('task', 'title status')
      .populate('volunteer', 'name avatar');
    
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }
    
    // Check if user is authorized to view this contribution
    if (
      req.user.role === 'volunteer' && 
      contribution.volunteer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contribution',
      });
    }
    
    if (
      req.user.role === 'ngo' && 
      contribution.project.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contribution',
      });
    }
    
    res.json({
      success: true,
      data: contribution,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   POST /api/contributions
// @desc    Create a contribution (submit work)
// @access  Private (Volunteer only)
router.post('/', protect, authorize('volunteer'), async (req, res) => {
  try {
    const { task, submissionLink } = req.body;
    
    // Check if task exists
    const taskObj = await Task.findById(task).populate('project');
    
    if (!taskObj) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }
    
    // Check if task is claimed by this volunteer
    if (
      taskObj.status !== 'claimed' || 
      taskObj.claimedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You must claim this task before submitting work',
      });
    }
    
    // Create contribution
    const contribution = await Contribution.create({
      task,
      project: taskObj.project._id,
      volunteer: req.user._id,
      submissionLink,
    });
    
    // Update task status to submitted
    await Task.findByIdAndUpdate(
      task,
      { status: 'submitted', submissionLink },
      { new: true }
    );
    
    res.status(201).json({
      success: true,
      data: contribution,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// @route   PUT /api/contributions/:id
// @desc    Update contribution status (approve/reject)
// @access  Private (NGO only)
router.put('/:id', protect, authorize('ngo'), async (req, res) => {
  try {
    const { status, feedback } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be approved or rejected',
      });
    }
    
    // Find contribution
    let contribution = await Contribution.findById(req.params.id)
      .populate({
        path: 'project',
        select: 'createdBy',
      });
    
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found',
      });
    }
    
    // Check if user is the project owner
    if (contribution.project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this contribution',
      });
    }
    
    // Update contribution
    const updateData = { 
      status, 
      feedback: feedback || '',
    };
    
    // If approving, add approval date
    if (status === 'approved') {
      updateData.approvedAt = Date.now();
      
      // Also update the task to completed
      await Task.findByIdAndUpdate(
        contribution.task,
        { status: 'completed', feedback: feedback || '' },
        { new: true }
      );
    } else if (status === 'rejected') {
      // Update task back to claimed
      await Task.findByIdAndUpdate(
        contribution.task,
        { status: 'claimed', feedback: feedback || '' },
        { new: true }
      );
    }
    
    // Update contribution
    contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: contribution,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;