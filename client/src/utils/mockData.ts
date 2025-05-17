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
  | 'Roads'
  | 'Water'
  | 'Electricity'
  | 'Waste'
  | 'Public Transport'
  | 'Education'
  | 'Healthcare'
  | 'Safety'
  | 'Environment'
  | 'Other';

export type Status = 'Pending' | 'In Review' | 'Resolved';

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
  { value: 'Roads', label: 'Roads & Infrastructure' },
  { value: 'Water', label: 'Water Supply' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Waste', label: 'Waste Management' },
  { value: 'Public Transport', label: 'Public Transport' },
  { value: 'Education', label: 'Education' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Safety', label: 'Safety & Security' },
  { value: 'Environment', label: 'Environment' },
  { value: 'Other', label: 'Other' },
];

// Mock statuses with colors
export const STATUSES: { value: Status; label: string; color: string }[] = [
  { value: 'Pending', label: 'Pending', color: '#F59E0B' }, // Amber
  { value: 'In Review', label: 'In Review', color: '#3B82F6' }, // Blue
  { value: 'Resolved', label: 'Resolved', color: '#10B981' }, // Green
];

// Sample complaints data
export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    title: 'Pothole on Main Street',
    description: 'There is a large pothole on Main Street near the intersection with Oak Avenue. It has been there for weeks and poses a danger to vehicles.',
    category: 'Roads',
    status: 'In Review',
    createdAt: '2025-03-10T10:30:00Z',
    updatedAt: '2025-03-12T14:15:00Z',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    upvotes: 24,
    downvotes: 0,
    comments: [
      {
        id: 'comment1',
        text: 'I noticed this too! My car was damaged when I hit this pothole last week.',
        createdAt: '2025-03-10T12:45:00Z',
        userId: 'user2',
        userName: 'Mike Taylor',
        upvotes: 5
      },
      {
        id: 'comment2',
        text: 'The Roads Department has scheduled repairs for next week. Thank you for bringing this to our attention.',
        createdAt: '2025-03-12T14:15:00Z',
        userId: 'roads-dept',
        userName: 'Roads Department',
        isOfficial: true,
        upvotes: 12
      }
    ],
    images: ['https://images.pexels.com/photos/2883509/pexels-photo-2883509.jpeg'],
    location: 'Main Street & Oak Avenue'
  },
  {
    id: 'c2',
    title: 'Irregular Water Supply in Cedar Heights',
    description: 'Our neighborhood has been experiencing irregular water supply for the past two weeks. Sometimes we don\'t have water for entire days.',
    category: 'Water',
    status: 'Pending',
    createdAt: '2025-03-08T08:20:00Z',
    updatedAt: '2025-03-08T08:20:00Z',
    userId: 'user3',
    userName: 'David Chen',
    userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    upvotes: 37,
    downvotes: 0,
    comments: [
      {
        id: 'comment3',
        text: 'We are having the same issue on Maple Street!',
        createdAt: '2025-03-08T09:30:00Z',
        userId: 'user4',
        userName: 'Lisa Wong',
        upvotes: 8
      },
      {
        id: 'comment4',
        text: 'I\'ve called the water department three times but no response.',
        createdAt: '2025-03-09T11:20:00Z',
        userId: 'user5',
        userName: 'Robert Garcia',
        upvotes: 15
      }
    ],
    location: 'Cedar Heights'
  },
  {
    id: 'c3',
    title: 'Streetlights Out on Park Avenue',
    description: 'All the streetlights on Park Avenue between 5th and 8th Streets have been out for over a week, making it unsafe to walk at night.',
    category: 'Electricity',
    status: 'Resolved',
    createdAt: '2025-03-05T19:45:00Z',
    updatedAt: '2025-03-07T16:30:00Z',
    userId: 'user6',
    userName: 'Emily Rodriguez',
    upvotes: 18,
    downvotes: 0,
    comments: [
      {
        id: 'comment5',
        text: 'Thank you for reporting this issue. Our maintenance team has repaired the circuit breaker that was causing the outage. All streetlights should now be functioning properly.',
        createdAt: '2025-03-07T16:30:00Z',
        userId: 'electricity-dept',
        userName: 'City Electricity Department',
        isOfficial: true,
        upvotes: 20
      }
    ],
    location: 'Park Avenue between 5th and 8th Streets'
  },
  {
    id: 'c4',
    title: 'Overflowing Trash Bins at Central Park',
    description: 'The trash bins at Central Park have not been emptied for days and are overflowing. This is attracting pests and creating an unpleasant environment.',
    category: 'Waste',
    status: 'In Review',
    createdAt: '2025-03-09T14:10:00Z',
    updatedAt: '2025-03-11T09:25:00Z',
    userId: 'user7',
    userName: 'Thomas Wilson',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    upvotes: 42,
    downvotes: 0,
    comments: [
      {
        id: 'comment6',
        text: 'I was at the park yesterday and it was really bad.',
        createdAt: '2025-03-09T16:05:00Z',
        userId: 'user8',
        userName: 'Amanda Lee',
        upvotes: 7
      },
      {
        id: 'comment7',
        text: 'We are aware of this issue and have dispatched a cleanup crew. The regular collection schedule will resume tomorrow.',
        createdAt: '2025-03-11T09:25:00Z',
        userId: 'waste-dept',
        userName: 'Waste Management Department',
        isOfficial: true,
        upvotes: 18
      }
    ],
    images: ['https://images.pexels.com/photos/2894225/pexels-photo-2894225.jpeg'],
    location: 'Central Park'
  },
  {
    id: 'c5',
    title: 'Delayed Bus Service on Route 42',
    description: 'Bus service on Route 42 has been consistently delayed by 15-20 minutes during morning rush hour for the past two weeks.',
    category: 'Public Transport',
    status: 'Pending',
    createdAt: '2025-03-12T07:50:00Z',
    updatedAt: '2025-03-12T07:50:00Z',
    userId: 'user9',
    userName: 'James Morrison',
    upvotes: 29,
    downvotes: 2,
    comments: [
      {
        id: 'comment8',
        text: 'This has been making me late for work! Something needs to be done.',
        createdAt: '2025-03-12T08:15:00Z',
        userId: 'user10',
        userName: 'Sophia Kim',
        upvotes: 13
      }
    ],
    location: 'Route 42'
  }
];

// Function to get a complaint by ID
export const getComplaintById = (id: string): Complaint | undefined => {
  return MOCK_COMPLAINTS.find(complaint => complaint.id === id);
};

// Function to get user's complaints
export const getUserComplaints = (userId: string): Complaint[] => {
  return MOCK_COMPLAINTS.filter(complaint => complaint.userId === userId);
};