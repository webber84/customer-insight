import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AppCKBProfile } from '../../types';

const CHANNELS = [
  { key: 'AppGallery', name: 'AppGallery (我方)', color: '#5B8FF9', strokeWidth: 3 },
  { key: 'Douyin', name: '抖音', color: '#5AD8A6', strokeWidth: 1.5 },
  { key: 'Kuaishou', name: '快手', color: '#5D7092', strokeWidth: 1.5 },
  { key: 'WeChat', name: '微信', color: '#F6BD16', strokeWidth: 1.5 },
  { key: 'Browser', name: '浏览器', color: '#E8684A', strokeWidth: 1.5 },
  { key: 'TomatoNovel', name: '番茄免费小说', color: '#6DC8EC', strokeWidth: 1.5 },
  { key: 'QQMusic', name: 'QQ音乐', color: '#9270CA', strokeWidth: 1.5 },
];

const periods: ('1d' | '3d' | '7d' | '14d')[] = ['1d', '3d', '7d', '14d'];

export const AppRetentionTrendCard: React.FC<{ health: AppCKBProfile['health'] }> = ({ health }) => {
  const [retentionPeriod, setRetentionPeriod] = useState<'1d' | '3d' | '7d' | '14d'>('1d');

  const data = health.retention[retentionPeriod];

  const { avgRetention, agRetention } = useMemo(() => {
    if (!data || data.length === 0) return { avgRetention: 0, agRetention: 0 };
    const latest = data[data.length - 1];
    
    let total = 0;
    let count = 0;
    CHANNELS.forEach(ch => {
      if (typeof latest[ch.key] === 'number') {
        total += latest[ch.key] as number;
        count++;
      }
    });
    
    return {
      avgRetention: count > 0 ? (total / count).toFixed(1) : '0.0',
      agRetention: typeof latest['AppGallery'] === 'number' ? latest['AppGallery'].toFixed(1) : '0.0'
    };
  }, [data]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">应用留存趋势</h3>
        </div>
        <div className="flex bg-slate-100 rounded p-1 gap-1">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setRetentionPeriod(p)}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-all ${
                retentionPeriod === p 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {p.replace('d', '日')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6 mb-8">
          <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-500 mb-1">平均留存率 ({retentionPeriod.replace('d', '日')})</div>
              <div className="text-3xl font-black text-slate-900">{avgRetention}%</div>
            </div>
          </div>
          
          <div className="flex-1 bg-blue-50 rounded-xl p-5 border border-blue-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-blue-600 mb-1">AppGallery 留存率 ({retentionPeriod.replace('d', '日')})</div>
              <div className="text-3xl font-black text-blue-700">{agRetention}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-blue-500 mb-1 flex items-center justify-end gap-1">
                <TrendingUp size={14} /> 领先均值
              </div>
              <div className="text-xl font-bold text-blue-600">+{((parseFloat(agRetention as string) - parseFloat(avgRetention as string))).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} unit="%" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                itemSorter={(item) => (item.name === 'AppGallery (我方)' ? -100 : -(item.value as number))}
              />
              <Legend 
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 800, paddingTop: '10px' }}
              />
              {CHANNELS.map(ch => (
                <Line 
                  key={ch.key}
                  type="monotone" 
                  dataKey={ch.key} 
                  name={ch.name} 
                  stroke={ch.color} 
                  strokeWidth={ch.strokeWidth}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
