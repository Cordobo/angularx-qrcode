#!/usr/bin/env bash
set -u
set -o pipefail

workflow_dir=".github/workflows"
found=0

warn() {
  printf 'WARN %s: %s. %s\n' "$1" "$2" "$3"
  found=1
}

has_active_match() {
  file_path=$1
  pattern=$2

  test -f "$file_path" && grep -Eq "^[[:space:]]*([^[:space:]#].*)?${pattern}" "$file_path"
}

if ! test -d "$workflow_dir"; then
  echo "No GitHub Actions workflows found."
  exit 0
fi

while IFS= read -r workflow_file; do
  has_pull_request_target=0
  has_cache_usage=0
  has_privileged_permissions=0
  has_pr_head_reference=0
  has_release_deploy_publish=0

  if has_active_match "$workflow_file" "pull_request_target"; then
    warn "$workflow_file" "pull_request_target found" "Do not execute untrusted PR code in privileged workflows."
    has_pull_request_target=1
  fi

  if has_active_match "$workflow_file" "actions/cache"; then
    warn "$workflow_file" "actions/cache usage found" "Use caches only in unprivileged CI jobs and bind keys to lockfiles."
    has_cache_usage=1
  fi

  if has_active_match "$workflow_file" "cache:"; then
    warn "$workflow_file" "setup-node cache usage found" "Use restored caches only in unprivileged CI jobs."
    has_cache_usage=1
  fi

  if has_active_match "$workflow_file" "restore-keys:"; then
    warn "$workflow_file" "restore-keys found" "Avoid broad restore keys that can reuse unrelated cache contents."
    has_cache_usage=1
  fi

  if has_active_match "$workflow_file" "key:[[:space:]]*.*(npm-|node-|linux-|cache-|build-)"; then
    warn "$workflow_file" "broad cache key found" "Use cache keys scoped to OS, package manager, and lockfile hash."
  fi

  if has_active_match "$workflow_file" "actions/cache" &&
    has_active_match "$workflow_file" "path:[[:space:]]*.*(node_modules|dist|build|\\.angular/cache|\\.nx/cache|\\.turbo|\\.next)"; then
    warn "$workflow_file" "build or executable cache path found" "Do not cache executable or build output directories in sensitive workflows."
    has_cache_usage=1
  fi

  if has_active_match "$workflow_file" "(id-token|contents|packages|actions):[[:space:]]*write"; then
    warn "$workflow_file" "privileged workflow permissions found" "Set GITHUB_TOKEN permissions to the minimum required per workflow or job."
    has_privileged_permissions=1
  fi

  if has_active_match "$workflow_file" "(github\\.event\\.pull_request\\.head|pull_request\\.head\\.sha)"; then
    warn "$workflow_file" "pull request head reference found" "Do not checkout or execute untrusted PR head code in privileged workflows."
    has_pr_head_reference=1
  fi

  if has_active_match "$workflow_file" "(release:|deploy|deployment|publish|pages:[[:space:]]*write|npm publish)"; then
    has_release_deploy_publish=1
  fi

  if test "$has_pull_request_target" -eq 1 && test "$has_pr_head_reference" -eq 1; then
    warn "$workflow_file" "pull_request_target with PR head reference" "Never checkout and run untrusted PR code in a privileged workflow."
  fi

  if test "$has_cache_usage" -eq 1 && test "$has_privileged_permissions" -eq 1; then
    warn "$workflow_file" "cache usage in privileged workflow" "Release, deploy, and privileged jobs should avoid restored caches."
  fi

  if test "$has_cache_usage" -eq 1 && test "$has_release_deploy_publish" -eq 1; then
    warn "$workflow_file" "cache usage in release/deploy/publish workflow" "Prefer fresh installs without restored caches for sensitive workflows."
  fi
done < <(find "$workflow_dir" -type f \( -name '*.yml' -o -name '*.yaml' \) -print)

if test "$found" -eq 1; then
  exit 1
fi

echo "No obvious GitHub Actions cache poisoning risks found."
exit 0
