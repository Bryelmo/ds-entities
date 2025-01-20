import { DSEntities } from '../../../src/models/Entities';

const collectionName: string = 'components_dsentities_references';
const info = { displayName: 'References', icon: 'bulletList' };
const attributes = {
	Nodes: { type: 'relation', relation: 'oneToMany', target: DSEntities.NODE, pluginOptions: { i18n: { localized: false } } },
	NodeTypes: { type: 'relation', relation: 'oneToMany', target: DSEntities.TYPE, pluginOptions: { i18n: { localized: false } } },
	Tags: { type: 'relation', relation: 'oneToMany', target: DSEntities.TAG, pluginOptions: { i18n: { localized: false } } }
};
const filename: string = 'references.json';

export default {
	collectionName: collectionName,
	category: 'dsentities',
	modelName: 'references',
	modelType: 'component',
	globalId: 'ComponentDSEntitiesReferences',
	uid: 'dsentities.references',
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