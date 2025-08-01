import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Font from 'expo-font';

interface FontContextType {
  fontsLoaded: boolean;
}

const FontContext = createContext<FontContextType>({ fontsLoaded: false });

export const useFonts = () => useContext(FontContext);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'MozillaHeadline': require('../../assets/fonts/MozillaHeadline-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Si falla la carga, aún así marcar como cargadas para usar fuentes del sistema
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
}; 