import { Form } from "@ui/Form";
import clsx from "clsx";
import { InferGetStaticPropsType } from "next";
import styles from "../styles/Home.module.css";
import { fields } from "@ui/Form/formFields";

import { generateIRSTable } from "@utils/getIRSTable";

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
	const irsTable = generateIRSTable();
	return {
		props: {
			irsTable
		} // will be passed to the page component as props
	};
}
