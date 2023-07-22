import { expect, test } from 'vitest'
import { DataCentersOfRegion, WorldsOfDataCenter } from './index'
import { DataCenterNotFoundException, RegionNotFoundException } from './Errors'

test('DataCentersOfRegion returns a data center array', () => {
  expect(DataCentersOfRegion('OCE')).toStrictEqual([
    {
      name: 'Materia'
    }
  ])
})

test('DataCentersOfRegion throws RegionNotFoundException', () => {
  expect(() => {
    DataCentersOfRegion('NOT-REAL-REGION')
  }).toThrow(RegionNotFoundException)
})

test('WorldsOfDataCenter returns a world array', () => {
  expect(WorldsOfDataCenter('Mana')).toStrictEqual([
    {
      name: 'Anima'
    },
    {
      name: 'Asura'
    },
    {
      name: 'Chocobo'
    },
    {
      name: 'Hades'
    },
    {
      name: 'Ixion'
    },
    {
      name: 'Masamune'
    },
    {
      name: 'Pandaemonium'
    },
    {
      name: 'Titan'
    }
  ])
})

test('WorldsOfDataCenter throws DataCenterNotFoundException', () => {
  expect(() => {
    WorldsOfDataCenter('Something about hot dogs')
  }).toThrow(DataCenterNotFoundException)
})
