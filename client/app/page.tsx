import ComplaintCard from "./components/ComplaintCard";
import { Button } from "../components/ui/button";
import { PlusCircle, Filter } from "lucide-react";
import Link from "next/link";

// Mock data for initial display
const mockComplaints = [
  {
    id: "1",
    title: "Poor road conditions in Central District",
    description: "The roads in Central District have numerous potholes causing damage to vehicles and creating hazardous driving conditions. This has been an issue for over 3 months now.",
    category: "Roads",
    status: "Pending",
    createdAt: "2025-04-10T10:30:00Z",
    author: "John Doe",
    imageUrl: "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    likes: 24,
    comments: 5
  },
  {
    id: "2",
    title: "Water supply interruption in East Neighborhood",
    description: "We've been experiencing water supply interruptions for the past week without any prior notice. This is causing significant inconvenience to all residents.",
    category: "Water",
    status: "In Review",
    createdAt: "2025-04-09T15:45:00Z",
    author: "Jane Smith",
    likes: 18,
    comments: 3
  },
  {
    id: "3",
    title: "Street lights not working on Main Avenue",
    description: "All street lights on Main Avenue have been out of order for two weeks, creating safety concerns for pedestrians and drivers at night.",
    category: "Electricity",
    status: "Resolved",
    createdAt: "2025-04-07T09:15:00Z",
    author: "Robert Johnson",
    imageUrl: "https://images.pexels.com/photos/3345882/pexels-photo-3345882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    likes: 32,
    comments: 7
  },
  {
    id: "4",
    title: "Garbage collection delays in West District",
    description: "Garbage has not been collected in our area for over two weeks, leading to health and sanitation concerns.",
    category: "Waste",
    status: "Pending",
    createdAt: "2025-04-05T13:20:00Z",
    author: "Maria Garcia",
    likes: 15,
    comments: 2
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Feedback</h1>
          <p className="text-gray-600 max-w-2xl">
            Browse public complaints and feedback about government services. 
            Share your experience or add your voice to existing issues.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link href="/submit">
            <Button className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Complaint
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Category Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex overflow-x-auto py-2 space-x-2 no-scrollbar">
              <button className="bg-orange-700 text-white px-4 py-1 rounded-full text-sm whitespace-nowrap">
                All
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Roads
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Water
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Electricity
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Healthcare
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Education
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Waste
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-full text-sm whitespace-nowrap">
                Public Transport
              </button>
            </div>
          </div>

          {/* Quick Post Form */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold mr-3">
                U
              </div>
              <input
                type="text"
                placeholder="Share your feedback or concern..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={() => window.location.href = '/submit'}
              />
            </div>
          </div>

          {/* Complaints Feed */}
          {mockComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              {...complaint}
            />
          ))}
        </div>

        <div className="space-y-6">
          {/* Trending Issues */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Trending Issues</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  1
                </span>
                <span className="text-gray-700">Water supply issues in Northern District</span>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  2
                </span>
                <span className="text-gray-700">New school building delay</span>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  3
                </span>
                <span className="text-gray-700">Public transportation schedule changes</span>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  4
                </span>
                <span className="text-gray-700">Hospital waiting times</span>
              </li>
              <li className="flex items-start">
                <span className="bg-orange-100 text-orange-700 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  5
                </span>
                <span className="text-gray-700">Park maintenance issues</span>
              </li>
            </ul>
          </div>

          {/* Recent Resolutions */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Resolutions</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-3">
                <h3 className="font-medium text-gray-800">Street lighting fixed on Oak Avenue</h3>
                <p className="text-sm text-gray-500">Resolved 2 days ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <h3 className="font-medium text-gray-800">Pothole repairs completed on Main Street</h3>
                <p className="text-sm text-gray-500">Resolved 3 days ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <h3 className="font-medium text-gray-800">Public library extended hours implemented</h3>
                <p className="text-sm text-gray-500">Resolved 5 days ago</p>
              </div>
            </div>
          </div>

          {/* Upcoming Town Halls */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Town Halls</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-medium text-gray-800">Infrastructure Development Plan</h3>
                <p className="text-sm text-gray-500 mb-1">May 15, 2025 • 6:00 PM</p>
                <p className="text-sm text-gray-600">City Hall, Main Conference Room</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-medium text-gray-800">Education Budget Discussion</h3>
                <p className="text-sm text-gray-500 mb-1">May 22, 2025 • 5:30 PM</p>
                <p className="text-sm text-gray-600">Community Center, Room 201</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Healthcare Services Review</h3>
                <p className="text-sm text-gray-500 mb-1">June 5, 2025 • 7:00 PM</p>
                <p className="text-sm text-gray-600">Regional Hospital, Auditorium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}