import BlockViewComponent from '../../server/src/components/View';
import BlockReferencesComponent from '../../server/src/components/Reference';
import ViewSectionsComponent from '../../server/src/components/Section';
import ViewPagerComponent from '../../server/src/components/Pager';
import ViewSorterComponent from '../../server/src/components/Sorter';
import ViewOptionsComponent from '../../server/src/components/Options';

export enum ComponentsUids {
	BLOCK_VIEW = 'dsentities.view',
	VIEW_REFERENCES = 'dsentities.references',
	VIEW_SECTIONS = 'dsentities.sections',
	VIEW_PAGER = 'dsentities.pager',
	VIEW_SORTER = 'dsentities.sorter',
	VIEW_OPTIONS = 'dsentities.options',
}

export const ComponentReferences = {
	[ComponentsUids.BLOCK_VIEW]: BlockViewComponent,
	[ComponentsUids.VIEW_REFERENCES]: BlockReferencesComponent,
	[ComponentsUids.VIEW_SECTIONS]: ViewSectionsComponent,
	[ComponentsUids.VIEW_PAGER]: ViewPagerComponent,
	[ComponentsUids.VIEW_SORTER]: ViewSorterComponent,
	[ComponentsUids.VIEW_OPTIONS]: ViewOptionsComponent
}

export enum DSEntitiesReferencesDefaultKeyNames {
	ID = 'id',
	NODES = 'Nodes',
	NODETYPES = 'NodeTypes',
	TAGS = 'Tags'
}

export const DSEntitiesReferencesDefaultKeys:string[] = [
	DSEntitiesReferencesDefaultKeyNames.ID as string,
	DSEntitiesReferencesDefaultKeyNames.NODES as string,
	DSEntitiesReferencesDefaultKeyNames.NODETYPES as string,
	DSEntitiesReferencesDefaultKeyNames.TAGS as string
]