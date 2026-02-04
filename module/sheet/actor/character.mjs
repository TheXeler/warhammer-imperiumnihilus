export default class CharacterSheet extends foundry.applications.sheets.ActorSheetV2 {
    get template() {
        return `templates/sheet-actor-character-${this.isEditable ? "editor" : "view"}.html`;
    }

    async getData(options = {}) {
        const context = await super.getData(options);

        // 丰富HTML内容
        context.attributes = {
            health: await TextEditor.enrichHTML(this.object.system.attributes.health, {
                async: true,
                secrets: this.object.isOwner,
                relativeTo: this.object
            }),
            strength: await TextEditor.enrichHTML(this.object.system.attributes.strength, {
                async: true,
                secrets: this.object.isOwner,
                relativeTo: this.object
            }),
            dexterity: await TextEditor.enrichHTML(this.object.system.attributes.dexterity, {
                async: true,
                secrets: this.object.isOwner,
                relativeTo: this.object
            }),
            constitution: await TextEditor.enrichHTML(this.object.system.attributes.constitution, {
                async: true,
                secrets: this.object.isOwner,
                relativeTo: this.object
            })
        };

        // 处理技能列表
        context.skills = this.object.system.skills.map(async (skill) => {
            return {
                name: await TextEditor.enrichHTML(skill.name, {
                    async: true,
                    secrets: this.object.isOwner,
                    relativeTo: this.object
                }),
                value: skill.value
            };
        });

        // 等待所有异步HTML丰富化完成
        context.skills = await Promise.all(context.skills);

        return context;
    }
}
