import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

interface DeveloperAccount {
  id: string;
  name: string;
}

interface ClientItem {
  id: string;
  name: string;
  createTime: string;
  creator: string;
  developerAccounts: DeveloperAccount[];
}

const MOCK_CLIENT_LIST: ClientItem[] = [
  {
    id: '1',
    name: '度小满金融',
    createTime: '2024-01-15 10:30:00',
    creator: '王小明',
    developerAccounts: [{ id: 'dev-001', name: '度小满科技(北京)有限公司' }]
  },
  {
    id: '2',
    name: '字节跳动',
    createTime: '2024-02-20 14:15:00',
    creator: '李华',
    developerAccounts: [{ id: 'dev-002', name: '北京字节跳动科技有限公司' }]
  }
];

export const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<ClientItem[]>(MOCK_CLIENT_LIST);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientItem | null>(null);

  // Form state
  const [clientName, setClientName] = useState('');
  const [developerAccounts, setDeveloperAccounts] = useState<DeveloperAccount[]>([]);
  const [isSearchingDev, setIsSearchingDev] = useState(false);
  const [devSearchQuery, setDevSearchQuery] = useState('');

  const handleOpenModal = (client?: ClientItem) => {
    if (client) {
      setEditingClient(client);
      setClientName(client.name);
      setDeveloperAccounts([...client.developerAccounts]);
    } else {
      setEditingClient(null);
      setClientName('');
      setDeveloperAccounts([]);
    }
    setIsModalOpen(true);
    setIsSearchingDev(false);
    setDevSearchQuery('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDeleteModal = (client: ClientItem) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      handleCloseDeleteModal();
    }
  };

  const handleSave = () => {
    if (!clientName.trim()) return;

    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? {
        ...c,
        name: clientName,
        developerAccounts
      } : c));
    } else {
      const newClient: ClientItem = {
        id: Date.now().toString(),
        name: clientName,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        creator: '当前用户', // Mock current user
        developerAccounts
      };
      setClients([newClient, ...clients]);
    }
    handleCloseModal();
  };

  const handleAddDeveloper = () => {
    if (!devSearchQuery.trim()) return;
    // Mock adding a developer account based on search query
    const newDev: DeveloperAccount = {
      id: `dev-${Date.now()}`,
      name: devSearchQuery
    };
    setDeveloperAccounts([...developerAccounts, newDev]);
    setIsSearchingDev(false);
    setDevSearchQuery('');
  };

  const handleRemoveDeveloper = (id: string) => {
    setDeveloperAccounts(developerAccounts.filter(d => d.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">客户管理</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          添加客户
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="pb-3 font-medium">客户名称</th>
              <th className="pb-3 font-medium">创建时间</th>
              <th className="pb-3 font-medium">创建人</th>
              <th className="pb-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 text-slate-900 font-medium">{client.name}</td>
                <td className="py-4 text-slate-500 text-sm">{client.createTime}</td>
                <td className="py-4 text-slate-500 text-sm">{client.creator}</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenModal(client)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="编辑"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleOpenDeleteModal(client)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  暂无客户数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {editingClient ? '编辑客户' : '新增客户'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* 客户名称 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  客户名称 <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="请输入客户名称"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 开发者账号 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    开发者账号
                  </label>
                  {!isSearchingDev && (
                    <button 
                      onClick={() => setIsSearchingDev(true)}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
                    >
                      <Plus size={14} /> 添加
                    </button>
                  )}
                </div>

                {isSearchingDev && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={devSearchQuery}
                        onChange={(e) => setDevSearchQuery(e.target.value)}
                        placeholder="输入开发者ID或名称搜索"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        autoFocus
                      />
                    </div>
                    <button 
                      onClick={handleAddDeveloper}
                      disabled={!devSearchQuery.trim()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      确定
                    </button>
                    <button 
                      onClick={() => {
                        setIsSearchingDev(false);
                        setDevSearchQuery('');
                      }}
                      className="text-slate-400 hover:text-slate-600 p-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {developerAccounts.map(dev => (
                    <div key={dev.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-xs font-bold">
                          D
                        </div>
                        <span className="text-sm text-slate-700">{dev.name}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveDeveloper(dev.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {developerAccounts.length === 0 && !isSearchingDev && (
                    <div className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                      暂无开发者账号
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                disabled={!clientName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && clientToDelete && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">确认删除</h3>
              <button onClick={handleCloseDeleteModal} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm">
                您确定要删除客户 <span className="font-bold text-slate-900">{clientToDelete.name}</span> 吗？此操作不可恢复。
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
              <button 
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg text-sm font-medium transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
