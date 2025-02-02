import { ColumnWidthState } from "cdm/StyleModel";
import { DatabaseCore, WidthVariables } from "helpers/Constants";

/**
 * Wrap the classname of css elements
 * @param className 
 * @returns 
 */
export function c(className: string): string {
    const wrappedClasses: string[] = [];
    className.split(' ').forEach((cls) => {
        wrappedClasses.push(`${DatabaseCore.FRONTMATTER_KEY}__${cls}`);
    });
    return wrappedClasses.join(' ');
}

/** Generate random key ids */
export function shortId() {
    return '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Given a string, parse it to be key candidate
 * @param str
 * @returns {string}
 */
export function dbTrim(str: string) {
    return str.trim().replaceAll("\n", "").replaceAll("\t", "").replaceAll(" ", "_");
}

/**
 * Calculate summatory of column widths
 * @param state 
 * @returns 
 */
export function getTotalWidth(state: ColumnWidthState): number {
    let totalWidth = 0;
    Object.keys(state.widthRecord).forEach((key) => {
        totalWidth += state.widthRecord[key];
    });
    return totalWidth;
}