import * as React from 'react';
import { Flex, Table, Tbody, Td, Th, Thead, Tr, Typography, VisuallyHidden, Dialog } from '@strapi/design-system';
import { ConfirmDialog, useAPIErrorHandler, useNotification } from '@strapi/admin/strapi-admin';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';
import { TypeEntity } from '../../../src/models/Type';
import { IconButton } from '@strapi/design-system';
import { Pencil, Plus, Trash, WarningCircle } from '@strapi/icons';
import { TFooter } from '@strapi/design-system';
import { DSEntityTypes } from '../../../src/models/Entities';
import { EntityTypeModal } from './EntityTypeModal';
import nodeTypeRequests from '../api/Type';
import regionEntityRequests from '../api/Region';
import { RegionEntity } from '../../../src/models/Region';


/* -------------------------------------------------------------------------------------------------
 * EntityTypeTable
 * -----------------------------------------------------------------------------------------------*/

type EntityTypeTableProps = {
	entityTypes: TypeEntity[] | RegionEntity[];
	type: DSEntityTypes;
	canDelete?: boolean;
	canUpdate?: boolean;
	onDeleteEntityType: (entityType: TypeEntity | RegionEntity) => void;
	onEditEntityType: (entityType: TypeEntity | RegionEntity) => void;
};

const EntityTypeTable = (props: EntityTypeTableProps) => {

	const { entityTypes, type, canDelete, canUpdate, onDeleteEntityType, onEditEntityType } = props;
	const defaultEntityValue: TypeEntity | RegionEntity = type !== DSEntityTypes.REGION ? { Reference: type } as TypeEntity : {} as RegionEntity;
	
	const { formatMessage } = useIntl();
	const labelTableTh: string = formatMessage({ id: getTranslation('Dashboard.table.row.label'), defaultMessage: 'LABEL' });
	const nameTableTh: string = formatMessage({ id: getTranslation('Dashboard.table.row.name'), defaultMessage: 'NAME' });
	const entityEditAction: string = formatMessage({ id: getTranslation('Dashboard.nodetype.actions.edit'), defaultMessage: 'Edit' });
	const entityDeleteAction: string = formatMessage({ id: getTranslation('Dashboard.nodetype.actions.delete'), defaultMessage: 'Delete' });
	const entityAddAction: string = formatMessage({ id: 'Dashboard.nodetype.actions.add', defaultMessage: 'Add new type' });
	const endityDeleteActionSuccess: string = formatMessage({ id: getTranslation('EntityModal.delete.success'), defaultMessage: 'Deleted entity type' });
	const editActionError: string = formatMessage({ id: getTranslation('EntityModal.edit.error'), defaultMessage: 'An error occurred, please try again' });

	const { toggleNotification } = useNotification();
	const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
	const [entityType, setEntityType] = React.useState<TypeEntity | RegionEntity>(defaultEntityValue);
	const [edit, setEdit] = React.useState(false);
	const [openDialog, setOpenDialog] = React.useState(false);
	const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);


	React.useEffect(() => {
		!openDialog && setEdit(false)
		!openDialog && setEntityType({} as TypeEntity);
	}, [openDialog])

	const deleteEntity = async (documentId: string) => {
		try {
			const res = type !== DSEntityTypes.REGION ? await nodeTypeRequests.delete(documentId) : await regionEntityRequests.delete(documentId);
			if ('error' in res) {
				toggleNotification({ type: 'danger', message: formatAPIError(res.error as any) });
				return;
			}
			toggleNotification({ type: 'success', message: endityDeleteActionSuccess });
			setOpenConfirmDialog(false);
			onDeleteEntityType && onDeleteEntityType(entityType);
			setEntityType({} as TypeEntity);

		} catch (err) { toggleNotification({ type: 'danger', message: editActionError, }) }
	}

	const editEntityTypeButton = (entity: TypeEntity | RegionEntity): React.ReactNode => (
		<IconButton
			onClick={() => { setEntityType(entity); setEdit(true); setOpenDialog(true) }}
			label={entityEditAction}
			variant="ghost">
			<Pencil />
		</IconButton>
	)
	
	const deleteEntityTypeButton = (entity: TypeEntity | RegionEntity): React.ReactNode => (
		<Dialog.Root open={openConfirmDialog && entity.documentId === entityType.documentId} onOpenChange={setOpenConfirmDialog}>
			<Dialog.Trigger>
				<IconButton onClick={() => { setEntityType(entity); }} label={entityDeleteAction} variant="ghost">
					<Trash />
				</IconButton>
			</Dialog.Trigger>
			<ConfirmDialog
				icon={<WarningCircle />}
				variant="ghost"
				onConfirm={(e) => { deleteEntity(entityType.documentId) }} />
		</Dialog.Root>
	)

	const addEntityTypeButton = (): React.ReactNode => (
		<>
			<TFooter onClick={() => setOpenDialog(true)} icon={<Plus />}>
				{entityAddAction}
			</TFooter>
			<EntityTypeModal
				entity={entityType}
				type={type}
				edit={edit}
				open={openDialog}
				onOpenChange={setOpenDialog}
				onSubmit={onEditEntityType} />
		</>
	)

	const renderEntityTypes = (): React.ReactNode => (
		(entityTypes as TypeEntity[])?.map((entityType) => (
			<React.Fragment key={entityType.id}>
				<Tr>
					<Td><Typography textColor="neutral800">{entityType.Label}</Typography></Td>
					<Td><Typography textColor="neutral800">{entityType.Name}</Typography></Td>
					<Td>
						<Flex gap={1} justifyContent="flex-end" onClick={(e: any) => e.stopPropagation()}>
							{canUpdate && !entityType.Default && editEntityTypeButton(entityType)}
							{canDelete && !entityType.Default && deleteEntityTypeButton(entityType)}
						</Flex>
					</Td>
				</Tr>
			</React.Fragment>
		))
	)
	
	const renderRegionTypes = (): React.ReactNode => (
		(entityTypes as RegionEntity[])?.map((entityType) => (
			<React.Fragment key={entityType.id}>
				<Tr>
					<Td><Typography textColor="neutral800">{entityType.Label}</Typography></Td>
					<Td><Typography textColor="neutral800">{entityType.Name}</Typography></Td>
					<Td>
						<Flex gap={1} justifyContent="flex-end" onClick={(e: any) => e.stopPropagation()}>
							{canUpdate && !entityType.Default && editEntityTypeButton(entityType)}
							{canDelete && !entityType.Default && deleteEntityTypeButton(entityType)}
						</Flex>
					</Td>
				</Tr>
			</React.Fragment>
		))
	)

	return (
		<Table colCount={6} rowCount={entityTypes.length + 1} footer={addEntityTypeButton()}>
			<Thead>
				<Tr>
					<Th><Typography variant="sigma" textColor="neutral600">{labelTableTh}</Typography></Th>
					<Th><Typography variant="sigma" textColor="neutral600">{nameTableTh}</Typography></Th>
					<Th><VisuallyHidden>Actions</VisuallyHidden></Th>
				</Tr>
			</Thead>
			<Tbody>
				{ type !== DSEntityTypes.REGION ? renderEntityTypes() : renderRegionTypes() }
			</Tbody>
		</Table>
	);
};

export { EntityTypeTable };
export type { EntityTypeTableProps };