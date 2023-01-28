import Highcharts from 'highcharts'
import addHighchartsTreemap from 'highcharts/modules/treemap'
import HighchartsReact from 'highcharts-react-official'

export interface TreemapNode {
  id: string
  name: string
  value?: number
  color?: string
  parent?: string
  toolTip: string
}

const TreemapChart = ({
  chartData,
  title
}: {
  chartData: Array<TreemapNode>
  title: string
}) => {
  addHighchartsTreemap(Highcharts)

  const options = {
    title: { text: title },
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
