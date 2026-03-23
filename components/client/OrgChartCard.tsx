
import React, { useMemo } from 'react';
import { UserCheck, UserPlus, Move, Users as UsersIcon, Info } from 'lucide-react';
import { DecisionMaker } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface OrgChartCardProps {
  localTeam: DecisionMaker[];
  onAddClick: () => void;
  onMakerClick: (maker: DecisionMaker) => void;
  onDrop: (sourceId: string, targetId: string) => void;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
}

export const OrgChartCard: React.FC<OrgChartCardProps> = ({
  localTeam, onAddClick, onMakerClick, onDrop, draggingId, setDraggingId
}) => {
  const teamTree = useMemo(() => {
    const roots = localTeam.filter(m => !m.reportsTo);
    const buildTree = (parent: DecisionMaker): any => ({
      ...parent,
      children: localTeam.filter(m => m.reportsTo === parent.id).map(buildTree)
    });
    return roots.map(buildTree);
  }, [localTeam]);

  const MakerNode: React.FC<{ maker: any }> = ({ maker }) => {
    const hasChildren = maker.children && maker.children.length > 0;
    const roleColors = {
      DECISION: 'border-slate-950 bg-white ring-4 ring-slate-950/5 shadow-xl scale-105',
      INFLUENCER: 'border-blue-600 bg-white ring-4 ring-blue-600/5',
      EXECUTION: 'border-slate-300 bg-slate-50 ring-0'
    };

    const isBeingDragged = draggingId === maker.id;

    return (
      <div className="flex flex-col items-center relative">
        <div 
          draggable
          onDragStart={(e) => {
            setDraggingId(maker.id);
            e.dataTransfer.setData('text/plain', maker.id);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const sourceId = e.dataTransfer.getData('text/plain');
            onDrop(sourceId, maker.id);
          }}
          onClick={() => onMakerClick(maker)}
          className={`relative z-10 w-52 p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 group/card 
            ${roleColors[maker.role as keyof typeof roleColors]} 
            ${isBeingDragged ? 'opacity-30 border-dashed border-blue-400' : ''}
            ${draggingId && !isBeingDragged ? 'hover:border-blue-500 hover:bg-blue-50/30' : ''}
          `}
        >
          {/* Drag Handle - Top Left */}
          <div className="absolute top-1.5 left-1.5 opacity-0 group-hover/card:opacity-100 text-slate-300 hover:text-slate-500 transition-colors" title="长按拖拽调整架构">
            <Move size={12}/>
          </div>

          {/* Details Hint - Top Right - Always Visible */}
          <div className="absolute top-2 right-2 text-slate-300 hover:text-blue-600 transition-colors z-20" title="点击查看详情">
            <Info size={16}/>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <ImageWithFallback 
               src={maker.avatar} 
               alt={maker.name} 
               fallbackText={maker.name}
               className="w-10 h-10 rounded-full shrink-0 border border-slate-100 shadow-inner"
            />
            <div className="overflow-hidden text-left">
              <span className="text-xs font-black text-slate-900 truncate block">{maker.name}</span>
              <span className="text-[8px] font-bold text-slate-500 truncate block leading-tight">{maker.title}</span>
            </div>
          </div>
        </div>
        {hasChildren && (
          <div className="flex gap-12 mt-12 relative items-start">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-200"></div>
            {maker.children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-200 h-0.5" 
                style={{ width: `calc(100% - ${208 / maker.children.length}px)` }}>
              </div>
            )}
            {maker.children.map((child: any) => <MakerNode key={child.id} maker={child} />)}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white rounded border border-slate-200 p-8 shadow-sm overflow-hidden text-center">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-slate-900 bg-slate-100 p-1.5 rounded"><UserCheck size={16}/></div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">关键角色</h3>
        </div>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
        >
          <UserPlus size={14}/> 添加决策人
        </button>
      </div>
      <div className="mb-4 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-blue-50/50 p-2 rounded border border-blue-100 inline-flex">
        <Move size={14} className="text-blue-500"/>
        <span>小贴士：通过【拖拽】人名卡片到另一人身上，即可建立汇报关系。</span>
      </div>
      <div className="py-12 flex justify-center overflow-x-auto min-h-[500px] bg-slate-50/20 rounded-lg">
        <div className="inline-flex gap-20 p-4">
          {teamTree.length > 0 ? (
            teamTree.map((root: any) => <MakerNode key={root.id} maker={root} />)
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 py-20">
              <UsersIcon size={48} className="mb-4 opacity-20"/>
              <p className="font-black uppercase tracking-widest text-xs">暂无组织架构信息</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
