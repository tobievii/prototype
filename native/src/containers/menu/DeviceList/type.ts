import { LayoutsListItemData } from '../../../../src/components/menu';

export type DeviceData = LayoutsListItemData;

export interface DeviceListContainerData extends DeviceData {
  route: string;
}
