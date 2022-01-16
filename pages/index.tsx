import { Form } from "@ui/Form";
import clsx from "clsx";

import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { fields } from "@ui/Form/formFields";


const Home: NextPage = () => {
	return (
		<div className={clsx(styles.container, "bg-indigo-100")}>
			<Form
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
