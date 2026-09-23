import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const AdminLoginPage: React.FC = () => {
  const { login, setupInitialAdmin, setupRequired, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSetupMode = Boolean(setupRequired);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redireciona se já autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSetupMode) {
        if (!name.trim()) throw new Error('Por favor, informe seu nome.');
        if (!email.trim()) throw new Error('Por favor, informe seu e-mail.');
        if (password.length < 8) throw new Error('A senha deve conter no mínimo 8 caracteres.');
        if (password !== confirmPassword) throw new Error('As senhas digitadas não coincidem.');

        await setupInitialAdmin(name.trim(), email.trim(), password);
        navigate('/admin/dashboard', { replace: true });
      } else {
        if (!email.trim() || !password) throw new Error('Preencha seu e-mail e sua senha.');

        await login(email.trim(), password);
        const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-brand-amber selection:text-slate-900">
      {/* Subtle background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-navy-600/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        <a href="/" className="inline-block p-1 bg-white rounded-2xl shadow-soft-md">
          <img src="/logo.png" alt="Angel Consultancy" className="h-12 w-auto object-contain" />
        </a>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {isSetupMode ? 'Configurar Administrador' : 'Acesso ao Painel'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isSetupMode
              ? 'Nenhum administrador encontrado. Crie a conta principal.'
              : 'Entre com suas credenciais seguras para gerenciar o site.'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-soft-xl rounded-3xl border border-slate-100 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Atenção</p>
                <p className="mt-0.5 text-rose-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {isSetupMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Administrativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@angel-consultancy.be"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {isSetupMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center py-3"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {isSubmitting
                  ? 'Processando...'
                  : isSetupMode
                  ? 'Criar Conta e Entrar'
                  : 'Acessar Painel'}
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sessão criptografada
            </span>
            <a href="/" className="hover:text-slate-900 font-semibold transition-colors">
              Voltar ao site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
