import Button from '../ui/Button'

export default function Hero({ title='Divina Essência', subtitle='Descubra seu poder. Viva sua essência.', cta, onCta }:{ title?:string; subtitle?:string; cta?:string; onCta?:()=>void }){
  return (
    <section className="hero-gradient rounded-3xl p-8 mb-6 card--elevated">
      <h1 className="font-title text-3xl md:text-4xl mb-2">{title}</h1>
      <p className="opacity-80 mb-4">{subtitle}</p>
      {cta && <Button onClick={onCta}>{cta}</Button>}
    </section>
  )
}
