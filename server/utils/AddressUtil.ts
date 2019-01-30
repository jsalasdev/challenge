export let getAddress = (latitude:number, longitude:number, radius:number):number[] => {    
    let kmInLongitudeDegree:number = 111.320 * Math.cos(latitude / 180.0 * Math.PI);
    
    let deltaLat:number = radius / 111.1;
    let deltaLong:number = radius / kmInLongitudeDegree;
    
    let minLat:number = latitude - deltaLat;
    let maxLat:number = latitude + deltaLat;
    let minLong:number = longitude - deltaLong;
    let maxLong:number = longitude + deltaLong;
    
    let address:number[] = [minLat, maxLat, minLong, maxLong];
    return address;
}