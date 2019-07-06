<script lang="ts">
  import Vue from 'vue';
  import UploadedFileEntry from '@/components/uploaded-file-entry.vue';
  import { animate } from '@/utils/animate';

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
      started: false,
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
      }
    },

    methods: {
      dragOver(e: DragEvent) {
        this.dragged = true;
        this.showDrops = true;

        this.mouse = {
          x: e.pageX,
          y: e.pageY,
        };

        const target = e.target as Element;
        console.log('target', target)
        const droppedOnCircle = this.circle && (e.target === this.circle || this.circle.contains(target));
        console.log('drp on circle', this.circle)

        const distance = Math.min(distanceToPoint(this.circle, this.mouse.x, this.mouse.y), 1) / 200;

        if (droppedOnCircle) {
          if (!this.started) {
            this.currentDistance = 0;
            this.startAnimation(this.currentDistance, 12, 300);
            this.started = true;
          }
        } else {
          this.currentDistance = distance * 12;
          this.setPathData(this.currentDistance);
          this.started = false;
        }
      },

      dragEnd() {
        this.startAnimation(this.currentDistance, 12, 400);
      },

      dragLeave() {
        this.startAnimation(this.currentDistance, 12, 400);
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
          await this.startAnimation(this.currentDistance, 18, 100);
          this.showDrops = false;

          await waitFor(200);
          await this.startAnimation(18, 12, 300);
          await waitFor(100);

          this.show = true;
          await waitFor(800);
        }
      },

      startAnimation(from: number, to: number, duration: number) {
        return animate(from, to, duration, (currentValue: number) => {
          this.setPathData(currentValue);
        });
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
      @dragend.prevent="dragEnd"
      @dragleave.prevent="dragLeave"
      @dragover.prevent="dragOver"
      @drag.prevent
      @drop.prevent="drop"
    >
      <nav>
        <svg>
          <use xlink:href="#logo"/>
        </svg>
        <ul>
          <li class="active">
            <a href>Recent uploads</a>
          </li>
          <li>
            <a href>Watched folders</a>
          </li>
        </ul>
        <ul>
          <li>
            <a href>
              <i data-eva="cloud-upload-outline"></i>
            </a>
          </li>
          <li>
            <a href>
              <i data-eva="settings-outline"></i>
            </a>
          </li>
        </ul>
      </nav>
      <div class="intro">
        <h4>No recent files</h4>
        <p>Drag &amp; Drop to upload or create a new watch folder for Auto-upload</p>
      </div>
      <div class="center">
        <div>
          <span>Upload</span>
          <div class="circle">
            <svg
              viewBox="0 0 92 92"
              fill="currentColor"
            >
              <path
                d="M46,80 C55.3966448,80 63.9029705,76.1880913 70.0569683,70.0262831 C76.2007441,63.8747097 80,55.3810367 80,46 C80,36.6003571 76.1856584,28.0916013 70.0203842,21.9371418 C63.8692805,15.7968278 55.3780386, 12 46, 12 C36.596754, 12 28.0850784,15.8172663 21.9300655,21.9867066 C15.7939108,28.1372443 12,36.6255645 12,46 C12,55.4035343 15.8175004,63.9154436 21.9872741,70.0705007 C28.1377665,76.2063225 36.6258528,80 46,80 Z"
              />
            </svg>
          </div>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M5.2319,10.6401 C5.5859,11.0641 6.2159,11.1221 6.6399,10.7681 L10.9999,7.1351 L10.9999,19.0001 C10.9999,19.5521 11.4479,20.0001 11.9999,20.0001 C12.5519,20.0001 12.9999,19.5521 12.9999,19.0001 L12.9999,7.1351 L17.3599,10.7681 C17.7849,11.1221 18.4149,11.0641 18.7679,10.6401 C19.1219,10.2161 19.0649,9.5851 18.6399,9.2321 L12.6399,4.2321 C12.5929,4.1921 12.5369,4.1731 12.4849,4.1431 C12.4439,4.1191 12.4079,4.0911 12.3629,4.0731 C12.2459,4.0271 12.1239,4.0001 11.9999,4.0001 C11.8759,4.0001 11.7539,4.0271 11.6369,4.0731 C11.5919,4.0911 11.5559,4.1191 11.5149,4.1431 C11.4629,4.1731 11.4069,4.1921 11.3599,4.2321 L5.3599,9.2321 C4.9359,9.5851 4.8779,10.2161 5.2319,10.6401"
            />
          </svg>
        </div>
      </div>
      <div class="hint">Drop your files to upload</div>
      <ul class="list">
        <uploaded-file-entry
          v-if="show === true"
          v-for="file in files"
          :file="file"
        ></uploaded-file-entry>
      </ul>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style="display: none;"
    >
      <symbol
        id="logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M0.879787868,0.0248590022 C0.741480414,0.0254663774 0.601464378,0.058308026 0.470823634,0.126854664 L0.470823634,0.126854664 C0.0390783178,0.353275488 -0.12560262,0.883253796 0.102996777,1.31071584 L0.102996777,1.31071584 C1.55958412,4.03509761 2.28748351,7.0237744 2.2870016,10.0124078 L2.2870016,10.0124078 C2.28748351,13.0010412 1.55958412,15.9897614 0.102996777,18.7140564 L0.102996777,18.7140564 C-0.12560262,19.1415618 0.0390783178,19.6716269 0.470823634,19.8979176 L0.470823634,19.8979176 C0.601771047,19.9666377 0.742356609,19.9995228 0.880970732,20 L0.880970732,20 L0.886666003,20 C1.20275352,19.9990889 1.50802002,19.8298482 1.66630473,19.5337093 L1.66630473,19.5337093 C3.25861475,16.5555748 4.05507643,13.2887202 4.05608406,10.021692 L4.05608406,10.021692 L4.05621549,10.021692 C4.05621549,10.0185683 4.05617168,10.0154881 4.05617168,10.0124078 L4.05617168,10.0124078 C4.05617168,10.0093275 4.05621549,10.0062039 4.05621549,10.0031236 L4.05621549,10.0031236 L4.05608406,10.0031236 C4.05507643,6.73605206 3.25861475,3.4691974 1.66630473,0.491106291 L1.66630473,0.491106291 C1.50828288,0.195531453 1.20362971,0.0263774403 0.888111725,0.0248590022 L0.888111725,0.0248590022 L0.879787868,0.0248590022 Z M5.53448867,2.19370933 C5.08316038,2.37887202 4.86888678,2.89119306 5.05577927,3.33804772 L5.05577927,3.33804772 C5.94419767,5.46195228 6.39504405,7.70438178 6.39587643,10.0031236 L6.39587643,10.0031236 L6.39583262,10.0031236 C6.39583262,10.0062039 6.39587643,10.0093275 6.39592024,10.0124078 L6.39592024,10.0124078 C6.39587643,10.0154881 6.39583262,10.0185683 6.39583262,10.021692 L6.39583262,10.021692 L6.39587643,10.021692 C6.39504405,12.3204338 5.94419767,14.5629067 5.05577927,16.6867679 L5.05577927,16.6867679 C4.86888678,17.1336659 5.08316038,17.645987 5.53448867,17.8311497 L5.53448867,17.8311497 C5.98572933,18.0160087 6.50316657,17.8039913 6.69010287,17.3570933 L6.69010287,17.3570933 C7.66863797,15.0176573 8.16482746,12.5475488 8.16482746,10.0153145 L8.16482746,10.0153145 C8.16482746,10.0143167 8.16478365,10.0134056 8.16478365,10.0124078 L8.16478365,10.0124078 C8.16478365,10.0114534 8.16482746,10.0104555 8.16482746,10.0095445 L8.16482746,10.0095445 C8.16482746,7.4773102 7.66863797,5.00711497 6.69010287,2.66776573 L6.69010287,2.66776573 C6.5490354,2.33041215 6.2195859,2.12689805 5.87248107,2.12689805 L5.87248107,2.12689805 C5.75975852,2.12689805 5.64515216,2.1483731 5.53448867,2.19370933 L5.53448867,2.19370933 Z M10.513338,4.60355748 C10.0383086,4.7164859 9.74570313,5.18932755 9.85978378,5.65969631 L9.85978378,5.65969631 C10.2050048,7.08347072 10.3773086,8.54793926 10.3770896,10.0124078 L10.3770896,10.0124078 C10.3773086,11.4768764 10.2050048,12.9413449 9.85978378,14.3651627 L9.85978378,14.3651627 C9.74570313,14.8355315 10.0383086,15.3083731 10.513338,15.4212581 L10.513338,15.4212581 C10.9882797,15.5341866 11.4657186,15.2444252 11.5797555,14.7740564 L11.5797555,14.7740564 C11.9566948,13.2195662 12.1451644,11.6206074 12.1456901,10.021692 L12.1456901,10.021692 L12.1458216,10.021692 C12.1458216,10.0185683 12.1457778,10.0154881 12.1457778,10.0124078 L12.1457778,10.0124078 C12.1457778,10.0093275 12.1458216,10.0062039 12.1458216,10.0031236 L12.1458216,10.0031236 L12.1456901,10.0031236 C12.1451644,8.40416486 11.9566948,6.80529284 11.5797555,5.25075922 L11.5797555,5.25075922 C11.4824102,4.84915401 11.1200157,4.5791757 10.7205582,4.57913232 L10.7205582,4.57913232 C10.6521712,4.57913232 10.5827765,4.5870282 10.513338,4.60355748 L10.513338,4.60355748 Z M14.7287582,7.15986985 C14.2709899,7.24555315 13.9538947,7.71154013 14.0220189,8.16793926 L14.0220189,8.16793926 C14.1130118,8.77739696 14.1555073,9.3905423 14.1501187,10.0031236 L14.1501187,10.0031236 C14.1501187,10.0062039 14.1500749,10.0093275 14.1501187,10.0124078 L14.1501187,10.0124078 C14.1500749,10.0154881 14.1501187,10.0185683 14.1501187,10.021692 L14.1501187,10.021692 C14.1555073,10.6343601 14.1130118,11.247462 14.0220189,11.8568764 L14.0220189,11.8568764 C13.9522738,12.3243384 14.2598622,12.77718 14.7287582,12.8649458 L14.7287582,12.8649458 C15.2247286,12.9578308 15.6948513,12.623731 15.7688022,12.134013 L15.7688022,12.134013 C15.8746028,11.432538 15.9246336,10.7268547 15.9192888,10.021692 L15.9192888,10.021692 C15.9193326,10.0185683 15.919245,10.0154881 15.9192888,10.0124078 L15.9192888,10.0124078 C15.919245,10.0093275 15.9193326,10.0062039 15.9192888,10.0031236 L15.9192888,10.0031236 C15.9246336,9.29796095 15.8746028,8.59227766 15.7688022,7.89084599 L15.7688022,7.89084599 C15.703219,7.45631236 15.3257102,7.14438178 14.8950601,7.14433839 L14.8950601,7.14433839 C14.8402979,7.14433839 14.7847033,7.14941432 14.7287582,7.15986985 L14.7287582,7.15986985 Z M17.6553387,10.021692 C17.6553387,10.5727549 18.1064917,11.0195228 18.6629634,11.0195228 L18.6629634,11.0195228 C19.2194352,11.0195228 19.6705882,10.5727549 19.6705882,10.021692 L19.6705882,10.021692 C19.6705882,9.47058568 19.2194352,9.02386117 18.6629634,9.02386117 L18.6629634,9.02386117 C18.1064917,9.02386117 17.6553387,9.47058568 17.6553387,10.021692 L17.6553387,10.021692 Z"
        ></path>
      </symbol>
    </svg>
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

    nav {
      border-bottom: 1px solid var(--lighter);
      display: flex;
      align-items: center;
      padding: 0 16px;

      & > svg {
        display: block;
        margin-right: 16px;
        width: 20px;
        height: 20px;
        color: var(--grey-light);
      }

      ul {
        display: flex;

        &:last-child {
          margin-left: auto;
        }

        li {
          margin-bottom: -1px;

          &:not(:last-child) {
            margin-right: 16px;
          }

          a {
            display: block;
            font-weight: 500;
            font-size: 12px;
            line-height: 21px;
            color: var(--grey-light);
            text-decoration: none;
            padding: 12px 0 11px 0;
            border-bottom: 1px solid transparent;

            svg {
              width: 21px;
              height: 21px;
              display: block;
            }
          }

          &.active {
            a {
              color: var(--primary);
              border-color: var(--primary);
            }
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
</style>
