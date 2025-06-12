import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { ContactsList } from './ContactsList';
import { ConversationArea } from './ConversationArea';
import { ContactInfo } from './ContactInfo';
import { EmptyConversation } from './EmptyConversation';
import { Contact, Message } from './types';
import { sampleContacts, conversations } from './data';

export const MessagesPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Filter contacts based on search term and role filter
  const filteredContacts = sampleContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || contact.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Load conversation when a contact is selected
  React.useEffect(() => {
    if (selectedContact) {
      // Check if we have a predefined conversation for this contact
      if (conversations[selectedContact.id as keyof typeof conversations]) {
        setMessages(conversations[selectedContact.id as keyof typeof conversations]);
      } else {
        // For other contacts, we would load their conversations from the backend
        // For now, just show a welcome message
        setMessages([
          {
            id: 'welcome',
            content: `This is the beginning of your conversation with ${selectedContact.name}.`,
            timestamp: 'Just now',
            sender: 'you',
            status: 'delivered'
          }
        ]);
      }
    }
  }, [selectedContact]);

  // Handle sending a message
  const handleSendMessage = (messageInput: string) => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      content: messageInput.trim(),
      timestamp: 'Just now',
      sender: 'you',
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate reply after a delay
    if (selectedContact.id === 'c1') {
      setTimeout(() => {
        const reply: Message = {
          id: `m${Date.now() + 1}`,
          content: "Thanks for the update. I'll get back to you shortly with more details.",
          timestamp: 'Just now',
          sender: 'them'
        };
        setMessages(prev => [...prev, reply]);
      }, 3000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex">
        {/* Contacts List - Fixed height with scrolling */}
        <ContactsList 
          contacts={filteredContacts}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          isHidden={false}
        />

        {/* Conversation Area */}
        {selectedContact ? (
          <ConversationArea 
            contact={selectedContact}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBackClick={() => setSelectedContact(null)}
            onInfoClick={() => setShowContactInfo(!showContactInfo)}
          />
        ) : (
          <EmptyConversation />
        )}

        {/* Contact Info Sidebar */}
        {showContactInfo && selectedContact && (
          <ContactInfo 
            contact={selectedContact}
            onClose={() => setShowContactInfo(false)}
          />
        )}
      </div>
    </div>
  );
};

// Import Search and Filter components
import { Search, Filter } from 'lucide-react';
import { ContactItem } from './ContactItem';