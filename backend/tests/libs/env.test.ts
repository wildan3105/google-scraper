import { injectEnv } from '../../src/libs/env/index';

describe('test to ensure environment variables are injected correctly', () => {
    test('test injectEnv when path is not provided', () => {
        const env = injectEnv();
        expect(typeof env).toBe('object');
        expect(env).toBeDefined();
    });

    test('test injectEnv when path is provided', () => {
        const env = injectEnv('./.env.example');
        expect(typeof env).toBe('object');
        expect(env).toHaveProperty('parsed');
    });
});
