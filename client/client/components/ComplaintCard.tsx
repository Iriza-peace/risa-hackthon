"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageSquare, Share2, ArrowUp, ArrowDown } from "lucide-react";
import { formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "./ui/button";

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  author: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export default function ComplaintCard({
  id,
  title,
  description,
  category,
  status,
  createdAt,
  author,
  imageUrl,
  likes,
  comments,
}: ComplaintCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4 card-hover">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold mr-3">
              {author.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{author}</h3>
              <p className="text-xs text-gray-500">{formatDate(createdAt)}</p>
            </div>
          </div>
          <div className={`${getStatusColor(status)} status-badge`}>
            {status}
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-3">{description}</p>

        <div className="mb-3">
          <span className="inline-block bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-xs font-medium mr-2">
            #{category}
          </span>
        </div>

        {imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              width={600}
              height={400}
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${
                liked ? "text-orange-600" : "text-gray-500"
              } hover:text-orange-600`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-orange-600" : ""}`} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={toggleComments}
              className="flex items-center space-x-1 text-gray-500 hover:text-orange-600"
            >
              <MessageSquare className="h-5 w-5" />
              <span>{comments}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-orange-600">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-gray-600">
              <ArrowUp className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="bg-gray-50 p-4 border-t border-gray-200 animate-fade-in">
          <h4 className="font-medium mb-3">Comments</h4>
          <div className="mb-4">
            <div className="flex mb-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold mr-2">
                J
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
                <h5 className="font-medium text-sm">John Doe</h5>
                <p className="text-sm text-gray-600">
                  I had the same issue last month. They fixed it within a week.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold mr-2">
                M
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm flex-1">
                <h5 className="font-medium text-sm">Maria Garcia</h5>
                <p className="text-sm text-gray-600">
                  This is a serious issue that needs to be addressed ASAP.
                </p>
              </div>
            </div>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 rounded-l-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Button className="rounded-l-none" size="sm">
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}