  const RejectModal = ({showRejectModal,activateProject,reviewMessage,setReviewMessage,projectId,setShowRejectModal}) => {
    if (!showRejectModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-black">
            Reject Project
          </h3>
          <p className="text-gray-600 mb-4">
            Please provide a reason for rejection:
          </p>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-32"
            value={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
            placeholder="Enter feedback for the project rejection..."
          />

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() =>
                activateProject(projectId, "rejected", reviewMessage)
              }
              disabled={!reviewMessage.trim()}
            >
              Submit Rejection
            </button>
          </div>
        </div>
      </div>
    );
};
  

export default  RejectModal;