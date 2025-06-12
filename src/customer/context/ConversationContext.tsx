import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface ConversationContextType {
  convo: string[];
  addConversation: (newConversation: string) => void;
  removeConversation: (index: number) => void;
  clearconvo: () => void;
}

// Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

// Provider component
export const ConversationProvider = ({ children }: { children: ReactNode }) => {
  const [convo, setconvo] = useState<string[]>([]);

  // Function to add a new conversation
  const addConversation = (newConversation: string) => {
    setconvo((prev) => [...prev, newConversation]);
  };

  // Function to remove a conversation by index
  const removeConversation = (index: number) => {
    setconvo((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to clear all convo
  const clearconvo = () => {
    setconvo([]);
  };

  return (
    <ConversationContext.Provider
      value={{ convo, addConversation, removeConversation, clearconvo }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use the conversation context
export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};
