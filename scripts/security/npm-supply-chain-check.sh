#!/usr/bin/env bash
set -u
set -o pipefail

found=0

report() {
  printf '%s\t%s\n' "$1" "$2"
  found=1
}

check_file_for_indicators() {
  file_path=$1

  if test -f "$file_path" && grep -Eq '(router_init\.js|gh-token-monitor)' "$file_path"; then
    report "$file_path" "suspicious npm supply-chain indicator"
  fi
}

check_directory_names() {
  dir_path=$1
  hit_type=$2

  if ! test -d "$dir_path"; then
    return
  fi

  while IFS= read -r hit_path; do
    report "$hit_path" "$hit_type"
  done < <(find "$dir_path" -name '.git' -prune -o \( -name 'router_init.js' -o -name 'gh-token-monitor*' \) -print)
}

check_directory_content() {
  dir_path=$1
  hit_type=$2

  if ! test -d "$dir_path"; then
    return
  fi

  while IFS= read -r hit_path; do
    report "$hit_path" "$hit_type"
  done < <(grep -RIlE '(router_init\.js|gh-token-monitor)' "$dir_path" 2>/dev/null)
}

echo "Checking npm supply-chain indicators..."

check_file_for_indicators "package-lock.json"

check_directory_names "node_modules" "suspicious file"
check_directory_names ".claude" "suspicious file"
check_directory_names ".vscode" "suspicious file"
check_directory_content ".claude" "suspicious editor/agent config indicator"
check_directory_content ".vscode" "suspicious editor config indicator"

case "$(uname -s)" in
  Linux)
    check_directory_names "$HOME/.config/systemd/user" "suspicious user persistence"
    check_directory_content "$HOME/.config/systemd/user" "suspicious user persistence indicator"
    ;;
  Darwin)
    check_directory_names "$HOME/Library/LaunchAgents" "suspicious launch agent"
    check_directory_content "$HOME/Library/LaunchAgents" "suspicious launch agent indicator"
    ;;
esac

echo "Bei Treffern: Maschine isolieren, Persistenz zuerst prüfen/entfernen, danach Tokens rotieren."

if test "$found" -eq 1; then
  exit 1
fi

echo "No suspicious npm supply-chain indicators found."
exit 0
