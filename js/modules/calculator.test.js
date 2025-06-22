import { describe, it, expect } from 'vitest';
import * as calculator from './calculator.js';
import { PITY_THRESHOLDS, JADES_PER_PULL } from './constants.js';

describe('getPityGoals', () => {
    it('should return the correct thresholds for a guaranteed pull', () => {
        const isGuaranteed = true;
        const goals = calculator.getPityGoals(isGuaranteed);

        expect(goals.softPity).toBe(PITY_THRESHOLDS.SOFT_GUARANTEED);
        expect(goals.hardPity).toBe(PITY_THRESHOLDS.HARD_GUARANTEED);
    });

    it('should return the correct thresholds for a 50/50 pull', () => {
        const isGuaranteed = false;
        const goals = calculator.getPityGoals(isGuaranteed);

        expect(goals.softPity).toBe(PITY_THRESHOLDS.SOFT_50_50);
        expect(goals.hardPity).toBe(PITY_THRESHOLDS.HARD_50_50);
    });
});

describe('calculateAmountNeeded', () => {
    it('should calculate needed passes and jades when user is short', () => {
        const pullsUntil = { pullsUntilSoftPity: 50, pullsUntilHardPity: 70 };
        const totalPasses = 10;

        const needed = calculator.calculateAmountNeeded(pullsUntil, totalPasses);

        expect(needed.neededPassesSoftPity).toBe(40);
        expect(needed.neededJadesSoftPity).toBe(40 * JADES_PER_PULL);
        expect(needed.neededPassesHardPity).toBe(60);
        expect(needed.neededJadesHardPity).toBe(60 * JADES_PER_PULL);
    });

    it('should return 0 for everything if user has enough passes', () => {
        const pullsUntil = { pullsUntilSoftPity: 50, pullsUntilHardPity: 70 };
        const totalPasses = 100;

        const needed = calculator.calculateAmountNeeded(pullsUntil, totalPasses);

        expect(needed.neededPassesSoftPity).toBe(0);
        expect(needed.neededJadesSoftPity).toBe(0);
        expect(needed.neededPassesHardPity).toBe(0);
        expect(needed.neededJadesHardPity).toBe(0);
    });

    it('should clamp the result at 0 if inputs result in a negative number', () => {
        const jades = -160;
        const specialPasses = -9;
    
        const totalPasses = calculator.calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(0);
    });
});

describe('calculateTotalPasses', () => {
    it('should correctly sum jades and special passes', () => {
        const jades = 1600;
        const specialPasses = 5;

        const totalPasses = calculator.calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(15);
    });

    it('should handle zero jades correctly', () => {
        const jades = 0;
        const specialPasses = 20;

        const totalPasses = calculator.calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(20);
    });

    it('should handle zero special passes correctly', () => {
        const jades = 3200;
        const specialPasses = 0;

        const totalPasses = calculator.calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(20);
    });

    it('should handle zero for both inputs', () => {
        const jades = 0;
        const specialPasses = 0;
        
        const totalPasses = calculator.calculateTotalPasses(jades, specialPasses);
        
        expect(totalPasses).toBe(0);
    });

    it('should clamp the result at 0 if inputs result in a negative number', () => {
        const jades = -1600;
        const specialPasses = -5;
    
        const totalPasses = calculator.calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(0);
    });

});

describe('calculatePullsUntilPity', () => {
    it('should calculate pulls needed when not guaranteed', () => {
        const pityGoals = { softPity: 75, hardPity: 150 };
        const currentPity = 10;
        
        const pullsUntil = calculator.calculatePullsUntilPity(pityGoals, currentPity);
        
        expect(pullsUntil.pullsUntilSoftPity).toBe(65);
        expect(pullsUntil.pullsUntilHardPity).toBe(140);
    });

    it('should calculate pulls needed when guaranteed', () => {
        const pityGoals = { softPity: 75, hardPity: 75 };
        const currentPity = 25;
        
        const pullsUntil = calculator.calculatePullsUntilPity(pityGoals, currentPity);
        
        expect(pullsUntil.pullsUntilSoftPity).toBe(50);
        expect(pullsUntil.pullsUntilHardPity).toBe(50);
    });
    
    it('should return 0 if current pity already meets or exceeds the goal', () => {
        const pityGoals = { softPity: 75, hardPity: 150 };
        const currentPity = 80;
        
        const pullsUntil = calculator.calculatePullsUntilPity(pityGoals, currentPity);
        
        expect(pullsUntil.pullsUntilSoftPity).toBe(0);
        expect(pullsUntil.pullsUntilHardPity).toBe(70);
    });
});

describe('calculateCost', () => {
    const testRegionData = {
        currency: 'USD',
        prices: {
            shards60: 0.99,
            shards300: 4.99,
            shards980: 14.99,
            shards1980: 29.99,
            shards3280: 49.99,
            shards6480: 99.99
        }
    };

    it('should calculate the correct cost', () => {
        const amountNeeded = { neededJadesSoftPity: 7000, neededJadesHardPity: 10000 };
        const bonusToggles = { shards60: false, shards300: false, shards980: false, shards1980: false, shards3280: false, shards6480: false };
        
        const cost = calculator.calculateCost(amountNeeded, bonusToggles, testRegionData);

        expect(cost.costSoft).toContain('108.94');
        expect(cost.packsSoft).toContain('6480');
        expect(cost.packsSoft).toContain('300');
        expect(cost.packsSoft).toContain('60');
    });

    it('should utilize a first-time bonus when the needed amount is large enough', () => {
        const amountNeeded = { neededJadesSoftPity: 13000, neededJadesHardPity: 15000 };
        const bonusToggles = { shards60: false, shards300: false, shards980: false, shards1980: false, shards3280: false, shards6480: true };
        
        const cost = calculator.calculateCost(amountNeeded, bonusToggles, testRegionData);

        expect(cost.costSoft).toContain('100.98');
        expect(cost.packsSoft).toContain('bonusActive');
        expect(cost.packsSoft).toContain('6480');
    });

    it('should return N/A if pricing data is missing', () => {
        const testRegionDataWithNoPrices = {
            currency: 'CNY',
            prices: {
                shards60: null,
                shards300: undefined,
                shards980: null,
                shards1980: null,
                shards3280: null,
                shards6480: null
            }
        };
        const amountNeeded = { neededJadesSoftPity: 7000, neededJadesHardPity: 10000 };
        const bonusToggles = { shards60: false, shards300: true, shards980: false, shards1980: true, shards3280: true, shards6480: true };

        const cost = calculator.calculateCost(amountNeeded, bonusToggles, testRegionDataWithNoPrices);

        expect(cost.costSoft).toBe('N/A');
        expect(cost.packsSoft).toBe('N/A');
    });

    it('should return 0 cost and no packs if zero jades are needed', () => {
        const amountNeeded = { neededJadesSoftPity: 0, neededJadesHardPity: 0 };
        const bonusToggles = { shards60: true, shards300: true, shards980: true, shards1980: true, shards3280: true, shards6480: false };
    
        const cost = calculator.calculateCost(amountNeeded, bonusToggles, testRegionData);

        expect(cost.costSoft).toContain('0.00');
        expect(cost.packsSoft).toBe('None');
    });
});