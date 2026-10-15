import Highcharts from 'highcharts'
import addHighchartsTreemap from 'highcharts/modules/treemap'
import HighchartsReact from 'highcharts-react-official'
import { memo, useEffect, useMemo, useRef } from 'react'
import { observeContainerWidth } from './observeContainerWidth'

const CHART_HEIGHT = 400
const CONTAINER_PROPS = {
  style: { width: '100%', minWidth: 0, height: CHART_HEIGHT }
}

// Initialize the treemap module at the module level
if (typeof window !== 'undefined') {
  try {
    addHighchartsTreemap(Highcharts)
  } catch (error) {
    console.error(
      'Failed to initialize Highcharts treemap module:',
      error instanceof Error ? error.message : String(error)
    )
  }
}

export interface TreemapNode {
  id: string | number
  name: string
  value?: number
  color?: string
  parent?: string
  toolTip: string
}

/**
 * Renders a Highcharts treemap with customizable styles and options.
 * @example
 * renderTreemap(dataArray, 'Sample Title', true, '#000000')
 * Returns a HighchartsReact component configured with the specified treemap data and appearance.
 * @param {Array<TreemapNode>} chartData - Data for constructing the treemap.
 * @param {string} [title] - Optional title for the treemap.
 * @param {boolean} darkMode - Flag to determine if dark mode styles should be applied.
 * @param {string} [backgroundColor] - Optional background color for the chart.
 * @returns {JSX.Element} React component rendering the Highcharts treemap.
 * @description
 *   - Integrates Highcharts treemap with React via HighchartsReact component.
 *   - Applies different styles based on dark mode flag, affecting both background and text color.
 *   - Keeps chart height stable and schedules width changes outside resize callbacks.
 */
const TreemapChart = ({
  chartData,
  title,
  darkMode,
  backgroundColor
}: {
  chartData: Array<TreemapNode>
  title?: string
  darkMode: boolean
  backgroundColor?: string
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // HighchartsReact owns chart destruction. Our observer only owns resizing
    // the existing chart; a new options object must not rebuild its observers.
    return observeContainerWidth(container, (width) => {
      const chart = chartRef.current?.chart
      if (chart?.container && chart.chartWidth !== width) {
        chart.setSize(width, CHART_HEIGHT, false)
      }
    })
  }, [])

  const options = useMemo<Highcharts.Options>(
    () => ({
      title: { text: title, style: { color: darkMode ? 'white' : undefined } },
      chart: {
        backgroundColor: backgroundColor ?? (darkMode ? '#334155' : undefined),
        height: CHART_HEIGHT,
        reflow: false,
        animation: false,
        allowMutatingData: false
      },
      series: [
        {
          name: 'Overview',
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          allowDrillToNode: true,
          animation: false,
          shadow: false,
          dataLabels: {
            enabled: false
          },
          levels: [
            {
              level: 1,
              dataLabels: {
                enabled: false,
                style: {
                  textOutline: 'none'
                }
              },
              borderWidth: 2
            }
          ],
          // Highcharts may annotate treemap nodes; keep React-owned data intact.
          data: chartData.map((node) => ({ ...node, id: String(node.id) })),
          tooltip: {
            useHTML: true,
            pointFormat: '{point.toolTip}'
          }
        }
      ],
      credits: {
        enabled: false
      }
    }),
    [chartData, title, darkMode, backgroundColor]
  )

  return (
    <div ref={containerRef} style={CONTAINER_PROPS.style}>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        options={options}
        containerProps={CONTAINER_PROPS}
      />
    </div>
  )
}

export default memo(TreemapChart)
