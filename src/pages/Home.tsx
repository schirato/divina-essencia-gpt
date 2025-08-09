import content from "../data/content.json";
import { useDivina, requestDailyNotification, scheduleDaily } from "../store";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForceRefresh } from "../hooks/useForceRefresh";

export default function Home() {
  const { selectedArchetype } = useDivina();
  const { refreshKey } = useForceRefresh();
  const affirmation = pickAffirmation(selectedArchetype || undefined);

  useEffect(() => {
    requestDailyNotification(affirmation);
    scheduleDaily(affirmation, 9);
    document.documentElement.setAttribute(
      "data-theme",
      (selectedArchetype || "").toString()
    );
  }, [selectedArchetype, refreshKey]); // Adicionar refreshKey para re-executar quando cache for invalidado

  return (
    <main className="p-4 max-w-3xl mx-auto" key={refreshKey}>
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
  // Afirmações temporárias até serem adicionadas ao content.json
  const defaultAffirmations = [
    { text: "Eu sou forte e confiante em minha jornada." },
    { text: "Minha beleza interior se reflete em tudo que faço." },
    { text: "Eu abraço minha essência única e poderosa." },
    { text: "Cada dia é uma nova oportunidade de brilhar." },
    { text: "Eu mereço amor, respeito e felicidade." },
    { text: "Minha intuição me guia pelo caminho certo." },
    { text: "Eu sou a heroína da minha própria história." },
    { text: "Minha energia positiva transforma tudo ao meu redor." },
  ];

  const affirmations = (content as any).affirmations || defaultAffirmations;
  const affirm = affirmations.filter(
    (a: any) => !a.archetypeId || a.archetypeId === arch
  );
  return (
    affirm[Math.floor(Math.random() * affirm.length)]?.text ||
    "Você é incrível!"
  );
}
