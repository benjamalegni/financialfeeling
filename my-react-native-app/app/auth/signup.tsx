import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.user && data.user.identities?.length === 0) {
      setMessage("User already exists. Please check your email to confirm your account or try logging in.");
    } else {
      setMessage("Sign up successful! Please check your email to confirm your account.");
    }
    setIsSubmitting(false);
  };

  const handleGitHubSignUp = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#888"
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            placeholderTextColor="#888"
            secureTextEntry
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
          {message && <Text style={styles.successText}>{message}</Text>}

          <Button
            title={isSubmitting ? 'Signing Up...' : 'Sign Up'}
            onPress={handleSignUp}
            disabled={isSubmitting}
            color="#1E90FF"
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or sign up with</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.githubButton}
          onPress={handleGitHubSignUp}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.githubButtonText}>Sign Up with GitHub</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigate('/login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1E1E1E',
    padding: 24,
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
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6347',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#32CD32',
    marginBottom: 10,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#555',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#AAA',
  },
  githubButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  githubButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#AAA',
    textAlign: 'center',
  },
  loginLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});
