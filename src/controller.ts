import {
  JumpState,
  createInitialJumpState,
  startJump,
  stepJump,
} from "./physics";

/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   */
  private cnt: number;

  /**
   * ジャンプの物理状態。
   * 実際の計算はphysics.tsの純粋関数に委譲し、ここでは状態のみを保持する。
   */
  private jumpState: JumpState;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.cnt = 0;
    this.jumpState = createInitialJumpState();
  }

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new Controller();

  /**
   * ジャンプを開始する。
   * 接地しているときのみ有効(判定はphysics.ts側の純粋関数が行う)。
   */
  public jump = () => {
    this.jumpState = startJump(this.jumpState);
  };

  /**
   * 1フレーム単位で実行される更新処理
   */
  public update = () => {
    // ここに更新処理を記載する、暫定的にカウントをconsoleに吐き出す処理を記載
    this.cnt = this.cnt + 1;
    console.log("start update alert, cnt = " + this.cnt);

    // ジャンプの物理更新(重力・縦位置更新・着地判定)は
    // physics.tsの純粋関数stepJumpに委譲する。
    this.jumpState = stepJump(this.jumpState);
  };
}
