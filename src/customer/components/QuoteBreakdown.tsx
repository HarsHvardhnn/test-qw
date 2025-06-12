import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Save,
  Hammer,
  CheckCircle,
} from "lucide-react";
import { useQuote } from "../context/QuoteContext";
import axiosInstance from "../../axios";
import { useLoader } from "../../context/LoaderContext";
import { toast } from "react-toastify";
import RejectModal from "./RejectModal";

export const QuoteBreakdown: React.FC = ({ projectId }) => {
  const { quote, fetchQuote } = useQuote();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    "products"
  );
  const { showLoader, hideLoader } = useLoader();
  const [isSaving, setIsSaving] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [reviewMessage, setReviewMessage] = React.useState("");
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [submitted,setSubmitted]=useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Confetti animation function
  const createConfetti = () => {
    const confettiContainer = document.createElement("div");
    confettiContainer.style.position = "fixed";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100%";
    confettiContainer.style.height = "100%";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.zIndex = "9999";
    document.body.appendChild(confettiContainer);

    const colors = [
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF00FF",
      "#00FFFF",
      "#FFA500",
      "#32CD32",
    ];

    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement("div");
      const size = Math.random() * 10 + 5;

      confetti.style.position = "absolute";
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      confetti.style.opacity = "0.8";

      // Start from center of the screen
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;

      confetti.style.left = `${startX}px`;
      confetti.style.top = `${startY}px`;

      // Animation properties
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 20 + 10;
      const velocityX = Math.cos(angle) * velocity;
      const velocityY = Math.sin(angle) * velocity - 10;
      const rotation = (Math.random() - 0.5) * 720;

      // Add to container
      confettiContainer.appendChild(confetti);

      // Animate confetti
      let posX = startX;
      let posY = startY;
      let rotationAngle = 0;
      let opacity = 0.8;
      const gravity = 0.5;
      let velocityYWithGravity = velocityY;

      const animateConfetti = () => {
        velocityYWithGravity += gravity;
        posX += velocityX;
        posY += velocityYWithGravity;
        rotationAngle += rotation / 20;
        opacity -= 0.008;

        confetti.style.transform = `translate(${posX - startX}px, ${
          posY - startY
        }px) rotate(${rotationAngle}deg)`;
        confetti.style.opacity = opacity.toString();

        if (opacity > 0 && posY < window.innerHeight + 100) {
          requestAnimationFrame(animateConfetti);
        } else {
          confetti.remove();
          // Remove container when all confetti are gone
          if (confettiContainer.childElementCount === 0) {
            confettiContainer.remove();
          }
        }
      };

      // Start animation with a small delay for each confetti
      setTimeout(
        () => requestAnimationFrame(animateConfetti),
        Math.random() * 500
      );
    }
  };

  const downloadContractPDF = async (quoteId) => {
    try {
      const response = await axiosInstance.get(
        `/generate/generate-contract/${quoteId}`,
        {
          responseType: "blob", // Important: tells Axios to expect binary
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `contract_${quoteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading contract PDF:", error);
      alert("Failed to download contract.");
    }
  };

  function formatDate(date: string, format = "YYYY-MM-DD") {
    const d = new Date(date);
    if (isNaN(d)) return "Invalid Date";

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(d);

    if (format === "YYYY-MM-DD") {
      return formattedDate.split("/").reverse().join("-");
    } else if (format === "DD-MM-YYYY") {
      return formattedDate.split("/").join("-");
    } else if (format === "MM/DD/YYYY") {
      return formattedDate.split("/").join("/");
    }

    return d.toDateString(); // Default fallback
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate totals
  const productsTotal = Array.isArray(quote?.products)
    ? quote.products.reduce((sum, product) => {
        const price = product?.item?.price || 0;
        const quantity = product?.quantity || 1;
        return sum + price * quantity;
      }, 0)
    : 0;

  const materialsTotal = Array.isArray(quote?.materials)
    ? quote.materials.reduce((sum, product) => {
        const price = product?.item?.price || 0;
        const quantity = product?.quantity || 1;
        return sum + price * quantity;
      }, 0)
    : 0;
  const laborTotal = quote?.totalLaborCost || 0;
  const grandTotal = productsTotal + materialsTotal + laborTotal;

  const handleDelete = async (productId: string) => {
    if (!quote?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(
        `/quote/v2/${quote._id}/products/${productId}`
      );

      if (response.status === 200) {
        fetchQuote();
      } else {
        alert(response.data.error || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  const activateProject = async (
    projectId: string,
    status: string,
    reviewMessage: string = ""
  ) => {
    try {
      showLoader();
      const payload = {
        status: status,
      };

      if (reviewMessage) {
        payload.reviewMessage = reviewMessage;
      }

      const res = await axiosInstance.put(
        `/quote/v2/projects/${projectId}/status`,
        payload
      );

      setSubmitted(true);
      hideLoader();

      if (status === "active") {
        // Show the approval popup
        setShowApprovalPopup(true);

        // After 2.5 seconds, hide popup and show confetti
        setTimeout(() => {
          setShowApprovalPopup(false);
          createConfetti();
          toast.success("Project approved successfully!");
        }, 2500);
      } else {
        toast.success("Project rejected successfully!");
      }

      console.log(`✅ Project ${status}:`, res.data.project);
      return res.data.project;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Action failed";
      console.error("❌", errorMsg);
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      hideLoader();
      setShowRejectModal(false);
      setReviewMessage("");
    }
  };

  const handleDeleteMaterial = async (productId) => {
    if (!quote?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axiosInstance.delete(
        `/quote/v2/${quote._id}/materials/${productId}`
      );

      if (response.status === 200) {
        fetchQuote();
      } else {
        alert(response.data.error || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    }
  };

  // Handler to save quote
  const handleSaveQuote = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/quote/v2", {
        quoteNumber: quote?.quoteNumber,
        products: quote?.products.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          category: p.category,
          price: p.price,
          image: p.image,
          quantity: p.quantity || 1,
        })),
        laborCost: laborTotal,
        totalCost: grandTotal,
        notes: quote?.notes || "",
      });
      alert("Quote saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save quote.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {/* Approval Popup */}
      {showApprovalPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-xl transform transition-all duration-300 max-w-md w-full animate-bounce">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Quote Approved!
              </h2>
              <p className="text-gray-600 mb-4">
                Project has been successfully activated.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Quote Breakdown</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => {
              downloadContractPDF(projectId);
            }}
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Grand Total */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-blue-700">Total Project Cost</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(grandTotal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Quote id: {quote?.quoteNumber}
            </p>
            <p className="text-sm text-gray-500">
              Date: {formatDate(quote?.date)}{" "}
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {quote?.products.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <div
            className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("products")}
          >
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Products</h3>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-3">
                {formatCurrency(productsTotal)}
              </span>
              {expandedSection === "products" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedSection === "products" && (
            <div className="p-4">
              {quote?.products.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src={product.item.imageUrl}
                      alt={product.item.itemName}
                      className="w-12 h-12 rounded-lg bg-gray-100 mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {product.item.itemName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.item.category.categoryName} -{" "}
                        {product.item.brand?.brandName || "brand"}
                      </p>
                      <span className="text-xs text-blue-600">
                        Quantity: {product.quantity || 1} ×{" "}
                        {formatCurrency(product.item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span>
                      {formatCurrency(
                        product.item.price * (product.quantity || 1)
                      )}
                    </span>
                    <button
                      onClick={() => handleDelete(product.item._id)}
                      style={{
                        color: "red",
                        transition: "color 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "darkred")}
                      onMouseLeave={(e) => (e.target.style.color = "red")}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials Section */}
      {quote?.materials.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
          <div
            className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("materials")}
          >
            <div className="flex items-center">
              <Hammer className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-900">
                {quote?.combinedCosts ? "Materials & Labor" : "Materials"}
              </h3>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-3">
                {formatCurrency(
                  quote.combinedCosts
                    ? materialsTotal + laborTotal
                    : materialsTotal
                )}
              </span>
              {expandedSection === "materials" ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {expandedSection === "materials" && (
            <div className="p-4">
              {quote?.materials.map((material) => (
                <div
                  key={material.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src={material.item.imageUrl}
                      alt={material.item.itemName}
                      className="w-12 h-12 rounded-lg bg-gray-100 mr-3 object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {material.item.itemName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {material.item.category.categoryName} -{" "}
                        {material.item.brand?.brandName || "brand"}
                      </p>
                      {!quote.combinedCosts && (
                        <span className="text-xs text-green-600">
                          Quantity: {material.quantity || 1} ×{" "}
                          {formatCurrency(material.item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {!quote.combinedCosts && (
                      <span>
                        {formatCurrency(
                          material.item.price * (material.quantity || 1)
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Labor row when costs are combined */}
              {quote.combinedCosts && laborTotal > 0 && (
                <div className="flex justify-between items-center py-2 mt-2 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-yellow-50 mr-3 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Labor</p>
                      <p className="text-sm text-gray-500">
                        Professional services
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Labor Section - only show when NOT combined */}
      {!quote?.combinedCosts && laborTotal > 0 && (
        <div className="border border-gray-200 rounded-lg bg-gray-50 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-gray-900">Labor</h3>
          </div>
          <span className="font-medium text-gray-900">
            {formatCurrency(laborTotal)}
          </span>
        </div>
      )}

      {/* Notes */}
      {quote?.notes !== undefined && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-700">
            {quote?.notes || "No additional notes."}
          </p>
        </div>
      )}

      {quote?.projectStatus === "approval-pending" && (
        <div className="mt-6 flex gap-4">
          {!submitted && (
            <button
              className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition"
              onClick={() => setShowRejectModal(true)}
            >
              Reject
            </button>
          )}
          <button
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => activateProject(projectId, "active")}
          >
            {submitted ? "Approved" : "Approve"}
          </button>
        </div>
      )}

      {quote?.projectStatus == "active" && (
        <button
          className="w-full bg-gray-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition cursor-not-allowed"
          disabled
        >
          Quote Approved
        </button>
      )}

      {/* Render the Rejection Modal */}
      <RejectModal
        showRejectModal={showRejectModal}
        activateProject={activateProject}
        reviewMessage={reviewMessage}
        setReviewMessage={setReviewMessage}
        setShowRejectModal={setShowRejectModal}
        projectId={projectId}
      />
    </div>
  );
};
