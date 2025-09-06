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

export const updateCompletions = async (goalId) => {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const weekStr = `${today.getFullYear()}-W${Math.ceil((today.getDate() + today.getDay()) / 7)}`;
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
        if (!weeklyCompletions[weekStr].includes(goalId)) {
            weeklyCompletions[weekStr].push(goalId);
            await saveItem(StorageKeys.WEEKLY_COMPLETIONS, weeklyCompletions);
        }

        // Update monthly completions
        const monthlyCompletions = await loadItem(StorageKeys.MONTHLY_COMPLETIONS, {});
        if (!monthlyCompletions[monthStr]) {
            monthlyCompletions[monthStr] = [];
        }
        if (!monthlyCompletions[monthStr].includes(goalId)) {
            monthlyCompletions[monthStr].push(goalId);
            await saveItem(StorageKeys.MONTHLY_COMPLETIONS, monthlyCompletions);
        }
    } catch (e) {
        console.error('Error updating completions', e);
    }
};

export const getCompletions = async () => {
    try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const weekStr = `${today.getFullYear()}-W${Math.ceil((today.getDate() + today.getDay()) / 7)}`;
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
