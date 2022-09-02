export const DataCenterList: Record<string, Array<{ name: string }>> = {
    "NA":  [
        {
            name: 'Aether',
        },
        {
            name: 'Primal',
        },
        {
            name: 'Crystal',
        },
    ],
    'EU':  [
        {
            name: 'Chaos',
        },
        {
            name: 'Light',
        },
    ],
    'JP':  [
        {
            name: 'Elemental',
        },
        {
            name: 'Gaia',
        },
        {
            name: 'Mana',
        },
        {
            name: 'Meteor',
        },
    ],
    'OCE': [
        {
            name: 'Materia',
        },
    ],
    'CN':  [
        {
            name: 'LuXingNiao',
        },
        {
            name: 'MoGuLi',
        },
        {
            name: 'MaoXiaoPang',
        },
        {
            name: 'DouDouChai',
        },
    ]
};
export type DataCentersList = typeof DataCenterList;

export const DataCentersMap: Map<string, Array<{ name: string }>> = new Map(Object.entries(DataCenterList));

export const DataCenterArray = Array.from(DataCentersMap).map((w) => w[1]).flatMap((item) =>
{
    return item;
}).map((item) =>
{
    return item.name;
});

export default DataCentersMap;
