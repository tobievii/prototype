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
    }

    componentWillMount = async () => {
        // if (this.state.user == undefined) {
        //     var user = JSON.parse(await AsyncStorage.getItem('user'))
        //     console.log(user)
        //     if (user && user.auth) {
        //         this.setState({ user: user })
        //     } else {
        //         this.setState({ user: { auth: "user" } })
        //     }
        // }
    }

    // componentDidMount = () => {
    //     console.log(this.state)
    // }

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
                    <ChangeUsername auth={"this.props.navigation.state.params.account._55"} />
                </View>
                <View>
                    <Button title="SIGN OUT" onPress={this.signout} />
                </View>
            </View>
        );
    }
}

export default Account;