import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Alert } from 'react-native';
import GoalCard from '../../components/GoalCard';
import ReplaceModal from '../../components/ReplaceModal';
import { defaultGoals } from '../../models/mockData';
import { loadItem, saveItem, updateCompletions, StorageKeys as Keys } from '../../services/storage';

export default function DashboardScreen() {
    const [goals, setGoals] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const [streak, setStreak] = useState(1);
    const [lastLoginDate, setLastLoginDate] = useState(null);

    const updateStreak = async () => {
        const today = new Date().toISOString().split('T')[0];

        // If no last login, this is the first completion
        if (!lastLoginDate) {
            console.log('First completion ever, setting streak to 1');
            setStreak(1);
            setLastLoginDate(today);
            await saveItem(Keys.STREAK, 1);
            await saveItem(Keys.LAST_LOGIN_DATE, today);
            return;
        }

        // If same day, don't update streak
        if (lastLoginDate === today) {
            console.log('Same day, keeping current streak:', streak);
            return;
        }

        // Calculate yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        console.log('Streak check:', {
            lastLoginDate,
            today,
            yesterdayStr,
            currentStreak: streak
        });

        if (lastLoginDate === yesterdayStr) {
            // Last login was yesterday, increment streak
            const newStreak = streak + 1;
            console.log('Incrementing streak to:', newStreak);
            setStreak(newStreak);
            setLastLoginDate(today);
            await saveItem(Keys.STREAK, newStreak);
            await saveItem(Keys.LAST_LOGIN_DATE, today);
        } else {
            // Break in streak, reset to 1
            console.log('Break in streak, resetting to 1');
            setStreak(1);
            setLastLoginDate(today);
            await saveItem(Keys.STREAK, 1);
            await saveItem(Keys.LAST_LOGIN_DATE, today);
        }
    };

    useEffect(() => {
        const init = async () => {
            const saved = await loadItem(Keys.GOALS, null);
            const savedStreak = await loadItem(Keys.STREAK, 1);
            const savedLastLogin = await loadItem(Keys.LAST_LOGIN_DATE, null);
            setGoals(saved ?? defaultGoals);
            setStreak(savedStreak ?? 1);
            setLastLoginDate(savedLastLogin);
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
        };
        init();
    }, []);

    const openReplace = (g) => {
        setSelectedGoal(g);
        setModalVisible(true);
    };

    const handleReplace = async (newGoal) => {
        const updated = goals.map((g) => (g.id === newGoal.id ? newGoal : g));
        setGoals(updated);
        await saveItem(Keys.GOALS, updated);
    };

    const onGoalPress = async (goal) => {
        try {
            // Update streak first
            await updateStreak();

            // Get current daily completions to check if goal was already completed today
            const dailyCompletions = await loadItem(Keys.DAILY_COMPLETIONS, {});
            const currentDate = new Date().toISOString().split('T')[0];
            const todaysCompletions = dailyCompletions[currentDate] || [];

            // Calculate new progress with precision
            const progressIncrement = 0.1;
            const currentProgress = Math.round(goal.progress * 100) / 100;
            const newProgress = Math.min(1, currentProgress + progressIncrement);

            // A goal is considered completed when:
            // 1. It reaches or exceeds 100% progress
            // 2. It hasn't been marked as completed today
            const isNowComplete = newProgress >= 1;
            const wasNotPreviouslyCompleted = !todaysCompletions.includes(goal.id);
            const shouldCountCompletion = isNowComplete && wasNotPreviouslyCompleted;

            console.log('Goal Progress:', {
                goalId: goal.id,
                currentProgress,
                newProgress,
                isNowComplete,
                wasNotPreviouslyCompleted,
                shouldCountCompletion,
                todaysCompletions
            });

            // Update goal progress
            const updated = goals.map((g) => (g.id === goal.id ? { ...g, progress: newProgress } : g));
            setGoals(updated);
            await saveItem(Keys.GOALS, updated);

            // Only update completions if the goal just got completed
            // Only update completions if the goal just got completed
            if (shouldCountCompletion) {
                await updateCompletions(goal.id);
                await updateStreak();
            }
        } catch (error) {
            console.error('Error updating goal progress:', error);
        }
    };

    const swapGoals = async (goal) => {
        // For simplicity: swap selected goal with next one
        const idx = goals.findIndex((g) => g.id === goal.id);
        if (idx < 0) return;
        const nextIdx = (idx + 1) % goals.length;
        const copy = [...goals];
        [copy[idx], copy[nextIdx]] = [copy[nextIdx], copy[idx]];
        setGoals(copy);
        await saveItem(Keys.GOALS, copy);
    };

    // Update resetProgress to also reset lastLoginDate
    const resetProgress = async () => {
        // Reset all goals progress
        const reset = goals.map((g) => ({ ...g, progress: 0 }));
        setGoals(reset);
        await saveItem(Keys.GOALS, reset);

        // Reset streak
        setStreak(0);
        await saveItem(Keys.STREAK, 0);
        setLastLoginDate(null);
        await saveItem(Keys.LAST_LOGIN_DATE, null);

        // Reset today's completions
        const dailyCompletions = await loadItem(Keys.DAILY_COMPLETIONS, {});
        const today = new Date().toISOString().split('T')[0];
        if (dailyCompletions[today]) {
            delete dailyCompletions[today];
            await saveItem(Keys.DAILY_COMPLETIONS, dailyCompletions);
        }

        Alert.alert('Reset Complete', 'All progress and today\'s completions have been reset.');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text style={styles.header}>Daily Dashboard</Text>

                <Animated.View style={[styles.streakBox, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={styles.streakText}>🔥 Streak: {streak} day{streak === 1 ? '' : 's'}</Text>
                </Animated.View>

                <Text style={styles.sub}>Your Daily Goals</Text>

                {/* Group goals by category */}
                {Object.entries(
                    goals.reduce((acc, goal) => {
                        if (!acc[goal.category]) {
                            acc[goal.category] = [];
                        }
                        acc[goal.category].push(goal);
                        return acc;
                    }, {})
                ).map(([category, categoryGoals]) => (
                    <View key={category}>
                        <Text style={styles.categoryTitle}>{category}</Text>
                        {categoryGoals.map((g) => (
                            <GoalCard
                                key={g.id}
                                goal={g}
                                onPress={onGoalPress}
                                onSwap={(goal) => swapGoals(goal)}
                            />
                        ))}
                    </View>
                ))}

                <View style={{ height: 12 }} />

                <TouchableOpacity style={styles.actionBtn} onPress={() => { setModalVisible(true); setSelectedGoal(goals[0] ?? null); }}>
                    <Text style={styles.actionText}>Replace a Goal</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, { marginTop: 8, backgroundColor: '#EFF3FF' }]} onPress={resetProgress}>
                    <Text style={[styles.actionText, { color: '#1E60FF' }]}>Reset Progress</Text>
                </TouchableOpacity>

                <View style={{ height: 80 }} />
            </ScrollView>

            <ReplaceModal
                visible={modalVisible}
                initial={selectedGoal}
                onClose={() => setModalVisible(false)}
                onReplace={handleReplace}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8
    },
    streakBox: {
        backgroundColor: '#FFF6E6',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        marginHorizontal: 4,
        alignItems: 'center'
    },
    streakText: {
        fontWeight: '800'
    },
    sub: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1F36',
        marginTop: 24,
        marginBottom: 16,
        marginLeft: 4
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 4
    },
    actionBtn: {
        backgroundColor: '#1E60FF',
        marginTop: 12,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 4
    },
    actionText: {
        color: '#FFF',
        fontWeight: '700'
    }
});
