type ScanArguments = {
    // preferred return on investment
    "preferred_roi": number, // minimum profit amount
    "min_profit_amount": number, // Minimum desired, average price per unit
    "min_desired_avg_ppu": number, // Minimum stack size
    "min_stack_size": number, // Hours ago
    "hours_ago": number, // Minimum number of sales
    "min_sales": number, // High quality
    "hq": boolean, // Home server
    "home_sever": string, // Filters, see [docs]
    "filters": number, // Same ... data center? only
    "region_wide": boolean, // Include vendor something something
    "include_vendor": boolean, // Include out of stock data
    "show_out_stock": boolean


}

const defaultArguments = () =>
    {
        return {'f': 'f'}
    }
export const Scan = (args: ScanArguments) =>
    {
        const loadDefault = {
            ...args, ...defaultArguments()
        }
    }
