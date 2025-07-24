import { PITY_THRESHOLDS, JADES_PER_PULL } from "./constants.js"

export function getPityGoals(isGuaranteed) {
  const hardPity = isGuaranteed
    ? PITY_THRESHOLDS.HARD_GUARANTEED
    : PITY_THRESHOLDS.HARD_50_50
  const softPity = isGuaranteed
    ? PITY_THRESHOLDS.SOFT_GUARANTEED
    : PITY_THRESHOLDS.SOFT_50_50
  return { hardPity, softPity }
}

export function calculatePullsUntilPity(pityGoals, currentPity) {
  const pullsUntilHardPity = Math.max(0, pityGoals.hardPity - currentPity)
  const pullsUntilSoftPity = Math.max(0, pityGoals.softPity - currentPity)
  return { pullsUntilHardPity, pullsUntilSoftPity }
}

export function calculateTotalPasses(jades, specialPasses) {
  const total = Math.floor(jades / JADES_PER_PULL + specialPasses)
  return Math.max(0, total)
}

export function calculateAmountNeeded(pullsUntil, totalPasses) {
  const neededPassesHardPity = Math.max(
    0,
    pullsUntil.pullsUntilHardPity - totalPasses,
  )
  const neededPassesSoftPity = Math.max(
    0,
    pullsUntil.pullsUntilSoftPity - totalPasses,
  )

  return {
    neededPassesHardPity,
    neededPassesSoftPity,
    neededJadesHardPity: neededPassesHardPity * JADES_PER_PULL,
    neededJadesSoftPity: neededPassesSoftPity * JADES_PER_PULL,
  }
}

// Calculates the most cost-effective combination of packs to purchase for a given amount of jades
function calculatePurchasePlan(neededJades, bonusToggles, regionData) {
  if (neededJades <= 0) {
    return {
      costString: `<span><span class="minorText">${regionData.currency}</span>0.00</span>`,
      packsString: "None",
    }
  }

  const prices = regionData.prices
  const basePacks = [
    { baseJades: 60, cost: prices.shards60, name: "60" },
    { baseJades: 300, cost: prices.shards300, name: "300" },
    { baseJades: 980, cost: prices.shards980, name: "980" },
    { baseJades: 1980, cost: prices.shards1980, name: "1980" },
    { baseJades: 3280, cost: prices.shards3280, name: "3280" },
    { baseJades: 6480, cost: prices.shards6480, name: "6480" },
  ].filter((pack) => pack.cost != null)

  if (basePacks.length === 0) return { costString: "N/A", packsString: "N/A" }

  let remainingJades = neededJades
  let totalCost = 0
  const purchaseList = {}
  const bonusesAvailable = { ...bonusToggles }
  const sortedPacks = [...basePacks].sort((a, b) => b.baseJades - a.baseJades)

  // Use bonus on large packs first
  for (const pack of sortedPacks) {
    const bonusKey = `shards${pack.name}`
    const bonusValue = pack.baseJades * 2

    if (bonusesAvailable[bonusKey] && remainingJades >= bonusValue) {
      totalCost += pack.cost
      remainingJades -= bonusValue
      purchaseList[`${pack.name}_bonus`] = 1
      bonusesAvailable[bonusKey] = false
    }
  }

  // Use standard packs
  for (const pack of sortedPacks) {
    if (remainingJades >= pack.baseJades) {
      const numPacks = Math.floor(remainingJades / pack.baseJades)
      totalCost += numPacks * pack.cost
      remainingJades -= numPacks * pack.baseJades
      purchaseList[pack.name] = (purchaseList[pack.name] || 0) + numPacks
    }
  }

  // If there's needed currency remains, buy the smallest pack that covers it
  if (remainingJades > 0) {
    const coveringPack = [...sortedPacks]
      .reverse()
      .find((pack) => pack.baseJades >= remainingJades)
    if (coveringPack) {
      totalCost += coveringPack.cost
      purchaseList[coveringPack.name] =
        (purchaseList[coveringPack.name] || 0) + 1
    }
  }

  const costString = `<span><span class="minorText">${
    regionData.currency
  }</span>${totalCost.toFixed(2)}</span>`

  const listItems = Object.entries(purchaseList)
    .map(([name, count]) => {
      const isBonus = name.endsWith("_bonus")
      const cleanName = isBonus ? name.replace("_bonus", "") : name
      const nameHtml = `<span${
        isBonus ? ' class="bonusActive oneiric"' : ' class="oneiric"'
      }>${cleanName}</span>`

      return `<li><span class="minorText">${count}&times;</span> ${nameHtml}</li>`
    })
    .join("")

  const packsString = listItems ? `<ul>${listItems}</ul>` : "None"

  return { costString, packsString }
}

// Cost calculation for both hard and soft pity
export function calculateCost(amountNeeded, bonusToggles, regionData) {
  const hardPityPlan = calculatePurchasePlan(
    amountNeeded.neededJadesHardPity,
    bonusToggles,
    regionData,
  )
  const softPityPlan = calculatePurchasePlan(
    amountNeeded.neededJadesSoftPity,
    bonusToggles,
    regionData,
  )

  return {
    costSoft: softPityPlan.costString,
    packsSoft: softPityPlan.packsString,
    costHard: hardPityPlan.costString,
    packsHard: hardPityPlan.packsString,
  }
}
