"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValue = void 0;
const checkValue = () => {
    const isPhoneNumber = (string) => /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(string);
    const isEmail = (string) => /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(string);
    return {
        isPhoneNumber,
        isEmail,
    };
};
exports.checkValue = checkValue;
//# sourceMappingURL=checkValue.helper.js.map