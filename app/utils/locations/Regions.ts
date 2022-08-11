export const RegionList: Record<string, [string, string]> = {
    'NA': ["North America", "North American"],
    'EU': ["Europe", "European"],
    'JP': ["Japan", "Japanese"],
    'OCE': ["Oceania", "Oceanic"],
    'CN': ["China", "Chinese"],
}

export type RegionsList = typeof RegionList

export const RegionsMap = () => {
    return new Map(Object.entries(RegionList));
}

export default RegionsMap;
