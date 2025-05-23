// Get references to UI input elements
const CALCULATE_BUTTON = document.querySelector('#calculate')
const CURRENT_PITY = document.querySelector('#currentPity')
const GUARANTEED = document.querySelector('#guaranteed')
const SPECIAL_PASSES = document.querySelector('#specialPasses')
const JADES = document.querySelector('#jades')
const ONERIC_BONUS = document.querySelector('#onericBonus')
const OUTPUT = document.querySelector('#output')

// Hide the results output area when the page loads
OUTPUT.style.display = 'none'

// Run calculations and update the UI when the `calculate` button is clicked
CALCULATE_BUTTON.addEventListener('click', () => {
    const pityTotals = checkPityTotal()
    const pulls = calculatePullsUntilPity(pityTotals)
    const passes = calculateTotalPasses()
    const amountNeeded = calculateAmountNeededForPity(pulls, passes)
    const bonus = checkOnericBonus()
    const onericCosts = calculateNeededOneric(amountNeeded, bonus)
    showOutputElement()
    displayResults(pulls, passes, amountNeeded, onericCosts)
})

// Determine hard and soft pity thresholds based on whether 50/50 is guaranteed
function checkPityTotal() {
    const hardPity = GUARANTEED.checked ? 90 : 180
    const softPity = GUARANTEED.checked ? 75 : 150
    return { hardPity, softPity }
}

// Calculate how many pulls remain before hitting soft and hard pity
function calculatePullsUntilPity({ hardPity, softPity }) {
    const pullsUntilHardPity = hardPity - Number(CURRENT_PITY.value)
    const pullsUntilSoftPity = softPity - Number(CURRENT_PITY.value)
    return { pullsUntilHardPity, pullsUntilSoftPity }
}

// Calculate the total number of pulls the user currently has (special passes + jades converted to passes)
function calculateTotalPasses() {
    const totalPasses = (Number(JADES.value) / 160) + Number(SPECIAL_PASSES.value)
    return { totalPasses }
}

// Determine how many additional passes/jades are needed to reach pity
function calculateAmountNeededForPity(pulls, passes) {
    let neededPassesHardPity = 0
    let neededPassesSoftPity = 0
    let neededJadesHardPity = 0
    let neededJadesSoftPity = 0

    if (passes.totalPasses < pulls.pullsUntilHardPity) {
        neededPassesHardPity = Math.ceil(pulls.pullsUntilHardPity - passes.totalPasses)
        neededPassesSoftPity = Math.ceil(pulls.pullsUntilSoftPity - passes.totalPasses)
        neededJadesHardPity = neededPassesHardPity * 160
        neededJadesSoftPity = neededPassesSoftPity * 160
    }
    return { neededJadesHardPity, neededJadesSoftPity, neededPassesHardPity, neededPassesSoftPity }
}

// Check whether the "double value" bonus is active and return updated Oneric shard values
function checkOnericBonus() {
    let initialOnericValues = [60, 300, 980, 1980, 3280, 6480]
    let finalOnericValues = []

    // If the bonus is checked, double the amount of jades received per purchase
    if (ONERIC_BONUS.checked) {
        finalOnericValues = initialOnericValues.map(value => value * 2)
    } else {
        finalOnericValues = [...initialOnericValues]
    }

    // Destructure into named variables for easier comparisons
    const [oneric60, oneric300, oneric980, oneric1980, oneric3280, oneric6480] = finalOnericValues
    return { oneric60, oneric300, oneric980, oneric1980, oneric3280, oneric6480 }
}

// Match required jade amounts to the lowest qualifying shard bundle price in USD
function calculateNeededOneric({ neededJadesHardPity, neededJadesSoftPity }, bonus) {
    const neededJadesHard = neededJadesHardPity
    const neededJadesSoft = neededJadesSoftPity

    const priceHard = neededJadesHard <= bonus.oneric60 ? "$0.99" :
                      neededJadesHard <= bonus.oneric300 ? "$4.99" :
                      neededJadesHard <= bonus.oneric980 ? "$14.99" :
                      neededJadesHard <= bonus.oneric1980 ? "$29.99" :
                      neededJadesHard <= bonus.oneric3280 ? "$49.99" : "$99.99"

    const priceSoft = neededJadesSoft <= bonus.oneric60 ? "$0.99" :
                      neededJadesSoft <= bonus.oneric300 ? "$4.99" :
                      neededJadesSoft <= bonus.oneric980 ? "$14.99" :
                      neededJadesSoft <= bonus.oneric1980 ? "$29.99" :
                      neededJadesSoft <= bonus.oneric3280 ? "$49.99" : "$99.99"

    return { priceHard, priceSoft }
}

// Show the output section after calculations
function showOutputElement() {
    OUTPUT.style.display = 'block'
}

// Render the calculated data into the HTML output area
function displayResults(pulls, passes, amountNeeded, onericCosts) {
    OUTPUT.innerHTML = `
        <h2>You have ${passes.totalPasses} available pulls.</h2>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Soft Pity (~75)</th>
                    <th>Hard Pity (90)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Passes needed</td>
                    <td>${amountNeeded.neededPassesSoftPity}</td>
                    <td>${amountNeeded.neededPassesHardPity}</td>
                </tr>
                <tr>
                    <td>Jades needed</td>
                    <td>${amountNeeded.neededJadesSoftPity}</td>
                    <td>${amountNeeded.neededJadesHardPity}</td>
                </tr>
                <tr>
                    <td>Oneric shard cost (USD)</td>
                    <td>${onericCosts.priceSoft}</td>
                    <td>${onericCosts.priceHard}</td>
                </tr>
            </tbody>
        </table>
    `
}
