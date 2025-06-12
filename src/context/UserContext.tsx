import React, { createContext, useContext, useState } from "react";
import axiosInstance from "../axios";

interface UserContextType {
  customerName: string;
  setCustomerName: (name: string) => void;
  contractorName: string;
  setContractorName: (name: string) => void;

  userProfilePicture: string;
  businessProfilePicture: string;
  setUserProfilePicture: (url: string) => void;
  setBusinessProfilePicture: (url: string) => void;
  fetchUserProfilePicture: () => Promise<void>;
  fetchBusinessProfilePicture: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [contractorName, setContractorName] = useState("J9 Construction, LLC");

  const [userProfilePicture, setUserProfilePicture] = useState<string>("");
  const [businessProfilePicture, setBusinessProfilePicture] =
    useState<string>("");

  const fetchUserProfilePicture = async () => {
    try {
      const res = await axiosInstance.get(
        `/auth/v2/user/profile-picture/`
      );
      if (res.data?.url) {
        setUserProfilePicture(res.data.url);
      }
    } catch (error) {
      console.error("Failed to fetch user profile picture:", error);
    }
  };

  const fetchBusinessProfilePicture = async () => {
    try {
      const res = await axiosInstance.get(
        `/auth/v2/business/profile-picture/`
      );
      if (res.data?.url) {
        setBusinessProfilePicture(res.data.url);
      }
    } catch (error) {
      console.error("Failed to fetch business profile picture:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        customerName,
        setCustomerName,
        contractorName,
        setContractorName,

        setUserProfilePicture,
        setBusinessProfilePicture,
        userProfilePicture,
        businessProfilePicture,
        fetchUserProfilePicture,
        fetchBusinessProfilePicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
