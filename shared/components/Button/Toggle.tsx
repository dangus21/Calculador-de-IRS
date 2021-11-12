import { useState, useEffect } from "react"
import clsx from "clsx"
import type { TToggle } from "./types"

function Toggle(props: TToggle) {
	const [active, setActive] = useState<boolean>(false)
	const [wasClicked, setWasClicked] = useState<boolean>(false)

	useEffect(() => {
		wasClicked && props.onClick && props.onClick(active)
	}, [active, wasClicked])

	return (
		<div
			data-isactive={active}
			onClick={() => {
				setWasClicked(true);
				setActive(!active);
			}}
		>
			<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
				<div
					className={
						clsx(
							active && 'right-0 border-green-400',
							!active && 'border-gray-300',
							"absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer "
						)}
				/>
				<div
					className={
						clsx(
							active && 'bg-green-400',
							!active && 'bg-gray-300',
							"block overflow-hidden h-6 rounded-full cursor-pointer"
						)}
				/>
			</div>
			<label htmlFor="toggle" className="text-xs text-gray-700" />
		</div>
	)
}

export { Toggle }