#!/usr/bin/env node

const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const CONTENT_DIR = path.join(process.cwd(), "content")
const PUBLIC_DIR = path.join(process.cwd(), "public")
const BASE_URL = "https://compile.world"
const CONTENT_BASE_PATH = "/learn"

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

function readMeta(dirPath) {
  const metaPath = path.join(dirPath, "_meta.js")
  if (!fs.existsSync(metaPath)) return null

  try {
    // Read and evaluate the meta file
    const metaContent = fs.readFileSync(metaPath, "utf8")
    // Simple evaluation - in production you might want to use a safer approach
    const metaExport = metaContent.replace("export default", "module.exports =")
    const tempFile = path.join(__dirname, `temp_meta_${Date.now()}.js`)
    fs.writeFileSync(tempFile, metaExport)
    const meta = require(tempFile)
    fs.unlinkSync(tempFile)
    delete require.cache[require.resolve(tempFile)] // Clear cache
    return meta
  } catch (error) {
    console.warn(`Could not read meta file: ${metaPath}`, error.message)
    return null
  }
}

function getMdxFiles(dirPath, baseUrl = CONTENT_BASE_PATH) {
  const files = []

  if (!fs.existsSync(dirPath)) {
    return files
  }

  const items = fs.readdirSync(dirPath)
  const meta = readMeta(dirPath)

  for (const item of items) {
    const itemPath = path.join(dirPath, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      const subFiles = getMdxFiles(itemPath, `${baseUrl}/${item}`)
      files.push(...subFiles)
    } else if (item.endsWith(".mdx") && item !== "_meta.js") {
      const relativePath = path.relative(CONTENT_DIR, itemPath)
      const urlPath = `${baseUrl}/${
        item === "index.mdx" ? "" : item.replace(".mdx", "")
      }`.replace(/\/+/g, "/")

      try {
        const content = fs.readFileSync(itemPath, "utf8")
        const { data: frontmatter, content: markdownContent } = matter(content)

        const title =
          frontmatter.sidebarTitle ||
          frontmatter.title ||
          markdownContent.match(/^#\s+(.+)$/m)?.[1] ||
          item
            .replace(".mdx", "")
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())

        files.push({
          path: relativePath,
          url: urlPath,
          title: title,
          content: markdownContent,
          frontmatter,
        })
      } catch (error) {
        console.warn(`Could not process file: ${itemPath}`, error.message)
      }
    }
  }

  return files
}

function generateLlmsTxt(files) {
  const sections = new Map()

  // Organize files by section
  files.forEach((file) => {
    const pathParts = file.path.split("/")
    let section = "Docs"

    if (pathParts.length > 1) {
      const sectionName = pathParts[0]
      switch (sectionName) {
        // TODO: Get titles from _meta.js or frontmatter
        case "mini-apps-101":
          section = "Mini Apps 101"
          break
        case "your-first-mini-app":
          section = "Getting Started"
          break
        case "guides":
          section = "Guides"
          break
        case "resources":
          section = "Resources"
          break
        case "troubleshooting":
          section = "Troubleshooting"
          break
        case "ai-rules":
          section = "AI Rules"
          break
        case "need-help":
          section = "Optional"
          break
        default:
          section = "Docs"
      }
    }

    if (!sections.has(section)) {
      sections.set(section, [])
    }

    // Generate description from content
    const description = getFileDescription(file.content)
    const link = `[${file.title}](${BASE_URL}${file.url})`
    const entry = description ? `${link}: ${description}` : link

    sections.get(section).push(entry)
  })

  // Generate llms.txt content
  let content = `# Compile the World

> A comprehensive guide for building Mini Apps on Worldchain. This documentation covers everything from basic concepts to advanced development techniques for creating decentralized applications that integrate with World ID verification and the Worldchain ecosystem.

This documentation is designed to help developers build Mini Apps for Worldchain, a blockchain designed for real people using human verification. The content ranges from introductory concepts to detailed technical guides covering smart contracts, payments, user verification, and deployment strategies.

Key areas covered:
- Understanding Worldchain and the Mini Apps ecosystem
- Step-by-step tutorials for building your first Mini App
- Smart contract development and deployment
- Integration with World ID for human verification
- Payment processing and transaction handling
- Troubleshooting common development issues

`

  // Add sections
  for (const [sectionName, sectionFiles] of sections) {
    content += `## ${sectionName}\n\n`
    for (const file of sectionFiles) {
      content += `- ${file}\n`
    }
    content += "\n"
  }

  return content.trim()
}

function generateLlmsFullTxt(files) {
  let content = `# Compile the World - Full Documentation

> Complete documentation for building Mini Apps on Worldchain, including all content from the documentation site.

This is the full expanded version of the Compile the World documentation, containing the complete text of all guides, tutorials, and reference materials.

---

`

  files.forEach((file) => {
    content += `## ${file.title}\n\n`
    content += `Source: ${BASE_URL}${file.url}\n\n`

    // Clean and format the content
    let cleanContent = file.content
      .replace(/import\s+.*?from\s+.*?$/gm, "") // Remove import statements
      .replace(/^---[\s\S]*?---$/m, "") // Remove frontmatter
      .replace(/^\s*$/gm, "") // Remove empty lines
      .trim()

    content += cleanContent + "\n\n---\n\n"
  })

  return content
}

function getFileDescription(content) {
  // Extract a brief description from the content
  let cleanContent = content
    .replace(/import\s+.*?from\s+.*?$/gm, "") // Remove import statements
    .replace(/^---[\s\S]*?---$/m, "") // Remove frontmatter
    .replace(/^\s*$/gm, "") // Remove empty lines
    .trim()

  const lines = cleanContent.split("\n")
  let description = ""
  let foundFirstHeading = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines and imports
    if (!trimmed || trimmed.startsWith("import")) continue

    // Mark when we find the first heading
    if (trimmed.startsWith("#")) {
      foundFirstHeading = true
      continue
    }

    // Look for first substantial content after the heading
    if (foundFirstHeading && trimmed && !trimmed.startsWith("export")) {
      description = trimmed
      break
    }
  }

  // If no description found after heading, get first substantial line
  if (!description) {
    for (const line of lines) {
      const trimmed = line.trim()
      if (
        trimmed &&
        !trimmed.startsWith("#") &&
        !trimmed.startsWith("import") &&
        !trimmed.startsWith("export")
      ) {
        description = trimmed
        break
      }
    }
  }

  // Limit description length
  if (description.length > 120) {
    description = description.substring(0, 117) + "..."
  }

  return description
}

function main() {
  console.log("Generating llms.txt files...")

  try {
    const files = getMdxFiles(CONTENT_DIR)
    console.log(`Found ${files.length} MDX files`)

    // Generate llms.txt
    const llmsTxt = generateLlmsTxt(files)
    fs.writeFileSync(path.join(PUBLIC_DIR, "llms.txt"), llmsTxt)
    console.log("Generated llms.txt")

    // Generate llms-full.txt
    const llmsFullTxt = generateLlmsFullTxt(files)
    fs.writeFileSync(path.join(PUBLIC_DIR, "llms-full.txt"), llmsFullTxt)
    console.log("Generated llms-full.txt")

    console.log("✅ Successfully generated llms.txt files!")
  } catch (error) {
    console.error("❌ Error generating llms.txt files:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { main, generateLlmsTxt, generateLlmsFullTxt, getMdxFiles }
