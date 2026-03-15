# Bug Scream 🎵

Plays a "Fahhh" sound (or other sounds) whenever a new error appears in your code, giving you instant audio feedback while coding!

## Features

- 🔊 **Instant Audio Feedback** - Hear when errors occur in your code
- 🎵 **Multiple Built-in Sounds** - Choose from Fahhhhh, Chloo, or Eh sounds
- 🎨 **Custom Sounds** - Use your own audio files
- 🌍 **Cross-Platform** - Works on macOS, Windows, and Linux
- ⚙️ **Easy Configuration** - Simple commands and settings to customize

## How It Works

Bug Scream listens to VS Code's diagnostic system and plays a sound when NEW errors are detected in your code. It only triggers when the error count increases, so you won't hear sounds on every keystroke.

## Commands

Press `Cmd+Shift+P` (or `Ctrl+Shift+P` on Windows/Linux) and use these commands:

- **Bug Scream: Test Sound** - Test the currently selected sound
- **Bug Scream: Select Sound** - Choose from built-in sounds or add a custom one
- **Bug Scream: Enable** - Turn on sound notifications
- **Bug Scream: Disable** - Turn off sound notifications
- **Bug Scream: Toggle On/Off** - Quickly enable/disable
- **Bug Scream: Set Custom Sound File** - Browse and select a custom audio file

## Extension Settings

This extension contributes the following settings:

- `bugScream.enabled` - Enable/disable Bug Scream sound notifications (default: `true`)
- `bugScream.soundChoice` - Choose which sound to play: `fahhhhh`, `chloo`, `eh`, or `custom` (default: `fahhhhh`)
- `bugScream.customSoundPath` - Path to a custom sound file when using custom sound option

## Supported Audio Formats

- **MP3** - Works on macOS and Linux
- **WAV** - Works on all platforms (best for Windows)
- **OGG, AIFF, M4A, FLAC** - Works on macOS and Linux (depending on system)

## Usage

1. Install the extension
2. Start coding in any file
3. When you create an error, you'll hear the sound! 🔊
4. Use `Bug Scream: Select Sound` to change sounds
5. Use `Bug Scream: Disable` if you need silence

## Requirements

No additional requirements! The extension uses native audio players available on your system:

- macOS: Uses `afplay` (built-in)
- Windows: Uses PowerShell (built-in)
- Linux: Uses `aplay`, `paplay`, or `mpg123` (usually pre-installed)

## Release Notes

### 0.0.1

Initial release of Bug Scream:

- Audio notification when errors are detected
- Multiple built-in sounds (Fahhhhh, Chloo, Eh)
- Custom sound file support
- Cross-platform support (macOS, Windows, Linux)
- Enable/disable functionality
- Easy sound selection with quick picker

---

**Enjoy coding with audio feedback!** 🎵

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
