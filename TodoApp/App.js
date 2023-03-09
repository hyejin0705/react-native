import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity, // 누르면 자동으로 투명도가 주어지는 효과 (activeOpacityL: 투명도 지정)
  TextInput,
  Alert,
} from "react-native";
import { theme } from "./colors";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
    loadCategory();
  }, []);

  const travel = async () => {
    setWorking(false);
    await AsyncStorage.setItem("@category", JSON.stringify(working));
  };
  const work = async () => {
    setWorking(true);
    await AsyncStorage.setItem("@category", JSON.stringify(working));
  };

  const loadCategory = async () => {
    const s = await AsyncStorage.getItem("@category");
    setWorking(s);
  };

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    // const s = JSON.stringify(toSave)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s)); // object 형태로 변환
  };

  const addTodo = () => {
    if (text === "") {
      return;
    }
    // const newToDos = Object.assign({}, toDos, {
    //   [Date.now()]: { text, work: working },
    // });
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        // style: "destructive",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
          // async, await를 사용하지 않아도 됨.
        },
      },
    ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        {/* 누르면 자동으로 투명도가 주어지는 효과 */}
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
          {/* {{ ...변수 }}: 모든 스타일을 가져옴 */}
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <TextInput
          // keyboardType="email-address"   // 키보드 형태를 변경해주는 옵션
          returnKeyType="done" // 보내기 Text 변경해주는 옵션
          // multiline   // 무한 텍스트 입력 가능
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          placeholder={working ? "Add a To DO" : "Where do you want to go?"}
          style={styles.input}
          value={text}
          // autoCorrect
        />
        <ScrollView>
          {Object.keys(toDos).map((key) =>
            // working >> True(work), false(travel)
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Text>❌</Text>
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20, // 수평: paddingHorizontal, 수직: paddingVertical
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },

  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },

  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
