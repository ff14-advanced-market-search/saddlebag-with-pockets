// @vitest-environment jsdom
import { act } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubmitButton } from './form/SubmitButton'
import FullTable from './Tables/FullTable'
import type { ColumnList } from './Tables/FullTable'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function render(node: ReactNode) {
  act(() => root.render(node))
}

/** Simulate translation replacing the text nodes React originally rendered. */
function translateText(element: Element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)
  for (const text of textNodes) {
    if (!text.data.trim()) continue
    const outer = document.createElement('font')
    const inner = document.createElement('font')
    inner.textContent = `Translated: ${text.data}`
    outer.append(inner)
    text.replaceWith(outer)
  }
}

describe('search buttons after browser translation', () => {
  it.each(['title', 'children'])(
    'can add and remove the loading spinner beside a translated %s',
    (labelType) => {
      const onClick = vi.fn()
      const button = (loading: boolean) => (
        <SubmitButton
          title={labelType === 'title' ? 'Search' : undefined}
          onClick={onClick}
          loading={loading}>
          {labelType === 'children' ? 'Search' : undefined}
        </SubmitButton>
      )
      render(button(false))
      const element = container.querySelector('button')!
      translateText(element)

      expect(() => render(button(true))).not.toThrow()
      expect(element.disabled).toBe(true)
      expect(element.querySelector('svg')).not.toBeNull()
      expect(element.textContent).toBe('Translated: Search')
      expect(() => render(button(false))).not.toThrow()
      expect(element.disabled).toBe(false)
      expect(element.querySelector('svg')).toBeNull()
      act(() => element.click())
      expect(onClick).toHaveBeenCalledOnce()
      expect(console.error).not.toHaveBeenCalled()
    }
  )
})

interface MarketRow {
  name: string
  value: number
}

const rows: MarketRow[] = [
  { name: 'First item', value: 10 },
  { name: 'Second item', value: 20 }
]
const sorting = [{ id: 'value' as const, desc: true }]

describe('table cells after browser translation', () => {
  it.each([false, true])(
    'can rerender, sort, and filter translated default cells (dataAccessor=%s)',
    (useDataAccessor) => {
      const columns: Array<ColumnList<MarketRow>> = [
        { columnId: 'name', header: 'Name' },
        {
          columnId: 'value',
          header: 'Value',
          ...(useDataAccessor
            ? { dataAccessor: (row: MarketRow) => row.value }
            : {})
        }
      ]
      const table = (filter = '', data = rows) => (
        <FullTable
          data={data}
          sortingOrder={sorting}
          columnList={columns}
          globalFilter={filter}
        />
      )
      render(table())
      expect(container.querySelector('tbody tr')?.textContent).toContain(
        'Second item'
      )
      translateText(container.querySelector('table')!)

      // FullTable recreates its cell renderers on a parent update. React must
      // remove elements it still owns, rather than translated-away text nodes.
      expect(() => render(table())).not.toThrow()
      expect(container.querySelectorAll('tbody tr')).toHaveLength(2)
      const heading = container.querySelectorAll('th')[1]
      expect(() => act(() => (heading as HTMLElement).click())).not.toThrow()
      expect(container.querySelector('tbody tr')?.textContent).toContain(
        'First item'
      )
      expect(() => render(table('First'))).not.toThrow()
      expect(container.querySelectorAll('tbody tr')).toHaveLength(1)
      expect(container.querySelector('tbody')?.textContent).toContain(
        'First item'
      )
      translateText(container.querySelector('tbody')!)
      expect(() =>
        render(
          table(
            'First',
            rows.map((row) => ({ ...row, value: row.value + 1 }))
          )
        )
      ).not.toThrow()
      expect(container.querySelector('tbody tr')?.textContent).toContain('11')
      expect(() => render(table('', []))).not.toThrow()
      expect(container.querySelectorAll('tbody tr')).toHaveLength(0)
      expect(console.error).not.toHaveBeenCalled()
    }
  )

  it('keeps custom cell renderers and null results working', () => {
    const columns: Array<ColumnList<MarketRow>> = [
      {
        columnId: 'name',
        header: 'Name',
        accessor: ({ row }) => <a href="/queries/full-scan">{row.name}</a>
      },
      { columnId: 'value', header: 'Value', accessor: () => null }
    ]
    const table = () => (
      <FullTable data={rows} sortingOrder={sorting} columnList={columns} />
    )
    render(table())
    translateText(container.querySelector('tbody')!)
    expect(() => render(table())).not.toThrow()
    expect(container.querySelectorAll('tbody a')).toHaveLength(2)
    expect(container.querySelector('tbody a')?.getAttribute('href')).toBe(
      '/queries/full-scan'
    )
    expect(
      container.querySelectorAll('tbody tr')[0].children[1].textContent
    ).toBe('')
    expect(console.error).not.toHaveBeenCalled()
  })
})
