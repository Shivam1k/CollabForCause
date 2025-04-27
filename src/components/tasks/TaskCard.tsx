import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, User } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  projectId: string;
  onClaim?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, projectId, onClaim }) => {
  // Format the deadline date
  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Calculate days remaining
  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(task.deadline);

  // Status badge color
  const getStatusBadgeClass = () => {
    switch (task.status) {
      case 'open':
        return 'bg-success-50 text-success-700';
      case 'claimed':
        return 'bg-primary-50 text-primary-700';
      case 'submitted':
        return 'bg-warning-50 text-warning-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex justify-between mb-3">
        <span className={`badge ${getStatusBadgeClass()} capitalize`}>
          {task.status}
        </span>
        
        <div className={`text-sm font-medium ${
          daysRemaining <= 3 ? 'text-error-600' :
          daysRemaining <= 7 ? 'text-warning-600' :
          'text-gray-600'
        }`}>
          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Due today'}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{task.title}</h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {task.skills.slice(0, 3).map((skill, index) => (
          <span key={index} className="badge-primary">
            {skill}
          </span>
        ))}
        {task.skills.length > 3 && (
          <span className="badge bg-gray-100 text-gray-700">
            +{task.skills.length - 3} more
          </span>
        )}
      </div>
      
      <div className="mt-auto pt-4 space-y-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>Deadline: {formatDeadline(task.deadline)}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/projects/${projectId}/tasks/${task._id}`}
            className="btn-outline flex-1 text-center"
          >
            View Details
          </Link>
          
          {task.status === 'open' && onClaim && (
            <button
              onClick={onClaim}
              className="btn-primary flex-1"
            >
              Claim Task
            </button>
          )}
          
          {task.status === 'claimed' && (
            <Link
              to={`/projects/${projectId}/tasks/${task._id}/submit`}
              className="btn-accent flex-1 text-center"
            >
              Submit Work
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;