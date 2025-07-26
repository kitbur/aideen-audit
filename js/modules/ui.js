import { state } from "./state.js"

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

export const DOMElements = {
  // Buttons
  calculateButton: $("#calculate"),
  instructionsToggle: $("#toggleInstructionsButton"),
  instructionsButtonMobile: $("#instructionsButtonMobile"),
  toggleAllBonuses: $("#toggleAllBonuses"),

  // Icons
  iconClose: $("#toggleInstructionsButton .iconClose"),
  iconInfo: $("#toggleInstructionsButton .iconInfo"),

  // User Input Fields
  currentPity: $("#currentPity"),
  guaranteed: $("#guaranteed"),
  specialPasses: $("#specialPasses"),
  jades: $("#jades"),
  regionSelector: $("#regionSelect"),

  // Bonus Toggles
  bonusToggles: {
    shards60: $("#bonus60"),
    shards300: $("#bonus300"),
    shards980: $("#bonus980"),
    shards1980: $("#bonus1980"),
    shards3280: $("#bonus3280"),
    shards6480: $("#bonus6480"),
  },

  // Error Messages
  errorMessages: {
    pity: $("#pityError"),
    passes: $("#passesError"),
    jades: $("#jadesError"),
  },

  // Output Elements
  outputSection: $("#output"),
  gif: $("#gifContainer img"),
  panels: {
    instructions: $("#instructionsPanel"),
    results: $("#resultsPanel"),
  },

  // Calculator Result Output
  resultCells: $$(".resultValue"),
  pullsTotalDisplay: $("#pullsTotal"),
  passesSoftDisplay: $("#passesSoft"),
  passesHardDisplay: $("#passesHard"),
  jadesSoftDisplay: $("#jadesSoft"),
  jadesHardDisplay: $("#jadesHard"),
  packsSoftDisplay: $("#packsSoft"),
  packsHardDisplay: $("#packsHard"),
  costSoftDisplay: $("#costSoft"),
  costHardDisplay: $("#costHard"),
}

// User input values
export function getUserInputs() {
  return {
    currentPity: parseInt(DOMElements.currentPity.value) || 0,
    isGuaranteed: DOMElements.guaranteed.checked,
    specialPasses: parseInt(DOMElements.specialPasses.value) || 0,
    jades: parseInt(DOMElements.jades.value) || 0,
    region: DOMElements.regionSelector.value,
  }
}

// Populate the region selector from price data
export function populateRegionSelector(priceData) {
  if (!priceData) return
  priceData.forEach((region) => {
    const option = document.createElement("option")
    option.value = region.region
    option.textContent = `${region.region} ${region.flag} (${region.currency})`
    DOMElements.regionSelector.appendChild(option)
  })
  if (priceData.some((r) => r.region === "US")) {
    DOMElements.regionSelector.value = "US"
  }
}

// Display the final calculated results
export function displayResults({ totalPasses, needed, costs }) {
  // Replay animations
  DOMElements.resultCells.forEach((cell) => {
    cell.classList.remove("visible")
  })
  DOMElements.gif.classList.remove("visible", "shake")

  // Ensure that the output container is visible
  DOMElements.outputSection.style.display = "grid"

  DOMElements.pullsTotalDisplay.innerHTML = `You have <span class="accentGold">${totalPasses.toLocaleString()}</span> available pulls.`
  DOMElements.passesSoftDisplay.textContent =
    needed.neededPassesSoftPity.toLocaleString()
  DOMElements.passesHardDisplay.textContent =
    needed.neededPassesHardPity.toLocaleString()
  DOMElements.jadesSoftDisplay.textContent =
    needed.neededJadesSoftPity.toLocaleString()
  DOMElements.jadesHardDisplay.textContent =
    needed.neededJadesHardPity.toLocaleString()
  DOMElements.packsSoftDisplay.innerHTML = costs.packsSoft
  DOMElements.packsHardDisplay.innerHTML = costs.packsHard
  DOMElements.costSoftDisplay.innerHTML = costs.costSoft
  DOMElements.costHardDisplay.innerHTML = costs.costHard

  showResultsPanel()

  // Delayed animations
  DOMElements.resultCells.forEach((cell, index) => {
    setTimeout(() => cell.classList.add("visible"), index * 100)
  })

  setTimeout(() => {
    DOMElements.gif.classList.add("visible", "shake")
  }, 700)
}

export function resetGifAnimation() {
  DOMElements.gif.classList.remove("shake")
}

export function showResultsPanel() {
  DOMElements.panels.instructions.style.display = "none"
  DOMElements.panels.results.style.display = "block"
  DOMElements.instructionsToggle.style.display = "block"
  DOMElements.iconInfo.style.display = "block"
  DOMElements.iconClose.style.display = "none"
}

export function togglePanels() {
  const hasCalculated = state.hasCalculated

  // If no calculation has run, the toggle button hides the instructions on mobile
  if (!hasCalculated) {
    DOMElements.outputSection.style.display = "none"

    if (window.matchMedia("(max-width: 800px)").matches) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    return
  }

  const isResultsVisible = DOMElements.panels.results.style.display === "block"
  DOMElements.panels.results.style.display = isResultsVisible ? "none" : "block"
  DOMElements.panels.instructions.style.display = isResultsVisible
    ? "block"
    : "none"

  // Show the calculator icon on the instructions panel, and the info icon on the results panel.
  DOMElements.iconInfo.style.display = isResultsVisible ? "none" : "block"
  DOMElements.iconClose.style.display = isResultsVisible ? "block" : "none"
}

export function updateBonusCheckbox(key, isChecked) {
  const checkbox = DOMElements.bonusToggles[key]
  if (checkbox) {
    const label = document.querySelector(`label[for="${checkbox.id}"]`)
    label.classList.toggle("bonusActive", isChecked)
  }
}

export function updateToggleAllCheckbox(allChecked) {
  if (DOMElements.toggleAllBonuses.checked !== allChecked) {
    DOMElements.toggleAllBonuses.checked = allChecked
  }
}
