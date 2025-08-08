export default function Inspiration(){
  const items = Array.from({length:12}).map((_,i)=>`/assets/cards/card-${(i%4)+1}.png`)
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="font-title text-2xl mb-4">Galeria de Inspiração</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((src,i)=>(
          <img key={i} src={src} className="rounded-2xl shadow-md" alt="Card de inspiração"/>
        ))}
      </div>
    </main>
  )
}
