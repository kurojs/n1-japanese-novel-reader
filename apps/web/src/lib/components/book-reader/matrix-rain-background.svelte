<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationId: number;

  // Kanji characters for the rain
  const kanjiChars = '東京都道府県市区町村日本語学校教室先生学生文字言葉意味漢字平仮名片仮名読書勉強試験合格不合格上下左右前後中外内表裏間内容理解説明質問答回答練習復習予習宿題課題作文読解聴解会話発表議論討論意見感想考方法手段目的結果原因理由過程経験知識技術能力才能努力成功失敗挑戦冒険危険安全確実可能不可能必要不必要重要大切便利不便簡単複雑困難容易明確不明瞭正確不正確適切不適切自然人工伝統現代過去現在未来永遠瞬間時間空間世界宇宙地球国家社会文化歴史地理科学技術芸術音楽美術文学哲学宗教政治経済法律医学工学農学商業貿易金融銀行会社企業工場店舗市場価格商品製品材料原料資源能源電気水道交通運輸通信情報知報告連絡相談依頼要求命令禁止許可承認拒否賛成反対同意異議疑問確認説得納得理解誤解混乱困惑驚嘆感動興奮緊張不安心配恐怖悲哀喜楽幸福不幸平和戦争友好敵対協力競争勝負勝利敗北';

  class MatrixRain {
    private drops: number[] = [];
    private fontSize: number = 24;
    private columns: number = 0;
    private chars: string[];
    private speed: number = 0.15;
    private charChangeInterval: number = 60;
    private frameCount: number = 0;
    private columnChars: Map<number, string[]> = new Map();
    private trailLength: number = 8; // Visible row length
    private activeColumns: Set<number> = new Set();

    constructor(canvasWidth: number) {
      this.chars = kanjiChars.split('');
      this.columns = Math.floor(canvasWidth / this.fontSize);
      this.drops = Array(this.columns).fill(1).map(() => Math.random() * -100);
      
      for (let i = 0; i < this.columns; i++) {
        this.columnChars.set(i, this.getRandomKanjis(this.trailLength + 5));
      }
      
      const activeCount = Math.floor(this.columns * 0.3);
      while (this.activeColumns.size < activeCount) {
        this.activeColumns.add(Math.floor(Math.random() * this.columns));
      }
    }

    getRandomKanjis(count: number): string[] {
      const kanjis: string[] = [];
      for (let i = 0; i < count; i++) {
        kanjis.push(this.chars[Math.floor(Math.random() * this.chars.length)]);
      }
      return kanjis;
    }

    updateSize(canvasWidth: number) {
      this.columns = Math.floor(canvasWidth / this.fontSize);
      this.drops = Array(this.columns).fill(1).map(() => Math.random() * -100);
      
      this.columnChars.clear();
      for (let i = 0; i < this.columns; i++) {
        this.columnChars.set(i, this.getRandomKanjis(this.trailLength + 5));
      }
      
      this.activeColumns.clear();
      const activeCount = Math.floor(this.columns * 0.3);
      while (this.activeColumns.size < activeCount) {
        this.activeColumns.add(Math.floor(Math.random() * this.columns));
      }
    }

    draw(ctx: CanvasRenderingContext2D, canvasHeight: number) {
      ctx.clearRect(0, 0, ctx.canvas.width, canvasHeight);

      ctx.font = `bold ${this.fontSize}px monospace`;

      this.frameCount++;

      for (let i = 0; i < this.drops.length; i++) {
        if (!this.activeColumns.has(i)) continue;

        // Rotate kanjis occasionally
        if (this.frameCount % this.charChangeInterval === 0 && Math.random() > 0.8) {
          const kanjis = this.columnChars.get(i)!;
          kanjis.unshift(this.chars[Math.floor(Math.random() * this.chars.length)]);
          kanjis.pop();
        }

        const kanjis = this.columnChars.get(i)!;
        const x = i * this.fontSize;
        const baseY = this.drops[i] * this.fontSize;

        // Draw entire row of kanjis - brightest at bottom
        for (let j = 0; j < this.trailLength; j++) {
          const y = baseY - (j * this.fontSize);
          
          if (y > -this.fontSize && y < canvasHeight + this.fontSize) {
            const kanji = kanjis[j];
            const opacity = 1 - (j / this.trailLength);
            
            if (j === 0) {
              // Brightest kanji at the bottom (newest)
              const gradient = ctx.createLinearGradient(x, y - 15, x, y + 15);
              gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
              gradient.addColorStop(0.5, 'rgba(168, 85, 247, 1)');
              gradient.addColorStop(1, 'rgba(147, 51, 234, 0.9)');
              ctx.fillStyle = gradient;
            } else if (j < 3) {
              // Next few kanjis bright
              ctx.fillStyle = `rgba(168, 85, 247, ${0.7 * opacity})`;
            } else {
              // Fading trail going up
              ctx.fillStyle = `rgba(147, 51, 234, ${0.4 * opacity})`;
            }
            
            ctx.fillText(kanji, x, y);
          }
        }

        if (baseY > canvasHeight + 100) {
          this.drops[i] = Math.random() * -150;
          this.columnChars.set(i, this.getRandomKanjis(this.trailLength + 5));
        }

        this.drops[i] += this.speed;
      }
    }
  }

  let matrixRain: MatrixRain;

  onMount(() => {
    if (browser && canvas) {
      ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (!matrixRain) {
          matrixRain = new MatrixRain(canvas.width);
        } else {
          matrixRain.updateSize(canvas.width);
        }
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const animate = () => {
        if (ctx) {
          matrixRain.draw(ctx, canvas.height);
        }
        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
</script>

<canvas bind:this={canvas} class="matrix-rain-canvas"></canvas>

<style>
  .matrix-rain-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background: transparent;
    pointer-events: none;
  }
</style>
