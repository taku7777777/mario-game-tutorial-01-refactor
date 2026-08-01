/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   */
  private cnt: number;

  /**
   * FPS計測用の状態
   * lastTime: 前フレームの計測時刻(ミリ秒)
   * fps: 直近に算出したFPSの値
   */
  private lastTime: number;
  private fps: number;

  /**
   * 描画対象のcanvasの2Dコンテキスト
   * (dist/index.html の <canvas id="maincanvas"> を参照する)
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.cnt = 0;
    this.lastTime = performance.now();
    this.fps = 0;

    const canvas = document.getElementById("maincanvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
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

    // 前フレームからの経過時間からFPSを算出する
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    if (delta > 0) {
      this.fps = 1000 / delta;
    }

    // canvasの左上に "FPS: NN" と描画する
    this.ctx.clearRect(0, 0, 80, 24);
    this.ctx.fillStyle = "#000";
    this.ctx.font = "16px monospace";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("FPS: " + Math.round(this.fps), 4, 4);
  };
}
