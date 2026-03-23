
import React, { useState } from 'react';
import { Award, Zap, Edit3, Check, X, Coins } from 'lucide-react';
import { ClientProfile } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ClientBasicInfoCardProps {
  client: ClientProfile;
  onClientUpdate: (updatedClient: ClientProfile) => void;
}

export const ClientBasicInfoCard: React.FC<ClientBasicInfoCardProps> = ({ client, onClientUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for edits
  const [editTier, setEditTier] = useState(client.tier);
  const [editCooperation, setEditCooperation] = useState(client.cooperation);
  const [editFinancials, setEditFinancials] = useState(client.financials);

  const handleSave = () => {
    onClientUpdate({
      ...client,
      tier: editTier,
      cooperation: editCooperation,
      financials: editFinancials
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTier(client.tier);
    setEditCooperation(client.cooperation);
    setEditFinancials(client.financials);
    setIsEditing(false);
  };

  const toggleCooperation = (key: keyof typeof editCooperation) => {
    setEditCooperation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateBudget = (key: keyof typeof editFinancials, value: string) => {
    const numValue = parseFloat(value);
    setEditFinancials(prev => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const cooperationConfig = [
    { key: 'promotion', label: '推广' },
    { key: 'preinstall', label: '预装' },
    { key: 'push', label: 'Push' },
    { key: 'joint', label: '联运' },
  ] as const;

  const formatBudget = (val: number) => `¥${(val / 1000000).toFixed(1)}M`;

  return (
    <section className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm relative">
      <div className="absolute top-6 right-6 z-10">
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all"
          >
            <Edit3 size={12}/> 编辑信息
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-all"
            >
              <X size={12}/> 取消
            </button>
            <button 
              onClick={handleSave} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 border border-blue-600 rounded text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md"
            >
              <Check size={12}/> 保存
            </button>
          </div>
        )}
      </div>

      <div className="p-8 pb-0 flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        <div className="flex items-center gap-6">
          <ImageWithFallback 
            src={client.logo} 
            alt={client.name} 
            className="w-20 h-20 rounded border border-slate-100 object-cover shadow-sm" 
            fallbackText={client.name} 
          />
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">{client.name}</h1>
            
            {/* 合作业务 */}
            <div className="flex flex-wrap gap-2">
              {cooperationConfig.map((item) => {
                const isActive = isEditing ? editCooperation[item.key] : client.cooperation[item.key];
                
                if (isEditing) {
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleCooperation(item.key)}
                      className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                        isActive 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                }

                return (
                  <div 
                    key={item.key}
                    className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-blue-100' 
                        : 'bg-slate-50 text-slate-300 border-slate-100 grayscale opacity-60'
                    }`}
                  >
                    <Zap size={10} className={isActive ? 'fill-blue-600 text-blue-600' : 'text-slate-300'}/>
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 pt-6 grid grid-cols-1 md:grid-cols-5 gap-8 border-t border-slate-50 mt-4 text-left">
        {/* 客户等级 */}
        <div className="md:col-span-1 border-r border-slate-100 pr-8">
          <div className="text-[10px] text-slate-400 mb-2 font-black uppercase tracking-widest flex items-center gap-1.5">
             <Award size={12}/> 客户等级
          </div>
          {isEditing ? (
            <select 
              value={editTier} 
              onChange={(e) => setEditTier(e.target.value as any)}
              className="w-full text-lg font-black text-slate-900 p-2 border border-slate-200 rounded bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="S">S 级 (战略)</option>
              <option value="A">A 级 (核心)</option>
              <option value="B">B 级 (潜力)</option>
              <option value="C">C 级 (普通)</option>
            </select>
          ) : (
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg text-2xl font-black shadow-sm ${
              client.tier === 'S' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
              client.tier === 'A' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
              'bg-slate-50 text-slate-500 border border-slate-100'
            }`}>
              {client.tier}
            </div>
          )}
        </div>

        {/* 预算拆分展示 */}
        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: '推广预算', key: 'promotionBudget', color: 'text-blue-600' },
            { label: '预装预算', key: 'preinstallBudget', color: 'text-emerald-600' },
            { label: 'Push预算', key: 'pushBudget', color: 'text-purple-600' },
            { label: '联运预算', key: 'jointBudget', color: 'text-orange-600' },
          ].map((budget) => {
             const key = budget.key as keyof typeof editFinancials;
             const val = isEditing ? editFinancials[key] : client.financials[key];

             return (
               <div key={budget.key} className="relative group">
                 <div className="text-[10px] text-slate-400 mb-2 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Coins size={12}/> {budget.label}
                 </div>
                 {isEditing ? (
                   <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">¥</span>
                     <input 
                       type="number"
                       value={val}
                       onChange={(e) => updateBudget(key, e.target.value)}
                       className="w-full pl-6 pr-2 py-2 text-sm font-bold border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500"
                     />
                   </div>
                 ) : (
                   <div className={`text-lg font-black ${budget.color} tracking-tight`}>
                     {formatBudget(val as number)}
                   </div>
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
};
