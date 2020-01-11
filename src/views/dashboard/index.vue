<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎登陆XXX管理系统</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin-top: 10%;
    text-align: center;
  }
  &-text {
    font-size: 50px;
    line-height: 46px;
  }
}
</style>
