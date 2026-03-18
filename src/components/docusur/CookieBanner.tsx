import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("docusur-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("docusur-cookie-consent", "accepted");
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem("docusur-cookie-consent", "refused");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] p-4">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl shadow-2xl p-6 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-sm mb-1">
              Respect de votre vie privée
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              DocuSûr utilise uniquement des cookies techniques essentiels au fonctionnement du site (thème, préférences).
              Aucun cookie de tracking, aucune donnée personnelle collectée.{" "}
              <Link to="/politique-de-confidentialite" className="text-trust-blue underline">
                En savoir plus
              </Link>
            </p>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition"
              >
                Accepter
              </button>
              <button
                onClick={refuse}
                className="bg-secondary text-secondary-foreground px-5 py-2 rounded-lg text-xs font-bold hover:bg-accent transition border border-border"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
