import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { saveItem } from '../../services/storage';
import { StorageKeys } from '../../services/storage';

export default function ConfirmationScreen({ navigation, route }) {
    const { user } = route.params;

    const finishOnboarding = async () => {
        try {
            console.log('Saving user:', user);
            await saveItem(StorageKeys.USER, user);
            await saveItem(StorageKeys.ONBOARDED, true);
            // initialize default goals & data if needed
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        } catch (e) {
            Alert.alert('Error', 'Could not save user info');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hi {user?.name || 'Friend'}, your profile is ready 🎉</Text>
            <Text style={styles.sub}>We will use this to personalize your plan.</Text>
            <TouchableOpacity style={styles.cta} onPress={finishOnboarding}>
                <Text style={{ color: '#FFF', fontWeight: '700' }}>Start Using Fyxlife</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
    sub: { color: '#666', marginTop: 8 },
    cta: { marginTop: 20, backgroundColor: '#1E60FF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 }
});
