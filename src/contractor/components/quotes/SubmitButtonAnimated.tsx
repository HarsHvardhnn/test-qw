import React, { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

const AnimatedSubmitButton = ({
  status,
  handleSubmitForApproval,
  tasks,
  hasTasksWithMissingPayment,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    console.log('status',hasTasksWithMissingPayment(tasks))
      // return;
    if (hasTasksWithMissingPayment(tasks)) {
      toast.error("A task is missing payment schedule");
      return;
    }


    if (status !== "in-progress") return;

    setIsAnimating(true);

    // Wait for animation to complete before executing action
    setTimeout(() => {
      handleSubmitForApproval();
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }, 1000);
  };

  return (
    <button
      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center relative ${
        status === "in-progress"
          ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          : "bg-gray-500 hover:bg-gray-700 cursor-not-allowed"
      }`}
      onClick={handleClick}
      disabled={status !== "in-progress"}
      style={{ minWidth: "180px", overflow: "visible" }}
    >
      {/* Button text */}
      <span
        className="flex items-center justify-center transition-all duration-300"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? "translateY(20px)" : "translateY(0)",
        }}
      >
        {status === "in-progress"
          ? "Submit for Approval"
          : "Submitted for approval"}
      </span>

      {/* Paper plane animation */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        <Send
          size={24}
          color="white"
          strokeWidth={2.5}
          style={{
            position: "absolute",
            transform: isAnimating
              ? "translateX(100px) translateY(-20px) rotate(-10deg)"
              : "translateX(0) translateY(0) rotate(0deg)",
            opacity: isAnimating ? 1 : 0,
            transition: "all 1s cubic-bezier(0.1, 0.8, 0.2, 1.2)",
            zIndex: 10,
          }}
        />
      </div>

      {/* Flash effect when button is clicked */}
      <div
        className="absolute inset-0 bg-white rounded-lg"
        style={{
          opacity: isAnimating ? 0.3 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </button>
  );
};

export default AnimatedSubmitButton;