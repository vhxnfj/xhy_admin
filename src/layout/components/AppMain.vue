<template>
  <section class="app-main">
    <div style="height: 30px;"></div>
    <div class="body-box">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </transition>
      <back-to-top :custom-style="myBackToTopStyle" :visibility-height="100" :back-position="0" transition-name="fade" />
    </div>
  </section>
</template>

<script>
import BackToTop from '@/components/BackToTop'
export default {
  name: 'AppMain',
  data(){
    return {
      myBackToTopStyle: {
        right: '30px',
        bottom: '30px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  },
  components: { BackToTop },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    /* 50= navbar  50  */
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: #f8f8f8;
  }
  .body-box{
    margin: 0px;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      /* 84 = navbar + tags-view = 50 + 34 */
      min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
      padding-top: 84px;
    }
  }
</style>

<style lang="scss">
  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
