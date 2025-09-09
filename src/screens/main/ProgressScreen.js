import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getCompletions } from '../../services/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
    const [completions, setCompletions] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0
    });

    useEffect(() => {
        const fetchCompletions = async () => {
            const stats = await getCompletions();
            setCompletions(stats);
        };
        fetchCompletions();
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
            <ScrollView style={styles.container}>
                <Text style={styles.header}>Progress Summary</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.emoji}>📅</Text>
                            <Text style={styles.label}>Today's Goals</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{completions.daily}</Text>
                            <Text style={styles.subText}>completed</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.emoji}>📊</Text>
                            <Text style={styles.label}>This Week</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{completions.weekly}</Text>
                            <Text style={styles.subText}>completed</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.emoji}>📈</Text>
                            <Text style={styles.label}>This Month</Text>
                        </View>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{completions.monthly}</Text>
                            <Text style={styles.subText}>completed</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.tip}>
                    💡 Complete your daily goals to improve your streak!
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    header: {
        fontSize: 24,
        fontWeight: '800',
        marginVertical: 20,
        textAlign: 'center',
        color: '#1A1F36'
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    emoji: {
        fontSize: 24,
        marginRight: 12
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1F36'
    },
    valueContainer: {
        alignItems: 'flex-end'
    },
    value: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E60FF'
    },
    subText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
    },
    tip: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
        paddingHorizontal: 16
    }
});
