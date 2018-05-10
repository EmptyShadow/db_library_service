exports.getLangByStr = function (str) {
    for (let i = 0; i < str.length; i++) {
        let uCode = str.charCodeAt(i);
        if (isRu(uCode)) return 'ru';
        if (isEn(uCode)) return 'en';
    }
    return null;
}

/**
 * Русский
 * @param {unicode символа} uCodechar S
 */
let isRu = function (uCodechar) {
    return (0x0410 <= uCodechar && uCodechar <= 0x044F);
}

/**
 * Английский
 * @param {unicode символа} uCodechar 
 */
let isEn = function (uCodechar) {
    return (0x0041 <= uCodechar && uCodechar <= 0x005A) || (0x0061 <= uCodechar && uCodechar <= 0x007A);
}