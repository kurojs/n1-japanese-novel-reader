<script lang="ts">
  export let bookCharCount: number;
  export let exploredCharCount: number;

  $: bookProgress = bookCharCount > 0 ? Math.floor((exploredCharCount / bookCharCount) * 100) : 0;
</script>

<div class="rpg-bar">
  <div class="rpg-content">
    <img src="/clock.gif" alt="clock" class="clock-icon" />
    <div class="progress-text">{bookProgress}%</div>
    <div class="xp-bar">
      <div
        class="xp-fill"
        style="width: {bookProgress}%"
      ></div>
    </div>
  </div>
</div>

<style>
  .rpg-bar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rpg-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .clock-icon {
    width: 20px;
    height: 20px;
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
  }

  .progress-text {
    font-family: 'Monocraft', 'Courier New', monospace;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    min-width: 3rem;
    text-align: center;
  }

  .xp-bar {
    width: 100px;
    height: 10px;
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
    background: #00dd15;
    box-shadow: 0 0 8px rgba(0, 221, 21, 0.5);
    transition: width 0.5s ease;
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
</style>
