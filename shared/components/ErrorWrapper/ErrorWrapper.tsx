import clsx from "clsx";
import type { TErrorWrapper } from "./types"
import styles from './styles.module.css'

function ErrorWrapper({ children, error }: TErrorWrapper) {
    return (
        <div className={clsx('errorWrapper', error ? styles.errorWrapper : null)}>
            {children}
        </div>
    )
}

export { ErrorWrapper }