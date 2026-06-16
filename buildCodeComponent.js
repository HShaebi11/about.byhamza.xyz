const fs = require('fs');

async function run() {
    console.log("Reading project files...");

    const read = (path) => {
        try { return fs.readFileSync(path, 'utf8'); } catch(e) { return ''; }
    };

    const globalsCss = read('app/globals.css');
    const pageCss = read('app/page.module.css');
    const dividerCss = read('components/Divider.module.css');
    const navLinkCss = read('components/NavLink.module.css');
    const projectCardCss = read('components/ProjectCard.module.css');
    const projectSheetCss = read('components/ProjectSheet.module.css');

    // Combine all CSS into one massive string
    let allCss = `
        ${globalsCss}
        ${pageCss}
        ${dividerCss}
        ${navLinkCss}
        ${projectCardCss}
        ${projectSheetCss}
    `;
    
    // Replace .module.css selectors (e.g. .main -> .main, but ensure no collisions)
    // Actually, in CSS modules, classes are just normal classes before hashing. 
    // We just keep them as normal classes.

    let homeClient = read('components/HomeClient.tsx');
    let divider = read('components/Divider.tsx');
    let navLink = read('components/NavLink.tsx');
    let projectCard = read('components/ProjectCard.tsx');
    let projectSheet = read('components/ProjectSheet.tsx');
    let useGSAP = read('hooks/useGSAPAnimations.ts');

    // Remove imports of local files
    const stripImports = (code) => {
        return code.replace(/import\s+.*(?:from\s+)?['"](?:\.|@\/).*['"];?\n/g, '');
    };

    // Replace styles.xxx with "xxx"
    const fixStyles = (code) => {
        return code.replace(/styles\.([a-zA-Z0-9_]+)/g, '"$1"');
    };

    // Bundle them
    let bundle = `
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ==========================================
// CSS INJECTION
// ==========================================
const INJECTED_CSS = \`${allCss.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

function StyleInjector() {
    useEffect(() => {
        if (!document.getElementById("ref-site-styles")) {
            const style = document.createElement("style");
            style.id = "ref-site-styles";
            style.innerHTML = INJECTED_CSS;
            document.head.appendChild(style);
        }
    }, []);
    return null;
}

// ==========================================
// HOOKS
// ==========================================
${stripImports(useGSAP).replace(/export const useGSAPAnimations/, 'const useGSAPAnimations')}

// ==========================================
// COMPONENTS
// ==========================================
${fixStyles(stripImports(divider)).replace(/export default function Divider/, 'function Divider')}
${fixStyles(stripImports(navLink)).replace(/export default function NavLink/, 'function NavLink')}
${fixStyles(stripImports(projectCard)).replace(/export default function ProjectCard/, 'function ProjectCard')}
${fixStyles(stripImports(projectSheet)).replace(/export default function ProjectSheet/, 'function ProjectSheet')}

// ==========================================
// MAIN COMPONENT
// ==========================================
${fixStyles(stripImports(homeClient)).replace(/export default function HomeClient/, 'export default function ReferenceSite')}
    `;

    // Because Framer doesn't have gsap installed by default in Code Components, we might have an issue importing it.
    // Framer code components support imports from "framer" and "react", but usually third-party packages work if they are ESM via esm.sh.
    // So we change the gsap imports to esm URLs.
    
    bundle = bundle.replace(/import gsap from "gsap";/, 'import gsap from "https://esm.sh/gsap";');
    bundle = bundle.replace(/import { ScrollTrigger } from "gsap\/dist\/ScrollTrigger";/, 'import { ScrollTrigger } from "https://esm.sh/gsap/ScrollTrigger";');
    bundle = bundle.replace(/import { useGSAP } from "@gsap\/react";/, 'import { useGSAP } from "https://esm.sh/@gsap/react";');

    // In HomeClient, there's <ProjectSheet project={selectedProject} /> 
    // We also need to add <StyleInjector /> inside the main return.
    bundle = bundle.replace(/(<main[^>]*>)/, '<StyleInjector />\n$1');

    console.log("Creating Code Component in Framer...");
    const file = await framer.createCodeFile("ReferenceSite.tsx", bundle);
    console.log("Created file:", file);
}

run().catch(console.error);
