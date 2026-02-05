import { useState, useEffect } from 'react'
import Anthropic from '@anthropic-ai/sdk'

const DURATION = 3600 // 1 hour in seconds

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const [state, setState] = useState('idle') // 'idle' | 'running' | 'done'
  const [endTime, setEndTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [encouragement, setEncouragement] = useState(null)
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)

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
    setEncouragement(null)
  }

  function handleRestart() {
    setState('idle')
    setEndTime(null)
    setTimeLeft(DURATION)
    setEncouragement(null)
  }

  async function handleAddHour() {
    // Add 1 hour (3600 seconds) to the timer
    setEndTime(prev => prev + 3600 * 1000)

    // Fetch encouraging message from Claude
    setIsLoadingMessage(true)
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: 'Generate a short, witty, encouraging message (1-2 sentences) for someone who just decided to extend their fast by one more hour. Be playful and supportive. Just give the message, no quotes or extra formatting.',
          },
        ],
      })
      const message = response.content[0].text
      setEncouragement(message)
    } catch (error) {
      console.error('Failed to fetch encouragement:', error)
      setEncouragement("You've got this! One more hour is nothing for a fasting champion like you.")
    } finally {
      setIsLoadingMessage(false)
    }
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
            onClick={handleAddHour}
            disabled={isLoadingMessage}
            className="px-6 py-3 rounded-full bg-stone-800 text-stone-100 font-medium
                       shadow-lg hover:shadow-xl active:scale-95 hover:scale-105
                       transition-all duration-200 cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoadingMessage ? 'Adding...' : 'Add One More Hour'}
          </button>

          {encouragement && (
            <p className="max-w-md text-center text-stone-600 text-lg italic animate-[fadeIn_0.5s_ease-out]">
              "{encouragement}"
            </p>
          )}

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
