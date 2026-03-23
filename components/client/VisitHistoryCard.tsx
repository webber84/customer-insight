
import React, { useState } from 'react';
import { 
  History, 
  MapPin, 
  Users, 
  FileText, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Save, 
  X,
  UserCheck,
  UserPlus,
  AlertCircle,
  PlusCircle,
  Calendar,
  MessageSquare,
  Milestone,
  Trash2,
  Sparkles,
  Loader2,
  FileBarChart2,
  Download
} from 'lucide-react';
import { VisitRecord, IssueItem, ItineraryNode, ClientProfile } from '../../types';
import { extractMeetingMinutes, generateVisitPlanningReport } from '../../services/geminiService';

interface VisitHistoryCardProps {
  client: ClientProfile;
}

export const VisitHistoryCard: React.FC<VisitHistoryCardProps> = ({ client }) => {
  const [records, setRecords] = useState<VisitRecord[]>(client.visitHistory);
  const [editingIssue, setEditingIssue] = useState<{visitId: string, issueId: string} | null>(null);
  const [tempIssue, setTempIssue] = useState<Partial<IssueItem>>({});
  const [error, setError] = useState<string | null>(null);

  // 新建会晤弹窗相关状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newVisit, setNewVisit] = useState<Partial<VisitRecord>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    location: '',
    internalParticipants: [],
    clientParticipants: [],
    clientDemands: '',
    internalDemands: '',
    mainContent: '',
    conclusions: '',
    itinerary: []
  });
  
  // 会议纪要录入 AI 提取相关状态
  const [minutesModal, setMinutesModal] = useState<{ isOpen: boolean, visitId: string | null, text: string }>({ isOpen: false, visitId: null, text: '' });
  const [isExtractingMinutes, setIsExtractingMinutes] = useState(false);

  // 策划报告相关状态
  const [reportModal, setReportModal] = useState<{ isOpen: boolean, content: string, isLoading: boolean }>({ isOpen: false, content: '', isLoading: false });

  // 遗留问题删除确认
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, visitId: string, issueId: string } | null>(null);

  // 用于输入参与者的临时状态
  const [internalInput, setInternalInput] = useState('');
  const [clientInput, setClientInput] = useState('');

  const handleEditClick = (visitId: string, issue: IssueItem) => {
    setEditingIssue({ visitId, issueId: issue.id });
    setTempIssue(issue);
    setError(null);
  };

  const handleSaveIssue = (visitId: string) => {
    if (tempIssue.status === 'CLOSED' && (!tempIssue.progress || !tempIssue.progress.trim())) {
      setError("状态为‘已关闭’时，必须提供最新进展。");
      return;
    }

    setRecords(prev => prev.map(visit => {
      if (visit.id !== visitId) return visit;
      return {
        ...visit,
        items: visit.items.map(item => item.id === editingIssue?.issueId ? { ...item, ...tempIssue } as IssueItem : item)
      };
    }));
    setEditingIssue(null);
    setError(null);
  };

  const handleDeleteIssueClick = (visitId: string, issueId: string) => {
    setDeleteConfirm({ isOpen: true, visitId, issueId });
  };

  const confirmDeleteIssue = () => {
    if (!deleteConfirm) return;
    setRecords(prev => prev.map(visit => {
      if (visit.id !== deleteConfirm.visitId) return visit;
      return {
        ...visit,
        items: visit.items.filter(item => item.id !== deleteConfirm.issueId)
      };
    }));
    setDeleteConfirm(null);
  };

  const handleCreateVisit = () => {
    if (!newVisit.title || !newVisit.date) {
      alert("请填写会晤标题和日期");
      return;
    }
    const visitToSave: VisitRecord = {
      ...newVisit as VisitRecord,
      id: `v-${Date.now()}`,
      items: [], // 留空
      conclusions: newVisit.conclusions || '暂无结论'
    };
    setRecords(prev => [visitToSave, ...prev]);
    setShowCreateModal(false);
    // 重置
    setNewVisit({
      date: new Date().toISOString().split('T')[0],
      title: '', location: '', internalParticipants: [], clientParticipants: [],
      clientDemands: '', internalDemands: '', mainContent: '', conclusions: '', itinerary: []
    });
  };

  const addItineraryNode = () => {
    const newNode: ItineraryNode = {
      id: `it-${Date.now()}`,
      date: newVisit.date || '',
      time: '09:00',
      content: ''
    };
    setNewVisit(prev => ({ ...prev, itinerary: [...(prev.itinerary || []), newNode] }));
  };

  const removeItineraryNode = (id: string) => {
    setNewVisit(prev => ({ ...prev, itinerary: (prev.itinerary || []).filter(n => n.id !== id) }));
  };

  const updateItineraryNode = (id: string, field: keyof ItineraryNode, value: string) => {
    setNewVisit(prev => ({
      ...prev,
      itinerary: (prev.itinerary || []).map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const handleOpenMinutesModal = (visitId: string) => {
    setMinutesModal({ isOpen: true, visitId, text: '' });
  };

  const handleAnalyzeMinutes = async () => {
    if (!minutesModal.visitId || !minutesModal.text.trim()) return;
    setIsExtractingMinutes(true);
    try {
      const result = await extractMeetingMinutes(minutesModal.text);
      
      setRecords(prev => prev.map(visit => {
        if (visit.id !== minutesModal.visitId) return visit;
        
        // 生成新的遗留问题
        const newIssues: IssueItem[] = result.issues.map((issue, idx) => ({
          id: `ai-issue-${Date.now()}-${idx}`,
          description: issue.description,
          owner: issue.owner || '待确认',
          status: 'IN_PROGRESS',
          progress: '会议纪要自动提取'
        }));

        return {
          ...visit,
          mainContent: result.mainContent || visit.mainContent, // 优先使用提取的总结
          items: [...visit.items, ...newIssues]
        };
      }));
      setMinutesModal({ isOpen: false, visitId: null, text: '' });
    } catch (e) {
      alert("智能提取失败，请检查网络后重试。");
    } finally {
      setIsExtractingMinutes(false);
    }
  };

  const handleGenerateReport = async (visit: VisitRecord) => {
    setReportModal({ isOpen: true, content: '', isLoading: true });
    try {
      const report = await generateVisitPlanningReport(visit, client);
      setReportModal({ isOpen: true, content: report, isLoading: false });
    } catch (e) {
      setReportModal({ isOpen: true, content: '报告生成失败，请重试。', isLoading: false });
    }
  };

  return (
    <section className="bg-white rounded border border-slate-200 p-8 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><History size={16}/></div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">历次拜访与遗留事项跟踪</h3>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <PlusCircle size={14}/> 创建新会晤
        </button>
      </div>

      <div className="space-y-12">
        {records.map((visit) => (
          <div key={visit.id} className="relative pl-10 border-l-2 border-slate-100 last:border-transparent">
            {/* 时间轴节点 */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-950 shadow-sm z-10"></div>
            
            {/* 头部信息 */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100 uppercase tracking-widest">
                    {visit.date}
                  </span>
                  <h4 className="text-lg font-black text-slate-900">{visit.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <MapPin size={14} className="text-slate-300"/>
                    {visit.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleGenerateReport(visit)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[10px] font-black uppercase tracking-widest hover:bg-purple-100 transition-colors"
                    >
                      <FileBarChart2 size={12}/> 生成策划报告
                    </button>
                    <button 
                      onClick={() => handleOpenMinutesModal(visit.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      <Sparkles size={12}/> 录入会议纪要 (AI)
                    </button>
                </div>
              </div>

              {/* 出席人员矩阵 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <UserCheck size={12} className="text-blue-500"/> 我方出席人员
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {visit.internalParticipants?.map((p, i) => (
                      <span key={i} className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-lg">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <UserPlus size={12} className="text-emerald-500"/> 客户方出席人员
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {visit.clientParticipants?.map((p, i) => (
                      <span key={i} className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 诉求与会谈要点 */}
              {(visit.clientDemands || visit.internalDemands || visit.mainContent) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {visit.clientDemands && (
                    <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-lg">
                      <div className="text-[9px] font-black text-emerald-600 uppercase mb-1 flex items-center gap-1">
                        <MessageSquare size={10}/> 客户侧诉求
                      </div>
                      <p className="text-xs font-bold text-slate-700">{visit.clientDemands}</p>
                    </div>
                  )}
                  {visit.internalDemands && (
                    <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-lg">
                      <div className="text-[9px] font-black text-blue-600 uppercase mb-1 flex items-center gap-1">
                        <MessageSquare size={10}/> 我方诉求
                      </div>
                      <p className="text-xs font-bold text-slate-700">{visit.internalDemands}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 会晤内容 */}
              <div className="space-y-4">
                <div className="relative p-6 bg-slate-50 border border-slate-100 rounded-xl shadow-sm overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-slate-900">
                    <FileText size={100}/>
                  </div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-blue-600"/> 会谈要点
                  </h5>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed relative z-10 whitespace-pre-wrap">
                    {visit.mainContent || '暂无详细记录'}
                  </p>
                </div>
              </div>

              {/* 行程安排展示 */}
              {visit.itinerary && visit.itinerary.length > 0 && (
                <div className="mt-6 p-5 border border-slate-100 rounded-xl bg-slate-50/30">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Milestone size={14} className="text-indigo-500"/> 行程安排节点
                  </div>
                  <div className="space-y-4">
                    {visit.itinerary.map((node) => (
                      <div key={node.id} className="flex gap-4">
                        <div className="w-24 shrink-0">
                          <div className="text-[9px] font-black text-indigo-600 uppercase">{node.date}</div>
                          <div className="text-xs font-black text-slate-400">{node.time}</div>
                        </div>
                        <div className="flex-1 text-sm font-bold text-slate-700 border-l-2 border-indigo-100 pl-4">
                          {node.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 遗留问题跟踪区域 */}
            <div className="mt-8">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ClipboardList size={14}/> 遗留问题与当前状态跟踪 (Issue Tracking)
              </div>
              
              <div className="space-y-3">
                {visit.items?.length > 0 ? (
                  visit.items.map((item) => {
                    const isEditing = editingIssue?.visitId === visit.id && editingIssue?.issueId === item.id;
                    
                    return (
                      <div key={item.id} className={`p-5 rounded-xl border transition-all ${isEditing ? 'bg-blue-50 border-blue-200 shadow-lg ring-2 ring-blue-500/20' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'}`}>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">问题描述</label>
                                <input 
                                  value={tempIssue.description} 
                                  onChange={e => setTempIssue({...tempIssue, description: e.target.value})}
                                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">责任人</label>
                                <input 
                                  value={tempIssue.owner} 
                                  onChange={e => setTempIssue({...tempIssue, owner: e.target.value})}
                                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">当前状态</label>
                                <select 
                                  value={tempIssue.status} 
                                  onChange={e => setTempIssue({...tempIssue, status: e.target.value as any})}
                                  className="w-full text-xs font-black p-2 border border-slate-200 rounded outline-none bg-white cursor-pointer"
                                >
                                  <option value="IN_PROGRESS">进行中</option>
                                  <option value="CLOSED">已关闭</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase block mb-1">最新进展</label>
                                <input 
                                  value={tempIssue.progress} 
                                  onChange={e => setTempIssue({...tempIssue, progress: e.target.value})}
                                  className="w-full text-xs font-bold p-2 border border-slate-200 rounded outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder={tempIssue.status === 'CLOSED' ? "状态为已关闭时，此项必填" : "输入进展说明"}
                                />
                              </div>
                            </div>
                            {error && <div className="text-[10px] font-bold text-rose-500 flex items-center gap-1"><AlertCircle size={10}/> {error}</div>}
                            <div className="flex justify-end gap-2 pt-2">
                              <button onClick={() => setEditingIssue(null)} className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900">取消</button>
                              <button onClick={() => handleSaveIssue(visit.id)} className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-700 transition-all"><Save size={12}/> 保存更新</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${item.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {item.status === 'CLOSED' ? <CheckCircle2 size={10}/> : <Clock size={10}/>}
                                  {item.status === 'CLOSED' ? '已关闭' : '进行中'}
                                </span>
                                <div className="text-sm font-bold text-slate-900">{item.description}</div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">责任人</div>
                                  <div className="text-[11px] font-bold text-slate-700">{item.owner}</div>
                                </div>
                                <div className="md:col-span-3">
                                  <div className="text-[9px] font-black text-slate-400 uppercase mb-0.5">最新进展</div>
                                  <div className="text-[11px] font-bold text-slate-600 italic">
                                    {item.progress || '等待录入...'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleEditClick(visit.id, item)}
                                className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 transition-colors"
                                title="编辑"
                              >
                                <Edit3 size={16}/>
                              </button>
                              <button 
                                onClick={() => handleDeleteIssueClick(visit.id, item.id)}
                                className="p-2 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                                title="删除"
                              >
                                <Trash2 size={16}/>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs font-bold text-slate-300 italic p-4 border border-dashed border-slate-100 rounded-lg">
                    暂无遗留事项
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 创建新会晤弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-4xl relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 text-slate-700">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-blue-600" size={20}/>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">录入新会晤记录</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-200 rounded text-slate-400"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
              {/* 1. 背景信息 */}
              <section className="space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-blue-500"/> 背景信息 (Background)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">会晤标题</label>
                    <input 
                      type="text" value={newVisit.title} onChange={e => setNewVisit({...newVisit, title: e.target.value})}
                      placeholder="例如: Q3 季度框架协议讨论"
                      className="w-full text-sm font-bold p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">时间</label>
                      <input 
                        type="date" value={newVisit.date} onChange={e => setNewVisit({...newVisit, date: e.target.value})}
                        className="w-full text-sm font-bold p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">地点</label>
                      <input 
                        type="text" value={newVisit.location} onChange={e => setNewVisit({...newVisit, location: e.target.value})}
                        placeholder="地点..."
                        className="w-full text-sm font-bold p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">客户侧出席人员</label>
                    <div className="flex gap-2">
                      <input 
                        value={clientInput} onChange={e => setClientInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { setNewVisit(p => ({...p, clientParticipants: [...(p.clientParticipants || []), clientInput]})); setClientInput(''); } }}
                        className="flex-1 text-sm font-bold p-2 border border-slate-200 rounded outline-none"
                        placeholder="输入人名回车添加"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newVisit.clientParticipants?.map((p, i) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {p} <X size={10} className="cursor-pointer" onClick={() => setNewVisit(v => ({...v, clientParticipants: v.clientParticipants?.filter((_, idx) => idx !== i)}))}/>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">我方出席人员</label>
                    <div className="flex gap-2">
                      <input 
                        value={internalInput} onChange={e => setInternalInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { setNewVisit(p => ({...p, internalParticipants: [...(p.internalParticipants || []), internalInput]})); setInternalInput(''); } }}
                        className="flex-1 text-sm font-bold p-2 border border-slate-200 rounded outline-none"
                        placeholder="输入人名回车添加"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newVisit.internalParticipants?.map((p, i) => (
                        <span key={i} className="flex items-center gap-1 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {p} <X size={10} className="cursor-pointer" onClick={() => setNewVisit(v => ({...v, internalParticipants: v.internalParticipants?.filter((_, idx) => idx !== i)}))}/>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. 诉求与要点 */}
              <section className="space-y-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-blue-500"/> 双方诉求及会谈要点 (Demands & Points)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">客户侧诉求</label>
                    <textarea 
                      value={newVisit.clientDemands} onChange={e => setNewVisit({...newVisit, clientDemands: e.target.value})}
                      className="w-full text-sm font-bold p-3 border border-slate-200 rounded-lg h-24 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="客户想要解决什么问题？"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">我方诉求</label>
                    <textarea 
                      value={newVisit.internalDemands} onChange={e => setNewVisit({...newVisit, internalDemands: e.target.value})}
                      className="w-full text-sm font-bold p-3 border border-slate-200 rounded-lg h-24 outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="我们此次的目标是？"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">会谈要点记录</label>
                  <textarea 
                    value={newVisit.mainContent} onChange={e => setNewVisit({...newVisit, mainContent: e.target.value})}
                    className="w-full text-sm font-bold p-4 border border-slate-200 rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="记录会晤的核心过程与沟通关键点..."
                  />
                </div>
              </section>

              {/* 3. 行程安排 */}
              <section className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Milestone size={14} className="text-indigo-500"/> 行程安排节点 (Itinerary)
                  </div>
                  <button onClick={addItineraryNode} className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 uppercase hover:bg-indigo-100 transition-colors">
                    <PlusCircle size={12}/> 添加行程
                  </button>
                </div>
                <div className="space-y-4">
                  {newVisit.itinerary?.map((node) => (
                    <div key={node.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-4 items-start animate-in fade-in slide-in-from-left-2">
                      <div className="grid grid-cols-2 gap-2 w-64 shrink-0">
                        <input 
                          type="date" value={node.date} onChange={e => updateItineraryNode(node.id, 'date', e.target.value)}
                          className="text-[10px] font-black p-2 border border-slate-200 rounded bg-white outline-none"
                        />
                        <input 
                          type="time" value={node.time} onChange={e => updateItineraryNode(node.id, 'time', e.target.value)}
                          className="text-[10px] font-black p-2 border border-slate-200 rounded bg-white outline-none"
                        />
                      </div>
                      <input 
                        type="text" value={node.content} onChange={e => updateItineraryNode(node.id, 'content', e.target.value)}
                        placeholder="行程内容描述..."
                        className="flex-1 text-sm font-bold p-2 border border-slate-200 rounded bg-white outline-none"
                      />
                      <button onClick={() => removeItineraryNode(node.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  ))}
                  {(!newVisit.itinerary || newVisit.itinerary.length === 0) && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 text-xs font-black uppercase tracking-widest">
                      尚未添加行程节点
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">取消</button>
              <button onClick={handleCreateVisit} className="px-10 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                <Save size={16}/> 保存会晤记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 会议纪要 AI 提取弹窗 */}
      {minutesModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => !isExtractingMinutes && setMinutesModal({...minutesModal, isOpen: false})}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-2xl relative overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-indigo-600" size={18}/>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">会议纪要智能提取</h4>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 leading-relaxed">
              输入原始会议纪要文本，AI 将自动归纳核心会谈要点，并提取待跟进的遗留问题与责任人。
            </p>
            <textarea 
              value={minutesModal.text} 
              onChange={(e) => setMinutesModal({...minutesModal, text: e.target.value})}
              placeholder="粘贴会议纪要..."
              className="w-full h-64 p-4 text-sm font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-6 bg-slate-50"
              disabled={isExtractingMinutes}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setMinutesModal({...minutesModal, isOpen: false})} 
                disabled={isExtractingMinutes}
                className="px-6 py-2.5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900"
              >
                取消
              </button>
              <button 
                onClick={handleAnalyzeMinutes} 
                disabled={isExtractingMinutes || !minutesModal.text.trim()} 
                className="px-8 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-3 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {isExtractingMinutes ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>} 智能提取并填充
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 策划报告展示弹窗 */}
      {reportModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setReportModal({...reportModal, isOpen: false})}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-3xl h-[80vh] relative overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-2">
                 <FileBarChart2 className="text-purple-600" size={18}/>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">高层会晤策划报告</h3>
               </div>
               <button onClick={() => setReportModal({...reportModal, isOpen: false})} className="p-1 hover:bg-slate-200 rounded text-slate-400"><X size={20}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                {reportModal.isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Loader2 size={32} className="animate-spin mb-4 text-purple-600"/>
                    <p className="text-xs font-black uppercase tracking-widest">正在生成策划报告...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none">
                     <div className="whitespace-pre-wrap font-medium text-slate-800 leading-relaxed">
                        {reportModal.content}
                     </div>
                  </div>
                )}
             </div>

             <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                <button 
                  onClick={() => {
                     // Simple clipboard copy
                     navigator.clipboard.writeText(reportModal.content);
                     alert("报告内容已复制到剪贴板");
                  }}
                  disabled={reportModal.isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
                >
                   <Download size={14}/> 复制报告内容
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setDeleteConfirm(null)}></div>
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-sm relative overflow-hidden shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6"><Trash2 size={32}/></div>
            <h4 className="text-lg font-black text-slate-900 mb-2">确认删除该遗留问题？</h4>
            <p className="text-xs text-slate-500 mb-8 font-bold">此操作无法撤销，请确认该问题已废弃或记录错误。</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50">取消</button>
              <button onClick={confirmDeleteIssue} className="flex-1 px-4 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-500/20">确认删除</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #cbd5e1; }
      `}</style>
    </section>
  );
};
