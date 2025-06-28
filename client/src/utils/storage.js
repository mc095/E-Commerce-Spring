export const getUserEmail = () => localStorage.getItem('userEmail');

export const saveDeliveryDetails = (details) =>
  localStorage.setItem('deliveryDetails', JSON.stringify(details));

export const getDeliveryDetails = () => {
  const details = localStorage.getItem('deliveryDetails');
  return details ? JSON.parse(details) : null;
};

export const saveInvoice = (invoice) =>
  localStorage.setItem('invoice', JSON.stringify(invoice));

export const getInvoice = () => {
  const invoice = localStorage.getItem('invoice');
  return invoice ? JSON.parse(invoice) : null;
};
