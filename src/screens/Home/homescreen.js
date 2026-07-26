import React, { useState } from 'react';

import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Switch,
    ScrollView,
    KeyboardAvoidingView,
    Image,
} from 'react-native';

import styles from '../../styles/Home.styles';
export default function HomeScreen() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const [changeUsernameStep, setChangeUsernameStep] = useState(1);
    const [changeEmailStep, setChangeEmailStep] = useState(1);
    const [changePasswordStep, setChangePasswordStep] = useState(1);
    const [changePasswordWarning, setChangePasswordWarning] = useState('');
    const [loginVisible, setLoginVisible] = useState(false);
    const [loginPopupVisible, setLoginPopupVisible] = useState(true);
    const [registerPopupVisible, setRegisterPopupVisible] = useState(false);
    const [forgotPopupVisible, setForgotPopupVisible] = useState(false);
    const [registerStep, setRegisterStep] = useState(1);
    const [passwordWarning, setPasswordWarning] = useState('');
    const [forgotStep, setForgotStep] = useState(1);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [changeVisible, setChangeVisible] = useState(false);
    const username = "Username";
    const email = "Email";

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <ScrollView>
                    {/*==========HEADER==========*/}
                    <View style={styles.header}>
                        <Text style={styles.logo}>Synapause</Text>
                        <View style={styles.navigation}>
                            <View style={styles.desktopMenu}>
                                <TouchableOpacity>
                                    <Text style={styles.activeLink}>Home</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.navLink}>Contact Us</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.signUp}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() =>setDropdownVisible(!dropdownVisible)}>
                                <Text style={styles.menuIcon}>☰</Text>
                            </TouchableOpacity>
                        </View>
                        {profileVisible && (
                            <View style={styles.profilePanel}>
                                <TouchableOpacity onPress={() =>setProfileVisible(false)}>
                                    <Text style={styles.closeButton}>×</Text>
                                </TouchableOpacity>
                                <Text style={styles.profileTitle}>Account</Text>
                                <Text style={styles.profileUsername}>{username}</Text>
                                <Text style={styles.profileEmail}>{email}</Text>
                                <View style={styles.divider}/>
                                <TouchableOpacity style={styles.profileButton}>
                                    <Text style={styles.profileButtonText}>Dashboard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileButton}>
                                    <Text style={styles.profileButtonText}>Settings</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileButton}>
                                    <Text style={styles.profileButtonText}>Change Username</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileButton}>
                                    <Text style={styles.profileButtonText}>Change Email</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileButton}>
                                    <Text style={styles.profileButtonText}>Change Password</Text>
                                </TouchableOpacity>
                                <View style={styles.divider}/>
                                <TouchableOpacity style={styles.logoutButton}>
                                    <Text style={styles.profileButtonText}>Logout</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    {/*==========DROPDOWN==========*/}
                    {dropdownVisible && (
                        <View style={styles.dropdown}>
                            <View style={styles.mobileMenu}>
                                <TouchableOpacity>
                                    <Text style={styles.activeLink}>Home</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.navLink}>Contact Us</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={styles.signUp}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {/*==========PARALLAX==========*/}
                    <View style={styles.parallax}>
                        <Text style={styles.parallaxTitle}>SYNAPAUSE</Text>
                        <Text style={styles.parallaxDescription}>Train your focus. Strengthen your cognition. Build healthier digital habits through adaptive brain challenges.</Text>
                        <TouchableOpacity style={styles.exploreButton}>
                            <Text style={styles.exploreButtonText}>Explore More</Text>
                        </TouchableOpacity>
                    </View>
                    {/*==========SETTINGS==========*/}
                    {settingsVisible && (
                        <View style={styles.settingsOverlay}>
                            <View style={styles.settingsPopup}>
                                <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                                    <Text style={styles.closeButton}>×</Text>
                                </TouchableOpacity>
                                <Text style={styles.settingsTitle}>Settings</Text>
                                {/*Appearance*/}
                                <View style={styles.settingsSection}>
                                    <Text style={styles.sectionTitle}>Appearance</Text>
                                    <TouchableOpacity style={styles.settingButton}>
                                        <Text style={styles.settingButtonText}>System</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.settingButton}>
                                        <Text style={styles.settingButtonText}>Light</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.settingButton}>
                                        <Text style={styles.settingButtonText}>Dark</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.divider} />
                                {/*Website Monitoring*/}
                                <View style={styles.settingsSection}>
                                    <Text style={styles.sectionTitle}>Website Monitoring</Text>
                                    <View style={styles.monitorList}>
                                        <TouchableOpacity style={styles.monitorItem}>
                                            <Image source={require('../../assets/icons/youtube.png')} style={styles.monitorIcon}/>
                                            <Text style={styles.monitorText}>YouTube</Text>
                                            <Switch value={false} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.monitorItem}>
                                            <Image source={require('../../assets/icons/instagram.png')} style={styles.monitorIcon}/>
                                            <Text style={styles.monitorText}>Instagram</Text>
                                            <Switch value={false} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.monitorItem}>
                                            <Image source={require('../../assets/icons/tiktok.png')} style={styles.monitorIcon}/>
                                            <Text style={styles.monitorText}>TikTok</Text>
                                            <Switch value={false} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.monitorItem}>
                                            <Image source={require('../../assets/icons/facebook.png')} style={styles.monitorIcon}/>
                                            <Text style={styles.monitorText}>Facebook</Text>
                                            <Switch value={false} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.monitorItem}>
                                            <Image source={require('../../assets/icons/x.png')} style={styles.monitorIcon}/>
                                            <Text style={styles.monitorText}>X</Text>
                                            <Switch value={false} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.monitorItem}>
                                            <Image source={require('../../assets/icons/threads.png')} style={styles.monitorIcon}/>
                                            <Text style={styles.monitorText}>Threads</Text>
                                            <Switch value={false} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                {/*Personalize*/}
                                <View style={styles.settingsSection}>
                                    <Text style={styles.sectionTitle}>Personalize</Text>
                                    <Text style={styles.comingSoon}>Coming Soon</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    {/*==========CHANGE==========*/}
                    {changeVisible && (
                        <View style={styles.changeOverlay}>
                            <View style={styles.changePopup}>
                                <TouchableOpacity onPress={() => setChangeVisible(false)}>
                                    <Text style={styles.closeButton}>×</Text>
                                </TouchableOpacity>
                                {/*Change Username*/}
                                <View style={styles.changeSection}>
                                    <Text style={styles.changeTitle}>Change Username</Text>
                                    {changeUsernameStep === 1 && (
                                        <View style={styles.changeStep}>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Current Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {changeUsernameStep === 2 && (
                                        <View style={styles.changeStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="New Username"
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Save Username</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                {/*Change Email*/}
                                <View style={styles.changeSection}>
                                    <Text style={styles.changeTitle}>Change Email</Text>
                                    {changeEmailStep === 1 && (
                                        <View style={styles.changeStep}>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Current Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {changeEmailStep === 2 && (
                                        <View style={styles.changeStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="New Email"
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Send OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {changeEmailStep === 3 && (
                                        <View style={styles.changeStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Verification Code"
                                                keyboardType="number-pad"
                                                maxLength={6}
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Verify OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                {/*Change Password*/}
                                <View style={styles.changeSection}>
                                    <Text style={styles.changeTitle}>Change Password</Text>
                                    {changePasswordStep === 1 && (
                                        <View style={styles.changeStep}>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Current Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {changePasswordStep === 2 && (
                                        <View style={styles.changeStep}>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="New Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Confirm Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.warningText}>{changePasswordWarning}</Text>
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Save Password</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                    {/*==========LOGIN OVERLAY==========*/}
                    {loginVisible && (
                        <View style={styles.loginOverlay}>
                            {/*Login Popup*/}
                            {loginPopupVisible && (
                                <View style={styles.loginPopup}>
                                    <TouchableOpacity onPress={() => setLoginVisible(false)}>
                                        <Text style={styles.closeButton}>×</Text>
                                    </TouchableOpacity >
                                    <Text style={styles.popupTitle}>Login</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username or Email"
                                    />
                                    <View style={styles.passwordBox}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Password"
                                            secureTextEntry
                                        />
                                        <TouchableOpacity>
                                            <Text style={styles.eyeButton}>👁</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={styles.primaryButton}>
                                        <Text style={styles.primaryButtonText}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text style={styles.linkText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                    <View style={styles.inlineText}>
                                        <Text>Don't have an account?</Text>
                                        <TouchableOpacity>
                                            <Text style={styles.linkText}>Register</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            {/*Register Popup*/}
                            {registerPopupVisible && (
                                <View style={styles.registerPopup}>
                                    <TouchableOpacity>
                                        <Text style={styles.closeButton}>×</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.popupTitle}>Register</Text>
                                    {registerStep === 1 && (
                                        <View style={styles.registerStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Email"
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {registerStep === 2 && (
                                        <View style={styles.registerStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Verification Code"
                                                keyboardType="number-pad"
                                                maxLength={6}
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Verify OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {registerStep === 3 && (
                                        <View style={styles.registerStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Username"
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Continue</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {registerStep === 4 && (
                                        <View style={styles.registerStep}>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Confirm Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.warningText}>{passwordWarning}</Text>
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Register</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                            {/*Forgot Password*/}
                            {forgotPopupVisible && (
                                <View style={styles.forgotPopup}>
                                    <TouchableOpacity>
                                        <Text style={styles.closeButton}>×</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.popupTitle}>Forgot Password</Text>
                                    {forgotStep === 1 && (
                                        <View style={styles.forgotStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Email"
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Continue</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <Text style={styles.linkText}>Back to Login</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {forgotStep === 2 && (
                                        <View style={styles.forgotStep}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Verification Code"
                                                keyboardType="number-pad"
                                                maxLength={6}
                                            />
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Verify OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {forgotStep === 3 && (
                                        <View style={styles.forgotStep}>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="New Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.passwordBox}>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Confirm Password"
                                                    secureTextEntry
                                                />
                                                <TouchableOpacity>
                                                    <Text style={styles.eyeButton}>👁</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={styles.primaryButton}>
                                                <Text style={styles.primaryButtonText}>Reset Password</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                    {/*==========TOAST==========*/}
                    {toastVisible && (
                        <View style={styles.toast}>
                            <Text style={styles.toastText}>{toastMessage}</Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}