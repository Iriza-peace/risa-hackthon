export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  images?: string[];
  location?: string;
  agency?: string;
}

export type Category = 
  | 'Imisoro'
  | 'Imyidagaduro'
  | 'Ubuzima'
  | 'Ikoranabuhanga'
  | 'Education'
  | 'Imibereho'
  | 'Environment'
  | 'Other';

export type Status = 'Received' | 'Resolved';

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isOfficial?: boolean;
  upvotes: number;
}

// Mock categories with icons
export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'Imisoro', label: 'Imisoro' },
  { value: 'Education', label: 'Education' },
  { value: 'Imyidagaduro', label: 'Imyidagaduro' },
  { value: 'Ikoranabuhanga', label: 'Ikoranabuhanga' },
  { value: 'Imibereho', label: 'Imibereho' },
  { value: 'Ubuzima', label: 'Ubuzima' },
  { value: 'Other', label: 'Other' },
];

// Mock statuses with colors
export const STATUSES: { value: Status; label: string; color: string }[] = [
  { value: 'Received', label: 'Received', color: '#3B82F6' }, // Blue
  { value: 'Resolved', label: 'Resolved', color: '#10B981' }, // Green
];

// // Function to get a complaint by ID
// export const getComplaintById = (id: string): Complaint | undefined => {
//   return MOCK_COMPLAINTS.find(complaint => complaint.id === id);
// };

// // Function to get user's complaints
// export const getUserComplaints = (userId: string): Complaint[] => {
//   return MOCK_COMPLAINTS.filter(complaint => complaint.userId === userId);
// };