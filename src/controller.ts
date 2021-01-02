/**
 * 全体の処理の管理を行うコントローラーのクラス
 */ export class Controller {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
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
   * 1フレーム単位で実行される更新処理
   */
  public update = () => {
    // ここに更新処理を記載する、暫定的にカウントをconsoleに吐き出す処理を記載
    this.cnt = this.cnt + 1;
    console.log("start update alert, cnt = " + this.cnt);
  };
}
