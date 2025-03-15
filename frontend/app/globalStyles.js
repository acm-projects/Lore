'use strict';
import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

module.exports = StyleSheet.create({

    screen: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#313338"
    },
    bgImage: {
        width: windowWidth,
        height: windowHeight,
        flex:1,
        resizeMode: 'cover'
    },
    box: {
        width: "85%",
        paddingBottom: 0,
        borderRadius: 20,
        backgroundColor: "#1E1F22",
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        paddingLeft: 6,
        borderRadius: 15,
        width: 285,
        height: 40,
        fontSize: 15,
        backgroundColor: "black",
        color: "white",
    },
    secondaryText: {
        color: "#B3B3B3",
        paddingBottom: 5,
    },
    titleText: {
        marginTop: 10,
        alignItems: "center",
        color: "white",
        fontSize: 20
    },
    linkText: {
        color: "#007AFF",
        paddingBottom: 10,
        fontSize: 15,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
    button: {
        marginBottom: 4,
        width: 285,
        height: 40,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"#06D6A1",
    }
})