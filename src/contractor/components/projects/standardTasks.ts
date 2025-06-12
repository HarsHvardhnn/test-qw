// Standard task templates for each project type
export const standardTasks = {
  "Interior Renovation & Remodeling": {
    "Kitchen Remodeling": [
      {
        title: "Initial Design & Planning",
        description: "Create detailed kitchen layout and design plans",
        timeframe: 1,
        timeframeUnit: "weeks"
      },
      {
        title: "Demolition & Removal",
        description: "Remove existing cabinets, countertops, and appliances",
        timeframe: 3,
        timeframeUnit: "days"
      },
      {
        title: "Plumbing Rough-In",
        description: "Update plumbing lines for sink, dishwasher, and refrigerator",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Electrical Rough-In",
        description: "Install new electrical lines for appliances and lighting",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Cabinet Installation",
        description: "Install new kitchen cabinets and hardware",
        timeframe: 5,
        timeframeUnit: "days"
      },
      {
        title: "Countertop Installation",
        description: "Install new countertops and backsplash",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Appliance Installation",
        description: "Install and connect new appliances",
        timeframe: 1,
        timeframeUnit: "days"
      },
      {
        title: "Final Touches & Cleanup",
        description: "Complete final details and thorough cleanup",
        timeframe: 1,
        timeframeUnit: "days"
      }
    ],
    "Bathroom Renovation": [
      {
        title: "Initial Design & Planning",
        description: "Create detailed bathroom layout and design plans",
        timeframe: 1,
        timeframeUnit: "weeks"
      },
      {
        title: "Demolition",
        description: "Remove existing fixtures, tiles, and vanity",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Plumbing Rough-In",
        description: "Update plumbing lines for new fixtures",
        timeframe: 3,
        timeframeUnit: "days"
      },
      {
        title: "Electrical Updates",
        description: "Install new electrical for lighting and outlets",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Tile Installation",
        description: "Install floor and wall tiles",
        timeframe: 4,
        timeframeUnit: "days"
      },
      {
        title: "Vanity & Fixture Installation",
        description: "Install new vanity, toilet, and fixtures",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Final Touches",
        description: "Complete finishing details and cleanup",
        timeframe: 1,
        timeframeUnit: "days"
      }
    ]
  },
  "Electrical & Smart Home Upgrades": {
    "General Electrical Work & Rewiring": [
      {
        title: "Initial Assessment",
        description: "Evaluate current electrical system and plan updates",
        timeframe: 1,
        timeframeUnit: "days"
      },
      {
        title: "Panel Upgrade",
        description: "Update electrical panel if necessary",
        timeframe: 1,
        timeframeUnit: "days"
      },
      {
        title: "Rewiring Work",
        description: "Install new wiring throughout the house",
        timeframe: 5,
        timeframeUnit: "days"
      },
      {
        title: "Fixture Installation",
        description: "Install new electrical fixtures and outlets",
        timeframe: 2,
        timeframeUnit: "days"
      },
      {
        title: "Testing & Inspection",
        description: "Test all new electrical work and prepare for inspection",
        timeframe: 1,
        timeframeUnit: "days"
      }
    ]
  }
};

// Add more standard tasks for other categories as needed

// Helper function to get standard tasks for a category and type
export const getStandardTasks = (category: string, type: string) => {
  return standardTasks[category as keyof typeof standardTasks]?.[type] || [];
};