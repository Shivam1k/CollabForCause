import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, Briefcase, Users, Award, Heart, CheckCircle, Clock } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Connect, Collaborate, <br />Create Impact
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Empowering volunteers and nonprofits to work together on meaningful projects that make a difference.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3">
                  Get Started
                </Link>
                <Link to="/projects" className="btn border border-primary-200 text-white hover:bg-primary-700 font-semibold px-6 py-3">
                  Explore Projects
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 animate-slide-in">
              <img 
                src="https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg" 
                alt="Team collaborating on a project" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How CollabForCause Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects skilled volunteers with nonprofits in need of help, making it easy to collaborate remotely on meaningful projects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary-50 p-4 rounded-full mb-6">
                <Briefcase size={32} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Organizations Post Projects</h3>
              <p className="text-gray-600">
                Nonprofits create projects and break them down into manageable microtasks that can be completed remotely.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-50 p-4 rounded-full mb-6">
                <Users size={32} className="text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Volunteers Claim Tasks</h3>
              <p className="text-gray-600">
                Skilled volunteers browse the project board, find opportunities that match their skills, and claim tasks they want to work on.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-accent-50 p-4 rounded-full mb-6">
                <CheckCircle size={32} className="text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Collaborate & Complete</h3>
              <p className="text-gray-600">
                Volunteers and nonprofits communicate through our platform, work together, and complete tasks to create positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover meaningful projects that need your skills and make a difference today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="card card-hover h-full flex flex-col">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3719037/pexels-photo-3719037.jpeg"
                  alt="Web Development Project"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className="badge bg-success-50 text-success-700">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Website Redesign for Wildlife Conservation</h3>
                <p className="text-gray-600 mb-4">Help redesign our website to better showcase our wildlife conservation efforts and engage supporters.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-primary">Web Development</span>
                  <span className="badge-primary">UI/UX Design</span>
                  <span className="badge-primary">Content Writing</span>
                </div>
                <div className="mt-auto">
                  <Link to="/projects" className="btn-primary w-full text-center">View Project</Link>
                </div>
              </div>
            </div>
            
            {/* Project Card 2 */}
            <div className="card card-hover h-full flex flex-col">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/590045/pexels-photo-590045.jpeg"
                  alt="Translation Project"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className="badge bg-success-50 text-success-700">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Translate Educational Materials</h3>
                <p className="text-gray-600 mb-4">Help translate educational resources for children into multiple languages to reach wider audiences.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-primary">Translation</span>
                  <span className="badge-primary">Education</span>
                  <span className="badge-primary">Linguistics</span>
                </div>
                <div className="mt-auto">
                  <Link to="/projects" className="btn-primary w-full text-center">View Project</Link>
                </div>
              </div>
            </div>
            
            {/* Project Card 3 */}
            <div className="card card-hover h-full flex flex-col">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/6457579/pexels-photo-6457579.jpeg"
                  alt="Social Media Project"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className="badge bg-success-50 text-success-700">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Social Media Campaign for Clean Water</h3>
                <p className="text-gray-600 mb-4">Design and execute a social media campaign to raise awareness about clean water access in developing regions.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge-primary">Social Media</span>
                  <span className="badge-primary">Marketing</span>
                  <span className="badge-primary">Graphic Design</span>
                </div>
                <div className="mt-auto">
                  <Link to="/projects" className="btn-primary w-full text-center">View Project</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/projects" className="btn-outline inline-flex items-center">
              View All Projects <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join CollabForCause?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers unique benefits for both volunteers and nonprofits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <div className="bg-gray-50 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-primary-100 p-3 rounded-full mb-4 md:mb-0 md:mr-6">
                <Award size={28} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Gain Valuable Experience</h3>
                <p className="text-gray-600">
                  Build your portfolio with real-world projects that make a difference while developing new skills and connections.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-secondary-100 p-3 rounded-full mb-4 md:mb-0 md:mr-6">
                <Clock size={28} className="text-secondary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Flexible Volunteering</h3>
                <p className="text-gray-600">
                  Contribute on your own schedule with clearly defined tasks, perfect for busy professionals looking to give back.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-accent-100 p-3 rounded-full mb-4 md:mb-0 md:mr-6">
                <Heart size={28} className="text-accent-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Maximize Impact</h3>
                <p className="text-gray-600">
                  For nonprofits, access skilled volunteers from around the world to help fulfill your mission and expand your reach.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center">
              <div className="bg-primary-100 p-3 rounded-full mb-4 md:mb-0 md:mr-6">
                <Users size={28} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Build Connections</h3>
                <p className="text-gray-600">
                  Connect with like-minded individuals and organizations who share your values and passion for creating positive change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
            Join our community today and start contributing your skills to projects that matter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 py-3">
              Sign Up Now
            </Link>
            <Link to="/projects" className="btn border border-primary-200 text-white hover:bg-primary-700 font-semibold px-6 py-3">
              Explore Projects
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;