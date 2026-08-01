import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const COLORS = {
    bg: "#f5f7fb",
    surface: "#ffffff",
    surface2: "#f8fafc",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    accent: "#2563eb",
    white: "#ffffff",
    dark: "#0f172a",
    header: "rgba(15,23,42,.55)",
    background: "#f8fafc",
    primary: "#2563eb",
};



export default StyleSheet.create({
    /* ==========================
            OVERLAY
    ========================== */
    settingsOverlay:{
        position:"absolute",
        top:0,
        right:0,
        bottom:0,
        left:0,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,.45)",
        padding:20,
        zIndex:99999,
    },



    /* ==========================
            POPUP
    ========================== */
    settingsPopup:{
        width:"92%",
        maxWidth:520,
        backgroundColor:COLORS.surface,
        borderWidth:1,
        borderColor:COLORS.border,
        borderRadius:24,
        padding:30,
        maxHeight:"90%",
        elevation:12,
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8,
        },
        shadowOpacity:0.18,
        shadowRadius:18,
    },

    settingsScroll:{
        flexGrow:0,
    },

    popupCloseButton:{
        alignSelf:"flex-end",
        paddingHorizontal:4,
        paddingVertical:2,
    },

    popupCloseText:{
        fontSize:28,
        color:COLORS.text,
        fontWeight:"400",
    },

    settingsTitle:{
        fontSize:22,
        fontWeight:"800",
        color:COLORS.text,
        marginTop:-8,
    },



    /* ==========================
            SECTION
    ========================== */
    settingsSection:{
        marginTop:22,
    },

    sectionTitle:{
        fontSize:18,
        fontWeight:"800",
        color:COLORS.text,
        marginBottom:10,
    },

    settingButton:{
        width:"100%",
        marginTop:10,
        paddingVertical:13,
        borderRadius:12,
        backgroundColor:COLORS.surface2,
        justifyContent:"center",
        alignItems:"center",
    },

    settingButtonText:{
        fontSize:16,
        color:COLORS.text,
    },

    divider:{
        height:1,
        backgroundColor:COLORS.border,
        marginVertical:22,
    },



    /* ==========================
            MONITOR
    ========================== */
    monitorList:{
        marginTop:15,
    },

    monitorItem:{
        flexDirection:"row",
        alignItems:"center",
        padding:14,
        marginBottom:12,
        borderRadius:14,
        backgroundColor:COLORS.surface2,
        borderWidth:1,
        borderColor:COLORS.border,
    },

    monitorIcon:{
        width:24,
        height:24,
        marginRight:15,
        resizeMode:"contain",
    },

    monitorText:{
        flex:1,
        fontSize:16,
        color:COLORS.text,
    },

    comingSoon:{
        fontSize:16,
        color:COLORS.textSecondary,
    }
});