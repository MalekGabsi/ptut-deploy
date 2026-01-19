import { Link } from "react-router-dom"
import "./style.css"

export default function PlusInfos() {
  return (
    <div className="page plusinfos">
      <header className="topbar">
        <Link className="back" to="/" aria-label="Retour à l'accueil">
          ⬅ Retour
        </Link>
        <h1>Plus d’infos</h1>
      </header>

      <main className="container">
        <section className="card">
          <h2>À propos</h2>
          <p>
            CAPITNF1 est un site éducatif destiné aux enfants (6–11 ans) atteints
            de Neurofibromatose de type 1 (NF1). Il propose une approche ludique
            et visuelle (capsules vidéo, contenus interactifs) pour aider à mieux
            comprendre la maladie.
          </p>
        </section>

        <section className="card">
          <h2>Partenaires</h2>
          <p className="muted">
            Logos affichés dans le cadre du projet. Validation finale des contenus
            et visuels avec les commanditaires avant publication.
          </p>

          <div className="logos">
            <figure className="logo">
              <img
                src="/assets/CHU.png"
                alt="CHU Toulouse — Centre Hospitalier Universitaire"
              />
              <figcaption>CHU Toulouse</figcaption>
            </figure>

            <figure className="logo">
              <img src="/assets/inserm.png" alt="Inserm" />
              <figcaption>Inserm</figcaption>
            </figure>

            <figure className="logo">
              <img
                src="/assets/tonic.png"
                alt="ToNIC — Toulouse NeuroImaging Center"
              />
              <figcaption>ToNIC</figcaption>
            </figure>

            <figure className="logo">
              <img
                src="/assets/isis.png"
                alt="ISIS — Ingénieur Santé Numérique"
              />
              <figcaption>ISIS</figcaption>
            </figure>
          </div>
        </section>

        <section className="card">
          <h2>Équipe projet</h2>
          <ul className="list">
            <li>Yasmine Belarbi</li>
            <li>Ghenima Kadi</li>
            <li>Malek Gabsi</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p className="muted">© CAPITNF1 — Projet tutoré 2025–2026</p>
      </footer>
    </div>
  )
}
