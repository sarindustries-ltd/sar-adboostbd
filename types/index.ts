export interface Campaign {
  id: string;
  pageName: string;
  budgetUsd: number;
  spentUsd: number;
  status: "pending" | "active" | "completed" | "failed";
  userBdtCharged: number;
  createdAt: string;
}

export interface Page {
  id: string;
  name: string;
}

export interface Settings {
  usdToBdtRate: number;
  feePercentage: number;
}

export interface MasterWallet {
  totalBdtCollected: number;
  totalUsdSpent: number;
}

export interface UserWallet {
  balanceBdt: number;
}
