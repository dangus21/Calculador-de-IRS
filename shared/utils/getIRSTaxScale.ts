import { irsTaxScale } from './irsTables/irsTaxScale';
type TIRSScale = {
    tax: number,
    deductable: number,
}

function getIRSTaxScale(collectableIncome: number): TIRSScale {
    if (collectableIncome > 80882) {
        return { tax: 0.480, deductable: 8401.21 }
    }

    const taxScale = irsTaxScale.find(rank => collectableIncome <= rank.salary);

    return { tax: taxScale!.tax, deductable: taxScale!.deductable };
}

export { getIRSTaxScale }