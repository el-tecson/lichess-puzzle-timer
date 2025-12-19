# How to build and zip the file
```bash
npm run build
tmp=lichess-puzzle-timer && cp -r dist "$tmp" && zip -r "$tmp.zip" "$tmp" && rm -rf "$tmp"
```