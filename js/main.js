// DOM elements
const CALCULATE_BUTTON = document.querySelector('#calculate')
const CURRENT_PITY = document.querySelector('#currentPity')
const GUARANTEED = document.querySelector('#guaranteed')
const SPECIAL_PASSES = document.querySelector('#specialPasses')
const JADES = document.querySelector('#jades')
const ONERIC_BONUS = document.querySelector('#onericBonus')
const OUTPUT = document.querySelector('#output')

// Hide results on page load
OUTPUT.style.display = 'none'

// When the user clicks the calculate button
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

function checkPityTotal() {
    const hardPity = GUARANTEED.checked ? 90 : 180
    const softPity = GUARANTEED.checked ? 75 : 150
    return { hardPity, softPity }
}

function calculatePullsUntilPity({ hardPity, softPity }) {
    const pullsUntilHardPity = hardPity - Number(CURRENT_PITY.value)
    const pullsUntilSoftPity = softPity - Number(CURRENT_PITY.value)
    return { pullsUntilHardPity, pullsUntilSoftPity }
}

function calculateTotalPasses() {
    const totalPasses = (Number(JADES.value) / 160) + Number(SPECIAL_PASSES.value)
    return { totalPasses }
}

function calculateAmountNeededForPity(pulls, passes) {
    let neededPassesHardPity = 0
    let neededPassesSoftPity = 0
    let neededJadesHardPity = 0
    let neededJadesSoftPity = 0

    if (passes.totalPasses < pulls.pullsUntilHardPity) {
        neededPassesHardPity = pulls.pullsUntilHardPity - passes.totalPasses
        neededPassesSoftPity = pulls.pullsUntilSoftPity - passes.totalPasses
        neededJadesHardPity = neededPassesHardPity * 160
        neededJadesSoftPity = neededPassesSoftPity * 160
    }
    return { neededJadesHardPity, neededJadesSoftPity, neededPassesHardPity, neededPassesSoftPity }
}

function checkOnericBonus() {
    let oneric60 = 60
    let oneric300 = 300
    let oneric980 = 980
    let oneric1980 = 1980
    let oneric3280 = 3280
    let oneric6480 = 6480

    if (ONERIC_BONUS.checked) {
        oneric60 *= 2
        oneric300 *= 2
        oneric980 *= 2
        oneric1980 *= 2
        oneric3280 *= 2
        oneric6480 *= 2
    }
    return { oneric60, oneric300, oneric980, oneric1980, oneric3280, oneric6480 }
}

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

function showOutputElement() {
    OUTPUT.style.display = 'block'
}

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
