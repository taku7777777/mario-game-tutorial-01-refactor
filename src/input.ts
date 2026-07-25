/**
 * キーボードの入力状態を保持するクラス
 * windowのkeydown/keyupを監視し、方向キーの押下状態を保持する
 */ export class KeyInput {
  /**
   * フレーム毎の更新において、状態を保持する必要があるものは、
   * private変数として宣言する必要がある
   * (それぞれ左右方向キーが押下中かどうかを保持する)
   */
  private leftPressed: boolean;
  private rightPressed: boolean;

  /**
   * constructorは利用させないようにする
   * (生成時にwindowへのイベントリスナー登録を行う)
   */
  private constructor() {
    this.leftPressed = false;
    this.rightPressed = false;

    /**
     * キーが押された時に、対象のキーであれば押下状態をtrueにする
     */
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") this.leftPressed = true;
      if (e.key === "ArrowRight") this.rightPressed = true;
    });

    /**
     * キーが離された時に、対象のキーであれば押下状態をfalseにする
     */
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") this.leftPressed = false;
      if (e.key === "ArrowRight") this.rightPressed = false;
    });
  }

  /**
   * インスタンス化時には、このstaticな関数を呼ぶようにする
   * (テストのモックが簡易化できるようにする)
   */
  public static createInstance = () => new KeyInput();

  /**
   * 左方向キーが押下中かどうかを返す
   */
  public isLeftPressed = () => this.leftPressed;

  /**
   * 右方向キーが押下中かどうかを返す
   */
  public isRightPressed = () => this.rightPressed;
}
