
import React, { useState, useMemo } from 'react';
import { Activity, Calendar } from 'lucide-react';
import { PlatformPerformanceData, PerformanceMetric } from '../../types';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const MetricRow: React.FC<{ metric: PerformanceMetric, timeLabels: string[] }> = ({ metric, timeLabels }) => {
  const { ourValue, networkAverage, networkMax } = metric.progress;
  const ourPercent = Math.min(100, (ourValue / networkMax) * 100);
  const avgPercent = Math.min(100, (networkAverage / networkMax) * 100);

  const chartData = metric.trendData.map((d, i) => ({
    ...d,
    period: timeLabels[i] || d.period
  }));

  return (
    <div className="flex items-center gap-6 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      {/* 1 & 2. 标签与核心数字 */}
      <div className="w-48 shrink-0">
        <div className="text-sm font-bold text-slate-500 mb-1">{metric.label}</div>
        <div className="text-2xl font-black text-slate-900">{metric.ourValue}</div>
      </div>

      {/* 3. 子弹图风格进度条 */}
      <div className="w-64 shrink-0 flex flex-col justify-center pr-4">
        <div className="relative h-2.5 bg-slate-100 rounded-full w-full mt-1">
          {/* 我方的值 (蓝色段) */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
            style={{ width: `${ourPercent}%`, zIndex: 1 }}
          />
          {/* 全网均值 (垂直标记线) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-slate-800 rounded-sm shadow-sm"
            style={{ left: `calc(${avgPercent}% - 2px)`, zIndex: 2 }}
            title={`全网均值: ${networkAverage}`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>本平台</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-2.5 bg-slate-800 rounded-sm"></div>
            <span>均值 {networkAverage}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <span>最高 {networkMax}</span>
          </div>
        </div>
      </div>

      {/* 4. 趋势图 */}
      <div className="flex-1 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
            <Tooltip 
              contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
            <Legend wrapperStyle={{ fontSize: '10px', color: '#64748b' }} iconType="circle" iconSize={6} />
            <Line type="monotone" dataKey="本平台" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="渠道A" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="渠道B" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const PlatformMatrixCard: React.FC<{ data: PlatformPerformanceData }> = ({ data }) => {
  const [timeUnit, setTimeUnit] = useState<'week' | 'month'>('week');
  
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);

  const timeLabels = useMemo(() => {
    const labels = [];
    let d = new Date(selectedDate);
    if (isNaN(d.getTime())) d = new Date();

    for (let i = 11; i >= 0; i--) {
      if (timeUnit === 'month') {
        const temp = new Date(d.getFullYear(), d.getMonth() - i, 1);
        labels.push(`${temp.getFullYear().toString().slice(2)}年${temp.getMonth() + 1}月`);
      } else {
        const temp = new Date(d.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const day = temp.getDay();
        const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(temp.setDate(diff));
        labels.push(`${monday.getMonth() + 1}/${monday.getDate()}`);
      }
    }
    return labels;
  }, [timeUnit, selectedDate]);

  if (!data || !data.metrics) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">全平台分发表现</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button 
              onClick={() => setTimeUnit('week')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeUnit === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              周
            </button>
            <button 
              onClick={() => setTimeUnit('month')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${timeUnit === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              月
            </button>
          </div>
          <div className="relative">
            {timeUnit === 'week' ? (
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
              />
            ) : (
              <input 
                type="month" 
                value={selectedDate.substring(0, 7)}
                onChange={(e) => setSelectedDate(e.target.value + '-01')}
                className="pl-8 pr-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 bg-white"
              />
            )}
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col">
        {data.metrics.map(metric => (
          <MetricRow key={metric.id} metric={metric} timeLabels={timeLabels} />
        ))}
      </div>
    </div>
  );
};
