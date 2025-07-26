// Modules:
//   - ui.js - DOM manipulation and events
//   - calculator.js - calculator logic
//   - state.js - application state management
//   - api.js - data fetching
//   - validation.js - input validation
//   - constants.js - static values
//   - main.js - event handlers & initialization

import * as api from "./modules/api.js"
import * as ui from "./modules/ui.js"
import * as calculator from "./modules/calculator.js"
import {
  state,
  setPriceData,
  updateUserInput,
  updateRegion,
  updateBonusToggle,
  updateAllBonuses,
  setHasCalculated,
} from "./modules/state.js"
import { validateNumberInput, checkFormValidity } from "./modules/validation.js"

// ===============
// Event Handlers
// ===============

function handleCalculateClick(event) {
  event.preventDefault()

  ui.DOMElements.instructionsButtonMobile.style.display = "none"

  // Get latest input from the UI and update state
  const inputs = ui.getUserInputs()
  updateUserInput(inputs)

  // Perform all calculations using data from the state
  const pityGoals = calculator.getPityGoals(state.userInput.isGuaranteed)
  const pullsUntil = calculator.calculatePullsUntilPity(
    pityGoals,
    state.userInput.currentPity,
  )
  const totalPasses = calculator.calculateTotalPasses(
    state.userInput.jades,
    state.userInput.specialPasses,
  )
  const needed = calculator.calculateAmountNeeded(pullsUntil, totalPasses)

  const selectedRegionData = state.priceData.find(
    (region) => region.region === state.region,
  )
  const costs = calculator.calculateCost(
    needed,
    state.bonusToggles,
    selectedRegionData,
  )

  setHasCalculated(true)

  // Pass the results to the UI to be displayed
  ui.displayResults({ totalPasses, needed, costs })

  // If it's a mobile view, scroll to the top of the output section
  const isMobile = window.matchMedia("(max-width: 800px)").matches
  if (isMobile) {
    ui.DOMElements.outputSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

function handleBonusToggle(event) {
  const key = Object.keys(ui.DOMElements.bonusToggles).find(
    (k) => ui.DOMElements.bonusToggles[k] === event.target,
  )
  if (key) {
    updateBonusToggle(key, event.target.checked)
    ui.updateBonusCheckbox(key, event.target.checked)
  }
  const allChecked = Object.values(state.bonusToggles).every(Boolean)
  ui.updateToggleAllCheckbox(allChecked)
}

function handleToggleAllBonuses(event) {
  const isChecked = event.target.checked
  updateAllBonuses(isChecked)
  for (const key in state.bonusToggles) {
    ui.DOMElements.bonusToggles[key].checked = isChecked
    ui.updateBonusCheckbox(key, isChecked)
  }
}

function handleShowMobileInstructions() {
  const output = ui.DOMElements.outputSection
  const instructions = ui.DOMElements.panels.instructions

  // Make the output and instructions panels visible while hiding the results
  output.style.display = "grid"
  instructions.style.display = "block"
  ui.DOMElements.panels.results.style.display = "none"

  // Show the main toggle button and set it to the 'close' state so that the instructions can be hidden again
  ui.DOMElements.instructionsToggle.style.display = "block"
  ui.DOMElements.iconClose.style.display = "block"
  ui.DOMElements.iconInfo.style.display = "none"

  // Scroll to the instructions
  setTimeout(() => {
    output.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 50)
}

// ===============
// Initialization
// ===============

function registerEventListeners() {
  const listeners = [
    {
      element: ui.DOMElements.calculateButton,
      event: "click",
      handler: handleCalculateClick,
    },
    {
      element: ui.DOMElements.instructionsToggle,
      event: "click",
      handler: ui.togglePanels,
    },
    {
      element: ui.DOMElements.gif,
      event: "animationend",
      handler: ui.resetGifAnimation,
    },
    {
      element: ui.DOMElements.instructionsButtonMobile,
      event: "click",
      handler: handleShowMobileInstructions,
    },
    {
      elements: [
        ui.DOMElements.currentPity,
        ui.DOMElements.specialPasses,
        ui.DOMElements.jades,
      ],
      event: "input",
      handler: validateNumberInput,
    },
    {
      element: ui.DOMElements.toggleAllBonuses,
      event: "change",
      handler: handleToggleAllBonuses,
    },
    {
      elements: Object.values(ui.DOMElements.bonusToggles),
      event: "change",
      handler: handleBonusToggle,
    },
    {
      element: ui.DOMElements.regionSelector,
      event: "change",
      handler: (e) => updateRegion(e.target.value),
    },
  ]

  listeners.forEach(({ element, elements, event, handler }) => {
    const targets = element ? [element] : elements
    targets.forEach((target) => {
      if (target) {
        target.addEventListener(event, handler)
      }
    })
  })
}

async function initialize() {
  // Load data and populate state
  const priceData = await api.fetchPriceData()
  setPriceData(priceData)

  // Initial UI setup
  ui.populateRegionSelector(state.priceData)
  checkFormValidity()

  // Attach all event listeners
  registerEventListeners()
}

// Run the app once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initialize)
