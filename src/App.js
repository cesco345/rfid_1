import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text } from "react-native";
import NfcManager from "react-native-nfc-manager";

// Import your screens
import InventoryHomeScreen from "./screens/InventoryHomeScreen";
import ScanItemScreen from "./screens/ScanItemScreen";
import AddNewItemScreen from "./screens/AddNewItemScreen";
import ItemDetailsScreen from "./screens/ItemDetailsScreen";
import EditItemScreen from "./screens/EditItemScreen"; // You would need to create this

const Stack = createStackNavigator();

function App() {
  const [hasNfc, setHasNfc] = React.useState(null);

  React.useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
      setHasNfc(supported);
    }
    checkNfc();
  }, []);

  if (hasNfc === null) {
    return null; // Loading state
  }

  if (!hasNfc) {
    return (
      <View style={styles.wrapper}>
        <Text>NFC is not supported on this device</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InventoryHome">
        <Stack.Screen
          name="InventoryHome"
          component={InventoryHomeScreen}
          options={{ title: "Inventory Manager" }}
        />
        <Stack.Screen
          name="ScanItem"
          component={ScanItemScreen}
          options={{ title: "Scan NFC Tag" }}
        />
        <Stack.Screen
          name="AddNewItem"
          component={AddNewItemScreen}
          options={{ title: "Add New Item" }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetailsScreen}
          options={{ title: "Item Details" }}
        />
        <Stack.Screen
          name="EditItem"
          component={EditItemScreen}
          options={{ title: "Edit Item" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
});

export default App;
