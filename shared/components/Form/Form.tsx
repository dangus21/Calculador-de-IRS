import React, { useCallback, useEffect, useReducer, useState } from "react";
import clsx from "clsx";
import { Button } from "@chakra-ui/react"
import { calculateIRS, EIRSOperation, TIRSPrediction } from "@utils/calculateIRS";
import { initialState } from "shared/constants";
import { renderFieldElement } from "./renderFieldElement";
import { TForm, TFieldIds, ECivilStatus } from "./types";
import { reducer } from "./formReducer";
import useSWR from "swr"
import { useLocalStorage } from "@utils/useLocalStorage";

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function Form(props: TForm) {
    const [formValues, dispatch] = useReducer(reducer, initialState)
    const [errors, setErrors] = useState({})
    const [prediction, setPrediction] = useState<TIRSPrediction>({ operation: EIRSOperation.INITIAL, amount: 0 })
    const [irsTable, setIrsTable] = useLocalStorage("irsTable", undefined)
    const { data } = useSWR("/api/data/taxScale", !irsTable ? fetcher : null)

    useEffect(() => {
        if (data) {
            setIrsTable(JSON.stringify(data))
        }
    }, [setIrsTable, data])

    const operationResult = {
        ...(prediction.operation === EIRSOperation.PAY && {
            color: "text-red-500",
            text: "Pagar"
        }),
        ...(prediction.operation === EIRSOperation.RECEIVE && {
            color: "text-green-500",
            text: "Receber"
        }),
        ...(prediction.operation === EIRSOperation.ISENT && {
            color: "text-gray-500",
            text: "Isento"
        })
    }

    const validateForm = useCallback(() => {
        const scopedErrors = {} as any;
        if (formValues[TFieldIds.CIVILSTATUS] === null) {
            scopedErrors[TFieldIds.CIVILSTATUS] = true
        }

        if (formValues[TFieldIds.CIVILSTATUS] === ECivilStatus.SINGLE && (
            formValues[TFieldIds.SALARY]?.first === null
        )) {
            scopedErrors[TFieldIds.SALARY] = true
        }

        if (formValues[TFieldIds.CIVILSTATUS] === ECivilStatus.MARRIED) {
            if (formValues[TFieldIds.TITULARES] === null) {
                scopedErrors[TFieldIds.TITULARES] = true
            }
            if (formValues[TFieldIds.TITULARES] === 1) {
                if (formValues[TFieldIds.SALARY]?.first === null) {
                    scopedErrors[TFieldIds.SALARY] = true
                }
            }
            if (formValues[TFieldIds.TITULARES] === 2) {
                if (
                    formValues[TFieldIds.SALARY]?.first === null ||
                    formValues[TFieldIds.SALARY]?.second === null
                ) {
                    scopedErrors[TFieldIds.SALARY] = true
                }
            }
        }

        if (formValues[TFieldIds.DEPENDENTS] === null) {
            scopedErrors[TFieldIds.DEPENDENTS] = true
        }

        if (formValues[TFieldIds.PREDICTED_DEDUCTIONS] === null) {
            scopedErrors[TFieldIds.PREDICTED_DEDUCTIONS] = true
        }

        setErrors(scopedErrors)

        const hasErrors = Object.entries(scopedErrors).length;

        if (!hasErrors) {
            setPrediction(calculateIRS({ irsTable: JSON.parse(irsTable), formValues }))
        }
    },
        [irsTable, formValues]
    )

    return (
        <section className="w-120 max-w-6xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 px-16">
            <h2 className="text-xl font-semibold text-gray-700 capitalize dark:text-white mb-3">{props.title}</h2>
            <form>
                {props.fields.map((field) => (
                    <React.Fragment
                        key={JSON.stringify(field)}>
                        {
                            renderFieldElement(field, formValues, errors, dispatch)
                        }
                    </React.Fragment>
                ))}
                <div className="mt-6 flex">
                    <Button colorScheme='blue' onClick={validateForm}>
                        {props.saveText}
                    </Button>
                    {
                        !Object.entries(errors).length &&
                            prediction.operation !== "error" &&
                            prediction.operation !== EIRSOperation.INITIAL ?
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
                                                "font-bold"
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
