
import { ClientStage, ClientProfile, MetricPoint, AppCKBProfile, ChannelTrendPoint } from './types';

// Helper to generate dates looking back N days
const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const generateHistory = (base: number, variance: number, days: number = 14): MetricPoint[] => {
  return Array.from({ length: days }).map((_, i) => ({
    date: getPastDate(days - 1 - i),
    value: base + (Math.random() - 0.5) * variance
  }));
};

const generateAnnualHistory = (baseMonthly: number) => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const currentMonthIdx = 2; 
  return months.map((m, idx) => {
    const seasonality = 1 + Math.sin(idx / 2) * 0.2; 
    const forecastVal = baseMonthly * seasonality;
    const lastYearActual = baseMonthly * seasonality * (0.8 + Math.random() * 0.3);
    const actual = idx <= currentMonthIdx ? forecastVal * (0.95 + Math.random() * 0.1) : undefined;
    
    let forecast: number | undefined = undefined;
    if (idx === currentMonthIdx) {
      forecast = actual; 
    } else if (idx > currentMonthIdx) {
      forecast = forecastVal;
    }

    return {
      date: m,
      actual,
      forecast, 
      lastYearActual
    };
  });
};

const CHANNELS = ['AppGallery', 'Douyin', 'Kuaishou', 'WeChat', 'Browser', 'TomatoNovel', 'QQMusic'];

// Helper to generate competitive channel data
const generateChannelData = (baseVal: number, spread: number, days: number = 7): ChannelTrendPoint[] => {
  return Array.from({ length: days }).map((_, i) => {
    const point: any = {
      date: getPastDate(days - 1 - i)
    };
    
    CHANNELS.forEach(ch => {
      // AppGallery has slightly better base but still fluctuates
      const channelBias = ch === 'AppGallery' ? 2 : (Math.random() * 4 - 2); 
      // Ensure value doesn't go below 0
      let val = baseVal + channelBias + (Math.random() - 0.5) * spread;
      if (val < 0) val = 0;
      point[ch] = parseFloat(val.toFixed(2));
    });
    return point;
  });
};

const generate24Months = () => {
  const res = [];
  for(let i=23; i>=0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    res.push({ month: `${year}-${month}`, count: Math.floor(Math.random() * 4) + 1 });
  }
  return res;
};

const generateSCurve = () => {
  const curve = [0, 2, 8, 18, 35, 52, 65, 75, 81, 84, 85, 85.5, 85.8, 86, 86];
  return curve.map((val, idx) => ({ day: `Day ${idx}`, coverage: val }));
};

const generateDownloadData = (days: number = 30) => {
  return Array.from({ length: days }).map((_, i) => {
    const point: any = {
      date: getPastDate(days - 1 - i)
    };
    CHANNELS.forEach(ch => {
      let base = ch === 'AppGallery' ? 50000 : 10000;
      let val = base + (Math.random() - 0.5) * (base * 0.4);
      point[ch] = Math.floor(val);
    });
    return point;
  });
};

const generateKitData = (base: number, variance: number) => {
  return Array.from({ length: 30 }).map((_, i) => ({
    date: getPastDate(29 - i),
    calls: Math.floor(Math.max(0, base + (Math.random() - 0.5) * variance))
  }));
};

const generateUninstallData = (base: number, variance: number) => {
  return Array.from({ length: 30 }).map((_, i) => ({
    date: getPastDate(29 - i),
    uninstalls: Math.floor(Math.max(0, base + (Math.random() - 0.5) * variance))
  }));
};

const generateMetricTrend = (base: number, variance: number) => {
  const periods = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
  return periods.map(p => ({
    period: p,
    '本平台': Math.max(0, base + (Math.random() - 0.5) * variance),
    '渠道A': Math.max(0, base * 0.8 + (Math.random() - 0.5) * variance * 0.8),
    '渠道B': Math.max(0, base * 0.6 + (Math.random() - 0.5) * variance * 0.6),
  }));
};

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: '1',
    name: '度小满金融 (Du Xiaoman)',
    logo: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/64/7d/51/647d519d-727b-2313-0599-738959648943/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
    industry: '金融科技',
    stage: ClientStage.ACTIVE,
    tier: 'S',
    corporateEntity: '度小满科技(北京)有限公司',
    accountRating: 'S 级',
    cooperation: {
      promotion: true,
      preinstall: true,
      push: false,
      joint: true
    },
    decisionTeam: [
      { 
        id: 'dm-1-1',
        name: '王磊', 
        title: 'CMO / 市场增长 VP', 
        department: '集团市场中心',
        role: 'DECISION', 
        decisionPower: 'HIGH',
        contact: 'wangl@duxiaoman.com',
        workExperience: ['百度 商业产品副总裁 (2014-2018)', '滴滴 增长部高级总监 (2018-2021)', '度小满 CMO (2021-至今)'],
        education: ['清华大学 - 计算机科学硕士', '长江商学院 - EMBA'],
        remarks: '最高决策者，拥有最终预算审批权。偏好基于 ROI 数据驱动的汇报，不喜花哨素材。',
        responsibleBusiness: ['推广', '预装', '联运'],
        reportsTo: undefined
      },
      {
        id: 'dm-1-2',
        name: '赵静',
        title: '效果广告投放总监',
        department: '增长渠道部',
        role: 'INFLUENCER',
        decisionPower: 'MEDIUM',
        contact: 'zhaojing@duxiaoman.com',
        workExperience: ['字节跳动 商业化运营 (2016-2019)', '度小满 投放经理 (2019-2022)'],
        education: ['中国人民大学 - 统计学'],
        remarks: '负责具体渠道的预算分配策略，对 RTA 技术细节非常关注。',
        responsibleBusiness: ['推广', '联运'],
        reportsTo: 'dm-1-1'
      },
      {
         id: 'dm-1-3',
         name: '刘明',
         title: 'RTA 技术负责人',
         department: '技术中台',
         role: 'EXECUTION',
         decisionPower: 'LOW',
         contact: 'liuming_tech@duxiaoman.com',
         workExperience: ['百度 凤巢工程师'],
         education: ['北航 - 软件工程'],
         remarks: '技术对接人，关注接口稳定性与数据回传延迟。',
         responsibleBusiness: ['推广'],
         reportsTo: 'dm-1-2'
      },
       {
         id: 'dm-1-4',
         name: '陈芳',
         title: '厂商渠道商务经理',
         department: '增长渠道部',
         role: 'EXECUTION',
         decisionPower: 'LOW',
         contact: 'chenfang@duxiaoman.com',
         workExperience: ['华为 终端云服务'],
         education: ['深圳大学'],
         remarks: '负责厂商硬核联盟的商务对接，包括预装和商店资源位。',
         responsibleBusiness: ['预装', '联运'],
         reportsTo: 'dm-1-2'
      },
      {
        id: 'dm-1-5',
        name: '李强',
        title: '品牌市场总监',
        department: '品牌部',
        role: 'INFLUENCER',
        decisionPower: 'MEDIUM',
        contact: 'liqiang@duxiaoman.com',
        workExperience: ['奥美广告 客户总监'],
        education: ['复旦大学 - 新闻系'],
        remarks: '负责开屏广告与线下活动，注重品牌形象安全。',
        responsibleBusiness: ['推广'],
        reportsTo: 'dm-1-1'
      }
    ],
    appMatrix: [
      { 
        id: 'a1', 
        name: '度小满 (主App)', 
        icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/64/7d/51/647d519d-727b-2313-0599-738959648943/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/128x128bb.jpg', 
        cooperation: { promotion: true, preinstall: true, joint: true, push: true },
        directSpend: { current: 12500000, yoy: 15.2 },
        dspSpend: { current: 3300000, yoy: -4.5 },
        jointRevenue: { current: 850000, yoy: 22.1 },
        preinstallRevenue: { current: 4200000, yoy: 8.5 },
        pushRevenue: { current: 120000, yoy: 5.4 }
      }
    ],
    corporateBasicInfo: {
      history: {
        summary: '2015年百度金融成立，2018年拆分独立更名“度小满金融”，致力于用AI赋能普惠金融。',
        history: [{ id: 'h1', date: '2018-04-21', content: '从百度拆分独立，获得 19 亿美元融资。' }]
      },
      strategy: {
        summary: '坚持“科技赋能”战略，重点布局智能信贷与财富管理，下沉市场渗透与高净值用户双轮驱动。',
        history: [{ id: 's1', date: '2024-01-10', content: '确立年度 AI 驱动金融科技战略，加大模型研发投入。' }]
      },
      productLayout: {
        summary: '核心产品包括：度小满APP（信贷/理财）、度小满理财、满易贷等。',
        history: []
      },
      businessStatus: {
        summary: '目前信贷余额稳居行业前三，坏账率控制在行业平均水平以下，盈利能力持续增强。',
        history: []
      },
      orgStructure: {
        summary: '矩阵式架构。市场部按获客手段分为效果增长部、品牌部和渠道中心。',
        history: []
      },
      budgetAllocation: {
        summary: '年度预算约8.5亿。效果类广告占比70%，品牌预装占比20%，尝试类业务10%。',
        history: []
      },
      evaluationMethod: {
        summary: '考核ROI（新客成本/首贷转化）与次留。季度考评，按月滚动。',
        history: []
      },
      attributionMethod: {
        summary: '采用末次点击（Last Click）归因，同时关注 RTA 辅助归因数据。',
        history: []
      }
    },
    dynamics: [
      { 
        type: 'STRATEGY', 
        title: '发布 2024 年度社会责任报告', 
        date: '2024-03-28', 
        content: '公司披露在绿色金融领域累计投放超 50 亿元，普惠信贷覆盖面进一步扩大。', 
        budgetImpact: 'STABLE',
        source: '度小满官网',
        url: 'https://www.duxiaoman.com'
      },
      { 
        type: 'FINANCE', 
        title: 'Q1 盈利能力持续增强', 
        date: '2024-03-15', 
        content: '得益于风控模型的优化，坏账率同比下降 0.5 个百分点，净利润预期提升。', 
        budgetImpact: 'UP',
        source: '36氪',
        url: 'https://36kr.com'
      },
      { 
        type: 'UPDATE', 
        title: 'App 6.9.5 版本上线', 
        date: '2024-03-01', 
        content: '新版本集成了 AI 智能理财顾问功能，用户活跃度提升 15%。', 
        budgetImpact: 'STABLE',
        source: 'App Store 更新日志',
        url: 'https://apps.apple.com'
      }
    ],
    visitHistory: [
      {
        id: 'v-1',
        date: '2024-03-15',
        title: 'Q1 季度策略深度复盘会',
        location: '度小满科技大厦 12F 会议室',
        internalParticipants: ['李华 (AM)', '张伟 (策略专家)', '技术部-赵工'],
        clientParticipants: ['赵静 (效果增长总监)', '刘明 (RTA 负责人)', '陈芳 (渠道经理)'],
        mainContent: '针对 Q1 消耗波动进行了详细拆解，重点讨论了 RTA 接口在高峰期的超时重试逻辑。客户表达了对 Q2 预算分配中预装占比提升的初步意向。',
        conclusions: '客户认可 Q1 整体拉新效率，Q2 预算计划上浮 15%。',
        items: [
          { 
            id: 'i-1-1', 
            description: 'RTA 接口超时排查与链路扩容', 
            owner: '技术部-张工', 
            status: 'CLOSED', 
            progress: '已完成专线带宽扩容，超时率降低至 0.1% 以下。' 
          },
          { 
            id: 'i-1-2', 
            description: 'Q2 预装机型适配清单提供', 
            owner: '渠道部-王五', 
            status: 'IN_PROGRESS', 
            progress: '已整理 80% 机型，尚余 3 款折叠屏机型待技术部确认 SDK 适配情况。' 
          }
        ]
      }
    ],
    financials: { 
      balance: 1450000.00, 
      creditLimit: 5000000, 
      rebateRate: 18.5, 
      walletRunwayDays: 12.5, 
      annualBudget: 85000000,
      promotionBudget: 55000000,
      preinstallBudget: 20000000,
      pushBudget: 2000000,
      jointBudget: 8000000,
      annualSpend: 42300000 
    },
    performanceTargets: {
      spend: { current: 523000, target: 500000, avg: 485000, history: generateHistory(500000, 80000) },
      activationRate: { current: 15.8, target: 14.5, avg: 15.2, history: generateHistory(15, 3) },
      retentionRate: { current: 38.5, target: 35.0, avg: 37.2, history: generateHistory(37, 5) },
      cvr: { current: 8.4, target: 9.0, avg: 8.6, history: generateHistory(8.5, 1.5) },
    },
    annualSpendHistory: generateAnnualHistory(7000000),
    hourlySpend: [],
    dailySpendTrend: [],
    budgetUtilization: 98.5,
    churnProbability7d: 4.8,
    multiChannelQuality: []
  }
];

export const MOCK_APP_CKB: AppCKBProfile = {
  id: 'a1',
  name: '度小满金融',
  icon: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/64/7d/51/647d519d-727b-2313-0599-738959648943/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/128x128bb.jpg',
  version: '6.9.5',
  developer: '度小满科技(北京)有限公司',
  firstReleaseDate: '2015-11-20',
  operatingDays: 3050,
  categories: { primary: '财务', secondary: ['理财', '信贷'] },
  cooperation: {
    promotion: true,
    preinstall: true,
    push: true,
    joint: true,
  },
  platformMatrix: [
    { platform: '华为应用市场', downloads: 950000000, uninstalls: 150000000, mau: 140000000 },
    { platform: 'AppStore', downloads: 420000000, uninstalls: 40000000, mau: 120000000 },
    { platform: '应用宝', downloads: 910000000, uninstalls: 320000000, mau: 130000000 },
    { platform: 'OPPO软件商店', downloads: 680000000, uninstalls: 110000000, mau: 95000000 },
    { platform: 'vivo应用商店', downloads: 710000000, uninstalls: 130000000, mau: 98000000 },
    { platform: '小米应用商店', downloads: 650000000, uninstalls: 100000000, mau: 88000000 },
    { platform: '荣耀应用市场', downloads: 250000000, uninstalls: 30000000, mau: 45000000 },
    { platform: '三星应用商店', downloads: 50000000, uninstalls: 8000000, mau: 12000000 }
  ],
  platformPerformance: {
    metrics: [
      {
        id: 'downloads',
        label: '下载用户数',
        ourValue: '125.4 万',
        progress: { ourValue: 125.4, networkAverage: 80.5, networkMax: 200 },
        trendData: generateMetricTrend(120, 20)
      },
      {
        id: 'installs',
        label: '新安装用户数',
        ourValue: '98.2 万',
        progress: { ourValue: 98.2, networkAverage: 65.0, networkMax: 150 },
        trendData: generateMetricTrend(90, 15)
      },
      {
        id: 'active',
        label: '活跃用户数',
        ourValue: '345.6 万',
        progress: { ourValue: 345.6, networkAverage: 210.0, networkMax: 500 },
        trendData: generateMetricTrend(340, 40)
      },
      {
        id: 'uninstalls',
        label: '卸载用户数',
        ourValue: '12.5 万',
        progress: { ourValue: 12.5, networkAverage: 18.0, networkMax: 40 },
        trendData: generateMetricTrend(12, 3)
      },
      {
        id: 'daily_usage',
        label: '人均单日使用次数',
        ourValue: '8.5 次',
        progress: { ourValue: 8.5, networkAverage: 6.2, networkMax: 12 },
        trendData: generateMetricTrend(8, 1.5)
      },
      {
        id: 'duration',
        label: '人均单次使用时长',
        ourValue: '12.4 分钟',
        progress: { ourValue: 12.4, networkAverage: 9.8, networkMax: 18 },
        trendData: generateMetricTrend(12, 2)
      },
      {
        id: 'new_install_active_rate',
        label: '新安装活跃转化率',
        ourValue: '68.5%',
        progress: { ourValue: 68.5, networkAverage: 55.0, networkMax: 85.0 },
        trendData: generateMetricTrend(65, 5)
      },
      {
        id: 'new_install_uninstall_rate',
        label: '新安装卸载转化率',
        ourValue: '12.3%',
        progress: { ourValue: 12.3, networkAverage: 18.5, networkMax: 30.0 },
        trendData: generateMetricTrend(15, 3)
      }
    ]
  },
  downloadAnalysis: {
    totalDownloads: {
      formatted: '2.8 亿',
      categoryRank: 3
    },
    recent30DaysDownloads: {
      formatted: '345 万',
      categoryRank: 2
    },
    channelDownloads30Days: generateDownloadData(30),
    appGalleryBreakdown: [
      { name: '推广下载', value: 68, color: '#3b82f6' },
      { name: '非推广下载', value: 32, color: '#94a3b8' }
    ]
  },
  competitors: [
    { id: 'c1', name: '借呗', icon: '', installShare: 45.2, overlapRate: 65.4, winRate: 32.1 },
    { id: 'c2', name: '微粒贷', icon: '', installShare: 38.5, overlapRate: 58.2, winRate: 35.8 }
  ],
  health: {
    retention: {
      '1d': generateChannelData(42, 5, 90),
      '3d': generateChannelData(35, 4, 90),
      '7d': generateChannelData(28, 4, 90),
      '14d': generateChannelData(22, 3, 90),
    },
    uninstall: {
      '1d': generateChannelData(5, 2, 90),
      '3d': generateChannelData(8, 2, 90),
      '7d': generateChannelData(12, 3, 90),
      '14d': generateChannelData(18, 4, 90),
    },
    uninstallTrend: {
      avgDailyUninstalls: '1.2万',
      dailyData: generateUninstallData(12000, 3000)
    }
  },
  userAnalysis: {
    aiSummary: "该应用用户规模庞大且粘性极高（DAU/MAU达42%），高频活跃用户占比超过四成，显示出极强的用户忠诚度。用户画像偏向一二线城市、中高消费能力的中青年群体，且高价值终端用户占比较大，具备极高的商业化变现潜力。",
    scaleMetrics: {
      installedUsers: "1.2亿",
      avgDau30d: "1,850万",
      mau30d: "4,380万",
      stickiness: "42.2%",
      avgDailyUsageTime: "32分钟",
      avgDailyUsageCount: "4.5次"
    },
    health: [
      { label: "高频活跃", value: 45, users: "832万", color: "#3b82f6", tip: "在近 30 天内，累计启动天数 ≥ 10 天" },
      { label: "常规活跃", value: 30, users: "555万", color: "#10b981", tip: "在近 30 天内，累计启动天数 1 ~ 9 天，且最近 14 天内有过启动" },
      { label: "沉睡边缘", value: 15, users: "277万", color: "#f59e0b", tip: "最近 15 天 ~ 30 天内0启动" },
      { label: "长尾流失", value: 10, users: "185万", color: "#ef4444", tip: "距今已超过30天0启动" }
    ],
    persona: {
      deviceValue: [
        { label: "高价值", value: 40, color: "#8b5cf6" },
        { label: "中价值", value: 45, color: "#a78bfa" },
        { label: "低价值", value: 15, color: "#c4b5fd" }
      ],
      cityTier: [
        { label: "一线", value: 35, color: "#0ea5e9" },
        { label: "二线", value: 40, color: "#38bdf8" },
        { label: "三线", value: 15, color: "#7dd3fc" },
        { label: "四线及以下", value: 10, color: "#bae6fd" }
      ],
      age: [
        { label: "18-24岁", value: 25, color: "#f43f5e" },
        { label: "25-34岁", value: 45, color: "#fb7185" },
        { label: "35-44岁", value: 20, color: "#fda4af" },
        { label: "45岁以上", value: 10, color: "#fecdd3" }
      ],
      spendingPower: [
        { label: "高消费", value: 30, color: "#14b8a6" },
        { label: "中消费", value: 50, color: "#2dd4bf" },
        { label: "低消费", value: 20, color: "#5eead4" }
      ]
    }
  },
  distributionOverview: {
    aiSummary: "站内分发效率极高，从曝光到下载的转化率达到12.5%，远超行业平均水平。算法推荐是最大的流量来源，占比达45%，说明该应用在应用商店的推荐算法中权重较高。主动搜索占比30%，体现了较强的品牌影响力和用户主动获取意愿。",
    funnel: {
      impressions: "2,400万",
      downloads: "300万",
      installs: "285万",
      activations: "270万",
      conversionRates: {
        impressionToDownload: "12.5%",
        downloadToInstall: "95.0%",
        installToActivation: "94.7%"
      }
    },
    trafficSources: [
      { label: "算法推荐", percentage: 45, value: "135万", color: "#8b5cf6" },
      { label: "主动搜索", percentage: 30, value: "90万", color: "#3b82f6" },
      { label: "编辑推荐", percentage: 15, value: "45万", color: "#10b981" },
      { label: "推广下载", percentage: 10, value: "30万", color: "#f59e0b" }
    ]
  },
  updateDynamics: {
    aiTrendSummary: "近24个月内，该应用保持了高频的迭代节奏，平均每两周发布一次新版本。更新重心从早期的基础功能完善（如支付、账户系统），逐渐向智能化和生态融合转移（如接入大模型客服、鸿蒙原生适配）。近期热修复版本显著减少，表明整体架构稳定性有较大提升。",
    updateTrend: {
      totalVersions: 128,
      avgUpdateCycleDays: 14,
      categoryMedianDays: 21,
      monthlyReleases: generate24Months()
    },
    versionCoverage: {
      latestVersionCoverage: 86,
      latestVersionUsers: '1,250万',
      adoptionCurve: generateSCurve(),
      penetrationMilestones: [
        { target: '50%', days: 5 },
        { target: '80%', days: 8 },
        { target: '95%', days: 14 }
      ],
      versionCohort: [
        { label: 'v6.9.5 (最新)', percentage: 65, users: '945万', colorClass: 'bg-indigo-500', color: '#6366f1' },
        { label: 'v6.9.4', percentage: 20, users: '290万', colorClass: 'bg-indigo-400', color: '#818cf8' },
        { label: 'v6.9.3', percentage: 10, users: '145万', colorClass: 'bg-indigo-300', color: '#a5b4fc' },
        { label: '其它', percentage: 5, users: '73万', colorClass: 'bg-slate-200', color: '#e2e8f0' }
      ]
    },
    timeline: [
      {
        version: 'v6.9.5',
        releaseDate: '2024-03-01',
        type: 'MAJOR',
        releaseNotes: [
          '集成 AI 智能理财顾问，提供个性化资产配置建议',
          '优化信贷审批流程，最快 3 分钟放款',
          '全新视觉体验升级，支持深色模式'
        ],
        ecosystemAdoptions: ['新增接入: 鸿蒙原生适配', '更新: 支付SDK v2'],
        businessImpact: '发布后获编辑推荐 1 次，次周活跃用户 +15%'
      },
      {
        version: 'v6.9.4',
        releaseDate: '2024-02-15',
        type: 'MINOR',
        releaseNotes: [
          '修复已知问题，提升系统稳定性',
          '优化身份认证流程，提升通过率'
        ],
        ecosystemAdoptions: []
      },
      {
        version: 'v6.9.3',
        releaseDate: '2024-01-28',
        type: 'HOTFIX',
        releaseNotes: [
          '紧急修复部分机型闪退问题',
          '修复网络切换时的状态同步异常'
        ],
        ecosystemAdoptions: []
      },
      {
        version: 'v6.9.0',
        releaseDate: '2024-01-10',
        type: 'MAJOR',
        releaseNotes: [
          '上线“年度账单”功能，回顾 2023 财富历程',
          '新增多项理财产品，丰富投资选择',
          '优化客服系统，支持智能语音交互'
        ],
        ecosystemAdoptions: ['新增接入: 智能客服 SDK'],
        businessImpact: '年度账单分享率达 30%，带来 5% 新增用户'
      },
      {
        version: 'v6.8.8',
        releaseDate: '2023-12-20',
        type: 'MINOR',
        releaseNotes: [
          '优化页面加载速度',
          '更新隐私政策与合规声明'
        ],
        ecosystemAdoptions: ['更新: 隐私合规 SDK']
      },
      {
        version: 'v6.8.5',
        releaseDate: '2023-11-11',
        type: 'MAJOR',
        releaseNotes: [
          '双十一特别版，上线多重福利活动',
          '信贷额度临时提升通道开启',
          '优化支付链路，提升交易成功率'
        ],
        ecosystemAdoptions: ['新增接入: 营销活动 SDK', '更新: 支付SDK v1.5'],
        businessImpact: '活动期间交易额环比增长 45%'
      }
    ]
  },
  harmonyOSKits: [
    { id: 'account', name: 'Account Kit', avgDailyCalls: '15.2万', dailyData: generateKitData(152000, 20000) },
    { id: 'iap', name: 'IAP Kit', avgDailyCalls: '8.5万', dailyData: generateKitData(85000, 15000) },
    { id: 'push', name: 'Push Kit', avgDailyCalls: '320.4万', dailyData: generateKitData(3204000, 500000) },
    { id: 'location', name: 'Location Kit', avgDailyCalls: '45.6万', dailyData: generateKitData(456000, 80000) },
    { id: 'map', name: 'Map Kit', avgDailyCalls: '12.3万', dailyData: generateKitData(123000, 30000) },
    { id: 'scan', name: 'Scan Kit', avgDailyCalls: '5.8万', dailyData: generateKitData(58000, 10000) }
  ]
};

export const MOCK_PLATFORM_STATS = {
  realtime: {
    spend: 425800,
    ecpm: 12.5,
    ctr: 2.1,
    cvr: 8.4,
    fillRate: 98.2,
    comparisons: {
      yesterday: 5.4,
      lastWeek: -2.1
    }
  },
  kpis: {
    revenue: {
      current: 42300000,
      target: 85000000,
      progress: 49.8
    },
    activeClients: {
      current: 124,
      target: 150,
      progress: 82.7
    }
  },
  heatmap: [
    { category: '短视频', bidPrice: 85, trafficVolume: 92 },
    { category: '电商', bidPrice: 72, trafficVolume: 88 },
    { category: '游戏', bidPrice: 94, trafficVolume: 75 },
    { category: '金融', bidPrice: 88, trafficVolume: 62 },
  ],
  forecasts: {
    biddingTrends: [
      { category: '短视频', current: 15.2, change: 4.5 },
      { category: '电商', current: 8.4, change: -2.1 },
      { category: '游戏', current: 22.1, change: 8.5 },
      { category: '金融', current: 18.5, change: 1.2 },
    ],
    traffic: generateHistory(1000000, 200000, 7),
    revenue: generateHistory(500000, 100000, 7)
  },
  risks: {
    anomalies: [
      { id: 'AC-782', name: '快手极速版', type: 'spend_drop', value: '-32.5%', severity: 'high' },
      { id: 'AC-105', name: '拼多多', type: 'ecpm_spike', value: '+45.2%', severity: 'high' },
      { id: 'AC-332', name: '小红书', type: 'spend_drop', value: '-12.8%', severity: 'medium' },
    ],
    budgetExhaustionRate: 85,
    complianceViolations: 2,
    appRemovals: 1
  }
};
