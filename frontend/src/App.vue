
<template>
  <div>
    <router-view v-if="!isLoginPage" />
    <div v-if="isLoginPage">
      <router-view />
    </div>
  </div>
</template> 

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const isLoginPage = computed(() => route.path === '/');

    return {
      isLoginPage
    };
  }
};
</script>
