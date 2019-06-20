export const zeroPad = (num: number) => {
    let string = String(num)
    let idxOf = string.indexOf('.')
    if (idxOf < 0) {
        idxOf = string.length
        string += '.'
    }
    let diff = string.length - idxOf
    while (diff < 3) {

        diff++
        string += '0'
    }
    return string
}

export const compare = (val1: number, val2: number) => {
    if (val1 > val2) return 'success'
    if (val2 > val1) return 'danger'
    return 'grey'
}

export const round = (num: number) => {
    const rounded = Math.round(num * 100) / 100
    return rounded
}