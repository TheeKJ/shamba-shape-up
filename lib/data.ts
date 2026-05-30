import { Farm, Chama, WorkerReport, CreditScoreProfile, Notification, ActivityLog, PlatformStats } from '@/types';

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Rift Valley Maize & Grain Elevators',
    farmerId: 'farmer-ezekiel',
    farmerName: 'Ezekiel Kiprotich',
    location: 'Nakuru County',
    country: 'Kenya',
    type: 'crops',
    cropType: 'White Maize (H614) & Wheat',
    sizeAcres: 45,
    targetCapital: 1500000, // KES 1.5M
    fundedCapital: 1250000, // 83% funded
    unitPrice: 5000, // KES
    totalUnits: 300,
    fundedUnits: 250,
    yieldHistory: 'Average 35 bags (90kg) per acre over last 4 seasons. 100% contracts fulfilled.',
    farmerCreditScore: 94,
    riskLevel: 'low',
    expectedROI: 18, // 18% ROI
    durationMonths: 6,
    status: 'funding',
    imageUrl: 'https://picsum.photos/seed/maize_farm/800/600',
    description: 'This seasonal project funds top-tier seeds, mechanization, and direct off-take agreements with Nakuru Millers. Ezekiel has farmed this tract safely for 14 years and maintains a perfect loan and contract repayment history.',
    locationCoords: { lat: -0.303, lng: 36.08 },
    verificationStatus: 'verified',
    updates: [
      {
        id: 'update-1-1',
        timestamp: '2026-05-15T08:00:00Z',
        type: 'verification',
        title: 'Initial Land Inspection Passed',
        description: 'Field Agent Joseph Kuria completed a soil-chemistry test and verified physical boundaries. Nitrogen levels are optimal. Boundaries correspond 100% to Title Deed #NK-20412.',
        imageUrl: 'https://picsum.photos/seed/inspection_maize/800/600',
        latitude: -0.3031,
        longitude: 36.0805,
        workerId: 'worker-joseph',
      },
      {
        id: 'update-1-2',
        timestamp: '2026-05-28T14:30:00Z',
        type: 'receipt',
        title: 'Yara Fertilizer Consignment Procured',
        description: 'Farmer Ezekiel Kiprotich uploaded purchase orders and delivery notes for 60 bags of Yara-Mila Power planting fertilizer. Funded via preliminary capital release escrow.',
      }
    ],
  },
  {
    id: 'farm-2',
    name: 'Lake Victoria Tilapia Aquacages',
    farmerId: 'farmer-otieno',
    farmerName: 'Otieno Omondi',
    location: 'Kisumu County (Dunga Beach)',
    country: 'Kenya',
    type: 'aquaculture',
    cropType: 'Nile Tilapia (Oreochromis)',
    sizeAcres: 5,
    targetCapital: 850000,
    fundedCapital: 850000, // 100% funded!
    unitPrice: 5000,
    totalUnits: 170,
    fundedUnits: 170,
    yieldHistory: 'Produced 12.5 metric tonnes of prime Tilapia across 3 floating cage setups last year.',
    farmerCreditScore: 82,
    riskLevel: 'medium',
    expectedROI: 22,
    durationMonths: 8,
    status: 'active',
    imageUrl: 'https://picsum.photos/seed/fish_farm/800/600',
    description: 'Funding the fabrication of 4 additional high-density polyethylene floating cages and premium feed pellets from Aller Aqua. Otieno has partnered with Dunga Beach Co-op for rapid cold-chain transport directly to Nairobi markets.',
    locationCoords: { lat: -0.147, lng: 34.738 },
    verificationStatus: 'verified',
    updates: [
      {
        id: 'update-2-1',
        timestamp: '2026-04-10T11:00:00Z',
        type: 'progress',
        title: 'Hatchery Stocking Complete',
        description: '24,000 mono-sex fingerlings successfully loaded into the primary rearing grids. Water temperature is registered at a healthy 26.4°C.',
        imageUrl: 'https://picsum.photos/seed/fingerlings/800/600',
        latitude: -0.1475,
        longitude: 34.7382,
      },
      {
        id: 'update-2-2',
        timestamp: '2026-05-20T09:15:00Z',
        type: 'verification',
        title: 'Agent Feed-Audit and Grid Inspection',
        description: 'Field Agent Beatrice Akoth inspected feeding logs and verified net mesh integrity. Minor algae growth noted on Cage 2 but addressed during visit. Feed supplies are matching warehouse receipts perfectly.',
        workerId: 'worker-beatrice',
        latitude: -0.1469,
        longitude: 34.7378,
      }
    ],
  },
  {
    id: 'farm-3',
    name: 'Murang\'a Hass Export Avocado Orchard',
    farmerId: 'farmer-grace',
    farmerName: 'Grace Wambui',
    location: 'Murang\'a County',
    country: 'Kenya',
    type: 'cash_crops',
    cropType: 'Hass Avocados (Export Grade)',
    sizeAcres: 12,
    targetCapital: 1000000,
    fundedCapital: 950000, // 95% funded
    unitPrice: 5000,
    totalUnits: 200,
    fundedUnits: 190,
    yieldHistory: 'Sourced 80,000 export-compliant avocados last season. Sells directly to Kakuzi PLC.',
    farmerCreditScore: 91,
    riskLevel: 'low',
    expectedROI: 16,
    durationMonths: 10,
    status: 'funding',
    imageUrl: 'https://picsum.photos/seed/avocado_farm/800/600',
    description: 'This capital pool funds drip-irrigation expansion and global G.A.P. compliance certification for Grace\'s premium avocado smallholding. This ensures access to key European off-takers during the prime autumn export window.',
    locationCoords: { lat: -0.721, lng: 37.151 },
    verificationStatus: 'verified',
    updates: [
      {
        id: 'update-3-1',
        timestamp: '2026-05-01T10:00:00Z',
        type: 'verification',
        title: 'Water Extraction Permit Validated',
        description: 'Field Agent Joseph Kuria validated the Murang\'a Water & Sanitation Company license to run micro-sprinkler pumps from the river basin.',
        workerId: 'worker-joseph',
        latitude: -0.7208,
        longitude: 37.152,
      }
    ],
  },
  {
    id: 'farm-4',
    name: 'Naivasha Hydroponic Smart-Tomato Greenhouses',
    farmerId: 'farmer-njuguna',
    farmerName: 'Njuguna Kuria',
    location: 'Nakuru County (Naivasha)',
    country: 'Kenya',
    type: 'crops',
    cropType: 'Anna F1 Tomatoes',
    sizeAcres: 3,
    targetCapital: 600000,
    fundedCapital: 600000, // 100% funded!
    unitPrice: 5000,
    totalUnits: 120,
    fundedUnits: 120,
    yieldHistory: 'Greenhouse yield is 3x outdoor farms. Handled 18 tonnes of grade-A table tomatoes last year.',
    farmerCreditScore: 89,
    riskLevel: 'medium',
    expectedROI: 20,
    durationMonths: 5,
    status: 'harvesting',
    imageUrl: 'https://picsum.photos/seed/tomato_greenhouse/800/600',
    description: 'Funds the seedling rotation, soluble nutrient packs, and smart sensors for coco-peat hydroponics. Harvest is locked to supply major supermarket chains in Nairobi under pre-negotiated fixed price contracts.',
    locationCoords: { lat: -0.718, lng: 36.435 },
    verificationStatus: 'verified',
    updates: [
      {
        id: 'update-4-1',
        timestamp: '2026-05-10T15:00:00Z',
        type: 'progress',
        title: 'Nutrient Balance & Flowering Stage',
        description: 'Anna F1 plants have reached 98% cluster flowering. Ec and pH regulators are monitoring irrigation feeds perfectly twice a day.',
      },
      {
        id: 'update-4-2',
        timestamp: '2026-05-29T11:00:00Z',
        type: 'progress',
        title: 'Primary Fruit Harvest - Batch 1',
        description: 'First harvest of 1.4 tonnes harvested this morning! Handgraded, packed in reusable plastic crates, and loaded into colder transport heading to Naivas supermarket Nairobi holding warehouse.',
        imageUrl: 'https://picsum.photos/seed/tomatoes_harvest/800/600',
      }
    ],
  },
  {
    id: 'farm-5',
    name: 'Coastal Cashews & Beehaven',
    farmerId: 'farmer-fatuma',
    farmerName: 'Fatuma Ali',
    location: 'Kilifi County (Malindi)',
    country: 'Kenya',
    type: 'cash_crops',
    cropType: 'Anacardium & Organic Honey',
    sizeAcres: 15,
    targetCapital: 500000,
    fundedCapital: 250000, // 50% funded
    unitPrice: 5000,
    totalUnits: 100,
    fundedUnits: 50,
    yieldHistory: 'Cashew trees aged 8 years producing high-yield raw nuts. Honey is a new yield-stacking integration.',
    farmerCreditScore: 78,
    riskLevel: 'medium',
    expectedROI: 24,
    durationMonths: 12,
    status: 'funding',
    imageUrl: 'https://picsum.photos/seed/cashews_honey/800/600',
    description: 'Funding the installation of 50 Langstroth smart beehives hanging under cashew trees. This dual setup triples pollination outcomes while creating secondary premium high-revenue organic comb honey products.',
    locationCoords: { lat: -3.219, lng: 40.116 },
    verificationStatus: 'pending',
    updates: [],
  },
  {
    id: 'farm-6',
    name: 'Laikipia Dorper Mutton Sheep Ranching',
    farmerId: 'farmer-leleshwa',
    farmerName: 'Ekuam Leleshwa',
    location: 'Laikipia County',
    country: 'Kenya',
    type: 'livestock',
    cropType: 'Purebred Dorper Sheep',
    sizeAcres: 80,
    targetCapital: 1200000,
    fundedCapital: 1200000, // 100% funded!
    unitPrice: 5000,
    totalUnits: 240,
    fundedUnits: 240,
    yieldHistory: 'Sells high-weight breeding rams and prime cuts to Nairobi gourmet butchers. 98% survival rate.',
    farmerCreditScore: 92,
    riskLevel: 'medium',
    expectedROI: 19,
    durationMonths: 9,
    status: 'harvesting',
    imageUrl: 'https://picsum.photos/seed/dorper_sheep/800/600',
    description: 'This listing funds smart herd collars, professional veterinarian visits, and rotational pasture fencing. High mutton market demand ensures pre-sold lots.',
    locationCoords: { lat: 0.054, lng: 37.073 },
    verificationStatus: 'verified',
    updates: [
      {
        id: 'update-6-1',
        timestamp: '2026-05-12T07:20:00Z',
        type: 'verification',
        title: 'Vaccination and Ear Tag Audit',
        description: 'Field Agent Beatrice Akoth visited the ranch. Tag records matched inventory perfectly. Foot rot treatments completed on 4 sheep. Overall herd health scoring is exceptionally high.',
        workerId: 'worker-beatrice',
        latitude: 0.0545,
        longitude: 37.0728,
      }
    ],
  }
];

export const INITIAL_CHAMAS: Chama[] = [
  {
    id: 'chama-nairobi-tech',
    name: 'Nairobi Tech Professionals Syndicate',
    creatorId: 'investor-joel',
    creatorName: 'Joel Ndoho',
    description: 'A close group of software creators pooling money monthly into low-to-medium risk cereal and cash crop farms in Kiambu and Rift Valley.',
    members: [
      { userId: 'investor-joel', name: 'Joel Ndoho', contribution: 150000, role: 'admin' },
      { userId: 'investor-wambu', name: 'Wambui Kimani', contribution: 100000, role: 'member' },
      { userId: 'investor-mwangi', name: 'Mwangi Githinji', contribution: 50000, role: 'member' },
    ],
    totalBalance: 300000,
    activeInvestmentsCount: 2,
  },
  {
    id: 'chama-mombasa-road',
    name: 'Mombasa Road Investment Circle',
    creatorId: 'investor-lucy',
    creatorName: 'Lucy Mwende',
    description: 'Retail traders based in Mombasa Rd & Syokimau focused strictly on high ROI aquaculture and greenhouse listings.',
    members: [
      { userId: 'investor-lucy', name: 'Lucy Mwende', contribution: 80000, role: 'admin' },
      { userId: 'investor-sam', name: 'Samuel Otieno', contribution: 120000, role: 'member' }
    ],
    totalBalance: 200000,
    activeInvestmentsCount: 1,
  }
];

export const INITIAL_REPORTS: WorkerReport[] = [
  {
    id: 'report-1',
    farmId: 'farm-1',
    farmName: 'Rift Valley Maize & Grain Elevators',
    workerId: 'worker-joseph',
    workerName: 'Joseph Kuria',
    visitDate: '2026-05-15',
    status: 'passed',
    workerNotes: 'Superb farm layout. Ezekiel Kiprotich is cooperative. Tractors are accounted for, grain stores have proper ventilation. Highly recommend for platform listing.',
    rating: 5,
    anomalyDetected: false,
  },
  {
    id: 'report-2',
    farmId: 'farm-2',
    farmName: 'Lake Victoria Tilapia Aquacages',
    workerId: 'worker-beatrice',
    workerName: 'Beatrice Akoth',
    visitDate: '2026-05-20',
    status: 'passed',
    workerNotes: 'Fish cages are physically strong. Feeding schedules are tracked closely. Suggested minor repair to the feed storing shack to block rainfall seepage.',
    rating: 4,
    anomalyDetected: false,
  }
];

export const INITIAL_CREDIT_SCORES: CreditScoreProfile[] = [
  {
    userId: 'farmer-ezekiel',
    userRole: 'farmer',
    score: 94,
    breakdown: [
      { label: 'Yield Consistency', value: '98% on-target', impact: 'positive' },
      { label: 'On-time Delivery', value: '4 seasons perfect', impact: 'positive' },
      { label: 'Verification Audits', value: 'Perfect compliance', impact: 'positive' },
      { label: 'Agent Rating Average', value: '4.8 stars', impact: 'positive' }
    ],
    history: [
      { date: '2026-05-01', score: 94, reason: 'Passed seasonal verification with flying colors.' },
      { date: '2026-02-10', score: 92, reason: 'Harvest volume exceeded initial target by 4%.' }
    ]
  },
  {
    userId: 'investor-joel',
    userRole: 'investor',
    score: 88,
    breakdown: [
      { label: 'Contribution Consistency', value: 'Monthly stable', impact: 'positive' },
      { label: 'Completed Cycles', value: '3 full harvests', impact: 'positive' },
      { label: 'Platform Dispute Record', value: '0 complaints', impact: 'positive' }
    ],
    history: [
      { date: '2026-04-15', score: 88, reason: 'Successful reinvestment of Tilapia payouts.' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: 'Platform Upgrade',
    message: 'Welcome to SHAMBA! AI-powered matching and Chama modes are now live for all users in East Africa.',
    type: 'info',
    date: '2026-05-29T10:00:00Z',
    read: false,
  },
  {
    id: 'notif-2',
    userId: 'investor-joel',
    title: 'Payout Success',
    message: 'Tilapia Aquaculture Phase 1 payout of KES 59,000 has been transferred successfully to your platform escrow wallet.',
    type: 'payout',
    date: '2026-05-28T16:20:00Z',
    read: false,
  },
  {
    id: 'notif-3',
    userId: 'farmer-ezekiel',
    title: 'Listing Boosted',
    message: 'Your listing "Rift Valley Maize & Grain" has been designated as fully verified. It is now featured on the matching feed!',
    type: 'success',
    date: '2026-05-27T11:00:00Z',
    read: true,
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    userId: 'investor-joel',
    userRole: 'investor',
    userName: 'Joel Ndoho',
    action: 'Invested in farm',
    details: 'Acquired 10 units of Rift Valley Maize & Grain Elevators (KES 50,000)',
    timestamp: '2026-05-30T09:12:00Z',
  },
  {
    id: 'log-2',
    userId: 'worker-joseph',
    userRole: 'worker',
    userName: 'Joseph Kuria',
    action: 'Verified Farm',
    details: 'Completed physical verification report for Murang\'a Avocado Orchard',
    timestamp: '2026-05-29T14:45:00Z',
  },
  {
    id: 'log-3',
    userId: 'farmer-ezekiel',
    userRole: 'farmer',
    userName: 'Ezekiel Kiprotich',
    action: 'Submitted Update',
    details: 'Uploaded purchase receipt document for planting fertilizers (KES 180,000)',
    timestamp: '2026-05-28T14:32:00Z',
  }
];

export const INITIAL_STATS: PlatformStats = {
  totalCapitalInvested: 4150000,
  activeFarmsCount: 6,
  averageROI: 19.5,
  payoutsCompleted: 182,
  defaultRate: 0.0,
};
