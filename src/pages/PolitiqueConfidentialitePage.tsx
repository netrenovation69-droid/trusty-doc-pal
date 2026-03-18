const PolitiqueConfidentialitePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-black mb-10 text-primary">Politique de Confidentialité</h1>
      <p className="text-muted-foreground text-sm mb-10 leading-relaxed">
        Dernière mise à jour : 18 mars 2026. Cette politique décrit comment KAYZEN SASU (ESS), éditeur de DocuSûr, traite vos données personnelles conformément au RGPD (Règlement UE 2016/679).
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">1. Responsable du traitement</h2>
          <div className="bg-secondary p-6 rounded-xl border border-border text-muted-foreground leading-relaxed text-sm">
            <p className="font-bold text-primary mb-2">KAYZEN SASU (Entreprise Sociale et Solidaire)</p>
            <p>6 rue Pierre Termier, 69009 Lyon, France</p>
            <p>SIRET : 999 418 346 00014</p>
            <p>Contact DPO : contact@kayzen.fr</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">2. Données collectées</h2>
          <p className="text-muted-foreground leading-relaxed text-sm mb-4">
            DocuSûr est conçu selon le principe de <strong className="text-foreground">minimisation des données</strong>. Nous ne collectons <strong className="text-foreground">aucune donnée personnelle</strong> lors de l'utilisation des outils PDF.
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
            <li><strong className="text-foreground">Fichiers PDF :</strong> Traités exclusivement dans la mémoire vive (RAM) de votre navigateur. Aucun fichier n'est uploadé, stocké ou transmis à un serveur.</li>
            <li><strong className="text-foreground">Cookies techniques :</strong> Préférence de thème (clair/sombre), consentement cookies. Aucun cookie de tracking ou publicitaire.</li>
            <li><strong className="text-foreground">Données de navigation :</strong> Aucun outil d'analytics tiers n'est utilisé.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">3. Base légale du traitement</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Les cookies techniques sont traités sur la base de l'<strong className="text-foreground">intérêt légitime</strong> (fonctionnement du service). Aucun traitement supplémentaire n'est effectué, rendant le consentement non requis au sens de l'article 6 du RGPD pour ces cookies strictement nécessaires.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">4. Durée de conservation</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Les préférences (thème, consentement) sont stockées dans le localStorage de votre navigateur et persistent jusqu'à leur suppression manuelle. Aucune donnée n'est conservée côté serveur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">5. Transfert de données</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Aucun transfert de données personnelles n'est effectué vers des pays tiers. L'hébergement est assuré par EX2 Inc. sur des serveurs localisés exclusivement en France et dans l'Union Européenne.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">6. Vos droits (RGPD)</h2>
          <p className="text-muted-foreground leading-relaxed text-sm mb-4">
            Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-muted-foreground text-sm space-y-2">
            <li>Droit d'accès à vos données personnelles</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed text-sm mt-4">
            Pour exercer ces droits : <strong className="text-foreground">contact@kayzen.fr</strong>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">7. Réclamation</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Si vous estimez que le traitement de vos données constitue une violation du RGPD, vous pouvez introduire une réclamation auprès de la <strong className="text-foreground">CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-trust-blue underline">www.cnil.fr</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-primary border-b border-border pb-2">8. Sécurité technique</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            DocuSûr utilise le chiffrement AES-256-GCM via la Web Crypto API et le traitement WebAssembly (WASM) pour garantir que vos documents ne quittent jamais votre appareil. Aucune donnée n'est écrite sur disque ni transmise sur le réseau.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PolitiqueConfidentialitePage;
