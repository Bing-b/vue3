type Recordable<T = any> = Record<string, T>;

// 虚假进程
interface FakeProgressOptions {
  timeConstant: number;
  autoStart?: boolean;
  parent?: FakeProgress;
  parentStart?: number;
  parentEnd?: number;
}

declare module 'fake-progress' {
  export = FakeProgress;

  class FakeProgress {
    constructor(opts: FakeProgressOptions);

    progress: number;

    createSubProgress(opts: FakeProgressOptions): FakeProgress;

    end(): void;

    setProgress(progress: number): void;

    start(): void;

    stop(): void;
  }
}
