import { describe, it, expect } from 'vitest';
import { calculateTotalPasses } from './calculator.js';

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