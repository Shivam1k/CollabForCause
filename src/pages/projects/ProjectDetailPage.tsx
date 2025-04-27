import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import TaskCard from '../../components/tasks/TaskCard';
import ChatBox from '../../components/chat/ChatBox';
import { Project, Task, Message } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Tag, 
  Users, 
  AlertCircle, 
  ArrowLeft, 
  Plus,
  MessageSquare
} from 'lucide-react';

// Mock data for development - would be replaced with API calls
const mockProject: Project = {
  _id: '1',
  title: 'Website Redesign for Wildlife Conservation',
  description: 'Help redesign our website to better showcase our wildlife conservation efforts and engage supporters. We need volunteers with web design, development, and content creation skills to help us create a modern, responsive website that effectively communicates our mission and programs.',
  category: 'Web Development',
  skills: ['Web Development', 'UI/UX Design', 'Content Writing', 'Responsive Design'],
  deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
  status: 'active',
  image: 'https://images.pexels.com/photos/3719037/pexels-photo-3719037.jpeg',
  createdBy: {
    _id: '101',
    name: 'Wildlife Protection Alliance',
    avatar: 'https://images.pexels.com/photos/915972/pexels-photo-915972.jpeg',
    role: 'ngo',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockTasks: Task[] = [
  {
    _id: '1001',
    project: '1',
    title: 'Create responsive homepage design',
    description: 'Design a responsive homepage that showcases our wildlife conservation efforts. The design should be modern, visually appealing, and optimized for all devices.',
    skills: ['UI/UX Design', 'HTML', 'CSS', 'Responsive Design'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '1002',
    project: '1',
    title: 'Develop donation form with Stripe integration',
    description: 'Create a secure, user-friendly donation form integrated with Stripe payment processing to allow supporters to donate easily.',
    skills: ['JavaScript', 'Payment Integration', 'Form Development'],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'claimed',
    claimedBy: {
      _id: '102',
      name: 'Jane Smith',
      avatar: '',
      role: 'volunteer',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '1003',
    project: '1',
    title: 'Write compelling content for About Us page',
    description: 'Create engaging, informative content for the About Us page that communicates our mission, history, team, and achievements.',
    skills: ['Content Writing', 'Copywriting', 'Storytelling'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'submitted',
    claimedBy: {
      _id: '103',
      name: 'David Johnson',
      avatar: '',
      role: 'volunteer',
    },
    submissionLink: 'https://docs.google.com/document/d/example',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '1004',
    project: '1',
    title: 'Create social media sharing functionality',
    description: 'Implement social media sharing buttons on blog posts and project pages to increase visibility and engagement.',
    skills: ['JavaScript', 'Social Media APIs', 'Frontend Development'],
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    claimedBy: {
      _id: '104',
      name: 'Alex Chen',
      avatar: '',
      role: 'volunteer',
    },
    submissionLink: 'https://github.com/example/pull/123',
    feedback: 'Great work! The sharing functionality works perfectly.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockMessages: Message[] = [
  {
    _id: 'm1',
    project: '1',
    sender: {
      _id: '101',
      name: 'Wildlife Protection Alliance',
      avatar: 'https://images.pexels.com/photos/915972/pexels-photo-915972.jpeg',
      role: 'ngo',
    },
    content: 'Welcome everyone to the project chat! Feel free to ask any questions about the website redesign project.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    _id: 'm2',
    project: '1',
    sender: {
      _id: '102',
      name: 'Jane Smith',
      avatar: '',
      role: 'volunteer',
    },
    content: 'Thanks for the opportunity! I have a question about the donation form - what payment methods should be supported besides credit cards?',
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(), // 11 hours ago
  },
  {
    _id: 'm3',
    project: '1',
    sender: {
      _id: '101',
      name: 'Wildlife Protection Alliance',
      avatar: 'https://images.pexels.com/photos/915972/pexels-photo-915972.jpeg',
      role: 'ngo',
    },
    content: 'Great question, Jane! Besides credit cards, we\'d like to support PayPal and possibly Apple Pay/Google Pay if that\'s doable.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
  },
];

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // For filtering tasks
  const [taskFilter, setTaskFilter] = useState('all');
  
  // In a real app, this would fetch project data from the API
  useEffect(() => {
    // Simulating API call with mock data
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be API calls
        // const projectResponse = await axios.get(`/api/projects/${projectId}`);
        // const tasksResponse = await axios.get(`/api/tasks?project=${projectId}`);
        // const messagesResponse = await axios.get(`/api/messages?project=${projectId}`);
        
        // Using mock data for now
        setTimeout(() => {
          setProject(mockProject);
          setTasks(mockTasks);
          setMessages(mockMessages);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  // Filter tasks based on selected filter
  const filteredTasks = () => {
    if (taskFilter === 'all') {
      return tasks;
    }
    return tasks.filter(task => task.status === taskFilter);
  };

  // Format the deadline date
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
  
  // Handle claiming a task (would call the API in a real app)
  const handleClaimTask = (taskId: string) => {
    if (!isAuthenticated) {
      // Redirect to login in a real app
      return;
    }
    
    // Update the task status locally (would be API call in real app)
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId ? { ...task, status: 'claimed', claimedBy: user } : task
      )
    );
  };
  
  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (!isAuthenticated || !user || !project) return;
    
    // In a real app, this would send the message to the server via socket.io
    // socket.emit('send_message', { project: projectId, content });
    
    // For now, just add it locally
    const newMessage: Message = {
      _id: `m${messages.length + 1}`,
      project: project._id,
      sender: user,
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
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
              to="/projects"
              className="btn-outline inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/projects"
              className="btn-primary inline-flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              Browse Projects
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
            to="/projects"
            className="text-gray-600 hover:text-primary-600 inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Link>
        </div>
        
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gray-200 relative">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-100">
                <span className="text-primary-500 text-4xl font-bold">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute top-0 right-0 m-4">
              <span className={`badge capitalize ${
                project.status === 'active' ? 'bg-success-50 text-success-700' :
                project.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                'bg-warning-50 text-warning-700'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">{project.title}</h1>
              
              <div className="flex items-center">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="btn-outline mr-3"
                >
                  <MessageSquare size={18} className="mr-2" />
                  Project Chat
                </button>
                
                {user?.role === 'ngo' && user._id === project.createdBy._id && (
                  <Link
                    to={`/projects/${project._id}/tasks/new`}
                    className="btn-primary"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Task
                  </Link>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="badge-primary">{skill}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Deadline</h3>
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">{formatDate(project.deadline)}</span>
                  <span className={`ml-4 text-sm font-medium ${
                    getDaysRemaining(project.deadline) <= 3 ? 'text-error-600' :
                    getDaysRemaining(project.deadline) <= 7 ? 'text-warning-600' :
                    'text-gray-600'
                  }`}>
                    ({getDaysRemaining(project.deadline)} days remaining)
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">Created By</h3>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                    {typeof project.createdBy === 'string' ? (
                      <span className="text-gray-500">?</span>
                    ) : (
                      project.createdBy.avatar ? (
                        <img 
                          src={project.createdBy.avatar} 
                          alt={project.createdBy.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">
                          {project.createdBy.name.charAt(0)}
                        </span>
                      )
                    )}
                  </div>
                  <span className="font-medium">
                    {typeof project.createdBy === 'string' 
                      ? 'Loading...' 
                      : project.createdBy.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chat section (conditionally rendered) */}
        {showChat && (
          <div className="mb-8 animate-fade-in">
            <ChatBox 
              projectId={project._id} 
              messages={messages} 
              onSendMessage={handleSendMessage} 
            />
          </div>
        )}
        
        {/* Tasks Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Tasks</h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Filter:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTaskFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    taskFilter === 'all'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTaskFilter('open')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    taskFilter === 'open'
                      ? 'bg-success-50 text-success-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setTaskFilter('claimed')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    taskFilter === 'claimed'
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Claimed
                </button>
                <button
                  onClick={() => setTaskFilter('completed')}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    taskFilter === 'completed'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
          
          {filteredTasks().length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
              {taskFilter !== 'all' ? (
                <p className="text-gray-600 mb-4">
                  No tasks with the selected status. Try a different filter.
                </p>
              ) : (
                <p className="text-gray-600 mb-4">
                  This project doesn't have any tasks yet.
                </p>
              )}
              
              {user?.role === 'ngo' && user._id === project.createdBy._id && (
                <Link
                  to={`/projects/${project._id}/tasks/new`}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add First Task
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks().map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  projectId={project._id}
                  onClaim={() => handleClaimTask(task._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetailPage;