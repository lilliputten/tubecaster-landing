#!/bin/sh
# @desc Check if publish folder is absent
# @changed 2024.12.11, 02:49

# Publish folder should be absent...
if [ -d "$PUBLISH_FOLDER" ]; then
  echo "Publish folder already exists!"
  echo "Remove it first for re-initializing using command:"
  echo "'rm -Rf "$PUBLISH_FOLDER" ".gitmodules" ".git/modules/$PUBLISH_FOLDER"'"
  echo "or"
  echo "'sh utils/publish-uninit.sh'."
  exit # Successfull exit
fi

