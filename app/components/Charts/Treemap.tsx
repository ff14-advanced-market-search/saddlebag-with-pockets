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
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        allowDrillToNode: true,
        dataLabels: {
          enabled: false
        },
        levels: [
          {
            level: 1,
            dataLabels: {
              enabled: true,
              style: {
                textOutline: false
              }
            },
            borderWidth: 1
          }
        ],
        data: chartData,
        tooltip: {
          useHTML: true,
          pointFormat: '<p>{point.toolTip}</p>'
        }
      }
    ],
    credits: {
      enabled: false
    }
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default TreemapChart
