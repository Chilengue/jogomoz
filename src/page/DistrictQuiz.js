import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #111827;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  line-height: 28px;
  color: #e0f2fe;
`;

const OptionButton = styled.TouchableOpacity`
  background-color: ${(props) => props.bg || '#1f2937'};
  border-radius: 12px;
  padding: 16px;
  margin: 10px 0;
  width: 100%;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const TimerText = styled.Text`
  font-size: 18px;
  color: #60a5fa;
  margin-bottom: 20px;
  font-weight: bold;
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

const distritosPorProvincia = {
  "Cabo Delgado": ["Ancuabe", "Balama", "Chiúre", "Ibo", "Macomia", "Mecúfi","Meluco", "Metuge", "Mocímboa da Praia", "Montepuez","Mueda", "Muidumbe", "Namuno", "Nangade", "Palma", "Quissanga"],
  "Gaza": ["Bilene Macia", "Chibuto", "Chicualacuala", "Chigubo","Chókwè", "Guijá", "Mabalane", "Manjacaze","Massangena", "Massingir", "Xai-Xai"],
  "Inhambane": ["Funhalouro", "Govuro", "Homoíne", "Inharrime", "Inhassoro","Jangamo", "Mabote", "Massinga", "Maxixe", "Morrumbene","Panda", "Vilanculos", "Zavala"],
  "Manica": ["Báruè", "Gondola", "Guro", "Machaze", "Macossa","Manica", "Mossurize", "Sussundenga", "Tambara", "Vanduzi"],
  "Maputo Province": ["Boane", "Magude", "Manhiça", "Marracuene","Matutuíne", "Moamba", "Namaacha"],
  "Maputo City": ["KaMpfumu", "KaTembe", "Kamubukwane", "Xamanculo", "Maxaquene", "Polana", "Sommerschield", "Central", "Coop", "Malhazine"],
  "Nampula": ["Angoche", "Eráti", "Lalaua", "Malema", "Meconta","Mecubúri", "Memba", "Mogincual", "Mogovolas","Moma", "Monapo", "Mossuril", "Muecate", "Murrupula","Nacala-a-Velha", "Nacarôa", "Nampula", "Ribáuè"],
  "Niassa": ["Cuamba", "Lago", "Lichinga", "Majune", "Mandimba","Marrupa", "Maúa", "Mavago", "Mecanhelas", "Mecula","Metarica", "Muembe", "N'gauma", "Nipepe", "Sanga"],
  "Sofala": ["Buzi", "Caia", "Chemba", "Cheringoma", "Chibabava","Dondo", "Gorongosa", "Machanga", "Maringué", "Marromeu","Muanza", "Nhamatanda"],
  "Tete": ["Angónia", "Cahora-Bassa", "Changara", "Chifunde","Chiuta", "Doa", "Macanga", "Magoé", "Marávia","Moatize", "Mutarara", "Tsangano", "Zumbo"],
  "Zambézia": ["Alto Molócuè", "Chinde", "Gilé", "Gurué", "Ile","Inhassunge", "Lugela", "Maganja da Costa", "Milange","Mocuba", "Mopeia", "Morrumbala", "Namacurra","Namarroi", "Nicoadala", "Pebane"]
};

const allProvinces = Object.keys(distritosPorProvincia);

export default function DistrictQuiz() {
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
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    timerRef.current = interval;
    return () => clearInterval(interval);
  }, [options]);

  const getRandomProvince = (excludeList = []) => {
    const filtered = allProvinces.filter((p) => !excludeList.includes(p));
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const generateQuestion = () => {
    clearInterval(timerRef.current);
    setSelected(null);
    setTimeLeft(20);

    const trueProvince = getRandomProvince(usedProvinces);
    setProvince(trueProvince);
    setUsedProvinces([...usedProvinces, trueProvince]);

    const falseProvince = getRandomProvince([trueProvince]);
    const trueDistricts = distritosPorProvincia[trueProvince];
    const falseDistricts = distritosPorProvincia[falseProvince];

    const correctOptions = trueDistricts.sort(() => 0.5 - Math.random()).slice(0, 3);
    const falseOption = falseDistricts[Math.floor(Math.random() * falseDistricts.length)];
    const mixedOptions = [...correctOptions, falseOption].sort(() => 0.5 - Math.random());

    setOptions(mixedOptions);
  };

  const handleSelect = (district) => {
    clearInterval(timerRef.current);
    setSelected(district);

    const isCorrect = district !== null && !distritosPorProvincia[province].includes(district);
    if (isCorrect) setCorrectCount((prev) => prev + 1);
    else setWrongCount((prev) => prev + 1);

    setTimeout(() => {
      if (currentQuestion + 1 === 20) setShowResult(true);
      else setCurrentQuestion((prev) => prev + 1);
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
  const finalMessage = percent >= 60 ? "🎉 Parabéns! Você ganhou!" : "😔 Tente de novo!";

  return (
    <Container>
      {showResult ? (
        <>
          <Title>{finalMessage}</Title>
          <ResultText>✔️ Certas: {correctCount}</ResultText>
          <ResultText>❌ Erradas: {wrongCount}</ResultText>

          <OptionButton onPress={restartGame} bg="#16a34a">
            <ButtonText>🔄 Reiniciar Jogo</ButtonText>
          </OptionButton>

          <OptionButton onPress={restartGame} bg="#ea580c">
            <ButtonText>🏠 Voltar ao Dashboard</ButtonText>
          </OptionButton>
        </>
      ) : (
        <>
          <Title>
            Todos estes distritos pertencem à província{" "}
            <Text style={{ fontWeight: 'bold', color: '#38bdf8' }}>{province}</Text>, exceto:
          </Title>
          <TimerText>⏱️ Tempo: {timeLeft}s</TimerText>

          {options.map((opt, i) => (
            <OptionButton
              key={i}
              onPress={() => handleSelect(opt)}
              disabled={selected !== null}
              bg={
                selected === opt
                  ? !distritosPorProvincia[province].includes(opt)
                    ? '#22c55e'
                    : '#ef4444'
                  : '#1f2937'
              }
            >
              <ButtonText>{opt}</ButtonText>
            </OptionButton>
          ))}

          <OptionButton onPress={restartGame} bg="#3b82f6">
            <ButtonText>🔁 Reiniciar Jogo</ButtonText>
          </OptionButton>
        </>
      )}
    </Container>
  );
}
