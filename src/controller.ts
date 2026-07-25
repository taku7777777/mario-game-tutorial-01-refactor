/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * 固定ステップの更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   * ここでは経過した総ステップ数を保持する
   */
  private cnt: number;

  /**
   * constructorは利用させないようにする
   */
  private constructor() {
    this.cnt = 0;
  }

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new Controller();

  /**
   * 1ステップ(固定タイムステップ)単位で実行される更新処理
   * フレームレートに依存しないよう、1回の呼び出しで1ステップ分だけ進める
   */
  public update = () => {
    // ここに更新処理を記載する、暫定的に経過した総ステップ数を加算する処理を記載
    this.cnt = this.cnt + 1;
  };

  /**
   * これまでに経過した総ステップ数を取得する
   */
  public get stepCount(): number {
    return this.cnt;
  }
}
