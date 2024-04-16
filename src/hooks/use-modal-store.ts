import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

export enum ModalEnum {
  CreateServer = 'createServer',
  ServerImage = 'serverImage',
  Invite = 'invite',
  EditServer = 'editServer',
  Members = 'members',
  CreateChannel = 'createChannel',
  LeaveServer = 'leaveServer',
  DeleteServer = 'deleteServer',
  DeleteChannel = 'deleteChannel',
  EditChannel = 'editChannel',
  MessageFile = 'messageFile',
}

export type ModalType =
  | ModalEnum.CreateServer
  | ModalEnum.ServerImage
  | ModalEnum.Invite
  | ModalEnum.EditServer
  | ModalEnum.Members
  | ModalEnum.CreateChannel
  | ModalEnum.LeaveServer
  | ModalEnum.DeleteServer
  | ModalEnum.DeleteChannel
  | ModalEnum.EditChannel
  | ModalEnum.MessageFile;

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType? : ChannelType;
  apiUrl?: string;
  query?: Record<string, any>
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
