
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Compass,
  Minus,
  Target,
  Flame,
  LineChart,
  ShieldAlert,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { MOCK_PLATFORM_STATS } from '../constants';
import { TrendChart } from './Charts';

export const PlatformDashboard: React.FC = () => {
  const stats = MOCK_PLATFORM_STATS;

  const renderComparison = (val: number) => {
    if (val > 0) return <span className="text-green-600 flex items-center gap-0.5 text-[10px] font-black"><TrendingUp size={12}/>{val}%</span>;
    if (val < 0) return <span className="text-red-600 flex items-center gap-0.5 text-[10px] font-black"><TrendingDown size={12}/>{val}%</span>;
    return <span className="text-slate-400 flex items-center gap-0.5 text-[10px] font-black"><Minus size={12}/>0%</span>;
  };

  const renderSectionHeader = (title: string, icon: React.ReactNode) => (
    <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
      <div className="flex items-center gap-3">
        <div className="text-slate-900">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase">{title}</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      
      {/* 1. 核心指标 */}
      <section>
        {renderSectionHeader("核心指标", <Compass size={18}/>)}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: '实时消耗', value: `¥${stats.realtime.spend.toLocaleString()}`, key: 'spend' },
            { label: 'eCPM', value: `¥${stats.realtime.ecpm}`, key: 'ecpm' },
            { label: '点击率', value: `${stats.realtime.ctr}%`, key: 'ctr' },
            { label: '转化率', value: `${stats.realtime.cvr}%`, key: 'cvr' },
            { label: '填充率', value: `${stats.realtime.fillRate}%`, key: 'fill' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white p-6 rounded border border-slate-200 hover:border-slate-400 transition-colors">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">{metric.label}</div>
              <div className="text-2xl font-black text-slate-900 mb-4">{metric.value}</div>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">昨日同比</span>
                  {renderComparison(stats.realtime.comparisons.yesterday)}
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">上周同比</span>
                  {renderComparison(stats.realtime.comparisons.lastWeek)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. KPI 进展 */}
      <section>
        {renderSectionHeader("关键指标达成率", <Target size={18}/>)}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-8 bg-white rounded border border-slate-200">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">年度营收额</div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">¥{(stats.kpis.revenue.current/1000000).toFixed(1)}百万</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-black uppercase mb-1">目标额: ¥{(stats.kpis.revenue.target/1000000).toFixed(1)}百万</div>
                        <div className="text-2xl font-black text-blue-600">{stats.kpis.revenue.progress}%</div>
                    </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-blue-600 h-full rounded-full" style={{width: `${stats.kpis.revenue.progress}%`}}></div>
                </div>
            </div>

            <div className="p-8 bg-white rounded border border-slate-200">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">活跃客户数</div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats.kpis.activeClients.current}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-black uppercase mb-1">目标数: {stats.kpis.activeClients.target}</div>
                        <div className="text-2xl font-black text-blue-600">{stats.kpis.activeClients.progress}%</div>
                    </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-blue-600 h-full rounded-full" style={{width: `${stats.kpis.activeClients.progress}%`}}></div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. 行业分析 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {renderSectionHeader("行业赛道热度", <Flame size={18} className="text-orange-500"/>)}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.heatmap.map((item) => (
                  <div key={item.category} className="p-6 bg-white rounded border border-slate-200">
                      <div className="text-sm font-black text-slate-900 mb-4 uppercase">{item.category}</div>
                      <div className="space-y-4">
                          <div>
                              <div className="flex justify-between text-[10px] mb-1 font-black uppercase tracking-widest text-slate-400">
                                  <span>出价强度</span>
                                  <span className="text-blue-600">{item.bidPrice}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                                  <div className="bg-blue-600 h-full" style={{width: `${item.bidPrice}%`}}></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-[10px] mb-1 font-black uppercase tracking-widest text-slate-400">
                                  <span>流量规模</span>
                                  <span className="text-emerald-600">{item.trafficVolume}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                                  <div className="bg-emerald-600 h-full" style={{width: `${item.trafficVolume}%`}}></div>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </div>

        <div>
          {renderSectionHeader("大盘出价走势", <Activity size={18} className="text-indigo-500"/>)}
          <div className="bg-white rounded border border-slate-200 overflow-hidden">
              <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-[10px]">行业类别</th>
                          <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px]">当前价格</th>
                          <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-[10px]">走势</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {stats.forecasts.biddingTrends.slice(0, 4).map((t) => (
                          <tr key={t.category} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900">{t.category}</td>
                              <td className="px-6 py-4 text-center font-mono font-bold text-slate-600">¥{t.current}</td>
                              <td className="px-6 py-4 text-center">
                                  <div className={`inline-flex items-center gap-1 font-black text-[10px] ${t.change > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                      {t.change > 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                      {Math.abs(t.change)}%
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
        </div>
      </section>

      {/* 4. 风险预警 */}
      <section>
        {renderSectionHeader("异常风险预警", <ShieldAlert size={18}/>)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded border border-slate-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
                        <tr>
                            <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">账户信息</th>
                            <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">预警类型</th>
                            <th className="px-8 py-4 font-black uppercase tracking-widest text-[10px]">变动幅度</th>
                            <th className="px-8 py-4 text-right font-black uppercase tracking-widest text-[10px]">严重程度</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {stats.risks.anomalies.map((a) => (
                            <tr key={a.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-4">
                                    <div className="font-bold text-slate-900">{a.name}</div>
                                    <div className="text-[10px] text-slate-400 font-black">编号: {a.id}</div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-600">
                                        {a.type === 'spend_drop' ? '消耗骤减' : a.type === 'ecpm_spike' ? '价格飙升' : a.type}
                                    </span>
                                </td>
                                <td className="px-8 py-4 font-black text-red-600 font-mono">{a.value}</td>
                                <td className="px-8 py-4 text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${a.severity === 'high' ? 'text-red-600' : 'text-orange-600'}`}>
                                        ● {a.severity === 'high' ? '严重' : '一般'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="space-y-4">
                <div className="bg-white p-6 rounded border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock size={14}/> 预算耗尽进度
                    </h4>
                    <div className="text-3xl font-black mb-3 text-slate-900">{stats.risks.budgetExhaustionRate}%</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mb-4 border border-slate-200">
                        <div className="bg-red-600 h-full rounded-full" style={{width: `${stats.risks.budgetExhaustionRate}%`}}></div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
                        预计今晚有 12 个重点客户将触发限额。
                    </p>
                </div>
                <div className="bg-white p-6 rounded border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={14}/> 合规与安全
                    </h4>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="text-xl font-black text-slate-900">{stats.risks.complianceViolations}</div>
                            <div className="text-[10px] text-slate-400 font-black uppercase">违规项</div>
                        </div>
                        <div className="flex-1">
                            <div className="text-xl font-black text-slate-900">{stats.risks.appRemovals}</div>
                            <div className="text-[10px] text-slate-400 font-black uppercase">应用下架</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 5. 趋势预测 */}
      <section>
        {renderSectionHeader("未来趋势分析预测", <LineChart size={18}/>)}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded border border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">流量趋势预测 (未来7天)</h3>
                <div className="h-64">
                    <TrendChart data={stats.forecasts.traffic} dataKey="value" color="#2563eb" showForecast />
                </div>
            </div>
            <div className="bg-white p-6 rounded border border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">营收趋势预测 (未来7天)</h3>
                <div className="h-64">
                    <TrendChart data={stats.forecasts.revenue} dataKey="value" color="#059669" showForecast />
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};
