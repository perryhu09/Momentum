import { View, Text, Button } from "react-native";
import React, { useState } from "react";
import DropdownComponent from "../components/DropdownMenu";

const test = () => {
  const [on, seton] = useState(false);
  return (
    <View>
      <Button onPress={() => seton(!on)} title="uwujuu"></Button>
      {on && <DropdownComponent />}
    </View>
  );
};

export default test;
