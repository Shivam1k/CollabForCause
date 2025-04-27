import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { Task, Project } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Tag, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

// Mock data for development - would be replaced with API calls
const mockTask: Task = {
  _id: '123',
  project: {
    _id: '1',
    title: 'Website Redesign for Wildlife Conservation',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
  } as Project,
  title: 'Create responsive homepage design',
  description: 'Design a responsive homepage that showcases our wildlife conservation efforts. The design should be modern, visually appealing, and optimized for all devices. Use our brand colors and follow the style guide provided.',
  skills: ['UI/UX Design', 'HTML', 'CSS', 'Responsive Design'],
  deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'open',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const TaskDetailPage: React.FC = () => {
  const { projectId, taskId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // In a real app, this would fetch task data from the API
  useEffect(() => {
    // Simulating API call with mock data
    const fetchTask = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/tasks/${taskId}`);
        // const data = response.data.data;
        
        // Using mock data for now
        setTimeout(() => {
          setTask(mockTask);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load task details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Format deadline date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
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
  
  // Check if the user is the task claimer
  const isTaskClaimer = () => {
    return (
      task && 
      task.status === 'claimed' && 
      task.claimedBy && 
      typeof task.claimedBy !== 'string' &&
      task.claimedBy._id === user?._id
    );
  };
  
  // Check if the user is the project owner
  const isProjectOwner = () => {
    return (
      task && 
      typeof task.project !== 'string' && 
      task.project.createdBy && 
      typeof task.project.createdBy !== 'string' &&
      task.project.createdBy._id === user?._id
    );
  };
  
  // Handle claiming a task
  const handleClaimTask = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/projects/${projectId}/tasks/${taskId}` } });
      return;
    }
    
    if (user?.role !== 'volunteer') {
      setError('Only volunteers can claim tasks.');
      return;
    }
    
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/tasks/${taskId}`, { status: 'claimed' });
      
      // For demo, just update the UI
      setTask(prev => prev ? { ...prev, status: 'claimed', claimedBy: user } : null);
    } catch (err) {
      setError('Failed to claim task. Please try again.');
    }
  };
  
  // Handle submitting work
  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submissionLink) {
      setError('Please provide a submission link.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // await axios.post('/api/contributions', { 
      //   task: taskId,
      //   submissionLink,
      // });
      
      // For demo, just update the UI
      setTask(prev => prev ? { 
        ...prev, 
        status: 'submitted',
        submissionLink,
      } : null);
      
      setShowSubmitForm(false);
    } catch (err) {
      setError('Failed to submit work. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle approving/rejecting work
  const handleReviewSubmission = async (status: 'approved' | 'rejected') => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/contributions/${contributionId}`, { 
      //   status,
      //   feedback,
      // });
      
      // For demo, just update the UI
      setTask(prev => {
        if (!prev) return null;
        
        return { 
          ...prev, 
          status: status === 'approved' ? 'completed' : 'claimed',
          feedback,
        };
      });
    } catch (err) {
      setError(`Failed to ${status} submission. Please try again.`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-error-50 text-error-700 p-4 rounded-md flex items-start mt-4">
            <AlertCircle size={24} className="mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
          <div className="mt-6">
            <Link 
              to={`/projects/${projectId}`}
              className="btn-outline inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Project
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!task) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been removed.</p>
            <Link 
              to={`/projects/${projectId}`}
              className="btn-primary inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Project
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link 
            to={`/projects/${projectId}`}
            className="text-gray-600 hover:text-primary-600 inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Project
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-6 mb-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 mr-4">{task.title}</h1>
                <span className={`badge capitalize ${
                  task.status === 'open' ? 'bg-success-50 text-success-700' :
                  task.status === 'claimed' ? 'bg-primary-50 text-primary-700' :
                  task.status === 'submitted' ? 'bg-warning-50 text-warning-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6">{task.description}</p>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <h3 className="text-sm font-semibold text-gray-700 mr-2">Required Skills:</h3>
                  {task.skills.map((skill, index) => (
                    <span key={index} className="badge-primary">{skill}</span>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Task Deadline:</h3>
                  <div className="flex items-center">
                    <Calendar size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{formatDate(task.deadline)}</span>
                    <span className={`ml-4 text-sm font-medium ${
                      getDaysRemaining(task.deadline) <= 3 ? 'text-error-600' :
                      getDaysRemaining(task.deadline) <= 7 ? 'text-warning-600' :
                      'text-gray-600'
                    }`}>
                      ({getDaysRemaining(task.deadline)} days remaining)
                    </span>
                  </div>
                </div>
                
                {task.submissionLink && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Submission:</h3>
                    <a 
                      href={task.submissionLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      View Submission <ExternalLink size={16} className="ml-1" />
                    </a>
                  </div>
                )}
                
                {task.feedback && (
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Feedback:</h3>
                    <p className="text-gray-700">{task.feedback}</p>
                  </div>
                )}
              </div>
            </div>
            
            {task.status === 'submitted' && isProjectOwner() && (
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Review Submission</h2>
                <div className="mb-4">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback (optional)
                  </label>
                  <textarea
                    id="feedback"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="input"
                    placeholder="Provide feedback on the submission..."
                  ></textarea>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReviewSubmission('approved')}
                    className="btn-primary"
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Approve Submission
                  </button>
                  <button
                    onClick={() => handleReviewSubmission('rejected')}
                    className="btn-outline"
                  >
                    Reject & Request Changes
                  </button>
                </div>
              </div>
            )}
            
            {isTaskClaimer() && task.status === 'claimed' && (
              <div className="card p-6 mb-6">
                {showSubmitForm ? (
                  <form onSubmit={handleSubmitWork}>
                    <h2 className="text-xl font-semibold mb-4">Submit Your Work</h2>
                    <div className="mb-4">
                      <label htmlFor="submissionLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Submission Link*
                      </label>
                      <input
                        type="url"
                        id="submissionLink"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        className="input"
                        placeholder="https://example.com/my-work"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Link to your work (GitHub, Google Drive, Dropbox, etc.)
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary"
                      >
                        {submitting ? 'Submitting...' : 'Submit Work'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSubmitForm(false)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Ready to Submit Your Work?</h2>
                    <p className="text-gray-600 mb-4">
                      Once you've completed the task, submit your work for review by the project owner.
                    </p>
                    <button
                      onClick={() => setShowSubmitForm(true)}
                      className="btn-primary"
                    >
                      Submit Your Work
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Project Info Card */}
            <div className="card p-5 mb-6">
              <h3 className="text-lg font-semibold mb-2">Project Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500 block">Project:</span>
                  <Link 
                    to={`/projects/${projectId}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {typeof task.project === 'string' ? 'View Project' : task.project.title}
                  </Link>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Project Deadline:</span>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-500 mr-1" />
                    {typeof task.project === 'string' 
                      ? 'Loading...' 
                      : formatDate(task.project.deadline)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Project Status:</span>
                  <span className={`badge capitalize ${
                    typeof task.project === 'string' ? 'bg-gray-100 text-gray-700' :
                    task.project.status === 'active' ? 'bg-success-50 text-success-700' :
                    task.project.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                    'bg-warning-50 text-warning-700'
                  }`}>
                    {typeof task.project === 'string' ? 'Loading...' : task.project.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Card */}
            <div className="card p-5 mb-6">
              <h3 className="text-lg font-semibold mb-4">Task Actions</h3>
              
              {task.status === 'open' && user?.role === 'volunteer' && (
                <button
                  onClick={handleClaimTask}
                  className="btn-primary w-full mb-3"
                >
                  Claim This Task
                </button>
              )}
              
              {task.status === 'claimed' && isTaskClaimer() && !showSubmitForm && (
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="btn-primary w-full mb-3"
                >
                  Submit Work
                </button>
              )}
              
              <Link
                to={`/projects/${projectId}/chat`}
                className="btn-outline w-full flex items-center justify-center mb-3"
              >
                <MessageSquare size={18} className="mr-2" />
                Project Chat
              </Link>
              
              <Link
                to={`/projects/${projectId}`}
                className="btn-outline w-full"
              >
                View All Tasks
              </Link>
            </div>
            
            {/* Task Info Card */}
            {task.claimedBy && (
              <div className="card p-5">
                <h3 className="text-lg font-semibold mb-2">Task Assignment</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 block">Claimed By:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                        {typeof task.claimedBy === 'string' ? (
                          <span className="text-gray-500">?</span>
                        ) : (
                          task.claimedBy.avatar ? (
                            <img 
                              src={task.claimedBy.avatar} 
                              alt={task.claimedBy.name} 
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-500">
                              {task.claimedBy.name.charAt(0)}
                            </span>
                          )
                        )}
                      </div>
                      <span className="font-medium">
                        {typeof task.claimedBy === 'string' 
                          ? 'Loading...' 
                          : task.claimedBy.name}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Claimed On:</span>
                    <span className="text-gray-700">
                      {formatDate(task.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetailPage;