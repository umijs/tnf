import { StopInput, Instance as TinyGradient } from 'tinygradient';
import { ColorInput } from 'tinycolor2';
interface GradientOptions {
    interpolation?: 'rgb' | 'hsv';
    hsvSpin?: 'short' | 'long';
}
interface GradientFunction {
    (str: string): string;
    multiline: MultiLineGradientFunction;
    /**
     *  @deprecated
     *  Pass options like this instead: myGradient = gradient(['red', 'blue'], options)
     */
    (str: string, opts?: GradientOptions): string;
}
interface MultiLineGradientFunction {
    (str: string): string;
    /**
     * @deprecated
     * Pass options like this instead: gradient(['red', 'blue'], options).multiline('...')
     */
    (str: string, opts?: GradientOptions): string;
}
interface AliasGradientFunction {
    (str: string): string;
    multiline: (str: string) => string;
}
interface GradientCreator {
    (...colors: [ColorInput[] | StopInput[], GradientOptions?]): GradientFunction;
    /**
     * @deprecated
     * Pass your colors in an array, like this: myGradient = gradient(['red', 'blue'], options)
     */
    (...colors: (ColorInput | StopInput | GradientOptions)[]): GradientFunction;
    /** @deprecated Use import { atlas } from 'gradient-string' instead */
    atlas: AliasGradientFunction;
    /** @deprecated Use import { cristal } from 'gradient-string' instead */
    cristal: AliasGradientFunction;
    /** @deprecated Use import { teen } from 'gradient-string' instead */
    teen: AliasGradientFunction;
    /** @deprecated Use import { mind } from 'gradient-string' instead */
    mind: AliasGradientFunction;
    /** @deprecated Use import { morning } from 'gradient-string' instead */
    morning: AliasGradientFunction;
    /** @deprecated Use import { vice } from 'gradient-string' instead */
    vice: AliasGradientFunction;
    /** @deprecated Use import { passion } from 'gradient-string' instead */
    passion: AliasGradientFunction;
    /** @deprecated Use import { fruit } from 'gradient-string' instead */
    fruit: AliasGradientFunction;
    /** @deprecated Use import { instagram } from 'gradient-string' instead */
    instagram: AliasGradientFunction;
    /** @deprecated Use import { retro } from 'gradient-string' instead */
    retro: AliasGradientFunction;
    /** @deprecated Use import { summer } from 'gradient-string' instead */
    summer: AliasGradientFunction;
    /** @deprecated Use import { rainbow } from 'gradient-string' instead */
    rainbow: AliasGradientFunction;
    /** @deprecated Use import { pastel } from 'gradient-string' instead */
    pastel: AliasGradientFunction;
}
declare const gradient: GradientCreator;
export declare function multiline(str: string, gradient: TinyGradient, opts?: GradientOptions): string;
export default gradient;
export declare const atlas: AliasGradientFunction;
export declare const cristal: AliasGradientFunction;
export declare const teen: AliasGradientFunction;
export declare const mind: AliasGradientFunction;
export declare const morning: AliasGradientFunction;
export declare const vice: AliasGradientFunction;
export declare const passion: AliasGradientFunction;
export declare const fruit: AliasGradientFunction;
export declare const instagram: AliasGradientFunction;
export declare const retro: AliasGradientFunction;
export declare const summer: AliasGradientFunction;
export declare const rainbow: AliasGradientFunction;
export declare const pastel: AliasGradientFunction;
