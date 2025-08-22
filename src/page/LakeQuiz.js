import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components/native";
import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: #e0f2fe;
  line-height: 28px;
  margin-bottom: 15px;
`;

const TimerText = styled.Text`
  font-size: 18px;
  color: #60a5fa;
  margin-bottom: 20px;
  font-weight: bold;
`;

const OptionButton = styled.TouchableOpacity`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  margin: 6px 0;
  align-items: center;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
`;

const ResultText = styled.Text`
  font-size: 20px;
  color: #a5f3fc;
  margin-top: 10px;
  text-align: center;
`;

const ButtonsRow = styled.View`
  width: 100%;
  margin-top: 20px;
  gap: 12px;
  align-items: center;
`;

export default function LakeQuiz() {
  const navigation = useNavigation();

  const lakesByProvince = {
    Niassa: ["Lago Amaramba", "Lago Chiuta", "Lago de Metangula", "Lago Chimbunila"],
    "Cabo Delgado": ["Lagoa Nganda", "Lagoa de Choca", "Lagoa Mueda", "Pequenas lagoas costeiras"],
    Nampula: ["Lagoa do Macaneta", "Lagoa do Moma", "Lagoa do Nacala", "Lagoas costeiras perto de Angoche"],
    Zambézia: ["Lago Chilwa", "Lagoas de Mopeia", "Lagoa de Derre", "Lagoa de Lugela"],
    Tete: ["Lagoa de Macanga", "Lagoa de Changara", "Lagoa de Mutarara", "Lago Cahora Bassa (parte)"],
    Manica: ["Lago Chicamba", "Lago Mavonde", "Lagoa de Machaze", "Lagoa de Guro"],
    Sofala: ["Lago Urema", "Lagoa de Chemba", "Lagoa de Marromeu", "Lagoa Nhamatanda", "Lagoa Pungué"],
    Inhambane: ["Lagoa Poelela", "Lagoa Nhambavale", "Lagoa Quissico", "Lagoa Sangarrive", "Lagoa de Zavala"],
    Gaza: ["Lagoa do Bilene (Uembje)", "Lagoa Macandine", "Lagoa Massagena"],
    Maputo: ["Lagoa Chidenguele", "Lagoa Xingute", "Lagoa Piti", "Lagoa Zimbene", "Lagoa do Nhongonhane (KaTembe)"],
    "Cidade de Maputo": ["Lagoa do Nhongonhane", "Pequenas lagoas costeiras e mangais"],
  };

  const allProvinces = Object.keys(lakesByProvince);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [province, setProvince] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [usedProvinces, setUsedProvinces] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => {
    if (currentQuestion < 20) generateQuestion();
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0) handleSelect(null);
    const interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [options]);

  const getRandomProvince = (excludeList = []) => {
    const filtered = allProvinces.filter(p => !excludeList.includes(p));
    if (!filtered.length) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const generateQuestion = () => {
    clearInterval(timerRef.current);
    setSelected(null);
    setTimeLeft(20);

    const trueProvince = getRandomProvince(usedProvinces);
    if (!trueProvince) return;
    setProvince(trueProvince);
    setUsedProvinces([...usedProvinces, trueProvince]);

    const falseProvince = getRandomProvince([trueProvince]);
    if (!falseProvince) return;

    const trueLakes = lakesByProvince[trueProvince];
    const falseLakes = lakesByProvince[falseProvince];

    const correctOptions = trueLakes.sort(() => 0.5 - Math.random()).slice(0, 3);
    const falseOption = falseLakes[Math.floor(Math.random() * falseLakes.length)];
    const mixedOptions = [...correctOptions, falseOption].sort(() => 0.5 - Math.random());

    setOptions(mixedOptions);
  };

  const handleSelect = (lake) => {
    clearInterval(timerRef.current);
    setSelected(lake);

    const isCorrect = lake && !lakesByProvince[province].includes(lake);
    if (isCorrect) setCorrectCount(prev => prev + 1);
    else setWrongCount(prev => prev + 1);

    setTimeout(() => {
      if (currentQuestion + 1 === 20) setShowResult(true);
      else setCurrentQuestion(prev => prev + 1);
    }, 1000);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setCorrectCount(0);
    setWrongCount(0);
    setShowResult(false);
    setUsedProvinces([]);
    generateQuestion();
  };

  const percent = (correctCount / 20) * 100;
  const finalMessage = percent >= 50 ? "🎉 Parabéns! Você ganhou!" : "😔 Tente de novo!";

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={{ flex: 1 }}>
      <Container>
        {showResult ? (
          <>
            <Title>{finalMessage}</Title>
            <ResultText>✔️ Certas: {correctCount}</ResultText>
            <ResultText>❌ Erradas: {wrongCount}</ResultText>

            <ButtonsRow>
              <LinearGradient colors={["#4ade80","#16a34a"]} style={{ width: "90%", borderRadius: 12 }}>
                <OptionButton onPress={restartGame} bg="transparent">
                  <ButtonText>🔄 Reiniciar</ButtonText>
                </OptionButton>
              </LinearGradient>
              <LinearGradient colors={["#f97316","#ea580c"]} style={{ width: "90%", borderRadius: 12 }}>
                <OptionButton onPress={() => navigation.replace("Dashboard")} bg="transparent">
                  <ButtonText>🏠 Dashboard</ButtonText>
                </OptionButton>
              </LinearGradient>
            </ButtonsRow>
          </>
        ) : (
          <>
            <Title>
              Todas estas lagoas são da província{" "}
              <Text style={{ fontWeight: "bold", color: "#fff" }}>{province}</Text>, exceto:
            </Title>
            <TimerText>⏱️ Tempo: {timeLeft}s</TimerText>

            {options.map((opt, i) => (
              <LinearGradient
                key={i}
                colors={
                  selected === opt
                    ? !lakesByProvince[province].includes(opt)
                      ? ["#22c55e","#16a34a"]
                      : ["#ef4444","#b91c1c"]
                    : ["#1e40af","#2563eb"]
                }
                style={{ width: "90%", borderRadius: 12, marginVertical: 6 }}
              >
                <OptionButton onPress={() => handleSelect(opt)} disabled={!!selected} bg="transparent">
                  <ButtonText>{opt}</ButtonText>
                </OptionButton>
              </LinearGradient>
            ))}

            <ButtonsRow>
              <LinearGradient colors={["#3b82f6","#2563eb"]} style={{ width: "90%", borderRadius: 12 }}>
                <OptionButton onPress={restartGame} bg="transparent">
                  <ButtonText>🔁 Reiniciar</ButtonText>
                </OptionButton>
              </LinearGradient>
            </ButtonsRow>
          </>
        )}
      </Container>
    </LinearGradient>
  );
}
