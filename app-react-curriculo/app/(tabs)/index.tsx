import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

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

const HANGMAN_WORDS = [
  'SENAI',
  'UNICAP',
  'PYTHON',
  'KOTLIN',
  'REACT',
  'JAVASCRIPT',
  'FRONTEND',
  'DESENVOLVEDOR',
  'ALGORITMO',
  'ESTAGIO',
  'APRENDIZADO',
  'DOCUMENTACAO',
  'EQUIPE',
  'TECNOLOGIA',
  'SUPORTE',
  'PROTOTIPO',
  'PROJETO',
  'MOBILE',
  'WEB',
  'API',
  'BANCO',
  'DADOS',
  'INTEGRACAO',
  'APLICATIVO',
  'USABILIDADE',
  'COTIDIANO',
  'LOGICA',
  'COMUNICACAO',
  'RESPONSABILIDADE',
  'ORGANIZACAO',
  'INFORMATICA',
  'RELATORIO',
  'SERVICOS',
  'AUTONOMIA',
  'CRONOGRAMA',
  'PLANEJAMENTO',
];

const alphabet = Array.from({ length: 26 }, (_, index) =>
  String.fromCharCode(65 + index),
);

type GameState = 'playing' | 'won' | 'lost';

type PortfolioViewProps = {
  onOpenGame: () => void;
};

type HangmanGameProps = {
  onBack: () => void;
};

export default function HomeScreen() {
  const [view, setView] = useState<'portfolio' | 'hangman'>('portfolio');

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {view === 'portfolio' ? (
          <PortfolioView onOpenGame={() => setView('hangman')} />
        ) : (
          <HangmanGame onBack={() => setView('portfolio')} />
        )}
      </ScrollView>
    </View>
  );
}

const PortfolioView = ({ onOpenGame }: PortfolioViewProps) => {
  const handleLinkPress = useCallback(async (link: string) => {
    if (await Linking.canOpenURL(link)) {
      Linking.openURL(link);
    }
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../../assets/images/img.png')}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <Text style={styles.title}>Kristyson Silva</Text>
        <Text style={styles.caption}>
          Recife, Pernambuco • Estudante de Ciência da Computação na UNICAP
        </Text>
        <PrimaryButton label="Abrir jogo da forca" onPress={onOpenGame} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        <Text style={styles.sectionText}>
          Formado em Técnico em Informática pelo SENAI Areias, com experiência em redes,
          suporte e desenvolvimento mobile com Kotlin. Hoje curso Ciência da Computação
          na UNICAP e reforço a base em algoritmos, estruturas de dados e desenvolvimento de sistemas.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Objetivo</Text>
        <Text style={styles.sectionText}>
          Atuar em projetos de tecnologia e inovação, contribuindo com soluções digitais, desenvolvimento de software e
          estratégias de transformação digital. Busco desafios que me permitam aplicar meu conhecimento em tecnologia,
          aprender com profissionais experientes e gerar valor real para os clientes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiência</Text>
        <Text style={styles.sectionText}>
          <Text style={styles.bold}>Instrutor de Educação - SENAI PE</Text> (abr/2024 – atual): Responsável por capacitar alunos para a
          WorldSkills na área de desenvolvimento mobile (Android).
        </Text>
        <Text style={[styles.sectionText, styles.spacedText]}>
          <Text style={styles.bold}>Competidor da WorldSkills - SENAI PE</Text> (2022 – 2023): Desenvolvimento de aplicativos móveis em Kotlin,
          documentação e integração com APIs.
        </Text>
        <Text style={[styles.sectionText, styles.spacedText]}>
          <Text style={styles.bold}>Estagiário em Informática - Nassau Tecnológia</Text> (2022 – 2023): Suporte operacional em Windows e Linux
          (remoto e presencial), montagem/manutenção de hardware e gerenciamento de redes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Formação</Text>
        {['UNICAP – Ciência da Computação (5º período)', 'SENAI – Técnico em Informática (2022)', 'CPM Colégio da Polícia Militar – Ensino Médio (2020)'].map(
          (item) => (
            <View key={item} style={styles.listItem}>
              <Text style={styles.sectionText}>{item}</Text>
            </View>
          ),
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <ContactLink label="Telefone" value="(55) 81 99450-4501" onPress={() => handleLinkPress('tel:+5581994504501')} />
        <ContactLink label="Email" value="kristyson.business@gmail.com" onPress={() => handleLinkPress('mailto:kristyson.business@gmail.com')} />
        <ContactLink label="LinkedIn" value="linkedin.com/in/kristyson-alpino/" onPress={() => handleLinkPress('https://www.linkedin.com/in/kristyson-alpino/')} />
      </View>
    </View>
  );
};

const HangmanGame = ({ onBack }: HangmanGameProps) => {
  const [currentWord, setCurrentWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [inputLetter, setInputLetter] = useState('');
  const maxWrongGuesses = 6;

  const initializeGame = useCallback(() => {
    const randomWord = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setCurrentWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameState('playing');
    setInputLetter('');
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleGuess = useCallback(
    (letter: string) => {
      const normalizedLetter = letter.toUpperCase();
      if (gameState !== 'playing' || !/^[A-Z]$/.test(normalizedLetter)) {
        return;
      }

      setGuessedLetters((previous) => {
        if (previous.has(normalizedLetter)) {
          return previous;
        }

        const updated = new Set(previous);
        updated.add(normalizedLetter);

        if (!currentWord.includes(normalizedLetter)) {
          setWrongGuesses((prev) => {
            const next = prev + 1;
            if (next >= maxWrongGuesses) {
              setGameState('lost');
            }
            return next;
          });
        } else {
          const isComplete = currentWord.split('').every((char) => updated.has(char));
          if (isComplete) {
            setGameState('won');
          }
        }

        return updated;
      });
    },
    [currentWord, gameState],
  );

  const displayWord = useMemo(
    () =>
      currentWord
        .split('')
        .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
        .join(' '),
    [currentWord, guessedLetters],
  );

  const renderHangman = useMemo(() => {
    const head = wrongGuesses > 0 ? 'O' : ' ';
    const body = wrongGuesses > 1 ? '|' : ' ';
    const leftArm = wrongGuesses > 2 ? '/' : ' ';
    const rightArm = wrongGuesses > 3 ? '\\' : ' ';
    const leftLeg = wrongGuesses > 4 ? '/' : ' ';
    const rightLeg = wrongGuesses > 5 ? '\\' : ' ';
    return [
      '  +---+',
      '  |   |',
      `  ${head}   |`,
      ` ${leftArm}${body}${rightArm}  |`,
      ` ${leftLeg} ${rightLeg}  |`,
      '      |',
      '=======',
    ].join('\n');
  }, [wrongGuesses]);

  const statusMessage = useMemo(() => {
    if (gameState === 'won') {
      return `Parabéns! Você descobriu a palavra ${currentWord}.`;
    }
    if (gameState === 'lost') {
      return `Suas tentativas acabaram. A palavra era ${currentWord}.`;
    }
    return `Tentativas restantes: ${maxWrongGuesses - wrongGuesses}`;
  }, [currentWord, gameState, wrongGuesses]);

  return (
    <View style={styles.card}>
      <SecondaryButton label="Voltar para o currículo" onPress={onBack} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jogo da Forca</Text>
        <Text style={styles.hangmanArt}>{renderHangman}</Text>
        <Text style={styles.statusText}>{statusMessage}</Text>
        <Text style={styles.word}>{displayWord}</Text>
      </View>

      {gameState === 'playing' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Digite uma letra</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={inputLetter}
                onChangeText={(text) => setInputLetter(text.toUpperCase())}
                onSubmitEditing={() => {
                  if (inputLetter.length === 1) {
                    handleGuess(inputLetter);
                    setInputLetter('');
                  }
                }}
                placeholder="A"
                maxLength={1}
                autoCapitalize="characters"
                style={styles.input}
              />
              <PrimaryButton
                label="Tentar"
                onPress={() => {
                  if (inputLetter.length === 1) {
                    handleGuess(inputLetter);
                    setInputLetter('');
                  }
                }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Teclado virtual</Text>
            <View style={styles.keyboard}>
              {alphabet.map((letter) => {
                const already = guessedLetters.has(letter);
                const correct = currentWord.includes(letter);
                const variant = already ? (correct ? 'correct' : 'wrong') : undefined;
                return (
                  <KeyboardKey
                    key={letter}
                    label={letter}
                    disabled={already}
                    variant={variant}
                    onPress={() => handleGuess(letter)}
                  />
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Letras tentadas</Text>
            <View style={styles.chips}>
              {Array.from(guessedLetters).map((letter) => {
                const correct = currentWord.includes(letter);
                return (
                  <View
                    key={letter}
                    style={[styles.chip, correct ? styles.chipCorrect : styles.chipWrong]}
                  >
                    <Text style={styles.chipText}>{letter}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <SecondaryButton label="Reiniciar jogo" onPress={initializeGame} />
          </View>
        </>
      )}

      {gameState !== 'playing' && (
        <View style={styles.section}>
          <SecondaryButton
            label={gameState === 'won' ? 'Jogar novamente' : 'Tentar outra'}
            onPress={initializeGame}
          />
        </View>
      )}
    </View>
  );
};

type ContactLinkProps = {
  label: string;
  value: string;
  onPress: () => void;
};

const ContactLink = ({ label, value, onPress }: ContactLinkProps) => (
  <View style={styles.contactRow}>
    <Text style={styles.sectionText}>
      <Text style={styles.bold}>{label}: </Text>
      <Text style={styles.link} onPress={onPress}>
        {value}
      </Text>
    </Text>
  </View>
);

type ButtonProps = {
  label: string;
  onPress: () => void;
};

const PrimaryButton = ({ label, onPress }: ButtonProps) => (
  <Pressable style={[styles.button, styles.primaryButton]} onPress={onPress}>
    <Text style={[styles.buttonText, styles.primaryButtonText]}>{label}</Text>
  </Pressable>
);

const SecondaryButton = ({ label, onPress }: ButtonProps) => (
  <Pressable style={[styles.button, styles.secondaryButton]} onPress={onPress}>
    <Text style={[styles.buttonText, styles.secondaryButtonText]}>{label}</Text>
  </Pressable>
);

type KeyboardKeyProps = {
  label: string;
  disabled: boolean;
  onPress: () => void;
  variant?: 'correct' | 'wrong';
};

const KeyboardKey = ({ label, disabled, onPress, variant }: KeyboardKeyProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.key,
      pressed && !disabled && styles.keyPressed,
      disabled && styles.keyDisabled,
      variant === 'correct' && styles.keyCorrect,
      variant === 'wrong' && styles.keyWrong,
    ]}
  >
    <Text style={styles.keyText}>{label}</Text>
  </Pressable>
);

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
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: COLORS.soft,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.heading,
  },
  caption: {
    textAlign: 'center',
    color: COLORS.text,
  },
  section: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#fff',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.heading,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.heading,
  },
  sectionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  spacedText: {
    marginTop: 6,
  },
  listItem: {
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  contactRow: {
    paddingVertical: 4,
  },
  bold: {
    fontWeight: '700',
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.mutedBorder,
  },
  secondaryButtonText: {
    color: COLORS.heading,
  },
  hangmanArt: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 18,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  word: {
    fontSize: 22,
    letterSpacing: 6,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.mutedBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 18,
    height: 48,
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  key: {
    minWidth: 40,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.mutedBorder,
    backgroundColor: '#eef2f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyDisabled: {
    opacity: 0.7,
  },
  keyCorrect: {
    backgroundColor: '#e8f9eb',
    borderColor: '#86d39a',
    color: '#14532d',
  },
  keyWrong: {
    backgroundColor: '#fde8e8',
    borderColor: '#f1a7a7',
    color: '#7f1d1d',
  },
  keyPressed: {
    transform: [{ scale: 0.97 }],
  },
  keyText: {
    fontWeight: '700',
    color: COLORS.heading,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  chipCorrect: {
    borderColor: '#b7e4be',
    backgroundColor: '#e8f9eb',
  },
  chipWrong: {
    borderColor: '#f3b7b7',
    backgroundColor: '#fde8e8',
  },
  chipText: {
    fontWeight: '600',
    color: COLORS.heading,
  },
});
