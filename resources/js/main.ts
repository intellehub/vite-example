import {createApp} from 'vue'
import Axios from 'axios'
import {createRouter, createWebHistory} from 'vue-router'
import mitt from 'mitt'
import {createApi, setRouter as setApiRouter} from '@/services/api'
import {appRoutes} from '@/router/routes'
import mainVue from './layouts/Main.vue'
import {createPinia} from 'pinia'
import {createI18n} from 'vue-i18n'
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

// @ts-ignore
import { authService, setRouter as setAuthRouter } from '@/services/auth'
// @ts-ignore
import * as en from '@/../lang/en.json'
import VueApexCharts from 'vue3-apexcharts'

import {configureRouter} from '@/router/routerConfig'
import {hasRole, hasPermissions} from '@/services/acl'

import Echo from 'laravel-echo'
import EchoService from '@/echo'

// Add this type declaration at the top of the file
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $echo: {
            getInstance: () => Promise<Echo<any>>
        }
    }
}

const app = createApp(mainVue)

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        'en': en
    },
})

const pinia = createPinia()
const router = createRouter({
    end: undefined, sensitive: true, strict: true,
    history: createWebHistory(),
    routes: appRoutes,
    scrollBehavior() {
        return {top: 0}
    }
})

setApiRouter(router)
setAuthRouter(router)

const api = createApi({
    handler: Axios,
    namespace: '/v1',
    router: router
})

// Configure router with guards
configureRouter(router, app)

app.use(i18n)
app.use(pinia)
app.use(api)
app.use(router)
app.use(VueApexCharts)

app.config.globalProperties.$mitt = mitt()
app.config.globalProperties.$goTo = function (route_name: any) {
    this.$router.push({name: route_name})
}

app.config.globalProperties.$parseValidationErrors = function (bag: any, errors: any) {
    forEach(errors, function (value: any, key: any) {
        let found = 0
        bag.map((item: { field: string; messages: string[] }) => {
            if (item.field === key) {
                found = 1
                item.messages.push(value)
            }
            return item
        })
        if (found === 0) {
            bag.push({'field': key, 'messages': value})
        }
    })
    return bag
}
app.config.globalProperties.$toBool = function (str: any) {
    return String(str).toLowerCase() == "true" || String(str) === "1" || str === 1 || str === true
}

app.config.globalProperties.$formatTimeAgo = function (str: string) {
    const now = new Date()
    const past = new Date(str)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) {
        const seconds = diffInSeconds
        return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
    }
    if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }
    if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000)
        return `${months} ${months === 1 ? 'month' : 'months'} ago`
    }
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

app.config.globalProperties.$auth = {
    ...authService,
    hasRole,
    hasPermissions
}

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

// Register Element Plus plugins
app.config.globalProperties.$message = ElMessage
app.config.globalProperties.$confirm = ElMessageBox.confirm
app.use(ElLoading)

// In your app initialization
app.config.globalProperties.$echo = {
    getInstance: () => EchoService.getInstance()
}

app.mount('#app')
