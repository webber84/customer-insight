
import React from 'react';
import { 
  X, Edit3, Mail, Briefcase, Building, Award, Zap, 
  Smartphone, Check, GraduationCap, History, MessageSquare, 
  PencilLine, StickyNote, Trash2, Save 
} from 'lucide-react';
import { DecisionMaker } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface DecisionMakerModalProps {
  maker: DecisionMaker;
  onClose: () => void;
  onAiEditClick: () => void;
  onToggleBusiness: (biz: string) => void;
  isEditingRemarks: boolean;
  remarksText: string;
  setRemarksText: (val: string) => void;
  onStartEditRemarks: () => void;
  onSaveRemarks: () => void;
  onDeleteClick: () => void;
}

export const DecisionMakerModal: React.FC<DecisionMakerModalProps> = ({
  maker, onClose, onAiEditClick, onToggleBusiness, 
  isEditingRemarks, remarksText, setRemarksText, 
  onStartEditRemarks, onSaveRemarks, onDeleteClick
}) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-xl relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="p-8 border-b border-slate-100 flex items-center gap-6 bg-slate-50/50 relative text-left text-slate-900">
          <ImageWithFallback 
            src={maker.avatar} 
            alt={maker.name} 
            className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-lg"
            fallbackText={maker.name}
          />
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-1">{maker.name}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
               <Mail size={12} className="text-slate-400"/>
               <span>{maker.contact || '暂无联系方式'}</span>
            </div>
          </div>
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button 
              onClick={onAiEditClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-colors"
            >
              <Edit3 size={12}/> AI 更新
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto space-y-8 text-left text-slate-700">
          <div className="grid grid-cols-2 gap-4 text-slate-900">
            <div className="p-4 bg-slate-50 rounded border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Briefcase size={12}/> 职位
              </div>
              <div className="text-sm font-bold">{maker.title}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Building size={12}/> 部门
              </div>
              <div className="text-sm font-bold">{maker.department}</div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Award size={14}/> 决策力评估
            </h4>
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-slate-700 leading-relaxed flex items-start gap-2">
                <Zap size={14} className="mt-0.5 shrink-0 text-slate-400"/>
                <span>
                  {maker.decisionPower === 'HIGH' ? '【核心决策人】 负责集团层面的预算把控与最终资源审批。拥有最高层级的决策话语权。' :
                   maker.decisionPower === 'MEDIUM' ? '【关键影响者】 在方案评估与供应商选择阶段拥有重要建议权，其意见常被决策层采纳。' :
                   '【执行配合者】 负责具体业务运营与数据对账。虽不直接决定预算，但对日常合作满意度有重要影响。'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Smartphone size={14}/> 负责业务
            </h4>
            <div className="flex flex-wrap gap-2">
              {['推广', '预装', 'Push', '联运'].map((biz) => {
                const isSelected = maker.responsibleBusiness?.includes(biz);
                return (
                  <button 
                    key={biz}
                    onClick={() => onToggleBusiness(biz)}
                    className={`flex items-center justify-center gap-1.5 py-1 px-2.5 rounded border transition-all font-black text-[9px] uppercase tracking-tighter
                      ${isSelected 
                        ? 'bg-slate-900 border-slate-950 text-white shadow-sm' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                  >
                    {isSelected ? <Check size={10}/> : <div className="w-2 h-2 border border-slate-100 rounded"></div>}
                    {biz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <GraduationCap size={14}/> 教育背景
            </h4>
            <div className="space-y-2">
              {maker.education?.map((edu, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-100 text-sm font-bold text-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  {edu}
                </div>
              )) || <div className="text-xs font-bold text-slate-300 italic">暂无记录</div>}
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <History size={14}/> 工作履历
            </h4>
            <div className="space-y-4">
              {maker.workExperience.map((exp, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0 group-hover:bg-blue-600 transition-colors"></div>
                  <div className="text-sm font-bold text-slate-700 leading-relaxed">{exp}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 relative shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                <MessageSquare size={14}/> 运营备注
              </h4>
              {!isEditingRemarks ? (
                <button onClick={onStartEditRemarks} className="flex items-center gap-1 px-2 py-1 bg-white border border-amber-200 rounded text-[9px] font-black text-amber-600 hover:bg-amber-100 transition-all shadow-sm uppercase tracking-widest">
                  <PencilLine size={12}/> 编辑备注
                </button>
              ) : (
                <button onClick={onSaveRemarks} className="flex items-center gap-1 px-2 py-1 bg-emerald-600 border border-emerald-700 rounded text-[9px] font-black text-white hover:bg-emerald-700 transition-all shadow-sm uppercase tracking-widest">
                  <Check size={12}/> 保存备注
                </button>
              )}
            </div>
            {isEditingRemarks ? (
              <textarea
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-lg p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-[100px] shadow-inner"
                autoFocus
              />
            ) : (
              <div className="relative">
                <div className="absolute -left-2 -top-2 opacity-5 text-amber-900"><StickyNote size={40}/></div>
                <p className="text-sm font-bold text-amber-900 leading-relaxed italic relative z-10">
                  "{maker.remarks || '暂无运营备注。'}"
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button onClick={onDeleteClick} className="px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded border border-rose-100 hover:bg-rose-100 transition-all flex items-center gap-2">
            <Trash2 size={14}/> 删除此人
          </button>
          <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
            <Save size={14}/> 保存并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
