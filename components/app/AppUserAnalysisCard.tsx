import React, { useState } from 'react';
import { Users, Sparkles, Activity, PieChart, BarChart2, Info } from 'lucide-react';
import { UserAnalysisData } from '../../types';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AppUserAnalysisCardProps {
  data: UserAnalysisData;
}

export const AppUserAnalysisCard: React.FC<AppUserAnalysisCardProps> = ({ data }) => {
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderMiniPie = (title: string, chartData: any[]) => (
    <div className="flex flex-col items-center">
      <h5 className="text-xs font-bold text-slate-600 mb-2">{title}</h5>
      <div className="h-32 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={40}
              paddingAngle={2}
              dataKey="value"
              nameKey="label"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}%`, '占比']}
              contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1 text-[9px] text-slate-500">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-slate-700" />
          <h3 className="text-base font-bold text-slate-900">用户分析</h3>
        </div>
        
        {/* Row 1: AI Insight Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 text-white p-1 rounded shadow-sm">
                <Sparkles size={14} />
              </div>
              <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest">AI智能总结</h4>
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">
              {data.aiSummary}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Row 2: Scale and Stickiness Metrics */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <Activity size={16} className="text-slate-400" />
            规模与粘性指标
          </h4>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-1">已安装用户数</div>
              <div className="text-2xl font-black text-slate-900">{data.scaleMetrics.installedUsers}</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-1">近30天DAU平均</div>
              <div className="text-2xl font-black text-slate-900">{data.scaleMetrics.avgDau30d}</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-1">近30天MAU</div>
              <div className="text-2xl font-black text-slate-900">{data.scaleMetrics.mau30d}</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="text-xs font-bold text-blue-600 mb-1">用户粘性 (DAU/MAU)</div>
              <div className="text-2xl font-black text-blue-700">{data.scaleMetrics.stickiness}</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-1">平均每日使用时长</div>
              <div className="text-2xl font-black text-slate-900">{data.scaleMetrics.avgDailyUsageTime}</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="text-xs font-bold text-slate-500 mb-1">平均每日使用次数</div>
              <div className="text-2xl font-black text-slate-900">{data.scaleMetrics.avgDailyUsageCount}</div>
            </div>
          </div>
        </div>

        {/* Row 3: User Health */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <PieChart size={16} className="text-slate-400" />
            用户健康度
          </h4>
          
          <div className="flex items-center gap-8">
            {/* Health Legend with Tooltips */}
            <div className="w-1/3 space-y-3">
              {data.health.map((item, idx) => (
                <div key={idx} className="relative flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <button 
                      onMouseEnter={() => setActiveTip(item.label)}
                      onMouseLeave={() => setActiveTip(null)}
                      className="text-slate-400 hover:text-blue-500 focus:outline-none"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-slate-900">{item.value}%</span>
                    <span className="text-xs font-medium text-slate-500">{item.users}</span>
                  </div>
                  
                  {/* Tooltip */}
                  {activeTip === item.label && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-xl z-50">
                      {item.tip}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pie Chart */}
            <div className="w-2/3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data.health}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="label"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, value, payload }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 15;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                          {value}%
                        </text>
                      );
                    }}
                    labelLine={false}
                  >
                    {data.health.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [`${value}% (${props.payload.users})`, '占比']}
                    contentStyle={{borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row 4: User Persona */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
            <BarChart2 size={16} className="text-slate-400" />
            用户画像
          </h4>
          <div className="grid grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
            {renderMiniPie("终端价值分布", data.persona.deviceValue)}
            {renderMiniPie("城市线级分布", data.persona.cityTier)}
            {renderMiniPie("年龄段分布", data.persona.age)}
            {renderMiniPie("消费能力分布", data.persona.spendingPower)}
          </div>
        </div>
      </div>
    </div>
  );
};
