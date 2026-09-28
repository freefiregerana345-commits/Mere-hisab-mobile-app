import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const content = <View style={[styles.screen, { backgroundColor: colors.background }]}>{children}</View>;
  return scroll ? <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content;
}

export function Header({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: ReactNode }) {
  const colors = useColors();
  return <View style={styles.header}><View style={styles.headerCopy}>{eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}<Text style={[styles.title, { color: colors.foreground }]}>{title}</Text></View>{right}</View>;
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: object; onPress?: () => void }) {
  const colors = useColors();
  const content = <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>;
  return onPress ? <Pressable onPress={onPress} style={({ pressed }) => [pressed && { opacity: 0.82 }]}>{content}</Pressable> : content;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled = false }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: keyof typeof Feather.glyphMap; disabled?: boolean }) {
  const colors = useColors();
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.destructive : variant === 'secondary' ? colors.secondary : 'transparent';
  const fg = variant === 'primary' || variant === 'danger' ? colors.primaryForeground : variant === 'secondary' ? colors.secondaryForeground : colors.primary;
  return <Pressable testID={`button-${label}`} onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, { backgroundColor: bg, borderColor: variant === 'ghost' ? colors.border : bg, opacity: disabled ? 0.5 : pressed ? 0.8 : 1 }]}>{icon ? <Feather name={icon} size={16} color={fg} /> : null}<Text style={[styles.buttonText, { color: fg }]}>{label}</Text></Pressable>;
}

export function IconButton({ icon, onPress, label }: { icon: keyof typeof Feather.glyphMap; onPress: () => void; label: string }) {
  const colors = useColors();
  return <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 }]}><Feather name={icon} size={19} color={colors.primary} /></Pressable>;
}

export function Field({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'numeric' | 'phone-pad'; multiline?: boolean }) {
  const colors = useColors();
  return <View style={styles.field}><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} keyboardType={keyboardType} multiline={multiline} style={[styles.input, { borderColor: colors.input, color: colors.foreground, backgroundColor: colors.card }, multiline && styles.multiline]} /></View>;
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionTitle}><Text style={[styles.sectionTitleText, { color: colors.foreground }]}>{title}</Text>{action && onAction ? <Pressable onPress={onAction}><Text style={[styles.action, { color: colors.primary }]}>{action}</Text></Pressable> : null}</View>;
}

export function EmptyState({ icon, title, body, action, onAction }: { icon: keyof typeof Feather.glyphMap; title: string; body: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <Card style={styles.empty}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={23} color={colors.primary} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{body}</Text>{action && onAction ? <Button label={action} onPress={onAction} icon="plus" /> : null}</Card>;
}

export function ModalShell({ children, title, onClose }: { children: ReactNode; title: string; onClose: () => void }) {
  const colors = useColors();
  return <View style={[styles.modalBackdrop, { backgroundColor: 'rgba(16,35,63,0.38)' }]}><View style={[styles.modal, { backgroundColor: colors.background }]}><View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>{title}</Text><IconButton icon="x" onPress={onClose} label="Close" /></View><ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}</ScrollView></View></View>;
}

export function Loading() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  scrollContent: { paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 7, paddingBottom: 18 },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 5 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.7 },
  card: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  sectionTitleText: { fontSize: 17, fontWeight: '700' },
  action: { fontSize: 13, fontWeight: '700' },
  button: { minHeight: 45, borderRadius: 13, borderWidth: 1, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontSize: 14, fontWeight: '700' },
  iconButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 13 },
  fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, minHeight: 45, paddingHorizontal: 13, fontSize: 15 },
  multiline: { minHeight: 78, paddingTop: 12, textAlignVertical: 'top' },
  empty: { alignItems: 'center', paddingVertical: 28 },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 5 },
  emptyBody: { fontSize: 13, lineHeight: 19, textAlign: 'center', maxWidth: 270, marginBottom: 16 },
  modalBackdrop: { ...StyleSheet.absoluteFill, justifyContent: 'flex-end', zIndex: 50 },
  modal: { maxHeight: '90%', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 18 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 21, fontWeight: '700' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroCard: { backgroundColor: '#eaf1ff', borderColor: '#d2e2ff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 19 },
  heroIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarSmall: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  metric: { width: '50%', marginBottom: 0, padding: 13, borderRadius: 15 },
  metricIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  quickAction: { width: '48%', borderRadius: 15, borderWidth: 1, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  quickIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  listCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  pill: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9 },
  balanceBox: { borderRadius: 15, padding: 15, marginBottom: 14 },
  productPicker: { gap: 8, marginBottom: 12 },
  productOption: { borderWidth: 1, borderRadius: 13, padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  saleSummary: { borderRadius: 13, padding: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, minHeight: 46, marginBottom: 14 },
  khataBanner: { borderRadius: 19, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  customerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  detailPanel: { borderWidth: 1, borderRadius: 21, padding: 16, marginTop: 10, marginBottom: 25 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  detailBalance: { borderRadius: 15, padding: 14, marginBottom: 13 },
  ledgerRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#e8eef7', paddingVertical: 12 },
  billSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoicePaper: { borderWidth: 1, borderRadius: 14, padding: 15, backgroundColor: '#ffffff' },
  divider: { height: 1, marginVertical: 12 },
  invoiceLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  upiNote: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 13, padding: 12, marginTop: 12 },
  stockSummary: { flexDirection: 'row' },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  productIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  profileCard: { flexDirection: 'row', alignItems: 'center' },
  profileLogo: { width: 49, height: 49, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  settingIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});