import { MaterialIcons } from "@expo/vector-icons"; // for mic icon
import Voice from "@react-native-voice/voice";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setRecognizedText(e.value[0]);
      // sendToGPT(e.value[0]); // You can call GPT here
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Placeholder GPT call
  const sendToGPT = async (text) => {
    const apiKey = ""; // Your OpenAI API key
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }),
    });

    const data = await response.json();
    console.log("GPT Response:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap the mic and talk to GPT</Text>
      <Text style={styles.recognized}>{recognizedText}</Text>
      <TouchableOpacity onPress={toggleListening} style={styles.micButton}>
        <MaterialIcons name="mic" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  recognized: { marginVertical: 20, paddingHorizontal: 20, textAlign: "center" },
  micButton: {
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 16,
    elevation: 3,
  },
});
