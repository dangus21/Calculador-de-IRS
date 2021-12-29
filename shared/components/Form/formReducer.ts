import { initialState } from "shared/constants";
import { EFieldTypes, TReducer } from "./types";

function reducer(state: TReducer["state"], action: TReducer["action"]): TReducer["state"] {
    switch (action.case) {
        case EFieldTypes.RADIO_CONDITIONAL:
            return {
                ...state,
                [action.content.id]: action.content.value,
                salary: {
                    ...initialState.salary
                }
            }
        case EFieldTypes.SALARY:
            return {
                ...state,
                [action.type]: {
                    ...state.salary,
                    [action.content.id]: action.content.value
                }
            }
        default:
            return {
                ...state,
                [action.type]: action.content.value
            }
    }
}

export { reducer };