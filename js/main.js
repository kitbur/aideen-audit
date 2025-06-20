let priceData = [];

// Get references to input elements
const CALCULATE_BUTTON = document.querySelector('#calculate');
const CURRENT_PITY = document.querySelector('#currentPity');
const GUARANTEED = document.querySelector('#guaranteed');
const SPECIAL_PASSES = document.querySelector('#specialPasses');
const JADES = document.querySelector('#jades');
const REGION_SELECTOR = document.querySelector('#regionSelect');
const TOGGLE_ALL_BONUSES = document.querySelector('#toggleAllBonuses');
const BONUS_TOGGLES = {
    shards60: document.querySelector('#bonus60'),
    shards300: document.querySelector('#bonus300'),
    shards980: document.querySelector('#bonus980'),
    shards1980: document.querySelector('#bonus1980'),
    shards3280: document.querySelector('#bonus3280'),
    shards6480: document.querySelector('#bonus6480'),
};

// Get references to static elements
const resultCells = document.querySelectorAll('.resultValue');
const gif = document.querySelector('#gifContainer img');
const pityError = document.querySelector('#pityError');
const passesError = document.querySelector('#passesError');
const jadesError = document.querySelector('#jadesError');
const instructionsToggle = document.querySelector('#toggleInstructionsButton');

// Get references to output elements
const PULLS_TOTAL_DISPLAY = document.querySelector('#pullsTotal');
const PASSES_SOFT_DISPLAY = document.querySelector('#passesSoft');
const PASSES_HARD_DISPLAY = document.querySelector('#passesHard');
const JADES_SOFT_DISPLAY = document.querySelector('#jadesSoft');
const JADES_HARD_DISPLAY = document.querySelector('#jadesHard');
const PACKS_SOFT_DISPLAY = document.querySelector('#packsSoft');
const PACKS_HARD_DISPLAY = document.querySelector('#packsHard');
const COST_SOFT_DISPLAY = document.querySelector('#costSoft');
const COST_HARD_DISPLAY = document.querySelector('#costHard');
const INSTRUCTIONS_PANEL = document.querySelector('#instructionsPanel');
const RESULTS_PANEL = document.querySelector('#resultsPanel');

document.addEventListener('DOMContentLoaded', async () => {
    await loadPriceData();

    CURRENT_PITY.addEventListener('input', validateInput);
    SPECIAL_PASSES.addEventListener('input', validateInput);
    JADES.addEventListener('input', validateInput);

    TOGGLE_ALL_BONUSES.addEventListener('change', () => {
        const isChecked = TOGGLE_ALL_BONUSES.checked;
        Object.values(BONUS_TOGGLES).forEach(checkbox => {
            if (checkbox && checkbox.checked !== isChecked) {
                checkbox.checked = isChecked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    for (const key in BONUS_TOGGLES) {
        const checkbox = BONUS_TOGGLES[key];
        if (checkbox) {
            checkbox.addEventListener('change', (event) => {
                const label = document.querySelector(`label[for="${checkbox.id}"]`);
                if (label) {
                    label.classList.toggle('bonusActive', event.target.checked);
                }
                updateToggleAllState();
            });
        }
    }
    updateToggleAllState();
});

// Invalid input feedback
function validateInput(event) {
    const input = event.target;

    if (input.classList.contains('shakeError')) {
        return;
    }

    const max = parseInt(input.max);
    const min = parseInt(input.min);

    if (input.value === '') {
        input.classList.remove('invalid');
        return;
    }

    const value = parseInt(input.value);

    if (value > max || value < min) {
        input.classList.add('invalid');
        input.classList.add('shakeError');

        const errorMessage = `Invalid value. The maximum is ${max}.`;
        pityError.textContent = errorMessage;
        passesError.textContent = errorMessage;
        jadesError.textContent = errorMessage;

        const handleAnimationEnd = () => {
            const correctedValue = value > max ? max : min;
            input.value = correctedValue;

            input.classList.remove('invalid');
            input.classList.remove('shakeError');
        };

        input.addEventListener('animationend', handleAnimationEnd, { once: true });

    } else {
        input.classList.remove('invalid');
    }
    checkFormValidity();
}

function checkFormValidity() {
    const validatedInputs = document.querySelectorAll('#currentPity, #specialPasses, #jades');
    const isAnyInputInvalid = Array.from(validatedInputs).some(input => input.classList.contains('invalid'));
    CALCULATE_BUTTON.disabled = isAnyInputInvalid;
}

// Syncs the "Toggle All" checkbox based on the state of individual checkboxes
function updateToggleAllState() {
    const allToggles = Object.values(BONUS_TOGGLES).filter(t => t !== null);
    const allChecked = allToggles.every(toggle => toggle.checked);
    if (TOGGLE_ALL_BONUSES.checked !== allChecked) {
        TOGGLE_ALL_BONUSES.checked = allChecked;
    }
}

// Run calculations and update the UI when the `calculate` button is clicked
CALCULATE_BUTTON.addEventListener('click', (event) => {
    event.preventDefault();

    INSTRUCTIONS_PANEL.style.display = 'none';
    RESULTS_PANEL.style.display = 'block';
    instructionsToggle.style.display = 'block';

    let currentPity = Math.min(parseInt(CURRENT_PITY.value) || 0, 90);
    let specialPasses = Math.min(parseInt(SPECIAL_PASSES.value) || 0, 999999);
    let jades = Math.min(parseInt(JADES.value) || 0, 9999999);
    
    currentPity = Math.max(0, currentPity);
    specialPasses = Math.max(0, specialPasses);
    jades = Math.max(0, jades);

    CURRENT_PITY.value = currentPity;
    SPECIAL_PASSES.value = specialPasses;
    JADES.value = jades;

    resultCells.forEach(cell => {
        cell.classList.remove('visible');
    });

    const pityTotals = checkPityTotal();
    const pulls = calculatePullsUntilPity(pityTotals, currentPity);
    const passes = calculateTotalPasses(jades, specialPasses);
    const amountNeeded = calculateAmountNeededForPity(pulls, passes);

    const bonusToggles = Object.fromEntries(
        Object.entries(BONUS_TOGGLES).map(([key, element]) => [key, element.checked])
    );

    const selectedRegionData = priceData.find(region => region.region === REGION_SELECTOR.value);
    const oneiricCosts = calculateNeededOneiric(amountNeeded, bonusToggles, selectedRegionData);     

    displayResults(passes, amountNeeded, oneiricCosts);
});

instructionsToggle.addEventListener('click', () => {
  const isResultsVisible = RESULTS_PANEL.style.display === 'block';

  if (isResultsVisible) {
    RESULTS_PANEL.style.display = 'none';
    INSTRUCTIONS_PANEL.style.display = 'block';
  } else {
    INSTRUCTIONS_PANEL.style.display = 'none';
    RESULTS_PANEL.style.display = 'block';
  }
});

async function loadPriceData() {
  try {
    const response = await fetch('./data/prices.json')
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    priceData = await response.json()
    
    populateRegionSelector()

  } catch (error) {
    console.error("Fatal Error: Could not load price data.", error);
    alert("ERROR: Could not load price data.");
  }
}

function populateRegionSelector() {
    if (!priceData) return;

    priceData.forEach(region => {
        const option = document.createElement('option');
        option.value = region.region;
        option.textContent = `${region.region} ${region.flag} (${region.currency})`;
        option.dataset.regionName = region.region; 
        REGION_SELECTOR.appendChild(option);
    });

    if (priceData.some(r => r.region === 'US')) {
        REGION_SELECTOR.value = 'US';
    }
}

function displayResults(passes, amountNeeded, oneiricCosts) {
    if (passes.totalPasses === 1) {
        PULLS_TOTAL_DISPLAY.innerHTML = `You have <span class="accentGold">1</span> available pull.`;
    } else {
        PULLS_TOTAL_DISPLAY.innerHTML = `You have <span class="accentGold">${passes.totalPasses.toLocaleString()}</span> available pulls.`;
    }
    PASSES_SOFT_DISPLAY.textContent = amountNeeded.neededPassesSoftPity.toLocaleString();
    PASSES_HARD_DISPLAY.textContent = amountNeeded.neededPassesHardPity.toLocaleString();
    JADES_SOFT_DISPLAY.textContent = amountNeeded.neededJadesSoftPity.toLocaleString();
    JADES_HARD_DISPLAY.textContent = amountNeeded.neededJadesHardPity.toLocaleString();
    PACKS_SOFT_DISPLAY.innerHTML = oneiricCosts.packsSoft;
    PACKS_HARD_DISPLAY.innerHTML = oneiricCosts.packsHard;
    COST_SOFT_DISPLAY.innerHTML = oneiricCosts.costSoft;
    COST_HARD_DISPLAY.innerHTML = oneiricCosts.costHard;

    // Staged delay animation for each cell
    resultCells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('visible');
        }, index * 100);

        setTimeout(() => {
            gif.classList.add('visible', 'shake');
        }, 700);
    });
}

// Resets gif animation when `calculate` is clicked
gif.addEventListener('animationend', () => {
    gif.classList.remove('shake');
});

function checkPityTotal() {
    const hardPity = GUARANTEED.checked ? 90 : 180;
    const softPity = GUARANTEED.checked ? 75 : 150;
    return { hardPity, softPity };
}

function calculatePullsUntilPity({ hardPity, softPity }, currentPity) {
    const pullsUntilHardPity = Math.max(0, hardPity - currentPity);
    const pullsUntilSoftPity = Math.max(0, softPity - currentPity);
    return { pullsUntilHardPity, pullsUntilSoftPity };
}

function calculateTotalPasses(jades, specialPasses) {
    const totalPasses = Math.floor((jades / 160) + specialPasses);
    return { totalPasses };
}

function calculateAmountNeededForPity(pulls, passes) {
    let neededPassesHardPity = 0;
    let neededPassesSoftPity = 0;
    let neededJadesHardPity = 0;
    let neededJadesSoftPity = 0;
    if (passes.totalPasses < pulls.pullsUntilHardPity) {
        neededPassesHardPity = Math.ceil(pulls.pullsUntilHardPity - passes.totalPasses);
        neededPassesSoftPity = Math.max(0, Math.ceil(pulls.pullsUntilSoftPity - passes.totalPasses));
        neededJadesHardPity = neededPassesHardPity * 160;
        neededJadesSoftPity = neededPassesSoftPity * 160;
    }
    return { neededJadesHardPity, neededJadesSoftPity, neededPassesHardPity, neededPassesSoftPity };
}

function checkOneiricBonus() {
    const baseShardValues = {
        shards60: 60,
        shards300: 300,
        shards980: 980,
        shards1980: 1980,
        shards3280: 3280,
        shards6480: 6480
    };

    const finalShardValues = {};

    for (const key in baseShardValues) {
        const isBonusActive = BONUS_TOGGLES[key] ? BONUS_TOGGLES[key].checked : false;
        finalShardValues[key] = isBonusActive ? baseShardValues[key] * 2 : baseShardValues[key];
    }
    
    return finalShardValues;
}

function calculateNeededOneiric({ neededJadesHardPity, neededJadesSoftPity }, bonusToggles, regionData) {
    const currency = regionData.currency || '$';
    const prices = regionData.prices;

    const basePacks = [
        { baseJades: 60, cost: prices.shards60, name: '60' },
        { baseJades: 300, cost: prices.shards300, name: '300' },
        { baseJades: 980, cost: prices.shards980, name: '980' },
        { baseJades: 1980, cost: prices.shards1980, name: '1980' },
        { baseJades: 3280, cost: prices.shards3280, name: '3280' },
        { baseJades: 6480, cost: prices.shards6480, name: '6480' }
    ].filter(pack => pack.cost != null);

    const getPurchasePlan = (neededJades) => {
        if (neededJades <= 0) {
            return { costString: `<span><span class="minorText">${currency}</span>0.00</span>`, packsString: 'None' };
        }
        if (basePacks.length === 0) return { costString: 'N/A', packsString: 'N/A' };

        let remainingJades = neededJades;
        let totalCost = 0;
        const purchaseList = {};
        const bonusesAvailable = { ...bonusToggles }; 
        const sortedPacks = [...basePacks].sort((a, b) => b.baseJades - a.baseJades);

        for (const pack of sortedPacks) {
            const bonusKey = `shards${pack.name}`;
            const bonusValue = pack.baseJades * 2;
            
            if (bonusesAvailable[bonusKey] && remainingJades >= bonusValue) {
                totalCost += pack.cost;
                remainingJades -= bonusValue;
                purchaseList[`${pack.name}_bonus`] = 1; 
                bonusesAvailable[bonusKey] = false;
            }
        }

        for (const pack of sortedPacks) {
            if (remainingJades >= pack.baseJades) {
                const numPacks = Math.floor(remainingJades / pack.baseJades);
                totalCost += numPacks * pack.cost;
                remainingJades -= numPacks * pack.baseJades;
                purchaseList[pack.name] = (purchaseList[pack.name] || 0) + numPacks;
            }
        }

        if (remainingJades > 0) {
            const coveringPack = [...sortedPacks].reverse().find(pack => pack.baseJades >= remainingJades);
            if (coveringPack) {
                totalCost += coveringPack.cost;
                purchaseList[coveringPack.name] = (purchaseList[coveringPack.name] || 0) + 1;
            }
        }
        
        const costString = `<span><span class="minorText">${currency}</span>${totalCost.toFixed(2)}</span>`;
        
        const listItems = Object.entries(purchaseList)
            .map(([name, count]) => {
                const isBonus = name.endsWith('_bonus');
                const cleanName = isBonus ? name.replace('_bonus', '') : name;
                const nameHtml = `<span${isBonus ? ' class="bonusActive oneiric"' : ' class="oneiric"'}>${cleanName}</span>`;
                    
                return `<li><span class="minorText">${count}&times;</span> ${nameHtml}</li>`;
            })
            .join('');

        const packsString = listItems ? `<ul>${listItems}</ul>` : 'None';

        return { costString, packsString };
    };

    const hardPityPlan = getPurchasePlan(neededJadesHardPity);
    const softPityPlan = getPurchasePlan(neededJadesSoftPity);

    return { 
        costSoft: softPityPlan.costString,
        packsSoft: softPityPlan.packsString,
        costHard: hardPityPlan.costString,
        packsHard: hardPityPlan.packsString
    };
}