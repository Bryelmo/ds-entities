export default {
	kind: 'collectionType',
	collectionName: 'regions',
	info: {
		singularName: 'region',
		pluralName: 'regions',
		displayName: 'Regions',
		description: 'Region type entity for contain Block entities',
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
		i18n: {
			localized: false
		}
	},
	attributes: {
		Label: {
			type: 'string',
			required: true,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Name: {
			type: 'string',
			required: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Default: {
			type: 'boolean',
			required: false,
			default: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			}
		},
	}
};