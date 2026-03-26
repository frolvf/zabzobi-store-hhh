import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gamepad2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate("/");
    } else {
      if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères"); setLoading(false); return; }
      const { error } = await signUp(email, password, displayName);
      if (error) setError(error.message);
      else setSuccess("Compte créé ! Vérifiez votre email pour confirmer.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Gamepad2 className="w-10 h-10 text-primary" />
              <span className="font-display text-2xl font-bold text-primary text-glow-cyan">
                ZUOSS<span className="text-secondary"> SHOP</span>
              </span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isLogin ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? "Accédez à votre compte" : "Rejoignez Zuoss Shop"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nom</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={!isLogin}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isLogin && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              )}

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-neon-green bg-neon-green/10 p-3 rounded-lg">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_hsl(190,95%,50%,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer le compte"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} className="text-primary hover:underline ml-1">
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Auth;
