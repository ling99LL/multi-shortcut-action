/**
 * PCB routing conflict modes as stored in the official PCB document source.
 *
 * The source format is a sequence of JSON records.  Older records use
 * `{header}||{data}|`; newer records may use an array record.  Keeping the
 * parser here independent of the EasyEDA runtime makes the document update
 * small, testable, and free of DOM or browser shortcuts.
 */
export const ROUTING_MODE_IGNORE = 0;
export const ROUTING_MODE_PUSH = 1;
export const ROUTING_MODE_SURROUND = 2;
export const ROUTING_MODE_BLOCK = 3;

type JsonObject = Record<string, unknown>;

interface ParsedJsonValue {
	start: number;
	end: number;
	value: unknown;
}

interface RoutingModeTarget {
	start: number;
	end: number;
	body: JsonObject;
	wrap: (body: JsonObject) => unknown;
}

export interface RoutingModeUpdate {
	source: string;
	previousMode: number | undefined;
	nextMode: number;
}

function isJsonObject(value: unknown): value is JsonObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function removeTrailingCommas(value: string): string {
	let normalized = '';
	let inString = false;
	let escaped = false;

	for (let index = 0; index < value.length; index += 1) {
		const character = value[index];

		if (inString) {
			normalized += character;
			if (escaped) {
				escaped = false;
			}
			else if (character === '\\') {
				escaped = true;
			}
			else if (character === '"') {
				inString = false;
			}
			continue;
		}

		if (character === '"') {
			inString = true;
			normalized += character;
			continue;
		}

		if (character === ',') {
			let nextIndex = index + 1;
			while (/\s/.test(value[nextIndex] ?? '')) {
				nextIndex += 1;
			}
			if (value[nextIndex] === '}' || value[nextIndex] === ']') {
				continue;
			}
		}

		normalized += character;
	}

	return normalized;
}

function parseJsonText(value: string): unknown | undefined {
	try {
		return JSON.parse(value) as unknown;
	}
	catch {
		try {
			return JSON.parse(removeTrailingCommas(value)) as unknown;
		}
		catch {
			return undefined;
		}
	}
}

function parseJsonValueAt(source: string, start: number): ParsedJsonValue | undefined {
	const firstCharacter = source[start];
	if (firstCharacter !== '{' && firstCharacter !== '[') {
		return undefined;
	}

	let depth = 0;
	let inString = false;
	let escaped = false;

	for (let index = start; index < source.length; index += 1) {
		const character = source[index];

		if (inString) {
			if (escaped) {
				escaped = false;
			}
			else if (character === '\\') {
				escaped = true;
			}
			else if (character === '"') {
				inString = false;
			}
			continue;
		}

		if (character === '"') {
			inString = true;
		}
		else if (character === '{' || character === '[') {
			depth += 1;
		}
		else if (character === '}' || character === ']') {
			depth -= 1;
			if (depth === 0) {
				const value = parseJsonText(source.slice(start, index + 1));
				if (value === undefined) {
					return undefined;
				}
				return { start, end: index + 1, value };
			}
			if (depth < 0) {
				return undefined;
			}
		}
	}

	return undefined;
}

function skipWhitespace(source: string, start: number): number {
	let index = start;
	while (/\s/.test(source[index] ?? '')) {
		index += 1;
	}
	return index;
}

function getRoutingMode(body: JsonObject): number | undefined {
	const value = body.routingMode;
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}
	if (typeof value === 'string' && value.trim() !== '') {
		const numericValue = Number(value);
		if (Number.isFinite(numericValue)) {
			return numericValue;
		}
	}
	return undefined;
}

function findRoutingModeTarget(source: string): RoutingModeTarget | undefined {
	for (let cursor = 0; cursor < source.length; cursor += 1) {
		const character = source[cursor];
		if (character !== '{' && character !== '[') {
			continue;
		}

		const parsed = parseJsonValueAt(source, cursor);
		if (!parsed) {
			continue;
		}

		if (isJsonObject(parsed.value) && parsed.value.type === 'PREFERENCE') {
			if ('routingMode' in parsed.value) {
				return {
					start: parsed.start,
					end: parsed.end,
					body: parsed.value,
					wrap: body => body,
				};
			}

			let bodyStart = skipWhitespace(source, parsed.end);
			if (source.slice(bodyStart, bodyStart + 2) !== '||') {
				cursor = parsed.end - 1;
				continue;
			}
			bodyStart = skipWhitespace(source, bodyStart + 2);
			const body = parseJsonValueAt(source, bodyStart);
			if (body && isJsonObject(body.value)) {
				return {
					start: body.start,
					end: body.end,
					body: body.value,
					wrap: value => value,
				};
			}
		}

		if (Array.isArray(parsed.value) && parsed.value[0] === 'PREFERENCE' && isJsonObject(parsed.value[1])) {
			const body = parsed.value[1];
			return {
				start: parsed.start,
				end: parsed.end,
				body,
				wrap: (value) => {
					const record = [...parsed.value];
					record[1] = value;
					return record;
				},
			};
		}

		// The parsed value includes nested JSON objects.  Skip them after this
		// inspection so braces inside strings or child records are not treated as
		// separate source records.
		cursor = parsed.end - 1;
	}

	return undefined;
}

/**
 * Toggle the current PCB document's routing mode between block and surround.
 * Other modes (ignore or push) intentionally move to block first.
 */
export function toggleBlockSurroundRoutingModeInSource(source: string): RoutingModeUpdate | undefined {
	const target = findRoutingModeTarget(source);
	if (!target) {
		return undefined;
	}

	const previousMode = getRoutingMode(target.body);
	const nextMode = previousMode === ROUTING_MODE_BLOCK
		? ROUTING_MODE_SURROUND
		: ROUTING_MODE_BLOCK;
	const updatedBody = { ...target.body, routingMode: nextMode };
	const replacement = JSON.stringify(target.wrap(updatedBody));
	if (replacement === undefined) {
		return undefined;
	}

	return {
		source: `${source.slice(0, target.start)}${replacement}${source.slice(target.end)}`,
		previousMode,
		nextMode,
	};
}
