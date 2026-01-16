import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

// Mock Remix components used by Sidebar
vi.mock('@remix-run/react', async () => {
  const React = await import('react')
  const NavLink = ({ to, className, children }: any) => {
    const isActive = false
    const cls = typeof className === 'function' ? className({ isActive }) : className
    return (
      <a href={to} className={cls} data-testid={`navlink-${to}`}>
        {typeof children === 'function' ? children({ isActive }) : children}
      </a>
    )
  }
  const Link = ({ to, children, className }: any) => (
    <a href={to} className={className} data-testid={`link-${to}`}>
      {children}
    </a>
  )
  const Form = ({ children, ...props }: any) => (
    <form {...props} data-testid="form">
      {children}
    </form>
  )
  const useMatches = () => [{ pathname: '/' }]
  const useLocation = () => ({ pathname: '/' })
  const useNavigate = () => () => {}
  const useNavigation = () => ({ state: 'idle' })
  return { NavLink, Link, Form, useMatches, useNavigate, useNavigation, useLocation }
})

import Sidebar from '../components/navigation/sidebar'

describe('Sidebar accordion UI', () => {
  it('expands FFXIV group and shows a known link', async () => {
    render(
      <Provider store={store}>
        <Sidebar
          data={{
            site_name: 'Saddlebag',
            data_center: 'Aether',
            world: 'Midgardsormr',
            wowRealm: { name: 'Area 52', id: 3675 },
            wowRegion: 'NA'
          }}>
          <div />
        </Sidebar>
      </Provider>
    )

    const ffxivButton = screen.getByRole('button', { name: 'Final Fantasy XIV' })
    fireEvent.click(ffxivButton)

    // One of the links expected under the FFXIV group
    expect(screen.getByTestId('navlink-ffxiv/best-deals/recommended')).toBeDefined()
  })

  it('expands WoW group and shows a known link', async () => {
    render(
      <Provider store={store}>
        <Sidebar
          data={{
            site_name: 'Saddlebag',
            data_center: 'Aether',
            world: 'Midgardsormr',
            wowRealm: { name: 'Area 52', id: 3675 },
            wowRegion: 'NA'
          }}>
          <div />
        </Sidebar>
      </Provider>
    )

    const wowButtons = screen.getAllByRole('button', { name: 'World of Warcraft' })
    fireEvent.click(wowButtons[0])

    expect(screen.getByTestId('navlink-/wow/best-deals/recommended')).toBeDefined()
  })
})
