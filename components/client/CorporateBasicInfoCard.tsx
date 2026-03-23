
import React, { useState } from 'react';
import { 
  BookOpen, Target, Layout, Activity, Users, 
  Coins, CheckSquare, Fingerprint, PlusCircle, 
  Save, X, Sparkles, Loader2, History as HistoryIcon
} from 'lucide-react';
import { CorporateBasicInfo, InfoCategory } from '../../types';
import { summarizeCategoryHistory } from '../../services/geminiService';

interface CorporateBasicInfoCardProps {
  data: CorporateBasicInfo;
  onUpdate: (newData: CorporateBasicInfo) => void;
  onAiUpdate: (inputText: string) => Promise<void>;
  isAiProcessing: boolean;
}

const SECTION_CONFIG = [
  { key: 'history', label: '发展历程', icon: <BookOpen size={16}/> },
  { key: 'strategy', label: '战略规划', icon: <Target size={16}/> },
  { key: 'productLayout', label: '产品布局', icon: <Layout size={16}/> },
  { key: 'businessStatus', label: '经营情况', icon: <Activity size={16}/> },
  { key: 'orgStructure', label: '组织架构', icon: <Users size={16}/> },
  { key: 'budgetAllocation', label: '预算分配', icon: <Coins size={16}/> },
  { key: 'evaluationMethod', label: '考核方式', icon: <CheckSquare size={16}/> },
  { key: 'attributionMethod', label: '归因方式', icon: <Fingerprint size={16}/> },
] as const;

export const CorporateBasicInfoCard: React.FC<CorporateBasicInfoCardProps> = ({ 
  data, onUpdate, onAiUpdate, isAiProcessing 
}) => {
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [tempText, setTempText] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const handleAddRecord = async () => {
    if (addingKey && tempText.trim()) {
      setIsSummarizing(true);
      const category = data[addingKey as keyof CorporateBasicInfo] as InfoCategory;
      const newEntry = {
        id: `entry-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        content: tempText
      };
      
      const newHistory = [newEntry, ...(category.history || [])];
      
      // 调用 LLM 基于全量历史生成新综述
      const newSummary = await summarizeCategoryHistory(
        SECTION_CONFIG.find(s => s.key === addingKey)?.label || addingKey,
        newHistory
      );

      onUpdate({ 
        ...data, 
        [addingKey]: {
          summary: newSummary,
          history: newHistory
        } 
      });
      
      setAddingKey(null);
      setTempText("");
      setIsSummarizing(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;
    await onAiUpdate(aiInput);
    setAiInput("");
    setShowAiModal(false);
  };

  return (
    <section className="bg-white rounded border border-slate-200 p-8 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><BookOpen size={16}/></div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">客户基本情况</h3>
        </div>
        <button 
          onClick={() => setShowAiModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          <Sparkles size={14}/> 更新信息 (AI)
        </button>
      </div>

      <div className="space-y-12">
        {SECTION_CONFIG.map((section) => {
          const isAdding = addingKey === section.key;
          const category = data[section.key as keyof CorporateBasicInfo] as InfoCategory;
          const summary = category?.summary || "暂无描述信息";
          const history = category?.history || [];

          return (
            <div key={section.key} className="group">
              {/* 标题与操作栏 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600 p-1 bg-blue-50 rounded">{section.icon}</div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{section.label}</span>
                </div>
                {!isAdding && (
                  <button 
                    onClick={() => setAddingKey(section.key)}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-[9px] font-black text-slate-400 uppercase transition-all"
                  >
                    <PlusCircle size={12}/> 添加记录
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 左侧：综述内容 (直接展示文本) */}
                <div className="lg:col-span-7">
                  {isAdding ? (
                    <div className="space-y-3 p-4 bg-blue-50/30 border border-blue-100 rounded-lg animate-in fade-in duration-200">
                      <div className="text-[9px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1">
                        <PlusCircle size={10}/> 新增动态描述
                      </div>
                      <textarea 
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        placeholder="描述最新的变化，例如：'Q2 预算向短视频偏移 20%'"
                        className="w-full text-sm font-bold p-3 border border-blue-200 rounded bg-white min-h-[80px] focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setAddingKey(null)} className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">取消</button>
                        <button 
                          onClick={handleAddRecord} 
                          disabled={isSummarizing || !tempText.trim()}
                          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase hover:bg-blue-700 shadow-md disabled:opacity-50"
                        >
                          {isSummarizing ? <Loader2 size={12} className="animate-spin"/> : <Save size={12}/>} 
                          {isSummarizing ? 'AI 总结中...' : '提交记录'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative pl-6 py-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-transparent rounded-full opacity-20"></div>
                      <p className="text-base font-bold text-slate-700 leading-relaxed">
                        {summary}
                      </p>
                    </div>
                  )}
                </div>

                {/* 右侧：紧凑的时间轴 */}
                <div className="lg:col-span-5 border-l border-slate-100 pl-8">
                  <div className="text-[9px] font-black text-slate-300 uppercase mb-4 flex items-center gap-1.5">
                    <HistoryIcon size={12}/> 更新轨迹 (Timeline)
                  </div>
                  <div className="space-y-6 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length > 0 ? (
                      history.map((entry) => (
                        <div key={entry.id} className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-slate-200 before:rounded-full group/item">
                          <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5 group-hover/item:text-blue-500 transition-colors">{entry.date}</div>
                          <p className="text-[11px] font-bold text-slate-500 leading-tight">{entry.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] font-bold text-slate-300 italic">暂无历史变更</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI 录入弹窗 (逻辑保持不变，但增加总结提示) */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !isAiProcessing && setShowAiModal(false)}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-lg relative overflow-hidden shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-blue-600" size={18}/>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">AI 客户情报批量注入</h4>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 leading-relaxed">
              输入最新的调研纪要或市场简报。AI 将分析各维度内容，添加历史节点，并重新总结全量信息的综述。
            </p>
            <textarea 
              value={aiInput} 
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="例如：客户近期架构调整，王总调任总部负责预算，Q3 侧重游戏联运..."
              className="w-full h-48 p-4 text-sm font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 mb-6 bg-slate-50"
              disabled={isAiProcessing}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAiModal(false)} 
                disabled={isAiProcessing}
                className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
              >
                取消
              </button>
              <button 
                onClick={handleAiSubmit} 
                disabled={isAiProcessing || !aiInput.trim()} 
                className="px-8 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isAiProcessing ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} 识别并重新提炼
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8f0; }
      `}</style>
    </section>
  );
};
