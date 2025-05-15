"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdministratorRouter = void 0;
const express_1 = require("express");
const administrator_models_1 = require("../../models/administrator.models");
const router = (0, express_1.Router)();
exports.deleteAdministratorRouter = router;
router.delete("/api/administrator/delete/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const administrator = yield administrator_models_1.Administrator.findById(id);
    if (!administrator) {
        let error = new Error("Administrator not found");
        error.status = 404;
        return next(error);
    }
    yield administrator_models_1.Administrator.deleteOne({ _id: id });
    res.status(200).send({ deleted: administrator });
}));
