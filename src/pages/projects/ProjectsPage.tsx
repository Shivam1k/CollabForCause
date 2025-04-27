import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectFilters from '../../components/projects/ProjectFilters';
import { Project } from '../../types';
import { Briefcase, AlertCircle } from 'lucide-react';

// Mock projects data (would typically come from API)
const mockProjects: Project[] = [
  {
    _id: '1',
    title: 'Website Redesign for Wildlife Conservation',
    description: 'Help redesign our website to better showcase our wildlife conservation efforts and engage supporters.',
    category: 'Web Development',
    skills: ['Web Development', 'UI/UX Design', 'Content Writing'],
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: 'active',
    image: 'https://images.pexels.com/photos/3719037/pexels-photo-3719037.jpeg',
    createdBy: '101',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Translate Educational Materials for Children',
    description: 'Help translate educational resources for children into multiple languages to reach wider audiences around the world.',
    category: 'Translation',
    skills: ['Translation', 'Education', 'Linguistics'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    status: 'active',
    image: 'https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg',
    createdBy: '102',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Social Media Campaign for Clean Water',
    description: 'Design and execute a social media campaign to raise awareness about clean water access in developing regions.',
    category: 'Marketing',
    skills: ['Social Media', 'Marketing', 'Graphic Design'],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    status: 'active',
    image: 'https://images.pexels.com/photos/6457579/pexels-photo-6457579.jpeg',
    createdBy: '103',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    title: 'Mobile App Development for Food Bank Distribution',
    description: 'Develop a mobile app to help coordinate food distribution for local food banks and reduce waste.',
    category: 'Mobile Development',
    skills: ['Mobile Development', 'React Native', 'API Integration'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'active',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    createdBy: '104',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    title: 'Data Analysis for Community Health Initiative',
    description: 'Analyze health data to identify trends and create visualizations for a community health initiative.',
    category: 'Data Analysis',
    skills: ['Data Analysis', 'Visualization', 'Statistics'],
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days from now
    status: 'active',
    image: 'https://images.pexels.com/photos/7689987/pexels-photo-7689987.jpeg',
    createdBy: '105',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    title: 'Grant Proposal Writing for Education Nonprofit',
    description: 'Help draft and review grant proposals for an education-focused nonprofit to secure funding for their programs.',
    category: 'Writing',
    skills: ['Grant Writing', 'Editing', 'Research'],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: 'active',
    image: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg',
    createdBy: '106',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface FilterState {
  search: string;
  skills: string[];
  status: string[];
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load projects on component mount
  useEffect(() => {
    // Simulating API call with mock data
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get('/api/projects');
        // const data = response.data;
        
        // Using mock data for now
        setTimeout(() => {
          setProjects(mockProjects);
          setFilteredProjects(mockProjects);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...projects];
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.category.toLowerCase().includes(searchTerm) ||
          project.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by skills
    if (filters.skills.length > 0) {
      filtered = filtered.filter(project =>
        project.skills.some(skill => filters.skills.includes(skill))
      );
    }
    
    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(project =>
        filters.status.includes(project.status)
      );
    }
    
    setFilteredProjects(filtered);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Board</h1>
            <p className="text-lg text-gray-600">
              Browse and discover projects that need your skills
            </p>
          </div>
        </div>
        
        <ProjectFilters onFilterChange={handleFilterChange} />
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-error-50 text-error-700 p-4 rounded-md flex items-start">
            <AlertCircle size={24} className="mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-1">No projects found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => setFilteredProjects(projects)}
              className="btn-outline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectsPage;