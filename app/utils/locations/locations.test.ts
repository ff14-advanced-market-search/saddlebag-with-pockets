import {DataCentersOfRegion} from "./index";

test('DataCentersOfRegion returns a data center array', () => {
    expect(DataCentersOfRegion('OCE')).toEqual([{
        name: 'Materia',
    },]);
})
