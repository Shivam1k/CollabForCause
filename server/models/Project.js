import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Project deadline is required'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    image: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for tasks associated with the project
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

// Virtual field for contributions associated with the project
projectSchema.virtual('contributions', {
  ref: 'Contribution',
  localField: '_id',
  foreignField: 'project',
});

// Virtual field for messages associated with the project
projectSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'project',
});

const Project = mongoose.model('Project', projectSchema);

export default Project;