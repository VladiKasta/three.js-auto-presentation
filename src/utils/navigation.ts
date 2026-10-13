export function getNextIndex(current: number, direction: 1 | -1, length: number) {
	if (length <= 0) throw new RangeError('Navigation length must be greater than zero')

	return (current + direction + length) % length
}
