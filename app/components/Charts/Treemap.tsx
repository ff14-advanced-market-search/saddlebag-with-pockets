import Highcharts from 'highcharts'
import addHighchartsTreemap from 'highcharts/modules/treemap'
import HighchartsReact from 'highcharts-react-official'

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
 *   - Ensures immutability of the rendered component through the 'immutable' prop.
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
  addHighchartsTreemap(Highcharts)

  const styles = darkMode
    ? {
        backgroundColor: backgroundColor ?? '#334155',
        color: 'white',
        hoverColor: '#f8f8f8'
      }
    : { backgroundColor }

  const options = {
    title: { text: title, style: { color: styles?.color } },
    chart: { backgroundColor: styles?.backgroundColor },
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
                textOutline: false
              }
            },
            borderWidth: 2
          }
        ],
        data: chartData,
        tooltip: {
          useHTML: true,
          pointFormat: '{point.toolTip}'
        }
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} immutable />
}

export default TreemapChart
