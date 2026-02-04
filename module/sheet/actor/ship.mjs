/**
 * 舰船角色表单
 */
export default class ShipActorSheet extends foundry.applications.sheets.ActorSheetV2 {
    /** @override */
    static DEFAULT_OPTIONS = {
        classes: ["starlink", "ship", "vertical-tabs"],
        position: {
            width: 800,
            height: 800
        }
    };

    /** @override */
    static PARTS = {
        header: {
            template: "systems/starlink/templates/actors/ship-header.hbs"
        },
        sidebar: {
            container: { classes: ["main-content"], id: "main" },
            template: "systems/starlink/templates/actors/ship-sidebar.hbs"
        },
        details: {
            classes: ["col-2"],
            container: { classes: ["tab-body"], id: "tabs" },
            template: "systems/starlink/templates/actors/tabs/ship-details.hbs",
            scrollable: [""]
        },
        cargo: {
            container: { classes: ["tab-body"], id: "tabs" },
            template: "systems/starlink/templates/actors/tabs/ship-cargo.hbs",
            templates: [
                "systems/starlink/templates/inventory/inventory.hbs"
            ],
            scrollable: [""]
        },
        components: {
            container: { classes: ["tab-body"], id: "tabs" },
            template: "systems/starlink/templates/actors/tabs/ship-components.hbs",
            scrollable: [""]
        },
        tabs: {
            id: "tabs",
            classes: ["tabs-right"],
            template: "systems/starlink/templates/shared/sidebar-tabs.hbs"
        }
    };

    /** @override */
    static TABS = [
        { tab: "details", label: "STARLINK.Ship.Details", icon: "fas fa-cog" },
        { tab: "cargo", label: "STARLINK.Ship.Cargo", icon: "fas fa-boxes" },
        { tab: "components", label: "STARLINK.Ship.Components", icon: "fas fa-microchip" },
        { tab: "crew", label: "STARLINK.Ship.Crew", icon: "fas fa-users" },
        { tab: "biography", label: "STARLINK.Ship.Biography", icon: "fas fa-book" }
    ];

    /** @override */
    tabGroups = {
        primary: "details"
    };

    /** @inheritDoc */
    async _preparePartContext(partId, context, options) {
        context = await super._preparePartContext(partId, context, options);
        switch ( partId ) {
            case "header": return this._prepareHeaderContext(context, options);
            case "sidebar": return this._prepareSidebarContext(context, options);
            case "details": return this._prepareDetailsContext(context, options);
            case "cargo": return this._prepareCargoContext(context, options);
            case "components": return this._prepareComponentsContext(context, options);
            case "crew": return this._prepareCrewContext(context, options);
            case "biography": return this._prepareBiographyContext(context, options);
            case "tabs": return this._prepareTabsContext(context, options);
            default: return context;
        }
    }

    /**
     * Prepare rendering context for the header.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareHeaderContext(context, options) {
        if ( this.actor.limited ) {
            context.portrait = await this._preparePortrait(context);
            return context;
        }

        context.portrait = await this._preparePortrait(context);

        // Visibility
        context.showDocking = game.user.isGM || (this.actor.isOwner);

        return context;
    }

    /**
     * Prepare rendering context for the sidebar.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareSidebarContext(context, options) {
        const { attributes } = this.actor.system;
        context.portrait = await this._preparePortrait(context);

        // Health Points
        context.hp = {
            value: attributes.hp.value,
            max: attributes.hp.max,
            pct: Math.round((attributes.hp.value / attributes.hp.max) * 100)
        };

        // Shield Points
        context.shield = {
            value: attributes.shield.value,
            max: attributes.shield.max,
            pct: Math.round((attributes.shield.value / attributes.shield.max) * 100)
        };

        // Speed
        context.speed = attributes.speed;

        // Cargo Capacity
        context.capacity = attributes.capacity;

        // Component Slots
        context.componentSlots = {
            used: this.actor.system.componentSlots.used,
            max: this.actor.system.componentSlots.max,
            pct: Math.round((this.actor.system.componentSlots.used / this.actor.system.componentSlots.max) * 100)
        };

        return context;
    }

    /**
     * Prepare rendering context for the details tab.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareDetailsContext(context, options) {
        // Already prepared in sidebar context
        return context;
    }

    /**
     * Prepare rendering context for the cargo tab.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareCargoContext(context, options) {
        context = await super._prepareInventoryContext(context, options);
        context.size = {
            label: game.i18n.localize("STARLINK.Ship.CargoCapacity.Label"),
            abbr: game.i18n.localize("STARLINK.Ship.Cargo"),
            mod: 1
        };
        return context;
    }

    /**
     * Prepare rendering context for the components tab.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareComponentsContext(context, options) {
        // Components would be handled similar to items
        context.components = this.actor.itemTypes.component || [];
        return context;
    }

    /**
     * Prepare rendering context for the crew tab.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareCrewContext(context, options) {
        // Crew members would be handled as linked actors
        context.crew = this.actor.itemTypes.crew || [];
        return context;
    }

    /**
     * Prepare rendering context for the biography tab.
     * @param {ApplicationRenderContext} context  Context being prepared.
     * @param {HandlebarsRenderOptions} options   Options which configure application rendering behavior.
     * @returns {ApplicationRenderContext}
     * @protected
     */
    async _prepareBiographyContext(context, options) {
        const enrichmentOptions = {
            secrets: this.actor.isOwner, relativeTo: this.actor
        };
        context.enriched = {
            label: "STARLINK.Ship.Biography",
            value: await TextEditor.enrichHTML(this.actor.system.biography?.value || "", enrichmentOptions)
        };
        return context;
    }
}
