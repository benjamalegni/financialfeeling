import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { supabase } from '../lib/supabaseClient';

interface AnalysisResult {
  id: string;
  asset: string;
  prediction: string;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

const IAAnalysisScreen = ({ navigation }: any) => {
  const [session, setSession] = React.useState<any>(null);
  const [selectedAssets, setSelectedAssets] = React.useState<any[]>([]);
  const [analysisResults, setAnalysisResults] = React.useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

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
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching selected assets:', error.message);
    } else {
      setSelectedAssets(data || []);
    }
  };

  const runAIAnalysis = async () => {
    if (selectedAssets.length === 0) {
      Alert.alert('Error', 'Please select assets first in the Dashboard');
      return;
    }

    setIsAnalyzing(true);

    // Simular análisis de IA (en una aplicación real esto llamaría a una API de IA)
    setTimeout(() => {
      const mockResults: AnalysisResult[] = selectedAssets.map((asset, index) => ({
        id: `analysis_${index}`,
        asset: asset.asset_name || asset.asset_identifier,
        prediction: ['Bullish', 'Bearish', 'Neutral'][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        reasoning: `AI analysis suggests ${asset.asset_name || asset.asset_identifier} shows ${['positive', 'negative', 'mixed'][Math.floor(Math.random() * 3)]} market signals based on recent trading patterns and market sentiment.`,
        timestamp: new Date().toISOString(),
      }));

      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const AnalysisCard = ({ result }: { result: AnalysisResult }) => {
    const getPredictionColor = (prediction: string) => {
      switch (prediction.toLowerCase()) {
        case 'bullish':
          return '#28a745';
        case 'bearish':
          return '#dc3545';
        default:
          return '#ffc107';
      }
    };

    return (
      <View style={styles.analysisCard}>
        <View style={styles.analysisHeader}>
          <Text style={styles.analysisAssetName}>{result.asset}</Text>
          <View style={[
            styles.predictionBadge,
            { backgroundColor: getPredictionColor(result.prediction) }
          ]}>
            <Text style={styles.predictionText}>{result.prediction}</Text>
          </View>
        </View>
        
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confidence:</Text>
          <Text style={styles.confidenceValue}>{result.confidence}%</Text>
        </View>
        
        <Text style={styles.reasoningText}>{result.reasoning}</Text>
        
        <Text style={styles.timestampText}>
          {new Date(result.timestamp).toLocaleDateString()}
        </Text>
      </View>
    );
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
        <Text style={styles.title}>AI Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>AI-Powered Financial Analysis</Text>
          <Text style={styles.infoText}>
            Get intelligent insights and predictions for your selected assets using advanced AI algorithms.
          </Text>
        </View>

        {selectedAssets.length > 0 ? (
          <>
            <View style={styles.assetsSection}>
              <Text style={styles.sectionTitle}>Your Assets</Text>
              <View style={styles.assetsList}>
                {selectedAssets.map((asset, index) => (
                  <View key={index} style={styles.assetItem}>
                    <Text style={styles.assetSymbol}>
                      {asset.asset_identifier}
                    </Text>
                    <Text style={styles.assetName}>
                      {asset.asset_name || asset.asset_identifier}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
              onPress={runAIAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.analyzeButtonText}>Analyzing...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeButtonText}>Run AI Analysis</Text>
              )}
            </TouchableOpacity>

            {analysisResults.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>Analysis Results</Text>
                {analysisResults.map((result) => (
                  <AnalysisCard key={result.id} result={result} />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Assets Selected</Text>
            <Text style={styles.emptyText}>
              Please go to the Dashboard and select assets to analyze.
            </Text>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={styles.navigateButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoText: {
    color: '#999',
    lineHeight: 20,
  },
  assetsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  assetsList: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  assetSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  assetName: {
    fontSize: 14,
    color: '#999',
  },
  analyzeButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 20,
  },
  analysisCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  analysisAssetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  predictionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  predictionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  confidenceLabel: {
    color: '#999',
    fontSize: 14,
    marginRight: 5,
  },
  confidenceValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reasoningText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  timestampText: {
    color: '#666',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  navigateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navigateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default IAAnalysisScreen; 