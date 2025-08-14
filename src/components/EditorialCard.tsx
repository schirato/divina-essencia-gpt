import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function EditorialCard({ title, kicker, img, children }:{ title:string; kicker?:string; img?:string; children?:any }){
  return (
    <Card className="overflow-hidden card--elevated">
      {img && <img src={img} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-5">
        {kicker && <div className="mb-2"><Badge tone="soft">{kicker}</Badge></div>}
        <h3 className="font-title text-xl mb-2">{title}</h3>
        <div className="opacity-80">{children}</div>
      </div>
    </Card>
  )
}
