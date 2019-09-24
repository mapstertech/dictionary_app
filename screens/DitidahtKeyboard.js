import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ditiChars = [
  "ƛ", "ƛ̓", "ʔ", "ʕ", "b̓", "c̓", "č", "č̓", "d̓", "kʷ", "k̓",
  "k̓ʷ","l̓","ł","m̓","n̓","p̓","qʷ","q̓","q̓ʷ","š","t̓","w̓","xʷ",
  "x̣","x̣ʷ","y̓","–"
];

export class DitidahtKeyboard extends Component {

  constructor(props) {
    super(props);
    this.screenHeight = Dimensions.get('window').height;
    this.screenWidth = Dimensions.get('window').width;
    this.state = {
      currentPos: 0
    }
  }

  scrollMiniKeyboard(direction) {
    let { currentPos } = this.state;
    if (direction === 'back' && currentPos < 1 || direction === 'forward' && currentPos > (ditiChars.length * 40 - 80)) {
        return
    } else {
        let newPos = direction === 'forward' ? (currentPos + this.screenWidth - 80) : (currentPos - this.screenWidth + 80);
        this.scroll.scrollTo({ x : newPos});
        this.setState({ currentPos : newPos });
    }
}

  render() {
    return (
      <View style={styles.keyboardWrap}>
        <Ionicons
          name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-dropleft"}
          size={26}
          style={styles.arrowIcon}
          onPress={() => this.scrollMiniKeyboard("back")}
        />
        <ScrollView
          horizontal
          keyboardShouldPersistTaps="always"
          style={styles.keyboard}
          onScroll={event =>
            this.setState({
              currentPos: event.nativeEvent.contentOffset.x
            })
          }
          scrollEventThrottle={0}
          ref={node => (this.scroll = node)}
        >
          {ditiChars.map(letter => {
            return (
              <Text
                style={styles.keyboardKey}
                onPress={() => this.setState({ query: query + letter })}
                key={letter}
              >
                {letter}
              </Text>
            );
          })}
        </ScrollView>
        <Ionicons
          name={
            Platform.OS === "ios" ? "ios-arrow-forward" : "md-arrow-dropright"
          }
          size={26}
          style={styles.arrowIcon}
          onPress={() => this.scrollMiniKeyboard("forward")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  arrowIcon : {
    width : 40,
    height : '100%',
    alignSelf : 'center',
    paddingTop : 7,
    borderRadius : 2,
    borderWidth : 0.5,
    borderColor : '#ccc',
    textAlign : 'center',
    opacity : 1,
    zIndex : 2,
    backgroundColor : '#fff'
  },
  keyboardWrap: {
    overflow: "hidden",
    flexDirection: "row",
    flexWrap: "nowrap",
    height: 40,
    backgroundColor: "rgba(255,255,255,0.25)"
  },
  keyboard: {
    overflow: "visible",
    width: "100%"
  },
  keyboardKey: {
    backgroundColor: "rgba(240,240,240,1)",
    margin: 2,
    paddingHorizontal: 12,
    paddingVertical: 5,
    minWidth: "15%",
    flexDirection: "row",
    flexWrap: "nowrap",
    width: 45,
    height: 40,
    fontSize: 20,
    flexGrow: 1,
    borderRadius: 2,
    textAlign: "center"
  }
});
