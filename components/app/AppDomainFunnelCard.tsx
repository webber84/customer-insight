import React from 'react';
import { 
  Filter, 
  Eye,
  Download,
  Smartphone,
  UserCheck,
  Clock,
  Trash2,
  Sparkles,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart,
  Line,
  BarChart,
  Bar
} from 'recharts';

// 1. 过去30天的数据
const generate30DaysData = (base: number, variance: number) => {
  return Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return {
      date: `${month}-${day}`,
      value: Math.max(0, Math.round(base + (Math.random() * variance * 2 - variance)))
    };
  });
};

const METRICS_DATA = [
  { id: 'impression', label: '日均曝光', value: '1,250.4 万', icon: <Eye size={14} />, color: '#3b82f6', data: generate30DaysData(1200, 100) },
  { id: 'download', label: '日均下载', value: '345.2 万', icon: <Download size={14} />, color: '#8b5cf6', data: generate30DaysData(340, 30) },
  { id: 'install', label: '日均安装', value: '298.5 万', icon: <Smartphone size={14} />, color: '#10b981', data: generate30DaysData(290, 20) },
  { id: 'activation', label: '日均激活', value: '185.6 万', icon: <UserCheck size={14} />, color: '#f59e0b', data: generate30DaysData(180, 15) },
  { id: 'retention', label: '日均次日留存', value: '112.4 万', icon: <Clock size={14} />, color: '#06b6d4', data: generate30DaysData(110, 10) },
  { id: 'uninstall', label: '日均卸载', value: '45.2 万', icon: <Trash2 size={14} />, color: '#ef4444', data: generate30DaysData(45, 5) },
];

const TOTAL_INSTALLS = 89550000; // 8955万

const CHANNELS = [
  { key: 'AG', name: 'AppGallery', color: '#0ea5e9' },
  { key: 'Douyin', name: '抖音', color: '#1e293b' },
  { key: 'Kuaishou', name: '快手', color: '#f97316' },
  { key: 'WeChat', name: '微信', color: '#10b981' },
  { key: 'Baidu', name: '百度', color: '#3b82f6' },
  { key: 'Tencent', name: '腾讯视频', color: '#8b5cf6' },
  { key: 'iQIYI', name: '爱奇艺', color: '#14b8a6' },
  { key: 'Weibo', name: '微博', color: '#ef4444' },
  { key: 'Xiaohongshu', name: '小红书', color: '#f43f5e' },
  { key: 'Bilibili', name: 'B站', color: '#06b6d4' },
  { key: 'Zhihu', name: '知乎', color: '#3b82f6' },
  { key: 'Other', name: '其它', color: '#94a3b8' },
];

const SHARE_DATA = [
  { name: 'AppGallery', percent: 45.2, value: TOTAL_INSTALLS * 0.452, color: '#0ea5e9' },
  { name: '抖音', percent: 18.5, value: TOTAL_INSTALLS * 0.185, color: '#1e293b' },
  { name: '快手', percent: 12.1, value: TOTAL_INSTALLS * 0.121, color: '#f97316' },
  { name: '微信', percent: 8.4, value: TOTAL_INSTALLS * 0.084, color: '#10b981' },
  { name: '百度', percent: 5.2, value: TOTAL_INSTALLS * 0.052, color: '#3b82f6' },
  { name: '腾讯视频', percent: 3.1, value: TOTAL_INSTALLS * 0.031, color: '#8b5cf6' },
  { name: '爱奇艺', percent: 2.5, value: TOTAL_INSTALLS * 0.025, color: '#14b8a6' },
  { name: '微博', percent: 1.8, value: TOTAL_INSTALLS * 0.018, color: '#ef4444' },
  { name: '小红书', percent: 1.2, value: TOTAL_INSTALLS * 0.012, color: '#f43f5e' },
  { name: 'B站', percent: 0.8, value: TOTAL_INSTALLS * 0.008, color: '#06b6d4' },
  { name: '知乎', percent: 0.5, value: TOTAL_INSTALLS * 0.005, color: '#3b82f6' },
  { name: '其它', percent: 0.7, value: TOTAL_INSTALLS * 0.007, color: '#94a3b8' },
];

const RETENTION_DATA = [
  { stage: '安装', AG: 100, Douyin: 100, Kuaishou: 100, WeChat: 100, Baidu: 100, Tencent: 100, iQIYI: 100, Weibo: 100, Xiaohongshu: 100, Bilibili: 100, Zhihu: 100, Other: 100 },
  { stage: '激活', AG: 92, Douyin: 35, Kuaishou: 32, WeChat: 45, Baidu: 38, Tencent: 30, iQIYI: 28, Weibo: 25, Xiaohongshu: 40, Bilibili: 42, Zhihu: 35, Other: 20 },
  { stage: '次日留存', AG: 65, Douyin: 15, Kuaishou: 12, WeChat: 22, Baidu: 18, Tencent: 10, iQIYI: 9, Weibo: 8, Xiaohongshu: 20, Bilibili: 25, Zhihu: 18, Other: 10 },
  { stage: '7日留存', AG: 45, Douyin: 8, Kuaishou: 6, WeChat: 12, Baidu: 9, Tencent: 4, iQIYI: 3, Weibo: 2, Xiaohongshu: 10, Bilibili: 15, Zhihu: 10, Other: 5 },
];

const UNINSTALL_DATA = [
  { stage: '当日卸载率', AG: 5, Douyin: 42, Kuaishou: 45, WeChat: 25, Baidu: 35, Tencent: 48, iQIYI: 50, Weibo: 55, Xiaohongshu: 30, Bilibili: 28, Zhihu: 35, Other: 60 },
  { stage: '次日卸载率', AG: 12, Douyin: 65, Kuaishou: 68, WeChat: 45, Baidu: 55, Tencent: 70, iQIYI: 72, Weibo: 75, Xiaohongshu: 50, Bilibili: 48, Zhihu: 55, Other: 80 },
  { stage: '7日卸载率', AG: 25, Douyin: 82, Kuaishou: 85, WeChat: 65, Baidu: 75, Tencent: 88, iQIYI: 90, Weibo: 92, Xiaohongshu: 70, Bilibili: 68, Zhihu: 75, Other: 90 },
  { stage: '14日卸载率', AG: 32, Douyin: 88, Kuaishou: 90, WeChat: 75, Baidu: 82, Tencent: 92, iQIYI: 94, Weibo: 95, Xiaohongshu: 80, Bilibili: 78, Zhihu: 85, Other: 95 },
];

export const AppDomainFunnelCard: React.FC = () => {
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">华为设备近30天分发表现</h3>
        </div>
      </div>
      
      <div className="p-8">
        {/* 5. AI 智能洞察与业务主张移到卡片顶部 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 text-white p-1.5 rounded shadow-sm">
                <Sparkles size={16} />
              </div>
              <h4 className="text-sm font-black text-blue-800 uppercase tracking-widest">AI智能总结</h4>
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">
              同期群数据显示，三方信息流渠道存在大量误触低效安装，秒卸率极高。官方市场的真实高净值用户获取效率远超第三方。
            </p>
          </div>
        </div>

        {/* 1. 区域 A：近30日分发表现 (柱状图) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {METRICS_DATA.map(metric => (
            <div key={metric.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-500">
                  {metric.icon}
                  <span className="text-xs font-bold uppercase tracking-widest">{metric.label}</span>
                </div>
                <span className="text-lg font-black text-slate-900">{metric.value}</span>
              </div>
              <div className="h-24 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metric.data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 900 }}
                      formatter={(value: number) => [value, metric.label]}
                      labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    />
                    <Bar dataKey="value" fill={metric.color} radius={[2, 2, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* 2. 大盘安装量份额 (横向全宽) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-blue-600" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">大盘安装量份额</h4>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">总安装量</div>
              <div className="text-xl font-black text-slate-900">{formatNumber(TOTAL_INSTALLS)}</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {SHARE_DATA.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className={`w-24 text-right text-xs font-bold ${idx === 0 ? 'text-blue-600 font-black' : 'text-slate-600'}`}>
                  {item.name}
                </div>
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden relative group">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="w-32 flex justify-between items-center text-xs">
                  <span className={`font-black ${idx === 0 ? 'text-blue-600' : 'text-slate-700'}`}>{item.percent.toFixed(1)}%</span>
                  <span className="text-slate-400 font-mono">{formatNumber(item.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 渠道激活留存率对比 (横向全宽) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8 relative">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={16} className="text-blue-600" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">渠道激活留存率对比</h4>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RETENTION_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 900 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 900, paddingTop: '20px' }} />
                
                {CHANNELS.map((channel) => (
                  <Line 
                    key={channel.key}
                    type="monotone" 
                    dataKey={channel.key} 
                    name={channel.name} 
                    stroke={channel.color} 
                    strokeWidth={channel.key === 'AG' ? 4 : 2} 
                    strokeDasharray={channel.key === 'AG' ? undefined : "5 5"}
                    dot={{ r: channel.key === 'AG' ? 6 : 4, fill: channel.color, strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: channel.key === 'AG' ? 8 : 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. 渠道卸载率对比 (横向全宽) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle size={16} className="text-rose-500" />
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">渠道卸载率对比</h4>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={UNINSTALL_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="stage" tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 900 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 900, paddingTop: '20px' }} />
                
                {CHANNELS.map((channel) => (
                  <Line 
                    key={channel.key}
                    type="monotone" 
                    dataKey={channel.key} 
                    name={channel.name} 
                    stroke={channel.color} 
                    strokeWidth={channel.key === 'AG' ? 4 : 2} 
                    strokeDasharray={channel.key === 'AG' ? undefined : "5 5"}
                    dot={{ r: channel.key === 'AG' ? 6 : 4, fill: channel.color, strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: channel.key === 'AG' ? 8 : 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
