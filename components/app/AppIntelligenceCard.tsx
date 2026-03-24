
import React from 'react';
import { Newspaper, CalendarDays, ExternalLink, Globe, Sparkles } from 'lucide-react';

interface AppIntelligenceCardProps {
  dynamics: { 
    type: string;
    title: string;
    date: string; 
    source: string; 
    content: string;
    url?: string;
  }[];
}

export const AppIntelligenceCard: React.FC<AppIntelligenceCardProps> = ({ dynamics }) => {
  
  const getCategoryConfig = (type: string) => {
    switch(type) {
      case 'STRATEGY': return { label: '战略动态', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 'FINANCE': return { label: '财务动态', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'UPDATE': return { label: '产品更新', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      default: return { label: '一般动态', color: 'text-slate-600 bg-slate-50 border-slate-100' };
    }
  };

  return (
    <section className="bg-white rounded border border-slate-200 p-8 mb-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><Newspaper size={16}/></div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">实时动态</h3>
      </div>
      
      <div className="space-y-6">
        {/* AI Insight Box */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm relative overflow-hidden mb-6">
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
              "该客户重心在于 AI 赋能金融，建议重点推荐高净值人群定向广告位。"
            </p>
          </div>
        </div>

        {/* Dynamics List */}
        <div className="space-y-4">
          {dynamics.map((item, i) => {
            const catConfig = getCategoryConfig(item.type);
            
            return (
              <div key={i} className="p-6 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-md transition-all group bg-white text-left">
                {/* Header: Category and Date */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border ${catConfig.color}`}>
                    {catConfig.label}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                    <CalendarDays size={12}/>
                    {item.date}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-sm font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>

                {/* Content */}
                <p className="text-xs text-slate-600 font-bold leading-relaxed mb-4">
                  {item.content}
                </p>

                {/* Footer: Source and Link */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Globe size={12} className="text-slate-300"/>
                    来源: <span className="text-slate-600">{item.source || '网络来源'}</span>
                  </div>
                  
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
                    >
                      查看详情 <ExternalLink size={10}/>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
