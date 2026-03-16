import { motion } from "framer-motion";
import { ShieldCheck, Server, Lock, ChevronRight, Globe, Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { tools } from "@/constants/tools";
import { ToolCard } from "@/components/docusur/ToolCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Index = () => {
  const featuredTools = tools.filter((t) =>
    ["fusionner", "compresser", "signer", "traduire", "ocr", "proteger"].includes(t.id)
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Hero */}
      <section className="relative pt-24 pb-16 text-center overflow-hidden">
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-7">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 text-destructive" /> Labellisé French Tech
            </span>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-widest">
              <Heart className="w-3 h-3" /> Service de l'ESS Kayzen
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.95] text-primary">
            DocuSûr.
            <br />
            <span className="text-destructive">Zéro stockage. 100% Français.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            L'outil PDF souverain pour les professionnels. Traitement radical en mémoire vive (RAM) : vos données ne sont
            jamais écrites sur disque.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/outils"
              className="bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-bold text-base hover:opacity-90 transition shadow-md"
            >
              Accéder aux outils
            </Link>
            <Link
              to="/securite"
              className="bg-secondary border border-border px-7 py-3.5 rounded-lg font-bold text-base hover:bg-accent transition"
            >
              Découvrir la sécurité
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <motion.section variants={itemVariants} className="py-8 border-y border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ShieldCheck className="text-trust-blue w-4 h-4" /> Conformité RGPD
          </div>
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Server className="text-destructive w-4 h-4" /> Infrastructure Lyon/FR
          </div>
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Lock className="text-trust-blue w-4 h-4" /> Sécurité RAM-Only
          </div>
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Globe className="text-destructive w-4 h-4" /> Hébergement EX2 Éco
          </div>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <motion.section variants={itemVariants} className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Efficacité. Simplicité. Sécurité.</h2>
            <p className="text-muted-foreground">Une suite complète d'outils PDF pour votre productivité.</p>
          </div>
          <Link to="/outils" className="text-destructive font-bold flex items-center gap-1 hover:underline text-sm">
            Tous les outils <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </motion.section>

      {/* Selling Points */}
      <motion.section variants={itemVariants} className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              title: "Sécurité RAM-Only",
              description:
                "Zéro écriture disque. Vos fichiers transitent uniquement par la mémoire vive. Destruction immédiate après traitement.",
            },
            {
              icon: Heart,
              title: "Impact ESS (Kayzen)",
              description:
                "En choisissant DocuSûr, vous soutenez une entreprise de l'ESS basée à Lyon, engagée pour une tech éthique.",
            },
            {
              icon: Server,
              title: "Hébergement Éco-Souverain",
              description:
                "Infrastructure EX2 éco-responsable avec serveurs localisés en France/UE. Souveraineté numérique totale.",
            },
          ].map((point, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center gap-5 bg-secondary p-10 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <point.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-primary">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{point.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section variants={itemVariants} className="py-20 bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Passez à la vitesse supérieure avec DocuSûr.</h2>
          <p className="text-lg mb-10 opacity-80">
            Rejoignez les entreprises qui privilégient la sécurité et la souveraineté numérique.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/outils"
              className="bg-destructive text-primary-foreground px-8 py-3.5 rounded-lg font-bold hover:opacity-90 transition shadow-lg"
            >
              Commencer maintenant
            </Link>
            <Link
              to="/securite"
              className="bg-primary-foreground/10 text-primary-foreground px-8 py-3.5 rounded-lg font-bold hover:bg-primary-foreground/20 transition border border-primary-foreground/20"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Index;
