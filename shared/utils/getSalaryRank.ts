import { ECivilStatus, TFormValues } from '@ui/Form/types';

type TIRSTableEntry = {
    salary: number,
    dependents: number[]
}

export type TGetSalaryRanks = {
    formValues: TFormValues
    irsTable: {
        single: TIRSTableEntry[],
        married_one_income: TIRSTableEntry[],
        married_two_incomes: TIRSTableEntry[],
        single_handycap: TIRSTableEntry[],
        married_one_income_handycap: TIRSTableEntry[],
        married_two_incomes_handycap: TIRSTableEntry[],
    },
}

function getSalaryRanks({ formValues, irsTable }: TGetSalaryRanks): number {
    if (!formValues.handycap) {
        if (formValues.civilStatus === ECivilStatus.SINGLE) {
            const rank = irsTable.single.find(rank => formValues.salary.first <= rank.salary);
            const percentage = rank!.dependents[formValues.dependents];

            return formValues.salary.first * percentage;
        }

        if (formValues.civilStatus === ECivilStatus.MARRIED) {
            if (formValues.titulares === 1) {
                const totalSalary = formValues.salary.first + formValues.salary.second
                const rank = irsTable.married_one_income.find(rank => totalSalary <= rank.salary);
                const percentage = rank!.dependents[formValues.dependents];

                return totalSalary * percentage;
            }

            if (formValues.titulares === 2) {
                const rank1 = irsTable.married_two_incomes.find(rank => formValues.salary.first <= rank.salary);
                const rank2 = irsTable.married_two_incomes.find(rank => formValues.salary.second <= rank.salary);
                const percentage1 = rank1!.dependents[formValues.dependents];
                const percentage2 = rank2!.dependents[formValues.dependents];

                return (formValues.salary.first * percentage1) + (formValues.salary.second * percentage2);
            }
        }
    }
    if (formValues.handycap) {
        if (formValues.civilStatus === ECivilStatus.SINGLE) {
            const rank = irsTable.single_handycap.find(rank => formValues.salary.first <= rank.salary);
            const percentage = rank!.dependents[formValues.dependents];

            return formValues.salary.first * percentage;
        }

        if (formValues.civilStatus === ECivilStatus.MARRIED) {
            if (formValues.titulares === 1) {
                const totalSalary = formValues.salary.first + formValues.salary.second
                const rank = irsTable.married_one_income_handycap.find(rank => totalSalary <= rank.salary);
                const percentage = rank!.dependents[formValues.dependents];

                return totalSalary * percentage;
            }

            if (formValues.titulares === 2) {
                const rank1 = irsTable.married_two_incomes_handycap.find(rank => formValues.salary.first <= rank.salary);
                const rank2 = irsTable.married_two_incomes_handycap.find(rank => formValues.salary.second <= rank.salary);
                const percentage1 = rank1!.dependents[formValues.dependents];
                const percentage2 = rank2!.dependents[formValues.dependents];

                return (formValues.salary.first * percentage1) + (formValues.salary.second * percentage2);
            }
        }
    }
    return 0;
}

export { getSalaryRanks }