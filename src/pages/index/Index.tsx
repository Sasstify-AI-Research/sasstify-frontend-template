import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import * as styles from './index.module.css';
import * as styles2 from './index2.module.css';

const Index = () => {

  return (
    <Layout>
      <Link
        to="/dashboard"
        className={cn(
                      styles.btn,
                      styles2.btn1,
                      "mt-20 text-xl font-bold tracking-tight hover:opacity-80 hover:cursor-pointer transition-opacity flex items-center gap-2"
                    )}
      >
        Link to Dashboard
      </Link>
    </Layout>
  );
};

export default Index;
