export default function SystemDocumentMixin(Base) {
    class SystemDocument extends SystemFlagsMixin(Base) {
        get _systemFlagsDataModel() {
            return this.system?.metadata?.systemFlagsModel ?? null;
        }
    }
    return SystemDocument;
}