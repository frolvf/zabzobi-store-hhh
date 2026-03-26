import { Link } from "react-router-dom";
import { Gamepad2, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold text-primary">
              ZUOSS<span className="text-secondary"> SHOP</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Votre boutique de jeux numériques au Maroc. Comptes, clés et cartes cadeaux pour toutes les plateformes.
          </p>

        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Navigation</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</Link>
            <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Catalogue</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">Panier</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Plateformes</h4>
          <div className="flex flex-col gap-2">
            {["Steam", "PlayStation", "Xbox", "Epic Games"].map((p) => (
              <Link key={p} to={`/catalog?platform=${p}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {p}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Contact</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 text-primary" />
              support@gamezone.ma
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 text-primary" />
              +212 600 000 000
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              Casablanca, Maroc
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
        © 2026 GameZone. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
