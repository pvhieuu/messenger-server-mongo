"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHelper = void 0;
const convertHelper = () => {
    const removeAccents = (string) => string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
    return {
        removeAccents,
    };
};
exports.convertHelper = convertHelper;
//# sourceMappingURL=convert.helper.js.map