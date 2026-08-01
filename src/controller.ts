/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   */
  private cnt: number;

  /**
   * FPS計測用に、直近のフレームのタイムスタンプ(ms)を保持する
   * 初回フレームではまだ前フレームが無いため null とする
   */
  private lastTime: number | null;

  /**
   * 直近1秒間に描画したフレーム数をカウントする
   */
  private frameCount: number;

  /**
   * FPSを1秒ごとに集計するための、集計開始タイムスタンプ(ms)
   */
  private fpsTimer: number;

  /**
   * 画面に表示する、確定済みのFPS値
   */
  private fps: number;

  /**
   * 描画先canvasの2Dコンテキスト
   * canvasが取得できない場合は null とする
   */
  private ctx: CanvasRenderingContext2D | null;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.cnt = 0;
    this.lastTime = null;
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.fps = 0;

    // dist/index.html の canvas(id="maincanvas") を取得し、2Dコンテキストを得る
    const canvas = document.getElementById("maincanvas") as HTMLCanvasElement | null;
    this.ctx = canvas ? canvas.getContext("2d") : null;
  }

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new Controller();

  /**
   * 1フレーム単位で実行される更新処理
   */
  public update = () => {
    this.cnt = this.cnt + 1;

    // 現在時刻(ms)を取得する
    const now = performance.now();

    if (this.lastTime === null) {
      // 初回フレームは差分が計算できないため、基準時刻の初期化のみ行う
      this.lastTime = now;
      this.fpsTimer = now;
    } else {
      // このフレームを1枚としてカウントする
      this.frameCount = this.frameCount + 1;

      // 前回集計から1秒(1000ms)経過したらFPSを確定し、カウンタをリセットする
      if (now - this.fpsTimer >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.fpsTimer = now;
      }

      this.lastTime = now;
    }

    // canvasが利用可能なら、左上にFPSを描画する
    if (this.ctx) {
      // 前フレームの文字が残らないよう、描画領域をクリアしてから書き直す
      this.ctx.clearRect(0, 0, 120, 24);
      this.ctx.fillStyle = "#000";
      this.ctx.font = "16px monospace";
      this.ctx.textBaseline = "top";
      this.ctx.fillText("FPS: " + this.fps, 8, 8);
    }
  };
}
