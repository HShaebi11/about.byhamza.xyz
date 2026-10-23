import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { SplitText } from "./SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Observer);

export { gsap, useGSAP, ScrollTrigger, SplitText, Observer };

