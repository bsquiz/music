<script setup lang="ts">
import {watch, ref, defineEmits, defineProps} from "vue";

const progressBar = ref(null);
const ballPosition = ref(0);
const ballStyle = ref('');
const props = defineProps({
    fileName: {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true
    },
    totalSongTime: {
        type: Number,
        default: 0
    },
    currentSongTime: {
        type: Number,
        default: 0
    }
});
const songTimeFormatted = function(time: number) {
    const minutes = (time / 60).toFixed(0);
    const seconds = (time % 60).toFixed(0);

    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

defineEmits<{
    (e: 'songplay', val: object): void;
    (e: 'songpause', val: object): void;
    (e: 'songstop', val: object): void;
}>();

watch(
    () => props.currentSongTime,
    (val: number) => {
        const barWidth = (progressBar?.value?.offsetWidth || 0).toFixed(0);
        const timeRatio = val / props.totalSongTime;

        ballPosition.value = barWidth * timeRatio;
        ballStyle.value = `left: ${Number(ballPosition.value).toFixed(0)}px;`;
    }
)
</script>

<template>

        <div class="controls gray-bkg p-2">
            <div class="mb-1" data-test="title">{{ title }}</div>
            <div>
                <div ref="progressBar" class="progress-bar" data-test="progress-bar"></div>
            </div>
            <div class="ball" :style="ballStyle" data-test="progress-ball"></div>

            <div class="font-sm timestamp">
                <span data-test="song-current-time">{{ songTimeFormatted(currentSongTime) }}</span>
                <span> / </span>
                <span data-test="song-total-time">{{ songTimeFormatted(totalSongTime) }}</span>
            </div>

            <div class="d-flex mt-2">
                <button class="button light-gray-bkg" data-test="song-play-control" @click="$emit('songplay', fileName)">&blacktriangleright;</button>
                <button class="button light-gray-bkg" data-test="song-pause-control" @click="$emit('songpause', fileName)">&Verbar;</button>
                <button class="button light-gray-bkg" data-test="song-stop-control" @click="$emit('songstop', fileName)">&FilledSmallSquare;</button>
            </div>
        </div>

</template>

<style scoped>
.button {
    width: 25px;
    height: 25px;
}

.ball {
    background-color: gray;
    border-radius: 10px;
    width: 10px;
    height: 10px;
    position: relative;
    top: -7px;
}
.timestamp {
    line-height: 0.9em;
}
.progress-bar {
    background: black;
    height: 4px;
}


@media (max-width: 800px) {
    .button {
        width: 33%;
        height: 100px;
    }
}
</style>
