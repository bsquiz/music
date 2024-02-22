<script setup lang="ts">
import {onMounted, ref, defineProps, defineExpose} from "vue";

const canvas = ref('canvas');
let ctx = {};

const props = defineProps({
    mode: {
        type: String,
        default: 'wave'
    },
    width: {
        type: Number,
        default: 500
    },
    height: {
        type: Number,
        default: 400
    },
    data: {
        type: Object,
        default: () => {
            return {};
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

function draw(ctx, dataArray, bufferLength) {
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
    draw(ctx, props.data, props.bufferLength);

}

defineExpose({
    update
});

onMounted(() => {
    ctx = canvas.value.getContext('2d');

    ctx.strokeStyle = 'hsla(160, 100%, 37%, 1)';
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
