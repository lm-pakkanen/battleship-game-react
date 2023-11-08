export class AlertQueue {
  private q: string[];

  constructor() {
    this.q = [];
    this.startWorker();
  }

  public alert(msg: string) {
    this.q.push(msg);
  }

  private startWorker() {
    setInterval(() => {
      const msg = this.q.shift();

      if (msg) {
        alert(msg);
      }
    }, 200);
  }
}
