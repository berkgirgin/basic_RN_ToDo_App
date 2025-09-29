import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMemo } from "react";

import { useTodoLogicContext } from "@/context/todoLogicContext";

export default function OverviewPage() {
  const todoLogic = useTodoLogicContext();

  const overviewData = useMemo(() => {
    return todoLogic.getOverviewData();
  }, [todoLogic.toDosArray]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>OverviewPage</Text>
      <Link href={"/todos"}>Main Page</Link>

      <View>
        <Text>30 DAY OVERVIEW</Text>
        <View>
          <Text>{overviewData.statusMessageRecentlyAdded}</Text>
          <Text>Recently added: {overviewData.countRecentlyAdded}</Text>
        </View>
        <View>
          <Text>{overviewData.statusMessageRecentlyCompleted}</Text>
          <Text>
            Recently completed:
            {overviewData.countRecentlyCompleted}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
