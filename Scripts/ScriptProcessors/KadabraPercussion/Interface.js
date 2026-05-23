Content.makeFrontInterface(800, 400);

// =============================================================================
// TEMPO SYNC TABLES
// HISE extended tempo table (HISE_USE_EXTENDED_TEMPO_VALUES=1):
// 19 values, 0-based — index 0 = "1/1" through index 18 = "1/64T".
// Both the Delay effect and the LFO Modulator use this same 0-based indexing.
//
// phaserTempoNames is kept separate from tempoNames so that multi-bar values
// (2/1, 4/1, 8/1, etc.) can be prepended here in the future if a custom HISE
// build adds them to the tempo table.
// =============================================================================

const var tempoNames = [
    "1/1",  "1/2D", "1/2",  "1/2T",
    "1/4D", "1/4",  "1/4T",
    "1/8D", "1/8",  "1/8T",
    "1/16D","1/16", "1/16T",
    "1/32D","1/32", "1/32T",
    "1/64D","1/64", "1/64T"
]; // 19 entries, indices 0–18

const var phaserTempoNames = [
    "8/1",  "6/1",  "4/1",  "3/1",  "2/1",
    "1/1",  "1/2D", "1/2",  "1/2T",
    "1/4D", "1/4",  "1/4T",
    "1/8D", "1/8",  "1/8T",
    "1/16D","1/16", "1/16T",
    "1/32D","1/32", "1/32T"
]; // 21 entries, indices 0–20 — matches HISE_USE_EXTENDED_TEMPO_VALUES table

// =============================================================================
// BROADCASTERS — display labels for all knobs
// =============================================================================

// --- Saturation ---
const var saturationBroadcaster = Engine.createBroadcaster({
    "id": "saturationBroadcaster", "args": ["component", "value"], "tags": []
});
saturationBroadcaster.attachToComponentValue(["Saturation"], "");
saturationBroadcaster.addComponentPropertyListener(
    ["saturationValue"], ["text"], "SaturationValue",
    function(index, component, value) { return Math.round(value * 100) + "%"; }
);

// --- Brightness ---
const var brightnessBroadcaster = Engine.createBroadcaster({
    "id": "brightnessBroadcaster", "args": ["component", "value"], "tags": []
});
brightnessBroadcaster.attachToComponentValue(["Brightness"], "");
brightnessBroadcaster.addComponentPropertyListener(
    ["brightnessValue"], ["text"], "BrightnessValue",
    function(index, component, value) { return Math.round(value * 10) / 10 + "dB"; }
);

// --- Delay Mix ---
const var delayMixBroadcaster = Engine.createBroadcaster({
    "id": "delayMixBroadcaster", "args": ["component", "value"], "tags": []
});
delayMixBroadcaster.attachToComponentValue(["Delay Mix"], "");
delayMixBroadcaster.addComponentPropertyListener(
    ["delayMixValue"], ["text"], "DelayMixValue",
    function(index, component, value) { return Math.round(value * 100) + "%"; }
);

// --- Reverb Mix ---
const var reverbMixBroadcaster = Engine.createBroadcaster({
    "id": "reverbMixBroadcaster", "args": ["component", "value"], "tags": []
});
reverbMixBroadcaster.attachToComponentValue(["Reverb Mix"], "");
reverbMixBroadcaster.addComponentPropertyListener(
    ["reverbMixValue"], ["text"], "ReverbMixValue",
    function(index, component, value) { return Math.round(value * 100) + "%"; }
);

// --- Reverb Time ---
const var reverbTimeBroadcaster = Engine.createBroadcaster({
    "id": "reverbTimeBroadcaster", "args": ["component", "value"], "tags": []
});
reverbTimeBroadcaster.attachToComponentValue(["Reverb Time"], "");
reverbTimeBroadcaster.addComponentPropertyListener(
    ["reverbTimeValue"], ["text"], "ReverbTimeValue",
    function(index, component, value)
    {
        var seconds = 0.2 * Math.pow(6.0 / 0.2, value);
        return Math.round(seconds * 10) / 10 + "s";
    }
);

// --- Filter Freq  (component ID typo "Fliter Freq" is intentional — do not fix) ---
const var filterFreqBroadcaster = Engine.createBroadcaster({
    "id": "filterFreqBroadcaster", "args": ["component", "value"], "tags": []
});
filterFreqBroadcaster.attachToComponentValue(["Fliter Freq"], "");
filterFreqBroadcaster.addComponentPropertyListener(
    ["filterFreqValue"], ["text"], "FilterFreqValue",
    function(index, component, value)
    {
        if (value >= 1000) return Math.round(value / 100) / 10 + "kHz";
        return Math.round(value) + "Hz";
    }
);

// --- Filter Res ---
const var filterResBroadcaster = Engine.createBroadcaster({
    "id": "filterResBroadcaster", "args": ["component", "value"], "tags": []
});
filterResBroadcaster.attachToComponentValue(["Filter Res"], "");
filterResBroadcaster.addComponentPropertyListener(
    ["filterResValue"], ["text"], "FilterResValue",
    function(index, component, value) { return Engine.doubleToString(value, 1) + "Q"; }
);

// --- Phaser Depth ---
const var phaserDepthBroadcaster = Engine.createBroadcaster({
    "id": "phaserDepthBroadcaster", "args": ["component", "value"], "tags": []
});
phaserDepthBroadcaster.attachToComponentValue(["Phaser Depth"], "");
phaserDepthBroadcaster.addComponentPropertyListener(
    ["phaserDepthValue"], ["text"], "PhaserDepthValue",
    function(index, component, value) { return Engine.doubleToString(value * 100, 0) + "%"; }
);

// --- Output Gain ---
const var outputGainBroadcaster = Engine.createBroadcaster({
    "id": "outputGainBroadcaster", "args": ["component", "value"], "tags": []
});
outputGainBroadcaster.attachToComponentValue(["Output Gain"], "");
outputGainBroadcaster.addComponentPropertyListener(
    ["outputGainValue"], ["text"], "OutputGainValue",
    function(index, component, value)
    {
        if (value <= -100.0) return "-inf dB";
        return Engine.doubleToString(value, 1) + "dB";
    }
);

// =============================================================================
// ABOUT / PRESETS PANEL TOGGLES
// The two panels are mutually exclusive — opening one closes the other.
// =============================================================================

const var presetsButton  = Content.getComponent("presetsButton");
const var presetsManager = Content.getComponent("presetsManager");
const var aboutButton    = Content.getComponent("aboutButton");
const var aboutPanel     = Content.getComponent("aboutPanel");

inline function onPresetsButtonControl(component, value)
{
    presetsManager.set("visible", value);
    if (value)
    {
        aboutPanel.set("visible", false);
        aboutButton.setValue(0);
    }
};
presetsButton.setControlCallback(onPresetsButtonControl);

inline function onAboutButtonControl(component, value)
{
    aboutPanel.set("visible", value);
    if (value)
    {
        presetsManager.set("visible", false);
        presetsButton.setValue(0);
    }
};
aboutButton.setControlCallback(onAboutButtonControl);

// =============================================================================
// DELAY SECTION
//
// Free mode  : 1–2500 ms, knob midpoint at 500 ms
// Sync mode  : tempo index 0–18 (HISE extended table, 0-based, "1/1"–"1/64T")
// L and R channels are always mirrored.
//
// Requires HISE_MAX_DELAY_TIME_SAMPLES=524288 in project ExtraDefinitions
// for full 2500 ms range at all common sample rates.
// =============================================================================

const var DelayTimeKnob     = Content.getComponent("Delay Time");
const var DelayFeedbackKnob = Content.getComponent("Delay Feedback");
const var DelaySyncMode     = Content.getComponent("delaySyncMode");
const var Delay1            = Synth.getEffect("Delay1");
const var SYNC_OFFSET = 5; // HISE_USE_EXTENDED_TEMPO_VALUES adds 5 slow values before "1/1"

inline function onDelayTimeControl(component, value)
{
    local sendValue = value;
    if (DelaySyncMode.getValue() == 1)
        sendValue = value + SYNC_OFFSET;
    Delay1.setAttribute(0, sendValue);
    Delay1.setAttribute(1, sendValue);
}
DelayTimeKnob.setControlCallback(onDelayTimeControl);

inline function onDelayFeedbackControl(component, value)
{
    Delay1.setAttribute(2, value);
    Delay1.setAttribute(3, value);
}
DelayFeedbackKnob.setControlCallback(onDelayFeedbackControl);

inline function onDelaySyncModeControl(component, value)
{
    Delay1.setAttribute(7, value);

    if (value == 1)
    {
        DelayTimeKnob.set("min", 0);
        DelayTimeKnob.set("max", 18);
        DelayTimeKnob.set("middlePosition", 9);
        DelayTimeKnob.set("stepSize", 1);
        DelayTimeKnob.setValue(8);
    }
    else
    {
        DelayTimeKnob.set("min", 1);
        DelayTimeKnob.set("max", 2500);
        DelayTimeKnob.set("middlePosition", 500);
        DelayTimeKnob.set("stepSize", 1);
        DelayTimeKnob.setValue(400);
    }

    local pushValue = DelayTimeKnob.getValue();
    if (value == 1) pushValue = pushValue + SYNC_OFFSET;
    Delay1.setAttribute(0, pushValue);
    Delay1.setAttribute(1, pushValue);
}
DelaySyncMode.setControlCallback(onDelaySyncModeControl);

if (DelaySyncMode.getValue() == 1)
{
    DelayTimeKnob.set("min", 0);
    DelayTimeKnob.set("max", 18);
    DelayTimeKnob.set("middlePosition", 9);
    DelayTimeKnob.set("stepSize", 1);
}
else
{
    DelayTimeKnob.set("min", 1);
    DelayTimeKnob.set("max", 2500);
    DelayTimeKnob.set("middlePosition", 500);
    DelayTimeKnob.set("stepSize", 1);
}

// --- Delay Feedback label ---
const var delayFeedbackBroadcaster = Engine.createBroadcaster({
    "id": "delayFeedbackBroadcaster", "args": ["component", "value"], "tags": []
});
delayFeedbackBroadcaster.attachToComponentValue(["Delay Feedback"], ""); // ID typo is intentional
delayFeedbackBroadcaster.addComponentPropertyListener(
    ["delayFeedbackValue"], ["text"], "DelayFeedbackValue",
    function(index, component, value) { return Math.round(value * 100) + "%"; }
);

// --- Delay Time label (sync-mode aware) ---
const var delayTimeBroadcaster = Engine.createBroadcaster({
    "id": "delayTimeBroadcaster", "args": ["component", "value"], "tags": []
});
delayTimeBroadcaster.attachToComponentValue(["Delay Time"], "");
delayTimeBroadcaster.addComponentPropertyListener(
    ["delayTimeValue"], ["text"], "DelayTimeValue",
    function(index, component, value)
    {
        if (DelaySyncMode.getValue() == 1)
        {
            var idx = Math.round(value);
            if (idx < 0)  idx = 0;
            if (idx > 18) idx = 18;
            return tempoNames[idx];
        }
        return Math.round(value) + " ms";
    }
);

// =============================================================================
// PHASER SECTION
//
// Phaser Rate in sync mode: tempo index 0–18 (HISE extended table, 0-based).
// LFO Modulator1 Frequency attribute uses the same 0-based indexing as the
// Delay effect — index 0 = "1/1", index 18 = "1/64T".
//
// Knob range must be set to 0–18 (integer steps) in the HISE GUI properties.
//
// Future: if a custom HISE build adds multi-bar tempo values (2/1, 4/1, 8/1),
// prepend them to phaserTempoNames, expand the knob max, and shift the idx
// in onPhaserRateControl accordingly.
// =============================================================================

const var PhaserRateKnob = Content.getComponent("Phaser Rate");
const var Phaser1LFO     = Synth.getModulator("LFO Modulator1");

inline function onPhaserRateControl(component, value)
{
    Phaser1LFO.setAttribute(Phaser1LFO.getAttributeIndex("Frequency"), value);
}
PhaserRateKnob.setControlCallback(onPhaserRateControl);

const var phaserRateBroadcaster = Engine.createBroadcaster({
    "id": "phaserRateBroadcaster", "args": ["component", "value"], "tags": []
});
phaserRateBroadcaster.attachToComponentValue(["Phaser Rate"], "");
phaserRateBroadcaster.addComponentPropertyListener(
    ["phaserRateValue"], ["text"], "PhaserRateValue",
    function(index, component, value)
    {
        var idx = Math.round(value);
        if (idx < 0)  idx = 0;
        if (idx > 20) idx = 20;
        return phaserTempoNames[idx];
    }
);

// =============================================================================
// ABOUT SCREEN LINKS
// =============================================================================

const var linkKsamplers   = Content.getComponent("linkKsamplers");
const var linkKadabra     = Content.getComponent("linkKadabra");
const var linkTribalTools = Content.getComponent("linkTribalTools");
const var linkGithub      = Content.getComponent("linkGithub");

inline function onLinkKsamplersControl(component, value)
{
    if (value) Engine.openWebsite("https://www.innovativemusicalinstruments.com/ksamplers");
}
linkKsamplers.setControlCallback(onLinkKsamplersControl);

inline function onLinkKadabraControl(component, value)
{
    if (value) Engine.openWebsite("https://www.kadabra.net");
}
linkKadabra.setControlCallback(onLinkKadabraControl);

inline function onLinkTribalToolsControl(component, value)
{
    if (value) Engine.openWebsite("https://www.tribal-tools.com");
}
linkTribalTools.setControlCallback(onLinkTribalToolsControl);

inline function onLinkGithubControl(component, value)
{
    if (value) Engine.openWebsite("https://github.com/innovative-musical-instruments/kadabra-percussion");
}
linkGithub.setControlCallback(onLinkGithubControl);

// =============================================================================
// CLIP LED SYSTEM
//
// Polls Globals.peakL / Globals.peakR (written by MasterPeakDetector.js).
// LEDs latch on clip, hold for CLIP_HOLD_MS, then auto-release.
// Click either LED to reset it immediately (with CLICK_GUARD_MS re-latch guard).
// =============================================================================

const var clipLedL = Content.getComponent("clipLedL");
const var clipLedR = Content.getComponent("clipLedR");

const var CLIP_OFF_COLOUR = 0xFF330000; // dim red — idle
const var CLIP_ON_COLOUR  = 0xFFFF2222; // hot red — clipped
const var CLIP_HIGHLIGHT  = 0x99FFAAAA; // glassy top strip when lit
const var CLIP_THRESHOLD  = 0.989;      // ≈ -0.1 dBFS
const var CLIP_HOLD_MS    = 5000;       // ms before auto-release
const var CLICK_GUARD_MS  = 250;        // ms re-latch suppression after click

reg clipState    = [false, false];
reg lastClipMs   = [0.0,   0.0];
reg clickResetMs = [0.0,   0.0];

clipLedL.setPaintRoutine(function(g)
{
    local w = this.getWidth();
    local h = this.getHeight();
    g.setColour(clipState[0] ? CLIP_ON_COLOUR : CLIP_OFF_COLOUR);
    g.fillRect([0, 0, w, h]);
    if (clipState[0]) { g.setColour(CLIP_HIGHLIGHT); g.fillRect([0, 0, w, h / 3]); }
});

clipLedR.setPaintRoutine(function(g)
{
    local w = this.getWidth();
    local h = this.getHeight();
    g.setColour(clipState[1] ? CLIP_ON_COLOUR : CLIP_OFF_COLOUR);
    g.fillRect([0, 0, w, h]);
    if (clipState[1]) { g.setColour(CLIP_HIGHLIGHT); g.fillRect([0, 0, w, h / 3]); }
});

clipLedL.setMouseCallback(function(event)
{
    clipState[0]    = false;
    clickResetMs[0] = Engine.getUptime() * 1000;
    clipLedL.repaint();
});

clipLedR.setMouseCallback(function(event)
{
    clipState[1]    = false;
    clickResetMs[1] = Engine.getUptime() * 1000;
    clipLedR.repaint();
});

const var clipTimer = Engine.createTimerObject();
clipTimer.setTimerCallback(function()
{
    local now  = Engine.getUptime() * 1000;
    local pL   = Globals.peakL;
    local pR   = Globals.peakR;
    local newL = clipState[0];
    local newR = clipState[1];

    if (now - clickResetMs[0] > CLICK_GUARD_MS)
    {
        if (pL >= CLIP_THRESHOLD)                                   { newL = true;  lastClipMs[0] = now; }
        else if (clipState[0] && (now - lastClipMs[0] > CLIP_HOLD_MS)) newL = false;
    }

    if (now - clickResetMs[1] > CLICK_GUARD_MS)
    {
        if (pR >= CLIP_THRESHOLD)                                   { newR = true;  lastClipMs[1] = now; }
        else if (clipState[1] && (now - lastClipMs[1] > CLIP_HOLD_MS)) newR = false;
    }

    if (newL != clipState[0]) { clipState[0] = newL; clipLedL.repaint(); }
    if (newR != clipState[1]) { clipState[1] = newR; clipLedR.repaint(); }
});
clipTimer.startTimer(30);

// =============================================================================
// SAMPLE FOLDER AUTO-SETUP
//
// Writes a platform link file (LinkOSX / LinkWindows / LinkLinux) pointing to
// the standard samples location under the user's Music folder.
// If the folder is not found, HISE's built-in file-picker dialog is the fallback.
// =============================================================================

inline function setupSampleFolder()
{
    local os = Engine.getOS();
    local linkFileName;
    if      (os == "OSX") linkFileName = "LinkOSX";
    else if (os == "WIN") linkFileName = "LinkWindows";
    else                  linkFileName = "LinkLinux";

    local appData         = FileSystem.getFolder(FileSystem.AppData);
    local linkFile        = appData.getChildFile(linkFileName);
    local userHome        = FileSystem.getFolder(FileSystem.UserHome);
    local standardSamples = userHome.getChildFile("Music/IMI/Kadabra Percussion/Samples");

    if (isDefined(standardSamples) && standardSamples.isDirectory())
    {
        linkFile.writeString(standardSamples.toString(standardSamples.FullPath));
        Console.print("Sample folder linked: " + standardSamples.toString(standardSamples.FullPath));
    }
    else
    {
        Console.print("Samples not found in standard location — HISE file picker will appear.");
    }
}

setupSampleFolder();function onNoteOn()
{
	
}
 function onNoteOff()
{
	
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 