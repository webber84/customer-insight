import React, { useState } from 'react';
import { Search, Rocket, ChevronRight } from 'lucide-react';

interface AppSearchProps {
  onSelectApp: (appId: string) => void;
}

export const AppSearch: React.FC<AppSearchProps> = ({ onSelectApp }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock search results
  const searchResults = searchQuery.trim() ? [
    {
      id: 'app-001',
      name: '度小满金融',
      appId: 'com.duxiaoman.wallet',
      category: '金融理财',
      developer: '度小满科技(北京)有限公司'
    }
  ] : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-6">
          <Rocket size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">App 知识库</h2>
        <p className="text-slate-500 text-lg">输入 AppId 或应用名称，快速检索应用全景信息</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={24} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="例如: com.duxiaoman.wallet 或 度小满金融"
          className="block w-full pl-12 pr-32 py-4 text-lg border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={!searchQuery.trim() || isSearching}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            {isSearching ? '搜索中...' : '搜索'}
          </button>
        </div>
      </form>

      {searchQuery.trim() && !isSearching && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-700">搜索结果 ({searchResults.length})</h3>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {searchResults.map((app) => (
                <button
                  key={app.id}
                  onClick={() => onSelectApp(app.id)}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <Rocket size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {app.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{app.appId}</span>
                        <span>{app.category}</span>
                        <span>{app.developer}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">
              未找到相关应用，请尝试其他关键词
            </div>
          )}
        </div>
      )}
    </div>
  );
};
