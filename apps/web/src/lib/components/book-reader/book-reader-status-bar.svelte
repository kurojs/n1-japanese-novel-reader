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

  function numberToKanji(num: number): string {
    const kanjiNumbers = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const digits = num.toString().split('');
    return digits.map(d => kanjiNumbers[parseInt(d)]).join('');
  }

  $: progressInfo = `ページ ${numberToKanji(estimatedCurrentPage)} / ${numberToKanji(estimatedTotalPages)}`;

  $: showNavButtons = onPrevPage || onNextPage;
</script>

<div class="writing-horizontal-tb w-full h-full flex items-center justify-center px-4 py-3">
  <!-- Center: Progress info -->
  <div class="flex items-center justify-center">
    <div class="text-sm font-medium tracking-wide monocraft-text" style="color: rgba(255, 255, 255, 0.7);">
      {progressInfo}
    </div>
  </div>
</div>

<style>
  .monocraft-text {
    font-family: "Monocraft", "Courier New", monospace;
  }
</style>

