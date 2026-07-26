//===============ELEMENT===============//
export default function LoginService({
    // Overlay
    loginVisible,
    setLoginVisible,

    // Login
    loginIdentifier,
    setLoginIdentifier,
    loginPopupVisible,
    setLoginPopupVisible,
    loginPassword,
    setLoginPassword,

    // Register
    registerStep,
    setRegisterStep,
    registerPopupVisible,
    setRegisterPopupVisible,
    regEmail,
    setRegEmail,
    regOTP,
    setRegOTP,
    regUsername,
    setRegUsername,
    regPassword,
    setRegPassword,
    regConfirm,
    setRegConfirm,
    passwordWarning,
    setPasswordWarning,

    // Forgot Password
    forgotStep,
    setForgotStep,
    forgotPopupVisible,
    setForgotPopupVisible,
    forgotEmail,
    setForgotEmail,
    forgotOTP,
    setForgotOTP,
    forgotNewPassword,
    setForgotNewPassword,
    forgotConfirmPassword,
    setForgotConfirmPassword,

    // Toast
    toastVisible,
    setToastVisible,
    toastMessage,
    setToastMessage,
}){
}



//===============HELPER===============//
function checkPassword() {
    const password = regPassword;
    const confirm = regConfirm;

    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password === "") {
        setPasswordWarning("");
        return;
    }

    let messages = [];

    if (!hasLength) messages.push("Minimal 8 karakter");
    if (!hasUpper) messages.push("Huruf besar");
    if (!hasLower) messages.push("Huruf kecil");
    if (!hasNumber) messages.push("Angka");

    if (messages.length) {
        setPasswordWarning("Kurang: " + messages.join(", "));
    }

    else {
        setPasswordWarning("Password memenuhi syarat.");
    }

    if (confirm === "") {
        return;
    }

    if (password !== confirm) {
        setPasswordWarning("Password tidak cocok.");
    }

    else if (messages.length === 0) {
        setPasswordWarning("Password siap digunakan.");
    }
}

async function loginUser() {
    if (
        loginIdentifier.trim() === "" ||
        loginPassword.trim() === ""
    ) {
        showError("Lengkapi Username atau Email dan password.");
        return;
    }

    setLoading("login");

    try {
        const response = await fetch(
            API_URL +
            "?action=login" +
            "&identifier=" + encodeURIComponent(loginIdentifier.trim()) +
            "&password=" + encodeURIComponent(loginPassword)
        );

        const result = await response.json();

        if (result.success) {
            console.log("LOGIN RESULT");
            console.log(result);

            const user = {
                username: result.username,
                email: result.email,
                id: result.id
            };

            console.log("POST MESSAGE SENT");

            saveUser(user);
            updateNavbar();
            showSuccess("Login berhasil.");
            setLoginVisible(false);
        }

        else {
            showError(result.message);
        }
    }

    catch (error) {
        console.error(error);
        showError("Tidak dapat terhubung ke server.");
    }

    clearLoading("login");
}



//===============LISTENER===============//
function loginOverlayPress(target) {
    if (target === "loginOverlay") {
        setLoginVisible(false);
        setRegisterPopupVisible(false);
        setLoginPopupVisible(true);
    }
}

//Login//
function closeLogin() {
    setLoginVisible(false);
}

function loginButtonPress() {
    loginUser();
}

function openForgot() {
    setTimeout(() => {
        setLoginPopupVisible(false);
        setForgotPopupVisible(true);
    }, 180);
}

function openRegister() {
    setTimeout(() => {
        setLoginPopupVisible(false);
        setRegisterPopupVisible(true);
    }, 180);
}