import type { AxiosPromise } from 'axios';
import axiosInstance from './interceptor';
import type { Container, Card, UpdateCardDTO } from './trello-type';

export function getContainers(): AxiosPromise<Container[]> {
  return axiosInstance.get('/containers');
}

export function addContainer(data: { name: string }): AxiosPromise<Container> {
  return axiosInstance.post('/containers', data);
}

export function updateContainer(id: string, data: { name: string }): AxiosPromise<Container> {
  return axiosInstance.patch(`/containers/${id}`, data);
}

export function updateContainerOrder(data: { _id: string; sortIndex: number }[]) {
  return axiosInstance.put('/containers/order', data);
}

export function deleteContainer(id: string) {
  return axiosInstance.delete(`/containers/${id}`);
}

export function addCard(
  data: { title: string },
  params: { containerId: string },
): AxiosPromise<Card> {
  return axiosInstance.post('/cards', data, { params });
}

export function updateCard(id: string, data: UpdateCardDTO): AxiosPromise<Card> {
  return axiosInstance.patch(`/cards/${id}`, data);
}

export function deleteCard(id: string) {
  return axiosInstance.delete(`/cards/${id}`);
}

export function addAttachments(id: string, data: { files: File[] }): AxiosPromise<Card> {
  return axiosInstance.postForm(`/cards/${id}/attachments`, { files: data.files });
}

export function addCoverImage(id: string, data: File): AxiosPromise<Card> {
  return axiosInstance.postForm(`/cards/${id}/cover-image`, { file: data });
}

export function patchCoverImage(id: string, data: { url: string }): AxiosPromise<Card> {
  return axiosInstance.patch(`/cards/${id}/cover-image`, data);
}

export function deleteAttachment(id: string, data: { url: string }): AxiosPromise<Card> {
  return axiosInstance.delete(`/cards/${id}/attachment`, data);
}

export function updateCardOrder(
  containerId: string,
  data: { _id: string; sortIndex: number }[],
): AxiosPromise<void> {
  return axiosInstance.patch(`/cards/order/${containerId}`, data);
}

export function moveCard(
  cardId: string,
  targetContainerId: string,
  data: { newIndex: number },
): AxiosPromise<void> {
  return axiosInstance.patch(`/cards/move/${cardId}/${targetContainerId}`, data);
}
