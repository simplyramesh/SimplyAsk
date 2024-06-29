import { useState } from 'react';
import { toast } from 'react-toastify';

import useToggle from './useToggle';

const useDeleteTicket = () => {
  const [showDeleteBtn, toggleShowDeleteBtn] = useToggle(false);
  const [acceptTerms, toggleAcceptTerms] = useToggle(false);
  const [showDeleteTicketModal, toggleShowDeleteTicketModal] = useToggle(false);
  const [ticketToDelete, setTicketToDelete] = useState('');

  const handleCloseDeleteTicketModal = () => {
    toggleAcceptTerms(false);
    toggleShowDeleteTicketModal(false);
  };

  const handleOpenDeleteTicketModal = (ticketData) => {
    setTicketToDelete(ticketData);
    toggleShowDeleteTicketModal(true);
    toggleShowDeleteBtn();
  };

  const handleDeleteTicket = (callback) => {
    const onDelete = (ticket) => {
      if (!ticket) {
        toast.error('Something went wrong');
        return;
      }

      callback(ticket);
      handleCloseDeleteTicketModal();
    };

    return { onDelete };
  };

  return {

    handleOpenDeleteTicketModal,
    handleCloseDeleteTicketModal,
    handleDeleteTicket,
    showDeleteBtn,
    toggleShowDeleteBtn,
    acceptTerms,
    toggleAcceptTerms,
    showDeleteTicketModal,
    toggleShowDeleteTicketModal,
    ticketToDelete,
    setTicketToDelete,
  };
};

export default useDeleteTicket;
