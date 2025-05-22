export function createError(code, message) {
  return {
    code,
    message,
    toString() {
      return `${code}: ${message}`;
    }
  };
}

export const errors = {
  CREATE_PAYMENT_FAILED: {
    code: 1001,
    message: 'Failed to create payment'
  },
  CAPTURE_PAYMENT_FAILED: {
    code: 1002,
    message: 'Failed to capture payment'
  },
  REFUND_PAYMENT_FAILED: {
    code: 1003,
    message: 'Failed to refund payment'
  },
  CANCEL_PAYMENT_FAILED: {
    code: 1004,
    message: 'Failed to cancel payment'
  },
  GET_STATUS_FAILED: {
    code: 1005,
    message: 'Failed to get payment status'
  }
};