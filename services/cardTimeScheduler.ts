import { db } from "@/libs/db";

const STORAGE_KEY = "gam:lastCardTimeAutoRun";
const MAX_CARD_TIME = 6;
const SIX_AM_HOUR = 6;
let timerId: number | null = null;
let isInitialized = false;
let isRunning = false;

const getMostRecentSixAm = (date: Date): Date => {
    const mostRecent = new Date(date);
    mostRecent.setHours(SIX_AM_HOUR, 0, 0, 0);
    if (mostRecent > date) {
        mostRecent.setDate(mostRecent.getDate() - 1);
    }
    return mostRecent;
};

const getNextSixAm = (date: Date): Date => {
    const next = new Date(date);
    next.setHours(SIX_AM_HOUR, 0, 0, 0);
    if (next <= date) {
        next.setDate(next.getDate() + 1);
    }
    return next;
};

const calculatePendingIncrements = (lastProcessed: Date | undefined, now: Date) => {
    const baseline = lastProcessed ?? getMostRecentSixAm(now);
    let latestProcessed = baseline;
    let pending = 0;

    while (true) {
        const nextBoundary = getNextSixAm(latestProcessed);
        if (nextBoundary > now) {
            break;
        }
        pending += 1;
        latestProcessed = nextBoundary;
    }

    return { pending, latestProcessed } as const;
};

const incrementCardTimes = async (steps: number): Promise<boolean> => {
    if (steps <= 0) {
        return false;
    }

    let didChange = false;
    await db.transaction("rw", db.characters, async () => {
        await db.characters.toCollection().modify(character => {
            const numericCurrent = Number(character.cardTime ?? 0);
            const current = Number.isFinite(numericCurrent) ? numericCurrent : 0;
            const nextValue = Math.min(MAX_CARD_TIME, current + steps);
            if (nextValue === current) {
                return;
            }
            character.cardTime = nextValue.toString();
            didChange = true;
        });
    });

    return didChange;
};

const scheduleNextRun = () => {
    if (typeof window === "undefined") {
        return;
    }
    if (timerId !== null) {
        window.clearTimeout(timerId);
    }

    const now = new Date();
    const nextRunAt = getNextSixAm(now);
    const delay = Math.max(0, nextRunAt.getTime() - now.getTime());

    timerId = window.setTimeout(() => {
        timerId = null;
        void runCycle();
    }, delay);
};

const runCycle = async () => {
    if (isRunning || typeof window === "undefined") {
        return;
    }

    isRunning = true;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        let lastProcessed: Date | undefined;
        if (stored) {
            const parsed = new Date(stored);
            if (!Number.isNaN(parsed.getTime())) {
                lastProcessed = parsed;
            }
        }
        const now = new Date();
        const { pending, latestProcessed } = calculatePendingIncrements(lastProcessed, now);

        const didChange = await incrementCardTimes(pending);
        window.localStorage.setItem(STORAGE_KEY, latestProcessed.toISOString());

        if (didChange) {
            window.dispatchEvent(new CustomEvent("gam:card-time-auto-updated"));
        }

        scheduleNextRun();
    } catch (error) {
        console.error("Failed to run card time scheduler", error);
        scheduleNextRun();
    } finally {
        isRunning = false;
    }
};

export const initCardTimeScheduler = () => {
    if (typeof window === "undefined" || isInitialized) {
        return;
    }

    isInitialized = true;
    void runCycle();
};
