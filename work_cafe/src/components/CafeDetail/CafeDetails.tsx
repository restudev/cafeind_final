import React, { useState } from "react";
import { Check, Link as LinkIcon, Wifi } from "lucide-react";
import Badge from "../../components/common/Badge";

interface CafeDetailsProps {
  description: string;
  tags: string[];
  amenities: string[];
}

const CafeDetails: React.FC<CafeDetailsProps> = ({ description, tags, amenities }) => {
  const [copied, setCopied] = useState(false);

  const copyLinkToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      alert("Failed to copy link. Please copy the URL manually.");
    }
  };

  return (
    <div className="cafe-details bg-white p-6 rounded-xl shadow-md mb-8 relative">
      <button
        onClick={copyLinkToClipboard}
        className="absolute top-4 right-4 flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full p-2 transition-colors pointer-events-auto"
        title="Copy link to this cafe"
      >
        {copied ? (
          <Check size={18} className="text-green-600" />
        ) : (
          <LinkIcon size={18} />
        )}
      </button>
      {copied && (
        <div className="absolute top-4 right-14 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
          Link copied!
        </div>
      )}
      <h2 className="text-2xl font-bold text-blue-900 mb-4">About This Cafe</h2>
      <p className="text-gray-700 mb-6">{description}</p>
      <h3 className="font-bold text-blue-900 mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2 ">
        {tags.map((tag: string, index: number) => (
          <Badge key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
            >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-5 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
            >
              {amenity === "High-Speed WiFi" && <Wifi size={14} className="mr-1" />}
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CafeDetails;