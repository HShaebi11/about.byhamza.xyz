async function run() {
    console.log("Generating Exact Intro Component...");

    const page = await framer.createDesignPage("Exact Intro Section");
    await framer.setSelection([page.id]);

    const intro = await framer.createFrameNode({
        name: "Intro Section",
        width: 1440,
        height: 1000,
        backgroundColor: "#FFFFFF",
        layout: "stack",
        stackDirection: "vertical",
        stackAlignment: "start",
        stackDistribution: "start",
        gap: 0,
    }, page.id);

    const txtStyle = {
        fontSize: 84.65,
        letterSpacing: -4.26,
        lineHeight: 0.75,
    };

    // Header Container
    const header = await framer.createFrameNode({
        name: "Header",
        width: "100%",
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "space-between",
        stackAlignment: "center",
        backgroundColor: "transparent",
        paddingTop: 33.86,
        paddingBottom: 33.86,
        paddingLeft: 40,
        paddingRight: 40,
    }, intro.id);

    await framer.createTextNode({ text: "HAMZA", ...txtStyle }, header.id);
    await framer.createTextNode({ text: "SHAEBI", ...txtStyle, textAlign: "right" }, header.id);

    // Divider
    await framer.createFrameNode({
        name: "Divider 1",
        width: "100%",
        height: 1,
        backgroundColor: "#000",
    }, intro.id);

    // Nav Container
    const nav = await framer.createFrameNode({
        name: "Nav Section",
        width: "100%",
        layout: "stack",
        stackDirection: "horizontal",
        stackDistribution: "start",
        stackAlignment: "center",
        gap: 16.93,
        backgroundColor: "transparent",
        paddingTop: 33.86,
        paddingBottom: 33.86,
        paddingLeft: 40,
        paddingRight: 40,
    }, intro.id);

    const navItems = [
        { text: "WORK", variant: "fill" },
        { text: "PROCESS", variant: "default" },
        { text: "SOCIALS", variant: "default" },
        { text: "SAY   HELLO", variant: "default" }
    ];

    for (const item of navItems) {
        const isFill = item.variant === "fill";
        const navItem = await framer.createFrameNode({
            name: `NavLink: ${item.text}`,
            layout: "stack",
            stackDirection: "horizontal",
            stackAlignment: "center",
            stackDistribution: "center",
            backgroundColor: isFill ? "#000000" : "#ebebeb",
            borderRadius: 8.46,
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            gridItemFillCellWidth: true, // This allows flex: 1 behavior
        }, nav.id);
        
        await framer.createTextNode({ 
            text: item.text, 
            ...txtStyle, 
            color: isFill ? "#FFFFFF" : "#000000" 
        }, navItem.id);
    }

    // Divider
    await framer.createFrameNode({
        name: "Divider 2",
        width: "100%",
        height: 1,
        backgroundColor: "#000",
    }, intro.id);

    // Hero Container
    const heroSection = await framer.createFrameNode({
        name: "Hero Section",
        width: "100%",
        layout: "stack",
        stackDirection: "vertical",
        gridItemFillCellHeight: true,
        padding: 40,
        backgroundColor: "transparent"
    }, intro.id);

    // Hero Block
    await framer.createFrameNode({
        name: "Hero Block",
        width: "100%",
        layout: "stack",
        gridItemFillCellHeight: true,
        backgroundColor: "#002fff",
        borderRadius: 15,
    }, heroSection.id);

    console.log("Intro layout fully built.");
}

run().catch(console.error);
