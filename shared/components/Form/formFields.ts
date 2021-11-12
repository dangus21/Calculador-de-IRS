import { ECivilStatus, EFieldTypes, TFieldIds, TFormField } from "./types";

const fields = [
    {
        id: TFieldIds.CIVILSTATUS,
        title: 'Estado Civil',
        type: EFieldTypes.RADIO,
        options: [
            {
                id: ECivilStatus.SINGLE,
                title: 'Solteiro/a',
                type: 'checkbox'
            },
            {
                id: ECivilStatus.MARRIED,
                title: 'Casado/a',
                type: 'checkbox'
            }
        ]
    },
    {
        id: TFieldIds.TITULARES,
        title: 'Titulares',
        type: EFieldTypes.RADIO_CONDITIONAL,
        conditions: [
            {
                field: TFieldIds.CIVILSTATUS,
                value: ECivilStatus.MARRIED
            }
        ],
        options: [
            {
                id: '1',
                title: '1',
                type: 'checkbox'
            },
            {
                id: '2',
                title: '2',
                type: 'checkbox'
            }
        ]
    },
    {
        id: TFieldIds.SALARY,
        title: 'Salário Base Bruto',
        type: EFieldTypes.NUMBER,
        conditions: [
            {
                field: TFieldIds.TITULARES
            }
        ],
        options: [
            {
                id: 'first',
                title: 'Primeiro/a Titular'
            },
            {
                id: 'second',
                title: 'Segundo/a Titular'
            }
        ]
    },
    {
        id: TFieldIds.DEPENDENTS,
        title: 'Dependentes',
        type: EFieldTypes.RADIO,
        options: [
            {
                id: '0',
                title: '0',
                type: 'checkbox'
            },
            {
                id: '1',
                title: '1',
                type: 'checkbox'
            },
            {
                id: '2',
                title: '2',
                type: 'checkbox'
            },
            {
                id: '3',
                title: '3',
                type: 'checkbox'
            },
            {
                id: '4',
                title: '4',
                type: 'checkbox'
            },
            {
                id: '5',
                title: '5 ou mais',
                type: 'checkbox'
            }
        ]
    },
    {
        id: TFieldIds.HANDYCAP,
        title: 'Deficiente',
        type: EFieldTypes.BOOLEAN
    },
    {
        id: TFieldIds.PREDICTED_DEDUCTIONS,
        title: 'Deduções Previstas',
        type: EFieldTypes.NUMBER
    }
] as TFormField[]

export { fields };