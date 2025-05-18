"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Camera, Paperclip, X } from "lucide-react";

const categories = [
  "Healthcare",
  "Education",
  "Roads & Infrastructure",
  "Water Supply",
  "Electricity",
  "Public Transport",
  "Waste Management",
  "Security",
  "Other"
];

const agencies = [
  "Ministry of Health",
  "Ministry of Education",
  "Ministry of Infrastructure",
  "Ministry of Water",
  "Ministry of Energy",
  "Ministry of Transport",
  "Ministry of Environment",
  "Ministry of Interior",
  "Local Government"
];

export default function SubmitForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    telephone: "",
    title: "",
    category: "",
    agency: "",
    description: "",
    
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreview([...preview, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    const updatedPreviews = [...preview];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreview(updatedPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic will go here
    console.log(formData);
    console.log(files);
    
    // Reset form after submission
    setFormData({
      fullName: "",
      idNumber: "",
      telephone: "",
      title: "",
      category: "",
      agency: "",
      description: ""
    });
    
    // Clean up preview URLs
    preview.forEach(url => URL.revokeObjectURL(url));
    setFiles([]);
    setPreview([]);
    
    // Show success message
    alert("Your complaint has been submitted successfully!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Your Complaint</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                ID Number *
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                Telephone *
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Complaint Details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Agency *
                </label>
                <select
                  id="agency"
                  name="agency"
                  value={formData.agency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select an agency</option>
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents or Images
              </label>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {preview.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      className="w-20 h-20 object-cover rounded-md border border-gray-300"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                  />
                  <label
                    htmlFor="photo"
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Camera className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Add Photos</span>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="file"
                    id="document"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={handleFileChange}
                    multiple
                  />
                  <label
                    htmlFor="document"
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Paperclip className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Add Documents</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Submit Complaint
          </Button>
        </div>
      </form>
    </div>
  );
}