import { DSEntities } from '../../../src/models/Entities';

const collectionName:string = 'components_dsentities_view';
const info = { displayName: 'View', icon: 'eye' };
const attributes = {
	Nodes: { type: 'relation', relation: 'oneToMany', target: DSEntities.NODE, pluginOptions: { i18n: { localized: false } } },
	NodeTypes: { type: 'relation', relation: 'oneToMany', target: DSEntities.TYPE, pluginOptions: { i18n: { localized: false } } }
};
const filename: string = 'view.json';

export default {
	collectionName: collectionName,
	category: 'dsentities',
	modelName: 'view',
	modelType: 'component',
	globalId: 'ComponentDSEntitiesView',
	uid: 'dsentities.view',
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
