<template>
  <div class="music-player-wrapper">
    <!-- 숨겨진 YouTube 플레이어 -->
    <div id="player" style="display: none;"></div>

    <!-- 대형 플레이어 (항상 표시) -->
    <div class="fullscreen-player-modal">
      <div class="fullscreen-player-container">

        <!-- 헤더 -->
        <div class="player-header">
          <div class="header-center">
            <h1>🎵 YouTube Music Player</h1>
            <span class="player-subtitle">고음질 스트리밍</span>
          </div>
        </div>

        <!-- 메인 콘텐츠 - 왼쪽 음악플레이어, 오른쪽 플레이리스트 -->
        <div class="player-main-content">

          <!-- 왼쪽: 음악 플레이어 섹션 -->
          <div class="player-section">
            <div class="player-section-header">
              <h3>🎵 Now Playing</h3>
            </div>

            <!-- 현재 재생 중인 트랙 -->
            <div class="current-track-section">
              <div class="large-album-cover">
                <img
                  :src="musicImageSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0xNjAgODBDMTIwIDgwIDkwIDExMCA5MDE1MFMxMjAgMjIwIDE2MCAyMjBTMjMwIDE5MCAyMzAgMTUwUzIwMCA4MCAxNjAgODBaTTE2MCAyMDBDMTMxIDIwMCAxMTAgMTc5IDExMCAxNTBTMTMxIDEwMCAxNjAgMTAwUzIxMCAxMjEgMjEwIDE1MFMxODkgMjAwIDE2MCAyMDBaIiBmaWxsPSIjNjY3RUVBIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjE1MCIgcj0iMjAiIGZpbGw9IiM2NjdFRUEiLz4KPC9zdmc+'"
                  :alt="musicTitle || '음악 커버'"
                  class="large-cover-image"
                  :class="{ 'is-rotating': playing }"
                  @error="handleImageError"
                />
                <div class="cover-overlay" v-if="!playing">
                  <div class="large-play-icon" @click="play()">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="track-metadata">
                <h2 class="current-track-title">{{ musicTitle || '재생 대기 중' }}</h2>
                <p class="current-track-artist">{{ musicArtist || '아티스트' }}</p>
              </div>
            </div>

            <!-- 플레이어 컨트롤 -->
            <div class="player-controls" v-if="ready">

              <!-- 진행률 섹션 -->
              <div class="progress-section">
                <div class="time-labels">
                  <span class="current-time">{{ formatTime(currentTime) }}</span>
                  <span class="total-time">{{ formatTime(duration) }}</span>
                </div>
                <div class="progress-container" @click="handleProgressClick">
                  <div class="progress-track">
                    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                    <div class="progress-handle" :style="{ left: progress + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- 메인 컨트롤 버튼들 -->
              <div class="main-controls">
                <button class="control-button shuffle-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                  </svg>
                </button>

                <button
                  class="control-button prev-btn"
                  @click="prev"
                  :disabled="currentVideoIndex <= 0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                  </svg>
                </button>

                <button class="control-button play-btn" @click="playing ? pause() : play()">
                  <svg v-if="!playing" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </button>

                <button class="control-button next-btn" @click="next">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                  </svg>
                </button>

                <button class="control-button repeat-btn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                  </svg>
                </button>
              </div>

              <!-- 볼륨 및 기타 컨트롤 -->
              <div class="secondary-controls">
                <button class="control-button volume-btn" @click="toggleMute">
                  <svg v-if="volume === 0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63z"/>
                  </svg>
                  <svg v-else-if="volume < 50" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                </button>

                <div class="volume-container">
                  <div class="volume-slider" @click="handleVolumeClick">
                    <div class="volume-track">
                      <div class="volume-fill" :style="{ width: volume + '%' }"></div>
                      <div class="volume-handle" :style="{ left: volume + '%' }"></div>
                    </div>
                  </div>
                  <span class="volume-label">{{ Math.round(volume) }}</span>
                </div>
              </div>
            </div>

            <!-- YouTube 플레이어 임베드 영역 (숨김) -->
            <div class="youtube-player-container" style="display: none;">
              <div id="popup-player" class="youtube-embed"></div>
            </div>
          </div>

          <!-- 오른쪽: 플레이리스트 섹션 -->
          <div class="playlist-section">

            <!-- 플레이리스트 헤더 -->
            <div class="playlist-header">
              <div class="playlist-title-section">
                <h3>🎶 음악 리스트</h3>
                <span class="playlist-stats">총 {{ playlist.length }}곡 • {{ formatTotalDuration() }}</span>
              </div>
              <div class="playlist-actions">
                <button class="playlist-action-btn" title="모두 선택">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </button>
                <button class="playlist-action-btn" title="정렬">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                </button>
                <button class="playlist-action-btn" title="셔플">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 플레이리스트 목록 -->
            <div class="playlist-content">
              <div class="playlist-tracks">
                <div
                  v-for="(video, index) in playlist"
                  :key="index"
                  class="track-item"
                  :class="{
                    'is-current': currentVideoIndex === index,
                    'is-playing': currentVideoIndex === index && playing
                  }"
                  @click="playVideoFromPlaylist(video.videoId, index)"
                  @dblclick="playVideoFromPlaylist(video.videoId, index)"
                >

                  <!-- 트랙 번호/재생 상태 -->
                  <div class="track-number">
                    <span v-if="currentVideoIndex !== index" class="number">{{ index + 1 }}</span>
                    <div v-else class="playing-indicator">
                      <svg v-if="playing" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- 트랙 썸네일 -->
                  <div class="track-thumbnail">
                    <img :src="video.thumbnail" :alt="video.title" @error="handleThumbnailError($event)" />
                    <div class="thumbnail-overlay">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- 트랙 정보 -->
                  <div class="track-info">
                    <h4 class="track-title">{{ video.title }}</h4>
                    <p class="track-artist">{{ video.artist }}</p>
                  </div>

                  <!-- 트랙 액션 -->
                  <div class="track-actions">
                    <button class="track-action-btn like-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                    <button class="track-action-btn more-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { ElMessage } from 'element-plus';

const props = defineProps({
  dock: { type: Boolean, default: false }
});

const PLAYLIST_ID = "PLxdMLh2pGgVX2ZsdIQbkC_zwbnKqnt0fh";

// 상태 관리
const volume = ref(50);
const playing = ref(false);
const ready = ref(false);
const showPopup = ref(true);
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

// 총 재생시간 포맷
function formatTotalDuration() {
  const totalMinutes = playlist.value.length * 3.5; // 평균 3.5분으로 추정
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
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

// 프로그레스 바 클릭 핸들러
function handleProgressClick(event) {
  if (!player || !duration.value) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = (clickX / rect.width) * 100;

  progress.value = Math.max(0, Math.min(100, percentage));
  seekTo(progress.value);
}

// 볼륨 슬라이더 클릭 핸들러
function handleVolumeClick(event) {
  if (!player) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));

  volume.value = percentage;
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

  progressInterval = setInterval(updateProgress, 1000);

  try {
    event.target.cuePlaylist({
      list: PLAYLIST_ID,
      listType: 'playlist',
      index: 0
    });

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

// 이미지 오류 핸들러
function handleImageError(event) {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0xNjAgODBDMTIwIDgwIDkwIDExMCA5MDE1MFMxMjAgMjIwIDE2MCAyMjBTMjMwIDE5MCAyMzAgMTUwUzIwMCA4MCAxNjAgODBaTTE2MCAyMDBDMTMxIDIwMCAxMTAgMTc5IDExMCAxNTBTMTMxIDEwMCAxNjAgMTAwUzIxMCAxMjEgMjEwIDE1MFMxODkgMjAwIDE2MCAyMDBaIiBmaWxsPSIjNjY3RUVBIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjE1MCIgcj0iMjAiIGZpbGw9IiM2NjdFRUEiLz4KPC9zdmc+';
}

function handleThumbnailError(event) {
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik00OCAzNkw3MiA0NS41TDQ4IDU0VjM2WiIgZmlsbD0iIzY2N0VFQSIvPgo8L3N2Zz4K';
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

    setTimeout(() => {
      if (!isApiLoaded) {
        reject(new Error('YouTube API 로드 시간 초과'));
      }
    }, 10000);
  });
}

async function loadPlaylistData() {
  if (!isApiLoaded) return;

  try {
    // YouTube API를 사용해서 플레이리스트 정보를 미리 가져오기
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=YOUR_API_KEY`);
    if (response.ok) {
      const data = await response.json();
      playlist.value = data.items.map(item => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle || 'YouTube',
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url
      }));
    } else {
      // API 키가 없으면 기본 플레이리스트 생성
      createDefaultPlaylist();
    }
  } catch (error) {
    console.log('API를 통한 플레이리스트 로드 실패, 기본 플레이리스트 사용');
    createDefaultPlaylist();
  }
}

function createDefaultPlaylist() {
  // 기본 플레이리스트 데이터 생성 (더 실제적인 음악 제목들)
  const sampleTracks = [
    { title: '봄날', artist: 'BTS' },
    { title: 'Dynamite', artist: 'BTS' },
    { title: 'IU - Through the Night', artist: 'IU' },
    { title: 'Permission to Dance', artist: 'BTS' },
    { title: '좋은 날', artist: 'IU' },
    { title: 'Butter', artist: 'BTS' },
    { title: '에잇 (Eight)', artist: 'IU & SUGA' },
    { title: 'Life Goes On', artist: 'BTS' },
    { title: 'Celebrity', artist: 'IU' },
    { title: 'My Universe', artist: 'Coldplay & BTS' },
    { title: '드라마', artist: 'IU' },
    { title: 'Yet To Come', artist: 'BTS' },
    { title: '스물셋', artist: 'IU' },
    { title: 'ON', artist: 'BTS' },
    { title: '밤편지', artist: 'IU' },
    { title: 'Black Swan', artist: 'BTS' },
    { title: 'Blueming', artist: 'IU' },
    { title: 'DNA', artist: 'BTS' },
    { title: 'Love poem', artist: 'IU' },
    { title: 'Fake Love', artist: 'BTS' }
  ];

  playlist.value = sampleTracks.map((track, index) => ({
    videoId: `video_${index + 1}`,
    title: track.title,
    artist: track.artist,
    thumbnail: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik00OCAzNkw3MiA0NS41TDQ4IDU0VjM2WiIgZmlsbD0iIzY2N0VFQSIvPgo8L3N2Zz4K`
  }));
}

// 더 이상 필요하지 않음 - 항상 표시
// function openFullPlayer() {
//   showPopup.value = true;
//   loadPopupPlayer();
// }

// 플레이어는 항상 표시되므로 닫기 기능 비활성화
// function closePopup() {
//   // 아무것도 하지 않음
// }

function loadPopupPlayer() {
  if (!isApiLoaded) {
    ElMessage.error('YouTube API가 아직 로드되지 않았습니다.');
    return;
  }

  try {
    popupPlayer = new YT.Player("popup-player", {
      height: "240",
      width: "100%",
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

    // 기본 플레이리스트 미리 로드
    createDefaultPlaylist();

    // 바로 팝업 플레이어도 로드
    loadPopupPlayer();

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
    // 오류 시에도 기본 플레이리스트는 표시
    createDefaultPlaylist();
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
/* 기본 래퍼 */
.music-player-wrapper {
  width: 100%;
  color: var(--text-primary);
}




/* 음악 플레이어 컨테이너 */
.fullscreen-player-modal {
  width: 100vw;
  height: 100vh;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fullscreen-player-container {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@keyframes slideInScale {
  from {
    transform: scale(0.95) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* 플레이어 헤더 */
.player-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
  flex-shrink: 0;
}

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
}

.header-center h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--color-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.player-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 메인 콘텐츠 - 왼쪽 음악플레이어, 오른쪽 리스트 */
.player-main-content {
  display: grid;
  grid-template-columns: 450px 1fr;
  flex: 1;
  overflow: hidden;
  gap: 0;
  min-height: 0;
  height: 100%;
}

/* 왼쪽 플레이어 섹션 */
.player-section {
  background: var(--color-surface-2);
  border-right: 1px solid var(--color-border);
  padding: var(--space-4) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow-y: auto;
}

.player-section-header {
  text-align: center;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.player-section-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--color-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.current-track-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.large-album-cover {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 3px solid var(--color-primary-solid);
}

.large-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all var(--ease-fluid) 0.3s;
}

.large-cover-image.is-rotating {
  animation: rotate 20s linear infinite;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--ease-fluid) 0.3s;
}

.large-album-cover:hover .cover-overlay {
  opacity: 1;
}

.large-play-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--ease-bounce) 0.3s;
  color: white;
}

.large-play-icon:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-xl);
}

.large-play-icon svg {
  width: 32px;
  height: 32px;
}

.track-metadata {
  text-align: center;
  width: 100%;
}

.current-track-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 var(--space-2) 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.current-track-artist {
  font-size: 1rem;
  margin: 0;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 플레이어 컨트롤 */
.player-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.time-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.progress-container {
  cursor: pointer;
}

.progress-track {
  height: 8px;
  background: var(--color-surface-1);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--ease-fluid) 0.3s;
}

.progress-track:hover {
  transform: scaleY(1.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary-solid), var(--color-secondary-solid));
  border-radius: var(--radius-sm);
  transition: width var(--ease-fluid) 0.1s;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 20px;
  background: white;
  border: 3px solid var(--color-primary-solid);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: var(--shadow-md);
  opacity: 0;
  transition: opacity var(--ease-fluid) 0.3s;
}

.progress-track:hover .progress-handle {
  opacity: 1;
}

.main-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
}

.control-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--color-surface-3);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ease-fluid) 0.3s;
  border: 1px solid var(--color-border);
}

.control-button:hover {
  background: var(--color-surface-1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.control-button svg {
  width: 20px;
  height: 20px;
}

.play-btn {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  color: white;
  border: none;
  box-shadow: var(--shadow-lg);
}

.play-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-xl);
}

.play-btn svg {
  width: 28px;
  height: 28px;
}

.secondary-controls {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.volume-container {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.volume-slider {
  flex: 1;
  cursor: pointer;
}

.volume-track {
  height: 6px;
  background: var(--color-surface-1);
  border-radius: var(--radius-sm);
  position: relative;
  transition: all var(--ease-fluid) 0.3s;
}

.volume-track:hover {
  transform: scaleY(1.3);
}

.volume-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-solid), var(--color-primary-solid));
  border-radius: var(--radius-sm);
  transition: width var(--ease-fluid) 0.1s;
}

.volume-handle {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid var(--color-accent-solid);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: var(--shadow-sm);
  opacity: 0;
  transition: opacity var(--ease-fluid) 0.3s;
}

.volume-track:hover .volume-handle {
  opacity: 1;
}

.volume-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  min-width: 32px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

/* YouTube 플레이어 임베드 */
.youtube-player-container {
  margin-top: auto;
}

.youtube-embed {
  background: var(--color-surface-3);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  min-height: 240px;
  overflow: hidden;
}

/* 오른쪽 플레이리스트 섹션 */
.playlist-section {
  background: var(--color-surface-1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  height: 100%;
}

.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-8);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
  flex-shrink: 0;
}

.playlist-title-section h3 {
  margin: 0 0 var(--space-1) 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
}

.playlist-stats {
  font-size: 0.9rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

.playlist-actions {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.playlist-action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: var(--color-surface-3);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ease-fluid) 0.3s;
}

.playlist-action-btn:hover {
  background: var(--color-primary-solid);
  color: white;
}

.playlist-action-btn svg {
  width: 18px;
  height: 18px;
}

.playlist-content {
  flex: 1;
  overflow: hidden;
}

.playlist-tracks {
  height: 100%;
  overflow-y: auto;
  padding: var(--space-4);
  scroll-behavior: smooth;
}

.playlist-tracks::-webkit-scrollbar {
  width: 6px;
}

.playlist-tracks::-webkit-scrollbar-track {
  background: var(--color-surface-3);
  border-radius: var(--radius-sm);
}

.playlist-tracks::-webkit-scrollbar-thumb {
  background: var(--color-primary-solid);
  border-radius: var(--radius-sm);
}

.playlist-tracks::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary-solid);
}

.track-item {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  margin-bottom: var(--space-3);
  border: 1px solid transparent;
}

.track-item:hover {
  background: var(--color-surface-2);
  border-color: var(--color-border);
  transform: translateX(4px);
}

.track-item.is-current {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1), transparent);
  border-left: 4px solid var(--color-primary-solid);
  border-color: var(--color-primary-solid);
}

.track-item.is-playing {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.15), transparent);
}

.track-number {
  width: 32px;
  text-align: center;
  flex-shrink: 0;
}

.number {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.track-item.is-current .number {
  color: var(--color-primary-solid);
  font-weight: 600;
}

.playing-indicator {
  width: 24px;
  height: 24px;
  color: var(--color-primary-solid);
  display: flex;
  align-items: center;
  justify-content: center;
}

.playing-indicator svg {
  width: 16px;
  height: 16px;
}

.track-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.track-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--ease-fluid) 0.3s;
}

.track-item:hover .thumbnail-overlay {
  opacity: 1;
}

.thumbnail-overlay svg {
  width: 20px;
  height: 20px;
  color: white;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.track-artist {
  font-size: 0.85rem;
  margin: 0;
  color: var(--text-secondary);
  opacity: 0.8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-actions {
  display: flex;
  gap: var(--space-2);
  opacity: 0;
  transition: opacity var(--ease-fluid) 0.3s;
  flex-shrink: 0;
}

.track-item:hover .track-actions {
  opacity: 1;
}

.track-action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--color-surface-3);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ease-fluid) 0.3s;
}

.track-action-btn:hover {
  background: var(--color-primary-solid);
  color: white;
  transform: scale(1.1);
}

.track-action-btn svg {
  width: 16px;
  height: 16px;
}

/* 애니메이션 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 반응형 디자인 */
@media (max-width: 1400px) {
  .fullscreen-player-modal {
    padding: 0;
  }

  .fullscreen-player-container {
    width: 100vw;
    height: 100vh;
    border-radius: var(--radius-xl);
    margin: 8px;
    width: calc(100vw - 16px);
    height: calc(100vh - 16px);
  }

  .player-main-content {
    grid-template-columns: 420px 1fr;
  }

  .large-album-cover {
    width: 260px;
    height: 260px;
  }
}

@media (max-width: 1200px) {
  .fullscreen-player-modal {
    padding: 0;
  }

  .fullscreen-player-container {
    width: calc(100vw - 12px);
    height: calc(100vh - 12px);
    margin: 6px;
    min-height: calc(100vh - 12px);
    border-radius: var(--radius-lg);
  }

  .player-main-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .player-section {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-4);
    gap: var(--space-4);
  }

  .current-track-section {
    flex-direction: row;
    align-items: center;
    gap: var(--space-4);
  }

  .large-album-cover {
    width: 200px;
    height: 200px;
  }

  .track-metadata {
    text-align: left;
  }

  .current-track-title {
    font-size: 1.3rem;
  }

  .current-track-artist {
    font-size: 0.95rem;
  }
}

@media (max-width: 1024px) {
  .fullscreen-player-modal {
    padding: 0;
  }

  .fullscreen-player-container {
    width: calc(100vw - 8px);
    height: calc(100vh - 8px);
    margin: 4px;
    min-width: calc(100vw - 8px);
    min-height: calc(100vh - 8px);
    border-radius: var(--radius-md);
  }

  .player-section {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-4);
  }

  .current-track-section {
    flex-direction: row;
    align-items: center;
    gap: var(--space-4);
  }

  .large-album-cover {
    width: 180px;
    height: 180px;
  }

  .track-metadata {
    text-align: left;
  }

  .current-track-title {
    font-size: 1.2rem;
  }

  .current-track-artist {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .fullscreen-player-modal {
    padding: 0;
  }

  .fullscreen-player-container {
    width: calc(100vw - 4px);
    height: calc(100vh - 4px);
    margin: 2px;
    border-radius: var(--radius-sm);
    min-height: calc(100vh - 4px);
  }

  .player-header {
    padding: var(--space-3) var(--space-4);
  }

  .header-center h1 {
    font-size: 1.4rem;
  }

  .current-track-section {
    flex-direction: column;
    gap: var(--space-3);
  }

  .large-album-cover {
    width: 160px;
    height: 160px;
  }

  .track-metadata {
    text-align: center;
  }

  .current-track-title {
    font-size: 1.1rem;
  }

  .playlist-tracks {
    padding: var(--space-2);
  }

  .track-item {
    padding: var(--space-2);
    gap: var(--space-3);
  }

  .track-thumbnail {
    width: 44px;
    height: 44px;
  }

  .track-title {
    font-size: 0.85rem;
  }

  .track-artist {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .fullscreen-player-modal {
    padding: 0;
  }

  .fullscreen-player-container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    min-height: 100vh;
    border-radius: 0;
    border: none;
  }

  .large-album-cover {
    width: 140px;
    height: 140px;
  }

  .current-track-title {
    font-size: 1rem;
  }

  .control-button {
    width: 42px;
    height: 42px;
  }

  .play-btn {
    width: 56px;
    height: 56px;
  }

  .track-number {
    width: 24px;
  }

  .track-thumbnail {
    width: 36px;
    height: 36px;
  }

  .track-title {
    font-size: 0.8rem;
  }

  .track-artist {
    font-size: 0.7rem;
  }
}

/* 플레이어 섹션 스크롤바 */
.player-section::-webkit-scrollbar {
  width: 6px;
}

.player-section::-webkit-scrollbar-track {
  background: var(--color-surface-3);
  border-radius: var(--radius-sm);
}

.player-section::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

.player-section::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-solid);
}
</style>