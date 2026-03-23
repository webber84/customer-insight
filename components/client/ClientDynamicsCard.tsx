
import React from 'react';
import { Newspaper, CalendarDays, ExternalLink, Globe } from 'lucide-react';
import { DynamicInfo } from '../../types';

export const ClientDynamicsCard: React.FC<{ dynamics: DynamicInfo[] }> = ({ dynamics }) => {
  
  const getCategoryConfig = (type: string) => {
    switch(type) {
      case 'STRATEGY': return { label: '战略合作', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 'FINANCE': return { label: '财务动态', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'UPDATE': return { label: '产品更新', color: 'text-blue-600 bg-blue-50 border-blue-100' };
      default: return { label: '一般动态', color: 'text-slate-600 bg-slate-50 border-slate-100' };
    }
  };

  return (
    <section className="bg-white rounded border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><Newspaper size={16}/></div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">实时动态</h3>
      </div>

      <div className="space-y-4">
        {dynamics.map((item, i) => {
          const catConfig = getCategoryConfig(item.type);
          
          return (
            <div key={i} className="p-6 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-md transition-all group bg-white">
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

              {/* Title (Summary) */}
              <h4 className="text-sm font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>

              {/* Content (Details) */}
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
    </section>
  );
};
