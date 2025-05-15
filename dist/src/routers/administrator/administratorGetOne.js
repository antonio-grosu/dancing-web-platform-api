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
exports.getOneAdministratorRouter = void 0;
const express_1 = require("express");
const administrator_models_1 = require("../../models/administrator.models");
const router = (0, express_1.Router)();
exports.getOneAdministratorRouter = router;
router.get("/api/administrator/getone/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        let error = new Error("Id is required in order to search for an administrator");
        error.status = 400;
        next(error);
    }
    const administrator = yield administrator_models_1.Administrator.findById({ _id: id });
    if (!administrator) {
        let error = new Error("Administrator not found");
        error.status = 400;
        return next(error);
    }
    res.status(200).send(administrator);
}));
