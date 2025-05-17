// assets
import { ChromeOutlined} from '@ant-design/icons';
import { Ticket } from 'lucide-react';
import { IoTicketSharp } from "react-icons/io5";

// icons
const icons = {
  ChromeOutlined
};

// ==============================|| MENU ITEMS - TICKETS ||============================== //

const tickets = {
  id: 'tickets',
  // title: 'Support',
  type: 'group',
  children: [
    {
      id: 'tickets',
      title: 'All Tickets',
      type: 'item',
      url: '/tickets',
      icon: IoTicketSharp,
      breadcrumbs: false
    }
  ]
};

export default tickets;
