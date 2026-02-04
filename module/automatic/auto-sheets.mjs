// module/sheet/auto-actor-sheet.mjs
import AutoSheetConverter from "./sheet-converter.mjs";

export class AutoActorSheet extends foundry.application.sheets.ActorSheetV2 {
    constructor(actor, options = {}) {
        super(actor, options);

        // 根据actor类型自动生成配置
        const dataModel = actor.constructor.metadata.dataModel;
        if (dataModel) {
            this._sheetConfig = AutoSheetConverter.generateSheetConfig(dataModel);
        }
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 600,
            height: 800,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes"}]
        });
    }

    getData() {
        const data = super.getData();
        data.config = this._sheetConfig;
        return data;
    }
}

export class AutoItemSheet extends foundry.application.sheets.ItemSheetV2 {
    constructor(item, options = {}) {
        super(item, options);

        // 根据item类型自动生成配置
        const dataModel = item.constructor.metadata.dataModel;
        if (dataModel) {
            this._sheetConfig = AutoSheetConverter.generateSheetConfig(dataModel);
        }
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 600,
            height: 800,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes"}]
        })
    }
}

export function createAutoSheet(sheetConfig) {
    const typeName = sheetConfig.types[0];
    const isItem = sheetConfig.types.some(type => CONFIG.Item.dataModels[type]);
    const baseClass = isItem ? AutoItemSheet : AutoActorSheet;

    return class extends baseClass {
        static get defaultOptions() {
            return mergeObject(super.defaultOptions, {
                template: `templates/sheets/${typeName.toLowerCase()}-sheet.hbs`
            });
        }
    };
}


export function createAllSheets(sheetConfigs) {
    return sheetConfigs.map(config => {
        const typeName = config.name;
        const AutoSheetClass = class extends AutoActorSheet {
            static get defaultOptions() {
                return Object.assign(super.defaultOptions, {
                    template: `templates/sheets/${typeName.toLowerCase()}-sheet.hbs`
                });
            }
        };

        return {
            class: AutoSheetClass,
            config: config
        };
    });
}


