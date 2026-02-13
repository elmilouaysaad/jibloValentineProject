const answers_no = {
    english: [
        "No",
        "Are you sure?",
        "Are you really sure??",
        "Are you really realy sure???",
        "Think again?",
        "Don't believe in second chances?",
        "Why are you being so cold?",
        "Maybe we can talk about it?",
        "I am not going to ask again!",
        "Ok now this is hurting my feelings!",
        "You are now just being mean!",
        "Why are you doing this to me?",
        "Please give me a chance!",
        "I am begging you to stop!",
        "Mer7baaaaaaaaa !!"
    ],
};

answers_yes = {
    "english": "Yes",
}

let language = "english"; // Default language is English
const no_button = document.getElementById('no-button');
const yes_button = document.getElementById('yes-button');
const banner = document.getElementById('banner');
const questionHeading = document.getElementById('question-heading');
const typedText = document.getElementById('typed-text');

const SUCCESS_TEXT = "Happy Anniversary & Valentine's Day Salma <3";
let typingTimerId = null;

const NO_DIR = "./public/outputnobg/no_nobg";
const YES_DIR = "./public/outputnobg/yes_nobg";

const NO_FRAMES = [
    "frame_000000_t000.000.png",
    "frame_000001_t000.100.png",
    "frame_000002_t000.200.png",
    "frame_000003_t000.300.png",
    "frame_000004_t000.400.png",
    "frame_000005_t000.500.png",
    "frame_000006_t000.600.png",
    "frame_000007_t000.700.png",
    "frame_000008_t000.800.png",
    "frame_000009_t000.900.png",
    "frame_000010_t001.000.png",
    "frame_000011_t001.100.png",
    "frame_000012_t001.200.png",
    "frame_000013_t001.300.png",
    "frame_000014_t001.400.png",
    "frame_000015_t001.500.png",
    "frame_000016_t001.600.png",
    "frame_000017_t001.700.png",
    "frame_000018_t001.800.png",
    "frame_000019_t001.900.png",
    "frame_000020_t002.000.png",
    "frame_000021_t002.100.png",
    "frame_000022_t002.200.png",
    "frame_000023_t002.300.png",
    "frame_000024_t002.400.png",
    "frame_000025_t002.500.png",
    "frame_000026_t002.600.png",
    "frame_000027_t002.700.png",
    "frame_000028_t002.800.png",
    "frame_000029_t002.900.png",
    "frame_000030_t003.000.png",
    "frame_000031_t003.100.png",
    "frame_000032_t003.200.png",
    "frame_000033_t003.300.png",
    "frame_000034_t003.400.png",
    "frame_000035_t003.500.png",
    "frame_000036_t003.600.png",
    "frame_000037_t003.700.png",
    "frame_000038_t003.800.png",
    "frame_000039_t003.900.png",
    "frame_000040_t004.000.png",
    "frame_000041_t004.100.png",
    "frame_000042_t004.200.png",
    "frame_000043_t004.300.png",
    "frame_000044_t004.400.png",
    "frame_000045_t004.500.png",
    "frame_000046_t004.600.png",
    "frame_000047_t004.700.png",
    "frame_000048_t004.800.png",
    "frame_000049_t004.900.png",
    "frame_000050_t005.000.png",
    "frame_000051_t005.100.png",
    "frame_000052_t005.200.png",
    "frame_000053_t005.300.png",
    "frame_000054_t005.400.png",
    "frame_000055_t005.500.png",
    "frame_000056_t005.600.png",
    "frame_000057_t005.700.png",
    "frame_000058_t005.800.png",
    "frame_000059_t005.900.png",
    "frame_000060_t006.000.png",
    "frame_000061_t006.100.png",
    "frame_000062_t006.200.png",
    "frame_000063_t006.300.png",
    "frame_000064_t006.400.png",
    "frame_000065_t006.500.png",
    "frame_000066_t006.600.png",
    "frame_000067_t006.700.png",
    "frame_000068_t006.800.png",
    "frame_000069_t006.900.png",
    "frame_000070_t007.000.png",
    "frame_000071_t007.100.png",
    "frame_000072_t007.200.png",
    "frame_000073_t007.300.png",
    "frame_000074_t007.400.png",
    "frame_000075_t007.500.png",
    "frame_000076_t007.600.png",
    "frame_000077_t007.700.png"
];

const YES_FRAMES = [
    "frame_000000_t000.000.png",
    "frame_000001_t000.100.png",
    "frame_000002_t000.200.png",
    "frame_000003_t000.300.png",
    "frame_000004_t000.400.png",
    "frame_000005_t000.500.png",
    "frame_000006_t000.600.png",
    "frame_000007_t000.700.png",
    "frame_000008_t000.800.png",
    "frame_000009_t000.900.png",
    "frame_000010_t001.000.png",
    "frame_000011_t001.100.png",
    "frame_000012_t001.200.png",
    "frame_000013_t001.300.png",
    "frame_000014_t001.400.png",
    "frame_000015_t001.500.png",
    "frame_000016_t001.600.png",
    "frame_000017_t001.700.png",
    "frame_000018_t001.800.png",
    "frame_000019_t001.900.png"
];

const timeRe = /_t(\d+(?:\.\d+)?)/i;
const playerState = {
    timerId: null,
    frames: [],
    index: 0,
    loop: true,
    defaultDelay: 100
};

const VOTE_ENDPOINT = "/api/vote";
let loggedYes = false;

function sendVote(choice, meta = null) {
    if (choice === "yes" && loggedYes) {
        return;
    }

    const payload = {
        choice,
        timestamp: new Date().toISOString(),
        meta
    };

    fetch(VOTE_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        keepalive: true
    }).catch(() => {});

    if (choice === "yes") {
        loggedYes = true;
    }
}

function frameSrc(dir, filename) {
    return `${dir}/${filename}`;
}

function parseTime(filename) {
    const match = timeRe.exec(filename);
    return match ? Number(match[1]) : null;
}

function estimateDefaultDelay(times) {
    const diffs = [];
    for (let i = 1; i < times.length; i++) {
        const d = times[i] - times[i - 1];
        if (d > 0) diffs.push(d);
    }
    if (!diffs.length) {
        return 100;
    }
    diffs.sort((a, b) => a - b);
    const mid = Math.floor(diffs.length / 2);
    const median = diffs.length % 2 ? diffs[mid] : (diffs[mid - 1] + diffs[mid]) / 2;
    return Math.max(10, Math.round(median * 1000));
}

function stopSequence() {
    if (playerState.timerId) {
        clearTimeout(playerState.timerId);
        playerState.timerId = null;
    }
}

function playSequence(dir, frames, loop) {
    stopSequence();
    if (!frames.length) {
        return;
    }

    const times = frames.map(parseTime).filter((t) => t !== null);
    playerState.defaultDelay = estimateDefaultDelay(times);
    playerState.frames = frames;
    playerState.index = 0;
    playerState.loop = loop;

    const scheduleNext = () => {
        const idx = playerState.index;
        banner.src = frameSrc(dir, playerState.frames[idx]);

        let delay = playerState.defaultDelay;
        const t0 = parseTime(playerState.frames[idx]);
        const t1 = parseTime(playerState.frames[idx + 1]);
        if (t0 !== null && t1 !== null && t1 > t0) {
            delay = Math.max(10, Math.round((t1 - t0) * 1000));
        }

        playerState.index += 1;
        if (playerState.index >= playerState.frames.length) {
            if (!playerState.loop) {
                playerState.timerId = null;
                return;
            }
            playerState.index = 0;
        }

        playerState.timerId = setTimeout(scheduleNext, delay);
    };

    scheduleNext();
}

function preloadFrames(dir, frames) {
    frames.forEach((frame) => {
        const img = new Image();
        img.src = frameSrc(dir, frame);
    });
}

preloadFrames(NO_DIR, NO_FRAMES);
preloadFrames(YES_DIR, YES_FRAMES);
let i = 1;
let size = 50;
let clicks = 0;

no_button.addEventListener('click', () => {
    const stepIndex = Math.min(clicks, answers_no[language].length - 1);
    sendVote("no", {
        stepIndex,
        stepText: answers_no[language][stepIndex]
    });
    if (clicks === 0) {
        playSequence(NO_DIR, NO_FRAMES, true);
    }
    clicks++;
    // increase button height and width gradually to 250px
    const sizes = [40, 50, 30, 35, 45]
    const random = Math.floor(Math.random() * sizes.length);
    size += sizes[random]
    yes_button.style.height = `${size}px`;
    yes_button.style.width = `${size}px`;
    let total = answers_no[language].length;
    // change button text
    if (i < total - 1) {
        no_button.innerHTML = answers_no[language][i];
        i++;
    } else if (i === total - 1) {
        alert(answers_no[language][i]);
        i = 1;
        no_button.innerHTML = answers_no[language][0];
        yes_button.innerHTML = answers_yes[language];
        yes_button.style.height = "50px";
        yes_button.style.width = "50px";
        size = 50;
    }
});

yes_button.addEventListener('click', () => {
    sendVote("yes");
    playSequence(YES_DIR, YES_FRAMES, true);
    // hide buttons div
    let buttons = document.getElementsByClassName('buttons')[0];
    buttons.style.display = "none";
    questionHeading.style.display = "none";
    // show message div
    let message = document.getElementsByClassName('message')[0];
    message.style.display = "block";
    startTyping(SUCCESS_TEXT);
});

function startTyping(text) {
    if (!typedText) {
        return;
    }

    if (typingTimerId) {
        clearTimeout(typingTimerId);
        typingTimerId = null;
    }

    typedText.textContent = "";
    let index = 0;

    const typeNext = () => {
        typedText.textContent = text.slice(0, index + 1);
        index += 1;
        if (index < text.length) {
            typingTimerId = setTimeout(typeNext, 70);
        } else {
            typingTimerId = null;
        }
    };

    typeNext();
}

function changeLanguage() {
    const selectElement = document.getElementById("language-select");
    const selectedLanguage = selectElement.value;
    language = selectedLanguage;

    // Update question heading
    const questionHeading = document.getElementById("question-heading");
    if (language === "french") {
        questionHeading.textContent = "Tu veux être mon valentin?";
    } else if (language === "thai") {
        questionHeading.textContent = "คืนดีกับเราได้อ่ะป่าว?";
    } else {
        questionHeading.textContent = "Will you be my valentine?";
    }

    // Reset yes button text
    yes_button.innerHTML = answers_yes[language];

    // Reset button text to first in the new language
    if (clicks === 0) {
        no_button.innerHTML = answers_no[language][0];
    } else {
        no_button.innerHTML = answers_no[language][clicks];
    }

}