"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);

export { gsap, MotionPathPlugin, ScrollTrigger, SplitText, useGSAP };
