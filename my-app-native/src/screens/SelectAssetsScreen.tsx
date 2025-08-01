import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TextInput 
} from 'react-native';
import { supabase } from '../lib/supabaseClient';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  description?: string;
}

const SelectAssetsScreen = ({ navigation }: any) => {
  const [session, setSession] = React.useState<any>(null);
  const [selectedAssets, setSelectedAssets] = React.useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // Mock data - en una aplicación real esto vendría de una API
  const availableAssets: Asset[] = [
    { id: '1', name: 'Apple Inc.', symbol: 'AAPL', type: 'Stock', description: 'Technology company' },
    { id: '2', name: 'Microsoft Corporation', symbol: 'MSFT', type: 'Stock', description: 'Technology company' },
    { id: '3', name: 'Tesla Inc.', symbol: 'TSLA', type: 'Stock', description: 'Electric vehicle company' },
    { id: '4', name: 'Bitcoin', symbol: 'BTC', type: 'Cryptocurrency', description: 'Digital currency' },
    { id: '5', name: 'Ethereum', symbol: 'ETH', type: 'Cryptocurrency', description: 'Digital currency' },
    { id: '6', name: 'Gold ETF', symbol: 'GLD', type: 'ETF', description: 'Gold investment fund' },
    { id: '7', name: 'S&P 500 ETF', symbol: 'SPY', type: 'ETF', description: 'S&P 500 index fund' },
    { id: '8', name: 'Amazon.com Inc.', symbol: 'AMZN', type: 'Stock', description: 'E-commerce company' },
  ];

  React.useEffect(() => {
    getSession();
  }, []);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  const toggleAssetSelection = (asset: Asset) => {
    const isSelected = selectedAssets.some(selected => selected.id === asset.id);
    
    if (isSelected) {
      setSelectedAssets(selectedAssets.filter(selected => selected.id !== asset.id));
    } else {
      setSelectedAssets([...selectedAssets, asset]);
    }
  };

  const saveSelectedAssets = async () => {
    if (!session?.user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (selectedAssets.length === 0) {
      Alert.alert('Error', 'Please select at least one asset');
      return;
    }

    setIsLoading(true);

    try {
      // Delete existing selections
      await supabase
        .from('user_selected_assets')
        .delete()
        .eq('user_id', session.user.id);

      // Insert new selections
      const assetsToInsert = selectedAssets.map(asset => ({
        user_id: session.user.id,
        asset_identifier: asset.symbol,
        asset_type: asset.type,
        asset_name: asset.name,
        notes: asset.description || null,
      }));

      const { error } = await supabase
        .from('user_selected_assets')
        .insert(assetsToInsert);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Success', 
          'Assets saved successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save assets');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssets = availableAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAssetSelected = (asset: Asset) => {
    return selectedAssets.some(selected => selected.id === asset.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Assets</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search assets..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.assetsList}>
        {filteredAssets.map(asset => (
          <TouchableOpacity
            key={asset.id}
            style={[
              styles.assetCard,
              isAssetSelected(asset) && styles.selectedAssetCard
            ]}
            onPress={() => toggleAssetSelection(asset)}
          >
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{asset.name}</Text>
              <Text style={styles.assetSymbol}>{asset.symbol}</Text>
              <Text style={styles.assetType}>{asset.type}</Text>
              {asset.description && (
                <Text style={styles.assetDescription}>{asset.description}</Text>
              )}
            </View>
            <View style={[
              styles.selectionIndicator,
              isAssetSelected(asset) && styles.selectedIndicator
            ]} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedAssets.length} asset(s) selected
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={saveSelectedAssets}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Selection'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 50,
  },
  searchContainer: {
    padding: 20,
    paddingTop: 10,
  },
  searchInput: {
    height: 45,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  assetsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  assetCard: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedAssetCard: {
    borderColor: '#007AFF',
    backgroundColor: '#1a3a5a',
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  assetSymbol: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 3,
  },
  assetType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  assetDescription: {
    fontSize: 12,
    color: '#666',
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333',
    alignSelf: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  selectedCount: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectAssetsScreen; 