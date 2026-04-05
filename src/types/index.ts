export type CardStatus = "Active" | "Inactive" | "Pending" | "Blocked";

export interface Card {
  id: string;
  cardNumber: string;
  projectId: string;
  projectName: string;
  status: CardStatus;
  userId?: string;
  userName?: string;
  issuedAt: string;
  lastUsedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "Draft";
  totalCards: number;
  deployedCards: number;
  startDate: string;
  bannerUrl: string;
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  role: "Operator" | "Supervisor";
  status: "Active" | "Inactive";
  cardsDistributed: number;
  avatarUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cardId?: string;
  status: "Active" | "Pending";
  joinedAt: string;
}

export interface POSDevice {
  id: string;
  terminalId: string;
  location: string;
  status: "Online" | "Offline" | "Maintenance";
  lastPing: string;
  totalTransactions: number;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  cardId: string;
  amount: number;
  timestamp: string;
  location: string;
  status: "Success" | "Failed";
}

export type ViewType = "dashboard" | "cards" | "projects" | "deployment" | "operators" | "users" | "roles" | "reporting" | "pos";