import { DSEntities, DSEntityTypes } from "../../../src/models/Entities";

export default {
	kind: 'collectionType',
	collectionName: 'nodes',
	info: {
		singularName: 'node',
		pluralName: 'nodes',
		displayName: 'Nodes',
		description: 'Drupal Style Node entity type',
	},
	options: {
		draftAndPublish: true,
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
			localized: true
		}
	},
	attributes: {
		Title: {
			type: 'string',
			pluginOptions: {
				i18n: {
					localized: true
				}
			}
		},
		HideTitle: {
			type: 'boolean',
			required: false,
			default: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Slug: {
			type: 'string',
			pluginOptions: {
				i18n: {
					localized: true
				}
			}
		},
		Type: {
			type: 'relation',
			required: true,
			relation: 'oneToOne',
			target: DSEntities.TYPE,
			pluginOptions: {
				i18n: {
					localized: false
				}
			}
		},
		Entity: {
			type: 'string',
			required: true,
			default: DSEntityTypes.NODE,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Uid: {
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			type: 'string',
			required: false
		},
		Body: {
			pluginOptions: {
				i18n: {
					localized: true
				}
			},
			type: 'blocks',
			required: false
		},
		Tags: {
			type: 'relation',
			relation: 'oneToMany',
			target: DSEntities.TAG,
			pluginOptions: {
				i18n: {
					localized: false
				}
			}
		},
		Image: {
			allowedTypes: ['images'],
			type: 'media',
			multiple: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			}
		}
	}
};