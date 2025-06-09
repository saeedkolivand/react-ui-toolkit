#!/usr/bin/env node

const { execSync } = require("child_process");
const { exit } = require("process");

// Get command line arguments
const args = process.argv.slice(2);
const versionType = args[0];
const commitMessage = args[1] || "fix: button visibility and CSS loading issues";

if (!versionType || !["patch", "minor", "major"].includes(versionType)) {
  console.error("Error: Please provide a valid version argument (patch, minor, or major)");
  console.error('Usage: node scripts/release.js patch|minor|major ["commit message"]');
  exit(1);
}

// Execute shell commands with proper error handling
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main release process
function release() {
  console.log(`\n🚀 Starting release process (${versionType})...\n`);

  // Stage all changes
  if (!runCommand("git add .")) {
    console.error("Failed to stage changes. Aborting.");
    exit(1);
  }

  // Commit changes
  if (!runCommand(`git commit -m "${commitMessage}"`)) {
    console.error("Failed to commit changes. Aborting.");
    exit(1);
  }

  // Push to remote
  if (!runCommand("git push origin HEAD")) {
    console.error("Failed to push changes. Aborting.");
    exit(1);
  }

  // Bump version
  if (!runCommand(`npm version ${versionType} -m "chore(release): bump version to %s"`)) {
    console.error("Failed to bump version. Aborting.");
    exit(1);
  }

  // Build the package
  if (!runCommand("npm run build")) {
    console.error("Failed to build package. Aborting.");
    exit(1);
  }

  // Publish to npm
  if (!runCommand("npm publish --access public")) {
    console.error("Failed to publish to npm. Aborting.");
    exit(1);
  }

  // Push the new version tag
  if (!runCommand("git push --follow-tags")) {
    console.error("Failed to push tags. Aborting.");
    exit(1);
  }

  console.log("\n✅ Successfully released new version!\n");
}

// Run the release process
release();
