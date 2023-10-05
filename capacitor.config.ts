import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: 'com.bytheg.byh16m',
    appName: 'byh16m',
    webDir: 'www',
    bundledWebRuntime: false,

    plugins:{
        LocalNotifications:{
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#488AFF',
            sound: 'beep.wav',
        },
    },
};

export default config;