
export enum ClientStage {
  PROSPECT = 'PROSPECT', 
  ACTIVE = 'ACTIVE',     
  CHURN = 'CHURN',       
}

export interface MetricPoint {
  date: string;
  value: number;
  comparison?: number; 
  ideal?: number;      
  forecast?: number;   
}

export interface MetricValue {
  current: number; // 年初至今总额
  yoy: number;    // 同比变化率 (%)
}

export interface AppInMatrix {
  id: string;
  name: string;
  icon: string;
  cooperation: {
    promotion: boolean;
    preinstall: boolean;
    joint: boolean;
    push: boolean;
  };
  directSpend: MetricValue;
  dspSpend: MetricValue;
  jointRevenue: MetricValue;
  preinstallRevenue: MetricValue;
  pushRevenue: MetricValue;
}

export interface InfoHistoryEntry {
  id: string;
  date: string;
  content: string;
}

export interface InfoCategory {
  summary: string;
  history: InfoHistoryEntry[];
}

export interface CorporateBasicInfo {
  history: InfoCategory;
  strategy: InfoCategory;
  productLayout: InfoCategory;
  businessStatus: InfoCategory;
  orgStructure: InfoCategory;
  budgetAllocation: InfoCategory;
  evaluationMethod: InfoCategory;
  attributionMethod: InfoCategory;
}

export interface ChannelTrendPoint {
  date: string;
  [key: string]: number | string; // Allows dynamic channel keys like 'AppGallery', 'Douyin', etc.
}

export interface QualityMetricData {
  '1d': ChannelTrendPoint[];
  '3d': ChannelTrendPoint[];
  '7d': ChannelTrendPoint[];
  '14d': ChannelTrendPoint[];
}

export interface AppVersionNode {
  version: string;
  releaseDate: string;
  type: 'MAJOR' | 'MINOR' | 'HOTFIX';
  releaseNotes: string[];
  ecosystemAdoptions: string[];
  businessImpact?: string;
}

export interface AppUpdateDynamicsData {
  aiTrendSummary: string;
  updateTrend: {
    totalVersions: number;
    avgUpdateCycleDays: number;
    categoryMedianDays: number;
    monthlyReleases: { month: string; count: number }[];
  };
  versionCoverage: {
    latestVersionCoverage: number;
    latestVersionUsers: string;
    adoptionCurve: { day: string; coverage: number }[];
    penetrationMilestones: { target: string; days: number }[];
    versionCohort: { label: string; percentage: number; users: string; colorClass: string; color?: string }[];
  };
  timeline: AppVersionNode[];
}

export interface AppDownloadAnalysisData {
  totalDownloads: {
    formatted: string;
    categoryRank: number;
  };
  recent30DaysDownloads: {
    formatted: string;
    categoryRank: number;
  };
  channelDownloads30Days: any[];
  appGalleryBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

export interface PerformanceMetric {
  id: string;
  label: string;
  ourValue: string;
  progress: {
    ourValue: number;
    networkAverage: number;
    networkMax: number;
  };
  trendData: any[]; // Array of objects with 'period' and channel keys
}

export interface PlatformPerformanceData {
  metrics: PerformanceMetric[];
}

export interface HarmonyOSKit {
  id: string;
  name: string;
  avgDailyCalls: string;
  dailyData: { date: string; calls: number }[];
}

export interface UserAnalysisData {
  aiSummary: string;
  scaleMetrics: {
    installedUsers: string;
    avgDau30d: string;
    mau30d: string;
    stickiness: string;
    avgDailyUsageTime: string;
    avgDailyUsageCount: string;
  };
  health: {
    label: string;
    value: number;
    users: string;
    color: string;
    tip: string;
  }[];
  persona: {
    deviceValue: { label: string; value: number; color: string }[];
    cityTier: { label: string; value: number; color: string }[];
    age: { label: string; value: number; color: string }[];
    spendingPower: { label: string; value: number; color: string }[];
  };
}

export interface DistributionOverviewData {
  aiSummary: string;
  funnel: {
    impressions: string;
    downloads: string;
    installs: string;
    activations: string;
    conversionRates: {
      impressionToDownload: string;
      downloadToInstall: string;
      installToActivation: string;
    }
  };
  trafficSources: {
    label: string;
    percentage: number;
    value: string;
    color: string;
  }[];
}

export interface AppCKBProfile {
  id: string;
  name: string;
  icon: string;
  version: string;
  developer: string;
  firstReleaseDate: string;
  operatingDays: number;
  categories: { primary: string; secondary: string[] };
  cooperation: {
    promotion: boolean;
    preinstall: boolean;
    push: boolean;
    joint: boolean;
  };
  platformMatrix: {
    platform: string;
    downloads: number;
    uninstalls: number;
    mau: number;
  }[];
  platformPerformance: PlatformPerformanceData;
  downloadAnalysis: AppDownloadAnalysisData;
  competitors: {
    id: string;
    name: string;
    icon: string;
    installShare: number;
    overlapRate: number;
    winRate: number;
  }[];
  health: {
    retention: QualityMetricData;
    uninstall: QualityMetricData;
    uninstallTrend: {
      avgDailyUninstalls: string;
      dailyData: { date: string; uninstalls: number }[];
    };
  };
  userAnalysis: UserAnalysisData;
  distributionOverview: DistributionOverviewData;
  updateDynamics: AppUpdateDynamicsData;
  harmonyOSKits?: HarmonyOSKit[];
}

export interface DecisionMaker {
  id: string;
  name: string;
  title: string;
  department: string; 
  role: 'DECISION' | 'INFLUENCER' | 'EXECUTION';
  decisionPower: 'HIGH' | 'MEDIUM' | 'LOW'; 
  contact: string;
  avatar?: string;
  workExperience: string[]; 
  education: string[]; 
  remarks: string; 
  responsibleBusiness: string[]; 
  reportsTo?: string; 
}

export interface IssueItem {
  id: string;
  description: string;   // 问题描述
  owner: string;         // 责任人
  status: 'IN_PROGRESS' | 'CLOSED'; // 当前状态
  progress: string;      // 最新进展
}

export interface ItineraryNode {
  id: string;
  date: string;
  time: string;
  content: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  title: string;
  location: string;      // 地点
  internalParticipants: string[]; // 我方出席人员
  clientParticipants: string[];   // 客户方出席人员
  mainContent: string;    // 会晤主要内容/会谈要点
  conclusions: string;    // 会晤结论
  items: IssueItem[];     // 遗留问题
  clientDemands?: string;   // 客户侧诉求
  internalDemands?: string; // 我方诉求
  itinerary?: ItineraryNode[]; // 行程安排
}

export interface ClientProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  stage: ClientStage;
  tier: 'S' | 'A' | 'B' | 'C';
  corporateEntity: string;
  accountRating: string;
  // 新增合作业务字段
  cooperation: {
    promotion: boolean;
    preinstall: boolean;
    push: boolean;
    joint: boolean;
  };
  decisionTeam: DecisionMaker[];
  appMatrix: AppInMatrix[];
  dynamics: DynamicInfo[];
  visitHistory: VisitRecord[]; 
  corporateBasicInfo: CorporateBasicInfo; 
  financials: {
    balance: number;
    creditLimit: number;
    rebateRate: number;
    walletRunwayDays: number;
    annualBudget: number;
    // 拆分预算
    promotionBudget: number;
    preinstallBudget: number;
    pushBudget: number;
    jointBudget: number;
    
    annualSpend: number;
  };
  performanceTargets: {
    spend: { current: number; target: number; avg: number; history: MetricPoint[] };
    activationRate: { current: number; target: number; avg: number; history: MetricPoint[] };
    retentionRate: { current: number; target: number; avg: number; history: MetricPoint[] };
    cvr: { current: number; target: number; avg: number; history: MetricPoint[] };
  };
  annualSpendHistory: { 
    date: string; 
    actual?: number; 
    forecast: number; 
    lastYearActual: number; 
  }[]; 
  hourlySpend: MetricPoint[];
  dailySpendTrend: MetricPoint[];
  budgetUtilization: number;
  churnProbability7d: number;
  multiChannelQuality: any[];
}

export interface DynamicInfo {
  type: 'UPDATE' | 'FINANCE' | 'STRATEGY';
  title: string;
  date: string;
  content: string;
  budgetImpact: 'UP' | 'DOWN' | 'STABLE';
  source?: string;
  url?: string;
}

export interface InsightResponse {
  summary: string;
  actionItems: string[];
  prediction?: string;
}

export interface AppIntelligence {
  milestones: { date: string; title: string; detail: string }[];
  recentDynamics: { date: string; content: string; source: string }[];
  aiInsight: string;
  sources: { title: string; uri: string }[];
}

export interface CorporateWiki {
  milestones: { year: string; event: string; detail: string }[];
  executives: { name: string; title: string; background: string }[];
  sources: { title: string; uri: string }[];
}
