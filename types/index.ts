export interface FarmUpdate {
  id: string;
  timestamp: string;
  type: 'progress' | 'receipt' | 'weather' | 'verification';
  title: string;
  description: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  workerId?: string;
}

export interface Farm {
  id: string;
  name: string;
  farmerId: string;
  farmerName: string;
  location: string;
  country: string;
  type: 'crops' | 'livestock' | 'aquaculture' | 'cash_crops';
  cropType: string;
  sizeAcres: number;
  targetCapital: number;
  fundedCapital: number;
  unitPrice: number; // in KES
  totalUnits: number;
  fundedUnits: number;
  yieldHistory: string;
  farmerCreditScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  expectedROI: number; // e.g. 15 for 15%
  durationMonths: number;
  status: 'funding' | 'active' | 'harvesting' | 'completed';
  description: string;
  imageUrl: string;
  locationCoords: { lat: number; lng: number };
  updates: FarmUpdate[];
  workerAssigned?: string | null;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'flagged';
}

export interface Investment {
  id: string;
  farmId: string;
  farmName: string;
  investorId: string;
  units: number;
  amount: number; // in KES
  expectedReturn: number; // in KES
  date: string;
  status: 'active' | 'payout_pending' | 'completed' | 'disputed';
  chamaId?: string;
}

export interface ChamaMember {
  userId: string;
  name: string;
  contribution: number;
  role: 'admin' | 'member';
}

export interface Chama {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  members: ChamaMember[];
  totalBalance: number;
  activeInvestmentsCount: number;
  description: string;
}

export interface WorkerReport {
  id: string;
  farmId: string;
  farmName: string;
  workerId: string;
  workerName: string;
  visitDate: string;
  status: 'passed' | 'flagged';
  workerNotes: string;
  rating: number; // 1 to 5
  geoTaggedPhotoUrl?: string;
  anomalyDetected: boolean;
}

export interface CreditScoreProfile {
  userId: string;
  userRole: 'farmer' | 'investor';
  score: number; // out of 100
  breakdown: {
    label: string;
    value: string | number;
    impact: 'positive' | 'neutral' | 'negative';
  }[];
  history: { date: string; score: number; reason: string }[];
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'payout' | 'fee';
  amount: number;
  currency: 'KES' | 'USD';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export interface Notification {
  id: string;
  userId: string; // role or "all" or individualId
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert' | 'payout';
  date: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userRole: 'farmer' | 'investor' | 'worker' | 'admin';
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface PlatformStats {
  totalCapitalInvested: number;
  activeFarmsCount: number;
  averageROI: number;
  payoutsCompleted: number;
  defaultRate: number; // e.g. 0%
}
