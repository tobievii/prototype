import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { SignInFormData } from '../../../../src/components/auth';
import { SignIn } from './signIn.component';
import { AsyncStorage } from 'react-native';

export class SignInContainer extends React.Component<NavigationScreenProps> {
  state: {
    view: undefined,
  };
  private navigationKey: string = 'SignInContainer';

  private onSignInPress = (data: SignInFormData) => {
    fetch('https://prototype.dev.iotnxt.io/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.username.toLowerCase(),
        pass: data.password
      }),
    }).then((response) => response.text())
      .then((responseJson) => {
        var res = JSON.parse(responseJson)
        if (res.signedin == true) {
          this.props.navigation.navigate({
            key: this.navigationKey,
            routeName: 'logged',
          });
        }
        else {
          this.props.navigation.navigate({
            key: this.navigationKey,
            routeName: 'Home',
          });
        }
      })
      .catch((error) => {
        console.log(error)
      });

  };

  user = async () => {
    this.setState({ view: await AsyncStorage.getItem('user') });
    if (this.state.view) {
      this.props.navigation.navigate({
        key: this.navigationKey,
        routeName: 'logged',
      });
    } else {
      this.props.navigation.navigate({
        key: this.navigationKey,
        routeName: 'Home',
      });
    }
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
