import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  cacheDirectory,
  documentDirectory,
  downloadAsync,
  getContentUriAsync,
  getInfoAsync,
} from 'expo-file-system';

const COLORS = {
  text: '#000000',
  heading: '#0b1a44',
  cardBg: '#ffffff',
  appBg: '#16162cff',
  border: '#e6e8ec',
  mutedBorder: '#c9cdd5',
  primary: '#0b1a44',
  primaryHover: '#132a6b',
  soft: '#f5f7fb',
};

type DownloadItem = {
  id: string;
  title: string;
  description: string;
  filename: string;
  remoteUrl: string;
};

type DownloadState = {
  localUri?: string;
  downloading: boolean;
  error?: string;
};

const FILES: DownloadItem[] = [
  {
    id: 'cv',
    title: 'Currículo em PDF',
    description: 'Versão atualizada do currículo para envio rápido.',
    filename: 'curriculo.pdf',
    remoteUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'portfolio',
    title: 'Portfólio com miniapps',
    description: 'Resumo visual com projetos mobile/web e links para repositórios.',
    filename: 'portfolio.pdf',
    remoteUrl: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 'slides',
    title: 'Apresentação em slides',
    description: 'Apresentação curta para entrevistas técnicas.',
    filename: 'apresentacao.pdf',
    remoteUrl: 'https://gahp.net/wp-content/uploads/2017/09/sample.pdf',
  },
];

export default function DownloadsScreen() {
  const [statusById, setStatusById] = useState<Record<string, DownloadState>>({});

  const targetDirectory = useMemo(
    () => documentDirectory ?? cacheDirectory ?? undefined,
    [],
  );

  useEffect(() => {
    const checkExistingFiles = async () => {
      if (!targetDirectory) return;
      const states: Record<string, DownloadState> = {};
      for (const file of FILES) {
        const path = `${targetDirectory}${file.filename}`;
        const info = await getInfoAsync(path);
        if (info.exists) {
          states[file.id] = { downloading: false, localUri: info.uri };
        } else {
          states[file.id] = { downloading: false };
        }
      }
      setStatusById(states);
    };

    checkExistingFiles();
  }, [targetDirectory]);

  const updateStatus = useCallback((id: string, next: Partial<DownloadState>) => {
    setStatusById((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...next },
    }));
  }, []);

  const handleDownload = useCallback(
    async (item: DownloadItem) => {
      if (!targetDirectory) {
        updateStatus(item.id, {
          error: 'Diretório local indisponível neste dispositivo.',
          downloading: false,
        });
        return;
      }

      updateStatus(item.id, { downloading: true, error: undefined });
      const targetUri = `${targetDirectory}${item.filename}`;

      try {
        const result = await downloadAsync(item.remoteUrl, targetUri);
        updateStatus(item.id, { downloading: false, localUri: result.uri, error: undefined });
      } catch {
        updateStatus(item.id, {
          downloading: false,
          error: 'Falha ao salvar offline. Verifique a conexão e tente novamente.',
        });
      }
    },
    [targetDirectory, updateStatus],
  );

  const handleOpen = useCallback(async (item: DownloadItem, localUri?: string) => {
    if (localUri) {
      const uri =
        Platform.OS === 'android'
          ? await getContentUriAsync(localUri)
          : localUri;
      Linking.openURL(uri);
      return;
    }

    const supported = await Linking.canOpenURL(item.remoteUrl);
    if (supported) {
      Linking.openURL(item.remoteUrl);
    }
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Downloads</Text>
            <Text style={styles.caption}>
              Centralize o PDF do currículo, portfólio e slides com opção de salvar para uso offline ou abrir direto
              do app.
            </Text>
          </View>

          <View style={styles.list}>
            {FILES.map((file) => {
              const status = statusById[file.id] ?? { downloading: false };
              return (
                <View key={file.id} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{file.title}</Text>
                    <Text style={styles.itemDescription}>{file.description}</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <Pressable
                      style={[styles.button, styles.primaryButton, status.downloading && styles.buttonDisabled]}
                      disabled={status.downloading}
                      onPress={() => handleDownload(file)}
                    >
                      <Text style={[styles.buttonText, styles.primaryButtonText]}>
                        {status.localUri ? 'Atualizar offline' : 'Salvar offline'}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.secondaryButton]}
                      onPress={() => handleOpen(file, status.localUri)}
                    >
                      <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                        {status.localUri ? 'Abrir offline' : 'Abrir online'}
                      </Text>
                    </Pressable>
                  </View>
                  <View style={styles.statusRow}>
                    {status.downloading && <Text style={styles.statusText}>Baixando...</Text>}
                    {status.localUri && !status.downloading && (
                      <Text style={styles.statusText}>Salvo para uso offline</Text>
                    )}
                    {status.error && <Text style={[styles.statusText, styles.statusError]}>{status.error}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.appBg,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    gap: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.heading,
  },
  caption: {
    color: COLORS.text,
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  item: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fff',
    gap: 10,
  },
  itemHeader: {
    gap: 6,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.heading,
  },
  itemDescription: {
    color: COLORS.text,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  button: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '700',
    color: COLORS.heading,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderColor: COLORS.mutedBorder,
  },
  secondaryButtonText: {
    color: COLORS.heading,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusText: {
    color: COLORS.heading,
    fontSize: 13,
  },
  statusError: {
    color: '#b91c1c',
  },
});
