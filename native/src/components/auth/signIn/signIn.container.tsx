import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { SignInFormData } from '@src/components/login/auth';
import { SignIn } from './signIn.component';

export class SignInContainer extends React.Component<NavigationScreenProps> {

  private navigationKey: string = 'SignInContainer';

  private onSignInPress = (data: SignInFormData) => {
    this.props.navigation.goBack();
  };

  private onSignUpPress = () => {
    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: 'Sign Up',
    });
  };

  private onForgotPasswordPress = () => {
    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: 'Forgot Password',
    });
  };

  public render(): React.ReactNode {
    return (
      <SignIn
        onSignInPress={this.onSignInPress}
        onSignUpPress={this.onSignUpPress}
        onForgotPasswordPress={this.onForgotPasswordPress}
      />
    );
  }
}
