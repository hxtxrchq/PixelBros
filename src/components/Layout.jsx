import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#06071a' }}>
      <Navbar />
      <main className="flex-grow relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
