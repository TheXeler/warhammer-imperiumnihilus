// module/sheet/auto-sheet-converter.mjs
import BaseActorSheet from "./actor/base-actor-sheet.mjs";

/**
 * 自动从DataModel生成Sheet的转换器
 * 能够自动分析DataModel结构并生成对应的表单界面
 */
export default class AutoSheetConverter {
    /**
     * 字段类型到表单控件的映射
     */
    static FIELD_TYPE_MAP = {
        "BooleanField": "checkbox",
        "NumberField": "number",
        "StringField": "text",
        "HTMLField": "editor",
        "ArrayField": "array",
        "SchemaField": "schema"
    };

    /**
     * 从DataModel生成Sheet配置
     * @param {typeof foundry.abstract.TypeDataModel} DataModel - DataModel类
     * @returns {object} Sheet配置对象
     */
    static generateSheetConfig(DataModel) {
        const schema = DataModel.defineSchema();
        const config = {
            fields: {},
            sections: [],
            tabs: []
        };

        // 递归处理schema结构
        this._processSchema(schema, config, "");

        return config;
    }

    /**
     * 递归处理schema结构
     * @param {object} schema - schema对象
     * @param {object} config - 配置对象
     * @param {string} path - 当前路径
     * @private
     */
    static _processSchema(schema, config, path) {
        for (const [key, field] of Object.entries(schema)) {
            const currentPath = path ? `${path}.${key}` : key;

            if (field instanceof foundry.data.fields.SchemaField) {
                // 处理嵌套的SchemaField
                this._processSchema(field.fields, config, currentPath);
            } else {
                // 处理普通字段
                const fieldConfig = this._getFieldConfig(field, currentPath);
                config.fields[currentPath] = fieldConfig;

                // 创建默认分组
                const sectionName = path || "general";
                let section = config.sections.find(s => s.name === sectionName);
                if (!section) {
                    section = {
                        name: sectionName,
                        label: game.i18n.localize(`STARLINK.Sheet.Section.${sectionName.titleCase()}`) || sectionName.titleCase(),
                        fields: []
                    };
                    config.sections.push(section);
                }
                section.fields.push(currentPath);
            }
        }
    }

    /**
     * 获取字段配置
     * @param {foundry.data.fields.DataField} field - 字段对象
     * @param {string} path - 字段路径
     * @returns {object} 字段配置
     * @private
     */
    static _getFieldConfig(field, path) {
        const fieldType = field.constructor.name;
        const controlType = this.FIELD_TYPE_MAP[fieldType] || "text";

        return {
            type: controlType,
            label: game.i18n.localize(field.options.label) || path.split('.').pop().titleCase(),
            hint: game.i18n.localize(field.options.hint) || "",
            path: path,
            required: field.options.required || false,
            nullable: field.options.nullable || false,
            initial: field.options.initial,
            options: this._getFieldOptions(field)
        };
    }

    /**
     * 获取字段特定选项
     * @param {foundry.data.fields.DataField} field - 字段对象
     * @returns {object} 字段选项
     * @private
     */
    static _getFieldOptions(field) {
        const options = {};

        if (field instanceof foundry.data.fields.NumberField) {
            if (field.options.integer !== undefined) options.integer = field.options.integer;
            if (field.options.min !== undefined) options.min = field.options.min;
            if (field.options.max !== undefined) options.max = field.options.max;
            if (field.options.step !== undefined) options.step = field.options.step;
        } else if (field instanceof foundry.data.fields.StringField) {
            if (field.options.choices !== undefined) options.choices = field.options.choices;
            if (field.options.blank !== undefined) options.blank = field.options.blank;
        } else if (field instanceof foundry.data.fields.ArrayField) {
            options.elementType = field.elementType;
        }

        return options;
    }

    /**
     * 生成HTML模板
     * @param {object} config - Sheet配置
     * @param {string} templateType - 模板类型 (sheet|tab)
     * @returns {string} HTML模板字符串
     */
    static generateTemplate(config, templateType = "sheet") {
        if (templateType === "sheet") {
            return this._generateSheetTemplate(config);
        } else if (templateType === "tab") {
            return this._generateTabTemplate(config);
        }
        return "";
    }

    /**
     * 生成完整Sheet模板
     * @param {object} config - Sheet配置
     * @returns {string} HTML模板字符串
     * @private
     */
    static _generateSheetTemplate(config) {
        const tabs = config.tabs.map(tab => `
            <div class="tab" data-tab="${tab.id}" data-group="primary">
                ${this._generateTabContent(config, tab.id)}
            </div>
        `).join('\n');

        return `<form class="starlink-sheet">
    <header class="sheet-header">
        <img class="profile-img" src="{{actor.img}}" data-edit="img" title="{{actor.name}}"/>
        <div class="header-fields">
            <h1 class="charname">
                <input name="name" type="text" value="{{actor.name}}" placeholder="Name"/>
            </h1>
        </div>
    </header>
    
    <nav class="sheet-tabs tabs" data-group="primary">
        ${config.tabs.map(tab => `            <a class="item" data-tab="${tab.id}" data-group="primary">${tab.label}</a>
        `).join('\n')}    </nav>
    
    <section class="sheet-body">
        ${tabs}    </section>
</form>
        `.trim();
    }
}