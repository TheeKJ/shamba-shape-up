'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  Shield,
  Users,
  CheckCircle,
  TrendingUp,
  Wallet,
  MapPin,
  Activity,
  FileText,
  Plus,
  Search,
  Sparkles,
  AlertTriangle,
  Check,
  DollarSign,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  Bell,
  CheckSquare,
  Lock,
  UserCheck,
  Star,
  Info
} from 'lucide-react';

import { Farm, FarmUpdate, Investment, Chama, WorkerReport, CreditScoreProfile, Notification, 
  ActivityLog } from '@/types';
import {
  INITIAL_FARMS,
  INITIAL_CHAMAS,
  INITIAL_REPORTS,
  INITIAL_CREDIT_SCORES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_STATS
} from '@/lib/data';

let idCounter = 1;

function generateUniqueId(prefix: string): string {
  idCounter++;
  const randomPart = Math.floor(Math.random() * 89999 + 10000);
  return `${prefix}-${idCounter}-${randomPart}-${Date.now()}`;
}

function getTimestampString(): string {
  return new Date().toISOString();
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getRandomSeed(): number {
  return Math.floor(Math.random() * 10);
}

export default function ShambaPlatform() {
  // --- Persistent State Handlers (Sync with localStorage) ---
  const [farms, setFarms] = React.useState<Farm[]>([]);
  const [chamas, setChamas] = React.useState<Chama[]>([]);
  const [reports, setReports] = React.useState<WorkerReport[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [logs, setLogs] = React.useState<ActivityLog[]>([]);
  const [walletBalance, setWalletBalance] = React.useState<number>(350000); // KES Currency
  const [investorScore, setInvestorScore] = React.useState<number>(88);
  const [investments, setInvestments] = React.useState<Investment[]>([
    {
      id: 'inv-seed-1',
      farmId: 'farm-2',
      farmName: 'Lake Victoria Tilapia Aquacages',
      investorId: 'investor-joel',
      units: 10,
      amount: 50000,
      expectedReturn: 61000,
      date: '2026-05-20',
      status: 'active'
    },
    {
      id: 'inv-seed-2',
      farmId: 'farm-4',
      farmName: 'Naivasha Hydroponic Smart-Tomato Greenhouses',
      investorId: 'investor-joel',
      units: 4,
      amount: 20000,
      expectedReturn: 24000,
      date: '2026-05-28',
      status: 'active'
    }
  ]);

  // Initializing state
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const cachedFarms = localStorage.getItem('shamba_farms');
      const cachedChamas = localStorage.getItem('shamba_chamas');
      const cachedReports = localStorage.getItem('shamba_reports');
      const cachedNotifications = localStorage.getItem('shamba_notifications');
      const cachedLogs = localStorage.getItem('shamba_logs');
      const cachedWallet = localStorage.getItem('shamba_wallet');
      const cachedInvestments = localStorage.getItem('shamba_investments');

      const handle = requestAnimationFrame(() => {
        setFarms(cachedFarms ? JSON.parse(cachedFarms) : INITIAL_FARMS);
        setChamas(cachedChamas ? JSON.parse(cachedChamas) : INITIAL_CHAMAS);
        setReports(cachedReports ? JSON.parse(cachedReports) : INITIAL_REPORTS);
        setNotifications(cachedNotifications ? JSON.parse(cachedNotifications) : INITIAL_NOTIFICATIONS);
        setLogs(cachedLogs ? JSON.parse(cachedLogs) : INITIAL_ACTIVITY_LOGS);
        setWalletBalance(cachedWallet ? Number(cachedWallet) : 350000);
        setInvestments(cachedInvestments ? JSON.parse(cachedInvestments) : [
          {
            id: 'inv-seed-1',
            farmId: 'farm-2',
            farmName: 'Lake Victoria Tilapia Aquacages',
            investorId: 'investor-joel',
            units: 10,
            amount: 50000,
            expectedReturn: 61000,
            date: '2026-05-20',
            status: 'active'
          },
          {
            id: 'inv-seed-2',
            farmId: 'farm-4',
            farmName: 'Naivasha Hydroponic Smart-Tomato Greenhouses',
            investorId: 'investor-joel',
            units: 4,
            amount: 20000,
            expectedReturn: 24000,
            date: '2026-05-28',
            status: 'active'
          }
        ]);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  // Sync cache on modification
  const saveToLocal = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const updateFarmsState = (updated: Farm[]) => {
    setFarms(updated);
    saveToLocal('shamba_farms', updated);
  };

  const updateChamasState = (updated: Chama[]) => {
    setChamas(updated);
    saveToLocal('shamba_chamas', updated);
  };

  const updateReportsState = (updated: WorkerReport[]) => {
    setReports(updated);
    saveToLocal('shamba_reports', updated);
  };

  const updateNotificationsState = (updated: Notification[]) => {
    setNotifications(updated);
    saveToLocal('shamba_notifications', updated);
  };

  const updateLogsState = (updated: ActivityLog[]) => {
    setLogs(updated);
    saveToLocal('shamba_logs', updated);
  };

  const updateWalletState = (val: number) => {
    setWalletBalance(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shamba_wallet', String(val));
    }
  };

  const updateInvestmentsState = (updated: Investment[]) => {
    setInvestments(updated);
    saveToLocal('shamba_investments', updated);
  };

  // --- Session Control ---
  // Users can transition between 4 agricultural perspectives
  const [activeRole, setActiveRole] = React.useState<'investor' | 'farmer' | 'worker' | 'admin'>('investor');

  // Interactive Modals & Forms State
  const [showDepositModal, setShowDepositModal] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState('');
  const [showInvestModal, setShowInvestModal] = React.useState<Farm | null>(null);
  const [investUnits, setInvestUnits] = React.useState('1');
  const [investChamaId, setInvestChamaId] = React.useState('');

  const [notifBellOpen, setNotifBellOpen] = React.useState(false);

  // --- Filter states ---
  const [farmTypeFilter, setFarmTypeFilter] = React.useState<string>('all');
  const [farmSearch, setFarmSearch] = React.useState<string>('');

  // --- AI Farm Matchmaking Controls ---
  const [aiBudget, setAiBudget] = React.useState<string>('150000');
  const [aiRisk, setAiRisk] = React.useState<string>('medium');
  const [aiType, setAiType] = React.useState<string>('all');
  const [aiLocation, setAiLocation] = React.useState<string>('any');
  const [aiMatchedData, setAiMatchedData] = React.useState<any | null>(null);
  const [aiMatchingLoading, setAiMatchingLoading] = React.useState(false);

  // --- AI Anomaly Assessment Controls ---
  const [anomalyTargetFarm, setAnomalyTargetFarm] = React.useState<string>('farm-1');
  const [aiAnomalyData, setAiAnomalyData] = React.useState<any | null>(null);
  const [aiAnomalyLoading, setAiAnomalyLoading] = React.useState(false);

  // --- Log action helper ---
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: generateUniqueId('log'),
      userId: 'user-current',
      userRole: activeRole,
      userName: activeRole === 'investor' ? 'Joel Ndoho' : activeRole === 'farmer' ? 'Ezekiel Kiprotich' : activeRole === 'worker' ? 'Joseph Kuria' : 'Administrator',
      action,
      details,
      timestamp: getTimestampString()
    };
    const nextLogs = [newLog, ...logs];
    updateLogsState(nextLogs);
  };

  // --- Notification push helper ---
  const triggerNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' | 'payout') => {
    const newNotif: Notification = {
      id: generateUniqueId('notif'),
      userId: 'user-current',
      title,
      message,
      type,
      date: getTimestampString(),
      read: false
    };
    updateNotificationsState([newNotif, ...notifications]);
  };

  // --- Chama Creation State ---
  const [newChamaName, setNewChamaName] = React.useState('');
  const [newChamaDesc, setNewChamaDesc] = React.useState('');

  // --- Farmer Proposal State ---
  const [propName, setPropName] = React.useState('');
  const [propType, setPropType] = React.useState<'crops' | 'livestock' | 'aquaculture' | 'cash_crops'>('crops');
  const [propCrop, setPropCrop] = React.useState('');
  const [propSize, setPropSize] = React.useState('');
  const [propTarget, setPropTarget] = React.useState('');
  const [propROI, setPropROI] = React.useState('');
  const [propDuration, setPropDuration] = React.useState('');
  const [propDesc, setPropDesc] = React.useState('');

  // --- Farmer Log Update State ---
  const [updateFarmId, setUpdateFarmId] = React.useState('');
  const [updateType, setUpdateType] = React.useState<'progress' | 'receipt' | 'weather'>('progress');
  const [updateTitle, setUpdateTitle] = React.useState('');
  const [updateDesc, setUpdateDesc] = React.useState('');

  // --- Worker Report State ---
  const [reportFarmId, setReportFarmId] = React.useState('');
  const [reportRating, setReportRating] = React.useState('5');
  const [reportNotes, setReportNotes] = React.useState('');
  const [reportStatus, setReportStatus] = React.useState<'passed' | 'flagged'>('passed');

  // --- Dispute handling ---
  const [disputedInvestment, setDisputedInvestment] = React.useState<string | null>(null);

  // --- API Handlers ---
  const handleAIMatchRequest = async () => {
    setAiMatchingLoading(true);
    setAiMatchedData(null);
    try {
      const response = await fetch('/api/gemini/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: Number(aiBudget),
          riskAppetite: aiRisk,
          locationPreference: aiLocation === 'any' ? '' : aiLocation,
          farmType: aiType === 'all' ? '' : aiType,
          farms: farms
        })
      });
      const data = await response.json();
      if (response.ok) {
        setAiMatchedData(data);
        logActivity('Launched AI Matching', `Sought matching recommendations for budget of KES ${Number(aiBudget).toLocaleString()}`);
      } else {
        alert(data.error || 'Server error occurred during matching');
      }
    } catch (err: any) {
      alert('Network exception in matching: ' + err.message);
    } finally {
      setAiMatchingLoading(false);
    }
  };

  const handleAIAnomalyAssessment = async () => {
    setAiAnomalyLoading(true);
    setAiAnomalyData(null);
    try {
      const targetFarmObj = farms.find(f => f.id === anomalyTargetFarm);
      if (!targetFarmObj) return;

      const farmUpdates = targetFarmObj.updates;
      const farmReports = reports.filter(r => r.farmId === anomalyTargetFarm);

      const response = await fetch('/api/gemini/detect-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm: targetFarmObj,
          updates: farmUpdates,
          reports: farmReports
        })
      });
      const data = await response.json();
      if (response.ok) {
        setAiAnomalyData(data);
        logActivity('Ran AI Anomaly Check', `Scanned logs of '${targetFarmObj.name}'`);
      } else {
        alert(data.error || 'Server error occurred during anomaly check');
      }
    } catch (err: any) {
      alert('Anomaly Engine exception: ' + err.message);
    } finally {
      setAiAnomalyLoading(false);
    }
  };

  // --- Financial Operations Handlers ---
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    updateWalletState(walletBalance + amt);
    triggerNotification('Capital Deposit Successful', `KES ${amt.toLocaleString()} credited successfully from your linked M-Pesa account.`, 'success');
    logActivity('Wallet deposit', `Deposited KES ${amt.toLocaleString()} via integration API`);
    setDepositAmount('');
    setShowDepositModal(false);
  };

  const handleAcquireUnits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInvestModal) return;
    const units = Number(investUnits);
    const cost = units * showInvestModal.unitPrice;

    if (cost > walletBalance) {
      alert('Insufficient wallet balance to cover KES ' + cost.toLocaleString());
      return;
    }

    // Process Investment
    const newInvestment: Investment = {
      id: generateUniqueId('inv'),
      farmId: showInvestModal.id,
      farmName: showInvestModal.name,
      investorId: 'investor-joel',
      units,
      amount: cost,
      expectedReturn: Math.round(cost * (1 + showInvestModal.expectedROI / 100)),
      date: getTodayString(),
      status: 'active',
      chamaId: investChamaId || undefined
    };

    // Update farm funding progress
    const updatedFarms = farms.map((f) => {
      if (f.id === showInvestModal.id) {
        const nextFunded = f.fundedCapital + cost;
        const nextUnits = f.fundedUnits + units;
        const isFullyFunded = nextFunded >= f.targetCapital;
        return {
          ...f,
          fundedCapital: isFullyFunded ? f.targetCapital : nextFunded,
          fundedUnits: isFullyFunded ? f.totalUnits : nextUnits,
          status: isFullyFunded ? 'active' as const : f.status
        };
      }
      return f;
    });

    // Update Chama contribution if invested via Chama
    if (investChamaId) {
      const updatedChamas = chamas.map(c => {
        if (c.id === investChamaId) {
          return {
            ...c,
            activeInvestmentsCount: c.activeInvestmentsCount + 1,
            totalBalance: Math.max(0, c.totalBalance - cost)
          };
        }
        return c;
      });
      updateChamasState(updatedChamas);
    }

    updateInvestmentsState([...investments, newInvestment]);
    updateFarmsState(updatedFarms);
    updateWalletState(walletBalance - cost);

    triggerNotification(
      'Acquisition Placed',
      `Acquired ${units} units of '${showInvestModal.name}' for KES ${cost.toLocaleString()} under physical trust protection.`,
      'success'
    );
    logActivity(
      'Invested in Project',
      `Acquired ${units} units of ${showInvestModal.name} (${investChamaId ? 'Chama pooled' : 'Direct'})`
    );

    setShowInvestModal(null);
    setInvestUnits('1');
    setInvestChamaId('');
  };

  const handleCreateChama = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChamaName) return;
    const newChama: Chama = {
      id: generateUniqueId('chama'),
      name: newChamaName,
      creatorId: 'investor-joel',
      creatorName: 'Joel Ndoho',
      description: newChamaDesc || 'Multi-user cooperative group agricultural pool.',
      members: [{ userId: 'investor-joel', name: 'Joel Ndoho', contribution: 50000, role: 'admin' }],
      totalBalance: 50000,
      activeInvestmentsCount: 0
    };

    if (walletBalance < 50000) {
      alert('You need at least KES 50,000 in your wallet to initialize and seed a Chama group.');
      return;
    }

    updateChamasState([...chamas, newChama]);
    updateWalletState(walletBalance - 50000);
    logActivity('Spun up Chama', `Created Chama Group '${newChamaName}' and seeded it with KES 50,000`);
    triggerNotification('Chama Initialized', `Chama group '${newChamaName}' successfully registered. Swahili esusu rules applied.`, 'success');

    setNewChamaName('');
    setNewChamaDesc('');
  };

  const handleMemberJoinChama = (chamaId: string) => {
    if (walletBalance < 25000) {
      alert('Minimum buy-in for joining this Chama in this simulation is KES 25,000');
      return;
    }
    const updated = chamas.map(c => {
      if (c.id === chamaId) {
        return {
          ...c,
          totalBalance: c.totalBalance + 25000,
          members: [...c.members, { userId: 'investor-joel', name: 'Joel Ndoho (Self)', contribution: 25000, role: 'member' as const }]
        };
      }
      return c;
    });
    updateChamasState(updated);
    updateWalletState(walletBalance - 25000);
    logActivity('Joined Chama group', `Contributed KES 25,000 to group reserves`);
    triggerNotification('Pooled capital contributed', 'Joined Group syndicate successfully.', 'success');
  };

  // --- Farmer Dashboard Handlers ---
  const handleFarmerProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName || !propTarget || !propCrop) return;

    const targetVal = Number(propTarget);
    const roiVal = Number(propROI) || 15;
    const durationVal = Number(propDuration) || 6;
    const sizeVal = Number(propSize) || 5;

    const newFarm: Farm = {
      id: generateUniqueId('farm'),
      name: propName,
      farmerId: 'farmer-ezekiel',
      farmerName: 'Ezekiel Kiprotich',
      location: 'Nakuru Central Sub-County',
      country: 'Kenya',
      type: propType,
      cropType: propCrop,
      sizeAcres: sizeVal,
      targetCapital: targetVal,
      fundedCapital: 0,
      unitPrice: 5000,
      totalUnits: Math.ceil(targetVal / 5000),
      fundedUnits: 0,
      yieldHistory: 'Newly proposed farm zone. Land soil profile checked.',
      farmerCreditScore: 94,
      riskLevel: targetVal > 1000000 ? 'high' : 'medium',
      expectedROI: roiVal,
      durationMonths: durationVal,
      status: 'funding', // Let it instantly list for simple prototype flow but marked as 'unverified'
      imageUrl: 'https://picsum.photos/seed/harvest_' + getRandomSeed() + '/800/600',
      description: propDesc || 'Excellent agricultural enterprise with secured grain/product off-taker frameworks.',
      locationCoords: { lat: -0.301, lng: 36.09 },
      verificationStatus: 'unverified',
      updates: []
    };

    updateFarmsState([...farms, newFarm]);
    logActivity('Registered Project Proposal', `Proposed '${propName}' for capital financing target: KES ${targetVal.toLocaleString()}`);
    triggerNotification('Enterprise Registered', `Successfully submitted proposal for '${propCrop}'. Held in administrative queue.`, 'success');

    // Reset forms
    setPropName('');
    setPropCrop('');
    setPropSize('');
    setPropTarget('');
    setPropROI('');
    setPropDuration('');
    setPropDesc('');
  };

  const handleFarmerLogUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateFarmId || !updateTitle || !updateDesc) return;

    const newUpdate: FarmUpdate = {
      id: generateUniqueId('update'),
      timestamp: getTimestampString(),
      type: updateType,
      title: updateTitle,
      description: updateDesc,
      imageUrl: 'https://picsum.photos/seed/update_' + getRandomSeed() + '/800/600'
    };

    const updatedFarms = farms.map(f => {
      if (f.id === updateFarmId) {
        return {
          ...f,
          updates: [newUpdate, ...f.updates]
        };
      }
      return f;
    });

    updateFarmsState(updatedFarms);
    logActivity('Logged Farm Update', `Added progress category '${updateType}' update to Project ID ${updateFarmId}`);
    triggerNotification('Chronology Dispatched', `Development log successfully synchronized for Project of scale.`, 'success');

    setUpdateFarmId('');
    setUpdateTitle('');
    setUpdateDesc('');
  };

  // --- Field Agent Dashboard Handlers ---
  const handleWorkerReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportFarmId || !reportNotes) return;

    const matchedFarm = farms.find(f => f.id === reportFarmId);
    if (!matchedFarm) return;

    const isPassed = reportStatus === 'passed';

    const newReport: WorkerReport = {
      id: generateUniqueId('report'),
      farmId: reportFarmId,
      farmName: matchedFarm.name,
      workerId: 'worker-joseph',
      workerName: 'Joseph Kuria',
      visitDate: getTodayString(),
      status: reportStatus,
      workerNotes: reportNotes,
      rating: Number(reportRating),
      geoTaggedPhotoUrl: 'https://picsum.photos/seed/inspection_proof/800/600',
      anomalyDetected: !isPassed
    };

    // Update farm verification status
    const updatedFarms = farms.map(f => {
      if (f.id === reportFarmId) {
        return {
          ...f,
          verificationStatus: isPassed ? 'verified' as const : 'flagged' as const
        };
      }
      return f;
    });

    updateReportsState([newReport, ...reports]);
    updateFarmsState(updatedFarms);
    logActivity('Dispatched Verification', `Audit completed for '${matchedFarm.name}' - Result: ${reportStatus.toUpperCase()}`);
    triggerNotification('Audit Locked in Ledger', `Site evaluation report uploaded. Status updated to ${reportStatus.toUpperCase()}`, isPassed ? 'success' : 'alert');

    // Payout field agent reward simulation
    updateWalletState(walletBalance + 3500); // Field workers earn KES 3,500
    triggerNotification('Incentive Transferred', 'KES 3,500 physical audit service fee credited to Worker wallet.', 'success');

    setReportFarmId('');
    setReportNotes('');
  };

  // --- Admin Compliance Portal Handlers ---
  const handleAdminApproveFarm = (farmId: string) => {
    const updated = farms.map(f => {
      if (f.id === farmId) {
        return {
          ...f,
          verificationStatus: 'pending' as const // Graduating from 'unverified' (proposal draft) to 'pending' (ready for field agent visit)
        };
      }
      return f;
    });
    updateFarmsState(updated);
    logActivity('Listing proposal approved', `Listing approved for regional physical safety inspections.`);
    triggerNotification('Listing Moved to Queue', 'Project proposal approved relative to criteria; dispatched to field agents.', 'success');
  };

  const handleAdminTriggerPayout = (farmId: string) => {
    const targetFarm = farms.find(f => f.id === farmId);
    if (!targetFarm) return;

    // Refund/Payout money back to corresponding investors
    const matchingInvestments = investments.filter(inv => inv.farmId === farmId && inv.status === 'active');
    let totalPaidOut = 0;

    const nextInvestments = investments.map(inv => {
      if (inv.farmId === farmId && inv.status === 'active') {
        totalPaidOut += inv.expectedReturn;
        // Adjust simulated self wallet if user is the matching investor
        if (inv.investorId === 'investor-joel') {
          updateWalletState(walletBalance + inv.expectedReturn);
        }
        return { ...inv, status: 'completed' as const };
      }
      return inv;
    });

    const nextFarms = farms.map(f => {
      if (f.id === farmId) {
        return { ...f, status: 'completed' as const };
      }
      return f;
    });

    updateInvestmentsState(nextInvestments);
    updateFarmsState(nextFarms);

    logActivity('Authorized Harvest Settlement', `Released escrow to investors of ${targetFarm.name}. Harvest settlements total: KES ${totalPaidOut.toLocaleString()}`);
    triggerNotification('Escrow Released to Swahili Pools', `Succeeded harvest cycle payouts of KES ${totalPaidOut.toLocaleString()} backed by off-taker deals.`, 'success');
  };

  const handleAdminFlagSuspicious = (farmId: string) => {
    const updated = farms.map(f => {
      if (f.id === farmId) {
        return { ...f, verificationStatus: 'flagged' as const };
      }
      return f;
    });
    updateFarmsState(updated);
    logActivity('Imposed Platform Safety Lock', `Imposed listing safety lockdown on Farm ID: ${farmId}`);
    triggerNotification('Platform Flag Issued', 'Listing suspended. Capital releases temporarily frozen in escrow.', 'alert');
  };

  // --- Filtering computations ---
  const filteredFarms = farms.filter((f) => {
    const matchesType = farmTypeFilter === 'all' || f.type === farmTypeFilter;
    const matchesSearch = f.name.toLowerCase().includes(farmSearch.toLowerCase()) ||
                          f.cropType.toLowerCase().includes(farmSearch.toLowerCase()) ||
                          f.location.toLowerCase().includes(farmSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Calculate high-level stats
  const totalInvestedCumulative = investments.reduce((sum, current) => sum + current.amount, 0);
  const expectedReturnCumulative = investments.reduce((sum, current) => sum + current.expectedReturn, 0);

  return (
    <div id="shamba-frame" className="min-h-screen bg-[#FDFCFB] text-[#1B3022] font-sans selection:bg-amber-100 antialiased">
      
      {/* 1. BRAND PLATFORM HEADER */}
      <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#1B3022]/10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Pitch Theme */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-3xl sm:text-4xl tracking-tighter uppercase leading-none text-[#1B3022]">SHAMBA</span>
              <span className="bg-[#D97757]/10 text-[#D97757] text-[9px] font-bold px-2 py-0.5 rounded-none border border-[#D97757]/20 uppercase tracking-widest font-mono">TRUST CORE</span>
            </div>
            <p className="text-[9px] tracking-[0.2em] font-semibold uppercase mt-1 text-[#D97757]">The Agricultural Trust Infrastructure</p>
          </div>

          {/* Sandbox Role Quick Swapper */}
          <div className="p-0.5 flex flex-wrap items-center gap-1 border border-[#1B3022]/10 bg-[#F5F2EF] rounded-none">
            <span className="text-[9px] font-bold text-[#1B3022]/40 uppercase tracking-[0.2em] px-2.5 hidden xl:inline">ROLE:</span>
            {[
              { id: 'investor', label: 'Investor Hub', icon: Users },
              { id: 'farmer', label: 'Farmer Terminal', icon: Sprout },
              { id: 'worker', label: 'Field Agent', icon: UserCheck },
              { id: 'admin', label: 'Compliance Desk', icon: Shield }
            ].map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id as any)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                    isActive
                      ? 'bg-[#1B3022] text-[#FDFCFB]'
                      : 'text-[#1B3022]/50 hover:text-[#1B3022] hover:bg-white/50'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#D97757]' : 'text-[#1B3022]/40'}`} />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Wallet and Actions */}
          <div className="flex items-center gap-3">
            {/* Wallet Tracker */}
            <div className="bg-[#F5F2EF] border border-[#1B3022]/10 rounded-none p-2 px-3 flex items-center gap-3">
              <div className="bg-[#1B3022] text-[#FDFCFB] p-1.5 rounded-none flex items-center justify-center">
                <Wallet className="h-4 w-4 text-[#D97757]" />
              </div>
              <div className="text-right">
                <p className="text-[9px] text-[#1B3022]/50 font-bold uppercase tracking-[0.2em]">Escrow Balance</p>
                <p className="font-mono text-xs font-black text-[#1B3022]">KES {walletBalance.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowDepositModal(true)}
                className="bg-[#D97757] hover:bg-[#c8623f] text-[#FDFCFB] p-1.5 rounded-none transition"
                title="Deposit Capital via M-Pesa API"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifBellOpen(!notifBellOpen)}
                className="bg-[#F5F2EF] p-2.5 rounded-none border border-[#1B3022]/10 hover:bg-[#F5F2EF]/80 text-[#1B3022] transition"
              >
                <Bell className="h-4 w-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 bg-[#D97757] h-2 w-2 rounded-full ring-1 ring-[#FDFCFB] animate-pulse" />
                )}
              </button>

              {/* Notification Overlay Panel */}
              <AnimatePresence>
                {notifBellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-sm text-stone-800">Telemetry Notifications</span>
                      <button
                        onClick={() => {
                          const marked = notifications.map(n => ({ ...n, read: true }));
                          updateNotificationsState(marked);
                        }}
                        className="text-[10px] text-emerald-700 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-4">No active notices.</p>
                      ) : (
                        notifications.map((not) => (
                          <div key={not.id} className={`p-2 rounded-xl text-xs border ${not.read ? 'border-transparent bg-transparent' : 'border-emerald-100 bg-emerald-50/50'}`}>
                            <div className="flex justify-between items-start">
                              <p className="font-semibold text-emerald-950">{not.title}</p>
                              <span className="text-[8px] text-stone-400">{new Date(not.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-[11px] text-stone-600 mt-0.5">{not.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </header>

      {/* 2. DYNAMIC BROADCAST WARNING */}
      <div className="bg-[#F5F2EF] border-b border-[#1B3022]/10 py-3.5 px-4 text-center">
        <p className="text-[11px] text-[#1B3022]/80 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-[#D97757]" />
          <span>SHAMBA simulation model is active. Use the top sandbox switcher to experiment with Investor, Farmer, Field Worker and Compliance admin actions.</span>
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* ========================================== */}
        {/* PART A: THE INVESTOR DASHBOARD PERSPECTIVE */}
        {/* ========================================== */}
        {activeRole === 'investor' && (
          <div className="space-y-8">
            
            {/* Visual Header / Value Prop Hero */}
            <div className="bg-[#1B3022] text-[#FDFCFB] rounded-none p-8 md:p-10 relative overflow-hidden border border-[#1B3022]/10">
              <div className="relative z-10 max-w-2xl">
                <span className="bg-[#D97757]/10 text-[#D97757] text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-none uppercase border border-[#D97757]/30 font-mono">DIRECT FINANCIAL INCLUSION</span>
                <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight mt-4 text-[#FDFCFB] leading-none">
                  Protect Your Capital while Powering Smallholder Farms
                </h1>
                <p className="text-xs md:text-sm text-[#FDFCFB]/80 font-sans tracking-wide leading-relaxed mt-4">
                  SHAMBA utilizes legal escrow protections, licensed custodian frameworks, and physical field audit telemetry to connect urban capital securely to Kenyan agriculture.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#directories" className="bg-[#D97757] hover:bg-[#c8623f] text-[#FDFCFB] px-5 py-2.5 rounded-none font-bold text-xs uppercase tracking-widest shadow transition">
                    Explore Verified Ventures
                  </a>
                  <a href="#aimatcher" className="bg-transparent hover:bg-white/5 text-[#FDFCFB] border border-white/20 px-5 py-2.5 rounded-none font-bold text-xs uppercase tracking-widest transition">
                    AI Profiling Engine
                  </a>
                </div>
              </div>

              {/* Decorative graphic backdrop */}
              <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-emerald-800 to-emerald-950 pointer-events-none" />
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-none border border-[#1B3022]/10 shadow-sm transition hover:shadow-md">
                <p className="text-[10px] font-bold text-[#D97757] uppercase tracking-[0.2em]">Active Placements</p>
                <p className="text-3xl font-serif text-[#1B3022] mt-2 font-medium">{investments.filter(i => i.status === 'active').length}</p>
                <p className="text-[11px] text-[#1B3022]/60 mt-1 italic">Direct vetted contracts</p>
              </div>
              <div className="bg-white p-6 rounded-none border border-[#1B3022]/10 shadow-sm transition hover:shadow-md">
                <p className="text-[10px] font-bold text-[#D97757] uppercase tracking-[0.2em]">Expected Payout</p>
                <p className="text-3xl font-serif text-[#1B3022] mt-2 font-medium">KES {expectedReturnCumulative.toLocaleString()}</p>
                <p className="text-[11px] text-[#1B3022]/60 mt-1 italic">Based on fixed off-taking contracts</p>
              </div>
              <div className="bg-white p-6 rounded-none border border-[#1B3022]/10 shadow-sm transition hover:shadow-md">
                <p className="text-[10px] font-bold text-[#D97757] uppercase tracking-[0.2em]">Investment Volume</p>
                <p className="text-3xl font-serif text-[#1B3022] mt-2 font-medium">KES {totalInvestedCumulative.toLocaleString()}</p>
                <p className="text-[11px] text-[#1B3022]/60 mt-1 italic">Escrow held locked safety</p>
              </div>
              <div className="bg-white p-6 rounded-none border border-[#1B3022]/10 shadow-sm transition hover:shadow-md">
                <p className="text-[10px] font-bold text-[#D97757] uppercase tracking-[0.2em]">Investor Cred Score</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-serif text-[#1B3022] font-medium">{investorScore}/100</p>
                  <span className="bg-[#D97757]/10 text-[#D97757] font-bold text-[8px] px-1.5 py-0.5 rounded-none border border-[#D97757]/20 tracking-wider">EXCELLENT</span>
                </div>
                <p className="text-[11px] text-[#1B3022]/60 mt-1 italic">Unlocks lower checkout platform fees</p>
              </div>
            </div>

            {/* BENTO LAYOUT MAIN AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT & CENTER SUB-GRID: Farm Browsing and AI Matching */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. AI VENTURE MATCHMAKING ENG */}
                <div id="aimatcher" className="bg-[#F5F2EF] border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#1B3022] text-[#FDFCFB] p-1.5 rounded-none flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-serif font-black text-[#1B3022] italic">AI Farm Matchmaking Engine</h2>
                      <p className="text-[11px] text-[#1B3022]/70">Input constraints to build dynamic, multi-farm crop allocations automatically</p>
                    </div>
                  </div>

                  {/* Settings selectors */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                    <div>
                      <label className="block text-[10px] font-bold text-[#D97757] uppercase tracking-wider mb-1.5">Target Capital (KES)</label>
                      <input
                        type="number"
                        step="5000"
                        value={aiBudget}
                        onChange={(e) => setAiBudget(e.target.value)}
                        className="w-full bg-white border border-[#1B3022]/20 rounded-none px-3 py-2 text-xs font-mono text-[#1B3022] focus:border-[#D97757] outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#D97757] uppercase tracking-wider mb-1.5">Risk Appetite</label>
                      <select
                        value={aiRisk}
                        onChange={(e) => setAiRisk(e.target.value)}
                        className="w-full bg-white border border-[#1B3022]/20 rounded-none px-3 py-2 text-xs font-semibold text-[#1B3022] focus:border-[#D97757] outline-none transition"
                      >
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#D97757] uppercase tracking-wider mb-1.5">Sector Focus</label>
                      <select
                        value={aiType}
                        onChange={(e) => setAiType(e.target.value)}
                        className="w-full bg-white border border-[#1B3022]/20 rounded-none px-3 py-2 text-xs font-semibold text-[#1B3022] focus:border-[#D97757] outline-none transition"
                      >
                        <option value="all">Any Sector</option>
                        <option value="crops">Field Crops</option>
                        <option value="livestock">Animal Herds</option>
                        <option value="aquaculture">Aquaculture</option>
                        <option value="cash_crops">Cash / Export Crop</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#D97757] uppercase tracking-wider mb-1.5">Province Group</label>
                      <select
                        value={aiLocation}
                        onChange={(e) => setAiLocation(e.target.value)}
                        className="w-full bg-white border border-[#1B3022]/20 rounded-none px-3 py-2 text-xs font-semibold text-[#1B3022] focus:border-[#D97757] outline-none transition"
                      >
                        <option value="any">Any Region</option>
                        <option value="Nakuru">Nakuru County</option>
                        <option value="Kisumu">Kisumu Area</option>
                        <option value="Murang'a">Murang&apos;a Basin</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAIMatchRequest}
                    disabled={aiMatchingLoading}
                    className="w-full bg-[#1B3022] hover:bg-[#203728] text-white font-bold text-xs py-2.5 rounded-none transition shadow-sm mt-4 uppercase tracking-widest flex items-center justify-center gap-1.5"
                  >
                    {aiMatchingLoading ? (
                      <>
                        <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        <span>Querying Deep Match matrices via Gemini 3.5...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5 text-[#D97757] fill-[#D97757]/30" />
                        <span>Assemble Dynamic AI Allocation Proposal</span>
                      </>
                    )}
                  </button>

                  {/* AI Results Output */}
                  <AnimatePresence>
                    {aiMatchedData && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-white border border-[#1B3022]/10 rounded-none p-5 mt-5 shadow-xs"
                      >
                        <div className="flex items-center justify-between border-b border-[#1B3022]/10 pb-3">
                          <span className="font-serif font-black text-sm text-[#1B3022] uppercase tracking-wide flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 text-[#D97757]" />
                            SHAMBA AI allocation report
                          </span>
                          {aiMatchedData.isSimulated && (
                            <span className="text-[9px] bg-[#F5F2EF] border border-[#1B3022]/10 text-[#1B3022]/60 font-bold px-2 py-0.5 rounded-none font-mono">
                              RESILIENT OFFLINE MODE
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#1B3022]/80 mt-3 leading-relaxed font-sans">
                          {aiMatchedData.matchSummary}
                        </p>

                        <div className="space-y-3 mt-4">
                          <h3 className="text-[10px] font-bold text-[#D97757] tracking-[0.2em] uppercase">Proportional Recommendations</h3>
                          {aiMatchedData.recommendations && aiMatchedData.recommendations.map((rec: any, idx: number) => {
                            const matchingFarm = farms.find(f => f.id === rec.farmId);
                            return (
                              <div key={idx} className="bg-[#FDFCFB] border border-[#1B3022]/10 rounded-none p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-serif font-bold text-[#1B3022]">
                                      {matchingFarm ? matchingFarm.name : 'Venture ID: ' + rec.farmId}
                                    </span>
                                    <span className="bg-[#D97757]/10 text-[#D97757] text-[9px] font-bold px-1.5 py-0.5 rounded-none border border-[#D97757]/20 uppercase tracking-wider font-mono">
                                      {rec.suitabilityScore}% Match
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#1B3022]/60 mt-1">{rec.reason}</p>
                                </div>
                                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1B3022]/10">
                                  <span className="text-[9px] text-[#1B3022]/40 font-bold uppercase tracking-wider block">ALLOCATION SUGGESTION</span>
                                  <span className="font-mono text-xs font-bold text-[#1B3022]">KES {rec.allocationAmount?.toLocaleString()}</span>
                                  {matchingFarm && (
                                    <button
                                      onClick={() => {
                                        setInvestUnits(String(Math.floor(rec.allocationAmount / matchingFarm.unitPrice) || 1));
                                        setShowInvestModal(matchingFarm);
                                      }}
                                      className="bg-[#D97757] text-[#FDFCFB] text-[10px] font-bold px-2.5 py-1.5 rounded-none hover:bg-[#c8623f] uppercase tracking-wider transition font-mono mt-1"
                                    >
                                      Accept and buy
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#1B3022]/10 bg-[#F5F2EF]/50 p-2.5 rounded-none border border-[#1B3022]/10 flex items-start gap-2 text-[11px] text-[#1B3022]">
                          <Info className="h-4 w-4 text-[#D97757] shrink-0 mt-0.5" />
                          <p>
                            <strong>AI Escrow Safeguard Guard:</strong> {aiMatchedData.riskReview}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. VERIFIED VEGETABLE & CEREALES DIRECTORY */}
                <div id="directories" className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B3022]/10 pb-4">
                    <div>
                      <h2 className="text-2xl font-serif font-black text-[#1B3022]">Verified Agricultural Ventures</h2>
                      <p className="text-xs text-[#1B3022]/60">Escrow backed fractional assets. Click to buy shares (units).</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative border border-[#1B3022]/10 bg-white p-0.5">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#1B3022]/40" />
                        <input
                          type="text"
                          placeholder="Search land, crops, farmer..."
                          value={farmSearch}
                          onChange={(e) => setFarmSearch(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs bg-white text-[#1B3022] font-semibold max-w-xs focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: 'All Sector Farms' },
                      { id: 'crops', label: 'Cereals & Crops' },
                      { id: 'livestock', label: 'Livestock Ranching' },
                      { id: 'aquaculture', label: 'Aquacultures' },
                      { id: 'cash_crops', label: 'Cash & Export Crops' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setFarmTypeFilter(tab.id)}
                        className={`text-[10px] px-4 py-2 font-bold uppercase tracking-wider transition rounded-none whitespace-nowrap ${
                          farmTypeFilter === tab.id
                            ? 'bg-[#1B3022] text-[#FDFCFB]'
                            : 'bg-white text-[#1B3022]/60 border border-[#1B3022]/10 hover:bg-[#F5F2EF]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* List of projects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredFarms.length === 0 ? (
                      <div className="col-span-full bg-[#F5F2EF] py-12 text-center rounded-none border border-[#1B3022]/10">
                        <Sprout className="h-10 w-10 text-[#1B3022]/30 mx-auto mb-2" />
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1B3022]/50">No projects found matching criteria.</p>
                      </div>
                    ) : (
                      filteredFarms.map((farm) => {
                        const remaining = farm.targetCapital - farm.fundedCapital;
                        const percentage = Math.min(100, Math.round((farm.fundedCapital / farm.targetCapital) * 100));
                        
                        return (
                          <div
                            key={farm.id}
                            className={`bg-white rounded-none border ${
                              farm.verificationStatus === 'flagged' ? 'border-red-400' : 'border-[#1B3022]/10'
                            } overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                          >
                            <div className="relative h-48 w-full bg-[#F5F2EF]">
                              <img
                                src={farm.imageUrl}
                                alt={farm.name}
                                className="object-cover h-full w-full grayscale-[10%] contrast-[105%]"
                              />
                              {/* Overlay badging */}
                              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                                {farm.verificationStatus === 'verified' ? (
                                  <span className="bg-[#1B3022] text-[#FDFCFB] text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-none border-none flex items-center gap-1">
                                    <CheckCircle className="h-2.5 w-2.5 text-[#D97757]" />
                                    VES AUDITED
                                  </span>
                                ) : farm.verificationStatus === 'pending' ? (
                                  <span className="bg-[#F5F2EF] text-[#1B3022]/80 text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-none border border-[#1B3022]/10 flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    AUDIT PENDING
                                  </span>
                                ) : farm.verificationStatus === 'flagged' ? (
                                  <span className="bg-red-600 text-white text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-none flex items-center gap-1">
                                    <AlertTriangle className="h-2.5 w-2.5" />
                                    SUSPENDED
                                  </span>
                                ) : (
                                  <span className="bg-stone-500 text-white text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-none flex items-center gap-1">
                                    PROPOSAL
                                  </span>
                                )}

                                <span className={`text-[8px] font-mono font-bold px-2.5 py-1 rounded-none uppercase tracking-widest ${
                                  farm.riskLevel === 'low' ? 'bg-[#FDFCFB] border border-[#1B3022]/10 text-[#1B3022]' :
                                  farm.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {farm.riskLevel?.toUpperCase()} RISK
                                </span>
                              </div>

                              <div className="absolute bottom-3 right-3 bg-[#D97757] text-[#FDFCFB] text-[10px] font-mono px-3 py-1 uppercase font-black tracking-wider">
                                {farm.expectedROI}% Expected ROI
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-[#D97757] uppercase tracking-[0.2em] mb-1 block">{farm.cropType}</span>
                                <h3 className="font-serif font-black text-[#1B3022] text-xl leading-snug line-clamp-1">{farm.name}</h3>
                                
                                <div className="flex items-center gap-1 text-xs italic text-[#1B3022]/60 mt-1.5">
                                  <MapPin className="h-3 w-3 inline text-[#D97757]" />
                                  <span>{farm.location}, {farm.country}</span>
                                </div>

                                <p className="text-xs text-[#1B3022]/80 leading-relaxed mt-3 line-clamp-3">
                                  {farm.description}
                                </p>
                              </div>

                              {/* Progress metric */}
                              <div className="mt-6 pt-4 border-t border-[#1B3022]/10 space-y-2">
                                <div className="flex justify-between items-center text-xs font-semibold tracking-wide uppercase text-[#1B3022]">
                                  <span>Funded: {percentage}%</span>
                                  <span className="font-mono text-[#1B3022]/60 text-[11px]">{farm.fundedUnits} / {farm.totalUnits} Units</span>
                                </div>
                                <div className="w-full bg-[#1B3022]/5 h-1.5 rounded-none overflow-hidden">
                                  <div className="h-full bg-[#1B3022] rounded-none" style={{ width: `${percentage}%` }} />
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-[#1B3022]/50 uppercase tracking-wider font-semibold font-sans mt-2">
                                  <span>Ticket: KES {farm.unitPrice.toLocaleString()} / unit</span>
                                  <span>Goal: KES {farm.targetCapital.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Action Buy */}
                              <div className="mt-6 flex items-center justify-between gap-2.5 pt-4 border-t border-[#1B3022]/10">
                                <div className="text-left">
                                  <p className="text-[9px] text-[#1B3022]/40 font-bold uppercase tracking-[0.2em]">Farmer Score</p>
                                  <span className="font-mono text-xs font-black text-[#1B3022]">{farm.farmerCreditScore}/100 Badge</span>
                                </div>
                                {farm.status === 'funding' && farm.verificationStatus === 'verified' ? (
                                  <button
                                    onClick={() => setShowInvestModal(farm)}
                                    className="bg-[#D97757] hover:bg-[#c8623f] text-[#FDFCFB] rounded-none font-bold text-xs uppercase tracking-widest px-4 py-2 cursor-pointer transition shadow-xs"
                                  >
                                    Acquire units
                                  </button>
                                ) : farm.status === 'funding' && farm.verificationStatus !== 'verified' ? (
                                  <span className="text-[10px] text-[#1B3022]/60 font-bold flex items-center gap-1 uppercase tracking-wider font-mono">
                                    <Lock className="h-3.5 w-3.5 text-[#D97757]" />
                                    Locks Pending Inspection
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold uppercase px-3 py-1 rounded-none bg-[#F5F2EF] text-[#1B3022] border border-[#1B3022]/10 font-mono">
                                    {farm.status?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT BENTO SUB-GRID: Chamas / Portfolio / Scores */}
              <div className="space-y-8">
                
                {/* 1. CHAMA INVESTMENT SYNDICATES */}
                <div className="bg-white border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#1B3022]" />
                    <div>
                      <h2 className="text-md font-serif font-black text-[#1B3022]">Chama Pools (Syndicates)</h2>
                      <p className="text-[10px] text-[#1B3022]/60">Form esusu circles to pool agricultural investments</p>
                    </div>
                  </div>

                  {/* Active list */}
                  <div className="space-y-3 mt-4">
                    {chamas.map((chama) => {
                      const isMember = chama.members.some(m => m.userId === 'investor-joel');
                      return (
                        <div key={chama.id} className="bg-[#F5F2EF]/50 border border-[#1B3022]/10 rounded-none p-3.5">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs font-serif font-black text-[#1B3022]">{chama.name}</h3>
                            <span className="text-[8px] bg-[#D97757]/10 text-[#D97757] px-2 py-0.5 rounded-none border border-[#D97757]/20 font-mono tracking-widest font-extrabold uppercase">
                              {chama.members.length} members
                            </span>
                          </div>
                          <p className="text-[10px] text-[#1B3022]/70 mt-1 leading-relaxed">{chama.description}</p>
                          <div className="flex justify-between items-center mt-3 pt-2 text-[11px] border-t border-[#1B3022]/10">
                            <div>
                              <p className="text-[#1B3022]/40 font-bold uppercase text-[8px] tracking-wider">Group Capital Reserve</p>
                              <span className="font-mono text-[#1B3022] font-black">KES {chama.totalBalance.toLocaleString()}</span>
                            </div>
                            {isMember ? (
                              <span className="bg-white border border-[#1B3022]/10 text-[#1B3022]/70 text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-none font-mono">Joined member</span>
                            ) : (
                              <button
                                onClick={() => handleMemberJoinChama(chama.id)}
                                className="bg-[#D97757] hover:bg-[#c8623f] text-[#FDFCFB] font-extrabold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-none transition font-sans"
                              >
                                Join (Pool KES 25k)
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Creation form */}
                  <form onSubmit={handleCreateChama} className="mt-4 pt-4 border-t border-[#1B3022]/10 space-y-2.5">
                    <p className="text-[9px] font-bold text-[#D97757] uppercase tracking-[0.2em] mb-1">Establish New Syndicate</p>
                    <input
                      type="text"
                      placeholder="Chama Group Name (e.g. Kiambu Cereal Collective)"
                      value={newChamaName}
                      onChange={(e) => setNewChamaName(e.target.value)}
                      className="w-full bg-white border border-[#1B3022]/20 rounded-none p-2 text-xs text-[#1B3022] focus:border-[#D97757] outline-none transition"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pool descriptive overview statement..."
                      value={newChamaDesc}
                      onChange={(e) => setNewChamaDesc(e.target.value)}
                      className="w-full bg-white border border-[#1B3022]/20 rounded-none p-2 text-xs text-[#1B3022] focus:border-[#D97757] outline-none transition"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#1B3022] hover:bg-[#203728] text-white font-bold text-[9px] uppercase tracking-widest py-2 rounded-none transition"
                    >
                      Establish chama (Locks KES 50,000 initial seed)
                    </button>
                  </form>
                </div>

                {/* 2. DYNAMIC PORTFOLIO LEDGER */}
                <div className="bg-white border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-[#1B3022]" />
                    <div>
                      <h2 className="text-md font-serif font-black text-[#1B3022]">Your Escrow Holdings</h2>
                      <p className="text-[10px] text-[#1B3022]/60">Live custody and payout schedule indicators</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {investments.map((inv) => {
                      const associatedFarm = farms.find(f => f.id === inv.farmId);
                      return (
                        <div key={inv.id} className="border border-[#1B3022]/10 bg-[#FDFCFB] rounded-none p-4 hover:border-[#D97757] transition">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xs font-serif font-bold text-[#1B3022] line-clamp-1">{inv.farmName}</h3>
                              <p className="text-[9px] text-[#1B3022]/50 uppercase font-mono mt-0.5">Asset units: {inv.units} • KES {inv.amount.toLocaleString()}</p>
                            </div>
                            <span className={`text-[8px] tracking-wider font-mono font-bold px-2 py-0.5 rounded-none uppercase ${
                              inv.status === 'completed' ? 'bg-[#1B3022]/10 text-[#1B3022]' :
                              inv.status === 'disputed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {inv.status?.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#1B3022]/10 text-[11px]">
                            <div>
                              <span className="text-[8px] text-[#1B3022]/40 font-bold block uppercase">SECURED CUSTODY RELEASE</span>
                              <strong className="text-[#1B3022] font-mono text-xs">KES {inv.expectedReturn.toLocaleString()}</strong>
                            </div>
                            
                            {inv.status === 'active' && (
                              <button
                                onClick={() => {
                                  const updatedInvs = investments.map(i => {
                                    if (i.id === inv.id) {
                                      return { ...i, status: 'disputed' as const };
                                    }
                                    return i;
                                  });
                                  updateInvestmentsState(updatedInvs);
                                  logActivity('Filed Dispute on placement', `Raised a transparent dispute window against ${inv.farmName} custody`);
                                  triggerNotification('Dispute Flagged', 'Capital release held locked. Compliance officer dispatching.', 'alert');
                                }}
                                className="text-[9px] text-[#D97757] hover:text-red-600 font-bold uppercase tracking-wider transition cursor-pointer"
                              >
                                File dispute
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. EXPERT METHODOLOGY TIP BOX */}
                <div className="bg-[#1B3022] text-[#FDFCFB] rounded-none p-6 border-l-4 border-[#D97757]">
                  <p className="text-[#D97757] text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 fill-[#D97757]/10" />
                    Platform Safety Layer
                  </p>
                  <h3 className="font-serif italic text-base mt-2 leading-snug font-bold">The Reason Predecessors Failed</h3>
                  <p className="text-[11px] text-[#FDFCFB]/80 mt-2 leading-relaxed font-sans">
                    Former crowdsourcers acted as piggy-banks, scaling without physical audits or regulatory compliance. SHAMBA holds money strictly in independent licensed Escrow custodians. Funds are only authorized for farmer payout once Field Workers confirm land prep and output batches.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* PART B: THE FARMER TERMINAL PERSPECTIVE */}
        {/* ========================================== */}
        {activeRole === 'farmer' && (
          <div className="space-y-8">
            
            <div className="bg-[#1B3022] text-[#FDFCFB] p-6 rounded-none flex justify-between items-center border border-[#1B3022]/10">
              <div>
                <span className="bg-[#D97757]/15 border border-[#D97757]/30 text-[#D97757] text-[9px] font-bold px-2.5 py-1 rounded-none uppercase tracking-widest font-mono">Farmer Terminal</span>
                <h1 className="text-2xl font-serif font-black mt-2">Nshamba Agricultural Dashboard</h1>
                <p className="text-xs text-[#FDFCFB]/80 mt-1">Ezekiel Kiprotich (Verified Rift Valley Agri-Manager)</p>
              </div>
              <div className="bg-white/10 border border-white/20 p-2 text-center backdrop-blur-xs min-w-28 font-mono">
                <p className="text-[8px] text-[#D97757] font-extrabold uppercase tracking-wider">Verified Cred Index</p>
                <p className="text-3xl font-black">94/100</p>
                <div className="text-[8px] mt-0.5 text-[#D97757] font-bold uppercase tracking-wider">● Premium Tier</div>
              </div>
            </div>

            {/* Farmer actions grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form 1: Raise agricultural capital */}
              <div className="lg:col-span-1 bg-white border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                <h2 className="text-base font-serif font-black text-[#1B3022] flex items-center gap-1.5 mb-2">
                  <Plus className="h-4 w-4 text-[#D97757]" />
                  Request Agronomic Capital
                </h2>
                <p className="text-[11px] text-[#1B3022]/60 mb-4">Request seasonal crop/fencing credit lines. Placed under escrow review rules.</p>

                <form onSubmit={handleFarmerProposal} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">VENTURE PROFILE NAME</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2.5 outline-none focus:border-[#D97757] transition"
                      placeholder="e.g. Kipipiri Potato Crop Cycle 2"
                      value={propName}
                      onChange={(e) => setPropName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">AGRICULTURE CATEGORY</label>
                      <select
                        className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition"
                        value={propType}
                        onChange={(e) => setPropType(e.target.value as any)}
                      >
                        <option value="crops">Field Crops</option>
                        <option value="livestock">Animals</option>
                        <option value="aquaculture">Aquaculture</option>
                        <option value="cash_crops">Cash Crops</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">SPECIFIC CROP / STOCK</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition"
                        placeholder="e.g. Shangi Potatoes"
                        value={propCrop}
                        onChange={(e) => setPropCrop(e.target.value)}
                        required
                    />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">SIZE (ACRES)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition font-mono"
                        placeholder="8"
                        value={propSize}
                        onChange={(e) => setPropSize(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">TARGET KES</label>
                      <input
                        type="number"
                        step="5000"
                        className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition font-mono"
                        placeholder="600000"
                        value={propTarget}
                        onChange={(e) => setPropTarget(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">PROPOSED ROI (%)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition font-mono"
                        placeholder="18"
                        value={propROI}
                        onChange={(e) => setPropROI(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">CYCLE TIME (MONTHS)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition font-mono"
                      placeholder="6"
                      value={propDuration}
                      onChange={(e) => setPropDuration(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">PROJECT DESCRIPTION</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition resize-none"
                      placeholder="Outline agronomic setup details and contractual buyer arrangements..."
                      value={propDesc}
                      onChange={(e) => setPropDesc(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1B3022] hover:bg-[#2e4c37] text-white font-bold text-xs py-2.5 rounded-none uppercase tracking-widest transition shadow-xs cursor-pointer"
                  >
                    Submit Venture Proposal
                  </button>
                </form>
              </div>

              {/* Form 2: Dispatch Crop Update */}
              <div className="lg:col-span-1 bg-white border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                <h2 className="text-base font-serif font-black text-[#1B3022] flex items-center gap-1.5 mb-2">
                  <Activity className="h-4 w-4 text-[#D97757]" />
                  Dispatch Crop Log Update
                </h2>
                <p className="text-[11px] text-[#1B3022]/60 mb-4 font-normal">Broadcast physical updates. Real-time geo-pinned coordinates will be logged automatically.</p>

                <form onSubmit={handleFarmerLogUpdate} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">TARGET FARM LISTING</label>
                    <select
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2.5 outline-none focus:border-[#D97757] transition font-sans"
                      value={updateFarmId}
                      onChange={(e) => setUpdateFarmId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose active unit --</option>
                      {farms.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.cropType})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">UPDATE LOG CATEGORY</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'progress', label: 'Growth / Sprt' },
                        { id: 'receipt', label: 'Receipt / Bill' },
                        { id: 'weather', label: 'Eco Alerts' }
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setUpdateType(type.id as any)}
                          className={`flex-1 text-[9px] font-bold uppercase tracking-wider py-2 px-1 rounded-none transition border ${
                            updateType === type.id
                              ? 'bg-[#1B3022]/10 border-[#1B3022] text-[#1B3022] font-black'
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">UPDATE HEADING TITLE</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition"
                      placeholder="e.g. Sprouting reached 4 inches"
                      value={updateTitle}
                      onChange={(e) => setUpdateTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">UPDATE DETAIL NARRATIVE</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition resize-none"
                      placeholder="Outline agronomic tasks completed, weather inputs, or logistics transactions details..."
                      value={updateDesc}
                      onChange={(e) => setUpdateDesc(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1B3022] hover:bg-[#2e4c37] text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-none transition shadow-xs cursor-pointer"
                  >
                    Broadcast Pinned Telemetry Log
                  </button>
                </form>
              </div>

              {/* View 3: My active farms summary */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-base font-serif font-black text-[#1B3022]">My Platform Listings</h2>
                
                <div className="space-y-4">
                  {farms.filter(f => f.farmerId === 'farmer-ezekiel').map(farm => {
                    const pct = Math.min(100, Math.round((farm.fundedCapital / farm.targetCapital) * 100));
                    return (
                      <div key={farm.id} className="bg-white border border-[#1B3022]/10 rounded-none p-4 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] bg-[#F5F2EF] text-[#1B3022]/60 px-1.5 py-1 border border-[#1B3022]/10 rounded-none font-bold font-mono uppercase tracking-widest">{farm.cropType}</span>
                            <h3 className="text-xs font-serif font-black text-[#1B3022] mt-2 line-clamp-1">{farm.name}</h3>
                          </div>
                          <span className={`text-[8px] font-bold font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-none ${
                            farm.verificationStatus === 'verified' ? 'bg-[#1B3022]/10 text-[#1B3022]' : 'bg-[#F5F2EF] text-[#1B3022]/60'
                          }`}>
                            {farm.verificationStatus?.toUpperCase()}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-[#1B3022]">
                            <span className="tracking-wider">Funding Goal Ratio</span>
                            <span className="font-mono">{pct}%</span>
                          </div>
                          <div className="w-full bg-[#1B3022]/5 h-1.5 rounded-none overflow-hidden">
                            <div className="h-full bg-[#1B3022] rounded-none" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="text-[10px] text-[#1B3022]/60 font-mono mt-1 font-bold">
                            KES {farm.fundedCapital.toLocaleString()} / KES {farm.targetCapital.toLocaleString()}
                          </div>
                        </div>

                        {/* Recent updates list */}
                        <div className="pt-3 border-t border-[#1B3022]/10 text-[11px] space-y-2">
                          <p className="text-[9px] text-[#D97757] font-bold uppercase tracking-wider">Dispatched log timeline ({farm.updates.length})</p>
                          {farm.updates.slice(0, 2).map((up, ui) => (
                            <div key={ui} className="bg-[#F5F2EF]/55 p-2.5 border border-[#1B3022]/5 rounded-none">
                              <div className="flex justify-between items-center text-[10px] text-[#1B3022]/50 font-mono">
                                <span className="font-bold text-[#D97757] uppercase text-[8px]">{up.type}</span>
                                <span>{new Date(up.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="font-serif font-bold text-[#1B3022] text-xs mt-1">{up.title}</p>
                              <p className="text-[10px] text-[#1B3022]/70 leading-relaxed mt-0.5">{up.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* PART C: THE FIELD WORKER PERSPECTIVE */}
        {/* ========================================== */}
        {activeRole === 'worker' && (
          <div className="space-y-8">
            
            <div className="bg-[#1B3022] text-[#FDFCFB] p-6 rounded-none flex justify-between items-center border border-[#1B3022]/10 shadow-sm">
              <div>
                <span className="bg-[#D97757]/15 border border-[#D97757]/30 text-[#D97757] text-[9px] font-bold px-2.5 py-1 rounded-none uppercase tracking-widest font-mono">Field Agent Portal</span>
                <h1 className="text-2xl font-serif font-black mt-2">Mobile Agronomic Auditing</h1>
                <p className="text-xs text-[#FDFCFB]/80 mt-1">Joseph Kuria (Landed Agent #EA-7741 - Nakuru)</p>
              </div>
              <div className="bg-white/10 border border-white/20 p-2 text-center backdrop-blur-xs min-w-36 font-mono">
                <p className="text-[8px] text-[#D97757] font-extrabold uppercase tracking-wider">Audit Services Earned</p>
                <p className="text-2xl font-black text-[#D97757]">KES {(reports.length * 3500).toLocaleString()}</p>
                <div className="text-[8px] mt-0.5 text-stone-300">@ KES 3,500 / audit report</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Form 1: Submit Field Audit Report */}
              <div className="lg:col-span-1 bg-white border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-[#D97757]" />
                  <h2 className="text-base font-serif font-black text-[#1B3022]">Submit Physical Verification</h2>
                </div>
                <p className="text-[11px] text-[#1B3022]/60 mb-4">Complete physical check list, inspect soil maps, and log coordinate stamps to unlock investor financing.</p>

                <form onSubmit={reportFarmId ? handleWorkerReport : (e) => e.preventDefault()} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">TARGET FARM PROPERTY</label>
                    <select
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2.5 outline-none focus:border-[#D97757] transition"
                      value={reportFarmId}
                      onChange={(e) => setReportFarmId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose unverified or pending --</option>
                      {farms.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">INSPECTION RESULT STATUS</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setReportStatus('passed')}
                        className={`flex-1 font-bold py-2 px-1 rounded-none transition border text-center text-[10px] uppercase tracking-wider ${
                          reportStatus === 'passed' ? 'bg-[#1B3022]/10 border-[#1B3022] text-[#1B3022]' : 'bg-stone-50 border-[#1B3022]/10 text-stone-600'
                        }`}
                      >
                        Passed (Clear)
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportStatus('flagged')}
                        className={`flex-1 font-bold py-2 px-1 rounded-none transition border text-center text-[10px] uppercase tracking-wider ${
                          reportStatus === 'flagged' ? 'bg-red-50 border-red-500 text-red-850 font-extrabold' : 'bg-stone-50 border-[#1B3022]/10 text-stone-600'
                        }`}
                      >
                        Flag Anomaly
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">COOPERATION & VISIBILITY RATING</label>
                    <select
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition"
                      value={reportRating}
                      onChange={(e) => setReportRating(e.target.value)}
                    >
                      <option value="5">5 Stars (Excellent / fully verified records)</option>
                      <option value="4">4 Stars (Compliant but minor repairs needed)</option>
                      <option value="3">3 Stars (Messy buffers / missing recent bills)</option>
                      <option value="2">2 Stars (Critical updates missing / uncooperative)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-[#D97757] tracking-wider uppercase mb-1">PROFESSIONAL INSPECTION AUDIT NOTES</label>
                    <textarea
                      rows={4}
                      className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none p-2 outline-none focus:border-[#D97757] transition resize-none"
                      placeholder="Record land usage, soil chemistry metrics, seed stocks verified, and coordinate checks..."
                      value={reportNotes}
                      onChange={(e) => setReportNotes(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1B3022] hover:bg-[#203728] text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-none transition shadow-sm cursor-pointer"
                    disabled={!reportFarmId}
                  >
                    Lock Inspection into Shamba Ledger (ES)
                  </button>
                </form>
              </div>

              {/* View 2: Verification queue assignment */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-base font-serif font-black text-[#1B3022]">Assigned Platform Audit Tasks</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farms.map(f => (
                    <div key={f.id} className="bg-white border border-[#1B3022]/10 rounded-none p-4 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] bg-[#F5F2EF] text-[#1B3022]/60 px-1.5 py-0.5 rounded-none border border-[#1B3022]/10 font-bold font-mono tracking-widest uppercase">{f.type}</span>
                          <h3 className="text-xs font-serif font-black text-[#1B3022] line-clamp-1 mt-1.5">{f.name}</h3>
                          <p className="text-[10px] text-[#1B3022]/50 mt-0.5">Manager: {f.farmerName}</p>
                        </div>
                        <span className={`text-[8px] font-bold font-mono tracking-widest uppercase px-1.5 py-0.5 rounded-none ${
                          f.verificationStatus === 'verified' ? 'bg-[#1B3022]/10 text-[#1B3022]' :
                          f.verificationStatus === 'flagged' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {f.verificationStatus?.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#1B3022]/70 font-sans">
                        <MapPin className="h-3 w-3 inline text-[#D97757] mr-1" />
                        <span>Coords: {f.locationCoords.lat}, {f.locationCoords.lng} • <strong>{f.sizeAcres} Acres</strong></span>
                      </div>

                      <div className="bg-[#F5F2EF]/50 p-2.5 rounded-none border border-[#1B3022]/5 text-[#1B3022]/80 text-[11px] leading-relaxed">
                        <strong>Farmer statement:</strong> {f.description}
                      </div>

                      <div className="pt-2 border-t border-[#1B3022]/10 flex justify-between items-center text-[10px]">
                        <span className="font-sans uppercase text-[#1B3022]/50 font-bold text-[9px] tracking-wider">Commission: <strong className="text-[#1B3022] font-mono">KES 3,500</strong></span>
                        <button
                          onClick={() => {
                            setReportFarmId(f.id);
                            logActivity('Began physical audit process', `Driving routes mapped for ${f.name}`);
                          }}
                          className="bg-[#D97757] hover:bg-[#c8623f] text-[#FDFCFB] border-none font-bold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-none cursor-pointer transition font-mono"
                        >
                          Inspect Path
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* PART D: THE COMPLIANCE ADMIN SECURITY CENTER */}
        {/* ========================================== */}
        {activeRole === 'admin' && (
          <div className="space-y-8 col-span-3">
            
            <div className="bg-[#1B3022] text-[#FDFCFB] p-6 rounded-none flex justify-between items-center border border-[#1B3022]/10 mb-2">
              <div>
                <span className="bg-[#D97757]/15 border border-[#D97757]/30 text-[#D97757] text-[9px] font-bold px-2.5 py-1 rounded-none uppercase tracking-widest font-mono">Compliance Dashboard</span>
                <h1 className="text-2xl font-serif font-black mt-2">Platform Safeguard Control Desk</h1>
                <p className="text-xs text-[#FDFCFB]/80 mt-1">Escrow allocations tracking & Fraud Telemetry Audits</p>
              </div>
              <div className="bg-white/10 border border-white/20 p-2 text-center backdrop-blur-xs min-w-36 font-mono">
                <p className="text-[8px] text-[#D97757] font-extrabold uppercase tracking-wider">System-wide Default Index</p>
                <p className="text-2xl font-black text-green-400">0.0%</p>
                <div className="text-[8px] mt-0.5 text-[#FDFCFB]/60">100% payout completion</div>
              </div>
            </div>

            {/* Admin Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left & Center: Audit Queue, Proposals, AI Telemetry Check */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* 1. AI TELEMETRY DISCREPANCY & ANOMALY ANALYZER */}
                <div className="bg-[#F5F2EF] border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-[#D97757]" />
                    <div>
                      <h2 className="text-base font-serif font-black text-[#1B3022]">AI Telemetry Anomaly Auditor</h2>
                      <p className="text-[10px] text-[#1B3022]/60">Scans timeline inputs against regional cultivation growth cycle structures via Gemini AI</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                      <label className="block text-[9px] font-bold text-[#D97757] uppercase mb-1 tracking-wider">Select an active harvest land listing</label>
                      <select
                        className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none px-3 py-2 text-xs focus:border-[#D97757] outline-none"
                        value={anomalyTargetFarm}
                        onChange={(e) => setAnomalyTargetFarm(e.target.value)}
                      >
                        {farms.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.cropType})</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleAIAnomalyAssessment}
                      disabled={aiAnomalyLoading}
                      className="bg-[#1B3022] hover:bg-[#2c4734] text-white font-bold text-[10px] uppercase tracking-widest py-2 px-5 rounded-none transition shadow-sm sm:mt-5 w-full sm:w-auto h-9.5 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {aiAnomalyLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Computing Audit telemetry...</span>
                        </>
                      ) : (
                        <>
                          <Activity className="h-4 w-4 text-[#D97757]" />
                          <span>Launch AI Telemetry check</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Anomaly Auditor Output Display */}
                  <AnimatePresence>
                    {aiAnomalyData && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-white border-2 border-[#1B3022]/20 rounded-none p-5 mt-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b border-[#1B3022]/10 pb-2">
                          <span className="text-xs font-serif font-black text-[#1B3022] uppercase tracking-wider flex items-center gap-1.5">
                            <Shield className="h-4 w-4 text-[#D97757]" />
                            Discrepancy Evaluation Report
                          </span>
                          <span className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded-none ${
                            aiAnomalyData.riskScore > 50 ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-[#1B3022]/10 text-[#1B3022]'
                          }`}>
                            Risk Score: {aiAnomalyData.riskScore}%
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-[9px] text-[#D97757] font-bold uppercase tracking-wider mb-1.5 font-mono">Flagged Findings</p>
                            <ul className="space-y-1.5">
                              {aiAnomalyData.findings && aiAnomalyData.findings.map((finding: string, idx: number) => (
                                <li key={idx} className="text-xs text-[#1B3022]/85 flex items-start gap-1 pb-1 border-b border-[#1B3022]/5 leading-relaxed font-sans">
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>{finding}</span>
                                </li>
                              ))}
                              {(!aiAnomalyData.findings || aiAnomalyData.findings.length === 0) && (
                                <p className="text-xs text-[#1B3022]/50 italic">No anomalous metrics raised by criteria.</p>
                              )}
                            </ul>
                          </div>

                          <div className="bg-[#F5F2EF]/50 rounded-none p-3.5 border border-[#1B3022]/10">
                            <p className="text-[9px] text-[#1B3022]/50 font-bold uppercase tracking-wider font-mono">Agronomic Risk Profile</p>
                            <p className="text-xs text-[#1B3022]/80 mt-1 pb-2 border-b border-[#1B3022]/10 leading-relaxed font-sans">
                              {aiAnomalyData.riskExplanation}
                            </p>
                            <div className="flex justify-between items-center mt-2.5">
                              <span className="text-[9px] text-[#D97757] font-bold tracking-wider uppercase font-mono">Recommended Decision</span>
                              <span className="text-[10px] font-bold font-mono tracking-wider uppercase bg-red-50 text-red-800 border border-red-200 p-0.5 px-2 rounded-none">
                                {aiAnomalyData.recommendedAction}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2.5 mt-4 pt-3 border-t border-[#1B3022]/10">
                          {aiAnomalyData.recommendedAction === 'suspend' && (
                            <button
                              onClick={() => handleAdminFlagSuspicious(anomalyTargetFarm)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] uppercase tracking-widest px-3.5 py-1.5 rounded-none cursor-pointer"
                            >
                              Impose listing lockdown
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const updatedInvs = farms.map(f => {
                                if (f.id === anomalyTargetFarm) {
                                  return { ...f, verificationStatus: 'verified' as const };
                                }
                                return f;
                              });
                              updateFarmsState(updatedInvs);
                              logActivity('Cleared Farm Security Review', 'Manually override risk evaluation logs as fully compliant');
                              triggerNotification('Safety Clear', 'Manual override accepted.', 'info');
                            }}
                            className="bg-[#1B3022] hover:bg-[#203728] text-white font-bold text-[9px] uppercase tracking-widest px-3.5 py-1.5 rounded-none ml-auto cursor-pointer"
                          >
                            Mark completely cleared
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. REGISTERED UNVERIFIED LAND LISTING PROPOSALS */}
                <div className="space-y-4">
                  <h2 className="text-base font-serif font-black text-[#1B3022]">Compliance Auditing Queues</h2>
                  
                  <div className="space-y-3">
                    {farms.length === 0 ? (
                      <p className="text-xs text-[#1B3022]/40 text-center py-6 font-serif">Listing pipeline is clear.</p>
                    ) : (
                      farms.map((farm) => (
                        <div key={farm.id} className="bg-white border border-[#1B3022]/10 rounded-none p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] bg-[#F5F2EF] text-[#1B3022]/60 px-1.5 py-0.5 rounded-none border border-[#1B3022]/10 font-bold font-mono tracking-widest uppercase">
                                {farm.type}
                              </span>
                              <h3 className="text-xs font-serif font-black text-[#1B3022]">{farm.name}</h3>
                            </div>
                            <p className="text-[10px] text-[#1B3022]/70 mt-1">
                              Owner: <strong>{farm.farmerName} (Viability: {farm.farmerCreditScore}/100)</strong>
                            </p>
                            <p className="text-[10px] text-[#1B3022]/70">
                              Capital requested: <strong>KES {farm.targetCapital.toLocaleString()}</strong> • Status: <strong className="text-[#D97757] uppercase font-bold tracking-wider text-[9px]">{farm.status}</strong>
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5">
                            {farm.verificationStatus === 'unverified' && (
                              <button
                                onClick={() => handleAdminApproveFarm(farm.id)}
                                className="bg-[#1B3022] hover:bg-[#2c4734] text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 text-center rounded-none cursor-pointer transition shadow-xs"
                              >
                                Approve to inspection queue
                              </button>
                            )}

                            {farm.status === 'active' && (
                              <button
                                onClick={() => handleAdminTriggerPayout(farm.id)}
                                className="bg-[#D97757] hover:bg-[#c8623f] text-[#FDFCFB] font-bold text-[9px] uppercase tracking-widest px-3 py-1 flex items-center gap-1 rounded-none cursor-pointer transition shadow-xs"
                              >
                                <CheckSquare className="h-3 w-3" />
                                Release harvest settlement escrow
                              </button>
                            )}

                            <button
                              onClick={() => handleAdminFlagSuspicious(farm.id)}
                              className="text-[9px] text-[#D97757] hover:text-red-650 font-extrabold uppercase tracking-wider transition cursor-pointer"
                            >
                              Lock listing
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Right Admin Panel: Activity Ledger */}
              <div className="space-y-6">
                
                <div className="bg-[#FDFCFB] border border-[#1B3022]/10 rounded-none p-6 shadow-sm">
                  <h2 className="text-base font-serif font-black text-[#1B3022] mb-3">Escrow ledger activity logs</h2>
                  
                  <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="text-xs pb-3 border-b border-[#1B3022]/5 font-normal">
                        <div className="flex justify-between text-[10px] text-[#1B3022]/40 font-medium">
                          <span className="font-extrabold uppercase text-[#D97757] font-mono tracking-wider text-[8px]">{log.userRole}</span>
                          <span className="font-mono text-[9px] text-[#1B3022]/40">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="font-serif font-black text-[#1B3022] mt-0.5">{log.action}</p>
                        <p className="text-[11px] text-[#1B3022]/60 mt-0.5 font-sans leading-relaxed">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3. OPTIONAL MODALS / FLUID PORTAL BACKDROP */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-[#121212]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FDFCFB] rounded-none max-w-sm w-full p-6 shadow-2xl border border-[#1B3022]/15"
          >
            <h3 className="font-serif font-black text-lg text-[#1B3022]">Credit Escrow Capital</h3>
            <p className="text-[11px] text-[#1B3022]/60 mt-1 font-sans">Simulates mobile payment checkout via local KES API interfaces.</p>

            <form onSubmit={handleDeposit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[9px] font-bold text-[#D97757] uppercase mb-1 tracking-wider font-mono">CAPITAL CONTRIBUTION VALUE (KES)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-stone-400 text-xs font-mono">KES</span>
                  <input
                    type="number"
                    step="5000"
                    placeholder="e.g. 100000"
                    className="pl-12 pr-3 py-2 text-xs font-mono w-full bg-white border border-[#1B3022]/20 rounded-none focus:border-[#D97757] outline-none"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-[#F5F2EF] text-[#1B3022] p-2.5 rounded-none border border-[#1B3022]/10 text-[10px] leading-relaxed font-sans">
                <strong>Protected Placement:</strong> Contribution funds are held securely in a licensed custodian account, governed strictly under physical verification rules.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-stone-150 hover:bg-stone-200 text-stone-600 font-bold text-[10px] py-2 rounded-none uppercase tracking-widest cursor-pointer transition border border-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1B3022] hover:bg-[#203728] text-white font-bold text-[10px] py-2 rounded-none uppercase tracking-widest cursor-pointer transition shadow"
                >
                  Confirm checkout
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showInvestModal && (
        <div className="fixed inset-0 bg-[#121212]/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FDFCFB] rounded-none max-w-md w-full p-6 shadow-2xl border border-[#1B3022]/15"
          >
            <h3 className="font-serif font-black text-lg text-[#1B3022]">Acquire Shamba Units (Shares)</h3>
            <p className="text-[11px] text-[#1B3022]/60 mt-1 font-sans">Vetting: ID {showInvestModal.id} • Verified management metrics apply.</p>

            <form onSubmit={handleAcquireUnits} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 bg-[#F5F2EF] p-3 rounded-none border border-[#1B3022]/10 font-mono">
                <div>
                  <p className="text-[8px] text-[#1B3022]/50 font-bold uppercase tracking-wider">UNIT INCREMENT COST</p>
                  <span className="font-mono text-xs font-black text-[#1B3022]">KES {showInvestModal.unitPrice.toLocaleString()}</span>
                </div>
                <div>
                  <p className="text-[8px] text-[#1B3022]/50 font-bold uppercase tracking-wider">EXPECTED ROI CONTRACT</p>
                  <span className="text-xs font-black text-[#D97757]">+{showInvestModal.expectedROI}% expected</span>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#D97757] uppercase mb-1 tracking-wider font-mono">ACQUISITION SIZE (UNITS)</label>
                <input
                  type="number"
                  min="1"
                  max={String(showInvestModal.totalUnits - showInvestModal.fundedUnits)}
                  className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none px-3 py-2 text-xs font-mono outline-none focus:border-[#D97757]"
                  value={investUnits}
                  onChange={(e) => setInvestUnits(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-[#D97757] uppercase mb-1 tracking-wider font-mono">INVEST VIA SYNDICATE POOL (OPTIONAL)</label>
                <select
                  className="w-full bg-white border border-[#1B3022]/20 text-[#1B3022] rounded-none px-3 py-2 text-xs font-semibold focus:border-[#D97757] outline-none"
                  value={investChamaId}
                  onChange={(e) => setInvestChamaId(e.target.value)}
                >
                  <option value="">Direct individual allocation (Escrow wallet)</option>
                  {chamas.map(c => (
                    <option key={c.id} value={c.id}>{c.name} (Pool reserve: KES {c.totalBalance.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              {/* Total display */}
              <div className="flex justify-between items-center text-xs pt-2 border-t border-[#1B3022]/10 font-mono">
                <span className="text-[#1B3022]/50 font-bold uppercase text-[9px]">TOTAL ESCROW LOCK VALUE:</span>
                <strong className="font-mono text-sm font-black text-[#1B3022]">
                  KES {(Number(investUnits) * showInvestModal.unitPrice).toLocaleString()}
                </strong>
              </div>

              <div className="flex gap-2 mt-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInvestModal(null);
                    setInvestUnits('1');
                    setInvestChamaId('');
                  }}
                  className="flex-grow bg-stone-150 hover:bg-stone-200 text-stone-600 font-bold text-[10px] py-2 rounded-none uppercase tracking-widest cursor-pointer transition border border-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-grow bg-[#1B3022] hover:bg-[#203728] text-white font-bold text-[10px] py-2 rounded-none uppercase tracking-widest cursor-pointer transition shadow"
                >
                  Confirm acquisition
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* FOOTER METRICS INFO */}
      <footer className="bg-[#1B3022] text-[#FDFCFB]/50 border-t-2 border-[#1B3022] py-12 px-4 text-center mt-12 text-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-400 animate-pulse" />
            <span className="font-serif italic font-bold text-[#FDFCFB]">SHAMBA Escrow Systems Africa</span>
          </div>
          <p className="max-w-md mx-auto text-[11px] leading-relaxed text-[#FDFCFB]/70 font-sans">
            Registered securities intermediary trial playground. Licensed physical custody escrow model designed in Nairobi, Kenya. Built in full-stack App Router compliance, integrating modern Gemini match matrices.
          </p>
          <p className="text-[10px] text-[#FDFCFB]/40 font-mono uppercase tracking-widest mt-2">© 2026 SHAMBA. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
