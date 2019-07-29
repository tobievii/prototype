import React from 'react';
import { View, Button, AsyncStorage, TextInput } from 'react-native';
// import { styles } from '../../containers/menu/Settings/settings.container'
// import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';
import ChangeUsername from '../common/changUsername'

export const name = "Account";

class Account extends React.Component<NavigationScreenProps>{

    state = {
        user: undefined
    }

    constructor(props) {
        super(props)

        // console.log(props)
    }

    componentWillMount = async () => {
        if (!this.state.user) {
            var user = await AsyncStorage.getItem('user')
            this.setState({ user: user })
        }
    }

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
                <View>
                    <ChangeUsername auth={this.state.user.auth} />
                </View>
                <View>
                    <Button title="SIGN OUT" onPress={this.signout} />
                </View>
            </View>
        );
    }
}

export default Account;