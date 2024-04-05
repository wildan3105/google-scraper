import 'source-map-support/register';

import { createApp } from './app';
import gracefulShutdown from 'http-graceful-shutdown';
import { PORT } from './config';
import { Server } from 'socket.io';
import { startSubscriber } from './events/subscriber/keyword-event';

/**
 * Helper function to log an exit code before exiting the process.
 */
const logAndExitProcess = (exitCode: number) => {
    console.log(`Exiting process with exit code: ${exitCode}`);
    process.exit(exitCode);
};

/**
 * Sets up event listeners on unexpected errors and warnings. These should theoretically
 * never happen. If they do, we assume that the app is in a bad state. For errors, we
 * exit the process with code 1.
 */
const setupProcessEventListeners = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.on('unhandledRejection', (reason: any) => {
        console.log(`encountered unhandled rejection with reason: ${reason}`);
        logAndExitProcess(1);
    });

    process.on('uncaughtException', (err: Error) => {
        console.log(`encountered uncaught exception with the error: ${err}`);
        logAndExitProcess(1);
    });

    process.on('warning', (warning: Error) => {
        console.log(`encountered warning with message: ${warning}`);
    });
};

/**
 * Start an Express server and installs signal handlers on the
 * process for graceful shutdown.
 */
(async () => {
    try {
        const { app } = await createApp();
        const server = app.listen(PORT, () => {
            console.log(`Started express server in environment: ${app.get('env')} on port: ${PORT}`);
        });

        const io = new Server(server);

        io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        await startSubscriber(io);

        gracefulShutdown(server);
        setupProcessEventListeners();
    } catch (err) {
        console.error(`error caught in server.ts, details: ${err}`);
    }
})();
