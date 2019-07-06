<script lang="ts">
  import Vue from 'vue';
  import { bytesToSize } from '@/utils/math';
  import { animate } from '@/utils/animate';
  import { readFile } from '@/utils/read-file';

  export default Vue.extend({
    name: 'uploaded-file-entry',
    props: ['file'],

    data: () => ({
      loadedPercent: 0,
      fileContents: null as any,
    }),

    watch: {
      async file(newFile: any) {
        if (!newFile) {
          return;
        }

        this.fileContents = await readFile(newFile);
      }
    },

    computed: {
      fileName(): string {
        return this.file.name;
      },
      fileSize(): string {
        return bytesToSize(this.file.size);
      },
      pieStyles(): any {
        return {
          strokeDasharray: (this.loadedPercent * 2 * Math.PI * 8 / 100) + ' ' + 2 * Math.PI * 8,
        };
      },
    },

    async mounted() {
      this.fileContents = await readFile(this.file);
      await animate(0, 100, 1200, (currentValue: number) => {
        this.loadedPercent = currentValue;
      });
    }
  });
</script>

<template>
  <li>
    <img
      :src="fileContents"
      :file="file"
    />
    <div class="text">
      <strong>{{fileName}}</strong>
      <small>{{fileSize}}</small>
    </div>
    <div
      class="progress"
      :class="{complete: this.loadedPercent >= 100}"
    >
      <svg
        class="pie"
        width="32"
        height="32"
        :style="pieStyles"
      >
        <circle
          r="8"
          cx="16"
          cy="16"
        ></circle>
      </svg>
      <svg
        class="tick"
        viewBox="0 0 24 24"
      >
        <polyline points="18,7 11,16 6,12"></polyline>
      </svg>
    </div>
  </li>
</template>

<style lang="scss">
  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    &.list {
      li {
        --y: 8px;
        padding: 16px;
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateY(var(--y));
        transition: opacity .4s ease, transform .4s ease;

        &:not(:first-child) {
          border-top: 1px solid var(--lighter);
        }

        $i: 1;
        $delay: .16;
        @while $i <= 5 {
          $delay: $delay + .08;
          &:nth-child(#{$i}) {
            transition-delay: #{$delay}s;
          }
          $i: $i + 1;
        }

        img {
          border-radius: 5px;
          width: 84px;
          height: 48px;
          object-fit: cover;
          margin-right: 12px;
          box-shadow: 0 4px 12px var(--shadow);
        }

        .text {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;

          strong {
            display: block;
            font-size: 16px;
            font-weight: 500;
            color: var(--grey-dark);
            margin-bottom: 4px;
          }

          small {
            display: block;
            color: var(--grey-light);
            font-size: 14px;
          }
        }

        .progress {
          margin-left: auto;
          border-radius: 50%;
          background: var(--light);
          position: relative;

          &:before {
            --s: 1;
            content: '';
            width: 28px;
            height: 28px;
            left: 50%;
            top: 50%;
            z-index: 1;
            position: absolute;
            background: #fff;
            border-radius: inherit;
            transform: translate(-50%, -50%) scale(var(--s));
            transition: transform .32s ease;
          }

          svg {
            display: block;
            fill: none;

            &.pie {
              --s: 1;
              width: 32px;
              height: 32px;
              transform: rotate(-90deg) scale(var(--s));
              transition: transform .5s ease;

              circle {
                stroke-width: 16;
                stroke: var(--primary);
              }
            }

            &.tick {
              width: 24px;
              height: 24px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              stroke-width: 3;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke: var(--primary);
              transition: stroke .3s ease .8s;

              polyline {
                stroke-dasharray: 18;
                stroke-dashoffset: 18;
                transition: stroke-dashoffset .4s ease .7s;
              }
            }
          }

          &.complete {
            background: none;

            &:before {
              --s: 0;
            }

            svg {
              &.pie {
                --s: .08;
                animation: tick .3s linear forwards .4s;
              }

              &.tick {
                stroke: var(--success);

                polyline {
                  stroke-dashoffset: 36;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
