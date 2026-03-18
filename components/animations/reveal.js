"use client"
import { useEffect, useState, useRef } from 'react'

const useReveal = (delay = 0, space = 10) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.unobserve(ref.current)
      }
    }, { threshold: 0.1 })

    observer.observe(ref.current)
    return () => { observer.disconnect(); }
  }, [])

  const className = `transition-all duration-700 ease-out ${
    visible ? 'opacity-100' : 'opacity-0'
  }`

  const style = {
    transitionDelay: `${delay}ms`,
    transform: visible ? 'translateY(0)' : `translateY(${space * 4}px)`
  }

  const opacity = {    
  transitionDelay: `${delay}ms`,
  transform: visible ? 'scale(1.02)' : 'scale(0.95)',
  transition: `opacity 400ms ease-out ${delay}ms, transform 500ms ease-out ${delay + 100}ms `
  }

  return { ref, visible, opacity, className, style }
}

export default useReveal