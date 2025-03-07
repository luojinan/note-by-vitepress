monorepo 是代码管理方式的一种，和我们现在常用的多仓库管理一样

比如多个前端工程需要共用一套公共组件库，就会把公共组件库单独作为一个仓库管理，并通过 npm 私有库发布共用

## TODO

很多人用 pnpm 搭建 monorepo，只是把一些 util、component 迁移起来，跟不使用 monorepo 时完全一样，优点时有其他业务项目，省去了发布 npm 依赖包的麻烦。...

但实际上，tuborepo，会把 monorepo 中所有复用的东西，如：打包工具、开发配置、css 配置等都复用起来，而不用在 util、component 时各自安装配置

[為什麼使用 Turborepo 同時需要使用 pnpm workspace？](https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/%E7%82%BA%E4%BB%80%E9%BA%BC%E4%BD%BF%E7%94%A8-turborepo-%E5%90%8C%E6%99%82%E9%9C%80%E8%A6%81%E4%BD%BF%E7%94%A8-pnpm-workspace-9f0899c90d44)

[turborepo](https://turbo.build/repo/docs)

[带你了解更全面的 Monorepo - 优劣、踩坑、选型](https://juejin.cn/post/7215886869199896637?searchId=20250107110913A35062A9FB0E6C01623B)

[从零到一使用 turborepo + pnpm 搭建企业级 Monorepo 项目](https://juejin.cn/post/7343156956665839651?searchId=20250107110913A35062A9FB0E6C01623B)

[tailwind turborepo](https://github.com/vercel/turborepo/tree/main/examples/with-tailwind)

## 下

使用 pnpm 自带的 workspace 实现 monorepo 即可

把以前一个前端工程的思维转变过来
如一个前端工程包括业务页面组件、公共业务组件、公共基础组件、公共方法
这些都可以作为小 package 之后，可以单独打包放到别的地方用

当出现多个前端工程时就可以直接使用了

所以以后的 demo 工程也可以直接 monorepo 管理，虽然没有多个工程体现不出来作用
比如 vue 团队的 SFC、router、pinal 就从 vue 框架独立出来了

因此这里描述一下创建一个工程的步骤

1. 新建目录 anBoom

```bash
pnpm init -y
```

2. 新建目录 anBoom/packages

3. 新建 workspace 配置文件 pnpm-workspace.yaml

```bash
packages:
  # 所有在 packages/  子目录下的 package
  - 'packages/**'
  # 不包括在 test 文件夹下的 package
  - '!**/test/**'
```

4. 创建 node 脚本，一键创建子包

```js
import { promises } from 'fs'
import path from 'path'
import util from 'util'
import { exec } from 'child_process'

const execAsync = util.promisify(exec)
const [prefix, dirString] = process.argv[2].split('.')
let dirs = dirString.split('|')
const pkg = 'packages'

;(async () => {
  await promises.mkdir(pkg)
  dirs.forEach(async (i) => {
     const absPath = path.resolve(pkg, i)
     await promises.mkdir(absPath)
     const packageJson = path.resolve(absPath, 'package.json')
     await execAsync('pnpm init', { cwd: absPath })
     let file = await promises.readFile(packageJson, { encoding: 'utf-8' })
     const fileJson = JSON.parse(file)
     fileJson.name = `${prefix}/${fileJson.name}`
     await promises.writeFile(packageJson, JSON.stringify(fileJson, null, 4))
  })
})()
```

5. 执行 node 脚本创建子包

```bash
node createPackages.mjs "@monorepo.components|utils|h5|pc-innermanage|官网|server"
```

6. 安装全局依赖

```bash
pnpm i typescript vite eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -w -D
```

- 根目录创建 .eslintrc tsconfig.json 配置文件 子包使用。./取仓库的配置
-

- 安装局部依赖

```bash
pnpm i axios --filter @anBoom/utils
```

注意这里指定子包，用子包 package.json 里的 name 来指定，而不是目录

--filter 还可用于批量执行子包的脚本

```bash
pnpm --filter=@qftjs/* run build
```

7. 子包之间相互引用

```bash
pnpm i @anBoom/package2 -r --filter @anBoom/package1
```

package1 中 引入 package2

更新子包，在运行 publish , 会自动更新引用方的依赖配置

8. 实现 cli 用于其他子包引入使用
9.

这些步骤抽成脚手架？

## Tuborepo

Turborepo 是一个高性能的构建工具，特别为 JavaScript 和 TypeScript Monorepo 设计 [1](https://turbo.build/repo/docs)。它通过缓存、并行处理和增量构建等优化手段，显著提升构建速度 [2](https://earthly.dev/blog/build-monorepo-with-turporepo/)。

使用 Turborepo 搭建一个 Monorepo 项目，并集成 Vite、React、Biome、TypeScript、Tailwind CSS 和 DaisyUI 等常用库。

### 2. 创建 Monorepo 骨架

使用 Turborepo CLI 创建基础项目结构 [3](https://gist.github.com/cedrickchee/dfdb66c457c7b9e1682feedcc4fd6302):

```bash
npx create-turbo@latest
```

在交互式命令行中，选择项目名称和包管理器。Turborepo 将生成一个包含 `apps` 和 `packages` 目录的基本结构。

- `apps`: 用于存放应用程序，例如前端 Web 应用、后端 API 服务等。
- `packages`: 用于存放可共享的库和工具，例如 UI 组件库、工具函数等。

### 3. 项目结构规划

根据项目需求，规划 Monorepo 的目录结构。一个典型的结构如下：

```
monorepo/
├── apps/
│   ├── web/          # 前端 Web 应用 (React + Vite)
│   └── docs/         # 文档站点 （可选）
├── packages/
│   ├── ui/           # UI 组件库 (React + Tailwind CSS + DaisyUI)
│   ├── utils/        # 工具函数库
│   └── eslint-config-custom/  # 自定义 ESLint 配置
├── turbo.json      # Turborepo 配置文件
└── package.json    # 根目录 package.json
```

### 4. 集成 Vite 和 React (apps/web)

进入 `apps/web` 目录，初始化 Vite + React 项目：

```bash
cd apps/web
pnpm create vite . --template react-ts # or npm/yarn
```

按照提示完成项目初始化。

### 5. 集成 Tailwind CSS 和 DaisyUI (packages/ui)

进入 `packages/ui` 目录，创建一个 React 组件库：

```bash
cd ../packages/ui
mkdir src
touch src/index.tsx
```

安装 Tailwind CSS、DaisyUI 和相关依赖：

```bash
pnpm add -D tailwindcss postcss autoprefixer daisyui
```

生成 `tailwind.config.js` 和 `postcss.config.js` 文件：

```bash
npx tailwindcss init -p
```

配置 `tailwind.config.js`，引入 DaisyUI 插件：

```javascript project="Monorepo" file="tailwind.config.js" version=1
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
```

在 `src/index.tsx` 中创建一个简单的组件：

```typescript project="Monorepo" file="packages/ui/src/index.tsx" version=1
import React from 'react';
import './index.css';

export const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <button className="btn btn-primary">{children}</button>;
};
```

创建一个 `packages/ui/src/index.css` 文件，并添加 Tailwind CSS 指令：

```css project="Monorepo" file="packages/ui/src/index.css" version=1
@tailwind base;
@tailwind components;
@tailwind utilities;
```

在 `packages/ui/package.json` 中配置构建脚本：

```json project="Monorepo" file="packages/ui/package.json" version=1
{
  "name": "@monorepo/ui",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "vite build && tsc -p tsconfig.json",
    "dev": "vite",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "clean": "rm -rf dist",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.17",
    "daisyui": "^4.7.2",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.6.4"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
}
```

配置 `vite.config.ts`：

```typescript project="Monorepo" file="packages/ui/vite.config.ts" version=1
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({
    insertTypesEntry: true,
  })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'UI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

### 6. 配置 Biome

在 monorepo 根目录下安装 Biome：

```bash
pnpm add -D @biomejs/biome
```

在 `package.json` 中添加 Biome 相关命令：

```json project="Monorepo" file="package.json" version=1
{
  "scripts": {
    "biome": "biome format ./ --write && biome lint ./ --apply",
    "check": "biome check --apply"
  }
}
```

运行 Biome 命令格式化和检查代码：

```bash
pnpm biome
```

### 7. 配置 Turborepo

在根目录下的 `turbo.json` 文件中，定义构建任务和依赖关系：

```json project="Monorepo" file="turbo.json" version=1
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^typecheck"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    },
    "biome": {
      "cache": false
    },
    "check": {
      "cache": false
    }
  }
}
```

- `dependsOn`: 定义任务的依赖关系，`^` 表示依赖于所有依赖包的同名任务。
- `outputs`: 定义任务的输出目录，Turborepo 会缓存这些目录，以便下次构建时直接使用。
- `cache`: 是否启用缓存，`false` 表示禁用缓存。
- `persistent`: 是否持久化任务，`true` 表示在后台运行任务。

### 8. 在 Web 应用中使用 UI 组件

在 `apps/web` 项目中，安装 `packages/ui` 组件库：

```bash
cd ../apps/web
pnpm add @monorepo/ui
```

在 `apps/web/src/App.tsx` 中引入并使用 UI 组件：

```typescript project="Monorepo" file="apps/web/src/App.tsx" version=1
import React from 'react';
import { Button } from '@monorepo/ui';
import './App.css';

function App() {
  return (
    <div className="App">
      <Button>Hello DaisyUI</Button>
    </div>
  );
}

export default App;
```

### 9. 运行项目

在 Monorepo 根目录下，运行以下命令：

- `pnpm run dev`: 启动所有应用的开发服务器。
- `pnpm run build`: 构建所有应用和库。
- `pnpm run lint`: 检查所有代码的 Lint 错误。
- `pnpm run typecheck`: 检查所有代码的 TypeScript 类型错误。
- `pnpm run clean`: 清理所有构建产物。

## 重构为 Turborepo

1. **创建 Monorepo 骨架：**

使用 Turborepo CLI 创建基础项目结构：

```bash
npx create-turbo@latest --empty
```

使用 `--empty` 参数创建一个空的 Turborepo 项目。

1. **移动现有项目：**

将现有的应用程序和库移动到 `apps` 和 `packages` 目录下。例如，将一个名为 `my-app` 的 React 应用移动到 `apps/web` 目录：

```bash
mv ../my-app apps/web
```

1. **更新 `package.json`:**

- 在 Monorepo 根目录下的 `package.json` 文件中，添加 `workspaces` 字段，指定 `apps` 和 `packages` 目录：

```json project="Monorepo" file="package.json" version=2
{
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "pnpm@latest"
}
```

- 在每个应用程序和库的 `package.json` 文件中，更新 `name` 字段，添加命名空间前缀，例如 `@monorepo/my-app`。

1. **安装 turbo 依赖：**

在 Monorepo 根目录下，运行 `pnpm install` 或 `yarn install` 安装所有依赖。

1. **配置 Turborepo:**

在根目录下的 `turbo.json` 文件中，定义构建任务和依赖关系。

1. **代码调整：**

- 如果应用程序和库之间存在依赖关系，需要更新代码中的 import 路径，使用新的命名空间前缀。
- 检查代码是否存在重复的依赖，尽量将公共依赖提升到 Monorepo 根目录

- **逐步迁移：** 建议逐步将旧项目重构为 Turborepo，先迁移一部分应用程序和库，验证配置和构建流程，再逐步迁移剩余部分。
