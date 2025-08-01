import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'MozillaHeadline': require('../../assets/fonts/MozillaHeadline-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading Mozilla Headline font:', error);
        setFontsLoaded(true); // Fallback to system font
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
}; 