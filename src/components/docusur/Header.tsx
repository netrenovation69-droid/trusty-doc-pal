import { Zap, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link to="/tarifs" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            Tarifs
          </Link>
          <Link to="/securite" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            Sécurité
          </Link>
          <Link to="/a-propos" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            À propos
          </Link>
          <Link to="/mentions-legales" className="text-muted-foreground hover:text-primary font-semibold text-sm transition-colors">
            Légal
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/outils"
            className="hidden sm:inline-flex bg-trust-blue text-primary-foreground px-5 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition shadow-sm"
          >
            Accès Premium
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-secondary"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-card px-6 py-4 space-y-3">
          {[
            { to: "/outils", label: "Outils" },
            { to: "/tarifs", label: "Tarifs" },
            { to: "/securite", label: "Sécurité" },
            { to: "/a-propos", label: "À propos" },
            { to: "/mentions-legales", label: "Mentions Légales" },
            { to: "/politique-de-confidentialite", label: "Confidentialité" },
            { to: "/cgv", label: "CGU / CGV" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-muted-foreground hover:text-primary font-semibold text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
