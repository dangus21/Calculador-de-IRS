import { TRadio } from "./types";

function Radio(props: TRadio) {
    return (
        <div>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    className="form-radio"
                    name={props.name}
                    value={props.option}
                    onClick={() => {
                        props.onClick(props.option);
                    }}
                />
                <span className="ml-2">
                    {props.children}
                </span>
            </label>
        </div>
    )
}

export { Radio }
