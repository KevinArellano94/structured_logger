import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { Logger } from '../mod.ts';

Deno.test('Logger outputs correct JSON', () => {
    let output: string | undefined;
    const logger = new Logger({
        minLevel: 'info',
        output: (entry: unknown) => {
            output = JSON.stringify(entry);
        },
    });

    logger.info('Test message', { key: 'value' });

    const parsed = JSON.parse(output!);
    assertEquals(parsed.level, 'info');
    assertEquals(parsed.message, 'Test message');
    assertEquals(parsed.key, 'value');
    // Additional assertions for timestamp, env, etc.
});

Deno.test('Respects minLevel', () => {
    let called = false;
    const logger = new Logger({
        minLevel: 'warn',
        output: () => {
            called = true;
        },
    });

    logger.debug('Should not log');
    assertEquals(called, false);
});
