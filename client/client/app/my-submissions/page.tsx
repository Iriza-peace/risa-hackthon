"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Eye, MessageSquare, Filter, Search } from "lucide-react";

// Mock data for submissions
const mockSubmissions = [
  {
    id: "101",
    title: "Broken street light on Oak Avenue",
    category: "Electricity",
    agency: "Ministry of Energy",
    status: "In Review",
    createdAt: "2025-04-01T10:30:00Z",
    lastUpdated: "2025-04-03T14:15:00Z",
    ticketNumber: "EL-2025-1234"
  },
  {
    id: "102",
    title: "Water outage in Riverside neighborhood",
    category: "Water",
    agency: "Ministry of Water",
    status: "Pending",
    createdAt: "2025-04-05T08:45:00Z",
    lastUpdated: "2025-04-05T09:30:00Z",
    ticketNumber: "WT-2025-5678"
  },
  {
    id: "103",
    title: "Garbage collection delayed for two weeks",
    category: "Waste Management",
    agency: "Ministry of Environment",
    status: "Resolved",
    createdAt: "2025-03-20T11:20:00Z",
    lastUpdated: "2025-03-28T16:40:00Z",
    ticketNumber: "WM-2025-9012"
  },
  {
    id: "104",
    title: "Pothole on Main Street causing traffic issues",
    category: "Roads & Infrastructure",
    agency: "Ministry of Infrastructure",
    status: "In Review",
    createdAt: "2025-03-25T14:10:00Z",
    lastUpdated: "2025-03-27T10:30:00Z",
    ticketNumber: "RD-2025-3456"
  }
];

export default function MySubmissions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           submission.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Submissions</h1>
          <p className="text-gray-600">
            Track the status of your complaints and feedback submissions.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="w-full md:w-auto relative">
              <input
                type="text"
                placeholder="Search by title or ticket number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
              </select>
              
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.ticketNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {submission.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {submission.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getStatusColor(submission.status)} status-badge`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(submission.lastUpdated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-orange-700 hover:text-orange-900">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-orange-700 hover:text-orange-900">
                            <MessageSquare className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No submissions found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredSubmissions.length === 0 && searchTerm === "" && statusFilter === "All" && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
              <p className="text-gray-600 mb-6">You haven't submitted any complaints or feedback yet.</p>
              <Link href="/submit">
                <Button>Submit a New Complaint</Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Understanding Submission Status</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
              <span><strong>Pending:</strong> Your submission has been received and is awaiting initial review.</span>
            </li>
            <li className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span><strong>In Review:</strong> Your submission is currently being investigated by the relevant agency.</span>
            </li>
            <li className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span><strong>Resolved:</strong> Your issue has been addressed and the submission is considered closed.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}