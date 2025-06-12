import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "../../axios";

type ChangeOrder = {
  _id: string;
  description: string;
  costAdjustment: number;
  timeAdjustmentDays: number;
  type: string;
  attachments: string[];
  requestedBy: string;
  createdAt: string;
};

interface Props {
  taskId: string;
  onViewChangeOrder?: (changeOrderId: string) => void;
}

const ChangeOrderCard: React.FC<Props> = ({ taskId, onViewChangeOrder }) => {
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);

  useEffect(() => {
    if (taskId) {
      axiosInstance
        .get(`/quote/v2/change-order/${taskId}`)
        .then((res) => setChangeOrders(res.data))
        .catch((err) => console.error("Failed to fetch change orders", err));
    }
  }, [taskId]);

  if (!changeOrders.length) return null;

  return (
    <div className="mt-4">
      <div className="text-sm font-medium text-gray-500 mb-1">Change Order</div>

      {changeOrders.map((co, index) => (
        <div
          key={co._id}
          className="bg-white p-4 rounded-md border border-gray-200 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900 mr-3">
                CO-{co._id?.substring(0, 6)}-{index + 1}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full capitalize bg-green-100 text-green-800">
                {co.status}
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              +${co.costAdjustment.toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-900 font-medium">Description</p>
              <p className="text-sm text-gray-600">{co.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Requested On</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(co.createdAt), "yyyy-MM-dd")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Timeline Impact</p>
                <p className="text-sm text-gray-900">
                  +{co.timeAdjustmentDays} days
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Requested By</p>
              <p className="text-sm text-gray-600">{co.requestedBy}</p>
            </div>

            {co.attachments.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Attachments</p>
                <ul className="space-y-2 text-sm">
                  {co.attachments.map((fileUrl, idx) => {
                    const isImage = fileUrl.match(
                      /\.(jpeg|jpg|png|gif|webp)$/i
                    );
                    const fileName = decodeURIComponent(
                      fileUrl.split("/").pop() || `File-${idx + 1}`
                    );

                    return (
                      <li key={idx} className="flex items-start gap-2">
                        {isImage ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-24 h-24 rounded border border-gray-200 overflow-hidden"
                          >
                            <img
                              src={fileUrl}
                              alt={`attachment-${idx}`}
                              className="object-cover w-full h-full"
                            />
                          </a>
                        ) : (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            📎 {fileName}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="pt-3 mt-3 border-t border-gray-200">
              <button
                onClick={() => onViewChangeOrder?.(co._id)}
                className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Change Order
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChangeOrderCard;
