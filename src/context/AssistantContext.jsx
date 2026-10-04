import { createContext, useContext, useState } from 'react'

const AssistantContext = createContext(null)

export function AssistantProvider({ children }) {
  const [open, setOpen] = useState(false)
  return (
    <AssistantContext.Provider value={{ open, setOpen }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant() {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error('useAssistant must be used within AssistantProvider')
  return ctx
}
