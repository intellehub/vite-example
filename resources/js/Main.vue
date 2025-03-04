<template>
    <ThemeProvider>
      <SidebarProvider>
        <RouterView />
      </SidebarProvider>
    </ThemeProvider>
</template>

<script>
import ThemeProvider from "@/layouts/ThemeProvider.vue"
import SidebarProvider from "@/layouts/SidebarProvider.vue"

export default {
    name: `MainVue`,
    components: {
        ThemeProvider,
        SidebarProvider
    },
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>
