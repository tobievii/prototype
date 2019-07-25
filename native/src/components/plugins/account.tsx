import React from 'react';
import { View, Button, AsyncStorage } from 'react-native';
// import { styles } from '../../containers/menu/Settings/settings.container'
// import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';

export const name = "Account";

class Account extends React.Component<NavigationScreenProps>{

    private signout = async () => {
        try {
            await AsyncStorage.removeItem("user");
        }
        catch (exception) {
            console.log(exception)
        }
        this.props.navigation.navigate('Signout');
    }

    public render(): React.ReactNode {
        return (
            <View>
                <Button title="SIGN OUT" onPress={this.signout} />
            </View>
        );
    }
}

export default Account;