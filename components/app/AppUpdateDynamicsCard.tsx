import React, { useState } from 'react';
import { 
  Calendar, 
  Code, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Star, 
  Package, 
  Clock, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Layers,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { AppUpdateDynamicsData, AppVersionNode } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, CartesianGrid } from 'recharts';

interface AppUpdateDynamicsCardProps {
  data: AppUpdateDynamicsData;
}

const VersionTimelineNode: React.FC<{ node: AppVersionNode }> = ({ node }) => {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-200" />
      
      {/* Timeline Dot */}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center z-10">
        <Code size={12} className="text-slate-500" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-lg">{node.version}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            <Calendar size={14} />
            {node.releaseDate}
          </div>
        </div>

        {/* Ecosystem Adoptions */}
        {/* Removed tags as requested */}

        {/* Release Notes */}
        <div className="space-y-2 mb-4">
          {node.releaseNotes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AppUpdateDynamicsCard: React.FC<AppUpdateDynamicsCardProps> = ({
  data
}) => {
  const [showAllVersions, setShowAllVersions] = useState(false);
  const displayTimeline = showAllVersions ? data.timeline : data.timeline.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Title */}
      <div className="p-6 border-b border-slate-200 flex items-center gap-2">
        <Code size={18} className="text-slate-700" />
        <h3 className="text-base font-bold text-slate-900">版本更新动态</h3>
      </div>

      <div className="p-6 border-b border-slate-200">
        {/* Trend Section */}
        <div className="flex gap-8 mb-8 pb-8 border-b border-slate-100">
          {/* Left: Avg Cycle */}
          <div className="w-1/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <Clock size={16} className="text-slate-400" />
              平均更新周期
            </h4>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-slate-900">{data.updateTrend.avgUpdateCycleDays}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">天/次</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-3">
              同品类中位值 {data.updateTrend.categoryMedianDays} 天
              {data.updateTrend.avgUpdateCycleDays < data.updateTrend.categoryMedianDays ?
                <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-100 ml-1">
                  快 {Math.round((data.updateTrend.categoryMedianDays - data.updateTrend.avgUpdateCycleDays) / data.updateTrend.categoryMedianDays * 100)}%
                </span> : null}
            </div>
          </div>
          
          {/* Right: 24 Months Bar Chart */}
          <div className="w-2/3 h-48">
            <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
              <Activity size={14} />
              近 24 个月发版频次
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.updateTrend.monthlyReleases} margin={{ top: 10, right: 20, left: -20, bottom: 15 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} label={{ value: '月份', position: 'insideBottomRight', offset: -10, fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} label={{ value: '更新次数', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  labelFormatter={(label) => `月份: ${label}`}
                  formatter={(value) => [value, '更新次数']}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage Section */}
        <div className="flex gap-8">
          {/* Left: Coverage & Cohort */}
          <div className="w-1/3 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                <Smartphone size={16} className="text-slate-400" />
                最新版本用户覆盖率
              </h4>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-indigo-600">{data.versionCoverage.latestVersionCoverage}%</span>
              </div>
            </div>
            
            {/* Cohort */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-500 mb-3">新老版本交替流 (当前活跃用户)</h4>
              <div className="flex h-3 rounded-full overflow-hidden mb-3">
                {data.versionCoverage.versionCohort.map((c, i) => (
                  <div key={i} style={{width: `${c.percentage}%`}} className={c.colorClass} />
                ))}
              </div>
              <div className="flex flex-col gap-2 text-[10px] text-slate-500">
                {data.versionCoverage.versionCohort.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-sm ${c.colorClass}`} />
                      <span className="font-medium">{c.label}</span>
                    </div>
                    <span className="font-bold text-slate-700">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: S-Curve */}
          <div className="w-2/3 h-48">
            <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
              <TrendingUp size={14} />
              渗透曲线
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.versionCoverage.adoptionCurve} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} domain={[0, 100]} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                
                {/* 50% Milestone */}
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '50% 达成', fill: '#64748b', fontSize: 10 }} />
                <ReferenceLine segment={[{ x: 'Day 5', y: 50 }, { x: 'Day 5', y: 0 }]} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'bottom', value: '5天', fill: '#64748b', fontSize: 10 }} />
                
                {/* 80% Milestone */}
                <ReferenceLine y={80} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: '80% 达成', fill: '#64748b', fontSize: 10 }} />
                <ReferenceLine segment={[{ x: 'Day 8', y: 80 }, { x: 'Day 8', y: 0 }]} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'bottom', value: '8天', fill: '#64748b', fontSize: 10 }} />
                
                <Area type="monotone" dataKey="coverage" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCoverage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 区域 C：版本变迁时间轴 */}
      <div className="p-6 bg-slate-50/30">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">近 24 个月版本更新列表</h3>
          </div>
          
          {/* AI Trend Summary */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex gap-3">
            <Sparkles className="text-indigo-500 shrink-0 mt-0.5" size={16} />
            <div>
              <div className="text-xs font-bold text-indigo-900 mb-1">更新趋势总结</div>
              <div className="text-sm text-indigo-700/80 leading-relaxed">
                {data.aiTrendSummary}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pl-2">
          {displayTimeline.map((node, idx) => (
            <VersionTimelineNode key={idx} node={node} />
          ))}
        </div>

        {data.timeline.length > 3 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowAllVersions(!showAllVersions)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              {showAllVersions ? '收起时间轴' : `加载更多 (${data.timeline.length - 3})`}
              {showAllVersions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
