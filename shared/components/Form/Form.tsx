import { useReducer, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@ui/Button/Button'
import { calculateIRS, EIRSOperation, TIRSPrediction } from '@utils/calculateIRS';
import { initialState } from 'shared/constants';
import { renderFieldElement } from './renderFieldElement';
import { TForm } from './types';
import { reducer } from './formReducer';
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function Form(props: TForm) {
    const [formValues, dispatch] = useReducer(reducer, initialState)
    const [prediction, setPrediction] = useState<TIRSPrediction>({ operation: EIRSOperation.INITIAL, amount: 0 })
    const isOperationPay = prediction.operation === EIRSOperation.PAY;
    const { data } = useSWR('/api/data/taxScale', fetcher)

    return (
        <section className="w-120 max-w-6xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 px-16">
            <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">{props.title}</h2>
            <form>
                {props.fields.map((field) => (
                    <div key={JSON.stringify(field)}>{renderFieldElement(field, formValues, dispatch)}</div>
                ))}
                <div className="mt-6 flex">
                    <Button onClick={() => setPrediction(calculateIRS({ irsTable: data, formValues }))}>{props.saveText}</Button>
                    {
                        prediction.operation !== 'error' && prediction.operation !== EIRSOperation.INITIAL ?
                            <div
                                className={
                                    clsx(
                                        isOperationPay ? 'text-red-500' : 'text-green-500',
                                        "mt-2 ml-3"
                                    )
                                }
                            >
                                <p>
                                    {isOperationPay ? 'Pagar: ' : 'Receber: '}
                                    <span
                                        className={
                                            clsx(
                                                isOperationPay ?
                                                    'text-red-600' :
                                                    'text-green-600',
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
