import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>🌱</Text>
                <Text style={styles.title}>Welcome to Fyxlife</Text>
                <Text style={styles.subtitle}>Your journey to a healthier lifestyle starts here</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UserInfo')}>
                <Text style={styles.ctaText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
        padding: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 72,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1A1F36',
        textAlign: 'center',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#1E60FF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        fontWeight: 'bold'
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
