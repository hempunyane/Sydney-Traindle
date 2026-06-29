import trainNetwork from "./TrainNetwork";

// 8-point compass, indexed clockwise from North.
// Index matches the convention used by the background train sprites (0 = N).
export const DIRECTION_LABELS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const DIRECTION_NAMES = [
    'North', 'North-East', 'East', 'South-East',
    'South', 'South-West', 'West', 'North-West'
];

// Returns the compass bearing from one station toward another, bucketed into
// one of 8 directions (index 0-7, 0 = North, increasing clockwise).
// Returns null when the bearing is undefined (same station or missing coords).
export function getDirectionIndex(fromStation, toStation) {
    if (fromStation === toStation) return null;

    const a = trainNetwork[fromStation];
    const b = trainNetwork[toStation];
    if (!a || !b || typeof a.lat !== 'number' || typeof b.lat !== 'number') {
        return null;
    }

    const toRad = (deg) => (deg * Math.PI) / 180;
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const dLon = toRad(b.lon - a.lon);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI; // 0 = N, clockwise
    bearing = (bearing + 360) % 360;

    return Math.round(bearing / 45) % 8;
}
