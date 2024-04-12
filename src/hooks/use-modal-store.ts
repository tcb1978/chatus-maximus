import { Server } from '@prisma/client';
import { create } from 'zustand';

export enum ModalEnum {
  CreateServer = 'createServer',
  Invite = 'invite',
  EditServer = 'editServer',
  Members = 'members',
  CreateChannel = 'createChannel',
}

export type ModalType =
  | ModalEnum.CreateServer
  | ModalEnum.Invite
  | ModalEnum.EditServer
  | ModalEnum.Members
  | ModalEnum.CreateChannel;

interface ModalData {
  server?: Server;
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
