import { TFormValues } from "@ui/Form/types";

export const initialState = {
    civilStatus: null,
    salary: {
        first: 0,
        second: 0
    },
    handycap: false,
    dependents: 0,
    predictedDeductions: 0,
    titulares: null
} as TFormValues;
