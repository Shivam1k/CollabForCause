import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

// Sample skill categories for filtering
const SKILL_CATEGORIES = [
  'Web Development',
  'Graphic Design',
  'Content Writing',
  'Translation',
  'Marketing',
  'Social Media',
  'Research',
  'Data Analysis',
  'Legal',
  'Event Planning',
];

interface ProjectFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  skills: string[];
  status: string[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    skills: [],
    status: [],
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    
    const newFilters = { ...filters, skills: newSkills };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { search: '', skills: [], status: [] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = filters.search || filters.skills.length > 0 || filters.status.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Search input */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 w-full input border-gray-300"
          />
        </div>
      </div>
      
      {/* Filters section */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center text-gray-700 hover:text-primary-600"
          >
            <Filter size={18} className="mr-2" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full">
                {filters.skills.length + filters.status.length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-primary-600 flex items-center"
            >
              <X size={16} className="mr-1" />
              Clear all
            </button>
          )}
        </div>
        
        {isFiltersOpen && (
          <div className="mt-4 animate-fade-in">
            {/* Skills filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.skills.includes(skill)
                        ? 'bg-primary-100 text-primary-800 border-primary-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Status filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                {['active', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                      filters.status.includes(status)
                        ? status === 'active'
                          ? 'bg-success-50 text-success-700'
                          : status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-warning-50 text-warning-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;