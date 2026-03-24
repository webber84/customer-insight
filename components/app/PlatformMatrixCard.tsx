
import React, { useState, useMemo } from 'react';
import { Activity, Calendar, Sparkles, Info } from 'lucide-react';
import { PlatformPerformanceData, PerformanceMetric } from '../../types';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const METRIC_TIPS: Record<string, string> = {
  '下载用户数': '在统计周期(周/月)内，从该分发渠道下载了应用的用户数。下载用户数按照设备维度进行去重统计，在同一周期内(周/月)同一个用户从该渠道多次下载应用，则会记录一个设备数。在不同周期内，同一个用户同一个应用发生两次下载行为，则会在不同周期内同时会被记录一次',
  '新安装用户数': '在统计周期(周/月)内，从该渠道下载后发生新安装行为的用户数。新安装用户数按照设备维度进行去重统计，如果该用户在同一周期内(周/月)安装该应用，过一段时间卸载应用，又在一段时间后，重新安装该应用，则会记录一个设备数。在不同周期内，同一个用户同一个应用发生两次安装行为，则会在不同周期内同时会被记录一次',
  '活跃用户数': '在统计周期(周/月)内，从该渠道下载后启动过应用的设备数。活跃用户数按照用户设备维度进行去重统计，即在统计周期内至少启动过一次应用的设备数',
  '卸载用户数': '在统计周期(周/月)内，该分发渠道下载后发生过卸载行为的用户数。卸载用户数按照用户设备数进行去重统计，在同一周期内(周/月)同一个用户多次卸载应用，则会记录一个设备数。在不同周期内，同一个用户同一个应用发生两次卸载行为，则会在不同周期内同时会被记录一次',
  '人均单日使用次数': '在统计周期(周/月)内，该分发渠道用户的每日总使用次数除以该应用的每日活跃用户数，再对当期内的自然天数求平均值',
  '人均单日使用时长': '在统计周期(周/月)内，该分发渠道用户的每日总使用时长除以该应用的每日活跃用户数，再对当期内的自然天数求平均值',
  '人均单次使用时长': '在统计周期(周/月)内，该分发渠道下的平均一个用户在单次使用该应用的有效时长，该应用的每日总使用时长除以该应用的每日总使用次数，再对当期内的自然天数求平均值',
  '新安装活跃转化率': '在统计周期(周/月)内，该分发渠道新安装活跃用户数占新安装用户数的比例',
  '新安装卸载转化率': '在统计周期(周/月)内，该分发渠道新安装卸载用户数占新安装用户数的比例'
};

const MetricRow: React.FC<{ metric: PerformanceMetric, timeLabels: string[] }> = ({ metric, timeLabels }) => {
  const [showTip, setShowTip] = useState(false);
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
      <div className="w-48 shrink-0 relative">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-bold text-slate-500">{metric.label}</span>
          {METRIC_TIPS[metric.label] && (
            <button 
              onClick={() => setShowTip(!showTip)} 
              className="text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
            >
              <Info size={14} />
            </button>
          )}
        </div>
        <div className="text-2xl font-black text-slate-900">{metric.ourValue}</div>
        
        {/* Tooltip Popup */}
        {showTip && METRIC_TIPS[metric.label] && (
          <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 leading-relaxed">
            {METRIC_TIPS[metric.label]}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        )}
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
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">全设备厂商分发表现</h3>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            数据来源于QuestMobile，口径见各指标说明，仅用于设备厂商间相对比较，绝对值可能与AG自身统计不符
          </div>
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
        <div className="p-6 border-b border-slate-100">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white p-1.5 rounded shadow-sm">
                  <Sparkles size={16} />
                </div>
                <h4 className="text-sm font-black text-blue-800 uppercase tracking-widest">AI智能总结</h4>
              </div>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                在全设备厂商对比中，华为设备在新增设备数和活跃设备数上均保持行业领先地位。同时，卸载率显著低于全网均值，体现了极高的用户粘性与分发质量。
              </p>
            </div>
          </div>
        </div>
        {data.metrics.map(metric => (
          <MetricRow key={metric.id} metric={metric} timeLabels={timeLabels} />
        ))}
      </div>
    </div>
  );
};
