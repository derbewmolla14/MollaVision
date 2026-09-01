import { Link } from 'react-router-dom';

const Certificates = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Certificates</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your certificates will appear here after completing courses!
        </p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Certificates;
