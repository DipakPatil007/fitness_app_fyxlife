import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { loadItem, StorageKeys } from '../../services/storage';

const calculateRiskPercentage = (age, baseRisk, riskFactors) => {
    // Base risk increases with age
    let risk = baseRisk;

    // Increase risk based on age brackets
    if (age >= 30) risk += 5;
    if (age >= 40) risk += 10;
    if (age >= 50) risk += 15;
    if (age >= 60) risk += 20;

    // Apply risk factors
    risk += riskFactors;

    // Cap the risk at 100%
    return Math.min(risk, 100);
};

const getRiskLevel = (percentage) => {
    if (percentage < 20) return 'low';
    if (percentage < 50) return 'moderate';
    return 'high';
};

const getRiskCategories = (age = 35) => {
    const calculateRisk = (baseRisk, riskFactors) => {
        const percentage = calculateRiskPercentage(age, baseRisk, riskFactors);
        const roundedPercentage = Math.round(percentage);
        return {
            percentage: roundedPercentage,
            level: getRiskLevel(roundedPercentage)
        };
    };

    return [
        {
            title: 'Cardiovascular',
            emoji: '❤️',
            risks: [
                {
                    name: 'Heart Disease',
                    ...calculateRisk(10, 5)
                },
                {
                    name: 'High Blood Pressure',
                    riskFactors: 8,
                    ...calculateRisk(15, 8)
                },
            ]
        },
        {
            title: 'Metabolic',
            emoji: '🔄',
            risks: [
                {
                    name: 'Type 2 Diabetes',
                    ...calculateRisk(12, 6)
                },
                {
                    name: 'Obesity',
                    ...calculateRisk(15, 5)
                },
            ]
        },
        {
            title: 'Musculoskeletal',
            emoji: '🦴',
            risks: [
                {
                    name: 'Osteoarthritis',
                    baseRisk: 8,
                    riskFactors: 12,
                    ...calculateRisk(8, 12)
                },
                {
                    name: 'Back Pain',
                    baseRisk: 20,
                    riskFactors: 10,
                    ...calculateRisk(20, 10)
                },
            ]
        },
        {
            title: 'Respiratory',
            emoji: '🫁',
            risks: [
                {
                    name: 'Asthma',
                    baseRisk: 5,
                    riskFactors: 3,
                    ...calculateRisk(5, 3)
                },
                {
                    name: 'Sleep Apnea',
                    baseRisk: 10,
                    riskFactors: 8,
                    ...calculateRisk(10, 8)
                },
            ]
        },
        {
            title: 'Mental Health',
            emoji: '🧠',
            risks: [
                {
                    name: 'Stress',
                    baseRisk: 25,
                    riskFactors: 5,
                    ...calculateRisk(25, 5)
                },
                {
                    name: 'Anxiety',
                    baseRisk: 20,
                    riskFactors: 5,
                    ...calculateRisk(20, 5)
                },
            ]
        }];
}

const RiskLevel = ({ level, percentage }) => {
    const colors = {
        low: '#3BB54A',
        moderate: '#FFB020',
        high: '#FF4842'
    };

    return (
        <View style={[styles.riskLevel, { backgroundColor: colors[level] + '20' }]}>
            <Text style={[styles.riskLevelText, { color: colors[level] }]}>
                {percentage}%
            </Text>
            <Text style={[styles.riskLabel, { color: colors[level] }]}>
                {level.charAt(0).toUpperCase() + level.slice(1)} Risk
            </Text>
        </View>
    );
};

export default function RiskOMeterScreen() {
    const [userAge, setUserAge] = useState(35);
    const [categories, setCategories] = useState(() => getRiskCategories(35));

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const userInfo = await loadItem(StorageKeys.USER_INFO, null);
                const age = userInfo?.age ? parseInt(userInfo.age) : 35;
                setUserAge(age);
                setCategories(getRiskCategories(age));
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        };
        loadUserInfo();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Risk-o-meter ⚠️</Text>
            <Text style={styles.subheader}>Health Risk Assessment (Age: {userAge})</Text>

            {categories.map((category, index) => (
                <View key={index} style={styles.categoryCard}>
                    <View style={styles.categoryHeader}>
                        <Text style={styles.emoji}>{category.emoji}</Text>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                    </View>

                    {category.risks.map((risk, riskIndex) => (
                        <View key={riskIndex} style={styles.riskItem}>
                            <Text style={styles.riskName}>{risk.name}</Text>
                            <RiskLevel
                                level={risk.level}
                                percentage={Math.round(risk.percentage)}
                            />
                        </View>
                    ))}
                </View>
            ))}

            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                    Note: This is a simplified risk assessment based on general health factors.
                    Please consult healthcare professionals for accurate medical advice.
                </Text>
            </View>
        </ScrollView>
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
        color: '#1A1F36',
        marginTop: 20,
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    subheader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    categoryCard: {
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
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 24,
        marginRight: 12,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1F36',
    },
    riskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    riskName: {
        fontSize: 16,
        color: '#1A1F36',
    },
    riskLevel: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 90,
    },
    riskLevelText: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    riskLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    disclaimer: {
        padding: 16,
        marginBottom: 24,
    },
    disclaimerText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
});
