import { DSEntities } from '../../../src/models/Entities';

const collectionName: string = 'components_dsentities_sections';
const info = { displayName: 'Sections', icon: 'bulletList' };
const attributes = {
	Body: { type: 'blocks' },
	Blocks: { type: 'relation', relation: 'oneToMany', target: DSEntities.BLOCK, pluginOptions: { i18n: { localized: false } } }
};
const filename: string = 'sections.json';

export default {
	collectionName: collectionName,
	category: 'dsentities',
	modelName: 'sections',
	modelType: 'component',
	globalId: 'ComponentDSEntitiesSections',
	uid: 'dsentities.sections',
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