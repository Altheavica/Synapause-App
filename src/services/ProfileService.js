//=======ELEMENT=======//
import AsyncStorage from "@react-native-async-storage/async-storage";



//=======HELPER=======//
export default function ProfileService({
    setProfileVisible,
    setSettingsVisible,
    setChangeVisible,
    setChangeSection,
    setUsername,
    setEmail,
    updateNavbar,
}) {

    function closeProfile() {
        setProfileVisible(false);
    }

    function openSettings() {
        setProfileVisible(false);
        setSettingsVisible(true);
    }

    function openChangeUsername() {
        setProfileVisible(false);
        setChangeSection("username");
        setChangeVisible(true);
    }

    function openChangeEmail() {
        setProfileVisible(false);
        setChangeSection("email");
        setChangeVisible(true);
    }

    function openChangePassword() {
        setProfileVisible(false);
        setChangeSection("password");
        setChangeVisible(true);
    }

    async function logout() {
        await AsyncStorage.removeItem(
            "synapauseUser"
        );

        setProfileVisible(false);

        setUsername("Sign Up");
        setEmail("");

        if(updateNavbar){
            await updateNavbar();
        }
    }

    return{
        closeProfile,
        openSettings,
        openChangeUsername,
        openChangeEmail,
        openChangePassword,
        logout,
    };
}