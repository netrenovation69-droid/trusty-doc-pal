import { motion } from "framer-motion";
import { Check, Zap, Shield, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const plans = [
  {
    name: "Découverte",
    price: "0 €",
    period: "pour toujours",
    description: "Idéal pour tester la puissance du traitement local.",
    icon: Zap,
    features: [
      "5 fichiers par jour",
      "Tous les outils PDF",
      "Traitement 100% local",
      "Aucune inscription requise",
      "Zéro collecte de données",
    ],
    cta: "Commencer gratuitement",
    ctaLink: "/outils",
    highlight: false,
  },
  {
    name: "Souverain",
    price: "49 €",
    period: "/ mois",
    description: "Pour les professionnels qui exigent confidentialité et performance.",
    icon: Shield,
    features: [
      "Fichiers illimités",
      "Tous les outils PDF",
      "Traitement 100% local",
      "Support prioritaire",
      "Conformité RGPD & HIPAA",
      "Mises à jour en avant-première",
    ],
    cta: "Choisir Souverain",
    ctaLink: "/outils",
    highlight: true,
  },
  {
    name: "Impact ESS",
    price: "Sur mesure",
    period: "",
    description: "Tarification solidaire pour l'Économie Sociale et Solidaire.",
    icon: Building2,
    features: [
      "Volume adapté à votre structure",
      "Tous les outils PDF",
      "Traitement 100% local",
      "Accompagnement dédié",
      "Conformité RGPD & HIPAA",
      "Facturation adaptée ESS",
    ],
    cta: "Nous contacter",
    ctaLink: "/a-propos",
    highlight: false,
  },
];

export default function TarifsPage() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-destructive mb-4">
            Tarifs
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-5 tracking-tight">
            Un prix juste pour une{" "}
            <span className="text-trust-blue">confidentialité absolue</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Pas de frais cachés. Pas de serveurs tiers. Choisissez la formule qui correspond à vos besoins.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              className={`relative rounded-2xl border p-8 md:p-10 flex flex-col transition-shadow duration-300 ${
                plan.highlight
                  ? "border-trust-blue bg-card/80 backdrop-blur-sm shadow-lg shadow-trust-blue/10 ring-1 ring-trust-blue/20"
                  : "border-border bg-card/60 backdrop-blur-sm hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-trust-blue text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                    Populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  plan.highlight ? "bg-trust-blue/15 text-trust-blue" : "bg-secondary text-muted-foreground"
                }`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">{plan.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black text-foreground tracking-tight">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                      plan.highlight ? "text-trust-blue" : "text-emerald"
                    }`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm py-3 px-6 transition-all ${
                  plan.highlight
                    ? "bg-trust-blue text-primary-foreground hover:opacity-90 shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-12"
        >
          Tous les traitements sont effectués localement dans votre navigateur. Aucune donnée ne quitte votre appareil.
        </motion.p>
      </div>
    </section>
  );
}
