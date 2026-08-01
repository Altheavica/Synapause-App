//=======ELEMENT=======//
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalService from "./GlobalService";
import BackgroundService from "./BackgroundService";


//=======HELPER=======//
export default function LoginService({
    // Login
    loginIdentifier,
    loginPassword,
    setLoginIdentifier,
    setLoginPassword,
    setLoginVisible,
    setLoginPopupVisible,
    setProfileVisible,
    updateNavbar,

    // Register
    registerEmail,
    registerOTP,
    registerUsername,
    registerPassword,
    registerConfirmPassword,
    setRegisterPopupVisible,
    setRegisterStep,
    setPasswordWarning,
    setRegisterEmail,
    setRegisterOTP,
    setRegisterUsername,
    setRegisterPassword,
    setRegisterConfirmPassword,

    // Forgot
    forgotStep,
    forgotEmail,
    forgotOTP,
    forgotNewPassword,
    forgotConfirmPassword,
    setForgotStep,
    setForgotPopupVisible,
    setForgotEmail,
    setForgotOTP,
    setForgotNewPassword,
    setForgotConfirmPassword,

    // Toast
    toastMessage,
    setToastMessage,
    toastVisible,
    setToastVisible,
    toastColor,
    setToastColor,
}){
    const{
        showSuccess,
        showError,
        switchStep,
        setLoading,
        clearLoading,
        onlyNumber,
        API_URL,
    } = GlobalService({
        toastMessage,
        setToastMessage,
        toastVisible,
        setToastVisible,
        toastColor,
        setToastColor,
    });



    //====HELPER====//
    function checkPassword(){
        const password = registerPassword;
        const confirm = registerConfirmPassword;

        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if(password===""){
            setPasswordWarning("");
            return;
        }

        let messages=[];

        if(!hasLength) messages.push("Minimal 8 karakter");
        if(!hasUpper) messages.push("Huruf besar");
        if(!hasLower) messages.push("Huruf kecil");
        if(!hasNumber) messages.push("Angka");

        if(messages.length){
            setPasswordWarning(
                "Kurang: "+messages.join(", ")
            );
        }

        else{
            setPasswordWarning(
                "Password memenuhi syarat."
            );
        }

        if(confirm===""){
            return;
        }

        if(password!==confirm){
            setPasswordWarning(
                "Password tidak cocok."
            );
        }

        else if(messages.length===0){
            setPasswordWarning(
                "Password siap digunakan."
            );
        }
    }

    async function loginUser(loginButtonRef){
        if(
            loginIdentifier.trim()===""
            ||
            loginPassword.trim()===""
        ){
            showError(
                "Lengkapi Username atau Email dan password."
            );
            return;
        }

        setLoading(
            loginButtonRef,
            "Logging in"
        );

        try{
            const response = await fetch(
                API_URL+
                "?action=login"+
                "&identifier="+
                encodeURIComponent(
                    loginIdentifier.trim()
                )+
                "&password="+
                encodeURIComponent(
                    loginPassword
                )
            );

            const result = await response.json();

            if(result.success){
                console.log("LOGIN RESULT");
                console.log(result);

                await AsyncStorage.setItem(
                    "synapauseUser",

                    JSON.stringify({
                        username: result.username,
                        email: result.email,
                        id: result.id,
                    })
                );

                await BackgroundService.startMonitoring();

                if (updateNavbar) {
                    await updateNavbar();
                }

                showSuccess(
                    "Login berhasil."
                );

                setLoginVisible(false);
                setLoginPopupVisible(true);
                setRegisterPopupVisible(false);
                setForgotPopupVisible(false);
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);
            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            loginButtonRef,
            "Login"
        );
    }

    //====LISTENER====//
    function closeLoginOverlay() {
        setLoginVisible(false);
        setRegisterPopupVisible(false);
        setLoginPopupVisible(true);
    }

    //Login//
    function closeLogin() {
        setLoginVisible(false);
    }

    function openForgot() {
        setLoginPopupVisible(false);

        setTimeout(() => {
            setForgotPopupVisible(true);
        },180);
    }

    function openRegister() {
        setLoginPopupVisible(false);

        setTimeout(() => {
            setRegisterPopupVisible(true);
        },180);
    }

    //Register//
    function closeRegister(){
        setRegisterPopupVisible(false);
        setLoginPopupVisible(true);
        setLoginVisible(false);
        setRegisterStep(1);
        setRegisterEmail("");
        setRegisterOTP("");
        setRegisterUsername("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setPasswordWarning("");
    }

    async function continueEmail(continueButtonRef){
        const email = registerEmail.trim();
        if(email===""){
            showError(
                "Email harus diisi."
            );

            return;
        }

        setLoading(
            continueButtonRef,
            "Sending"
        );

        try{
            const response = await fetch(
                API_URL+
                "?action=sendVerificationOTP"+
                "&email="+
                encodeURIComponent(email)
            );

            const result = await response.json();

            if(result.success){
                switchStep(
                    setRegisterStep,
                    2
                );
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);

            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            continueButtonRef,
            "Continue"
        );
    }

    function registerOtpInput(text){
        return onlyNumber(text);
    }

    function registerOtpSubmit(){
        return true;
    }

    async function verifyOTP(verifyButtonRef){
        const email = registerEmail.trim();
        const otp = registerOTP.trim();

        if(otp===""){
            showError(
                "OTP harus diisi."
            );

            return;
        }

        setLoading(
            verifyButtonRef,
            "Verifying"
        );

        try{
            const response = await fetch(
                API_URL+
                "?action=verifyOTP"+
                "&email="+
                encodeURIComponent(email)+
                "&otp="+
                encodeURIComponent(otp)
            );

            const result = await response.json();

            if(result.success){
                switchStep(
                    setRegisterStep,
                    3
                );
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);

            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            verifyButtonRef,
            "Verify OTP"
        );
    }

    function continueUsername(){
        if(registerUsername.trim()===""){
            showError(
                "Username harus diisi."
            );

            return;
        }

        switchStep(
            setRegisterStep,
            4
        );
    }

    async function registerUser(registerButtonRef){
        if(
            registerPassword.trim()===""
            ||
            registerConfirmPassword.trim()===""
        ){
            showError(
                "Password harus diisi."
            );

            return;
        }

        if(
            registerPassword!==registerConfirmPassword
        ){
            showError(
                "Password tidak cocok."
            );

            return;
        }

        const password=registerPassword;
        if(
            password.length<8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password)
        ){
            showError(
                "Password belum memenuhi syarat."
            );

            return;
        }

        setLoading(
            registerButtonRef,
            "Registering"
        );

        try{
            const response=await fetch(
                API_URL+
                "?action=register"+
                "&username="+
                encodeURIComponent(registerUsername.trim())+
                "&email="+
                encodeURIComponent(registerEmail.trim())+
                "&password="+
                encodeURIComponent(registerPassword)
            );

            const result=await response.json();

            if(result.success){
                await AsyncStorage.setItem(
                    "synapauseUser",

                    JSON.stringify({
                        username:result.username,
                        email:result.email,
                        id:result.id
                    })
                );

                await BackgroundService.startMonitoring();

                if (updateNavbar) {
                    await updateNavbar();
                }

                setRegisterStep(1);
                setRegisterEmail("");
                setRegisterOTP("");
                setRegisterUsername("");
                setRegisterPassword("");
                setRegisterConfirmPassword("");
                setPasswordWarning("");
                setRegisterPopupVisible(false);
                setLoginPopupVisible(true);
                setLoginVisible(false);

                if(setProfileVisible){
                    setProfileVisible(true);
                }

                showSuccess(
                    "Register berhasil."
                );
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);

            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            registerButtonRef,
            "Register"
        );
    }

    //Forgot//
    function closeForgot(){
        setForgotPopupVisible(false);
        setLoginPopupVisible(true);
        setForgotStep(1);
        setForgotEmail("");
        setForgotOTP("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
    }

    async function forgotContinue(forgotContinueButtonRef){
        const email = forgotEmail.trim();

        if(email===""){
            showError(
                "Email harus diisi."
            );

            return;
        }

        setLoading(
            forgotContinueButtonRef,
            "Sending"
        );

        try{
            const response = await fetch(
                API_URL+
                "?action=sendResetOTP"+
                "&email="+
                encodeURIComponent(email)
            );

            const result = await response.json();

            if(result.success){
                switchStep(
                    setForgotStep,
                    2
                );
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);

            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            forgotContinueButtonRef,
            "Continue"
        );
    }

    function backToLogin(){
        setForgotPopupVisible(false);
        setRegisterPopupVisible(false);
        setLoginPopupVisible(true);
        setForgotStep(1);
    }

    function forgotOtpInput(text){
        return onlyNumber(text);
    }

    function forgotOtpSubmit(){
        return verifyResetOTP();
    }

    async function verifyResetOTP(verifyButtonRef){
        const otp = forgotOTP.trim();

        if(otp===""){
            showError(
                "OTP harus diisi."
            );

            return;
        }

        setLoading(
            verifyButtonRef,
            "Verifying"
        );

        try{
            const response = await fetch(
                API_URL+
                "?action=verifyResetOTP"+
                "&email="+
                encodeURIComponent(
                    forgotEmail.trim()
                )+
                "&otp="+
                encodeURIComponent(otp)
            );

            const result = await response.json();

            if(result.success){
                switchStep(
                    setForgotStep,
                    3
                );
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);

            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            verifyButtonRef,
            "Verify OTP"
        );
    }

    async function resetPassword(resetPasswordButtonRef){
        if(
            forgotNewPassword.trim()===""
            ||
            forgotConfirmPassword.trim()===""
        ){
            showError(
                "Password harus diisi."
            );

            return;
        }

        if(
            forgotNewPassword!==forgotConfirmPassword
        ){
            showError(
                "Password tidak cocok."
            );

            return;
        }

        setLoading(
            resetPasswordButtonRef,
            "Resetting"
        );

        try{
            const response = await fetch(
                API_URL+
                "?action=resetPassword"+
                "&email="+
                encodeURIComponent(
                    forgotEmail.trim()
                )+
                "&newPassword="+
                encodeURIComponent(
                    forgotNewPassword
                )
            );

            const result = await response.json();

            if(result.success){
                showSuccess(
                    result.message
                );

                setForgotStep(1);
                setForgotEmail("");
                setForgotOTP("");
                setForgotNewPassword("");
                setForgotConfirmPassword("");
                setLoginIdentifier("");
                setLoginPassword("");
                setForgotPopupVisible(false);
                setLoginPopupVisible(true);
                setLoginVisible(true);
            }

            else{
                showError(
                    result.message
                );
            }
        }

        catch(error){
            console.error(error);

            showError(
                "Tidak dapat terhubung ke server."
            );
        }

        clearLoading(
            resetPasswordButtonRef,
            "Reset Password"
        );
    }

    return{
        checkPassword,
        loginUser,
        closeLoginOverlay,
        closeLogin,
        openForgot,
        openRegister,
        closeRegister,
        continueEmail,
        registerOtpInput,
        registerOtpSubmit,
        verifyOTP,
        continueUsername,
        registerUser,
        closeForgot,
        forgotContinue,
        backToLogin,
        forgotOtpInput,
        forgotOtpSubmit,
        verifyResetOTP,
        resetPassword,
    };
}