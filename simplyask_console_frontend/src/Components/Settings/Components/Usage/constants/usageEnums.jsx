export const billingUsageItemPrice = {
  EXECUTED_WORKFLOW_STEPS: 'EXECUTED_WORKFLOW_STEPS',
  SENT_OUTBOUND_EMAILS: 'SENT_OUTBOUND_EMAILS',
  SENT_OUTBOUND_SMS: 'SENT_OUTBOUND_SMS',
  ACTIVE_PHONE_NUMBERS: 'ACTIVE_PHONE_NUMBERS',
  SHARED_FILE_STORAGE: 'SHARED_FILE_STORAGE',
  ACTIVE_USER_COUNT: 'ACTIVE_USER_COUNT',
  HANDLED_CALL_MINUTES: 'HANDLED_CALL_MINUTES',
  RECEIVED_CHAT_MESSAGES: 'RECEIVED_CHAT_MESSAGES',
};

export const usageLimitKeyMapping = {
  [billingUsageItemPrice.EXECUTED_WORKFLOW_STEPS]: 'WorkflowTaskExecutions',
  [billingUsageItemPrice.SENT_OUTBOUND_EMAILS]: 'OutboundEmails',
  [billingUsageItemPrice.SENT_OUTBOUND_SMS]: 'MessageHistoryStorage',
  [billingUsageItemPrice.ACTIVE_PHONE_NUMBERS]: 'PhoneNumbers',
  [billingUsageItemPrice.SHARED_FILE_STORAGE]: 'FileStorageGb',
  [billingUsageItemPrice.ACTIVE_USER_COUNT]: 'Users',
  [billingUsageItemPrice.HANDLED_CALL_MINUTES]: { iva: 'IVAHandledCallMinutes', transferred: 'TransferredCallMinutes' },
  [billingUsageItemPrice.RECEIVED_CHAT_MESSAGES]: { iva: 'IVAHandledChatMessages', transferred: 'TransferredChatMessages' },
};
