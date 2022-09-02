export class LocationNotFoundException extends Error {
    name = 'Not Found Exception'

    constructor(name: string, type: "Region" | "DataCenter" | "World") {
        super(`[${name}] of type [${type}] not found.`)
    }
}

export class RegionNotFoundException extends LocationNotFoundException {
    name = 'Region Not Found Exception'

    constructor(name: string) {
        super(name, "Region")
    }
}

export class DataCenterNotFoundException extends LocationNotFoundException {
    name = 'Data Center Not Found Exception'

    constructor(name: string) {
        super(name, "DataCenter")
    }
}

export class WorldNotFoundException extends LocationNotFoundException {
    name = 'World Not Found Exception'

    constructor(name: string) {
        super(name, "World")
    }
}
