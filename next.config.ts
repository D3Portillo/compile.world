import nextra from "nextra"

// Set up Nextra with its configuration
const withNextra = nextra({
  contentDirBasePath: "/learn",
  defaultShowCopyCode: true, // Enable copy code by default
  search: {
    codeblocks: false, // Disable search in code blocks
  },
})

export default withNextra({
  devIndicators: false,
})
