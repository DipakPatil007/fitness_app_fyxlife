import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ReplaceModal({ visible, onClose, onReplace, initial }) {
    const [title, setTitle] = useState(initial?.title || '');
    const [desc, setDesc] = useState(initial?.description || '');
    const [emoji, setEmoji] = useState(initial?.emoji || '✨');

    const handleReplace = () => {
        if (!title) return;
        onReplace({ ...initial, title, description: desc, emoji });
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.heading}>Replace Goal</Text>
                    <TextInput placeholder="Emoji" value={emoji} onChangeText={setEmoji} style={styles.input} />
                    <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
                    <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={[styles.input, { height: 80 }]} multiline />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={onClose} style={[styles.btn, { backgroundColor: '#EEE' }]}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleReplace} style={[styles.btn, { backgroundColor: '#1E60FF' }]}>
                            <Text style={{ color: '#FFF' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    box: { width: '90%', backgroundColor: '#FFF', padding: 16, borderRadius: 10 },
    heading: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 8, marginVertical: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
    btn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 }
});
