import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const NotFound = () => {

  return (
    <Layout fixedHeader={true}>
	  <div className="min-h-screen flex items-center justify-center bg-gray-100">
		  <div className="text-center animate-pulse" role="alert" aria-labelledby="pageNotFoundTitle">
			<h1 id="pageNotFoundTitle" className="text-4xl font-bold mb-4">404</h1>
			<p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
			 <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md mt-6 text-lg font-semibold hover:bg-blue-700 transition-colors">
             Return to Home
             </Link>
		  </div>
      </div>
    </Layout>
  );
};

export default NotFound;
