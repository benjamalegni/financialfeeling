import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

interface AnalysisDetail {
  impact: string;
  news: string;
  reason: string;
  horizon: string;
}

interface Forecast {
  [assetName: string]: AnalysisDetail;
}

interface AnalysisResponse {
  forecast: Forecast;
}

export default function IaAnalysisPage() {
  const [assetsInput, setAssetsInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const assetsToAnalyze = assetsInput.split(',').map(asset => asset.trim()).filter(asset => asset.length > 0);

    if (assetsToAnalyze.length === 0) {
      setError('Please enter at least one asset to analyze.');
      setIsLoading(false);
      return;
    }

    const requestBody = {
      userData: {
        userId: 'test-user-123',
        tier: 'premium',
      },
      assetsToAnalyze: assetsToAnalyze,
    };

    try {
      const response = await fetch('http://localhost:5678/webhook-test/88371509-3d66-45d6-9482-5999eb94bc42', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: AnalysisResponse[] = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analysis. Make sure your n8n webhook is running and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>AI Financial Analysis</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Assets to Analyze (comma-separated)</Text>
          <TextInput
            style={styles.input}
            value={assetsInput}
            onChangeText={setAssetsInput}
            placeholder="e.g., NASDAQ:AAPL, US_Employment_Market, BTC-USD"
            placeholderTextColor="#888"
          />
          <Text style={styles.subtitle}>Enter asset symbols or economic indicators.</Text>
          <Button
            title={isLoading ? 'Analyzing...' : 'Get Analysis'}
            onPress={handleSubmit}
            disabled={isLoading}
            color="#1E90FF"
          />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading && <ActivityIndicator size="large" color="#1E90FF" />}

        {analysisResult && analysisResult.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Analysis Results</Text>
            {analysisResult.map((resultItem, index) => (
              <View key={index} style={styles.resultItem}>
                {Object.entries(resultItem.forecast).map(([assetName, details]) => (
                  <View key={assetName} style={styles.assetResult}>
                    <Text style={styles.assetName}>{assetName}</Text>
                    <Text style={[styles.impact, { color: details.impact === 'negative' ? '#FF6347' : details.impact === 'positive' ? '#32CD32' : '#FFF' }]}>
                      Impact: {details.impact}
                    </Text>
                    <Text style={styles.horizon}>Horizon: {details.horizon}</Text>
                    <View style={styles.detailsContainer}>
                      <Text style={styles.detailText}><Text style={styles.bold}>News:</Text> {details.news}</Text>
                      <Text style={styles.detailText}><Text style={styles.bold}>Reason:</Text> {details.reason}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        {analysisResult && analysisResult.length === 0 && !isLoading && (
          <Text style={styles.noResults}>No analysis results to display.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 99, 71, 0.2)',
    borderColor: '#FF6347',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 10,
  },
  resultItem: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  assetResult: {
    marginBottom: 16,
  },
  assetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
  impact: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  horizon: {
    fontSize: 14,
    color: '#AAA',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailText: {
    color: '#FFF',
  },
  bold: {
    fontWeight: 'bold',
  },
  noResults: {
    textAlign: 'center',
    color: '#AAA',
    marginTop: 20,
  },
});
