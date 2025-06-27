import { DOMElements } from "./ui.js"

// Validates a number input field against its min/max attributes
// Shows an error message and a shake animation on invalid input
export function validateNumberInput(event) {
	const input = event.target

	if (input.classList.contains("shakeError")) {
		return
	}

	const max = parseInt(input.max)
	const min = parseInt(input.min)

	// If the field is cleared, remove the invalid state
	if (input.value === "") {
		input.classList.remove("invalid")
		// Clear any previous error messages
		if (input.id === "currentPity") DOMElements.errorMessages.pity.textContent = ""
		if (input.id === "specialPasses") DOMElements.errorMessages.passes.textContent = ""
		if (input.id === "jades") DOMElements.errorMessages.jades.textContent = ""
		checkFormValidity()
		return
	}

	const value = parseInt(input.value)

	if (value > max || value < min) {
		input.classList.add("invalid")
		input.classList.add("shakeError")

		let errorMessage = ""
		if (value > max) {
			errorMessage = `Value cannot be more than ${max}.`
		} else if (value < min) {
			errorMessage = `Value cannot be less than ${min}.`
		}

		if (input.id === "currentPity") {
			DOMElements.errorMessages.pity.textContent = errorMessage
		} else if (input.id === "specialPasses") {
			DOMElements.errorMessages.passes.textContent = errorMessage
		} else if (input.id === "jades") {
			DOMElements.errorMessages.jades.textContent = errorMessage
		}

		// Correct the value after the shake animation finishes
		const handleAnimationEnd = () => {
			const correctedValue = value > max ? max : min
			input.value = correctedValue

			input.classList.remove("invalid")
			input.classList.remove("shakeError")

			// Clear the error message after correcting the value
			if (input.id === "currentPity") DOMElements.errorMessages.pity.textContent = ""
			if (input.id === "specialPasses") DOMElements.errorMessages.passes.textContent = ""
			if (input.id === "jades") DOMElements.errorMessages.jades.textContent = ""

			checkFormValidity()
		}

		input.addEventListener("animationend", handleAnimationEnd, { once: true })
	} else {
		input.classList.remove("invalid")
		// Clear any previous error messages if the input is now valid
		if (input.id === "currentPity") DOMElements.errorMessages.pity.textContent = ""
		if (input.id === "specialPasses") DOMElements.errorMessages.passes.textContent = ""
		if (input.id === "jades") DOMElements.errorMessages.jades.textContent = ""
	}
	checkFormValidity()
}

// Checks if any of the validated inputs are invalid and disables the calculate button accordingly
export function checkFormValidity() {
	const validatedInputs = [DOMElements.currentPity, DOMElements.specialPasses, DOMElements.jades]
	const isAnyInputInvalid = validatedInputs.some((input) => input.classList.contains("invalid"))
	DOMElements.calculateButton.disabled = isAnyInputInvalid
}
