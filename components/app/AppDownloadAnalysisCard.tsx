import React from 'react';
import { Download, Trophy, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { AppDownloadAnalysisData } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CHANNELS = [
  { key: 'AppGallery', name: '华为应用市场', color: '#ef4444' },
  { key: 'Douyin', name: '抖音', color: '#000000' },
  { key: 'Kuaishou', name: '快手', color: '#f97316' },
  { key: 'WeChat', name: '微信', color: '#10b981' },
  { key: 'Browser', name: '浏览器', color: '#3b82f6' },
  { key: 'TomatoNovel', name: '番茄小说', color: '#f43f5e' },
  { key: 'QQMusic', name: 'QQ音乐', color: '#eab308' }
];

export const AppDownloadAnalysisCard: React.FC<{ data: AppDownloadAnalysisData }> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex items-center gap-2">
        <Download size={18} className="text-slate-700" />
        <h3 className="text-base font-bold text-slate-900">应用新安装分析</h3>
      </div>
      
      <div className="p-6">
        {/* Top Metrics */}
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-500 mb-1">累计总新安装量</div>
              <div className="text-3xl font-black text-slate-900">{data.totalDownloads.formatted}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 mb-1 flex items-center justify-end gap-1">
                <Trophy size={14} className="text-amber-500" /> 同品类排名
              </div>
              <div className="text-xl font-bold text-amber-600">{data.totalDownloads.categoryRank}</div>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-500 mb-1">近 30 日新安装量</div>
              <div className="text-3xl font-black text-slate-900">{data.recent30DaysDownloads.formatted}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 mb-1 flex items-center justify-end gap-1">
                <Trophy size={14} className="text-amber-500" /> 同品类排名
              </div>
              <div className="text-xl font-bold text-amber-600">{data.recent30DaysDownloads.categoryRank}</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="flex gap-8">
          {/* Left: 30 Days Channel Trend */}
          <div className="w-2/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <BarChart2 size={16} className="text-slate-400" />
              近 30 日各渠道新安装量趋势
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.channelDownloads30Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickFormatter={(val) => `${val >= 10000 ? (val/10000).toFixed(0) + '万' : val}`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number, name: string) => {
                      const channel = CHANNELS.find(c => c.key === name);
                      return [value, channel ? channel.name : name];
                    }}
                  />
                  {CHANNELS.map(ch => (
                    <Area key={ch.key} type="monotone" dataKey={ch.key} name={ch.key} stackId="1" stroke={ch.color} fill={ch.color} fillOpacity={0.6} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: AppGallery Breakdown */}
          <div className="w-1/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <PieChartIcon size={16} className="text-slate-400" />
              AppGallery 新安装量拆解
            </h4>
            <div className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.appGalleryBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.appGalleryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '占比']}
                    contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
