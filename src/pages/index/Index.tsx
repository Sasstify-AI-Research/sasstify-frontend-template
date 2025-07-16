import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const Index = () => {

  return (
    <Layout>
      <Link
        to="/dashboard"
        className="mt-20 text-xl font-bold tracking-tight hover:opacity-80 hover:cursor-pointer transition-opacity flex items-center gap-2"
      >
        Link to Dashboard
      </Link>
      
    </Layout>
  );
};

export default Index;
