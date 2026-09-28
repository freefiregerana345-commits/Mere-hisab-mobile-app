import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp, Customer } from '@/context/AppContext';
import { Button, Card, Header, Screen, SectionTitle, EmptyState, styles } from '@/components/AppUi';
import { CustomerModal, PaymentModal } from '@/components/QuickModals';
import { money, dateLabel } from '@/lib/format';
import { useColors } from '@/hooks/useColors';

export default function KhataScreen() {
  const { customers, ledger } = useApp();
  const [query, setQuery] = useState('');
  const [showCustomer, setShowCustomer] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [payment, setPayment] = useState(false);
  const colors = useColors();
  const balanceFor = (customer: Customer) => customer.openingBalance + ledger.filter((item) => item.customerId === customer.id).reduce((sum, item) => sum + item.credit - item.debit, 0);
  const filtered = customers.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.phone.includes(query));
  return <Screen><Header eyebrow="LEDGER" title="Khata" right={<Button label="Add" onPress={() => setShowCustomer(true)} icon="plus" />} /><View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={17} color={colors.mutedForeground} /><TextInputLike value={query} onChange={setQuery} /></View><View style={[styles.khataBanner, { backgroundColor: colors.primary }]}><View><Text style={{ color: '#cfe0ff', fontSize: 12, fontWeight: '700' }}>TOTAL TO RECEIVE</Text><Text style={{ color: colors.primaryForeground, fontSize: 28, fontWeight: '800', marginTop: 5 }}>{money(Math.max(0, customers.reduce((sum, item) => sum + balanceFor(item), 0)))}</Text></View><Feather name="book-open" size={35} color="#bcd3ff" /></View><SectionTitle title={`${filtered.length} customers`} />{filtered.length ? filtered.map((customer) => { const balance = balanceFor(customer); return <Card key={customer.id} onPress={() => setSelected(customer)} style={styles.customerRow}><View style={[styles.avatarSmall, { backgroundColor: colors.secondary }]}><Text style={{ color: colors.primary, fontWeight: '800' }}>{customer.name.slice(0, 1).toUpperCase()}</Text></View><View style={{ flex: 1, marginLeft: 11 }}><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 15 }}>{customer.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4 }}>{customer.phone || 'No phone number'}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={{ color: balance > 0 ? colors.destructive : colors.primary, fontWeight: '800' }}>{money(Math.abs(balance))}</Text><Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 3 }}>{balance > 0 ? 'will give' : balance < 0 ? 'you owe' : 'settled'}</Text></View></Card>; }) : <EmptyState icon="book-open" title="No customers yet" body="Keep your customer credit and payment history in one simple ledger." action="Add customer" onAction={() => setShowCustomer(true)} />}<CustomerModal visible={showCustomer} onClose={() => setShowCustomer(false)} />{selected ? <CustomerDetail customer={selected} balance={balanceFor(selected)} onClose={() => setSelected(null)} onPayment={() => setPayment(true)} /> : null}{selected ? <PaymentModal visible={payment} customerId={selected.id} customerName={selected.name} balance={balanceFor(selected)} onClose={() => { setPayment(false); setSelected(null); }} /> : null}</Screen>;
}

function TextInputLike({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { TextInput } = require('react-native') as typeof import('react-native');
  const colors = useColors();
  return <TextInput value={value} onChangeText={onChange} placeholder="Search name or phone" placeholderTextColor={colors.mutedForeground} style={{ flex: 1, fontSize: 14, color: colors.foreground, marginLeft: 9 }} />;
}

function CustomerDetail({ customer, balance, onClose, onPayment }: { customer: Customer; balance: number; onClose: () => void; onPayment: () => void }) {
  const { ledger } = useApp();
  const colors = useColors();
  const entries = ledger.filter((item) => item.customerId === customer.id);
  return <View style={[styles.detailPanel, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.detailHeader}><View><Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '800' }}>{customer.name}</Text><Text style={{ color: colors.mutedForeground, marginTop: 3 }}>{customer.phone || 'No mobile saved'}</Text></View><Pressable onPress={onClose}><Feather name="x" size={20} color={colors.mutedForeground} /></Pressable></View><View style={[styles.detailBalance, { backgroundColor: balance > 0 ? '#fff0f1' : colors.secondary }]}><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>CURRENT BALANCE</Text><Text style={{ color: balance > 0 ? colors.destructive : colors.primary, fontSize: 27, fontWeight: '800', marginTop: 4 }}>{money(Math.abs(balance))}</Text><Text style={{ color: colors.mutedForeground, marginTop: 3 }}>{balance > 0 ? 'Customer will give me' : balance < 0 ? 'I have to give customer' : 'All settled'}</Text></View><Button label="Record payment" onPress={onPayment} icon="arrow-down-left" /><SectionTitle title="Ledger history" />{entries.length ? entries.slice(0, 7).map((entry) => <View key={entry.id} style={styles.ledgerRow}><View><Text style={{ color: colors.foreground, fontWeight: '700' }}>{entry.description}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 3 }}>{dateLabel(entry.createdAt)}{entry.method ? ` · ${entry.method}` : ''}</Text></View><Text style={{ color: entry.credit ? colors.destructive : colors.primary, fontWeight: '800' }}>{entry.credit ? '+' : '-'}{money(entry.credit || entry.debit)}</Text></View>) : <Text style={{ color: colors.mutedForeground, textAlign: 'center', paddingVertical: 12 }}>No ledger entries yet.</Text>}</View>;
}