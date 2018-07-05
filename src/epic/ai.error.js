module.exports = {
    fn10001: (arg, type) => `[AI-10001] Argument must be ${type}, but now it's ${arg}`,
    fn10002: (arg, type, expected) => `[AI-10002] Argument must be in (${expected}), but now it's ${arg}`,

    fn10003: (fileType) => `[AI-10003] The fileType=${fileType} is unknown and could not found parser`,
};