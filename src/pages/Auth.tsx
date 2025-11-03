import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { RainAnimation } from '@/components/RainAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Droplets } from 'lucide-react';

type UserRole = 'citizen' | 'admin';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check user role
        const roleResult: any = await (supabase as any)
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        const roleData = roleResult.data;

        if (roleData && roleData.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/citizen-dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        // Add the selected role
        if (data.user && selectedRole === 'admin') {
          await (supabase as any).from('user_roles').insert([{
            user_id: data.user.id,
            role: 'admin',
          }]);
        }

        toast({
          title: 'Success!',
          description: 'Account created successfully. Please login.',
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <RainAnimation />
      
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg"
          >
            <Droplets className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gradient mb-2">{t('auth.title')}</h1>
          <p className="text-muted-foreground">{t('auth.subtitle')}</p>
        </div>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? t('auth.login') : t('auth.signup')}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? t('auth.subtitle') : t('auth.selectRole')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole('citizen')}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'citizen'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <User className="w-8 h-8 mb-2 mx-auto text-primary" />
                  <h3 className="font-semibold text-center mb-1">{t('auth.citizen')}</h3>
                  <p className="text-xs text-muted-foreground text-center">{t('auth.citizenDesc')}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole('admin')}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'admin'
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <Shield className="w-8 h-8 mb-2 mx-auto text-secondary" />
                  <h3 className="font-semibold text-center mb-1">{t('auth.admin')}</h3>
                  <p className="text-xs text-muted-foreground text-center">{t('auth.adminDesc')}</p>
                </motion.div>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="glass-card"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="glass-card"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Loading...' : isLogin ? t('auth.login') : t('auth.signup')}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
              </span>{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? t('auth.signupHere') : t('auth.loginHere')}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}