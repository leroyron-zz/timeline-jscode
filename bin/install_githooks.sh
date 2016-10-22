#!/bin/sh
# Creates symlinks inside .git/hooks
# This will clobber any existing hooks in .git/hooks

repo_dir="$(git rev-parse --show-toplevel)"
src_dir="$repo_dir/githooks"
hook_dir="$repo_dir/.git/hooks"
ln --verbose --symbolic --force "$src_dir"/* "$hook_dir"
