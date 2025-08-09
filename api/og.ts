import { ImageResponse } from '@vercel/og'
export const config = { runtime: 'edge' }
export default function handler(req: Request){
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('t') || 'Divina Essência'
  const subtitle = searchParams.get('s') || 'Descubra seu poder. Viva sua essência.'
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, background: 'linear-gradient(180deg,#9333EA,#C288A3)', display:'flex', flexDirection:'column', justifyContent:'center', padding: 64, color: '#fff', fontSize: 48 }}>
        <div style={{ fontSize: 72, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 16, fontSize: 36 }}>{subtitle}</div>
      </div>
    ), { width: 1200, height: 630 }
  )
}
