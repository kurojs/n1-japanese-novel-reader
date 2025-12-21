<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let bookCharCount: number;
  export let exploredCharCount: number;
  export let isTrackerPaused: boolean = false;
  export let bookTitle: string = '';

  interface RPGStats {
    pagesReadToday: number;
    wordsMinedToday: number;
    totalWordsMinedAllTime: number;
    currentStreak: number;
    bestStreak: number;
    lastActiveDate: string;
    dailyPageGoal: number;
    totalPagesRead: number;
    totalTimeReadingToday: number; // in minutes
    miningActive: boolean;
    miningStartTime: number | null;
  }

  let stats: RPGStats = {
    pagesReadToday: 0,
    wordsMinedToday: 0,
    totalWordsMinedAllTime: 0,
    currentStreak: 1, // Start with 1 (today)
    bestStreak: 1,
    lastActiveDate: new Date().toDateString(),
    dailyPageGoal: 5,
    totalPagesRead: 0,
    totalTimeReadingToday: 0,
    miningActive: false,
    miningStartTime: null
  };

  let bookProgress = 0;
  let miningElapsedTime = 0;
  let miningInterval: number | null = null;
  let pickaxeAnimating = false;
  let lastWordCount = 0;
  let lastExploredCharCount = 0;
  let currentTime = '';
  let clockInterval: number | null = null;

  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTime = `${hours}:${minutes}:${seconds}`;
  }

  $: bookProgress = bookCharCount > 0 ? Math.floor((exploredCharCount / bookCharCount) * 100) : 0;

  onMount(() => {
    if (browser) {
      loadStats();
      checkDailyReset();
      window.addEventListener('wordMined', handleWordMined);
      
      // Start clock
      updateClock();
      clockInterval = window.setInterval(updateClock, 1000);
    }
  });

  onDestroy(() => {
    if (browser) {
      saveStats();
      window.removeEventListener('wordMined', handleWordMined);
      if (miningInterval) clearInterval(miningInterval);
      if (clockInterval) clearInterval(clockInterval);
    }
  });

  function loadStats() {
    try {
      const saved = localStorage.getItem('rpgStats');
      if (saved) {
        const parsed = JSON.parse(saved);
        stats = { ...stats, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load RPG stats:', e);
    }
  }

  function saveStats() {
    try {
      localStorage.setItem('rpgStats', JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save RPG stats:', e);
    }
  }

  function checkDailyReset() {
    const today = new Date().toDateString();
    
    if (stats.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check streak: if yesterday was last active and completed at least 1 page, increment
      if (stats.lastActiveDate === yesterday.toDateString() && stats.pagesReadToday >= 1) {
        stats.currentStreak++;
        if (stats.currentStreak > stats.bestStreak) {
          stats.bestStreak = stats.currentStreak;
        }
      } else if (stats.lastActiveDate && stats.lastActiveDate !== today) {
        // Break streak if missed a day
        stats.currentStreak = 1; // Reset to 1 (today counts)
      }
      
      // Reset daily stats
      stats.pagesReadToday = 0;
      stats.wordsMinedToday = 0;
      stats.totalTimeReadingToday = 0;
      stats.lastActiveDate = today;
      saveStats();
    }
  }

  function handleWordMined(event: Event) {
    stats.wordsMinedToday++;
    stats.totalWordsMinedAllTime++;
    pickaxeAnimating = true;
    setTimeout(() => pickaxeAnimating = false, 600);
    saveStats();
  }

  // Track reading progress - increment pages based on characters read (only forward)
  $: if (browser && exploredCharCount > lastExploredCharCount) {
    const charsPerPage = 2000; // ~2000 chars per page
    const newPages = Math.floor(exploredCharCount / charsPerPage);
    const oldPages = Math.floor(lastExploredCharCount / charsPerPage);
    
    if (newPages > oldPages) {
      const pagesRead = newPages - oldPages;
      stats.pagesReadToday += pagesRead;
      stats.totalPagesRead += pagesRead;
      
      // Update last active date if reading
      const today = new Date().toDateString();
      if (stats.lastActiveDate !== today) {
        checkDailyReset();
      }
      stats.lastActiveDate = today;
      
      saveStats();
    }
    
    lastExploredCharCount = exploredCharCount;
  }

  // Track reading time
  $: if (browser) {
    if (!isTrackerPaused && !stats.miningActive) {
      stats.miningActive = true;
      stats.miningStartTime = Date.now();
      miningElapsedTime = 0;
      
      miningInterval = window.setInterval(() => {
        if (stats.miningStartTime) {
          miningElapsedTime = Math.floor((Date.now() - stats.miningStartTime) / 1000);
          // Update total time every minute
          if (miningElapsedTime % 60 === 0) {
            stats.totalTimeReadingToday++;
            saveStats();
          }
        }
      }, 1000);
    } else if (isTrackerPaused && stats.miningActive) {
      stats.miningActive = false;
      if (stats.miningStartTime) {
        const sessionMinutes = Math.floor((Date.now() - stats.miningStartTime) / 60000);
        stats.totalTimeReadingToday += sessionMinutes;
        saveStats();
      }
      stats.miningStartTime = null;
      if (miningInterval) {
        clearInterval(miningInterval);
        miningInterval = null;
      }
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Create custom event for mining words (you'll trigger this from your button)
  function mineWord() {
    if (browser) {
      window.dispatchEvent(new CustomEvent('wordMined'));
    }
  }

  // Expose mineWord function globally for button access
  if (browser) {
    (window as any).mineWord = mineWord;
  }

  function getProgressColor(progress: number): string {
    if (progress < 20) return '#FF0000'; // Rojo
    if (progress < 40) return '#FF8800'; // Naranja
    if (progress < 60) return '#FFFF00'; // Amarillo
    if (progress < 80) return '#00dd15'; // Verde
    if (progress < 95) return '#9333ea'; // Morado matrix (medium)
    return '#7c3aed'; // Morado matrix oscuro
  }

  function getTimeProgressColor(): string {
    const hour = new Date().getHours();
    
    if (hour < 6) return '#7c3aed'; // Morado oscuro (noche)
    if (hour < 9) return '#3b82f6'; // Azul (mañana temprano)
    if (hour < 12) return '#00dd15'; // Verde (mañana)
    if (hour < 13) return '#fbbf24'; // Amarillo (mediodía temprano)
    if (hour < 16) return '#00dd15'; // Verde (tarde temprana)
    if (hour < 18) return '#f97316'; // Naranja (tarde)
    if (hour < 21) return '#ef4444'; // Rojo (atardecer)
    return '#9333ea'; // Morado (noche temprana)
  }

  function getTimeProgress(): number {
    const hour = new Date().getHours();
    return (hour / 24) * 100;
  }

  $: statsInfo = [
    { value: `${stats.wordsMinedToday}`, progress: Math.min((stats.wordsMinedToday / 50) * 100, 100), gif: '/pico.gif', alt: 'mined', label: 'Palabras minadas', clickable: true, position: 'left' },
    { value: currentTime, progress: getTimeProgress(), gif: '/clock.gif', alt: 'time', label: 'Hora actual', position: 'right', timeColor: getTimeProgressColor() }
  ];

  function handleMineClick() {
    if (browser) {
      stats.wordsMinedToday++;
      stats.totalWordsMinedAllTime++;
      pickaxeAnimating = true;
      setTimeout(() => pickaxeAnimating = false, 600);
      saveStats();
    }
  }
</script>

<div class="writing-horizontal-tb w-full h-full flex items-end justify-between px-4 py-3">
  <!-- Book title in center top -->
  {#if bookTitle}
    <div class="book-title-container">
      <div class="book-title">{bookTitle}</div>
    </div>
  {/if}

  <div class="stats-row">
    {#each statsInfo.filter(s => s.position === 'left') as stat}
      <div class="stat-item">
        {#if stat.clickable}
          <button class="stat-gif-button" on:click={handleMineClick} title={stat.label}>
            <img src={stat.gif} alt={stat.alt} class="stat-gif" class:animated={pickaxeAnimating} />
          </button>
        {:else}
          <img src={stat.gif} alt={stat.alt} class="stat-gif" title={stat.label} />
        {/if}
        <span class="stat-value">{stat.value}</span>
        <div class="xp-bar-horizontal" title={stat.label}>
          <div class="xp-fill" style="width: {stat.progress}%; background: {getProgressColor(stat.progress)}; box-shadow: 0 0 8px {getProgressColor(stat.progress)}80;"></div>
        </div>
      </div>
    {/each}
  </div>

  <div class="stats-row">
    {#each statsInfo.filter(s => s.position === 'right') as stat}
      <div class="stat-item">
        <img src={stat.gif} alt={stat.alt} class="stat-gif" title={stat.label} />
        <span class="stat-value">{stat.value}</span>
        <div class="xp-bar-horizontal" title={stat.label}>
          <div class="xp-fill" style="width: {stat.progress}%; background: {stat.timeColor}; box-shadow: 0 0 8px {stat.timeColor}80;"></div>
        </div>
      </div>
    {/each}
    {#if stats.miningActive}
      <span class="separator">•</span>
      <span class="stat-value timer">{formatTime(miningElapsedTime)}</span>
    {/if}
  </div>
</div>

<style>
  .stats-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .stat-gif {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
  }

  .stat-gif.animated {
    animation: bounce 0.6s ease-out;
  }

  .stat-gif-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .stat-gif-button:hover {
    transform: scale(1.1);
  }

  .stat-gif-button:active {
    transform: scale(0.95);
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  .stat-value {
    color: rgba(255, 255, 255, 0.9);
    font-family: 'Monocraft', 'Courier New', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    min-width: 3rem;
    text-align: center;
  }

  .separator {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.8rem;
  }

  .xp-bar-horizontal {
    width: 60px;
    height: 12px;
    background: #1A1A1A;
    border: 2px solid #000000;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .xp-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    transition: width 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
    animation: glowPulse 2s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { 
      opacity: 0.7;
      filter: brightness(0.9);
    }
    50% { 
      opacity: 1;
      filter: brightness(1.3);
    }
  }

  .timer {
    color: rgba(255, 255, 255, 0.8);
    animation: timerPulse 2s ease-in-out infinite;
  }

  @keyframes timerPulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  .book-title-container {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 1.5rem;
    background: rgba(0, 0, 0, 0.5);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    backdrop-filter: blur(4px);
  }

  .book-title {
    font-family: 'Monocraft', 'Courier New', monospace;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
    text-shadow: 0 0 8px rgba(147, 51, 234, 0.5);
  }

  @media (max-width: 768px) {
    .stats-row {
      gap: 0.5rem;
    }

    .stat-gif {
      width: 20px;
      height: 20px;
    }

    .stat-value {
      font-size: 0.75rem;
      min-width: 2.5rem;
    }

    .xp-bar-horizontal {
      width: 40px;
      height: 10px;
    }

    .book-title {
      font-size: 0.75rem;
      max-width: 200px;
    }
  }
</style>
