import { describe, it, expect } from 'vitest';
import { calculateTotalPasses, calculatePullsUntilPity } from './calculator.js';

describe('calculateTotalPasses', () => {

    it('should correctly sum jades and special passes', () => {
        const jades = 1600;
        const specialPasses = 5;

        const totalPasses = calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(15);
    });

    it('should handle zero jades correctly', () => {
        const jades = 0;
        const specialPasses = 20;

        const totalPasses = calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(20);
    });

    it('should handle zero special passes correctly', () => {
        const jades = 3200;
        const specialPasses = 0;

        const totalPasses = calculateTotalPasses(jades, specialPasses);

        expect(totalPasses).toBe(20);
    });

    it('should handle zero for both inputs', () => {
        const jades = 0;
        const specialPasses = 0;
        
        const totalPasses = calculateTotalPasses(jades, specialPasses);
        
        expect(totalPasses).toBe(0);
    });

});

describe('calculatePullsUntilPity', () => {

    it('should calculate pulls needed when not guaranteed', () => {
        const pityGoals = { softPity: 75, hardPity: 150 };
        const currentPity = 10;
        
        const pullsUntil = calculatePullsUntilPity(pityGoals, currentPity);
        
        expect(pullsUntil.pullsUntilSoftPity).toBe(65);
        expect(pullsUntil.pullsUntilHardPity).toBe(140);
    });

    it('should calculate pulls needed when guaranteed', () => {
        const pityGoals = { softPity: 75, hardPity: 75 };
        const currentPity = 25;
        
        const pullsUntil = calculatePullsUntilPity(pityGoals, currentPity);
        
        expect(pullsUntil.pullsUntilSoftPity).toBe(50);
        expect(pullsUntil.pullsUntilHardPity).toBe(50);
    });
    
    it('should return 0 if current pity already meets or exceeds the goal', () => {
        const pityGoals = { softPity: 75, hardPity: 150 };
        const currentPity = 80;
        
        const pullsUntil = calculatePullsUntilPity(pityGoals, currentPity);
        
        expect(pullsUntil.pullsUntilSoftPity).toBe(0);
        expect(pullsUntil.pullsUntilHardPity).toBe(70);
    });
});