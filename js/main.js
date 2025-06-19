let priceData = [];

// Get references to input elements
const CALCULATE_BUTTON = document.querySelector('#calculate');
const CURRENT_PITY = document.querySelector('#currentPity');
const GUARANTEED = document.querySelector('#guaranteed');
const SPECIAL_PASSES = document.querySelector('#specialPasses');
const JADES = document.querySelector('#jades');
const ONERIC_BONUS = document.querySelector('#onericBonus');
const REGION_SELECTOR = document.querySelector('#regionSelect');

// Get references to static elements
const resultCells = document.querySelectorAll('.resultValue');
const gif = document.querySelector('#gifContainer img');

// Get references to output elements
const PULLS_TOTAL_DISPLAY = document.querySelector('#pullsTotal');
const PASSES_SOFT_DISPLAY = document.querySelector('#passesSoft');
const PASSES_HARD_DISPLAY = document.querySelector('#passesHard');
const JADES_SOFT_DISPLAY = document.querySelector('#jadesSoft');
const JADES_HARD_DISPLAY = document.querySelector('#jadesHard');
const ONERIC_SOFT_DISPLAY = document.querySelector('#onericSoft');
const ONERIC_HARD_DISPLAY = document.querySelector('#onericHard');

document.addEventListener('DOMContentLoaded', async () => {
    await loadPriceData();
});

// Run calculations and update the UI when the `calculate` button is clicked
CALCULATE_BUTTON.addEventListener('click', (event) => {
    event.preventDefault();

    resultCells.forEach(cell => {
        cell.classList.remove('visible');
    });

    const pityTotals = checkPityTotal();
    const pulls = calculatePullsUntilPity(pityTotals);
    const passes = calculateTotalPasses();
    const amountNeeded = calculateAmountNeededForPity(pulls, passes);
    const bonus = checkOnericBonus();
    const selectedRegionData = priceData.find(region => region.region === REGION_SELECTOR.value);
    const onericCosts = calculateNeededOneric(amountNeeded, bonus, selectedRegionData);

    displayResults(passes, amountNeeded, onericCosts);
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

function displayResults(passes, amountNeeded, onericCosts) {
    if (passes.totalPasses === 1) {
        PULLS_TOTAL_DISPLAY.innerHTML = `You have <span>1</span> available pull.`;
    } else {
        PULLS_TOTAL_DISPLAY.innerHTML = `You have <span>${passes.totalPasses.toLocaleString()}</span> available pulls.`;
    }
    PASSES_SOFT_DISPLAY.textContent = amountNeeded.neededPassesSoftPity.toLocaleString();
    PASSES_HARD_DISPLAY.textContent = amountNeeded.neededPassesHardPity.toLocaleString();
    JADES_SOFT_DISPLAY.textContent = amountNeeded.neededJadesSoftPity.toLocaleString();
    JADES_HARD_DISPLAY.textContent = amountNeeded.neededJadesHardPity.toLocaleString();
    ONERIC_SOFT_DISPLAY.innerHTML = onericCosts.priceSoft;
    ONERIC_HARD_DISPLAY.innerHTML = onericCosts.priceHard;

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

function calculatePullsUntilPity({ hardPity, softPity }) {
    const pullsUntilHardPity = hardPity - Number(CURRENT_PITY.value);
    const pullsUntilSoftPity = softPity - Number(CURRENT_PITY.value);
    return { pullsUntilHardPity, pullsUntilSoftPity };
}

function calculateTotalPasses() {
    const totalPasses = Math.floor((Number(JADES.value) / 160) + Number(SPECIAL_PASSES.value));
    return { totalPasses };
}

function calculateAmountNeededForPity(pulls, passes) {
    let neededPassesHardPity = 0;
    let neededPassesSoftPity = 0;
    let neededJadesHardPity = 0;
    let neededJadesSoftPity = 0;
    if (passes.totalPasses < pulls.pullsUntilHardPity) {
        neededPassesHardPity = Math.ceil(pulls.pullsUntilHardPity - passes.totalPasses);
        neededPassesSoftPity = Math.ceil(pulls.pullsUntilSoftPity - passes.totalPasses);
        neededJadesHardPity = neededPassesHardPity * 160;
        neededJadesSoftPity = neededPassesSoftPity * 160;
    }
    return { neededJadesHardPity, neededJadesSoftPity, neededPassesHardPity, neededPassesSoftPity };
}

function checkOnericBonus() {
    const initialOnericValues = {
        shards60: 60,
        shards300: 300,
        shards980: 980,
        shards1980: 1980,
        shards3280: 3280,
        shards6480: 6480
    };

    if (ONERIC_BONUS.checked) {
        for (const key in initialOnericValues) {
            initialOnericValues[key] *= 2;
        }
    }
    return initialOnericValues;
}

function calculateNeededOneric({ neededJadesHardPity, neededJadesSoftPity }, bonus, regionData) {
    const currency = regionData.currency || '$';
    const prices = regionData.prices;

    const getPriceForJades = (neededJades) => {
        if (neededJades <= 0) {
            return `<span class="currencySymbol">${currency}</span>0.00`;
        }

        if (prices.shards60 != null && neededJades <= bonus.shards60) return `<span class="currencySymbol">${currency}</span>${prices.shards60.toFixed(2)}`;
        if (prices.shards300 != null && neededJades <= bonus.shards300) return `<span class="currencySymbol">${currency}</span>${prices.shards300.toFixed(2)}`;
        if (prices.shards980 != null && neededJades <= bonus.shards980) return `<span class="currencySymbol">${currency}</span>${prices.shards980.toFixed(2)}`;
        if (prices.shards1980 != null && neededJades <= bonus.shards1980) return `<span class="currencySymbol">${currency}</span>${prices.shards1980.toFixed(2)}`;
        if (prices.shards3280 != null && neededJades <= bonus.shards3280) return `<span class="currencySymbol">${currency}</span>${prices.shards3280.toFixed(2)}`;
        if (prices.shards6480 != null) return `<span class="currencySymbol">${currency}</span>${prices.shards6480.toFixed(2)}`;
        
        return "N/A";
    };

    const priceHard = getPriceForJades(neededJadesHardPity);
    const priceSoft = getPriceForJades(neededJadesSoftPity);

    return { priceHard, priceSoft };
}
