import { Zap, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="text-primary-foreground w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">
            Docu<span className="text-destructive">Sûr</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link to="/outils" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            Outils
          </Link>
          <Link to="/securite" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            Sécurité
          </Link>
          <Link to="/a-propos" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            À propos
          </Link>
          <Link to="/cgv" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            Légal
          </Link>
        </nav>

        <Link
          to="/outils"
          className="bg-trust-blue text-primary-foreground px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition shadow-sm"
        >
          Accès Premium
        </Link>
      </div>
    </header>
  );
}
