import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Coin from '../views/Coin.vue';
import Note from '../views/Note.vue';
import Notionlist from '../views/Notionlist.vue';
import Gitlist from '../views/Gitlist.vue';
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/Coin', name: 'Coin', component: Coin },
  {
    path: '/Note/:id',
    name: 'Note',
    component: Note
  },  
  {
    path: '/Notionlist',
    name: 'Notionlist',
    component: Notionlist
  },
  {
    path: '/Gitlist',
    name: 'Gitlist',
    component: Gitlist
  },
  
  

];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

export default router;
