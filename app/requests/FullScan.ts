import {address, UserAgent} from "~/requests/client/config";


interface IRuntimeForm {
    [key: string]: any;
}

export class RunTimeFullScanForm<T extends IRuntimeForm> {
    constructor(private form: T) {
    }

    public formData(): FormData {
        const form = new FormData();

        Object.keys(this.form).forEach((key) => {
            if (this.form[key] !== undefined) {
                form.append(key, this.form[key])
            }
        })

        return form;
    }
}

export type FullScanFields = {
    scan_hours: number
    sale_amount: number
    roi: number
    minimum_stack_size: number
    minimum_profit_amount: number
    price_per_unit: number
    world: string
};

// export const validator: Validator<FullScanFields> = withZod(z.object({
//     scan_hours: z.number().positive().min(1).max(128),
//     sale_amount: z.number().min(1),
//     roi: z.number().min(1),
//     minimum_stack_size: z.number().min(1),
//     minimum_profit_amount: z.number().min(1),
//     price_per_unit: z.number().min(1),
//     world: z.string()
// }));


export const remappedKeys = (fields: any, setDefaults = true) => {
    const map = setDefaults ? new Map(Object.entries(defaults)) : new Map();

    Array.from(fields as [string, string | boolean | number][]).map((field) => {
        let value = field[1];

        // checkboxes whyyyyyy
        if (value === 'on') {
            value = true;
        }
        if (!isNaN(parseInt(value as string))) {
            value = parseInt(value as string)
        }
        map.set(keyMap(field[0]), value);
        return field;
    });
    return map;
}


const keyMap: (key: string) => string = (key) => {
    switch (key) {
        case 'sale_amount':
            return 'min_sales';
        case 'world':
            return 'home_server';
        case 'minimum_stack_size':
            return 'min_stack_size';
        case 'hq_only':
            return 'hq';
        case 'minimum_profit_amount':
            return 'min_profit_amount';
        case 'price_per_unit':
            return 'min_desired_avg_ppu';
        case 'out_of_stock':
            return 'show_out_stock';
        case 'roi':
            return 'preferred_roi';
        case 'scan_hours':
            return 'hours_ago';
        default:
            // region_wide
            // include_vendor
            return key;

    }
}

const defaults = {
    'preferred_roi': 50,
    'min_profit_amount': 10000,
    'min_desired_avg_ppu': 10000,
    'min_stack_size': 1,
    'hours_ago': 24,
    "min_sales": 5,
    "hq": false,
    "home_server": "Midgardsormr",
    "filters": "all",
    "region_wide": false,
    "include_vendor": false,
    "show_out_stock": true
}

export type ResponseType = {
    "ROI": number, "avg_ppu": number, "home_server_price": number, "home_update_time": string, // @todo datetime
    "ppu": number, "profit_amount": number, "profit_raw_percent": number, "real_name": string, "sale_rates": number, // @todo decimal
    "server": string, // @todo world / datacenter
    "stack_size": number, "update_time": string, // @todo datetime
    "url": string // @todo URL
}

const FullScanRequest: (map: Map<string, number | boolean | string>) => Promise<Response> = async (map) => {
    return fetch(`${address}/api/scan`, {
        'method': 'POST', headers: {
            "Content-Type": "application/json", "User-Agent": UserAgent
        }, body: JSON.stringify(Object.fromEntries(map.entries()))
    });
}

export default FullScanRequest;
