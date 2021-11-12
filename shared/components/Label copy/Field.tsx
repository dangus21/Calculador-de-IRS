import React from 'react'
import { TField } from './types'

function Field(props: TField) {
    return (
        <div className="grid grid-cols-1 gap-1 mt-4" id={props.id}>
            {props.children}
        </div>
    )
}

export { Field }
