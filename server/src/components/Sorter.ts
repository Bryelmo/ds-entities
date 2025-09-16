const collectionName:string = 'components_dsentities_sorter';
const info = { displayName: 'Sorter', icon: 'arrowDown' };
const attributes = {
	Sort: { type: 'enumeration', default: 'Desc', enum: [ 'Asc', 'Desc' ] },
	Property: { type: 'string', default: 'createdAt', "required": true }
};
const filename: string = 'sorter.json';

export default {
	collectionName: collectionName,
	category: 'dsentities',
	modelName: 'sorter',
	modelType: 'component',
	globalId: 'ComponentDSEntitiesSorter',
	uid: 'dsentities.sorter',
	info: info,
	attributes: attributes,
	__filename__: filename,
	__schema__: {
		collectionName: collectionName,
		info: info,
		options: {},
		attributes: attributes,
		__filename__: filename,
	}
}
