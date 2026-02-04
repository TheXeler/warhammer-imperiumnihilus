/**
 * The DataModel for a Character in the custom system.
 * @extends {foundry.abstract.TypeDataModel}
 */

const {
    ArrayField,
    BooleanField,
    HTMLField,
    NumberField,
    SchemaField,
    StringField
} = foundry.data.fields;

export default class CharacterDataModel extends foundry.abstract.TypeDataModel {
    /** @inheritdoc */
    static defineSchema() {
        const fields = foundry.data.fields;

        return  {
            // 角色基本属性
            attributes: new fields.SchemaField({
                health: new fields.NumberField({
                    initial: 10,
                    integer: true,
                    min: 0,
                    label: "STARLINK.Character.HealthPoints.Label",
                    hint: "STARLINK.Character.HealthPoints.Hint"
                }),
                strength: new fields.NumberField({
                    initial: 1,
                    integer: true,
                    min: 0,
                    label: "STARLINK.Character.Strength.Label",
                    hint: "STARLINK.Character.Strength.Hint"
                }),
                dexterity: new fields.NumberField({
                    initial: 1,
                    integer: true,
                    min: 0,
                    label: "STARLINK.Character.Dexterity.Label",
                    hint: "STARLINK.Character.Dexterity.Hint"
                }),
                constitution: new fields.NumberField({
                    initial: 1,
                    integer: true,
                    min: 0,
                    label: "STARLINK.Character.Constitution.Label",
                    hint: "STARLINK.Character.Constitution.Hint"
                })
            }),

            // 技能表
            skills: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField({
                        initial: "",
                        label: "STARLINK.Character.Skill.Name.Label",
                        hint: "STARLINK.Character.Skill.Name.Hint"
                    }),
                    value: new fields.NumberField({
                        initial: 0,
                        integer: true,
                        min: 0,
                        label: "STARLINK.Character.Skill.Value.Label",
                        hint: "STARLINK.Character.Skill.Value.Hint"
                    })
                }),
                {
                    label: "STARLINK.Character.Skills.Label",
                    hint: "STARLINK.Character.Skills.Hint"
                }
            ),

            // 插槽
            skillSlots: new fields.SchemaField({
                max: new fields.NumberField({
                    initial: 3,
                    integer: true,
                    min: 0,
                    label: "STARLINK.Character.SkillSlots.Max.Label",
                    hint: "STARLINK.Character.SkillSlots.Max.Hint"
                }),
                used: new fields.NumberField({
                    initial: 0,
                    integer: true,
                    min: 0,
                    label: "STARLINK.Character.SkillSlots.Used.Label",
                    hint: "STARLINK.Character.SkillSlots.Used.Hint"
                })
            })
        };
    }

    prepareDerivedData() {
        // 确保已用技能槽位不超过最大值
        this.skillSlots.used = Math.min(
            this.skillSlots.used,
            this.skillSlots.max
        );

        // 确保技能数量不超过已用槽位
        if (this.skills.length > this.skillSlots.used) {
            this.skills.length = this.skillSlots.used;
        }
    }
}