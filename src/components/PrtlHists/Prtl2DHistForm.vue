<template>
  <div>
    <iseult-image-graph/>
  </div>
</template>

<script>
import ImageGraph from '@/components/GraphHelpers/ImageGraph'
export default {
  data () {
    return {
      userData: {
        email: '',
        password: '',
        age: 27
      },
      message: 'A new Text',
      sendMail: [],
      gender: 'Male',
      selectedPriority: 'High',
      priorities: ['High', 'Medium', 'Low'],
      dataSwitch: true,
      isSubmitted: false
    }
  },
  methods: {
    submitted () {
      this.isSubmitted = true
    }
  },
  components: {
    iseultImageGraph: ImageGraph,
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
