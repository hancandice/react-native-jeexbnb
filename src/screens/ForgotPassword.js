import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import colors from "../styles/colors";
import InputField from "../components/form/InputField";
import Notification from "../components/Notification";
import NextArrowButton from "../components/buttons/NextArrowButton";
import Loader from "../components/Loader";
import NavBarButton from "../components/buttons/NavBarButton";
import iPhoneSize from "../helpers/utils";

// =========== responsive design ============

const size = iPhoneSize(); // large, small, medium

let headingTextSize = 28;
if (size === "small") {
  headingTextSize = 22;
} else if (size === "large") {
  headingTextSize = 34;
}

// =========== end of responsive design ============

export default class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "",
    borderBottomWidth: 0,
    headerTransparent: true,
    headerTintColor: colors.white,
    elevation: 0,
    headerRight: () => (
      <NavBarButton
        location="right"
        color={colors.white}
        text="Welcome"
        handleButtonPress={() => navigation.navigate("Welcome")}
      />
    ),
  });
  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validEmail: false,
      emailAddress: "",
      loadingVisible: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this); // In JavaScript, class methods are not bound by default. Needs binding the scope of current object to the method.
    this.moveToNextStep = this.moveToNextStep.bind(this);
    this.handleCloseNotification = this.handleCloseNotification.bind(this);
  }

  handleEmailChange(email) {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //regex function
    this.setState({ emailAddress: email });

    if (!this.state.validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else {
      if (!emailCheckRegex.test(email)) {
        this.setState({ validEmail: false });
      }
    }
  }
  moveToNextStep() {
    this.setState({ loadingVisible: true });
    // For simulating slow server :)
    setTimeout(() => {
      if (this.state.emailAddress === "wrong@email.com") {
        this.setState({
          loadingVisible: false,
          formValid: false,
        });
      } else {
        this.setState({
          loadingVisible: false,
          formValid: true,
        });
      }
    }, 2000);
  }

  handleCloseNotification() {
    this.setState({
      formValid: true,
    });
  }
  render() {
    const { loadingVisible, formValid, validEmail } = this.state;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const showNotification = formValid ? false : true;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: background }, styles.wrapper]}
        behavior="padding"
      >
        <View style={styles.scrollViewWrapper}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <Text style={styles.forgotPasswordHeading}>
                Forgot Password ?
              </Text>
              <Text style={styles.forgotPasswordSubheading}>
                Enter your email to find your account.
              </Text>
              <InputField
                customStyle={{ marginBottom: 30 }}
                textColor={colors.white}
                labelText="EMAIL ADDRESS"
                labelTextSize={14}
                labelColor={colors.white}
                borderBottomColor={colors.white}
                inputType="email"
                onChangeText={this.handleEmailChange}
                autoFocus={true}
                autoCapitalize="none"
                showCheckmark={validEmail}
              />
            </View>
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.moveToNextStep}
            disabled={!validEmail}
          />
        </View>

        <Loader modalVisible={loadingVisible} animationType="fade" />
        <View style={styles.notificationWrapper}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine="No account matches the requested"
            secondLine="email address. Please try again."
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

// showCheckmark

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flex: 1,
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    ...Platform.select({
      android: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
    }),
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1,
  },
  forgotPasswordHeading: {
    fontSize: headingTextSize,
    color: colors.white,
    fontWeight: "300",
  },
  forgotPasswordSubheading: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 60,
  },
  notificationWrapper: {
    position: "absolute",
    bottom: 0,
  },
});
