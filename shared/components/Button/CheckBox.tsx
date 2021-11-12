import { useState, useEffect } from "react"
import type { TCheckBox } from "./types"

function CheckBox(props: TCheckBox) {
    const [active, setActive] = useState<boolean>(false)
    const [wasClicked, setWasClicked] = useState<boolean>(false)

    useEffect(() => {
        wasClicked && props.onClick && props.onClick(active)
    }, [active, wasClicked])

    return (
        <div>
            <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    className="form-checkbox"
                    onClick={() => {
                        setWasClicked(!wasClicked);
                        setActive(!active);
                    }}
                />
                <span className="ml-2">
                    {props.children}
                </span>
            </label>
        </div>
    )
}

export { CheckBox }
