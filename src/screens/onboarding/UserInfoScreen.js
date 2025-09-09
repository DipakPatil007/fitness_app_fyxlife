import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function UserInfoScreen({ navigation }) {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [activity, setActivity] = useState('');

    const goNext = () => {
        navigation.navigate('Confirmation', { user: { name, age, phone, gender, activity } });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Tell us about you</Text>
            <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
            <TextInput
                placeholder="Age"
                value={age}
                onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Phone number"
                value={phone}
                onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TextInput
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
                style={styles.input}
            />
            <TextInput
                placeholder="Activity level (Low / Moderate / High)"
                value={activity}
                onChangeText={setActivity}
                style={styles.input}
            />
            <TouchableOpacity onPress={goNext} style={styles.next}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff', flexGrow: 1, justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 18, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#E6E9F0', borderRadius: 8, padding: 12, marginBottom: 12 },
    next: { backgroundColor: '#1E60FF', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 }
});
