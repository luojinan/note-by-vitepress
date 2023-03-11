#!/usr/bin/env node

// 当前运行命令的包管理器
const userAgent = process.env.npm_config_user_agent // --> pnpm/7.7.0 npm/? node/v16.14.2 darwin arm64
const [pmSpec] = userAgent.split(' ')
const [runName] = pmSpec.split('/')

// 当前项目限制的期望包管理器
const argv = process.argv.slice(2)
const wantedPM = argv[0]

if(runName !== wantedPM) {
  console.log(`💢 you need use ${wantedPM} in this progrem`)
  process.exit(1)
}

console.log(`😄 yep! ${wantedPM} is right`)