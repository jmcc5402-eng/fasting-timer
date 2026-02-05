import { useState, useEffect } from 'react'

const DURATION = 10 // 1 hour in seconds

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const [state, setState] = useState('idle') // 'idle' | 'running' | 'done'
  const [endTime, setEndTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(DURATION)

  useEffect(() => {
    if (state !== 'running') return

    const tick = () => {
      const remaining = Math.round((endTime - Date.now()) / 1000)
      if (remaining <= 0) {
        setTimeLeft(0)
        setState('done')
      } else {
        setTimeLeft(remaining)
      }
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [state, endTime])

  function handleStart() {
    setEndTime(Date.now() + DURATION * 1000)
    setTimeLeft(DURATION)
    setState('running')
  }

  function handleCancel() {
    setState('idle')
    setEndTime(null)
    setTimeLeft(DURATION)
  }

  function handleRestart() {
    setState('idle')
    setEndTime(null)
    setTimeLeft(DURATION)
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center px-6">
      {state === 'idle' && (
        <button
          onClick={handleStart}
          className="w-52 h-52 rounded-full bg-stone-800 text-stone-100 text-2xl font-semibold
                     shadow-lg hover:shadow-xl active:scale-95 hover:scale-105
                     transition-all duration-200 cursor-pointer"
        >
          Begin Fast
        </button>
      )}

      {state === 'running' && (
        <div className="flex flex-col items-center gap-10">
          <p className="text-7xl font-mono font-light text-stone-800 tabular-nums">
            {formatTime(timeLeft)}
          </p>
          <button
            onClick={handleCancel}
            className="text-stone-400 hover:text-stone-600 text-sm tracking-wide
                       transition-colors duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {state === 'done' && (
        <div className="flex flex-col items-center gap-8 animate-[fadeIn_0.6s_ease-out]">
          <p className="text-4xl font-semibold text-stone-800">You did it!</p>
          <button
            onClick={handleRestart}
            className="px-8 py-3 rounded-full bg-stone-800 text-stone-100 text-lg font-medium
                       shadow-lg hover:shadow-xl active:scale-95 hover:scale-105
                       transition-all duration-200 cursor-pointer"
          >
            Start Again
          </button>
        </div>
      )}
    </div>
  )
}
