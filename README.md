<div align="center">

  [![Lichess Puzzle Timer][logo-link]][download-link]

  <h3>Lichess Puzzle Timer</h3>

  Bring the tension of real games to every Lichess puzzle.
  <br>
  <strong>[Download the Chrome Extension »][download-link]</strong>
  <br>
  <strong>[Download the Firefox Add-on (Desktop/Mobile) »][download-firefox-link]</strong>
  <br>
  <br>
  [Report bug][issue-link]

  [![License][license-badge]][license-link]
  <br>
  [![Release][release-badge]][release-link]
  [![Commits][commits-badge]][commits-link]
  <br>
  [![Download][download-badge]][download-link]
  [![Firefox Download][download-firefox-badge]][download-firefox-link]

</div>

## Overview
A Chrome extension that adds a **real-time timer** when solving puzzles on Lichess, mimicking the tension of actual games—especially **blitz** and **bullet** time controls.

## Features
- Timer appears automatically when you start a puzzle.
- Supports all Lichess puzzle modes.
- Minimal, lightweight, and distraction-free.

## Usage
- Start solving puzzles on [Lichess](https://lichess.org/training).
- The timer will appear in the top-right corner automatically.
- Start the timer and have fun!

## FAQs
### Q: The timer suddenly stops for some reason…
> Occasionally puzzles may load slowly due to Lichess server hiccups. This can pause the timer temporarily. This is **not a bug** in the extension.

### Q: Can I customize the timer?
> Yes, you can absolutely customize the timer in the extension's settings webpage.

### Q: The timer ended or stopped, but doesn't actually skip to the next puzzle even if "Skip to next puzzle" is turned on?
> Occasionally, if the timer encounteres 2 scenarios **at the same time** (usually solved and failed scenario), the timer's skip *would stop working*. In this case, **just press the cancel button**, click the next puzzle or vote up button (if you haven't yet), and continue as usual. (currently dont know how to fix this bug yet)

## Contributing
- Feel free to fork the repo and submit pull requests.
- For major changes, please open an issue first to discuss what you’d like to change.

## License
This project is licensed under the **Apache License 2.0**.  
See the [LICENSE](./LICENSE) file for details.

[commits-link]:       https://github.com/el-tecson/lichess-puzzle-timer/commits/main
[issue-link]:         https://github.com/el-tecson/lichess-puzzle-timer/issues/new
[license-link]:       https://github.com/el-tecson/lichess-puzzle-timer/blob/main/LICENSE
[release-link]:       https://github.com/el-tecson/lichess-puzzle-timer/releases/latest
[download-link]:      https://chromewebstore.google.com/detail/ifloeapglolidlgbfjnfidpnpnobddof
[download-firefox-link]:      https://addons.mozilla.org/en-US/android/addon/lichess-puzzle-timer/
[logo-link]:          ./public/images/lptimer-128.png

[commits-badge]:      https://img.shields.io/github/commits-since/el-tecson/lichess-puzzle-timer/latest?style=for-the-badge
[license-badge]:      https://img.shields.io/github/license/el-tecson/lichess-puzzle-timer?style=for-the-badge&label=license&color=success
[release-badge]:      https://img.shields.io/github/v/release/el-tecson/lichess-puzzle-timer?style=for-the-badge&label=official%20release
[download-badge]:      https://img.shields.io/website?style=for-the-badge&down_color=red&down_message=Not%20Found&label=chrome%20extension&up_color=success&up_message=Download&url=https%3A%2F%2Fchromewebstore.google.com%2Fdetail%2Fifloeapglolidlgbfjnfidpnpnobddof
[download-firefox-badge]:      https://img.shields.io/website?style=for-the-badge&down_color=red&down_message=Not%20Found&label=firefox%20add-on&up_color=success&up_message=Download&url=https%3A%2F%2Faddons.mozilla.org%2Fen-US%2Fandroid%2Faddon%2Flichess-puzzle-timer%2F
