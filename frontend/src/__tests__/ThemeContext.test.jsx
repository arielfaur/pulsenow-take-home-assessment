import { render, screen } from '@testing-library/react'
import { act } from 'react';
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext.jsx'

const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <button type="button" onClick={toggleTheme}>
      {theme}
    </button>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('hydrates theme from localStorage and toggles persisted value', async () => {
    window.localStorage.setItem('pulse-theme', 'dark')
    await act(async () => {
      render(
        <ThemeProvider>
          <ThemeConsumer />
        </ThemeProvider>
      )
    })

    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    const user = userEvent.setup()
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /dark/i }))
    })

    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('pulse-theme')).toBe('light')
  })
})
