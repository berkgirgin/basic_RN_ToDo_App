import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTodoLogicContext } from "@/context/todoLogicContext";
import { useThemeContext } from "@/context/themeContext";

export default function OverviewPage() {
  const todoLogic = useTodoLogicContext();
  const { theme, myFontFamily } = useThemeContext();
  const router = useRouter();

  const overviewData = useMemo(() => {
    return todoLogic.getOverviewData();
  }, [todoLogic.toDosArray]);

  const imgUrl = "@/assets/images/uncle_sam.png";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require(imgUrl)}
          style={styles.headerImage}
          resizeMode="contain"
        />

        <Pressable
          style={[styles.pressableButton, { backgroundColor: theme.button }]}
          onPress={() => {
            router.push("/todos");
          }}
        >
          <Text style={[styles.pressableText, { fontFamily: myFontFamily }]}>
            TO "EVIL TASKS"
          </Text>
        </Pressable>

        <View
          style={[
            styles.overviewContainer,
            { backgroundColor: theme.zebraStripeBackground.firstColor },
          ]}
        >
          <Text
            style={[
              styles.overviewTitle,
              { color: theme.text, fontFamily: myFontFamily },
            ]}
          >
            30 DAY OVERVIEW
          </Text>

          <View
            style={[
              styles.section,
              { backgroundColor: theme.zebraStripeBackground.secondColor },
            ]}
          >
            <Text
              style={[
                styles.statusMessage,
                { color: theme.text, fontFamily: myFontFamily },
              ]}
            >
              {overviewData.statusMessageRecentlyAdded}
            </Text>
            <Text
              style={[
                styles.count,
                { color: theme.icon, fontFamily: myFontFamily },
              ]}
            >
              Recently added:{" "}
              <Text style={[styles.countNumber, { fontFamily: myFontFamily }]}>
                {overviewData.countRecentlyAdded}
              </Text>
            </Text>
          </View>

          <View
            style={[
              styles.section,
              { backgroundColor: theme.zebraStripeBackground.secondColor },
            ]}
          >
            <Text
              style={[
                styles.statusMessage,
                { color: theme.text, fontFamily: myFontFamily },
              ]}
            >
              {overviewData.statusMessageRecentlyCompleted}
            </Text>
            <Text
              style={[
                styles.count,
                { color: theme.icon, fontFamily: myFontFamily },
              ]}
            >
              Recently completed:{" "}
              <Text style={[styles.countNumber, { fontFamily: myFontFamily }]}>
                {overviewData.countRecentlyCompleted}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    alignSelf: "center",
    paddingBottom: 40,
    width: "100%",
    maxWidth: 1024,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  headerImage: {
    width: "100%",
    height: 240,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
  },
  pressableButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pressableText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  overviewContainer: {
    width: "90%",
    padding: 15,
    borderRadius: 10,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusMessage: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 5,
  },
  count: {
    fontSize: 14,
    fontWeight: "500",
  },
  countNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
