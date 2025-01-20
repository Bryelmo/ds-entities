import { useNotification, Form, FormHelpers, FormValues } from '@strapi/admin/strapi-admin';
import { Box, Button, Divider, Flex, Modal, Tabs, Typography, useId, } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';
import { BaseForm, SubmitButton } from './BaseForm';
import nodeTypeRequests from '../api/Type';
import { TypeEntity } from '../../../src/models/Type';
import { DSEntityTypes } from '../../../src/models/Entities';
import regionEntityRequests from '../api/Region';
import { RegionEntity } from '../../../src/models/Region';

interface ModalProps {
	entity?: TypeEntity | RegionEntity,
	type: DSEntityTypes,
	edit: boolean,
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (entity: TypeEntity) => void;
}

const EntityTypeModal = ({ entity, type, edit, open, onOpenChange, onSubmit }: ModalProps) => {

	const { toggleNotification } = useNotification();

	const { formatMessage } = useIntl();
	const titleId = useId();
	const createTitle: string = formatMessage({ id: getTranslation('EntityModal.create.title'), defaultMessage: 'Create entity type' });
	const editTitle: string = formatMessage({ id: getTranslation('EntityModal.edit.title'), defaultMessage: 'Update entity type' });
	const tabTitle: string = formatMessage({ id: getTranslation('EntityModal.modal.title'), defaultMessage: 'Configuration' });
	const tab1Title: string = formatMessage({ id: getTranslation('EntityModal.modal.tab1'), defaultMessage: 'Main Settings' });
	const editActionSuccess: string = formatMessage({ id: getTranslation('EntityModal.edit.success'), defaultMessage: 'Updated entity type' });
	const editActionError: string = formatMessage({ id: getTranslation('EntityModal.edit.error'), defaultMessage: 'An error occurred, please try again' });
	const editActionCancel: string = formatMessage({ id: 'Dashboard.nodetype.actions.cancel', defaultMessage: 'Cancel' });

	const handleSubmit = async (values: FormValues, helpers: FormHelpers<FormValues>): Promise<void> => {

		const data: Partial<TypeEntity> = type !== DSEntityTypes.REGION ? { ...values, Reference: type as DSEntityTypes } : values;
		
		try {
			const update = type !== DSEntityTypes.REGION ? nodeTypeRequests.update(data) : regionEntityRequests.update(data);
			const create = type !== DSEntityTypes.REGION ? nodeTypeRequests.create(data) : regionEntityRequests.create(data);
			const res = edit ? await update : await create;

			onSubmit && onSubmit(data as TypeEntity);
			toggleNotification({ type: 'success', message: editActionSuccess });
			onOpenChange(false);

		} catch (err) {
			toggleNotification({ type: 'danger', message: editActionError });
		}
	};

	return (
		<Modal.Root open={open} onOpenChange={onOpenChange}>
			<Modal.Content>
				<Form method="POST" onSubmit={handleSubmit} initialValues={entity}>
					<Modal.Header>
						<Modal.Title>{ edit ? editTitle : createTitle }</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Tabs.Root variant="simple" defaultValue="basic">
							<Flex justifyContent="space-between">
								<Typography tag="h2" variant="beta" id={titleId}>{tabTitle}</Typography>
								<Tabs.List aria-labelledby={titleId}>
									<Tabs.Trigger value="basic">{tab1Title}</Tabs.Trigger>
								</Tabs.List>
							</Flex>
							<Divider />
							<Box paddingTop={7} paddingBottom={7}>
								<Tabs.Content value="basic">
									<BaseForm mode="create" />
								</Tabs.Content>
							</Box>
						</Tabs.Root>
					</Modal.Body>
					<Modal.Footer>
						<Modal.Close>
							<Button variant="tertiary">{editActionCancel}</Button>
						</Modal.Close>
						<SubmitButton />
					</Modal.Footer>
				</Form>
			</Modal.Content>
		</Modal.Root>
	);
};

export { EntityTypeModal };