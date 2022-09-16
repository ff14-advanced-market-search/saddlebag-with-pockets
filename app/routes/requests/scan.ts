type ScanArguments = {
    "preferred_roi": number, // preferred return on investment
    "min_profit_amount": number, // minimum profit amount
    "min_desired_avg_ppu": number, // Minimum desired, average price per unit
    "min_stack_size": number, // Minimum stack size
    "hours_ago": number, // Hours ago
    "min_sales": number, // Minimum number of sales
    "hq": boolean, // High quality
    "home_sever": string, // Home server
    "filters": number, // Filters, see [docs]
    "region_wide": boolean, // changes servers to search
    "include_vendor": boolean, // Include vendor price comparisons
    "show_out_stock": boolean, // Include out of stock data
    "universalis_list_uid": string // just search ids on this list
}

const defaultArguments = () =>
    {
        return {'f': 'f'};
    };
export const Scan = (args: ScanArguments) =>
    {
        const loadDefault = {
            ...args, ...defaultArguments(),
        };
    };
