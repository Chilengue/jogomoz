import React, { useEffect, useState, useRef } from "react"; 
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const obrasPorEscritor = {
  "Mia Couto": [
    "Terra Sonâmbula","O Último Voo do Flamingo","Jesusalém","Antes de Nascer o Mundo",
    "A Confissão da Leoa","Mulheres de Cinza","Sombras da Água","O Mapeador de Ausências",
    "O fio das missangas","Venenos de Deus, Remédios do Diabo","Contos do nascente","Estórias Abensonhadas"
  ],
  "Paulina Chiziane": [
    "Balada de Amor ao Vento","Niketche: Uma História de Poligamia","O Alegre Canto da Perdiz",
    "Ventos do Apocalipse","As Andorinhas","Na Mão de Deus","Eu, Mulher","O Dia 14",
    "Na Boca do Diabo","Mulher Reclamada"
  ],
  "Ungulani Ba Ka Khosa": [
    "Ualalapi","No Reino dos Abutres","Os Sobreviventes da Noite","Choriro",
    "Entre as Memórias Silenciadas","Cartas de Inhaminga","Gungunhana","A Voz do Meu Irmão",
    "Histórias da Terra e da Água","Memórias da Chibata"
  ],
  "José Craveirinha": [
    "Xigubo","Karingana Ua Karingana","Cela 1","Maria","Babalaze das Hienas",
    "Poemas de Circunstância","Chigubo","Canto da Véspera","Barragem","Matéria Prima"
  ]
};

const TOTAL_QUESTIONS = 20;
const TIME_LIMIT = 20;

// Funções auxiliares
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomBooks = (writer, n) =>
  [...obrasPorEscritor[writer]].sort(() => 0.5 - Math.random()).slice(0, n);

// Botão reutilizável com gradiente
const GradientButton = ({ colors, text, onPress, disabled }) => (
  <LinearGradient colors={colors} style={styles.button}>
    <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.optionButton}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const EscritorQuiz = ({ navigation }) => {
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [writer, setWriter] = useState(null);
  const [result, setResult] = useState(false);
  const [time, setTime] = useState(TIME_LIMIT);

  const timerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  // Gerar nova pergunta
  const startRound = () => {
    clearTimeout(timerRef.current);
    setSelected(null);
    setTime(TIME_LIMIT);
    Animated.timing(progressAnim, { toValue: 1, duration: 0, useNativeDriver: false }).start();

    const newWriter = getRandomItem(Object.keys(obrasPorEscritor));
    setWriter(newWriter);

    const correctBooks = getRandomBooks(newWriter, 3);
    let fake;
    do {
      fake = getRandomItem(obrasPorEscritor[getRandomItem(Object.keys(obrasPorEscritor))]);
    } while (obrasPorEscritor[newWriter].includes(fake));

    setOptions([...correctBooks, fake].sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    if (round >= TOTAL_QUESTIONS) return setResult(true);
    startRound();
  }, [round]);

  // Temporizador
  useEffect(() => {
    if (result || selected) return;
    if (time === 0) {
      onSelect(null);
      return;
    }
    timerRef.current = setTimeout(() => setTime((t) => t - 1), 1000);
    Animated.timing(progressAnim, { toValue: time / TIME_LIMIT, duration: 1000, useNativeDriver: false }).start();
    return () => clearTimeout(timerRef.current);
  }, [time, result, selected]);

  const onSelect = (book) => {
    if (selected) return;
    clearTimeout(timerRef.current);
    setSelected(book);

    const isWrong = book !== null && !obrasPorEscritor[writer].includes(book);
    isWrong ? setWrong((c) => c + 1) : setCorrect((c) => c + 1);

    setTimeout(() => setRound((r) => r + 1), 1200);
  };

  const restart = () => {
    clearTimeout(timerRef.current);
    setRound(0);
    setCorrect(0);
    setWrong(0);
    setResult(false);
    setSelected(null);
    setTime(TIME_LIMIT);
  };

  const percent = (correct / TOTAL_QUESTIONS) * 100;
  const finalMessage = percent >= 60 ? "🎉 Parabéns! Você ganhou!" : "😔 Tente de novo!";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Navbar sem botão de reiniciar fixo */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>📚 Sabes?</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.finalMessage}>{finalMessage}</Text>
            <Text style={styles.resultText}>✅ Acertos: {correct}</Text>
            <Text style={styles.resultText}>❌ Erros: {wrong}</Text>

            <GradientButton colors={["#4ade80", "#16a34a"]} text="🔄 Reiniciar" onPress={restart} />
            <GradientButton colors={["#f97316", "#ea580c"]} text="🏠 Dashboard" onPress={() => navigation.navigate("Dashboard")} />
          </View>
        ) : (
          <>
            <Text style={styles.title}>
              ({round + 1}/{TOTAL_QUESTIONS}) Qual destas obras <Text style={{ color: "#38bdf8" }}>NÃO</Text> é de {writer}?
            </Text>

            <View style={styles.timerBarContainer}>
              <Animated.View
                style={[styles.timerBar, { flex: progressAnim, backgroundColor: time > 5 ? "#3b82f6" : "#ef4444" }]}
              />
            </View>
            <Text style={styles.timerText}>Tempo restante: {time}s</Text>

            {/* Opções do quiz */}
            {options.map((book, i) => {
              const isWrong = !obrasPorEscritor[writer].includes(book);
              const isSelected = selected === book;

              let colors = ["#2563eb", "#3b82f6"];
              if (selected) {
                if (isSelected) colors = isWrong ? ["#ef4444","#b91c1c"] : ["#22c55e","#16a34a"];
                else if (isWrong) colors = ["#4ade80","#22c55e"];
                else colors = ["#1f2937","#111827"];
              }

              return (
                <GradientButton
                  key={i}
                  colors={colors}
                  text={book}
                  onPress={() => onSelect(book)}
                  disabled={!!selected}
                />
              );
            })}

            {/* Botão Reiniciar como último */}
            <GradientButton
              colors={["#3b82f6", "#3b82f6"]}
              text="🔄 Reiniciar"
              onPress={restart}
              disabled={false}
            />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>DevStack Foundation - 2025</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111827", justifyContent: "space-between" },
  navbar: { height: 80, backgroundColor: "#1f2937", justifyContent: "center", alignItems: "center", paddingTop: 10 },
  navbarTitle: { color: "#a5f3fc", fontWeight: "bold", fontSize: 26 },
  content: { alignItems: "center", padding: 20, width: "100%" },
  title: { fontSize: 20, fontWeight: "bold", color: "#e0f2fe", textAlign: "center", marginBottom: 15, lineHeight: 28 },
  timerBarContainer: { flexDirection: "row", height: 10, width: "90%", backgroundColor: "#374151", borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  timerBar: { borderRadius: 5 },
  timerText: { fontSize: 16, color: "#60a5fa", marginBottom: 15 },
  resultContainer: { alignItems: "center", width: "100%" },
  finalMessage: { fontSize: 22, fontWeight: "bold", color: "#38bdf8", textAlign: "center", marginBottom: 15 },
  resultText: { fontSize: 18, color: "#a5f3fc", marginVertical: 5 },
  button: { borderRadius: 14, width: "90%", marginVertical: 6 },
  optionButton: { paddingVertical: 16, paddingHorizontal: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18, textAlign: "center" },
  footer: { padding: 12, alignItems: "center" },
  footerText: { color: "#6b7280", fontSize: 12 },
});

export default EscritorQuiz;
