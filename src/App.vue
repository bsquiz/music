<script setup lang="ts">
import {onMounted, ref} from "vue";
import type { SongType } from "@/SongType";
import SongControls from './components/SongControls.vue';
import SongVisualizer from "@/components/SongVisualizer.vue";

const FFT_SIZE = 128;
let playing = true;
let audioCtx;
let analyser;
let source;

const currentSong = ref();
const visualizer =ref(null);
const songs = ref<SongType>([{
        title: '地球の中の城',
        fileName: '地球の中の城',
        id: '',
        source: {}
    },{
        title: 'beet',
        fileName: 'beet',
        id: '',
        source: {}
    },{
        title: 'chungus',
        fileName: 'chungus',
        id: '',
        source: {}
    },{
        title: 'plumbus',
        fileName: 'plumbus',
        id: '',
        source: {}
    },{
        title: 'こんにちは',
        fileName: 'こんにちは',
        id: '',
        source: {}
}]);
const currentSongTimes = ref([]);
const dataArray = ref([]);
const bufferLength = ref(0);
const totalSongTimes = ref([]);

function update() {
    analyser.getByteTimeDomainData(dataArray.value);
    visualizer.value.update();

    if (playing) {
        window.requestAnimationFrame(update);
    }
}

function playSong(fileName) {
    let playSong;

    songs.value.forEach(song => {
        song.source.pause();

        if (song.fileName === fileName) {
            playSong = song;
            currentSong.value = song.title;
        }
    });

    playSong.source.play();

    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaStreamSource(playSong.source.captureStream());
    source.connect(analyser);

    analyser.fftSize = FFT_SIZE;
    bufferLength.value = analyser.frequencyBinCount;
    dataArray.value = new Uint8Array(bufferLength.value);

    update();
}

function pauseSong(fileName) {
    const song = songs.value.find(song => song.fileName === fileName);

    song.source.pause();

    return song;
}

function stopSong(fileName) {
    const song = pauseSong(fileName);

    song.source.currentTime = 0;
}
function updateTime(e) {
     const { target } = e;
     const { id, currentTime } = target;
    currentSongTimes.value.splice(Number(id), 1, currentTime);
}
onMounted(() => {
   let index = 0;
   songs.value.forEach(song => {
       song.source = new Audio(`./${song.fileName}.mp3`);
       song.source.id = index;
       song.source.addEventListener('timeupdate', updateTime);
       song.source.addEventListener('canplay', (e) => {
           totalSongTimes.value.splice(Number(e.currentTarget.id), 1, e.currentTarget.duration);
       });

       totalSongTimes.value.push(0);
       currentSongTimes.value.push(0);
       index++;
   });
});
</script>

<template>
<div class="d-flex-md flex-reverse">
    <div class="ml-3-md mb-3-sm">
        <div class="font-lg green">{{ currentSong }}</div>
        <SongVisualizer
            ref="visualizer"
            class="d-block"
            :data="dataArray"
            :bufferLength="bufferLength"
            :fftSize="FFT_SIZE"
        />
    </div>

    <div class="songs">
        <ul>
            <li v-for="(song, index) in songs" :key="`song_${index}`" class="border-top">
                <SongControls
                    @songplay="playSong"
                    @songpause="pauseSong"
                    @songstop="stopSong"
                    :key="`song_${index}`"
                    :fileName="song.fileName"
                    :title="song.title"
                    :totalSongTime="totalSongTimes[index]"
                    :currentSongTime="currentSongTimes[index]"
                />
            </li>
        </ul>
    </div>
</div>

</template>

<style scoped>
.songs {
    height: 400px;
    overflow: auto;
}
.songs ul {
    padding: 0;
}
.songs li {
    list-style-type: none;
}
</style>
