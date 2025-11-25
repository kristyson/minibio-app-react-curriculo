import { useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

const categories = ['Tudo', 'Experiência', 'Formação', 'Certificações', 'Projetos'] as const;
type Category = (typeof categories)[number];

type TimelineItem = {
  id: string;
  title: string;
  period: string;
  category: Category;
  description: string;
  links?: { label: string; url: string }[];
  tags?: string[];
};

const TIMELINE: TimelineItem[] = [
  {
    id: 'senai-instrutor',
    title: 'Instrutor de Educação - SENAI PE',
    period: 'Abr/2024 – atual',
    category: 'Experiência',
    description:
      'Mentoria e capacitação de alunos focados na WorldSkills em desenvolvimento mobile (Android), com ênfase em Kotlin, documentação e integração com APIs.',
    links: [
      { label: 'Projeto WorldSkills', url: 'https://www.worldskills.org/what/projects/' },
      { label: 'Perfil LinkedIn', url: 'https://www.linkedin.com/in/kristyson-alpino/' },
    ],
    tags: ['Kotlin', 'Mentoria', 'Mobile'],
  },
  {
    id: 'worldskills-competidor',
    title: 'Competidor WorldSkills - SENAI PE',
    period: '2022 – 2023',
    category: 'Projetos',
    description:
      'Desenvolvimento de apps móveis completos, documentação técnica e integração com APIs REST, representando a escola em competições.',
    links: [{ label: 'Regras Mobile Apps', url: 'https://worldskills.org/skills/id/21' }],
    tags: ['APIs', 'Kotlin', 'Android'],
  },
  {
    id: 'estagio-nassau',
    title: 'Estagiário em Informática - Nassau Tecnológia',
    period: '2022 – 2023',
    category: 'Experiência',
    description:
      'Suporte operacional Windows/Linux, montagem e manutenção de hardware, gestão de redes e atendimento remoto/presencial.',
    links: [{ label: 'Nassau Tecnologia', url: 'https://www.nassautecnologia.com.br/' }],
    tags: ['Redes', 'Suporte', 'Linux'],
  },
  {
    id: 'unicap',
    title: 'Bacharelado em Ciência da Computação - UNICAP',
    period: '2021 – atual',
    category: 'Formação',
    description:
      '5º período com foco em algoritmos, estruturas de dados e desenvolvimento de sistemas, explorando integrações web/mobile.',
    tags: ['Estruturas de Dados', 'Algoritmos'],
  },
  {
    id: 'senai-tecnico',
    title: 'Técnico em Informática - SENAI Areias',
    period: '2019 – 2022',
    category: 'Formação',
    description: 'Formação técnica com base prática em redes, suporte e fundamentos de programação.',
    tags: ['Redes', 'Programação'],
  },
  {
    id: 'cert-kotlin',
    title: 'Certificação Kotlin + Android',
    period: '2023',
    category: 'Certificações',
    description: 'Cursos focados em Kotlin e arquitetura de apps Android para refino do domínio mobile.',
    links: [{ label: 'Documentação Kotlin', url: 'https://kotlinlang.org/docs/home.html' }],
    tags: ['Kotlin', 'Android'],
  },
  {
    id: 'projeto-portfolio',
    title: 'Portfólio e miniapps',
    period: '2024',
    category: 'Projetos',
    description: 'Construção de portfólio digital com miniaplicativos (forca, quiz) para demonstrar lógica e UI.',
    links: [{ label: 'Repositório GitHub', url: 'https://github.com/kristyson' }],
    tags: ['React', 'Expo', 'UI'],
  },
];

export default function TimelineScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tudo');

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Tudo') return TIMELINE;
    return TIMELINE.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleLink = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    }
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Linha do tempo</Text>
            <Text style={styles.caption}>
              Cronologia interativa com marcos acadêmicos e profissionais, com filtros por categoria e links
              para evidências.
            </Text>
          </View>

          <View style={styles.filterRow}>
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{category}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.timelineWrap}>
            {filteredItems.map((item, index) => {
              const isLast = index === filteredItems.length - 1;
              return (
                <View key={item.id} style={styles.timelineItem}>
                  <View style={styles.timelineMarkerWrap}>
                    <View style={styles.timelineMarker} />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemPeriod}>{item.period}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    {item.tags && (
                      <View style={styles.tagsRow}>
                        {item.tags.map((tag) => (
                          <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {item.links && (
                      <View style={styles.linksRow}>
                        {item.links.map((link) => (
                          <Pressable key={link.url} onPress={() => handleLink(link.url)}>
                            <Text style={styles.link}>{link.label}</Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
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
    gap: 20,
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.mutedBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  chipText: {
    color: COLORS.heading,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  timelineWrap: {
    gap: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineMarkerWrap: {
    alignItems: 'center',
  },
  timelineMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.soft,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.mutedBorder,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
    gap: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.heading,
  },
  itemPeriod: {
    fontSize: 13,
    color: COLORS.text,
    opacity: 0.8,
  },
  itemDescription: {
    color: COLORS.text,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    color: COLORS.heading,
    fontWeight: '600',
    fontSize: 12,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
