import { ECivilStatus, TFormValues } from '@ui/Form/types';
import { getIRSTaxScale } from './getIRSTaxScale';
import { getSalaryRanks, TGetSalaryRanks } from './getSalaryRank';

export enum EIRSOperation {
    PAY = 'pay',
    RECEIVE = 'receive',
    INITIAL = 'initial',
    ERROR = 'error'
}

export type TIRSPrediction = {
    operation: `${EIRSOperation}`;
    amount?: number;
}

type TCalculateIRS = {
    irsTable: TGetSalaryRanks['irsTable'],
    formValues: TFormValues
}

function calculateIRS({ formValues, irsTable }: TCalculateIRS): TIRSPrediction {
    if (formValues.salary.first === 0) {
        return { operation: 'error' }
    }

    const isMarried = formValues.civilStatus === ECivilStatus.MARRIED

    const fiscalMonths = 14;
    const specificDeductions = isMarried ? 4104 * 2 : 4104;

    
    const annualSalaryBase = (formValues.salary.first + formValues.salary.second) * fiscalMonths;
    const annualSalaryMinusSpecifics = annualSalaryBase - specificDeductions;
    
    const yearlyIRSPaid = getSalaryRanks({ formValues, irsTable }) * fiscalMonths;
    const annualSalary = isMarried ? annualSalaryMinusSpecifics / 2 : annualSalaryMinusSpecifics;


    const { tax: irsTax, deductable: irsDeductable } = getIRSTaxScale(annualSalary)

    const baseColectables = (annualSalary * irsTax) - irsDeductable;
    const colectables = isMarried ? baseColectables * 2 : baseColectables;
    const liquidColectables = colectables - formValues.predictedDeductions;
    const estimatedIRS = yearlyIRSPaid - liquidColectables;

    return estimatedIRS > 0 ?
        { operation: EIRSOperation.RECEIVE, amount: Number(estimatedIRS.toFixed(2)) } :
        { operation: EIRSOperation.PAY, amount: Number(Math.abs(estimatedIRS).toFixed(2)) };
}

export { calculateIRS }