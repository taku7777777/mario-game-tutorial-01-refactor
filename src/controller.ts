/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * 描画対象となるcanvasのid
   * dist/index.html の <canvas id="maincanvas"> と一致させる必要があるため、
   * 参照箇所に散らばらないよう定数として一箇所に集約する
   */
  private static readonly CANVAS_ID = "maincanvas";

  /**
   * FPS表示を更新する間隔(ミリ秒)
   * 毎フレームの瞬時値をそのまま表示すると値が激しく振れて読めないため、
   * この間隔ごとに区間平均を取り直して表示値を更新する
   */
  private static readonly FPS_UPDATE_INTERVAL_MS = 500;

  /**
   * FPS文字列の描画スタイルと位置
   * 「なぜこの値か」ではなく「何を表す値か」を名前で示すことで、
   * マジックナンバーが更新処理・消去処理の両方に散らばるのを防ぐ
   */
  private static readonly TEXT_COLOR = "#000";
  private static readonly TEXT_FONT = "16px monospace";
  private static readonly TEXT_ORIGIN_X = 4;
  private static readonly TEXT_ORIGIN_Y = 4;

  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   */

  /**
   * 起動からの累計フレーム数
   * 現状は直接表示していないが、今後アニメーションのコマ送りや
   * 一定フレーム毎の処理(敵の出現など)の基準として使う想定のため残している
   */
  private cnt: number;

  /**
   * FPSの区間平均を求めるための状態
   * lastTime: 前フレームの時刻(ミリ秒)。初回フレームはまだ差分を取れないため
   *           nullで「未計測」を表し、最初のupdateで初期化する
   *           (コンストラクタで初期化すると、生成からloadイベントまでの時間が
   *            初回deltaに混入し、最初の1フレームだけ異常値になるのを避けるため)
   * frameCount / elapsedMs: 直近の表示更新からの累積フレーム数と累積経過時間
   * fps: 現在表示しているFPS値
   */
  private lastTime: number | null;
  private frameCount: number;
  private elapsedMs: number;
  private fps: number;

  /**
   * 描画対象のcanvasの2Dコンテキスト
   */
  private ctx: CanvasRenderingContext2D;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.cnt = 0;
    this.lastTime = null;
    this.frameCount = 0;
    this.elapsedMs = 0;
    this.fps = 0;

    /**
     * canvasの取得をnull安全に行う
     * strict: true 環境ではasによる二重キャストで型チェックを迂回できてしまうが、
     * それでは要素の欠落やcontext取得失敗が実行時まで隠れてしまう。
     * 教材として「落ちたときに理由が読み手へ伝わる」ことを優先し、
     * instanceof と null 検査で確認したうえで、原因入りのErrorを投げる
     */
    const element = document.getElementById(Controller.CANVAS_ID);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(
        `canvas要素「${Controller.CANVAS_ID}」が見つかりません`
      );
    }
    const ctx = element.getContext("2d");
    if (ctx === null) {
      throw new Error("canvasの2D描画コンテキストを取得できませんでした");
    }
    this.ctx = ctx;
  }

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new Controller();

  /**
   * 1フレーム単位で実行される更新処理
   * @param timestamp requestAnimationFrameから渡されるそのフレームの時刻(ミリ秒)
   *
   * このメソッドは「状態の更新」に専念させ、canvasへの描画はdraw()へ分離する。
   * リファクタリング教材として、1メソッドに更新と描画を同居させない狙い
   */
  public update = (timestamp: number) => {
    this.cnt = this.cnt + 1;

    // ここにゲーム本体の状態更新処理(自機や敵の移動など)を追加していく

    this.measureFps(timestamp);
    this.draw();
  };

  /**
   * FPSの計測(状態更新のみ、描画はしない)
   *
   * 初回フレームはlastTimeが未計測のため、時刻を記録するだけで差分は取らない。
   * 以降はFPS_UPDATE_INTERVAL_MSを超えるまでフレーム数と経過時間を溜め、
   * 超えたら区間平均 fps = frameCount / (elapsedMs / 1000) を算出して表示値を更新する
   */
  private measureFps = (timestamp: number) => {
    if (this.lastTime === null) {
      this.lastTime = timestamp;
      return;
    }

    const delta = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.frameCount = this.frameCount + 1;
    this.elapsedMs = this.elapsedMs + delta;

    if (this.elapsedMs >= Controller.FPS_UPDATE_INTERVAL_MS) {
      this.fps = Math.round((this.frameCount * 1000) / this.elapsedMs);
      this.frameCount = 0;
      this.elapsedMs = 0;
    }
  };

  /**
   * canvasへの描画(FPS表示)
   *
   * 消去範囲は固定幅にせず、実際に描く文字列のmeasureTextから導出する。
   * 16px monospaceの字送りでは "FPS: 120"(3桁)が固定80pxを超えて消し残るため、
   * 120Hz環境でも消し残りが出ないよう文字メトリクスに追従させる
   */
  private draw = () => {
    const text = "FPS: " + this.fps;

    // measureTextは現在のfont設定に依存するため、計測より前にfontを設定する
    this.ctx.font = Controller.TEXT_FONT;
    const metrics = this.ctx.measureText(text);

    // 前フレームの文字が残らないよう、原点+文字幅+左右の余白ぶんを消去する
    const clearWidth = Controller.TEXT_ORIGIN_X * 2 + metrics.width;
    const clearHeight = Controller.TEXT_ORIGIN_Y * 2 + 16;
    this.ctx.clearRect(0, 0, clearWidth, clearHeight);

    this.ctx.fillStyle = Controller.TEXT_COLOR;
    this.ctx.textBaseline = "top";
    this.ctx.fillText(text, Controller.TEXT_ORIGIN_X, Controller.TEXT_ORIGIN_Y);
  };
}
