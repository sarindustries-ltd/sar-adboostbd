// In-memory database to simulate PostgreSQL/Prisma for the prototype
// In production, this would be handled by Prisma ORM with proper Decimal/Integer types for BDT (Paisa)

export const db = {
  settings: {
    usdToBdtRate: 120,
    feePercentage: 0.15,
  },
  masterWallet: {
    totalBdtCollected: 1250000, // Stored as Integer (e.g., Paisa in production to avoid floating point issues)
    totalUsdSpent: 8500,
  },
  campaigns: [
    { 
      id: "CMP-1030", 
      pageName: "Gadget BD", 
      budgetUsd: 100, 
      status: "pending", 
      userBdtCharged: 13800, // (100 * 120) + 15% fee
      createdAt: new Date(Date.now() - 3600000).toISOString() 
    },
    { 
      id: "CMP-1031", 
      pageName: "Style Dhaka", 
      budgetUsd: 50, 
      status: "pending", 
      userBdtCharged: 6900, 
      createdAt: new Date(Date.now() - 7200000).toISOString() 
    },
    { 
      id: "CMP-1029", 
      pageName: "Tech Store BD", 
      budgetUsd: 200, 
      status: "active", 
      userBdtCharged: 27600, 
      createdAt: new Date(Date.now() - 86400000).toISOString() 
    },
  ]
};
