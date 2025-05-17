// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
import { MdLogout } from 'react-icons/md';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

const isLoggedIn = true; // Change this dynamically based on the authentication state

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'authentication',
  type: 'group',
  children: [
    // Conditionally include the login item
    ...(!isLoggedIn
      ? [
          {
            id: 'login1',
            title: 'Login',
            type: 'item',
            url: '/login',
            icon: icons.LoginOutlined,
            target: true
          }
        ]
      : []),
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: MdLogout
      // target: true
    }
  ]
};

export default pages;
