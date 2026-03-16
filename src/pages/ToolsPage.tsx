import { useState } from "react";
import { tools } from "@/constants/tools";
import { ToolCard } from "@/components/docusur/ToolCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

const ToolsPage = () => {
  const categories = ["Tous", ...Array.from(new Set(tools.map((t) => t.category)))];
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter((t) => {
    const matchesCategory = activeCategory === "Tous" || t.category === activeCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-3 text-center text-primary">La Suite DocuSûr</h1>
        <p className="text-lg text-muted-foreground text-center mb-14 max-w-3xl mx-auto">
          Une collection complète d'outils PDF souverains pour gérer, convertir et sécuriser vos documents.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un outil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-trust-blue outline-none transition-all"
            />
          </div>
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                key={tool.id}
              >
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTools.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">Aucun outil ne correspond à votre recherche.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Tous");
              }}
              className="mt-3 text-destructive font-bold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsPage;
