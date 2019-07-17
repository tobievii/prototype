import React from 'react';
import { View, ViewProps } from 'react-native';
import { ThemedComponentProps, ThemeType, withStyles } from 'react-native-ui-kitten';
import { Button } from 'react-native-ui-kitten';
import { textStyle, ValidationInput } from '../../../../src/components/common';
import { EyeOffIconFill, PersonIconFill } from '../../../../src/assets/icons';
import { PasswordValidator, EmailValidator } from '../../../../src/core/validators';
import { SignInFormData } from './type';

interface ComponentProps {
  onForgotPasswordPress: () => void;
  /**
   * Will emit changes depending on validation:
   * Will be called with form value if it is valid, otherwise will be called with undefined
   */
  onDataChange: (value: SignInFormData | undefined) => void;
}

export type SignInFormProps = ThemedComponentProps & ViewProps & ComponentProps;

interface State {
  username: string | undefined;
  password: string | undefined;
}

class SignInForm2Component extends React.Component<SignInFormProps, State> {

  state: State = {
    username: undefined,
    password: undefined,
  };

  public componentDidUpdate(prevProps: SignInFormProps, prevState: State) {
    const oldFormValid: boolean = this.isValid(prevState);
    const newFormValid: boolean = this.isValid(this.state);

    const isStateChanged: boolean = this.state !== prevState;
    const becomeValid: boolean = !oldFormValid && newFormValid;
    const becomeInvalid: boolean = oldFormValid && !newFormValid;
    const remainValid: boolean = oldFormValid && newFormValid;

    if (becomeValid) {
      this.props.onDataChange(this.state);
    } else if (becomeInvalid) {
      this.props.onDataChange(undefined);
    } else if (isStateChanged && remainValid) {
      this.props.onDataChange(this.state);
    }
  }

  private onForgotPasswordButtonPress = () => {
    this.props.onForgotPasswordPress();
  };

  private onUsernameInputTextChange = (username: string) => {
    this.setState({ username: username });
  };

  private onPasswordInputTextChange = (password: string) => {
    this.setState({ password: password });
  };

  private isValid = (value: SignInFormData): boolean => {
    const { username, password } = value;

    return username !== undefined
      && password !== undefined;
  };

  public render(): React.ReactNode {
    const { style, themedStyle, ...restProps } = this.props;

    return (
      <View
        style={[themedStyle.container, style]}
        {...restProps}>
        <View style={themedStyle.formContainer}>
          <ValidationInput
            textStyle={textStyle.paragraph}
            placeholder='Username or Email'
            icon={PersonIconFill}
            validator={EmailValidator}
            onChangeText={this.onUsernameInputTextChange}
          />
          <ValidationInput
            style={themedStyle.passwordInput}
            textStyle={textStyle.paragraph}
            placeholder='Password'
            icon={EyeOffIconFill}
            secureTextEntry={true}
            validator={PasswordValidator}
            onChangeText={this.onPasswordInputTextChange}
          />
          <View style={themedStyle.forgotPasswordContainer}>
            <Button
              style={themedStyle.forgotPasswordButton}
              textStyle={themedStyle.forgotPasswordText}
              appearance='ghost'
              activeOpacity={0.75}
              onPress={this.onForgotPasswordButtonPress}>
              Forgot your password?
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export const SignInForm = withStyles(SignInForm2Component, (theme: ThemeType) => ({
  container: {},
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: theme['text-hint-color'],
    ...textStyle.subtitle,
  },
}));

