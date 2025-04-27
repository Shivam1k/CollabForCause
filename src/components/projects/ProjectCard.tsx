import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Briefcase } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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

  const daysRemaining = getDaysRemaining(project.deadline);

  return (
    <div className="card card-hover h-full flex flex-col">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-100">
            <Briefcase size={48} className="text-primary-500" />
          </div>
        )}
        <div className="absolute top-0 right-0 m-2">
          <span className={`badge ${
            project.status === 'active' ? 'bg-success-50 text-success-700' :
            project.status === 'completed' ? 'bg-gray-100 text-gray-700' :
            'bg-warning-50 text-warning-700'
          } capitalize`}>
            {project.status}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">{project.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge-primary">
              {skill}
            </span>
          ))}
          {project.skills.length > 3 && (
            <span className="badge bg-gray-100 text-gray-700">
              +{project.skills.length - 3} more
            </span>
          )}
        </div>
        
        <div className="mt-auto space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formatDeadline(project.deadline)}</span>
            </div>
            <div className={`text-sm font-medium ${
              daysRemaining <= 7 ? 'text-error-600' :
              daysRemaining <= 14 ? 'text-warning-600' :
              'text-gray-600'
            }`}>
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Due today'}
            </div>
          </div>
          
          <Link
            to={`/projects/${project._id}`}
            className="btn-primary w-full text-center mt-4"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;