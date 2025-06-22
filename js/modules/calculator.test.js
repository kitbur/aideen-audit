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

