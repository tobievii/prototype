import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { SignInFormData } from '../../../../src/components/auth';
import { SignIn } from './signIn.component';
import { AsyncStorage } from 'react-native';
import { url, version } from '../../../app.component'
export class SignInContainer extends React.Component<NavigationScreenProps> {
  state: {
    view: undefined,
  };
  private navigationKey: string = 'SignInContainer';

  componentWillMount = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    if (user && user.auth) {
      await fetch(url + '/api/' + version + '/account', {
        //https://8bo.org/api/v4/account
        method: 'GET',
        headers: {
          'Authorization': user.auth,
          'Content-Type': 'application/json',
        },
      })
        .then(resp => resp.json())
        .then((data) => {
          if (data.uuid === user.uuid) {
            this.user(user);
          } else {
            AsyncStorage.clear();
          }
        });
    }
  }

  private getAccount = async (res: any) => {
    await fetch(url + '/api/' + version + '/account', {
      //https://8bo.org/api/v4/account
      method: 'GET',
      headers: {
        'Authorization': res.auth,
        'Content-Type': 'application/json',
      },
    })
      .then(resp => resp.json())
      .then((data) => {
        data.auth = res.auth;
        AsyncStorage.setItem('user', JSON.stringify(data));
        this.user(undefined);
      });
  }

  private onSignInPress = async (data: SignInFormData) => {
    await fetch(url + '/signin', {
      //https://8bo.org/signin
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.username.toLowerCase(),
        pass: data.password,
        mobile: true,
      }),
    }).then((response) => response.text())
      .then((responseJson) => {
        const res = JSON.parse(responseJson);
        if (res.signedin === true && res.auth) {
          this.getAccount(res);
        } else {
          this.props.navigation.navigate('Sign In')
        }
      })
      .catch((error) => {
        // tslint:disable-next-line: no-console
        console.log(error);
      });

  };

  user = async (user: any) => {
    if (!user) {
      user = await AsyncStorage.getItem('user');
    }

    this.props.navigation.navigate('Device List', { 'user': user });
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
