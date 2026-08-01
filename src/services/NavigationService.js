//=======ELEMENT=======//
import AsyncStorage from "@react-native-async-storage/async-storage";



//=======HELPER=======//
export default function NavigationService({
    dropdownVisible,
    setDropdownVisible,
    profileVisible,
    setProfileVisible,
    setLoginVisible,
    username,
    setUsername,
    email,
    setEmail,
}) {

    async function updateNavbar() {
        const user = JSON.parse(
            await AsyncStorage.getItem("synapauseUser")
        );

        if (user) {
            setUsername(user.username);
        }

        else {
            setUsername("Sign Up");
        }
    }

    function toggleDropdown() {
        setDropdownVisible(!dropdownVisible);
    }

    function closeDropdown() {
        setDropdownVisible(false);
    }

    async function openAccount() {
        const user = JSON.parse(
            await AsyncStorage.getItem("synapauseUser")
        );

        setDropdownVisible(false);

        if (user) {
            setUsername(user.username);
            setEmail(user.email);

            setProfileVisible(true);
        }

        else {
            setLoginVisible(true);
        }
    }

    function mobileSignUp() {
        openAccount();
    }

    function closeProfile() {
        if (profileVisible) {
            setProfileVisible(false);
        }
    }

    return {
        updateNavbar,
        toggleDropdown,
        closeDropdown,
        openAccount,
        mobileSignUp,
        closeProfile,
    };
}