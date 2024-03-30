import { sleep } from '../../src/libs/sleep/index';

describe('sleep function', () => {
    test('resolves after the specified time', async () => {
        const start = Date.now();
        const sleepTime = 100; // in milliseconds

        await sleep(sleepTime);

        const end = Date.now();
        const elapsed = end - start;

        // Allow some tolerance (e.g., 10ms) due to setTimeout precision
        const tolerance = 10;
        expect(elapsed).toBeGreaterThanOrEqual(sleepTime - tolerance);
        expect(elapsed).toBeLessThanOrEqual(sleepTime + tolerance);
    });
});
