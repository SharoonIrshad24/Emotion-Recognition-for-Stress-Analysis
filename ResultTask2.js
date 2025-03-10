import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { Table, Rows } from "react-native-table-component";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryAxis,
} from "victory-native";
import Slider from "@react-native-community/slider";
import BaseURL from "./BaseURL";

// Colors for Experiment #1
const file1Color = "orange";
// Colors for Experiment #2
const file2Color = "blue";

// Expected channels and signals
const expectedChannels = ["TP9", "TP10", "AF7", "AF8"];
const signals = ["alpha", "beta", "delta", "theta"];

const MAX_POINTS = 256; 

export default function ResultTask2({ navigation, route }) {
  // Extract parameters (doctor id, patient id, appId, etc.)
  const { id, patientId, appId } = route.params || {};

  

  const [sessionData, setSessionData] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [exp, setExp] = useState([]);
  const [lastSessionId, setLastSessionId] = useState("");

  
  // File #1 (automatically set from the first experiment in a session)
  const [EEGPath1, setEEGPath1] = useState("");
  const [Result1, setResult1] = useState("");
  const [eegData1, setEegData1] = useState(null);

  // File #2 (selected by tapping an experiment)
  const [EEGPath2, setEEGPath2] = useState("");
  const [Result2, setResult2] = useState("");
  const [eegData2, setEegData2] = useState(null);

  
  // Result Table Data & Emotion Arrays
 
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [emotionArray1, setEmotionArray1] = useState([]);
  const [emotionArray2, setEmotionArray2] = useState([]);



  // Loading and Errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  // Slider values for each graph (keyed by "experiment-channel-signal")
  
  const [sliderValues, setSliderValues] = useState({});

 
  // Channel Checkboxes (defaulted to true so all graphs are shown)
 
  const [selectedChannels, setSelectedChannels] = useState({
    TP9: false,
    TP10: false,
    AF7: false,
    AF8: false,
  });

  const { width } = Dimensions.get("window");

  // 1. FETCH SESSIONS (Vertical list)
  useEffect(() => {
    const fetchSessions = async (retryCount = 2) => {
      try {
        const apiUrl = `${BaseURL}GetSessions/${id}/${patientId}`;
        const sessionResponse = await fetch(apiUrl);
        if (!sessionResponse.ok) {
          console.error("API responded with error:", sessionResponse.status);
          return;
        }
        const sessionResult = await sessionResponse.json();
        if (Array.isArray(sessionResult) && sessionResult.length > 0) {
          setSessionData(sessionResult);
        } else {
          if (retryCount > 0) {
            setTimeout(() => fetchSessions(retryCount - 1), 2000);
          } else {
            setSessionData([]);
          }
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, [id, patientId]);

  
  // 2. FETCH EXPERIMENTS FOR A GIVEN SESSION
  
  const getExperiments = async (sessionId) => {
    try {
      const response = await fetch(`${BaseURL}GetExperiments/${sessionId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      const validData =
        Array.isArray(result) && result.length > 0
          ? result.filter(
              (item) =>
                item?.EEGPath &&
                item?.Result &&
                item?.SessionID &&
                item?.id
            )
          : [];
      setExp(validData);
      // Automatically pick the first experiment as file #1
      if (validData.length > 0) {
        const firstExperiment = validData[0];
        setEEGPath1(firstExperiment.EEGPath);
        setResult1(firstExperiment.Result);
      } else {
        setEEGPath1("");
        setResult1("");
        setEegData1(null);
      }
    } catch (error) {
      console.error("Error fetching experiment data:", error);
      Alert.alert("Error", "Failed to fetch experiment data");
    }
  };

  // When a session button is pressed (vertical list)
  const handleSessionPress = async (sessionItem) => {
    const { sessionid } = sessionItem;
    await getExperiments(sessionid);
    setLastSessionId(sessionid);
  };

  // When an experiment is pressed (to choose file #2)
  const handleExperimentPress = (experiment) => {
    setEEGPath2(experiment.EEGPath);
    setResult2(experiment.Result);
  };

  // 3. Parse Result Strings into Arrays for Tables & Emotion Arrays
  
  useEffect(() => {
    if (Result1) {
      const parsed = parseResultString(Result1);
      setTableData1(parsed.map((item) => [item]));
      setEmotionArray1(parsed);
    } else {
      setTableData1([]);
      setEmotionArray1([]);
    }
  }, [Result1]);

  useEffect(() => {
    if (Result2) {
      const parsed = parseResultString(Result2);
      setTableData2(parsed.map((item) => [item]));
      setEmotionArray2(parsed);
    } else {
      setTableData2([]);
      setEmotionArray2([]);
    }
  }, [Result2]);

  const parseResultString = (str) => {
    if (!str) return [];
    const cleaned = str.replace(/^\[|\]$/g, "");
    return cleaned.split(",").map((s) => s.trim());
  };




  // 4. Fetch EEG Data Files When Their Paths Change
 
  useEffect(() => {
    if (EEGPath1) {
      fetchEEGFile(EEGPath1, setEegData1);
    } else {
      setEegData1(null);
    }
  }, [EEGPath1]);

  useEffect(() => {
    if (EEGPath2) {
      fetchEEGFile(EEGPath2, setEegData2);
    } else {
      setEegData2(null);
    }
  }, [EEGPath2]);


  
  // Extract only the file name from a full file path.
  const extractFileName = (filePath) => {
    if (!filePath) return "";
    return filePath.replace(/\\/g, "/").split("/").pop();
  };

  const fetchEEGFile = async (filePath, setDataFn) => {
    setLoading(true);
    try {
      const fileName = extractFileName(filePath);
      const response = await fetch(`${BaseURL}eeg_bands_file/${fileName}`);
      if (!response.ok)
        throw new Error(`Error fetching EEG file: ${filePath}`);
      const result = await response.json();
      const normalized = normalizeEEGData(result);
      if (validateEEGData(normalized)) {
        setDataFn(normalized);
      } else {
        setError(new Error("Invalid EEG Data format"));
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeEEGData = (data) => {
    const normalized = {};
    for (const [channel, signalsData] of Object.entries(data)) {
      normalized[channel] = {};
      for (const [signal, values] of Object.entries(signalsData)) {
        const lowerSig = signal.toLowerCase();
        normalized[channel][lowerSig] = Array.isArray(values) ? values : [];
      }
      signals.forEach((sig) => {
        if (!normalized[channel][sig]) {
          normalized[channel][sig] = [];
        }
      });
    }
    return normalized;
  };

  const validateEEGData = (data) => {
    if (!data || typeof data !== "object") return false;
    return expectedChannels.some((channel) =>
      signals.some((sig) => Array.isArray(data[channel]?.[sig]))
    );
  };

  // ===========================================================================
  // 5. Convert Data Arrays to XY Points (using slider offset)
  // ===========================================================================
  const toXYData = (arr, sliderValue) => {
    if (!Array.isArray(arr)) return [];
    const startIndex = Math.floor(sliderValue * arr.length);
    const endIndex = Math.min(startIndex + MAX_POINTS, arr.length);
    return arr.slice(startIndex, endIndex).map((val, idx) => ({
      x: (startIndex + idx) / 256, // time in seconds
      y: typeof val === "number" && !isNaN(val) ? val : 0,
    }));
  };

  // ===========================================================================
  // 6. Channel Checkboxes & Slider Handling
  // ===========================================================================
  const handleChannelCheck = (channel) => {
    setSelectedChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  const getSelectedChannels = () => {
    return Object.keys(selectedChannels).filter((ch) => selectedChannels[ch]);
  };

  // Update slider value for a given experiment-channel-signal key
  const updateSliderValue = (experiment, channel, signal, value) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [`${experiment}-${channel}-${signal}`]: value,
    }));
  };

  // ===========================================================================
  // 7. Render Graph for a Given Experiment, Channel & Signal with Left/Right Arrows & Emotion Label
  // ===========================================================================
  const renderGraphForExperiment = (experiment, channel, signal) => {
    // experiment: 1 for file1, 2 for file2
    const dataSource = experiment === 1 ? eegData1 : eegData2;
    const expColor = experiment === 1 ? file1Color : file2Color;
    // Use empty array if data is missing.
    const channelData =
      dataSource && dataSource[channel] ? dataSource[channel][signal] : [];
    const key = `${experiment}-${channel}-${signal}`;
    const sliderValue = sliderValues[key] || 0;
    const data = toXYData(channelData, sliderValue);
    const hasData = data.length > 0;

    // Define arrow button actions to adjust the slider value
    const moveLeft = () => {
      let newVal = Math.max(0, sliderValue - 0.10);
      updateSliderValue(experiment, channel, signal, newVal);
    };

    const moveRight = () => {
      let newVal = Math.min(1, sliderValue + 0.10);
      updateSliderValue(experiment, channel, signal, newVal);
    };

    // Compute associated emotion for this experiment.
    // We assume each emotion value corresponds to a 6-second block.
    // For simplicity, we compute:
    //   emotionIndex = Math.floor(sliderValue * emotionArray.length)
    let emotionValue = "N/A";
    if (experiment === 1 && emotionArray1.length > 0) {
      let idx = Math.floor(sliderValue * emotionArray1.length);
      if (idx >= emotionArray1.length) idx = emotionArray1.length - 1;
      emotionValue = emotionArray1[idx];
    } else if (experiment === 2 && emotionArray2.length > 0) {
      let idx = Math.floor(sliderValue * emotionArray2.length);
      if (idx >= emotionArray2.length) idx = emotionArray2.length - 1;
      emotionValue = emotionArray2[idx];
    }

    return (
      <View style={styles.chartContainer} key={key}>
        <Text style={styles.channelTitle}>
          {channel} - {signal.toUpperCase()} (Experiment #{experiment})
        </Text>
        <VictoryChart
          theme={VictoryTheme.material}
          height={250}
          width={width - 20}
          padding={{ top: 20, bottom: 50, left: 60, right: 20 }}
        >
          <VictoryAxis
            label="Time (s)"
            style={{
              axisLabel: { padding: 30, fontSize: 12, fill: "#7C0909" },
              tickLabels: { fontSize: 10 },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Amplitude"
            style={{
              axisLabel: { padding: 40, fontSize: 12, fill: "#7C0909" },
              tickLabels: { fontSize: 10 },
            }}
          />
          {!hasData ? (
            <VictoryLabel
              text="No Data Available"
              x={(width - 20) / 2}
              y={125}
              style={{ fontSize: 16, fill: "gray" }}
            />
          ) : (
            <VictoryLine
              data={data}
              interpolation="linear"
              style={{
                data: {
                  stroke: expColor,
                  strokeWidth: 2,
                },
              }}
            />
          )}
        </VictoryChart>
        {/* Left & Right Buttons + Slider */}
        <View style={styles.sliderContainer}>
          <TouchableOpacity onPress={moveLeft} style={styles.arrowButton}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              step={0.01} // Smoother movement
              value={sliderValue}
              onValueChange={(val) =>
                updateSliderValue(experiment, channel, signal, val)
              }
            />
          </View>
          <TouchableOpacity onPress={moveRight} style={styles.arrowButton}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sliderText}>
          Time: {Math.round(sliderValue * 100)}% | Emotion: {emotionValue}
        </Text>
      </View>
    );
  };

  // ===========================================================================
  // 8. MAIN RENDER
  // ===========================================================================
  return (
    <SafeAreaView style={styles.back}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Results & Comparisons</Text>

        {/* ------------------- Sessions List (Vertical) ------------------- */}
        <Text style={styles.sectionHeader}>Sessions</Text>
        <View style={styles.sessionsContainer}>
          {loadingSessions ? (
            <ActivityIndicator size="large" color="#7C0909" />
          ) : sessionData.length === 0 ? (
            <Text style={styles.noSessionsText}>No sessions available</Text>
          ) : (
            sessionData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sessionBox}
                onPress={() => handleSessionPress(item)}
              >
                <Button style={styles.sessionButton}>
                  <Text style={styles.sessionText}>
                    Session {index + 1} {item.dates}
                  </Text>
                </Button>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ------------------- Experiments List (Horizontal) ------------------- */}
        <Text style={styles.sectionHeader}>Experiments</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {exp.length === 0 ? (
            <Text style={styles.noSessionsText}>No experiments available</Text>
          ) : (
            exp.map((experiment, index) => (
              <TouchableOpacity
                key={index}
                style={styles.experimentBox}
                onPress={() => handleExperimentPress(experiment)}
              >
                <Button style={styles.sessionButton}>
                  <Text style={styles.sessionText}>Experiment {index + 1}</Text>
                </Button>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* ------------------- Result Tables ------------------- */}
        <Text style={styles.emotion}>File #1 Emotions</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
          <Rows data={tableData1} textStyle={styles.text} />
        </Table>
        <Text style={styles.emotion}>File #2 Emotions</Text>
        <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
          <Rows data={tableData2} textStyle={styles.text} />
        </Table>

        {/* ------------------- Channel Checkboxes ------------------- */}
        <Text style={styles.checkBoxHeader}>Select Channels for Comparison</Text>
        <View style={styles.checkboxGroup}>
          {expectedChannels.map((channel) => (
            <View key={channel} style={styles.checkboxRow}>
              <Checkbox
                status={selectedChannels[channel] ? "checked" : "unchecked"}
                onPress={() => handleChannelCheck(channel)}
                color="#7C0909"
              />
              <Text style={styles.checkboxLabel}>{channel}</Text>
            </View>
          ))}
        </View>

        {/* ------------------- Graphs for Each Selected Channel & Each Frequency Band ------------------- */}
        {getSelectedChannels().map((channel) =>
          signals.map((signal) => (
            <View key={`${channel}-${signal}`}>
              {renderGraphForExperiment(1, channel, signal)}
              {renderGraphForExperiment(2, channel, signal)}
            </View>
          ))
        )}

        {/* ------------------- Prescription Button ------------------- */}
        <Button
          style={styles.prescriptionBtn}
          onPress={() =>
            navigation.navigate("Prescription", { patientId, appId })
          }
        >
          <Text style={styles.prescriptionText}>Add Prescription</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================================================================
// STYLES
// =========================================================================
const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: "#FDF4F4",
  },
  scrollContainer: {
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingVertical: 15,
    backgroundColor: "#7C0909",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    color: "#7C0909",
    marginVertical: 10,
    marginLeft: 5,
  },
  emotion: {
    color: "#7C0909",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 5,
  },
  text: {
    margin: 6,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#7C0909",
  },
  // Sessions List (Vertical)
  sessionsContainer: {
    marginHorizontal: 5,
  },
  sessionBox: {
    marginBottom: 10,
  },
  sessionButton: {
    backgroundColor: "#F9E0E0",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sessionText: {
    color: "#7C0909",
    fontSize: 14,
    textAlign: "center",
  },
  noSessionsText: {
    color: "black",
    marginTop: 10,
  },
  // Experiments List (Horizontal)
  horizontalScroll: {
    marginBottom: 10,
  },
  experimentBox: {
    marginRight: 10,
  },
  // Checkboxes
  checkBoxHeader: {
    color: "#7C0909",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 5,
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    marginLeft: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginVertical: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#7C0909",
  },
  // Graph Chart
  chartContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 2,
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#7C0909",
    marginBottom: 5,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 20,
    color: "#7C0909",
  },
  sliderWrapper: {
    flex: 1,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderText: {
    fontSize: 12,
    color: "#7C0909",
    textAlign: "center",
    marginTop: 5,
  },
  // Prescription Button
  prescriptionBtn: {
    alignSelf: "center",
    marginVertical: 20,
    height: 50,
    width: 200,
    borderRadius: 50,
    backgroundColor: "#7C0909",
    justifyContent: "center",
  },
  prescriptionText: {
    color: "white",
    fontSize: 17,
    textAlign: "center",
  },
});
