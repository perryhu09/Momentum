import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./Index";
import LoginScreen from "./Login";
import RegisterScreen from "./Register";
import ViewGallery from "./ViewAlbum";
import CameraPage from "./Camera";
import ViewStory from "./ViewStory";
import ViewAlbum from "./ViewAlbum";
import ViewAllImages from "./ViewAllImages";

const Stack = createStackNavigator();

export default function Layout() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ViewStory" component={ViewStory} />
        <Stack.Screen name="ViewAllImages" component={ViewAllImages} />
        <Stack.Screen name="ViewAlbum" component={ViewAlbum} />
        <Stack.Screen name="Camera" component={CameraPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
