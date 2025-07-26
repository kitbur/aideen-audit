export const state = {
  priceData: [],
  region: "US",
  hasCalculated: false,
  userInput: {
    currentPity: 0,
    isGuaranteed: false,
    specialPasses: 0,
    jades: 0,
  },
  bonusToggles: {
    shards60: false,
    shards300: false,
    shards980: false,
    shards1980: false,
    shards3280: false,
    shards6480: false,
  },
}

export function updateState(key, value) {
  if (Object.prototype.hasOwnProperty.call(state, key)) {
    state[key] = value
  } else if (key.startsWith("userInput.")) {
    const subKey = key.split(".")[1]
    state.userInput[subKey] = value
  } else if (key.startsWith("bonusToggles.")) {
    const subKey = key.split(".")[1]
    if (subKey === "all") {
      for (const k in state.bonusToggles) {
        state.bonusToggles[k] = value
      }
    } else {
      state.bonusToggles[subKey] = value
    }
  } else {
    console.warn(`State key "${key}" not found.`)
  }
}

export function updateUserInput(inputs) {
  state.userInput = { ...state.userInput, ...inputs }
}
