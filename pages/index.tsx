import { Form } from "@ui/Form";
import clsx from "clsx";
import { InferGetStaticPropsType } from "next";
import styles from "../styles/Home.module.css";
import { fields } from "@ui/Form/formFields";

import { MAPPED_TABLE_KEYS, MAPPED_TABLE_KEYS_INVERTED, offset } from "@utils/getIRSTable";
import path from "path";
import XLSX from "xlsx";

const Home = ({ irsTable }: InferGetStaticPropsType<typeof getStaticProps>) => {
	return (
		<div className={clsx(styles.container, "bg-indigo-100")}>
			<Form
				irsTable={irsTable}
				title="Calculador de IRS *"
				saveText="Calcular"
				fields={fields}
			/>
			<div id="disclaimer">
				<h3 className="sm:w-auto md:w-120 my-2 px-3 text-xxs font-semibold text-gray-700 dark:text-white mb-3">
					* Esta aplicação pressupõe que os/as seus/suas utilizadores/as trabalham por conta de outrem. Os dados são fornecidos <b><em>&quot;as is&quot;</em></b> e não nos responsabilizamos por quaisquer disparidades entre os mesmos e os dados reais.
				</h3>
			</div>
		</div>
	);
};

export default Home;

export async function getStaticProps() {
	const currentPath = path.resolve("./public");

	const workbook = XLSX.readFile(path.join(currentPath, "/Tabelas_RF_Continente_2022.xlsx"));

	delete workbook.Sheets.Trabalho_Dependente["!margins"];
	delete workbook.Sheets.Trabalho_Dependente["!merges"];
	delete workbook.Sheets.Trabalho_Dependente["!ref"];

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
		);

	function findEntryIndex(key: string) {
		return filteredValues.findIndex(value => {
			return Object.values(value)[0] === key;
		});
	}


	const irsTables = [
		{
			[MAPPED_TABLE_KEYS["NÃO CASADO"]]: filteredValues.slice(
				0,
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_one_income)
			)
		},
		{
			[MAPPED_TABLE_KEYS["CASADO UNICO TITULAR"]]: filteredValues.slice(
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_one_income) + offset,
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_two_incomes)
			)
		},
		{
			[MAPPED_TABLE_KEYS["CASADO DOIS TITULARES"]]: filteredValues.slice(
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_two_incomes) + offset,
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.single_handycap)
			)
		},
		{
			[MAPPED_TABLE_KEYS["NÃO CASADO - DEFICIENTE"]]: filteredValues.slice(
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.single_handycap) + offset,
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_one_income_handycap)
			)
		},
		{
			[MAPPED_TABLE_KEYS["CASADO UNICO TITULAR - DEFICIENTE"]]: filteredValues.slice(
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_one_income_handycap) + offset,
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_two_incomes_handycap)
			)
		},
		{
			[MAPPED_TABLE_KEYS["CASADO DOIS TITULARES - DEFICIENTE"]]: filteredValues.slice(
				findEntryIndex(MAPPED_TABLE_KEYS_INVERTED.married_two_incomes_handycap) + offset,
				filteredValues.length
			)
		}
	].map((baseTable) => {
		const values = Object.entries(baseTable)[0];
		const groupName = values[0];
		const groupValue = values[1];

		return {
			[groupName]: groupValue.slice(7)
		};
	}).map((groupedTable) => {
		const values = Object.entries(groupedTable)[0];
		const groupName = values[0];
		const groupedTableGroupValue = values[1];
		const chunkedValues = groupedTableGroupValue.reduce((
			resultArray: any,
			item: { string: string | number },
			index: number
		) => {
			const chunkIndex = Math.floor(index / 8);

			if (!resultArray[chunkIndex]) {
				resultArray[chunkIndex] = []; // start a new chunk
			}

			resultArray[chunkIndex].push(item);

			return resultArray;
		}, []);

		return {
			[groupName]: chunkedValues
		};
	}).map((chunkedTable) => {
		const values = Object.entries(chunkedTable)[0];
		const groupName = values[0];
		const groupValue = values[1];
		return {
			[groupName]: groupValue.map((value: any[]) => {
				return ({
					salary: Object.values(value[1])[0],
					dependents: value.slice(2).map(val => Object.values(val)[0])
				});
			})
		};
	});


	const irsTablesObj = Object.assign({}, ...irsTables);

	return {
		props: {
			irsTable: irsTablesObj
		} // will be passed to the page component as props
	};
}
