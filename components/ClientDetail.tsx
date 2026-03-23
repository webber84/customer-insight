
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Loader2, History, AlertCircle, Sparkles, X, ChevronRight 
} from 'lucide-react';
import { ClientProfile, DecisionMaker, CorporateBasicInfo, InfoCategory } from '../types';
import { parseDecisionMakerEdit, extractCorporateBasicInfo, summarizeCategoryHistory } from '../services/geminiService';

// 导入拆分后的原子组件
import { ClientBasicInfoCard } from './client/ClientBasicInfoCard';
import { OrgChartCard } from './client/OrgChartCard';
import { DecisionMakerModal } from './client/DecisionMakerModal';
import { AppMatrixCard } from './client/AppMatrixCard';
import { FinancialPerformanceCard } from './client/FinancialPerformanceCard';
import { VisitHistoryCard } from './client/VisitHistoryCard';
import { ClientDynamicsCard } from './client/ClientDynamicsCard';
import { CorporateBasicInfoCard } from './client/CorporateBasicInfoCard';

interface ClientDetailProps {
  client: ClientProfile;
  onNavigateToApp: (appId: string) => void;
  onBack: () => void;
}

const SECTION_LABELS: Record<string, string> = {
  history: '发展历程',
  strategy: '战略规划',
  productLayout: '产品布局',
  businessStatus: '经营情况',
  orgStructure: '组织架构',
  budgetAllocation: '预算分配',
  evaluationMethod: '考核方式',
  attributionMethod: '归因方式'
};

export const ClientDetail: React.FC<ClientDetailProps> = ({ client: initialClient, onNavigateToApp, onBack }) => {
  // Client state to support top-level edits
  const [clientData, setClientData] = useState<ClientProfile>(initialClient);

  // Sync prop changes to state (if switching clients)
  useEffect(() => {
    setClientData(initialClient);
  }, [initialClient]);

  const [localTeam, setLocalTeam] = useState<DecisionMaker[]>(initialClient.decisionTeam);
  const [localBasicInfo, setLocalBasicInfo] = useState<CorporateBasicInfo>(initialClient.corporateBasicInfo);
  const [selectedMaker, setSelectedMaker] = useState<DecisionMaker | null>(null);

  // Update localTeam when clientData changes (switching clients)
  useEffect(() => {
    setLocalTeam(clientData.decisionTeam);
    setLocalBasicInfo(clientData.corporateBasicInfo);
  }, [clientData.id]);

  // AI 更新/新增状态
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [aiInputText, setAiInputText] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isAiBasicInfoProcessing, setIsAiBasicInfoProcessing] = useState(false);

  // 备注编辑状态
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDrop = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setLocalTeam(prev => prev.map(m => m.id === sourceId ? { ...m, reportsTo: targetId } : m));
  }, []);

  const handleAiUpdateMaker = async () => {
    if (!aiInputText.trim()) return;
    setIsAiProcessing(true);
    try {
      const result = await parseDecisionMakerEdit(aiInputText);
      if (isAddingNew) {
        const newMaker: DecisionMaker = { ...result, id: `dm-${Date.now()}`, department: result.department || '未知' };
        setLocalTeam(prev => [...prev, newMaker]);
        setIsAddingNew(false);
      } else if (selectedMaker) {
        const updated = { ...selectedMaker, ...result };
        setLocalTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
        setSelectedMaker(updated);
      }
      setAiInputText(""); setIsAiEditing(false);
    } catch (e) { alert("AI 解析失败"); } finally { setIsAiProcessing(false); }
  };

  const handleAiUpdateBasicInfo = async (inputText: string) => {
    setIsAiBasicInfoProcessing(true);
    try {
      // 1. 提取各维度的变动
      const extracted = await extractCorporateBasicInfo(inputText);
      const today = new Date().toISOString().split('T')[0];
      
      const updatedInfo = { ...localBasicInfo };
      const tasks: Promise<void>[] = [];

      // 2. 针对有变动的维度进行历史追加和重新总结
      Object.keys(extracted).forEach((key) => {
        const fieldKey = key as keyof CorporateBasicInfo;
        const rawContent = extracted[key];
        
        if (rawContent && rawContent.trim()) {
          const current = localBasicInfo[fieldKey] || { summary: '', history: [] };
          const newEntry = {
            id: `ai-${Date.now()}-${fieldKey}`,
            date: today,
            content: rawContent
          };
          const newHistory = [newEntry, ...(current.history || [])];
          
          // 异步调用总结接口
          const task = summarizeCategoryHistory(SECTION_LABELS[fieldKey] || fieldKey, newHistory)
            .then(newSummary => {
              updatedInfo[fieldKey] = {
                summary: newSummary,
                history: newHistory
              };
            });
          tasks.push(task);
        }
      });
      
      await Promise.all(tasks);
      setLocalBasicInfo({ ...updatedInfo });
    } catch (e) {
      console.error(e);
      alert("AI 背景解析或总结失败，请检查网络或重试。");
    } finally {
      setIsAiBasicInfoProcessing(false);
    }
  };

  const toggleBusiness = (biz: string) => {
    if (!selectedMaker) return;
    const current = selectedMaker.responsibleBusiness || [];
    const next = current.includes(biz) ? current.filter(b => b !== biz) : [...current, biz];
    const updated = { ...selectedMaker, responsibleBusiness: next };
    setSelectedMaker(updated);
    setLocalTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8 animate-in fade-in duration-300 text-left">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
          <ChevronRight className="rotate-180" size={14}/> 返回客户搜索
        </button>
      </div>

      {/* 基本信息头部 (支持编辑) */}
      <ClientBasicInfoCard 
        client={clientData} 
        onClientUpdate={setClientData}
      />

      {/* 1. 客户基本情况卡片 */}
      <CorporateBasicInfoCard 
        data={localBasicInfo} 
        onUpdate={setLocalBasicInfo}
        onAiUpdate={handleAiUpdateBasicInfo}
        isAiProcessing={isAiBasicInfoProcessing}
      />

      {/* 2. 实时动态 */}
      <ClientDynamicsCard dynamics={clientData.dynamics} />

      {/* 3. 关键角色 (组织图谱) */}
      <OrgChartCard 
        localTeam={localTeam}
        onAddClick={() => { setIsAddingNew(true); setIsAiEditing(true); }}
        onMakerClick={(m) => { setSelectedMaker(m); setIsEditingRemarks(false); }}
        onDrop={handleDrop}
        draggingId={draggingId}
        setDraggingId={setDraggingId}
      />

      {/* 4. 拜访记录 */}
      <VisitHistoryCard client={clientData} />

      {/* 5. 财务表现 (预算执行情况) */}
      <FinancialPerformanceCard client={clientData} />

      {/* 6. App 矩阵 (产品矩阵) */}
      <AppMatrixCard matrix={clientData.appMatrix} onNavigate={onNavigateToApp} />

      {/* 模态框组省略... */}
      {selectedMaker && (
        <DecisionMakerModal 
          maker={selectedMaker}
          onClose={() => setSelectedMaker(null)}
          onAiEditClick={() => { setIsAddingNew(false); setIsAiEditing(true); }}
          onToggleBusiness={toggleBusiness}
          isEditingRemarks={isEditingRemarks}
          remarksText={remarksText}
          setRemarksText={setRemarksText}
          onStartEditRemarks={() => { setRemarksText(selectedMaker.remarks); setIsEditingRemarks(true); }}
          onSaveRemarks={() => {
            const updated = { ...selectedMaker, remarks: remarksText };
            setSelectedMaker(updated);
            setLocalTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
            setIsEditingRemarks(false);
          }}
          onDeleteClick={() => setShowDeleteConfirm(true)}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-sm relative overflow-hidden shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={32}/></div>
            <h4 className="text-lg font-black text-slate-900 mb-2">确认删除？</h4>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg">取消</button>
              <button onClick={() => {
                setLocalTeam(prev => prev.filter(m => m.id !== selectedMaker?.id));
                setSelectedMaker(null); setShowDeleteConfirm(false);
              }} className="flex-1 px-4 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">确认删除</button>
            </div>
          </div>
        </div>
      )}

      {isAiEditing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => !isAiProcessing && setIsAiEditing(false)}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-lg relative overflow-hidden shadow-2xl animate-in fade-in duration-200 p-8 text-left text-slate-900">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-blue-600" size={18}/>
              <h4 className="text-xs font-black uppercase tracking-widest">{isAddingNew ? 'AI 智能新增' : 'AI 更新背景'}</h4>
            </div>
            <textarea 
              value={aiInputText} onChange={(e) => setAiInputText(e.target.value)}
              placeholder="输入描述信息..."
              className="w-full h-32 p-4 text-sm font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 mb-6 bg-white"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAiEditing(false)} className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">取消</button>
              <button onClick={handleAiUpdateMaker} disabled={isAiProcessing} className="px-8 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                {isAiProcessing ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} 立即同步
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
