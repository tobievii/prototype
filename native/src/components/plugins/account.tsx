import React from 'react';
import { View, Button } from 'react-native';
// import { styles } from '../../containers/menu/Settings/settings.container'
import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten';

export const name = "Account";

type Props = ThemedComponentProps

class Account extends React.Component<Props> {

    cookie = undefined;
    platform: "https://prototype.dev.iotnxt.io"

    private signout = () => {
        fetch(this.platform + '/signout', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.cookie),
        }).then((response) => response.text())
    }

    public render(): React.ReactNode {
        const { themedStyle } = this.props;
        console.log(this.props)
        return (
            <View>
                <Button title="SIGN OUT" onPress={this.signout} />
            </View>
        );
    }
}

export default Account;