/**
 * Utility function to remove specific items from localStorage related to user session and navigation
 * @returns {boolean} - Returns true if operation succeeds, false otherwise
 */
export const clearUserSessionData = () => {
  const itemsToRemove = [
    "csx-redirect",
    "token",
    "user",
    "verificationLink",
    "verificationType",
    "project",
    "saved-path",
  ];

  console.log("Clearing user session data from localStorage...");
  try {
    // Remove each item individually
    itemsToRemove.forEach((item) => {
      localStorage.removeItem(item);
    });

    console.log("Successfully cleared user session data from localStorage");
    return true;
  } catch (error) {
    console.error("Error clearing localStorage items:", error);
    return false;
  }
};

// You can also export a version that excludes savedAccounts if needed
export const clearUserSessionDataKeepAccounts = () => {
  const itemsToRemove = [
    "csx-redirect",
    "token",
    "user",
    "verificationLink",
    "verificationType",
    "project",
    "saved-path",
  ];

  try {
    itemsToRemove.forEach((item) => {
      localStorage.removeItem(item);
    });

    console.log(
      "Successfully cleared user session data while preserving saved accounts"
    );
    return true;
  } catch (error) {
    console.error("Error clearing localStorage items:", error);
    return false;
  }
};
