import { motion } from "framer-motion";
import { Shield, Heart, Zap, Leaf, MapPin } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold mb-6"
          >
            <Heart className="w-4 h-4 text-destructive" /> Économie Sociale et Solidaire
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-primary mb-6 tracking-tighter"
          >
            Plus qu'un outil,
            <br />
            <span className="text-destructive">un engagement éthique.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            DocuSûr est né d'une conviction : la sécurité de vos documents ne doit pas être un luxe. En tant que service
            de l'ESS Kayzen, notre mission est l'impact, pas seulement le profit.
          </motion.p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: Shield,
              title: "Souveraineté French Tech",
              desc: "Labellisé French Tech, chaque ligne de code et chaque octet de donnée reste sous juridiction française.",
            },
            {
              icon: Zap,
              title: "Sécurité RAM-Only",
              desc: "Zéro écriture disque. Vos fichiers transitent uniquement par la mémoire vive pour un traitement instantané.",
            },
            {
              icon: Heart,
              title: "Statut ESS (Kayzen)",
              desc: "KAYZEN SASU réinvestit ses bénéfices dans l'innovation sociale et la protection du patrimoine numérique.",
            },
          ].map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-secondary border border-border"
            >
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <pillar.icon className="text-primary-foreground w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              Ancré à Lyon,
              <br />
              <span className="text-destructive">Rayonnant en Europe.</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Basés au cœur du 9ème arrondissement de Lyon, nous concevons des solutions de pointe au sein de l'un des
                pôles technologiques les plus dynamiques de France.
              </p>
              <p>
                Notre choix d'hébergement s'est porté sur{" "}
                <span className="font-bold text-primary">EX2 Éco</span>, un partenaire partageant nos valeurs
                d'éco-responsabilité.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald/10 text-emerald font-bold text-xs">
                  <Leaf className="w-3 h-3" /> Éco-responsable
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-trust-blue/10 text-trust-blue font-bold text-xs">
                  <MapPin className="w-3 h-3" /> Lyon, France
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="p-10 bg-primary rounded-2xl shadow-xl">
              <div className="space-y-6">
                {[
                  { num: "1", title: "Traitement en RAM", desc: "Aucune donnée écrite sur disque dur." },
                  { num: "2", title: "LLM Local", desc: "IA auto-hébergée, aucune donnée sortante." },
                  { num: "3", title: "Zéro Entraînement", desc: "Vos documents ne servent jamais à l'entraînement." },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-destructive flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-primary-foreground font-bold mb-1">{step.title}</h4>
                      <p className="text-primary-foreground/60 text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Summary */}
        <div className="p-12 bg-secondary rounded-2xl border border-border text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Transparence Totale</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            En tant qu'entreprise de l'ESS, nous publions régulièrement nos rapports d'impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-card rounded-xl border border-border shadow-sm">
              <span className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                SIRET
              </span>
              <span className="text-primary font-bold text-sm">999 418 346 00014</span>
            </div>
            <div className="px-6 py-3 bg-card rounded-xl border border-border shadow-sm">
              <span className="block text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                RCS
              </span>
              <span className="text-primary font-bold text-sm">Lyon B 999 418 346</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
