import { Form } from "@ui/Form"
import clsx from "clsx";

import type { NextPage } from "next"
import styles from "../styles/Home.module.css"
import { fields } from "@ui/Form/formFields";


const Home: NextPage = () => {

	return (
		<div className={clsx(styles.container, "bg-indigo-100")}>
			<Form
				title="Calculador de IRS"
				saveText="Calcular"
				fields={fields}
			/>
		</div>
	)
}

export default Home
