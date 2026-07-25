/**
 * 重力加速度(1フレームあたりに垂直速度へ加算する量)
 */
const GRAVITY = 0.5;

/**
 * プレイヤーを描画する矩形のサイズ
 */
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;

/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   */
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  /**
   * プレイヤーの位置(x, y)と垂直速度(vy)
   * yは矩形の上端の座標として扱う
   */
  private playerX: number;
  private playerY: number;
  private playerVy: number;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    /**
     * dist/index.html に配置済みのcanvasを取得し、
     * 2D描画コンテキストを保持する
     */
    this.canvas = document.getElementById("maincanvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    /**
     * プレイヤーの初期状態(画面上部から落下させる)
     */
    this.playerX = 100;
    this.playerY = 0;
    this.playerVy = 0;
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
    /**
     * 重力加速度を垂直速度に加算し、垂直速度の分だけyを更新する
     */
    this.playerVy = this.playerVy + GRAVITY;
    this.playerY = this.playerY + this.playerVy;

    /**
     * canvasの下端を地面とし、地面に達したら
     * yを地面に合わせてvyを0にする
     */
    const groundY = this.canvas.height - PLAYER_HEIGHT;
    if (this.playerY >= groundY) {
      this.playerY = groundY;
      this.playerVy = 0;
    }

    /**
     * 更新後の状態を毎フレーム描画する
     */
    this.draw();
  };

  /**
   * 毎フレームcanvasをクリアしてから、プレイヤーを矩形で描画する
   */
  private draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(this.playerX, this.playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
  };
}
