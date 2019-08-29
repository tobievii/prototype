import React from 'react';
import {
  ButtonProps,
  ImageProps,
  View,
  Text
} from 'react-native';
import {
  StyleType,
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from 'react-native-ui-kitten';
import { Button } from 'react-native-ui-kitten';
import {
  SignUpForm,
  SignUpFormData,
} from '../../../../src/components/auth';
// import { ProfilePhoto } from '@src/components/social';
import {
  ScrollableAvoidKeyboard,
  textStyle,
} from '../../../../src/components/common';
import { PlusIconFill } from '../../../../src/assets/icons';

interface ComponentProps {
  onSignUpPress: (formData: SignUpFormData) => void;
  onSignInPress: () => void;
  onPhotoPress: () => void;
}

export type SignUp2Props = ThemedComponentProps & ComponentProps;

interface State {
  formData: SignUpFormData;
  response: string;
}

class SignUp2Component extends React.Component<SignUp2Props, State> {

  public state: State = {
    formData: undefined,
    response: ""
  };

  private onFormDataChange = (formData: SignUpFormData) => {
    this.setState({ formData });
  };

  private onPhotoButtonPress = () => {
    this.props.onPhotoPress();
  };

  private onSignInButtonPress = () => {
    this.props.onSignInPress();
  };

  private onSignUpButtonPress = () => {
    this.setState({ response: "Please Wait ...." })
    fetch("https://prototype.dev.iotnxt.io/api/v3/account/checkupdateusername", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: this.state.formData.username.toLowerCase() })
    })
      .then(response => response.json())
      .then(data => {
        if (data.available == true) {
          this.register()
        }
        else {
          this.setState({ response: "username has been taken" })
        }
      })
      .catch(err => console.error(err.toString()));
  };

  private register = () => {
    fetch("https://prototype.dev.iotnxt.io/api/v3/admin/register", {
      //https://8bo.org/api/v4/admin/register
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.formData.email.toLowerCase(),
        username: this.state.formData.username.toLowerCase(),
        pass: this.state.formData.password
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ response: data.error })
        }
        else {
          this.setState({ response: "Registration Successfull" })
          this.props.onSignUpPress(this.state.formData);
          this.setState({ response: "" })
        }
      })
      .catch(err => console.error(err.toString()));
  }
  private renderPhotoButtonIcon = (style: StyleType): React.ReactElement<ImageProps> => {
    const { themedStyle } = this.props;

    return PlusIconFill({ ...style, ...themedStyle.photoButtonIcon });
  };

  private renderPhotoButton = (): React.ReactElement<ButtonProps> => {
    const { themedStyle } = this.props;

    return (
      <Button
        style={themedStyle.photoButton}
        activeOpacity={0.95}
        icon={this.renderPhotoButtonIcon}
        onPress={this.onPhotoButtonPress}
      />
    );
  };

  public render(): React.ReactNode {
    const { themedStyle } = this.props;

    return (
      <ScrollableAvoidKeyboard style={themedStyle.container}>
        <View style={themedStyle.headerContainer}>
        </View>
        <Text style={themedStyle.error}>
          {this.state.response}
        </Text>
        <SignUpForm
          style={themedStyle.formContainer}
          onDataChange={this.onFormDataChange}
        />
        <Button
          style={themedStyle.signUpButton}
          textStyle={textStyle.button}
          size='giant'
          disabled={!this.state.formData}
          onPress={this.onSignUpButtonPress}>
          SIGN UP
        </Button>
        <Button
          style={themedStyle.signInButton}
          textStyle={themedStyle.signInText}
          appearance='ghost'
          activeOpacity={0.75}
          onPress={this.onSignInButtonPress}>
          Already have an account? Sign In
        </Button>
      </ScrollableAvoidKeyboard>
    );
  }
}

export const SignUp2 = withStyles(SignUp2Component, (theme: ThemeType) => ({
  container: {
    flex: 1,
    backgroundColor: ['background-basic-color-1'],
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 216,
    backgroundColor: theme['color-primary-default'],
  },
  error: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red'
  },
  formContainer: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  photo: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignSelf: 'center',
    backgroundColor: theme['background-basic-color-1'],
    tintColor: theme['color-primary-default'],
  },
  photoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    transform: [{ translateY: 80 }],
    borderColor: theme['border-basic-color-2'],
    backgroundColor: theme['background-basic-color-2'],
  },
  photoButtonIcon: {
    width: 24,
    height: 24,
    tintColor: theme['color-primary-default'],
  },
  signUpButton: {
    marginHorizontal: 16,
  },
  signInButton: {
    marginVertical: 12,
  },
  signInText: {
    color: theme['text-hint-color'],
    ...textStyle.subtitle,
  },
}));

