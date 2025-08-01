import * as Font from 'expo-font';

// Test script to verify font loading
const testFontLoading = async () => {
  try {
    console.log('Loading Mozilla Headline font...');
    await Font.loadAsync({
      'MozillaHeadline': require('./assets/fonts/MozillaHeadline-Bold.ttf'),
    });
    console.log('✅ Mozilla Headline font loaded successfully!');
    
    // Check if font is available
    const fonts = await Font.loadAsync({});
    console.log('Available fonts:', Object.keys(fonts));
    
  } catch (error) {
    console.error('❌ Error loading font:', error);
  }
};

export default testFontLoading; 