# How to build and zip the file
```bash
npm run build
tmp=lichess-puzzle-timer && cp -r dist "$tmp" && zip -r "$tmp.zip" "$tmp" && rm -rf "$tmp"
tmp=lichess-puzzle-timer-firefox && mkdir "$tmp" && cp -r dist/* "$tmp/" && (cd "$tmp" && zip -r ../"$tmp.zip" .) && rm -rf "$tmp"
```

then change lichess-puzzle-timer-firefox.zip's manifest.json to:
```json
{
  "name": "Lichess Puzzle Timer, by El-Tecson",
  "description": "Make every puzzle feel like a real game and build habits that actually transfer.",
  "version": "3.2.2",
  "manifest_version": 3,
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "images/lptimer-16.png",
      "32": "images/lptimer-32.png",
      "48": "images/lptimer-48.png",
      "128": "images/lptimer-128.png"
    }
  },
  "background": {
    "scripts": [
      "background.js"
    ]
  },
  "icons": {
    "16": "images/lptimer-16.png",
    "32": "images/lptimer-32.png",
    "48": "images/lptimer-48.png",
    "128": "images/lptimer-128.png"
  },
  "permissions": [
    "storage"
  ],
  "host_permissions": [
    "https://lichess.org/*"
  ],
  "web_accessible_resources": [
    {
      "resources": [
        "local.html",
        "assets/*"
      ],
      "matches": [
        "<all_urls>"
      ]
    }
  ],
  "content_scripts": [
    {
      "matches": [
        "https://lichess.org/*"
      ],
      "js": [
        "content.js"
      ],
      "run_at": "document_start"
    }
  ],
  "browser_specific_settings": {
    "gecko": {
      "id": "lichess-puzzle-timer@eltecson.dev",
      "strict_min_version": "109.0",
      "data_collection_permissions": {
        "required": [
          "none"
        ]
      }
    },
    "gecko_android": {
      "id": "lichess-puzzle-timer@eltecson.dev",
      "strict_min_version": "109.0",
      "data_collection_permissions": {
        "required": [
          "none"
        ]
      }
    }
  }
}
```
and update the version