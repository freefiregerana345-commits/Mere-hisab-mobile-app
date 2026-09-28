import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Button, Card, Header, Loading, Screen, SectionTitle, styles } from '@/components/AppUi';
import { CustomerModal, ExpenseModal, ProductModal, SaleModal } from '@/components/QuickModals';
import { money, dateLabel, todayKey } from '@/lib/format';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const { business, sales, products, customers, expenses, ledger, seedDemo, ready } = useApp();
  const [modal, setModal] = useState<'sale' | 'customer' | 'product' | 'expense' | null>(null);
  const colors = useColors();
  const today = todayKey();
  const todaysSales = sales.filter((item) => item.createdAt.slice(0, 10) === today);
  const salesTotal = todaysSales.reduce((sum, item) => sum + item.total, 0);
  const expensesTotal = expenses.filter((item) => item.createdAt.slice(0, 10) === today).reduce((sum, item) => sum + item.amount, 0);
  const receivable = customers.reduce((sum, customer) => sum + customer.openingBalance + ledger.filter((entry) => entry.customerId === customer.id).reduce((balance, entry) => balance + entry.credit - entry.debit, 0), 0);
  const lowStock = products.filter((item) => item.stock <= item.minStock);
  const quickActions = [
    { label: 'Sale', icon: 'shopping-bag' as const, modal: 'sale' as const },
    { label: 'Customer', icon: 'user-plus' as const, modal: 'customer' as const },
    { label: 'Product', icon: 'package' as const, modal: 'product' as const },
    { label: 'Expense', icon: 'file-minus' as const, modal: 'expense' as const },
  ];
  if (!ready) return <Screen scroll={false}><Loading /></Screen>;
  return <Screen><Header eyebrow={business.name} title="Good morning" right={<Pressable onPress={() => Alert.alert('Mera Hisab', 'Your records stay on this device.')}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={{ color: colors.primaryForeground, fontWeight: '800' }}>{business.name.slice(0, 1).toUpperCase()}</Text></View></Pressable>} /><Card style={styles.heroCard}><View><Text style={{ color: colors.secondaryForeground, fontSize: 13, fontWeight: '700' }}>TODAY'S SALES</Text><Text style={{ color: colors.foreground, fontSize: 33, fontWeight: '800', marginTop: 6 }}>{money(salesTotal)}</Text><Text style={{ color: colors.mutedForeground, marginTop: 5 }}>{todaysSales.length} bills · {money(expensesTotal)} expenses</Text></View><View style={[styles.heroIcon, { backgroundColor: colors.primary }]}><Feather name="trending-up" size={23} color={colors.primaryForeground} /></View></Card><View style={styles.metricGrid}><Metric label="To receive" value={money(Math.max(0, receivable))} icon="arrow-down-left" /><Metric label="Products" value={String(products.length)} icon="package" /><Metric label="Customers" value={String(customers.length)} icon="users" /><Metric label="Low stock" value={String(lowStock.length)} icon="alert-circle" danger={lowStock.length > 0} /></View><SectionTitle title="Quick actions" /><View style={styles.quickGrid}>{quickActions.map((item) => <Pressable testID={`quick-${item.label}`} key={item.label} onPress={() => setModal(item.modal)} style={({ pressed }) => [styles.quickAction, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}><View style={[styles.quickIcon, { backgroundColor: colors.secondary }]}><Feather name={item.icon} size={18} color={colors.primary} /></View><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 13 }}>{item.label}</Text></Pressable>)}</View><SectionTitle title="Recent bills" action="View all" onAction={() => undefined} />{sales.length ? sales.slice(0, 3).map((sale) => <Card key={sale.id} style={styles.listCard}><View><Text style={{ color: colors.foreground, fontWeight: '700' }}>{sale.customerName}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4 }}>{sale.invoiceNo} · {dateLabel(sale.createdAt)}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={{ color: colors.foreground, fontWeight: '800' }}>{money(sale.total)}</Text><Text style={{ color: sale.due ? colors.destructive : colors.primary, fontSize: 12, marginTop: 4 }}>{sale.due ? `${money(sale.due)} due` : 'Paid'}</Text></View></Card>) : <Card style={{ paddingVertical: 20 }}><Text style={{ color: colors.mutedForeground, textAlign: 'center' }}>No bills yet. Start with a quick sale.</Text></Card>}<SectionTitle title="Getting started" /><Card><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 16 }}>Set up your first shop day</Text><Text style={{ color: colors.mutedForeground, lineHeight: 19, marginTop: 6 }}>Load sample records to explore the complete flow, then delete them when you're ready.</Text><View style={{ flexDirection: 'row', gap: 9, marginTop: 14 }}><Button label="Load demo data" onPress={seedDemo} variant="secondary" icon="star" /><Button label="Add sale" onPress={() => setModal('sale')} icon="plus" /></View></Card><SaleModal visible={modal === 'sale'} onClose={() => setModal(null)} /><CustomerModal visible={modal === 'customer'} onClose={() => setModal(null)} /><ProductModal visible={modal === 'product'} onClose={() => setModal(null)} /><ExpenseModal visible={modal === 'expense'} onClose={() => setModal(null)} /></Screen>;
}

function Metric({ label, value, icon, danger }: { label: string; value: string; icon: keyof typeof Feather.glyphMap; danger?: boolean }) {
  const colors = useColors();
  return <Card style={styles.metric}><View style={[styles.metricIcon, { backgroundColor: danger ? '#fff0f1' : colors.secondary }]}><Feather name={icon} size={16} color={danger ? colors.destructive : colors.primary} /></View><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 10 }}>{label}</Text><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '800', marginTop: 4 }}>{value}</Text></Card>;
}
