type InvertResult<T extends Record<PropertyKey, PropertyKey>> = {
    [P in keyof T as T[P]]: P
}

export const MAPPED_TABLE_KEYS = {
    "N\u00C3O CASADO": "single" as "single",
    "CASADO UNICO TITULAR": "married_one_income" as "married_one_income",
    "CASADO DOIS TITULARES": "married_two_incomes" as "married_two_incomes",
    "N\u00C3O CASADO - DEFICIENTE": "single_handycap" as "single_handycap",
    "CASADO UNICO TITULAR - DEFICIENTE": "married_one_income_handycap" as "married_one_income_handycap",
    "CASADO DOIS TITULARES - DEFICIENTE": "married_two_incomes_handycap" as "married_two_incomes_handycap"
};

export const MAPPED_TABLE_KEYS_INVERTED = Object.assign(
    {},
    ...Object.entries(MAPPED_TABLE_KEYS).map((value) => {
        return {
            [value[1]]: value[0]
        };
    })
) as InvertResult<typeof MAPPED_TABLE_KEYS>;

export const offset = 1;
