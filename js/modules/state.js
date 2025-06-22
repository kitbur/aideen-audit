export const state = {
    priceData: [],
    region: 'US',
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
};

export function setPriceData(data) {
    state.priceData = data;
}

export function updateUserInput(inputs) {
    state.userInput = { ...state.userInput, ...inputs };
}

export function updateRegion(newRegion) {
    state.region = newRegion;
}

export function updateBonusToggle(key, value) {
    state.bonusToggles[key] = value;
}

export function updateAllBonuses(value) {
    for (const key in state.bonusToggles) {
        state.bonusToggles[key] = value;
    }
}

export function setHasCalculated(value) {
    state.hasCalculated = value;
}