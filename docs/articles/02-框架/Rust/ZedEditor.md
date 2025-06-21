# Zed Editor

很多内置功能，只装了一个 vue 的 language extensions

其他的就是按照个人习惯，安装了 one Dark Pro 主题插件、VSCode Icon 插件

用起来确实没有电脑再也没有发烫过 ...而且多个项目启动关闭非常舒畅

## auto formatter

[formatter](https://zed.dev/docs/configuring-languages#formatting-and-linting)
在项目级的 `.zed/settings.json` 配置保存格式化使用 ESLint

```json
{
  "formatter": {
    "code_actions": {
      "source.fixAll.eslint": true
    }
  }
}
```

## 修改布局位置

文件树、git到右侧，AI到左侧

```json
{
  "git_panel": {
    "dock": "right"
  },
  "chat_panel": {
    "dock": "left"
  },
  "outline_panel": {
    "dock": "right"
  },
  "project_panel": {
    "dock": "right"
  }
}
```

## 缺点

在社区有人提出并关注，应该是时间问题：

1. git diff 没找到左右视图的配置，只能显示在diff行下侧
2. AI 不支持自定义url，用不了自定义服务商的ai，只能使用大厂的ai服务，看起来便宜的只有deepseek
  - 通过settings.json修改openai的apiurl和modelname实现，缺点没有可视化交互
3. markdown 插件少，如： preview plugin, pangu plugin, formatter plugin, all in one(数字序列换行自动添加)，而且居然不支持折叠，代码语言是支持的，md链接本地文件也无法跳转
  - [Enhance Markdown editing and preview capabilities #30275](https://github.com/zed-industries/zed/discussions/30275)
4. git history 没找到面板查看分支历史，文件历史，只有line history
  - [Add Git Graph (Source Control Graph) #26866](https://github.com/zed-industries/zed/discussions/26866)
5. Biome 插件不支持2beta版本，只能在eslint项目里有自定义规则的能力


设置openai自定义url，设置默认agent model，设置补全模型(只能选内置的几种)

```json
{
  "language_models": {
     "openai": {
       "version": "1",
       "api_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
       "low_speed_timeout_in_seconds": 600,
       "available_models": [
         {
           "name": "qwen-plus-2025-01-25",
           "max_tokens": 128000
         }
       ]
     }
   },
  "agent": {
    "default_model": {
      "provider": "openai",
      "model": "qwen-plus-2025-01-25"
    },
    "dock": "left",
    "version": "2"
  },
  "features": {
    "edit_prediction_provider": "copilot"
  }
}
```

## 配置

不像VSCode，Zed没有太多可视化的配置，都是打开setting.json来写配置，这似乎只能对着官方文档来写，虽然文档写得很清晰，如果对英语很熟悉一般可以直接search到想要的关键词然后配置好，但这种配置IDE的方式还是很不习惯

[formatter](https://zed.dev/docs/configuring-zed#formatter)

👆 按照文档对于保存时自动格式化代码的配置来看，默认已经会到代码做格式化了，但是实际使用下来，不会按照项目代码做格式化、理论上会走进默认格式化，但是也没有格式化，只是报错

```json
{
  "format_on_save": "on",
  "formatter": "auto" // 🤔 看不懂这个auto是什么
}
```
从官方文档的4种方式中看: code_actions就是基于 language_server 的
```json
{
  // 1.
  "formatter": "language_server",
  // 2.use code actions provided by the connected language servers, use "code_actions"
  "formatter": {
    "code_actions": {
      // Use ESLint's --fix:
      "source.fixAll.eslint": true,
      // Organize imports on save:
      "source.organizeImports": true // 自定义了formatter就要手动开启排序，因为默认开启的配置被覆盖了
    }
  },

  // 3.external command
  "formatter": {
    "external": {
      "command": "sed",
      "arguments": ["-e","s/ *$//"]
    }
  },
  // 4.
  "formatter": {
    "external": {
      "command": "prettier",
      "arguments": ["--stdin-filepath", "{buffer_path}"]
    }
  }
}
```

language code_actions 这个配置和 formatter 中的 code_actions 有什么区别？没有区别？只是这个用于针对不同语言使用不同的 code_actions 配置？

```json
{
  "languages": {
    "TypeScript": {
      "code_actions_on_format": {
        "source.organizeImports": true
      }
    },
    "TSX": {
      "code_actions_on_format": {
        "source.organizeImports": true
      }
    },
    "JavaScript": {
      "code_actions_on_format": {
        "source.fixAll.eslint": true
      }
    }
  },
  // Run only a single ESLint rule when using fixAll:
  "lsp": {
    "eslint": {
      "settings": {
        "codeActionOnSave": {
          "rules": ["import/order"]
        }
      }
    }
  }
}
```

神奇的是似乎不需要安装ESLint只是配置就可以使用ESlint了，这是LSP提供的能力吗？

所以应该和 VSCode 一样在项目级的 settings.json 中配置格式化，但是我的问题是一些小项目应该走默认的格式化，但是在我保存时没有格式化？

并不是不会自动格式化，而是因为安装了biome插件，无论项目是否配置biome都进了biome的格式化里....把插件移除就可以了

默认的Vue 的tab缩进看起来怪怪的

不同项目使用了如ESLint和 prettier 或者Biome

在尝试保存时发现没有修改文件格式，以为无缝迁移了，但其实不是，zed做了优化只有在修改了文件时保存才会触发格式化，手动修改一下缩进再保存，发现被Zed按照默认的方式格式化文件了，而不是按照原项目的规则来格式化

如 TS、TSX 似乎被按照默认ts的格式化规则格式化，而不是按照项目的ESlint和prettier规则来格式化

如很多vue项目中编写ts都用单引号且不使用分号，在Zed中修改缩进后保存，被格式化成双引号和分号了，这就是默认ts格式化规则，而不是vue项目中eslint规则

## Biome

本来配置好了eslint的 formatter 但是在安装了 biome插件之后，静态代码检查和格式化都被biome接管，不管项目级别的 settings code_actions 设置了 eslint

[biome-zed issues](https://github.com/biomejs/biome-zed/issues/97)

👆 当前biome插件不支持v2beta版本的biome.config 😕,只会进入默认的格式化配置中，但是默认的格式化配置有无障碍语法的检测，会让代码一堆爆红。另外采用检测配置文件开启biome的配置时，因为这个bug，导致检测config path无效，让biome默认的检测都不会执行，不会爆红，格式化进入lsp默认规则

因此在等biome发布正式版修复才能使用，目前在eslint项目中zed的格式化看起来可以完美兼容

👇 注意插件会全局开启，可以配置为仅在有配置文件 biome.json 时开启

```json
{
  "lsp": {
    "biome": {
      "settings": {
        "require_config_file": true
      }
    }
  }
}
```

👇 也可以改为由配置文件控制开启，全局禁用，无论项目有没有biome.json，都要在zed/setting.json中开启

编辑器配置
```json
{
  "language_servers": [ "!biome", "..." ]
}
```

项目级配置
```json
// <workspace>/.zed/settings.json
{
  "language_servers": [ "biome", "..." ],

  "code_actions_on_format": {
    "source.fixAll.biome": true,
    "source.organizeImports.biome": true
  }
}
```

### VSCode 中的 code_actions

延伸下来，在VSCode中的code_actions是否也是用了 LSP

[eslint readme](https://github.com/microsoft/vscode-eslint?tab=readme-ov-file#version-204)

解释了 ESLint 在VSCode中使用的3种配置情况：

```json
"editor.codeActionsOnSave": {
  // 1. turns on Auto Fix for all providers including ESLint
  "source.fixAll": "explicit",
  // 2. only turns it on for ESLint
  "source.fixAll.eslint": "explicit",
  // 3. disable ESLint
  "source.fixAll": "explicit",
  "source.fixAll.eslint": "never"
}
```

> ESLint extension also respects the generic property source.fixAll.
>
> 👆 尊重协议的意思是，VSCode 会在 `"source.fixAll": "explicit"` 时一轮fixes里使用尽可能多的匹配到的工具，而ESLint就是尊重并提供给VSCode选择的工具，explicit 的是意思是“明确的”，即VSCode把手动保存才定义为explicit，相对应的是“alwer”，在窗口失焦时也会触发fixAll
>
> "fixAll" - Auto Fix on Save computes all **possible** fixes in one round (for all providers including ESLint).

[codeActionsOnSave 官方文档参数说明](https://code.visualstudio.com/docs/editing/refactoring#_code-actions-on-save)

> `codeActionsOnSave` supports the ESLint specific property source.fixAll.eslint
>
> 👆 ESLint 还提供了特殊的 code_actions 命令给 VSCode 使用，`"source.fixAll.eslint": "explicit"`，用于手动配置，而不是依赖于VSCode 的 `possible`


可以知道的是 code_actions 提供了更灵活的配置方式，但是仍然不清楚 formatter 和 code_actions 同时配置的时候的执行机制，以及安装了插件，插件如何影响配置？理想情况是插件不影响配置，必须由用户手动在配置中开启对应的插件，否则安装插件相当于禁用状态

是否需要关闭 editor.formatOnSave 再开启并配置 code_actions

## LSP

在 [Zed 文档](https://next.biomejs.dev/guides/editors/create-a-extension/)中有这样一句

> Biome has LSP first-class support. If your editor does implement LSP, then the integration of Biome should be seamless.
>
> Biome 拥有一流的 LSP 支持。如果您的编辑器支持 LSP，那么 Biome 的集成应该是无缝的。

LSP 是什么？是否意味着不需要安装语言插件就可以直接在支持LSP的编辑器中识别不同的语言，来linter和format？LSP和编辑器语言插件的关系是什么？

[lsp](https://microsoft.github.io/language-server-protocol/)

## keymap

把 左右布局的快捷键改为和VSCode一致

- cmd-b 在 Zed 中始终打开左侧，而不像VSCode把布局移动到右侧之后，这个快捷键就会打开右侧，因此在修改布局为右侧后，要手动覆盖快捷键
- cmd-l 在AI时代的VSCode，打开ai工具使用cmd-l，这会覆盖原来的能力，“选中一行”
- cmd-r 在 Zed 中始终打开右侧，不再使用，但是依旧有效

```json
[
  {
    "context": "Workspace",
    "bindings": {
      // "shift shift": "file_finder::Toggle"
      "cmd-l": "workspace::ToggleLeftDock",
      "cmd-b": "workspace::ToggleRightDock"
    }
  },
  {
    "context": "Editor",
    "bindings": {
      // "j k": ["workspace::SendKeystrokes", "escape"]
      "cmd-l": "workspace::ToggleLeftDock",
      "cmd-shift-v": "markdown::OpenPreviewToTheSide"
    }
  }
]
```

## 最终的setting

最终的setting：包含 1.布局 2.AI 3.主题,缩进风格 4.biome设置

```json
{
  "edit_predictions": {
    "disabled_globs": ["*.md"],
    "mode": "eager",
    "copilot": {
      "proxy": null,
      "proxy_no_verify": null
    },
    "enabled_in_text_threads": false
  },
  "icon_theme": "VSCode Icons (Dark)",
  "ui_font_size": 16,
  "buffer_font_size": 16,
  "theme": {
    "mode": "system",
    "light": "One Dark Pro",
    "dark": "One Dark"
  },
  "base_keymap": "VSCode",
  "telemetry": {
    "diagnostics": false,
    "metrics": false
  },
  "notification_panel": {
    "dock": "right"
  },
  "language_models": {
    "openai": {
      "version": "1",
      "api_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
      "low_speed_timeout_in_seconds": 600,
      "available_models": [
        {
          "name": "qwen-plus-1125",
          "max_tokens": 128000
        },
        {
          "name": "qwen-plus-2025-01-25",
          "max_tokens": 128000
        }
      ]
    }
  },
  "agent": {
    "default_model": {
      "provider": "openai",
      "model": "qwen-plus-2025-01-25"
    },
    "dock": "left",
    "version": "2"
  },
  "git_panel": {
    "dock": "right"
  },
  "chat_panel": {
    "dock": "left"
  },
  "outline_panel": {
    "dock": "right"
  },
  "project_panel": {
    "dock": "right"
  },
  "features": {
    "edit_prediction_provider": "copilot"
  },
  "lsp": {
    "biome": {
      "settings": {
        "require_config_file": true
      }
    }
  }
}
```

项目级配置
[biome zed](https://biomejs.dev/reference/zed/)

```json
// biome 格式化
{
  "tab_size": 2,
  // 👇 不确定是否有效
  "language_servers": ["biome", "..."],
  "formatter": {
    "code_actions": {
      "source.fixAll.biome": true,
      "source.organizeImports.biome": true
    }
  }
}

// eslint 格式化
{
  "formatter": {
    "code_actions": {
      "source.fixAll.eslint": true,
      "source.organizeImports": true
    }
  }
}
```
