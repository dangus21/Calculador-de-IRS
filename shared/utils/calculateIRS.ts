import { ECivilStatus, TFormValues } from "@ui/Form/types";
import { initialState, MINIMUM_WAGE } from "shared/constants";
import { getIRSTaxScale } from "./getIRSTaxScale";
import { getSalaryRanks, TGetSalaryRanks } from "./getSalaryRank";

export enum EIRSOperation {
    PAY = "pay",
    RECEIVE = "receive",
    ISENT = "isent",
    INITIAL = "initial",
    ERROR = "error"
}

export type TIRSPrediction = {
    operation: `${EIRSOperation}`;
    amount?: number;
}

type TCalculateIRS = {
    irsTable: TGetSalaryRanks["irsTable"],
    formValues: TFormValues
}

function calculateIRS({ formValues = initialState, irsTable }: TCalculateIRS): TIRSPrediction {
    if (formValues?.salary?.first === 0) {
        return { operation: "error" }
    }

    const isMarried = formValues.civilStatus === ECivilStatus.MARRIED;
    const firstWage = formValues?.salary?.first ?? 0;
    const secondWage = formValues?.salary?.second ?? 0;
    const predictedDeductions = formValues?.predictedDeductions ?? 0;

    if (!isMarried && firstWage <= MINIMUM_WAGE) {
        return {
            operation: EIRSOperation.ISENT,
            amount: 0
        }
    }

    const fiscalMonths = 14;
    const specificDeductions = isMarried ? 4104 * 2 : 4104;


    const annualSalaryBase = (firstWage + secondWage) * fiscalMonths;
    const annualSalaryMinusSpecifics = annualSalaryBase - specificDeductions;

    const yearlyIRSPaid = getSalaryRanks({ formValues, irsTable }) * fiscalMonths;
    const annualSalary = isMarried ? annualSalaryMinusSpecifics / 2 : annualSalaryMinusSpecifics;


    const { tax: irsTax, deductable: irsDeductable } = getIRSTaxScale(annualSalary)

    const baseColectables = (annualSalary * irsTax) - irsDeductable;
    const colectables = isMarried ? baseColectables * 2 : baseColectables;
    const liquidColectables = colectables - predictedDeductions;
    const estimatedIRS = yearlyIRSPaid - liquidColectables;

    return estimatedIRS > 0 ?
        {
            operation: EIRSOperation.RECEIVE,
            amount: Number(estimatedIRS.toFixed(2))
        } :
        {
            operation: EIRSOperation.PAY,
            amount: Number(Math.abs(estimatedIRS).toFixed(2))
        };
}

export { calculateIRS }