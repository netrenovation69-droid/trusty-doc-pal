import { useParams, useNavigate } from "react-router-dom";
import { tools } from "@/constants/tools";
import { Upload, ShieldCheck, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const ToolPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tool = tools.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="p-20 text-center text-muted-foreground">
        Outil non trouvé.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-8 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-10"
        >
          <div className={`p-4 rounded-2xl bg-card shadow-lg border border-border ${tool.color}`}>
            <tool.icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">{tool.name}</h1>
            <p className="text-muted-foreground">{tool.description}</p>
          </div>
        </motion.div>

        <div className="bg-card p-10 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center gap-6 hover:border-trust-blue/30 transition-all">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
          </motion.div>
          <div>
            <p className="text-xl font-bold text-primary mb-1">Déposez vos fichiers ici</p>
            <p className="text-muted-foreground text-sm">ou cliquez pour parcourir vos documents</p>
          </div>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:opacity-90 transition shadow-md">
            Sélectionner les fichiers
          </button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <ShieldCheck className="w-3 h-3" />
            Vos fichiers sont traités localement et en toute sécurité
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;
