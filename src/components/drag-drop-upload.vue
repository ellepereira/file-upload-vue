<script lang="ts">
  import Vue from 'vue';
  import UploadedFileEntry from '@/components/uploaded-file-entry.vue';

  import $ from 'jquery';
  import { getRotationToPoint, distanceToPoint } from '@/utils/elements';
  import { waitFor } from '@/utils/wait-for';

  export default Vue.extend({
    name: 'drag-drop-upload',
    components: {
      UploadedFileEntry
    },

    data: () => ({
      mounted: false,
      hovering: false,
      mouse: {x: 0, y: 0},
      files: [] as File[],
      show: false,
      dragged: false,
      dropped: false,
      showDrops: false,
      currentDistance: 0,
      placeholderElement: document.createElement('span'),
    }),

    mounted() {
      this.mounted = true;
    },

    computed: {
      styles(): any {
        return {
          '--r': getRotationToPoint(this.dropContainer, this.mouse.x, this.mouse.y) + 'deg',
        };
      },
      classes(): any {
        return {
          dropped: this.dropped,
          showDrops: this.showDrops,
          dragged: this.dragged,
          show: this.show,
        };
      },

      dropContainer(): HTMLElement {
        if (this.mounted) {
          return this.$refs.drop as HTMLElement;
        }
        return this.placeholderElement;
      },

      circle(): HTMLElement {
        return this.dropContainer.querySelector('.circle') || this.placeholderElement;
      },

      list(): JQuery<HTMLElement> {
        return $('.drop').children('.list');
      },
    },

    methods: {
      dragOver(e: DragEvent) {
        this.dragged = true;
        this.showDrops = true;

        this.mouse = {
          x: e.pageX,
          y: e.pageY,
        };

        // 144 is the offset between circle and its container
        let distance = distanceToPoint(this.circle, this.mouse.x, this.mouse.y) / 144;
        this.hovering = distance < .3;

        if (this.hovering) {
          distance = 1;
        }

        this.currentDistance = distance * 12;
        this.setPathData(this.currentDistance);
      },

      dragLeave() {
        this.dragged = false;
        this.showDrops = false;
      },

      async drop(e: any) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.files.push(e.dataTransfer.files[i]);
        }

        if (!this.dropped) {
          this.dropped = true;
          await waitFor(400);

          // go from the current distance to 18 in 100 milliseconds
          this.showDrops = false;

          await waitFor(300);

          this.show = true;
        }
      },

      setPathData(value: any) {
        const svgPath = this.circle.querySelector('svg path');
        if (svgPath) {
          svgPath.setAttribute('d', 'M46,80 C55.3966448,80 63.9029705,76.1880913 70.0569683,70.0262831 C76.2007441,63.8747097 80,55.3810367 80,46 C80,36.6003571 76.1856584,28.0916013 70.0203842,21.9371418 C63.8692805,15.7968278 55.3780386, ' + value + ' 46, ' + value + ' C36.596754, ' + value + ' 28.0850784,15.8172663 21.9300655,21.9867066 C15.7939108,28.1372443 12,36.6255645 12,46 C12,55.4035343 15.8175004,63.9154436 21.9872741,70.0705007 C28.1377665,76.2063225 36.6258528,80 46,80 Z');
        }
      }
    }
  });
</script>

<template>
  <div>
    <div
      ref="drop"
      class="drop"
      :class="classes"
      :style="styles"
      @dragenter.prevent
      @dragstart.prevent
      @dragleave.prevent="dragLeave"
      @dragover.prevent="dragOver"
      @drag.prevent
      @drop.prevent="drop"
    >
      <nav>
        <ul>
          <li>
            <a href>Recent uploads</a>
          </li>
        </ul>
      </nav>
      <div class="intro">
        <h4>No recent files</h4>
        <p>Drag &amp; Drop to upload or create a new watch folder for Auto-upload</p>
      </div>
      <div
        class="center"
        :class="{'fade-out-top': dropped}"
      >
        <div>
          <span>Upload</span>
          <div class="circle">
            <svg
              :class="{'hovering': hovering}"
              viewBox="0 0 92 92"
              fill="currentColor"
            >
              <path
                d="M46,80 C55.3966448,80 63.9029705,76.1880913 70.0569683,70.0262831 C76.2007441,63.8747097 80,55.3810367 80,46 C80,36.6003571 76.1856584,28.0916013 70.0203842,21.9371418 C63.8692805,15.7968278 55.3780386, 12 46, 12 C36.596754, 12 28.0850784,15.8172663 21.9300655,21.9867066 C15.7939108,28.1372443 12,36.6255645 12,46 C12,55.4035343 15.8175004,63.9154436 21.9872741,70.0705007 C28.1377665,76.2063225 36.6258528,80 46,80 Z"
              ></path>
            </svg>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5.2319,10.6401 C5.5859,11.0641 6.2159,11.1221 6.6399,10.7681 L10.9999,7.1351 L10.9999,19.0001 C10.9999,19.5521 11.4479,20.0001 11.9999,20.0001 C12.5519,20.0001 12.9999,19.5521 12.9999,19.0001 L12.9999,7.1351 L17.3599,10.7681 C17.7849,11.1221 18.4149,11.0641 18.7679,10.6401 C19.1219,10.2161 19.0649,9.5851 18.6399,9.2321 L12.6399,4.2321 C12.5929,4.1921 12.5369,4.1731 12.4849,4.1431 C12.4439,4.1191 12.4079,4.0911 12.3629,4.0731 C12.2459,4.0271 12.1239,4.0001 11.9999,4.0001 C11.8759,4.0001 11.7539,4.0271 11.6369,4.0731 C11.5919,4.0911 11.5559,4.1191 11.5149,4.1431 C11.4629,4.1731 11.4069,4.1921 11.3599,4.2321 L5.3599,9.2321 C4.9359,9.5851 4.8779,10.2161 5.2319,10.6401"
            ></path>
          </svg>
        </div>
      </div>
      <div class="hint">Drop your files to upload</div>
      <ul class="list">
        <uploaded-file-entry
          class="fade-in-top"
          v-if="show === true"
          v-for="file in files"
          :file="file"
        ></uploaded-file-entry>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
  .drop {
    --r: 0rad;
    width: 380px;
    height: 420px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 24px -2px var(--shadow);
    position: relative;
    overflow: auto;
    
    nav {
      border-bottom: 1px solid var(--lighter);
      display: flex;
      align-items: center;
      padding: 0 16px;

      ul {
        display: flex;

        li {
          margin-bottom: -1px;

          a {
            display: block;
            font-weight: 500;
            font-size: 12px;
            line-height: 21px;
            color: var(--grey-light);
            text-decoration: none;
            padding: 12px 0 11px 0;
            border-bottom: 1px solid transparent;
          }
        }
      }
    }

    .center {
      --y: 52px;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 6;
      transition: transform .3s ease;
      transform: translate(-50%, var(--y));

      & > div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height: 43px;
        width: 120px;
        background: var(--primary);
        border-radius: 5px;
        transition: width .2s ease, height .2s ease, border-radius .2s ease, opacity .4s ease;
        pointer-events: none;

        span,
        .circle,
        & > svg {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: block;
        }

        span,
        & > svg {
          color: #fff;
          transition: opacity .2s ease;
        }

        span {
          font-weight: 500;
          font-size: 16px;
        }

        & > svg {
          width: 32px;
          height: 32px;
          opacity: 0;
        }

        .circle {
          opacity: 0;

          svg {
            width: 92px;
            height: 92px;
            color: var(--primary);
            display: block;
            transform: rotate(var(--r));
          }
        }
      }
    }

    .intro,
    .hint {
      --y: -76px;
      color: var(--grey);
      font-size: 14px;
      line-height: 23px;
      text-align: center;
      width: 100%;
      max-width: 220px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, var(--y));
      transition: opacity .2s ease, transform .4s ease;
      pointer-events: none;

      h4 {
        margin-bottom: 8px;
        color: var(--grey-dark);
        font-family: inherit;
        font-weight: 500;
        font-size: 20px;
      }

      p {
        margin: 0;
      }
    }

    .hint {
      --y: 80px;
      opacity: 0;
    }

    &.dragged {
      .center {
        --y: 4px;

        & > div {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          animation: move 2s ease-in-out infinite .2s;

          span {
            opacity: 0;
          }

          & > svg {
            opacity: 1;
            transition-delay: .2s;
          }

          .circle {
            opacity: 1;
            transition: opacity 0s ease .2s;
          }
        }
      }

      .intro {
        --y: -120px;
        opacity: 0;
      }

      .hint {
        --y: 60px;
        opacity: 1;
      }
    }

    &.dropped {
      .center {
        & > div {
          background: none;
          animation-play-state: paused;

          .circle {
            svg {
              animation: scale .7s linear .4s;
            }
          }
        }
      }
    }

    &.show {
      .center {
        --y: -40px;

        & > div {
          opacity: 0;
        }
      }

      .list {
        li {
          --y: 0;
          opacity: 1;
        }
      }

      .hint {
        --y: 40px;
        opacity: 0;
      }
    }
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

  .hovering {
    -webkit-animation: scale-up-center 0.3s linear 1 both;
    animation: scale-up-center 0.3s linear 1 both;
  }

  .fade-in-top {
    -webkit-animation: fade-in-top 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: fade-in-top 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }

  .fade-out-top {
    -webkit-animation: fade-out-top 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: fade-out-top 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  @-webkit-keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-50px);
      transform: translateY(-50px);
      opacity: 0;
    }
  }

  @keyframes fade-out-top {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateY(-50px);
      transform: translateY(-50px);
      opacity: 0;
    }
  }

  @-webkit-keyframes scale-up-center {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
  }

  @keyframes scale-up-center {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }
  }

  @-webkit-keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes fade-in-top {
    0% {
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      opacity: 1;
    }
  }

</style>
