import {createApp} from 'vue'
import Axios from 'axios'
import mitt from 'mitt'
import mainVue from './Main.vue'
import {createPinia} from 'pinia'
import {forEach} from "lodash"
import {
    ElUpload,
    ElTabs,
    ElTabPane,
    ElRadio,
    ElRadioGroup,
    ElAlert,
    ElButton,
    ElSwitch,
    ElPagination,
    ElMessage,
    ElPopconfirm,
    ElContainer,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElCheckbox,
    ElLoading,
    ElMessageBox,
    ElTag,
    ElProgress,
    ElPopover,
    ElStep,
    ElSteps,
    ElTimeline,
    ElTimelineItem,
    ElTooltip,
    ElCard,
    ElLink,
    ElRate
} from 'element-plus'

import VueApexCharts from 'vue3-apexcharts'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $echo: {
            getInstance: () => Promise<Echo<any>>
        }
    }
}

const app = createApp(mainVue)

const pinia = createPinia()
const router = createRouter({
    end: undefined, sensitive: true, strict: true,
    history: createWebHistory(),
    routes: appRoutes,
    scrollBehavior() {
        return {top: 0}
    }
})

app.use(pinia)
app.use(router)
app.use(VueApexCharts)

app.config.globalProperties.$mitt = mitt()

// Register Element Plus components
const elementComponents = [
    ElTag,
    ElAlert,
    ElButton,
    ElSwitch,
    ElPagination,
    ElPopconfirm,
    ElContainer,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElCheckbox,
    ElUpload,
    ElProgress,
    ElPopover,
    ElRadio,
    ElRadioGroup,
    ElTabs,
    ElTabPane,
    ElStep,
    ElSteps,
    ElTimeline,
    ElTimelineItem,
    ElTooltip,
    ElCard,
    ElLink,
    ElRate
]

elementComponents.forEach(component => {
    app.use(component)
})

app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.use(ElLoading)

app.mount('#app')
