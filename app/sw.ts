import { defaultCache } from "@serwist/next/worker";
// @ts-ignore
import type { PrecacheEntry, SerwistGlobalConfig } from "@serwist/precaching";
// @ts-ignore
import { Serwist } from "@serwist/sw";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: any;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
});

serwist.addEventListeners();
