import { Dispatch } from "react";
import { ECivilStatus, EFieldTypes, EValueTypes, TFieldIds, TFormconditionsMultiple, TFormField, TFormValues, TReducer } from "./types";
import { Indented } from "@ui/Indented";
import { Label } from "@ui/Label";
import { Field } from "@ui/Field";
import {
    Input,
    Switch,
    Radio,
    Checkbox,
    RadioGroup,
    Stack
} from "@chakra-ui/react"

function adaptValue(event: any) {
    return Number.isNaN(Number(event)) ? event : Number(event);
}

function validateconditions(form: TFormValues, conditions: TFormconditionsMultiple = []) {
    const validation = conditions.every(conditions => {
        return form[conditions.field] === conditions.value;
    });

    return validation;
}

function renderSalaryField(
    field: TFormField,
    formValues: TFormValues,
    errors: any,
    dispatch: Dispatch<TReducer["action"]>
) {
    if (formValues.civilStatus) {
        return (
            <Field error={errors[field.id]} id={field.id}>
                <Label id={field.id} title={field.title} />
                <Indented>
                    {
                        formValues.civilStatus === ECivilStatus.MARRIED && formValues.titulares === 2 ?
                            (
                                (field.options || []).map(option => (
                                    <div key={JSON.stringify(option)}>
                                        <Label id={option.id} title={option.title} small />
                                        <Input
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
                                            type={field.type} />
                                    </div>
                                ))
                            ) :
                            (
                                <div>
                                    <Input
                                        key={JSON.stringify(field)}
                                        onChange={({ currentTarget }) => {
                                            return dispatch({
                                                type: field.id,
                                                content: {
                                                    id: "first",
                                                    value: adaptValue(currentTarget.value)
                                                },
                                                case: field.id
                                            });
                                        }}
                                        id={field.id}
                                        type={field.type} />
                                </div>
                            )
                    }
                </Indented>
            </Field>
        )
    }
}

function renderFieldElement(
    field: TFormField,
    formValues: TFormValues,
    errors: any,
    dispatch: Dispatch<TReducer["action"]>
) {
    if (field.id === TFieldIds.SALARY) {
        return renderSalaryField(field, formValues, errors, dispatch)
    }

    if (field.type === EFieldTypes.NUMBER || field.type === EFieldTypes.TEXT) {
        return (
            <Field error={errors[field.id]} id={field.id}>
                <Label id={field.id} title={field.title} />
                <div>
                    <Input
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
            <Field error={errors[field.id]} id={field.id}>
                <Label id={field.id} title={field.title} />
                <Indented classes="toggleGroup">
                    <Switch
                        size="md"
                        onChange={event => dispatch({
                            type: field.id,
                            content: { id: EValueTypes.GENERIC, value: event.target.checked }
                        })}
                    />
                </Indented>
            </Field>
        )
    }

    if (field.type === EFieldTypes.CHECKBOX) {
        return (
            <Field error={errors[field.id]} id={field.id}>
                <Label id={field.id} title={field.title} />
                <Indented classes="checkboxGroup">
                    <Checkbox
                        onChange={event => dispatch({
                            type: field.id,
                            content: { id: EValueTypes.GENERIC, value: adaptValue(event.target.checked) }
                        })}
                    >
                        {field.title}
                    </Checkbox>
                </Indented>
            </Field>
        )
    }

    if (field.type === EFieldTypes.MULTIPLE) {
        return (
            <Field error={errors[field.id]} id={field.id}>
                <Label id={field.id} title={field.title} />
                {
                    (field.options || []).map(option => (
                        <Checkbox
                            key={JSON.stringify(option)}
                            onChange={event => dispatch({
                                type: field.id,
                                content: { id: option.id, value: adaptValue(event.target.checked) },
                                case: field.type
                            })}
                        >
                            {option.title}
                        </Checkbox>
                    ))
                }
            </Field >
        )
    }

    if (field.type === EFieldTypes.RADIO) {
        return (
            <Field error={errors[field.id]} id={field.id}>
                <Label id={field.id} title={field.title} />
                <Indented classes="radioGroup">
                    <RadioGroup>
                        <Stack>
                            {
                                (field.options || []).map((option) => (
                                    <Radio
                                        value={option.id}
                                        name={field.id}
                                        option={option.id}
                                        key={JSON.stringify(option)}
                                        onChange={(event) => dispatch({
                                            type: field.id,
                                            content: { id: option.type, value: adaptValue(event.target.value) },
                                            case: field.type
                                        })}
                                    >
                                        {option.title}
                                    </Radio>
                                ))
                            }
                        </Stack>
                    </RadioGroup>
                </Indented>
            </Field>
        )
    }

    if (field.type === EFieldTypes.RADIO_CONDITIONAL) {
        if (validateconditions(formValues, field.conditions)) {
            return (
                <Field error={errors[field.id]} id={field.id}>
                    <Label id={field.id} title={field.title} />
                    <Indented classes="radioGroup">
                        <RadioGroup>
                            <Stack>
                                {
                                    (field.options || []).map(option => (
                                        <Radio
                                            value={option.id}
                                            name={field.id}
                                            option={option.id}
                                            key={JSON.stringify(option)}
                                            onChange={event => dispatch({
                                                type: field.id,
                                                content: { id: field.id, value: adaptValue(event.target.value) },
                                                case: field.type
                                            })}
                                        >
                                            {option.title}
                                        </Radio>
                                    ))
                                }
                            </Stack>
                        </RadioGroup>
                    </Indented>
                </Field>
            )
        }
    }
}

export { renderFieldElement }