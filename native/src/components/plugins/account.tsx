import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button, Avatar } from 'react-native-elements';
// import { styles } from '../../containers/menu/Settings/settings.container'
// import { withStyles, ThemeType, ThemedComponentProps } from 'react-native-ui-kitten';
import { NavigationScreenProps } from 'react-navigation';

export const name = "Account";

class Account extends React.Component<NavigationScreenProps>{

    state = {
        user: undefined,
        account: undefined
    }

    constructor(props) {
        super(props)
        this.getAccount();
    }

    private getAccount = async () => {
        this.setState({ account: JSON.parse(await AsyncStorage.getItem('user')) })
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
        if (this.state.account) {
            return (
                <View style={{ height: 40, margin: 10 }}>
                    <View style={{ marginHorizontal: "30%", marginVertical: 10 }}>
                        <Avatar
                            title={"Prototype"}
                            size="xlarge"
                            rounded
                            source={{
                                uri:
                                    'https://prototype.dev.iotnxt.io/avatar.jpg',
                            }}
                            showEditButton
                        />
                    </View>
                    <View style={{ width: "40%", marginBottom: 20 }}>
                        <Button title="Change Password" onPress={() => { this.props.navigation.navigate("changePassword", { account: this.state.account }) }} />
                    </View>
                    <View style={{ width: "40%", marginBottom: 20 }}>
                        <Button title="Change Username" onPress={() => { this.props.navigation.navigate("changeUsername", { account: this.state.account }) }} />
                    </View>
                    <View style={{ width: "50%" }}>
                        <Button title="SIGN OUT" onPress={this.signout} />
                    </View>
                </View>
            )
        } else {
            return (<View style={{ height: 40, margin: 10 }}></View>)
        }
    }
}

export default Account;