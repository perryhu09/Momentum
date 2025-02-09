import { Dimensions, StyleSheet } from "react-native";

const HomePageStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 18,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 10,
    marginBottom: 20,
    color: "white",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: 400,
    marginHorizontal: 10,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  textContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    zIndex: 100,
  },
  description: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  cameraButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    color: "white",
    width: 80,
    height: 80,
    backgroundColor: "#4650ab",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  logoutOpacity: {
    color: "white",
    width: 70,
    height: 70,
    backgroundColor: "#4650ab",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  topTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default HomePageStyles;
