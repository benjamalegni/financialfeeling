import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import type { Database } from '../lib/database.types';

interface SelectedAsset {
  id: string;
  asset_identifier: string;
  asset_type: string | null;
  asset_name: string | null;
  notes: string | null;
  selected_at: string;
}

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Button title="Sign Out" onPress={handleSignOut} color="#FF6347" />
  );
};

const TrackedAssetsList = ({ assets }: { assets: SelectedAsset[] }) => {
  if (assets.length === 0) {
    return <Text style={styles.textSecondary}>You are not currently tracking any assets.</Text>;
  }

  return (
    <FlatList
      data={assets}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.assetContainer}>
          <Text style={styles.assetName}>{item.asset_name || item.asset_identifier}</Text>
          {item.asset_type && <Text style={styles.textSecondary}>Type: {item.asset_type}</Text>}
          {item.asset_identifier && item.asset_name && <Text style={styles.textSecondary}>Identifier: {item.asset_identifier}</Text>}
        </View>
      )}
    />
  );
};

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        navigate('/login');
      } else {
        fetchSelectedAssets(session.user.id);
      }
    };

    fetchSession();
  }, [navigate]);

  const fetchSelectedAssets = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_selected_assets')
      .select('*')
      .eq('user_id', userId)
      .order('selected_at', { ascending: false });

    if (error) {
      console.error('Error fetching selected assets:', error.message);
    } else {
      setSelectedAssets(data as SelectedAsset[]);
    }
  };

  if (!session) {
    return null; // or a loading indicator
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.headerRight}>
          <Text style={styles.email}>{session.user.email}</Text>
          <SignOutButton />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tracked Financial Assets</Text>
          <TouchableOpacity onPress={() => navigate('/select-assets')}>
            <Text style={styles.link}>Add / Manage Assets</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {selectedAssets.length > 0 ? (
            <TrackedAssetsList assets={selectedAssets} />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.textSecondary}>You are not tracking any assets yet.</Text>
              <TouchableOpacity onPress={() => navigate('/select-assets')} style={styles.button}>
                <Text style={styles.buttonText}>Select Assets to Track</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Market News & AI Insights</Text>
        <View style={styles.card}>
          <Text style={styles.textSecondary}>News feed and AI-driven financial forecasts will appear here soon.</Text>
          <TouchableOpacity onPress={() => navigate('/ia-analysis')} style={styles.button}>
            <Text style={styles.buttonText}>Go to AI Analysis Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  email: {
    fontSize: 12,
    color: '#AAA',
    marginRight: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#FFF',
  },
  link: {
    color: '#1E90FF',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  assetContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  textSecondary: {
    color: '#AAA',
  },
  centered: {
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
