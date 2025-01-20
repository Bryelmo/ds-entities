import { DSEntityTypes } from "../../../src/models/Entities";

export default {
	kind: 'collectionType',
	collectionName: 'entitytypes',
	info: {
		singularName: 'entitytype',
		pluralName: 'entitytypes',
		displayName: 'Types',
		description: 'Entity Types',
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
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			type: 'string',
			required: false
		},
		Default: {
			type: 'boolean',
			required: false,
			default: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Reference: {
			type: 'enumeration',
			enum: [DSEntityTypes.BLOCK, DSEntityTypes.NODE, DSEntityTypes.VIEW],
			required: true,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		}
	}
};