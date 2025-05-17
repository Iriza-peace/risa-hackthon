// assets
import { DashboardOutlined } from '@ant-design/icons';
import { LayoutDashboard } from 'lucide-react';
import { MdDashboard } from 'react-icons/md';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  // title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Analytics',
      type: 'item',
      url: '/dashboard',
      icon: MdDashboard,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
