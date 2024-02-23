<script setup lang="ts">
import {onMounted, ref, defineProps, defineExpose} from "vue";
import {GraphType, VisualizerDimension, FFT_SIZE} from "../constants";

const canvas = ref<InstanceType<typeof HTMLCanvasElement>>();
let ctx: CanvasRenderingContext2D | null;

const props = defineProps({
    mode: {
        type: String,
        default: GraphType.WAVE
    },
    width: {
        type: Number,
        default: VisualizerDimension.WIDTH
    },
    height: {
        type: Number,
        default: VisualizerDimension.HEIGHT
    },
    data: {
        type: Uint8Array,
        default: () => {
            return new Uint8Array(FFT_SIZE);
        }
    },
    bufferLength: {
        type: Number,
        required: true
    },
    fftSize: {
        type: Number,
        required: true
    }
});

function draw(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, bufferLength: number) {
    ctx.clearRect(0, 0, props.width, props.height);

    ctx.lineWidth = 2;
    ctx.beginPath();

    const sliceWidth = props.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / props.fftSize;
        const y = v * (props.height / 2);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(props.width, props.height / 2);
    ctx.stroke();
}

function update() {
    if (ctx) {
        draw(ctx, props.data, props.bufferLength);
    }
}

defineExpose({
    update
});

onMounted(() => {
    if (canvas.value) {
        ctx = canvas.value.getContext('2d');

        if (ctx) {
            ctx.strokeStyle = 'hsla(160, 100%, 37%, 1)';
        }
    }
});
</script>

<template>
    <canvas ref="canvas" :width="width" :height="height" data-test="visualizer-canvas"></canvas>
</template>

<style scoped>
canvas {
    border: solid thin rgb(49 53 55);
    width: 100%;
}
</style>
