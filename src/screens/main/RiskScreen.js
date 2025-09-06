import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { riskMock } from '../../models/mockData';

export default function RiskScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Risk-o-Meter</Text>
            <Text style={styles.sub}>Point-in-time risk view (mock data)</Text>
            {Object.entries(riskMock).map(([key, val]) => {
                let color = '#4CAF50';
                if (val > 0.6) color = '#FF3B30';
                else if (val > 0.35) color = '#FFAB00';

                return (
                    <View key={key} style={styles.row}>
                        <Text style={styles.label}>{key}</Text>
                        <View style={styles.bar}>
                            <View style={[styles.fill, { width: `${val * 100}%`, backgroundColor: color }]} />
                        </View>
                        <Text style={styles.pct}>{Math.round(val * 100)}%</Text>
                    </View>
                );
            })}
            <View style={{ marginTop: 12 }}>
                <Text style={{ color: '#666' }}>
                    NOTE: These are mock values for a demo. For production we'd compute these from user biomarkers and validated models.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#FFF' },
    header: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
    sub: { textAlign: 'center', color: '#666', marginBottom: 12 },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    label: { width: 100 },
    bar: { flex: 1, height: 12, backgroundColor: '#F0F2F7', borderRadius: 8, overflow: 'hidden', marginHorizontal: 8 },
    fill: { height: '100%', borderRadius: 8 },
    pct: { width: 40, textAlign: 'right' }
});
