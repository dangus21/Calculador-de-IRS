import { TFormValues } from "@ui/Form/types";

export const initialState = {
    civilStatus: null,
    salary: {
        first: null,
        second: null
    },
    handycap: false,
    dependents: null,
    predictedDeductions: null,
    titulares: null
} as TFormValues;

export const MINIMUM_WAGE = 705;