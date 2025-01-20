export default {
	kind: 'collectionType',
	collectionName: 'tags',
	info: {
		singularName: 'tag',
		pluralName: 'tags',
		displayName: 'Tags',
		description: 'Tag type entity for tagging entities',
	},
	options: {
		draftAndPublish: false,
	},
	pluginOptions: {
		'content-manager': {
			visible: true,
		},
		'content-type-builder': {
			visible: true,
		},
		'users-permissions': {
			visible: true
		},
	},
	attributes: {
		Name: {
			type: 'string',
			required: true,
			pluginOptions: {
				i18n: {
					localized: true
				}
			}
		}
	}
};