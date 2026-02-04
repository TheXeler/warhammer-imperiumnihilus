import {IMPERIUMNIHILUS, CONST} from "./config.mjs"

//import * as sheets from "./sheet/module.mjs"
import * as dataModels from "./data/module.mjs"
//import * as documents from "./document/module.mjs"
import {log} from "./utils.mjs";
import * as sheets from "./automatic/auto-sheets.mjs";

globalThis.imperiumnihilus = {
    config: IMPERIUMNIHILUS,
    dataModels: dataModels,
    //documents: documents
}

Hooks.once("init", function () {
    globalThis.imperiumnihilus = game.imperiumnihilus = Object.assign(game.system, globalThis.imperiumnihilus);

    CONFIG.IMPERIUMNIHILUS = IMPERIUMNIHILUS;

    log("Data assign...")
    Object.assign(CONFIG.Actor.dataModels, dataModels.actor);
    Object.assign(CONFIG.Item.dataModels, dataModels.item);

    //CONFIG.Actor.dataModels = dataModels.actor;
    //CONFIG.Item.dataModels = dataModels.item;

    log("Registering sheets...")
    const {Actors, Items} = foundry.documents.collections;
    sheets.createAllSheets([{
        sheet: sheets.Ship,
        types: ["Ship"],
        makeDefault: true,
        label: "IMPERIUMNIHILUS.SheetLabel.Ship"
    }, {
        sheet: sheets.Character,
        types: ["Character"],
        makeDefault: true,
        label: "IMPERIUMNIHILUS.SheetLabel.Character"
    }]).forEach(sheetInfo => {
        Actors.registerSheet(CONST.SYSTEM_ID, sheetInfo.class, sheetInfo.config)
    });

    const {DocumentSheetConfig} = foundry.applications.apps;

})