import clsx from "clsx"
import React from "react"
import { TLabel } from "./types"

function Label(props: TLabel) {
    return (
        <label
            htmlFor={props.id}
            className={clsx(
                !props.small && "font-semibold text-base",
                props.small && "text-sm",
                "text-gray-700 dark:text-gray-200"
            )}
        >
            {props.title}
        </label>
    )
}

export { Label }
