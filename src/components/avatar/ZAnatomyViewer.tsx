import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SPACING } from '../../constants';

interface ZAnatomyViewerProps {
  size?: number;
  onRegionSelect?: (regionId: string) => void;
}

type AnatomySystem = {
  id: string;
  name: string;
  modelId: string;
  color: string;
};

const ANATOMY_SYSTEMS: AnatomySystem[] = [
  { id: 'muscles', name: 'Muscles', modelId: '31b40fd809b14665b93773936d67c52c', color: '#E53935' },
  { id: 'bones', name: 'Joints', modelId: 'a890d801336047d683d56d8bc676e894', color: '#FDD835' },
  { id: 'nerves', name: 'Nerves', modelId: '3bfe9ac6efd84555a311f8ea50dd174d', color: '#FF9800' },
  { id: 'organs', name: 'Organs', modelId: '5cfafb312f504815aa3fec55735607a6', color: '#43A047' },
  { id: 'blood', name: 'Blood', modelId: '0caae8f894cc40b69f3f78adf14b9665', color: '#D32F2F' },
];

export const ZAnatomyViewer: React.FC<ZAnatomyViewerProps> = ({
  size = 300,
  onRegionSelect,
}) => {
  const [selectedSystem, setSelectedSystem] = useState<AnatomySystem>(ANATOMY_SYSTEMS[0]);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const getSketchfabUrl = (modelId: string): string => {
    return `https://sketchfab.com/models/${modelId}/embed?autostart=1&transparent=0&autospin=0.2&ui_controls=1&ui_infos=0&ui_inspector=0&ui_watermark=0`;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; background-color: #111; }
        #container { width: 100%; height: 100%; position: relative; }
        iframe { width: 100%; height: 100%; border: none; }
        #loading { 
          position: absolute; top: 50%; left: 50%; 
          transform: translate(-50%, -50%); 
          color: #fff; font-family: -apple-system, sans-serif;
        }
      </style>
    </head>
    <body>
      <div id="container">
        <div id="loading">Loading 3D Model...</div>
        <iframe 
          id="sketchfab-iframe"
          src="${getSketchfabUrl(selectedSystem.modelId)}" 
          allow="autoplay; fullscreen; vr" 
          allowvr allowfullscreen 
          mozallowfullscreen="true" 
          webkitallowfullscreen="true">
        </iframe>
      </div>
      <script>
        document.getElementById('sketchfab-iframe').onload = function() {
          document.getElementById('loading').style.display = 'none';
        };
      </script>
    </body>
    </html>
  `;

  const handleLoadEnd = () => {
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.viewerContainer, { width: size, height: size }]}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading 3D Model...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webview}
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={true}
          startInLoadingState={true}
          onLoadEnd={handleLoadEnd}
          originWhitelist={['*']}
        />
      </View>
      
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {ANATOMY_SYSTEMS.map((system) => (
            <Pressable
              key={system.id}
              style={[
                styles.tab,
                selectedSystem.id === system.id && styles.tabActive,
              ]}
              onPress={() => {
                setLoading(true);
                setSelectedSystem(system);
              }}
            >
              <View style={[styles.tabDot, { backgroundColor: system.color }]} />
              <Text
                style={[
                  styles.tabText,
                  selectedSystem.id === system.id && styles.tabTextActive,
                ]}
              >
                {system.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  viewerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#111',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  tabsContainer: {
    marginTop: SPACING.sm,
    width: '100%',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    gap: 4,
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
});

export default ZAnatomyViewer;
