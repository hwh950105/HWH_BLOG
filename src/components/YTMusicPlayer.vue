<template>
  <el-container class="music-player">
    <el-main>
      <el-image></el-image>
      <div id="player"></div>
      <el-card class="thumbnail" @click="openPopup">
        <el-image :src="musicImageSrc" alt="음악 이미지" class="music-image" />
      </el-card>
      <el-row class="music-info" justify="center">
        <h3>{{ musicTitle }}</h3>
        <p>{{ musicArtist }}</p>
      </el-row>
      <el-row class="controls" v-show="ready" justify="space-between">
        <el-image
          class="controls__btn"
          @click="prev"
          src="/images/prev.svg"
          alt="이전"
        />
        <el-image
          class="controls__btn pause"
          v-show="playing"
          src="/images/pause.svg"
          alt="일시정지"
          @click="pause"
        />
        <el-image
          class="controls__btn play"
          v-show="!playing"
          src="images/play.svg"
          alt="재생"
          @click="play"
        />
        <el-image
          class="controls__btn"
          @click="next"
          src="images/next.svg"
          alt="다음"
        />
      </el-row>
      <el-row class="volume" v-if="ready" align="middle">
        <el-button class="btn" @click.stop="showSlider = !showSlider" circle>
          <el-image
            src="images/volume-mute.svg"
            v-show="volume == 0"
          />
          <el-image
            src="images/volume-min.svg"
            v-show="0 < volume && volume < 33"
          />
          <el-image
            src="images/volume-mid.svg"
            v-show="33 <= volume && volume < 66"
          />
          <el-image
            src="images/volume-max.svg"
            v-show="66 <= volume && volume <= 100"
          />
        </el-button>
        <VueSlider
          v-model="volume"
          v-show="showSlider"
          @click.self.stop
          class="volume-slider"
        />
      </el-row>
    </el-main>
    <el-dialog v-model="showPopup" width="50%" :before-close="closePopup">
      <div slot="title">Playlist</div>
      <div id="popup-player"></div>
      <el-scrollbar class="playlist">
        <el-row
          v-for="(video, index) in playlist"
          :key="index"
          class="playlist-item"
          @click="playVideoFromPlaylist(video.videoId)"
        >
          <el-image :src="video.thumbnail" alt="썸네일" />
          <div>
            <h4>{{ video.title }}</h4>
            <p>{{ video.artist }}</p>
          </div>
        </el-row>
      </el-scrollbar>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import VueSlider from "@vueform/slider";
import "@vueform/slider/themes/default.css";

const PLAYLIST_ID = "PLxdMLh2pGgVX2ZsdIQbkC_zwbnKqnt0fh";

const volume = ref(50);
const playing = ref(false);
const ready = ref(false);
const showSlider = ref(false);
const showPopup = ref(false);
const musicImageSrc = ref("");
const musicTitle = ref("");
const musicArtist = ref("");
const playlist = ref([]);
let player = null;
let popupPlayer = null;
let currentVideoIndex = 0;

function onPlayerReady(event) {
  ready.value = true;
}

function onPopupPlayerReady(event) {
  const playlistData = popupPlayer.getPlaylist();
  const newPlaylist = [];
  for (let i = 0; i < playlistData.length; i++) {
    const videoId = playlistData[i];
    popupPlayer.loadVideoById(videoId);
    setTimeout(() => {
      const videoData = popupPlayer.getVideoData();
      newPlaylist.push({
        videoId,
        title: videoData.title,
        artist: videoData.author,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      });
      if (i === playlistData.length - 1) {
        playlist.value = newPlaylist;
      }
    }, 1000 * i);
  }
}

function onPlayerStateChange(event) {
  playing.value = event.data == YT.PlayerState.PLAYING;

  if (
    event.data == YT.PlayerState.PLAYING ||
    event.data == YT.PlayerState.BUFFERING
  ) {
    const videoData = player.getVideoData();
    musicTitle.value = videoData.title;
    musicArtist.value = videoData.author;
    musicImageSrc.value = `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`;
  }
}

function play() {
  player?.playVideo();
}

function pause() {
  player?.pauseVideo();
}

function prev() {
  if (currentVideoIndex > 0) {
    currentVideoIndex -= 1;
    player?.previousVideo();
  }
}

function next() {
  currentVideoIndex += 1;
  player?.nextVideo();
}

watch(volume, () => {
  player?.setVolume(parseInt(volume.value));
});

function loadYouTubeIframeAPI() {
  return new Promise((resolve) => {
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => resolve(YT);
    } else {
      resolve(YT);
    }
  });
}

function openPopup() {
  loadPopupPlayer();
}

function closePopup() {
  showPopup.value = false;
  popupPlayer?.destroy();
  popupPlayer = null;
}

function loadPopupPlayer() {
  if (!YT || !YT.Player) {
    console.error("YouTube API 로드 실패");
    return;
  }

  popupPlayer = new YT.Player("popup-player", {
    height: "200",
    width: "300",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 1,
      rel: 0,
      playsinline: 1,
      modestbranding: 1,
      frameborder: "no",
    },
    events: {
      onReady: onPopupPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function playVideoFromPlaylist(videoId) {
  popupPlayer?.loadVideoById(videoId);
}

onMounted(async () => {
  const YT = await loadYouTubeIframeAPI();

  player = new YT.Player("player", {
    height: "0",
    width: "0",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1,
      modestbranding: 1,
      frameborder: "no",
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });

  window.addEventListener("click", () => {
    showSlider.value = false;
  });
});

onBeforeUnmount(() => {
  player?.destroy();
  popupPlayer?.destroy();
});
</script>

<style scoped>
.music-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  margin: 20px auto;
  color: #ffffff;
  position: relative;
}

.music-player .thumbnail {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffcc00;
  margin-bottom: 15px;
  position: relative;
}

.music-player .thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.music-player .music-info {
  text-align: center;
  margin-bottom: 20px;
}

.music-player .music-info h3 {
  font-size: 1.4em;
  margin: 5px 0;
  font-weight: 600;
}

.music-player .music-info p {
  font-size: 1em;
  margin: 5px 0;
  color: #d4d4d4;
}

.music-player .controls {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin: 20px 0;
}

.music-player .controls__btn {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.music-player .controls__btn:hover {
  transform: scale(1.2);
}

.music-player .controls__btn:active {
  opacity: 0.7;
}

.music-player .volume {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
}

.music-player .volume .btn {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.music-player .volume-slider {
  width: 120px;
}

.music-player .status {
  position: absolute;
  top: -10px;
  left: 10px;
  background-color: #ff4d4d;
  color: #ffffff;
  padding: 4px 8px;
  font-size: 0.8em;
  border-radius: 4px;
  font-weight: bold;
}

.el-dialog .playlist {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  background-color: #282828;
  border-radius: 5px;
}

.el-dialog .playlist-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #444;
  cursor: pointer;
  transition: background-color 0.3s;
}

.el-dialog .playlist-item:hover {
  background-color: #333333;
}

.el-dialog .playlist-item img {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
}

.el-dialog .playlist-item h4 {
  font-size: 1.1em;
  margin: 0;
  font-weight: bold;
}

.el-dialog .playlist-item p {
  font-size: 0.9em;
  margin: 0;
  color: #bbbbbb;
}



</style>
