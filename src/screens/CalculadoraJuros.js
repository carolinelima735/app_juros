import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Paleta CaBank — roxo vibrante, estilo Nubank
const COLORS = {
  primary: '#7C1FD8',      // roxo principal
  primaryDark: '#5A12A3',  // roxo escuro (header/pressed)
  primaryLight: '#F1E4FC', // roxo bem clarinho (fundo dos cards)
  accent: '#B47CFF',       // lilás de destaque
  success: '#00C86F',      // verde do valor final
  text: '#1A1A2E',
  textMuted: '#7A7A8C',
  white: '#FFFFFF',
  background: '#F7F5FA',
  border: '#E8DFF7',
};

const OPCOES_JUROS = [
  { id: 'melhor_amigo', label: 'Melhor amigo', desc: 'Sem juros, é claro', taxa: 0 },
  { id: 'amigo', label: 'Amigo', desc: 'Uma taxinha camarada', taxa: 0.05 },
  { id: 'colega', label: 'Colega', desc: 'Já não é tão de graça', taxa: 0.10 },
  { id: 'desconhecido', label: 'Desconhecido', desc: 'Risco alto, juro alto', taxa: 0.25 },
];

export default function CalculadoraJuros() {
  const [valor, setValor] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [arredondar, setArredondar] = useState(false);
  const [resultado, setResultado] = useState(0);

  const calcular = () => {
    const numero = parseFloat(valor.replace(',', '.')) || 0;
    const opcao = OPCOES_JUROS.find((o) => o.id === selecionado);
    const taxa = opcao ? opcao.taxa : 0;
    let total = numero + numero * taxa;
    if (arredondar) total = Math.round(total);
    setResultado(total);
  };

  const formatarMoeda = (n) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>CaBank</Text>
        <Text style={styles.headerSubtitle}>Calculadora de juros</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card do valor */}
        <View style={styles.card}>
          <Text style={styles.label}>Dinheiro emprestado</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput
              style={styles.input}
              placeholder="0,00"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
          </View>
        </View>

        {/* Card das opções */}
        <View style={styles.card}>
          <Text style={styles.label}>Quanto a pessoa é sua amiga?</Text>

          {OPCOES_JUROS.map((opcao) => {
            const ativo = selecionado === opcao.id;
            return (
              <TouchableOpacity
                key={opcao.id}
                style={[styles.opcao, ativo && styles.opcaoAtiva]}
                onPress={() => setSelecionado(opcao.id)}
                activeOpacity={0.8}
              >
                <View style={styles.opcaoTextos}>
                  <Text style={[styles.opcaoLabel, ativo && styles.opcaoLabelAtiva]}>
                    {opcao.label}
                  </Text>
                  <Text style={styles.opcaoDesc}>{opcao.desc}</Text>
                </View>
                <View style={styles.opcaoDireita}>
                  <Text style={[styles.opcaoTaxa, ativo && styles.opcaoLabelAtiva]}>
                    {(opcao.taxa * 100).toFixed(0)}%
                  </Text>
                  <View style={[styles.radio, ativo && styles.radioAtivo]}>
                    {ativo && <View style={styles.radioDot} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Card arredondar */}
        <View style={[styles.card, styles.rowBetween]}>
          <Text style={styles.label}>Arredondar valor final?</Text>
          <Switch
            value={arredondar}
            onValueChange={setArredondar}
            trackColor={{ false: '#D9D2E8', true: COLORS.accent }}
            thumbColor={COLORS.white}
          />
        </View>

        {/* Card do resultado */}
        <View style={[styles.card, styles.resultCard]}>
          <Text style={styles.resultLabel}>A pessoa deve te pagar</Text>
          <Text style={styles.resultValue}>R$ {formatarMoeda(resultado)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.botao, !selecionado && styles.botaoDesabilitado]}
          onPress={calcular}
          disabled={!selecionado}
          activeOpacity={0.85}
        >
          <Text style={styles.botaoTexto}>Calcular</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerLogo: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: 14,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#5A12A3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 2,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  opcaoAtiva: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  opcaoTextos: {
    flex: 1,
  },
  opcaoLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  opcaoLabelAtiva: {
    color: COLORS.primaryDark,
  },
  opcaoDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  opcaoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opcaoTaxa: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginRight: 10,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioAtivo: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  resultCard: {
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    paddingVertical: 26,
  },
  resultLabel: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultValue: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  botao: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  botaoDesabilitado: {
    backgroundColor: '#C9B3EC',
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});