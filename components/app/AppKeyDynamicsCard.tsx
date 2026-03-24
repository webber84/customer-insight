import React from 'react';
import { Sparkles, Activity } from 'lucide-react';

export const AppKeyDynamicsCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <Sparkles size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 text-white p-1.5 rounded shadow-sm">
            <Activity size={16} />
          </div>
          <h3 className="text-base font-black text-blue-900 uppercase tracking-widest">关键动态</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm font-bold text-slate-700">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>核心分发阵地转移：近30天华为设备上，官方市场（AppGallery）安装量份额达45.2%，稳居第一，远超抖音（18.5%）和快手（12.1%）。</span>
          </li>
          <li className="flex items-start gap-2 text-sm font-bold text-slate-700">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>渠道质量差异显著：官方市场次日留存率高达65%，而第三方信息流渠道普遍存在秒卸率高、留存率低的问题（如抖音次日卸载率达65%）。</span>
          </li>
          <li className="flex items-start gap-2 text-sm font-bold text-slate-700">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>全设备厂商表现优异：在各终端厂商中，华为渠道的新增设备数和活跃设备数均保持领先，且卸载率处于行业较低水平。</span>
          </li>
          <li className="flex items-start gap-2 text-sm font-bold text-slate-700">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>产品迭代与生态接入：近期发布 V6.9 版本深度集成金融大模型，同时积极接入 HarmonyOS SDK，各项接口调用量稳步上升。</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
