import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface MockAsset {
  id: string;
  name: string;
  type: string;
}

const mockAssetDatabase: MockAsset[] = [
    { id: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
    { id: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
    { id: 'GOOGL', name: 'Alphabet Inc. (Google)', type: 'Stock' },
    { id: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
    { id: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
    { id: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock' },
    { id: 'BTC-USD', name: 'Bitcoin', type: 'Crypto' },
    { id: 'ETH-USD', name: 'Ethereum', type: 'Crypto' },
    { id: 'SOL-USD', name: 'Solana', type: 'Crypto' },
    { id: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF/Index' },
    { id: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq-100)', type: 'ETF/Index' },
    { id: 'US_TREASURY_10Y', name: 'US 10-Year Treasury Yield', type: 'Market Indicator' },
    { id: 'VIX', name: 'CBOE Volatility Index', type: 'Market Indicator' },
    { id: 'EURUSD=X', name: 'EUR/USD Forex', type: 'Forex' },
    { id: 'GOLD', name: 'Gold Spot Price', type: 'Commodity' },
    { id: 'OIL', name: 'Crude Oil (WTI)', type: 'Commodity' },
    { id: 'US_EMPLOYMENT_MARKET', name: 'US Employment Market', type: 'Market' },
    { id: 'NASDAQ_COMPOSITE', name: 'Nasdaq Composite Index', type: 'Index' },
    { id: 'DOW_JONES_INDUSTRIAL', name: 'Dow Jones Industrial Average', type: 'Index' },
];

export default function SelectAssetsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MockAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Map<string, MockAsset>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      } else {
        navigate('/login');
      }
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const filtered = mockAssetDatabase.filter(asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 10));
  }, [searchTerm]);

  const toggleAssetSelection = (asset: MockAsset) => {
    setSelectedAssets(prev => {
      const newSelection = new Map(prev);
      if (newSelection.has(asset.id)) {
        newSelection.delete(asset.id);
      } else {
        newSelection.set(asset.id, asset);
      }
      return newSelection;
    });
  };

  const handleSaveSelection = async () => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }
    if (selectedAssets.size === 0) {
      setError('Please select at least one asset.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const assetsToSave = Array.from(selectedAssets.values()).map(asset => ({
      user_id: userId,
      asset_identifier: asset.id,
      asset_type: asset.type,
      asset_name: asset.name,
    }));

    const { data, error: insertError } = await supabase
      .from('user_selected_assets')
      .upsert(assetsToSave, { onConflict: 'user_id,asset_identifier', ignoreDuplicates: false })
      .select();

    if (insertError) {
      console.error('Error saving selected assets:', insertError);
      setError(`Failed to save selection: ${insertError.message}`);
    } else {
      setSuccessMessage(`Selection saved! ${data?.length || 0} assets are now being tracked.`);
      setSelectedAssets(new Map());
      setSearchTerm('');
    }
    setIsLoading(false);
  };

  if (!userId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={styles.loadingText}>Loading user session...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigate('/dashboard')}>
          <Text style={styles.backButton}>&larr; Back to Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Assets for Tracking</Text>

        <Text style={styles.label}>Search for Assets</Text>
        <TextInput
          style={styles.input}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="e.g., AAPL, Bitcoin, Nasdaq Composite"
          placeholderTextColor="#888"
        />

        {searchResults.length > 0 && (
          <FlatList
            style={styles.resultsList}
            data={searchResults}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleAssetSelection(item)} style={[styles.resultItem, selectedAssets.has(item.id) && styles.selectedItem]}>
                <Text style={styles.resultText}>{item.name} ({item.id})</Text>
                <Text style={styles.resultType}>{item.type}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {searchTerm && searchResults.length === 0 && (
          <Text style={styles.noResults}>No assets found for "{searchTerm}".</Text>
        )}

        {selectedAssets.size > 0 && (
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionTitle}>Selected Assets:</Text>
            <View style={styles.selectedAssetsWrapper}>
              {Array.from(selectedAssets.values()).map(asset => (
                <View key={asset.id} style={styles.selectedAsset}>
                  <Text style={styles.selectedAssetText}>{asset.name}</Text>
                  <TouchableOpacity onPress={() => toggleAssetSelection(asset)}>
                    <Text style={styles.removeButton}>&times;</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
        {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

        <Button
          title={isLoading ? 'Saving...' : `Save ${selectedAssets.size} Selected Asset(s)`}
          onPress={handleSaveSelection}
          disabled={isLoading || selectedAssets.size === 0}
          color="#1E90FF"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  loadingText: { marginTop: 10, color: '#FFF' },
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  card: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 8 },
  backButton: { color: '#1E90FF', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E90FF', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: '#AAA', marginBottom: 8 },
  input: { backgroundColor: '#333', color: '#FFF', borderWidth: 1, borderColor: '#555', borderRadius: 4, padding: 10, marginBottom: 16 },
  resultsList: { maxHeight: 200, marginBottom: 16 },
  resultItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  selectedItem: { backgroundColor: '#1E90FF' },
  resultText: { color: '#FFF' },
  resultType: { color: '#AAA', fontSize: 12 },
  noResults: { color: '#AAA', textAlign: 'center', marginVertical: 10 },
  selectionContainer: { marginVertical: 20 },
  selectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E90FF', marginBottom: 10 },
  selectedAssetsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  selectedAsset: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 },
  selectedAssetText: { color: '#FFF' },
  removeButton: { color: '#FF6347', marginLeft: 8, fontWeight: 'bold' },
  errorText: { color: '#FF6347', textAlign: 'center', marginVertical: 10 },
  successText: { color: '#32CD32', textAlign: 'center', marginVertical: 10 },
});
