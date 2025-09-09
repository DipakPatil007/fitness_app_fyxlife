import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
    ONBOARDED: '@onboarded',
    USER: '@user',
    GOALS: '@goals',
    STREAK: '@streak',
    PROGRESS: '@progress',
    LAST_LOGIN_DATE: '@last_login_date',
    DAILY_COMPLETIONS: '@daily_completions',
    WEEKLY_COMPLETIONS: '@weekly_completions',
    MONTHLY_COMPLETIONS: '@monthly_completions'
};

export const saveItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('Storage save error', e);
    }
};

export const loadItem = async (key, defaultValue = null) => {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return defaultValue;
        return JSON.parse(raw);
    } catch (e) {
        console.error('Storage load error', e);
        return defaultValue;
    }
};

// Helper to get ISO week number
function getISOWeek(date) {
    const tmp = new Date(date.valueOf());
    const dayNum = (date.getDay() + 6) % 7;
    tmp.setDate(tmp.getDate() - dayNum + 3);
    const firstThursday = tmp.valueOf();
    tmp.setMonth(0, 1);
    if (tmp.getDay() !== 4) {
        tmp.setMonth(0, 1 + ((4 - tmp.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tmp) / 604800000);
}

export const updateCompletions = async (goalId) => {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const weekStr = `${today.getFullYear()}-W${getISOWeek(today)}`;
        const monthStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;

        // Update daily completions
        const dailyCompletions = await loadItem(StorageKeys.DAILY_COMPLETIONS, {});
        if (!dailyCompletions[dateStr]) {
            dailyCompletions[dateStr] = [];
        }
        if (!dailyCompletions[dateStr].includes(goalId)) {
            dailyCompletions[dateStr].push(goalId);
            await saveItem(StorageKeys.DAILY_COMPLETIONS, dailyCompletions);
        }

        // Update weekly completions
        const weeklyCompletions = await loadItem(StorageKeys.WEEKLY_COMPLETIONS, {});
        if (!weeklyCompletions[weekStr]) {
            weeklyCompletions[weekStr] = [];
        }
        weeklyCompletions[weekStr].push(goalId);
        await saveItem(StorageKeys.WEEKLY_COMPLETIONS, weeklyCompletions);

        // Update monthly completions
        const monthlyCompletions = await loadItem(StorageKeys.MONTHLY_COMPLETIONS, {});
        if (!monthlyCompletions[monthStr]) {
            monthlyCompletions[monthStr] = [];
        }
        monthlyCompletions[monthStr].push(goalId);
        await saveItem(StorageKeys.MONTHLY_COMPLETIONS, monthlyCompletions);

    } catch (e) {
        console.error('Error updating completions', e);
    }
};

export const getCompletions = async () => {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const weekStr = `${today.getFullYear()}-W${getISOWeek(today)}`;
        const monthStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;

        const dailyCompletions = await loadItem(StorageKeys.DAILY_COMPLETIONS, {});
        const weeklyCompletions = await loadItem(StorageKeys.WEEKLY_COMPLETIONS, {});
        const monthlyCompletions = await loadItem(StorageKeys.MONTHLY_COMPLETIONS, {});

        return {
            daily: dailyCompletions[dateStr]?.length || 0,
            weekly: weeklyCompletions[weekStr]?.length || 0,
            monthly: monthlyCompletions[monthStr]?.length || 0
        };
    } catch (e) {
        console.error('Error getting completions', e);
        return { daily: 0, weekly: 0, monthly: 0 };
    }
};