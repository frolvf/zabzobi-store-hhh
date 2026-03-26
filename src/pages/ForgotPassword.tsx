import { useState } from "react";
import { Link } from "react-router-dom";
import { Gamepad2, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Email envoyé</h1>
            <p className="text-muted-foreground mb-6">
              Si un compte existe avec l'adresse <strong className="text-foreground">{email}</strong>, vous recevrez un lien de réinitialisation.
            </p>
            <Link to="/auth" className="text-primary hover:underline text-sm font-medium">
              Retour à la connexion
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Gamepad2 className="w-10 h-10 text-primary mx-auto mb-2" />
            <h1 className="font-display text-2xl font-bold text-foreground">Mot de passe oublié</h1>
            <p className="text-sm text-muted-foreground mt-1">Entrez votre email pour recevoir un lien de réinitialisation</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
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

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-[0_0_20px_hsl(190,95%,50%,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>

            <Link to="/auth" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
