/* =========================================================
   AI CROP DOCTOR - COMPLETE FRONTEND SCRIPT
   Tamil + English Voice Support
   ========================================================= */

const API_URL = "http://127.0.0.1:5000/predict";
const TTS_URL = "http://127.0.0.1:5000/tts";
const HISTORY_KEY = "cropDoctorHistory";
const LANGUAGE_KEY = "cropDoctorLanguage";
const LOGIN_KEY = "cropDoctorLogin";
const logoutBtn = $("logoutBtn");

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "en";
let selectedFile = null;
let currentResult = null;
let availableVoices = [];


/* =========================================================
   DOM HELPER
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const imageInput = $("imageInput");
const browseBtn = $("browseBtn");
const uploadBox = $("uploadBox");

const previewSection = $("previewSection");
const imagePreview = $("imagePreview");
const removeImageBtn = $("removeImageBtn");
const predictBtn = $("predictBtn");

const loading = $("loading");
const errorBox = $("errorBox");
const errorMessage = $("errorMessage");
const errorCloseBtn = $("errorCloseBtn");

const resultSection = $("resultSection");
const resultImage = $("resultImage");

const cropName = $("cropName");
const diseaseName = $("diseaseName");
const confidence = $("confidence");
const confidenceLevel = $("confidenceLevel");
const confidenceBar = $("confidenceBar");
const confidenceLevelCard = $("confidenceLevelCard");
const confidenceLevelText = $("confidenceLevelText");

const severity = $("severity");
const symptoms = $("symptoms");
const treatment = $("treatment");
const organicSolution = $("organicSolution");
const nutrition = $("nutrition");
const prevention = $("prevention");
const warning = $("warning");

const lowConfidence = $("lowConfidence");

const newPredictionBtn = $("newPredictionBtn");
const viewHistoryBtn = $("viewHistoryBtn");
const resultHistoryBtn = $("resultHistoryBtn");
const downloadPdfBtn = $("downloadPdfBtn");

const historyModal = $("historyModal");
const closeHistoryBtn = $("closeHistoryBtn");
const historyList = $("historyList");
const emptyHistory = $("emptyHistory");
const clearHistoryBtn = $("clearHistoryBtn");

const chatModal = $("chatModal");
const closeChatBtn = $("closeChatBtn");
const chatMessages = $("chatMessages");
const chatInput = $("chatInput");
const sendChatBtn = $("sendChatBtn");

const weatherModal = $("weatherModal");
const closeWeatherBtn = $("closeWeatherBtn");
const weatherContent = $("weatherContent");
const getLocationWeatherBtn = $("getLocationWeatherBtn");

const supportModal = $("supportModal");
const closeSupportBtn = $("closeSupportBtn");

const analyticsModal = $("analyticsModal");
const closeAnalyticsBtn = $("closeAnalyticsBtn");

const totalPredictions = $("totalPredictions");
const healthyPredictions = $("healthyPredictions");
const diseasePredictions = $("diseasePredictions");
const averageConfidence = $("averageConfidence");
const analyticsChart = $("analyticsChart");

const loginModal = $("loginModal");
const closeLoginBtn = $("closeLoginBtn");
const loginForm = $("loginForm");
const loginName = $("loginName");
const loginPhone = $("loginPhone");
const loginBtn = $("loginBtn");

const englishBtn = $("englishBtn");
const tamilBtn = $("tamilBtn");

const mobileMenuBtn = $("mobileMenuBtn");
const navbarMenu = document.querySelector(".nav-menu");

const startDoctorBtn = $("startDoctorBtn");
const heroHistoryBtn = $("heroHistoryBtn");
const supportedStartBtn = $("supportedStartBtn");
const ctaStartBtn = $("ctaStartBtn");

const openChatBtn = $("openChatBtn");
const weatherBtn = $("weatherBtn");
const supportBtn = $("supportBtn");
const analyticsBtn = $("analyticsBtn");


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {

    en: {

        logoSubtitle: "AI Crop Doctor",

        navHome: "Home",
        navDoctor: "AI Doctor",
        navFeatures: "Features",
        navHow: "How It Works",
        navAssistant: "Farmer Guidance",
        login: "Farmer Login",

        aiPowered: "AI POWERED",
        heroTitle: "Smart Crop Disease Detection",
        heroSubtitle: "Protect your crops with AI",
        heroDescription:
            "Upload a clear image of a crop leaf and our CNN-based AI system will identify possible diseases and provide useful treatment and prevention guidance.",

        startDoctor: "Check Your Crop",
        viewHistory: "View History",

        statDiseases: "Disease Types",
        statModel: "AI Model",
        statAvailable: "Available",

        aiReady: "AI Crop Doctor",
        aiReadyText:
            "Your intelligent crop health assistant is ready to help.",

        checkCrop: "CHECK YOUR CROP",
        doctorTitle: "AI Crop Disease Detection",
        doctorDescription:
            "Upload a clear image of a crop leaf for AI-powered analysis.",

        uploadTitle: "Upload Crop Leaf Image",
        uploadDescription:
            "Use a clear image of the leaf for better prediction accuracy.",

        browseImage: "Browse Image",
        selectedImage: "Selected Image",
        ready: "Ready",
        remove: "Remove",
        analyzeLeaf: "Analyze Leaf",
        analyzing: "Analyzing...",
        analyzingText: "AI is checking your crop image",

        errorTitle: "Something went wrong",

        aiResult: "AI RESULT",
        healthAnalysis: "Crop Health Analysis",

        detectedCrop: "Detected Crop",
        detectedDisease: "Detected Disease",
        confidence: "Confidence",
        severity: "Severity",

        whatToDo: "What You Should Do",

        symptoms: "Symptoms",
        treatment: "Treatment",
        organic: "Organic Solution",
        nutrition: "Nutrition & Fertilizer",
        prevention: "Prevention",
        warning: "Important Warning",

        lowConfidenceTitle: "Low Confidence Result",
        lowConfidenceText:
            "The AI confidence is low. Please upload a clearer leaf image and try again.",

        newPrediction: "New Prediction",
        downloadPdf: "Download PDF",
        history: "History",

        featuresLabel: "FEATURES",
        featuresTitle: "Everything You Need for Crop Health",
        featuresDescription:
            "AI-powered tools designed to help farmers make better crop health decisions.",

        featureCNN: "CNN Disease Detection",
        featureCNNText:
            "Deep learning based image classification for crop disease detection.",

        featureAnalytics: "Disease Analytics",
        featureAnalyticsText:
            "Track your previous predictions and understand crop health trends.",

        featureOrganic: "Organic Solutions",
        featureOrganicText:
            "Get practical natural and organic management suggestions.",

        featureNutrition: "Nutrition Guidance",
        featureNutritionText:
            "Understand basic nutrient and fertilizer management guidance.",

        featureWeather: "Weather Advice",
        featureWeatherText:
            "Use your location to connect crop decisions with weather information.",

        featureVoice: "Voice Output",
        featureVoiceText:
            "Listen to crop guidance in English or Tamil.",

        featurePDF: "PDF Health Report",
        featurePDFText:
            "Generate and save a crop health report as a PDF.",

        featureSupport: "Farmer Support",
        featureSupportText:
            "Find useful agricultural support resources near you.",

        howLabel: "HOW IT WORKS",
        howTitle: "Simple 4-Step Process",
        howDescription:
            "Get crop health information in just a few simple steps.",

        stepOneTitle: "Upload Image",
        stepOneText:
            "Choose a clear image of the crop leaf.",

        stepTwoTitle: "AI Analysis",
        stepTwoText:
            "The CNN model analyzes the leaf image.",

        stepThreeTitle: "Get Result",
        stepThreeText:
            "View disease, confidence and severity.",

        stepFourTitle: "Follow Guidance",
        stepFourText:
            "Use treatment, organic, nutrition and prevention guidance.",

        supportedTitle: "Supported Crops",
        supportedDescription:
            "The current CNN model supports 13 PlantVillage disease classes.",
        startNow: "Start Detection",

        assistantLabel: "FARMER GUIDANCE",
        assistantTitle: "Your Digital Farming Assistant",
        assistantDescription:
            "Get crop guidance, weather information, agricultural support and prediction analytics.",

        chatbotTitle: "AI Farmer Chatbot",
        chatbotText:
            "Ask questions about crops, diseases, treatment and farming.",
        openChat: "Open Chat",

        weatherTitle: "Weather-Based Advice",
        weatherText:
            "Use your location to connect weather information with crop care.",
        checkWeather: "Check Weather",

        supportTitle: "Agriculture Support",
        supportText:
            "Find agricultural offices and support services using map search.",
        findSupport: "Find Support",

        analyticsTitle: "Disease Analytics",
        analyticsText:
            "View your prediction history and crop health statistics.",
        viewAnalytics: "View Analytics",

        ctaTitle: "Protect Your Crops with AI",
        ctaText:
            "Upload a leaf image and get intelligent crop health guidance.",
        ctaButton: "Check Your Crop",

        predictionHistory: "Prediction History",
        noHistory: "No Predictions Yet",
        noHistoryText:
            "Your crop prediction history will appear here.",
        clearHistory: "Clear History",

        farmerBot: "AI Farmer Assistant",
        online: "Online",
        chatWelcome:
            "Hello! 👋 I am your AI Farmer Assistant. Ask me about crop diseases, treatment, organic solutions, nutrition or prevention.",
        chatPlaceholder: "Ask your farming question...",

        weatherAdvice: "Weather Advice",
        weatherComing: "Location-Based Weather",
        weatherComingText:
            "Allow location access to identify your area. Live weather data requires a weather API connection.",
        useLocation: "Use My Location",

        agriSupport: "Agriculture Support",
        farmerServices: "Farmer Services",
        farmerServicesText:
            "Use map search to find nearby agriculture offices, agricultural universities and farmer support services.",
        agriOffice: "Agriculture Office",
        agriOfficeText:
            "Find government agriculture offices near your location.",
        nearbySupport: "Nearby Support",
        nearbySupportText:
            "Search nearby agricultural services and assistance.",

        analyticsDashboard: "Disease Analytics Dashboard",
        totalPredictions: "Total Predictions",
        healthyResults: "Healthy Results",
        diseaseResults: "Disease Results",
        averageConfidence: "Average Confidence",
        diseaseDistribution: "Disease Distribution",
        chartEmpty: "Make some predictions to see analytics.",

        farmerLogin: "Farmer Login",
        loginDescription:
            "Enter your name and phone number for this demo farmer profile.",
        farmerName: "Farmer Name",
        phoneNumber: "Phone Number",
        loginNow: "Login",

        footerSubtitle: "AI Crop Doctor",
        footerDescription:
            "CNN-based crop disease prediction and farmer guidance system.",
        quickLinks: "Quick Links",
        support: "Support",
        allRights: "© 2026 AI Crop Doctor. All rights reserved.",
        footerTagline: "Smart farming with Artificial Intelligence."
    },


    ta: {

        logoSubtitle: "AI பயிர் மருத்துவர்",

        navHome: "முகப்பு",
        navDoctor: "AI மருத்துவர்",
        navFeatures: "சிறப்பம்சங்கள்",
        navHow: "எவ்வாறு செயல்படுகிறது",
        navAssistant: "விவசாயி வழிகாட்டி",
        login: "விவசாயி உள்நுழைவு",

        aiPowered: "AI தொழில்நுட்பம்",
        heroTitle: "பயிர் நோய்களை புத்திசாலித்தனமாக கண்டறிதல்",
        heroSubtitle: "AI மூலம் உங்கள் பயிர்களை பாதுகாக்கவும்",
        heroDescription:
            "பயிரின் இலை படத்தை பதிவேற்றுங்கள். CNN அடிப்படையிலான AI அமைப்பு நோயை கண்டறிந்து சிகிச்சை மற்றும் தடுப்பு வழிகாட்டுதலை வழங்கும்.",

        startDoctor: "பயிரை சரிபார்க்கவும்",
        viewHistory: "வரலாற்றைப் பார்க்கவும்",

        statDiseases: "நோய் வகைகள்",
        statModel: "AI மாதிரி",
        statAvailable: "கிடைக்கும்",

        aiReady: "AI பயிர் மருத்துவர்",
        aiReadyText:
            "உங்கள் பயிர் ஆரோக்கிய உதவியாளர் உதவ தயாராக உள்ளது.",

        checkCrop: "உங்கள் பயிரை சரிபார்க்கவும்",
        doctorTitle: "AI பயிர் நோய் கண்டறிதல்",
        doctorDescription:
            "AI மூலம் பயிர் நோயை கண்டறிய தெளிவான இலை படத்தை பதிவேற்றுங்கள்.",

        uploadTitle: "பயிர் இலை படத்தை பதிவேற்றவும்",
        uploadDescription:
            "சிறந்த கணிப்பு முடிவிற்காக தெளிவான இலை படத்தை பயன்படுத்தவும்.",

        browseImage: "படத்தை தேர்வு செய்யவும்",
        selectedImage: "தேர்ந்தெடுக்கப்பட்ட படம்",
        ready: "தயார்",
        remove: "நீக்கவும்",
        analyzeLeaf: "இலையை ஆய்வு செய்யவும்",
        analyzing: "ஆய்வு செய்கிறது...",
        analyzingText: "AI உங்கள் பயிர் படத்தை ஆய்வு செய்கிறது",

        errorTitle: "சிக்கல் ஏற்பட்டுள்ளது",

        aiResult: "AI முடிவு",
        healthAnalysis: "பயிர் ஆரோக்கிய ஆய்வு",

        detectedCrop: "கண்டறியப்பட்ட பயிர்",
        detectedDisease: "கண்டறியப்பட்ட நோய்",
        confidence: "நம்பகத்தன்மை",
        severity: "தீவிரம்",

        whatToDo: "நீங்கள் செய்ய வேண்டியது",

        symptoms: "அறிகுறிகள்",
        treatment: "சிகிச்சை",
        organic: "இயற்கை தீர்வு",
        nutrition: "ஊட்டச்சத்து மற்றும் உரம்",
        prevention: "தடுப்பு முறைகள்",
        warning: "முக்கிய எச்சரிக்கை",

        lowConfidenceTitle: "குறைந்த நம்பகத்தன்மை முடிவு",
        lowConfidenceText:
            "AI நம்பகத்தன்மை குறைவாக உள்ளது. தெளிவான இலை படத்தை பதிவேற்றி மீண்டும் முயற்சிக்கவும்.",

        newPrediction: "புதிய கணிப்பு",
        downloadPdf: "PDF பதிவிறக்கம்",
        history: "வரலாறு",

        featuresLabel: "சிறப்பம்சங்கள்",
        featuresTitle: "பயிர் ஆரோக்கியத்திற்கு தேவையான அனைத்தும்",
        featuresDescription:
            "விவசாயிகளுக்கு பயிர் ஆரோக்கிய முடிவுகளை எடுக்க உதவும் AI கருவிகள்.",

        featureCNN: "CNN நோய் கண்டறிதல்",
        featureCNNText:
            "ஆழமான கற்றல் அடிப்படையிலான பட வகைப்படுத்தல் மூலம் பயிர் நோய்களை கண்டறிதல்.",

        featureAnalytics: "நோய் பகுப்பாய்வு",
        featureAnalyticsText:
            "முந்தைய கணிப்புகளை கண்காணித்து பயிர் ஆரோக்கிய நிலையை அறியலாம்.",

        featureOrganic: "இயற்கை தீர்வுகள்",
        featureOrganicText:
            "இயற்கை மற்றும் ஆர்கானிக் முறைகள் பற்றிய பயனுள்ள வழிகாட்டுதல்கள்.",

        featureNutrition: "ஊட்டச்சத்து வழிகாட்டுதல்",
        featureNutritionText:
            "அடிப்படை ஊட்டச்சத்து மற்றும் உர மேலாண்மை பற்றிய வழிகாட்டுதல்.",

        featureWeather: "வானிலை வழிகாட்டுதல்",
        featureWeatherText:
            "வானிலை தகவலுடன் பயிர் பராமரிப்பு முடிவுகளை இணைக்க உதவும்.",

        featureVoice: "குரல் வெளியீடு",
        featureVoiceText:
            "தமிழ் அல்லது ஆங்கிலத்தில் பயிர் வழிகாட்டுதலை கேட்கலாம்.",

        featurePDF: "PDF ஆரோக்கிய அறிக்கை",
        featurePDFText:
            "பயிர் ஆரோக்கிய அறிக்கையை PDF வடிவில் உருவாக்கலாம்.",

        featureSupport: "விவசாயி ஆதரவு",
        featureSupportText:
            "அருகிலுள்ள விவசாய ஆதரவு சேவைகளை தேடலாம்.",

        howLabel: "எவ்வாறு செயல்படுகிறது",
        howTitle: "எளிய 4 படிகள்",
        howDescription:
            "சில எளிய படிகளில் உங்கள் பயிர் ஆரோக்கிய தகவலை பெறலாம்.",

        stepOneTitle: "படத்தை பதிவேற்றவும்",
        stepOneText:
            "பயிர் இலையின் தெளிவான படத்தை தேர்வு செய்யவும்.",

        stepTwoTitle: "AI ஆய்வு",
        stepTwoText:
            "CNN மாதிரி இலை படத்தை ஆய்வு செய்யும்.",

        stepThreeTitle: "முடிவைப் பெறவும்",
        stepThreeText:
            "நோய், நம்பகத்தன்மை மற்றும் தீவிரத்தை பார்க்கலாம்.",

        stepFourTitle: "வழிகாட்டுதலை பின்பற்றவும்",
        stepFourText:
            "சிகிச்சை, இயற்கை தீர்வு, ஊட்டச்சத்து மற்றும் தடுப்பு வழிகாட்டுதலை பயன்படுத்தவும்.",

        supportedTitle: "ஆதரிக்கப்படும் பயிர்கள்",
        supportedDescription:
            "தற்போதைய CNN மாதிரி PlantVillage-ன் 13 நோய் வகுப்புகளை ஆதரிக்கிறது.",
        startNow: "கண்டறிதலை தொடங்கவும்",

        assistantLabel: "விவசாயி வழிகாட்டி",
        assistantTitle: "உங்கள் டிஜிட்டல் விவசாய உதவியாளர்",
        assistantDescription:
            "பயிர் வழிகாட்டுதல், வானிலை தகவல், விவசாய ஆதரவு மற்றும் கணிப்பு பகுப்பாய்வை பெறுங்கள்.",

        chatbotTitle: "AI விவசாயி Chatbot",
        chatbotText:
            "பயிர்கள், நோய்கள், சிகிச்சை மற்றும் விவசாயம் குறித்து கேள்விகளை கேட்கலாம்.",
        openChat: "Chat திறக்கவும்",

        weatherTitle: "வானிலை அடிப்படையிலான வழிகாட்டுதல்",
        weatherText:
            "உங்கள் இருப்பிடத்தின் அடிப்படையில் வானிலை தகவலை பயன்படுத்தலாம்.",
        checkWeather: "வானிலையை சரிபார்க்கவும்",

        supportTitle: "விவசாய ஆதரவு",
        supportText:
            "வரைபட தேடல் மூலம் விவசாய அலுவலகங்கள் மற்றும் ஆதரவு சேவைகளை கண்டறியலாம்.",
        findSupport: "ஆதரவை தேடவும்",

        analyticsTitle: "நோய் பகுப்பாய்வு",
        analyticsText:
            "உங்கள் கணிப்பு வரலாறு மற்றும் பயிர் ஆரோக்கிய புள்ளிவிவரங்களை பார்க்கலாம்.",
        viewAnalytics: "பகுப்பாய்வைப் பார்க்கவும்",

        ctaTitle: "AI மூலம் உங்கள் பயிர்களை பாதுகாக்கவும்",
        ctaText:
            "இலை படத்தை பதிவேற்றி புத்திசாலித்தனமான பயிர் ஆரோக்கிய வழிகாட்டுதலை பெறுங்கள்.",
        ctaButton: "உங்கள் பயிரை சரிபார்க்கவும்",

        predictionHistory: "கணிப்பு வரலாறு",
        noHistory: "கணிப்புகள் எதுவும் இல்லை",
        noHistoryText:
            "உங்கள் பயிர் கணிப்பு வரலாறு இங்கே தோன்றும்.",
        clearHistory: "வரலாற்றை அழிக்கவும்",

        farmerBot: "AI விவசாயி உதவியாளர்",
        online: "ஆன்லைன்",
        chatWelcome:
            "வணக்கம்! 👋 நான் உங்கள் AI விவசாயி உதவியாளர். பயிர் நோய், சிகிச்சை, இயற்கை தீர்வு, ஊட்டச்சத்து அல்லது தடுப்பு குறித்து கேளுங்கள்.",
        chatPlaceholder: "உங்கள் விவசாய கேள்வியை கேளுங்கள்...",

        weatherAdvice: "வானிலை வழிகாட்டுதல்",
        weatherComing: "இருப்பிட அடிப்படையிலான வானிலை",
        weatherComingText:
            "உங்கள் பகுதியை கண்டறிய இருப்பிட அனுமதியை வழங்கவும். நேரடி வானிலை தகவலுக்கு Weather API இணைப்பு தேவை.",
        useLocation: "என் இருப்பிடத்தை பயன்படுத்தவும்",

        agriSupport: "விவசாய ஆதரவு",
        farmerServices: "விவசாயி சேவைகள்",
        farmerServicesText:
            "அருகிலுள்ள விவசாய அலுவலகங்கள், வேளாண்மை பல்கலைக்கழகங்கள் மற்றும் விவசாயி ஆதரவு சேவைகளை வரைபடத்தில் தேடலாம்.",
        agriOffice: "விவசாய அலுவலகம்",
        agriOfficeText:
            "உங்கள் அருகிலுள்ள அரசு விவசாய அலுவலகங்களை தேடலாம்.",
        nearbySupport: "அருகிலுள்ள ஆதரவு",
        nearbySupportText:
            "அருகிலுள்ள விவசாய சேவைகள் மற்றும் உதவிகளை தேடலாம்.",

        analyticsDashboard: "நோய் பகுப்பாய்வு Dashboard",
        totalPredictions: "மொத்த கணிப்புகள்",
        healthyResults: "ஆரோக்கிய முடிவுகள்",
        diseaseResults: "நோய் முடிவுகள்",
        averageConfidence: "சராசரி நம்பகத்தன்மை",
        diseaseDistribution: "நோய் விநியோகம்",
        chartEmpty: "பகுப்பாய்வை பார்க்க சில கணிப்புகளை செய்யவும்.",

        farmerLogin: "விவசாயி உள்நுழைவு",
        loginDescription:
            "இந்த Demo விவசாயி சுயவிவரத்திற்காக உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.",
        farmerName: "விவசாயி பெயர்",
        phoneNumber: "தொலைபேசி எண்",
        loginNow: "உள்நுழையவும்",

        footerSubtitle: "AI பயிர் மருத்துவர்",
        footerDescription:
            "CNN அடிப்படையிலான பயிர் நோய் கணிப்பு மற்றும் விவசாயி வழிகாட்டுதல் அமைப்பு.",
        quickLinks: "விரைவு இணைப்புகள்",
        support: "ஆதரவு",
        allRights: "© 2026 AI Crop Doctor. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
        footerTagline: "செயற்கை நுண்ணறிவுடன் புத்திசாலித்தனமான விவசாயம்."
    }
};


/* =========================================================
   LANGUAGE FUNCTIONS
   ========================================================= */

function updateLanguage() {

    const lang = translations[currentLanguage];

    $$("[data-i18n]").forEach(element => {

        const key = element.getAttribute("data-i18n");

        if (lang[key] !== undefined) {
            element.textContent = lang[key];
        }
    });


    $$("[data-i18n-placeholder]").forEach(element => {

        const key = element.getAttribute("data-i18n-placeholder");

        if (lang[key] !== undefined) {
            element.placeholder = lang[key];
        }
    });


    if (englishBtn) {
        englishBtn.classList.toggle(
            "active",
            currentLanguage === "en"
        );
    }


    if (tamilBtn) {
        tamilBtn.classList.toggle(
            "active",
            currentLanguage === "ta"
        );
    }


    localStorage.setItem(
        LANGUAGE_KEY,
        currentLanguage
    );


    if (currentResult) {
        displayResult(
            currentResult,
            false
        );
    }


    renderHistory();

    updateLoginButton();
}


/* =========================================================
   LANGUAGE BUTTONS
   ========================================================= */

if (englishBtn) {

    englishBtn.addEventListener(
        "click",
        () => {

            currentLanguage = "en";

            updateLanguage();

        }
    );
}


if (tamilBtn) {

    tamilBtn.addEventListener(
        "click",
        () => {

            currentLanguage = "ta";

            updateLanguage();

        }
    );
}


/* =========================================================
   BACKEND LOCALIZED CONTENT
   ========================================================= */

function getLocalizedContent(data, field) {

    if (!data) {
        return "-";
    }


    const languageKey =
        currentLanguage === "ta"
            ? `${field}_ta`
            : `${field}_en`;


    const fallbackKey =
        `${field}_en`;


    return (
        data[languageKey] ||
        data[fallbackKey] ||
        data[field] ||
        "-"
    );
}


/* =========================================================
   FILE VALIDATION
   ========================================================= */

function validateImage(file) {

    if (!file) {

        showError(
            currentLanguage === "ta"
                ? "படத்தை தேர்வு செய்யவும்."
                : "Please select an image."
        );

        return false;
    }


    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];


    if (!allowedTypes.includes(file.type)) {

        showError(
            currentLanguage === "ta"
                ? "JPG, JPEG அல்லது PNG படங்களை மட்டும் பதிவேற்றவும்."
                : "Please upload JPG, JPEG or PNG images only."
        );

        return false;
    }


    if (file.size > 10 * 1024 * 1024) {

        showError(
            currentLanguage === "ta"
                ? "படத்தின் அளவு 10 MB-க்கு குறைவாக இருக்க வேண்டும்."
                : "Image size must be less than 10 MB."
        );

        return false;
    }


    return true;
}


/* =========================================================
   IMAGE DIMENSIONS
   ========================================================= */

function checkImageDimensions(file) {

    return new Promise(resolve => {

        const img = new Image();

        const url =
            URL.createObjectURL(file);


        img.onload = () => {

            URL.revokeObjectURL(url);


            if (
                img.width < 224 ||
                img.height < 224
            ) {

                showError(
                    currentLanguage === "ta"
                        ? "தெளிவான பெரிய படத்தை பதிவேற்றவும். குறைந்தபட்சம் 224 × 224 pixels பரிந்துரைக்கப்படுகிறது."
                        : "Please upload a clearer image. A minimum of 224 × 224 pixels is recommended."
                );

                resolve(false);

            } else {

                resolve(true);

            }
        };


        img.onerror = () => {

            URL.revokeObjectURL(url);


            showError(
                currentLanguage === "ta"
                    ? "படத்தை படிக்க முடியவில்லை."
                    : "Unable to read the image."
            );

            resolve(false);

        };


        img.src = url;

    });
}


/* =========================================================
   IMAGE INPUT
   ========================================================= */

if (browseBtn && imageInput) {

    browseBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            imageInput.click();

        }
    );
}


if (uploadBox && imageInput) {

    uploadBox.addEventListener(
        "click",
        event => {

            if (
                event.target !== browseBtn &&
                !event.target.closest("#browseBtn")
            ) {

                imageInput.click();

            }

        }
    );
}


if (imageInput) {

    imageInput.addEventListener(
        "change",
        async event => {

            const file =
                event.target.files[0];


            if (!validateImage(file)) {

                imageInput.value = "";

                return;
            }


            const validDimensions =
                await checkImageDimensions(file);


            if (!validDimensions) {

                imageInput.value = "";

                return;
            }


            selectedFile = file;

            showImagePreview(file);

        }
    );
}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function showImagePreview(file) {

    if (
        !previewSection ||
        !imagePreview
    ) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = event => {

        imagePreview.src =
            event.target.result;


        previewSection.classList.remove(
            "hidden"
        );


        if (predictBtn) {
            predictBtn.disabled = false;
        }


        hideError();


        scrollToElement(
            previewSection
        );

    };


    reader.readAsDataURL(file);
}


/* =========================================================
   REMOVE IMAGE
   ========================================================= */

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        () => {

            resetPrediction();

        }
    );
}


/* =========================================================
   DRAG & DROP
   ========================================================= */

if (uploadBox) {

    [
        "dragenter",
        "dragover"
    ].forEach(
        eventName => {

            uploadBox.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    uploadBox.classList.add(
                        "drag-over"
                    );

                }
            );

        }
    );


    [
        "dragleave",
        "drop"
    ].forEach(
        eventName => {

            uploadBox.addEventListener(
                eventName,
                event => {

                    event.preventDefault();

                    uploadBox.classList.remove(
                        "drag-over"
                    );

                }
            );

        }
    );


    uploadBox.addEventListener(
        "drop",
        async event => {

            const file =
                event.dataTransfer.files[0];


            if (!validateImage(file)) {
                return;
            }


            const validDimensions =
                await checkImageDimensions(file);


            if (!validDimensions) {
                return;
            }


            selectedFile = file;


            if (imageInput) {

                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(
                        file
                    );

                    imageInput.files =
                        dataTransfer.files;

                } catch (error) {

                    console.log(
                        "DataTransfer not supported"
                    );

                }
            }


            showImagePreview(file);

        }
    );
}


/* =========================================================
   PREDICT
   ========================================================= */

if (predictBtn) {

    predictBtn.addEventListener(
        "click",
        predictDisease
    );

}


async function predictDisease() {

    if (!selectedFile) {

        showError(
            currentLanguage === "ta"
                ? "முதலில் ஒரு இலை படத்தை தேர்வு செய்யவும்."
                : "Please select a leaf image first."
        );

        return;
    }


    setLoading(true);

    hideError();


    try {

        const formData =
            new FormData();


        formData.append(
            "file",
            selectedFile
        );


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        let data;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                currentLanguage === "ta"
                    ? "Backend சரியான பதிலை வழங்கவில்லை."
                    : "Backend did not return a valid response."
            );

        }


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                (
                    currentLanguage === "ta"
                        ? "கணிப்பு தோல்வியடைந்தது."
                        : "Prediction failed."
                )
            );

        }


        currentResult = data;


        displayResult(
            data,
            true
        );


        saveHistory(data);

    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        let message =
            error.message;


        if (
            error.name === "TypeError" &&
            error.message.includes("fetch")
        ) {

            message =
                currentLanguage === "ta"
                    ? "Backend server இயங்கவில்லை. Terminal-ல் python app.py இயக்கப்பட்டுள்ளதா என்பதை சரிபார்க்கவும்."
                    : "Backend server is not running. Please make sure python app.py is running.";

        }


        showError(message);

    } finally {

        setLoading(false);

    }
}


/* =========================================================
   LOADING
   ========================================================= */

function setLoading(isLoading) {

    if (loading) {

        loading.classList.toggle(
            "hidden",
            !isLoading
        );

    }


    if (predictBtn) {

        predictBtn.disabled =
            isLoading;


        const text =
            predictBtn.querySelector(
                "[data-i18n]"
            ) ||
            predictBtn.querySelector(
                "span"
            );


        if (isLoading) {

            if (text) {

                text.textContent =
                    translations[
                        currentLanguage
                    ].analyzing;

            }

        } else {

            if (text) {

                text.textContent =
                    translations[
                        currentLanguage
                    ].analyzeLeaf;

            }

        }

    }
}


/* =========================================================
   DISPLAY RESULT
   ========================================================= */

function displayResult(
    data,
    shouldScroll = true
) {

    if (!data) {
        return;
    }


    if (resultSection) {

        resultSection.classList.remove(
            "hidden"
        );

    }


    if (
        resultImage &&
        imagePreview
    ) {

        resultImage.src =
            imagePreview.src;

    }


    if (cropName) {

        cropName.textContent =
            data.crop || "-";

    }


    if (diseaseName) {

        diseaseName.textContent =
            data.disease ||
            data.predicted_class ||
            "-";

    }


    const confidenceValue =
        Number(data.confidence) || 0;


    const safeConfidence =
        Math.max(
            0,
            Math.min(
                100,
                confidenceValue
            )
        );


    if (confidence) {

        confidence.textContent =
            `${safeConfidence.toFixed(1)}%`;

    }


    if (confidenceBar) {

        confidenceBar.style.width =
            `${safeConfidence}%`;

    }


    const confidenceLevelValue =
        getConfidenceLevelText(
            safeConfidence,
            data.confidence_level
        );


    if (confidenceLevel) {

        confidenceLevel.textContent =
            confidenceLevelValue;

    }


    if (confidenceLevelText) {

        confidenceLevelText.textContent =
            confidenceLevelValue;

    }


    if (severity) {

        severity.textContent =
            getLocalizedContent(
                data,
                "severity"
            );

    }


    if (symptoms) {

        symptoms.textContent =
            getLocalizedContent(
                data,
                "symptoms"
            );

    }


    if (treatment) {

        treatment.textContent =
            getLocalizedContent(
                data,
                "treatment"
            );

    }


    if (organicSolution) {

        organicSolution.textContent =
            getLocalizedContent(
                data,
                "organic_solution"
            );

    }


    if (nutrition) {

        nutrition.textContent =
            getLocalizedContent(
                data,
                "nutrition"
            );

    }


    if (prevention) {

        prevention.textContent =
            getLocalizedContent(
                data,
                "prevention"
            );

    }


    if (warning) {

        warning.textContent =
            getLocalizedContent(
                data,
                "warning"
            );

    }


    if (lowConfidence) {

        lowConfidence.classList.toggle(
            "hidden",
            safeConfidence >= 60
        );

    }


    if (confidenceLevelCard) {

        confidenceLevelCard.classList.remove(
            "high",
            "medium",
            "low"
        );


        if (safeConfidence >= 80) {

            confidenceLevelCard.classList.add(
                "high"
            );

        } else if (safeConfidence >= 60) {

            confidenceLevelCard.classList.add(
                "medium"
            );

        } else {

            confidenceLevelCard.classList.add(
                "low"
            );

        }

    }


    if (shouldScroll) {

        setTimeout(
            () => {

                scrollToElement(
                    resultSection
                );

            },
            200
        );

    }
}


/* =========================================================
   CONFIDENCE TEXT
   ========================================================= */

function getConfidenceLevelText(
    value,
    backendLevel
) {

    if (currentLanguage === "ta") {

        if (value >= 80) {
            return "உயர் நம்பகத்தன்மை";
        }

        if (value >= 60) {
            return "மிதமான நம்பகத்தன்மை";
        }

        return "குறைந்த நம்பகத்தன்மை";
    }


    if (backendLevel) {
        return backendLevel;
    }


    if (value >= 80) {
        return "High Confidence";
    }


    if (value >= 60) {
        return "Medium Confidence";
    }


    return "Low Confidence";
}


/* =========================================================
   RESET
   ========================================================= */

function resetPrediction() {

    selectedFile = null;

    currentResult = null;


    if (imageInput) {
        imageInput.value = "";
    }


    if (imagePreview) {
        imagePreview.src = "";
    }


    if (previewSection) {

        previewSection.classList.add(
            "hidden"
        );

    }


    if (resultSection) {

        resultSection.classList.add(
            "hidden"
        );

    }


    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }


    if (predictBtn) {
        predictBtn.disabled = true;
    }


    hideError();


    scrollToElement(
        uploadBox
    );
}


if (newPredictionBtn) {

    newPredictionBtn.addEventListener(
        "click",
        resetPrediction
    );
}


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

    if (!errorBox) {

        alert(message);

        return;
    }


    if (errorMessage) {
        errorMessage.textContent = message;
    }


    errorBox.classList.remove(
        "hidden"
    );


    scrollToElement(
        errorBox
    );
}


function hideError() {

    if (errorBox) {

        errorBox.classList.add(
            "hidden"
        );

    }
}


if (errorCloseBtn) {

    errorCloseBtn.addEventListener(
        "click",
        hideError
    );
}


/* =========================================================
   HISTORY
   ========================================================= */

function getHistory() {

    try {

        const data =
            localStorage.getItem(
                HISTORY_KEY
            );


        if (!data) {
            return [];
        }


        const history =
            JSON.parse(data);


        return Array.isArray(history)
            ? history
            : [];

    } catch (error) {

        console.error(
            "History read error:",
            error
        );

        return [];

    }
}


/* =========================================================
   SAVE HISTORY
   ========================================================= */

function saveHistory(data) {

    try {

        const history =
            getHistory();


        let thumbnail = "";


        if (
            imagePreview &&
            imagePreview.src
        ) {

            thumbnail =
                createThumbnail(
                    imagePreview,
                    250
                );

        }


        const record = {

            id: Date.now(),

            date:
                new Date().toISOString(),

            crop:
                data.crop || "-",

            disease:
                data.disease ||
                data.predicted_class ||
                "-",

            predicted_class:
                data.predicted_class ||
                "",

            confidence:
                Number(data.confidence) ||
                0,

            confidence_level:
                data.confidence_level ||
                "",

            severity_en:
                data.severity_en ||
                "",

            severity_ta:
                data.severity_ta ||
                "",

            thumbnail

        };


        history.unshift(record);


        const limitedHistory =
            history.slice(0, 20);


        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(
                limitedHistory
            )
        );


        renderHistory();

        updateAnalytics();

    } catch (error) {

        console.error(
            "History save error:",
            error
        );

    }
}


/* =========================================================
   THUMBNAIL
   ========================================================= */

function createThumbnail(
    img,
    maxSize = 250
) {

    try {

        const canvas =
            document.createElement(
                "canvas"
            );


        const context =
            canvas.getContext("2d");


        const width =
            img.naturalWidth || 224;


        const height =
            img.naturalHeight || 224;


        const ratio =
            Math.min(
                maxSize / width,
                maxSize / height,
                1
            );


        canvas.width =
            Math.round(
                width * ratio
            );


        canvas.height =
            Math.round(
                height * ratio
            );


        context.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );


        return canvas.toDataURL(
            "image/jpeg",
            0.65
        );

    } catch (error) {

        return "";

    }
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   DATE FORMAT
   ========================================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    if (
        isNaN(
            date.getTime()
        )
    ) {
        return "-";
    }


    return date.toLocaleString(
        currentLanguage === "ta"
            ? "ta-IN"
            : "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =========================================================
   RENDER HISTORY
   ========================================================= */

function renderHistory() {

    if (!historyList) {
        return;
    }


    const history =
        getHistory();


    historyList.innerHTML = "";


    if (history.length === 0) {

        if (emptyHistory) {

            emptyHistory.classList.remove(
                "hidden"
            );

        }

        return;
    }


    if (emptyHistory) {

        emptyHistory.classList.add(
            "hidden"
        );

    }


    history.forEach(item => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "history-item";


        const confidenceValue =
            Number(item.confidence) ||
            0;


        const imageHTML =
            item.thumbnail
                ? `<img src="${item.thumbnail}" alt="Crop">`
                : `<div class="history-placeholder">🌿</div>`;


        const localizedSeverity =
            currentLanguage === "ta"
                ? item.severity_ta
                : item.severity_en;


        card.innerHTML = `

            <div class="history-image">
                ${imageHTML}
            </div>

            <div class="history-info">

                <h4>
                    ${escapeHTML(
                        item.crop
                    )}
                </h4>

                <p>
                    ${escapeHTML(
                        item.disease
                    )}
                </p>

                <div class="history-meta">

                    <span>
                        ${confidenceValue.toFixed(1)}%
                    </span>

                    <span>
                        ${escapeHTML(
                            localizedSeverity || ""
                        )}
                    </span>

                </div>

                <small>
                    ${formatDate(
                        item.date
                    )}
                </small>

            </div>

            <button
                class="history-view-btn"
                type="button"
                data-history-id="${item.id}"
            >
                ${
                    currentLanguage === "ta"
                        ? "பார்க்க"
                        : "View"
                }
            </button>
        `;


        historyList.appendChild(card);

    });


    historyList
        .querySelectorAll(
            "[data-history-id]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        historyModal
                    );

                    scrollToElement(
                        resultSection
                    );

                }
            );

        });
}


/* =========================================================
   HISTORY MODAL
   ========================================================= */

function openHistory() {

    renderHistory();

    openModal(
        historyModal
    );
}


if (viewHistoryBtn) {

    viewHistoryBtn.addEventListener(
        "click",
        openHistory
    );
}


if (resultHistoryBtn) {

    resultHistoryBtn.addEventListener(
        "click",
        openHistory
    );
}


if (heroHistoryBtn) {

    heroHistoryBtn.addEventListener(
        "click",
        openHistory
    );
}


const footerHistoryBtn =
    $("footerHistoryBtn");


if (footerHistoryBtn) {

    footerHistoryBtn.addEventListener(
        "click",
        openHistory
    );
}


if (closeHistoryBtn) {

    closeHistoryBtn.addEventListener(
        "click",
        () => {

            closeModal(
                historyModal
            );

        }
    );
}


/* =========================================================
   CLEAR HISTORY
   ========================================================= */

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(
        "click",
        () => {

            const confirmText =
                currentLanguage === "ta"
                    ? "அனைத்து கணிப்பு வரலாற்றையும் அழிக்க வேண்டுமா?"
                    : "Do you want to clear all prediction history?";


            if (!confirm(confirmText)) {
                return;
            }


            localStorage.removeItem(
                HISTORY_KEY
            );


            renderHistory();

            updateAnalytics();

        }
    );
}
/* =========================================================
   PDF
   ========================================================= */

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener("click", downloadPDF);
}

async function downloadPDF() {

    if (!resultSection || resultSection.classList.contains("hidden")) {
        showError(
            currentLanguage === "ta"
                ? "முதலில் ஒரு பயிர் படத்தை கணிக்கவும்."
                : "Please predict an image first."
        );
        return;
    }

    if (typeof html2pdf === "undefined") {
        showError(
            currentLanguage === "ta"
                ? "PDF library load ஆகவில்லை."
                : "PDF library is not loaded."
        );
        return;
    }

    const isTamil = currentLanguage === "ta";

    // Get prediction values
    const crop =
        document.getElementById("cropName")?.textContent?.trim() || "-";

    const disease =
        document.getElementById("diseaseName")?.textContent?.trim() || "-";

    const confidence =
        document.getElementById("confidence")?.textContent?.trim() || "-";

    const confidenceLevel =
        document.getElementById("confidenceLevel")?.textContent?.trim() || "-";

    const severity =
        document.getElementById("severity")?.textContent?.trim() || "-";

    const symptoms =
        document.getElementById("symptoms")?.textContent?.trim() || "-";

    const treatment =
        document.getElementById("treatment")?.textContent?.trim() || "-";

    const organicSolution =
        document.getElementById("organicSolution")?.textContent?.trim() || "-";

    const nutrition =
        document.getElementById("nutrition")?.textContent?.trim() || "-";

    const prevention =
        document.getElementById("prevention")?.textContent?.trim() || "-";

    const warning =
        document.getElementById("warning")?.textContent?.trim() || "-";


    // Create PDF content
    const report = document.createElement("div");

    report.innerHTML = `
        <div style="
            width: 720px;
            padding: 35px;
            box-sizing: border-box;
            background: white;
            color: #173b28;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                text-align: center;
                border-bottom: 3px solid #16834b;
                padding-bottom: 18px;
                margin-bottom: 25px;
            ">

                <h1 style="
                    margin: 0;
                    font-size: 30px;
                    color: #0b6b3a;
                ">
                    ${isTamil
                        ? "AI பயிர் ஆரோக்கிய அறிக்கை"
                        : "AI Crop Health Report"}
                </h1>

                <p style="
                    margin: 8px 0 0;
                    font-size: 14px;
                    color: #65786c;
                ">
                    ${isTamil
                        ? "AI பயிர் மருத்துவர் - கணிப்பு அறிக்கை"
                        : "AI Crop Doctor - Prediction Report"}
                </p>

            </div>


            <div style="
                background: #effbf3;
                border-left: 6px solid #16834b;
                padding: 20px;
                margin-bottom: 20px;
            ">

                <h2 style="
                    margin: 0 0 15px;
                    color: #16834b;
                    font-size: 21px;
                ">
                    ${isTamil
                        ? "கண்டறியப்பட்ட முடிவு"
                        : "Detection Result"}
                </h2>

                <p>
                    <strong>${isTamil ? "பயிர்" : "Crop"}:</strong>
                    ${crop}
                </p>

                <p>
                    <strong>${isTamil ? "நோய்" : "Disease"}:</strong>
                    ${disease}
                </p>

                <p>
                    <strong>
                        ${isTamil ? "நம்பகத்தன்மை" : "Confidence"}:
                    </strong>
                    ${confidence}
                </p>

                <p>
                    <strong>
                        ${isTamil ? "நிலை" : "Confidence Level"}:
                    </strong>
                    ${confidenceLevel}
                </p>

                <p>
                    <strong>
                        ${isTamil ? "தீவிரம்" : "Severity"}:
                    </strong>
                    ${severity}
                </p>

            </div>


            <div style="
                border: 1px solid #d9e9de;
                padding: 16px;
                margin-bottom: 15px;
            ">

                <h3 style="color:#16834b;margin-top:0;">
                    ${isTamil ? "அறிகுறிகள்" : "Symptoms"}
                </h3>

                <p style="line-height:1.6;">
                    ${symptoms}
                </p>

            </div>


            <div style="
                border: 1px solid #d9e9de;
                padding: 16px;
                margin-bottom: 15px;
            ">

                <h3 style="color:#16834b;margin-top:0;">
                    ${isTamil ? "சிகிச்சை" : "Treatment"}
                </h3>

                <p style="line-height:1.6;">
                    ${treatment}
                </p>

            </div>


            <div style="
                border: 1px solid #d9e9de;
                padding: 16px;
                margin-bottom: 15px;
            ">

                <h3 style="color:#16834b;margin-top:0;">
                    ${isTamil
                        ? "இயற்கை தீர்வு"
                        : "Organic Solution"}
                </h3>

                <p style="line-height:1.6;">
                    ${organicSolution}
                </p>

            </div>


            <div style="
                border: 1px solid #d9e9de;
                padding: 16px;
                margin-bottom: 15px;
            ">

                <h3 style="color:#16834b;margin-top:0;">
                    ${isTamil
                        ? "ஊட்டச்சத்து / உர வழிகாட்டுதல்"
                        : "Nutrition / Fertilizer Guidance"}
                </h3>

                <p style="line-height:1.6;">
                    ${nutrition}
                </p>

            </div>


            <div style="
                border: 1px solid #d9e9de;
                padding: 16px;
                margin-bottom: 15px;
            ">

                <h3 style="color:#16834b;margin-top:0;">
                    ${isTamil
                        ? "தடுப்பு முறைகள்"
                        : "Prevention"}
                </h3>

                <p style="line-height:1.6;">
                    ${prevention}
                </p>

            </div>


            <div style="
                border: 1px solid #f0d68b;
                background: #fff8df;
                padding: 16px;
                margin-bottom: 20px;
            ">

                <h3 style="
                    color:#9a6a00;
                    margin-top:0;
                ">
                    ${isTamil
                        ? "முக்கிய எச்சரிக்கை"
                        : "Important Warning"}
                </h3>

                <p style="line-height:1.6;">
                    ${warning}
                </p>

            </div>


            <div style="
                text-align:center;
                border-top:2px solid #d9e9de;
                padding-top:15px;
                margin-top:25px;
                font-size:12px;
                color:#718679;
            ">
                AI Crop Doctor · AI for Smarter Farming
            </div>

        </div>
    `;


    // Add report normally to page
    report.style.position = "absolute";
    report.style.left = "0";
    report.style.top = "0";
    report.style.background = "#ffffff";
    report.style.display = "block";
    report.style.visibility = "visible";
    report.style.opacity = "1";
    report.style.zIndex = "999999";

    document.body.appendChild(report);


    const filename = isTamil
        ? "AI-Payir-Aarokkiya-Arikkai.pdf"
        : "AI-Crop-Health-Report.pdf";


    try {

        console.log("=================================");
        console.log("PDF GENERATION STARTED");
        console.log("Crop:", crop);
        console.log("Disease:", disease);
        console.log("Confidence:", confidence);
        console.log("=================================");


        // Give browser time to render
        await new Promise(resolve => {
            setTimeout(resolve, 500);
        });


        const options = {

            margin: 10,

            filename: filename,

            image: {
                type: "jpeg",
                quality: 0.98
            },

            html2canvas: {

                scale: 2,

                useCORS: true,

                allowTaint: true,

                backgroundColor: "#ffffff",

                logging: true

            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation: "portrait"

            }

        };


        console.log("Converting HTML to PDF...");


        // IMPORTANT:
        // Do NOT use toContainer() or toCanvas() manually
        await html2pdf()
            .set(options)
            .from(report)
            .save();


        console.log("PDF DOWNLOAD COMPLETED");


    } catch (error) {

        console.error("PDF ERROR:", error);

        showError(
            isTamil
                ? "PDF உருவாக்க முடியவில்லை."
                : "Unable to generate PDF."
        );

    } finally {

        if (document.body.contains(report)) {
            document.body.removeChild(report);
        }

    }

}
/* =========================================================
   VOICE SYSTEM - EDGE TTS + BROWSER ENGLISH
   ========================================================= */

let currentAudio = null;
let currentAudioUrl = null;
let ttsRequestId = 0;


/* =========================================================
   STOP CURRENT VOICE
   ========================================================= */

function stopCurrentVoice() {

    /* Stop browser speech */
    if ("speechSynthesis" in window) {
        try {
            window.speechSynthesis.cancel();
        } catch (error) {
            console.log("Speech cancel error:", error);
        }
    }

    /* Stop Edge TTS audio */
    if (currentAudio) {

        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (error) {
            console.log("Audio stop error:", error);
        }

        currentAudio = null;
    }

    /* Release old blob URL */
    if (currentAudioUrl) {

        try {
            URL.revokeObjectURL(currentAudioUrl);
        } catch (error) {
            console.log("URL revoke error:", error);
        }

        currentAudioUrl = null;
    }

    ttsRequestId++;
}


/* =========================================================
   GET ENGLISH VOICE
   ========================================================= */

function getEnglishVoice() {

    if (!("speechSynthesis" in window)) {
        return null;
    }

    const voices =
        window.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) {
        return null;
    }

    /* First preference: Indian English */
    let voice =
        voices.find(
            v =>
                v.lang &&
                v.lang.toLowerCase() === "en-in"
        );

    /* Second preference: any English */
    if (!voice) {

        voice =
            voices.find(
                v =>
                    v.lang &&
                    v.lang
                        .toLowerCase()
                        .startsWith("en")
            );
    }

    return voice || null;
}


/* =========================================================
   LOAD ENGLISH VOICES
   ========================================================= */

function loadEnglishVoices() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.getVoices();
}


if ("speechSynthesis" in window) {

    loadEnglishVoices();

    window.speechSynthesis.addEventListener(
        "voiceschanged",
        loadEnglishVoices
    );
}


/* =========================================================
   ENGLISH SPEECH
   ========================================================= */

function speakEnglish(text) {

    if (
        !text ||
        text.trim() === "" ||
        text.trim() === "-"
    ) {
        return;
    }

    if (!("speechSynthesis" in window)) {

        showError(
            "Voice output is not supported in this browser."
        );

        return;
    }

    stopCurrentVoice();

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.lang = "en-IN";

    const englishVoice =
        getEnglishVoice();

    if (englishVoice) {

        speech.voice =
            englishVoice;

        console.log(
            "English voice selected:",
            englishVoice.name,
            englishVoice.lang
        );

    } else {

        console.log(
            "No specific English voice found. Browser default will be used."
        );

    }

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {

        console.log(
            "English voice started"
        );

    };

    speech.onend = () => {

        console.log(
            "English voice finished"
        );

    };

    speech.onerror = event => {

        console.error(
            "English speech error:",
            event
        );

        showError(
            "English voice could not be played."
        );

    };

    window.speechSynthesis.speak(
        speech
    );
}


/* =========================================================
   TAMIL EDGE TTS
   ========================================================= */

async function speakTamil(text) {

    if (
        !text ||
        text.trim() === "" ||
        text.trim() === "-"
    ) {
        return;
    }

    const requestId =
        ++ttsRequestId;

    stopBrowserSpeechOnly();

    try {

        console.log(
            "Sending Tamil text to Edge TTS..."
        );

        const response =
            await fetch(
                TTS_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        text: text,
                        language: "ta"
                    })
                }
            );


        if (!response.ok) {

            let errorMessage =
                "Tamil TTS request failed.";

            try {

                const errorData =
                    await response.json();

                if (errorData.error) {
                    errorMessage =
                        errorData.error;
                }

            } catch (error) {

                console.log(
                    "Could not read TTS error response."
                );

            }

            throw new Error(
                errorMessage
            );
        }


        const blob =
            await response.blob();


        if (!blob || blob.size === 0) {

            throw new Error(
                "Tamil audio file is empty."
            );
        }


        /*
           If another voice request happened
           while this request was running,
           ignore this old request.
        */

        if (requestId !== ttsRequestId) {

            console.log(
                "Old Tamil TTS request ignored."
            );

            return;
        }


        currentAudioUrl =
            URL.createObjectURL(
                blob
            );


        currentAudio =
            new Audio(
                currentAudioUrl
            );


        currentAudio.volume = 1;


        currentAudio.onplay = () => {

            console.log(
                "Tamil Edge TTS voice started"
            );

        };


        currentAudio.onended = () => {

            console.log(
                "Tamil Edge TTS voice finished"
            );

            if (currentAudioUrl) {

                URL.revokeObjectURL(
                    currentAudioUrl
                );

                currentAudioUrl = null;

            }

            currentAudio = null;

        };


        currentAudio.onerror =
            event => {

                console.error(
                    "Tamil audio playback error:",
                    event
                );

                if (currentAudioUrl) {

                    URL.revokeObjectURL(
                        currentAudioUrl
                    );

                    currentAudioUrl = null;

                }

                currentAudio = null;

                showError(
                    "Tamil voice audio could not be played."
                );

            };


        await currentAudio.play();

    } catch (error) {

        console.error(
            "Tamil TTS error:",
            error
        );


        if (
            error.name ===
            "NotAllowedError"
        ) {

            showError(
                currentLanguage === "ta"
                    ? "Voice play செய்ய browser permission தேவை. Tamil voice button-ஐ மீண்டும் click செய்யவும்."
                    : "Browser blocked audio playback. Please click the voice button again."
            );

            return;
        }


        if (
            error.name ===
            "TypeError"
        ) {

            showError(
                currentLanguage === "ta"
                    ? "Backend TTS connection கிடைக்கவில்லை. python app.py இயங்குகிறதா என்று பார்க்கவும்."
                    : "Could not connect to the TTS backend. Please make sure python app.py is running."
            );

            return;
        }


        showError(
            currentLanguage === "ta"
                ? "தமிழ் குரலை இயக்க முடியவில்லை."
                : "Tamil voice could not be played."
        );

    }

}


/* =========================================================
   STOP ONLY BROWSER SPEECH
   ========================================================= */

function stopBrowserSpeechOnly() {

    if (
        "speechSynthesis" in window
    ) {

        try {

            window.speechSynthesis.cancel();

        } catch (error) {

            console.log(
                "Browser speech cancel error:",
                error
            );

        }

    }
}


/* =========================================================
   MAIN VOICE FUNCTION
   ========================================================= */

function speakText(text) {

    if (
        !text ||
        text.trim() === "" ||
        text.trim() === "-"
    ) {
        return;
    }


    /*
       Tamil
       ↓
       Flask /tts
       ↓
       Edge TTS
       ↓
       MP3
       ↓
       Browser Audio
    */

    if (
        currentLanguage === "ta"
    ) {

        speakTamil(text);

        return;
    }


    /*
       English
       ↓
       Browser SpeechSynthesis
    */

    speakEnglish(text);
}


/* =========================================================
   VOICE BUTTONS
   ========================================================= */

$$("[data-voice-target]")
    .forEach(button => {

        button.addEventListener(
            "click",
            async event => {

                event.preventDefault();
                event.stopPropagation();


                const targetId =
                    button.getAttribute(
                        "data-voice-target"
                    );


                const target =
                    $(targetId);


                if (!target) {

                    console.error(
                        "Voice target not found:",
                        targetId
                    );

                    return;
                }


                const text =
                    target.textContent
                        .trim();


                if (!text) {
                    return;
                }


                console.log(
                    "Voice button clicked"
                );

                console.log(
                    "Language:",
                    currentLanguage
                );

                console.log(
                    "Text:",
                    text
                );


                speakText(text);

            }
        );

    });


/* =========================================================
   TEST TAMIL VOICE
   ========================================================= */

async function testTamilVoice() {

    currentLanguage = "ta";


    const text =
        "வணக்கம்! இது AI பயிர் மருத்துவரின் தமிழ் குரல் சோதனை.";


    console.log(
        "Testing Tamil Edge TTS..."
    );


    console.log(
        "TTS URL:",
        TTS_URL
    );


    await speakTamil(
        text
    );
}


/* =========================================================
   TEST ENGLISH VOICE
   ========================================================= */

function testEnglishVoice() {

    currentLanguage = "en";


    speakEnglish(
        "Hello! This is the AI Crop Doctor English voice test."
    );
}


/* =========================================================
   OPTIONAL GLOBAL TEST FUNCTIONS
   ========================================================= */

window.testTamilVoice =
    testTamilVoice;

window.testEnglishVoice =
    testEnglishVoice;

window.speakText =
    speakText;

window.speakTamil =
    speakTamil;

window.stopCurrentVoice =
    stopCurrentVoice;

/* =========================================================
   TEST TAMIL VOICE
   ========================================================= */

function testTamilVoice() {

    currentLanguage = "ta";

    const tamilVoice =
        getTamilVoice();


    console.log(
        "Available voices:",
        availableVoices
    );


    if (!tamilVoice) {

        showError(
            "தமிழ் குரல் இந்த கணினியில் கிடைக்கவில்லை. Windows Settings → Time & Language → Language & Region → Tamil → Language options → Speech பகுதியில் Tamil voice நிறுவவும்."
        );

        return;

    }


    speakText(
        "வணக்கம்! இது AI பயிர் மருத்துவரின் தமிழ் குரல் சோதனை."
    );
}


/* =========================================================
   SCROLL
   ========================================================= */

function scrollToElement(
    element
) {

    if (!element) {
        return;
    }


    element.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.add(
        "show"
    );


    modal.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "modal-open"
    );
}


function closeModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    modal.classList.add(
        "hidden"
    );


    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   MODAL BUTTONS
   ========================================================= */

if (closeChatBtn) {

    closeChatBtn.addEventListener(
        "click",
        () =>
            closeModal(
                chatModal
            )
    );
}


if (closeWeatherBtn) {

    closeWeatherBtn.addEventListener(
        "click",
        () =>
            closeModal(
                weatherModal
            )
    );
}


if (closeSupportBtn) {

    closeSupportBtn.addEventListener(
        "click",
        () =>
            closeModal(
                supportModal
            )
    );
}


if (closeAnalyticsBtn) {

    closeAnalyticsBtn.addEventListener(
        "click",
        () =>
            closeModal(
                analyticsModal
            )
    );
}


if (closeLoginBtn) {

    closeLoginBtn.addEventListener(
        "click",
        () =>
            closeModal(
                loginModal
            )
    );
}


/* =========================================================
   OUTSIDE MODAL CLICK
   ========================================================= */

[
    historyModal,
    chatModal,
    weatherModal,
    supportModal,
    analyticsModal,
    loginModal
].forEach(modal => {

    if (!modal) {
        return;
    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                closeModal(
                    modal
                );

            }

        }
    );

});


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        [
            historyModal,
            chatModal,
            weatherModal,
            supportModal,
            analyticsModal,
            loginModal
        ].forEach(
            closeModal
        );

    }
);


/* =========================================================
   MOBILE MENU
   ========================================================= */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            if (navbarMenu) {

                navbarMenu.classList.toggle(
                    "open"
                );

            }


            mobileMenuBtn.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

$$("a[href^='#']")
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth"
                });


                if (navbarMenu) {

                    navbarMenu.classList.remove(
                        "open"
                    );

                }

            }
        );

    });


/* =========================================================
   HERO / CTA
   ========================================================= */

function goToDoctor() {

    const doctor =
        $("doctor");


    if (doctor) {

        scrollToElement(
            doctor
        );

    }

}


if (startDoctorBtn) {

    startDoctorBtn.addEventListener(
        "click",
        goToDoctor
    );

}


if (supportedStartBtn) {

    supportedStartBtn.addEventListener(
        "click",
        goToDoctor
    );

}


if (ctaStartBtn) {

    ctaStartBtn.addEventListener(
        "click",
        goToDoctor
    );

}


/* =========================================================
   CHATBOT
   ========================================================= */

if (openChatBtn) {

    openChatBtn.addEventListener(
        "click",
        () => {

            openModal(
                chatModal
            );

            initializeChat();

        }
    );

}


function initializeChat() {

    if (!chatMessages) {
        return;
    }


    if (
        chatMessages.children.length >
        0
    ) {
        return;
    }


    addChatMessage(
        translations[
            currentLanguage
        ].chatWelcome,
        "bot"
    );
}


function addChatMessage(
    message,
    sender = "bot"
) {

    if (!chatMessages) {
        return;
    }


    const messageElement =
        document.createElement(
            "div"
        );


    messageElement.className =
        `chat-message ${sender}`;


    messageElement.textContent =
        message;


    chatMessages.appendChild(
        messageElement
    );


    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}


/* =========================================================
   CHATBOT RESPONSE
   ========================================================= */

function getChatbotResponse(
    question
) {

    const q =
        question
            .toLowerCase()
            .trim();


    const ta =
        currentLanguage === "ta";


    if (
        q.includes("tomato") ||
        q.includes("தக்காளி")
    ) {

        return ta
            ? "தக்காளி இலைகளில் மஞ்சள் புள்ளிகள், கரும்புள்ளிகள் அல்லது இலை சுருக்கம் இருந்தால் நோய் இருக்கலாம். தெளிவான இலை படத்தை AI Crop Doctor-ல் பதிவேற்றி பரிசோதிக்கவும்."
            : "If tomato leaves show yellow spots, dark lesions or curling, the plant may have a disease. Upload a clear leaf image to AI Crop Doctor for analysis.";

    }


    if (
        q.includes("potato") ||
        q.includes("உருளை")
    ) {

        return ta
            ? "உருளைக்கிழங்கு இலைகளில் பழுப்பு அல்லது கருப்பு புள்ளிகள் இருந்தால் Early Blight அல்லது Late Blight போன்ற பிரச்சனைகள் இருக்கலாம். தெளிவான படத்தை பதிவேற்றி பரிசோதிக்கவும்."
            : "Brown or dark lesions on potato leaves can be associated with diseases such as Early Blight or Late Blight. Upload a clear image for analysis.";

    }


    if (
        q.includes("pepper") ||
        q.includes("மிளகாய்")
    ) {

        return ta
            ? "மிளகாய் செடியில் இலை மஞ்சள் நிறமாக மாறுதல் அல்லது வளர்ச்சி குறைதல் இருந்தால் கவனமாக பரிசோதிக்கவும். தெளிவான இலை படத்தை பதிவேற்றுங்கள்."
            : "If pepper leaves become yellow or plant growth is reduced, inspect the crop carefully. Upload a clear leaf image for analysis.";

    }


    if (
        q.includes("fertilizer") ||
        q.includes("உரம்") ||
        q.includes("nutrition") ||
        q.includes("ஊட்டச்சத்து")
    ) {

        return ta
            ? "உரத்தை பயிரின் நிலை மற்றும் மண் பரிசோதனை அடிப்படையில் பயன்படுத்துவது சிறந்தது. அதிகமாக உரம் பயன்படுத்துவதை தவிர்த்து உள்ளூர் வேளாண்மை நிபுணர் பரிந்துரையை பின்பற்றவும்."
            : "Fertilizer should ideally be selected based on crop condition and soil testing. Avoid excessive fertilizer use and follow local agricultural recommendations.";

    }


    if (
        q.includes("organic") ||
        q.includes("இயற்கை") ||
        q.includes("ஆர்கானிக்")
    ) {

        return ta
            ? "பாதிக்கப்பட்ட இலைகளை அகற்றுதல், வயல் சுகாதாரத்தை பராமரித்தல் மற்றும் தேவையான இடங்களில் பயனுள்ள பூச்சிகளை பாதுகாத்தல் போன்ற ஒருங்கிணைந்த இயற்கை மேலாண்மை முறைகளை பயன்படுத்தலாம்."
            : "Integrated natural management can include removing severely infected leaves, maintaining field hygiene and encouraging beneficial insects where appropriate.";

    }


    if (
        q.includes("treatment") ||
        q.includes("சிகிச்சை") ||
        q.includes("medicine") ||
        q.includes("மருந்து")
    ) {

        return ta
            ? "சிகிச்சை நோயின் வகையைப் பொறுத்தது. முதலில் நோயை சரியாக கண்டறிவது முக்கியம். AI Crop Doctor மூலம் படத்தை பரிசோதித்து, தேவையானால் உள்ளூர் வேளாண்மை அதிகாரியின் ஆலோசனையை பெறவும்."
            : "Treatment depends on the disease. Correct identification should come first. Use AI Crop Doctor for image analysis and consult a local agricultural expert when needed.";

    }


    if (
        q.includes("disease") ||
        q.includes("நோய்")
    ) {

        return ta
            ? "பயிர் நோயை கண்டறிய தெளிவான இலை படத்தை AI Crop Doctor-ல் பதிவேற்றுங்கள். AI முடிவுடன் அறிகுறிகள், சிகிச்சை, இயற்கை தீர்வு மற்றும் தடுப்பு வழிகாட்டுதல் கிடைக்கும்."
            : "To identify a crop disease, upload a clear leaf image to AI Crop Doctor. You can receive the prediction along with symptoms, treatment, organic and prevention guidance.";

    }


    if (
        q.includes("weather") ||
        q.includes("வானிலை")
    ) {

        return ta
            ? "வானிலை அடிப்படையிலான வழிகாட்டுதலுக்கு Farmer Guidance பகுதியில் Weather Advice வசதியை பயன்படுத்தலாம்."
            : "Use the Weather Advice option in the Farmer Guidance section for location-based weather support.";

    }


    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("வணக்கம்")
    ) {

        return ta
            ? "வணக்கம்! 👋 உங்கள் பயிர் குறித்து என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?"
            : "Hello! 👋 What would you like to know about your crop?";

    }


    return ta
        ? "இந்த கேள்விக்கு குறிப்பிட்ட பதில் வழங்க என்னிடம் போதுமான தகவல் இல்லை. பயிர் நோய், அறிகுறிகள், சிகிச்சை, இயற்கை தீர்வு அல்லது உரம் பற்றி கேளுங்கள். தெளிவான இலை படத்தையும் பதிவேற்றலாம்."
        : "I don't have enough information to give a specific answer to that question. Ask me about crop diseases, symptoms, treatment, organic solutions or fertilizer guidance. You can also upload a clear leaf image.";

}


function sendChatMessage() {

    if (!chatInput) {
        return;
    }


    const question =
        chatInput.value.trim();


    if (!question) {
        return;
    }


    addChatMessage(
        question,
        "user"
    );


    chatInput.value = "";


    setTimeout(
        () => {

            const response =
                getChatbotResponse(
                    question
                );


            addChatMessage(
                response,
                "bot"
            );

        },
        400
    );
}


if (sendChatBtn) {

    sendChatBtn.addEventListener(
        "click",
        sendChatMessage
    );

}


if (chatInput) {

    chatInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                sendChatMessage();

            }

        }
    );

}


/* =========================================================
   WEATHER
   ========================================================= */

if (weatherBtn) {

    weatherBtn.addEventListener(
        "click",
        () => {

            openModal(
                weatherModal
            );

            showWeatherInitial();

        }
    );

}


function showWeatherInitial() {

    if (!weatherContent) {
        return;
    }


    weatherContent.innerHTML = `

        <div class="weather-info">

            <div class="weather-icon">
                🌤️
            </div>

            <h3>
                ${translations[
                    currentLanguage
                ].weatherComing}
            </h3>

            <p>
                ${translations[
                    currentLanguage
                ].weatherComingText}
            </p>

        </div>

    `;
}


if (getLocationWeatherBtn) {

    getLocationWeatherBtn.addEventListener(
        "click",
        getLocation
    );

}


function getLocation() {

    if (
        !navigator.geolocation
    ) {

        showWeatherMessage(
            currentLanguage === "ta"
                ? "இந்த browser-ல் location வசதி இல்லை."
                : "Geolocation is not supported by this browser."
        );

        return;
    }


    showWeatherMessage(
        currentLanguage === "ta"
            ? "உங்கள் இருப்பிடத்தை கண்டறிகிறது..."
            : "Detecting your location..."
    );


    navigator.geolocation.getCurrentPosition(

        position => {

            const latitude =
                position.coords.latitude;


            const longitude =
                position.coords.longitude;


            showWeatherMessage(

                currentLanguage === "ta"

                    ? `இருப்பிடம் கண்டறியப்பட்டது.<br><br>
                       Latitude: ${latitude.toFixed(4)}<br>
                       Longitude: ${longitude.toFixed(4)}<br><br>
                       நேரடி வானிலை தகவலுக்கு Weather API இணைக்க வேண்டும்.`

                    : `Location detected.<br><br>
                       Latitude: ${latitude.toFixed(4)}<br>
                       Longitude: ${longitude.toFixed(4)}<br><br>
                       A weather API connection is required for live weather data.`

            );

        },

        error => {

            console.error(
                "Location error:",
                error
            );


            showWeatherMessage(

                currentLanguage === "ta"

                    ? "Location permission வழங்கப்படவில்லை. Browser settings-ல் location permission-ஐ allow செய்யவும்."

                    : "Location permission was not granted. Please allow location access in your browser settings."

            );

        }

    );
}


function showWeatherMessage(
    message
) {

    if (!weatherContent) {
        return;
    }


    weatherContent.innerHTML = `

        <div class="weather-info">

            <div class="weather-icon">
                🌤️
            </div>

            <p>
                ${message}
            </p>

        </div>

    `;
}


/* =========================================================
   AGRICULTURE SUPPORT
   ========================================================= */

if (supportBtn) {

    supportBtn.addEventListener(
        "click",
        () => {

            openModal(
                supportModal
            );

        }
    );

}


const supportSearchBtn =
    $("nearbySupportBtn");


if (supportSearchBtn) {

    supportSearchBtn.addEventListener(
        "click",
        searchAgricultureSupport
    );

}


function searchAgricultureSupport() {

    const query =
        currentLanguage === "ta"
            ? "அருகிலுள்ள விவசாய அலுவலகம்"
            : "agriculture office near me";


    const url =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            query
        )}`;


    window.open(
        url,
        "_blank"
    );
}


/* =========================================================
   ANALYTICS
   ========================================================= */

if (analyticsBtn) {

    analyticsBtn.addEventListener(
        "click",
        () => {

            updateAnalytics();

            openModal(
                analyticsModal
            );

        }
    );

}


function updateAnalytics() {

    const history =
        getHistory();


    const total =
        history.length;


    let healthy = 0;

    let disease = 0;

    let confidenceTotal = 0;


    const distribution = {};


    history.forEach(item => {

        const diseaseNameValue =
            item.disease ||
            "Unknown";


        const confidenceValue =
            Number(item.confidence) ||
            0;


        confidenceTotal +=
            confidenceValue;


        if (
            diseaseNameValue
                .toLowerCase()
                .includes("healthy")
        ) {

            healthy++;

        } else {

            disease++;

        }


        distribution[
            diseaseNameValue
        ] =
            (
                distribution[
                    diseaseNameValue
                ] || 0
            ) + 1;

    });


    if (totalPredictions) {

        totalPredictions.textContent =
            total;

    }


    if (healthyPredictions) {

        healthyPredictions.textContent =
            healthy;

    }


    if (diseasePredictions) {

        diseasePredictions.textContent =
            disease;

    }


    if (averageConfidence) {

        const average =
            total > 0
                ? confidenceTotal / total
                : 0;


        averageConfidence.textContent =
            `${average.toFixed(1)}%`;

    }


    renderAnalyticsChart(
        distribution
    );
}


/* =========================================================
   ANALYTICS CHART
   ========================================================= */

function renderAnalyticsChart(
    distribution
) {

    if (!analyticsChart) {
        return;
    }


    analyticsChart.innerHTML =
        "";


    const entries =
        Object.entries(
            distribution
        );


    if (entries.length === 0) {

        analyticsChart.innerHTML = `

            <div class="chart-empty">

                ${
                    translations[
                        currentLanguage
                    ].chartEmpty
                }

            </div>

        `;

        return;
    }


    const maxValue =
        Math.max(
            ...entries.map(
                item => item[1]
            )
        );


    entries.forEach(
        ([name, count]) => {

            const percentage =
                maxValue > 0
                    ? (
                        count /
                        maxValue
                    ) * 100
                    : 0;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "chart-row";


            row.innerHTML = `

                <div class="chart-label">
                    ${escapeHTML(name)}
                </div>

                <div class="chart-track">

                    <div
                        class="chart-bar"
                        style="width:${percentage}%"
                    ></div>

                </div>

                <div class="chart-value">
                    ${count}
                </div>

            `;


            analyticsChart.appendChild(
                row
            );

        }
    );
}


/* =========================================================
   LOGIN
   ========================================================= */

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        () => {

            const saved =
                getLogin();


            if (saved) {

                const message =
                    currentLanguage === "ta"

                        ? `வணக்கம் ${saved.name}! நீங்கள் ஏற்கனவே login செய்துள்ளீர்கள்.`

                        : `Hello ${saved.name}! You are already logged in.`;


                alert(message);

            } else {

                openModal(
                    loginModal
                );

            }

        }
    );

}


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                loginName
                    ? loginName.value.trim()
                    : "";


            const phone =
                loginPhone
                    ? loginPhone.value.trim()
                    : "";


            if (!name) {

                alert(
                    currentLanguage === "ta"
                        ? "பெயரை உள்ளிடவும்."
                        : "Please enter your name."
                );

                return;
            }


            if (!phone) {

                alert(
                    currentLanguage === "ta"
                        ? "தொலைபேசி எண்ணை உள்ளிடவும்."
                        : "Please enter your phone number."
                );

                return;
            }


            const user = {
                name,
                phone
            };


            localStorage.setItem(
                LOGIN_KEY,
                JSON.stringify(user)
            );


            updateLoginButton();


            closeModal(
                loginModal
            );


            alert(

                currentLanguage === "ta"

                    ? `வணக்கம் ${name}! Login வெற்றிகரமாக முடிந்தது.`

                    : `Welcome ${name}! Login successful.`

            );

        }
    );

}


/* =========================================================
   GET LOGIN
   ========================================================= */

function getLogin() {

    try {

        const data =
            localStorage.getItem(
                LOGIN_KEY
            );


        return data
            ? JSON.parse(data)
            : null;

    } catch (error) {

        return null;

    }
}


/* =========================================================
   LOGIN BUTTON
   ========================================================= */

function updateLoginButton() {

    if (!loginBtn) {
        return;
    }

    const user =
        getLogin();

    if (user) {

        loginBtn.textContent =
            currentLanguage === "ta"
                ? `வணக்கம் ${user.name}`
                : `Hi ${user.name}`;

    } else {

        loginBtn.textContent =
            translations[
                currentLanguage
            ].login;

    }
}

/* =========================================================
   LOGOUT
   ========================================================= */

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        const user = getLogin();

        if (!user) {
            alert(
                currentLanguage === "ta"
                    ? "நீங்கள் login செய்யவில்லை."
                    : "You are not logged in."
            );
            return;
        }

        const confirmLogout = confirm(
            currentLanguage === "ta"
                ? "Logout செய்ய வேண்டுமா?"
                : "Do you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem(LOGIN_KEY);

        alert(
            currentLanguage === "ta"
                ? "Logout வெற்றிகரமாக முடிந்தது."
                : "Logout successful."
        );

        location.reload();
    });

}
/* =========================================================
   INTERSECTION OBSERVER
   ========================================================= */

function setupSectionObserver() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-menu a[href^='#']"
        );


    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        navLinks.forEach(
                            link => {

                                link.classList.remove(
                                    "active"
                                );


                                if (
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${entry.target.id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }
                );

            },

            {
                threshold: 0.35
            }

        );


    sections.forEach(
        section =>
            observer.observe(
                section
            )
    );
}


/* =========================================================
   KEYBOARD ACCESS
   ========================================================= */

if (uploadBox) {

    uploadBox.setAttribute(
        "tabindex",
        "0"
    );


    uploadBox.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter" ||
                event.key ===
                " "
            ) {

                event.preventDefault();


                if (imageInput) {

                    imageInput.click();

                }

            }

        }
    );

}


/* =========================================================
   FORM PREVENT DEFAULT
   ========================================================= */

$$("form").forEach(
    form => {

        form.addEventListener(
            "submit",
            event => {

                if (
                    form !== loginForm
                ) {

                    event.preventDefault();

                }

            }
        );

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadVoices();

        updateLanguage();

        renderHistory();

        updateAnalytics();

        updateLoginButton();

        setupSectionObserver();


        if (predictBtn) {

            predictBtn.disabled =
                !selectedFile;

        }

    }
);


/* =========================================================
   INITIALIZE IMMEDIATELY
   ========================================================= */

loadVoices();

updateLanguage();

renderHistory();

updateAnalytics();

updateLoginButton();

setupSectionObserver();