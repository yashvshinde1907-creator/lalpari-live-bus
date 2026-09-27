

/**
 * Universal PWA - Main Application Logic
 * Included Features:
 * 1. 🔒 Device Fingerprint Lock (Unauthorized Sharing Block)
 * 2. 📱 Smart Device Detection (PC / Android / iPhone)
 * 3. 🚪 Welcome Page Router (welcom/ folder integration)
 * 4. 🔑 Login / Sign Out State Management
 * 5. 🎬 Splash Screen Manager (PWA Standalone Mode)
 * 6. 📲 PWA Installation Prompt Manager
 * 7. 🛠️ Service Worker Registration
 */

/** 
// ==================== 🔒 1. DEVICE FINGERPRINT LOCK SYSTEM ====================
(function checkDeviceLock() {
    function generateFingerprint() {
        const screenSpecs = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
        const userAgent = navigator.userAgent;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const rawString = `${screenSpecs}-${userAgent}-${timeZone}`;

        let hash = 0;
        for (let i = 0; i < rawString.length; i++) {
            const char = rawString.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return 'DEV_' + Math.abs(hash);
    }

    const currentDeviceFP = generateFingerprint();
    const savedOwnerFP = localStorage.getItem('pwa_owner_device_id');

    if (!savedOwnerFP) {
        // प्रथमच उघडल्यास ऑनर डिव्हाईस सेव्ह करा
        localStorage.setItem('pwa_owner_device_id', currentDeviceFP);
        console.log("✅ Primary Owner Device Saved:", currentDeviceFP);
    } else {
        // दुसऱ्या डिव्हाईसवर उघडल्यास ब्लॉक करा
        if (savedOwnerFP !== currentDeviceFP) {
            console.warn("🔒 Unauthorized device access blocked!");
            
            // 🛑 युझरला खरेदी केलेल्या सेलिंग लिंकवर पाठवण्यासाठी खालील URL बदला
            const sellingWebsiteUrl = "YOUR_SELLING_WEBSITE_URL_HERE"; 
            if (sellingWebsiteUrl !== "YOUR_SELLING_WEBSITE_URL_HERE") {
                window.location.href = sellingWebsiteUrl;
            }

            document.body.innerHTML = `
                <div style="background:#0f172a; color:#ffffff; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px; font-family:'Inter', sans-serif;">
                    <div style="font-size:60px; margin-bottom:15px;">🔒</div>
                    <h1 style="color:#ef4444; font-size:24px; margin-bottom:10px;">Access Denied</h1>
                    <p style="font-size:14px; color:#94a3b8; max-width:320px; line-height:1.5;">ही वेबसाईट/ॲप फक्त मूळ खरेदीदाराच्या डिव्हाईसवर चालण्यासाठी लॉक केले आहे.</p>
                     Powered by <a href="YOUR_SELLING_WEBSITE_URL_HERE" target="_blank" rel="noopener noreferrer" id="branding-selling-link">Yash Shinde</a>

                </div>
            `;
            throw new Error("Access Denied: Unregistered Device");
        }
    }
})();

*/

// ==================== ⚙️ 2. CONFIG & DEVICE DETECTOR ====================
//===================== 📱  2. Smart Device Detection (PC / Android / iPhone) ===============
const CONFIG = {
    SPLASH_DURATION: 2500,
    MOBILE_MAX_WIDTH: 768,
    TABLET_MAX_WIDTH: 1024,
    KEYS: {
        INSTALLED: 'pwa_installed',
        INSTALL_DISMISSED: 'pwa_install_dismissed',
        USER_LOGGED_IN: 'pwa_user_logged_in'
    }
};

const DeviceDetector = {
    detect() {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();
        const width = window.innerWidth;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const isIOS = /iphone|ipad|ipod/.test(ua) || (platform === 'macintel' && navigator.maxTouchPoints > 1);
        const isAndroid = /android/.test(ua);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

        let deviceType = 'pc';
        if (isIOS) deviceType = 'iphone';
        else if (isAndroid || (width <= CONFIG.MOBILE_MAX_WIDTH && isTouch)) deviceType = 'android';

        return { type: deviceType, isStandalone: isStandalone };
    }
};

// ==================== 🎬 3. SPLASH & ROUTING MANAGER ====================
const SplashManager = {
    timerId: null,

    async init() {
        console.log('🎬 Universal Routing Engine Started...');
        const appContainer = document.getElementById('app-gateway-container') || document.getElementById('app-container');
        if (!appContainer) return;

        const device = DeviceDetector.detect();
        const urlParams = new URLSearchParams(window.location.search);
        const isStandaloneMode = urlParams.get('mode') === 'standalone' || device.isStandalone;

        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        let splashPage = `${basePath}splashes/splashes-${device.type}.html`;

        // Target Main Pages
        let targetPage;
        if (device.type === 'pc') {
            targetPage = isStandaloneMode ? `${basePath}pcapp/pcapp.html` : `${basePath}pcwebsite/pcwebsite.html`; 
        } else if (device.type === 'iphone') {
            targetPage = isStandaloneMode ? `${basePath}iphoneapp/iphoneapp.html` : `${basePath}iphonewebsite/iphonewebsite.html`;
        } else {
            targetPage = isStandaloneMode ? `${basePath}androidapp/androidapp.html` : `${basePath}androidwebsite/androidwebsite.html`;
        }

        // 📱 PWA STANDALONE MODE
        if (isStandaloneMode) {
            // PWA मध्ये बॉटम ब्रँडिंग लपवा
            const brandingFooter = document.getElementById('developer-branding-footer');
            if (brandingFooter) brandingFooter.style.display = 'none';

            console.log(`🔍 Fetching Splash: ${splashPage}`);
            try {
                const splashResponse = await fetch(splashPage);
                if (splashResponse.ok) {
                    appContainer.innerHTML = await splashResponse.text();
                } else {
                    appContainer.innerHTML = '<div style="display:flex; height:100vh; align-items:center; justify-content:center; background:#0f172a; color:white;">Loading App...</div>';
                }
            } catch (err) {
                appContainer.innerHTML = '<div style="display:flex; height:100vh; align-items:center; justify-content:center; background:#0f172a; color:white;">Loading App...</div>';
            }

            this.timerId = setTimeout(() => {
                this.loadMainApp(targetPage, appContainer);
            }, CONFIG.SPLASH_DURATION);

        } else {
            // 🌐 BROWSER MODE (WEBSITE VISIT)
            const isLoggedIn = localStorage.getItem(CONFIG.KEYS.USER_LOGGED_IN) === 'true';

            if (!isLoggedIn) {
                // युझर लॉग इन नसेल तर welcome/ फोल्डरमधील फाईल उघडा
                let welcomePage;
                if (device.type === 'pc') {
                    welcomePage = `${basePath}welcome/pc_welcome_page.html`;
                } else if (device.type === 'iphone') {
                    welcomePage = `${basePath}welcome/iphone_welcome_page.html`;
                } else {
                    welcomePage = `${basePath}welcome/android_welcome_page.html`;
                }

                console.log(`🌟 Welcome Page Route: ${welcomePage}`);
                this.loadPageContent(welcomePage, appContainer);
            } else {
                // युझर लॉग इन असेल तर थेट मुख्य वेबसाईट दाखवा
                console.log('🌐 User Logged In: Direct Load Main Website.');
                this.loadMainApp(targetPage, appContainer);
            }
        }
    },

    async loadPageContent(pageUrl, container) {
        try {
            const response = await fetch(pageUrl);
            if (response.ok) {
                container.innerHTML = await response.text();
                this.executeScripts(container);
            } else {
                container.innerHTML = `<div style="padding:20px; color:white; text-align:center; background:#0f172a;">त्रुटी: फाईल सापडली नाही (${pageUrl})</div>`;
            }
        } catch (err) {
            console.error('Page content fetch failed:', err);
        }
    },

    async loadMainApp(targetPage, container) {
        try {
            console.log(`🚀 Routing to Main UI: ${targetPage}`);
            const appResponse = await fetch(targetPage);
            if (appResponse.ok) {
                container.innerHTML = await appResponse.text();
                this.executeScripts(container);

                const device = DeviceDetector.detect();
                const urlParams = new URLSearchParams(window.location.search);
                if (!device.isStandalone && urlParams.get('mode') !== 'standalone') {
                    setTimeout(() => InstallManager.show(device), 1500);
                }
            } else {
                container.innerHTML = `<div style="padding:20px; color:white; text-align:center; background:#0f172a;">त्रुटी: फाईल सापडली नाही (${targetPage})</div>`;
            }
        } catch (err) {
            console.error('Main App UI load failed:', err);
        }
    },

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
};

// ==================== 📲 4. INSTALL MANAGER ====================
const InstallManager = {
    deferredPrompt: null,

    init() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
        });

        window.addEventListener('appinstalled', () => {
            localStorage.setItem(CONFIG.KEYS.INSTALLED, 'true');
            this.hidePrompt();
        });
    },

    show(device) {
        if (localStorage.getItem(CONFIG.KEYS.INSTALLED) === 'true') return;
        const container = document.getElementById('install-container');
        const btnText = document.getElementById('install-btn-text');
        if (!container || !btnText) return;

        btnText.textContent = device.type === 'pc' ? 'PC वर Install करा' : 'App फोनवर जोडा';
        container.style.display = 'block';
    },

    hidePrompt() {
        const container = document.getElementById('install-container');
        if (container) container.style.display = 'none';
    }
};

// ==================== 🛠️ 5. SERVICE WORKER MANAGER ====================
const SWManager = {
    async register() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('✅ Service Worker Registered Successfully:', registration.scope);
            } catch (error) {
                console.error('❌ Service Worker Registration Failed:', error);
            }
        }
    }
};

// ==================== 🔑 6. GLOBAL LOGIN / SIGN-OUT HELPERS ====================

// साइन इन / Get Started बटणावर कॉल करा
function userSignIn() {
    localStorage.setItem(CONFIG.KEYS.USER_LOGGED_IN, 'true');
    SplashManager.init();
}

// साइन आउट बटणावर कॉल करा
function userSignOut() {
    localStorage.setItem(CONFIG.KEYS.USER_LOGGED_IN, 'false');
    SplashManager.init();
}

// 📲 इन्स्टॉल केल्यानंतर लगेच standalone मोडवर पाठवणारे फंक्शन
function installApp() {
    if (InstallManager.deferredPrompt) {
        InstallManager.deferredPrompt.prompt();
        InstallManager.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
                localStorage.setItem(CONFIG.KEYS.INSTALLED, 'true');
                InstallManager.hidePrompt();
                
                // 🚀 इन्स्टॉल झाल्यावर युझरला सांगणे / थेट ॲप मोडवर स्विच करणे
                alert("ॲप यशस्वीरित्या स्थापित झाले आहे! आता होमस्क्रीनवरून App उघडा.");
            }
            InstallManager.deferredPrompt = null;
        });
    } else {
        alert("ॲप स्थापित करण्यासाठी ब्राउझरच्या मेनूवरील Install (➕) चिन्हावर क्लिक करा.");
    }
}


function dismissInstall() {
    localStorage.setItem(CONFIG.KEYS.INSTALL_DISMISSED, Date.now().toString());
    InstallManager.hidePrompt();
}

// ==================== 🚀 INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    InstallManager.init();
    SWManager.register();
    SplashManager.init();
});



