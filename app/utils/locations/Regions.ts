export const RegionList: Record<string, [string, string]> = {
    'NA': ["North America", "North American"],
    'EU': ["Europe", "European"],
    'JP': ["Japan", "Japanese"],
    'OCE': ["Oceania", "Oceanic"],
    'CN': ["China", "Chinese"],
}


export const RegionsMap = new Map(Object.entries(RegionList));


export default RegionsMap;
