
import React, { useState } from 'react';
import { Smartphone, CheckCircle2, XCircle, Edit3, Check, X } from 'lucide-react';
import { AppCKBProfile } from '../../types';

interface AppHeroCardProps {
  app: AppCKBProfile;
  onAppUpdate: (updatedApp: AppCKBProfile) => void;
}

export const AppHeroCard: React.FC<AppHeroCardProps> = ({ app, onAppUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCooperation, setEditCooperation] = useState(app.cooperation);

  const handleSave = () => {
    onAppUpdate({
      ...app,
      cooperation: editCooperation
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCooperation(app.cooperation);
    setIsEditing(false);
  };

  const toggleCooperation = (key: keyof typeof editCooperation) => {
    setEditCooperation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cooperationConfig = [
    { label: '应用推广', key: 'promotion' },
    { label: '预装', key: 'preinstall' },
    { label: '商业化Push', key: 'push' },
    { label: '联运', key: 'joint' }
  ] as const;

  return (
    <section className="bg-white rounded border border-slate-200 p-10 mb-6 shadow-sm relative">
      <div className="absolute top-6 right-6 z-10">
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all"
          >
            <Edit3 size={12}/> 编辑
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

      <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start text-center lg:text-left">
        <div className="w-24 h-24 rounded bg-slate-950 flex items-center justify-center text-white shrink-0 shadow-lg">
          <Smartphone size={40} />
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">{app.name}</h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">首次上架时间:</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{app.firstReleaseDate}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">类型:</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{app.categories.primary} / {app.categories.secondary}</span>
              </div>
              
              <div className="hidden lg:block w-px h-6 bg-slate-200 mx-2"></div>

              <div className="flex items-center gap-3">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">合作业务:</span>
                 <div className="flex flex-wrap gap-2">
                  {cooperationConfig.map((item) => {
                    const isActive = isEditing ? editCooperation[item.key] : app.cooperation[item.key];
                    
                    if (isEditing) {
                        return (
                            <button
                            key={item.key}
                            onClick={() => toggleCooperation(item.key)}
                            className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                                isActive 
                                ? 'bg-blue-600 text-white border-blue-600' 
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
                            }`}
                            >
                            {item.label}
                            </button>
                        )
                    }

                    return (
                      <div key={item.key} className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${isActive ? 'bg-slate-900 text-white border-slate-950' : 'bg-slate-50 text-slate-300 border-slate-100 grayscale opacity-60'}`}>
                        {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
