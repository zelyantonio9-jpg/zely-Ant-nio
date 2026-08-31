import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Layers, 
  BarChart3, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { PRODUCT_BACKLOG_DATA, BacklogItem } from '../data/productBacklogData';
import { downloadBacklogAsExcel, downloadBacklogAsCSV } from '../utils/backlogExport';

interface ProductBacklogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductBacklogModal: React.FC<ProductBacklogModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Concluído' | 'Não Concluído'>('ALL');
  const [filterEpic, setFilterEpic] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const completedList = PRODUCT_BACKLOG_DATA.filter(i => i.status === 'Concluído');
  const pendingList = PRODUCT_BACKLOG_DATA.filter(i => i.status === 'Não Concluído');
  const totalCount = PRODUCT_BACKLOG_DATA.length;
  const completionPercentage = Math.round((completedList.length / totalCount) * 100);

  const completedPoints = completedList.reduce((acc, i) => acc + i.storyPoints, 0);
  const totalPoints = PRODUCT_BACKLOG_DATA.reduce((acc, i) => acc + i.storyPoints, 0);

  const epics = Array.from(new Set(PRODUCT_BACKLOG_DATA.map(i => i.epic)));

  const filteredItems = PRODUCT_BACKLOG_DATA.filter(item => {
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchEpic = filterEpic === 'ALL' || item.epic === filterEpic;
    const matchSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.epic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchEpic && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">Product Backlog Oficial</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  {completionPercentage}% Concluído
                </span>
              </div>
              <p className="text-xs text-slate-400">Rastreamento de requisitos e estado de entrega do ecossistema AO MARKET</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Direct Download Action */}
            <button
              onClick={downloadBacklogAsExcel}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              title="Descarregar ficheiro .xlsx nativo para Microsoft Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Baixar Excel (.xlsx)</span>
            </button>

            <button
              onClick={downloadBacklogAsCSV}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
              title="Descarregar em formato CSV (UTF-8 com separador ;)"
            >
              <FileText className="w-4 h-4" />
              <span>Baixar CSV</span>
            </button>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Total de Histórias</div>
            <div className="text-2xl font-black text-slate-900">{totalCount}</div>
            <div className="text-[10px] text-slate-400">{totalPoints} Story Points</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs">
            <div className="text-xs text-emerald-700 font-medium">Itens Concluídos</div>
            <div className="text-2xl font-black text-emerald-600">{completedList.length}</div>
            <div className="text-[10px] text-emerald-700">{completedPoints} Story Points</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-xs">
            <div className="text-xs text-amber-700 font-medium">Itens Não Concluídos</div>
            <div className="text-2xl font-black text-amber-600">{pendingList.length}</div>
            <div className="text-[10px] text-amber-700">{totalPoints - completedPoints} Story Points</div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Progresso de Entrega</div>
            <div className="text-2xl font-black text-indigo-600">{completionPercentage}%</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({totalCount})
              </button>
              <button
                onClick={() => setFilterStatus('Concluído')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                  filterStatus === 'Concluído' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Concluídos ({completedList.length})
              </button>
              <button
                onClick={() => setFilterStatus('Não Concluído')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                  filterStatus === 'Não Concluído' ? 'bg-amber-500 text-black shadow-xs' : 'text-amber-700 hover:text-amber-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Não Concluídos ({pendingList.length})
              </button>
            </div>

            <select
              value={filterEpic}
              onChange={(e) => setFilterEpic(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium outline-none focus:border-amber-500"
            >
              <option value="ALL">Todos os Épicos</option>
              {epics.map(epic => (
                <option key={epic} value={epic}>{epic}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Pesquisar por ID, título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Backlog Items Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-200 font-semibold border-b border-slate-800">
                  <th className="p-3 w-16">ID</th>
                  <th className="p-3 w-40">Épico</th>
                  <th className="p-3">Item do Backlog</th>
                  <th className="p-3 w-24 text-center">Prioridade</th>
                  <th className="p-3 w-32 text-center">Estado</th>
                  <th className="p-3 w-20 text-center">SP</th>
                  <th className="p-3">Notas de Implementação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.map(item => {
                  const isDone = item.status === 'Concluído';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-slate-700">{item.id}</td>
                      <td className="p-3 font-medium text-slate-600">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200 text-[11px]">
                          {item.epic}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{item.description}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.priority === 'Crítica' ? 'bg-red-100 text-red-700 border border-red-200' :
                          item.priority === 'Alta' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700">{item.storyPoints}</td>
                      <td className="p-3 text-slate-600 text-[11px]">{item.technicalNotes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>Formato Excel compatível com MS Excel, Google Sheets, LibreOffice Calc e Apple Numbers.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadBacklogAsCSV}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar CSV</span>
            </button>
            <button
              onClick={downloadBacklogAsExcel}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Baixar Ficheiro Excel (.xlsx)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
