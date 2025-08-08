import content from "../data/content.json";
import { useDivina, requestDailyNotification, scheduleDaily } from "../store";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const { selectedArchetype } = useDivina();
  const affirmation = pickAffirmation(selectedArchetype || undefined);

  useEffect(() => {
    requestDailyNotification(affirmation);
    scheduleDaily(affirmation, 9);
    document.documentElement.setAttribute(
      "data-theme",
      (selectedArchetype || "").toString()
    );
  }, [selectedArchetype]);

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <section className="card p-4 mb-4">
        <h2 className="font-title text-xl mb-2">Afirmação do dia</h2>
        <p className="italic">“{affirmation}”</p>
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        <Link to="/quiz" className="card p-4">
          Refazer Quiz
        </Link>
        <Link to="/report" className="card p-4">
          Relatório Arquetípico
        </Link>
        <Link to="/planner" className="card p-4">
          Planner & Calendário Lunar
        </Link>
        <Link to="/affirmations" className="card p-4">
          Frases & Dicas
        </Link>
      </section>

      <section className="mt-6">
        <h3 className="font-title text-lg mb-2">Arquétipos</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {content.archetypes.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="font-semibold">{a.name}</div>
              <div className="text-sm opacity-80">{a.summary}</div>
              <div className="flex gap-2 mt-2">
                {a.palette.map((c, i) => (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-full"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function pickAffirmation(arch?: string) {
  const affirm = (content.affirmations as any[]).filter(
    (a) => !a.archetypeId || a.archetypeId === arch
  );
  return affirm[Math.floor(Math.random() * affirm.length)].text;
}
