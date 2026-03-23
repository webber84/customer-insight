import React from 'react';
import { ShieldAlert, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AppCKBProfile } from '../../types';

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

export const AppUninstallTrendCard: React.FC<{ health: AppCKBProfile['health'] }> = ({ health }) => {
  const { avgDailyUninstalls, dailyData } = health.uninstallTrend;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex items-center gap-2">
        <ShieldAlert size={18} className="text-slate-700" />
        <h3 className="text-base font-bold text-slate-900">应用卸载趋势</h3>
      </div>

      <div className="p-6">
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-500 mb-1">近 30 日平均每日卸载量</div>
              <div className="text-3xl font-black text-slate-900">{avgDailyUninstalls}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-emerald-500 mb-1 flex items-center justify-end gap-1">
                <TrendingDown size={14} /> 较上月
              </div>
              <div className="text-xl font-bold text-emerald-600">-5.2%</div>
            </div>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                tickFormatter={formatXAxis}
                minTickGap={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                tickFormatter={formatYAxis}
                width={40}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                formatter={(value: number) => [value.toLocaleString(), '卸载量']}
                labelFormatter={(label) => `日期: ${label}`}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line 
                type="monotone" 
                dataKey="uninstalls" 
                name="卸载量" 
                stroke="#f43f5e" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
