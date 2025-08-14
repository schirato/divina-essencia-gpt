export default function Badge({ children, tone='accent' }: { children: any; tone?: 'accent'|'rose'|'soft' }){
  const colors = {
    accent: 'bg-[var(--accent)] text-white',
    rose: 'bg-[var(--rose)] text-white',
    soft: 'bg-[var(--bg-soft)] text-black/70'
  }[tone]
  return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${colors}`}>{children}</span>
}
