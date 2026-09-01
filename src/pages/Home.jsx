import { Link } from 'react-router-dom';
import { FiSearch, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import CourseCard from '../components/course/CourseCard';
import { courses, getCoursesByCategory } from '../data/courses';

const Home = () => {
  const programmingCourses = getCoursesByCategory('programming').slice(0, 3);
  const frontendCourses = getCoursesByCategory('frontend').slice(0, 3);
  const featuredCourses = courses.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="container-custom py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Learn Technology.
              <br />
              <span className="text-blue-600">Build Your Future.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Master programming, web development, and modern technology with practical lessons, examples, and projects.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/courses">
                <Button variant="primary" className="text-lg">
                  Start Learning
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="text-lg">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image / Illustration */}
          <div
            className="rounded-lg h-96 flex items-center justify-center text-white relative overflow-hidden"
            style={{
              backgroundImage: "url('/learn-by-doing.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
            <div className="text-center relative z-10">
              <div className="text-7xl mb-4">💻</div>
              <p className="text-2xl font-bold">Learn by Doing</p>
              <p className="text-blue-100">Interactive lessons with real-world examples</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container-custom mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Find Your Course
          </h2>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for HTML, JavaScript, React, Python, SQL..."
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-lg"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
              <FiSearch size={24} />
            </button>
          </div>
          <p className="text-center text-gray-500 mt-4 text-sm">
            Search among 15+ courses and hundreds of lessons
          </p>
        </div>
      </section>

      {/* Programming Courses */}
      <section className="container-custom mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Programming Courses
          </h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programmingCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Web Development Courses */}
      <section className="container-custom mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Web Development
          </h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {frontendCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container-custom mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Courses
          </h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Why Learn with MollaVision */}
      <section className="container-custom mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Why Learn with MollaVision?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <div className="text-5xl text-blue-600 mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Learn by Doing
            </h3>
            <p className="text-gray-600">
              Interactive lessons with real-world examples and practical exercises to reinforce your learning.
            </p>
          </Card>

          <Card>
            <div className="text-5xl text-blue-600 mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Comprehensive Content
            </h3>
            <p className="text-gray-600">
              From beginner to advanced topics, we cover everything you need to master modern technology.
            </p>
          </Card>

          <Card>
            <div className="text-5xl text-blue-600 mb-4">🚀</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Career Ready
            </h3>
            <p className="text-gray-600">
              Build real projects and earn certificates to showcase your skills to employers.
            </p>
          </Card>
        </div>
      </section>

      {/* Learning Statistics */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Join Our Learning Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <FiUsers size={40} />
              </div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-blue-100">Active Learners</p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <FiTrendingUp size={40} />
              </div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <p className="text-blue-100">Premium Courses</p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <FiAward size={40} />
              </div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <p className="text-blue-100">Lessons & Tutorials</p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <FiSearch size={40} />
              </div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students learning programming, web development, and modern technology.
          </p>
          <Link to="/courses">
            <Button variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
              Explore All Courses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
