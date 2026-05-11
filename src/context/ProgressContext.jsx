import { createContext, useContext, useEffect, useState } from 'react'

const ProgressContext = createContext(null)
const STORAGE_KEY = 'ai-lab-portal-progress'

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  const isCompleted = (id) => completed.includes(id)

  const toggleCompleted = (id) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const reset = () => setCompleted([])

  return (
    <ProgressContext.Provider value={{ completed, isCompleted, toggleCompleted, reset }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => useContext(ProgressContext)
