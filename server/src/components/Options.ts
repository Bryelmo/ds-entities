const collectionName:string = 'components_dsentities_options';
const info = { displayName: 'Options', icon: 'cog' };
const attributes = {
	Pager: { type: 'component', repeatable: false, component: 'dsentities.pager' },
	Sorting: { type: 'component', repeatable: false, component: 'dsentities.sorter' }
};
const filename: string = 'options.json';

export default {
	collectionName: collectionName,
	category: 'dsentities',
	modelName: 'options',
	modelType: 'component',
	globalId: 'ComponentDSEntitiesOptions',
	uid: 'dsentities.options',
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
