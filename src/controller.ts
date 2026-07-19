/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   */
  private cnt: number;

  /**
   * ジャンプの物理状態
   * y: 地面からの高さ(0 が接地)、vy: 垂直方向の速度、onGround: 接地判定
   */
  private y: number;
  private vy: number;
  private onGround: boolean;

  /** ジャンプの初速(1フレームあたりの上昇量) */
  private static readonly JUMP_VELOCITY = 12;
  /** 毎フレーム速度に加算される重力加速度(下向き) */
  private static readonly GRAVITY = 0.6;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.cnt = 0;
    this.y = 0;
    this.vy = 0;
    this.onGround = true;

    // スペースキーの押下でジャンプを開始する
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") this.jump();
    });
  }

  /**
   * 接地しているときだけ初速を与えてジャンプを開始する
   * (空中での多段ジャンプを防ぐため onGround を条件にする)
   */
  private jump = () => {
    if (!this.onGround) return;
    this.vy = Controller.JUMP_VELOCITY;
    this.onGround = false;
  };

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new Controller();

  /**
   * 1フレーム単位で実行される更新処理
   */
  public update = () => {
    // ここに更新処理を記載する、暫定的にカウントをconsoleに吐き出す処理を記載
    this.cnt = this.cnt + 1;
    console.log("start update alert, cnt = " + this.cnt);

    // 重力を速度に加算し、速度で高さを更新して放物線状の落下を再現する。地面(0)に達したら接地状態へ戻す
    this.vy = this.vy - Controller.GRAVITY;
    this.y = this.y + this.vy;
    if (this.y <= 0) {
      this.y = 0;
      this.vy = 0;
      this.onGround = true;
    }
  };
}
