import React, { useState } from 'react';
import { Search, Users, ChevronRight } from 'lucide-react';
import { MOCK_CLIENTS } from '../constants';
import { ClientStage } from '../types';

interface ClientSearchProps {
  onSelectClient: (clientId: string) => void;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({ onSelectClient }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Filter clients based on search query
  const searchResults = searchQuery.trim() 
    ? MOCK_CLIENTS.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.corporateEntity.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
          <Users size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">客户知识库</h2>
        <p className="text-slate-500 text-lg">输入客户名称或企业实体，快速检索客户全景信息</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8 shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={24} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="例如: 度小满金融 或 度小满科技"
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
              {searchResults.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                      {client.logo ? (
                        <img src={client.logo} alt={client.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Users size={24} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {client.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${client.stage === ClientStage.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {client.stage === ClientStage.ACTIVE ? '活跃' : '常规'}
                        </span>
                        <span>{client.industry}</span>
                        <span>{client.corporateEntity}</span>
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
              未找到相关客户，请尝试其他关键词
            </div>
          )}
        </div>
      )}
    </div>
  );
};
