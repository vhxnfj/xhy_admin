<template>
  <div class="qrcode-wrapper">
    <div ref="qrcode"></div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2-fix'

export default {
  name: 'QrCode',
  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 180
    }
  },
  mounted() {
    this.generateQrCode()
  },
  methods: {
    generateQrCode() {
      new QRCode(this.$refs.qrcode, {
        text: this.value,
        width: this.size,
        height: this.size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H // 级别 L/M/Q/H
      })
    }
  }
}
</script>

<style scoped>
.qrcode-wrapper {
  display: inline-block;
  padding: 10px;
  background: #fff;
}
</style>
