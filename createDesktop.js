async function run() {
    console.log("Generating Desktop Layout...");

    const page = await framer.createDesignPage("Desktop Site");
    await framer.setSelection([page.id]);

    const main = await framer.createFrameNode({
        name: "Desktop Wrap",
        width: 1440,
        height: 6000,
        backgroundColor: "#FFFFFF",
        layout: "stack",
        stackDirection: "vertical",
        stackAlignment: "start",
        stackDistribution: "start",
        gap: 0,
    }, page.id);

    const txtStyle = {
        fontSize: 85,
        letterSpacing: -4.26,
        lineHeight: 0.9,
    };

    const smallTxtStyle = {
        fontSize: 16,
        letterSpacing: 0,
    };

    // --- 1. Intro Section ---
    const intro = await framer.createFrameNode({
        name: "Intro",
        width: "100%",
        height: 1000,
        layout: "stack",
        stackDirection: "vertical",
        padding: 40,
        gap: 20,
        backgroundColor: "transparent",
        borderBottom: "1px dashed #000"
    }, main.id);

    const header = await framer.createFrameNode({
        name: "Header",
        width: "100%",
        height: 100,
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "space-between",
        backgroundColor: "transparent"
    }, intro.id);

    await framer.createTextNode({ text: "HAMZA", ...txtStyle }, header.id);
    await framer.createTextNode({ text: "SHAEBI", ...txtStyle, textAlign: "right" }, header.id);

    const nav = await framer.createFrameNode({
        name: "Nav",
        width: "100%",
        height: 50,
        layout: "stack",
        stackDirection: "horizontal",
        gap: 17,
        backgroundColor: "transparent"
    }, intro.id);

    const navItems = ["WORK", "PROCESS", "SOCIALS", "SAY HELLO"];
    for (const item of navItems) {
        const itemBox = await framer.createFrameNode({
            width: 120, height: 40,
            backgroundColor: item === "WORK" ? "#000" : "#EBEBEB",
            layout: "stack", stackAlignment: "center", stackDistribution: "center",
            borderRadius: 8
        }, nav.id);
        await framer.createTextNode({ text: item, ...smallTxtStyle, color: item === "WORK" ? "#FFF" : "#000" }, itemBox.id);
    }

    await framer.createFrameNode({
        name: "HeroBlock",
        width: "100%",
        layout: "stack",
        gridItemFillCellHeight: true, // Use fill logic
        backgroundColor: "#002fff",
        borderRadius: 15
    }, intro.id);

    // --- 2. About Section ---
    const about = await framer.createFrameNode({
        name: "About",
        width: "100%",
        height: 1000,
        layout: null, // Freeform
        backgroundColor: "transparent",
        borderBottom: "1px dashed #000"
    }, main.id);

    await framer.createFrameNode({
        name: "aboutCenterBlock",
        top: 80, bottom: 80, left: 80, right: 80,
        position: "absolute",
        backgroundColor: "#ffbf00",
        borderRadius: 16.66,
        zIndex: -1
    }, about.id);

    await framer.createTextNode({ text: "ANTI-\nDISCIPLINARY", top: 40, left: 40, position: "absolute", ...txtStyle }, about.id);
    await framer.createTextNode({ text: "& DESIGN\nENGINEER", top: 40, right: 40, position: "absolute", textAlign: "right", ...txtStyle }, about.id);
    await framer.createTextNode({ text: "FOR", top: 450, left: 40, position: "absolute", ...txtStyle }, about.id);
    await framer.createTextNode({ text: "→ →", top: 450, centerX: "0%", position: "absolute", ...txtStyle }, about.id);
    await framer.createTextNode({ text: "CULTURAL\n& CREATIVE", bottom: 40, left: 40, position: "absolute", ...txtStyle }, about.id);
    await framer.createTextNode({ text: "BASED\nPRACTICES", bottom: 40, right: 40, position: "absolute", textAlign: "right", ...txtStyle }, about.id);

    // --- 3. Location Section ---
    const location = await framer.createFrameNode({
        name: "Location",
        width: "100%",
        height: 1000,
        layout: null, // Freeform
        backgroundColor: "transparent",
        borderBottom: "1px dashed #000"
    }, main.id);

    await framer.createFrameNode({
        name: "locationBlock",
        top: 200, bottom: 200, left: 40, right: 40,
        position: "absolute",
        backgroundColor: "#ffbf00",
        borderRadius: 19.68,
        zIndex: -1
    }, location.id);

    await framer.createTextNode({ text: "LOCATED", top: 40, left: 40, position: "absolute", ...txtStyle }, location.id);
    await framer.createTextNode({ text: "BHX", top: 40, right: 350, position: "absolute", ...txtStyle }, location.id);
    await framer.createTextNode({ text: "LON", top: 40, right: 40, position: "absolute", textAlign: "right", ...txtStyle }, location.id);
    await framer.createTextNode({ text: "AVAIL\nABLE", bottom: 40, left: 40, position: "absolute", ...txtStyle }, location.id);
    await framer.createTextNode({ text: "WORLD\nWIDE", bottom: 40, right: 40, position: "absolute", textAlign: "right", ...txtStyle }, location.id);

    // --- 4. Work Section ---
    const work = await framer.createFrameNode({
        name: "Work",
        width: "100%",
        height: 1000,
        layout: "stack",
        stackDirection: "vertical",
        padding: 40, gap: 20,
        backgroundColor: "transparent",
        borderBottom: "1px dashed #000"
    }, main.id);

    const workHeader = await framer.createFrameNode({
        width: "100%", height: 100,
        layout: "stack", stackDirection: "horizontal", stackDistribution: "space-between",
        backgroundColor: "transparent"
    }, work.id);
    await framer.createTextNode({ text: "WORK", ...txtStyle }, workHeader.id);
    await framer.createTextNode({ text: "[4]", ...txtStyle }, workHeader.id);

    const workGrid = await framer.createFrameNode({
        width: "100%", height: 800,
        layout: "grid", gridColumnCount: 2, gap: 20,
        backgroundColor: "transparent"
    }, work.id);

    for (let i = 1; i <= 4; i++) {
        await framer.createFrameNode({
            width: "100%", height: "100%",
            backgroundColor: "#EBEBEB",
            borderRadius: 15
        }, workGrid.id);
    }

    // --- 5. Process Section ---
    const process = await framer.createFrameNode({
        name: "Process",
        width: "100%",
        height: 1000,
        layout: null, // Freeform
        backgroundColor: "transparent",
        borderBottom: "1px dashed #000"
    }, main.id);

    await framer.createTextNode({ text: "PROCESS:", top: 40, left: 40, position: "absolute", ...txtStyle }, process.id);
    await framer.createTextNode({ text: "CONCEPT", top: 40, right: 40, position: "absolute", textAlign: "right", ...txtStyle }, process.id);
    
    await framer.createFrameNode({
        name: "purpleSquare",
        width: 275, height: 275,
        position: "absolute", centerX: "0%", centerY: "0%",
        backgroundColor: "#8a38f5",
        borderRadius: 20
    }, process.id);

    await framer.createTextNode({ text: "BUILD", bottom: 40, left: 40, position: "absolute", ...txtStyle }, process.id);
    await framer.createTextNode({ text: "SHIP", bottom: 40, right: 40, position: "absolute", textAlign: "right", ...txtStyle }, process.id);

    // --- 6. Footer Section ---
    const footer = await framer.createFrameNode({
        name: "Footer",
        width: "100%",
        height: 1000,
        layout: "stack",
        stackAlignment: "center",
        stackDistribution: "center",
        backgroundColor: "transparent"
    }, main.id);

    await framer.createTextNode({ 
        text: "LET'S BUILD\nOR CHAT\nABOUT\nSOMETHING", 
        fontSize: 100.8, letterSpacing: -5.04, lineHeight: 0.9, textAlign: "center"
    }, footer.id);

    console.log("Desktop layout done!");
}

run().catch(console.error);
