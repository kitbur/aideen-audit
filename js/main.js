// Get references to input elements
const CALCULATE_BUTTON = document.querySelector('#calculate');
const CURRENT_PITY = document.querySelector('#currentPity');
const GUARANTEED = document.querySelector('#guaranteed');
const SPECIAL_PASSES = document.querySelector('#specialPasses');
const JADES = document.querySelector('#jades');
const ONERIC_BONUS = document.querySelector('#onericBonus');

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

// Resets gif animation when `calculate` is clicked
gif.addEventListener('animationend', () => {
    gif.classList.remove('shake');
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
    const onericCosts = calculateNeededOneric(amountNeeded, bonus);

    displayResults(passes, amountNeeded, onericCosts);
});


function displayResults(passes, amountNeeded, onericCosts) {
    PULLS_TOTAL_DISPLAY.innerHTML = `You have <span>${passes.totalPasses}</span> available pulls.`;
    PASSES_SOFT_DISPLAY.textContent = amountNeeded.neededPassesSoftPity;
    PASSES_HARD_DISPLAY.textContent = amountNeeded.neededPassesHardPity;
    JADES_SOFT_DISPLAY.textContent = amountNeeded.neededJadesSoftPity;
    JADES_HARD_DISPLAY.textContent = amountNeeded.neededJadesHardPity;
    ONERIC_SOFT_DISPLAY.textContent = onericCosts.priceSoft;
    ONERIC_HARD_DISPLAY.textContent = onericCosts.priceHard;

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
    let initialOnericValues = [60, 300, 980, 1980, 3280, 6480];
    let finalOnericValues = [];
    if (ONERIC_BONUS.checked) {
        finalOnericValues = initialOnericValues.map(value => value * 2);
    } else {
        finalOnericValues = [...initialOnericValues];
    }
    const [oneric60, oneric300, oneric980, oneric1980, oneric3280, oneric6480] = finalOnericValues;
    return { oneric60, oneric300, oneric980, oneric1980, oneric3280, oneric6480 };
}

function calculateNeededOneric({ neededJadesHardPity, neededJadesSoftPity }, bonus) {
    const neededJadesHard = neededJadesHardPity;
    const neededJadesSoft = neededJadesSoftPity;
    const priceHard = neededJadesHard <= bonus.oneric60 ? "$0.99" :
                      neededJadesHard <= bonus.oneric300 ? "$4.99" :
                      neededJadesHard <= bonus.oneric980 ? "$14.99" :
                      neededJadesHard <= bonus.oneric1980 ? "$29.99" :
                      neededJadesHard <= bonus.oneric3280 ? "$49.99" : "$99.99";
    const priceSoft = neededJadesSoft <= bonus.oneric60 ? "$0.99" :
                      neededJadesSoft <= bonus.oneric300 ? "$4.99" :
                      neededJadesSoft <= bonus.oneric980 ? "$14.99" :
                      neededJadesSoft <= bonus.oneric1980 ? "$29.99" :
                      neededJadesSoft <= bonus.oneric3280 ? "$49.99" : "$99.99";
    return { priceHard, priceSoft };
}