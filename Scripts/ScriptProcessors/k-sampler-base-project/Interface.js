Content.makeFrontInterface(800, 400);

// Broadcaster definition
const var saturationBroadcaster = Engine.createBroadcaster({
  "id": "saturationBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
saturationBroadcaster.attachToComponentValue(["Saturation"], "");
// attach first listener
saturationBroadcaster.addComponentPropertyListener(["saturationValue"], ["text"], "SaturationValue", function(index, component, value){
	return Math.round(value * 100) + "%";
});
// Brightness Broadcaster
const var brightnessBroadcaster = Engine.createBroadcaster({
  "id": "brightnessBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// Delay Mix Broadcaster
brightnessBroadcaster.attachToComponentValue(["Brightness"], "");
brightnessBroadcaster.addComponentPropertyListener(["brightnessValue"], ["text"], "BrightnessValue", function(index, component, value){
	return Math.round(value * 10) / 10 + "dB";
});
const var delayMixBroadcaster = Engine.createBroadcaster({
  "id": "delayMixBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
delayMixBroadcaster.attachToComponentValue(["Delay Mix"], "");
delayMixBroadcaster.addComponentPropertyListener(["delayMixValue"], ["text"], "DelayMixValue", function(index, component, value){
	return Math.round(value * 100) + "%";
});
// tempoNames array for TempoSync knobs
const var tempoNames = ["1/1","1/2D","1/2","1/2T","1/4D","1/4","1/4T",
                        "1/8D","1/8","1/8T","1/16D","1/16","1/16T",
                        "1/32D","1/32","1/32T","1/64D","1/64","1/64T"];
const var phaserTempoNames = ["8/1","6/1","4/1","3/1","2/1",
                              "1/1","1/2D","1/2","1/2T","1/4D","1/4","1/4T",
                              "1/8D","1/8","1/8T","1/16D","1/16","1/16T",
                              "1/32D","1/32","1/32T"];

// Reverb Mix Broadcaster
const var reverbMixBroadcaster = Engine.createBroadcaster({
  "id": "reverbMixBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
reverbMixBroadcaster.attachToComponentValue(["Reverb Mix"], "");
// attach first listener
reverbMixBroadcaster.addComponentPropertyListener(["reverbMixValue"], ["text"], "ReverbMixValue", function(index, component, value){
	return Math.round(value * 100) + "%";
});
// Reverb Time Broadcaster
const var reverbTimeBroadcaster = Engine.createBroadcaster({
  "id": "reverbTimeBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
reverbTimeBroadcaster.attachToComponentValue(["Reverb Time"], "");
// attach first listener
reverbTimeBroadcaster.addComponentPropertyListener(["reverbTimeValue"], ["text"], "ReverbTimeValue", function(index, component, value){
	var seconds = 0.2 * Math.pow(6.0 / 0.2, value);
	return Math.round(seconds * 10) / 10 + "s";
});
// Filter Freq Broadcaster
const var filterFreqBroadcaster = Engine.createBroadcaster({
  "id": "filterFreqBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
filterFreqBroadcaster.attachToComponentValue(["Fliter Freq"], "");
// attach first listener
filterFreqBroadcaster.addComponentPropertyListener(["filterFreqValue"], ["text"], "FilterFreqValue", function(index, component, value){
	if (value >= 1000) return Math.round(value / 100) / 10 + "kHz";
	return Math.round(value) + "Hz";
});

// Filter Res Broadcaster
const var filterResBroadcaster = Engine.createBroadcaster({
  "id": "filterResBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
filterResBroadcaster.attachToComponentValue(["Filter Res"], "");
// attach first listener
filterResBroadcaster.addComponentPropertyListener(["filterResValue"], ["text"], "FilterResValue", function(index, component, value){
	return Engine.doubleToString(value, 1) + "Q";
});
// Phaser Depth Broadcaster
const var phaserDepthBroadcaster = Engine.createBroadcaster({
  "id": "phaserDepthBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
phaserDepthBroadcaster.attachToComponentValue(["Phaser Depth"], "");
// attach first listener
phaserDepthBroadcaster.addComponentPropertyListener(["phaserDepthValue"], ["text"], "PhaserDepthValue", function(index, component, value){
	return Engine.doubleToString(value * 100, 0) + "%";
});
// --- Phaser Rate section ---
const var PhaserRateKnob = Content.getComponent("Phaser Rate");
const var Phaser1LFO = Synth.getModulator("LFO Modulator1");

// Apply tempo-table offset so knob index 0 = "4/1", index 21 = "1/64T"
inline function onPhaserRateControl(component, value)
{
    Phaser1LFO.setAttribute(Phaser1LFO.getAttributeIndex("Frequency"), value);
}
PhaserRateKnob.setControlCallback(onPhaserRateControl);

// Phaser Rate Broadcaster
const var phaserRateBroadcaster = Engine.createBroadcaster({
  "id": "phaserRateBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
phaserRateBroadcaster.attachToComponentValue(["Phaser Rate"], "");
phaserRateBroadcaster.addComponentPropertyListener(
    ["phaserRateValue"], 
    ["text"], 
    "PhaserRateValue", 
    function(index, component, value)
    {
        var idx = Math.round(value);
        if (idx < 0) idx = 0;
        if (idx > 21) idx = 21;
        return phaserTempoNames[idx];
    }
);

// Output Gain Broadcaster
const var outputGainBroadcaster = Engine.createBroadcaster({
  "id": "outputGainBroadcaster",
  "args": ["component", "value"],
  "tags": []
});
// attach to event Type
outputGainBroadcaster.attachToComponentValue(["Output Gain"], "");
// attach first listener
outputGainBroadcaster.addComponentPropertyListener(["outputGainValue"], ["text"], "OutputGainValue", function(index, component, value){
    if (value <= -100.0) return "-inf dB";
    return Engine.doubleToString(value, 1) + "dB";
});
const var presetsButton = Content.getComponent("presetsButton");
const var presetsManager = Content.getComponent("presetsManager");
const var aboutButton = Content.getComponent("aboutButton");
const var aboutPanel = Content.getComponent("aboutPanel");

inline function onAboutButtonControl(component, value)
{
    aboutPanel.set("visible", value);
    if (value) 
    {
        presetsManager.set("visible", false);
        presetsButton.setValue(0);
    }
};

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
aboutButton.setControlCallback(onAboutButtonControl);

// --- Delay section ---
const var DelayTimeKnob = Content.getComponent("Delay Time");
const var DelayFeedbackKnob = Content.getComponent("Delay Feedback");
const var DelaySyncMode = Content.getComponent("delaySyncMode");
const var Delay1 = Synth.getEffect("Delay1");
const var SYNC_OFFSET = 5; // HISE_USE_EXTENDED_TEMPO_VALUES adds 5 slow values before "1/1";

// L/R mirror: Delay Time
inline function onDelayTimeControl(component, value)
{
    local sendValue = value;
    if (DelaySyncMode.getValue() == 1) // Sync mode — offset into extended tempo table
        sendValue = value + SYNC_OFFSET;
    
    Delay1.setAttribute(0, sendValue); // DelayTimeLeft
    Delay1.setAttribute(1, sendValue); // DelayTimeRight
}
DelayTimeKnob.setControlCallback(onDelayTimeControl);

// L/R mirror: Delay Feedback
inline function onDelayFeedbackControl(component, value)
{
    Delay1.setAttribute(2, value); // FeedbackLeft
    Delay1.setAttribute(3, value); // FeedbackRight
}
DelayFeedbackKnob.setControlCallback(onDelayFeedbackControl);

// Sync/Free mode toggle
inline function onDelaySyncModeControl(component, value)
{
    // value: 0 = Free (LED off), 1 = Sync (LED on) — matches HISE TempoSync polarity
    Delay1.setAttribute(7, value);
    
    if (value == 1) // Sync mode
    {
        DelayTimeKnob.set("min", 0);
        DelayTimeKnob.set("max", 18);
        DelayTimeKnob.set("middlePosition", 9);   // linear across divisions
        DelayTimeKnob.set("stepSize", 1);
        DelayTimeKnob.setValue(8); // default 1/8
    }
    else // Free mode
    {
        DelayTimeKnob.set("min", 1);
        DelayTimeKnob.set("max", 2500);
        DelayTimeKnob.set("middlePosition", 500); // 50% → 500 ms
        DelayTimeKnob.set("stepSize", 1);
        DelayTimeKnob.setValue(400); // default 400ms
    }
    
    // push the new value through so audio updates immediately
local pushValue = DelayTimeKnob.getValue();
if (value == 1) // Sync mode
    pushValue = pushValue + SYNC_OFFSET;

Delay1.setAttribute(0, pushValue);
Delay1.setAttribute(1, pushValue);
}
DelaySyncMode.setControlCallback(onDelaySyncModeControl);

// Initialize knob range based on current sync state (handles plugin load / preset recall)
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

// Delay Feedback label broadcaster
const var delayFeedbackBroadcaster = Engine.createBroadcaster({
    "id": "delayFeedbackBroadcaster",
    "args": ["component", "value"],
    "tags": []
});
delayFeedbackBroadcaster.attachToComponentValue(["Delay Feedback"], "");
delayFeedbackBroadcaster.addComponentPropertyListener(
    ["delayFeedbackValue"], 
    ["text"], 
    "DelayFeedbackValue", 
    function(index, component, value)
    {
        return Math.round(value * 100) + "%";
    }
);

// Delay Time label broadcaster (mode-aware)
const var delayTimeBroadcaster = Engine.createBroadcaster({
    "id": "delayTimeBroadcaster",
    "args": ["component", "value"],
    "tags": []
});
delayTimeBroadcaster.attachToComponentValue(["Delay Time"], "");
delayTimeBroadcaster.addComponentPropertyListener(
    ["delayTimeValue"], 
    ["text"], 
    "DelayTimeValue", 
    function(index, component, value)
    {
        if (DelaySyncMode.getValue() == 1) // Sync mode
        {
            var idx = Math.round(value);
            if (idx < 0) idx = 0;
            if (idx > 18) idx = 18;
            return tempoNames[idx];
        }
        else // Free mode
        {
            return Math.round(value) + " ms";
        }
    }
);
// --- About screen links ---
const var linkKsamplers = Content.getComponent("linkKsamplers");
const var linkKadabra = Content.getComponent("linkKadabra");
const var linkTribalTools = Content.getComponent("linkTribalTools");
const var linkGithub = Content.getComponent("linkGithub");

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
    if (value) Engine.openWebsite("https://github.com/innovative-musical-instruments/kadabra-electronic-drumkit");
}
linkGithub.setControlCallback(onLinkGithubControl);

// =========================================================================
// Clip LED system — production
// L/R indexed pattern matches Delay rework convention
// =========================================================================

const var clipLedL = Content.getComponent("clipLedL");
const var clipLedR = Content.getComponent("clipLedR");

const var CLIP_OFF_COLOUR = 0xFF330000; // dim red, idle
const var CLIP_ON_COLOUR  = 0xFFFF2222; // hot red, clipped
const var CLIP_HIGHLIGHT  = 0x99FFAAAA; // glassy strip when on

const var CLIP_THRESHOLD  = 0.989;      // ~ -0.1 dBFS
const var CLIP_HOLD_MS    = 5000;       // auto-release after 1.5s
const var CLICK_GUARD_MS  = 250;        // re-latch suppression after click

reg clipState    = [false, false];
reg lastClipMs   = [0.0,   0.0];
reg clickResetMs = [0.0,   0.0];

// --- Paint ---
clipLedL.setPaintRoutine(function(g)
{
    local w = this.getWidth();
    local h = this.getHeight();
    g.setColour(clipState[0] ? CLIP_ON_COLOUR : CLIP_OFF_COLOUR);
    g.fillRect([0, 0, w, h]);

    if (clipState[0])
    {
        g.setColour(CLIP_HIGHLIGHT);
        g.fillRect([0, 0, w, h / 3]);
    }
});

clipLedR.setPaintRoutine(function(g)
{
    local w = this.getWidth();
    local h = this.getHeight();
    g.setColour(clipState[1] ? CLIP_ON_COLOUR : CLIP_OFF_COLOUR);
    g.fillRect([0, 0, w, h]);

    if (clipState[1])
    {
        g.setColour(CLIP_HIGHLIGHT);
        g.fillRect([0, 0, w, h / 3]);
    }
});

// --- Click to reset ---
clipLedL.setMouseCallback(function(event)
{
    clipState[0] = false;
    clickResetMs[0] = Engine.getUptime() * 1000;
    clipLedL.repaint();
});

clipLedR.setMouseCallback(function(event)
{
    clipState[1] = false;
    clickResetMs[1] = Engine.getUptime() * 1000;
    clipLedR.repaint();
});

// --- Polling timer ---
const var clipTimer = Engine.createTimerObject();

clipTimer.setTimerCallback(function()
{
    local now = Engine.getUptime() * 1000;

    local pL = Globals.peakL;
    local pR = Globals.peakR;

    local newL = clipState[0];
    local newR = clipState[1];

    if (now - clickResetMs[0] > CLICK_GUARD_MS)
    {
        if (pL >= CLIP_THRESHOLD) { newL = true;  lastClipMs[0] = now; }
        else if (clipState[0] && (now - lastClipMs[0] > CLIP_HOLD_MS)) newL = false;
    }

    if (now - clickResetMs[1] > CLICK_GUARD_MS)
    {
        if (pR >= CLIP_THRESHOLD) { newR = true;  lastClipMs[1] = now; }
        else if (clipState[1] && (now - lastClipMs[1] > CLIP_HOLD_MS)) newR = false;
    }

    if (newL != clipState[0]) { clipState[0] = newL; clipLedL.repaint(); }
    if (newR != clipState[1]) { clipState[1] = newR; clipLedR.repaint(); }
});

clipTimer.startTimer(30);

// --- Sample folder auto-setup ---
inline function setupSampleFolder()
{
    // Determine platform link file name
    local linkFileName;
    local os = Engine.getOS();
    if (os == "OSX") linkFileName = "LinkOSX";
    else if (os == "WIN") linkFileName = "LinkWindows";
    else linkFileName = "LinkLinux";
    
    // Get app data folder (Application Support/IMI/Kadabra Electronic Drumkit)
    local appData = FileSystem.getFolder(FileSystem.AppData);
    local linkFile = appData.getChildFile(linkFileName);
    
    // Build expected standard samples path for this user
    local userHome = FileSystem.getFolder(FileSystem.UserHome);
    local standardSamples = userHome.getChildFile(
        "Music/IMI/Kadabra Electronic Drumkit/Samples"
    );
    
    // If samples exist in standard location, write/overwrite link file
    if (isDefined(standardSamples) && standardSamples.isDirectory())
    {
        linkFile.writeString(standardSamples.toString(standardSamples.FullPath));
        Console.print("Sample folder linked: " + 
            standardSamples.toString(standardSamples.FullPath));
    }
    else
    {
        // Not found — HISE's built-in dialog will appear as fallback
        Console.print("Samples not found in standard location.");
    }
}

setupSampleFolder();

function onNoteOn()
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
 