export enum EFieldTypes {
    TEXT = "text",
    NUMBER = "number",
    BOOLEAN = "boolean",
    CHECKBOX = "checkbox",
    MULTIPLE = "multiple",
    RADIO_CONDITIONAL = "radio_conditional",
    RADIO = "radio",
    SALARY = "salary",
}

export enum EValueTypes {
    GENERIC = "generic",
}

export enum TFieldIds {
    SALARY = "salary",
    CIVILSTATUS = "civilStatus",
    HANDYCAP = "handycap",
    DEPENDENTS = "dependents",
    PREDICTED_DEDUCTIONS = "predictedDeductions",
    TITULARES = "titulares",
}

export type TFormconditionsMultiple = {
    field: `${TFieldIds}`;
    value: any;
}[]


export type TFormField = {
    id: keyof TFormValues;
    title: string;
    type: `${EFieldTypes}`;
    options?: TFormField[];
    conditions?: TFormconditionsMultiple;
};

export type TForm = {
    children?: React.ReactNode;
    title: string;
    saveText: string;
    fields: TFormField[];
};

export type TFormValues = {
    salary: { first: number | null, second: number | null };
    civilStatus: `${ECivilStatus}` | null;
    handycap: boolean;
    dependents: number | null;
    predictedDeductions: number | null;
    titulares: 1 | 2 | null;
};

export enum ECivilStatus {
    SINGLE = "single",
    MARRIED = "married",
}

type GenericValue = {
    id: "generic";
    value: string | number | boolean;
};

type MultipleValue = {
    id: string;
    value: string | number;
};


export type TReducer = {
    state: TFormValues;
    action: {
        type: TFormField["title"];
        content: GenericValue | MultipleValue;
        case?: string;
    }
};