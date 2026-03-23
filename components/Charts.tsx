
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { MetricPoint } from '../types';

interface TrendChartProps {
  data: MetricPoint[];
  dataKey: string;
  color: string;
  showForecast?: boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, dataKey, color, showForecast }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 700}} 
        />
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '4px', 
            border: '1px solid #e2e8f0', 
            boxShadow: 'none',
            fontSize: '12px',
            fontWeight: 800
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          fill={color} 
          fillOpacity={0.1} 
          name="实测值"
        />
        {showForecast && (
             <Area 
             type="monotone" 
             dataKey="forecast" 
             stroke={color} 
             strokeDasharray="4 4"
             fill="none"
             name="预测值"
           />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const SparklineChart: React.FC<{data: MetricPoint[], color: string}> = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={1.5}
          fill={color} 
          fillOpacity={0.05} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const MultiLineChart: React.FC<{data: any[], lines: any[]}> = ({ data, lines }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
        <YAxis tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
        <Tooltip contentStyle={{borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: 'none'}} />
        <Legend iconType="rect" wrapperStyle={{fontSize: '10px', fontWeight: 800, textTransform: 'uppercase'}} />
        {lines.map((line) => (
          <Line key={line.key} type="monotone" dataKey={line.key} stroke={line.color} strokeWidth={2} name={line.name} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export const DonutChart: React.FC<{data: any[], height?: number}> = ({ data, height = 320 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 0, bottom: 40 }}>
        <Pie
          data={data}
          innerRadius="60%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="value"
          nameKey="label"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: 'none', fontSize: '12px' }}
        />
        <Legend 
            verticalAlign="bottom"
            align="center"
            iconType="rect"
            formatter={(value) => <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const FunnelChart: React.FC<{data: any[]}> = ({ data }) => {
  const colors = [
    '#0f172a', // 曝光
    '#1e293b', // 点击
    '#334155', // 下载
    '#475569', // 激活
    '#2563eb', // 转化
  ];

  return (
    <div className="flex flex-col items-center w-full py-10 space-y-4">
      {data.map((item, index) => {
        const valueRatio = item.value / data[0].value;
        const width = index === 0 ? 100 : Math.max(30, 100 * Math.pow(valueRatio, 0.25));
        
        return (
          <div key={item.stage} className="w-full flex flex-col items-center group">
            <div 
              className="flex items-center justify-between h-14 rounded-sm transition-all duration-200 px-6 border border-white/5"
              style={{ 
                width: `${width}%`, 
                backgroundColor: colors[index],
                color: 'white'
              }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{item.stage}</span>
              <div className="text-lg font-black tracking-tighter">
                {item.value.toLocaleString()}
              </div>
              {index > 0 && (
                <div className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded">
                  {item.rate}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
