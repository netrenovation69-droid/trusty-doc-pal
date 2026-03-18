const MentionsLegalesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-black mb-10 text-primary">Mentions Légales</h1>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">1. Éditeur du site</h2>
          <div className="bg-secondary p-6 rounded-xl border border-border text-muted-foreground leading-relaxed text-sm">
            <p className="font-bold text-primary mb-2">KAYZEN SASU (Entreprise Sociale et Solidaire)</p>
            <p>Siège social : 6 rue Pierre Termier, 69009 Lyon, France</p>
            <p>SIRET : 999 418 346 00014 | RCS : Lyon B 999 418 346</p>
            <p>Capital social : 1 000 €</p>
            <p>Directeur de la publication : Le représentant légal de KAYZEN SASU</p>
            <p>Contact : contact@kayzen.fr</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">2. Hébergement</h2>
          <div className="bg-secondary p-6 rounded-xl border border-border text-muted-foreground leading-relaxed text-sm">
            <p className="font-bold text-primary mb-2">EX2 Inc.</p>
            <p>Infrastructure éco-responsable, serveurs localisés en France et dans l'Union Européenne.</p>
            <p>Datacenters alimentés par des énergies renouvelables.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">3. Propriété intellectuelle</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            L'ensemble du contenu du site DocuSûr (textes, graphismes, logo, icônes, code source) est la propriété exclusive de KAYZEN SASU ou de ses partenaires. Toute reproduction, représentation, modification ou exploitation non autorisée est interdite et constitue une contrefaçon au sens des articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">4. Limitation de responsabilité</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            KAYZEN SASU s'efforce de fournir des informations aussi précises que possible. Toutefois, elle ne pourra être tenue responsable des omissions, inexactitudes ou carences dans la mise à jour. L'utilisation des outils DocuSûr se fait sous la responsabilité de l'utilisateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">5. Droit applicable</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Le présent site et ses conditions d'utilisation sont régis par le droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Lyon.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MentionsLegalesPage;
