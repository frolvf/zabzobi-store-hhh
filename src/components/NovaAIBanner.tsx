import { ExternalLink, Sparkles } from "lucide-react";

const NovaAIBanner = () => {
  return (
    <a
      href="https://novaai-agency.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-y border-border hover:from-primary/20 hover:via-secondary/20 hover:to-primary/20 transition-all duration-300 group"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3 text-sm">
        <Sparkles className="w-4 h-4 text-secondary shrink-0" />
        <span className="text-muted-foreground">
          Besoin d'un site web ou d'une app ?{" "}
          <span className="text-primary font-semibold group-hover:underline">
            NovaAI Agency
          </span>{" "}
          – Création de sites, apps & solutions IA
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </a>
  );
};

export default NovaAIBanner;
