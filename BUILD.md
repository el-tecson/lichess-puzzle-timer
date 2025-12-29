# How to build and zip the file
```bash
npm run build
tmp=lichess-puzzle-timer && cp -r dist "$tmp" && zip -r "$tmp.zip" "$tmp" && rm -rf "$tmp"
tmp=lichess-puzzle-timer-firefox && mkdir "$tmp" && cp -r dist/* "$tmp/" && (cd "$tmp" && zip -r ../"$tmp.zip" .) && rm -rf "$tmp"
```