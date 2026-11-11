# download_images.R
#
# Copies every photo from the Squarespace site into this repository's
# images/ folder so the GitHub Pages site no longer depends on Squarespace.
#
# RUN THIS BEFORE YOU CANCEL SQUARESPACE. Once the Squarespace site is
# closed, these image URLs stop working.
#
# Usage (from the top level of the website folder, where index.html lives):
#   Rscript tools/download_images.R
# or in an R session:
#   setwd("path/to/photo_website"); source("tools/download_images.R")
#
# The script is safe to re-run: files that already exist are skipped, so
# if the connection drops just run it again to pick up where it left off.
# Base R only; no packages required.

if (!file.exists("index.html") || !file.exists("tools/image_manifest.csv")) {
  stop("Run this from the top level of the website folder (the one containing index.html).")
}

options(timeout = max(300, getOption("timeout")),
        HTTPUserAgent = "Mozilla/5.0 (Macintosh) R download_images.R")

manifest <- read.csv("tools/image_manifest.csv", stringsAsFactors = FALSE)
n <- nrow(manifest)
todo <- which(!file.exists(manifest$dest) | file.size(manifest$dest) %in% 0)
message(sprintf("%d images in manifest, %d already present, %d to download.",
                n, n - length(todo), length(todo)))

failed <- character(0)
for (k in seq_along(todo)) {
  i <- todo[k]
  dest <- manifest$dest[i]
  dir.create(dirname(dest), recursive = TRUE, showWarnings = FALSE)
  ok <- tryCatch({
    download.file(manifest$url[i], dest, mode = "wb", quiet = TRUE)
    file.exists(dest) && file.size(dest) > 0
  }, error = function(e) FALSE, warning = function(w) FALSE)
  if (!ok) {
    if (file.exists(dest)) file.remove(dest)
    failed <- c(failed, dest)
  }
  if (k %% 25 == 0 || k == length(todo)) {
    message(sprintf("  %d / %d done (%d failed so far)", k, length(todo), length(failed)))
  }
}

if (length(failed)) {
  writeLines(failed, "tools/failed_downloads.txt")
  message(sprintf("\n%d downloads failed; listed in tools/failed_downloads.txt. Run the script again to retry.",
                  length(failed)))
} else {
  if (file.exists("tools/failed_downloads.txt")) file.remove("tools/failed_downloads.txt")
  total_mb <- sum(file.size(manifest$dest), na.rm = TRUE) / 1024^2
  message(sprintf("\nAll %d images downloaded (%.0f MB total).", n, total_mb))
}
