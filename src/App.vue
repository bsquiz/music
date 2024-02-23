<script setup lang="ts">
import {onMounted, ref} from "vue";
import type {SongEvent, SongType} from "./types.ts";
import SongControls from './components/SongControls.vue';
import SongVisualizer from "./components/SongVisualizer.vue";
import {FFT_SIZE} from "./constants";

let playing: boolean = true;
let audioCtx: AudioContext;
let analyser: AnalyserNode;
let source: AudioNode;

const currentSong = ref<string>();
const visualizer = ref<InstanceType<typeof SongVisualizer>>();
const songs = ref<SongType[]>([{
        title: '地球の中の城',
        fileName: '地球の中の城',
        id: '',
        source: null
    },{
        title: 'beet',
        fileName: 'beet',
        id: '',
        source: null
    },{
        title: 'chungus',
        fileName: 'chungus',
        id: '',
        source: null
    },{
        title: 'plumbus',
        fileName: 'plumbus',
        id: '',
        source: null
    },{
        title: 'こんにちは',
        fileName: 'こんにちは',
        id: '',
        source: null
}]);
const currentSongTimes = ref<number[]>([]);
const dataArray = ref<Uint8Array>(new Uint8Array(FFT_SIZE));
const bufferLength = ref<number>(0);
const totalSongTimes = ref<number[]>([]);

function update() {
    analyser.getByteTimeDomainData(dataArray.value);

    if (visualizer.value) {
        visualizer.value.update();
    }

    if (playing) {
        window.requestAnimationFrame(update);
    }
}

function playSong(e: object) {
    let playSong: HTMLAudioElement | null = null;
    let streamable: any;
    const payload = e as SongEvent;
    const fileName: string = payload.fileName;

    songs.value.forEach((song: SongType) => {
        const source: HTMLAudioElement = song.source as HTMLAudioElement;

        source.pause();

        if (song.fileName === fileName) {
            playSong = song.source;
            currentSong.value = song.title;
        }
    });

    if (!playSong) {
        return;
    }

    // cast as 'any' type because captureStream isn't yet standard on Audio elements
    streamable = playSong as any;

    streamable.play();

    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaStreamSource(streamable.captureStream());
    source.connect(analyser);

    analyser.fftSize = FFT_SIZE;
    bufferLength.value = analyser.frequencyBinCount;
    dataArray.value = new Uint8Array(bufferLength.value);

    update();
}

function pauseSong(e: object) {
    const payload = e as SongEvent;
    const fileName: string = payload.fileName;
    const song: SongType | undefined = songs.value.find(song => song.fileName === fileName);

    if (song) {
        const source: HTMLAudioElement = song.source as HTMLAudioElement;

        source.pause();
    }

    return song;
}

function stopSong(e: object) {
    const payload = e as SongEvent;
    const song: SongType | undefined = pauseSong(payload);

    if (song) {
        const source: HTMLAudioElement = song.source as HTMLAudioElement;

        source.currentTime = 0;
    }
}

function updateTime(e: Event) {
    const target: HTMLAudioElement = e.target as HTMLAudioElement;
    const id: string = target.id;
    const currentTime: number = target.currentTime;

    currentSongTimes.value.splice(Number(id), 1, currentTime);
}

onMounted(() => {
   let index = 0;
   songs.value.forEach(song => {
       song.source = new Audio(`./${song.fileName}.mp3`);
       song.source.id = `${index}`;
       song.source.addEventListener('timeupdate', updateTime);
       song.source.addEventListener('canplay', (e) => {
           const target: HTMLAudioElement = e.currentTarget as HTMLAudioElement;

           totalSongTimes.value.splice(Number(target.id), 1, target.duration);
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
