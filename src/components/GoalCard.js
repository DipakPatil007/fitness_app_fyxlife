import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function GoalCard({ goal, onPress, onSwap }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(goal.progress)).current;

    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: goal.progress,
            friction: 8,
            useNativeDriver: false
        }).start();
    }, [goal.progress]);

    const onPressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            friction: 8,
            useNativeDriver: true
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true
        }).start();
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={() => onPress(goal)}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.card}>
                <View style={styles.row}>
                    <Text style={styles.emoji}>{goal.emoji}</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{goal.title}</Text>
                        <Text style={styles.desc}>{goal.description}</Text>
                    </View>
                </View>
                <View style={styles.progressBase}>
                    <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.percent}>{Math.round(goal.progress * 100)}% complete</Text>
                    {goal.progress >= 1 ? (
                        <View style={styles.completeBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#3BB54A" />
                            <Text style={styles.completeText}>Completed</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => onPress({ ...goal, progress: 1 })}
                            style={styles.completeButton}>
                            <Ionicons name="checkmark-circle-outline" size={14} color="#1E60FF" />
                            <Text style={styles.completeButtonText}>Mark Complete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#ffffffff',
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    emoji: {
        fontSize: 32,
        marginRight: 12
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1F36'
    },
    desc: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
        lineHeight: 18
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },

    swapBtn: {
        backgroundColor: '#F0F4FF',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    swapText: {
        fontSize: 12,
        color: '#1E60FF',
        fontWeight: '600'
    },
    progressBase: {
        height: 8,
        backgroundColor: '#E6E9F2',
        borderRadius: 6,
        overflow: 'hidden',
        marginTop: 16
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3BB54A'
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8
    },
    percent: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500'
    },
    completeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEFBF0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4
    },
    completeText: {
        fontSize: 12,
        color: '#3BB54A',
        fontWeight: '600'
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F4FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4
    },
    completeButtonText: {
        fontSize: 12,
        color: '#1E60FF',
        fontWeight: '600'
    }
});
