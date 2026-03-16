import { Link } from "react-router-dom";
import { Shield, Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 bg-primary text-primary-foreground border-t border-primary/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                <Shield className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">DocuSûr</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6 opacity-70">
              Zéro stockage. 100% Français.<br />
              Une solution de l'Économie Sociale et Solidaire (ESS) dédiée à la souveraineté documentaire.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-destructive mb-1">Label</span>
                <span className="text-xs font-bold">French Tech</span>
              </div>
              <div className="w-px h-8 bg-primary-foreground/10" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-destructive mb-1">Statut</span>
                <span className="text-xs font-bold">ESS Kayzen</span>
              </div>
              <div className="w-px h-8 bg-primary-foreground/10" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-destructive mb-1">Hébergement</span>
                <span className="text-xs font-bold flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald" /> EX2 Éco
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-5 uppercase tracking-widest text-xs">Navigation</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/outils" className="hover:text-destructive transition-colors">Outils PDF</Link></li>
              <li><Link to="/securite" className="hover:text-destructive transition-colors">Sécurité & RAM</Link></li>
              <li><Link to="/a-propos" className="hover:text-destructive transition-colors">À propos (ESS)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-5 uppercase tracking-widest text-xs">Légal</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li><Link to="/cgv" className="hover:text-destructive transition-colors">Mentions Légales</Link></li>
              <li><Link to="/cgv" className="hover:text-destructive transition-colors">CGU / CGV</Link></li>
              <li><Link to="/securite" className="hover:text-destructive transition-colors">Politique de Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-[11px] leading-relaxed opacity-50 max-w-2xl">
            <p className="mb-1">
              <span className="opacity-80 font-bold">Éditeur :</span> KAYZEN SASU (ESS), 6 rue Pierre Termier, 69009 Lyon.
              <span className="mx-2">|</span> SIRET : 999 418 346 00014
            </p>
            <p>
              <span className="opacity-80 font-bold">Hébergement :</span> EX2 Inc. (Infrastructure Éco-responsable), serveurs localisés en France/UE.
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">
            © 2026 DocuSûr. Conçu à Lyon.
          </p>
        </div>
      </div>
    </footer>
  );
}
