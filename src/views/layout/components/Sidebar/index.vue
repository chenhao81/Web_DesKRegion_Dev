<template>
  <scroll-bar>
    <div class="logoLocation" v-if="!isCollapse">
      <img src="../../../../assets/images/logo3.png" alt="">
    </div>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#304156"
             text-color="#bfcbd9" active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import ScrollBar from '@/components/ScrollBar'

  export default {
    components: { SidebarItem, ScrollBar },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
<style scoped lang="scss">
  .logoLocation {
    margin-top: 5px;
    height: 50px;
    text-align: center;
    img {
      border: 0;
      width: 90%;
      height: 100%
    }
  }
</style>
