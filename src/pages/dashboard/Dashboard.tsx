import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  return (
    <Layout fixedHeader={true}>
      <Link
        to="/"
        className="mt-20 text-xl font-bold tracking-tight hover:opacity-80 hover:cursor-pointer transition-opacity flex items-center gap-2"
      >
        Link to Index
      </Link>
      
    </Layout>
  );
};

export default Dashboard;
