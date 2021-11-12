import { Dispatch } from 'react';
import { CheckBox, Radio, Toggle } from '@ui/Button'
import { ECivilStatus, EFieldTypes, EValueTypes, TFieldIds, TFormconditionsMultiple, TFormField, TFormValues, TReducer } from './types';
import { Indented } from '@ui/Indented';
import { Label } from '@ui/Label';
import { Field } from '@ui/Label copy';

function adaptValue(event: HTMLInputElement['value']) {
    return Number.isNaN(Number(event)) ? event : Number(event);
}

function validateconditions(form: TFormValues, conditions: TFormconditionsMultiple = []) {
    const validation = conditions.every(conditions => {
        return form[conditions.field] === conditions.value;
    });

    return validation;
}

function renderSalaryField(field: TFormField, formValues: TFormValues, dispatch: Dispatch<TReducer['action']>) {
    if (formValues.civilStatus) {
        return (
            <Field>
                <Label id={field.id} title={field.title} />
                <Indented>
                    {
                        formValues.civilStatus === ECivilStatus.MARRIED && formValues.titulares === 2 ?
                            (
                                (field.options || []).map(option => (
                                    <div key={JSON.stringify(option)}>
                                        <Label id={option.id} title={option.title} small />
                                        <input
                                            key={JSON.stringify(option)}
                                            onChange={({ currentTarget }) => {
                                                return dispatch({
                                                    type: field.id,
                                                    content: {
                                                        id: option.id,
                                                        value: adaptValue(currentTarget.value)
                                                    },
                                                    case: field.id
                                                });
                                            }}
                                            id={field.id}
                                            type={field.type}
                                            className="block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    </div>
                                ))
                            ) :
                            (
                                <div>
                                    <Label id={field.id} title={field.title} small />
                                    <input
                                        key={JSON.stringify(field)}
                                        onChange={({ currentTarget }) => {
                                            return dispatch({
                                                type: field.id,
                                                content: {
                                                    id: 'first',
                                                    value: adaptValue(currentTarget.value)
                                                },
                                                case: field.id
                                            });
                                        }}
                                        id={field.id}
                                        type={field.type}
                                        className="block px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                </div>
                            )
                    }
                </Indented>
            </Field>
        )
    }
}

function renderFieldElement(field: TFormField, formValues: TFormValues, dispatch: Dispatch<TReducer['action']>) {
    if (field.id === TFieldIds.SALARY) {
        return renderSalaryField(field, formValues, dispatch)
    }

    if (field.type === EFieldTypes.NUMBER || field.type === EFieldTypes.TEXT) {
        return (
            <Field>
                <Label id={field.id} title={field.title} />
                <div>
                    <input
                        onChange={({ currentTarget }) => {
                            return dispatch({
                                type: field.id,
                                content: { id: EValueTypes.GENERIC, value: adaptValue(currentTarget.value) }
                            });
                        }}
                        id={field.id}
                        type={field.type}
                        className="block px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                </div>
            </Field>
        );
    }

    if (field.type === EFieldTypes.BOOLEAN) {
        return (
            <Field>
                <Label id={field.id} title={field.title} />
                <Indented classes="toggleGroup">
                    <Toggle
                        onClick={isActive => {
                            return dispatch({
                                type: field.id,
                                content: { id: EValueTypes.GENERIC, value: isActive }
                            });
                        }}
                    />
                </Indented>
            </Field>
        )
    }

    if (field.type === EFieldTypes.CHECKBOX) {
        return (
            <Field>
                <Label id={field.id} title={field.title} />
                <Indented classes="checkboxGroup">
                    <CheckBox
                        onClick={isActive => {
                            return dispatch({
                                type: field.id,
                                content: { id: EValueTypes.GENERIC, value: adaptValue(isActive) }
                            });
                        }}
                    >
                        {field.title}
                    </CheckBox>
                </Indented>
            </Field>
        )
    }

    if (field.type === EFieldTypes.MULTIPLE) {
        return (
            <Field>
                <Label id={field.id} title={field.title} />
                {
                    (field.options || []).map(option => (
                        <CheckBox
                            key={JSON.stringify(option)}
                            onClick={isActive => dispatch({
                                type: field.id,
                                content: { id: option.id, value: adaptValue(isActive) },
                                case: field.type
                            })}
                        >
                            {option.title}
                        </CheckBox>
                    ))
                }
            </Field >
        )
    }

    if (field.type === EFieldTypes.RADIO) {
        return (
            <Field>
                <Label id={field.id} title={field.title} />
                <Indented classes="radioGroup">
                    {
                        (field.options || []).map(option => (
                            <Radio
                                name={field.id}
                                option={option.id}
                                key={JSON.stringify(option)}
                                onClick={isActive => dispatch({
                                    type: field.id,
                                    content: { id: option.type, value: adaptValue(isActive) },
                                    case: field.type
                                })}
                            >
                                {option.title}
                            </Radio>
                        ))
                    }
                </Indented>
            </Field>
        )
    }

    if (field.type === EFieldTypes.RADIO_CONDITIONAL) {
        if (validateconditions(formValues, field.conditions)) {
            return (
                <Field>
                    <Label id={field.id} title={field.title} />
                    <Indented classes="radioGroup">
                        {
                            (field.options || []).map(option => (
                                <Radio
                                    name={field.id}
                                    option={option.id}
                                    key={JSON.stringify(option)}
                                    onClick={isActive => dispatch({
                                        type: field.id,
                                        content: { id: field.id, value: adaptValue(isActive) },
                                        case: field.type
                                    })}
                                >
                                    {option.title}
                                </Radio>
                            ))
                        }
                    </Indented>
                </Field>
            )
        }
    }
}

export { renderFieldElement }