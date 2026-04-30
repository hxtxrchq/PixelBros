import DashboardLayout from '../layout/DashboardLayout';
import { Outlet } from 'react-router-dom';
import { IntranetProvider } from '../context/IntranetContext';

export default function Dashboard() {
  return (
    <IntranetProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </IntranetProvider>
  );
}
