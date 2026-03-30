import { Link } from "react-router-dom";
import { Gamepad2, Mail, Phone, MapPin, Instagram } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NovaAIBanner from "@/components/NovaAIBanner";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <>
      <NovaAIBanner />
      <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold text-primary">
                ZUOSS<span className="text-secondary"> SHOP</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("footer.desc")}</p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">{t("footer.navigation")}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link>
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("nav.catalog")}</Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t("cart.title")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">{t("footer.platforms")}</h4>
            <div className="flex flex-col gap-2">
              {["Steam", "PlayStation", "Xbox", "Epic Games"].map((p) => (
                <Link key={p} to={`/catalog?platform=${p}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {p}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                nightmarezuoss@gmail.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                0660967684
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Casablanca, Maroc
              </div>
              <a href="https://instagram.com/zuoss.shop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-4 h-4 text-primary" />
                @zuoss.shop
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Zuoss Shop. {t("footer.rights")}</p>
          <p className="mt-2">
            Developed by{" "}
            <a href="https://novaai-agency.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              NovaAI Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
