import { mkdir } from "node:fs/promises"
import path from "node:path"

const input = process.argv[2]

if (!input) {
  console.error("❌ Vui lòng nhập đường dẫn, ví dụ: bun create hooks/friend")
  process.exit(1)
}

const basePath = path.resolve(input)

const folders = ["mutations", "queries"]

try {
  for (const folder of folders) {
    await mkdir(path.join(basePath, folder), { recursive: true })
  }

  console.log(`✅ Đã tạo cấu trúc hooks: ${input}`)
  console.log(`📁 ${input}/mutations`)
  console.log(`📁 ${input}/queries`)
} catch (error) {
  console.error("❌ Không thể tạo cấu trúc thư mục:", error)
  process.exit(1)
}
