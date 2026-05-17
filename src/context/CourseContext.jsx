import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import lessonsData from '../data/lessons.json'
import { useAuth } from './AuthContext.jsx'

const CourseContext = createContext(null)
const STORAGE_KEY = 'ai-lab-portal-course'

const ALL_COURSES = lessonsData.courses || []

export function CourseProvider({ children }) {
  const { user } = useAuth()

  // Course access by user level:
  //   advanced (or admin) → basic + advanced
  //   anything else       → basic only
  const courses = useMemo(() => {
    const level = (user?.level || 'basic').toLowerCase()
    const seesAdvanced = level === 'advanced' || level === 'admin' || user?.isAdmin
    return seesAdvanced ? ALL_COURSES : ALL_COURSES.filter((c) => c.id === 'basic')
  }, [user])

  const [course, setCourseState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return saved
    } catch {
      /* ignore */
    }
    return ALL_COURSES[0]?.id || 'basic'
  })

  // Keep the selection within what the user is allowed to see.
  useEffect(() => {
    if (!courses.some((c) => c.id === course)) {
      setCourseState(courses[0]?.id || 'basic')
    }
  }, [courses, course])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, course)
  }, [course])

  const setCourse = (id) => {
    if (courses.some((c) => c.id === id)) setCourseState(id)
  }

  const activeCourse = courses.some((c) => c.id === course) ? course : (courses[0]?.id || 'basic')

  // Lessons belonging to the active course (track field; falls back to "basic")
  const lessons = useMemo(
    () => lessonsData.lessons.filter((l) => (l.track || 'basic') === activeCourse),
    [activeCourse]
  )

  const currentCourse = courses.find((c) => c.id === activeCourse) || courses[0]

  return (
    <CourseContext.Provider
      value={{ course: activeCourse, setCourse, courses, currentCourse, lessons }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export const useCourse = () => useContext(CourseContext)
