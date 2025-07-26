import { DOMElements } from "./ui.js"

const validationConfig = {
  currentPity: {
    errorElement: DOMElements.errorMessages.pity,
  },
  specialPasses: {
    errorElement: DOMElements.errorMessages.passes,
  },
  jades: {
    errorElement: DOMElements.errorMessages.jades,
  },
}

function setErrorMessage(input, message) {
  const config = validationConfig[input.id]
  if (config && config.errorElement) {
    config.errorElement.textContent = message
  }
}

// Validates a number input field against its min/max attributes
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
    setErrorMessage(input, "")
    checkFormValidity()
    return
  }

  const value = parseInt(input.value)

  if (value > max || value < min) {
    input.classList.add("invalid", "shakeError")

    const errorMessage =
      value > max
        ? `Value cannot be more than ${max}.`
        : `Value cannot be less than ${min}.`
    setErrorMessage(input, errorMessage)

    // Correct the value after the shake animation finishes
    const handleAnimationEnd = () => {
      input.classList.remove("shakeError")
      if (value > max) input.value = max
      if (value < min) input.value = min
      input.classList.remove("invalid")
      setErrorMessage(input, "")
      checkFormValidity()
    }

    input.addEventListener("animationend", handleAnimationEnd, { once: true })
  } else {
    input.classList.remove("invalid")
    setErrorMessage(input, "")
    DOMElements.errorMessages.pity.textContent = ""
    if (input.id === "specialPasses")
      DOMElements.errorMessages.passes.textContent = ""
    if (input.id === "jades") DOMElements.errorMessages.jades.textContent = ""
  }
  checkFormValidity()
}

// Disable the calculate button if any input is invalid
export function checkFormValidity() {
  const validatedInputs = [
    DOMElements.currentPity,
    DOMElements.specialPasses,
    DOMElements.jades,
  ]
  const isAnyInputInvalid = validatedInputs.some((input) =>
    input.classList.contains("invalid"),
  )
  DOMElements.calculateButton.disabled = isAnyInputInvalid
}
