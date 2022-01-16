import path from "path";
import XLSX from "xlsx";
import type { NextApiRequest, NextApiResponse } from "next"

const MAPPED_TABLE_KEYS = {
    "NÃO CASADO": "single",
    "CASADO UNICO TITULAR": "married_one_income",
    "CASADO DOIS TITULARES": "married_two_incomes",
    "NÃO CASADO - DEFICIENTE": "single_handycap",
    "CASADO UNICO TITULAR - DEFICIENTE": "married_one_income_handycap",
    "CASADO DOIS TITULARES - DEFICIENTE": "married_two_incomes_handycap"
}


export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    const currentPath = path.resolve("./public")

    const workbook = XLSX.readFile(path.join(currentPath, "/Tabelas_RF_Continente_2022.xlsx"));

    delete workbook.Sheets.Trabalho_Dependente["!margins"]
    delete workbook.Sheets.Trabalho_Dependente["!merges"]
    delete workbook.Sheets.Trabalho_Dependente["!ref"]

    const filteredValues = Object.entries(workbook.Sheets.Trabalho_Dependente)
        .map(entry => ({ [entry[0]]: entry[1].v }))
        .filter(value =>
            Object.values(value)[0] !== "TABELAS DE RETENÇÃO NA FONTE PARA  O CONTINENTE - 2022" &&
            Object.values(value)[0] !== "TABELA I - TRABALHO DEPENDENTE " &&
            Object.values(value)[0] !== "T A B E L A II - TRABALHO DEPENDENTE" &&
            Object.values(value)[0] !== "T A B E L A III - TRABALHO DEPENDENTE" &&
            Object.values(value)[0] !== "T A B E L A I V - TRABALHO DEPENDENTE" &&
            Object.values(value)[0] !== "T A B E L A   V - TRABALHO DEPENDENTE" &&
            Object.values(value)[0] !== "T A B E L A VI - TRABALHO DEPENDENTE" &&
            Object.values(value)[0] !== "Remuneração Mensal  Euros" &&
            Object.values(value)[0] !== "Número de dependentes"
        )

    console.log("LOG ~ file: index.ts ~ line 25 ~ filteredValues", filteredValues);

    const irsTables = [
        {
            [MAPPED_TABLE_KEYS["NÃO CASADO"]]: filteredValues.slice(0, 295)
        }
        ,
        {
            [MAPPED_TABLE_KEYS["CASADO UNICO TITULAR"]]: filteredValues.slice(296, 590)
        },
        {
            [MAPPED_TABLE_KEYS["CASADO DOIS TITULARES"]]: filteredValues.slice(591, 885)
        },
        {
            [MAPPED_TABLE_KEYS["NÃO CASADO - DEFICIENTE"]]: filteredValues.slice(886, 1132)
        },
        {
            [MAPPED_TABLE_KEYS["CASADO UNICO TITULAR - DEFICIENTE"]]: filteredValues.slice(1133, 1371)
        },
        {
            [MAPPED_TABLE_KEYS["CASADO DOIS TITULARES - DEFICIENTE"]]: filteredValues.slice(1372, filteredValues.length)
        }
    ].map((baseTable) => {
        const values = Object.entries(baseTable)[0]
        const groupName = values[0];
        const groupValue = values[1];

        return {
            [groupName]: groupValue.slice(7)
        }
    }).map((groupedTable) => {
        const values = Object.entries(groupedTable)[0]
        const groupName = values[0];
        const groupValue = values[1];
        const chunkedValues = groupValue.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 8)

            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] // start a new chunk
            }

            resultArray[chunkIndex].push(item)

            return resultArray
        }, [])

        return {
            [groupName]: chunkedValues
        }
    }).map((chunkedTable) => {
        const values = Object.entries(chunkedTable)[0]
        const groupName = values[0];
        const groupValue = values[1];
        return {
            [groupName]: groupValue.map((value: any[]) => {
                return ({
                    salary: Object.values(value[1])[0],
                    dependents: value.slice(2).map(val => Object.values(val)[0])
                });
            })
        }
    })



    res.status(200).json(Object.assign({}, ...irsTables))
}