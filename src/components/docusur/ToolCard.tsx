import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export function ToolCard({ id, name, description, icon: Icon, color }: ToolCardProps) {
  return (
    <Link to={`/outils/${id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group h-full bg-card p-5 rounded-xl border border-border hover:border-trust-blue/30 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center gap-3"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-secondary ${color} transition-all duration-200 group-hover:shadow-md`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground group-hover:text-trust-blue transition-colors">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}
