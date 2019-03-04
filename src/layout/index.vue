<template lang="pug">
div(class="main-container")
  div(class="main-body")
    slot
      router-view
</template>

<script>
export default {
  data() {
    return { meta: this.$route.meta };
  },
  watch: {
    $route: function() {
      this.meta = this.$route.meta;
    }
  },
  methods: {}
};
</script>

<style>
</style>
