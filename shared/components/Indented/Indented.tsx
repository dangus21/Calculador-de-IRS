import clsx from 'clsx'
import React from 'react'
import { TIndented } from './types'

function Indented(props: TIndented) {
    return (
        <div className={
            clsx(
                props.classes,
                "ml-3"
            )
        }>
            {props.children}
        </div>
    )
}

export { Indented }
