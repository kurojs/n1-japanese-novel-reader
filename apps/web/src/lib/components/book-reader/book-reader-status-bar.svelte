<script lang="ts">
  import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';

  export let exploredCharCount: number = 0;
  export let bookCharCount: number = 0;
  export let fontColor: string = '#ffffff';
  export let showCharacterCounter: boolean = true;
  export let showPercentage: boolean = true;
  export let onPrevPage: (() => void) | undefined = undefined;
  export let onNextPage: (() => void) | undefined = undefined;

  $: progressPercentage = bookCharCount > 0 ? (exploredCharCount / bookCharCount) * 100 : 0;

  // Estimar páginas basado en caracteres (aproximadamente 2000 caracteres por página)
  $: estimatedTotalPages = Math.max(1, Math.ceil(bookCharCount / 2000));
  $: estimatedCurrentPage = Math.max(
    1,
    Math.ceil((exploredCharCount / Math.max(bookCharCount, 1)) * estimatedTotalPages)
  );

  $: progressInfo = [
    showCharacterCounter
      ? `${exploredCharCount.toLocaleString()} / ${bookCharCount.toLocaleString()} chars`
      : '',
    showPercentage ? `${progressPercentage.toFixed(1)}%` : '',
    `Página ${estimatedCurrentPage} de ${estimatedTotalPages}`
  ]
    .filter(Boolean)
    .join(' • ');

  $: showNavButtons = onPrevPage || onNextPage;
</script>

<div class="writing-horizontal-tb w-full h-full flex items-center justify-between px-4 py-3">
  <!-- Left: Navigation button -->
  <div class="flex items-center" style="min-width: {showNavButtons ? '40px' : '0'};">
    {#if onPrevPage}
      <button
        on:click={onPrevPage}
        class="w-8 h-8 flex items-center justify-center transition-opacity duration-150 hover:opacity-100"
        style="color: rgba(255, 255, 255, 0.5); opacity: 0.6;"
        title="Página anterior"
      >
        <Fa icon={faChevronLeft} />
      </button>
    {/if}
  </div>

  <!-- Center: Progress info -->
  <div class="flex-1 flex items-center justify-center px-4">
    <div class="text-sm font-medium tracking-wide monocraft-text" style="color: rgba(255, 255, 255, 0.7);">
      {progressInfo}
    </div>
  </div>

  <!-- Right: Navigation button -->
  <div class="flex items-center justify-end" style="min-width: {showNavButtons ? '40px' : '0'};">
    {#if onNextPage}
      <button
        on:click={onNextPage}
        class="w-8 h-8 flex items-center justify-center transition-opacity duration-150 hover:opacity-100"
        style="color: rgba(255, 255, 255, 0.5); opacity: 0.6;"
        title="Página siguiente"
      >
        <Fa icon={faChevronRight} />
      </button>
    {/if}
  </div>
</div>

<style>
  .monocraft-text {
    font-family: "Monocraft", "Courier New", monospace;
  }
</style>

