<template>
  <el-container class="music-player">
    <el-main>
      <div id="player"></div>
      <div class="player-content">
        <!-- 앨범아트 섹션 -->
        <el-card class="thumbnail" @click="openPopup" :class="{ 'rotating': playing }">
          <el-image :src="musicImageSrc" alt="음악 이미지" class="music-image" />
        </el-card>

        <!-- 정보 & 컨트롤 섹션 -->
        <div class="control-section">
          <!-- 음악 정보 -->
          <el-row class="music-info" justify="center">
            <h3>{{ musicTitle || '재생 중인 곡이 없습니다' }}</h3>
            <p>{{ musicArtist || '아티스트' }}</p>
          </el-row>

          <!-- 프로그레스 바 -->
          <div class="progress-container" v-if="ready">
            <div class="time-info">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
            <el-slider
              v-model="progress"
              :max="100"
              @change="seekTo"
              class="progress-bar"
            />
          </div>

          <!-- 컨트롤 버튼 -->
          <el-row class="controls" v-show="ready" justify="space-between">
            <el-button
              class="control-btn"
              @click="prev"
              :disabled="currentVideoIndex <= 0"
              circle
            >
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            
            <el-button
              class="control-btn play-btn"
              @click="playing ? pause() : play()"
              circle
            >
              <el-icon>
                <VideoPause v-if="playing" />
                <CaretRight v-else />
              </el-icon>
            </el-button>

            <el-button
              class="control-btn"
              @click="next"
              circle
            >
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </el-row>

          <!-- 볼륨 컨트롤 -->
          <el-row class="volume" v-if="ready" align="middle">
            <el-button 
              class="volume-btn" 
              @click="toggleMute" 
              circle
            >
              <el-icon>
                <Mute v-if="volume === 0" />
                <VideoCamera v-else-if="volume < 50" />
                <Microphone v-else />
              </el-icon>
            </el-button>
            <el-slider
              v-model="volume"
              :max="100"
              class="volume-slider"
            />
          </el-row>
        </div>
      </div>
    </el-main>

    <!-- 플레이리스트 다이얼로그 -->
    <el-dialog 
      v-model="showPopup" 
      title="플레이리스트" 
      width="50%" 
      :before-close="closePopup"
      class="playlist-dialog"
    >
      <div id="popup-player"></div>
      <el-scrollbar class="playlist">
        <el-row
          v-for="(video, index) in playlist"
          :key="index"
          class="playlist-item"
          :class="{ 'active': currentVideoIndex === index }"
          @click="playVideoFromPlaylist(video.videoId, index)"
        >
          <el-image :src="video.thumbnail" alt="썸네일" />
          <div class="playlist-item-info">
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
import { ElMessage } from 'element-plus';
import {
  CaretRight,
  VideoPause,
  ArrowRight,
  ArrowLeft,
  Microphone,
  VideoCamera,
  Mute
} from '@element-plus/icons-vue'

const PLAYLIST_ID = "PLxdMLh2pGgVX2ZsdIQbkC_zwbnKqnt0fh";

// 상태 관리
const volume = ref(50);
const playing = ref(false);
const ready = ref(false);
const showPopup = ref(false);
const musicImageSrc = ref("");
const musicTitle = ref("");
const musicArtist = ref("");
const playlist = ref([]);
const currentTime = ref(0);
const duration = ref(0);
const progress = ref(0);
let player = null;
let popupPlayer = null;
let currentVideoIndex = ref(0);
let isApiLoaded = false;
let progressInterval = null;

// 시간 포맷 함수
function formatTime(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 프로그레스바 업데이트
function updateProgress() {
  if (!player || !playing.value) return;
  
  try {
    const currentTimeValue = player.getCurrentTime();
    const durationValue = player.getDuration();
    
    if (typeof currentTimeValue === 'number' && typeof durationValue === 'number') {
      currentTime.value = currentTimeValue;
      duration.value = durationValue;
      progress.value = (currentTimeValue / durationValue) * 100;
    }
  } catch (error) {
    console.error('프로그레스 업데이트 중 오류:', error);
  }
}

// 시간 이동
function seekTo(value) {
  if (!player) return;
  const seekTime = (value / 100) * duration.value;
  player.seekTo(seekTime);
}

// 음소거 토글
function toggleMute() {
  if (!player) return;
  if (volume.value === 0) {
    volume.value = 50;
  } else {
    volume.value = 0;
  }
}

function onPlayerReady(event) {
  ready.value = true;
  event.target.setVolume(volume.value);
  
  // 프로그레스바 업데이트 시작
  progressInterval = setInterval(updateProgress, 1000);

  // 첫 번째 곡 로드
  try {
    event.target.cuePlaylist({
      list: PLAYLIST_ID,
      listType: 'playlist',
      index: 0
    });

    // 첫 번째 곡 정보 가져오기 (약간의 지연 후)
    setTimeout(() => {
      const videoData = event.target.getVideoData();
      if (videoData && videoData.video_id) {
        musicTitle.value = videoData.title || '제목 없음';
        musicArtist.value = videoData.author || '작성자 없음';
        musicImageSrc.value = `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`;
      }
    }, 1000);
  } catch (error) {
    console.error('첫 번째 곡 로드 중 오류:', error);
    ElMessage.error('음악을 불러오는 중 오류가 발생했습니다.');
  }
}

function onPlayerStateChange(event) {
  if (!event || typeof event.data !== 'number') return;
  
  playing.value = event.data === YT.PlayerState.PLAYING;

  // 상태가 변경될 때마다 현재 곡 정보 업데이트
  try {
    const videoData = player?.getVideoData();
    if (videoData && videoData.video_id) {
      musicTitle.value = videoData.title || '제목 없음';
      musicArtist.value = videoData.author || '작성자 없음';
      musicImageSrc.value = `https://img.youtube.com/vi/${videoData.video_id}/hqdefault.jpg`;
    }
  } catch (error) {
    console.error('비디오 데이터 업데이트 중 오류:', error);
  }
}

function play() {
  if (!player) return;
  try {
    player.playVideo();
  } catch (error) {
    console.error('재생 중 오류:', error);
    ElMessage.error('재생 중 오류가 발생했습니다.');
  }
}

function pause() {
  if (!player) return;
  try {
    player.pauseVideo();
  } catch (error) {
    console.error('일시정지 중 오류:', error);
  }
}

function prev() {
  if (!player || currentVideoIndex.value <= 0) return;
  try {
    currentVideoIndex.value -= 1;
    player.previousVideo();
  } catch (error) {
    console.error('이전 곡 재생 중 오류:', error);
  }
}

function next() {
  if (!player) return;
  try {
    currentVideoIndex.value += 1;
    player.nextVideo();
  } catch (error) {
    console.error('다음 곡 재생 중 오류:', error);
  }
}

watch(volume, (newVolume) => {
  if (!player) return;
  try {
    player.setVolume(parseInt(newVolume));
  } catch (error) {
    console.error('볼륨 조절 중 오류:', error);
  }
});

function loadYouTubeIframeAPI() {
  return new Promise((resolve, reject) => {
    if (typeof YT !== "undefined" && YT.Player) {
      isApiLoaded = true;
      resolve(YT);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      isApiLoaded = true;
      resolve(YT);
    };

    // 10초 후에도 로드되지 않으면 에러
    setTimeout(() => {
      if (!isApiLoaded) {
        reject(new Error('YouTube API 로드 시간 초과'));
      }
    }, 10000);
  });
}

function openPopup() {
  showPopup.value = true;
  loadPopupPlayer();
}

function closePopup() {
  showPopup.value = false;
  if (popupPlayer) {
    try {
      popupPlayer.destroy();
      popupPlayer = null;
    } catch (error) {
      console.error('팝업 플레이어 제거 중 오류:', error);
    }
  }
}

function loadPopupPlayer() {
  if (!isApiLoaded) {
    ElMessage.error('YouTube API가 아직 로드되지 않았습니다.');
    return;
  }

  try {
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
  } catch (error) {
    console.error('팝업 플레이어 초기화 중 오류:', error);
    ElMessage.error('플레이어 초기화 중 오류가 발생했습니다.');
  }
}

function onPopupPlayerReady(event) {
  if (!popupPlayer) return;
  
  try {
    const playlistData = popupPlayer.getPlaylist();
    if (!playlistData) {
      ElMessage.error('플레이리스트를 불러올 수 없습니다.');
      return;
    }

    const newPlaylist = [];
    playlistData.forEach((videoId, index) => {
      popupPlayer.loadVideoById(videoId);
      setTimeout(() => {
        try {
          const videoData = popupPlayer.getVideoData();
          if (videoData) {
            newPlaylist.push({
              videoId,
              title: videoData.title || '제목 없음',
              artist: videoData.author || '작성자 없음',
              thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            });
          }
          if (index === playlistData.length - 1) {
            playlist.value = newPlaylist;
          }
        } catch (error) {
          console.error('비디오 데이터 로드 중 오류:', error);
        }
      }, 1000 * index);
    });
  } catch (error) {
    console.error('플레이리스트 로드 중 오류:', error);
    ElMessage.error('플레이리스트 로드 중 오류가 발생했습니다.');
  }
}

function playVideoFromPlaylist(videoId, index) {
  if (!popupPlayer) return;
  try {
    currentVideoIndex.value = index;
    popupPlayer.loadVideoById(videoId);
  } catch (error) {
    console.error('플레이리스트에서 비디오 재생 중 오류:', error);
  }
}

onMounted(async () => {
  try {
    await loadYouTubeIframeAPI();
    
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
        start: 0
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  } catch (error) {
    console.error('플레이어 초기화 중 오류:', error);
    ElMessage.error('음악 플레이어를 초기화하는 중 오류가 발생했습니다.');
  }
});

onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  if (player) {
    try {
      player.destroy();
    } catch (error) {
      console.error('플레이어 제거 중 오류:', error);
    }
  }
  if (popupPlayer) {
    try {
      popupPlayer.destroy();
    } catch (error) {
      console.error('팝업 플레이어 제거 중 오류:', error);
    }
  }
});

// 키보드 단축키
function handleKeyPress(event) {
  if (!ready.value) return;

  switch(event.code) {
    case 'Space':
      event.preventDefault();
      playing.value ? pause() : play();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      prev();
      break;
    case 'ArrowRight':
      event.preventDefault();
      next();
      break;
    case 'ArrowUp':
      event.preventDefault();
      volume.value = Math.min(100, volume.value + 5);
      break;
    case 'ArrowDown':
      event.preventDefault();
      volume.value = Math.max(0, volume.value - 5);
      break;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.music-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 200px;
  min-height: 280px;
  margin: 0 auto;
  color: #ffffff;
  position: relative;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.player-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 8px;
  overflow: hidden;
}

.music-info {
  text-align: center;
  width: 100%;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.music-info h3 {
  font-size: 0.9rem;
  margin: 2px 0;
  font-weight: 600;
  color: #ffcc00;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  padding: 0 5px;
}

.music-info p {
  font-size: 0.75rem;
  margin: 2px 0;
  color: #d4d4d4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  padding: 0 5px;
}

.thumbnail {
  width: 100px;
  height: 100px;
  min-height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffcc00;
  margin-bottom: 8px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 204, 0, 0.2);
  flex-shrink: 0;
}

.thumbnail .music-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.control-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: 150px;
}

.rotating {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 204, 0, 0.3);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 8px 0;
}

.control-btn, .play-btn, .volume-btn {
  --el-button-size: 30px;
  width: 30px;
  height: 30px;
  padding: 0;
}

.control-btn :deep(.el-icon),
.play-btn :deep(.el-icon),
.volume-btn :deep(.el-icon) {
  font-size: 16px;
}

.volume {
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 90%;
  margin: 0 auto;
}

:deep(.progress-bar.el-slider),
:deep(.volume-slider.el-slider) {
  --el-slider-height: 3px;
  --el-slider-button-size: 10px;
  --el-slider-button-wrapper-size: 16px;
  width: 90%;
  margin: 0 auto;
}

:deep(.progress-bar.el-slider .el-slider__runway),
:deep(.volume-slider.el-slider .el-slider__runway) {
  height: var(--el-slider-height);
  margin: 0;
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.progress-bar.el-slider .el-slider__bar),
:deep(.volume-slider.el-slider .el-slider__bar) {
  height: var(--el-slider-height);
  background: linear-gradient(90deg, #ffcc00, #ffd700);
  border-radius: 4px;
}

:deep(.progress-bar.el-slider .el-slider__button-wrapper),
:deep(.volume-slider.el-slider .el-slider__button-wrapper) {
  width: var(--el-slider-button-wrapper-size);
  height: var(--el-slider-button-wrapper-size);
  top: -6px;
}

:deep(.progress-bar.el-slider .el-slider__button),
:deep(.volume-slider.el-slider .el-slider__button) {
  width: var(--el-slider-button-size);
  height: var(--el-slider-button-size);
  background-color: #fff;
  border: 2px solid #ffcc00;
}

:deep(.progress-bar.el-slider:hover .el-slider__button),
:deep(.volume-slider.el-slider:hover .el-slider__button) {
  transform: scale(1.1);
  box-shadow: 0 0 6px rgba(255, 204, 0, 0.4);
}

.progress-container {
  width: 100%;
  padding: 0 5px;
  margin-bottom: 5px;
}

.time-info {
  width: 90%;
  margin: 0 auto 4px auto;
  font-size: 0.65rem;
  display: flex;
  justify-content: space-between;
  color: #888;
}

.playlist-dialog {
  --el-dialog-bg-color: #1a1a1a;
  --el-dialog-border-radius: 15px;
}

.playlist {
  max-height: 400px;
  background-color: #282828;
  border-radius: 10px;
  padding: 10px;
  overflow-x: hidden;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.playlist-item:hover {
  background-color: #333333;
  transform: translateX(5px);
}

.playlist-item.active {
  background-color: #ffcc0022;
  border-left: 3px solid #ffcc00;
}

.playlist-item img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.playlist-item-info {
  flex: 1;
}

.playlist-item h4 {
  font-size: 1em;
  margin: 0;
  color: #fff;
}

.playlist-item p {
  font-size: 0.8em;
  margin: 5px 0 0;
  color: #888;
}

@media (max-width: 768px) {
  .music-player {
    margin: 10px;
    padding: 15px;
  }

  .thumbnail {
    width: 150px;
    height: 150px;
  }

  .controls {
    gap: 10px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .play-btn {
    width: 50px;
    height: 50px;
  }
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #444;
}

/* Element Plus 다이얼로그 스크롤바 스타일링 */
:deep(.el-dialog__body) {
  overflow: hidden !important;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden !important;
}

:deep(.el-dialog) {
  overflow: hidden !important;
}
</style>
