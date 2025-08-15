import { Logger } from '../mod.ts';

function main(): void {
    /**
     * Instantiation of Logger to be used throughout the applicaiton.
     */
    const logger = new Logger({
        minLevel: 'info',
        serviceName: 'service-name',
        env: 'prod',
        output(entry) {
            console.log(entry);
        },
    });

    logger.debug('Event occurred', { key: 'value' });
    logger.info('Event occurred', { key: 'value' });
    logger.warn('Event occurred', { key: 'value' });
    logger.error('Event occurred', { key: 'value' });
    logger.critical('Event occurred', { key: 'value' });
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
    main();
}
