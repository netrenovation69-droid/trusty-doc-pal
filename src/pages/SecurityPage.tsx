import { motion } from "framer-motion";
import { ShieldCheck, BrainCircuit, Heart, Lock, Box, Database, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SecurityPage = () => {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5 text-primary">
            Votre confidentialité n'est pas une option.
            <br /> C'est notre architecture.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment <span className="font-bold text-destructive">DocuSûr</span> protège vos documents grâce à
            une infrastructure 100% française.
          </p>
        </motion.div>

        {/* Three Pillars */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: ShieldCheck,
              title: "Souveraineté French Tech",
              description:
                "Vos fichiers ne traversent jamais l'Atlantique. Hébergé exclusivement sur des serveurs EX2 Éco en France.",
            },
            {
              icon: BrainCircuit,
              title: "IA RAM-Only & Privée",
              description:
                "Moteur de traitement s'exécutant uniquement en mémoire vive. Zéro écriture disque, destruction immédiate.",
            },
            {
              icon: Heart,
              title: "Engagement ESS (Kayzen)",
              description:
                "Notre mission est l'impact social et la protection radicale de vos données, pas seulement le profit.",
            },
          ].map((pillar, i) => (
            <div
              key={i}
              className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <pillar.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{pillar.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Technical Focus */}
        <motion.div
          variants={itemVariants}
          className="bg-primary text-primary-foreground p-12 rounded-2xl mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-destructive/10 rounded-full -mr-24 -mt-24 blur-3xl" />
          <h2 className="text-2xl font-bold mb-10 text-center relative z-10">
            Une ingénierie de pointe pour une protection maximale.
          </h2>
          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {[
              { icon: Lock, title: "Chiffrement de bout en bout", desc: "Transferts SSL/TLS 1.3, AES-256 au repos." },
              { icon: Box, title: "Isolation par Sandboxing", desc: "Opérations dans des containers isolés et éphémères." },
              { icon: Database, title: "Zéro Persistance", desc: "Systèmes de fichiers temporaires (tmpfs) uniquement." },
            ].map((tech, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-xl flex items-center justify-center mb-4">
                  <tech.icon className="w-7 h-7 text-destructive" />
                </div>
                <h4 className="font-bold mb-1">{tech.title}</h4>
                <p className="text-primary-foreground/70 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          className="text-center bg-secondary p-12 rounded-2xl border border-border"
        >
          <h3 className="text-2xl font-bold mb-4 text-primary">
            Besoin d'une instance privée pour votre entreprise ?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Nous proposons des déploiements sur-mesure pour les secteurs critiques (santé, défense, finance).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:opacity-90 transition shadow-md">
              Contacter notre expert sécurité
            </button>
            <Link to="/" className="flex items-center gap-2 text-primary font-bold hover:underline justify-center">
              <FileText className="w-4 h-4" /> Télécharger notre livre blanc
            </Link>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default SecurityPage;
