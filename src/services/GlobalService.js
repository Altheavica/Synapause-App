//=======ELEMENT=======//
const API_URL = "https://script.google.com/macros/s/AKfycbzE3DuUQM-m9Bi5Uggo0x0prOGeUuB04U4kUvTfI_RW_ESdOVQ6Ul0zkrzNXpOlhf4/exec";



//=======STATE=======//
let toastTimer;



//=======HELPER=======/
export default function GlobalService({
    toastMessage,
    setToastMessage,
    toastVisible,
    setToastVisible,
    toastColor,
    setToastColor,
}) {

    function switchStep(setStep, nextStep) {
        setTimeout(() => {
            setStep(nextStep);
        }, 120);
    }

    function setLoading(setDisabled, setLoadingText, text) {
        if (typeof setDisabled === "function") {
            setDisabled(true);
        }

        if (typeof setLoadingText === "function") {
            setLoadingText(text);
        }
    }

    function clearLoading(setDisabled, setLoadingText, text) {
        if (typeof setDisabled === "function") {
            setDisabled(false);
        }

        if (typeof setLoadingText === "function") {
            setLoadingText(text);
        }
    }

    function showSuccess(message) {
        clearTimeout(toastTimer);

        setToastMessage(message);
        setToastColor("#22c55e");
        setToastVisible(true);

        toastTimer = setTimeout(() => {
            setToastVisible(false);
        }, 2500);
    }

    function showError(message) {
        clearTimeout(toastTimer);

        setToastMessage(message);
        setToastColor("#ef4444");
        setToastVisible(true);

        toastTimer = setTimeout(() => {
            setToastVisible(false);
        }, 3000);
    }

    function onlyNumber(value) {
        return value.replace(/\D/g, "");
    }

    function togglePassword(
        secure,
        setSecure,
        setIcon
    ) {
        if (secure) {
            setSecure(false);
            setIcon("🙈");
        }

        else {
            setSecure(true);
            setIcon("👁");
        }
    }

    return {
        API_URL,
        switchStep,
        setLoading,
        clearLoading,
        showSuccess,
        showError,
        onlyNumber,
        togglePassword,
    };
}