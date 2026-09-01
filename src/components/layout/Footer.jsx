import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">MollaVision</h3>
            <p className="text-gray-400 text-sm">
              Learn technology. Build your future. Master programming and web development with practical lessons and examples.
            </p>
          </div>

          {/* Tutorials */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tutorials</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses/html" className="hover:text-blue-400 transition-colors">HTML</Link></li>
              <li><Link to="/courses/css" className="hover:text-blue-400 transition-colors">CSS</Link></li>
              <li><Link to="/courses/javascript" className="hover:text-blue-400 transition-colors">JavaScript</Link></li>
              <li><Link to="/courses/react" className="hover:text-blue-400 transition-colors">React</Link></li>
              <li><Link to="/courses/python" className="hover:text-blue-400 transition-colors">Python</Link></li>
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="text-white font-semibold mb-4">Learning</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-blue-400 transition-colors">Courses</Link></li>
              <li><Link to="/practice" className="hover:text-blue-400 transition-colors">Practice</Link></li>
              <li><Link to="/projects" className="hover:text-blue-400 transition-colors">Projects</Link></li>
              <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/certificates" className="hover:text-blue-400 transition-colors">Certificates</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; 2024 MollaVision. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <FiGithub size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
