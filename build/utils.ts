import { resolve } from 'path';
import { name, version, dependencies, devDependencies } from '../package.json';
import dayjs from 'dayjs';

/** 启动`node`进程时所在工作目录的绝对路径 */
const root: string = process.cwd();

/** 平台的名称、版本、运行所需的`node`和`pnpm`版本、依赖、最后构建时间的类型提示 */
const __APP_INFO__ = {
  pkg: { name, version, dependencies, devDependencies },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

/** 设置别名 */
const pathResolve = (dir: string): string => resolve(__dirname, dir);
const alias: Record<string, string> = {
  '@': pathResolve('../src'),
};

/** 导入文件时想要省略的扩展名列表 */
const extensions: Array<string> = ['.js', '.ts', '.jsx', '.tsx', '.json','.d.ts'];

/** 处理环境变量 */
const warpperEnv = (envConf: Recordable): ViteEnv => {
  const ret: ViteEnv = {
    VITE_PORT: 8848,
    VITE_PUBLIC_PATH: '/',
    VITE_CDN: false,
  };

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;
    if (envName === 'VITE_PORT') realName = Number(realName);
    ret[envName] = realName;
    if (typeof realName === 'string') {
      process.env[envName] = realName;
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
};

export { root, alias, extensions, warpperEnv, pathResolve, __APP_INFO__ };
