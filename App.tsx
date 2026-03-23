
import React, { useState } from 'react';
import { Users, Menu, X, Search, ChevronDown, Rocket, Briefcase } from 'lucide-react';
import { MOCK_CLIENTS, MOCK_APP_CKB } from './constants';
import { ClientDetail } from './components/ClientDetail';
import { ClientSearch } from './components/ClientSearch';
import { AppKnowledgeBase } from './components/AppKnowledgeBase';
import { AppSearch } from './components/AppSearch';
import { ClientManagement } from './components/ClientManagement';
import { ClientStage } from './types';

type ViewType = 'client-search' | 'analysis' | 'app-search' | 'app-ckb' | 'client-management';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('client-search');
  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedClient = MOCK_CLIENTS.find(c => c.id === selectedClientId) || MOCK_CLIENTS[0];

  const handleNavigateToApp = (appId: string) => {
    setCurrentView('app-ckb');
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setCurrentView('analysis');
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* 侧边栏 */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-950 text-white transition-all duration-200 flex-shrink-0 flex flex-col border-r border-slate-800`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className={`font-bold text-lg flex items-center gap-2 ${!sidebarOpen && 'hidden'}`}>
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-sm">CI</div>
             <span className="tracking-tight uppercase text-sm font-black">客户洞察 360</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
           <div className={`px-6 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest ${!sidebarOpen && 'hidden'}`}>核心功能</div>
           <nav className="space-y-1 px-3">
             <button 
                onClick={() => setCurrentView('client-search')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${currentView === 'client-search' || currentView === 'analysis' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
                <Users size={18} />
                {sidebarOpen && <span className="text-sm font-bold">客户知识库</span>}
             </button>
             <button 
                onClick={() => setCurrentView('app-search')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${currentView === 'app-search' || currentView === 'app-ckb' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
                <Rocket size={18} />
                {sidebarOpen && <span className="text-sm font-bold">App 知识库</span>}
             </button>
             <button 
                onClick={() => setCurrentView('client-management')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${currentView === 'client-management' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
                <Briefcase size={18} />
                {sidebarOpen && <span className="text-sm font-bold">客户管理</span>}
             </button>
           </nav>
        </div>

        <div className="p-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold">管理</div>
                {sidebarOpen && (
                    <div>
                        <div className="text-xs font-bold text-white">王小明</div>
                        <div className="text-[10px] text-slate-500 uppercase font-black">运营专家</div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
           <div className="flex items-center gap-4">
               <h2 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                   {currentView === 'client-search' && '客户知识库'}
                   {currentView === 'analysis' && '客户全景视图'}
                   {currentView === 'app-search' && 'App 知识库'}
                   {currentView === 'app-ckb' && 'App 全景作战视图'}
                   {currentView === 'client-management' && '客户管理'}
               </h2>
           </div>
           
           <div className="flex items-center gap-4">
              {/* 移除了实时数据流内容 */}
           </div>
        </header>

        <main className="p-10 flex-1 bg-slate-50 overflow-x-hidden">
            {currentView === 'client-search' && <ClientSearch onSelectClient={handleSelectClient} />}
            {currentView === 'analysis' && <ClientDetail client={selectedClient} onNavigateToApp={handleNavigateToApp} onBack={() => setCurrentView('client-search')} />}
            {currentView === 'app-search' && <AppSearch onSelectApp={handleNavigateToApp} />}
            {currentView === 'app-ckb' && <AppKnowledgeBase app={MOCK_APP_CKB} onBack={() => setCurrentView('app-search')} />}
            {currentView === 'client-management' && <ClientManagement />}
        </main>
      </div>
    </div>
  );
};

export default App;
