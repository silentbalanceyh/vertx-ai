module.exports = {
    fn10001: (arg, type) => `[AI-10001] Argument must be ${type}, but now it's ${arg}`,
    fn10002: (arg, type, expected) => `[AI-10002] Argument must be in (${expected}), but now it's ${arg}`,

    fn10003: (fileType) => `[AI-10003] The fileType=${fileType} is unknown and could not found parser`,
    fn10004: (arg) => `[AI-10004] The executor of command '${arg}' could not be found`,
    fn10005: (arg, expected) => `[AI-10005] The command '${arg}' could not be found, expected '${expected}'`,
    fn10006: (arg) => `[AI-10006] The command missed required arguments: '${arg}'`,

    fn10007: (arg) => `[AI-10007] The file '${arg}' does not exist or it's a directory.`,
    fn10008: (arg) => `[AI-10008] The directory '${arg}' does not exist or it's a file.`,
    fn10009: (arg) => `[AI-10009] The path '${arg}' does not exist.`
};