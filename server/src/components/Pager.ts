const collectionName:string = 'components_dsentities_pager';
const info = { displayName: 'Pager', icon: 'book' };
const attributes = {
	Enable: { type: 'boolean', default: false },
	ItemsPerPage: { type: 'integer', default: 9, pluginOptions: { i18n: { localized: false } } }
};
const filename: string = 'pager.json';

export default {
	collectionName: collectionName,
	category: 'dsentities',
	modelName: 'pager',
	modelType: 'component',
	globalId: 'ComponentDSEntitiesPager',
	uid: 'dsentities.pager',
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
