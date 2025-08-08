import { create } from 'zustand'

type Scores = Record<string, number>

type State = {
  selectedArchetype?: string | null
  scores: Scores
  achievements: string[]
}

type Actions = {
  setArchetype: (id: string) => void
  addScore: (id: string, v: number) => void
  award: (code: string) => void
  reset: () => void
}

const persisted = JSON.parse(localStorage.getItem('divina-state') || '{}')

export const useDivina = create<State & Actions>((set, get) => ({
  selectedArchetype: persisted.selectedArchetype ?? null,
  scores: persisted.scores ?? {},
  achievements: persisted.achievements ?? [],
  setArchetype: (id) => { set({ selectedArchetype: id }); save() },
  addScore: (id, v) => { const s = { ...get().scores, [id]: (get().scores[id]||0) + v }; set({ scores: s }); save() },
  award: (code) => { if(!get().achievements.includes(code)){ set({ achievements: [...get().achievements, code] }); save() } },
  reset: () => { set({ selectedArchetype: null, scores: {}, achievements: [] }); save() }
}))

function save(){
  const state = useDivina.getState()
  localStorage.setItem('divina-state', JSON.stringify({ selectedArchetype: state.selectedArchetype, scores: state.scores, achievements: state.achievements }))
}

// Moon phase util - simple approximation, returns 0..1 where 0 is new moon
export function moonPhase(date = new Date()): number {
  const lp = 2551443; // lunar period in seconds
  const new_moon = Date.UTC(1970, 0, 7, 20, 35, 0) / 1000; // reference
  const now = date.getTime()/1000
  return ((now - new_moon) % lp) / lp
}

export function phaseName(phase: number){
  if (phase < 0.03 || phase > 0.97) return 'Lua Nova'
  if (phase < 0.22) return 'Crescente Inicial'
  if (phase < 0.28) return 'Quarto Crescente'
  if (phase < 0.47) return 'Crescente Gibosa'
  if (phase < 0.53) return 'Lua Cheia'
  if (phase < 0.72) return 'Minguante Gibosa'
  if (phase < 0.78) return 'Quarto Minguante'
  return 'Minguante Final'
}

export async function requestDailyNotification(text: string){
  if(!('Notification' in window)) return
  const perm = await Notification.requestPermission()
  if(perm === 'granted'){
    new Notification('Divina Essência', { body: text, icon: '/icons/icon-192.png' })
  }
}

export function scheduleDaily(text: string, hour=9){
  if(!('Notification' in window)) return
  const now = new Date()
  const target = new Date()
  target.setHours(hour, 0, 0, 0)
  if(target.getTime() <= now.getTime()) target.setDate(target.getDate()+1)
  const ms = target.getTime() - now.getTime()
  setTimeout(()=>requestDailyNotification(text), ms)
}
