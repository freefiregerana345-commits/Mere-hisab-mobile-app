import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useApp, Product } from '@/context/AppContext';
import { Button, Card, EmptyState, Header, Screen, SectionTitle, styles } from '@/components/AppUi';
import { ProductModal } from '@/components/QuickModals';
import { money } from '@/lib/format';
import { useColors } from '@/hooks/useColors';

export default function StockScreen() {
  const { products, addPurchase } = useApp();
  const [showProduct, setShowProduct] = useState(false);
  const [query, setQuery] = useState('');
  const colors = useColors();
  const filtered = products.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.sku.toLowerCase().includes(query.toLowerCase()));
  const quickStock = (product: Product) => { Alert.alert('Add stock', `Add 10 ${product.unit} to ${product.name}?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Add', onPress: () => addPurchase(product.id, 10, product.purchasePrice) }]); };
  return <Screen><Header eyebrow="INVENTORY" title="Stock" right={<Button label="Add product" onPress={() => setShowProduct(true)} icon="plus" />} /><View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={17} color={colors.mutedForeground} /><TextInputLike value={query} onChange={setQuery} /></View><View style={styles.stockSummary}><Card style={{ flex: 1, marginRight: 6 }}><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>PRODUCTS</Text><Text style={{ color: colors.foreground, fontSize: 23, fontWeight: '800', marginTop: 4 }}>{products.length}</Text></Card><Card style={{ flex: 1, marginLeft: 6 }}><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>LOW STOCK</Text><Text style={{ color: colors.destructive, fontSize: 23, fontWeight: '800', marginTop: 4 }}>{products.filter((item) => item.stock <= item.minStock).length}</Text></Card></View><SectionTitle title="All products" />{filtered.length ? filtered.map((product) => { const low = product.stock <= product.minStock; return <Card key={product.id} style={styles.productRow}><View style={[styles.productIcon, { backgroundColor: low ? '#fff0f1' : colors.secondary }]}><Feather name="package" size={19} color={low ? colors.destructive : colors.primary} /></View><View style={{ flex: 1, marginLeft: 11 }}><Text style={{ color: colors.foreground, fontWeight: '800' }}>{product.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4 }}>{money(product.sellingPrice)} / {product.unit} · {product.category}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={{ color: low ? colors.destructive : colors.foreground, fontWeight: '800' }}>{product.stock} {product.unit}</Text><Pressable onPress={() => quickStock(product)} style={{ marginTop: 6 }}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>+ Add stock</Text></Pressable></View></Card>; }) : <EmptyState icon="package" title="No products yet" body="Add your first product to track stock and speed up billing." action="Add product" onAction={() => setShowProduct(true)} />}<ProductModal visible={showProduct} onClose={() => setShowProduct(false)} /></Screen>;
}

function TextInputLike({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { TextInput } = require('react-native') as typeof import('react-native');
  const colors = useColors();
  return <TextInput value={value} onChangeText={onChange} placeholder="Search products" placeholderTextColor={colors.mutedForeground} style={{ flex: 1, fontSize: 14, color: colors.foreground, marginLeft: 9 }} />;
}