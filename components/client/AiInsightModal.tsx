
import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { InsightResponse } from '../../types';

export const AiInsightModal: React.FC<{ 
  insight: InsightResponse; 
  onClose: () => void 
}> = ({ insight, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded border border-slate-200 w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 text-slate-700">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" size={20}/>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">AI 深度洞察</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-400"><X size={20}/></button>
        </div>
        <div className="p-8 overflow-y-auto space-y-6 text-left">
          <div className="bg-blue-50/50 p-6 rounded border border-blue-100">
            <h4 className="text-[10px] font-black text-blue-400 uppercase mb-3 tracking-widest">执行摘要</h4>
            <p className="text-sm text-slate-900 font-bold">{insight.summary}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">行动建议</h4>
            {insight.actionItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 border border-slate-100 rounded font-bold text-sm text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
