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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

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
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Code size={18} className="text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">版本更新动态</h3>
        </div>
        
        {/* AI Trend Summary */}
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex gap-3">
          <Sparkles className="text-indigo-500 shrink-0 mt-0.5" size={16} />
          <div>
            <div className="text-xs font-bold text-indigo-900 mb-1">AI智能总结</div>
            <div className="text-sm text-indigo-700/80 leading-relaxed">
              {data.aiTrendSummary}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-slate-200">
        {/* Trend Section */}
        <div className="flex gap-8 mb-8 pb-8 border-b border-slate-100">
          {/* Left: Avg Cycle */}
          <div className="w-1/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <Clock size={16} className="text-slate-400" />
              近24个月平均更新周期
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
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <Activity size={16} className="text-slate-400" />
              近 24 个月发版频次
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.updateTrend.monthlyReleases} margin={{ top: 20, right: 20, left: -20, bottom: 15 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} label={{ value: '月份', position: 'insideBottomRight', offset: -10, fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} label={{ value: '次数', position: 'top', offset: 10, fontSize: 10, fill: '#94a3b8' }} />
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
        <div className="flex gap-6">
          {/* Left: Coverage */}
          <div className="w-1/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <Smartphone size={16} className="text-slate-400" />
              最新版本用户覆盖率
            </h4>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-black text-indigo-600">{data.versionCoverage.latestVersionCoverage}%</span>
              <span className="text-sm font-bold text-slate-500 mb-1.5">{data.versionCoverage.latestVersionUsers}</span>
            </div>
          </div>
          
          {/* Middle: Cohort */}
          <div className="w-1/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <Layers size={16} className="text-slate-400" />
              各版本用户分布 (当前活跃)
            </h4>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.versionCoverage.versionCohort}
                    cx="40%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="percentage"
                    nameKey="label"
                    label={({ cx, cy, midAngle, outerRadius, value, payload }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 12;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="#64748b" 
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central" 
                        >
                          <tspan x={x} dy="-0.3em" fontSize={10} fontWeight="bold">{value}%</tspan>
                          <tspan x={x} dy="1.2em" fontSize={9} fill="#94a3b8">{payload.users}</tspan>
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {data.versionCoverage.versionCohort.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '占比']}
                    contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Penetration Duration Table */}
          <div className="w-1/3">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-slate-400" />
              最新版本渗透时长
            </h4>
            <div className="flex flex-col gap-3">
              {data.versionCoverage.penetrationMilestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-600">达成 {milestone.target}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-800">{milestone.days}</span>
                    <span className="text-xs font-medium text-slate-500">天</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 区域 C：版本变迁时间轴 */}
      <div className="p-6 bg-slate-50/30">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">近 24 个月版本更新列表</h3>
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
