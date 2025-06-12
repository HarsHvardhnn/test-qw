import React, { useState, useEffect } from "react";
import { CheckSquare, Square, X } from "lucide-react";
import axiosInstance from "../../axios";

interface ChecklistItem {
  id: string;
  category: string; 
  description: string;
  isComplete: boolean;
  matchTerms: string[];
  imageUrl?: string;
}

export const ProductChecklist: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}> = ({ isOpen, onClose, projectId }) => {
  const [checklist, setCheckList] = useState<ChecklistItem[]>([]);

  const fetchRequiredSelections = async (projectId: string) => {
    try {
      const response = await axiosInstance.get(
        `/meeting/${projectId}/selections`
      );
      return response.data as ChecklistItem[];
    } catch (error) {
      console.error("Error fetching required selections:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!projectId || !isOpen) return;

    const getChecklist = async () => {
      try {
        const selections = await fetchRequiredSelections(projectId);
        setCheckList(selections);
      } catch (err) {
        console.error("Failed to load checklist items", err);
      }
    };

    getChecklist();
  }, [projectId, isOpen]);

  const toggleItemComplete = (id: string) => {
    setCheckList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isComplete: !item.isComplete } : item
      )
    );
  };

  const progress =
    (checklist.filter((item) => item.isComplete).length / checklist.length) *
    100;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Required Categories
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-600">
            {checklist.filter((item) => item.isComplete).length} of{" "}
            {checklist.length} complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100%-220px)]">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItemComplete(item.id)}
            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
              item.isComplete ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.isComplete ? (
                <CheckSquare className="w-5 h-5 text-blue-500" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <p
                className={`font-medium ${
                  item.isComplete ? "text-blue-700" : "text-gray-700"
                }`}
              >
                {item.category}
              </p>
              <p className="text-sm text-gray-500">{item.description}</p>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  className="w-16 h-16 object-cover rounded mt-1 border"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Select categories that match your project requirements
        </p>
      </div>
    </div>
  );
};
