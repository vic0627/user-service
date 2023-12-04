import type { Task } from "src/types/schduledTask.type";
import { notNull } from "src/utils/common";

export default class ScheduledTask {
  #tasks = new Map<string, Task>();
  #timer?: number;

  get interval() {
    return 1000 * 60 * 10;
    // return 1000 * 6;
  }

  addTask(task: Task) {
    this.#tasks.set(Math.random().toString(), task);
    this.#schdule();
  }

  addSingletonTask(key: string, task: Task) {
    if (this.#tasks.has(key)) {
      return;
    }

    this.#tasks.set(key, task);
    this.#schdule();
  }

  #schdule() {
    if (notNull(this.#timer)) {
      return;
    }

    // console.log("排程啟動");

    this.#timer = setInterval(() => {
      const size = this.#runTasks();

      if (!size) {
        clearInterval(this.#timer);
        this.#timer = undefined;
        // console.log("排程結束");
      }
    }, this.interval);
  }

  #runTasks() {
    const now = Date.now();

    this.#tasks.forEach((task, token) => {
      const pop = task(now);

      if (pop) {
        this.#tasks.delete(token);
      }
    });

    return this.#tasks.size;
  }
}
