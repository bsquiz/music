export type SongType = {
    title: string;
    fileName: string;
    id: string;
    source: HTMLAudioElement | null;
};

export type SongEvent = {
    fileName: string;
};
