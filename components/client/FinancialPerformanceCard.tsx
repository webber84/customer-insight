
import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { ClientProfile } from '../../types';

export const FinancialPerformanceCard: React.FC<{ client: ClientProfile }> = ({ client }) => {
  const { financials, annualSpendHistory } = client;

  // 数据计算逻辑
  const ytdData = annualSpendHistory.filter(item => item.actual !== undefined);
  
  const currentYTDSpend = ytdData.reduce((acc, curr) => acc + (curr.actual || 0), 0);
  const lastYearYTDSpend = ytdData.reduce((acc, curr) => acc + curr.lastYearActual, 0);
  
  const totalLastYearSpend = annualSpendHistory.reduce((acc, curr) => acc + curr.lastYearActual, 0);
  
  // 构建用于图表的混合数据序列：前面的月份用 actual，后面的用 forecast
  // 注意：mock 数据中，当前月份通常同时有 actual 和 forecast（用于连接线条），或者分界清晰
  const totalForecast = annualSpendHistory.reduce((acc, curr) => acc + (curr.actual !== undefined ? curr.actual : curr.forecast), 0);
  
  const currentBudget = financials.annualBudget;
  // 模拟去年的预算数据（假设去年预算比去年实际消耗略高，约为 1.05 倍）
  const lastYearBudget = totalLastYearSpend * 1.05; 

  const metrics = [
    {
      label: '年度预算额',
      current: currentBudget,
      lastYear: lastYearBudget,
      format: (v: number) => `¥${(v/1000000).toFixed(1)}M`,
      isPercent: false
    },
    {
      label: 'YTD 实际消耗',
      current: currentYTDSpend,
      lastYear: lastYearYTDSpend,
      format: (v: number) => `¥${(v/1000000).toFixed(1)}M`,
      isPercent: false
    },
    {
      label: '预算完成率',
      current: (currentYTDSpend / currentBudget) * 100,
      lastYear: (lastYearYTDSpend / lastYearBudget) * 100,
      format: (v: number) => `${v.toFixed(1)}%`,
      isPercent: true
    },
    {
      label: '年度预测总额',
      current: totalForecast,
      lastYear: totalLastYearSpend,
      format: (v: number) => `¥${(v/1000000).toFixed(1)}M`,
      isPercent: false
    }
  ];

  const renderTrend = (current: number, lastYear: number) => {
    let change = 0;
    if (lastYear !== 0) {
       change = ((current - lastYear) / lastYear) * 100;
    }
    
    const isPositive = change > 0;
    const isZero = Math.abs(change) < 0.01;

    return (
      <div className={`flex items-center gap-1 text-[10px] font-black ${isPositive ? 'text-rose-600' : isZero ? 'text-slate-400' : 'text-emerald-600'}`}>
        {isPositive ? <TrendingUp size={10}/> : isZero ? <Minus size={10}/> : <TrendingDown size={10}/>}
        {Math.abs(change).toFixed(1)}%
      </div>
    );
  };

  return (
    <section className="bg-white rounded border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><BarChart3 size={16}/></div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">预算执行情况</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-5 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{m.label}</h4>
            <div className="text-xl font-black text-slate-900 mb-3">{m.format(m.current)}</div>
            <div className="flex justify-between items-center border-t border-slate-200 pt-3">
              <div className="flex flex-col">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">去年同期</span>
                 <span className="text-[10px] font-bold text-slate-600">{m.format(m.lastYear)}</span>
              </div>
              {renderTrend(m.current, m.lastYear)}
            </div>
          </div>
        ))}
      </div>

      <div className="h-80 w-full">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
           年度消耗趋势与预测 (Yearly Spend & Forecast)
        </h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={annualSpendHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                 <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: number) => `¥${(value/1000000).toFixed(2)}M`}
            />
            <Legend 
               verticalAlign="top" 
               align="right" 
               iconType="circle"
               wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', paddingBottom: '20px' }}
            />
            <Area 
              type="monotone" 
              dataKey="lastYearActual" 
              name="去年实际" 
              stroke="#94a3b8" 
              fill="none" 
              strokeDasharray="4 4" 
              strokeWidth={2} 
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              name="YTD 实际消耗" 
              stroke="#2563eb" 
              fill="url(#colorActual)" 
              strokeWidth={3} 
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              name="年度预测" 
              stroke="#8b5cf6" 
              fill="url(#colorForecast)" 
              strokeDasharray="3 3" 
              strokeWidth={2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
