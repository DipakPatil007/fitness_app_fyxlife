import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Fyxlife 🌱</Text>
            <Text style={styles.title}>Welcome to Fyxlife</Text>
            <Text style={styles.subtitle}>A small app to help you form healthy habits.</Text>
            <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('UserInfo')}>
                <Text style={styles.ctaText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    logo: { fontSize: 28, fontWeight: '800' },
    title: { fontSize: 22, marginTop: 18, fontWeight: '700' },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 12 },
    cta: { marginTop: 20, backgroundColor: '#1E60FF', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 12 },
    ctaText: { color: '#FFF', fontWeight: '700' }
});
