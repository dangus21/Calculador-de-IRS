import React, { useCallback, useReducer, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@ui/Button/Button'
import { calculateIRS, EIRSOperation, TIRSPrediction } from '@utils/calculateIRS';
import { initialState } from 'shared/constants';
import { renderFieldElement } from './renderFieldElement';
import { TForm, TFieldIds } from './types';
import { reducer } from './formReducer';
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function Form(props: TForm) {
    const [formValues, dispatch] = useReducer(reducer, initialState)
    const [errors, setErrors] = useState({})
    const [prediction, setPrediction] = useState<TIRSPrediction>({ operation: EIRSOperation.INITIAL, amount: 0 })
    const { data } = useSWR('/api/data/taxScale', fetcher)
    const operationResult = {
        ...(prediction.operation === EIRSOperation.PAY && {
            color: 'text-red-500',
            text: 'Pagar'
        }),
        ...(prediction.operation === EIRSOperation.RECEIVE && {
            color: 'text-green-500',
            text: 'Pagar'
        }),
        ...(prediction.operation === EIRSOperation.ISENT && {
            color: 'text-gray-500',
            text: 'Isento'
        })
    }

    const validateForm = useCallback(
        () => {
            const scopedErrors = {} as any;
            if (!formValues[TFieldIds.CIVILSTATUS]) {
                scopedErrors[TFieldIds.CIVILSTATUS] = true
            }

            if (formValues[TFieldIds.CIVILSTATUS] && !formValues[TFieldIds.TITULARES]) {
                scopedErrors[TFieldIds.TITULARES] = true
            }

            console.log('LOG ~ file: Form.tsx ~ line 46 ~ formValues', formValues);
            if (formValues[TFieldIds.CIVILSTATUS] && (
                !formValues[TFieldIds.SALARY]?.first || !formValues[TFieldIds.SALARY]?.second
            )) {
                scopedErrors[TFieldIds.SALARY] = true
            }

            if (!formValues[TFieldIds.DEPENDENTS]) {
                scopedErrors[TFieldIds.DEPENDENTS] = true
            }

            if (!formValues[TFieldIds.PREDICTED_DEDUCTIONS]) {
                scopedErrors[TFieldIds.PREDICTED_DEDUCTIONS] = true
            }

            setErrors(scopedErrors)

            const hasErrors = Object.entries(errors);

            if (!hasErrors) {
                setPrediction(calculateIRS({ irsTable: data, formValues }))
            }
        },
        [data, errors, formValues]
    )

    return (
        <section className="w-120 max-w-6xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 px-16">
            <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white mb-3">{props.title}</h2>
            <form>
                {props.fields.map((field) => (
                    <React.Fragment
                        key={JSON.stringify(field)}>
                        {renderFieldElement(field, formValues, errors, dispatch)}
                    </React.Fragment>
                ))}
                <div className="mt-6 flex">
                    <Button
                        onClick={validateForm}>
                        {props.saveText}
                    </Button>
                    {
                        prediction.operation !== 'error' && prediction.operation !== EIRSOperation.INITIAL ?
                            <div
                                className={
                                    clsx(
                                        operationResult.color,
                                        "mt-2 ml-3"
                                    )
                                }
                            >
                                <p>
                                    {operationResult.text}:&nbsp;
                                    <span
                                        className={
                                            clsx(
                                                operationResult.color,
                                                'font-bold'
                                            )
                                        }>
                                        {prediction.amount}€
                                    </span>
                                </p>
                            </div>
                            : null
                    }
                </div>
            </form>
        </section >
    )
}

export { Form }
