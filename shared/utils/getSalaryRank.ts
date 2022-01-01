import { ECivilStatus, TFormValues } from "@ui/Form/types";

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
    const firstWage = formValues?.salary?.first ?? 0;
    const secondWage = formValues?.salary?.second ?? 0;
    const dependents = formValues?.dependents ?? 0;

    if (!formValues.handycap) {
        if (formValues.civilStatus === ECivilStatus.SINGLE) {
            const rank = irsTable.single.find(rank => firstWage <= rank.salary);
            const percentage = rank!.dependents[dependents];

            return firstWage * percentage;
        }

        if (formValues.civilStatus === ECivilStatus.MARRIED) {
            if (formValues.titulares === 1) {
                const totalSalary = firstWage + secondWage
                const rank = irsTable.married_one_income.find(rank => totalSalary <= rank.salary);
                const percentage = rank!.dependents[dependents];

                return totalSalary * percentage;
            }

            if (formValues.titulares === 2) {
                const rank1 = irsTable.married_two_incomes.find(rank => firstWage <= rank.salary);
                const rank2 = irsTable.married_two_incomes.find(rank => secondWage <= rank.salary);
                const percentage1 = rank1!.dependents[dependents];
                const percentage2 = rank2!.dependents[dependents];

                return (firstWage * percentage1) + (secondWage * percentage2);
            }
        }
    }
    if (formValues.handycap) {
        if (formValues.civilStatus === ECivilStatus.SINGLE) {
            const rank = irsTable.single_handycap.find(rank => firstWage <= rank.salary);
            const percentage = rank!.dependents[dependents];

            return firstWage * percentage;
        }

        if (formValues.civilStatus === ECivilStatus.MARRIED) {
            if (formValues.titulares === 1) {
                const totalSalary = firstWage + secondWage
                const rank = irsTable.married_one_income_handycap.find(rank => totalSalary <= rank.salary);
                const percentage = rank!.dependents[dependents];

                return totalSalary * percentage;
            }

            if (formValues.titulares === 2) {
                const rank1 = irsTable.married_two_incomes_handycap.find(rank => firstWage <= rank.salary);
                const rank2 = irsTable.married_two_incomes_handycap.find(rank => secondWage <= rank.salary);
                const percentage1 = rank1!.dependents[dependents];
                const percentage2 = rank2!.dependents[dependents];

                return (firstWage * percentage1) + (secondWage * percentage2);
            }
        }
    }
    return 0;
}

export { getSalaryRanks }