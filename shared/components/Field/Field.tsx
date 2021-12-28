import { ErrorWrapper } from '@ui/ErrorWrapper'
import React from 'react'
import { TField } from './types'

function Field(props: TField) {
    return (
        <ErrorWrapper error={props.error}>
            <div className="grid grid-cols-1 gap-1 mb-3" id={props.id}>
                {props.children}
            </div>
        </ErrorWrapper>
    )
}

export { Field }
