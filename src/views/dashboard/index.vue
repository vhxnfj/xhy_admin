<template>
  <div class="dashboard-container">
    <panel-group />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart />
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from './components/LineChart';
import PanelGroup from './components/PanelGroup';

export default {
  name: 'Dashboard',
  components:{
    LineChart,
    PanelGroup,
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {

    }
  },
}
</script>

<style lang="scss" scoped>
  .dashboard-container {
    padding: 32px;
    min-height: 1000px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
