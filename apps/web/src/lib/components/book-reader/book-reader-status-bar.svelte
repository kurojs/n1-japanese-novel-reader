<script lang="ts">
  export let exploredCharCount: number = 0;
  export let bookCharCount: number = 0;
  export let fontColor: string = '#ffffff';
  export let showCharacterCounter: boolean = true;
  export let showPercentage: boolean = true;
  export let onPrevPage: (() => void) | undefined = undefined;
  export let onNextPage: (() => void) | undefined = undefined;

  $: progressPercentage = bookCharCount > 0 ? (exploredCharCount / bookCharCount) * 100 : 0;

  $: estimatedTotalPages = Math.max(1, Math.ceil(bookCharCount / 2000));
  $: estimatedCurrentPage = Math.max(
    1,
    Math.ceil((exploredCharCount / Math.max(bookCharCount, 1)) * estimatedTotalPages)
  );

  $: progressInfo = `ページ ${estimatedCurrentPage} / ${estimatedTotalPages}`;
</script>

<div class="writing-horizontal-tb w-full h-full flex items-center justify-center px-4 py-3">
  <div class="text-sm font-medium tracking-wide monocraft-text" style="color: rgba(255, 255, 255, 0.7);">
    {progressInfo}
  </div>
</div>

<style>
  .monocraft-text {
    font-family: 'Monocraft', 'Courier New', monospace;
  }
</style>

