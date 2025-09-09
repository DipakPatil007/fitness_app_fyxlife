import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GoalCard from '../../components/GoalCard';
import { defaultGoals } from '../../models/mockData';
import { loadItem, saveItem, updateCompletions, StorageKeys as Keys } from '../../services/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
    const [goals, setGoals] = useState([]);
    const navigation = useNavigation();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const [streak, setStreak] = useState(0);
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
            const today = new Date().toISOString().split('T')[0];

            // If last login is not today, reset goals to default
            if (savedLastLogin && savedLastLogin !== today) {
                setGoals(defaultGoals);
                await saveItem(Keys.GOALS, defaultGoals);
            } else {
                setGoals(saved ?? defaultGoals);
            }
            setStreak(savedStreak ?? 0);
            setLastLoginDate(savedLastLogin);
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
        };
        init();
    }, []);

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

    // Reset all app data and navigate to Welcome screen
    const handleReset = async () => {
        Alert.alert(
            'Reset App',
            'Are you sure you want to reset all your data and return to the welcome screen?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await saveItem(Keys.GOALS, null);
                            await saveItem(Keys.STREAK, 0);
                            await saveItem(Keys.LAST_LOGIN_DATE, null);
                            await saveItem(Keys.DAILY_COMPLETIONS, {});
                            await saveItem(Keys.WEEKLY_COMPLETIONS, {});
                            await saveItem(Keys.MONTHLY_COMPLETIONS, {});
                            await saveItem(Keys.USER, null);
                            await saveItem(Keys.ONBOARDED, 'false');
                            await AsyncStorage.setItem('@onboarded', 'false');
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Welcome' }],
                                })
                            );
                        } catch (e) {
                            Alert.alert('Error', 'Failed to reset app data.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
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
                                    onSwap={{}}
                                />
                            ))}
                        </View>
                    ))}

                    <View style={{ height: 12 }} />
                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                        <Text style={styles.resetBtnText}>Reset Everything</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
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
        backgroundColor: '#ffe7beff',
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
        backgroundColor: '#6694ffff',
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
    ,
    resetBtn: {
        marginTop: 24,
        marginHorizontal: 16,
        backgroundColor: '#FF4D4F',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
    },
    resetBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    }
});
