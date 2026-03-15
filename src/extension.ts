import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import * as os from "os";

let lastErrorCount = 0;

export function activate(context: vscode.ExtensionContext) {
  console.log("=".repeat(80));
  console.log("🎵 BUG SCREAM EXTENSION ACTIVATED! 🎵");
  console.log("=".repeat(80));

  // Show a notification that the extension loaded
  vscode.window.showInformationMessage("🎵 Bug Scream is Active!");

  // Register test command
  const testCommand = vscode.commands.registerCommand("bug-scream.test", () => {
    console.log("🎵 Test command triggered!");
    playSound(context);
    vscode.window.showInformationMessage("🔊 Playing FAHH sound!");
  });

  // Register enable command
  const enableCommand = vscode.commands.registerCommand(
    "bug-scream.enable",
    () => {
      vscode.workspace
        .getConfiguration("bugScream")
        .update("enabled", true, true);
      vscode.window.showInformationMessage("✅ Bug Scream Enabled!");
      console.log("✅ Bug Scream enabled");
    },
  );

  // Register disable command
  const disableCommand = vscode.commands.registerCommand(
    "bug-scream.disable",
    () => {
      vscode.workspace
        .getConfiguration("bugScream")
        .update("enabled", false, true);
      vscode.window.showInformationMessage("🔇 Bug Scream Disabled!");
      console.log("🔇 Bug Scream disabled");
    },
  );

  // Register toggle command
  const toggleCommand = vscode.commands.registerCommand(
    "bug-scream.toggle",
    () => {
      const config = vscode.workspace.getConfiguration("bugScream");
      const currentState = config.get("enabled", true);
      const newState = !currentState;
      config.update("enabled", newState, true);
      const status = newState ? "Enabled ✅" : "Disabled 🔇";
      vscode.window.showInformationMessage(`Bug Scream ${status}`);
      console.log(`Bug Scream ${status}`);
    },
  );

  // Register select sound command
  const selectSoundCommand = vscode.commands.registerCommand(
    "bug-scream.selectSound",
    async () => {
      const sounds = [
        { label: "🎵 Fahhhhh (Default)", value: "fahhhhh", description: "The classic 'Fahhh' sound" },
        { label: "🔔 Chloo", value: "chloo", description: "A bell-like sound" },
        { label: "😮 Eh", value: "eh", description: "An expressive sound" },
        { label: "📁 Custom Sound File...", value: "custom", description: "Choose your own sound file" }
      ];

      const selected = await vscode.window.showQuickPick(sounds, {
        placeHolder: "Select a sound for error notifications",
        title: "Bug Scream Sound Selection"
      });

      if (selected) {
        await vscode.workspace.getConfiguration("bugScream").update("soundChoice", selected.value, true);
        
        if (selected.value === "custom") {
          // If custom is selected, prompt for file
          vscode.commands.executeCommand("bug-scream.setCustomSound");
        } else {
          vscode.window.showInformationMessage(`🎵 Sound changed to: ${selected.label}`);
          console.log(`🎵 Sound changed to: ${selected.value}`);
          // Test the new sound
          playSound(context);
        }
      }
    }
  );

  // Register set custom sound command
  const setCustomSoundCommand = vscode.commands.registerCommand(
    "bug-scream.setCustomSound",
    async () => {
      const result = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          "Audio Files": ["mp3", "wav", "ogg", "aiff", "m4a", "flac"],
          "All Files": ["*"],
        },
        openLabel: "Select Sound File",
      });

      if (result && result[0]) {
        const soundPath = result[0].fsPath;
        await vscode.workspace
          .getConfiguration("bugScream")
          .update("soundChoice", "custom", true);
        await vscode.workspace
          .getConfiguration("bugScream")
          .update("customSoundPath", soundPath, true);
        vscode.window.showInformationMessage(
          `🎵 Custom sound set: ${path.basename(soundPath)}`,
        );
        console.log(`🎵 Custom sound path set to: ${soundPath}`);

        // Test the new sound
        playSound(context);
      }
    },
  );

  context.subscriptions.push(
    testCommand,
    enableCommand,
    disableCommand,
    toggleCommand,
    selectSoundCommand,
    setCustomSoundCommand,
  );

  // Listen for diagnostic changes (errors)
  vscode.languages.onDidChangeDiagnostics(() => {
    // Check if the extension is enabled
    const config = vscode.workspace.getConfiguration("bugScream");
    const isEnabled = config.get("enabled", true);

    if (!isEnabled) {
      return; // Exit if disabled
    }

    const allDiagnostics = vscode.languages.getDiagnostics();

    let currentErrorCount = 0;
    for (const [uri, diagnostics] of allDiagnostics) {
      currentErrorCount += diagnostics.filter(
        (d) => d.severity === vscode.DiagnosticSeverity.Error,
      ).length;
    }

    console.log(`📊 Errors: ${currentErrorCount} (was: ${lastErrorCount})`);

    if (currentErrorCount > lastErrorCount) {
      console.log("🚨 New error detected! Playing sound...");
      playSound(context);
    }

    lastErrorCount = currentErrorCount;
  });

  console.log("✅ Bug Scream is ready!");
}

function playSound(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("bugScream");
  const soundChoice = config.get<string>("soundChoice", "fahhhhh");
  const customSoundPath = config.get<string>("customSoundPath", "");

  const platform = os.platform();
  let soundFile: string;
  let command: string;

  // Determine which sound file to use
  if (soundChoice === "custom" && customSoundPath && customSoundPath.trim() !== "") {
    // Use custom sound file
    soundFile = customSoundPath;
    console.log(`🎨 Using custom sound: ${soundFile}`);
  } else {
    // Use built-in sound from library
    let soundName = soundChoice;
    if (soundChoice === "custom") {
      soundName = "fahhhhh"; // Fallback to default if custom is selected but no file specified
    }
    
    // Choose file extension based on platform
    const extension = platform === "win32" ? "wav" : "mp3";
    soundFile = path.join(context.extensionPath, "sounds", `${soundName}.${extension}`);
    console.log(`🎵 Using built-in sound: ${soundName}`);
  }

  // Choose the right command for each platform
  if (platform === "darwin") {
    // macOS - use afplay (supports MP3, WAV, AIFF, etc.)
    command = `afplay "${soundFile}"`;
    console.log(`🍎 macOS: Playing sound with afplay`);
  } else if (platform === "win32") {
    // Windows - use PowerShell (best with WAV)
    command =
      `powershell -NoProfile -Command ` +
      `"$player = New-Object System.Media.SoundPlayer('${soundFile}'); ` +
      `$player.Load(); ` +
      `$player.PlaySync();"`;
    console.log(`🪟 Windows: Playing sound with PowerShell`);
  } else {
    // Linux - try multiple players
    command = `(aplay "${soundFile}" || paplay "${soundFile}" || mpg123 -q "${soundFile}" || ffplay -nodisp -autoexit "${soundFile}") 2>/dev/null`;
    console.log(`🐧 Linux: Playing sound with aplay/paplay/mpg123/ffplay`);
  }

  console.log(`🔊 Attempting to play: ${soundFile}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error playing sound:", error.message);
      console.error("💡 Make sure audio player is available on your system");
      if (soundChoice === "custom") {
        console.error(
          "💡 Check that the custom sound file path is correct and the file exists",
        );
      }
      return;
    }
    if (stderr && stderr.trim().length > 0) {
      console.error("⚠️ Sound stderr:", stderr);
      return;
    }
    console.log("✅ Sound played successfully!");
  });
}

export function deactivate() {
  console.log("👋 Bug Scream deactivated");
}
