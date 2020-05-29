/* UTILS FOR PROJECT */

export function binarySearch ( arr, value, value_func){
    return do_binarySearch( arr, value, 0, arr.length, value_func)
}

function do_binarySearch ( arr, value, low, high, value_func ){

    if ( high <= low + 1 ){
        if ( arr.length == 0)
            return 0
        if ( value < value_func(arr[low]) )
            return low
        else
            return high;
    }

    let mid = Math.floor( ( high + low )/ 2)
    
    if ( value_func(arr [mid]) <= value )
        return do_binarySearch(arr, value, mid, high, value_func)
    else
        return do_binarySearch(arr, value, low, mid, value_func)

}

export function swapValues ( arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]]
}

export function newArray ( size, value : number [] ) {
    let arr = []
    for ( let i = 0 ; i < size ; i ++ )
        arr.push( [ ... value ] )
    return arr
}

export function forLoop ( start : number, increment : number, end : number, def : any, call : any ) : any {

    for ( let i = start; i != end ; i += increment){
        let val = call ( i )
        if ( val != undefined ) return val
    }

    return def

}
