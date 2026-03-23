import React from 'react';
import { Layers } from 'lucide-react';
import { HarmonyOSKit } from '../../types';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const formatYAxis = (value: number) => {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}万`;
  }
  return value.toString();
};

const formatXAxis = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}`;
  }
  return dateStr;
};

export const HarmonyOSMonitorCard: React.FC<{ kits?: HarmonyOSKit[] }> = ({ kits }) => {
  if (!kits || kits.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex items-center gap-2">
        <Layers size={18} className="text-slate-700" />
        <h3 className="text-base font-bold text-slate-900">HarmonyOS SDK 接入监控</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kits.map(kit => (
          <div key={kit.id} className="bg-slate-50 rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800">{kit.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">近30日日均</span>
                <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">
                  {kit.avgDailyCalls}
                </div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kit.dailyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8'}} 
                    tickFormatter={formatXAxis}
                    minTickGap={20}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8'}} 
                    tickFormatter={formatYAxis}
                    width={40}
                  />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                  <Tooltip
                    contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [value.toLocaleString(), '调用次数']}
                    labelFormatter={(label) => `日期: ${label}`}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
