/**
 * The DataModel for a Starship in the custom system.
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

export default class StarshipDataModel extends foundry.abstract.TypeDataModel {


    /** @inheritdoc */
    static defineSchema() {

        return {
            attributes: new SchemaField({
                hp: new SchemaField({
                    value: new NumberField({
                        initial: 10,
                        integer: true,
                        min: 0,
                        label: "IMPERIUMNIHILUS.Ship.HealthPoints.Value.Label",
                        hint: "IMPERIUMNIHILUS.Ship.HealthPoints.Value.Hint"
                    }),
                    max: new NumberField({
                        initial: 10,
                        integer: true,
                        min: 0,
                        label: "IMPERIUMNIHILUS.Ship.HealthPoints.Max.Label",
                        hint: "IMPERIUMNIHILUS.Ship.HealthPoints.Max.Hint"
                    })
                }),
                shield: new SchemaField({
                    value: new NumberField({
                        initial: 10,
                        integer: true,
                        min: 0,
                        label: "IMPERIUMNIHILUS.Ship.Shield.Value.Label",
                        hint: "IMPERIUMNIHILUS.Ship.Shield.Value.Hint"
                    }),
                    max: new NumberField({
                        initial: 10,
                        integer: true,
                        min: 0,
                        label: "IMPERIUMNIHILUS.Ship.Shield.Max.Label",
                        hint: "IMPERIUMNIHILUS.Ship.Shield.Max.Hint"
                    })
                }),
                speed: new NumberField({
                    initial: 1,
                    integer: true,
                    min: 0,
                    label: "IMPERIUMNIHILUS.Ship.Speed.Label",
                    hint: "IMPERIUMNIHILUS.Ship.Speed.Hint"
                }),
                capacity: new NumberField({
                    initial: 20,
                    integer: true,
                    min: 0,
                    label: "IMPERIUMNIHILUS.Ship.CargoCapacity.Label",
                    hint: "IMPERIUMNIHILUS.Ship.CargoCapacity.Hint"
                })
            }),

            // 组件槽位
            componentSlots: new SchemaField({
                max: new NumberField({
                    initial: 3,
                    integer: true,
                    min: 0,
                    label: "IMPERIUMNIHILUS.Ship.ComponentSlots.Max.Label",
                    hint: "IMPERIUMNIHILUS.Ship.ComponentSlots.Max.Hint"
                }),
                used: new NumberField({
                    initial: 0,
                    integer: true,
                    min: 0,
                    label: "IMPERIUMNIHILUS.Ship.UsedComponents.Label",
                    hint: "IMPERIUMNIHILUS.Ship.UsedComponents.Hint"
                })
            })
        };
    }

    prepareDerivedData() {
        // 确保已用槽位不超过最大值
        this.componentSlots.used = Math.min(
            this.componentSlots.used,
            this.componentSlots.max
        );
    }
}