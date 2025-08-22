import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

export default function Dashboard() {
  const navigation = useNavigation();

  // Função para animar clique no botão
  const animatedScale = new Animated.Value(1);
  const onPressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>🎯 Sabes?</Text>
          <Text style={styles.subtitle}>Desafia os teus conhecimentos</Text>
        </View>

        {/* Botões de jogo */}
        <View style={styles.cardContainer}>
          {/* Provincias */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => navigation.navigate("Provincias")}
          >
            <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
              <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.card}>
                <MaterialCommunityIcons name="map-marker-radius" size={45} color="#fff" />
                <Text style={styles.cardText}>Províncias</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* Lagoas */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => navigation.navigate("Lagoa")}
          >
            <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
              <LinearGradient colors={["#1FA2FF", "#12D8FA"]} style={styles.card}>
                <Ionicons name="water" size={45} color="#fff" />
                <Text style={styles.cardText}>Lagoas</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* Obras Literárias */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => navigation.navigate("EscritorQuiz")}
          >
            <Animated.View style={{ transform: [{ scale: animatedScale }] }}>
              <LinearGradient colors={["#FF512F", "#DD2476"]} style={styles.card}>
                <FontAwesome5 name="book" size={45} color="#fff" />
                <Text style={styles.cardText}>Obras Literárias</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌟 DevStack Foundation</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 20,
  },
  card: {
    height: 120,
    borderRadius: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 20,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#aaa",
    fontSize: 14,
  },
});
