<template>
  <div class="components-container">
    <div class="editor-container">
      <dropzone v-on:dropzone-removedFile="dropzoneR" v-on:dropzone-success="dropzoneS" id="myVueDropzone"
                url="https://httpbin.org/post"></dropzone>
    </div>
  </div>
</template>

<script>
  import Dropzone from '@/components/Dropzone'

  export default {
    name: 'dropzone-demo',
    components: { Dropzone },
    methods: {
      dropzoneS(file) {
        console.log(file)
        this.$message({ message: 'Upload success', type: 'success' })
      },
      dropzoneR(file) {
        console.log(file)
        this.$message({ message: 'Delete success', type: 'success' })
      }
    }
  }
</script>


