<script lang="ts">
  import Vue from 'vue';
  import DragAndDropUpload from '@/components/drag-drop-upload.vue';

  export default Vue.extend({
    name: 'home',
    components: {DragAndDropUpload},
  });
</script>

<template>
  <div>
    <drag-and-drop-upload></drag-and-drop-upload>
  </div>
</template>

<style lang="scss">
  :root {
    --primary: #5628EE;
    --success: #41D071;
    --grey-light: #99A3BA;
    --grey: #6C7486;
    --grey-dark: #3F4656;
    --light: #CDD9ED;
    --lighter: #E4ECFA;
    --shadow: rgba(18, 22, 33, .1);
  }

  @keyframes move {
    50% {
      transform: translate(-50%, -70%);
    }
  }

  @keyframes scale {
    40% {
      transform: scale(.92) rotate(var(--r));
    }
  }

  @keyframes tick {
    100% {
      transform: rotate(-90deg) translate(0, -6px) scale(var(--s));
    }
  }

  html {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: inherit;

    &:before,
    &:after {
      box-sizing: inherit;
    }
  }

  // Center & dribbble
  body {
    min-height: 100vh;
    font-family: Roboto, Arial;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--light);
    padding: 20px;

    .dribbble {
      position: fixed;
      display: block;
      right: 20px;
      bottom: 20px;

      img {
        display: block;
        height: 28px;
      }
    }
  }


</style>
