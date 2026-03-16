const CgvPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-black mb-10 text-primary">Mentions Légales & CGV</h1>
      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">1. Éditeur du Service</h2>
          <div className="bg-secondary p-6 rounded-xl border border-border text-muted-foreground leading-relaxed text-sm">
            <p className="font-bold text-primary mb-2">KAYZEN SASU (Entreprise Sociale et Solidaire)</p>
            <p>Siège social : 6 rue Pierre Termier, 69009 Lyon, France.</p>
            <p>SIRET : 999 418 346 00014 | RCS : Lyon B 999 418 346.</p>
            <p>Capital social : 1 000 €</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">2. Hébergement</h2>
          <div className="bg-secondary p-6 rounded-xl border border-border text-muted-foreground leading-relaxed text-sm">
            <p className="font-bold text-primary mb-2">EX2 Inc. (Infrastructure Éco-responsable)</p>
            <p>Serveurs localisés exclusivement en France et dans l'Union Européenne.</p>
            <p>Engagement éco-responsable : Datacenters alimentés par des énergies renouvelables.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">
            3. Confidentialité & Sécurité RAM
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            DocuSûr s'engage contractuellement au respect du principe "Zéro stockage". Vos données sont traitées
            exclusivement en mémoire vive (RAM). Aucune donnée n'est écrite sur disque, persistée ou utilisée pour
            l'entraînement de modèles tiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">4. Propriété Intellectuelle</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Tous les droits relatifs à la marque DocuSûr, au logo et à la technologie propriétaire de traitement
            documentaire sont la propriété exclusive de KAYZEN SASU. Toute reproduction est interdite sans accord
            préalable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">
            5. Conditions Générales de Vente
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            L'accès au service DocuSûr est proposé selon deux formules : une offre gratuite avec limitations de volume
            et une offre payante avec accès illimité. Les prix sont indiqués en euros TTC. Le paiement s'effectue
            mensuellement ou annuellement selon la formule choisie.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">
            6. Protection des Données (RGPD)
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès,
            de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à
            l'adresse : contact@kayzen.fr
          </p>
        </section>
      </div>
    </div>
  );
};

export default CgvPage;
