export const us = {
	createService: () => {},
	useService: () => {},
}

export const ro = {
	partial: (target) => {}, // set all properties optional
	required: (target) => {}, // set all properties required

	pick: (target, props) => {}, // pick some properties from target obj
	omit: (target, props) => {}, // omit some properties from target obj

	extract: (...rulesObjects) => {}, // intersection of objects
	merge: (...rulesObjects) => {}, // union of objects

	declareType: (typeName, typeRule) => {},
	declareUnion: (options, args) => {},
	declareIntersection: (options, args) => {}
}
