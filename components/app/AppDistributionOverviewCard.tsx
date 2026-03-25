import React from 'react';
import { Share2, Sparkles, Filter, Activity, Download, CheckCircle, PlayCircle, BarChart2 } from 'lucide-react';
import { DistributionOverviewData } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

interface AppDistributionOverviewCardProps {
  data: DistributionOverviewData;
}

export const AppDistributionOverviewCard: React.FC<AppDistributionOverviewCardProps> = ({ data }) => {
  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const source = data.trafficSources[index];
    const absoluteValue = source.value;
    return (
      <text x={x + width + 10} y={y + height / 2} fill="#475569" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {value}% ({absoluteValue})
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={18} className="text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">近30天站内分发表现</h3>
        </div>
        
        {/* Row 1: AI Insight Summary */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-indigo-600 text-white p-1 rounded shadow-sm">
                <Sparkles size={14} />
              </div>
              <h4 className="text-xs font-black text-indigo-800 uppercase tracking-widest">AI智能总结</h4>
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">
              {data.aiSummary}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Row 2: Funnel */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-1.5">
            <Filter size={16} className="text-slate-400" />
            站内用户行为漏斗 (近30天日均)
          </h4>
          
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Impressions */}
            <div className="flex flex-col items-center w-1/4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 shadow-sm border border-slate-200">
                <Activity size={24} className="text-slate-500" />
              </div>
              <div className="text-xs font-bold text-slate-500 mb-1">曝光量</div>
              <div className="text-xl font-black text-slate-900">{data.funnel.impressions}</div>
            </div>
            
            {/* Arrow 1 */}
            <div className="flex-1 flex flex-col items-center relative">
              <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
              <div className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-indigo-600 relative z-10">
                转化率 {data.funnel.conversionRates.impressionToDownload}
              </div>
            </div>

            {/* Downloads */}
            <div className="flex flex-col items-center w-1/4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 shadow-sm border border-blue-100">
                <Download size={24} className="text-blue-500" />
              </div>
              <div className="text-xs font-bold text-slate-500 mb-1">下载量</div>
              <div className="text-xl font-black text-slate-900">{data.funnel.downloads}</div>
            </div>

            {/* Arrow 2 */}
            <div className="flex-1 flex flex-col items-center relative">
              <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
              <div className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-indigo-600 relative z-10">
                转化率 {data.funnel.conversionRates.downloadToInstall}
              </div>
            </div>

            {/* Installs */}
            <div className="flex flex-col items-center w-1/4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-3 shadow-sm border border-indigo-100">
                <CheckCircle size={24} className="text-indigo-500" />
              </div>
              <div className="text-xs font-bold text-slate-500 mb-1">安装量</div>
              <div className="text-xl font-black text-slate-900">{data.funnel.installs}</div>
            </div>

            {/* Arrow 3 */}
            <div className="flex-1 flex flex-col items-center relative">
              <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
              <div className="bg-white px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-indigo-600 relative z-10">
                转化率 {data.funnel.conversionRates.installToActivation}
              </div>
            </div>

            {/* Activations */}
            <div className="flex flex-col items-center w-1/4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-3 shadow-sm border border-emerald-100">
                <PlayCircle size={24} className="text-emerald-500" />
              </div>
              <div className="text-xs font-bold text-slate-500 mb-1">激活量</div>
              <div className="text-xl font-black text-slate-900">{data.funnel.activations}</div>
            </div>
          </div>
        </div>

        {/* Row 3: Traffic Sources */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <BarChart2 size={16} className="text-slate-400" />
            下载流量来源
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trafficSources} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} width={80} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '占比']}
                  contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={24} label={renderCustomBarLabel}>
                  {data.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
