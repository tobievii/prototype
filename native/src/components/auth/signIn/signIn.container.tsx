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

  componentWillMount = async () => {
    var user = await AsyncStorage.getItem('user')
    if (user) {
      this.user(user);
    }
  }

  componentDidUpdate = async () => {
    var user = await AsyncStorage.getItem('user')
    if (user) {
      this.user(user);
    }
  }

  private onSignInPress = async (data: SignInFormData) => {
    await fetch('https://prototype.dev.iotnxt.io/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.username.toLowerCase(),
        pass: data.password,
        mobile: true
      }),
    }).then((response) => response.text())
      .then((responseJson) => {
        var res = JSON.parse(responseJson)
        if (res.signedin == true) {
          AsyncStorage.setItem('user', JSON.stringify({
            email: data.username.toLowerCase(),
            pass: data.password,
            auth: "userheader"
          }));
          this.user(undefined);
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

  user = async (user: any) => {
    if (!user) {
      user = await AsyncStorage.getItem('user')
    }

    this.props.navigation.navigate('Device List', { "user": user });
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
