import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const TicketsPage = Loadable(lazy(() => import('pages/tickets/TicketsPage')));
const ChatLayout = Loadable(lazy(() => import('pages/chats/ChatLayout')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/dashboard',
      element: <DashboardDefault />
    },
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
    {
      path: 'tickets',
      element: <TicketsPage />
    },
    {
      path: '/chats',
      element: <ChatLayout/>
    },
    // {
    //   path: '/new-article',
    //   element: <NewArticles/>
    // },
    // {
    //   path: '/articles',
    //   element: <ArticlesTable />
    // }
  ]
};

export default MainRoutes;
