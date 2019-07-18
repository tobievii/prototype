import React from 'react';
import {
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten';
import {
  Button,
  Text,
} from 'react-native-ui-kitten';
import {
  SignInForm,
  SignInFormData,
} from '../../../../src/components/auth';
import {
  ScrollableAvoidKeyboard,
  textStyle,
} from '../../../../src/components/common';
import { View } from 'react-native';
import { AsyncStorage } from 'react-native'

interface ComponentProps {
  onSignInPress: (formData: SignInFormData) => void;
  onSignUpPress: () => void;
  onForgotPasswordPress: () => void;
}

export type SignInProps = ThemedComponentProps & ComponentProps;

interface State {
  formData: SignInFormData | undefined;
}

class SignInComponent extends React.Component<SignInProps> {

  public state: State = {
    formData: undefined,
  };

  private onSignInButtonPress = () => {
    AsyncStorage.setItem('user', JSON.stringify(this.state.formData))
    this.props.onSignInPress(this.state.formData);
  };

  private onSignUpButtonPress = () => {
    this.props.onSignUpPress();
  };

  private onForgotPasswordButtonPress = () => {
    this.props.onForgotPasswordPress();
  };

  private onFormDataChange = (formData: SignInFormData) => {
    this.setState({ formData });
  };

  private user = async () => {
    const view = await AsyncStorage.getItem('user');
    console.log(view); // view user stored in device serilzed dictionary
  };

  private removeuser = async () => {
    await AsyncStorage.clear();
    this.user();
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>
        <View style={themedStyle.headerContainer}>
          <Text
            style={themedStyle.helloLabel}
            category='h1'
            onPress={this.user}>
            PROTOTYP3
          </Text>
          <Text
            style={themedStyle.signInLabel}
            category='s1'
            onPress={this.removeuser}>
            Sign in to your account
          </Text>
        </View>
        <SignInForm
          style={themedStyle.formContainer}
          onForgotPasswordPress={this.onForgotPasswordButtonPress}
          onDataChange={this.onFormDataChange}
        />
        <Button
          style={themedStyle.signInButton}
          textStyle={textStyle.button}
          size='giant'
          disabled={!this.state.formData}
          onPress={this.onSignInButtonPress}>
          SIGN IN
        </Button>
        <Button
          style={themedStyle.signUpButton}
          textStyle={themedStyle.signUpText}
          appearance='ghost'
          activeOpacity={0.75}
          onPress={this.onSignUpButtonPress}>
          Don't have an account? Register here
        </Button>
      </ScrollableAvoidKeyboard>
    );
  }
}

export const SignIn = withStyles(SignInComponent, (theme: ThemeType) => {
  return ({
    container: {
      flex: 1,
      backgroundColor: theme['background-basic-color-1'],
    },
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 216,
      backgroundColor: theme['color-primary-default'],
    },
    formContainer: {
      flex: 1,
      marginTop: 32,
      paddingHorizontal: 16,
    },
    helloLabel: {
      color: 'white',
      ...textStyle.headline,
    },
    signInLabel: {
      marginTop: 16,
      color: 'white',
      ...textStyle.subtitle,
    },
    signInButton: {
      marginHorizontal: 16,
    },
    signUpButton: {
      marginVertical: 12,
    },
    signUpText: {
      color: theme['text-hint-color'],
      ...textStyle.subtitle,
    },
  });
});

