import { LanguageCode } from '../../types';
import { TranslationSchema, englishTranslations } from './translations';

export const languageDictionaries: Record<LanguageCode, Partial<TranslationSchema>> = {
  en: englishTranslations,
  
  te: {
    appName: "స్పెండ్‌వైజ్ AI",
    tagline: "మీ ఖర్చులను అర్థం చేసుకోండి. భవిష్యత్తును ప్లాన్ చేయండి.",
    auth: {
      welcomeBack: "స్వాగతం",
      signInSubtitle: "మీ ఆర్థిక ప్రణాళికను నిర్వహించడానికి లాగిన్ చేయండి",
      createAccount: "ఖాతాను సృష్టించండి",
      signUpSubtitle: "తెలివైన ఆర్థిక ప్రణాళిక కోసం SpendWise AIలో చేరండి",
      identifierLabel: "మొబైల్ నంబర్ లేదా యూజర్‌నేమ్",
      identifierPlaceholder: "+91 9876543210 లేదా @username",
      passwordLabel: "పాస్‌వర్డ్",
      passwordPlaceholder: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
      fullNameLabel: "పూర్తి పేరు",
      fullNamePlaceholder: "ఉదా. చైతన్య రెడ్డి",
      phoneLabel: "మొబైల్ నంబర్",
      phonePlaceholder: "+91 9876543210",
      usernameLabel: "ప్రత్యేక యూజర్‌నేమ్ (@handle)",
      usernamePlaceholder: "ఉదా. chithanya",
      forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
      signInButton: "లాగిన్ అవ్వండి",
      signUpButton: "ఖాతా సృష్టించండి",
      noAccount: "ఖాతా లేదా? ఇప్పుడే చేరండి",
      haveAccount: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి",
      quickDemoLogin: "డెమో లాగిన్ (@chithanya)",
      usernameAvailable: "యూజర్‌నేమ్ అందుబాటులో ఉంది",
      usernameTaken: "ఈ యూజర్‌నేమ్ ఇప్పటికే తీసుకోబడింది",
      checkingUsername: "తనిఖీ చేస్తోంది...",
      passwordStrength: { weak: "బలహీనం", fair: "మధ్యస్థం", strong: "బలమైనది" },
      resetPassword: "పాస్‌వర్డ్ రీసెట్",
      resetSubtitle: "రికవరీ లింక్ కోసం మీ యూజర్‌నేమ్ లేదా ఫోన్ నమోదు చేయండి",
      sendOtp: "రికవరీ లింక్ పంపండి",
      onboardingTitle: "మీ ప్రత్యేక యూజర్‌నేమ్ ఎంచుకోండి",
      onboardingSubtitle: "గ్రూప్ ఖర్చుల నిర్వహణ కోసం ప్రత్యేక @handle ను ఎంచుకోండి",
      claimHandle: "క్లెయిమ్ చేసి కొనసాగించండి",
      logout: "లాగ్ అవుట్"
    },
    nav: {
      dashboard: "డ్యాష్‌బోర్డ్ (Dashboard)",
      analytics: "విశ్లేషణలు (Analytics)",
      capture: "ఖర్చుల నమోదు (Add)",
      coach: "AI ఆర్థిక కోచ్ (AI Coach)",
      subscriptions: "సబ్‌స్క్రిప్షన్లు (Subscriptions)",
      shared: "గ్రూప్ ఖర్చులు (Group Ledger)",
      goals: "పొదుపు లక్ష్యాలు (Goals)",
      import: "CSV ఇంపోర్ట్ (Import)",
      settings: "సెట్టింగులు (Settings)"
    },
    metrics: {
      totalIncome: "నెలవారీ ఆదాయం",
      totalExpenses: "మొత్తం ఖర్చులు",
      currentBalance: "మిగిలిన మొత్తం",
      budgetUtilization: "బడ్జెట్ వినియోగం",
      dailyLimit: "రోజువారీ ఖర్చు పరిమితి",
      daysRemaining: "మిగిలిన రోజులు",
      upcomingObligations: "రాబోయే బిల్లులు & సబ్‌స్క్రిప్షన్లు",
      healthIndex: "ఆర్థిక ఆరోగ్య సూచిక",
      healthGrade: "స్కోర్: బాగుంది (78/100)",
      healthSummary: "మీ ఖర్చులు అవసరాలు (Needs 34%) మరియు కోరికల (Wants 66%) మధ్య ఉన్నాయి.",
      disclaimer: "కేవలం సమాచార విశ్లేషణ మాత్రమే; ఆర్థిక సలహా కాదు."
    },
    actions: {
      addExpense: "ఖర్చు జోడించండి",
      scanReceipt: "రశీదు / UPI స్కాన్",
      voiceInput: "వాయిస్ ఎంట్రీ",
      save: "సేవ్ చేయండి",
      cancel: "రద్దు చేయండి",
      filter: "ఫిల్టర్",
      export: "CSV ఎగుమతి",
      togglePhoneView: "మొబైల్ వ్యూ",
      toggleDesktopView: "డెస్క్‌టాప్ వ్యూ",
      settleUp: "లెక్క తేల్చండి"
    },
    theme: { light: "లైట్", dark: "డార్క్", system: "సిస్టమ్" }
  },

  hi: {
    appName: "स्पेंडवाइज AI",
    tagline: "अपने खर्चों को समझें। अपने भविष्य की योजना बनाएं।",
    auth: {
      welcomeBack: "वापसी पर स्वागत है",
      signInSubtitle: "अपने वित्त और AI अंतर्दृष्टि का प्रबंधन करने के लिए साइन इन करें",
      createAccount: "खाता बनाएं",
      signUpSubtitle: "स्मार्ट वित्तीय योजना के लिए SpendWise AI से जुड़ें",
      identifierLabel: "मोबाइल नंबर या उपयोगकर्ता नाम",
      identifierPlaceholder: "+91 9876543210 या @username",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
      fullNameLabel: "पूरा नाम",
      fullNamePlaceholder: "उदा. चैतन्य रेड्डी",
      phoneLabel: "मोबाइल नंबर",
      phonePlaceholder: "+91 9876543210",
      usernameLabel: "अनूठा यूज़रनेम (@handle)",
      usernamePlaceholder: "उदा. chithanya",
      forgotPassword: "पासवर्ड भूल गए?",
      signInButton: "साइन इन करें",
      signUpButton: "खाता बनाएं",
      noAccount: "खाता नहीं है? साइन अप करें",
      haveAccount: "पहले से खाता है? साइन इन करें",
      quickDemoLogin: "त्वरित डेमो लॉगिन (@chithanya)",
      usernameAvailable: "यूज़रनेम उपलब्ध है",
      usernameTaken: "यह यूज़रनेम पहले से लिया जा चुका है",
      checkingUsername: "जांच की जा रही है...",
      passwordStrength: { weak: "कमजोर", fair: "मध्यम", strong: "मजबूत" },
      resetPassword: "पासवर्ड रीसेट करें",
      resetSubtitle: "रिकवरी कोड प्राप्त करने के लिए अपना फोन या यूज़रनेम दर्ज करें",
      sendOtp: "रिकवरी लिंक भेजें",
      onboardingTitle: "अपना अनूठा यूज़रनेम चुनें",
      onboardingSubtitle: "अपने समूह लेज़र और प्रोफ़ाइल के लिए @handle सेट करें",
      claimHandle: "हैंडल लें और जारी रखें",
      logout: "साइन आउट"
    },
    nav: {
      dashboard: "डैशबोर्ड",
      analytics: "एनालिटिक्स और पूर्वानुमान",
      capture: "खर्च जोड़ें",
      coach: "AI वित्तीय कोच",
      subscriptions: "सब्सक्रिप्शन और बिल",
      shared: "ग्रुप लेज़र",
      goals: "बचत लक्ष्य",
      import: "CSV आयात",
      settings: "सेटिंग्स"
    },
    metrics: {
      totalIncome: "मासिक आय",
      totalExpenses: "कुल खर्च",
      currentBalance: "वर्तमान शेष",
      budgetUtilization: "बजट उपयोग",
      dailyLimit: "दैनिक खर्च सीमा",
      daysRemaining: "दिन शेष",
      upcomingObligations: "आगामी बिल और सब्सक्रिप्शन",
      healthIndex: "वित्तीय स्वास्थ्य सूचकांक",
      healthGrade: "स्कोर: अच्छा (78/100)",
      healthSummary: "आपका खर्च संतुलित है (34% जरूरतें और 66% इच्छाएं)।",
      disclaimer: "केवल सूचनात्मक विश्लेषण; पेशेवर सलाह नहीं।"
    },
    actions: {
      addExpense: "खर्च जोड़ें",
      scanReceipt: "रसीद / UPI स्कैन",
      voiceInput: "आवाज प्रविष्टि",
      save: "सहेजें",
      cancel: "रद्द करें",
      filter: "फ़िल्टर",
      export: "CSV निर्यात",
      togglePhoneView: "मोबाइल व्यू",
      toggleDesktopView: "डेस्कटॉप व्यू",
      settleUp: "हिसाब चुकता करें"
    },
    theme: { light: "लाइट", dark: "डार्क", system: "सिस्टम" }
  },

  ta: {
    appName: "ஸ்பெண்ட்வைஸ் AI",
    tagline: "உங்கள் செலவை புரிந்து கொள்ளுங்கள். எதிர்காலத்தை திட்டமிடுங்கள்.",
    nav: { dashboard: "டாஷ்போர்டு", analytics: "பகுப்பாய்வு", capture: "செலவு சேர்", coach: "AI நிதி பயிற்சியாளர்", subscriptions: "சந்தாக்கள்", shared: "குழு கணக்கு", goals: "சேமிப்பு இலக்குகள்", import: "CSV இறக்குமதி", settings: "அமைப்புகள்" },
    metrics: { totalIncome: "மாத வருமானம்", totalExpenses: "மொத்த செலவுகள்", currentBalance: "மீதமுள்ள இருப்பு", budgetUtilization: "பட்ஜெட் பயன்பாடு", dailyLimit: "தினசரி செலவு வரம்பு", daysRemaining: "நாட்கள் உள்ளன", upcomingObligations: "வரவிருக்கும் பில்கள்", healthIndex: "நிதி சுகாதார குறியீடு", healthGrade: "மதிப்பீடு: நன்று", healthSummary: "உங்கள் செலவு சமநிலையில் உள்ளது.", disclaimer: "தகவல் பகுப்பாய்வு மட்டுமே." },
    actions: { addExpense: "செலவு சேர்", scanReceipt: "ரசீது / UPI ஸ்கேன்", voiceInput: "குரல் பதிவு", save: "சேமி", cancel: "ரத்து செய்", filter: "வடிகட்டு", export: "ஏற்றுமதி", togglePhoneView: "மொபைல்", toggleDesktopView: "டெஸ்க்டாப்", settleUp: "கணக்கை முடி" },
    theme: { light: "லைட்", dark: "டார்க்", system: "சிஸ்டம்" }
  },

  kn: {
    appName: "ಸ್ಪೆಂಡ್‌ವೈಸ್ AI",
    tagline: "ನಿಮ್ಮ ಖರ್ಚುಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಭವಿಷ್ಯವನ್ನು ಯೋಜಿಸಿ.",
    nav: { dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", analytics: "ವಿಶ್ಲೇಷಣೆ", capture: "ಖರ್ಚು ಸೇರಿಸಿ", coach: "AI ಹಣಕಾಸು ಕೋಚ್", subscriptions: "ಚಂದಾದಾರಿಕೆಗಳು", shared: "ಗುಂಪು ಲೆಡ್ಜರ್", goals: "ಉಳಿತಾಯ ಗುರಿಗಳು", import: "CSV ಆಮದು", settings: "ಸೆಟ್ಟಿಂಗ್ಸ್" },
    metrics: { totalIncome: "ಮಾಸಿಕ ಆದಾಯ", totalExpenses: "ಒಟ್ಟು ಖರ್ಚು", currentBalance: "ಉಳಿದ ಮೊತ್ತ", budgetUtilization: "ಬಜೆಟ್ ಬಳಕೆ", dailyLimit: "ದೈನಂದಿನ ಖರ್ಚು ಮಿತಿ", daysRemaining: "ದಿನಗಳು ಬಾಕಿ", upcomingObligations: "ಮುಂಬರುವ ಬಿಲ್‌ಗಳು", healthIndex: "ಹಣಕಾಸು ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ", healthGrade: "ಸ್ಕೋರ್: ಉತ್ತಮ", healthSummary: "ನಿಮ್ಮ ಖರ್ಚುಗಳು ಸಮತೋಲನದಲ್ಲಿವೆ.", disclaimer: "ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣೆ ಮಾತ್ರ." },
    actions: { addExpense: "ಖರ್ಚು ಸೇರಿಸಿ", scanReceipt: "ರಶೀದಿ / UPI ಸ್ಕ್ಯಾನ್", voiceInput: "ಧ್ವನಿ ನಮೂದು", save: "ಉಳಿಸಿ", cancel: "ರದ್ದುಮಾಡಿ", filter: "ಫಿಲ್ಟರ್", export: "ರಫ್ತು ಮಾಡಿ", togglePhoneView: "ಮೊಬೈಲ್", toggleDesktopView: "ಡೆಸ್ಕ್‌ಟಾಪ್", settleUp: "ಲೆಕ್ಕ ಚುಕ್ತಾ" },
    theme: { light: "ಲೈಟ್", dark: "ಡಾರ್ಕ್", system: "ಸಿಸ್ಟಮ್" }
  },

  ml: {
    appName: "സ്പെൻഡ്‌വൈസ് AI",
    tagline: "നിങ്ങളുടെ ചെലവുകൾ മനസ്സിലാക്കൂ. ഭാവി ആസൂത്രണം ചെയ്യൂ.",
    nav: { dashboard: "ഡാഷ്‌ബോർഡ്", analytics: "വിശകലനം", capture: "ചെലവ് ചേർക്കുക", coach: "AI ധനകാര്യ കോച്ച്", subscriptions: "സബ്‌സ്‌ക്രിപ്ഷനുകൾ", shared: "ഗ്രൂപ്പ് ലെഡ്ജർ", goals: "സമ്പാദ്യ ലക്ഷ്യങ്ങൾ", import: "CSV ഇമ്പോർട്ട്", settings: "ക്രമീകരണങ്ങൾ" },
    metrics: { totalIncome: "പ്രതിമാസ വരുമാനം", totalExpenses: "ആകെ ചെലവുകൾ", currentBalance: "ബാക്കി തുക", budgetUtilization: "ബജറ്റ് വിനിയോഗം", dailyLimit: "ദിവസേനയുള്ള പരിധി", daysRemaining: "ദിവസങ്ങൾ ബാക്കി", upcomingObligations: "വരാനിരിക്കുന്ന ബില്ലുകൾ", healthIndex: "ധനകാര്യ ആരോഗ്യ സൂചിക", healthGrade: "നല്ലത് (78/100)", healthSummary: "ചെലവുകൾ സന്തുലിതമാണ്.", disclaimer: "വിവര വിശകലനം മാത്രം." },
    actions: { addExpense: "ചെലവ് ചേർക്കുക", scanReceipt: "റസീപ്റ്റ് / UPI സ്കാൻ", voiceInput: "വോയ്‌സ് എൻട്രി", save: "സേവ് ചെയ്യുക", cancel: "റദ്ദാക്കുക", filter: "ഫിൽട്ടർ", export: "എക്സ്പോർട്ട്", togglePhoneView: "മൊബൈൽ", toggleDesktopView: "ഡെസ്ക്ടോപ്പ്", settleUp: "സെറ്റിൽ ചെയ്യുക" },
    theme: { light: "ലൈറ്റ്", dark: "ഡാർക്ക്", system: "സിസ്റ്റം" }
  },

  mr: {
    appName: "स्पेंडवाईज AI",
    tagline: "आपला खर्च समजून घ्या. आपले भविष्य योजनाबद्ध करा.",
    nav: { dashboard: "डॅशबोर्ड", analytics: "विश्लेषण", capture: "खर्च नोंदवा", coach: "AI फायनान्शियल कोच", subscriptions: "सदस्यता", shared: "ग्रुप लेजर", goals: "बचत उद्दिष्टे", import: "CSV आयात", settings: "सेटिंग्ज" },
    metrics: { totalIncome: "मासिक उत्पन्न", totalExpenses: "एकूण खर्च", currentBalance: "शिल्लक रक्कम", budgetUtilization: "बजेट वापर", dailyLimit: "दैनिक खर्च मर्यादा", daysRemaining: "दिवस शिल्लक", upcomingObligations: "येणारी बिले", healthIndex: "आर्थिक आरोग्य निर्देशांक", healthGrade: "चांगले (78/100)", healthSummary: "आपला खर्च संतुलित आहे.", disclaimer: "केवळ माहितीसाठी विश्लेषण." },
    actions: { addExpense: "खर्च जोडा", scanReceipt: "पावती / UPI स्कॅन", voiceInput: "व्हॉइस एंट्री", save: "जतन करा", cancel: "रद्द करा", filter: "फिल्टर", export: "निर्यात", togglePhoneView: "मोबाइल", toggleDesktopView: "डेस्कटॉप", settleUp: "हिशोब पूर्ण करा" },
    theme: { light: "लाइट", dark: "डार्क", system: "सिस्टम" }
  },

  bn: {
    appName: "স্পেন্ডওয়াইজ AI",
    tagline: "আপনার ব্যয় বুঝুন। আপনার ভবিষ্যৎ পরিকল্পনা করুন।",
    nav: { dashboard: "ড্যাশবোর্ড", analytics: "বিশ্লেষণ", capture: "ব্যয় যোগ করুন", coach: "AI আর্থিক কোচ", subscriptions: "সাবস্ক্রিপশন", shared: "গ্রুপ খতিয়ান", goals: "সঞ্চয় লক্ষ্য", import: "CSV আমদানি", settings: "সেটিংস" },
    metrics: { totalIncome: "মাসিক আয়", totalExpenses: "মোট ব্যয়", currentBalance: "বর্তমান ব্যালেন্স", budgetUtilization: "বাজেট ব্যবহার", dailyLimit: "দৈনিক খরচের সীমা", daysRemaining: "দিন বাকি", upcomingObligations: "আসন্ন বিল", healthIndex: "আর্থিক স্বাস্থ্য সূচক", healthGrade: "ভালো (৭৮/১০০)", healthSummary: "আপনার খরচ ভারসাম্যপূর্ণ।", disclaimer: "কেবল তথ্যভিত্তিক বিশ্লেষণ।" },
    actions: { addExpense: "খরচ যোগ করুন", scanReceipt: "রসিদ / UPI স্ক্যান", voiceInput: "ভয়েস এন্ট্রি", save: "সংরক্ষণ", cancel: "বাতিল", filter: "ফিল্টার", export: "রপ্তানি", togglePhoneView: "মোবাইল", toggleDesktopView: "ডেস্কটপ", settleUp: "মিটিয়ে নিন" },
    theme: { light: "লাইট", dark: "ডার্ক", system: "সিস্টেম" }
  },

  gu: {
    appName: "સ્પેન્ડવાઇઝ AI",
    tagline: "તમારા ખર્ચને સમજો. તમારા ભવિષ્યનું આયોજન કરો.",
    nav: { dashboard: "ડેશબોર્ડ", analytics: "વિશ્લેષણ", capture: "ખર્ચ ઉમેરો", coach: "AI નાણાકીય કોચ", subscriptions: "સબ્સ્ક્રિપ્શન્સ", shared: "ગ્રુપ લેજર", goals: "બચત લક્ષ્યો", import: "CSV આયાત", settings: "સેટિંગ્સ" },
    metrics: { totalIncome: "માસિક આવક", totalExpenses: "કુલ ખર્ચ", currentBalance: "બાકી રકમ", budgetUtilization: "બજેટ વપરાશ", dailyLimit: "દૈનિક ખર્ચ મર્યાદા", daysRemaining: "દિવસો બાકી", upcomingObligations: "આગામી બિલો", healthIndex: "નાણાકીય આરોગ્ય સૂચકાંક", healthGrade: "સારું (78/100)", healthSummary: "તમારો ખર્ચ સંતુલિત છે.", disclaimer: "માત્ર માહિતી માટે વિશ્લેષણ." },
    actions: { addExpense: "ખર્ચ ઉમેરો", scanReceipt: "રસીદ / UPI સ્કેન", voiceInput: "વૉઇસ એન્ટ્રી", save: "સાચવો", cancel: "રદ કરો", filter: "ફિલ્ટર", export: "નિકાસ", togglePhoneView: "મોબાઇલ", toggleDesktopView: "ડેસ્કટોપ", settleUp: "હિસાબ પતાવો" },
    theme: { light: "લાઇટ", dark: "ડાર્ક", system: "સિસ્ટમ" }
  },

  ur: {
    appName: "اسپینڈ وائز AI",
    tagline: "اپنے اخراجات کو سمجھیں۔ اپنے مستقبل کی منصوبہ بندی کریں۔",
    nav: { dashboard: "ڈیش بورڈ", analytics: "تجزیہ و پیشین گوئی", capture: "خرچ شامل کریں", coach: "AI مالیاتی کوچ", subscriptions: "سبسکرپشنز اور بل", shared: "گروپ لیجر", goals: "بچت کے اہداف", import: "CSV امپورٹ", settings: "ترتیبات" },
    metrics: { totalIncome: "ماہانہ آمدنی", totalExpenses: "کل اخراجات", currentBalance: "موجودہ بیلنس", budgetUtilization: "بجٹ کا استعمال", dailyLimit: "روزانہ خرچ کی حد", daysRemaining: "دن باقی ہیں", upcomingObligations: "آنے والے بل اور سبسکرپشنز", healthIndex: "مالیاتی صحت کا انڈیکس", healthGrade: "بہترین (78/100)", healthSummary: "آپ کے اخراجات متوازن ہیں۔", disclaimer: "صرف معلوماتی تجزیہ؛ باضابطہ مالیاتی مشورہ نہیں۔" },
    actions: { addExpense: "خرچ درج کریں", scanReceipt: "رسید / UPI اسکین", voiceInput: "آواز کا اندراج", save: "محفوظ کریں", cancel: "منسوخ کریں", filter: "فلٹر", export: "برآمد کریں", togglePhoneView: "موبائل ویو", toggleDesktopView: "ڈیسک ٹاپ ویو", settleUp: "حساب چکتا کریں" },
    theme: { light: "لائٹ", dark: "ڈارک", system: "سسٹم" }
  },

  pa: {
    appName: "ਸਪੈਂਡਵਾਈਜ਼ AI",
    tagline: "ਆਪਣੇ ਖਰਚਿਆਂ ਨੂੰ ਸਮਝੋ। ਆਪਣੇ ਭਵਿੱਖ ਦੀ ਯੋਜਨਾ ਬਣਾਓ।",
    nav: { dashboard: "ਡੈਸ਼ਬੋਰਡ", analytics: "ਵਿਸ਼ਲੇਸ਼ਣ", capture: "ਖਰਚਾ ਜੋੜੋ", coach: "AI ਵਿੱਤੀ ਕੋਚ", subscriptions: "ਗਾਹਕੀਆਂ", shared: "ਗਰੁੱਪ ਖਾਤਾ", goals: "ਬੱਚਤ ਟੀਚੇ", import: "CSV ਆਯਾਤ", settings: "ਸੈਟਿੰਗਾਂ" },
    metrics: { totalIncome: "ਮਹੀਨਾਵਾਰ ਆਮਦਨ", totalExpenses: "ਕੁੱਲ ਖਰਚੇ", currentBalance: "ਮੌਜੂਦਾ ਬਕਾਇਆ", budgetUtilization: "ਬਜਟ ਵਰਤੋਂ", dailyLimit: "ਰੋਜ਼ਾਨਾ ਖਰਚ ਸੀਮਾ", daysRemaining: "ਦਿਨ ਬਾਕੀ", upcomingObligations: "ਆਉਣ ਵਾਲੇ ਬਿੱਲ", healthIndex: "ਵਿੱਤੀ ਸਿਹਤ ਸੂਚਕਾਂਕ", healthGrade: "ਵਧੀਆ (78/100)", healthSummary: "ਤੁਹਾਡਾ ਖਰਚਾ ਸੰਤੁਲਿਤ ਹੈ।", disclaimer: "ਸਿਰਫ਼ ਜਾਣਕਾਰੀ ਵਿਸ਼ਲੇਸ਼ਣ।" },
    actions: { addExpense: "ਖਰਚਾ ਜੋੜੋ", scanReceipt: "ਰਸੀਦ / UPI ਸਕੈਨ", voiceInput: "ਆਵਾਜ਼ ਐਂਟਰੀ", save: "ਸੰਭਾਲੋ", cancel: "ਰੱਦ ਕਰੋ", filter: "ਫਿਲਟਰ", export: "ਨਿਰਯਾਤ", togglePhoneView: "ਮੋਬਾਈਲ", toggleDesktopView: "ਡੈਸਕਟਾਪ", settleUp: "ਹਿਸਾਬ ਕਰੋ" },
    theme: { light: "ਲਾਈਟ", dark: "ਡਾਰਕ", system: "ਸਿਸਟਮ" }
  },

  or: {
    appName: "ସ୍ପେଣ୍ଡୱାଇଜ୍ AI",
    tagline: "ଆପଣଙ୍କର ଖର୍ଚ୍ଚ ବୁଝନ୍ତୁ। ଭବିଷ୍ୟତ ଯୋଜନା କରନ୍ତୁ।",
    nav: { dashboard: "ଡ୍ୟାସବୋର୍ଡ", analytics: "ବିଶ୍ଳେଷଣ", capture: "ଖର୍ଚ୍ଚ ଯୋଡନ୍ତୁ", coach: "AI ଆର୍ଥିକ କୋଚ୍", subscriptions: "ସବସ୍କ୍ରିପସନ୍", shared: "ଗ୍ରୁପ୍ ଖାତା", goals: "ସଞ୍ଚୟ ଲକ୍ଷ୍ୟ", import: "CSV ଆମଦାନୀ", settings: "ସେଟିଂସ୍" },
    metrics: { totalIncome: "ମାସିକ ଆୟ", totalExpenses: "ମୋଟ ଖର୍ଚ୍ଚ", currentBalance: "ଅବଶିଷ୍ଟ ରାଶି", budgetUtilization: "ବଜେଟ୍ ବ୍ୟବହାର", dailyLimit: "ଦୈନିକ ଖର୍ଚ୍ଚ ସୀମା", daysRemaining: "ଦିନ ବାକି", upcomingObligations: "ଆଗାମୀ ବିଲ୍", healthIndex: "ଆର୍ଥିକ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚକାଙ୍କ", healthGrade: "ଭଲ (78/100)", healthSummary: "ଆପଣଙ୍କ ଖର୍ଚ୍ଚ ସନ୍ତୁଳିତ ଅଛି।", disclaimer: "କେବଳ ସୂଚନା ବିଶ୍ଳେଷଣ।" },
    actions: { addExpense: "ଖର୍ଚ୍ଚ ଯୋଡନ୍ତୁ", scanReceipt: "ରସିଦ / UPI ସ୍କାନ୍", voiceInput: "ଭଏସ୍ ଏଣ୍ଟ୍ରି", save: "ସେଭ୍ କରନ୍ତୁ", cancel: "ବାତିଲ୍", filter: "ଫିଲ୍ଟର୍", export: "ରପ୍ତାନି", togglePhoneView: "ମୋବାଇଲ୍", toggleDesktopView: "ଡେସ୍କଟପ୍", settleUp: "ହିସାବ ସାରନ୍ତୁ" },
    theme: { light: "ଲାଇଟ୍", dark: "ଡାର୍କ", system: "ସିଷ୍ଟମ୍" }
  },

  es: {
    appName: "SpendWise AI",
    tagline: "Comprende tus gastos. Planifica tu futuro.",
    auth: {
      welcomeBack: "Bienvenido de nuevo",
      signInSubtitle: "Inicia sesión para gestionar tus finanzas e información de IA",
      createAccount: "Crear Cuenta",
      signUpSubtitle: "Únete a SpendWise AI para una planificación financiera inteligente",
      identifierLabel: "Número de Móvil o Usuario",
      identifierPlaceholder: "+91 9876543210 o @usuario",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      fullNameLabel: "Nombre Completo",
      fullNamePlaceholder: "Ej. Carlos Gómez",
      phoneLabel: "Número de Móvil",
      phonePlaceholder: "+91 9876543210",
      usernameLabel: "Usuario único (@handle)",
      usernamePlaceholder: "Ej. chithanya",
      forgotPassword: "¿Olvidaste tu contraseña?",
      signInButton: "Iniciar Sesión",
      signUpButton: "Crear Cuenta",
      noAccount: "¿No tienes una cuenta? Regístrate",
      haveAccount: "¿Ya tienes cuenta? Inicia sesión",
      quickDemoLogin: "Demo Rápida (@chithanya)",
      usernameAvailable: "Nombre de usuario disponible",
      usernameTaken: "Este nombre de usuario ya está en uso",
      checkingUsername: "Verificando disponibilidad...",
      passwordStrength: { weak: "Débil", fair: "Media", strong: "Fuerte" },
      resetPassword: "Restablecer Contraseña",
      resetSubtitle: "Ingresa tu usuario o teléfono para recibir un código",
      sendOtp: "Enviar enlace de recuperación",
      onboardingTitle: "Elige tu nombre de usuario único",
      onboardingSubtitle: "Completa tu perfil con un @usuario para colaborar en grupos",
      claimHandle: "Reclamar y Continuar",
      logout: "Cerrar Sesión"
    },
    nav: {
      dashboard: "Panel",
      analytics: "Análisis y Pronóstico",
      capture: "Registrar Gasto",
      coach: "Asesor Financiero IA",
      subscriptions: "Suscripciones y Facturas",
      shared: "Libro Compartido",
      goals: "Metas de Ahorro",
      import: "Importar CSV",
      settings: "Ajustes"
    },
    metrics: {
      totalIncome: "Ingresos Mensuales",
      totalExpenses: "Gastos Totales",
      currentBalance: "Saldo Actual",
      budgetUtilization: "Uso del Presupuesto",
      dailyLimit: "Límite Diario Sugerido",
      daysRemaining: "días restantes",
      upcomingObligations: "Facturas y suscripciones próximas",
      healthIndex: "Índice de Salud Financiera",
      healthGrade: "Calificación: Buena (78/100)",
      healthSummary: "Tus gastos están equilibrados con 34% Necesidades y 66% Deseos.",
      disclaimer: "Análisis informativo únicamente; no es asesoramiento financiero."
    },
    actions: {
      addExpense: "Añadir Gasto",
      scanReceipt: "Escanear Recibo / UPI",
      voiceInput: "Entrada de Voz",
      save: "Guardar Transacción",
      cancel: "Cancelar",
      filter: "Filtrar",
      export: "Exportar CSV",
      togglePhoneView: "Vista Móvil",
      toggleDesktopView: "Vista Amplia",
      settleUp: "Saldar Cuentas"
    },
    theme: { light: "Claro", dark: "Oscuro", system: "Sistema" }
  },

  fr: {
    appName: "SpendWise AI",
    tagline: "Comprenez vos dépenses. Planifiez votre avenir.",
    nav: { dashboard: "Tableau de bord", analytics: "Analyses & Prévisions", capture: "Ajouter une dépense", coach: "Coach Financier IA", subscriptions: "Abonnements & Factures", shared: "Grand Livre Partagé", goals: "Objectifs d'Épargne", import: "Importer CSV", settings: "Paramètres" },
    metrics: { totalIncome: "Revenu Mensuel", totalExpenses: "Dépenses Totales", currentBalance: "Solde Actuel", budgetUtilization: "Utilisation du Budget", dailyLimit: "Limite Quotidienne Recommandée", daysRemaining: "jours restants", upcomingObligations: "Factures à venir", healthIndex: "Indice de Santé Financière", healthGrade: "Score: Bon (78/100)", healthSummary: "Vos dépenses sont équilibrées.", disclaimer: "Analyse informative uniquement." },
    actions: { addExpense: "Ajouter Dépense", scanReceipt: "Scanner Reçu / UPI", voiceInput: "Entrée Vocale", save: "Enregistrer", cancel: "Annuler", filter: "Filtrer", export: "Exporter CSV", togglePhoneView: "Vue Mobile", toggleDesktopView: "Vue Bureau", settleUp: "Régler" },
    theme: { light: "Clair", dark: "Sombre", system: "Système" }
  },

  de: {
    appName: "SpendWise AI",
    tagline: "Verstehen Sie Ihre Ausgaben. Planen Sie Ihre Zukunft.",
    nav: { dashboard: "Dashboard", analytics: "Analysen & Prognosen", capture: "Ausgabe erfassen", coach: "KI-Finanzcoach", subscriptions: "Abonnements & Rechnungen", shared: "Gemeinsames Buch", goals: "Sparziele", import: "CSV-Import", settings: "Einstellungen" },
    metrics: { totalIncome: "Monatseinkommen", totalExpenses: "Gesamtausgaben", currentBalance: "Aktueller Saldo", budgetUtilization: "Budgetauslastung", dailyLimit: "Empfohlenes Tageslimit", daysRemaining: "Tage verbleibend", upcomingObligations: "Anstehende Rechnungen", healthIndex: "Finanzgesundheitsindex", healthGrade: "Gut (78/100)", healthSummary: "Ihre Ausgaben sind ausgewogen.", disclaimer: "Nur zur Information." },
    actions: { addExpense: "Ausgabe hinzufügen", scanReceipt: "Beleg scannen", voiceInput: "Spracheingabe", save: "Speichern", cancel: "Abbrechen", filter: "Filtern", export: "CSV exportieren", togglePhoneView: "Mobilansicht", toggleDesktopView: "Desktopansicht", settleUp: "Abrechnen" },
    theme: { light: "Hell", dark: "Dunkel", system: "System" }
  },

  ar: {
    appName: "سبيند وايز AI",
    tagline: "افهم نفقاتك. خطط لمستقبلك.",
    auth: {
      welcomeBack: "مرحبًا بعودتك",
      signInSubtitle: "سجل الدخول لإدارة أموالك ورؤى الذكاء الاصطناعي",
      createAccount: "إنشاء حساب",
      signUpSubtitle: "انضم إلى SpendWise AI لتخطيط مالي ذكي",
      identifierLabel: "رقم الجوال أو اسم المستخدم",
      identifierPlaceholder: "+91 9876543210 أو @username",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور الخاصة بك",
      fullNameLabel: "الاسم الكامل",
      fullNamePlaceholder: "مثال: شيثانيا ريدي",
      phoneLabel: "رقم الجوال",
      phonePlaceholder: "+91 9876543210",
      usernameLabel: "اسم المستخدم الفريد (@handle)",
      usernamePlaceholder: "مثال: chithanya",
      forgotPassword: "هل نسيت كلمة المرور؟",
      signInButton: "تسجيل الدخول",
      signUpButton: "إنشاء الحساب",
      noAccount: "ليس لديك حساب؟ سجل الآن",
      haveAccount: "هل لديك حساب بالفعل؟ تسجيل الدخول",
      quickDemoLogin: "تسجيل تجريبي سريع (@chithanya)",
      usernameAvailable: "اسم المستخدم متاح",
      usernameTaken: "اسم المستخدم مأخوذ بالفعل",
      checkingUsername: "جاري التحقق...",
      passwordStrength: { weak: "ضعيف", fair: "متوسط", strong: "قوي" },
      resetPassword: "إعادة تعيين كلمة المرور",
      resetSubtitle: "أدخل اسم المستخدم أو الهاتف لتلقي رمز الاسترداد",
      sendOtp: "إرسال رابط الاسترداد",
      onboardingTitle: "اختر اسم المستخدم الفريد الخاص بك",
      onboardingSubtitle: "أكمل ملفك التعريفي باختيار @handle للمشاركة في دفاتر المجموعات",
      claimHandle: "تأكيد ومتابعة",
      logout: "تسجيل الخروج"
    },
    nav: {
      dashboard: "لوحة التحكم",
      analytics: "التحليلات والتوقعات",
      capture: "تسجيل المصروفات",
      coach: "المدرب المالي بالذكاء الاصطناعي",
      subscriptions: "الاشتراكات والفواتير",
      shared: "دفتر المجموعة المشترك",
      goals: "أهداف الادخار",
      import: "استيراد CSV",
      settings: "الإعدادات"
    },
    metrics: {
      totalIncome: "الدخل الشهري",
      totalExpenses: "إجمالي النفقات",
      currentBalance: "الرصيد الحالي",
      budgetUtilization: "استهلاك الميزانية",
      dailyLimit: "حد الصرف اليومي الموصى به",
      daysRemaining: "أيام متبقية",
      upcomingObligations: "الفواتير والاشتراكات القادمة",
      healthIndex: "مؤشر الصحة المالية",
      healthGrade: "التقييم: جيد (78/100)",
      healthSummary: "إنفاقك متوازن بين الاحتياجات الأساسية والرغبات الشخصية.",
      disclaimer: "تحليل معلوماتي فقط؛ وليس استشارة مالية رسمية."
    },
    actions: {
      addExpense: "إضافة مصروف",
      scanReceipt: "مسح الإيصال / UPI",
      voiceInput: "إدخال صوتي",
      save: "حفظ المعاملة",
      cancel: "إلغاء",
      filter: "تصفية",
      export: "تصدير CSV",
      togglePhoneView: "عرض الهاتف",
      toggleDesktopView: "عرض كامل",
      settleUp: "تسوية الحساب"
    },
    theme: { light: "فاتح", dark: "داكن", system: "النظام" }
  },

  zh: {
    appName: "SpendWise AI",
    tagline: "洞悉每一笔消费，规划美好未来。",
    nav: { dashboard: "仪表盘", analytics: "分析与预测", capture: "添加支出", coach: "AI 财务顾问", subscriptions: "订阅与账单", shared: "群组账本", goals: "储蓄目标", import: "CSV 导入", settings: "设置" },
    metrics: { totalIncome: "月度收入", totalExpenses: "总支出", currentBalance: "当前余额", budgetUtilization: "预算使用率", dailyLimit: "建议每日消费限额", daysRemaining: "剩余天数", upcomingObligations: "即将到期的账单", healthIndex: "财务健康指数", healthGrade: "良好 (78/100)", healthSummary: "您的支出结构健康平衡。", disclaimer: "仅供信息分析参考，非专业理财建议。" },
    actions: { addExpense: "添加支出", scanReceipt: "扫描小票 / UPI", voiceInput: "语音输入", save: "保存", cancel: "取消", filter: "筛选", export: "导出 CSV", togglePhoneView: "手机视图", toggleDesktopView: "桌面视图", settleUp: "结清账目" },
    theme: { light: "浅色", dark: "深色", system: "跟随系统" }
  },

  ja: {
    appName: "SpendWise AI",
    tagline: "支出を理解し、未来を設計する。",
    nav: { dashboard: "ダッシュボード", analytics: "分析と予測", capture: "支出を追加", coach: "AIファイナンシャルコーチ", subscriptions: "サブスク＆請求書", shared: "グループ台帳", goals: "貯金目標", import: "CSVインポート", settings: "設定" },
    metrics: { totalIncome: "月収", totalExpenses: "総支出", currentBalance: "現在残高", budgetUtilization: "予算消化率", dailyLimit: "推奨1日支出制限", daysRemaining: "残り日数", upcomingObligations: "今後の支払い", healthIndex: "家計健全度指数", healthGrade: "良好 (78/100)", healthSummary: "支出はバランス良く保たれています。", disclaimer: "参考情報分析であり、専門的助言ではありません。" },
    actions: { addExpense: "支出を追加", scanReceipt: "レシート / UPIスキャン", voiceInput: "音声入力", save: "保存", cancel: "キャンセル", filter: "フィルター", export: "CSVエクスポート", togglePhoneView: "モバイル表示", toggleDesktopView: "PC表示", settleUp: "精算する" },
    theme: { light: "ライト", dark: "ダーク", system: "システム" }
  }
};

/**
 * Robust fallback resolution proxy:
 * Given a language code, returns an object that resolves all keys from that language,
 * falling back gracefully to English without ever returning undefined or throwing.
 */
export function getTranslationsForLanguage(lang: LanguageCode): TranslationSchema {
  const selected = languageDictionaries[lang] || {};
  const en = englishTranslations;

  return {
    appName: selected.appName || en.appName,
    tagline: selected.tagline || en.tagline,
    auth: {
      welcomeBack: selected.auth?.welcomeBack || en.auth.welcomeBack,
      signInSubtitle: selected.auth?.signInSubtitle || en.auth.signInSubtitle,
      createAccount: selected.auth?.createAccount || en.auth.createAccount,
      signUpSubtitle: selected.auth?.signUpSubtitle || en.auth.signUpSubtitle,
      identifierLabel: selected.auth?.identifierLabel || en.auth.identifierLabel,
      identifierPlaceholder: selected.auth?.identifierPlaceholder || en.auth.identifierPlaceholder,
      passwordLabel: selected.auth?.passwordLabel || en.auth.passwordLabel,
      passwordPlaceholder: selected.auth?.passwordPlaceholder || en.auth.passwordPlaceholder,
      fullNameLabel: selected.auth?.fullNameLabel || en.auth.fullNameLabel,
      fullNamePlaceholder: selected.auth?.fullNamePlaceholder || en.auth.fullNamePlaceholder,
      phoneLabel: selected.auth?.phoneLabel || en.auth.phoneLabel,
      phonePlaceholder: selected.auth?.phonePlaceholder || en.auth.phonePlaceholder,
      usernameLabel: selected.auth?.usernameLabel || en.auth.usernameLabel,
      usernamePlaceholder: selected.auth?.usernamePlaceholder || en.auth.usernamePlaceholder,
      forgotPassword: selected.auth?.forgotPassword || en.auth.forgotPassword,
      signInButton: selected.auth?.signInButton || en.auth.signInButton,
      signUpButton: selected.auth?.signUpButton || en.auth.signUpButton,
      noAccount: selected.auth?.noAccount || en.auth.noAccount,
      haveAccount: selected.auth?.haveAccount || en.auth.haveAccount,
      quickDemoLogin: selected.auth?.quickDemoLogin || en.auth.quickDemoLogin,
      usernameAvailable: selected.auth?.usernameAvailable || en.auth.usernameAvailable,
      usernameTaken: selected.auth?.usernameTaken || en.auth.usernameTaken,
      checkingUsername: selected.auth?.checkingUsername || en.auth.checkingUsername,
      passwordStrength: {
        weak: selected.auth?.passwordStrength?.weak || en.auth.passwordStrength.weak,
        fair: selected.auth?.passwordStrength?.fair || en.auth.passwordStrength.fair,
        strong: selected.auth?.passwordStrength?.strong || en.auth.passwordStrength.strong
      },
      resetPassword: selected.auth?.resetPassword || en.auth.resetPassword,
      resetSubtitle: selected.auth?.resetSubtitle || en.auth.resetSubtitle,
      sendOtp: selected.auth?.sendOtp || en.auth.sendOtp,
      onboardingTitle: selected.auth?.onboardingTitle || en.auth.onboardingTitle,
      onboardingSubtitle: selected.auth?.onboardingSubtitle || en.auth.onboardingSubtitle,
      claimHandle: selected.auth?.claimHandle || en.auth.claimHandle,
      logout: selected.auth?.logout || en.auth.logout,
    },
    nav: {
      dashboard: selected.nav?.dashboard || en.nav.dashboard,
      analytics: selected.nav?.analytics || en.nav.analytics,
      capture: selected.nav?.capture || en.nav.capture,
      coach: selected.nav?.coach || en.nav.coach,
      subscriptions: selected.nav?.subscriptions || en.nav.subscriptions,
      shared: selected.nav?.shared || en.nav.shared,
      goals: selected.nav?.goals || en.nav.goals,
      import: selected.nav?.import || en.nav.import,
      settings: selected.nav?.settings || en.nav.settings,
    },
    metrics: {
      totalIncome: selected.metrics?.totalIncome || en.metrics.totalIncome,
      totalExpenses: selected.metrics?.totalExpenses || en.metrics.totalExpenses,
      currentBalance: selected.metrics?.currentBalance || en.metrics.currentBalance,
      budgetUtilization: selected.metrics?.budgetUtilization || en.metrics.budgetUtilization,
      dailyLimit: selected.metrics?.dailyLimit || en.metrics.dailyLimit,
      daysRemaining: selected.metrics?.daysRemaining || en.metrics.daysRemaining,
      upcomingObligations: selected.metrics?.upcomingObligations || en.metrics.upcomingObligations,
      healthIndex: selected.metrics?.healthIndex || en.metrics.healthIndex,
      healthGrade: selected.metrics?.healthGrade || en.metrics.healthGrade,
      healthSummary: selected.metrics?.healthSummary || en.metrics.healthSummary,
      disclaimer: selected.metrics?.disclaimer || en.metrics.disclaimer,
    },
    actions: {
      addExpense: selected.actions?.addExpense || en.actions.addExpense,
      scanReceipt: selected.actions?.scanReceipt || en.actions.scanReceipt,
      voiceInput: selected.actions?.voiceInput || en.actions.voiceInput,
      save: selected.actions?.save || en.actions.save,
      cancel: selected.actions?.cancel || en.actions.cancel,
      filter: selected.actions?.filter || en.actions.filter,
      export: selected.actions?.export || en.actions.export,
      togglePhoneView: selected.actions?.togglePhoneView || en.actions.togglePhoneView,
      toggleDesktopView: selected.actions?.toggleDesktopView || en.actions.toggleDesktopView,
      settleUp: selected.actions?.settleUp || en.actions.settleUp,
    },
    theme: {
      light: selected.theme?.light || en.theme.light,
      dark: selected.theme?.dark || en.theme.dark,
      system: selected.theme?.system || en.theme.system,
    }
  };
}
