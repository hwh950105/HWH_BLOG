import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false, // 로딩 상태
  }),
  actions: {
    ON() {
      this.isLoading = true;
    },
    OFF() {
      this.isLoading = false;
    },
  },
});
