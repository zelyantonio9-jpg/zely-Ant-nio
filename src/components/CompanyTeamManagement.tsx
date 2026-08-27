import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Mail, 
  Phone, 
  Info,
  Check,
  Building2
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { CompanyTeamMember, CompanyTeamRole } from '../types';

interface CompanyTeamManagementProps {
  onClose?: () => void;
}

export const CompanyTeamManagement: React.FC<CompanyTeamManagementProps> = ({ onClose }) => {
  const { currentUser, addTeamMember, removeTeamMember } = useMarket();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [memberName, setMemberName] = useState<string>('');
  const [memberEmail, setMemberEmail] = useState<string>('');
  const [memberPhone, setMemberPhone] = useState<string>('+244 9');
  const [memberRole, setMemberRole] = useState<CompanyTeamRole>('COMPRADOR');
  const [modalError, setModalError] = useState<string>('');

  const team = currentUser.companyTeamMembers || [];

  const getRoleBadge = (role: CompanyTeamRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-300 rounded-md font-bold text-[10px]">Administrador Geral</span>;
      case 'COMPRADOR':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 rounded-md font-bold text-[10px]">Comprador / Compras</span>;
      case 'FINANCEIRO':
        return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-md font-bold text-[10px]">Financeiro & Pagamentos</span>;
      case 'OPERADOR':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md font-bold text-[10px]">Operador Logístico</span>;
    }
  };

  const getRolePermissions = (role: CompanyTeamRole): string[] => {
    switch (role) {
      case 'ADMIN':
        return ['Acesso Total', 'Gestão de Utilizadores', 'Aprovação de Contratos', 'Custódia AO Protect', 'Controlo Financeiro'];
      case 'COMPRADOR':
        return ['Criar Pedidos & RFQ B2B', 'Negociar Cotações', 'Consultar Catálogo', 'Receção de Mercadorias'];
      case 'FINANCEIRO':
        return ['Autorizar Pagamentos', 'Extratos e Faturas', 'Gestão de IBAN', 'Libertação de Custódia'];
      case 'OPERADOR':
        return ['Rastreio de Cargas', 'Validação de PIN de Entrega', 'Gestão de Inventário', 'Conferência'];
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!memberName.trim()) {
      setModalError('Por favor informe o nome completo do membro.');
      return;
    }
    if (!memberEmail.includes('@')) {
      setModalError('Por favor informe um email corporativo válido.');
      return;
    }

    addTeamMember(currentUser.id, {
      name: memberName,
      email: memberEmail,
      phone: memberPhone,
      role: memberRole,
      status: 'ATIVO',
      permissions: getRolePermissions(memberRole)
    });

    setMemberName('');
    setMemberEmail('');
    setMemberPhone('+244 9');
    setMemberRole('COMPRADOR');
    setShowAddModal(false);
  };

  return (
    <div id="company-team-management" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-slate-900">
      
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span>Gestão de Equipa & Utilizadores da Empresa</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 font-mono">
                RBAC Corporativo
              </span>
            </div>
            <p className="text-purple-200/70 text-[11px]">
              Empresa: <strong className="text-white">{currentUser.companyName || currentUser.name}</strong> • Controlo granular de acessos
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs border border-amber-400"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Adicionar Membro</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="p-3 bg-purple-50 border-b border-purple-200 flex items-start space-x-2 text-xs text-purple-900">
        <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <strong>Controlo de Perfis Internos (RBAC):</strong> Cada membro da sua empresa opera com permissões estritas. O perfil <em>Financeiro</em> autoriza faturas e custódias, enquanto o <em>Operador</em> realiza a confirmação de entregas e mercadorias.
        </div>
      </div>

      {/* Team Members List */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Membros Registados ({team.length})
          </div>
          <span className="text-[11px] text-slate-500">Contas com acesso corporativo vinculado</span>
        </div>

        {team.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="font-bold text-slate-700 text-xs">Nenhum membro adicional registado</div>
            <p className="text-slate-500 text-[11px] max-w-sm mx-auto">
              Adicione administradores, compradores, responsáveis financeiros ou operadores de logística para colaborar na conta da empresa.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Adicionar Primeiro Membro
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {team.map(member => (
              <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-900 font-extrabold flex items-center justify-center text-xs font-mono shrink-0">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{member.name}</span>
                      {getRoleBadge(member.role)}
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                        {member.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-2">
                      <span>Email: <strong className="text-slate-700">{member.email}</strong></span>
                      <span>• Tel: <strong className="text-slate-700 font-mono">{member.phone}</strong></span>
                      <span>• Criado a {member.createdAt}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {member.permissions.map((p, i) => (
                        <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => removeTeamMember(currentUser.id, member.id)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 cursor-pointer text-xs flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-purple-700" />
                <span>Adicionar Membro à Equipa</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={e => setMemberName(e.target.value)}
                  placeholder="Ex: João Baptista"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Corporativo *</label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={e => setMemberEmail(e.target.value)}
                    placeholder="nome@empresa.ao"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telemóvel (+244)</label>
                  <input
                    type="tel"
                    value={memberPhone}
                    onChange={e => setMemberPhone(e.target.value)}
                    placeholder="+244 9..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Função / Perfil RBAC *</label>
                <select
                  value={memberRole}
                  onChange={e => setMemberRole(e.target.value as CompanyTeamRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold outline-none text-slate-900"
                >
                  <option value="COMPRADOR">Comprador (Criação de RFQs e Gestão de Compras)</option>
                  <option value="FINANCEIRO">Financeiro (Autorização de Pagamentos e Custódia)</option>
                  <option value="OPERADOR">Operador (Logística, Receção e PIN OTP)</option>
                  <option value="ADMIN">Administrador (Controlo Total da Conta da Empresa)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-[11px] text-purple-900 space-y-1">
                <div className="font-bold">Permissões atribuídas automaticamente:</div>
                <div className="flex flex-wrap gap-1">
                  {getRolePermissions(memberRole).map((p, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-white rounded border border-purple-200 font-mono text-[9px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Guardar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
