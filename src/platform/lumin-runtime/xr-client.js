import { PCFData } from 'lumin';

class XrClient {

    constructor () {
        this._app = null;
        this._anchors = {};
    }

    /**
     * Starts an XR session.
     *
     * No-op on Lumin.
     */
    async connect(_token) {
        return 'connected';
    }

    /**
     * Polls for list of all PCFs
     *
     * @return async list of PCFs
     */
    async getAllPCFs() {
        if (this._app === null) {
            return [];
        }
        const pcfIds = this._app.getPCFs();
        const pcfs = [];
        pcfIds.forEach(pcfId => {
            const pcf = this._app.getPCFData(pcfId);

            if (pcf.getState() != PCFData.State.kValid) {
                return;
            }

            const anchorId = pcf.getId().toString().slice(1, -1); // strip {}
            const pose = pcf.getTransform();

            const confidence = {
                confidence: pcf.getConfidence(),
                validRadiusM: pcf.getValidRadius(),
                rotationErrDeg: pcf.getRotationErr(),
                translationErrM: pcf.getTranslationErr()
            };

            const pcfData = { anchorId, pose, confidence };

            pcfs.push(pcfData);
        });

        return pcfs;
    }

    /**
     * Returns the current localization status
     *
     * Currently a no-op on Lumin (for now).
     */
    async getLocalizationStatus() {
        return 'localized';
    }

    /**
     * Creates an anchor that can be used to position AR content
     *
     * @param anchorId The unique identifier for this anchor
     * @param position The position of this anchor
     * @return async status string
     */
    async createAnchor(anchorId, pose) {
        this._anchors[anchorId] = pose;
        return true;
    }

    /**
     * Removes the anchor with the given ID.
     *
     * @param anchorId The unique identifier for the anchor to remove
     * @return async status string
     */
    async removeAnchor(anchorId) {
        delete this._anchors[anchorId];
        return true;
    }

    /**
     * Removes all anchors from the scene (that were created via createAnchor)
     *
     * @return async status string
     */
    async removeAllAnchors() {
        this._anchors = {};
        return true;
    }

    setNativeApp(app) {
        this._app = app;
    }

    getAnchorPose(anchorId) {
        return this._anchors[anchorId];
    }
}

export { XrClient };