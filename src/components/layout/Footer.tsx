import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                <path d="m15 5 4 4"></path>
                <path d="M9 5a2.83 2.83 0 0 0-4 4l3 3-3 .5.5-3 3-3Z"></path>
              </svg>
              <span className="font-bold text-xl text-primary-600">CollabForCause</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Connecting volunteers with nonprofits to create meaningful impact through collaboration.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/projects" className="text-base text-gray-600 hover:text-primary-600">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-base text-gray-600 hover:text-primary-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-base text-gray-600 hover:text-primary-600">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Community</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/for-volunteers" className="text-base text-gray-600 hover:text-primary-600">
                  For Volunteers
                </Link>
              </li>
              <li>
                <Link to="/for-nonprofits" className="text-base text-gray-600 hover:text-primary-600">
                  For Nonprofits
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-base text-gray-600 hover:text-primary-600">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-600 hover:text-primary-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-600 hover:text-primary-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-base text-gray-600 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500">
              &copy; {new Date().getFullYear()} CollabForCause. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <span className="sr-only">Email</span>
                <Mail size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </a>
              <div className="flex items-center text-gray-500">
                <span className="mr-2">Made with</span>
                <Heart size={16} className="text-accent-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;