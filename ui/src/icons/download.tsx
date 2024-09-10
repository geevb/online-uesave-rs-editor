export function Download({ w = 22, h = 22 }: { w?: number; h?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/>
      <path d="M7 11l5 5l5 -5"/>
      <path d="M12 4l0 12"/>
    </svg>
  )
}
