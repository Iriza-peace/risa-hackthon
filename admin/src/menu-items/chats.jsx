// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

import { Send } from 'lucide-react';
import { MdChatBubble } from "react-icons/md";

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const chats = {
  id: 'chats',
  type: 'group',
  children: [
    {
      id: 'util-chats',
      title: 'Chats',
      type: 'item',
      url: '/chats',
      breadcrumbs: false,
      icon: MdChatBubble
    }
  ]
};

export default chats;
