import type {AxiosResponse} from "axios";
import axios from "axios";
import type {Validator} from "remix-validated-form";
import {withZod} from "@remix-validated-form/with-zod";
import {z} from "zod";
import {address} from "~/requests/client/config";


interface IRuntimeForm {
    [key: string]: any;
}

export class RunTimeFullScanForm<T extends IRuntimeForm> {
    constructor(private form: T) {}

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
};

export const validator: Validator<FullScanFields> = withZod(z.object({
    scan_hours: z.number().positive().min(1).max(128),
    sale_amount: z.number().min(1),
    roi: z.number().min(1),
    minimum_stack_size: z.number().min(1)
}));

const FullScanRequest: (args: RunTimeFullScanForm<FullScanFields>) => Promise<AxiosResponse> = async (args) => {
    return axios.post(`${address}/api/scan`, Object.fromEntries(args.formData()), {
        headers: {
            // "Content-Type": "application/json",
            "User-Agent": "Saddlebag/1.0"
        }
    });
}

export default FullScanRequest;
