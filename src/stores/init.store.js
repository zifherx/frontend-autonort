import { defineStore } from "pinia";
import { readonly, ref } from "vue";

export const useInitStore = defineStore("Init", () => {
    const platformSidebar = ref(true);
    const platformName = ref("Plataforma Integral Autonort");
    const platformAbbreviation = ref("PIA");
    const platformVersion = ref("2.5.0");
    const platformDesignedBy = ref("Designed by");
    const platformAuthor = ref("Ziphonex");

    return {
        platformSidebar,
        platformName: readonly(platformName),
        platformAbbreviation: readonly(platformAbbreviation),
        platformVersion: readonly(platformVersion),
        platformDesignedBy: readonly(platformDesignedBy),
        platformAuthor: readonly(platformAuthor),
    };
});

// export default useInitStore;
