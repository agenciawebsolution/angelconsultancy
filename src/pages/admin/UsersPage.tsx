import React, { useEffect, useState, useCallback } from 'react';
import { usersService } from '../../services/usersService';
import type { AdminUser } from '../../types/cms';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2, Loader2, X, Check } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    password: '',
    confirmPassword: '',
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const list = await usersService.getUsers();
      setUsers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      await loadUsers();
      if (ignore) return;
    })();
    return () => {
      ignore = true;
    };
  }, [loadUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      status: 'active',
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      status: u.status,
      password: '',
      confirmPassword: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (!editingUser && form.password.length < 8) {
      alert('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (form.password && form.password !== form.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        await usersService.updateUser(editingUser.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          status: form.status,
          password: form.password ? form.password : undefined,
        });
        setFeedback('Administrador atualizado com sucesso!');
      } else {
        await usersService.createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        setFeedback('Novo administrador cadastrado com sucesso!');
      }
      setIsModalOpen(false);
      await loadUsers();
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao salvar usuário');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentAdmin?.id) {
      alert('Você não pode excluir sua própria conta.');
      return;
    }
    if (!window.confirm('Tem certeza de que deseja remover este administrador?')) return;
    try {
      await usersService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setFeedback('Administrador excluído.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir usuário');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Usuários Administradores
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Controle quem possui acesso administrativo e permissões no painel.
          </p>
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Novo Administrador
        </Button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Nenhum administrador listado.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Nome</th>
                <th className="py-3.5 px-4">E-mail</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Último Acesso</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-navy-50 text-brand-navy font-bold text-xs flex items-center justify-center">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {u.name} {u.id === currentAdmin?.id && <span className="text-[10px] text-brand-navy font-semibold">(Você)</span>}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">{u.email}</td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString('pt-BR') : 'Nunca acessou'}
                  </td>

                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-navy hover:bg-slate-100"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {u.id !== currentAdmin?.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Create / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-soft-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Editar Administrador' : 'Novo Administrador'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {editingUser && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status da Conta</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo (Bloqueado)</option>
                  </select>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-slate-700 font-semibold mb-1">
                  {editingUser ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha de Acesso *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              {form.password && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Confirmar Senha</label>
                  <input
                    type="password"
                    required
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
