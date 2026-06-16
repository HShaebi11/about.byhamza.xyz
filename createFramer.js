// Script to generate the Hamza Shaebi portfolio layout in Framer

async function run() {
    console.log("Starting layout generation...");

    // Create a new design page
    const page = await framer.createDesignPage("Hamza Portfolio");
    await framer.setSelection([page.id]);

    // Main Container
    const main = await framer.createFrameNode({
        name: "Main Portfolio Container",
        width: 1440,
        height: 4800,
        backgroundColor: "#FFFFFF",
        layout: "stack",
        stackDirection: "vertical",
        stackAlignment: "start",
        stackDistribution: "start",
        padding: 40,
        gap: 0,
    }, page.id);

    // =====================================
    // 1. Intro Section
    // =====================================
    const introSection = await framer.createFrameNode({
        name: "Intro Section",
        width: "100%",
        height: 900,
        layout: "stack",
        stackDirection: "vertical",
        stackAlignment: "stretch",
        stackDistribution: "start",
        backgroundColor: "transparent",
    }, main.id);

    // Header
    const header = await framer.createFrameNode({
        name: "Header",
        width: "100%",
        height: 150,
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "space-between",
        stackAlignment: "center",
        backgroundColor: "transparent",
    }, introSection.id);

    await framer.createTextNode({
        name: "Name Start",
        text: "HAMZA",
    }, header.id);

    await framer.createTextNode({
        name: "Name End",
        text: "SHAEBI",
    }, header.id);

    // Nav
    const navSection = await framer.createFrameNode({
        name: "Nav Section",
        width: "100%",
        height: 100,
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "start",
        stackAlignment: "center",
        gap: 20,
        backgroundColor: "transparent",
    }, introSection.id);

    const navItems = ["WORK", "PROCESS", "SOCIALS", "SAY HELLO"];
    for (const item of navItems) {
        const navItem = await framer.createFrameNode({
            name: `Nav: ${item}`,
            width: 120,
            height: 40,
            backgroundColor: item === "WORK" ? "#000000" : "#EBEBEB",
            layout: "stack",
            stackAlignment: "center",
            stackDistribution: "center",
            borderRadius: 8,
        }, navSection.id);
        
        await framer.createTextNode({
            text: item,
        }, navItem.id);
    }

    // Hero Block
    await framer.createFrameNode({
        name: "Hero Block",
        width: "100%",
        height: 600,
        backgroundColor: "#002fff",
        borderRadius: 15,
    }, introSection.id);


    // =====================================
    // 2. About Section
    // =====================================
    const aboutSection = await framer.createFrameNode({
        name: "About Section",
        width: "100%",
        height: 900,
        layout: "stack", // Using stack since grid is complex via API
        stackDirection: "vertical",
        stackDistribution: "space-between",
        backgroundColor: "transparent",
        padding: 40,
    }, main.id);

    await framer.createTextNode({ name: "Anti text", text: "ANTI-DISCIPLINARY" }, aboutSection.id);
    await framer.createTextNode({ name: "Design text", text: "& DESIGN ENGINEER" }, aboutSection.id);
    await framer.createTextNode({ name: "For text", text: "FOR" }, aboutSection.id);
    await framer.createTextNode({ name: "Cultural text", text: "CULTURAL & CREATIVE" }, aboutSection.id);
    await framer.createTextNode({ name: "Practices text", text: "BASED PRACTICES" }, aboutSection.id);

    // About Background Block
    await framer.createFrameNode({
        name: "Yellow Block",
        width: 800,
        height: 600,
        backgroundColor: "#ffbf00",
        borderRadius: 16,
        position: "absolute",
        left: "50%",
        top: "50%",
        zIndex: -1,
    }, aboutSection.id);

    // =====================================
    // 3. Location Section
    // =====================================
    const locationSection = await framer.createFrameNode({
        name: "Location Section",
        width: "100%",
        height: 900,
        layout: "stack",
        stackDirection: "vertical",
        stackDistribution: "space-between",
        backgroundColor: "transparent",
    }, main.id);

    await framer.createTextNode({ text: "LOCATED IN BHX LON" }, locationSection.id);
    
    await framer.createFrameNode({
        name: "Location Block",
        width: "100%",
        height: 600,
        backgroundColor: "#ffbf00",
        borderRadius: 19,
    }, locationSection.id);

    await framer.createTextNode({ text: "AVAIL ABLE WORLD WIDE" }, locationSection.id);


    // =====================================
    // 4. Work Section
    // =====================================
    const workSection = await framer.createFrameNode({
        name: "Work Section",
        width: "100%",
        height: 900,
        layout: "stack",
        stackDirection: "vertical",
        gap: 40,
        backgroundColor: "transparent",
    }, main.id);

    const workHeader = await framer.createFrameNode({
        name: "Work Header",
        width: "100%",
        height: 100,
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "space-between",
        backgroundColor: "transparent",
    }, workSection.id);

    await framer.createTextNode({ text: "WORK" }, workHeader.id);
    await framer.createTextNode({ text: "[4]" }, workHeader.id);

    const workGrid = await framer.createFrameNode({
        name: "Work Grid",
        width: "100%",
        height: 600,
        layout: "stack",
        stackDirection: "horizontal",
        gap: 20,
        backgroundColor: "transparent",
    }, workSection.id);

    // Create 4 dummy project cards
    for(let i=1; i<=4; i++) {
        await framer.createFrameNode({
            name: `Project ${i}`,
            width: 300,
            height: 500,
            backgroundColor: "#EBEBEB",
            borderRadius: 15,
        }, workGrid.id);
    }

    // =====================================
    // 5. Process Section
    // =====================================
    const processSection = await framer.createFrameNode({
        name: "Process Section",
        width: "100%",
        height: 900,
        layout: "stack",
        stackDirection: "vertical",
        stackAlignment: "center",
        stackDistribution: "center",
        gap: 40,
        backgroundColor: "transparent",
    }, main.id);

    await framer.createTextNode({ text: "PROCESS: CONCEPT" }, processSection.id);
    
    await framer.createFrameNode({
        name: "Purple Square",
        width: 275,
        height: 275,
        backgroundColor: "#8a38f5",
        borderRadius: 20,
    }, processSection.id);

    await framer.createTextNode({ text: "BUILD SHIP" }, processSection.id);

    // =====================================
    // 6. Footer Section
    // =====================================
    const footerSection = await framer.createFrameNode({
        name: "Footer Section",
        width: "100%",
        height: 900,
        layout: "stack",
        stackDirection: "vertical",
        stackAlignment: "center",
        stackDistribution: "center",
        backgroundColor: "transparent",
    }, main.id);

    await framer.createTextNode({ 
        text: "LET'S BUILD OR CHAT ABOUT SOMETHING",
    }, footerSection.id);

    console.log("Generation complete!");
}

run().catch(console.error);
