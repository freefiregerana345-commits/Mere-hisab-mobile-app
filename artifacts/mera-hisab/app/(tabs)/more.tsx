import React, { useState } from 'react';
import { Alert, Linking, Share, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useApp } from '@/context/AppContext';
import { Button, Card, Field, Header, Screen, SectionTitle, styles } from '@/components/AppUi';
import { useColors } from '@/hooks/useColors';

export default function MoreScreen() {
  const { business, updateBusiness, exportBackup, importBackup, seedDemo, clearDemo, resetProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(business.name); const [phone, setPhone] = useState(business.phone); const [address, setAddress] = useState(business.address); const [upiId, setUpiId] = useState(business.upiId);
  const colors = useColors();
  const save = () => { updateBusiness({ name, phone, address, upiId }); setEditing(false); };
  const backup = async () => {
    try {
      const content = await exportBackup();
      const directory = FileSystem.documentDirectory;
      if (!directory) throw new Error('No local document directory');
      const uri = `${directory}MeraHisab_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      await FileSystem.writeAsStringAsync(uri, content, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Export Mera Hisab backup', UTI: 'public.json' });
      else await Share.share({ title: 'Mera Hisab backup', message: content });
    } catch {
      Alert.alert('Backup failed', 'The local backup could not be exported.');
    }
  };
  const restore = async () => {
    try {
      const picked = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
      if (picked.canceled || !picked.assets?.[0]) return;
      const raw = await FileSystem.readAsStringAsync(picked.assets[0].uri, { encoding: FileSystem.EncodingType.UTF8 });
      Alert.alert('Replace local data?', 'Restoring a backup replaces this profile on the device. Existing records will not be merged.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Replace', style: 'destructive', onPress: async () => { const ok = await importBackup(raw); Alert.alert(ok ? 'Backup restored' : 'Backup not recognized', ok ? 'Your local profile has been restored.' : 'Choose a Mera Hisab JSON backup file.'); } },
      ]);
    } catch {
      Alert.alert('Restore failed', 'The backup could not be imported.');
    }
  };
  const deleteDemo = () => Alert.alert('Delete demo data?', 'This removes only records marked as demo.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: clearDemo }]);
  const reset = () => Alert.alert('Reset this profile?', 'This permanently clears local business records from this device.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => resetProfile() }]);
  return <Screen><Header eyebrow="MORE" title="Settings" /><Card style={styles.profileCard}><View style={[styles.profileLogo, { backgroundColor: colors.primary }]}><Feather name="book-open" size={24} color={colors.primaryForeground} /></View><View style={{ flex: 1, marginLeft: 12 }}><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800' }}>{business.name}</Text><Text style={{ color: colors.mutedForeground, marginTop: 3 }}>{business.phone || 'Add your phone number'}</Text></View><Button label="Edit" onPress={() => setEditing(true)} variant="secondary" /></Card>{editing ? <Card><Field label="Shop name" value={name} onChangeText={setName} /><Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /><Field label="Address" value={address} onChangeText={setAddress} multiline /><Field label="UPI ID" value={upiId} onChangeText={setUpiId} placeholder="yourshop@upi" /><Button label="Save shop details" onPress={save} /></Card> : null}<SectionTitle title="Business tools" /><SettingRow icon="download" title="Export local backup" body="Create and share a JSON file" onPress={backup} /><SettingRow icon="upload" title="Import backup" body="Replace this profile from a JSON file" onPress={restore} /><SettingRow icon="database" title="Load demo records" body="Explore billing, stock, and khata together" onPress={seedDemo} /><SettingRow icon="trash-2" title="Delete demo records" body="Remove only sample data" danger onPress={deleteDemo} /><SectionTitle title="Payment & sharing" /><SettingRow icon="smartphone" title="UPI payments" body={business.upiId ? business.upiId : 'Add UPI ID in shop details'} onPress={() => setEditing(true)} /><SettingRow icon="message-circle" title="WhatsApp sharing" body="Uses your device share sheet, never sends automatically" onPress={() => Linking.openURL('https://wa.me/').catch(() => undefined)} /><SectionTitle title="Profile management" /><SettingRow icon="shield" title="Local-only privacy" body="Your business data never leaves this device" onPress={() => Alert.alert('Local-first', 'Mera Hisab stores records locally. Use Export local backup to keep a copy with you.')} /><SettingRow icon="alert-triangle" title="Reset profile data" body="Clear all local records" danger onPress={reset} /><Text style={{ color: colors.mutedForeground, textAlign: 'center', fontSize: 12, marginTop: 16 }}>Mera Hisab · Free, offline-first shop management</Text></Screen>;
}

function SettingRow({ icon, title, body, onPress, danger }: { icon: keyof typeof Feather.glyphMap; title: string; body: string; onPress: () => void; danger?: boolean }) { const colors = useColors(); return <Card onPress={onPress} style={styles.settingRow}><View style={[styles.settingIcon, { backgroundColor: danger ? '#fff0f1' : colors.secondary }]}><Feather name={icon} size={18} color={danger ? colors.destructive : colors.primary} /></View><View style={{ flex: 1, marginLeft: 12 }}><Text style={{ color: danger ? colors.destructive : colors.foreground, fontWeight: '700' }}>{title}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4 }}>{body}</Text></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></Card>; }