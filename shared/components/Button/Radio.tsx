import { useCallback } from "react";
import { TRadio } from "./types";

function Radio(props: TRadio) {
    const { children, name, onClick, option } = props;

    const onClickHandler = useCallback(
        (option) => {
            if (onClick) {
                onClick(option)
                return;
            }
        },
        [onClick]
    )

    return (
        <div>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    className="form-radio"
                    name={name}
                    value={option}
                    onClick={() => onClickHandler(option)} />
                <span className="ml-2">
                    {children}
                </span>
            </label>
        </div>
    )
}

export { Radio }
