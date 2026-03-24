
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { AppCKBProfile } from '../types';

// 导入拆分后的原子组件
import { AppHeroCard } from './app/AppHeroCard';
import { AppKeyDynamicsCard } from './app/AppKeyDynamicsCard';
import { AppIntelligenceCard } from './app/AppIntelligenceCard';
import { AppDomainFunnelCard } from './app/AppDomainFunnelCard';
import { PlatformMatrixCard } from './app/PlatformMatrixCard';
import { AppUpdateDynamicsCard } from './app/AppUpdateDynamicsCard';
import { HarmonyOSMonitorCard } from './app/HarmonyOSMonitorCard';

interface AppCKBProps {
  app: AppCKBProfile;
  onBack: () => void;
}

const MOCK_DYNAMICS = [
  { 
    type: 'UPDATE',
    title: 'V6.9 版本发布',
    date: "2024-03-25", 
    source: "36氪", 
    content: "宣布 V6.9 版本深度集成金融大模型，升级智能反欺诈引擎，提升用户资金安全保障能力。",
    url: "#"
  },
  { 
    type: 'STRATEGY',
    title: '荣获金融科技创新奖',
    date: "2024-03-22", 
    source: "百度新闻", 
    content: "累计服务小微企业超 2000 万，凭借在普惠金融领域的突出贡献，荣获年度金融科技创新奖。",
    url: "#"
  }
];

export const AppKnowledgeBase: React.FC<AppCKBProps> = ({ app: initialApp, onBack }) => {
  const [app, setApp] = useState<AppCKBProfile>(initialApp);

  useEffect(() => {
    setApp(initialApp);
  }, [initialApp]);

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
          <ChevronRight className="rotate-180" size={14}/> 返回客户知识库
        </button>
      </div>

      <div className="space-y-6">
        {/* App 英雄卡片 - 基础信息 (支持编辑) */}
        <AppHeroCard app={app} onAppUpdate={setApp} />

        {/* 关键动态 */}
        <AppKeyDynamicsCard />

        {/* 华为设备近30天分发表现 */}
        <AppDomainFunnelCard />

        {/* 全设备厂商分发表现 */}
        <PlatformMatrixCard data={app.platformPerformance} />

        {/* App 更新动态 */}
        <AppUpdateDynamicsCard data={app.updateDynamics} />

        {/* HarmonyOS SDK 接入监控 */}
        <HarmonyOSMonitorCard kits={app.harmonyOSKits} />

        {/* 实时动态 */}
        <AppIntelligenceCard dynamics={MOCK_DYNAMICS} />
      </div>
      
      <div className="p-10 text-center text-slate-300 font-black uppercase text-[10px] tracking-widest">
        数据实时同步中 · 更多模块加载完毕
      </div>
    </div>
  );
};
