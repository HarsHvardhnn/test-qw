import { Contact, Message } from './types';

// Sample contacts data
export const sampleContacts: Contact[] = [
  {
    id: 'c1',
    name: 'John Smith',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    company: 'J9 Construction',
    projectId: 1,
    projectName: 'Smith Home Remodel',
    lastMessage: {
      content: 'We completed the foundation work and are ready for inspection.',
      timestamp: '10:30 AM',
      isRead: false,
      sender: 'them'
    },
    online: true
  },
  {
    id: 'c2',
    name: 'Sarah Johnson',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
    projectId: 1,
    projectName: 'Smith Home Remodel',
    lastMessage: {
      content: 'Thank you for approving the payment so quickly!',
      timestamp: 'Yesterday',
      isRead: true,
      sender: 'them'
    }
  },
  {
    id: 'c3',
    name: 'Michael Chen',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    company: 'Modern Designs Inc.',
    projectId: 2,
    projectName: 'Johnson Kitchen Renovation',
    lastMessage: {
      content: "I've sent the inspection request for the cabinet installation.",
      timestamp: 'Yesterday',
      isRead: true,
      sender: 'them'
    }
  },
  {
    id: 'c4',
    name: 'Emily Davis',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80',
    company: 'Luxury Bath Solutions',
    projectId: 3,
    projectName: 'Davis Bathroom Remodel',
    lastMessage: {
      content: 'We need to discuss the plumbing inspection that failed.',
      timestamp: '2 days ago',
      isRead: true,
      sender: 'them'
    }
  },
  {
    id: 'c5',
    name: 'David Wilson',
    role: 'inspector',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    company: 'City Building Department',
    projectId: 4,
    projectName: 'Wilson Basement Finishing',
    lastMessage: {
      content: "I've scheduled the framing inspection for next Tuesday at 10 AM.",
      timestamp: '3 days ago',
      isRead: true,
      sender: 'them'
    }
  },
  {
    id: 'c6',
    name: 'Jennifer Wilson',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    projectId: 4,
    projectName: 'Wilson Basement Finishing',
    lastMessage: {
      content: 'When will the next payment be released?',
      timestamp: '1 week ago',
      isRead: true,
      sender: 'them'
    }
  },
  {
    id: 'c7',
    name: 'Robert Taylor',
    role: 'inspector',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80',
    company: 'County Inspection Services',
    projectId: 2,
    projectName: 'Johnson Kitchen Renovation',
    lastMessage: {
      content: 'The electrical inspection is scheduled for tomorrow at 2 PM.',
      timestamp: '4 hours ago',
      isRead: false,
      sender: 'them'
    },
    online: true
  },
  {
    id: 'c8',
    name: 'Lisa Thompson',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80',
    company: 'Superior Roofing Co.',
    projectId: 5,
    projectName: 'Thompson Roof Replacement',
    lastMessage: {
      content: "We've completed the tear-off phase and are ready for the underlayment inspection.",
      timestamp: 'Yesterday',
      isRead: false,
      sender: 'them'
    }
  },
  {
    id: 'c9',
    name: 'James Wilson',
    role: 'contractor',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80',
    company: 'Basement Experts LLC',
    projectId: 4,
    projectName: 'Wilson Basement Finishing',
    lastMessage: {
      content: "The framing is complete and we're ready for inspection before drywall installation.",
      timestamp: '5 hours ago',
      isRead: false,
      sender: 'them'
    },
    online: true
  },
  {
    id: 'c10',
    name: 'Maria Garcia',
    role: 'inspector',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80',
    company: 'City Building Department',
    projectId: 3,
    projectName: 'Davis Bathroom Remodel',
    lastMessage: {
      content: "I've reviewed the plumbing corrections. They can schedule a re-inspection when ready.",
      timestamp: 'Today',
      isRead: false,
      sender: 'them'
    },
    online: true
  }
];

// Sample conversation data for John Smith
export const johnSmithConversation: Message[] = [
  {
    id: 'm1',
    content: "Good morning! We've completed the foundation work for the Smith Home Remodel project and are ready for inspection.",
    timestamp: '10:30 AM',
    sender: 'them'
  },
  {
    id: 'm2',
    content: "That's great news, John. I'll schedule an inspection for tomorrow morning. Is 9 AM good for you?",
    timestamp: '10:45 AM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'm3',
    content: "Yes, 9 AM works perfectly. I'll make sure everything is ready for inspection.",
    timestamp: '10:50 AM',
    sender: 'them'
  },
  {
    id: 'm4',
    content: 'By the way, here are some photos of the completed foundation work.',
    timestamp: '10:52 AM',
    sender: 'them',
    attachments: [
      {
        id: 'a1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80',
        name: 'foundation_front.jpg'
      },
      {
        id: 'a2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80',
        name: 'foundation_side.jpg'
      }
    ]
  },
  {
    id: 'm5',
    content: "These look good. I've also attached the inspection checklist so you know what our inspector will be looking for.",
    timestamp: '11:05 AM',
    sender: 'you',
    status: 'read',
    attachments: [
      {
        id: 'a3',
        type: 'document',
        url: '#',
        name: 'Foundation_Inspection_Checklist.pdf',
        size: '245 KB'
      }
    ]
  },
  {
    id: 'm6',
    content: "Perfect, thank you! We'll make sure everything meets the requirements.",
    timestamp: '11:10 AM',
    sender: 'them'
  },
  {
    id: 'm7',
    content: 'We completed the foundation work and are ready for inspection.',
    timestamp: '10:30 AM',
    sender: 'them'
  }
];

// Sample conversation data for Robert Taylor (Inspector)
export const robertTaylorConversation: Message[] = [
  {
    id: 'rt1',
    content: "Hello, I'm reaching out regarding the Johnson Kitchen Renovation project. I've been assigned to conduct the electrical inspection.",
    timestamp: 'Yesterday, 2:15 PM',
    sender: 'them'
  },
  {
    id: 'rt2',
    content: "Hi Robert, thanks for reaching out. When would you be available to conduct the inspection?",
    timestamp: 'Yesterday, 2:30 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'rt3',
    content: "I have availability tomorrow at 2 PM or Thursday at 10 AM. Which would work better for the contractor?",
    timestamp: 'Yesterday, 2:45 PM',
    sender: 'them'
  },
  {
    id: 'rt4',
    content: "Let's schedule for tomorrow at 2 PM. I'll inform the contractor to ensure someone is on site.",
    timestamp: 'Yesterday, 3:00 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'rt5',
    content: "Perfect. I've added it to my schedule. Here's the inspection checklist for electrical work that the contractor should review before I arrive.",
    timestamp: 'Yesterday, 3:10 PM',
    sender: 'them',
    attachments: [
      {
        id: 'rt-a1',
        type: 'document',
        url: '#',
        name: 'Electrical_Inspection_Checklist.pdf',
        size: '320 KB'
      }
    ]
  },
  {
    id: 'rt6',
    content: "Thank you. I've forwarded the checklist to the contractor.",
    timestamp: 'Yesterday, 3:25 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'rt7',
    content: "The electrical inspection is scheduled for tomorrow at 2 PM. Please ensure all junction boxes are accessible and labeled.",
    timestamp: '4 hours ago',
    sender: 'them'
  }
];

// Sample conversation data for Lisa Thompson (Contractor)
export const lisaThompsonConversation: Message[] = [
  {
    id: 'lt1',
    content: "Good afternoon. I wanted to update you on the Thompson Roof Replacement project. We've completed the tear-off phase and are ready for the underlayment inspection before proceeding with the shingle installation.",
    timestamp: '2 days ago, 1:20 PM',
    sender: 'them'
  },
  {
    id: 'lt2',
    content: "Hi Lisa, thanks for the update. How does the existing decking look? Any areas of concern?",
    timestamp: '2 days ago, 1:45 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'lt3',
    content: "We found some water damage on the northwest corner that will require replacing about 4x8 feet of decking. I've documented it here:",
    timestamp: '2 days ago, 2:00 PM',
    sender: 'them',
    attachments: [
      {
        id: 'lt-a1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1632759145351-1d170f2a9ddd?auto=format&fit=crop&q=80',
        name: 'roof_damage.jpg'
      }
    ]
  },
  {
    id: 'lt4',
    content: "I see. That's more extensive than we anticipated. Can you provide a quote for the additional work?",
    timestamp: '2 days ago, 2:15 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'lt5',
    content: "Yes, I've prepared a change order for the additional decking replacement. The cost will be $850 including materials and labor.",
    timestamp: '2 days ago, 2:30 PM',
    sender: 'them',
    attachments: [
      {
        id: 'lt-a2',
        type: 'document',
        url: '#',
        name: 'Change_Order_001.pdf',
        size: '180 KB'
      }
    ]
  },
  {
    id: 'lt6',
    content: "The change order looks good. I've approved it and added it to the project total. Please proceed with the repairs.",
    timestamp: '2 days ago, 3:00 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'lt7',
    content: "Thank you for the quick approval. We've completed the decking repairs and installed the ice and water shield. Here's the current status:",
    timestamp: 'Yesterday, 10:15 AM',
    sender: 'them',
    attachments: [
      {
        id: 'lt-a3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80',
        name: 'roof_progress.jpg'
      }
    ]
  },
  {
    id: 'lt8',
    content: "We've completed the tear-off phase and are ready for the underlayment inspection.",
    timestamp: 'Yesterday, 4:30 PM',
    sender: 'them'
  }
];

// Sample conversation data for Maria Garcia (Inspector)
export const mariaGarciaConversation: Message[] = [
  {
    id: 'mg1',
    content: "Hello, I conducted the plumbing inspection for the Davis Bathroom Remodel today and unfortunately, there are several issues that need to be addressed before approval.",
    timestamp: '3 days ago, 3:45 PM',
    sender: 'them'
  },
  {
    id: 'mg2',
    content: "Hi Maria, I'm sorry to hear that. Can you provide details on the issues found?",
    timestamp: '3 days ago, 4:00 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'mg3',
    content: "Yes, I've documented the following issues: 1) Improper venting configuration for the shower drain, 2) Missing pipe supports within 12 inches of fixtures, and 3) Insufficient slope on the drain line (less than required 1/4\" per foot). Here are some photos:",
    timestamp: '3 days ago, 4:15 PM',
    sender: 'them',
    attachments: [
      {
        id: 'mg-a1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
        name: 'plumbing_issue1.jpg'
      },
      {
        id: 'mg-a2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80',
        name: 'plumbing_issue2.jpg'
      }
    ]
  },
  {
    id: 'mg4',
    content: "I've also attached the full inspection report with detailed explanations and code references.",
    timestamp: '3 days ago, 4:20 PM',
    sender: 'them',
    attachments: [
      {
        id: 'mg-a3',
        type: 'document',
        url: '#',
        name: 'Plumbing_Inspection_Report.pdf',
        size: '450 KB'
      }
    ]
  },
  {
    id: 'mg5',
    content: "Thank you for the detailed report. I'll contact the contractor immediately to address these issues. How soon can we schedule a re-inspection once the corrections are made?",
    timestamp: '3 days ago, 4:45 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'mg6',
    content: "Once the contractor confirms the corrections are complete, they can request a re-inspection through the online portal. I typically have availability within 48 hours of request.",
    timestamp: '3 days ago, 5:00 PM',
    sender: 'them'
  },
  {
    id: 'mg7',
    content: "The contractor has informed me that they've made all the necessary corrections. They've submitted a re-inspection request for tomorrow morning. Would that work with your schedule?",
    timestamp: 'Yesterday, 2:30 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'mg8',
    content: "I've reviewed the plumbing corrections. They can schedule a re-inspection when ready.",
    timestamp: 'Today, 9:15 AM',
    sender: 'them'
  }
];

// Sample conversation data for James Wilson (Contractor)
export const jamesWilsonConversation: Message[] = [
  {
    id: 'jw1',
    content: "Good morning. I wanted to update you on the Wilson Basement Finishing project. We've completed the framing phase according to the approved plans.",
    timestamp: 'Yesterday, 9:30 AM',
    sender: 'them'
  },
  {
    id: 'jw2',
    content: "That's great news, James. Did you encounter any issues with the load-bearing wall modifications?",
    timestamp: 'Yesterday, 10:00 AM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'jw3',
    content: "No issues with the load-bearing modifications. We installed the LVL beam as specified by the structural engineer. Here are some photos of the completed framing:",
    timestamp: 'Yesterday, 10:15 AM',
    sender: 'them',
    attachments: [
      {
        id: 'jw-a1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&q=80',
        name: 'basement_framing1.jpg'
      },
      {
        id: 'jw-a2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&q=80',
        name: 'basement_framing2.jpg'
      }
    ]
  },
  {
    id: 'jw4',
    content: "The framing looks good. Have you completed the rough electrical and plumbing as well?",
    timestamp: 'Yesterday, 10:45 AM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'jw5',
    content: "Yes, both rough electrical and plumbing are complete. We've also installed the HVAC ductwork. Everything is ready for inspection before we close up the walls.",
    timestamp: 'Yesterday, 11:00 AM',
    sender: 'them'
  },
  {
    id: 'jw6',
    content: "Perfect. I'll schedule the framing, electrical, and plumbing inspections. Are you available this Thursday?",
    timestamp: 'Yesterday, 11:15 AM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'jw7',
    content: "Thursday works well for us. Morning would be preferable if possible.",
    timestamp: 'Yesterday, 11:30 AM',
    sender: 'them'
  },
  {
    id: 'jw8',
    content: "I've scheduled all three inspections for Thursday at 10 AM. Please ensure someone is on site to provide access.",
    timestamp: 'Yesterday, 1:45 PM',
    sender: 'you',
    status: 'read'
  },
  {
    id: 'jw9',
    content: "The framing is complete and we're ready for inspection before drywall installation.",
    timestamp: '5 hours ago',
    sender: 'them'
  }
];

// Export all conversations
export const conversations = {
  'c1': johnSmithConversation,
  'c5': robertTaylorConversation,
  'c8': lisaThompsonConversation,
  'c10': mariaGarciaConversation,
  'c9': jamesWilsonConversation
};