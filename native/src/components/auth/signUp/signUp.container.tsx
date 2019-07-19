import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { SignUpFormData } from '../../../../src/components/auth';
import { SignUp2 } from './signUp.component';

export class SignUpContainer extends React.Component<NavigationScreenProps> {

  private navigationKey: string = 'SignUpContainer';

  private onSignUpPress = (data: SignUpFormData) => {
    this.props.navigation.goBack();
  };

  private onSignInPress = () => {
    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: 'Sign In',
    });
  };

  private onPhotoPress = () => {

  };

  public render(): React.ReactNode {
    return (
      <SignUp2
        onSignUpPress={this.onSignUpPress}
        onSignInPress={this.onSignInPress}
        onPhotoPress={this.onPhotoPress}
      />
    );
  }
}
