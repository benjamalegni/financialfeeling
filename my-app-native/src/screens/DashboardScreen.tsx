import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import Header from '../../components/Header';

interface SelectedAsset {
  id: string;
  asset_identifier: string;
  asset_type: string | null;
  asset_name: string | null;
  notes: string | null;
  selected_at: string;
}

const DashboardScreen = ({ navigation }: any) => {
  const [session, setSession] = React.useState<any>(null);
  const [selectedAssets, setSelectedAssets] = React.useState<SelectedAsset[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    getSession();
    fetchSelectedAssets();
  }, []);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  const fetchSelectedAssets = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('user_selected_assets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('selected_at', { ascending: false });

    if (error) {
      console.error('Error fetching selected assets:', error.message);
    } else {
      setSelectedAssets(data || []);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchSelectedAssets();
    setRefreshing(false);
  }, [session]);

  const TrackedAssetsList = ({ assets }: { assets: SelectedAsset[] }) => {
    if (assets.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You are not currently tracking any assets.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.assetsList}>
        {assets.map(asset => (
          <View key={asset.id} style={styles.assetCard}>
            <Text style={styles.assetName}>
              {asset.asset_name || asset.asset_identifier}
            </Text>
            {asset.asset_type && (
              <Text style={styles.assetType}>Type: {asset.asset_type}</Text>
            )}
            {asset.asset_identifier && asset.asset_name && (
              <Text style={styles.assetIdentifier}>
                Identifier: {asset.asset_identifier}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Header showSubtitle={false} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <View style={styles.headerRight}>
            <Text style={styles.userEmail}>{session.user.email}</Text>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tracked Financial Assets</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('SelectAssets')}
            >
              <Text style={styles.addButtonText}>Add Assets</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.assetsContainer}>
            {selectedAssets.length > 0 ? (
              <TrackedAssetsList assets={selectedAssets} />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You are not tracking any assets yet.
                </Text>
                <TouchableOpacity
                  style={styles.selectAssetsButton}
                  onPress={() => navigation.navigate('SelectAssets')}
                >
                  <Text style={styles.selectAssetsButtonText}>
                    Select Assets to Track
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market News & AI Insights</Text>
          <View style={styles.newsContainer}>
            <Text style={styles.newsText}>
              News feed and AI-driven financial forecasts will appear here soon.
            </Text>
            <TouchableOpacity
              style={styles.aiAnalysisButton}
              onPress={() => navigation.navigate('IAAnalysis')}
            >
              <Text style={styles.aiAnalysisButtonText}>
                Go to AI Analysis Page
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  userEmail: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  signOutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  assetsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  assetsList: {
    gap: 10,
  },
  assetCard: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  assetType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  assetIdentifier: {
    fontSize: 10,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  selectAssetsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectAssetsButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  newsText: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 15,
  },
  aiAnalysisButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  aiAnalysisButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DashboardScreen;
