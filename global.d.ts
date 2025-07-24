// global.d.ts
import type { StaticImageData } from 'next/image';

declare module '*.svg' {
    const src: StaticImageData;
    export default src;
}

declare module '*.png' {
    const src: StaticImageData;
    export default src;
}

declare module '*.jpg' {
    const src: StaticImageData;
    export default src;
}
