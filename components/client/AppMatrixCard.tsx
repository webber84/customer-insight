
import React from 'react';
import { Layers, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';
import { AppInMatrix } from '../../types';

interface AppMatrixCardProps {
  matrix: AppInMatrix[];
  onNavigate: (appId: string) => void;
}

export const AppMatrixCard: React.FC<AppMatrixCardProps> = ({ matrix, onNavigate }) => {
  
  const calculateLastYear = (current: number, yoy: number) => {
    return current / (1 + yoy / 100);
  };

  const renderMetricCell = (val: { current: number; yoy: number }) => {
    const lastYear = calculateLastYear(val.current, val.yoy);
    
    return (
      <div className="flex flex-col gap-1 min-w-[100px]">
        <div className="text-sm font-mono font-black text-slate-900">
          ¥{(val.current / 10000).toFixed(1)}w
        </div>
        <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-bold text-slate-400">去年: ¥{(lastYear / 10000).toFixed(1)}w</span>
            <div className={`flex items-center gap-0.5 text-[9px] font-black ${val.yoy > 0 ? 'text-rose-600' : val.yoy < 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {val.yoy > 0 ? <TrendingUp size={10}/> : val.yoy < 0 ? <TrendingDown size={10}/> : <Minus size={10}/>}
                {Math.abs(val.yoy)}%
            </div>
        </div>
      </div>
    );
  };

  const renderCooperation = (coop: AppInMatrix['cooperation']) => {
      const active = [];
      if (coop.promotion) active.push('推广');
      if (coop.preinstall) active.push('预装');
      if (coop.push) active.push('Push');
      if (coop.joint) active.push('联运');

      return (
          <div className="flex flex-wrap gap-1 min-w-[120px]">
              {active.map(c => (
                  <span key={c} className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                      {c}
                  </span>
              ))}
          </div>
      );
  }

  return (
    <section className="bg-white rounded border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><Layers size={16}/></div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">产品矩阵</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-4 py-3 min-w-[200px]">产品信息</th>
              <th className="px-4 py-3">合作业务</th>
              <th className="px-4 py-3">推广直投消耗</th>
              <th className="px-4 py-3">推广DSP消耗</th>
              <th className="px-4 py-3">预装收入</th>
              <th className="px-4 py-3">Push收入</th>
              <th className="px-4 py-3">联运收入</th>
              <th className="px-4 py-3 text-right sticky right-0 bg-white z-10 shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.05)]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-lg border border-slate-100 shadow-sm" />
                    <div>
                        <div className="text-sm font-bold text-slate-900">{app.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">ID: {app.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 align-top pt-5">
                    {renderCooperation(app.cooperation)}
                </td>
                <td className="px-4 py-4 align-top pt-3">{renderMetricCell(app.directSpend)}</td>
                <td className="px-4 py-4 align-top pt-3">{renderMetricCell(app.dspSpend)}</td>
                <td className="px-4 py-4 align-top pt-3">{renderMetricCell(app.preinstallRevenue)}</td>
                <td className="px-4 py-4 align-top pt-3">{renderMetricCell(app.pushRevenue)}</td>
                <td className="px-4 py-4 align-top pt-3">{renderMetricCell(app.jointRevenue)}</td>
                <td className="px-4 py-4 text-right align-middle sticky right-0 bg-white group-hover:bg-slate-50 z-10 shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.05)]">
                  <button 
                    onClick={() => onNavigate(app.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-black uppercase text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                  >
                    查看详情 <ExternalLink size={10}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
