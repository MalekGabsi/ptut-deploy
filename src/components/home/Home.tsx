import { useEffect, useRef } from "react"
import "./style.css"

import Bateau from "./Bateau"
import Capitaine from "./Capitaine"
import PlusInfo from "./PlusInfo"
import Boussole from "./Boussole"

export default function Home() {
  const sceneRef = useRef<HTMLElement | null>(null)

  // Parallax mouse tracking
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    let raf = 0
    let tx = 0, ty = 0
    let cx = 0, cy = 0

    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      tx = (px - 0.5) * 2
      ty = (py - 0.5) * 2
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const tick = () => {
      raf = 0
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      scene.style.setProperty("--mx", cx.toFixed(4))
      scene.style.setProperty("--my", cy.toFixed(4))
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main ref={sceneRef} className="scene scene--fx" aria-label="Page d'accueil CAPITNF1">
      {/* Fond vide — base sans éléments */}
      <img src="/assets/fond_vf.jpg" className="layer bg bg--fx" alt="" />

      {/* FX dynamiques */}
      <div className="fx fx--sky" aria-hidden="true" />
      <div className="fx fx--water" aria-hidden="true" />
      <div className="fx fx--sparkles" aria-hidden="true" />

      {/* Titre en haut au centre */}
      <img src="/assets/title.PNG" className="layer overlay overlay--title" alt="CAPITNF1" />


      {/* Éléments interactifs superposés */}
      <Bateau />
      <Capitaine />
      <PlusInfo />
      <Boussole />

      {/* Baleine */}
      <img src="/assets/bon_balaine.png" className="obj obj--balaine" alt="" />

      {/* Zone cliquable iceberg du fond */}
      <a href="/iceberg" className="hotspot hotspot--iceberg" aria-label="Explorer l'iceberg" />
    </main>
  )
}
