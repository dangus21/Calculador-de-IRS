import { useState, useCallback } from "react"
import type { TCheckBox } from "./types"

function CheckBox({ onClick, children }: TCheckBox) {
    const [active, setActive] = useState<boolean>(false)

    const onClickHandler = useCallback(
        () => {
            if (onClick) {
                onClick(active)
                return;
            }
            setActive(active => !active)
        },
        [active, onClick]
    )

    return (
        <div>
            <label className="inline-flex items-center">
                <input
                    type="checkbox"
                    className="form-checkbox"
                    onClick={onClickHandler}
                />
                <span className="ml-2">
                    {children}
                </span>
            </label>
        </div>
    )
}

export { CheckBox }
