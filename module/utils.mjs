export function log(message, { color="#6e0000", extras=[], level="log" }={}) {
    console[level](
        `%cStarLink | %c${message}`, `color: ${color}; font-variant: small-caps`, "color: revert", ...extras
    );
}
