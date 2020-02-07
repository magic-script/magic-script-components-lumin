class NativePlaneDetector {
    startDetecting(configuration) {
        // configuration sample: { planeType: ["horizontal", "vertical"] }
    }

    stopDetecting(observer) {

    }

    getAllPlanes(configuration, callback) {
        // configuration sample: { planeType: ["horizontal", "vertical"] }
    }

    reset() {

    }

    requestPlaneCast(configuration, callback) {
        // configuration sample: { planeType: "vertical", rayCastParameters: {...}] }
    }

    // callbacks registration
    addOnPlaneDetectedObserver(observer, observerCallback) {
        // observerCallback sample data: Plane: { normal: [x, y, z], center: [x, y, z], vertices: [[x, y, z]], id: UUID, type: [String] }
    }

    addOnPlaneUpdatedObserver(observer, observerCallback) {
        // observerCallback sample data: Plane: { normal: [x, y, z], center: [x, y, z], vertices: [[x, y, z]], id: UUID, type: [String] }
    }

    addOnPlaneRemovedObserver(observer, observerCallback) {
        // observerCallback sample data: Plane: { normal: [x, y, z], center: [x, y, z], vertices: [[x, y, z]], id: UUID, type: [String] }
    }

    addOnPlaneTappedObserver(observer, observerCallback) {
        // observerCallback sample data: Plane: { normal: [x, y, z], center: [x, y, z], vertices: [[x, y, z]], id: UUID, type: [String], point: [x, y, z]}
    }
}

export { NativePlaneDetector };